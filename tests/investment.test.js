const {test}=require('node:test');const assert=require('node:assert/strict');const INV=require('../src/investment');
const row=(series,date,value,extra={})=>({series,date,value,flow:0,currency:'USD',fxToIDR:16000,usdToIDR:16000,basis:'total',source:'Test fixture',...extra});
const dates=['2026-01-01','2026-02-01','2026-03-01'];
test('portfolio end-period deposit and withdrawal do not count as investment returns',()=>{
 const data=[row('portfolio',dates[0],100),row('portfolio',dates[1],160,{flow:50}),row('portfolio',dates[2],156,{flow:-20}),row('sp500',dates[0],100),row('sp500',dates[1],110),row('sp500',dates[2],121)];
 const r=INV.compare(data,{currency:'USD',selected:['sp500']});assert.ok(Math.abs(r.series[0].return-.21)<1e-12);assert.ok(Math.abs(r.series[1].return-.21)<1e-12);assert.ok(Math.abs(r.series[1].excess)<1e-12);
});
test('IDR performance includes historical FX changes rather than current workspace FX',()=>{
 const data=[row('portfolio',dates[0],100),row('portfolio',dates[1],100,{fxToIDR:17600,usdToIDR:17600}),row('sp500',dates[0],100),row('sp500',dates[1],100,{fxToIDR:17600,usdToIDR:17600})];
 assert.ok(Math.abs(INV.compare(data,{currency:'IDR',selected:['sp500']}).series[0].return-.1)<1e-12);
 assert.equal(INV.compare(data,{currency:'USD',selected:['sp500']}).series[0].return,0);
});
test('aligned curves share identical start/end dates and rebase period to zero',()=>{
 const data=[...dates.map((d,i)=>row('portfolio',d,[100,110,121][i])),row('sp500',dates[1],200),row('sp500',dates[2],220)];
 const r=INV.compare(data,{selected:['sp500']});assert.deepEqual(r.dates,dates.slice(1));assert.equal(r.series[0].values[0],0);assert.ok(Math.abs(r.series[0].return-.1)<1e-12);
});
test('missing or incompatible benchmark data remains unavailable rather than becoming 0%',()=>{
 const data=[row('portfolio',dates[0],100),row('portfolio',dates[1],110),row('btc',dates[0],100,{basis:'price'}),row('btc',dates[1],110,{basis:'price'})];
 const r=INV.compare(data,{selected:['btc','ihsg']});assert.equal(r.series.length,1);assert.equal(r.unavailable.length,2);assert.match(r.unavailable[0].reason,/basis mismatch/);
 assert.equal(INV.compare([]).series.length,0);
});
test('duplicate dates, inconsistent FX, invalid flows and mixed metadata are rejected',()=>{
 const first=row('portfolio',dates[0],100);
 assert.throws(()=>INV.validate([first,first]),/Duplicate/);
 assert.throws(()=>INV.validate([first,row('sp500',dates[0],100,{fxToIDR:17000,usdToIDR:17000})]),/must match/);
 assert.throws(()=>INV.validate([{...first,flow:20}]),/First observation/);
 assert.throws(()=>INV.validate([first,row('portfolio',dates[1],100,{flow:100})]),/positive/);
 assert.throws(()=>INV.validate([first,row('portfolio',dates[1],100,{source:'Other'})]),/consistent/);
 assert.throws(()=>INV.validate([row('sp500',dates[0],100,{flow:1})]),/Invalid/);
});
test('CSV supports quoted sources, preserves currency units, and rejects future dates',()=>{
 const data=INV.csv(INV.header+'\nportfolio,2026-01-01,100,0,USD,16000,16000,total,"Broker, official"\nportfolio,2026-02-01,110,0,USD,16000,16000,total,"Broker, official"','2026-10-03');
 assert.equal(data[0].value,100);assert.equal(data[0].source,'Broker, official');assert.equal(INV.compare(data,{selected:[]}).series.length,1);
 assert.throws(()=>INV.csv(INV.header+'\nportfolio,2027-01-01,100,0,USD,16000,16000,total,Test','2026-10-03'),/future/);
 assert.throws(()=>INV.csv('wrong,header'),/template header/);
});
test('observed drawdown uses peak-to-trough values and reports benchmark excess in points',()=>{
 const data=[...dates.map((d,i)=>row('portfolio',d,[100,120,90][i])),...dates.map((d,i)=>row('ihsg',d,[100,105,110][i],{currency:'IDR',fxToIDR:1}))];
 const r=INV.compare(data,{currency:'USD',selected:['ihsg']});assert.ok(Math.abs(r.series[0].maxDrawdown+.25)<1e-12);assert.ok(Math.abs(r.series[1].excess+.2)<1e-12);
});
test('calculation does not mutate imported data and never interpolates missing dates',()=>{
 const data=[row('portfolio',dates[0],100),row('portfolio',dates[1],110),row('sp500',dates[1],100),row('sp500',dates[2],110)];const before=JSON.stringify(data);
 const r=INV.compare(data,{selected:['sp500']});assert.equal(r.series.length,0);assert.equal(JSON.stringify(data),before);assert.match(r.unavailable.at(-1).reason,/matching dates/);
});

const E=require('../src/engine');
function holding(extra={}){return {id:'h1',accountId:'a1',symbol:'TEST',name:'Test stock',type:'stock',assetClass:'Equity',currency:'USD',quantity:2.5,price:120,quoteDate:'2026-10-03',source:'Manual',costBasis:200,costFxToIDR:15000,classifications:{},...extra};}
function workspace(){return {currency:'IDR',fx:{rates:{IDR:1,USD:16000,EUR:18000},date:'2026-10-03',source:'Test'},activeView:{owner:'all',includeShared:false},accounts:[{id:'a1',name:'Broker A',type:'Investment',ownerId:'m1',currency:'USD',balance:100000},{id:'a2',name:'Broker B',type:'Investment',ownerId:'shared',currency:'IDR',balance:1600000000}],holdings:[holding(),holding({id:'h2',accountId:'a2',symbol:'FUND',type:'fund',currency:'IDR',quantity:10,price:100000,costBasis:900000,costFxToIDR:1,classifications:{category:'Balanced',legalStructure:'Mutual fund'}})],investmentHistory:[],holdingPrices:[],investmentSnapshots:[]};}
const quote=(holdingId,date,price,extra={})=>({holdingId,date,price,fxToIDR:16000,usdToIDR:16000,source:'Test closing quotes',...extra});
test('holding valuation supports fractional units and cost FX distinct from current FX',()=>{const s=workspace(),before=JSON.stringify(s);INV.validateHoldings(s);const r=INV.positions(s)[0];assert.equal(r.value,480000000);assert.equal(r.cost,300000000);assert.equal(r.gain,180000000);assert.equal(r.gainPercent,.6);assert.equal(INV.positions(s,{currency:'USD'})[0].cost,18750);assert.equal(JSON.stringify(s),before);});
test('account and owner filters apply to holdings and shared holdings appear only when requested',()=>{const s=workspace();assert.equal(INV.positions(s,{account:'a1'}).length,1);assert.equal(INV.positions(s,{view:{owner:'m1',includeShared:false}}).length,1);assert.equal(INV.positions(s,{view:{owner:'m1',includeShared:true}}).length,2);assert.equal(INV.positions(s,{view:{owner:'m2',includeShared:false}}).length,0);assert.equal(INV.positions(s,{fundsOnly:true}).length,1);});
test('unknown and zero cost basis never manufacture gain percentages or complete totals',()=>{const s=workspace();s.holdings[0].costBasis=null;const r=INV.positions(s),summary=INV.summary(r);assert.equal(summary.unknownCost,1);assert.equal(summary.gain,null);assert.equal(summary.cost,null);assert.equal(r[0].gainPercent,null);assert.equal(summary.knownGain,10000000);s.holdings[0].costBasis=0;const zero=INV.positions(s)[0];assert.equal(zero.gain,zero.value);assert.equal(zero.gainPercent,null);assert.equal(INV.summary([]).gain,null);});
test('allocation groups sum to exact holding total and fund metadata stays unclassified when absent',()=>{const s=workspace(),rows=INV.positions(s),groups=INV.group(rows);assert.equal(E.sum(groups.map(g=>g.value)),INV.summary(rows).value);assert.ok(Math.abs(groups.reduce((n,g)=>n+g.weight,0)-1)<1e-12);assert.equal(INV.group(rows,'category').find(g=>g.label==='Unclassified').items.length,1);assert.equal(INV.group(INV.positions(s,{fundsOnly:true}),'category')[0].label,'Balanced');assert.throws(()=>INV.group(rows,'unknown'),/grouping/);});
test('current quantities price backtest weights opening capital rather than averaging returns',()=>{const s=workspace();s.holdingPrices=[quote('h1',dates[0],100),quote('h1',dates[1],120),quote('h2',dates[0],100000,{fxToIDR:1}),quote('h2',dates[1],80000,{fxToIDR:1})];s.investmentHistory=[row('sp500',dates[0],100,{basis:'price'}),row('sp500',dates[1],110,{basis:'price'})];const before=JSON.stringify(s);const r=INV.backtest(s,{currency:'IDR',selected:['sp500']});assert.equal(r.mode,'backtest');assert.ok(Math.abs(r.series[0].return-.12)<1e-12);assert.ok(Math.abs(r.series[1].return-.1)<1e-12);assert.equal(JSON.stringify(s),before);const one=INV.backtest(s,{account:'a1',currency:'USD',selected:['sp500']});assert.ok(Math.abs(one.series[0].return-.2)<1e-12);});
test('backtest incorporates historical FX and never mixes price and total-return benchmarks',()=>{const s=workspace();s.holdingPrices=[quote('h1',dates[0],100),quote('h1',dates[1],100,{fxToIDR:17600,usdToIDR:17600})];s.investmentHistory=[row('sp500',dates[0],100),row('sp500',dates[1],110,{fxToIDR:17600,usdToIDR:17600})];const r=INV.backtest(s,{account:'a1',selected:['sp500']});assert.ok(Math.abs(r.series[0].return-.1)<1e-12);assert.match(r.unavailable[0].reason,/basis mismatch/);assert.equal(INV.backtest(s,{currency:'USD',account:'a1',selected:[]}).series[0].return,0);});
test('missing quote in any selected holding blocks fabricated backtest history',()=>{const s=workspace();s.holdingPrices=[quote('h1',dates[0],100),quote('h1',dates[1],110)];const r=INV.backtest(s,{selected:[]});assert.equal(r.series.length,0);assert.match(r.unavailable[0].reason,/every selected holding/);assert.equal(INV.backtest({...s,holdings:[]}).series.length,0);});
test('quote CSV rejects unknown holdings, duplicate dates, future prices and inconsistent currency FX',()=>{const s=workspace(),csv=INV.priceHeader+'\nh1,2026-01-01,100,16000,16000,"Broker, close"';assert.equal(INV.pricesCSV(s,csv,'2026-10-03')[0].source,'Broker, close');assert.throws(()=>INV.pricesCSV(s,csv+'\nh1,2026-01-01,200,16000,16000,Broker','2026-10-03'),/Duplicate/);assert.throws(()=>INV.pricesCSV(s,csv.replace('h1,','unknown,'),'2026-10-03'),/Invalid/);assert.throws(()=>INV.pricesCSV(s,csv.replace('2026-01-01','2027-01-01'),'2026-10-03'),/future/);assert.throws(()=>INV.pricesCSV(s,csv.replace('100,16000,16000','100,17000,16000'),'2026-10-03'),/Invalid/);});
test('invalid holdings cannot reference a cash account or exceed minor-unit precision',()=>{const s=workspace();s.accounts[0].type='Checking';assert.throws(()=>INV.validateHoldings(s),/Invalid holding/);s.accounts[0].type='Investment';s.holdings[0].quantity=1e12;s.holdings[0].price=1e12;assert.throws(()=>INV.validateHoldings(s),/precision/);s.holdings[0]=holding({quantity:0});assert.throws(()=>INV.validateHoldings(s),/Invalid/);s.holdings[0]=holding({costFxToIDR:0});assert.throws(()=>INV.validateHoldings(s),/Invalid/);});
test('snapshot gain history captures original positions and FX, and overwrite is per date',()=>{const s=workspace();const snap=INV.snapshotHoldings(s,'2026-01-01');assert.equal(snap.rows[0].valueIDR,480000000);s.holdings[0].price=140;s.holdings[0].quantity=5;s.accounts[0].ownerId='m2';INV.snapshotHoldings(s,'2026-02-01');assert.equal(s.investmentSnapshots.length,2);assert.equal(INV.gainsHistory(s,{view:{owner:'m1',includeShared:false}})[0].gain,180000000);assert.equal(INV.gainsHistory(s,{view:{owner:'m1',includeShared:false}})[1].gain,null);assert.equal(INV.gainsHistory(s,{currency:'USD',account:'a1'})[0].gain,11250);INV.snapshotHoldings(s,'2026-02-01');assert.equal(s.investmentSnapshots.length,2);s.holdings[0].costBasis=null;INV.snapshotHoldings(s,'2026-03-01');assert.equal(INV.gainsHistory(s).at(-1).gain,null);});
test('period shortcuts handle calendar boundaries and CSV export neutralizes formulas',()=>{assert.deepEqual(INV.period('1w','2026-01-03'),{from:'2025-12-27',to:'2026-01-03'});assert.equal(INV.period('ytd','2026-10-03').from,'2026-01-01');assert.throws(()=>INV.period('bad','2026-10-03'),/period/);assert.match(INV.csvRows([['=SUM(A1)','<img>','"quoted"']]),/"'=SUM/);assert.match(INV.csvRows([['-2']]),/"'-2"/);});

test('display comparison never shortens portfolio dates when benchmark coverage is sparse',()=>{const data=[...dates.map((d,i)=>row('portfolio',d,[100,110,121][i])),row('sp500',dates[0],100),row('sp500',dates[2],120)];const p=INV.displayCompare(data,{currency:'USD',selected:[]}),r=INV.displayCompare(data,{currency:'USD',selected:['sp500']});assert.deepEqual(r.dates,dates);assert.deepEqual(r.series[0],p.series[0]);assert.equal(r.series[1].values[1],null);assert.equal(r.series[1].coverage,2);assert.equal(r.series[1].missing,1);assert.ok(Math.abs(r.series[0].return-.21)<1e-12);});
test('missing benchmark start is excluded explicitly without rebasing the portfolio',()=>{const data=[...dates.map((d,i)=>row('portfolio',d,100+i*10)),row('sp500',dates[1],100),row('sp500',dates[2],120)];const r=INV.displayCompare(data,{selected:['sp500']});assert.deepEqual(r.dates,dates);assert.equal(r.series.length,1);assert.match(r.unavailable[0].reason,/start date/);});
test('missing benchmark end has no comparable period return or excess',()=>{const data=[...dates.map((d,i)=>row('portfolio',d,100+i*10)),row('sp500',dates[0],100),row('sp500',dates[1],110)];const r=INV.displayCompare(data,{selected:['sp500']}),b=r.series[1];assert.equal(b.return,null);assert.equal(b.excess,null);assert.equal(b.lastDate,dates[1]);assert.ok(Math.abs(b.latestReturn-.1)<1e-12);});
test('display values include deposits while TWR excludes them',()=>{const data=[row('portfolio',dates[0],100),row('portfolio',dates[1],160,{flow:50})],r=INV.displayCompare(data,{currency:'USD',selected:[]});assert.deepEqual(r.series[0].capitalValues,[10000,16000]);assert.ok(Math.abs(r.series[0].return-.1)<1e-12);const g=INV.chartGeometry(r,'value');assert.deepEqual(g.series[0].values,[10000,16000]);});
test('1D means the last two observations, preserving actual dates across non-trading days',()=>{const data=[row('portfolio','2026-10-01',100),row('portfolio','2026-10-02',110),row('portfolio','2026-10-05',121)],r=INV.displayCompare(data,{range:'1d',from:'2026-10-04',to:'2026-10-05',selected:[]});assert.deepEqual(r.dates,['2026-10-02','2026-10-05']);assert.ok(Math.abs(r.series[0].return-.1)<1e-12);assert.equal(r.series[0].changeFrom,'2026-10-02');});
test('display returns use historical IDR FX and preserve USD return',()=>{const data=[row('portfolio',dates[0],100),row('portfolio',dates[1],100,{fxToIDR:17600,usdToIDR:17600})],idr=INV.displayCompare(data,{currency:'IDR',selected:[]}),usd=INV.displayCompare(data,{currency:'USD',selected:[]});assert.ok(Math.abs(idr.series[0].return-.1)<1e-12);assert.equal(usd.series[0].return,0);assert.deepEqual(idr.series[0].capitalValues,[160000000,176000000]);});
test('chart hit testing and x positions use calendar spacing instead of observation index',()=>{const ds=['2026-01-01','2026-01-02','2026-12-31'];assert.equal(INV.nearestObservation(ds,.1),1);assert.equal(INV.nearestObservation(ds,.99),2);assert.equal(INV.nearestObservation(ds,-1),0);assert.equal(INV.nearestObservation([],0),-1);const r=INV.displayCompare(ds.map((d,i)=>row('portfolio',d,100+i)),{selected:[]}),g=INV.chartGeometry(r);assert.ok(g.x(1)-g.x(0)<3);assert.equal(g.x(2),890);});
test('benchmark gaps create disconnected chart segments and never fabricated zeroes',()=>{const ds=['2026-01-01','2026-01-02','2026-01-03','2026-01-04','2026-01-05'],data=[...ds.map(d=>row('portfolio',d,100)),...[0,1,3,4].map(i=>row('sp500',ds[i],100+i))],r=INV.displayCompare(data,{selected:['sp500']}),g=INV.chartGeometry(r);assert.equal(g.series[1].segments.length,2);assert.deepEqual(g.series[1].segments.map(s=>s.map(p=>p.index)),[[0,1],[3,4]]);});
test('constant and negative-return charts retain a finite nonzero scale',()=>{for(const vals of [[100,100,100],[100,90,80]]){const r=INV.displayCompare(dates.map((d,i)=>row('portfolio',d,vals[i])),{selected:[]});for(const metric of ['return','value']){const g=INV.chartGeometry(r,metric);assert.ok(g.hi>g.lo);assert.ok(g.series[0].segments.flat().every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));}}});
test('chart sampling retains narrow extrema and endpoints in a long series',()=>{const ds=Array.from({length:1200},(_,i)=>new Date(Date.UTC(2020,0,i+1)).toISOString().slice(0,10)),values=ds.map((_,i)=>i===613?-0.9:i===614?4:0),g=INV.chartGeometry({dates:ds,series:[{id:'portfolio',values}]});const ids=g.series[0].segments.flat().map(p=>p.index);assert.ok(ids.includes(613));assert.ok(ids.includes(614));assert.ok(ids.includes(0));assert.ok(ids.includes(1199));assert.ok(ids.length<1200);});
test('display basis mismatch leaves portfolio usable and explains missing benchmark',()=>{const data=[row('portfolio',dates[0],100),row('portfolio',dates[1],110),row('sp500',dates[0],100,{basis:'price'}),row('sp500',dates[1],120,{basis:'price'})],r=INV.displayCompare(data,{selected:['sp500']});assert.equal(r.series.length,1);assert.match(r.unavailable[0].reason,/basis mismatch/);});
test('new performance engine scopes individual holdings without falling back to household history',()=>{const s=workspace();s.holdingPrices=[quote('h1',dates[0],100),quote('h1',dates[1],120)];s.investmentHistory=[row('portfolio',dates[0],999),row('portfolio',dates[1],9999)];const before=JSON.stringify(s),asset=INV.performance(s,{currency:'USD',holding:'h1',selected:[]}),whole=INV.performance(s,{currency:'USD',selected:[]}),other=INV.performance(s,{currency:'USD',holding:'h1',view:{owner:'m2',includeShared:false},selected:[]});assert.ok(Math.abs(asset.series[0].return-.2)<1e-12);assert.deepEqual(asset.series[0].capitalValues,[25000,30000]);assert.equal(whole.series.length,0);assert.match(whole.unavailable[0].reason,/historical quotes/);assert.equal(other.series.length,0);assert.equal(JSON.stringify(s),before);});

test('portfolio target allocation rebalancer computes drift, recommendations and cash-only distribution',()=>{
  assert.equal(INV.rebalancePresets.length, 4);
  const classic = INV.rebalancePresets.find(p => p.id === 'classic-60-40');
  assert.ok(classic);
  assert.equal(classic.targets.reduce((acc, t) => acc + t.percent, 0), 100);

  const holdings = [
    { assetClass: 'Equity', value: 800000 },
    { assetClass: 'Fixed Income', value: 200000 }
  ];
  const targets = [
    { assetClass: 'Equity', percent: 60 },
    { assetClass: 'Fixed Income', percent: 40 }
  ];

  // Total = 1,000,000. Equity = 80%, Fixed Income = 20%
  // Drift: Equity = +20% (overweight), Fixed Income = -20% (underweight)
  const full = INV.rebalancePortfolio(holdings, targets);
  assert.equal(full.currentTotal, 1000000);
  assert.equal(full.isTargetValid, true);
  assert.ok(full.driftScore < 90);
  const eq = full.classes.find(c => c.assetClass === 'Equity');
  const fi = full.classes.find(c => c.assetClass === 'Fixed Income');
  assert.equal(eq.status, 'overweight');
  assert.equal(eq.action, 'SELL');
  assert.equal(eq.actionAmount, 200000);
  assert.equal(fi.status, 'underweight');
  assert.equal(fi.action, 'BUY');
  assert.equal(fi.actionAmount, 200000);

  // Cash-only rebalance: deposit 200,000 without selling Equity
  const cashOnly = INV.rebalancePortfolio(holdings, targets, { newCash: 200000 });
  assert.equal(cashOnly.futureTotal, 1200000);
  assert.ok(cashOnly.cashOnlyDistribution.length > 0);
  const fiAlloc = cashOnly.cashOnlyDistribution.find(d => d.assetClass === 'Fixed Income');
  assert.ok(fiAlloc.addCash > 0);
});

test('Pegadaian gold installment model computes metrics, amortization schedule and CAGR scenarios accurately',()=>{
  const c = INV.defaultGoldContract;
  assert.equal(c.contractNo, '1379326370001000');
  assert.equal(c.borrowerName, 'Muhamad Hendra Febriansyah');
  assert.equal(c.weightGrams, 50.0);
  assert.equal(c.initialPurchasePrice, 126604000);
  assert.equal(c.totalCommitment, 166914120);
  assert.equal(c.breakEvenPricePerGram, 3338282);

  const m0 = INV.goldInstallmentMetrics(c, 2532080, 0);
  assert.equal(m0.currentMarketValue, 126604000);
  assert.equal(m0.remainingPrincipal, 107613400);
  assert.equal(m0.equityPrincipal, 18990600);
  assert.equal(m0.equityPercent, 15.0);
  assert.equal(m0.netEquity, 18990600);
  assert.equal(m0.totalCashOut, 19040600);
  assert.equal(m0.breakEvenPrice, 3338282);
  assert.equal(m0.isProfitable, false);

  const m60 = INV.goldInstallmentMetrics(c, 3338282, 60);
  assert.equal(m60.remainingPrincipal, 0);
  assert.equal(m60.equityPercent, 100);
  assert.equal(m60.totalCashOut, 166914120);
  assert.equal(m60.isProfitable, true);
  assert.ok(Math.abs(m60.netProfit) < 100);

  const sched = INV.goldInstallmentSchedule(c);
  assert.equal(sched.length, 60);
  assert.equal(sched[0].month, 1);
  assert.equal(sched[0].principal, 1793557);
  assert.equal(sched[0].fee, 671002);
  assert.equal(sched[0].total, 2464559);
  assert.equal(sched[0].remainingBalance, 105819843);

  assert.equal(sched[59].month, 60);
  assert.equal(sched[59].principal, 1793537);
  assert.equal(sched[59].fee, 671002);
  assert.equal(sched[59].total, 2464539);
  assert.equal(sched[59].remainingBalance, 0);
});
