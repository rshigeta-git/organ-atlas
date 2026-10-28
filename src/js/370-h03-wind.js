/* ---------- H-03 wind: electric blower and reservoir, collecting trunk, manual riser with tremulant, pedal trunks ---------- */
function h3Wind(B){
  const ST=B.ST, R=CX.root, W={};
  W.mag=buildBlowerMagR(ST);
  const LK=LB('風導管（ふいごから風箱へ）','Windkanal');
  duct([V3(-470,15,-345),V3(470,15,-345)],26,MAT.wood,LB('ふいごの出口をまとめる管','Sammelkanal'));
  duct([V3(0,15,-345),V3(0,15,-150)],24,MAT.wood,LK);
  box(ST,30,B.hw.inlet.y+6.5-3,26,hollow(MAT.wood),0,(B.hw.inlet.y+6.5+3)/2,-150,LB('立ち上がりの風導管（手鍵盤の風箱へ）','Windkanal'));
  const yH=B.hw.inlet.y, hwP=[V3(0,yH,-150),V3(B.hw.cx,yH,-150),V3(B.hw.cx,yH,B.hw.inlet.z)],   // the Hauptwerk pallet box is at the back of its chest
        poP=[V3(0,214.5,-150),V3(-62,214.5,-150),V3(-62,214.5,B.pos.inlet.z)];   // beside the Hauptwerk trackers rising behind the swell box; into the back of the pallet box   // the Positiv pallet box is at the back of its chest
  duct(hwP,12,MAT.wood,LB('風導管（ハウプトヴェルクへ）','Windkanal')); duct(poP,12,MAT.wood,LB('風導管（ポジティフへ）','Windkanal'));
  const pdP=s=>[V3(s*470,15,-345),V3(s*470,15,-168),V3(s*470,70.5,-168),V3(s*470,70.5,(s<0?B.tc:B.td).inlet.z)];   // the tower chests have their pallet boxes at the back
  for(const s of [-1,1]) duct(pdP(s),12,MAT.wood,LB('風導管（ペダル塔へ）','Windkanal'));
  const cons=()=>W.n||0;
  W.trunks=[
    new Tube([V3(-420,15,-345),V3(0,15,-345)],{r:7,density:0.12,front:500,state:()=>({open:S.p>10,speed:2+0.8*cons()})}),
    new Tube([V3(420,15,-345),V3(0,15,-345)],{r:7,density:0.12,front:500,state:()=>({open:S.p>10,speed:2+0.8*cons()})}),
    new Tube([V3(0,15,-345),V3(0,15,-150),V3(0,30,-150),V3(0,yH-0.5,-150)],{r:7,density:0.1,front:500,state:()=>({open:S.p>10,speed:2+0.8*cons()})}),
    new Tube(hwP,{r:3.5,density:0.15,front:500,state:()=>({open:S.p>10,speed:2+1.2*B.hw.speaking().length})}),
    new Tube(poP,{r:3.5,density:0.15,front:500,state:()=>({open:S.p>10,speed:2+1.2*B.pos.speaking().length})}),
    new Tube(pdP(-1),{r:3.5,density:0.12,front:500,state:()=>({open:S.p>10,speed:2+2*B.tc.speaking().length})}),
    new Tube(pdP(1),{r:3.5,density:0.12,front:500,state:()=>({open:S.p>10,speed:2+2*B.td.speaking().length})})];
  /* Wippfeder tremulant on the +x face of the riser (as F-02): a small bellows hinged at its top, a valve with a weighted arm */
  const TG=new T.Group(); TG.position.set(15,126,-157); R.add(TG);
  box(ST,1.2,40,20,MAT.woodPale,15.6,126,-157,LB('トレムラントの台（風導管の側面の穴の上）','Balgbrett'));
  const plate=new T.Group(); plate.position.set(1.2,17,0); TG.add(plate); const LTH=mclone(MAT.leather);
  box(plate,1,34,18,MAT.woodPale,0.5,-17,0,LB('トレムラントの小ふいごの板（動く板）','Oberplatte'));
  const tsides=[-1,1].map(s=>{ const t=mk(G_TRI,LTH,TG,LB('小ふいごのひだ（革）','Falten')); t.rotation.set(0,0,-Math.PI/2); t.position.set(1.2,17,s*9); return t; });
  const vh=new T.Group(); vh.position.set(1,-29,0); plate.add(vh);
  box(vh,0.5,5,5,MAT.leather,0.25,2.5,0,LB('弁（小ふいごの板の穴をふさぐ。開くと風が外へ逃げる）','Tremulantventil'));
  rod(vh,0.3,MAT.iron,LB('弁の腕（下へ垂れ、先におもりがある）','Ventilarm')).set(V3(0,0,0),V3(8,-12,0));
  const twg=box(vh,3,3,3,MAT.weight,6,-9,0,LB('おもり（腕の上の位置で揺れの速さが変わる）','Gewicht'));
  box(ST,2,2,3,MAT.woodPale,27,111,-146.5,LB('ストッパー（小ふいごが開ききる位置）','Anschlag'));
  const slide=pbox(MAT.woodPale,LB('トレムラントの止め弁（ストップを入れると開き、小ふいごに風が入る）','Sperrventil'));
  W.trem={on:false,amt:0,ph:0,hz:5.6,dip:0};
  new Tube([V3(17,112,-157),V3(19,108,-157),V3(26,104,-157)],{kind:'wind',r:1.2,density:1.2,front:200,state:()=>({open:W.trem.amt>0.2&&W.trem.vo>0.25,speed:30})});
  W.tremUpd=(dt,v)=>{ const t=W.trem; t.amt+=((v>0.9?1:0)-t.amt)*Math.min(1,dt*3); if(t.amt>0.02) t.ph+=dt*2*Math.PI*t.hz;
    const s=Math.sin(t.ph), c=Math.cos(t.ph), th=t.amt*(0.16+0.1*s); plate.rotation.z=th;
    tsides.forEach(q=>q.scale.set(34,Math.max(0.01,34*Math.sin(th)),1));
    t.vo=t.amt>0.2?Math.max(0,-c):0; vh.rotation.z=-0.55*t.vo; t.dip=t.amt*(0.1*Math.max(0,-c)+0.03);
    slide.put(19+3*v,111,-157,4,1.5,8); };
  /* cymbelstern valve box on the riser, conduit up to the wind wheel behind the star */
  box(ST,12,16,12,hollow(MAT.wood),21,104,-140,LB('ツィンベルシュテルンの弁箱（中は風で満ちている）','Ventilkasten'));
  const zflap=new T.Group(); zflap.position.set(16,112,-144); R.add(zflap);
  box(zflap,8,0.6,8,MAT.leather,4,-0.3,4,LB('弁（ストップを引くと開いて風車へ風を送る）','Spielventil'));
  // the conduit rises behind the Hauptwerk straight to the height of the nozzle, then runs forward over the short treble pipes
  const ZO=V3(0,660,14), cd=[V3(22,112,-140),V3(22,ZO.y-10,-140),V3(22,ZO.y-10,ZO.z-18),V3(6,ZO.y-10,ZO.z-18)];
  duct(cd,3,MAT.woodDark,LB('風導管（弁箱から風車のノズルへ）','Windleitung'));
  W.zim={v:0};
  W.zJet=new Tube(cd.concat([V3(6,ZO.y-6.5,ZO.z-18),V3(5.6,ZO.y-2,ZO.z-18),V3(2,ZO.y+3,ZO.z-19)]),{r:0.7,density:0.12,front:400,state:()=>({open:W.zim.v>0.1&&S.p>10,speed:30+40*W.zim.v})});
  W.zJet.exitU=W.zJet.cum[cd.length]/W.zJet.L;
  W.zimUpd=v=>{ W.zim.v=v; zflap.rotation.z=-0.7*v; };
  W.ZO=ZO;
  return W;
}
/* cymbelstern core (as F-03) in the façade: star in front, shaft, tappets, hammers, six bells, wind wheel behind */
function h3Zimbel(ZO,ST){
  const G=new T.Group(); G.position.copy(ZO); CX.root.add(G); const SG=new T.Group(); SG.position.copy(ZO); ST.add(SG);
  const F=[783.99,987.77,1174.66,1567.98,1975.53,2349.32], m={w:0,th:0};
  const sh=new T.Shape(); for(let j=0;j<16;j++){ const r=j%2?6.5:16, a=j/16*2*Math.PI+Math.PI/2, x=r*Math.cos(a), y=r*Math.sin(a); if(j) sh.lineTo(x,y); else sh.moveTo(x,y); } sh.closePath();
  const sg=new T.ExtrudeGeometry(sh,{depth:0.6,bevelEnabled:true,bevelThickness:0.25,bevelSize:0.25,bevelSegments:1}); CX.own.push(sg);
  const star=new T.Group(); star.position.set(0,0,2.4); G.add(star);
  const GOLD=mclone(MAT.brass); GOLD.color.set(0xd9b25a); GOLD.metalness=0.25; GOLD.roughness=0.4; mk(sg,GOLD,star,LB('星（金色の木彫りの星。軸とともに回る）','Zimbelstern'));
  const boss=mk(G_CYL,GOLD,star,LB('星の中心','Zimbelstern')); boss.rotation.x=Math.PI/2; boss.scale.set(3,1.6,3); boss.position.z=0.8;
  const shaft=mk(G_ROD,MAT.iron,SG,LB('軸（星・カム・風車をつなぐ）','Welle')); shaft.rotation.x=Math.PI/2; shaft.scale.set(0.35,28,0.35); shaft.position.set(0,0,-11);
  const LBk=LB('軸受けの台（ケースの天井から吊る）','Lagerbock');
  for(const z of [-2.6,-23.5]){ box(SG,1.6,150,1.6,MAT.woodDark,0,76,z,LBk); box(SG,2.4,2.4,1.6,MAT.woodDark,0,0,z,LBk); }
  const BP=[[0,2.6],[0.55,2.56],[0.85,2.35],[0.95,1.7],[1.08,0.9],[1.4,0.25],[1.62,0]].map(p=>new T.Vector2(p[0],p[1]));
  const BG=new T.LatheGeometry(BP,24); CX.own.push(BG);
  const NB=6, BS=F.map(f=>0.82*Math.sqrt(F[0]/f)), BR=BS.map(q=>1.62*q), ZS=[]; { let z=-4.3-BR[0]; for(let j=0;j<6;j++){ if(j) z-=BR[j-1]+BR[j]+0.35; ZS.push(z); } } const ZE=ZS[5]-BR[5]-0.5, ZM=(-3.7+ZE)/2, ZL=-3.7-ZE;
  const PX=1.4, PY=-3.2, LT=2.7, LH=8, HIT=0.13, PSI0=-1.05, WIN=0.62, PMAX=0.36;
  for(const z of [-3.7,ZE]) box(SG,5.4,12,0.6,MAT.wood,3.6,-6.6,z,LB('打ち子の枠','Lagerbock'));
  box(SG,0.8,0.8,ZL,MAT.woodDark,PX,PY,ZM,LB('打ち子の軸受けの桟','Achse'));
  const BXj=j=>PX+LH*Math.sin(HIT)+0.4+BR[j], BYm=PY-LH-0.5;
  box(SG,3.2,0.9,ZL,MAT.woodDark,BXj(0)-0.4,BYm+4.4,ZM,LB('鈴を吊る桟','Glockenleiste'));
  const cams=new T.Group(); G.add(cams); const ham=[], bells=[];
  for(let j=0;j<NB;j++){
    const z=ZS[j], a=-j*2*Math.PI/NB, cg=new T.Group(); cg.position.z=z; cg.rotation.z=a; cams.add(cg);
    rod(cg,0.2,MAT.ivory,LB('カム（軸の突起。回りながら打ち子の上端をはじく）','Daumen')).set(V3(0,0,0),V3(2.1,0,0));
    const pv=new T.Group(); pv.position.set(PX,PY,z); G.add(pv);
    box(pv,0.35,LT+LH,0.5,MAT.woodPale,0,(LT-LH)/2,0,LB('打ち子（軸で支えたてこ。上端をカムにはじかれ、戻るときに下端の頭で鈴を打つ）','Hammer'));
    const hd=mk(G_SPH,MAT.woodDark,pv,LB('打ち子の頭','Hammer')); hd.scale.set(0.45,0.45,0.45); hd.position.set(0,-LH,0);
    ham.push({pv,a,phi:0,vel:0});
    const g=new T.Group(); g.position.set(BXj(j),BYm+0.15*(1-BS[j]/BS[0]),z); g.scale.setScalar(BS[j]); G.add(g);
    const bm=mclone(MAT.brass); bm.side=T.DoubleSide; mk(BG,bm,g,LB('鈴（'+['g″','h″','d‴','g‴','h‴','d⁗'][j]+'に調律。打ち子に打たれて鳴る）','Glocke'));
    rod(SG,0.08,MAT.iron,LB('鈴の吊り金具','Glockenleiste')).set(V3(BXj(j),BYm+2.6*BS[j],z),V3(BXj(j),BYm+4,z));
    bells.push({g,bm,amp:0});
  }
  const wheel=new T.Group(); wheel.position.set(0,0,-18); G.add(wheel);
  cyl(wheel,1.6,2.4,MAT.wood,0,0,0,LB('風車の軸の胴','Windrad')).rotation.x=Math.PI/2;
  for(let b=0;b<10;b++){ const a=b/10*2*Math.PI, p=box(wheel,3.4,0.35,2.2,MAT.woodPale,0,0,0,LB('風車の羽根（ノズルの風に押されて回る）','Windrad')); p.position.set(5.5*Math.cos(a),5.5*Math.sin(a),0); p.rotation.z=a; }
  const noz=mk(G_CONE,MAT.metalDark,SG,LB('ノズル（風を細く絞って羽根に吹き付ける）','Düse')); noz.scale.set(1.1,2.2,1.1); noz.rotation.x=Math.PI; noz.position.set(6,-7.7,-18);
  return {update(dt,vo){
    const wt=vo*1.1*2*Math.PI; m.w+=(wt-m.w)*Math.min(1,dt*(wt>m.w?1.4:0.45)); m.th+=m.w*dt;
    star.rotation.z=m.th; cams.rotation.z=m.th; wheel.rotation.z=m.th;
    for(let j=0;j<NB;j++){ const h=ham[j], b=bells[j]; let ps=(m.th+h.a)%(2*Math.PI); if(ps>Math.PI) ps-=2*Math.PI;
      if(ps>=PSI0&&ps<=PSI0+WIN&&m.w>0.05){ h.phi=Math.min(h.phi,-PMAX*(ps-PSI0)/WIN); h.vel=0; }
      else { const sub=4, d=dt/sub; for(let q=0;q<sub;q++){ h.vel+=(-1600*h.phi-14*h.vel)*d; h.phi+=h.vel*d; if(h.phi>=HIT&&h.vel>0){ if(h.vel>1.2){ bellStrike(F[j],clamp(h.vel/22,0.2,1)); b.amp=1; } h.phi=HIT; h.vel=-0.35*h.vel; } } }
      h.pv.rotation.z=h.phi; b.amp=Math.max(0,b.amp-dt*2.2); b.g.rotation.set(0.1*b.amp*Math.sin(S.time*40),0,0.1*b.amp*Math.cos(S.time*37)); b.bm.emissive.copy(COL.sound).multiplyScalar(0.8*b.amp); }
  }};
}
