/* ---------------- keyboard & key actions ---------------- */
const SLOT={0:0,2:1,4:2,5:3,7:4,9:5,11:6,12:7}, BPOS={1:.5,3:1.5,6:3.5,8:4.5,10:5.5};
/* Suspended keyboard (hängende Klaviatur): each key lever is pivoted on a pin in the tail rack and hangs from its tracker,
   which is attached behind the sharps. Pull at the tracker = 1.35 × key depth (same as the pallet pull-down travel). */
const KLEN=56, KATT=20, KPULL=1.35, KH=2.4, TAILP=1.75;
function buildKeyboard(o){
  const R=CX.root, KB={piv:[]}, zt=o.z-KLEN, y0=o.y+KH/2, dA=KLEN-KATT;
  const xp=k=>o.x+((k in SLOT?SLOT[k]:BPOS[k])-3.5)*3;
  KB.kx=k=>o.x+(k-6)*TAILP;
  KB.th=k=>KPULL*S.kd[k]/dA;
  // frame
  box(R,30,1,KLEN+6,MAT.woodDark,o.x,o.y-3,zt+KLEN/2-1,LB('鍵盤の底板','Klaviaturboden'));
  box(R,26,0.4,1.6,MAT.cloth,o.x,o.y-KPULL*KLEN/dA-0.2,o.z-1.4,LB('下止めのフェルト（白鍵の深さを決める）','Tastenfilz'));
  box(R,26,0.4,1.4,MAT.cloth,o.x,o.y-KPULL*(KLEN-7)/dA-0.2,o.z-7.5,LB('下止めのフェルト（黒鍵の深さを決める）','Tastenfilz'));
  box(R,26,0.6,1.4,MAT.wood,o.x,o.y-2.2,o.z-10,LB('ガイドピンの桟','Führungsleiste'));
  for(let k=0;k<13;k++){ const g=rod(R,0.12,MAT.brass,LB('前のガイドピン（鍵の下の溝に入り、鍵が左右に振れないよう案内する）','Führungsstift')); g.set(V3(xp(k),o.y-2.2,o.z-10),V3(xp(k),o.y+0.8,o.z-10)); }
  const rw=13*TAILP+3;
  box(R,rw,KH+3.5,2.4,MAT.wood,o.x,o.y-0.75,zt-1.6,LB('尾部のラック（鍵の支点）','Tastenrechen'));
  for(let j=0;j<=13;j++) box(R,0.22,KH+2,3.2,MAT.woodDark,o.x+(j-6.5)*TAILP,y0+0.3,zt+0.6,LB('ラックの仕切り（鍵の奥端を1本ずつ案内する）','Rechenstäbchen'));
  const pr=mk(G_ROD,MAT.iron,R,LB('支点のピン（鍵の奥端を貫く）','Drehstift')); pr.rotation.z=Math.PI/2; pr.scale.set(0.16,rw,0.16); pr.position.set(o.x,y0,zt+0.4);
  for(const s of [-1,1]){ box(R,1.4,7,19,MAT.wood,o.x+s*13.6,o.y+0.5,o.z-9,LB('鍵盤の側板','Backe')); box(R,1.4,KH+4.5,2,MAT.wood,o.x+s*13.6,o.y+0.75,o.z-26,LB('上止めの桟の支柱','Anschlagleistenstütze')); }
  box(R,28.6,1.2,2,MAT.wood,o.x,o.y+KH+0.75,o.z-26,LB('上止めの桟（鍵が戻る高さを決める）','Anschlagleiste'));
  box(R,26,0.3,2,MAT.cloth,o.x,o.y+KH+0.05,o.z-26,LB('上止めのフェルト','Anschlagfilz'));
  // keys
  for(let k=0;k<13;k++){
    const w=(k in SLOT), pv=new T.Group(); pv.position.set(0,y0,zt); R.add(pv);
    const lm=keyMat(k), xt=KB.kx(k), xk=xp(k), hm=mclone(w?MAT.ivory:MAT.ebony);
    const lab=LB('鍵のレバー（'+KEYNAMES[k]+'。奥端のピンを支点に上下する）','Tastenhebel');
    box(pv,1.45,KH,KLEN-19.5,lm,xt,0,(KLEN-19.5)/2,lab);
    const cr=plank(pv,1.45,KH,lm,lab); cr.set(V3(xt,0,KLEN-19.6),V3(xk,0,KLEN-16.9));
    const fEnd=w?KLEN:KLEN-6;
    box(pv,1.45,KH,fEnd-(KLEN-17),lm,xk,0,(fEnd+KLEN-17)/2,lab);
    if(w){
      box(pv,2.75,0.6,6,hm,xk,KH/2+0.3,KLEN-3,LB('鍵 '+KEYNAMES[k]+'（白鍵の表面）','Untertaste'));
      const L=(k-1>=0&&!(k-1 in SLOT))?xp(k-1)+0.85:xk-1.4, Rr=(k+1<13&&!(k+1 in SLOT))?xp(k+1)-0.85:xk+1.4;
      box(pv,Rr-L,0.6,11.1,hm,(L+Rr)/2,KH/2+0.3,KLEN-11.5,LB('鍵 '+KEYNAMES[k]+'（白鍵の表面）','Untertaste'));
    } else {
      box(pv,1.6,2,11,hm,xk,KH/2+1,KLEN-11.5,LB('鍵 '+KEYNAMES[k]+'（黒鍵）','Obertaste'));
    }
    const hole=mk(G_DISC,MAT.dark,pv,LB('トラッカーを通す穴','Bohrung')); hole.rotation.x=-Math.PI/2; hole.scale.set(0.28,0.28,0.28); hole.position.set(xt,KH/2+0.01,dA);
    pv.traverse(c=>c.userData.key=k);
    KB.piv.push({pv,hm,xt});
  }
  const toW=(k,ly,lz)=>{ const t=KB.th(k); return V3(KB.piv[k].xt,y0+ly*Math.cos(t)-lz*Math.sin(t),zt+ly*Math.sin(t)+lz*Math.cos(t)); };
  KB.attach=k=>toW(k,KH/2,dA);
  KB.update=()=>{ for(let k=0;k<13;k++){ const q=KB.piv[k]; q.pv.rotation.x=KB.th(k); q.hm.emissive.copy(COL.key).multiplyScalar(0.35*S.kd[k]); } };
  return KB;
}
/* A tracker as built: thin flat wooden strip, a threaded wire at each end, a leather nut where it meets a key or arm. */
function makeTracker(m,label){
  const R=CX.root;
  const wTop=rod(R,0.07,MAT.iron,LB('ワイヤー（トラッカーの上端）','Draht'));
  const wBot=rod(R,0.07,MAT.iron,LB('ネジ線（鍵や腕の穴を通る）','Gewindedraht'));
  const wood=plank(R,0.9,0.22,m,label);
  const nTop=mk(G_CYL,MAT.leather,R,LB('革ナット（回して長さを調整する）','Ledermutter')); nTop.scale.set(0.42,0.3,0.42);
  const nBot=mk(G_CYL,MAT.leather,R,LB('革ナット（鍵や腕の下で受ける。回して長さを調整する）','Ledermutter')); nBot.scale.set(0.45,0.34,0.45);
  const B=V3(0,0,0),Cc=V3(0,0,0),D=V3(0,0,0),dir=V3(0,0,0);
  return {set(top,bottom,thick){
    dir.subVectors(bottom,top); const L=dir.length()||1e-3; dir.divideScalar(L);
    B.copy(top).addScaledVector(dir,Math.min(3,L*0.18)); Cc.copy(bottom).addScaledVector(dir,-Math.min(3.2,L*0.2)); D.copy(bottom).addScaledVector(dir,thick+0.25);
    wTop.set(top,B); wood.set(B,Cc); wBot.set(Cc,D);
    nTop.position.copy(top).addScaledVector(dir,-0.15); nTop.quaternion.setFromUnitVectors(UP,dir);
    nBot.position.copy(D).addScaledVector(dir,-0.05); nBot.quaternion.setFromUnitVectors(UP,dir);
  }};
}
function buildSuspended(chest,kb){
  const trs=[]; for(let k=0;k<13;k++) trs.push(makeTracker(keyMat(k),LB('トラッカー（'+KEYNAMES[k]+'。鍵を風箱のパレットに吊る薄い木の棒）','Abstrakte')));
  return {update(){ for(let k=0;k<13;k++) trs[k].set(chest.pullDown(k),kb.attach(k),KH); }};
}
function buildRollerSquare(chest,kb){
  const R=CX.root, items=[], zr=11, a=3, ys1=34, zs2=chest.oz+14-a;
  const xs=[]; for(let k=0;k<13;k++){ xs.push(kb.kx(k),chest.pos(k)); }
  const xmin=Math.min(...xs)-3, xmax=Math.max(...xs)+3;
  box(R,xmax-xmin,20,0.8,MAT.wood,(xmin+xmax)/2,21.5,zr-1.1,LB('ローラーボード（ローラーを支える板）','Wellenbrett'));
  box(R,xmax-xmin,1.2,1.2,MAT.woodDark,(xmin+xmax)/2,ys1,zr-0.9,LB('スクエアの軸受け','Winkelbalken'));
  box(R,chest.W+4,1.2,1.2,MAT.woodDark,chest.ox,ys1,zs2-0.9,LB('スクエアの軸受け','Winkelbalken'));
  for(let k=0;k<13;k++){
    const x1=kb.kx(k), x2=chest.pos(k), yk=13.5+k*1.25, m=keyMat(k);
    const roll=mk(G_CYL,m,R,LB('ローラー（'+KEYNAMES[k]+'。回転して引く位置を左右に移す）','Welle')); roll.rotation.z=Math.PI/2; roll.scale.set(0.42,Math.abs(x2-x1)+1.4,0.42); roll.position.set((x1+x2)/2,yk,zr);
    for(const xx of [Math.min(x1,x2)-0.9,Math.max(x1,x2)+0.9]) box(R,0.7,1.6,1.4,MAT.woodDark,xx,yk,zr-0.4,LB('ローラーの軸受け（ローラーの両端のピンを受ける）','Wellenböckchen'));
    const it={k,x1,x2,yk,m,
      t1:makeTracker(m,LB('トラッカー（鍵→ローラー）','Abstrakte')),
      a1:rod(R,0.32,m,LB('ローラーの腕','Wellenärmchen')), a2:rod(R,0.32,m,LB('ローラーの腕','Wellenärmchen')),
      t2:makeTracker(m,LB('トラッカー（ローラー→スクエア）','Abstrakte')),
      sa:rod(R,0.32,m,LB('スクエア（L字の腕木。引く向きを90度変える）','Winkel')), sb:rod(R,0.32,m,LB('スクエア','Winkel')),
      t3:makeTracker(m,LB('水平のトラッカー','Abstrakte')),
      sc:rod(R,0.32,m,LB('スクエア（風箱側）','Winkel')), sd:rod(R,0.32,m,LB('スクエア（風箱側）','Winkel')),
      t4:makeTracker(m,LB('トラッカー（スクエア→パレット）','Abstrakte'))};
    items.push(it);
  }
  return {update(){
    for(const it of items){
      const dy=KPULL*S.kd[it.k]; const ph=Math.asin(clamp(dy/a,0,1));
      const c=Math.cos(ph), s=Math.sin(ph);
      const tip1=V3(it.x1,it.yk-a*s,zr+a*c), tip2=V3(it.x2,it.yk-a*s,zr+a*c);
      it.t1.set(tip1,kb.attach(it.k),KH); it.a1.set(V3(it.x1,it.yk,zr),tip1); it.a2.set(V3(it.x2,it.yk,zr),tip2);
      const piv1=V3(it.x2,ys1,zr), saT=V3(it.x2,ys1-a*s,zr+a*c), sbT=V3(it.x2,ys1+a*c,zr+a*s);
      it.t2.set(saT,tip2,0.6); it.sa.set(piv1,saT); it.sb.set(piv1,sbT);
      const piv2=V3(it.x2,ys1,zs2), sdT=V3(it.x2,ys1-a*s,zs2+a*c), scT=V3(it.x2,ys1+a*c,zs2+a*s);
      it.t3.set(sbT,scT,0.6); it.sc.set(piv2,scT); it.sd.set(piv2,sdT);
      it.t4.set(chest.pullDown(it.k),sdT,0.6);
    }
  }};
}
function buildStopAction(chest,o){
  const R=CX.root, a1=8, a2=4, xr=chest.ox-chest.W/2-20, xk=xr+a1, yTop=chest.oy+26;
  box(R,5,26,3,MAT.wood,xk,o.ky0+8,o.kz-1.6,LB('ストップノブの板（ストップジャム）','Registerbank'));
  const its=[];
  for(let i=0;i<5;i++){
    const yk=o.ky0+i*4, zs=chest.oz+ZROW[i], zr=zs+a2, m=stopMat(i);
    const knob=mk(G_CYL,MAT.ebony,R,LB('ストップノブ：'+STOPS[i].name+'（手前に引くと入る）','Registerzug')); knob.rotation.x=Math.PI/2; knob.scale.set(1.3,2.2,1.3);
    const face=mk(G_CYL,MAT.ivory,R,LB('ストップ名の札：'+STOPS[i].name,'Registerschild')); face.rotation.x=Math.PI/2; face.scale.set(0.95,0.25,0.95);
    knob.userData.stop=i; face.userData.stop=i;
    const roller=cyl(R,0.6,yTop-yk,m,xr,(yTop+yk)/2,zr,LB('ストップのローラー（縦軸で回る）','Registerwelle'));
    its.push({i,yk,zs,zr,m,knob,face,roller,
      shaft:rod(R,0.35,m,LB('ノブの軸（トレース）','Registerzugstange')),
      arm1:rod(R,0.4,m,LB('ローラーの下の腕（8）','Registerärmchen')),
      arm2:rod(R,0.4,m,LB('ローラーの上の腕（4）','Registerärmchen')),
      link:rod(R,0.35,m,LB('スライダーへのつなぎ棒','Schleifenzug'))});
  }
  return {update(){
    for(const it of its){
      const sp=S.sp[it.i], ps=-Math.asin(clamp(3.6*sp/a1,0,1));
      const tip1=V3(xr+a1*Math.cos(ps),it.yk,it.zr-a1*Math.sin(ps));
      const tip2=V3(xr-a2*Math.sin(ps),yTop,it.zr-a2*Math.cos(ps));
      const kz=o.kz+3.6*sp;
      it.knob.position.set(xk,it.yk,kz+1.1); it.face.position.set(xk,it.yk,kz+2.3);
      it.shaft.set(V3(xk,it.yk,kz),tip1); it.arm1.set(V3(xr,it.yk,it.zr),tip1); it.arm2.set(V3(xr,yTop,it.zr),tip2);
      it.link.set(tip2,V3(chest.ox-chest.W/2-12-1.8*(1-sp),yTop,it.zs));
    }
  }};
}

