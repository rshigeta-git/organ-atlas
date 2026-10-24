/* ---------- C-05: pneumatic cone-valve chest (inflow) ---------- */
function buildConeChest(){
  const R=CX.root, N=13, P=5, W=N*P, oy=10, pos=k=>-W/2+P*(k+0.5), DZ=4.4;
  const yFl=oy+8, yIn0=oy+8.5, yIn1=oy+15.5, yTop=oy+16, yToe=oy+17.5, base=oy+18;
  box(R,W+8,1,41,MAT.wood,0,yFl,0,LB('ストップチャンネルの底板（円すい弁の座がある）','Fundamentbrett'));
  box(R,W+8,1,41,MAT.wood,0,yTop,0,LB('ストップチャンネルの天板','Fundamentbrett'));
  box(R,W+8,1.5,41,MAT.wood,0,oy+16.75+0.0,0,LB('上板（パイプを立てる板）','Pfeifenstock'));
  const LK=LB('ストップチャンネル（ストップごとに風箱の長さいっぱいに通る部屋。ストップを入れると風が満ちる）','Registerkanzelle');
  for(let i=0;i<5;i++){ const zc=ZROW[i]; for(const s of [-1,1]) box(R,W+8,7,0.5,MAT.woodDark,0,(yIn0+yIn1)/2,zc+s*(DZ/2+0.25),LK); box(R,0.6,7,DZ,MAT.woodDark,W/2+3.7,(yIn0+yIn1)/2,zc,LK); }
  // wind trunk and stop valves at the left end of each stop channel
  const xV=-W/2-4.2;
  box(R,3,9,42,MAT.wood,xV-3.2,oy+12,0,LB('風箱への風の供給路','Windkanal'));
  const sv=[];
  for(let i=0;i<5;i++){ const zc=ZROW[i]; box(R,0.5,7,DZ,MAT.woodDark,xV-1.6,(yIn0+yIn1)/2,zc,LB('ストップ弁の座','Registerventil'));
    const g=new T.Group(); g.position.set(xV-1.3,yIn1-0.3,zc); R.add(g); box(g,0.35,6.2,DZ-0.6,stopMat(i),0.18,-3.1,0,LB('ストップ弁（'+STOPS[i].name+'。ストップを入れると開いてチャンネルに風を入れる）','Registerventil')); sv.push(g); }
  const trunkV=new Vol((a,b,c,out)=>out.set(xV-3.2+(c-0.5)*2,oy+8+b*8,(a*2-1)*20),160,{state:()=>1,rate:3});
  const chV=[]; for(let i=0;i<5;i++){ const zc=ZROW[i]; chV.push(new Vol((a,b,c,out)=>out.set(-W/2-1+a*(W+3),yIn0+0.4+b*6.2,zc+(c-0.5)*3.4),120,{state:()=>S.sp[i]>0.5?1:0,rate:1.6})); new Tube([V3(xV-3.2,oy+12,zc),V3(xV-0.5,oy+12,zc),V3(-W/2+4,oy+12,zc)],{r:0.6,density:0.6,front:200,state:()=>({open:S.sp[i]>0.5&&chV[i].fill<0.97,speed:16})}); }
  const Pk=new Float32Array(N), tubes=[], bell=[], cones=[], rods=[], pipesT=[];
  const LB_B=LB('小ふいご（制御風でふくらみ、棒で円すい弁を押し上げる）','Bälgchen'), LB_C=LB('円すい弁（風に押されて座の穴をふさいでいる。持ち上がるとパイプへの道が開く）','Kegel'), LB_R=LB('押し棒','Stecher'), LB_D=LB('パイプへの導管','Kondukt');
  for(let k=0;k<N;k++){
    const x=pos(k);
    const bk=[], ck=[], rk=[];
    for(let i=0;i<5;i++){
      const zc=ZROW[i];
      ck.push(mk(G_KEGEL,keyMat(k),R,LB_C));
      const hole=mk(G_DISC,MAT.dark,R,LB('円すい弁の座','Kegelsitz')); hole.rotation.x=-Math.PI/2; hole.scale.set(0.5,0.5,1); hole.position.set(x,yIn0+0.01,zc);
      box(R,1.1,0.8,3.6,MAT.woodDark,x,oy+7.0,zc+1.8,LB_D);
      box(R,1.1,10.6,1.1,MAT.woodDark,x,oy+12.3,zc+3.5,LB_D);
      const nr=i===3?3:1;
      for(let r=0;r<nr;r++){
        const zz=zc+3.5+(i===3?MIXZ[r]*0.8:0), sp=buildPipe(x,zz,i,k,r,base);
        const tp=[V3(x,yIn0+2,zc),V3(x,yIn0+0.2,zc),V3(x,oy+7,zc),V3(x,oy+7,zc+3.5),V3(x,base,zz)].concat(sp.path.slice(1));
        const tb=new Tube(tp,{r:i===3?0.22:0.3,density:0.3,front:900,state:()=>({open:chV[i].fill>0.5&&Pk[k]>0.6&&S.sp[i]>0.85,speed:20})});
        tb.exitU=tb.cum[4+sp.ei]/tb.L; pipesT.push({k,i,r});
      }
    }
    bell.push(bk); cones.push(ck); rods.push(rk);
  }
  return {
    pins:[{t:'円すい弁',p:V3(36,yIn0+1.5,-14)},{t:'パイプへの導管',p:V3(36,oy+12,17.5)},{t:'ストップチャンネル',p:V3(-W/2-1,yIn1+1.5,7)},{t:'ストップ弁',p:V3(xV-2,yIn1+2,-14)}],
    speaking:()=>S.p<8?[]:pipesT.filter(t=>Pk[t.k]>0.6&&S.sp[t.i]>0.85&&chV[t.i].fill>0.5),
    update(dt){
      for(let k=0;k<N;k++){
        Pk[k]=S.kd[k];
        const lift=1.2*clamp((Pk[k]-0.2)/0.6,0,1);
        for(let i=0;i<5;i++) cones[k][i].position.set(pos(k),yIn0+0.75+lift,ZROW[i]);
      }
      for(let i=0;i<5;i++) sv[i].rotation.z=-1.1*S.sp[i];
    }
  };
}

