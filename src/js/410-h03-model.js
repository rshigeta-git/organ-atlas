/* ---------- H-03 model ---------- */
function buildH03(){
  const B=h3Core(); B.MK=[...Array(B.NM).keys()];
  const Sx=h3Stops(B), W=h3Wind(B), ZM=h3Zimbel(W.ZO,B.ST), SW=h3Swell(B);
  h3Case(B);
  mergeStatic(B.ST); CX.pool.finish();
  const {m,ped,lo,up,rbH,rbP,rbA,rbHC,rbPC,cPH,cHP,cPP,TH,TP,KDH,KDP,KDD,SPH,SPP,SPD,hw,pos,tc,td,NM,NP,DIP,Y0,ZH,ZX,KL,DEP,ZAA,ZHC,ZPC,yK,KHp,pullU,pullL,dzU,dzL,aiH,aiP,acH,acP,aiA,aoA,aiC,aoHC,aoPC,hmat,pmat,dmat}=B;
  let swT=0.25, swV=0.25;
  const thMax=0.34, pAH=new Float32Array(NP), pAP=new Float32Array(NP), toH=[], toP=[];
  /* key state per keyboard: 0 pedal, 1 Positiv (I), 2 Hauptwerk (II) */
  const NK=[NP,NM,NM], KS=[0,1,2].map(i=>new Array(NK[i]).fill(false)), KV=[0,1,2].map(()=>new Float32Array(64));
  let conEl=null;
  const syncKeys=()=>{ if(!conEl) return; conEl.querySelectorAll('[data-km]').forEach(b=>b.classList.toggle('on',!!KS[+b.dataset.km][+b.dataset.k])); };
  const press=(mn,k,v)=>{ if(k<0||k>=NK[mn]) return; KS[mn][k]=v==='t'?!KS[mn][k]:!!v; if(v) m.man=mn; syncKeys(); };
  const releaseAll=()=>{ KS.forEach(a=>a.fill(false)); syncKeys(); };
  const hlM=(mat,hm,a)=>{ mat.emissive.copy(COL.key).multiplyScalar(0.6*Math.min(1,a)); if(hm) hm.emissive.copy(COL.key).multiplyScalar(0.35*Math.min(1,a)); };
  const stopRows=[{label:'P ペダル',items:Sx.ped.map((it,i)=>({name:it.name,ja:STOPS[tc.rows[i].si].ja,get:()=>it.on,set:v=>it.on=v}))},
    {label:'II ハウプトヴェルク（上鍵盤）',items:Sx.hw.map((it,i)=>({name:it.name,ja:STOPS[hw.rows[i].si].ja,get:()=>it.on,set:v=>it.on=v}))},
    {label:'I ポジティフ（下鍵盤）',items:Sx.pos.map((it,i)=>({name:it.name,ja:STOPS[pos.rows[i].si].ja,get:()=>it.on,set:v=>it.on=v}))},
    {label:'カプラー・補助装置',items:[[Sx.cPH,'ポジティフをハウプトヴェルクの鍵盤で鳴らす'],[Sx.cHP,'ハウプトヴェルクをペダルで鳴らす'],[Sx.cPP,'ポジティフをペダルで鳴らす'],[Sx.trem,'手鍵盤の風を揺らす'],[Sx.zimb,'星が回り鈴が鳴る']].map(([it,ja])=>({name:it.name,ja,get:()=>it.on,set:v=>it.on=v}))}];
  /* console panel under the model: drawknobs by division, two manuals, pedalboard */
  const knobTxt=n=>{ const mm=n.match(/^(.*?)\s+((?:\d+\s)?[\d\/]+′|III)$/); return mm?'<b>'+mm[1]+'</b><i>'+mm[2]+'</i>':'<b>'+(n==='Zimbelstern'?'Zimbel-<br>stern':n==='Tremulant'?'Tremu-<br>lant':n)+'</b>'; };
  const kn=it=>({name:it.name,ja:'',get:()=>it.on,set:v=>it.on=v});
  const GR=[[['Positiv',Sx.pos.map(kn)],['Hauptwerk',Sx.hw.map(kn)]],[['Pedal',Sx.ped.map(kn)],['Coupler',[Sx.cPH,Sx.cHP,Sx.cPP].map(kn)],['Accessories',[Sx.trem,Sx.zimb].map(kn),true]]];
  let swIn=null;
  const buildConsole=el=>{
    conEl=el; el.innerHTML='';
    const top=document.createElement('div'); top.className='oc-stops';
    GR.forEach(rowG=>{ const row=document.createElement('div'); row.className='oc-srow';
      rowG.forEach(([lab,items,acc])=>{ const g=document.createElement('div'); g.className='oc-grp'; g.innerHTML='<h4>'+lab+'</h4>'; const ks=document.createElement('div'); ks.className='oc-knobs';
        items.forEach(it=>{ const b=document.createElement('button'); b.className='dk'; b.type='button'; b.innerHTML=knobTxt(it.name); b.title=it.name; b.setAttribute('aria-label',it.name); b.setAttribute('aria-pressed',!!it.get());
          b.addEventListener('click',()=>{ audioInit(); it.set(!it.get()); syncStopUI(); }); b._it=it; ks.appendChild(b); });
        if(acc){ const w=document.createElement('label'); w.className='oc-swell'; w.innerHTML='<span>Swell (Pos)</span><input type="range" min="0" max="100" step="1">'; swIn=w.querySelector('input'); swIn.value=Math.round(swT*100); swIn.addEventListener('input',()=>{ swT=swIn.value/100; }); ks.appendChild(w); }
        g.appendChild(ks); row.appendChild(g); });
      top.appendChild(row); });
    el.appendChild(top);
    const mkKb=(mn,lab,cls)=>{ const row=document.createElement('div'); row.className='oc-row '+cls; row.innerHTML='<span class="oc-lbl">'+lab+'</span>';
      const kb=document.createElement('div'); kb.className='oc-kb'+(mn===0?' ped':''); const n=NK[mn], nat=[]; for(let k=0;k<n;k++) if(isNat(k)) nat.push(k);
      nat.forEach(k=>{ const b=document.createElement('button'); b.className='wk'; b.type='button'; b.dataset.km=mn; b.dataset.k=k; b.setAttribute('aria-label',KEYNAMES[k]); b.innerHTML='<span>'+(k%12===0?KEYNAMES[k]:'')+'</span>'; kb.appendChild(b); });
      for(let k=0;k<n;k++){ if(isNat(k)) continue; const ni=nat.filter(q=>q<k).length, b=document.createElement('button'); b.className='bk'; b.type='button'; b.dataset.km=mn; b.dataset.k=k; b.setAttribute('aria-label',KEYNAMES[k]); b.style.left='calc('+(ni/nat.length*100)+'% - var(--bkw) / 2)'; kb.appendChild(b); }
      kb.style.setProperty('--bkw',(100/nat.length*(mn===0?0.62:0.6))+'%');
      kb.addEventListener('pointerdown',e=>{ const b=e.target.closest('[data-km]'); if(!b) return; e.preventDefault(); audioInit(); const k=+b.dataset.k; if(S.latch) press(mn,k,'t'); else { press(mn,k,true); try{ b.setPointerCapture(e.pointerId); }catch(_){} } });
      const up_=e=>{ if(S.latch) return; const b=e.target.closest('[data-km]'); if(b) press(mn,+b.dataset.k,false); };
      kb.addEventListener('pointerup',up_); kb.addEventListener('pointercancel',up_);
      row.appendChild(kb); el.appendChild(row); };
    mkKb(2,'Hauptwerk (II)','man2'); mkKb(1,'Positiv (I)','man1'); mkKb(0,'Pedal','pedal');
    const tl=document.createElement('div'); tl.className='oc-tools';
    const lb=document.createElement('button'); lb.className='btn'; lb.type='button'; lb.textContent=T_('押したまま保持'); lb.setAttribute('aria-pressed',S.latch); lb.addEventListener('click',()=>{ $('latch').click(); lb.setAttribute('aria-pressed',S.latch); });
    const rb=document.createElement('button'); rb.className='btn'; rb.type='button'; rb.textContent=T_('全部離す'); rb.addEventListener('click',releaseAll);
    tl.append(lb,rb); el.appendChild(tl);
    syncKeys();
  };
  const syncConsole=()=>{ if(!conEl) return; conEl.querySelectorAll('.dk').forEach(b=>b.setAttribute('aria-pressed',!!b._it.get())); };
  const allSpeak=()=>hw.speaking().concat(pos.speaking(),tc.speaking(),td.speaking());
  const setArr=(a,arr)=>arr.forEach((v,i)=>{ if(a[i]) a[i].on=!!v; });
  return {stopRows,press,releaseAll,buildConsole,syncConsole,curMan:()=>m.man,pcBase:()=>m.man===0?0:24,
    setKeys:arr=>{ KS.forEach(a=>a.fill(false)); arr.forEach(k=>{ if(k<NK[m.man]) KS[m.man][k]=true; }); syncKeys(); },
    controls:[{type:'toggle',id:'blower',label:'送風機',get:()=>W.mag.blower,set:v=>W.mag.blower=v}],swell2:()=>swV,
    ctl:{man:v=>{ m.man=v; },hw:a=>{ setArr(Sx.hw,a); syncStopUI(); },pos:a=>{ setArr(Sx.pos,a); syncStopUI(); },ped:a=>{ setArr(Sx.ped,a); syncStopUI(); },
      cpl:a=>{ setArr([Sx.cPH,Sx.cHP,Sx.cPP],a); syncStopUI(); },trem:v=>{ Sx.trem.on=!!v; syncStopUI(); },zimb:v=>{ Sx.zimb.on=!!v; syncStopUI(); },blower:v=>W.mag.blower=v,swell:v=>{ swT=v; if(swIn) swIn.value=Math.round(v*100); },
      empty:()=>{ W.mag.h=0; }},
    B,
    pins:[{t:'ハウプトヴェルク（II）',p:V3(-150,470,40)},{t:'ポジティフ（I）',p:V3(-150,250,0)},{t:'ペダル塔（C側）',p:V3(-470,720,-40)},{t:'ペダル塔（Cis側）',p:V3(470,720,-40)},
      {t:'演奏台',p:V3(-70,130,50)},{t:'ローラーボード',p:V3(-200,350,20),max:900},{t:'ペダルカプラー（Hw/P・Pos/P）',p:V3(-150,90,0),max:700},{t:'送風機とマガジンふいご',p:V3(-200,160,-470)},{t:'スウェルボックス',p:V3(-150,330,0),max:900},{t:'トレムラント',p:V3(40,140,-157),max:700},{t:'ツィンベルシュテルン',p:V3(0,680,30),max:900}],
    speaking:allSpeak,
    update(dt){
      for(let i=0;i<3;i++) for(let k=0;k<NK[i];k++){ const tg=KS[i][k]?1:0; KV[i][k]+=(tg-KV[i][k])*Math.min(1,dt*22); }
      for(const it of B.KN){ it.v+=clamp((it.on?1:0)-it.v,-dt*2.5,dt*2.5); }
      Sx.hw.forEach((it,i)=>SPH[i]=it.v); Sx.pos.forEach((it,i)=>SPP[i]=it.v); Sx.ped.forEach((it,i)=>SPD[i]=it.v);
      for(const it of B.KN) it.update();
      const n=allSpeak().length; W.n=n; W.mag.update(dt,n);
      swV+=clamp(swT-swV,-dt*1.5,dt*1.5); SW.set(swV);
      W.tremUpd(dt,Sx.trem.v); B.setP(S.p*(1-W.trem.dip));
      W.zimUpd(Sx.zimb.v); ZM.update(dt,Sx.zimb.v>0.9&&S.p>20?1:0);
      const oPH=Sx.cPH.off, oHP=Sx.cHP.off, oPP=Sx.cPP.off;
      // pedal
      for(const q of ped){ const k=q.k, kP=KV[0][k], th=Math.asin(clamp(DEP*kP/KL,0,1)), s=Math.sin(th); q.g.rotation.x=-th;
        q.sp.scale.y=(yK-KHp/2-1.2-(ZH-(ZX+5))*s)/2.2;
        const drA=(ZH-ZAA)*s, drH=(ZH-ZHC)*s, drP=(ZH-ZPC)*s;
        const fa=Math.asin(clamp(drA/aiA,0,1)), ra=rbA.set(k,fa); q.ta.set(ra.ti,V3(q.x,q.top-drA,ZAA),0.4); KDD[k]=aoA*Math.sin(fa)/KPULL; q.ta2.set((k%2?td:tc).pullDown(k),ra.to,0.6);
        const fh=Math.asin(clamp(drH/aiC,0,1)), rh=rbHC.set(k,fh); q.th.set(rh.ti,V3(q.x,q.top-drH,ZHC),0.4); pAH[k]=aoHC*Math.sin(fh); toH[k]=rh.to;
        const fp=Math.asin(clamp(drP/aiC,0,1)), rp=rbPC.set(k,fp); q.tp.set(rp.ti,V3(q.x,q.top-drP,ZPC),0.4); pAP[k]=aoPC*Math.sin(fp); toP[k]=rp.to;
        hlM(dmat[k],null,kP); for(const t of [q.ta,q.th,q.tp,q.ta2,q.th2,q.tp2]) t.hl(kP); rbA.hl(k,kP); rbHC.hl(k,kP); rbPC.hl(k,kP);
      }
      // manuals
      for(let k=0;k<NM;k++){
        const thU=Math.asin(clamp(DIP*KV[2][k]/up.Lk,0,1)), pU=dzU*Math.sin(thU);
        const dHP=k<NP?cHP.out(oHP,pAH[k]):0, dH=Math.min(dzU*0.95,Math.max(pU,aiH*dHP/acH)), phH=Math.asin(clamp(dH/aiH,0,1)), thH=Math.asin(clamp(dH/dzU,0,1));
        up.set(k,thH); KDH[k]=4*Math.sin(phH)/KPULL;
        const dPH=cPH.out(oPH,dH), thK=Math.asin(clamp(DIP*KV[1][k]/lo.Lk,0,1)), pK=dzL*Math.sin(thK);
        const dPP=k<NP?cPP.out(oPP,pAP[k]):0, dP=Math.min(dzL*0.95,Math.max(pK,dPH,aiP*dPP/acP)), phP=Math.asin(clamp(dP/aiP,0,1)), thL=Math.asin(clamp(dP/dzL,0,1));
        lo.set(k,thL); KDP[k]=4*Math.sin(phP)/KPULL;
        const x=lo.keys[k].x, rH=rbH.set(k,phH), rP=rbP.set(k,phP), aU=up.attach(k,thH), aL=lo.attach(k,thL);
        TH[k].t1.set(rH.ti,aU,KH); TH[k].t2.set(hw.pullDown(k),rH.to,0.6);
        cPH.set(k,oPH,dH,dP);
        TP[k].tL.set(V3(x,Y0+14+0.25-dP,LO_ZA),aL,KH); TP[k].t1.set(rP.ti,V3(x,Y0+14-dP-0.25,LO_ZA),0.6); TP[k].t2.set(pos.pullDown(k),rP.to,0.6);
        if(k<NP){ const rh=cHP.set(k,oHP,pAH[k],acH*Math.sin(phH)); TH[k].tc.set(rH.tc,rh.D,0.6); ped[k].th2.set(rh.A,toH[k],0.6);
          const rp=cPP.set(k,oPP,pAP[k],acP*Math.sin(phP)); TP[k].tc.set(rP.tc,rp.D,0.6); ped[k].tp2.set(rp.A,toP[k],0.6);
          cHP.hl(k,acH*Math.sin(phH)); cPP.hl(k,acP*Math.sin(phP)); TH[k].tc.hl(dH/pullU); TP[k].tc.hl(dP/pullL); }
        const aH=dH/pullU, aP=dP/pullL; hlM(hmat[k],up.keys[k].hm,aH); hlM(pmat[k],lo.keys[k].hm,aP);
        TH[k].t1.hl(aH); TH[k].t2.hl(aH); rbH.hl(k,aH); cPH.hl(k,Math.max(aH,aP)); TP[k].tL.hl(aP); TP[k].t1.hl(aP); TP[k].t2.hl(aP); rbP.hl(k,aP);
      }
      hw.update(); pos.update(); tc.update(); td.update();
    }};
}
const LO_ZA=-17;

