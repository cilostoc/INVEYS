const {test} = require('node:test');
const assert = require('node:assert/strict');
const E = require('../src/engine');

function workspace() {
  return {version:1, currency:'USD', name:'Test', demo:false,
    accounts:[{id:'a1',name:'Checking',type:'Checking',balance:1000000,owner:'Me',updated:'2026-10-02'},{id:'a2',name:'Savings',type:'Savings',balance:500000,owner:'Me',updated:'2026-10-02'},{id:'a3',name:'Portfolio',type:'Investment',balance:2000000,owner:'Me',updated:'2026-10-02'}],
    debts:[{id:'d1',name:'Loan',balance:100000,apr:12,minimum:10000}],
    goals:[{id:'g1',name:'Reserve',emoji:'◎',target:500000,saved:100000,monthly:50000,due:''}],
    flows:[{id:'f1',name:'Salary',kind:'income',amount:400000,day:1},{id:'f2',name:'Living',kind:'expense',amount:200000,day:5}],
    transactions:[],tasks:[],members:[],history:[]};
}
test('currency entry converts decimal text exactly',()=>{
  assert.equal(E.cents('123.45'),12345);
  assert.equal(E.cents('0.29'),29);
  assert.equal(E.cents('-12.3'),-1230);
  assert.throws(()=>E.cents('1.005'));
  assert.throws(()=>E.cents('Infinity'));
  assert.throws(()=>E.cents('900719925474099.1'));
});
test('position separates liquidity, liabilities, debt minimums and goal commitments',()=>{
  const p=E.position(workspace());
  assert.equal(p.netWorth,3400000);
  assert.equal(p.liquid,1500000);
  assert.equal(p.outflows,210000);
  assert.equal(p.available,140000);
});
test('aggregate amounts fail explicitly beyond safe integer precision',()=>{
  assert.throws(()=>E.sum([Number.MAX_SAFE_INTEGER,1]));
});
test('transfer preserves total assets and does not alter recurring income',()=>{
  const s=workspace(),before=E.position(s);
  E.applyTransaction(s,{id:'t1',name:'Transfer',category:'Transfer',kind:'transfer',amount:12500,accountId:'a1',targetId:'a2',date:'2026-10-02'});
  assert.equal(s.accounts[0].balance,987500);
  assert.equal(s.accounts[1].balance,512500);
  assert.equal(E.position(s).assets,before.assets);
  assert.equal(E.position(s).income,before.income);
});
test('income and expense adjust the account in opposite directions',()=>{
  const s=workspace();
  E.applyTransaction(s,{kind:'income',amount:30000,accountId:'a1'});
  E.applyTransaction(s,{kind:'expense',amount:20000,accountId:'a1'});
  assert.equal(s.accounts[0].balance,1010000);
});
test('invalid transfer is atomic and cannot change balances',()=>{
  const s=workspace();
  assert.throws(()=>E.applyTransaction(s,{kind:'transfer',amount:500,accountId:'a1',targetId:'a1'}));
  assert.equal(s.accounts[0].balance,1000000);
  assert.equal(s.transactions.length,0);
});
test('goal allocations never move money or create assets',()=>{
  const s=workspace(),assets=E.position(s).assets;
  E.fundGoal(s,'g1',50000);
  assert.equal(s.goals[0].saved,150000);
  assert.equal(E.position(s).assets,assets);
  assert.throws(()=>E.fundGoal(s,'g1',1500000));
  assert.equal(s.goals[0].saved,150000);
});
test('spendFromGoal deducts from goal savings without moving assets',()=>{
  const s=workspace(),assets=E.position(s).assets;
  E.spendFromGoal(s,'g1',40000);
  assert.equal(s.goals[0].saved,60000);
  assert.equal(E.position(s).assets,assets);
  assert.throws(()=>E.spendFromGoal(s,'g1',100000));
  assert.equal(s.goals[0].saved,60000);
});
test('scenario uses baseline and changes without mutation',()=>{
  const s=workspace(),snapshot=JSON.stringify(s);
  const base=E.forecast(s),scenario=E.forecast(s,{incomeDelta:10000,expenseDelta:5000,oneTime:100000});
  assert.equal(base[6].balance,2340000);
  assert.equal(scenario[6].balance,2270000);
  assert.equal(scenario[0].balance,1500000);
  assert.equal(JSON.stringify(s),snapshot);
});
test('forecast exposes negative liquidity rather than hiding shortfall',()=>{
  const result=E.forecast(workspace(),{oneTime:99999999});
  assert.ok(result[1].balance<0);
});
test('zero APR debt computes known payoff',()=>{
  assert.deepEqual(E.payoff({balance:100000,apr:0,minimum:10000}),{months:10,interest:0,feasible:true});
});
test('amortization matches independently calculated one-month payoff',()=>{
  assert.deepEqual(E.payoff({balance:100000,apr:12,minimum:101000}),{months:1,interest:1000,feasible:true});
});
test('additional payments reduce payoff duration and total interest',()=>{
  const d=workspace().debts[0],base=E.payoff(d),extra=E.payoff(d,10000);
  assert.ok(extra.months<base.months);
  assert.ok(extra.interest<base.interest);
});
test('non-amortizing and paid debt are handled explicitly',()=>{
  assert.equal(E.payoff({balance:100000,apr:24,minimum:1000}).feasible,false);
  assert.equal(E.payoff({balance:0,apr:24,minimum:1000}).months,0);
});
test('empty workspace has no fabricated reserve ratio',()=>{
  const s=workspace();s.flows=[];s.debts=[];
  assert.equal(E.position(s).reserveMonths,null);
});
test('import validates identifiers, duplicate records and transfer references',()=>{
  assert.equal(E.validate(workspace()).name,'Test');
  const s=workspace();s.accounts[0].id='a" onclick="evil';assert.throws(()=>E.validate(s));
  const duplicate=workspace();duplicate.accounts.push({...duplicate.accounts[0]});assert.throws(()=>E.validate(duplicate));
  const invalid=workspace();invalid.transactions.push({id:'t1',name:'Transfer',category:'Transfer',kind:'transfer',amount:1000,date:'2026-10-02',accountId:'a1',targetId:'missing'});assert.throws(()=>E.validate(invalid));
});

test('legacy workspaces migrate without reinterpreting native balances',()=>{
  const s=workspace(),before=s.accounts[0].balance;
  E.validate(s);
  assert.equal(s.accounts[0].currency,'USD');assert.equal(s.accounts[0].balance,before);
  assert.equal(s.language,'id');assert.equal(s.fx.rates.IDR,1);
});
test('mixed-currency position converts each record to the reporting currency',()=>{
  const s=E.migrate(workspace());s.currency='IDR';s.accounts=[{id:'usd',name:'USD',type:'Checking',currency:'USD',balance:10000,owner:'Me',updated:'2026-10-03'},{id:'idr',name:'IDR',type:'Savings',currency:'IDR',balance:200000000,owner:'Me',updated:'2026-10-03'}];s.debts=[];s.goals=[];s.flows=[];
  assert.equal(E.position(s).assets,360000000);
  assert.equal(E.convert(s,10000,'USD','IDR'),160000000);
  assert.equal(E.convert(s,160000000,'IDR','USD'),10000);
  s.currency='USD';assert.equal(E.position(s).assets,22500);
  assert.equal(s.accounts[1].balance,200000000);
});
test('cross-currency transfers snapshot the received amount and preserve reporting assets',()=>{
  const s=E.migrate(workspace());s.accounts[1].currency='IDR';s.accounts[1].balance=100000000;
  const before=E.position(s).assets;
  E.applyTransaction(s,{id:'fx1',name:'Exchange',category:'Transfer',kind:'transfer',amount:10000,accountId:'a1',targetId:'a2',date:'2026-10-03'});
  assert.equal(s.transactions[0].targetAmount,160000000);
  assert.equal(s.transactions[0].targetCurrency,'IDR');assert.equal(s.transactions[0].fxDate,'2026-10-03');
  assert.equal(E.position(s).assets,before);
});
test('goal allocation checks liquid capacity after currency conversion',()=>{
  const s=E.migrate(workspace());s.goals[0].currency='IDR';s.goals[0].saved=0;
  E.fundGoal(s,'g1',160000000);assert.equal(s.goals[0].saved,160000000);
  assert.throws(()=>E.fundGoal(s,'g1',30000000000));
});
test('invalid or missing FX quotes are rejected',()=>{
  const s=E.migrate(workspace());s.fx.rates.USD=0;assert.throws(()=>E.validate(s));
  assert.throws(()=>E.convert(s,10000,'USD','IDR'));
});
test('card reminders cover overdue, upcoming, paid statements and limit review dates',()=>{
  const s=E.migrate(workspace());s.cards=[{id:'cc1',debtId:'d1',name:'Test card',owner:'Me',last4:'1234',limit:200000,statementAmount:100000,paid:0,dueDate:'2026-10-05',limitDate:'2026-10-07',reminderDays:7}];E.validate(s);
  assert.equal(E.reminders(s,'2026-10-03').length,2);
  assert.equal(E.reminders(s,'2026-10-06').find(r=>r.type==='due').days,-1);
  s.cards[0].paid=100000;assert.equal(E.reminders(s,'2026-10-06').filter(r=>r.type==='due').length,0);
  assert.equal(E.reminders(s,'2026-09-20').length,0);
});
test('credit-card principal payment reduces assets and liabilities exactly once',()=>{
  const s=E.migrate(workspace());s.cards=[{id:'cc1',debtId:'d1',name:'Card',owner:'Me',last4:'1234',limit:200000,statementAmount:100000,paid:0,dueDate:'2026-10-05',limitDate:'',reminderDays:7}];
  const net=E.position(s).netWorth;const result=E.payCard(s,'cc1','a1',10000,'2026-10-03');
  assert.equal(result.debit,10000);assert.equal(s.debts[0].balance,90000);assert.equal(s.cards[0].paid,10000);assert.equal(E.position(s).netWorth,net);
  const snapshot=JSON.stringify(s);assert.throws(()=>E.payCard(s,'cc1','a1',999999,'2026-10-03'));assert.equal(JSON.stringify(s),snapshot);
});
test('card payment converts the debit from a foreign payment account',()=>{
  const s=E.migrate(workspace());s.accounts[0].currency='IDR';s.accounts[0].balance=1600000000;s.cards=[{id:'cc1',debtId:'d1',name:'Card',owner:'Me',last4:'1234',limit:200000,statementAmount:100000,paid:0,dueDate:'2026-10-05',limitDate:'',reminderDays:7}];
  const before=E.position(s).netWorth;const result=E.payCard(s,'cc1','a1',10000,'2026-10-03');assert.equal(result.debit,160000000);assert.equal(E.position(s).netWorth,before);
});
test('card linking cannot duplicate a liability across two card records',()=>{
  const s=E.migrate(workspace());const c={id:'cc1',debtId:'d1',name:'Card',owner:'Me',last4:'1234',limit:200000,statementAmount:100000,paid:0,dueDate:'2026-10-05',limitDate:'',reminderDays:7};s.cards=[c,{...c,id:'cc2'}];assert.throws(()=>E.validate(s));
});
test('calendar arithmetic validates dates and handles leap years',()=>{
  assert.equal(E.dayDifference('2028-02-28','2028-03-01'),2);
  assert.equal(E.validDate('2027-02-29'),false);assert.equal(E.validDate('2028-02-29'),true);
});
test('Monte Carlo zero-volatility case matches the deterministic monthly formula',()=>{
  const result=E.monteCarlo({initial:100000,monthly:10000,years:1,mean:0,volatility:0,inflation:0,target:220000,paths:100,seed:1});
  assert.equal(result.ending.p10,220000);assert.equal(result.ending.p50,220000);assert.equal(result.ending.p90,220000);assert.equal(result.success,1);assert.equal(result.belowPrincipal,0);
});
test('Monte Carlo compound growth and real purchasing power are coherent',()=>{
  const result=E.monteCarlo({initial:100000,monthly:0,years:2,mean:.1,volatility:0,inflation:.05,target:999999,paths:100,seed:3});
  assert.ok(Math.abs(result.ending.p50-Math.round(100000*1.1**2/1.05**2))<=1);assert.equal(result.success,0);
});
test('Monte Carlo seeded paths are reproducible and percentiles ordered',()=>{
  const config={initial:100000,monthly:1000,years:5,mean:.06,volatility:.15,inflation:.03,target:160000,paths:1000,seed:42};
  const a=E.monteCarlo(config),b=E.monteCarlo(config);assert.deepEqual(a,b);assert.ok(a.success>=0&&a.success<=1);
  for(const band of a.bands){assert.ok(band.p10<=band.p50&&band.p50<=band.p90);}
  assert.notDeepEqual(a,E.monteCarlo({...config,seed:43}));
});
test('Monte Carlo rejects invalid horizons, path counts and nonfinite assumptions',()=>{
  const c={initial:100000,monthly:1000,years:5,mean:.06,volatility:.15,target:100000,paths:1000,seed:42};
  for(const override of [{years:1.5},{years:0},{paths:100000},{volatility:NaN},{mean:-1},{inflation:-.1}])assert.throws(()=>E.monteCarlo({...c,...override}));
});

test('card artwork accepts bounded raster data URLs and rejects active/remote/oversized inputs',()=>{E.validateCardImage(undefined);E.validateCardImage('data:image/jpeg;base64,/9j/AA==');E.validateCardImage('data:image/png;base64,iVBORw0KGgo=');for(const value of ['https://example.com/card.png','data:image/svg+xml;base64,PHN2Zz4=','javascript:alert(1)','data:image/jpeg;base64,AAAA','data:image/jpeg;base64,/9j/'+ 'A'.repeat(350000)])assert.throws(()=>E.validateCardImage(value));});
test('card artwork has an aggregate budget to bound local storage and backup size',()=>{const s=E.migrate(workspace());s.cards=Array.from({length:5},(_,i)=>({id:'c'+i,image:'data:image/jpeg;base64,/9j/'+ 'A'.repeat(339996)}));assert.throws(()=>E.validate(s),/storage budget/);});

test('setCategoryBudget creates and updates category budget allocations with validation',()=>{
  const s=E.migrate(workspace());
  E.setCategoryBudget(s,'Groceries',300000,'flexible',true);
  assert.equal(s.budgets.length,1);
  assert.equal(s.budgets[0].category,'Groceries');
  assert.equal(s.budgets[0].amount,300000);
  assert.equal(s.budgets[0].rollover,true);
  E.setCategoryBudget(s,'Groceries',350000,'flexible',false);
  assert.equal(s.budgets.length,1);
  assert.equal(s.budgets[0].amount,350000);
  assert.equal(s.budgets[0].rollover,false);
  assert.throws(()=>E.setCategoryBudget(s,'',1000));
  assert.throws(()=>E.setCategoryBudget(s,'Food',-500));
  assert.throws(()=>E.setCategoryBudget(s,'Food',1000,'invalid_group'));
});

test('monthlyBudgetSummary computes category actuals, rollover surplus, and pace indicator',()=>{
  const s=E.migrate(workspace());
  E.setCategoryBudget(s,'Groceries',300000,'flexible',true); // 3000.00
  E.setCategoryBudget(s,'Rent',1000000,'fixed',false); // 10000.00
  // Previous month 2026-08 (m=7): Groceries spent 200000 (remaining 100000)
  s.transactions.push({id:'t_prev',name:'Supermarket',kind:'expense',amount:200000,accountId:'a1',category:'Groceries',date:'2026-08-15'});
  // This month 2026-09 (m=8): Groceries spent 150000
  s.transactions.push({id:'t_now',name:'Supermarket',kind:'expense',amount:150000,accountId:'a1',category:'Groceries',date:'2026-09-10'});
  const summary=E.monthlyBudgetSummary(s,2026,8); // Sep 2026
  assert.equal(summary.year,2026);
  assert.equal(summary.month,8);
  const groc=summary.items.find(i=>i.category==='Groceries');
  assert.equal(groc.budget,300000);
  assert.equal(groc.rolloverAmount,100000); // 300000 - 200000
  assert.equal(groc.effectiveBudget,400000); // 300000 + 100000
  assert.equal(groc.actual,150000);
  assert.equal(groc.remaining,250000);
  assert.equal(groc.percent,38);
  assert.equal(groc.status,'good');
  assert.equal(summary.fixed.budget,1000000);
});

test('E-Wallet account type is validated, included in liquid assets, and usable for card payments', () => {
  const s = E.migrate(workspace());
  s.accounts.push({
    id: 'w1',
    name: 'GoPay Wallet',
    type: 'E-Wallet',
    currency: 'USD',
    balance: 50000,
    owner: 'Me',
    updated: '2026-10-03'
  });
  assert.doesNotThrow(() => E.validate(s));

  const pos = E.position(s);
  // checking (a1: 1000000) + savings (a2: 500000) + ewallet (w1: 50000) = 1550000
  assert.equal(pos.liquid, 1550000);

  // Test payCard from E-Wallet
  s.cards = [{id: 'cc1', debtId: 'd1', name: 'Card', owner: 'Me', last4: '1234', limit: 200000, statementAmount: 50000, paid: 0, dueDate: '2026-10-05', limitDate: '', reminderDays: 7}];
  const res = E.payCard(s, 'cc1', 'w1', 20000, '2026-10-03');
  assert.equal(res.debit, 20000);
  assert.equal(s.accounts.find(a => a.id === 'w1').balance, 30000);
  assert.equal(s.debts[0].balance, 80000);

  // Verify non-liquid account cannot be used for payCard
  s.accounts.push({
    id: 'inv1',
    name: 'Brokerage',
    type: 'Investment',
    currency: 'USD',
    balance: 100000,
    owner: 'Me',
    updated: '2026-10-03'
  });
  assert.throws(() => E.payCard(s, 'cc1', 'inv1', 10000, '2026-10-03'), /liquid payment account/);
});


