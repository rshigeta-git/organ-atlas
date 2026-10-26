/* ---------- F-03: Zimbelstern ----------
   A gilded star on the case front turns on a shaft; behind the case front a ring of small tuned bells is fixed round the
   shaft and a sprung clapper on the shaft strikes them in turn. The shaft is driven by a small wind wheel: drawing the stop
   opens a valve, wind blows through a nozzle onto the paddles. When the stop is put in, the wheel runs on and slows down. */
function buildZimbelstern(){
  const R=CX.root, YC=45, m={on:false,chord:false,flow:1,w:0,th:0,nb:6,last:0}, F=[783.99,987.77,1174.66,1567.98,1975.53,2349.32];
  // case front
  const LG=LB('オルガンケースの正面板','Gehäuse');
  box(R,52,58,1.6,MAT.wood,0,YC,0,LG);
  const bush=mk(G_CYL,MAT.brass,R,LB('軸受けのブッシュ','Achse')); bush.rotation.x=Math.PI/2; bush.scale.set(1,1.8,1); bush.position.set(0,YC,0);
  // star
  const sh=new T.Shape(); for(let j=0;j<16;j++){ const r=j%2?6.5:16, a=j/16*2*Math.PI+Math.PI/2, x=r*Math.cos(a), y=r*Math.sin(a); if(j) sh.lineTo(x,y); else sh.moveTo(x,y); } sh.closePath();
  const sg=new T.ExtrudeGeometry(sh,{depth:0.6,bevelEnabled:true,bevelThickness:0.25,bevelSize:0.25,bevelSegments:1}); CX.own.push(sg);
  const star=new T.Group(); star.position.set(0,YC,1.6); R.add(star);
  const GOLD=mclone(MAT.brass); GOLD.color.set(0xd9b25a); GOLD.metalness=0.25; GOLD.roughness=0.4; mk(sg,GOLD,star,LB('星（金色の木彫りの星。軸とともに回る）','Zimbelstern'));
  const boss=mk(G_CYL,GOLD,star,LB('星の中心','Zimbelstern')); boss.rotation.x=Math.PI/2; boss.scale.set(3,1.6,3); boss.position.z=0.8;
  // shaft & bearing brackets
  const shaft=mk(G_ROD,MAT.iron,R,LB('軸（星・カム・風車をつなぐ）','Welle')); shaft.rotation.x=Math.PI/2; shaft.scale.set(0.35,28,0.35); shaft.position.set(0,YC,-11.5);
  const LBk=LB('軸受けの台','Lagerbock');
  for(const z of [-3,-24]){ box(R,1.6,YC-1,1.6,MAT.woodDark,0,(YC-1)/2,z,LBk); box(R,2.4,2.4,1.6,MAT.woodDark,0,YC,z,LBk); }
  // tappets on the shaft, hammers on a pivot rail, bells hanging in a row below (as in historical Zimbelstern boxes)
  const BP=[[0,2.6],[0.55,2.56],[0.85,2.35],[0.95,1.7],[1.08,0.9],[1.4,0.25],[1.62,0]].map(p=>new T.Vector2(p[0],p[1]));
  const BG=new T.LatheGeometry(BP,24); CX.own.push(BG);
  const NB=6, BS=F.map(f=>0.82*Math.sqrt(F[0]/f)), BR=BS.map(q=>1.62*q), ZS=[]; { let z=-4.3-BR[0]; for(let j=0;j<6;j++){ if(j) z-=BR[j-1]+BR[j]+0.35; ZS.push(z); } } const ZH=j=>ZS[j], ZE=ZS[5]-BR[5]-0.5, ZM=(-3.7+ZE)/2, ZL=-3.7-ZE;
  const PX=1.4, PY=YC-3.2, LT=2.7, LH=8, HIT=0.13, PSI0=-1.05, WIN=0.62, PMAX=0.36;
  const LF=LB('打ち子の枠','Lagerbock');
  for(const z of [-3.7,ZE]) box(R,5.4,12,0.6,MAT.wood,3.6,YC-6.6,z,LF);
  box(R,0.8,0.8,ZL,MAT.woodDark,PX,PY,ZM,LB('打ち子の軸受けの桟','Achse'));
  const ax=mk(G_ROD,MAT.iron,R,LB('打ち子の軸','Achse')); ax.rotation.x=Math.PI/2; ax.scale.set(0.12,ZL+0.2,0.12); ax.position.set(PX,PY,ZM);
  const BXj=j=>PX+LH*Math.sin(HIT)+0.4+BR[j], BX=BXj(0), BYm=PY-LH-0.5;
  box(R,3.2,0.9,ZL,MAT.woodDark,BX-0.4,BYm+4.4,ZM,LB('鈴を吊る桟','Glockenleiste'));
  const cams=new T.Group(); cams.position.set(0,YC,0); R.add(cams);
  const ham=[], bells=[];
  for(let j=0;j<NB;j++){
    const z=ZH(j), a=-j*2*Math.PI/NB;
    const cg=new T.Group(); cg.position.z=z; cg.rotation.z=a; cams.add(cg);
    cyl(cg,0.75,0.6,MAT.woodPale,0,0,0,LB('カムの台（軸に固定）','Daumen')).rotation.x=Math.PI/2;
    const peg=rod(cg,0.2,MAT.ivory,LB('カム（軸の突起。回りながら打ち子の上端をはじく）','Daumen')); peg.set(V3(0,0,0),V3(2.1,0,0));
    const pv=new T.Group(); pv.position.set(PX,PY,z); R.add(pv);
    box(pv,0.35,LT+LH,0.5,MAT.woodPale,0,(LT-LH)/2,0,LB('打ち子（軸で支えたてこ。上端をカムにはじかれ、戻るときに下端の頭で鈴を打つ）','Hammer'));
    const hd=mk(G_SPH,MAT.woodDark,pv,LB('打ち子の頭','Hammer')); hd.scale.set(0.45,0.45,0.45); hd.position.set(0,-LH,0);
    ham.push({pv,a,phi:0,vel:0,held:false});
    const g=new T.Group(); g.position.set(BXj(j),BYm+0.15*(1-BS[j]/BS[0]),z); g.scale.setScalar(BS[j]); R.add(g);
    const bm=mclone(MAT.brass); bm.side=T.DoubleSide;
    mk(BG,bm,g,LB('鈴（'+['g″','h″','d‴','g‴','h‴','d⁗'][j]+'に調律。打ち子に打たれて鳴る）','Glocke'));
    rod(R,0.08,MAT.iron,LB('鈴の吊り金具','Glockenleiste')).set(V3(BXj(j),BYm+2.6*BS[j],z),V3(BXj(j),BYm+4,z));
    bells.push({g,bm,amp:0});
  }
  // wind wheel
  const wheel=new T.Group(); wheel.position.set(0,YC,-20); R.add(wheel);
  cyl(wheel,1.6,2.4,MAT.wood,0,0,0,LB('風車の軸の胴','Windrad')).rotation.x=Math.PI/2;
  for(let b=0;b<10;b++){ const a=b/10*2*Math.PI, p=box(wheel,3.4,0.35,2.2,MAT.woodPale,0,0,0,LB('風車の羽根（ノズルの風に押されて回る）','Windrad')); p.position.set(5.5*Math.cos(a),5.5*Math.sin(a),0); p.rotation.z=a; }
  // wind supply: valve box with the stop, duct to the nozzle
  const VX=20, VY=8, VZ=-20;
  box(R,8,6,8,hollow(MAT.wood),VX,VY,VZ,LB('ツィンベルシュテルンの弁箱（中は風で満ちている）','Ventilkasten'));
  const flap=new T.Group(); flap.position.set(VX-2,VY+2.6,VZ); R.add(flap);
  box(flap,4,0.4,4,MAT.leather,2,-0.2,0,LB('弁（ストップを引くと開いて風車へ風を送る）','Spielventil'));
  const DPT=[V3(VX,VY+3,VZ),V3(VX,30,VZ),V3(6,30,VZ),V3(6,36.2,VZ)];
  duct(DPT,2.2,MAT.wood,LB('風導管（弁箱から風車のノズルへ）','Windleitung'));
  const noz=mk(G_CONE,MAT.metalDark,R,LB('ノズル（風を細く絞って羽根に吹き付ける）','Düse')); noz.scale.set(1.1,2.2,1.1); noz.rotation.x=Math.PI; noz.position.set(6,37.3,VZ);
  duct([V3(-52,VY,VZ),V3(VX-4,VY,VZ)],4,MAT.wood,LB('風導管（ふいごから）','Windkanal'));
  const knob=mk(G_CYL,MAT.ebony,R,LB('ストップノブ：Zimbelstern（引くと星が回る）','Registerzug')); knob.rotation.x=Math.PI/2; knob.scale.set(1.3,2.2,1.3);
  const face=mk(G_CYL,MAT.ivory,R,LB('ストップ名の札：Zimbelstern','Registerschild')); face.rotation.x=Math.PI/2; face.scale.set(0.95,0.25,0.95);
  const drod=rod(R,0.3,MAT.woodPale,LB('ノブの軸（弁を引き開ける）','Registerzugstange'));
  box(R,8,6,1.6,MAT.wood,VX,VY,12.4,LB('ストップノブの板','Registerbank'));
  let vo=0;
  new Tube([V3(-52,VY,VZ),V3(VX-3,VY,VZ)],{r:1.5,density:0.5,front:200,state:()=>({open:true,speed:2+16*vo*m.flow})});
  new Vol((a,b,c,out)=>out.set(VX-3.4+a*6.8,VY-2.4+b*4.8,VZ-3.4+c*6.8),70,{state:()=>1,rate:3});
  const jt=new Tube(DPT.map(v=>v.clone()).concat([V3(6,38.6,VZ),V3(5.6,42,VZ),V3(2,47,VZ-1),V3(-4,49,VZ-3)]),{r:0.7,density:0.8,front:120,state:()=>({open:vo>0.08,speed:8+26*vo*m.flow})});
  jt.exitU=jt.cum[4]/jt.L;
  return {
    controls:[{type:'toggle',id:'on',label:'Zimbelstern を入れる',get:()=>m.on,set:v=>m.on=v},
      {type:'range',id:'flow',label:'風の量',min:0.4,max:1.6,step:0.05,get:()=>m.flow,set:v=>m.flow=v,fmt:()=>TF('毎秒 約{0} 回転',(1.1*m.flow).toFixed(1))}],
    ctl:{on:v=>m.on=v,flow:v=>m.flow=v},
    pins:[{t:'星',p:V3(-14,YC+16,3)},{t:'鈴（6個）',p:V3(BX+3,BYm,ZM),max:140},{t:'打ち子',p:V3(PX-2.5,PY-4,-4.8),max:140},{t:'カム',p:V3(-2.5,YC+3,ZM),max:120},{t:'風車',p:V3(-9,YC-6,-21)},{t:'弁箱・ストップ',p:V3(VX+6,VY+5,VZ+4)}],
    update(dt){
      vo+=((m.on?1:0)-vo)*Math.min(1,dt*6);
      const wt=vo*m.flow*1.1*2*Math.PI; m.w+=(wt-m.w)*Math.min(1,dt*(wt>m.w?1.4:0.45));
      const th0=m.th; m.th+=m.w*dt;
      star.rotation.z=m.th; cams.rotation.z=m.th; wheel.rotation.z=m.th;
      for(let j=0;j<NB;j++){
        const h=ham[j], b=bells[j]; let ps=(m.th+h.a)%(2*Math.PI); if(ps>Math.PI) ps-=2*Math.PI;
        const inC=ps>=PSI0&&ps<=PSI0+WIN&&m.w>0.05;
        if(inC){ h.phi=Math.min(h.phi,-PMAX*(ps-PSI0)/WIN); h.vel=0; h.held=true; }
        else {
          const sub=4, d=dt/sub;
          for(let q=0;q<sub;q++){ h.vel+=(-1600*h.phi-14*h.vel)*d; h.phi+=h.vel*d;
            if(h.phi>=HIT&&h.vel>0){ if(h.vel>1.2){ bellStrike(F[j],clamp(h.vel/22,0.2,1)); b.amp=1; } h.phi=HIT; h.vel=-0.35*h.vel; } }
          h.held=false;
        }
        h.pv.rotation.z=h.phi;
        b.amp=Math.max(0,b.amp-dt*2.2); b.g.rotation.set(0.1*b.amp*Math.sin(S.time*40),0,0.1*b.amp*Math.cos(S.time*37));
        b.bm.emissive.copy(COL.sound).multiplyScalar(0.8*b.amp);
      }
      const dz=3.6*vo; knob.position.set(VX,VY,13.2+1.1+dz); face.position.set(VX,VY,13.2+2.3+dz); drod.set(V3(VX,VY,VZ+4),V3(VX,VY,13.2+dz));
      flap.rotation.z=-0.7*vo;
    }};
}

