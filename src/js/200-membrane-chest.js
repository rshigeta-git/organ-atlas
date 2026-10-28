/* ---------- C-04: membrane chest (exhaust), after the classic diagram ----------
   per key: a control channel runs under all stop channels; on its top board, under the open lower end of each pipe bore,
   lies a leather membrane. Control wind from valve chamber D at the front fills the channel and pushes the membranes up
   against the bores. Pressing the key lifts a double valve: it shuts D and opens the exhaust below, the channel empties
   downward, and the stop-channel wind pushes the membrane down and flows into the bore. */
let C04V={s2:[[0,0,0],[0,0,0]],s3:[[0,0,0],[0,0,0]]};   // C-04: views of the close-up steps, set when the model is built
function buildMembraneChest(){
  const R=CX.root, N=13, SI=STOPSET, P=pitchFor(SI), W=N*P, ROWC=rowsFor(SI).map(z=>z), oy=10, pos=k=>-W/2+P*(k+0.5), DZ=4.4;
  // depth of the chest from the stop rows (the pipes stand right over their membranes); valve chambers D in front of it
  const ZF=Math.max(...SI.map((si,i)=>ROWC[i]+Math.max(DZ/2,pipeFoot(si,0)[1]/2)))+1.5, ZB=Math.min(...SI.map((si,i)=>ROWC[i]-Math.max(DZ/2,pipeFoot(si,0)[1]/2)))-1.5, ZD=ZF-ZB, ZM=(ZF+ZB)/2;
  const yK0=oy, yK1=oy+2, yBd=oy+2.5, yIn1=oy+12, base=oy+14.5, yRim=oy+2.95, zD=ZF+0.5;
  const LT=LB('音のチャンネル（鍵ごとに5つのストップチャンネルの下を通る管路。ふだんは制御風で満ちている）','Tonkanzelle');
  // the control channel runs on under valve chamber D, so D's control wind can enter it and leave by the exhaust port
  for(let k=0;k<N;k++){ box(R,3,yK1-yK0,zD+1.8-ZB,MAT.woodDark,pos(k),(yK0+yK1)/2,(zD+1.8+ZB)/2,LT); box(R,3,0.6,3.6,MAT.woodDark,pos(k),yK0-0.3,zD,LT); }
  box(R,W+8,yBd-yK1,ZD,MAT.wood,0,(yK1+yBd)/2,ZM,LB('音のチャンネルの天板（膜が載る穴がある）','Fundamentbrett'));
  box(R,W+8,1,ZD,MAT.wood,0,yIn1+0.5,ZM,LB('ストップチャンネルの天板','Fundamentbrett'));
  box(R,W+8,1.5,ZD,MAT.wood,0,yIn1+1.75,ZM,LB('上板（パイプを立てる板）','Pfeifenstock'));
  const LK=LB('ストップチャンネル（ストップを入れると風が満ちる。パイプの穴の管がこの中を下へ通る）','Registerkanzelle');
  for(let i=0;i<5;i++){ const zc=ROWC[i]; for(const s of [-1,1]) box(R,W+8,yIn1-yBd,0.5,MAT.woodDark,0,(yBd+yIn1)/2,zc+s*(DZ/2+0.25),LK); box(R,0.6,yIn1-yBd,DZ,MAT.woodDark,W/2+3.7,(yBd+yIn1)/2,zc,LK); }
  // stop valves and main wind at the left end
  const xV=-W/2-4.2;
  box(R,3,yIn1-yBd+2,ZD+1,hollow(MAT.wood),xV-3.2,(yBd+yIn1)/2,ZM,LB('風箱への風の供給路','Windkanal'));
  const sv=[], chV=[];
  for(let i=0;i<5;i++){ const zc=ROWC[i];
    const g=new T.Group(); g.position.set(xV-1.3,yIn1-0.3,zc); R.add(g); box(g,0.35,yIn1-yBd-0.8,DZ-0.6,stopMat(i),0.18,-(yIn1-yBd-0.8)/2,0,LB('ストップ弁（'+STOPS[SI[i]].name+'）','Registerventil')); sv.push(g);
    chV.push(new Vol((a,b,c,out)=>{ const side=a<0.5?-1:1; out.set(-W/2-1+((a*2)%1)*(W+3),yBd+0.4+b*(yIn1-yBd-0.8),zc+side*(1.15+c*0.85)); },130,{state:()=>S.sp[i]>0.5?1:0,rate:1.6}));
    new Tube([V3(xV-3.2,oy+7,zc),V3(xV-0.5,oy+7,zc),V3(-W/2+4,oy+7,zc)],{r:0.6,density:0.6,front:200,state:()=>({open:S.sp[i]>0.5&&chV[i].fill<0.97,speed:16})}); }
  new Vol((a,b,c,out)=>out.set(xV-3.2+(c-0.5)*2,yBd+b*(yIn1-yBd),ZM+(a*2-1)*(ZD/2-0.5)),160,{state:()=>1,rate:3});
  // control-wind supply to all valve chambers D
  box(R,W+4,1.6,2.4,hollow(MAT.wood),0,oy+6.2,zD,LB('制御風の供給路（各鍵の弁室Dへ制御風を送る）','Speisekanal'));
  new Vol((a,b,c,out)=>out.set(-W/2-1+a*(W+2),oy+5.7+b*1,zD+(c-0.5)*1.6),120,{kind:'ctrl',state:()=>1,rate:3});
  const Kc=new Float32Array(N).fill(1), mem=[], vu=[], vd=[], stems=[], pipesT=[], MR=1.05;
  const LBM=LB('膜（革の膜。下の制御風に押し上げられてパイプの穴の下端をふさぐ）','Membrane'), LBP=LB('パイプの穴（ストップチャンネルの中を下へ通る管。下端は膜の真上で開いている）','Pfeifenbohrung');
  const LD=LB('弁室D（制御風が入っている。ここから音のチャンネルへ制御風が送られる）','Ventilkammer'), LV=LB('二重弁（鍵を押すと下がり、上の弁がDの出口をふさぎ、下の弁が排気口から離れて口を開ける）','Doppelventil');
  for(let k=0;k<N;k++){
    const x=pos(k);
    // valve chamber D and the vestibule under it, at the front end of the control channel
    box(R,3.4,0.4,3.6,MAT.woodDark,x,yK1+0.2,zD,LD); box(R,3.4,3,0.4,MAT.woodDark,x,yK1+1.9,zD+1.8,LD); box(R,3.4,3,0.4,MAT.woodDark,x,yK1+1.9,zD-1.8,LD);
    box(R,3.4,0.4,3.6,MAT.woodDark,x,yK0-0.8,zD,LB('排気口のある底板（二重弁の下の弁が外側から口をふさぐ）','Abstromöffnung'));
    bore(R,MAT.dark,x,yK1,yK1+0.4,zD,0.7,LB('弁室Dの出口（音のチャンネルへ制御風が入る穴）','Ventilkammer'));
    bore(R,MAT.dark,x,yK0-1,yK0-0.6,zD,0.7,LB('排気口','Abstromöffnung'));
    new Vol((a,b,c,out)=>out.set(x+(a-0.5)*2.6,yK1+0.6+b*2.2,zD+(c-0.5)*2.8),18,{kind:'ctrl',state:()=>1,rate:6});
    new Vol((a,b,c,out)=>{ const z=ZB+1.5+c*(zD-3.5-ZB); out.set(x+(a-0.5)*2.2,yK0+0.3+b*1.4,z); },60,{kind:'ctrl',state:()=>Kc[k],rate:10});
    new Tube([V3(x,yK1+1.6,zD),V3(x,yK1+0.1,zD-0.6),V3(x,yK0+1,zD-2),V3(x,yK0+1,zD-11)],{kind:'ctrl',r:0.45,density:1.2,front:300,state:()=>({open:S.kd[k]<0.3&&Kc[k]<0.98,speed:16})});
    new Tube([V3(x,yK0+1,zD-9),V3(x,yK0+1,zD-0.4),V3(x,yK0-0.7,zD),V3(x,yK0-1.35,zD+1.3),V3(x,yK0-3.5,zD+2.4)],{kind:'ctrl',r:0.45,density:1.2,front:300,state:()=>({open:S.kd[k]>0.3&&Kc[k]>0.03,speed:16})});
    stems.push(rod(R,0.13,MAT.iron,LV));
    vu.push(cyl(R,0.95,0.25,keyMat(k),x,yK1+0.6,zD,LV)); vd.push(cyl(R,0.95,0.25,keyMat(k),x,yK0-0.4,zD,LV));
    const mg=new T.RingGeometry(0.001,MR,40,7); mg.rotateX(-Math.PI/2); CX.own.push(mg);
    const mm=mclone(MAT.leather); mm.side=T.DoubleSide; mm.color.multiplyScalar(0.92);
    mem.push({g:mg,m:mm});
    for(let i=0;i<5;i++){
      const zc=ROWC[i];
      bore(R,MAT.dark,x,yK1,yBd,zc,1,LB('膜の穴（天板を貫く。下の制御風が膜を押し上げる）','Membranbohrung'));
      const m=mk(mg,mm,R,LBM); m.position.set(x,yBd+0.03,zc); m.userData.key=k;
      cyl(R,0.75,base-0.3-yRim,MAT.woodPale,x,(yRim+base-0.3)/2,zc,LBP,G_CYL_OPEN);
      const si=SI[i], nr=nRanks(si), RZ=rankZ(si,0);
      for(let r=0;r<nr;r++){
        const zz=zc+(nr>1?RZ[r]:0), sp=buildPipe(x,zz,si,k,r,base);
        const tp=[V3(x,yBd+2.2,zc+1.6),V3(x,yBd+0.25,zc+1.25),V3(x,yRim-0.1,zc+0.2),V3(x,base,zz)].concat(sp.path.slice(1));
        const tb=new Tube(tp,{r:nr>1?0.22:0.3,density:0.3,front:900,state:()=>({open:chV[i].fill>0.5&&Kc[k]<0.5&&S.sp[i]>0.85,speed:20})});
        tb.exitU=tb.cum[3+sp.ei]/tb.L; tb.mouthAt(sp,3); pipesT.push({k,i:si,j:i,r});
      }
    }
  }
  { const x4=pos(4); C04V={s2:[[x4+40,40,ZF+45],[x4,14,ZM]],s3:[[x4+16,11,zD+22],[x4,9,zD-1]]}; }
  return {
    pins:[{t:'弁室D（制御風）',p:V3(W/2+3.5,oy+5,zD+1)},{t:'排気口',p:V3(W/2+3.5,yK0-1.6,zD)},{t:'音のチャンネル',p:V3(W/2+3.5,yK0+1,ZM+4)},{t:'膜',p:V3(W/2+3.5,yBd+1,ROWC[0])},{t:'パイプの穴',p:V3(W/2+3.5,oy+8,ROWC[1])},{t:'ストップチャンネル',p:V3(-W/2-1,yIn1+1.5,ROWC[2])}],
    speaking:()=>S.p<8?[]:pipesT.filter(t=>Kc[t.k]<0.5&&S.sp[t.j]>0.85&&chV[t.j].fill>0.5),
    update(dt){
      for(let k=0;k<N;k++){
        const pr=S.kd[k]>0.3; Kc[k]=clamp(Kc[k]+(pr?-10:6)*dt,0,1);
        // double valve: pressing the key pulls the stem down; the upper disc seats on D's outlet and
        // the lower disc drops by the same amount away from the exhaust port, so the control wind escapes
        const u=pr?1:0, yu=yK1+0.85-0.45*u, yd=yK0-1.15-0.45*u;
        vu[k].position.y=yu; vd[k].position.y=yd; stems[k].set(V3(pos(k),yd-1.6,zD),V3(pos(k),yu,zD));
        // membrane: domes up under control wind (touching the bore rim), sags slightly when the wind is let out
        const h=-0.12+0.56*Kc[k], a=mem[k].g.attributes.position;
        for(let v=0;v<a.count;v++){ const xx=a.getX(v), zz=a.getZ(v), r=Math.min(1,Math.sqrt(xx*xx+zz*zz)/MR); a.setY(v,h*(1-r*r)); }
        a.needsUpdate=true; mem[k].g.computeVertexNormals(); mem[k].m.emissive.copy(COL.key).multiplyScalar(0.3*S.kd[k]);
      }
      for(let i=0;i<5;i++) sv[i].rotation.z=-1.1*S.sp[i];
    }
  };
}

