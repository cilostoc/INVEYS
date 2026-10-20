const {test}=require('node:test');const assert=require('node:assert/strict');const R=require('../src/recording');
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

test('BRImo financial statement parses multiline descriptions, SPAN salaries, and fees',()=>{
 const briFull=`LAPORAN TRANSAKSI FINANSIAL BRImo 01/09/26 - 30/09/26
01/09/26 03:10:37 SPAN:20260901:260190000110585001557 BRIMCRDT 0.00 3,136,400.00 3,609,223.69
01/09/26 09:10:49 SPAN: :260190000117527001336 SPN410 0.00 10,703,000.00 14,312,223.69
01/09/26 12:02:09 MDB_1256_2026090155849_POT DANSOS ASOKA BRIMDBT 15,000.00 0.00 14,297,223.69
01/09/26 17:11:21 Top Up Shopee 0819xxxx543 MUHXXXX HENXXX F 8888599 10,000,000.00 0.00 4,297,223.69
                  via BRImo
02/09/26 20:07:08 Transfer BI-Fast dari CITIBANK, N.A. - 0109163007 - 8888654 0.00 200,000.00 497,223.69
                  Ptshopbackmitrasejahtera
20/09/26 23:59:59 Admin Fee 3,500.00 0.00 1,673,723.69
20/09/26 23:59:59 Monthly Fee ATM 500.00 0.00 1,673,223.69
22/09/26 06:12:01 QRISRNS217160360915#9360000210033424929 8888124 86,574.00 0.00 1,586,649.69
28/09/26 19:55:18 Transfer BI-Fast dari Bank Lain - 001144881996 Muhamad Hendra Febriansyah 8888631 0.00 1,437,735.00 1,593,831.69
28/09/26 19:56:59 Pembayaran Tagihan Kartu Kredit 5475xxxx108 via BRImo 8888336 1,438,611.00 0.00 155,220.69
30/09/26 12:51:00 Transfer BI-Fast dari BANK SYARIAH MANDIRI 7143013582 - Rickiherdianasurya 8888700 0.00 298,000.00 453,220.69`;
 const rows=R.parse(briFull,'IDR','2026-10-15');
 assert.equal(rows.length,11);
 assert.equal(rows[0].name,'Gaji / SPAN Kemenkeu');
 assert.equal(rows[0].category,'Gaji & Pendapatan');
 assert.equal(rows[3].name,'Top Up ShopeePay');
 assert.equal(rows[3].amount,1000000000);
 assert.equal(rows[4].name,'ShopBack Indonesia');
 assert.equal(rows[4].category,'Hadiah & Cashback');
 assert.equal(rows[5].name,'Biaya Administrasi Bank');
 assert.equal(rows[6].name,'Biaya Bulanan Kartu ATM');
 assert.equal(rows[7].name,'Pembayaran QRIS');
 assert.equal(rows[8].name,'Transfer Masuk Rekening Pribadi');
 assert.equal(rows[8].category,'Transfer Antar Akun');
 assert.equal(rows[9].name,'Pembayaran Tagihan Kartu Kredit');
 assert.equal(rows[9].amount,143861100);
 assert.equal(rows[10].name,'Transfer dari Rickiherdianasurya (BSI)');
});

test('BRI Credit Card full statement parses Paper.id installment and reversal',()=>{
 const kkFull=`Billing Statement BRI Kartu Kredit 5475-82XX-XXXX-4108
02-09-2026 02-09-2026 PAYMENT_ICSS_3004031 IDR 0.00 0.00 12.044.500CR
14-09-2026 14-09-2026 Retail IDN JAKARTA UTARA PAPER.ID IDR 0.00 0.00 20.270.000
14-09-2026 14-09-2026 BIAYA NOTIFIKASI 0826 IDR 0.00 0.00 7.500
16-09-2026 16-09-2026 BIAYA ADMIN BRING PAPER.ID IDR 0.00 0.00 300.000
16-09-2026 16-09-2026 PAPER.ID : 1/18 IDR 0.00 0.00 1.126.111
16-09-2026 16-09-2026 PAPER.ID : 0/18 IDR 0.00 0.00 20.270.000CR
20-09-2026 20-09-2026 E-STATEMENT FEE IDR 0.00 0.00 5.000`;
 const rows=R.parse(kkFull,'IDR','2026-10-15');
 assert.equal(rows.length,7);
 assert.equal(rows[0].kind,'income');
 assert.equal(rows[0].amount,1204450000);
 assert.equal(rows[1].name,'Paper.id Jakarta');
 assert.equal(rows[1].amount,2027000000);
 assert.equal(rows[2].name,'Biaya Notifikasi SMS');
 assert.equal(rows[3].name,'Biaya Admin Cicilan Paper.id');
 assert.equal(rows[4].name,'Cicilan Paper.id (Bulan 1/18)');
 assert.equal(rows[4].amount,112611100);
 assert.equal(rows[5].name,'Pembalikan Transaksi Cicilan Paper.id');
 assert.equal(rows[5].kind,'income');
 assert.equal(rows[5].category,'Pengembalian Dana');
 assert.equal(rows[6].name,'Biaya Cetak E-Statement');
});

test('retail purchase receipts extract merchant, real grand total and avoid kembalian',()=>{
 const indomaret=`PT INDOMARCO PRISMATAMA
INDOMARET GATOT SUBROTO
JL. GATOT SUBROTO NO 45
NPWP: 01.337.994.2-054.000
20.10.2026-14:25 2.1.56 KASIR: BUDI
--------------------------------
ROTI TAWAR SARI ROTI    1   16.500
ULTRA MILK COKLAT 250ML 2   14.000
INDOMIE GORENG SPESIAL  5   15.500
--------------------------------
SUBTOTAL                    46.000
PPN 11%                      5.060
TOTAL BELANJA               51.060
TUNAI                      100.000
KEMBALIAN                   48.940`;
 const r1=R.parse(indomaret,'IDR','2026-10-20');
 assert.equal(r1.length,1);
 assert.equal(r1[0].name,'Indomaret');
 assert.equal(r1[0].amount,5106000);
 assert.equal(r1[0].date,'2026-10-20');
 assert.equal(r1[0].category,'Belanja & Kebutuhan Rumah');

 const pertamina=`SPBU 34.12304 PERTAMINA
JL. M.T. HARYONO KAV 10
TANGGAL: 18/10/2026 08:45:10
POMPA : 03
PRODUK : PERTAMAX
TOTAL : Rp 323.750`;
 const r2=R.parse(pertamina,'IDR','2026-10-20');
 assert.equal(r2.length,1);
 assert.equal(r2[0].name,'SPBU Pertamina');
 assert.equal(r2[0].amount,32375000);
 assert.equal(r2[0].date,'2026-10-18');
 assert.equal(r2[0].category,'Transportasi & Bahan Bakar');
});

