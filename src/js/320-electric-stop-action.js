/* ---------- E-03: electric stop action ----------
   Each slider is moved by a double-coil solenoid at the end of the chest: a short current pulse in the ON coil pulls the
   plunger and the slider in, a pulse in the OFF coil pushes it back. A limit switch in the unit cuts the current when the
   stroke is complete. At the console the stops are tilting tabs; a setter combination can store a registration and recall
   it with one piston, which sends pulses to every coil that has to change. Current is shown slowed down. */
const ELEC_LEG='<span><i style="background:var(--ctrl)"></i>電流（電気信号。表示のため遅くしています）</span>';
function polyAt(P,cum,s,out){ let i=1; while(i<cum.length-1&&cum[i]<s) i++; const seg=(cum[i]-cum[i-1])||1; return out.lerpVectors(P[i-1],P[i],clamp((s-cum[i-1])/seg,0,1)); }
function buildElectricStops(){
  const R=CX.root, SPm=new Float32Array(5), chest=buildChest({y:30,sp:SPm}), oy=chest.oy, oz=chest.oz;
  const m={st:[false,false,false,false,false],tg:new Float32Array(5),coil:[],pulses:[],set:false,mem:{1:[1,0,1,0,0],2:[1,1,1,1,1]},press:{}};
  for(let i=0;i<5;i++){ m.st[i]=S.stop[i]; m.tg[i]=S.stop[i]?1:0; SPm[i]=m.tg[i]; m.coil.push([0,0]); }
  const xS=chest.ox-5-(chest.W+14)/2, yS=oy+26, HX0=xS-12.5, HX1=xS-5.5;   // slider left end (when drawn); solenoid housing
  const LH=LB('スライダー用ソレノイド（2つのコイルでスライダーを出し入れする）','Schleifenzugmagnet');
  box(R,2,22,40,MAT.woodDark,HX0-1.6,yS-8,oz,LB('ソレノイドの取付け板','Winkelbalken'));
  for(const z of [oz-19,oz+19]) box(R,1.6,yS-19,1.6,MAT.woodDark,HX0-1.6,(yS-19)/2,z,LB('取付け板の支柱','Balgstütze'));
  const U=[], CM=[];
  for(let i=0;i<5;i++){
    const z=oz+ZROW[i];
    box(R,HX1-HX0,3.4,3.6,MAT.casing,(HX0+HX1)/2,yS,z,LH);
    const cm=[0,1].map(j=>{ const c=mclone(MAT.brass); CM.push(c); return c; });
    const cOff=cyl(R,1.25,2.6,cm[0],HX0+1.8,yS,z,LB('切りコイル（電流でプランジャーを押し戻し、スライダーを切る）','Ausschaltspule')); cOff.rotation.z=Math.PI/2;
    const cOn=cyl(R,1.25,2.6,cm[1],HX1-1.8,yS,z,LB('入りコイル（電流でプランジャーを引き、スライダーを入れる）','Einschaltspule')); cOn.rotation.z=Math.PI/2;
    const sw=box(R,1,0.8,1.2,MAT.ebony,(HX0+HX1)/2,yS+2.1,z,LB('終端スイッチ（動ききると電流を切る）','Endschalter'));
    U.push({z,cm,pl:rod(R,0.32,MAT.iron,LB('プランジャー（コイルに引かれて動く鉄心。スライダーにつながる）','Anker')),lk:rod(R,0.25,stopMat(i),LB('スライダーへのつなぎ','Schleifenzug'))});
  }
  // console: tabs + setter pistons
  const CX0=-64, CY=14, CZ=34;
  box(R,26,14,2,MAT.wood,CX0,CY,CZ-1,LB('演奏台のストップ板','Registerbank'));
  box(R,26,1.2,8,MAT.wood,CX0,CY-7.6,CZ+2,LB('演奏台のストップ板','Registerbank'));
  box(R,4,CY-8.2,6,MAT.woodDark,CX0,(CY-8.2)/2,CZ+1,LB('演奏台の脚','Spieltisch'));
  const tabs=[];
  for(let i=0;i<5;i++){
    const g=new T.Group(); g.position.set(CX0-9.6+4.8*i,CY+2.4,CZ+0.2); R.add(g);
    const t=box(g,3.4,4.6,0.7,stopMat(i),0,0,0.35,LB('ストップのタブ：'+STOPS[i].name+'（下を押すと入る。中のスイッチが電流を送る）','Registerwippe'));
    t.userData.stop=i; tabs.push(g);
  }
  const pist={}, PL={s:'セットボタン（押しながらコンビネーションを押すと、今のストップを記憶する）',1:'コンビネーション 1',2:'コンビネーション 2',0:'ゼロ（全部切る）'};
  ['s',1,2,0].forEach((n,j)=>{ const b=cyl(R,0.9,0.8,n==='s'?MAT.ebony:MAT.ivory,CX0-6+4*j,CY-4.2,CZ+0.6,LB(PL[n],n==='s'?'Setzer':'Kombinationsknopf')); b.rotation.x=Math.PI/2; pist[n]=b; });
  // cables: each unit has an ON and an OFF wire from the console
  const cables=[];
  for(let i=0;i<5;i++) for(let j=0;j<2;j++){
    const u=U[i], dz=(i-2)*0.5+j*0.25, xe=j?HX1-1.8:HX0+1.8;
    const P=[V3(CX0-9.6+4.8*i,CY-1,CZ-2.2),V3(CX0-9.6+4.8*i,2+0.25*j,CZ-2.2),V3(HX0-4,2+0.25*j,CZ-2.2+dz),V3(HX0-4,2+0.25*j,u.z+j*0.5),V3(HX0-4,yS-1.8,u.z+j*0.5),V3(xe,yS-1.3,u.z+j*0.5)];
    const mat=j?std(0xb8372d,.6,0):std(0x2d2d32,.6,0); CX.own.push(mat);
    for(let s=1;s<P.length;s++) rod(R,0.13,mat,LB('電線（タブのスイッチ → '+(j?'入り':'切り')+'コイル）','Kabel')).set(P[s-1],P[s]);
    const cum=[0]; for(let s=1;s<P.length;s++) cum.push(cum[s-1]+P[s].distanceTo(P[s-1]));
    cables.push({P,cum,L:cum[cum.length-1]});
  }
  const SPK=[]; for(let q=0;q<24;q++){ const mt=new T.MeshBasicMaterial({color:COL.ctrl.getHex()}); CX.own.push(mt); const s=new T.Mesh(G_SPH,mt); s.scale.set(0.45,0.45,0.45); s.visible=false; R.add(s); SPK.push(s); }
  const TP=0.45;
  const send=(i,on)=>{ m.pulses.push({i,on,t:0}); };
  const recall=n=>{ if(n==='s') return; if(m.set&&n!==0){ m.mem[n]=S.stop.map(v=>v?1:0); return; } const c=n===0?[0,0,0,0,0]:m.mem[n]; c.forEach((v,i)=>S.stop[i]=!!v); syncStopUI(); };
  return {chest,
    controls:[{type:'toggle',id:'set',label:'セット（記憶）',get:()=>m.set,set:v=>m.set=v},
      {type:'hold',label:'コンビネーション 1',down:()=>{ m.press[1]=1; recall(1); },up:()=>m.press[1]=0},
      {type:'hold',label:'コンビネーション 2',down:()=>{ m.press[2]=1; recall(2); },up:()=>m.press[2]=0},
      {type:'hold',label:'0（全部切る）',down:()=>{ m.press[0]=1; recall(0); },up:()=>m.press[0]=0}],
    ctl:{set:v=>m.set=v,recall:n=>{ m.press[n]=1; recall(n); later(400,()=>m.press[n]=0); }},
    pins:[{t:'ストップのタブ',p:V3(CX0,CY+6,CZ+1)},{t:'コンビネーション',p:V3(CX0+8,CY-5,CZ+2)},{t:'電線',p:V3(HX0-4,10,CZ-8)},{t:'ソレノイド',p:V3((HX0+HX1)/2,yS+5,oz-16)},{t:'スライダー',p:V3(-20,oy+27,oz+20),max:160}],
    update(dt){
      for(let i=0;i<5;i++) if(S.stop[i]!==m.st[i]){ m.st[i]=S.stop[i]; send(i,S.stop[i]); }
      let k=0;
      for(const p of m.pulses){
        p.t+=dt; const cb=cables[p.i*2+(p.on?1:0)];
        if(p.t<TP){ for(let q=0;q<3&&k<SPK.length;q++){ const s=SPK[k++]; s.visible=true; s.material.color.copy(COL.ctrl); polyAt(cb.P,cb.cum,clamp(p.t/TP-q*0.06,0,1)*cb.L,s.position); } }
        else if(!p.done){ p.done=true; m.tg[p.i]=p.on?1:0; m.coil[p.i][p.on?1:0]=0.35; }
      }
      for(;k<SPK.length;k++) SPK[k].visible=false;
      m.pulses=m.pulses.filter(p=>p.t<TP+0.05);
      for(let i=0;i<5;i++){
        SPm[i]+=clamp(m.tg[i]-SPm[i],-dt*7,dt*7);
        for(let j=0;j<2;j++){ m.coil[i][j]=Math.max(0,m.coil[i][j]-dt); U[i].cm[j].emissive.copy(COL.ctrl).multiplyScalar(m.coil[i][j]>0?0.9:0); }
        const xe=xS-1.8*(1-SPm[i]), u=U[i];
        const sh=-1.8*(1-SPm[i]); u.pl.set(V3(HX0+2.6+sh,yS,u.z),V3(HX1+1.6+sh,yS,u.z)); u.lk.set(V3(HX1+1.6+sh,yS,u.z),V3(xe,yS,u.z));
        tabs[i].rotation.x=S.stop[i]?-0.28:0.18;
      }
      for(const n of ['s',1,2,0]){ const on=n==='s'?m.set:!!m.press[n]; pist[n].position.z=CZ+0.6-(on?0.3:0); }
      chest.update(dt);
    }};
}

