/* ---------------- wind supply ---------------- */
function buildWedge(x,z,th0){
  const R=CX.root, L=40, Wd=20, B={th:th0,hold:false,timer:0,autoP:false,pumping:false,supplying:false,x,z,L};
  box(R,L+2,1.5,Wd+2,MAT.wood,x+L/2,0.75,z,LB('下板（固定）','Unterplatte'));
  const top=new T.Group(); top.position.set(x,1.5,z); R.add(top);
  box(top,L+2,1.5,Wd+2,MAT.wood,L/2,0.75,0,LB('上板（奥の蝶番を中心に開閉する）','Oberplatte'));
  const WL=LB('おもり（この重さが風圧になる）','Gewicht');
  box(top,7,3,7,MAT.weight,L-7,3,-5,WL); box(top,7,3,7,MAT.weight,L-7,3,5,WL); box(top,7,3,7,MAT.weight,L-15,3,0,WL);
  const sides=[-1,1].map(s=>{ const m=mk(G_TRI,MAT.leather,R,LB('ひだ（革と板で風を封じる）','Falten')); m.position.set(x,1.5,z+s*(Wd/2+0.6)); return m; });
  const front=box(R,0.4,1,Wd+1.2,MAT.leather,x+L,1.5,z,LB('ひだ（前面）','Falten'));
  const inf=new T.Group(); inf.position.set(x+L-14,1.55,z); R.add(inf);
  box(inf,6,0.4,7,MAT.leather,3,0.2,0,LB('吸気弁（ふいごを持ち上げる間だけ開いて外気を吸う）','Schöpfventil'));
  const ofl=new T.Group(); ofl.position.set(x+1,-0.3,z); R.add(ofl);
  box(ofl,5,0.4,7,MAT.leather,2.5,0,0,LB('逆止弁（風導管へ送る間だけ開く）','Rückschlagventil'));
  box(R,2,46,2,MAT.woodDark,x-20,23,z,LB('レバーの支柱','Balgstütze'));
  const lever=rod(R,0.8,MAT.woodDark,LB('ふいごレバー（カルカントが左端を踏む）','Balghebel'));
  const rope=rod(R,0.15,MAT.cloth,LB('引き綱','Seil'));
  const step=box(R,6,0.8,5,MAT.wood,x-40,40,z,LB('踏み板（カルカントがここを踏む）','Tritt'));
  B.update=()=>{
    const th=B.th, h=L*Math.sin(th);
    top.rotation.z=th;
    sides.forEach(m=>m.scale.set(L*Math.cos(th),Math.max(0.01,h),1));
    front.scale.y=Math.max(0.05,h); front.position.set(x+L*Math.cos(th),1.5+h/2,z);
    inf.rotation.z=B.pumping?0.55:0; ofl.rotation.z=B.supplying?-0.5:0;
    const fx=x+(L-2)*Math.cos(th), fy=1.5+(L-2)*Math.sin(th)+1.5;
    const sinp=clamp((fy+30-45)/58,-1,1), p=Math.asin(sinp);
    const rt=V3(x-20+58*Math.cos(p),45+58*sinp,z), lt=V3(x-20-20*Math.cos(p),45-20*sinp,z);
    lever.set(lt,rt); rope.set(rt,V3(fx,fy,z)); step.position.set(lt.x,lt.y-0.8,z);
  };
  // particles
  new Tube([V3(x+L-11,-7,z),V3(x+L-11,3,z),V3(x+L-20,5,z)],{kind:'air',r:1.2,density:0.6,state:()=>({open:B.pumping,speed:24})});
  new Vol((a,b,c,out)=>{ const u=0.1+0.86*a, X=u*L*Math.cos(B.th); out.set(x+X,1.5+0.9+b*Math.max(0,u*L*Math.sin(B.th)-1.6),z+(c-0.5)*17); },170,{state:()=>B.th>0.004?0.15+0.85*B.th/0.34:0,rate:3});
  B.out=new Tube([V3(x+5,2,z),V3(x+3,-1,z),V3(x-4,-1,z),V3(x-4,-4,z),V3(x-4,-4,6)],{r:0.9,density:0.6,state:()=>({open:B.supplying,speed:B.flow||0})});
  return B;
}
function buildBlowerMag(o){
  const R=CX.root, M={h:o.h0==null?0.8:o.h0,blower:o.on!==false,rpm:o.on===false?0:1,vo:0,n:0};
  box(R,16,16,16,MAT.casing,-122,8,0,LB('送風機のケース','Gebläsegehäuse'));
  const imp=new T.Group(); imp.position.set(-122,8,1); R.add(imp);
  const hub=mk(G_CYL,MAT.iron,imp,LB('羽根車（回転して風を起こす）','Laufrad')); hub.scale.set(6.6,1.2,6.6); hub.rotation.x=Math.PI/2; hub.position.z=-1.6;
  for(let b=0;b<8;b++){ const bl=box(imp,0.6,6.2,3,MAT.metalDark,0,0,0,LB('羽根車の羽根','Laufradschaufel')); const an=b/8*Math.PI*2; bl.position.set(Math.cos(an)*3.8,Math.sin(an)*3.8,0); bl.rotation.z=an-Math.PI/2+0.35; }
  const mot=mk(G_CYL,MAT.iron,R,LB('電動モーター','Motor')); mot.rotation.x=Math.PI/2; mot.scale.set(4.5,8,4.5); mot.position.set(-122,8,-12);
  const ring=mk(G_CYL_OPEN,MAT.iron,R,LB('吸気口','Ansaugöffnung')); ring.rotation.x=Math.PI/2; ring.scale.set(4.2,2,4.2); ring.position.set(-122,8,9);
  duct([V3(-114,5,0),V3(-89,5,0),V3(-89,11,0)],5,MAT.casing,LB('送風管（ふいごの下板を通ってカーテン弁へ）','Windleitung'));
  // roller-curtain valve (Rollvorhangventil) standing on the reservoir's bottom board, inside the reservoir
  const VB=11.6, VT=VB+6.6, VX=-87;
  box(R,4,8,12,MAT.woodDark,VX-2,15,0,LB('カーテン弁の箱（送風機の風が下から入る）','Rollventilkasten'));
  for(let j=0;j<5;j++) box(R,0.06,0.7,10,MAT.dark,VX+0.03,VB+0.8+j*1.25,0,LB('スリット（ここからふいごの中へ風が出る）','Schlitz'));
  for(const s of [-1,1]) box(R,0.6,7.6,0.6,MAT.wood,VX+0.3,15,s*6.4,LB('ローラーのガイド','Rollenführung'));
  const roller=mk(G_CYL,MAT.woodPale,R,LB('ローラー（中のばねでカーテンを巻き取る。両端をひもで上板から吊る）','Federrolle')); roller.rotation.x=Math.PI/2; roller.scale.set(0.55,12,0.55);
  const curtain=box(R,0.12,1,11,MAT.curtain,VX+0.12,VB,0,LB('カーテン（下端は固定。ローラーが上がるとスリットを下からふさぐ）','Vorhang'));
  box(R,0.3,0.4,11.4,MAT.wood,VX+0.15,VB,0,LB('カーテンの下端の留め木','Vorhangleiste'));
  const LG=LB('ふいごの脚','Balgbock');
  for(const [lx,lz] of [[-94,-14],[-94,14],[-56,-14],[-56,14]]) box(R,2,10,2,MAT.woodDark,lx,5,lz,LG);
  box(R,40,1,30,MAT.wood,-75,10.5,0,LB('マガジンふいごの下板','Unterplatte'));
  const top=new T.Group(); R.add(top);
  box(top,42,1.2,32,MAT.wood,0,0.6,0,LB('マガジンふいごの上板（上下に平行移動する）','Oberplatte'));
  const WL=LB('おもり（この重さで風圧が決まる）','Gewicht');
  box(top,10,4,8,MAT.weight,-10,3.2,-7,WL); box(top,10,4,8,MAT.weight,10,3.2,7,WL); box(top,10,4,8,MAT.weight,10,3.2,-7,WL);
  const RL=LB('リブ（折りたたまれる板と革のひだ）','Falten');
  const ribs={f1:plank(R,40,0.5,MAT.leather,RL),f2:plank(R,40,0.5,MAT.leather,RL),b1:plank(R,40,0.5,MAT.leather,RL),b2:plank(R,40,0.5,MAT.leather,RL),
              l1:plank(R,0.5,30,MAT.leather,RL),l2:plank(R,0.5,30,MAT.leather,RL),r1:plank(R,0.5,30,MAT.leather,RL),r2:plank(R,0.5,30,MAT.leather,RL)};
  const cords=[-1,1].map(()=>rod(R,0.12,MAT.cord,LB('ひも（上板が上がるとローラーを引き上げる）','Zugschnur')));
  const eyes=[-1,1].map(s=>{ const e=mk(G_CYL,MAT.brass,top,LB('ひもの留め金','Öse')); e.scale.set(0.35,0.5,0.35); e.position.set(VX+0.6+75,-0.25,s*5.6); return e; });
  duct(o.trunkPts,6,MAT.wood,LB('風導管（ふいごから風箱へ）','Windkanal'));
  const topY=()=>13+22*M.h;
  M.update=(dt,n)=>{
    M.n=n; M.rpm+=((M.blower?1:0)-M.rpm)*Math.min(1,dt*1.2);
    M.vo=clamp((0.82-M.h)/0.3,0,1);
    const inflow=M.rpm*1.9*Math.pow(M.vo,2.2), outflow=(M.h>0.001&&n>0)?0.02+0.018*n:0;
    M.h=clamp(M.h+(inflow-outflow)*dt,0,1);
    const target=M.h>0.015?80:M.rpm*M.vo*20; S.p+=(target-S.p)*Math.min(1,dt*(target>S.p?6:4));
    imp.rotation.z-=M.rpm*dt*30;
    const ty=topY(); top.position.set(-75,ty,0);
    const H=ty-11, hf=H/2, d=Math.sqrt(Math.max(0,169-hf*hf));
    ribs.f1.set(V3(-75,11,15),V3(-75,11+hf,15+d)); ribs.f2.set(V3(-75,11+hf,15+d),V3(-75,ty,15));
    ribs.b1.set(V3(-75,11,-15),V3(-75,11+hf,-15-d)); ribs.b2.set(V3(-75,11+hf,-15-d),V3(-75,ty,-15));
    ribs.l1.set(V3(-94.5,11,0),V3(-94.5+d,11+hf,0)); ribs.l2.set(V3(-94.5+d,11+hf,0),V3(-94.5,ty,0));
    ribs.r1.set(V3(-55.5,11,0),V3(-55.5-d,11+hf,0)); ribs.r2.set(V3(-55.5-d,11+hf,0),V3(-55.5,ty,0));
    M.d=d;
    const ry=VB+6.6*(1-M.vo)+0.55; roller.position.set(VX+0.6,ry,0);
    const cl=Math.max(0.05,ry-0.55-VB); curtain.scale.y=cl; curtain.position.y=VB+cl/2;
    cords[0].set(V3(VX+0.6,ry,-5.6),V3(VX+0.6,ty,-5.6)); cords[1].set(V3(VX+0.6,ry,5.6),V3(VX+0.6,ty,5.6));
  };
  M.intake=new Tube([V3(-122,8,26),V3(-122,8,8)],{kind:'air',r:1.6,density:0.8,front:o.front||40,state:()=>({open:M.rpm>0.15,speed:30*M.rpm*M.vo})});
  M.blowOut=new Tube([V3(-118,5,0),V3(-114,5,0),V3(-89,5,0)],{r:1.4,density:0.75,front:o.front||40,state:()=>({open:M.rpm>0.25,speed:30*M.rpm*M.vo})});
  M.thru=new Tube([V3(-89,5,0),V3(-89,13,0),V3(-89,17.6,0),V3(-85.5,17.6,0),V3(-81,16.5,0)],{r:1.1,density:0.8,front:o.front||40,state:()=>({open:M.blowOut.full()&&M.vo>0.05,speed:30*M.rpm*M.vo})});
  M.vol=new Vol((a,b,c,out)=>{ const ty=topY(), y=11.7+b*(ty-12.4), q=(y-11)/Math.max(1,ty-11), off=(M.d||0)*(1-Math.abs(2*q-1))+1.2; out.set(lerp(-94.5+off,-55.5-off,a),y,(c-0.5)*27); },320,{state:()=>M.h>0.012?0.15+0.85*M.h:0,rate:o.front?0.5:1.4});
  M.trunk=new Tube(o.trunkPts,{r:1.7,density:0.4,front:o.front||400,state:()=>({open:M.h>0.012&&S.p>10&&(!o.front||M.thru.full()||M.vol.fill>0.5),speed:3*M.n})});
  M.reset=()=>{ M.h=0; M.rpm=0; S.p=0; for(const f of flows) f.reset(); };
  return M;
}

