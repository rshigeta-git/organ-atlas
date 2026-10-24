/* ---------------- loop ---------------- */
let last=performance.now();
function frame(now){
  requestAnimationFrame(frame);
  const rdt=Math.min(0.05,Math.max(0,(now-last)/1000)); last=now; const dt=rdt; S.time+=dt;
  for(let k=0;k<64;k++){ const tg=S.key[k]?1:0; S.kd[k]+=(tg-S.kd[k])*Math.min(1,dt*22); }
  for(let i=0;i<5;i++){ const tg=S.stop[i]?1:0; S.sp[i]+=clamp(tg-S.sp[i],-dt*2.5,dt*2.5); }
  if(!inst.def.own) S.p=75;
  inst.update(dt); if(CX.pool) CX.pool.flush();
  for(const f of flows) f.update(dt);
  CX.keyMats.forEach((m,k)=>{ if(m) m.emissive.copy(COL.key).multiplyScalar(0.6*S.kd[k]); });
  CX.stopMats.forEach((m,i)=>{ if(m) m.emissive.copy(COL.stop).multiplyScalar(0.5*S.sp[i]); });
  if(AU.ctx&&AU.sw){ const o=inst.swell?inst.swell():1, tn=AU.ctx.currentTime; AU.sw.frequency.setTargetAtTime(450+15500*o*o,tn,0.05); AU.sg.gain.setTargetAtTime(0.28+0.72*o,tn,0.05); }
  if(AU.ctx&&AU.psw){ const o=inst.swell2?inst.swell2():1, tn=AU.ctx.currentTime; AU.psw.frequency.setTargetAtTime(600+15400*o*o,tn,0.05); AU.psg.gain.setTargetAtTime(0.3+0.7*o,tn,0.05); }
  writeParticles(); audioSync(inst.speaking?inst.speaking():inst.chest?inst.chest.speaking():[]); gaugeUpdate(); pinsUpdate();
  controls.update(); renderer.render(scene,camera);
}
const start=(location.hash||'').replace('#','').toLowerCase();
const langSel=$('langSel'); langSel.value=LANG;
function applyLang(){
  document.documentElement.lang=LANG; i18nDom(document.body);
  if(!inst) return; const def=inst.def;
  $('mctlLabel').textContent=T_(def.noKeys?'操作':'送風'); $('legend').innerHTML=def.legend==='ctrl'?LEGEND0+CTRL_LEG:def.legend==='elec'?LEGEND0+ELEC_LEG:(def.legend||LEGEND0); i18nDom($('legend'));
  $('tag').innerHTML='<span class="tid">'+def.id+'</span><span class="tnm">'+T_(def.name)+'</span>';
  const cur=notes.querySelector('[data-s][aria-current]'), ci=cur?cur.dataset.s:null;
  renderStops(inst.stopRows); renderNotes(def); renderControls(); renderIndex(curId); if(def.console&&inst.buildConsole) inst.buildConsole($('ocon')); syncStopUI(); setupPins();
  if(ci!=null){ const b=notes.querySelector('[data-s="'+ci+'"]'); if(b) b.setAttribute('aria-current','true'); }
  const sb=$('sound'); sb.textContent=T_(AU.on?'音を出す':'音を消している');
}
langSel.addEventListener('change',()=>{ LANG=langSel.value; try{ localStorage.setItem('oa-lang',LANG); }catch(e){} applyLang(); });
load(MODELS[start]&&!DEV.has(start)?start:'a-01');
applyLang();
requestAnimationFrame(frame);
window.addEventListener('hashchange',()=>{ const h=location.hash.replace('#','').toLowerCase(); if(MODELS[h]&&!DEV.has(h)&&h!==curId) load(h); });
})();
