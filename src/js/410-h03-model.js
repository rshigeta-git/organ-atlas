/* ---------- H-03 model ---------- */
function buildH03(){
  const B=h3Core(); B.MK=[...Array(B.NM).keys()];
  const Sx=h3Stops(B), W=h3Wind(B), ZM=h3Zimbel(W.ZO,B.ST), SW=h3Swell(B);
  h3Case(B);
  mergeStatic(B.ST); CX.pool.finish();
  const {m,ped,lo,up,rbH,rbP,rbF,rbC,cPH,cHP,cPP,TH,TP,KDH,KDP,KDD,SPH,SPP,SPD,hw,pos,tc,td,NM,NP,DIP,Y0,ZH,ZX,KL,DEP,ZAA,ZC,yK,KHp,pullH,pullP,dzH,dzP,aiH,aiP,SQ,kx,PDX,UPm,LO,aiA,aoA,aiC,aoC,ZHP,ZPP,hmat,pmat,dmat}=B;
  let swT=0.25, swV=0.25;
  const pC=new Float32Array(NP), toC=[];
  /* key state per keyboard: 0 pedal, 1 Hauptwerk (I, lower manual), 2 Positiv (II, upper manual) */
  const NK=[NP,NM,NM], KS=[0,1,2].map(i=>new Array(NK[i]).fill(false)), KV=[0,1,2].map(()=>new Float32Array(64));
  let conEl=null;
  const syncKeys=()=>{ if(!conEl) return; conEl.querySelectorAll('[data-km]').forEach(b=>b.classList.toggle('on',!!KS[+b.dataset.km][+b.dataset.k])); };
  const press=(mn,k,v)=>{ if(k<0||k>=NK[mn]) return; KS[mn][k]=v==='t'?!KS[mn][k]:!!v; if(v) m.man=mn; syncKeys(); };
  const releaseAll=()=>{ KS.forEach(a=>a.fill(false)); syncKeys(); };
  const hlM=(mat,hm,a)=>{ mat.emissive.copy(COL.key).multiplyScalar(0.6*Math.min(1,a)); if(hm) hm.emissive.copy(COL.key).multiplyScalar(0.35*Math.min(1,a)); };
  const stopRows=[{label:'P ペダル',items:Sx.ped.map((it,i)=>({name:it.name,ja:STOPS[tc.rows[i].si].ja,get:()=>it.on,set:v=>it.on=v}))},
    {label:'I ハウプトヴェルク（下鍵盤）',items:Sx.hw.map((it,i)=>({name:it.name,ja:STOPS[hw.rows[i].si].ja,get:()=>it.on,set:v=>it.on=v}))},
    {label:'II ポジティフ（上鍵盤）',items:Sx.pos.map((it,i)=>({name:it.name,ja:STOPS[pos.rows[i].si].ja,get:()=>it.on,set:v=>it.on=v}))},
    {label:'カプラー・補助装置',items:[[Sx.cPH,'ポジティフをハウプトヴェルクの鍵盤で鳴らす'],[Sx.cHP,'ハウプトヴェルクをペダルで鳴らす'],[Sx.cPP,'ポジティフをペダルで鳴らす'],[Sx.trem,'手鍵盤の風を揺らす'],[Sx.zimb,'星が回り鈴が鳴る']].map(([it,ja])=>({name:it.name,ja,get:()=>it.on,set:v=>it.on=v}))}];
  /* console panel under the model: drawknobs by division, two manuals, pedalboard */
  const knobTxt=n=>{ const mm=n.match(/^(.*?)\s+((?:\d+\s)?[\d\/]+′|III)$/); return mm?'<b>'+mm[1]+'</b><i>'+mm[2]+'</i>':'<b>'+(n==='Zimbelstern'?'Zimbel-<br>stern':n==='Tremulant'?'Tremu-<br>lant':n)+'</b>'; };
  const kn=it=>({name:it.name,ja:'',get:()=>it.on,set:v=>it.on=v});
  const GR=[[['Positiv',Sx.pos.map(kn)],['Hauptwerk',Sx.hw.map(kn)]],[['Pedal',Sx.ped.map(kn)],['Coupler',[Sx.cPH,Sx.cHP,Sx.cPP].map(kn)],['Accessories',[Sx.trem,Sx.zimb].map(kn),true]]];
  /* combination action: 5 general combinations, a setter and a cancel (0). Recalling one sets the knobs, so their switches
     send current to the solenoids of the stops that change. With "Set" on, a combination button stores the knobs instead. */
  const ALL=[...Sx.hw,...Sx.pos,...Sx.ped,Sx.cPH,Sx.cHP,Sx.cPP,Sx.trem,Sx.zimb];
  const CM={set:false,mem:{1:[0,1,0,0,0,0, 1,0,0,0,0, 0,0,1,0, 0,0,0, 0,0],2:[0,1,0,0,0,0, 1,1,0,1,0, 0,0,1,0, 0,0,1, 1,0],
    3:[1,0,1,0,0,0, 1,1,1,0,0, 1,0,1,0, 0,1,0, 0,0],4:[1,0,1,1,1,0, 1,1,1,0,0, 1,1,1,0, 1,1,0, 0,0],5:[1,1,1,1,1,1, 1,1,1,1,0, 1,1,1,1, 1,1,1, 0,0]},last:null};
  const comb=n=>{ if(n==='s'){ CM.set=!CM.set; syncCons(); return; }
    if(CM.set&&n!==0){ CM.mem[n]=ALL.map(it=>it.on?1:0); CM.set=false; CM.last=n; syncCons(); return; }
    const c=n===0?ALL.map(()=>0):CM.mem[n]; ALL.forEach((it,i)=>it.on=!!c[i]); CM.last=n; syncStopUI(); syncCons(); };
  const PN=['s',1,2,3,4,5,0], PNM={s:'セット',0:'0（全部切る）'}, pnm=n=>PNM[n]||('コンビネーション '+n);
  // thumb pistons in the key slip under the lower manual (the front of the key desk)
  PN.forEach((n,j)=>{ const b=mk(G_CYL,n==='s'?MAT.ebony:MAT.ivory,CX.root,LB(n==='s'?'セットボタン（押しながらコンビネーションを押すと、今のストップを記憶する）':n===0?'ゼロ（全部切る）':'コンビネーション '+n,n==='s'?'Setzer':'Kombinationsknopf'));
    b.rotation.x=Math.PI/2; b.scale.set(0.75,0.6,0.75); b.position.set(-12+4*j,Y0-6.6,55.3); b.userData.act={name:pnm(n),get:()=>n==='s'?CM.set:CM.last===n,fn:()=>comb(n)}; });
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
    mkKb(2,'Positiv (II)','man2'); mkKb(1,'Hauptwerk (I)','man1'); mkKb(0,'Pedal','pedal');
    const tl=document.createElement('div'); tl.className='oc-tools';
    const lb=document.createElement('button'); lb.className='btn'; lb.type='button'; lb.textContent=T_('押したまま保持'); lb.setAttribute('aria-pressed',S.latch); lb.addEventListener('click',()=>{ $('latch').click(); lb.setAttribute('aria-pressed',S.latch); });
    const rb=document.createElement('button'); rb.className='btn'; rb.type='button'; rb.textContent=T_('全部離す'); rb.addEventListener('click',releaseAll);
    const pg=document.createElement('div'); pg.className='oc-pist'; pg.innerHTML='<span>'+T_('コンビネーション')+'</span>';
    PN.forEach(n=>{ const b=document.createElement('button'); b.className='btn pist'; b.type='button'; b.dataset.p=n; b.textContent=n==='s'?'S':String(n); b.title=T_(pnm(n)); b.setAttribute('aria-label',T_(pnm(n)));
      b.addEventListener('click',()=>{ audioInit(); comb(n); }); pg.appendChild(b); });
    tl.append(pg,lb,rb); el.appendChild(tl); syncCons();
    syncKeys();
  };
  function syncCons(){ if(!conEl) return; conEl.querySelectorAll('.pist').forEach(b=>{ const n=b.dataset.p; b.setAttribute('aria-pressed',n==='s'?CM.set:String(CM.last)===n); }); }
  const syncConsole=()=>{ if(!conEl) return; conEl.querySelectorAll('.dk').forEach(b=>b.setAttribute('aria-pressed',!!b._it.get())); syncCons(); };
  const allSpeak=()=>hw.speaking().concat(pos.speaking(),tc.speaking(),td.speaking());
  const setArr=(a,arr)=>arr.forEach((v,i)=>{ if(a[i]) a[i].on=!!v; });
  return {stopRows,press,releaseAll,buildConsole,syncConsole,curMan:()=>m.man,pcBase:()=>m.man===0?0:24,
    setKeys:arr=>{ KS.forEach(a=>a.fill(false)); arr.forEach(k=>{ if(k<NK[m.man]) KS[m.man][k]=true; }); syncKeys(); },
    controls:[{type:'toggle',id:'blower',label:'送風機',get:()=>W.mag.blower,set:v=>W.mag.blower=v}],swell2:()=>swV,
    ctl:{man:v=>{ m.man=v; },hw:a=>{ setArr(Sx.hw,a); syncStopUI(); },pos:a=>{ setArr(Sx.pos,a); syncStopUI(); },ped:a=>{ setArr(Sx.ped,a); syncStopUI(); },
      cpl:a=>{ setArr([Sx.cPH,Sx.cHP,Sx.cPP],a); syncStopUI(); },comb:n=>comb(n),trem:v=>{ Sx.trem.on=!!v; syncStopUI(); },zimb:v=>{ Sx.zimb.on=!!v; syncStopUI(); },blower:v=>W.mag.blower=v,swell:v=>{ swT=v; if(swIn) swIn.value=Math.round(v*100); },
      empty:()=>{ W.mag.h=0; }},
    B,
    pins:[{t:'ハウプトヴェルク（I）',p:V3(-150,470,40)},{t:'ポジティフ（II）',p:V3(-150,250,0)},{t:'ペダル塔（C側）',p:V3(-470,720,-40)},{t:'ペダル塔（Cis側）',p:V3(470,720,-40)},
      {t:'演奏台',p:V3(-70,130,50)},{t:'ローラーボード',p:V3(-200,350,20),max:900},{t:'ペダルカプラー（Hw/P・Pos/P）',p:V3(-150,90,0),max:700},{t:'送風機とマガジンふいご',p:V3(-200,160,-470)},{t:'スウェルボックス',p:V3(-150,330,0),max:900},{t:'トレムラント',p:V3(40,140,-157),max:700},{t:'ツィンベルシュテルン',p:V3(0,680,30),max:900}],
    speaking:allSpeak,
    update(dt){
      for(let i=0;i<3;i++) for(let k=0;k<NK[i];k++){ const tg=KS[i][k]?1:0; KV[i][k]+=(tg-KV[i][k])*Math.min(1,dt*22); }
      for(const it of B.KN){ const r=it.rate||2.5; it.v+=clamp((it.on?1:0)-it.v,-dt*r,dt*r); }
      Sx.hw.forEach((it,i)=>SPH[i]=it.v); Sx.pos.forEach((it,i)=>SPP[i]=it.v); Sx.ped.forEach((it,i)=>SPD[i]=it.v);
      for(const it of B.KN) it.update(dt);
      const n=allSpeak().length; W.n=n; W.mag.update(dt,n);
      swV+=clamp(swT-swV,-dt*1.5,dt*1.5); SW.set(swV);
      W.tremUpd(dt,Sx.trem.v); B.setP(S.p*(1-W.trem.dip));
      W.zimUpd(Sx.zimb.v); ZM.update(dt,Sx.zimb.v>0.9&&S.p>20?1:0);
      const oHP=Sx.cHP.off, oPP=Sx.cPP.off, oPH=Sx.cPH.off;
      // pedal
      for(const q of ped){ const k=q.k, kP=KV[0][k], th=Math.asin(clamp(DEP*kP/KL,0,1)), s=Math.sin(th); q.g.rotation.x=-th;
        q.sp.scale.y=(yK-KHp/2-1.2-(ZH-(ZX+5))*s)/2.2;
        const drA=(ZH-ZAA)*s, drC=(ZH-ZC)*s;
        // P1 behind the key ends: arm toward the player pulled down, upright arm pulls the horizontal tracker forward
        const {P1A,P1B,yP1,zP1,yP2}=SQ, fP=Math.asin(clamp(drA/P1A,0,1)), cP=Math.cos(fP), sP=Math.sin(fP), x=q.x;
        const a1=V3(x,yP1-P1A*sP,zP1+P1A*cP), b1=V3(x,yP1+P1B*cP,zP1+P1B*sP);
        q.p1a.set(V3(x,yP1,zP1),a1); q.p1b.set(V3(x,yP1,zP1),b1);
        q.ta.set(a1,V3(q.x,q.top-drA,ZAA),0.4);
        { // P1 → tracker → short roller board → tracker → flat square → long tracker → square under the pallet → pallet
          const sf=clamp(P1B*sP/aiA,0,1), rf=rbF.set(k,Math.asin(sf)), f=rbF.FD[k], AF=rbF.AF;
          const sa=clamp(aoA*sf/AF,0,1), ph=f.sgn*Math.asin(sa), cph=Math.cos(ph), sph=Math.sin(ph);
          const rot=d=>V3(d.x*cph+d.z*sph,0,-d.x*sph+d.z*cph), tA=f.F.clone().addScaledVector(rot(f.dA),AF), tB=f.F.clone().addScaledVector(rot(f.dB),AF);
          const sq=clamp(AF*sa/P1B,0,1), cq=Math.sqrt(1-sq*sq), u=f.u, pv=f.piv;
          const c2f=V3(pv.x-u.x*P1B*sq,yP2-P1B*cq,pv.z-u.z*P1B*sq), d2f=V3(pv.x+u.x*P1A*cq,yP2-P1A*sq,pv.z+u.z*P1A*cq);
          q.fa.set(f.F,tA); q.fb.set(f.F,tB); q.p2a.set(pv,c2f); q.p2b.set(pv,d2f);
          q.thp.set(rf.ti,b1,0.3); q.tF.set(tA,rf.to,0.3); q.tvp.set(c2f,tB,0.3);
          KDD[k]=P1A*sq/KPULL; q.ta2.set((k%2?td:tc).pullDown(k),d2f,0.6); rbF.hl(k,kP); for(const t of [q.fa,q.fb,q.tF]) t.hl(kP);
        }
        // one coupler roller per note; its single tracker carries the nuts of both coupler backfalls
        const fc=Math.asin(clamp(drC/aiC,0,1)), rc=rbC.set(k,fc); q.tc.set(rc.ti,V3(q.x,q.top-drC,ZC),0.4); pC[k]=aoC*Math.sin(fc); toC[k]=rc.to;
        q.tc2.set(V3(rc.to.x,B.cPP.y+1.6-pC[k],rc.to.z),rc.to,0.6);
        cHP.set(k,oHP,pC[k]); cPP.set(k,oPP,pC[k]);
        hlM(dmat[k],null,kP); for(const t of [q.ta,q.tc,q.ta2,q.tc2,q.thp,q.tvp,q.p1a,q.p1b,q.p2a,q.p2b]) t.hl(kP); rbC.hl(k,kP); cHP.hl(k,oHP>-0.5?kP:0); cPP.hl(k,oPP>-0.5?kP:0);
      }
      // manuals: the lower key (I) works the Hauptwerk run, the upper key (II) the Positiv run. Pos/Hw joins the two trackers under
      // the key desk, Pos/P lifts the upper key's tail; Hw/P turns square S1 under the console. Only Pos/P moves a key.
      const UT=UPm.zbal;
      for(let k=0;k<NM;k++){
        const x=kx(k), {SA,zS1,yS1,zS2,yS2,ZHK}=SQ;
        const thK=Math.asin(clamp(DIP*KV[1][k]/lo.Lk,0,1));
        let thU=Math.asin(clamp(DIP*KV[2][k]/up.Lk,0,1));
        if(k<NP) thU=Math.max(thU,Math.asin(clamp(cPP.push(oPP,pC[k])/(UT-ZPP),0,1)));
        thU=Math.min(thU,Math.asin(DIP/up.Lk)*1.02);
        // pK: rise of the upper Hauptwerk tracker (the key's own), pL: of the lower one (the key, or Hw/P); pU: drop of the Positiv run
        const pK=dzH*Math.sin(thK), plPH=cPH.push(oPH,pK), pU0=dzP*Math.sin(thU), pU=Math.max(pU0,plPH);
        const pL=k<NP?Math.max(pK,cHP.push(oHP,pC[k])):pK, f=Math.asin(clamp(pL/SQ.SA,0,1));
        const pH=SQ.SA*Math.sin(f), phH=Math.asin(clamp(pH/aiH,0,1)), phP=Math.asin(clamp(pU/aiP,0,1));
        KDH[k]=4*Math.sin(phH)/KPULL; KDP[k]=4*Math.sin(phP)/KPULL;
        lo.set(k,thK,0); up.set(k,thU,pU0);
        const hook=lo.at(k,thK,ZHK,-KH/2), aU=V3(x,UPm.yb-pU,UPm.za), rH=rbH.set(k,phH), rP=rbP.set(k,phP);
        // S1 under the console: arm toward the player pulled up, hanging arm pulls the horizontal tracker forward;
        // S2 behind the swell box: hanging arm pulled forward, arm pointing back goes down and pulls the tracker to the roller
        const c=Math.cos(f), s=Math.sin(f), {YJ,YHP}=SQ;
        const i1=V3(x,yS1+SA*s,zS1+SA*c), u1=V3(x,yS1-SA*c,zS1+SA*s), h2=V3(x,yS2-SA*c,zS2+SA*s), o2=V3(x,yS2-SA*s,zS2-SA*c);
        const q=TH[k]; q.s1a.set(V3(x,yS1,zS1),i1); q.s1b.set(V3(x,yS1,zS1),u1); q.s2a.set(V3(x,yS2,zS2),h2); q.s2b.set(V3(x,yS2,zS2),o2);
        // upper part: wire down past the Pos/Hw nut to the eye; lower part: nut on the eye, wire past the Hw/P nut, wood down to S1
        const jy=YJ+pK, ny=YJ+0.4+pL; q.tA.set(hook,V3(x,jy,ZHK),0.3,hook.y-jy); q.jn.put(x,jy-0.2,ZHK,0.9,0.4,0.6);
        q.tL.set(V3(x,ny,ZHK),i1,0.3,ny-(YHP-2.5)); if(q.nHP) q.nHP.at(V3(x,YHP+0.45+pL,ZHK));
        q.th.set(h2,u1,0.3); q.tv.set(rH.ti,o2,0.3); q.t2.set(hw.pullDown(k),rH.to,0.6);
        cPH.set(k,oPH,pK,pU,aU);
        // S3 behind the console: arm toward the player pulled down, upright arm pulls the horizontal tracker forward;
        // S4 under the back of the Positiv chest: hanging arm pulled forward, arm pointing back goes down
        const {SA3,yS3,zS3,yS4,zS4}=SQ, f3=Math.asin(clamp(pU/SA3,0,1)), c3=Math.cos(f3), s3=Math.sin(f3);
        const i3=V3(x,yS3-SA3*s3,zS3+SA3*c3), u3=V3(x,yS3+SA3*c3,zS3+SA3*s3), h4=V3(x,yS4-SA3*c3,zS4+SA3*s3), o4=V3(x,yS4-SA3*s3,zS4-SA3*c3), P=TP[k];
        P.s3a.set(V3(x,yS3,zS3),i3); P.s3b.set(V3(x,yS3,zS3),u3); P.s4a.set(V3(x,yS4,zS4),h4); P.s4b.set(V3(x,yS4,zS4),o4);
        P.t1.set(i3,aU,0.3); P.th.set(h4,u3,0.3); P.tv.set(rP.ti,o4,0.3); P.t2.set(pos.pullDown(k),rP.to,0.6);
        const aH=Math.sin(phH)*aiH/pullH, aP=Math.sin(phP)*aiP/pullP;
        hlM(hmat[k],lo.keys[k].hm,Math.sin(thK)*lo.Lk/DIP); hlM(pmat[k],up.keys[k].hm,Math.sin(thU)*up.Lk/DIP); q.tA.hl(Math.sin(thK)*lo.Lk/DIP);
        for(const t of [q.tL,q.th,q.tv,q.s1a,q.s1b,q.s2a,q.s2b,q.t2]) t.hl(aH); rbH.hl(k,aH); cPH.hl(k,plPH>0.01?aP:0,aP);
        for(const t of [P.t1,P.t2,P.th,P.tv,P.s3a,P.s3b,P.s4a,P.s4b]) t.hl(aP); rbP.hl(k,aP);
      }
      hw.update(); pos.update(); tc.update(); td.update();
    }};
}

