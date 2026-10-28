/* ---------- B-03: Schwimmer ----------
   A small spring-loaded regulator hung directly under the windchest. Its moving plate hangs below a fixed frame and is
   pushed UP by coil springs; the springs, not weights, give the pressure. The inlet valve is a disc lying in the inlet
   channel of the frame; its rod runs down through the seat hole to the moving plate. As the bellows fills, the plate
   sinks and pulls the disc onto its seat; as it empties, the springs lift the plate and the disc opens.
   The parts below are laid out at 45 % and drawn in a group scaled 1/0.45, so everything is at full size; the group stands
   under the pallet box of the full-size chest, which is raised so that the spring stands reach the floor. w() maps a point
   of the layout to the scene (for the flows). */
let B03V={s2:[[0,0,0],[0,0,0]],s3:[[0,0,0],[0,0,0]]};   // cameras of steps 2 and 3, set when the model is built
function buildSchwimmer(){
  const oy=34, m={blower:true,rpm:1,h:0.75,vo:0,n:0,np:0,lock:false,ph:0};
  const X0=-26, X1=26, Z0=-5, Z1=11, ZC=(Z0+Z1)/2, yFb=oy-3.5, CH0=-27, CH1=-13, HX=-20, HR=1.4, LROD=7.4;
  const K=1/0.45, P=fullChestPlan(K*oy,0), Ox=(P.CL.R-P.CL.L)/2, Oz=P.zF-21.75;
  const w=(x,y,z)=>V3(Ox+K*x,K*y,Oz+K*(z-ZC)), W=pts=>pts.map(v=>w(v.x,v.y,v.z));
  const R=new T.Group(); R.position.set(Ox,0,Oz-K*ZC); R.scale.setScalar(K); CX.root.add(R);
  let chest=null;
  // blower
  const BX=-104, BY=10;
  box(R,14,14,14,MAT.casing,BX,BY,ZC,LB('送風機のケース','Gebläsegehäuse'));
  const imp=new T.Group(); imp.position.set(BX,BY,ZC+1); R.add(imp);
  const hub=mk(G_CYL,MAT.iron,imp,LB('羽根車','Laufrad')); hub.scale.set(5.6,1.2,5.6); hub.rotation.x=Math.PI/2; hub.position.z=-1.6;
  for(let b=0;b<8;b++){ const bl=box(imp,0.5,5.2,2.6,MAT.metalDark,0,0,0,LB('羽根車の羽根','Laufradschaufel')); const an=b/8*Math.PI*2; bl.position.set(Math.cos(an)*3.2,Math.sin(an)*3.2,0); bl.rotation.z=an-Math.PI/2+0.35; }
  const mot=mk(G_CYL,MAT.iron,R,LB('電動モーター','Motor')); mot.rotation.x=Math.PI/2; mot.scale.set(4,7,4); mot.position.set(BX,BY,ZC-10.5);
  const DP=[V3(BX+7,BY,ZC),V3(-60,BY,ZC),V3(-60,oy-1.75,ZC),V3(CH0-0.3,oy-1.75,ZC)];
  duct(W(DP),3.2*K,MAT.wood,LB('風導管（送風機からシュヴィンマーの入口へ）','Windkanal'));
  // fixed frame under the chest: inlet channel at the left end, open neck to the pallet box elsewhere
  const LF=LB('シュヴィンマーの枠（風箱の底板の下に固定。中央の穴で風箱とつながる）','Schwimmer');
  box(R,X1-X0,0.5,Z1-Z0,MAT.wood,0,yFb+0.25,ZC,LF);
  for(const z of [Z0,Z1]) box(R,X1-X0,3,0.6,MAT.wood,0,oy-1.5,z,LF);
  for(const x of [X0,X1]) box(R,0.6,3,Z1-Z0,MAT.wood,x,oy-1.5,ZC,LF);
  const LCH=LB('入口の通路（送風機の風がここに来る）','Einlasskanal');
  box(R,0.6,3,Z1-Z0-1.2,MAT.wood,CH1,oy-1.5,ZC,LCH);
  box(R,CH1-CH0,0.5,Z1-Z0,MAT.wood,(CH0+CH1)/2,oy-0.25,ZC,LCH);
  const seat=mk(G_CYL_OPEN,MAT.dark,R,LB('弁座（入口の穴）','Kegelsitz')); seat.scale.set(HR,0.5,HR); seat.position.set(HX,yFb+0.25,ZC);
  for(const x of [-6,6,18]) bore(R,MAT.dark,x,yFb,yFb+0.5,ZC,2.4,LB('風箱へ通じる穴','Kanal'));
  const disc=cyl(R,HR+0.7,0.35,MAT.leather,HX,yFb+0.7,ZC,LB('入口弁（円板。下がると穴をふさぐ）','Schwimmerventil'));
  const vrod=rod(R,0.13,MAT.iron,LB('弁の棒（可動板とつながる。可動板が下がると弁を閉じる）','Ventilstange'));
  // moving plate, folds, springs, frame below
  const plate=new T.Group(); R.add(plate);
  box(plate,X1-X0-1,0.8,Z1-Z0-1,MAT.woodPale,0,-0.4,0,LB('可動板（ばねで押し上げられ、風が入ると下がる）','Schwimmerplatte'));
  const nut=cyl(plate,0.45,0.35,MAT.leather,HX,0.18,0,LB('革ナット（弁の棒の長さを調整する）','Ledermutter'));
  const RL=LB('ひだ（革）','Falten'), RW=4.4;
  const rib={f1:plank(R,X1-X0-1,0.3,MAT.leather,RL),f2:plank(R,X1-X0-1,0.3,MAT.leather,RL),b1:plank(R,X1-X0-1,0.3,MAT.leather,RL),b2:plank(R,X1-X0-1,0.3,MAT.leather,RL),
             l1:plank(R,0.3,Z1-Z0-1,MAT.leather,RL),l2:plank(R,0.3,Z1-Z0-1,MAT.leather,RL),r1:plank(R,0.3,Z1-Z0-1,MAT.leather,RL),r2:plank(R,0.3,Z1-Z0-1,MAT.leather,RL)};
  const yBase=oy-17.5, LFB=LB('ばねの台','Federbock');
  for(const x of [-18,18]){ box(R,3,1,Z1-Z0+2,MAT.woodDark,x,yBase-0.5,ZC,LFB); for(const z of [Z0,Z1]) box(R,1.6,yBase-1,1.6,MAT.woodDark,x,(yBase-1)/2,z,LFB); }
  const SL0=12.5, SG=helixGeo(1.1,7,SL0,0.14), springs=[];
  const SPL=LB('ばね（可動板を押し上げて風に圧力をかける）','Schwimmerfeder');
  for(const x of [-18,18]) for(const z of [ZC-4,ZC+4]){ const s=mk(SG,MAT.iron,R,SPL); s.position.set(x,yBase,z); springs.push(s); }
  const plateY=()=>yFb-2.5-5.5*m.h;
  // particles
  new Tube(W([V3(BX,BY,ZC+18),V3(BX,BY,ZC+7)]),{kind:'air',r:1.3*K,density:0.8/K,state:()=>({open:m.rpm>0.15,speed:26*K*m.rpm})});
  const sup=new Tube(W(DP.concat([V3(HX,oy-1.75,ZC)])),{r:1*K,density:0.55/K,front:200*K,state:()=>({open:m.rpm>0.2,speed:K*(m.lock?2+1.6*m.n:4+30*m.vo)*m.rpm})});
  new Tube(W([V3(HX,oy-1.6,ZC),V3(HX+0.4,yFb+0.1,ZC),V3(HX+1.2,yFb-2,ZC),V3(HX+4,yFb-3,ZC)]),{r:0.5*K,density:1.4/K,front:200*K,state:()=>({open:sup.full()&&(m.lock||m.vo>0.04),speed:K*(m.lock?18:4+26*m.vo)})});
  const bel=new Vol((a,b,c,out)=>{ const py=plateY(); out.copy(w(X0+1.2+a*(X1-X0-2.4),py+0.2+b*(yFb-py-0.4),Z0+0.8+c*(Z1-Z0-1.6))); },260,{state:()=>sup.head>0?0.2+0.8*clamp(m.h/0.8,0,1):0,rate:2});
  const neck=new Tube(W([V3(-6,yFb-1,ZC),V3(-6,oy+0.5,ZC),V3(-6,oy+3,ZC+4)]),{r:1.2*K,density:0.8/K,front:300*K,state:()=>({open:bel.fill>0.3&&S.p>10,speed:K*(4+1.2*m.n)})});
  for(const x of [6,18]) new Tube(W([V3(x,yFb-1,ZC),V3(x,oy+0.5,ZC),V3(x,oy+3,ZC+4)]),{r:1.2*K,density:0.8/K,front:300*K,state:()=>({open:bel.fill>0.3&&S.p>10,speed:K*(4+1.2*m.n)})});
  chest=buildFullChest(P,neck);
  for(const x of [-6,6,18]) bore(R,MAT.dark,x,oy,oy+1,ZC,2.4,LB('風箱の底板の穴（シュヴィンマーとつながる）','Kanal'));
  const lockPins=[-1,1].map(s=>box(R,1.2,1,1.2,MAT.iron,s*18,yBase,ZC,LB('つっかい棒（可動板を固定してシュヴィンマーを効かなくする）','Anschlag')));
  chest.finish();
  B03V={s2:[w(-2,14,44).toArray(),w(-20,27,3).toArray()],s3:[w(52,18,78).toArray(),w(-6,24,3).toArray()]};
  return {chest,
    controls:[{type:'toggle',id:'blower',label:'送風機',get:()=>m.blower,set:v=>m.blower=v},
      {type:'toggle',id:'lock',label:'シュヴィンマーを固定する',get:()=>m.lock,set:v=>m.lock=v}],
    ctl:{blower:v=>m.blower=v,lock:v=>m.lock=v},
    pins:[{t:'送風機',p:w(BX,BY+10,ZC)},{t:'シュヴィンマー',p:w(X1+3,yFb-4,Z1)},{t:'ばね',p:w(-18,yBase+4,Z1+3)},{t:'入口弁',p:w(HX,oy+2,Z0-3),max:120*K},{t:'風箱',p:V3(chest.xR+4,chest.base,chest.zF)}],
    update(dt){
      const n=chest.speaking().length; m.n=n;
      m.rpm+=((m.blower?1:0)-m.rpm)*Math.min(1,dt*1.5);
      if(m.lock){
        m.h+=(0.45-m.h)*Math.min(1,dt*3); m.vo=clamp((0.8-m.h)*5.5/1.8,0,1);
        m.np+=(n-m.np)*Math.min(1,dt*1.2);
        const tg=Math.max(0,m.rpm*(82-0.45*n-1.2*Math.max(0,n-m.np))); S.p+=(tg-S.p)*Math.min(1,dt*6);
      } else {
        m.vo=clamp((0.8-m.h)*5.5/1.8,0,1);
        const inflow=m.rpm*2.6*m.vo, out=(m.h>0.01&&n>0)?0.04+0.03*n:(m.h>0.01?0.01:0);
        m.h=clamp(m.h+(inflow-out)*dt,0,1);
        m.np+=(n-m.np)*Math.min(1,dt*10);
        const tg=m.h>0.02?62+18*m.h-0.6*Math.max(0,n-m.np):m.rpm*20*m.vo; S.p+=(tg-S.p)*Math.min(1,dt*10);
      }
      imp.rotation.z-=m.rpm*dt*30;
      const py=plateY(); plate.position.set(0,py,ZC);
      const H=yFb-py, hf=H/2, d=Math.sqrt(Math.max(0,RW*RW-hf*hf));
      rib.f1.set(V3(0,py,Z1-0.5),V3(0,py+hf,Z1-0.5+d)); rib.f2.set(V3(0,py+hf,Z1-0.5+d),V3(0,yFb,Z1-0.5));
      rib.b1.set(V3(0,py,Z0+0.5),V3(0,py+hf,Z0+0.5-d)); rib.b2.set(V3(0,py+hf,Z0+0.5-d),V3(0,yFb,Z0+0.5));
      rib.l1.set(V3(X0+0.5,py,ZC),V3(X0+0.5-d,py+hf,ZC)); rib.l2.set(V3(X0+0.5-d,py+hf,ZC),V3(X0+0.5,yFb,ZC));
      rib.r1.set(V3(X1-0.5,py,ZC),V3(X1-0.5+d,py+hf,ZC)); rib.r2.set(V3(X1-0.5+d,py+hf,ZC),V3(X1-0.5,yFb,ZC));
      const sl=py-0.8-yBase; springs.forEach(s=>s.scale.y=sl/SL0);
      const dy=Math.max(yFb+0.68,py+LROD+0.18); disc.position.y=dy; vrod.set(V3(HX,py+0.3,ZC),V3(HX,dy,ZC));
      lockPins.forEach(p=>{ p.visible=m.lock; const hh=py-0.8-yBase; p.scale.y=hh; p.position.y=yBase+hh/2; });
      chest.update(dt);
    }};
}

