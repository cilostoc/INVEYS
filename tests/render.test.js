// Render-level smoke checks in a minimal DOM adapter. These do not replace
// real-browser layout and interaction checks in browser.cjs.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const {randomUUID} = require('node:crypto');

function boot(saved, env = {}) {
  const elements=new Map(), events=new Map(), store=new Map();
  if(saved)store.set('inveys-workspace-v1',JSON.stringify(saved));
  const element=selector=>{
    if(elements.has(selector))return elements.get(selector);
    const classes=new Set(), handlers=new Map();
    const node={innerHTML:'',textContent:'',value:'',open:false,dataset:{},style:{},scrollHeight:100,handlers,attributes:new Map(),setAttribute(name,value){this.attributes.set(name,value);},
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
    sessionStorage:{getItem:k=>store.get('sess_'+k)||null,setItem:(k,v)=>store.set('sess_'+k,v),removeItem:k=>store.delete('sess_'+k)},
    location:{hash:''},crypto:{randomUUID},console,Date,Intl,Number,Math,String,Set,JSON,Array,Object,Error,URL,Blob,structuredClone,TextEncoder,
    __INVEYS_SERVER_MODE__: env.isServerMode || false,
    __INVEYS_CURRENT_USER__: env.currentUser || null,
    FormData:class{constructor(form){this.entries=Object.entries(form.testData||{});}[Symbol.iterator](){return this.entries[Symbol.iterator]();}},
    setTimeout:()=>0,clearTimeout(){}});
  context.window=context;context.globalThis=context;context.addEventListener=()=>{};context.scrollTo=()=>{};
  for(const file of ['engine.js','finance.js','investment.js','appearance.js','plans.js','i18n.js','recording.js','releases.js','assistant.js','operations.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..','src',file),'utf8'),context,{filename:file});
  element('#language-switch').value='en';element('#language-switch').handlers.get('change')();
  function click(dataset){const button={dataset};for(const fn of events.get('click'))fn({target:{closest:()=>button}});}
  function input(id,value,dataset={}){element('#'+id).value=value;for(const fn of events.get('input'))fn({target:{id,value,dataset}});}
  function submitModal(data){const form=element('#modal form');form.testData=data;form.handlers.get('submit')({preventDefault(){}});}
  function changeControl(id,value){const el=element('#'+id);el.value=value;el.handlers.get('change')();}
  function submitMonteCarlo(data){const el=element('#mc-form');el.id='mc-form';el.testData=data;for(const fn of events.get('submit'))fn({target:el,preventDefault(){}});}
  function clickControl(id){element('#'+id).handlers.get('click')();}
  const changeField=(id,value,checked=false)=>{for(const fn of events.get('change'))fn({target:{id,value,checked,dataset:{}}});};const submitPage=(id,data)=>{const el=element('#'+id);el.id=id;el.testData=data;for(const fn of events.get('submit'))fn({target:el,preventDefault(){}});};
  return {chartPointer:(name,x,type='mouse')=>{const svg=element('#holdings-chart');for(const fn of events.get(name)||[])fn({target:{id:'holdings-chart',closest:()=>svg},clientX:x,pointerType:type,relatedTarget:null});},chartKey:key=>{for(const fn of events.get('keydown'))fn({target:{id:'holdings-chart'},key,preventDefault(){}});},benchmark:(id,checked)=>{for(const fn of events.get('change'))fn({target:{id:'',dataset:{investmentBenchmark:id},checked}});},outside:()=>{const event={target:{id:'outside',closest:()=>null}};for(const fn of events.get('pointerdown')||[])fn(event);for(const fn of events.get('click'))fn(event);},chooseQuickFile:(file,id='quick-upload-file')=>{for(const fn of events.get('change'))fn({target:{id,files:[file],dataset:{}}});},quickKey:(value,extra={})=>{for(const fn of events.get('keydown'))fn({target:{id:'quick-text',value},key:'Enter',preventDefault(){},...extra});},keyDown:key=>{for(const fn of events.get('keydown'))fn({key,preventDefault(){}});},changeField,submitPage,elements,context,click,input,submitModal,changeControl,submitMonteCarlo,clickControl,changeDraft:(index,key,value,type='text')=>{for(const fn of events.get('change'))fn({target:{id:'',dataset:{draft:String(index),key},value,type,checked:!!value}});},html:()=>element('#main').innerHTML,state:()=>JSON.parse(store.get('inveys-workspace-v1'))};
}
test('every app page renders with populated and empty workspaces',()=>{
  const full=boot();assert.match(full.html(),/224,370/);
  const empty={version:1,currency:'IDR',name:'Empty',demo:false,accounts:[],debts:[],goals:[],flows:[],transactions:[],tasks:[],members:[],history:[]};
  for(const app of [full,boot(empty)])for(const page of ['accounts','cashflow','transactions','goals','debt','scenarios','household','copilot','montecarlo','cards','settings','home']){
    app.click({page});assert.ok(app.html().includes('page-heading'),page);
  }
});
test('scenario input changes visible calculations without persisting changes to actual records',()=>{
  const app=boot();app.click({page:'scenarios'});const initial=JSON.stringify(app.state());
  const before=app.elements.get('#scenario-summary').innerHTML;
  app.input('oneTime','50000',{scenario:'oneTime'});
  assert.notEqual(app.elements.get('#scenario-summary').innerHTML,before);
  assert.match(app.elements.get('#scenario-outcome').innerHTML,/shortfall/);
  assert.equal(JSON.stringify(app.state()),initial);
});
test('copilot escapes arbitrary user text and exposes supported local evidence',()=>{
  const app=boot();app.click({page:'copilot'});
  app.click({question:'What is my financial position?'});
  assert.match(app.elements.get('#chat-messages').innerHTML,/manual balance snapshots/);
  app.click({question:'<img src=x onerror=alert(1)>'});
  const html=app.elements.get('#chat-messages').innerHTML;
  assert.ok(!html.includes('<img'));
  assert.match(html,/&lt;img/);
});
test('debt sliders recompute interest savings',()=>{
  const app=boot();app.click({page:'debt'});
  app.input('debt-extra-d3','500',{debtId:'d3'});
  assert.match(app.elements.get('#debt-results-d3').innerHTML,/5 months/);
});

test('owner editor updates greeting, profile and matching ownership labels',()=>{
  const app=boot();app.click({action:'owner-edit'});app.submitModal({name:'Madison Martin'});
  assert.equal(app.state().members[0].name,'Madison Martin');assert.equal(app.state().accounts[0].owner,'Madison');
  assert.equal(app.state().cards[0].owner,'Madison Martin');assert.match(app.html(),/Madison/);
});
test('language and reporting currency switches preserve native financial records',()=>{
  const app=boot(),native=app.state().accounts.map(a=>a.balance);
  app.changeControl('language-switch','id');assert.equal(app.state().language,'id');
  app.changeControl('currency-switch','IDR');assert.equal(app.state().currency,'IDR');
  assert.deepEqual(app.state().accounts.map(a=>a.balance),native);
  assert.equal(app.state().accounts[0].currency,'USD');assert.match(app.html(),/Rp/);
});
test('multi-currency account entry is retained and appears in the reporting total',()=>{
  const app=boot();app.click({action:'account-new'});
  app.submitModal({name:'Rupiah account',type:'Savings',currency:'IDR',balance:'1600000',owner:'Me',updated:'2026-10-03'});
  const a=app.state().accounts.find(a=>a.name==='Rupiah account');assert.equal(a.currency,'IDR');assert.equal(a.balance,160000000);
  assert.equal(app.context.InveysEngine.position(app.state()).netWorth,22447000);
});
test('manual FX form changes valuation without changing native balances',()=>{
  const app=boot();app.changeControl('currency-switch','IDR');const before=app.state().accounts[0].balance;
  app.click({action:'fx-edit'});app.submitModal({USD:'17000',EUR:'17500',GBP:'20500',SGD:'12000',AUD:'10500',JPY:'110',date:'2026-10-03',source:'Manual test quote'});
  assert.equal(app.state().fx.rates.USD,17000);assert.equal(app.state().accounts[0].balance,before);
});
test('card dashboard links to one existing debt without doubling liabilities',()=>{
  const app=boot();const before=app.state().debts.length;
  app.click({action:'card-new'});app.submitModal({name:'Linked test card',debtId:'d1',owner:'Alex',last4:'1234',currency:'IDR',balance:'18200',limit:'25000',apr:'5.9',minimum:'425',statementAmount:'1000',paid:'0',dueDate:'2026-10-10',limitDate:'2027-01-01',reminderDays:'7'});
  assert.equal(app.state().debts.length,before);assert.equal(app.state().cards.length,2);
  const card=app.state().cards.find(c=>c.name==='Linked test card');assert.equal(card.debtId,'d1');
  app.click({page:'cards'});assert.match(app.html(),/Linked test card/);
});
test('Monte Carlo form generates percentile output and leaves financial records unchanged',()=>{
  const app=boot();app.click({page:'montecarlo'});const snapshot=JSON.stringify(app.state());
  app.submitMonteCarlo({initial:'1000',monthly:'100',years:'1',mean:'0',volatility:'0',inflation:'0',target:'2200',paths:'1000',seed:'42'});
  assert.match(app.elements.get('#mc-result').innerHTML,/100.0%/);
  assert.match(app.elements.get('#mc-result').innerHTML,/2,200/);
  assert.equal(JSON.stringify(app.state()),snapshot);
});

test('light and dark theme toggle persists without changing financial amounts',()=>{
  const app=boot(),before=app.state().accounts.map(a=>a.balance);
  app.clickControl('theme-switch');assert.equal(app.state().theme,'dark');
  app.clickControl('theme-switch');assert.equal(app.state().theme,'light');
  assert.deepEqual(app.state().accounts.map(a=>a.balance),before);
});
test('language catalog covers key existing and new workflows',()=>{
  const app=boot();const I=app.context.InveysI18n;
  for(const key of ['Accounts','Transactions','Language','Credit cards','Due date','Limit review date','Edit owner','Run simulation','Exchange rates']){
    assert.notEqual(I.t(key,'id'),key);assert.equal(I.t(key,'en'),key);
  }
});

test('capture, integrations and release center render and escape drafts',()=>{const app=boot();for(const page of ['capture','integrations','updates']){app.click({page});assert.match(app.html(),/section/);}app.click({page:'capture'});app.input('capture-text','<img onerror=alert(1)> Coffee 25');app.click({action:'capture-parse'});assert.match(app.html(),/&lt;img/);assert.doesNotMatch(app.html(),/<img onerror/);});
test('draft commits are atomic and repeat imports require a duplicate reason',()=>{const app=boot();app.click({page:'capture'});app.input('capture-text','Coffee 25');app.click({action:'capture-parse'});const before=app.state().accounts[0].balance;app.click({action:'capture-save'});assert.equal(app.state().accounts[0].balance,before-2500);assert.equal(app.state().transactions[0].source,'text');app.click({page:'capture'});app.input('capture-text','Coffee 25');app.click({action:'capture-parse'});assert.match(app.html(),/Potential duplicate/);const n=app.state().transactions.length;app.click({action:'capture-save'});assert.equal(app.state().transactions.length,n);});
test('historical statements can enter journal without changing snapshot balances',()=>{const app=boot();app.click({page:'capture'});app.input('capture-kind','statement');app.input('capture-text','2026-10-03 Coffee 25 DR');app.click({action:'capture-parse'});const before=app.state().accounts[0].balance;app.click({action:'capture-save'});assert.equal(app.state().accounts[0].balance,before);assert.equal(app.state().transactions[0].balanceApplied,false);});
test('foreign-currency receipt cannot be silently treated as the selected account currency',()=>{const app=boot();app.click({page:'capture'});app.input('capture-text','CAFE\nTOTAL Rp 25.000');app.click({action:'capture-parse'});const before=app.state();app.click({action:'capture-save'});assert.equal(app.state().transactions.length,before.transactions.length);assert.equal(app.state().accounts[0].balance,before.accounts[0].balance);});
test('batch draft failure never partially mutates account balances',()=>{const app=boot();app.click({page:'capture'});app.input('capture-text','2026-10-03 Coffee 25 DR\n2026-10-03 Book 10 DR');app.click({action:'capture-parse'});app.changeDraft(1,'date','2026-02-30');const before=app.state();app.click({action:'capture-save'});assert.equal(app.state().accounts[0].balance,before.accounts[0].balance);assert.equal(app.state().transactions.length,before.transactions.length);});
test('duplicate override is explicit and retains a reason in the journal',()=>{const app=boot();app.click({page:'capture'});app.input('capture-text','Coffee 25');app.click({action:'capture-parse'});app.click({action:'capture-save'});app.click({page:'capture'});app.input('capture-text','Coffee 25');app.click({action:'capture-parse'});app.changeDraft(0,'selected',true,'checkbox');const n=app.state().transactions.length;app.click({action:'capture-save'});assert.equal(app.state().transactions.length,n);app.changeDraft(0,'duplicateReason','A separate second purchase');app.click({action:'capture-save'});assert.equal(app.state().transactions.length,n+1);assert.equal(app.state().transactions[0].duplicateReason,'A separate second purchase');});

test('shared views, reports and forecast render for populated and empty households',()=>{const empty={version:1,currency:'IDR',name:'Empty',demo:false,accounts:[],debts:[],goals:[],flows:[],transactions:[],tasks:[],members:[],history:[]};for(const app of [boot(),boot(empty)])for(const page of ['shared','reports','forecast']){app.click({page});assert.match(app.html(),/page-heading/);if(page==='shared')assert.match(app.html(),/Shared Views/);}});
test('global owner switching changes visible position while preserving real records',()=>{const app=boot(),accounts=structuredClone(app.state().accounts);app.changeField('active-owner','m1');assert.equal(app.state().activeView.owner,'m1');assert.match(app.html(),/193,000/);assert.deepEqual(app.state().accounts,accounts);app.click({page:'accounts'});assert.match(app.html(),/Northstar Checking/);assert.doesNotMatch(app.html(),/Retirement Account/);app.changeField('include-shared','',true);assert.match(app.html(),/High-Yield Savings/);});
test('saved views restore owner and currency and escape their names',()=>{const app=boot();app.click({page:'shared'});app.changeField('active-owner','m2');app.click({action:'view-save'});app.submitModal({name:'<img src=x>'});const id=app.state().savedViews[0].id;app.changeField('active-owner','all');app.changeControl('currency-switch','IDR');app.click({page:'shared'});assert.match(app.html(),/&lt;img src=x&gt;/);assert.doesNotMatch(app.html(),/<img src=x>/);app.click({action:'view-load:'+id});assert.equal(app.state().activeView.owner,'m2');assert.equal(app.state().currency,'USD');});
test('ownership editor and transaction splits change attribution without changing balances',()=>{const app=boot(),before=structuredClone(app.state().accounts);app.click({action:'ownership:accounts_a1'});app.submitModal({ownerId:'m2'});assert.equal(app.state().accounts[0].ownerId,'m2');app.click({action:'ownership-tx:t2'});app.submitModal({ownerId:'shared',mode:'amount',split_shared:'0',split_m1:'63.20',split_m2:'63.20'});const tx=app.state().transactions.find(t=>t.id==='t2');assert.deepEqual(tx.splits,[{ownerId:'m1',amount:6320},{ownerId:'m2',amount:6320}]);assert.deepEqual(app.state().accounts.map(a=>a.balance),before.map(a=>a.balance));});
test('local member renaming retains ownership IDs',()=>{const app=boot();app.click({action:'member-edit:m1'});app.submitModal({name:'Jordan Owner',role:'Owner'});assert.equal(app.state().members[0].id,'m1');assert.equal(app.state().accounts[0].ownerId,'m1');assert.match(app.html(),/Jordan/);});
test('reports filter and drill down to the correct source transactions',()=>{const app=boot();app.click({page:'reports'});app.submitPage('report-form',{from:'2020-01-01',to:'2099-12-31',account:'all',category:'Groceries',search:'',group:'category',chart:'bars'});assert.match(app.html(),/Whole Foods Market/);assert.doesNotMatch(app.html(),/Salary · Northstar Studio/);app.click({action:'report-drill:0'});assert.match(app.html(),/Details: Groceries/);app.click({action:'report-save'});app.submitModal({name:'Food analysis'});const saved=app.state().savedReports[0];assert.equal(saved.filter.category,'Groceries');app.click({action:'report-reset'});app.click({action:'report-load:'+saved.id});assert.match(app.html(),/Whole Foods Market/);assert.doesNotMatch(app.html(),/Salary · Northstar Studio/);});
test('reports render Sankey, treemap and snapshot positions',()=>{const app=boot();app.click({page:'reports'});const f={from:'2020-01-01',to:'2099-12-31',account:'all',category:'all',search:'',group:'category',chart:'sankey'};app.submitPage('report-form',f);assert.match(app.html(),/sankey-svg/);app.submitPage('report-form',{...f,chart:'treemap'});assert.match(app.html(),/report-treemap/);app.click({action:'position-snapshot'});assert.equal(app.state().positionHistory.length,1);app.click({action:'report-tab:networth'});assert.match(app.html(),/Position snapshot history/);assert.match(app.html(),/224,370/);});
function forecastInputs(c,overrides={}){const data={years:String(c.years),startAge:String(c.startAge),baseline:c.baseline,monthlyInvestment:String(c.monthlyInvestment/100),target:String(c.target/100)};for(const k of ['inflation','incomeGrowth','expenseGrowth','investmentGrowth','cashGrowth','propertyGrowth','volatility'])data[k]=String(c[k]*100);return {...data,...overrides};}
test('forecast scenario assumptions and events remain separate from actual records',()=>{const app=boot();app.click({page:'forecast'});const before=structuredClone(app.state().accounts);app.click({action:'forecast-save'});app.submitModal({name:'Education scenario'});const sc=app.state().forecastPlan.scenarios[0];app.submitPage('forecast-form',forecastInputs(sc.plan,{years:'5',expenseGrowth:'4'}));const next=new Date();next.setMonth(next.getMonth()+1,1);const at=next.toISOString().slice(0,10);app.click({action:'event-new'});app.click({action:'event-template:expenseMonthly'});app.submitModal({name:'School fees',type:'expenseMonthly',ownerId:'shared',date:at,endDate:'',amount:'100',currency:'USD',downPayment:'20',apr:'6',termYears:'20'});assert.equal(app.state().forecastPlan.scenarios[0].plan.years,5);assert.equal(app.state().forecastPlan.scenarios[0].plan.events.length,1);assert.equal(app.state().forecastPlan.events.length,0);assert.equal(app.state().forecastPlan.years,20);assert.deepEqual(app.state().accounts,before);assert.match(app.html(),/School fees/);assert.match(app.html(),/Ending difference versus baseline at the same horizon/);assert.doesNotMatch(app.html(),/undefined/);});
test('forecast year drill-down and integrated Monte Carlo use selected plan',()=>{const app=boot();app.click({page:'forecast'});app.submitPage('forecast-form',forecastInputs(app.state().forecastPlan,{years:'1',volatility:'0'}));app.click({action:'forecast-year:1'});assert.match(app.elements.get('#modal-body').innerHTML,/End-of-period account balances/);app.click({action:'modal-close'});app.click({action:'forecast-mc'});const before=structuredClone(app.state().accounts);app.submitModal({paths:'100',seed:'42'});assert.match(app.html(),/Selected plan Monte Carlo/);assert.match(app.html(),/P90/);assert.deepEqual(app.state().accounts,before);});
test('dashboard widget preferences persist and unselected panels are removed',()=>{const app=boot();app.click({action:'dashboard-edit'});app.submitModal({position:'on',accounts:'on'});assert.deepEqual(app.state().dashboardWidgets,['position','accounts']);assert.doesNotMatch(app.html(),/Goals in motion/);assert.doesNotMatch(app.html(),/Your financial picture/);assert.match(app.html(),/Your accounts/);});

test('dashboard quick recording creates review without mutation and saves exactly once',()=>{
 const app=boot();app.click({action:'account-new'});
 app.submitModal({name:'BCA 1234',type:'Savings',currency:'IDR',balance:'1000000',owner:'Me',updated:'2026-10-03'});
 const account=app.state().accounts.find(a=>a.name==='BCA 1234');const before=app.state();
 app.submitPage('quick-form',{text:'Gajian 10 juta masuk BCA 1234',accountId:account.id});
 assert.match(app.html(),/Review drafts/);assert.deepEqual(app.state().transactions,before.transactions);
 assert.equal(app.state().accounts.find(a=>a.id===account.id).balance,account.balance);
 app.click({action:'capture-save'});
 assert.equal(app.state().accounts.find(a=>a.id===account.id).balance,account.balance+1000000000);
 assert.equal(app.state().transactions.length,before.transactions.length+1);
 assert.match(app.html(),/Records saved/);assert.match(app.html(),/quick-form/);
 app.click({action:'capture-save'});assert.equal(app.state().transactions.length,before.transactions.length+1);
 app.submitPage('quick-form',{text:'Gajian 10 juta masuk BCA 1234',accountId:account.id});
 assert.match(app.html(),/Potential duplicate/);app.click({action:'capture-save'});
 assert.equal(app.state().transactions.length,before.transactions.length+1);
});
test('dashboard numeric questions share copilot history without creating drafts',()=>{
 const app=boot();const before=app.state().transactions;
 app.submitPage('quick-form',{text:'What is my cash flow for 3 months?',accountId:''});
 assert.deepEqual(app.state().transactions,before);assert.doesNotMatch(app.html(),/Review drafts/);
 app.click({page:'copilot'});assert.match(app.elements.get('#chat-messages').innerHTML,/3 months/);
});
test('quick entry rejects missing accounts, currency mismatches and replacing pending drafts',()=>{
 const app=boot();const account=app.state().accounts[0];const before=app.state().transactions;
 app.submitPage('quick-form',{text:'Beli kopi 25',accountId:''});assert.match(app.html(),/Choose a recording account/);
 app.submitPage('quick-form',{text:'Beli kopi 25 ribu',accountId:account.id});assert.match(app.html(),/currency must match/);
 app.submitPage('quick-form',{text:'Beli kopi 25',accountId:account.id});assert.match(app.html(),/Review drafts/);
 app.submitPage('quick-form',{text:'Beli makan 50',accountId:account.id});assert.match(app.html(),/Save or discard/);
 assert.deepEqual(app.state().transactions,before);
 app.click({action:'capture-clear'});
 app.submitPage('quick-form',{text:'Transfer 500 ke tabungan',accountId:account.id});assert.match(app.html(),/both source and destination/);
 assert.doesNotMatch(app.html(),/Review drafts/);
});

test('investment menu renders requested benchmarks and honestly empty performance',()=>{
 const app=boot();app.click({page:'investment'});
 for(const label of ['S&P 500','US Stock','US Bond','Bitcoin','IHSG'])assert.ok(app.html().includes(label.replaceAll('&','&amp;')));
 assert.match(app.html(),/Performance unavailable/);assert.match(app.html(),/whole household/);assert.match(app.html(),/No live market feed/);
});
test('investment CSV comparison persists independently without changing assets or ledger',()=>{
 const app=boot(),before=app.state();app.click({page:'investment'});app.click({action:'investment-import'});
 const head=app.context.InveysInvestment.header;
 const csv=head+'\nportfolio,2026-01-01,100,0,USD,16000,16000,total,Broker\nportfolio,2026-02-01,160,50,USD,16000,16000,total,Broker\nsp500,2026-01-01,100,0,USD,16000,16000,total,Index\nsp500,2026-02-01,120,0,USD,16000,16000,total,Index';
 app.submitModal({csv});assert.equal(app.state().investmentHistory.length,4);assert.deepEqual(app.state().accounts,before.accounts);assert.deepEqual(app.state().transactions,before.transactions);assert.match(app.html(),/10.00%/);assert.match(app.html(),/20.00%/);
 app.submitPage('investment-filter',{from:'2026-01-01',to:'2026-02-01',currency:'USD'});assert.match(app.html(),/matching dates/);
 const restored=boot(app.state());restored.click({page:'investment'});assert.match(restored.html(),/20.00%/);
});
test('investment invalid replacement is atomic and imported source labels are escaped',()=>{
 const app=boot();app.click({page:'investment'});app.click({action:'investment-import'});const head=app.context.InveysInvestment.header;
 const csv=head+'\nportfolio,2026-01-01,100,0,USD,16000,16000,total,<img src=x onerror=alert(1)>\nportfolio,2026-02-01,110,0,USD,16000,16000,total,<img src=x onerror=alert(1)>';
 app.submitModal({csv});assert.doesNotMatch(app.html(),/<img/);assert.match(app.html(),/&lt;img/);const before=app.state().investmentHistory;
 app.click({action:'investment-import'});app.submitModal({csv:csv+'\nportfolio,2026-02-01,110,0,USD,16000,16000,total,<img src=x onerror=alert(1)>'});assert.deepEqual(app.state().investmentHistory,before);
});

test('compact navigation keeps labels accessible and pinning preserves financial records',()=>{
 const app=boot(),before=app.state();const nav=app.elements.get('#navigation').innerHTML;
 assert.match(nav,/aria-label="Reports"/);assert.match(nav,/class="nav-text"/);assert.match(nav,/title="Investment"/);
 app.clickControl('sidebar-pin');assert.equal(app.elements.get('#sidebar-pin').attributes.get('aria-pressed'),'true');assert.deepEqual(app.state(),before);
 app.clickControl('sidebar-pin');assert.equal(app.elements.get('#sidebar-pin').attributes.get('aria-pressed'),'false');
});
test('mobile navigation opens on demand, closes after navigation or Escape, and manages inertness',()=>{
 const app=boot();app.context.matchMedia=()=>({matches:true});app.clickControl('menu-button');
 assert.equal(app.elements.get('#sidebar').inert,false);assert.equal(app.elements.get('#menu-button').attributes.get('aria-expanded'),'true');
 app.keyDown('Escape');assert.equal(app.elements.get('#sidebar').inert,true);assert.equal(app.elements.get('#menu-button').attributes.get('aria-expanded'),'false');
 app.clickControl('menu-button');app.click({page:'reports'});assert.equal(app.elements.get('#sidebar').inert,true);
});
test('Reports exposes Sankey and Bar controls, changes monthly view without changing the ledger',()=>{
 const app=boot();app.click({page:'reports'});app.click({action:'report-period:all'});const before=app.state();
 assert.match(app.html(),/sankey-svg/);assert.match(app.html(),/Savings rate/);assert.match(app.html(),/report-popover/);
 app.changeField('report-chart','bars');assert.match(app.html(),/report-bars-svg/);assert.match(app.html(),/value="month" selected/);
 app.changeField('report-chart','sankey');assert.match(app.html(),/sankey-svg/);assert.deepEqual(app.state().transactions,before.transactions);assert.deepEqual(app.state().accounts,before.accounts);
 app.click({action:'report-tab:spending'});assert.doesNotMatch(app.html(),/value="sankey"/);assert.match(app.html(),/report-bars-svg/);
});
test('Reports chart export matches displayed Sankey or Bar, and empty report invents no chart',()=>{
 const app=boot();app.click({page:'reports'});app.click({action:'report-period:all'});const files=[];
 app.context.Blob=class{constructor(parts){files.push(parts.join(''));}};app.context.URL={createObjectURL:()=> 'blob:test',revokeObjectURL(){}};
 app.click({action:'report-chart-export'});assert.match(files.at(-1),/M230/);assert.match(files.at(-1),/xmlns=/);
 app.changeField('report-chart','bars');app.click({action:'report-chart-export'});assert.match(files.at(-1),/Income and expense bar chart/);assert.doesNotMatch(files.at(-1),/M230/);
 app.submitPage('report-form',{from:'2000-01-01',to:'2000-01-02',account:'all',category:'all',search:'',group:'category',chart:'sankey'});
 assert.match(app.html(),/No cash flow in this period/);const count=files.length;app.click({action:'report-chart-export'});assert.equal(files.length,count);
});

test('dark palette defaults to charcoal, persists custom colors and preserves financial records',()=>{
 const app=boot(),before=app.state().accounts;app.clickControl('theme-switch');app.click({page:'settings'});
 assert.equal(app.state().appearance.dark.preset,'charcoal');assert.match(app.html(),/Color palette/);
 app.changeField('appearance-preset','ocean');assert.equal(app.state().appearance.dark.preset,'ocean');
 const colors=app.context.InveysAppearance.colors('dark','violet');app.submitPage('appearance-form',colors);
 assert.equal(app.state().appearance.dark.preset,'custom');assert.deepEqual(app.state().accounts,before);
 const restored=boot(app.state());assert.equal(restored.state().appearance.dark.colors.accent,colors.accent);
 app.clickControl('theme-switch');assert.equal(app.state().appearance.light.preset,'forest');
});
test('invalid custom colors cannot overwrite saved appearance',()=>{
 const app=boot();app.click({page:'settings'});const before=app.state().appearance;
 app.submitPage('appearance-form',{...before.light.colors,ink:before.light.colors.paper});
 assert.deepEqual(app.state().appearance,before);assert.match(app.elements.get('#appearance-error').textContent,/contrast/);
});
test('grouped navigation retains all destinations and expands active submenu',()=>{
 const app=boot();app.click({page:'forecast'});const nav=app.elements.get('#navigation').innerHTML;
 assert.match(nav,/nav-section active-section.*open/);assert.match(nav,/aria-label="Planning"/);
 for(const page of ['accounts','transactions','cards','debt','forecast','goals','scenarios','montecarlo','reports','investment','shared','household','integrations','updates','copilot'])assert.ok(nav.includes('data-page="'+page+'"'));
});
test('rich forecast chart changes metrics and explores years without mutating plan or ledger',()=>{
 const app=boot();app.click({page:'forecast'});const before=app.state();
 assert.match(app.html(),/forecast-rich-svg/);assert.match(app.html(),/Monthly projections and life events/);
 app.changeField('forecast-chart-metric','assets');assert.match(app.html(),/aria-label="Assets/);
 app.changeField('forecast-chart-metric','cashflow');assert.match(app.html(),/aria-label="Monthly cash flow/);
 app.input('forecast-preview-year','5');assert.match(app.elements.get('#forecast-preview').innerHTML,/40/);
 app.click({action:'forecast-select-year:2'});assert.match(app.html(),/forecast-preview/);
 assert.deepEqual(app.state().accounts,before.accounts);assert.deepEqual(app.state().forecastPlan,before.forecastPlan);assert.deepEqual(app.state().transactions,before.transactions);
});

test('membership comparison and preview switch never delete financial records or create a paid subscription',()=>{
 const app=boot(),before=app.state();app.click({page:'plans'});assert.match(app.html(),/INVEYS Plus/);assert.match(app.html(),/paid checkout is not connected/);
 app.click({action:'plan-preview:plus'});app.submitModal({});assert.equal(app.state().commercial.previewTier,'plus');
 assert.deepEqual(app.state().accounts,before.accounts);assert.deepEqual(app.state().transactions,before.transactions);assert.equal(app.state().commercial.subscription,undefined);
 app.click({page:'forecast'});app.click({action:'forecast-mc'});assert.match(app.elements.get('#modal-body').innerHTML,/No automatic payment/);
});
test('membership draft price updates and invalid updates are atomic',()=>{
 const app=boot();app.click({page:'plans'});app.click({action:'plan-pricing'});
 app.submitModal({monthly_plus:'59000',annual_plus:'590000',monthly_pro:'139000',annual_pro:'1390000',monthly_ultra:'399000',annual_ultra:'3990000'});
 assert.equal(app.state().commercial.prices.plus.monthly,59000);const before=app.state().commercial;
 app.click({action:'plan-pricing'});app.submitModal({monthly_plus:'0',annual_plus:'590000',monthly_pro:'139000',annual_pro:'1390000',monthly_ultra:'399000',annual_ultra:'3990000'});assert.deepEqual(app.state().commercial,before);
});
test('forecast setup cancels without persisting assumptions or account settings',()=>{
 const app=boot();app.click({page:'forecast'});const before=app.state().forecastPlan;
 app.click({action:'forecast-setup'});assert.match(app.html(),/Confirm your information/);app.submitPage('forecast-setup-form',{startAge:'40',years:'30',baseline:'plan'});
 assert.match(app.html(),/Accounts in your projection/);assert.deepEqual(app.state().forecastPlan,before);
 app.click({action:'forecast-setup-cancel'});assert.deepEqual(app.state().forecastPlan,before);assert.match(app.html(),/forecast-rich-svg/);
});
test('forecast setup commits validated account assumptions and owner retirement only on Finish',()=>{
 const app=boot();app.click({page:'forecast'});const before=app.state();app.click({action:'forecast-setup'});
 app.submitPage('forecast-setup-form',{startAge:'35',years:'40',baseline:'plan'});
 const controls={};for(const a of before.accounts){controls['include_'+a.id]='on';controls['growth_'+a.id]=a.type==='Investment'?'5':'0';}
 app.submitPage('forecast-setup-form',controls);assert.match(app.html(),/Plan retirement/);assert.deepEqual(app.state().forecastPlan,before.forecastPlan);
 app.submitPage('forecast-setup-form',{retire:'on',retirementAge:'65',ownerId:before.members[0].id,replacement:'1000'});
 assert.equal(app.state().forecastPlan.years,40);const event=app.state().forecastPlan.events.find(e=>e.type==='retirement');assert.equal(event.ownerId,before.members[0].id);assert.equal(event.amount,100000);
 assert.deepEqual(app.state().accounts,before.accounts);assert.deepEqual(app.state().transactions,before.transactions);
});
test('forecast matrix switches accounts/cash flow/events and chooser opens the selected template',()=>{
 const app=boot();app.click({page:'forecast'});assert.match(app.html(),/forecast-matrix/);assert.match(app.html(),/Year-by-year|year-by-year/);
 app.click({action:'forecast-table:cashflow'});assert.match(app.html(),/Debt interest \(included in payments\)/);
 app.click({action:'forecast-table:events'});assert.match(app.html(),/No events in this plan/);
 app.click({action:'event-new'});assert.match(app.elements.get('#modal-body').innerHTML,/Buy a home/);
 app.click({action:'event-template:home'});assert.match(app.elements.get('#modal-body').innerHTML,/value="home" selected/);
});

test('invalid retirement setup cannot partially replace forecast plan',()=>{
 const app=boot();app.click({page:'forecast'});const before=app.state().forecastPlan;app.click({action:'forecast-setup'});
 app.submitPage('forecast-setup-form',{startAge:'40',years:'30',baseline:'plan'});const controls={};for(const a of app.state().accounts){controls['include_'+a.id]='on';controls['growth_'+a.id]='0';}app.submitPage('forecast-setup-form',controls);
 app.submitPage('forecast-setup-form',{retire:'on',retirementAge:'35',ownerId:app.state().members[0].id,replacement:'1000'});
 assert.deepEqual(app.state().forecastPlan,before);assert.match(app.elements.get('#setup-error').textContent,/must exceed/);
});

function holdingForm(app,extra={}){return {accountId:app.state().accounts.find(a=>a.type==='Investment').id,symbol:'TEST',name:'Test stock',type:'stock',assetClass:'Equity',currency:'USD',quantity:'2.5',price:'120',quoteDate:'2026-10-03',source:'Manual',costBasis:'200',costFxToIDR:'15000',...extra};}
test('Holdings and Advanced expose horizontal submenus and changes are analysis only',()=>{const app=boot(),before=app.state();app.click({page:'investment'});assert.match(app.html(),/investment-main:holdings/);assert.match(app.html(),/investment-main:advanced/);app.click({action:'investment-main:advanced'});for(const tab of ['allocation','gains','funds'])assert.match(app.html(),new RegExp('investment-tab:'+tab));app.click({action:'investment-tab:gains'});assert.match(app.html(),/Unrealized gains/);app.click({action:'investment-tab:funds'});assert.match(app.html(),/ETFs and mutual funds only/);app.changeField('investment-style','breakdown');assert.deepEqual(app.state().accounts,before.accounts);assert.deepEqual(app.state().transactions,before.transactions);});
test('holding entry persists fractional quantity and gain loss without increasing net worth',()=>{const app=boot(),before=app.state();app.click({page:'investment'});app.click({action:'investment-holding-new'});app.submitModal(holdingForm(app));assert.equal(app.state().holdings.length,1);assert.equal(app.state().holdings[0].quantity,2.5);assert.deepEqual(app.state().accounts,before.accounts);assert.equal(app.context.InveysEngine.position(app.state()).netWorth,app.context.InveysEngine.position(before).netWorth);app.click({action:'investment-main:advanced'});app.click({action:'investment-tab:gains'});assert.match(app.html(),/60.00%/);const restored=boot(app.state());restored.click({page:'investment'});assert.match(restored.html(),/Test stock/);});
test('holding validation is atomic and source text is escaped in analytical tables',()=>{const app=boot();app.click({page:'investment'});app.click({action:'investment-holding-new'});app.submitModal(holdingForm(app,{quantity:'-1'}));assert.equal(app.state().holdings.length,0);app.submitModal(holdingForm(app,{name:'<img src=x onerror=alert(1)>',source:'<script>test</script>'}));assert.equal(app.state().holdings.length,1);assert.doesNotMatch(app.html(),/<img|<script>/);assert.match(app.html(),/&lt;img/);});
test('quote import and owner/account filters do not reuse whole household TWR for a filtered portfolio',()=>{const app=boot();app.click({page:'investment'});app.click({action:'investment-holding-new'});app.submitModal(holdingForm(app));const h=app.state().holdings[0],INV=app.context.InveysInvestment;app.click({action:'investment-prices'});app.submitModal({csv:INV.priceHeader+`\n${h.id},2026-01-01,100,16000,16000,Broker\n${h.id},2026-02-01,120,16000,16000,Broker`});assert.equal(app.state().holdingPrices.length,2);assert.match(app.html(),/20.00%/);app.changeField('investment-mode','actual');app.changeField('investment-account',h.accountId);assert.match(app.html(),/whole household; use backtest/);app.changeField('investment-mode','backtest');assert.match(app.html(),/20.00%/);});
test('fund analysis excludes individual stocks and groups user supplied metadata',()=>{const app=boot();app.click({page:'investment'});app.click({action:'investment-holding-new'});app.submitModal(holdingForm(app));app.click({action:'investment-holding-new'});app.submitModal(holdingForm(app,{symbol:'FUND',name:'Balanced Fund',type:'fund',category:'Balanced',quantity:'10'}));app.click({action:'investment-main:advanced'});app.click({action:'investment-tab:funds'});assert.match(app.html(),/Balanced Fund/);assert.doesNotMatch(app.html(),/Test stock/);app.changeField('investment-group','category');assert.match(app.html(),/Balanced/);app.changeField('investment-style','breakdown');assert.doesNotMatch(app.html(),/Portfolio allocation chart/);});
test('holding removal preserves saved snapshots and blocks deleting its account until detail is removed',()=>{const app=boot();app.click({page:'investment'});app.click({action:'investment-holding-new'});app.submitModal(holdingForm(app));const h=app.state().holdings[0],before=app.state().accounts;app.click({action:'investment-snapshot'});assert.equal(app.state().investmentSnapshots.length,1);app.click({action:'account-delete:'+h.accountId});assert.deepEqual(app.state().accounts,before);assert.match(app.elements.get('#toast').textContent,/holdings before/);app.click({action:'investment-holding-delete:'+h.id});app.submitModal({});assert.equal(app.state().holdings.length,0);assert.equal(app.state().investmentSnapshots[0].rows.length,1);assert.deepEqual(app.state().accounts,before);});
test('legacy workspace migrates to holdings engine without invented positions or prices',()=>{const s=boot().state();delete s.holdings;delete s.holdingPrices;delete s.investmentSnapshots;const app=boot(s);assert.deepEqual(app.state().holdings,[]);assert.deepEqual(app.state().holdingPrices,[]);assert.deepEqual(app.state().investmentSnapshots,[]);});

test('Investment SVG export matches pie and market curves, resolves palette and rejects empty charts',()=>{const app=boot(),files=[];app.context.Blob=class{constructor(parts){files.push(parts.join(''));}};app.context.URL={createObjectURL:()=> 'blob:test',revokeObjectURL(){}};app.context.document.createElement=()=>({click(){},remove(){}});app.context.document.body.appendChild=()=>{};app.click({page:'investment'});app.click({action:'investment-chart-export'});assert.equal(files.length,0);app.click({action:'investment-holding-new'});app.submitModal(holdingForm(app));app.click({action:'investment-main:advanced'});app.click({action:'investment-chart-export'});assert.match(files.at(-1),/xmlns=/);assert.match(files.at(-1),/Portfolio allocation chart/);assert.doesNotMatch(files.at(-1),/var\(--accent\)|currentColor/);app.click({action:'investment-main:holdings'});const h=app.state().holdings[0],INV=app.context.InveysInvestment;app.click({action:'investment-prices'});app.submitModal({csv:INV.priceHeader+`\n${h.id},2026-01-01,100,16000,16000,Close\n${h.id},2026-02-01,120,16000,16000,Close`});app.click({action:'investment-chart-export'});assert.match(files.at(-1),/Cumulative returns/);assert.match(files.at(-1),/polyline/);});

test('floating quick chat minimizes without discarding typed input, account selection or pending draft',()=>{const app=boot(),before=app.state(),account=before.accounts[0];app.input('quick-text','Coffee expense 25');app.changeField('quick-account',account.id);app.outside();assert.match(app.html(),/quick-launcher/);assert.doesNotMatch(app.html(),/id="quick-form"/);app.click({action:'quick-expand'});assert.match(app.html(),/Coffee expense 25/);assert.match(app.html(),new RegExp('value="'+account.id+'" selected'));app.submitPage('quick-form',{text:'Coffee expense 25',accountId:account.id});assert.match(app.html(),/Review drafts/);app.outside();assert.match(app.html(),/1 draft/);app.click({action:'quick-expand'});assert.match(app.html(),/Review drafts/);assert.deepEqual(app.state().accounts,before.accounts);assert.deepEqual(app.state().transactions,before.transactions);});
test('quick chat Enter creates review only, while Shift+Enter and composing input do not submit',()=>{const app=boot(),before=app.state(),account=before.accounts[0];app.changeField('quick-account',account.id);app.quickKey('Coffee expense 25',{shiftKey:true});assert.doesNotMatch(app.html(),/Review drafts/);app.quickKey('Coffee expense 25',{isComposing:true});assert.doesNotMatch(app.html(),/Review drafts/);app.quickKey('Coffee expense 25');assert.match(app.html(),/Review drafts/);assert.deepEqual(app.state().transactions,before.transactions);assert.deepEqual(app.state().accounts,before.accounts);});

test('compact quick chat exists on all pages, has no marked header, and survives navigation while minimized',()=>{const app=boot(),before=app.state();app.input('quick-text','My unsent question');for(const page of ['home','accounts','cashflow','transactions','goals','debt','scenarios','montecarlo','cards','household','copilot','capture','integrations','updates','plans','shared','reports','forecast','investment','settings']){app.click({page});assert.equal((app.html().match(/id="quick-form"/g)||[]).length,1,page);assert.doesNotMatch(app.html(),/quick-dock-header/);assert.match(app.html(),/My unsent question/);assert.match(app.html(),/quick-camera/);assert.match(app.html(),/quick-upload/);}app.outside();app.click({page:'reports'});assert.match(app.html(),/quick-launcher/);app.click({action:'quick-expand'});assert.match(app.html(),/My unsent question/);assert.deepEqual(app.state().accounts,before.accounts);assert.deepEqual(app.state().transactions,before.transactions);});
test('camera and directory attachments are staged across navigation, validate types and size, and never write ledger records',()=>{const app=boot(),before=app.state();app.chooseQuickFile({name:'<receipt>.jpg',type:'image/jpeg',size:2048},'quick-camera-file');assert.match(app.html(),/&lt;receipt&gt;.jpg/);app.click({page:'investment'});assert.match(app.html(),/&lt;receipt&gt;.jpg/);app.chooseQuickFile({name:'statement.pdf',type:'application/pdf',size:4096});assert.match(app.html(),/statement.pdf/);app.chooseQuickFile({name:'bad.html',type:'text/html',size:100});assert.match(app.html(),/statement.pdf/);assert.match(app.elements.get('#toast').textContent,/PNG\/JPEG\/WebP/);app.chooseQuickFile({name:'huge.pdf',type:'application/pdf',size:9*1024*1024});assert.match(app.html(),/statement.pdf/);app.click({action:'quick-file-clear'});assert.doesNotMatch(app.html(),/statement.pdf/);assert.deepEqual(app.state().transactions,before.transactions);assert.deepEqual(app.state().accounts,before.accounts);assert.ok(!JSON.stringify(app.state()).includes('statement.pdf'));});

test('assistant settings persist explicit memory and permissions; marked controls are absent and settings remain in Integrations',()=>{const app=boot();assert.doesNotMatch(app.html(),/quick-chat-caption/);assert.doesNotMatch(app.html(),/quick-collapse|quick-ai-provider|quick-mode:|data-action="quick-minimize"/);app.click({action:'quick-ai-settings'});app.submitModal({provider:'openai',consent:'on',shareFinancial:'on',useMemory:'on',memory:'Prefer IDR\nShort answers'});assert.equal(app.state().assistant.provider,'openai');assert.equal(app.state().assistant.shareFinancial,true);assert.equal(app.state().assistant.memory.length,2);const restored=boot(app.state());assert.deepEqual(restored.state().assistant.memory,['Prefer IDR','Short answers']);});
test('external assistant refuses API use until sharing is enabled and never bypasses ledger review',()=>{const app=boot(),before=app.state();app.click({action:'quick-ai-settings'});app.submitModal({provider:'openai',memory:''});app.submitPage('quick-form',{text:'Pay this card',accountId:before.accounts[0].id});assert.match(app.html(),/Enable API sharing/);assert.deepEqual(app.state().transactions,before.transactions);assert.deepEqual(app.state().accounts,before.accounts);});
test('remote assistant sends only selected context, escapes responses and persists scoped conversation',async()=>{const app=boot(),before=app.state(),requests=[];app.context.location.protocol='http:';app.context.fetch=async(url,opts)=>{if(url==='/api/status')return {ok:true,json:async()=>({csrf:'test',ai:{openai:{enabled:true}}})};requests.push(JSON.parse(opts.body));return {ok:true,json:async()=>({text:'<script>bad</script> **Review only**',provider:'openai',model:'test'})};};app.click({action:'quick-ai-settings'});app.submitModal({provider:'openai',consent:'on',memory:'Prefer IDR'});app.submitPage('quick-form',{text:'Analyze my choices',accountId:''});await new Promise(resolve=>setImmediate(resolve));assert.equal(requests.length,1);assert.equal(requests[0].summary,'');assert.deepEqual(requests[0].memory,[]);assert.equal(app.state().assistant.history.length,2);assert.doesNotMatch(app.html(),/<script>/);assert.match(app.html(),/&lt;script&gt;/);assert.deepEqual(app.state().transactions,before.transactions);assert.deepEqual(app.state().accounts,before.accounts);app.changeField('active-owner','m2');assert.doesNotMatch(app.html(),/Review only/);});

test('transaction correction form uses full split-independent amount and persists without duplicate effects',()=>{const app=boot(),before=app.state(),tx=before.transactions.find(t=>t.kind==='expense');app.click({page:'transactions'});assert.match(app.html(),/transaction-row-edit:/);app.click({action:'transaction-edit:'+tx.id});app.submitModal({name:'Corrected coffee',kind:'expense',amount:'12.50',date:tx.date,accountId:tx.accountId,category:'Food'});const after=app.state();assert.equal(after.transactions.length,before.transactions.length);assert.equal(after.transactions.find(t=>t.id===tx.id).amount,1250);assert.equal(after.accounts.find(a=>a.id===tx.accountId).balance,before.accounts.find(a=>a.id===tx.accountId).balance+tx.amount-1250);app.click({action:'transaction-edit:'+tx.id});app.submitModal({name:'Corrected coffee',kind:'expense',amount:'12.50',date:tx.date,accountId:tx.accountId,category:'Food'});assert.deepEqual(app.state().accounts,after.accounts);});
test('unified AI recording response stages review drafts and requires explicit saving',async()=>{const app=boot(),before=app.state(),account=before.accounts[0];app.context.location.protocol='http:';let sent;app.context.fetch=async(url,opts)=>{if(url==='/api/status')return {ok:true,json:async()=>({csrf:'test'})};sent=JSON.parse(opts.body);return {ok:true,json:async()=>({intent:'record',text:'Review this draft',drafts:[{name:'Coffee',kind:'expense',amount:'25.00',currency:account.currency,date:'2026-10-04',category:'Food'}]})};};app.click({action:'quick-ai-settings'});app.submitModal({provider:'9router',consent:'on',memory:''});app.submitPage('quick-form',{text:'Record coffee 25',accountId:account.id});await new Promise(resolve=>setImmediate(resolve));assert.equal(sent.unified,true);assert.equal(sent.provider,'9router');assert.equal(sent.recordContext.currency,account.currency);assert.match(app.html(),/Review drafts/);assert.deepEqual(app.state().transactions,before.transactions);assert.deepEqual(app.state().accounts,before.accounts);app.click({action:'capture-save'});assert.equal(app.state().transactions.length,before.transactions.length+1);assert.equal(app.state().accounts[0].balance,before.accounts[0].balance-2500);});

test('journal action column edits inline, cancels, validates and shows success after saving',()=>{const app=boot(),before=app.state(),tx=before.transactions.find(t=>t.kind==='expense');app.click({page:'transactions'});assert.match(app.html(),/>Actions<\/th>/);assert.match(app.html(),/aria-label="Edit transaction"/);assert.match(app.html(),/aria-label="Delete transaction"/);app.click({action:'transaction-row-edit:'+tx.id});assert.match(app.html(),/transaction-row-save:/);app.input('', '12.50',{txEdit:'amount'});app.input('', 'Fixed entry',{txEdit:'name'});assert.deepEqual(app.state(),before);app.click({action:'transaction-row-cancel'});assert.deepEqual(app.state(),before);app.click({action:'transaction-row-edit:'+tx.id});app.input('', '0',{txEdit:'amount'});app.click({action:'transaction-row-save:'+tx.id});assert.match(app.html(),/role="alert"/);assert.deepEqual(app.state(),before);app.input('', '12.50',{txEdit:'amount'});app.input('', 'Fixed entry',{txEdit:'name'});app.click({action:'transaction-row-save:'+tx.id});assert.equal(app.state().transactions.find(t=>t.id===tx.id).amount,1250);assert.equal(app.state().transactions.find(t=>t.id===tx.id).name,'Fixed entry');assert.match(app.elements.get('#toast').innerHTML,/Transaction saved successfully/);assert.match(app.elements.get('#toast').innerHTML,/<svg/);assert.doesNotMatch(app.html(),/transaction-editing/);});
test('delete action waits for confirmation, reverses full amount and cancels without mutation',()=>{const app=boot(),before=app.state(),tx=before.transactions.find(t=>t.kind==='expense');app.click({page:'transactions'});app.click({action:'transaction-delete:'+tx.id});assert.deepEqual(app.state(),before);app.click({action:'modal-close'});assert.deepEqual(app.state(),before);app.click({action:'transaction-delete:'+tx.id});app.submitModal({});const after=app.state();assert.equal(after.transactions.length,before.transactions.length-1);assert.ok(!after.transactions.some(t=>t.id===tx.id));assert.equal(after.accounts.find(a=>a.id===tx.accountId).balance,before.accounts.find(a=>a.id===tx.accountId).balance+tx.amount);assert.match(app.elements.get('#toast').innerHTML,/Transaction deleted successfully/);});
test('inline correction storage failure keeps original financial records and draft',()=>{const app=boot(),before=app.state(),tx=before.transactions[0];app.click({page:'transactions'});app.click({action:'transaction-row-edit:'+tx.id});app.input('', '2.00',{txEdit:'amount'});app.context.localStorage.setItem=()=>{throw Error('Storage full');};app.click({action:'transaction-row-save:'+tx.id});assert.deepEqual(app.state(),before);assert.match(app.html(),/Storage full/);assert.match(app.html(),/transaction-editing/);});
test('navigation and analysis tabs have explicit distinct SVG icons with accessible labels',()=>{const app=boot();const nav=app.elements.get('#navigation').innerHTML,icons=[...nav.matchAll(/<svg[^>]*>(.*?)<\/svg>/g)].map(m=>m[1]);assert.equal(new Set(icons).size,icons.length);for(const page of ['cards','capture','montecarlo','integrations','plans','updates'])assert.match(nav,new RegExp('data-page="'+page+'"'));assert.match(app.elements.get('#about-button').innerHTML,/<svg/);assert.match(app.elements.get('#settings-button').innerHTML,/<svg/);for(const page of ['reports','investment','forecast']){app.click({page});const markup=app.html();assert.match(markup,/aria-pressed="(?:true|false)"><svg/);}});

test('card artwork upload normalizes, persists, restores and removes without changing debts or accounts',async()=>{const app=boot(),before=app.state(),id=before.cards[0].id;app.context.FileReader=class{readAsDataURL(){this.result='data:image/png;base64,fixture';this.onload();}};app.context.Image=class{constructor(){this.naturalWidth=1200;this.naturalHeight=760;}set src(v){this.onload();}};const output='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAACAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==';let drawn=false;app.context.document.createElement=()=>({width:0,height:0,getContext:()=>({fillRect(){},drawImage(){drawn=true;}}),toDataURL:()=>output});app.click({page:'cards'});assert.match(app.html(),/Upload artwork/);app.click({action:'card-image:'+id});app.chooseQuickFile({name:'card.png',type:'image/png',size:1000},'card-image-file');await new Promise(resolve=>setImmediate(resolve));assert.equal(drawn,true);assert.equal(app.state().cards[0].image,output);assert.match(app.html(),/class="credit-art"/);assert.deepEqual(app.state().debts,before.debts);assert.deepEqual(app.state().accounts,before.accounts);const restored=boot(app.state());restored.click({page:'cards'});assert.match(restored.html(),/class="credit-art"/);app.click({action:'card-image-remove:'+id});assert.equal(app.state().cards[0].image,undefined);assert.deepEqual(app.state().debts,before.debts);app.click({action:'card-image:'+id});app.chooseQuickFile({name:'bad.svg',type:'image/svg+xml',size:1000},'card-image-file');await new Promise(resolve=>setImmediate(resolve));assert.equal(app.state().cards[0].image,undefined);assert.match(app.elements.get('#toast').textContent,/PNG\/JPEG\/WebP/);});
test('expense records are marked red in the journal and source report while transfers remain neutral',()=>{const app=boot();app.click({page:'transactions'});const html=app.html();assert.match(html,/<td class="expense-amount"><b>−/);assert.match(html,/<td class="positive"><b>\+/);assert.match(html,/<td class=""><b><span class="money">/);app.click({page:'reports'});assert.match(app.html(),/class="expense-amount"/);app.click({page:'cashflow'});assert.match(app.html(),/flow-amount expense-amount/);});

test('Operations renders scoped reviews, recurring detection, reconciliation and local audit',()=>{const app=boot();app.click({page:'operations'});assert.match(app.html(),/Transaction rules/);assert.match(app.html(),/Balances &amp; reconciliation|Balances & reconciliation/);assert.match(app.html(),/Change history/);assert.match(app.elements.get('#navigation').innerHTML,/data-page="operations"/);assert.match(app.html(),/7 days/);});
test('Operations rule form applies metadata on new journal entries and persists audit',()=>{const app=boot();app.click({page:'operations'});app.click({action:'ops-rule-new'});app.submitModal({name:'Coffee rule',contains:'Coffee',kind:'expense',accountId:'',currency:'',category:'Dining',merchant:'Local Cafe',ownerId:'m1',reviewerId:'m2',tags:'coffee, daily',visibility:'show',enabled:'enabled'});app.click({action:'transaction-new'});app.submitModal({name:'Coffee corner',kind:'expense',status:'posted',amount:'10',date:'2026-10-06',accountId:'a1',category:'Other'});const tx=app.state().transactions[0];assert.equal(tx.name,'Local Cafe');assert.equal(tx.category,'Dining');assert.equal(tx.reviewerId,'m2');assert.equal(app.state().operations.activity[0].action,'transaction.created');});
test('pending journal creation can be posted once through Operations',()=>{const app=boot(),before=app.state().accounts[0].balance;app.click({action:'transaction-new'});app.submitModal({name:'Pending test',kind:'expense',status:'pending',amount:'10',date:'2026-10-06',accountId:'a1',category:'Other'});const id=app.state().transactions[0].id;assert.equal(app.state().accounts[0].balance,before);app.click({page:'operations'});app.click({action:'ops-post:'+id});assert.equal(app.state().accounts[0].balance,before-1000);assert.equal(app.state().transactions[0].status,'posted');app.click({action:'ops-review:'+id});assert.equal(app.state().transactions[0].reviewed,true);});
test('statement reconciliation preserves journal totals and captures observed balance history',()=>{const app=boot();app.click({page:'operations'});app.click({action:'ops-balance:a1'});app.submitModal({balance:'8000',date:'2026-10-06',source:'Bank statement'});const s=app.state();assert.equal(s.accounts[0].balance,800000);assert.equal(s.accounts[0].balancePolicy,'snapshot');assert.equal(s.transactions.length,5);assert.equal(s.operations.activity[0].action,'account.reconciled');assert.equal(s.positionHistory.at(-1).date,'2026-10-06');});
test('card purchase and settlement UI preserve neutral payment reporting and allow metadata edits',()=>{const app=boot(),before=app.state(),card=before.cards[0];app.click({page:'cards'});assert.match(app.html(),/Card purchase/);app.click({action:'ops-card-purchase:'+card.id});app.submitModal({name:'Card purchase',category:'Dining',amount:'10',date:'2026-10-06',accountId:'a1'});assert.equal(app.state().accounts[0].balance,before.accounts[0].balance);assert.equal(app.state().debts.find(d=>d.id===card.debtId).balance,before.debts.find(d=>d.id===card.debtId).balance+1000);app.click({action:'card-pay:'+card.id});app.submitModal({amount:'10',date:'2026-10-06',accountId:'a1'});const payment=app.state().transactions[0];assert.equal(payment.kind,'transfer');app.click({page:'transactions'});app.click({action:'transaction-row-edit:'+payment.id});app.submitModal({name:'Settled card payment',category:'Credit card payment',date:'2026-10-06'});assert.equal(app.state().transactions[0].name,'Settled card payment');});

function chartFixture(){const app=boot();app.click({page:'investment'});const head=app.context.InveysInvestment.header;app.click({action:'investment-import'});app.submitModal({csv:head+'\nportfolio,2026-01-01,100,0,USD,16000,16000,total,Broker\nportfolio,2026-02-01,110,0,USD,16000,16000,total,Broker\nportfolio,2026-03-01,121,0,USD,16000,16000,total,Broker\nsp500,2026-01-01,100,0,USD,16000,16000,total,Index\nsp500,2026-03-01,120,0,USD,16000,16000,total,Index'});return app;}
test('Holdings exposes range shortcuts, value toggle and a single keyboard chart target',()=>{const app=chartFixture();for(const range of ['1d','1w','1m','3m','6m','ytd','1y','all','custom'])assert.match(app.html(),new RegExp('investment-period:'+range));assert.match(app.html(),/id="holdings-chart"[^>]+role="slider"/);assert.match(app.html(),/investment-metric:value/);assert.match(app.html(),/Last change/);assert.doesNotMatch(app.html(),/investment-hit/);});
test('keyboard exploration shows an honest missing benchmark and Escape restores latest summary',()=>{const app=chartFixture(),before=app.state();app.chartKey('Home');assert.equal(app.elements.get('#holdings-primary-date').textContent,'2026-01-01');assert.equal(app.elements.get('#holdings-primary-return').textContent,'0.00%');app.chartKey('ArrowRight');assert.equal(app.elements.get('#holdings-primary-date').textContent,'2026-02-01');assert.equal(app.elements.get('#holdings-benchmark-sp500').textContent,'—');assert.match(app.elements.get('#holdings-tooltip').innerHTML,/2026-02-01/);app.chartKey('Escape');assert.equal(app.elements.get('#holdings-tooltip').hidden,true);assert.equal(app.elements.get('#holdings-primary-return').textContent,'21.00%');assert.deepEqual(app.state(),before);});
test('benchmark toggle does not change portfolio return and colors remain tied to identities',()=>{const app=chartFixture(),before=app.state();app.benchmark('sp500',false);assert.match(app.html(),/21.00%/);assert.doesNotMatch(app.html(),/<polyline[^>]+stroke="#7953ba"/);app.benchmark('sp500',true);assert.match(app.html(),/<polyline[^>]+stroke="#7953ba"/);assert.match(app.html(),/21.00%/);assert.deepEqual(app.state(),before);});
test('Value mode shows capital rather than rebased percentages and excludes benchmark curves',()=>{const app=chartFixture(),before=app.state();app.click({action:'investment-metric:value'});assert.match(app.html(),/Portfolio value ·/);assert.doesNotMatch(app.html(),/<polyline[^>]+stroke="#7953ba"/);app.chartKey('Home');assert.match(app.elements.get('#holdings-tooltip').innerHTML,/1,600,000/);app.click({action:'investment-metric:return'});assert.match(app.html(),/Cumulative returns/);assert.deepEqual(app.state(),before);});
test('holding row opens scoped asset chart without editing financial data',()=>{const app=boot();app.click({page:'investment'});app.click({action:'investment-holding-new'});app.submitModal(holdingForm(app));const id=app.state().holdings[0].id,before=app.state();assert.match(app.html(),new RegExp('investment-security:'+id));app.click({action:'investment-security:'+id});assert.match(app.html(),/investment-security:all/);assert.match(app.html(),/Current holdings backtest/);assert.deepEqual(app.state(),before);});
test('chart pointer exploration clamps edges, pins a date and clears on pointer exit',()=>{const app=chartFixture(),before=app.state();app.chartPointer('pointermove',10);assert.equal(app.elements.get('#holdings-primary-date').textContent,'2026-01-01');app.chartPointer('pointermove',445);assert.equal(app.elements.get('#holdings-primary-date').textContent,'2026-03-01');app.chartPointer('pointerdown',10);app.chartPointer('pointermove',445);assert.equal(app.elements.get('#holdings-primary-date').textContent,'2026-01-01');app.chartPointer('pointerout',445);assert.equal(app.elements.get('#holdings-tooltip').hidden,false);app.click({action:'investment-reset-point'});assert.equal(app.elements.get('#holdings-tooltip').hidden,true);app.chartPointer('pointermove',200);app.chartPointer('pointerout',200);assert.equal(app.elements.get('#holdings-tooltip').hidden,true);assert.deepEqual(app.state(),before);});
test('touch dragging updates the inspected date even after touch pins the chart',()=>{const app=chartFixture();app.chartPointer('pointerdown',10,'touch');app.chartPointer('pointermove',445,'touch');assert.equal(app.elements.get('#holdings-primary-date').textContent,'2026-03-01');app.chartKey('Home');assert.equal(app.elements.get('#holdings-primary-date').textContent,'2026-01-01');});

test('privacy toggle enables ghost mode and persists preference without altering financial balances',()=>{
  const app=boot(), before=app.state();
  app.click({action:'privacy'});
  assert.equal(app.context.localStorage.getItem('inveys_hide_money'),'true');
  assert.equal(app.elements.get('#privacy-switch').textContent,'🔒');
  assert.deepEqual(app.state().accounts,before.accounts);
  app.click({action:'privacy'});
  assert.equal(app.context.localStorage.getItem('inveys_hide_money'),'false');
  assert.equal(app.elements.get('#privacy-switch').textContent,'👁');
  assert.deepEqual(app.state().accounts,before.accounts);
});

test('ghost mode formats signed amounts inside money span and budget badges render properly',()=>{
  const app=boot();
  app.click({page:'reports'});
  const reportsHtml=app.html();
  assert.match(reportsHtml,/<span class="money">(\+|\−)\s+/);
  app.click({page:'budget'});
  const budgetHtml=app.html();
  assert.match(budgetHtml,/budget-group-head/);
  assert.match(budgetHtml,/budget-remaining-badge/);
});

test('recurring cash flow calendar renders scheduled income paydays, bill chips and net cash',()=>{
  const app=boot();
  app.click({page:'calendar'});
  const html=app.html();
  assert.match(html,/calendar-grid/);
  assert.match(html,/income-chip/);
  assert.match(html,/bill-chip/);
  assert.match(html,/calendar-stats/);
});

test('addTransaction with goalId deducts from goal savings reserve without changing assets',()=>{
  const app=boot();
  const goalBefore=app.state().goals.find(g=>g.id==='g1').saved;
  assert.equal(goalBefore,1800000);
  app.click({action:'transaction-new'});
  app.submitModal({name:'Emergency dental',kind:'expense',amount:'200.00',accountId:'a1',date:'2026-10-14',goalId:'g1'});
  const goalAfter=app.state().goals.find(g=>g.id==='g1').saved;
  assert.equal(goalAfter,1780000);
  const tx=app.state().transactions.find(t=>t.name==='Emergency dental');
  assert.equal(tx.goalId,'g1');
  assert.equal(tx.amount,20000);
});

test('budget page renders flexible budget groups, progress bars and spending pace tracker',()=>{
  const app=boot();
  app.click({page:'budget'});
  const html=app.html();
  assert.match(html,/pace-banner/);
  assert.match(html,/budget-group-card/);
  assert.match(html,/budget-table/);
  assert.match(html,/Groceries/);
  assert.match(html,/Lifestyle/);
  assert.match(html,/rollover-pill/);
  assert.match(html,/pace-track-dual/);
});

test('budget setup modal creates category budget and persists in state',()=>{
  const app=boot();
  app.click({page:'budget'});
  app.click({action:'budget-setup'});
  assert.equal(app.elements.get('#modal').open,true);
  app.submitModal({category:'Dining',amount:'150.00',group:'flexible',rollover:true});
  const budget=app.state().budgets.find(b=>b.category==='Dining');
  assert.ok(budget);
  assert.equal(budget.amount,15000);
  assert.equal(budget.group,'flexible');
  assert.equal(budget.rollover,true);
  app.click({page:'budget'});
  assert.match(app.html(),/Dining/);
});

test('tx-rule action opens auto-rule modal pre-filled and rules-manage lists rules',()=>{
  const app=boot();
  const tx=app.state().transactions[0];
  app.click({action:'tx-rule:'+tx.id});
  assert.equal(app.elements.get('#modal').open,true);
  app.submitModal({name:'Auto Categorize Northstar',contains:'Northstar',kind:'income',accountId:'a1',currency:'USD',category:'Income',merchant:'Northstar Studio',ownerId:'',reviewerId:'',tags:'work',visibility:'keep',enabled:'enabled'});
  const rule=app.state().operations.rules.find(r=>r.name==='Auto Categorize Northstar');
  assert.ok(rule);
  assert.equal(rule.conditions.contains,'Northstar');
  assert.equal(rule.actions.category,'Income');
  assert.equal(rule.actions.name,'Northstar Studio');
  app.click({action:'rules-manage'});
  assert.equal(app.elements.get('#modal').open,true);
  assert.match(app.elements.get('#modal-body').innerHTML,/Auto Categorize Northstar/);
});

test('cashflow page renders Monarch-style multi-tier Sankey diagram and exports SVG',()=>{
  const app = boot(), files = [];
  app.context.Blob = class { constructor(parts) { files.push(parts.join('')); } };
  app.context.URL = { createObjectURL: () => 'blob:test', revokeObjectURL() {} };
  app.context.document.createElement = () => ({ click() {}, remove() {} });
  app.context.document.body.appendChild = () => {};

  app.click({ page: 'cashflow' });
  const html = app.html();
  assert.match(html, /cashflow-sankey-panel/);
  assert.match(html, /sankey-multitier-svg/);
  assert.match(html, /sankey-savings-badge/);
  assert.match(html, /data-action="cashflow-sankey-export"/);
  assert.match(html, /id="cashflow-sankey-month-select"/);

  // Month navigation
  app.click({ action: 'cashflow-sankey-month:plan' });
  assert.match(app.html(), /sankey-multitier-svg/);

  // Export SVG
  app.click({ action: 'cashflow-sankey-export' });
  assert.ok(files.length > 0);
  assert.match(files.at(-1), /xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(files.at(-1), /sankey-multitier-svg/);
});

test('investment page renders Rebalance tab with drift analysis, model presets, and cash-only allocation',()=>{
  const app = boot();
  app.click({ page: 'investment' });
  assert.match(app.html(), /data-action="investment-tab:rebalancer"/);

  app.click({ action: 'investment-tab:rebalancer' });
  const html = app.html();
  assert.match(html, /rebalancer-panel/);
  assert.match(html, /rebalancer-stat-card/);
  assert.match(html, /data-action="investment-rebalance-edit"/);
  assert.match(html, /data-action="investment-rebalance-cash"/);

  // Open Target Allocation modal
  app.click({ action: 'investment-rebalance-edit' });
  assert.equal(app.elements.get('#modal').open, true);
  assert.match(app.elements.get('#modal-body').innerHTML, /target-alloc-row/);
  assert.match(app.elements.get('#modal-body').innerHTML, /classic-60-40/);

  // Apply model preset in modal
  app.click({ action: 'investment-rebalance-preset:classic-60-40' });
  assert.equal(app.elements.get('#modal').open, true);

  // Close modal
  app.click({ action: 'modal-close' });
  assert.equal(app.elements.get('#modal').open, false);

  // Cash-only rebalance clear
  app.click({ action: 'investment-rebalance-cash-clear' });
  assert.match(app.html(), /rebalancer-panel/);
});

test('integrations page renders Crypto Exchange Connectors card and info modal',()=>{
  const app = boot();
  app.click({ page: 'integrations' });
  const html = app.html();
  assert.match(html, /data-action="crypto-connect-modal"/);
  assert.match(html, /data-action="crypto-exchanges-modal"/);
  assert.match(html, /crypto-exchange-grid/);
  assert.match(html, /Bybit/);
  assert.match(html, /Binance/);
  assert.match(html, /OKX/);
  assert.match(html, /Bitget/);

  // Open info modal
  app.click({ action: 'crypto-exchanges-modal' });
  assert.equal(app.elements.get('#modal').open, true);
  assert.match(app.elements.get('#modal-body').innerHTML, /crypto-sec-banner/);
  assert.match(app.elements.get('#modal-body').innerHTML, /Passphrase\?/);

  // Open sync modal
  app.click({ action: 'crypto-connect-modal' });
  assert.equal(app.elements.get('#modal').open, true);
  assert.match(app.elements.get('#modal-body').innerHTML, /crypto-exchange-select/);
  assert.match(app.elements.get('#modal-body').innerHTML, /crypto-api-key/);

  app.click({ action: 'modal-close' });
  assert.equal(app.elements.get('#modal').open, false);
});

test('investment page renders Sync Crypto CEX button and handles crypto sync review and commit',async()=>{
  const app = boot();
  app.click({ page: 'investment' });
  assert.match(app.html(), /data-action="investment-crypto-sync"/);

  app.click({ action: 'investment-crypto-sync' });
  assert.equal(app.elements.get('#modal').open, true);
  assert.match(app.elements.get('#modal-body').innerHTML, /crypto-sec-banner/);

  // Mock server responses for status and crypto/sync
  app.context.location.protocol = 'http:';
  app.context.fetch = async(url, opts) => {
    if (url === '/api/status') {
      return { ok: true, json: async () => ({ csrf: 'mock-csrf', crypto: true }) };
    }
    if (url === '/api/crypto/sync') {
      return {
        ok: true,
        json: async () => ({
          ok: true,
          demo: true,
          exchange: 'bybit',
          exchangeName: 'Bybit',
          count: 2,
          totalUsd: 15000,
          totalIdr: 240000000,
          holdings: [
            { symbol: 'BTC', name: 'Bitcoin', quantity: 0.15, priceUsd: 90000, valueUsd: 13500, priceIdr: 1440000000, valueIdr: 216000000, assetClass: 'Crypto' },
            { symbol: 'SOL', name: 'Solana', quantity: 10, priceUsd: 150, valueUsd: 1500, priceIdr: 2400000, valueIdr: 24000000, assetClass: 'Crypto' }
          ]
        })
      };
    }
    return { ok: false, json: async () => ({ error: 'Not found' }) };
  };

  // Submit sync modal with demo keys
  app.submitModal({
    exchange: 'bybit',
    apiKey: 'demo',
    apiSecret: 'demo',
    targetAccountId: app.state().accounts.find(a => a.type === 'Investment')?.id || '__new__'
  });

  // Allow async executeCryptoSync to complete
  await new Promise(resolve => setImmediate(resolve));
  await new Promise(resolve => setTimeout(resolve, 50));

  // Review modal should now be open
  assert.equal(app.elements.get('#modal').open, true);
  const reviewBody = app.elements.get('#modal-body').innerHTML;
  assert.match(reviewBody, /crypto-review-summary/);
  assert.match(reviewBody, /Bitcoin/);
  assert.match(reviewBody, /Solana/);

  // Commit import
  const targetAcc = app.state().accounts.find(a => a.type === 'Investment')?.id || '__new__';
  app.submitModal({
    targetAccountId: targetAcc,
    crypto_coin_0: '1',
    crypto_coin_1: '1'
  });

  // Verify holdings imported into state
  const updatedState = app.state();
  const btcHolding = updatedState.holdings.find(h => h.symbol === 'BTC');
  const solHolding = updatedState.holdings.find(h => h.symbol === 'SOL');
  assert.ok(btcHolding, 'BTC holding must exist');
  assert.ok(solHolding, 'SOL holding must exist');
  assert.equal(btcHolding.type, 'crypto');
  assert.equal(btcHolding.assetClass, 'Crypto');
  assert.equal(btcHolding.quantity, 0.15);
  assert.equal(solHolding.quantity, 10);
  assert.ok(updatedState.holdingPrices.some(p => p.holdingId === btcHolding.id));
});

test('investment page renders Pegadaian gold installment tracker and handles sync and payments', async () => {
  const app = boot();
  app.click({page: 'investment'});
  assert.match(app.html(), /Target & Rebalance/);
  assert.match(app.html(), /Gold Tracker|Cicilan Emas/);

  // Switch to gold tab
  app.click({action: 'investment-tab:gold'});
  const html = app.html();
  assert.match(html, /Pegadaian Mulia/);
  assert.match(html, /1379326370001000/);
  assert.match(html, /Muhamad Hendra Febriansyah/);
  assert.match(html, /Galeri 24/);
  assert.match(html, /50\.0000 Gram/);
  assert.match(html, /3\.338\.282/);
  assert.match(html, /Konservatif|Conservative/);
  assert.match(html, /Moderat|Moderate/);
  assert.match(html, /Bullish/);

  // Test 60-Month Amortization Schedule modal
  app.click({action: 'gold-schedule-modal'});
  assert.equal(app.elements.get('#modal').open, true);
  const modalBody = app.elements.get('#modal-body').innerHTML;
  assert.match(modalBody, /gold-schedule-table/);
  assert.match(modalBody, /1\.793\.557/);
  assert.match(modalBody, /671\.002/);
  assert.match(modalBody, /2\.464\.559/);
  assert.match(modalBody, /105\.819\.843/);

  // Sync to Ledger
  app.click({action: 'gold-sync-ledger'});
  const stateAfterSync = app.state();
  assert.equal(stateAfterSync.goldInstallment.synced, true);
  const goldAcc = stateAfterSync.accounts.find(a => a.id === 'acc-gold-pegadaian');
  assert.ok(goldAcc, 'Pegadaian gold account must exist');
  const goldHolding = stateAfterSync.holdings.find(h => h.id === 'h-gold-galeri24');
  assert.ok(goldHolding, 'Galeri 24 holding must exist');
  assert.equal(goldHolding.quantity, 50.0);
  const goldDebt = stateAfterSync.debts.find(d => d.id === 'debt-pegadaian-mulia');
  assert.ok(goldDebt, 'Pegadaian debt must exist');
  assert.equal(goldDebt.balance, 10761340000); // 107.613.400 in cents

  // Pay Month 1 Installment
  app.click({action: 'gold-pay-installment'});
  const stateAfterPay = app.state();
  assert.equal(stateAfterPay.goldInstallment.paidMonths, 1);
  const updatedDebt = stateAfterPay.debts.find(d => d.id === 'debt-pegadaian-mulia');
  assert.equal(updatedDebt.balance, (107613400 - 1793557) * 100);
});

test('integrations and settings render API key manager and allow tab switching', async () => {
  const app = boot();
  // Verify button in Settings
  app.click({page: 'settings'});
  assert.match(app.html(), /api-keys:all/);
  assert.match(app.html(), /Kelola Kunci API & Bot|AI API Keys & Telegram Bot/);

  // Verify buttons in Integrations
  app.click({page: 'integrations'});
  assert.match(app.html(), /api-keys:all/);
  assert.match(app.html(), /api-keys:gemini/);
  assert.match(app.html(), /api-keys:telegram/);
  assert.match(app.html(), /int-node-interactive/);

  // Open modal via api-keys:all
  app.click({action: 'api-keys:all'});
  await new Promise(resolve => setImmediate(resolve));
  const title = app.elements.get('#modal-title').textContent;
  const body = app.elements.get('#modal-body').innerHTML;
  assert.match(title, /Kelola Kunci API & Telegram Bot|Manage API Keys/);
  assert.match(body, /key-mgr-dialog/);
  assert.match(body, /api-key-tab:all/);
  assert.match(body, /api-key-tab:gemini/);
  assert.match(body, /api-key-tab:telegram/);
  assert.match(body, /api-key-save:gemini/);
  assert.match(body, /api-key-test:gemini/);
  assert.match(body, /api-key-save:telegram/);
  assert.match(body, /api-key-test:telegram/);

  // Target-specific modal opening
  app.click({action: 'api-keys:gemini'});
  await new Promise(resolve => setImmediate(resolve));
  assert.match(app.elements.get('#modal-body').innerHTML, /class="key-pane active" id="pane-gemini"/);

  app.click({action: 'api-keys:telegram'});
  await new Promise(resolve => setImmediate(resolve));
  assert.match(app.elements.get('#modal-body').innerHTML, /class="key-pane active" id="pane-telegram"/);
});

test('quick composer supports multi-line bulk paste, habit chips and batch draft controls',()=>{
  const app=boot();
  const acc1=app.state().accounts[0];

  // Check habit chips render
  assert.match(app.html(),/quick-habit-bar/);
  assert.match(app.html(),/data-quick-fill="Beli kopi 25rb"/);

  // Multi-line bulk paste
  const multiText='Kopi 25\nMakan siang 35\nBensin 50';
  app.submitPage('quick-form',{text:multiText,accountId:acc1.id});
  assert.match(app.html(),/Review drafts · 3|Tinjau draft · 3/);
  assert.match(app.html(),/Pilih yang Aman|Clean only/);
  assert.match(app.html(),/Pilih Semua|All/);
  assert.match(app.html(),/Batal Semua|None/);

  // Batch action Deselect All
  app.click({action:'capture-deselect-all'});
  assert.doesNotMatch(app.html(),/checked[^>]*>\s*(?:Save row 1|Simpan baris 1)/);

  // Batch action Select All
  app.click({action:'capture-select-all'});
  assert.match(app.html(),/checked[^>]*>\s*(?:Save row 1|Simpan baris 1)/);

  // Commit drafts
  app.click({action:'capture-save'});
  assert.doesNotMatch(app.html(),/Review drafts · 3|Tinjau draft · 3/);
  const txs=app.state().transactions;
  assert.ok(txs.some(t=>t.amount===2500&&t.name.includes('Kopi')));
  assert.ok(txs.some(t=>t.amount===3500&&t.name.includes('Makan siang')));
  assert.ok(txs.some(t=>t.amount===5000&&t.name.includes('Bensin')));
});

test('capture page renders AI smart extract button and handles ai-extract-statement flow',async()=>{
  const app=boot();
  app.click({page:'capture'});
  assert.match(app.html(),/capture-ai-extract/);
  assert.match(app.html(),/⚡ Ekstrak Cerdas AI|⚡ AI Smart Extract/);
  assert.match(app.html(),/text\/csv/);

  app.context.location.protocol='http:';
  let apiCalled=false;
  app.context.fetch=async(url,opts)=>{
    if(url==='/api/status')return {ok:true,json:async()=>({csrf:'test'})};
    if(url==='/api/ai-extract-statement'){
      apiCalled=true;
      return {
        ok:true,
        bank:'Bank BCA',
        period:'Oktober 2026',
        drafts:[
          {name:'Kopi Kenangan',date:'2026-10-10',kind:'expense',amount:'28000',currency:app.state().accounts[0].currency,category:'Makanan & Minuman'}
        ],
        provider:'gemini'
      };
    }
    return {ok:true,json:async()=>({})};
  };

  app.input('capture-text','2026-10-10 Kopi Kenangan 28000');
  app.click({action:'capture-ai-extract'});
  await new Promise(resolve=>setImmediate(resolve));
  await new Promise(resolve=>setImmediate(resolve));
  assert.ok(apiCalled);
  assert.match(app.html(),/Kopi Kenangan/);
  assert.match(app.html(),/280/);
  assert.match(app.html(),/id="capture-provider"/);
  assert.match(app.html(),/9Router Gateway/);
});

test('quick composer renders Vey cyber-vault mascot chatbot with animated SVG and status indicators', () => {
  const app = boot();
  // Expanded state
  assert.match(app.html(), /vey-top-bar/);
  assert.match(app.html(), /Cyber-Vault Guardian/);
  assert.match(app.html(), /vey-mascot-svg/);
  assert.match(app.html(), /vey-orbit-ring/);
  assert.match(app.html(), /vey-levitate/);
  assert.match(app.html(), /vey-live-badge/);

  // Minimized state
  app.outside();
  assert.match(app.html(), /quick-launcher/);
  assert.match(app.html(), /vey-launcher-avatar/);
  assert.match(app.html(), /vey-mascot-svg/);
  assert.match(app.html(), /<strong class="vey-name">Vey<\/strong>/);
});

test('administrator control panel renders access restriction in local mode and full control hub in admin server mode', () => {
  const localApp = boot();
  localApp.click({page: 'admin'});
  // In local mode (not server mode), VPS server mode required notice is displayed
  assert.match(localApp.html(), /Mode Server VPS Hostinger Diperlukan|Hostinger VPS Server Mode Required/);

  // In server mode as standard user, restricted access is displayed
  const userApp = boot(null, { isServerMode: true, currentUser: { id: 'usr-2', email: 'member@inveys.io', role: 'user', plan: 'plus' } });
  userApp.click({page: 'admin'});
  assert.match(userApp.html(), /Akses Terbatas|Restricted Access/);
  assert.match(userApp.html(), /Hak Akses Administrator Diperlukan|Administrator Privileges Required/);

  // In server mode with admin role, full monitoring control panel is displayed
  const adminApp = boot(null, { isServerMode: true, currentUser: { id: 'usr-1', email: 'admin@inveys.io', role: 'admin', plan: 'ultra' } });
  adminApp.click({page: 'admin'});
  assert.match(adminApp.html(), /Kontrol Panel Administrator|Administrator Control Panel/);
  assert.match(adminApp.html(), /admin-metrics-grid/);
  assert.match(adminApp.html(), /Hostinger Node 187\.77\.134\.249/);
  assert.match(adminApp.html(), /admin-search-input/);
  assert.match(adminApp.html(), /admin-table/);
  assert.match(adminApp.html(), /admin-user-tbody/);
  assert.match(adminApp.html(), /SQLite 3/);
  assert.match(adminApp.html(), /admin-export-db/);
  assert.match(adminApp.html(), /admin-broadcast-panel/);
  assert.match(adminApp.html(), /admin-broadcast-form/);
  assert.match(adminApp.html(), /admin-telegram-panel/);
  assert.match(adminApp.html(), /admin-test-telegram/);
  assert.match(adminApp.html(), /admin-config-telegram/);
  assert.match(adminApp.html(), /admin-audit-panel/);
  assert.match(adminApp.html(), /audit-table/);
});

test('native PWA install experience and biometric vault lock security render and act properly', () => {
  const app = boot();
  app.click({page: 'settings'});
  
  // Verify vault security & PWA panels render in settings
  assert.match(app.html(), /vault-security-panel/);
  assert.match(app.html(), /pwa-panel/);
  assert.match(app.html(), /Keamanan Brankas & Kunci Biometrik|Vault Security & Biometrics/);
  assert.match(app.html(), /Aplikasi Mandiri & PWA|Native App & PWA Installation/);
  assert.match(app.html(), /lock-vault-now/);
  assert.match(app.html(), /setup-biometric/);
  assert.match(app.html(), /setup-pin/);
  assert.match(app.html(), /setting-autolock-select/);
  assert.match(app.html(), /pwa-install/);

  // Trigger PWA install guide modal
  app.click({action: 'pwa-install'});
  const modalBody = app.elements.get('#modal-body').innerHTML;
  assert.match(modalBody, /pwa-guide-modal/);
  assert.match(modalBody, /Pengalaman Aplikasi Mandiri|Native Standalone App Experience/);

  // Trigger Vault Lock Screen
  app.click({action: 'lock-vault-now'});
  const lockScreen = app.elements.get('#vault-lock-screen');
  assert.equal(lockScreen.style.display, 'flex');
  assert.equal(app.context.sessionStorage.getItem('inveys_vault_locked'), '1');

  // Change auto-lock inactivity select
  app.changeField('setting-autolock-select', '30');
  assert.equal(app.context.localStorage.getItem('inveys_autolock'), '30');

  // Trigger PIN setup modal
  app.click({action: 'setup-pin'});
  const pinModalBody = app.elements.get('#modal-body').innerHTML;
  assert.match(pinModalBody, /pin-setup-form/);
  assert.match(pinModalBody, /new-pin-input/);
});



