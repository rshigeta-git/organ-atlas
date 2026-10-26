/* ---------------- audio ---------------- */
const AU={ctx:null,out:null,on:true,v:new Map(),waves:null};
function audioInit(){
  if(AU.ctx||!AU.on) return; const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
  try{ AU.ctx=new AC(); }catch(e){ return; }
  const comp=AU.ctx.createDynamicsCompressor(); AU.out=AU.ctx.createGain(); AU.out.gain.value=0.2; AU.sw=AU.ctx.createBiquadFilter(); AU.sw.type='lowpass'; AU.sw.frequency.value=16000; AU.sg=AU.ctx.createGain(); AU.out.connect(AU.sw); AU.sw.connect(AU.sg); AU.sg.connect(comp); AU.pin=AU.ctx.createGain(); AU.psw=AU.ctx.createBiquadFilter(); AU.psw.type='lowpass'; AU.psw.frequency.value=16000; AU.psg=AU.ctx.createGain(); AU.pin.connect(AU.psw); AU.psw.connect(AU.psg); AU.psg.connect(AU.out); comp.connect(AU.ctx.destination);
  const pw=h=>AU.ctx.createPeriodicWave(new Float32Array(h.length),new Float32Array(h));
  AU.waves=[pw([0,1,.02,.14,.01,.05]),pw([0,1,.3,.12,.06,.04]),pw([0,1,.55,.36,.24,.16,.1,.07,.05,.03]),pw([0,1,.25,.12,.05]),pw([0,.5,.85,.75,.62,.55,.48,.42,.34,.28,.22,.17,.12,.08]),pw([0,1,.5,.3,.2,.12,.08,.05,.03]),pw([0,1,.45,.25,.15,.08,.05]),pw([0,1,.35,.2,.1,.05]),pw([0,1,.55,.36,.24,.16,.1,.07,.05,.03]),pw([0,.6,.9,1,.95,.9,.82,.75,.68,.6,.52,.45,.38,.32,.26,.21,.17,.13,.1,.08]),pw([0,1,.12,.05,.02]),pw([0,1,.03,.22,.02,.08,.01,.03]),pw([0,.8,1,.95,.85,.75,.66,.58,.5,.43,.36,.3,.25,.2,.16,.12,.09]),pw([0,1,.3,.12,.06,.04]),pw([0,1,.15,.06,.03,.01]),pw([0,1,.3,.12,.05]),pw([0,1,.45,.25,.15,.08,.05]),pw([0,1,.15,.06,.03,.01]),pw([0,1,.3,.12,.05]),pw([0,1,.05,.6,.04,.4,.03,.25,.02,.15,.01,.08]),pw([0,1,.5,.3,.2,.12,.08,.05,.03]),pw([0,.6,.7,.6,.5,.42,.35,.28,.22,.17,.12,.08]),pw([0,.8,.8,.7,.62,.55,.48,.4,.33,.26,.2,.15,.1,.06]),pw([0,1,.35,.15,.06]),pw([0,1,.6,.42,.3,.22,.15,.1,.06]),pw([0,.8,.8,.7,.62,.55,.48,.4,.33,.26,.2,.15,.1,.06]),pw([0,.7,.75,.65,.55,.47,.4,.33,.27,.21,.16,.12,.08]),pw([0,.7,.75,.65,.55,.47,.4,.33,.27,.21,.16,.12,.08]),pw([0,1,.2,.08,.03]),pw([0,1,.25,.1,.04,.02]),pw([0,.8,.8,.7,.62,.55,.48,.4,.33,.26,.2,.15,.1,.06]),pw([0,.75,.78,.68,.58,.5,.42,.35,.28,.22,.17,.12,.08]),pw([0,1,.22,.09,.03]),pw([0,.5,.9,1,.85,.7,.6,.5,.42,.35,.28,.22,.17,.12,.08,.05])];
}
const GAINS=[.42,.3,.24,.09,.26,.3,.22,.12,.2,.4,.22,.5,.42,.32,.24,.1,.26,.24,.07,.3,.3,.14,.2,.18,.26,.2,.17,.15,.24,.3,.2,.15,.24,.28], MULT=[[1],[2],[4],[6,8,12],[1],[1],[2],[3],[4],[1],[4],[.5],[.5],[1],[2],[3,5],[2],[2],[16,24],[1],[1],[1],[1],[2],[1],[1],[1],[1.0023],[2],[1],[1],[1.0026],[2],[1]];
function audioSync(list){
  if(!AU.ctx) return; if(AU.ctx.state==='suspended') AU.ctx.resume().catch(()=>{});
  const now=AU.ctx.currentTime, seen=new Set(), nrm=inst&&inst.def.audioNorm?1/Math.sqrt(Math.max(1,list.length/inst.def.audioNorm)):1;
  if(AU.on) for(const e of list){
    const id=e.k*1000+e.i*10+e.r+(e.c||0)*100000; seen.add(id); let v=AU.v.get(id); const pp=e.p!=null?e.p:S.p, pf=Math.pow(Math.max(pp,1)/75,0.12), pg=clamp(pp/75,0,1.1);
    const fq=e.f||65.406*Math.pow(2,e.k/12)*MULT[e.i][e.r];
    if(!v){ const f=fq; const o=AU.ctx.createOscillator(); o.setPeriodicWave(AU.waves[e.i]); o.frequency.value=f*pf; const g=AU.ctx.createGain(); g.gain.value=0; o.connect(g); g.connect(e.sw&&AU.pin?AU.pin:AU.out); o.start(); v={o,g,f}; AU.v.set(id,v); }
    v.f=fq; v.g.gain.setTargetAtTime(GAINS[e.i]*pg*nrm,now,(e.i===4||e.i===9)?0.012:0.025); v.o.frequency.setTargetAtTime(v.f*pf,now,0.05);
  }
  for(const [id,v] of AU.v){ if(!seen.has(id)){ v.g.gain.setTargetAtTime(0,now,0.04); try{ v.o.stop(now+0.4); }catch(e){} AU.v.delete(id); } }
}

