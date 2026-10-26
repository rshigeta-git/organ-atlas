/* ---------- D-03: one Barker machine (one key), after the classic section (fig. 843) ----------
   key → tracker h → lever g under the wind box a; a wire from g pulls down the front end of the pallet e, and a second wire
   from that end goes up into the chamber over the box and pulls down the arm of the exhaust valve o, which shuts the slot n′
   in the board m. Wind from a passes the pallet into the chamber and, through a passage in the thick board k, fills the wedge
   bellows l; the arm q on its top board lifts tracker r. Releasing the key closes e and opens o: the bellows empties through
   n′ and r returns. Proportions taken from the drawing (about 0.57 mm per pixel); z: toward the player (h side), y: up. */
const BKU={zG0:-1.65,zH:25.2,zR:-44.5,W:8.6};
// the streamlines are drawn as smooth curves through the path points: extra points just before and after each corner keep a
// sharp turn inside its duct
function sharpPath(pts,d=0.8){ const out=[pts[0]]; for(let i=1;i<pts.length-1;i++){ const a=pts[i-1],b=pts[i],c=pts[i+1];
    out.push(V3(0,0,0).subVectors(a,b).setLength(Math.min(d,a.distanceTo(b)/3)).add(b),b,V3(0,0,0).subVectors(c,b).setLength(Math.min(d,c.distanceTo(b)/3)).add(b)); }
  out.push(pts[pts.length-1]); return out; }   // pivot of g, its front end (h), the end of q (r), outer width
// o: x, y, z (the corner of wall b at the bottom c), k (key: its material marks the moving parts)
function makeBarkerUnit(o){
  const R=new T.Group(); R.position.set(o.x,o.y,o.z); CX.root.add(R); const W=7, xs=W/2, km=keyMat(o.k);
  const Wd=(x,y,z)=>V3(o.x+x,o.y+y,o.z+z);
  const zB1=3.3, zD0=22.4, zD1=23.5, yC1=2.2, yT0=9, yT1=10, yM0=13.5, yM1=15, zK0=-42, yCh=(yT1+yM0)/2;
  const LA=LB('風箱 a（送風機からの風で常に満ちている）','Barkerkasten');
  box(R,W+1.6,yC1,zD1,MAT.wood,0,yC1/2,zD1/2,LB('風箱の底板 c','Barkerkasten'));
  box(R,W,yT0-yC1,zB1,MAT.wood,0,(yT0+yC1)/2,zB1/2,LB('風箱の壁 b（厚い。パレットの蝶番がつく）','Barkerkasten'));
  box(R,W,yM0-yC1,zD1-zD0,MAT.wood,0,(yM0+yC1)/2,(zD0+zD1)/2,LB('風箱の壁 d','Barkerkasten'));
  for(const s of [-1,1]) box(R,0.8,yM0,zD1,hollow(MAT.wood),s*(xs+0.4),yM0/2,zD1/2,LA);
  box(R,W,yT1-yT0,zD0,MAT.wood,0,(yT0+yT1)/2,zD0/2,LB('風箱の天板（パレットの口がある。上は小部屋）','Barkerkasten'));
  box(R,3,yT1-yT0+0.04,11,MAT.dark,0,(yT0+yT1)/2,12,LB('パレットの口（パレット e が開くと、ここから風が上の小部屋へ入る）','Ventilöffnung'));
  // board m over the chamber, with the exhaust slot n′; the thick board k that carries the bellows
  box(R,W+1.6,yM1-yM0,zD1,MAT.wood,0,(yM0+yM1)/2,zD1/2,LB('板 m（小部屋のふた。排気口 n′ がある）','Kanalbrett'));
  box(R,1.6,yM1-yM0+0.04,3.7,MAT.dark,0,(yM0+yM1)/2,9.45,LB('排気口 n′（弁 o が開いていると、小ふいごの風がここから外へ逃げる）','Auslassöffnung'));
  box(R,W+1.6,yM1-yT0,-zK0,MAT.wood,0,(yT0+yM1)/2,zK0/2,LB('厚い板 k（小ふいごを載せる。中に小部屋から小ふいごへの風の通り道がある）','Kanalbrett'));
  boreAB(R,MAT.dark,V3(0,yCh,0.2),V3(0,yCh,-7),1.1,LB('風の通り道（小部屋 → 小ふいご）','Kanal'));
  bore(R,MAT.dark,0,yCh,yM1+0.6,-7,1.1,LB('小ふいごの入口','Luftbohrung'));
  // post under k at the wall b, carrying the pivot of the lever g
  for(const s of [-1,1]) box(R,2.3,yT0+2.6,2.5,MAT.wood,s*2.35,(yT0-2.6)/2,-1.65,LB('支柱（2枚。間にレバー g の奥の端が入り、軸で支える）','Lager'));
  // wind comes up from the trunk under the row through a short riser beside the lever g
  bore(R,MAT.dark,2.6,0,yC1,12,0.8,LB('風の入口（下の風導管から）','Luftbohrung'));
  new Vol((a,b,c,out)=>out.set(o.x-xs+0.5+a*(W-1),o.y+yC1+0.4+b*(yT0-yC1-1),o.z+zB1+0.4+c*(zD0-zB1-0.8)),60,{state:()=>S.p>4?1:0,rate:3});
  // pallet e: hinged at the wall b, front end with the eye for the two wires; spring f with its coil at the hinge end
  const zE0=zB1+0.3, LE=17, zE1=zE0+LE, PE=new T.Group(); PE.position.set(0,yT0-0.05,zE0); R.add(PE);
  box(PE,3.8,1,LE,MAT.woodPale,0,-0.55-0.2,LE/2,LB('パレット e（鍵で引かれて下に開き、風箱の風を上の小部屋へ通す）','Spielventil'));
  box(PE,4,0.2,LE-0.6,MAT.palLeather,0,-0.1,LE/2+0.3,LB('パレットの革','Ventilleder'));
  box(R,W,1.2,1,MAT.leather,0,yT0-0.6,zE0,LB('パレットの蝶番（革）','Ventilleder'));
  const coil=mk(helixGeo(0.55,3,1.6,0.1),MAT.brass,R,LB('パレットばね f（巻きの部分）','Ventilfeder')); coil.rotation.z=Math.PI/2; coil.position.set(0.8,5.5,8.8);
  const fU=rod(R,0.1,MAT.brass,LB('パレットばね f（上の腕がパレットを押し上げる）','Ventilfeder')), fL=rod(R,0.1,MAT.brass,LB('パレットばね f（下の腕）','Ventilfeder'));
  box(R,3,0.8,4,MAT.woodDark,0,yC1+0.4,16,LB('ばねの受け木','Federleiste'));
  const wE=rod(R,0.07,MAT.metalDark,LB('引き下げ線（レバー g → パレット e の前の端）','Abzugsdraht'));
  const wS=rod(R,0.07,MAT.metalDark,LB('引き線 s（パレット e の前の端 → 排気弁 o の腕。パレットといっしょに排気弁を動かす）','Zugdraht'));
  const eyeI=cyl(R,0.35,0.5,MAT.brass,0,0,0,LB('目金 i（パレットの前の端。引き下げ線と引き線を掛ける）','Ventilöse'));
  bore(R,MAT.dark,0,0,yC1,zE1,0.35,LB('引き下げ線を通す穴','Bohrung')); bore(R,MAT.dark,0,yT0,yT1,zE1,0.35,LB('引き線を通す穴','Bohrung'));
  // exhaust valve o under the slot n′, hinged at p (a bracket under m); its arm reaches over the front end of the pallet
  const zP=13.9, yP=yM0-0.8, LO=zP-4.7, LA2=zE1-zP, P=new T.Group(); P.position.set(0,yP,zP); R.add(P);
  box(P,2.8,0.5,LO,MAT.woodPale,0,0.35,-LO/2,LB('排気弁 o（鍵を押すと排気口 n′ をふさぐ）','Auslassventil'));
  box(P,2.9,0.18,LO-0.4,MAT.palLeather,0,0.69,-LO/2,LB('排気弁の革','Ventilleder'));
  // the arm is cranked down below the plate (as p in the drawing), so that it stays clear of m when the valve is open
  box(P,0.7,1.3,0.6,MAT.brass,0,-0.35,0.3,LB('排気弁の腕','Ventilarm')); box(P,0.7,0.5,LA2,MAT.brass,0,-1,LA2/2,LB('排気弁の腕（パレットの引き線に引き下げられる）','Ventilarm'));
  box(R,2.2,yM0-yP+0.3,1.2,MAT.woodDark,0,(yM0+yP)/2,zP,LB('排気弁の軸受け p','Lager'));
  // lever g under the bottom c, pivoted at the foot of the post; the key tracker h at its front end
  const zG0=-1.65, yG=-0.9, zH=zD1+1.7, GL=zH-zG0+1.2;
  const G=new T.Group(); G.position.set(0,yG,zG0); R.add(G);
  box(G,2.4,1.8,GL,km,0,0,GL/2-0.6,LB('レバー g（奥の端の軸を支点に、鍵のトラッカー h に引き下げられる）','Hebel'));
  rod(R,0.25,MAT.brass,LB('レバーの軸','Drehstift')).set(V3(-xs,yG,zG0),V3(xs,yG,zG0));
  // wedge bellows l on the board k: hinged at the end toward the box, opening at the far end; arm q on the top board
  const zL1=-4, LL=38, yL=yM1+0.6, BL=new T.Group(); BL.position.set(0,yL,zL1); R.add(BL);
  box(BL,W-0.6,0.8,LL,MAT.wood,0,0.4,-LL/2,LB('小ふいご l の上板（ふくらむと奥の端が上がる）','Barkerbalg'));
  box(BL,1,0.8,LL+4,km,0,1.2,-(LL+4)/2+1,LB('腕 q（小ふいごの上板に付き、トラッカー r を引き上げる）','Hebelarm'));
  box(R,W-0.6,0.6,LL,MAT.wood,0,yM1+0.3,zL1-LL/2,LB('小ふいごの底板','Barkerbalg'));
  const side=[-1,1].map(s=>{ const m=mk(G_TRI,MAT.leather,R,LB('小ふいごのひだ（革）','Falten')); m.rotation.y=Math.PI/2; m.position.set(s*(xs-0.35),yL,zL1); return m; });
  const back=box(R,W-0.6,1,0.3,MAT.leather,0,yL,zL1-LL,LB('小ふいごのひだ（革）','Falten'));
  new Vol((a,b,c,out)=>{ out.set(o.x-xs+1+a*(W-2),o.y+yL+0.1+b*(c*LL*Math.sin(st.th)),o.z+zL1-0.5-c*(LL-1)); },50,{state:()=>st.B,rate:6});
  // flows: pallet → chamber → passage in k → bellows; bellows → passage → chamber → n′
  new Tube(sharpPath([Wd(0,yT0-2,12),Wd(0,yCh,12),Wd(0,yCh,0),Wd(0,yCh,-7),Wd(0,yM1+1.2,-7),Wd(0,yM1+1.6,-17)],0.5),{r:0.7,density:0.8,front:160,state:()=>({open:st.e>0.3&&S.p>4&&st.B<0.98,speed:12})});
  new Tube(sharpPath([Wd(0,yM1+1.4,-15),Wd(0,yM1+1.2,-7),Wd(0,yCh,-7),Wd(0,yCh,0),Wd(0,yCh,9.45),Wd(0,yM1+2,9.45),Wd(0,yM1+7,10.5)],0.5),{kind:'air',r:0.7,density:0.8,front:160,state:()=>({open:st.o>0.3&&st.B>0.03,speed:10})});
  const st={B:0,th:0,e:0,o:1}, THM=0.09;
  // full key: drop of the pallet's front end; the valve o is set so that it shuts n′ just at that drop
  const dEmax=(zE1-zG0)*KPULL/(zH-zG0), PH0=Math.asin(dEmax/LA2);
  // drop: how far the tracker h pulls the front end of g down. Returns the lift of the end of q.
  const U={st,
    hook:()=>Wd(0,U.gy(zH),zH), qTip:()=>U.q, gy:z=>yG-0.9, q:Wd(0,yL+1.6,zL1-LL-2.5),
    update(dt,drop){
      const thG=Math.asin(clamp(drop/(zH-zG0),0,1)); G.rotation.x=thG;
      U.gy=z=>yG-(z-zG0)*Math.sin(thG)-0.9; const gy=U.gy;
      const dE=(zE1-zG0)*Math.sin(thG), thE=Math.asin(clamp(dE/LE,0,1)); PE.rotation.x=thE;
      const eye=V3(0,yT0-0.05-1.2*Math.cos(thE)-LE*Math.sin(thE),zE0+LE*Math.cos(thE)); eyeI.position.copy(eye);
      wE.set(eye,V3(0,gy(zE1),zE1)); st.e=clamp(dE/dEmax,0,1);
      const phi=PH0-Math.asin(clamp(dE/LA2,0,1)); P.rotation.x=-phi;   // plate side down by phi (open); at full key phi = 0 (shut)
      wS.set(eye,V3(0,yP-Math.cos(phi)+LA2*Math.sin(phi),zP+Math.sin(phi)+LA2*Math.cos(phi))); st.o=clamp(phi/PH0,0,1);
      fU.set(V3(0.8,5.5,8.8),V3(0.8,eye.y+1.2-0.1,zE0+(LE-1.5)*Math.cos(thE))); fL.set(V3(0.8,5.5,8.8),V3(0.8,yC1+0.85,16.5));
      // bellows: fills while the pallet is open and the exhaust shut, empties while the exhaust is open
      const fill=st.e*(1-st.o)*(S.p>4?1:0), empty=st.o*(1-st.e);
      st.B=clamp(st.B+(fill*8-empty*6)*dt,0,1); st.th=THM*st.B; BL.rotation.x=st.th;
      const h=LL*Math.sin(st.th); side.forEach((m,i)=>m.scale.set(LL*Math.cos(st.th),Math.max(0.01,h),i?-1:1)); back.scale.y=Math.max(0.05,h); back.position.set(0,yL+h/2,zL1-LL*Math.cos(st.th));
      U.q=Wd(0,yL+1.6*Math.cos(st.th)+(LL+2.5)*Math.sin(st.th),zL1-(LL+2.5)*Math.cos(st.th)+1.6*Math.sin(st.th));
      return U.q.y-(o.y+yL+1.6);
    }};
  return U;
}

/* ---------- D-03 whole: balanced keys (as D-02) → 13 Barker machines on a two-tier frame → slider chest ----------
   The machines stand in key order 5.05 apart, alternately on the upper tier (C, D, E, F♯, G♯, A♯, c: 7) and the lower tier
   (the C♯ side: 6), so that the trackers of an upper machine pass between two lower machines.
   key → sticker → backfall → roller board 1 (to the machine's x) → tracker h up to the lever g of the machine;
   the machine lifts tracker r → backfall under the frame → roller board 2 (to the pallet's x) → tracker up to the chest. */
function buildBarkerOrgan(){
  const R=CX.root, N=13, PM=5.05, xm=k=>(k-6)*PM, up=k=>k%2===0;
  const kb=buildBalanceKeyboard({x:0,y:0,z:34}); box(R,30,8.5,61,MAT.woodDark,0,-7.75,5.5,LB('演奏台（コンソール）の台','Spieltisch'));
  // the key's backfalls (as D-02)
  const YW=11, ZW=kb.zt-4, BF=6, BR=8, AI=6, AO=3.33, zr=ZW-BR-AI, y0r=14.5, SP1=1.3;
  box(R,13*TAILP+6,1,1,MAT.woodDark,0,YW,ZW,LB('バックフォールの支点の桟（ウィッペンバルケン）','Wippenbalken'));
  for(const s of [-1,1]) box(R,1.2,YW+0.5,1.6,MAT.woodDark,s*(13*TAILP/2+3),(YW+0.5)/2,ZW,LB('バックフォールの桟の支柱','Balgstütze'));
  // roller order: a tracker rising from a roller's output arm must not pass the (longer) input arm of a roller above it
  const topo=(ks,below)=>{ const ind=new Map(ks.map(k=>[k,0])), out=new Map(ks.map(k=>[k,[]])); for(const k of ks) for(const j of ks) if(k!==j&&below(k,j)){ out.get(k).push(j); ind.set(j,ind.get(j)+1); }
    const res=[], q=ks.filter(k=>!ind.get(k)); while(q.length){ q.sort((a,b)=>a-b); const k=q.shift(); res.push(k); for(const j of out.get(k)){ ind.set(j,ind.get(j)-1); if(!ind.get(j)) q.push(j); } } return res.length===ks.length?res:ks; };
  const K=[...Array(N).keys()];
  const roller=(o)=>{ // a roller board: o.zr, o.y0, o.sp, o.ai, o.ao, o.order, o.xi(k), o.xo(k), o.lab
    const Y={}; o.order.forEach((k,j)=>Y[k]=o.y0+j*o.sp); const xs=K.flatMap(k=>[o.xi(k),o.xo(k)]), x0=Math.min(...xs)-3, x1=Math.max(...xs)+3;
    box(R,x1-x0,N*o.sp+4,0.8,MAT.wood,(x0+x1)/2,o.y0+(N-1)*o.sp/2,o.zr-1.1,LB('ローラーボード（'+o.lab+'）','Wellenbrett'));
    const it=K.map(k=>{ const a=o.xi(k), b=o.xo(k), m=keyMat(k), y=Y[k];
      const roll=mk(G_CYL,m,R,LB('ローラー（'+o.lab+'・'+KEYNAMES[k]+'。回転して引く位置を左右に移す）','Welle')); roll.rotation.z=Math.PI/2; roll.scale.set(0.42,Math.abs(b-a)+1.4,0.42); roll.position.set((a+b)/2,y,o.zr);
      for(const xx of [Math.min(a,b)-0.9,Math.max(a,b)+0.9]) box(R,0.7,1.1,1.4,MAT.woodDark,xx,y,o.zr-0.4,LB('ローラーの軸受け','Wellenböckchen'));
      return {a,b,y,ai:rod(R,0.32,m,LB('ローラーの腕（入力側）','Wellenärmchen')),ao:rod(R,0.32,m,LB('ローラーの腕（出力側）','Wellenärmchen'))}; });
    return {set(k,drop){ const q=it[k], ps=Math.asin(clamp(drop/o.ai,0,1)), c=Math.cos(ps), s=Math.sin(ps);
      const ti=V3(q.a,q.y-o.ai*s,o.zr+o.ai*c), to=V3(q.b,q.y-o.ao*s,o.zr+o.ao*c); q.ai.set(V3(q.a,q.y,o.zr),ti); q.ao.set(V3(q.b,q.y,o.zr),to); return {ti,to,out:o.ao*s}; }}; };
  const R1=roller({lab:'鍵 → バーカーマシン',zr,y0:y0r,sp:SP1,ai:AI,ao:AO,xi:k=>kb.kx(k),xo:xm,order:topo(K,(j,k)=>Math.abs(xm(k)-kb.kx(j))<0.9)});
  // squares S1 (behind the roller board) and S2 (under the frame) with a horizontal tracker between them: the console stands
  // apart from the frame. A machine's lever g ends right over the forward arm of its S2.
  const SA=3, ys1=40, zs1=zr+AO-SA, zs2=zs1-40;
  const yL=52, yU=82, z0=zs2+SA-BKU.zH, XF=6.5*PM+BKU.W/2+2.5, LF=LB('バーカーマシンの櫓（2段の棚）','Gestell');
  for(const z of [z0-1.65,z0-30]) for(const s of [-1,1]) box(R,2.4,yU+24+12,2.4,MAT.wood,s*XF,(yU+24-12)/2,z,LF);
  for(const yT of [yL,yU]){ box(R,2*XF,1,2.4,MAT.wood,0,yT-2.8,z0-1.65,LB('棚の梁（バーカーマシンの支柱を受ける）','Gestell')); box(R,2*XF,1.2,2.4,MAT.wood,0,yT+8.4,z0-30,LB('棚の梁（厚い板 k を受ける）','Gestell')); }
  box(R,2*XF+2.4,1.2,31,MAT.wood,0,yU+24,z0-16,LB('櫓の天板','Gestell'));
  // wind: a trunk under each tier, fed by a riser at the side of the frame
  const LW=LB('風導管（送風機 → バーカーマシンの風箱）','Windkanal'), XW=XF+5;
  duct([V3(XW,-12,z0+12),V3(XW,yU-6,z0+12)],4,MAT.casing,LW);
  for(const yT of [yL,yU]){ duct([V3(XW,yT-6,z0+12),V3(-XF+3,yT-6,z0+12)],3,MAT.casing,LW);
    new Tube(sharpPath([V3(XW,-10,z0+12),V3(XW,yT-6,z0+12),V3(-XF+4,yT-6,z0+12)],1),{r:1,density:0.5,front:300,state:()=>({open:S.p>4,speed:6})}); }
  // the machines
  const U=K.map(k=>{ const x=xm(k), y=up(k)?yU:yL; duct([V3(x+2.6,y-4.5,z0+12),V3(x+2.6,y,z0+12)],1.4,MAT.casing,LW); return makeBarkerUnit({x,y,z:z0,k}); });
  // output: under the frame each tracker r lifts the front arm of a backfall, whose back arm pulls down the input of roller board 2
  const zRo=z0+BKU.zR, AB=4, YB=6, AI2=8, LMX=3.64, AO2=KPULL*AI2/LMX, zr2=zRo-2*AB-AI2;
  box(R,2*XF,1,1,MAT.woodDark,0,YB,zRo-AB,LB('バックフォールの支点の桟（バーカーマシンの出力）','Wippenbalken'));
  for(const s of [-1,1]) box(R,1.2,YB+12.5,1.6,MAT.woodDark,s*(XF-1),(YB-12)/2+0.25,zRo-AB,LB('バックフォールの桟の支柱','Balgstütze'));
  const seq=[0,2,4,6,8,10,12,11,9,7,5,3,1], order=[]; seq.forEach((k,j)=>order[k]=j);
  // squares S3 (behind roller board 2) and S4 (under the chest) with a horizontal tracker; the chest stands on legs above the frame
  const ys3=32, zs3=zr2+AO2-SA, zs4=zs3-40, KD2=new Float32Array(13), zC=zs4+SA-14, yC=yU+28;
  const chest=buildChest({y:yC,z:zC,order,kd:KD2,open:0.6,inlet:'R'});
  for(const z of [zC-5,zC+17]) for(const s of [-1,1]) box(R,2.4,yC+12,2.4,MAT.wood,s*(chest.W/2+2.2),(yC-12)/2,z,LB('風箱の脚','Ladengestell'));
  const LS=LB('スクエアの軸受け','Winkelbalken'), rail=(y,z,x0,x1)=>{ box(R,x1-x0,1.2,1.2,MAT.woodDark,(x0+x1)/2,y,z-0.9,LS); for(const x of [x0,x1]) box(R,1.2,y+12,1.2,MAT.woodDark,x,(y-12)/2,z-0.9,LB('スクエアの軸受けの支柱','Balgstütze')); };
  rail(ys1,zs1,-XF+2,XF-2); rail(ys1,zs2,-XF+2,XF-2); rail(ys3,zs3,-chest.W/2-3,chest.W/2+3); rail(ys3,zs4,-chest.W/2-3,chest.W/2+3);
  const R2=roller({lab:'バーカーマシン → 風箱',zr:zr2,y0:YB+4,sp:1.35,ai:AI2,ao:AO2,xi:xm,xo:k=>chest.pos(k),order:topo(K,(j,k)=>Math.abs(chest.pos(k)-xm(j))<0.9)});
  const T=K.map(k=>{ const m=keyMat(k);
    return {st:rod(R,0.35,m,LB('スティッカー（押し棒）','Stecher')),bf:rod(R,0.3,m,LB('バックフォール（鍵の側）','Wippe')),bb:rod(R,0.3,m,LB('バックフォール（鍵の側）','Wippe')),
      t1:makeTracker(m,LB('トラッカー（バックフォール → ローラーボード 1）','Abstrakte')),h:makeTracker(m,LB('トラッカー h（スクエア S2 → バーカーマシンのレバー g）','Abstrakte')),
      r:makeTracker(m,LB('トラッカー r（小ふいごの腕 q → 出力のバックフォール）','Abstrakte')),of:rod(R,0.3,m,LB('バックフォール（出力。トラッカー r に持ち上げられる）','Wippe')),ob:rod(R,0.3,m,LB('バックフォール（出力。下がってローラーを引く）','Wippe')),
      t2:makeTracker(m,LB('トラッカー（出力のバックフォール → ローラーボード 2）','Abstrakte')),t3:makeTracker(m,LB('トラッカー（スクエア S4 → 風箱のパレット）','Abstrakte')),
      u1:makeTracker(m,LB('トラッカー（ローラーボード 1 → スクエア S1）','Abstrakte')),h1:makeTracker(m,LB('水平のトラッカー（S1 → S2。演奏台から櫓へ）','Abstrakte')),
      u3:makeTracker(m,LB('トラッカー（ローラーボード 2 → スクエア S3）','Abstrakte')),h3:makeTracker(m,LB('水平のトラッカー（S3 → S4。櫓から風箱へ）','Abstrakte')),
      sq:[0,1,2,3].map(i=>[rod(R,0.32,m,LB('スクエア S'+(i+1)+'（L字の腕木。引く向きを90度変える）','Winkel')),rod(R,0.32,m,LB('スクエア S'+(i+1),'Winkel'))])}; });
  // a pair of squares: the first takes a downward pull on its forward arm and pulls the horizontal tracker forward with its
  // upright arm; the second's upright arm is pulled forward and its forward arm goes down
  const sqPair=(q,i,x,y,za,zb,d)=>{ const f=Math.asin(clamp(d/SA,0,1)), c=Math.cos(f), s=Math.sin(f);
    const aT=V3(x,y-SA*s,za+SA*c), bT=V3(x,y+SA*c,za+SA*s), cT=V3(x,y+SA*c,zb+SA*s), dT=V3(x,y-SA*s,zb+SA*c);
    q.sq[i][0].set(V3(x,y,za),aT); q.sq[i][1].set(V3(x,y,za),bT); q.sq[i+1][1].set(V3(x,y,zb),cT); q.sq[i+1][0].set(V3(x,y,zb),dT); return {aT,bT,cT,dT}; };
  return {chest,
    pins:[{t:'鍵盤',p:V3(-16,3,40)},{t:'ローラーボード 1',p:V3(-30,30,zr)},{t:'バーカーマシン（上の段）',p:V3(-XF,yU+18,z0-10)},{t:'バーカーマシン（下の段）',p:V3(-XF,yL+18,z0-10)},{t:'ローラーボード 2',p:V3(-34,20,zr2)},{t:'風箱',p:V3(36,54,zC)}],
    update(dt){
      kb.update();
      for(const k of K){ const q=T[k], x1=kb.kx(k), tp=kb.tail(k), rise=tp.y-(kb.y0+KH/2+0.3), ph=Math.asin(clamp(rise/BF,0,1)), c=Math.cos(ph), s=Math.sin(ph);
        const fT=V3(x1,YW+BF*s,ZW+BF*c), rT=V3(x1,YW-BR*s,ZW-BR*c); q.st.set(tp,fT); q.bf.set(V3(x1,YW,ZW),fT); q.bb.set(V3(x1,YW,ZW),rT);
        const r1=R1.set(k,BR*s); q.t1.set(r1.ti,rT,0.3);
        const p1=sqPair(q,0,xm(k),ys1,zs1,zs2,r1.out); q.u1.set(p1.aT,r1.to,0.6); q.h1.set(p1.bT,p1.cT,0.3);
        const lift=U[k].update(dt,SA*Math.sin(Math.asin(clamp(r1.out/SA,0,1)))); q.h.set(U[k].hook(),p1.dT,0.6);
        // output backfall: front arm lifted by r, back arm goes down by the same amount
        const pb=Math.asin(clamp(lift/AB,0,1)), cb=Math.cos(pb), sb=Math.sin(pb), x=xm(k), fO=V3(x,YB+AB*sb,zRo-AB+AB*cb), bO=V3(x,YB-AB*sb,zRo-AB-AB*cb);
        q.of.set(V3(x,YB,zRo-AB),fO); q.ob.set(V3(x,YB,zRo-AB),bO); q.r.set(U[k].qTip(),fO,0.3);
        const r2=R2.set(k,AB*sb); q.t2.set(r2.ti,bO,0.3); const p3=sqPair(q,2,chest.pos(k),ys3,zs3,zs4,r2.out); q.u3.set(p3.aT,r2.to,0.6); q.h3.set(p3.bT,p3.cT,0.3); q.t3.set(chest.pullDown(k),p3.dT,0.6); KD2[k]=r2.out/KPULL;
      }
      chest.update(dt);
    }};
}
