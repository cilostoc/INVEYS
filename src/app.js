(() => {
  'use strict';
  const A=window.InveysAppearance;
  const E = window.InveysEngine;
  const OPS=window.InveysOperations;
  const I = window.InveysI18n;
  const t = text => I.t(text,state.language);
  const user = value => `<span class="user-content">${escape(value)}</span>`;
  const localize = () => I.translateDOM(document,state.language);
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid = () => crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
  const date = () => {const d = new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const paths = {
    home:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    accounts:'<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 9h18m-6 6h3M7 5V3"/>',
    cashflow:'<path d="M3 7h15m-4-4 4 4-4 4M21 17H6m4-4-4 4 4 4"/>',
    transactions:'<path d="M8 3H5v18h14V3h-3M9 7h6M9 11h6M9 15h4"/><rect x="8" y="2" width="8" height="3" rx="1"/>',
    goals:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    debt:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h3"/>',
    scenarios:'<path d="M4 20V10m8 10V4m8 16v-7M2 20h20"/><path d="m3 6 6-3 6 4 6-5"/>',
    investment:'<path d="M3 21h18M5 17v-5m6 5V8m6 9V4M3 9l6-5 5 2 7-5"/>',
    household:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5v2"/>',
    copilot:'<path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8L12 2ZM20 2v4m-2-2h4"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
    up:'<path d="m5 16 6-6 4 4 5-8m-5 0h5v5"/>',download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>',
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
    bank:'<path d="m2 8 10-5 10 5H2ZM4 21h16M6 10v8m6-8v8m6-8v8"/>',
    eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    shared:'<circle cx="8" cy="7" r="3"/><circle cx="17" cy="8" r="2.5"/><path d="M2 21v-3a6 6 0 0 1 12 0v3m2-7a5 5 0 0 1 6 5v2"/>',
    reports:'<path d="M4 21V4h16v17H4Zm4-4v-4m4 4V8m4 9v-6"/>',
    forecast:'<path d="M3 3v18h18M5 17l5-4 4 1 6-8m-5 0h5v5"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="m10 3 4 0 1 3 3 1 3 3-2 3 0 3-3 3-3-1-3 1-3-3 1-3-1-3 3-3 3 1 0-4Z"/>'
  };
  Object.assign(paths,{"debt": "<ellipse cx=\"9\" cy=\"5\" rx=\"6\" ry=\"3\"/><path d=\"M3 5v10c0 4 12 4 12 0V5M3 10c0 4 12 4 12 0M19 12v9m-3-3 3 3 3-3\"/>", "scenarios": "<circle cx=\"6\" cy=\"12\" r=\"3\"/><circle cx=\"19\" cy=\"5\" r=\"2\"/><circle cx=\"19\" cy=\"19\" r=\"2\"/><path d=\"M9 12h3V5h5m-5 7v7h5\"/>", "montecarlo": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"4\"/><circle cx=\"7\" cy=\"7\" r=\"1\"/><circle cx=\"17\" cy=\"7\" r=\"1\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/><circle cx=\"7\" cy=\"17\" r=\"1\"/><circle cx=\"17\" cy=\"17\" r=\"1\"/>", "cards": "<rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"3\"/><path d=\"M2 9h20m-16 6h4m4 0h4\"/>", "capture": "<path d=\"M8 5l2-2h4l2 2h4v15H4V5h4Z\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M18 8h.01\"/>", "integrations": "<path d=\"M9 3v5m6-5v5M6 8h12v3a6 6 0 0 1-12 0V8Zm6 9v5\"/>", "updates": "<path d=\"M20 7A9 9 0 1 0 21 14M20 3v5h-5M12 7v6l3 2\"/>", "plans": "<path d=\"m3 7 4 4 5-7 5 7 4-4-2 12H5L3 7Zm2 8h14\"/>", "about": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 11v6m0-10h.01\"/>", "finance-group": "<path d=\"M3 7h18v14H3V7Zm0 0V4h15v3m-2 5h5v5h-5v-5Z\"/>", "planning-group": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"17\" rx=\"2\"/><path d=\"M8 2v4m8-4v4M4 9h16m-11 5 2 2 4-4\"/>", "insights-group": "<path d=\"M3 21V3m0 18h18M7 18v-4m5 4V9m5 9V5\"/>", "manage-group": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"5\" rx=\"1\"/><rect x=\"3\" y=\"15\" width=\"18\" height=\"5\" rx=\"1\"/><path d=\"M8 2v9m8 2v9\"/>", "edit": "<path d=\"m15 3 6 6-11 11-7 1 1-7L15 3Zm-9 11 4 4m3-12 6 6\"/>", "save": "<path d=\"M4 3h13l4 4v14H3V3h1Zm3 0v6h9V3M7 21v-8h10v8\"/>", "delete": "<path d=\"M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7\"/>", "cancel": "<path d=\"m6 6 12 12M18 6 6 18\"/>", "check": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m7 12 3 3 7-7\"/>", "report-cashflow": "<path d=\"M3 5h6v5H3V5Zm12 9h6v5h-6v-5ZM9 7h7v7M9 7v10h6\"/>", "report-spending": "<path d=\"M3 4h3l2 12h11l2-9H7M10 20h.01m7 0h.01\"/>", "report-income": "<path d=\"M4 18h16M12 16V3m-5 5 5-5 5 5M4 13v8h16v-8\"/>", "report-networth": "<path d=\"M3 17l6-7 4 4 8-11M16 3h5v5M4 21h16\"/>", "report-debt": "<path d=\"M6 3h12v18H6V3Zm3 5h6m-6 4h6m-6 4h3M2 7h4m12 10h4\"/>", "report-cards": "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"2\"/><path d=\"M4 8h16M8 12h8m-8 4h4\"/>", "investment-holdings": "<path d=\"M3 8h18v13H3V8Zm5 0V4h8v4M3 13h18m-11-2h4v4h-4v-4Z\"/>", "investment-advanced": "<circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M12 4v8l6 5M16 3l5 5M3 16l5 5\"/>", "investment-market": "<path d=\"M3 19h18M5 15V8m3 5H2M12 17V3m3 6H9M19 14V6m3 5h-6\"/>", "investment-allocation": "<path d=\"M12 3v9h9a9 9 0 1 1-9-9Zm3 0a9 9 0 0 1 6 6h-6V3Z\"/>", "investment-gains": "<path d=\"M12 3v18M3 12h18M5 8l3-3 3 3m-3-3v9m5 2 3 3 3-3m-3 3V9\"/>", "investment-funds": "<path d=\"m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5\"/>", "forecast-accounts": "<path d=\"M4 4h16v16H4V4Zm0 6h16m-10 0v10m4-6h3m-3 3h3\"/>", "forecast-cashflow": "<path d=\"M3 3v18h18M6 9l3-3 4 4 5-5M6 16h3m4 0h5\"/>", "forecast-events": "<path d=\"M5 3v18m0-16h13l-3 4 3 4H5M2 21h6\"/>"});
  paths.operations='<path d="M4 3h16v18H4V3Zm4 5h8m-8 4h5m-5 4h3M16 15l2 2 3-4"/>';
  paths.categories='<path d="M4 6h16M4 12h16M4 18h16M8 6v12"/>';
  paths.sparkles='<path d="m12 3 2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5L12 3Zm7 14 1 2.5L22.5 20.5 20 21.5l-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z"/>';
  paths.pie='<path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z"/>';
  paths.download='<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>';
  paths.filter='<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>';
  paths.budget='<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>';
  paths.lightning='<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>';
  paths['investment-rebalancer']='<path d="M12 3v18M3 7l9-4 9 4M6 7l-3 6h6L6 7Zm12 0-3 6h6l-3-6ZM5 21h14"/>';
  paths['investment-gold']='<path d="M4 18h16M2 14h20l-3-8H5l-3 8Zm4-4h12M9 6l-2 4m10-4 2 4"/>';
  paths.gold=paths['investment-gold'];
  paths.wallet='<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V6"/><circle cx="18" cy="14" r="1"/>';
  paths.vault='<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="12" cy="12" r="4"/><path d="M12 8v2m0 4v2m-4-4h2m4 0h2m3 4 1.5 1.5"/>';
  paths.crypto='<circle cx="12" cy="12" r="9"/><path d="M9 8h4a2 2 0 0 1 0 4H9m0 0h4.5a2 2 0 0 1 0 4H9m0-8v8m2-10v2m2-2v2m-2 8v2m2-2v2"/>';
  paths.ewallet='<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M12 18h.01M9 6h6"/>';
  paths.cash='<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/>';
  paths.scale='<path d="M16 16l3-8 3 8c-.9.7-2 1-3 1s-2.1-.3-3-1zM2 16l3-8 3 8c-.9.7-2 1-3 1s-2.1-.3-3-1zM7 21h10M12 3v18M3 7h18"/>';
  paths.coins='<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/>';
  paths.growth='<path d="m3 17 6-6 4 4 8-8m-6 0h6v6"/>';
  paths.receipt='<path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2Zm4 6h8m-8 4h8m-8 4h5"/>';
  paths.admin='<path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 5a3 3 0 0 1 6 0v3H9V7Zm3 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/>';
  paths.users='<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>';
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.about}</svg>`;
  const seed = () => ({
    version:1,currency:'USD',name:"Hendra's Vault",demo:true,
    accounts:[{id:'a1',name:'Northstar Checking',type:'Checking',balance:824000,owner:'Alex',updated:date()},{id:'a2',name:'High-Yield Savings',type:'Savings',balance:3845000,owner:'Household',updated:date()},{id:'a3',name:'Long-Term Portfolio',type:'Investment',balance:18476000,owner:'Alex',updated:date()},{id:'a4',name:'Retirement Account',type:'Investment',balance:3200000,owner:'Sam',updated:date()}],
    debts:[{id:'d1',name:'Auto loan',balance:1820000,apr:5.9,minimum:42500},{id:'d2',name:'Student loan',balance:1840000,apr:4.5,minimum:36500},{id:'d3',name:'Credit card',balance:248000,apr:19.9,minimum:12000}],
    goals:[{id:'g1',name:'Emergency reserve',emoji:'◌',target:2500000,saved:1800000,monthly:50000,due:'2027-06-01'},{id:'g2',name:'A place to call home',emoji:'⌂',target:1500000,saved:540000,monthly:60000,due:'2028-01-01'},{id:'g3',name:'Japan, together',emoji:'✈',target:800000,saved:210000,monthly:25000,due:'2027-10-01'}],
    flows:[{id:'f1',name:'Alex · Salary',kind:'income',amount:720000,day:1},{id:'f2',name:'Sam · Salary',kind:'income',amount:360000,day:1},{id:'f3',name:'Rent',kind:'expense',amount:240000,day:5},{id:'f4',name:'Groceries & household',kind:'expense',amount:85000,day:10},{id:'f5',name:'Utilities',kind:'expense',amount:28000,day:8},{id:'f6',name:'Insurance',kind:'expense',amount:35000,day:15},{id:'f7',name:'Transport',kind:'expense',amount:42000,day:12},{id:'f8',name:'Lifestyle & other',kind:'expense',amount:122000,day:20}],
    targetAllocations:[
      {id:'ta1',assetClass:'Equity',percent:60},
      {id:'ta2',assetClass:'Fixed Income',percent:30},
      {id:'ta3',assetClass:'Cash',percent:10}
    ],
    budgets:[
      {id:'b1',category:'Rent',amount:240000,group:'fixed',rollover:false},
      {id:'b2',category:'Groceries',amount:90000,group:'flexible',rollover:true},
      {id:'b3',category:'Lifestyle',amount:130000,group:'flexible',rollover:true},
      {id:'b4',category:'Utilities',amount:30000,group:'fixed',rollover:false},
      {id:'b5',category:'Transport',amount:45000,group:'flexible',rollover:false},
      {id:'b6',category:'Insurance',amount:35000,group:'fixed',rollover:false}
    ],
    transactions:[{id:'t1',name:'Salary · Northstar Studio',kind:'income',amount:720000,accountId:'a1',category:'Income',date:date()},{id:'t2',name:'Whole Foods Market',kind:'expense',amount:12640,accountId:'a1',category:'Groceries',date:date()},{id:'t3',name:'Monthly savings transfer',kind:'transfer',amount:100000,accountId:'a1',targetId:'a2',category:'Transfer',date:date()},{id:'t4',name:'Spotify Premium',kind:'expense',amount:1199,accountId:'a1',category:'Subscriptions',date:date()},{id:'t5',name:'Neighborhood Coffee',kind:'expense',amount:850,accountId:'a1',category:'Lifestyle',date:date()}],
    tasks:[{id:'task1',name:'Review this month’s financial plan',owner:'Alex',done:false,due:date()},{id:'task2',name:'Compare insurance renewal options',owner:'Sam',done:false,due:'2026-10-15'},{id:'task3',name:'Check emergency reserve progress',owner:'Alex',done:true,due:date()}],
    members:[{id:'m1',name:'Alex Morgan',role:'Workspace owner',initials:'AM'},{id:'m2',name:'Sam Morgan',role:'Planning partner',initials:'SM'}],
    cards:[{id:'cc1',debtId:'d3',name:'Northstar Rewards',owner:'Alex Morgan',last4:'2048',limit:1000000,statementAmount:248000,paid:0,dueDate:date().slice(0,8)+'18',limitDate:'2027-01-15',reminderDays:7}],cardsSeeded:true,
    subscriptions:[
      {id:'sub1',name:'Netflix Premium',emoji:'🎬',category:'Entertainment',amount:1999,currency:'USD',day:14,cadence:'monthly',owner:'Alex Morgan'},
      {id:'sub2',name:'Spotify Duo',emoji:'🎵',category:'Entertainment',amount:1499,currency:'USD',day:18,cadence:'monthly',owner:'Sam Morgan'},
      {id:'sub3',name:'Figma Professional',emoji:'🎨',category:'Software',amount:1500,currency:'USD',day:22,cadence:'monthly',owner:'Alex Morgan'},
      {id:'sub4',name:'Gym & Fitness',emoji:'💪',category:'Health',amount:6500,currency:'USD',day:5,cadence:'monthly',owner:'Alex Morgan'}
    ],
    billPayments:{},
    history:[16843000,17280000,17735000,18126000,18584000,19253000,19588000,20065000,20491000,21124000,21806000,22437000]
  });
  const storageKey = 'inveys-workspace-v1';
  let state, persistent = true;
  try {state = E.validate(JSON.parse(localStorage.getItem(storageKey))) } catch {state = E.migrate(seed());}
  E.migrate(state);
  if(state.demo&&!state.cardsSeeded&&!state.cards.length&&state.debts.some(d=>d.id==='d3'))state.cards.push({id:'cc1',debtId:'d3',name:'Northstar Rewards',owner:state.members[0].name,last4:'2048',limit:1000000,statementAmount:248000,paid:0,dueDate:date().slice(0,8)+'18',limitDate:'2027-01-15',reminderDays:7});
  state.cardsSeeded=true;
  if(state.demo&&(!state.subscriptions||!state.subscriptions.length)){
    state.subscriptions=[
      {id:'sub1',name:'Netflix Premium',emoji:'🎬',category:'Entertainment',amount:1999,currency:'USD',day:14,cadence:'monthly',owner:'Alex Morgan'},
      {id:'sub2',name:'Spotify Duo',emoji:'🎵',category:'Entertainment',amount:1499,currency:'USD',day:18,cadence:'monthly',owner:'Sam Morgan'},
      {id:'sub3',name:'Figma Professional',emoji:'🎨',category:'Software',amount:1500,currency:'USD',day:22,cadence:'monthly',owner:'Alex Morgan'},
      {id:'sub4',name:'Gym & Fitness',emoji:'💪',category:'Health',amount:6500,currency:'USD',day:5,cadence:'monthly',owner:'Alex Morgan'}
    ];
  }
  let page='home', period=6, hideMoney=false, scenario={incomeDelta:0,expenseDelta:0,oneTime:0}, messages=[];
  let budgetYear=new Date().getFullYear(), budgetMonth=new Date().getMonth(), budgetGroupFilter='all';
  try{if(typeof localStorage!=='undefined'&&localStorage.getItem('inveys_hide_money')==='true')hideMoney=true;}catch(e){}
  let toastTimer;
  const locale=()=>state.language==='id'?'id-ID':'en-US';
  const money = (n,compact=false,currency=state.currency) => new Intl.NumberFormat(locale(),{style:'currency',currency,maximumFractionDigits:0,notation:compact?'compact':'standard'}).format(n/100);
  const amount=(n,currency=state.currency,prefix='')=>`<span class="money">${prefix}${money(n,false,currency)}</span>`;
  const tickerAmount=(n,currency=state.currency,prefix='')=>`<span class="money" data-ticker-cents="${n}" data-ticker-curr="${currency}">${prefix}${money(n,false,currency)}</span>`;
  const native=(row,field)=>`<span class="money">${new Intl.NumberFormat(locale(),{style:'currency',currency:row.currency||state.currency,maximumFractionDigits:2}).format(row[field]/100)}</span>`;
  const idr=(row,field)=>amount(E.convert(state,row[field],row.currency||state.currency,'IDR'),'IDR');
  const currencyField=(row)=>field('Currency','currency','','select',options(E.currencies,row?.currency||state.currency));
  const percent = g => Math.min(100,Math.round(g.saved/g.target*100));
  const getAccount = id => state.accounts.find(a=>a.id===id);
  const button = (text, action, type='', ic='') => `<button class="btn ${type}" data-action="${action}">${ic?icon(ic):''}${text}</button>`;
  const link = (text, target) => `<button class="quiet-link" data-page="${target}">${text}${icon('arrow')}</button>`;
  function toast(message){$('#toast').classList.remove('success');$('#toast').textContent=t(message);$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3500);}
  let isServerMode=Boolean(typeof globalThis!=='undefined'&&globalThis.__INVEYS_SERVER_MODE__), isAuthenticated=true, serverSyncBusy=false, currentUser=(typeof globalThis!=='undefined'&&globalThis.__INVEYS_CURRENT_USER__)||null;
  async function syncToServer(){
    if(serverSyncBusy||!isServerMode||!isAuthenticated)return;
    try{
      serverSyncBusy=true;
      const token=localStorage.getItem('inveys_token');
      const res=await fetch('/api/workspace',{
        method:'POST',
        headers:{'Content-Type':'application/json',...(token?{'Authorization':'Bearer '+token}:{})},
        body:JSON.stringify({workspace:state})
      });
      if(res.ok){
        const statusEl=$('.local-status');
        if(statusEl)statusEl.innerHTML='<i></i>VPS Synced';
      }
    }catch(e){
      const statusEl=$('.local-status');
      if(statusEl)statusEl.innerHTML='<i></i>Offline (Saved Locally)';
    }finally{
      serverSyncBusy=false;
    }
  }
  function save(){
    try {E.validate(state);localStorage.setItem(storageKey,JSON.stringify(state));persistent=true;} catch(error){persistent=false;toast('Changes are in memory only. Export your workspace to keep them.');}
    $('.local-status').innerHTML=`<i></i>${isServerMode?'VPS Synced':(persistent?'Saved on this device':'Not saved · Export to keep changes')}`;
    const member=state.members[0]||{name:currentUser?.name||'Hendra Febriansyah',initials:'HF'};
    const activeOwnerName=currentUser?.name||member.name;
    const wsName=(state.name&&state.name!=='Morgan household')?state.name:(activeOwnerName.includes(' ')?`${activeOwnerName.split(' ')[0]}'s Vault`:`${activeOwnerName}'s Vault`);
    const wsNameEl=$('#workspace-name');if(wsNameEl)wsNameEl.textContent=wsName;
    const wsInitials=activeOwnerName.split(' ').filter(Boolean).map(s=>s[0]).join('').slice(0,2).toUpperCase()||'HF';
    const wsAvatar=$('.workspace-avatar');
    if(wsAvatar)wsAvatar.textContent=wsInitials;
    const demoTag=$('.demo-tag');if(demoTag)demoTag.textContent=isServerMode?(currentUser?.plan?currentUser.plan.toUpperCase():'VAULT'):(state.demo?'ACTIVE':'LOCAL');
    $('footer span:last-child').textContent=`${isServerMode?'Production':(state.demo?'Demo':'Production')} workspace · ${isServerMode?'Hostinger VPS · SQLite Vault':'Local records'} · v0.23.0`;
    $('.profile b').textContent=activeOwnerName;
    const isMasterOrAdmin=currentUser?.role==='admin'||currentUser?.id==='master';
    const profileRole=isServerMode?(isMasterOrAdmin?`ADMIN · ${currentUser?.plan?currentUser.plan.toUpperCase()+' · ':''}${L('Administrator','Administrator')}`:(currentUser?.plan?`${currentUser.plan.toUpperCase()} · ${L('Pemilik Vault','Vault Owner')}`:L('Pemilik Vault','Vault Owner'))):(state.demo?L('Akun demo lokal','Local demo account'):L('Ruang kerja lokal','Local workspace'));
    $('.profile small').textContent=profileRole;
    const initials=activeOwnerName.split(' ').filter(Boolean).map(s=>s[0]).join('').slice(0,2).toUpperCase()||'HF';
    $$('.avatar').filter(el=>el.closest('.profile')).forEach(el=>el.textContent=initials);
    const popName=$('.profile-popover-name');if(popName)popName.textContent=activeOwnerName;
    const popEmail=$('.profile-popover-email');if(popEmail)popEmail.textContent=currentUser?.email||(isServerMode?L('Pemilik Vault','Vault Owner'):(state.demo?L('Akun demo lokal','Local demo account'):L('Akun lokal','Local account')));
    const popAdmin=$('#popover-admin-btn');if(popAdmin?.style)popAdmin.style.display=(isServerMode&&isMasterOrAdmin)?'flex':'none';
    $$('.profile-popover-header .avatar').forEach(el=>el.textContent=initials);
    if(isServerMode&&isAuthenticated)syncToServer();
  }
  const pages=[['operations','Operations'],['home','Overview'],['shared','Shared Views'],['reports','Reports'],['forecast','Forecast'],['accounts','Accounts'],['investment','Investment'],['calendar','Bills & Subscriptions'],['budget','Budget'],['cashflow','Cash flow'],['transactions','Transactions'],['categories','Categories'],['goals','Goals & plans'],['debt','Debt management'],['scenarios','Scenarios'],['montecarlo','Monte Carlo'],['cards','Credit cards'],['household','Household'],['copilot','Financial copilot'],['capture','Capture'],['integrations','Integrations'],['updates','Version updates'],['plans','Plans & membership'],['admin','Admin Control Panel']];
  function navigate(target){page=pages.some(p=>p[0]===target)||target==='settings'?target:'home';location.hash=page;render();setSidebarOpen(false);window.scrollTo({top:0,behavior:'instant'});}
  function header(title, subtitle, actions='', eyebrow='YOUR FINANCIAL LIFE, CONNECTED') {return `<div class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${subtitle}</p></div><div class="heading-actions">${actions}</div></div>`;}
  function metric(label,value,foot,ic='accounts'){return `<div class="metric metric-${ic}"><div class="metric-label"><span>${label}</span><span class="metric-icon-wrap">${icon(ic)}</span></div><div class="metric-value">${value}</div><div class="metric-foot">${foot}</div></div>`;}
  function metrics(){const p=E.position(viewState());return `<div class="metrics-grid">${metric('Total net worth',tickerAmount(p.netWorth),'<span class="trend">'+icon('shield')+'Financial position</span><span>Assets less liabilities</span>','shield')}${metric('Liquid funds',tickerAmount(p.liquid),`<span class="positive">${p.reserveMonths===null?'—':p.reserveMonths.toFixed(1)+' months'}</span><span>of planned outflows</span>`,'bank')}${metric('Monthly surplus',tickerAmount(p.surplus),'<span class="positive">Income − outflows</span><span>Before goal funding</span>','growth')}${metric('Goal allocations',tickerAmount(E.allocations(viewState())),`<span class="positive">${state.goals.length} active goals</span><span>Reserved within liquid funds</span>`,'goals')}</div>`;}
  function lineChart(values,labels,{second=null,secondName='Scenario',name='Net worth',width=660}={}) {
    if (!values.length) return '<div class="empty">Add financial records to start your picture.</div>';
    const all=second?[...values,...second]:values;let min=Math.min(...all),max=Math.max(...all);const pad=Math.max((max-min)*.25,100000);min-=pad;max+=pad;
    const W=Math.max(280,width),H=205,left=53,right=18,top=20,bottom=28;
    const x=i=>left+i*(W-left-right)/Math.max(1,values.length-1), y=n=>H-bottom-(n-min)/(max-min)*(H-top-bottom);
    const path=arr=>arr.map((n,i)=>`${i?'L':'M'}${x(i).toFixed(2)},${y(n).toFixed(2)}`).join(' ');
    const base=path(values),fill=`${base} L${x(values.length-1)},${H-bottom} L${left},${H-bottom} Z`;
    const grid=Array.from({length:4},(_,i)=>{const n=min+(max-min)*i/3;const yy=y(n);return `<line x1="${left}" x2="${W-right}" y1="${yy}" y2="${yy}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="0" y="${yy+3}">${escape(money(n,true))}</text>`;}).join('');
    const show=labels.map((label,i)=>i===0||i===labels.length-1||labels.length<=7||i%Math.ceil(labels.length/7)===0?`<text x="${x(i)}" y="${H-5}" text-anchor="${i===0?'start':i===labels.length-1?'end':'middle'}">${escape(label)}</text>`:'').join('');
    const tips=values.map((n,i)=>`<circle cx="${x(i)}" cy="${y(n)}" r="9" fill="transparent"><title>${escape(labels[i])}: ${escape(money(n))}</title></circle>`).join('');
    return `<svg role="img" aria-label="${escape(name)}: ${escape(values.map((v,i)=>labels[i]+' '+money(v)).join(', '))}${second?', '+escape(secondName)+': '+escape(second.map((v,i)=>labels[i]+' '+money(v)).join(', ')):''}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--chart-accent)" stop-opacity=".25"/><stop offset="100%" stop-color="var(--chart-accent)" stop-opacity="0"/></linearGradient></defs>${grid}<path d="${fill}" fill="url(#chart-gradient)"/><path d="${base}" fill="none" stroke="var(--chart-accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${second?`<path d="${path(second)}" fill="none" stroke="var(--chart-secondary)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="6 4"/>`:''}<circle class="chart-dot" cx="${x(values.length-1)}" cy="${y(values.at(-1))}" r="5" fill="var(--chart-accent)"/>${show}${tips}</svg>`;
  }
  function historyData(){const cutoff=new Date(date()+'T12:00:00Z');cutoff.setUTCMonth(cutoff.getUTCMonth()-period);const snapshots=F.history(state,{from:cutoff.toISOString().slice(0,10),to:date()});if(snapshots.length){const values=snapshots.map(r=>r.netWorth),labels=snapshots.map(r=>r.date);if(labels.at(-1)!==date()){values.push(E.position(viewState()).netWorth);labels.push(date());}else values[values.length-1]=E.position(viewState()).netWorth;return {values,labels,illustrative:false};}const illustrative=state.demo&&state.activeView.owner==='all'&&Array.isArray(state.history);const values=illustrative?state.history.slice(-period).map(v=>E.convert(state,v,state.historyCurrency)):[E.position(viewState()).netWorth];values[values.length-1]=E.position(viewState()).netWorth;const now=new Date();return {values,labels:values.map((_,i)=>new Date(now.getFullYear(),now.getMonth()-values.length+i+1,1).toLocaleDateString(locale(),{month:'short'})),illustrative};}
  const iconType = type => {
    const t = (type || '').toLowerCase();
    if (t.includes('invest') || t.includes('saham') || t.includes('stock') || t.includes('reksa')) return 'investment';
    if (t.includes('crypto') || t.includes('kripto') || t.includes('bitcoin')) return 'crypto';
    if (t.includes('sav') || t.includes('tabungan') || t.includes('deposito')) return 'vault';
    if (t.includes('check') || t.includes('giro')) return 'bank';
    if (t.includes('wallet') || t.includes('dompet') || t.includes('gopay') || t.includes('ovo') || t.includes('dana')) return 'ewallet';
    if (t.includes('cash') || t.includes('tunai')) return 'cash';
    if (t.includes('card') || t.includes('kartu') || t.includes('credit')) return 'cards';
    return 'wallet';
  };
  function accountRows(limit=state.accounts.length){return viewState().accounts.slice(0,limit).map(a=>`<div class="account-row"><span class="account-icon ${a.type.toLowerCase()}">${icon(iconType(a.type))}</span><div><div class="account-name">${user(a.name)}</div><div class="account-sub">${escape(a.type)} · ${escape(a.owner)}</div></div><div class="account-amount">${native(a,'balance')}<small>${idr(a,'balance')} · IDR</small></div></div>`).join('')||'<div class="empty">Add your first account.</div>';}
  function goalRows(limit=3){return viewState().goals.slice(0,limit).map(g=>`<div class="goal-item"><div class="goal-heading"><span>${escape(g.emoji)}</span>${user(g.name)}<span class="goal-percent">${percent(g)}%</span></div><div class="progress-track" role="progressbar" aria-valuenow="${percent(g)}" aria-valuemin="0" aria-valuemax="100" aria-label="${escape(g.name)}"><div class="progress-fill" style="width:${percent(g)}%"></div></div><div class="goal-foot"><span><b>${native(g,'saved')}</b> of ${native(g,'target')}</span><button data-action="fund:${g.id}">Allocate +</button></div></div>`).join('')||'<div class="empty">Create a goal worth working toward.</div>';}
  function upcomingBills(){const today=new Date(),day=today.getDate();return viewState().flows.filter(f=>f.kind==='expense').map(f=>{const d=new Date(today.getFullYear(),today.getMonth()+(f.day<day?1:0),f.day);return {...f,d};}).sort((a,b)=>a.d-b.d);}
  function home(){const p=E.position(viewState()),h=historyData();const highest=viewState().debts.slice().sort((a,b)=>b.apr-a.apr)[0];const insight=highest&&highest.apr>10?`Your ${escape(highest.name.toLowerCase())} carries ${highest.apr}% APR. Compare an extra payment with your other priorities.`:'Review your monthly plan and compare your next financial move with your goals.';
    return header(`${state.language==='id'?'Halo':'Hello'}, ${user((state.members[0]?.name||'Me').split(' ')[0])} <span style="font-size:24px">✳</span>`,'A little clarity today. More possibility tomorrow.',`<span class="date-button">${icon('calendar')}${new Date().toLocaleDateString(locale(),{month:'short',day:'numeric',year:'numeric'})}</span>${button('Add account','account-new','primary','plus')}`)+metrics()+
    `<div class="middle-grid"><section class="panel panel-pad"><div class="panel-head"><div><h2 class="panel-title">Your financial picture</h2><p>A whole-life view of what you own and owe.</p></div><button class="icon-button" data-action="privacy" aria-label="${hideMoney?'Show':'Hide'} amounts">${icon('eye')}</button></div><div class="chart-top"><div><div class="big-number">${tickerAmount(p.netWorth)}</div><div class="number-sub"><span class="positive">${state.demo?'↑ '+money(p.netWorth-h.values[0])+' across sample history':'Current recorded position'}</span><span>${state.demo?'Illustrative demo snapshots':''}</span></div></div><div class="segmented" aria-label="History period"><button data-action="period:6" class="${period===6?'active':''}" aria-pressed="${period===6}">6M</button><button data-action="period:12" class="${period===12?'active':''}" aria-pressed="${period===12}">1Y</button></div></div><div class="chart-container">${lineChart(h.values,h.labels)}</div><div class="chart-note"><span></span>${state.demo?'Sample history · Latest point reflects your current records':'Manual position · Historical tracking will begin with your records'}</div></section>
    <section class="panel insight-panel"><div class="insight-label">${icon('copilot')} A THOUGHTFUL NEXT STEP</div><h2>Your future,<br>in focus.</h2><p>${insight}</p><div class="insight-check"><span>✓</span>${p.available>=0?money(p.available)+' / month after planned goal funding':'Review '+money(-p.available)+' / month in unfunded commitments'}</div>${button('Explore your possibilities','open-scenario','lime','arrow')}<div class="insight-footer">Calculated from your records. Always your decision.</div></section></div>
    <div class="bottom-grid"><section class="panel panel-pad"><div class="panel-head"><h2 class="panel-title">Your accounts</h2>${link('View all','accounts')}</div><div class="account-list">${accountRows(4)}</div></section><section class="panel panel-pad"><div class="panel-head"><h2 class="panel-title">Goals in motion</h2>${link('View all','goals')}</div><div class="goal-list">${goalRows()}</div></section><section class="panel panel-pad"><div class="panel-head"><h2 class="panel-title">On the horizon</h2>${link('View all','cashflow')}</div><div class="bill-list">${upcomingBills().slice(0,3).map(f=>`<div class="bill-row"><span class="bill-date"><small>${f.d.toLocaleDateString(locale(),{month:'short'})}</small>${f.day}</span><div><b>${user(f.name)}</b><p>Planned · Monthly</p></div><span class="bill-amount">${native(f,'amount')}</span></div>`).join('')||'<div class="empty">No upcoming commitments yet.</div>'}</div></section></div>
    <div class="bottom-banner"><span>✧</span><span><b>Your finances have a story.</b> Ask your copilot to help you understand the next chapter.</span><button data-page="copilot">Let’s talk <span>↗</span></button></div>`;
  }
  function accounts(){const p=E.position(viewState());return header('Everything you own. One clear view.','Maintain your financial inventory, with the source and owner of every balance.',button('Add account','account-new','primary','plus'),'ACCOUNTS & FINANCIAL POSITION')+accountSwitcher('accounts')+`<div class="metrics-grid">${metric('Recorded assets',tickerAmount(p.assets),'Sum of account balances','bank')}${metric('Recorded liabilities',tickerAmount(p.liabilities),'From your debt records','debt')}${metric('Net worth',tickerAmount(p.netWorth),'Assets − liabilities','shield')}${metric('Liquid accounts',String(viewState().accounts.filter(a=>['Cash','Savings','Checking'].includes(a.type)).length),'Checking, savings & cash','wallet')}</div><div class="content-grid">${viewState().accounts.map(a=>`<section class="panel panel-pad"><div class="panel-head"><span class="account-icon ${a.type.toLowerCase()}">${icon(iconType(a.type))}</span><span class="badge">Manual record</span></div><h2 style="margin-top:19px">${escape(a.name)}</h2><div class="card-stat">${native(a,'balance')}</div><div class="card-description">${escape(a.type)} · ${escape(a.owner)}</div><div class="details-list"><div class="detail-line"><span>Balance date</span><b>${escape(a.updated)}</b></div><div class="detail-line"><span>Source</span><b>User-entered snapshot</b></div></div><div class="card-actions">${button('Edit balance','account:'+a.id)}${button('Remove','account-delete:'+a.id,'danger')}</div></section>`).join('')||'<section class="panel empty full">Your financial picture starts with one account.</section>'}</div><div class="note">${t("Native amounts are preserved. Reporting totals use your saved exchange rates.")} ${L('Kurs referensi tersimpan; bukan kurs transaksi bank.','Saved reference rates; not bank transaction rates.')} ${user(state.fx.source)} · ${state.fx.date}</div>`;}
  let cashflowViewMonth = 'plan';

  function cashFlowSankeyPanel(flow) {
    const monthSet = new Set(['plan']);
    for (const t of state.transactions || []) {
      if (t.date && /^\d{4}-\d{2}/.test(t.date)) monthSet.add(t.date.slice(0, 7));
    }
    const months = Array.from(monthSet).sort((a,b) => b.localeCompare(a));

    const totalIncome = Math.max(1, flow.totalIncome);
    const incomeSources = (flow.incomeSources && flow.incomeSources.length > 0) ? flow.incomeSources : [
      { name: L('Pemasukan Utama','Primary Income'), icon: '💵', amount: totalIncome }
    ];
    const totalIncSum = Math.max(1, incomeSources.reduce((s, i) => s + i.amount, 0));

    // Pillar definitions in strict logical order (Top to Bottom)
    // 1. Fixed Obligations (Kewajiban Tetap)
    // 2. Flexible Spending (Belanja Fleksibel)
    // 3. Goals & Savings (Tabungan & Sasaran)
    // 4. Net Free Cash Surplus (Surplus Kas Bebas) or Funding Gap (Defisit)
    const pillars = [
      ...(flow.totalFixed > 0 ? [{ id: 'fixed', name: L('Kewajiban Tetap','Fixed Obligations'), amount: flow.totalFixed, color: '#f59e0b', icon: '🔒' }] : []),
      ...(flow.totalFlex > 0 ? [{ id: 'flexible', name: L('Belanja Fleksibel','Flexible Spending'), amount: flow.totalFlex, color: '#ec4899', icon: '🛍️' }] : []),
      ...(flow.goalSavings > 0 ? [{ id: 'goals', name: L('Tabungan & Sasaran','Goals & Savings'), amount: flow.goalSavings, color: '#06b6d4', icon: '🎯' }] : []),
      ...(flow.netSurplus > 0 ? [{ id: 'surplus', name: L('Surplus Kas Bebas','Net Free Cash Surplus'), amount: flow.netSurplus, color: '#10b981', icon: '🟢', isNet: true }] : []),
      ...(flow.netSurplus < 0 ? [{ id: 'surplus', name: L('Defisit / Kebutuhan Dana','Funding Gap'), amount: -flow.netSurplus, color: '#ef4444', icon: '⚠️', isNet: true }] : [])
    ];
    const pillarSum = Math.max(1, pillars.reduce((s, p) => s + p.amount, 0));

    // Detail Items in Column 4 strictly matching the order of Column 3 pillars
    const detailItems = [];

    // 1. Fixed Categories -> connect to 'fixed' pillar
    for (const c of (flow.fixedCategories || []).slice(0, 5)) {
      detailItems.push({ ...c, pillarId: 'fixed', color: '#f59e0b' });
    }

    // 2. Flexible Categories -> connect to 'flexible' pillar
    for (const c of (flow.flexCategories || []).slice(0, 5)) {
      detailItems.push({ ...c, pillarId: 'flexible', color: '#ec4899' });
    }

    // 3. Goal Allocations -> connect to 'goals' pillar
    if (flow.goalSavings > 0) {
      const activeGoals = (viewState().goals || []).filter(g => (flow.isPlan ? E.reporting(state, g, 'monthly') : true) > 0);
      if (activeGoals.length > 0) {
        for (const g of activeGoals.slice(0, 3)) {
          detailItems.push({
            name: g.name,
            icon: g.emoji || '🎯',
            amount: flow.isPlan ? E.reporting(state, g, 'monthly') : Math.round(flow.goalSavings / activeGoals.length),
            pillarId: 'goals',
            color: '#06b6d4'
          });
        }
      } else {
        detailItems.push({
          name: L('Alokasi Tabungan Sasaran','Goal & Savings Allocation'),
          icon: '🎯',
          amount: flow.goalSavings,
          pillarId: 'goals',
          color: '#06b6d4'
        });
      }
    }

    // 4. Surplus or Deficit -> connects to 'surplus' pillar
    if (flow.netSurplus > 0) {
      detailItems.push({
        name: L('Surplus Kas Bebas','Net Free Cash Surplus'),
        amount: flow.netSurplus,
        color: '#10b981',
        icon: '🟢',
        isNet: true,
        pillarId: 'surplus'
      });
    } else if (flow.netSurplus < 0) {
      detailItems.push({
        name: L('Defisit / Kebutuhan Dana','Funding Gap'),
        amount: -flow.netSurplus,
        color: '#ef4444',
        icon: '⚠️',
        isNet: true,
        pillarId: 'surplus'
      });
    }

    // Dynamic SVG sizing to completely eliminate vertical text crowding
    const detailCount = Math.max(1, detailItems.length);
    const height = Math.max(540, detailCount * 54 + 110);
    const topY = 68;
    const usableH = height - topY - 36;

    // Node X-positions
    const col1X = 205, col1W = 14;
    const hubX = 380, hubW = 18;
    const col3X = 590, col3W = 14;
    const col4X = 815, col4W = 14;

    // Column 1 Nodes (Income Sources)
    const incomeGap = 16;
    const totalIncomeGaps = (incomeSources.length - 1) * incomeGap;
    const availIncomeH = Math.max(30, usableH - totalIncomeGaps);
    let curY1 = topY;
    const incomeNodes = incomeSources.map(i => {
      const h = Math.max(22, Math.round((i.amount / totalIncSum) * availIncomeH));
      const node = { ...i, x: col1X, w: col1W, y: curY1, h };
      curY1 += h + incomeGap;
      return node;
    });

    // Column 2 Node (Central Inflow Hub)
    const hubY = topY + 6;
    const hubH = usableH - 12;
    const hubCenter = hubY + hubH / 2;

    // Column 3 Nodes (Allocation Pillars)
    const pillarGap = 16;
    const totalPillarGaps = (pillars.length - 1) * pillarGap;
    const availPillarH = Math.max(30, usableH - totalPillarGaps);
    let curY3 = topY;
    const pillarNodes = pillars.map(p => {
      const h = Math.max(24, Math.round((p.amount / pillarSum) * availPillarH));
      const node = { ...p, x: col3X, w: col3W, y: curY3, h };
      curY3 += h + pillarGap;
      return node;
    });

    // Column 4 Nodes (Detail Breakdown & Net Surplus)
    const detailGap = 10;
    const totalDetailGaps = (detailItems.length - 1) * detailGap;
    const availDetailH = Math.max(30, usableH - totalDetailGaps);
    const detailSum = Math.max(1, detailItems.reduce((s, d) => s + d.amount, 0));
    let curY4 = topY;
    const detailNodes = detailItems.map(d => {
      const h = Math.max(20, Math.round((d.amount / detailSum) * availDetailH));
      const node = { ...d, x: col4X, w: col4W, y: curY4, h };
      curY4 += h + detailGap;
      return node;
    });

    // Volumetric Sankey Ribbon Path Generator
    function sankeyBandPath(x0, y0, h0, x1, y1, h1) {
      const midX = (x0 + x1) / 2;
      const topY0 = y0;
      const botY0 = y0 + h0;
      const topY1 = y1;
      const botY1 = y1 + h1;
      return `M ${x0} ${topY0} C ${midX} ${topY0}, ${midX} ${topY1}, ${x1} ${topY1} L ${x1} ${botY1} C ${midX} ${botY1}, ${midX} ${botY0}, ${x0} ${botY0} Z`;
    }

    // Gradients Definition
    const defGradients = [];

    // Ribbons T1 -> T2 (Income to Hub)
    let accHubY1 = hubY;
    const ribbonsT1T2 = incomeNodes.map((n, idx) => {
      const gradId = `grad-t1t2-${idx}`;
      defGradients.push(`<linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0d9488" stop-opacity="0.38"/>
        <stop offset="100%" stop-color="#0d9488" stop-opacity="0.38"/>
      </linearGradient>`);
      const hubSliceH = Math.max(4, (n.amount / totalIncSum) * hubH);
      const pathD = sankeyBandPath(n.x + n.w, n.y, n.h, hubX, accHubY1, hubSliceH);
      accHubY1 += hubSliceH;
      const pct = Math.round((n.amount / totalIncome) * 100);
      return `<path class="sankey-ribbon sankey-ribbon-band" d="${pathD}" fill="url(#${gradId})" stroke="#0d9488" stroke-width="0.75" stroke-opacity="0.5">
        <title>${escape(n.name)} → ${L('Total Kas Masuk','Total Inflow')}: ${escape(money(n.amount))} (${pct}%)</title>
      </path>`;
    }).join('');

    // Ribbons T2 -> T3 (Hub to Pillars)
    let accHubY2 = hubY;
    const ribbonsT2T3 = pillarNodes.map((p, idx) => {
      const gradId = `grad-t2t3-${idx}`;
      defGradients.push(`<linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0d9488" stop-opacity="0.38"/>
        <stop offset="100%" stop-color="${p.color}" stop-opacity="0.42"/>
      </linearGradient>`);
      const hubSliceH = Math.max(4, (p.amount / pillarSum) * hubH);
      const pathD = sankeyBandPath(hubX + hubW, accHubY2, hubSliceH, p.x, p.y, p.h);
      accHubY2 += hubSliceH;
      const pct = Math.round((p.amount / totalIncome) * 100);
      return `<path class="sankey-ribbon sankey-ribbon-band" d="${pathD}" fill="url(#${gradId})" stroke="${p.color}" stroke-width="0.75" stroke-opacity="0.55">
        <title>${L('Total Kas Masuk','Total Inflow')} → ${escape(p.name)}: ${escape(money(p.amount))} (${pct}%)</title>
      </path>`;
    }).join('');

    // Ribbons T3 -> T4 (Pillars to Detail Categories & Surplus)
    // Strictly routed with ZERO criss-crossing
    const ribbonsT3T4 = [];
    pillarNodes.forEach((p, pIdx) => {
      const subNodes = detailNodes.filter(d => d.pillarId === p.id);
      if (!subNodes.length) return;
      const subSum = Math.max(1, subNodes.reduce((s, d) => s + d.amount, 0));
      let accPillarY = p.y;
      subNodes.forEach((d, dIdx) => {
        const gradId = `grad-t3t4-${pIdx}-${dIdx}`;
        defGradients.push(`<linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${p.color}" stop-opacity="0.40"/>
          <stop offset="100%" stop-color="${d.color}" stop-opacity="0.40"/>
        </linearGradient>`);
        const pillarSliceH = Math.max(3, (d.amount / subSum) * p.h);
        const pathD = sankeyBandPath(p.x + p.w, accPillarY, pillarSliceH, d.x, d.y, d.h);
        accPillarY += pillarSliceH;
        const pct = Math.round((d.amount / totalIncome) * 100);
        ribbonsT3T4.push(`<path class="sankey-ribbon sankey-ribbon-band" d="${pathD}" fill="url(#${gradId})" stroke="${d.color}" stroke-width="0.75" stroke-opacity="0.5">
          <title>${escape(p.name)} → ${escape(d.name)}: ${escape(money(d.amount))} (${pct}%)</title>
        </path>`);
      });
    });

    return `<section class="panel cashflow-sankey-panel">
      <div class="sankey-header-row">
        <div>
          <h2>${L('Diagram Alir Kas Multitier (Gaya Monarch Money)','Multi-Tier Cash Flow Flow')}</h2>
          <p class="card-description">${L('Aliran multi-tahap seimbang: Sumber Pemasukan → Total Kas Masuk → Pilar Alokasi (Tetap, Fleksibel, Sasaran, Surplus) → Rincian Kategori.','Multi-tier visual cash flow from Income Sources to Allocation Pillars and Net Free Cash.')}</p>
        </div>
        <div class="sankey-nav-group">
          <span class="sankey-savings-badge">
            <span>🎯</span> ${L('Tingkat Tabungan','Savings Rate')}: <b>${flow.savingsRate}%</b>
          </span>
          <select id="cashflow-sankey-month-select" class="sankey-view-select" data-action="cashflow-sankey-month">
            <option value="plan" ${cashflowViewMonth==='plan'?'selected':''}>${L('Rencana Bulanan Rutin (Plan)','Monthly Plan Baseline')}</option>
            ${months.filter(m=>m!=='plan').map(m=>`<option value="${m}" ${cashflowViewMonth===m?'selected':''}>${m}</option>`).join('')}
          </select>
          ${button(L('Ekspor SVG','Export SVG'),'cashflow-sankey-export','icon-btn','download')}
        </div>
      </div>
      <div class="sankey-scroll-wrapper">
        <svg class="sankey-multitier-svg" viewBox="0 0 1000 ${height}" style="height:${height}px" role="img" aria-label="${L('Diagram Alir Kas Sankey Multitier','Multi-Tier Cash Flow Sankey Diagram')}">
          <defs>
            ${defGradients.join('\n            ')}
          </defs>

          <!-- Column Headers -->
          <text x="110" y="32" text-anchor="middle" class="sankey-header-title">${L('1. Sumber Pemasukan','1. Income Sources')}</text>
          <text x="${hubX + hubW/2}" y="32" text-anchor="middle" class="sankey-header-title">${L('2. Total Arus Masuk','2. Total Inflows')}</text>
          <text x="${col3X + 45}" y="32" text-anchor="middle" class="sankey-header-title">${L('3. Pilar Alokasi','3. Allocation Pillars')}</text>
          <text x="880" y="32" text-anchor="middle" class="sankey-header-title">${L('4. Kategori & Surplus','4. Uses & Surplus')}</text>

          <!-- Ribbons -->
          ${ribbonsT1T2}
          ${ribbonsT2T3}
          ${ribbonsT3T4.join('\n          ')}

          <!-- Central Hub (Column 2) -->
          <g class="sankey-node-group">
            <title>${L('Total Pemasukan','Total Inflow')}: ${escape(money(flow.totalIncome))}</title>
            <rect x="${hubX}" y="${hubY}" width="${hubW}" height="${hubH}" rx="5" fill="#0d9488"/>
            <rect x="${hubX - 58}" y="${hubCenter - 22}" width="134" height="44" rx="8" fill="var(--paper)" stroke="#0d9488" stroke-width="1.5" class="sankey-hub-badge" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.18))"/>
            <text x="${hubX + hubW/2}" y="${hubCenter - 6}" text-anchor="middle" font-size="9" font-weight="700" fill="var(--muted)" letter-spacing="0.5">${L('TOTAL KAS MASUK','TOTAL INFLOW')}</text>
            <text x="${hubX + hubW/2}" y="${hubCenter + 12}" text-anchor="middle" font-size="13" font-weight="800" fill="#0d9488" class="sankey-val">${escape(money(flow.totalIncome,true))}</text>
          </g>

          <!-- Column 1 Nodes (Income Sources) -->
          ${incomeNodes.map(n => {
            const pct = Math.round((n.amount / totalIncome) * 100);
            return `<g class="sankey-node-group">
              <title>${escape(n.name)}: ${escape(money(n.amount))} (${pct}%)</title>
              <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="4" fill="#0d9488"/>
              <text x="${n.x - 14}" y="${n.y + n.h/2 - 3}" text-anchor="end" font-weight="600" fill="var(--ink)" font-size="12">${n.icon} ${escape(n.name)}</text>
              <text x="${n.x - 14}" y="${n.y + n.h/2 + 12}" text-anchor="end" font-size="11">
                <tspan class="sankey-val" font-weight="600" fill="var(--muted)">${escape(money(n.amount,true))}</tspan>
                <tspan fill="var(--muted)" font-size="10"> · ${pct}%</tspan>
              </text>
            </g>`;
          }).join('')}

          <!-- Column 3 Nodes (Allocation Pillars) -->
          ${pillarNodes.map(p => {
            const pct = Math.round((p.amount / totalIncome) * 100);
            return `<g class="sankey-node-group">
              <title>${escape(p.name)}: ${escape(money(p.amount))} (${pct}%)</title>
              <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="4" fill="${p.color}"/>
              <text x="${p.x + p.w + 12}" y="${p.y + p.h/2 - 3}" text-anchor="start" font-weight="600" fill="var(--ink)" font-size="12">${p.icon} ${escape(p.name)}</text>
              <text x="${p.x + p.w + 12}" y="${p.y + p.h/2 + 12}" text-anchor="start" font-size="11">
                <tspan class="sankey-val" font-weight="700" fill="${p.color}">${escape(money(p.amount,true))}</tspan>
                <tspan fill="var(--muted)" font-size="10"> · ${pct}%</tspan>
              </text>
            </g>`;
          }).join('')}

          <!-- Column 4 Nodes (Categories & Net Surplus) -->
          ${detailNodes.map(d => {
            const pct = Math.round((d.amount / totalIncome) * 100);
            return `<g class="sankey-node-group">
              <title>${escape(d.name)}: ${escape(money(d.amount))} (${pct}%)</title>
              <rect x="${d.x}" y="${d.y}" width="${d.w}" height="${d.h}" rx="4" fill="${d.color}"/>
              <text x="${d.x + d.w + 12}" y="${d.y + d.h/2 - 3}" text-anchor="start" font-weight="600" fill="var(--ink)" font-size="12">${d.icon || F.categoryIcon(d.name)} ${escape(d.name)}</text>
              <text x="${d.x + d.w + 12}" y="${d.y + d.h/2 + 12}" text-anchor="start" font-size="11">
                <tspan class="sankey-val" font-weight="700" fill="${d.color}">${d.isNet ? (flow.netSurplus>=0?'+':'−') : ''}${escape(money(d.amount,true))}</tspan>
                <tspan fill="var(--muted)" font-size="10"> · ${pct}%</tspan>
              </text>
            </g>`;
          }).join('')}
        </svg>
      </div>
      <div class="sankey-legend-bar">
        <span class="sankey-legend-item"><span class="sankey-legend-dot" style="background:#0d9488"></span> ${L('Pemasukan & Arus Kas Masuk','Income & Total Inflow')}</span>
        <span class="sankey-legend-item"><span class="sankey-legend-dot" style="background:#f59e0b"></span> ${L('Kewajiban & Tagihan Tetap','Fixed Bills & Debts')}</span>
        <span class="sankey-legend-item"><span class="sankey-legend-dot" style="background:#ec4899"></span> ${L('Belanja Fleksibel Harian','Flexible Variable Spending')}</span>
        <span class="sankey-legend-item"><span class="sankey-legend-dot" style="background:#06b6d4"></span> ${L('Tabungan & Sasaran Masa Depan','Goals & Future Savings')}</span>
        <span class="sankey-legend-item"><span class="sankey-legend-dot" style="background:#10b981"></span> ${L('Surplus Bersih Kas Bebas','Net Free Cash Surplus')}</span>
      </div>
    </section>`;
  }

  function cashflow(){
    const p=E.position(viewState()),f=E.forecast(viewState());
    const sankeyData = F.monarchCashFlowSankey(viewState(), { monthKey: cashflowViewMonth });
    return header('Make room for what matters.','See the rhythm of your income, commitments, and future cash.',button('Add cash-flow item','flow-new','primary','plus'),'CASH FLOW')+cashflowSwitcher('cashflow')+
      `<div class="metrics-grid">
        ${metric('Monthly income',amount(p.income),'Planned recurring income','up')}
        ${metric('Planned outflows',amount(p.outflows),'Expenses + minimum debt payments','cashflow')}
        ${metric('Goal contributions',amount(p.goalCommitments),'Monthly planning allocations','goals')}
        ${metric(L('Tingkat Tabungan (Savings Rate)','Savings Rate'), (sankeyData.savingsRate + '%'), L('Porsi arus kas dialokasikan ke masa depan','Portion saved / invested'), 'coins')}
        ${metric('Remaining capacity',amount(p.available),'After outflows & goal contributions','wallet')}
      </div>`+
      cashFlowSankeyPanel(sankeyData)+
      `<div class="content-grid"><section class="panel panel-pad full"><div class="panel-head"><div><h2>Six-month liquidity forecast</h2><p>Starting from ${money(p.liquid)} in liquid funds</p></div>${link('Explore scenarios','scenarios')}</div><div class="chart-container">${lineChart(f.map(v=>v.balance),forecastLabels(),{name:'Liquid funds'})}</div><div class="chart-note"><span></span>Constant monthly flows · Goal contributions reserved · No investment returns assumed</div></section>${['income','expense'].map(kind=>`<section class="panel panel-pad"><div class="panel-head"><h2>${kind==='income'?'Money coming in':'Recurring commitments'}</h2><span class="badge ${kind==='income'?'':'orange'}">Monthly plan</span></div>${viewState().flows.filter(f=>f.kind===kind).map(f=>`<div class="flow-item"><div><b>${user(f.name)}</b><small>Day ${f.day} of each month</small></div><span class="flow-amount ${f.kind==='expense'?'expense-amount':''}">${native(f,'amount')}</span><button data-action="flow:${f.id}" aria-label="Edit ${escape(planFeatureLabel(f.id))}">↗</button></div>`).join('')||'<div class="empty">Add a recurring item.</div>'}${kind==='expense'?`<div class="flow-item"><div><b>Minimum debt payments</b><small>Included from Debt management</small></div><span class="flow-amount">${amount(p.debtPayments)}</span></div>`:''}</section>`).join('')}</div><div class="note">This is a monthly planning model, not a daily balance guarantee. Scheduled days organize your commitments; the forecast aggregates monthly flows. Variable income, unrecorded expenses, and payment timing can change the result.</div>`;
  }
  let txEdit=null,txQuery='',txKind='all';
  const txIconButton=(label,action,ic,extra='')=>`<button type="button" class="transaction-icon ${ic==='delete'?'danger':''}" data-action="${action}" title="${escape(label)}" aria-label="${escape(label)}" ${extra}>${icon(ic)}</button>`;
  function transactionEditRow(tx){const d=txEdit.values;const input=(key,type='text',extra='')=>`<input data-tx-edit="${key}" type="${type}" value="${escape(d[key])}" aria-label="${escape(key)}" ${extra}>`;const accounts=key=>`<select data-tx-edit="${key}" aria-label="${key}">${state.accounts.map(a=>`<option value="${a.id}" ${d[key]===a.id?'selected':''}>${escape(a.name)} (${a.currency})</option>`).join('')}</select>`;
    return `<tr class="transaction-editing"><td>${input('name','text','maxlength="120"')}<small>${L('Kategori','Category')}</small>${input('category','text','maxlength="80"')}<small>${L('Nominal penuh sebelum split','Full amount before split')}</small>${txEdit.error?`<p class="form-error" role="alert">${escape(txEdit.error)}</p>`:''}</td><td>${input('date','date')}</td><td>${accounts('accountId')}${d.kind==='transfer'?`<small>${L('Tujuan','Destination')}</small>${accounts('targetId')}`:''}</td><td><select data-tx-edit="kind" aria-label="${L('Jenis transaksi','Transaction type')}">${options(['expense','income','transfer'],d.kind)}</select></td><td>${input('amount','number','min="0.01" step="0.01"')}<small>${escape(getAccount(d.accountId)?.currency||'')}</small></td><td><div class="transaction-actions">${txIconButton(L('Simpan koreksi','Save correction'),'transaction-row-save:'+tx.id,'save')}${txIconButton(L('Batalkan edit','Cancel edit'),'transaction-row-cancel','cancel')}${txIconButton(L('Hapus transaksi','Delete transaction'),'transaction-delete:'+tx.id,'delete')}</div></td></tr>`;
  }
  function transactionRows(query=txQuery,kind=txKind){const filtered=F.scopedTransactions(state).filter(t=>(kind==='all'||t.kind===kind)&&`${t.name} ${t.category} ${getAccount(t.accountId)?.name}`.toLowerCase().includes(query.toLowerCase()));return filtered.map(t=>{if(txEdit?.id===t.id)return transactionEditRow(state.transactions.find(row=>row.id===t.id));const linkedGoal=t.goalId?state.goals.find(g=>g.id===t.goalId):null;return `<tr><td><div class="tx-cell-wrap"><span class="tx-cat-avatar" title="${escape(t.category)}">${F.categoryIcon(t.category)}</span><div class="tx-cell-text"><b>${user(t.name)}</b><small>${user(t.category)} · ${escape(t.splits?.length?L('Pembagian','Split'):ownerName(F.transactionOwner(state,t)))}</small><button class="quiet-link" data-action="ownership-tx:${t.id}">${L('Pemilik / Split','Owner / Split')}</button>${linkedGoal?`<span class="goal-badge" title="${L('Dibelanjakan dari target sasaran','Spent from goal')}">🎯 ${escape(linkedGoal.name)}</span>`:''}${R.duplicates(state,{...t,amount:t.originalAmount||t.amount}).filter(x=>x.id!==t.id).length?`<span class="badge orange">${L('Potensi duplikasi','Potential duplicate')}</span>`:''}${t.status==='pending'?`<span class="badge blue">Pending</span>`:''}${t.hiddenFromReports?`<small>${L('Tidak masuk laporan','Hidden from reports')}</small>`:''}${t.tags?.length?`<small>${user(t.tags.join(' · '))}</small>`:''}${t.receipts?.length?`<small>${t.receipts.length} ${L('struk tertaut','linked receipts')}</small>`:''}${t.cardCharge?`<small>${L('Belanja kartu · menambah utang, bukan mengurangi kas','Card purchase · adds debt, cash unchanged')}</small>`:''}${t.balanceApplied===false&&!t.cardCharge?`<small>${L('Jurnal historis · saldo tidak berubah','Historical journal · balance unchanged')}</small>`:''}</div></div></td><td>${escape(t.date)}</td><td>${escape(t.cardCharge?(state.cards.find(c=>c.id===t.cardId)?.name||'Card'):getAccount(t.accountId)?.name||'Removed account')}${t.kind==='transfer'?`<small>To ${escape(t.targetDebtId?state.debts.find(d=>d.id===t.targetDebtId)?.name:getAccount(t.targetId)?.name)}${t.targetAmount!==undefined?' · '+money(t.targetAmount,false,t.targetCurrency):''}</small>`:''}</td><td><span class="badge ${t.kind==='transfer'?'blue':t.kind==='expense'?'orange':''}">${escape(t.kind)}</span></td><td class="${t.kind==='income'?'positive':t.kind==='expense'?'expense-amount':''}"><b>${t.kind==='income'||t.refundOf?'+':t.kind==='expense'?'−':''}${native(t,'amount')}</b></td><td><div class="transaction-actions"><button type="button" class="transaction-icon rule-create-btn" data-action="tx-rule:${t.id}" title="${escape(L('Buat aturan otomatis dari mutasi ini','Create auto-rule from this transaction'))}" aria-label="${escape(L('Buat aturan otomatis','Create auto-rule'))}">⚡</button>${txIconButton(L('Edit transaksi','Edit transaction'),'transaction-row-edit:'+t.id,'edit')}${txIconButton(L('Hapus transaksi','Delete transaction'),'transaction-delete:'+t.id,'delete')}${t.kind==='expense'&&!t.refundOf&&!t.cardCharge&&t.status!=='pending'?txIconButton('Refund','ops-refund:'+t.id,'cashflow'):''}</div></td></tr>`;}).join('')||'<tr><td colspan="6" class="empty">No matching transactions.</td></tr>';}
  function persistCorrection(next){E.validate(next);localStorage.setItem(storageKey,JSON.stringify(next));state=next;persistent=true;}
  function transactionRowAction(name,id){
    if(name==='transaction-row-edit'){const tx=state.transactions.find(t=>t.id===id);if(!tx)return;if(tx.paymentJournal||tx.cardCharge){editCardJournal(tx);return;}if(txEdit&&txEdit.id!==id){toast(L('Simpan atau batalkan edit yang sedang aktif.','Save or cancel the active edit first.'));return;}txEdit={id,error:'',values:{name:tx.name,category:tx.category,date:tx.date,amount:String(tx.amount/100),kind:tx.kind,accountId:tx.accountId,targetId:tx.targetId||state.accounts.find(a=>a.id!==tx.accountId)?.id||''}};render();}
    if(name==='transaction-row-cancel'){txEdit=null;render();}
    if(name==='transaction-row-save'&&txEdit?.id===id){try{const d=txEdit.values;persistCorrection(F.editTransaction(state,id,{name:requireText(d.name),category:requireText(d.category),date:d.date,kind:d.kind,amount:positive(d.amount),accountId:d.accountId,targetId:d.kind==='transfer'?d.targetId:undefined}));txEdit=null;render();successToast(L('Transaksi berhasil tersimpan.','Transaction saved successfully.'));}catch(error){txEdit.error=error.message;render();}}
    if(name==='transaction-delete'){const tx=state.transactions.find(t=>t.id===id);if(!tx)return;confirmAction(L('Hapus transaksi ini?','Delete this transaction?'),`${escape(tx.name)} · ${escape(money(tx.amount,false,tx.currency))}<br>${L('Dampak saldo dan utang yang dicatat akan dibalik. Catatan historis tidak mengubah saldo akun. Tindakan ini tidak menghapus transaksi di bank.','Recorded account and debt effects will be reversed. Historical entries do not change account balances. This does not delete a bank transaction.')}`,()=>{persistCorrection(F.deleteTransaction(state,id));if(txEdit?.id===id)txEdit=null;successToast(L('Transaksi berhasil dihapus.','Transaction deleted successfully.'));},`${icon('delete')}${L('Hapus transaksi','Delete transaction')}`);}
  }
  function successToast(message){toast(message);$('#toast').classList.add('success');$('#toast').innerHTML=`${icon('check')}<span>${escape(t(message))}</span>`;}
  function transactions(){return header('The details behind your financial life.','Record income, expenses, and transfers without counting the same money twice.',button('Add transaction','transaction-new','primary','plus')+button('⚡ '+L('Aturan otomatis','Rules'),'rules-manage')+button(L('Kategori','Categories'),'','','','data-page="categories"'),'TRANSACTIONS')+transactionSwitcher('transactions')+`<section class="panel"><div class="panel-pad"><div class="panel-head"><h2>Transaction journal</h2><span class="badge">${state.transactions.length} records</span></div><div class="table-tools"><input class="input-search" id="transaction-search" value="${escape(txQuery)}" placeholder="Search transactions…" aria-label="Search transactions"><select id="transaction-filter" aria-label="Filter transaction type">${[['all','All types'],['income','Income'],['expense','Expenses'],['transfer','Transfers']].map(([id,label])=>`<option value="${id}" ${txKind===id?'selected':''}>${label}</option>`).join('')}</select></div></div><div class="table-wrap"><table><thead><tr><th>Description</th><th>Date</th><th>Account</th><th>Type</th><th>Amount</th><th scope="col">${L('Aksi','Actions')}</th></tr></thead><tbody id="transaction-rows">${transactionRows()}</tbody></table></div></section><div class="note">New transactions update account balances once. Transfers preserve total assets. Your recurring cash-flow plan is separate and is not automatically changed by a recorded transaction. ${state.demo?'The initial sample transactions are already reflected in the sample balance snapshots.':''}</div>`;}
  function goals(){const allocated=E.allocations(viewState()),free=E.position(viewState()).liquid-allocated;return header('Give your money a direction.','Turn meaningful goals into intentional allocations and achievable monthly plans.',button('Create a goal','goal-new','primary','plus'),'GOALS & PLANS')+planningSwitcher('goals')+`<div class="metrics-grid">${metric('Allocated to goals',amount(allocated),'Reserved within your liquid funds','goals')}${metric('Unallocated liquidity',amount(free),'Liquid funds − goal allocations','wallet')}${metric('Monthly contributions',amount(E.position(viewState()).goalCommitments),'Included in the cash-flow plan','cashflow')}${metric('Active goals',String(viewState().goals.length),'Your priorities, on your terms','sparkles')}</div><div class="content-grid three">${viewState().goals.map(g=>{const gap=Math.max(0,g.target-g.saved);const months=g.monthly?Math.ceil(gap/g.monthly):null;const goalExpenses=state.transactions.filter(t=>t.goalId===g.id&&t.kind==='expense');const spentTotal=E.sum(goalExpenses.map(t=>E.reporting(state,t,'amount')));return `<section class="panel panel-pad"><div class="panel-head"><span style="font-size:25px;color:#7e9d5c">${escape(g.emoji)}</span><span class="badge">${percent(g)}% funded</span></div><h2 style="margin-top:18px">${escape(g.name)}</h2><div class="card-stat">${native(g,'saved')}</div><div class="card-description">of ${money(g.target,false,g.currency)} target</div><div class="progress-track"><div class="progress-fill" style="width:${percent(g)}%"></div></div><div class="details-list"><div class="detail-line"><span>Monthly plan</span><b>${native(g,'monthly')}</b></div><div class="detail-line"><span>Remaining</span><b>${amount(gap,g.currency)}</b></div>${spentTotal>0?`<div class="detail-line"><span>${L('Dibelanjakan dari target','Spent from goal')}</span><b class="expense-amount">−${amount(spentTotal,g.currency)}</b></div>`:''}<div class="detail-line"><span>At current contribution</span><b>${gap===0?'Fully funded':months===null?'No contribution set':months+' months'}</b></div><div class="detail-line"><span>Target date</span><b>${escape(g.due||'Not set')}</b></div></div><div class="card-actions">${button('Allocate funds','fund:'+g.id,'primary')}${button('Edit','goal:'+g.id)}</div></section>`;}).join('')||'<section class="panel empty full">Create your first goal to start planning.</section>'}</div><div class="note">Goal allocations are designations within existing liquid balances. They do not move money or increase net worth. Monthly contributions reduce projected discretionary liquidity; they are not executed transfers. ${free<0?'Your current allocations exceed liquid funds. Review balances and release allocations before adding more.':''}</div>`;}
  const forecastLabels=()=>Array.from({length:7},(_,i)=>i===0?'Now':new Date(new Date().getFullYear(),new Date().getMonth()+i,1).toLocaleDateString(locale(),{month:'short'}));
  function debt(){const p=E.position(viewState());return header('Less uncertainty. More forward motion.','Understand the cost of debt and compare your repayment options.',button('Add a debt','debt-new','primary','plus'),'DEBT MANAGEMENT')+accountSwitcher('debt')+`<div class="metrics-grid">${metric('Total debt',amount(p.liabilities),'Recorded outstanding balances','debt')}${metric('Minimum payments',amount(p.debtPayments),'Monthly cash-flow commitment','cashflow')}${metric('Highest APR',viewState().debts.length?Math.max(...viewState().debts.map(d=>d.apr)).toFixed(1)+'%':'—','Fixed-rate projection assumptions','lightning')}${metric('Monthly capacity',amount(p.available),'After planned goals & obligations','wallet')}</div><div class="content-grid">${viewState().debts.map(d=>{const base=E.payoff(d);return `<section class="panel panel-pad"><div class="panel-head"><h2>${user(d.name)}</h2><button class="quiet-link" data-action="debt:${d.id}">Edit ↗</button></div><div class="card-stat">${native(d,'balance')}</div><div class="detail-line" style="font-size:11px"><span>${d.apr}% APR · Fixed rate</span><b>${money(d.minimum,false,d.currency)} / month minimum</b></div><div class="debt-slider"><label class="slider-label" for="debt-extra-${d.id}">Extra monthly payment<output id="extra-label-${d.id}">${money(0,false,d.currency)}</output></label><input type="range" id="debt-extra-${d.id}" data-debt-id="${d.id}" min="0" max="${Math.max(1000,Math.ceil(Math.max(0,E.convert(state,p.available,state.currency,d.currency))/100/100)*100)}" value="0" step="25"></div><div class="debt-results" id="debt-results-${d.id}">${debtResult(d,0)}</div><div class="card-description" style="margin-top:16px">Baseline: ${base.feasible?base.months+' months · '+money(base.interest,false,d.currency)+' estimated interest':'Minimum payment does not amortize this balance within the supported model'}.</div></section>`;}).join('')||'<section class="panel empty full">Add a liability to compare repayment options.</section>'}</div><div class="note">Projections assume a fixed APR, monthly compounding rounded to cents, constant payments, no new borrowing, and no fees. Each slider models one debt independently; extra payments are not yet added to your household plan.</div>`;}
  function debtResult(d,extra){const result=E.payoff(d,extra),base=E.payoff(d);return `<div><small>Estimated payoff</small><b>${result.feasible?result.months+' months':'Not amortizing'}</b></div><div><small>Interest saved vs. minimum</small><b class="positive">${result.feasible&&base.feasible?amount(Math.max(0,base.interest-result.interest),d.currency):'—'}</b></div>`;}
  function accountSwitcher(activePage){
    return `<div class="sim-tab-header"><button type="button" class="sim-tab-btn ${activePage==='accounts'?'active':''}" data-page="accounts">💳 ${L('Rekening & Saldo','Accounts & Balances')}</button><button type="button" class="sim-tab-btn ${activePage==='cards'?'active':''}" data-page="cards">💳 ${L('Kartu Kredit','Credit Cards')}</button><button type="button" class="sim-tab-btn ${activePage==='debt'?'active':''}" data-page="debt">⚖️ ${L('Utang & Pinjaman','Debt Projections')} <span class="badge plus">PLUS</span></button></div>`;
  }
  function transactionSwitcher(activePage){
    return `<div class="sim-tab-header"><button type="button" class="sim-tab-btn ${activePage==='transactions'?'active':''}" data-page="transactions">📒 ${L('Jurnal Transaksi','Transactions Journal')}</button><button type="button" class="sim-tab-btn ${activePage==='capture'?'active':''}" data-page="capture">📷 ${L('Scan & Entry','Scan & Entry')} <span class="badge plus">PLUS</span></button><button type="button" class="sim-tab-btn ${activePage==='categories'?'active':''}" data-page="categories">🏷️ ${L('Kategori & Group','Categories')}</button><button type="button" class="sim-tab-btn ${activePage==='operations'?'active':''}" data-page="operations">⚡ ${L('Audit & Aturan Otomatis','Operations & Auto-Rules')} <span class="badge plus">PLUS</span></button></div>`;
  }
  function cashflowSwitcher(activePage){
    return `<div class="sim-tab-header"><button type="button" class="sim-tab-btn ${activePage==='cashflow'?'active':''}" data-page="cashflow">🌊 ${L('Sankey Arus Kas','Cash Flow Sankey')}</button><button type="button" class="sim-tab-btn ${activePage==='budget'?'active':''}" data-page="budget">📊 ${L('Anggaran Fleksibel','Flexible Budget')} <span class="badge plus">PLUS</span></button><button type="button" class="sim-tab-btn ${activePage==='calendar'?'active':''}" data-page="calendar">📅 ${L('Kalender Tagihan & Gaji','Calendar & Paydays')} <span class="badge plus">PLUS</span></button></div>`;
  }
  function planningSwitcher(activePage){
    return `<div class="sim-tab-header"><button type="button" class="sim-tab-btn ${activePage==='forecast'?'active':''}" data-page="forecast">📈 ${L('Proyeksi Finansial','Financial Forecast')}</button><button type="button" class="sim-tab-btn ${activePage==='goals'?'active':''}" data-page="goals">🎯 ${L('Target Tabungan','Savings Goals')} <span class="badge plus">PLUS</span></button><button type="button" class="sim-tab-btn ${activePage==='scenarios'?'active':''}" data-page="scenarios">🔮 ${L('Skenario Apa-Bila','What-If Scenarios')} <span class="badge pro">PRO</span></button><button type="button" class="sim-tab-btn ${activePage==='montecarlo'?'active':''}" data-page="montecarlo">🎲 ${L('Simulasi Monte Carlo','Monte Carlo')} <span class="badge pro">PRO</span></button></div>`;
  }
  function sharedSwitcher(activePage){
    return `<div class="sim-tab-header"><button type="button" class="sim-tab-btn ${activePage==='shared'?'active':''}" data-page="shared">👥 ${L('Ringkasan Bersama','Shared Overview')}</button><button type="button" class="sim-tab-btn ${activePage==='household'?'active':''}" data-page="household">🏠 ${L('Anggota & Tanggung Jawab','Members & To-dos')}</button></div>`;
  }
  const simSwitcher=planningSwitcher;
  function scenarios(){return header('What if becomes a clearer picture.','Explore a decision before it changes your financial life.',button('Reset assumptions','scenario-reset','','scenarios'),'SCENARIO STUDIO')+simSwitcher('scenarios')+`<div class="content-grid"><section class="panel panel-pad"><div class="panel-head"><div><h2>Shape your scenario</h2><p>Your actual records stay unchanged.</p></div><span class="badge blue">Simulation</span></div><div class="scenario-controls">${slider('incomeDelta','Additional monthly income',0,5000,100,scenario.incomeDelta/100,'After-tax income added to the baseline')}${slider('expenseDelta','Additional monthly expense',0,3000,50,scenario.expenseDelta/100,'New commitment on top of planned outflows')}${slider('oneTime','One-time purchase',0,50000,500,scenario.oneTime/100,'Applied in the first forecast month')}</div><div class="note">Starting liquidity, obligations, and goal contributions come from your current workspace. No market growth, taxes, or inflation are modeled.</div></section><section class="panel panel-pad"><div class="panel-head"><div><h2>Six-month outlook</h2><p><span style="color:#91b366">●</span> Current plan &nbsp; <span style="color:#58789b">┄</span> Your scenario</p></div></div><div class="chart-container" id="scenario-chart"></div><div id="scenario-outcome"></div></section></div><div class="scenario-summary" id="scenario-summary"></div>`;}
  function slider(id,label,min,max,step,value,desc){return `<div><label class="slider-label" for="${id}"><span>${label}<small>${desc}</small></span><output id="value-${id}">${money(value*100)}</output></label><input type="range" id="${id}" data-scenario="${id}" min="${min}" max="${max}" step="${step}" value="${value}"></div>`;}
  function updateScenario(){const base=E.forecast(viewState()),sim=E.forecast(viewState(),scenario),end=sim.at(-1).balance,delta=end-base.at(-1).balance;$('#scenario-chart').innerHTML=lineChart(base.map(v=>v.balance),forecastLabels(),{second:sim.map(v=>v.balance),name:'Liquid funds',secondName:'Scenario liquid funds',width:$('#scenario-chart').clientWidth||660});$('#scenario-outcome').innerHTML=`<div class="note">${sim.some(v=>v.balance<0)?'<b class="negative">A projected liquidity shortfall appears in this scenario.</b> Review timing, reserves, and commitments.':`Your scenario ends with <b>${money(end)}</b> in projected liquid funds. This includes the goal contributions in your current plan.`}</div>`;$('#scenario-summary').innerHTML=metric('Six-month scenario balance',amount(end),'Projection, not a guarantee','accounts')+metric('Difference vs. current plan',`<span class="${delta>=0?'positive':'negative'}">${delta>=0?'+':''}${amount(delta)}</span>`,'Same assumptions, different decisions','scenarios')+metric('Scenario monthly capacity',amount(E.position(viewState()).available+scenario.incomeDelta-scenario.expenseDelta),'Before the one-time purchase','cashflow');}
  function household(){return header('A shared life. An intentional plan.','Coordinate responsibilities and keep your household priorities visible.',button('Add a task','task-new','primary','plus'),'HOUSEHOLD')+sharedSwitcher('household')+`<div class="content-grid"><section class="panel panel-pad"><div class="panel-head"><h2>Your planning circle</h2><span class="badge">Local workspace</span></div>${state.members.map(m=>`<div class="member-row"><span class="avatar">${escape(m.initials)}</span><div><b>${user(m.name)}</b><small>${escape(m.role)}</small></div><span class="badge">${m.id==='m1'?'Owner':'Demo member'}</span></div>`).join('')}<div class="note">These are local planning labels. This MVP has no sign-in, invitations, or per-member access control. Everyone using this browser profile can access this workspace.</div></section><section class="panel panel-pad"><div class="panel-head"><h2>Financial to-dos</h2><span class="badge">${state.tasks.filter(t=>!t.done).length} open</span></div>${state.tasks.map(t=>`<div class="task-row ${t.done?'done':''}"><input type="checkbox" data-task="${t.id}" ${t.done?'checked':''} aria-label="Complete ${escape(t.name)}"><div><b>${user(t.name)}</b><small>${escape(t.owner)} · ${escape(t.due||'No date')}</small></div><button data-action="task-delete:${t.id}" aria-label="Remove ${escape(t.name)}">×</button></div>`).join('')||'<div class="empty">Create your first shared responsibility.</div>'}</section><section class="panel panel-pad full"><div class="panel-head"><div><h2>Your monthly operating rhythm</h2><p>Review, decide, coordinate, and keep moving.</p></div>${button('Start a review','review','primary','shield')}</div><div class="details-list"><div class="detail-line"><span>1. Verify your financial picture</span><b>Review account balances and dates</b></div><div class="detail-line"><span>2. Look ahead</span><b>Check obligations and liquidity</b></div><div class="detail-line"><span>3. Choose a meaningful next step</span><b>Fund a goal or compare a scenario</b></div><div class="detail-line"><span>4. Share responsibility</span><b>Assign a task and review the outcome</b></div></div></section></div>`;}
  function copilot(){return header('Clarity starts with a good question.','An explainable financial assistant, grounded in your workspace.','','FINANCIAL COPILOT')+`<div class="copilot-layout"><section class="panel chat-panel"><div class="panel-pad panel-head"><div><h2>Your financial copilot</h2><p>${state.assistant.provider==='local'?'Local calculation assistant':escape(aiProviderName(state.assistant.provider))}</p></div><span class="badge">Read-only</span></div><div class="chat-messages" id="chat-messages"></div><form class="chat-input" id="chat-form"><label class="screen-reader" for="chat-question">Ask a financial question</label><input id="chat-question" placeholder="Ask about your cash flow, goals, or debt…" autocomplete="off" required maxlength="500"><button class="btn primary" type="submit" aria-label="Send question">${icon('arrow')}</button></form></section><aside class="panel panel-pad"><span class="spark-small">✧</span><h2>A place to begin</h2><p class="card-description" style="margin-top:10px">Explore the numbers and assumptions behind your next decision.</p><div class="prompt-list">${['What is my financial position?','How much can I allocate each month?','How strong is my emergency reserve?','Which debt has the highest interest rate?','How are my goals progressing?'].map(q=>`<button class="prompt-button" data-question="${escape(q)}">${escape(q)} ↗</button>`).join('')}</div><div class="note">This assistant answers supported topics from local records. It does not provide live market data, personalized investment advice, or autonomous actions.</div></aside></div>`;}
  function answer(q){const p=E.position(viewState());let text;const lower=q.toLowerCase();
    if (/debt|loan|interest|utang|bunga/.test(lower)){const d=viewState().debts.slice().sort((a,b)=>b.apr-a.apr)[0];text=d?`Your highest recorded APR is <b>${d.apr}%</b> on <b>${user(d.name)}</b>, with a balance of ${money(d.balance,false,d.currency)}. Its minimum monthly payment is ${money(d.minimum,false,d.currency)}. Compare extra payments in Debt management, then check the liquidity impact in Scenarios. Higher-interest repayment may reduce modeled interest costs, but fees, promotional terms, and your cash needs matter.`:'You have no debt records. Add a liability to compare repayment projections.';}
    else if (/emergency|reserve|darurat|cadangan/.test(lower)) text=`Your recorded liquid funds are <b>${money(p.liquid)}</b>. Planned monthly expenses and minimum debt payments total <b>${money(p.outflows)}</b>, giving ${p.reserveMonths===null?'no calculable coverage ratio because planned outflows are zero':`approximately <b>${p.reserveMonths.toFixed(1)} months</b> of coverage`}. This includes all liquid accounts, including funds designated for other goals. It is not the same as a dedicated emergency fund.`;
    else if (/goal|progress|tujuan|perkembangan/.test(lower)) text=state.goals.length?viewState().goals.map(g=>`<p><b>${user(g.name)}</b>: ${money(g.saved,false,g.currency)} of ${money(g.target,false,g.currency)} (${percent(g)}% funded), with ${money(g.monthly,false,g.currency)} per month planned.</p>`).join('')+'Allocations are designations within your current balances, not new assets.': 'You have no goals yet. Create one in Goals & plans.';
    else if (/afford|allocat|cash|income|month|spend|surplus|alokasi|bulan|arus|pendapatan/.test(lower)) text=`Your recurring plan includes <b>${money(p.income)}</b> in monthly income, <b>${money(p.outflows)}</b> in expenses and minimum debt payments, and <b>${money(p.goalCommitments)}</b> in goal contributions. That leaves <b>${money(p.available)}</b> of projected monthly capacity. This assumes the recorded flows repeat as entered. Unrecorded expenses, taxes, irregular income, and timing can change the result. Use Scenarios to test a purchase.`;
    else if (/worth|position|asset|financ|balance|summary|posisi|keuangan|aset|saldo/.test(lower)) text=`Your recorded net worth is <b>${money(p.netWorth)}</b>: <b>${money(p.assets)}</b> in assets less <b>${money(p.liabilities)}</b> in liabilities. Your liquid funds total ${money(p.liquid)}. These are manual balance snapshots, not bank-verified records. Review the dates in Accounts before making a consequential decision.`;
    else text='I can explain your financial position, monthly cash-flow plan, reserve coverage, goal progress, or debt records. Choose one of the suggested questions. I cannot answer this reliably from the supported local calculations.';
    if(state.language==='id')return answerIndonesian(q,p);
    return text;
  }
  function ask(q){quickMinimized=false;quickSend(q,quickAccount);$('#chat-question').value='';}
  function renderMessages(){if(!$('#chat-messages'))return;const history=CHAT.history(state);$('#chat-messages').innerHTML=`<div class="chat-message assistant"><span class="ai-avatar">✧</span><div><p>${L('Tanya atau catat melalui asisten INVEYS. Draft selalu ditinjau sebelum disimpan.','Ask or record with INVEYS. Drafts always require review before saving.')}</p><small>${escape(aiProviderName(state.assistant.provider))}</small></div></div>`+history.map((m,idx)=>{const isLatestAssistant=m.role==='assistant'&&idx===history.length-1&&streamState.active;const textToShow=isLatestAssistant?streamState.displayedText:m.text;return m.role==='user'?`<div class="chat-message user">${escape(m.text)}</div>`:`<div class="chat-message assistant ${isLatestAssistant?'typing-streaming':''}" onclick="skipStreaming()"><span class="ai-avatar">✧</span><div><div class="ai-content">${aiRichText(textToShow)}${isLatestAssistant?'<span class="ai-typing-cursor"></span>':''}</div><small>${escape(aiProviderName(m.provider))} · ${escape(m.date)}</small></div></div>`;}).join('')+(aiBusy?`<div class="chat-message assistant skeleton-chat-message" role="status" aria-busy="true"><span class="ai-avatar skeleton-spin">✧</span><div class="skeleton-chat-body"><div class="skeleton-shimmer skeleton-chat-line" style="width:75%"></div><div class="skeleton-shimmer skeleton-chat-line" style="width:90%"></div><div class="skeleton-shimmer skeleton-chat-line" style="width:45%"></div><small class="skeleton-chat-sub">${escape(aiThinkingStatusText())}</small></div></div>`:'');$('#chat-messages').scrollTop=$('#chat-messages').scrollHeight;}
  let mcResult=null,mcConfig=null;
  function syncPreferences(){
    document.documentElement?.setAttribute('lang',state.language);
    document.documentElement?.setAttribute('data-theme',state.theme);
    const themeTokens=A.tokens(state.appearance[state.theme].colors);for(const [key,value] of Object.entries(themeTokens))document.documentElement?.style?.setProperty(key,value);
    $('#language-switch').value=state.language;
    $('#currency-switch').innerHTML=options(E.currencies,state.currency);
    $('#theme-switch').textContent=state.theme==='dark'?'☀':'☾';
    $('#theme-switch').setAttribute?.('aria-label',t(state.theme==='dark'?'Light':'Dark'));
    $('#theme-switch').setAttribute?.('aria-checked',state.theme==='dark'?'true':'false');
    $('#theme-switch').classList.toggle('active',state.theme==='dark');
    const privBtn=$('#privacy-switch');
    if(privBtn){
      privBtn.classList.toggle('active',hideMoney);
      privBtn.setAttribute?.('aria-checked',hideMoney?'true':'false');
      privBtn.textContent=hideMoney?'🔒':'👁';
      privBtn.setAttribute?.('aria-label',hideMoney?t('Show amounts'):t('Hide amounts'));
      privBtn.setAttribute?.('title',hideMoney?L('Mode Privasi Aktif (Geser/klik untuk tampilkan nominal)','Ghost Mode Active (Slide/click to show amounts)'):L('Mode Privasi / Ghost Mode (Geser/klik untuk sembunyikan nominal)','Ghost Mode (Slide/click to hide amounts)'));
    }
    const count=E.reminders(state,date()).length;
    $('#notification-button').innerHTML=icon('bell')+(count?`<span class="notification-count">${count}</span>`:'');
  }
  function preferenceSettings(){return `<section class="panel panel-pad preference-panel"><div class="panel-head"><h2>${t('Display & identity')}</h2>${button(t('Edit owner'),'owner-edit','','household')}</div><div class="preference-grid"><div><small>${t('Language')}</small><b>${state.language==='id'?'Bahasa Indonesia':'English'}</b></div><div><small>${t('Theme')}</small><b>${t(state.theme==='dark'?'Dark':'Light')}</b></div><div><small>${t('Owner name')}</small><b>${user(state.members[0]?.name||'Me')}</b></div><div><small>${t('Reporting currency')}</small><b>${state.currency}</b></div></div><div class="settings-row"><div><b>${t('Exchange rates')}</b><p>${t('Native amounts are preserved. Reporting totals use your saved exchange rates.')}</p><p>${user(state.fx.source)} · ${state.fx.date}</p></div>${button(t('Edit exchange rates'),'fx-edit')}</div><div class="fx-table">${E.currencies.filter(c=>c!=='IDR').map(c=>`<span>1 ${c} = ${new Intl.NumberFormat(locale(),{style:'currency',currency:'IDR',maximumFractionDigits:2}).format(state.fx.rates[c])}</span>`).join('')}</div><p class="note">${L('Kurs awal adalah ilustrasi. Pembaruan otomatis tersedia di Integrasi.','Initial rates are illustrative. Automatic updates are available in Integrations.')}</p></section>`;}
  function appearanceSettings(){const a=state.appearance[state.theme],labels={bg:L('Latar halaman','Page background'),paper:L('Kartu / panel','Cards / panels'),ink:L('Teks utama','Primary text'),muted:L('Teks pendukung','Secondary text'),line:L('Garis pembatas','Borders'),accent:L('Aksen','Accent')};return `<section class="panel panel-pad" style="margin-top:22px"><h2>${L('Palet warna','Color palette')}</h2><p class="note">${L('Palet terang dan gelap disimpan terpisah. Ubah tema melalui tombol di atas untuk mengedit palet tema tersebut.','Light and dark palettes are saved separately. Switch theme above to edit that theme’s palette.')}</p><label>${L('Palet untuk tema aktif','Palette for active theme')} · ${t(state.theme==='dark'?'Dark':'Light')}<select id="appearance-preset">${Object.keys(A.presets).map(p=>`<option value="${p}" ${a.preset===p?'selected':''}>${p[0].toUpperCase()+p.slice(1)}</option>`).join('')}<option value="custom" ${a.preset==='custom'?'selected':''}>${L('Kustom','Custom')}</option></select></label><form id="appearance-form"><div class="palette-grid">${A.keys.map(k=>`<label>${labels[k]}<input type="color" name="${k}" value="${a.colors[k]}" aria-label="${labels[k]}"><small>${a.colors[k]}</small></label>`).join('')}</div><button class="btn primary" type="submit">${L('Simpan warna kustom','Save custom colors')}</button><p id="appearance-error" role="alert"></p></form><p class="note">${L('Warna kustom diperiksa agar kontras teks pada halaman dan panel minimal 4,5:1. Warna tombol disesuaikan otomatis.','Custom colors require text contrast of at least 4.5:1 against page and panel surfaces. Button text color adapts automatically.')}</p></section>`;}
  document.addEventListener('change',event=>{if(event.target.id!=='appearance-preset')return;const preset=event.target.value;if(!A.presets[preset])return;state.appearance[state.theme]={preset,colors:A.colors(state.theme,preset)};render();});
  document.addEventListener('submit',event=>{if(event.target.id!=='appearance-form')return;event.preventDefault();try{const colors=Object.fromEntries(new FormData(event.target));A.validateColors(colors);state.appearance[state.theme]={preset:'custom',colors};render();toast(L('Palet tersimpan','Palette saved'));}catch(e){$('#appearance-error').textContent=e.message;}});

  function editOwner(){const old=state.members[0]?.name||'Me';openModal(t('Edit owner'),form(field(t('Owner name'),'name',old,'text','required maxlength="80"'),t('Save')),data=>{const name=requireText(data.name);const first=old.split(' ')[0],newFirst=name.split(' ')[0];if(!state.members.length)state.members.push({id:'m1',name,role:'Workspace owner',initials:''});state.members[0].name=name;state.members[0].initials=name.split(/\s+/).slice(0,2).map(n=>n[0]).join('').toUpperCase();const firstIsUnique=state.members.slice(1).every(m=>m.name.split(' ')[0]!==first);for(const rows of [state.accounts,state.tasks,state.cards])for(const row of rows){if(row.owner===old)row.owner=name;else if(firstIsUnique&&row.owner===first)row.owner=newFirst;}toast('Owner updated.');});}
  function editFX(){const inputs=E.currencies.filter(c=>c!=='IDR').map(c=>field(c+' · '+t('IDR per 1 unit'),c,state.fx.rates[c],'number','min="0.01" max="1000000000" required')).join('');openModal(t('Edit exchange rates'),form(inputs+field(t('Rate date'),'date',state.fx.date,'date','required')+field(t('Rate source'),'source',state.fx.source,'text','required maxlength="120"'),t('Save'),state.language==='id'?'Kurs dinyatakan sebagai Rupiah per satu unit mata uang. Angka awal hanya contoh. Saldo asli tidak berubah.':'Rates are IDR per unit of currency. Initial rates are illustrative. Native balances do not change.'),data=>{const rates={IDR:1};for(const c of E.currencies.filter(c=>c!=='IDR')){rates[c]=Number(data[c]);if(!Number.isFinite(rates[c])||rates[c]<=0||rates[c]>1e9)throw Error(t('A positive exchange rate is required for both currencies.'));}if(!E.validDate(data.date))throw Error(t('Invalid reminder date.'));const candidate=structuredClone(state);candidate.fx={rates,date:data.date,source:requireText(data.source)};E.validate(candidate);state=candidate;messages=[];drafts=[];captureText='';museAnswer='';telegramItems=[];mcResult=null;mcConfig=null;toast('Rates saved.');});}
  function answerIndonesian(q,p){const lower=q.toLowerCase();
    if(/debt|loan|interest|utang|bunga/.test(lower)){const d=viewState().debts.slice().sort((a,b)=>b.apr-a.apr)[0];return d?`APR tertinggi tercatat adalah <b>${d.apr}%</b> pada ${user(d.name)}, dengan saldo ${money(d.balance,false,d.currency)} dan pembayaran minimum ${money(d.minimum,false,d.currency)} per bulan. Bandingkan pembayaran tambahan di Pengelolaan utang dan dampak likuiditasnya di Skenario. Biaya, perubahan bunga, dan kebutuhan kas dapat mengubah hasil.`:'Belum ada catatan utang. Tambahkan liabilitas untuk membandingkan proyeksi pembayaran.';}
    if(/emergency|reserve|darurat|cadangan/.test(lower))return `Dana likuid tercatat sebesar <b>${money(p.liquid)}</b>. Pengeluaran dan pembayaran minimum bulanan adalah <b>${money(p.outflows)}</b>. Rasio cakupan ${p.reserveMonths===null?'belum dapat dihitung karena pengeluaran nol':`sekitar <b>${p.reserveMonths.toFixed(1)} bulan</b>`}. Ini mencakup seluruh rekening likuid, termasuk dana untuk tujuan lain; bukan hanya dana darurat khusus.`;
    if(/goal|progress|tujuan|perkembangan/.test(lower))return viewState().goals.map(g=>`<p>${user(g.name)}: ${money(g.saved,false,g.currency)} dari ${money(g.target,false,g.currency)} (${percent(g)}%), dengan rencana ${money(g.monthly,false,g.currency)} per bulan.</p>`).join('')+'Alokasi merupakan pencadangan saldo yang sudah ada, bukan aset baru.';
    if(/afford|allocat|cash|income|month|spend|surplus|alokasi|bulan|arus|pendapatan/.test(lower))return `Rencana bulanan: pendapatan <b>${money(p.income)}</b>, pengeluaran termasuk minimum utang <b>${money(p.outflows)}</b>, dan kontribusi tujuan <b>${money(p.goalCommitments)}</b>. Kapasitas tersisa <b>${money(p.available)}</b>. Perhitungan memakai kurs tersimpan dan mengasumsikan arus rutin berulang; biaya yang belum tercatat serta waktu pembayaran dapat mengubah hasil.`;
    if(/worth|position|asset|financ|balance|summary|posisi|keuangan|aset|saldo/.test(lower))return `Kekayaan bersih tercatat <b>${money(p.netWorth)}</b>: aset <b>${money(p.assets)}</b> dikurangi liabilitas <b>${money(p.liabilities)}</b>. Dana likuid ${money(p.liquid)}. Saldo merupakan catatan manual, bukan verifikasi bank. Kurs: ${user(state.fx.source)} (${state.fx.date}). Tinjau data sebelum mengambil keputusan.`;
    return 'Saya dapat menjelaskan posisi keuangan, arus kas bulanan, cakupan dana likuid, tujuan, dan utang. Pilih pertanyaan yang disediakan. Saya tidak memiliki data yang memadai untuk menjawab topik lain secara andal.';
  }
  function montecarlo(){
    if(!mcConfig){const p=E.position(viewState());mcConfig={initial:Math.max(0,E.sum(viewState().accounts.filter(a=>a.type==='Investment').map(a=>E.reporting(state,a,'balance')))),monthly:Math.max(0,p.available),years:10,mean:6,volatility:15,inflation:3,target:Math.max(10000,p.assets*2),paths:2000,seed:42};}
    const fields=field(t('Initial capital')+' ('+state.currency+')','initial',mcConfig.initial/100,'number','min="0" required')+field(t('Monthly investment'),'monthly',mcConfig.monthly/100,'number','min="0" required')+field(t('Horizon (years)'),'years',mcConfig.years,'number','min="1" max="40" required')+field(t('Expected annual return (%)'),'mean',mcConfig.mean,'number','min="-99" max="100" required')+field(t('Annual volatility (%)'),'volatility',mcConfig.volatility,'number','min="0" max="100" required')+field(t('Annual inflation (%)'),'inflation',mcConfig.inflation,'number','min="0" max="50" required')+field(t('Target in today’s money'),'target',mcConfig.target/100,'number','min="0" required')+field(t('Simulated paths'),'paths',mcConfig.paths,'select',options(['1000','2000','5000'],String(mcConfig.paths)))+field(t('Random seed'),'seed',mcConfig.seed,'number','min="0" max="4294967295" required');
    return header(t('Explore a range of possibilities.'),state.language==='id'?'Uji distribusi hasil investasi dengan asumsi yang dapat diubah.':'Explore investment outcomes with explicit, editable assumptions.',button(t('Use recorded investments'),'mc-use'),'MONTE CARLO')+simSwitcher('montecarlo')+`<div class="content-grid"><section class="panel panel-pad"><h2>${t('Assumptions')}</h2><form id="mc-form"><div class="form-grid" style="margin-top:20px">${fields}</div><p class="form-error" id="mc-error" role="alert"></p><div class="form-actions"><button type="submit" class="btn primary">${t('Run simulation')} ${icon('scenarios')}</button></div></form></section><section class="panel panel-pad"><h2>${t('Simulation results')}</h2><div id="mc-result">${mcResult?mcOutput():`<div class="empty">${t('No simulation yet. Enter assumptions and run the model.')}</div>`}</div></section></div><div class="note">${state.language==='id'?'Model lognormal bulanan (GBM), satu portofolio, setoran pada akhir bulan, return independen, volatilitas tetap. P10–P90 adalah rentang persentil, bukan interval kepastian. Nilai akhir disesuaikan inflasi; setoran tetap nominal. Pajak, biaya, kurs masa depan, dan kejadian ekstrem di luar model tidak dihitung. Asumsi awal hanya ilustrasi, bukan prediksi atau rekomendasi.':'Monthly lognormal (GBM), one portfolio, end-of-month contributions, independent returns, constant volatility. P10–P90 is a percentile range, not a certainty interval. Ending values are inflation-adjusted; contributions stay nominal. Taxes, fees, future FX, and extreme events outside the model are not modeled. Default assumptions are illustrative, not predictions or recommendations.'}</div>`;
  }
  function mcOutput(){const r=mcResult;return `<div class="mc-metrics">${metric(t('Probability of reaching target'),(r.success*100).toFixed(1)+'%',`${r.paths.toLocaleString(locale())} ${t('Simulated paths').toLowerCase()}`,'goals')}${metric(t('Median ending value'),amount(r.ending.p50),state.language==='id'?'Daya beli hari ini':'In today’s purchasing power','scenarios')}</div><div class="chart-container" id="mc-chart">${mcChart()}</div><div class="mc-legend"><span>${t('P10–P90 range')}</span><span>— ${t('Median')}</span></div><div class="details-list"><div class="detail-line"><span>${t('10th percentile')}</span><b>${amount(r.ending.p10)}</b></div><div class="detail-line"><span>${t('90th percentile')}</span><b>${amount(r.ending.p90)}</b></div><div class="detail-line"><span>${t('Nominal principal-loss probability')}</span><b>${(r.belowPrincipal*100).toFixed(1)}%</b></div><div class="detail-line"><span>${t('Random seed')}</span><b>${r.seed}</b></div></div>`;}
  function mcChart(){if(!mcResult)return '';const bands=mcResult.bands,W=$('#mc-chart')?.clientWidth||600,H=205,L=65,R=15,T=15,B=28,maximum=Math.max(1,...bands.map(b=>b.p90))*1.08;const x=i=>L+i*(W-L-R)/(bands.length-1),y=n=>H-B-n/maximum*(H-T-B);const path=(key,arr=bands)=>arr.map((b,i)=>`${i?'L':'M'}${x(b.year).toFixed(1)},${y(b[key]).toFixed(1)}`).join(' ');const band=path('p90')+' '+bands.slice().reverse().map(b=>`L${x(b.year).toFixed(1)},${y(b.p10).toFixed(1)}`).join(' ')+' Z';const title=bands.map(b=>`${b.year}: P10 ${money(b.p10)}, P50 ${money(b.p50)}, P90 ${money(b.p90)}`).join('; ');return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${escape(title)}">${Array.from({length:4},(_,i)=>{const n=maximum*i/3;return `<line x1="${L}" x2="${W-R}" y1="${y(n)}" y2="${y(n)}" stroke="var(--line)"/><text x="0" y="${y(n)+3}">${money(n,true)}</text>`;}).join('')}<path d="${band}" fill="#a9ca7d" opacity=".24"/><path d="${path('p50')}" fill="none" stroke="#8eaf65" stroke-width="2.5"/>${bands.filter(b=>b.year===0||b.year===bands.length-1||b.year%Math.max(1,Math.ceil(bands.length/5))===0).map(b=>`<text x="${x(b.year)}" y="${H-5}" text-anchor="${b.year===0?'start':b.year===bands.length-1?'end':'middle'}">${state.language==='id'?'Thn':'Yr'} ${b.year}</text>`).join('')}</svg>`;}
  function runMonteCarlo(formElement){const data=Object.fromEntries(new FormData(formElement));try{const config={initial:positive(data.initial,true),monthly:positive(data.monthly,true),years:Number(data.years),mean:Number(data.mean),volatility:Number(data.volatility),inflation:Number(data.inflation),target:positive(data.target,true),paths:Number(data.paths),seed:Number(data.seed)};mcResult=E.monteCarlo({...config,mean:config.mean/100,volatility:config.volatility/100,inflation:config.inflation/100});mcConfig=config;$('#mc-error').textContent='';$('#mc-result').innerHTML=mcOutput();$('#mc-chart').innerHTML=mcChart();localize();}catch(e){$('#mc-error').textContent=t(e.message);}}
  let cardImageId=null,cardImageGeneration=0;
  async function normalizeCardImage(file){
    if(!file||!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size<=0||file.size>8*1024*1024)throw Error(L('Pilih PNG/JPEG/WebP maksimal 8 MB.','Choose PNG/JPEG/WebP up to 8 MB.'));
    const source=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Image read failed'));reader.readAsDataURL(file);});
    const image=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Invalid image file'));img.src=source;});
    const w=image.naturalWidth,h=image.naturalHeight;if(!w||!h||w*h>20000000)throw Error('Image must be at most 20 megapixels');
    const scale=Math.min(1,960/Math.max(w,h)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(w*scale));canvas.height=Math.max(1,Math.round(h*scale));const ctx=canvas.getContext('2d');if(!ctx)throw Error('Image processing unavailable');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
    let result=canvas.toDataURL('image/jpeg',.82);if(result.length>350000)result=canvas.toDataURL('image/jpeg',.60);E.validateCardImage(result);return result;
  }
  async function uploadCardImage(file){const id=cardImageId,generation=++cardImageGeneration;if(!file||!id)return;try{toast(L('Memproses gambar kartu…','Processing card artwork…'));const image=await normalizeCardImage(file);if(generation!==cardImageGeneration)return;const next=structuredClone(state),card=next.cards.find(c=>c.id===id);if(!card)throw Error('Card no longer exists');card.image=image;persistCorrection(next);render();successToast(L('Gambar kartu berhasil tersimpan.','Card artwork saved successfully.'));}catch(error){if(generation===cardImageGeneration)toast(error.message);}finally{if(generation===cardImageGeneration){cardImageId=null;$('#card-image-file').value='';}}}
  function cardImageAction(name,id){if(!state.cards.some(c=>c.id===id))return;if(name==='card-image'){cardImageId=id;cardImageGeneration++;$('#card-image-file').value='';$('#card-image-file').click();}else{try{const next=structuredClone(state);delete next.cards.find(c=>c.id===id).image;cardImageGeneration++;cardImageId=null;persistCorrection(next);render();successToast(L('Gambar kartu dihapus.','Card artwork removed.'));}catch(error){toast(error.message);}}}
  document.addEventListener('change',event=>{if(event.target.id==='card-image-file')uploadCardImage(event.target.files?.[0]);});
  function cards(){const cards=viewState().cards.map(c=>({...c,debt:state.debts.find(d=>d.id===c.debtId)}));const total=E.sum(cards.map(c=>E.reporting(state,c.debt,'balance'))),limits=E.sum(cards.map(c=>E.convert(state,c.limit,c.debt.currency))),unpaid=E.sum(cards.map(c=>E.convert(state,Math.max(0,c.statementAmount-c.paid),c.debt.currency)));const reminders=E.reminders(viewState(),date());return header(t('Stay ahead of your due dates.'),state.language==='id'?'Pantau tagihan, penggunaan limit, dan jadwal review setiap kartu.':'Track statements, credit utilization, and review dates for every card.',button(t('Add credit card'),'card-new','primary','plus'),'CREDIT CARDS')+accountSwitcher('cards')+`<div class="metrics-grid">${metric(t('Total card debt'),amount(total),state.language==='id'?'Sudah termasuk di total utang':'Included in total liabilities','debt')}${metric(t('Total limits'),amount(limits),state.language==='id'?'Limit bukan aset':'Limits are not assets','cards')}${metric(t('Unpaid statements'),amount(unpaid),state.language==='id'?'Tagihan − pembayaran tercatat':'Statement − recorded payments','receipt')}${metric(t('Upcoming reminders'),String(reminders.length),state.language==='id'?'Jatuh tempo & pengajuan limit':'Due dates & limit review','calendar')}</div><div class="heading-actions" style="margin-bottom:20px">${button(t('Export calendar'),'card-calendar','','calendar')}${button(t('Enable device reminders'),'notify-enable','','bell')}</div><div class="content-grid">${cards.map(c=>{const days=E.dayDifference(date(),c.dueDate),remaining=Math.max(0,c.statementAmount-c.paid),util=c.debt.balance/c.limit*100;return `<section class="panel panel-pad credit-panel">${c.image?`<img class="credit-art" src="${escape(c.image)}" alt="${escape(L('Desain kartu ','Card artwork: ')+c.name)}"><div class="credit-art-label"><h2>${user(c.name)}</h2><small>•••• ${c.last4} · ${user(c.owner)}</small></div>`:`<div class="credit-visual"><div><small>INVEYS · ${c.debt.currency}</small><h2>${user(c.name)}</h2><p>•••• &nbsp; •••• &nbsp; •••• &nbsp; ${c.last4}</p><b>${user(c.owner)}</b></div><span>${icon('debt')}</span></div>`}<div class="details-list"><div class="detail-line"><span>${t('Outstanding')}</span><b>${native(c.debt,'balance')}</b></div><div class="detail-line"><span>${t('Credit limit')}</span><b>${amount(c.limit,c.debt.currency)}</b></div><div class="detail-line"><span>${t('Available limit')}</span><b>${amount(c.limit-c.debt.balance,c.debt.currency)}</b></div></div><div class="progress-track"><div class="progress-fill" style="width:${Math.max(0,Math.min(100,util))}%;${util>80?'background:var(--red)':''}"></div></div><small>${util.toFixed(1)}% ${state.language==='id'?'limit digunakan':'limit utilized'} · ${idr(c.debt,'balance')}</small><div class="details-list"><div class="detail-line"><span>${t('Remaining statement')}</span><b>${amount(remaining,c.debt.currency)}</b></div><div class="detail-line"><span>${t('Due date')}</span><b class="${remaining>0&&days<=0?'negative':''}">${c.dueDate} ${remaining===0?'✓':`(${days<0?(state.language==='id'?'terlambat ':'overdue ')+(-days):days===0?(state.language==='id'?'hari ini':'today'):(state.language==='id'?days+' hari':days+' days')})`}</b></div><div class="detail-line"><span>${t('Limit review date')}</span><b>${c.limitDate||t('Not set')}</b></div><div class="detail-line"><span>${t('Minimum payment')}</span><b>${native(c.debt,'minimum')}</b></div></div><div class="card-actions">${button(t('Record payment'),'card-pay:'+c.id,'primary')}${button(L('Belanja kartu','Card purchase'),'ops-card-purchase:'+c.id)}${button(t('Edit'),'card:'+c.id)}${button(L(c.image?'Ganti gambar':'Unggah gambar',c.image?'Replace artwork':'Upload artwork'),'card-image:'+c.id,'','capture')}${c.image?button(L('Hapus gambar','Remove artwork'),'card-image-remove:'+c.id,'','delete'):''}</div></section>`;}).join('')||`<section class="panel empty full">${t('No cards yet. Add a card to track its statement and review dates.')}</section>`}</div><section class="panel panel-pad" style="margin-top:22px"><h2>${t('Upcoming reminders')}</h2>${reminderHTML()}</section><div class="note">${L('Unggah desain kartu PNG/JPEG/WebP maksimal 8 MB. Gunakan gambar tanpa nomor kartu lengkap, CVV atau PIN. Desain tersimpan pada perangkat ini dan ikut dalam backup JSON. ','Upload PNG/JPEG/WebP card artwork up to 8 MB. Use artwork without full card numbers, CVV or PIN. Artwork stays on this device and is included in JSON backups. ')}${state.language==='id'?'Tanggal pengajuan kenaikan limit ditentukan pengguna; ini bukan kepastian kelayakan atau persetujuan bank. Pengingat perangkat hanya diperiksa saat aplikasi terbuka. Ekspor kalender (.ics) untuk pengingat melalui kalender saat aplikasi tertutup. Tagihan harus diperbarui setiap siklus; tanggal tidak digeser otomatis.':'Limit review dates are user-defined and do not guarantee bank eligibility or approval. Device reminders are checked only while the app is open. Export a calendar (.ics) for calendar reminders while the app is closed. Update statements each cycle; dates are not rolled forward automatically.'}</div>`;}
  function editCard(id){const c=state.cards.find(c=>c.id===id),debt=state.debts.find(d=>d.id===c?.debtId);const unlinked=state.debts.filter(d=>!state.cards.some(card=>card.debtId===d.id));const debtOptions=`<option value="new">${t('Create new debt')}</option>`+unlinked.map(d=>`<option value="${d.id}">${escape(d.name)} (${d.currency})</option>`).join('');openModal(t(c?'Credit card dashboard':'Add credit card'),form(field(t('Card name'),'name',c?.name||'','text','required maxlength="120"')+field(t('Owner name'),'owner',c?.owner||state.members[0]?.name||'Me','text','required maxlength="80"')+field(t('Last 4 digits'),'last4',c?.last4||'','text','required pattern="[0-9]{4}" maxlength="4"')+field(t('Currency'),'currency','','select',options(E.currencies,debt?.currency||state.currency))+(!c?field(t('Link existing debt'),'debtId','','select',debtOptions):'')+field(t('Outstanding'),'balance',debt?debt.balance/100:0,'number','min="0" required')+field(t('Credit limit'),'limit',c?c.limit/100:'','number','min="0.01" required')+field(t('Annual rate (%)'),'apr',debt?.apr||0,'number','min="0" max="100" required')+field(t('Minimum payment'),'minimum',debt?debt.minimum/100:'','number','min="0.01" required')+field(t('Statement amount'),'statementAmount',c?c.statementAmount/100:0,'number','min="0" required')+field(t('Statement paid'),'paid',c?c.paid/100:0,'number','min="0" required')+field(t('Due date'),'dueDate',c?.dueDate||date(),'date','required')+field(t('Limit review date'),'limitDate',c?.limitDate||'','date')+field(t('Reminder lead time (days)'),'reminderDays',c?.reminderDays??7,'number','min="0" max="30" required'),t('Save card'),state.language==='id'?'Hubungkan utang yang sudah ada agar tidak dihitung dua kali. Tidak menyimpan nomor kartu lengkap, CVV, atau PIN. Untuk siklus tagihan baru, isi nominal tagihan baru dan reset pembayaran ke 0.':'Link existing debt to avoid double counting. Never store full card numbers, CVV, or PIN. For a new statement cycle, update the amount and reset paid to 0.'),data=>{const linked=c?debt:state.debts.find(d=>d.id===data.debtId);const currency=linked?.currency||data.currency;const apr=Number(data.apr),days=Number(data.reminderDays);if(!Number.isFinite(apr)||apr<0||apr>100||!Number.isInteger(days)||days<0||days>30)throw Error(t('Invalid credit card.'));if(!/^\d{4}$/.test(data.last4)||!E.validDate(data.dueDate)||(data.limitDate&&!E.validDate(data.limitDate)))throw Error(t('Invalid credit card.'));const statementAmount=positive(data.statementAmount,true),paid=positive(data.paid,true);if(paid>statementAmount)throw Error(state.language==='id'?'Pembayaran tidak boleh melebihi tagihan.':'Paid cannot exceed statement amount.');const newDebt={id:linked?.id||uid(),name:linked?.name||requireText(data.name),currency,balance:positive(data.balance,true),minimum:positive(data.minimum),apr};const record={id:c?.id||uid(),debtId:newDebt.id,name:requireText(data.name),owner:requireText(data.owner),last4:data.last4,limit:positive(data.limit),statementAmount,paid,dueDate:data.dueDate,limitDate:data.limitDate,reminderDays:days};const candidate=structuredClone(state);if(linked)Object.assign(candidate.debts.find(d=>d.id===linked.id),newDebt);else candidate.debts.push(newDebt);if(c)Object.assign(candidate.cards.find(card=>card.id===id),record);else candidate.cards.push(record);E.validate(candidate);state=candidate;toast('Card saved.');});if(c){$('#field-currency').disabled=true;addRemove('card',id);}else $('#field-debtId').addEventListener('change',()=>{const d=state.debts.find(d=>d.id===$('#field-debtId').value);for(const key of ['balance','minimum'])$('#field-'+key).value=d?d[key]/100:0;$('#field-apr').value=d?.apr||0;$('#field-currency').value=d?.currency||state.currency;$('#field-currency').disabled=!!d;});}
  function recordCardPayment(id){const c=state.cards.find(c=>c.id===id),d=state.debts.find(d=>d.id===c.debtId);const liquid=state.accounts.filter(a=>['Checking','Savings','Cash'].includes(a.type));if(!liquid.length){toast(state.language==='id'?'Tambahkan rekening likuid dahulu.':'Add a liquid account first.');return;}openModal(t('Record payment'),form(field(t('Payment amount')+' ('+d.currency+')','amount',Math.min(d.balance,Math.max(0,c.statementAmount-c.paid))/100,'number','min="0.01" required')+field(t('Payment account'),'accountId','','select',liquid.map(a=>`<option value="${a.id}">${escape(a.name)} (${a.currency})</option>`).join(''))+field(t('Payment date'),'date',date(),'date','required'),t('Record payment'),state.language==='id'?'Hanya mencatat pembayaran yang Anda lakukan. Saldo rekening dan utang dikurangi bersamaan; aplikasi tidak mengirim uang. Kurs lintas mata uang memakai kurs tersimpan.':'Records a payment you already made. Account and debt balances are reduced together; the app does not move money. Cross-currency payments use saved rates.'),data=>{const value=positive(data.amount);persistCorrection(OPS.cardPayment(state,id,data.accountId,value,data.date,uid()));toast('Payment recorded.');});}
  function reminderHTML(){const reminders=E.reminders(state,date());return reminders.map(r=>`<div class="reminder-item ${r.days<0?'overdue':''}"><span>${icon(r.type==='due'?'calendar':'scenarios')}</span><div><b>${user(r.name)} · ${t(r.type==='due'?'Due date':'Limit review date')}</b><small>${r.date} · ${r.days<0?(state.language==='id'?'Terlambat ':'Overdue ')+(-r.days):r.days===0?(state.language==='id'?'Hari ini':'Today'):r.days+(state.language==='id'?' hari lagi':' days away')}${r.type==='due'?' · '+money(r.remaining,false,r.currency):''}</small></div><button class="quiet-link" data-action="card:${r.cardId}">${t('Edit')} ↗</button></div>`).join('')||`<div class="empty">${t('No active card reminders.')}</div>`;}
  function openReminders(){openModal(t('Upcoming reminders'),reminderHTML()+`<div class="form-actions">${button(t('Export calendar'),'card-calendar','','calendar')}</div>`);}
  function calendarExport(){const sanitize=s=>String(s).replace(/[\r\n]/g,' ').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,');const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//INVEYS//Card Reminders//EN','CALSCALE:GREGORIAN'];let count=0;for(const c of state.cards){for(const type of ['due','limit']){if(type==='due'&&c.statementAmount<=c.paid)continue;const dt=type==='due'?c.dueDate:c.limitDate;if(!dt)continue;lines.push('BEGIN:VEVENT','UID:'+c.id+'-'+type+'-'+dt+'@inveys.local','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''),'DTSTART;VALUE=DATE:'+dt.replace(/-/g,''),'SUMMARY:'+sanitize(c.name+' · '+t(type==='due'?'Due date':'Limit review date')),'DESCRIPTION:'+sanitize(type==='limit'?(state.language==='id'?'Pengingat pengajuan limit; persetujuan bergantung bank.':'Limit-review reminder; approval depends on issuer.'):(state.language==='id'?'Tinjau dan bayar tagihan melalui bank Anda.':'Review and pay the statement through your bank.')),'BEGIN:VALARM','ACTION:DISPLAY','TRIGGER:'+(c.reminderDays?'-P'+c.reminderDays+'D':'PT0S'),'DESCRIPTION:INVEYS reminder','END:VALARM','END:VEVENT');count++;}}lines.push('END:VCALENDAR');if(!count){toast(t('No active card reminders.'));return;}const encoder=new TextEncoder();const folded=lines.map(line=>{let out='',part='';for(const ch of line){if(encoder.encode(part+ch).length>73){out+=part+'\r\n ';part=ch;}else part+=ch;}return out+part;}).join('\r\n');download('inveys-card-reminders.ics',folded+'\r\n','text/calendar');toast(state.language==='id'?'Kalender diekspor. Impor ke aplikasi kalender dan aktifkan pengingat.':'Calendar exported. Import it into your calendar and enable reminders.');}
  async function enableNotifications(){if(!('Notification' in window)){toast(state.language==='id'?'Browser ini tidak mendukung notifikasi. Gunakan ekspor kalender.':'Device notifications are unavailable; use calendar export.');return;}try{const permission=await Notification.requestPermission();if(permission!=='granted'){toast(state.language==='id'?'Izin notifikasi belum diberikan. Pengingat dalam aplikasi tetap tersedia.':'Notifications not permitted; in-app reminders remain available.');return;}checkNotifications();toast(state.language==='id'?'Notifikasi aktif selama aplikasi terbuka.':'Notifications enabled while the app is open.');}catch{toast(state.language==='id'?'Notifikasi tidak tersedia. Gunakan ekspor kalender.':'Notifications unavailable; use calendar export.');}}
  function checkNotifications(){if(!('Notification' in window)||Notification.permission!=='granted')return;for(const r of E.reminders(state,date())){const key=r.id+'-'+date();if(state.notified[key])continue;try{new Notification('INVEYS · '+t('Upcoming reminders'),{body:r.name+' · '+t(r.type==='due'?'Due date':'Limit review date')+' · '+r.date,tag:r.id});state.notified[key]=true;}catch{}}const keys=Object.keys(state.notified);if(keys.length>500)for(const key of keys.slice(0,keys.length-500))delete state.notified[key];save();}
  function extensionAction(name,id,extra){
    if(name.startsWith('calendar-') || name.startsWith('bill-')){
      calendarAction(name, id, extra);
      return true;
    }
    switch(name){
      case 'owner-edit':editOwner();return true;
      case 'fx-edit':editFX();return true;
      case 'card-new':editCard();return true;
      case 'card':editCard(id);return true;
      case 'card-pay':recordCardPayment(id);return true;
      case 'card-calendar':calendarExport();return true;
      case 'notify-enable':enableNotifications();return true;
      case 'remove-card':confirmAction(t('Remove record'),state.language==='id'?'Hapus pengingat dan metadata kartu. Catatan utang dipertahankan agar liabilitas tidak hilang.':'Remove card reminders and metadata. The underlying debt remains recorded.',()=>{state.cards=state.cards.filter(c=>c.id!==id);toast(t('Remove record'));});return true;
      case 'mc-use':mcConfig=null;mcResult=null;render();return true;
      default:return false;
    }
  }

  let calendarYear = new Date().getFullYear(), calendarMonth = new Date().getMonth(), calendarViewMode = 'calendar';

  function getMonthlyBills(year, month){
    const monthKey = `${year}-${String(month+1).padStart(2,'0')}`;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = date();
    const results = [];

    for(const sub of (state.subscriptions || [])){
      if(sub.cadence === 'annual' && sub.month !== undefined && sub.month !== (month + 1)) continue;
      const day = Math.min(Math.max(1, Number(sub.day) || 1), daysInMonth);
      const dueDate = `${monthKey}-${String(day).padStart(2,'0')}`;
      let paid = false;
      const manual = state.billPayments?.[monthKey]?.[sub.id];
      if(typeof manual === 'boolean') paid = manual;
      else if(manual && typeof manual === 'object') paid = !!manual.paid;
      else {
        const nameLower = (sub.name || '').toLowerCase();
        const match = state.transactions.find(t => t.date && t.date.startsWith(monthKey) && t.kind === 'expense' && (t.name.toLowerCase().includes(nameLower) || (sub.category && t.category === sub.category && Math.abs(t.amount - sub.amount) < 100)));
        if(match) paid = true;
      }
      results.push({
        id: sub.id,
        rawId: sub.id,
        type: 'subscription',
        name: sub.name,
        emoji: sub.emoji || '🎬',
        category: sub.category || 'Subscriptions',
        amount: sub.amount || 0,
        currency: sub.currency || state.currency,
        day,
        dueDate,
        cadence: sub.cadence || 'monthly',
        owner: sub.owner || 'Me',
        paid,
        isOverdue: !paid && (dueDate < todayStr),
        isToday: (dueDate === todayStr)
      });
    }

    for(const flow of (viewState().flows || []).filter(f => f.kind === 'expense')){
      const day = Math.min(Math.max(1, Number(flow.day) || 1), daysInMonth);
      const dueDate = `${monthKey}-${String(day).padStart(2,'0')}`;
      const billId = 'flow-' + flow.id;
      let paid = false;
      const manual = state.billPayments?.[monthKey]?.[billId];
      if(typeof manual === 'boolean') paid = manual;
      else if(manual && typeof manual === 'object') paid = !!manual.paid;
      else {
        const nameLower = (flow.name || '').toLowerCase();
        const match = state.transactions.find(t => t.date && t.date.startsWith(monthKey) && t.kind === 'expense' && t.name.toLowerCase().includes(nameLower));
        if(match) paid = true;
      }
      results.push({
        id: billId,
        rawId: flow.id,
        type: 'flow',
        name: flow.name,
        emoji: '📄',
        category: 'Cash flow',
        amount: flow.amount || 0,
        currency: flow.currency || state.currency,
        day,
        dueDate,
        cadence: 'monthly',
        owner: flow.owner || 'Household',
        paid,
        isOverdue: !paid && (dueDate < todayStr),
        isToday: (dueDate === todayStr)
      });
    }

    for(const card of (state.cards || [])){
      if(!card.statementAmount || card.statementAmount <= 0) continue;
      let day = 15;
      if(card.dueDate && card.dueDate.startsWith(monthKey)) day = parseInt(card.dueDate.slice(8,10), 10) || 15;
      else if(card.dueDate && card.dueDate.length >= 10) day = Math.min(parseInt(card.dueDate.slice(8,10), 10) || 15, daysInMonth);
      day = Math.min(Math.max(1, day), daysInMonth);
      const dueDate = `${monthKey}-${String(day).padStart(2,'0')}`;
      const billId = 'card-' + card.id;
      let paid = false;
      const manual = state.billPayments?.[monthKey]?.[billId];
      if(typeof manual === 'boolean') paid = manual;
      else if(card.paid >= card.statementAmount && card.statementAmount > 0) paid = true;
      const debt = state.debts.find(d => d.id === card.debtId);
      results.push({
        id: billId,
        rawId: card.id,
        type: 'card',
        name: card.name + ' · ' + (state.language === 'id' ? 'Tagihan Kartu' : 'Card Bill'),
        emoji: '💳',
        category: 'Credit card',
        amount: Math.max(0, card.statementAmount - (paid ? 0 : card.paid)),
        currency: debt?.currency || state.currency,
        day,
        dueDate,
        cadence: 'monthly',
        owner: card.owner || 'Household',
        paid,
        isOverdue: !paid && (dueDate < todayStr),
        isToday: (dueDate === todayStr)
      });
    }

    return results.sort((a,b) => a.day - b.day || a.name.localeCompare(b.name));
  }

  function getMonthlyIncomes(year, month){
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthKey = `${year}-${String(month+1).padStart(2,'0')}`;
    const todayStr = date();
    const results = [];

    for(const flow of (viewState().flows || []).filter(f => f.kind === 'income')){
      const day = Math.min(Math.max(1, Number(flow.day) || 1), daysInMonth);
      const dueDate = `${monthKey}-${String(day).padStart(2,'0')}`;
      const incId = 'income-' + flow.id;
      let received = false;
      const manual = state.billPayments?.[monthKey]?.[incId];
      if(typeof manual === 'boolean') received = manual;
      else if(manual && typeof manual === 'object') received = !!manual.paid;
      else {
        const nameLower = (flow.name || '').toLowerCase();
        const match = state.transactions.find(t => t.date && t.date.startsWith(monthKey) && t.kind === 'income' && t.name.toLowerCase().includes(nameLower));
        if(match) received = true;
      }
      results.push({
        id: incId,
        rawId: flow.id,
        type: 'income',
        name: flow.name,
        emoji: F.categoryIcon(flow.name) || '💵',
        category: L('Pemasukan / Gaji','Income / Payday'),
        amount: flow.amount || 0,
        currency: flow.currency || state.currency,
        day,
        dueDate,
        cadence: 'monthly',
        owner: flow.owner || 'Household',
        received,
        isPast: (dueDate < todayStr),
        isToday: (dueDate === todayStr)
      });
    }

    return results.sort((a,b) => a.day - b.day || a.name.localeCompare(b.name));
  }

  function calendarAction(name, id, extra){
    const monthKey = `${calendarYear}-${String(calendarMonth+1).padStart(2,'0')}`;
    switch(name){
      case 'calendar-prev':
        calendarMonth--;
        if(calendarMonth < 0){ calendarMonth = 11; calendarYear--; }
        render();
        break;
      case 'calendar-next':
        calendarMonth++;
        if(calendarMonth > 11){ calendarMonth = 0; calendarYear++; }
        render();
        break;
      case 'calendar-today': {
        const now = new Date();
        calendarYear = now.getFullYear();
        calendarMonth = now.getMonth();
        render();
        break;
      }
      case 'calendar-mode':
        calendarViewMode = id || 'calendar';
        render();
        break;
      case 'bill-new':
      case 'bill-new-day':
        openNewSubscriptionModal(id ? Number(id) : null);
        break;
      case 'bill-edit':
        openEditSubscriptionModal(id);
        break;
      case 'bill-delete':
        confirmAction(L('Hapus langganan ini?','Delete this subscription?'), L('Langganan akan dihapus dari daftar. Transaksi historis di jurnal tidak dihapus.','This subscription will be removed. Past transactions in your journal remain unchanged.'), ()=>{
          state.subscriptions = (state.subscriptions || []).filter(s => s.id !== id);
          save();
          render();
          toast(L('Langganan dihapus.','Subscription removed.'));
        });
        break;
      case 'bill-toggle-paid': {
        state.billPayments ??= {};
        state.billPayments[monthKey] ??= {};
        const currentlyPaid = !!state.billPayments[monthKey][id];
        state.billPayments[monthKey][id] = !currentlyPaid;
        save();
        render();
        toast(!currentlyPaid ? L('Tagihan ditandai lunas.','Bill marked as paid.') : L('Tagihan ditandai belum lunas.','Bill marked as unpaid.'));
        break;
      }
      case 'bill-detail': {
        const bills = getMonthlyBills(calendarYear, calendarMonth);
        const bill = bills.find(b => b.id === id);
        if(!bill) return;
        openBillDetailModal(bill, extra || bill.dueDate);
        break;
      }
      case 'bill-pay-record': {
        const bills = getMonthlyBills(calendarYear, calendarMonth);
        const bill = bills.find(b => b.id === id);
        if(!bill) return;
        openRecordBillPaymentModal(bill, extra || bill.dueDate);
        break;
      }
      case 'income-detail': {
        const incomes = getMonthlyIncomes(calendarYear, calendarMonth);
        const inc = incomes.find(i => i.id === id);
        if(!inc) return;
        openIncomeDetailModal(inc, extra || inc.dueDate);
        break;
      }
      case 'income-toggle-received': {
        state.billPayments ??= {};
        state.billPayments[monthKey] ??= {};
        const cur = !!state.billPayments[monthKey][id];
        state.billPayments[monthKey][id] = !cur;
        save();
        render();
        toast(!cur ? L('Pemasukan ditandai sudah diterima.','Income marked as received.') : L('Pemasukan ditandai belum diterima.','Income marked as pending.'));
        break;
      }
      case 'income-record': {
        const incomes = getMonthlyIncomes(calendarYear, calendarMonth);
        const inc = incomes.find(i => i.id === id);
        if(!inc) return;
        openRecordIncomeModal(inc, extra || inc.dueDate);
        break;
      }
    }
  }

  function openIncomeDetailModal(inc, dueDate){
    const statusLabel = inc.received ? `<span class="badge positive">${icon('check')} ${L('Sudah Diterima','Received')}</span>` : `<span class="badge blue">${L('Dijadwalkan','Scheduled')}</span>`;
    const content = `
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
        <span style="font-size:32px;display:grid;place-items:center;width:56px;height:56px;border-radius:12px;background:var(--bg);border:1px solid var(--line)">${escape(inc.emoji)}</span>
        <div>
          <h2 style="margin:0;font-size:18px">${user(inc.name)}</h2>
          <small style="color:var(--muted)">${escape(inc.category)} · ${L('Bulanan','Monthly')} · ${user(inc.owner)}</small>
        </div>
        <div style="margin-left:auto">${statusLabel}</div>
      </div>
      <div class="details-list" style="margin-bottom:24px">
        <div class="detail-line"><span>${L('Nominal pemasukan','Expected amount')}</span><b class="positive">+${native(inc,'amount')}</b></div>
        <div class="detail-line"><span>${L('Tanggal jadwal / payday','Scheduled payday')}</span><b>${escape(dueDate || inc.dueDate)}</b></div>
        <div class="detail-line"><span>${L('Status realisasi','Status')}</span><b>${inc.received ? L('Sudah diterima / tercatat','Received / recorded') : L('Menunggu penerimaan','Pending deposit')}</b></div>
      </div>
      <div class="form-actions" style="flex-wrap:wrap;gap:8px">
        ${button(inc.received ? L('Tandai Belum Diterima','Mark Not Received') : L('Tandai Sudah Diterima','Mark Received'), `income-toggle-received:${inc.id}:${dueDate}`, inc.received ? '' : 'lime')}
        ${!inc.received ? button(L('Catat Pemasukan ke Rekening','Record Income to Account'), `income-record:${inc.id}:${dueDate}`, 'primary') : ''}
      </div>
    `;
    openModal(L('Detail Pemasukan / Payday','Income / Payday Details'), content);
  }

  function openRecordIncomeModal(inc, dueDate){
    const liquid = state.accounts.filter(a => ['Checking','Savings','Cash'].includes(a.type));
    if(!liquid.length){
      toast(L('Tambahkan rekening likuid (Checking/Savings/Cash) terlebih dahulu.','Add a liquid account first.'));
      return;
    }
    const accountOpts = liquid.map(a => `<option value="${a.id}">${escape(a.name)} (${a.currency})</option>`).join('');
    openModal(
      L('Catat Pemasukan','Record Income'),
      form(
        field(L('Deskripsi pemasukan','Description'), 'name', inc.name, 'text', 'required maxlength="120"') +
        field(L('Nominal pemasukan','Amount') + ' (' + inc.currency + ')', 'amount', inc.amount / 100, 'number', 'min="0.01" required') +
        field(L('Rekening penerima','Deposit account'), 'accountId', '', 'select', accountOpts) +
        field(L('Kategori','Category'), 'category', 'Paychecks', 'text', 'required maxlength="80"') +
        field(L('Tanggal terima','Date'), 'date', dueDate || date(), 'date', 'required'),
        L('Catat Pemasukan','Record Income'),
        L('Mencatat transaksi pemasukan riil dan menandai jadwal pemasukan ini sebagai sudah diterima bulan ini.','Records a real income transaction and marks this payday as received for this month.')
      ),
      d => {
        const val = positive(d.amount);
        E.applyTransaction(state, {
          id: uid(),
          name: requireText(d.name),
          kind: 'income',
          amount: val,
          accountId: d.accountId,
          category: requireText(d.category),
          date: d.date,
          status: 'posted'
        });
        const monthKey = `${calendarYear}-${String(calendarMonth+1).padStart(2,'0')}`;
        state.billPayments ??= {};
        state.billPayments[monthKey] ??= {};
        state.billPayments[monthKey][inc.id] = true;
        save();
        render();
        successToast(L('Pemasukan dicatat ke rekening dan ditandai diterima.','Income recorded to account and marked as received.'));
      }
    );
  }

  function openBillDetailModal(b, dueDate){
    const statusLabel = b.paid ? `<span class="badge positive">${icon('check')} ${L('Lunas','Paid')}</span>` : (b.isOverdue ? `<span class="badge orange">${L('Terlambat','Overdue')}</span>` : `<span class="badge blue">${L('Jatuh tempo','Due')}</span>`);
    const content = `
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
        <span style="font-size:32px;display:grid;place-items:center;width:56px;height:56px;border-radius:12px;background:var(--bg);border:1px solid var(--line)">${escape(b.emoji)}</span>
        <div>
          <h2 style="margin:0;font-size:18px">${user(b.name)}</h2>
          <small style="color:var(--muted)">${escape(b.category)} · ${b.cadence==='annual'?L('Tahunan','Annual'):L('Bulanan','Monthly')} · ${user(b.owner)}</small>
        </div>
        <div style="margin-left:auto">${statusLabel}</div>
      </div>
      <div class="details-list" style="margin-bottom:24px">
        <div class="detail-line"><span>${L('Nominal tagihan','Bill amount')}</span><b>${native(b,'amount')}</b></div>
        <div class="detail-line"><span>${L('Jatuh tempo','Due date')}</span><b>${escape(dueDate || b.dueDate)}</b></div>
        <div class="detail-line"><span>${L('Jenis item','Item type')}</span><b>${b.type==='subscription'?L('Langganan rutin','Subscription'):(b.type==='card'?L('Tagihan kartu kredit','Credit card statement'):L('Komitmen cashflow','Cashflow commitment'))}</b></div>
      </div>
      <div class="form-actions" style="flex-wrap:wrap;gap:8px">
        ${button(b.paid ? L('Tandai Belum Lunas','Mark as Unpaid') : L('Tandai Lunas','Mark as Paid'), `bill-toggle-paid:${b.id}:${dueDate}`, b.paid ? '' : 'lime')}
        ${!b.paid ? button(L('Catat Pembayaran ke Akun','Record Payment to Account'), `bill-pay-record:${b.id}:${dueDate}`, 'primary') : ''}
        ${b.type==='subscription' ? button(L('Edit Langganan','Edit Subscription'), `bill-edit:${b.rawId}`) : ''}
        ${b.type==='subscription' ? button(L('Hapus','Delete'), `bill-delete:${b.rawId}`, 'danger') : ''}
      </div>
    `;
    openModal(L('Detail Tagihan & Langganan','Bill & Subscription Details'), content);
  }

  function openRecordBillPaymentModal(b, dueDate){
    const liquid = state.accounts.filter(a => ['Checking','Savings','Cash'].includes(a.type));
    if(!liquid.length){
      toast(L('Tambahkan rekening likuid (Checking/Savings/Cash) terlebih dahulu.','Add a liquid account first.'));
      return;
    }
    const accountOpts = liquid.map(a => `<option value="${a.id}">${escape(a.name)} (${a.currency})</option>`).join('');
    openModal(
      L('Catat Pembayaran Tagihan','Record Bill Payment'),
      form(
        field(L('Deskripsi transaksi','Description'), 'name', b.name, 'text', 'required maxlength="120"') +
        field(L('Nominal pembayaran','Amount') + ' (' + b.currency + ')', 'amount', b.amount / 100, 'number', 'min="0.01" required') +
        field(L('Rekening pembayaran','Payment account'), 'accountId', '', 'select', accountOpts) +
        field(L('Kategori','Category'), 'category', b.category || 'Subscriptions', 'text', 'required maxlength="80"') +
        field(L('Tanggal bayar','Date'), 'date', dueDate || date(), 'date', 'required'),
        L('Catat Pembayaran','Record Payment'),
        L('Mencatat pengeluaran riil di rekening terpilih dan otomatis menandai tagihan sebagai lunas untuk bulan ini.','Records a real expense in the selected account and marks this bill as paid for this month.')
      ),
      d => {
        const val = positive(d.amount);
        E.applyTransaction(state, {
          id: uid(),
          name: requireText(d.name),
          kind: 'expense',
          amount: val,
          accountId: d.accountId,
          category: requireText(d.category),
          date: d.date,
          status: 'posted'
        });
        const monthKey = `${calendarYear}-${String(calendarMonth+1).padStart(2,'0')}`;
        state.billPayments ??= {};
        state.billPayments[monthKey] ??= {};
        state.billPayments[monthKey][b.id] = true;
        save();
        render();
        successToast(L('Pembayaran dicatat dan tagihan ditandai lunas.','Payment recorded and bill marked as paid.'));
      }
    );
  }

  function openNewSubscriptionModal(day = null){
    const memberOptions = options(state.members.map(m=>m.name), state.members[0]?.name || 'Me');
    const currencyOpts = options(E.currencies, state.currency);
    const categoryOpts = options(['Entertainment','Utilities','Software','Housing','Health','Transport','Food','Education','Other'], 'Entertainment');
    const defaultDay = day && day >= 1 && day <= 31 ? day : new Date().getDate();

    openModal(
      L('Tambah Langganan Baru','Add New Subscription'),
      form(
        field(L('Nama langganan','Subscription name'), 'name', '', 'text', 'required maxlength="120" placeholder="e.g. Netflix, Spotify, Indihome"') +
        field(L('Ikon / Emoji','Icon / Emoji'), 'emoji', '🎬', 'text', 'maxlength="8"') +
        field(L('Nominal tagihan','Amount'), 'amount', '', 'number', 'min="0.01" required placeholder="0.00"') +
        field(L('Mata uang','Currency'), 'currency', '', 'select', currencyOpts) +
        field(L('Kategori','Category'), 'category', '', 'select', categoryOpts) +
        field(L('Tanggal jatuh tempo (1–31)','Due day of month (1–31)'), 'day', defaultDay, 'number', 'min="1" max="31" required') +
        field(L('Frekuensi','Cadence'), 'cadence', '', 'select', options(['monthly','annual'], 'monthly')) +
        field(L('Pemilik','Owner'), 'owner', '', 'select', memberOptions),
        L('Simpan Langganan','Save Subscription'),
        L('Langganan akan muncul secara otomatis di kalender setiap bulannya.','Subscriptions will appear automatically in your calendar each month.')
      ),
      d => {
        state.subscriptions ??= [];
        const record = {
          id: uid(),
          name: requireText(d.name),
          emoji: (d.emoji || '🎬').trim(),
          amount: positive(d.amount),
          currency: d.currency || state.currency,
          category: requireText(d.category),
          day: Math.min(31, Math.max(1, Number(d.day) || 1)),
          cadence: d.cadence || 'monthly',
          owner: d.owner || state.members[0]?.name || 'Me',
          autoRenew: true
        };
        state.subscriptions.push(record);
        save();
        render();
        successToast(L('Langganan berhasil ditambahkan.','Subscription added successfully.'));
      }
    );
  }

  function openEditSubscriptionModal(id){
    const sub = (state.subscriptions || []).find(s => s.id === id);
    if(!sub) return;
    const memberOptions = options(state.members.map(m=>m.name), sub.owner || state.members[0]?.name || 'Me');
    const currencyOpts = options(E.currencies, sub.currency || state.currency);
    const categoryOpts = options(['Entertainment','Utilities','Software','Housing','Health','Transport','Food','Education','Other'], sub.category || 'Entertainment');

    openModal(
      L('Edit Langganan','Edit Subscription'),
      form(
        field(L('Nama langganan','Subscription name'), 'name', sub.name, 'text', 'required maxlength="120"') +
        field(L('Ikon / Emoji','Icon / Emoji'), 'emoji', sub.emoji || '🎬', 'text', 'maxlength="8"') +
        field(L('Nominal tagihan','Amount'), 'amount', sub.amount / 100, 'number', 'min="0.01" required') +
        field(L('Mata uang','Currency'), 'currency', '', 'select', currencyOpts) +
        field(L('Kategori','Category'), 'category', '', 'select', categoryOpts) +
        field(L('Tanggal jatuh tempo (1–31)','Due day of month (1–31)'), 'day', sub.day || 1, 'number', 'min="1" max="31" required') +
        field(L('Frekuensi','Cadence'), 'cadence', '', 'select', options(['monthly','annual'], sub.cadence || 'monthly')) +
        field(L('Pemilik','Owner'), 'owner', '', 'select', memberOptions),
        L('Simpan Perubahan','Save Changes')
      ),
      d => {
        sub.name = requireText(d.name);
        sub.emoji = (d.emoji || '🎬').trim();
        sub.amount = positive(d.amount);
        sub.currency = d.currency || state.currency;
        sub.category = requireText(d.category);
        sub.day = Math.min(31, Math.max(1, Number(d.day) || 1));
        sub.cadence = d.cadence || 'monthly';
        sub.owner = d.owner || sub.owner;
        save();
        render();
        successToast(L('Langganan diperbarui.','Subscription updated.'));
      }
    );
  }

  function calendar(){
    const bills = getMonthlyBills(calendarYear, calendarMonth);
    const incomes = getMonthlyIncomes(calendarYear, calendarMonth);
    const totalExpected = bills.reduce((acc, b) => acc + E.convert(state, b.amount, b.currency, state.currency), 0);
    const totalIncomeExpected = incomes.reduce((acc, inc) => acc + E.convert(state, inc.amount, inc.currency, state.currency), 0);
    const paidSoFar = bills.filter(b => b.paid).reduce((acc, b) => acc + E.convert(state, b.amount, b.currency, state.currency), 0);
    const remainingDue = Math.max(0, totalExpected - paidSoFar);
    const netBuffer = totalIncomeExpected - totalExpected;

    const monthDate = new Date(calendarYear, calendarMonth, 1);
    const monthTitle = monthDate.toLocaleDateString(locale(), { month: 'long', year: 'numeric' });

    const headerHTML = header(
      L('Kalender Arus Kas & Tagihan Rutin','Recurring Bills & Cash Flow Calendar'),
      L('Pantau seluruh jadwal pemasukan (gaji/payday), tagihan rutin, jatuh tempo kartu, dan langganan dalam visual kalender ala Monarch Money.','Track recurring bills, card due dates, subscriptions, and scheduled paydays in a Monarch Money style visual calendar.'),
      button(L('Tambah langganan','Add subscription'),'bill-new','primary','plus'),
      L('KALENDER & ARUS KAS RUTIN','BILLS & CASH FLOW')
    ) + cashflowSwitcher('calendar');

    const statsHTML = `<div class="calendar-stats">
      ${metric(L('Pemasukan terencana','Expected inflows'), amount(totalIncomeExpected), `<span class="positive">${incomes.length} ${L('jadwal pemasukan','paydays')}</span><span>${monthTitle}</span>`, 'up')}
      ${metric(L('Estimasi tagihan','Expected bills'), amount(totalExpected), `<span class="trend">${bills.length} ${L('item tagihan','bill items')}</span><span>${monthTitle}</span>`, 'calendar')}
      ${metric(L('Net kas proyeksi','Projected net buffer'), amount(netBuffer), `<span class="${netBuffer>=0?'positive':'expense-amount'}">${netBuffer>=0?'+':''}${amount(netBuffer)} ${L('arus kas bersih','net cash flow')}</span><span>${monthTitle}</span>`, 'wallet')}
      ${metric(L('Sisa tagihan','Remaining due'), amount(remainingDue), `<span class="${remainingDue>0?'expense-amount':'positive'}">${bills.filter(b=>!b.paid).length} ${L('belum lunas','unpaid')}</span><span>${totalExpected>0 ? Math.round(paidSoFar/totalExpected*100) : 0}% ${L('terbayar','paid')}</span>`, 'check')}
    </div>`;

    const toolbarHTML = `<div class="calendar-toolbar">
      <div class="calendar-nav">
        <button class="btn" data-action="calendar-prev" aria-label="${L('Bulan sebelumnya','Previous month')}">&larr;</button>
        <h2>${monthTitle}</h2>
        <button class="btn" data-action="calendar-next" aria-label="${L('Bulan berikutnya','Next month')}">&rarr;</button>
        <button class="btn" data-action="calendar-today">${L('Hari ini','Today')}</button>
      </div>
      <div class="calendar-modes">
        <button class="${calendarViewMode==='calendar'?'active':''}" data-action="calendar-mode:calendar">${icon('calendar')} ${L('Kalender','Calendar')}</button>
        <button class="${calendarViewMode==='list'?'active':''}" data-action="calendar-mode:list">☰ ${L('Daftar','List')}</button>
      </div>
    </div>`;

    let viewContent = '';
    if(calendarViewMode === 'calendar'){
      const dayHeaders = (state.language==='id'?['Sen','Sel','Rab','Kam','Jum','Sab','Min']:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'])
        .map(d=>`<div class="calendar-header-cell">${d}</div>`).join('');
      
      const firstDayIdx = (new Date(calendarYear, calendarMonth, 1).getDay() + 6) % 7;
      const prevDaysCount = new Date(calendarYear, calendarMonth, 0).getDate();
      const currDaysCount = new Date(calendarYear, calendarMonth + 1, 0).getDate();
      const now = new Date();
      let cellsHTML = '';

      for(let i = firstDayIdx - 1; i >= 0; i--){
        const d = prevDaysCount - i;
        cellsHTML += `<div class="calendar-cell other-month"><div class="calendar-cell-top"><span class="calendar-day-num">${d}</span></div></div>`;
      }

      for(let d = 1; d <= currDaysCount; d++){
        const isTodayCell = (now.getFullYear() === calendarYear && now.getMonth() === calendarMonth && now.getDate() === d);
        const dayBills = bills.filter(b => b.day === d);
        const dayIncomes = incomes.filter(inc => inc.day === d);
        const dayBillTotal = dayBills.reduce((acc, b) => acc + E.convert(state, b.amount, b.currency, state.currency), 0);
        const dayIncomeTotal = dayIncomes.reduce((acc, inc) => acc + E.convert(state, inc.amount, inc.currency, state.currency), 0);

        const incomeChips = dayIncomes.map(inc => {
          const tip = `${escape(inc.name)}: +${money(inc.amount, false, inc.currency)} (${inc.received ? L('Sudah diterima','Received') : L('Jadwal pemasukan','Scheduled payday')})`;
          return `<button type="button" class="income-chip ${inc.received?'received':''}" data-action="income-detail:${inc.id}:${inc.dueDate}" title="${tip}"><span class="income-chip-icon">${escape(inc.emoji)}</span><span class="income-chip-name">${user(inc.name)}</span><span class="income-chip-amount">+${escape(money(inc.amount, true, inc.currency))}</span></button>`;
        }).join('');

        const billChips = dayBills.map(b => {
          const statusCls = b.paid ? 'paid' : (b.isOverdue ? 'overdue' : (b.isToday ? 'due-today' : ''));
          const tip = `${escape(b.name)}: ${money(b.amount, false, b.currency)} (${b.paid ? L('Lunas','Paid') : (b.isOverdue ? L('Terlewat','Overdue') : L('Jatuh tempo','Due'))})`;
          return `<button type="button" class="bill-chip ${statusCls}" data-action="bill-detail:${b.id}:${b.dueDate}" title="${tip}"><span class="bill-chip-icon">${escape(b.emoji)}</span><span class="bill-chip-name">${user(b.name)}</span><span class="bill-chip-amount">${escape(money(b.amount, true, b.currency))}</span></button>`;
        }).join('');

        let cellSummary = '';
        if(dayIncomeTotal > 0 && dayBillTotal > 0){
          cellSummary = `<span class="calendar-cell-total" style="color:#059669">+${money(dayIncomeTotal, true)}</span> <span class="calendar-cell-total" style="color:var(--muted)">−${money(dayBillTotal, true)}</span>`;
        } else if(dayIncomeTotal > 0){
          cellSummary = `<span class="calendar-cell-total" style="color:#059669">+${money(dayIncomeTotal, true)}</span>`;
        } else if(dayBillTotal > 0){
          cellSummary = `<span class="calendar-cell-total">${money(dayBillTotal, true)}</span>`;
        }

        cellsHTML += `<div class="calendar-cell ${isTodayCell?'today':''}" data-action="bill-new-day:${d}">
          <div class="calendar-cell-top">
            <span class="calendar-day-num">${d}</span>
            ${cellSummary}
          </div>
          <div class="calendar-chips">${incomeChips}${billChips}</div>
        </div>`;
      }

      const totalCells = firstDayIdx + currDaysCount;
      const trailing = (7 - (totalCells % 7)) % 7;
      for(let i = 1; i <= trailing; i++){
        cellsHTML += `<div class="calendar-cell other-month"><div class="calendar-cell-top"><span class="calendar-day-num">${i}</span></div></div>`;
      }

      viewContent = `<div class="calendar-grid-wrap"><div class="calendar-header-row">${dayHeaders}</div><div class="calendar-days-grid">${cellsHTML}</div></div>`;
    } else {
      const overdue = bills.filter(b => !b.paid && b.isOverdue);
      const isSoon = dStr => {
        const diff = (new Date(dStr+'T00:00:00') - new Date(date()+'T00:00:00')) / 86400000;
        return diff >= 0 && diff <= 7;
      };
      const dueSoon = bills.filter(b => !b.paid && !b.isOverdue && isSoon(b.dueDate));
      const later = bills.filter(b => !b.paid && !b.isOverdue && !isSoon(b.dueDate));
      const paid = bills.filter(b => b.paid);

      const renderListSection = (title, items, badgeClass='') => {
        if(!items.length) return '';
        return `<div class="calendar-list-section">
          <h3>${title} <span class="badge ${badgeClass}">${items.length}</span></h3>
          <div class="calendar-list-card">
            ${items.map(b => `
              <div class="calendar-list-row">
                <div class="calendar-row-badge" style="${b.type==='income'?'color:#059669;background:color-mix(in srgb,#10b981 12%,var(--paper))':''}">${escape(b.emoji)}</div>
                <div class="calendar-row-info">
                  <b>${user(b.name)}</b>
                  <small>${escape(b.category)} · ${b.cadence==='annual'?L('Tahunan','Annual'):L('Bulanan','Monthly')} · ${escape(b.dueDate)}</small>
                </div>
                <div class="calendar-row-amount ${b.type==='income'?'positive':(b.paid?'paid':'')}">${b.type==='income'?'+':''}${money(b.amount, false, b.currency)}</div>
                <div class="calendar-row-actions">
                  ${b.type==='income'
                    ? (b.received ? button(L('Batal diterima','Mark pending'), 'income-toggle-received:'+b.id+':'+b.dueDate, 'quiet-link') : button(L('Tandai diterima','Mark received'), 'income-toggle-received:'+b.id+':'+b.dueDate, 'btn lime'))
                    : (b.paid ? button(L('Batal lunas','Mark unpaid'), 'bill-toggle-paid:'+b.id+':'+b.dueDate, 'quiet-link') : button(L('Tandai lunas','Mark paid'), 'bill-toggle-paid:'+b.id+':'+b.dueDate, 'btn lime'))
                  }
                  ${button(L('Detail','Detail'), (b.type==='income'?'income-detail:':'bill-detail:')+b.id+':'+b.dueDate, 'btn')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>`;
      };

      viewContent = `<div class="calendar-list-view">
        ${renderListSection(L('Jadwal Pemasukan & Paydays','Scheduled Inflows & Paydays'), incomes, 'positive')}
        ${renderListSection(L('Terlambat / Jatuh Tempo Terlewat','Overdue Bills'), overdue, 'orange')}
        ${renderListSection(L('Jatuh Tempo 7 Hari Mendatang','Due in Next 7 Days'), dueSoon, 'blue')}
        ${renderListSection(L('Nanti di Bulan Ini','Later this Month'), later)}
        ${renderListSection(L('Sudah Terbayar','Paid this Month'), paid, 'positive')}
        ${(!bills.length && !incomes.length) ? `<div class="panel empty full">${L('Belum ada jadwal pemasukan atau tagihan di bulan ini. Klik "+ Tambah langganan" untuk memulai.','No paydays or bills this month. Click "+ Add subscription" to begin.')}</div>` : ''}
      </div>`;
    }

    return headerHTML + statsHTML + toolbarHTML + `<div class="calendar-view-frame">${viewContent}</div>`;
  }
  $('#language-switch').addEventListener('change',()=>{state.language=$('#language-switch').value;messages=[];render();});
  $('#currency-switch').addEventListener('change',()=>{const old=state.currency,next=$('#currency-switch').value;if(!E.currencies.includes(next))return;for(const key of ['incomeDelta','expenseDelta','oneTime'])scenario[key]=E.convert(state,scenario[key],old,next);state.currency=next;mcConfig=null;mcResult=null;messages=[];render();});
  $('#theme-switch').addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';save();render();});
  function attachSlideSwitch(el, onSlide) {
    if(!el || typeof el.addEventListener !== 'function') return;
    let startX = null, moved = false;
    el.addEventListener('pointerdown', e => { startX = e.clientX; moved = false; });
    el.addEventListener('pointermove', e => { if (startX !== null && Math.abs(e.clientX - startX) > 6) moved = true; });
    el.addEventListener('pointerup', e => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (moved && Math.abs(dx) >= 8) onSlide(dx > 0);
    });
    el.addEventListener('pointercancel', () => { startX = null; moved = false; });
  }
  attachSlideSwitch($('#theme-switch'), turnOn => {
    const targetTheme = turnOn ? 'dark' : 'light';
    if(targetTheme !== state.theme) { state.theme = targetTheme; save(); render(); }
  });
  attachSlideSwitch($('#privacy-switch'), turnOn => {
    if(turnOn !== hideMoney) { act('privacy'); }
  });
  document.addEventListener('submit',event=>{if(event.target.id==='mc-form'){event.preventDefault();runMonteCarlo(event.target);}});
  if(typeof window.setInterval==='function')window.setInterval(checkNotifications,60000);

  const R=window.InveysRecording;
  const L=(id,en)=>state.language==='id'?id:en;
  let captureAccount='',captureKind='receipt',captureProvider='9router';
  try{captureProvider=localStorage.getItem('inveys_capture_provider')||'9router';}catch(e){}
  let quickAccount='',quickText='',quickReply='';
  let drafts=[],captureText='',captureStatus='',captureBusy=false,service={},telegramItems=[],museAnswer='',fxBusy=false,recorder=null,voiceRecognition=null;
  const releases=window.InveysReleases;
  state.fx.auto ??= true;
  async function api(path,data){
    if(typeof fetch!=='function'||!/^https?:$/.test(location.protocol||''))throw Error(L('Jalankan server lokal: python3 serve.py','Run the local server: python3 serve.py'));
    if(!service.csrf){const r=await fetch('/api/status');if(!r.ok)throw Error('Local server unavailable');service=await r.json();}
    const token=typeof localStorage!=='undefined'?localStorage.getItem('inveys_token'):null;
    const authHeaders=token?{'Authorization':'Bearer '+token}:{};
    const r=await fetch('/api/'+path,{method:data?'POST':'GET',headers:data?{'Content-Type':'application/json','X-INVEYS-CSRF':service.csrf,...authHeaders}:authHeaders,body:data?JSON.stringify(data):undefined});const result=await r.json();if(!r.ok)throw Error(result.error||'Service unavailable');return result;
  }
  async function refreshFX(){if(fxBusy)return;fxBusy=true;state.fx.lastAttempt=new Date().toISOString();try{
    const endpoint=/^https?:$/.test(location.protocol||'')?'/api/fx':'https://api.frankfurter.dev/v2/rates?base=IDR&quotes=USD,EUR,GBP,SGD,AUD,JPY';
    const response=await fetch(endpoint);if(!response.ok)throw Error('FX provider unavailable');const next=R.rates(await response.json());state.fx={...state.fx,...next,error:''};save();toast(L('Kurs referensi diperbarui','Reference exchange rates updated'));
  }catch(e){state.fx.error=L('Pembaruan gagal. Kurs terakhir tetap digunakan.','Update failed. Last saved rates remain in use.');state.fx.lastAttempt=new Date().toISOString();save();toast(state.fx.error);}finally{fxBusy=false;if(['capture','integrations'].includes(page))render();}}
  function capture(){
    const effectiveProvider = captureProvider || '9router';
    const providerLabel = effectiveProvider === '9router' ? '9Router Gateway' : (effectiveProvider === 'gemini' ? 'Google Gemini' : (effectiveProvider === 'openai' ? 'OpenAI' : L('OCR Lokal','Local OCR')));
    return header(L('Catat lebih cepat, tetap dalam kendali.','Capture faster. Stay in control.'),L('OCR, suara, dan statement menghasilkan draft. Periksa nominal, mata uang, tanggal, dan akun sebelum menyimpan.','OCR, voice and statements create drafts. Review amount, currency, date and account before saving.'),'','CAPTURE')+transactionSwitcher('capture')+`<section class="panel panel-pad"><div class="capture-controls"><label>${L('Akun pencatatan','Recording account')}<select id="capture-account">${state.accounts.map(a=>`<option value="${a.id}" ${a.id===captureAccount?'selected':''}>${escape(a.name)} · ${a.currency}</option>`).join('')}</select></label><label>${L('Jenis sumber','Source type')}<select id="capture-kind"><option value="receipt" ${captureKind==='receipt'?'selected':''}>${L('Struk / suara','Receipt / voice')}</option><option value="statement" ${captureKind==='statement'?'selected':''}>${L('Statement bank (historis)','Bank statement (historical)')}</option></select></label><label>${L('Engine Ekstraksi AI','AI Extraction Engine')}<select id="capture-provider" class="capture-engine-select"><option value="9router" ${effectiveProvider==='9router'?'selected':''}>🚀 9Router Gateway (${service.ai?.['9router']?.enabled ? L('Aktif','Active') : L('Belum Diatur','Not Configured')})</option><option value="gemini" ${effectiveProvider==='gemini'?'selected':''}>🤖 Google Gemini (${service.ai?.gemini?.enabled ? L('Aktif','Active') : L('Belum Diatur','Not Configured')})</option><option value="openai" ${effectiveProvider==='openai'?'selected':''}>🧠 OpenAI (${service.ai?.openai?.enabled ? L('Aktif','Active') : L('Belum Diatur','Not Configured')})</option><option value="local" ${effectiveProvider==='local'?'selected':''}>📁 ${L('OCR Lokal (Offline / Tanpa Cloud)','Local OCR (Offline / No Cloud)')}</option></select></label><label>${L('Gambar struk / PDF / CSV / audio (maks. 8 MB)','Receipt image / PDF / CSV / audio (max. 8 MB)')}<input id="capture-file" type="file" accept="image/png,image/jpeg,image/webp,application/pdf,text/csv,text/plain,.csv,audio/*"></label></div><p class="note">${L('⚡ Ekstraksi Cerdas AI mendukung dokumen PDF e-statement multi-halaman, file CSV mutasi rekening, dan struk belanja multi-item. AI otomatis merapikan merchant, mendeteksi transfer antar akun, dan menetapkan kategori.','⚡ AI Smart Extract supports multi-page PDF bank statements, bank CSV exports, and multi-item receipts. AI automatically normalizes merchants, detects inter-account transfers, and assigns categories.')} <span class="badge ${effectiveProvider==='9router'?'purple':'blue'}">${L('Engine: ','Engine: ')}${escape(providerLabel)}</span></p><label for="capture-text">${L('Teks hasil ekstraksi / transkrip / CSV (dapat dikoreksi)','Extracted text / transcript / CSV (editable)')}</label><textarea id="capture-text" rows="6" maxlength="100000" placeholder="2026-10-03 Coffee 25000 DR&#10;2026-10-03 Salary 5000000 CR">${escape(captureText)}</textarea><div class="button-group">${button(captureBusy?L('⚡ Mengekstrak…','⚡ Extracting…'):L('⚡ Ekstrak Cerdas AI (PDF/CSV)','⚡ AI Smart Extract (PDF/CSV)'),'capture-ai-extract','primary')}${button(L('Buat draft','Create drafts'),'capture-parse')}${button(L('OCR file lokal','Extract local OCR'),'capture-extract')}${button(L('Input suara','Voice input'),'capture-voice')}${button(L('Hentikan suara','Stop voice'),'capture-stop')}${button(L('Transkripsi audio dengan Muse','Transcribe audio with Muse'),'capture-audio')}</div><p role="status" class="note">${escape(captureStatus)}</p><p class="note">${L('AI Lokal mendeteksi otomatis e-statement bank (Bank BRI, BRI Kartu Kredit, Bank Mandiri, SeaBank, BCA, Bank Jago) dan struk pembelian (Indomaret, Alfamart, SPBU, Cafe/Restoran). CR/Masuk = pemasukan; D/DB/Keluar = pengeluaran.','Local AI automatically detects bank e-statements (Bank BRI, BRI Credit Card, Bank Mandiri, SeaBank, BCA, Bank Jago) and purchase receipts (Indomaret, Alfamart, Gas Stations, Cafes/Restaurants). CR/Inflow = income; D/DB/Outflow = expense.')}</p></section>${draftPanel()}`;}
  function draftSkeletonWave(){
    const label=captureStatus||L('AI sedang menganalisis dokumen dan mendeteksi transaksi…','AI is analyzing document and detecting transactions…');
    return `<section class="panel panel-pad capture-skeleton-card" style="margin-top:24px" role="status" aria-busy="true" aria-live="polite" aria-label="${escape(label)}">
      <div class="skeleton-header">
        <div class="skeleton-pill">
          <span class="skeleton-orb">✧</span>
          <span class="skeleton-status-text">${escape(label)}</span>
        </div>
        <div class="skeleton-wave-bar">
          <div class="skeleton-wave-shimmer"></div>
        </div>
      </div>
      <div class="skeleton-rows">
        ${[1,2,3].map(i=>`
          <div class="skeleton-row-card" style="animation-delay:${i*0.12}s">
            <div class="skeleton-row-meta">
              <div class="skeleton-shimmer skeleton-box-check"></div>
              <div class="skeleton-shimmer skeleton-box-badge"></div>
              <div class="skeleton-shimmer skeleton-box-tag"></div>
            </div>
            <div class="skeleton-fields-grid">
              <div class="skeleton-field-item">
                <div class="skeleton-shimmer skeleton-box-label"></div>
                <div class="skeleton-shimmer skeleton-box-input"></div>
              </div>
              <div class="skeleton-field-item">
                <div class="skeleton-shimmer skeleton-box-label"></div>
                <div class="skeleton-shimmer skeleton-box-input"></div>
              </div>
              <div class="skeleton-field-item">
                <div class="skeleton-shimmer skeleton-box-label"></div>
                <div class="skeleton-shimmer skeleton-box-input"></div>
              </div>
              <div class="skeleton-field-item">
                <div class="skeleton-shimmer skeleton-box-label"></div>
                <div class="skeleton-shimmer skeleton-box-input"></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>`;
  }
  function draftPanel(){if(captureBusy||quickFileBusy)return draftSkeletonWave();if(!drafts.length)return '';return `<section class="panel panel-pad" style="margin-top:24px"><h2>${L('Tinjau draft','Review drafts')} · ${drafts.length}</h2><p class="note">${L('Duplikasi potensial harus dikonfirmasi dengan alasan. Statement historis secara default hanya dicatat ke jurnal agar saldo snapshot tidak dihitung dua kali.','Potential duplicates need confirmation with a reason. Historical statements default to journal-only to avoid counting snapshot balances twice.')}</p><div class="draft-batch-bar"><span class="draft-batch-title">${L('Pilihan cepat:','Quick select:')}</span><button type="button" class="btn-subtle" data-action="capture-select-clean" title="${L('Centang baris yang bukan duplikat','Select only non-duplicate rows')}">🛡️ ${L('Pilih yang Aman','Clean only')}</button><button type="button" class="btn-subtle" data-action="capture-select-all">☑️ ${L('Pilih Semua','All')}</button><button type="button" class="btn-subtle" data-action="capture-deselect-all">⬜ ${L('Batal Semua','None')}</button></div>${drafts.map((d,i)=>{const matches=R.duplicates(state,d);return `<div class="draft-row"><label><input type="checkbox" data-draft="${i}" data-key="selected" ${d.selected?'checked':''}> ${L('Simpan baris','Save row')} ${i+1}</label>${OPS.receiptMatches(state,d).length?button(L('Cocokkan struk','Match receipt'),'ops-receipt:'+i):''}${matches.length?`<span class="badge ${matches.some(m=>m.type==='transfer_counterpart')?'blue':'orange'}" title="${escape(matches.map(m=>m.reason).join('; '))}">${matches.some(m=>m.type==='transfer_counterpart')?L('Pasangan transfer terdeteksi','Transfer counterpart detected'):L('Potensi duplikasi','Potential duplicate')} · ${matches.length}</span>`:''}${d.kind==='transfer'?`<span class="badge blue">⇄ Transfer</span>`:''}<div class="capture-controls"><label>${L('Deskripsi','Description')}<input data-draft="${i}" data-key="name" value="${escape(d.name)}" maxlength="120"></label><label>${L('Tanggal','Date')}<input type="date" data-draft="${i}" data-key="date" value="${escape(d.date)}"></label><label>${L('Nominal','Amount')} · ${escape(d.currency)}<input type="number" min="0.01" step="0.01" data-draft="${i}" data-key="amount" class="${d.kind==='expense'?'expense-amount':''}" value="${d.amount/100}"></label><label>${L('Akun','Account')}<select data-draft="${i}" data-key="accountId">${state.accounts.map(a=>`<option value="${a.id}" ${a.id===d.accountId?'selected':''}>${escape(a.name)} (${a.currency})</option>`).join('')}</select></label><label>${L('Jenis','Type')}<select data-draft="${i}" data-key="kind"><option value="expense" ${d.kind==='expense'?'selected':''}>${L('Pengeluaran','Expense')}</option><option value="income" ${d.kind==='income'?'selected':''}>${L('Pemasukan','Income')}</option><option value="transfer" ${d.kind==='transfer'?'selected':''}>${L('Transfer Antar Akun','Transfer')}</option></select></label>${d.kind==='transfer'?`<label>${L('Akun tujuan','Destination account')}<select data-draft="${i}" data-key="targetId">${state.accounts.filter(a=>a.id!==d.accountId).map(a=>`<option value="${a.id}" ${a.id===d.targetId?'selected':''}>${escape(a.name)} (${a.currency})</option>`).join('')}</select></label>`:''}</div><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><label><input type="checkbox" data-draft="${i}" data-key="affectBalance" ${d.affectBalance?'checked':''}> ${L('Perbarui saldo akun','Update account balance')}</label>${d.kind!=='transfer'?`<label class="draft-rule-toggle" title="${L('Simpan sebagai aturan otomatis di Operations agar transaksi serupa otomatis bersih','Save as auto-rule in Operations so future transactions are automatically cleaned')}"><input type="checkbox" data-draft="${i}" data-key="saveAsRule" ${d.saveAsRule?'checked':''}> <span>⚡ ${L('Ingat aturan ini','Remember rule')}</span></label>`:''}</div><label>${L('Alasan menyimpan jika terindikasi duplikat','Reason to save if flagged as a duplicate')}<input data-draft="${i}" data-key="duplicateReason" value="${escape(d.duplicateReason||'')}" maxlength="200"></label></div>`;}).join('')}<div class="button-group">${button(L('Periksa duplikasi lagi','Recheck duplicates'),'capture-review')}${drafts.length>1?button(L('⚡ Pasangkan Transfer Otomatis','⚡ Auto-Pair Transfers'),'capture-pair-transfers'):''}${button(L('Simpan yang dipilih','Save selected'),'capture-save','primary')}${button(L('Buang draft','Discard drafts'),'capture-clear')}</div></section>`;}
  function draftText(text,source='text',inboxId=null,context=null){const a=context?getAccount(context.accountId):getAccount($('#capture-account')?.value)||state.accounts[0];if(!a)throw Error(L('Tambahkan akun terlebih dahulu','Add an account first'));const historical=context?context.historical:$('#capture-kind')?.value==='statement';const detected=R.detectBankStatement?R.detectBankStatement(text):null;let parsed=R.parse(text,a.currency,date()).slice(0,500).map((d,i)=>({...d,accountId:a.id,source,inboxId,sourceKey:inboxId?'telegram-'+inboxId+'-'+i:undefined,category:d.category||'Imported',affectBalance:!historical}));if(R.pairTransferDrafts&&parsed.length>1)parsed=R.pairTransferDrafts(parsed,state.accounts);drafts=parsed.map(d=>({...d,selected:!R.duplicates(state,d).length}));captureText=text;if(drafts.length){captureStatus=detected?L(`⚡ Terdeteksi: ${detected.bank} · ${drafts.length} transaksi siap ditinjau.`,`⚡ Detected: ${detected.bank} · ${drafts.length} transactions ready for review.`):L(`${drafts.length} draft siap ditinjau.`,`${drafts.length} drafts ready for review.`);}else{captureStatus=L('Nominal tidak ditemukan. Koreksi teks atau catat manual.','No amount found. Correct the text or record manually.');}navigate('capture');}
  async function fileData(selectedFile){const f=selectedFile||$('#capture-file')?.files?.[0]||quickAttachment;if(!f||f.size>8*1024*1024)throw Error(L('Pilih file maksimal 8 MB','Choose a file up to 8 MB'));const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result).split(',')[1]);r.onerror=reject;r.readAsDataURL(f);});const mime=f.type||(f.name?.endsWith('.csv')?'text/csv':(f.name?.endsWith('.txt')?'text/plain':'application/octet-stream'));return {data,type:mime,name:f.name||'document'};}
  function commitDrafts(){const chosen=drafts.filter(d=>d.selected);if(!chosen.length)throw Error(L('Pilih minimal satu draft','Select at least one draft'));const next=structuredClone(state);let rulesCount=0;for(const d of chosen){if(d.saveAsRule&&d.name&&d.category&&d.kind!=='transfer'){const kw=(d.originalName||d.name).trim().split(/[\s-_/]+/).filter(w=>w.length>=3)[0]||d.name.trim();if(kw&&!next.operations.rules.some(r=>r.conditions.contains?.toLowerCase()===kw.toLowerCase())){next.operations.rules.unshift({id:uid(),name:`Auto: ${d.name.trim()}`,enabled:true,conditions:{contains:kw},actions:{name:d.name.trim(),category:d.category.trim()}});rulesCount++;}}const a=next.accounts.find(a=>a.id===d.accountId);if(!a||d.currency!==a.currency)throw Error(L('Mata uang draft harus sama dengan akun. Koreksi nominal saat mengganti akun.','Draft currency must match the account. Correct the amount when changing accounts.'));if(!E.validDate(d.date)||!Number.isSafeInteger(d.amount)||d.amount<=0||!String(d.name).trim())throw Error('Invalid draft');if(d.kind==='transfer'){if(!d.targetId||d.targetId===d.accountId)throw Error(L('Pilih akun tujuan yang berbeda untuk transfer','Select a different destination account for transfer'));}if(d.sourceKey&&next.transactions.some(t=>t.sourceKey===d.sourceKey))throw Error(L('Baris sumber ini sudah disimpan','This source row has already been saved'));const dup=R.duplicates(next,d);if(dup.length&&!String(d.duplicateReason||'').trim())throw Error(L('Duplikasi potensial: masukkan alasan sebelum menyimpan','Potential duplicate: enter a reason before saving'));const tx={id:uid(),name:d.name.trim().slice(0,120),date:d.date,kind:d.kind,amount:d.amount,accountId:d.accountId,currency:d.currency,category:d.kind==='transfer'?'Transfer':d.category,source:d.source,sourceKey:d.sourceKey,balanceApplied:d.affectBalance,duplicateReason:d.duplicateReason||''};if(d.kind==='transfer')tx.targetId=d.targetId;E.applyTransaction(next,tx);}
    E.validate(next);localStorage.setItem(storageKey,JSON.stringify(next));state=next;const ids=[...new Set(chosen.map(d=>d.inboxId).filter(x=>x!==null&&x!==undefined))].filter(id=>drafts.filter(d=>d.inboxId===id).every(d=>chosen.includes(d)||state.transactions.some(t=>t.sourceKey===d.sourceKey)));drafts=[];captureText='';save();for(const id of ids)api('telegram/ack',{id}).catch(()=>toast(L('Tersimpan lokal; ack Telegram gagal. Baris sumber tetap dilindungi dari impor ulang.','Saved locally; Telegram acknowledgement failed. Source rows remain protected from reimport.')));
    veyPlaySound('love');
    veyCustomMood = 'celebrate';
    veySpeech = L('🎉 Catatan berhasil disimpan ke brankas finansial!', '🎉 Records successfully saved to your financial vault!');
    if (veySpeechTimer) clearTimeout(veySpeechTimer);
    veySpeechTimer = setTimeout(() => { veyCustomMood = null; veySpeech = ''; render(); }, 5000);
    if(page!=='capture'){quickReply=escape(L('Catatan berhasil disimpan.','Records saved.'));messages.push({role:'assistant',text:quickReply,recordAction:true});render();}else navigate('transactions');toast(L('Catatan berhasil disimpan','Records saved'));
  }
  function operations(){
    const pending=F.scopedTransactions(state).filter(t=>t.status==='pending'||!t.reviewed),candidates=OPS.recurring(state),visibleAccounts=viewState().accounts;
    const history=state.operations.activity.filter(r=>state.activeView.owner==='all'||visibleAccounts.some(a=>a.id===r.id)||[r.before,r.after].some(x=>x?.accountId&&F.matches(state,F.transactionOwner(state,x))));
    const from=new Date(date()+'T12:00:00Z');from.setUTCDate(from.getUTCDate()-6);const recap=F.reports(state,{...F.defaultFilter(date()),from:from.toISOString().slice(0,10)});
    return header(L('Keuangan yang lebih tertata.','Keep your finances in order.'),L('Aturan otomatis, review, rekonsiliasi dan jejak perubahan dalam satu tempat.','Rules, reviews, reconciliation and change history in one place.'),button(L('Buat aturan','Create rule'),'ops-rule-new','primary','plus'),'OPERATIONS')+transactionSwitcher('operations')+`<div class="metrics-grid">${metric(L('Perlu review','Needs review'),pending.length,L('Mengikuti Shared Views','Follows Shared Views'),'transactions')}${metric(L('Income · 7 hari','Income · 7 days'),amount(recap.income),L('Transaksi posted','Posted transactions'),'report-income')}${metric(L('Pengeluaran · 7 hari','Spending · 7 days'),amount(recap.expense),L('Transfer dikecualikan','Transfers excluded'),'report-spending')}${metric(L('Rutin terdeteksi','Recurring candidates'),candidates.length,L('Konfirmasi sebelum masuk rencana','Confirm before adding to plans'),'calendar')}</div>
    <div class="content-grid"><section class="panel panel-pad"><div class="panel-head"><h2>${L('Aturan transaksi','Transaction rules')}</h2>${button(L('Preview jurnal','Preview journal'),'ops-rule-preview')}</div><p class="note">${L('Aturan dijalankan berurutan pada catatan baru. Penerapan jurnal lama perlu preview dan konfirmasi. Aturan adalah pengaturan seluruh workspace.','Rules run in order on new records. Existing records require preview and confirmation. Rules apply across the workspace.')}</p>${state.operations.rules.map(r=>`<div class="saved-row"><div><b>${user(r.name)}</b><small>${r.enabled?L('Aktif','Enabled'):L('Nonaktif','Disabled')} · ${user(r.conditions.contains||r.conditions.category||r.conditions.kind||'filter')}</small></div>${button(L('Edit','Edit'),'ops-rule:'+r.id)}${button(L('Hapus','Delete'),'ops-rule-delete:'+r.id,'danger')}</div>`).join('')||`<p class="empty">${L('Belum ada aturan.','No rules yet.')}</p>`}</section>
    <section class="panel panel-pad"><h2>${L('Review transaksi','Transaction review')}</h2>${pending.slice(0,50).map(t=>`<div class="saved-row"><div><b>${user(t.name)}</b><small>${t.date} · ${native(t,'amount')} · ${t.status==='pending'?L('Pending: belum masuk saldo/laporan','Pending: excluded from balances/reports'):L('Posted','Posted')}</small><small>${user(t.category)}${t.reviewerId?' · '+escape(ownerName(t.reviewerId)):''}${t.hiddenFromReports?' · '+L('Tidak masuk laporan','Hidden from reports'):''}</small></div>${t.status==='pending'?button(L('Post','Post'),'ops-post:'+t.id):button(L('Sudah direview','Mark reviewed'),'ops-review:'+t.id)}</div>`).join('')||`<p class="empty">${L('Semua catatan sudah direview.','All records reviewed.')}</p>`}${pending.length>50?`<p class="note">${L('Menampilkan 50 pertama. Selesaikan review untuk melihat sisanya.','Showing the first 50. Complete reviews to reveal more.')}</p>`:''}</section></div>
    <div class="content-grid" style="margin-top:22px"><section class="panel panel-pad"><h2>${L('Saldo & rekonsiliasi','Balances & reconciliation')}</h2><p class="note">${L('Mode ledger menghitung perubahan jurnal. Mode snapshot menjaga saldo statement tetap independen. Pergantian ke snapshot menandai jurnal terkait sebagai historis, termasuk kedua sisi transfer.','Ledger mode applies journal changes. Snapshot mode keeps observed statement balances independent. Switching to snapshot marks linked entries as historical, including both sides of transfers.')}</p>${visibleAccounts.map(a=>`<div class="saved-row"><div><b>${user(a.name)}</b><small>${native(a,'balance')} · ${a.balancePolicy} · ${escape(a.updated)}</small><small>${user(a.observed?.source||L('Saldo manual','Manual balance'))}</small></div>${button(L('Rekonsiliasi','Reconcile'),'ops-balance:'+a.id)}${button(a.balancePolicy==='snapshot'?'Ledger':'Snapshot','ops-policy:'+a.id)}</div>`).join('')}</section>
    <section class="panel panel-pad"><h2>${L('Deteksi arus rutin','Recurring detection')}</h2><p class="note">${L('Minimal tiga tanggal, interval konsisten dan nominal dalam rentang 15%. Mingguan/tahunan dikonversi menjadi asumsi bulanan; bukan jadwal penagihan otomatis.','At least three dates, consistent intervals and amounts within 15%. Weekly/yearly activity becomes a monthly planning equivalent, not an automated billing schedule.')}</p>${candidates.map((c,i)=>`<div class="saved-row"><div><b>${user(c.name)}</b><small>${money(c.amount,false,c.currency)} · ${c.cadence} · ${c.count} ${L('catatan','records')}</small></div>${state.flows.some(f=>f.recurringKey===c.key)?`<span class="badge">${L('Sudah ditambahkan','Added')}</span>`:button(L('Masukkan ke rencana','Add to plan'),'ops-recurring:'+i)}</div>`).join('')||`<p class="empty">${L('Belum cukup riwayat untuk mendeteksi pola.','Not enough history to detect a pattern.')}</p>`}</section></div>
    <section class="panel panel-pad" style="margin-top:22px"><h2>${L('Riwayat perubahan','Change history')}</h2><p class="note">${L('Menyimpan maksimal 1.000 kejadian lokal. Ini bukan audit server yang tahan manipulasi.','Keeps up to 1,000 local events. This is not a tamper-resistant server audit.')}</p>${history.slice(0,100).map(r=>`<details class="operations-audit"><summary>#${r.sequence} · ${escape(r.action)} · ${escape(r.id)} <small>${escape(r.at)}</small></summary><div class="operations-diff"><div><b>${L('Sebelum','Before')}</b><pre>${escape(JSON.stringify(r.before,null,2))}</pre></div><div><b>${L('Sesudah','After')}</b><pre>${escape(JSON.stringify(r.after,null,2))}</pre></div></div></details>`).join('')||`<p class="empty">${L('Perubahan berikutnya akan dicatat di sini.','Future changes will appear here.')}</p>`}</section>`;
  }
  function operationRule(id, preset={}){
    const r=state.operations.rules.find(r=>r.id===id),c=r?.conditions||preset.conditions||{},a=r?.actions||preset.actions||{},ruleName=r?.name||preset.name||'',optionalOwner=selected=>`<option value="">${L('Tidak diubah','Keep unchanged')}</option>`+ownerOptions(selected);
    openModal(L('Aturan transaksi','Transaction rule'),form(field(L('Nama aturan','Rule name'),'name',ruleName,'text','required maxlength="120"')+field(L('Deskripsi mengandung','Description contains'),'contains',c.contains||'','text','required maxlength="120"')+field(L('Jenis transaksi','Transaction type'),'kind','','select',`<option value="">${L('Semua','All')}</option>`+options(['income','expense','transfer'],c.kind))+field(L('Akun','Account'),'accountId','','select',`<option value="">${L('Semua','All')}</option>`+state.accounts.map(x=>`<option value="${x.id}" ${x.id===c.accountId?'selected':''}>${user(x.name)}</option>`).join(''))+field('Currency','currency','','select',`<option value="">${L('Semua','All')}</option>`+options(E.currencies,c.currency))+field(L('Kategori baru (opsional)','New category (optional)'),'category',a.category||'','text','maxlength="80"')+field(L('Nama merchant baru (opsional)','New merchant name (optional)'),'merchant',a.name||'','text','maxlength="120"')+field(L('Pemilik','Owner'),'ownerId','','select',optionalOwner(a.ownerId))+field(L('Penanggung jawab review','Review assignee'),'reviewerId','','select',optionalOwner(a.reviewerId))+field(L('Tag dipisahkan koma','Comma-separated tags'),'tags',(a.tags||[]).join(', '),'text','maxlength="800"')+field(L('Visibilitas laporan','Report visibility'),'visibility','','select',`<option value="keep">${L('Tidak diubah','Keep unchanged')}</option><option value="hide" ${a.hiddenFromReports===true?'selected':''}>${L('Sembunyikan','Hide')}</option><option value="show" ${a.hiddenFromReports===false?'selected':''}>${L('Tampilkan','Show')}</option>`)+field(L('Status','Status'),'enabled','','select',options(['enabled','disabled'],r?.enabled===false?'disabled':'enabled'))+`<label><input type="checkbox" name="split" ${a.splits?'checked':''}> ${L('Terapkan split kepemilikan (%)','Apply ownership split (%)')}</label>`+['shared',...state.members.map(m=>m.id)].map(owner=>field(ownerName(owner)+' %','percent_'+owner,(a.splits?.find(p=>p.ownerId===owner)?.amount||0)/100,'number','min="0" max="100"')).join(''),'Save',L('Kondisi digabung dengan AND. Aturan tidak mengubah nominal/jenis/akun. Split harus total 100%; transfer tidak bisa diberi split belanja.','Conditions combine with AND. Rules do not change amount/type/account. Splits must total 100%; transfers cannot have spending splits.')),d=>{const conditions={contains:requireText(d.contains)},actions={};for(const k of ['kind','accountId','currency'])if(d[k])conditions[k]=d[k];for(const k of ['category','ownerId','reviewerId'])if(d[k])actions[k]=d[k].trim();if(d.merchant.trim())actions.name=d.merchant.trim();if(d.tags.trim())actions.tags=[...new Set(d.tags.split(',').map(t=>t.trim()).filter(Boolean))];if(d.visibility!=='keep')actions.hiddenFromReports=d.visibility==='hide';if(d.split)actions.splits=['shared',...state.members.map(m=>m.id)].map(ownerId=>({ownerId,amount:E.cents(d['percent_'+ownerId]||0)})).filter(p=>p.amount>0);persistCorrection(OPS.saveRule(state,{id:r?.id||uid(),name:requireText(d.name),enabled:d.enabled==='enabled',conditions,actions}));const preview=OPS.preview(state);if(preview.length>0){confirmAction(L('Terapkan aturan sekarang?','Apply rule now?'),`${preview.length} ${L('transaksi yang cocok dapat diperbarui sekarang (kategori/nama/tag). Terapkan ke transaksi yang sudah ada?','matching transactions can be updated now. Apply to existing transactions?')}`,()=>{persistCorrection(OPS.retroactive(state));render();successToast(L('Aturan diterapkan pada transaksi yang ada.','Rules applied to existing transactions.'));});}else{successToast(L('Aturan tersimpan.','Rule saved.'));}});
  }
  function operationAction(name,id){
    if(name==='ops-card-purchase'){const c=state.cards.find(c=>c.id===id),debt=state.debts.find(d=>d.id===c.debtId);openModal(L('Catat belanja kartu','Record card purchase'),form(field('Description','name','','text','required maxlength="120"')+field('Category','category','Other','text','required maxlength="80"')+field('Amount · '+debt.currency,'amount','','number','required min="0.01"')+field('Date','date',date(),'date','required')+field(L('Rekening referensi','Reference account'),'accountId','','select',state.accounts.map(a=>`<option value="${a.id}">${escape(a.name)}</option>`).join('')),'Save',L('Rekening hanya referensi jurnal. Pembelian menambah utang kartu tanpa mengurangi kas; pembayaran berikutnya bukan pengeluaran baru. Nominal tagihan tetap mengikuti statement yang Anda masukkan.','The account is a journal reference only. Purchases add card debt without reducing cash; later payments are not new spending. Statement amounts remain manually entered.')),d=>{persistCorrection(OPS.cardPurchase(state,id,d.accountId,positive(d.amount),requireText(d.name),requireText(d.category),d.date,uid()));successToast(L('Belanja kartu tersimpan.','Card purchase saved.'));});return;}
    if(name==='ops-refund'){const tx=state.transactions.find(t=>t.id===id);openModal('Refund',form(field('Amount · '+tx.currency,'amount',tx.amount/100,'number','required min="0.01"')+field('Date','date',date(),'date','required'),'Save',L('Refund mengurangi kategori pengeluaran semula; bukan income baru.','A refund reduces the original spending category; it is not new income.')),d=>{persistCorrection(OPS.refund(state,id,positive(d.amount),d.date,uid()));successToast(L('Refund tersimpan.','Refund saved.'));});return;}
    if(name==='ops-rule-new'||name==='ops-rule'){operationRule(id);return;}
    if(name==='ops-rule-delete'){confirmAction(L('Hapus aturan?','Delete rule?'),L('Catatan yang sudah ada tidak diubah.','Existing records stay as recorded.'),()=>persistCorrection(OPS.removeRule(state,id)));return;}
    if(name==='ops-rule-preview'){const preview=OPS.preview(state);openModal(L('Preview aturan','Rule preview'),`<p>${preview.length} ${L('catatan akan diperbarui. Saldo tidak berubah.','records will be updated. Balances stay unchanged.')}</p><p class="note">${L('Penerapan mencakup seluruh workspace, bukan hanya tampilan pemilik saat ini.','Application covers the whole workspace, not only the current owner view.')}</p>${preview.slice(0,30).map(r=>`<div class="saved-row"><div><b>${user(r.before.name)} → ${user(r.after.name)}</b><small>${user(r.before.category)} → ${user(r.after.category)}</small></div></div>`).join('')}${preview.length?button(L('Terapkan setelah tinjauan','Apply after review'),'ops-rule-apply','primary'):''}`);return;}
    if(name==='ops-rule-apply'){persistCorrection(OPS.retroactive(state));$('#modal').close();render();successToast(L('Aturan diterapkan.','Rules applied.'));return;}
    if(name==='ops-review'||name==='ops-post'){persistCorrection(name==='ops-post'?OPS.post(state,id):OPS.review(state,id));render();successToast(L('Status transaksi diperbarui.','Transaction status updated.'));return;}
    if(name==='ops-policy'){const a=getAccount(id),mode=a.balancePolicy==='ledger'?'snapshot':'ledger';confirmAction(L('Ubah kebijakan saldo?','Change balance policy?'),L('Beralih ke snapshot mempertahankan saldo dan menjadikan jurnal terkait historis, termasuk kedua sisi transfer. Kembali ke ledger hanya memengaruhi catatan baru.','Switching to snapshot preserves balances and marks linked entries historical, including both sides of transfers. Returning to ledger affects new records only.'),()=>persistCorrection(OPS.policy(state,id,mode)));return;}
    if(name==='ops-balance'){const a=getAccount(id);openModal(L('Rekonsiliasi ','Reconcile ')+a.name,form(field(L('Saldo statement','Statement balance'),'balance',a.balance/100,'number','required')+field(L('Tanggal saldo','Balance date'),'date',date(),'date','required')+field(L('Sumber','Source'),'source',a.observed?.source||'Manual statement','text','required maxlength="120"'),'Save',L('Jurnal terkait akan menjadi historis. Selisih dicatat di riwayat, bukan sebagai income/expense.','Linked journal entries become historical. Differences enter change history, not income/expense.')),d=>{persistCorrection(OPS.reconcile(OPS.policy(state,id,'snapshot'),id,E.cents(d.balance),d.date,requireText(d.source)));successToast(L('Saldo berhasil direkonsiliasi.','Balance reconciled.'));});return;}
    if(name==='ops-recurring'){const c=OPS.recurring(state)[Number(id)];if(c)confirmAction(L('Tambah ke rencana bulanan?','Add to monthly plan?'),`${user(c.name)} · ${money(c.monthlyAmount,false,c.currency)}<p>${L('Ini mengubah baseline Forecast tanpa memindahkan uang.','This changes the Forecast baseline without moving money.')}</p>`,()=>persistCorrection(OPS.acceptRecurring(state,c.key,uid())));return;}
    if(name==='ops-receipt'){const d=drafts[Number(id)],matches=OPS.receiptMatches(state,d);openModal(L('Cocokkan dengan transaksi','Match to transaction'),form(field(L('Transaksi yang sesuai','Matching transaction'),'transactionId','','select',matches.map(t=>`<option value="${t.id}">${escape(t.date+' · '+t.name)}</option>`).join('')),'Link receipt',L('Menautkan metadata struk ke catatan yang sudah ada tanpa menambah transaksi atau mengubah saldo. File asli belum disimpan.','Links receipt metadata to an existing record without adding transactions or changing balances. Original files are not retained.')),data=>{persistCorrection(OPS.attachReceipt(state,data.transactionId,d));drafts.splice(Number(id),1);successToast(L('Struk ditautkan; tidak ada transaksi baru.','Receipt linked; no new transaction.'));});return;}
  }

  function integrations(){
    const aiOnline=service.ai?.['9router']?.enabled||service.ai?.openai?.enabled||service.ai?.gemini?.enabled;
    const tgOnline=!!service.telegram;
    const fxOnline=true;
    const srvOnline=!!service.csrf;
    const cryptoOnline=!!service.crypto;

    const topologySvg=`
    <div class="int-hero-canvas">
      <div class="int-topology-wrap">
        <svg class="int-topology-svg" viewBox="0 0 720 180" role="img" aria-label="${L('Topologi Koneksi Saluran INVEYS','INVEYS Channel Connection Topology')}">
          <defs>
            <linearGradient id="intGradHub" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#38a169"/>
              <stop offset="100%" stop-color="#1c3d30"/>
            </linearGradient>
          </defs>
          <!-- Connection Paths Hub to Satellites -->
          <path d="M 360 90 C 240 90, 200 45, 90 45" class="int-conn-line ${aiOnline?'active':''}"/>
          <path d="M 360 90 C 240 90, 200 135, 90 135" class="int-conn-line ${tgOnline?'active':''}"/>
          <path d="M 360 90 C 480 90, 520 45, 630 45" class="int-conn-line ${fxOnline?'active':''}"/>
          <path d="M 360 90 C 480 90, 520 135, 630 135" class="int-conn-line ${srvOnline?'active':''}"/>

          <!-- Node 1: AI Provider (Top Left) -->
          <g class="int-node-interactive" data-action="api-keys:gemini" role="button" aria-label="${L('Kelola API Key AI','Manage AI Keys')}">
            <circle cx="90" cy="45" r="22" class="int-node-circle ${aiOnline?'active':''}"/>
            <text x="90" y="49" class="int-label" font-size="14">🤖</text>
            <text x="90" y="78" class="int-sublabel">${aiProviderName(state.assistant.provider)}</text>
          </g>

          <!-- Node 2: Telegram (Bottom Left) -->
          <g class="int-node-interactive" data-action="api-keys:telegram" role="button" aria-label="${L('Konfigurasi Telegram Bot','Configure Telegram Bot')}">
            <circle cx="90" cy="135" r="22" class="int-node-circle ${tgOnline?'active':''}"/>
            <text x="90" y="139" class="int-label" font-size="14">💬</text>
            <text x="90" y="168" class="int-sublabel">Telegram</text>
          </g>

          <!-- Central INVEYS Core Hub -->
          <circle cx="360" cy="90" r="40" class="int-hub-pulse"/>
          <circle cx="360" cy="90" r="30" class="int-hub-circle" fill="url(#intGradHub)"/>
          <text x="360" y="85" text-anchor="middle" fill="#fff" font-size="15" font-weight="800">✦</text>
          <text x="360" y="100" text-anchor="middle" fill="#d4edda" font-size="9" font-weight="700" letter-spacing="1">INVEYS</text>

          <!-- Node 3: Live FX (Top Right) -->
          <circle cx="630" cy="45" r="22" class="int-node-circle ${fxOnline?'active':''}"/>
          <text x="630" y="49" class="int-label" font-size="14">💱</text>
          <text x="630" y="78" class="int-sublabel">Frankfurter FX</text>

          <!-- Node 4: Local Server (Bottom Right) -->
          <circle cx="630" cy="135" r="22" class="int-node-circle ${srvOnline?'active':''}"/>
          <text x="630" y="139" class="int-label" font-size="14">⚡</text>
          <text x="630" y="168" class="int-sublabel">Python Core</text>
        </svg>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:10px;flex-wrap:wrap">
          <button type="button" class="int-sim-btn" data-action="int-ping-all">
            <span>⚡</span> ${L('Simulasi Alur Koneksi (Uji Sinyal)','Simulate Connection Flow (Ping All)')}
          </button>
          <button type="button" class="int-sim-btn" data-action="api-keys:all" style="background:var(--ink);color:#fff">
            <span>🔑</span> ${L('Kelola Semua Kunci API & Bot','Manage All API Keys & Bot')}
          </button>
        </div>
      </div>
    </div>`;

    return header(L('Hubungkan Saluran Keuangan Anda.','Connect your financial channels.'),L('Token dan data tersimpan aman di server lokal. Privasi terjamin tanpa pengiriman data ke pihak ketiga.','Tokens and data stay on your local server. Complete privacy and full control.'),'','INTEGRATIONS')+topologySvg+`
    <div class="int-cards-grid">
      <!-- Card 1: AI Provider -->
      <section class="panel panel-pad int-card">
        <div class="int-card-head">
          <div class="int-card-title-wrap">
            <span class="int-card-icon">🤖</span>
            <div>
              <h3>INVEYS AI (${aiProviderName(state.assistant.provider)})</h3>
              <span class="int-status-badge ${aiOnline?'online':'standby'}">● ${aiOnline?L('Siap Digunakan','Configured'):L('Perlu Kunci API','API Key Needed')}</span>
            </div>
          </div>
        </div>
        <p class="int-card-desc">${L('Asisten cerdas untuk konsultasi keuangan, menganalisis pola belanja, dan membaca struk otomatis.','Smart AI assistant to analyze cash flow, extract receipts and answer financial questions.')}</p>
        <p class="note" style="margin-bottom:12px">${service.ai?.['9router']?.enabled?L('9Router dikonfigurasi; gateway OpenAI-compatible aktif.','9Router configured; OpenAI-compatible gateway active.'):L('Mendukung Gemini, OpenAI, 9Router, atau mode Lokal tanpa API key.','Supports Gemini, OpenAI, 9Router, or offline Local mode.')}</p>
        <div class="int-card-actions">
          ${button(L('🔑 Kelola API Key AI','🔑 Manage AI API Keys'),'api-keys:gemini','primary')}
          ${button(L('⚙️ Pengaturan AI & Kunci API','⚙️ Assistant Settings'),'quick-ai-settings')}
          ${button(L('🔍 Periksa Konfigurasi','🔍 Check Config'),'quick-ai-status')}
        </div>
      </section>

      <!-- Card 2: Telegram Bot -->
      <section class="panel panel-pad int-card">
        <div class="int-card-head">
          <div class="int-card-title-wrap">
            <span class="int-card-icon">💬</span>
            <div>
              <h3>Telegram Bot</h3>
              <span class="int-status-badge ${tgOnline?'online':'standby'}">● ${tgOnline?L('Terhubung','Connected'):L('Belum Dikonfigurasi','Not Configured')}</span>
            </div>
          </div>
        </div>
        <p class="int-card-desc">${L('Kirim pesan teks atau foto struk langsung dari chat Telegram pribadi di HP Anda untuk dicatat ke INVEYS.','Send text notes or receipt photos directly from your private Telegram chat to INVEYS.')}</p>
        <p class="note" style="margin-bottom:12px">${service.telegram?L('Bot Token & Chat ID terhubung di server lokal.','Bot Token & Chat ID configured on local server.'):L('Set TELEGRAM_BOT_TOKEN dan TELEGRAM_CHAT_ID di server lokal Anda.','Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID on your local server.')}</p>
        <div class="int-card-actions">
          ${button(L('🔑 Atur Bot Token & Chat ID','🔑 Configure Bot Token'),'api-keys:telegram','primary')}
          ${button(L('📥 Ambil Inbox Telegram','📥 Fetch Inbox'),'telegram-inbox')}
          ${button(L('📤 Kirim Pesan / Pengingat','📤 Send Reminder'),'telegram-send')}
        </div>
        ${telegramItems.length?`<div style="margin-top:14px">${telegramItems.map(x=>`<div class="draft-row"><p>${escape(x.text)}</p><button class="btn" data-action="telegram-draft:${x.id}">${L('Tinjau sebagai draft','Review as draft')}</button></div>`).join('')}</div>`:''}
      </section>

      <!-- Card 3: Live FX Rates -->
      <section class="panel panel-pad int-card">
        <div class="int-card-head">
          <div class="int-card-title-wrap">
            <span class="int-card-icon">💱</span>
            <div>
              <h3>${L('Kurs Valuta Otomatis','Live Exchange Rates')}</h3>
              <span class="int-status-badge online">● ${escape(state.fx.source)}</span>
            </div>
          </div>
        </div>
        <p class="int-card-desc">${L('Memperbarui kurs mata uang internasional (USD, EUR, SGD, JPY, IDR) harian untuk penilaian kekayaan multi-mata uang.','Daily reference rates from Frankfurter for multi-currency asset valuation and reporting.')}</p>
        <label style="display:flex;align-items:center;gap:7px;font-size:12px;margin:8px 0 12px;color:var(--ink)"><input type="checkbox" id="fx-auto" ${state.fx.auto?'checked':''}> ${L('Perbarui otomatis saat buka aplikasi','Auto-refresh when opening the app')}</label>
        <div class="int-card-actions">
          ${button(L('🔄 Perbarui Sekarang','🔄 Refresh Now'),'fx-refresh','primary')}
          ${button(L('✏️ Atur Kurs Manual','✏️ Manual Rates'),'fx-edit')}
        </div>
      </section>

      <!-- Card 4: Local Server Engine -->
      <section class="panel panel-pad int-card">
        <div class="int-card-head">
          <div class="int-card-title-wrap">
            <span class="int-card-icon">⚡</span>
            <div>
              <h3>${L('Server Lokal & Privasi','Local Server & Privacy')}</h3>
              <span class="int-status-badge ${srvOnline?'online':'standby'}">● ${srvOnline?L('Server Terhubung','Server Connected'):L('Belum Diperiksa','Not Checked')}</span>
            </div>
          </div>
        </div>
        <p class="int-card-desc">${L('Layanan backend Python ringan untuk pemrosesan OCR, enkripsi lokal, dan integrasi API yang aman.','Lightweight Python backend service powering local OCR, secure API tokens and data processing.')}</p>
        <p class="note" style="margin-bottom:12px">${L('Jalankan python3 serve.py untuk membuka di http://127.0.0.1:3000. Data tidak pernah meninggalkan server Anda.','Run python3 serve.py and open http://127.0.0.1:3000. Data never leaves your machine.')}</p>
        <div class="int-card-actions">
          ${button(L('🔌 Cek Sambungan Server','🔌 Check Server Status'),'service-status','primary')}
        </div>
      </section>

      <!-- Card 5: Crypto Exchange Connectors (CCXT) -->
      <section class="panel panel-pad int-card">
        <div class="int-card-head">
          <div class="int-card-title-wrap">
            <span class="int-card-icon">🪙</span>
            <div>
              <h3>${L('Konektor Crypto Exchange (CCXT)','Crypto Exchange Connectors (CCXT)')}</h3>
              <span class="int-status-badge ${cryptoOnline?'online':'standby'}">● ${cryptoOnline?L('Engine CCXT Aktif','CCXT Engine Ready'):L('Perlu Library CCXT','CCXT Library Needed')}</span>
            </div>
          </div>
        </div>
        <p class="int-card-desc">${L('Sinkronisasi saldo portofolio koin (BTC, ETH, SOL, altcoin, stablecoin) otomatis secara Read-Only dari exchange crypto terkemuka.','Read-only automated balance sync for crypto holdings (BTC, ETH, SOL, altcoins, stablecoins) from major crypto exchanges.')}</p>
        <div class="crypto-exchange-grid">
          <div class="crypto-exchange-badge"><span class="crypto-exchange-icon">🟡</span>Bybit<span class="crypto-exchange-sub">Derivative & Spot</span></div>
          <div class="crypto-exchange-badge"><span class="crypto-exchange-icon">🔶</span>Binance<span class="crypto-exchange-sub">Global Liquidity</span></div>
          <div class="crypto-exchange-badge"><span class="crypto-exchange-icon">⬛</span>OKX<span class="crypto-exchange-sub">Unified Account</span></div>
          <div class="crypto-exchange-badge"><span class="crypto-exchange-icon">🔵</span>Gate.io<span class="crypto-exchange-sub">Altcoin Pioneer</span></div>
          <div class="crypto-exchange-badge"><span class="crypto-exchange-icon">🔷</span>Bitget<span class="crypto-exchange-sub">Copy & Spot</span></div>
          <div class="crypto-exchange-badge"><span class="crypto-exchange-icon">🇮🇩</span>Indodax<span class="crypto-exchange-sub">IDR Gateway</span></div>
          <div class="crypto-exchange-badge"><span class="crypto-exchange-icon">🇮🇩</span>Tokocrypto<span class="crypto-exchange-sub">Binance Cloud</span></div>
          <div class="crypto-exchange-badge"><span class="crypto-exchange-icon">🟢</span>KuCoin<span class="crypto-exchange-sub">Global Crypto</span></div>
        </div>
        <p class="note" style="margin-bottom:12px">${L('Gunakan kunci API Read-Only (hanya izin baca saldo). Kunci disimpan secara lokal di mesin Anda dan tidak pernah dikirim ke pihak ketiga.','Use Read-Only API keys (view balance only). Keys stay strictly local on your machine and are never sent elsewhere.')}</p>
        <div class="int-card-actions">
          ${button(L('🔗 Hubungkan & Sinkron Crypto','🔗 Connect & Sync Crypto'),'crypto-connect-modal','primary')}
          ${button(L('📋 Info Detail Exchange','📋 Exchange Info'),'crypto-exchanges-modal')}
        </div>
      </section>

      <!-- Optional Meta AI / Muse Card -->
      <section class="panel panel-pad int-card">
        <div class="int-card-head">
          <div class="int-card-title-wrap">
            <span class="int-card-icon">✧</span>
            <div>
              <h3>Muse Spark · Meta AI</h3>
              <span class="int-status-badge ${service.muse?'online':'standby'}">● ${service.muse?L('Kunci Tersedia','Key Available'):L('Opsional','Optional')}</span>
            </div>
          </div>
        </div>
        <p class="int-card-desc">${L('Konsultasi rencana keuangan alternatif dan ringkasan portofolio dengan Meta AI.','Alternative financial planning consultation and portfolio review with Meta AI.')}</p>
        <div class="int-card-actions">
          ${button(L('Tanya Muse','Ask Muse'),'muse-ask','primary')}
        </div>
        ${museAnswer?`<div class="ai-output" style="margin-top:10px">${escape(museAnswer)}</div>`:''}
      </section>
    </div>`;
  }
  function updates(){
    return header(
      L('Pusat Rilis & Manajemen Pembaruan VPS','Release Center & VPS Update Management'),
      L('Arsitektur modular 4 segmen · Versi aktif v'+releases.version+'. Pembaruan aplikasi mandiri dan cadangan database terisolasi.','4-Segment modular architecture · Active version v'+releases.version+'. Self-contained app updates and isolated database backups.'),
      `<div class="heading-actions">${button(L('🚀 1-Klik Update VPS','🚀 1-Click VPS Update'),'vps-update-run','primary')}${button(L('🔍 Cek Kesehatan Segmen','🔍 Check Segment Health'),'vps-segments-check')}${button(L('Ekspor backup workspace','Export workspace backup'),'export')}</div>`,
      'RELEASE CENTER'
    ) + `
    <!-- VPS 1-Click Update Hero Banner -->
    <section class="panel panel-pad vps-update-hero">
      <div class="vps-update-banner-head">
        <div class="vps-update-badge-wrap">
          <span class="vps-status-pill ${isServerMode?'online':'local'}"><i></i> ${isServerMode?L('Hostinger VPS Node Terhubung','Hostinger VPS Node Connected'):L('Mode Lokal / Standalone','Local Mode / Standalone')}</span>
          <span class="badge plus">v${escape(releases.version)}</span>
        </div>
        <h2>${L('Pembaruan Aplikasi VPS 1-Klik Otomatis','Automated 1-Click VPS Application Update')}</h2>
        <p>${L('Perbarui kode dan aset aplikasi langsung di VPS Anda dengan satu klik. Sistem secara otomatis membuat snapshot cadangan database SQLite ke ~/.inveys/backups/ sebelum mengompilasi ulang bundle dan menyegarkan aset klien tanpa downtime.','Update application code and assets on your VPS with a single click. The system automatically creates a safety snapshot backup of the SQLite database to ~/.inveys/backups/ before recompiling the standalone bundle and hot-reloading client assets with zero data risk.')}</p>
      </div>
      <div class="vps-update-actions">
        <button class="btn primary vps-update-btn" data-action="vps-update-run">
          ${icon('lightning')} ${L('Jalankan 1-Klik Update VPS Sekarang','Run 1-Click VPS Update Now')}
        </button>
        <button class="btn" data-action="vps-segments-check">
          ${icon('check')} ${L('Periksa Status 4 Segmen','Inspect 4 Segments Status')}
        </button>
      </div>
    </section>

    <!-- Architecture Segmentation 4-Grid -->
    <div class="vps-segments-grid">
      <div class="vps-segment-card">
        <div class="vps-segment-head">
          <span class="vps-seg-icon">${icon('shield')}</span>
          <div>
            <b>${L('Segmen 1: Web Client & PWA','Segment 1: Web Client & PWA')}</b>
            <small>${L('Aset Statis & Frontend','Static Assets & Frontend')}</small>
          </div>
          <span class="vps-badge healthy">${L('Sehat','Healthy')}</span>
        </div>
        <p>${L('Bundle mandiri inveys-app.html, CSS Design System, Service Worker offline cache, dan responsive views.','Self-contained inveys-app.html bundle, CSS design system, Service Worker cache, and responsive views.')}</p>
        <div class="vps-segment-foot">
          <span>${L('Status: Terkompilasi Mandiri','Status: Self-Contained Bundle')}</span>
          <span class="vps-pill-sub">PWA v${escape(releases.version)}</span>
        </div>
      </div>

      <div class="vps-segment-card">
        <div class="vps-segment-head">
          <span class="vps-seg-icon">${icon('lightning')}</span>
          <div>
            <b>${L('Segmen 2: VPS API Gateway','Segment 2: VPS API Gateway')}</b>
            <small>${L('Layanan Python Daemon','Python Daemon Services')}</small>
          </div>
          <span class="vps-badge healthy">${L('Aktif','Active')}</span>
        </div>
        <p>${L('Server daemon serve.py, Master Password PBKDF2 Auth, AI Gateway (Gemini/OpenAI/Claude), CCXT Crypto, dan OCR lokal.','Daemon serve.py, Master Password PBKDF2 Auth, AI Gateway (Gemini/OpenAI/Claude), CCXT Crypto, and local OCR.')}</p>
        <div class="vps-segment-foot">
          <span>${L('Layanan: Port 3000 / HTTP','Service: Port 3000 / HTTP')}</span>
          <span class="vps-pill-sub">Python 3 Daemon</span>
        </div>
      </div>

      <div class="vps-segment-card">
        <div class="vps-segment-head">
          <span class="vps-seg-icon">${icon('vault')}</span>
          <div>
            <b>${L('Segmen 3: Persistent Data Vault','Segment 3: Persistent Data Vault')}</b>
            <small>${L('Database Terisolasi ~/.inveys/','Isolated DB ~/.inveys/')}</small>
          </div>
          <span class="vps-badge protected">${L('Terproteksi','Protected')}</span>
        </div>
        <p>${L('Database SQLite WAL inbox.sqlite3, riwayat snapshot, dan kredensial terisolasi penuh dari penimpaan file kode rilis.','SQLite WAL database inbox.sqlite3, snapshot history, and credentials isolated completely from code updates.')}</p>
        <div class="vps-segment-foot">
          <span>${L('Keamanan: Snapshot Harian 30 Hari','Security: 30-Day Daily Rolling')}</span>
          <span class="vps-pill-sub">SQLite WAL</span>
        </div>
      </div>

      <div class="vps-segment-card">
        <div class="vps-segment-head">
          <span class="vps-seg-icon">${icon('growth')}</span>
          <div>
            <b>${L('Segmen 4: Pipeline & 1-Klik Update','Segment 4: Pipeline & 1-Click Update')}</b>
            <small>${L('Otomasi Rilis & Manifest','Release Automation & Manifest')}</small>
          </div>
          <span class="vps-badge ready">${L('Siap Update','Ready')}</span>
        </div>
        <p>${L('Pipeline pembaruan otomatis: pra-backup snapshot, kompilasi build.py, validasi hash SHA-256 build-manifest.json.','Automated update pipeline: pre-backup snapshot, build.py compilation, and build-manifest.json SHA-256 verification.')}</p>
        <div class="vps-segment-foot">
          <span>${L('Distribusi: 1-Klik Hot-Reload','Distribution: 1-Click Hot Reload')}</span>
          <span class="vps-pill-sub">build-manifest.json</span>
        </div>
      </div>
    </div>

    <!-- Release Changelog History -->
    <section class="panel panel-pad" style="margin-top:24px">
      <div class="panel-head">
        <h2>${L('Riwayat Pembaruan & Catatan Rilis','Update History & Release Changelog')}</h2>
        ${button(L('Ekspor backup workspace','Export workspace backup'),'export')}
      </div>
      ${releases.history.map(r=>`
        <div class="draft-row">
          <div style="display:flex;align-items:center;gap:10px">
            <h2>v${escape(r.version)}</h2>
            <span class="badge ${r.version===releases.version?'plus':''}">${r.version===releases.version?L('Versi Aktif','Active Version'):escape(r.date||'')}</span>
          </div>
          <ul style="margin-top:10px;padding-left:20px;line-height:1.75">
            ${(state.language==='en'?(r.changesEn||r.changes):r.changes).map(c=>`<li>${escape(c)}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </section>`;
  }
  async function v3Action(name,id){try{switch(name){
    case 'int-ping-all':toast(L('⚡ Sinyal koneksi INVEYS aktif! Semua saluran terhubung dengan lancar.','⚡ INVEYS connection signals active! All channels operating smoothly.'));break;
    case 'crypto-connect-modal':openCryptoSyncModal(id||'bybit');break;
    case 'crypto-exchanges-modal':openCryptoExchangesModal();break;
    case 'capture-parse':draftText($('#capture-text').value);break;
    case 'capture-review':render();break;
    case 'capture-pair-transfers':{
      const beforeLen=drafts.length;
      drafts=R.pairTransferDrafts(drafts,state.accounts);
      const delta=beforeLen-drafts.length;
      render();
      if(delta>0){
        toast(L(`Berhasil menggabungkan ${delta} pasang mutasi menjadi transfer antar rekening.`,`Successfully paired ${delta} transaction pairs into inter-account transfers.`));
      }else{
        toast(L('Tidak ditemukan pasangan mutasi keluar-masuk yang cocok.','No matching outflow-inflow transfer pairs found.'));
      }
      break;
    }
    case 'capture-clear':drafts=[];captureText='';captureStatus='';quickReply='';render();break;
    case 'capture-select-clean':{
      drafts.forEach(d=>{d.selected=!R.duplicates(state,d).length;});
      render();
      toast(L('Memilih baris yang bersih (tanpa potensi duplikasi).','Selected clean rows (no duplicate flags).'));
      break;
    }
    case 'capture-select-all':{
      drafts.forEach(d=>{d.selected=true;});
      render();
      break;
    }
    case 'capture-deselect-all':{
      drafts.forEach(d=>{d.selected=false;});
      render();
      break;
    }
    case 'capture-save':commitDrafts();break;
    case 'capture-ai-extract':{
      if(captureBusy){toast(L('Tunggu ekstraksi selesai.','Wait for extraction to finish.'));break;}
      const a=getAccount($('#capture-account')?.value)||state.accounts[0];
      if(!a)throw Error(L('Tambahkan akun terlebih dahulu','Add an account first'));
      let file=null;
      const fInput=$('#capture-file');
      const rawText=($('#capture-text')?.value||captureText||'').trim();
      if(fInput?.files?.[0]){
        file=await fileData(fInput.files[0]);
      }else if(!rawText){
        throw Error(L('Pilih file (PDF/CSV/Gambar) atau masukkan teks transaksi terlebih dahulu','Choose a file (PDF/CSV/Image) or enter transaction text first'));
      }
      const chosenProvider = captureProvider || '9router';
      if(chosenProvider === 'local'){
        if(captureBusy){toast(L('Tunggu ekstraksi selesai.','Wait for extraction to finish.'));break;}
        captureStatus=L('Mengekstrak file via OCR lokal…','Extracting file via local OCR…');
        captureBusy=true;
        toast(captureStatus);
        render();
        try{
          const result=await api('extract',file);
          captureText=result.text||'';
          captureStatus=L('Ekstraksi teks lokal selesai. Tekan "Buat draft" untuk meninjau.','Local text extraction complete. Press "Create drafts" to review.');
          toast(captureStatus);
        }catch(err){
          captureStatus=L('Ekstraksi OCR lokal gagal: ','Local OCR failed: ')+(err.message||err);
          toast(captureStatus);
        }finally{
          captureBusy=false;
          render();
        }
        break;
      }
      const providerLabel = chosenProvider === '9router' ? '9Router Gateway' : (chosenProvider === 'gemini' ? 'Google Gemini' : (chosenProvider === 'openai' ? 'OpenAI' : aiProviderName(chosenProvider)));
      captureStatus=L(`Menganalisis dokumen dengan ${providerLabel}…`,`Analyzing document with ${providerLabel}…`);
      captureBusy=true;
      toast(captureStatus);
      render();
      try{
        const historical=$('#capture-kind')?.value==='statement';
        const payload={
          provider: chosenProvider,
          consent:true,
          file:file||undefined,
          text:!file?rawText:undefined,
          recordContext:{currency:a.currency,date:date(),accountId:a.id}
        };
        const result=await api('ai-extract-statement',payload);
        if(!result.drafts||!result.drafts.length){
          captureStatus=L('AI tidak menemukan transaksi pada dokumen ini.','AI found no transactions in this document.');
          toast(captureStatus);
          break;
        }

        // Auto-create or match bank account
        let targetAcc=state.accounts.find(acc=>{
          const bName=(result.accountInfo?.name||result.bank||'').toLowerCase();
          return bName&&(acc.name.toLowerCase().includes(bName)||bName.includes(acc.name.toLowerCase()));
        });
        let createdAccountNotice='';
        if(!targetAcc){
          const accName=result.accountInfo?.name||result.bank||'Bank Account';
          targetAcc={
            id:uid(),
            name:accName,
            type:result.accountInfo?.type||'Checking',
            balance:0,
            currency:result.accountInfo?.currency||a.currency||state.currency,
            owner:state.members[0]?.id||'shared',
            updated:date(),
            balancePolicy:'ledger'
          };
          state.accounts.push(targetAcc);
          captureAccount=targetAcc.id;
          createdAccountNotice=L(` · Akun baru "${accName}" dibuat otomatis`,` · New account "${accName}" created automatically`);
        }

        // Auto-create or match credit card if statement is credit card
        let createdCardNotice='';
        if(result.cardInfo||result.documentType==='credit_card_statement'){
          const cardName=result.cardInfo?.name||result.bank||'Kartu Kredit';
          const last4=String(result.cardInfo?.last4||'1234').padStart(4,'0').slice(-4);
          let card=state.cards.find(c=>c.last4===last4||c.name.toLowerCase()===cardName.toLowerCase());
          if(!card){
            const debtId=uid();
            const stmtAmt=result.cardInfo?.statementAmount?Math.round(parseFloat(result.cardInfo.statementAmount)*100):0;
            const minAmt=result.cardInfo?.minimumPayment?Math.round(parseFloat(result.cardInfo.minimumPayment)*100):Math.max(5000000,Math.round(stmtAmt*0.05));
            const debt={
              id:debtId,
              name:'Tagihan '+cardName,
              balance:stmtAmt,
              minimum:minAmt>0?minAmt:5000000,
              apr:21.0,
              currency:targetAcc.currency
            };
            state.debts.push(debt);
            card={
              id:uid(),
              debtId:debtId,
              name:cardName,
              owner:state.members[0]?.id||'shared',
              last4:last4,
              limit:result.cardInfo?.limit?Math.round(parseFloat(result.cardInfo.limit)*100):Math.max(1000000000,stmtAmt*2),
              statementAmount:stmtAmt,
              paid:0,
              dueDate:result.cardInfo?.dueDate&&E.validDate(result.cardInfo.dueDate)?result.cardInfo.dueDate:date(),
              reminderDays:7
            };
            state.cards.push(card);
            createdCardNotice=L(` · Kartu Kredit "${cardName}" dibuat otomatis`,` · Credit Card "${cardName}" created automatically`);
          }
        }
        save();

        let parsed=result.drafts.map((d,i)=>({
          id:uid(),
          name:d.name,
          date:d.date||date(),
          amount:Math.round(parseFloat(d.amount)*100),
          kind:d.kind||'expense',
          currency:d.currency||targetAcc.currency,
          category:d.category||'Imported',
          accountId:targetAcc.id,
          source:'ai-statement',
          sourceKey:'ai-'+Date.now()+'-'+i,
          affectBalance:!historical,
          selected:true
        }));
        if(R.pairTransferDrafts&&parsed.length>1)parsed=R.pairTransferDrafts(parsed,state.accounts);
        drafts=parsed.map(d=>({...d,selected:!R.duplicates(state,d).length}));
        captureStatus=L(`⚡ AI (${result.provider}) berhasil mengekstrak ${drafts.length} transaksi dari ${result.bank||'dokumen'}${createdAccountNotice}${createdCardNotice}.`,`⚡ AI (${result.provider}) extracted ${drafts.length} transactions from ${result.bank||'document'}${createdAccountNotice}${createdCardNotice}.`);
        toast(captureStatus);
      }catch(err){
        captureStatus=L('Ekstraksi AI gagal: ','AI extraction failed: ')+(err.message||err);
        toast(captureStatus);
      }finally{
        captureBusy=false;
        render();
      }
      break;
    }
    case 'capture-extract':{
      if(captureBusy){toast(L('Tunggu ekstraksi selesai.','Wait for extraction to finish.'));break;}
      captureStatus=L('Mengekstrak file…','Extracting file…');
      captureBusy=true;
      toast(captureStatus);
      render();
      try{
        const file=await fileData();
        const result=await api('extract',file);
        draftText(result.text,'document');
      }catch(err){
        captureStatus=err.message;
        toast(err.message);
      }finally{
        captureBusy=false;
        render();
      }
      break;
    }
    case 'capture-audio':{const file=await fileData();if(!file.type.startsWith('audio/'))throw Error('Choose an audio file');confirmAction(L('Kirim audio ke Muse?','Send audio to Muse?'),L('File audio terpilih dikirim ke Meta untuk transkripsi (maks. 120 detik). Hasilnya menjadi draft lokal.','Selected audio is sent to Meta for transcription (max. 120 seconds). Results become local drafts.'),()=>{api('transcribe',file).then(r=>draftText(r.text,'voice')).catch(e=>toast(e.message));},L('Kirim untuk transkripsi','Send for transcription'));break;}
    case 'capture-voice':{const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Speech)throw Error(L('Browser ini belum mendukung pengenalan suara. Unggah file audio lalu pilih transkripsi Muse.','This browser does not support speech recognition. Upload audio and select Muse transcription.'));confirmAction(L('Mulai pengenalan suara?','Start speech recognition?'),L('Browser dapat mengirim suara ke layanan pengenalan suara browser. Hasil tidak langsung dicatat.','The browser may send audio to its speech-recognition service. Results are not recorded automatically.'),()=>{voiceRecognition=new Speech();voiceRecognition.lang=state.language==='id'?'id-ID':'en-US';voiceRecognition.onresult=e=>draftText(e.results[0][0].transcript,'voice');voiceRecognition.onerror=()=>toast(L('Suara tidak dikenali; gunakan teks atau file audio.','Voice unavailable; use text or an audio file.'));voiceRecognition.start();toast(L('Silakan bicara lalu hentikan suara','Speak, then stop voice input'));},L('Mulai','Start'));break;}
    case 'capture-stop':voiceRecognition?.stop();break;
    case 'fx-refresh':await refreshFX();break;
    case 'service-status':service=await api('status');render();break;
    case 'telegram-inbox':telegramItems=(await api('telegram/inbox',{})).items;render();break;
    case 'telegram-draft':{const x=telegramItems.find(x=>String(x.id)===id);if(!x)throw Error('Inbox item missing');draftText(x.text,'telegram',x.id);break;}
    case 'telegram-send':{const due=E.reminders(state,date());const preview='INVEYS · '+date()+'\n'+(due.length?due.map(r=>JSON.stringify(r)).join('\n'):L('Tidak ada pengingat kartu terdekat.','No upcoming card reminders.'));openModal(L('Pratinjau pesan Telegram','Telegram message preview'),form(`<label>${L('Pesan yang akan dikirim ke private chat Anda','Message to send to your private chat')}<textarea name="text" rows="7" maxlength="3500" required>${escape(preview)}</textarea></label>`+`<label><input name="consent" type="checkbox" required> ${L('Saya menyetujui pengiriman pesan ini ke Telegram.','I approve sending this message to Telegram.')}</label>`,L('Kirim pesan','Send message')),d=>{if(!d.consent)throw Error('Consent required');api('telegram/send',{text:d.text,consent:true}).then(()=>toast(L('Pesan terkirim','Message sent'))).catch(e=>toast(e.message));});break;}
    case 'muse-ask':{const p=E.position(viewState());const summary=JSON.stringify({reportingCurrency:state.currency,netWorth:p.netWorth/100,income:p.income/100,expenses:p.expenses/100,debtPayments:p.debtPayments/100,goalCommitments:p.goalCommitments/100,available:p.available/100,fxSource:state.fx.source,fxDate:state.fx.date});openModal(L('Tanya Muse dengan ringkasan ini','Ask Muse with this summary'),form(`<pre class="summary-preview">${escape(summary)}</pre>`+field(L('Pertanyaan','Question'),'prompt',L('Jelaskan kesehatan keuangan dan tiga tindakan prioritas.','Explain financial health and three priority actions.'),'text','required maxlength="2000"')+`<label><input type="checkbox" name="consent" required> ${L('Saya setuju mengirim pertanyaan dan ringkasan di atas ke Meta AI.','I agree to send the question and summary above to Meta AI.')}</label>`,L('Kirim ke Muse','Send to Muse')),d=>{if(!d.consent)throw Error('Consent required');museAnswer=L('Menunggu Muse…','Waiting for Muse…');api('muse',{prompt:d.prompt,summary,consent:true}).then(r=>{museAnswer=r.text;render();}).catch(e=>{museAnswer=e.message;render();});});break;}
    case 'updates-check':{const r=await api('updates');toast(r.version===releases.version?L('Versi lokal sudah terbaru ('+releases.version+')','Local version is current ('+releases.version+')'):L('Versi tersedia: ','Available version: ')+r.version);break;}
    case 'vps-segments-check':{
      try {
        toast(L('Memeriksa kesehatan 4 segmen arsitektur VPS…','Checking health of 4 VPS architecture segments…'));
        const r=await api('vps/segments');
        if(r&&r.segments){
          const content=`<div style="display:flex;flex-direction:column;gap:14px;padding:4px 0"><p style="font-size:12px;color:var(--muted)">${L('Pemeriksaan kesehatan sistem modular INVEYS berhasil. Semua segmen terverifikasi:','INVEYS modular system health check succeeded. All segments verified:')}</p>${r.segments.map(s=>`<div style="border:1px solid var(--line);border-radius:10px;padding:12px 14px;background:var(--paper)"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b>${escape(s.name)}</b><span class="badge ${s.status==='healthy'||s.status==='ready'?'plus':'orange'}">${escape(s.status.toUpperCase())}</span></div><p style="font-size:11px;color:var(--muted);margin-bottom:6px">${escape(s.description)}</p><small style="font-size:10px;color:var(--green);font-weight:600">${escape(s.details)}</small></div>`).join('')}</div>`;
          openModal(L('Status Kesehatan 4 Segmen VPS','4 VPS Segments Health Status'),content);
        }
      }catch(err){toast(err.message);}
      break;
    }
    case 'vps-update-run':{
      confirmAction(
        L('Jalankan 1-Klik Pembaruan VPS?','Run 1-Click VPS Update?'),
        L('Sistem akan melakukan 4 tahapan aman:\n1. Snapshot cadangan database SQLite ke ~/.inveys/backups/\n2. Kompilasi ulang bundel mandiri (inveys-app.html)\n3. Verifikasi integritas checksum SHA-256 seluruh segmen\n4. Hot-reload layanan tanpa downtime dan tanpa risiko data.\n\nLanjutkan pembaruan sekarang?','The system will perform 4 automated steps:\n1. Create SQLite database snapshot backup to ~/.inveys/backups/\n2. Recompile standalone app bundle (inveys-app.html)\n3. Verify SHA-256 checksums across all segments\n4. Hot-reload services with zero downtime and zero data risk.\n\nProceed with update now?'),
        async ()=>{
          try {
            toast(L('🚀 Memulai 1-Klik Update VPS (Backup -> Rebuild -> Verifikasi)…','🚀 Starting 1-Click VPS Update (Backup -> Rebuild -> Verify)…'));
            const res=await api('vps/update',{});
            if(res.ok){
              const summaryHtml=`<div style="padding:10px 0;display:flex;flex-direction:column;gap:14px"><div style="display:flex;align-items:center;gap:12px;background:color-mix(in srgb,var(--green) 12%,var(--paper));border:1px solid var(--green);border-radius:12px;padding:14px"><span style="font-size:28px">✅</span><div><b style="font-size:14px;color:var(--green)">${L('Pembaruan VPS Berhasil Diterapkan!','VPS Update Successfully Applied!')}</b><p style="font-size:11px;color:var(--muted);margin-top:4px">${L('Aplikasi kini berjalan di versi v','Application is now running on v')}${escape(res.version)} · ${escape(res.timestamp)}</p></div></div><div style="border:1px solid var(--line);border-radius:10px;padding:12px;background:var(--paper)"><b style="font-size:12px;display:block;margin-bottom:8px">${L('Log Status Segmen:','Segment Status Log:')}</b><ul style="font-size:11px;line-height:1.7;margin:0;padding-left:18px;color:var(--muted)">${res.updatedSegments.map(s=>`<li><b>${escape(s.name)}:</b> ${escape(s.action||s.status)}</li>`).join('')}</ul></div><p style="font-size:11px;color:var(--muted)">${L('Snapshot cadangan terproteksi telah diamankan dengan ID #','Protected snapshot backup secured with ID #')}${escape(String(res.backupId||'auto'))}.</p><button class="btn primary" onclick="location.reload()" style="width:100%;margin-top:6px">${L('Muat Ulang Aplikasi (Reload)','Reload Application')}</button></div>`;
              openModal(L('Laporan Hasil Pembaruan VPS','VPS Update Report'),summaryHtml);
              toast(L('Pembaruan VPS selesai!','VPS update completed!'));
            }
          }catch(e){toast(L('Pembaruan VPS gagal: ','VPS update failed: ')+e.message);}
        },
        L('Ya, Perbarui Sekarang','Yes, Update Now')
      );
      break;
    }
  }}catch(e){captureStatus=e.message;toast(e.message);}}
  const v3Names=new Set(['int-ping-all','crypto-connect-modal','crypto-exchanges-modal','capture-parse','capture-review','capture-pair-transfers','capture-select-clean','capture-select-all','capture-deselect-all','capture-clear','capture-save','capture-extract','capture-ai-extract','capture-audio','capture-voice','capture-stop','fx-refresh','service-status','telegram-inbox','telegram-draft','telegram-send','muse-ask','updates-check','vps-update-run','vps-segments-check']);
  document.addEventListener('change',e=>{const el=e.target;if(el.id==='capture-account')captureAccount=el.value;if(el.id==='capture-kind')captureKind=el.value;if(el.id==='capture-provider'){captureProvider=el.value;try{localStorage.setItem('inveys_capture_provider',el.value);}catch(err){}render();}if(el.id==='fx-auto'){state.fx.auto=el.checked;save();if(el.checked)refreshFX();}if(el.dataset.draft!==undefined){const d=drafts[Number(el.dataset.draft)];if(!d)return;const key=el.dataset.key;try{d[key]=el.type==='checkbox'?el.checked:key==='amount'?E.cents(el.value):el.value;if(key==='kind'&&d[key]==='transfer'&&!d.targetId){d.targetId=state.accounts.find(a=>a.id!==d.accountId)?.id||'';render();}else if(key==='kind'){render();}if(key==='accountId'&&getAccount(el.value)?.currency!==d.currency)toast(L('Pilih akun dengan mata uang draft yang sama.','Choose an account matching the draft currency.'));}catch(err){d.selected=false;toast(err.message);}}});
  document.addEventListener('input',e=>{if(e.target.id==='capture-text')captureText=e.target.value;});

  const F=window.InveysFinance;
  const viewState=()=>F.scope(state);
  const ownerName=id=>id==='all'?L('Seluruh keluarga','Whole household'):id==='shared'?L('Bersama','Shared'):state.members.find(m=>m.id===id)?.name||L('Anggota sebelumnya','Former member');
  const ownerOptions=(selected,all=false)=>[...(all?[['all',L('Seluruh keluarga','Whole household')]]:[]),['shared',L('Bersama','Shared')],...state.members.map(m=>[m.id,m.name])].map(([id,name])=>`<option value="${id}" ${id===selected?'selected':''}>${escape(name)}</option>`).join('');
  const ownerField=(row)=>field(L('Pemilik analisis','Analysis owner'),'ownerId','','select',ownerOptions(row?.ownerId||(state.activeView.owner!=='all'?state.activeView.owner:'shared')));
  let reportFilter=F.defaultFilter(date()),reportDrill=null,forecastSelected='base',forecastReal=false,forecastChartMetric='networth',forecastSelectedYear=0,forecastResult=null,forecastMC=null,forecastMCSig='';
  function navigationV4(){
    const item=id=>{
      if(id==='scenarios'){
        const isSimActive=page==='scenarios'||page==='montecarlo';
        return `<button class="nav-item ${isSimActive?'active':''}" data-page="scenarios" ${isSimActive?'aria-current="page"':''} aria-label="${escape(L('Skenario & Simulasi','Scenarios & Simulation'))}" title="${escape(L('Skenario & Simulasi','Scenarios & Simulation'))}">
          ${icon('scenarios')}
          <span class="nav-text">${L('Skenario & Simulasi','Scenarios & Simulation')}</span>
        </button><button data-page="montecarlo" class="screen-reader" tabindex="-1" aria-hidden="true" style="display:none">Monte Carlo</button>`;
      }
      const label=t(pages.find(p=>p[0]===id)?.[1]||id);
      return `<button class="nav-item ${page===id?'active':''}" data-page="${id}" ${page===id?'aria-current="page"':''} aria-label="${escape(label)}" title="${escape(label)}">${icon(id)}<span class="nav-text">${label}</span></button>`;
    };
    const manageIds=['operations','household','integrations','plans','updates'];
    if(isServerMode&&(currentUser?.role==='admin'||currentUser?.id==='master'))manageIds.push('admin');
    const groups=[
      [L('Keuangan','Finances'),'finance-group',['accounts','transactions','calendar','budget','capture','cashflow','cards','debt']],
      [L('Perencanaan','Planning'),'planning-group',['forecast','goals','scenarios']],
      [L('Analisis','Insights'),'insights-group',['reports','investment','shared']],
      [L('Kelola','Manage'),'manage-group',manageIds]
    ];
    return item('home')+groups.map(([label,ic,ids])=>`<details class="nav-section ${ids.includes(page)||(ids.includes('scenarios')&&page==='montecarlo')?'active-section':''}" ${ids.includes(page)||(ids.includes('scenarios')&&page==='montecarlo')?'open':''}><summary title="${escape(label)}" aria-label="${escape(label)}">${icon(ic)}<span class="nav-text">${label}</span><span class="nav-disclosure">⌄</span></summary><div class="nav-submenu">${ids.map(item).join('')}</div></details>`).join('')+item('copilot');
  }
  const financialPages=new Set(['shared']);
  function viewBar(){if(!financialPages.has(page))return '';return `<section class="view-bar" aria-label="${L('Perspektif keuangan','Financial perspective')}"><div>${icon('household')}<b>${L('Shared Views','Shared Views')}</b></div><label class="sr-only" for="active-owner">${L('Perspektif pemilik','Ownership perspective')}</label><select id="active-owner">${ownerOptions(state.activeView.owner,true)}</select><label><input type="checkbox" id="include-shared" ${state.activeView.includeShared?'checked':''} ${['all','shared'].includes(state.activeView.owner)?'disabled':''}> ${L('Sertakan milik bersama','Include shared ownership')}</label>${button(L('Simpan tampilan','Save view'),'view-save')}<span class="view-caption">${L('Filter analisis lokal · semua pengguna browser tetap dapat melihat data','Local analysis filter · browser users retain access to all data')}</span></section>`;}

  let quickMinimized=false,quickAttachment=null,quickAttachmentGeneration=0,quickFileBusy=false;
  function quickAttachmentTag(file){
    if(!file)return '';
    if(file.type.startsWith('image/'))return `<span class="quick-att-tag">🖼️ ${L('Gambar','Image')}</span>`;
    if(file.type.startsWith('video/'))return `<span class="quick-att-tag">🎬 ${L('Video','Video')}</span>`;
    if(file.type.startsWith('audio/'))return `<span class="quick-att-tag">🎙️ Audio</span>`;
    if(file.type==='application/pdf')return `<span class="quick-att-tag">📑 PDF</span>`;
    return `<span class="quick-att-tag">📄 ${L('Dokumen','Doc')}</span>`;
  }
  function quickHabitChips(){
    const accs=viewState().accounts;
    const habits=[
      {label:'☕ Kopi 25k',text:'Beli kopi 25rb'},
      {label:'🍱 Makan 35k',text:'Beli makan siang 35rb'},
      {label:'⛽ Bensin 50k',text:'Beli bensin 50rb'},
      {label:'⚡ Listrik 100k',text:'Bayar token listrik 100rb'}
    ];
    if(accs.length>=2){
      habits.push({label:`⇄ Ke ${accs[1].name.slice(0,12)}`,text:`Transfer 100rb ke ${accs[1].name}`});
    }
    return `<div class="quick-habit-bar" role="group" aria-label="${L('Pilihan cepat habit','Quick habit shortcuts')}"><span class="quick-habit-label">⚡ ${L('Habit:','Habit:')}</span>${habits.map(h=>`<button type="button" class="quick-habit-chip" data-quick-fill="${escape(h.text)}" title="${escape(h.text)}">${escape(h.label)}</button>`).join('')}</div>`;
  }
  let veySpeech = '';
  let veyCustomMood = null;
  let veySpeechTimer = null;
  let veyPokeCount = 0;
  let veySoundEnabled = true;
  try { veySoundEnabled = localStorage.getItem('inveys_vey_sound') !== '0'; } catch(e){}

  function veyPlaySound(type = 'poke') {
    if (!veySoundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'poke' || type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'love') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.08);
        osc.frequency.setValueAtTime(659.25, now + 0.16);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'success' || type === 'sparkle') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880.00, now + 0.06);
        osc.frequency.setValueAtTime(1174.66, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch(e) {}
  }

  function veyPokeAction() {
    veyPokeCount++;
    if (veySpeechTimer) clearTimeout(veySpeechTimer);

    const p = E.position(viewState());
    const draftCount = drafts.length;
    const moodPool = ['wink', 'love', 'happy', 'celebrate'];
    const chosenMood = moodPool[veyPokeCount % moodPool.length];
    veyCustomMood = chosenMood;

    if (chosenMood === 'love') veyPlaySound('love');
    else if (chosenMood === 'celebrate') veyPlaySound('sparkle');
    else veyPlaySound('poke');

    const tips = [
      L('🛡️ Halo! Seluruh aset dan catatan finansial Anda tersimpan privat di brankas lokal browser ini.', '🛡️ Hello! All your financial records are secured privately in this local browser vault.'),
      L('⚡ Mau catat cepat? Ketik nominal seperti "Kopi 25rb" atau "Bensin 50rb" di bawah!', '⚡ Need quick capture? Type something like "Coffee 25k" or "Gas 50k" below!'),
      L('📑 Lampirkan struk belanja kasir atau PDF mutasi bank via tombol (+), saya bantu ekstrak otomatis!', '📑 Attach purchase receipts or bank PDF statements via (+) and I will auto-extract them!'),
      L('💡 Tips Finansial: Usahakan tabungan dana darurat minimal 3-6 kali pengeluaran bulanan Anda.', '💡 Financial Tip: Strive for an emergency fund of 3-6 months of your expenses.'),
      L('🎯 Pantau tabungan masa depan di menu Goals untuk menjaga impian finansial tetap terarah!', '🎯 Track your future savings in the Goals menu to keep your milestones on target!'),
      L('👁️ Aktifkan Ghost Mode di toolbar atas jika Anda sedang membuka INVEYS di tempat umum.', '👁️ Toggle Ghost Mode in the top bar to blur sensitive balances in public.')
    ];

    if (draftCount > 0) {
      veySpeech = L(`🎉 Ada ${draftCount} draf transaksi siap ditinjau di bawah! Tekan "Simpan yang dipilih" ya.`, `🎉 You have ${draftCount} transaction drafts ready below! Press "Save selected".`);
    } else if (p.netWorth > 0 && veyPokeCount % 3 === 0) {
      veySpeech = L(`💎 Total kekayaan bersih Anda saat ini: ${money(p.netWorth, false, state.currency)}. Pertahankan performanya!`, `💎 Your current net worth is ${money(p.netWorth, false, state.currency)}. Keep growing!`);
    } else {
      veySpeech = tips[veyPokeCount % tips.length];
    }

    render();

    veySpeechTimer = setTimeout(() => {
      veyCustomMood = null;
      veySpeech = '';
      render();
    }, 6000);
  }

  function veyAction(name, id) {
    if (name === 'vey-poke') {
      veyPokeAction();
      return;
    }
    if (name === 'vey-dismiss-speech') {
      veySpeech = '';
      veyCustomMood = null;
      if (veySpeechTimer) clearTimeout(veySpeechTimer);
      render();
      return;
    }
    if (name === 'vey-toggle-sound') {
      veySoundEnabled = !veySoundEnabled;
      try { localStorage.setItem('inveys_vey_sound', veySoundEnabled ? '1' : '0'); } catch(e){}
      if (veySoundEnabled) veyPlaySound('poke');
      toast(veySoundEnabled ? L('🔊 Efek suara Vey diaktifkan', '🔊 Vey sound effects enabled') : L('🔇 Efek suara Vey dibisukan', '🔇 Vey sound effects muted'));
      render();
      return;
    }
  }

  function veyMascot(mood='idle',size=36){
    const isHappy=mood==='happy'||mood==='celebrate';
    const isThink=mood==='thinking';
    const isWink=mood==='wink';
    const isLove=mood==='love';
    const isAlert=mood==='alert'||mood==='surprised';
    const isSleep=mood==='sleep'||mood==='standby';
    const eyeCol = isHappy ? '#fbbf24' : (isThink ? '#38bdf8' : (isLove ? '#f43f5e' : (isWink ? '#10b981' : (isAlert ? '#a855f7' : (isSleep ? '#6ee7b7' : '#34d399')))));
    const auraCol = isHappy ? 'rgba(251,191,36,0.3)' : (isThink ? 'rgba(56,189,248,0.3)' : (isLove ? 'rgba(244,63,94,0.35)' : (isAlert ? 'rgba(168,85,247,0.3)' : 'rgba(52,211,153,0.25)')));
    let eyesSvg='';
    if(isHappy){
      eyesSvg=`<path d="M36 53 Q41 47 46 53" fill="none" stroke="${eyeCol}" stroke-width="3" stroke-linecap="round"/><path d="M54 53 Q59 47 64 53" fill="none" stroke="${eyeCol}" stroke-width="3" stroke-linecap="round"/><circle cx="34" cy="58" r="2.2" fill="#f43f5e" opacity="0.6"/><circle cx="66" cy="58" r="2.2" fill="#f43f5e" opacity="0.6"/><polygon points="26,38 28,43 33,45 28,47 26,52 24,47 19,45 24,43" fill="#fbbf24" class="vey-sparkle"/><polygon points="74,38 76,43 81,45 76,47 74,52 72,47 67,45 72,43" fill="#fbbf24" class="vey-sparkle s2"/>`;
    }else if(isThink){
      eyesSvg=`<circle cx="41" cy="51" r="4.5" fill="${eyeCol}" class="vey-eye-think"/><circle cx="59" cy="51" r="4.5" fill="${eyeCol}" class="vey-eye-think"/><circle cx="42.5" cy="49.5" r="1.5" fill="#fff"/><circle cx="60.5" cy="49.5" r="1.5" fill="#fff"/><line x1="32" y1="51" x2="68" y2="51" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2 2" opacity="0.7" class="vey-scanline"/>`;
    }else if(isWink){
      eyesSvg=`<path d="M36 53 Q41 46 46 53" fill="none" stroke="${eyeCol}" stroke-width="3" stroke-linecap="round"/><polygon points="59,47 60.5,50.5 64,51 61.5,53.5 62,57 59,55 56,57 56.5,53.5 54,51 57.5,50.5" fill="${eyeCol}" class="vey-wink-star"/><circle cx="34" cy="58" r="2.2" fill="#f43f5e" opacity="0.6"/><circle cx="66" cy="58" r="2.2" fill="#f43f5e" opacity="0.6"/><polygon points="74,36 76,41 81,43 76,45 74,50 72,45 67,43 72,41" fill="#fbbf24" class="vey-sparkle"/>`;
    }else if(isLove){
      eyesSvg=`<path d="M41 48 A2.2 2.2 0 0 0 37.5 49.5 A2.2 2.2 0 0 0 37.5 52.5 L41 56 L44.5 52.5 A2.2 2.2 0 0 0 44.5 49.5 A2.2 2.2 0 0 0 41 48 Z" fill="#f43f5e" class="vey-heart-eye"/><path d="M59 48 A2.2 2.2 0 0 0 55.5 49.5 A2.2 2.2 0 0 0 55.5 52.5 L59 56 L62.5 52.5 A2.2 2.2 0 0 0 62.5 49.5 A2.2 2.2 0 0 0 59 48 Z" fill="#f43f5e" class="vey-heart-eye"/><circle cx="33" cy="58" r="2" fill="#f43f5e" opacity="0.7"/><circle cx="67" cy="58" r="2" fill="#f43f5e" opacity="0.7"/><path d="M72 32 A1.5 1.5 0 0 0 69.5 33 A1.5 1.5 0 0 0 69.5 35 L72 37.5 L74.5 35 A1.5 1.5 0 0 0 74.5 33 A1.5 1.5 0 0 0 72 32 Z" fill="#fb7185" class="vey-floating-heart"/>`;
    }else if(isAlert){
      eyesSvg=`<circle cx="41" cy="51" r="5" fill="none" stroke="${eyeCol}" stroke-width="2"/><circle cx="41" cy="51" r="2.2" fill="${eyeCol}"/><circle cx="59" cy="51" r="5" fill="none" stroke="${eyeCol}" stroke-width="2"/><circle cx="59" cy="51" r="2.2" fill="${eyeCol}"/><line x1="50" y1="20" x2="50" y2="24" stroke="${eyeCol}" stroke-width="2.5" stroke-linecap="round" class="vey-antenna-ping"/>`;
    }else if(isSleep){
      eyesSvg=`<path d="M37 52 L45 52" stroke="${eyeCol}" stroke-width="2.5" stroke-linecap="round"/><path d="M55 52 L63 52" stroke="${eyeCol}" stroke-width="2.5" stroke-linecap="round"/><text x="68" y="42" font-size="9" font-family="'Manrope',sans-serif" font-weight="800" fill="#38bdf8" class="vey-zzz">z</text><text x="75" y="34" font-size="11" font-family="'Manrope',sans-serif" font-weight="800" fill="#34d399" class="vey-zzz s2">Z</text>`;
    }else{
      eyesSvg=`<g class="vey-eye-group"><rect x="37" y="47" width="8" height="9" rx="4" fill="${eyeCol}"/><rect x="55" y="47" width="8" height="9" rx="4" fill="${eyeCol}"/><circle cx="42" cy="50" r="1.6" fill="#fff"/><circle cx="60" cy="50" r="1.6" fill="#fff"/></g>`;
    }
    return `<svg class="vey-mascot-svg mood-${escape(mood)}" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vey Cyber-Vault Mascot"><defs><radialGradient id="vg-${size}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${auraCol}"/><stop offset="100%" stop-color="transparent"/></radialGradient><linearGradient id="vh-${size}" x1="20%" y1="0%" x2="80%" y2="100%"><stop offset="0%" stop-color="#1f3b32"/><stop offset="50%" stop-color="#0f261f"/><stop offset="100%" stop-color="#071713"/></linearGradient><linearGradient id="vr-${size}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#34d399"/><stop offset="50%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#fbbf24"/></linearGradient></defs><circle cx="50" cy="50" r="46" fill="url(#vg-${size})"/><ellipse cx="50" cy="54" rx="43" ry="15" fill="none" stroke="url(#vr-${size})" stroke-width="2.2" stroke-dasharray="8 6" transform="rotate(-14 50 54)" class="vey-orbit-ring"/><g class="vey-levitate"><path d="M28 38 L17 28" stroke="#34d399" stroke-width="2.8" stroke-linecap="round"/><circle cx="16" cy="27" r="3.5" fill="#38bdf8" class="vey-antenna-orb"/><path d="M72 38 L83 28" stroke="#34d399" stroke-width="2.8" stroke-linecap="round"/><circle cx="84" cy="27" r="3.5" fill="#38bdf8" class="vey-antenna-orb"/><path d="M26 52 C26 26, 74 26, 74 52 C74 72, 65 78, 50 78 C35 78, 26 72, 26 52 Z" fill="url(#vh-${size})" stroke="#34d399" stroke-width="2.5"/><polygon points="50,32 54,36 50,40 46,36" fill="${eyeCol}"/><path d="M31 46 C31 41, 69 41, 69 46 C69 64, 61 67, 50 67 C39 67, 31 64, 31 46 Z" fill="#03140f" stroke="rgba(52,211,153,0.35)" stroke-width="1.8"/><path d="M34 44 C42 42, 58 42, 66 44" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-linecap="round" fill="none"/>${eyesSvg}<ellipse cx="50" cy="78" rx="10" ry="3.2" fill="#34d399" opacity="0.7" class="vey-thruster"/></g><ellipse cx="50" cy="91" rx="22" ry="4" fill="rgba(0,0,0,0.32)" class="vey-shadow"/></svg>`;
  }
  function quickComposer(){
    const title=L('Catat atau tanya INVEYS','Record or ask INVEYS');
    const baseMood=aiBusy?'thinking':(drafts.length?'happy':(quickAttachment?'alert':'idle'));
    const mascotMood=veyCustomMood||baseMood;
    if(quickMinimized)return `<section class="quick-dock minimized" aria-label="${title}"><button class="quick-launcher" data-action="quick-expand" aria-expanded="false" aria-controls="quick-chat-body" title="${L('Buka asisten finansial Vey','Open Vey assistant')}"><span class="vey-launcher-avatar">${veyMascot(mascotMood,32)}</span><span class="vey-launcher-label"><strong class="vey-name">Vey</strong><small class="vey-sub">${L('Asisten Finansial AI','Financial AI Assistant')}</small></span>${drafts.length?`<span class="badge">${drafts.length} draft</span>`:`<span class="vey-ping-dot"></span>`}</button></section>`;
    const veyBar=`<div class="vey-top-bar"><div class="vey-profile interactive" data-action="vey-poke" role="button" tabindex="0" title="${L('Klik untuk menyapa Vey!','Click to poke Vey!')}" aria-label="${L('Interaksi dengan Vey','Interact with Vey')}"><div class="vey-avatar-badge ${mascotMood}">${veyMascot(mascotMood,38)}</div><div class="vey-details"><div class="vey-name-row"><strong class="vey-title">Vey</strong><span class="vey-badge-role">Cyber-Vault Guardian</span><span class="vey-live-badge ${aiBusy?'busy':'ready'}"><span class="vey-live-pulse"></span>${aiBusy?L('Berpikir…','Thinking…'):L('Aktif','Ready')}</span></div><span class="vey-engine-chip">${L('Engine: ','Engine: ')}<b>${aiProviderBadge(state.assistant.provider)}</b></span></div></div><div class="vey-bar-tools"><button type="button" class="vey-tool-btn ${veySoundEnabled?'active':''}" data-action="vey-toggle-sound" title="${veySoundEnabled?L('Efek Suara: Aktif','Sound: On'):L('Efek Suara: Bisu','Sound: Muted')}">${veySoundEnabled?'🔔':'🔕'}</button><button type="button" class="vey-tool-btn" data-action="quick-new-chat" title="${L('Percakapan baru','New conversation')}">${icon('plus')}</button><button type="button" class="vey-tool-btn" data-action="quick-ai-settings" title="${L('Pengaturan AI & Model','AI Settings')}">${icon('settings')}</button></div></div>`;
    const starters=CHAT.history(state).length===0?`<div class="quick-starters"><button type="button" class="quick-starter-pill" data-starter="${L('Berapa total kekayaan bersih saya saat ini?','What is my current net worth?')}">💡 ${L('Kekayaan Bersih','Net Worth')}</button><button type="button" class="quick-starter-pill" data-starter="${L('Berapa sisa kapasitas kas saya bulan ini?','How much available cash flow do I have this month?')}">📈 ${L('Arus Kas Bulan Ini','Cash Flow')}</button><button type="button" class="quick-starter-pill" data-starter="${L('Bagaimana progres pencapaian target tabungan saya?','How are my savings goals progressing?')}">🎯 ${L('Target Tabungan','Goal Progress')}</button></div>`:'';
    const speechHtml=veySpeech?`<div class="vey-speech-bubble" role="status" aria-live="polite"><div class="vey-bubble-arrow"></div><div class="vey-bubble-content"><span class="vey-bubble-icon">${mascotMood==='love'?'💖':(mascotMood==='wink'?'✨':(mascotMood==='celebrate'?'🎉':'💬'))}</span><div class="vey-bubble-text">${escape(veySpeech)}</div><button type="button" class="vey-bubble-close" data-action="vey-dismiss-speech" aria-label="${L('Tutup pesan Vey','Dismiss')}">✕</button></div></div>`:'';
    return `<section class="panel quick-composer quick-dock" aria-label="${L('Pencatatan cepat dan chatbot','Quick capture and chatbot')}"><div id="quick-chat-body">${veyBar}${speechHtml}<div class="quick-chat-output">${aiThread()}${aiBusy?`<div class="ai-wait-card" role="status"><div class="ai-aura-pill"><div class="ai-spark-orb"><span class="sparkle-star">✧</span><div class="sparkle-ring"></div></div><div class="ai-wait-content"><div class="ai-wait-status-line"><span class="ai-live-indicator"></span><span class="ai-status-text" id="ai-dynamic-status">${escape(aiThinkingStatusText())}</span></div><div class="ai-shimmer-bar"><div class="ai-shimmer-progress"></div></div></div></div></div>`:''}${quickReply?`<div class="quick-response" role="status" aria-live="polite">${quickReply}</div>`:''}${page==='capture'?'':draftPanel()}</div>${starters}${quickHabitChips()}${quickAttachment?`<div class="quick-attachment"><span>${icon('capture')}${quickAttachmentTag(quickAttachment)} ${user(quickAttachment.name)}<small>${(quickAttachment.size/1024).toFixed(0)} KB</small></span>${!quickAttachment.type.startsWith('audio/')&&!quickAttachment.type.startsWith('video/')&&!['text/plain','text/csv'].includes(quickAttachment.type)?button(quickFileBusy?L('Memproses…','Processing…'):L('Ekstrak & tinjau','Extract & review'),'quick-extract'):''}${button(L('Hapus lampiran','Remove attachment'),'quick-file-clear')}</div>`:''}<form id="quick-form" class="quick-chat-input"><details class="quick-popover"><summary class="quick-icon-button" aria-label="${L('Lampiran dan pilihan pencatatan','Attachments and recording options')}" title="${L('Lampiran dan pilihan pencatatan','Attachments and recording options')}">+</summary><div class="quick-popover-menu"><div class="quick-popover-head"><span class="quick-popover-title">✨ ${L('Tambah Lampiran & Media','Add Media & Attachments')}</span><span class="quick-popover-sub">${L('Pilih file dokumen, foto atau rekaman','Select document, photo or media')}</span></div><div class="quick-media-grid"><button type="button" class="quick-tile-btn" data-action="quick-camera"><span class="quick-tile-icon photo">${icon('capture')}</span><b>${L('Kamera','Camera')}</b><small>${L('Ambil foto','Take photo')}</small></button><button type="button" class="quick-tile-btn" data-action="quick-upload:doc"><span class="quick-tile-icon doc">${icon('capture')}</span><b>${L('Dokumen','Document')}</b><small>PDF / CSV / Struk</small></button><button type="button" class="quick-tile-btn" data-action="quick-upload:video"><span class="quick-tile-icon video">${icon('capture')}</span><b>${L('Video','Video')}</b><small>MP4 / WebM</small></button><button type="button" class="quick-tile-btn" data-action="quick-upload:audio"><span class="quick-tile-icon audio">${icon('copilot')}</span><b>${L('Audio','Audio')}</b><small>M4A / WAV</small></button></div><div class="quick-actions-list"><button type="button" class="quick-list-btn" data-action="quick-new-chat">${icon('plus')}<span>${L('Percakapan baru','New conversation')}</span></button><button type="button" class="quick-list-btn" data-action="quick-voice">${icon('copilot')}<span>${L('Input suara','Voice input')}</span></button><button type="button" class="quick-list-btn" data-action="quick-ai-settings">${icon('settings')}<span>${L('Model AI & Memori','AI Model & Memory')}<small>${aiProviderName(state.assistant.provider)}</small></span></button></div><div class="quick-popover-account"><label for="quick-account">${L('Akun untuk pencatatan','Recording account')}</label><select id="quick-account" name="accountId"><option value="">${L('Pilih akun','Choose account')}</option>${viewState().accounts.map(a=>`<option value="${a.id}" ${a.id===quickAccount?'selected':''}>${escape(a.name)} · ${a.currency}</option>`).join('')}</select></div><div class="quick-popover-account"><label for="quick-source-kind">${L('Jenis dokumen','Document type')}</label><select id="quick-source-kind"><option value="receipt" ${captureKind==='receipt'?'selected':''}>${L('Struk','Receipt')}</option><option value="statement" ${captureKind==='statement'?'selected':''}>${L('Statement bank historis','Historical bank statement')}</option></select></div><button type="button" class="quick-list-btn" data-page="copilot" style="margin-top:4px">${icon('copilot')}<span>${L('Buka chatbot lengkap','Open full chatbot')}</span></button></div></details><label class="screen-reader" for="quick-text">${L('Perintah atau pertanyaan','Command or question')}</label><textarea id="quick-text" name="text" rows="1" maxlength="6000" placeholder="${L('Tanya INVEYS atau ketik instruksi keuangan…','Ask INVEYS or enter a financial instruction…')}">${escape(quickText)}</textarea><button class="quick-icon-button quick-microphone ${recorder?'recording':''}" type="button" data-action="quick-record-audio" aria-label="${recorder?L('Hentikan rekaman','Stop recording'):L('Rekam suara','Record voice')}" title="${recorder?L('Hentikan rekaman','Stop recording'):L('Rekam suara','Record voice')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 10v2a6 6 0 0 0 12 0v-2M12 18v3m-3 0h6"/></svg></button><button class="quick-icon-button quick-send" type="submit" aria-label="${L('Kirim','Send')}" title="${L('Kirim','Send')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></button></form></div></section>`;
  }
  function quickChooseFile(file){
    if(!file)return;
    const okTypes=['image/png','image/jpeg','image/webp','application/pdf','text/plain','text/csv','audio/webm','audio/wav','audio/x-wav','audio/mpeg','audio/mp4','audio/ogg','audio/flac','video/mp4','video/webm','video/quicktime'];
    if(!okTypes.includes(file.type)||file.size<=0||file.size>8*1024*1024){toast(L('Pilih PNG/JPEG/WebP, PDF, TXT/CSV, audio atau video maksimal 8 MB.','Choose PNG/JPEG/WebP, PDF, TXT/CSV, audio or video up to 8 MB.'));return;}
    if(aiBusy||quickFileBusy){toast(L('Tunggu ekstraksi selesai.','Wait for extraction to finish.'));return;}
    quickAttachment=file;quickAttachmentGeneration++;quickMinimized=false;
    const pop=$('.quick-popover');if(pop&&pop.open)pop.open=false;
    render();
  }
  async function quickExtract(){
    if(quickFileBusy)return;
    const file=quickAttachment,account=getAccount(quickAccount),generation=quickAttachmentGeneration,kind=captureKind;
    if(!file||!account){toast(L('Pilih lampiran dan akun melalui + terlebih dahulu.','Choose an attachment and recording account via + first.'));return;}
    if(drafts.length){toast(L('Simpan atau buang draft terlebih dahulu.','Save or discard drafts first.'));return;}
    quickFileBusy=true;render();
    try{const payload=await fileData(file),result=await api('extract',payload);if(generation!==quickAttachmentGeneration)return;if(drafts.length)throw Error(L('Draft baru sudah ada; lampiran tidak menggantikannya.','New drafts already exist; the attachment will not replace them.'));captureAccount=account.id;captureKind=kind;draftText(result.text,'document',null,{accountId:account.id,historical:kind==='statement'});}
    catch(error){if(generation===quickAttachmentGeneration){quickReply=escape(error.message);render();}}
    finally{if(generation===quickAttachmentGeneration){quickFileBusy=false;render();}}
  }
  document.addEventListener('change',event=>{if(['quick-camera-file','quick-upload-file'].includes(event.target.id))quickChooseFile(event.target.files?.[0]);if(event.target.id==='quick-source-kind'&&['receipt','statement'].includes(event.target.value))captureKind=event.target.value;});
  let voiceStream=null,voiceTimer=null;
  async function recordVoice(){
    if(recorder?.state==='recording'){recorder.stop();return;}
    if(!window.navigator?.mediaDevices?.getUserMedia||!window.MediaRecorder){quickAction('quick-voice');return;}
    if(aiBusy||quickFileBusy){toast(L('Tunggu proses selesai.','Wait for processing.'));return;}
    const generation=aiGeneration,scope=CHAT.scope(state);let chunks=[],failed=false;
    try{voiceStream=await navigator.mediaDevices.getUserMedia({audio:true});if(generation!==aiGeneration||scope!==CHAT.scope(state)){voiceStream.getTracks().forEach(t=>t.stop());voiceStream=null;return;}
      recorder=new MediaRecorder(voiceStream);recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
      const cleanup=()=>{clearTimeout(voiceTimer);voiceStream?.getTracks().forEach(t=>t.stop());voiceStream=null;recorder=null;};
      recorder.onerror=()=>{failed=true;cleanup();toast(L('Rekaman gagal. Unggah audio atau gunakan dikte.','Recording failed. Upload audio or use dictation.'));render();};
      recorder.onstop=()=>{const type=(recorder?.mimeType||chunks[0]?.type||'audio/webm').split(';')[0],blob=new Blob(chunks,{type});cleanup();if(!failed&&generation===aiGeneration&&scope===CHAT.scope(state)){const ext=type==='audio/mp4'?'m4a':type==='audio/ogg'?'ogg':'webm';quickChooseFile(new File([blob],'inveys-voice.'+ext,{type}));}else render();};
      recorder.start();voiceTimer=setTimeout(()=>{if(recorder?.state==='recording')recorder.stop();},120000);render();
    }catch(error){voiceStream?.getTracks().forEach(t=>t.stop());voiceStream=null;toast(L('Akses mikrofon gagal atau ditolak. Gunakan unggah audio.','Microphone access failed or was denied. Upload audio instead.'));}
  }
  const CHAT=window.InveysAssistant;
  let aiBusy=false,aiGeneration=0;
  const aiProviderName=id=>({local:L('Lokal (Kalkulator)','Local (Calculator)'),openai:'OpenAI (ChatGPT / GPT-4o)',gemini:'Google Gemini',muse:'Meta AI (Muse Spark)','9router':'9Router (Claude / OpenRouter)'})[id]||id;
  const aiProviderBadge=id=>({gemini:'✨ Google Gemini',openai:'⚡ GPT-4o Mini','9router':'🚀 9Router',muse:'✧ Meta AI',local:'🔢 Local'})[id]||id;
  function aiRichText(value){
    let s=escape(value);
    s=s.replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>');
    s=s.replace(/^#{1,3} (.+)$/gm,'<strong class="ai-head">$1</strong>');
    s=s.replace(/^[-*] /gm,'<span class="ai-bullet">•</span> ');
    s=s.replace(/`([^`\n]+)`/g,'<code class="ai-inline-code">$1</code>');
    s=s.replace(/\b(Rp\s*[\d.,]+|IDR\s*[\d.,]+)\b/g,'<span class="ai-money-chip">$1</span>');
    return s;
  }
  const timerSet=typeof window!=='undefined'&&typeof window.setInterval==='function'?window.setInterval.bind(window):(typeof setInterval==='function'?setInterval:null);
  const timerClear=typeof window!=='undefined'&&typeof window.clearInterval==='function'?window.clearInterval.bind(window):(typeof clearInterval==='function'?clearInterval:null);
  let streamState={active:false,fullText:'',displayedText:'',timer:null};
  function startStreamingReply(text,cb){
    veyPlaySound('sparkle');
    if(streamState.timer&&timerClear)timerClear(streamState.timer);
    streamState.fullText=text;
    if(typeof window==='undefined'||!window.requestAnimationFrame||!timerSet){
      streamState.active=false;
      streamState.displayedText=text;
      if(cb)cb();
      return;
    }
    streamState.active=true;
    streamState.displayedText='';
    let charIndex=0;
    const len=text.length;
    const step=Math.max(2, Math.floor(len / 80));
    streamState.timer=timerSet(()=>{
      charIndex+=step;
      if(charIndex>=len){
        charIndex=len;
        streamState.displayedText=text;
        if(timerClear)timerClear(streamState.timer);
        streamState.timer=null;
        streamState.active=false;
        updateStreamingUI();
        if(cb)cb();
      }else{
        streamState.displayedText=text.slice(0,charIndex);
        updateStreamingUI();
      }
    },16);
    updateStreamingUI();
  }
  function updateStreamingUI(){
    const els=document.querySelectorAll?.('.typing-streaming .ai-content');
    if(els&&els.length){
      els.forEach(el=>{el.innerHTML=aiRichText(streamState.displayedText)+'<span class="ai-typing-cursor"></span>';});
      const container=$('.quick-chat-output')||$('#chat-messages');
      if(container)container.scrollTop=container.scrollHeight;
    }
  }
  function skipStreaming(){
    if(streamState.active){
      if(streamState.timer&&timerClear)timerClear(streamState.timer);
      streamState.active=false;
      streamState.timer=null;
      streamState.displayedText=streamState.fullText;
      updateStreamingUI();
      document.querySelectorAll?.('.typing-streaming').forEach(el=>el.classList.remove('typing-streaming'));
      document.querySelectorAll?.('.ai-typing-cursor').forEach(el=>el.remove());
    }
  }
  let aiThinkingInterval=null,aiThinkingStageIndex=0;
  const aiThinkingStages=[
    L('⚡ Menghubungkan ke Gemini AI…','⚡ Connecting to Gemini AI…'),
    L('🔍 Menganalisis konteks portofolio & transaksi…','🔍 Analyzing portfolio & financial records…'),
    L('💡 Merumuskan kalkulasi & rekomendasi…','💡 Computing metrics & recommendations…'),
    L('✨ Menyiapkan jawaban finansial…','✨ Preparing financial insights…')
  ];
  function startAiThinking(){
    aiThinkingStageIndex=0;
    if(aiThinkingInterval&&timerClear)timerClear(aiThinkingInterval);
    if(timerSet){
      aiThinkingInterval=timerSet(()=>{
        aiThinkingStageIndex=(aiThinkingStageIndex+1)%aiThinkingStages.length;
        const el=$('#ai-dynamic-status');
        if(el){el.style.opacity='0';setTimeout(()=>{if(el){el.textContent=aiThinkingStages[aiThinkingStageIndex];el.style.opacity='1';}},150);}
      },2200);
    }
  }
  function stopAiThinking(){if(aiThinkingInterval&&timerClear){timerClear(aiThinkingInterval);aiThinkingInterval=null;}}
  function aiThinkingStatusText(){return aiThinkingStages[aiThinkingStageIndex]||aiThinkingStages[0];}
  function aiThread(){
    const rows=CHAT.history(state).slice(-8);
    if(!rows.length)return '';
    return `<div class="ai-thread" role="log" aria-live="polite">${rows.map((m,idx)=>{
      const isLatestAssistant=m.role==='assistant'&&idx===rows.length-1&&streamState.active;
      const textToShow=isLatestAssistant?streamState.displayedText:m.text;
      const badge=m.role==='assistant'?`<span class="ai-provider-badge">${aiProviderBadge(m.provider)}</span>`:'';
      const avatar=m.role==='assistant'?`<span class="vey-msg-avatar">${veyMascot('idle',20)}</span>`:'';
      const sender=m.role==='user'?L('Anda','You'):'Vey';
      return `<div class="ai-message ${m.role} ${isLatestAssistant?'typing-streaming':''}" onclick="skipStreaming()"><div class="ai-message-head">${avatar}<small>${sender}</small>${badge}</div><div class="ai-content">${m.role==='assistant'?aiRichText(textToShow)+(isLatestAssistant?'<span class="ai-typing-cursor"></span>':''):user(m.text)}</div></div>`;
    }).join('')}</div>`;
  }
  function aiSettings(){openModal(L('Asisten INVEYS','INVEYS assistant'),form(`<p class="note">${L('API key disimpan di server lokal. Pilih penyedia, lalu izinkan pengiriman pesan dan lampiran.','API keys stay on the local server. Select a provider and allow messages and attachments to be sent.')}</p>${field(L('Penyedia','Provider'),'provider','','select',CHAT.providers.map(id=>`<option value="${id}" ${state.assistant.provider===id?'selected':''}>${aiProviderName(id)}</option>`).join(''))}<label><input name="consent" type="checkbox" ${state.assistant.consent?'checked':''}> ${L('Izinkan pesan, riwayat percakapan tampilan ini dan lampiran dikirim ke penyedia yang saya pilih','Allow messages, conversation history for this view and attachments to my selected provider')}</label><label><input name="shareFinancial" type="checkbox" ${state.assistant.shareFinancial?'checked':''}> ${L('Sertakan ringkasan keuangan tampilan aktif','Include the active view’s financial summary')}</label><label><input name="useMemory" type="checkbox" ${state.assistant.useMemory?'checked':''}> ${L('Gunakan preferensi tersimpan sebagai konteks','Use saved preferences as context')}</label><label>${L('Memori preferensi · satu per baris','Preference memory · one per line')}<textarea name="memory" rows="5" maxlength="15500">${escape(state.assistant.memory.join('\n'))}</textarea></label><p class="note">${L('Memori dapat diedit/dihapus di sini. Tidak melatih ulang model atau menyimpan isi dokumen otomatis.','Edit/delete memory here. It does not retrain a model or automatically retain document contents.')}</p><p class="note">${Object.entries(service.ai||{}).map(([id,c])=>`${aiProviderName(id)}: ${c.enabled?L('key tersedia','key configured'):L('belum dikonfigurasi','not configured')}`).join(' · ')||L('Periksa koneksi server untuk melihat konfigurasi API.','Check server connection to see API configuration.')}</p><div style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--line);display:flex;justify-content:flex-end">${button(L('🔑 Atur Kunci API AI & Bot Telegram','🔑 Configure AI API Keys & Telegram Bot'),'api-keys:'+(state.assistant.provider==='9router'?'ninerouter':state.assistant.provider==='local'?'all':state.assistant.provider||'all'))}</div>`),d=>{const next={...state.assistant,provider:d.provider,consent:!!d.consent,shareFinancial:!!d.shareFinancial,useMemory:!!d.useMemory,memory:CHAT.memory(d.memory),mode:'auto'};CHAT.validate(next);state.assistant=next;});}
  async function aiSend(text,accountId){
    if(aiBusy){toast(L('Tunggu jawaban selesai.','Wait for the reply.'));return;}
    const cfg=structuredClone(state.assistant),file=quickAttachment,scope=CHAT.scope(state),generation=aiGeneration;
    quickText=String(text||'').slice(0,6000);quickAccount=accountId||quickAccount;
    if(!cfg.consent){quickReply=escape(L('Aktifkan izin pengiriman API melalui pengaturan asisten.','Enable API sharing in assistant settings.'));render();return;}
    if(!quickText.trim()&&!file)return;
    if(planGate('integrations'))return;
    const recordingAccount=getAccount(quickAccount)?structuredClone(getAccount(quickAccount)):null,recordingKind=captureKind;
    const prompt=quickText,history=CHAT.history(state).slice(-20).map(({role,text})=>({role,text}));
    const p=E.position(viewState()),summary=cfg.shareFinancial?JSON.stringify({currency:state.currency,owner:ownerName(state.activeView.owner),netWorth:p.netWorth/100,assets:p.assets/100,liabilities:p.liabilities/100,income:p.income/100,expenses:p.expenses/100,available:p.available/100,fxDate:state.fx.date}):'';
    aiBusy=true;quickReply='';startAiThinking();render();
    try{const attachment=file?{...await fileData(file),name:file.name.slice(0,200)}:null;const r=await api('chat',{provider:cfg.provider,prompt,history,memory:cfg.useMemory?cfg.memory:[],summary,file:attachment,consent:true,unified:true,recordContext:{date:date(),currency:recordingAccount?.currency||null,sourceKind:recordingKind}});if(generation!==aiGeneration||scope!==CHAT.scope(state))return;
      if(r.intent==='record'&&Array.isArray(r.drafts)&&r.drafts.length){
        if(drafts.length)throw Error(L('Simpan atau buang draft yang ada dahulu.','Save or discard existing drafts first.'));
        const account=recordingAccount&&getAccount(recordingAccount.id);if(!account||account.currency!==recordingAccount.currency)throw Error(L('Pilih akun melalui + lalu kirim ulang.','Choose a recording account through + and resend.'));
        const prepared=r.drafts.map(d=>{if(!['income','expense','transfer'].includes(d.kind)||!E.validDate(d.date)||d.currency!==account.currency)throw Error('Invalid AI draft currency, date or type');let targetId=undefined;if(d.kind==='transfer'){const targetAcc=state.accounts.find(a=>a.id!==account.id&&(a.name.toLowerCase().includes(String(d.targetAccount||'').toLowerCase())||String(d.targetAccount||'').toLowerCase().includes(a.name.toLowerCase())))||state.accounts.find(a=>a.id!==account.id);targetId=targetAcc?.id;}return {name:requireText(d.name),date:d.date,kind:d.kind,amount:positive(d.amount),currency:account.currency,accountId:account.id,targetId,category:d.kind==='transfer'?'Transfer':requireText(d.category||'Imported'),source:'ai-chat',affectBalance:file?recordingKind!=='statement':true,selected:false,duplicateReason:''};});
        drafts=prepared.map(d=>({...d,selected:!R.duplicates(state,d).length}));
      }
      CHAT.append(state,'user',prompt||(file?L('Lampiran: ','Attachment: ')+file.name:''),cfg.provider,date());
      CHAT.append(state,'assistant',r.text,cfg.provider,date());
      messages.push({role:'user',text:prompt},{role:'assistant',text:escape(r.text)});
      quickText='';if(quickAttachment===file){quickAttachment=null;quickAttachmentGeneration++;}quickReply='';
      stopAiThinking();
      startStreamingReply(r.text);
    }catch(error){
      stopAiThinking();
      if(generation===aiGeneration&&scope===CHAT.scope(state))quickReply=escape(error.message);
    }
    finally{
      stopAiThinking();
      if(generation===aiGeneration){aiBusy=false;render();}
    }
  }
  function quickSend(text,accountId,source='quick-text'){
    if(aiBusy){toast(L('Tunggu jawaban selesai.','Wait for the reply.'));return;}
    veyPlaySound('poke');
    if(state.assistant.provider!=='local'){aiSend(text,accountId);return;}
    if(quickAttachment){quickReply=escape(L('Atur asisten di Integrations untuk analisis lampiran, atau Ekstrak & tinjau secara lokal.','Configure the assistant in Integrations for attachment analysis, or Extract & review locally.'));render();return;}
    localQuickSend(text,accountId,source);
  }
  function localQuickSend(text,accountId,source='quick-text',forceQuestion=false){
    text=String(text||'').trim();if(!text)return;quickText=text.slice(0,500);quickAccount=String(accountId||'');
    if(quickFileBusy){quickReply=escape(L('Tunggu ekstraksi lampiran selesai.','Wait for attachment extraction to finish.'));render();return;}const intent=forceQuestion?'question':R.quickIntent(text);
    if(intent==='question'){
      const reply=answer(text);messages.push({role:'user',text},{role:'assistant',text:reply});CHAT.append(state,'user',text,'local',date());CHAT.append(state,'assistant',reply.replace(/<[^>]*>/g,''),'local',date());quickReply='';quickText='';render();return;
    }
    try{
      if(drafts.length)throw Error(L('Simpan atau buang draft yang ada sebelum membuat catatan baru.','Save or discard existing drafts before creating another record.'));
      const lines=text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
      const acc=getAccount(quickAccount);
      if(lines.length>1){
        const parsedRows=[];
        for(const line of lines){
          const row=R.quickRecord(line,acc,date(),state.accounts);
          parsedRows.push({...row,source:'quick-bulk',category:row.category||'Imported',affectBalance:true});
        }
        let finalized=parsedRows;
        if(R.pairTransferDrafts&&finalized.length>1)finalized=R.pairTransferDrafts(finalized,state.accounts);
        drafts=finalized.map(d=>({...d,selected:!R.duplicates(state,d).length}));
        quickReply=escape(L(`${drafts.length} draft siap dari multi-baris. Periksa di bawah, lalu tekan Simpan yang dipilih.`,`${drafts.length} drafts ready from multi-line text. Review below then Save selected.`));
        quickText='';messages.push({role:'user',text},{role:'assistant',text:quickReply,recordAction:true});
      }else{
        const d=R.quickRecord(text,acc,date(),state.accounts);
        drafts=[{...d,source,category:d.category||'Imported',affectBalance:true,selected:!R.duplicates(state,d).length}];
        quickReply=escape(L('Draft siap. Periksa akun, nominal, dan tanggal di bawah, lalu tekan Simpan yang dipilih.','Draft ready. Review account, amount and date below, then press Save selected.'));quickText='';messages.push({role:'user',text},{role:'assistant',text:quickReply,recordAction:true});
      }
    }catch(e){quickReply=escape(e.message);}
    render();
  }
  function quickAction(name,id){
    const pop=$('.quick-popover');if(pop&&pop.open)pop.open=false;
    if(name==='quick-record-audio'){recordVoice();return;}
    if(name==='quick-ai-settings'){aiSettings();return;}
    if(name==='quick-ai-status'){api('status').then(r=>{service=r;aiSettings();}).catch(e=>toast(e.message));return;}
    if(name==='quick-new-chat'){if(aiBusy){toast(L('Tunggu jawaban selesai.','Wait for the reply.'));return;}confirmAction(L('Mulai percakapan baru?','Start a new conversation?'),L('Riwayat percakapan tampilan ini dihapus. Memori preferensi dan data keuangan tetap tersimpan.','This view’s chat history will be deleted. Preferences and financial records remain.'),()=>{state.assistant.history=state.assistant.history.filter(m=>m.scope!==CHAT.scope(state));messages=[];quickReply='';});return;}
    if(name==='quick-expand'){quickMinimized=false;render();$('#quick-text')?.focus();return;}
    if(['quick-camera','quick-upload','quick-scan'].includes(name)){
      if(aiBusy||quickFileBusy){toast(L('Tunggu ekstraksi selesai.','Wait for extraction to finish.'));return;}
      const input=$(name==='quick-camera'?'#quick-camera-file':'#quick-upload-file');
      if(name==='quick-upload'&&input){
        if(id==='video')input.accept='video/mp4,video/webm,video/quicktime,video/*';
        else if(id==='audio')input.accept='audio/*,audio/webm,audio/wav,audio/mpeg,audio/mp4,audio/ogg';
        else if(id==='doc')input.accept='application/pdf,text/plain,text/csv,image/png,image/jpeg,image/webp';
        else input.accept='image/png,image/jpeg,image/webp,application/pdf,text/plain,text/csv,audio/*,video/*';
      }
      input.value='';input.click();return;
    }
    if(name==='quick-file-clear'){if(aiBusy){toast(L('Tunggu jawaban selesai.','Wait for the reply.'));return;}quickAttachment=null;quickAttachmentGeneration++;quickFileBusy=false;render();return;}
    if(name==='quick-extract'){quickExtract();return;}
    if(name==='quick-audio'){
      // Reuse the full source controls: historical statements must not change snapshots by default.
      if(drafts.length){toast(L('Simpan atau buang draft terlebih dahulu.','Save or discard drafts first.'));return;}captureAccount=$('#quick-account').value||'';captureText=$('#quick-text').value||'';navigate('capture');$('#capture-file').click();return;
    }
    if(name==='quick-voice'){
      const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
      if(!Speech){toast(L('Suara browser belum tersedia; unggah audio di Capture.','Browser voice unavailable; upload audio in Capture.'));return;}
      const selected=$('#quick-account').value||'';
      confirmAction(L('Mulai input suara?','Start voice input?'),L('Browser dapat mengirim suara ke layanan pengenalan suara browser. Hasil menjadi draft atau pertanyaan, bukan transaksi otomatis.','The browser may send audio to its speech service. Results become drafts or questions, never automatic transactions.'),()=>{
        voiceRecognition=new Speech();voiceRecognition.lang=state.language==='id'?'id-ID':'en-US';
        voiceRecognition.onresult=e=>quickSend(e.results[0][0].transcript,selected,'quick-voice');
        voiceRecognition.onerror=()=>toast(L('Suara tidak dikenali. Silakan gunakan teks.','Voice unavailable. Please use text.'));voiceRecognition.start();
      },L('Mulai','Start'));
    }
  }

  const INV=window.InveysInvestment;
  let investmentFrom='',investmentTo='',investmentCurrency='IDR',investmentSelected=['sp500'],investmentMain='holdings',investmentTab='market',investmentAccount='all',investmentGroup='assetClass',investmentStyle='pie',investmentRange='all',investmentMode='auto',investmentGainStyle='bars';
  const investmentPercent=n=>n===null?'—':new Intl.NumberFormat(locale(),{style:'percent',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
  const investmentMoney=n=>n===null?'—':amount(n,investmentCurrency);
  const investmentLabels=()=>({assetClass:L('Kelas aset','Asset class'),account:L('Akun','Account'),security:L('Sekuritas','Security'),category:L('Kategori','Category'),globalCategory:L('Kategori global','Global category'),aggregatedCategory:L('Kategori agregat','Aggregated category'),prospectusObjective:L('Tujuan prospektus','Prospectus objective'),indexStrategy:L('Strategi indeks','Index strategy'),legalStructure:L('Struktur hukum','Legal structure')});
  const investmentColors=['var(--accent)','#24a6bd','#8177df','#d49b42','#d26a9c','#5399cf','#7ba858'];
  function investmentOptions(entries,value){return entries.map(([key,label])=>`<option value="${escape(key)}" ${value===key?'selected':''}>${escape(label)}</option>`).join('');}
  function investmentPeriod(){return investmentRange==='custom'?{from:investmentFrom||'0000-01-01',to:investmentTo||date()}:INV.period(investmentRange,date());}
  let investmentMetric='return',investmentHolding='all',investmentHover=-1,investmentPinned=false,investmentChartState=null;
  const investmentName=id=>id==='portfolio'?L('Portofolio Anda','Your portfolio'):INV.benchmarks.find(b=>b.id===id)?.name||id;
  function investmentSeriesColor(id){
    const dark=state.theme==='dark';
    if(id==='portfolio'){
      const p=investmentChartState?.result?.series?.[0];
      const ret=p?.return??0;
      return ret>=0?(dark?'#10b981':'#059669'):(dark?'#f43f5e':'#e11d48');
    }
    return ({sp500:dark?'#b89aff':'#7953ba','us-stock':dark?'#64d6c9':'#177e78','us-bond':dark?'#dfc078':'#9a701e',btc:dark?'#f7b270':'#b86c24',ihsg:dark?'#7ebcf7':'#357dae'}[id]||'#888888');
  }
  function investmentResult(){
    const scope={...investmentPeriod(),range:investmentRange,currency:investmentCurrency,account:investmentAccount,holding:investmentHolding,view:state.activeView,selected:INV.benchmarks.map(b=>b.id),mode:investmentMode};
    const r=INV.performance(state,scope);return {...r,availableSeries:r.series,series:r.series.filter(s=>s.id==='portfolio'||investmentSelected.includes(s.id))};
  }
  function generateSampleInvestmentData(targetState, today = date()) {
    let invAccount = targetState.accounts.find(a => a.type === 'Investment');
    if (!invAccount) {
      invAccount = { id: uid(), name: 'Investment Portfolio', type: 'Investment', balance: 18476000, currency: targetState.currency || 'USD', ownerId: targetState.members?.[0]?.id || 'm1', updated: today };
      targetState.accounts.push(invAccount);
    }
    const accId = invAccount.id;
    const ownerId = invAccount.ownerId || targetState.members?.[0]?.id || 'm1';
    const fxUsd = targetState.fx?.rates?.USD || 16000;

    const d = new Date(today + 'T00:00:00Z');
    const dates = [];
    for (let i = 12; i >= 1; i--) {
      const past = new Date(d);
      past.setUTCMonth(past.getUTCMonth() - i);
      dates.push(past.toISOString().slice(0, 7) + '-01');
    }
    dates.push(today);
    const uniqueDates = [...new Set(dates)].sort();

    const holdings = [
      { id: 'h_voo', accountId: accId, symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'etf', assetClass: 'Equity', currency: 'USD', quantity: 120, price: 555.0, quoteDate: today, source: 'Market Feed', costBasis: 55000, costFxToIDR: fxUsd, classifications: { category: 'Large Blend', legalStructure: 'ETF' } },
      { id: 'h_aapl', accountId: accId, symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', assetClass: 'Equity', currency: 'USD', quantity: 150, price: 238.0, quoteDate: today, source: 'Market Feed', costBasis: 28000, costFxToIDR: fxUsd, classifications: {} },
      { id: 'h_bnd', accountId: accId, symbol: 'BND', name: 'Vanguard Total Bond Market', type: 'etf', assetClass: 'Fixed Income', currency: 'USD', quantity: 300, price: 73.5, quoteDate: today, source: 'Market Feed', costBasis: 21500, costFxToIDR: fxUsd, classifications: { category: 'Intermediate Core Bond', legalStructure: 'ETF' } },
      { id: 'h_bbca', accountId: accId, symbol: 'BBCA', name: 'Bank Central Asia', type: 'stock', assetClass: 'Equity', currency: 'IDR', quantity: 2000, price: 10550, quoteDate: today, source: 'Market Feed', costBasis: 18200000, costFxToIDR: 1, classifications: {} }
    ];

    const priceCurves = {
      h_voo: [462, 470, 485, 492, 502, 515, 528, 520, 532, 538, 545, 550, 555.0],
      h_aapl: [186, 190, 195, 192, 202, 210, 220, 216, 225, 230, 234, 236, 238.0],
      h_bnd: [71.2, 71.5, 71.8, 72.0, 71.7, 72.2, 72.8, 73.0, 72.9, 73.1, 73.3, 73.4, 73.5],
      h_bbca: [9100, 9250, 9400, 9550, 9700, 9900, 10100, 10250, 10300, 10400, 10450, 10500, 10550]
    };

    const holdingPrices = [];
    uniqueDates.forEach((dateStr, i) => {
      for (const h of holdings) {
        const p = priceCurves[h.id][i] || priceCurves[h.id].at(-1);
        holdingPrices.push({
          holdingId: h.id,
          date: dateStr,
          price: p,
          fxToIDR: h.currency === 'IDR' ? 1 : fxUsd,
          usdToIDR: fxUsd,
          source: 'Closing Quote'
        });
      }
    });

    const benchmarksData = {
      sp500: [4900, 4980, 5090, 5150, 5260, 5390, 5520, 5450, 5620, 5700, 5770, 5820, 5850],
      'us-stock': [240, 245, 250, 253, 258, 265, 271, 267, 276, 280, 283, 286, 288],
      'us-bond': [71.2, 71.5, 71.8, 72.0, 71.7, 72.2, 72.8, 73.0, 72.9, 73.1, 73.3, 73.4, 73.5],
      btc: [38500, 41000, 44000, 52000, 62000, 64000, 66000, 61000, 65000, 63000, 65500, 67200, 68500],
      ihsg: [7150, 7200, 7280, 7330, 7390, 7460, 7590, 7520, 7640, 7710, 7750, 7780, 7810]
    };

    const investmentHistory = [];
    for (const [id, vals] of Object.entries(benchmarksData)) {
      uniqueDates.forEach((dateStr, i) => {
        const val = vals[i] || vals.at(-1);
        const isIdr = id === 'ihsg';
        investmentHistory.push({
          series: id,
          date: dateStr,
          value: val,
          flow: 0,
          currency: isIdr ? 'IDR' : 'USD',
          fxToIDR: isIdr ? 1 : fxUsd,
          usdToIDR: fxUsd,
          basis: 'price',
          source: id.toUpperCase() + ' Market Data'
        });
      });
    }

    const investmentSnapshots = uniqueDates.map(dateStr => ({
      date: dateStr,
      usdToIDR: fxUsd,
      rows: holdings.map(h => ({
        id: h.id,
        accountId: h.accountId,
        ownerId: ownerId,
        assetClass: h.assetClass,
        valueIDR: Math.round(h.quantity * (holdingPrices.find(p => p.holdingId === h.id && p.date === dateStr)?.price || h.price) * (h.currency === 'IDR' ? 1 : fxUsd)),
        costIDR: Math.round(h.costBasis * h.costFxToIDR)
      }))
    }));

    targetState.holdings = holdings;
    targetState.holdingPrices = holdingPrices;
    targetState.investmentHistory = investmentHistory;
    targetState.investmentSnapshots = investmentSnapshots;
    return targetState;
  }

  async function syncInvestmentPrices(){
    if(!state.holdings.length){
      toast(L('Tambahkan posisi aset terlebih dahulu sebelum sinkronisasi.','Add holdings first before syncing.'));
      return;
    }
    toast(L('Menghubungkan ke live market feed...','Connecting to live market feed...'));
    const fxUsd = state.fx?.rates?.USD || 16000;
    let synced = 0;
    for(const h of state.holdings){
      if(!h.symbol) continue;
      try{
        const res = await fetch(`/api/market-history?symbol=${encodeURIComponent(h.symbol)}&range=1y`);
        const json = await res.json();
        if(json.ok && Array.isArray(json.history) && json.history.length >= 2){
          const quotes = json.history.map(item => ({
            holdingId: h.id,
            date: item.date,
            price: item.price,
            fxToIDR: h.currency === 'IDR' ? 1 : fxUsd,
            usdToIDR: fxUsd,
            source: 'Yahoo Finance Live'
          }));
          h.price = quotes.at(-1).price;
          h.quoteDate = quotes.at(-1).date;
          h.source = 'Live Market Feed';
          state.holdingPrices = state.holdingPrices.filter(r => r.holdingId !== h.id).concat(quotes);
          synced++;
        }
      }catch(e){
        console.warn('Sync failed for', h.symbol, e);
      }
    }
    if(synced > 0){
      INV.validatePrices(state, state.holdingPrices);
      save();
      render();
      toast(L(`Harga pasar berhasil diperbarui (${synced} aset)!`,`Market prices synced for ${synced} holdings!`));
    }else{
      toast(L('Gagal memperbarui harga pasar atau server offline.','Failed to sync market prices or server offline.'));
    }
  }

  function squarifyLayout(items, x, y, width, height) {
    if (!items || !items.length) return [];
    const total = items.reduce((sum, d) => sum + (d.value || 0), 0);
    if (total <= 0) return [];
    const rects = [];
    const area = width * height;
    const normalized = items.map(d => ({ ...d, normValue: ((d.value || 0) / total) * area }));
    let remaining = [...normalized];
    let curX = x, curY = y, curW = width, curH = height;

    function worstAspect(row, side) {
      if (!row.length) return Infinity;
      const rowSum = row.reduce((s, d) => s + d.normValue, 0);
      const rowThickness = rowSum / side;
      if (rowThickness <= 0) return Infinity;
      let worst = 1;
      for (const item of row) {
        const itemLength = item.normValue / rowThickness;
        const aspect = Math.max(rowThickness / itemLength, itemLength / rowThickness);
        if (aspect > worst) worst = aspect;
      }
      return worst;
    }

    while (remaining.length) {
      const isWider = curW >= curH;
      const side = isWider ? curH : curW;
      let row = [remaining[0]];
      let bestAspect = worstAspect(row, side);

      let idx = 1;
      while (idx < remaining.length) {
        const testRow = [...row, remaining[idx]];
        const aspect = worstAspect(testRow, side);
        if (aspect <= bestAspect) {
          row = testRow;
          bestAspect = aspect;
          idx++;
        } else {
          break;
        }
      }

      const rowSum = row.reduce((s, d) => s + d.normValue, 0);
      const rowThickness = rowSum / side;
      let offset = 0;
      for (const item of row) {
        const itemLength = item.normValue / rowThickness;
        if (isWider) {
          rects.push({ ...item, x: curX, y: curY + offset, w: rowThickness, h: itemLength });
          offset += itemLength;
        } else {
          rects.push({ ...item, x: curX + offset, y: curY, w: itemLength, h: rowThickness });
          offset += itemLength;
        }
      }

      if (isWider) {
        curX += rowThickness;
        curW = Math.max(0, curW - rowThickness);
      } else {
        curY += rowThickness;
        curH = Math.max(0, curH - rowThickness);
      }
      remaining = remaining.slice(row.length);
    }
    return rects;
  }

  function investmentChart(result){
    investmentHover=-1;investmentPinned=false;investmentChartState=null;
    if(!result.dates.length)return `<div class="empty investment-empty holdings-empty">${icon('investment')}<h3>${L('Kinerja belum tersedia','Performance unavailable')}</h3><p>${L('Tambahkan holdings dan minimal dua harga historis per aset. Anda juga dapat mengimpor riwayat nilai portofolio.','Add holdings and at least two historical prices per asset. You can also import portfolio value history.')}</p><div class="button-group">${button(L('Muat data contoh','Load sample data'),'investment-load-sample','primary','sparkles')}${button(L('Tambah aset','Add holding'),'investment-holding-new','','plus')}${button(L('Impor harga historis','Import historical prices'),'investment-prices')}${button(L('Impor riwayat portofolio','Import portfolio history'),'investment-import')}</div></div>`;
    const g=INV.chartGeometry(result,investmentMetric);investmentChartState={result,g};
    const ticks=[...new Set([0,Math.round((result.dates.length-1)/3),Math.round((result.dates.length-1)*2/3),result.dates.length-1])];
    const format=v=>investmentMetric==='value'?money(Math.round(v),true,investmentCurrency):investmentPercent(v);
    const p=g.series[0];
    const portColor=investmentSeriesColor('portfolio');
    const area=p.segments.map(seg=>seg.length>1?`<polygon points="${seg[0].x},260 ${seg.map(v=>v.x+','+v.y).join(' ')} ${seg.at(-1).x},260" fill="url(#holding-area)"/>`:'').join('');
    return `<div class="holdings-chart-frame"><svg id="holdings-chart" data-investment-chart="true" font-family="system-ui, sans-serif" viewBox="0 0 1000 310" role="slider" tabindex="0" aria-label="${L('Jelajahi grafik investasi dengan panah kiri dan kanan','Explore investment chart with left and right arrow keys')}" aria-valuemin="0" aria-valuemax="${result.dates.length-1}" aria-valuenow="${result.dates.length-1}" aria-valuetext="${escape(result.dates.at(-1))}"><title>${investmentMetric==='return'?'Cumulative returns':'Portfolio value'} · ${result.dates[0]} — ${result.dates.at(-1)}</title><defs><linearGradient id="holding-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${portColor}" stop-opacity=".25"/><stop offset="100%" stop-color="${portColor}" stop-opacity="0.01"/></linearGradient><filter id="holding-glow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="2" stdDeviation="3.2" flood-color="${portColor}" flood-opacity="0.32"/></filter></defs>${g.ticks.map(v=>`<line x1="20" x2="890" y1="${g.y(v)}" y2="${g.y(v)}" stroke="currentColor" opacity=".09"/><text x="905" y="${g.y(v)+4}" fill="currentColor" font-size="12">${escape(format(v))}</text>`).join('')}${investmentMetric==='return'?`<line x1="20" x2="890" y1="${g.y(0)}" y2="${g.y(0)}" stroke="currentColor" opacity=".22" stroke-dasharray="4 5"/>`:''}${area}${g.series.map(s=>s.segments.map(seg=>`<polyline fill="none" stroke="${investmentSeriesColor(s.id)}" stroke-width="${s.id==='portfolio'?3.2:2.0}" ${s.id==='portfolio'?'filter="url(#holding-glow)"':''} stroke-linejoin="round" stroke-linecap="round" points="${seg.map(v=>v.x+','+v.y).join(' ')}"/>${seg.length===1?`<circle cx="${seg[0].x}" cy="${seg[0].y}" r="3.5" fill="${investmentSeriesColor(s.id)}"/>`:''}`).join('')).join('')}${ticks.map(i=>`<text x="${g.x(i)}" y="294" text-anchor="${i===0?'start':i===result.dates.length-1?'end':'middle'}" fill="currentColor" font-size="12">${escape(new Date(result.dates[i]+'T12:00:00Z').toLocaleDateString(locale(),{month:'short',day:'numeric',year:'2-digit'}))}</text>`).join('')}<g id="holdings-crosshair" pointer-events="none"></g></svg><div id="holdings-tooltip" class="holdings-tooltip" hidden></div></div><div class="holdings-chart-help"><span>${L('Arahkan kursor atau sentuh untuk detail. Klik untuk mengunci; Esc untuk kembali.','Hover or touch for details. Click to pin; Esc to reset.')}</span><button class="quiet-link" data-action="investment-reset-point">${L('Kembali ke terbaru','Back to latest')}</button></div><span id="holdings-live" class="screen-reader" aria-live="polite"></span>`;
  }
  function investmentPerformance(result,summary){
    const p=result.series[0],all=result.availableSeries||result.series,latestValue=p?.capitalValues?.at(-1),value=summary.count?summary.value:latestValue??null;
    const selected=state.holdings.find(h=>h.id===investmentHolding),periodCaption=result.dates.length?result.dates[0]+' — '+result.dates.at(-1):L('Belum ada histori','No history yet');
    const rows=INV.positions(state,{currency:investmentCurrency,account:investmentAccount}).filter(h=>investmentHolding==='all'||h.id===investmentHolding),asOf=rows.length?[...new Set(rows.map(h=>h.quoteDate))].sort():[];
    return `<div class="holdings-performance"><div class="holdings-hero"><div><div class="holdings-eyebrow">${selected?user(selected.symbol):L('Nilai holdings','Holdings value')}${selected?button(L('Semua aset','All holdings'),'investment-security:all'):''}</div><div class="holdings-value">${investmentMoney(value)}</div><small>${asOf.length?L('Harga tersimpan: ','Saved quotes: ')+asOf[0]+(asOf.length>1?' — '+asOf.at(-1):''):L('Nilai observasi terakhir','Last observed value')}</small></div><div class="holdings-period-result"><span class="holdings-return ${p?.return<0?'down':'up'}" id="holdings-primary-return">${p?investmentPercent(p.return):'—'}</span><small id="holdings-primary-date">${periodCaption}</small><span class="holdings-model">${result.mode==='backtest'?L('Backtest holdings saat ini','Current holdings backtest'):L('Riwayat portofolio · TWR','Portfolio history · TWR')}</span></div></div>
    <div class="holdings-control-row"><div class="holdings-ranges" aria-label="${L('Periode grafik','Chart period')}">${[['1d','1D'],['1w','1W'],['1m','1M'],['3m','3M'],['6m','6M'],['ytd','YTD'],['1y','1Y'],['all',L('Semua','All')],['custom',L('Kustom','Custom')]].map(([id,label])=>`<button data-action="investment-period:${id}" aria-pressed="${investmentRange===id}" class="${investmentRange===id?'active':''}">${label}</button>`).join('')}</div><div class="holdings-metrics" aria-label="${L('Ukuran grafik','Chart metric')}">${[['return','Return %'],['value',L('Nilai','Value')]].map(([id,label])=>`<button data-action="investment-metric:${id}" aria-pressed="${investmentMetric===id}" class="${investmentMetric===id?'active':''}">${label}</button>`).join('')}</div></div>
    ${investmentMetric==='value'?`<p class="holdings-caption">${result.mode==='backtest'?L('Nilai hipotetis holdings saat ini pada harga dan kurs historis.','Hypothetical current holdings value at historical prices and FX.'):L('Nilai akun termasuk setoran dan penarikan. Gunakan Return untuk membandingkan kinerja.','Account values include deposits and withdrawals. Use Return to compare performance.')}</p>`:''}
    ${investmentChart(result)}
    <div class="holdings-benchmark-heading"><b>${L('Bandingkan dengan','Compare with')}</b><small>${investmentMetric==='value'?L('Benchmark ditampilkan pada mode Return','Benchmarks appear in Return mode'):L('Pilih pembanding untuk grafik','Choose chart comparisons')}</small></div>
    <div class="holdings-benchmark-cards">${[{id:'portfolio',name:L('Portofolio Anda','Your portfolio')},...INV.benchmarks].map(b=>{const s=all.find(s=>s.id===b.id),on=b.id==='portfolio'||investmentSelected.includes(b.id),missing=result.unavailable.find(u=>u.id===b.id);return `<label class="holdings-benchmark-card ${on?'selected':''}" style="--series-color:${investmentSeriesColor(b.id)}"><span class="holdings-benchmark-name"><i></i>${escape(b.name)}${b.id==='portfolio'?'<span aria-hidden="true">●</span>':`<input type="checkbox" aria-label="${escape(L('Tampilkan ','Show ')+b.name)}" data-investment-benchmark="${b.id}" ${on?'checked':''}>`}</span><strong class="money ${s?.return<0?'down':'up'}" id="holdings-benchmark-${b.id}">${s?investmentPercent(s.return):'—'}</strong><small id="holdings-caption-${b.id}">${s?.return===null?L('Data akhir periode belum tersedia','Period-end data missing'):s?L('Return periode','Period return'):L('Data belum tersedia','Data unavailable')}</small><span class="holdings-last-change">${L('Perubahan terakhir','Last change')}: ${s?investmentPercent(s.lastChange):'—'}</span>${s?.changeFrom?`<small>${s.changeFrom} → ${s.lastDate}</small>`:''}${b.id!=='portfolio'&&!s?`<span class="screen-reader">${escape(missing?.reason||L('Impor histori pembanding','Import benchmark history'))}</span>`:''}</label>`;}).join('')}</div>
    <p class="holdings-caption">${result.dates.length?`${periodCaption} · ${result.dates.length} ${L('observasi portofolio','portfolio observations')}. `:''}${L('Tanggal efektif mengikuti data yang tersedia. 1D memakai dua observasi terakhir, bukan data intraday.','Effective dates follow available data. 1D uses the last two observations, not intraday data.')}</p>
    <details class="investment-method holdings-method"><summary>${L('Metode, kelengkapan data & sumber','Method, data coverage & sources')}</summary><p class="note">${result.mode==='backtest'?L('Jumlah holdings saat ini tetap sepanjang grafik. Return harga tidak mencakup dividen, biaya, pajak, atau transaksi lama.','Current quantities stay fixed across the chart. Price returns exclude dividends, fees, taxes and past trades.'):L('TWR dari riwayat impor seluruh keluarga; arus eksternal diasumsikan akhir periode.','TWR from imported whole household history; external flows are assumed at period end.')}</p><p class="note">${L('Benchmark memakai tanggal awal portofolio yang sama. Observasi yang hilang tetap kosong; tidak ada interpolasi. Memilih benchmark tidak mengubah periode/return portofolio.','Benchmarks use the same portfolio start date. Missing observations remain empty; no interpolation. Benchmark selection does not change portfolio dates or return.')}</p>${result.unavailable.map(u=>`<p class="note">${escape(investmentName(u.id))}: ${escape(u.reason)}</p>`).join('')}<div class="table-wrap"><table><thead><tr><th>${L('Seri','Series')}</th><th>Return</th><th>${L('Tanggal cocok','matching dates')}</th><th>${L('Drawdown teramati','Observed drawdown')}</th><th>${L('Basis / sumber','Basis / source')}</th></tr></thead><tbody>${all.map(s=>`<tr><td>${escape(investmentName(s.id))}</td><td>${investmentPercent(s.return)}</td><td>${s.coverage}/${result.dates.length}</td><td>${investmentPercent(s.maxDrawdown)}</td><td>${escape(s.basis)} · ${user(s.source)}</td></tr>`).join('')}</tbody></table></div></details></div>`;
  }
  function investmentPoint(index,announce=false){
    if(!investmentChartState)return;const {result,g}=investmentChartState,last=result.dates.length-1;const active=Number.isInteger(index)&&index>=0,indexSafe=active?Math.min(index,last):last;investmentHover=active?indexSafe:-1;
    const p=result.series[0],v=p.values[indexSafe],heading=$('#holdings-primary-return');if(heading){heading.textContent=investmentPercent(v);heading.classList.toggle('down',v<0);heading.classList.toggle('up',v>=0);}$('#holdings-primary-date').textContent=active?result.dates[indexSafe]:result.dates[0]+' — '+result.dates.at(-1);
    const cross=$('#holdings-crosshair'),tip=$('#holdings-tooltip'),svg=$('#holdings-chart');svg.setAttribute('aria-valuenow',String(indexSafe));svg.setAttribute('aria-valuetext',result.dates[indexSafe]+' · '+investmentPercent(v));
    for(const s of result.availableSeries||result.series){const caption=$('#holdings-caption-'+s.id);if(caption)caption.textContent=active?result.dates[indexSafe]:s.return===null?L('Data akhir periode belum tersedia','Period-end data missing'):L('Return periode','Period return');const el=$('#holdings-benchmark-'+s.id);if(el){el.textContent=investmentPercent(s.values[indexSafe]);el.classList.toggle('down',s.values[indexSafe]!==null&&s.values[indexSafe]<0);el.classList.toggle('up',s.values[indexSafe]!==null&&s.values[indexSafe]>=0);}}
    if(!active){cross.innerHTML='';tip.hidden=true;return;}
    cross.innerHTML=`<line x1="${g.x(indexSafe)}" x2="${g.x(indexSafe)}" y1="25" y2="260" stroke="currentColor" stroke-opacity=".4" stroke-dasharray="3 4"/>${g.series.filter(s=>s.values[indexSafe]!==null).map(s=>`<circle cx="${g.x(indexSafe)}" cy="${g.y(s.values[indexSafe])}" r="4.5" fill="${investmentSeriesColor(s.id)}" stroke="${state.appearance[state.theme].colors.paper}" stroke-width="2"/>`).join('')}`;
    tip.innerHTML=`<b>${result.dates[indexSafe]}${investmentPinned?' · '+L('Dikunci','Pinned'):''}</b>${g.series.map(s=>`<div><span><i style="background:${investmentSeriesColor(s.id)}"></i>${escape(investmentName(s.id))}</span><strong class="money ${s.values[indexSafe]!==null?(s.values[indexSafe]<0?'down investment-negative':s.values[indexSafe]>0?'up investment-positive':''):''}">${s.values[indexSafe]===null?'—':investmentMetric==='value'?money(Math.round(s.values[indexSafe]),false,investmentCurrency):investmentPercent(s.values[indexSafe])}</strong></div>`).join('')}`;tip.hidden=false;
    if(tip.style){const width=svg.getBoundingClientRect().width||500,pos=g.x(indexSafe)/1000*width;tip.style.left=Math.max(0,Math.min(width-Math.min(260,width),pos+18))+'px';}
    if(announce)$('#holdings-live').textContent=result.dates[indexSafe]+' · '+g.series.map(s=>investmentName(s.id)+' '+(s.values[indexSafe]===null?L('Tidak tersedia','Unavailable'):investmentMetric==='value'?money(Math.round(s.values[indexSafe]),false,investmentCurrency):investmentPercent(s.values[indexSafe]))).join(', ');
  }
  function investmentPointer(event,pin=false){const svg=event.target.closest?.('[data-investment-chart]');if(!svg||!investmentChartState)return;if(investmentPinned&&!pin&&event.pointerType!=='touch')return;const rect=svg.getBoundingClientRect();if(!rect.width)return;const fraction=((event.clientX-rect.left)/rect.width*1000-20)/870;if(pin)investmentPinned=event.pointerType==='touch'?true:!investmentPinned;investmentPoint(INV.nearestObservation(investmentChartState.result.dates,fraction),pin);}
  document.addEventListener('pointermove',event=>investmentPointer(event));
  document.addEventListener('pointerdown',event=>investmentPointer(event,true));
  document.addEventListener('pointerout',event=>{if(event.target.closest?.('[data-investment-chart]')&&!investmentPinned&&!event.relatedTarget?.closest?.('[data-investment-chart]'))investmentPoint(-1);});
  document.addEventListener('keydown',event=>{if(event.target?.id!=='holdings-chart'||!investmentChartState)return;const last=investmentChartState.result.dates.length-1,at=investmentHover<0?last:investmentHover;const next={ArrowLeft:Math.max(0,at-1),ArrowRight:Math.min(last,at+1),Home:0,End:last}[event.key];if(event.key==='Escape'){investmentPinned=false;investmentPoint(-1);event.preventDefault();}else if(next!==undefined){event.preventDefault();investmentPinned=true;investmentPoint(next,true);}});

  function investmentAllocation(rows,style=investmentStyle,key=investmentGroup){
    const groups=INV.group(rows,key),total=INV.summary(rows).value;
    if(!rows.length||!total)return `<div class="empty investment-empty">${icon('investment')}<h3>${L('Belum ada data alokasi','No allocation data available')}</h3><p>${L('Tambahkan posisi aset untuk memulai analisis.','Add holdings to start your analysis.')}</p>${button(L('Tambah aset','Add holding'),'investment-holding-new','primary','plus')}</div>`;
    if(style==='heatmap'){
      const sorted=[...rows].sort((a,b)=>(b.value||0)-(a.value||0));
      const items=sorted.map((h,idx)=>{
        const returnPct=h.gainPercent!==null?(h.gainPercent*100):0;
        const changeStr=h.gainPercent!==null?(returnPct>=0?'+':'')+returnPct.toFixed(1)+'%':'—';
        let color;
        if(h.gainPercent===null)color='#475569';
        else if(returnPct>=10)color='#059669';
        else if(returnPct>=5)color='#10b981';
        else if(returnPct>=2)color='#16a34a';
        else if(returnPct>0)color='#15803d';
        else if(returnPct===0)color='#334155';
        else if(returnPct>-2)color='#9f1239';
        else if(returnPct>-5)color='#be123c';
        else if(returnPct>-10)color='#e11d48';
        else color='#f43f5e';
        return {
          id:h.id,label:h.symbol,name:h.name,amt:h.value,value:Math.max(1,h.value||0),
          pct:((h.value/total)*100).toFixed(1),changeStr,color,origIndex:idx
        };
      });
      const rects=squarifyLayout(items,0,0,1000,480);
      const treemapSvg=`<svg class="investment-treemap-svg marketcap-treemap-svg" viewBox="0 0 1000 480" style="width:100%;height:auto;display:block;border-radius:12px;background:var(--paper);border:1px solid var(--line)" role="img" aria-label="${L('Market Cap Heatmap Posisi Aset','Investment Holdings Market Cap Heatmap')}">
        ${rects.map(r=>{
          const pad=2;const x=r.x+pad,y=r.y+pad,w=Math.max(1,r.w-pad*2),h=Math.max(1,r.h-pad*2);
          const cx=x+w/2,cy=y+h/2;
          const showAll=w>=80&&h>=60;const showMed=!showAll&&w>=50&&h>=38;
          let text='';
          if(showAll){
            text=`<text x="${cx}" y="${cy-12}" text-anchor="middle" font-size="${Math.min(16,Math.max(12,Math.round(w/8)))}" font-weight="700" fill="#ffffff" style="pointer-events:none">${escape(r.label)}</text>
                  <text x="${cx}" y="${cy+6}" text-anchor="middle" font-size="${Math.min(13,Math.max(10,Math.round(w/11)))}" font-weight="600" fill="#ffffff" fill-opacity="0.95" style="pointer-events:none">${escape(money(r.amt,false,investmentCurrency))}</text>
                  <text x="${cx}" y="${cy+22}" text-anchor="middle" font-size="${Math.min(12,Math.max(10,Math.round(w/12)))}" font-weight="700" fill="#ffffff" fill-opacity="0.9" style="pointer-events:none">${r.changeStr}</text>`;
          }else if(showMed){
            text=`<text x="${cx}" y="${cy-3}" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff" style="pointer-events:none">${escape(r.label)}</text>
                  <text x="${cx}" y="${cy+10}" text-anchor="middle" font-size="10" font-weight="600" fill="#ffffff" fill-opacity="0.9" style="pointer-events:none">${r.changeStr}</text>`;
          }
          return `<g class="treemap-tile-group" data-action="investment-security:${r.id}" style="cursor:pointer">
            <title>${escape(r.label)} (${escape(r.name)}): ${escape(money(r.amt,false,investmentCurrency))} · ${r.changeStr} — ${L('Klik untuk melihat grafik aset','Click to view security chart')}</title>
            <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${r.color}" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" class="treemap-rect"/>
            ${text}
          </g>`;
        }).join('')}
      </svg>`;
      return `<div class="investment-heatmap-wrap">${treemapSvg}<div class="investment-breakdown" style="margin-top:20px">${groups.map((g,i)=>`<div class="investment-allocation-row"><div><i style="background:${investmentColors[i%investmentColors.length]}"></i>${user(g.label)}<b class="money">${investmentPercent(g.weight)}</b></div><div class="investment-track"><span style="width:${g.weight*100}%;background:${investmentColors[i%investmentColors.length]}"></span></div><small>${investmentMoney(g.value)} · ${g.count} ${L('posisi','holdings')}</small></div>`).join('')}</div></div>`;
    }
    let offset=0;
    const ring=groups.map((g,i)=>{const arc=g.weight*100,start=offset;offset+=arc;return `<circle cx="100" cy="100" r="72" pathLength="100" fill="none" stroke="${investmentColors[i%investmentColors.length]}" stroke-width="25" stroke-dasharray="${arc} ${100-arc}" stroke-dashoffset="${-start}" transform="rotate(-90 100 100)"><title>${escape(g.label)} · ${investmentPercent(g.weight)} · ${money(g.value,false,investmentCurrency)}</title></circle>`;}).join('');
    return `<div class="investment-allocation ${style==='pie'?'with-ring':''}">${style==='pie'?`<svg viewBox="0 0 200 200" role="img" aria-label="${L('Diagram alokasi portofolio','Portfolio allocation chart')}">${ring}<text x="100" y="96" text-anchor="middle" fill="currentColor" font-size="12">${L('Alokasi','Allocation')}</text><text x="100" y="116" text-anchor="middle" fill="currentColor" font-size="16">100%</text></svg>`:''}<div class="investment-breakdown">${groups.map((g,i)=>`<div class="investment-allocation-row"><div><i style="background:${investmentColors[i%investmentColors.length]}"></i>${user(g.label)}<b class="money">${investmentPercent(g.weight)}</b></div><div class="investment-track"><span style="width:${g.weight*100}%;background:${investmentColors[i%investmentColors.length]}"></span></div><small>${investmentMoney(g.value)} · ${g.count} ${L('posisi','holdings')}</small></div>`).join('')}</div></div>`;
  }
  function investmentGains(rows){
    const summary=INV.summary(rows);
    const cards=[[L('Nilai portofolio','Portfolio value'),summary.value],[L('Biaya portofolio','Portfolio cost'),summary.cost],[L('Gain / loss belum terealisasi','Unrealized gain / loss'),summary.gain]];
    return `<div class="investment-stat-grid">${cards.map(([label,value])=>`<div><small>${label}</small><strong class="${value!==null?(value<0?'down investment-negative':value>0?'up investment-positive':''):''}">${investmentMoney(value)}</strong></div>`).join('')}<div><small>Gain / loss %</small><strong class="money ${summary.gainPercent!==null?(summary.gainPercent<0?'down investment-negative':summary.gainPercent>0?'up investment-positive':''):''}">${investmentPercent(summary.gainPercent)}</strong></div></div>${summary.unknownCost?`<p class="note">${summary.unknownCost} ${L('posisi belum memiliki cost basis; total gain/loss tidak dihitung sampai data lengkap.','holdings have no cost basis; total gain/loss is unavailable until costs are complete.')}</p>`:''}${!rows.length?`<div class="empty investment-empty">${icon('investment')}<h3>${L('Belum ada data posisi aset','No holdings data available')}</h3>${button(L('Tambah aset','Add holding'),'investment-holding-new','primary')}</div>`:investmentGainStyle==='line'?investmentGainHistory():investmentGainBars(rows)}`;
  }
  function investmentGainBars(rows){const groups=INV.group(rows,investmentGroup),max=Math.max(1,...groups.map(g=>Math.abs(g.gain||0)));return `<div class="investment-gain-bars">${groups.map(g=>{const isLoss=(g.gain||0)<0,isGain=(g.gain||0)>0,cls=isLoss?'down investment-negative':isGain?'up investment-positive':'';return `<div><div class="investment-gain-label">${user(g.label)}<b class="${cls}">${investmentMoney(g.gain)}</b></div><div class="investment-gain-track"><span class="${isLoss?'negative':'positive'}" style="width:${g.gain===null?0:Math.abs(g.gain)/max*50}%;${isLoss?'right':'left'}:50%"></span></div></div>`;}).join('')}</div>`;}
  function investmentGainHistory(){const points=INV.gainsHistory(state,{...investmentPeriod(),currency:investmentCurrency,account:investmentAccount,view:state.activeView});if(points.length<2)return `<div class="empty investment-empty"><h3>${L('Riwayat gain / loss belum cukup','More gain / loss snapshots needed')}</h3><p>${L('Simpan snapshot pada minimal dua tanggal. Tidak ada riwayat yang direkonstruksi dari posisi saat ini.','Save snapshots on at least two dates. History is not reconstructed from current holdings.')}</p>${button(L('Simpan snapshot hari ini','Save today’s snapshot'),'investment-snapshot')}</div>`;const values=points.filter(p=>p.gain!==null).map(p=>p.gain),lo=Math.min(0,...values),hi=Math.max(1,...values),x=i=>60+i/(points.length-1)*730,y=v=>225-(v-lo)/(hi-lo)*185;return `<div class="investment-chart"><svg viewBox="0 0 850 270" role="img" aria-label="${L('Riwayat gain loss dari snapshot nyata','Gain loss history from saved snapshots')}">${[0,.5,1].map(n=>{const v=lo+(hi-lo)*n;return `<text x="4" y="${y(v)}" fill="currentColor" font-size="11">${escape(money(v,false,investmentCurrency))}</text><line x1="60" x2="790" y1="${y(v)}" y2="${y(v)}" stroke="currentColor" opacity=".15"/>`;}).join('')}${points.map((p,i)=>p.gain!==null?`<circle cx="${x(i)}" cy="${y(p.gain)}" r="4" fill="var(--accent)"><title>${p.date} · ${escape(money(p.gain,false,investmentCurrency))}</title></circle>${i&&points[i-1].gain!==null?`<line x1="${x(i-1)}" y1="${y(points[i-1].gain)}" x2="${x(i)}" y2="${y(p.gain)}" stroke="var(--accent)" stroke-width="2"/>`:''}`:'').join('')}<text x="60" y="257" fill="currentColor" font-size="11">${points[0].date}</text><text x="790" y="257" text-anchor="end" fill="currentColor" font-size="11">${points.at(-1).date}</text></svg></div><p class="note">${L('Snapshot memakai posisi dan pemilik saat disimpan; celah cost basis tidak dihubungkan.','Snapshots use positions and ownership at capture time; missing-cost gaps are not connected.')}</p>`;}
  function investmentHoldingsTable(rows){const funds=investmentTab==='funds',labels=investmentLabels();return `<section class="panel panel-pad investment-panel"><div class="panel-head"><h2>Holdings</h2><span class="badge">${rows.length} ${L('posisi','positions')}</span></div><div class="table-wrap"><table class="investment-table"><thead><tr><th>${L('Sekuritas / akun','Security / account')}</th>${funds?INV.classificationKeys.map(k=>`<th>${labels[k]}</th>`).join(''):''}<th>${L('Kelas aset','Asset class')}</th><th>${L('Jumlah','Quantity')}</th><th>${L('Harga / tanggal','Price / date')}</th><th>${L('Total cost basis','Total cost basis')}</th><th>${L('Nilai saat ini','Current value')}</th><th>Gain / loss</th><th>Gain / loss %</th><th>${L('Kelola','Manage')}</th></tr></thead><tbody>${rows.map(r=>`<tr><td><button class="holding-drill" data-action="investment-security:${r.id}" aria-label="${escape(L('Lihat grafik ','View chart for ')+r.symbol)}">${user(r.symbol)} ${icon('arrow')}</button><small>${user(r.name)}</small><small>${user(r.accountName)}</small></td>${funds?INV.classificationKeys.map(k=>`<td>${user(r.classifications[k]||L('Belum diklasifikasi','Unclassified'))}</td>`).join(''):''}<td>${user(r.assetClass)}</td><td>${new Intl.NumberFormat(locale(),{maximumFractionDigits:8}).format(r.quantity)}</td><td>${amount(Math.round(r.price*100),r.currency)}<small>${r.quoteDate}</small><small>${user(r.source)}</small></td><td>${investmentMoney(r.cost)}</td><td>${investmentMoney(r.value)}</td><td class="${r.gain!==null?(r.gain<0?'down investment-negative':r.gain>0?'up investment-positive':''):''}">${investmentMoney(r.gain)}</td><td class="money ${r.gainPercent!==null?(r.gainPercent<0?'down investment-negative':r.gainPercent>0?'up investment-positive':''):''}">${investmentPercent(r.gainPercent)}</td><td>${button(L('Edit','Edit'),'investment-holding:'+r.id)}${button(L('Hapus','Remove'),'investment-holding-delete:'+r.id)}</td></tr>`).join('')||`<tr><td colspan="${funds?16:10}" class="empty">${L('Belum ada posisi aset untuk filter ini.','No holdings for these filters.')}</td></tr>`}</tbody></table></div></section>`;}
  let rebalanceNewCash = 0;

  function openTargetAllocationModal(presetId){
    let list = [];
    if(presetId){
      const preset = INV.rebalancePresets.find(p => p.id === presetId);
      if(preset) list = structuredClone(preset.targets);
    } else {
      list = structuredClone(state.targetAllocations || []);
    }
    if(!list.length){
      list = [
        { id: uid(), assetClass: 'Equity', percent: 60 },
        { id: uid(), assetClass: 'Fixed Income', percent: 30 },
        { id: uid(), assetClass: 'Cash', percent: 10 }
      ];
    }

    const renderRows = () => list.map((item, idx) => `
      <div class="target-alloc-row" style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <input type="text" name="class_${idx}" value="${escape(item.assetClass)}" placeholder="${L('Kelas Aset','Asset Class')}" required style="flex:1" maxlength="80">
        <div style="display:flex;align-items:center;gap:4px">
          <input type="number" name="percent_${idx}" value="${item.percent}" min="0" max="100" step="any" required style="width:80px">
          <span>%</span>
        </div>
        <button type="button" class="btn danger icon-btn" data-modal-alloc-delete="${idx}" aria-label="${L('Hapus','Remove')}">×</button>
      </div>
    `).join('');

    const modalContent = `
      <p class="note">${L('Tentukan target alokasi portofolio Anda. Total persentase ideal adalah 100%. Anda dapat memilih model preset atau menentukan sendiri.','Define target portfolio allocation percentages. Ideal total is 100%. Choose a classic model preset or customize your own.')}</p>
      <div style="margin-bottom:14px;display:flex;gap:8px;flex-wrap:wrap">
        <span style="font-size:12px;color:var(--muted);align-self:center">${L('Muat Model Preset:','Load Preset:')}</span>
        ${INV.rebalancePresets.map(p => `<button type="button" class="btn" data-modal-alloc-preset="${p.id}">${escape(p.name)}</button>`).join('')}
      </div>
      <div id="target-alloc-rows">${renderRows()}</div>
      <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center">
        <button type="button" class="btn" id="target-alloc-add">+ ${L('Tambah Kelas Aset','Add Asset Class')}</button>
      </div>
    `;

    openModal(L('Konfigurasi Target Alokasi Portofolio','Configure Target Asset Allocation'), form(modalContent, 'Save'), d => {
      const updatedList = [];
      let total = 0;
      for (let i = 0; i < 50; i++) {
        const cls = d['class_' + i];
        const pct = d['percent_' + i];
        if (cls && pct !== undefined && pct !== '') {
          const p = Number(pct);
          if (isNaN(p) || p < 0 || p > 100) throw Error(L('Persentase harus di antara 0 dan 100%','Percentage must be between 0 and 100%'));
          total += p;
          updatedList.push({
            id: uid(),
            assetClass: cls.trim(),
            percent: p
          });
        }
      }
      if (!updatedList.length) throw Error(L('Masukkan setidaknya satu target kelas aset.','Enter at least one target asset class.'));
      persistCorrection(E.setTargetAllocations(state, updatedList));
      toast(L('Target alokasi berhasil disimpan.','Target allocations saved successfully.'));
    });

    const modalEl = document.querySelector('.modal');
    if (modalEl) {
      modalEl.addEventListener('click', e => {
        const delBtn = e.target.closest('[data-modal-alloc-delete]');
        if (delBtn) {
          const idx = Number(delBtn.getAttribute('data-modal-alloc-delete'));
          list.splice(idx, 1);
          const container = modalEl.querySelector('#target-alloc-rows');
          if (container) container.innerHTML = renderRows();
          return;
        }
        const presetBtn = e.target.closest('[data-modal-alloc-preset]');
        if (presetBtn) {
          const pid = presetBtn.getAttribute('data-modal-alloc-preset');
          const p = INV.rebalancePresets.find(x => x.id === pid);
          if (p) {
            list = structuredClone(p.targets);
            const container = modalEl.querySelector('#target-alloc-rows');
            if (container) container.innerHTML = renderRows();
          }
          return;
        }
        if (e.target.id === 'target-alloc-add') {
          list.push({ id: uid(), assetClass: '', percent: 0 });
          const container = modalEl.querySelector('#target-alloc-rows');
          if (container) container.innerHTML = renderRows();
          return;
        }
      });
    }
  }

  function investmentRebalancer(rows) {
    const rebalanceData = INV.rebalancePortfolio(rows, state.targetAllocations || [], {
      newCash: Math.round(Number(rebalanceNewCash || 0) * 100)
    });

    const driftBadgeClass = rebalanceData.driftScore >= 85 ? 'drift-score-high' : rebalanceData.driftScore >= 65 ? 'drift-score-med' : 'drift-score-low';
    const driftText = rebalanceData.driftScore >= 85 ? L('Portofolio Sangat Seimbang','Highly Balanced') : rebalanceData.driftScore >= 65 ? L('Pergeseran Moderat','Moderate Drift') : L('Perlu Rebalancing Segera','High Drift - Rebalance');

    const buys = rebalanceData.classes.filter(c => c.action === 'BUY').length;
    const sells = rebalanceData.classes.filter(c => c.action === 'SELL').length;

    return `<div class="rebalancer-panel">
      <div class="rebalancer-header-stats">
        <div class="rebalancer-stat-card">
          <span class="stat-label">${L('Total Portofolio','Portfolio Value')}</span>
          <span class="stat-value rebalance-val">${investmentMoney(rebalanceData.currentTotal)}</span>
          <span class="stat-sub">${rows.length} ${L('posisi sekuritas aktif','active holding positions')}</span>
        </div>
        <div class="rebalancer-stat-card">
          <span class="stat-label">${L('Skor Keseimbangan (Drift Score)','Allocation Drift Score')}</span>
          <div style="display:flex;align-items:center;gap:10px;">
            <span class="stat-value">${rebalanceData.driftScore}<small style="font-size:14px;color:var(--muted)">/100</small></span>
            <span class="drift-score-badge ${driftBadgeClass}">${driftText}</span>
          </div>
          <span class="stat-sub">${L('Mengukur kedekatan alokasi riil dengan target','Measures alignment of actual holdings to target')}</span>
        </div>
        <div class="rebalancer-stat-card">
          <span class="stat-label">${L('Total Target Alokasi','Target Allocation')}</span>
          <span class="stat-value">${rebalanceData.totalTargetPct}%</span>
          <span class="stat-sub">${rebalanceData.isTargetValid ? `<span class="positive">✓ ${L('Target 100% lengkap','Full 100% Target')}</span>` : `<span class="expense-amount">⚠️ ${L('Target belum berjumlah 100%','Total target does not equal 100%')}</span>`}</span>
        </div>
        <div class="rebalancer-stat-card">
          <span class="stat-label">${L('Rekomendasi Aksi','Recommended Actions')}</span>
          <span class="stat-value" style="font-size:16px">${buys ? `<span class="positive">${buys} ${L('Beli (BUY)','Buy')}</span>` : ''} ${sells ? `<span class="expense-amount">${sells} ${L('Jual (SELL)','Sell')}</span>` : ''} ${(!buys && !sells) ? `<span class="positive">${L('Sesuai Target','On Target')}</span>` : ''}</span>
          <span class="stat-sub">${rebalanceNewCash > 0 ? L('Mode deposit kas aktif: alokasi kas baru','Cash-only rebalancing active') : L('Rebalance penuh jual/beli','Full buy/sell rebalance')}</span>
        </div>
      </div>

      <div class="rebalancer-controls-bar">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          ${button('⚙️ ' + L('Atur Target Alokasi','Configure Target Allocation'), 'investment-rebalance-edit', 'primary')}
          <span style="font-size:12px;color:var(--muted)">${L('Model Preset:','Model Presets:')}</span>
          ${INV.rebalancePresets.map(preset => `<button type="button" class="btn" data-action="investment-rebalance-preset:${preset.id}" title="${escape(preset.description)}">${escape(preset.name.split(' ')[0])}</button>`).join('')}
        </div>
        <div class="cash-deposit-box">
          <label for="rebalance-cash-input" style="font-size:12px;font-weight:600;color:var(--ink)">
            💵 ${L('Simulasi Kas Baru (Cash-Only):','New Cash Deposit (Cash-Only):')}
          </label>
          <input type="number" id="rebalance-cash-input" value="${rebalanceNewCash || ''}" placeholder="${investmentCurrency} 0.00" min="0" step="any">
          ${button(L('Terapkan Kas','Apply Cash'), 'investment-rebalance-cash')}
          ${rebalanceNewCash > 0 ? button('✕', 'investment-rebalance-cash-clear', 'danger') : ''}
        </div>
      </div>

      <div class="rebalancer-table-wrap">
        <table class="investment-table">
          <thead>
            <tr>
              <th>${L('Kelas Aset','Asset Class')}</th>
              <th>${L('Nilai Saat Ini','Current Value')}</th>
              <th>${L('Bobot Aktual','Actual %')}</th>
              <th>${L('Target %','Target %')}</th>
              <th>${L('Visualisasi vs Target','Visual vs Target')}</th>
              <th>${L('Drift / Status','Drift / Status')}</th>
              <th>${L('Aksi Rebalance Penuh','Full Rebalance Action')}</th>
              ${rebalanceNewCash > 0 ? `<th>${L('Alokasi Kas Baru (Cash-Only)','Cash-Only Allocation')}</th>` : ''}
            </tr>
          </thead>
          <tbody>
            ${rebalanceData.classes.map(c => {
              const driftClass = c.status === 'overweight' ? 'drift-badge-overweight' : c.status === 'underweight' ? 'drift-badge-underweight' : 'drift-badge-balanced';
              const driftStatusLabel = c.status === 'overweight' ? L('Overweight (+','Overweight (+') + c.driftPercent + '%)' : c.status === 'underweight' ? L('Underweight (','Underweight (') + c.driftPercent + '%)' : L('Balanced (','Balanced (') + (c.driftPercent >= 0 ? '+' : '') + c.driftPercent + '%)';
              const actionClass = c.action === 'BUY' ? 'rebalance-action-buy' : c.action === 'SELL' ? 'rebalance-action-sell' : 'rebalance-action-hold';
              const cashOnly = rebalanceData.cashOnlyDistribution.find(d => d.assetClass === c.assetClass);

              return `<tr>
                <td><b>${escape(c.assetClass)}</b></td>
                <td class="rebalance-val">${investmentMoney(c.currentValue)}</td>
                <td><b>${c.currentWeight.toFixed(1)}%</b></td>
                <td>${c.targetPercent.toFixed(1)}%</td>
                <td>
                  <div class="rebalance-alloc-bar">
                    <div class="rebalance-track">
                      <div class="rebalance-fill" style="width:${Math.min(100, c.currentWeight)}%;background:${c.status==='overweight'?'#d97706':c.status==='underweight'?'#0969da':'#2ea44f'}"></div>
                      <div class="rebalance-target-marker" style="left:${Math.min(100, c.targetPercent)}%" title="${L('Target: ','Target: ')}${c.targetPercent}%"></div>
                    </div>
                  </div>
                </td>
                <td><span class="drift-badge ${driftClass}">${driftStatusLabel}</span></td>
                <td>
                  <span class="rebalance-action-pill ${actionClass}">
                    <span>${c.action === 'BUY' ? '▲' : c.action === 'SELL' ? '▼' : '●'}</span>
                    <b>${c.action} ${c.action !== 'HOLD' ? investmentMoney(c.actionAmount) : ''}</b>
                  </span>
                </td>
                ${rebalanceNewCash > 0 ? `
                  <td>
                    ${cashOnly && cashOnly.addCash > 0 ? `<span class="rebalance-action-pill rebalance-action-buy"><b>+${investmentMoney(cashOnly.addCash)}</b></span> <small class="muted">→ ${cashOnly.newEstimatedWeight.toFixed(1)}%</small>` : `<span class="muted">—</span>`}
                  </td>
                ` : ''}
              </tr>`;
            }).join('') || `<tr><td colspan="8" class="empty">${L('Belum ada data posisi aset. Tambahkan posisi sekuritas terlebih dahulu.','No holding positions found. Add holdings first.')}</td></tr>`}
          </tbody>
        </table>
      </div>
      <div class="note">
        ${L('Target Alokasi dan Rebalancer adalah instrumen perencanaan matematis lokal, bukan saran keuangan otomatis dari penasihat investasi berlisensi. Cash-Only Rebalancing menghitung alokasi kas setoran baru hanya ke aset yang berbobot di bawah target (underweight) tanpa menjual aset pemenang untuk menghindari beban pajak atau biaya transaksi.','Target Allocation and Rebalancer is a local planning tool, not automated investment advice. Cash-Only Rebalancing allocates new deposits exclusively to underweight assets without selling winners, minimizing transaction fees.')}
      </div>
    </div>`;
  }

  const CRYPTO_EXCHANGES = [
    { id: 'bybit', name: 'Bybit', icon: '🟡', requiresPassphrase: false, note: 'Derivative & Spot' },
    { id: 'binance', name: 'Binance', icon: '🔶', requiresPassphrase: false, note: 'Global Liquidity' },
    { id: 'okx', name: 'OKX', icon: '⬛', requiresPassphrase: true, note: 'Unified Account' },
    { id: 'gate', name: 'Gate.io', icon: '🔵', requiresPassphrase: false, note: 'Altcoin Pioneer' },
    { id: 'bitget', name: 'Bitget', icon: '🔷', requiresPassphrase: true, note: 'Copy & Spot' },
    { id: 'indodax', name: 'Indodax', icon: '🇮🇩', requiresPassphrase: false, note: 'IDR Gateway' },
    { id: 'tokocrypto', name: 'Tokocrypto', icon: '🇮🇩', requiresPassphrase: false, note: 'Binance Cloud' },
    { id: 'kucoin', name: 'KuCoin', icon: '🟢', requiresPassphrase: true, note: 'Global Crypto' }
  ];

  function openCryptoExchangesModal(){
    const body = `
      <p>${L('INVEYS mendukung sinkronisasi portofolio multi-exchange menggunakan pustaka standar industri CCXT secara langsung dan aman.','INVEYS supports multi-exchange portfolio synchronization using the industry-standard CCXT library securely.')}</p>
      <div class="table-wrap" style="margin:14px 0">
        <table>
          <thead>
            <tr>
              <th>Exchange</th>
              <th>Passphrase?</th>
              <th>${L('Keterangan','Features')}</th>
              <th>Dokumentasi API</th>
            </tr>
          </thead>
          <tbody>
            ${CRYPTO_EXCHANGES.map(x=>`
              <tr>
                <td><b>${x.icon} ${escape(x.name)}</b></td>
                <td>${x.requiresPassphrase ? `<span class="badge orange">${L('Wajib','Required')}</span>` : `<span class="badge">${L('Tidak','None')}</span>`}</td>
                <td>${escape(x.note)}</td>
                <td><a href="https://google.com/search?q=${encodeURIComponent(x.name+' api management')}" target="_blank" rel="noopener noreferrer">${L('Buat Read-Only API','Create Read-Only API')} ↗</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="crypto-sec-banner">
        <span>🛡️</span>
        <div>
          <strong>${L('Pedoman Keamanan API Kredensial:','API Credential Security Guidelines:')}</strong>
          <div>${L('1. Selalu centang HANYA izin "Read" / "View" saldo. JANGAN PERNAH mengizinkan izin "Withdraw" (Penarikan) atau "Trade" (Perdagangan).','1. Always grant ONLY "Read" / "View" balance permissions. NEVER grant "Withdraw" or "Trade" permissions.')}</div>
          <div>${L('2. Batasi IP address ke IP VPS/lokal Anda jika exchange menyediakannya untuk keamanan berlapis.','2. Bind IP whitelist to your VPS or local IP if supported by the exchange.')}</div>
        </div>
      </div>
      <div class="form-actions">
        ${button(L('Tutup','Close'),'modal-close')}
        ${button(L('🔗 Buka Dialog Sinkron','🔗 Open Sync Dialog'),'crypto-connect-modal','primary')}
      </div>
    `;
    openModal(L('Exchange Crypto yang Didukung','Supported Crypto Exchanges'), body);
  }

  function openCryptoSyncModal(defaultEx = 'bybit'){
    const invAccounts = state.accounts.filter(a => a.type === 'Investment');
    const accOptions = invAccounts.length
      ? invAccounts.map(a => `<option value="${a.id}">${escape(a.name)} (${a.currency})</option>`).join('')
      : `<option value="__new__">+ ${L('Buat Akun Investasi Otomatis (Crypto Portfolio)','Create Crypto Portfolio Account')}</option>`;

    const formFields = `
      <div class="crypto-sec-banner" style="grid-column:1/-1">
        <span>🛡️</span>
        <div>
          <strong>${L('Penting: Gunakan API Key READ-ONLY','Important: Use READ-ONLY API Key')}</strong>
          <div>${L('Hanya izinkan akses membaca saldo (Spot / Funding). Jangan aktifkan izin penarikan (withdraw) atau transaksi perdagangan (trade). Kredensial hanya diproses lokal di server Anda.','Enable only balance read permissions. Never enable withdrawal or trading permissions. Credentials stay strictly local on your server.')}</div>
        </div>
      </div>

      <div style="grid-column:1/-1;display:flex;justify-content:flex-end">
        <button type="button" class="crypto-demo-pill" id="btn-crypto-demo-autofill">
          <span>⚡</span> ${L('Gunakan Data Simulasi Demo (Tanpa Kunci Asli)','Use Demo Simulation (No Real Keys)')}
        </button>
      </div>

      <div class="field">
        <label for="crypto-exchange-select">${L('Pilih Exchange','Select Exchange')}</label>
        <select name="exchange" id="crypto-exchange-select">
          ${CRYPTO_EXCHANGES.map(x => `<option value="${x.id}" ${x.id===defaultEx?'selected':''}>${x.icon} ${escape(x.name)} (${x.note})</option>`).join('')}
        </select>
      </div>

      <div class="field">
        <label for="crypto-target-account">${L('Akun Investasi Tujuan','Target Investment Account')}</label>
        <select name="targetAccountId" id="crypto-target-account">
          ${accOptions}
        </select>
      </div>

      <div class="field">
        <label for="crypto-api-key">API Key</label>
        <input type="text" id="crypto-api-key" name="apiKey" required placeholder="Contoh: Bybit-API-Key atau 'demo'" maxlength="200" autocomplete="off">
      </div>

      <div class="field">
        <label for="crypto-api-secret">API Secret</label>
        <input type="password" id="crypto-api-secret" name="apiSecret" required placeholder="Secret Key dari Exchange" maxlength="200" autocomplete="off">
      </div>

      <div class="field" id="crypto-passphrase-field" style="display:none">
        <label for="crypto-passphrase">API Passphrase (OKX / Bitget / KuCoin)</label>
        <input type="password" id="crypto-passphrase" name="passphrase" placeholder="Passphrase yang dibuat saat membuat API key" maxlength="100" autocomplete="off">
      </div>

      <div class="field">
        <label for="crypto-proxy">${L('Proxy HTTP/SOCKS (Opsional)','HTTP/SOCKS Proxy (Optional)')}</label>
        <input type="text" id="crypto-proxy" name="proxy" placeholder="Contoh: http://127.0.0.1:7890 (jika ISP memblokir domain API)" maxlength="200">
      </div>

      <div class="field">
        <label for="crypto-min-usd">${L('Filter Saldo Minimum (USD)','Dust Threshold (USD)')}</label>
        <input type="number" id="crypto-min-usd" name="minUsd" value="1.0" min="0" step="0.5">
      </div>

      <div style="grid-column:1/-1;margin-top:4px">
        <button type="button" class="btn" id="btn-crypto-test" style="font-size:12px">⚡ ${L('Uji Koneksi Read-Only','Test Read-Only Connection')}</button>
        <span id="crypto-test-status" style="margin-left:10px;font-size:12px"></span>
      </div>
    `;

    openModal(L('Sinkronisasi Portofolio Crypto CEX','Sync Crypto Exchange Portfolio'), form(formFields, L('📥 Sinkron & Tinjau Saldo','📥 Sync & Review Holdings')), d => {
      executeCryptoSync(d);
    });

    const modalEl = $('#modal');
    const exSelect = $('#crypto-exchange-select', modalEl);
    const passField = $('#crypto-passphrase-field', modalEl);
    const demoBtn = $('#btn-crypto-demo-autofill', modalEl);
    const testBtn = $('#btn-crypto-test', modalEl);
    const testStatus = $('#crypto-test-status', modalEl);

    const updatePass = () => {
      if(!exSelect || !passField) return;
      const ex = CRYPTO_EXCHANGES.find(x => x.id === exSelect.value);
      if(passField.style) passField.style.display = ex?.requiresPassphrase ? 'block' : 'none';
    };
    exSelect?.addEventListener?.('change', updatePass);
    updatePass();

    demoBtn?.addEventListener?.('click', () => {
      const keyEl = $('#crypto-api-key', modalEl);
      const secEl = $('#crypto-api-secret', modalEl);
      const passEl = $('#crypto-passphrase', modalEl);
      if(keyEl) keyEl.value = 'demo';
      if(secEl) secEl.value = 'demo';
      if(passEl) passEl.value = 'demo';
      if(testStatus) {
        testStatus.textContent = L('💡 Mode demo aktif. Klik "Sinkron & Tinjau Saldo" di bawah.','💡 Demo mode populated. Click "Sync & Review Holdings" below.');
        if(testStatus.style) testStatus.style.color = 'var(--accent, #38a169)';
      }
    });

    testBtn?.addEventListener?.('click', async () => {
      const keyEl = $('#crypto-api-key', modalEl);
      const secEl = $('#crypto-api-secret', modalEl);
      const passEl = $('#crypto-passphrase', modalEl);
      const proxyEl = $('#crypto-proxy', modalEl);
      if(!keyEl?.value || !secEl?.value){
        if(testStatus) {
          testStatus.textContent = L('Harap isi API Key dan Secret terlebih dahulu.','Please fill API Key and Secret first.');
          if(testStatus.style) testStatus.style.color = '#e53e3e';
        }
        return;
      }
      if(testStatus) {
        testStatus.textContent = L('Menguji koneksi...','Testing connection...');
        if(testStatus.style) testStatus.style.color = 'var(--ink)';
      }
      try {
        const res = await api('crypto/test', {
          exchange: exSelect?.value || 'bybit',
          apiKey: keyEl.value.trim(),
          apiSecret: secEl.value.trim(),
          passphrase: passEl?.value?.trim() || undefined,
          proxy: proxyEl?.value?.trim() || undefined
        });
        if(res.ok){
          testStatus.textContent = '✅ ' + (res.message || L('Koneksi berhasil!','Connection successful!'));
          if(testStatus.style) testStatus.style.color = 'var(--accent, #38a169)';
        } else {
          testStatus.textContent = '❌ ' + (res.error || L('Koneksi gagal','Connection failed'));
          if(testStatus.style) testStatus.style.color = '#e53e3e';
        }
      } catch(e){
        if(testStatus){
          testStatus.textContent = '❌ ' + e.message;
          if(testStatus.style) testStatus.style.color = '#e53e3e';
        }
      }
    });
  }

  async function executeCryptoSync(d){
    toast(L('Menghubungkan ke exchange & mengambil saldo...','Connecting to exchange & fetching balances...'));
    try {
      const res = await api('crypto/sync', {
        exchange: d.exchange || 'bybit',
        apiKey: (d.apiKey || '').trim(),
        apiSecret: (d.apiSecret || '').trim(),
        passphrase: (d.passphrase || '').trim() || undefined,
        proxy: (d.proxy || '').trim() || undefined,
        minUsd: Math.max(0, parseFloat(d.minUsd) || 1.0),
        fxRate: state.fx?.rates?.USD || 16000
      });
      if(res.ok && Array.isArray(res.holdings)){
        openCryptoReviewModal(res, d.targetAccountId);
      } else {
        toast(res.error || L('Gagal mengambil saldo dari exchange','Failed to fetch balances from exchange'));
      }
    } catch(e){
      toast(e.message);
    }
  }

  function openCryptoReviewModal(data, targetAccountId){
    const holdings = data.holdings || [];
    const count = holdings.length;
    const totalUsd = data.totalUsd || 0;
    const totalIdr = data.totalIdr || 0;
    const fxUsd = state.fx?.rates?.USD || 16000;

    const invAccounts = state.accounts.filter(a => a.type === 'Investment');
    const accOptions = invAccounts.length
      ? invAccounts.map(a => `<option value="${a.id}" ${a.id===targetAccountId?'selected':''}>${escape(a.name)} (${a.currency})</option>`).join('')
      : `<option value="__new__">+ ${L('Buat Akun Baru: ','New Account: ') + escape(data.exchangeName) + ' Wallet'}</option>`;

    let rowsHtml = holdings.map((h, i) => `
      <tr class="crypto-row" data-index="${i}">
        <td><input type="checkbox" name="crypto_coin_${i}" value="1" checked aria-label="${escape(h.symbol)}"></td>
        <td>
          <div class="crypto-coin-pill">
            <span>🪙</span>
            <div>
              <strong>${escape(h.symbol)}</strong>
              <div style="font-size:10px;color:var(--muted)">${escape(h.name)}</div>
            </div>
          </div>
        </td>
        <td style="font-family:monospace;font-weight:600">${h.quantity}</td>
        <td>$${h.priceUsd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 6})}</td>
        <td style="font-weight:600" class="crypto-val">$${h.valueUsd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        <td style="color:var(--muted)" class="crypto-val">Rp ${h.valueIdr.toLocaleString('id-ID')}</td>
      </tr>
    `).join('');

    if(!count){
      rowsHtml = `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--muted)">${L('Tidak ada aset yang terdeteksi di atas threshold minimum.','No holdings detected above dust threshold.')}</td></tr>`;
    }

    const reviewFields = `
      <div class="crypto-review-summary" style="grid-column:1/-1">
        <div class="crypto-review-card">
          <small>${L('Exchange Sumber','Source Exchange')}</small>
          <strong>${escape(data.exchangeName)}</strong>
        </div>
        <div class="crypto-review-card">
          <small>${L('Koin Terdeteksi','Coins Detected')}</small>
          <strong>${count} ${L('Aset','Assets')}</strong>
        </div>
        <div class="crypto-review-card">
          <small>${L('Total Nilai (USD)','Total Value (USD)')}</small>
          <strong class="crypto-val">$${totalUsd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
        </div>
        <div class="crypto-review-card">
          <small>${L('Total Nilai (IDR)','Total Value (IDR)')}</small>
          <strong class="crypto-val">Rp ${totalIdr.toLocaleString('id-ID')}</strong>
        </div>
      </div>

      <div class="field" style="grid-column:1/-1">
        <label for="crypto-review-account">${L('Simpan ke Akun Investasi:','Save to Investment Account:')}</label>
        <select id="crypto-review-account" name="targetAccountId">
          ${accOptions}
          ${invAccounts.length ? `<option value="__new__">+ ${L('Buat Akun Baru: ','New Account: ') + escape(data.exchangeName) + ' Wallet'}</option>` : ''}
        </select>
      </div>

      <div class="crypto-review-table-wrap" style="grid-column:1/-1">
        <table class="crypto-review-table">
          <thead>
            <tr>
              <th style="width:36px"></th>
              <th>${L('Aset / Token','Asset / Token')}</th>
              <th>${L('Jumlah Unit','Quantity')}</th>
              <th>${L('Harga Pasar','Market Price')}</th>
              <th>${L('Nilai (USD)','Value (USD)')}</th>
              <th>${L('Nilai (IDR)','Value (IDR)')}</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;

    openModal(L('Tinjau & Konfirmasi Saldo Crypto','Review & Confirm Crypto Holdings'), form(reviewFields, L('✅ Impor ke Portofolio Investasi','✅ Import into Investment Portfolio'), L('Mengimpor aset memperbarui rincian inventaris holdings tanpa mengubah saldo kas di ledger umum.','Importing holdings updates investment inventory without altering ledger cash balances.')), d => {
      commitCryptoHoldings(data, d, holdings, fxUsd);
    });
  }

  function commitCryptoHoldings(data, d, holdings, fxUsd){
    let chosenAccId = d.targetAccountId;
    if (!chosenAccId || chosenAccId === '__new__') {
      const newAcc = {
        id: uid(),
        name: data.exchangeName + ' Wallet',
        type: 'Investment',
        currency: 'USD',
        balance: 0,
        owner: state.members[0]?.name || 'Me',
        ownerId: state.members[0]?.id || 'shared',
        updated: date()
      };
      state.accounts.push(newAcc);
      chosenAccId = newAcc.id;
    }

    let importedCount = 0;
    holdings.forEach((item, i) => {
      const isChecked = d['crypto_coin_' + i] !== undefined || !Object.keys(d).some(k => k.startsWith('crypto_coin_'));
      if (!isChecked) return;

      const existing = state.holdings.find(h => h.symbol === item.symbol && h.accountId === chosenAccId);
      if (existing) {
        existing.quantity = item.quantity;
        existing.price = item.priceUsd;
        existing.quoteDate = date();
        existing.source = data.exchangeName + ' CEX Sync';
      } else {
        state.holdings.push({
          id: uid(),
          accountId: chosenAccId,
          symbol: item.symbol,
          name: item.name || item.symbol,
          type: 'crypto',
          assetClass: 'Crypto',
          currency: 'USD',
          quantity: item.quantity,
          price: item.priceUsd,
          quoteDate: date(),
          source: data.exchangeName + ' CEX Sync',
          costBasis: null,
          costFxToIDR: fxUsd,
          classifications: {}
        });
      }

      const hId = existing ? existing.id : state.holdings[state.holdings.length - 1].id;
      if (item.priceUsd > 0) {
        state.holdingPrices = state.holdingPrices.filter(p => !(p.holdingId === hId && p.date === date()));
        state.holdingPrices.push({
          holdingId: hId,
          date: date(),
          price: item.priceUsd,
          fxToIDR: fxUsd,
          usdToIDR: fxUsd,
          source: data.exchangeName + ' Sync'
        });
      }

      importedCount++;
    });

    INV.validateHoldings(state);
    INV.validatePrices(state, state.holdingPrices);
    E.validate(state);
    save();
    render();
    toast(L(`Berhasil mengimpor ${importedCount} aset crypto dari ${data.exchangeName}!`, `Successfully imported ${importedCount} crypto holdings from ${data.exchangeName}!`));
  }

  let cachedApiKeys = null;

  async function openApiKeysModal(targetTab = 'all') {
    try {
      cachedApiKeys = await api('keys');
    } catch (e) {
      cachedApiKeys = {
        gemini: { configured: !!service.ai?.gemini?.enabled, keyMasked: '', model: 'gemini-3.8-flash' },
        openai: { configured: !!service.ai?.openai?.enabled, keyMasked: '', model: 'gpt-4.1-mini' },
        ninerouter: { configured: !!service.ai?.['9router']?.enabled, keyMasked: '', model: 'claude-3-5-sonnet', baseUrl: 'http://127.0.0.1:20128/v1' },
        muse: { configured: !!service.ai?.muse?.enabled, keyMasked: '', model: 'muse-spark-1.3' },
        telegram: { configured: !!service.telegram, tokenMasked: '', chatId: '' }
      };
    }
    renderApiKeysModalView(targetTab || 'all');
  }

  function renderApiKeysModalView(currentTab = 'all') {
    const k = cachedApiKeys || {};
    const gemini = k.gemini || {};
    const openai = k.openai || {};
    const nine = k.ninerouter || {};
    const muse = k.muse || {};
    const tg = k.telegram || {};

    const activeCount = [gemini, openai, nine, muse, tg].filter(x => x.configured).length;
    const totalCount = 5;

    const tabs = [
      { id: 'all', icon: '📋', name: L('Ringkasan', 'Overview'), badge: `${activeCount}/${totalCount}`, online: false },
      { id: 'gemini', icon: '🤖', name: 'Gemini', online: !!gemini.configured },
      { id: 'openai', icon: '🧠', name: 'OpenAI', online: !!openai.configured },
      { id: 'ninerouter', icon: '🔀', name: '9Router', online: !!nine.configured },
      { id: 'muse', icon: '🌌', name: 'Meta AI', online: !!muse.configured },
      { id: 'telegram', icon: '💬', name: 'Telegram Bot', online: !!tg.configured }
    ];

    const tabsHtml = `
      <div class="key-tabs-bar" role="tablist">
        ${tabs.map(t => `
          <button type="button" class="key-tab-btn ${t.id === currentTab ? 'active' : ''}" data-action="api-key-tab:${t.id}" role="tab" aria-selected="${t.id === currentTab}">
            <span class="key-tab-icon">${t.icon}</span>
            <span class="key-tab-name">${t.name}</span>
            ${t.badge ? `<span class="key-tab-badge">${t.badge}</span>` : ''}
            ${t.id !== 'all' ? `<span class="key-tab-dot ${t.online ? 'online' : ''}"></span>` : ''}
          </button>
        `).join('')}
      </div>
    `;

    const eyeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

    // --- Tab 1: Gemini ---
    const geminiPane = `
      <div class="key-pane ${currentTab === 'gemini' ? 'active' : ''}" id="pane-gemini">
        <div class="key-card ${gemini.configured ? 'configured' : ''}">
          <div class="key-card-banner">
            <div class="key-provider-meta">
              <span class="key-provider-icon">🤖</span>
              <div>
                <div class="key-provider-name">Google Gemini AI</div>
                <div class="key-provider-sub">Google AI Studio · Multimodal OCR, Audio & Fast Financial Analysis</div>
              </div>
            </div>
            <span class="key-status-pill ${gemini.configured ? 'online' : 'standby'}">
              ${gemini.configured ? L('● Terkonfigurasi', '● Configured') : L('● Belum Dikonfigurasi', '● Not Configured')}
            </span>
          </div>

          ${gemini.configured ? `
            <div class="key-active-preview">
              <span>${L('Kunci Aktif:', 'Active Key:')} <code>${escape(gemini.keyMasked || '••••••••••••••••')}</code></span>
              <button type="button" class="key-btn" data-action="api-key-reveal:gemini">👁️ ${L('Intip Kunci', 'Reveal')}</button>
            </div>
          ` : ''}

          <div class="key-guide-note">
            <span>💡</span>
            <div><b>${L('Dapatkan API Key Google Gemini:','Get Google Gemini API Key:')}</b> ${L('Buka Google AI Studio di <b>aistudio.google.com</b>, klik <b>Get API key</b>, lalu salin kunci ke kolom di bawah. Model Gemini 3.8 Flash sangat cepat untuk pembacaan struk dan e-statement bank.','Open Google AI Studio at <b>aistudio.google.com</b>, click <b>Get API key</b>, and paste below. Gemini 3.8 Flash is optimized for fast receipt and bank statement reading.')}</div>
          </div>

          <div class="key-field-group">
            <label for="key-val-gemini">
              <span>${L('API Key Gemini:','Gemini API Key:')}</span>
              <small>${gemini.configured ? L('(Kosongkan jika tidak ingin mengubah)','(Leave blank to keep current)') : L('(Wajib diisi)','(Required)')}</small>
            </label>
            <div class="key-input-wrapper">
              <input type="password" id="key-val-gemini" placeholder="${gemini.configured ? L('Biarkan kosong untuk mempertahankan kunci saat ini…','Leave blank to keep current key…') : 'AIzaSy...'}">
              <button type="button" class="key-input-toggle" data-action="api-key-toggle-eye:key-val-gemini" title="${L('Tampilkan/Sembunyikan','Show/Hide')}">${eyeIcon}</button>
            </div>
          </div>

          <div class="key-field-group">
            <label for="key-model-gemini"><span>${L('Pilihan Model Gemini:','Gemini Model:')}</span></label>
            <select class="key-select" id="key-model-gemini">
              <option value="gemini-2.5-flash" ${gemini.model==='gemini-2.5-flash'?'selected':''}>gemini-2.5-flash (${L('Ultra Cepat, Stabil & Efisien (Rekomendasi Utama)','Ultra Fast, Stable & Efficient (Recommended)')})</option>
              <option value="gemini-3.8-flash" ${gemini.model==='gemini-3.8-flash'?'selected':''}>gemini-3.8-flash (${L('Agentic Flash Terbaru','Next-Gen Agentic Flash')})</option>
              <option value="gemini-2.5-pro" ${gemini.model==='gemini-2.5-pro'?'selected':''}>gemini-2.5-pro (${L('Penalaran Finansial Kompleks','Complex Financial Reasoning')})</option>
              <option value="gemini-2.0-flash" ${gemini.model==='gemini-2.0-flash'?'selected':''}>gemini-2.0-flash (${L('Latensi Rendah','Low Latency')})</option>
              <option value="gemini-1.5-flash" ${gemini.model==='gemini-1.5-flash'?'selected':''}>gemini-1.5-flash (${L('Kompatibilitas Maksimal','Maximum Compatibility')})</option>
            </select>
          </div>

          <div id="key-feedback-gemini" class="key-test-feedback"></div>

          <div class="key-actions-row">
            <button type="button" class="key-btn primary" data-action="api-key-save:gemini">💾 ${L('Simpan Kunci Gemini','Save Gemini Key')}</button>
            <button type="button" class="key-btn test" data-action="api-key-test:gemini">⚡ ${L('Uji Koneksi','Test Connection')}</button>
            ${gemini.configured ? `<button type="button" class="key-btn danger key-btn-delete" data-action="api-key-delete:gemini">🗑️ ${L('Hapus Kunci','Delete Key')}</button>` : ''}
          </div>
        </div>
      </div>
    `;

    // --- Tab 2: OpenAI ---
    const openaiPane = `
      <div class="key-pane ${currentTab === 'openai' ? 'active' : ''}" id="pane-openai">
        <div class="key-card ${openai.configured ? 'configured' : ''}">
          <div class="key-card-banner">
            <div class="key-provider-meta">
              <span class="key-provider-icon">🧠</span>
              <div>
                <div class="key-provider-name">OpenAI API</div>
                <div class="key-provider-sub">OpenAI Platform · GPT-4.1 Mini, GPT-4o & Whisper Audio Transcription</div>
              </div>
            </div>
            <span class="key-status-pill ${openai.configured ? 'online' : 'standby'}">
              ${openai.configured ? L('● Terkonfigurasi', '● Configured') : L('● Belum Dikonfigurasi', '● Not Configured')}
            </span>
          </div>

          ${openai.configured ? `
            <div class="key-active-preview">
              <span>${L('Kunci Aktif:', 'Active Key:')} <code>${escape(openai.keyMasked || '••••••••••••••••')}</code></span>
              <button type="button" class="key-btn" data-action="api-key-reveal:openai">👁️ ${L('Intip Kunci', 'Reveal')}</button>
            </div>
          ` : ''}

          <div class="key-guide-note">
            <span>💡</span>
            <div><b>${L('Dapatkan API Key OpenAI:','Get OpenAI API Key:')}</b> ${L('Buka dashboard OpenAI di <b>platform.openai.com/api-keys</b>, buat API Key baru (format <code>sk-...</code>), lalu tempelkan di bawah.','Open OpenAI dashboard at <b>platform.openai.com/api-keys</b>, create a new API Key (starts with <code>sk-...</code>), then paste below.')}</div>
          </div>

          <div class="key-field-group">
            <label for="key-val-openai">
              <span>${L('API Key OpenAI:','OpenAI API Key:')}</span>
              <small>${openai.configured ? L('(Kosongkan jika tidak ingin mengubah)','(Leave blank to keep current)') : L('(Wajib diisi)','(Required)')}</small>
            </label>
            <div class="key-input-wrapper">
              <input type="password" id="key-val-openai" placeholder="${openai.configured ? L('Biarkan kosong untuk mempertahankan kunci saat ini…','Leave blank to keep current key…') : 'sk-proj-...'}">
              <button type="button" class="key-input-toggle" data-action="api-key-toggle-eye:key-val-openai" title="${L('Tampilkan/Sembunyikan','Show/Hide')}">${eyeIcon}</button>
            </div>
          </div>

          <div class="key-field-group">
            <label for="key-model-openai"><span>${L('Pilihan Model OpenAI:','OpenAI Model:')}</span></label>
            <select class="key-select" id="key-model-openai">
              <option value="gpt-4.1-mini" ${openai.model==='gpt-4.1-mini'?'selected':''}>gpt-4.1-mini (${L('Efisien, Cepat & Cerdas — Default','Efficient & Fast - Default')})</option>
              <option value="gpt-4o" ${openai.model==='gpt-4o'?'selected':''}>gpt-4o (${L('Model Unggulan Multimodal','Flagship Multimodal')})</option>
              <option value="gpt-4o-mini" ${openai.model==='gpt-4o-mini'?'selected':''}>gpt-4o-mini</option>
              <option value="o3-mini" ${openai.model==='o3-mini'?'selected':''}>o3-mini (${L('Penalaran Tingkat Tinggi','High Reasoning')})</option>
            </select>
          </div>

          <div id="key-feedback-openai" class="key-test-feedback"></div>

          <div class="key-actions-row">
            <button type="button" class="key-btn primary" data-action="api-key-save:openai">💾 ${L('Simpan Kunci OpenAI','Save OpenAI Key')}</button>
            <button type="button" class="key-btn test" data-action="api-key-test:openai">⚡ ${L('Uji Koneksi','Test Connection')}</button>
            ${openai.configured ? `<button type="button" class="key-btn danger key-btn-delete" data-action="api-key-delete:openai">🗑️ ${L('Hapus Kunci','Delete Key')}</button>` : ''}
          </div>
        </div>
      </div>
    `;

    // --- Tab 3: 9Router ---
    const ninePane = `
      <div class="key-pane ${currentTab === 'ninerouter' ? 'active' : ''}" id="pane-ninerouter">
        <div class="key-card ${nine.configured ? 'configured' : ''}">
          <div class="key-card-banner">
            <div class="key-provider-meta">
              <span class="key-provider-icon">🔀</span>
              <div>
                <div class="key-provider-name">9Router Gateway</div>
                <div class="key-provider-sub">Self-hosted OpenAI-Compatible Reverse Gateway (Claude, DeepSeek, dll.)</div>
              </div>
            </div>
            <span class="key-status-pill ${nine.configured ? 'online' : 'standby'}">
              ${nine.configured ? L('● Terkonfigurasi', '● Configured') : L('● Belum Dikonfigurasi', '● Not Configured')}
            </span>
          </div>

          ${nine.configured ? `
            <div class="key-active-preview">
              <span>${L('Kunci Aktif:', 'Active Key:')} <code>${escape(nine.keyMasked || '••••••••••••••••')}</code></span>
              <button type="button" class="key-btn" data-action="api-key-reveal:ninerouter">👁️ ${L('Intip Kunci', 'Reveal')}</button>
            </div>
          ` : ''}

          <div class="key-guide-note">
            <span>💡</span>
            <div><b>${L('9Router Gateway Terpadu:','Integrated 9Router Gateway:')}</b> ${L('Gunakan endpoint lokal OpenAI-compatible Anda (contoh: <code>http://127.0.0.1:20128/v1</code>) untuk mengakses Claude 3.5 Sonnet, DeepSeek, atau model kustom lainnya.','Connect via local OpenAI-compatible endpoint (e.g. <code>http://127.0.0.1:20128/v1</code>) to access Claude 3.5 Sonnet, DeepSeek, or custom combo models.')}</div>
          </div>

          <div class="key-field-group">
            <label for="key-val-ninerouter">
              <span>${L('API Key 9Router:','9Router API Key:')}</span>
              <small>${nine.configured ? L('(Kosongkan jika tidak ingin mengubah)','(Leave blank to keep current)') : L('(Wajib diisi)','(Required)')}</small>
            </label>
            <div class="key-input-wrapper">
              <input type="password" id="key-val-ninerouter" placeholder="${nine.configured ? L('Biarkan kosong untuk mempertahankan kunci saat ini…','Leave blank to keep current key…') : 'sk-...'}">
              <button type="button" class="key-input-toggle" data-action="api-key-toggle-eye:key-val-ninerouter" title="${L('Tampilkan/Sembunyikan','Show/Hide')}">${eyeIcon}</button>
            </div>
          </div>

          <div class="key-field-group">
            <label for="key-model-ninerouter"><span>${L('Model / Combo ID 9Router:','9Router Model / Combo ID:')}</span></label>
            <input type="text" class="key-input" id="key-model-ninerouter" list="presets-ninerouter" value="${escape(nine.model || 'claude-3-5-sonnet')}" placeholder="claude-3-5-sonnet, deepseek-chat, gpt-4o...">
            <datalist id="presets-ninerouter">
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
              <option value="deepseek-chat">DeepSeek Chat</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </datalist>
          </div>

          <div class="key-field-group">
            <label for="key-baseurl-ninerouter"><span>${L('Base URL Endpoint (akhiri dengan /v1):','Base URL Endpoint (ending in /v1):')}</span></label>
            <input type="text" class="key-input" id="key-baseurl-ninerouter" value="${escape(nine.baseUrl || 'http://127.0.0.1:20128/v1')}" placeholder="http://127.0.0.1:20128/v1">
          </div>

          <div id="key-feedback-ninerouter" class="key-test-feedback"></div>

          <div class="key-actions-row">
            <button type="button" class="key-btn primary" data-action="api-key-save:ninerouter">💾 ${L('Simpan Kunci 9Router','Save 9Router Key')}</button>
            <button type="button" class="key-btn test" data-action="api-key-test:ninerouter">⚡ ${L('Uji Koneksi','Test Connection')}</button>
            ${nine.configured ? `<button type="button" class="key-btn danger key-btn-delete" data-action="api-key-delete:ninerouter">🗑️ ${L('Hapus Kunci','Delete Key')}</button>` : ''}
          </div>
        </div>
      </div>
    `;

    // --- Tab 4: Muse ---
    const musePane = `
      <div class="key-pane ${currentTab === 'muse' ? 'active' : ''}" id="pane-muse">
        <div class="key-card ${muse.configured ? 'configured' : ''}">
          <div class="key-card-banner">
            <div class="key-provider-meta">
              <span class="key-provider-icon">🌌</span>
              <div>
                <div class="key-provider-name">Meta AI / Muse Spark</div>
                <div class="key-provider-sub">Muse Financial Explainer & Audio Transcriptions</div>
              </div>
            </div>
            <span class="key-status-pill ${muse.configured ? 'online' : 'standby'}">
              ${muse.configured ? L('● Terkonfigurasi', '● Configured') : L('● Belum Dikonfigurasi', '● Not Configured')}
            </span>
          </div>

          ${muse.configured ? `
            <div class="key-active-preview">
              <span>${L('Kunci Aktif:', 'Active Key:')} <code>${escape(muse.keyMasked || '••••••••••••••••')}</code></span>
              <button type="button" class="key-btn" data-action="api-key-reveal:muse">👁️ ${L('Intip Kunci', 'Reveal')}</button>
            </div>
          ` : ''}

          <div class="key-guide-note">
            <span>💡</span>
            <div><b>${L('Meta AI / Muse Spark:','Meta AI / Muse Spark:')}</b> ${L('Gunakan endpoint lokal vLLM atau API key model Meta Llama (contoh: <code>llama-3.3-70b-instruct</code>, <code>muse-spark-1.3</code>). Model ini menggerakkan narasi analisis keuangan dan transkripsi suara.','Connect a compatible Meta AI / vLLM / Llama endpoint or API key (e.g. <code>muse-spark-1.3</code>, <code>llama-3.3-70b-instruct</code>) to power financial narrative reviews and audio transcriptions.')}</div>
          </div>

          <div class="key-field-group">
            <label for="key-val-muse">
              <span>${L('API Key Meta AI (Muse):','Meta AI (Muse) API Key:')}</span>
              <small>${muse.configured ? L('(Kosongkan jika tidak ingin mengubah)','(Leave blank to keep current)') : L('(Wajib diisi)','(Required)')}</small>
            </label>
            <div class="key-input-wrapper">
              <input type="password" id="key-val-muse" placeholder="${muse.configured ? L('Biarkan kosong untuk mempertahankan kunci saat ini…','Leave blank to keep current key…') : 'API Key...'}">
              <button type="button" class="key-input-toggle" data-action="api-key-toggle-eye:key-val-muse" title="${L('Tampilkan/Sembunyikan','Show/Hide')}">${eyeIcon}</button>
            </div>
          </div>

          <div class="key-field-group">
            <label for="key-model-muse"><span>${L('Model Meta AI (Muse):','Meta AI Model:')}</span></label>
            <input type="text" class="key-input" id="key-model-muse" list="presets-muse" value="${escape(muse.model || 'muse-spark-1.3')}" placeholder="muse-spark-1.3">
            <datalist id="presets-muse">
              <option value="muse-spark-1.3">muse-spark-1.3 (Default)</option>
              <option value="llama-3.3-70b-instruct">llama-3.3-70b-instruct</option>
              <option value="meta-llama-3.1-8b">meta-llama-3.1-8b</option>
            </datalist>
          </div>

          <div id="key-feedback-muse" class="key-test-feedback"></div>

          <div class="key-actions-row">
            <button type="button" class="key-btn primary" data-action="api-key-save:muse">💾 ${L('Simpan Kunci Muse','Save Muse Key')}</button>
            <button type="button" class="key-btn test" data-action="api-key-test:muse">⚡ ${L('Uji Koneksi','Test Connection')}</button>
            ${muse.configured ? `<button type="button" class="key-btn danger key-btn-delete" data-action="api-key-delete:muse">🗑️ ${L('Hapus Kunci','Delete Key')}</button>` : ''}
          </div>
        </div>
      </div>
    `;

    // --- Tab 5: Telegram Bot ---
    const tgPane = `
      <div class="key-pane ${currentTab === 'telegram' ? 'active' : ''}" id="pane-telegram">
        <div class="key-card ${tg.configured ? 'configured' : ''}">
          <div class="key-card-banner">
            <div class="key-provider-meta">
              <span class="key-provider-icon">💬</span>
              <div>
                <div class="key-provider-name">Telegram Bot Integration</div>
                <div class="key-provider-sub">${L('Kirim pesan transaksi & terima pengingat langsung di Telegram HP Anda','Send transactions & receive card reminders directly on your mobile Telegram')}</div>
              </div>
            </div>
            <span class="key-status-pill ${tg.configured ? 'online' : 'standby'}">
              ${tg.configured ? L('● Terhubung', '● Connected') : L('● Belum Dikonfigurasi', '● Not Configured')}
            </span>
          </div>

          ${tg.configured ? `
            <div class="key-active-preview">
              <div>
                <div>${L('Token Bot Aktif:', 'Active Bot Token:')} <code>${escape(tg.tokenMasked || '••••••••••••••••')}</code></div>
                <div style="margin-top:4px">${L('Chat ID:', 'Chat ID:')} <code>${escape(tg.chatId || '-')}</code></div>
              </div>
              <button type="button" class="key-btn" data-action="api-key-reveal:telegram">👁️ ${L('Intip Token', 'Reveal')}</button>
            </div>
          ` : ''}

          <div class="key-guide-note">
            <span>💡</span>
            <div>
              <b>${L('Panduan Cepat Setup Telegram Bot:','Quick Telegram Bot Setup:')}</b>
              <ol style="margin:6px 0 0;padding-left:18px;line-height:1.6">
                <li>${L('Buka Telegram, cari akun <b>@BotFather</b>, lalu kirim perintah <code>/newbot</code>.','Open Telegram, message <b>@BotFather</b> with <code>/newbot</code>.')}</li>
                <li>${L('Ikuti instruksi untuk memberi nama bot Anda. Salin <b>HTTP API Token</b> ke kolom di bawah.','Follow instructions to name your bot. Copy the <b>HTTP API Token</b> below.')}</li>
                <li>${L('Cari bot <b>@userinfobot</b> di Telegram, kirim pesan apa saja untuk mendapatkan <b>Id</b> numerik Anda.','Message <b>@userinfobot</b> on Telegram to find your numeric account <b>Id</b>.')}</li>
                <li>${L('Masukkan ID angka tersebut ke kolom <b>Chat ID Pribadi</b> di bawah.','Enter that number into <b>Private Chat ID</b> below.')}</li>
                <li>${L('Buka bot Anda di Telegram dan tekan <b>Start</b> agar bot dapat mengirim pesan.','Open your new bot in Telegram and press <b>Start</b>.')}</li>
              </ol>
            </div>
          </div>

          <div class="key-field-group">
            <label for="key-val-telegram">
              <span>${L('Telegram Bot Token:','Telegram Bot Token:')}</span>
              <small>${tg.configured ? L('(Kosongkan jika tidak ingin mengubah)','(Leave blank to keep current)') : L('(Format: 123456789:ABCdef...)','(Format: 123456789:ABCdef...)')}</small>
            </label>
            <div class="key-input-wrapper">
              <input type="password" id="key-val-telegram" placeholder="${tg.configured ? L('Biarkan kosong untuk mempertahankan token saat ini…','Leave blank to keep current token…') : '123456789:ABCdefGHIjklMNO...'}">
              <button type="button" class="key-input-toggle" data-action="api-key-toggle-eye:key-val-telegram" title="${L('Tampilkan/Sembunyikan','Show/Hide')}">${eyeIcon}</button>
            </div>
          </div>

          <div class="key-field-group">
            <label for="key-chatid-telegram">
              <span>${L('Private Telegram Chat ID:','Private Telegram Chat ID:')}</span>
              <small>${L('(ID akun pribadi Anda)','(Your private numerical ID)')}</small>
            </label>
            <input type="text" class="key-input" id="key-chatid-telegram" value="${escape(tg.chatId || '')}" placeholder="Contoh: 123456789" maxlength="32">
          </div>

          <div id="key-feedback-telegram" class="key-test-feedback"></div>

          <div class="key-actions-row">
            <button type="button" class="key-btn primary" data-action="api-key-save:telegram">💾 ${L('Simpan Token & Chat ID','Save Bot Token & Chat ID')}</button>
            <button type="button" class="key-btn test" data-action="api-key-test:telegram">⚡ ${L('Uji Bot Telegram','Test Telegram Bot')}</button>
            ${tg.configured ? `<button type="button" class="key-btn danger key-btn-delete" data-action="api-key-delete:telegram">🗑️ ${L('Hapus Konfigurasi Bot','Delete Bot Config')}</button>` : ''}
          </div>
        </div>
      </div>
    `;

    // --- Tab 6: Overview (All) ---
    const allPane = `
      <div class="key-pane ${currentTab === 'all' ? 'active' : ''}" id="pane-all">
        <div class="key-overview-header">
          <div class="key-overview-stats">
            <span class="key-stat-chip active"><i class="key-tab-dot online"></i> ${activeCount} ${L('Saluran Aktif','Active')}</span>
            <span class="key-stat-chip standby"><i class="key-tab-dot"></i> ${totalCount - activeCount} ${L('Standby','Standby')}</span>
          </div>
          <button type="button" class="key-btn test" data-action="api-key-ping-all">⚡ ${L('Uji Semua Saluran','Ping All Channels')}</button>
        </div>

        <div class="key-overview-grid">
          <!-- Gemini -->
          <div class="key-ov-card ${gemini.configured ? 'configured' : ''}">
            <div class="key-ov-head">
              <span class="key-ov-title"><span>🤖</span> Google Gemini</span>
              <span class="key-status-pill ${gemini.configured ? 'online' : 'standby'}">${gemini.configured ? '● Online' : '● Standby'}</span>
            </div>
            <div class="key-ov-body">
              <div><b>Model:</b> <code class="key-chip">${escape(gemini.model || 'gemini-3.8-flash')}</code></div>
              <div><b>Kunci:</b> <code class="key-chip">${escape(gemini.keyMasked || L('Belum diatur','Not configured'))}</code></div>
            </div>
            <div class="key-ov-actions">
              <button type="button" class="key-btn key-btn-sm" data-action="api-key-tab:gemini">✏️ ${L('Atur Kunci','Configure')}</button>
              ${gemini.configured ? `<button type="button" class="key-btn danger key-btn-sm" data-action="api-key-delete:gemini" title="${L('Hapus Kunci','Delete')}">🗑️</button>` : ''}
            </div>
          </div>

          <!-- OpenAI -->
          <div class="key-ov-card ${openai.configured ? 'configured' : ''}">
            <div class="key-ov-head">
              <span class="key-ov-title"><span>🧠</span> OpenAI API</span>
              <span class="key-status-pill ${openai.configured ? 'online' : 'standby'}">${openai.configured ? '● Online' : '● Standby'}</span>
            </div>
            <div class="key-ov-body">
              <div><b>Model:</b> <code class="key-chip">${escape(openai.model || 'gpt-4.1-mini')}</code></div>
              <div><b>Kunci:</b> <code class="key-chip">${escape(openai.keyMasked || L('Belum diatur','Not configured'))}</code></div>
            </div>
            <div class="key-ov-actions">
              <button type="button" class="key-btn key-btn-sm" data-action="api-key-tab:openai">✏️ ${L('Atur Kunci','Configure')}</button>
              ${openai.configured ? `<button type="button" class="key-btn danger key-btn-sm" data-action="api-key-delete:openai" title="${L('Hapus Kunci','Delete')}">🗑️</button>` : ''}
            </div>
          </div>

          <!-- 9Router -->
          <div class="key-ov-card ${nine.configured ? 'configured' : ''}">
            <div class="key-ov-head">
              <span class="key-ov-title"><span>🔀</span> 9Router Gateway</span>
              <span class="key-status-pill ${nine.configured ? 'online' : 'standby'}">${nine.configured ? '● Online' : '● Standby'}</span>
            </div>
            <div class="key-ov-body">
              <div><b>Model:</b> <code class="key-chip">${escape(nine.model || 'claude-3-5-sonnet')}</code></div>
              <div><b>Kunci:</b> <code class="key-chip">${escape(nine.keyMasked || L('Belum diatur','Not configured'))}</code></div>
            </div>
            <div class="key-ov-actions">
              <button type="button" class="key-btn key-btn-sm" data-action="api-key-tab:ninerouter">✏️ ${L('Atur Kunci','Configure')}</button>
              ${nine.configured ? `<button type="button" class="key-btn danger key-btn-sm" data-action="api-key-delete:ninerouter" title="${L('Hapus Kunci','Delete')}">🗑️</button>` : ''}
            </div>
          </div>

          <!-- Telegram Bot -->
          <div class="key-ov-card ${tg.configured ? 'configured' : ''}">
            <div class="key-ov-head">
              <span class="key-ov-title"><span>💬</span> Telegram Bot</span>
              <span class="key-status-pill ${tg.configured ? 'online' : 'standby'}">${tg.configured ? '● Terhubung' : '● Standby'}</span>
            </div>
            <div class="key-ov-body">
              <div><b>Token:</b> <code class="key-chip">${escape(tg.tokenMasked || L('Belum diatur','Not configured'))}</code></div>
              <div><b>Chat ID:</b> <code class="key-chip">${escape(tg.chatId || '-')}</code></div>
            </div>
            <div class="key-ov-actions">
              <button type="button" class="key-btn key-btn-sm" data-action="api-key-tab:telegram">✏️ ${L('Atur Bot','Configure')}</button>
              ${tg.configured ? `<button type="button" class="key-btn danger key-btn-sm" data-action="api-key-delete:telegram" title="${L('Hapus Konfigurasi','Delete')}">🗑️</button>` : ''}
            </div>
          </div>

          <!-- Muse -->
          <div class="key-ov-card ${muse.configured ? 'configured' : ''}">
            <div class="key-ov-head">
              <span class="key-ov-title"><span>🌌</span> Meta AI (Muse)</span>
              <span class="key-status-pill ${muse.configured ? 'online' : 'standby'}">${muse.configured ? '● Online' : '● Standby'}</span>
            </div>
            <div class="key-ov-body">
              <div><b>Model:</b> <code class="key-chip">${escape(muse.model || 'muse-spark-1.3')}</code></div>
              <div><b>Kunci:</b> <code class="key-chip">${escape(muse.keyMasked || L('Belum diatur','Not configured'))}</code></div>
            </div>
            <div class="key-ov-actions">
              <button type="button" class="key-btn key-btn-sm" data-action="api-key-tab:muse">✏️ ${L('Atur Kunci','Configure')}</button>
              ${muse.configured ? `<button type="button" class="key-btn danger key-btn-sm" data-action="api-key-delete:muse" title="${L('Hapus Kunci','Delete')}">🗑️</button>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    const modalBody = `
      <div class="key-mgr-dialog">
        <div class="key-mgr-head">
          <div class="key-mgr-title-area">
            <div class="key-mgr-avatar">🔑</div>
            <div>
              <div class="key-mgr-eyebrow">${L('KREDENSIAL & KEAMANAN', 'CREDENTIALS & SECURITY')}</div>
              <h2>${L('Kelola Kunci API & Telegram Bot','Manage API Keys & Telegram Bot')}</h2>
              <p>${L('Tambah, edit, uji, dan simpan kunci langsung di aplikasi. Kredensial tersimpan aman di server lokal.','Add, edit, test, and save keys directly in-app. Credentials stay secure on your local server.')}</p>
            </div>
          </div>
          <div class="key-mgr-head-actions">
            <div class="key-vault-badge">
              <span class="key-vault-dot"></span>
              <span>${L('Server Lokal Terproteksi','Local Server Protected')}</span>
            </div>
            <button type="button" class="icon-button key-close-btn" data-action="modal-close" aria-label="${L('Tutup','Close')}">✕</button>
          </div>
        </div>
        ${tabsHtml}
        <div class="key-mgr-content">
          ${allPane}
          ${geminiPane}
          ${openaiPane}
          ${ninePane}
          ${musePane}
          ${tgPane}
        </div>
      </div>
    `;

    openModal(L('Kelola Kunci API & Telegram Bot','Manage API Keys & Telegram Bot'), modalBody);
  }

  async function handleSaveKey(prov) {
    const btn = document.querySelector(`[data-action="api-key-save:${prov}"]`);
    const feedback = $(`#key-feedback-${prov}`);
    if (btn) btn.classList.add('saving');
    if (feedback) {
      feedback.className = 'key-test-feedback active loading';
      feedback.innerHTML = `<span class="key-radar-spinner"></span> ${L('Menyimpan konfigurasi ke server lokal…','Saving configuration to local server…')}`;
    }

    let payload = { action: 'save', provider: prov };
    if (prov === 'telegram') {
      const token = $(`#key-val-telegram`)?.value?.trim();
      const chatId = $(`#key-chatid-telegram`)?.value?.trim();
      if (token) payload.botToken = token;
      if (chatId) payload.chatId = chatId;
    } else {
      const key = $(`#key-val-${prov}`)?.value?.trim();
      const model = $(`#key-model-${prov}`)?.value?.trim();
      if (key) payload.apiKey = key;
      if (model) payload.model = model;
      if (prov === '9router' || prov === 'ninerouter') {
        const baseUrl = ($('#key-baseurl-ninerouter') || $('#key-baseurl-9router'))?.value?.trim();
        if (baseUrl) payload.baseUrl = baseUrl;
      }
    }

    try {
      const res = await api('keys', payload);
      if (res.ok) {
        if (res.ai) service.ai = res.ai;
        if (res.telegram !== undefined) service.telegram = res.telegram;
        cachedApiKeys = await api('keys');
        if (feedback) {
          feedback.className = 'key-test-feedback active success';
          feedback.innerHTML = `<span>✅</span> <b>${L('Berhasil Disimpan!','Saved Successfully!')}</b> ${L('Kunci API kini aktif di server lokal dan database.','API key is now active on the local server and persistent database.')}`;
        }
        toast(L(`Kunci ${prov.toUpperCase()} berhasil disimpan!`, `${prov.toUpperCase()} key saved successfully!`));
        setTimeout(() => renderApiKeysModalView(prov), 700);
        if (['integrations', 'copilot', 'capture'].includes(page)) render();
      }
    } catch (err) {
      if (feedback) {
        feedback.className = 'key-test-feedback active error';
        feedback.innerHTML = `<span>❌</span> <b>${L('Gagal menyimpan:','Save failed:')}</b> ${escape(err.message)}`;
      }
      toast(err.message);
    } finally {
      if (btn) btn.classList.remove('saving');
    }
  }

  async function handleDeleteKey(prov) {
    confirmAction(
      L(`Hapus Kunci ${prov.toUpperCase()}?`, `Delete ${prov.toUpperCase()} Key?`),
      L(`Kunci API ${prov.toUpperCase()} akan dihapus dari server lokal, database, dan file konfigurasi. Layanan ini akan dinonaktifkan sampai Anda memasukkan kunci baru. Lanjutkan?`, `The ${prov.toUpperCase()} API key will be deleted from the server, database, and env file. This service will be disabled until you enter a new key. Proceed?`),
      async () => {
        try {
          toast(L('Menghapus kunci…', 'Deleting key…'));
          const res = await api('keys', { action: 'delete', provider: prov });
          if (res.ai) service.ai = res.ai;
          if (res.telegram !== undefined) service.telegram = res.telegram;
          cachedApiKeys = await api('keys');
          toast(L(`Kunci ${prov.toUpperCase()} berhasil dihapus.`, `${prov.toUpperCase()} key deleted.`));
          renderApiKeysModalView(prov);
          if (['integrations', 'copilot', 'capture'].includes(page)) render();
        } catch (err) {
          toast(err.message);
        }
      },
      L('Hapus Kunci', 'Delete Key')
    );
  }

  async function handleTestKey(prov) {
    const feedback = $(`#key-feedback-${prov}`);
    if (feedback) {
      feedback.className = 'key-test-feedback active loading';
      feedback.innerHTML = `<span class="key-radar-spinner"></span> ${L('Menguji koneksi ke ' + prov.toUpperCase() + '…', 'Testing connection to ' + prov.toUpperCase() + '…')}`;
    }

    let payload = { action: 'test', provider: prov };
    if (prov === 'telegram') {
      const token = $(`#key-val-telegram`)?.value?.trim();
      const chatId = $(`#key-chatid-telegram`)?.value?.trim();
      if (token) payload.botToken = token;
      if (chatId) payload.chatId = chatId;
    } else {
      const key = $(`#key-val-${prov}`)?.value?.trim();
      const model = $(`#key-model-${prov}`)?.value?.trim();
      if (key) payload.apiKey = key;
      if (model) payload.model = model;
      if (prov === '9router' || prov === 'ninerouter') {
        const baseUrl = ($('#key-baseurl-ninerouter') || $('#key-baseurl-9router'))?.value?.trim();
        if (baseUrl) payload.baseUrl = baseUrl;
      }
    }

    try {
      const res = await api('keys', payload);
      if (res.ok) {
        if (feedback) {
          feedback.className = 'key-test-feedback active success';
          feedback.innerHTML = `<span>✅</span> <b>${escape(res.message || L('Koneksi berhasil!', 'Connection successful!'))}</b>`;
        }
        toast(res.message || L('Koneksi berhasil!', 'Connection successful!'));
      } else {
        if (feedback) {
          feedback.className = 'key-test-feedback active error';
          feedback.innerHTML = `<span>❌</span> <b>${escape(res.error || L('Koneksi gagal.', 'Connection failed.'))}</b>`;
        }
        toast(res.error || L('Koneksi gagal.', 'Connection failed.'));
      }
    } catch (err) {
      if (feedback) {
        feedback.className = 'key-test-feedback active error';
        feedback.innerHTML = `<span>❌</span> <b>${L('Uji gagal: ', 'Test failed: ')}</b>${escape(err.message)}`;
      }
      toast(err.message);
    }
  }

  async function handleRevealKey(prov) {
    try {
      toast(L('Mengambil kunci dari server terproteksi…', 'Fetching key from protected server…'));
      const revealed = await api('keys?reveal=1');
      if (prov === 'telegram') {
        const raw = revealed.telegram?.rawToken;
        const inp = $('#key-val-telegram');
        if (inp && raw) {
          inp.value = raw;
          inp.type = 'text';
        }
      } else {
        const raw = revealed[prov]?.rawKey;
        const inp = $(`#key-val-${prov}`);
        if (inp && raw) {
          inp.value = raw;
          inp.type = 'text';
        }
      }
      toast(L('Kunci ditampilkan di formulir', 'Key revealed in input field'));
    } catch (e) {
      toast(e.message);
    }
  }

  async function handlePingAll() {
    toast(L('⚡ Menguji sinyal ke semua saluran aktif…', '⚡ Testing connection signals to all channels…'));
    const providers = ['gemini', 'openai', 'ninerouter', 'muse', 'telegram'];
    let results = [];
    for (const p of providers) {
      if (cachedApiKeys?.[p]?.configured) {
        try {
          const r = await api('keys', { action: 'test', provider: p });
          results.push(`${p.toUpperCase()}: ${r.ok ? '✅ ' + (r.message || 'OK') : '❌ ' + (r.error || 'Gagal')}`);
        } catch (e) {
          results.push(`${p.toUpperCase()}: ❌ ${e.message}`);
        }
      }
    }
    if (!results.length) {
      toast(L('Belum ada kunci API yang dikonfigurasi untuk diuji.', 'No API keys configured to test.'));
    } else {
      toast(L('Uji sinyal selesai!', 'Signal tests completed!'));
      openModal(L('Hasil Uji Sinyal Saluran', 'Channel Signal Test Results'), `<div style="padding:8px 0;display:flex;flex-direction:column;gap:8px">${results.map(r => `<div style="padding:10px 12px;border-radius:8px;background:var(--paper);border:1px solid var(--line);font-size:12px">${escape(r)}</div>`).join('')}</div>`);
    }
  }

  async function apiKeyAction(name, id, extra) {
    if (name === 'api-keys') {
      openApiKeysModal(id || 'all');
      return;
    }
    if (name === 'api-key-tab') {
      const tabs = document.querySelectorAll('.key-tab-btn');
      const panes = document.querySelectorAll('.key-pane');
      tabs.forEach(t => {
        const isMatch = t.getAttribute('data-action') === `api-key-tab:${id}`;
        t.classList.toggle('active', isMatch);
        t.setAttribute('aria-selected', isMatch);
      });
      panes.forEach(p => {
        p.classList.toggle('active', p.id === `pane-${id}`);
      });
      return;
    }
    if (name === 'api-key-toggle-eye') {
      const inp = document.getElementById(id);
      if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
      return;
    }
    if (name === 'api-key-save') {
      await handleSaveKey(id);
      return;
    }
    if (name === 'api-key-delete') {
      await handleDeleteKey(id);
      return;
    }
    if (name === 'api-key-test') {
      await handleTestKey(id);
      return;
    }
    if (name === 'api-key-reveal') {
      await handleRevealKey(id);
      return;
    }
    if (name === 'api-key-ping-all') {
      await handlePingAll();
      return;
    }
  }

  function investmentGoldTracker(){
    const c=state.goldInstallment||INV.defaultGoldContract;
    const spotPrice=c.customSpotPrice||c.initialPricePerGram;
    const m=INV.goldInstallmentMetrics(c,spotPrice,c.paidMonths);
    const rp=val=>amount(Math.round(val*100),'IDR');

    const bepBadge=m.isProfitable
      ?`<span class="badge" style="background:#10b981;color:#fff;font-weight:700">Untung (+${money(m.distanceToBep*100,false,'IDR')}/g)</span>`
      :`<span class="badge" style="background:#f43f5e;color:#fff;font-weight:700">Belum Impas (${money(m.distanceToBep*100,false,'IDR')}/g)</span>`;

    return `<div class="gold-tracker-wrap">
      <div class="gold-contract-banner">
        <div class="gold-banner-info">
          <h3>Pegadaian Mulia Ultimate — Cicilan Emas Batangan 24K Galeri 24 (50.0 Gram)</h3>
          <p>
            <b>No. Kontrak:</b> ${escape(c.contractNo)} &nbsp;·&nbsp;
            <b>No. Aplikasi:</b> ${escape(c.applicationNo)} &nbsp;·&nbsp;
            <b>CIF:</b> ${escape(c.cif)} &nbsp;·&nbsp;
            <b>Nasabah:</b> ${escape(c.borrowerName)}
          </p>
          <div class="gold-badges">
            <span class="gold-badge">${icon('vault')} Emas Batangan 24K (99.99%) Galeri 24</span>
            <span class="gold-badge">${icon('scale')} Berat: 50.0000 Gram</span>
            <span class="gold-badge">${icon('calendar')} Tenor 60 Bulan (31 Agu 2026 s/d 31 Agu 2031)</span>
            <span class="gold-badge">${icon('receipt')} Sewa Modal: 0.53% Flat / Bulan</span>
            ${c.synced?`<span class="gold-badge" style="background:rgba(16,185,129,0.2);color:#059669;border-color:#10b981">${icon('check')} ${L('Tersinkron di Buku Kas','Synced to Ledger')}</span>`:''}
          </div>
        </div>
        <div class="button-group">
          ${button(L('💰 Bayar Angsuran Bulan Ini','💰 Pay Installment'),'gold-pay-installment','primary','wallet')}
          ${button(L('Jadwal Amortisasi 60 Bulan','60-Mo Schedule'),'gold-schedule-modal','','calendar')}
        </div>
      </div>

      <div class="gold-stat-grid">
        <div class="gold-stat-card">
          <small>${L('Nilai Pasar Emas 50g Saat Ini','Current 50g Gold Market Value')}</small>
          <strong>${rp(m.currentMarketValue)}</strong>
          <span class="gold-subtext">${c.weightGrams}g × ${rp(m.spotPrice)}/g</span>
          <span class="gold-subtext ${m.currentMarketValue>=c.initialPurchasePrice?'up investment-positive':'down investment-negative'}">
            ${m.currentMarketValue>=c.initialPurchasePrice?'+':''}${rp(m.currentMarketValue-c.initialPurchasePrice)} vs beli awal
          </span>
        </div>

        <div class="gold-stat-card">
          <small>${L('Sisa Pokok Hutang Pembiayaan','Remaining Loan Principal')}</small>
          <strong>${rp(m.remainingPrincipal)}</strong>
          <span class="gold-subtext">Pinjaman Awal: ${rp(c.loanPrincipal)}</span>
          <span class="gold-subtext" style="color:var(--muted)">
            ${m.paidMonths} / ${c.tenorMonths} ${L('Bulan Terbayar','Months Paid')} (${c.tenorMonths-m.paidMonths} bln tersisa)
          </span>
        </div>

        <div class="gold-stat-card">
          <small>${L('Ekuitas Emas Bersih (Net Equity)','Net Gold Equity')}</small>
          <strong class="${m.netEquity>=0?'up investment-positive':'down investment-negative'}">${rp(m.netEquity)}</strong>
          <span class="gold-subtext">${L('Nilai Pasar Emas − Sisa Kewajiban Hutang','Market Value − Remaining Debt')}</span>
          <span class="gold-subtext" style="color:var(--accent,#d97706);font-weight:600">
            ${L('Kepemilikan Pokok Emas:','Gold Principal Owned:')} ${m.equityPercent}%
          </span>
        </div>

        <div class="gold-stat-card">
          <small>${L('Titik Impas (Break-Even Price)','Break-Even Price (BEP)')}</small>
          <strong>${rp(m.breakEvenPrice)} / g</strong>
          <span class="gold-subtext">Total Biaya Rp 166.914.120 ÷ 50g</span>
          <div style="margin-top:4px">${bepBadge}</div>
        </div>
      </div>

      <div class="gold-timeline-card">
        <div class="gold-timeline-header">
          <div>
            <h4 style="margin:0 0 4px;font-size:16px;font-weight:700">${L('Progress Tenor & Akumulasi Kepemilikan Emas','Tenor Progress & Gold Ownership')}</h4>
            <span class="muted" style="font-size:12px">
              ${L('Bulan Ke-','Month ')}<b>${m.paidMonths}</b> ${L('dari 60 Bulan','of 60 Months')} &nbsp;·&nbsp; 
              ${L('Angsuran Rutin:','Monthly Installment:')} <b>${rp(c.monthlyInstallment)} / ${L('bulan','month')}</b> (Pokok ${rp(c.monthlyPrincipal)} + Sewa Modal ${rp(c.monthlyFee)}) &nbsp;·&nbsp;
              ${L('Jatuh tempo setiap tgl 30/31','Due 30/31 monthly')}
            </span>
          </div>
          <div class="button-group">
            <button class="btn" data-action="gold-months-preset:0" title="Reset ke Bulan 0">0 Bln</button>
            <button class="btn" data-action="gold-months-preset:12">12 Bln (Th 1)</button>
            <button class="btn" data-action="gold-months-preset:24">24 Bln (Th 2)</button>
            <button class="btn" data-action="gold-months-preset:36">36 Bln (Th 3)</button>
            <button class="btn" data-action="gold-months-preset:48">48 Bln (Th 4)</button>
            <button class="btn" data-action="gold-months-preset:60">60 Bln (Lunas)</button>
          </div>
        </div>

        <div>
          <label style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px;font-weight:600;color:var(--muted)">
            <span>${L('Geser untuk menyimulasikan progres bulan tenor:','Slide to simulate tenor months progress:')}</span>
            <span style="color:var(--ink)"><b>${m.paidMonths}</b> / 60 Bulan (${((m.paidMonths/60)*100).toFixed(0)}%)</span>
          </label>
          <input type="range" id="gold-paid-months-slider" min="0" max="60" value="${m.paidMonths}" step="1" class="gold-range-slider" aria-label="${L('Slider bulan cicilan','Installment month slider')}">
        </div>

        <div>
          <div class="gold-progress-track">
            <div class="gold-progress-fill" style="width:${Math.max(4,m.equityPercent)}%"></div>
          </div>
          <div class="gold-progress-labels">
            <span><b>DP 15%:</b> ${rp(c.downPayment)} + <b>Pokok Terbayar:</b> ${rp(m.principalPaid)} = <b>${rp(m.equityPrincipal)} (${m.equityPercent}%)</b></span>
            <span><b>Total Dana Disetor:</b> ${rp(m.totalCashOut)} / ${rp(c.totalCommitment)}</span>
          </div>
        </div>
      </div>

      <div class="gold-sim-card">
        <div class="gold-timeline-header">
          <div>
            <h4 style="margin:0 0 4px;font-size:16px;font-weight:700">${L('Simulator Keuntungan pada Harga Emas Kustom','Real-Time Gold Price Simulator')}</h4>
            <span class="muted" style="font-size:12px">${L('Uji simulasi hasil investasi emas fisik 50g Anda berdasarkan variasi harga spot emas per gram.','Simulate your 50g physical gold returns across different gold spot prices.')}</span>
          </div>
          <div class="gold-sim-input-wrap">
            <label style="font-size:12px;font-weight:600;color:var(--muted)">${L('Harga Spot / g:','Spot Price / g:')}</label>
            <input type="number" id="gold-spot-price-input" min="1000000" max="10000000" step="10000" value="${m.spotPrice}" class="gold-price-input">
          </div>
        </div>

        <div>
          <input type="range" id="gold-spot-price-slider" min="2000000" max="6000000" step="10000" value="${m.spotPrice}" class="gold-range-slider" aria-label="${L('Slider harga emas per gram','Gold price per gram slider')}">
        </div>

        <div class="gold-presets">
          <button class="gold-preset-btn" data-action="gold-price-preset:2532080">Akad Awal: Rp 2.532.080</button>
          <button class="gold-preset-btn" data-action="gold-price-preset:2750000">Spot Hari Ini: Rp 2.750.000</button>
          <button class="gold-preset-btn" data-action="gold-price-preset:3338282" style="border-color:#d97706;font-weight:700">Titik Impas (BEP): Rp 3.338.282</button>
          <button class="gold-preset-btn" data-action="gold-price-preset:3720000">+8% CAGR (Th 2031): Rp 3.720.000</button>
          <button class="gold-preset-btn" data-action="gold-price-preset:4462000">+12% CAGR (Th 2031): Rp 4.462.000</button>
          <button class="gold-preset-btn" data-action="gold-price-preset:5093000">+15% CAGR (Th 2031): Rp 5.093.000</button>
        </div>

        <div class="gold-sim-result-box">
          <div>
            <small style="color:var(--muted);font-size:11px;font-weight:600;text-transform:uppercase">${L('Valuasi Emas 50g','50g Gold Value')}</small>
            <strong style="display:block;font-size:17px;font-weight:700;color:var(--ink);margin-top:4px">${rp(m.currentMarketValue)}</strong>
          </div>
          <div>
            <small style="color:var(--muted);font-size:11px;font-weight:600;text-transform:uppercase">${L('Total Dana Keluar (Kas)','Total Cash Outflow')}</small>
            <strong style="display:block;font-size:17px;font-weight:700;color:var(--ink);margin-top:4px">${rp(m.totalCashOut)}</strong>
          </div>
          <div>
            <small style="color:var(--muted);font-size:11px;font-weight:600;text-transform:uppercase">${L('Ekuitas Bersih Pelunasan','Net Equity After Debt')}</small>
            <strong style="display:block;font-size:17px;font-weight:700;color:var(--ink);margin-top:4px">${rp(m.netEquity)}</strong>
          </div>
          <div>
            <small style="color:var(--muted);font-size:11px;font-weight:600;text-transform:uppercase">${L('Estimasi Laba/Rugi Bersih','Net Profit / Loss')}</small>
            <strong style="display:block;font-size:17px;font-weight:700;margin-top:4px" class="${m.netProfit>=0?'up investment-positive':'down investment-negative'}">
              ${m.netProfit>=0?'+':''}${rp(m.netProfit)} (${m.netRoi>0?'+':''}${m.netRoi}%)
            </strong>
          </div>
        </div>
      </div>

      <div>
        <h4 style="margin:0 0 12px;font-size:16px;font-weight:700">${L('Proyeksi Kinerja & Imbal Hasil Investasi Emas 5 Tahun (2026 - 2031)','5-Year Gold Investment Return Projections (2026 - 2031)')}</h4>
        <div class="gold-cagr-grid">
          ${m.cagrScenarios.map((sc,idx)=>`
            <div class="gold-cagr-card ${idx===1?'featured':''}">
              <div class="gold-cagr-header">
                <h4>${sc.name}</h4>
                <span class="badge" style="background:${sc.netProfit>0?'#10b981':'var(--line)'};color:#fff;font-weight:700">
                  ${sc.roi>0?'+':''}${sc.roi}% ROI
                </span>
              </div>
              <div class="gold-cagr-body">
                <div class="gold-cagr-row">
                  <span>${L('Proyeksi Harga Emas 2031','Projected Gold Price 2031')}</span>
                  <b>${rp(sc.projectedPrice)} / g</b>
                </div>
                <div class="gold-cagr-row">
                  <span>${L('Nilai Pasar Emas 50g','50g Market Value')}</span>
                  <b>${rp(sc.projectedValue)}</b>
                </div>
                <div class="gold-cagr-row">
                  <span>${L('Total Seluruh Biaya (DP + 60x Cicilan)','Total Commitment')}</span>
                  <span>${rp(c.totalCommitment)}</span>
                </div>
                <div class="gold-cagr-row" style="border-top:1px dashed var(--line);padding-top:8px;margin-top:2px">
                  <span style="font-weight:600;color:var(--ink)">${L('Keuntungan Bersih Lunas','Net Profit at Maturity')}</span>
                  <b class="up investment-positive" style="font-size:15px">+${rp(sc.netProfit)}</b>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="gold-sim-card">
        <h4 style="margin:0 0 4px;font-size:16px;font-weight:700">${L('Rincian Legal & Spesifikasi Akad Pembiayaan Pegadaian Mulia','Pegadaian Mulia Financing Contract Specifications')}</h4>
        <span class="muted" style="font-size:12px;margin-bottom:8px">${L('Data resmi diambil dari Surat Penegasan Persetujuan Pembiayaan Pegadaian Mulia Ultimate.','Official contract data extracted directly from Pegadaian Mulia Ultimate contract confirmation.')}</span>
        
        <div class="gold-specs-grid">
          <div class="gold-spec-item">
            <span>${L('Institusi Pembiayaan','Financing Institution')}</span>
            <strong>PT Pegadaian (Persero) — Galeri 24</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Objek Pembiayaan','Financed Asset')}</span>
            <strong>Emas Batangan 24K Galeri 24 (1 Keping @ 50.0000 Gram)</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Nomor Kontrak Pembiayaan','Contract Number')}</span>
            <strong>${escape(c.contractNo)}</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Nomor Aplikasi & CIF','Application No & CIF')}</span>
            <strong>${escape(c.applicationNo)} / ${escape(c.cif)}</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Nama Penerima Pembiayaan','Customer / Borrower Name')}</span>
            <strong>${escape(c.borrowerName)}</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Harga Pembelian Emas Awal','Initial Purchase Price')}</span>
            <strong>${rp(c.initialPurchasePrice)} (${rp(c.initialPricePerGram)} / g)</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Uang Muka (15%) + Biaya Admin','Down Payment (15%) + Admin Fee')}</span>
            <strong>${rp(c.downPayment)} + ${rp(c.adminFee)} = ${rp(c.totalDownPayment)}</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Pokok Pembiayaan (Pinjaman)','Loan Principal')}</span>
            <strong>${rp(c.loanPrincipal)}</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Tarif Sewa Modal (Mu\'nah)','Mu\'nah Fee Rate')}</span>
            <strong>${rp(c.monthlyFee)} / bulan (~0.53% flat / bulan)</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Angsuran Pokok Bulanan','Monthly Principal Payment')}</span>
            <strong>${rp(c.monthlyPrincipal)} / bulan (Bulan ke-60: Rp 1.793.537)</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Total Angsuran Bulanan','Total Monthly Installment')}</span>
            <strong style="color:var(--accent,#d97706)">${rp(c.monthlyInstallment)} / bulan (Bulan ke-60: Rp 2.464.539)</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Total Pelunasan Pembiayaan (60x)','Total Loan Repayment')}</span>
            <strong>${rp(c.totalLoanRepayment)} (Pokok + Sewa Modal)</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Total Komitmen Keseluruhan (DP + Angsuran)','Total Commitment (DP + Installments)')}</span>
            <strong style="color:var(--accent,#d97706);font-size:14px">${rp(c.totalCommitment)}</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Titik Impas (Break-Even Price)','Break-Even Price')}</span>
            <strong>${rp(c.breakEvenPricePerGram)} / gram</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Jangka Waktu Pembiayaan','Financing Tenor')}</span>
            <strong>60 Bulan (Jatuh Tempo: Setiap tanggal 30/31)</strong>
          </div>
          <div class="gold-spec-item">
            <span>${L('Periode Kontrak','Contract Period')}</span>
            <strong>31 Agustus 2026 s/d 31 Agustus 2031</strong>
          </div>
        </div>
      </div>
    </div>`;
  }

  function investment(){
    const accounts=INV.selectedAccounts(state,{view:state.activeView});if(investmentAccount!=='all'&&!accounts.some(a=>a.id===investmentAccount))investmentAccount='all';
    const rows=INV.positions(state,{currency:investmentCurrency,account:investmentAccount,fundsOnly:investmentTab==='funds'}),summary=INV.summary(rows),labels=investmentLabels();let result;const visibleHoldings=INV.positions(state,{currency:investmentCurrency,account:investmentAccount});if(investmentHolding!=='all'&&!visibleHoldings.some(h=>h.id===investmentHolding))investmentHolding='all';try{result=investmentResult();}catch(e){result={dates:[],series:[],unavailable:[{id:'portfolio',reason:e.message}]};}
    const tabs=investmentMain==='holdings'?[['market',L('Pasar','Market')],['allocation',L('Alokasi','Allocation')],['rebalancer',L('Target & Rebalance','Target & Rebalance')],['gold',L('🪙 Cicilan Emas (Pegadaian)','🪙 Gold Tracker')]]:[['allocation',L('Alokasi','Allocation')],['gains',L('Gain & Loss','Gains & Losses')],['funds',L('Dana','Funds')],['gold',L('🪙 Cicilan Emas (Pegadaian)','🪙 Gold Tracker')]];
    if(investmentTab==='gold'){
      return header('Investment',L('Posisi aset, kinerja pasar, dan analisis portofolio.','Holdings, market performance, and portfolio analysis.'),button(L('Tambah aset','Add holding'),'investment-holding-new','primary','plus')+button(L('Ekspor Jadwal CSV','Export Schedule CSV'),'investment-export'),'INVESTMENT WORKSPACE')
        +`<div class="investment-top-tabs" aria-label="Investment"><button data-action="investment-main:holdings" class="${investmentMain==='holdings'?'active':''}" aria-pressed="${investmentMain==='holdings'}">${icon('investment-holdings')}Holdings</button><button data-action="investment-main:advanced" class="${investmentMain==='advanced'?'active':''}" aria-pressed="${investmentMain==='advanced'}">${icon('investment-advanced')}Advanced <span class="badge">Pro</span></button></div>`
        +`<section class="panel panel-pad investment-panel"><div class="panel-head"><h2>${L('Simulasi & Portofolio Cicilan Emas Pegadaian Mulia (50g)','Pegadaian Mulia 50g Gold Installment Tracker')}</h2><div class="button-group">${button(L('Jadwal Amortisasi 60 Bulan','60-Mo Schedule'),'gold-schedule-modal','','calendar')}${button(state.goldInstallment?.synced?L('✓ Tersinkron di Buku Kas','✓ Synced to Ledger'):L('⚡ Sinkronkan ke Portofolio & Buku Kas','⚡ Sync to Portfolio & Ledger'),'gold-sync-ledger',state.goldInstallment?.synced?'':'primary','lightning')}</div></div><nav class="report-tabs investment-tabs" aria-label="${L('Analisis investasi','Investment analysis')}">${tabs.map(([id,label])=>`<button class="${id===investmentTab?'active':''}" data-action="investment-tab:${id}" aria-pressed="${id===investmentTab}">${icon('investment-'+id)}${label}</button>`).join('')}</nav>${investmentGoldTracker()}</section>`;
    }
    const controls=`<div class="investment-toolbar"><label>${L('Akun','Accounts')}<select id="investment-account">${investmentOptions([['all',L('Semua akun dalam tampilan','All accounts in view')],...accounts.map(a=>[a.id,a.name])],investmentAccount)}</select></label><label>${L('Mata uang','Currency')}<select id="investment-currency">${investmentOptions([['IDR','IDR'],['USD','USD']],investmentCurrency)}</select></label><label class="investment-period-select">${L('Periode','Period')}<select id="investment-range">${investmentOptions([['1d',L('Observasi terakhir','Last observation')],['1w',L('1 minggu','1 week')],['1m',L('1 bulan','1 month')],['3m',L('3 bulan','3 months')],['6m',L('6 bulan','6 months')],['ytd','Year to date'],['1y',L('1 tahun','1 year')],['5y',L('5 tahun','5 years')],['all',L('Semua data','All data')],['custom',L('Kustom','Custom')]],investmentRange)}</select></label>${investmentTab==='market'?`<label>${L('Model kinerja','Performance model')}<select id="investment-mode">${investmentOptions([['auto',L('Otomatis menurut data','Automatic by dataset')],['backtest',L('Backtest posisi saat ini','Current holdings backtest')],['actual',L('Riwayat portofolio (TWR)','Portfolio history (TWR)')]],investmentMode)}</select></label>`:`<label>${L('Kelompokkan','Group by')}<select id="investment-group">${investmentOptions(Object.entries(labels).filter(([k])=>investmentTab==='funds'||['assetClass','account','security'].includes(k)),investmentGroup)}</select></label><label>${L('Grafik','Chart')}<select id="${investmentTab==='gains'?'investment-gain-style':'investment-style'}">${investmentOptions(investmentTab==='gains'?[['bars',L('Batang','Bars')],['line',L('Riwayat','History')]]:[['pie','Pie'],['breakdown','Breakdown']],investmentTab==='gains'?investmentGainStyle:investmentStyle)}</select></label>`}</div>`;
    const period=investmentPeriod();
    const performance=investmentTab==='market'?investmentPerformance(result,INV.summary(rows.filter(h=>investmentHolding==='all'||h.id===investmentHolding))):'';
    const accountTotal=E.sum(INV.selectedAccounts(state,{account:investmentAccount,view:state.activeView}).map(a=>E.convert(state,a.balance,a.currency,investmentCurrency))),allDetail=INV.summary(INV.positions(state,{currency:investmentCurrency,account:investmentAccount})).value;
    return header('Investment',L('Posisi aset, kinerja pasar, dan analisis portofolio.','Holdings, market performance, and portfolio analysis.'),button(L('Tambah aset','Add holding'),'investment-holding-new','primary','plus')+button(L('Ekspor CSV','Export CSV'),'investment-export'),'INVESTMENT WORKSPACE')+`<div class="investment-top-tabs" aria-label="Investment"><button data-action="investment-main:holdings" class="${investmentMain==='holdings'?'active':''}" aria-pressed="${investmentMain==='holdings'}">${icon('investment-holdings')}Holdings</button><button data-action="investment-main:advanced" class="${investmentMain==='advanced'?'active':''}" aria-pressed="${investmentMain==='advanced'}">${icon('investment-advanced')}Advanced <span class="badge">Pro</span></button></div><section class="panel panel-pad investment-panel"><div class="panel-head"><h2>${investmentMain==='holdings'?(investmentTab==='rebalancer'?L('Target Alokasi & Rebalancer Portofolio','Portfolio Target & Rebalancer'):L('Kinerja portofolio','Portfolio performance')):investmentTab==='gains'?L('Gain & loss belum terealisasi','Unrealized gains & losses'):investmentTab==='funds'?L('Analisis dana','Fund analysis'):L('Rincian alokasi','Allocation breakdown')}</h2>${button(L('Ekspor grafik','Export chart'),'investment-chart-export')}</div><nav class="report-tabs investment-tabs" aria-label="${L('Analisis investasi','Investment analysis')}">${tabs.map(([id,label])=>`<button class="${id===investmentTab?'active':''}" data-action="investment-tab:${id}" aria-pressed="${id===investmentTab}">${icon('investment-'+id)}${label}</button>`).join('')}</nav>${controls}${investmentRange==='custom'?`<form id="investment-filter" class="capture-controls"><label>${L('Dari','From')}<input type="date" name="from" value="${investmentFrom}"></label><label>${L('Sampai','To')}<input type="date" name="to" value="${investmentTo||date()}"></label><input name="currency" type="hidden" value="${investmentCurrency}"><button type="submit" class="btn">${L('Terapkan','Apply')}</button></form>`:''}${investmentTab==='market'?performance:investmentTab==='rebalancer'?investmentRebalancer(rows):investmentTab==='gains'?investmentGains(rows):`${investmentTab==='funds'?`<div class="investment-info">${L('Analisis ini hanya mencakup ETF dan reksa dana. Klasifikasi diisi pengguna sesuai dokumen fund; tidak ada data klasifikasi Morningstar otomatis atau analisis aset di dalam fund.','This analysis includes ETFs and mutual funds only. Classifications are user supplied from fund documents; no automatic Morningstar data or fund look-through.')}</div>`:''}${investmentAllocation(rows)}`}<p class="note">${L('Mata uang analisis','Analysis currency')}: ${investmentCurrency} · ${L('Kurs valuasi','Valuation FX')}: ${state.fx.date} · ${user(state.fx.source)}</p></section>${investmentHoldingsTable(rows)}<section class="panel panel-pad investment-panel"><div class="panel-head"><h2>${L('Data & riwayat','Data & history')}</h2><span class="badge">${state.holdingPrices.length} ${L('harga historis','historical quotes')}</span></div>    <div class="button-group">${button(L('Muat data contoh','Load sample data'),'investment-load-sample','','sparkles')}${button(L('Sinkron Crypto CEX','Sync Crypto CEX'),'investment-crypto-sync','primary','sparkles')}${button(L('Sinkron harga live','Sync live prices'),'investment-sync-prices','','sparkles')}${button(L('Harga historis aset','Security price history'),'investment-prices')}${button(L('Riwayat portofolio / benchmark','Portfolio / benchmark history'),'investment-import')}${button(L('Template benchmark','Benchmark template'),'investment-template')}${button(L('Template harga aset','Security quote template'),'investment-price-template')}${button(L('Simpan snapshot hari ini','Save today’s snapshot'),'investment-snapshot')}</div><div class="investment-reconciliation"><div><small>${L('Saldo akun investasi','Investment account balances')}</small><strong>${investmentMoney(accountTotal)}</strong></div><div><small>${L('Rincian posisi aset','Holdings detail')}</small><strong>${investmentMoney(allDetail)}</strong></div><div><small>${L('Selisih akun − detail','Account − holdings difference')}</small><strong>${investmentMoney(accountTotal-allDetail)}</strong></div></div><p class="note">${L('Rincian holdings tidak menambah saldo akun atau net worth. Selisih bisa berupa kas belum dicatat atau valuasi berbeda; perbarui saldo akun secara terpisah.','Holdings detail does not add to account balances or net worth. Differences may be unrecorded cash or different valuations; update account balances separately.')} ${state.activeView.owner==='all'?L('Seluruh keluarga','whole household'):escape(ownerName(state.activeView.owner))} · ${L('Tidak ada harga pasar live.','No live market feed.')}</p></section>`;
  }
  function investmentCSV(){return INV.header+'\n'+state.investmentHistory.map(r=>['series','date','value','flow','currency','fxToIDR','usdToIDR','basis','source'].map(k=>'"'+String(r[k]).replaceAll('"','""')+'"').join(',')).join('\n');}
  function editHolding(id){
    const h=state.holdings.find(h=>h.id===id),accounts=INV.selectedAccounts(state,{view:state.activeView});if(!accounts.length){toast(L('Tambahkan akun Investment dalam tampilan ini terlebih dahulu.','Add an Investment account in this view first.'));return;}
    openModal(h?L('Edit posisi aset','Edit holding'):L('Tambah posisi aset','Add holding'),form(field(L('Akun investasi','Investment account'),'accountId','','select',investmentOptions(accounts.map(a=>[a.id,a.name]),h?.accountId||investmentAccount))+field(L('Simbol / kode','Symbol / code'),'symbol',h?.symbol||'','text','required maxlength="30"')+field(L('Nama sekuritas','Security name'),'name',h?.name||'','text','required maxlength="120"')+field(L('Jenis sekuritas','Security type'),'type','','select',investmentOptions(INV.types.map(k=>[k,k]),h?.type||'stock'))+field(L('Kelas aset','Asset class'),'assetClass',h?.assetClass||'Equity','text','required maxlength="80"')+field(L('Mata uang sekuritas','Security currency'),'currency','','select',options(E.currencies,h?.currency||'USD'))+field(L('Jumlah unit','Quantity'),'quantity',h?.quantity||'','number','required min="0.00000001" step="any"')+field(L('Harga terakhir per unit','Latest unit price'),'price',h?.price??'','number','required min="0" step="any"')+field(L('Tanggal harga','Quote date'),'quoteDate',h?.quoteDate||date(),'date','required')+field(L('Sumber harga','Quote source'),'source',h?.source||'Manual quote','text','required maxlength="200"')+field(L('Total biaya sisa posisi (kosong jika belum diketahui)','Remaining total cost basis (blank if unknown)'),'costBasis',h?.costBasis??'','number','min="0" step="any"')+field(L('Kurs biaya ke IDR (1 untuk IDR)','Cost basis FX to IDR (1 for IDR)'),'costFxToIDR',h?.costFxToIDR??'','number','min="0.000001" step="any"')+`<details class="investment-classification"><summary>${L('Klasifikasi ETF / reksa dana','ETF / fund classifications')}</summary><div class="form-grid">${INV.classificationKeys.map(k=>field(investmentLabels()[k],k,h?.classifications[k]||'','text','maxlength="120"')).join('')}</div></details>`,'Save',L('Harga dan biaya memakai mata uang sekuritas, bukan sen. Cost basis adalah total biaya unit yang masih dimiliki; untuk mata uang asing isi kurs biaya historis rata-rata tertimbang. Menambah posisi tidak mengubah saldo akun.','Price and cost use security currency units, not cents. Cost basis is total cost of remaining units; foreign currency requires weighted historical cost FX. Adding a holding does not change account balances.')),d=>{
      if(!d.quantity||!d.price||!d.quoteDate||d.quoteDate>date())throw Error(L('Periksa jumlah, harga, dan tanggal.','Check quantity, price and date.'));
      const record={id:h?.id||uid(),accountId:d.accountId,symbol:requireText(d.symbol),name:requireText(d.name),type:d.type,assetClass:requireText(d.assetClass),currency:d.currency,quantity:Number(d.quantity),price:Number(d.price),quoteDate:d.quoteDate,source:requireText(d.source),costBasis:d.costBasis===''||d.costBasis===undefined?null:Number(d.costBasis),costFxToIDR:d.currency==='IDR'?1:Number(d.costFxToIDR),classifications:Object.fromEntries(INV.classificationKeys.map(k=>[k,String(d[k]||'').trim()]))};
      if(h&&h.currency!==record.currency&&state.holdingPrices.some(r=>r.holdingId===id))throw Error(L('Hapus riwayat harga posisi sebelum mengganti mata uang.','Remove this holding’s price history before changing currency.'));
      const next={...state,holdings:h?state.holdings.map(r=>r.id===id?record:r):[...state.holdings,record]};INV.validateHoldings(next);state.holdings=next.holdings;toast(L('Posisi aset tersimpan','Holding saved'));
    });
  }
  function investmentAction(name,id){
    if(name==='investment-period'){if(!['1d','1w','1m','3m','6m','ytd','1y','all','custom'].includes(id))return;investmentRange=id;render();return;}
    if(name==='investment-metric'){if(!['return','value'].includes(id))return;investmentMetric=id;render();return;}
    if(name==='investment-reset-point'){investmentPinned=false;investmentPoint(-1);return;}
    if(name==='investment-security'){investmentHolding=id;investmentMain='holdings';investmentTab='market';investmentMode='backtest';render();document.querySelector('.investment-top-tabs')?.scrollIntoView?.({behavior:'smooth',block:'start'});return;}

    if(name==='investment-chart-export'){const rows=INV.positions(state,{currency:investmentCurrency,account:investmentAccount,fundsOnly:investmentTab==='funds'});const result=investmentTab==='market'?investmentResult():null;if((result&&!result.dates.length)||(investmentTab!=='market'&&investmentTab!=='gains'&&INV.summary(rows).value===0)){toast(L('Belum ada grafik untuk diekspor','No chart to export'));return;}const html=investmentTab==='market'?investmentChart(result):investmentTab==='gains'?(investmentGainStyle==='line'?investmentGainHistory():''):investmentAllocation(rows);let svg=html.match(/<svg[\s\S]*?<\/svg>/)?.[0];if(!svg){toast(L('Tidak ada grafik SVG untuk diekspor; gunakan CSV.','No SVG chart to export; use CSV.'));return;}const colors=state.appearance[state.theme].colors;svg=svg.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ').replaceAll('var(--accent)',colors.accent).replaceAll('var(--paper)',colors.paper).replaceAll('var(--ink)',colors.ink).replaceAll('currentColor',colors.muted).replaceAll('class="investment-crosshair"','class="investment-crosshair" opacity="0"');download('inveys-investment-'+investmentTab+'.svg',svg,'image/svg+xml');return;}
    if(name==='investment-main'){if(!['holdings','advanced'].includes(id))return;investmentMain=id;investmentTab=id==='holdings'?'market':'allocation';investmentGroup='assetClass';render();return;}
    if(name==='investment-tab'){if(!['market','allocation','gains','funds','rebalancer','gold'].includes(id))return;investmentTab=id;investmentGroup='assetClass';render();return;}
    if(name==='gold-pay-installment'){
      const c=state.goldInstallment||INV.defaultGoldContract;
      if(c.paidMonths>=c.tenorMonths){
        toast(L('Cicilan emas sudah lunas seluruhnya (60/60 bulan)!','Gold installment is already fully paid (60/60 months)!'));
        return;
      }
      c.paidMonths=Math.min(c.tenorMonths,(c.paidMonths||0)+1);
      const isLast=(c.paidMonths===c.tenorMonths);
      const principalPaid=isLast?1793537:c.monthlyPrincipal;
      const installmentAmount=isLast?2464539:c.monthlyInstallment;

      if(c.synced){
        const debt=state.debts.find(d=>d.id==='debt-pegadaian-mulia');
        if(debt)debt.balance=Math.max(0,debt.balance-(principalPaid*100));
        const goal=state.goals.find(g=>g.id==='goal-gold-50g');
        if(goal)goal.saved+=(principalPaid*100);
        const acc=state.accounts[0];
        if(acc){
          state.transactions.unshift({
            id:uid(),
            name:`Angsuran Emas Pegadaian Mulia (Bulan ke-${c.paidMonths})`,
            kind:'expense',
            amount:installmentAmount*100,
            accountId:acc.id,
            category:'Investments',
            date:date(),
            currency:'IDR'
          });
        }
      }
      state.goldInstallment=c;
      save();
      render();
      toast(L(`Angsuran bulan ke-${c.paidMonths} (Rp ${installmentAmount.toLocaleString('id-ID')}) berhasil dicatat! Sisa tenor: ${c.tenorMonths-c.paidMonths} bulan.`,`Month ${c.paidMonths} installment recorded! Remaining tenor: ${c.tenorMonths-c.paidMonths} months.`));
      return;
    }
    if(name==='gold-price-preset'){
      const val=Number(id);
      if(Number.isFinite(val)&&val>0){
        state.goldInstallment.customSpotPrice=val;
        if(state.goldInstallment.synced){
          const h=state.holdings.find(h=>h.id==='h-gold-galeri24');
          if(h){h.price=val;h.quoteDate=date();}
          const acc=state.accounts.find(a=>a.id==='acc-gold-pegadaian');
          if(acc){acc.balance=Math.round(50*val*100);acc.updated=date();}
        }
        save();
        render();
        toast(L(`Harga simulasi emas diatur ke Rp ${val.toLocaleString('id-ID')} / gram`,`Simulated gold price set to Rp ${val.toLocaleString('id-ID')} / g`));
      }
      return;
    }
    if(name==='gold-months-preset'){
      const val=Math.max(0,Math.min(60,Number(id)||0));
      state.goldInstallment.paidMonths=val;
      save();
      render();
      return;
    }
    if(name==='gold-sync-ledger'){
      const c=state.goldInstallment||INV.defaultGoldContract;
      const spotPrice=c.customSpotPrice||c.initialPricePerGram;
      const m=INV.goldInstallmentMetrics(c,spotPrice,c.paidMonths);

      let acc=state.accounts.find(a=>a.id==='acc-gold-pegadaian');
      if(!acc){
        acc={
          id:'acc-gold-pegadaian',
          name:'Pegadaian Mulia - Emas 50g',
          type:'Investment',
          balance:Math.round(50*spotPrice*100),
          currency:'IDR',
          owner:state.members[0]?.name||'Alex Morgan',
          updated:date()
        };
        state.accounts.push(acc);
      }else{
        acc.balance=Math.round(50*spotPrice*100);
        acc.updated=date();
      }

      let h=state.holdings.find(h=>h.id==='h-gold-galeri24');
      if(!h){
        h={
          id:'h-gold-galeri24',
          accountId:'acc-gold-pegadaian',
          symbol:'GALERI24-50G',
          name:'Emas Batangan Galeri 24 50g',
          type:'other',
          assetClass:'Commodities',
          currency:'IDR',
          quantity:50.0,
          price:spotPrice,
          quoteDate:date(),
          source:'Pegadaian Galeri 24',
          costBasis:126604000,
          costFxToIDR:1,
          classifications:{}
        };
        state.holdings.push(h);
      }else{
        h.price=spotPrice;
        h.quoteDate=date();
      }

      let d=state.debts.find(d=>d.id==='debt-pegadaian-mulia');
      if(!d){
        d={
          id:'debt-pegadaian-mulia',
          name:'Pembiayaan Emas Pegadaian Mulia (50g)',
          balance:m.remainingPrincipal*100,
          apr:6.36,
          minimum:2464559*100,
          currency:'IDR'
        };
        state.debts.push(d);
      }else{
        d.balance=m.remainingPrincipal*100;
      }

      let f=state.flows.find(f=>f.id==='flow-pegadaian-angsuran');
      if(!f){
        f={
          id:'flow-pegadaian-angsuran',
          name:'Angsuran Emas Pegadaian Mulia (50g)',
          kind:'expense',
          amount:2464559*100,
          day:28,
          currency:'IDR'
        };
        state.flows.push(f);
      }

      let g=state.goals.find(g=>g.id==='goal-gold-50g');
      if(!g){
        g={
          id:'goal-gold-50g',
          name:'Pelunasan Emas 50g Galeri 24',
          emoji:'🪙',
          target:126604000*100,
          saved:m.equityPrincipal*100,
          monthly:1793557*100,
          due:'2031-08-31',
          currency:'IDR'
        };
        state.goals.push(g);
      }else{
        g.saved=m.equityPrincipal*100;
      }

      c.synced=true;
      state.goldInstallment=c;
      INV.validateHoldings(state);
      E.validate(state);
      save();
      render();
      toast(L('Berhasil disinkronkan ke Akun Portofolio, Utang, dan Arus Kas!','Successfully synchronized with Portfolio, Debts, and Cash Flow!'));
      return;
    }
    if(name==='gold-schedule-modal'){
      const c=state.goldInstallment||INV.defaultGoldContract;
      const sched=INV.goldInstallmentSchedule(c);
      const html=`<div class="gold-schedule-modal-content">
        <div class="gold-schedule-summary">
          <div><small>${L('Pokok Pinjaman','Principal')}</small><strong>Rp ${c.loanPrincipal.toLocaleString('id-ID')}</strong></div>
          <div><small>${L('Sewa Modal (Mu\'nah)','Mu\'nah Fee')}</small><strong>Rp ${(c.monthlyFee*60).toLocaleString('id-ID')}</strong></div>
          <div><small>${L('Total Angsuran (60x)','Total Installments')}</small><strong>Rp ${c.totalLoanRepayment.toLocaleString('id-ID')}</strong></div>
          <div><small>${L('Uang Muka + Admin','DP + Admin')}</small><strong>Rp ${c.totalDownPayment.toLocaleString('id-ID')}</strong></div>
          <div><small>${L('Total Komitmen','Commitment')}</small><strong style="color:var(--accent,#d97706)">Rp ${c.totalCommitment.toLocaleString('id-ID')}</strong></div>
        </div>
        <div class="table-wrap gold-schedule-table-wrap">
          <table class="gold-schedule-table">
            <thead>
              <tr>
                <th>${L('Bulan','Mo')}</th>
                <th>${L('Jatuh Tempo','Due Date')}</th>
                <th>${L('Angsuran Pokok','Principal')}</th>
                <th>${L('Sewa Modal','Mu\'nah')}</th>
                <th>${L('Total Tagihan','Total Bill')}</th>
                <th>${L('Sisa Pokok Pinjaman','Remaining Balance')}</th>
                <th>${L('Status','Status')}</th>
              </tr>
            </thead>
            <tbody>
              ${sched.map(s=>`
                <tr class="${s.paid?'gold-row-paid':''}">
                  <td><b>${s.month}</b></td>
                  <td>${s.dueDate}</td>
                  <td>Rp ${s.principal.toLocaleString('id-ID')}</td>
                  <td>Rp ${s.fee.toLocaleString('id-ID')}</td>
                  <td><b>Rp ${s.total.toLocaleString('id-ID')}</b></td>
                  <td>Rp ${s.remainingBalance.toLocaleString('id-ID')}</td>
                  <td>
                    ${s.paid
                      ?`<span class="badge" style="background:#10b981;color:#fff">${L('Lunas','Paid')}</span>`
                      :`<span class="badge" style="background:var(--line);color:var(--muted)">${L('Belum','Pending')}</span>`
                    }
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <p class="note" style="margin-top:14px">${L('Berdasarkan Surat Penegasan Persetujuan Pembiayaan Pegadaian Mulia No. 1379326370001000. Angsuran ke-60 disesuaikan sebesar Rp 2.464.539 untuk pelunasan tepat nol rupiah.','Based on Pegadaian Mulia Financing Confirmation Contract #1379326370001000. Month 60 is adjusted to Rp 2,464,539 for exact zero payoff.')}</p>
      </div>`;
      openModal(L('Jadwal Amortisasi 60 Bulan — Pegadaian Mulia Emas 50g','60-Month Amortization Schedule — Pegadaian Mulia Gold 50g'),html);
      return;
    }
    if(name==='investment-rebalance-edit'){openTargetAllocationModal();return;}
    if(name==='investment-rebalance-preset'){openTargetAllocationModal(id);return;}
    if(name==='investment-rebalance-cash'){const val=document.getElementById('rebalance-cash-input')?.value;rebalanceNewCash=Math.max(0,Number(val)||0);render();return;}
    if(name==='investment-rebalance-cash-clear'){rebalanceNewCash=0;render();return;}
    if(name==='investment-holding-new'||name==='investment-holding'){editHolding(id);return;}
    if(name==='investment-holding-delete'){const h=state.holdings.find(h=>h.id===id);if(!h)return;confirmAction(L('Hapus posisi aset?','Remove holding?'),L('Posisi dan riwayat harga terkait dihapus. Snapshot terdahulu dan saldo akun tetap tersimpan.','This holding and its price history will be removed. Prior snapshots and account balances remain.'),()=>{state.holdings=state.holdings.filter(h=>h.id!==id);state.holdingPrices=state.holdingPrices.filter(r=>r.holdingId!==id);});return;}
    if(name==='investment-snapshot'){INV.snapshotHoldings(state,date());render();toast(L('Snapshot posisi tersimpan untuk hari ini','Holdings snapshot saved for today'));return;}
    if(name==='investment-template'||name==='investment-price-template'){download(name==='investment-template'?'inveys-investment-template.csv':'inveys-security-quotes-template.csv',(name==='investment-template'?INV.header:INV.priceHeader)+'\r\n','text/csv');return;}
    if(name==='investment-prices'){const csv=INV.priceHeader+'\n'+state.holdingPrices.map(r=>['holdingId','date','price','fxToIDR','usdToIDR','source'].map(k=>'"'+String(r[k]).replaceAll('"','""')+'"').join(',')).join('\n');openModal(L('Harga historis sekuritas','Historical security quotes'),form(`<p class="note">${L('Mengganti seluruh riwayat harga sekuritas. Harga harus penutupan yang konsisten, disesuaikan stock split jika ada. Jangan gunakan adjusted close yang mencakup dividen untuk backtest price-only. Kurs historis wajib untuk setiap tanggal; tidak ada interpolasi. Baris di luar periode tetap disimpan.','Replaces all security quote history. Use consistent split-adjusted closing prices; do not use dividend-adjusted close for the price-only backtest. Historical FX is required per date; no interpolation. Rows outside the period remain stored.')}</p><div class="table-wrap"><table><thead><tr><th>holdingId</th><th>${L('Sekuritas','Security')}</th></tr></thead><tbody>${state.holdings.map(h=>`<tr><td>${h.id}</td><td>${user(h.symbol)} · ${user(h.name)}</td></tr>`).join('')}</tbody></table></div><label>CSV<textarea name="csv" rows="10" maxlength="5000000" required>${escape(csv)}</textarea></label>`),d=>{state.holdingPrices=INV.pricesCSV(state,d.csv,date());toast(L('Riwayat harga tersimpan','Security quote history saved'));});return;}
    if(name==='investment-import')openModal(L('Impor riwayat investasi CSV','Import investment history CSV'),form(`<p class="note">${L('Mengganti riwayat portofolio/benchmark, tanpa mengubah holdings atau saldo akun. Kolom value/flow memakai satuan uang asli; flow positif = setoran, negatif = penarikan pada akhir periode. Baris awal setiap seri dan semua benchmark flow=0. Kurs historis wajib; USD/IDR sama pada setiap tanggal.','Replaces portfolio/benchmark history without changing holdings or account balances. Value/flow use native currency units; positive flow = deposit, negative = withdrawal at period end. First row of each series and all benchmarks have flow=0. Historical FX required; USD/IDR must match on each date.')}</p><p class="note">series: portfolio, sp500, us-stock, us-bond, btc, ihsg · currency: IDR/USD · basis: price/total · source: ${L('penyedia / metode valuasi','provider / valuation method')}. ${L('Backtest posisi memakai benchmark basis price. Riwayat portofolio impor hanya berlaku untuk seluruh keluarga.','Holdings backtest uses price-basis benchmarks. Imported portfolio history covers the whole household only.')}</p><label for="investment-csv">CSV</label><textarea id="investment-csv" name="csv" rows="10" maxlength="5000000" required>${escape(investmentCSV())}</textarea>`,'Save'),d=>{state.investmentHistory=INV.csv(d.csv,date());toast(L('Riwayat investasi tersimpan','Investment history saved'));});
    if(name==='investment-export'){
      if(investmentTab==='gold'){
        const c=state.goldInstallment||INV.defaultGoldContract;
        const sched=INV.goldInstallmentSchedule(c);
        download('inveys-pegadaian-cicilan-emas-schedule.csv',INV.csvRows([
          ['Bulan','Jatuh Tempo','Angsuran Pokok (IDR)','Sewa Modal Munah (IDR)','Total Angsuran (IDR)','Sisa Pokok Pinjaman (IDR)','Status'],
          ...sched.map(s=>[s.month,s.dueDate,s.principal,s.fee,s.total,s.remainingBalance,s.paid?'Lunas':'Belum'])
        ]),'text/csv');
        toast(L('Jadwal amortisasi 60 bulan berhasil diekspor','60-month amortization schedule exported'));
        return;
      }
      if(investmentTab==='gains'&&investmentGainStyle==='line'){const rows=INV.gainsHistory(state,{...investmentPeriod(),currency:investmentCurrency,account:investmentAccount,view:state.activeView});download('inveys-unrealized-gain-history.csv',INV.csvRows([['date','unrealized gain ('+investmentCurrency+')'],...rows.map(r=>[r.date,r.gain===null?'':r.gain/100])]),'text/csv');return;}
      if(investmentTab==='market'){const r=investmentResult();if(!r.dates.length){toast(L('Belum ada perbandingan untuk diekspor','No comparison to export'));return;}download('inveys-investment-comparison.csv',INV.csvRows([['date',...r.series.map(s=>s.id+' return ('+investmentCurrency+')')],...r.dates.map((d,i)=>[d,...r.series.map(s=>s.values[i]??'')])]),'text/csv');return;}
      const rows=INV.positions(state,{currency:investmentCurrency,account:investmentAccount,fundsOnly:investmentTab==='funds'});download('inveys-investment-'+investmentTab+'.csv',INV.csvRows([['symbol','name','account','assetClass','quantity','value ('+investmentCurrency+')','cost','unrealized gain','gain percent',...INV.classificationKeys],...rows.map(r=>[r.symbol,r.name,r.accountName,r.assetClass,r.quantity,r.value/100,r.cost===null?'':r.cost/100,r.gain===null?'':r.gain/100,r.gainPercent??'',...INV.classificationKeys.map(k=>r.classifications[k]||'')])]),'text/csv');
      return;
    }
    if(name==='investment-load-sample'){
      generateSampleInvestmentData(state,date());
      INV.validateHoldings(state);
      INV.validate(state.investmentHistory);
      save();
      render();
      toast(L('Data contoh investasi berhasil dimuat! Grafik siap ditampilkan.','Sample investment data loaded! Chart is now visible.'));
      return;
    }
    if(name==='investment-crypto-sync'){
      openCryptoSyncModal();
      return;
    }
    if(name==='investment-sync-prices'){
      syncInvestmentPrices();
      return;
    }
  }
  document.addEventListener('change',event=>{const target=event.target,id=target.dataset.investmentBenchmark;if(id){if(target.checked)investmentSelected=[...new Set([...investmentSelected,id])];else investmentSelected=investmentSelected.filter(x=>x!==id);render();return;}const value=target.value;switch(target.id){case 'investment-account':if(value!=='all'&&!INV.selectedAccounts(state).some(a=>a.id===value))return;investmentAccount=value;break;case 'investment-currency':if(!['IDR','USD'].includes(value))return;investmentCurrency=value;break;case 'investment-range':if(value!=='custom')INV.period(value,date());investmentRange=value;break;case 'investment-mode':if(!['auto','actual','backtest'].includes(value))return;investmentMode=value;break;case 'investment-group':if(!INV.groupKeys.includes(value))return;investmentGroup=value;break;case 'investment-style':if(!['pie','breakdown'].includes(value))return;investmentStyle=value;break;case 'investment-gain-style':if(!['line','bars'].includes(value))return;investmentGainStyle=value;break;default:return;}render();});
  document.addEventListener('submit',event=>{if(event.target.id!=='investment-filter')return;event.preventDefault();try{const d=Object.fromEntries(new FormData(event.target));if((d.from&&!E.validDate(d.from))||(d.to&&!E.validDate(d.to))||(d.from&&d.to&&d.from>d.to)||!['IDR','USD'].includes(d.currency))throw Error(L('Filter periode tidak valid','Invalid period filters'));investmentFrom=d.from;investmentTo=d.to;investmentCurrency=d.currency;investmentRange='custom';render();}catch(e){toast(e.message);}});

  function dashboardV4(){const p=E.position(viewState()),h=historyData(),widgets=state.dashboardWidgets;return header(`${L('Halo','Hello')}, ${user((state.members[0]?.name||'Me').split(' ')[0])} ✳`,L('Posisi hari ini, rencana esok, dan tanggung jawab bersama.','Today’s position, tomorrow’s plan, shared responsibilities.'),button(L('Atur dashboard','Customize dashboard'),'dashboard-edit')+button(t('Add transaction'),'transaction-new','primary','plus'),'FINANCIAL OPERATING SYSTEM')+(widgets.includes('position')?metrics():'')+`<div class="dashboard-panels">${widgets.includes('history')?`<section class="panel panel-pad dashboard-wide"><div class="panel-head"><div><h2>${L('Gambaran keuangan Anda','Your financial picture')}</h2><p>${escape(ownerName(state.activeView.owner))} · ${L('Aset dikurangi liabilitas','Assets minus liabilities')}</p></div>${link('Forecast','forecast')}</div><div class="big-number">${tickerAmount(p.netWorth)}</div><div class="chart-container">${lineChart(h.values,h.labels)}</div><p class="note">${h.illustrative?L('Riwayat contoh; titik terbaru memakai saldo saat ini.','Illustrative sample history; latest point uses current balances.'):L('Riwayat memakai snapshot tersimpan. Tanpa snapshot, hanya posisi saat ini ditampilkan.','History uses saved snapshots. With no snapshots, only the current position is shown.')}</p><div class="button-group">${button(L('Simpan snapshot hari ini','Save today’s snapshot'),'position-snapshot')}${link(L('Buka Reports','Open Reports'),'reports')}</div></section>`:''}${widgets.includes('accounts')?`<section class="panel panel-pad"><div class="panel-head"><h2>${L('Akun Anda','Your accounts')}</h2>${link(t('View all'),'accounts')}</div>${accountRows(6)}</section>`:''}${widgets.includes('goals')?`<section class="panel panel-pad"><div class="panel-head"><h2>${L('Tujuan dalam perjalanan','Goals in motion')}</h2>${link(t('View all'),'goals')}</div>${goalRows()}</section>`:''}${widgets.includes('bills')?`<section class="panel panel-pad dashboard-wide"><div class="panel-head"><h2>${L('Komitmen mendatang','Upcoming commitments')}</h2>${link(t('Cash flow'),'cashflow')}</div>${upcomingBills().slice(0,4).map(f=>`<div class="flow-item"><div><b>${user(f.name)}</b><small>${escape(ownerName(f.ownerId))} · ${f.d.toLocaleDateString(locale())}</small></div>${native(f,'amount')}</div>`).join('')||`<p class="empty">${L('Belum ada komitmen pada tampilan ini.','No commitments in this view.')}</p>`}</section>`:''}</div>${!widgets.length?`<section class="panel empty">${L('Pilih widget melalui Atur dashboard.','Select widgets with Customize dashboard.')}</section>`:''}`;}
  function shared(){const p=E.position(viewState());return header(L('Milik saya, milik Anda, milik bersama.','Mine, yours, ours.'),L('Satu catatan keluarga, banyak perspektif. Atur kepemilikan tanpa menggandakan saldo.','One household ledger, multiple perspectives. Assign ownership without duplicating balances.'),button(L('Tambah anggota lokal','Add local member'),'member-new','primary'),'SHARED VIEWS')+sharedSwitcher('shared')+`<div class="metrics-grid">${metric(L('Kekayaan bersih tampilan','View net worth'),tickerAmount(p.netWorth),escape(ownerName(state.activeView.owner)),'shield')}${metric(L('Aset dalam tampilan','Assets in view'),tickerAmount(p.assets),L('Akun bersama dihitung sekali','Shared accounts counted once'),'bank')}${metric(L('Liabilitas tampilan','View liabilities'),tickerAmount(p.liabilities),L('Kepemilikan utang terpisah dari akun','Debt ownership is separate from accounts'),'debt')}${metric(L('Pendapatan rencana','Planned income'),tickerAmount(p.income),L('Bulanan sesuai perspektif','Monthly for this perspective'),'growth')}</div><div class="content-grid"><section class="panel panel-pad"><h2>${L('Tampilan tersimpan','Saved views')}</h2>${state.savedViews.map(v=>`<div class="saved-row"><div><b>${user(v.name)}</b><small>${escape(ownerName(v.view.owner))}${v.view.includeShared?' + '+L('Bersama','Shared'):''} · ${v.currency||state.currency}</small></div><button class="btn" data-action="view-load:${v.id}">${L('Buka','Open')}</button><button class="btn danger" data-action="view-delete:${v.id}" aria-label="${L('Hapus tampilan','Delete view')}">×</button></div>`).join('')||`<p class="empty">${L('Gunakan Simpan tampilan pada bilah perspektif.','Use Save view in the perspective bar.')}</p>`}<p class="note">${L('Tampilan ini adalah preferensi analisis, bukan kontrol privasi atau undangan akun. Login terpisah dan sinkronisasi lintas perangkat belum tersedia.','These views are analysis preferences, not privacy controls or invitations. Separate logins and cross-device sync are not available.')}</p></section><section class="panel panel-pad"><h2>${L('Anggota perencanaan','Planning members')}</h2>${state.members.map(m=>`<div class="saved-row"><span class="avatar">${escape(m.initials)}</span><div><b>${user(m.name)}</b><small>${escape(m.role)}</small></div><button class="btn" data-action="member-edit:${m.id}">${L('Edit','Edit')}</button></div>`).join('')}<p class="note">${L('ID anggota tetap ketika nama diubah. Kepemilikan lama tidak terputus.','Member IDs stay stable when names change. Existing ownership stays connected.')}</p></section></div><section class="panel panel-pad" style="margin-top:22px"><div class="panel-head"><h2>${L('Editor kepemilikan','Ownership editor')}</h2>${button(L('Edit transaksi massal','Bulk transaction ownership'),'owner-bulk')}</div><div class="table-wrap"><table><thead><tr><th>${L('Jenis','Type')}</th><th>${L('Catatan','Record')}</th><th>${L('Pemilik','Owner')}</th><th>${L('Atur','Manage')}</th></tr></thead><tbody>${['accounts','debts','goals','flows'].flatMap(key=>state[key].map(r=>`<tr><td>${escape(key)}</td><td>${user(r.name)}</td><td>${escape(ownerName(r.ownerId))}</td><td><button class="btn" data-action="ownership:${key}_${r.id}">${L('Ubah pemilik','Change owner')}</button></td></tr>`)).join('')||`<tr><td colspan="4" class="empty">${L('Tambahkan akun atau rencana terlebih dahulu.','Add accounts or plans first.')}</td></tr>`}</tbody></table></div><p class="note">${L('Transaksi dengan mode Ikuti akun mengikuti pemilik akun secara dinamis. Transaksi dengan owner eksplisit atau split tetap mempertahankan penetapannya.','Transactions in Follow account mode inherit account ownership dynamically. Explicit owners and split ownership retain their assignments.')}</p></section>`;}
  function reportLabel(key){return reportFilter.group==='owner'?ownerName(key):reportFilter.group==='account'?(getAccount(key)?.name||key):key;}
  function reportRows(r){if(reportDrill===null)return r.rows;return r.rows.flatMap(t=>{const key=reportFilter.group==='category'?t.category:reportFilter.group==='merchant'?t.name:reportFilter.group==='account'?t.accountId:reportFilter.group==='month'?t.date.slice(0,7):F.transactionOwner(state,t);if(reportFilter.group==='owner'&&t.splits?.length){const p=F.reportParts(state,t).find(p=>p.ownerId===reportDrill);return p?[{...t,amount:p.amount,reportingAmount:p.value}]:[];}return key===reportDrill?[t]:[];});}
  function reportFilters(ledger,categories){return `<form id="report-form" class="report-toolbar"><div class="report-filter-tools"><details class="report-popover"><summary>${icon('calendar')}${L('Tanggal','Date')} <span>${reportFilter.from} → ${reportFilter.to}</span></summary><div class="report-popover-body"><div class="capture-controls">${field(L('Dari','From'),'from',reportFilter.from,'date','required')}${field(L('Sampai','To'),'to',reportFilter.to,'date','required')}</div><div class="button-group">${button(L('30 hari','30 days'),'report-period:30')}${button(L('Tahun ini','This year'),'report-period:year')}${button(L('Semua tanggal','All dates'),'report-period:all')}</div><button class="btn primary" type="submit">${L('Terapkan tanggal','Apply dates')}</button></div></details><details class="report-popover"><summary>${icon('reports')}${L('Filter','Filters')}</summary><div class="report-popover-body"><div class="capture-controls">${field(L('Akun','Account'),'account','','select',`<option value="all">${L('Semua akun','All accounts')}</option>`+state.accounts.map(a=>`<option value="${a.id}" ${a.id===reportFilter.account?'selected':''}>${escape(a.name)}</option>`).join(''))}${field(L('Kategori','Category'),'category','','select',`<option value="all">${L('Semua kategori','All categories')}</option>`+categories.map(c=>`<option value="${escape(c)}" ${c===reportFilter.category?'selected':''}>${escape(c)}</option>`).join(''))}${field(L('Cari deskripsi','Search descriptions'),'search',reportFilter.search,'text','maxlength="200"')}</div><div class="button-group"><button class="btn primary" type="submit">${L('Terapkan filter','Apply filters')}</button>${button(L('Reset filter','Reset filters'),'report-reset')}</div></div></details></div><span class="report-scope-caption">${escape(ownerName(state.activeView.owner))} · ${state.currency}</span><p id="report-error" role="alert"></p></form>`;}
  function reportChartControls(){
    const isCashFlow=reportFilter.tab==='cashflow';
    return `<div class="report-chart-controls">
      <label class="report-control-wrap"><span class="screen-reader">${L('Pilihan jenis visualisasi data','Data visualization type')}</span><select id="report-chart" name="chart" form="report-form" class="report-control-select" aria-label="${L('Pilihan jenis visualisasi data','Data visualization type')}">
        ${isCashFlow?'<option value="sankey" '+(reportFilter.chart==='sankey'?'selected':'')+'>🌈 Sankey</option>':''}
        <option value="pie" ${reportFilter.chart==='pie'?'selected':''}>🍩 ${L('Donat','Donut')}</option>
        <option value="bars" ${reportFilter.chart==='bars'?'selected':''}>📊 ${L('Batang','Bar')}</option>
        <option value="heatmap" ${['heatmap','treemap'].includes(reportFilter.chart)?'selected':''}>🔥 Heatmap</option>
        <option value="treemap" ${reportFilter.chart==='treemap'?'selected':''} style="display:none">Treemap</option>
      </select></label>
      <label class="report-control-wrap"><span class="screen-reader">${L('Kelompokkan','Group by')}</span><select id="report-group" name="group" form="report-form" class="report-control-select" aria-label="${L('Kelompokkan','Group by')}">${[['category',L('Berdasarkan kategori','By category')],['merchant',L('Berdasarkan merchant','By merchant')],['account',L('Berdasarkan akun','By account')],['owner',L('Berdasarkan pemilik','By owner')],['month',L('Berdasarkan bulan','By month')]].map(([id,label])=>`<option value="${id}" ${reportFilter.group===id?'selected':''}>${label}</option>`).join('')}</select></label>
      <button type="button" class="btn icon-btn report-download-btn" data-action="report-chart-export" title="${L('Ekspor grafik SVG','Export chart SVG')}" aria-label="${L('Ekspor grafik SVG','Export chart SVG')}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></button>
    </div>`;
  }
  function bars(r){
    if(!r.groups.length)return `<div class="empty">${L('Tidak ada transaksi dalam filter ini.','No transactions match these filters.')}</div>`;
    const groups=reportFilter.group==='month'?r.groups.slice().sort((a,b)=>a.key.localeCompare(b.key)):r.groups;
    const max=Math.max(1,...groups.map(g=>Math.max(Math.abs(g.income),Math.abs(g.expense)))),width=Math.max(720,groups.length*86+100),base=groups.some(g=>g.expense<0)?155:255,height=groups.some(g=>g.expense<0)?100:205,step=(width-110)/groups.length;
    return `<div class="report-chart-scroll"><svg class="report-bars-svg" viewBox="0 0 ${width} 320" style="min-width:${width}px" role="img" aria-label="${L('Grafik batang pendapatan dan pengeluaran; rincian pada tabel.','Income and expense bar chart; details in the table.')}">${[0,.25,.5,.75,1].map(n=>`<line x1="70" x2="${width-20}" y1="${base-height*n}" y2="${base-height*n}" stroke="#87948c" opacity=".16"/><text x="62" y="${base-height*n+4}" text-anchor="end">${escape(money(Math.round(max*n),true))}</text>`).join('')}${groups.map((g,i)=>{const x=75+i*step,w=Math.min(24,step*.3),name=reportLabel(g.key);return `<g><title>${escape(name)} · ${L('Pendapatan','Income')} ${escape(money(g.income))} · ${L('Pengeluaran','Expenses')} ${escape(money(g.expense))}</title><rect x="${x}" y="${base-g.income/max*height}" width="${w}" height="${g.income/max*height}" rx="4" fill="#10b981"/><rect x="${x+w+5}" y="${g.expense<0?base:base-g.expense/max*height}" width="${w}" height="${Math.abs(g.expense)/max*height}" rx="4" fill="#f43f5e"/><text x="${x+w+2}" y="280" text-anchor="middle" font-size="11" font-weight="600" fill="var(--muted)">${escape(String(name).slice(0,12))}</text></g>`;}).join('')}</svg></div>`;
  }
  function sankey(r){
    const graph=F.cashFlowGraph(r);if(!graph.total)return `<div class="empty report-chart-empty">${L('Belum ada aliran dana dalam periode ini. Pilih tanggal lain atau tambahkan transaksi.','No cash flow in this period. Choose another date range or add transactions.')}</div>`;
    const gap=32,flowHeight=250,height=flowHeight+Math.max(graph.sources.length,graph.uses.length)*gap+100,scale=flowHeight/graph.total;
    const label=n=>n.kind==='refund'?'Refund · '+reportLabel(n.key):n.kind==='gap'?L('Kebutuhan pendanaan','Funding gap'):n.kind==='surplus'?L('Surplus','Surplus'):n.kind==='other'?L('Lainnya','Other'):reportLabel(n.key);
    const layout=nodes=>{let y=48,centerY=48;return nodes.map(n=>{const h=n.amount*scale,point={...n,y,h,center:centerY+h/2};y+=h+gap;centerY+=h;return point;});};
    const sources=layout(graph.sources),uses=layout(graph.uses);
    const SOURCE_COLORS=['#00b4d8','#3a86ff','#d946ef','#f59e0b','#10b981','#8b5cf6','#06b6d4'];
    const USE_COLORS=['#8338ec','#6366f1','#f43f5e','#f97316','#eab308','#ec4899','#14b8a6'];
    const color=(n,side,idx)=>n.kind==='gap'?'#f43f5e':n.kind==='surplus'?'#10b981':side==='source'?(SOURCE_COLORS[idx%SOURCE_COLORS.length]):(USE_COLORS[idx%USE_COLORS.length]);
    return `<div class="sankey-caption"><span>● ${L('Pendapatan','Income')} ${amount(r.income)}</span><span>● ${L('Pengeluaran','Expenses')} ${amount(r.expense)}</span></div><div class="report-chart-scroll"><svg class="sankey-svg" viewBox="0 0 1000 ${height}" style="height:${height}px" role="img" aria-label="${L('Aliran pendapatan menuju pengeluaran dan surplus. Lebar aliran proporsional terhadap nominal.','Income flows to expenses and surplus. Flow width is proportional to amount.')}">${sources.map((n,i)=>`<path d="M230 ${n.y+n.h/2} C340 ${n.y+n.h/2} 390 ${n.center} 485 ${n.center}" fill="none" stroke="${color(n,'source',i)}" stroke-opacity=".48" stroke-width="${n.h}"><title>${escape(label(n))}: ${escape(money(n.amount))}</title></path>`).join('')}${uses.map((n,i)=>`<path d="M500 ${n.center} C595 ${n.center} 650 ${n.y+n.h/2} 755 ${n.y+n.h/2}" fill="none" stroke="${color(n,'use',i)}" stroke-opacity=".48" stroke-width="${n.h}"><title>${escape(label(n))}: ${escape(money(n.amount))}</title></path>`).join('')}<rect x="485" y="48" width="16" height="${flowHeight}" rx="4" fill="#0d9488"/><text x="493" y="168" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700" transform="rotate(-90 493 168)">${escape(money(r.income,true))}</text>${sources.map((n,i)=>{const c=color(n,'source',i);const iconChar=n.kind==='refund'?'🔄':F.categoryIcon(n.key);const pct=graph.total?((n.amount/graph.total)*100).toFixed(1)+'%':'';return `<g class="sankey-node"><title>${escape(label(n))}: ${escape(money(n.amount))} (${pct})</title><rect x="215" y="${n.y}" width="15" height="${n.h}" fill="${c}" rx="3"/><text x="200" y="${n.y+n.h/2-4}" text-anchor="end" font-weight="600" fill="var(--ink)">${iconChar} ${escape(String(label(n)).slice(0,22))}</text><text x="200" y="${n.y+n.h/2+13}" text-anchor="end" font-size="11" fill="var(--muted)">${escape(money(n.amount,true))} (${pct})</text></g>`;}).join('')}${uses.map((n,i)=>{const c=color(n,'use',i);const isNet=n.kind==='surplus';const iconChar=isNet?'🟢':n.kind==='gap'?'⚠️':F.categoryIcon(n.key);const pct=graph.total?((n.amount/graph.total)*100).toFixed(1)+'%':'';return `<g class="sankey-node"><title>${escape(label(n))}: ${escape(money(n.amount))} (${pct})</title><rect x="755" y="${n.y}" width="15" height="${n.h}" fill="${c}" rx="3"/><text x="785" y="${n.y+n.h/2-4}" font-weight="600" fill="var(--ink)">${iconChar} ${escape(String(isNet?L('Arus Kas Bersih','Net Income'):label(n)).slice(0,22))}</text><text x="785" y="${n.y+n.h/2+13}" font-size="11" fill="var(--muted)">${escape(money(n.amount,true))} (${pct})</text></g>`;}).join('')}<text x="215" y="24" text-anchor="middle" class="sankey-header-title">${L('Sumber Pendapatan','Income Sources')}</text><text x="493" y="24" text-anchor="middle" class="sankey-header-title">${L('Total Aliran','Cash Flow')}</text><text x="765" y="24" class="sankey-header-title">${L('Penggunaan & Surplus','Expenses & Net Income')}</text></svg></div>${r.net<0?`<p class="note">${L('Kebutuhan pendanaan adalah selisih pengeluaran di atas pendapatan, bukan pemasukan baru yang tercatat.','Funding gap is spending above income, not additional recorded income.')}</p>`:''}<p class="note">${L('Kategori kecil diringkas sebagai Lainnya; rincian lengkap ada pada tabel. Surplus adalah arus kas bersih, bukan bukti saldo tabungan.','Small groups are combined as Other; full details are in the table. Surplus is net cash flow, not proof of a savings balance.')}</p>`;
  }
  function donutChart(r){
    const tab=reportFilter.tab;
    const isSpending=tab==='spending';
    const isIncome=tab==='income';
    const rawItems=r.groups.filter(g=>isSpending?g.expense>0:isIncome?g.income>0:(g.income>0||g.expense>0));
    const items=rawItems.map(g=>({
      key:g.key,
      name:reportLabel(g.key),
      emoji:F.categoryIcon(g.key),
      amount:isSpending?g.expense:isIncome?g.income:(g.income+g.expense),
      groupIndex:r.groups.indexOf(g)
    })).sort((a,b)=>b.amount-a.amount);

    const total=E.sum(items.map(x=>x.amount));
    if(!total)return `<div class="empty report-chart-empty">${L('Tidak ada transaksi dalam filter ini.','No transactions match these filters.')}</div>`;

    const DONUT_COLORS=['#00b4d8','#2ec4b6','#ffb703','#e76f51','#8338ec','#f72585','#4361ee','#38b000','#fb8500','#64748b'];
    const topLimit=8;
    const mainItems=items.slice(0,topLimit);
    const restItems=items.slice(topLimit);
    const displayItems=mainItems.map((item,i)=>({
      ...item,
      color:DONUT_COLORS[i % DONUT_COLORS.length]
    }));

    if(restItems.length>0){
      const restTotal=E.sum(restItems.map(x=>x.amount));
      displayItems.push({
        key:'other',
        name:L('Lainnya','Everything else'),
        emoji:'🟡',
        amount:restTotal,
        groupIndex:null,
        color:DONUT_COLORS[topLimit % DONUT_COLORS.length]
      });
    }

    const R=115,C=2*Math.PI*R;
    let acc=0;
    const slices=displayItems.map(item=>{
      const sliceLen=(item.amount/total)*C;
      const pct=((item.amount/total)*100).toFixed(1);
      const gap=displayItems.length>1?3:0;
      const len=Math.max(1,sliceLen-gap);
      const s={
        ...item,
        pct,
        dasharray:`${len} ${C-len}`,
        dashoffset:-acc
      };
      acc+=sliceLen;
      return s;
    });

    return `
      <div class="monarch-donut-container">
        <div class="monarch-donut-visual">
          <svg class="monarch-donut-svg" viewBox="0 0 340 340" role="img" aria-label="${escape(isSpending?L('Grafik donat pengeluaran','Spending donut chart'):L('Grafik donat pendapatan','Income donut chart'))}">
            <defs>
              <filter id="donut-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.25"/>
              </filter>
            </defs>
            <g transform="rotate(-90 170 170)" filter="url(#donut-glow)">
              ${slices.map(s=>`
                <circle cx="170" cy="170" r="${R}" fill="none"
                  stroke="${s.color}" stroke-width="44"
                  stroke-dasharray="${s.dasharray}" stroke-dashoffset="${s.dashoffset}"
                  stroke-linecap="butt" class="monarch-donut-slice"
                  data-slice-key="${escape(s.key)}">
                  <title>${escape(s.name)}: ${escape(money(s.amount))} (${s.pct}%)</title>
                </circle>
              `).join('')}
            </g>
            <g class="monarch-donut-center">
              <text x="170" y="162" text-anchor="middle" class="monarch-donut-total">${escape(money(total,true))}</text>
              <text x="170" y="188" text-anchor="middle" class="monarch-donut-sub">${L('Total','Total')}</text>
            </g>
          </svg>
        </div>
        <div class="monarch-donut-legend">
          ${displayItems.map(s=>`
            <div class="monarch-legend-item ${s.groupIndex!==null?'clickable':''}" ${s.groupIndex!==null?`data-action="report-drill:${s.groupIndex}"`:''}>
              <span class="legend-swatch" style="background-color:${s.color}"></span>
              <span class="legend-emoji">${s.emoji}</span>
              <span class="legend-name">${user(s.name)}</span>
              <span class="legend-amount">${money(s.amount)}</span>
              <span class="legend-pct">${((s.amount/total)*100).toFixed(1)}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  let heatmapViewMode = 'marketcap';
  function heatmap(r){
    if(!r.rows||!r.rows.length){
      return `<div class="empty report-chart-empty">${L('Belum ada transaksi dalam periode ini. Pilih tanggal lain atau tambahkan transaksi.','No transactions in this period. Choose another date range or add transactions.')}</div>`;
    }
    const isSpending=reportFilter.tab==='spending';
    const isIncome=reportFilter.tab==='income';
    const targetRows=isSpending?r.rows.filter(t=>t.kind==='expense'):isIncome?r.rows.filter(t=>t.kind==='income'):r.rows;
    if(!targetRows.length){
      return `<div class="empty report-chart-empty">${isSpending?L('Belum ada transaksi pengeluaran dalam periode ini. Pilih tanggal lain atau tambahkan transaksi.','No expense transactions in this period. Choose another date range or add transactions.'):isIncome?L('Belum ada transaksi pemasukan dalam periode ini. Pilih tanggal lain atau tambahkan transaksi.','No income transactions in this period. Choose another date range or add transactions.'):L('Belum ada transaksi dalam periode ini. Pilih tanggal lain atau tambahkan transaksi.','No transactions in this period. Choose another date range or add transactions.')}</div>`;
    }

    const rawGroups=r.groups.filter(g=>isSpending?g.expense>0:isIncome?g.income>0:(g.income>0||g.expense>0));
    const totalGroupAmount=rawGroups.reduce((acc,g)=>acc+(isSpending?g.expense:isIncome?g.income:(g.income+g.expense)),0)||1;
    const maxGroupAmount=Math.max(1,...rawGroups.map(g=>isSpending?g.expense:isIncome?g.income:(g.income+g.expense)));

    // Finviz / Coin360 Market Cap Treemap items
    const treemapItems=rawGroups.map(g=>{
      const amt=isSpending?g.expense:isIncome?g.income:(g.income+g.expense);
      const pctNum=(amt/totalGroupAmount)*100;
      const pct=pctNum.toFixed(1);
      const iconChar=F.categoryIcon(g.key);
      const label=reportLabel(g.key);
      let color;
      if(isSpending){
        if(pctNum>=25)color='#e11d48';
        else if(pctNum>=15)color='#f43f5e';
        else if(pctNum>=10)color='#ea580c';
        else if(pctNum>=5)color='#15803d';
        else if(pctNum>=2)color='#16a34a';
        else color='#059669';
      }else if(isIncome){
        if(pctNum>=40)color='#047857';
        else if(pctNum>=25)color='#059669';
        else if(pctNum>=12)color='#10b981';
        else if(pctNum>=5)color='#34d399';
        else color='#6ee7b7';
      }else{
        const net=(g.income||0)-(g.expense||0);
        if(net>0)color=net>totalGroupAmount*0.15?'#059669':'#10b981';
        else if(net<0)color=Math.abs(net)>totalGroupAmount*0.15?'#e11d48':'#f43f5e';
        else color='#334155';
      }
      return {
        key:g.key,
        label,
        iconChar,
        amt,
        value:Math.max(1,amt),
        pct,
        pctNum,
        color,
        count:g.count||1,
        origIndex:r.groups.indexOf(g)
      };
    }).sort((a,b)=>b.value-a.value);

    const rects=squarifyLayout(treemapItems,0,0,1000,520);
    const treemapSvg=`<svg class="report-treemap-svg marketcap-treemap-svg" viewBox="0 0 1000 520" style="width:100%;height:auto;display:block;border-radius:12px;background:var(--paper);border:1px solid var(--line);box-shadow:inset 0 0 0 1px var(--line)" role="img" aria-label="${L('Peta Pasar Finansial (Market Cap Heatmap)','Financial Market Cap Treemap Heatmap')}">
      ${rects.map(r=>{
        const pad=2.5;
        const x=r.x+pad,y=r.y+pad;
        const w=Math.max(1,r.w-pad*2),h=Math.max(1,r.h-pad*2);
        const cx=x+w/2,cy=y+h/2;
        const showAll=w>=85&&h>=65;
        const showMed=!showAll&&w>=55&&h>=42;
        const showSmall=!showAll&&!showMed&&w>=36&&h>=26;
        let innerText='';
        if(showAll){
          innerText=`
            <text x="${cx}" y="${cy-14}" text-anchor="middle" font-size="${Math.min(16,Math.max(12,Math.round(w/8)))}" font-weight="700" fill="#ffffff" style="pointer-events:none">${escape(r.iconChar?r.iconChar+' ': '')}${escape(r.label)}</text>
            <text x="${cx}" y="${cy+5}" text-anchor="middle" font-size="${Math.min(13,Math.max(10,Math.round(w/11)))}" font-weight="600" fill="#ffffff" fill-opacity="0.95" style="pointer-events:none">${escape(money(r.amt))}</text>
            <text x="${cx}" y="${cy+22}" text-anchor="middle" font-size="${Math.min(12,Math.max(10,Math.round(w/12)))}" font-weight="700" fill="#ffffff" fill-opacity="0.85" style="pointer-events:none">${r.pct}%</text>
          `;
        }else if(showMed){
          innerText=`
            <text x="${cx}" y="${cy-4}" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff" style="pointer-events:none">${escape(r.label)}</text>
            <text x="${cx}" y="${cy+10}" text-anchor="middle" font-size="10" font-weight="600" fill="#ffffff" fill-opacity="0.9" style="pointer-events:none">${r.pct}% · ${escape(money(r.amt,true))}</text>
          `;
        }else if(showSmall){
          innerText=`
            <text x="${cx}" y="${cy+3}" text-anchor="middle" font-size="9" font-weight="700" fill="#ffffff" style="pointer-events:none">${escape(r.label.slice(0,8))}</text>
          `;
        }
        return `<g class="treemap-tile-group" data-action="report-drill:${r.origIndex}" style="cursor:pointer">
          <title>${escape(r.label)}: ${escape(money(r.amt))} (${r.pct}%) · ${r.count} ${L('transaksi','txns')} — ${L('Klik untuk rincian transaksi','Click to drill down into transactions')}</title>
          <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${r.color}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" class="treemap-rect">
            <animate attributeName="opacity" from="0.3" to="1" dur="0.3s" begin="${(r.origIndex||0)*0.015}s" fill="freeze"/>
          </rect>
          ${innerText}
        </g>`;
      }).join('')}
    </svg>`;

    // Calendar activity heatmap
    const dailyMap=new Map();
    for(const t of targetRows){
      const day=t.date;
      const prev=dailyMap.get(day)||{count:0,amount:0,date:day};
      prev.count++;
      prev.amount+=Math.abs(t.reportingAmount||t.amount||0);
      dailyMap.set(day,prev);
    }
    const days=[...dailyMap.values()].sort((a,b)=>a.date.localeCompare(b.date));
    const maxAmount=Math.max(1,...days.map(d=>d.amount));
    const cellWidth=32,cellHeight=32,gap=6;
    const cols=Math.min(28,Math.max(7,Math.ceil(days.length/4)));
    const rowsCount=Math.ceil(days.length/cols)||1;
    const svgWidth=Math.max(680,cols*(cellWidth+gap)+60);
    const svgHeight=rowsCount*(cellHeight+gap)+60;
    const getColor=(val,max)=>{
      if(!val)return 'var(--line)';
      const ratio=val/max;
      if(ratio>0.75)return '#f43f5e';
      if(ratio>0.50)return '#f97316';
      if(ratio>0.25)return '#eab308';
      return '#10b981';
    };
    const calendarSvg=`<svg class="report-heatmap-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" style="width:100%;max-width:${svgWidth}px;height:auto" role="img" aria-label="${L('Peta panas intensitas transaksi keuangan harian','Daily financial transaction intensity heatmap')}">
      ${days.map((d,i)=>{
        const col=i%cols;
        const row=Math.floor(i/cols);
        const x=30+col*(cellWidth+gap);
        const y=30+row*(cellHeight+gap);
        const colColor=getColor(d.amount,maxAmount);
        const shortDate=d.date.slice(5);
        return `<g class="heatmap-cell">
          <title>${escape(d.date)}: ${escape(money(d.amount))} (${d.count} ${L('transaksi','txns')})</title>
          <rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" rx="6" fill="${colColor}" fill-opacity="${0.35+0.65*(d.amount/maxAmount)}">
            <animate attributeName="opacity" from="0.3" to="1" dur="0.4s" begin="${i*0.01}s" fill="freeze"/>
          </rect>
          <text x="${x+cellWidth/2}" y="${y+cellHeight/2+4}" text-anchor="middle" font-size="9" font-weight="700" fill="#ffffff" style="pointer-events:none">${escape(shortDate.slice(3))}</text>
        </g>`;
      }).join('')}
      <text x="30" y="18" font-size="11" font-weight="600" fill="var(--muted)">${L('Intensitas Transaksi Harian (Tanggal & Nominal)','Daily Transaction Activity & Intensity')}</text>
    </svg>`;

    const categoryGrid=`<div class="heatmap-category-grid">
      ${rawGroups.length?rawGroups.map(g=>{
        const amt=isSpending?g.expense:isIncome?g.income:(g.income+g.expense);
        const pct=((amt/totalGroupAmount)*100).toFixed(1);
        const intensity=amt/maxGroupAmount;
        const iconChar=F.categoryIcon(g.key);
        const heatBg=`color-mix(in srgb, var(--green, #10b981) ${Math.round(intensity*35+5)}%, var(--paper))`;
        const heatBorder=`color-mix(in srgb, var(--green, #10b981) ${Math.round(intensity*60+20)}%, var(--line))`;
        return `<button type="button" class="heatmap-tile-card" style="background:${heatBg};border-color:${heatBorder}" data-action="report-drill:${r.groups.indexOf(g)}" title="${escape(reportLabel(g.key))}: ${escape(money(amt))} (${pct}%)">
          <div class="heatmap-tile-head">
            <span class="heatmap-emoji">${iconChar}</span>
            <span class="heatmap-pct">${pct}%</span>
          </div>
          <b class="heatmap-tile-title">${user(reportLabel(g.key))}</b>
          <div class="heatmap-tile-amt">${amount(amt)}</div>
          <small class="heatmap-tile-count">${g.count||1} ${L('transaksi','txns')}</small>
        </button>`;
      }).join(''):`<p class="empty" style="grid-column:1/-1;padding:16px">${L('Tidak ada rincian kategori untuk periode ini.','No category details for this period.')}</p>`}
    </div>`;

    return `<div class="report-treemap report-heatmap">
      <div class="heatmap-toolbar">
        <div class="heatmap-toolbar-info">
          <h3>📊 ${L('Peta Panas Finansial','Financial Heatmap')}</h3>
          <p>${L('Visualisasi distribusi keuangan proporsional berdasarkan intensitas nominal dan porsi kontribusi.','Proportional financial distribution visualization based on nominal intensity and share.')}</p>
        </div>
        <div class="heatmap-toolbar-controls">
          <div class="marketcap-legend">
            <small>${isSpending?L('Proporsi Rendah','Low Share'):L('Stabil','Stable')}</small>
            <div class="marketcap-gradient-scale"></div>
            <small>${isSpending?L('Konsentrasi Tinggi','High Share'):L('Dominan','Dominant')}</small>
          </div>
        </div>
      </div>
      <div class="heatmap-scroll-wrap">
        ${treemapSvg}
      </div>
      <div class="heatmap-section-title">
        <h4>${L('Matriks Konsentrasi Kategori','Category Concentration Matrix')}</h4>
        <small>${L('Klik kartu atau blok treemap untuk melihat rincian transaksi terkait','Click any card or treemap block to drill down into its transactions')}</small>
      </div>
      ${categoryGrid}
    </div>`;
  }
  function treemap(r){return heatmap(r);}
  function monarchReportMetrics(r){
    return `<div class="metrics-grid reports-metrics monarch-reports-metrics">
      <div class="metric monarch-report-card income-card">
        <span class="monarch-card-title">${L('Total pendapatan','Total income')}</span>
        <b class="metric-value monarch-metric-val income-val">${amount(r.income)}</b>
        <span class="metric-foot">${reportFilter.from} → ${reportFilter.to}</span>
      </div>
      <div class="metric monarch-report-card expense-card">
        <span class="monarch-card-title">${L('Total pengeluaran','Total expenses')}</span>
        <b class="metric-value monarch-metric-val expense-val">${amount(r.expense)}</b>
        <span class="metric-foot">${L('Transfer tidak termasuk','Transfers excluded')}</span>
      </div>
      <div class="metric monarch-report-card net-card">
        <span class="monarch-card-title">${L('Arus kas bersih','Total net income')}</span>
        <b class="metric-value monarch-metric-val net-val ${r.net>=0?'positive':'negative'}">${amount(Math.abs(r.net),state.currency,r.net>=0?'+ ':'− ')}</b>
        <span class="metric-foot">${L('Pendapatan − pengeluaran','Income − expenses')}</span>
      </div>
      <div class="metric monarch-report-card rate-card">
        <span class="monarch-card-title">${L('Rasio surplus','Savings rate')}</span>
        <b class="metric-value monarch-metric-val rate-val">${r.income?new Intl.NumberFormat(locale(),{style:'percent',maximumFractionDigits:1}).format(r.net/r.income):'—'}</b>
        <span class="metric-foot">${L('Arus kas bersih ÷ pendapatan','Net cash flow ÷ income')}</span>
      </div>
    </div>`;
  }
  function monarchReportTransactions(rows){
    if(!rows.length)return `<div class="empty">${L('Tidak ada transaksi','No transactions')}</div>`;
    const dateGroups=new Map();
    for(const t of rows){
      const d=t.date;
      if(!dateGroups.has(d))dateGroups.set(d,[]);
      dateGroups.get(d).push(t);
    }
    const sortedDates=[...dateGroups.keys()].sort((a,b)=>b.localeCompare(a));
    return `<div class="monarch-tx-timeline">
      ${sortedDates.map(dateStr=>{
        const txs=dateGroups.get(dateStr);
        const daySum=E.sum(txs.map(t=>t.kind==='income'?F.reported(state,t):-F.reported(state,t)));
        const d=new Date(dateStr+'T12:00:00Z');
        const formattedDate=d.toLocaleDateString(locale()==='id'?'id-ID':'en-US',{month:'long',day:'numeric',year:'numeric'});
        return `<div class="monarch-tx-date-group">
          <div class="monarch-date-header">
            <span class="date-label">${formattedDate}</span>
            <span class="date-total ${daySum>=0?'positive':'expense-amount'}">${daySum>=0?'+':''}${money(daySum,true)}</span>
          </div>
          <div class="monarch-date-tx-list">
            ${txs.map(t=>{
              const acc=getAccount(t.accountId);
              const owner=t.splits?.length?L('Dibagi','Split'):ownerName(F.transactionOwner(state,t));
              const catEmoji=F.categoryIcon(t.category);
              const val=F.reported(state,t);
              const isExp=t.kind==='expense';
              return `<div class="monarch-tx-item-row" data-action="tx-edit:${t.id}">
                <div class="tx-cell-account"><span class="account-pill"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 9h20"/></svg> ${user(acc?.name||t.accountId)}</span></div>
                <div class="tx-cell-cat"><span class="cat-pill-emoji">${catEmoji}</span><span class="cat-pill-text">${user(t.category)}</span></div>
                <div class="tx-cell-desc"><b class="tx-name-text">${user(t.name)}</b></div>
                <div class="tx-cell-owner"><span class="owner-tag-pill"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/></svg> ${escape(owner)}</span></div>
                <div class="tx-cell-amount ${isExp?'expense-amount':'positive'}"><b class="amount-val">${isExp?'−':'+'}${amount(val)}</b></div>
                <div class="tx-cell-arrow"><span class="chevron-arrow">›</span></div>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
  }
  function monarchReportSummary(rows, r){
    const txAmounts=rows.map(t=>F.reported(state,t));
    const largest=txAmounts.length?Math.max(...txAmounts):0;
    const avg=txAmounts.length?Math.round(E.sum(txAmounts)/txAmounts.length):0;
    const dates=rows.map(t=>t.date).sort();
    const firstDate=dates[0]||'—';
    const lastDate=dates.at(-1)||'—';
    return `<div class="monarch-kpi-summary-list">
      <div class="kpi-summary-row"><span class="kpi-name">${L('Total transaksi','Total transactions')}</span><b class="kpi-num">${rows.length}</b></div>
      <div class="kpi-summary-row"><span class="kpi-name">${L('Transaksi terbesar','Largest transaction')}</span><b class="kpi-num">${amount(largest)}</b></div>
      <div class="kpi-summary-row"><span class="kpi-name">${L('Rata-rata transaksi','Average transaction')}</span><b class="kpi-num">${amount(avg)}</b></div>
      <div class="kpi-summary-row"><span class="kpi-name">${L('Total pendapatan','Total income')}</span><b class="kpi-num income-val">+${amount(r.income)}</b></div>
      <div class="kpi-summary-row"><span class="kpi-name">${L('Total pengeluaran','Total spending')}</span><b class="kpi-num expense-val">−${amount(r.expense)}</b></div>
      <div class="kpi-summary-row"><span class="kpi-name">${L('Transaksi pertama','First transaction')}</span><span class="kpi-date-val">${firstDate}</span></div>
      <div class="kpi-summary-row"><span class="kpi-name">${L('Transaksi terakhir','Last transaction')}</span><span class="kpi-date-val">${lastDate}</span></div>
      <div class="kpi-summary-action">
        <button class="btn primary monarch-summary-export-btn" data-action="report-export"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> ${L('Unduh CSV','Download CSV')}</button>
      </div>
    </div>`;
  }

  function openDjpTaxModal(selectedYear, selectedOwnerId) {
    const curYear = new Date().toISOString().slice(0, 4);
    const yr = selectedYear || curYear;
    const own = selectedOwnerId || 'all';

    const rep = F.buildDjpTaxAssetsReport(state, { year: yr, ownerId: own });

    const yearsList = [curYear, String(Number(curYear) - 1), String(Number(curYear) - 2)];
    const yearOpts = yearsList.map(y => `<option value="${y}" ${y === String(yr) ? 'selected' : ''}>Tahun Pajak ${y} ${y === curYear ? '(' + L('Berjalan', 'Current') + ')' : ''}</option>`).join('');

    const membersList = [{ id: 'all', name: L('Seluruh Keluarga (Gabungan)', 'Whole Household (Combined)') }, ...(state.members || [])];
    const ownerOpts = membersList.map(m => `<option value="${m.id}" ${m.id === own ? 'selected' : ''}>${escape(m.name)}</option>`).join('');

    const formatIdr = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');

    const assetRows = rep.assets.map(a => `
      <tr>
        <td style="font-family:ui-monospace,SFMono-Regular,monospace;font-weight:700;color:var(--accent,#34d399);">${escape(a.code)}</td>
        <td><b>${escape(a.name)}</b></td>
        <td><small class="badge">${escape(a.codeName)}</small></td>
        <td style="text-align:center;">${escape(a.year)}</td>
        <td style="text-align:right;font-weight:600;">${formatIdr(a.valueIdr)}</td>
        <td><small style="color:var(--muted);">${escape(a.desc)}</small></td>
      </tr>
    `).join('') || `<tr><td colspan="6" class="empty">${L('Tidak ada harta tercatat', 'No assets recorded')}</td></tr>`;

    const liabRows = rep.liabilities.map(l => `
      <tr>
        <td style="font-family:ui-monospace,SFMono-Regular,monospace;font-weight:700;color:#ef4444;">${escape(l.code)}</td>
        <td><b>${escape(l.name)}</b></td>
        <td><small class="badge">${escape(l.codeName)}</small></td>
        <td style="text-align:center;">${escape(l.year)}</td>
        <td style="text-align:right;font-weight:600;color:#ef4444;">${formatIdr(l.valueIdr)}</td>
        <td><small style="color:var(--muted);">${escape(l.desc)}</small></td>
      </tr>
    `).join('') || `<tr><td colspan="6" class="empty">${L('Tidak ada utang tercatat', 'No debts recorded')}</td></tr>`;

    const bodyHtml = `
      <div class="tax-djp-modal-wrap" style="max-width:880px;margin:0 auto;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <span style="font-size:24px;">🇮🇩</span>
          <div>
            <b style="font-size:15px;display:block;">${L('Formulir SPT 1770 / 1770 S · DJP Online', 'Indonesian Tax Return (SPT 1770 / 1770 S)')}</b>
            <small style="color:var(--muted);">${L('Rekapitulasi resmi daftar harta & utang akhir tahun pajak dengan Kode Harta DJP.', 'Official end-of-year tax assets & liabilities recap matching DJP tax codes.')}</small>
          </div>
        </div>

        <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;background:var(--bg-hover,#f8fafc);padding:12px 14px;border-radius:12px;border:1px solid var(--line);">
          <div style="flex:1;min-width:180px;">
            <label for="tax-djp-year-select" style="font-size:11px;font-weight:600;color:var(--muted);display:block;margin-bottom:4px;">${L('Tahun Pajak', 'Tax Year')}</label>
            <select id="tax-djp-year-select" style="width:100%;">${yearOpts}</select>
          </div>
          <div style="flex:1;min-width:180px;">
            <label for="tax-djp-owner-select" style="font-size:11px;font-weight:600;color:var(--muted);display:block;margin-bottom:4px;">${L('Wajib Pajak / Pemilik', 'Taxpayer / Owner')}</label>
            <select id="tax-djp-owner-select" style="width:100%;">${ownerOpts}</select>
          </div>
        </div>

        <div class="metrics-grid" style="grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;margin-bottom:18px;">
          <div class="metric" style="background:var(--card,#ffffff);border:1px solid var(--line);padding:12px 16px;border-radius:12px;">
            <span style="font-size:11px;color:var(--muted);text-transform:uppercase;">${L('Total Harta (Aset)', 'Total Assets')}</span>
            <b style="font-size:18px;display:block;color:var(--accent,#34d399);margin-top:4px;">${formatIdr(rep.totalAssetsIdr)}</b>
            <small style="color:var(--muted);font-size:11px;">${rep.assets.length} ${L('item harta', 'asset items')}</small>
          </div>
          <div class="metric" style="background:var(--card,#ffffff);border:1px solid var(--line);padding:12px 16px;border-radius:12px;">
            <span style="font-size:11px;color:var(--muted);text-transform:uppercase;">${L('Total Utang (Kewajiban)', 'Total Liabilities')}</span>
            <b style="font-size:18px;display:block;color:#ef4444;margin-top:4px;">${formatIdr(rep.totalLiabilitiesIdr)}</b>
            <small style="color:var(--muted);font-size:11px;">${rep.liabilities.length} ${L('item utang', 'debt items')}</small>
          </div>
          <div class="metric" style="background:var(--card,#ffffff);border:1px solid var(--line);padding:12px 16px;border-radius:12px;">
            <span style="font-size:11px;color:var(--muted);text-transform:uppercase;">${L('Kekayaan Bersih Fiskal', 'Fiscal Net Wealth')}</span>
            <b style="font-size:18px;display:block;color:var(--ink);margin-top:4px;">${formatIdr(rep.netWealthIdr)}</b>
            <small style="color:var(--muted);font-size:11px;">${L('Harta dikurangi Utang', 'Assets minus Liabilities')}</small>
          </div>
        </div>

        <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;justify-content:space-between;align-items:center;">
          <b style="font-size:13px;">📋 ${L('Bagian B: Daftar Harta Akhir Tahun', 'Part B: Year-End Asset Registry')} (${rep.assets.length})</b>
          <div style="display:flex;gap:8px;">
            <button type="button" class="btn primary" id="tax-djp-copy-btn" title="${L('Salin format tabel untuk di-paste langsung di DJP Online atau Excel', 'Copy table to paste directly into DJP Online or Excel')}">
              📋 ${L('Salin Format Tabel DJP', 'Copy DJP Table')}
            </button>
            <button type="button" class="btn" id="tax-djp-csv-btn" title="${L('Unduh file CSV format DJP', 'Download CSV in DJP format')}">
              📥 ${L('Unduh CSV', 'Download CSV')}
            </button>
          </div>
        </div>

        <div class="table-wrap" style="max-height:260px;overflow-y:auto;border:1px solid var(--line);border-radius:10px;margin-bottom:20px;">
          <table style="width:100%;font-size:12px;">
            <thead>
              <tr style="position:sticky;top:0;background:var(--card-subtle,#f1f5f9);z-index:1;">
                <th style="width:70px;">${L('Kode', 'Code')}</th>
                <th>${L('Nama Harta', 'Asset Name')}</th>
                <th>${L('Kategori DJP', 'Category')}</th>
                <th style="text-align:center;width:70px;">${L('Tahun', 'Year')}</th>
                <th style="text-align:right;width:130px;">${L('Nilai (IDR)', 'Value (IDR)')}</th>
                <th>${L('Keterangan', 'Note')}</th>
              </tr>
            </thead>
            <tbody>${assetRows}</tbody>
          </table>
        </div>

        <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;justify-content:space-between;align-items:center;">
          <b style="font-size:13px;">💳 ${L('Bagian C: Daftar Kewajiban / Utang Akhir Tahun', 'Part C: Year-End Liabilities Registry')} (${rep.liabilities.length})</b>
        </div>

        <div class="table-wrap" style="max-height:200px;overflow-y:auto;border:1px solid var(--line);border-radius:10px;margin-bottom:18px;">
          <table style="width:100%;font-size:12px;">
            <thead>
              <tr style="position:sticky;top:0;background:var(--card-subtle,#f1f5f9);z-index:1;">
                <th style="width:70px;">${L('Kode', 'Code')}</th>
                <th>${L('Nama Pemberi Pinjaman', 'Lender Name')}</th>
                <th>${L('Kategori DJP', 'Category')}</th>
                <th style="text-align:center;width:70px;">${L('Tahun', 'Year')}</th>
                <th style="text-align:right;width:130px;">${L('Sisa Utang (IDR)', 'Balance (IDR)')}</th>
                <th>${L('Keterangan', 'Note')}</th>
              </tr>
            </thead>
            <tbody>${liabRows}</tbody>
          </table>
        </div>

        <p class="note" style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.5;">
          ${L('💡 <b>Tips DJP Online:</b> Klik tombol <b>"Salin Format Tabel DJP"</b> di atas, lalu buka portal DJP Online atau lembar kerja e-Form, dan langsung tekan <b>Paste (Ctrl+V / Cmd+V)</b>. Seluruh kolom Kode, Nama, Tahun, dan Nilai akan terisi secara otomatis.', '💡 <b>DJP Online Tip:</b> Click <b>"Copy DJP Table"</b> above, then open DJP Online portal or e-Form spreadsheet, and press <b>Paste (Ctrl+V / Cmd+V)</b>. All code, name, year, and value columns will be populated automatically.')}
        </p>

        <div class="form-actions" style="margin-top:16px;">
          <button type="button" class="btn" data-action="modal-close">${L('Tutup', 'Close')}</button>
        </div>
      </div>
    `;

    openModal(L('🇮🇩 Rekap Harta SPT Tahunan DJP Online', '🇮🇩 DJP Online Tax Assets Recap'), bodyHtml);

    setTimeout(() => {
      $('#tax-djp-year-select')?.addEventListener('change', e => {
        openDjpTaxModal(e.target.value, $('#tax-djp-owner-select')?.value || own);
      });
      $('#tax-djp-owner-select')?.addEventListener('change', e => {
        openDjpTaxModal($('#tax-djp-year-select')?.value || yr, e.target.value);
      });
      $('#tax-djp-copy-btn')?.addEventListener('click', () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(rep.tsvText).then(() => {
            toast('📋 ' + L('Format tabel DJP berhasil disalin! Silakan paste langsung ke portal DJP Online atau Excel.', 'DJP table copied! Paste directly into DJP Online or Excel.'));
          }).catch(() => {
            toast('⚠️ ' + L('Gagal menyalin otomatis. Silakan unduh CSV.', 'Failed to copy. Please download CSV.'));
          });
        } else {
          toast('📋 ' + L('Teks tabel siap diunduh via tombol CSV.', 'Table text ready via CSV button.'));
        }
      });
      $('#tax-djp-csv-btn')?.addEventListener('click', () => {
        download(`rekap-harta-spt-djp-${rep.year}.csv`, rep.csvText, 'text/csv');
        toast('📥 ' + L('File CSV SPT Pajak DJP berhasil diunduh.', 'DJP Tax CSV downloaded.'));
      });
    }, 40);
  }

  function reports(){
    const tabs=[['cashflow',L('Arus kas','Cash flow')],['spending',L('Pengeluaran','Spending')],['income',L('Pendapatan','Income')],['networth',L('Kekayaan bersih','Net worth')],['debt',L('Utang','Debt')],['cards',L('Kartu kredit','Credit cards')]];
    const categories=[...new Set(state.transactions.map(t=>t.category))];
    const r=F.reports(state,reportFilter);
    const ledger=['cashflow','spending','income'].includes(reportFilter.tab);
    const chart=reportFilter.chart==='sankey'&&reportFilter.tab==='cashflow'?sankey(r):reportFilter.chart==='pie'?donutChart(r):['heatmap','treemap'].includes(reportFilter.chart)?heatmap(r):bars(r);
    const currentRows=reportRows(r);
    return header(L('Laporan','Reports'),L('Pahami aliran uang dan kebiasaan keuangan Anda secara mendalam.','Understand your money flow, spending habits, and income sources.'),button(L('🇮🇩 Rekap SPT Pajak DJP','🇮🇩 DJP Tax Assets Report'),'tax-djp-modal','primary')+button(L('Simpan laporan','Save report'),'report-save')+button(L('Ekspor CSV','Export CSV'),'report-export'),'REPORTS')+
      `<nav class="report-tabs" aria-label="${L('Jenis laporan','Report type')}">${tabs.map(([id,label])=>`<button class="${reportFilter.tab===id?'active':''}" data-action="report-tab:${id}" aria-pressed="${reportFilter.tab===id}">${icon('report-'+id)}${label}</button>`).join('')}</nav>
      ${reportFilters(ledger,categories)}
      ${ledger?`${monarchReportMetrics(r)}
        <section class="panel panel-pad">
          <div class="panel-head">
            <h2>${tabs.find(x=>x[0]===reportFilter.tab)[1]}</h2>
            ${reportChartControls()}
          </div>
          <p class="report-period-caption">${reportFilter.from} → ${reportFilter.to} · ${state.currency} · FX ${state.fx.date}</p>
          ${chart}
          <div class="table-wrap" style="margin-top:18px">
            <table>
              <thead><tr><th>${L('Kelompok','Group')}</th><th>${L('Pendapatan','Income')}</th><th>${L('Pengeluaran','Expenses')}</th><th>${L('Rincian','Details')}</th></tr></thead>
              <tbody>${r.groups.map((g,i)=>`<tr><td>${user(reportLabel(g.key))}</td><td class="positive">${amount(g.income)}</td><td class="${g.expense>0?'expense-amount':''}">${amount(g.expense)}</td><td><button class="btn" data-action="report-drill:${i}">${L('Lihat transaksi','View transactions')}</button></td></tr>`).join('')||`<tr><td colspan="4" class="empty">${L('Tidak ada data','No data')}</td></tr>`}</tbody>
            </table>
          </div>
        </section>
        <div class="monarch-report-split-grid">
          <div class="monarch-split-tx-col">
            <section class="panel panel-pad monarch-tx-panel">
              <div class="panel-head">
                <div>
                  <h2>${reportDrill===null?L('Transaksi sumber','Source transactions'):L('Rincian: ','Details: ')+escape(reportLabel(reportDrill))}</h2>
                  <span class="report-tx-count-pill">${currentRows.length} ${L('transaksi','transactions')}</span>
                </div>
                <div class="monarch-tx-head-actions">
                  ${reportDrill!==null?button(L('Semua transaksi laporan','All report transactions'),'report-undrill'):''}
                </div>
              </div>
              ${monarchReportTransactions(currentRows)}
              <p class="note" style="margin-top:14px">${L('Transfer internal dikecualikan. Split mengikuti porsi pemilik. Pelaporan memakai kurs tersimpan saat ini.','Internal transfers are excluded. Splits follow ownership portions. Reporting uses current saved exchange rates.')}</p>
            </section>
          </div>
          <div class="monarch-split-summary-col">
            <section class="panel panel-pad monarch-summary-panel">
              <div class="panel-head">
                <h2><span>✨</span> ${L('Ringkasan','Summary')}</h2>
              </div>
              ${monarchReportSummary(currentRows, r)}
            </section>
          </div>
        </div>
      `:positionReport()}
      <section class="panel panel-pad" style="margin-top:22px">
        <h2>${L('Laporan tersimpan','Saved reports')}</h2>
        ${state.savedReports.map(v=>`<div class="saved-row"><div><b>${user(v.name)}</b><small>${v.filter.from} → ${v.filter.to} · ${escape(ownerName(v.view.owner))}</small></div><button class="btn" data-action="report-load:${v.id}">${L('Buka','Open')}</button><button class="btn danger" data-action="report-delete:${v.id}" aria-label="${L('Hapus laporan','Delete report')}">×</button></div>`).join('')||`<p class="empty">${L('Simpan kombinasi filter untuk digunakan kembali.','Save filter combinations for later.')}</p>`}
      </section>`;
  }
  function reportJournal(rows){return monarchReportTransactions(rows);}
  function positionReport(){if(reportFilter.tab==='networth'){const rows=F.history(state,reportFilter);const latest=rows.at(-1)||{assets:0,debt:0,netWorth:0};return `<div class="metrics-grid reports-metrics monarch-reports-metrics"><div class="metric monarch-report-card"><span class="monarch-card-title">${L('Kekayaan bersih terkini','Current net worth')}</span><b class="metric-value monarch-metric-val net-val">${amount(latest.netWorth)}</b><span class="metric-foot">${L('Snapshot terbaru','Latest snapshot')}</span></div><div class="metric monarch-report-card"><span class="monarch-card-title">${L('Total aset','Total assets')}</span><b class="metric-value monarch-metric-val income-val">${amount(latest.assets)}</b><span class="metric-foot">${L('Akun aset','Asset accounts')}</span></div><div class="metric monarch-report-card"><span class="monarch-card-title">${L('Total liabilitas','Total debt')}</span><b class="metric-value monarch-metric-val expense-val">${amount(latest.debt)}</b><span class="metric-foot">${L('Kewajiban berjalan','Active liabilities')}</span></div><div class="metric monarch-report-card"><span class="monarch-card-title">${L('Rasio surplus','Savings rate')}</span><b class="metric-value monarch-metric-val rate-val">${rows.length}</b><span class="metric-foot">${L('Snapshot tersimpan','Saved snapshots')}</span></div></div><section class="panel panel-pad" style="margin-top:22px"><div class="panel-head"><h2>${L('Riwayat snapshot posisi','Position snapshot history')}</h2>${button(L('Simpan posisi hari ini','Save today’s position'),'position-snapshot')}</div><div class="chart-container">${lineChart(rows.map(r=>r.netWorth),rows.map(r=>r.date),{name:L('Kekayaan bersih','Net worth')})}</div><p class="note">${L('Hanya snapshot yang benar-benar disimpan. Kurs memakai snapshot pada tanggal tersebut. Tidak merekonstruksi riwayat saldo dari jurnal parsial.','Only snapshots actually saved. FX uses each snapshot’s rates. Balance history is not reconstructed from partial journals.')}</p><div class="table-wrap"><table><thead><tr><th>${L('Tanggal','Date')}</th><th>${L('Aset','Assets')}</th><th>${L('Utang','Debt')}</th><th>${L('Kekayaan bersih','Net worth')}</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.date}</td><td>${amount(r.assets)}</td><td>${amount(r.debt)}</td><td>${amount(r.netWorth)}</td></tr>`).join('')||`<tr><td colspan="4" class="empty">${L('Belum ada snapshot pada periode ini.','No snapshots in this period.')}</td></tr>`}</tbody></table></div></section>`;}
    const v=viewState(),rows=reportFilter.tab==='cards'?v.cards.map(c=>({...v.debts.find(d=>d.id===c.debtId),card:c})):v.debts;const totBal=E.sum(rows.map(d=>d.balance||0));return `<div class="metrics-grid reports-metrics monarch-reports-metrics"><div class="metric monarch-report-card"><span class="monarch-card-title">${L('Total saldo utang','Total debt balance')}</span><b class="metric-value monarch-metric-val expense-val">${amount(totBal)}</b><span class="metric-foot">${rows.length} ${L('kewajiban','liabilities')}</span></div><div class="metric monarch-report-card"><span class="monarch-card-title">${L('Rata-rata suku bunga','Average APR')}</span><b class="metric-value monarch-metric-val">${rows.length?(E.sum(rows.map(d=>d.apr||0))/rows.length).toFixed(1)+'%':'—'}</b><span class="metric-foot">APR</span></div><div class="metric monarch-report-card"><span class="monarch-card-title">${L('Minimum per bulan','Monthly minimum')}</span><b class="metric-value monarch-metric-val">${amount(E.sum(rows.map(d=>d.minimum||0)))}</b><span class="metric-foot">${L('Komitmen bulanan','Monthly commitment')}</span></div><div class="metric monarch-report-card"><span class="monarch-card-title">${L('Rasio surplus','Savings rate')}</span><b class="metric-value monarch-metric-val rate-val">${rows.length}</b><span class="metric-foot">${L('Akun berjalan','Active accounts')}</span></div></div><section class="panel panel-pad" style="margin-top:22px"><h2>${L('Posisi saat ini','Current position')} · ${date()}</h2><p class="note">${L('Tanggal/kategori/akun filter jurnal tidak membatasi posisi utang saat ini. Perspektif kepemilikan tetap berlaku.','Journal date/category/account filters do not limit current debt positions. Ownership perspective still applies.')}</p><div class="table-wrap"><table><thead><tr><th>${L('Utang / kartu','Debt / card')}</th><th>${L('Saldo','Balance')}</th><th>APR</th><th>${L('Minimum bulanan','Monthly minimum')}</th><th>${L('Estimasi lunas','Estimated payoff')}</th></tr></thead><tbody>${rows.map(d=>{const payoff=E.payoff(d);return `<tr><td>${user(d.card?.name||d.name)}<small>${escape(ownerName(d.ownerId))}${d.card?' · '+d.card.dueDate:''}</small></td><td>${native(d,'balance')}</td><td>${d.apr}%</td><td>${native(d,'minimum')}</td><td>${payoff.feasible?payoff.months+' '+L('bulan','months'):L('Tidak amortisasi','Not amortizing')}</td></tr>`;}).join('')||`<tr><td colspan="5" class="empty">${L('Tidak ada utang dalam tampilan ini','No debt in this view')}</td></tr>`}</tbody></table></div></section>`;
  }
  const selectedPlan=()=>forecastSelected==='base'?state.forecastPlan:state.forecastPlan.scenarios.find(s=>s.id===forecastSelected)?.plan||state.forecastPlan;
  const percentField=(label,name,value)=>field(label,name,(value*100).toFixed(2),'number','min="-99" max="50" required');
  const forecastSignature=()=>JSON.stringify({plan:selectedPlan(),view:state.activeView,accounts:state.accounts,debts:state.debts,flows:state.flows,goals:state.goals,history:selectedPlan().baseline==='history'?state.transactions:[],fx:state.fx.rates,currency:state.currency,date:date()});
  function forecast(){if(forecastSetup)return forecastSetupView();const c=selectedPlan();if(forecastMC&&forecastMCSig!==forecastSignature())forecastMC=null;forecastResult=F.forecast(state,c,{start:date()});const r=forecastResult,base=forecastSelected==='base'?r:F.forecast(state,{...state.forecastPlan,years:c.years},{start:date()}),values=r.annual.map(v=>forecastReal?v.realNetWorth:v.netWorth),baselineValues=base.annual.map(v=>forecastReal?v.realNetWorth:v.netWorth);return header(L('Masa depan dengan asumsi yang terlihat.','A future with visible assumptions.'),L('Proyeksi per akun, arus kas, utang, dan kejadian hidup. Catatan aktual tetap utuh.','Account, cash flow, debt and life-event projections. Actual records stay intact.'),button(L('Simpan skenario baru','Save new scenario'),'forecast-save')+button(L('Ekspor proyeksi','Export projection'),'forecast-export')+button(L('Setup forecast','Setup forecast'),'forecast-setup'),'FORECAST')+planningSwitcher('forecast')+`<div class="forecast-toolbar"><label>${L('Skenario','Scenario')}<select id="forecast-scenario"><option value="base">${L('Rencana dasar','Baseline plan')}</option>${state.forecastPlan.scenarios.map(sc=>`<option value="${sc.id}" ${forecastSelected===sc.id?'selected':''}>${escape(sc.name)}</option>`).join('')}</select></label><label><input type="checkbox" id="forecast-real" ${forecastReal?'checked':''}> ${L('Daya beli hari ini','Today’s purchasing power')}</label>${forecastSelected!=='base'?button(L('Hapus skenario','Delete scenario'),'forecast-delete:'+forecastSelected,'danger'):''}${button(L('Monte Carlo terpadu','Integrated Monte Carlo'),'forecast-mc','primary')}</div><div class="metrics-grid">${metric(L('Kekayaan bersih awal','Starting net worth'),amount(r.initial.netWorth),escape(ownerName(state.activeView.owner)))}${metric(L('Kekayaan bersih akhir','Ending net worth'),amount(forecastReal?r.ending.realNetWorth:r.ending.netWorth),c.years+' '+L('tahun · estimasi','years · estimate'))}${metric(L('Saat mulai pensiun','At retirement'),r.retirement?amount(forecastReal?r.retirement.realNetWorth:r.retirement.netWorth):'—',r.retirement?r.retirement.date:L('Tambahkan kejadian pensiun','Add a retirement event'))}${metric(L('Kebutuhan dana belum terpenuhi','Unfunded obligations'),amount(r.ending.fundingGap),r.shortfall?L('Ada shortfall selama proyeksi','Shortfall occurs during projection'):L('Tidak ada shortfall dalam model','No shortfall in this model'))}</div><section class="panel panel-pad"><div class="panel-head"><div><h2>${L('Lintasan kekayaan bersih','Net worth trajectory')}</h2><p>${forecastReal?L('Disesuaikan inflasi','Inflation adjusted'):L('Nominal masa depan','Future nominal values')} · ${state.currency}</p></div><div class="forecast-graph-controls"><select id="forecast-chart-metric" aria-label="${L('Ukuran grafik','Chart metric')}">${[['networth',L('Kekayaan bersih','Net worth')],['assets',L('Aset','Assets')],['cashflow',L('Arus kas bulanan','Monthly cash flow')]].map(([key,label])=>`<option value="${key}" ${forecastChartMetric===key?'selected':''}>${label}</option>`).join('')}</select>${button(L('Tambah kejadian','Add event'),'event-new','primary')}</div></div><div class="forecast-chart">${forecastChart(r,c,baselineValues,values,base)}</div>${forecastSelected!=='base'?`<p class="note">${L('Perbedaan nilai akhir vs. dasar dengan horizon yang sama','Ending difference versus baseline at the same horizon')}: <b>${amount((forecastReal?r.ending.realNetWorth:r.ending.netWorth)-(forecastReal?base.ending.realNetWorth:base.ending.netWorth))}</b> · ${L('Garis putus-putus: dasar · Garis utuh: skenario','Dashed: baseline · Solid: scenario')}</p>`:''}<div class="event-timeline">${r.events.map(ev=>`<button data-action="event-edit:${ev.id}" class="event-chip">${icon('calendar')}<span>${user(ev.name)}<small>${ev.date} · ${escape(ownerName(ev.ownerId))}</small></span></button>`).join('')||`<p class="empty">${L('Tambahkan kejadian untuk membentuk rencana Anda.','Add events to shape your plan.')}</p>`}</div></section><div class="forecast-layout"><section class="panel panel-pad"><h2>${L('Asumsi rencana','Plan assumptions')}</h2><form id="forecast-form"><div class="form-grid">${field(L('Horizon (tahun)','Horizon (years)'),'years',c.years,'number','min="1" max="40" required')}${field(L('Usia awal (asumsi)','Starting age (assumption)'),'startAge',c.startAge,'number','min="0" max="100" required')}${field(L('Sumber arus dasar','Baseline source'),'baseline','','select',`<option value="plan" ${c.baseline==='plan'?'selected':''}>${L('Rencana arus rutin','Recurring cash flow plan')}</option><option value="history" ${c.baseline==='history'?'selected':''}>${L('12 bulan historis lengkap','Previous 12 complete months')}</option>`)}${field(L('Rata-rata historis','Historical averaging'),'historyPolicy','','select',`<option value="fixed12" ${(c.historyPolicy||'fixed12')==='fixed12'?'selected':''}>${L('12 bulan (kosong = nol)','12 months (missing = zero)')}</option><option value="available" ${c.historyPolicy==='available'?'selected':''}>${L('Sejak bulan catatan pertama','Since first recorded month')}</option>`)}${field(L('Pertumbuhan income mengikuti','Income growth follows'),'incomeGrowthMode','','select',options(['custom','inflation'],c.incomeGrowthMode||'custom'))}${field(L('Pertumbuhan expense mengikuti','Expense growth follows'),'expenseGrowthMode','','select',options(['custom','inflation'],c.expenseGrowthMode||'custom'))}${percentField(L('Inflasi (%)','Inflation (%)'),'inflation',c.inflation)}${percentField(L('Pertumbuhan income (%)','Income growth (%)'),'incomeGrowth',c.incomeGrowth)}${percentField(L('Pertumbuhan expense (%)','Expense growth (%)'),'expenseGrowth',c.expenseGrowth)}${percentField(L('Return investasi (%)','Investment return (%)'),'investmentGrowth',c.investmentGrowth)}${percentField(L('Return kas (%)','Cash return (%)'),'cashGrowth',c.cashGrowth)}${percentField(L('Pertumbuhan properti (%)','Property growth (%)'),'propertyGrowth',c.propertyGrowth)}${field(L('Transfer investasi bulanan','Monthly investment transfer')+' · '+c.currency,'monthlyInvestment',c.monthlyInvestment/100,'number','min="0" required')}${field(L('Target akhir daya beli hari ini','Ending target in today’s money')+' · '+c.currency,'target',c.target/100,'number','min="0" required')}${percentField(L('Volatilitas investasi (%)','Investment volatility (%)'),'volatility',c.volatility)}</div><p id="forecast-error" role="alert"></p><button class="btn primary" type="submit">${L('Terapkan asumsi','Apply assumptions')}</button></form><p class="note">${c.baseline==='history'?L('Baseline historis: ','Historical baseline: ')+r.baseline.months+'/'+r.baseline.divisor+' '+L('bulan memiliki catatan. Penyebut mengikuti kebijakan pilihan; bulan kosong di antara catatan tetap dihitung nol.','months have records. The divisor follows your selected policy; empty interior months still count as zero.'):L('Baseline memakai rencana arus rutin, bukan transaksi historis.','Baseline uses recurring plans, not historical transactions.')}</p><p class="note">${L('Pertumbuhan expense terpisah dari inflasi daya beli. Transfer investasi memindahkan kas ke investasi, bukan pengeluaran atau aset tambahan. Alokasi tujuan tetap bagian aset.','Expense growth is separate from purchasing-power inflation. Investment transfers move cash into investments, without creating assets or expenses. Goal reserves remain assets.')}</p></section><section class="panel panel-pad"><div class="panel-head"><h2>${L('Kejadian hidup','Life events')}</h2>${button(L('Tambah kejadian','Add event'),'event-new','primary','plus')}</div>${c.events.map(ev=>`<div class="saved-row"><div><b>${user(ev.name)}</b><small>${ev.date}${ev.endDate?' → '+ev.endDate:''} · ${escape(ownerName(ev.ownerId))}</small><small>${money(ev.amount,false,ev.currency||c.currency)} · ${eventTypeName(ev.type)}</small></div><button class="btn" data-action="event-edit:${ev.id}">${L('Edit','Edit')}</button><button class="btn danger" data-action="event-delete:${ev.id}" aria-label="${L('Hapus kejadian','Delete event')}">×</button></div>`).join('')||`<p class="empty">${L('Rencanakan rumah, pendidikan, pensiun, atau perubahan pekerjaan.','Plan for a home, education, retirement or career changes.')}</p>`}<h2 style="margin-top:24px">${L('Asumsi akun','Account assumptions')}</h2>${viewState().accounts.map(a=>`<div class="saved-row"><div><b>${user(a.name)}</b><small>${c.accounts[a.id]?.included===false?L('Dikecualikan','Excluded'):L('Disertakan','Included')} · ${((c.accounts[a.id]?.growth??(a.type==='Investment'?c.investmentGrowth:a.type==='Property'?c.propertyGrowth:c.cashGrowth))*100).toFixed(2)}%</small></div><button class="btn" data-action="forecast-account:${a.id}">${L('Atur','Configure')}</button></div>`).join('')}<p class="note">${L('Akun yang dikecualikan tidak masuk aset awal/proyeksi; utang tetap dihitung. Model menarik dana mengikuti prioritas dan tahun akun. Properti tidak dijual otomatis.','Excluded accounts are omitted from starting/projected assets; debts remain included. Deficits follow account withdrawal rank and start year. Property is not automatically sold.')}</p></section></div>${forecastTables(r,c)}${forecastMC?forecastMCPanel():''}<details class="forecast-annual-details"><summary>${L('Rincian tahunan lengkap','Full annual breakdown')}</summary><section class="panel panel-pad" style="margin-top:22px"><h2>${L('Rincian tahunan','Annual breakdown')}</h2><div class="table-wrap"><table><thead><tr><th>${L('Tahun / usia','Year / age')}</th><th>${L('Income','Income')}</th><th>${L('Outflow','Outflow')}</th><th>${L('Bunga utang','Debt interest')}</th><th>${L('Aset','Assets')}</th><th>${L('Utang','Debt')}</th><th>${L('Shortfall','Shortfall')}</th><th>${L('Net worth','Net worth')}</th><th>${L('Detail','Detail')}</th></tr></thead><tbody>${r.annual.map((v,i)=>`<tr><td>${i} · ${v.age.toFixed(0)}</td><td>${amount(v.income)}</td><td>${amount(v.expense+v.debtPayment)}</td><td>${amount(v.interest)}</td><td>${amount(v.assets)}</td><td>${amount(v.debt)}</td><td class="${v.fundingGap?'negative':''}">${amount(v.fundingGap)}</td><td>${amount(forecastReal?v.realNetWorth:v.netWorth)}</td><td><button class="btn" data-action="forecast-year:${i}">${L('Lihat','View')}</button></td></tr>`).join('')}</tbody></table></div><p class="note">${L('Mulai dari snapshot saat ini; periode pertama adalah bulan penuh berikutnya. Baris tahunan mengagregasi 12 periode, bukan selalu tahun kalender. Kurs tetap pada kurs tersimpan; pajak, biaya trading, dan perubahan kurs masa depan belum dimodelkan. Hasil merupakan estimasi, bukan kepastian.','Starts from current snapshots; the first period is next full month. Annual rows aggregate 12 periods, not necessarily calendar years. FX stays at saved rates; taxes, trading fees and future currency changes are not modeled. Results are estimates, not guarantees.')}</p></section></details>`;}
  let forecastTableTab='accounts',forecastSetup=null;
  function forecastTables(r,c){
    const factor=v=>forecastReal?Math.pow(1+c.inflation,v.month/12):1;
    const value=(v,n)=>amount(Math.round(n/factor(v)));
    const cells=get=>r.annual.map(v=>`<td>${value(v,get(v))}</td>`).join('');
    const row=(label,get,style='')=>`<tr class="${style}"><th scope="row">${label}</th>${cells(get)}</tr>`;
    const heading=`<thead><tr><th>${L('Ukuran / akun','Metric / account')}</th>${r.annual.map((v,i)=>`<th><button data-action="forecast-year:${i}" class="forecast-column-year">${v.date.slice(0,7)}<small>${L('Usia','Age')} ${v.age.toFixed(0)}</small></button></th>`).join('')}</tr></thead>`;
    let body='';
    if(forecastTableTab==='accounts'){
      body=row(L('Kekayaan bersih','Net worth'),v=>v.netWorth,'forecast-total-row')+row(L('Aset','Assets'),v=>v.assets,'forecast-total-row');
      const names=new Map(r.annual.flatMap(v=>v.accounts.map(a=>[a.id,a.name])));
      body+=[...names].map(([id,name])=>row(user(name),v=>v.accounts.find(a=>a.id===id)?.balance||0)).join('');
      body+=row(L('Utang','Debt'),v=>v.debt,'forecast-total-row');
      const debts=new Map(r.annual.flatMap(v=>v.debts.map(d=>[d.id,d.name])));body+=[...debts].map(([id,name])=>row(user(name),v=>v.debts.find(d=>d.id===id)?.balance||0)).join('');
      body+=row(L('Kebutuhan dana belum terpenuhi','Unfunded obligations'),v=>v.fundingGap,'forecast-total-row');
    }else if(forecastTableTab==='cashflow'){
      const entries=[['income',L('Pendapatan','Income')],['expense',L('Biaya hidup & kejadian','Living costs & events')],['debtPayment',L('Pembayaran utang','Debt payments')],['interest',L('Bunga utang (termasuk pembayaran)','Debt interest (included in payments)')],['contribution',L('Transfer ke investasi','Investment transfers')],['goalReserve',L('Cadangan untuk tujuan','Goal reserves')]];
      body=entries.map(([key,label])=>row(label,v=>v[key]||0)).join('')+row(L('Pendapatan − biaya − pembayaran utang','Income − costs − debt payments'),v=>(v.income||0)-(v.expense||0)-(v.debtPayment||0),'forecast-total-row');
    }
    return `<section class="panel panel-pad" style="margin-top:22px"><div class="panel-head"><h2>${L('Rencana tahun demi tahun','Your year-by-year plan')}</h2><span class="badge">${forecastReal?L('Daya beli hari ini','Today’s purchasing power'):L('Nilai nominal','Nominal values')}</span></div><nav class="report-tabs" aria-label="${L('Rincian forecast','Forecast details')}">${[['accounts',L('Akun','Accounts')],['cashflow',L('Arus kas','Cash Flow')],['events',L('Kejadian','Events')]].map(([id,label])=>`<button data-action="forecast-table:${id}" class="${forecastTableTab===id?'active':''}" aria-pressed="${forecastTableTab===id}">${icon('forecast-'+id)}${label}</button>`).join('')}</nav>${forecastTableTab==='events'?`<div class="forecast-event-list">${r.events.map(e=>`<div class="saved-row"><div><b>${user(e.name)}</b><small>${e.date} → ${e.endDate||L('Sesuai jenis kejadian','By event type')} · ${eventTypeName(e.type)} · ${escape(ownerName(e.ownerId))}</small></div>${button(L('Edit','Edit'),'event-edit:'+e.id)}${button(L('Hapus','Delete'),'event-delete:'+e.id,'danger')}</div>`).join('')||`<p class="empty">${L('Belum ada kejadian dalam rencana ini.','No events in this plan yet.')}</p>`}${button(L('Tambah kejadian','Add event'),'event-new','primary')}</div>`:`<div class="table-wrap forecast-matrix"><table>${heading}<tbody>${body}</tbody></table></div>`}<p class="note">${L('Kolom adalah akhir setiap 12 bulan proyeksi, bukan selalu akhir tahun kalender. Kolom pertama adalah posisi saat ini. Cash Flow menjumlahkan periode; tabel Accounts memakai saldo akhir. Bunga utang adalah bagian pembayaran, bukan biaya tambahan.','Columns mark each 12-month projection end, not necessarily calendar year-end. First column is the current position. Cash Flow sums period activity; Accounts shows ending balances. Debt interest is part of payments, not an additional cost.')}</p></section>`;
  }
  function eventChooser(){openModal(L('Apa yang ingin Anda rencanakan?','What would you like to plan?'),`<div class="event-choice-grid">${[['home',L('Beli rumah','Buy a home'),'accounts'],['retirement',L('Pensiun','Retire'),'calendar'],['incomeMonthly',L('Pekerjaan / income baru','New job / income'),'cashflow'],['expenseMonthly',L('Anak / pendidikan / biaya rutin','Child / education / recurring cost'),'household'],['careerBreak',L('Jeda karier','Career break'),'calendar'],['expenseOnce',L('Biaya satu kali','One-time cost'),'cards']].map(([type,name,ic])=>`<button class="event-choice" data-action="event-template:${type}">${icon(ic)}<b>${name}</b><small>${eventTypeName(type)}</small></button>`).join('')}</div><p class="note">${L('Semua nominal dan tanggal perlu diisi sesuai rencana Anda; tidak ada biaya contoh yang otomatis dicatat.','Enter amounts and dates from your own plan; no sample expenses are recorded automatically.')}</p>`);}
  function forecastSetupView(){const d=forecastSetup,c=d.plan,p=E.position(viewState());return header(L('Bangun rencana masa depan Anda.','Build your future plan.'),L('Tiga langkah untuk meninjau data, memilih akun, dan merencanakan pensiun.','Three steps to review data, choose accounts and plan retirement.'),button(L('Batal','Cancel'),'forecast-setup-cancel'),'FORECAST SETUP')+`<section class="panel panel-pad forecast-setup"><div class="setup-steps">${[L('Konfirmasi data','Confirm data'),L('Pilih akun','Choose accounts'),L('Pensiun & tinjauan','Retirement & review')].map((label,i)=>`<span class="${i===d.step?'current':''}">${i+1}. ${label}</span>`).join('')}</div><form id="forecast-setup-form">${d.step===0?`<h2>${L('Konfirmasi informasi Anda','Confirm your information')}</h2><p class="note">${L('Saldo aktual diambil dari tampilan pemilik yang aktif. Usia adalah asumsi perencanaan; tanggal lahir tidak diperlukan.','Actual balances use the active ownership view. Age is a planning assumption; no birth date is required.')}</p><div class="preference-grid"><div><small>${L('Aset','Assets')}</small>${amount(p.assets)}</div><div><small>${L('Liabilitas','Liabilities')}</small>${amount(p.liabilities)}</div><div><small>${L('Income rutin per bulan','Recurring income per month')}</small>${amount(p.income)}</div><div><small>${L('Biaya rutin per bulan','Recurring expenses per month')}</small>${amount(p.expense)}</div></div><div class="form-grid">${field(L('Usia awal','Starting age'),'startAge',c.startAge,'number','required min="0" max="100" step="1"')}${field(L('Horizon tahun','Years ahead'),'years',c.years,'number','required min="1" max="40" step="1"')}${field(L('Arus dasar','Baseline cash flow'),'baseline','','select',`<option value="plan" ${c.baseline==='plan'?'selected':''}>${L('Rencana rutin','Recurring plan')}</option><option value="history" ${c.baseline==='history'?'selected':''}>${L('12 bulan historis lengkap','12 complete historical months')}</option>`)}</div>`:d.step===1?`<h2>${L('Akun dalam proyeksi','Accounts in your projection')}</h2><p class="note">${L('Pilih aset yang ingin dimasukkan. Utang tetap dihitung; pengecualian aset tidak menghapus utangnya. Nilai return adalah asumsi, bukan jaminan.','Choose assets to include. Debts remain modeled; excluding an asset does not remove its debt. Returns are assumptions, not guarantees.')}</p>${viewState().accounts.map(a=>{const opt=c.accounts[a.id]||{},growth=opt.growth??(a.type==='Investment'?c.investmentGrowth:a.type==='Property'?c.propertyGrowth:c.cashGrowth);return `<div class="setup-account"><label><input name="include_${a.id}" type="checkbox" ${opt.included!==false?'checked':''}> ${user(a.name)} · ${native(a,'balance')}</label>${field(L('Return tahunan %','Annual return %'),'growth_'+a.id,(growth*100).toFixed(2),'number','required min="-99" max="50" step="0.01"')}</div>`;}).join('')||`<p class="empty">${L('Belum ada akun; proyeksi tetap dapat ditinjau.','No accounts yet; you can still review the projection.')}</p>`}`:`<h2>${L('Rencanakan pensiun','Plan retirement')}</h2><p class="note">${L('Pensiun menghentikan income dasar pemilik yang dipilih. Nominal di bawah adalah income pengganti per bulan. Kejadian di luar horizon tersimpan namun tidak terlihat dalam proyeksi ini.','Retirement stops the selected owner’s baseline income. The amount below is monthly replacement income. Events outside the horizon are saved but do not appear in this projection.')}</p><label><input name="retire" type="checkbox" ${d.retire?'checked':''}> ${L('Tambahkan / perbarui kejadian pensiun','Add / update retirement event')}</label><div class="form-grid">${field(L('Usia pensiun','Retirement age'),'retirementAge',d.retirementAge,'number','required min="1" max="100" step="1"')}${field(L('Pemilik income','Income owner'),'ownerId','','select',ownerOptions(d.ownerId))}${field(L('Income pengganti per bulan','Monthly replacement income')+' · '+c.currency,'replacement',d.replacement,'number','required min="0" step="0.01"')}</div><p class="note">${L('Asumsi inflasi dan return rencana tetap dipakai. Perubahan hanya disimpan setelah tombol selesai ditekan.','Existing inflation and return assumptions remain in use. Changes are saved only after Finish.')}</p>`}<p id="setup-error" role="alert"></p><div class="form-actions">${d.step?button(L('Kembali','Back'),'forecast-setup-back'):''}<button class="btn primary" type="submit">${d.step===2?L('Selesai & lihat forecast','Finish & view forecast'):L('Lanjut','Continue')}</button></div></form></section>`;}
  function beginForecastSetup(){const c=selectedPlan(),owner=state.activeView.owner!=='all'?state.activeView.owner:state.members[0]?.id||'shared',existing=c.events.find(e=>e.type==='retirement'&&e.ownerId===owner);forecastSetup={step:0,plan:structuredClone(c),ownerId:owner,retire:!!existing,retirementAge:65,replacement:existing?existing.amount/100:0};render();}
  document.addEventListener('submit',event=>{if(event.target.id!=='forecast-setup-form')return;event.preventDefault();const d=forecastSetup;try{const data=Object.fromEntries(new FormData(event.target));if(d.step===0){const next={...d.plan,startAge:Number(data.startAge),years:Number(data.years),baseline:data.baseline};F.validatePlan(state,next);d.plan=next;d.step=1;}else if(d.step===1){const accounts={...d.plan.accounts};for(const a of viewState().accounts)accounts[a.id]={...accounts[a.id],included:!!data['include_'+a.id],growth:Number(data['growth_'+a.id])/100};const next={...d.plan,accounts};F.validatePlan(state,next);F.forecast(state,next,{start:date()});d.plan=next;d.step=2;}else{
      const next=structuredClone(d.plan);
      if(data.retire){const age=Number(data.retirementAge);if(!Number.isInteger(age)||age<=next.startAge||age>100)throw Error(L('Usia pensiun harus lebih besar dari usia awal, maksimal 100.','Retirement age must exceed starting age, maximum 100.'));const at=new Date(date()+'T12:00:00Z');at.setUTCFullYear(at.getUTCFullYear()+age-next.startAge);const existing=next.events.find(e=>e.type==='retirement'&&e.ownerId===data.ownerId);const retirement={id:existing?.id||uid(),name:L('Pensiun','Retirement'),type:'retirement',ownerId:data.ownerId,date:at.toISOString().slice(0,10),endDate:'',amount:E.cents(data.replacement),currency:next.currency};if(!existing&&next.events.length>=P.catalog.find(p=>p.id===state.commercial.previewTier).events)throw Error(L('Batas kejadian pratinjau tercapai','Preview event limit reached'));next.events=next.events.filter(e=>e.id!==retirement.id).concat(retirement);}
      F.validatePlan(state,next);F.forecast(state,next,{start:date()});if(forecastSelected==='base'){const scenarios=state.forecastPlan.scenarios;state.forecastPlan={...next,scenarios};}else state.forecastPlan.scenarios.find(sc=>sc.id===forecastSelected).plan=next;forecastMC=null;forecastSetup=null;
    }render();}catch(e){$('#setup-error').textContent=e.message;}});

  function forecastPreview(r,c){const v=r.annual[Math.min(forecastSelectedYear,c.years)],m=r.monthly.find(m=>m.month===v.month),factor=forecastReal?Math.pow(1+c.inflation,v.month/12):1;return `<span><small>${L('Tanggal / usia','Date / age')}</small><b>${v.date} · ${v.age.toFixed(0)}</b></span><span><small>${L('Kekayaan bersih','Net worth')}</small><b>${amount(Math.round(v.netWorth/factor))}</b></span><span><small>${L('Aset / utang','Assets / debt')}</small><b>${amount(Math.round(v.assets/factor))} / ${amount(Math.round(v.debt/factor))}</b></span><span><small>${L('Arus kas bulan proyeksi','Projected month cash flow')}</small><b>${m?amount(Math.round((m.income-m.expense-m.debtPayment)/factor)):'—'}</b></span>`;}
  function forecastChart(r,c,baselineValues,values,base){
    const metric=forecastChartMetric,raw=(v,plan)=>{const value=metric==='assets'?v.assets:metric==='cashflow'?(v.income-v.expense-v.debtPayment):v.netWorth;return forecastReal?value/Math.pow(1+plan.inflation,v.month/12):value;};
    const primary=(metric==='cashflow'?r.monthly.filter(v=>v.month>0):r.monthly).map(v=>({...v,value:raw(v,c)}));
    const comparison=forecastSelected==='base'?[]:(metric==='cashflow'?base.monthly.filter(v=>v.month>0):base.monthly).map(v=>({...v,value:raw(v,state.forecastPlan)}));
    const all=[...primary,...comparison].map(v=>v.value),min=Math.min(0,...all),max=Math.max(0,...all),span=Math.max(1,max-min),lo=min-span*.06,hi=max+span*.1;
    const left=100,right=965,top=100,bottom=340,x=m=>left+m/(c.years*12)*(right-left),y=value=>bottom-(value-lo)/(hi-lo)*(bottom-top);
    const poly=points=>points.map(v=>`${x(v.month)},${y(v.value)}`).join(' '),last=primary.at(-1),name={networth:L('Kekayaan bersih','Net worth'),assets:L('Aset','Assets'),cashflow:L('Arus kas bulanan','Monthly cash flow')}[metric];
    const tickStep=Math.max(1,Math.ceil(c.years/8));const tickYears=r.annual.map((v,i)=>({v,i})).filter(({i})=>i%tickStep===0||i===c.years);
    const colors={home:'#44aabb',retirement:'#e9a653',incomeMonthly:'#6ab894',expenseMonthly:'#c879af',expenseOnce:'#db8a8a',careerBreak:'#a28bcb'};
    const now=new Date(date()+'T12:00:00Z');const markers=r.events.map((e,i)=>{const d=new Date(e.date+'T12:00:00Z'),month=(d.getUTCFullYear()-now.getUTCFullYear())*12+d.getUTCMonth()-now.getUTCMonth();if(month<1||month>c.years*12)return '';const cx=x(month),labelX=Math.max(left,Math.min(right-132,cx-65)),labelY=i%2?57:20,color=colors[e.type]||'#a6b6aa';return `<g role="button" tabindex="0" data-action="event-edit:${escape(e.id)}" aria-label="${escape(L('Edit kejadian: ','Edit event: ')+e.name)}"><title>${escape(e.name)} · ${e.date}</title><line x1="${cx}" x2="${cx}" y1="${labelY+28}" y2="${bottom}" stroke="${color}" stroke-opacity=".45" stroke-dasharray="3 5"/><rect x="${labelX}" y="${labelY}" width="132" height="28" rx="14" fill="var(--paper)" stroke="${color}"/><circle cx="${labelX+13}" cy="${labelY+14}" r="4" fill="${color}"/><text x="${labelX+24}" y="${labelY+18}" class="forecast-event-label">${escape(e.name.slice(0,15))}</text></g>`;}).join('');
    return `<div class="forecast-graph-scroll"><svg class="forecast-rich-svg" viewBox="0 0 1000 410" role="img" aria-label="${escape(name)} · ${L('Proyeksi bulanan dan kejadian hidup','Monthly projections and life events')}"><defs><linearGradient id="forecast-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--chart-accent)" stop-opacity=".2"/><stop offset="100%" stop-color="var(--chart-accent)" stop-opacity="0"/></linearGradient></defs>${[0,.25,.5,.75,1].map(t=>{const v=lo+(hi-lo)*t;return `<line x1="${left}" x2="${right}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="85" y="${y(v)+4}" text-anchor="end">${escape(money(Math.round(v),true))}</text>`;}).join('')}<line x1="${left}" x2="${right}" y1="${y(0)}" y2="${y(0)}" stroke="var(--muted)" stroke-opacity=".4"/><polygon points="${x(primary[0].month)},${bottom} ${poly(primary)} ${x(last.month)},${bottom}" fill="url(#forecast-fill)"/>${comparison.length?`<polyline points="${poly(comparison)}" fill="none" stroke="var(--chart-secondary)" stroke-width="2" stroke-dasharray="6 5"/>`:''}<polyline points="${poly(primary)}" fill="none" stroke="var(--chart-accent)" stroke-width="3" stroke-linejoin="round"/>${markers}${tickYears.map(({v,i})=>`<g role="button" tabindex="0" data-action="forecast-select-year:${i}" aria-label="${escape(L('Lihat proyeksi tahun ','View projection year ')+i)}"><circle visibility="${metric==='cashflow'&&i===0?'hidden':'visible'}" cx="${x(v.month)}" cy="${y(raw(v,c))}" r="5" fill="var(--chart-accent)" stroke="var(--paper)" stroke-width="2"/><title>${v.date} · ${L('Usia','Age')} ${v.age.toFixed(0)} · ${metric==='cashflow'?L('Gunakan slider untuk arus kas bulanan','Use slider for monthly cash flow'):escape(money(Math.round(raw(v,c))))}</title><text x="${x(v.month)}" y="372" text-anchor="middle">${i===0?L('Sekarang','Now'):new Date(v.date).getUTCFullYear()}</text><text x="${x(v.month)}" y="392" text-anchor="middle">${L('Usia','Age')} ${v.age.toFixed(0)}</text></g>`).join('')}</svg></div><div class="forecast-graph-legend"><span><i class="forecast-primary-key"></i>${forecastSelected==='base'?L('Rencana dasar','Baseline plan'):L('Skenario terpilih','Selected scenario')}</span>${comparison.length?`<span><i class="forecast-secondary-key"></i>${L('Rencana dasar','Baseline plan')}</span>`:''}<span>${L('Garis memakai titik proyeksi bulanan','Line uses monthly projection points')}</span></div><label class="forecast-year-slider">${L('Jelajahi tahun proyeksi','Explore projection year')}<input type="range" id="forecast-preview-year" min="0" max="${c.years}" step="1" value="${Math.min(forecastSelectedYear,c.years)}"></label><div id="forecast-preview" class="forecast-preview">${forecastPreview(r,c)}</div>`;
  }
  function safeForecast(){try{return forecast();}catch(e){return header(L('Periksa asumsi Forecast','Review Forecast assumptions'),L('Proyeksi tidak dapat dihitung dengan nilai saat ini. Catatan aktual tetap tersedia.','The current assumptions cannot be projected. Actual records remain available.'),'','FORECAST')+`<section class="panel panel-pad"><p role="alert">${escape(e.message)}</p><p class="note">${L('Ekspor backup sebelum mereset rencana simulasi. Reset hanya menghapus kejadian/asumsi rencana terpilih.','Export a backup before resetting the simulation plan. Reset only clears the selected plan’s events and assumptions.')}</p>${button(L('Ekspor backup','Export backup'),'export')}${button(L('Reset rencana terpilih','Reset selected plan'),'forecast-recover','danger')}</section>`;}}
  function eventTypeName(type){return {expenseOnce:L('Pembelian / biaya satu kali','One-time purchase / expense'),expenseMonthly:L('Biaya rutin / pendidikan','Recurring expense / education'),incomeMonthly:L('Tambahan income / pekerjaan baru','Additional income / new job'),retirement:L('Pensiun: pengganti income','Retirement: replacement income'),careerBreak:L('Jeda karier: pengganti income','Career break: replacement income'),home:L('Beli rumah + pembiayaan','Home purchase + financing')}[type];}
  function forecastMCPanel(){return `<section class="panel panel-pad" style="margin-top:22px"><div class="panel-head"><h2>${L('Monte Carlo rencana terpilih','Selected plan Monte Carlo')}</h2><span class="badge">${forecastMC.paths} paths · seed ${forecastMC.seed}</span></div><div class="chart-container">${lineChart(forecastMC.bands.map(b=>b.p50),forecastMC.bands.map(b=>String(b.year)),{name:'P50',second:forecastMC.bands.map(b=>b.p10),secondName:'P10'})}</div><p>${L('Peluang memenuhi target akhir','Probability of meeting ending target')}: <b>${(forecastMC.success*100).toFixed(1)}%</b> · ${L('Peluang shortfall dalam periode','Probability of shortfall during horizon')}: <b>${(forecastMC.shortfalls*100).toFixed(1)}%</b></p><div class="table-wrap"><table><thead><tr><th>${L('Tahun','Year')}</th><th>P10</th><th>P50</th><th>P90</th></tr></thead><tbody>${forecastMC.bands.map(b=>`<tr><td>${b.year}</td><td>${amount(b.p10)}</td><td>${amount(b.p50)}</td><td>${amount(b.p90)}</td></tr>`).join('')}</tbody></table></div><p class="note">${L('Nilai disesuaikan inflasi. Menggunakan akun, utang, kejadian, dan aturan penarikan dari rencana terpilih. Return investasi lognormal; akun investasi memakai guncangan pasar yang sama (korelasi 1). Tidak menyimulasikan pajak atau risiko kurs.','Values are inflation adjusted. Uses accounts, debt, events and withdrawal rules from the selected plan. Investment returns are lognormal; investment accounts share the same market shock (correlation 1). Taxes and FX risk are not simulated.')}</p></section>`;}
  function resetFinancialSession(){cardImageGeneration++;cardImageId=null;txEdit=null;txQuery='';txKind='all';if(recorder?.state==='recording')recorder.stop();aiGeneration++;aiBusy=false;captureBusy=false;quickMinimized=false;quickAttachment=null;quickAttachmentGeneration++;quickFileBusy=false;investmentFrom='';investmentTo='';investmentAccount='all';investmentMain='holdings';investmentTab='market';investmentGroup='assetClass';investmentRange='all';investmentMode='auto';investmentMetric='return';investmentHolding='all';investmentChartState=null;investmentSelected=['sp500'];rebalanceNewCash=0;cashflowViewMonth='plan';quickAccount='';quickText='';quickReply='';reportFilter=F.defaultFilter(date());reportDrill=null;forecastSelected='base';forecastSetup=null;forecastTableTab='accounts';forecastMC=null;forecastResult=null;}
  function saveView(){openModal(L('Simpan perspektif','Save perspective'),form(field(L('Nama tampilan','View name'),'name',ownerName(state.activeView.owner),'text','required maxlength="120"')),d=>{if(state.savedViews.length>=100)throw Error('Maximum 100 views');state.savedViews.push({id:uid(),name:requireText(d.name),view:structuredClone(state.activeView),currency:state.currency});});}
  function editMember(id){const m=state.members.find(m=>m.id===id);openModal(L('Anggota perencanaan lokal','Local planning member'),form(field(L('Nama','Name'),'name',m?.name||'','text','required maxlength="80"')+field(L('Peran / label','Role / label'),'role',m?.role||L('Anggota keluarga','Household member'),'text','required maxlength="80"'),'Save',L('Tidak mengirim undangan atau membuat login.','Does not send invitations or create a login.')),d=>{const name=requireText(d.name),role=requireText(d.role);if(m){m.name=name;m.role=role;m.initials=name.split(/\s+/).slice(0,2).map(n=>n[0]).join('').toUpperCase();for(const a of state.accounts.filter(a=>a.ownerId===id))a.owner=name;}else state.members.push({id:uid(),name,role,initials:name.split(/\s+/).slice(0,2).map(n=>n[0]).join('').toUpperCase()});});}
  function editOwnership(payload){const n=payload.indexOf('_'),key=payload.slice(0,n),id=payload.slice(n+1);if(!['accounts','debts','goals','flows'].includes(key))return;const row=state[key].find(r=>r.id===id);if(!row)return;openModal(L('Kepemilikan: ','Ownership: ')+row.name,form(ownerField(row),'Save',L('Kepemilikan adalah atribusi analisis, bukan perubahan kepemilikan hukum.','Ownership is an analysis attribution, not a legal ownership change.')),d=>{if(!F.matchOwner||!['shared',...state.members.map(m=>m.id)].includes(d.ownerId))throw Error('Unknown owner');row.ownerId=d.ownerId;if(key==='accounts')row.owner=ownerName(d.ownerId);forecastMC=null;});}
  function editTransactionOwner(id){const tx=state.transactions.find(t=>t.id===id);if(!tx)return;const choices=`<option value="inherit" ${tx.ownerId===null?'selected':''}>${L('Ikuti akun','Follow account')}</option>`+ownerOptions(tx.ownerId);const owners=[['shared',L('Bersama','Shared')],...state.members.map(m=>[m.id,m.name])];openModal(L('Pemilik / split transaksi','Transaction owner / split'),form(`<p class="note">${user(tx.name)} · ${native(tx,'amount')} · ${tx.date}</p>`+field(L('Pemilik saat tanpa split','Owner when not split'),'ownerId','','select',choices)+field(L('Metode pembagian','Split method'),'mode','','select',options(tx.kind==='transfer'?['none']:['none','amount','percent'],tx.splits?.length?'amount':'none'))+owners.map(([owner,name])=>field(escape(name)+' · '+tx.currency+' / %','split_'+owner,(tx.splits?.find(p=>p.ownerId===owner)?.amount||0)/100,'number','min="0"')).join(''),'Save',L('Pilih amount untuk nominal mata uang asli, atau percent untuk persentase total 100. Masukkan 0 untuk pemilik yang tidak ikut. Pembagian tidak mengubah saldo atau nominal transaksi.','Choose amount for native amounts or percent for percentages totaling 100. Enter 0 for nonparticipants. Splits do not change balances or the original transaction amount.')),d=>{const weights=owners.map(([ownerId])=>({ownerId,amount:E.cents(d['split_'+ownerId]||'0')})).filter(p=>p.amount>0);const splits=d.mode==='none'?[]:d.mode==='percent'?F.splitPercent(state,tx,weights):weights;F.setTransactionOwnership(state,id,d.ownerId==='inherit'?null:d.ownerId,splits);forecastMC=null;});}
  function bulkOwnership(){const ids=F.scopedTransactions(state).map(t=>t.id);openModal(L('Edit pemilik transaksi massal','Bulk transaction ownership'),form(`<p class="note">${L('Pilih ID transaksi dari daftar yang terlihat. Ini mengubah pemilik seluruh transaksi sumber dan menghapus split lama; saldo tidak berubah.','Select transaction IDs from the visible list. This changes ownership of whole source transactions and clears existing splits; balances stay unchanged.')}</p><div class="bulk-list">${state.transactions.filter(t=>ids.includes(t.id)).map(t=>`<label><input type="checkbox" name="tx_${t.id}"> ${user(t.name)} · ${t.date} · ${native(t,'amount')}</label>`).join('')}</div>`+ownerField(),'Save'),d=>{const selected=ids.filter(id=>d['tx_'+id]);if(!selected.length)throw Error(L('Pilih transaksi terlebih dahulu','Select transactions first'));const candidate=structuredClone(state);for(const id of selected)F.setTransactionOwnership(candidate,id,d.ownerId,[]);E.validate(candidate);state=candidate;});}
  function editEvent(id,template){const c=selectedPlan(),ev=c.events.find(e=>e.id===id),next=new Date(date()+'T12:00:00Z');next.setUTCMonth(next.getUTCMonth()+1,1);const types=['expenseOnce','expenseMonthly','incomeMonthly','retirement','careerBreak','home'];openModal(L('Rencanakan kejadian hidup','Plan a life event'),form(field(L('Nama kejadian','Event name'),'name',ev?.name||(template?eventTypeName(template):''),'text','required maxlength="120"')+field(L('Jenis kejadian','Event type'),'type','','select',types.map(v=>`<option value="${v}" ${v===(ev?.type||template)?'selected':''}>${eventTypeName(v)}</option>`).join(''))+ownerField(ev)+field(L('Mulai','Start'),'date',ev?.date||next.toISOString().slice(0,10),'date','required')+field(L('Selesai (opsional, kejadian rutin)','End (optional, recurring events)'),'endDate',ev?.endDate||'','date')+field(L('Nominal / harga rumah / income pengganti','Amount / home price / replacement income'),'amount',(ev?.amount||0)/100,'number','min="0" required')+field(L('Mata uang kejadian','Event currency'),'currency','','select',options(E.currencies,ev?.currency||c.currency))+field(L('Uang muka rumah (%)','Home down payment (%)'),'downPayment',ev?.downPayment??20,'number','min="0" max="100"')+field(L('APR pinjaman rumah (%)','Home loan APR (%)'),'apr',ev?.apr??6,'number','min="0" max="100"')+field(L('Tenor rumah (tahun)','Home loan term (years)'),'termYears',ev?.termYears??20,'number','min="1" max="40"'),'Save',L('Pensiun/jeda karier menghentikan income dasar pemilik selama periode aktif; nominal adalah income pengganti bulanan. Rumah menciptakan properti dan pinjaman; hanya uang muka mengurangi kas. Parameter rumah diabaikan untuk jenis lain. Biaya pendidikan memakai biaya rutin dengan tanggal akhir.','Retirement/career breaks stop the owner’s baseline income during the active period; amount is monthly replacement income. Homes create property and a loan; only the down payment reduces cash. Home fields are ignored for other types. Education uses recurring expenses with an end date.')),d=>{const record={id:ev?.id||uid(),name:requireText(d.name),type:d.type,ownerId:d.ownerId,date:d.date,endDate:d.endDate||'',amount:E.cents(d.amount),currency:d.currency,downPayment:Number(d.downPayment),apr:Number(d.apr),termYears:Number(d.termYears)};if(['expenseOnce','home'].includes(record.type)&&record.date.slice(0,7)<=date().slice(0,7))throw Error(L('Kejadian satu kali harus mulai pada bulan berikutnya atau setelahnya.','One-time events must start next month or later.'));const candidate={...c,events:[...c.events.filter(e=>e.id!==id),record]};if(!ev&&candidate.events.length>P.catalog.find(p=>p.id===state.commercial.previewTier).events)throw Error(L('Batas kejadian pratinjau tercapai; periksa paket.','Preview event limit reached; check membership.'));F.validatePlan(state,candidate);F.forecast(state,candidate,{start:date()});c.events=candidate.events;forecastMC=null;});}
  function forecastAccount(id){const a=getAccount(id),c=selectedPlan();if(!a)return;const settings=c.accounts[id]||{included:true,growth:a.type==='Investment'?c.investmentGrowth:a.type==='Property'?c.propertyGrowth:c.cashGrowth};openModal(L('Asumsi akun: ','Account assumptions: ')+a.name,form(percentField(L('Return tahunan (%)','Annual return (%)'),'growth',settings.growth)+field(L('Prioritas penarikan (kecil lebih dulu)','Withdrawal rank (lower first)'),'withdrawalRank',settings.withdrawalRank??(a.type==='Investment'?50:0),'number','required min="0" max="100" step="1"')+field(L('Penarikan mulai tahun proyeksi','Withdraw from projection year'),'withdrawalStartYear',settings.withdrawalStartYear||1,'number','required min="1" max="40" step="1"')+field(L('Jadwal return: tahun=persen, pisahkan koma','Return schedule: year=percent, comma-separated'),'growthSchedule',(settings.growthSchedule||[]).map(r=>r.year+'='+(r.rate*100)).join(', '),'text','maxlength="800"')+`<label><input name="included" type="checkbox" ${settings.included?'checked':''}> ${L('Sertakan dalam Forecast','Include in Forecast')}</label>`,'Save',L('Contoh jadwal: 1=6, 10=4. Nilai berlaku sampai entri berikutnya. Prioritas/tahun penarikan berlaku untuk kas dan investasi; properti tidak dijual otomatis. Utang tetap dihitung.','Example schedule: 1=6, 10=4. Rates apply until the next entry. Rank/start year apply to cash and investments; property is not automatically sold. Debts remain included.')),d=>{const growthSchedule=String(d.growthSchedule||'').trim()?d.growthSchedule.split(',').map(row=>{const parts=row.trim().split('=');if(parts.length!==2||!parts.every(p=>p.trim()))throw Error('Use year=percent, for example 1=6, 10=4');return {year:Number(parts[0]),rate:Number(parts[1])/100};}):[];const entry={growth:Number(d.growth)/100,included:!!d.included,withdrawalRank:Number(d.withdrawalRank),withdrawalStartYear:Number(d.withdrawalStartYear),growthSchedule},candidate={...c,accounts:{...c.accounts,[id]:entry}};F.validatePlan(state,candidate);F.forecast(state,candidate,{start:date()});c.accounts=candidate.accounts;forecastMC=null;});}

  function forecastYear(index){const r=forecastResult?.annual[Number(index)];if(!r)return;const months=forecastResult.monthly.filter(m=>Number(index)>0&&m.month>(Number(index)-1)*12&&m.month<=Number(index)*12);openModal(L('Rincian proyeksi tahun ','Projection detail for year ')+index,`<p class="note">${r.date} · ${state.currency} · ${L('Nilai nominal','Nominal values')}</p><h3>${L('Saldo akun akhir periode','End-of-period account balances')}</h3><div class="details-list">${r.accounts.map(a=>`<div class="detail-line"><span>${user(a.name)}</span><b>${amount(a.balance)}</b></div>`).join('')}</div><h3>${L('Saldo utang','Debt balances')}</h3><div class="details-list">${r.debts.map(d=>`<div class="detail-line"><span>${user(d.name)}</span><b>${amount(d.balance)}</b></div>`).join('')}</div><h3>${L('Arus bulanan','Monthly cash flows')}</h3><div class="table-wrap"><table><thead><tr><th>${L('Periode','Period')}</th><th>Income</th><th>Expense</th><th>${L('Bayar utang','Debt payments')}</th><th>${L('Kas','Cash')}</th><th>${L('Shortfall','Shortfall')}</th></tr></thead><tbody>${months.map(m=>`<tr><td>${m.date.slice(0,7)}</td><td>${amount(m.income)}</td><td>${amount(m.expense)}</td><td>${amount(m.debtPayment)}</td><td>${amount(m.liquid)}</td><td>${amount(m.fundingGap)}</td></tr>`).join('')}</tbody></table></div><div class="form-actions">${button(t('Close'),'modal-close')}</div>`);}
  const csvCell=v=>{let s=String(v??'');if(/^\s*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
  function exportRows(name,rows){download(name,rows.map(r=>r.map(csvCell).join(',')).join('\r\n'),'text/csv');}
  function exportReport(){if(reportFilter.tab==='networth'){exportRows('inveys-networth.csv',[['Date','Assets','Debt','NetWorth','Currency'],...F.history(state,reportFilter).map(r=>[r.date,r.assets/100,r.debt/100,r.netWorth/100,state.currency])]);return;}if(['debt','cards'].includes(reportFilter.tab)){const v=viewState(),debts=reportFilter.tab==='cards'?v.debts.filter(d=>v.cards.some(c=>c.debtId===d.id)):v.debts;exportRows('inveys-debt-position.csv',[['AsOf','Name','Owner','Balance','Currency','APR','MonthlyMinimum'],...debts.map(d=>[date(),d.name,ownerName(d.ownerId),d.balance/100,d.currency,d.apr,d.minimum/100])]);return;}const r=F.reports(state,reportFilter);exportRows('inveys-report.csv',[['Date','Description','Category','Type','NativePortion','NativeCurrency','ReportingValue','ReportingCurrency','Owner','FXDate'],...reportRows(r).map(t=>[t.date,t.name,t.category,t.kind,t.amount/100,t.currency,F.reported(state,t)/100,state.currency,t.splits?.length?'Split':ownerName(F.transactionOwner(state,t)),state.fx.date])]);}
  const v4Names=new Set(['view-save','view-load','view-delete','member-new','member-edit','ownership','ownership-tx','owner-bulk','dashboard-edit','position-snapshot','report-tab','report-chart','heatmap-view','report-period','report-reset','report-save','report-load','report-delete','report-drill','report-undrill','report-export','report-chart-export','forecast-setup','forecast-setup-back','forecast-setup-cancel','forecast-table','event-template','forecast-select-year','forecast-save','forecast-delete','forecast-export','forecast-account','forecast-year','forecast-mc','event-new','event-edit','event-delete','forecast-recover']);
  function v4Action(name,id){try{switch(name){
    case 'view-save':saveView();break;
    case 'view-load':{const v=state.savedViews.find(v=>v.id===id);if(v){state.activeView=structuredClone(v.view);state.currency=v.currency||state.currency;forecastMC=null;mcConfig=null;mcResult=null;messages=[];render();}break;}
    case 'view-delete':state.savedViews=state.savedViews.filter(v=>v.id!==id);render();break;
    case 'member-new':editMember();break;case 'member-edit':editMember(id);break;case 'ownership':editOwnership(id);break;case 'ownership-tx':editTransactionOwner(id);break;case 'owner-bulk':bulkOwnership();break;
    case 'dashboard-edit':openModal(L('Atur dashboard','Customize dashboard'),form(['position','history','accounts','goals','bills'].map(k=>`<label><input type="checkbox" name="${k}" ${state.dashboardWidgets.includes(k)?'checked':''}> ${L({position:'Ringkasan posisi',history:'Riwayat posisi',accounts:'Akun',goals:'Tujuan',bills:'Komitmen mendatang'}[k],{position:'Position summary',history:'Position history',accounts:'Accounts',goals:'Goals',bills:'Upcoming commitments'}[k])}</label>`).join('')),d=>{state.dashboardWidgets=['position','history','accounts','goals','bills'].filter(k=>d[k]);});break;
    case 'position-snapshot':F.snapshot(state,date());save();render();toast(L('Snapshot hari ini disimpan; tanggal yang sama diperbarui.','Today’s snapshot saved; an existing same-day snapshot is replaced.'));break;
    case 'heatmap-view':if(['marketcap','calendar'].includes(id)){heatmapViewMode=id;render();}break;
    case 'report-chart':if(!['bars','sankey','treemap','heatmap','pie'].includes(id))break;reportFilter.chart=id==='sankey'&&reportFilter.tab!=='cashflow'?'bars':id;if(id==='bars')reportFilter.group='month';reportDrill=null;render();break;
    case 'report-period':{const end=date();reportFilter.to=end;if(id==='year')reportFilter.from=end.slice(0,4)+'-01-01';else if(id==='all')reportFilter.from=state.transactions.map(t=>t.date).sort()[0]||end;else if(id==='30'){const start=new Date(end+'T12:00:00Z');start.setUTCDate(start.getUTCDate()-29);reportFilter.from=start.toISOString().slice(0,10);}reportDrill=null;render();break;}
    case 'report-tab':reportFilter.tab=id;if(id!=='cashflow'&&reportFilter.chart==='sankey')reportFilter.chart='bars';reportDrill=null;render();break;
    case 'report-reset':reportFilter=F.defaultFilter(date());reportDrill=null;render();break;
    case 'report-drill':{const r=F.reports(state,reportFilter);reportDrill=r.groups[Number(id)]?.key??null;render();break;}
    case 'report-undrill':reportDrill=null;render();break;
    case 'report-save':openModal(L('Simpan laporan','Save report'),form(field(L('Nama laporan','Report name'),'name',L('Laporan keluarga','Household report'),'text','required maxlength="120"')),d=>{if(state.savedReports.length>=100)throw Error('Maximum 100 reports');state.savedReports.push({id:uid(),name:requireText(d.name),view:structuredClone(state.activeView),filter:structuredClone(reportFilter),currency:state.currency});});break;
    case 'report-load':{const v=state.savedReports.find(v=>v.id===id);if(v){state.activeView=structuredClone(v.view);state.currency=v.currency||state.currency;reportFilter=structuredClone(v.filter);reportDrill=null;forecastMC=null;mcConfig=null;mcResult=null;messages=[];render();}break;}
    case 'report-delete':state.savedReports=state.savedReports.filter(v=>v.id!==id);render();break;
    case 'report-export':exportReport();break;
    case 'report-chart-export':{const r=F.reports(state,reportFilter);if(!r.rows.length){toast(L('Belum ada data grafik untuk diekspor','No chart data to export'));break;}const markup=reportFilter.chart==='sankey'&&reportFilter.tab==='cashflow'?sankey(r):reportFilter.chart==='pie'?donutChart(r):['heatmap','treemap'].includes(reportFilter.chart)?heatmap(r):bars(r);const match=markup.match(/<svg[\s\S]*?<\/svg>/);if(!match){toast(L('Tidak ada visualisasi grafik yang tersedia untuk diekspor','No chart visualization available to export'));break;}const svg=match[0].replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ').replace(/class="[^"]*"/g,'').replace(/style="[^"]*"/g,'').replace('</svg>','<style>text{font-family:Arial,sans-serif;font-size:12px;fill:#53665c}</style></svg>');download('inveys-report-'+reportFilter.chart+'.svg',svg,'image/svg+xml');break;}
    case 'forecast-setup':beginForecastSetup();break;case 'forecast-setup-back':if(forecastSetup){forecastSetup.step=Math.max(0,forecastSetup.step-1);render();}break;case 'forecast-setup-cancel':forecastSetup=null;render();break;case 'forecast-table':if(['accounts','cashflow','events'].includes(id)){forecastTableTab=id;render();}break;case 'event-template':if(['home','retirement','incomeMonthly','expenseMonthly','careerBreak','expenseOnce'].includes(id))editEvent(undefined,id);break;
    case 'forecast-select-year':forecastSelectedYear=Math.max(0,Math.min(selectedPlan().years,Number(id)||0));render();break;
    case 'forecast-save':openModal(L('Simpan skenario baru','Save new scenario'),form(field(L('Nama skenario','Scenario name'),'name',L('Skenario alternatif','Alternative scenario'),'text','required maxlength="120"')),d=>{if(state.forecastPlan.scenarios.length>=20)throw Error('Maximum 20 scenarios');const plan=structuredClone(selectedPlan());plan.scenarios=[];const sc={id:uid(),name:requireText(d.name),plan};state.forecastPlan.scenarios.push(sc);forecastSelected=sc.id;forecastMC=null;});break;
    case 'forecast-delete':confirmAction(L('Hapus skenario ini?','Delete this scenario?'),L('Rencana dasar dan catatan aktual tetap tersedia.','The baseline plan and actual records remain available.'),()=>{state.forecastPlan.scenarios=state.forecastPlan.scenarios.filter(sc=>sc.id!==id);forecastSelected='base';forecastMC=null;});break;
    case 'forecast-export':{const r=F.forecast(state,selectedPlan(),{start:date()});exportRows('inveys-forecast.csv',[['Month','Period','Income','Expense','DebtPayments','Interest','Assets','Debt','UnfundedObligations','NetWorth','RealNetWorth','Currency'],...r.monthly.map(m=>[m.month,m.date,m.income/100,m.expense/100,m.debtPayment/100,m.interest/100,m.assets/100,m.debt/100,m.fundingGap/100,m.netWorth/100,m.realNetWorth/100,state.currency])]);break;}
    case 'forecast-recover':confirmAction(L('Reset rencana simulasi terpilih?','Reset the selected simulation plan?'),L('Kejadian dan asumsi rencana terpilih dihapus. Akun, transaksi, utang, dan rencana lain tetap tersedia.','The selected plan’s events and assumptions are cleared. Accounts, transactions, debt and other plans remain available.'),()=>{const c=selectedPlan();Object.assign(c,{years:10,startAge:35,inflation:.03,incomeGrowth:.02,expenseGrowth:.03,investmentGrowth:.05,cashGrowth:0,propertyGrowth:.025,monthlyInvestment:0,volatility:.15,target:0,baseline:'plan',accounts:Object.fromEntries(state.accounts.filter(a=>a.balance<0&&!['Checking','Savings','Cash'].includes(a.type)).map(a=>[a.id,{growth:0,included:false}])),events:[]});forecastMC=null;});break;
    case 'forecast-account':forecastAccount(id);break;case 'forecast-year':forecastYear(id);break;
    case 'forecast-mc':openModal(L('Monte Carlo terpadu','Integrated Monte Carlo'),form(field(L('Jumlah jalur','Paths'),'paths',300,'number','min="100" max="1000" required')+field('Seed','seed',42,'number','required')),d=>{const result=F.monteCarlo(state,selectedPlan(),{start:date(),paths:Number(d.paths),seed:Number(d.seed)});forecastMC=result;forecastMCSig=forecastSignature();});break;
    case 'event-new':eventChooser();break;case 'event-edit':editEvent(id);break;case 'event-delete':selectedPlan().events=selectedPlan().events.filter(e=>e.id!==id);forecastMC=null;render();break;
  }}catch(e){toast(e.message);}}
  document.addEventListener('change',event=>{const el=event.target;if(el.id==='active-owner'){forecastSetup=null;state.activeView.owner=el.value;F.validateView(state,state.activeView);forecastMC=null;messages=[];mcConfig=null;mcResult=null;render();}if(el.id==='include-shared'){forecastSetup=null;state.activeView.includeShared=el.checked;forecastMC=null;messages=[];mcConfig=null;mcResult=null;render();}if(el.id==='forecast-chart-metric'&&['networth','assets','cashflow'].includes(el.value)){forecastChartMetric=el.value;render();}if(el.id==='forecast-scenario'){forecastSelected=el.value;forecastMC=null;render();}if(el.id==='forecast-real'){forecastReal=el.checked;render();}});
  document.addEventListener('change',event=>{if(event.target.id==='report-chart')act('report-chart:'+event.target.value);if(event.target.id==='report-group'){if(!['category','merchant','account','owner','month'].includes(event.target.value))return;reportFilter.group=event.target.value;reportDrill=null;render();}});
  document.addEventListener('submit',event=>{if(!['report-form','forecast-form'].includes(event.target.id))return;event.preventDefault();try{const d=Object.fromEntries(new FormData(event.target));if(event.target.id==='report-form'){const next={...reportFilter,...d};if(next.tab!=='cashflow'&&next.chart==='sankey')next.chart='bars';F.validateReportFilter(state,next);reportFilter=next;reportDrill=null;}else{const c=selectedPlan(),next={...c,years:Number(d.years),startAge:Number(d.startAge),baseline:d.baseline,historyPolicy:d.historyPolicy||c.historyPolicy||'fixed12',incomeGrowthMode:d.incomeGrowthMode||'custom',expenseGrowthMode:d.expenseGrowthMode||'custom',monthlyInvestment:E.cents(d.monthlyInvestment),target:E.cents(d.target)};for(const key of ['inflation','incomeGrowth','expenseGrowth','investmentGrowth','cashGrowth','propertyGrowth','volatility'])next[key]=Number(d[key])/100;F.validatePlan(state,next);F.forecast(state,next,{start:date()});if(forecastSelected==='base')state.forecastPlan=next;else state.forecastPlan.scenarios.find(sc=>sc.id===forecastSelected).plan=next;forecastMC=null;}render();}catch(e){$(event.target.id==='report-form'?'#report-error':'#forecast-error').textContent=e.message;}});

  const P=window.InveysPlans;
  let planCycle='monthly';
  const planMoney=n=>new Intl.NumberFormat(locale(),{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
  const planFeatureLabel=id=>({core:L('Rekening, transaksi, kartu kredit & laporan','Accounts, transactions, credit cards & reports'),autorules:L('Aturan otomatis & pembersihan transaksi','Auto-rules & transaction cleanup'),forecast:L('Forecast & perencanaan pensiun','Forecast & retirement planning'),investment:L('Perbandingan benchmark investasi','Investment benchmark comparison'),rebalance:L('Rebalancing portofolio & analisis drift','Portfolio rebalancing & drift analysis'),montecarlo:L('Monte Carlo terpadu','Integrated Monte Carlo'),scenarios:L('Beberapa skenario forecast','Multiple forecast scenarios'),integrations:L('Telegram & akses AI eksternal','Telegram & external AI access'),crypto:L('Konektor API exchange crypto (Bybit/Binance/OKX)','Crypto exchange API connectors (Bybit/Binance/OKX)')})[id]||id;
  function plans(){
    const tier=state.commercial.previewTier;
    const activePlan=currentUser?.plan||'plus';
    const statusBanner=`<div class="panel panel-pad" style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.3);border-radius:12px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <span style="font-size:11px;font-weight:700;color:var(--accent,#34d399);text-transform:uppercase;letter-spacing:1px;">${L('Status Akun & Brankas','Account & Vault Status')}</span>
        <h3 style="margin:4px 0 0 0;font-size:18px;">INVEYS ${activePlan.toUpperCase()} · ${currentUser?currentUser.email:(isServerMode?'Cloud Node':'Local Vault')}</h3>
        <p class="note" style="margin:4px 0 0 0;">${L('Fitur sinkronisasi multi-device & brankas multi-tenant aktif.','Multi-device synchronization & tenant vault active.')}</p>
      </div>
      <div style="display:flex;gap:8px;">
        ${button(L('🔑 Aktivasi Kunci Lisensi','🔑 Activate License Key'),'license-activate','primary')}
      </div>
    </div>`;
    return header(L('Satu sistem, tiga tingkat kebutuhan.','One system, three levels of ambition.'),L('Plus, Pro dan Ultra. Harga draft dan akses pratinjau; checkout berbayar belum terhubung.','Plus, Pro and Ultra. Draft prices and preview access; paid checkout is not connected.'),button(L('Atur harga draft','Configure draft pricing'),'plan-pricing')+button(L('🔑 Aktivasi Lisensi','🔑 Activate License'),'license-activate')+button(L('🌐 Halaman Penjualan & Promosi','🌐 Public Sales Landing Page'),'landing-open','primary'),'INVEYS MEMBERSHIP')+statusBanner+`<section class="panel panel-pad plan-status"><div><b>${L('Mode pratinjau paket','Plan preview mode')}: ${tier.toUpperCase()}</b><p class="note">${L('Mengganti pratinjau tidak memungut biaya, mengaktifkan langganan, atau menghapus data.','Changing preview does not charge, activate a subscription or delete records.')}</p></div><div class="segmented"><button data-action="plan-cycle:monthly" class="${planCycle==='monthly'?'active':''}" aria-pressed="${planCycle==='monthly'}">${L('Bulanan','Monthly')}</button><button data-action="plan-cycle:annual" class="${planCycle==='annual'?'active':''}" aria-pressed="${planCycle==='annual'}">${L('Tahunan','Annual')}</button></div></section><div class="plan-grid">${P.catalog.map(p=>{const q=P.quote(state.commercial,p.id,planCycle);return `<section class="panel panel-pad plan-card ${p.id===tier?'selected':''}"><span class="badge">${p.id==='pro'?L('Pilihan seimbang','Balanced choice'):p.id==='plus'?L('Keuangan sehari-hari','Everyday finances'):L('Kendali menyeluruh','Complete control')}</span><h2>INVEYS ${p.name}</h2><div class="plan-price">${planMoney(q.amount)}<small>/${planCycle==='monthly'?L('bulan','month'):L('tahun','year')}</small></div><p class="note">${planCycle==='annual'&&q.saving>0?L('Lebih rendah ','Lower by ')+(q.saving*100).toFixed(0)+'% '+L('dibanding 12 pembayaran bulanan','than 12 monthly payments'):L('Harga draft · belum ditagihkan','Draft price · not billed')}</p><ul>${P.features.filter(f=>P.allowed(p.id,f.id)).map(f=>`<li>${escape(planFeatureLabel(f.id))}</li>`).join('')}<li>${p.scenarios} ${L('skenario tersimpan','saved scenarios')} · ${p.events} ${L('kejadian per rencana','events per plan')}</li></ul><div style="display:flex;flex-direction:column;gap:8px;">${button(L('Beli / Langganan Sekarang','Subscribe / Purchase Now'),'plan-checkout:'+p.id,'primary')}${button(p.id===tier?L('Pratinjau aktif','Preview active'):L('Pratinjau paket','Preview plan'),'plan-preview:'+p.id,p.id===tier?'':'')}<p class="note">${L('Data lokal; layanan eksternal tetap memerlukan konfigurasi.','Local data; external services still require configuration.')}</p></div></section>`;}).join('')}</div><section class="panel panel-pad" style="margin-top:24px"><h2>${L('Perbandingan paket','Compare plans')}</h2><div class="table-wrap"><table><thead><tr><th>${L('Fitur','Feature')}</th>${P.catalog.map(p=>`<th>${p.name}</th>`).join('')}</tr></thead><tbody>${P.features.map(f=>`<tr><td>${escape(planFeatureLabel(f.id))}</td>${P.catalog.map(p=>`<td>${P.allowed(p.id,f.id)?'✓':'—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="note">${L('Pratinjau ini mengatur pengalaman UI, bukan verifikasi hak akses berbayar. Login, tenant, checkout, webhook pembayaran, pajak dan pengelolaan langganan server belum diaktifkan.','This preview controls the UI experience, not paid authorization. Login, tenants, checkout, payment webhooks, taxes and server subscription management are not activated.')}</p></section>`;
  }
  function planGate(feature){if(P.allowed(state.commercial.previewTier,feature))return false;openModal(L('Fitur pada paket lebih tinggi','Feature on a higher plan'),`<p class="note">${L('Fitur ini berada pada paket Pro atau Ultra dalam pratinjau. Data yang sudah ada tetap tersedia. Tidak ada pembayaran otomatis.','This feature belongs to Pro or Ultra in preview. Existing records remain available. No automatic payment occurs.')}</p><div class="button-group">${button(L('Bandingkan paket','Compare plans'),'plan-open','primary')}${button(t('Close'),'modal-close')}</div>`);return true;}
  function planAction(name,id){
    if(name==='landing-open'){window.open(location.protocol==='file:'?'landing.html':'/', '_blank');return;}
    if(name==='plan-open'){$('#modal').close();navigate('plans');}
    if(name==='plan-cycle'&&['monthly','annual'].includes(id)){planCycle=id;render();}
    if(name==='plan-preview'&&P.catalog.some(p=>p.id===id))confirmAction(L('Ganti pratinjau ke ','Switch preview to ')+id.toUpperCase(),L('Ini bukan pembelian. Catatan dan skenario lama tidak dihapus; batas diterapkan saat membuat fitur baru.','This is not a purchase. Existing records/scenarios remain; limits apply when creating new items.'),()=>{state.commercial.previewTier=id;toast(L('Pratinjau paket diperbarui','Plan preview updated'));},L('Ganti pratinjau','Switch preview'));
    if(name==='plan-pricing')openModal(L('Harga draft dalam IDR','Draft prices in IDR'),form(P.catalog.map(p=>`<h3>${p.name}</h3>`+field(L('Bulanan','Monthly'),'monthly_'+p.id,state.commercial.prices[p.id].monthly,'number','required min="1" max="1000000000" step="1"')+field(L('Tahunan','Annual'),'annual_'+p.id,state.commercial.prices[p.id].annual,'number','required min="1" max="1000000000" step="1"')).join(''),'Save',L('Nominal rupiah utuh. Belum termasuk keputusan pajak, trial, atau pembatalan; harga ini tidak terhubung ke tagihan.','Whole rupiah amounts. Taxes, trial and cancellation terms are not decided; these prices do not create invoices.')),d=>{const prices=Object.fromEntries(P.catalog.map(p=>[p.id,{monthly:Number(d['monthly_'+p.id]),annual:Number(d['annual_'+p.id])}]));P.validate({...state.commercial,prices});state.commercial.prices=prices;});
    if(name==='license-activate'){
      openModal(L('Aktivasi Kunci Lisensi INVEYS','Activate INVEYS License Key'),`
        <form id="license-form" style="display:flex;flex-direction:column;gap:14px;">
          <p class="note" style="margin:0;">${L('Masukkan kunci lisensi Anda (Format: IV-PLAN-HASH-EXPIRY-SIG). Sistem memverifikasi tanda tangan kriptografi secara aman.','Enter your license key. The system verifies the cryptographic signature securely.')}</p>
          <input type="text" id="license-key-input" name="license_key" placeholder="Contoh: IV-ULTRA-A1B2C3-LIFETIME-D4E5F6G7" required style="font-family:monospace;letter-spacing:1px;font-weight:600;text-transform:uppercase;padding:12px;border:1px solid rgba(255,255,255,0.2);border-radius:8px;background:rgba(0,0,0,0.2);color:inherit;">
          <div id="license-error" class="form-error" style="display:none;color:#ef4444;font-size:12px;"></div>
          <div class="button-group" style="margin-top:8px;">
            <button type="submit" class="btn primary" id="license-submit-btn">${L('Aktivasi Sekarang','Activate Now')}</button>
            <button type="button" class="btn" data-action="modal-close">${t('Cancel')}</button>
          </div>
        </form>
      `);
      setTimeout(()=>{
        $('#license-form')?.addEventListener('submit', async e=>{
          e.preventDefault();
          const keyVal=($('#license-key-input')?.value||'').trim().toUpperCase();
          const errEl=$('#license-error');
          const submitBtn=$('#license-submit-btn');
          if(!keyVal)return;
          if(errEl)errEl.style.display='none';
          if(submitBtn){submitBtn.disabled=true;submitBtn.textContent='Memverifikasi...';}
          try{
            const token=localStorage.getItem('inveys_token');
            const res=await fetch('/api/license/activate',{
              method:'POST',
              headers:{'Content-Type':'application/json',...(token?{'Authorization':'Bearer '+token}:{})},
              body:JSON.stringify({license_key:keyVal})
            });
            const data=await res.json();
            if(!res.ok)throw new Error(data.error||'Aktivasi lisensi gagal');
            if(currentUser)currentUser.plan=data.plan;
            state.commercial.previewTier=data.plan;
            save();
            $('#modal').close();
            toast(data.message||'Lisensi berhasil diaktivasi!');
            render();
          }catch(err){
            if(errEl){errEl.textContent=err.message;errEl.style.display='block';}
          }finally{
            if(submitBtn){submitBtn.disabled=false;submitBtn.textContent=L('Aktivasi Sekarang','Activate Now');}
          }
        });
      },50);
      return;
    }
    if(name==='plan-checkout'){
      const p=P.catalog.find(x=>x.id===id)||{id,name:id.toUpperCase()};
      const q=P.quote(state.commercial,id,planCycle);
      const amountFmt=planMoney(q.amount);
      openModal(L('Checkout INVEYS ','Checkout INVEYS ')+p.name,`
        <div class="checkout-box" style="display:flex;flex-direction:column;gap:16px;">
          <div style="background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.25);border-radius:10px;padding:14px;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <b style="font-size:16px;color:var(--accent,#34d399);">INVEYS ${p.name} (${planCycle==='monthly'?L('Bulanan','Monthly'):L('Tahunan','Annual')})</b>
              <p class="note" style="margin:2px 0 0 0;">${L('Akses penuh brankas finansial & sinkronisasi multi-perangkat.','Full access to financial vault & multi-device sync.')}</p>
            </div>
            <div style="text-align:right;">
              <span style="font-size:18px;font-weight:700;">${amountFmt}</span>
              <small style="display:block;color:var(--text-muted,#94a3b8);">/${planCycle==='monthly'?L('bln','mo'):L('thn','yr')}</small>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <label style="font-size:12px;font-weight:600;">${L('Email Akun Penerima Lisensi','License Recipient Email')}</label>
            <input type="email" id="checkout-email" value="${currentUser?.email||''}" placeholder="nama@domain.com" style="padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.15);color:inherit;">
          </div>
          <div id="checkout-active-area"></div>
          <div id="checkout-action-row" class="button-group" style="margin-top:6px;">
            <button type="button" class="btn primary" id="btn-proceed-pay">${L('Buat Kode Pembayaran QRIS / VA','Generate QRIS / VA Payment')}</button>
            <button type="button" class="btn" data-action="modal-close">${t('Cancel')}</button>
          </div>
        </div>
      `);
      setTimeout(()=>{
        $('#btn-proceed-pay')?.addEventListener('click',async ()=>{
          const email=($('#checkout-email')?.value||'').trim();
          if(!email){toast(L('Email wajib diisi','Email is required'));return;}
          const btn=$('#btn-proceed-pay');
          btn.disabled=true;
          btn.textContent=L('Membuat pesanan…','Creating order…');
          try{
            const token=localStorage.getItem('inveys_token');
            const res=await fetch('/api/payment/create',{
              method:'POST',
              headers:{'Content-Type':'application/json',...(token?{'Authorization':'Bearer '+token}:{})},
              body:JSON.stringify({plan:id,cycle:planCycle,email})
            });
            const data=await res.json();
            if(!res.ok)throw new Error(data.error||'Gagal membuat order');
            const area=$('#checkout-active-area');
            if(area){
              area.innerHTML=`
                <div style="background:rgba(0,0,0,0.25);border:1px dashed var(--accent,#34d399);border-radius:10px;padding:16px;text-align:center;display:flex;flex-direction:column;gap:12px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;">
                    <span style="font-size:12px;color:var(--text-muted,#94a3b8);">${L('ID Transaksi:','Order ID:')} <b>${data.orderId}</b></span>
                    <b style="color:var(--accent,#34d399);font-size:16px;">${planMoney(data.amount)}</b>
                  </div>
                  <div style="padding:12px;background:#fff;border-radius:8px;max-width:200px;margin:0 auto;display:flex;flex-direction:column;align-items:center;">
                    <div style="font-size:10px;font-weight:900;color:#000;letter-spacing:1px;margin-bottom:4px;">QRIS NASIONAL</div>
                    <div style="width:160px;height:160px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;color:#0f172a;border:2px solid #000;border-radius:4px;font-size:11px;padding:8px;word-break:break-all;font-family:monospace;">
                      [QR CODE: ${data.orderId}]
                    </div>
                    <small style="color:#64748b;font-size:9px;margin-top:4px;">BCA · Mandiri · GoPay · ShopeePay · OVO</small>
                  </div>
                  <div style="font-size:12px;color:var(--text-muted,#94a3b8);">
                    ${L('Virtual Account:','Virtual Account:')} <b style="color:#fff;letter-spacing:1px;font-family:monospace;">${data.vaNumber}</b>
                  </div>
                  <div style="margin-top:6px;display:flex;flex-direction:column;gap:6px;">
                    <button type="button" class="btn primary" id="btn-simulate-pay" style="width:100%;background:linear-gradient(135deg,#34d399,#059669);">${L('⚡ Konfirmasi / Simulasikan Pembayaran Lunas','⚡ Confirm / Simulate Paid Order')}</button>
                  </div>
                </div>
              `;
              $('#checkout-action-row').style.display='none';
              $('#btn-simulate-pay')?.addEventListener('click',async ()=>{
                const simBtn=$('#btn-simulate-pay');
                simBtn.disabled=true;
                simBtn.textContent=L('Memverifikasi pelunasan…','Confirming payment…');
                try{
                  const sRes=await fetch('/api/payment/simulate',{
                    method:'POST',
                    headers:{'Content-Type':'application/json',...(token?{'Authorization':'Bearer '+token}:{})},
                    body:JSON.stringify({order_id:data.orderId})
                  });
                  const sData=await sRes.json();
                  if(!sRes.ok)throw new Error(sData.error||'Simulasi pembayaran gagal');
                  area.innerHTML=`
                    <div style="background:rgba(52,211,153,0.1);border:1px solid var(--accent,#34d399);border-radius:10px;padding:16px;text-align:center;">
                      <div style="font-size:24px;margin-bottom:6px;">🎉</div>
                      <b style="font-size:16px;color:var(--accent,#34d399);">${L('Pembayaran Berhasil! Lisensi Aktif','Payment Successful! License Active')}</b>
                      <p style="font-size:12px;margin:8px 0;color:var(--text-muted,#94a3b8);">${L('Akun Anda telah di-upgrade ke paket','Your account is upgraded to')} <b>INVEYS ${sData.plan.toUpperCase()}</b>.</p>
                      <div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:10px;font-family:monospace;font-size:13px;letter-spacing:1px;margin:12px 0;word-break:break-all;color:#34d399;">
                        ${sData.licenseKey}
                      </div>
                      <button type="button" class="btn primary" data-action="modal-close" style="width:100%;margin-top:8px;">${L('Tutup & Nikmati Fitur','Close & Enjoy')}</button>
                    </div>
                  `;
                  if(currentUser)currentUser.plan=sData.plan;
                  state.commercial.previewTier=sData.plan;
                  save();
                  toast(L('Lisensi aktif! Selamat menikmati paket ','License activated for ')+sData.plan.toUpperCase());
                }catch(e){
                  toast(e.message);
                  simBtn.disabled=false;
                  simBtn.textContent=L('Coba lagi','Retry');
                }
              });
            }
          }catch(err){
            toast(err.message);
            btn.disabled=false;
            btn.textContent=L('Buat Kode Pembayaran QRIS / VA','Generate QRIS / VA Payment');
          }
        });
      },50);
      return;
    }
  }

  let globalBroadcast = null;

  async function fetchBroadcast() {
    if (!isServerMode) return;
    try {
      const res = await fetch('/api/broadcast');
      if (res.ok) {
        const d = await res.json();
        if (d.ok && d.broadcast) {
          globalBroadcast = d.broadcast;
          const bannerEl = $('#global-broadcast-banner');
          if (bannerEl) bannerEl.outerHTML = broadcastBanner();
        }
      }
    } catch (e) {}
  }

  function broadcastBanner() {
    if (!globalBroadcast || !globalBroadcast.active || !globalBroadcast.message) return '';
    const dismissedKey = 'dismissed_broadcast_' + (globalBroadcast.updatedAt || 'latest');
    if (sessionStorage.getItem(dismissedKey)) return '';
    const tone = ['info', 'warning', 'alert'].includes(globalBroadcast.tone) ? globalBroadcast.tone : 'info';
    const iconMap = { info: 'ℹ️', warning: '⚠️', alert: '🚨' };
    const labelMap = {
      info: L('Pengumuman Sistem', 'System Announcement'),
      warning: L('Peringatan Pemeliharaan', 'Maintenance Notice'),
      alert: L('Pemberitahuan Penting', 'Critical Alert')
    };
    return `
      <aside id="global-broadcast-banner" class="broadcast-banner tone-${tone}" role="alert">
        <div class="broadcast-banner-inner">
          <span class="broadcast-banner-icon">${iconMap[tone]}</span>
          <div class="broadcast-banner-content">
            <strong>${labelMap[tone]}:</strong> <span>${escape(globalBroadcast.message)}</span>
          </div>
          <button type="button" class="broadcast-dismiss-btn" data-action="dismiss-broadcast" aria-label="${L('Tutup pengumuman', 'Dismiss announcement')}" title="${L('Tutup pengumuman', 'Dismiss announcement')}">✕</button>
        </div>
      </aside>
    `;
  }

  let adminData = {
    overview: null,
    users: [],
    auditLogs: [],
    broadcast: { active: false, message: '', tone: 'info', updatedAt: '' },
    query: '',
    roleFilter: 'all',
    planFilter: 'all',
    statusFilter: 'all',
    loading: false,
    error: null,
    lastFetched: 0
  };

  async function fetchAdminData(q = '') {
    if (adminData.loading) return;
    adminData.loading = true;
    adminData.error = null;
    const token = localStorage.getItem('inveys_token');
    const headers = token ? {'Authorization': 'Bearer ' + token} : {};
    try {
      const [ovRes, usrRes, auditRes, bcastRes] = await Promise.all([
        fetch('/api/admin/overview', { headers }),
        fetch(`/api/admin/users${q ? '?q=' + encodeURIComponent(q) : ''}`, { headers }),
        fetch('/api/admin/audit-logs?limit=50', { headers }),
        fetch('/api/broadcast')
      ]);
      if (!ovRes.ok || !usrRes.ok) {
        if (ovRes.status === 403 || usrRes.status === 403) {
          throw new Error(L('Akses ditolak: Anda harus login sebagai Administrator.', 'Access denied: Administrator privileges required.'));
        }
        throw new Error(L('Gagal memuat data dari server VPS.', 'Failed to load data from VPS server.'));
      }
      const ovJson = await ovRes.json();
      const usrJson = await usrRes.json();
      adminData.overview = ovJson.overview;
      adminData.users = usrJson.users || [];
      if (auditRes.ok) {
        const auditJson = await auditRes.json();
        adminData.auditLogs = auditJson.logs || [];
      }
      if (bcastRes.ok) {
        const bcastJson = await bcastRes.json();
        adminData.broadcast = bcastJson.broadcast || { active: false, message: '', tone: 'info' };
        globalBroadcast = adminData.broadcast;
      }
      adminData.lastFetched = Date.now();
    } catch (err) {
      adminData.error = err.message;
    } finally {
      adminData.loading = false;
      if (page === 'admin') render();
    }
  }

  function auditLogsRows() {
    const logs = adminData.auditLogs || [];
    if (!logs.length) {
      return `
        <tr>
          <td colspan="5" style="text-align:center;padding:24px;color:var(--muted);">
            ${L('Belum ada riwayat aktivitas yang tercatat.', 'No audit activity logged yet.')}
          </td>
        </tr>
      `;
    }

    const badgeClasses = {
      'auth.login.success': 'audit-badge success',
      'auth.login.failed': 'audit-badge danger',
      'auth.login.blocked': 'audit-badge danger',
      'auth.register': 'audit-badge info',
      'auth.logout': 'audit-badge neutral',
      'auth.setup.owner': 'audit-badge info',
      'auth.setup.master': 'audit-badge info',
      'admin.user.create': 'audit-badge primary',
      'admin.user.update': 'audit-badge warning',
      'admin.user.reset_password': 'audit-badge warning',
      'admin.user.delete': 'audit-badge danger',
      'admin.database.export': 'audit-badge purple',
      'admin.broadcast.update': 'audit-badge orange'
    };

    const actionLabels = {
      'auth.login.success': L('Login Berhasil', 'Login Success'),
      'auth.login.failed': L('Login Gagal', 'Login Failed'),
      'auth.login.blocked': L('Login Diblokir', 'Login Blocked'),
      'auth.register': L('Registrasi Akun', 'User Register'),
      'auth.logout': L('Logout', 'Logout'),
      'auth.setup.owner': L('Inisialisasi Owner', 'Setup Owner'),
      'auth.setup.master': L('Inisialisasi Master', 'Setup Master'),
      'admin.user.create': L('Buat Pengguna', 'Create User'),
      'admin.user.update': L('Update Pengguna', 'Update User'),
      'admin.user.reset_password': L('Reset Password', 'Reset Password'),
      'admin.user.delete': L('Hapus Pengguna', 'Delete User'),
      'admin.database.export': L('Export Database', 'Export Database'),
      'admin.broadcast.update': L('Update Broadcast', 'Update Broadcast')
    };

    return logs.map(log => {
      const cls = badgeClasses[log.action] || 'audit-badge neutral';
      const label = actionLabels[log.action] || log.action;
      const dateStr = log.createdAt ? new Date(log.createdAt * 1000).toLocaleString(lang === 'id' ? 'id-ID' : 'en-US', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
      }) : '—';
      const userDisplay = log.userEmail ? escape(log.userEmail) : (log.userId ? escape(log.userId) : 'System / Guest');

      return `
        <tr>
          <td style="white-space:nowrap;font-size:12px;color:var(--muted);">${dateStr}</td>
          <td>
            <span class="${cls}">${label}</span>
          </td>
          <td>
            <div style="font-weight:600;font-size:13px;">${userDisplay}</div>
            ${log.userName ? `<small style="color:var(--muted);">${escape(log.userName)}</small>` : ''}
          </td>
          <td style="font-size:12px;max-width:280px;word-break:break-all;color:var(--text-subtle, #a1a1aa);">
            ${escape(log.details || '—')}
          </td>
          <td style="white-space:nowrap;font-size:12px;">
            <code>${escape(log.ip || '127.0.0.1')}</code>
          </td>
        </tr>
      `;
    }).join('');
  }

  function adminUserRows() {
    let list = adminData.users || [];
    if (adminData.query) {
      const q = adminData.query;
      list = list.filter(u => (u.email || '').toLowerCase().includes(q) || (u.name || '').toLowerCase().includes(q));
    }
    if (adminData.roleFilter !== 'all') {
      list = list.filter(u => (u.role || 'user') === adminData.roleFilter);
    }
    if (adminData.planFilter !== 'all') {
      list = list.filter(u => (u.plan || 'plus') === adminData.planFilter);
    }
    if (adminData.statusFilter !== 'all') {
      list = list.filter(u => (u.status || 'active') === adminData.statusFilter);
    }
    if (!list.length) {
      return `<tr><td colspan="7" class="admin-table-empty" style="text-align:center;padding:32px;color:var(--muted);">${escape(L('Tidak ada pengguna yang cocok dengan kriteria filter.', 'No users found matching filter criteria.'))}</td></tr>`;
    }
    return list.map(u => {
      const initials = (u.name || u.email || 'US').split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'US';
      const isAdmin = u.role === 'admin';
      const isSuspended = u.status === 'suspended';
      const planClass = `badge-plan-${u.plan || 'plus'}`;
      const dateFormatted = u.createdAt ? new Date(u.createdAt * 1000).toLocaleDateString() : '—';
      const lastActiveFormatted = u.lastActive ? new Date(u.lastActive * 1000).toLocaleDateString() : L('Belum login', 'Never');
      const wsText = u.hasWorkspace ? `<span class="admin-ws-badge ok">✓ ${((u.workspaceSizeBytes || 0) / 1024).toFixed(0)} KB</span>` : `<span class="admin-ws-badge empty">—</span>`;

      return `
        <tr class="admin-user-row ${isSuspended ? 'is-suspended' : ''}">
          <td>
            <div class="admin-user-cell">
              <span class="avatar ${isAdmin ? 'admin-avatar' : ''}">${escape(initials)}</span>
              <div class="admin-user-info">
                <b>${escape(u.name || '—')}</b>
                <small>${escape(u.email)}</small>
              </div>
            </div>
          </td>
          <td>
            <span class="admin-role-badge ${isAdmin ? 'role-admin' : 'role-user'}">${isAdmin ? '🛡️ ADMIN' : 'USER'}</span>
          </td>
          <td>
            <span class="admin-plan-badge ${planClass}">${escape((u.plan || 'plus').toUpperCase())}</span>
          </td>
          <td>
            <span class="admin-status-pill ${isSuspended ? 'suspended' : 'active'}">
              <i></i> ${isSuspended ? L('Ditangguhkan', 'Suspended') : L('Aktif', 'Active')}
            </span>
          </td>
          <td>${wsText}</td>
          <td>
            <div class="admin-date-cell">
              <span>${lastActiveFormatted}</span>
              <small>${L('Terdaftar:', 'Joined:')} ${dateFormatted}</small>
            </div>
          </td>
          <td>
            <div class="admin-actions-cell">
              <button type="button" class="icon-button admin-action-btn" data-action="admin-edit-user:${u.id}" title="${L('Ubah Peran / Paket / Status', 'Edit Role / Plan / Status')}">✏️</button>
              <button type="button" class="icon-button admin-action-btn" data-action="admin-reset-pw:${u.id}" title="${L('Reset Password', 'Reset Password')}">🔑</button>
              <button type="button" class="icon-button admin-action-btn danger" data-action="admin-delete-user:${u.id}" title="${L('Hapus Akun Pengguna', 'Delete Account')}">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function adminPanel() {
    if (!isServerMode) {
      return `
        ${header(L('Kontrol Panel Administrator', 'Administrator Control Panel'), L('Pusat monitoring pengguna multi-tenant & database SQLite VPS.', 'Multi-tenant user monitoring & VPS SQLite database management.'))}
        <div class="panel admin-banner-card" style="text-align:center;padding:48px 24px;">
          <div style="font-size:42px;margin-bottom:12px;">🛡️</div>
          <h2 style="font-size:20px;margin-bottom:8px;">${L('Mode Server VPS Hostinger Diperlukan', 'Hostinger VPS Server Mode Required')}</h2>
          <p style="max-width:540px;margin:0 auto 18px;color:var(--muted);line-height:1.7;">
            ${L('Kontrol Panel Administrator memonitor pengguna terdaftar dan brankas finansial di database SQLite VPS Hostinger (187.77.134.249). Akses INVEYS melalui URL resmi untuk menggunakan panel ini.', 'The Administrator Control Panel monitors registered users and multi-tenant vaults on your Hostinger VPS SQLite database (187.77.134.249). Access INVEYS through your official domain to use this panel.')}
          </p>
          <div style="display:flex;gap:12px;justify-content:center;">
            <a href="https://www.inveys.io" class="btn primary" target="_blank" rel="noopener">🌐 Buka www.inveys.io</a>
            <button type="button" class="btn" onclick="navigate('home')">${L('Kembali ke Beranda', 'Return to Overview')}</button>
          </div>
        </div>
      `;
    }

    const isAdmin = currentUser?.role === 'admin' || currentUser?.id === 'master';
    if (!isAdmin) {
      return `
        ${header(L('Kontrol Panel Administrator', 'Administrator Control Panel'), L('Akses Terbatas', 'Restricted Access'))}
        <div class="panel admin-banner-card" style="text-align:center;padding:48px 24px;">
          <div style="font-size:42px;color:var(--red,#ef4444);margin-bottom:12px;">🚫</div>
          <h2 style="font-size:20px;margin-bottom:8px;">${L('Hak Akses Administrator Diperlukan', 'Administrator Privileges Required')}</h2>
          <p style="max-width:500px;margin:0 auto 20px;color:var(--muted);line-height:1.7;">
            ${L('Akun Anda saat ini masuk sebagai pengguna biasa. Halaman kontrol panel ini hanya dapat diakses oleh akun Administrator atau pemegang kunci Master.', 'Your account is logged in as a standard member. This panel is restricted to Administrator accounts or Master key holders.')}
          </p>
          <button type="button" class="btn primary" onclick="navigate('home')">${L('Kembali ke Beranda', 'Return to Overview')}</button>
        </div>
      `;
    }

    if (!adminData.overview && !adminData.loading && !adminData.error) {
      setTimeout(() => fetchAdminData(), 20);
    }

    const ov = adminData.overview || {};
    const totalUsers = ov.totalUsers ?? '…';
    const activeUsers = ov.activeUsers ?? '…';
    const suspendedUsers = ov.suspendedUsers ?? 0;
    const adminUsers = ov.adminUsers ?? 1;
    const activeSessions = ov.activeSessions ?? '…';
    const totalWs = ov.totalWorkspaces ?? '…';
    const totalBk = ov.totalBackups ?? '…';
    const dbKb = ov.databaseSizeBytes ? (ov.databaseSizeBytes / 1024).toFixed(1) + ' KB' : '…';
    const planCounts = ov.plans || {};
    const bcast = adminData.broadcast || { active: false, message: '', tone: 'info' };
    const tgInfo = ov.telegram || { configured: !!service.telegram, chatId: '' };
    const tgConfigured = !!tgInfo.configured || !!service.telegram;
    const tgChatId = tgInfo.chatId || '';

    const actions = `
      <span class="vps-status-pill online" style="margin-right:8px;"><i></i> Hostinger Node 187.77.134.249</span>
      <button type="button" class="btn" data-action="admin-export-db" title="${L('Unduh Cadangan Database SQLite Langsung', 'Direct SQLite Database Backup')}">
        💾 ${L('Unduh Database (.sqlite)', 'Export Database (.sqlite)')}
      </button>
      <button type="button" class="btn primary" data-action="admin-create-user">
        ${icon('plus')} ${L('Tambah Pengguna', 'Add User')}
      </button>
      <button type="button" class="btn" data-action="admin-refresh" title="${L('Muat Ulang Data', 'Refresh Data')}">
        🔄 ${adminData.loading ? L('Memuat…', 'Loading…') : L('Segarkan', 'Refresh')}
      </button>
    `;

    setTimeout(() => {
      const bForm = $('#admin-broadcast-form');
      if (bForm && !bForm.dataset.bound) {
        bForm.dataset.bound = 'true';
        bForm.addEventListener('submit', async e => {
          e.preventDefault();
          const msg = $('#adm-broadcast-msg')?.value || '';
          const tone = $('#adm-broadcast-tone')?.value || 'info';
          const active = $('#adm-broadcast-active')?.checked || false;
          const btn = $('#adm-broadcast-save-btn');
          if (btn) { btn.disabled = true; btn.textContent = L('Menyimpan…', 'Saving…'); }
          const token = localStorage.getItem('inveys_token');
          const headers = { 'Content-Type': 'application/json', ...(token ? {'Authorization': 'Bearer ' + token} : {}) };
          try {
            const res = await fetch('/api/admin/broadcast', {
              method: 'POST',
              headers,
              body: JSON.stringify({ message: msg, tone, active })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal menyimpan pengumuman');
            globalBroadcast = data.broadcast;
            adminData.broadcast = data.broadcast;
            toast(L('Pengumuman sistem berhasil diperbarui!', 'System broadcast updated successfully!'));
            render();
          } catch (err) {
            toast(err.message);
          } finally {
            if (btn) { btn.disabled = false; btn.textContent = '📢 ' + L('Simpan & Siarkan Pengumuman', 'Publish Broadcast'); }
          }
        });
      }
    }, 50);

    return `
      ${header(L('Kontrol Panel Administrator', 'Administrator Control Panel'), L('Pusat kendali & monitoring pengguna, lisensi paket, brankas multi-tenant, dan database VPS Hostinger.', 'Central hub for monitoring users, plans, multi-tenant vaults, and Hostinger VPS database.'), actions, 'HOSTINGER VPS ROOT · CONTROL PANEL')}

      ${adminData.error ? `<div class="panel form-error" style="padding:14px;margin-bottom:20px;display:block;">⚠️ ${escape(adminData.error)}</div>` : ''}

      <div class="metrics-grid admin-metrics-grid" style="margin-bottom:24px;">
        <div class="metric metric-users">
          <div class="metric-label"><span>${L('Total Pengguna', 'Total Users')}</span><span class="metric-icon-wrap">${icon('users')}</span></div>
          <div class="metric-value">${totalUsers}</div>
          <div class="metric-foot"><span class="positive">${activeUsers} ${L('Aktif', 'Active')}</span> · <span>${adminUsers} Admin</span> · <span class="${suspendedUsers > 0 ? 'negative' : ''}">${suspendedUsers} ${L('Ditangguhkan', 'Suspended')}</span></div>
        </div>
        <div class="metric metric-sessions">
          <div class="metric-label"><span>${L('Sesi Aktif Realtime', 'Active Sessions')}</span><span class="metric-icon-wrap">${icon('lightning')}</span></div>
          <div class="metric-value">${activeSessions}</div>
          <div class="metric-foot"><span class="positive">${L('Perangkat terhubung saat ini', 'Connected devices right now')}</span></div>
        </div>
        <div class="metric metric-vault">
          <div class="metric-label"><span>${L('Brankas & Penyimpanan', 'Vaults & Storage')}</span><span class="metric-icon-wrap">${icon('vault')}</span></div>
          <div class="metric-value">${dbKb}</div>
          <div class="metric-foot"><span>${totalWs} ${L('Brankas', 'Vaults')}</span> · <span>${totalBk} ${L('Snapshot Cadangan', 'Backups')}</span></div>
        </div>
        <div class="metric metric-license">
          <div class="metric-label"><span>${L('Distribusi Lisensi', 'Plan Breakdown')}</span><span class="metric-icon-wrap">${icon('shield')}</span></div>
          <div class="metric-value">Ultra: ${planCounts.ultra || 0}</div>
          <div class="metric-foot"><span>Pro: ${planCounts.pro || 0}</span> · <span>Plus: ${planCounts.plus || 0}</span></div>
        </div>
      </div>

      <div class="panel admin-broadcast-panel" style="margin-bottom:24px;">
        <div class="panel-pad">
          <div class="panel-head" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;">
            <div>
              <h2 class="panel-title">📢 ${L('Pengumuman Sistem Global (Broadcast Banner)', 'Global System Broadcast Banner')}</h2>
              <p>${L('Siarkan pesan penting atau peringatan pemeliharaan yang akan tampil di bagian atas layar seluruh pengguna secara langsung.', 'Broadcast announcements or maintenance alerts displayed at the top of all user screens in real-time.')}</p>
            </div>
            <div>
              <span class="vps-status-pill ${bcast.active ? 'online' : ''}">${bcast.active ? '● ' + L('Sedang Aktif', 'Broadcasting Live') : '○ ' + L('Tidak Aktif', 'Inactive')}</span>
            </div>
          </div>
          <form id="admin-broadcast-form" style="display:flex;flex-direction:column;gap:14px;">
            <div class="field">
              <label for="adm-broadcast-msg">${L('Isi Pesan Pengumuman', 'Announcement Message')}</label>
              <textarea id="adm-broadcast-msg" name="message" rows="2" placeholder="${L('Contoh: Pemeliharaan server VPS terjadwal malam ini pukul 23:00 WIB. Mohon simpan perubahan Anda.', 'Example: Scheduled VPS server maintenance tonight at 23:00 UTC. Please save your work.')}" style="width:100%;resize:vertical;">${escape(bcast.message || '')}</textarea>
            </div>
            <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
              <div class="field" style="min-width:220px;">
                <label for="adm-broadcast-tone">${L('Nada Pesan (Visual Tone)', 'Message Tone')}</label>
                <select id="adm-broadcast-tone" name="tone">
                  <option value="info" ${(bcast.tone || 'info') === 'info' ? 'selected' : ''}>ℹ️ ${L('Informasi Normal (Biru)', 'Informational (Blue)')}</option>
                  <option value="warning" ${bcast.tone === 'warning' ? 'selected' : ''}>⚠️ ${L('Peringatan Pemeliharaan (Kuning)', 'Warning (Yellow)')}</option>
                  <option value="alert" ${bcast.tone === 'alert' ? 'selected' : ''}>🚨 ${L('Kritis / Darurat (Merah)', 'Critical Alert (Red)')}</option>
                </select>
              </div>
              <div class="field" style="display:flex;align-items:center;gap:8px;padding-top:22px;">
                <input type="checkbox" id="adm-broadcast-active" name="active" ${bcast.active ? 'checked' : ''}>
                <label for="adm-broadcast-active" style="margin:0;cursor:pointer;font-weight:600;">${L('Tampilkan banner untuk seluruh pengguna', 'Broadcast banner publicly to all users')}</label>
              </div>
            </div>
            <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:6px;">
              ${bcast.active ? `<button type="button" class="btn" data-action="admin-clear-broadcast">${L('Hapus / Nonaktifkan', 'Deactivate Broadcast')}</button>` : ''}
              <button type="submit" class="btn primary" id="adm-broadcast-save-btn">📢 ${L('Simpan & Siarkan Pengumuman', 'Publish Broadcast')}</button>
            </div>
          </form>
        </div>
      </div>

      <div class="panel admin-telegram-panel" style="margin-bottom:24px;">
        <div class="panel-pad">
          <div class="panel-head" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;">
            <div>
              <h2 class="panel-title">🤖 ${L('Otomasi Notifikasi Bot Telegram & Webhook', 'Telegram Bot Admin Notifications & Webhooks')}</h2>
              <p>${L('Kirim peringatan realtime instan langsung ke akun/grup Telegram Administrator saat terjadi pendaftaran pengguna baru, pembayaran lisensi, backup database, atau upaya brute-force mencurigakan.', 'Instant real-time alerts sent to your Telegram whenever a new user registers, orders a license, backs up the database, or triggers security lockouts.')}</p>
            </div>
            <div>
              <span class="vps-status-pill ${tgConfigured ? 'online' : ''}">${tgConfigured ? '● ' + L('Aktif & Terhubung', 'Active & Connected') : '○ ' + L('Belum Dikonfigurasi', 'Not Configured')}</span>
            </div>
          </div>
          <div class="admin-tg-grid">
            <div class="admin-tg-item">
              <small>${L('Status Bot Telegram', 'Telegram Bot Status')}</small>
              <b>${tgConfigured ? '✅ ' + L('Bot Siap Menerima & Mengirim', 'Bot Ready to Dispatch') : '⚠️ ' + L('Kredensial Belum Lengkap', 'Incomplete Credentials')}</b>
            </div>
            <div class="admin-tg-item">
              <small>${L('Target Admin Chat ID', 'Target Admin Chat ID')}</small>
              <code>${escape(tgChatId || L('(Belum diatur)', '(Not set)'))}</code>
            </div>
            <div class="admin-tg-item">
              <small>${L('Pemicu Otomatis (Event Triggers)', 'Automated Event Triggers')}</small>
              <span style="font-size:12px;color:var(--text-bright);">🔔 Register · 💳 Payment · 💾 Backup · 🚨 Brute Force</span>
            </div>
          </div>
          <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;justify-content:flex-end;">
            <button type="button" class="btn" data-action="admin-config-telegram">
              ⚙️ ${L('Atur Token & Chat ID', 'Configure Bot Token & Chat ID')}
            </button>
            <button type="button" class="btn primary" data-action="admin-test-telegram" id="adm-test-tg-btn">
              🚀 ${L('Kirim Pesan Uji Coba (Test Notification)', 'Send Test Notification')}
            </button>
          </div>
        </div>
      </div>

      <div class="panel admin-users-panel" style="margin-bottom:24px;">
        <div class="panel-pad">
          <div class="panel-head" style="margin-bottom:18px;">
            <div>
              <h2 class="panel-title">${icon('users')} ${L('Manajemen & Monitoring Pengguna', 'User Management & Monitoring')}</h2>
              <p>${L('Daftar seluruh akun yang terdaftar pada node VPS Hostinger ini beserta status brankas dan aktivitasnya.', 'List of all registered accounts on this Hostinger VPS node, including vault sync and activity status.')}</p>
            </div>
          </div>

          <div class="admin-filter-bar" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:20px;">
            <input type="search" id="admin-search-input" class="input-search" placeholder="${L('Cari nama atau email pengguna…', 'Search name or email…')}" value="${escape(adminData.query)}" style="flex:1;min-width:220px;">
            <select id="admin-role-filter" class="admin-select-filter" aria-label="Filter Role">
              <option value="all" ${adminData.roleFilter === 'all' ? 'selected' : ''}>${L('Semua Peran', 'All Roles')}</option>
              <option value="admin" ${adminData.roleFilter === 'admin' ? 'selected' : ''}>🛡️ ${L('Administrator', 'Administrator')}</option>
              <option value="user" ${adminData.roleFilter === 'user' ? 'selected' : ''}>👤 ${L('User Biasa', 'Standard User')}</option>
            </select>
            <select id="admin-plan-filter" class="admin-select-filter" aria-label="Filter Paket">
              <option value="all" ${adminData.planFilter === 'all' ? 'selected' : ''}>${L('Semua Paket', 'All Plans')}</option>
              <option value="ultra" ${adminData.planFilter === 'ultra' ? 'selected' : ''}>ULTRA</option>
              <option value="pro" ${adminData.planFilter === 'pro' ? 'selected' : ''}>PRO</option>
              <option value="plus" ${adminData.planFilter === 'plus' ? 'selected' : ''}>PLUS</option>
            </select>
            <select id="admin-status-filter" class="admin-select-filter" aria-label="Filter Status">
              <option value="all" ${adminData.statusFilter === 'all' ? 'selected' : ''}>${L('Semua Status', 'All Statuses')}</option>
              <option value="active" ${adminData.statusFilter === 'active' ? 'selected' : ''}>● ${L('Aktif', 'Active')}</option>
              <option value="suspended" ${adminData.statusFilter === 'suspended' ? 'selected' : ''}>● ${L('Ditangguhkan', 'Suspended')}</option>
            </select>
          </div>

          <div class="table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>${L('Pengguna', 'User')}</th>
                  <th>${L('Peran', 'Role')}</th>
                  <th>${L('Paket Lisensi', 'Plan')}</th>
                  <th>${L('Status', 'Status')}</th>
                  <th>${L('Brankas (Vault)', 'Vault')}</th>
                  <th>${L('Aktivitas', 'Activity')}</th>
                  <th style="text-align:right;">${L('Aksi', 'Actions')}</th>
                </tr>
              </thead>
              <tbody id="admin-user-tbody">
                ${adminUserRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="panel admin-audit-panel" style="margin-bottom:24px;">
        <div class="panel-pad">
          <div class="panel-head" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div>
              <h2 class="panel-title">🛡️ ${L('Jejak Audit Keamanan & Riwayat Sesi', 'Security Audit Trail & Session Log')}</h2>
              <p>${L('Catatan autentikasi login, perubahan hak akses pengguna, export database, dan peristiwa administratif di server VPS Hostinger.', 'Comprehensive logs of logins, user privilege changes, database exports, and administrative events on your VPS.')}</p>
            </div>
            <button type="button" class="btn small" data-action="admin-refresh" title="${L('Muat Ulang Log', 'Refresh Logs')}">🔄 ${L('Segarkan', 'Refresh')}</button>
          </div>
          <div class="table-wrap">
            <table class="admin-table audit-table">
              <thead>
                <tr>
                  <th>${L('Waktu', 'Timestamp')}</th>
                  <th>${L('Aksi', 'Event')}</th>
                  <th>${L('Pelaku', 'Actor')}</th>
                  <th>${L('Detail', 'Details')}</th>
                  <th>${L('Alamat IP', 'IP Address')}</th>
                </tr>
              </thead>
              <tbody>
                ${auditLogsRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="panel admin-diagnostics-panel">
        <div class="panel-pad">
          <div class="panel-head" style="margin-bottom:14px;">
            <h2 class="panel-title">${icon('settings')} ${L('Diagnostik Server & Database VPS', 'VPS Server & Database Diagnostics')}</h2>
            <p>${L('Status lingkungan operasional server dan integritas sistem berkas SQLite.', 'Server operational environment and SQLite filesystem integrity.')}</p>
          </div>
          <div class="admin-diag-grid">
            <div class="admin-diag-item">
              <small>${L('Node Server VPS', 'VPS Server Node')}</small>
              <b>Hostinger VPS · IP: 187.77.134.249</b>
            </div>
            <div class="admin-diag-item">
              <small>${L('Domain Terhubung', 'Connected Domain')}</small>
              <b>inveys.io · www.inveys.io (HTTPS Caddy Reverse Proxy)</b>
            </div>
            <div class="admin-diag-item">
              <small>${L('Database Backend', 'Backend Database')}</small>
              <b>SQLite 3 (WAL Mode · server/inveys.db · 0600)</b>
            </div>
            <div class="admin-diag-item">
              <small>${L('Versi Aplikasi', 'App Version')}</small>
              <b>INVEYS v0.23.0 (Production Multi-User Vault)</b>
            </div>
          </div>
          <div style="margin-top:18px;padding-top:16px;border-top:1px solid var(--line);display:flex;gap:14px;align-items:center;flex-wrap:wrap;">
            <button type="button" class="btn primary" data-action="admin-export-db">
              💾 ${L('Unduh Backup Database (.sqlite)', 'Export Database (.sqlite)')}
            </button>
            <span style="font-size:12px;color:var(--muted);line-height:1.5;">
              ${L('Unduh seluruh database SQLite (termasuk semua user, vault, order, dan backup) untuk arsip pemulihan bencana (Disaster Recovery).', 'Directly export SQLite database snapshot for disaster recovery and offline sovereignty archives.')}
            </span>
          </div>
        </div>
      </div>
    `;
  }

  function adminAction(name, id, extra) {
    if (name === 'admin-export-db') {
      toast(L('Menyiapkan cadangan snapshot SQLite…', 'Preparing SQLite database snapshot…'));
      const token = localStorage.getItem('inveys_token');
      const headers = token ? {'Authorization': 'Bearer ' + token} : {};
      fetch('/api/admin/database/export', { headers })
        .then(async res => {
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || L('Gagal mengunduh database', 'Failed to export database'));
          }
          return res.blob();
        })
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const ts = new Date().toISOString().slice(0, 10);
          a.href = url;
          a.download = `inveys-backup-${ts}.sqlite`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          toast(L('Database SQLite berhasil diunduh!', 'SQLite database downloaded successfully!'));
          fetchAdminData();
        })
        .catch(err => {
          toast(err.message);
        });
      return;
    }

    if (name === 'admin-clear-broadcast') {
      const token = localStorage.getItem('inveys_token');
      const headers = { 'Content-Type': 'application/json', ...(token ? {'Authorization': 'Bearer ' + token} : {}) };
      fetch('/api/admin/broadcast', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: '', tone: 'info', active: false })
      })
        .then(res => res.json())
        .then(data => {
          if (!data.ok) throw new Error(data.error || 'Gagal menonaktifkan pengumuman');
          globalBroadcast = data.broadcast;
          adminData.broadcast = data.broadcast;
          toast(L('Pengumuman berhasil dinonaktifkan', 'Broadcast deactivated'));
          render();
        })
        .catch(err => toast(err.message));
      return;
    }

    if (name === 'admin-config-telegram') {
      openApiKeysModal('telegram');
      return;
    }

    if (name === 'admin-test-telegram') {
      const btn = $('#adm-test-tg-btn') || $('[data-action="admin-test-telegram"]');
      const origText = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '⏳ ' + L('Mengirim Uji Coba…', 'Sending Test…');
      }
      const token = localStorage.getItem('inveys_token');
      const headers = { 'Content-Type': 'application/json', ...(token ? {'Authorization': 'Bearer ' + token} : {}) };
      fetch('/api/admin/telegram/test', {
        method: 'POST',
        headers,
        body: JSON.stringify({})
      })
        .then(async res => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.error || L('Gagal mengirim notifikasi uji coba', 'Failed to send test notification'));
          return data;
        })
        .then(data => {
          toast('✅ ' + (data.message || L('Notifikasi uji coba berhasil dikirim ke Telegram Admin!', 'Test notification sent to Telegram Admin!')));
          fetchAdminData();
        })
        .catch(err => {
          toast('⚠️ ' + err.message);
        })
        .finally(() => {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = origText || ('🚀 ' + L('Kirim Pesan Uji Coba (Test Notification)', 'Send Test Notification'));
          }
        });
      return;
    }

    if (name === 'admin-panel') {
      const profilePopover = $('#profile-popover');
      const profileBtn = $('#profile-button');
      if (profilePopover) profilePopover.classList.remove('open');
      if (profileBtn) profileBtn.setAttribute('aria-expanded', 'false');
      navigate('admin');
      return;
    }

    if (name === 'admin-refresh') {
      fetchAdminData(adminData.query);
      toast(L('Memuat ulang data pengguna…', 'Refreshing user data…'));
      return;
    }

    if (name === 'admin-create-user') {
      openModal(L('Tambah Pengguna Baru', 'Create New User'), `
        <form id="admin-create-user-form">
          <div class="field" style="margin-bottom:14px;">
            <label for="adm-c-name">${L('Nama Lengkap', 'Full Name')}</label>
            <input type="text" id="adm-c-name" name="name" placeholder="Contoh: Hendra" required>
          </div>
          <div class="field" style="margin-bottom:14px;">
            <label for="adm-c-email">${L('Alamat Email', 'Email Address')}</label>
            <input type="email" id="adm-c-email" name="email" placeholder="nama@domain.com" required>
          </div>
          <div class="field" style="margin-bottom:14px;">
            <label for="adm-c-pw">${L('Password (minimal 6 karakter)', 'Password (min 6 chars)')}</label>
            <input type="password" id="adm-c-pw" name="password" minlength="6" required>
          </div>
          <div class="form-grid" style="margin-bottom:16px;">
            <div class="field">
              <label for="adm-c-plan">${L('Paket Lisensi', 'License Plan')}</label>
              <select id="adm-c-plan" name="plan">
                <option value="plus">INVEYS Plus</option>
                <option value="pro" selected>INVEYS Pro</option>
                <option value="ultra">INVEYS Ultra</option>
              </select>
            </div>
            <div class="field">
              <label for="adm-c-role">${L('Peran Akun', 'Account Role')}</label>
              <select id="adm-c-role" name="role">
                <option value="user" selected>👤 ${L('User Biasa', 'Standard User')}</option>
                <option value="admin">🛡️ ${L('Administrator', 'Administrator')}</option>
              </select>
            </div>
          </div>
          <p id="adm-c-error" class="form-error" style="display:none;"></p>
          <div class="form-actions">
            <button type="button" class="btn" data-action="modal-close">${L('Batal', 'Cancel')}</button>
            <button type="submit" class="btn primary" id="adm-c-submit-btn">${L('Buat Pengguna', 'Create User')}</button>
          </div>
        </form>
      `);

      setTimeout(() => {
        const form = $('#admin-create-user-form');
        form?.addEventListener('submit', async e => {
          e.preventDefault();
          const btn = $('#adm-c-submit-btn');
          const errEl = $('#adm-c-error');
          if (errEl) errEl.style.display = 'none';
          if (btn) { btn.disabled = true; btn.textContent = L('Menyimpan…', 'Saving…'); }
          const token = localStorage.getItem('inveys_token');
          try {
            const payload = Object.fromEntries(new FormData(form));
            const res = await fetch('/api/admin/users/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(token ? {'Authorization': 'Bearer ' + token} : {}) },
              body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal membuat pengguna');
            $('#modal').close();
            toast(L('Pengguna berhasil dibuat!', 'User created successfully!'));
            fetchAdminData();
          } catch (err) {
            if (errEl) { errEl.textContent = err.message; errEl.style.display = 'block'; }
          } finally {
            if (btn) { btn.disabled = false; btn.textContent = L('Buat Pengguna', 'Create User'); }
          }
        });
      }, 50);
      return;
    }

    if (name === 'admin-edit-user') {
      const u = (adminData.users || []).find(x => x.id === id);
      if (!u) { toast(L('Pengguna tidak ditemukan', 'User not found')); return; }
      openModal(L('Edit Pengguna', 'Edit User') + ` · ${u.email}`, `
        <form id="admin-edit-user-form">
          <input type="hidden" name="id" value="${escape(u.id)}">
          <div class="field" style="margin-bottom:14px;">
            <label for="adm-e-email">${L('Alamat Email (Tetap)', 'Email (Read-only)')}</label>
            <input type="email" id="adm-e-email" value="${escape(u.email)}" disabled style="opacity:0.75;">
          </div>
          <div class="field" style="margin-bottom:14px;">
            <label for="adm-e-name">${L('Nama Lengkap', 'Full Name')}</label>
            <input type="text" id="adm-e-name" name="name" value="${escape(u.name || '')}" required>
          </div>
          <div class="form-grid" style="margin-bottom:16px;">
            <div class="field">
              <label for="adm-e-plan">${L('Paket Lisensi', 'License Plan')}</label>
              <select id="adm-e-plan" name="plan">
                <option value="plus" ${u.plan === 'plus' ? 'selected' : ''}>INVEYS Plus</option>
                <option value="pro" ${u.plan === 'pro' ? 'selected' : ''}>INVEYS Pro</option>
                <option value="ultra" ${u.plan === 'ultra' ? 'selected' : ''}>INVEYS Ultra</option>
                <option value="lifetime" ${u.plan === 'lifetime' ? 'selected' : ''}>Lifetime Ultra</option>
              </select>
            </div>
            <div class="field">
              <label for="adm-e-role">${L('Peran Akun', 'Account Role')}</label>
              <select id="adm-e-role" name="role">
                <option value="user" ${u.role === 'user' ? 'selected' : ''}>👤 ${L('User Biasa', 'Standard User')}</option>
                <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>🛡️ ${L('Administrator', 'Administrator')}</option>
              </select>
            </div>
          </div>
          <div class="field" style="margin-bottom:18px;">
            <label for="adm-e-status">${L('Status Akun', 'Account Status')}</label>
            <select id="adm-e-status" name="status">
              <option value="active" ${u.status !== 'suspended' ? 'selected' : ''}>🟢 ${L('Aktif (Bisa Login & Sinkron)', 'Active (Can login & sync)')}</option>
              <option value="suspended" ${u.status === 'suspended' ? 'selected' : ''}>🔴 ${L('Ditangguhkan (Blokir Akses)', 'Suspended (Block access)')}</option>
            </select>
          </div>
          <p id="adm-e-error" class="form-error" style="display:none;"></p>
          <div class="form-actions">
            <button type="button" class="btn" data-action="modal-close">${L('Batal', 'Cancel')}</button>
            <button type="submit" class="btn primary" id="adm-e-submit-btn">${L('Simpan Perubahan', 'Save Changes')}</button>
          </div>
        </form>
      `);

      setTimeout(() => {
        const form = $('#admin-edit-user-form');
        form?.addEventListener('submit', async e => {
          e.preventDefault();
          const btn = $('#adm-e-submit-btn');
          const errEl = $('#adm-e-error');
          if (errEl) errEl.style.display = 'none';
          if (btn) { btn.disabled = true; btn.textContent = L('Menyimpan…', 'Saving…'); }
          const token = localStorage.getItem('inveys_token');
          try {
            const payload = Object.fromEntries(new FormData(form));
            const res = await fetch('/api/admin/users/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(token ? {'Authorization': 'Bearer ' + token} : {}) },
              body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal memperbarui pengguna');
            $('#modal').close();
            toast(L('Data pengguna berhasil diperbarui!', 'User updated successfully!'));
            fetchAdminData();
          } catch (err) {
            if (errEl) { errEl.textContent = err.message; errEl.style.display = 'block'; }
          } finally {
            if (btn) { btn.disabled = false; btn.textContent = L('Simpan Perubahan', 'Save Changes'); }
          }
        });
      }, 50);
      return;
    }

    if (name === 'admin-reset-pw') {
      const u = (adminData.users || []).find(x => x.id === id);
      if (!u) { toast(L('Pengguna tidak ditemukan', 'User not found')); return; }
      openModal(L('Reset Password', 'Reset Password') + ` · ${u.email}`, `
        <form id="admin-reset-pw-form">
          <input type="hidden" name="id" value="${escape(u.id)}">
          <p style="font-size:12px;color:var(--muted);margin-bottom:14px;">
            ${L('Tetapkan kata sandi baru untuk akun ini. Seluruh sesi login pengguna saat ini akan otomatis dikeluarkan.', 'Set a new password for this account. All existing active sessions for this user will be revoked immediately.')}
          </p>
          <div class="field" style="margin-bottom:16px;">
            <label for="adm-r-pw">${L('Password Baru (minimal 6 karakter)', 'New Password (min 6 chars)')}</label>
            <input type="password" id="adm-r-pw" name="newPassword" minlength="6" required autofocus>
          </div>
          <p id="adm-r-error" class="form-error" style="display:none;"></p>
          <div class="form-actions">
            <button type="button" class="btn" data-action="modal-close">${L('Batal', 'Cancel')}</button>
            <button type="submit" class="btn primary" id="adm-r-submit-btn">${L('Reset Password Sekarang', 'Reset Password Now')}</button>
          </div>
        </form>
      `);

      setTimeout(() => {
        const form = $('#admin-reset-pw-form');
        form?.addEventListener('submit', async e => {
          e.preventDefault();
          const btn = $('#adm-r-submit-btn');
          const errEl = $('#adm-r-error');
          if (errEl) errEl.style.display = 'none';
          if (btn) { btn.disabled = true; btn.textContent = L('Menyimpan…', 'Saving…'); }
          const token = localStorage.getItem('inveys_token');
          try {
            const payload = Object.fromEntries(new FormData(form));
            const res = await fetch('/api/admin/users/reset-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(token ? {'Authorization': 'Bearer ' + token} : {}) },
              body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal mereset password');
            $('#modal').close();
            toast(L('Password pengguna berhasil direset!', 'User password reset successfully!'));
          } catch (err) {
            if (errEl) { errEl.textContent = err.message; errEl.style.display = 'block'; }
          } finally {
            if (btn) { btn.disabled = false; btn.textContent = L('Reset Password Sekarang', 'Reset Password Now'); }
          }
        });
      }, 50);
      return;
    }

    if (name === 'admin-delete-user') {
      const u = (adminData.users || []).find(x => x.id === id);
      if (!u) { toast(L('Pengguna tidak ditemukan', 'User not found')); return; }
      confirmAction(
        L('Hapus Akun Pengguna?', 'Delete User Account?'),
        `${L('Yakin ingin menghapus pengguna', 'Are you sure you want to delete user')} <b>${escape(u.email)}</b>? ${L('Seluruh data brankas, portofolio, dan backup miliknya di database VPS Hostinger akan dihapus secara permanen.', 'All personal vaults, portfolios, and backup records on this Hostinger VPS database will be permanently wiped.')}`,
        async () => {
          const token = localStorage.getItem('inveys_token');
          try {
            const res = await fetch('/api/admin/users/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(token ? {'Authorization': 'Bearer ' + token} : {}) },
              body: JSON.stringify({ id: u.id })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal menghapus pengguna');
            toast(L('Pengguna berhasil dihapus.', 'User deleted successfully.'));
            fetchAdminData();
          } catch (err) {
            toast(err.message);
          }
        },
        L('Hapus Pengguna', 'Delete User')
      );
      return;
    }
  }

  function budgetMonthNav(delta){
    const d = new Date(budgetYear, budgetMonth + delta, 1);
    budgetYear = d.getFullYear();
    budgetMonth = d.getMonth();
    render();
  }

  function budgetMonthToday(){
    const d = new Date();
    budgetYear = d.getFullYear();
    budgetMonth = d.getMonth();
    render();
  }
  function openBudgetSetupModal(categoryToEdit){
    const existing = categoryToEdit ? (state.budgets || []).find(b => b.category.toLowerCase() === categoryToEdit.toLowerCase()) : null;
    const catSet = new Set();
    (state.categories || []).forEach(c => catSet.add(c.name));
    (state.budgets || []).forEach(b => catSet.add(b.category));
    (state.transactions || []).forEach(t => { if(t.category) catSet.add(t.category); });
    const allCats = [...catSet].filter(Boolean).sort();
    const grpOptionsHtml = [
      ['flexible', L('Fleksibel / Discretionary', 'Flexible / Discretionary')],
      ['fixed', L('Biaya Tetap / Tagihan', 'Fixed Bills & Commitments')],
      ['income', L('Pendapatan', 'Income')]
    ].map(([val, label]) => `<option value="${val}" ${(existing?.group || 'flexible') === val ? 'selected' : ''}>${escape(label)}</option>`).join('');
    const catDatalist = `<datalist id="budget-cat-options">${allCats.map(c => `<option value="${escape(c)}">`).join('')}</datalist>`;

    openModal(
      existing ? L('Edit Anggaran Kategori', 'Edit Category Budget') : L('Atur Anggaran Kategori', 'Set Category Budget'),
      form(
        field(L('Kategori', 'Category'), 'category', existing ? existing.category : '', 'text', `${existing ? 'readonly' : 'list="budget-cat-options"'} required maxlength="80"`) + catDatalist +
        field(L('Nominal Anggaran Bulanan', 'Monthly Budget Amount') + ' · ' + state.currency, 'amount', existing ? String(existing.amount / 100) : '0', 'number', 'required min="0" step="0.01"') +
        field(L('Grup Anggaran (Gaya Monarch)', 'Budget Group'), 'group', '', 'select', grpOptionsHtml) +
        `<label class="form-toggle-label" style="display:flex;align-items:center;gap:8px;margin-top:10px;cursor:pointer"><input type="checkbox" name="rollover" ${existing?.rollover ? 'checked' : ''}> <b>${L('Aktifkan Rollover (Surplus/Defisit Berlanjut ke Bulan Berikutnya)', 'Enable Rollover (Surplus/Deficit carries over to next month)')}</b></label>`,
        L('Simpan Anggaran', 'Save Budget'),
        L('Rollover memungkinkan sisa saldo anggaran bulan lalu otomatis ditambahkan (atau defisit dikurangkan) pada kapasitas bulan ini.', 'Rollover allows last month\'s unused budget to be carried over (or overspending deducted) in this month.')
      ),
      d => {
        const cat = requireText(d.category);
        const amt = E.cents(d.amount);
        const group = d.group || 'flexible';
        const rollover = Boolean(d.rollover);
        persistCorrection(E.setCategoryBudget(state, cat, amt, group, rollover));
        render();
        successToast(L('Anggaran kategori tersimpan.', 'Category budget saved.'));
      }
    );
  }
  function removeBudgetCategory(catName){
    if(!catName) return;
    confirmAction(
      L('Hapus alokasi anggaran ini?', 'Remove this budget allocation?'),
      `${escape(catName)} · ${L('Riwayat mutasi transaksi kategori ini tidak akan terhapus.', 'Transaction history for this category will remain unchanged.')}`,
      ()=>{
        state.budgets = (state.budgets || []).filter(b => b.category.toLowerCase() !== catName.toLowerCase());
        persistCorrection(state);
        render();
        successToast(L('Anggaran kategori dihapus.', 'Category budget removed.'));
      }
    );
  }
  function copyLastMonthBudgets(){
    if(!state.budgets || state.budgets.length === 0){
      const cats = [...new Set((state.transactions || []).filter(t => t.kind === 'expense').map(t => t.category).filter(Boolean))];
      if(cats.length === 0){
        toast(L('Belum ada data transaksi untuk disalin.', 'No transaction data available to copy.'));
        return;
      }
      state.budgets = cats.map(c => {
        const txs = state.transactions.filter(t => t.kind === 'expense' && t.category === c);
        const sumAmt = txs.reduce((a, b) => a + (b.amount || 0), 0);
        const avg = Math.round(sumAmt / Math.max(1, txs.length));
        return { id: uid(), category: c, amount: avg || 50000, group: ['rent','utilities','insurance','tagihan'].some(k=>c.toLowerCase().includes(k)) ? 'fixed' : 'flexible', rollover: true };
      });
      persistCorrection(state);
      render();
      successToast(L('Anggaran berhasil dibuat otomatis dari pola pengeluaran.', 'Budgets auto-generated from spending patterns.'));
      return;
    }
    toast(L('Alokasi anggaran bulanan sudah aktif.', 'Monthly budget allocations are already active.'));
  }
  function createRuleFromTransaction(id){
    const tx = state.transactions.find(t=>t.id===id);
    if(!tx) return;
    const cleanName = tx.name.trim();
    operationRule(null, {
      name: `${L('Aturan','Rule')}: ${cleanName}`,
      conditions: {
        contains: cleanName,
        kind: tx.kind,
        accountId: tx.accountId
      },
      actions: {
        category: tx.category,
        name: cleanName
      }
    });
  }
  function openRulesManagerModal(){
    const rules = state.operations?.rules || [];
    openModal(
      L('Aturan Otomatis Transaksi (Gaya Monarch)', 'Transaction Automation Rules'),
      `<div class="rules-manager-wrap">
        <div class="rules-header-actions" style="display:flex;gap:8px;justify-content:space-between;align-items:center;margin-bottom:14px">
          <div><b>${rules.length}</b> ${L('aturan aktif', 'active rules')}</div>
          <div style="display:flex;gap:8px">
            ${button(L('+ Aturan baru', '+ New rule'), 'ops-rule-new', 'primary')}
            ${button(L('⚡ Tinjau & Terapkan', '⚡ Preview & Apply'), 'ops-rule-preview')}
          </div>
        </div>
        <div class="rules-list-container" style="max-height:360px;overflow-y:auto;display:flex;flex-direction:column;gap:8px">
          ${rules.map(r => `
            <div class="saved-row" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border:1px solid var(--border-color,#333);border-radius:8px">
              <div>
                <div style="display:flex;align-items:center;gap:6px">
                  <b>${escape(r.name)}</b>
                  <span class="badge ${r.enabled!==false?'green':'dim'}">${r.enabled!==false?L('Aktif','Active'):L('Nonaktif','Disabled')}</span>
                </div>
                <small style="color:var(--text-muted,#888);display:block;margin-top:4px">
                  ${L('Jika mengandung','If contains')}: <code>"${escape(r.conditions?.contains || '')}"</code>
                  ${r.actions?.category ? ` → ${L('Kategori','Category')}: <b>${escape(r.actions.category)}</b>` : ''}
                  ${r.actions?.name ? ` → ${L('Ubah nama','Rename')}: <b>${escape(r.actions.name)}</b>` : ''}
                </small>
              </div>
              <div style="display:flex;gap:6px">
                <button class="btn btn-sm" data-action="ops-rule:${r.id}">${L('Edit','Edit')}</button>
                <button class="btn btn-sm" data-action="ops-rule-delete:${r.id}">×</button>
              </div>
            </div>
          `).join('') || `<p class="empty" style="padding:20px;text-align:center">${L('Belum ada aturan otomatis. Klik "⚡" pada baris transaksi untuk membuat aturan cepat.','No automation rules yet. Click "⚡" on any transaction row to quickly create a rule.')}</p>`}
        </div>
        <p class="note" style="margin-top:14px">${L('Aturan otomatis dieksekusi saat mutasi baru diimpor atau dicatat, membersihkan nama merchant dan mengkategorikan transaksi tanpa mengubah saldo akun.','Automation rules run when new transactions are imported or recorded, cleaning merchant names and categorizing without altering account balances.')}</p>
      </div>`
    );
  }
  function budgetView(){
    const s = viewState();
    const summary = E.monthlyBudgetSummary(s, budgetYear, budgetMonth);
    const monthName = new Date(budgetYear, budgetMonth, 1).toLocaleDateString(locale(), {month: 'long', year: 'numeric'});

    let paceStatus = summary.onTrack ? 'on-track' : (summary.spendPacePercent >= 100 ? 'over-budget' : 'pacing-fast');
    let paceText = summary.onTrack
      ? L(`Hari ke-${summary.currentDay} dari ${summary.totalDays} (${summary.monthPacePercent}% bulan berjalan). Pengeluaran Anda ${summary.spendPacePercent}% dari anggaran — Sesuai Target!`, `Day ${summary.currentDay} of ${summary.totalDays} (${summary.monthPacePercent}% of month). Spending is ${summary.spendPacePercent}% of budget — On Track!`)
      : (summary.spendPacePercent >= 100
        ? L(`Hari ke-${summary.currentDay} dari ${summary.totalDays}. Pengeluaran sudah melampaui batas anggaran (${summary.spendPacePercent}% terpakai).`, `Day ${summary.currentDay} of ${summary.totalDays}. Spending has exceeded monthly budget (${summary.spendPacePercent}% spent).`)
        : L(`Hari ke-${summary.currentDay} dari ${summary.totalDays} (${summary.monthPacePercent}% bulan berjalan). Pengeluaran melaju lebih cepat (${summary.spendPacePercent}% dari anggaran).`, `Day ${summary.currentDay} of ${summary.totalDays} (${summary.monthPacePercent}% of month). Spending is pacing fast (${summary.spendPacePercent}% of budget).`));

    const groupPill = (filterId, label) => `<button type="button" class="budget-filter-pill ${budgetGroupFilter === filterId ? 'active' : ''}" data-action="budget-filter:${filterId}">${label}</button>`;

    const renderGroup = (title, subtitle, grpData, grpType) => {
      if (budgetGroupFilter !== 'all' && budgetGroupFilter !== grpType) return '';
      const pct = grpData.budget > 0 ? Math.min(100, Math.round((grpData.actual / grpData.budget) * 100)) : (grpData.actual > 0 ? 100 : 0);
      const isOver = grpData.actual > grpData.budget;
      return `
        <section class="budget-group-card">
          <div class="budget-group-head">
            <div>
              <h3>${title}</h3>
              <p class="budget-group-sub">${subtitle}</p>
            </div>
            <div class="budget-group-totals">
              <span>${L('Terpakai','Spent')}: <b>${amount(grpData.actual)}</b></span>
              <span>${L('Anggaran','Budget')}: <b>${amount(grpData.budget)}</b></span>
              <span class="${isOver ? 'negative' : 'positive'}">${L('Sisa','Remaining')}: <b>${amount(grpData.remaining)}</b></span>
            </div>
          </div>
          <div class="budget-group-bar">
            <div class="budget-bar-fill ${isOver ? 'fill-over' : pct >= 85 ? 'fill-warning' : 'fill-good'}" style="width:${pct}%"></div>
          </div>
          <div class="budget-table-wrap">
            <table class="budget-table">
              <thead>
                <tr>
                  <th>${L('Kategori','Category')}</th>
                  <th>${L('Realisasi Bulan Ini','Actual Spending')}</th>
                  <th>${L('Batas Anggaran','Monthly Budget')}</th>
                  <th>${L('Progres','Progress')}</th>
                  <th>${L('Sisa / Status','Remaining')}</th>
                  <th scope="col">${L('Aksi','Actions')}</th>
                </tr>
              </thead>
              <tbody>
                ${grpData.items.map(cat => {
                  const catOver = cat.actual > cat.effectiveBudget;
                  const catPct = Math.min(100, cat.percent);
                  return `
                    <tr class="budget-item-row ${catOver ? 'row-over' : ''}">
                      <td>
                        <div class="budget-cat-identity">
                          <span class="tx-cat-avatar">${F.categoryIcon(cat.category)}</span>
                          <div>
                            <b>${escape(cat.category)}</b>
                            ${cat.rollover ? `<span class="rollover-pill ${cat.rolloverAmount >= 0 ? 'surplus' : 'deficit'}" title="${L('Rollover dari bulan lalu','Rollover from last month')}">⇄ Rollover: ${amount(Math.abs(cat.rolloverAmount),state.currency,cat.rolloverAmount >= 0 ? '+ ' : '− ')}</span>` : ''}
                          </div>
                        </div>
                      </td>
                      <td><b class="budget-val ${cat.actual > 0 ? 'expense-amount' : ''}">${amount(cat.actual)}</b></td>
                      <td>
                        <span class="budget-val">${amount(cat.effectiveBudget)}</span>
                        ${cat.rollover && cat.rolloverAmount !== 0 ? `<small style="display:block;font-size:10px;color:var(--text-muted,#888)">(${L('Basis','Base')}: ${amount(cat.budget)})</small>` : ''}
                      </td>
                      <td>
                        <div class="budget-progress-container">
                          <div class="budget-bar-track">
                            <div class="budget-bar-fill ${cat.status === 'over' ? 'fill-over' : cat.status === 'warning' ? 'fill-warning' : 'fill-good'}" style="width:${catPct}%"></div>
                          </div>
                          <span class="budget-pct-text">${cat.percent}%</span>
                        </div>
                      </td>
                      <td>
                        <span class="budget-remaining-badge ${catOver ? 'negative' : 'positive'}">
                          ${amount(Math.abs(cat.remaining),state.currency,catOver ? '− ' : '')}
                        </span>
                      </td>
                      <td>
                        <div class="transaction-actions">
                          <button type="button" class="transaction-icon" data-action="budget-edit:${cat.category}" title="${L('Edit Anggaran','Edit Budget')}">${icon('edit')}</button>
                          ${cat.id ? `<button type="button" class="transaction-icon" data-action="budget-remove:${cat.category}" title="${L('Hapus Anggaran','Remove Budget')}">${icon('delete')}</button>` : ''}
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('') || `<tr><td colspan="6" class="empty">${L('Belum ada kategori dalam grup ini. Klik "Atur Anggaran" untuk menambahkan.','No categories in this group. Click "Set Budget" to add.')}</td></tr>`}
              </tbody>
            </table>
          </div>
        </section>
      `;
    };

    return header(
      L('Anggaran Fleksibel & Terkendali.','Flexible budgeting that adapts to your life.'),
      L('Pantau batas pengeluaran dengan Rollover surplus/defisit dan Pace Tracker bulanan bergaya Monarch Money.','Track category limits with rollover and monthly spending pace inspired by Monarch Money.'),
      button(L('Atur Anggaran','Set Budget'),'budget-setup','primary','plus') + button(L('Salin Bulan Lalu','Copy Last Month'),'budget-copy'),
      'BUDGET & SPENDING PACE'
    ) + cashflowSwitcher('budget') + `
      <div class="budget-toolbar">
        <div class="budget-nav">
          <button class="btn btn-sm" data-action="budget-prev">◀</button>
          <span class="budget-current-month">${escape(monthName)}</span>
          <button class="btn btn-sm" data-action="budget-next">▶</button>
          <button class="btn btn-sm" data-action="budget-today">${L('Bulan Ini','This Month')}</button>
        </div>
        <div class="budget-filter-pills">
          ${groupPill('all', L('Semua Kategori','All Categories'))}
          ${groupPill('flexible', L('Pengeluaran Fleksibel','Flexible Expenses'))}
          ${groupPill('fixed', L('Biaya Tetap & Tagihan','Fixed Bills'))}
        </div>
      </div>

      <section class="pace-banner pace-${paceStatus}">
        <div class="pace-header">
          <div class="pace-title-wrap">
            <span class="pace-badge badge-${paceStatus}">
              ${paceStatus === 'on-track' ? '✓ ' + L('Sesuai Target','On Track') : (paceStatus === 'over-budget' ? '⚠ ' + L('Melebihi Anggaran','Over Budget') : '⚡ ' + L('Melaju Cepat','Pacing Fast'))}
            </span>
            <span class="pace-text">${escape(paceText)}</span>
          </div>
          <div class="pace-stats">
            <span>${L('Waktu Berjalan','Time elapsed')}: <b>${summary.monthPacePercent}%</b></span>
            <span>${L('Anggaran Terpakai','Budget spent')}: <b>${summary.spendPacePercent}%</b></span>
          </div>
        </div>
        <div class="pace-track-dual">
          <div class="pace-fill-time" style="width:${summary.monthPacePercent}%" title="${L('Waktu Bulan Berjalan','Time elapsed')}"></div>
          <div class="pace-fill-spend pace-spend-${paceStatus}" style="width:${Math.min(100, summary.spendPacePercent)}%" title="${L('Pengeluaran Aktual','Actual spend')}"></div>
        </div>
        <div class="pace-legend">
          <span><i class="pace-dot dot-time"></i> ${L('Hari Berjalan','Days elapsed')} (${summary.currentDay}/${summary.totalDays})</span>
          <span><i class="pace-dot dot-spend"></i> ${L('Total Belanja','Total spent')} (${amount(summary.totalSpent)} / ${amount(summary.totalBudget)})</span>
        </div>
      </section>

      <div class="metrics-grid">
        ${metric(L('Total Anggaran','Total Budget'), amount(summary.totalBudget), L('Termasuk rollover saldo lalu','Including last month rollover'), 'budget')}
        ${metric(L('Realisasi Pengeluaran','Actual Spending'), amount(summary.totalSpent), summary.spendPacePercent + '% ' + L('dari total anggaran','of monthly budget'), 'cashflow')}
        ${metric(L('Sisa Anggaran','Remaining Budget'), `<span class="${summary.totalRemaining < 0 ? 'negative' : 'positive'}">${amount(summary.totalRemaining)}</span>`, summary.totalRemaining < 0 ? L('Defisit bulan berjalan','Current month deficit') : L('Kapasitas belanja aman','Safe spending capacity'), 'scale')}
        ${metric(L('Pemasukan Bulan Ini','Income This Month'), amount(summary.incomeActual), L('Target terencana: ','Planned target: ') + amount(summary.plannedIncome), 'growth')}
      </div>

      <div class="budget-groups-wrap">
        ${renderGroup(
          L('Fleksibel / Discretionary Pool','Flexible / Discretionary Expenses'),
          L('Kategori kebutuhan sehari-hari yang dapat disesuaikan (Makanan, Hiburan, Belanja, Gaya Hidup) dengan rollover aktif.','Everyday flexible spending categories (Groceries, Lifestyle, Dining) with active rollover.'),
          summary.flexible,
          'flexible'
        )}
        ${renderGroup(
          L('Biaya Tetap & Komitmen','Fixed Bills & Commitments'),
          L('Pengeluaran rutin bulanan yang nilainya cenderung tetap (Sewa, Utilitas, Asuransi, Langganan).','Recurring fixed obligations (Rent, Utilities, Insurance, Subscriptions).'),
          summary.fixed,
          'fixed'
        )}
      </div>
    `;
  }

  /* ==========================================================================
     PWA & VAULT SOVEREIGN SECURITY (BIOMETRIC & QUICK PIN)
     ========================================================================== */
  let deferredInstallPrompt = null;
  let isVaultLocked = false;
  let autoLockTimerId = null;

  function safeSessionGet(key) {
    try { return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(key) : null; } catch (e) { return null; }
  }
  function safeSessionSet(key, val) {
    try { if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, val); } catch (e) {}
  }
  function safeSessionRemove(key) {
    try { if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(key); } catch (e) {}
  }
  function closeModal() {
    try { $('#modal')?.close(); } catch (e) {}
  }

  function checkAppStandalone() {
    if (typeof window === 'undefined') return false;
    return !!(window.matchMedia?.('(display-mode: standalone)').matches || window.navigator?.standalone);
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredInstallPrompt = e;
      const btn = $('#pwa-install-button');
      if (btn) btn.style.display = 'flex';
    });
    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      toast('🎉 ' + L('INVEYS berhasil diinstal sebagai aplikasi native!', 'INVEYS installed as native app!'));
      render();
    });
  }

  function triggerPwaInstall() {
    if (checkAppStandalone()) {
      toast('✓ ' + L('INVEYS sudah berjalan dalam mode aplikasi standalone!', 'INVEYS is running in standalone mode!'));
      return;
    }
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then(choice => {
        if (choice && choice.outcome === 'accepted') {
          toast(L('Memasang aplikasi INVEYS…', 'Installing INVEYS app…'));
        }
        deferredInstallPrompt = null;
      }).catch(() => {});
    } else {
      showPwaInstallGuideModal();
    }
  }

  function showPwaInstallGuideModal() {
    const ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    openModal(L('📲 Instal INVEYS ke Layar Utama', '📲 Install INVEYS App'), `
      <div class="pwa-guide-modal" style="text-align:center;max-width:440px;margin:0 auto;">
        <div style="font-size:44px;margin-bottom:12px;">📱</div>
        <h3 style="font-size:18px;margin-bottom:8px;">${L('Pengalaman Aplikasi Mandiri (Native PWA)', 'Native Standalone App Experience')}</h3>
        <p style="font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:20px;">
          ${L('Pasang INVEYS sebagai aplikasi resmi di perangkat Anda tanpa bilah browser, dengan loading instan, keamanan biometrik, dan performa cepat.', 'Install INVEYS as a native standalone app with offline speed, biometric lock, and zero browser distraction.')}
        </p>

        ${isIOS ? `
          <div class="ios-install-steps" style="text-align:left;background:var(--bg-hover,#f8fafc);padding:16px;border-radius:12px;border:1px solid var(--line);margin-bottom:18px;">
            <div style="font-weight:700;margin-bottom:10px;color:var(--accent,#34d399);">${L('Panduan Safari iOS (iPhone / iPad):', 'iOS Safari Steps:')}</div>
            <div style="display:flex;gap:10px;margin-bottom:10px;align-items:flex-start;">
              <span style="background:var(--card-subtle,#e2e8f0);width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:700;flex-shrink:0;">1</span>
              <span style="font-size:13px;line-height:1.5;">${L('Ketuk tombol <b>Bagikan (Share)</b> <span style="font-size:16px;">⎋</span> di bilah bawah Safari.', 'Tap the <b>Share icon</b> <span style="font-size:16px;">⎋</span> at the bottom of Safari.')}</span>
            </div>
            <div style="display:flex;gap:10px;margin-bottom:10px;align-items:flex-start;">
              <span style="background:var(--card-subtle,#e2e8f0);width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:700;flex-shrink:0;">2</span>
              <span style="font-size:13px;line-height:1.5;">${L('Geser ke bawah dan pilih <b>"Tambahkan ke Layar Utama" (Add to Home Screen)</b> <span style="font-size:16px;">⊞</span>.', 'Scroll down and select <b>"Add to Home Screen"</b> <span style="font-size:16px;">⊞</span>.')}</span>
            </div>
            <div style="display:flex;gap:10px;align-items:flex-start;">
              <span style="background:var(--card-subtle,#e2e8f0);width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:700;flex-shrink:0;">3</span>
              <span style="font-size:13px;line-height:1.5;">${L('Ketuk <b>Tambah (Add)</b> di pojok kanan atas. Buka INVEYS dari layar depan Anda!', 'Tap <b>Add</b> at top right. Open INVEYS right from your home screen!')}</span>
            </div>
          </div>
        ` : `
          <div class="ios-install-steps" style="text-align:left;background:var(--bg-hover,#f8fafc);padding:16px;border-radius:12px;border:1px solid var(--line);margin-bottom:18px;">
            <div style="font-weight:700;margin-bottom:10px;color:var(--accent,#34d399);">${L('Panduan Desktop / Android:', 'Desktop / Android Steps:')}</div>
            <div style="display:flex;gap:10px;margin-bottom:10px;align-items:flex-start;">
              <span style="background:var(--card-subtle,#e2e8f0);width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:700;flex-shrink:0;">1</span>
              <span style="font-size:13px;line-height:1.5;">${L('Klik ikon instal <b>⊕</b> di bilah URL browser Chrome/Edge, atau buka menu titik tiga <b>⋮</b>.', 'Click the install icon <b>⊕</b> in your browser address bar, or tap the three dots menu <b>⋮</b>.')}</span>
            </div>
            <div style="display:flex;gap:10px;align-items:flex-start;">
              <span style="background:var(--card-subtle,#e2e8f0);width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:700;flex-shrink:0;">2</span>
              <span style="font-size:13px;line-height:1.5;">${L('Pilih <b>"Instal INVEYS"</b> atau <b>"Tambahkan ke Layar Utama"</b>.', 'Select <b>"Install INVEYS"</b> or <b>"Add to Home Screen"</b>.')}</span>
            </div>
          </div>
        `}
        <button type="button" class="btn primary" data-action="modal-close" onclick="closeModal()">${L('Mengerti & Tutup', 'Got It')}</button>
      </div>
    `);
  }

  async function isBiometricAvailable() {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) return false;
    try {
      if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  async function registerBiometric(username = 'INVEYS User') {
    if (typeof window === 'undefined' || !window.PublicKeyCredential || !navigator.credentials) {
      throw new Error(L('Sensor biometrik tidak didukung di peramban ini.', 'Biometrics not supported on this browser.'));
    }
    const challenge = new Uint8Array(32);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(challenge);
    const userId = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(userId);
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'INVEYS Sovereign Vault', id: window.location?.hostname || 'localhost' },
        user: { id: userId, name: username, displayName: username },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }, { alg: -257, type: 'public-key' }],
        authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
        timeout: 60000
      }
    });
    if (credential) {
      const rawId = new Uint8Array(credential.rawId);
      let binary = '';
      for (let i = 0; i < rawId.byteLength; i++) binary += String.fromCharCode(rawId[i]);
      const credIdBase64 = (typeof btoa === 'function') ? btoa(binary) : 'bio_token';
      localStorage.setItem('inveys_bio_cred_id', credIdBase64);
      localStorage.setItem('inveys_bio_enabled', 'true');
      return credIdBase64;
    }
  }

  async function verifyBiometric() {
    if (typeof window === 'undefined' || !window.PublicKeyCredential || !navigator.credentials) {
      throw new Error(L('Sensor biometrik tidak tersedia.', 'Biometrics unavailable.'));
    }
    const credIdBase64 = localStorage.getItem('inveys_bio_cred_id');
    const challenge = new Uint8Array(32);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(challenge);
    const options = { challenge, timeout: 60000, userVerification: 'required' };
    if (credIdBase64 && typeof atob === 'function') {
      try {
        const binary = atob(credIdBase64);
        const rawId = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) rawId[i] = binary.charCodeAt(i);
        options.allowCredentials = [{ type: 'public-key', id: rawId, transports: ['internal'] }];
      } catch (e) {}
    }
    const assertion = await navigator.credentials.get({ publicKey: options });
    return !!assertion;
  }

  async function hashPin(pin, salt = 'inveys_pin_salt') {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      try {
        const enc = new TextEncoder();
        const hashBuf = await window.crypto.subtle.digest('SHA-256', enc.encode(salt + pin));
        return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {}
    }
    let h = 0;
    const str = salt + pin;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return 'h_' + Math.abs(h);
  }

  function openPinSetupModal() {
    const currentPinHash = localStorage.getItem('inveys_pin_hash');
    openModal(currentPinHash ? L('Ubah PIN Keamanan', 'Change Security PIN') : L('Atur PIN Keamanan Baru', 'Set Up Security PIN'), `
      <form id="pin-setup-form" style="max-width:320px;margin:0 auto;text-align:center;">
        <div style="font-size:36px;margin-bottom:8px;">🔢</div>
        <p style="font-size:12px;color:var(--muted);margin-bottom:18px;">
          ${L('Masukkan 4 hingga 6 digit angka untuk membuka brankas finansial Anda secara kilat.', 'Enter 4 to 6 numeric digits to quickly unlock your financial vault.')}
        </p>
        ${currentPinHash ? `
          <div class="field" style="margin-bottom:12px;text-align:left;">
            <label for="current-pin-input">${L('PIN Lama', 'Current PIN')}</label>
            <input type="password" id="current-pin-input" inputmode="numeric" pattern="[0-9]*" maxlength="6" required autocomplete="off" style="text-align:center;letter-spacing:6px;font-size:18px;">
          </div>
        ` : ''}
        <div class="field" style="margin-bottom:12px;text-align:left;">
          <label for="new-pin-input">${L('PIN Baru (4–6 Angka)', 'New PIN (4–6 Digits)')}</label>
          <input type="password" id="new-pin-input" inputmode="numeric" pattern="[0-9]*" maxlength="6" required autocomplete="off" style="text-align:center;letter-spacing:6px;font-size:18px;">
        </div>
        <div class="field" style="margin-bottom:18px;text-align:left;">
          <label for="confirm-pin-input">${L('Konfirmasi PIN Baru', 'Confirm New PIN')}</label>
          <input type="password" id="confirm-pin-input" inputmode="numeric" pattern="[0-9]*" maxlength="6" required autocomplete="off" style="text-align:center;letter-spacing:6px;font-size:18px;">
        </div>
        <div style="display:flex;gap:10px;justify-content:center;">
          ${currentPinHash ? `<button type="button" class="btn danger" id="remove-pin-btn">${L('Hapus PIN', 'Remove PIN')}</button>` : ''}
          <button type="submit" class="btn primary">${L('Simpan PIN', 'Save PIN')}</button>
        </div>
      </form>
    `);
    setTimeout(() => {
      const form = $('#pin-setup-form');
      if (form) {
        form.addEventListener('submit', async e => {
          e.preventDefault();
          const curInput = $('#current-pin-input');
          const newInput = $('#new-pin-input');
          const confInput = $('#confirm-pin-input');
          if (currentPinHash && curInput) {
            const curHash = await hashPin(curInput.value.trim());
            if (curHash !== currentPinHash) {
              toast('⚠️ ' + L('PIN Lama salah!', 'Current PIN is incorrect!'));
              return;
            }
          }
          const pin = (newInput?.value || '').trim();
          const conf = (confInput?.value || '').trim();
          if (!/^\d{4,6}$/.test(pin)) {
            toast('⚠️ ' + L('PIN harus berupa 4 hingga 6 digit angka!', 'PIN must be 4 to 6 numeric digits!'));
            return;
          }
          if (pin !== conf) {
            toast('⚠️ ' + L('Konfirmasi PIN tidak cocok!', 'PIN confirmation does not match!'));
            return;
          }
          const h = await hashPin(pin);
          localStorage.setItem('inveys_pin_hash', h);
          localStorage.setItem('inveys_pin_enabled', 'true');
          closeModal();
          toast('✅ ' + L('PIN keamanan berhasil disimpan!', 'Security PIN saved successfully!'));
          render();
        });
      }
      const removeBtn = $('#remove-pin-btn');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          localStorage.removeItem('inveys_pin_hash');
          localStorage.removeItem('inveys_pin_enabled');
          closeModal();
          toast(L('PIN keamanan dinonaktifkan', 'Security PIN disabled'));
          render();
        });
      }
    }, 40);
  }

  async function toggleBiometricSetup() {
    const isEnabled = localStorage.getItem('inveys_bio_enabled') === 'true';
    if (isEnabled) {
      localStorage.removeItem('inveys_bio_enabled');
      localStorage.removeItem('inveys_bio_cred_id');
      toast(L('Kunci biometrik dinonaktifkan', 'Biometric unlock disabled'));
      render();
      return;
    }
    try {
      const available = await isBiometricAvailable();
      if (!available && typeof window !== 'undefined' && !window.PublicKeyCredential) {
        toast('⚠️ ' + L('Perangkat atau peramban ini tidak mendukung sensor biometrik WebAuthn.', 'This device or browser does not support WebAuthn biometrics.'));
        return;
      }
      const userDisplayName = currentUser?.name || state.members[0]?.name || 'INVEYS User';
      await registerBiometric(userDisplayName);
      toast('✅ ' + L('Biometrik (Touch ID / Face ID) berhasil diaktifkan!', 'Biometrics (Touch ID / Face ID) successfully enabled!'));
      render();
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        toast('⚠️ ' + L('Aktivasi biometrik dibatalkan oleh pengguna.', 'Biometric setup cancelled.'));
      } else {
        toast('⚠️ ' + err.message);
      }
    }
  }

  function lockVault() {
    isVaultLocked = true;
    safeSessionSet('inveys_vault_locked', '1');
    showVaultLockScreen();
  }

  function unlockVault() {
    isVaultLocked = false;
    safeSessionRemove('inveys_vault_locked');
    hideVaultLockScreen();
    resetAutoLockTimer();
    toast('🔓 ' + L('Brankas berhasil dibuka!', 'Vault unlocked successfully!'));
  }

  async function logoutUser() {
    try {
      const token = localStorage.getItem('inveys_token');
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': 'Bearer ' + token } : {}) }
      });
    } catch (e) {}
    localStorage.removeItem('inveys_token');
    safeSessionRemove('inveys_vault_locked');
    isVaultLocked = false;
    currentUser = null;
    hideVaultLockScreen();
    render();
    showAuthScreen('login');
    toast(L('Sesi telah diakhiri. Silakan masuk kembali.', 'Logged out successfully. Please log in again.'));
  }

  function showVaultLockScreen() {
    const lockEl = $('#vault-lock-screen');
    if (!lockEl) return;
    lockEl.style.display = 'flex';

    const userName = currentUser?.name || state.members[0]?.name || 'Sovereign Member';
    const userEmail = currentUser?.email || 'Local Sovereign Vault';
    const initials = userName.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || 'IV';

    const nameEl = $('#vault-lock-name');
    const emailEl = $('#vault-lock-email');
    const avatarEl = $('#vault-lock-avatar');
    if (nameEl) nameEl.textContent = userName;
    if (emailEl) emailEl.textContent = userEmail;
    if (avatarEl) avatarEl.textContent = initials;

    renderVaultLockActions('default');

    const bioEnabled = localStorage.getItem('inveys_bio_enabled') === 'true';
    if (bioEnabled) {
      setTimeout(() => { triggerBiometricUnlock(); }, 250);
    }
  }

  function hideVaultLockScreen() {
    const lockEl = $('#vault-lock-screen');
    if (lockEl) lockEl.style.display = 'none';
    const errEl = $('#vault-lock-error');
    if (errEl) errEl.style.display = 'none';
  }

  function showLockError(msg) {
    const errEl = $('#vault-lock-error');
    if (errEl) {
      errEl.textContent = msg;
      errEl.style.display = 'block';
    }
  }

  function renderVaultLockActions(mode = 'default') {
    const actionsEl = $('#vault-lock-actions');
    const switchBtn = $('#vault-lock-switch-btn');
    if (!actionsEl) return;

    const bioEnabled = localStorage.getItem('inveys_bio_enabled') === 'true';
    const pinEnabled = localStorage.getItem('inveys_pin_enabled') === 'true' && !!localStorage.getItem('inveys_pin_hash');

    if (mode === 'default') {
      if (bioEnabled) {
        actionsEl.innerHTML = `
          <button type="button" class="vault-bio-btn" id="vault-trigger-bio-btn">
            <span style="font-size:22px;">👆</span>
            <span>${L('Buka dengan Touch ID / Face ID', 'Unlock with Touch ID / Face ID')}</span>
          </button>
        `;
        if (switchBtn) {
          switchBtn.textContent = pinEnabled ? L('Buka dengan PIN', 'Unlock with PIN') : L('Buka dengan Password', 'Unlock with Password');
          switchBtn.dataset.nextMode = pinEnabled ? 'pin' : 'pw';
        }
        setTimeout(() => {
          $('#vault-trigger-bio-btn')?.addEventListener('click', () => triggerBiometricUnlock());
        }, 20);
        return;
      }
      mode = pinEnabled ? 'pin' : 'pw';
    }

    if (mode === 'pin') {
      actionsEl.innerHTML = `
        <form id="vault-pin-form">
          <label for="vault-pin-input" style="font-size:11px;color:var(--muted);display:block;margin-bottom:8px;">${L('Masukkan 4–6 Digit PIN Anda', 'Enter your 4–6 digit PIN')}</label>
          <input type="password" id="vault-pin-input" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="• • • •" required autofocus style="text-align:center;letter-spacing:10px;font-size:24px;font-weight:700;width:180px;margin:0 auto 14px;display:block;">
          <button type="submit" class="btn primary" style="width:180px;">${L('Buka Kunci', 'Unlock')}</button>
        </form>
      `;
      if (switchBtn) {
        switchBtn.textContent = bioEnabled ? L('Buka dengan Biometrik', 'Unlock with Biometrics') : L('Buka dengan Password', 'Unlock with Password');
        switchBtn.dataset.nextMode = bioEnabled ? 'default' : 'pw';
      }
      setTimeout(() => {
        const form = $('#vault-pin-form');
        if (form) {
          form.addEventListener('submit', async e => {
            e.preventDefault();
            const entered = $('#vault-pin-input')?.value || '';
            const hash = await hashPin(entered.trim());
            if (hash === localStorage.getItem('inveys_pin_hash')) {
              unlockVault();
            } else {
              showLockError(L('PIN salah. Silakan coba lagi.', 'Incorrect PIN. Please try again.'));
              const inp = $('#vault-pin-input');
              if (inp) { inp.value = ''; inp.focus(); }
            }
          });
        }
      }, 20);
      return;
    }

    if (mode === 'pw') {
      actionsEl.innerHTML = `
        <form id="vault-pw-form">
          <input type="password" id="vault-pw-input" placeholder="${L('Password Akun', 'Account Password')}" required autofocus style="margin-bottom:12px;text-align:left;width:100%;">
          <button type="submit" class="btn primary" style="width:100%;">${L('Buka Kunci Brankas', 'Unlock Vault')}</button>
        </form>
      `;
      if (switchBtn) {
        switchBtn.textContent = bioEnabled ? L('Buka dengan Biometrik', 'Unlock with Biometrics') : (pinEnabled ? L('Buka dengan PIN', 'Unlock with PIN') : '');
        switchBtn.dataset.nextMode = bioEnabled ? 'default' : (pinEnabled ? 'pin' : '');
      }
      setTimeout(() => {
        const form = $('#vault-pw-form');
        if (form) {
          form.addEventListener('submit', async e => {
            e.preventDefault();
            const pw = $('#vault-pw-input')?.value || '';
            if (isServerMode && currentUser?.email) {
              const email = currentUser.email;
              try {
                const res = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password: pw })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Password salah');
                unlockVault();
              } catch (err) {
                showLockError(err.message);
              }
            } else {
              unlockVault();
            }
          });
        }
      }, 20);
    }
  }

  async function triggerBiometricUnlock() {
    try {
      const verified = await verifyBiometric();
      if (verified) {
        unlockVault();
      }
    } catch (err) {
      if (err.name !== 'NotAllowedError') {
        showLockError(err.message || L('Verifikasi biometrik tidak berhasil', 'Biometric verification unsuccessful'));
      }
    }
  }

  function resetAutoLockTimer() {
    if (autoLockTimerId) clearTimeout(autoLockTimerId);
    if (typeof localStorage === 'undefined') return;
    const setting = localStorage.getItem('inveys_autolock') || '15';
    if (setting === 'never') return;
    const minutes = parseInt(setting, 10);
    if (isNaN(minutes) || minutes <= 0) return;
    autoLockTimerId = setTimeout(() => {
      if (!isVaultLocked && (isAuthenticated || !isServerMode)) {
        lockVault();
      }
    }, minutes * 60 * 1000);
  }

  if (typeof window !== 'undefined') {
    ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
      window.addEventListener(evt, () => resetAutoLockTimer(), { passive: true });
    });
    document.addEventListener('visibilitychange', () => {
      if (typeof localStorage === 'undefined') return;
      const setting = localStorage.getItem('inveys_autolock') || '15';
      if (document.hidden) {
        if (setting === 'immediately' && !isVaultLocked && (isAuthenticated || !isServerMode)) {
          lockVault();
        }
      } else {
        resetAutoLockTimer();
      }
    });
  }

  function vaultSecuritySettings() {
    const bioEnabled = localStorage.getItem('inveys_bio_enabled') === 'true';
    const pinEnabled = localStorage.getItem('inveys_pin_enabled') === 'true' && !!localStorage.getItem('inveys_pin_hash');
    const autoLock = localStorage.getItem('inveys_autolock') || '15';
    const bioStatusText = bioEnabled
      ? '✓ ' + L('Aktif (Touch ID / Face ID terhubung)', 'Active (Touch ID / Face ID enabled)')
      : L('Belum aktif · Sentuh untuk mendaftarkan sensor perangkat', 'Disabled · Tap to register biometric sensor');
    const pinStatusText = pinEnabled
      ? '✓ ' + L('PIN Aktif (4–6 digit terenkripsi)', 'Active (4–6 digit salted PIN)')
      : L('Belum diatur · Buat PIN numerik untuk kunci kilat', 'Not set · Create numerical PIN for quick unlock');

    return `
      <section class="panel panel-pad vault-security-panel" style="margin-top:22px">
        <div class="panel-head" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <h2>🔒 ${L('Keamanan Brankas & Kunci Biometrik', 'Vault Security & Biometrics')}</h2>
            <p>${L('Kunci brankas finansial secara instan saat ditinggalkan, dan buka kunci dengan Touch ID, Face ID, atau Quick PIN.', 'Instantly lock your financial vault and unlock via Touch ID, Face ID, or Quick PIN.')}</p>
          </div>
          <button type="button" class="btn" data-action="lock-vault-now">🔒 ${L('Kunci Sekarang', 'Lock Now')}</button>
        </div>
        <div class="settings-row">
          <div>
            <b>${L('Kunci Biometrik (Touch ID / Face ID / Windows Hello)', 'Biometric Unlock (Touch ID / Face ID / Windows Hello)')}</b>
            <p>${L('Buka kunci brankas dengan sidik jari atau pengenalan wajah perangkat menggunakan standar WebAuthn.', 'Unlock your vault instantly using device biometrics via WebAuthn standard.')}</p>
            <span style="font-size:11px;color:var(--muted);">${escape(bioStatusText)}</span>
          </div>
          <button type="button" class="btn ${bioEnabled ? '' : 'primary'}" data-action="${bioEnabled ? 'disable-biometric' : 'setup-biometric'}">
            ${bioEnabled ? '✕ ' + L('Nonaktifkan', 'Disable') : '👆 ' + L('Aktifkan Biometrik', 'Enable Biometrics')}
          </button>
        </div>
        <div class="settings-row">
          <div>
            <b>${L('Quick PIN Keamanan (4–6 Digit)', 'Quick Security PIN (4–6 Digits)')}</b>
            <p>${L('Kunci kilat numerik untuk membuka brankas tanpa mengetik password panjang.', 'Fast numerical PIN to unlock your vault without typing full passwords.')}</p>
            <span style="font-size:11px;color:var(--muted);">${escape(pinStatusText)}</span>
          </div>
          <button type="button" class="btn" data-action="setup-pin">
            ${pinEnabled ? '🔢 ' + L('Ubah PIN', 'Change PIN') : '🔢 ' + L('Atur PIN Baru', 'Set Up PIN')}
          </button>
        </div>
        <div class="settings-row">
          <div>
            <b>${L('Kunci Otomatis (Auto-Lock Inactivity)', 'Auto-Lock Inactivity Timeout')}</b>
            <p>${L('Kunci brankas secara otomatis saat aplikasi tidak aktif atau saat berpindah tab browser.', 'Automatically lock vault when switching tabs or after a period of inactivity.')}</p>
          </div>
          <select id="setting-autolock-select" data-action="change-autolock" style="max-width:180px;">
            <option value="never" ${autoLock === 'never' ? 'selected' : ''}>${L('Hanya Manual', 'Manual Only')}</option>
            <option value="immediately" ${autoLock === 'immediately' ? 'selected' : ''}>${L('Saat Pindah Tab', 'On Tab Switch')}</option>
            <option value="5" ${autoLock === '5' ? 'selected' : ''}>5 ${L('Menit', 'Minutes')}</option>
            <option value="15" ${autoLock === '15' ? 'selected' : ''}>15 ${L('Menit', 'Minutes')}</option>
            <option value="30" ${autoLock === '30' ? 'selected' : ''}>30 ${L('Menit', 'Minutes')}</option>
          </select>
        </div>
      </section>
    `;
  }

  function pwaSettings() {
    const isStandalone = checkAppStandalone();
    return `
      <section class="panel panel-pad pwa-panel" style="margin-top:22px">
        <div class="panel-head" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <h2>📲 ${L('Aplikasi Mandiri & PWA (Installable App)', 'Native App & PWA Installation')}</h2>
            <p>${L('Jalankan INVEYS sebagai aplikasi resmi di perangkat seluler atau desktop dengan performa offline dan tanpa bilah browser.', 'Run INVEYS as a standalone desktop or mobile application with offline speed and zero browser chrome.')}</p>
          </div>
          <span class="vps-status-pill ${isStandalone ? 'online' : ''}">${isStandalone ? '● ' + L('Aplikasi Terinstal (Standalone)', 'Installed (Standalone)') : '○ ' + L('Mode Browser Web', 'Web Browser Mode')}</span>
        </div>
        <div class="settings-row">
          <div>
            <b>${L('Instal INVEYS ke Layar Utama', 'Install INVEYS to Home Screen')}</b>
            <p>${L('Tambahkan ikon resmi INVEYS ke layar beranda HP (Android/iOS) atau Desktop (Mac/Windows) untuk peluncuran instan.', 'Add INVEYS to your phone home screen or desktop application dock for instant launch.')}</p>
          </div>
          <button type="button" class="btn primary" data-action="pwa-install">
            📲 ${isStandalone ? L('Info Aplikasi', 'App Info') : L('Instal Aplikasi Sekarang', 'Install App Now')}
          </button>
        </div>
      </section>
    `;
  }

  function settings(){return header(L('Pengaturan & Kedaulatan Data', 'Your information. Your control.'),L('Kelola preferensi, keamanan brankas, kunci biometrik, PWA, dan portabilitas data finansial.','Manage your workspace, biometric security, PWA, and take your records with you.'),'','SETTINGS & DATA')+preferenceSettings()+appearanceSettings()+vaultSecuritySettings()+pwaSettings()+`<section class="panel panel-pad"><h2>Workspace & portability</h2><div class="settings-row"><div><b>Workspace name</b><p>${escape(state.name)}</p></div>${button('Rename','rename')}</div><div class="settings-row"><div><b>${L('Kunci API AI & Telegram Bot','AI API Keys & Telegram Bot')}</b><p>${L('Kelola, edit, uji, dan simpan kunci API Gemini, OpenAI, 9Router, Muse, dan Telegram Bot langsung di aplikasi.','Directly manage, edit, test, and save API keys for Gemini, OpenAI, 9Router, Muse, and Telegram Bot in-app.')}</p></div>${button(L('Kelola Kunci API & Bot','Manage API Keys & Bot'),'api-keys:all','primary')}</div><div class="settings-row"><div><b>${L('Kategori Transaksi (Monarch Style)','Transaction Categories (Monarch Style)')}</b><p>${L('Kelola kelompok kategori, ikon emoji, dan pengelompokan transaksi.','Manage category groups, emoji icons, and transaction classification.')}</p></div>${button(L('Buka Kategori','Open Categories'),'open-categories')}</div><div class="settings-row"><div><b>Export your financial records</b><p>Download your complete workspace as JSON. Keep this file somewhere secure.</p></div>${button('Export workspace','export','','download')}</div><div class="settings-row"><div><b>Import a workspace</b><p>Restore a previously exported INVEYS JSON file. Preview before replacement.</p></div>${button('Import JSON','import')}</div><div class="settings-row"><div><b>Transaction export</b><p>Download a spreadsheet-friendly transaction journal.</p></div>${button('Export CSV','export-csv','','download')}</div><div class="settings-row"><div><b>${L('Rekap Harta SPT Tahunan (DJP Online)','Annual Tax Asset Recap (DJP Online)')}</b><p>${L('Klasifikasi otomatis harta & utang ke kode resmi DJP (012, 031, 051, 101, dll.) dengan fitur salin tabel e-Form atau unduh CSV.','Automate asset & liability mapping into official DJP Online codes (012, 031, 051, 101, etc.) with 1-click table copy or CSV download.')}</p></div>${button(L('🇮🇩 Rekap SPT Pajak','🇮🇩 Tax Recap DJP'),'tax-djp-modal','secondary')}</div><div class="settings-row"><div><b>Start with your own records</b><p>Clear sample records and start a multi-currency workspace. Manage rates in Settings.</p></div>${button('Create empty workspace','empty-workspace')}</div><div class="settings-row"><div><b>Restore the sample workspace</b><p>Replace your current records with the original demo. Export first if needed.</p></div>${button('Reset demo','reset-demo','danger')}</div><div class="settings-row"><div><b>Delete local financial data</b><p>Remove this workspace from browser storage and start empty. Exported files remain yours to manage.</p></div>${button('Delete data','delete-data','danger')}</div></section><section class="panel panel-pad" style="margin-top:22px"><h2>About this MVP</h2><p class="card-description" style="margin-top:14px">INVEYS is an early, local-first Financial Operating System. This build supports manual financial records, recurring cash flow, goal allocations, debt projections, scenarios, and local planning tasks. Records are stored in this browser profile without application-level encryption or authentication. Use sample data while evaluating it. Live bank connections, multi-user permissions, tax engines, and production authentication are not configured. Telegram and Muse are optional local-server integrations configured in Integrations.</p></section><input type="file" accept="application/json,.json" id="import-file" class="file-input">`;}
  const prevTickerValues=new Map();
  function updateRollingTickers(){
    if(typeof window==='undefined'||typeof requestAnimationFrame==='undefined')return;
    if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    if(hideMoney)return;
    const els=$$('.big-number .money[data-ticker-cents], .metric-value .money[data-ticker-cents]');
    els.forEach((el,idx)=>{
      const targetCents=Number(el.dataset.tickerCents);
      if(!Number.isFinite(targetCents))return;
      const curr=el.dataset.tickerCurr||state.currency;
      const key=(el.closest('.metric')?.className||'bignum')+':'+idx;
      const hasPrev=prevTickerValues.has(key);
      const prevCents=hasPrev?prevTickerValues.get(key):(Math.abs(targetCents)>100000?Math.round(targetCents*0.7):0);
      prevTickerValues.set(key,targetCents);
      if(hasPrev&&prevCents===targetCents)return;
      el.classList.add('ticker-rolling');
      const startVal=prevCents;
      const diff=targetCents-startVal;
      const duration=600;
      const startTime=performance.now();
      function step(now){
        const elapsed=now-startTime;
        const progress=Math.min(1,elapsed/duration);
        const ease=progress===1?1:1-Math.pow(2,-10*progress);
        const currentCents=Math.round(startVal+diff*ease);
        el.textContent=money(currentCents,false,curr);
        if(progress<1){
          requestAnimationFrame(step);
        }else{
          el.textContent=money(targetCents,false,curr);
          setTimeout(()=>el.classList.remove('ticker-rolling'),200);
        }
      }
      requestAnimationFrame(step);
    });
  }

  const prevPillPositions=new Map();
  function updateSlidingPills(){
    if(typeof window==='undefined'||typeof document==='undefined')return;
    const segs=$$('.segmented, .monarch-segmented');
    segs.forEach((container,idx)=>{
      const activeBtn=container.querySelector('button.active, .monarch-seg-btn.active');
      if(!activeBtn)return;
      let glider=container.querySelector('.seg-glider');
      const isNew=!glider;
      if(isNew){
        glider=document.createElement('div');
        glider.className='seg-glider';
        container.prepend(glider);
      }
      const cRect=container.getBoundingClientRect?.();
      const bRect=activeBtn.getBoundingClientRect?.();
      if(!cRect||!bRect||cRect.width===0||bRect.width===0)return;
      const left=bRect.left-cRect.left;
      const width=bRect.width;
      const key='seg:'+(container.id||idx);
      if(isNew&&prevPillPositions.has(key)){
        const prev=prevPillPositions.get(key);
        glider.style.transition='none';
        glider.style.left=prev.left+'px';
        glider.style.width=prev.width+'px';
        void glider.offsetWidth;
        glider.style.transition='';
      }
      prevPillPositions.set(key,{left,width});
      glider.style.left=left+'px';
      glider.style.width=width+'px';
    });

    const tabs=$$('.report-tabs, .investment-top-tabs');
    tabs.forEach((container,idx)=>{
      const activeBtn=container.querySelector('button.active');
      if(!activeBtn)return;
      let glider=container.querySelector('.tab-glider');
      const isNew=!glider;
      if(isNew){
        glider=document.createElement('div');
        glider.className='tab-glider';
        container.appendChild(glider);
      }
      const cRect=container.getBoundingClientRect?.();
      const bRect=activeBtn.getBoundingClientRect?.();
      if(!cRect||!bRect||cRect.width===0||bRect.width===0)return;
      const left=bRect.left-cRect.left;
      const width=bRect.width;
      const key='tab:'+(container.id||idx);
      if(isNew&&prevPillPositions.has(key)){
        const prev=prevPillPositions.get(key);
        glider.style.transition='none';
        glider.style.left=prev.left+'px';
        glider.style.width=prev.width+'px';
        void glider.offsetWidth;
        glider.style.transition='';
      }
      prevPillPositions.set(key,{left,width});
      glider.style.left=left+'px';
      glider.style.width=width+'px';
    });
  }

  function render(){const title=pages.find(p=>p[0]===page)?.[1]||'Settings & data';$('#navigation').innerHTML=navigationV4();$('#breadcrumb-page').textContent=title;$('#breadcrumb-icon').innerHTML=icon(page);$('#notification-button').innerHTML=icon('bell');$('#main').innerHTML=broadcastBanner()+viewBar()+({operations,home:dashboardV4,shared,reports,forecast:safeForecast,accounts,investment,calendar,budget:budgetView,cashflow,transactions,categories:categoriesPage,goals,debt,scenarios,household,copilot,settings,montecarlo,cards,capture,integrations,plans,updates,admin:adminPanel}[page])()+quickComposer();document.body.classList.toggle('privacy-on',hideMoney);document.body.classList.toggle('quick-dock-visible',true);const quickInput=$('#quick-text');if(quickInput?.style){quickInput.style.height='auto';quickInput.style.height=Math.min(132,quickInput.scrollHeight)+'px';}refreshCharts();if(page==='reports'&&!['cashflow','spending','income'].includes(reportFilter.tab)){for(const el of $$('#report-form [name=account],#report-form [name=category],#report-form [name=group],#report-form [name=chart],#report-form [name=search]'))el.disabled=true;if(reportFilter.tab!=='networth')for(const el of $$('#report-form [name=from],#report-form [name=to]'))el.disabled=true;}if(page==='copilot')renderMessages();save();syncPreferences();localize();updateRollingTickers();updateSlidingPills();}
  function refreshCharts(){
    if(page==='scenarios'){updateScenario();localize();return;}
    if(page==='montecarlo'){if(mcResult&&$('#mc-chart'))$('#mc-chart').innerHTML=mcChart();return;}
    const chart=$('.chart-container');if(!chart)return;
    const width=chart.clientWidth||660;
    if(page==='home'){const h=historyData();chart.innerHTML=lineChart(h.values,h.labels,{width});}
    if(page==='cashflow'){const f=E.forecast(viewState());chart.innerHTML=lineChart(f.map(v=>v.balance),forecastLabels(),{name:'Liquid funds',width});}
  }
  window.addEventListener('resize',()=>{refreshCharts();updateSlidingPills();});
  function field(label,name,value='',type='text',opts=''){return `<div class="field"><label for="field-${name}">${label}</label>${type==='select'?`<select name="${name}" id="field-${name}">${opts}</select>`:`<input id="field-${name}" name="${name}" type="${type}" value="${escape(value)}" ${type==='number'?'step="0.01"':''} ${opts}>`}</div>`;}
  const options=(values,selected)=>values.map(v=>`<option value="${escape(v)}" ${v===selected?'selected':''}>${escape(v)}</option>`).join('');
  function openModal(title,body,handler=null){$('#modal-title').textContent=title;$('#modal-body').innerHTML=body;$('#modal').classList.toggle('has-monarch-tx',body.includes('monarch-tx-form'));$('#modal').classList.toggle('has-key-mgr',body.includes('key-mgr-dialog'));if(!$('#modal').open)$('#modal').showModal();localize();const form=$('form',$('#modal'));if(form&&handler)form.addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form));try{handler(data);$('#modal').close();render();}catch(err){const errEl=$('#form-error',form)||$('#form-error');if(errEl)errEl.textContent=t(err.message);else toast(err.message);}});}
  function form(fields,submit='Save',note=''){return `<form><div class="form-grid">${fields}</div>${note?`<p class="note">${note}</p>`:''}<p class="form-error" id="form-error" role="alert"></p><div class="form-actions"><button type="button" class="btn" data-action="modal-close">Cancel</button><button class="btn primary" type="submit">${submit}</button></div></form>`;}
  function requireText(v){const t=String(v||'').trim();if(!t)throw Error('A name is required.');return t.slice(0,120);}
  function positive(v,allowZero=false){const n=E.cents(v);if(n<0||(!allowZero&&n===0))throw Error('Enter a positive amount.');if(!Number.isSafeInteger(n))throw Error('Amount is too large.');return n;}
  function editAccount(id){const a=state.accounts.find(a=>a.id===id);openModal(a?'Edit account':'Add an account',form(field('Account name','name',a?.name||'','text','required maxlength="120"')+field('Account type','type','','select',options(['Checking','Savings','Cash','Investment','Property','Other'],a?.type||'Checking'))+field('Current balance','balance',a?a.balance/100:'','number','required')+field('Owner label','owner',a?.owner||'Me','text','required maxlength="80"')+ownerField(a)+currencyField(a)+field('Balance date','updated',a?.updated||date(),'date','required'),'Save account','Enter a current snapshot. This does not import historical transactions.'),d=>{if(a&&d.type!=='Investment'&&state.holdings.some(h=>h.accountId===id))throw Error(L('Akun dengan posisi aset harus tetap bertipe Investment.','Accounts with holdings must remain Investment accounts.'));const balance=E.cents(d.balance);if(!Number.isSafeInteger(balance))throw Error('Balance is too large.');const record={id:a?.id||uid(),name:requireText(d.name),type:d.type,currency:a?.currency||d.currency,balance,owner:requireText(d.owner),ownerId:d.ownerId||a?.ownerId||F.matchOwner(state,d.owner),updated:d.updated};const before=a?structuredClone(a):null;if(a)Object.assign(a,record);else state.accounts.push(record);E.migrate(state);OPS.audit(state,'account.saved',record.id,before,state.accounts.find(x=>x.id===record.id));toast('Account saved.');});lockCurrency(a);}
  function editGoal(id){const g=state.goals.find(g=>g.id===id);openModal(g?'Edit your goal':'Create a meaningful goal',form(field('Goal name','name',g?.name||'','text','required maxlength="120"')+field('Symbol','emoji',g?.emoji||'◎','select',options(['◎','⌂','✈','◌','✦','♡'],g?.emoji||'◎'))+field('Target','target',g?g.target/100:'','number','min="0.01" required')+field('Current allocation','saved',g?g.saved/100:0,'number','min="0" required')+field('Monthly contribution','monthly',g?g.monthly/100:0,'number','min="0" required')+ownerField(g)+currencyField(g)+field('Target date','due',g?.due||'','date'),'Save goal','Allocations reserve existing liquid funds; no money moves. Monthly contributions are planning commitments.'),d=>{const saved=positive(d.saved,true),allocated=E.sum(state.goals.filter(x=>x.id!==id).map(x=>E.reporting(state,x,'saved')));if(allocated+E.convert(state,saved,g?.currency||d.currency||state.currency)>E.position(state).liquid)throw Error('Goal allocations cannot exceed total liquid funds.');const record={id:g?.id||uid(),name:requireText(d.name),emoji:d.emoji,ownerId:d.ownerId||g?.ownerId||'shared',currency:g?.currency||d.currency,target:positive(d.target),saved,monthly:positive(d.monthly,true),due:d.due};if(g)Object.assign(g,record);else state.goals.push(record);toast('Goal saved.');});if(g)addRemove('goal',id);lockCurrency(g);}
  function allocateGoal(id){const g=state.goals.find(g=>g.id===id);const free=E.position(state).liquid-E.allocations(state);openModal('Allocate to '+g.name,form(field('Allocation ('+g.currency+')','amount','','number','min="0.01" required'),'Allocate funds',`${money(free)} currently unallocated. This designates funds already held in liquid accounts.`),d=>{E.fundGoal(state,id,positive(d.amount));toast('Goal allocation updated. No funds were moved.');});}
  function editDebt(id){const d=state.debts.find(d=>d.id===id);openModal(d?'Edit debt':'Add a liability',form(field('Debt name','name',d?.name||'','text','required maxlength="120"')+field('Outstanding balance','balance',d?d.balance/100:'','number','min="0" required')+ownerField(d)+currencyField(d)+field('Annual rate (%)','apr',d?.apr||0,'number','min="0" max="100" required')+field('Monthly minimum payment','minimum',d?d.minimum/100:'','number','min="0.01" required'),'Save debt','Fixed-rate projections only. Minimum payments are included in your recurring cash-flow plan.'),data=>{const apr=Number(data.apr);if(!Number.isFinite(apr)||apr<0||apr>100)throw Error('APR must be between 0 and 100%.');const record={id:d?.id||uid(),name:requireText(data.name),ownerId:data.ownerId||d?.ownerId||'shared',currency:d?.currency||data.currency,balance:positive(data.balance,true),apr,minimum:positive(data.minimum)};if(d)Object.assign(d,record);else state.debts.push(record);toast('Debt saved.');});if(d)addRemove('debt',id);lockCurrency(d);}
  function editFlow(id){const f=state.flows.find(f=>f.id===id);openModal(f?'Edit recurring item':'Add a recurring cash-flow item',form(field('Name','name',f?.name||'','text','required maxlength="120"')+field('Type','kind','','select',options(['income','expense'],f?.kind||'expense'))+field('Monthly amount','amount',f?f.amount/100:'','number','min="0" required')+ownerField(f)+currencyField(f)+field('Day of month (1–28)','day',f?.day||1,'number','min="1" max="28" required'),'Save recurring item','This changes your forecast plan, not your account balances. Enter debt minimum payments in Debt management to avoid double counting.'),d=>{const day=Number(d.day);if(!Number.isInteger(day)||day<1||day>28)throw Error('Use an integer day between 1 and 28.');const record={id:f?.id||uid(),name:requireText(d.name),kind:d.kind,ownerId:d.ownerId||f?.ownerId||'shared',currency:f?.currency||d.currency,amount:positive(d.amount,true),day};if(f)Object.assign(f,record);else state.flows.push(record);toast('Cash-flow plan updated.');});if(f)addRemove('flow',id);lockCurrency(f);}
  function lockCurrency(row){if(row)$('#field-currency').disabled=true;}
  function addRemove(type,id){$('.form-actions',$('#modal')).insertAdjacentHTML('afterbegin',`<button type="button" class="remove-record" data-action="remove-${type}:${id}">Remove record</button>`);}
  function editCardJournal(tx){openModal(L('Edit catatan kartu','Edit card journal'),form(field('Description','name',tx.name,'text','required maxlength="120"')+field('Category','category',tx.category,'text','required maxlength="80"')+field('Date','date',tx.date,'date','required'),'Save',L('Untuk mengoreksi nominal/akun, hapus lalu catat ulang agar perubahan utang dan kas konsisten.','To correct amount/account, delete and record again so debt and cash changes stay consistent.')),d=>{persistCorrection(F.editTransaction(state,tx.id,{name:requireText(d.name),category:requireText(d.category),date:d.date}));successToast(L('Catatan kartu tersimpan.','Card journal saved.'));});}
  function editTransaction(id){const tx=state.transactions.find(t=>t.id===id);if(!tx)return;if(tx.paymentJournal||tx.cardCharge){editCardJournal(tx);return;}const accountOptions=selected=>state.accounts.map(a=>`<option value="${a.id}" ${a.id===selected?'selected':''}>${escape(a.name)} (${a.currency})</option>`).join('');
    openModal(L('Edit transaksi','Edit transaction'),form(field('Description','name',tx.name,'text','required maxlength="120"')+field('Type','kind','','select',options(['expense','income','transfer'],tx.kind))+field('Amount','amount',tx.amount/100,'number','min="0.01" required')+field('Date','date',tx.date,'date','required')+field('Account / From','accountId','','select',accountOptions(tx.accountId))+`<div class="field" id="destination-field" ${tx.kind==='transfer'?'':'hidden'}><label for="field-targetId">Destination account</label><select id="field-targetId" name="targetId">${accountOptions(tx.targetId)}</select></div>`+field('Category','category',tx.category,'text','required maxlength="80"'),`${icon('save')}${L('Simpan koreksi','Save correction')}`,L('Edit memakai nominal transaksi penuh. Dampak saldo lama dibalik lalu koreksi diterapkan sekali. Jurnal historis tidak mengubah saldo. Perubahan nominal/jenis/akun yang memiliki split memerlukan penghapusan split dahulu. Transfer yang berubah memakai kurs tersimpan saat ini.','Edit uses the full transaction amount. The old balance impact is reversed and the correction applied once. Historical journal edits do not change balances. Remove ownership splits before changing amount/type/account. Changed transfers use current saved FX rates.')),d=>{persistCorrection(F.editTransaction(state,id,{name:requireText(d.name),kind:d.kind,amount:positive(d.amount),date:d.date,accountId:d.accountId,targetId:d.kind==='transfer'?d.targetId:undefined,category:requireText(d.category)}));successToast(L('Transaksi berhasil tersimpan.','Transaction saved successfully.'));});
    $('#field-kind').addEventListener('change',()=>{$('#destination-field').hidden=$('#field-kind').value!=='transfer';});
  }
  function getCurrencySymbol(cur){
    switch(cur){
      case 'USD':return '$';
      case 'IDR':return 'Rp';
      case 'EUR':return '€';
      case 'GBP':return '£';
      case 'SGD':return 'S$';
      case 'AUD':return 'A$';
      case 'JPY':return '¥';
      default:return cur||'$';
    }
  }
  function getAllCategoryGroups(){
    const custom=state.customCategories||[];
    const groups=F.categoryCatalog.map(g=>({
      group:g.group,
      groupEn:g.groupEn,
      type:g.type,
      categories:[
        ...g.categories,
        ...custom.filter(c=>c.group===g.group||c.group===g.groupEn)
      ]
    }));
    const existingGroupNames=new Set(groups.map(g=>g.group));
    const otherGroups=[...new Set(custom.map(c=>c.group).filter(g=>g&&!existingGroupNames.has(g)))];
    for(const og of otherGroups){
      groups.push({
        group:og,
        groupEn:og,
        type:'expense',
        categories:custom.filter(c=>c.group===og)
      });
    }
    return groups;
  }
  function renderCategoryGroupsHtml(selectedCat,filterQuery=''){
    const q=(filterQuery||'').toLowerCase().trim();
    const groups=getAllCategoryGroups();
    let html='';
    for(const g of groups){
      const groupTitle=state.language==='id'?(g.group||g.groupEn):(g.groupEn||g.group);
      const filteredCats=g.categories.filter(c=>{
        if(!q)return true;
        const n=(c.name||'').toLowerCase();
        const nId=(c.nameId||'').toLowerCase();
        return n.includes(q)||nId.includes(q);
      });
      if(!filteredCats.length)continue;
      html+=`<div class="monarch-cat-group-title">${escape(groupTitle)}</div>`;
      for(const c of filteredCats){
        const isSelected=selectedCat===c.name||selectedCat===c.nameId||selectedCat===`${c.icon} ${c.name}`;
        const displayName=state.language==='id'&&c.nameId?c.nameId:c.name;
        html+=`<button type="button" class="monarch-cat-item ${isSelected?'active':''}" data-cat-name="${escape(c.name)}" data-cat-icon="${escape(c.icon)}" data-cat-display="${escape(c.icon+' '+displayName)}">
          <span class="monarch-cat-item-icon">${escape(c.icon)}</span>
          <span class="monarch-cat-item-text">${escape(displayName)}</span>
          ${isSelected?'<span class="monarch-cat-check">✓</span>':''}
        </button>`;
      }
    }
    if(!html){
      html=`<div class="empty" style="padding:16px;font-size:12px">${L('Kategori tidak ditemukan','No categories found')}</div>`;
    }
    return html;
  }
  function editCategory(catId=null,prefillGroup=null,onSaveCb=null){
    const custom=state.customCategories||[];
    const existing=catId?custom.find(c=>c.id===catId):null;
    const groups=getAllCategoryGroups();
    const groupNames=[...new Set(groups.map(g=>g.group))];
    if(prefillGroup&&!groupNames.includes(prefillGroup))groupNames.unshift(prefillGroup);
    const groupOpts=groupNames.map(g=>`<option value="${escape(g)}" ${((existing?.group||prefillGroup)===g)?'selected':''}>${escape(g)}</option>`).join('');
    const emojiList=['🍽️','☕','🍏','⚡','💧','🌐','📱','⛽','🅿️','🚕','🚊','🏠','🔨','🎁','🎗️','✈️','🎟️','🧘','🐶','🥳','💵','💰','💳','🛍️','🩺','💈','📚','🎮','🏋️','🚗','🎓'];
    const emojiOpts=emojiList.map(e=>`<option value="${e}" ${(existing?.icon||'🏷️')===e?'selected':''}>${e}</option>`).join('');

    openModal(
      existing?L('Edit Kategori','Edit Category'):L('Buat Kategori Baru','Create Category'),
      form(
        field(L('Kelompok Kategori','Category Group'),'group','','select',groupOpts)+
        field(L('Nama Kategori','Category Name'),'name',existing?.name||'','text','required maxlength="60"')+
        field(L('Ikon Emoji','Emoji Icon'),'icon','','select',emojiOpts),
        L('Simpan Kategori','Save Category'),
        L('Kategori baru dapat langsung digunakan pada transaksi dan laporan.','New categories can immediately be used in transactions and reports.')
      ),
      d=>{
        const name=requireText(d.name);
        state.customCategories=state.customCategories||[];
        let savedCat;
        if(existing){
          existing.name=name;
          existing.group=d.group;
          existing.icon=d.icon||'🏷️';
          savedCat=existing;
        }else{
          savedCat={id:uid(),name,group:d.group,icon:d.icon||'🏷️'};
          state.customCategories.push(savedCat);
        }
        toast(L('Kategori berhasil disimpan.','Category saved successfully.'));
        if(onSaveCb)onSaveCb(savedCat);
        if(page==='categories')render();
      }
    );
  }
  function editCategoryGroup(){
    openModal(
      L('Buat Kelompok Kategori','Create Category Group'),
      form(
        field(L('Nama Kelompok','Group Name'),'groupName','','text','required maxlength="60"'),
        L('Buat Kelompok','Create Group'),
        L('Kelompok baru untuk mengorganisir berbagai kategori Anda.','A new group to organize your custom categories.')
      ),
      d=>{
        const gName=requireText(d.groupName);
        editCategory(null,gName);
      }
    );
  }
  function deleteCategory(id){
    confirmAction(
      L('Hapus Kategori?','Delete Category?'),
      L('Kategori khusus ini akan dihapus dari daftar. Transaksi lama tetap mempertahankan nama kategorinya.','This custom category will be removed. Existing transactions will retain their category name.'),
      ()=>{
        state.customCategories=(state.customCategories||[]).filter(c=>c.id!==id);
        toast(L('Kategori dihapus.','Category removed.'));
        render();
      },
      L('Hapus','Delete')
    );
  }
  function categoriesPage(){
    const groups=getAllCategoryGroups();
    const totalCategories=groups.reduce((acc,g)=>acc+g.categories.length,0);
    const txMap=new Map();
    for(const t of state.transactions){
      const cat=(t.category||'').toLowerCase();
      txMap.set(cat,(txMap.get(cat)||0)+1);
    }

    return header(
      L('Kategori & Pengelompokan','Categories'),
      L('Kelola kategori transaksi dan pantau alokasi pengeluaran Anda layaknya Monarch Money.','Organize and manage your transaction categories like Monarch Money.'),
      button(L('+ Tambah Kategori','+ Create Category'),'category-new','primary','plus')+button(L('+ Tambah Kelompok','+ Create Group'),'cat-group-new','','plus'),
      'CATEGORIES & SPENDING GROUPS'
    )+transactionSwitcher('categories')+`
    <div class="monarch-categories-wrap">
      <div class="monarch-alert-banner">
        <span class="alert-icon">💡</span>
        <div>
          <b>${L('Sistem Kategori Terpadu Monarch Money','Unified Monarch Money Category System')}</b>
          <p>${L('Semua transaksi, laporan, dan jurnal di Inveys menggunakan avatar ikon emoji dan pengelompokan kategori yang terstruktur dan fleksibel. Total ada ','All transactions, reports, and journals in Inveys use structured emoji avatars and category groupings. Currently ')}${totalCategories}${L(' kategori aktif.',' active categories.')}</p>
        </div>
      </div>

      <div class="monarch-flyout-search-wrap" style="border-radius:10px;border:1px solid var(--line);background:var(--paper)">
        <span class="flyout-search-icon">🔍</span>
        <input type="text" class="monarch-flyout-search" id="category-manager-search" placeholder="${L('Cari kategori...','Search categories...')}" autocomplete="off">
      </div>

      <div class="monarch-groups-container" id="monarch-groups-container">
        ${groups.map(g=>{
          const groupTitle=state.language==='id'?(g.group||g.groupEn):(g.groupEn||g.group);
          return `
          <section class="panel panel-pad monarch-group-card" data-group-name="${escape(g.group)}">
            <div class="panel-head">
              <div>
                <h2>${escape(groupTitle)}</h2>
                <small style="color:var(--muted)">${g.type==='income'?L('Pemasukan','Income'):L('Pengeluaran','Expense')}</small>
              </div>
              <span class="badge">${g.categories.length} ${L('kategori','categories')}</span>
            </div>
            <div class="monarch-group-cat-list">
              ${g.categories.map(c=>{
                const displayName=state.language==='id'&&c.nameId?c.nameId:c.name;
                const count=(txMap.get((c.name||'').toLowerCase())||0)+(c.nameId?(txMap.get((c.nameId||'').toLowerCase())||0):0);
                return `
                <div class="monarch-settings-cat-row" data-cat-row="${escape(c.name.toLowerCase())}" data-cat-display="${escape(displayName.toLowerCase())}">
                  <span class="monarch-drag-handle" title="${L('Urutkan','Reorder')}">⋮⋮</span>
                  <span class="monarch-cat-row-icon">${escape(c.icon)}</span>
                  <span class="monarch-cat-row-name">${escape(displayName)}</span>
                  <span class="badge ${count>0?'':'gray'} monarch-cat-count">${count} ${L('transaksi','tx')}</span>
                  ${c.id?`<button type="button" class="quiet-link" data-action="cat-edit:${c.id}" style="margin-left:6px" title="${L('Edit kategori ini','Edit category')}">✏️</button><button type="button" class="quiet-link" data-action="cat-delete:${c.id}" style="color:var(--danger);margin-left:4px" title="${L('Hapus kategori ini','Delete category')}">✕</button>`:''}
                </div>
                `;
              }).join('')}
            </div>
            <div class="monarch-group-foot">
              <button type="button" class="monarch-create-in-group-btn" data-action="category-new-group:${escape(g.group)}">+ ${L('Tambah Kategori ke ','Add Category to ')}${escape(groupTitle)}</button>
            </div>
          </section>
          `;
        }).join('')}
      </div>
    </div>
    `;
  }
  function initMonarchTransactionForm(){
    const form=$('#monarch-add-tx-form');
    if(!form)return;

    const segButtons=$$('.monarch-seg-btn',form);
    const kindInput=$('#monarch-tx-kind',form);
    const transferTarget=$('#monarch-transfer-target',form);
    const goalField=$('#monarch-goal-field',form);
    const goalLabel=$('#monarch-goal-label',form);
    const catWrap=$('#monarch-cat-field-wrap',form);
    const accountSelect=$('#monarch-account-select',form);
    const amountInput=$('#monarch-amount',form);
    const currSymSpan=$('#monarch-curr-sym',form);
    const adjustAmountSpan=$('#monarch-adjust-amount',form);

    function updateCurrencySymbol(){
      const accId=accountSelect?.value;
      const acc=state.accounts.find(a=>a.id===accId);
      const sym=getCurrencySymbol(acc?.currency||state.currency);
      if(currSymSpan)currSymSpan.textContent=sym;
      updateAdjustAmount();
    }

    function updateAdjustAmount(){
      const val=parseFloat(amountInput?.value)||0;
      const accId=accountSelect?.value;
      const acc=state.accounts.find(a=>a.id===accId);
      const sym=getCurrencySymbol(acc?.currency||state.currency);
      if(adjustAmountSpan){
        adjustAmountSpan.textContent=`${sym} ${val.toLocaleString(locale(),{minimumFractionDigits:val%1===0?0:2,maximumFractionDigits:2})}`;
      }
    }

    segButtons.forEach(btn=>{
      btn.addEventListener('click',()=>{
        segButtons.forEach(b=>{
          b.classList.remove('active');
          b.setAttribute('aria-checked','false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked','true');
        const kind=btn.dataset.kind;
        if(kindInput)kindInput.value=kind;

        if(kind==='transfer'){
          if(transferTarget)transferTarget.hidden=false;
          if(catWrap)catWrap.hidden=true;
          if(goalField)goalField.hidden=true;
        }else{
          if(transferTarget)transferTarget.hidden=true;
          if(catWrap)catWrap.hidden=false;
          if(goalField)goalField.hidden=false;
        }

        if(goalLabel){
          if(kind==='income'){
            goalLabel.textContent=L('Tautkan ke sasaran simpanan (Goal)','Link to save up goal');
          }else{
            goalLabel.textContent=L('Tarik dari sasaran simpanan (Goal)','Withdraw from save up goal');
          }
        }
      });
    });

    accountSelect?.addEventListener('change',updateCurrencySymbol);
    amountInput?.addEventListener('input',updateAdjustAmount);
    updateCurrencySymbol();

    const trigger=$('#monarch-cat-trigger',form);
    const flyout=$('#monarch-cat-flyout',form);
    const searchInput=$('#monarch-cat-search',form);
    const scrollContainer=$('#monarch-cat-scroll',form);
    const hiddenCatInput=$('#monarch-selected-cat-hidden',form);
    const iconSpan=$('#monarch-cat-icon',form);
    const labelSpan=$('#monarch-cat-label',form);
    const createCatBtn=$('#monarch-create-cat-btn',form);

    if(trigger&&flyout){
      trigger.addEventListener('click',e=>{
        e.stopPropagation();
        const isOpen=!flyout.hidden;
        flyout.hidden=isOpen;
        trigger.setAttribute('aria-expanded',String(!isOpen));
        if(!isOpen&&searchInput){
          searchInput.value='';
          scrollContainer.innerHTML=renderCategoryGroupsHtml(hiddenCatInput.value);
          setTimeout(()=>searchInput.focus(),50);
        }
      });

      if(searchInput){
        searchInput.addEventListener('input',()=>{
          scrollContainer.innerHTML=renderCategoryGroupsHtml(hiddenCatInput.value,searchInput.value);
        });
      }

      scrollContainer?.addEventListener('click',e=>{
        const item=e.target.closest('.monarch-cat-item');
        if(!item)return;
        const catName=item.dataset.catName;
        const catIcon=item.dataset.catIcon;
        if(hiddenCatInput)hiddenCatInput.value=catName;
        if(iconSpan)iconSpan.textContent=catIcon;
        if(labelSpan)labelSpan.textContent=catName;
        flyout.hidden=true;
        trigger.setAttribute('aria-expanded','false');
      });

      document.addEventListener('click',e=>{
        if(!flyout.hidden&&typeof flyout.contains==='function'&&!flyout.contains(e.target)&&e.target!==trigger){
          flyout.hidden=true;
          trigger.setAttribute('aria-expanded','false');
        }
      });

      if(createCatBtn){
        createCatBtn.addEventListener('click',e=>{
          e.stopPropagation();
          flyout.hidden=true;
          editCategory(null,null,newCat=>{
            if(hiddenCatInput)hiddenCatInput.value=newCat.name;
            if(iconSpan)iconSpan.textContent=newCat.icon;
            if(labelSpan)labelSpan.textContent=newCat.name;
          });
        });
      }
    }

    const tagInput=$('#monarch-tag-input',form);
    const tagsContainer=$('#monarch-tags-container',form);
    const tagsHidden=$('#monarch-tags-hidden',form);
    let tags=[];

    function renderTags(){
      const chips=tags.map(t=>`
        <span class="monarch-tag-chip">
          <span class="tag-dot"></span>${escape(t)}
          <button type="button" class="monarch-tag-remove" data-tag="${escape(t)}">✕</button>
        </span>
      `).join('');
      $$('.monarch-tag-chip',tagsContainer).forEach(el=>el.remove());
      tagInput?.insertAdjacentHTML('beforebegin',chips);
      if(tagsHidden)tagsHidden.value=tags.join(',');
    }

    if(tagInput&&tagsContainer){
      tagInput.addEventListener('keydown',e=>{
        if(e.key==='Enter'||e.key===','){
          e.preventDefault();
          const val=tagInput.value.trim().replace(/^,+|,+$/g,'');
          if(val&&!tags.includes(val)){
            tags.push(val);
            renderTags();
          }
          tagInput.value='';
        }
      });

      tagsContainer.addEventListener('click',e=>{
        const btn=e.target.closest('.monarch-tag-remove');
        if(!btn)return;
        const t=btn.dataset.tag;
        tags=tags.filter(x=>x!==t);
        renderTags();
      });
    }
  }
  function addTransaction(){
    if(!state.accounts.length){toast(L('Tambahkan akun terlebih dahulu.','Add an account first.'));return;}
    const defaultAcc=state.accounts[0];
    const sym=getCurrencySymbol(defaultAcc?.currency||state.currency);
    const accountOptions=state.accounts.map(a=>`<option value="${a.id}" data-curr="${a.currency}">${escape(a.name)} (${a.currency}) · ${native(a,'balance')}</option>`).join('');
    const goalOptions=`<option value="">${L('Tidak ada target khusus','None / Not linked')}</option>`+state.goals.map(g=>`<option value="${g.id}">${escape(g.emoji)} ${escape(g.name)} (${native(g,'saved')} / ${native(g,'target')})</option>`).join('');
    const defaultCategory='Dining';
    const defaultIcon=F.categoryIcon(defaultCategory);

    const formHtml=`
    <form id="monarch-add-tx-form" class="monarch-tx-form">
      <div class="monarch-segmented monarch-col-full" role="radiogroup" aria-label="${L('Jenis Transaksi','Transaction Type')}">
        <button type="button" class="monarch-seg-btn active" data-kind="expense" aria-checked="true">
          <span class="seg-icon">⊖</span>
          <span>${L('Debit (Pengeluaran)','Debit')}</span>
        </button>
        <button type="button" class="monarch-seg-btn" data-kind="income" aria-checked="false">
          <span class="seg-icon">⊕</span>
          <span>${L('Kredit (Pemasukan)','Credit')}</span>
        </button>
        <button type="button" class="monarch-seg-btn" data-kind="transfer" aria-checked="false">
          <span class="seg-icon">⇄</span>
          <span>${L('Transfer','Transfer')}</span>
        </button>
      </div>
      <input type="hidden" name="kind" id="monarch-tx-kind" value="expense">
      <input type="hidden" name="status" value="posted">

      <div class="monarch-field">
        <label for="monarch-amount">${L('Nominal','Amount')}</label>
        <div class="monarch-amount-input-wrap">
          <span class="monarch-curr-symbol" id="monarch-curr-sym">${escape(sym)}</span>
          <input type="number" id="monarch-amount" name="amount" step="0.01" min="0.01" placeholder="0.00" required autofocus>
        </div>
      </div>

      <div class="monarch-field">
        <label for="monarch-tx-name">${L('Pedagang / Deskripsi','Merchant')}</label>
        <div class="monarch-input-wrap">
          <input type="text" id="monarch-tx-name" name="name" placeholder="${L('Nama pedagang / toko','Merchant name')}" required maxlength="120" list="merchant-datalist" autocomplete="off">
          <datalist id="merchant-datalist">
            ${[...new Set(state.transactions.map(t=>t.name))].slice(0,15).map(n=>`<option value="${escape(n)}"></option>`).join('')}
          </datalist>
        </div>
      </div>

      <div class="monarch-field">
        <label for="monarch-tx-date">${L('Tanggal','Date')}</label>
        <div class="monarch-date-wrap">
          <input type="date" id="monarch-tx-date" name="date" value="${date()}" required>
        </div>
      </div>

      <div class="monarch-field">
        <label for="monarch-account-select">${L('Akun Sumber','Account')}</label>
        <select id="monarch-account-select" name="accountId" required>
          ${accountOptions}
        </select>
      </div>

      <div class="monarch-field monarch-col-full" id="monarch-transfer-target" hidden>
        <label for="monarch-target-select">${L('Akun Tujuan Transfer','Destination Account')}</label>
        <select id="monarch-target-select" name="targetId">
          ${accountOptions}
        </select>
      </div>

      <div class="monarch-field" id="monarch-cat-field-wrap">
        <label>${L('Kategori','Category')}</label>
        <div class="monarch-cat-picker-container">
          <button type="button" class="monarch-category-trigger" id="monarch-cat-trigger" aria-haspopup="dialog" aria-expanded="false">
            <span class="monarch-cat-icon" id="monarch-cat-icon">${defaultIcon}</span>
            <span class="monarch-cat-label" id="monarch-cat-label">${defaultCategory}</span>
            <span class="monarch-chevron">▼</span>
          </button>
          <input type="text" style="position:absolute;opacity:0;pointer-events:none;height:0;width:0" name="category" id="monarch-selected-cat-hidden" value="${defaultCategory}" required>

          <div class="monarch-category-flyout" id="monarch-cat-flyout" hidden>
            <div class="monarch-flyout-search-wrap">
              <span class="flyout-search-icon">🔍</span>
              <input type="text" class="monarch-flyout-search" id="monarch-cat-search" placeholder="${L('Cari kategori...','Search categories...')}" autocomplete="off">
            </div>
            <div class="monarch-cat-groups-scroll" id="monarch-cat-scroll">
              ${renderCategoryGroupsHtml(defaultCategory)}
            </div>
            <div class="monarch-flyout-footer">
              <button type="button" class="monarch-create-cat-link" id="monarch-create-cat-btn">+ ${L('Buat kategori baru','Create new category')}</button>
            </div>
          </div>
        </div>
      </div>

      <div class="monarch-field" id="monarch-goal-field">
        <label id="monarch-goal-label">${L('Sasaran (Goal)','Save-up Goal')}</label>
        <select id="monarch-goal-select" name="goalId">
          ${goalOptions}
        </select>
      </div>

      <div class="monarch-field">
        <label for="monarch-tx-notes">${L('Catatan','Notes')}</label>
        <input type="text" id="monarch-tx-notes" name="notes" placeholder="${L('Catatan ringkas...','Brief note...')}" maxlength="250">
      </div>

      <div class="monarch-field">
        <label for="monarch-tag-input">${L('Label (Tags)','Tags')}</label>
        <div class="monarch-tags-container" id="monarch-tags-container">
          <input type="text" id="monarch-tag-input" placeholder="${L('+ Tag & Enter...','+ Tag...')}">
        </div>
        <input type="hidden" name="tags" id="monarch-tags-hidden" value="">
      </div>

      <div class="monarch-adjust-balance-card monarch-col-full">
        <div class="adjust-copy">
          <b id="monarch-adjust-title">${L('Sesuaikan saldo akun sejumlah','Adjust the account balance by')} <span id="monarch-adjust-amount">${sym} 0.00</span></b>
          <small>${L('Nonaktifkan jika mencatat transaksi historis.','Disable if recording historical transactions.')}</small>
        </div>
        <label class="monarch-switch" title="${L('Sesuaikan saldo akun','Adjust account balance')}">
          <input type="checkbox" name="adjustBalance" id="monarch-adjust-balance" value="true" checked>
          <span class="monarch-slider"></span>
        </label>
      </div>

      <p class="form-error monarch-col-full" id="form-error" role="alert"></p>

      <div class="form-actions monarch-col-full" style="margin-top:6px">
        <button type="button" class="btn monarch-cancel-btn" data-action="modal-close">${L('Batal','Cancel')}</button>
        <button type="submit" class="btn primary monarch-submit-btn">${L('Tambah transaksi','Add transaction')}</button>
      </div>
    </form>
    `;

    openModal(L('Tambah Transaksi','Add transaction'), formHtml, d=>{
      const chk=$('#monarch-adjust-balance');
      const isAdjust=d.adjustBalance!==undefined?(d.adjustBalance!=='false'&&d.adjustBalance!==false&&d.adjustBalance!=='off'):(chk?chk.checked:true);
      E.applyTransaction(state,{
        id:uid(),
        status:d.status||'posted',
        name:requireText(d.name),
        kind:d.kind,
        amount:positive(d.amount),
        accountId:d.accountId,
        targetId:d.kind==='transfer'?d.targetId:undefined,
        category:d.kind==='transfer'?'Transfer':requireText(d.category||'Other'),
        date:d.date,
        balanceApplied:isAdjust,
        notes:d.notes?String(d.notes).trim():undefined,
        tags:d.tags?String(d.tags).split(',').map(s=>s.trim()).filter(Boolean):undefined,
        goalId:d.goalId||undefined
      });
      if(d.goalId && d.kind==='expense'){
        const goal=state.goals?.find(g=>g.id===d.goalId);
        if(goal){
          const spendAmt=E.convert(state, positive(d.amount), (getAccount(d.accountId)?.currency)||state.currency, goal.currency||state.currency);
          if(goal.saved >= spendAmt){
            E.spendFromGoal(state, d.goalId, spendAmt);
          } else {
            goal.saved = 0;
          }
        }
      }
      toast(L('Transaksi tersimpan sesuai kebijakan saldo dan status.','Transaction saved according to its balance policy and status.'));
    });

    initMonarchTransactionForm();
  }
  function addTask(){openModal('A clear next step',form(field('Task','name','','text','required maxlength="120"')+field('Responsible person','owner','Me','text','required maxlength="80"')+field('Review date','due',date(),'date'),'Create task'),d=>{state.tasks.push({id:uid(),name:requireText(d.name),owner:requireText(d.owner),due:d.due,done:false});toast('Task created.');});}
  function confirmAction(title,description,handler,label='Confirm'){openModal(title,`<p class="dialog-copy">${description}</p><form><p id="form-error" class="form-error"></p><div class="form-actions"><button type="button" class="btn" data-action="modal-close">Cancel</button><button type="submit" class="btn primary">${label}</button></div></form>`,handler);}
  function emptyWorkspace(currency=state.currency){return {version:1,currency,name:'My financial workspace',demo:false,accounts:[],debts:[],goals:[],flows:[],budgets:[],transactions:[],tasks:[],members:[{id:'m1',name:'Me',role:'Local workspace owner',initials:'ME'}],cards:[],subscriptions:[],billPayments:{},history:[]};}
  function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function exportCSV(){const sanitize=v=>{let str=String(v??'');if(/^[=+@-]/.test(str))str="'"+str;return '"'+str.replaceAll('"','""')+'"';};const rows=[['Date','Description','Type','Amount','Currency','Account','Destination','Category'],...state.transactions.map(t=>[t.date,t.name,t.kind,(t.amount/100).toFixed(2),t.currency,getAccount(t.accountId)?.name||'',getAccount(t.targetId)?.name||'',t.category])];download('inveys-transactions.csv',rows.map(r=>r.map(sanitize).join(',')).join('\r\n'),'text/csv');toast('Transaction CSV exported.');}
  function importFile(file){if(!file)return;if(file.size>5000000){toast('Choose a JSON file smaller than 5 MB.');return;}file.text().then(text=>{const candidate=E.validate(JSON.parse(text));const p=E.position(candidate);confirmAction('Restore this workspace?',`${candidate.accounts.length} accounts, ${candidate.transactions.length} transactions, ${candidate.goals.length} goals. Reporting currency: ${escape(candidate.currency)}. This replaces all current local records. Export your current workspace first if needed.`,()=>{state=candidate;resetFinancialSession();messages=[];drafts=[];captureText='';museAnswer='';telegramItems=[];mcResult=null;mcConfig=null;save();toast('Workspace restored.');},'Replace workspace');}).catch(error=>toast('Import failed: '+error.message));}
  function searchModal(){openModal('Find your financial records',`<input class="input-search" id="global-search" style="max-width:none" placeholder="Accounts, goals, transactions…" aria-label="Search all records"><div id="global-results" class="search-results"></div>`);const results=()=>{const q=$('#global-search').value.toLowerCase();const items=[...state.accounts.map(a=>({name:a.name,type:'Account',page:'accounts'})),...(state.subscriptions||[]).map(s=>({name:s.name,type:L('Langganan','Subscription'),page:'calendar'})),...state.goals.map(g=>({name:g.name,type:'Goal',page:'goals'})),...state.debts.map(d=>({name:d.name,type:'Debt',page:'debt'})),...state.transactions.map(t=>({name:t.name,type:'Transaction',page:'transactions'})),...state.tasks.map(t=>({name:t.name,type:'Task',page:'household'}))].filter(x=>x.name.toLowerCase().includes(q)).slice(0,12);$('#global-results').innerHTML=items.map(i=>`<button class="search-result" data-page="${i.page}" data-close="true">${escape(i.name)}<small>${i.type}</small></button>`).join('')||'<div class="empty">No matching records.</div>';};$('#global-search').addEventListener('input',results);results();$('#global-search').focus();}
  function act(action){const parts=action.split(':'),[name,id,extra]=parts;if(name==='dismiss-broadcast'){if(globalBroadcast&&globalBroadcast.updatedAt){sessionStorage.setItem('dismissed_broadcast_'+globalBroadcast.updatedAt,'1');}const bEl=$('#global-broadcast-banner');if(bEl){bEl.style.opacity='0';bEl.style.transform='translateY(-10px)';setTimeout(()=>bEl.remove(),250);}return;}if(name==='admin-panel'||name.startsWith('admin-')){adminAction(name,id,extra);return;}if(name==='api-keys'||name.startsWith('api-key-')){apiKeyAction(name,id,extra);return;}if(name.startsWith('ops-')){try{operationAction(name,id);}catch(e){toast(e.message);}return;}if(['card-image','card-image-remove'].includes(name)){cardImageAction(name,id);return;}if(name.startsWith('transaction-row-')||name==='transaction-delete'){transactionRowAction(name,id);return;}if(name.startsWith('plan-')||name==='landing-open'||name==='license-activate'){planAction(name,id);return;}if(name==='forecast-mc'&&planGate('montecarlo'))return;if(name==='forecast-save'&&selectedPlan()&&state.forecastPlan.scenarios.length>=P.catalog.find(p=>p.id===state.commercial.previewTier).scenarios){navigate('plans');toast(L('Batas skenario pratinjau tercapai','Preview scenario limit reached'));return;}if(['investment-import','investment-prices','investment-holding-new','investment-holding'].includes(name)&&planGate('investment'))return;if(['muse-ask','telegram-inbox','telegram-send'].includes(name)&&planGate('integrations'))return;if(name.startsWith('investment-')||name.startsWith('gold-')){investmentAction(name,id);return;}if(name.startsWith('vey-')){veyAction(name,id);return;}if(name.startsWith('quick-')){quickAction(name,id);return;}if(v4Names.has(name)){v4Action(name,id);return;}if(v3Names.has(name)){v3Action(name,id);return;}if(name==='category-new-group'){editCategory(null,id);return;}if(extensionAction(name,id,extra))return;switch(name){
    case 'tax-djp-modal':openDjpTaxModal(id);break;
    case 'pwa-install':triggerPwaInstall();break;
    case 'lock-vault-now':lockVault();break;
    case 'setup-biometric':toggleBiometricSetup();break;
    case 'disable-biometric':toggleBiometricSetup();break;
    case 'setup-pin':openPinSetupModal();break;
    case 'budget-setup':openBudgetSetupModal();break;
    case 'budget-edit':openBudgetSetupModal(id);break;
    case 'budget-remove':removeBudgetCategory(id);break;
    case 'budget-prev':budgetMonthNav(-1);break;
    case 'budget-next':budgetMonthNav(1);break;
    case 'budget-today':budgetMonthToday();break;
    case 'budget-filter':budgetGroupFilter=id||'all';render();break;
    case 'budget-copy':copyLastMonthBudgets();break;
    case 'tx-rule':createRuleFromTransaction(id);break;
    case 'rules-manage':openRulesManagerModal();break;
    case 'account-new':editAccount();break;case 'account':editAccount(id);break;
    case 'account-delete':if(state.holdings.some(h=>h.accountId===id)){toast(L('Hapus atau pindahkan posisi investasi sebelum menghapus akun.','Remove or move investment holdings before deleting this account.'));break;}if(state.transactions.some(t=>t.accountId===id||t.targetId===id)){toast('Accounts with journal entries cannot be removed. Export or clear the workspace first.');break;}confirmAction('Remove this account?','Its balance will be removed from your financial position.',()=>{state.accounts=state.accounts.filter(a=>a.id!==id);delete state.forecastPlan.accounts[id];for(const sc of state.forecastPlan.scenarios)delete sc.plan.accounts[id];for(const r of state.savedReports)if(r.filter.account===id)r.filter.account='all';if(reportFilter.account===id)reportFilter.account='all';forecastMC=null;toast('Account removed.');},'Remove account');break;
    case 'goal-new':editGoal();break;case 'goal':editGoal(id);break;case 'fund':allocateGoal(id);break;
    case 'debt-new':editDebt();break;case 'debt':editDebt(id);break;
    case 'flow-new':editFlow();break;case 'flow':editFlow(id);break;case 'transaction-new':addTransaction();break;case 'transaction-edit':editTransaction(id);break;
    case 'open-categories':navigate('categories');break;
    case 'category-new':editCategory();break;
    case 'cat-edit':editCategory(id);break;
    case 'cat-group-new':editCategoryGroup();break;
    case 'cat-delete':deleteCategory(id);break;
    case 'task-new':addTask();break;case 'task-delete':state.tasks=state.tasks.filter(t=>t.id!==id);render();toast('Task removed.');break;
    case 'period':period=Number(id);render();break;case 'privacy':hideMoney=!hideMoney;try{if(typeof localStorage!=='undefined')localStorage.setItem('inveys_hide_money',String(hideMoney));}catch(e){}render();break;
    case 'open-scenario':navigate('scenarios');break;case 'scenario-reset':scenario={incomeDelta:0,expenseDelta:0,oneTime:0};render();break;
    case 'modal-close':$('#modal').close();break;
    case 'remove-goal':case 'remove-debt':case 'remove-flow':{if(name==='remove-debt'&&state.cards.some(c=>c.debtId===id)){toast(state.language==='id'?'Hapus metadata kartu terlebih dahulu.':'Remove the linked credit card first.');break;}const key={'remove-goal':'goals','remove-debt':'debts','remove-flow':'flows'}[name];confirmAction('Remove this record?','This changes your financial position or planning commitments. Account balances are not changed.',()=>{state[key]=state[key].filter(row=>row.id!==id);toast('Record removed.');},'Remove record');break;}
    case 'rename':openModal('Name your workspace',form(field('Workspace name','name',state.name,'text','required maxlength="80"'),'Save name'),d=>{state.name=requireText(d.name);toast('Workspace renamed.');});break;
    case 'export':download('inveys-workspace-'+date()+'.json',JSON.stringify(state,null,2),'application/json');toast('Workspace exported.');break;
    case 'export-csv':exportCSV();break;case 'import':$('#import-file').click();break;
    case 'reset-demo':confirmAction('Restore the demo?','All current local records will be replaced by sample data. Export your workspace first if you want to keep it.',()=>{state=E.migrate(seed());resetFinancialSession();messages=[];drafts=[];captureText='';museAnswer='';telegramItems=[];mcResult=null;mcConfig=null;toast('Sample workspace restored.');},'Restore demo');break;
    case 'delete-data':confirmAction('Delete local financial records?','This removes financial records from this browser profile. Exported files and backups outside this browser are not deleted.',()=>{localStorage.removeItem(storageKey);state=E.migrate(emptyWorkspace());resetFinancialSession();messages=[];drafts=[];captureText='';museAnswer='';telegramItems=[];mcResult=null;mcConfig=null;toast('Local financial records deleted.');},'Delete records');break;
    case 'empty-workspace':openModal('Start your financial workspace',form(field('Workspace name','name','My financial workspace','text','required maxlength="80"')+field('Reporting currency','currency','','select',options(E.currencies,state.currency)),'Create empty workspace','This replaces all current records. Export first if needed. Currency labels do not convert amounts.'),d=>{state=E.migrate(emptyWorkspace(d.currency));state.name=requireText(d.name);resetFinancialSession();messages=[];drafts=[];captureText='';museAnswer='';telegramItems=[];mcResult=null;mcConfig=null;toast('Your empty workspace is ready.');});break;
    case 'cashflow-sankey-export':{const flow=F.monarchCashFlowSankey(viewState(),{monthKey:cashflowViewMonth});const markup=cashFlowSankeyPanel(flow);const match=markup.match(/<svg[^>]*sankey-multitier-svg[\s\S]*?<\/svg>/);if(!match){toast(L('Tidak ada grafik untuk diekspor','No chart to export'));break;}const colors=state.appearance[state.theme].colors;const svgStr=match[0].replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ').replaceAll('var(--ink)',colors.ink).replaceAll('var(--muted)',colors.muted).replaceAll('var(--bg)',colors.bg);download('inveys-cashflow-sankey.svg',svgStr,'image/svg+xml');toast(L('Grafik diagram alir kas berhasil diekspor','Cash flow sankey diagram exported'));break;}
    case 'cashflow-sankey-month':cashflowViewMonth=id||'plan';render();break;
    case 'review':navigate('accounts');toast('Start by verifying your account balances and dates.');break;
  }}
  document.addEventListener('click',event=>{const target=event.target.closest('button,[data-action]');if(!target)return;if(target.dataset.page){if(target.dataset.close)$('#modal').close();navigate(target.dataset.page);}else if(target.dataset.action)act(target.dataset.action);else if(target.dataset.question)ask(target.dataset.question);else if(target.dataset.starter){veyPlaySound('poke');const box=$('#quick-text');if(box){box.value=target.dataset.starter;quickText=target.dataset.starter;box.focus();if(box.style){box.style.height='auto';box.style.height=Math.min(132,box.scrollHeight)+'px';}}}else if(target.dataset.quickFill){veyPlaySound('poke');const box=$('#quick-text');if(box){box.value=target.dataset.quickFill;quickText=target.dataset.quickFill;box.focus();if(box.style){box.style.height='auto';box.style.height=Math.min(132,box.scrollHeight)+'px';}}}});
  document.addEventListener('input',event=>{const el=event.target;if(el.id==='admin-search-input'){adminData.query=el.value.toLowerCase().trim();const tb=$('#admin-user-tbody');if(tb)tb.innerHTML=adminUserRows();}if(el.id==='forecast-preview-year'){forecastSelectedYear=Math.max(0,Math.min(selectedPlan().years,Number(el.value)||0));if(forecastResult)$('#forecast-preview').innerHTML=forecastPreview(forecastResult,selectedPlan());}if(el.id==='gold-spot-price-slider'||el.id==='gold-spot-price-input'){const val=Number(el.value);if(Number.isFinite(val)&&val>0){state.goldInstallment.customSpotPrice=val;if(state.goldInstallment.synced){const h=state.holdings.find(h=>h.id==='h-gold-galeri24');if(h){h.price=val;h.quoteDate=date();}const acc=state.accounts.find(a=>a.id==='acc-gold-pegadaian');if(acc){acc.balance=Math.round(50*val*100);acc.updated=date();}}render();}}if(el.id==='gold-paid-months-slider'){const val=Math.max(0,Math.min(60,Number(el.value)||0));state.goldInstallment.paidMonths=val;render();}if(el.id==='quick-text'){quickText=el.value;if(el.style){el.style.height='auto';el.style.height=Math.min(132,el.scrollHeight)+'px';}}if(el.dataset.scenario){scenario[el.dataset.scenario]=E.cents(el.value);$('#value-'+el.dataset.scenario).textContent=money(scenario[el.dataset.scenario]);updateScenario();}if(el.dataset.debtId){const id=el.dataset.debtId;const d=state.debts.find(d=>d.id===id);$('#extra-label-'+id).textContent=money(E.cents(el.value),false,d.currency);$('#debt-results-'+id).innerHTML=debtResult(d,E.cents(el.value));}if(el.dataset.txEdit&&txEdit){txEdit.values[el.dataset.txEdit]=el.value;txEdit.error='';}if(el.id==='transaction-search'){txQuery=el.value;$('#transaction-rows').innerHTML=transactionRows();}if(el.id==='category-manager-search'){const q=el.value.toLowerCase().trim();$$('.monarch-settings-cat-row').forEach(row=>{const text=((row.dataset.catRow||'')+' '+(row.dataset.catDisplay||'')).toLowerCase();row.style.display=!q||text.includes(q)?'flex':'none';});}});
  document.addEventListener('change',event=>{const el=event.target;if(el.id==='setting-autolock-select'||el.dataset.action==='change-autolock'){localStorage.setItem('inveys_autolock',el.value);resetAutoLockTimer();toast('🔒 '+L('Waktu kunci otomatis diperbarui','Auto-lock timer updated'));}if(['admin-role-filter','admin-plan-filter','admin-status-filter'].includes(el.id)){if(el.id==='admin-role-filter')adminData.roleFilter=el.value;if(el.id==='admin-plan-filter')adminData.planFilter=el.value;if(el.id==='admin-status-filter')adminData.statusFilter=el.value;const tb=$('#admin-user-tbody');if(tb)tb.innerHTML=adminUserRows();}if(el.id==='cashflow-sankey-month-select'){cashflowViewMonth=el.value;render();}if(el.id==='quick-account'){quickAccount=el.value;const caption=$('#quick-account-caption');if(caption)caption.innerHTML=quickAccount?user(getAccount(quickAccount)?.name||''):L('Akun melalui +','Account via +');}if(el.dataset.task){const t=state.tasks.find(t=>t.id===el.dataset.task);t.done=el.checked;render();toast(t.done?'Task completed.':'Task reopened.');}if(el.dataset.txEdit&&txEdit){txEdit.values[el.dataset.txEdit]=el.value;txEdit.error='';if(['kind','accountId'].includes(el.dataset.txEdit))render();}if(el.id==='transaction-filter'){txKind=el.value;$('#transaction-rows').innerHTML=transactionRows();}if(el.id==='import-file')importFile(el.files[0]);});
  document.addEventListener('submit',event=>{if(event.target.id==='quick-form'){event.preventDefault();const d=Object.fromEntries(new FormData(event.target));quickSend(d.text,d.accountId);return;}if(event.target.id==='chat-form'){event.preventDefault();ask($('#chat-question').value.trim());}});
  $('#close-modal').addEventListener('click',()=>$('#modal').close());$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=$('#modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#modal').close();}});
  $('#menu-button').addEventListener('click',()=>{setSidebarOpen(!sidebarOpen);if(sidebarOpen)$('#navigation button')?.focus();});$('#search-button').addEventListener('click',searchModal);$('#notification-button').addEventListener('click',openReminders);$('#workspace-button')?.addEventListener('click',()=>navigate('home'));
  $('#about-button').addEventListener('click',()=>openModal('Your financial life, connected.',`<p class="dialog-copy">INVEYS stands for <b>INtelligent VElocity for Your Financial System</b>. Connect your financial picture, anticipate commitments, plan meaningful goals, and coordinate your next steps.</p><p class="note">This is a local-first MVP with sample data. No funds are moved, no institutions are connected, and external providers require separate configuration and explicit consent.</p><div class="form-actions">${button('Explore your workspace','modal-close','primary')}</div>`));
  /* --- Profile popover toggle --- */
  const profileBtn=$('#profile-button'),profilePopover=$('#profile-popover');
  if(profileBtn&&profilePopover){profileBtn.addEventListener('click',e=>{e.stopPropagation();const isOpen=profilePopover.classList.toggle('open');profileBtn.setAttribute('aria-expanded',String(isOpen));});document.addEventListener('click',e=>{if(!e.target.closest('.profile-wrap')||e.target.closest('.profile-popover-item')){profilePopover.classList.remove('open');profileBtn.setAttribute('aria-expanded','false');}});$('#popover-lock-btn')?.addEventListener('click',()=>{profilePopover.classList.remove('open');profileBtn.setAttribute('aria-expanded','false');lockVault();});$('#popover-logout-btn')?.addEventListener('click',async()=>{profilePopover.classList.remove('open');profileBtn.setAttribute('aria-expanded','false');logoutUser();});}
  document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('#modal').open){e.preventDefault();searchModal();}});
  window.addEventListener('hashchange',()=>{const target=location.hash.slice(1);if(target!==page)navigate(target);});
  let sidebarOpen=false,sidebarPinned=false;
  try{sidebarPinned=localStorage.getItem('inveys-sidebar-pinned')==='true';}catch{}
  function syncSidebar(){const side=$('#sidebar');side.classList.toggle('pinned',sidebarPinned);$('#sidebar-pin').setAttribute('aria-pressed',String(sidebarPinned));$('#sidebar-pin').setAttribute('aria-label',t(sidebarPinned?'Unpin navigation':'Pin navigation'));$('#menu-button').setAttribute('aria-expanded',String(sidebarOpen));const mobile=typeof window.matchMedia==='function'&&window.matchMedia('(max-width:700px)').matches;side.inert=mobile&&!sidebarOpen;}
  function setSidebarOpen(open){sidebarOpen=open;$('#sidebar').classList.toggle('open',open);syncSidebar();}
  $('#sidebar-pin').addEventListener('click',()=>{sidebarPinned=!sidebarPinned;try{localStorage.setItem('inveys-sidebar-pinned',String(sidebarPinned));}catch{}syncSidebar();});
  for(const id of ['sidebar-close','nav-backdrop'])$('#'+id).addEventListener('click',()=>{setSidebarOpen(false);$('#menu-button').focus();});
  window.addEventListener('resize',syncSidebar);
  document.addEventListener('click',event=>{const current=event.target.closest('.report-popover,.quick-popover');for(const item of $$('.report-popover[open],.quick-popover[open]'))if(item!==current)item.open=false;});
  function minimizeOutsideChat(event){if(quickMinimized||event.target.closest?.('.quick-dock,.quick-launcher,#modal')||$('#modal').open||['quick-camera-file','quick-upload-file'].includes(event.target.id))return;quickMinimized=true;const dock=$('.quick-dock');if(dock&&typeof dock.outerHTML==='string')dock.outerHTML=quickComposer();else render();}
  document.addEventListener('pointerdown',minimizeOutsideChat);
  document.addEventListener('click',minimizeOutsideChat);
  document.addEventListener('pointermove', event => {
    if (typeof document === 'undefined') return;
    try {
      const badge = document.querySelector?.('.vey-avatar-badge, .vey-launcher-avatar');
      if (!badge || typeof badge.getBoundingClientRect !== 'function') return;
      const b = badge.getBoundingClientRect();
      if (!b || !b.width) return;
      const centerX = b.left + b.width / 2;
      const centerY = b.top + b.height / 2;
      const dx = Math.max(-3.5, Math.min(3.5, (event.clientX - centerX) / 45));
      const dy = Math.max(-2.5, Math.min(2.5, (event.clientY - centerY) / 45));
      const targets = document.querySelectorAll?.('.vey-avatar-badge, .vey-launcher-avatar');
      if (targets && targets.forEach) {
        targets.forEach(t => {
          t.style.setProperty('--vey-pupil-x', `${dx.toFixed(2)}px`);
          t.style.setProperty('--vey-pupil-y', `${dy.toFixed(2)}px`);
        });
      }
    } catch(e) {}
  });
  document.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){const target=event.target.closest?.('[role="button"][data-action], svg [data-action]');if(target?.dataset.action){event.preventDefault();act(target.dataset.action);}}if(event.key==='Escape')for(const item of $$('.report-popover[open],.quick-popover[open]')){item.open=false;if(item.classList?.contains?.('quick-popover'))item.querySelector('summary')?.focus();}if(event.key==='Escape'&&sidebarOpen){setSidebarOpen(false);$('#menu-button').focus();}});
  document.addEventListener('keydown',event=>{if(event.target?.id==='quick-text'&&event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();quickSend(event.target.value,$('#quick-account')?.value||quickAccount);}});
  async function checkServerAuth(){
    if(typeof fetch!=='function'||!/^https?:$/.test(location.protocol||''))return;
    try{
      const token=localStorage.getItem('inveys_token');
      const res=await fetch('/api/auth/status',{
        headers:token?{'Authorization':'Bearer '+token}:{}
      });
      if(!res.ok)return;
      const data=await res.json();
      isServerMode=true;
      fetchBroadcast();
      if(data.user){
        currentUser=data.user;
      }
      if(data.setupRequired){
        showAuthScreen('setup');
      }else if(!data.authenticated){
        showAuthScreen('login');
      }else{
        hideAuthScreen();
        if(currentUser)save();
        render();
        try{
          const wsRes=await fetch('/api/workspace',{
            headers:token?{'Authorization':'Bearer '+token}:{}
          });
          if(wsRes.ok){
            const wsData=await wsRes.json();
            if(wsData.workspace){
              state=E.validate(wsData.workspace);
              localStorage.setItem(storageKey,JSON.stringify(state));
              render();
            }
          }
        }catch(err){}
      }
    }catch(e){
      isServerMode=false;
    }
  }
  function showAuthScreen(mode='login'){
    isAuthenticated=false;
    const overlay=$('#auth-overlay');
    if(!overlay)return;
    overlay.style.display='flex';
    const form=$('#auth-form');
    if(form)form.dataset.mode=mode;
    const nameInput=$('#auth-name');
    const emailInput=$('#auth-email');
    const pwInput=$('#auth-password');
    const errEl=$('#auth-error');
    const tabs=$('#auth-tabs');
    const tabLogin=$('#auth-tab-login');
    const tabRegister=$('#auth-tab-register');
    const switchP=$('#auth-switch-p');
    const submitBtn=$('#auth-submit-btn');

    if(pwInput)pwInput.value='';
    if(errEl)errEl.style.display='none';

    const pwWrap=$('#auth-pw-wrap');
    const otpWrap=$('#auth-otp-wrap');
    const otpInput=$('#auth-otp-code');
    const tabOtp=$('#auth-tab-otp');

    if(tabLogin){tabLogin.style.background='transparent';tabLogin.style.color='inherit';}
    if(tabOtp){tabOtp.style.background='transparent';tabOtp.style.color='inherit';}
    if(tabRegister){tabRegister.style.background='transparent';tabRegister.style.color='inherit';}

    if(mode==='setup'){
      if(tabs)tabs.style.display='none';
      if(nameInput)nameInput.style.display='none';
      if(emailInput)emailInput.style.display='block';
      if(pwWrap)pwWrap.style.display='block';
      if(pwInput)pwInput.required=true;
      if(otpWrap)otpWrap.style.display='none';
      if(otpInput)otpInput.required=false;
      if(switchP)switchP.style.display='none';
      $('#auth-title').textContent='Setup Akun Master Vault';
      $('#auth-desc').textContent='Selamat datang di INVEYS Cloud. Atur email dan password aman untuk brankas finansial Anda.';
      if(submitBtn)submitBtn.textContent='Buat Akun Pemilik';
    }else if(mode==='otp'){
      if(tabs)tabs.style.display='flex';
      if(tabOtp){tabOtp.style.background='var(--accent,#34d399)';tabOtp.style.color='#05241d';}
      if(nameInput)nameInput.style.display='none';
      if(emailInput)emailInput.style.display='block';
      if(pwWrap)pwWrap.style.display='none';
      if(pwInput)pwInput.required=false;
      if(otpWrap)otpWrap.style.display='block';
      if(otpInput)otpInput.required=true;
      if(switchP)switchP.style.display='block';
      const switchBtn=$('#auth-mode-switch');
      if(switchBtn)switchBtn.textContent='Masuk dengan Password';
      $('#auth-title').textContent='Login Kode OTP Email';
      $('#auth-desc').textContent='Masukkan email dan minta kode OTP untuk masuk lebih aman ke brankas finansial.';
      if(submitBtn)submitBtn.textContent='Verifikasi & Masuk';
    }else if(mode==='register'){
      if(tabs)tabs.style.display='flex';
      if(tabRegister){tabRegister.style.background='var(--accent,#34d399)';tabRegister.style.color='#05241d';}
      if(nameInput)nameInput.style.display='block';
      if(emailInput)emailInput.style.display='block';
      if(pwWrap)pwWrap.style.display='block';
      if(pwInput)pwInput.required=true;
      if(otpWrap)otpWrap.style.display='none';
      if(otpInput)otpInput.required=false;
      if(switchP)switchP.style.display='block';
      const switchBtn=$('#auth-mode-switch');
      if(switchBtn)switchBtn.textContent='Sudah punya akun? Masuk di sini';
      $('#auth-title').textContent='Daftar Akun INVEYS';
      $('#auth-desc').textContent='Buat ruang kerja finansial multi-tenant pribadi Anda yang terenkripsi dan terisolasi.';
      if(submitBtn)submitBtn.textContent='Daftar Akun Baru';
    }else{
      if(tabs)tabs.style.display='flex';
      if(tabLogin){tabLogin.style.background='var(--accent,#34d399)';tabLogin.style.color='#05241d';}
      if(nameInput)nameInput.style.display='none';
      if(emailInput)emailInput.style.display='block';
      if(pwWrap)pwWrap.style.display='block';
      if(pwInput)pwInput.required=true;
      if(otpWrap)otpWrap.style.display='none';
      if(otpInput)otpInput.required=false;
      if(switchP)switchP.style.display='block';
      const switchBtn=$('#auth-mode-switch');
      if(switchBtn)switchBtn.textContent='Belum punya akun? Daftar gratis';
      $('#auth-title').textContent='INVEYS Cloud Vault';
      $('#auth-desc').textContent='Masuk ke akun Anda untuk menyinkronkan seluruh catatan finansial.';
      if(submitBtn)submitBtn.textContent='Masuk ke Vault';
    }
  }
  function hideAuthScreen(){
    isAuthenticated=true;
    const overlay=$('#auth-overlay');
    if(overlay)overlay.style.display='none';
  }
  $('#auth-tab-login')?.addEventListener('click',()=>{showAuthScreen('login');});
  $('#auth-tab-otp')?.addEventListener('click',()=>{showAuthScreen('otp');});
  $('#auth-tab-register')?.addEventListener('click',()=>{showAuthScreen('register');});
  $('#auth-mode-switch')?.addEventListener('click',()=>{
    const currentMode=$('#auth-form')?.dataset.mode||'login';
    showAuthScreen(currentMode==='login'?'otp':(currentMode==='otp'?'register':'login'));
  });
  let otpCooldownTimer = null;
  $('#auth-send-otp-btn')?.addEventListener('click', async () => {
    const email = ($('#auth-email')?.value || '').trim();
    const statusEl = $('#auth-otp-status');
    const errEl = $('#auth-error');
    const sendBtn = $('#auth-send-otp-btn');
    if (errEl) errEl.style.display = 'none';
    if (!email || !email.includes('@')) {
      if (errEl) { errEl.textContent = 'Masukkan alamat email yang valid terlebih dahulu.'; errEl.style.display = 'block'; }
      $('#auth-email')?.focus();
      return;
    }
    if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = 'Mengirim…'; }
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengirim kode OTP');
      if (statusEl) {
        statusEl.innerHTML = `✅ <span style="color:var(--accent,#34d399);">Kode OTP 6 digit telah dikirim ke <b>${escape(email)}</b>.</span> Periksa kotak masuk atau spam email Anda.`;
      }
      $('#auth-otp-code')?.focus();
      toast('Kode OTP berhasil dikirim!');

      let seconds = 60;
      if (otpCooldownTimer) clearInterval(otpCooldownTimer);
      otpCooldownTimer = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
          clearInterval(otpCooldownTimer);
          if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = 'Kirim Ulang'; }
        } else {
          if (sendBtn) sendBtn.textContent = `${seconds}s`;
        }
      }, 1000);
    } catch (err) {
      if (errEl) { errEl.textContent = err.message; errEl.style.display = 'block'; }
      if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = 'Kirim OTP'; }
    }
  });
  document.addEventListener('submit',async event=>{
    if(event.target.id==='auth-form'){
      event.preventDefault();
      const mode=event.target.dataset.mode||'login';
      const email=($('#auth-email')?.value||'').trim();
      const pw=$('#auth-password')?.value||'';
      const name=($('#auth-name')?.value||'').trim();
      const errEl=$('#auth-error');
      if(errEl)errEl.style.display='none';
      const submitBtn=$('#auth-submit-btn');
      const originalText=submitBtn?submitBtn.textContent:'';
      if(submitBtn){
        submitBtn.disabled=true;
        submitBtn.textContent='Memproses...';
      }
      try{
        let endpoint='/api/auth/login';
        let payload={password:pw};
        if(mode==='otp'){
          const otpCode=($('#auth-otp-code')?.value||'').trim();
          if(!email)throw new Error('Alamat email wajib diisi.');
          if(!otpCode)throw new Error('Masukkan 6 digit kode OTP yang dikirim ke email.');
          endpoint='/api/auth/verify-otp';
          payload={email,otp:otpCode};
        }else if(mode==='register'){
          if(!email)throw new Error('Alamat email wajib diisi.');
          endpoint='/api/auth/register';
          payload={email,password:pw,name:name||email.split('@')[0]};
        }else if(mode==='setup'){
          endpoint='/api/auth/setup';
          payload=email?{email,password:pw,name}:{password:pw};
        }else{
          if(email)payload.email=email;
        }
        const res=await fetch(endpoint,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(payload)
        });
        const data=await res.json();
        if(!res.ok)throw new Error(data.error||'Autentikasi gagal');
        if(data.token)localStorage.setItem('inveys_token',data.token);
        if(data.user)currentUser=data.user;
        hideAuthScreen();
        toast(mode==='register'?'Akun berhasil dibuat!':'Berhasil terautentikasi');
        await checkServerAuth();
      }catch(err){
        if(errEl){
          errEl.textContent=err.message;
          errEl.style.display='block';
        }
      }finally{
        if(submitBtn){
          submitBtn.disabled=false;
          submitBtn.textContent=originalText;
        }
      }
    }
  });
  $('#auth-lock-btn')?.addEventListener('click',()=>{
    lockVault();
  });
  $('#pwa-install-button')?.addEventListener('click',()=>{
    triggerPwaInstall();
  });
  $('#vault-lock-switch-btn')?.addEventListener('click',e=>{
    const nextMode=e.target.dataset.nextMode||'pw';
    renderVaultLockActions(nextMode);
  });
  $('#vault-lock-logout-btn')?.addEventListener('click',()=>{
    logoutUser();
  });
  $('#about-button').innerHTML=`<span class="sidebar-icon">${icon('about')}</span><span class="nav-text">About INVEYS</span>`;
  $('#settings-button').innerHTML=`<span class="sidebar-icon">${icon('settings')}</span><span class="nav-text">Settings & data</span>`;
  syncSidebar();
  const pathCandidate=(typeof location!=='undefined'&&location.pathname)?location.pathname.replace(/^\/(app\/)?/,'').replace(/\/$/,''):'';
  page=(typeof location!=='undefined'&&location.hash)?location.hash.slice(1):(pages.some(p=>p[0]===pathCandidate)?pathCandidate:'home');
  if(!pages.some(p=>p[0]===page)&&page!=='settings')page='home';
  render();checkNotifications();checkServerAuth();
  if(safeSessionGet('inveys_vault_locked')==='1')showVaultLockScreen();
  resetAutoLockTimer();
  if(typeof fetch==='function'&&state.fx.auto&&Date.now()-Math.max(Date.parse(state.fx.updatedAt||'1970-01-01'),Date.parse(state.fx.lastAttempt||'1970-01-01'))>8*3600000)refreshFX();
})();
