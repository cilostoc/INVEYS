(function(root){
'use strict';
const E=typeof module!=='undefined'&&module.exports?require('./engine'):root.InveysEngine;
const benchmarks=[{id:'sp500',name:'S&P 500',description:'S&P 500 index'},{id:'us-stock',name:'US Stock',description:'VTI ETF proxy · US total stock market'},{id:'us-bond',name:'US Bond',description:'BND ETF proxy · US investment-grade bonds'},{id:'btc',name:'Bitcoin',description:'BTC spot price · specify exchange / fixing'},{id:'ihsg',name:'IHSG',description:'IDX Composite index'}];
const ids=['portfolio',...benchmarks.map(b=>b.id)];
const header='series,date,value,flow,currency,fxToIDR,usdToIDR,basis,source';
function validate(rows){
 if(!Array.isArray(rows)||rows.length>30000)throw Error('Maximum 30,000 observations');
 const seen=new Set(),meta=new Map(),usd=new Map();
 for(const r of rows){
  if(!r||!ids.includes(r.series)||!E.validDate(r.date)||!['IDR','USD'].includes(r.currency)||!['price','total'].includes(r.basis)||typeof r.source!=='string'||!r.source.trim()||r.source.length>200||![r.value,r.flow,r.fxToIDR,r.usdToIDR].every(Number.isFinite)||r.value<=0||Math.abs(r.value)>1e15||Math.abs(r.flow)>1e15||r.fxToIDR<=0||r.usdToIDR<=0||r.fxToIDR>1e8||r.usdToIDR>1e8||(r.currency==='IDR'&&r.fxToIDR!==1)||(r.currency==='USD'&&r.fxToIDR!==r.usdToIDR)||(r.series!=='portfolio'&&r.flow!==0))throw Error('Invalid investment observation / Observasi investasi tidak valid');
  const key=r.series+'|'+r.date;if(seen.has(key))throw Error('Duplicate series/date / Seri dan tanggal duplikat');seen.add(key);
  const m=[r.currency,r.basis,r.source].join('|');if(meta.has(r.series)&&meta.get(r.series)!==m)throw Error('Currency, basis and source must stay consistent within a series');meta.set(r.series,m);
  if(usd.has(r.date)&&usd.get(r.date)!==r.usdToIDR)throw Error('USD/IDR must match across series on the same date');usd.set(r.date,r.usdToIDR);
 }
 for(const id of meta.keys()){const series=rows.filter(r=>r.series===id);chain(series,'IDR');chain(series,'USD');}
 return rows;
}
function csv(text,today){
 if(typeof text!=='string'||text.length>5000000)throw Error('CSV maximum 5 MB');
 const records=[];let row=[],field='',quoted=false;
 for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else if(quoted||field==='')quoted=!quoted;else throw Error('Invalid CSV quote');}else if(!quoted&&(ch===','||ch==='\n')){row.push(field.trim());field='';if(ch==='\n'){if(row.some(Boolean))records.push(row);row=[];}}else if(ch!=='\r')field+=ch;}
 if(quoted)throw Error('Unclosed CSV quote');row.push(field.trim());if(row.some(Boolean))records.push(row);
 if(records.shift()?.join(',').replace(/^\uFEFF/,'')!==header)throw Error('Use the exact template header / Gunakan header template');
 const rows=records.map(c=>{if(c.length!==9||c.slice(2,7).some((v,i)=>i!==2&&!v))throw Error('Invalid CSV columns');const r={series:c[0],date:c[1],value:Number(c[2]),flow:Number(c[3]),currency:c[4],fxToIDR:Number(c[5]),usdToIDR:Number(c[6]),basis:c[7],source:c[8]};if(today&&r.date>today)throw Error('Historical dates cannot be in the future');return r;});
 return validate(rows);
}
function chain(rows,currency){
 if(!['IDR','USD'].includes(currency))throw Error('Unsupported comparison currency');
 let previous=null,index=1;
 return rows.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(r=>{
  const rate=r.fxToIDR/(currency==='USD'?r.usdToIDR:1),value=r.value*rate,flow=r.flow*rate;
  if(previous===null&&flow!==0)throw Error('First observation must have zero flow');
  if(previous!==null){const ratio=(value-flow)/previous;if(!Number.isFinite(ratio)||ratio<=0)throw Error('End-period flow must leave a positive pre-flow valuation');index*=ratio;}
  if(!Number.isFinite(index)||index<=0)throw Error('Return chain exceeds calculation range');previous=value;return {date:r.date,index};
 });
}
function compare(rows,{from='0000-01-01',to='9999-12-31',currency='IDR',selected=benchmarks.map(b=>b.id)}={}){
 validate(rows);if(from>to||!Array.isArray(selected)||selected.some(id=>!ids.includes(id)||id==='portfolio')||new Set(selected).size!==selected.length)throw Error('Invalid comparison filters');
 const p=rows.filter(r=>r.series==='portfolio');const result={dates:[],series:[],unavailable:[],currency};if(!p.length){result.unavailable=selected.map(id=>({id,reason:'Portfolio history required'}));return result;}
 const candidates=[{id:'portfolio',rows:p}];
 for(const id of selected){const data=rows.filter(r=>r.series===id);if(!data.length)result.unavailable.push({id,reason:'No imported history'});else if(data[0].basis!==p[0].basis)result.unavailable.push({id,reason:'Price / total-return basis mismatch'});else candidates.push({id,rows:data});}
 for(const c of candidates){c.points=chain(c.rows,currency);c.dateSet=new Set(c.points.map(p=>p.date));}
 const dates=candidates[0].points.map(p=>p.date).filter(d=>d>=from&&d<=to&&candidates.every(c=>c.dateSet.has(d)));
 if(dates.length<2){result.unavailable.push({id:'portfolio',reason:'At least two matching dates are required; no interpolation'});return result;}
 result.dates=dates;
 for(const c of candidates){const map=new Map(c.points.map(p=>[p.date,p.index]));const start=map.get(dates[0]);const values=dates.map(d=>map.get(d)/start-1);let peak=1,maxDrawdown=0;for(const value of values){peak=Math.max(peak,1+value);maxDrawdown=Math.min(maxDrawdown,(1+value)/peak-1);}result.series.push({id:c.id,values,return:values.at(-1),maxDrawdown,basis:c.rows[0].basis,source:c.rows[0].source});}
 const portfolio=result.series[0];for(const s of result.series)s.excess=portfolio.return-s.return;return result;
}
// Holdings are analytical detail of account snapshots, never extra ledger assets.
const types=['stock','bond','etf','fund','crypto','cash','other'];
const groupKeys=['assetClass','account','security','category','globalCategory','aggregatedCategory','prospectusObjective','indexStrategy','legalStructure'];
const classificationKeys=groupKeys.filter(k=>!['account','security','assetClass'].includes(k));
const textOK=(v,max=120)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
const validID=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(v);
const units=(n)=>{const v=Math.round(n*100);if(!Number.isSafeInteger(v)||v<0)throw Error('Investment amount exceeds supported precision');return v;};
function validateHoldings(s){
 if(!Array.isArray(s.holdings)||s.holdings.length>2000||!Array.isArray(s.holdingPrices)||s.holdingPrices.length>30000||!Array.isArray(s.investmentSnapshots)||s.investmentSnapshots.length>3650)throw Error('Invalid holdings dataset');
 const seen=new Set();
 for(const h of s.holdings){
  if(!h||!validID(h.id)||seen.has(h.id)||!s.accounts.some(a=>a.id===h.accountId&&a.type==='Investment')||!textOK(h.symbol,30)||!textOK(h.name)||!types.includes(h.type)||!textOK(h.assetClass,80)||!E.currencies.includes(h.currency)||!Number.isFinite(h.quantity)||h.quantity<=0||h.quantity>1e12||!Number.isFinite(h.price)||h.price<0||!E.validDate(h.quoteDate)||!textOK(h.source,200)||!(h.costBasis===null||(Number.isFinite(h.costBasis)&&h.costBasis>=0))||(h.costBasis!==null&&(!Number.isFinite(h.costFxToIDR)||h.costFxToIDR<=0||h.costFxToIDR>1e8||(h.currency==='IDR'&&h.costFxToIDR!==1)))||!h.classifications||Array.isArray(h.classifications)||typeof h.classifications!=='object'||Object.entries(h.classifications).some(([k,v])=>!classificationKeys.includes(k)||typeof v!=='string'||v.length>120))throw Error('Invalid holding / Posisi aset tidak valid');
  units(h.quantity*h.price);units(h.quantity*h.price*s.fx.rates[h.currency]);if(h.costBasis!==null)units(h.costBasis*h.costFxToIDR);seen.add(h.id);
 }
 for(const currency of ['IDR','USD'])E.sum(positions(s,{currency,view:{owner:'all',includeShared:false}}).map(r=>r.value));
 validatePrices(s,s.holdingPrices);
 const dates=new Set();for(const snap of s.investmentSnapshots){if(!snap||!E.validDate(snap.date)||dates.has(snap.date)||!Array.isArray(snap.rows)||snap.rows.length>2000||!Number.isFinite(snap.usdToIDR)||snap.usdToIDR<=0)throw Error('Invalid investment snapshot');dates.add(snap.date);const ids=new Set();for(const r of snap.rows){if(!validID(r.id)||ids.has(r.id)||!validID(r.accountId)||typeof r.ownerId!=='string'||!textOK(r.assetClass,80)||!Number.isSafeInteger(r.valueIDR)||r.valueIDR<0||!(r.costIDR===null||(Number.isSafeInteger(r.costIDR)&&r.costIDR>=0)))throw Error('Invalid snapshot position');ids.add(r.id);}}
 return s;
}
function validatePrices(s,rows){
 if(!Array.isArray(rows)||rows.length>30000)throw Error('Maximum 30,000 security quotes');const seen=new Set(),fx=new Map();
 for(const r of rows){const h=s.holdings.find(h=>h.id===r?.holdingId);if(!r||!h||!E.validDate(r.date)||!Number.isFinite(r.price)||r.price<=0||!Number.isFinite(r.fxToIDR)||r.fxToIDR<=0||r.fxToIDR>1e8||!Number.isFinite(r.usdToIDR)||r.usdToIDR<=0||r.usdToIDR>1e8||!textOK(r.source,200)||(h.currency==='IDR'&&r.fxToIDR!==1)||(h.currency==='USD'&&r.fxToIDR!==r.usdToIDR))throw Error('Invalid security quote');
  const key=r.holdingId+'|'+r.date;if(seen.has(key))throw Error('Duplicate holding/date');seen.add(key);units(h.quantity*r.price*r.fxToIDR);
  for(const [key,value] of [[r.date+'|USD',r.usdToIDR],[r.date+'|'+h.currency,r.fxToIDR]]){if(fx.has(key)&&fx.get(key)!==value)throw Error('Historical FX must match on the same date');fx.set(key,value);}
 }return rows;
}
const priceHeader='holdingId,date,price,fxToIDR,usdToIDR,source';
function pricesCSV(s,text,today){
 // Reuse the strict quoted CSV parser without relaxing the legacy schema.
 const lines=[];let field='',row=[],quoted=false;
 if(typeof text!=='string'||text.length>5000000)throw Error('CSV maximum 5 MB');
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else if(quoted||field==='')quoted=!quoted;else throw Error('Invalid CSV quote');}else if(!quoted&&(c===','||c==='\n')){row.push(field.trim());field='';if(c==='\n'){if(row.some(Boolean))lines.push(row);row=[];}}else if(c!=='\r')field+=c;}
 if(quoted)throw Error('Unclosed CSV quote');row.push(field.trim());if(row.some(Boolean))lines.push(row);
 if(lines.shift()?.join(',').replace(/^\uFEFF/,'')!==priceHeader)throw Error('Use the security quote template header');
 const rows=lines.map(c=>{if(c.length!==6||c.some(v=>!v))throw Error('Invalid security CSV columns');if(today&&c[1]>today)throw Error('Historical dates cannot be in the future');return {holdingId:c[0],date:c[1],price:Number(c[2]),fxToIDR:Number(c[3]),usdToIDR:Number(c[4]),source:c[5]};});return validatePrices(s,rows);
}
function selectedAccounts(s,{account='all',view=s.activeView}={}){
 return s.accounts.filter(a=>a.type==='Investment'&&(account==='all'||a.id===account)&&(!view||view.owner==='all'||a.ownerId===view.owner||(view.includeShared&&a.ownerId==='shared')));
}
function positions(s,{currency=s.currency,account='all',view=s.activeView,fundsOnly=false}={}){
 const accounts=selectedAccounts(s,{account,view});const ids=new Set(accounts.map(a=>a.id));
 return s.holdings.filter(h=>ids.has(h.accountId)&&(!fundsOnly||['etf','fund'].includes(h.type))).map(h=>{
  const a=accounts.find(a=>a.id===h.accountId);const value=E.convert(s,units(h.quantity*h.price),h.currency,currency);
  const cost=h.costBasis===null?null:E.convert(s,units(h.costBasis*h.costFxToIDR),'IDR',currency);
  return {...h,accountName:a.name,ownerId:a.ownerId,value,cost,gain:cost===null?null:value-cost,gainPercent:cost===null||cost===0?null:(value-cost)/cost};
 });
}
function summary(rows){const value=E.sum(rows.map(r=>r.value)),known=rows.filter(r=>r.cost!==null),knownValue=E.sum(known.map(r=>r.value)),knownCost=E.sum(known.map(r=>r.cost)),complete=known.length===rows.length&&rows.length>0;return {value,cost:complete?knownCost:null,gain:complete?value-knownCost:null,gainPercent:complete&&knownCost>0?(value-knownCost)/knownCost:null,knownCost,knownGain:knownValue-knownCost,unknownCost:rows.length-known.length,count:rows.length};}
function group(rows,key='assetClass'){
 if(!groupKeys.includes(key))throw Error('Invalid investment grouping');const buckets=new Map();
 for(const r of rows){const label=key==='account'?r.accountName:key==='security'?r.symbol:key==='assetClass'?r.assetClass:r.classifications[key]||'Unclassified';if(!buckets.has(label))buckets.set(label,[]);buckets.get(label).push(r);}
 const total=E.sum(rows.map(r=>r.value));return [...buckets].map(([label,items])=>({label,...summary(items),weight:total>0?E.sum(items.map(r=>r.value))/total:null,items})).sort((a,b)=>b.value-a.value||a.label.localeCompare(b.label));
}
function period(range,today){if(!E.validDate(today))throw Error('Invalid period end');const end=new Date(today+'T00:00:00Z');let from='0000-01-01';if(range==='ytd')from=today.slice(0,4)+'-01-01';else if(range!=='all'){const days={'1d':1,'1w':7,'1m':30,'3m':90,'6m':180,'1y':365,'5y':1826}[range];if(!days)throw Error('Invalid investment period');end.setUTCDate(end.getUTCDate()-days);from=end.toISOString().slice(0,10);}return {from,to:today};}
function backtest(s,{currency='IDR',account='all',view=s.activeView,from='0000-01-01',to='9999-12-31',selected=benchmarks.map(b=>b.id)}={}){
 const holdings=positions(s,{currency,account,view});const empty={dates:[],series:[],unavailable:[],currency,mode:'backtest'};
 if(!holdings.length){empty.unavailable.push({id:'portfolio',reason:'Add holdings and historical security quotes to backtest'});return empty;}
 const maps=holdings.map(h=>new Map(s.holdingPrices.filter(r=>r.holdingId===h.id).map(r=>[r.date,r])));
 const dates=[...maps[0].keys()].filter(d=>maps.every(m=>m.has(d))).sort();
 if(dates.filter(d=>d>=from&&d<=to).length<2){empty.unavailable.push({id:'portfolio',reason:'At least two matching security quote dates are required for every selected holding'});return empty;}
 const portfolio=dates.map(d=>{const quotes=maps.map(m=>m.get(d));if(quotes.some(q=>q.usdToIDR!==quotes[0].usdToIDR))throw Error('Historical FX must match');const value=holdings.reduce((sum,h,i)=>sum+h.quantity*quotes[i].price*quotes[i].fxToIDR,0);return {series:'portfolio',date:d,value,flow:0,currency:'IDR',fxToIDR:1,usdToIDR:quotes[0].usdToIDR,basis:'price',source:'Fixed current holdings · historical quotes'};});
 // Current quantities are fixed throughout. This is a price backtest, not account TWR.
 return {...compare([...portfolio,...s.investmentHistory.filter(r=>r.series!=='portfolio')],{from,to,currency,selected}),mode:'backtest'};
}
function snapshotHoldings(s,today){if(!E.validDate(today))throw Error('Invalid snapshot date');const snap={date:today,usdToIDR:s.fx.rates.USD,rows:positions(s,{currency:'IDR',view:{owner:'all',includeShared:false}}).map(r=>({id:r.id,accountId:r.accountId,ownerId:r.ownerId,assetClass:r.assetClass,valueIDR:r.value,costIDR:r.cost}))};const next={...s,investmentSnapshots:s.investmentSnapshots.filter(r=>r.date!==today).concat(snap).sort((a,b)=>a.date.localeCompare(b.date)).slice(-3650)};validateHoldings(next);s.investmentSnapshots=next.investmentSnapshots;return snap;}
function gainsHistory(s,{currency='IDR',account='all',view=s.activeView,from='0000-01-01',to='9999-12-31'}={}){
 if(!['IDR','USD'].includes(currency))throw Error('Unsupported history currency');
 return s.investmentSnapshots.filter(snap=>snap.date>=from&&snap.date<=to).map(snap=>{const rows=snap.rows.filter(r=>(account==='all'||r.accountId===account)&&(!view||view.owner==='all'||r.ownerId===view.owner||(view.includeShared&&r.ownerId==='shared')));const complete=rows.length>0&&rows.every(r=>r.costIDR!==null);const gain=complete?E.sum(rows.map(r=>r.valueIDR-r.costIDR)):null;return {date:snap.date,gain:gain===null?null:currency==='USD'?Math.round(gain/snap.usdToIDR):gain};});
}
function csvRows(rows){const quote=v=>{let text=String(v??'');if(/^[\s]*[=+@-]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};return rows.map(r=>r.map(quote).join(',')).join('\r\n');}
const oldMigrate=E.migrate,oldValidate=E.validate;
E.migrate=s=>{const next=oldMigrate(s);if(next?.version===1){next.investmentHistory??=[];next.holdings??=[];next.holdingPrices??=[];next.investmentSnapshots??=[];}return next;};
E.validate=s=>{const next=oldValidate(s);E.migrate(next);validate(next.investmentHistory);validateHoldings(next);return next;};
// Display comparison keeps the portfolio timeline independent of benchmark coverage.
// Missing benchmark observations stay null; no interpolation or forward filling.
function displayCompare(rows,{from='0000-01-01',to='9999-12-31',currency='IDR',selected=benchmarks.map(b=>b.id),range='custom'}={}){
 validate(rows);if(!['IDR','USD'].includes(currency)||from>to||!Array.isArray(selected)||new Set(selected).size!==selected.length||selected.some(id=>!benchmarks.some(b=>b.id===id)))throw Error('Invalid chart filters');
 const result={dates:[],series:[],unavailable:[],currency,requested:{from,to},alignment:'portfolio'};
 const portfolio=rows.filter(r=>r.series==='portfolio');if(!portfolio.length){result.unavailable.push({id:'portfolio',reason:'Portfolio history required'});return result;}
 const source=portfolio.slice().sort((a,b)=>a.date.localeCompare(b.date)),points=chain(source,currency);
 let dates=points.map(p=>p.date).filter(d=>d<=to&&(range==='1d'||d>=from));if(range==='1d')dates=dates.slice(-2);
 if(dates.length<2){result.unavailable.push({id:'portfolio',reason:'At least two portfolio observations are required in this period'});return result;}
 result.dates=dates;const first=dates[0],last=dates.at(-1),basis=source[0].basis;
 const summarize=(id,observations,sourceName)=>{const map=new Map(observations.map(p=>[p.date,p])),start=map.get(first)?.index;if(!start){result.unavailable.push({id,reason:'No observation on the portfolio start date; import matching history'});return;}
  const values=dates.map(d=>map.has(d)?map.get(d).index/start-1:null),count=values.filter(v=>v!==null).length;
  if(count<2){result.unavailable.push({id,reason:'Fewer than two matching observations'});return;}
  let peak=1,maxDrawdown=0;for(const v of values)if(v!==null){peak=Math.max(peak,1+v);maxDrawdown=Math.min(maxDrawdown,(1+v)/peak-1);}
  const lastIndex=values.findLastIndex(v=>v!==null),previous=values.slice(0,lastIndex).findLastIndex(v=>v!==null);
  result.series.push({id,values,return:values.at(-1),latestReturn:values[lastIndex],lastDate:dates[lastIndex],lastChange:previous<0?null:(1+values[lastIndex])/(1+values[previous])-1,changeFrom:previous<0?null:dates[previous],coverage:count,missing:dates.length-count,maxDrawdown,basis,source:sourceName});
 };
 summarize('portfolio',points,source[0].source);
 const raw=new Map(source.map(r=>[r.date,r]));result.series[0].capitalValues=dates.map(d=>{const r=raw.get(d);return units(r.value*r.fxToIDR/(currency==='USD'?r.usdToIDR:1));});
 for(const id of selected){const series=rows.filter(r=>r.series===id);if(!series.length){result.unavailable.push({id,reason:'No imported history'});continue;}if(series[0].basis!==basis){result.unavailable.push({id,reason:'Price / total-return basis mismatch'});continue;}summarize(id,chain(series,currency),series[0].source);}
 const p=result.series[0];for(const s of result.series)s.excess=s.return===null?null:p.return-s.return;
 result.startDate=first;result.endDate=last;result.shortened=from!=='0000-01-01'&&first>from;return result;
}
function performance(s,{currency='IDR',account='all',view=s.activeView,holding='all',mode='auto',...options}={}){
 const selectedHoldings=positions(s,{currency,account,view}).filter(h=>holding==='all'||h.id===holding);
 const chosen=mode==='auto'?(s.holdings.length?'backtest':'actual'):mode;
 const empty={dates:[],series:[],unavailable:[],currency,mode:chosen};
 if(!['backtest','actual'].includes(chosen))throw Error('Unknown performance model');
 if(chosen==='actual'){
  if(account!=='all'||view&&view.owner!=='all'||holding!=='all')return {...empty,unavailable:[{id:'portfolio',reason:'Imported portfolio history covers the whole household; use backtest for account/owner filters.'}]};
  return {...displayCompare(s.investmentHistory,{currency,...options}),mode:chosen};
 }
 if(!selectedHoldings.length)return {...empty,unavailable:[{id:'portfolio',reason:'Add holdings and historical security quotes to backtest'}]};
 const maps=selectedHoldings.map(h=>new Map(s.holdingPrices.filter(r=>r.holdingId===h.id).map(r=>[r.date,r])));
 const missing=selectedHoldings.filter((h,i)=>maps[i].size<2);
 if(missing.length)return {...empty,unavailable:missing.map(h=>({id:h.symbol,reason:'At least two historical quotes are required for this holding'}))};
 const dates=[...maps[0].keys()].filter(d=>maps.every(m=>m.has(d))).sort();
 const portfolio=dates.map(d=>{const quotes=maps.map(m=>m.get(d));if(quotes.some(q=>q.usdToIDR!==quotes[0].usdToIDR))throw Error('Historical FX must match');return {series:'portfolio',date:d,value:selectedHoldings.reduce((sum,h,i)=>sum+h.quantity*quotes[i].price*quotes[i].fxToIDR,0),flow:0,currency:'IDR',fxToIDR:1,usdToIDR:quotes[0].usdToIDR,basis:'price',source:'Fixed current holdings · historical quotes'};});
 return {...displayCompare([...portfolio,...s.investmentHistory.filter(r=>r.series!=='portfolio')],{currency,...options}),mode:chosen,holdingCount:selectedHoldings.length};
}
function nearestObservation(dates,fraction){if(!dates.length)return -1;const stamp=i=>Date.parse(dates[i]+'T00:00:00Z'),f=Math.max(0,Math.min(1,Number(fraction)||0)),target=stamp(0)+(stamp(dates.length-1)-stamp(0))*f;let low=0,high=dates.length-1;while(low<high){const mid=Math.floor((low+high)/2);if(stamp(mid)<target)low=mid+1;else high=mid;}return low&&target-stamp(low-1)<=stamp(low)-target?low-1:low;}
function chartGeometry(result,metric='return'){
 if(!['return','value'].includes(metric)||result.dates.length<2)throw Error('Chart requires a valid metric and two dates');
 const series=metric==='value'?[{...result.series[0],values:result.series[0].capitalValues}]:result.series;
 const values=series.flatMap(s=>s.values).filter(v=>v!==null&&Number.isFinite(v));if(!values.length)throw Error('No chart values');
 let lo=values.reduce((a,b)=>Math.min(a,b),Infinity),hi=values.reduce((a,b)=>Math.max(a,b),-Infinity);if(metric==='return'){lo=Math.min(0,lo);hi=Math.max(0,hi);}const padding=(hi-lo||Math.max(Math.abs(hi)*.05,metric==='return'?.01:100))*.12;lo-=padding;hi+=padding;
 const stamps=result.dates.map(d=>Date.parse(d+'T00:00:00Z')),first=stamps[0],span=stamps.at(-1)-first;
 const x=i=>20+(stamps[i]-first)/span*870,y=v=>260-(v-lo)/(hi-lo)*230;
 // Retain local extrema inside each sampling bucket, endpoints and every gap boundary.
 const sample=arr=>{if(arr.length<=600)return arr.map((_,i)=>i);const chosen=new Set([0,arr.length-1]);const bucket=Math.ceil(arr.length/150);for(let start=0;start<arr.length;start+=bucket){let min=-1,max=-1;for(let i=start;i<Math.min(arr.length,start+bucket);i++){if(arr[i]===null){if(i)chosen.add(i-1);chosen.add(i);if(i+1<arr.length)chosen.add(i+1);continue;}if(min<0||arr[i]<arr[min])min=i;if(max<0||arr[i]>arr[max])max=i;}if(min>=0)chosen.add(min);if(max>=0)chosen.add(max);}return [...chosen].sort((a,b)=>a-b);};
 const plotted=series.map(s=>{const segments=[];let run=[];for(const i of sample(s.values)){if(s.values[i]===null){if(run.length)segments.push(run);run=[];}else run.push({index:i,x:x(i),y:y(s.values[i])});}if(run.length)segments.push(run);return {...s,segments};});
 return {lo,hi,x,y,series:plotted,ticks:Array.from({length:5},(_,i)=>lo+(hi-lo)*i/4)};
}

const rebalancePresets = [
 {id:'classic-60-40',name:'60/40 Classic Balanced',description:'60% Equity / Saham, 40% Fixed Income / Obligasi',targets:[{assetClass:'Equity',percent:60},{assetClass:'Fixed Income',percent:40}]},
 {id:'aggressive-80-20',name:'80/20 Aggressive Growth',description:'80% Equity / Saham, 15% Fixed Income / Obligasi, 5% Cash',targets:[{assetClass:'Equity',percent:80},{assetClass:'Fixed Income',percent:15},{assetClass:'Cash',percent:5}]},
 {id:'all-weather',name:'All-Weather Portfolio',description:'30% Equity, 55% Fixed Income, 15% Commodities',targets:[{assetClass:'Equity',percent:30},{assetClass:'Fixed Income',percent:55},{assetClass:'Commodities',percent:15}]},
 {id:'conservative-30-70',name:'Conservative Income',description:'30% Equity / Saham, 50% Fixed Income, 20% Cash / Pasar Uang',targets:[{assetClass:'Equity',percent:30},{assetClass:'Fixed Income',percent:50},{assetClass:'Cash',percent:20}]}
];

function rebalancePortfolio(holdings,targetAllocations=[],options={}){
 const newCash=Number.isSafeInteger(options.newCash)&&options.newCash>=0?options.newCash:0;
 const tolerance=typeof options.tolerancePercent==='number'?options.tolerancePercent:5;
 const currentTotal=holdings.reduce((sum,h)=>sum+(h.value||0),0);
 const futureTotal=currentTotal+newCash;
 const currentMap=new Map();
 for(const h of holdings){
  const rawClass=(h.assetClass||'Other').trim();
  const matchTarget=(targetAllocations||[]).find(t=>t.assetClass.trim().toLowerCase()===rawClass.toLowerCase());
  const normalizedClass=matchTarget?matchTarget.assetClass.trim():rawClass;
  currentMap.set(normalizedClass,(currentMap.get(normalizedClass)||0)+(h.value||0));
 }
 const allClassSet=new Set();
 for(const t of (targetAllocations||[]))if(t.assetClass&&t.assetClass.trim())allClassSet.add(t.assetClass.trim());
 for(const k of currentMap.keys())allClassSet.add(k);
 const targetMap=new Map();
 let totalTargetPct=0;
 for(const t of (targetAllocations||[])){
  const pct=Number(t.percent)||0;
  targetMap.set(t.assetClass.trim(),pct);
  totalTargetPct+=pct;
 }
 const classes=[];
 let totalDriftAbsolute=0;
 for(const assetClass of allClassSet){
  const currentValue=currentMap.get(assetClass)||0;
  const currentWeight=currentTotal>0?(currentValue/currentTotal)*100:0;
  const targetPercent=targetMap.get(assetClass)||0;
  const driftPercent=currentWeight-targetPercent;
  totalDriftAbsolute+=Math.abs(driftPercent);
  const targetAmount=Math.round(futureTotal*(targetPercent/100));
  const rebalanceDiff=targetAmount-currentValue;
  let status='balanced';
  if(driftPercent>tolerance)status='overweight';
  else if(driftPercent<-tolerance)status='underweight';
  classes.push({
   assetClass,
   currentValue,
   currentWeight:Math.round(currentWeight*10)/10,
   targetPercent:Math.round(targetPercent*10)/10,
   driftPercent:Math.round(driftPercent*10)/10,
   targetAmount,
   rebalanceDiff,
   action:rebalanceDiff>0?'BUY':(rebalanceDiff<0?'SELL':'HOLD'),
   actionAmount:Math.abs(rebalanceDiff),
   status
  });
 }
 classes.sort((a,b)=>b.targetPercent-a.targetPercent||b.currentValue-a.currentValue);
 let cashOnlyDistribution=[];
 if(newCash>0){
  const underweightClasses=classes.filter(c=>c.targetAmount>c.currentValue);
  const totalShortfall=underweightClasses.reduce((acc,c)=>acc+(c.targetAmount-c.currentValue),0);
  cashOnlyDistribution=classes.map(c=>{
   let addCash=0;
   if(c.targetAmount>c.currentValue&&totalShortfall>0){
    const shortfall=c.targetAmount-c.currentValue;
    addCash=Math.min(shortfall,Math.round(newCash*(shortfall/totalShortfall)));
   }
   return {
    assetClass:c.assetClass,
    addCash,
    newEstimatedValue:c.currentValue+addCash,
    newEstimatedWeight:futureTotal>0?Math.round(((c.currentValue+addCash)/futureTotal)*1000)/10:0
   };
  });
  const sumAllocated=cashOnlyDistribution.reduce((acc,d)=>acc+d.addCash,0);
  const diff=newCash-sumAllocated;
  if(diff!==0&&cashOnlyDistribution.length>0){
   const topUnder=cashOnlyDistribution.find(d=>d.addCash>0)||cashOnlyDistribution[0];
   topUnder.addCash+=diff;
   topUnder.newEstimatedValue+=diff;
   topUnder.newEstimatedWeight=futureTotal>0?Math.round((topUnder.newEstimatedValue/futureTotal)*1000)/10:0;
  }
 }
 const driftScore=totalTargetPct>0?Math.max(0,Math.min(100,Math.round(100-(totalDriftAbsolute/2)))):100;
 return {
  currentTotal,
  futureTotal,
  newCash,
  totalTargetPct:Math.round(totalTargetPct*10)/10,
  isTargetValid:Math.round(totalTargetPct)===100,
  driftScore,
  classes,
  cashOnlyDistribution
 };
}

const defaultGoldContract={
 contractNo:'1379326370001000',
 applicationNo:'0217881506505922',
 cif:'1011695038',
 borrowerName:'Muhamad Hendra Febriansyah',
 programName:'Pegadaian Mulia Ultimate',
 brand:'Galeri 24 (PT Pegadaian)',
 purity:'24 Karat (99.99%)',
 objectName:'Emas Batangan 24K Galeri 24 (1 Keping)',
 weightGrams:50.0,
 initialPurchasePrice:126604000,
 initialPricePerGram:2532080,
 downPayment:18990600,
 adminFee:50000,
 totalDownPayment:19040600,
 loanPrincipal:107613400,
 tenorMonths:60,
 monthlyFee:671002,
 monthlyPrincipal:1793557,
 monthlyInstallment:2464559,
 totalLoanRepayment:147873520,
 totalCommitment:166914120,
 breakEvenPricePerGram:3338282,
 startDate:'2026-08-31',
 endDate:'2031-08-31',
 dueDay:31,
 paidMonths:0,
 customSpotPrice:2532080,
 synced:false
};

function goldInstallmentMetrics(c,spotPrice,paidMonths){
 c=Object.assign({},defaultGoldContract,c||{});
 const months=Math.max(0,Math.min(c.tenorMonths,Number.isFinite(paidMonths)?paidMonths:(c.paidMonths||0)));
 const price=Number.isFinite(spotPrice)&&spotPrice>0?spotPrice:(c.customSpotPrice||c.initialPricePerGram);
 const currentMarketValue=Math.round(c.weightGrams*price);
 let principalPaid=0;
 if(months>0){
  if(months>=c.tenorMonths)principalPaid=c.loanPrincipal;
  else principalPaid=months*c.monthlyPrincipal;
 }
 const remainingPrincipal=Math.max(0,c.loanPrincipal-principalPaid);
 let installmentsPaid=0;
 if(months>0){
  if(months>=c.tenorMonths)installmentsPaid=c.totalLoanRepayment;
  else if(months===59)installmentsPaid=59*c.monthlyInstallment;
  else installmentsPaid=months*c.monthlyInstallment;
 }
 const totalCashOut=c.totalDownPayment+installmentsPaid;
 const equityPrincipal=c.downPayment+principalPaid;
 const equityPercent=Math.min(100,Math.round((equityPrincipal/c.initialPurchasePrice)*1000)/10);
 const netEquity=currentMarketValue-remainingPrincipal;
 const netProfit=netEquity-totalCashOut;
 const netRoi=totalCashOut>0?Math.round((netProfit/totalCashOut)*1000)/10:0;
 const breakEvenPrice=Math.round(c.totalCommitment/c.weightGrams);
 const distanceToBep=price-breakEvenPrice;
 const isProfitable=price>=breakEvenPrice;

 const cagrScenarios=[
  {
   name:'Konservatif (+8% p.a.)',
   rate:0.08,
   projectedPrice:Math.round(c.initialPricePerGram*Math.pow(1.08,5)),
   projectedValue:Math.round(c.weightGrams*Math.round(c.initialPricePerGram*Math.pow(1.08,5))),
   netProfit:Math.round(c.weightGrams*Math.round(c.initialPricePerGram*Math.pow(1.08,5)))-c.totalCommitment,
   roi:Math.round(((Math.round(c.weightGrams*Math.round(c.initialPricePerGram*Math.pow(1.08,5)))-c.totalCommitment)/c.totalCommitment)*1000)/10
  },
  {
   name:'Moderat (+12% p.a.)',
   rate:0.12,
   projectedPrice:Math.round(c.initialPricePerGram*Math.pow(1.12,5)),
   projectedValue:Math.round(c.weightGrams*Math.round(c.initialPricePerGram*Math.pow(1.12,5))),
   netProfit:Math.round(c.weightGrams*Math.round(c.initialPricePerGram*Math.pow(1.12,5)))-c.totalCommitment,
   roi:Math.round(((Math.round(c.weightGrams*Math.round(c.initialPricePerGram*Math.pow(1.12,5)))-c.totalCommitment)/c.totalCommitment)*1000)/10
  },
  {
   name:'Bullish / Agresif (+15% p.a.)',
   rate:0.15,
   projectedPrice:Math.round(c.initialPricePerGram*Math.pow(1.15,5)),
   projectedValue:Math.round(c.weightGrams*Math.round(c.initialPricePerGram*Math.pow(1.15,5))),
   netProfit:Math.round(c.weightGrams*Math.round(c.initialPricePerGram*Math.pow(1.15,5)))-c.totalCommitment,
   roi:Math.round(((Math.round(c.weightGrams*Math.round(c.initialPricePerGram*Math.pow(1.15,5)))-c.totalCommitment)/c.totalCommitment)*1000)/10
  }
 ];

 return {
  paidMonths:months,
  spotPrice:price,
  currentMarketValue,
  principalPaid,
  remainingPrincipal,
  installmentsPaid,
  totalCashOut,
  equityPrincipal,
  equityPercent,
  netEquity,
  netProfit,
  netRoi,
  breakEvenPrice,
  distanceToBep,
  isProfitable,
  cagrScenarios
 };
}

function goldInstallmentSchedule(c){
 c=Object.assign({},defaultGoldContract,c||{});
 const schedule=[];
 let balance=c.loanPrincipal;
 const startYear=2026,startMonth=8;
 for(let i=1;i<=c.tenorMonths;i++){
  const m=(startMonth-1+i)%12+1;
  const y=startYear+Math.floor((startMonth-1+i)/12);
  const lastDay=new Date(Date.UTC(y,m,0)).getUTCDate();
  const dueDay=Math.min(31,lastDay);
  const dueDate=`${y}-${String(m).padStart(2,'0')}-${String(dueDay).padStart(2,'0')}`;
  const isLast=(i===c.tenorMonths);
  const principal=isLast?1793537:c.monthlyPrincipal;
  const fee=c.monthlyFee;
  const total=isLast?2464539:c.monthlyInstallment;
  balance=Math.max(0,balance-principal);
  schedule.push({
   month:i,
   dueDate,
   principal,
   fee,
   total,
   remainingBalance:balance,
   paid:i<=(c.paidMonths||0)
  });
 }
 return schedule;
}

const api={defaultGoldContract,goldInstallmentMetrics,goldInstallmentSchedule,rebalancePresets,rebalancePortfolio,displayCompare,performance,nearestObservation,chartGeometry,benchmarks,header,validate,csv,chain,compare,types,groupKeys,classificationKeys,priceHeader,pricesCSV,validatePrices,validateHoldings,selectedAccounts,positions,summary,group,period,backtest,snapshotHoldings,gainsHistory,csvRows};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.InveysInvestment=api;
})(typeof window!=='undefined'?window:globalThis);
