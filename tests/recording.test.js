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

test('quick transfer parses natural language transfers between accounts',()=>{
 const accounts=[
  {id:'acc_bca',name:'BCA 1234',currency:'IDR'},
  {id:'acc_mandiri',name:'Bank Mandiri Utama',currency:'IDR'},
  {id:'acc_seabank',name:'SeaBank',currency:'IDR'}
 ];
 // 1. Transfer with implicit source (using default account) and destination keyword
 const t1=R.quickRecord('Transfer 500rb ke SeaBank',accounts[0],'2026-10-24',accounts);
 assert.equal(t1.kind,'transfer');
 assert.equal(t1.amount,50000000);
 assert.equal(t1.accountId,'acc_bca');
 assert.equal(t1.targetId,'acc_seabank');
 assert.equal(t1.category,'Transfer');

 // 2. Transfer with explicit 'dari ... ke ...'
 const t2=R.quickRecord('Pindah 1.5 juta dari BCA ke Mandiri',accounts[2],'2026-10-24',accounts);
 assert.equal(t2.kind,'transfer');
 assert.equal(t2.amount,150000000);
 assert.equal(t2.accountId,'acc_bca');
 assert.equal(t2.targetId,'acc_mandiri');

 // 3. Unknown destination throws helpful instruction error
 assert.throws(()=>R.quickRecord('Transfer 500 ke tabungan',accounts[0],'2026-10-24',accounts),/Gunakan Tambah transaksi/);

 // 4. Same source and destination throws error
 assert.throws(()=>R.quickRecord('Transfer 200rb dari BCA ke BCA',accounts[0],'2026-10-24',accounts),/berbeda/);
});

test('duplicate detection catches inter-account transfer counterparts and prevents double counting',()=>{
 const accounts=[
  {id:'a1',name:'BCA',currency:'IDR'},
  {id:'a2',name:'SeaBank',currency:'IDR'}
 ];
 const existingTransfer={
  id:'tx_trf_1',
  name:'Transfer BCA ke SeaBank',
  date:'2026-10-20',
  accountId:'a1',
  targetId:'a2',
  amount:100000000,
  targetAmount:100000000,
  currency:'IDR',
  kind:'transfer'
 };
 const state={accounts,transactions:[existingTransfer]};

 // When statement of SeaBank (a2) has incoming 1.000.000 on nearby date
 const seaBankInflow={
  name:'Transfer dari BCA',
  date:'2026-10-21',
  accountId:'a2',
  amount:100000000,
  currency:'IDR',
  kind:'income'
 };
 const dupsInflow=R.duplicates(state,seaBankInflow);
 assert.equal(dupsInflow.length,1);
 assert.equal(dupsInflow[0].type,'transfer_counterpart');
 assert.match(dupsInflow[0].reason,/transfer masuk dari BCA/);

 // When statement of BCA (a1) has outgoing 1.000.000 on nearby date
 const bcaOutflow={
  name:'Transfer ke SeaBank',
  date:'2026-10-20',
  accountId:'a1',
  amount:100000000,
  currency:'IDR',
  kind:'expense'
 };
 const dupsOutflow=R.duplicates(state,bcaOutflow);
 assert.equal(dupsOutflow.length,1);
 assert.equal(dupsOutflow[0].type,'transfer_counterpart');
 assert.match(dupsOutflow[0].reason,/transfer keluar ke SeaBank/);
});

test('pairTransferDrafts merges complementary statement debit and credit into one transfer draft',()=>{
 const accounts=[
  {id:'bca',name:'Bank BCA',currency:'IDR'},
  {id:'mandiri',name:'Bank Mandiri',currency:'IDR'}
 ];
 const drafts=[
  {name:'TRF KE BANK MANDIRI',date:'2026-10-22',amount:75000000,kind:'expense',accountId:'bca',currency:'IDR',category:'Transfer Antar Akun'},
  {name:'Gaji Kemenkeu',date:'2026-10-22',amount:500000000,kind:'income',accountId:'bca',currency:'IDR',category:'Gaji & Pendapatan'},
  {name:'TRF DARI BANK BCA',date:'2026-10-22',amount:75000000,kind:'income',accountId:'mandiri',currency:'IDR',category:'Transfer Antar Akun'}
 ];
 const paired=R.pairTransferDrafts(drafts,accounts);
 assert.equal(paired.length,2);
 const trfDraft=paired.find(d=>d.kind==='transfer');
 assert.ok(trfDraft);
 assert.equal(trfDraft.accountId,'bca');
 assert.equal(trfDraft.targetId,'mandiri');
 assert.equal(trfDraft.amount,75000000);
 assert.match(trfDraft.name,/Bank BCA → Bank Mandiri/);
});

test('Bank Jago statement detection and parser extracts income, expense, transfers and cashback',()=>{
 const sampleStatement=`
PT Bank Jago Tbk - Laporan Keuangan Bulanan November 2021
Kantong Utama
01 Nov 2021 16.27 MUHAMAD HENDRA FEB ALTOPay 2288003237 Transfer Masuk ID# 11235161 MUHAMAD HENDRA FEB +2.000.000,00 2.061.894,63
01 Nov 2021 16.31 OVO MUXXXXD HEXXXA FEXXXXXXXXH OVO 081917167543 Isi Saldo Dompet Digital ID# 11235511 -200.000,00 1.861.894,63
05 Nov 2021 18.30 Nikah Pindah uang antar Kantong Tambah Uang Kantong ID# 12219017 -4.000.000,00 731.524,63
28 Nov 2021 01.00 Bunga Kantong Utama Bunga ID# 15357852 +237,54 682.264,17
28 Nov 2021 01.00 Pajak Bunga Kantong Utama Pajak Bunga ID# 15357856 -47,51 682.216,66
03 Des 2021 16.37 Cashback Cashback ID# 16552543 Jago Bayarin +6.500,00 588.716,66
 `;
 const detected=R.detectBankStatement(sampleStatement);
 assert.ok(detected);
 assert.equal(detected.type,'jago');
 assert.equal(detected.bank,'Bank Jago');

 const parsed=R.parse(sampleStatement,'IDR','2021-11-30');
 assert.equal(parsed.length,6);

 // Transfer masuk
 assert.equal(parsed[0].date,'2021-11-01');
 assert.equal(parsed[0].amount,200000000);
 assert.equal(parsed[0].kind,'income');
 assert.match(parsed[0].name,/Transfer Masuk/);

 // Top Up OVO
 assert.equal(parsed[1].date,'2021-11-01');
 assert.equal(parsed[1].amount,20000000);
 assert.equal(parsed[1].kind,'expense');
 assert.match(parsed[1].name,/Top Up.*OVO/);

 // Pindah Saldo Kantong (Transfer antar kantong)
 assert.equal(parsed[2].date,'2021-11-05');
 assert.equal(parsed[2].amount,400000000);
 assert.equal(parsed[2].kind,'expense');
 assert.match(parsed[2].name,/Pindah Saldo Kantong/);
 assert.equal(parsed[2].category,'Transfer Antar Akun');

 // Bunga
 assert.equal(parsed[3].date,'2021-11-28');
 assert.equal(parsed[3].amount,23754);
 assert.equal(parsed[3].kind,'income');
 assert.equal(parsed[3].category,'Investasi & Bunga');

 // Pajak Bunga
 assert.equal(parsed[4].date,'2021-11-28');
 assert.equal(parsed[4].amount,4751);
 assert.equal(parsed[4].kind,'expense');
 assert.equal(parsed[4].category,'Biaya Finansial & Pajak');

 // Cashback
 assert.equal(parsed[5].date,'2021-12-03');
 assert.equal(parsed[5].amount,650000);
 assert.equal(parsed[5].kind,'income');
 assert.equal(parsed[5].category,'Hadiah & Cashback');
});

test('Indonesian E-Wallet statement detection and parsing for GoPay, OVO, DANA, and ShopeePay', () => {
  // 1. GoPay statement
  const gopayText = `Riwayat Transaksi GoPay
25 Okt 2026 14:32 GoFood - Mie Gacoan -Rp 35.000 Berhasil
24 Okt 2026 10:15 Top up via BCA OneKlik +Rp 100.000 Selesai
23 Okt 2026 GoCar Perjalanan Kantor -Rp 24.000`;
  const gopayRes = R.parse(gopayText, 'IDR', '2026-10-27');
  assert.equal(gopayRes.length, 3);
  assert.equal(gopayRes[0].kind, 'expense');
  assert.equal(gopayRes[0].amount, 3500000);
  assert.equal(gopayRes[0].date, '2026-10-25');
  assert.equal(gopayRes[1].kind, 'income');
  assert.equal(gopayRes[1].amount, 10000000);
  assert.equal(R.detectBankStatement(gopayText).type, 'gopay');

  // 2. OVO statement
  const ovoText = `Riwayat Transaksi OVO Cash
25/10/2026 12:15 GrabFood - HokBen -Rp 48.000 Berhasil
24/10/2026 Top Up BCA OneKlik +Rp 200.000
23/10/2026 Pembayaran QRIS Kopi Kenangan -Rp 18.000`;
  const ovoRes = R.parse(ovoText, 'IDR', '2026-10-27');
  assert.equal(ovoRes.length, 3);
  assert.equal(ovoRes[0].amount, 4800000);
  assert.equal(ovoRes[0].kind, 'expense');
  assert.equal(ovoRes[1].amount, 20000000);
  assert.equal(ovoRes[1].kind, 'income');
  assert.equal(R.detectBankStatement(ovoText).type, 'ovo');

  // 3. DANA statement
  const danaText = `Dompet Digital DANA - Riwayat Transaksi
25 Okt 2026 18:20 Kirim Uang ke BCA -Rp 150.000 Berhasil
24 Okt 2026 Isi Saldo dari Mandiri +Rp 250.000 Selesai
23 Okt 2026 Tagihan Listrik PLN -Rp 100.000`;
  const danaRes = R.parse(danaText, 'IDR', '2026-10-27');
  assert.equal(danaRes.length, 3);
  assert.equal(danaRes[0].amount, 15000000);
  assert.equal(danaRes[0].kind, 'expense');
  assert.equal(danaRes[1].amount, 25000000);
  assert.equal(danaRes[1].kind, 'income');
  assert.equal(R.detectBankStatement(danaText).type, 'dana');

  // 4. ShopeePay statement
  const spayText = `ShopeePay - Transaksi ShopeePay
25-10-2026 13:40 Pembayaran Pesanan Shopee -Rp 88.000 Selesai
24-10-2026 Top Up Saldo SeaBank +Rp 300.000 Berhasil
23-10-2026 Pengembalian Dana Shopee +Rp 45.000`;
  const spayRes = R.parse(spayText, 'IDR', '2026-10-27');
  assert.equal(spayRes.length, 3);
  assert.equal(spayRes[0].amount, 8800000);
  assert.equal(spayRes[0].kind, 'expense');
  assert.equal(spayRes[1].amount, 30000000);
  assert.equal(spayRes[1].kind, 'income');
  assert.equal(R.detectBankStatement(spayText).type, 'shopeepay');
});

