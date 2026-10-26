/* ---------- Positiv swell box: walls round the Positiv, two windows in front with vertical shutters that open symmetrically
   about the centre line, worked from a balanced swell pedal ---------- */
function h3Swell(B){
  const ST=B.ST, xa=-216, xb=208, yb=204, yt=418, zb=-89, zf=-3, LS=LB('スウェルボックス（ポジティフを囲む箱。前面のシャッターの開き具合で音量が変わる）','Schwellkasten');
  box(ST,xb-xa+3,3,zf-zb,MAT.wood,(xa+xb)/2,yb-1.5,(zf+zb)/2,LS); box(ST,xb-xa+3,3,zf-zb,MAT.wood,(xa+xb)/2,yt+1.5,(zf+zb)/2,LS);
  box(ST,xb-xa+3,yt-yb,3,MAT.wood,(xa+xb)/2,(yt+yb)/2,zb-1.5,LS);
  for(const x of [xa-1.5,xb+1.5]) box(ST,3,yt-yb+6,zf-zb+3,MAT.wood,x,(yt+yb)/2,(zf+zb)/2,LS);
  /* front: a board with two windows side by side (160 × 150 each, 30 apart), framed by rails that carry the shutter axles */
  const xc=(xa+xb)/2, WW=160, WG=30, WH=150, yc=(yb+yt)/2, wy0=yc-WH/2, wy1=yc+WH/2, ZP=-1.75, LF=LB('スウェルボックスの前板（2つの窓がある）','Schwellkasten');
  const win=[[xc-WG/2-WW,xc-WG/2],[xc+WG/2,xc+WG/2+WW]];
  box(ST,xb-xa,wy0-4-yb,1.5,MAT.wood,xc,(wy0-4+yb)/2,ZP,LF); box(ST,xb-xa,yt-(wy1+4),1.5,MAT.wood,xc,(yt+wy1+4)/2,ZP,LF);
  for(const [x0,x1] of [[xa,win[0][0]],[win[0][1],win[1][0]],[win[1][1],xb]]) box(ST,x1-x0,WH+8,1.5,MAT.wood,(x0+x1)/2,yc,ZP,LF);
  const LR=LB('シャッターの枠（上下の桟に羽根の軸が入る）','Jalousierahmen');
  for(const [x0,x1] of win) for(const y of [wy0-2,wy1+2]) box(ST,x1-x0,4,3.5,MAT.woodDark,(x0+x1)/2,y,-2.75,LR);
  /* shutters: vertical blades on vertical axles; under each window an arm on every axle points back to a bar along x.
     The left window's blades turn one way, the right window's the other, so both windows open from their centre outwards alike */
  const NB=11, AL=4, YA=wy0-8, SH=mclone(MAT.woodPale), LB_=LB('シャッター（縦の羽根板。縦の軸で回り、開くと音が外へ出る）','Jalousie');
  const bl=[]; win.forEach(([x0,x1],w)=>{ const bw=(x1-x0)/NB; for(let j=0;j<NB;j++){ const x=x0+bw*(j+0.5);
    bl.push({x,w,bw,h:CX.pool.add(G_BOX,SH,LB_),arm:prod(MAT.iron,0.4,LB('シャッターの腕','Jalousiearm'))});
    rod(ST,0.35,MAT.iron,LB('シャッターの軸','Achse')).set(V3(x,YA-1,zf),V3(x,wy1+3.5,zf)); } });
  const bars=[0,1].map(()=>prod(MAT.woodDark,0.6,LB('シャッターの連結棒（窓ひとつ分の羽根をいっしょに回す。左右で逆向きに動く）','Jalousiestange')));
  /* swell pedal (balanced) above the pedalboard; its axle runs under the console to both sides of the swell box. At each end an
     arm pointing forward lifts a pull rod; the rod turns a short roller standing on the box's side wall (axis along z), whose
     hanging arm pushes the bar of that side's window sideways. The two rollers are mirror images, so the bars move apart. */
  // balanced swell shoe in front of the E-F gap of the pedal, standing in front of the kneeboard (toe end at z 5, over the far
  // ends of the pedal sharps) on its own pivot, borne by two cheeks fixed to the kneeboard. A downward arm on the shoe's pivot
  // and an equal one on the axle behind the kneeboard are joined by a link rod: a parallelogram, so the axle turns as the shoe.
  // Closed: toe raised 30°; fully open: toe 5° above level.
  const SX=10, SY=19, SZ=-7, SZS=17.5, RA=4, TH0=0.52, XE=[xa-4,xb+4], R1=2.5, R2=5, SA=4.6, ZR=SZ+SA, YB=YA+R2;
  const axl=rod(ST,0.7,MAT.iron,LB('スウェルペダルの軸（演奏台の下を左右へ通る）','Schwelltrittachse')); axl.set(V3(XE[0]-R1-1.5,SY,SZ),V3(XE[1]+R1+1.5,SY,SZ));
  // the bearing over the pedalboard hangs from the console (it must clear the pedal keys under it); the outer ones stand on the floor
  { const yT=B.Y0-9.9; box(ST,3,yT-SY+2,3,MAT.woodDark,SX+8,(yT+SY-2)/2,SZ,LB('スウェルペダルの軸受け（演奏台から吊る）','Schwelltrittlager')); }
  for(const [i,s] of [[0,-1],[1,1]]){ const xr=XE[i]+s*R1;
    box(ST,3,SY,3,MAT.woodDark,xr+s*2,SY/2,SZ,LB('スウェルペダルの軸受け','Schwelltrittlager'));
    const wl=mk(G_CYL,MAT.woodPale,ST,LB('シャッターのローラー（縦の動きを横の動きに変える）','Jalousiewelle')); wl.rotation.x=Math.PI/2; wl.scale.set(0.6,ZR-zf+4.5,0.6); wl.position.set(XE[i],YB,(ZR+zf-AL)/2);
    for(const z of [ZR-0.8,zf-AL+0.8]) box(ST,1.5,2,1.2,MAT.woodDark,XE[i]-s*0.4,YB,z,LB('ローラーの軸受け','Wellenböckchen')); }
  const shoe=CX.pool.add(G_BOX,MAT.woodDark,LB('スウェルペダル（つま先で踏み込むとシャッターが開く。足を離した位置で止まる）','Schwelltritt'));
  const L=[0,1].map(i=>({sArm:prod(MAT.iron,0.6,LB('スウェルペダルの軸の腕','Schwelltrittarm')),rodV:prod(MAT.iron,0.4,LB('引き棒（スウェルペダル → シャッターのローラー）','Schwelltrittstange')),
    a1:prod(MAT.iron,0.45,LB('ローラーの腕（引き棒の側）','Jalousiewelle')),a2:prod(MAT.iron,0.45,LB('ローラーの腕（連結棒を押す）','Jalousiewelle')),lk:prod(MAT.iron,0.35,LB('つなぎ棒','Jalousiestange'))}));
  const LSL=LB('スウェルペダルの軸受け（ひざ板に付ける）','Schwelltrittlager');
  for(const s of [-1,1]) box(ST,1.2,8,SZS+2-3.5,MAT.woodDark,SX+s*7,SY,(SZS+2+3.5)/2,LSL);
  rod(ST,0.5,MAT.iron,LB('スウェルペダルの軸','Schwelltrittachse')).set(V3(SX-7.6,SY,SZS),V3(SX+7.6,SY,SZS));
  const pl={aS:prod(MAT.iron,0.45,LB('スウェルペダルの下向きの腕','Schwelltrittarm')),aM:prod(MAT.iron,0.45,LB('軸の下向きの腕','Schwelltrittarm')),
    lk:prod(MAT.iron,0.35,LB('つなぎ棒（スウェルペダル → ひざ板の奥の軸。ひざ板の細い穴を通る）','Schwelltrittstange'))};
  const st={v:0.25};
  const set=s=>{
    const th=1.3*s, dx=AL*Math.sin(th), ps=dx/R2, psi=Math.asin(clamp(ps,-1,1)), phi=Math.asin(clamp(R1*ps/SA,-1,1));
    for(const b of bl){ const sg=b.w?1:-1; _mv.set(b.x,yc,zf); _q.setFromAxisAngle(V3(0,1,0),-sg*th); _sv.set(b.bw-0.6,WH-1,1.2); b.h.m.compose(_mv,_q,_sv);
      b.arm.set(V3(b.x,YA,zf),V3(b.x+sg*dx,YA,zf-AL)); }
    win.forEach(([x0,x1],w)=>{ const sg=w?1:-1; bars[w].set(V3(x0+sg*dx-1,YA,zf-AL),V3(x1+sg*dx+1,YA,zf-AL)); });
    L.forEach((q,i)=>{ const s_=i?1:-1, ax=XE[i]+s_*R1, tip=V3(ax,SY+SA*Math.sin(phi),SZ+SA*Math.cos(phi));
      const t1=V3(XE[i]+s_*R1*Math.cos(psi),YB+R1*Math.sin(psi),ZR), t2=V3(XE[i]+s_*R2*Math.sin(psi),YB-R2*Math.cos(psi),zf-AL);
      q.sArm.set(V3(ax,SY,SZ),tip); q.rodV.set(tip,t1); q.a1.set(V3(XE[i],YB,ZR),t1); q.a2.set(V3(XE[i],YB,zf-AL),t2);
      q.lk.set(t2,V3(i?win[1][1]+dx+1:win[0][0]-dx-1,YA,zf-AL)); });
    const mA=V3(SX,SY-RA*Math.cos(phi),SZ+RA*Math.sin(phi)), sA=V3(SX,SY-RA*Math.cos(phi),SZS+RA*Math.sin(phi));
    pl.aM.set(V3(SX,SY,SZ),mA); pl.aS.set(V3(SX,SY,SZS),sA); pl.lk.set(mA,sA);
    const a=TH0-phi; _mv.set(SX,SY+1.5*Math.cos(a),SZS+1.5*Math.sin(a)); _q.setFromAxisAngle(V3(1,0,0),a); _sv.set(12,1.6,28); shoe.m.compose(_mv,_q,_sv);
  };
  st.set=set; st.box={xa,xb,yb,yt,zb,zf};
  return st;
}
