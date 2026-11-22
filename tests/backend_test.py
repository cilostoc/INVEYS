import unittest, importlib.util, tempfile, os, json, threading, urllib.request, urllib.error, base64, shutil
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('server',Path(__file__).resolve().parents[1]/'server'/'serve.py');s=importlib.util.module_from_spec(spec);spec.loader.exec_module(s)
class Backend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp_dir = tempfile.TemporaryDirectory()
        cls.orig_db = s.DB
        s.DB = Path(cls.temp_dir.name) / 'test_inbox.sqlite3'
        cls.server = s.ThreadingHTTPServer(('127.0.0.1', 0), s.Handler)
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()
        cls.url = 'http://127.0.0.1:' + str(cls.server.server_port)

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        s.DB = cls.orig_db
        cls.temp_dir.cleanup()
    def request(self,path,body=None,headers=None):
        h={'Host':'127.0.0.1:3000',**(headers or {})}
        req=urllib.request.Request(self.url+path,data=json.dumps(body).encode() if body is not None else None,headers=h)
        try:
            with urllib.request.urlopen(req) as r:return r.status,json.loads(r.read())
        except urllib.error.HTTPError as e:return e.code,json.loads(e.read())
    def request_full(self,path,body=None,headers=None):
        h={'Host':'127.0.0.1:3000',**(headers or {})}
        req=urllib.request.Request(self.url+path,data=json.dumps(body).encode() if body is not None else None,headers=h)
        try:
            with urllib.request.urlopen(req) as r:return r.status,r.headers,json.loads(r.read())
        except urllib.error.HTTPError as e:return e.code,e.headers,json.loads(e.read())
    def session_headers(self,resp_headers,body):
        set_cookie=resp_headers.get('Set-Cookie','')
        cookie_pair=set_cookie.split(';',1)[0].strip() if set_cookie else ''
        h={'Origin':'http://127.0.0.1:3000'}
        if cookie_pair:h['Cookie']=cookie_pair
        if isinstance(body,dict) and body.get('csrf'):h['X-INVEYS-CSRF']=body['csrf']
        return h
    def raw_request(self,path,headers=None):
        h={'Host':'127.0.0.1:3000',**(headers or {})}
        req=urllib.request.Request(self.url+path,headers=h)
        try:
            with urllib.request.urlopen(req) as r:return r.status,r.headers,r.read()
        except urllib.error.HTTPError as e:return e.code,e.headers,e.read()
    def test_index_scripts_are_served(self):
        import re
        index=(Path(__file__).resolve().parents[1]/'src'/'index.html').read_text()
        for file in re.findall(r'<script src="([^"]+)"',index):
            request=urllib.request.Request(self.url+'/'+file,headers={'Host':'127.0.0.1:3000'})
            with urllib.request.urlopen(request) as response:
                self.assertEqual(response.status,200)
                self.assertTrue(response.read())
    def test_secret_files_not_served(self):
        for file in ['/serve.py','/.env','/../serve.py','/tests/backend_test.py']:
            self.assertEqual(self.request(file)[0],404)
    def test_host_and_origin_rejected(self):
        self.assertEqual(self.request('/api/status',headers={'Host':'evil.example'})[0],403)
        self.assertEqual(self.request('/api/status',headers={'Origin':'https://evil.example'})[0],403)
        self.assertEqual(self.request('/api/telegram/send',{'text':'hello','consent':True})[0],403)
    def test_inveys_domain_and_ip_allowed(self):
        for h in ['inveys.io', 'www.inveys.io', '187.77.134.249', '187.77.134.249:3000']:
            status, _ = self.request('/api/auth/status', headers={'Host': h})
            self.assertEqual(status, 200)
            status, _ = self.request('/api/auth/status', headers={'Host': h, 'Origin': f'https://{h}'})
            self.assertEqual(status, 200)
    def test_status_no_credentials(self):
        with patch.dict(os.environ,{'MODEL_API_KEY':'secret-key','TELEGRAM_BOT_TOKEN':'secret-token','TELEGRAM_CHAT_ID':'123','NINEROUTER_API_KEY':'sk-test-key'}):
            status,result=self.request('/api/status');self.assertEqual(status,200);self.assertTrue(result['muse']);self.assertTrue(result['ai']['9router']['enabled']);self.assertNotIn('secret',json.dumps(result));self.assertNotIn('sk-test-key',json.dumps(result))
    def test_muse_requires_consent(self):
        headers={'Origin':'http://127.0.0.1:3000','X-INVEYS-CSRF':s.TOKEN}
        with patch.object(s,'muse') as mock:
            self.assertEqual(self.request('/api/muse',{'prompt':'test'},headers)[0],400);mock.assert_not_called()
    def test_provider_errors_do_not_expose_tokens(self):
        with patch.object(s,'provider',side_effect=ValueError('secret-key')):
            status,result=self.request('/api/fx');self.assertEqual(status,502);self.assertNotIn('secret',json.dumps(result))
            # Real provider wrapper always emits generic errors, route must do the same.
    def test_telegram_dedup_allowlist_and_durable_offset(self):
        with tempfile.TemporaryDirectory() as d,patch.object(s,'DB',Path(d)/'inbox.sqlite3'),patch.dict(os.environ,{'TELEGRAM_CHAT_ID':'123'}):
            updates=[{'update_id':1,'message':{'chat':{'id':999,'type':'private'},'text':'wrong'}},{'update_id':2,'message':{'chat':{'id':123,'type':'private'},'text':'kopi 25 ribu'}}]
            with patch.object(s,'telegram',return_value=updates):
                self.assertEqual(len(s.poll()),1);self.assertEqual(len(s.poll()),1)
            with s.db() as c:self.assertEqual(c.execute("SELECT value FROM metadata WHERE key='offset'").fetchone()[0],3)
            with s.db() as c:c.execute('UPDATE inbox SET reviewed=1 WHERE id=2')
            with patch.object(s,'telegram',return_value=updates):self.assertEqual(s.poll(),[])
    def test_real_local_ocr(self):
        if not shutil.which('tesseract'):self.skipTest('Tesseract not installed')
        from PIL import Image,ImageDraw,ImageFont
        import io
        im=Image.new('RGB',(1000,300),'white');draw=ImageDraw.Draw(im)
        try:
            font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',48)
        except Exception:
            font=ImageFont.load_default()
        draw.text((40,40),'COFFEE SHOP\nTOTAL 25000',fill='black',font=font);buf=io.BytesIO();im.save(buf,format='PNG');text=s.extract({'data':base64.b64encode(buf.getvalue()).decode()});self.assertIn('TOTAL',text);self.assertIn('25000',text)
    def test_invalid_file_rejected(self):
        self.assertRaises(ValueError,s.decode,{'data':'not-base64!'});self.assertRaises(ValueError,s.extract,{'data':base64.b64encode(b'bad-image').decode()})
    def test_chat_route_consent_csrf_and_success(self):
        headers={'Origin':'http://127.0.0.1:3000','X-INVEYS-CSRF':s.TOKEN}
        payload={'provider':'openai','prompt':'Explain this','consent':True}
        with patch.object(s.inveys_ai,'chat',return_value={'text':'Answer','provider':'openai','model':'test'}) as chat:
            self.assertEqual(self.request('/api/chat',payload)[0],403);chat.assert_not_called()
            status,result=self.request('/api/chat',payload,headers)
            self.assertEqual(status,200);self.assertEqual(result['text'],'Answer')
            self.assertEqual(chat.call_args.args[0],payload)
        with patch.dict(os.environ,{'OPENAI_API_KEY':'secret-test'}),patch.object(s.inveys_ai,'transport') as transport:
            status,result=self.request('/api/chat',{'provider':'openai','prompt':'Explain'},headers)
            self.assertEqual(status,400);self.assertIn('consent',result['error']);transport.assert_not_called()
            self.assertNotIn('secret',json.dumps(result))
    def test_ai_extract_statement_csrf_and_flow(self):
        headers={'Origin':'http://127.0.0.1:3000','X-INVEYS-CSRF':s.TOKEN}
        payload={'consent':True,'text':'2026-10-15 Beli Kopi 25000'}
        # 1. CSRF required
        self.assertEqual(self.request('/api/ai-extract-statement',payload)[0],403)
        # 2. Consent required
        self.assertEqual(self.request('/api/ai-extract-statement',{'consent':False,'text':'abc'},headers)[0],400)
        # 3. Successful extraction with mock
        mock_res={
            'ok':True,'bank':'Bank BCA','period':'Oktober 2026','summary':'1 pengeluaran ditemukan',
            'drafts':[{'name':'Beli Kopi','date':'2026-10-15','kind':'expense','amount':'25000','currency':'IDR','category':'Makanan & Minuman'}],
            'provider':'gemini','model':'gemini-3.8-flash'
        }
        with patch.object(s.inveys_ai,'extract_statement',return_value=mock_res) as mock_fn:
            status,result=self.request('/api/ai-extract-statement',payload,headers)
            self.assertEqual(status,200)
            self.assertTrue(result['ok'])
            self.assertEqual(result['bank'],'Bank BCA')
            self.assertEqual(len(result['drafts']),1)
            self.assertEqual(result['drafts'][0]['amount'],'25000')
    def test_extract_csv_and_text_direct(self):
        csv_bytes=b'Date,Description,Amount\n2026-10-01,Salary,5000000\n2026-10-02,Coffee,25000'
        text=s.extract({'data':base64.b64encode(csv_bytes).decode(),'type':'text/csv','name':'mutasi.csv'})
        self.assertIn('Salary',text)
        self.assertIn('Coffee',text)
    def test_extract_pdf_direct(self):
        if not shutil.which('pdftotext') and not shutil.which('pdftoppm'):
            self.skipTest('Poppler (pdftotext/pdftoppm) not installed in test environment')
        stream = b'BT /F1 12 Tf 72 712 Td (INVEYS Bank Statement 500000) Tj ET'
        pdf = (
            b'%PDF-1.4\n1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj\n'
            b'2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj\n'
            b'3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources <</Font <</F1 4 0 R>>>> /Contents 5 0 R>> endobj\n'
            b'4 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj\n'
            b'5 0 obj <</Length ' + str(len(stream)).encode() + b'>> stream\n' + stream + b'\nendstream endobj\n'
            b'xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000226 00000 n \n0000000293 00000 n \n'
            b'trailer <</Size 6 /Root 1 0 R>>\nstartxref\n380\n%%EOF'
        )
        text=s.extract({'data':base64.b64encode(pdf).decode(),'type':'application/pdf','name':'BRImo_statement.pdf'})
        self.assertIn('INVEYS Bank Statement 500000',text)
    def test_ai_extract_statement_logic(self):
        with patch.dict(os.environ,{'GEMINI_API_KEY':'test-key'}):
            ai_reply=json.dumps({
                'bank':'Bank Mandiri',
                'period':'Oktober 2026',
                'summary':'2 transaksi',
                'drafts':[
                    {'name':'Gaji Kemenkeu','date':'2026-10-01','kind':'income','amount':'15000000','currency':'IDR','category':'Gaji & Pendapatan'},
                    {'name':'Starbucks Coffee','date':'2026-10-02','kind':'expense','amount':'65000.50','currency':'IDR','category':'Makanan & Minuman'}
                ]
            })
            with patch.object(s.inveys_ai,'transport',return_value={'candidates':[{'content':{'parts':[{'text':ai_reply}]}}]}) as mock_tp:
                res=s.inveys_ai.extract_statement({'consent':True,'provider':'gemini','text':'sample raw text','recordContext':{'currency':'IDR'}},s.extract)
                self.assertTrue(res['ok'])
                self.assertEqual(res['bank'],'Bank Mandiri')
                self.assertEqual(len(res['drafts']),2)
                self.assertEqual(res['drafts'][0]['kind'],'income')
                self.assertEqual(res['drafts'][1]['kind'],'expense')
    def test_release_manifest(self):
        rel_file = Path(__file__).resolve().parents[1]/'src'/'releases.json'
        if not rel_file.exists(): rel_file = Path(__file__).resolve().parents[1]/'releases.json'
        manifest=json.loads(rel_file.read_text())
        status,result=self.request('/api/updates');self.assertEqual(status,200);self.assertEqual(result['version'],manifest['version']);self.assertEqual(result['history'][0]['version'],result['version']);self.assertEqual(len(result['history']),len(manifest['history']))
    def test_muse_response_and_no_ledger_access(self):
        with patch.dict(os.environ,{'MODEL_API_KEY':'test'}),patch.object(s,'provider',return_value={'choices':[{'message':{'content':'Answer'}}]}) as mock:
            self.assertEqual(s.muse([{'role':'user','content':'test'}]),'Answer');self.assertEqual(mock.call_args[0][0],'https://api.meta.ai/v1/chat/completions')
    def test_crypto_endpoints(self):
        # 1. Get supported exchanges
        status, result = self.request('/api/crypto/exchanges')
        self.assertEqual(status, 200)
        self.assertTrue(result['ok'])
        self.assertTrue(result['ccxtAvailable'])
        ex_ids = [e['id'] for e in result['exchanges']]
        for target in ('bybit', 'binance', 'okx', 'gate', 'bitget', 'indodax'):
            self.assertIn(target, ex_ids)

        # 2. Test connection with demo mode
        headers = {'Origin': 'http://127.0.0.1:3000', 'X-INVEYS-CSRF': s.TOKEN}
        status, test_res = self.request('/api/crypto/test', {'exchange': 'bybit', 'apiKey': 'demo', 'apiSecret': 'demo'}, headers)
        self.assertEqual(status, 200)
        self.assertTrue(test_res['ok'])
        self.assertTrue(test_res['demo'])

        # 3. Test sync with demo mode
        status, sync_res = self.request('/api/crypto/sync', {'exchange': 'bybit', 'apiKey': 'demo', 'apiSecret': 'demo', 'minUsd': 1.0, 'fxRate': 16000.0}, headers)
        self.assertEqual(status, 200)
        self.assertTrue(sync_res['ok'])
        self.assertTrue(sync_res['count'] >= 4)
        self.assertTrue(sync_res['totalUsd'] > 0)
        symbols = [h['symbol'] for h in sync_res['holdings']]
        self.assertIn('BTC', symbols)
        self.assertIn('ETH', symbols)
        self.assertIn('USDT', symbols)

        # 4. Reject empty keys without demo
        status, err_res = self.request('/api/crypto/test', {'exchange': 'bybit', 'apiKey': '', 'apiSecret': ''}, headers)
        self.assertEqual(status, 400)
        self.assertFalse(err_res['ok'])

        # 5. Reject SSRF cloud metadata proxy
        status, ssrf_res = self.request('/api/crypto/test', {'exchange': 'bybit', 'apiKey': 'key', 'apiSecret': 'sec', 'proxy': 'http://169.254.169.254/'}, headers)
        self.assertEqual(status, 400)
        self.assertIn('SSRF guard', ssrf_res['error'])

        # 6. Reject invalid CCXT exchange attribute
        status, fake_ex = self.request('/api/crypto/test', {'exchange': 'Exchange', 'apiKey': 'key', 'apiSecret': 'sec'}, headers)
        self.assertEqual(status, 400)
        self.assertIn('tidak didukung', fake_ex['error'])

        # 7. Safe zero/negative fxRate handling
        status, zero_res = self.request('/api/crypto/sync', {'exchange': 'bybit', 'apiKey': 'demo', 'apiSecret': 'demo', 'minUsd': 0, 'fxRate': 0}, headers)
        self.assertEqual(status, 200)
        self.assertTrue(zero_res['ok'])

    def test_version_and_inveys_app_served(self):
        status, result = self.request('/api/status')
        self.assertEqual(status, 200)
        self.assertEqual(result['version'], '0.23.0')

        req = urllib.request.Request(self.url + '/inveys-app.html', headers={'Host': '127.0.0.1:3000'})
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            self.assertTrue(len(resp.read()) > 100000)

    def test_landing_and_app_routing(self):
        # 1. GET / must serve landing.html
        req = urllib.request.Request(self.url + '/', headers={'Host': '127.0.0.1:3000'})
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            body = resp.read().decode('utf-8', errors='ignore')
            self.assertIn('INVEYS — Financial OS', body)
            self.assertIn('/app', body)

        # 2. GET /landing must also serve landing.html
        req = urllib.request.Request(self.url + '/landing', headers={'Host': '127.0.0.1:3000'})
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            body = resp.read().decode('utf-8', errors='ignore')
            self.assertIn('INVEYS — Financial OS', body)

        # 3. GET /app must serve index.html (the financial app shell)
        for p in ('/app', '/app/', '/admin', '/admin/', '/vault', '/dashboard'):
            req = urllib.request.Request(self.url + p, headers={'Host': '127.0.0.1:3000'})
            with urllib.request.urlopen(req) as resp:
                self.assertEqual(resp.status, 200)
                body = resp.read().decode('utf-8', errors='ignore')
                self.assertIn('app-shell', body)
                self.assertIn('navigation', body)

    def test_vps_segments_and_1click_update(self):
        # 1. GET /api/vps/segments
        status, segs = self.request('/api/vps/segments')
        self.assertEqual(status, 200)
        self.assertTrue(segs['ok'])
        self.assertEqual(len(segs['segments']), 4)
        segment_ids = [seg['id'] for seg in segs['segments']]
        self.assertIn('client', segment_ids)
        self.assertIn('backend', segment_ids)
        self.assertIn('vault', segment_ids)
        self.assertIn('pipeline', segment_ids)

        # 2. Reject POST /api/vps/update without CSRF or session
        status, err = self.request('/api/vps/update', {})
        self.assertEqual(status, 403)

        # 3. Successful POST /api/vps/update as authenticated admin with per-session CSRF
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'vps_upd.sqlite3'):
            st_setup, h_setup, res_setup = self.request_full('/api/auth/setup', {'password': 'AdminPassword123'}, {'Origin': 'http://127.0.0.1:3000'})
            self.assertEqual(st_setup, 200)
            adm_headers = self.session_headers(h_setup, res_setup)
            status, res = self.request('/api/vps/update', {}, adm_headers)
            self.assertEqual(status, 200)
            self.assertTrue(res['ok'])
            self.assertEqual(res['version'], '0.23.0')
            self.assertEqual(len(res['updatedSegments']), 4)

    def test_api_keys_management_and_persistence(self):
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'keys_test.sqlite3'):
            # Unauthenticated GET /api/keys rejected with 401
            st_unauth, _ = self.request('/api/keys', headers={'Origin': 'http://127.0.0.1:3000'})
            self.assertEqual(st_unauth, 401)

            st_setup, h_setup, res_setup = self.request_full('/api/auth/setup', {'password': 'AdminPassword123'}, {'Origin': 'http://127.0.0.1:3000'})
            self.assertEqual(st_setup, 200)
            headers = self.session_headers(h_setup, res_setup)

            # 1. GET /api/keys returns valid structure for admin
            status, keys = self.request('/api/keys', headers=headers)
            self.assertEqual(status, 200)
            self.assertTrue(keys['ok'])
            self.assertIn('gemini', keys)
            self.assertIn('openai', keys)
            self.assertIn('ninerouter', keys)
            self.assertIn('telegram', keys)

            # 2. POST /api/keys save Gemini key
            status, res = self.request('/api/keys', {'provider': 'gemini', 'action': 'save', 'apiKey': 'AIzaSyTestGeminiKey123', 'model': 'gemini-3.8-flash'}, headers)
            self.assertEqual(status, 200)
            self.assertTrue(res['ok'])
            self.assertEqual(res['action'], 'saved')
            self.assertTrue(res['ai']['gemini']['enabled'])

            # 3. POST /api/keys save Telegram bot token and chat id
            status, res = self.request('/api/keys', {'provider': 'telegram', 'action': 'save', 'botToken': '123456789:ABCdefGHIjklMNOpqrSTUvwxYZ', 'chatId': '987654321'}, headers)
            self.assertEqual(status, 200)
            self.assertTrue(res['ok'])
            self.assertTrue(res['telegram'])

            # 4. GET /api/keys shows masked keys without revealing full key by default
            status, keys = self.request('/api/keys', headers=headers)
            self.assertEqual(status, 200)
            self.assertTrue(keys['gemini']['configured'])
            self.assertTrue(keys['telegram']['configured'])
            self.assertIn('••••••••', keys['gemini']['keyMasked'])
            self.assertIn('••••••••', keys['telegram']['tokenMasked'])
            self.assertEqual(keys['gemini']['rawKey'], '')

            # 5. GET /api/keys?reveal=1 reveals raw key for authenticated admin
            status, keys_revealed = self.request('/api/keys?reveal=1', headers=headers)
            self.assertEqual(status, 200)
            self.assertEqual(keys_revealed['gemini']['rawKey'], 'AIzaSyTestGeminiKey123')
            self.assertEqual(keys_revealed['telegram']['rawToken'], '123456789:ABCdefGHIjklMNOpqrSTUvwxYZ')

            # 6. POST /api/keys delete Gemini key and Telegram key
            status, res = self.request('/api/keys', {'provider': 'gemini', 'action': 'delete'}, headers)
            self.assertEqual(status, 200)
            self.assertTrue(res['ok'])
            self.assertEqual(res['action'], 'deleted')
            self.assertFalse(res['ai']['gemini']['enabled'])

            status, res = self.request('/api/keys', {'provider': 'telegram', 'action': 'delete'}, headers)
            self.assertEqual(status, 200)
            self.assertTrue(res['ok'])
            self.assertFalse(res['telegram'])

            # Verify deletion in GET /api/keys
            status, keys_after = self.request('/api/keys', headers=headers)
            self.assertFalse(keys_after['gemini']['configured'])
            self.assertFalse(keys_after['telegram']['configured'])

    def test_security_headers_on_responses(self):
        req = urllib.request.Request(self.url + '/index.html', headers={'Host': '127.0.0.1:3000'})
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            self.assertEqual(resp.headers.get('X-Content-Type-Options'), 'nosniff')
            self.assertEqual(resp.headers.get('X-Frame-Options'), 'SAMEORIGIN')
            self.assertEqual(resp.headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin')
            self.assertEqual(resp.headers.get('Permissions-Policy'), 'camera=(self), microphone=(self), geolocation=()')
            resp.read()

    def test_market_history_validation(self):
        # Empty symbol rejected with 400
        status, res = self.request('/api/market-history?symbol=')
        self.assertEqual(status, 400)
        # Invalid characters in symbol rejected with 400
        status, res = self.request('/api/market-history?symbol=bad%20symbol;DROP')
        self.assertEqual(status, 400)

    def test_9router_ssrf_validation(self):
        self.assertRaises(ValueError, s.validate_router_base, 'http://169.254.169.254/latest/meta-data/v1')
        self.assertRaises(ValueError, s.validate_router_base, 'http://metadata.google.internal/v1')
        self.assertRaises(ValueError, s.validate_router_base, 'ftp://127.0.0.1:20128/v1')
        self.assertRaises(ValueError, s.validate_router_base, 'http://127.0.0.1:20128/api/v2')
        # HTTP API default (allow_private=False) blocks loopback, private, and HTTP
        self.assertRaises(ValueError, s.validate_router_base, 'http://127.0.0.1:20128/v1')
        self.assertRaises(ValueError, s.validate_router_base, 'http://host.docker.internal:20128/v1')
        self.assertRaises(ValueError, s.validate_router_base, 'https://10.0.0.1/v1')
        with patch('socket.getaddrinfo', return_value=[(2, 1, 6, '', ('127.0.0.1', 443))]):
            self.assertRaises(ValueError, s.validate_router_base, 'https://rebind.example.com/v1')
        with patch('socket.getaddrinfo', return_value=[(2, 1, 6, '', ('93.184.216.34', 443))]):
            self.assertEqual(s.validate_router_base('https://api.example.com/v1'), 'https://api.example.com/v1')
        # Server env mode (allow_private=True) permits loopback gateway while still rejecting metadata
        self.assertEqual(s.validate_router_base('http://127.0.0.1:20128/v1', allow_private=True), 'http://127.0.0.1:20128/v1')
        self.assertRaises(ValueError, s.validate_router_base, 'http://169.254.169.254/v1', allow_private=True)

    def test_master_password_auth_protection_and_unauthorized_rejection(self):
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'auth_test.sqlite3'):
            headers_csrf = {'Origin': 'http://127.0.0.1:3000', 'X-INVEYS-CSRF': s.TOKEN}

            # 1. Setup master password (cookie-based session + per-session CSRF, no raw token in JSON)
            status, h_setup, setup_res = self.request_full('/api/auth/setup', {'password': 'TestPassword123'}, headers_csrf)
            self.assertEqual(status, 200)
            self.assertTrue(setup_res['ok'])
            self.assertNotIn('token', setup_res)
            self.assertTrue(setup_res.get('csrf'))
            self.assertIn('inveys_session=', h_setup.get('Set-Cookie', ''))
            self.assertIn('HttpOnly', h_setup.get('Set-Cookie', ''))

            # 2. Configure a test API key with authenticated admin session
            headers_authed = self.session_headers(h_setup, setup_res)
            status, res = self.request('/api/keys', {'provider': 'gemini', 'action': 'save', 'apiKey': 'SecretKeyAuth123'}, headers_authed)
            self.assertEqual(status, 200)

            # 3. Unauthenticated request with CSRF only MUST return 401
            status, unauth_keys = self.request('/api/keys?reveal=1', headers=headers_csrf)
            self.assertEqual(status, 401)

            # 4. Authenticated admin request DOES reveal secrets
            status, authed_keys = self.request('/api/keys?reveal=1', headers=headers_authed)
            self.assertEqual(status, 200)
            self.assertEqual(authed_keys['gemini']['rawKey'], 'SecretKeyAuth123')

            # 5. Unauthenticated POST /api/workspace MUST return 401 Unauthorized
            status, ws_err = self.request('/api/workspace', {'workspace': {'id': 'test'}}, headers_csrf)
            self.assertEqual(status, 401)

            # 6. Authenticated POST /api/workspace returns 200
            status, ws_ok = self.request('/api/workspace', {'workspace': {'id': 'test'}}, headers_authed)
            self.assertEqual(status, 200)

            # 7. Unauthenticated POST /api/keys delete MUST return 401
            status, del_err = self.request('/api/keys', {'provider': 'gemini', 'action': 'delete'}, headers_csrf)
            self.assertEqual(status, 401)

    def test_multi_user_registration_login_and_tenant_isolation(self):
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'multi_user_test.sqlite3'):
            headers_origin = {'Origin': 'http://127.0.0.1:3000'}

            # 1. Validation checks on registration
            bad_email_st, _ = self.request('/api/auth/register', {'email': 'invalid-email', 'password': 'pass123'}, headers_origin)
            self.assertEqual(bad_email_st, 400)
            short_pw_st, _ = self.request('/api/auth/register', {'email': 'user@example.com', 'password': '123'}, headers_origin)
            self.assertEqual(short_pw_st, 400)

            # 2. Register User 1
            st1, h1, res1 = self.request_full('/api/auth/register', {'email': 'hendra@inveys.io', 'password': 'PasswordHendra123', 'name': 'Hendra'}, headers_origin)
            self.assertEqual(st1, 200)
            self.assertTrue(res1['ok'])
            self.assertNotIn('token', res1)
            self.assertEqual(res1['user']['email'], 'hendra@inveys.io')
            self.assertEqual(res1['user']['name'], 'Hendra')
            headers_u1 = self.session_headers(h1, res1)

            # 3. Duplicate email registration rejected
            dup_st, dup_res = self.request('/api/auth/register', {'email': 'hendra@inveys.io', 'password': 'OtherPassword123'}, headers_origin)
            self.assertEqual(dup_st, 400)

            # 4. Register User 2
            st2, h2, res2 = self.request_full('/api/auth/register', {'email': 'partner@inveys.io', 'password': 'PasswordPartner123', 'name': 'Partner'}, headers_origin)
            self.assertEqual(st2, 200)
            headers_u2 = self.session_headers(h2, res2)

            # 5. User 1 logs in with email & password
            st_login, h_login, res_login = self.request_full('/api/auth/login', {'email': 'hendra@inveys.io', 'password': 'PasswordHendra123'}, headers_origin)
            self.assertEqual(st_login, 200)
            self.assertNotIn('token', res_login)
            self.assertIn('inveys_session=', h_login.get('Set-Cookie', ''))
            self.assertTrue(res_login.get('csrf'))

            # 6. Tenant Isolation: User 1 writes their workspace
            ws_u1_payload = {'workspace': {'id': 'ws_hendra', 'name': 'Hendra Vault', 'accounts': [{'id': 'a1', 'balance': 50000000}]}}
            st_ws1, _ = self.request('/api/workspace', ws_u1_payload, headers_u1)
            self.assertEqual(st_ws1, 200)

            # 7. User 2 writes their distinct workspace
            ws_u2_payload = {'workspace': {'id': 'ws_partner', 'name': 'Partner Vault', 'accounts': [{'id': 'a2', 'balance': 10000000}]}}
            st_ws2, _ = self.request('/api/workspace', ws_u2_payload, headers_u2)
            self.assertEqual(st_ws2, 200)

            # 8. User 1 retrieves their workspace -> receives Hendra Vault only
            st_get1, res_get1 = self.request('/api/workspace', headers=headers_u1)
            self.assertEqual(st_get1, 200)
            self.assertEqual(res_get1['workspace']['name'], 'Hendra Vault')
            self.assertEqual(res_get1['workspace']['accounts'][0]['balance'], 50000000)

            # 9. User 2 retrieves their workspace -> receives Partner Vault only
            st_get2, res_get2 = self.request('/api/workspace', headers=headers_u2)
            self.assertEqual(st_get2, 200)
            self.assertEqual(res_get2['workspace']['name'], 'Partner Vault')
            self.assertEqual(res_get2['workspace']['accounts'][0]['balance'], 10000000)

            # 10. Check /api/auth/me for User 1
            st_me, res_me = self.request('/api/auth/me', headers=headers_u1)
            self.assertEqual(st_me, 200)
            self.assertEqual(res_me['user']['email'], 'hendra@inveys.io')

    def test_payment_order_create_simulate_and_license_status(self):
        with tempfile.TemporaryDirectory() as d, \
             patch.object(s, 'DB', Path(d) / 'payment_test.sqlite3'), \
             patch.dict(os.environ, {'INVEYS_ENABLE_PAYMENT_SIMULATOR': '1', 'INVEYS_LICENSE_SECRET': 'test-license-secret-key'}):
            headers_origin = {'Origin': 'http://127.0.0.1:3000'}

            # 1. Register first user (admin) so simulator can be exercised when explicitly enabled
            _, h_adm, res_user = self.request_full('/api/auth/register', {'email': 'buyer@inveys.io', 'password': 'PasswordBuyer123', 'name': 'Buyer'}, headers_origin)
            user_headers = self.session_headers(h_adm, res_user)

            # 2. Create payment order for Pro Monthly (Rp 99.000)
            st_ord, res_ord = self.request('/api/payment/create', {'plan': 'pro', 'cycle': 'monthly'}, user_headers)
            self.assertEqual(st_ord, 200)
            self.assertTrue(res_ord['ok'])
            self.assertEqual(res_ord['amount'], 99000)
            self.assertEqual(res_ord['status'], 'pending')
            self.assertTrue(res_ord['orderId'].startswith('INV-'))
            self.assertTrue(res_ord['qris'].startswith('00020101'))
            order_id = res_ord['orderId']

            # 3. Query order status via GET /api/payment/order/<order_id>
            st_check, res_check = self.request(f'/api/payment/order/{order_id}', headers=user_headers)
            self.assertEqual(st_check, 200)
            self.assertEqual(res_check['order']['status'], 'pending')
            self.assertEqual(res_check['order']['amount'], 99000)

            # 4. Simulate payment settlement (requires explicit env flag + admin auth + CSRF)
            st_sim, res_sim = self.request('/api/payment/simulate', {'order_id': order_id}, user_headers)
            self.assertEqual(st_sim, 200)
            self.assertTrue(res_sim['ok'])
            self.assertEqual(res_sim['status'], 'paid')
            self.assertEqual(res_sim['plan'], 'pro')
            self.assertTrue(res_sim['licenseKey'].startswith('IV-PRO-'))

            # 5. Query order status after payment -> status paid & licenseKey attached
            st_check2, res_check2 = self.request(f'/api/payment/order/{order_id}', headers=user_headers)
            self.assertEqual(st_check2, 200)
            self.assertEqual(res_check2['order']['status'], 'paid')
            self.assertTrue(res_check2['order']['licenseKey'].startswith('IV-PRO-'))

            # 6. Verify /api/license/status reports active Pro plan
            st_lic, res_lic = self.request('/api/license/status', headers=user_headers)
            self.assertEqual(st_lic, 200)
            self.assertEqual(res_lic['plan'], 'pro')
            self.assertTrue(res_lic['hasActiveLicense'])
            self.assertIsNotNone(res_lic['license'])

    def test_license_key_activation_flow(self):
        with tempfile.TemporaryDirectory() as d, \
             patch.object(s, 'DB', Path(d) / 'lic_test.sqlite3'), \
             patch.dict(os.environ, {'INVEYS_LICENSE_SECRET': 'test-license-secret-key'}):
            headers_origin = {'Origin': 'http://127.0.0.1:3000'}

            # 1. Register first user (admin), then second user on default Plus plan
            self.request_full('/api/auth/register', {'email': 'owner@inveys.io', 'password': 'PasswordOwner123', 'name': 'Owner'}, headers_origin)
            _, h_sub, res_user = self.request_full('/api/auth/register', {'email': 'subscriber@inveys.io', 'password': 'PasswordSub123', 'name': 'Sub'}, headers_origin)
            user_headers = self.session_headers(h_sub, res_user)

            # 2. Generate a valid Lifetime Ultra license key for this user
            valid_lic, _ = s.generate_license_key('usr_test', 'subscriber@inveys.io', 'ultra', expires_at=None)

            # 3. Activate valid license
            st_act, res_act = self.request('/api/license/activate', {'license_key': valid_lic}, user_headers)
            self.assertEqual(st_act, 200)
            self.assertTrue(res_act['ok'])
            self.assertEqual(res_act['plan'], 'ultra')
            self.assertTrue(res_act['isLifetime'])

            # 4. Reject invalid license key & forged signature
            st_inv, res_inv = self.request('/api/license/activate', {'license_key': 'IV-INVALID-KEY'}, user_headers)
            self.assertEqual(st_inv, 400)
            forged = valid_lic[:-4] + '0000'
            st_forged, _ = self.request('/api/license/activate', {'license_key': forged}, user_headers)
            self.assertEqual(st_forged, 400)

            # 5. Reject license issued for a different email
            foreign_lic, _ = s.generate_license_key('usr_other', 'other@inveys.io', 'ultra', expires_at=None)
            st_for, res_for = self.request('/api/license/activate', {'license_key': foreign_lic}, user_headers)
            self.assertEqual(st_for, 400)

    def test_midtrans_webhook_processing(self):
        import hashlib
        with tempfile.TemporaryDirectory() as d, \
             patch.object(s, 'DB', Path(d) / 'webhook_test.sqlite3'), \
             patch.dict(os.environ, {'MIDTRANS_SERVER_KEY': 'SB-Mid-server-TestKey123', 'INVEYS_LICENSE_SECRET': 'test-license-secret-key'}):
            headers_origin = {'Origin': 'http://127.0.0.1:3000'}

            # Register user to own the order
            _, h_user, res_user = self.request_full('/api/auth/register', {'email': 'webhook@inveys.io', 'password': 'PasswordWh123', 'name': 'Webhook User'}, headers_origin)
            user_headers = self.session_headers(h_user, res_user)

            # 1. Create order (mock outbound Snap API so test stays offline)
            with patch.object(s, 'create_midtrans_transaction', return_value={'isLive': False}):
                st_ord, res_ord = self.request('/api/payment/create', {'email': 'webhook@inveys.io', 'name': 'Webhook User', 'plan': 'lifetime', 'cycle': 'lifetime'}, user_headers)
            self.assertEqual(st_ord, 200)
            order_id = res_ord['orderId']

            # 2. Trigger Midtrans webhook with valid SHA-512 signature (settlement)
            gross_amount = str(res_ord['amount'])
            sig_key = hashlib.sha512(f"{order_id}200{gross_amount}SB-Mid-server-TestKey123".encode('utf-8')).hexdigest()
            webhook_payload = {
                'order_id': order_id,
                'status_code': '200',
                'gross_amount': gross_amount,
                'signature_key': sig_key,
                'transaction_status': 'settlement',
                'fraud_status': 'accept',
                'payment_type': 'qris'
            }
            st_wh, res_wh = self.request('/api/payment/webhook/midtrans', webhook_payload, headers_origin)
            self.assertEqual(st_wh, 200)
            self.assertTrue(res_wh['ok'])

            # 3. Check order is paid (authenticated owner)
            st_check, res_check = self.request(f'/api/payment/order/{order_id}', headers=user_headers)
            self.assertEqual(st_check, 200)
            self.assertEqual(res_check['order']['status'], 'paid')
            self.assertEqual(res_check['order']['plan'], 'lifetime')
            self.assertTrue(res_check['order']['licenseKey'].startswith('IV-ULTRA-'))

    def test_admin_user_roles_and_control_panel_api(self):
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'admin_test.sqlite3'):
            headers_origin = {'Origin': 'http://127.0.0.1:3000'}

            # 1. First user registers -> automatically becomes Admin with ULTRA plan
            st_adm, h_adm, res_adm = self.request_full('/api/auth/register', {
                'email': 'admin@inveys.io',
                'password': 'password123',
                'name': 'Main Administrator'
            }, headers_origin)
            self.assertEqual(st_adm, 200)
            self.assertEqual(res_adm['user']['role'], 'admin')
            self.assertEqual(res_adm['user']['plan'], 'ultra')
            admin_headers = self.session_headers(h_adm, res_adm)

            # 2. Second user registers -> regular user with PLUS plan
            st_usr, h_usr, res_usr = self.request_full('/api/auth/register', {
                'email': 'regular@inveys.io',
                'password': 'password123',
                'name': 'Regular Member'
            }, headers_origin)
            self.assertEqual(st_usr, 200)
            self.assertEqual(res_usr['user']['role'], 'user')
            self.assertEqual(res_usr['user']['plan'], 'plus')
            user_headers = self.session_headers(h_usr, res_usr)

            # 3. Regular user tries to access /api/admin/overview -> 403 Forbidden
            st_denied, _ = self.request('/api/admin/overview', headers=user_headers)
            self.assertEqual(st_denied, 403)

            # 4. Admin accesses /api/admin/overview -> 200 OK with accurate counts
            st_ov, res_ov = self.request('/api/admin/overview', headers=admin_headers)
            self.assertEqual(st_ov, 200)
            self.assertTrue(res_ov['ok'])
            self.assertEqual(res_ov['overview']['totalUsers'], 2)
            self.assertEqual(res_ov['overview']['adminUsers'], 1)
            self.assertEqual(res_ov['overview']['activeUsers'], 2)

            # 5. Admin queries /api/admin/users
            st_users, res_users = self.request('/api/admin/users', headers=admin_headers)
            self.assertEqual(st_users, 200)
            self.assertEqual(len(res_users['users']), 2)

            # 6. Admin creates a new user directly
            st_cr, res_cr = self.request('/api/admin/users/create', {
                'email': 'client@domain.com',
                'password': 'password456',
                'name': 'VIP Client',
                'plan': 'pro',
                'role': 'user'
            }, admin_headers)
            self.assertEqual(st_cr, 200)
            self.assertEqual(res_cr['user']['plan'], 'pro')
            vip_id = res_cr['user']['id']

            # 7. Admin updates VIP Client to ULTRA plan and suspends
            st_up, res_up = self.request('/api/admin/users/update', {
                'id': vip_id,
                'name': 'VIP Client Updated',
                'plan': 'ultra',
                'role': 'user',
                'status': 'suspended'
            }, admin_headers)
            self.assertEqual(st_up, 200)
            self.assertEqual(res_up['user']['status'], 'suspended')
            self.assertEqual(res_up['user']['plan'], 'ultra')

            # 8. Suspended user login fails with 403
            st_sus, res_sus = self.request('/api/auth/login', {
                'email': 'client@domain.com',
                'password': 'password456'
            }, headers_origin)
            self.assertEqual(st_sus, 403)
            self.assertIn('ditangguhkan', res_sus['error'])

            # 9. Admin resets password and reactivates user
            st_act, _ = self.request('/api/admin/users/update', {
                'id': vip_id,
                'status': 'active'
            }, admin_headers)
            self.assertEqual(st_act, 200)

            st_pw, _ = self.request('/api/admin/users/reset-password', {
                'id': vip_id,
                'newPassword': 'brandNewPassword999'
            }, admin_headers)
            self.assertEqual(st_pw, 200)

            # 10. Login with new password succeeds
            st_relog, res_relog = self.request('/api/auth/login', {
                'email': 'client@domain.com',
                'password': 'brandNewPassword999'
            }, headers_origin)
            self.assertEqual(st_relog, 200)
            self.assertEqual(res_relog['user']['status'], 'active')

            # 11. Admin deletes the user
            st_del, res_del = self.request('/api/admin/users/delete', {'id': vip_id}, admin_headers)
            self.assertEqual(st_del, 200)
            self.assertTrue(res_del['ok'])

            # 12. Admin cannot delete self
            st_self_del, _ = self.request('/api/admin/users/delete', {'id': res_adm['user']['id']}, admin_headers)
            self.assertEqual(st_self_del, 400)

    def test_admin_database_export_and_disaster_recovery(self):
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'inbox.sqlite3'):
            headers_origin = {'Origin': 'http://127.0.0.1:3000'}
            # 1. Unauthenticated gets 401
            st_unauth, _, _ = self.raw_request('/api/admin/database/export')
            self.assertEqual(st_unauth, 401)

            # 2. Register first user (Admin)
            _, h_adm, res_adm = self.request_full('/api/auth/register', {
                'email': 'admin_dr@inveys.io',
                'password': 'password123',
                'name': 'Disaster Recovery Admin'
            }, headers_origin)
            adm_headers = self.session_headers(h_adm, res_adm)

            # 3. Register second user (standard user)
            _, h_usr, res_user = self.request_full('/api/auth/register', {
                'email': 'regular_dr@inveys.io',
                'password': 'password123',
                'name': 'Regular User'
            }, headers_origin)
            usr_headers = self.session_headers(h_usr, res_user)

            # 4. Standard user gets 403 Forbidden
            st_forbid, _, _ = self.raw_request('/api/admin/database/export', usr_headers)
            self.assertEqual(st_forbid, 403)

            # 5. Admin gets 200 with valid SQLite file
            st_ok, headers, body = self.raw_request('/api/admin/database/export', adm_headers)
            self.assertEqual(st_ok, 200)
            self.assertEqual(headers.get('Content-Type'), 'application/vnd.sqlite3')
            self.assertIn('inveys-backup-', headers.get('Content-Disposition', ''))
            self.assertTrue(body.startswith(b'SQLite format 3\x00'))
            self.assertGreater(len(body), 1000)

    def test_admin_audit_logs_and_security_trail(self):
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'inbox.sqlite3'):
            headers_origin = {'Origin': 'http://127.0.0.1:3000'}
            # Register Admin
            _, h_adm, res_adm = self.request_full('/api/auth/register', {
                'email': 'security_officer@inveys.io',
                'password': 'secPassword123'
            }, headers_origin)
            adm_headers = self.session_headers(h_adm, res_adm)

            # Register User
            _, h_usr, res_usr = self.request_full('/api/auth/register', {
                'email': 'standard_user@inveys.io',
                'password': 'secPassword123'
            }, headers_origin)
            usr_headers = self.session_headers(h_usr, res_usr)

            # Regular user cannot access audit logs
            st_forbid, _ = self.request('/api/admin/audit-logs', headers=usr_headers)
            self.assertEqual(st_forbid, 403)

            # Trigger a failed login
            self.request('/api/auth/login', {'email': 'unknown@inveys.io', 'password': 'wrong'}, headers_origin)

            # Admin reads audit logs
            st_logs, res_logs = self.request('/api/admin/audit-logs', headers=adm_headers)
            self.assertEqual(st_logs, 200)
            self.assertTrue(res_logs['ok'])
            actions = [log['action'] for log in res_logs['logs']]
            self.assertIn('auth.register', actions)
            self.assertIn('auth.login.failed', actions)

    def test_system_broadcast_announcement(self):
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'inbox.sqlite3'):
            headers_origin = {'Origin': 'http://127.0.0.1:3000'}
            # Initial public broadcast is inactive
            st_init, res_init = self.request('/api/broadcast')
            self.assertEqual(st_init, 200)
            self.assertFalse(res_init['broadcast']['active'])

            # Register Admin & User
            _, h_adm, res_adm = self.request_full('/api/auth/register', {
                'email': 'sysadmin@inveys.io',
                'password': 'passAdmin123'
            }, headers_origin)
            adm_headers = self.session_headers(h_adm, res_adm)

            _, h_usr, res_usr = self.request_full('/api/auth/register', {
                'email': 'member@inveys.io',
                'password': 'passAdmin123'
            }, headers_origin)
            usr_headers = self.session_headers(h_usr, res_usr)

            # User cannot post broadcast
            st_forbid, _ = self.request('/api/admin/broadcast', {
                'message': 'Evil announcement',
                'active': True
            }, usr_headers)
            self.assertEqual(st_forbid, 403)

            # Admin posts broadcast
            st_set, res_set = self.request('/api/admin/broadcast', {
                'message': 'Pemeliharaan server VPS malam ini pukul 23:00 WIB.',
                'tone': 'warning',
                'active': True
            }, adm_headers)
            self.assertEqual(st_set, 200)
            self.assertTrue(res_set['ok'])
            self.assertTrue(res_set['broadcast']['active'])
            self.assertEqual(res_set['broadcast']['tone'], 'warning')

            # Public GET now retrieves active broadcast
            st_pub, res_pub = self.request('/api/broadcast')
            self.assertEqual(st_pub, 200)
            self.assertTrue(res_pub['broadcast']['active'])
            self.assertEqual(res_pub['broadcast']['tone'], 'warning')
            self.assertIn('Pemeliharaan server', res_pub['broadcast']['message'])

    def test_admin_telegram_notifications(self):
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'inbox.sqlite3'):
            headers_origin = {'Origin': 'http://127.0.0.1:3000'}
            
            # 1. Unauthenticated test call -> 401
            st_unauth, _ = self.request('/api/admin/telegram/test', {})
            self.assertEqual(st_unauth, 401)

            # Register Admin & User
            _, h_adm, res_adm = self.request_full('/api/auth/register', {
                'email': 'admin_tg@inveys.io',
                'password': 'passAdmin123'
            }, headers_origin)
            adm_headers = self.session_headers(h_adm, res_adm)

            _, h_usr, res_usr = self.request_full('/api/auth/register', {
                'email': 'user_tg@inveys.io',
                'password': 'passAdmin123'
            }, headers_origin)
            usr_headers = self.session_headers(h_usr, res_usr)

            # 2. Regular user cannot trigger telegram test -> 403
            st_forbid, _ = self.request('/api/admin/telegram/test', {}, usr_headers)
            self.assertEqual(st_forbid, 403)

            # 3. Admin call without bot token / chat ID -> 400
            st_missing, res_missing = self.request('/api/admin/telegram/test', {}, adm_headers)
            self.assertEqual(st_missing, 400)
            self.assertFalse(res_missing['ok'])
            self.assertIn('belum dikonfigurasi', res_missing['error'])

            # 4. Admin call with mocked send_telegram_message -> 200 & audit recorded
            with patch.object(s, 'send_telegram_message', return_value={'message_id': 12345}):
                st_ok, res_ok = self.request('/api/admin/telegram/test', {
                    'botToken': '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
                    'chatId': '987654321'
                }, adm_headers)
                self.assertEqual(st_ok, 200)
                self.assertTrue(res_ok['ok'])
                self.assertIn('Notifikasi uji coba berhasil dikirim', res_ok['message'])

            # 5. Check audit logs contain admin.telegram.test
            st_logs, res_logs = self.request('/api/admin/audit-logs', headers=adm_headers)
            self.assertEqual(st_logs, 200)
            actions = [log['action'] for log in res_logs['logs']]
            self.assertIn('admin.telegram.test', actions)

            # 6. Overview includes telegram status
            st_ov, res_ov = self.request('/api/admin/overview', headers=adm_headers)
            self.assertEqual(st_ov, 200)
            self.assertIn('telegram', res_ov['overview'])
            self.assertIn('configured', res_ov['overview']['telegram'])

            # 7. Asynchronous notify_admin_telegram helper test
            with patch.dict(os.environ, {'TELEGRAM_BOT_TOKEN': 'test_tok', 'TELEGRAM_CHAT_ID': '123456'}):
                with patch.object(s, 'send_telegram_message') as mock_send:
                    s.notify_admin_telegram("<b>Alert Test</b>")
                    # Allow daemon thread execution
                    import time
                    time.sleep(0.15)
                    mock_send.assert_called_once()

    def test_email_otp_generation_verification_and_security_lockout(self):
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'otp_test.sqlite3'):
            headers_origin = {'Host': '127.0.0.1:3000', 'Origin': 'http://127.0.0.1:3000'}
            # Register user
            st_reg, res_reg = self.request('/api/auth/register', {
                'email': 'support@inveys.io',
                'password': 'PasswordSecure123',
                'name': 'inveys'
            }, headers_origin)
            self.assertEqual(st_reg, 200)

            # Invalid email format -> 400
            st_bad, res_bad = self.request('/api/auth/send-otp', {'email': 'invalid-email'}, headers_origin)
            self.assertEqual(st_bad, 400)

            # Non-existent email -> 404
            st_notfound, res_notfound = self.request('/api/auth/send-otp', {'email': 'unknown@inveys.io'}, headers_origin)
            self.assertEqual(st_notfound, 404)

            # Valid send-otp
            with patch.object(s, 'send_email_otp', return_value=(True, 'Sent')) as mock_send:
                st_send, res_send = self.request('/api/auth/send-otp', {'email': 'support@inveys.io'}, headers_origin)
                self.assertEqual(st_send, 200)
                self.assertTrue(res_send['ok'])
                mock_send.assert_called_once()
                otp_code = mock_send.call_args[0][1]
                self.assertEqual(len(otp_code), 6)

            # Stored OTP in SQLite MUST be hashed, never plaintext
            with s.db() as c:
                stored_otp = c.execute('SELECT otp_code FROM email_otps ORDER BY id DESC LIMIT 1').fetchone()[0]
                self.assertTrue(stored_otp.startswith('hmac:'))
                self.assertNotIn(otp_code, stored_otp)

            # Rate-limiting: sending again within 60s -> 429
            st_rate, res_rate = self.request('/api/auth/send-otp', {'email': 'support@inveys.io'}, headers_origin)
            self.assertEqual(st_rate, 429)

            # Verify with wrong OTP -> 400
            st_wrong, res_wrong = self.request('/api/auth/verify-otp', {'email': 'support@inveys.io', 'otp': '000000'}, headers_origin)
            self.assertEqual(st_wrong, 400)
            self.assertIn('tidak sesuai', res_wrong['error'])

            # Verify with correct OTP -> 200 (cookie set, no raw token in JSON)
            st_ok, h_ok, res_ok = self.request_full('/api/auth/verify-otp', {'email': 'support@inveys.io', 'otp': otp_code}, headers_origin)
            self.assertEqual(st_ok, 200)
            self.assertTrue(res_ok['ok'])
            self.assertEqual(res_ok['user']['email'], 'support@inveys.io')
            self.assertEqual(res_ok['user']['role'], 'admin')
            self.assertNotIn('token', res_ok)
            self.assertIn('inveys_session=', h_ok.get('Set-Cookie', ''))
            self.assertTrue(res_ok.get('csrf'))

            # Re-verify already used OTP -> 400
            st_used, res_used = self.request('/api/auth/verify-otp', {'email': 'support@inveys.io', 'otp': otp_code}, headers_origin)
            self.assertEqual(st_used, 400)

    def test_support_inveys_admin_auto_provisioning_and_otp_access(self):
        # 1. Helper function is_admin_email validation (exact ADMIN_EMAILS only, NO admin@* prefix)
        self.assertTrue(s.is_admin_email('support@inveys.io'))
        self.assertTrue(s.is_admin_email('admin@inveys.io'))
        self.assertFalse(s.is_admin_email('admin@customcorp.com'))
        self.assertFalse(s.is_admin_email('user@inveys.io'))
        self.assertFalse(s.is_admin_email(''))
        self.assertFalse(s.is_admin_email(None))

        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'admin_prov.sqlite3'):
            headers_origin = {'Host': '127.0.0.1:3000', 'Origin': 'http://127.0.0.1:3000'}

            # 2. Existing regular user exists in database first
            st_u1, res_u1 = self.request('/api/auth/register', {
                'email': 'first_user@domain.com',
                'password': 'FirstPassword123!',
                'name': 'First User'
            }, headers_origin)
            self.assertEqual(st_u1, 200)

            # 3. Request OTP for support@inveys.io even when not yet registered -> SUCCEEDS (not 404)
            with patch.object(s, 'send_email_otp', return_value=(True, 'Sent')) as mock_send:
                st_otp, res_otp = self.request('/api/auth/send-otp', {'email': 'support@inveys.io'}, headers_origin)
                self.assertEqual(st_otp, 200)
                self.assertTrue(res_otp['ok'])
                mock_send.assert_called_once()
                otp_code = mock_send.call_args[0][1]

            # 4. Verify OTP for support@inveys.io -> user created as admin with ULTRA plan
            st_ver, h_ver, res_ver = self.request_full('/api/auth/verify-otp', {'email': 'support@inveys.io', 'otp': otp_code}, headers_origin)
            self.assertEqual(st_ver, 200)
            self.assertEqual(res_ver['user']['email'], 'support@inveys.io')
            self.assertEqual(res_ver['user']['role'], 'admin')
            self.assertEqual(res_ver['user']['plan'], 'ultra')
            support_id = res_ver['user']['id']
            adm_headers = self.session_headers(h_ver, res_ver)

            # 5. support@inveys.io can access /api/admin/overview
            st_ov, res_ov = self.request('/api/admin/overview', headers=adm_headers)
            self.assertEqual(st_ov, 200)
            self.assertTrue(res_ov['ok'])

            # 6. Admin cannot demote support@inveys.io to user role
            st_demote, res_demote = self.request('/api/admin/users/update', {
                'id': support_id,
                'role': 'user'
            }, adm_headers)
            self.assertEqual(st_demote, 400)
            self.assertIn('dilindungi', res_demote['error'])

            # 7. Admin cannot delete support@inveys.io
            st_del_self, res_del_self = self.request('/api/admin/users/delete', {'id': support_id}, adm_headers)
            self.assertEqual(st_del_self, 400)
            self.assertIn('Anda tidak dapat menghapus akun Anda sendiri', res_del_self['error'])

            # Create another admin via admin API
            st_cr_adm, res_cr_adm = self.request('/api/admin/users/create', {
                'email': 'secondary_admin@inveys.io',
                'password': 'AdminPassword2!',
                'name': 'Secondary Admin',
                'plan': 'ultra',
                'role': 'admin'
            }, adm_headers)
            self.assertEqual(st_cr_adm, 200)

            # Login as secondary admin
            st_log2, h_log2, res_log2 = self.request_full('/api/auth/login', {
                'email': 'secondary_admin@inveys.io',
                'password': 'AdminPassword2!'
            }, headers_origin)
            self.assertEqual(st_log2, 200)
            adm2_headers = self.session_headers(h_log2, res_log2)

            # Secondary admin attempting to delete protected support@inveys.io is blocked
            st_del, res_del = self.request('/api/admin/users/delete', {'id': support_id}, adm2_headers)
            self.assertEqual(st_del, 400)
            self.assertIn('dilindungi', res_del['error'])

            # 8. ensure_default_admin runs idempotently
            s.ensure_default_admin()
            with s.db() as c:
                row = c.execute('SELECT role, plan, status FROM users WHERE email = "support@inveys.io"').fetchone()
                self.assertEqual(row, ('admin', 'ultra', 'active'))

    def test_security_critical1_setup_lockout_and_admin_prefix(self):
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'crit1.sqlite3'):
            origin = {'Origin': 'http://127.0.0.1:3000'}
            # Initialize server with first owner
            st1, _, _ = self.request_full('/api/auth/setup', {'email': 'owner@inveys.io', 'password': 'Password123!'}, origin)
            self.assertEqual(st1, 200)

            # Subsequent /api/auth/setup (both email and master branches) MUST return 403
            st2, _ = self.request('/api/auth/setup', {'email': 'attacker@evil.com', 'password': 'Password123!'}, origin)
            self.assertEqual(st2, 403)
            st3, _ = self.request('/api/auth/setup', {'password': 'Password123!'}, origin)
            self.assertEqual(st3, 403)

            # Registering admin@evil.com MUST NOT grant admin or ultra
            st4, _, res4 = self.request_full('/api/auth/register', {'email': 'admin@evil.com', 'password': 'Password123!', 'plan': 'ultra'}, origin)
            self.assertEqual(st4, 200)
            self.assertEqual(res4['user']['role'], 'user')
            self.assertEqual(res4['user']['plan'], 'plus')

            # Public registration of explicit admin email MUST be blocked once initialized
            st5, _ = self.request('/api/auth/register', {'email': 'admin@inveys.io', 'password': 'Password123!'}, origin)
            self.assertEqual(st5, 403)

    def test_security_critical3_admin_only_routes_env_injection_and_router_key(self):
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'crit3.sqlite3'):
            origin = {'Origin': 'http://127.0.0.1:3000'}
            # 1. First user (admin), second user (standard)
            _, h_adm, res_adm = self.request_full('/api/auth/register', {'email': 'adm@inveys.io', 'password': 'Password123!'}, origin)
            _, h_usr, res_usr = self.request_full('/api/auth/register', {'email': 'usr@inveys.io', 'password': 'Password123!'}, origin)
            usr_headers = self.session_headers(h_usr, res_usr)

            # Standard user blocked with 403 on all sensitive server endpoints
            self.assertEqual(self.request('/api/keys', headers=usr_headers)[0], 403)
            self.assertEqual(self.request('/api/keys?reveal=1', headers=usr_headers)[0], 403)
            self.assertEqual(self.request('/api/keys', {'provider': 'gemini', 'action': 'save', 'apiKey': 'x'}, usr_headers)[0], 403)
            self.assertEqual(self.request('/api/vps/update', {}, usr_headers)[0], 403)
            self.assertEqual(self.request('/api/telegram/inbox', {}, usr_headers)[0], 403)
            self.assertEqual(self.request('/api/telegram/ack', {'id': 1}, usr_headers)[0], 403)
            self.assertEqual(self.request('/api/telegram/send', {'text': 'hi', 'consent': True}, usr_headers)[0], 403)

            # .env newline injection rejected
            with self.assertRaises(ValueError):
                s.save_server_setting('GEMINI_MODEL', 'flash\nADMIN_EMAILS=evil@example.com')
            with self.assertRaises(ValueError):
                s.save_server_setting('GEMINI_MODEL', 'flash\rADMIN_EMAILS=evil@example.com')

            # test_api_key_connection('9router', ...) refuses sending stored key to a different caller baseUrl
            with patch.dict(os.environ, {'NINEROUTER_API_KEY': 'stored-secret', 'NINEROUTER_BASE_URL': 'http://127.0.0.1:20128/v1'}), \
                 patch('socket.getaddrinfo', return_value=[(2, 1, 6, '', ('93.184.216.34', 443))]):
                res = s.test_api_key_connection('9router', {'baseUrl': 'https://attacker.example.com/v1'})
                self.assertFalse(res['ok'])
                self.assertIn('eksplisit', res['error'].lower())

    def test_security_critical4_billing_webhooks_license_and_order_idor(self):
        import hashlib, hmac
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'crit4.sqlite3'):
            origin = {'Origin': 'http://127.0.0.1:3000'}
            _, h_adm, res_adm = self.request_full('/api/auth/register', {'email': 'adm4@inveys.io', 'password': 'Password123!'}, origin)
            _, h_u1, res_u1 = self.request_full('/api/auth/register', {'email': 'u1@inveys.io', 'password': 'Password123!', 'plan': 'ultra'}, origin)
            _, h_u2, res_u2 = self.request_full('/api/auth/register', {'email': 'u2@inveys.io', 'password': 'Password123!'}, origin)
            adm_headers = self.session_headers(h_adm, res_adm)
            u1_headers = self.session_headers(h_u1, res_u1)
            u2_headers = self.session_headers(h_u2, res_u2)

            # Self-selected plan on register forced to plus
            self.assertEqual(res_u1['user']['plan'], 'plus')

            # Create order for u1
            st_o, res_o = self.request('/api/payment/create', {'plan': 'pro', 'cycle': 'monthly'}, u1_headers)
            self.assertEqual(st_o, 200)
            oid = res_o['orderId']

            # Order IDOR: unauthenticated -> 401, other user -> 403, owner -> 200
            self.assertEqual(self.request(f'/api/payment/order/{oid}')[0], 401)
            self.assertEqual(self.request(f'/api/payment/order/{oid}', headers=u2_headers)[0], 403)
            self.assertEqual(self.request(f'/api/payment/order/{oid}', headers=u1_headers)[0], 200)

            # /api/payment/simulate disabled by default -> 403 even for admin
            with patch.dict(os.environ, {}, clear=False):
                os.environ.pop('INVEYS_ENABLE_PAYMENT_SIMULATOR', None)
                self.assertEqual(self.request('/api/payment/simulate', {'order_id': oid}, adm_headers)[0], 403)
            # Even when enabled, non-admin gets 403
            with patch.dict(os.environ, {'INVEYS_ENABLE_PAYMENT_SIMULATOR': '1'}):
                self.assertEqual(self.request('/api/payment/simulate', {'order_id': oid}, u1_headers)[0], 403)

            # Webhooks fail closed (503) when secrets unset
            with patch.dict(os.environ, {'MIDTRANS_SERVER_KEY': '', 'MAYAR_WEBHOOK_SECRET': ''}):
                self.assertEqual(self.request('/api/payment/webhook/midtrans', {'order_id': oid, 'status_code': '200', 'gross_amount': '99000', 'transaction_status': 'settlement'}, origin)[0], 503)
                self.assertEqual(self.request('/api/payment/webhook/mayar', {'event': 'payment.received', 'data': {'order_id': oid}}, origin)[0], 503)

            # Midtrans rejects wrong signature (403) and amount mismatch (400)
            with patch.dict(os.environ, {'MIDTRANS_SERVER_KEY': 'mid-sec', 'INVEYS_LICENSE_SECRET': 'lic-sec'}):
                self.assertEqual(self.request('/api/payment/webhook/midtrans', {'order_id': oid, 'status_code': '200', 'gross_amount': '99000', 'signature_key': 'bad', 'transaction_status': 'settlement'}, origin)[0], 403)
                bad_amt_sig = hashlib.sha512(f"{oid}2001mid-sec".encode()).hexdigest()
                self.assertEqual(self.request('/api/payment/webhook/midtrans', {'order_id': oid, 'status_code': '200', 'gross_amount': '1', 'signature_key': bad_amt_sig, 'transaction_status': 'settlement'}, origin)[0], 400)

            # Mayar rejects bad signature (403) and accepts valid HMAC-SHA256 signature
            with patch.dict(os.environ, {'MAYAR_WEBHOOK_SECRET': 'mayar-sec', 'INVEYS_LICENSE_SECRET': 'lic-sec'}):
                mayar_body = {'event': 'payment.received', 'data': {'order_id': oid, 'amount': res_o['amount']}}
                self.assertEqual(self.request('/api/payment/webhook/mayar', mayar_body, {**origin, 'X-Callback-Signature': 'deadbeef'})[0], 403)
                raw = json.dumps(mayar_body).encode()
                good_sig = hmac.new(b'mayar-sec', raw, hashlib.sha256).hexdigest()
                self.assertEqual(self.request('/api/payment/webhook/mayar', mayar_body, {**origin, 'X-Callback-Signature': good_sig})[0], 200)

            # verify_license_key fails without secret, rejects non-allowlisted plans (XSS), and rejects forged sig
            with patch.dict(os.environ, {'INVEYS_LICENSE_SECRET': ''}):
                ok, _ = s.verify_license_key('IV-ULTRA-AAAAAA-LIFETIME-12345678', 'u1@inveys.io')
                self.assertFalse(ok)
            with patch.dict(os.environ, {'INVEYS_LICENSE_SECRET': 'lic-sec'}):
                ok_xss, _ = s.verify_license_key('IV-"onclick="alert(1)-AAAAAA-LIFETIME-12345678', 'u1@inveys.io')
                self.assertFalse(ok_xss)

    def test_security_high6_7_8_9_and_medium10(self):
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'sec_misc.sqlite3'):
            origin = {'Origin': 'http://127.0.0.1:3000'}

            # High #6: HTML/quote chars in email rejected
            self.assertEqual(self.request('/api/auth/register', {'email': '"<script>@evil.com', 'password': 'Password123!'}, origin)[0], 400)

            # High #7: crypto _is_safe_proxy blocks RFC1918, 0.0.0.0, host.docker.internal, and private DNS
            for bad_proxy in (
                'http://10.0.0.1:8080',
                'http://172.16.0.1:8080',
                'http://192.168.1.1:8080',
                'http://0.0.0.0:8080',
                'http://host.docker.internal:8080',
            ):
                self.assertFalse(s.inveys_crypto._is_safe_proxy(bad_proxy))
            with patch('socket.getaddrinfo', return_value=[(2, 1, 6, '', ('169.254.169.254', 8080))]):
                self.assertFalse(s.inveys_crypto._is_safe_proxy('http://evil-rebind.example:8080'))
            with patch('socket.getaddrinfo', return_value=[(2, 1, 6, '', ('93.184.216.34', 8080))]):
                self.assertTrue(s.inveys_crypto._is_safe_proxy('http://public-proxy.example:8080'))

            # High #8: Secure cookie when X-Forwarded-Proto: https, per-session CSRF enforced on POST, tight Origin
            st_r, h_r, res_r = self.request_full(
                '/api/auth/register',
                {'email': 'csrfuser@inveys.io', 'password': 'Password123!'},
                {**origin, 'X-Forwarded-Proto': 'https'}
            )
            self.assertEqual(st_r, 200)
            self.assertIn('Secure', h_r.get('Set-Cookie', ''))
            self.assertIn('HttpOnly', h_r.get('Set-Cookie', ''))
            self.assertNotIn('token', res_r)

            cookie_only = {'Origin': 'http://127.0.0.1:3000', 'Cookie': h_r.get('Set-Cookie', '').split(';', 1)[0]}
            # Missing CSRF -> 403, static s.TOKEN -> 403, per-session CSRF -> 200
            self.assertEqual(self.request('/api/workspace', {'workspace': {'id': 'w1'}}, cookie_only)[0], 403)
            self.assertEqual(self.request('/api/workspace', {'workspace': {'id': 'w1'}}, {**cookie_only, 'X-INVEYS-CSRF': s.TOKEN})[0], 403)
            self.assertEqual(self.request('/api/workspace', {'workspace': {'id': 'w1'}}, {**cookie_only, 'X-INVEYS-CSRF': res_r['csrf']})[0], 200)

            # Unauthenticated /api/status must NOT leak CSRF token
            st_st, res_st = self.request('/api/status', headers=origin)
            self.assertEqual(st_st, 200)
            self.assertEqual(res_st['csrf'], '')

            # Tight Origin rejects http://inveys.io, arbitrary localhost port, and Origin: null
            self.assertEqual(self.request('/api/status', headers={'Host': 'inveys.io', 'Origin': 'http://inveys.io'})[0], 403)
            self.assertEqual(self.request('/api/status', headers={'Host': '127.0.0.1:3000', 'Origin': 'http://localhost:9999'})[0], 403)
            self.assertEqual(self.request('/api/status', headers={'Host': '127.0.0.1:3000', 'Origin': 'null'})[0], 403)

            # High #9: Trusted proxy rightmost non-trusted XFF extraction + per-account rate limiting
            dummy = object.__new__(s.Handler)
            dummy.client_address = ('127.0.0.1', 54321)
            dummy.headers = {'X-Forwarded-For': '1.2.3.4, 203.0.113.55'}
            self.assertEqual(dummy.get_client_ip(), '203.0.113.55')
            dummy.client_address = ('198.51.100.9', 54321)
            self.assertEqual(dummy.get_client_ip(), '198.51.100.9')
            with patch.dict(os.environ, {'TRUSTED_PROXIES': '127.0.0.1/32,172.16.0.0/12'}):
                dummy.client_address = ('172.18.0.2', 54321)
                dummy.headers = {'X-Forwarded-For': '9.9.9.9, 198.51.100.42'}
                self.assertEqual(dummy.get_client_ip(), '198.51.100.42')

            # Per-account lockout across rotating IPs
            acct = 'victim-rate@inveys.io'
            s.clear_failed_login('10.1.1.1', acct)
            for idx in range(s.MAX_FAILED_ATTEMPTS):
                s.record_failed_login(f'198.51.100.{idx + 10}', acct)
            self.assertFalse(s.check_rate_limit('203.0.113.99', acct))
            s.clear_failed_login('203.0.113.99', acct)

            # Medium #10: OTP fails closed (503) when SMTP unconfigured & never notifies Telegram
            with patch.dict(os.environ, {'SMTP_HOST': '', 'INVEYS_DEV_LOG_OTP': '0'}), \
                 patch.object(s, 'notify_admin_telegram') as mock_tg:
                st_otp, _ = self.request('/api/auth/send-otp', {'email': 'csrfuser@inveys.io'}, origin)
                self.assertEqual(st_otp, 503)
                mock_tg.assert_not_called()

if __name__=='__main__':unittest.main()
