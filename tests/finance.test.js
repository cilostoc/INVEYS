const {test}=require('node:test');const assert=require('node:assert/strict');const E=require('../src/engine');const F=require('../src/finance');
function workspace(){return E.validate({version:1,currency:'USD',name:'Test household',demo:false,accounts:[{id:'a1',name:'Alex Cash',type:'Checking',balance:1000000,owner:'Alex',updated:'2026-10-03',currency:'USD'},{id:'a2',name:'Sam Investments',type:'Investment',balance:500000,owner:'Sam',updated:'2026-10-03',currency:'USD'},{id:'a3',name:'Joint Cash',type:'Savings',balance:200000,owner:'Household',updated:'2026-10-03',currency:'USD'}],debts:[{id:'d1',name:'Loan',balance:200000,minimum:20000,apr:0,currency:'USD'}],goals:[],flows:[{id:'f1',name:'Alex salary',ownerId:'m1',kind:'income',amount:100000,day:1,currency:'USD'},{id:'f2',name:'Sam salary',ownerId:'m2',kind:'income',amount:200000,day:1,currency:'USD'},{id:'f3',name:'Household costs',kind:'expense',amount:150000,day:5,currency:'USD'}],transactions:[{id:'t1',name:'Salary',kind:'income',amount:100000,accountId:'a1',date:'2026-10-03',category:'Income',currency:'USD'},{id:'t2',name:'Groceries',kind:'expense',amount:10000,accountId:'a3',date:'2026-10-03',category:'Food',currency:'USD'},{id:'t3',name:'Transfer',kind:'transfer',amount:50000,accountId:'a1',targetId:'a2',date:'2026-10-03',category:'Transfer',currency:'USD'}],tasks:[],members:[{id:'m1',name:'Alex Test',role:'Owner',initials:'AT'},{id:'m2',name:'Sam Test',role:'Member',initials:'ST'}],cards:[]});}
function flat(){const s=workspace();s.flows=[];s.debts=[];Object.assign(s.forecastPlan,{years:1,inflation:0,incomeGrowth:0,expenseGrowth:0,investmentGrowth:0,cashGrowth:0,propertyGrowth:0,volatility:0});return s;}
const projection=(s,c=s.forecastPlan,options={})=>F.forecast(s,c,{start:'2026-10-03',...options});const filter=(s,overrides={})=>({...F.defaultFilter('2026-10-03'),...overrides});const event=(overrides={})=>({id:'event1',name:'Event',type:'expenseOnce',ownerId:'shared',date:'2026-11-01',endDate:'',amount:10000,currency:'USD',...overrides});
test('migration maps stable member IDs and defaults unknown ownership to shared',()=>{const s=workspace();assert.equal(s.accounts[0].ownerId,'m1');assert.equal(s.accounts[1].ownerId,'m2');assert.equal(s.accounts[2].ownerId,'shared');assert.equal(s.transactions[0].ownerId,null);assert.equal(s.forecastPlan.currency,'USD');});
test('member, shared and whole-household positions count every account once',()=>{const s=workspace(),whole=E.position(F.scope(s));assert.equal(whole.assets,1700000);const mine={owner:'m1',includeShared:false};assert.equal(E.position(F.scope(s,mine)).assets,1000000);assert.equal(E.position(F.scope(s,{owner:'m1',includeShared:true})).assets,1200000);assert.equal(E.position(F.scope(s,{owner:'shared',includeShared:false})).assets,200000);assert.equal(s.accounts.length,3);});
test('transactions follow account ownership until explicitly overridden',()=>{const s=workspace();assert.equal(F.transactionOwner(s,s.transactions[0]),'m1');s.accounts[0].ownerId='m2';assert.equal(F.transactionOwner(s,s.transactions[0]),'m2');F.setTransactionOwnership(s,'t1','m1');assert.equal(F.transactionOwner(s,s.transactions[0]),'m1');});
test('splits preserve ledger amounts and reject incomplete or repeated owners atomically',()=>{const s=workspace(),before=structuredClone(s);assert.throws(()=>F.setTransactionOwnership(s,'t2','shared',[{ownerId:'m1',amount:3000},{ownerId:'m2',amount:5000}]));assert.deepEqual(s,before);F.setTransactionOwnership(s,'t2','shared',[{ownerId:'m1',amount:4000},{ownerId:'m2',amount:6000}]);assert.equal(F.visibleAmount(s,s.transactions[1],{owner:'m1',includeShared:false}),4000);assert.equal(s.transactions[1].amount,10000);assert.deepEqual(s.accounts,before.accounts);assert.throws(()=>F.setTransactionOwnership(s,'t3',null,[{ownerId:'m1',amount:25000},{ownerId:'m2',amount:25000}]));});
test('percentage splits distribute indivisible cents without creating money',()=>{const s=workspace(),t={amount:10001};const p=F.splitPercent(s,t,[{ownerId:'m1',amount:5000},{ownerId:'m2',amount:5000}]);assert.equal(E.sum(p.map(p=>p.amount)),10001);assert.equal(Math.abs(p[0].amount-p[1].amount),1);assert.throws(()=>F.splitPercent(s,t,[{ownerId:'m1',amount:4000},{ownerId:'m2',amount:5000}]));});
test('reports exclude transfers and drillable groups reconcile with historical totals',()=>{const s=workspace(),r=F.reports(s,filter(s));assert.equal(r.income,100000);assert.equal(r.expense,10000);assert.equal(r.net,90000);assert.equal(r.rows.length,2);assert.equal(E.sum(r.groups.map(g=>g.income)),r.income);assert.equal(E.sum(r.groups.map(g=>g.expense)),r.expense);});
test('reports obey dates, accounts, categories and case-insensitive text',()=>{const s=workspace();assert.equal(F.reports(s,filter(s,{category:'Food',search:'groC'})).expense,10000);assert.equal(F.reports(s,filter(s,{account:'a1'})).expense,0);assert.equal(F.reports(s,filter(s,{to:'2026-10-02'})).income,0);assert.throws(()=>F.reports(s,filter(s,{from:'2026-10-04'})));});
test('split FX reporting apportions converted cents so owners reconcile exactly',()=>{const s=workspace();s.currency='USD';s.transactions=[{id:'tiny',name:'Tiny',kind:'expense',amount:16000,accountId:'a3',date:'2026-10-03',category:'Food',currency:'IDR',ownerId:'shared',splits:[{ownerId:'m1',amount:8000},{ownerId:'m2',amount:8000}]}];const r=F.reports(s,filter(s,{group:'owner'}));assert.equal(r.expense,1);assert.equal(E.sum(r.groups.map(g=>g.expense)),1);const mine=F.reports(s,filter(s),{owner:'m1',includeShared:false}),theirs=F.reports(s,filter(s),{owner:'m2',includeShared:false});assert.equal(mine.expense+theirs.expense,1);});
test('saved view validation rejects unknown members and malformed filters',()=>{const s=workspace();s.savedViews.push({id:'v1',name:'Bad',view:{owner:'unknown',includeShared:false}});assert.throws(()=>E.validate(s));s.savedViews=[];s.savedReports.push({id:'r1',name:'Bad',view:{owner:'all',includeShared:false},filter:{}});assert.throws(()=>E.validate(s));});
test('snapshots use their own FX rates and freeze native history without fabricating dates',()=>{const s=workspace();F.snapshot(s,'2026-10-03');s.accounts[0].balance+=100000;F.snapshot(s,'2026-10-04');const h=F.history(s,{from:'2026-10-01',to:'2026-10-04'});assert.equal(h.length,2);assert.equal(h[1].netWorth-h[0].netWorth,100000);s.currency='IDR';s.fx.rates.USD=17000;assert.equal(F.history(s,{from:'2026-10-03',to:'2026-10-03'})[0].netWorth,1500000*16000);F.snapshot(s,'2026-10-04');assert.equal(s.positionHistory.length,2);});
test('flat forecast holds balances constant and never mutates actual data',()=>{const s=flat(),before=structuredClone(s),r=projection(s);assert.equal(r.ending.netWorth,r.initial.netWorth);assert.equal(r.monthly.length,13);assert.equal(r.monthly[1].date,'2026-11-01');assert.deepEqual(s,before);});
test('investment transfers preserve net worth and reduce cash by the same amount',()=>{const s=flat();s.forecastPlan.monthlyInvestment=10000;const r=projection(s);assert.equal(r.ending.netWorth,r.initial.netWorth);assert.equal(r.ending.liquid,r.initial.liquid-120000);assert.equal(r.ending.accounts.find(a=>a.id==='a2').balance,620000);});
test('loan principal repayment reduces assets and liabilities together',()=>{const s=flat();s.debts=workspace().debts;const r=projection(s);assert.equal(r.ending.debt,0);assert.equal(r.ending.netWorth,r.initial.netWorth);assert.equal(r.annual[1].debtPayment,200000);assert.equal(r.monthly[11].debtPayment,0);});
test('non-amortizing debt accrues interest and net worth falls by interest',()=>{const s=flat();s.debts=[{id:'d1',name:'Loan',balance:200000,minimum:1000,apr:12,currency:'USD',ownerId:'shared'}];const r=projection(s);assert.equal(r.monthly[1].debt,201000);assert.equal(r.monthly[1].netWorth,r.initial.netWorth-2000);assert.ok(r.ending.debt>200000);});
test('home purchase creates property and financing without creating net worth',()=>{const s=flat();s.forecastPlan.events=[event({type:'home',amount:1000000,downPayment:20,apr:0,termYears:20})];const r=projection(s);assert.equal(r.monthly[1].accounts.find(a=>a.id==='home_event1').balance,1000000);assert.equal(r.monthly[1].netWorth,r.initial.netWorth);assert.equal(r.ending.netWorth,r.initial.netWorth);assert.equal(r.annual[1].interest,0);});
test('one-time expenses happen once; recurring education stops at the end month',()=>{const s=flat();s.forecastPlan.events=[event(),event({id:'education',type:'expenseMonthly',date:'2026-11-01',endDate:'2027-02-28',amount:5000})];const r=projection(s);assert.equal(r.annual[1].expense,30000);assert.equal(r.monthly[5].expense,0);assert.equal(r.ending.netWorth,r.initial.netWorth-30000);});
test('retirement stops only the selected owner’s baseline salary',()=>{const s=flat();s.flows=workspace().flows.filter(f=>f.kind==='income');s.forecastPlan.events=[event({type:'retirement',ownerId:'m1',amount:20000})];const r=projection(s);assert.equal(r.monthly[1].income,220000);assert.ok(r.retirement);const mine=projection(s,s.forecastPlan,{view:{owner:'m1',includeShared:false}});assert.equal(mine.monthly[1].income,20000);});
test('career-break salary resumes after the configured end month',()=>{const s=flat();s.flows=[workspace().flows[0]];s.forecastPlan.events=[event({type:'careerBreak',ownerId:'m1',amount:0,endDate:'2027-01-31'})];const r=projection(s);assert.equal(r.monthly[1].income,0);assert.equal(r.monthly[4].income,100000);});
test('income growth and inflation are independent and real values are discounted once',()=>{const s=flat();s.forecastPlan.inflation=.1;const r=projection(s);assert.equal(r.ending.netWorth,r.initial.netWorth);assert.equal(r.ending.realNetWorth,Math.round(r.initial.netWorth/1.1));});
test('insufficient liquid assets produce explicit unfunded obligations rather than phantom cash',()=>{const s=flat();s.accounts.forEach(a=>a.balance=0);s.forecastPlan.events=[event({amount:10000})];const r=projection(s);assert.equal(r.ending.assets,0);assert.equal(r.ending.fundingGap,10000);assert.equal(r.ending.netWorth,-10000);assert.equal(r.shortfall,true);});
test('transient shortfall remains flagged even after the gap is repaid',()=>{const s=flat();s.accounts.forEach(a=>a.balance=0);s.forecastPlan.events=[event({amount:10000}),event({id:'recovery',type:'incomeMonthly',date:'2026-12-01',amount:10000})];const r=projection(s,s.forecastPlan,{retainMonthly:false});assert.equal(r.ending.fundingGap,0);assert.equal(r.shortfall,true);});
test('goal reserves stay assets and stop funding at their target',()=>{const s=flat();s.goals=[{id:'g1',name:'Goal',target:200000,saved:100000,monthly:80000,currency:'USD',ownerId:'shared',emoji:'◎',due:'2027-01-01'}];const r=projection(s);assert.equal(r.ending.netWorth,r.initial.netWorth);assert.equal(r.annual[1].goalReserve,100000);assert.equal(r.monthly[1].goalReserve,80000);assert.equal(r.monthly[2].goalReserve,20000);assert.equal(r.monthly[3].goalReserve,0);});
test('history baseline uses twelve complete months, not just months with records',()=>{const s=flat();s.forecastPlan.baseline='history';s.transactions=[{id:'old',name:'Salary',kind:'income',amount:120000,accountId:'a1',date:'2025-10-03',category:'Income',currency:'USD',ownerId:null},{id:'current',name:'Salary',kind:'income',amount:999999,accountId:'a1',date:'2026-10-03',category:'Income',currency:'USD',ownerId:null}];const r=projection(s);assert.equal(r.baseline.months,1);assert.equal(r.monthly[1].income,10000);});
test('reporting currency changes convert plan contributions without reinterpreting native plan amounts',()=>{const s=flat();s.forecastPlan.monthlyInvestment=10000;const usd=projection(s);s.currency='IDR';const idr=projection(s);assert.equal(idr.annual[1].contribution,usd.annual[1].contribution*16000);assert.equal(s.forecastPlan.monthlyInvestment,10000);});
test('account exclusions alter starting assets while retaining associated household liabilities',()=>{const s=flat();s.debts=workspace().debts;s.forecastPlan.accounts.a2={included:false,growth:0};const r=projection(s);assert.equal(r.initial.assets,1200000);assert.equal(r.initial.debt,200000);});
test('forecast assumptions reject impossible events and unknown accounts',()=>{const s=flat();assert.throws(()=>projection(s,{...s.forecastPlan,inflation:-.1}));assert.throws(()=>projection(s,{...s.forecastPlan,years:41}));assert.throws(()=>projection(s,{...s.forecastPlan,events:[event({date:'2026-02-30'})]}));assert.throws(()=>projection(s,{...s.forecastPlan,accounts:{missing:{included:true,growth:0}}}));});
test('integrated Monte Carlo reproduces a zero-volatility deterministic plan',()=>{const s=flat();s.forecastPlan.events=[event({amount:10000})];const r=projection(s);const mc=F.monteCarlo(s,s.forecastPlan,{start:'2026-10-03',paths:100,seed:42});assert.equal(mc.bands[1].p10,r.ending.realNetWorth);assert.equal(mc.bands[1].p50,r.ending.realNetWorth);assert.equal(mc.bands[1].p90,r.ending.realNetWorth);});
test('Monte Carlo seeds are reproducible and bands stay ordered',()=>{const s=flat();s.forecastPlan.volatility=.15;s.forecastPlan.investmentGrowth=.05;const a=F.monteCarlo(s,s.forecastPlan,{start:'2026-10-03',paths:100,seed:13}),b=F.monteCarlo(s,s.forecastPlan,{start:'2026-10-03',paths:100,seed:13});assert.deepEqual(a,b);for(const band of a.bands)assert.ok(band.p10<=band.p50&&band.p50<=band.p90);});
test('imports reject malformed split metadata and reserved ownership identifiers',()=>{const s=workspace();s.transactions[0].splits='';assert.throws(()=>E.validate(s),/split metadata/);delete s.transactions[0].splits;s.members.push({id:'shared',name:'Bad',initials:'B',role:'Member'});assert.throws(()=>E.validate(s),/Reserved member/);});

test('Sankey flow model conserves totals for surplus, deficit and balanced cash flow',()=>{
 for(const [income,expense] of [[200,100],[100,200],[100,100],[100,0],[0,100],[0,0]]){
  const r=F.cashFlowGraph({income,expense,groups:[{key:'One',income,expense}]});
  assert.equal(r.sources.reduce((n,g)=>n+g.amount,0),Math.max(income,expense));
  assert.equal(r.uses.reduce((n,g)=>n+g.amount,0),Math.max(income,expense));
  assert.equal(r.sources.some(n=>n.kind==='gap'),expense>income);
  assert.equal(r.uses.some(n=>n.kind==='surplus'),income>expense);
 }
});
test('Sankey aggregation preserves small-group amounts and never alters records',()=>{
 const groups=Array.from({length:12},(_,i)=>({key:'g'+i,income:i+1,expense:i+2}));const r={income:78,expense:90,groups};const before=JSON.stringify(r);const graph=F.cashFlowGraph(r,3);
 assert.equal(graph.uses.length,4);assert.equal(graph.uses.find(n=>n.kind==='other').amount,54);
 assert.equal(graph.sources.reduce((n,g)=>n+g.amount,0),90);assert.equal(JSON.stringify(r),before);
});
test('Sankey refuses inconsistent report totals instead of inventing balancing income',()=>{
 assert.throws(()=>F.cashFlowGraph({income:100,expense:20,groups:[{key:'A',income:90,expense:20}]}),/reconcile/);
 assert.throws(()=>F.cashFlowGraph({income:-1,expense:0,groups:[]}),/reconcile/);
});

test('correction reverses old income/expense impact once and never mutates input',()=>{const s=workspace(),before=structuredClone(s);const corrected=F.editTransaction(s,'t1',{amount:1000,kind:'expense',name:'Correction'});assert.deepEqual(s,before);assert.equal(corrected.accounts[0].balance,s.accounts[0].balance-100000-1000);assert.equal(corrected.transactions.length,s.transactions.length);assert.deepEqual(F.editTransaction(corrected,'t1',{name:'Rename only'}).accounts,corrected.accounts);assert.deepEqual(F.editTransaction(corrected,'t1',{amount:1000,kind:'expense'}).accounts,corrected.accounts);});
test('historical corrections never move snapshot balances and preserve source identity',()=>{const s=workspace();s.transactions[0].balanceApplied=false;s.transactions[0].sourceKey='source';const corrected=F.editTransaction(s,'t1',{amount:1234,accountId:'a3'});assert.deepEqual(corrected.accounts,s.accounts);assert.equal(corrected.transactions[0].sourceKey,'source');assert.equal(corrected.transactions[0].balanceApplied,false);});
test('cross-currency transfer correction reverses captured received amount despite FX changes',()=>{const s=workspace();s.accounts[2].currency='IDR';s.transactions=[];E.applyTransaction(s,{id:'x',name:'FX',kind:'transfer',amount:100,accountId:'a1',targetId:'a3',date:'2026-10-03',category:'Transfer',ownerId:null});const before=structuredClone(s);s.fx.rates.USD=17000;const corrected=F.editTransaction(s,'x',{amount:200});assert.equal(corrected.accounts[0].balance,before.accounts[0].balance-100);assert.equal(corrected.accounts[2].balance,before.accounts[2].balance-1600000+3400000);assert.equal(corrected.transactions[0].targetAmount,3400000);assert.equal(corrected.transactions.length,1);});
test('invalid corrections and missing historical transfer amounts are atomic; split changes are explicit',()=>{const s=workspace(),before=structuredClone(s);for(const patch of [{amount:0},{date:'2026-02-30'},{accountId:'missing'},{kind:'transfer',targetId:'a1'}])assert.throws(()=>F.editTransaction(s,'t1',patch));assert.deepEqual(s,before);s.transactions[0].splits=[{ownerId:'m1',amount:50000},{ownerId:'m2',amount:50000}];assert.throws(()=>F.editTransaction(s,'t1',{amount:3000}));assert.equal(F.editTransaction(s,'t1',{name:'Metadata'}).transactions[0].splits.length,2);s.accounts[1].currency='IDR';assert.throws(()=>F.editTransaction(s,'t3',{amount:60000}),/received amount missing/);});

test('delete reverses income and expense once on an immutable workspace',()=>{for(const id of ['t1','t2']){const s=workspace(),before=structuredClone(s),tx=s.transactions.find(t=>t.id===id),corrected=F.deleteTransaction(s,id);assert.deepEqual(s,before);assert.equal(corrected.transactions.length,s.transactions.length-1);assert.equal(corrected.accounts.find(a=>a.id===tx.accountId).balance,s.accounts.find(a=>a.id===tx.accountId).balance+(tx.kind==='income'?-tx.amount:tx.amount));assert.throws(()=>F.deleteTransaction(corrected,id));}});
test('deleting historical records preserves balances and deletes captured FX transfer correctly',()=>{const s=workspace();s.transactions[0].balanceApplied=false;assert.deepEqual(F.deleteTransaction(s,'t1').accounts,s.accounts);s.transactions=[];s.accounts[2].currency='IDR';E.applyTransaction(s,{id:'fxdelete',name:'Transfer',kind:'transfer',amount:100,accountId:'a1',targetId:'a3',date:'2026-10-03',category:'Transfer',ownerId:null});const before=structuredClone(s);s.fx.rates.USD=17000;const corrected=F.deleteTransaction(s,'fxdelete');assert.equal(corrected.accounts[0].balance,before.accounts[0].balance+100);assert.equal(corrected.accounts[2].balance,before.accounts[2].balance-1600000);assert.equal(corrected.transactions.length,0);});
test('unsafe transfer deletion and balance overflow leave input unchanged',()=>{const s=workspace();s.accounts[1].currency='IDR';const before=structuredClone(s);assert.throws(()=>F.deleteTransaction(s,'t3'),/received amount missing/);assert.deepEqual(s,before);s.accounts[2].balance=Number.MAX_SAFE_INTEGER;const overflow=structuredClone(s);assert.throws(()=>F.deleteTransaction(s,'t2'),/precision/);assert.deepEqual(s,overflow);});

test('monarch cash flow sankey compiles multi-tier income, pillars, category breakdown and savings rate',()=>{
  const s = workspace();
  s.goals = [{ id: 'g1', name: 'Emergency Fund', target: 500000, saved: 100000, monthly: 50000, currency: 'USD' }];
  
  // Test Plan mode
  const planFlow = F.monarchCashFlowSankey(s, { monthKey: 'plan' });
  assert.equal(planFlow.isPlan, true);
  assert.equal(planFlow.totalIncome, 300000); // 100000 + 200000
  assert.equal(planFlow.goalSavings, 50000);
  assert.ok(planFlow.pillars.length >= 2);
  assert.ok(planFlow.savingsRate > 0);

  // Test Actual month transactions mode
  const monthFlow = F.monarchCashFlowSankey(s, { monthKey: '2026-10' });
  assert.equal(monthFlow.isPlan, false);
  assert.equal(monthFlow.totalIncome, 100000); // Salary tx
  assert.equal(monthFlow.totalFlex + monthFlow.totalFixed, 10000); // Groceries tx
  assert.equal(monthFlow.netSurplus, 40000); // 100000 - 10000 - 50000 (goal savings)
  assert.equal(monthFlow.savingsRate, 90); // (50000 + 40000) / 100000 = 90%
});

test('buildDjpTaxAssetsReport accurately maps Indonesian assets and liabilities into official DJP codes', () => {
  const s = workspace();
  s.currency = 'IDR';
  s.fx = { base: 'IDR', rates: { IDR: 1, USD: 16000 } };
  s.accounts = [
    { id: 'acc1', name: 'BCA Tahapan Utama', type: 'Checking', balance: 50000000, ownerId: 'm1', updated: '2026-05-10', currency: 'IDR' },
    { id: 'acc2', name: 'GoPay Dompet Digital', type: 'Checking', balance: 2500000, ownerId: 'm1', updated: '2026-06-12', currency: 'IDR' },
    { id: 'acc3', name: 'Dompet Tunai Brankas', type: 'Cash', balance: 1000000, ownerId: 'm2', updated: '2025-12-01', currency: 'IDR' },
    { id: 'acc4', name: 'RDN Indo Premier', type: 'Investment', balance: 10000000, ownerId: 'm1', updated: '2026-01-15', currency: 'IDR' }
  ];
  s.holdings = [
    { id: 'h1', symbol: 'BBCA', name: 'Bank Central Asia Tbk', assetType: 'stock', shares: 1000, avgPrice: 9000, currentPrice: 10000, currency: 'IDR', accountId: 'acc4', ownerId: 'm1', updated: '2026-02-10' },
    { id: 'h2', symbol: 'ORI024', name: 'Obligasi Negara Ritel', assetType: 'bond', shares: 20, avgPrice: 1000000, currentPrice: 1000000, currency: 'IDR', accountId: 'acc4', ownerId: 'm1', updated: '2024-10-01' },
    { id: 'h3', symbol: 'BTC', name: 'Bitcoin', assetType: 'crypto', shares: 0.1, avgPrice: 50000, currentPrice: 60000, currency: 'USD', accountId: 'acc4', ownerId: 'm1', updated: '2025-08-01' },
    { id: 'h4', symbol: 'ANTAM', name: 'Emas Logam Mulia Antam', assetType: 'gold', shares: 10, avgPrice: 1300000, currentPrice: 1400000, currency: 'IDR', accountId: 'acc4', ownerId: 'm2', updated: '2026-03-01' },
    { id: 'h5', symbol: 'RDPU', name: 'Sucorinvest Sharia Money Market', assetType: 'fund', shares: 5000, avgPrice: 1000, currentPrice: 1100, currency: 'IDR', accountId: 'acc4', ownerId: 'm1', updated: '2026-01-10' }
  ];
  s.debts = [
    { id: 'd1', name: 'BCA Everyday Card', balance: 5000000, ownerId: 'm1', currency: 'IDR', updated: '2026-09-01' },
    { id: 'd2', name: 'Shopee Paylater Cicilan', balance: 1500000, ownerId: 'm1', currency: 'IDR', updated: '2026-08-15' },
    { id: 'd3', name: 'KPR Bank Mandiri Griya', balance: 350000000, ownerId: 'm2', currency: 'IDR', updated: '2022-01-10' }
  ];

  // Test full household recap
  const repAll = F.buildDjpTaxAssetsReport(s, { year: '2026', ownerId: 'all' });
  assert.equal(repAll.year, '2026');
  assert.ok(repAll.assets.length >= 8); // 4 accounts + 5 holdings = 9
  assert.equal(repAll.liabilities.length, 3);

  // Check DJP code mapping
  const bcaAcc = repAll.assets.find(a => a.name === 'BCA Tahapan Utama');
  assert.equal(bcaAcc.code, '012'); // Tabungan

  const gopayAcc = repAll.assets.find(a => a.name === 'GoPay Dompet Digital');
  assert.equal(gopayAcc.code, '015'); // Uang Elektronik

  const cashAcc = repAll.assets.find(a => a.name === 'Dompet Tunai Brankas');
  assert.equal(cashAcc.code, '011'); // Uang Tunai

  const bbcaHolding = repAll.assets.find(a => a.name.includes('BBCA'));
  assert.equal(bbcaHolding.code, '031'); // Saham BEI
  assert.equal(bbcaHolding.valueIdr, 10000000); // 1000 * 10000

  const bondHolding = repAll.assets.find(a => a.name.includes('ORI024'));
  assert.equal(bondHolding.code, '034'); // Obligasi Negara

  const btcHolding = repAll.assets.find(a => a.name.includes('BTC'));
  assert.equal(btcHolding.code, '039'); // Kripto / Investasi Lainnya
  // 0.1 * 60000 USD = 6000 USD * 16000 IDR = 96,000,000 IDR
  assert.equal(btcHolding.valueIdr, 96000000);

  const goldHolding = repAll.assets.find(a => a.name.includes('ANTAM'));
  assert.equal(goldHolding.code, '051'); // Logam Mulia

  const fundHolding = repAll.assets.find(a => a.name.includes('RDPU'));
  assert.equal(fundHolding.code, '038'); // Reksa Dana

  // Check Liabilities DJP code mapping
  const ccDebt = repAll.liabilities.find(l => l.name.includes('BCA Everyday Card'));
  assert.equal(ccDebt.code, '102'); // Kartu Kredit

  const paylaterDebt = repAll.liabilities.find(l => l.name.includes('Shopee Paylater'));
  assert.equal(paylaterDebt.code, '104'); // Paylater / Fintech

  const kprDebt = repAll.liabilities.find(l => l.name.includes('KPR Bank Mandiri'));
  assert.equal(kprDebt.code, '101'); // Utang Bank

  // Check Net fiscal wealth
  assert.equal(repAll.netWealthIdr, repAll.totalAssetsIdr - repAll.totalLiabilitiesIdr);

  // Check TSV format
  assert.ok(repAll.tsvText.includes("Kode Harta\tNama Harta"));
  assert.ok(repAll.tsvText.includes("012\tBCA Tahapan Utama"));
  assert.ok(repAll.tsvText.includes("Kode Utang\tNama Pemberi Pinjaman"));
  assert.ok(repAll.tsvText.includes("102\tBCA Everyday Card"));

  // Check CSV format
  assert.ok(repAll.csvText.includes("Kode DJP"));
  assert.ok(repAll.csvText.includes('"HARTA","012"'));

  // Test individual owner filter (m2 only)
  const repM2 = F.buildDjpTaxAssetsReport(s, { year: '2026', ownerId: 'm2' });
  assert.equal(repM2.assets.some(a => a.name === 'BCA Tahapan Utama'), false);
  assert.equal(repM2.assets.some(a => a.name === 'Dompet Tunai Brankas'), true);
  assert.equal(repM2.assets.some(a => a.name.includes('ANTAM')), true);
  assert.equal(repM2.liabilities.length, 1);
  assert.equal(repM2.liabilities[0].name, 'KPR Bank Mandiri Griya');
});


