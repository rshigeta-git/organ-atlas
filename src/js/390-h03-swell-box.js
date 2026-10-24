/* ---------- Positiv swell box: walls round the Positiv, horizontal shutters in front, worked from a balanced swell pedal ---------- */
function h3Swell(B){
  const ST=B.ST, xa=-216, xb=208, yb=204, yt=398, zb=-82, zf=-3, LS=LB('スウェルボックス（ポジティフを囲む箱。前面のシャッターの開き具合で音量が変わる）','Schwellkasten');
  box(ST,xb-xa+3,3,zf-zb,MAT.wood,(xa+xb)/2,yb-1.5,(zf+zb)/2,LS); box(ST,xb-xa+3,3,zf-zb,MAT.wood,(xa+xb)/2,yt+1.5,(zf+zb)/2,LS);
  box(ST,xb-xa+3,yt-yb,3,MAT.wood,(xa+xb)/2,(yt+yb)/2,zb-1.5,LS);
  for(const x of [xa-1.5,xb+1.5]) box(ST,3,yt-yb+6,zf-zb+3,MAT.wood,x,(yt+yb)/2,(zf+zb)/2,LS);
  box(ST,xb-xa,4,4,MAT.woodDark,(xa+xb)/2,yb+2,zf,LB('シャッターの枠','Jalousierahmen')); box(ST,xb-xa,4,4,MAT.woodDark,(xa+xb)/2,yt-2,zf,LB('シャッターの枠','Jalousierahmen'));
  const NB=13, bh=(yt-yb-8)/NB, SH=mclone(MAT.woodPale), LB_=LB('シャッター（羽根板。横の軸で回り、開くと音が外へ出る）','Jalousie');
  const bl=[], arms=[]; for(let j=0;j<NB;j++){ const y=yb+4+bh*(j+0.5); bl.push({y,h:CX.pool.add(G_BOX,SH,LB_)}); arms.push(prod(MAT.iron,0.4,LB('シャッターの腕','Jalousiearm')));
    const ax=mk(G_ROD,MAT.iron,ST,LB('シャッターの軸','Achse')); ax.rotation.z=Math.PI/2; ax.scale.set(0.35,xb-xa+8,0.35); ax.position.set((xa+xb)/2,y,zf); }
  const XL=xb+4, AL=13.5;
  const bar=prod(MAT.woodDark,0.6,LB('シャッターの連結棒（全部の羽根をいっしょに回す）','Jalousiestange'));
  // swell pedal (balanced) above the pedalboard, axle under the console to the right side, arm and rod up to the shutters
  const SX=10, SY=38, SZ=2, AX1=XL;
  const axl=mk(G_ROD,MAT.iron,ST,LB('スウェルペダルの軸（演奏台の下を右へ通る）','Schwelltrittachse')); axl.rotation.z=Math.PI/2; axl.scale.set(0.7,AX1-SX+4,0.7); axl.position.set((SX+AX1)/2,SY,SZ);
  for(const x of [SX+8,AX1+2]) box(ST,3,SY,3,MAT.woodDark,x,SY/2,SZ,LB('スウェルペダルの軸受け','Schwelltrittlager'));
  const shoe=CX.pool.add(G_BOX,MAT.woodDark,LB('スウェルペダル（つま先で踏み込むとシャッターが開く。手を離した位置で止まる）','Schwelltritt'));
  const sArm=prod(MAT.iron,0.6,LB('スウェルペダルの軸の腕','Schwelltrittarm'));
  const st={v:0.25};
  const set=s=>{
    const th=1.3*s, phi=Math.asin(clamp(AL*Math.sin(th)/16.5,-1,1));
    for(let j=0;j<NB;j++){ const b=bl[j]; _mv.set((xa+xb)/2,b.y,zf); _q.setFromAxisAngle(V3(1,0,0),th); _sv.set(xb-xa-1,bh-0.6,1.4); b.h.m.compose(_mv,_q,_sv);
      arms[j].set(V3(XL,b.y,zf),V3(XL,b.y+AL*Math.sin(th),zf-AL*Math.cos(th))); }
    const tTop=V3(XL,bl[NB-1].y+AL*Math.sin(th),zf-AL*Math.cos(th)), tBot=V3(AX1,SY+16.5*Math.sin(phi),SZ-16.5*Math.cos(phi));
    bar.set(tBot,tTop); sArm.set(V3(AX1,SY,SZ),tBot);
    const a=-0.25+0.5*s; _mv.set(SX,SY+1.5*Math.cos(a),SZ+1.5*Math.sin(a)); _q.setFromAxisAngle(V3(1,0,0),-a); _sv.set(12,1.6,28); shoe.m.compose(_mv,_q,_sv);
  };
  st.set=set; st.box={xa,xb,yb,yt,zb,zf};
  return st;
}
