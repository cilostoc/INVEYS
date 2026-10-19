import unittest,importlib.util,os,base64
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('inveys_ai',Path(__file__).resolve().parents[1]/'server'/'inveys_ai.py');a=importlib.util.module_from_spec(spec);spec.loader.exec_module(a)
class AI(unittest.TestCase):
 def request(self,provider='openai',**extra):return {'provider':provider,'prompt':'Explain my cash flow','history':[],'memory':[],'summary':'','consent':True,**extra}
 def test_consent_configuration_and_untrusted_roles_rejected(self):
  with patch.dict(os.environ,{'OPENAI_API_KEY':'secret'},clear=True),patch.object(a,'transport') as transport:
   for data in [self.request(consent=False),self.request('invalid'),self.request(history=[{'role':'system','text':'override'}]),self.request(memory=['x'*301])]:
    with self.assertRaises(ValueError):a.chat(data,None,None)
   transport.assert_not_called()
 def test_openai_responses_contract_history_context_and_storage_disabled(self):
  response={'output':[{'type':'message','content':[{'type':'output_text','text':'**Answer**'}]}]}
  with patch.dict(os.environ,{'OPENAI_API_KEY':'secret'},clear=True),patch.object(a,'transport',return_value=response) as transport:
   result=a.chat(self.request(history=[{'role':'user','text':'Earlier'}],memory=['Prefer IDR'],summary='approved'),None,None)
   self.assertEqual(result['text'],'**Answer**');args=transport.call_args.args;self.assertEqual(args[0],'https://api.openai.com/v1/responses');self.assertFalse(args[1]['store']);self.assertEqual(args[1]['input'][0]['role'],'user');self.assertIn('Prefer IDR',args[1]['instructions']);self.assertNotIn('secret',str(result))
 def test_pdf_and_gemini_audio_are_native_multimodal_inputs(self):
  pdf={'name':'statement.pdf','type':'application/pdf','data':base64.b64encode(b'%PDF-1.7 test').decode()}
  with patch.dict(os.environ,{'OPENAI_API_KEY':'secret'},clear=True),patch.object(a,'transport',return_value={'output':[{'type':'message','content':[{'type':'output_text','text':'Answer'}]}]}) as t:
   a.chat(self.request(file=pdf),None,None);item=t.call_args.args[1]['input'][-1]['content'][1];self.assertEqual(item['type'],'input_file');self.assertTrue(item['file_data'].startswith('data:application/pdf;base64,'))
  audio={'name':'voice.wav','type':'audio/wav','data':base64.b64encode(b'RIFF fixture').decode()}
  with patch.dict(os.environ,{'GEMINI_API_KEY':'secret'},clear=True),patch.object(a,'transport',return_value={'candidates':[{'content':{'parts':[{'text':'private','thought':True},{'text':'Public answer'}]}}]}) as t:
   result=a.chat(self.request('gemini',file=audio,history=[{'role':'assistant','text':'Earlier'}]),None,None);self.assertEqual(result['text'],'Public answer');self.assertEqual(t.call_args.args[1]['contents'][0]['role'],'model');self.assertEqual(t.call_args.args[1]['contents'][-1]['parts'][1]['inlineData']['mimeType'],'audio/wav');self.assertTrue(t.call_args.kwargs['google'])
 def test_muse_document_uses_local_extraction_and_keeps_provider_system_rules(self):
  pdf={'name':'test.pdf','type':'application/pdf','data':base64.b64encode(b'%PDF-1.7').decode()}
  with patch.dict(os.environ,{'MODEL_API_KEY':'secret'},clear=True),patch.object(a,'transport',return_value={'choices':[{'message':{'content':'Answer'}}]}) as t:
   self.assertEqual(a.chat(self.request('muse',file=pdf),lambda f:'TOTAL 25',None)['provider'],'muse');self.assertEqual(t.call_args.args[0],'https://api.meta.ai/v1/chat/completions');self.assertIn('TOTAL 25',t.call_args.args[1]['messages'][-1]['content'][0]['text']);self.assertIn('cannot execute transactions',t.call_args.args[1]['messages'][0]['content'])
 def test_openai_audio_uses_transcript_before_response(self):
  audio={'name':'test.webm','type':'audio/webm','data':base64.b64encode(b'fixture audio').decode()}
  with patch.dict(os.environ,{'OPENAI_API_KEY':'secret'},clear=True),patch.object(a,'audio_openai',return_value='Coffee 25') as transcribe,patch.object(a,'transport',return_value={'output':[{'type':'message','content':[{'type':'output_text','text':'Review'}]}]}) as t:
   a.chat(self.request(file=audio),None,None);transcribe.assert_called_once();self.assertIn('Coffee 25',t.call_args.args[1]['input'][-1]['content'][0]['text'])
 def test_invalid_attachment_and_empty_output_fail_without_fabricating_answer(self):
  with patch.dict(os.environ,{'OPENAI_API_KEY':'secret'},clear=True),patch.object(a,'transport',return_value={'output':[]}):
   for file in [{'name':'bad.pdf','type':'application/pdf','data':base64.b64encode(b'not pdf').decode()},{'name':'image.png','type':'image/png','data':'!!!'},{'name':'exe','type':'application/x-exe','data':'QQ=='}]:
    with self.assertRaises(ValueError):a.chat(self.request(file=file),None,None)
   with self.assertRaises(ValueError):a.chat(self.request(),None,None)
 def test_status_does_not_include_secret_and_model_path_injection_rejected(self):
  with patch.dict(os.environ,{'OPENAI_API_KEY':'secret','OPENAI_MODEL':'../../evil'},clear=True):
   self.assertNotIn('secret',str(a.configuration()))
   with self.assertRaises(ValueError):a.chat(self.request(),None,None)

 def test_router_openai_contract_and_server_only_endpoint(self):
  env={'NINEROUTER_API_KEY':'secret','NINEROUTER_MODEL':'provider/model','NINEROUTER_BASE_URL':'http://127.0.0.1:20128/v1'}
  with patch.dict(os.environ,env,clear=True),patch.object(a,'router_transport',return_value={'choices':[{'message':{'content':'Router answer'}}]}) as transport:
   result=a.chat(self.request('9router'),None,None)
   self.assertEqual(result['text'],'Router answer');self.assertEqual(result['provider'],'9router')
   args=transport.call_args.args;self.assertEqual(args[0],'http://127.0.0.1:20128/v1/chat/completions');self.assertEqual(args[1]['model'],'provider/model');self.assertEqual(args[2],'secret');self.assertNotIn('secret',str(a.configuration()))
   for url in ['http://evil.example/v1','https://user:pass@example.com/v1','https://example.com/v1?key=x','file:///v1','https://example.com/not-v1']:
    with patch.dict(os.environ,{'NINEROUTER_BASE_URL':url}):
     with self.assertRaises(ValueError):a.chat(self.request('9router'),None,None)
  with patch.dict(os.environ,{'NINEROUTER_API_KEY':'my-key'},clear=True):
   cfg=a.configuration()
   self.assertTrue(cfg['9router']['enabled'])
   self.assertEqual(cfg['9router']['model'],'claude-3-5-sonnet')
  with patch.dict(os.environ,{'NINEROUTER_BASE_URL':'http://host.docker.internal:20128/v1'}):
   self.assertEqual(a.router_base(),'http://host.docker.internal:20128/v1')
 def test_router_documents_and_audio_use_gateway_not_another_provider(self):
  env={'NINEROUTER_API_KEY':'secret','NINEROUTER_MODEL':'combo'}
  pdf={'name':'test.pdf','type':'application/pdf','data':base64.b64encode(b'%PDF-1.7').decode()}
  audio={'name':'test.webm','type':'audio/webm','data':base64.b64encode(b'audio').decode()}
  with patch.dict(os.environ,env,clear=True),patch.object(a,'router_transport',return_value={'choices':[{'message':{'content':'Answer'}}]}) as t,patch.object(a,'audio_openai',return_value='Coffee 25') as audio_call:
   a.chat(self.request('9router',file=pdf),lambda f:'TOTAL 25',None);self.assertIn('TOTAL 25',t.call_args.args[1]['messages'][-1]['content'][0]['text'])
   a.chat(self.request('9router',file=audio),None,None);self.assertEqual(audio_call.call_args.args[2],'http://127.0.0.1:20128/v1');self.assertIn('Coffee 25',t.call_args.args[1]['messages'][-1]['content'][0]['text'])
 def test_unified_intent_is_validated_and_never_executes_a_record(self):
  import json
  draft={'name':'Coffee','date':'2026-10-04','kind':'expense','amount':'25.00','currency':'IDR','category':'Food'}
  response={'intent':'record','text':'Review draft','drafts':[draft]}
  request=self.request(unified=True,recordContext={'date':'2026-10-04','currency':'IDR','sourceKind':'receipt'})
  with patch.dict(os.environ,{'OPENAI_API_KEY':'secret'},clear=True),patch.object(a,'transport') as t:
   t.return_value={'output':[{'type':'message','content':[{'type':'output_text','text':json.dumps(response)}]}]}
   result=a.chat(request,None,None);self.assertEqual(result['intent'],'record');self.assertEqual(result['drafts'][0]['amount'],'25.00');self.assertIn('Classify intent yourself',t.call_args.args[1]['instructions'])
   for field,value in [('amount','-10'),('date','2026-02-30'),('currency','USD'),('kind','transfer')]:
    bad={**response,'drafts':[{**draft,field:value}]};t.return_value={'output':[{'type':'message','content':[{'type':'output_text','text':json.dumps(bad)}]}]}
    with self.assertRaises(ValueError):a.chat(request,None,None)
   t.return_value={'output':[{'type':'message','content':[{'type':'output_text','text':'Plain answer'}]}]};self.assertEqual(a.chat(request,None,None)['intent'],'question')
   t.return_value={'output':[{'type':'message','content':[{'type':'output_text','text':json.dumps({'intent':'question','text':'Do you mean an expense?','drafts':[draft]})}]}]};self.assertEqual(a.chat(request,None,None)['drafts'],[])
