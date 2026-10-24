(function (root) {
  'use strict';
  const cents = value => {
    const match = String(value).trim().match(/^(-?)(\d+)(?:\.(\d{1,2}))?$/);
    if (!match) throw new Error('Enter a valid amount with at most two decimal places.');
    const n = Number(match[2]) * 100 + Number((match[3] || '').padEnd(2, '0'));
    if (!Number.isSafeInteger(n)) throw new Error('Amount is too large.');
    return match[1] ? -n : n;
  };
  const sum = values => values.reduce((a, b) => {
    const total = a + b;
    if (!Number.isSafeInteger(total)) throw new Error('Combined amounts exceed the supported precision.');
    return total;
  }, 0);
  const currencies = ['IDR','USD','EUR','GBP','SGD','AUD','JPY'];
  const demoRates = {IDR:1,USD:16000,EUR:17500,GBP:20500,SGD:12000,AUD:10500,JPY:110};
  function migrate(s) {
    if (!s || s.version !== 1) return s;
    s.language ??= 'id'; s.theme ??= 'light';
    s.fx ??= {rates:{...demoRates},date:'2026-10-03',source:'Illustrative demo rates — not live'};
    for (const key of ['accounts','debts','goals','flows']) for (const row of s[key] || []) row.currency ??= s.currency;
    for (const t of s.transactions || []) t.currency ??= s.accounts?.find(a=>a.id===t.accountId)?.currency || s.currency;
    s.historyCurrency ??= s.currency;
    s.cards ??= []; s.notified ??= {};
    s.subscriptions ??= []; s.billPayments ??= {};
    s.budgets ??= [];
    s.targetAllocations ??= [];
    s.goldInstallment = Object.assign({
      contractNo: '1379326370001000',
      applicationNo: '0217881506505922',
      cif: '1011695038',
      borrowerName: 'Muhamad Hendra Febriansyah',
      programName: 'Pegadaian Mulia Ultimate',
      brand: 'Galeri 24 (PT Pegadaian)',
      purity: '24 Karat (99.99%)',
      objectName: 'Emas Batangan 24K Galeri 24 (1 Keping)',
      weightGrams: 50.0,
      initialPurchasePrice: 126604000,
      initialPricePerGram: 2532080,
      downPayment: 18990600,
      adminFee: 50000,
      totalDownPayment: 19040600,
      loanPrincipal: 107613400,
      tenorMonths: 60,
      monthlyFee: 671002,
      monthlyPrincipal: 1793557,
      monthlyInstallment: 2464559,
      totalLoanRepayment: 147873520,
      totalCommitment: 166914120,
      breakEvenPricePerGram: 3338282,
      startDate: '2026-08-31',
      endDate: '2031-08-31',
      dueDay: 31,
      paidMonths: 0,
      customSpotPrice: 2532080,
      synced: false
    }, s.goldInstallment || {});
    return s;
  }
  function convert(s, value, from, to=s.currency) {
    if (!Number.isSafeInteger(value) || !currencies.includes(from) || !currencies.includes(to)) throw new Error('Invalid currency conversion.');
    if (from===to) return value;
    const rateFrom=s.fx?.rates?.[from],rateTo=s.fx?.rates?.[to];
    if (![rateFrom,rateTo].every(r=>Number.isFinite(r)&&r>0)) throw new Error('A positive exchange rate is required for both currencies.');
    const result=Math.round(value*rateFrom/rateTo);
    if (!Number.isSafeInteger(result)) throw new Error('Converted value exceeds supported precision.');
    return result;
  }
  const reporting = (s, row, field) => convert(s,row[field],row.currency||s.currency);
  const allocations = s => sum(s.goals.map(g=>reporting(s,g,'saved')));
  function position(s) {
    const assets = sum(s.accounts.map(a => reporting(s,a,'balance')));
    const liabilities = sum(s.debts.map(d => reporting(s,d,'balance')));
    const liquid = sum(s.accounts.filter(a => ['Checking', 'Savings', 'Cash'].includes(a.type)).map(a => reporting(s,a,'balance')));
    const income = sum(s.flows.filter(f => f.kind === 'income').map(f => reporting(s,f,'amount')));
    const expenses = sum(s.flows.filter(f => f.kind === 'expense').map(f => reporting(s,f,'amount')));
    const debtPayments = sum(s.debts.map(d => reporting(s,d,'minimum')));
    const outflows = expenses + debtPayments;
    const goalCommitments = sum(s.goals.map(g => reporting(s,g,'monthly')));
    return {assets, liabilities, netWorth: assets - liabilities, liquid, income, expenses, debtPayments, outflows, surplus: income - outflows, goalCommitments, available: income - outflows - goalCommitments, reserveMonths: outflows > 0 ? liquid / outflows : null};
  }
  function forecast(s, {months = 6, incomeDelta = 0, expenseDelta = 0, oneTime = 0} = {}) {
    const p = position(s);
    const monthly = p.available + incomeDelta - expenseDelta;
    return Array.from({length: months + 1}, (_, i) => ({month: i, balance: p.liquid - (i ? oneTime : 0) + monthly * i}));
  }
  function payoff(debt, extra = 0) {
    if (debt.balance <= 0) return {months: 0, interest: 0, feasible: true};
    if (!Number.isFinite(extra) || extra < 0) throw new Error('Extra payment must be nonnegative.');
    const payment = debt.minimum + extra;
    let balance = debt.balance, interestTotal = 0;
    for (let month = 1; month <= 1200; month++) {
      const interest = Math.round(balance * debt.apr / 100 / 12);
      if (payment <= interest) return {months: null, interest: null, feasible: false};
      interestTotal += interest;
      balance = Math.max(0, balance + interest - payment);
      if (!balance) return {months: month, interest: interestTotal, feasible: true};
    }
    return {months: null, interest: null, feasible: false};
  }
  function applyTransaction(s, t) {
    if (!Number.isSafeInteger(t.amount) || t.amount <= 0) throw new Error('Amount must be positive.');
    if (!['income', 'expense', 'transfer'].includes(t.kind)) throw new Error('Invalid transaction type.');
    const account = s.accounts.find(a => a.id === t.accountId);
    if (!account) throw new Error('Select a valid account.');
    if (t.kind === 'transfer') {
      const target = s.accounts.find(a => a.id === t.targetId);
      if (!target || target.id === account.id) throw new Error('Choose a different destination account.');
      const received = convert(s,t.amount,account.currency||s.currency,target.currency||s.currency);
      const from = account.balance - t.amount, to = target.balance + received;
      if (![from, to].every(Number.isSafeInteger)) throw new Error('Transfer exceeds the supported precision.');
      account.balance = from;
      target.balance = to;
      t.targetAmount=received; t.targetCurrency=target.currency||s.currency;
      t.fxDate=s.fx?.date; t.fxSource=s.fx?.source;
    } else {
      const balance = account.balance + (t.kind === 'income' ? t.amount : -t.amount);
      if (!Number.isSafeInteger(balance)) throw new Error('Balance exceeds the supported precision.');
      account.balance = balance;
    }
    account.updated = t.date;
    t.currency=account.currency||s.currency;
    s.transactions.unshift(t);
    return s;
  }
  function fundGoal(s, id, amount) {
    const goal = s.goals.find(g => g.id === id);
    if (!goal || !Number.isSafeInteger(amount) || amount <= 0) throw new Error('Enter a positive allocation.');
    const allocated = allocations(s);
    if (allocated + convert(s,amount,goal.currency||s.currency) > position(s).liquid) throw new Error('This allocation exceeds unallocated liquid funds.');
    goal.saved += amount;
    return goal;
  }
  function spendFromGoal(s, id, amount) {
    const goal = s.goals.find(g => g.id === id);
    if (!goal || !Number.isSafeInteger(amount) || amount <= 0) throw new Error('Enter a positive allocation.');
    if (amount > goal.saved) throw new Error('Spend amount exceeds goal savings.');
    goal.saved -= amount;
    return goal;
  }
  function validateCardImage(image){if(image===undefined||image===null)return;const match=typeof image==='string'&&image.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/);if(!match||image.length>350000||match[2].length%4!==0||!({jpeg:'/9j/',png:'iVBORw0KGgo',webp:'UklGR'}[match[1]]&&match[2].startsWith({jpeg:'/9j/',png:'iVBORw0KGgo',webp:'UklGR'}[match[1]])))throw Error('Invalid card image; use a normalized JPEG/PNG/WebP under 256 KB');}
  function validate(s) {
    migrate(s);
    if (!s || s.version !== 1 || !currencies.includes(s.currency)) throw new Error('Unsupported workspace format.');
    if (!['id','en'].includes(s.language) || !['light','dark'].includes(s.theme)) throw new Error('Invalid language or theme.');
    if (!s.fx || !/^\d{4}-\d{2}-\d{2}$/.test(s.fx.date) || typeof s.fx.source!=='string') throw new Error('Invalid exchange-rate metadata.');
    for (const c of currencies) if (!Number.isFinite(s.fx.rates[c]) || s.fx.rates[c]<=0 || s.fx.rates[c]>1e9) throw new Error('Invalid exchange rate.');
    if (s.fx.rates.IDR!==1) throw new Error('IDR exchange-rate anchor must be 1.');
    for (const key of ['accounts', 'debts', 'goals', 'flows', 'transactions', 'tasks', 'members','cards']) {
      if (!Array.isArray(s[key]) || (key === 'transactions' ? s[key].length > 100000 : s[key].length > 10000)) throw new Error('Invalid ' + key + ' records.');
      const ids = new Set();
      for (const row of s[key]) {
        if (!row || typeof row.id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(row.id) || ids.has(row.id)) throw new Error('Invalid or duplicate record identifier.');
        ids.add(row.id);
      }
    }
    for (const key of ['accounts','debts','goals','flows','transactions']) for (const row of s[key]) if (!currencies.includes(row.currency)) throw new Error('Unsupported record currency.');
    if (!s.notified || typeof s.notified!=='object' || Array.isArray(s.notified)) throw new Error('Invalid reminder state.');
    if (s.cards.reduce((n,c)=>n+(typeof c.image==='string'?c.image.length:0),0)>1500000)throw Error('Card images exceed workspace storage budget');
    if (s.budgets) {
      if (!Array.isArray(s.budgets) || s.budgets.length > 500) throw new Error('Invalid budget records.');
      for (const b of s.budgets) {
        if (!b || typeof b.category !== 'string' || !Number.isSafeInteger(b.amount) || b.amount < 0 || (b.group && !['fixed', 'flexible', 'income'].includes(b.group))) throw new Error('Invalid category budget.');
      }
    }
    if (s.targetAllocations) {
      if (!Array.isArray(s.targetAllocations) || s.targetAllocations.length > 50) throw new Error('Invalid target allocations.');
      for (const ta of s.targetAllocations) {
        if (!ta || typeof ta.assetClass !== 'string' || !ta.assetClass.trim() || !Number.isFinite(ta.percent) || ta.percent < 0 || ta.percent > 100) throw new Error('Invalid target allocation.');
      }
    }
    for (const c of s.cards) {
      validateCardImage(c.image);
      const d=s.debts.find(d=>d.id===c.debtId);
      if (!d || s.cards.filter(x=>x.debtId===c.debtId).length!==1 || typeof c.name!=='string' || typeof c.owner!=='string' || !/^[0-9]{4}$/.test(c.last4) || !Number.isSafeInteger(c.limit) || c.limit<=0 || !Number.isSafeInteger(c.statementAmount) || c.statementAmount<0 || !Number.isSafeInteger(c.paid) || c.paid<0 || !validDate(c.dueDate) || (c.limitDate && !validDate(c.limitDate)) || !Number.isInteger(c.reminderDays) || c.reminderDays<0 || c.reminderDays>30) throw new Error('Invalid credit card.');
    }
    for (const d of s.debts) if (typeof d.name!=='string') throw new Error('Invalid debt name.');
    if (typeof s.name !== 'string' || s.name.length > 120 || typeof s.demo !== 'boolean') throw new Error('Invalid workspace metadata.');
    if (s.history && (!Array.isArray(s.history) || s.history.length > 120 || !s.history.every(Number.isSafeInteger))) throw new Error('Invalid historical balances.');
    for (const a of s.accounts) if (typeof a.name !== 'string' || typeof a.owner !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(a.updated)) throw new Error('Invalid account metadata.');
    for (const t of s.transactions) if (typeof t.name !== 'string' || typeof t.category !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(t.date)) throw new Error('Invalid transaction metadata.');
    for (const g of s.goals) if (typeof g.name !== 'string' || typeof g.emoji !== 'string' || g.emoji.length > 12 || typeof g.due !== 'string') throw new Error('Invalid goal metadata.');
    for (const t of s.tasks) if (typeof t.name !== 'string' || typeof t.owner !== 'string' || typeof t.done !== 'boolean' || typeof t.due !== 'string') throw new Error('Invalid task metadata.');
    for (const m of s.members) if (typeof m.name !== 'string' || typeof m.role !== 'string' || typeof m.initials !== 'string') throw new Error('Invalid member metadata.');
    for (const a of s.accounts) if (!Number.isSafeInteger(a.balance) || !['Checking', 'Savings', 'Cash', 'Investment', 'Property', 'Other'].includes(a.type)) throw new Error('Invalid account.');
    for (const d of s.debts) if (!Number.isSafeInteger(d.balance) || d.balance < 0 || !Number.isSafeInteger(d.minimum) || d.minimum <= 0 || !Number.isFinite(d.apr) || d.apr < 0 || d.apr > 100) throw new Error('Invalid debt.');
    for (const g of s.goals) if (![g.target, g.saved, g.monthly].every(Number.isSafeInteger) || g.target <= 0 || g.saved < 0 || g.monthly < 0) throw new Error('Invalid goal.');
    for (const f of s.flows) if (!Number.isSafeInteger(f.amount) || f.amount < 0 || !['income', 'expense'].includes(f.kind) || !Number.isInteger(f.day) || f.day < 1 || f.day > 28) throw new Error('Invalid cash-flow item.');
    for (const t of s.transactions) if (!Number.isSafeInteger(t.amount) || t.amount <= 0 || !s.accounts.some(a => a.id === t.accountId) || !['income', 'expense', 'transfer'].includes(t.kind) || (t.kind === 'transfer' && (t.targetDebtId ? !s.debts.some(d=>d.id===t.targetDebtId) : (!s.accounts.some(a => a.id === t.targetId) || t.accountId === t.targetId)))) throw new Error('Invalid transaction.');
    position(s);
    return s;
  }
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value||'')) return false;
    const d=new Date(value+'T12:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value;
  }
  function dayDifference(from,to) {
    if (!validDate(from)||!validDate(to)) throw new Error('Invalid reminder date.');
    return Math.round((Date.parse(to+'T12:00:00Z')-Date.parse(from+'T12:00:00Z'))/86400000);
  }
  function reminders(s,today) {
    const items=[];
    for(const c of s.cards||[]) {
      const remaining=Math.max(0,c.statementAmount-c.paid);
      const days=dayDifference(today,c.dueDate);
      if(remaining>0&&days<=c.reminderDays)items.push({id:c.id+'-due-'+c.dueDate,cardId:c.id,name:c.name,type:'due',date:c.dueDate,days,remaining,currency:s.debts.find(d=>d.id===c.debtId).currency||s.currency});
      if(c.limitDate){const days=dayDifference(today,c.limitDate);if(days<=c.reminderDays)items.push({id:c.id+'-limit-'+c.limitDate,cardId:c.id,name:c.name,type:'limit',date:c.limitDate,days});}
    }
    return items.sort((a,b)=>a.days-b.days);
  }
  function payCard(s,id,accountId,amount,date) {
    const c=s.cards.find(c=>c.id===id),a=s.accounts.find(a=>a.id===accountId);
    const d=s.debts.find(d=>d.id===c?.debtId);
    if(!c||!a||!d||!Number.isSafeInteger(amount)||amount<=0||!validDate(date))throw new Error('Invalid credit-card payment.');
    if(!['Checking','Savings','Cash'].includes(a.type))throw new Error('Choose a liquid payment account.');
    const debit=convert(s,amount,d.currency,a.currency);
    if(amount>d.balance||amount>Math.max(0,c.statementAmount-c.paid))throw new Error('Payment exceeds the remaining statement or debt balance.');
    if(debit>a.balance)throw new Error('Insufficient funds in the selected account.');
    a.balance-=debit;d.balance-=amount;c.paid+=amount;a.updated=date;
    return {debit,currency:a.currency,amount,cardCurrency:d.currency};
  }
  function monteCarlo({initial,monthly,years,mean,volatility,inflation=0,target,paths=2000,seed=42}) {
    if(![initial,monthly,target].every(n=>Number.isSafeInteger(n)&&n>=0)||!Number.isInteger(years)||years<1||years>40||!Number.isInteger(paths)||paths<100||paths>10000||!Number.isInteger(seed)||![mean,volatility,inflation].every(Number.isFinite)||mean<=-1||mean>1||volatility<0||volatility>1||inflation<0||inflation>.5)throw new Error('Invalid simulation parameters.');
    let x=seed>>>0;const uniform=()=>{x=(x+0x6D2B79F5)>>>0;let t=Math.imul(x^(x>>>15),1|x);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};
    const normal=()=>Math.sqrt(-2*Math.log(Math.max(uniform(),Number.MIN_VALUE)))*Math.cos(2*Math.PI*uniform());
    const months=years*12,drift=(Math.log1p(mean)-volatility*volatility/2)/12,sigma=volatility/Math.sqrt(12);
    const annual=Array.from({length:years+1},()=>[]);let successes=0,losses=0;
    const principal=initial+monthly*months;
    for(let p=0;p<paths;p++){
      let balance=initial;annual[0].push(balance);
      for(let m=1;m<=months;m++){
        balance=balance*Math.exp(drift+sigma*normal())+monthly;
        if(!Number.isFinite(balance)||balance>Number.MAX_SAFE_INTEGER)throw new Error('Simulation exceeds supported precision; reduce values or assumptions.');
        if(m%12===0)annual[m/12].push(balance/Math.pow(1+inflation,m/12));
      }
      const real=balance/Math.pow(1+inflation,years);
      if(real>=target)successes++;if(balance<principal)losses++;
    }
    const quantile=(a,q)=>{const at=(a.length-1)*q,lo=Math.floor(at),hi=Math.ceil(at);return Math.round(a[lo]+(a[hi]-a[lo])*(at-lo));};
    const bands=annual.map((arr,year)=>{arr.sort((a,b)=>a-b);return {year,p10:quantile(arr,.1),p50:quantile(arr,.5),p90:quantile(arr,.9)};});
    return {bands,success:successes/paths,belowPrincipal:losses/paths,paths,seed,principal,ending:bands.at(-1)};
  }
  function setCategoryBudget(s, category, amount, group='flexible', rollover=false) {
    if (!category || typeof category !== 'string' || !category.trim()) throw new Error('Enter a valid category.');
    if (!Number.isSafeInteger(amount) || amount < 0) throw new Error('Enter a valid budget amount.');
    if (group && !['fixed', 'flexible', 'income'].includes(group)) throw new Error('Invalid budget group.');
    s.budgets ??= [];
    const catClean = category.trim();
    const existing = s.budgets.find(b => b.category.toLowerCase() === catClean.toLowerCase());
    if (existing) {
      existing.amount = amount;
      existing.group = group;
      existing.rollover = Boolean(rollover);
    } else {
      s.budgets.push({
        id: 'bg_' + Math.random().toString(36).slice(2, 9),
        category: catClean,
        amount,
        group,
        rollover: Boolean(rollover)
      });
    }
    return s;
  }
  function monthlyBudgetSummary(s, year, month) {
    const y = Number(year), m = Number(month);
    const monthKey = `${y}-${String(m + 1).padStart(2, '0')}`;
    const prevMonthDate = new Date(y, m - 1, 1);
    const prevMonthKey = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;
    const transactions = s.transactions || [];
    const thisMonthTxs = transactions.filter(t => t.date && t.date.startsWith(monthKey));
    const prevMonthTxs = transactions.filter(t => t.date && t.date.startsWith(prevMonthKey));
    const totalDays = new Date(y, m + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === y && today.getMonth() === m;
    const currentDay = isCurrentMonth ? Math.min(totalDays, today.getDate()) : totalDays;
    const monthPacePercent = Math.round((currentDay / totalDays) * 100);
    const budgets = s.budgets || [];
    const catMap = new Map();
    for (const b of budgets) {
      catMap.set(b.category.toLowerCase(), {
        id: b.id,
        category: b.category,
        budget: b.amount,
        group: b.group || 'flexible',
        rollover: Boolean(b.rollover),
        actual: 0,
        prevActual: 0
      });
    }
    for (const t of thisMonthTxs) {
      if (t.kind !== 'expense') continue;
      const key = (t.category || 'Other').toLowerCase();
      const val = convert(s, t.amount, t.currency || s.currency, s.currency);
      if (!catMap.has(key)) {
        catMap.set(key, {
          category: t.category || 'Other',
          budget: 0,
          group: 'flexible',
          rollover: false,
          actual: 0,
          prevActual: 0
        });
      }
      catMap.get(key).actual += val;
    }
    for (const t of prevMonthTxs) {
      if (t.kind !== 'expense') continue;
      const key = (t.category || 'Other').toLowerCase();
      const val = convert(s, t.amount, t.currency || s.currency, s.currency);
      if (catMap.has(key)) {
        catMap.get(key).prevActual += val;
      }
    }
    const items = [];
    let totalFixedBudget = 0, totalFixedActual = 0;
    let totalFlexBudget = 0, totalFlexActual = 0;
    for (const [key, item] of catMap.entries()) {
      let rolloverAmount = 0;
      if (item.rollover && item.budget > 0) {
        rolloverAmount = item.budget - item.prevActual;
      }
      const effectiveBudget = Math.max(0, item.budget + rolloverAmount);
      const remaining = effectiveBudget - item.actual;
      const percent = effectiveBudget > 0 ? Math.round((item.actual / effectiveBudget) * 100) : (item.actual > 0 ? 100 : 0);
      let status = 'good';
      if (effectiveBudget > 0) {
        if (item.actual > effectiveBudget) status = 'over';
        else if (percent >= 85) status = 'warning';
      } else if (item.actual > 0) {
        status = 'over';
      }
      const row = {
        ...item,
        rolloverAmount,
        effectiveBudget,
        remaining,
        percent,
        status
      };
      items.push(row);
      if (row.group === 'fixed') {
        totalFixedBudget += effectiveBudget;
        totalFixedActual += item.actual;
      } else {
        totalFlexBudget += effectiveBudget;
        totalFlexActual += item.actual;
      }
    }
    const totalBudget = totalFixedBudget + totalFlexBudget;
    const totalSpent = totalFixedActual + totalFlexActual;
    const totalRemaining = totalBudget - totalSpent;
    const spendPacePercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    const onTrack = spendPacePercent <= monthPacePercent;
    const incomeActual = sum(thisMonthTxs.filter(t => t.kind === 'income').map(t => convert(s, t.amount, t.currency || s.currency, s.currency)));
    const plannedIncome = position(s).income;
    return {
      year: y,
      month: m,
      monthKey,
      currentDay,
      totalDays,
      monthPacePercent,
      spendPacePercent,
      onTrack,
      incomeActual,
      plannedIncome,
      totalBudget,
      totalSpent,
      totalRemaining,
      fixed: {
        budget: totalFixedBudget,
        actual: totalFixedActual,
        remaining: totalFixedBudget - totalFixedActual,
        items: items.filter(i => i.group === 'fixed').sort((a,b) => b.effectiveBudget - a.effectiveBudget || a.category.localeCompare(b.category))
      },
      flexible: {
        budget: totalFlexBudget,
        actual: totalFlexActual,
        remaining: totalFlexBudget - totalFlexActual,
        items: items.filter(i => i.group !== 'fixed').sort((a,b) => b.effectiveBudget - a.effectiveBudget || a.category.localeCompare(b.category))
      },
      items: items.sort((a,b) => b.effectiveBudget - a.effectiveBudget || a.category.localeCompare(b.category))
    };
  }
  function setTargetAllocations(s, allocations) {
    if (!Array.isArray(allocations)) throw new Error('Allocations must be an array.');
    const list = [];
    for (const item of allocations) {
      if (!item || typeof item.assetClass !== 'string' || !item.assetClass.trim()) throw new Error('Enter a valid asset class.');
      const pct = Number(item.percent);
      if (!Number.isFinite(pct) || pct < 0 || pct > 100) throw new Error('Target percent must be between 0 and 100.');
      list.push({
        id: item.id || ('ta_' + Math.random().toString(36).slice(2, 9)),
        assetClass: item.assetClass.trim(),
        percent: Math.round(pct * 10) / 10
      });
    }
    s.targetAllocations = list;
    return s;
  }
  const api = {validateCardImage,cents,sum,currencies,demoRates,migrate,convert,reporting,allocations,position,forecast,payoff,applyTransaction,fundGoal,spendFromGoal,setCategoryBudget,monthlyBudgetSummary,setTargetAllocations,validate,validDate,dayDifference,reminders,payCard,monteCarlo};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.InveysEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
