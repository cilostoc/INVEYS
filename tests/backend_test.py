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
        req = urllib.request.Request(self.url + '/app', headers={'Host': '127.0.0.1:3000'})
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
        segment_ids = [s['id'] for s in segs['segments']]
        self.assertIn('client', segment_ids)
        self.assertIn('backend', segment_ids)
        self.assertIn('vault', segment_ids)
        self.assertIn('pipeline', segment_ids)

        # 2. Reject POST /api/vps/update without CSRF or session
        status, err = self.request('/api/vps/update', {})
        self.assertEqual(status, 403)

        # 3. Successful POST /api/vps/update with CSRF
        headers = {'Origin': 'http://127.0.0.1:3000', 'X-INVEYS-CSRF': s.TOKEN}
        status, res = self.request('/api/vps/update', {}, headers)
        self.assertEqual(status, 200)
        self.assertTrue(res['ok'])
        self.assertEqual(res['version'], '0.23.0')
        self.assertEqual(len(res['updatedSegments']), 4)

    def test_api_keys_management_and_persistence(self):
        headers = {'Origin': 'http://127.0.0.1:3000', 'X-INVEYS-CSRF': s.TOKEN}

        # 1. GET /api/keys returns valid structure
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

        # 5. GET /api/keys?reveal=1 reveals raw key with valid CSRF/session
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
        # Valid loopback and HTTPS should pass
        self.assertEqual(s.validate_router_base('http://127.0.0.1:20128/v1'), 'http://127.0.0.1:20128/v1')
        self.assertEqual(s.validate_router_base('https://api.example.com/v1'), 'https://api.example.com/v1')

    def test_master_password_auth_protection_and_unauthorized_rejection(self):
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'auth_test.sqlite3'):
            headers_csrf = {'Origin': 'http://127.0.0.1:3000', 'X-INVEYS-CSRF': s.TOKEN}

            # 1. Setup master password
            status, setup_res = self.request('/api/auth/setup', {'password': 'TestPassword123'}, headers_csrf)
            self.assertEqual(status, 200)
            self.assertTrue(setup_res['ok'])
            token = setup_res['token']
            self.assertTrue(token)

            # 2. Configure a test API key with authenticated session
            headers_authed = {**headers_csrf, 'Authorization': f'Bearer {token}'}
            status, res = self.request('/api/keys', {'provider': 'gemini', 'action': 'save', 'apiKey': 'SecretKeyAuth123'}, headers_authed)
            self.assertEqual(status, 200)

            # 3. Unauthenticated request with CSRF only MUST NOT reveal secrets
            status, unauth_keys = self.request('/api/keys?reveal=1', headers=headers_csrf)
            self.assertEqual(status, 200)
            self.assertEqual(unauth_keys['gemini']['rawKey'], '')

            # 4. Authenticated request with token DOES reveal secrets
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
            headers_csrf = {'Origin': 'http://127.0.0.1:3000', 'X-INVEYS-CSRF': s.TOKEN}

            # 1. Validation checks on registration
            bad_email_st, _ = self.request('/api/auth/register', {'email': 'invalid-email', 'password': 'pass123'}, headers_csrf)
            self.assertEqual(bad_email_st, 400)
            short_pw_st, _ = self.request('/api/auth/register', {'email': 'user@example.com', 'password': '123'}, headers_csrf)
            self.assertEqual(short_pw_st, 400)

            # 2. Register User 1
            st1, res1 = self.request('/api/auth/register', {'email': 'hendra@inveys.io', 'password': 'PasswordHendra123', 'name': 'Hendra'}, headers_csrf)
            self.assertEqual(st1, 200)
            self.assertTrue(res1['ok'])
            token1 = res1['token']
            self.assertEqual(res1['user']['email'], 'hendra@inveys.io')
            self.assertEqual(res1['user']['name'], 'Hendra')

            # 3. Duplicate email registration rejected
            dup_st, dup_res = self.request('/api/auth/register', {'email': 'hendra@inveys.io', 'password': 'OtherPassword123'}, headers_csrf)
            self.assertEqual(dup_st, 400)

            # 4. Register User 2
            st2, res2 = self.request('/api/auth/register', {'email': 'partner@inveys.io', 'password': 'PasswordPartner123', 'name': 'Partner'}, headers_csrf)
            self.assertEqual(st2, 200)
            token2 = res2['token']

            # 5. User 1 logs in with email & password
            st_login, res_login = self.request('/api/auth/login', {'email': 'hendra@inveys.io', 'password': 'PasswordHendra123'}, headers_csrf)
            self.assertEqual(st_login, 200)
            self.assertTrue(res_login['token'])

            # 6. Tenant Isolation: User 1 writes their workspace
            headers_u1 = {**headers_csrf, 'Authorization': f'Bearer {token1}'}
            ws_u1_payload = {'workspace': {'id': 'ws_hendra', 'name': 'Hendra Vault', 'accounts': [{'id': 'a1', 'balance': 50000000}]}}
            st_ws1, _ = self.request('/api/workspace', ws_u1_payload, headers_u1)
            self.assertEqual(st_ws1, 200)

            # 7. User 2 writes their distinct workspace
            headers_u2 = {**headers_csrf, 'Authorization': f'Bearer {token2}'}
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
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'payment_test.sqlite3'):
            headers_csrf = {'Origin': 'http://127.0.0.1:3000', 'X-INVEYS-CSRF': s.TOKEN}

            # 1. Register a user
            _, res_user = self.request('/api/auth/register', {'email': 'buyer@inveys.io', 'password': 'PasswordBuyer123', 'name': 'Buyer'}, headers_csrf)
            token = res_user['token']
            user_headers = {**headers_csrf, 'Authorization': f'Bearer {token}'}

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

            # 4. Simulate payment settlement
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
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'lic_test.sqlite3'):
            headers_csrf = {'Origin': 'http://127.0.0.1:3000', 'X-INVEYS-CSRF': s.TOKEN}

            # 1. Register a user on default Plus plan
            _, res_user = self.request('/api/auth/register', {'email': 'subscriber@inveys.io', 'password': 'PasswordSub123', 'name': 'Sub'}, headers_csrf)
            token = res_user['token']
            user_headers = {**headers_csrf, 'Authorization': f'Bearer {token}'}

            # 2. Generate a valid Lifetime Ultra license key for this user
            valid_lic, _ = s.generate_license_key('usr_test', 'subscriber@inveys.io', 'ultra', expires_at=None)

            # 3. Activate valid license
            st_act, res_act = self.request('/api/license/activate', {'license_key': valid_lic}, user_headers)
            self.assertEqual(st_act, 200)
            self.assertTrue(res_act['ok'])
            self.assertEqual(res_act['plan'], 'ultra')
            self.assertTrue(res_act['isLifetime'])

            # 4. Reject invalid license key
            st_inv, res_inv = self.request('/api/license/activate', {'license_key': 'IV-INVALID-KEY'}, user_headers)
            self.assertEqual(st_inv, 400)

            # 5. Reject license issued for a different email
            foreign_lic, _ = s.generate_license_key('usr_other', 'other@inveys.io', 'ultra', expires_at=None)
            st_for, res_for = self.request('/api/license/activate', {'license_key': foreign_lic}, user_headers)
            self.assertEqual(st_for, 400)

    def test_midtrans_webhook_processing(self):
        with tempfile.TemporaryDirectory() as d, patch.object(s, 'DB', Path(d) / 'webhook_test.sqlite3'):
            headers_csrf = {'Origin': 'http://127.0.0.1:3000', 'X-INVEYS-CSRF': s.TOKEN}

            # 1. Create order
            st_ord, res_ord = self.request('/api/payment/create', {'email': 'webhook@inveys.io', 'name': 'Webhook User', 'plan': 'lifetime', 'cycle': 'lifetime'}, headers_csrf)
            self.assertEqual(st_ord, 200)
            order_id = res_ord['orderId']

            # 2. Trigger Midtrans webhook (settlement)
            webhook_payload = {
                'order_id': order_id,
                'status_code': '200',
                'gross_amount': str(res_ord['amount']),
                'transaction_status': 'settlement',
                'fraud_status': 'accept',
                'payment_type': 'qris'
            }
            st_wh, res_wh = self.request('/api/payment/webhook/midtrans', webhook_payload, headers_csrf)
            self.assertEqual(st_wh, 200)
            self.assertTrue(res_wh['ok'])

            # 3. Check order is paid
            st_check, res_check = self.request(f'/api/payment/order/{order_id}', headers=headers_csrf)
            self.assertEqual(st_check, 200)
            self.assertEqual(res_check['order']['status'], 'paid')
            self.assertEqual(res_check['order']['plan'], 'lifetime')
            self.assertTrue(res_check['order']['licenseKey'].startswith('IV-ULTRA-'))

if __name__=='__main__':unittest.main()
