/* ---------- G-01: shove coupler with suspended actions ----------
   Both manuals are suspended (hängende Traktur): each key is pivoted at its tail in a rack and hangs from its tracker,
   so the whole key goes down when played. The trackers of the lower manual rise behind the upper manual's rack, so the
   lower keys are longer. Each tracker goes up to a roller board (unequal arms: the short arm takes the key's small pull,
   the long arm gives the pallet pull) and on to its chest. Coupler dogs stand on the lower keys just under the front
   edge of the upper keys: with the lower manual pushed in, an upper key pushes the lower key down with it, so the upper
   manual (II, Hauptwerk) also plays the lower division (I, Positiv). Pulled forward, the dogs stand clear in front of the
   upper keys. Playing the lower manual never moves the upper keys. */
function buildSuspManual(o){
  const G=new T.Group(); CX.root.add(G);
  const xp=k=>((k in SLOT?SLOT[k]:BPOS[k])-3.5)*3, Lk=o.zf-o.zt, y=o.y, keys=[];
  if(o.bedGap){ box(G,27,1,o.bedGap[0]-o.bed0,MAT.woodDark,0,y-3.2,(o.bed0+o.bedGap[0])/2,LB('鍵盤の底板','Klaviaturboden')); box(G,27,1,o.bed1-o.bedGap[1],MAT.woodDark,0,y-3.2,(o.bedGap[1]+o.bed1)/2,LB('鍵盤の底板の前の桟（あいだを下鍵盤の突起が通る）','Klaviaturboden')); }
  else box(G,27,1,o.bed1-o.bed0,MAT.woodDark,0,y-3.2,(o.bed0+o.bed1)/2,LB('鍵盤の底板','Klaviaturboden'));
  box(G,26,0.25,1.4,MAT.cloth,0,y-KH/2-o.dip*(o.zfelt-o.zt)/Lk-0.13,o.zfelt,LB('下止めのフェルト','Tastenfilz'));
  box(G,27,KH+3.5,2.4,MAT.wood,0,y-0.75,o.zt-1.6,LB('尾部のラック（鍵の支点）','Tastenrechen'));
  for(let j=0;j<=13;j++) box(G,0.22,KH+2,3.2,MAT.woodDark,(j-6.5)*1.95,y+0.3,o.zt+0.6,LB('ラックの仕切り（鍵の奥端を1本ずつ案内する）','Rechenstäbchen'));
  const pr=mk(G_ROD,MAT.iron,G,LB('支点のピン（鍵の奥端を貫く）','Drehstift')); pr.rotation.z=Math.PI/2; pr.scale.set(0.16,27,0.16); pr.position.set(0,y,o.zt+0.4);
  for(const s of [-1,1]) box(G,1.4,6,Lk+4,MAT.wood,s*13.6,y-0.8,(o.zf+o.zt)/2,LB(o.cheek,'Backe'));
  for(let k=0;k<13;k++){
    const w=(k in SLOT), x=xp(k), pv=new T.Group(); pv.position.set(x,y,o.zt); G.add(pv);
    const lm=o.mat(k), hm=mclone(w?MAT.ivory:MAT.ebony), lab=LB('鍵のレバー（'+KEYNAMES[k]+'。奥端のピンを支点に、トラッカーに吊られて上下する）','Tastenhebel');
    const fE=w?Lk:Lk-6;
    box(pv,w?1.45:1.2,KH,fE,lm,0,0,fE/2,lab);
    if(w){
      box(pv,2.75,0.6,6,hm,0,KH/2+0.3,Lk-3,LB('鍵 '+KEYNAMES[k]+'（白鍵の表面）','Untertaste'));
      const L=(k-1>=0&&!(k-1 in SLOT))?xp(k-1)+0.85-x:-1.4, Rr=(k+1<13&&!(k+1 in SLOT))?xp(k+1)-0.85-x:1.4;
      box(pv,Rr-L,0.6,11.1,hm,(L+Rr)/2,KH/2+0.3,Lk-11.5,LB('鍵 '+KEYNAMES[k]+'（白鍵の表面）','Untertaste'));
    } else box(pv,1.6,2,11,hm,0,KH/2+1,Lk-11.5,LB('鍵 '+KEYNAMES[k]+'（黒鍵）','Obertaste'));
    const hole=mk(G_DISC,MAT.dark,pv,LB('トラッカーを通す穴','Bohrung')); hole.rotation.x=-Math.PI/2; hole.scale.set(0.28,0.28,0.28); hole.position.set(0,KH/2+0.01,o.za-o.zt);
    let dogTop=null;
    if(o.dog!=null){
      const lz=o.dog-o.zt, base=KH/2, h=o.dogTop-y-base-0.2;
      box(pv,1.0,h,0.6,o.dogMat,0,base+h/2,lz,LB('カプラーの突起（下鍵盤の鍵に立つ。上鍵盤の鍵に押し下げられる）','Koppelklotz'));
      box(pv,1.0,0.2,0.6,MAT.cloth,0,base+h+0.1,lz,LB('突起の先のフェルト','Anschlagfilz'));
    }
    if(o.blk!=null){ const lz=o.blk-o.zt; box(pv,1.0,o.blkH,0.8,o.blkMat,0,-KH/2-o.blkH/2,lz,LB('上の鍵の下の当て木（カプラーを入れると、下鍵盤の突起の真上に来る）','Koppelklotz')); }
    pv.traverse(c=>{ c.userData.key=k; c.userData.man=o.man; });
    keys.push({pv,hm,lm,x});
  }
  return {G,keys,Lk,set(k,th){ keys[k].pv.rotation.x=th; },
    attach(k,th){ const lz=o.za-o.zt; return V3(keys[k].x,y+KH/2*Math.cos(th)-lz*Math.sin(th),G.position.z+o.zt+KH/2*Math.sin(th)+lz*Math.cos(th)); }};
}
function buildCoupler(){
  const R=CX.root, m={cpl:true,cu:1,man:1,ps:[true,true,false,false],hs:[true,true,false,true,false,false]}, SH=1.4, POSSP=new Float32Array([1,1,0,0]), HWSP=new Float32Array([1,1,0,1,0,0]), DIP=1.3;
  const POST=[0,1,10,4], POSR=[-4,4,12,-12], HWST=[5,6,7,8,3,9], HWR=[13.9,6.43,1.46,-2.44,-7.54,-14.58];
  const LO={y:0,zf:51.5,zt:-52,za:-17,bed0:-14,bed1:52.5,zfelt:50,dip:DIP,dog:20,dogTop:4.25,man:0,cheek:'下鍵盤（I・ポジティフ）の側板'};
  const UP={y:7,zf:34,zt:-12,za:8,bed0:-11,bed1:31.8,bedGap:[17.4,22.4],zfelt:30.8,dip:DIP,blk:20,blkH:1.5,man:1,cheek:'上鍵盤（II・ハウプトヴェルク）の側板'};
  const umats=[], lmats=[]; for(let k=0;k<13;k++){ umats.push(mclone(MAT.woodPale)); lmats.push(mclone(MAT.woodPale)); }
  UP.mat=k=>umats[k]; LO.mat=k=>lmats[k]; UP.blkMat=mclone(MAT.woodDark); UP.blkMat.color.set(0x6b4a2c); LO.dogMat=mclone(MAT.woodDark); LO.dogMat.color.set(0x6b4a2c);
  const lo=buildSuspManual(LO), up=buildSuspManual(UP);
  box(R,30,6.5,110,MAT.woodDark,0,-6.6,0,LB('演奏台（コンソール）の台','Spieltisch'));
  const kdL=new Float32Array(13), kdU=new Float32Array(13);
  const AO=4, pullL=DIP*(LO.za-LO.zt)/(LO.zf-LO.zt), pullU=DIP*(UP.za-UP.zt)/(UP.zf-UP.zt);
  const RB=[{man:lo,o:LO,ai:AO*pullL/KPULL,y0:12,kd:kdL,lab:'下鍵盤（I）',wn:'ポジティフ'},{man:up,o:UP,ai:AO*pullU/KPULL,y0:14,kd:kdU,lab:'上鍵盤（II）',wn:'ハウプトヴェルク'}];
  for(const b of RB){ b.zr=b.o.za-b.ai; b.zo=b.zr+AO; }
  const pos=buildChest({y:34,z:RB[0].zo-14,kd:kdL,sp:POSSP,stops:POST,rows:POSR,palMat:k=>lmats[k],volN:260});
  RB[1].y0=Math.ceil(pos.top)+3;
  const hw=buildChest({y:RB[1].y0+13*1.25+6,z:RB[1].zo-14,kd:kdU,sp:HWSP,stops:HWST,rows:HWR,mixz:[-2.4,0,2.4],P:9.6,palMat:k=>umats[k]});
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
        t1:makeTracker(mt,LB('トラッカー（'+b.lab+'の鍵 → ローラー。鍵はこれに吊られている）','Abstrakte')),
        ra1:rod(R,0.32,mt,LB('ローラーの短い腕（鍵の位置。鍵の小さな引きを受ける）','Wellenärmchen')),ra2:rod(R,0.32,mt,LB('ローラーの長い腕（パレットの位置。引きを大きくする）','Wellenärmchen')),
        t2:makeTracker(mt,LB('トラッカー（ローラー → '+b.wn+'の風箱のパレット）','Abstrakte'))});
    }
  }
  const setMan=v=>{ m.man=v; S.key.fill(false); syncKeyUI(); renderControls(); };
  return {chest:hw,
    controls:[{type:'toggle',id:'cpl',label:'カプラー（下鍵盤を押し込む）',get:()=>m.cpl,set:v=>m.cpl=v},
      {type:'toggle',id:'m1',label:'上鍵盤（II）を弾く',get:()=>m.man===1,set:()=>setMan(1)},
      {type:'toggle',id:'m0',label:'下鍵盤（I）を弾く',get:()=>m.man===0,set:()=>setMan(0)}],
    stopRows:[{label:'II ハウプトヴェルク（上鍵盤・上の風箱）',items:HWST.map((si,i)=>({name:STOPS[si].name,ja:STOPS[si].ja,get:()=>m.hs[i],set:v=>m.hs[i]=v}))},{label:'I ポジティフ（下鍵盤・下の風箱）',items:POST.map((si,i)=>({name:STOPS[si].name,ja:STOPS[si].ja,get:()=>m.ps[i],set:v=>m.ps[i]=v}))}],
    ctl:{cpl:v=>m.cpl=v,man:v=>{ m.man=v; },pos:arr=>{ arr.forEach((v,i)=>m.ps[i]=!!v); syncStopUI(); },hw:arr=>{ arr.forEach((v,i)=>m.hs[i]=!!v); syncStopUI(); }},
    setMan,curMan:()=>m.man,hwView:[[150,hw.oy+95,hw.oz+175],[0,hw.oy+45,hw.oz]],
    pins:[{t:'上鍵盤（II・ハウプトヴェルク）',p:V3(-18,9,30)},{t:'下鍵盤（I・ポジティフ）',p:V3(-18,1,39)},{t:'カプラーの突起',p:V3(16,4,34),max:90},{t:'ローラーボード（ポジティフ用）',p:V3(-36,26,-18)},{t:'ローラーボード（ハウプトヴェルク用）',p:V3(-36,pos.top+14,6)},{t:'ポジティフ',p:V3(40,pos.oy+20,pos.oz+12)},{t:'ハウプトヴェルク',p:V3(40,hw.oy+20,hw.oz+12)}],
    speaking:()=>hw.speaking().concat(pos.speaking()),
    update(dt){
      m.cu+=clamp((m.cpl?1:0)-m.cu,-dt*3,dt*3);
      const shift=SH*(1-m.cu); lo.G.position.z=shift;
      for(let k=0;k<13;k++){
        const w=(k in SLOT), d0=LO.dog, over=shift<0.7, dU=d0-UP.zt, dL=d0-LO.zt;
        const thU=m.man===1?Math.asin(clamp(DIP*S.kd[k]/up.Lk,0,1)):0;
        const thD=m.man===0?Math.asin(clamp(DIP*S.kd[k]/lo.Lk,0,1)):0;
        let thC=0;
        if(over){ const yub=UP.y-KH/2-UP.blkH-dU*Math.sin(thU); thC=Math.max(0,Math.asin(clamp((LO.dogTop-yub)/dL,-1,1))); }
        const thL=Math.max(thD,thC);
        lo.set(k,thL); up.set(k,thU);
        kdL[k]=Math.sin(thL)*lo.Lk/DIP; kdU[k]=Math.sin(thU)*up.Lk/DIP;
        for(const [mn,kd] of [[up,kdU[k]],[lo,kdL[k]]]){ mn.keys[k].lm.emissive.copy(COL.key).multiplyScalar(0.6*Math.min(1,kd)); mn.keys[k].hm.emissive.copy(COL.key).multiplyScalar(0.35*Math.min(1,kd)); }
        for(const b of RB){
          const th=b.man===lo?thL:thU, at=b.man.attach(k,th), q=b.it[k];
          const pull=b.o.y+KH/2-at.y, rp=Math.asin(clamp(pull/b.ai,0,1)), rc=Math.cos(rp), rs=Math.sin(rp);
          const t1=V3(q.x1,q.yk-b.ai*rs,b.zr+b.ai*rc), t2=V3(q.x2,q.yk-AO*rs,b.zr+AO*rc);
          q.ra1.set(V3(q.x1,q.yk,b.zr),t1); q.ra2.set(V3(q.x2,q.yk,b.zr),t2);
          q.t1.set(t1,at,KH); q.t2.set(b.ch.pullDown(k),t2,0.6);
        }
      }
      for(let i=0;i<4;i++) POSSP[i]+=clamp((m.ps[i]?1:0)-POSSP[i],-dt*2.5,dt*2.5);
      for(let i=0;i<6;i++) HWSP[i]+=clamp((m.hs[i]?1:0)-HWSP[i],-dt*2.5,dt*2.5);
      pos.update(dt); hw.update(dt);
    }};
}

