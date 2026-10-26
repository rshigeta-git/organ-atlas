/* ---------- F-01: swell box ---------- */
function buildSwell(){
  const R=CX.root, m={open:0.5,t:0,em:0};
  const chest=buildChest({y:0,inlet:'R'});
  const X0=-38, X1=38, Z0=-21, Z1=21, Y0=28, Y1=96, NS=8, sh=(Y1-Y0)/NS;
  const LW=LB('スウェルボックス（パイプを囲む厚い木の箱）','Schwellkasten');
  box(R,X1-X0,Y1-Y0,1.6,MAT.woodDark,0,(Y0+Y1)/2,Z0,LW); box(R,1.6,Y1-Y0,Z1-Z0,MAT.woodDark,X0,(Y0+Y1)/2,0,LW); box(R,1.6,Y1-Y0,Z1-Z0,MAT.woodDark,X1,(Y0+Y1)/2,0,LW);
  box(R,X1-X0+1.6,1.6,Z1-Z0+1.6,MAT.woodDark,0,Y1+0.8,0,LW); box(R,X1-X0+1.6,1.2,Z1-Z0,MAT.woodDark,0,Y0-0.6,0,LW);
  const SM=mclone(MAT.wood), shutters=[];
  for(let j=0;j<NS;j++){ const g=new T.Group(); g.position.set(0,Y0+sh*(j+0.5),Z1); R.add(g); box(g,X1-X0-1.6,sh*1.02,0.9,SM,0,0,0,LB('シャッター（よろい戸。開くと音が外へ出る）','Jalousie')); shutters.push(g); }
  const crank=[], rodV=rod(R,0.3,MAT.iron,LB('連結棒（すべてのシャッターを同時に動かす）','Zugstange'));
  for(let j=0;j<NS;j++) crank.push(rod(R,0.25,MAT.iron,LB('シャッターの腕','Jalousiehebel')));
  const trace=rod(R,0.35,MAT.woodDark,LB('トレース（ペダルの動きを箱へ伝える棒）','Zugstange')), bc1=rod(R,0.35,MAT.iron,LB('ベルクランク（向きを変えるL字のてこ）','Winkel')), bc2=rod(R,0.35,MAT.iron,LB('ベルクランク','Winkel'));
  const ped=new T.Group(); ped.position.set(0,-6,44); R.add(ped);
  box(ped,9,0.8,16,MAT.woodDark,0,0,0,LB('スウェルペダル（バランス式。足を離してもその角度で止まる）','Schwelltritt'));
  box(R,10,6,3,MAT.wood,0,-10,44,LB('ペダルの台','Schwelltrittlager'));
  const parm=rod(R,0.35,MAT.iron,LB('ペダルの腕','Schwelltritthebel'));
  // sound waves leaving the box: rings in front of the shutters
  const RG=new T.RingGeometry(0.94,1,64); CX.own.push(RG); const rings=[];
  for(let i=0;i<18;i++){ const mt=new T.MeshBasicMaterial({color:COL.sound.getHex(),transparent:true,opacity:0,side:T.DoubleSide,depthWrite:false}); CX.own.push(mt); const r=new T.Mesh(RG,mt); r.visible=false; r.userData.age=1; R.add(r); rings.push(r); }
  const XB=X1+3;
  return {chest,
    controls:[{type:'range',id:'swell',label:'スウェルペダル',min:0,max:1,step:0.01,get:()=>m.open,set:v=>m.open=v,fmt:()=>TF('開き {0} %',Math.round(m.open*100))}],
    ctl:{swell:v=>m.open=v},
    pins:[{t:'スウェルボックス',p:V3(X0-2,Y1-6,0)},{t:'シャッター',p:V3(X1-12,Y1-4,Z1+3)},{t:'スウェルペダル',p:V3(0,-3,52)},{t:'トレース・ベルクランク',p:V3(XB+2,10,30)}],
    swell:()=>m.open,
    update(dt){
      chest.update(dt);
      const a=m.open*1.25;
      shutters.forEach(g=>g.rotation.x=-a);
      // linkage: cranks on the shutters' right ends, a vertical rod, bellcrank at the bottom, trace to the pedal
      const cr=3, dy=-cr*Math.sin(a);
      for(let j=0;j<NS;j++){ const yc=Y0+sh*(j+0.5); crank[j].set(V3(X1-0.5,yc,Z1),V3(XB,yc+dy,Z1+cr*Math.cos(a))); }
      const rz=Z1+cr*Math.cos(a), yb=12;
      rodV.set(V3(XB,Y0+sh*(NS-0.5)+dy,rz),V3(XB,yb+4*Math.sin(-a*0.6)+dy,rz));
      const pv=V3(XB,yb,rz-4), e1=V3(XB,yb+dy,rz), e2=V3(XB,yb-4+0,rz-4+dy*0.8);
      bc1.set(pv,e1); bc2.set(pv,e2);
      const pt=(m.open-0.5)*0.45; ped.rotation.x=pt;
      const pa=V3(0,-6-3*Math.cos(pt),44+3*Math.sin(pt)); parm.set(V3(0,-6,44),pa);
      trace.set(V3(XB,e2.y,e2.z),V3(XB,pa.y+0.0,pa.z)); trace.position.x=XB;
      // waves
      const n=chest.speaking().length; m.t+=dt; m.em-=dt;
      if(n>0&&m.em<=0){ m.em=0.22; const r=rings.find(r=>r.userData.age>=1); if(r){ r.userData.age=0; r.visible=true; } }
      for(const r of rings){ if(r.userData.age>=1){ r.visible=false; continue; } r.userData.age+=dt/1.8; const s=6+60*r.userData.age; r.scale.set(s,s,1); r.position.set(0,(Y0+Y1)/2,Z1+1.5+r.userData.age*6); r.material.color.copy(COL.sound); r.material.opacity=(1-r.userData.age)*(0.08+0.62*m.open)*Math.min(1,0.3+n*0.12); }
    }
  };
}

