const {test}=require('node:test');const assert=require('node:assert/strict');const R=require('../recording');
test('locale money preserves cents and rejects impossible values',()=>{assert.equal(R.number('1.234,50'),123450);assert.equal(R.number('1,234.50','USD'),123450);assert.equal(R.number('25.000'),2500000);assert.throws(()=>R.number('none'));assert.throws(()=>R.number('999999999999999999'));});
test('receipt total excludes subtotal and change and detects IDR',()=>{const r=R.parse('CAFE\nSubtotal Rp 20.000\nTOTAL Rp 25.000\nChange 5.000','USD','2026-10-03');assert.equal(r[0].amount,2500000);assert.equal(r[0].currency,'IDR');assert.equal(r[0].date,'2026-10-03');});
test('Indonesian voice amount multipliers',()=>{assert.equal(R.parse('beli kopi 25 ribu')[0].amount,2500000);assert.equal(R.parse('terima gaji 5 juta')[0].amount,500000000);assert.equal(R.parse('terima gaji 5 juta')[0].kind,'income');});
test('statement rows distinguish credits and debits without inventing transfers',()=>{const rows=R.parse('2026-10-03 Salary 5.000.000 CR\n2026-10-02 Coffee -25.000 DR');assert.equal(rows.length,2);assert.equal(rows[0].kind,'income');assert.equal(rows[1].kind,'expense');assert.equal(rows[1].amount,2500000);});
test('duplicate detection isolates accounts, currencies and nearby dates',()=>{const row={id:'x',name:'Coffee',date:'2026-10-03',accountId:'a',currency:'IDR',amount:2500000,kind:'expense'};const state={transactions:[row]};assert.equal(R.duplicates(state,{...row,date:'2026-10-05'}).length,1);assert.equal(R.duplicates(state,{...row,currency:'USD'}).length,0);assert.equal(R.duplicates(state,{...row,date:'2026-10-06'}).length,0);assert.equal(R.duplicates(state,{...row,accountId:'b'}).length,0);});
test('live FX quotes invert IDR-base values and reject partial responses',()=>{const rows=['USD','EUR','GBP','SGD','AUD','JPY'].map(quote=>({base:'IDR',quote,rate:1/16000,date:'2026-10-02'}));assert.equal(R.rates(rows).rates.USD,16000);assert.throws(()=>R.rates(rows.slice(1)));assert.throws(()=>R.rates(rows.map(r=>({...r,rate:0}))));});

test('quick intent separates numeric questions and transfers from recording',()=>{
 assert.equal(R.quickIntent('Berapa pengeluaran 3 bulan?'),'question');
 assert.equal(R.quickIntent('Transfer 50000 dari BCA ke BNI'),'transfer');
 assert.equal(R.quickIntent('Gajian 10 juta masuk BCA'),'record');
});
test('quick recording preserves account currency and ignores its numeric suffix',()=>{
 const a={id:'bca',name:'BCA 1234',currency:'IDR'};
 const d=R.quickRecord('Gajian 10 juta masuk BCA 1234',a,'2026-10-03');
 assert.equal(d.amount,1000000000);assert.equal(d.kind,'income');assert.equal(d.currency,'IDR');
 assert.throws(()=>R.quickRecord('Beli 25 ribu',{...a,currency:'USD'},'2026-10-03'),/currency/);
 assert.throws(()=>R.quickRecord('Beli 25 dan 50',a,'2026-10-03'),/one amount/);
 assert.throws(()=>R.quickRecord('Beli 25',null,'2026-10-03'),/account/);
});

test('bank statement detection and parsing for Mandiri, BRI, BRI KK, and SeaBank',()=>{
 const mandiri='Rekening Koran Mandiri 1/09/26 s/d 30/09/26\n01/09 Saldo Awal 208,000.00\n01/09 01/09 -20260901BSMDIDJA010O0283278175 150,000.00 358,000.00\n01/09 01/09 MCM InhouseTrf-makan 150,000.00 508,000.00\n04/09 04/09 -MONTHLY CARD CHARGE 03-09-26 9,000.00 D 499,000.00\n29/09 29/09 -20260929SSPIIDJA010O0211431410 500,000.00 999,000.00\n29/09 29/09 MCM InhouseTrf- 500,000.00 D 499,000.00\n30/09 30/09 -UBP60146032901FFFFFF6032982158928216 200,000.00 D 299,000.00\n30/09 30/09 Biaya Adm - 6,000.00 D 293,000.00';
 const mRes=R.parse(mandiri,'IDR','2026-10-15');
 assert.equal(mRes.length,7);
 assert.equal(mRes.filter(r=>r.kind==='income').reduce((a,b)=>a+b.amount,0),80000000);
 assert.equal(mRes.filter(r=>r.kind==='expense').reduce((a,b)=>a+b.amount,0),71500000);
 assert.equal(R.detectBankStatement(mandiri).type,'mandiri');

 const bri='LAPORAN TRANSAKSI FINANSIAL BRImo 01/09/26 - 30/09/26\n01/09/26 03:10:37 SPAN:20260901:260190000110585001557 BRIMCRDT 0.00 3,136,400.00 3,609,223.69\n01/09/26 12:02:09 MDB_1256_2026090155849_POT DANSOS ASOKA BRIMDBT 15,000.00 0.00 14,297,223.69\n01/09/26 17:11:21 Top Up Shopee 0819xxxx543 MUHXXXX HENXXX F\nvia BRImo 8888599 10,000,000.00 0.00 4,297,223.69';
 const bRes=R.parse(bri,'IDR','2026-10-15');
 assert.equal(bRes.length,3);
 assert.equal(bRes[0].kind,'income');
 assert.equal(bRes[0].amount,313640000);
 assert.equal(bRes[1].kind,'expense');
 assert.equal(bRes[2].name,'Top Up ShopeePay');
 assert.equal(R.detectBankStatement(bri).type,'bri');

 const briKk='Billing Statement BRI Kartu Kredit 5475-82XX\n02-09-2026 02-09-2026 PAYMENT_ICSS_3004031 IDR 0.00 0.00 12.044.500CR\n14-09-2026 14-09-2026 Retail IDN JAKARTA UTARA PAPER.ID IDR 0.00 0.00 20.270.000\n16-09-2026 16-09-2026 PAPER.ID : 1/18 IDR 0.00 0.00 1.126.111';
 const kkRes=R.parse(briKk,'IDR','2026-10-15');
 assert.equal(kkRes.length,3);
 assert.equal(kkRes[0].kind,'income');
 assert.equal(kkRes[0].amount,1204450000);
 assert.equal(kkRes[1].kind,'expense');
 assert.equal(kkRes[1].amount,2027000000);
 assert.equal(R.detectBankStatement(briKk).type,'bri_kk');

 const sea='REKENING KORAN SeaBank\n01 SEP 2026 sampai 30 SEP 2026\nTABUNGAN 9.220 69.768.383 69.874.750 115.587\n01 SEP Bunga Tabungan Bunga 1 9.221\n01 SEP ShopeePay Transfer 14.000.050 14.009.271\n01 SEP SMBC Indonesia Transfer 14.000.000 9.271';
 const sRes=R.parse(sea,'IDR','2026-10-15');
 assert.equal(sRes.length,3);
 assert.equal(sRes[0].amount,100);
 assert.equal(sRes[0].kind,'income');
 assert.equal(sRes[2].amount,1400000000);
 assert.equal(sRes[2].kind,'expense');
 assert.equal(R.detectBankStatement(sea).type,'seabank');
});
