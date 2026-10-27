(function(root){
'use strict';
function number(text,currency='IDR') {
 let s=String(text).trim().replace(/[^\d,.-]/g,'');
 if(s.includes(',')&&s.includes('.')) {const decimal=s.lastIndexOf(',')>s.lastIndexOf('.')?',':'.';s=s.split(decimal==='.'?',':'.').join('').replace(decimal,'.');}
 else if(/^[\d-]+([.,]\d{3})+$/.test(s)) s=s.replace(/[.,]/g,'');
 else s=s.replace(',','.');
 const n=Math.round(Number(s)*100);if(!s||!Number.isSafeInteger(n)||n<=0)throw Error('Nominal tidak valid');return n;
}
const MONTH_MAP={jan:'01',feb:'02',mar:'03',apr:'04',mei:'05',may:'05',jun:'06',jul:'07',agu:'08',agt:'08',aug:'08',sep:'09',okt:'10',oct:'10',nov:'11',des:'12',dec:'12'};
function cleanMerchant(desc,kind){
 let s=String(desc||'').trim();
 if(/SPAN\s*:\s*:?\d+/i.test(s))return 'Gaji / SPAN Kemenkeu';
 if(/DANSOS ASOKA/i.test(s))return 'Iuran Dana Sosial Asoka';
 if(/Top Up Shopee/i.test(s))return 'Top Up ShopeePay';
 if(/ShopeePay/i.test(s)){
  if(/Google Play/i.test(s))return 'Google Play via ShopeePay';
  if(/Pembayaran/i.test(s))return 'Pembayaran ShopeePay';
  if(/Transfer/i.test(s))return 'ShopeePay Transfer';
  return 'ShopeePay';
 }
 if(/Ptshopbackmitrasejahtera|CITIBANK.*Shopback|CITIBANK.*0109163007/i.test(s))return 'ShopBack Indonesia';
 if(/Rickiherdianasurya/i.test(s))return 'Transfer dari Rickiherdianasurya (BSI)';
 if(/Transfer.*(Muhamad Hendra Febriansyah|Hendra)/i.test(s))return 'Transfer Masuk Rekening Pribadi';
 if(/PAPER\.ID\s*:\s*1\/18/i.test(s))return 'Cicilan Paper.id (Bulan 1/18)';
 if(/PAPER\.ID\s*:\s*0\/18/i.test(s))return 'Pembalikan Transaksi Cicilan Paper.id';
 if(/BIAYA ADMIN BRING PAPER\.ID/i.test(s))return 'Biaya Admin Cicilan Paper.id';
 if(/BIAYA NOTIFIKASI/i.test(s))return 'Biaya Notifikasi SMS';
 if(/PAPER\.ID/i.test(s))return 'Paper.id Jakarta';
 if(/PAYMENT_ICSS/i.test(s)||/Pembayaran Tagihan Kartu Kredit/i.test(s))return 'Pembayaran Tagihan Kartu Kredit';
 if(/E-STATEMENT FEE/i.test(s))return 'Biaya Cetak E-Statement';
 if(/Monthly Fee ATM/i.test(s))return 'Biaya Bulanan Kartu ATM';
 if(/MONTHLY CARD CHARGE/i.test(s))return 'Biaya Kartu Debit Mandiri';
 if(/Admin Fee|Biaya Adm/i.test(s))return 'Biaya Administrasi Bank';
 if(/QRIS/i.test(s))return 'Pembayaran QRIS';
 if(/INDOMARET/i.test(s))return 'Indomaret';
 if(/ALFAMART/i.test(s))return 'Alfamart';
 if(/ALFAMIDI/i.test(s))return 'Alfamidi';
 if(/SUPERINDO|SUPER INDO/i.test(s))return 'Super Indo';
 if(/PERTAMINA|SPBU/i.test(s))return 'SPBU Pertamina';
 if(/SHELL/i.test(s))return 'SPBU Shell';
 if(/MIE GACOAN/i.test(s))return 'Mie Gacoan';
 if(/STARBUCKS/i.test(s))return 'Starbucks Coffee';
 if(/KOPI KENANGAN/i.test(s))return 'Kopi Kenangan';
 if(/KFC/i.test(s))return 'KFC';
 if(/MCDONALD|MCD/i.test(s))return 'McDonald\'s';
 if(/HOKBEN/i.test(s))return 'HokBen';
 if(/PIZZA HUT/i.test(s))return 'Pizza Hut';
 if(/SOLARIA/i.test(s))return 'Solaria';
 if(/KIMIA FARMA/i.test(s))return 'Apotek Kimia Farma';
 if(/WATSON/i.test(s))return 'Watsons';
 if(/GUARDIAN/i.test(s))return 'Guardian';
 if(/Bunga Tabungan/i.test(s))return 'Bunga Tabungan';
 if(/Pajak Bunga/i.test(s))return 'Pajak Bunga Tabungan';
 if(/Midtrans/i.test(s))return 'Transfer Masuk Midtrans';
 if(/Toko Diskon/i.test(s))return 'Toko Diskon';
 if(/TIANLALA/i.test(s))return 'Tianlala Bung Karno';
 if(/Tokopedia/i.test(s))return 'Tokopedia';
 if(/Pembalikan.*SMBC/i.test(s))return 'Pembalikan Transfer SMBC Indonesia';
 if(/SUPERBANK/i.test(s))return 'Transfer Masuk Superbank';
 if(/BOBY YOANATA/i.test(s))return 'Transfer ke Boby Yoanata';
 if(/ISA FAQIHUDDIN/i.test(s))return 'Transfer ke Isa Faqihuddin Hanif';
 if(/ADINDA LUTFIA/i.test(s))return 'Transfer ke Adinda Lutfia Mahira';
 if(/ZENZEN ZAENAL/i.test(s))return 'Transfer ke Zenzen Zaenal Aripin';
 if(/CIMB NIAGA/i.test(s))return 'Transfer ke CIMB Niaga Syariah';
 if(/SMBC Indonesia/i.test(s))return kind==='income'?'Transfer dari SMBC Indonesia':'Transfer ke SMBC Indonesia';
 if(/MANDIRI/i.test(s))return kind==='income'?'Transfer dari Mandiri':'Transfer ke Bank Mandiri';
 if(/MCM InhouseTrf-makan/i.test(s))return 'Makan / Inhouse Transfer';
 if(/MCM InhouseTrf/i.test(s))return 'MCM Inhouse Transfer';
 if(/BSMDIDJA|BANK SYARIAH INDONESIA|BSI Mobile/i.test(s))return kind==='income'?'Transfer dari BSI (BI-Fast)':'Transfer ke BSI';
 if(/SSPIIDJA/i.test(s))return 'Transfer Masuk Shopee (BI-Fast)';
 if(/UBP\d+/i.test(s))return 'Pembayaran Tagihan Mandiri';
 if(/GOPAY|GO-PAY|GOJEK/i.test(s))return 'Top Up / Pembayaran GoPay';
 if(/OVO|BUMI INDAH CEMERLANG/i.test(s))return 'Top Up / Pembayaran OVO';
 if(/DANA|ESPAY/i.test(s))return 'Top Up / Pembayaran DANA';
 if(/BANK CENTRAL ASIA|KLIKBCA|BCA\b/i.test(s)&&/transfer|trf/i.test(s))return kind==='income'?'Transfer dari BCA':'Transfer ke Bank BCA';
 if(/BANK NEGARA INDONESIA|BNI\b/i.test(s)&&/transfer|trf/i.test(s))return kind==='income'?'Transfer dari BNI':'Transfer ke Bank BNI';
 if(/BANK JAGO/i.test(s))return kind==='income'?'Transfer dari Bank Jago':'Transfer ke Bank Jago';
 if(/Pindah uang antar Kantong/i.test(s)){const target=s.match(/^([A-Za-z0-9\s]+?)\s+Pindah uang antar Kantong/i)?.[1]||s.match(/(?:Tarik|Tambah)\s+Uang\s+Kantong\s+([A-Za-z0-9\s]+?)(?:\s+ID#|$)/i)?.[1]||'Kantong';return 'Pindah Saldo Kantong ('+target.trim()+')';}
 if(/EKA DEDI SATRIA/i.test(s))return 'Transfer ke Eka Dedi Satria (BCA)';
 if(/SALBIAH.*Bank Syariah Indonesia/i.test(s))return 'Transfer ke Salbiah (BSI)';
 if(/RIZKI CATUR PAMUNGKAS/i.test(s))return 'Transfer ke Rizki Catur Pamungkas (BCA)';
 if(/Cashback.*Jago Bayarin|Jago Bayarin/i.test(s))return 'Cashback Jago Bayarin';
 if(/Isi Saldo Dompet Digital/i.test(s)){if(/ShopeePay/i.test(s))return 'Top Up ShopeePay';if(/OVO/i.test(s))return 'Top Up OVO';if(/GoPay/i.test(s))return 'Top Up GoPay';return 'Top Up Dompet Digital';}
 if(/ALTOPay.*Transfer Masuk/i.test(s)||/Transfer Masuk.*ALTOPay/i.test(s))return 'Transfer Masuk ALTOPay';
 s=s.replace(/^[-\s;:,]+/, '').replace(/[-\s;:,]+$/, '').replace(/\s+/g,' ');
 return s.slice(0,120);
}
function suggestCategory(name,kind){
 const s=(name||'').toLowerCase();
 if(kind==='income'){
  if(/bunga|dividen|investasi/i.test(s))return 'Investasi & Bunga';
  if(/gaji|span|salary|upah|honor|tukin/i.test(s))return 'Gaji & Pendapatan';
  if(/shopback|cashback|hadiah|bonus|reward/i.test(s))return 'Hadiah & Cashback';
  if(/pembalikan|refund|retur/i.test(s))return 'Pengembalian Dana';
  if(/rekening pribadi|transfer antar/i.test(s))return 'Transfer Antar Akun';
  return 'Pemasukan Lainnya';
 }
 if(/makan|coffee|kopi|cafe|tianlala|food|resto|gacoan|kfc|mcd|starbucks|hokben|pizza|solaria/i.test(s))return 'Makanan & Minuman';
 if(/indomaret|alfamart|alfamidi|superindo|super indo|hypermart|transmart|sembako|pasar|groceries/i.test(s))return 'Belanja & Kebutuhan Rumah';
 if(/shopee|tokopedia|belanja|diskon|lazada|blibli|tiktok shop/i.test(s))return 'Belanja & E-Commerce';
 if(/pertamina|shell|bp akr|vivo|spbu|bensin|pertamax|pertalite|solar|dexlite|tol|parkir|gojek|grab|maxim/i.test(s))return 'Transportasi & Bahan Bakar';
 if(/kimia farma|watson|guardian|apotek|obat|dokter|klinik|rumah sakit|medis/i.test(s))return 'Kesehatan & Medis';
 if(/google play|netflix|spotify|youtube|icloud|langganan|subscription/i.test(s))return 'Langganan Digital';
 if(/biaya|fee|charge|admin|pajak|notifikasi|e-statement|atm|kartu debit/i.test(s))return 'Biaya Finansial & Pajak';
 if(/kartu kredit|cicilan|paper\.id|tagihan|paylater/i.test(s))return 'Hutang & Kartu Kredit';
 if(/dansos|sosial|donasi|zakat|infaq|sedekah/i.test(s))return 'Sosial & Donasi';
 if(/listrik|pln|pdam|air|wifi|indihome|telkom|pulsa|paket data/i.test(s))return 'Utilitas & Tagihan';
 if(/qris/i.test(s))return 'Belanja & Kebutuhan Rumah';
 if(/transfer|smbc|superbank|krom|boby|isa|adinda|zenzen|cimb|mandiri|rekening pribadi/i.test(s))return 'Transfer Antar Akun';
 return 'Pengeluaran Umum';
}
function detectBankStatement(text){
 const s=String(text);
 if(/Transaksi ShopeePay|Saldo ShopeePay|AirPay International|ShopeePay\s*-\s*Transaksi/i.test(s)||(/^ShopeePay\b/im.test(s)&&!/REKENING KORAN.*SeaBank/i.test(s)))return {bank:'ShopeePay (Dompet Digital)',type:'shopeepay'};
 if(/Riwayat Transaksi GoPay|Dompet Anak Bangsa|Order ID:?\s*RB-|^GoPay\b/im.test(s))return {bank:'GoPay (Dompet Digital)',type:'gopay'};
 if(/Riwayat Transaksi OVO|OVO Cash|Visionet Internasional|^OVO\b/im.test(s))return {bank:'OVO (Dompet Digital)',type:'ovo'};
 if(/Dompet Digital DANA|Transaksi DANA|Espay Debit Indonesia Koe|^DANA\b/im.test(s))return {bank:'DANA (Dompet Digital)',type:'dana'};
 if(/SeaBank|S01-260930|cs@seabank\.co\.id/i.test(s)||(/REKENING KORAN/i.test(s)&&/\b(JAN|FEB|MAR|APR|MEI|MAY|JUN|JUL|AGU|AGT|AUG|SEP|OKT|OCT|NOV|DES|DEC)\b/i.test(s)&&/TABUNGAN/i.test(s)))return {bank:'SeaBank',type:'seabank'};
 if(/BRI\s*Kartu\s*Kredit|Lembar\s*Penagihan|Billing\s*Statement|5475-82XX|PAYMENT_ICSS|BIAYA ADMIN BRING/i.test(s))return {bank:'Bank BRI Kartu Kredit',type:'bri_kk'};
 if(/BRIMCRDT|BRIMDBT|BRImo|Britama|bankbri|LAPORAN TRANSAKSI FINANSIAL/i.test(s))return {bank:'Bank BRI',type:'bri'};
 if(/bankmandiri|mandiricare|Livin\'poin|MANDIRI TABUNGAN NOW|MCM InhouseTrf/i.test(s)||(/Rekening Koran/i.test(s)&&/Mandiri/i.test(s)))return {bank:'Bank Mandiri',type:'mandiri'};
 if(/BCA|Tahapan|KlikBCA/i.test(s)&&/\b(DB|CR)\b/.test(s))return {bank:'Bank BCA',type:'bca'};
 if(/Bank Jago|jago\.com|ID Kantong|Laporan Keuangan Bulanan.*Jago|Pindah uang antar Kantong/i.test(s))return {bank:'Bank Jago',type:'jago'};
 if(/ShopeePay/i.test(s))return {bank:'ShopeePay (Dompet Digital)',type:'shopeepay'};
 if(/GoPay|Gojek/i.test(s))return {bank:'GoPay (Dompet Digital)',type:'gopay'};
 if(/OVO/i.test(s))return {bank:'OVO (Dompet Digital)',type:'ovo'};
 if(/DANA/i.test(s))return {bank:'DANA (Dompet Digital)',type:'dana'};
 return null;
}
function parseMandiriStatement(lines,year,currency){
 const rows=[];
 for(const line of lines){
  if(/Saldo Awal|Mutasi Kredit|Mutasi Debit|Saldo Akhir|Previous Balance|Current Balance|Tabungan|Cabang|Valuta/i.test(line))continue;
  const m=line.match(/^(\d{1,2}\/\d{1,2})(?:\s+\d{1,2}\/\d{1,2})?\s+(.+?)\s+([\d.,]+)\s*(D|CR|DB)?(?:\s+[\d.,]+)?$/i);
  if(!m)continue;
  const [_,dStr,desc,amtStr,flag]=m;const [day,month]=dStr.split('/');
  const date=`${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
  try{
   const amount=number(amtStr,currency),kind=/^(D|DB)$/i.test(flag||'')?'expense':'income';
   const name=cleanMerchant(desc,kind),category=suggestCategory(name,kind);
   rows.push({name,date,amount,kind,currency,category});
  }catch{}
 }
 return rows;
}
function parseBriStatement(lines,currency){
 const rows=[];let pendingTx=null;
 function commitPending(){
  if(!pendingTx||!pendingTx.debet||!pendingTx.kredit){pendingTx=null;return;}
  const debetVal=pendingTx.debet.replace(/[^\d.,]/g,''),kreditVal=pendingTx.kredit.replace(/[^\d.,]/g,'');
  const isDebetZero=/^0([.,]00?)?$/.test(debetVal),isKreditZero=/^0([.,]00?)?$/.test(kreditVal);
  let amount=0,kind='expense';
  try{
   if(!isDebetZero){amount=number(debetVal,currency);kind='expense';}
   else if(!isKreditZero){amount=number(kreditVal,currency);kind='income';}
   else{pendingTx=null;return;}
  }catch{pendingTx=null;return;}
  const name=cleanMerchant(pendingTx.desc,kind),category=suggestCategory(name,kind);
  rows.push({name,date:pendingTx.date,amount,kind,currency,category});
  pendingTx=null;
 }
 function extractNumbers(str){
  const m=str.match(/^(.*?)(?:\s+([A-Za-z0-9_#]{5,}))?\s+([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)$/);
  if(m)return {desc:m[1].trim(),debet:m[3],kredit:m[4],saldo:m[5]};
  const m2=str.match(/^(.*?)\s+([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)$/);
  if(m2)return {desc:m2[1].trim(),debet:m2[2],kredit:m2[3],saldo:m2[4]};
  return null;
 }
 for(const line of lines){
  const trimmed=line.trim();
  if(!trimmed)continue;
  if(/Tanggal Transaksi|Uraian Transaksi|Saldo Awal|Total Transaksi|Saldo Akhir|Laporan Transaksi|Kepada Yth|Unit Kerja|Valuta|Alamat|Halaman|Page|Terbilang|Created By/i.test(trimmed)){
   commitPending();continue;
  }
  const dateMatch=trimmed.match(/^(\d{1,2}\/\d{1,2}\/(\d{2,4}))(?:\s+(\d{2}:\d{2}:\d{2}))?\s*(.*)$/);
  if(dateMatch){
   commitPending();
   let [d,m,y]=dateMatch[1].split('/');if(y.length===2)y='20'+y;
   const date=`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`,rest=dateMatch[4]||'';
   const nums=extractNumbers(rest);
   if(nums){
    pendingTx={date,desc:nums.desc,debet:nums.debet,kredit:nums.kredit,saldo:nums.saldo};
   }else{
    pendingTx={date,desc:rest.trim(),debet:null,kredit:null,saldo:null};
   }
   continue;
  }
  if(pendingTx&&!/^\d{1,2}\/\d{1,2}/.test(trimmed)&&!/MCDO\d+|Created By/i.test(trimmed)){
   if(!pendingTx.debet){
    const nums=extractNumbers(trimmed);
    if(nums){
     pendingTx.desc=(pendingTx.desc+' '+nums.desc).trim();
     pendingTx.debet=nums.debet;pendingTx.kredit=nums.kredit;pendingTx.saldo=nums.saldo;
    }else{
     pendingTx.desc+=' '+trimmed;
    }
   }else{
    pendingTx.desc+=' '+trimmed;
   }
  }
 }
 commitPending();
 return rows;
}
function parseBriCreditCardStatement(lines,currency){
 const rows=[];
 for(const line of lines){
  const trimmed=line.trim();
  if(!trimmed)continue;
  if(/Tagihan Bulan|Informasi Kredit|Kolektibilitas|Bunga Pembelanjaan|Lembar Penagihan|Billing Statement|Nomor Kartu|Kredit Limit|Halaman|Page/i.test(trimmed))continue;
  const m=trimmed.match(/^(\d{2}-\d{2}-\d{4})\s+(\d{2}-\d{2}-\d{4})\s+(.+?)(?:\s+IDR\s+[\d.,]+\s+[\d.,]+)?\s+([\d.,]+)\s*(CR)?$/i);
  if(!m)continue;
  const [_,txDate,postDate,desc,amtStr,crFlag]=m;const [day,month,year]=txDate.split('-');
  const date=`${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
  try{
   const amount=number(amtStr,currency),kind=crFlag?'income':'expense';
   const name=cleanMerchant(desc,kind),category=suggestCategory(name,kind);
   rows.push({name,date,amount,kind,currency,category});
  }catch{}
 }
 return rows;
}
function parseSeaBankStatement(lines,year,currency,fullText){
 const rows=[];let currentTx=null,runningBalance=null;
 const openMatch=fullText.match(/SALDO AWAL\s*\(IDR\)\s*.*?\bTABUNGAN\s+([\d.,]+)/i);
 if(openMatch){try{runningBalance=number(openMatch[1],currency);}catch{}}
 function pushSeaBankTx(tx){
  const m3=tx.raw.match(/^(.*?)\s+([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)$/);
  const m2=tx.raw.match(/^(.*?)\s+([\d.,]+)\s+([\d.,]+)$/);
  if(m3&&!/^\d+$/.test(m3[1].trim())){
   const [_,desc,keluarStr,masukStr,saldoStr]=m3;
   const isKeluarZero=/^0([.,]00?)?$/.test(keluarStr),isMasukZero=/^0([.,]00?)?$/.test(masukStr);
   if(!isKeluarZero||!isMasukZero){
    try{
     const endBalance=number(saldoStr,currency),kind=!isKeluarZero?'expense':'income';
     const amount=number(!isKeluarZero?keluarStr:masukStr,currency);
     const name=cleanMerchant(desc,kind),category=suggestCategory(name,kind);
     rows.push({name,date:tx.date,amount,kind,currency,category});
     runningBalance=endBalance;return true;
    }catch{}
   }
  }
  if(m2){
   const [_,desc,amtStr,saldoStr]=m2;
   try{
    const amount=number(amtStr,currency),endBalance=number(saldoStr,currency);
    let kind='expense';
    if(runningBalance!==null&&runningBalance!==undefined){
     kind=endBalance>runningBalance?'income':'expense';
    }else{
     kind=(/Bunga|Masuk|Pembalikan|ShopeePay Transfer|SUPERBANK|Midtrans/i.test(desc)&&!/Pajak|Google Play|Pembayaran/i.test(desc))?'income':'expense';
    }
    const name=cleanMerchant(desc,kind),category=suggestCategory(name,kind);
    rows.push({name,date:tx.date,amount,kind,currency,category});
    runningBalance=endBalance;return true;
   }catch{}
  }
  return false;
 }
 for(const line of lines){
  if(/sampai.*SEP|RINGKASAN REKENING|TABUNGAN - RINCIAN|TANGGAL TRANSAKSI|SALDO AKHIR|TOTAL:|REKENING KORAN|Ketentuan Umum|Syarat Layanan|Hubungi kami/i.test(line))continue;
  if(/^halaman\s+\d+\s+dr\s+\d+$/i.test(line)||/TABUNGAN\s+[\d.,]+\s+[\d.,]+\s+[\d.,]+/i.test(line))continue;
  const dateMatch=line.match(/^(\d{1,2})\s+(JAN|FEB|MAR|APR|MEI|MAY|JUN|JUL|AGU|AGT|AUG|SEP|OKT|OCT|NOV|DES|DEC)\b\s*(.*)$/i);
  if(dateMatch){
   if(currentTx)pushSeaBankTx(currentTx);
   const [_,dayStr,monStr,rest]=dateMatch,month=MONTH_MAP[monStr.toLowerCase()]||'01';
   currentTx={date:`${year}-${month}-${dayStr.padStart(2,'0')}`,raw:rest||''};
   if(pushSeaBankTx(currentTx))currentTx=null;
   continue;
  }
  if(currentTx){currentTx.raw+=' '+line;if(pushSeaBankTx(currentTx))currentTx=null;}
 }
 if(currentTx)pushSeaBankTx(currentTx);
 return rows;
}
function parseBcaStatement(lines,year,currency){
 const rows=[];
 for(const line of lines){
  if(/REKENING TAHAPAN|PERIODE|SALDO AWAL|MUTASI CR|MUTASI DB|SALDO AKHIR/i.test(line))continue;
  const m=line.match(/^(\d{1,2}\/\d{1,2})\s+(.+?)\s+([\d.,]+)\s+(DB|CR)(?:\s+[\d.,]+)?$/i);
  if(!m)continue;
  const [_,dStr,desc,amtStr,flag]=m;const [day,month]=dStr.split('/');
  const date=`${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
  try{
   const amount=number(amtStr,currency),kind=/^DB$/i.test(flag)?'expense':'income';
   const name=cleanMerchant(desc,kind),category=suggestCategory(name,kind);
   rows.push({name,date,amount,kind,currency,category});
  }catch{}
 }
 return rows;
}
function parseJagoStatement(lines,currency='IDR'){
 const rows=[];let pending=null;
 function commit(item){
  if(!item||!item.date||!item.amountStr)return;
  try{
   const isNegative=item.amountStr.startsWith('-');
   const kind=isNegative?'expense':'income';
   const cleanAmt=item.amountStr.replace(/[+-]/g,'').trim();
   const amount=number(cleanAmt,currency);
   let desc=item.desc.replace(/ID#\s*\d+/g,'').replace(/\s+/g,' ').trim();
   const isTransfer=/Pindah uang antar Kantong|Tambah Uang Kantong|Tarik Uang Kantong/i.test(desc);
   const name=cleanMerchant(desc,kind);
   const category=isTransfer?'Transfer Antar Akun':suggestCategory(name,kind);
   rows.push({name,date:item.date,amount,kind,currency,category});
  }catch{}
 }
 for(let i=0;i<lines.length;i++){
  const line=lines[i].trim();
  if(!line||(!/^\d{1,2}\s+[A-Za-z]{3,4}\s+\d{4}/.test(line)&&/Laporan Keuangan|PT Bank Jago|ID Kantong|Saldo Sebelumnya|Total Pemasukan|Total Pengeluaran|Saldo Akhir|Tanggal & Waktu|Sumber\/Tujuan|Rincian Transaksi|Catatan|Jumlah|Saldo|Mata Uang/i.test(line)))continue;
  const singleMatch=line.match(/^(\d{1,2})\s+([A-Za-z]{3,4})\s+(\d{4})(?:\s+\d{1,2}[.:]\d{2})?\s+(.+?)\s+([+-]\s*[\d.,]+)(?:\s+[\d.,]+)?$/);
  if(singleMatch){
   if(pending){commit(pending);pending=null;}
   const [_,day,monStr,yr,desc,amtStr]=singleMatch;
   const mon=MONTH_MAP[monStr.toLowerCase().slice(0,3)]||'01';
   const date=`${yr}-${mon}-${day.padStart(2,'0')}`;
   commit({date,desc,amountStr:amtStr.replace(/\s+/g,'')});
   continue;
  }
  const dateMatch=line.match(/^(\d{1,2})\s+([A-Za-z]{3,4})\s+(\d{4})$/);
  if(dateMatch){
   if(pending){commit(pending);pending=null;}
   const [_,day,monStr,yr]=dateMatch;
   const mon=MONTH_MAP[monStr.toLowerCase().slice(0,3)]||'01';
   pending={date:`${yr}-${mon}-${day.padStart(2,'0')}`,descParts:[],amountStr:null};
   continue;
  }
  if(pending){
   const amtMatch=line.match(/^([+-]\s*[\d.,]+)(?:\s+[\d.,]+)?$/);
   if(amtMatch){
    pending.amountStr=amtMatch[1].replace(/\s+/g,'');
    pending.desc=pending.descParts.join(' ');
    commit(pending);
    pending=null;
   }else if(!/^\d{1,2}[.:]\d{2}$/.test(line)){
    pending.descParts.push(line);
   }
  }
 }
 if(pending&&pending.amountStr)commit(pending);
 return rows;
}

function parseIndoDate(str, fallbackYear = new Date().getFullYear()) {
 if(!str)return null;
 const s=String(str).trim();
 const iso=s.match(/^(\d{4})-(\d{2})-(\d{2})/);
 if(iso)return `${iso[1]}-${iso[2]}-${iso[3]}`;
 const slash=s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
 if(slash){
  let yr=slash[3];
  if(yr.length===2)yr='20'+yr;
  return `${yr}-${slash[2].padStart(2,'0')}-${slash[1].padStart(2,'0')}`;
 }
 const dmNoYear=s.match(/^(\d{1,2})[/-](\d{1,2})$/);
 if(dmNoYear){
  return `${fallbackYear}-${dmNoYear[2].padStart(2,'0')}-${dmNoYear[1].padStart(2,'0')}`;
 }
 const word=s.match(/^(\d{1,2})\s+([A-Za-z]{3,4})(?:\s+(\d{2,4}))?/);
 if(word){
  const day=word[1].padStart(2,'0');
  const mon=MONTH_MAP[word[2].toLowerCase().slice(0,3)]||'01';
  let yr=word[3]||String(fallbackYear);
  if(yr.length===2)yr='20'+yr;
  return `${yr}-${mon}-${day}`;
 }
 return null;
}

function parseGopayStatement(lines, year = new Date().getFullYear(), currency = 'IDR') {
 const rows = [];
 for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line || (!/\d{1,2}[\s/-]/.test(line) && /Riwayat Transaksi|GoPay|Saldo Awal|Saldo Akhir|Total Pemasukan|Total Pengeluaran|Status|Nomor Pesanan|Order ID/i.test(line))) continue;

  const m = line.match(/^(\d{1,2}(?:[\s/-][A-Za-z]{3,4}[\s/-]|\/\d{1,2}\/|\s+[A-Za-z]{3,4}\s+)(?:\d{2,4})?)(?:\s+\d{1,2}[.:]\d{2}(?:[.:]\d{2})?)?\s+(.+?)\s+([+-]?\s*(?:Rp\s*)?[\d.,]+)(?:\s+(?:Berhasil|Selesai|Sukses|Pending|Gagal))?$/i);
  if (m) {
   const [_, dStr, descRaw, amtStr] = m;
   const parsedDate = parseIndoDate(dStr, year);
   if (!parsedDate) continue;
   const isIncome = amtStr.includes('+') || /masuk|top up|cashback|refund|terima/i.test(descRaw);
   const kind = isIncome ? 'income' : 'expense';
   try {
    const cleanAmt = amtStr.replace(/[^\d.,]/g, '');
    const amount = number(cleanAmt, currency);
    const name = descRaw.replace(/^[-•\s]+/, '').replace(/[-•\s]+$/, '').trim() || 'GoPay Transaction';
    const category = suggestCategory(name, kind);
    rows.push({ name, date: parsedDate, amount, kind, currency, category });
   } catch (e) {}
   continue;
  }
 }
 return rows;
}

function parseOvoStatement(lines, year = new Date().getFullYear(), currency = 'IDR') {
 const rows = [];
 for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line || (!/\d{1,2}[\s/-]/.test(line) && /OVO Cash|OVO Points|Riwayat Transaksi|Total Transaksi|Tanggal|Keterangan|Nominal/i.test(line))) continue;

  const m = line.match(/^(\d{1,2}(?:[\s/-][A-Za-z]{3,4}[\s/-]|\/\d{1,2}\/|\s+[A-Za-z]{3,4}\s+)(?:\d{2,4})?)(?:\s+\d{1,2}[.:]\d{2})?\s+(.+?)\s+([+-]?\s*(?:Rp\s*)?[\d.,]+)(?:\s+(?:Berhasil|Selesai|Sukses))?$/i);
  if (m) {
   const [_, dStr, descRaw, amtStr] = m;
   const parsedDate = parseIndoDate(dStr, year);
   if (!parsedDate) continue;
   const isIncome = amtStr.includes('+') || /top up|cashback|points|masuk|terima/i.test(descRaw);
   const kind = isIncome ? 'income' : 'expense';
   try {
    const cleanAmt = amtStr.replace(/[^\d.,]/g, '');
    const amount = number(cleanAmt, currency);
    const name = descRaw.replace(/^[-•\s]+/, '').replace(/[-•\s]+$/, '').trim() || 'OVO Transaction';
    const category = suggestCategory(name, kind);
    rows.push({ name, date: parsedDate, amount, kind, currency, category });
   } catch (e) {}
   continue;
  }
 }
 return rows;
}

function parseDanaStatement(lines, year = new Date().getFullYear(), currency = 'IDR') {
 const rows = [];
 for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line || (!/\d{1,2}[\s/-]/.test(line) && /Dompet Digital DANA|Riwayat Transaksi|Semua Transaksi|Filter|Unduh/i.test(line))) continue;

  const m = line.match(/^(\d{1,2}(?:[\s/-][A-Za-z]{3,4}[\s/-]|\/\d{1,2}\/|\s+[A-Za-z]{3,4}\s+)(?:\d{2,4})?)(?:\s+\d{1,2}[.:]\d{2}(?:[.:]\d{2})?)?\s+(.+?)\s+([+-]?\s*(?:Rp\s*)?[\d.,]+)(?:\s+(?:Berhasil|Selesai|Sukses|Pending))?$/i);
  if (m) {
   const [_, dStr, descRaw, amtStr] = m;
   const parsedDate = parseIndoDate(dStr, year);
   if (!parsedDate) continue;
   const isIncome = amtStr.includes('+') || /isi saldo|top up|cashback|terima uang/i.test(descRaw);
   const kind = isIncome ? 'income' : 'expense';
   try {
    const cleanAmt = amtStr.replace(/[^\d.,]/g, '');
    const amount = number(cleanAmt, currency);
    const name = descRaw.replace(/^[-•\s]+/, '').replace(/[-•\s]+$/, '').trim() || 'DANA Transaction';
    const category = suggestCategory(name, kind);
    rows.push({ name, date: parsedDate, amount, kind, currency, category });
   } catch (e) {}
   continue;
  }
 }
 return rows;
}

function parseShopeePayStatement(lines, year = new Date().getFullYear(), currency = 'IDR') {
 const rows = [];
 for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line || (!/\d{1,2}[\s/-]/.test(line) && /ShopeePay|Rincian Transaksi|Saldo ShopeePay|Semua|Pengeluaran|Pemasukan/i.test(line))) continue;

  const m = line.match(/^(\d{1,2}(?:[\s/-][A-Za-z]{3,4}[\s/-]|\/\d{1,2}\/|\s+[A-Za-z]{3,4}\s+|-\d{1,2}-)(?:\d{2,4})?)(?:\s+\d{1,2}[.:]\d{2})?\s+(.+?)\s+([+-]?\s*(?:Rp\s*)?[\d.,]+)(?:\s+(?:Selesai|Berhasil|Sukses))?$/i);
  if (m) {
   const [_, dStr, descRaw, amtStr] = m;
   const parsedDate = parseIndoDate(dStr, year);
   if (!parsedDate) continue;
   const isIncome = amtStr.includes('+') || /top up|pengembalian|refund|terima/i.test(descRaw);
   const kind = isIncome ? 'income' : 'expense';
   try {
    const cleanAmt = amtStr.replace(/[^\d.,]/g, '');
    const amount = number(cleanAmt, currency);
    const name = descRaw.replace(/^[-•\s]+/, '').replace(/[-•\s]+$/, '').trim() || 'ShopeePay Transaction';
    const category = suggestCategory(name, kind);
    rows.push({ name, date: parsedDate, amount, kind, currency, category });
   } catch (e) {}
   continue;
  }
 }
 return rows;
}

function parseReceipt(lines,today,currency){
 if(!lines||!lines.length)return null;
 let merchant='';
 for(let i=0;i<Math.min(lines.length,10);i++){
  const l=lines[i];
  if(/INDOMARET/i.test(l)){merchant='Indomaret';break;}
  if(/ALFAMART/i.test(l)){merchant='Alfamart';break;}
  if(/ALFAMIDI/i.test(l)){merchant='Alfamidi';break;}
  if(/SUPERINDO|SUPER INDO/i.test(l)){merchant='Super Indo';break;}
  if(/PERTAMINA|SPBU/i.test(l)){merchant='SPBU Pertamina';break;}
  if(/SHELL/i.test(l)){merchant='SPBU Shell';break;}
  if(/MIE GACOAN/i.test(l)){merchant='Mie Gacoan';break;}
  if(/STARBUCKS/i.test(l)){merchant='Starbucks Coffee';break;}
  if(/KOPI KENANGAN/i.test(l)){merchant='Kopi Kenangan';break;}
  if(/KFC/i.test(l)){merchant='KFC';break;}
  if(/MCDONALD|MCD/i.test(l)){merchant='McDonald\'s';break;}
  if(/HOKBEN/i.test(l)){merchant='HokBen';break;}
  if(/PIZZA HUT/i.test(l)){merchant='Pizza Hut';break;}
  if(/SOLARIA/i.test(l)){merchant='Solaria';break;}
  if(/KIMIA FARMA/i.test(l)){merchant='Apotek Kimia Farma';break;}
  if(/WATSON/i.test(l)){merchant='Watsons';break;}
  if(/GUARDIAN/i.test(l)){merchant='Guardian';break;}
 }
 if(!merchant){
  for(const l of lines.slice(0,5)){
   if(!/^(PT\b|CV\b|NPWP|JL\b|JALAN|TELP|STRUK|KASIR|NO\b|NOTA|ORDER)/i.test(l)&&l.length>3){
    merchant=l.replace(/[^\w\s&.-]/g,'').trim().slice(0,80);
    break;
   }
  }
 }
 if(!merchant)return null;

 let date=today;
 for(const l of lines){
  const dm=l.match(/\b(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})\b/);
  if(dm){
   let [_,d,m,y]=dm;if(y.length===2)y='20'+y;
   if(Number(m)<=12&&Number(d)<=31){
    date=`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
    break;
   }
  }
 }

 let totalAmount=null;
 for(let i=lines.length-1;i>=0;i--){
  const l=lines[i];
  if(/(subtotal|sub total|kembali|kembalian|change|diskon|potongan|tunai|cash)/i.test(l))continue;
  if(/\b(grand total|total belanja|total akhir|total bayar|total|jumlah|harga jual)\b/i.test(l)){
   const nums=[...l.matchAll(/([\d.,]+)/g)].map(x=>x[1]).filter(x=>/\d{3}/.test(x)||/^[1-9]\d*$/.test(x));
   if(nums.length){
    try{totalAmount=number(nums.at(-1),currency);break;}catch{}
   }
  }
 }

 if(!totalAmount)return null;
 const kind='expense';
 const name=cleanMerchant(merchant,kind),category=suggestCategory(name,kind);
 return [{name,date,amount:totalAmount,kind,currency,category}];
}
function parse(text,currency='IDR',today=new Date().toISOString().slice(0,10)) {
 currency=/\bRp\b|\bIDR\b/i.test(text)?'IDR':(/\b(USD|EUR|GBP|SGD|AUD|JPY)\b/i.exec(text)?.[1]?.toUpperCase()||currency);
 const lines=String(text).split(/\n/).map(x=>x.trim()).filter(Boolean);
 let year=(text.match(/Periode\s*:\s*\d{1,2}\/\d{2}\/(\d{2,4})/i)||text.match(/sampai.*?\b(20\d{2})\b/i)||text.match(/\b(20\d{2})\b/))?.[1]||today.slice(0,4);
 if(year.length===2)year='20'+year;

 const detected=detectBankStatement(text);
 if(detected){
  if(detected.type==='mandiri'){const rows=parseMandiriStatement(lines,year,currency);if(rows.length)return rows;}
  else if(detected.type==='bri'){const rows=parseBriStatement(lines,currency);if(rows.length)return rows;}
  else if(detected.type==='bri_kk'){const rows=parseBriCreditCardStatement(lines,currency);if(rows.length)return rows;}
  else if(detected.type==='seabank'){const rows=parseSeaBankStatement(lines,year,currency,text);if(rows.length)return rows;}
  else if(detected.type==='bca'){const rows=parseBcaStatement(lines,year,currency);if(rows.length)return rows;}
  else if(detected.type==='jago'){const rows=parseJagoStatement(lines,currency);if(rows.length)return rows;}
  else if(detected.type==='gopay'){const rows=parseGopayStatement(lines,year,currency);if(rows.length)return rows;}
  else if(detected.type==='ovo'){const rows=parseOvoStatement(lines,year,currency);if(rows.length)return rows;}
  else if(detected.type==='dana'){const rows=parseDanaStatement(lines,year,currency);if(rows.length)return rows;}
  else if(detected.type==='shopeepay'){const rows=parseShopeePayStatement(lines,year,currency);if(rows.length)return rows;}
 }

 const gopayCandidate=parseGopayStatement(lines,year,currency);
 if(gopayCandidate.length>=1)return gopayCandidate;
 const ovoCandidate=parseOvoStatement(lines,year,currency);
 if(ovoCandidate.length>=1)return ovoCandidate;
 const danaCandidate=parseDanaStatement(lines,year,currency);
 if(danaCandidate.length>=1)return danaCandidate;
 const shopeePayCandidate=parseShopeePayStatement(lines,year,currency);
 if(shopeePayCandidate.length>=1)return shopeePayCandidate;

 const jagoCandidate=parseJagoStatement(lines,currency);
 if(jagoCandidate.length>=1)return jagoCandidate;
 const mandiriCandidate=parseMandiriStatement(lines,year,currency);
 if(mandiriCandidate.length>=2)return mandiriCandidate;
 const briCandidate=parseBriStatement(lines,currency);
 if(briCandidate.length>=2)return briCandidate;
 const briKkCandidate=parseBriCreditCardStatement(lines,currency);
 if(briKkCandidate.length>=2)return briKkCandidate;
 const seaBankCandidate=parseSeaBankStatement(lines,year,currency,text);
 if(seaBankCandidate.length>=2)return seaBankCandidate;
 const bcaCandidate=parseBcaStatement(lines,year,currency);
 if(bcaCandidate.length>=2)return bcaCandidate;

 const receiptCandidate=parseReceipt(lines,today,currency);
 if(receiptCandidate)return receiptCandidate;

 const rows=[];
 for(const line of lines){
  const m=line.match(/^(\d{4}-\d{2}-\d{2})[\s;,]+(.+?)[\s;]+(-?[\d.,]+)\s*(CR|DR|income|expense)?$/i);
  if(m){
   try{
    const kind=/^(CR|income)$/i.test(m[4]||'')?'income':'expense';
    const name=m[2];
    rows.push({name,date:m[1],amount:number(m[3].replace(/^-/,''),currency),kind,currency,category:suggestCategory(name,kind)});
   }catch{}
  }
 }
 if(rows.length)return rows;
 const total=lines.filter(x=>/\b(total|jumlah|grand total)\b/i.test(x)&&!/(subtotal|sub total)/i.test(x)).at(-1);
 const candidate=total||lines.join(' ');const matches=[...candidate.matchAll(/(\d[\d.,]*)\s*(ribu|rb|juta|jt)?/gi)];if(!matches.length)return [];
 const m=matches.at(-1);let amount=number(m[1],currency);if(/^(ribu|rb)$/i.test(m[2]||''))amount*=1000;if(/^(juta|jt)$/i.test(m[2]||''))amount*=1000000;
 if(!Number.isSafeInteger(amount))throw Error('Nominal terlalu besar');
 const kind=/\b(terima|gaji|income)\b/i.test(text)?'income':'expense';
 const name=(lines[0]||'Imported record').slice(0,120);
 return [{name,date:today,amount,kind,currency,category:suggestCategory(name,kind)}];
}
function duplicates(state,row){
 const list=[];
 const txs=state.transactions||[];
 const rDate=Date.parse(row.date);
 const rName=String(row.name||'').toLowerCase().trim();
 const rAmt=row.amount;
 const rCurr=row.currency;
 const rKind=row.kind;
 const rAcc=row.accountId;

 for(const t of txs){
  const tDate=Date.parse(t.date);
  if(isNaN(tDate)||isNaN(rDate))continue;
  if(Math.abs(tDate-rDate)>2*86400000)continue;

  // 1. Same account match (Exact or nearby)
  if(t.accountId===rAcc&&t.currency===rCurr&&t.amount===rAmt&&t.kind===rKind){
   const tName=String(t.name||'').toLowerCase().trim();
   const isExact=t.date===row.date&&tName===rName;
   list.push({id:t.id,type:'same_account',reason:isExact?'Exact match':'Same account, amount and nearby date'});
   continue;
  }

  // 2. Inter-account Transfer detection with existing transfer transactions
  // If row is income on Account B, and t is a transfer from Account A -> Account B
  if(rKind==='income'&&t.kind==='transfer'&&t.targetId===rAcc){
   const matchAmt=(t.targetAmount!==undefined?t.targetAmount:t.amount)===rAmt;
   if(matchAmt){
    const srcName=state.accounts?.find(a=>a.id===t.accountId)?.name||'akun lain';
    list.push({id:t.id,type:'transfer_counterpart',reason:`Transfer counterpart: sudah tercatat sebagai transfer masuk dari ${srcName}`});
    continue;
   }
  }

  // If row is expense on Account A, and t is a transfer from Account A -> Account B
  if(rKind==='expense'&&t.kind==='transfer'&&t.accountId===rAcc&&t.amount===rAmt){
   const dstName=state.accounts?.find(a=>a.id===t.targetId)?.name||'akun lain';
   list.push({id:t.id,type:'transfer_counterpart',reason:`Transfer counterpart: sudah tercatat sebagai transfer keluar ke ${dstName}`});
   continue;
  }

  // If row is transfer from A -> B
  if(rKind==='transfer'){
   if(t.kind==='transfer'&&t.accountId===rAcc&&t.targetId===row.targetId&&t.amount===rAmt){
    list.push({id:t.id,type:'transfer_exact',reason:'Exact transfer match'});
    continue;
   }
   if(t.kind==='expense'&&t.accountId===rAcc&&t.amount===rAmt){
    list.push({id:t.id,type:'transfer_counterpart',reason:'Potential duplicate with standalone expense on source account'});
    continue;
   }
   if(t.kind==='income'&&t.accountId===row.targetId&&(t.targetAmount||t.amount)===rAmt){
    list.push({id:t.id,type:'transfer_counterpart',reason:'Potential duplicate with standalone income on destination account'});
    continue;
   }
  }
 }
 return list;
}

function pairTransferDrafts(draftList,accounts=[]){
 const paired=[];const consumed=new Set();
 for(let i=0;i<draftList.length;i++){
  if(consumed.has(i))continue;
  const d1=draftList[i];
  if(!['expense','income'].includes(d1.kind)){paired.push(d1);continue;}
  let matchIdx=-1;
  for(let j=i+1;j<draftList.length;j++){
   if(consumed.has(j))continue;
   const d2=draftList[j];
   if(!['expense','income'].includes(d2.kind))continue;
   if(d1.kind===d2.kind)continue;
   if(d1.accountId===d2.accountId)continue;
   if(d1.amount!==d2.amount)continue;
   const daysDiff=Math.abs(Date.parse(d1.date)-Date.parse(d2.date));
   if(daysDiff>2*86400000)continue;
   const acc1=accounts.find(a=>a.id===d1.accountId);
   const acc2=accounts.find(a=>a.id===d2.accountId);
   const t1=(d1.name+' '+(d1.category||'')).toLowerCase();
   const t2=(d2.name+' '+(d2.category||'')).toLowerCase();
   const isTransferMention=/transfer|pindah|bi-fast|overbooking|trf|inhouse|kliring|llg/i.test(t1)||/transfer|pindah|bi-fast|overbooking|trf|inhouse|kliring|llg/i.test(t2);
   const crossMention=(acc2&&t1.includes(acc2.name.toLowerCase().slice(0,3)))||(acc1&&t2.includes(acc1.name.toLowerCase().slice(0,3)));
   if(isTransferMention||crossMention||daysDiff===0){matchIdx=j;break;}
  }
  if(matchIdx!==-1){
   consumed.add(i);consumed.add(matchIdx);
   const d2=draftList[matchIdx];
   const outDraft=d1.kind==='expense'?d1:d2;
   const inDraft=d1.kind==='income'?d1:d2;
   const srcAcc=accounts.find(a=>a.id===outDraft.accountId);
   const dstAcc=accounts.find(a=>a.id===inDraft.accountId);
   paired.push({
    ...outDraft,
    name:`Transfer: ${srcAcc?.name||'Akun Asal'} → ${dstAcc?.name||'Akun Tujuan'}`,
    kind:'transfer',
    accountId:outDraft.accountId,
    targetId:inDraft.accountId,
    category:'Transfer',
    affectBalance:outDraft.affectBalance??true,
    selected:true,
    pairedFrom:[outDraft.name,inDraft.name]
   });
  }else{
   paired.push(d1);
  }
 }
 return paired;
}
function rates(rows){const result={IDR:1},dates=[];for(const r of rows){if(r.base!=='IDR'||!['USD','EUR','GBP','SGD','AUD','JPY'].includes(r.quote))continue;if(!Number.isFinite(r.rate)||r.rate<=0||!/^\d{4}-\d{2}-\d{2}$/.test(r.date))throw Error('Invalid FX response');result[r.quote]=1/r.rate;dates.push(r.date);}if(Object.keys(result).length!==7)throw Error('Incomplete FX response');return {rates:result,date:dates.sort()[0],source:'Frankfurter · daily reference rates',updatedAt:new Date().toISOString()};}
function quickIntent(text){
 const s=String(text).trim();
 if(/^(berapa|apa|apakah|bagaimana|mengapa|kapan|how|what|why|when|can|is|which)\b/i.test(s))return 'question';
 if(/\b(transfer|pindah|pindahkan)\b/i.test(s))return 'transfer';
 return /\b(catat|gajian|gaji|terima|pemasukan|pendapatan|beli|bayar|belanja|pengeluaran|spent|paid|bought|salary|income|expense|record|kopi|makan|bensin|listrik|pulsa|token|lunch|dinner|coffee|groceries)\b/i.test(s)?'record':'question';
}
function quickRecord(text,account,today,accounts=[]){
 if(!account)throw Error('Pilih akun pencatatan / Choose a recording account');
 const isTransfer=quickIntent(text)==='transfer';

 if(isTransfer){
  const clean=String(text);
  if(/-\s*\d/.test(clean))throw Error('Gunakan nominal positif / Use a positive amount');
  const matches=[...clean.matchAll(/(\d[\d.,]*)\s*(ribu|rb|juta|jt)?/gi)];
  if(!matches.length)throw Error('Gunakan satu nominal per pesan / Use one amount per message');
  const m=matches[matches.length-1];let amount=number(m[1]);if(/^(ribu|rb)$/i.test(m[2]||''))amount*=1000;if(/^(juta|jt)$/i.test(m[2]||''))amount*=1000000;
  if(!Number.isSafeInteger(amount))throw Error('Nominal terlalu besar / Amount too large');

  let srcAcc=account, dstAcc=null;
  const sLower=text.toLowerCase();

  for(const a of accounts){
   const aName=a.name.toLowerCase();
   const aTokens=aName.split(/[\s-_/]+/).filter(x=>x.length>=2);
   for(const token of aTokens){
    const fromRe=new RegExp(`\\bdari\\s+${token}\\b|\\bfrom\\s+${token}\\b`,'i');
    const toRe=new RegExp(`\\bke\\s+${token}\\b|\\bto\\s+${token}\\b`,'i');
    if(fromRe.test(sLower))srcAcc=a;
    if(toRe.test(sLower))dstAcc=a;
   }
  }

  if(!dstAcc){
   for(const a of accounts){
    if(a.id===srcAcc.id)continue;
    const aLower=a.name.toLowerCase();
    const aTokens=aLower.split(/[\s-_/]+/).filter(x=>x.length>=2);
    if(sLower.includes(aLower)||aTokens.some(tok=>sLower.includes(tok))){dstAcc=a;break;}
   }
  }

  if(!dstAcc){
   throw Error('Gunakan Tambah transaksi dan pilih Transfer agar akun asal dan tujuan tercatat dengan benar. / Use Add transaction and choose Transfer to record both source and destination accounts.');
  }
  if(dstAcc.id===srcAcc.id){
   throw Error('Pilih akun tujuan yang berbeda / Destination must be different');
  }

  return {
   name:String(text).trim().slice(0,120),
   date:today,
   amount,
   currency:srcAcc.currency,
   accountId:srcAcc.id,
   targetId:dstAcc.id,
   kind:'transfer',
   category:'Transfer'
  };
 }

 // Account suffixes must never be mistaken for a transaction amount.
 const clean=String(text).split(account.name).join('');
 if(/-\s*\d/.test(clean))throw Error('Gunakan nominal positif / Use a positive amount');
 const matches=[...clean.matchAll(/(\d[\d.,]*)\s*(ribu|rb|juta|jt)?/gi)];
 if(matches.length!==1)throw Error('Gunakan satu nominal per pesan / Use one amount per message');
 const m=matches[0];let amount=number(m[1]);if(/^(ribu|rb)$/i.test(m[2]||''))amount*=1000;if(/^(juta|jt)$/i.test(m[2]||''))amount*=1000000;
 if(!Number.isSafeInteger(amount))throw Error('Nominal terlalu besar / Amount too large');
 const explicit=/\b(Rp|IDR|USD|EUR|GBP|SGD|AUD|JPY)\b/i.exec(text)?.[1];
 const currency=explicit?(explicit.toUpperCase()==='RP'?'IDR':explicit.toUpperCase()):(m[2]?'IDR':account.currency);
 if(currency!==account.currency)throw Error('Mata uang pesan harus sama dengan akun / Message currency must match the account');
 return {name:String(text).trim().slice(0,120),date:today,amount,currency,accountId:account.id,kind:/\b(gajian|gaji|terima|pemasukan|pendapatan|salary|income|received)\b/i.test(text)?'income':'expense'};
}
const api={number,parse,parseReceipt,duplicates,pairTransferDrafts,rates,quickIntent,quickRecord,cleanMerchant,suggestCategory,detectBankStatement,parseJagoStatement,parseGopayStatement,parseOvoStatement,parseDanaStatement,parseShopeePayStatement};if(typeof module!=='undefined')module.exports=api;else root.InveysRecording=api;
})(typeof window!=='undefined'?window:globalThis);
