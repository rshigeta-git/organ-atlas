/* ---------- C-03: cone-valve chest (Kegellade) with its mechanical action ----------
   Under each cone a small square: its forward arm lifts the cone's stem, its hanging arm is pinned to the pull rod of the note,
   which runs front to back under all the cones of that key. At the front the square E turns the downward pull of the key's
   tracker into a forward pull on the rod (rod and tracker are always in tension). Arms 23 mm; cone lift 9 mm. */
let C03V={s2:[[0,0,0],[0,0,0]],cut:0,s3:[[0,0,0],[0,0,0]],s4:[[0,0,0],[0,0,0]]};   // C-03: views of steps 2–4, set when the model is built
function buildConeChest(){
  const R=CX.root, N=13, SI=STOPSET, P=pitchFor(SI), W=N*P, ROWC=rowsFor(SI).map(z=>z-3.5), oy=10, pos=k=>-W/2+P*(k+0.5), DZ=4.4;
  // depth of the chest from the stop rows: the channels (ROWC) and the pipes standing 3.5 in front of them
  const ZF=Math.max(...SI.map((si,i)=>ROWC[i]+3.5+pipeFoot(si,0)[1]/2))+2, ZB=Math.min(...SI.map((si,i)=>Math.min(ROWC[i]-DZ/2,ROWC[i]+3.5-pipeFoot(si,0)[1]/2)))-2, ZD=ZF-ZB, ZM=(ZF+ZB)/2;
  const yFl=oy+8, yIn0=oy+8.5, yIn1=oy+15.5, yTop=oy+16, yToe=oy+17.5, base=oy+18;
  box(R,W+8,1,ZD,MAT.wood,0,yFl,ZM,LB('ストップチャンネルの底板（円錐弁の座がある）','Fundamentbrett'));
  box(R,W+8,1,ZD,MAT.wood,0,yTop,ZM,LB('ストップチャンネルの天板','Fundamentbrett'));
  box(R,W+8,1.5,ZD,MAT.wood,0,oy+16.75,ZM,LB('上板（パイプを立てる板）','Pfeifenstock'));
  const LK=LB('ストップチャンネル（ストップごとに風箱の長さいっぱいに通る部屋。ストップを入れると風が満ちる）','Registerkanzelle');
  for(let i=0;i<5;i++) box(R,0.6,7,DZ,MAT.woodDark,W/2+3.7,(yIn0+yIn1)/2,ROWC[i],LK);
  // the chest is solid wood between the stop channels and under the floor: the conduits to the pipes are bored in it
  const LBK=LB('チャンネルの間の木のブロック（パイプへの導管の穴があけてある）','Schied');
  { const zs=[ZB,...[...ROWC].sort((a,b)=>a-b).flatMap(z=>[z-DZ/2,z+DZ/2]),ZF];
    for(let j=0;j<zs.length;j+=2) box(R,W+8,7,zs[j+1]-zs[j],MAT.woodDark,0,(yIn0+yIn1)/2,(zs[j]+zs[j+1])/2,LBK); }
  box(R,W+8,1.5,ZD,MAT.wood,0,oy+6.75,ZM,LB('導管の板（底板の下。円錐弁の座からパイプへの導管の穴があけてある）','Kanalbrett'));
  // wind trunk and stop valves at the left end of each stop channel
  const xV=-W/2-4.2;
  box(R,3,9,ZD+1,hollow(MAT.wood),xV-3.2,oy+12,ZM,LB('風箱への風の供給路','Windkanal'));
  const sv=[];
  for(let i=0;i<5;i++){ const zc=ROWC[i]; box(R,0.5,7,DZ,MAT.woodDark,xV-1.6,(yIn0+yIn1)/2,zc,LB('ストップ弁の座','Registerventil'));
    const g=new T.Group(); g.position.set(xV-1.3,yIn1-0.3,zc); R.add(g); box(g,0.35,6.2,DZ-0.6,stopMat(i),0.18,-3.1,0,LB('ストップ弁（'+STOPS[SI[i]].name+'。ストップを入れると開いてチャンネルに風を入れる）','Registerventil')); sv.push(g); }
  const trunkV=new Vol((a,b,c,out)=>out.set(xV-3.2+(c-0.5)*2,oy+8+b*8,ZM+(a*2-1)*(ZD/2-1)),160,{state:()=>1,rate:3});
  const chV=[]; for(let i=0;i<5;i++){ const zc=ROWC[i]; chV.push(new Vol((a,b,c,out)=>out.set(-W/2-1+a*(W+3),yIn0+0.4+b*6.2,zc+(c-0.5)*3.4),120,{state:()=>S.sp[i]>0.5?1:0,rate:1.6})); new Tube([V3(xV-3.2,oy+12,zc),V3(xV-0.5,oy+12,zc),V3(-W/2+4,oy+12,zc)],{r:0.6,density:0.6,front:200,state:()=>({open:S.sp[i]>0.5&&chV[i].fill<0.97,speed:16})}); }
  const KSk=k=>2-0.5*k/12;   // cones, seats and conduits enlarged by key: 2× the first design in the bass (C), 1.5× at the top (c)
  const Pk=new Float32Array(N), tubes=[], bell=[], cones=[], rods=[], pipesT=[];
  const LB_B=LB('小ふいご（制御風でふくらみ、棒で円錐弁を押し上げる）','Bälgchen'), LB_C=LB('円錐弁（風に押されて座の穴をふさいでいる。持ち上がるとパイプへの道が開く）','Kegel'), LB_R=LB('押し棒','Stecher'), LB_D=LB('パイプへの導管','Kondukt');
  for(let k=0;k<N;k++){
    const x=pos(k);
    const bk=[], ck=[], rk=[], KS=KSk(k);
    for(let i=0;i<5;i++){
      const zc=ROWC[i];
      { const c=mk(G_KEGEL,keyMat(k),R,LB_C); c.scale.setScalar(KS); ck.push(c); }
      // seat bore through the floor, then the conduit bored in its block: along under the floor and up to the pipe toe
      bore(R,MAT.dark,x,oy+7,yIn0,zc,0.5*KS,LB('円錐弁の座（底板を貫く穴。下で導管につながる）','Kegelsitz'));
      boreAB(R,MAT.dark,V3(x,oy+7,zc),V3(x,oy+7,zc+3.5),0.3*KS,LB_D,false);
      const si=SI[i], nr=nRanks(si), RZ=rankZ(si,0), yH=oy+16.9, ZZ=[...Array(nr).keys()].map(r=>zc+3.5+(nr>1?RZ[r]:0));
      // a multi-rank stop: the conduit ends in a short bore across the upper board, from which each pipe has its own bore
      if(nr<2) bore(R,MAT.dark,x,oy+7,base,zc+3.5,0.3*KS,LB_D);
      else { bore(R,MAT.dark,x,oy+7,yH,zc+3.5,0.3*KS,LB_D);
        boreAB(R,MAT.dark,V3(x,yH,Math.min(...ZZ)-0.3),V3(x,yH,Math.max(...ZZ)+0.3),0.3*KS,LB('上板の中の横穴（1つの導管の風を各列のパイプへ分ける）','Stockbohrung'),false);
        for(const z of ZZ) bore(R,MAT.dark,x,yH,base,z,0.25*KS,LB('上板の穴（各列のパイプの足へ）','Stockbohrung')); }
      for(let r=0;r<nr;r++){
        const zz=ZZ[r], sp=buildPipe(x,zz,si,k,r,base);
        const pre=[V3(x,yIn0+2,zc),V3(x,yIn0+0.2,zc),V3(x,oy+7,zc),V3(x,oy+7,zc+3.5)].concat(nr>1?[V3(x,yH,zc+3.5),V3(x,yH,zz)]:[]), nb=pre.length;
        const tp=pre.concat([V3(x,base,zz)],sp.path.slice(1));
        const tb=new Tube(tp,{r:(nr>1?0.22:0.3)*KS,density:0.3,front:900,state:()=>({open:chV[i].fill>0.5&&Pk[k]>0.6&&S.sp[i]>0.85,speed:20})});
        tb.exitU=tb.cum[nb+sp.ei]/tb.L; tb.mouthAt(sp,nb); pipesT.push({k,i:si,j:i,r});
      }
    }
    bell.push(bk); cones.push(ck); rods.push(rk);
  }
  // the action under the chest
  const yB=oy+6, yP=yB-3.6, H=3, V=3, zE=ZF+2, yE=yP-V-4, HE=4, VE=4, zR=i=>ROWC[i]-H, zB=Math.min(...ROWC)-H-1;
  const LSQ=LB('スクエア（引き棒に引かれて回り、円錐弁の棒を押し上げる）','Winkel'), LSB=LB('スクエアの軸受けの桟','Winkelbalken');
  for(let i=0;i<5;i++) box(R,W+4,yB-yP-0.6,1.4,MAT.woodDark,0,(yB+yP+0.6)/2,zR(i),LSB);
  box(R,W+4,1.4,1.6,MAT.woodDark,0,yE-1.3,zE,LSB);
  for(const s of [-1,1]) box(R,1.2,yB-yE+2,1.2,MAT.woodDark,s*(W/2+1.4),(yB+yE-2)/2,zE,LB('スクエア E の桟の支柱','Balgstütze'));
  for(let k=0;k<N;k++) for(const s of [-1,1]) box(R,0.3,2,1.4,MAT.woodDark,pos(k)+s*0.6,yE-0.3,zE,LSB);
  const act=[];
  for(let k=0;k<N;k++){ const x=pos(k), m=keyMat(k), q={sq:[],stem:[]};
    for(let i=0;i<5;i++){
      for(const s of [-1,1]) box(R,0.3,1.6,1.4,MAT.woodDark,x+s*0.55,yP+0.5,zR(i),LSB);
      cyl(R,0.5,0.4,MAT.leather,x,yB-0.2,ROWC[i],LB('円錐弁の棒の革のブッシュ（風が漏れないよう棒を通す）','Ventilleder'));
      q.sq.push([rod(R,0.32,m,LSQ),rod(R,0.32,m,LSQ)]); q.stem.push(rod(R,0.13,MAT.iron,LB('円錐弁の棒（スクエアに押し上げられる）','Ventilstange')));
    }
    q.tr=rod(R,0.28,m,LB('引き棒（'+KEYNAMES[k]+'。同じ鍵の円錐弁のスクエアをすべてつなぐ）','Zugstange'));
    q.e=[rod(R,0.4,m,LB('スクエア E（鍵のトラッカーの引き下げを、引き棒を手前へ引く動きに変える）','Winkel')),rod(R,0.4,m,LB('スクエア E（鍵のトラッカーの引き下げを、引き棒を手前へ引く動きに変える）','Winkel'))];
    q.t=makeTracker(m,LB('トラッカー（'+KEYNAMES[k]+'。下の鍵盤の鍵へ）','Abstrakte'));
    act.push(q); }
  { const x4=pos(4); C03V={s2:[[xV-60,60,90],[xV+5,20,ZM]],cut:(130-(x4+2.5))/260,s3:[[x4+120,18,50],[x4,12,0]],s4:[[x4+50,40,70],[x4,20,0]]}; }
  return {
    pins:[{t:'スクエア E',p:V3(W/2+2,yE,zE+3)},{t:'引き棒',p:V3(-W/2-2,yP-V,0)},{t:'スクエア',p:V3(W/2+2,yP,zR(4))},{t:'円錐弁',p:V3(W/2+3.5,yIn0+1.5,Math.min(...ROWC))},{t:'パイプへの導管',p:V3(W/2+3.5,oy+12,Math.max(...ROWC)+3.5)},{t:'ストップチャンネル',p:V3(-W/2-1,yIn1+1.5,7)},{t:'ストップ弁',p:V3(xV-2,yIn1+2,-14)}],
    speaking:()=>S.p<8?[]:pipesT.filter(t=>Pk[t.k]>0.6&&S.sp[t.j]>0.85&&chV[t.j].fill>0.5),
    update(dt){
      for(let k=0;k<N;k++){
        Pk[k]=S.kd[k];
        const lift=1.2*clamp((Pk[k]-0.2)/0.6,0,1), x=pos(k), q=act[k], th=Math.asin(lift/H), c=Math.cos(th), sn=Math.sin(th);
        for(let i=0;i<5;i++){ cones[k][i].position.set(x,yIn0+0.75*KSk(k)+lift,ROWC[i]);
          const pv=V3(x,yP,zR(i)), tip=V3(x,yP+lift,zR(i)+H*c);
          q.sq[i][0].set(pv,tip); q.sq[i][1].set(pv,V3(x,yP-V*c,zR(i)+V*sn)); q.stem[i].set(tip,V3(x,yIn0+0.3+lift,ROWC[i])); }
        // E: the rod has moved forward by V·sin(th); E's upright arm follows it, its forward arm goes down and pulls the tracker
        const ph=Math.asin(clamp(V*sn/VE,0,1)), ce=Math.cos(ph), se=Math.sin(ph), eT=V3(x,yE+VE*ce,zE+VE*se), eF=V3(x,yE-HE*se,zE+HE*ce);
        q.tr.set(V3(x,yP-V*c,zB+V*sn),eT); q.e[0].set(V3(x,yE,zE),eT); q.e[1].set(V3(x,yE,zE),eF); q.t.set(eF,V3(x,oy-18,zE+HE),0.4);
      }
      for(let i=0;i<5;i++) sv[i].rotation.z=-1.1*S.sp[i];
    }
  };
}

