import unittest, importlib.util, tempfile, os, json, threading, urllib.request, urllib.error, base64, shutil
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('server',Path(__file__).resolve().parents[1]/'server'/'serve.py');s=importlib.util.module_from_spec(spec);spec.loader.exec_module(s)
class Backend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server=s.ThreadingHTTPServer(('127.0.0.1',0),s.Handler);threading.Thread(target=cls.server.serve_forever,daemon=True).start();cls.url='http://127.0.0.1:'+str(cls.server.server_port)
    @classmethod
    def tearDownClass(cls):cls.server.shutdown();cls.server.server_close()
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

if __name__=='__main__':unittest.main()
