const {test}=require('node:test');const assert=require('node:assert/strict');const A=require('../appearance');
test('all theme presets provide readable surfaces and accent colors',()=>{
 for(const preset of Object.keys(A.presets))for(const mode of ['light','dark']){
  const colors=A.colors(mode,preset);A.validateColors(colors);const tokens=A.tokens(colors);
  assert.ok(A.contrast(tokens['--accent'],tokens['--accent-ink'])>=4.5);
  assert.ok(A.contrast(colors.ink,colors.paper)>=4.5);assert.ok(A.contrast(colors.muted,colors.bg)>=4.5);
 }
});
test('custom colors reject unreadable text and CSS injection without changing input',()=>{
 const c=A.colors('dark','charcoal'),before=JSON.stringify(c);
 assert.throws(()=>A.validateColors({...c,ink:c.paper}),/contrast/);
 assert.throws(()=>A.validateColors({...c,accent:c.paper}),/contrast/);
 assert.throws(()=>A.validateColors({...c,bg:'red;display:none'}),/#RRGGBB/);
 assert.equal(JSON.stringify(c),before);
});
test('palette instances and light/dark colors remain independent',()=>{
 const light=A.colors('light','ocean'),dark=A.colors('dark','ocean');light.bg='#ffffff';
 assert.notEqual(A.colors('light','ocean').bg,'#ffffff');assert.notEqual(dark.bg,light.bg);
});
