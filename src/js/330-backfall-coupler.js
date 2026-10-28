/* ---------- G-02: backfall coupler (Wippenkoppel) ----------
   Same organ as G-01 (suspended actions, roller boards, two chests), but the coupler sits in the action above the
   keyboards. Per note: the tracker of the upper key (II) passes through the front arm of an upper backfall with a leather
   nut on top; the backfall's other arm lifts, through a wire, the near arm of a lower backfall, whose far arm pulls the
   Positiv run down. The lower key's tracker hooks that same arm with a nut from above, so the lower key works the Positiv
   alone, and when the coupler pulls the arm down the nut simply lifts off: the lower key does not move. Coupler off: the
   upper backfall rail is lowered, so the nut on the upper tracker no longer reaches the backfall. */
function buildWippenCoupler(){
  const R=CX.root, m={cpl:true,cu:1,man:1,ps:[true,true,false,false],hs:[true,true,false,true,false,false]}, POSSP=new Float32Array([1,1,0,0]), HWSP=new Float32Array([1,1,0,1,0,0]), DIP=1.3;
  const POST=[0,1,10,4], POSR=[-4,4,12,-12], HWST=[5,6,7,8,3,9], HWR=[13.9,6.43,1.46,-2.44,-7.54,-14.58];
  const LO={y:0,zf:51.5,zt:-52,za:-17,bed0:-14,bed1:52.5,zfelt:50,dip:DIP,man:0,cheek:'下鍵盤（I・ポジティフ）の側板'};
  const UP={y:7,zf:34,zt:-12,za:8,bed0:-11,bed1:31.8,zfelt:30.8,dip:DIP,man:1,cheek:'上鍵盤（II・ハウプトヴェルク）の側板'};
  const umats=[], lmats=[]; for(let k=0;k<13;k++){ umats.push(mclone(MAT.woodPale)); lmats.push(mclone(MAT.woodPale)); }
  UP.mat=k=>umats[k]; LO.mat=k=>lmats[k];
  const lo=buildSuspManual(LO), up=buildSuspManual(UP);
  box(R,30,6.5,110,MAT.woodDark,0,-6.6,0,LB('演奏台（コンソール）の台','Spieltisch'));
  const kdP=new Float32Array(13), kdU=new Float32Array(13);
  const AO=4, pullL=DIP*(LO.za-LO.zt)/(LO.zf-LO.zt), pullU=DIP*(UP.za-UP.zt)/(UP.zf-UP.zt);
  // coupler backfalls
  const YU=17, YL=14, ZA=UP.za, ZPU=1.5, ZB=-5, ZPL=-11.4, ZD=LO.za, rD=(ZPL-ZD)/(ZB-ZPL), OFF=1.0;
  const LWU=LB('上のウィッペンバルケン（カプラーを切ると下がる）','Wippenbalken'), LWL=LB('下のウィッペンバルケン（固定）','Wippenbalken');
  const railU=box(R,30,1,1,MAT.woodDark,0,YU,ZPU,LWU); box(R,30,1,1,MAT.woodDark,0,YL,ZPL,LWL);
  for(const s of [-1,1]){ box(R,1.2,YU+0.5,1.6,MAT.woodDark,s*15.6,(YU+0.5)/2,ZPU,LB('ウィッペンバルケンの支柱（溝に沿って上下する）','Balgstütze')); box(R,1.2,YL,1.6,MAT.woodDark,s*15.6,YL/2,ZPL,LB('ウィッペンバルケンの支柱','Balgstütze')); }
  const CW=[];
  for(let k=0;k<13;k++){
    const x=up.keys[k].x, mu=umats[k], ml=lmats[k];
    CW.push({x,
      ua:rod(R,0.3,mu,LB('上のカプラー・ウィッペン（上鍵盤のトラッカーに引かれる側）','Koppelwippe')), ub:rod(R,0.3,mu,LB('上のカプラー・ウィッペン（上がる側。線で下のウィッペンを引き上げる）','Koppelwippe')),
      la:rod(R,0.3,ml,LB('下のカプラー・ウィッペン（引き上げられる側）','Koppelwippe')), lb:rod(R,0.3,ml,LB('下のカプラー・ウィッペン（下がる側。ポジティフのトラッカーを引く）','Koppelwippe')),
      wire:rod(R,0.07,MAT.iron,LB('つなぎの線（上のウィッペンが上がると下のウィッペンを引き上げる）','Draht')),
      nW:cyl(R,0.42,0.3,MAT.leather,x,0,ZB,LB('革ナット（つなぎの線の上端。上のウィッペンに乗る）','Ledermutter')),
      nU:cyl(R,0.42,0.3,MAT.leather,x,0,ZA,LB('カプラーのナット（上鍵盤のトラッカーに付く。カプラーを入れると上のウィッペンに乗る）','Ledermutter')),
      nL:cyl(R,0.42,0.3,MAT.leather,x,0,ZD,LB('革ナット（下鍵盤のトラッカーの上端。下のウィッペンの腕に留めてあり、腕といっしょに動く）','Ledermutter')),
      tL:makeTracker(ml,LB('トラッカー（下鍵盤の鍵 → 下のカプラー・ウィッペン）','Abstrakte'))});
  }
  const RB=[{man:lo,o:LO,ai:AO*pullL/KPULL,y0:18,kd:kdP,lab:'下のカプラー・ウィッペン',wn:'ポジティフ'},{man:up,o:UP,ai:AO*pullU/KPULL,y0:14,kd:kdU,lab:'上鍵盤（II）の鍵',wn:'ハウプトヴェルク'}];
  for(const b of RB){ b.zr=b.o.za-b.ai; b.zo=b.zr+AO; }
  // full-size chests (C/Cis layout, built like the H-03 chests); their pull-down lines stay at zo, the Hauptwerk above the Positiv
  const pos=buildFullChest(fullChestPlan(42,-10,RB[0].zo+3.5,POST,true),null,'R',false,kdP,{sp:POSSP,volN:260,name:'ポジティフ'});
  RB[1].y0=Math.ceil(pos.top)+3;
  const hw=buildFullChest(fullChestPlan(RB[1].y0+13*1.25+6,-10,RB[1].zo+3.5,HWST,true),null,'R',false,kdU,{sp:HWSP,noLegs:true,name:'ハウプトヴェルク'});
  pos.finish(); hw.finish();
  RB[0].ch=pos; RB[1].ch=hw;
  for(const b of RB){
    const xs=[]; for(let k=0;k<13;k++) xs.push(b.man.keys[k].x,b.ch.pos(k)); const xmin=Math.min(...xs)-3, xmax=Math.max(...xs)+3, ytop=b.y0+13*1.25+2;
    box(R,xmax-xmin,ytop-(b.y0-3),0.8,MAT.wood,(xmin+xmax)/2,(ytop+b.y0-3)/2,b.zr-1.1,LB('ローラーボード（'+b.wn+'用。ローラーを支える板）','Wellenbrett'));
    b.it=[];
    for(let k=0;k<13;k++){
      const mt=b.man.keys[k].lm, x1=b.man.keys[k].x, x2=b.ch.pos(k), yk=b.y0+k*1.25;
      const roll=mk(G_CYL,mt,R,LB('ローラー（'+b.wn+'・'+KEYNAMES[k]+'。回転して引く位置を左右に移す）','Welle')); roll.rotation.z=Math.PI/2; roll.scale.set(0.42,Math.abs(x2-x1)+1.4,0.42); roll.position.set((x1+x2)/2,yk,b.zr);
      for(const xx of [Math.min(x1,x2)-0.9,Math.max(x1,x2)+0.9]) box(R,0.7,1.1,1.4,MAT.woodDark,xx,yk,b.zr-0.4,LB('ローラーの軸受け','Wellenböckchen'));
      b.it.push({x1,x2,yk,
        t1:makeTracker(mt,LB('トラッカー（'+b.lab+' → ローラー）','Abstrakte')),
        ra1:rod(R,0.32,mt,LB('ローラーの短い腕（鍵の位置。小さな引きを受ける）','Wellenärmchen')),ra2:rod(R,0.32,mt,LB('ローラーの長い腕（パレットの位置。引きを大きくする）','Wellenärmchen')),
        t2:makeTracker(mt,LB('トラッカー（ローラー → '+b.wn+'の風箱のパレット）','Abstrakte'))});
    }
  }
  const setMan=v=>{ m.man=v; S.key.fill(false); syncKeyUI(); renderControls(); };
  return {chest:hw,
    controls:[{type:'toggle',id:'cpl',label:'カプラー I/II',get:()=>m.cpl,set:v=>m.cpl=v},
      {type:'toggle',id:'m1',label:'上鍵盤（II）を弾く',get:()=>m.man===1,set:()=>setMan(1)},
      {type:'toggle',id:'m0',label:'下鍵盤（I）を弾く',get:()=>m.man===0,set:()=>setMan(0)}],
    stopRows:[{label:'II ハウプトヴェルク（上鍵盤・上の風箱）',items:HWST.map((si,i)=>({name:STOPS[si].name,ja:STOPS[si].ja,get:()=>m.hs[i],set:v=>m.hs[i]=v}))},{label:'I ポジティフ（下鍵盤・下の風箱）',items:POST.map((si,i)=>({name:STOPS[si].name,ja:STOPS[si].ja,get:()=>m.ps[i],set:v=>m.ps[i]=v}))}],
    ctl:{cpl:v=>m.cpl=v,man:v=>{ m.man=v; },pos:arr=>{ arr.forEach((v,i)=>m.ps[i]=!!v); syncStopUI(); },hw:arr=>{ arr.forEach((v,i)=>m.hs[i]=!!v); syncStopUI(); }},
    setMan,curMan:()=>m.man,hwView:[[330,hw.oy+200,hw.zF+330],[0,hw.oy+100,hw.zF-25]],
    pins:[{t:'上鍵盤（II・ハウプトヴェルク）',p:V3(-18,9,30)},{t:'下鍵盤（I・ポジティフ）',p:V3(-18,1,46)},{t:'カプラーのウィッペン',p:V3(17,YU+2,ZPU),max:110},{t:'ローラーボード（ポジティフ用）',p:V3(-36,32,-18)},{t:'ローラーボード（ハウプトヴェルク用）',p:V3(-36,pos.top+14,6)},{t:'ポジティフ',p:V3(40,pos.oy+20,pos.oz+12)},{t:'ハウプトヴェルク',p:V3(40,hw.oy+20,hw.oz+12)}],
    speaking:()=>hw.speaking().concat(pos.speaking()),
    update(dt){
      m.cu+=clamp((m.cpl?1:0)-m.cu,-dt*3,dt*3);
      const off=-OFF*(1-m.cu); railU.position.y=YU+off;
      for(let k=0;k<13;k++){
        const thU=m.man===1?Math.asin(clamp(DIP*S.kd[k]/up.Lk,0,1)):0;
        const thK=m.man===0?Math.asin(clamp(DIP*S.kd[k]/lo.Lk,0,1)):0;
        const aU=up.attach(k,thU), pU=UP.y+KH/2-aU.y, pK=(LO.za-LO.zt)*Math.sin(thK);
        const dA=Math.max(0,pU+off), cUp=Math.max(0,off+dA), dD=Math.max(pK,cUp*rD), c=dD/rD;
        // the lower key hangs from the lower backfall: when the coupler pulls the backfall down, the key goes down with it
        const thL=Math.asin(clamp(dD/(LO.za-LO.zt),0,1)); lo.set(k,thL); up.set(k,thU);
        const aL=lo.attach(k,thL), pL=dD;
        kdU[k]=Math.sin(thU)*up.Lk/DIP; kdP[k]=dD/pullL;
        const kdl=Math.sin(thL)*lo.Lk/DIP;
        for(const [mn,kd] of [[up,kdU[k]],[lo,kdl]]){ mn.keys[k].lm.emissive.copy(COL.key).multiplyScalar(0.6*Math.min(1,kd)); mn.keys[k].hm.emissive.copy(COL.key).multiplyScalar(0.35*Math.min(1,kd)); }
        const q=CW[k], x=q.x, PUv=V3(x,YU+off,ZPU), PLv=V3(x,YL,ZPL);
        const tA=V3(x,YU+off-dA,ZA), tB=V3(x,YU+off+dA,ZB), tC=V3(x,YL+c,ZB), tD=V3(x,YL-dD,ZD);
        q.ua.set(PUv,tA); q.ub.set(PUv,tB); q.la.set(PLv,tC); q.lb.set(PLv,tD);
        q.wire.set(tC,V3(x,YU+0.4+c,ZB)); q.nW.position.y=YU+0.4+c;
        q.nU.position.y=YU+0.4-pU; q.nL.position.y=YL+0.4-pL;
        q.tL.set(V3(x,YL+0.25-pL,ZD),aL,KH);
        for(const b of RB){
          const qq=b.it[k], pull=b.man===lo?dD:pU, rp=Math.asin(clamp(pull/b.ai,0,1)), rc=Math.cos(rp), rs=Math.sin(rp);
          const t1=V3(qq.x1,qq.yk-b.ai*rs,b.zr+b.ai*rc), t2=V3(qq.x2,qq.yk-AO*rs,b.zr+AO*rc);
          qq.ra1.set(V3(qq.x1,qq.yk,b.zr),t1); qq.ra2.set(V3(qq.x2,qq.yk,b.zr),t2);
          qq.t1.set(t1,b.man===lo?V3(x,tD.y-0.25,ZD):aU,b.man===lo?0.6:KH); qq.t2.set(b.ch.pullDown(k),t2,0.6);
        }
      }
      for(let i=0;i<4;i++) POSSP[i]+=clamp((m.ps[i]?1:0)-POSSP[i],-dt*2.5,dt*2.5);
      for(let i=0;i<6;i++) HWSP[i]+=clamp((m.hs[i]?1:0)-HWSP[i],-dt*2.5,dt*2.5);
      pos.update(dt); hw.update(dt);
    }};
}

