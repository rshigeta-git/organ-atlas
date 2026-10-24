/* ---------------- pipes ---------------- */
function buildPipe(x,z,i,k,r,base,par){
  const R=par||CX.root, L=bodyLen(i,k,r), F=SC/0.45;   // F: fixed details (feet, boots, lips) scale with the drawing scale
  const lab=LB(STOPS[i].name+(i===3?' 第'+(r+1)+'列':'')+'（'+KEYNAMES[k]+'）のパイプ','Pfeife');
  if(i===4){
    const rad=0.75*F, bootH=12*F;
    const cone=mk(G_CONE,MAT.metal,R,LB('ブーツ（リードを囲む足部）','Stiefel')); cone.scale.set(1.15*F,bootH,1.15*F); cone.position.set(x,base+bootH/2,z);
    cyl(R,0.95*F,1.4*F,MAT.brass,x,base+bootH+0.2*F,z,LB('頭部（中でリードが振動して発音する）','Kopf / Zunge'));
    const b=mk(G_CYL_OPEN,MAT.metal,R,LB('共鳴管（約1/8の長さの短い管：Vox humana）','Becher')); b.scale.set(rad,L,rad); b.position.set(x,base+bootH+0.9*F+L/2,z);
    cyl(R,rad+0.12*F,0.5*F,MAT.metalDark,x,base+bootH+0.9*F+L,z,LB('半分ふさいだ共鳴管の上端','Deckel'));
    const top=base+bootH+0.9*F+L;
    return {reed:true,path:[V3(x,base+bootH+0.2*F,z),V3(x,top,z),V3(x,top+6*F,z)],ei:0,top};
  }
  if(i===9||i===12){
    const bs=(i===12&&F>1.5)?1.4:1, bootH=(i===12?16:12)*F, rb=(i===12?0.7:0.45)*F, rt=(i===12?5.77:3.17)*F*Math.pow(2,-k/24);
    const cone=mk(G_CONE,MAT.metal,R,LB('ブーツ（リードを囲む足部）','Stiefel')); cone.scale.set(1.15*F*bs,bootH,1.15*F*bs); cone.position.set(x,base+bootH/2,z);
    cyl(R,0.95*F*(bs>1?1.3:1),1.4*F,MAT.brass,x,base+bootH+0.2*F,z,LB('頭部（中でリードが振動して発音する）','Kopf / Zunge'));
    const g=new T.CylinderGeometry(rt,rb,L,F>1.5?14:20,1,true); CX.own.push(g);
    const b=mk(g,MAT.metal,R,LB('共鳴管（全長の円すい管：'+STOPS[i].name+'）','Becher')); b.position.set(x,base+bootH+0.9*F+L/2,z);
    const top=base+bootH+0.9*F+L;
    return {reed:true,path:[V3(x,base+bootH+0.2*F,z),V3(x,top,z),V3(x,top+6*F,z)],ei:0,top};
  }
  if(i===0||i===11){
    // wooden stopped pipe: square body, turned toe, front lip (Vorschlag), stopper with handle (Spund)
    // outside section about 110 × 135 mm at C (Gedackt), 190 × 235 mm (Subbass); at 45 % the widest bass pipes are capped to fit the 39 mm pitch
    const f=Math.pow(2,-k/16)*SC*MM, cap=F<1.5, w=i===11?190*f:(cap?Math.min(4.4,110*f):110*f), dz=i===11?235*f:(cap?Math.min(6.2,135*f):135*f), hz=dz/2, by=base+3*F, my=base+6.7*F;
    const lb=LB(STOPS[i].name.replace(/′.*/,'′')+'（'+KEYNAMES[k]+'）の木管','Holzgedackt');
    cyl(R,0.55*F,3*F,MAT.pipeWood,x,base+1.5*F,z,LB('木管の足（風の入口）','Fuß'));
    box(R,w,L+3.7*F,dz,MAT.pipeWood,x,by+(L+3.7*F)/2,z,lb);
    box(R,w*0.8,Math.min(1.6*F,0.6*F+w*0.25),0.3*F,MAT.dark,x,my,z+hz+0.02,LB('歌口（ここから風が吹き出して発音する）','Labium'));
    box(R,w*0.9,2.4*F,0.5*F,MAT.pipeWoodLight,x,base+5.1*F,z+hz+0.2*F,LB('前板（ヴォアシュラーク）','Vorschlag'));
    const top=by+L+3.7*F;
    box(R,w*0.86,1.4*F,dz*0.86,MAT.pipeWoodLight,x,top+0.5*F,z,LB('栓（上端をふさぐ。抜き差しで調律する）','Spund'));
    box(R,w*0.3,1.6*F,dz*0.5,MAT.pipeWoodLight,x,top+1.9*F,z,LB('栓の取っ手','Spundgriff'));
    return {reed:false,path:[V3(x,my-0.8*F,z),V3(x,my-0.3*F,z+hz-0.15),V3(x,my+0.9*F,z+hz+0.25*F),V3(x,my+3*F,z+hz+3*F),V3(x,my+5*F,z+hz+6*F)],ei:1,top:top+2.7*F};
  }
  const P=PIPE[i], Rb=pipeR(i,k,r), footH=(i===3?9:12)*F, my=base+footH;
  const G=flueGeos(Rb,footH,Math.min(0.45*F,Rb*0.35),L,P.mw,P.cut); CX.own.push(G.body,G.foot,G.lang);
  const LBu=LB('上唇（平たくつぶした歌口の上側。下の縁が風を切る）','Oberlabium'), LBl=LB('下唇（足の上部をつぶした歌口の下側）','Unterlabium');
  const body=mk(G.body,MAT.metal,R,lab); body.position.set(x,my,z);
  const foot=mk(G.foot,MAT.metal,R,LB('足（円すい形。下端の穴から風が入る）','Fuß')); foot.position.set(x,my,z);
  const lang=mk(G.lang,MAT.metalDark,R,LB('ラングイド（歌口の内側の仕切り板。前縁と下唇のすき間から風が吹き出す）','Kern')); lang.position.set(x,my,z);
  // hover labels for the lips: thin invisible pick plates over the flattened areas
  const pickM=CX.pickM||(CX.pickM=mclone(MAT.metal)); pickM.visible=false;
  box(R,G.w*0.9,G.HU*0.7,0.05,pickM,x,my+G.hc+G.HU*0.35,z+G.d+0.05,LBu);
  box(R,G.w*0.9,Math.min(G.w*0.95,footH*0.9)*0.6,0.05,pickM,x,my-Math.min(G.w*0.95,footH*0.9)*0.3,z+G.d+0.05,LBl);
  const sh=mk(G_DISC,MAT.dark,R,LB('歌口（ここで風が上唇に当たって発音する）','Aufschnitt')); sh.scale.set(Rb*0.9,Rb*0.9,1); sh.position.set(x,my+G.hc/2,z-Rb*0.35);
  if(P.ears) for(const s of [-1,1]) box(R,0.07*F,G.hc+0.5*F,Rb*0.55,MAT.metalDark,x+s*(G.w/2+0.05),my+G.hc/2,z+G.d+Rb*0.25,LB('耳（歌口の両脇の板。発音を安定させる）','Seitenbart'));
  let top=my+L;
  if(P.chim){ cyl(R,Rb+0.12*F,1.2*F,MAT.metalDark,x,top-0.3*F,z,LB('蓋（中央に煙突のある半閉管の蓋）','Hut')); const cl=L*P.chim, cr=Math.max(0.12*F,Rb*0.3); cyl(R,cr,cl,MAT.metal,x,top+0.3*F+cl/2,z,LB('煙突（Rohr。名前の由来）','Röhrchen')); top+=0.3*F+cl; }
  const fz=z+G.d;
  return {reed:false,path:[V3(x,my-0.8*F,z),V3(x,my-0.05,fz-0.1),V3(x,my+G.hc,fz+0.12),V3(x,my+G.hc+2*F,fz+2.5*F),V3(x,my+G.hc+5*F,fz+6*F)],ei:1,top};
}

