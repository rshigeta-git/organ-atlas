/* ---------------- wind supply ---------------- */
/* B-01: three wedge bellows after Dom Bédos (L'art du facteur d'orgues). They lie side by side on sleepers, the head toward
   the front. A trestle straddling the bellows carries one lever per bellows: its short arm reaches forward and lifts the head
   of the top board through an iron rod, its long arm runs back over the tail (hinge) and up between the uprights of the
   gallows, where the calcant pulls it down. Everything is drawn at full size (the group's scale K = 1); the numbers below are
   full size (1 = 7.8 mm): bellows 1.09 m × 0.47 m, head rise 0.23 m; lever 1.31 m (short arm 0.22 m) on a pivot
   0.57 m above the floor, swinging 60° (55° up to 5° down): the grip goes from 1.47 m down to 0.48 m; calcant 1.57 m.
   The bellows stand one bellows width beside the chest and one bellows length behind it. */
const BB={K:1, O:[0,0,0], F:-7, L:140, W:60, ZT:-70, XB:[-228,-152,-76], NF:4, thMax:0.215, UA:118, hA:4.5, ZP:24, YP:66.5, a:28, b:140, ph0:0.96, ZG:-40, ZS:-128};
BB.yb=BB.F+11.5;   // top of the bottom board = hinge line
const bbW=(x,y,z)=>V3(BB.O[0]+BB.K*x,BB.O[1]+BB.K*y,BB.O[2]+BB.K*z);   // full-size group coordinates → scene
const bbS=ph=>[BB.ZP+BB.a*Math.cos(ph),BB.YP-BB.a*Math.sin(ph)];   // short end of the lever (z, y)
const bbA=th=>[BB.ZT+BB.UA*Math.cos(th)-BB.hA*Math.sin(th),BB.yb+BB.UA*Math.sin(th)+BB.hA*Math.cos(th)];   // eye on the top board
BB.ell=Math.hypot(bbS(BB.ph0)[0]-bbA(0)[0],bbS(BB.ph0)[1]-bbA(0)[1]);   // length of the iron rod
function bbPhi(th){ const A=bbA(th); let lo=-0.6, hi=1.3; for(let k=0;k<28;k++){ const m=(lo+hi)/2, s=bbS(m); if(Math.hypot(s[0]-A[0],s[1]-A[1])>BB.ell) lo=m; else hi=m; } return (lo+hi)/2; }
function buildBedosBellows(R,i,th0){
  const {L,W,ZT,NF:n,yb,F,K}=BB, x=BB.XB[i], B={th:th0,pumping:false,supplying:false,flow:0,x,E:V3()};
  box(R,W+4,2.5,L+6,MAT.wood,x,yb-1.25,ZT+L/2-1,LB('下板（固定）','Unterplatte'));
  box(R,W+2,1.2,3,MAT.leather,x,yb+0.6,ZT-1.5,LB('蝶番（革）','Scharnier'));
  const top=new T.Group(); top.position.set(x,yb,ZT); R.add(top);
  box(top,W+4,2.5,L+4,MAT.wood,0,1.25,L/2+1,LB('上板（尾の蝶番を中心に開閉する）','Oberplatte'));
  const WL=LB('おもり（この重さが風圧になる）','Gewicht');
  for(const [wx,wz] of [[-17,108],[17,108],[-17,88],[17,88],[0,90]]) box(top,13,6,13,MAT.weight,wx,5.5,wz,WL);
  box(top,5,2,5,MAT.iron,0,3.5,BB.UA,LB('吊り金の留め金','Öse'));
  // folds: n ribs a side, hinged at the tail; the odd fold lines go out as the bellows closes (the ribs keep their width)
  const geo=new T.BufferGeometry(), pos=new Float32Array(4*n*9); geo.setAttribute('position',new T.BufferAttribute(pos,3)); CX.own.push(geo);
  mk(geo,MAT.leather,R,LB('ひだ（革を貼った板が折りたたまれる）','Falten'));
  const edges=[...Array(3*(n-1))].map(()=>rod(R,0.3,MAT.woodDark,LB('ひだ（革を貼った板が折りたたまれる）','Falten')));
  const sMax=L*Math.sin(BB.thMax)/n, hinge=s=>V3(x+s*W/2,yb,ZT);
  const P=(j,th,s)=>{ const t=th*j/n, g=L*(Math.sin(th*(j+1)/n)-Math.sin(th*(j-1)/n))/2, o=j%2?Math.sqrt(Math.max(0,sMax*sMax-g*g)):0;
    return V3(x+s*(W/2+o),yb+L*Math.sin(t),ZT+L*Math.cos(t)+o); };
  const folds=th=>{ let q=0; const put=v=>{ pos[q++]=v.x; pos[q++]=v.y; pos[q++]=v.z; };
    const C=[-1,1].map(s=>[...Array(n+1).keys()].map(j=>P(j,th,s)));
    [-1,1].forEach((s,si)=>{ const h=hinge(s); for(let j=0;j<n;j++){ put(h); put(C[si][j]); put(C[si][j+1]); } });
    for(let j=0;j<n;j++){ const a=C[0][j], b=C[1][j], c=C[1][j+1], d=C[0][j+1]; put(a); put(b); put(c); put(a); put(c); put(d); }
    geo.attributes.position.needsUpdate=true; geo.computeVertexNormals(); geo.computeBoundingSphere();
    let e=0; for(let j=1;j<n;j++){ edges[e++].set(hinge(-1),C[0][j]); edges[e++].set(hinge(1),C[1][j]); edges[e++].set(C[0][j],C[1][j]); } };
  // intake valve in the bottom board (air comes in from under it, between the sleepers); outlet with its non-return valve near the tail,
  // into the collecting trunk that runs under the bottom boards
  box(R,10,2.7,8,MAT.dark,x,yb-1.25,24,LB('吸気口','Ansaugöffnung'));
  const inf=new T.Group(); inf.position.set(x,yb,19); R.add(inf);
  box(inf,13,0.5,11,MAT.leather,0,0.25,5.5,LB('吸気弁（レバーを引く間だけ開いて外気を吸う）','Schöpfventil'));
  box(R,8,2.7,7,MAT.dark,x,yb-1.25,-62,LB('ふいごの出口','Balgkanal'));
  const ofl=new T.Group(); ofl.position.set(x,yb-2.5,-66.5); R.add(ofl);
  box(ofl,9,0.5,8,MAT.leather,0,-0.25,4,LB('逆止弁（風導管へ送る間だけ開く）','Rückschlagventil'));
  // lever: pivot on the trestle over the front part of the bellows, short arm forward (+z) to the iron rod, long arm back (−z) to the calcant
  const lever=plank(R,4.5,5.5,MAT.woodDark,LB('ふいごのレバー（カルカントが先を引き下げる）','Balghebel'));
  const iron=rod(R,0.6,MAT.iron,LB('吊り金（レバーの短い腕が上板を持ち上げる）','Balgeisen'));
  const grip=rod(R,1.3,MAT.woodPale,LB('握り','Griff'));
  const pin=mk(G_CYL,MAT.iron,R,LB('レバーの軸','Drehstift')); pin.rotation.z=Math.PI/2; pin.scale.set(0.8,11,0.8); pin.position.set(x,BB.YP,BB.ZP);
  for(const s of [-1,1]) box(R,2,15,10,MAT.woodDark,x+s*4.25,BB.YP-2,BB.ZP,LB('レバーの軸受け','Lagerbock'));
  B.update=()=>{
    const th=B.th; top.rotation.x=-th; folds(th);
    inf.rotation.x=B.pumping?-0.55:0; ofl.rotation.x=B.supplying?0.5:0;
    const ph=bbPhi(th), c=Math.cos(ph), s=Math.sin(ph), A=bbA(th), at=(d)=>V3(x,BB.YP+d*s,BB.ZP-d*c);
    B.E.copy(at(BB.b)); lever.set(at(-BB.a-4),at(BB.b+3)); iron.set(V3(x,A[1],A[0]),at(-BB.a));
    grip.set(V3(x-8,B.E.y,B.E.z),V3(x+8,B.E.y,B.E.z));
  };
  // particles (scene coordinates)
  const xe=BB.XB[2]+40;
  new Tube(sharpPath([bbW(x+W/2+7,F+4,24),bbW(x,F+4,24),bbW(x,yb+3,24),bbW(x,yb+5,14)],1),{kind:'air',r:1.4*BB.K,density:0.6,state:()=>({open:B.pumping,speed:30*BB.K})});
  new Vol((a,b,c,out)=>{ const u=0.1+0.86*a, th=B.th; out.copy(bbW(x+(c-0.5)*(W-6),yb+0.9+b*Math.max(0,u*L*Math.sin(th)-1.6),ZT+u*L*Math.cos(th))); },160,{state:()=>B.th>0.004?0.15+0.85*B.th/BB.thMax:0,rate:3});
  B.out=new Tube(sharpPath([bbW(x,yb+2,-54),bbW(x,yb+1,-62),bbW(x,-1.5,-62),bbW(xe,-1.5,-62)],1),{r:1.1*BB.K,density:0.6,state:()=>({open:B.supplying,speed:B.flow})});
  return B;
}
// sleepers under the bellows, the trestle straddling them with the lever beam, and the gallows over the tails
function buildBedosFrame(R){
  const {F,XB,ZP,YP,ZG}=BB, x0=XB[0]-39, x1=XB[2]+39, xm=(x0+x1)/2;
  for(const z of [-48,5,58]) box(R,x1-x0,9,8,MAT.woodDark,xm,F+4.5,z,LB('ふいごの台木','Balglager'));
  box(R,x1-x0+8,8,8,MAT.wood,xm,YP-13,ZP,LB('レバーの台の梁','Balgbock'));
  const LT=LB('レバーの台（三角の脚）','Balgbock');
  for(const tx of [x0-4,(XB[0]+XB[1])/2,(XB[1]+XB[2])/2,x1+4]){   // legs at the ends and in the gaps between the bellows
    for(const s of [-1,1]) plank(R,4,4,MAT.wood,LT).set(V3(tx,F,ZP+s*30),V3(tx,YP-17,ZP+s*3));
    box(R,4,3,40,MAT.wood,tx,F+30,ZP,LT);
  }
  // the gallows over the tails: its uprights stand at the ends and in the gaps between the bellows; the long arm of each lever
  // runs between two guide posts, the top rail stops it when the bellows is closed, the lower rail when it is full
  const yAt=th=>YP+(ZP-ZG)*Math.tan(bbPhi(th)), y0=yAt(0), y1=yAt(BB.thMax), LG=LB('レバーの案内枠（ガロウズ）','Galgen');
  const yT=y0+3.2/Math.cos(BB.ph0)+2.2, yB=y1-3.2-2.2;
  box(R,x1-x0+8,4,6,MAT.wood,xm,yT,ZG,LG); box(R,x1-x0+8,4,6,MAT.wood,xm,yB,ZG,LG);
  for(const x of XB) for(const s of [-1,1]) box(R,3.2,yT-yB,4,MAT.wood,x+s*4.35,(yT+yB)/2,ZG,LG);   // guide posts between the rails
  for(const x of [x0-4,(XB[0]+XB[1])/2,(XB[1]+XB[2])/2,x1+4]) box(R,4,yT+2-F,6,MAT.wood,x,(yT+2+F)/2,ZG,LG);
  for(const x of [x0-4,x1+4]) for(const s of [-1,1]) plank(R,3,3,MAT.wood,LG).set(V3(x,F,ZG+s*40),V3(x,F+100,ZG));
}
/* the calcant: one man who walks from lever to lever and pulls each one down by its grip. The limbs are solved with
   two-bone IK (elbows go out and down, knees forward); he faces the bellows (+z). */
function ik2(a,c,l1,l2,hint){ const d=V3().subVectors(c,a), L=clamp(d.length(),Math.abs(l1-l2)+0.01,l1+l2-0.01); d.normalize();
  const ca=(l1*l1+L*L-l2*l2)/(2*l1*L), h=V3().copy(hint).addScaledVector(d,-hint.dot(d)).normalize();
  return {j:V3().copy(a).addScaledVector(d,l1*ca).addScaledVector(h,l1*Math.sqrt(Math.max(0,1-ca*ca))),e:V3().copy(a).addScaledVector(d,L)}; }
function buildCalcant(R){
  const {F,ZS}=BB, FZ=1, g=new T.Group(); R.add(g); const LK=LB('カルカント（ふいごのレバーを引く人）','Kalkant');
  const r=(rad,m)=>rod(g,rad,m,LK), sph=(m,sx,sy,sz)=>{ const s=mk(G_SPH,m,g,LK); s.scale.set(sx,sy,sz); return s; };
  const th=[r(5,MAT.coat),r(5,MAT.coat)], sh=[r(3.4,MAT.hose),r(3.4,MAT.hose)], ua=[r(3.4,MAT.linen),r(3.4,MAT.linen)], fa=[r(2.8,MAT.linen),r(2.8,MAT.linen)];
  const torso=plank(g,30,17,MAT.coat,LK), hips=plank(g,29,17,MAT.coat,LK), neck=r(3.4,MAT.skin);
  const head=sph(MAT.skin,8.5,10.5,9.5), hair=sph(MAT.hair,9,8.5,9.6), hands=[0,1].map(()=>sph(MAT.skin,3,4,3.2));
  const shoes=[0,1].map(()=>box(g,6,4,13,MAT.shoe,0,0,0,LK));
  const C={g,x:BB.XB[1],st:'idle',tgt:-1,t:0,man:false,pin:V3(),feet:[-1,1].map(s=>({p:V3(BB.XB[1]+s*9,F+5,ZS),s,a:null,b:null,u:0}))};
  const rest=[V3(),V3()], gp=V3(), up=V3(), pel=V3(), nk=V3(), tmp=V3();
  C.draw=(dt,grip,blend,crouch)=>{
    // feet: one at a time steps toward its place beside the body
    for(const f of C.feet){ const tx=C.x+f.s*9;
      if(!f.a&&Math.abs(f.p.x-tx)>4&&!C.feet.some(o=>o.a)){ f.a=f.p.clone(); f.b=V3(tx+Math.sign(tx-f.p.x)*3,F+5,ZS); f.u=0; }
      if(f.a){ f.u=Math.min(1,f.u+dt*3.4); f.p.lerpVectors(f.a,f.b,f.u); f.p.y=F+5+6*Math.sin(Math.PI*f.u); if(f.u>=1) f.a=null; } }
    C.stepping=C.feet.some(f=>f.a);
    const lean=0.06+0.44*crouch; up.set(0,Math.cos(lean),FZ*Math.sin(lean));
    pel.set(C.x,F+116-30*crouch,ZS-FZ*3*crouch); nk.copy(pel).addScaledVector(up,60);
    torso.set(tmp.copy(pel).addScaledVector(up,-2),nk); hips.set(tmp.copy(pel).addScaledVector(up,-11),V3().copy(pel).addScaledVector(up,6));
    head.position.copy(nk).addScaledVector(up,15); neck.set(V3().copy(nk).addScaledVector(up,-3),head.position);
    hair.position.copy(head.position).add(V3(0,2.2,-FZ*2.6));
    C.pin.copy(head.position).add(V3(0,14,0)); C.pin.copy(bbW(C.pin.x,C.pin.y,C.pin.z));
    [-1,1].forEach((s,i)=>{
      const S=V3().copy(nk).addScaledVector(up,-6).add(V3(s*16,0,0));
      rest[i].copy(S).add(V3(s*4,-66,FZ*4)); gp.copy(rest[i]); if(grip&&blend>0) gp.lerp(V3(grip.x+s*6,grip.y,grip.z),blend);
      const k=ik2(S,gp,39,38,V3(s,-1,-FZ*0.7)); ua[i].set(S,k.j); fa[i].set(k.j,k.e); hands[i].position.copy(k.e);
      const H=V3().copy(pel).add(V3(s*8,-5,0)), f=C.feet[i].p, kn=ik2(H,f,58,56,V3(0,0.25,FZ));
      th[i].set(H,kn.j); sh[i].set(kn.j,kn.e); shoes[i].position.set(f.x,f.y-3,f.z+FZ*3.5);
    });
  };
  return C;
}
/* full-size slider chest for the B models, built like the H-03 chests: C/Cis layout, channel widths and stop rows from the
   real pipes of STOPSET, on a stand of four legs. fullChestPlan gives the layout (so the wind supply can be placed first),
   buildFullChest builds it; call chest.finish() once the model is complete (merges the fixed parts). */
let D01V=[[0,0,0],[0,0,0]];   // D-01: camera of the last step, set when the model is built
let C01V={cut:0.5,cam:[[0,0,0],[0,0,0]]};   // C-01: section and camera of the last step, set when the model is built
/* chromatic layout: the notes side by side from C at the left, each channel as wide as in h3Layout (widest pipe of the note) */
function chromLayout(ks,wfn,x0){
  const w={}, xs={}; for(const k of ks){ const d=wfn(k); w[k]=H3MM(Math.max(18,d+Math.max(8,0.1*d))); }
  const tot=ks.reduce((s,k)=>s+w[k],0); let x=x0-tot/2; for(const k of ks){ xs[k]=x+w[k]/2; x+=w[k]; }
  return {w,xs,L:tot/2,R:tot/2};
}
// split: true gives the C/Cis layout (largest pipes at both ends), otherwise the notes are in chromatic order
function fullChestPlan(yC,floor,zF0,stops,split){
  const ST=stops||STOPSET, KS=[...Array(13).keys()], CL=(split?h3Layout:chromLayout)(KS,k=>Math.max(...ST.map(si=>pipeFoot(si,k)[0]))*7.8,0);
  const D0=-Math.min(...h3Rows(ST,0,0).map(r=>r.z-r.d/2))+2, zF=zF0!=null?zF0:D0/2;   // zF0: front of the chest (default: centred on z 0)
  return {KS,CL,rows:h3Rows(ST,0,zF),zF,yC,floor,xL:-CL.L,yIn:yC+6.5,zIn:zF-20};
}
function buildFullChest(P,feed,inlet,spring,kd,o){
  o=o||{};
  const ST=new T.Group(); CX.root.add(ST); if(!CX.pool) CX.pool=mkPool();   // several chests in one model share the pool
  const chest=buildChestR({name:o.name||'手鍵盤',ks:P.KS,xs:P.CL.xs,ws:P.CL.w,y:P.yC,zF:P.zF,rows:P.rows,KD:kd||S.kd,SP:o.sp||S.sp,pedal:!!o.pedal,volN:o.volN,slDir:o.slDir||1,slOff:o.slOff||(s=>3*(1-s)),ud:k=>({key:k}),feed,spring,slAct:o.act,slStop:o.act?null:(o.sp&&o.sp!==S.sp&&!o.spStop?null:(i=>i))},ST);
  const h=P.yC-P.floor; if(h>1&&!o.noLegs) for(const x of [chest.xL+3,chest.xR-3]) for(const z of [chest.zF-3,chest.zB+3]) box(ST,4,h,4,MAT.woodDark,x,P.floor+h/2,z,LB('風箱の台の脚','Ladengestell'));
  // inlet 'L'/'R' (models without a wind supply): the end of the wind trunk entering the pallet box at that side
  if(inlet){ const sg=inlet==='L'?-1:1, x0=sg<0?chest.xL-0.5:chest.xR+0.5, x1=x0+sg*16, y=P.yIn, z=P.zIn;
    (CX.inlets||(CX.inlets=[])).push(V3(x1,y,z));
    duct([V3(x1,y,z),V3(x0,y,z)],8,MAT.wood,LB('風導管（送風機から。ここから風箱に風が入る）','Windkanal'));
    new Tube([V3(x1,y,z),V3(x0-sg*3,y,z)],{r:2.2,density:0.5,front:400,state:()=>({open:S.p>10,speed:2+3*chest.speaking().length})}); }
  chest.finish=()=>{ mergeStatic(ST); if(!CX.pool.done){ CX.pool.finish(); CX.pool.done=true; } };   // call once all chests of the model are built
  return chest;
}
function buildBedosOrgan(){
  let chest=null; const thMax=BB.thMax, m={auto:true,force:null,hold:[false,false,false]};
  // the chest at full size; the bellows stand one bellows width to its left and one bellows length behind it
  const R=CX.root, P=fullChestPlan(30,-7), {xL,yIn,zIn}=P;
  BB.O=[xL-1-(BB.W+4)*BB.K-(BB.XB[2]+(BB.W+4)/2)*BB.K, -7-BB.F*BB.K, -(BB.L+6)*BB.K];
  const G=new T.Group(); G.position.set(...BB.O); G.scale.setScalar(BB.K); R.add(G);
  const bs=[0.92,0.66,0.4].map((f,i)=>buildBedosBellows(G,i,f*thMax));
  const c0=bbW(BB.XB[0]-36,-1.5,-62), c1=bbW(BB.XB[2]+40,-1.5,-62);   // under the bottom boards
  duct([c0,c1],7*BB.K,MAT.wood,LB('ふいごの出口をまとめる管','Sammelkanal'));
  const xT=xL-8, tp=[c1,V3(xT,c1.y,c1.z),V3(xT,c1.y,zIn),V3(xT,yIn,zIn),V3(xL-0.5,yIn,zIn)];
  duct(tp,7,MAT.wood,LB('風導管（ふいごから風箱へ）','Windkanal'));
  const trunk=new Tube(sharpPath(tp,1),{r:2,density:0.4,front:400,state:()=>({open:S.p>10,speed:3*(chest?chest.speaking().length:0)})});
  chest=buildFullChest(P,trunk);
  buildBedosFrame(G);
  const C=buildCalcant(G), E0=V3(), E1=V3();
  // a small bell on a bracket at the end post of the gallows next to the organ: the organist rings it to call the calcant
  const BL=LB('呼び鈴（カルカントに合図する）','Kalkantenglocke'), bx=BB.XB[2]+43, by=150, bz=BB.ZG-3;
  box(G,2,2,16,MAT.woodDark,bx,by,bz-8,BL); box(G,2,8,2,MAT.woodDark,bx,by-4,bz-15,BL);
  const bell=new T.Group(); bell.position.set(bx,by-2,bz-15); G.add(bell);
  const cup=mk(G_CONE,MAT.brass,bell,BL); cup.rotation.x=Math.PI; cup.scale.set(4.2,6,4.2); cup.position.y=-7;
  const crown=mk(G_SPH,MAT.brass,bell,BL); crown.scale.set(1.6,1.4,1.6); crown.position.y=-3.6;
  const clap=mk(G_SPH,MAT.iron,bell,LB('呼び鈴の舌','Kalkantenglocke')); clap.scale.setScalar(1.1); clap.position.y=-10.5;
  const ring={t:9}, ding=()=>{ ring.t=0; bellStrike(2093,0.9); later(130,()=>bellStrike(2093,0.55)); };
  { const t=bs[0].th; bs[0].th=0; bs[0].update(); E0.copy(bs[0].E); bs[0].th=thMax; bs[0].update(); E1.copy(bs[0].E); bs[0].th=t; }
  chest.finish();
  // the calcant: picks the emptiest bellows (or the one asked for), steps to its lever, reaches up, pulls it down until the
  // bellows is full (the lower rail of the gallows), lets go
  const calcant=(dt,rate)=>{
    const held=m.hold.findIndex(h=>h);
    bs.forEach(b=>b.pumping=false);
    if(C.st==='idle'){ let j=-1;
      if(held>=0) j=held; else if(m.force!=null) j=m.force;
      else if(m.auto){ let k=0; bs.forEach((b,i)=>{ if(b.th<bs[k].th) k=i; }); if(bs[k].th<0.8*thMax) j=k; }
      if(j>=0){ C.tgt=j; C.st='walk'; C.man=held>=0; if(m.force===j) m.force=null; } }
    if(C.st==='walk'){ const d=BB.XB[C.tgt]-C.x; C.x+=Math.sign(d)*Math.min(Math.abs(d),140*dt); if(Math.abs(d)<0.5&&!C.stepping){ C.st='reach'; C.t=0; } }
    else if(C.st==='reach'){ C.t=Math.min(1,C.t+dt/0.4); if(C.t>=1) C.st='pull'; }
    else if(C.st==='pull'){ const b=bs[C.tgt]; b.pumping=true; b.th=Math.min(thMax,b.th+rate*dt);
      if(C.man?!m.hold[C.tgt]:(b.th>=thMax||!m.auto)){ C.st='release'; C.t=1; b.pumping=false; } }
    else if(C.st==='release'){ C.t=Math.max(0,C.t-dt/0.35); if(C.t<=0) C.st='idle'; }
  };
  return {chest,
    pins:[{t:'ふいご1',p:bbW(BB.XB[0],28,10)},{t:'ふいご2',p:bbW(BB.XB[1],28,10)},{t:'ふいご3',p:bbW(BB.XB[2],28,10)},{t:'ふいごレバー',p:bbW(BB.XB[0]-12,150,-60)},
      {t:'レバーの支点の台',p:bbW(BB.XB[0]-40,BB.YP,BB.ZP)},{t:'レバーの案内枠（ガロウズ）',p:bbW(BB.XB[2]+44,170,BB.ZG)},{t:'カルカント',p:C.pin},{t:'風導管',p:tp[2].clone().add(V3(0,8,0))},{t:'風箱',p:V3(chest.xR+4,chest.base,chest.zF)}],
    controls:[{type:'toggle',id:'auto',label:'カルカント',get:()=>m.auto,set:v=>{ m.auto=v; ding(); }},
      ...[0,1,2].map(i=>({type:'hold',label:'ふいご'+(i+1),down:()=>m.hold[i]=true,up:()=>m.hold[i]=false}))],
    ctl:{auto:v=>m.auto=v,pump0:()=>m.force=0},
    update(dt){
      const n=chest.speaking().length, cons=thMax*(0.004+0.005*n), rate=Math.max(thMax*0.55,cons*3.5);   // he pulls faster as consumption rises
      calcant(dt,rate);
      ring.t+=dt; bell.rotation.z=ring.t<3?0.45*Math.sin(ring.t*17)*Math.exp(-ring.t*1.8):0;   // the bell swings and dies away
      const sup=bs.filter(b=>!b.pumping&&b.th>0.003);
      bs.forEach(b=>{ b.supplying=sup.includes(b); b.flow=2.5*n; });
      sup.forEach(b=>b.th=Math.max(0,b.th-cons/sup.length*dt));
      const target=sup.length?74+3*(sup.reduce((s,b)=>s+b.th,0)/sup.length/thMax):0;
      S.p+=(target-S.p)*Math.min(1,dt*(target>S.p?8:4));
      chest.update(dt); bs.forEach(b=>b.update());
      const blend=C.st==='reach'||C.st==='release'?C.t*C.t*(3-2*C.t):C.st==='pull'?1:0, b=bs[C.tgt];
      C.draw(dt,b&&b.E,blend,b?blend*clamp((E0.y-b.E.y)/(E0.y-E1.y),0,1):0);
    }};
}
/* B-02: electric blower and magazine reservoir with roller-curtain valve. The parts are laid out in their own frame (numbers
   below) and drawn in a group scaled by o.K and placed at o.O; w() maps a point of that frame to the scene (for the flows).
   At K = 1/0.45 the reservoir is 0.69 m × 0.52 m and the blower casing 0.28 m. */
let B02V=[[0,0,0],[0,0,0]];   // B-02: camera for the curtain-valve step, set when the model is built
function buildBlowerMag(o){
  const K=o.K||1, O=o.O||[0,0,0], w=(x,y,z)=>V3(O[0]+K*x,O[1]+K*y,O[2]+K*z);
  const R=new T.Group(); R.position.set(...O); R.scale.setScalar(K); CX.root.add(R);
  const M={h:o.h0==null?0.8:o.h0,blower:o.on!==false,rpm:o.on===false?0:1,vo:0,n:0,w};
  box(R,16,16,16,MAT.casing,-122,8,0,LB('送風機のケース','Gebläsegehäuse'));
  const imp=new T.Group(); imp.position.set(-122,8,1); R.add(imp);
  const hub=mk(G_CYL,MAT.iron,imp,LB('羽根車（回転して風を起こす）','Laufrad')); hub.scale.set(6.6,1.2,6.6); hub.rotation.x=Math.PI/2; hub.position.z=-1.6;
  for(let b=0;b<8;b++){ const bl=box(imp,0.6,6.2,3,MAT.metalDark,0,0,0,LB('羽根車の羽根','Laufradschaufel')); const an=b/8*Math.PI*2; bl.position.set(Math.cos(an)*3.8,Math.sin(an)*3.8,0); bl.rotation.z=an-Math.PI/2+0.35; }
  const mot=mk(G_CYL,MAT.iron,R,LB('電動モーター','Motor')); mot.rotation.x=Math.PI/2; mot.scale.set(4.5,8,4.5); mot.position.set(-122,8,-12);
  const ring=mk(G_CYL_OPEN,MAT.iron,R,LB('吸気口','Ansaugöffnung')); ring.rotation.x=Math.PI/2; ring.scale.set(4.2,2,4.2); ring.position.set(-122,8,9);
  duct([w(-114,5,0),w(-89,5,0),w(-89,11,0)],5*K,MAT.casing,LB('送風管（ふいごの下板を通ってカーテン弁へ）','Windleitung'));
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
  // the folded sides: one skin round the reservoir, folding outward on all four sides; at the middle fold the outline is
  // the bottom board's grown by d, so the corners close as on a real reservoir
  const rg=new T.BufferGeometry(), rp=new Float32Array(4*2*2*9); rg.setAttribute('position',new T.BufferAttribute(rp,3)); CX.own.push(rg);
  mk(rg,MAT.leather,R,RL);
  const ribSet=(ty,hf,d)=>{ const X0=-94.5, X1=-55.5, Z0=-15, Z1=15, ym=11+hf;
    const ring=(y,e)=>[[X0-e,y,Z0-e],[X1+e,y,Z0-e],[X1+e,y,Z1+e],[X0-e,y,Z1+e]], L=[ring(11,0),ring(ym,d),ring(ty,0)]; let q=0;
    for(let k=0;k<2;k++) for(let i=0;i<4;i++){ const a=L[k][i], b=L[k][(i+1)%4], c=L[k+1][(i+1)%4], e=L[k+1][i];
      for(const p of [a,b,c,a,c,e]){ rp[q++]=p[0]; rp[q++]=p[1]; rp[q++]=p[2]; } }
    rg.attributes.position.needsUpdate=true; rg.computeVertexNormals(); rg.computeBoundingSphere(); };
  const cords=[-1,1].map(()=>rod(R,0.12,MAT.cord,LB('ひも（上板が上がるとローラーを引き上げる）','Zugschnur')));
  const eyes=[-1,1].map(s=>{ const e=mk(G_CYL,MAT.brass,top,LB('ひもの留め金','Öse')); e.scale.set(0.35,0.5,0.35); e.position.set(VX+0.6+75,-0.25,s*5.6); return e; });
  duct(o.trunkPts,o.trunkS||6,MAT.wood,LB('風導管（ふいごから風箱へ）','Windkanal'));
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
    ribSet(ty,hf,d);
    M.d=d;
    const ry=VB+6.6*(1-M.vo)+0.55; roller.position.set(VX+0.6,ry,0);
    const cl=Math.max(0.05,ry-0.55-VB); curtain.scale.y=cl; curtain.position.y=VB+cl/2;
    cords[0].set(V3(VX+0.6,ry,-5.6),V3(VX+0.6,ty,-5.6)); cords[1].set(V3(VX+0.6,ry,5.6),V3(VX+0.6,ty,5.6));
  };
  M.intake=new Tube([w(-122,8,26),w(-122,8,8)],{kind:'air',r:1.6*K,density:0.8/K,front:(o.front||40)*K,state:()=>({open:M.rpm>0.15,speed:30*K*M.rpm*M.vo})});
  M.blowOut=new Tube([w(-118,5,0),w(-114,5,0),w(-89,5,0)],{r:1.4*K,density:0.75/K,front:(o.front||40)*K,state:()=>({open:M.rpm>0.25,speed:30*K*M.rpm*M.vo})});
  M.thru=new Tube([w(-89,5,0),w(-89,13,0),w(-89,17.6,0),w(-85.5,17.6,0),w(-81,16.5,0)],{r:1.1*K,density:0.8/K,front:(o.front||40)*K,state:()=>({open:M.blowOut.full()&&M.vo>0.05,speed:30*K*M.rpm*M.vo})});
  M.vol=new Vol((a,b,c,out)=>{ const ty=topY(), y=11.7+b*(ty-12.4), q=(y-11)/Math.max(1,ty-11), off=1.2; out.copy(w(lerp(-94.5+off,-55.5-off,a),y,(c-0.5)*27)); },320,{state:()=>M.h>0.012?0.15+0.85*M.h:0,rate:o.front?0.5:1.4});
  M.trunk=new Tube(o.trunkPts,{r:1.7*(o.trunkS?o.trunkS/6:1),density:0.4,front:o.front||400,state:()=>({open:M.h>0.012&&S.p>10&&(!o.front||M.thru.full()||M.vol.fill>0.5),speed:3*M.n})});
  M.reset=()=>{ M.h=0; M.rpm=0; S.p=0; for(const f of flows) f.reset(); };
  return M;
}
