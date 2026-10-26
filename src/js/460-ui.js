/* ---------------- UI ---------------- */
const $=id=>document.getElementById(id);
const kbd=$('kbd'), stopsEl=$('stops');
const WH=[0,2,4,5,7,9,11,12], BLK={1:0,3:1,6:3,8:4,10:5};
let KBN=0, KBL=null;
function buildKbdUI(n,lim){
  if(n===KBN&&lim===KBL&&kbd.childElementCount) return; KBN=n; KBL=lim; kbd.innerHTML='';
  const nat=[], wide=n>13; for(let k=0;k<n;k++) if([0,2,4,5,7,9,11].includes(k%12)) nat.push(k);
  kbd.classList.toggle('wide',wide); kbd.style.setProperty('--bkw',(wide?7.4*8/nat.length*0.95:7.4)+'%');
  const lab=k=>wide?(k%12===0?KEYNAMES[k]:''):KEYNAMES[k], off=k=>lim!=null&&k>=lim;
  nat.forEach(k=>{ const b=document.createElement('button'); b.className='wk'; b.dataset.k=k; b.setAttribute('aria-label','鍵 '+KEYNAMES[k]); b.innerHTML='<span>'+lab(k)+'</span>'; if(off(k)) b.disabled=true; kbd.appendChild(b); });
  for(let k=0;k<n;k++){ if(nat.includes(k)) continue; const ni=nat.filter(q=>q<k).length; const b=document.createElement('button'); b.className='bk'; b.dataset.k=k; b.setAttribute('aria-label','鍵 '+KEYNAMES[k]); b.style.left='calc('+(ni/nat.length*100)+'% - var(--bkw) / 2)'; b.innerHTML='<span>'+(wide?'':KEYNAMES[k])+'</span>'; if(off(k)) b.disabled=true; kbd.appendChild(b); }
  syncKeyUI();
}
// a model whose keyboard can be the pedal (pedKb) shows it in the pedalboard colours of H-03 while the pedal is selected
function syncKeyUI(){ kbd.classList.toggle('ped',!!(inst&&inst.pedKb&&inst.curMan&&inst.curMan()===0)); kbd.querySelectorAll('[data-k]').forEach(b=>b.classList.toggle('on',S.key[+b.dataset.k])); }
kbd.addEventListener('pointerdown',e=>{ const b=e.target.closest('[data-k]'); if(!b) return; e.preventDefault(); audioInit(); const k=+b.dataset.k; if(S.latch) S.key[k]=!S.key[k]; else { S.key[k]=true; try{ b.setPointerCapture(e.pointerId); }catch(_){} } syncKeyUI(); });
const kup=e=>{ if(S.latch) return; const b=e.target.closest('[data-k]'); if(!b) return; S.key[+b.dataset.k]=false; syncKeyUI(); };
kbd.addEventListener('pointerup',kup); kbd.addEventListener('pointercancel',kup);
kbd.addEventListener('keydown',e=>{ if(e.key===' '||e.key==='Enter'){ const b=e.target.closest('[data-k]'); if(b){ e.preventDefault(); audioInit(); const k=+b.dataset.k; S.key[k]=!S.key[k]; syncKeyUI(); } } });
const PCK='awsedftgyhujk';
window.addEventListener('keydown',e=>{ if(e.repeat||e.metaKey||e.ctrlKey||e.altKey||(inst&&inst.def.noKeys)) return; const tg=e.target; if(tg&&(tg.tagName==='INPUT'||tg.tagName==='SELECT'||tg.tagName==='TEXTAREA')) return; let k=PCK.indexOf(e.key.toLowerCase()); if(k<0) return; k+=inst&&inst.pcBase?inst.pcBase():0; audioInit(); if(inst.press){ inst.press(inst.curMan(),k,S.latch?'t':true); return; } if(S.latch) S.key[k]=!S.key[k]; else S.key[k]=true; syncKeyUI(); });
window.addEventListener('keyup',e=>{ if(S.latch) return; let k=PCK.indexOf((e.key||'').toLowerCase()); if(k<0) return; k+=inst&&inst.pcBase?inst.pcBase():0; if(inst.press){ inst.press(inst.curMan(),k,false); return; } S.key[k]=false; syncKeyUI(); });
window.addEventListener('blur',()=>{ if(!S.latch){ S.key.fill(false); syncKeyUI(); if(inst&&inst.releaseAll) inst.releaseAll(); } });
$('latch').addEventListener('click',e=>{ S.latch=!S.latch; e.currentTarget.setAttribute('aria-pressed',S.latch); });
$('release').addEventListener('click',()=>{ S.key.fill(false); syncKeyUI(); });

let STOPROWS=null;
// a stop button shows the stop's name only (the descriptive line under it was dropped)
function mkKnob(name,ja,on){ const b=document.createElement('button'); b.className='knob'; b.setAttribute('aria-pressed','false'); b.innerHTML='<b>'+name+'</b>'; b.addEventListener('click',()=>{ audioInit(); on(); syncStopUI(); }); return b; }
function renderStops(rows){
  STOPROWS=rows||null; stopsEl.innerHTML=''; stopsEl.classList.toggle('multi',!!rows);
  $('stopsLbl').innerHTML=T_('ストップ')+'<small>'+(rows?rows.map(r=>r.items.length).join(' + '):'5')+' stops</small>';
  if(!rows){ STOPSET.map(i=>STOPS[i]).forEach((st,i)=>{ const b=mkKnob(st.name,T_(st.ja),()=>{ S.stop[i]=!S.stop[i]; }); b.dataset.i=i; stopsEl.appendChild(b); }); return; }
  rows.forEach((r,g)=>{ const row=document.createElement('div'); row.className='srow'; row.innerHTML='<span class="slbl">'+T_(r.label)+'</span>'; r.items.forEach((it,j)=>{ const b=mkKnob(it.name,T_(it.ja),()=>it.set(!it.get())); b.dataset.g=g; b.dataset.j=j; row.appendChild(b); }); stopsEl.appendChild(row); });
}
renderStops(null);
function syncStopUI(){ stopsEl.querySelectorAll('.knob').forEach(b=>{ const on=b.dataset.i!=null?S.stop[+b.dataset.i]:!!STOPROWS[+b.dataset.g].items[+b.dataset.j].get(); b.setAttribute('aria-pressed',on); }); if(inst&&inst.syncConsole) inst.syncConsole(); }


function setXray(v){ S.xray=v; for(const m of XRAY){ m.transparent=v; m.opacity=v?0.22:1; m.depthWrite=!v; if(SOLID.has(m)) m.side=v?T.FrontSide:T.DoubleSide; m.needsUpdate=true; } $('xray').setAttribute('aria-pressed',v); }
$('xray').addEventListener('click',()=>setXray(!S.xray));
$('tPins').addEventListener('click',e=>{ SHOW.pins=!SHOW.pins; e.currentTarget.setAttribute('aria-pressed',SHOW.pins); pinsEl.hidden=!SHOW.pins; });
function setCut(v){ S.cut=v; const [mn,mx]=inst.def.clip; clipPlane.constant=v<=0.001?1e5:lerp(mx,mn,v); $('cut').value=Math.round(v*100); }
$('cut').addEventListener('input',e=>setCut(e.target.value/100));
function camTo(p,t){ camera.position.set(p[0],p[1],p[2]); controls.target.set(t[0],t[1],t[2]); controls.update(); }
/* overview: keep the model's chosen viewing direction, frame the whole model including the full-length pipes */
function camHome(){
  const c=inst.def.cam, dir=V3(c.p[0]-c.t[0],c.p[1]-c.t[1],c.p[2]-c.t[2]).normalize();
  const bx=new T.Box3().setFromObject(CX.root), sp=bx.getBoundingSphere(new T.Sphere());
  const vf=camera.fov*Math.PI/180, hf=2*Math.atan(Math.tan(vf/2)*camera.aspect), dist=sp.radius/Math.sin(Math.min(vf,hf)/2)*(inst.def.homeK||0.82);
  controls.target.copy(sp.center); camera.position.copy(sp.center).addScaledVector(dir,dist); controls.update();
}
$('camreset').addEventListener('click',()=>camHome());
$('sound').addEventListener('click',e=>{ AU.on=!AU.on; e.currentTarget.setAttribute('aria-pressed',AU.on); e.currentTarget.textContent=T_(AU.on?'音を出す':'音を消している'); if(AU.on) audioInit(); });

const api={
  keys(arr){ if(inst.setKeys){ inst.setKeys(arr); return; } S.key.fill(false); arr.forEach(k=>S.key[k]=true); syncKeyUI(); },
  stops(arr){ arr.forEach((v,i)=>S.stop[i]=!!v); syncStopUI(); },
  xray:setXray, cut:setCut, cam:camTo, home:()=>camHome(),
  ctl(id,v){ if(inst.ctl&&inst.ctl[id]) inst.ctl[id](v); renderControls(); }
};
window.__oa={api,S,get inst(){ return inst; },get inlets(){ return CX&&CX.inlets||[]; },load:id=>load(id),r:renderer,MAT};

const notes=$('notes'), sel=$('modelSelect'), list=$('indexList');
function renderIndex(cur){
  let h='', o='';
  for(const ch of INDEX){
    h+='<section class="chap"><h2><span class="cl">'+ch.c+'</span>'+T_(ch.n)+'</h2>';
    o+='<optgroup label="'+ch.c+' '+T_(ch.n)+'">';
    for(const [id,nm,st] of ch.items){
      const key=id.toLowerCase(), dev=DEV.has(key), live=!!MODELS[key]&&!dev;
      h+='<button class="item" data-id="'+key+'"'+(live?'':' disabled')+(key===cur?' aria-current="true"':'')+'><span class="id">'+id+'</span><span>'+T_(nm)+(live?'':'<span class="stg">'+(dev?T_('開発中'):TF('第{0}段階で公開',st))+'</span>')+'</span></button>';
      o+='<option value="'+key+'"'+(live?'':' disabled')+(key===cur?' selected':'')+'>'+id+' '+T_(nm)+(live?'':(dev?T_('（開発中）'):TF('（第{0}段階）',st)))+'</option>';
    }
    h+='</section>'; o+='</optgroup>';
  }
  list.innerHTML=h; sel.innerHTML=o;
}
list.addEventListener('click',e=>{ const b=e.target.closest('.item'); if(b&&!b.disabled) load(b.dataset.id); });
sel.addEventListener('change',()=>load(sel.value));

function renderNotes(def){
  const TL=['EN','DE','FR']; let h='<div class="nhead"><p class="nid">'+def.id+'</p><h2>'+T_(def.name)+'</h2><dl class="terms">'+def.terms.split(' · ').map((t,i)=>'<dt>'+TL[i]+'</dt><dd>'+t+'</dd>').join('')+'</dl></div><p>'+T_(def.summary)+'</p><h3>'+T_('手順（押すとモデルが動きます）')+'</h3><ol class="steps">';
  def.steps.forEach((s,i)=>{ h+='<li><button data-s="'+i+'"><span class="n">'+(i+1)+'</span><span>'+T_(s.t)+'</span></button></li>'; });
  h+='</ol><p class="foot">'+T_(def.foot||'標準構成：13鍵（C〜c）× 5ストップ。Gedackt 8′（木管）、Rohrflöte 4′、Prinzipal 2′、Mixtur III（1 1/3′・1′・2/3′）、Vox humana 8′。実物のパイプ長（C）：Gedackt 約110 cm、Rohrflöte 約56 cm＋煙突、Prinzipal 約59 cm、Mixtur 約39・30・20 cm、Vox humana 共鳴管 約31 cm。モデルでは長さ・太さとも45 %で表示。音はパレットが開きストップが入った瞬間に鳴る簡易合成です。')+'</p>';
  notes.innerHTML=h;
}
notes.addEventListener('click',e=>{ const b=e.target.closest('[data-s]'); if(!b) return; audioInit(); clearTimers(); notes.querySelectorAll('[data-s]').forEach(x=>x.removeAttribute('aria-current')); b.setAttribute('aria-current','true'); inst.def.steps[+b.dataset.s].run(api); });

function renderControls(){
  const row=$('mctlRow'), box_=$('mctl'); const cs=inst.controls||[]; row.hidden=!cs.length; box_.innerHTML='';
  cs.forEach(c=>{
    if(c.type==='range'){
      const w=document.createElement('label'); w.className='field rng'; w.htmlFor='rc_'+c.id;
      w.innerHTML='<span>'+T_(c.label)+'</span><input type="range" id="rc_'+c.id+'" min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="'+c.get()+'"><output></output>';
      const inp=w.querySelector('input'), out=w.querySelector('output'); const show=()=>{ out.textContent=c.fmt(); };
      inp.addEventListener('input',()=>{ c.set(parseFloat(inp.value)); show(); }); show(); box_.appendChild(w); return;
    }
    const b=document.createElement('button'); b.className='btn'; b.textContent=T_(c.label);
    if(c.type==='toggle'){ b.setAttribute('aria-pressed',!!c.get()); b.addEventListener('click',()=>{ audioInit(); c.set(!c.get()); b.setAttribute('aria-pressed',!!c.get()); }); }
    else { const up=()=>{ c.up(); b.setAttribute('aria-pressed','false'); }; b.setAttribute('aria-pressed','false'); b.addEventListener('pointerdown',e=>{ audioInit(); c.down(); b.setAttribute('aria-pressed','true'); try{ b.setPointerCapture(e.pointerId); }catch(_){} }); b.addEventListener('pointerup',up); b.addEventListener('pointercancel',up); b.addEventListener('keydown',e=>{ if(e.key===' '||e.key==='Enter'){ e.preventDefault(); c.down(); b.setAttribute('aria-pressed','true'); } }); b.addEventListener('keyup',e=>{ if(e.key===' '||e.key==='Enter') up(); }); }
    box_.appendChild(b);
  });
}

const pinsEl=$('pins'); let pinEls=[];
const LEGEND0=document.getElementById('legend').innerHTML;
const JPRE=/[\u3040-\u30ff\u4e00-\u9fff]/;
function i18nDom(root){ const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT); const ns=[]; while(w.nextNode()) ns.push(w.currentNode);
  for(const n of ns){ if(n.__ja==null){ if(!JPRE.test(n.nodeValue)) continue; n.__ja=n.nodeValue; } const t=n.__ja.trim(); const tr=T_(t); n.nodeValue=n.__ja.replace(t,tr); }
  root.querySelectorAll('[aria-label]').forEach(e=>{ if(e.__al==null){ const v=e.getAttribute('aria-label'); if(!JPRE.test(v)) return; e.__al=v; } e.setAttribute('aria-label',T_(e.__al)); }); }
function setupPins(){ pinsEl.innerHTML=''; pinEls=(inst.pins||[]).map(p=>{ const d=document.createElement('div'); d.className='pin'+(p.n?'':' plain'); d.innerHTML=(p.n?'<b>'+p.n+'</b>':'')+T_(p.t); pinsEl.appendChild(d); return {d,p:p.p,max:p.max}; }); }
const _pp=V3(0,0,0);
function pinsUpdate(){ if(!pinEls.length||!SHOW.pins) return; const w=wrap.clientWidth,h=wrap.clientHeight; for(const q of pinEls){ _pp.copy(q.p).project(camera); const vis=_pp.z<1&&Math.abs(_pp.x)<1.05&&Math.abs(_pp.y)<1.05&&(!q.max||camera.position.distanceTo(q.p)<q.max); q.d.hidden=!vis; if(vis){ q.d.style.left=((_pp.x+1)/2*w)+'px'; q.d.style.top=((1-_pp.y)/2*h)+'px'; } } }

const gwl=$('gwl'), gwr=$('gwr'), gv=$('gv'); let gLast=-1;
function gaugeUpdate(){ const p=Math.round(S.p); const d=clamp(S.p,0,110)*0.225; gwl.setAttribute('y',60+d); gwl.setAttribute('height',64-d); gwr.setAttribute('y',60-d); gwr.setAttribute('height',64+d); if(p!==gLast){ gv.textContent=p+' mm'; gLast=p; } }

/* hover labels */
const tip=$('tip'), ray=new T.Raycaster(), mv=new T.Vector2(); let hovEvt=null, hovQ=false;
canvas.addEventListener('pointermove',e=>{ hovEvt=e; if(!hovQ){ hovQ=true; requestAnimationFrame(doHover); } });
canvas.addEventListener('pointerleave',()=>{ tip.hidden=true; hovEvt=null; });
function pickAt(e){
  if(!CX) return null;
  const r=canvas.getBoundingClientRect(); mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1); ray.setFromCamera(mv,camera);
  for(const h of ray.intersectObject(CX.root,true)){
    const ob=h.object;
    if(h.point.x>clipPlane.constant) continue;
    if(ob.material&&ob.material.isShaderMaterial) continue;
    if(S.xray&&XRAY.includes(ob.material)) continue;
    if(ob.isInstancedMesh&&ob.userData.inst){ if(h.instanceId==null) continue; const q=ob.userData.inst[h.instanceId]; return {lab:q.label,key:q.ud.key,stop:q.ud.stop,man:q.ud.man,act:q.ud.act,r}; }
    if(ob.userData.ranges){ if(h.faceIndex==null) continue; const q=rangeAt(ob.userData.ranges,h.faceIndex); if(!q.lab&&q.ud.key==null&&!q.ud.act) continue; return {lab:q.lab,key:q.ud.key,stop:q.ud.stop,man:q.ud.man,act:q.ud.act,r}; }
    let o=ob; while(o&&!o.userData.label&&o.userData.key==null&&o.userData.stop==null&&!o.userData.act) o=o.parent;
    if(!o) continue;
    return {lab:o.userData.label,key:ob.userData.key,stop:ob.userData.stop,man:ob.userData.man,act:ob.userData.act,r};
  }
  return null;
}
function doHover(){
  hovQ=false; const e=hovEvt; if(!e||!CX) return; if(e.buttons){ tip.hidden=true; return; }
  const hit=pickAt(e);
  canvas.style.cursor=hit&&(hit.key!=null||hit.stop!=null||hit.act)?'pointer':'';
  if(!hit||!hit.lab){ tip.hidden=true; return; }
  const act=hit.act?TF(hit.act.get()?'クリックで {0} を切る':'クリックで {0} を入れる',hit.act.name):hit.key!=null?TF('クリックで鍵 {0} を押す',KEYNAMES[hit.key]):hit.stop!=null?TF(S.stop[hit.stop]?'クリックで {0} を切る':'クリックで {0} を入れる',STOPS[hit.stop].name):'';
  const L=hit.lab, OR=['ja','en','de','fr','nl'], hd=(LANG!=='ja'&&L[LANG])?LANG:'ja'; tip.innerHTML='<b>'+L[hd]+'</b><dl>'+OR.filter(q=>q!==hd&&L[q]).map(q=>'<dt>'+q.toUpperCase()+'</dt><dd>'+L[q]+'</dd>').join('')+'</dl>'+(act?'<em>'+act+'</em>':''); tip.hidden=false;
  const r=hit.r, x=e.clientX-r.left+14, y=e.clientY-r.top+14; tip.style.left=Math.min(x,r.width-tip.offsetWidth-8)+'px'; tip.style.top=Math.min(y,r.height-tip.offsetHeight-8)+'px';
}
/* clicking parts of the model: keys, levers, trackers, pallets play the key; stop knobs, sliders, stop bars toggle the stop */
let heldKey=-1;
canvas.addEventListener('pointerdown',e=>{
  if(e.button!==0) return;
  const hit=pickAt(e); if(!hit||(hit.key==null&&hit.stop==null&&!hit.act)) return;
  audioInit(); controls.enabled=false; tip.hidden=true;
  if(hit.key!=null&&inst.press){ const k=hit.key, mm=hit.man!=null?hit.man:inst.curMan(); if(S.latch) inst.press(mm,k,'t'); else { inst.press(mm,k,true); heldKey={mm,k}; } }
  else if(hit.key!=null){ const k=hit.key; if(hit.man!=null&&inst.setMan&&hit.man!==inst.curMan()) inst.setMan(hit.man); if(S.latch) S.key[k]=!S.key[k]; else { S.key[k]=true; heldKey=k; } syncKeyUI(); }
  else if(hit.act){ hit.act.fn(); syncStopUI(); tip.hidden=true; }
  else { S.stop[hit.stop]=!S.stop[hit.stop]; syncStopUI(); }
},true);
const releaseHeld=()=>{ if(heldKey&&heldKey.mm!=null){ if(inst.press) inst.press(heldKey.mm,heldKey.k,false); heldKey=-1; } if(heldKey>=0){ S.key[heldKey]=false; heldKey=-1; syncKeyUI(); } controls.enabled=true; };
window.addEventListener('pointerup',releaseHeld); window.addEventListener('pointercancel',releaseHeld);

