/* ---------- G-03: pedal coupler (manual to pedal, rocker type) ----------
   One suspended manual (Hauptwerk) above a pedalboard. The pedal action: toe tracker up to a square, horizontal tracker
   back, a second square and a roller board under the pedal chest, which stands behind the Hauptwerk. The coupler: a
   second tracker from each pedal key rises to a roller board that shifts it from the pedal key's position to the manual
   key's position, then up to the upper rocker of a rocker coupler above the manual; the lower rocker pulls the manual's
   run down, and with it the manual key, which hangs from it. Coupler off: the upper rocker rail is lowered. */
function buildPedalCoupler(){
  const R=CX.root, m={cpl:true,cu:1,man:0,hs:[true,true,false,true,false,false],ps:[false,true,false]};
  const HWSP=new Float32Array([1,1,0,1,0,0]), PDSP=new Float32Array([0,1,0]);
  const HWST=[5,6,7,8,3,9], HWR=[13.9,6.43,1.46,-2.44,-7.54,-14.58], PDST=[5,11,12], PDR=[13.9,2.32,-10.53];
  // console after the AGO standard: manual naturals 29½ in (749 mm, 96 units) above the pedal naturals, the front ends of
  // the pedal sharps 8½-10 in (216-254 mm) behind a plumb line from the front edge of the manual naturals (here 234 mm),
  // bench 20½ in (521 mm) above the pedal
  const YM=101, DIP=1.3, MAN={y:YM,zf:52,zt:0,za:20,bed0:2,bed1:53,zfelt:50.5,dip:DIP,man:1,cheek:'手鍵盤（ハウプトヴェルク）の側板'};
  const mm=[], pm=[]; for(let k=0;k<13;k++){ mm.push(mclone(MAT.woodPale)); pm.push(mclone(MAT.woodPale)); }
  MAN.mat=k=>mm[k];
  const man=buildSuspManual(MAN), pullM=DIP*(MAN.za-MAN.zt)/(MAN.zf-MAN.zt);
  box(R,30,6.5,56,MAT.woodDark,0,YM-6.6,26,LB('演奏台（コンソール）の台','Spieltisch'));
  // the key desk rests on two side frames standing outside the pedalboard (its frame is at x = ±34)
  for(const s of [-1,1]){ box(R,2,2,56,MAT.woodDark,s*37,YM-9.9,26,LB('演奏台の脚','Spieltisch')); box(R,22,2,4,MAT.woodDark,s*27,YM-9,26,LB('演奏台の腕木','Spieltisch'));
    for(const z of [4,48]) box(R,2,YM-9.9,2,MAT.woodDark,s*37,(YM-9.9)/2,z,LB('演奏台の脚','Spieltisch')); }
  // ---- pedalboard (as D-05) ----
  const ZH=80, ZE=4, ZX=-27, KL=ZH-ZX, KP=ZH-ZE, yK=5, KHp=3.4, DEP=1.9, ZA=-24, ZCP=-17, YS=26, AO=3, AI=AO*DEP*(ZH-ZA)/KL/KPULL;
  const xp=k=>((k in SLOT?SLOT[k]:BPOS[k])-3.5)*8;
  const LF=LB('ペダル鍵盤の枠','Pedalklaviatur');
  box(R,66,1.2,3,MAT.woodDark,0,0.6,ZX+2.5,LB('つま先側の桟（ばねと下止めのフェルトを受ける）','Federleiste'));
  box(R,66,yK+1,4,MAT.woodDark,0,(yK+1)/2,ZH+1,LB('蝶番の桟（ペダル鍵のかかと側の支点）','Scharnier'));
  for(const s of [-1,1]) box(R,2,1.6,KL+6,MAT.woodDark,s*34,0.8,(ZH+ZE)/2+1,LF);
  const LBk=LB('オルガンベンチ','Orgelbank'); box(R,74,2.4,16,MAT.wood,0,72.6,ZH+12,LBk); for(const s of [-1,1]) box(R,2.4,71.4,14,MAT.wood,s*35,35.7,ZH+12,LBk);
  const SG=helixGeo(0.8,5,2.2,0.13), ped=[];
  for(let k=0;k<13;k++){
    const w=(k in SLOT), x=xp(k), lm=pm[k], g=new T.Group(); g.position.set(x,yK,ZH); R.add(g);
    box(g,w?2.9:2.4,KHp,KL,lm,0,0,-KL/2,LB('ペダル鍵 '+KEYNAMES[k]+'（かかと側の蝶番を支点に、つま先側が下がる）','Pedaltaste'));
    if(!w) box(g,2.4,3.2,18,MAT.ebony,0,KHp/2+1.6,-KP+9,LB('ペダルの黒鍵（つま先側に高く付いた台）','Obertaste'));
    else box(g,2.9,0.3,KP-4,MAT.woodPale,0,KHp/2+0.15,-KP/2-1,LB('ペダルの白鍵の踏み面','Untertaste'));
    box(g,w?2.9:2.4,0.02,0.4,MAT.dark,0,KHp/2+0.01,-KP,LB('ここから奥はアクションを取り付けるための延長部（オルガンの下に入る）','Pedaltaste'));
    g.traverse(c=>{ c.userData.key=k; c.userData.man=0; });
    rod(R,0.15,MAT.brass,LB('ガイドピン','Führungsstift')).set(V3(x,1.2,ZX+2),V3(x,yK+KHp/2+0.6,ZX+2));
    const sp=mk(SG,MAT.iron,R,LB('ペダルのばね','Pedalfeder')); sp.position.set(x,1.2,ZX+5);
    const top=yK+KHp/2;
    ped.push({k,x,g,sp,top,lm,
      t1:makeTracker(lm,LB('トラッカー（ペダル鍵 → スクエア）','Abstrakte')),
      s1a:rod(R,0.32,lm,LB('スクエア（ペダル側）','Winkel')), s1b:rod(R,0.32,lm,LB('スクエア（ペダル側）','Winkel')),
      t2:makeTracker(lm,LB('水平のトラッカー（奥のペダル風箱へ）','Abstrakte')),
      s2a:rod(R,0.32,lm,LB('スクエア（風箱側）','Winkel')), s2b:rod(R,0.32,lm,LB('スクエア（風箱側）','Winkel')),
      tc:makeTracker(lm,LB('カプラーのトラッカー（ペダル鍵 → カプラーのローラーボード）','Abstrakte')),
      t1b:makeTracker(lm,LB('トラッカー（スクエア → ローラー）','Abstrakte'))});
  }
  // ---- chests ----
  const aiM=4*pullM/KPULL, zrM=MAN.za-aiM, zoM=zrM+4, y0M=YM+15;
  const KDH=new Float32Array(13), KDP=new Float32Array(13);
  // full-size chests (C/Cis layout, built like the H-03 chests): the Hauptwerk over the console (pull-down line at zoM as
  // before), the pedal chest on its legs 0.78 m behind it
  const hw=buildFullChest(fullChestPlan(y0M+13*1.25+22,-2,zoM+3.5,HWST),null,'R',false,KDH,{sp:HWSP,noLegs:true,name:'ハウプトヴェルク'});
  const zFP=hw.zB-100, zP=zFP-3.5, zs1=ZA+AI, zs2=zP+AO, zrP=zP-AO, y0P=32;
  const pd=buildFullChest(fullChestPlan(y0P+13*1.25+5,-2,zFP,PDST),null,'R',false,KDP,{sp:PDSP,pedal:true,volN:300,name:'ペダル'});
  hw.finish(); pd.finish();
  box(R,64,1.2,1.2,MAT.woodDark,0,YS,zs1+0.9,LB('スクエアの軸受け（ペダル側）','Winkelbalken'));
  box(R,64,1.2,1.2,MAT.woodDark,0,YS,zs2+0.9,LB('スクエアの軸受け（風箱側）','Winkelbalken'));
  for(const s of [-1,1]) for(const z of [zs1+0.9,zs2+0.9]) box(R,1.6,YS,1.6,MAT.woodDark,s*33,YS/2,z,LB('軸受けの支柱','Balgstütze'));
  // roller boards: generic
  const RBs=[];
  const mkRB=(lab,zr,y0,x1f,x2f,mat,ai,ao)=>{ const xs=[]; for(let k=0;k<13;k++) xs.push(x1f(k),x2f(k)); const xmin=Math.min(...xs)-3, xmax=Math.max(...xs)+3, ytop=y0+13*1.25+2;
    box(R,xmax-xmin,ytop-(y0-3),0.8,MAT.wood,(xmin+xmax)/2,(ytop+y0-3)/2,zr-1.1,LB('ローラーボード（'+lab+'）','Wellenbrett'));
    const it=[]; for(let k=0;k<13;k++){ const x1=x1f(k), x2=x2f(k), yk=y0+k*1.25, mt=mat(k);
      const roll=mk(G_CYL,mt,R,LB('ローラー（'+lab+'・'+KEYNAMES[k]+'）','Welle')); roll.rotation.z=Math.PI/2; roll.scale.set(0.42,Math.abs(x2-x1)+1.4,0.42); roll.position.set((x1+x2)/2,yk,zr);
      for(const xx of [Math.min(x1,x2)-0.9,Math.max(x1,x2)+0.9]) box(R,0.7,1.1,1.4,MAT.woodDark,xx,yk,zr-0.4,LB('ローラーの軸受け','Wellenböckchen'));
      it.push({x1,x2,yk,ra1:rod(R,0.32,mt,LB('ローラーの腕','Wellenärmchen')),ra2:rod(R,0.32,mt,LB('ローラーの腕','Wellenärmchen')),tr:makeTracker(mt,LB('トラッカー（ローラー → '+lab.replace('用','')+'）','Abstrakte'))}); }
    const rb={zr,ai,ao,it,set(k,pull){ const q=it[k], r=Math.asin(clamp(pull/ai,0,1)), c=Math.cos(r), s=Math.sin(r); const t1=V3(q.x1,q.yk-ai*s,zr+ai*c), t2=V3(q.x2,q.yk-ao*s,zr+ao*c); q.ra1.set(V3(q.x1,q.yk,zr),t1); q.ra2.set(V3(q.x2,q.yk,zr),t2); return [t1,t2]; }}; RBs.push(rb); return rb; };
  const rbM=mkRB('ハウプトヴェルク用',zrM,y0M,k=>man.keys[k].x,k=>hw.pos(k),k=>mm[k],aiM,4);
  const rbP=mkRB('ペダル風箱用',zrP,y0P,k=>xp(k),k=>pd.pos(k),k=>pm[k],AO,AO);
  const aiC=3, dropC1=DEP*(ZH-ZCP)/KL, aoC=aiC*pullM/dropC1, zrC=ZCP-aiC, ZAw=zrC+aoC, y0C=40;
  const rbC=mkRB('カプラー用',zrC,y0C,k=>xp(k),k=>man.keys[k].x,k=>pm[k],aiC,aoC);
  // ---- rocker coupler ----
  const YU=YM-12, YL=YM-15, ZB=4.9, ZPU=(ZAw+ZB)/2, ZD=MAN.za, ZPL=(ZB+ZD)/2, OFF=1.0;
  const railU=box(R,30,1,1,MAT.woodDark,0,YU,ZPU,LB('上のウィッペンバルケン（カプラーを切ると下がる）','Wippenbalken')); box(R,30,1,1,MAT.woodDark,0,YL,ZPL,LB('下のウィッペンバルケン（固定）','Wippenbalken'));
  for(const s of [-1,1]){ box(R,1.2,10,1.6,MAT.woodDark,s*15.6,YU-4.5,ZPU,LB('ウィッペンバルケンの支柱','Balgstütze')); box(R,1.2,7,1.6,MAT.woodDark,s*15.6,YL-3,ZPL,LB('ウィッペンバルケンの支柱','Balgstütze')); }
  const CW=[]; for(let k=0;k<13;k++){ const x=man.keys[k].x;
    CW.push({x,ua:rod(R,0.3,pm[k],LB('上のカプラー・ウィッペン（ペダルからのトラッカーに引かれる側）','Koppelwippe')),ub:rod(R,0.3,pm[k],LB('上のカプラー・ウィッペン（上がる側）','Koppelwippe')),
      la:rod(R,0.3,mm[k],LB('下のカプラー・ウィッペン（引き上げられる側）','Koppelwippe')),lb:rod(R,0.3,mm[k],LB('下のカプラー・ウィッペン（下がる側。手鍵盤のトラッカーを引く）','Koppelwippe')),
      wire:rod(R,0.07,MAT.iron,LB('つなぎの線','Draht')),nW:cyl(R,0.42,0.3,MAT.leather,x,0,ZB,LB('革ナット（つなぎの線の上端）','Ledermutter')),
      nU:cyl(R,0.42,0.3,MAT.leather,x,0,ZAw,LB('カプラーのナット（カプラーを入れると上のウィッペンに乗る）','Ledermutter')),
      tc2:makeTracker(pm[k],LB('カプラーのトラッカー（ローラー → 上のカプラー・ウィッペン）','Abstrakte')),
      tm:makeTracker(mm[k],LB('カプラーの引き棒（鍵の下面から下のウィッペンへ。ナットが腕の下に掛かり、ウィッペンが下がると鍵を引き下げる）','Abstrakte')),
      tr2:makeTracker(mm[k],LB('トラッカー（手鍵盤の鍵 → ローラー。鍵はこれに吊られている）','Abstrakte'))}); }
  const setMan=v=>{ m.man=v; S.key.fill(false); syncKeyUI(); renderControls(); };
  return {chest:hw,
    controls:[{type:'toggle',id:'cpl',label:'カプラー I/P',get:()=>m.cpl,set:v=>m.cpl=v},
      {type:'toggle',id:'m0',label:'ペダルを弾く',get:()=>m.man===0,set:()=>setMan(0)},
      {type:'toggle',id:'m1',label:'手鍵盤を弾く',get:()=>m.man===1,set:()=>setMan(1)}],
    stopRows:[{label:'I ハウプトヴェルク（手鍵盤）',items:HWST.map((si,i)=>({name:STOPS[si].name,ja:STOPS[si].ja,get:()=>m.hs[i],set:v=>m.hs[i]=v}))},{label:'P ペダル',items:PDST.map((si,i)=>({name:STOPS[si].name,ja:STOPS[si].ja,get:()=>m.ps[i],set:v=>m.ps[i]=v}))}],
    ctl:{cpl:v=>m.cpl=v,man:v=>{ m.man=v; },pd:arr=>{ arr.forEach((v,i)=>m.ps[i]=!!v); syncStopUI(); },hw:arr=>{ arr.forEach((v,i)=>m.hs[i]=!!v); syncStopUI(); }},
    setMan,curMan:()=>m.man,pedKb:true,
    views:{cpl:[[30,YM-4,26],[-4,YM-10,6]],ped:[[90,50,50],[0,22,-20]],chests:[[230,190,260],[0,130,-20]]},
    pins:[{t:'ペダル鍵盤',p:V3(-38,8,30)},{t:'手鍵盤（ハウプトヴェルク）',p:V3(-18,YM+2,50)},{t:'カプラーのウィッペン（手鍵盤の下）',p:V3(17,YU+2,ZPU),max:120},{t:'カプラーのローラーボード',p:V3(-38,y0C+18,zrC)},{t:'ペダル風箱用のローラーボード',p:V3(-90,y0P+18,zrP)},{t:'ハウプトヴェルク',p:V3(hw.xR+6,hw.oy+20,hw.zF)},{t:'ペダルの風箱',p:V3(pd.xR+6,pd.oy+20,pd.zF)}],
    speaking:()=>hw.speaking().concat(pd.speaking()),
    update(dt){
      m.cu+=clamp((m.cpl?1:0)-m.cu,-dt*3,dt*3);
      const off=-OFF*(1-m.cu); railU.position.y=YU+off;
      for(let k=0;k<13;k++){
        const q=ped[k], kP=m.man===0?S.kd[k]:0, th=Math.asin(DEP*kP/KL); q.g.rotation.x=-th;
        q.sp.scale.y=(yK-KHp/2-1.2-(ZH-(ZX+5))*Math.sin(th))/2.2;
        // pedal action
        const drop=(ZH-ZA)*Math.sin(th), p1=Math.asin(clamp(drop/AI,0,1)), c1=Math.cos(p1), s1=Math.sin(p1);
        const P1=V3(q.x,YS,zs1), inT=V3(q.x,YS-AI*s1,zs1-AI*c1), upT=V3(q.x,YS+AO*c1,zs1-AO*s1);
        q.t1.set(inT,V3(q.x,q.top-drop,ZA),0.4); q.s1a.set(P1,inT); q.s1b.set(P1,upT);
        const pull=AO*s1, P2=V3(q.x,YS,zs2), up2=V3(q.x,YS+AO*c1,zs2-AO*s1), out2=V3(q.x,YS-AO*s1,zs2-AO*c1);
        q.t2.set(up2,upT,0.6); q.s2a.set(P2,up2); q.s2b.set(P2,out2);
        const [pt1,pt2]=rbP.set(k,pull); rbP.it[k].tr.set(pd.pullDown(k),pt2,0.6); q.t1b.set(pt1,out2,0.6);
        KDP[k]=pull/KPULL;
        // coupler
        const dC=(ZH-ZCP)*Math.sin(th), [ct1,ct2]=rbC.set(k,dC); q.tc.set(ct1,V3(q.x,q.top-dC,ZCP),0.4);
        const pA=aoC*Math.sin(Math.asin(clamp(dC/aiC,0,1)));
        const thK=m.man===1?Math.asin(clamp(DIP*S.kd[k]/man.Lk,0,1)):0, pK=(MAN.za-MAN.zt)*Math.sin(thK);
        const dA=Math.max(0,pA+off), cUp=Math.max(0,off+dA), dR=cUp, c=dR, dK=Math.max(pK,dR);
        const thM=Math.asin(clamp(dK/(MAN.za-MAN.zt),0,1)); man.set(k,thM); const aM=man.attach(k,thM);
        KDH[k]=dK/pullM;
        const w=CW[k], x=w.x, PUv=V3(x,YU+off,ZPU), PLv=V3(x,YL,ZPL);
        const tA=V3(x,YU+off-dA,ZAw), tB=V3(x,YU+off+dA,ZB), tC=V3(x,YL+c,ZB), tD=V3(x,YL-dR,ZD);
        w.ua.set(PUv,tA); w.ub.set(PUv,tB); w.la.set(PLv,tC); w.lb.set(PLv,tD);
        w.wire.set(tC,V3(x,YU+0.4+c,ZB)); w.nW.position.y=YU+0.4+c; w.nU.position.y=YU+0.4-pA;
        w.tc2.set(V3(x,YU+0.25-pA,ZAw),ct2,0.6); w.tm.set(V3(aM.x,aM.y-KH,aM.z),V3(x,YL-dR,ZD),0.3);
        const [mt1,mt2]=rbM.set(k,dK); w.tr2.set(mt1,aM,KH); rbM.it[k].tr.set(hw.pullDown(k),mt2,0.6);
        const kdm=KDH[k], kdp=kP;
        mm[k].emissive.copy(COL.key).multiplyScalar(0.6*Math.min(1,kdm)); man.keys[k].hm.emissive.copy(COL.key).multiplyScalar(0.35*Math.min(1,kdm));
        pm[k].emissive.copy(COL.key).multiplyScalar(0.6*Math.min(1,kdp));
      }
      for(let i=0;i<6;i++) HWSP[i]+=clamp((m.hs[i]?1:0)-HWSP[i],-dt*2.5,dt*2.5);
      for(let i=0;i<3;i++) PDSP[i]+=clamp((m.ps[i]?1:0)-PDSP[i],-dt*2.5,dt*2.5);
      hw.update(dt); pd.update(dt);
    }};
}

