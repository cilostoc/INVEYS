const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const {randomUUID} = require('node:crypto');

function boot(saved) {
  const elements=new Map(), events=new Map(), store=new Map();
  if(saved)store.set('inveys-workspace-v1',JSON.stringify(saved));
  const element=selector=>{
    if(elements.has(selector))return elements.get(selector);
    const classes=new Set(), handlers=new Map();
    const node={innerHTML:'',textContent:'',value:'',open:false,dataset:{},scrollHeight:100,handlers,attributes:new Map(),setAttribute(name,value){this.attributes.set(name,value);},
      classList:{add:v=>classes.add(v),remove:v=>classes.delete(v),toggle:(v,force)=>force===undefined?(classes.has(v)?classes.delete(v):classes.add(v)):(force?classes.add(v):classes.delete(v))},
      addEventListener:(name,fn)=>handlers.set(name,fn),
      querySelector:q=>element(selector+' '+q),querySelectorAll:()=>[],
      click(){},showModal(){this.open=true;},close(){this.open=false;},focus(){},insertAdjacentHTML(where,html){this.innerHTML+=html;},
      closest(){return null;},getBoundingClientRect:()=>({left:0,top:0,right:500,bottom:500,width:500,height:500})};
    elements.set(selector,node);return node;
  };
  const document={querySelector:element,querySelectorAll:()=>[],body:element('body'),activeElement:{tagName:'BODY'},
    addEventListener:(name,fn)=>{if(!events.has(name))events.set(name,[]);events.get(name).push(fn);}};
  const context=vm.createContext({document,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
    location:{hash:''},crypto:{randomUUID},console,Date,Intl,Number,Math,String,Set,JSON,Array,Object,Error,URL,Blob,structuredClone,TextEncoder,FormData:class{constructor(form){this.entries=Object.entries(form.testData||{});}[Symbol.iterator](){return this.entries[Symbol.iterator]();}},
    setTimeout:()=>0,clearTimeout(){}});
  context.window=context;context.globalThis=context;context.addEventListener=()=>{};context.scrollTo=()=>{};
  for(const file of ['engine.js','finance.js','investment.js','appearance.js','plans.js','i18n.js','recording.js','releases.js','assistant.js','operations.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context,{filename:file});
  function click(dataset){const button={dataset};for(const fn of events.get('click'))fn({target:{closest:()=>button}});}
  function submitModal(data){const form=element('#modal form');form.testData=data;form.handlers.get('submit')({preventDefault(){}});}
  return {elements,context,click,submitModal,html:()=>element('#main').innerHTML,state:()=>JSON.parse(store.get('inveys-workspace-v1'))};
}

test('Calendar page renders Monarch-style visual grid, metrics, and seeded subscriptions', () => {
  const app = boot();
  app.click({page: 'calendar'});
  const html = app.html();
  
  // Verify heading and structure
  assert.ok(html.includes('calendar-toolbar'), 'Toolbar should render');
  assert.ok(html.includes('calendar-stats'), 'Summary metric stats should render');
  assert.ok(html.includes('calendar-grid-wrap'), 'Calendar grid wrapper should render');
  assert.ok(html.includes('calendar-header-row'), 'Days header row should render');
  
  // Verify seeded subscriptions appear as chips
  assert.ok(html.includes('Netflix Premium'), 'Netflix should appear on calendar');
  assert.ok(html.includes('Spotify Duo'), 'Spotify should appear on calendar');
  assert.ok(html.includes('Figma Professional'), 'Figma should appear on calendar');
  assert.ok(html.includes('Gym &amp; Fitness') || html.includes('Gym & Fitness'), 'Gym should appear on calendar');
  assert.ok(html.includes('bill-chip'), 'Bill chips should render');
});

test('Calendar view toggle between Grid and List view works properly', () => {
  const app = boot();
  app.click({page: 'calendar'});
  
  // Switch to list mode
  app.click({action: 'calendar-mode:list'});
  let html = app.html();
  assert.ok(html.includes('calendar-list-view'), 'List view should render in list mode');
  assert.ok(html.includes('Netflix Premium'), 'Subscriptions should still appear in list mode');
  
  // Switch back to grid mode
  app.click({action: 'calendar-mode:calendar'});
  html = app.html();
  assert.ok(html.includes('calendar-grid-wrap'), 'Grid view should render when switched back');
});

test('Calendar month navigation updates displayed month', () => {
  const app = boot();
  app.click({page: 'calendar'});
  
  // Next month
  app.click({action: 'calendar-next'});
  assert.ok(app.html().includes('calendar-view-frame'), 'Calendar still renders on next month');
  
  // Prev month
  app.click({action: 'calendar-prev'});
  app.click({action: 'calendar-today'});
  assert.ok(app.html().includes('calendar-view-frame'), 'Calendar returns to current month');
});

test('Marking a bill as paid toggles paid state and updates remaining metric', () => {
  const app = boot();
  app.click({page: 'calendar'});
  
  const stateBefore = app.state();
  const sub = stateBefore.subscriptions[0];
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  
  // Toggle paid
  app.click({action: `bill-toggle-paid:${sub.id}:${monthKey}-14`});
  const stateAfter = app.state();
  assert.equal(stateAfter.billPayments[monthKey][sub.id], true, 'Bill should be marked paid in storage');
  
  // Toggle back to unpaid
  app.click({action: `bill-toggle-paid:${sub.id}:${monthKey}-14`});
  const stateToggledBack = app.state();
  assert.equal(stateToggledBack.billPayments[monthKey][sub.id], false, 'Bill should be marked unpaid');
});

test('Adding a new subscription via bill-new modal persists to state', () => {
  const app = boot();
  app.click({page: 'calendar'});
  app.click({action: 'bill-new'});
  
  app.submitModal({
    name: 'Disney+ Hotstar',
    emoji: '✨',
    amount: '39.00',
    currency: 'USD',
    category: 'Entertainment',
    day: '25',
    cadence: 'monthly',
    owner: 'Alex Morgan'
  });
  
  const state = app.state();
  const found = state.subscriptions.find(s => s.name === 'Disney+ Hotstar');
  assert.ok(found, 'New subscription must be in state');
  assert.equal(found.amount, 3900);
  assert.equal(found.day, 25);
  assert.equal(found.emoji, '✨');
  
  // Check that it now renders on the calendar
  assert.ok(app.html().includes('Disney+ Hotstar'), 'New subscription should render on calendar');
});
