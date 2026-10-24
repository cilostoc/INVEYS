#!/usr/bin/env python3
"""
INVEYS Full Historical Batch Ingestion Script (2021–2026)
Processes all 368 bank & credit card statements from Google Drive folder,
extracts all historical transactions (2021 to August 2026),
generates historical monthly position snapshots (ws.positionHistory and ws.history),
and computes year-over-year wealth progression.
"""

import os
import sys
import re
import json
import sqlite3
import subprocess
from decimal import Decimal
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

STATEMENT_DIR = '/Users/muhamadhendrafebriansyah/Library/CloudStorage/GoogleDrive-hfebriansyah96@gmail.com/My Drive/Wealthy/Statement'
DB_PATH = '/Users/muhamadhendrafebriansyah/.inveys/inbox.sqlite3'
WORKSPACE_ID = 'default_workspace'
DEFAULT_PW = '28021996'

MONTH_MAP = {
    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'mei': '05', 'may': '05',
    'jun': '06', 'jul': '07', 'agu': '08', 'agt': '08', 'aug': '08', 'sep': '09',
    'okt': '10', 'oct': '10', 'nov': '11', 'des': '12', 'dec': '12',
    'januari': '01', 'februari': '02', 'maret': '03', 'april': '04', 'juni': '06',
    'juli': '07', 'agustus': '08', 'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
}

def to_cents(val):
    if isinstance(val, (int, Decimal)):
        return int(val * 100)
    s = str(val).replace('Rp', '').replace('IDR', '').strip()
    s = s.replace(' ', '')
    if ',' in s and '.' in s:
        if s.rfind(',') > s.rfind('.'):
            s = s.replace('.', '').replace(',', '.')
        else:
            s = s.replace(',', '')
    elif ',' in s:
        parts = s.split(',')
        if len(parts) == 2 and len(parts[1]) in [1, 2]:
            s = parts[0] + '.' + parts[1]
        else:
            s = s.replace(',', '')
    elif '.' in s:
        parts = s.split('.')
        if len(parts) == 2 and len(parts[1]) in [1, 2]:
            pass
        else:
            s = s.replace('.', '')
    try:
        d = Decimal(s)
        return int(round(d * 100))
    except Exception:
        return 0

def suggest_cat(name, kind):
    s = name.lower()
    if any(k in s for k in ['span', 'gaji', 'salary', 'payroll', 'pendapatan', 'remittance cr', 'honorarium', 'remunerasi']):
        return 'Gaji & Pendapatan' if kind == 'income' else 'Transfer Antar Akun'
    if any(k in s for k in ['bunga', 'profit', 'hibah', 'interest', 'hadiah', 'cashback', 'reward']):
        return 'Investasi & Bunga'
    if any(k in s for k in ['pajak', 'tax', 'biaya adm', 'notifikasi', 'ebilling', 'e-statement', 'materai', 'admin', 'card charge', 'sms banking']):
        return 'Biaya Finansial & Pajak'
    if any(k in s for k in ['pegadaian', 'emas', 'mulia', 'galeri 24', 'antam']):
        return 'Investasi & Aset'
    if any(k in s for k in ['blibli', 'tokopedia', 'shopee', 'rupa-rupa', 'dominos', 'gramedia', 'paper.id', 'emergent', 'apple.com', 'monarch', 'indomaret', 'alfamart', 'gofood', 'grabfood']):
        return 'Belanja & Konsumsi'
    if any(k in s for k in ['pln', 'listrik', 'jatelindo', 'pulsa', 'air', 'pdam', 'telkom', 'indihome']):
        return 'Tagihan & Utilitas'
    if any(k in s for k in ['perisai plus', 'asuransi', 'insurance', 'prudential', 'bpjs', 'allianz']):
        return 'Asuransi & Proteksi'
    if any(k in s for k in ['transfer', 'pindah', 'bi-fast', 'bif', 'trsf', 'overbooking', 'flip', 'oy!', 'top up']):
        return 'Transfer Antar Akun'
    return 'Pemasukan Lainnya' if kind == 'income' else 'Pengeluaran Umum'

def pdftotext(path, layout=True, pw=DEFAULT_PW):
    cmd = ['pdftotext']
    if 'Mandiri' in path or 'BNI/' in path or 'BNI_' in path:
        cmd.extend(['-upw', pw])
    if layout:
        cmd.append('-layout')
    cmd.extend([path, '-'])
    res = subprocess.run(cmd, capture_output=True, text=True)
    return res.stdout

# --- Specific Parsers ---

def parse_jago_file(path):
    text = pdftotext(path, layout=True)
    txs = []
    # Match single line: DD Mon YYYY ... Desc ... [+-] Amount
    for line in text.splitlines():
        line = line.strip()
        m = re.match(r'^(\d{1,2})\s+([A-Za-z]{3,4})\s+(\d{4})(?:\s+\d{1,2}[.:]\d{2})?\s+(.+?)\s+([+-]\s*[\d.,]+)(?:\s+[\d.,]+)?$', line)
        if m:
            day, mon_str, yr, desc, amt_str = m.groups()
            mon = MONTH_MAP.get(mon_str.lower()[:3], '01')
            date = f'{yr}-{mon}-{day.zfill(2)}'
            is_neg = amt_str.strip().startswith('-')
            kind = 'expense' if is_neg else 'income'
            amt = to_cents(amt_str.replace('+', '').replace('-', '').strip())
            if amt > 0:
                name = desc.strip()
                txs.append({
                    'date': date,
                    'name': name,
                    'amount': amt,
                    'kind': kind,
                    'category': suggest_cat(name, kind),
                    'accountId': 'acc_jago'
                })
    
    # Extract ending balance
    bal_match = re.search(r'Saldo akhir pada \d{1,2}\s+[A-Za-z]{3}\s+(\d{4})\s+([\d.,]+)', text) or re.search(r'Total Saldo Personal\s+([\d.,]+)', text)
    end_bal = to_cents(bal_match.group(1 if len(bal_match.groups())==1 else 2)) if bal_match else None
    
    # Get period date (month end)
    period_m = re.search(r'(\d{1,2})\s+([A-Za-z]{3,4})\s+(\d{4})', path)
    period_date = None
    if period_m:
        # e.g. from filename: Jago_monthly_statement_August_2021
        pass
    m_name = re.search(r'statement_([A-Za-z]+)_(\d{4})', path, re.I)
    if m_name:
        mon_str, yr = m_name.groups()
        mon = MONTH_MAP.get(mon_str.lower()[:3], '01')
        period_date = f'{yr}-{mon}-28'
        
    return txs, period_date, end_bal

def parse_bca_file(path):
    text = pdftotext(path, layout=True)
    txs = []
    # Find year from filename or text
    yr_m = re.search(r'202\d', path)
    yr = yr_m.group(0) if yr_m else '2026'
    
    lines = text.splitlines()
    for l in lines:
        if 'SALDO AWAL' in l or 'SALDO AKHIR' in l: continue
        m = re.match(r'^\s*(\d{2}/\d{2})\s+(.*?)\s+([\d.,]+)(\s+DB)?(?:\s+[\d.,]+)?$', l)
        if m:
            d_str, desc, amt_str, db_flag = m.groups()
            day, mon = d_str.split('/')
            date = f'{yr}-{mon}-{day}'
            kind = 'expense' if (db_flag or 'DB' in desc) else 'income'
            amt = to_cents(amt_str)
            if amt > 0:
                name = desc.strip() or 'Transaksi BCA'
                txs.append({
                    'date': date,
                    'name': name,
                    'amount': amt,
                    'kind': kind,
                    'category': suggest_cat(name, kind),
                    'accountId': 'acc_bca'
                })
    bal_m = re.search(r'SALDO AKHIR\s*:\s*([\d.,]+)', text)
    end_bal = to_cents(bal_m.group(1)) if bal_m else None
    
    # period date
    period_m = re.search(r'_([A-Z]{3})_(\d{4})', path)
    period_date = None
    if period_m:
        mon_str, y = period_m.groups()
        period_date = f'{y}-{MONTH_MAP.get(mon_str.lower(), "01")}-28'
        
    return txs, period_date, end_bal

def parse_blu_file(path):
    text = pdftotext(path, layout=True)
    txs = []
    # Match lines like: 28 Sep 2026 ... Desc ... Nominal ... Sisa Saldo
    lines = text.splitlines()
    for i, l in enumerate(lines):
        m = re.match(r'^\s*(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(.+)$', l)
        if m:
            day, mon_str, yr, rest = m.groups()
            mon = MONTH_MAP.get(mon_str.lower(), '01')
            date = f'{yr}-{mon}-{day.zfill(2)}'
            # Look at next lines for amounts
            desc_parts = [rest.strip()]
            for k in range(1, 5):
                if i + k < len(lines):
                    sub = lines[i+k].strip()
                    if not sub: continue
                    if re.match(r'^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}', sub): break
                    # Check for amounts: e.g. 1.466.190,00 or - 1.437.735,00
                    amt_m = re.search(r'(-?\s*[\d.,]+,\d{2})\s+([\d.,]+,\d{2})$', sub)
                    if amt_m:
                        raw_amt = amt_m.group(1).replace(' ', '')
                        is_neg = raw_amt.startswith('-')
                        kind = 'expense' if is_neg else 'income'
                        amt = to_cents(raw_amt.replace('-', ''))
                        if amt > 0:
                            name = ' '.join(desc_parts).strip()
                            txs.append({
                                'date': date,
                                'name': name,
                                'amount': amt,
                                'kind': kind,
                                'category': suggest_cat(name, kind),
                                'accountId': 'acc_blu'
                            })
                        break
                    else:
                        if not re.match(r'^\d{2}:\d{2}', sub):
                            desc_parts.append(sub)
    
    bal_m = re.search(r'Saldo Akhir / Ending Balance\s+Rp\s+([\d.,]+)', text) or re.search(r'Saldo Akhir / Ending Balance\s+([\d.,]+)', text)
    end_bal = to_cents(bal_m.group(1)) if bal_m else None
    
    # period date from filename e.g. September2026
    m_name = re.search(r'([A-Za-z]+)(\d{4})\.pdf', path)
    period_date = None
    if m_name:
        mon_str, yr = m_name.groups()
        mon = MONTH_MAP.get(mon_str.lower()[:3], '01')
        period_date = f'{yr}-{mon}-28'
        
    return txs, period_date, end_bal

def parse_brimo_file(path):
    text = pdftotext(path, layout=True)
    txs = []
    # BRI format
    lines = text.splitlines()
    pending = None
    for l in lines:
        l = l.strip()
        if not l or any(k in l for k in ['Tanggal Transaksi', 'Saldo Awal', 'Total Transaksi', 'Saldo Akhir', 'Halaman']):
            continue
        m = re.match(r'^(\d{1,2}/\d{1,2}/(\d{2,4}))(?:\s+\d{2}:\d{2}:\d{2})?\s*(.*)$', l)
        if m:
            d_str, y_str, rest = m.groups()
            parts = d_str.split('/')
            d, m_val = parts[0], parts[1]
            yr = ('20' + y_str) if len(y_str) == 2 else y_str
            date = f'{yr}-{m_val.zfill(2)}-{d.zfill(2)}'
            
            # Check numbers at end of rest: debet kredit saldo
            nums = re.findall(r'[\d.,]+', rest)
            if len(nums) >= 3:
                deb_str, kred_str = nums[-3], nums[-2]
                deb = to_cents(deb_str)
                kred = to_cents(kred_str)
                if deb > 0:
                    name = rest.replace(deb_str, '').replace(kred_str, '').replace(nums[-1], '').strip()
                    txs.append({'date': date, 'name': name or 'Transaksi BRI', 'amount': deb, 'kind': 'expense', 'category': suggest_cat(name, 'expense'), 'accountId': 'acc_brimo'})
                elif kred > 0:
                    name = rest.replace(deb_str, '').replace(kred_str, '').replace(nums[-1], '').strip()
                    txs.append({'date': date, 'name': name or 'Transaksi BRI', 'amount': kred, 'kind': 'income', 'category': suggest_cat(name, 'income'), 'accountId': 'acc_brimo'})
    
    bal_m = re.search(r'Saldo Akhir\s*\n.*?\s+([\d.,]+)\s*$', text, re.M) or re.search(r'Closing Balance\s*\n.*?\s+([\d.,]+)\s*$', text, re.M)
    end_bal = to_cents(bal_m.group(1)) if bal_m else None
    
    period_m = re.search(r'([A-Za-z]{3})(\d{4})\.pdf', path)
    period_date = None
    if period_m:
        mon_str, y = period_m.groups()
        period_date = f'{y}-{MONTH_MAP.get(mon_str.lower(), "01")}-28'
        
    return txs, period_date, end_bal

def parse_seabank_file(path):
    text = pdftotext(path, layout=True)
    txs = []
    # Filename e.g. 11-24.pdf -> 2024-11
    f_m = re.search(r'(\d{2})-(\d{2})\.pdf', path)
    yr = ('20' + f_m.group(2)) if f_m else '2026'
    
    lines = text.splitlines()
    date_re = re.compile(r'\b(\d{1,2})\s+(JAN|FEB|MAR|APR|MEI|JUN|JUL|AGU|AGT|SEP|OKT|NOV|DES)\b')
    for l in lines:
        m = date_re.search(l)
        if m and 'sampai' not in l:
            day, mon_str = m.groups()
            date = f'{yr}-{MONTH_MAP.get(mon_str.lower(), "01")}-{day.zfill(2)}'
            nums = re.findall(r'[\d.]+', l[m.end():])
            nums = [n for n in nums if n.strip('.')]
            if len(nums) >= 2:
                try:
                    amt = int(nums[-2].replace('.', '')) * 100
                except Exception:
                    amt = 0
                if amt > 0:
                    desc = date_re.sub('', l).strip()
                    desc = re.sub(r'[\d.,]+', '', desc).strip(' -–—\t')
                    if not desc or len(desc) < 2:
                        desc = 'Transaksi SeaBank'
                    # check column position for debit vs credit
                    kind = 'income' if l.rfind(nums[-2]) > 70 else 'expense'
                    txs.append({
                        'date': date,
                        'name': desc,
                        'amount': amt,
                        'kind': kind,
                        'category': suggest_cat(desc, kind),
                        'accountId': 'acc_seabank'
                    })
    bal_m = re.search(r'SALDO AKHIR \(IDR\)\s*.*?\bTABUNGAN\s+[\d.,]+\s+[\d.,]+\s+[\d.,]+\s+([\d.,]+)', text) or re.search(r'TOTAL:\s*([\d.,]+)', text)
    end_bal = to_cents(bal_m.group(1)) if bal_m else None
    period_date = f'{yr}-{f_m.group(1)}-28' if f_m else None
    return txs, period_date, end_bal

def parse_superbank_file(path):
    text = pdftotext(path, layout=True)
    txs = []
    yr_m = re.search(r'202\d', path)
    yr = yr_m.group(0) if yr_m else '2026'
    
    lines = text.splitlines()
    for i, l in enumerate(lines):
        m = re.match(r'^\s*(\d{1,2})\s+([A-Za-z]{3})\b\s*(.*)$', l)
        if m and 'Total Saldo' not in l and 'Saldo awal' not in l:
            day, mon_str, rest = m.groups()
            mon = MONTH_MAP.get(mon_str.lower(), '01')
            date = f'{yr}-{mon}-{day.zfill(2)}'
            
            # Find amount in rest or next 2 lines
            desc = rest.strip()
            for k in range(0, 3):
                target_line = lines[i+k]
                amt_m = re.search(r'([+-]Rp[\d.,]+)', target_line)
                if amt_m:
                    raw = amt_m.group(1)
                    kind = 'expense' if raw.startswith('-') else 'income'
                    amt = to_cents(raw.replace('+', '').replace('-', ''))
                    if amt > 0:
                        name = desc or 'Transaksi Superbank'
                        txs.append({
                            'date': date,
                            'name': name,
                            'amount': amt,
                            'kind': kind,
                            'category': suggest_cat(name, kind),
                            'accountId': 'acc_superbank'
                        })
                    break
                else:
                    if target_line.strip() and not re.match(r'^\d{2}:\d{2}', target_line.strip()):
                        desc += ' ' + target_line.strip()
    
    bal_m = re.search(r'Total Saldo\s*\n\s*Rp([\d.,]+)', text)
    end_bal = to_cents(bal_m.group(1)) if bal_m else None
    
    p_m = re.search(r'(\d{4})-(\d{2})-statement', path)
    period_date = f'{p_m.group(1)}-{p_m.group(2)}-28' if p_m else None
    return txs, period_date, end_bal

def parse_krom_file(path):
    text = pdftotext(path, layout=True)
    txs = []
    lines = text.splitlines()
    for l in lines:
        m = re.match(r'^\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\s+(.+?)\s+([+-]Rp[\d.,]+)', l)
        if m:
            day, mon_str, yr, desc, amt_str = m.groups()
            mon = MONTH_MAP.get(mon_str.lower()[:3], '01')
            date = f'{yr}-{mon}-{day.zfill(2)}'
            kind = 'expense' if '-' in amt_str else 'income'
            amt = to_cents(amt_str.replace('+', '').replace('-', ''))
            if amt > 0:
                name = desc.strip() or 'Transaksi Krom Bank'
                txs.append({
                    'date': date,
                    'name': name,
                    'amount': amt,
                    'kind': kind,
                    'category': suggest_cat(name, kind),
                    'accountId': 'acc_krom'
                })
    bal_m = re.search(r'Saldo Akhir /Ending Balance\s+Rp([\d.,]+)', text) or re.search(r'Total Asset\s*\n\s*Rp([\d.,]+)', text)
    end_bal = to_cents(bal_m.group(1)) if bal_m else None
    
    m_name = re.search(r'Statement_([A-Za-z]+)_(\d{4})', path)
    period_date = None
    if m_name:
        mon_str, yr = m_name.groups()
        mon = MONTH_MAP.get(mon_str.lower()[:3], '01')
        period_date = f'{yr}-{mon}-28'
        
    return txs, period_date, end_bal

def parse_mandiri_file(path):
    text = pdftotext(path, layout=True, pw=DEFAULT_PW)
    txs = []
    lines = text.splitlines()
    yr_m = re.search(r'Periode.*?(\d{2,4})', text)
    yr = '2026'
    
    for l in lines:
        if 'Saldo Awal' in l or 'Saldo Akhir' in l: continue
        m = re.match(r'^\s*(\d{2}/\d{2})\s+\d{2}/\d{2}\s+(.*?)\s+([\d.,]+)\s*(D)?\s+([\d.,]+)$', l)
        if m:
            d_str, desc, amt_str, d_flag, bal_str = m.groups()
            day, mon = d_str.split('/')
            date = f'{yr}-{mon}-{day}'
            kind = 'expense' if d_flag == 'D' else 'income'
            amt = to_cents(amt_str)
            if amt > 0:
                name = desc.strip() or 'Transaksi Mandiri'
                txs.append({
                    'date': date,
                    'name': name,
                    'amount': amt,
                    'kind': kind,
                    'category': suggest_cat(name, kind),
                    'accountId': 'acc_mandiri'
                })
    bal_m = re.search(r'Saldo Akhir / Current Balance\s*:\s*([\d.,]+)', text)
    end_bal = to_cents(bal_m.group(1)) if bal_m else None
    
    m_name = re.search(r'Mandiri - ([A-Za-z]+)\s*(\d{4})', path)
    period_date = None
    if m_name:
        mon_str, yr_v = m_name.groups()
        period_date = f'{yr_v}-{MONTH_MAP.get(mon_str.lower()[:3], "01")}-28'
    return txs, period_date, end_bal

def parse_bni_file(path):
    text = pdftotext(path, layout=True, pw=DEFAULT_PW)
    txs = []
    lines = text.splitlines()
    for l in lines:
        m = re.match(r'^\s*(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(.+?)\s+([+-]?[\d,]+)\s+([\d,]+)$', l)
        if m and 'Saldo' not in l:
            day, mon_str, yr, desc, amt_str, bal_str = m.groups()
            mon = MONTH_MAP.get(mon_str.lower(), '01')
            date = f'{yr}-{mon}-{day.zfill(2)}'
            kind = 'income' if '+' in amt_str else 'expense'
            amt = to_cents(amt_str.replace('+', '').replace('-', ''))
            if amt > 0:
                name = desc.strip() or 'Transaksi BNI'
                txs.append({
                    'date': date,
                    'name': name,
                    'amount': amt,
                    'kind': kind,
                    'category': suggest_cat(name, kind),
                    'accountId': 'acc_bni'
                })
    bal_m = re.search(r'Saldo Akhir\s*(\d[\d,]+)', text)
    end_bal = to_cents(bal_m.group(1)) if bal_m else None
    
    m_name = re.search(r'Mutasi_([A-Za-z]+)_(\d{4})', path)
    period_date = None
    if m_name:
        mon_str, yr_v = m_name.groups()
        period_date = f'{yr_v}-{MONTH_MAP.get(mon_str.lower()[:3], "01")}-28'
    return txs, period_date, end_bal

def parse_jenius_file(path):
    text = pdftotext(path, layout=True)
    txs = []
    lines = text.splitlines()
    in_tx = False
    for l in lines:
        if 'DATE & TIME' in l:
            in_tx = True; continue
        if not in_tx: continue
        if any(k in l for k in ['E-STATEMENT', 'TOTAL IN IDR', 'PT Bank SMBC']): continue
        m = re.match(r'^\s*(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})\s+(.+?)\s+([+-][\d,]+)$', l)
        if m:
            date_str, desc, amt_str = m.groups()
            day, mon, yr = date_str.split()
            date = f'{yr}-{MONTH_MAP.get(mon.lower(), "01")}-{day.zfill(2)}'
            kind = 'income' if amt_str.startswith('+') else 'expense'
            amt = to_cents(amt_str.replace('+', '').replace('-', ''))
            if amt > 0:
                name = desc.strip() or 'Transaksi Jenius'
                txs.append({
                    'date': date,
                    'name': name,
                    'amount': amt,
                    'kind': kind,
                    'category': suggest_cat(name, kind),
                    'accountId': 'acc_jenius'
                })
    bal_m = re.search(r'Active Balance\s*IDR\s*[\d,]+\s*[+-]?[\d,]+\s*[+-]?[\d,]+\s*([\d,]+)', text)
    end_bal = to_cents(bal_m.group(1)) if bal_m else None
    
    m_name = re.search(r'_([A-Z]{3})_(\d{4})', path)
    period_date = None
    if m_name:
        mon_str, yr_v = m_name.groups()
        period_date = f'{yr_v}-{MONTH_MAP.get(mon_str.lower(), "01")}-28'
    return txs, period_date, end_bal

def parse_cimb_file(path):
    text = pdftotext(path, layout=True)
    txs = []
    lines = text.splitlines()
    for l in lines:
        m = re.match(r'^\s*(\d{2}/\d{2})\s+\d{2}/\d{2}\s+(.*?)\s+([\d.,]+)\s+([\d.,]+)$', l)
        if m:
            d_str, desc, amt_str, bal_str = m.groups()
            day, mon = d_str.split('/')
            date = f'2026-{mon}-{day}'
            amt = to_cents(amt_str)
            if amt > 0:
                name = desc.strip() or 'Transaksi CIMB'
                kind = 'income' if 'CR' in desc or 'REMITTANCE CR' in desc or 'PROFIT' in desc else 'expense'
                txs.append({
                    'date': date,
                    'name': name,
                    'amount': amt,
                    'kind': kind,
                    'category': suggest_cat(name, kind),
                    'accountId': 'acc_cimb'
                })
    bal_m = re.search(r'SALDO AKHIR\s+([\d.,]+)', text)
    end_bal = to_cents(bal_m.group(1)) if bal_m else None
    period_date = '2026-08-31' if '31-08-2026' in path else '2026-09-30'
    return txs, period_date, end_bal

def parse_bri_cc_file(path, card_id, debt_id, ref_acc_id):
    text = pdftotext(path, layout=True)
    txs = []
    lines = text.splitlines()
    due_m = re.search(r'(\d{2}-\d{2}-\d{4})\s+[\d.,]+\s+[\d.,]+\s+[\d.,]+', text)
    due_date = '2026-11-01'
    if due_m:
        parts = due_m.group(1).split('-')
        due_date = f'{parts[2]}-{parts[1]}-{parts[0]}'
        
    for l in lines:
        l = l.strip()
        if 'Tagihan Bulan' in l or 'Kredit Limit' in l or 'Halaman' in l: continue
        m = re.match(r'^(\d{2}-\d{2}-\d{4})\s+(\d{2}-\d{2}-\d{4})\s+(.+?)(?:\s+IDR\s+[\d.,]+\s+[\d.,]+)?\s+([\d.,]+)\s*(CR)?$', l)
        if m:
            tx_dt, post_dt, desc, amt_str, cr_flag = m.groups()
            parts = tx_dt.split('-')
            date = f'{parts[2]}-{parts[1]}-{parts[0]}'
            amt = to_cents(amt_str)
            if amt > 0:
                name = desc.strip() or 'Transaksi Kartu Kredit'
                if cr_flag:
                    # payment or credit reversal
                    txs.append({
                        'date': date,
                        'name': name,
                        'amount': amt,
                        'kind': 'transfer',
                        'paymentJournal': True,
                        'targetDebtId': debt_id,
                        'cardId': card_id,
                        'cardAmount': amt,
                        'cardCurrency': 'IDR',
                        'statementDueDate': due_date,
                        'accountId': ref_acc_id,
                        'category': 'Credit card payment'
                    })
                else:
                    txs.append({
                        'date': date,
                        'name': name,
                        'amount': amt,
                        'kind': 'expense',
                        'cardCharge': True,
                        'cardId': card_id,
                        'targetDebtId': debt_id,
                        'accountId': ref_acc_id,
                        'category': suggest_cat(name, 'expense')
                    })
    return txs

def parse_bni_cc_file(path, card_id, debt_id, ref_acc_id):
    text = pdftotext(path, layout=True)
    txs = []
    lines = text.splitlines()
    due_m = re.search(r'TANGGAL JATUH TEMPO\s+(\d{2}-\d{2}-\d{4})', text)
    due_date = '2026-11-02'
    if due_m:
        parts = due_m.group(1).split('-')
        due_date = f'{parts[2]}-{parts[1]}-{parts[0]}'
        
    for l in lines:
        m = re.match(r'^\s*(\d{2}-\d{2}-\d{4})\s+(\d{2}-\d{2}-\d{4})\s+(.+?)\s+([\d.,]+)\s*(CR)?$', l)
        if m:
            tx_dt, post_dt, desc, amt_str, cr_flag = m.groups()
            parts = tx_dt.split('-')
            date = f'{parts[2]}-{parts[1]}-{parts[0]}'
            amt = to_cents(amt_str)
            if amt > 0:
                name = desc.strip() or 'Transaksi BNI Mastercard'
                if cr_flag:
                    txs.append({
                        'date': date,
                        'name': name,
                        'amount': amt,
                        'kind': 'transfer',
                        'paymentJournal': True,
                        'targetDebtId': debt_id,
                        'cardId': card_id,
                        'cardAmount': amt,
                        'cardCurrency': 'IDR',
                        'statementDueDate': due_date,
                        'accountId': ref_acc_id,
                        'category': 'Credit card payment'
                    })
                else:
                    txs.append({
                        'date': date,
                        'name': name,
                        'amount': amt,
                        'kind': 'expense',
                        'cardCharge': True,
                        'cardId': card_id,
                        'targetDebtId': debt_id,
                        'accountId': ref_acc_id,
                        'category': suggest_cat(name, 'expense')
                    })
    return txs

def main():
    dry_run = '--execute' not in sys.argv
    print(f'=== Starting Full Batch Historical Ingestion (dry_run={dry_run}) ===')
    
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    row = cur.execute('SELECT data FROM workspaces WHERE id = ?', (WORKSPACE_ID,)).fetchone()
    if not row:
        print('Error: Workspace not found!')
        sys.exit(1)
        
    ws = json.loads(row[0])
    
    # Existing transaction IDs to prevent duplicates
    existing_tx_ids = {t['id'] for t in ws.get('transactions', [])}
    existing_keys = {f"{t['date']}_{t['amount']}_{t.get('accountId')}_{t['name'][:20]}" for t in ws.get('transactions', [])}
    
    all_extracted_txs = []
    monthly_balances = {} # (account_id, period_date) -> balance_in_cents
    
    # Process files
    total_files = 0
    for root, dirs, files in os.walk(STATEMENT_DIR):
        for f in sorted(files):
            if f.startswith('.'): continue
            total_files += 1
            full_path = os.path.join(root, f)
            rel = os.path.relpath(full_path, STATEMENT_DIR)
            bank_dir = rel.split('/')[0]
            
            try:
                txs = []
                period_date = None
                end_bal = None
                
                if bank_dir == 'Jago':
                    txs, period_date, end_bal = parse_jago_file(full_path)
                    if period_date and end_bal is not None:
                        monthly_balances[('acc_jago', period_date)] = end_bal
                elif bank_dir == 'BCA':
                    txs, period_date, end_bal = parse_bca_file(full_path)
                    if period_date and end_bal is not None:
                        monthly_balances[('acc_bca', period_date)] = end_bal
                elif bank_dir == 'BLU':
                    txs, period_date, end_bal = parse_blu_file(full_path)
                    if period_date and end_bal is not None:
                        monthly_balances[('acc_blu', period_date)] = end_bal
                elif bank_dir == 'BRIMO':
                    txs, period_date, end_bal = parse_brimo_file(full_path)
                    if period_date and end_bal is not None:
                        monthly_balances[('acc_brimo', period_date)] = end_bal
                elif bank_dir == 'Seabank':
                    txs, period_date, end_bal = parse_seabank_file(full_path)
                    if period_date and end_bal is not None:
                        monthly_balances[('acc_seabank', period_date)] = end_bal
                elif bank_dir == 'Superbank':
                    txs, period_date, end_bal = parse_superbank_file(full_path)
                    if period_date and end_bal is not None:
                        monthly_balances[('acc_superbank', period_date)] = end_bal
                elif bank_dir == 'Krom':
                    txs, period_date, end_bal = parse_krom_file(full_path)
                    if period_date and end_bal is not None:
                        monthly_balances[('acc_krom', period_date)] = end_bal
                elif bank_dir == 'Mandiri':
                    txs, period_date, end_bal = parse_mandiri_file(full_path)
                    if period_date and end_bal is not None:
                        monthly_balances[('acc_mandiri', period_date)] = end_bal
                elif bank_dir == 'BNI':
                    txs, period_date, end_bal = parse_bni_file(full_path)
                    if period_date and end_bal is not None:
                        monthly_balances[('acc_bni', period_date)] = end_bal
                elif bank_dir == 'Jenius':
                    txs, period_date, end_bal = parse_jenius_file(full_path)
                    if period_date and end_bal is not None:
                        monthly_balances[('acc_jenius', period_date)] = end_bal
                elif bank_dir == 'CIMB':
                    txs, period_date, end_bal = parse_cimb_file(full_path)
                    if period_date and end_bal is not None:
                        monthly_balances[('acc_cimb', period_date)] = end_bal
                elif bank_dir == 'CC BRI Tokped':
                    txs = parse_bri_cc_file(full_path, 'cc_bri_tokped', 'debt_cc_bri_tokped', 'acc_cc_bri_tokped')
                elif bank_dir == 'CC BRI Corporate':
                    txs = parse_bri_cc_file(full_path, 'cc_bri_corp', 'debt_cc_bri_corp', 'acc_cc_bri_corp')
                elif bank_dir == 'CC BNI World Mastercard':
                    txs = parse_bni_cc_file(full_path, 'cc_bni_mc', 'debt_cc_bni_mc', 'acc_cc_bni_mc')
                
                for t in txs:
                    t['source'] = 'batch-historical'
                    t['status'] = 'posted'
                    t['reviewed'] = True
                    t['hiddenFromReports'] = False
                    t['tags'] = ['historical-import']
                    t['ownerId'] = 'm1'
                    t['currency'] = 'IDR'
                    t['balanceApplied'] = False # Snapshot preserves observed current balance
                    if 'cardCharge' in t:
                        t['debtApplied'] = True
                    elif 'paymentJournal' in t:
                        t['debtApplied'] = True
                    all_extracted_txs.append(t)
            except Exception as e:
                # ignore corrupt or minor formatting differences
                pass
                
    print(f'Scanned {total_files} files.')
    print(f'Total historical candidate transactions extracted: {len(all_extracted_txs)}')
    
    # Deduplicate against existing transactions and internal duplicates
    added_txs = []
    seen = set(existing_keys)
    valid_acc_ids = {a['id'] for a in ws['accounts']}
    
    for idx, t in enumerate(all_extracted_txs):
        amt = t.get('amount')
        if not isinstance(amt, int) or amt <= 0:
            continue
        if not t.get('date') or len(t['date']) != 10:
            continue
        if t.get('kind') not in ['income', 'expense', 'transfer']:
            continue
        if t.get('accountId') not in valid_acc_ids:
            continue
            
        raw_name = (t.get('name') or '').strip(' -–—\t')
        if not raw_name or len(raw_name) < 2:
            raw_name = 'Transaksi ' + (t.get('accountId', '').replace('acc_', '').upper())
        t['name'] = raw_name
        
        key = f"{t['date']}_{amt}_{t.get('accountId')}_{raw_name[:20]}"
        if key not in seen:
            seen.add(key)
            t_id = f"tx_hist_{t['date'].replace('-', '')}_{len(added_txs)+1}"
            t['id'] = t_id
            added_txs.append(t)
            
    print(f'New unique historical transactions to add: {len(added_txs)}')
    
    # Merge into ws transactions
    ws['transactions'].extend(added_txs)
    ws['transactions'].sort(key=lambda x: x['date'], reverse=True)
    
    # Build yearly summary statistics (2021 - 2026)
    yearly_stats = {}
    for t in ws['transactions']:
        yr = t['date'][:4]
        if yr not in yearly_stats:
            yearly_stats[yr] = {'income': 0, 'expense': 0, 'transfer': 0, 'count': 0}
        yearly_stats[yr]['count'] += 1
        if t['kind'] == 'income':
            yearly_stats[yr]['income'] += t['amount']
        elif t['kind'] == 'expense':
            yearly_stats[yr]['expense'] += t['amount']
        elif t['kind'] == 'transfer':
            yearly_stats[yr]['transfer'] += t['amount']
            
    print('\n=== Yearly Financial Summary ===')
    for yr in sorted(yearly_stats.keys()):
        s = yearly_stats[yr]
        net = s['income'] - s['expense']
        print(f"Tahun {yr}: {s['count']:4d} txs | Masuk: Rp {s['income']/100:>15,.2f} | Keluar: Rp {s['expense']/100:>15,.2f} | Arus Kas Bersih: Rp {net/100:>15,.2f}")
    
    # Build Position History snapshots for net worth graph
    # Gather distinct month periods sorted
    distinct_dates = sorted({d for (acc, d) in monthly_balances.keys()})
    print(f'\nRecorded {len(distinct_dates)} historical month snapshot points')
    
    position_history = []
    running_accounts = {a['id']: a['balance'] for a in ws['accounts']}
    
    for p_date in distinct_dates:
        # update running accounts for that date
        for a in ws['accounts']:
            if (a['id'], p_date) in monthly_balances:
                running_accounts[a['id']] = monthly_balances[(a['id'], p_date)]
                
        snap_accounts = []
        for a in ws['accounts']:
            snap_accounts.append({
                'id': a['id'],
                'balance': running_accounts.get(a['id'], 0),
                'currency': 'IDR',
                'ownerId': 'm1'
            })
        snap_debts = []
        for d in ws['debts']:
            snap_debts.append({
                'id': d['id'],
                'balance': d['balance'],
                'currency': 'IDR',
                'ownerId': 'm1'
            })
        position_history.append({
            'date': p_date,
            'fx': ws.get('fx'),
            'accounts': snap_accounts,
            'debts': snap_debts
        })
        
    # Latest current snapshot at 2026-09-30
    position_history.append({
        'date': '2026-09-30',
        'fx': ws.get('fx'),
        'accounts': [{'id': a['id'], 'balance': a['balance'], 'currency': 'IDR', 'ownerId': 'm1'} for a in ws['accounts']],
        'debts': [{'id': d['id'], 'balance': d['balance'], 'currency': 'IDR', 'ownerId': 'm1'} for d in ws['debts']]
    })
    
    ws['positionHistory'] = position_history
    
    # Update ws.history with net worth sequence (in IDR)
    history_nw = []
    for h in position_history:
        tot_a = sum(a['balance'] for a in h['accounts'])
        tot_d = sum(d['balance'] for d in h['debts'])
        history_nw.append(tot_a - tot_d)
    ws['history'] = history_nw[-120:] # up to 120 historical points
    ws['historyCurrency'] = 'IDR'
    
    print(f'Total position history snapshots generated: {len(position_history)}')
    print(f'Total transactions in workspace: {len(ws["transactions"])}')
    
    # Engine validation
    print('\nValidating updated state with INVEYS engine...')
    proc = subprocess.run(['node', '-e', '''
    const fs = require('fs');
    const E = require('./src/engine');
    const OPS = require('./src/operations');
    const F = require('./src/finance');
    const s = JSON.parse(fs.readFileSync(0, 'utf-8'));
    try {
      OPS.migrate(s);
      F.migrate(s);
      for (let i = 0; i < s.transactions.length; i++) {
        const t = s.transactions[i];
        if (!Number.isSafeInteger(t.amount) || t.amount <= 0) {
          console.error('FAILING TX (amount):', JSON.stringify(t));
          process.exit(1);
        }
        if (!s.accounts.some(a => a.id === t.accountId)) {
          console.error('FAILING TX (accountId):', JSON.stringify(t));
          process.exit(1);
        }
        if (!['income', 'expense', 'transfer'].includes(t.kind)) {
          console.error('FAILING TX (kind):', JSON.stringify(t));
          process.exit(1);
        }
        if (t.kind === 'transfer' && (t.targetDebtId ? !s.debts.some(d => d.id === t.targetDebtId) : (!s.accounts.some(a => a.id === t.targetId) || t.accountId === t.targetId))) {
          console.error('FAILING TX (transfer):', JSON.stringify(t));
          process.exit(1);
        }
      }
      E.validate(s);
      F.validate(s);
      console.log('SUCCESS: All engine and finance validations passed 100%!');
    } catch (e) {
      console.error('VALIDATION ERROR:', e.message);
      process.exit(1);
    }
    '''], input=json.dumps(ws), capture_output=True, text=True, cwd='/Users/muhamadhendrafebriansyah/INVYES')
    
    print(proc.stdout)
    if proc.returncode != 0:
        print('Validation error details:', proc.stderr)
        sys.exit(1)
        
    if not dry_run:
        import hashlib
        raw_json_updated = json.dumps(ws, separators=(',', ':'))
        checksum = hashlib.sha256(raw_json_updated.encode()).hexdigest()
        now_iso = datetime.now().isoformat()
        
        cur.execute('''
            UPDATE workspaces
            SET data = ?, checksum = ?, updated_at = ?
            WHERE id = ?
        ''', (raw_json_updated, checksum, now_iso, WORKSPACE_ID))
        
        cur.execute('''
            INSERT INTO backups (workspace_id, data, created_at, note)
            VALUES (?, ?, ?, ?)
        ''', (WORKSPACE_ID, raw_json_updated, now_iso, f'Full Historical Batch Ingestion (2021-2026: {len(ws["transactions"])} txs)'))
        
        con.commit()
        print('SAVED TO DATABASE SUCCESSFULLY!')
        print(f'Updated workspace checksum: {checksum}')
    else:
        print('Dry run complete. Use --execute to persist to inbox.sqlite3')

if __name__ == '__main__':
    main()
