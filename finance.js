(function(root){
'use strict';
const E=typeof module!=='undefined'&&module.exports?require('./engine'):root.InveysEngine;
const ownerKeys=s=>['shared',...(s.members||[]).map(m=>m.id)];
const validOwner=(s,id)=>ownerKeys(s).includes(id);
const matchOwner=(s,label)=>{const name=String(label||'').toLowerCase().trim();const matches=(s.members||[]).filter(m=>m.name.toLowerCase()===name||m.name.split(' ')[0].toLowerCase()===name);return matches.length===1?matches[0].id:'shared';};
function migrate(s){
 if(!s||s.version!==1)return s;
 s.activeView??={owner:'all',includeShared:false};s.savedViews??=[];s.savedReports??=[];
 for(const key of ['accounts','debts','goals','flows'])for(const row of s[key]||[]){row.ownerId??=matchOwner(s,row.owner||(s.demo&&key==='flows'?row.name.split(' · ')[0]:''));}
 for(const t of s.transactions||[])t.ownerId??=null;
 s.forecastPlan??={years:20,startAge:35,inflation:.03,incomeGrowth:.02,expenseGrowth:.03,investmentGrowth:.05,cashGrowth:0,propertyGrowth:.025,monthlyInvestment:0,volatility:.15,target:0,baseline:'plan',accounts:{},events:[],scenarios:[]};
 s.forecastPlan.currency??=s.currency;for(const sc of s.forecastPlan.scenarios||[])sc.plan.currency??=s.currency;s.dashboardWidgets??=['position','history','accounts','goals','bills'];s.positionHistory??=[];return s;
}
function matches(s,owner,view=s.activeView){return !view||view.owner==='all'||owner===view.owner||(view.includeShared&&owner==='shared'&&view.owner!=='shared');}
function transactionOwner(s,t){return t.ownerId||s.accounts.find(a=>a.id===t.accountId)?.ownerId||'shared';}
function visibleAmount(s,t,view=s.activeView){if(!view||view.owner==='all')return t.amount;if(t.splits?.length)return E.sum(t.splits.filter(p=>matches(s,p.ownerId,view)).map(p=>p.amount));return matches(s,transactionOwner(s,t),view)?t.amount:0;}
function apportion(total,parts){const divisor=BigInt(E.sum(parts.map(p=>p.amount)));const rows=parts.map(p=>{const value=BigInt(total)*BigInt(p.amount);return {...p,value:Number(value/divisor),remainder:value%divisor};});let remaining=total-E.sum(rows.map(r=>r.value));for(const r of [...rows].sort((a,b)=>a.remainder>b.remainder?-1:a.remainder<b.remainder?1:0)){if(remaining){r.value++;remaining--;}}return rows.map(({remainder,...r})=>r);}
function reportParts(s,t){const rows=t.splits?.length?apportion(E.convert(s,t.originalAmount||t.amount,t.currency),t.splits):[{ownerId:transactionOwner(s,t),amount:t.amount,value:E.reporting(s,t,'amount')}];return t.refundOf?rows.map(r=>({...r,value:-r.value})):rows;}
const reported=(s,t)=>t.reportingAmount??(t.refundOf?-1:1)*E.reporting(s,t,'amount');
function scopedTransactions(s,view=s.activeView){return s.transactions.flatMap(t=>{const amount=visibleAmount(s,t,view);return amount?[{...t,originalAmount:t.amount,amount,reportingAmount:E.sum(reportParts(s,t).filter(p=>matches(s,p.ownerId,view)).map(p=>p.value))}]:[];});}
function scope(s,view=s.activeView){return {...s,...Object.fromEntries(['accounts','debts','goals','flows'].map(key=>[key,s[key].filter(r=>matches(s,r.ownerId,view))])),transactions:scopedTransactions(s,view),cards:s.cards.filter(c=>s.debts.some(d=>d.id===c.debtId&&matches(s,d.ownerId,view)))};}
function validateView(s,v){if(!v||!(v.owner==='all'||validOwner(s,v.owner))||typeof v.includeShared!=='boolean')throw Error('Invalid ownership view');}
function validateSplits(s,t,splits){if(!Array.isArray(splits)||splits.length<2||splits.length>20||new Set(splits.map(p=>p.ownerId)).size!==splits.length||splits.some(p=>!validOwner(s,p.ownerId)||!Number.isSafeInteger(p.amount)||p.amount<=0)||E.sum(splits.map(p=>p.amount))!==t.amount)throw Error('Split amounts must be positive and total the original amount exactly');if(t.kind==='transfer')throw Error('Transfers cannot be split as spending');}
function validatePlan(s,c){
 if(c.historyPolicy!==undefined&&!['fixed12','available'].includes(c.historyPolicy))throw Error('Invalid historical averaging policy');
 for(const mode of ['incomeGrowthMode','expenseGrowthMode'])if(c[mode]!==undefined&&!['custom','inflation'].includes(c[mode]))throw Error('Invalid growth mode');
 const rates=['inflation','incomeGrowth','expenseGrowth','investmentGrowth','cashGrowth','propertyGrowth'];if(!c||!E.currencies.includes(c.currency)||!Number.isInteger(c.years)||c.years<1||c.years>40||!Number.isInteger(c.startAge)||c.startAge<0||c.startAge>100||rates.some(k=>!Number.isFinite(c[k])||c[k]<=-1||c[k]>.5)||c.inflation<0||!Number.isFinite(c.volatility)||c.volatility<0||c.volatility>1||![c.monthlyInvestment,c.target].every(n=>Number.isSafeInteger(n)&&n>=0)||!['plan','history'].includes(c.baseline)||!Array.isArray(c.events)||c.events.length>100||!c.accounts||typeof c.accounts!=='object'||Array.isArray(c.accounts))throw Error('Invalid forecast assumptions');
 const ids=new Set();for(const ev of c.events){if(typeof ev.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(ev.id)||ids.has(ev.id)||typeof ev.name!=='string'||ev.name.length>120||!validOwner(s,ev.ownerId)||!E.validDate(ev.date)||(ev.endDate&&(!E.validDate(ev.endDate)||ev.endDate<ev.date))||!['expenseOnce','expenseMonthly','incomeMonthly','retirement','careerBreak','home'].includes(ev.type)||!Number.isSafeInteger(ev.amount)||ev.amount<0||(ev.currency&&!E.currencies.includes(ev.currency)))throw Error('Invalid life event');ids.add(ev.id);if(ev.type==='home'&&(!Number.isFinite(ev.downPayment)||ev.downPayment<0||ev.downPayment>100||!Number.isFinite(ev.apr)||ev.apr<0||ev.apr>100||!Number.isInteger(ev.termYears)||ev.termYears<1||ev.termYears>40))throw Error('Invalid home financing');}
 for(const [id,settings] of Object.entries(c.accounts)){if(!s.accounts.some(a=>a.id===id)||typeof settings!=='object'||!Number.isFinite(settings.growth)||settings.growth<=-1||settings.growth>.5||typeof settings.included!=='boolean'||settings.withdrawalRank!==undefined&&(!Number.isInteger(settings.withdrawalRank)||settings.withdrawalRank<0||settings.withdrawalRank>100)||settings.withdrawalStartYear!==undefined&&(!Number.isInteger(settings.withdrawalStartYear)||settings.withdrawalStartYear<1||settings.withdrawalStartYear>40)||settings.growthSchedule!==undefined&&(!Array.isArray(settings.growthSchedule)||settings.growthSchedule.length>40||settings.growthSchedule.some(r=>!Number.isInteger(r.year)||r.year<1||r.year>40||!Number.isFinite(r.rate)||r.rate<=-1||r.rate>.5)||new Set(settings.growthSchedule.map(r=>r.year)).size!==settings.growthSchedule.length))throw Error('Invalid account forecast assumptions');}
}
function validate(s){if(s.members.some(m=>['all','shared'].includes(m.id)))throw Error('Reserved member identifier');if(!Array.isArray(s.dashboardWidgets)||new Set(s.dashboardWidgets).size!==s.dashboardWidgets.length||s.dashboardWidgets.some(k=>!['position','history','accounts','goals','bills'].includes(k)))throw Error('Invalid dashboard widgets');if(!Array.isArray(s.positionHistory)||s.positionHistory.length>3650)throw Error('Invalid position history');for(const h of s.positionHistory){if(!E.validDate(h.date)||!Array.isArray(h.accounts)||!Array.isArray(h.debts)||!h.fx||h.fx.rates?.IDR!==1||E.currencies.some(k=>!Number.isFinite(h.fx.rates?.[k])||h.fx.rates[k]<=0||h.fx.rates[k]>1e9))throw Error('Invalid position snapshot');for(const r of [...h.accounts,...h.debts])if(typeof r.id!=='string'||!Number.isSafeInteger(r.balance)||!E.currencies.includes(r.currency)||typeof r.ownerId!=='string')throw Error('Invalid snapshot row');}validateView(s,s.activeView);for(const key of ['accounts','debts','goals','flows'])for(const r of s[key])if(!validOwner(s,r.ownerId))throw Error('Invalid record owner');for(const t of s.transactions){if(t.ownerId!==null&&!validOwner(s,t.ownerId))throw Error('Invalid transaction owner');if(t.splits!==undefined&&!Array.isArray(t.splits))throw Error('Invalid transaction split metadata');if(t.splits?.length)validateSplits(s,t,t.splits);}
 for(const key of ['savedViews','savedReports']){if(!Array.isArray(s[key])||s[key].length>100)throw Error('Invalid saved views');const ids=new Set();for(const v of s[key]){if(typeof v.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(v.id)||ids.has(v.id)||typeof v.name!=='string'||v.name.length>120)throw Error('Invalid saved view metadata');ids.add(v.id);validateView(s,v.view);if(v.currency&&!E.currencies.includes(v.currency))throw Error('Invalid saved view currency');if(key==='savedReports')validateReportFilter(s,v.filter);}}
 validatePlan(s,s.forecastPlan);if(!Array.isArray(s.forecastPlan.scenarios)||s.forecastPlan.scenarios.length>20)throw Error('Invalid forecast scenarios');const ids=new Set();for(const sc of s.forecastPlan.scenarios){if(typeof sc.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(sc.id)||ids.has(sc.id)||typeof sc.name!=='string'||sc.name.length>120)throw Error('Invalid forecast scenario');ids.add(sc.id);validatePlan(s,sc.plan);}return s;
}
function defaultFilter(today=new Date().toISOString().slice(0,10)){return {from:today.slice(0,4)+'-01-01',to:today,account:'all',category:'all',search:'',group:'category',tab:'cashflow',chart:'sankey'};}
function validateReportFilter(s,f){if(!f||!E.validDate(f.from)||!E.validDate(f.to)||f.from>f.to||!['category','merchant','owner','account','month'].includes(f.group)||!['cashflow','spending','income','networth','debt','cards'].includes(f.tab)||!['bars','sankey','treemap','heatmap','pie'].includes(f.chart)||!(f.account==='all'||s.accounts.some(a=>a.id===f.account))||typeof f.category!=='string'||typeof f.search!=='string'||f.search.length>200)throw Error('Invalid report filters');}
function cashFlowGraph(r,limit=6){
 if(!r||!Array.isArray(r.groups)||!Number.isInteger(limit)||limit<1||limit>20||!Number.isSafeInteger(r.income)||r.income<0||!Number.isSafeInteger(r.expense)||r.groups.some(g=>!Number.isSafeInteger(g.income)||g.income<0||!Number.isSafeInteger(g.expense))||E.sum(r.groups.map(g=>g.income))!==r.income||E.sum(r.groups.map(g=>g.expense))!==r.expense)throw Error('Cash flow groups must reconcile with recorded totals');
 const compress=nodes=>{nodes.sort((a,b)=>b.amount-a.amount);return nodes.length<=limit?nodes:[...nodes.slice(0,limit),{key:'other',amount:E.sum(nodes.slice(limit).map(n=>n.amount)),kind:'other'}];};
 const sources=compress(r.groups.flatMap(g=>[...(g.income>0?[{key:g.key,amount:g.income,kind:'group'}]:[]),...(g.expense<0?[{key:g.key,amount:-g.expense,kind:'refund'}]:[])])),uses=compress(r.groups.filter(g=>g.expense>0).map(g=>({key:g.key,amount:g.expense,kind:'group'}))),net=r.income-r.expense;
 if(net>0)uses.push({key:'surplus',amount:net,kind:'surplus'});if(net<0)sources.push({key:'gap',amount:-net,kind:'gap'});return {sources,uses,total:E.sum(sources.map(n=>n.amount)),net};
}
function reports(s,f=defaultFilter(),view=s.activeView){validateReportFilter(s,f);const selected=scopedTransactions(s,view).filter(t=>t.kind!=='transfer'&&t.status!=='pending'&&!t.hiddenFromReports&&t.date>=f.from&&t.date<=f.to&&(f.account==='all'||t.accountId===f.account)&&(f.category==='all'||t.category===f.category)&&(!f.search||`${t.name} ${t.category}`.toLowerCase().includes(f.search.toLowerCase())));
 const income=E.sum(selected.filter(t=>t.kind==='income').map(t=>reported(s,t))),expense=E.sum(selected.filter(t=>t.kind==='expense').map(t=>reported(s,t)));
 const rows=selected.filter(t=>f.tab==='income'?t.kind==='income':f.tab==='spending'?t.kind==='expense':true);const buckets=new Map(),monthly=new Map();
 for(const t of selected){const month=t.date.slice(0,7),m=monthly.get(month)||{month,income:0,expense:0};m[t.kind]+=reported(s,t);monthly.set(month,m);}
 for(const t of rows){const portions=f.group==='owner'&&t.splits?.length?reportParts(s,t).filter(p=>matches(s,p.ownerId,view)):[{ownerId:transactionOwner(s,t),amount:t.amount,value:reported(s,t)}];for(const p of portions){const key=f.group==='merchant'?t.name:f.group==='account'?t.accountId:f.group==='owner'?p.ownerId:f.group==='month'?t.date.slice(0,7):t.category;const value=p.value;const b=buckets.get(key)||{key,income:0,expense:0,count:0};b[t.kind]+=value;b.count++;buckets.set(key,b);}}
 return {income,expense,net:income-expense,rows,monthly:[...monthly.values()].sort((a,b)=>a.month.localeCompare(b.month)),groups:[...buckets.values()].sort((a,b)=>(b.income+b.expense)-(a.income+a.expense)),view,fxDate:s.fx.date,fxSource:s.fx.source};
}
function baseline(s,c,start,view){const v=scope(s,view);if(c.baseline==='plan')return {incomeRows:v.flows.filter(f=>f.kind==='income').map(f=>({ownerId:f.ownerId,amount:E.reporting(s,f,'amount')})),expense:E.sum(v.flows.filter(f=>f.kind==='expense').map(f=>E.reporting(s,f,'amount'))),source:'plan',months:0};
 const month=start.slice(0,7)+'-01',d=new Date(month+'T12:00:00Z');d.setUTCMonth(d.getUTCMonth()-12);const from=d.toISOString().slice(0,10),tx=scopedTransactions(s,view).filter(t=>t.date>=from&&t.date<month&&t.kind!=='transfer'&&t.status!=='pending'&&!t.hiddenFromReports);const owners=new Map();for(const t of tx.filter(t=>t.kind==='income')){for(const p of t.splits?.length?reportParts(s,t).filter(p=>matches(s,p.ownerId,view)):[{ownerId:transactionOwner(s,t),value:reported(s,t)}])owners.set(p.ownerId,(owners.get(p.ownerId)||0)+p.value);}
 const recordedMonths=new Set(tx.map(t=>t.date.slice(0,7))).size;
 // Available means elapsed complete months since the earliest included record, including interior zero months.
 const earliest=tx.length?tx.map(t=>t.date.slice(0,7)).sort()[0]:null;
 const available=earliest?Math.min(12,(Number(month.slice(0,4))-Number(earliest.slice(0,4)))*12+Number(month.slice(5,7))-Number(earliest.slice(5,7))):0;
 const divisor=c.historyPolicy==='available'?Math.max(1,available):12;
 return {incomeRows:[...owners].map(([ownerId,amount])=>({ownerId,amount:Math.round(amount/divisor)})),expense:Math.round(E.sum(tx.filter(t=>t.kind==='expense').map(t=>reported(s,t)))/divisor),source:'history',months:recordedMonths,coverageMonths:available,divisor,policy:c.historyPolicy||'fixed12'};
}
const loanPayment=(balance,apr,months)=>apr?Math.ceil(balance*(apr/1200)/(1-Math.pow(1+apr/1200,-months))):Math.ceil(balance/months);
function forecast(s,c=s.forecastPlan,{view=s.activeView,start=new Date().toISOString().slice(0,10),returnSampler=null,retainMonthly=true}={}){
 validateView(s,view);validatePlan(s,c);if(!E.validDate(start))throw Error('Invalid forecast start');const v=scope(s,view),base=baseline(s,c,start,view),startMonth=start.slice(0,7),events=c.events.filter(e=>matches(s,e.ownerId,view));
 const assets=v.accounts.filter(a=>c.accounts[a.id]?.included!==false).map(a=>({id:a.id,name:a.name,type:a.type,balance:E.reporting(s,a,'balance'),growth:c.accounts[a.id]?.growth??(a.type==='Investment'?c.investmentGrowth:a.type==='Property'?c.propertyGrowth:c.cashGrowth)}));
 if(!assets.some(a=>['Checking','Savings','Cash'].includes(a.type)))assets.push({id:'forecast_cash',name:'Projected cash',type:'Cash',balance:0,growth:c.cashGrowth});const cash=assets.filter(a=>['Checking','Savings','Cash'].includes(a.type)),investments=assets.filter(a=>a.type==='Investment');
 const debts=v.debts.map(d=>({id:d.id,name:d.name,balance:E.reporting(s,d,'balance'),apr:d.apr,minimum:E.reporting(s,d,'minimum')}));let gap=0,hadShortfall=false;for(const a of assets){if(a.balance<0){if(!cash.includes(a))throw Error('Negative non-cash assets are unsupported');gap-=a.balance;a.balance=0;}}const monthly=[],annual=[];let totals={income:0,expense:0,debtPayment:0,interest:0,growth:0,contribution:0,withdrawal:0,goalReserve:0};let retirement=null;let reserved=E.sum(v.goals.map(g=>E.reporting(s,g,'saved')));const goalGaps=v.goals.map(g=>({remaining:Math.max(0,E.reporting(s,g,'target')-E.reporting(s,g,'saved')),monthly:E.reporting(s,g,'monthly')}));
 const snapshot=(month,year,at)=>{const assetTotal=E.sum(assets.map(a=>a.balance)),debtTotal=E.sum(debts.map(d=>d.balance)),liquid=E.sum(cash.map(a=>a.balance));const r={month,date:at,year,age:c.startAge+month/12,assets:assetTotal,debt:debtTotal,fundingGap:gap,liabilities:debtTotal+gap,netWorth:assetTotal-debtTotal-gap,realNetWorth:Math.round((assetTotal-debtTotal-gap)/Math.pow(1+c.inflation,month/12)),liquid,investable:liquid+E.sum(investments.map(a=>a.balance)),accounts:assets.map(a=>({id:a.id,name:a.name,type:a.type,balance:a.balance})),debts:debts.map(d=>({id:d.id,name:d.name,balance:d.balance})),...totals};for(const n of Object.values(r))if(typeof n==='number'&&!Number.isFinite(n))throw Error('Forecast exceeds supported precision');for(const n of [r.assets,r.debt,r.netWorth,r.fundingGap])if(!Number.isSafeInteger(n))throw Error('Forecast exceeds supported precision');return r;};
 const distribute=(amount,month=1)=>{if(amount>=0){const recover=Math.min(gap,amount);gap-=recover;cash[0].balance+=amount-recover;return;}let required=-amount;for(const a of [...cash,...investments].filter(a=>month>=(c.accounts[a.id]?.withdrawalStartYear||1)*12-11).sort((a,b)=>(c.accounts[a.id]?.withdrawalRank??(a.type==='Investment'?50:0))-(c.accounts[b.id]?.withdrawalRank??(b.type==='Investment'?50:0)))){const paid=Math.min(Math.max(0,a.balance),required);a.balance-=paid;required-=paid;if(investments.includes(a))totals.withdrawal+=paid;if(!required)break;}gap+=required;};
 const initial=snapshot(0,0,start);if(retainMonthly)monthly.push(initial);annual.push(initial);
 for(let m=1;m<=c.years*12;m++){
  const stamp=new Date(startMonth+'-01T12:00:00Z');stamp.setUTCMonth(stamp.getUTCMonth()+m);const at=stamp.toISOString().slice(0,10),ym=at.slice(0,7),years=(m-1)/12;
  let growth=0;for(const a of assets){const schedule=c.accounts[a.id]?.growthSchedule||[],annualRate=[...schedule].filter(r=>r.year<=Math.ceil(m/12)).sort((a,b)=>b.year-a.year)[0]?.rate??a.growth;const factor=returnSampler&&a.type==='Investment'?returnSampler(a,m,annualRate):Math.pow(1+annualRate,1/12);if(!Number.isFinite(factor)||factor<=0)throw Error('Invalid projected return');const next=Math.round(a.balance*factor);growth+=next-a.balance;a.balance=next;}
  const active=events.filter(e=>e.date.slice(0,7)<=ym&&(!e.endDate||e.endDate.slice(0,7)>=ym)),stops=active.filter(e=>e.type==='retirement'||e.type==='careerBreak');
  let income=Math.round(E.sum(base.incomeRows.filter(row=>!stops.some(e=>e.ownerId==='shared'||e.ownerId===row.ownerId)).map(row=>row.amount))*Math.pow(1+(c.incomeGrowthMode==='inflation'?c.inflation:c.incomeGrowth),years));let expense=Math.round(base.expense*Math.pow(1+(c.expenseGrowthMode==='inflation'?c.inflation:c.expenseGrowth),years));
  for(const e of active){const eventYears=Math.max(0,(Date.parse(at)-Date.parse(e.date.slice(0,7)+'-01'))/31557600000);if(['incomeMonthly','retirement','careerBreak'].includes(e.type))income+=Math.round(E.convert(s,e.amount,e.currency||s.currency)*Math.pow(1+(c.incomeGrowthMode==='inflation'?c.inflation:c.incomeGrowth),eventYears));if(e.type==='expenseMonthly')expense+=Math.round(E.convert(s,e.amount,e.currency||s.currency)*Math.pow(1+(c.expenseGrowthMode==='inflation'?c.inflation:c.expenseGrowth),eventYears));if(e.date.slice(0,7)===ym&&e.type==='expenseOnce')expense+=E.convert(s,e.amount,e.currency||s.currency);
   if(e.date.slice(0,7)===ym&&e.type==='home'){const price=E.convert(s,e.amount,e.currency||s.currency),down=Math.round(price*e.downPayment/100),loan=price-down;expense+=down;assets.push({id:'home_'+e.id,name:e.name,type:'Property',balance:price,growth:c.propertyGrowth});if(loan)debts.push({id:'loan_'+e.id,name:e.name+' · Loan',balance:loan,apr:e.apr,minimum:loanPayment(loan,e.apr,e.termYears*12)});}
  }
  let debtPayment=0,interest=0;for(const d of debts){if(d.balance<=0)continue;const accrued=Math.round(d.balance*d.apr/1200),paid=Math.min(d.minimum,d.balance+accrued);d.balance+=accrued-paid;interest+=accrued;debtPayment+=paid;}
  let goalReserve=0;
  totals.income+=income;totals.expense+=expense;totals.debtPayment+=debtPayment;totals.interest+=interest;totals.growth+=growth;
  distribute(income-expense-debtPayment,m);if(gap>0)hadShortfall=true;let reserveCapacity=Math.max(0,E.sum(cash.map(a=>a.balance))-reserved);for(const g of goalGaps){const funded=Math.min(g.remaining,g.monthly,reserveCapacity);g.remaining-=funded;reserveCapacity-=funded;goalReserve+=funded;}reserved+=goalReserve;totals.goalReserve+=goalReserve;
  let contribution=0;if(investments.length&&gap===0){contribution=Math.min(E.convert(s,c.monthlyInvestment,c.currency),Math.max(0,E.sum(cash.map(a=>a.balance))-reserved));let left=contribution;for(const a of cash){const paid=Math.min(Math.max(0,a.balance),left);a.balance-=paid;left-=paid;}investments[0].balance+=contribution;totals.contribution+=contribution;}
  if(retainMonthly)monthly.push({...snapshot(m,Math.ceil(m/12),at),income,expense,debtPayment,interest,growth,contribution,goalReserve});
  if(!retirement&&active.some(e=>e.type==='retirement'))retirement=snapshot(m,Math.ceil(m/12),at);
  if(m%12===0){annual.push(snapshot(m,m/12,at));totals={income:0,expense:0,debtPayment:0,interest:0,growth:0,contribution:0,withdrawal:0,goalReserve:0};}
 }
 return {monthly,annual,initial,ending:annual.at(-1),retirement,baseline:base,events,fx:{date:s.fx.date,source:s.fx.source},shortfall:hadShortfall||annual.some(r=>r.fundingGap>0)||(retirement?.fundingGap>0)||monthly.some(r=>r.fundingGap>0)};
}
function monteCarlo(s,c,{view=s.activeView,start,paths=300,seed=42}={}){if(!Number.isInteger(paths)||paths<100||paths>1000||!Number.isInteger(seed))throw Error('Use 100–1000 paths and an integer seed');let x=seed>>>0;const uniform=()=>{x=(x+0x6D2B79F5)>>>0;let t=Math.imul(x^(x>>>15),1|x);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};const normal=()=>Math.sqrt(-2*Math.log(Math.max(uniform(),Number.MIN_VALUE)))*Math.cos(2*Math.PI*uniform());const years=Array.from({length:c.years+1},()=>[]);let success=0,shortfalls=0;
 for(let p=0;p<paths;p++){let lastMonth=0,z=0;const r=forecast(s,c,{view,start,retainMonthly:false,returnSampler:(a,m,mean)=>{if(m!==lastMonth){lastMonth=m;z=normal();}return Math.exp((Math.log1p(mean)-c.volatility*c.volatility/2)/12+c.volatility/Math.sqrt(12)*z);}});r.annual.forEach((r,i)=>years[i].push(r.realNetWorth));if(r.ending.realNetWorth>=E.convert(s,c.target,c.currency))success++;if(r.shortfall)shortfalls++;}
 const q=(a,p)=>{const i=(a.length-1)*p,lo=Math.floor(i),hi=Math.ceil(i);return Math.round(a[lo]+(a[hi]-a[lo])*(i-lo));};return {paths,seed,success:success/paths,shortfalls:shortfalls/paths,bands:years.map((a,year)=>{a.sort((a,b)=>a-b);return {year,p10:q(a,.1),p50:q(a,.5),p90:q(a,.9)};})};
}
function splitPercent(s,t,weights){if(!Array.isArray(weights)||weights.length<2||weights.some(p=>!validOwner(s,p.ownerId)||!Number.isInteger(p.amount)||p.amount<=0)||new Set(weights.map(p=>p.ownerId)).size!==weights.length||E.sum(weights.map(p=>p.amount))!==10000)throw Error('Percentages must total exactly 100');const rows=weights.map(p=>{const product=BigInt(t.amount)*BigInt(p.amount);return {ownerId:p.ownerId,amount:Number(product/10000n),remainder:product%10000n};});let remaining=t.amount-E.sum(rows.map(r=>r.amount));for(const r of [...rows].sort((a,b)=>a.remainder>b.remainder?-1:a.remainder<b.remainder?1:0)){if(remaining){r.amount++;remaining--;}}return rows.filter(r=>r.amount>0).map(({ownerId,amount})=>({ownerId,amount}));}
function setTransactionOwnership(s,id,ownerId,splits=[]){const t=s.transactions.find(t=>t.id===id);if(!t)throw Error('Transaction missing');if(ownerId!==null&&!validOwner(s,ownerId))throw Error('Unknown owner');if(splits.length)validateSplits(s,t,splits);t.ownerId=ownerId;t.splits=splits;return t;}
function snapshot(s,today){if(!E.validDate(today))throw Error('Invalid snapshot date');const row={date:today,fx:structuredClone(s.fx),accounts:s.accounts.map(({id,balance,currency,ownerId})=>({id,balance,currency,ownerId})),debts:s.debts.map(({id,balance,currency,ownerId})=>({id,balance,currency,ownerId}))};s.positionHistory=s.positionHistory.filter(h=>h.date!==today).concat(row).sort((a,b)=>a.date.localeCompare(b.date)).slice(-3650);return row;}
function history(s,filter,view=s.activeView){return s.positionHistory.filter(h=>h.date>=filter.from&&h.date<=filter.to).map(h=>{const convert=(r)=>E.convert({...s,fx:h.fx},r.balance,r.currency);const assets=E.sum(h.accounts.filter(r=>matches(s,r.ownerId,view)).map(convert)),debt=E.sum(h.debts.filter(r=>matches(s,r.ownerId,view)).map(convert));return {date:h.date,assets,debt,netWorth:assets-debt};});}
const oldMigrate=E.migrate,oldValidate=E.validate,oldApply=E.applyTransaction;E.migrate=s=>migrate(oldMigrate(s));E.validate=s=>{oldValidate(s);migrate(s);return validate(s);};E.applyTransaction=(s,t)=>{migrate(s);t.ownerId??=null;if(t.ownerId!==null&&!validOwner(s,t.ownerId))throw Error('Unknown transaction owner');if(t.splits?.length)validateSplits(s,t,t.splits);return oldApply(s,t);};
function deleteTransaction(s,id){
 const next=structuredClone(s),index=next.transactions.findIndex(t=>t.id===id),tx=next.transactions[index];if(!tx)throw Error('Transaction missing');
 if(tx.goalId&&tx.kind==='expense'){const goal=next.goals?.find(g=>g.id===tx.goalId);if(goal){const restored=E.convert(next,tx.amount,tx.currency||next.currency,goal.currency||next.currency);goal.saved+=restored;}}
 if(tx.balanceApplied!==false){const account=next.accounts.find(a=>a.id===tx.accountId);if(!account)throw Error('Original account missing');const balance=account.balance+(tx.kind==='income'||tx.refundOf?-tx.amount:tx.amount);if(!Number.isSafeInteger(balance))throw Error('Balance exceeds supported precision');account.balance=balance;
   if(tx.kind==='transfer'){const target=next.accounts.find(a=>a.id===tx.targetId);if(!target)throw Error('Original destination missing');const received=tx.targetAmount??(account.currency===target.currency?tx.amount:null);if(!Number.isSafeInteger(received))throw Error('Original received amount missing; cannot safely reverse cross-currency transfer');const value=target.balance-received;if(!Number.isSafeInteger(value))throw Error('Balance exceeds supported precision');target.balance=value;}
 }
 next.transactions.splice(index,1);E.validate(next);return next;
}
function editTransaction(s,id,changes){
 const next=structuredClone(s),index=next.transactions.findIndex(t=>t.id===id),old=next.transactions[index];if(!old)throw Error('Transaction missing');
 const fields=['name','date','kind','amount','accountId','targetId','category','goalId'];const tx={...old,...Object.fromEntries(fields.filter(k=>k in changes).map(k=>[k,changes[k]]))};
 if(typeof tx.name!=='string'||!tx.name.trim()||tx.name.length>120||typeof tx.category!=='string'||!tx.category.trim()||tx.category.length>80||!E.validDate(tx.date)||!Number.isSafeInteger(tx.amount)||tx.amount<=0||!['income','expense','transfer'].includes(tx.kind))throw Error('Invalid transaction correction');
 const source=next.accounts.find(a=>a.id===tx.accountId);if(!source)throw Error('Select a valid account');
 if(old.goalId!==tx.goalId||(tx.goalId&&(old.amount!==tx.amount||old.kind!==tx.kind))){
  if(old.goalId&&old.kind==='expense'){const oldGoal=next.goals?.find(g=>g.id===old.goalId);if(oldGoal){oldGoal.saved+=E.convert(next,old.amount,old.currency||next.currency,oldGoal.currency||next.currency);}}
  if(tx.goalId&&tx.kind==='expense'){const newGoal=next.goals?.find(g=>g.id===tx.goalId);if(newGoal){newGoal.saved=Math.max(0,newGoal.saved-E.convert(next,tx.amount,tx.currency||next.currency,newGoal.currency||next.currency));}}
 }
 const financial=old.kind!==tx.kind||old.amount!==tx.amount||old.accountId!==tx.accountId||(tx.kind==='transfer'&&old.targetId!==tx.targetId);
 if(tx.kind==='transfer'&&(!next.accounts.some(a=>a.id===tx.targetId)||tx.targetId===tx.accountId))throw Error('Choose a different destination account');
 if(old.splits?.length&&(old.amount!==tx.amount||old.kind!==tx.kind||old.accountId!==tx.accountId))throw Error('Remove the ownership split before changing amount, type or account; reapply it after correction');
 const adjust=(id,delta)=>{const a=next.accounts.find(a=>a.id===id);if(!a)throw Error('Original account missing');const balance=a.balance+delta;if(!Number.isSafeInteger(balance))throw Error('Balance exceeds supported precision');a.balance=balance;};
 if(financial){
  if(old.balanceApplied!==false){
   adjust(old.accountId,old.kind==='income'||old.refundOf?-old.amount:old.amount);
   if(old.kind==='transfer'){
    const from=next.accounts.find(a=>a.id===old.accountId),to=next.accounts.find(a=>a.id===old.targetId);
    const received=old.targetAmount??(from?.currency===to?.currency?old.amount:null);
    if(!Number.isSafeInteger(received))throw Error('Original received amount missing; cannot safely reverse cross-currency transfer');
    adjust(old.targetId,-received);
   }
  }
  delete tx.targetAmount;delete tx.targetCurrency;delete tx.fxDate;delete tx.fxSource;
  tx.currency=source.currency||next.currency;
  if(tx.kind!=='transfer')delete tx.targetId;
  next.transactions.splice(index,1);
  if(old.balanceApplied!==false){E.applyTransaction(next,tx);next.transactions.shift();next.transactions.splice(index,0,tx);}
  else{if(tx.kind==='transfer'){const target=next.accounts.find(a=>a.id===tx.targetId);tx.targetAmount=E.convert(next,tx.amount,tx.currency,target.currency);tx.targetCurrency=target.currency;tx.fxDate=next.fx.date;tx.fxSource=next.fx.source;}next.transactions.splice(index,0,tx);}
 }else next.transactions[index]=tx;
 E.validate(next);return next;
}
const categoryCatalog=[
 {group:'Income',groupEn:'Income',type:'income',categories:[
  {id:'paychecks',name:'Paychecks',nameId:'Gaji',icon:'💵'},
  {id:'interest',name:'Interest',nameId:'Bunga & Dividen',icon:'💸'},
  {id:'business_income',name:'Business Income',nameId:'Bisnis',icon:'💰'},
  {id:'other_income',name:'Other Income',nameId:'Penghasilan Lainnya',icon:'🪙'}
 ]},
 {group:'Bills & Utilities',groupEn:'Bills & Utilities',type:'expense',categories:[
  {id:'garbage',name:'Garbage',nameId:'Kebersihan & Sampah',icon:'🗑️'},
  {id:'water',name:'Water',nameId:'Air & PDAM',icon:'💧'},
  {id:'gas_electric',name:'Gas & Electric',nameId:'Listrik & Gas',icon:'⚡'},
  {id:'internet_cable',name:'Internet & Cable',nameId:'Internet & TV',icon:'🌐'},
  {id:'phone',name:'Phone',nameId:'Pulsa & Data',icon:'📱'}
 ]},
 {group:'Food & Dining',groupEn:'Food & Dining',type:'expense',categories:[
  {id:'groceries',name:'Groceries',nameId:'Belanja Dapur',icon:'🍏'},
  {id:'restaurants_bars',name:'Restaurants & Bars',nameId:'Restoran & Makan',icon:'🍽️'},
  {id:'coffee_shops',name:'Coffee Shops',nameId:'Kopi & Kafe',icon:'☕'}
 ]},
 {group:'Auto & Transport',groupEn:'Auto & Transport',type:'expense',categories:[
  {id:'auto_payment',name:'Auto Payment',nameId:'Cicilan Kendaraan',icon:'🚗'},
  {id:'public_transit',name:'Public Transit',nameId:'Transportasi Umum',icon:'🚊'},
  {id:'gas',name:'Gas',nameId:'Bensin & BBM',icon:'⛽'},
  {id:'auto_maintenance',name:'Auto Maintenance',nameId:'Servis Kendaraan',icon:'🔧'},
  {id:'parking_tolls',name:'Parking & Tolls',nameId:'Parkir & Tol',icon:'🅿️'},
  {id:'taxi_rideshares',name:'Taxi & Ride Shares',nameId:'Taksi & Ojol',icon:'🚕'}
 ]},
 {group:'Housing',groupEn:'Housing',type:'expense',categories:[
  {id:'mortgage',name:'Mortgage',nameId:'KPR',icon:'🏠'},
  {id:'rent',name:'Rent',nameId:'Sewa & Kos',icon:'🏠'},
  {id:'home_improvement',name:'Home Improvement',nameId:'Renovasi Rumah',icon:'🔨'}
 ]},
 {group:'Gifts & Donations',groupEn:'Gifts & Donations',type:'expense',categories:[
  {id:'charity',name:'Charity',nameId:'Zakat & Donasi',icon:'🎗️'},
  {id:'gifts',name:'Gifts',nameId:'Hadiah',icon:'🎁'}
 ]},
 {group:'Travel & Lifestyle',groupEn:'Travel & Lifestyle',type:'expense',categories:[
  {id:'travel_vacation',name:'Travel & Vacation',nameId:'Liburan & Wisata',icon:'✈️'},
  {id:'entertainment',name:'Entertainment & Recreation',nameId:'Hiburan',icon:'🎟️'},
  {id:'personal',name:'Personal',nameId:'Perawatan Pribadi',icon:'🧘'},
  {id:'pets',name:'Pets',nameId:'Hewan Peliharaan',icon:'🐶'},
  {id:'fun_money',name:'Fun Money',nameId:'Uang Suka-Suka',icon:'🥳'}
 ]}
];
function categoryIcon(name){
 if(!name)return '🏷️';
 const str=String(name).trim();
 const match=str.match(/^(\p{Extended_Pictographic}|\p{Emoji_Presentation})/u);
 if(match)return match[0];
 const lower=str.toLowerCase();
 for(const g of categoryCatalog)for(const c of g.categories)if(c.name.toLowerCase()===lower||(c.nameId&&c.nameId.toLowerCase()===lower))return c.icon;
 if(/gaji|salary|paycheck|income|upah/.test(lower))return '💵';
 if(/bunga|interest|dividen/.test(lower))return '💸';
 if(/bisnis|business/.test(lower))return '💰';
 if(/makan|dining|restaurant|food/.test(lower))return '🍽️';
 if(/kopi|coffee|cafe/.test(lower))return '☕';
 if(/dapur|grocer|belanja|supermarket|pasar/.test(lower))return '🍏';
 if(/listrik|pln|electric|gas/.test(lower))return '⚡';
 if(/air|pdam|water/.test(lower))return '💧';
 if(/internet|wifi|cable|tv/.test(lower))return '🌐';
 if(/pulsa|kuota|phone|telp/.test(lower))return '📱';
 if(/bensin|bbm|pertamax|pertalite|gasoline/.test(lower))return '⛽';
 if(/parkir|tol|toll|parking/.test(lower))return '🅿️';
 if(/ojol|gojek|grab|taxi/.test(lower))return '🚕';
 if(/krl|mrt|bus|transit|kereta/.test(lower))return '🚊';
 if(/sewa|kost|kos|rent/.test(lower))return '🏠';
 if(/kpr|mortgage/.test(lower))return '🏠';
 if(/donasi|zakat|charity|sedekah/.test(lower))return '🎗️';
 if(/hadiah|gift|kado/.test(lower))return '🎁';
 if(/liburan|travel|hotel|flight|pesawat/.test(lower))return '✈️';
 if(/hiburan|nonton|bioskop|entertainment|game/.test(lower))return '🎟️';
 if(/pet|kucing|anjing|hewan/.test(lower))return '🐶';
 if(/transfer|pindah/.test(lower))return '🔄';
 if(/check|cek/.test(lower))return '🧾';
 if(/electronic|elektronik|komputer|laptop|gadget/.test(lower))return '🖥️';
 if(/transit|bus|angkot|public/.test(lower))return '🚌';
 if(/shopping|belanja|toko/.test(lower))return '🛍️';
 if(/kartu|card|cc/.test(lower))return '💳';
 return '🏷️';
}

function monarchCashFlowSankey(s, options = {}) {
  const view = options.view || s.activeView;
  const monthKey = options.monthKey || 'plan';
  let incomeSources = [];
  let fixedCategories = [];
  let flexCategories = [];
  let goalSavings = 0;
  let debtPayments = 0;

  const isPlan = monthKey === 'plan';
  const txs = !isPlan ? scopedTransactions(s, view).filter(t => t.kind !== 'transfer' && t.status !== 'pending' && !t.hiddenFromReports && t.date && t.date.startsWith(monthKey)) : [];

  if (!isPlan && txs.length > 0) {
    const incMap = new Map();
    for (const t of txs.filter(t => t.kind === 'income')) {
      const cat = t.category || 'Other Income';
      const val = reported(s, t);
      incMap.set(cat, (incMap.get(cat) || 0) + val);
    }
    incomeSources = [...incMap.entries()].map(([name, amount]) => ({
      name,
      icon: categoryIcon(name),
      amount
    })).sort((a, b) => b.amount - a.amount);

    const fixedMap = new Map();
    const flexMap = new Map();
    const budgetMap = new Map((s.budgets || []).map(b => [b.category.toLowerCase(), b.group || 'flexible']));

    for (const t of txs.filter(t => t.kind === 'expense')) {
      const cat = t.category || 'Other';
      const val = reported(s, t);
      const group = budgetMap.get(cat.toLowerCase()) || 
        (/rent|sewa|mortgage|kpr|listrik|electric|water|air|pdam|internet|wifi|phone|pulsa|asuransi|insurance|loan|cicilan/i.test(cat) ? 'fixed' : 'flexible');
      if (group === 'fixed') {
        fixedMap.set(cat, (fixedMap.get(cat) || 0) + val);
      } else {
        flexMap.set(cat, (flexMap.get(cat) || 0) + val);
      }
    }
    fixedCategories = [...fixedMap.entries()].map(([name, amount]) => ({ name, icon: categoryIcon(name), amount })).sort((a,b)=>b.amount-a.amount);
    flexCategories = [...flexMap.entries()].map(([name, amount]) => ({ name, icon: categoryIcon(name), amount })).sort((a,b)=>b.amount-a.amount);

    const goalTxs = txs.filter(t => t.goalId && t.kind === 'expense');
    goalSavings = E.sum(goalTxs.map(t => reported(s, t))) || E.sum((s.goals || []).map(g => E.reporting(s, g, 'monthly')));
  } else {
    const v = scope(s, view);
    incomeSources = v.flows.filter(f => f.kind === 'income').map(f => ({
      name: f.name,
      icon: categoryIcon(f.name),
      amount: E.reporting(s, f, 'amount')
    })).sort((a, b) => b.amount - a.amount);

    const expenseFlows = v.flows.filter(f => f.kind === 'expense');
    const budgetMap = new Map((s.budgets || []).map(b => [b.category.toLowerCase(), b.group || 'flexible']));
    const fixedMap = new Map();
    const flexMap = new Map();

    for (const f of expenseFlows) {
      const cat = f.name || 'Expense';
      const val = E.reporting(s, f, 'amount');
      const group = budgetMap.get(cat.toLowerCase()) || 
        (/rent|sewa|mortgage|kpr|listrik|electric|water|air|pdam|internet|wifi|phone|pulsa|asuransi|insurance|loan|cicilan/i.test(cat) ? 'fixed' : 'flexible');
      if (group === 'fixed') {
        fixedMap.set(cat, (fixedMap.get(cat) || 0) + val);
      } else {
        flexMap.set(cat, (flexMap.get(cat) || 0) + val);
      }
    }
    debtPayments = E.sum((v.debts || []).map(d => E.reporting(s, d, 'minimum')));
    if (debtPayments > 0) {
      fixedMap.set('Debt Minimums', (fixedMap.get('Debt Minimums') || 0) + debtPayments);
    }
    fixedCategories = [...fixedMap.entries()].map(([name, amount]) => ({ name, icon: categoryIcon(name), amount })).sort((a,b)=>b.amount-a.amount);
    flexCategories = [...flexMap.entries()].map(([name, amount]) => ({ name, icon: categoryIcon(name), amount })).sort((a,b)=>b.amount-a.amount);
    goalSavings = E.sum((v.goals || []).map(g => E.reporting(s, g, 'monthly')));
  }

  const totalIncome = E.sum(incomeSources.map(i => i.amount));
  const totalFixed = E.sum(fixedCategories.map(c => c.amount));
  const totalFlex = E.sum(flexCategories.map(c => c.amount));
  const totalAllocated = totalFixed + totalFlex + goalSavings;
  const netSurplus = totalIncome - totalAllocated;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.min(100, Math.round(((goalSavings + Math.max(0, netSurplus)) / totalIncome) * 100))) : 0;

  return {
    monthKey,
    isPlan,
    totalIncome,
    totalFixed,
    totalFlex,
    goalSavings,
    totalAllocated,
    netSurplus,
    savingsRate,
    incomeSources,
    pillars: [
      { id: 'goals', name: 'Goals & Investments', nameId: 'Tabungan & Investasi', icon: '🎯', amount: goalSavings, color: '#0d9488' },
      { id: 'fixed', name: 'Fixed Bills & Debts', nameId: 'Tagihan & Kewajiban Tetap', icon: '🔒', amount: totalFixed, color: '#f59e0b' },
      { id: 'flexible', name: 'Flexible Spending', nameId: 'Pengeluaran Fleksibel', icon: '🛍️', amount: totalFlex, color: '#ec4899' }
    ].filter(p => p.amount > 0),
    fixedCategories,
    flexCategories
  };
}

const api={categoryCatalog,categoryIcon,monarchCashFlowSankey,deleteTransaction,editTransaction,cashFlowGraph,reported,reportParts,apportion,splitPercent,snapshot,history,migrate,validate,matchOwner,matches,scope,transactionOwner,visibleAmount,scopedTransactions,validateView,validateSplits,setTransactionOwnership,defaultFilter,validateReportFilter,reports,baseline,loanPayment,validatePlan,forecast,monteCarlo};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.InveysFinance=api;
})(typeof globalThis!=='undefined'?globalThis:this);
