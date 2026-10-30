(function(root){
'use strict';const E=typeof module!=='undefined'&&module.exports?require('./engine'):root.InveysEngine;
const providers=['local','openai','gemini','claude','openrouter','muse','9router'];
function migrate(s){if(s?.version===1)s.assistant??={provider:'local',mode:'auto',consent:false,shareFinancial:false,useMemory:false,memory:[],history:[]};return s;}
function validate(a){if(!a||!providers.includes(a.provider)||!['auto','ask','record'].includes(a.mode)||['consent','shareFinancial','useMemory'].some(k=>typeof a[k]!=='boolean')||!Array.isArray(a.memory)||a.memory.length>50||a.memory.some(t=>typeof t!=='string'||!t.trim()||t.length>300)||new Set(a.memory).size!==a.memory.length||!Array.isArray(a.history)||a.history.length>60)throw Error('Invalid assistant configuration');for(const m of a.history)if(!m||!['user','assistant'].includes(m.role)||!providers.includes(m.provider)||typeof m.text!=='string'||m.text.length>6000||typeof m.scope!=='string'||m.scope.length>100||!E.validDate(m.date))throw Error('Invalid assistant history');return a;}
function memory(text){const rows=String(text||'').split('\n').map(t=>t.trim()).filter(Boolean);if(rows.length>50||rows.some(t=>t.length>300))throw Error('Use up to 50 preferences, 300 characters each');return [...new Set(rows)];}
const scope=s=>s.activeView.owner+'|'+s.activeView.includeShared;
function history(s){return s.assistant.history.filter(m=>m.scope===scope(s));}
function append(s,role,text,provider,today){const row={role,text:String(text).slice(0,6000),provider,scope:scope(s),date:today};const candidate={...s.assistant,history:[...s.assistant.history,row].slice(-60)};validate(candidate);s.assistant=candidate;return row;}
const oldMigrate=E.migrate,oldValidate=E.validate;E.migrate=s=>migrate(oldMigrate(s));E.validate=s=>{const next=migrate(oldValidate(s));validate(next.assistant);return next;};const api={providers,migrate,validate,memory,scope,history,append};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.InveysAssistant=api;
})(typeof window!=='undefined'?window:globalThis);
