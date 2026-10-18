(function(root){
'use strict';const E=typeof module!=='undefined'&&module.exports?require('./engine'):root.InveysEngine;
const keys=['bg','paper','ink','muted','line','accent'];
const presets={
 forest:{light:['#f6f7f8','#ffffff','#23362f','#61716a','#e1e7e3','#244e3e'],dark:['#151b18','#202923','#eef3ef','#b0bdb4','#38473d','#90cfae']},
 charcoal:{light:['#f7f6f3','#ffffff','#302e29','#706b60','#e6e2da','#8c4f13'],dark:['#171817','#222420','#f0f2ed','#b0b7ae','#3c4138','#edaa57']},
 ocean:{light:['#f4f7fa','#ffffff','#243543','#5b6d7a','#dae4ed','#216394'],dark:['#141c24','#1e2a36','#edf4fa','#abbecd','#344858','#88bce8']},
 violet:{light:['#f7f5fa','#ffffff','#352b43','#72647f','#e6dfec','#70488e'],dark:['#1c1822','#292330','#f3eef8','#bdb1ca','#47394f','#c7a0e7']}
};
const colors=(mode,preset)=>Object.fromEntries(keys.map((k,i)=>[k,presets[preset][mode][i]]));
function luminance(hex){if(!/^#[a-f\d]{6}$/i.test(hex))throw Error('Use #RRGGBB colors');const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
function validateColors(c){if(!c||keys.some(k=>typeof c[k]!=='string'||!/^#[a-f\d]{6}$/i.test(c[k])))throw Error('Use #RRGGBB colors / Gunakan warna #RRGGBB');if(['bg','paper'].some(bg=>['ink','muted'].some(text=>contrast(c[text],c[bg])<4.5)))throw Error('Text contrast must be at least 4.5:1 / Kontras teks minimal 4,5:1');if(['bg','paper'].some(bg=>contrast(c.accent,c[bg])<4.5))throw Error('Accent contrast must be at least 4.5:1 / Kontras aksen minimal 4,5:1');return c;}
function validate(a){if(!a||['light','dark'].some(mode=>!a[mode]||!['custom',...Object.keys(presets)].includes(a[mode].preset)))throw Error('Invalid appearance');for(const mode of ['light','dark'])validateColors(a[mode].colors);return a;}
function migrate(s){if(s?.version===1)s.appearance??={light:{preset:'forest',colors:colors('light','forest')},dark:{preset:'charcoal',colors:colors('dark','charcoal')}};return s;}
function tokens(c){validateColors(c);const buttonText=contrast(c.accent,'#ffffff')>=contrast(c.accent,'#15221a')?'#ffffff':'#15221a';return {'--bg':c.bg,'--paper':c.paper,'--ink':c.ink,'--muted':c.muted,'--line':c.line,'--green':c.accent,'--accent':c.accent,'--accent-ink':buttonText,'--pale':c.paper,'--chart-accent':c.accent,'--chart-secondary':contrast(c.paper,'#78a9dc')>2?'#78a9dc':'#286699'};}
const oldMigrate=E.migrate,oldValidate=E.validate;E.migrate=s=>migrate(oldMigrate(s));E.validate=s=>{const next=migrate(oldValidate(s));validate(next.appearance);return next;};
const api={keys,presets,colors,contrast,validateColors,validate,tokens};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.InveysAppearance=api;
})(typeof window!=='undefined'?window:globalThis);
