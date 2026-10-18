const {test}=require('node:test');const assert=require('node:assert/strict');const P=require('../plans');
const catalog=()=>({previewTier:'ultra',prices:Object.fromEntries(P.catalog.map(p=>[p.id,{monthly:p.monthly,annual:p.annual}]))});
test('three preview tiers have cumulative features and bounded creation limits',()=>{
 assert.deepEqual(P.catalog.map(p=>p.id),['plus','pro','ultra']);
 assert.equal(P.allowed('plus','core'),true);assert.equal(P.allowed('plus','investment'),false);
 assert.equal(P.allowed('pro','montecarlo'),true);assert.equal(P.allowed('pro','integrations'),false);assert.equal(P.allowed('ultra','integrations'),true);assert.equal(P.allowed('unknown','core'),false);
});
test('annual quotes use explicit annual IDR amounts, not monthly totals or FX',()=>{
 const c=catalog();assert.equal(P.quote(c,'plus','annual').amount,490000);assert.equal(P.quote(c,'plus','monthly').amount,49000);
 assert.ok(Math.abs(P.quote(c,'plus','annual').saving-1/6)<1e-12);assert.equal(P.quote(c,'plus','annual').currency,'IDR');
 assert.throws(()=>P.quote(c,'ultra','weekly'),/Invalid/);
});
test('invalid prices and unknown plan cannot become commercial state',()=>{
 const c=catalog();assert.throws(()=>P.validate({...c,previewTier:'enterprise'}),/Invalid/);
 assert.throws(()=>P.validate({...c,prices:{...c.prices,plus:{monthly:0,annual:490000}}}),/Invalid/);
 assert.throws(()=>P.validate({...c,prices:{...c.prices,plus:{monthly:49.5,annual:490000}}}),/Invalid/);
});
