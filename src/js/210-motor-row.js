/* ---------- motor row shared by Barker lever and tubular-pneumatic action ----------
   per key: a small wedge bellows on a wind box; inflating it lifts a sticker under a backfall,
   whose other arm pulls the tracker hanging from the slider-chest pallet. */
function buildMotorRow(chest,o){
  const R=CX.root, N=13, yB=o.y, B=new Float32Array(N), A1=5, A2=3.5, yW=yB+12, Lb=7, z0=-2;
  const xs=[]; for(let k=0;k<N;k++) xs.push(chest.pos(k)); const xmin=Math.min(...xs)-4, xmax=Math.max(...xs)+4, cx=(xmin+xmax)/2;
  box(R,xmax-xmin,4,12,MAT.wood,cx,yB-2,2,LB(o.boxLabel[0],o.boxLabel[1]));
  duct([V3(xmin,yB-2,2),V3(xmin-6,yB-2,2),V3(xmin-6,-12,2)],2.4,MAT.casing,LB('風の供給','Windzufuhr'));
  box(R,xmax-xmin,1,1,MAT.woodDark,cx,yW,0,LB('バックフォールの軸受け','Wippenbalken'));
  new Vol((a,b,c,out)=>out.set(xmin+1+a*(xmax-xmin-2),yB-3.6+b*3.2,-3.4+c*10.8),220,{state:()=>1,rate:3});
  const U=[];
  for(let k=0;k<N;k++){
    const x=xs[k], top=new T.Group(); top.position.set(x,yB,z0); R.add(top);
    box(top,3.6,0.5,Lb,keyMat(k),0,0.25,Lb/2,LB(o.motorLabel[0],o.motorLabel[1]));
    const sides=[-1,1].map(s=>{ const m=mk(G_TRI,MAT.leather,R,LB('ひだ（革）','Falten')); m.rotation.y=-Math.PI/2; m.position.set(x+s*1.75,yB,z0); return m; });
    const front=box(R,3.5,1,0.3,MAT.leather,x,yB,z0+Lb,LB('ひだ（革）','Falten'));
    const inl=new T.Group(); inl.position.set(x,yB-0.05,1.6); R.add(inl); box(inl,2,0.25,1.6,MAT.leather,0,-0.12,0.8,LB('入口弁（開くと風箱の風が小ふいごに入る）','Einlassventil'));
    const exh=new T.Group(); exh.position.set(x-1.9,yB+0.9,z0+Lb-1.4); R.add(exh); box(exh,0.2,1.2,1.4,MAT.leather,0,-0.6,0.7,LB('排気弁（閉じた時に小ふいごの風を外へ逃がす）','Auslassventil'));
    const st=rod(R,0.2,keyMat(k),LB('押し棒','Stecher')), wa=rod(R,0.35,keyMat(k),LB('バックフォール（シーソー形のてこ。前が上がると後ろが下がる）','Wippe')), wb=rod(R,0.35,keyMat(k),LB('バックフォール','Wippe'));
    const tr=makeTracker(keyMat(k),LB('トラッカー（パレットへ）','Abstrakte'));
    new Tube([V3(x,yB-2,1.8),V3(x,yB-0.2,1.9),V3(x,yB+0.9,2.6)],{r:0.45,density:1.5,front:120,state:()=>({open:o.drive(k)&&B[k]<0.97,speed:14})});
    new Tube([V3(x,yB+0.8,3.6),V3(x-1.9,yB+0.9,z0+Lb-0.8),V3(x-5,yB+1.6,z0+Lb+1)],{kind:'air',r:0.4,density:1.5,front:120,state:()=>({open:!o.drive(k)&&B[k]>0.03,speed:12})});
    U.push({x,top,sides,front,inl,exh,st,wa,wb,tr});
  }
  return {B,update(dt){
    for(let k=0;k<N;k++){
      const on=o.drive(k); B[k]=clamp(B[k]+(on?9:-7)*dt,0,1);
      const u=U[k], th=0.27*B[k], h=Lb*Math.sin(th);
      u.top.rotation.x=-th; u.sides.forEach(m=>m.scale.set(Lb*Math.cos(th),Math.max(0.01,h),1)); u.front.scale.y=Math.max(0.05,h); u.front.position.set(u.x,yB+h/2,z0+Lb*Math.cos(th));
      u.inl.rotation.x=on?0.6:0; u.exh.rotation.y=on?0:-0.9;
      const lift=Lb*Math.sin(th)*0.95, fz=z0+A1+2-0.0, ph=Math.asin(clamp(lift/A1,0,1));
      const tipF=V3(u.x,yW+A1*Math.sin(ph),A1*Math.cos(ph)), tipB=V3(u.x,yW-A2*Math.sin(ph),-A2*Math.cos(ph));
      u.st.set(V3(u.x,yB+Lb*Math.sin(th)*(A1-z0)/Lb+0.5,A1),tipF);
      u.wa.set(V3(u.x,yW,0),tipF); u.wb.set(V3(u.x,yW,0),tipB);
      u.tr.set(chest.pullDown(k),tipB,0.7);
    }
  }};
}

