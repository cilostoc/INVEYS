"""
INVEYS Crypto Exchange Connector Engine
Connects to cryptocurrency exchanges (Bybit, Binance, OKX, Gate.io, Bitget, Indodax, Tokocrypto, KuCoin, etc.)
via CCXT with read-only balance synchronization and automatic holding integration.
"""

import os
import json
import logging
import urllib.request
import urllib.parse

logger = logging.getLogger('inveys.crypto')

SUPPORTED_EXCHANGES = [
    {
        'id': 'bybit',
        'name': 'Bybit',
        'badge': 'Top Derivative & Spot',
        'icon': '🟡',
        'requiresPassphrase': False,
        'helpUrl': 'https://www.bybit.com/app/user/api-management'
    },
    {
        'id': 'binance',
        'name': 'Binance',
        'badge': 'Global Liquidity',
        'icon': '🔶',
        'requiresPassphrase': False,
        'helpUrl': 'https://www.binance.com/en/my/settings/api-management'
    },
    {
        'id': 'okx',
        'name': 'OKX',
        'badge': 'Unified & Web3',
        'icon': '⬛',
        'requiresPassphrase': True,
        'helpUrl': 'https://www.okx.com/account/my-api'
    },
    {
        'id': 'gate',
        'name': 'Gate.io',
        'badge': 'Altcoin Pioneer',
        'icon': '🔵',
        'requiresPassphrase': False,
        'helpUrl': 'https://www.gate.io/myaccount/api-key'
    },
    {
        'id': 'bitget',
        'name': 'Bitget',
        'badge': 'Copy & Spot Trading',
        'icon': '🔷',
        'requiresPassphrase': True,
        'helpUrl': 'https://www.bitget.com/account/newapi'
    },
    {
        'id': 'indodax',
        'name': 'Indodax',
        'badge': 'IDR Gateway Indonesia',
        'icon': '🇮🇩',
        'requiresPassphrase': False,
        'helpUrl': 'https://help.indodax.com/hc/id/articles/4416645367065'
    },
    {
        'id': 'tokocrypto',
        'name': 'Tokocrypto',
        'badge': 'Binance Cloud Indonesia',
        'icon': '🇮🇩',
        'requiresPassphrase': False,
        'helpUrl': 'https://www.tokocrypto.com/'
    },
    {
        'id': 'kucoin',
        'name': 'KuCoin',
        'badge': 'Global Exchange',
        'icon': '🟢',
        'requiresPassphrase': True,
        'helpUrl': 'https://www.kucoin.com/account/api'
    }
]

COIN_NAMES = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'SOL': 'Solana',
    'BNB': 'BNB Chain',
    'XRP': 'Ripple',
    'DOGE': 'Dogecoin',
    'ADA': 'Cardano',
    'AVAX': 'Avalanche',
    'DOT': 'Polkadot',
    'LINK': 'Chainlink',
    'SUI': 'Sui Network',
    'NEAR': 'NEAR Protocol',
    'APT': 'Aptos',
    'PEPE': 'Pepe Coin',
    'SHIB': 'Shiba Inu',
    'TRX': 'TRON',
    'TON': 'Toncoin',
    'USDT': 'Tether USD',
    'USDC': 'USD Coin',
    'DAI': 'Dai Stablecoin',
    'FDUSD': 'First Digital USD',
    'BGB': 'Bitget Token',
    'GT': 'GateToken',
    'OKB': 'OKX Token',
    'IDR': 'Indonesian Rupiah'
}

FALLBACK_PRICES_USD = {
    'BTC': 68500.0,
    'ETH': 2650.0,
    'SOL': 155.0,
    'BNB': 590.0,
    'XRP': 0.54,
    'DOGE': 0.12,
    'ADA': 0.35,
    'AVAX': 28.5,
    'DOT': 4.20,
    'LINK': 11.20,
    'SUI': 2.10,
    'NEAR': 4.80,
    'APT': 9.20,
    'USDT': 1.0,
    'USDC': 1.0,
    'DAI': 1.0,
    'FDUSD': 1.0,
    'BGB': 1.15,
    'GT': 9.50,
    'OKB': 42.0
}


def has_ccxt():
    try:
        import ccxt
        return True
    except ImportError:
        return False


def get_supported_exchanges():
    return {
        'ok': True,
        'ccxtAvailable': has_ccxt(),
        'exchanges': SUPPORTED_EXCHANGES
    }


def _is_safe_proxy(proxy_str):
    if not proxy_str or not isinstance(proxy_str, str):
        return False
    clean = proxy_str.strip()
    try:
        parsed = urllib.parse.urlsplit(clean)
        if parsed.scheme not in ('http', 'https', 'socks5', 'socks5h'):
            return False
        hostname = (parsed.hostname or '').lower()
        if not hostname:
            return False
        # Block cloud metadata endpoints and dangerous link-local addresses
        blocked = ('169.254.169.254', 'metadata.google.internal', 'instance-data', '100.100.100.200')
        if hostname in blocked or hostname.endswith('.internal'):
            return False
        return True
    except Exception:
        return False


def _create_exchange_instance(exchange_id, api_key, api_secret, passphrase=None, proxy=None):
    if not has_ccxt():
        raise RuntimeError("Library CCXT belum terpasang. Jalankan: pip install ccxt")

    import ccxt

    ex_id = exchange_id.lower().strip()
    if ex_id == 'gateio':
        ex_id = 'gate'
    if ex_id not in ccxt.exchanges:
        raise ValueError(f"Exchange '{exchange_id}' tidak didukung oleh CCXT")

    config = {
        'apiKey': api_key.strip(),
        'secret': api_secret.strip(),
        'timeout': 9000,
        'enableRateLimit': True,
        'options': {'defaultType': 'spot'}
    }

    if passphrase and passphrase.strip():
        config['password'] = passphrase.strip()

    if proxy and proxy.strip():
        clean_proxy = proxy.strip()
        if not _is_safe_proxy(clean_proxy):
            raise ValueError("Format proxy tidak valid atau diarahkan ke alamat terlarang (SSRF guard). Gunakan format http://host:port atau socks5://host:port")
        config['proxies'] = {
            'http': clean_proxy,
            'https': clean_proxy
        }
    elif os.environ.get('HTTPS_PROXY') or os.environ.get('HTTP_PROXY'):
        config['proxies'] = {
            'http': os.environ.get('HTTP_PROXY', os.environ.get('HTTPS_PROXY')),
            'https': os.environ.get('HTTPS_PROXY', os.environ.get('HTTP_PROXY'))
        }

    exchange_class = getattr(ccxt, ex_id)
    return exchange_class(config)


def test_connection(exchange_id, api_key, api_secret, passphrase=None, proxy=None):
    clean_key = (api_key or '').strip()
    if clean_key.lower() == 'demo':
        meta = next((e for e in SUPPORTED_EXCHANGES if e['id'] == exchange_id.lower()), {'name': exchange_id.title()})
        return {
            'ok': True,
            'demo': True,
            'exchange': exchange_id,
            'message': f"Koneksi simulasi demo {meta['name']} berhasil. Siap untuk sinkronisasi saldo."
        }

    if not clean_key or not (api_secret or '').strip():
        return {'ok': False, 'error': 'API Key dan Secret wajib diisi.'}

    try:
        ex = _create_exchange_instance(exchange_id, api_key, api_secret, passphrase, proxy)
        # Test fetch balance with small timeout
        balance = ex.fetch_balance()
        assets_found = len([k for k, v in balance.get('total', {}).items() if (v or 0) > 0])
        return {
            'ok': True,
            'demo': False,
            'exchange': exchange_id,
            'assetsCount': assets_found,
            'message': f"Koneksi terverifikasi! Berhasil membaca saldo {assets_found} koin (Read-Only valid)."
        }
    except Exception as e:
        msg = str(e)
        err_type = type(e).__name__
        if 'Authentication' in err_type or 'Auth' in msg:
            detail = "Autentikasi gagal: Kunci API atau Secret salah, atau IP Anda belum diizinkan (whitelisted) di exchange."
        elif 'Permission' in err_type or 'permission' in msg.lower():
            detail = "Izin ditolak: Pastikan kunci API memiliki izin 'Read' / 'View' untuk saldo Spot / Funding."
        elif 'Timeout' in err_type or 'timed out' in msg.lower():
            detail = "Koneksi time out. Domain API exchange mungkin diblokir oleh ISP lokal Anda. Gunakan proxy atau jalankan di VPS."
        elif 'Network' in err_type:
            detail = f"Kesalahan jaringan ({msg[:120]}). Periksa koneksi internet atau gunakan proxy."
        else:
            detail = f"Gagal menghubungkan ({err_type}): {msg[:140]}"
        return {'ok': False, 'error': detail}


def _get_demo_holdings(exchange_id, fx_rate):
    ex_id = exchange_id.lower()
    presets = {
        'bybit': [
            {'symbol': 'BTC', 'quantity': 0.35},
            {'symbol': 'ETH', 'quantity': 2.80},
            {'symbol': 'SOL', 'quantity': 28.5},
            {'symbol': 'SUI', 'quantity': 450.0},
            {'symbol': 'USDT', 'quantity': 2500.0}
        ],
        'binance': [
            {'symbol': 'BTC', 'quantity': 0.50},
            {'symbol': 'ETH', 'quantity': 4.20},
            {'symbol': 'BNB', 'quantity': 15.0},
            {'symbol': 'SOL', 'quantity': 35.0},
            {'symbol': 'USDT', 'quantity': 4800.0}
        ],
        'okx': [
            {'symbol': 'BTC', 'quantity': 0.25},
            {'symbol': 'ETH', 'quantity': 2.10},
            {'symbol': 'OKB', 'quantity': 65.0},
            {'symbol': 'AVAX', 'quantity': 40.0},
            {'symbol': 'USDT', 'quantity': 1800.0}
        ],
        'gate': [
            {'symbol': 'BTC', 'quantity': 0.20},
            {'symbol': 'ETH', 'quantity': 1.60},
            {'symbol': 'GT', 'quantity': 120.0},
            {'symbol': 'DOGE', 'quantity': 3500.0},
            {'symbol': 'USDT', 'quantity': 1200.0}
        ],
        'bitget': [
            {'symbol': 'BTC', 'quantity': 0.30},
            {'symbol': 'ETH', 'quantity': 2.20},
            {'symbol': 'BGB', 'quantity': 950.0},
            {'symbol': 'NEAR', 'quantity': 150.0},
            {'symbol': 'USDT', 'quantity': 1600.0}
        ],
        'indodax': [
            {'symbol': 'BTC', 'quantity': 0.15},
            {'symbol': 'ETH', 'quantity': 1.20},
            {'symbol': 'SOL', 'quantity': 12.0},
            {'symbol': 'USDT', 'quantity': 650.0}
        ]
    }
    coin_list = presets.get(ex_id, presets['bybit'])
    results = []
    total_usd = 0.0

    for item in coin_list:
        sym = item['symbol']
        qty = item['quantity']
        price_usd = FALLBACK_PRICES_USD.get(sym, 1.0)
        val_usd = round(qty * price_usd, 2)
        price_idr = round(price_usd * fx_rate)
        val_idr = round(val_usd * fx_rate)
        total_usd += val_usd

        results.append({
            'symbol': sym,
            'name': COIN_NAMES.get(sym, sym),
            'quantity': qty,
            'priceUsd': price_usd,
            'valueUsd': val_usd,
            'priceIdr': price_idr,
            'valueIdr': val_idr,
            'assetClass': 'Crypto'
        })

    meta = next((e for e in SUPPORTED_EXCHANGES if e['id'] == ex_id), {'name': exchange_id.title()})
    return {
        'ok': True,
        'demo': True,
        'exchange': ex_id,
        'exchangeName': meta['name'],
        'count': len(results),
        'totalUsd': round(total_usd, 2),
        'totalIdr': round(total_usd * fx_rate),
        'holdings': results
    }


def fetch_crypto_balances(exchange_id, api_key, api_secret, passphrase=None, proxy=None, min_usd=1.0, fx_rate=16000.0):
    try:
        fx_rate = max(1.0, float(fx_rate))
    except (ValueError, TypeError):
        fx_rate = 16000.0

    try:
        min_usd = max(0.0, float(min_usd))
    except (ValueError, TypeError):
        min_usd = 1.0

    clean_key = (api_key or '').strip()
    if clean_key.lower() == 'demo':
        return _get_demo_holdings(exchange_id, fx_rate)

    if not clean_key or not (api_secret or '').strip():
        return {'ok': False, 'error': 'API Key dan Secret wajib diisi.'}

    try:
        ex = _create_exchange_instance(exchange_id, api_key, api_secret, passphrase, proxy)
        raw_balance = ex.fetch_balance()
        totals = raw_balance.get('total', {})

        # Extract non-zero coins
        candidates = []
        for symbol, qty in totals.items():
            if qty is not None and qty > 0.00000001:
                # Remove prefixed / suffixed notations if any (e.g. 'LD_BTC' or ':USDT')
                clean_sym = symbol.split(':')[0].upper().strip()
                if clean_sym.startswith('LD') and len(clean_sym) > 3:  # Binance Earn prefix
                    clean_sym = clean_sym[2:]
                candidates.append((clean_sym, float(qty)))

        if not candidates:
            return {
                'ok': True,
                'demo': False,
                'exchange': exchange_id,
                'exchangeName': exchange_id.title(),
                'count': 0,
                'totalUsd': 0.0,
                'totalIdr': 0.0,
                'holdings': [],
                'message': 'Tidak ada saldo aset yang ditemukan pada akun exchange ini.'
            }

        # Price each asset
        results = []
        total_usd = 0.0

        for sym, qty in candidates:
            price_usd = 0.0
            if sym in ('USDT', 'USDC', 'DAI', 'FDUSD', 'PYUSD'):
                price_usd = 1.0
            elif sym == 'IDR':
                price_usd = 1.0 / fx_rate
            else:
                # Try fetching ticker from exchange
                try:
                    ticker = ex.fetch_ticker(f"{sym}/USDT")
                    price_usd = float(ticker.get('last') or ticker.get('close') or 0.0)
                except Exception:
                    # Fallback to predefined table
                    price_usd = FALLBACK_PRICES_USD.get(sym, 0.0)

            val_usd = round(qty * price_usd, 2)
            if val_usd < min_usd:
                continue

            price_idr = round(price_usd * fx_rate)
            val_idr = round(val_usd * fx_rate)
            total_usd += val_usd

            results.append({
                'symbol': sym,
                'name': COIN_NAMES.get(sym, sym),
                'quantity': qty,
                'priceUsd': price_usd,
                'valueUsd': val_usd,
                'priceIdr': price_idr,
                'valueIdr': val_idr,
                'assetClass': 'Crypto'
            })

        results.sort(key=lambda x: x['valueUsd'], reverse=True)
        meta = next((e for e in SUPPORTED_EXCHANGES if e['id'] == exchange_id.lower()), {'name': exchange_id.title()})

        return {
            'ok': True,
            'demo': False,
            'exchange': exchange_id,
            'exchangeName': meta['name'],
            'count': len(results),
            'totalUsd': round(total_usd, 2),
            'totalIdr': round(total_usd * fx_rate),
            'holdings': results
        }
    except Exception as e:
        msg = str(e)
        err_type = type(e).__name__
        return {'ok': False, 'error': f"Gagal menarik saldo ({err_type}): {msg[:160]}"}
