/* ---------- D-04: tubular-pneumatic action on the cone-valve chest of C-03 ----------
   After the section drawing of a pressure system. Per note: the key's tail lifts the double valve B in the console's wind box:
   its upper disc lets wind into the lead tube, its lower disc shuts the exhaust. The tube inflates small bellows A under the
   relay box; A lifts a small double valve, whose wind inflates small bellows E; E lifts the large double valve F, whose wind runs
   along the note's channel under the chest and inflates one small bellows G per stop, and each G lifts a cone valve. When the
   key is released every double valve falls back and its lower disc opens the way out. The wind of box B and the tubes is drawn
   in its own colour: it is a different wind from that of the relay box. The relay floor lies level with the
   floor of the chest; A, E and the G bellows all stand on the same level. */
let D04V={cut:0,cutK:0,s2:[[0,0,0],[0,0,0]],s3:[[0,0,0],[0,0,0]],s5:[[0,0,0],[0,0,0]],s6:[[0,0,0],[0,0,0]]};   // views of the steps, set when the model is built
function buildTubular(){
  const {R,N,W,pos,ROWC,oy,ZF,ZM,yIn0,xV,KSk,Pk,cones,pipesT,chV,sv}=coneChest();
  // levels: the note channels and the block under the relay; the relay floor is level with the chest's conduit board
  const yC0=oy-1.5, yC1=oy+1, yCc=oy-0.25, yF0=oy+6, yF1=oy+8.5, yFc=oy+7.25, yR1=oy+15.5;
  // along the note: the rise from F to the note channel, F and E, the rise from the small valve to E, the small valve and A
  const zV=ZF+4.7, zFv=ZF+10.7, zT=ZF+16.7, zA=ZF+21.7, zEnd=ZF+26.7, zW=ZF+7.5, zBk=Math.min(...ROWC)-5, xE=W/2+2;
  const LE=0.8, LG=1.2, PT=0.4;   // lift of the relay valves and of the cones, thickness of a bellows' board
  const ctrlDelay=0.010+0.0045*2;   // the wind takes about this long to run through a 2 m tube
  const LRK=LB('リレーの箱（中は風で満ちている。鍵ごとの弁が並ぶ）','Relaiskasten'), LRF=LB('リレーの床板（弁の座と通路の穴があけてある。風箱の底と同じ高さ）','Relaiskasten');
  box(R,W+8,yF1-yF0,zEnd-ZF,MAT.wood,0,(yF0+yF1)/2,(ZF+zEnd)/2,LRF);
  box(R,W+8,1,zEnd-zW,MAT.wood,0,yR1+0.5,(zW+zEnd)/2,LRK);
  for(const z of [zW+0.4,zEnd-0.4]) box(R,W+8,yR1-yF1,0.8,MAT.wood,0,(yF1+yR1)/2,z,LRK);
  for(const s of [-1,1]) box(R,0.8,yR1-yF1,zEnd-zW-1.6,MAT.wood,s*(W/2+3.6),(yF1+yR1)/2,(zW+zEnd)/2,LRK);
  box(R,W+8,yC1-yC0,zEnd-(zV+3.2),MAT.wood,0,(yC0+yC1)/2,(zV+3.2+zEnd)/2,LB('小ふいごの台（A と E が載る。風の通路の穴があけてある）','Relaiskasten'));
  // the chest stands on legs; rails carry the note channels; posts carry the relay
  const LL=LB('風箱の台の脚','Ladengestell');
  for(const s of [-1,1]){ for(const z of [zBk+2,ZF-2,zEnd-3]) box(R,3,yF0+10,3,MAT.woodDark,s*(W/2+5.5),(yF0-10)/2,z,LL); }
  for(const z of [zBk+6,ZM,zV+1]) box(R,W+11,1.2,2,MAT.woodDark,0,yC0-0.6,z,LB('音のチャンネルを受ける桟','Ladengestell'));
  // wind: the trunk beside the chest goes on to the end of the relay box
  box(R,3,9,zEnd-2-ZF,hollow(MAT.wood),xV-3.2,oy+12,(ZF+zEnd-2)/2,LB('風箱への風の供給路','Windkanal'));
  duct([V3(xV-1.7,oy+12,zFv+6),V3(-xE-2,oy+12,zFv+6)],5,MAT.wood,LB('リレーの箱への風の供給','Windzufuhr'));
  new Tube([V3(xV-3.2,oy+12,ZF-2),V3(xV-3.2,oy+12,zFv+6),V3(-xE,oy+12,zFv+6)],{kind:'ctrl',r:0.7,density:0.5,front:200,state:()=>({open:S.p>4,speed:6})});
  new Vol((a,b,c,out)=>out.set(-W/2-2+a*(W+4),yF1+0.4+b*(yR1-yF1-0.8),zW+1.2+c*(zEnd-zW-2.4)),420,{kind:'ctrl',state:()=>S.p>4?1:0,rate:2});
  // the console: balanced keys, a wind box with a double valve over each key's tail
  // the console stands so that the middle key's lead tube is 2 m long (two bends of radius RL on the way)
  const RL=50*MM, yK=86, zK=zEnd+57.5+2000*MM-(yK+9.2-yCc)+2*RL*(2-Math.PI/2), kb=buildBalanceKeyboard({x:0,y:yK,z:zK}), zc=kb.zt+2, yB0=yK+8, yB1=yB0+2.4, yB2=yB1+3.6, HW=13*TAILP/2+2;
  box(R,30,8.5,61,MAT.woodDark,0,yK-7.75,zK-28.5,LB('演奏台（コンソール）の台','Spieltisch'));
  for(const s of [-1,1]) box(R,2,yK-12+10,61,MAT.woodDark,s*14,(yK-12-10)/2,zK-28.5,LB('演奏台の側板','Spieltisch'));
  const LVK=LB('鍵の弁箱 B（中は風で満ちている。鍵ごとの二重弁が鉛管への風を開け閉めする）','Spielventilkasten');
  box(R,2*HW,yB1-yB0,7,MAT.wood,0,(yB0+yB1)/2,zc,LB('弁箱の底の板（弁の座と、鉛管へ通じる穴があけてある）','Spielventilkasten'));
  box(R,2*HW,0.6,7,MAT.wood,0,yB2+0.3,zc,LVK); for(const z of [zc-3.2,zc+3.2]) box(R,2*HW,yB2-yB1,0.6,MAT.wood,0,(yB1+yB2)/2,z,LVK);
  for(const s of [-1,1]){ box(R,0.6,yB2-yB1,5.8,MAT.wood,s*(HW-0.3),(yB1+yB2)/2,zc,LVK); box(R,1.2,yB0-(yK+2),6,MAT.woodDark,s*(HW+0.2),(yB0+yK+2)/2,zc,LB('弁箱の支え','Balgstütze')); }
  duct([V3(-HW,yB1+1.8,zc),V3(-HW-6,yB1+1.8,zc),V3(-HW-6,-10,zc)],2,MAT.casing,LB('弁箱への風の供給','Windzufuhr'));
  new Vol((a,b,c,out)=>out.set(-HW+0.8+a*(2*HW-1.6),yB1+0.3+b*(yB2-yB1-0.6),zc-2.5+c*5),160,{kind:'lead',state:()=>S.p>4?1:0,rate:2});
  const RISE=kb.RA*(KPULL*KLEN/(KLEN-KATT))/30, tail0=[];
  for(let k=0;k<N;k++) tail0.push(kb.tail(k).y);
  // a small wedge bellows on the block: its board opens about a hinge across the note at dh from the rod (zr) and reaches dt past the rod
  const LM=mclone(MAT.leather); LM.side=T.DoubleSide; { const o=XRAY.indexOf(buildTubular.lm); if(o>=0) XRAY.splice(o,1); } XRAY.push(LM); buildTubular.lm=LM;
  const wedge=(x,zr,w,dh,dt,mat,lab)=>{ const LF=LB('ひだ（革）','Falten'), zh=zr+dh, dir=-Math.sign(dh), r=Math.abs(dh), L=r+dt, g=new T.Group(); g.position.set(x,yC1,zh); R.add(g);
    box(g,w,PT,L,mat,0,PT/2,dir*L/2,lab);
    const sd=[-1,1].map(s=>{ const t=mk(G_TRI,LM,R,LF); t.rotation.y=-dir*Math.PI/2; t.position.set(x+s*(w/2-0.15),yC1,zh); return t; }), fr=box(R,w-0.3,1,0.2,MAT.leather,x,yC1,zh+dir*L,LF);
    return h=>{ const sn=clamp(h/r,0,0.9), th=Math.asin(sn), hh=L*sn, c=Math.cos(th); g.rotation.x=-dir*th; sd.forEach(t=>t.scale.set(L*c,Math.max(0.01,hh),1));
      fr.scale.y=Math.max(0.05,hh); fr.position.set(x,yC1+hh/2,zh+dir*L*c); return yC1+PT+h; }; };
  // a double valve: a disc on its seat in the box, a disc under the floor that shuts the way out when the rod is up
  const dbl=(x,z,s,mat,labC,labD,labR)=>{ const c=cyl(R,1.25*s,0.35,mat,x,0,z,labC), d=cyl(R,1.5*s,0.3,MAT.leather,x,0,z,labD), r=rod(R,0.13,MAT.iron,labR);
    return (lift,yFrom)=>{ c.position.y=yF1+0.175+lift; d.position.y=yF0-0.05-0.15-LE+lift; r.set(V3(x,yFrom,z),V3(x,yF1+0.35+lift,z)); }; };
  const LBG=LB('小ふいご G（制御風でふくらみ、棒で円錐弁を押し上げる）','Bälgchen'), LBA=LB('小ふいご A（鉛管の風でふくらみ、リレーの小さな弁を持ち上げる）','Relaisbalg'), LBE=LB('小ふいご E（小さな弁の風でふくらみ、大きな弁 F を持ち上げる）','Relaisbalg');
  const LCH=LB('音のチャンネル（鍵ごとの木の桟。中の通路が同じ音の小ふいご G をすべて結ぶ）','Tonkanal'), LP2=LB('鉛管（内径約5 mm。鍵の弁からの風を小ふいご A へ送る）','Bleirohr');
  // a path with its corners rounded to radius r, and a lead tube along it
  const rounded=(pts,r)=>{ const out=[pts[0].clone()];
    for(let i=1;i<pts.length-1;i++){ const b=pts[i], u=V3(0,0,0).subVectors(pts[i-1],b).normalize(), v=V3(0,0,0).subVectors(pts[i+1],b).normalize(), an=u.angleTo(v), t=r/Math.tan(an/2);
      const c=b.clone().add(V3(0,0,0).addVectors(u,v).normalize().multiplyScalar(r/Math.sin(an/2))), p0=b.clone().addScaledVector(u,t).sub(c), p1=b.clone().addScaledVector(v,t).sub(c), sw=p0.angleTo(p1);
      for(let j=0;j<=8;j++){ const f=j/8; out.push(c.clone().addScaledVector(p0,Math.sin((1-f)*sw)/Math.sin(sw)).addScaledVector(p1,Math.sin(f*sw)/Math.sin(sw))); } }
    out.push(pts[pts.length-1].clone()); return out; };
  // the lead tubes turn see-through with the wood, so that the wind inside them shows
  const LDM=mclone(MAT.lead); { const o=XRAY.indexOf(buildTubular.ld); if(o>=0) XRAY.splice(o,1); } XRAY.push(LDM); buildTubular.ld=LDM;
  const leadPipe=(pts,lab)=>{ const c=new T.CurvePath(); for(let i=1;i<pts.length;i++) c.add(new T.LineCurve3(pts[i-1],pts[i])); const g=new T.TubeGeometry(c,300,0.3,8,false); CX.own.push(g); mk(g,LDM,R,lab); };
  const U=[], fill=[], side=[];
  for(let k=0;k<N;k++){ const x=pos(k), mt=keyMat(k), q={a:0,e:0,n:0,g:0,p:0};
    // the note channel under the cones, with a branch up to each bellows, and the rise up to F
    box(R,6,yC1-yC0,zV+2.6-zBk,MAT.wood,x,(yC0+yC1)/2,(zV+2.6+zBk)/2,LCH);
    boreAB(R,MAT.dark,V3(x,yCc,zBk+1.5),V3(x,yCc,zV),0.7,LCH,false);
    q.G=ROWC.map((zc2,i)=>{ bore(R,MAT.dark,x,yCc,yC1,zc2,0.5,LB('小ふいご G への穴','Luftbohrung'),false);
      cyl(R,0.5,0.4,MAT.leather,x,yF0-0.2,zc2,LB('円錐弁の棒の革のブッシュ（風が漏れないよう棒を通す）','Ventilleder'));
      return {set:wedge(x,zc2,2.8,-4.2,2.2,mt,LBG),stem:rod(R,0.13,MAT.iron,LB('円錐弁の棒（小ふいご G に押し上げられる）','Ventilstange'))}; });
    box(R,3,yF0-yC1,3,MAT.wood,x,(yF0+yC1)/2,zV,LB('F から音のチャンネルへ下りる通路','Tonkanal'));
    bore(R,MAT.dark,x,yCc,yFc,zV,0.6,LB('F から音のチャンネルへ下りる通路','Luftbohrung'),false);
    boreAB(R,MAT.dark,V3(x,yFc,zV),V3(x,yFc,zFv),0.6,LB('F から音のチャンネルへの通路','Luftbohrung'),false);
    // F: the seat goes right through the floor; below it is the way out
    bore(R,MAT.dark,x,yF0,yF1,zFv,0.75,LB('大きな弁 F の座（上が風の入口、下が排気口）','Kegelsitz'));
    q.F=dbl(x,zFv,1,mt,LB('大きな弁 F（上がるとリレーの箱の風を音のチャンネルへ通す）','Relaisventil'),LB('F の排気の弁（上がると排気口をふさぐ。下がると音のチャンネルの風が抜ける）','Auslassventil'),LB('F の棒','Ventilstange'));
    q.E=wedge(x,zFv,3.5,4.6,1.8,mt,LBE);
    // the small valve and its way to E
    bore(R,MAT.dark,x,yF0,yF1,zA,0.42,LB('小さな弁の座（上が風の入口、下が排気口）','Kegelsitz'));
    q.V=dbl(x,zA,0.56,mt,LB('リレーの小さな弁（上がるとリレーの箱の風を小ふいご E へ通す）','Relaisventil'),LB('小さな弁の排気の弁','Auslassventil'),LB('小さな弁の棒','Ventilstange'));
    boreAB(R,MAT.dark,V3(x,yFc,zT),V3(x,yFc,zA),0.4,LB('小さな弁から E への通路','Luftbohrung'),false);
    box(R,2.2,yF0-yC1,2.2,MAT.wood,x,(yF0+yC1)/2,zT,LB('小さな弁から E へ下りる通路','Relaiskasten'));
    bore(R,MAT.dark,x,yCc,yFc,zT,0.4,LB('小さな弁から E へ下りる通路','Luftbohrung'),false);
    boreAB(R,MAT.dark,V3(x,yCc,zFv),V3(x,yCc,zT),0.4,LB('小さな弁から E への通路','Luftbohrung'),false);
    bore(R,MAT.dark,x,yCc,yC1,zFv,0.4,LB('小ふいご E への穴','Luftbohrung'),false);
    q.A=wedge(x,zA,2.5,3.6,1.4,mt,LBA);
    boreAB(R,MAT.dark,V3(x,yCc,zA),V3(x,yCc,zEnd),0.3,LB('鉛管から小ふいご A への穴','Luftbohrung'),false);
    bore(R,MAT.dark,x,yCc,yC1,zA,0.3,LB('小ふいご A への穴','Luftbohrung'),false);
    // the key's double valve in B, and the lead tube
    const xk=kb.kx(k), oz=zc-3.5, yo=yB0+1.2;
    bore(R,MAT.dark,xk,yB0,yB1,zc,0.35,LB('鍵の弁の座（上が風の入口、下が排気口）','Kegelsitz'));
    boreAB(R,MAT.dark,V3(xk,yo,zc),V3(xk,yo,oz),0.28,LB('鉛管へ通じる穴','Luftbohrung'),false);
    q.bu=cyl(R,0.62,0.25,mt,xk,0,zc,LB('鍵の弁 B（上の弁。上がると弁箱の風が鉛管に入る）','Spielventil'));
    q.bd=cyl(R,0.62,0.25,MAT.leather,xk,0,zc,LB('鍵の弁 B（下の弁。上がると排気口をふさぐ。下がると鉛管の風が抜ける）','Spielventil'));
    q.br=rod(R,0.13,MAT.iron,LB('鍵の弁の棒（鍵の奥の端に押し上げられる）','Ventilstange'));
    const zt=zEnd+8+4*Math.abs(k-6), lead=rounded([V3(xk,yo,oz),V3(xk,yo,oz-RL-0.2),V3(xk,yCc,oz-RL-0.2),...(k===6?[]:[V3(xk,yCc,zt),V3(x,yCc,zt)]),V3(x,yCc,zEnd)],RL);   // the outer notes turn first, so no tubes cross
    leadPipe(lead,LP2);
    // flows
    fill.push(new Tube([V3(xk,yB1+0.8,zc),V3(xk,yo,zc),...lead,V3(x,yCc,zA),V3(x,yC1+0.3,zA)],{kind:'lead',noPts:true,exact:true,r:0.25,front:300,state:()=>({open:S.kd[k]>0.3,speed:20})}));
    const ctl=(pts,r,open)=>{ const t=new Tube(pts,{kind:'ctrl',r,density:0.8,front:120,state:()=>({open:open(),speed:14})}); side.push(t); return t; };
    ctl([V3(x,yF1+0.9,zA),V3(x,yFc,zA),V3(x,yFc,zT),V3(x,yCc,zT),V3(x,yCc,zFv),V3(x,yC1+0.3,zFv)],0.3,()=>q.a>0.5);
    ctl([V3(x,yF1+1.2,zFv),V3(x,yFc,zFv),V3(x,yFc,zV),V3(x,yCc,zV),V3(x,yCc,zBk+2)],0.45,()=>q.e>0.5);
    for(const zc2 of ROWC) ctl([V3(x,yCc,zc2),V3(x,yC1+0.35,zc2)],0.3,()=>q.n>0.5);
    const out=(pts,open)=>side.push(new Tube(pts,{kind:'air',r:0.3,density:1.2,front:120,state:()=>({open:open(),speed:12})}));
    out([V3(xk,yB0,zc),V3(xk,yB0-2.2,zc+1)],()=>S.kd[k]<0.3&&q.p>0.03);
    out([V3(x,yF0,zA),V3(x,yF0-2,zA+2)],()=>q.a<0.5&&q.e>0.03);
    out([V3(x,yF0,zFv),V3(x,yF0-2,zFv-2.5)],()=>q.e<0.5&&q.n>0.03);
    U.push(q); }
  for(const f of fill) f.front=f.L/ctrlDelay;
  { const x4=pos(4), xk=kb.kx(4); D04V={cut:(130-(x4+0.02))/260,cutK:(130-(xk+0.02))/260,s2:[[xk+24,yK+11,zc+11],[xk,yK+7,zc+1]],s3:[[x4+50,19,zFv+9],[x4,15,zFv+4]],s5:[[x4+95,30,0],[x4,17,0]],s6:[[x4+70,60,120],[x4,25,10]]}; }
  return {
    pins:[{t:'鍵の弁箱 B',p:V3(0,yB2+3,zc)},{t:'鉛管',p:V3(-70,yCc+3,zEnd+30)},{t:'小ふいご A',p:V3(W/2+6,yC1+2,zA)},{t:'小ふいご E',p:V3(W/2+6,yC1+2,zFv)},{t:'リレーの箱',p:V3(W/2+6,yR1+2,zFv)},{t:'音のチャンネル',p:V3(W/2-4,yC0-2,0)},{t:'小ふいご G',p:V3(W/2+2,yC1+3,ROWC[0])},{t:'円錐弁',p:V3(W/2+3.5,yIn0+1.5,Math.min(...ROWC))},{t:'ストップチャンネル',p:V3(-W/2-1,oy+17,7)}],
    speaking:()=>S.p<8?[]:pipesT.filter(t=>Pk[t.k]>0.6&&S.sp[t.j]>0.85&&chV[t.j].fill>0.5),
    update(dt){ kb.update(); const dT=ctrlDelay;
      for(let k=0;k<N;k++){ const q=U[k], x=pos(k), on=S.kd[k]>0.3;
        q.p=clamp(q.p+(on?dt:-dt)/dT,0,1);
        q.a=clamp(q.a+(q.p>0.9?1:-1)*dt*12,0,1); q.e=clamp(q.e+(q.a>0.7?1:-1)*dt*12,0,1);
        q.n=clamp(q.n+(q.e>0.7?1:-1)*dt*9,0,1); q.g=clamp(q.g+(q.n>0.8?1:-1)*dt*12,0,1); Pk[k]=q.g;
        // the key's tail pushes the rod straight up
        const tp=kb.tail(k), r=tp.y-tail0[k], xk=kb.kx(k);
        q.bu.position.y=yB1+0.13+r; q.bd.position.y=yB0-0.15-RISE+r; q.br.set(tp,V3(xk,yB1+0.13+r,zc));
        q.V(LE*q.a,q.A(LE*q.a)); q.F(LE*q.e,q.E(LE*q.e));
        for(let i=0;i<5;i++){ const lift=LG*q.g, z=ROWC[i], yt=q.G[i].set(lift); cones[k][i].position.set(x,yIn0+0.75*KSk(k)+lift,z); q.G[i].stem.set(V3(x,yt,z),V3(x,yIn0+0.3+lift,z)); } }
      for(let i=0;i<5;i++) sv[i].rotation.z=-1.1*S.sp[i]; }
  };
}
