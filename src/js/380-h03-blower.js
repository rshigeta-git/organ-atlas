/* ---------- H-03 wind supply at full size: electric blower and magazine reservoir with roller-curtain valve (as B-02) ----------
   Reservoir about 2.0 × 1.5 m, parallel-rising top board with folded ribs and weights; the curtain valve inside closes the
   blower inlet as the top board rises. Outlet to the collecting trunk in front. */
function buildBlowerMagR(ST){
  const R=CX.root, M={h:0.8,blower:true,rpm:1,vo:0,n:0};
  const CXr=0, CZ=-470, LX=256, LZ=192, yb=30, x0=CXr-LX/2, x1=CXr+LX/2, z0=CZ-LZ/2, z1=CZ+LZ/2, RL=42;
  // blower
  const BX=-250, BY=40, BZ=CZ;
  box(ST,70,80,70,MAT.casing,BX,BY,BZ,LB('送風機のケース','Gebläsegehäuse'));
  const imp=new T.Group(); imp.position.set(BX,BY,BZ+36); R.add(imp);
  const hub=mk(G_CYL,MAT.iron,imp,LB('羽根車（回転して風を起こす）','Laufrad')); hub.scale.set(26,4,26); hub.rotation.x=Math.PI/2;
  for(let b=0;b<10;b++){ const bl=box(imp,2.4,24,10,MAT.metalDark,0,0,3,LB('羽根車の羽根','Laufradschaufel')); const an=b/10*Math.PI*2; bl.position.set(Math.cos(an)*14,Math.sin(an)*14,3); bl.rotation.z=an-Math.PI/2+0.35; }
  const mot=mk(G_CYL,MAT.iron,ST,LB('電動モーター','Motor')); mot.rotation.x=Math.PI/2; mot.scale.set(16,30,16); mot.position.set(BX,BY,BZ-50);
  const ring=mk(G_CYL_OPEN,MAT.iron,ST,LB('吸気口','Ansaugöffnung')); ring.rotation.x=Math.PI/2; ring.scale.set(15,8,15); ring.position.set(BX,BY,BZ+40);
  duct([V3(BX+35,20,BZ),V3(x0+30,20,BZ),V3(x0+30,yb+4,BZ)],18,MAT.casing,LB('送風管（ふいごの下板を通ってカーテン弁へ）','Windleitung'));
  // frame and bottom board
  for(const [lx,lz] of [[x0+8,z0+8],[x0+8,z1-8],[x1-8,z0+8],[x1-8,z1-8],[CXr,z0+8],[CXr,z1-8]]) box(ST,7,yb-2.5,7,MAT.woodDark,lx,(yb-2.5)/2,lz,LB('ふいごの脚','Balgbock'));
  box(ST,LX+6,3,LZ+6,MAT.wood,CXr,yb-1.5,CZ,LB('マガジンふいごの下板','Unterplatte'));
  // roller-curtain valve standing on the bottom board, inside the reservoir
  const VX=x0+30, VB=yb+4, VH=26;
  box(ST,14,30,46,MAT.woodDark,VX-7,yb+15,CZ,LB('カーテン弁の箱（送風機の風が下から入る）','Rollventilkasten'));
  for(let j=0;j<5;j++) box(ST,0.2,2.6,38,MAT.dark,VX+0.1,VB+3+j*4.8,CZ,LB('スリット（ここからふいごの中へ風が出る）','Schlitz'));
  const roller=mk(G_CYL,MAT.woodPale,R,LB('ローラー（中のばねでカーテンを巻き取る。両端をひもで上板から吊る）','Federrolle')); roller.rotation.x=Math.PI/2; roller.scale.set(1.8,44,1.8);
  const curtain=box(R,0.4,1,40,MAT.curtain,VX+0.4,VB,CZ,LB('カーテン（下端は固定。ローラーが上がるとスリットを下からふさぐ）','Vorhang'));
  // moving top board, weights, ribs
  const top=new T.Group(); R.add(top);
  box(top,LX+8,3.5,LZ+8,MAT.wood,0,1.75,0,LB('マガジンふいごの上板（上下に平行移動する）','Oberplatte'));
  const WL=LB('おもり（この重さで風圧が決まる）','Gewicht');
  for(const [wx,wz] of [[-70,-45],[70,45],[70,-45],[-70,45]]) box(top,34,14,28,MAT.weight,wx,10.5,wz,WL);
  const RLb=LB('リブ（折りたたまれる板と革のひだ）','Falten');
  const rib=(sx,sz)=>pplank(MAT.leather,sx,sz,RLb);
  const ribs={f1:rib(LX,1.5),f2:rib(LX,1.5),b1:rib(LX,1.5),b2:rib(LX,1.5),l1:rib(1.5,LZ),l2:rib(1.5,LZ),r1:rib(1.5,LZ),r2:rib(1.5,LZ)};
  const cords=[-1,1].map(()=>prod(MAT.cord,0.4,LB('ひも（上板が上がるとローラーを引き上げる）','Zugschnur')));
  // outlet to the collecting trunk
  duct([V3(CXr,yb-2,z1-14),V3(CXr,15,z1-14),V3(CXr,15,-345)],22,MAT.wood,LB('ふいごの出口（集合管へ）','Balgkanal'));
  const topY=()=>yb+12+70*M.h;
  M.update=(dt,n)=>{
    M.n=n; M.rpm+=((M.blower?1:0)-M.rpm)*Math.min(1,dt*1.2);
    M.vo=clamp((0.82-M.h)/0.3,0,1);
    const inflow=M.rpm*1.2*Math.pow(M.vo,2.2), outflow=(M.h>0.001&&n>0)?0.01+0.0045*n:0;
    M.h=clamp(M.h+(inflow-outflow)*dt,0,1);
    const target=M.h>0.015?80:M.rpm*M.vo*20; S.p+=(target-S.p)*Math.min(1,dt*(target>S.p?6:4));
    imp.rotation.z-=M.rpm*dt*30;
    const ty=topY(); top.position.set(CXr,ty,CZ);
    const H=ty-yb, hf=H/2, d=Math.sqrt(Math.max(0,RL*RL-hf*hf));
    ribs.f1.set(V3(CXr,yb,z1),V3(CXr,yb+hf,z1+d)); ribs.f2.set(V3(CXr,yb+hf,z1+d),V3(CXr,ty,z1));
    ribs.b1.set(V3(CXr,yb,z0),V3(CXr,yb+hf,z0-d)); ribs.b2.set(V3(CXr,yb+hf,z0-d),V3(CXr,ty,z0));
    ribs.l1.set(V3(x0,yb,CZ),V3(x0-d,yb+hf,CZ)); ribs.l2.set(V3(x0-d,yb+hf,CZ),V3(x0,ty,CZ));
    ribs.r1.set(V3(x1,yb,CZ),V3(x1+d,yb+hf,CZ)); ribs.r2.set(V3(x1+d,yb+hf,CZ),V3(x1,ty,CZ));
    M.d=d;
    const ry=VB+VH*(1-M.vo)+1.8; roller.position.set(VX+1.8,ry,CZ);
    const cl=Math.max(0.05,ry-1.8-VB); curtain.scale.y=cl; curtain.position.y=VB+cl/2;
    cords[0].set(V3(VX+1.8,ry,CZ-18),V3(VX+1.8,ty,CZ-18)); cords[1].set(V3(VX+1.8,ry,CZ+18),V3(VX+1.8,ty,CZ+18));
  };
  M.intake=new Tube([V3(BX,BY,BZ+90),V3(BX,BY,BZ+36)],{kind:'air',r:6,density:0.3,front:200,state:()=>({open:M.rpm>0.15,speed:80*M.rpm*M.vo})});
  M.blowOut=new Tube([V3(BX+35,20,BZ),V3(x0+30,20,BZ),V3(x0+30,yb+4,BZ)],{r:4,density:0.3,front:200,state:()=>({open:M.rpm>0.25,speed:80*M.rpm*M.vo})});
  M.thru=new Tube([V3(VX-6,yb+6,CZ),V3(VX-6,yb+16,CZ),V3(VX+2,yb+16,CZ),V3(VX+18,yb+14,CZ)],{r:3,density:0.35,front:200,state:()=>({open:M.blowOut.full()&&M.vo>0.05,speed:80*M.rpm*M.vo})});
  M.vol=new Vol((a,b,c,out)=>{ const ty=topY(), y=yb+1+b*(ty-yb-2), q=(y-yb)/Math.max(1,ty-yb), off=(M.d||0)*(1-Math.abs(2*q-1))+3; out.set(lerp(x0+off-0,x1-off,a),y,lerp(z0+off,z1-off,c)); },500,{state:()=>M.h>0.012?0.15+0.85*M.h:0,rate:1.4});
  M.out=new Tube([V3(CXr,yb+4,z1-14),V3(CXr,15,z1-14),V3(CXr,15,-345)],{r:5,density:0.25,front:300,state:()=>({open:M.h>0.012&&S.p>10,speed:3+0.6*M.n})});
  return M;
}
