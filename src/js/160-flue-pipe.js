/* ---------- A-01: flue pipe ---------- */
function buildFlueSection(){
  const R=CX.root, Rb=3.3, footH=18, toeR=0.8, H=72, g=0.25;
  const G=flueGeos(Rb,footH,toeR,H,1/4,1/4,g); CX.own.push(G.body,G.foot,G.lang);
  const d=G.d, hc=G.hc, zc=d-g/2;
  mk(G.body,MAT.metal,R,LB('胴（共鳴管。中の空気柱の長さで音の高さが決まる）','Körper'));
  mk(G.foot,MAT.metal,R,LB('足（足穴から入った風をラングイドの下にためる）','Fuß'));
  // languid (thick plate, bevelled front, underside level with the lower lip)
  const LT=0.3, BW=LT/Math.tan(55*Math.PI/180), zF=d-g, zB=zF-BW, Rl=Rb*0.985;
  const LKN=LB('ラングイド（下面が下唇の上端と同じ高さの厚い板。前縁は斜めに削がれ、その下端と下唇のすき間がウインドウェイ）','Kern');
  const ls=new T.Shape(), pa=Math.acos(clamp(zB/Rl,-1,1));
  for(let j=0;j<=48;j++){ const t=pa+(2*Math.PI-2*pa)*j/48; const x=Rl*Math.sin(t), z=Rl*Math.cos(t); if(j===0) ls.moveTo(x,-z); else ls.lineTo(x,-z); } ls.closePath();
  const lg=new T.ExtrudeGeometry(ls,{depth:LT,bevelEnabled:false}); lg.rotateX(-Math.PI/2); CX.own.push(lg); mk(lg,MAT.metalDark,R,LKN);
  const xw=Math.sqrt(Math.max(0,Rl*Rl-zF*zF)), bs=new T.Shape(); bs.moveTo(-zB,0); bs.lineTo(-zF,0); bs.lineTo(-zB,LT); bs.closePath();
  const bg=new T.ExtrudeGeometry(bs,{depth:2*xw,bevelEnabled:false}); bg.rotateY(Math.PI/2); bg.translate(-xw,0,0); CX.own.push(bg); mk(bg,MAT.metalDark,R,LKN);
  const cs=new T.Shape(); cs.moveTo(Rl,0); cs.lineTo(-zF,0); cs.lineTo(-zB,LT); cs.lineTo(Rl,LT); cs.closePath();
  const cg=new T.ShapeGeometry(cs); cg.rotateY(Math.PI/2); cg.translate(-0.01,0,0); CX.own.push(cg);
  const cm=mclone(MAT.metalDark); cm.side=T.DoubleSide; cm.color.multiplyScalar(0.62); mk(cg,cm,R,LKN);
  const nk=Math.atan2(LT,BW);
  for(let j=0;j<9;j++){ const xn=-xw*0.9+j*(xw*1.8/8); const b=box(R,0.04,0.03,0.13,MAT.dark,xn,LT*0.3,zF-BW*0.35,LB('ニック（ラングイド前縁の細い刻み。発音を整える）','Kernstiche')); b.rotation.x=nk; }
  const toe=mk(G_CYL_OPEN,MAT.metal,R,LB('足穴（ここから風が入る）','Fußloch')); toe.scale.set(toeR,3,toeR); toe.position.set(0,-footH-1.5,0);
  const SL=8, sleeve=mk(halfShell(()=>Rb+0.16,[0,SL],null,32),MAT.metalDark,R,LB('チューニングスリーブ（胴の上端にはめた筒。上下させて管の長さを変え、音の高さを合わせる）','Stimmschieber'));

  /* ---- wooden stopped pipe of the same body length, standing beside it (to the right in the section view) ---- */
  const zW=-18, WI=3, WT=0.7, hx=3, zFi=zW+WI, zFo=zFi+WT, gw=0.3, zcw=zFi, zbk=zFi-gw/2, zCi=zFi+gw/2, hcw=1.5, LBW=LB('木管の胴（閉管。上端を栓でふさいでいる）','Holzgedackt');
  const WD=mclone(MAT.pipeWood), WS=mclone(MAT.pipeWoodLight);
  // the pipe is built as two mirrored halves (x<0 and x>0): cut on x=0 the left half shows its section faces,
  // with the cut slider at zero both halves together show the whole pipe
  const SG=[-1,1];
  const prism=(pts,mat,label,w)=>{ w=w||hx; SG.forEach(sg=>{ const sh=new T.Shape(); pts.forEach((p,i)=>i?sh.lineTo(-p[0],p[1]):sh.moveTo(-p[0],p[1])); sh.closePath();
    const g=new T.ExtrudeGeometry(sh,{depth:w,bevelEnabled:false}); g.rotateY(Math.PI/2); g.translate(sg<0?-w:0,0,0); CX.own.push(g); mk(g,mat,R,label); }); };
  const box2=(w,h,dz,mat,y,z,label,par)=>SG.forEach(sg=>box(par||R,w,h,dz,mat,sg*w/2,y,z,label));
  box2(hx,H+7.3,WT,WD,(H-7.3)/2,zW-WI-WT/2,LBW);                                       // back wall
  SG.forEach(sg=>box(R,WT,H+7.3,2*(WI+WT),WD,sg*(hx+WT/2),(H-7.3)/2,zW,LBW));          // side walls
  box2(hx,H-hcw-3.5,WT,WD,(H+hcw+3.5)/2,zFi+WT/2,LB('前板（下の縁が上唇）','Vorderbrett'));
  // upper lip: the front board's lower edge, bevelled on the OUTSIDE so the sharp edge is at the inner face, in line with the windway
  prism([[zFi,hcw],[zFi,hcw+3.5],[zFo,hcw+3.5]],WD,LB('上唇（前板の下の縁。外側を斜めに削いで、内面側の縁を鋭くしてある）','Oberlabium'));
  // foot chamber under the block; the block's front is chamfered; the cap, a flat rectangular plate as wide as the pipe,
  // closes the front below the mouth: between chamfer and cap a wedge-shaped space narrows upward to the windway slit
  const yT=-4.3, yC=-6.5, yBt=-7.3, sl=1.8, capT=0.9;
  prism([[zW-WI,yT],[zbk-sl,yT],[zbk,0],[zW-WI,0]],WS,LB('ブロック（足と胴の仕切り。前を斜めに削いであり、キャップとのあいだにくさび形の空間ができる）','Kern'));
  const LBB=LB('底の部材（足の風室を囲む）','Kernboden');
  prism([[zW-WI,yBt],[zW-0.45,yBt],[zW-0.45,yC],[zW-1.8,yC],[zW-1.8,yT],[zW-WI,yT]],WS,LBB);
  prism([[zW+0.45,yBt],[zCi,yBt],[zCi,yC],[zW+0.45,yC]],WS,LBB);
  box2(hx+WT,-yBt,capT,WS,yBt/2,zCi+capT/2,LB('キャップ（歌口の下で管の前面に取り付けた、管と同じ幅の直方体の板。平らな内面とブロックの面取りのあいだがウインドウェイ。上の縁が下唇）','Vorschlag'));
  const wf=mk(G_CYL,WS,R,LB('木管の足（ろくろで挽いた足。足穴から風が入る）','Fuß')); wf.scale.set(1.4,10,1.4); wf.position.set(0,-12.3,zW);
  box(R,0.02,10,0.9,MAT.dark,0.004,-12.3,zW,LB('足の穴','Fußloch'));
  const stp=new T.Group(); R.add(stp);
  box2(hx,3,2*WI-0.1,WS,1.5,zW,LB('栓（ストッパー。上下させて管の長さを変え、音の高さを合わせる）','Spund'),stp);
  box2(hx,0.4,2*WI,MAT.leather,0.2,zW,LB('栓の革巻き（すき間をふさぐ）','Spundleder'),stp);
  box(stp,hx*0.8,3,1.2,WS,0,4.5,zW,LB('栓の取っ手','Spundgriff'));

  const F0=261.6, F0W=130.8, EC=4, ECW=2.5, LW0=H-4;
  const m={on:false,env:0,ext:3.5,stop:LW0,sm:true,sw:true};
  const freqM=()=>F0*(H+3.5+EC)/(H+m.ext+EC), freqW=()=>F0W*(LW0-hcw+ECW)/(m.stop-hcw+ECW);
  const topPin=V3(0,H+4.5,0), slvPin=V3(0,H,-Rb-2.4), stpPin=V3(0,LW0+2,zW-WI-2.4);

  /* one sounding flue: jet across its mouth, air column moving in its body, pressure shading */
  function voice(o){
    const v={env:0,ph:0};
    const P=pressurePlane(o.zA,o.zB,o.hc+0.4,o.top(),o.mode);
    new Tube(o.supply,{r:0.5,density:1.2,front:60,state:()=>({open:v.env>0.05,speed:7*v.env})});
    new Vol(o.footVol,220,{state:()=>v.env,rate:2});
    const hc=o.hc, A=0.85, kap=(Math.PI/2)/hc, del=s=>A*v.env*Math.pow(Math.max(0,s)/hc,1.4)*Math.sin(v.ph-kap*s);
    const VJ=7, TAIL=7, zc=o.zc, dl0=o.zl, gg=o.g;
    const jet=new Field(220,(i,t,out,f)=>{
      if(v.env<0.04) return null;
      const r=f.r, s=f.s[i]*(hc+1.2+TAIL)-1.2, jz=(r[i*4]-0.5)*gg*0.55, x=-0.06-r[i*4+1]*0.2;
      if(s<0){ out.set(x,s,zc+jz+s*(o.slant||0)); return COL.wind; }
      if(s<=hc){ out.set(x,s,zc+jz+del(s)); return COL.wind; }
      const u=s-hc;
      if(f.side[i]<0){ out.set(x,hc+u*0.75,dl0-0.35-u*0.32+jz); return COL.wind; }
      out.set(x,hc+u*0.55,dl0+0.25+u*0.7+jz); _c.copy(COL.wind).lerp(COL.air,Math.min(1,u/TAIL*1.4)); return _c;
    });
    jet.side=new Int8Array(220);
    jet.update=dt=>{ if(v.env<0.04) return; const L=hc+1.2+TAIL; for(let i=0;i<jet.n;i++){ const s0=jet.s[i]*L-1.2; let s=s0+VJ*dt*(0.85+0.3*jet.r[i*4+2]); if(s0<=hc&&s>hc) jet.side[i]=del(hc)+(jet.r[i*4+3]-0.5)*0.25<0?-1:1; if(s>L-1.2){ s=-1.2; jet.side[i]=0; } jet.s[i]=(s+1.2)/L; } };
    const NJ=40, jg=new T.BufferGeometry(), jp=new Float32Array((NJ+1)*6), ji=[]; for(let i=0;i<NJ;i++){ const a=i*2; ji.push(a,a+1,a+2,a+1,a+3,a+2); }
    jg.setAttribute('position',new T.BufferAttribute(jp,3)); jg.setIndex(ji); CX.own.push(jg);
    const jm=new T.MeshBasicMaterial({color:COL.wind.getHex(),transparent:true,opacity:0.35,side:T.DoubleSide,depthWrite:false}); CX.own.push(jm);
    const sheet=new T.Mesh(jg,jm); sheet.frustumCulled=false; sheet.renderOrder=3; R.add(sheet); sheet.userData.label=LB('噴流（ウインドウェイから吹き出す薄い板状の風）','Luftblatt');
    const NZ=9, NY=60;
    new Field(NZ*NY,(i,t,out,f)=>{
      if(v.env<0.02) return null;
      const top=o.top(), iz=i%NZ, iy=(i/NZ)|0, y0=hc+1+(top-hc-1.5)*(iy+0.5)/NY, z0=o.zA+0.3+(o.zB-o.zA-0.6)*(iz+0.5)/NZ, u=(y0-hc)/(top-hc);
      const shape=o.mode===0?Math.cos(Math.PI*u):Math.cos(Math.PI*u/2);
      out.set(-0.08-f.r[i*4]*0.3,y0+1.4*v.env*shape*Math.sin(v.ph),z0+(f.r[i*4+1]-0.5)*0.4); return COL.air;
    });
    if(o.mode===0) new Field(40,(i,t,out,f)=>{ if(v.env<0.02) return null; const top=o.top(), y0=top+0.6+f.r[i*4]*3, z0=(f.r[i*4+1]*2-1)*Rb*0.8; out.set(-0.1-f.r[i*4+2]*0.3,y0-1.4*v.env*Math.sin(v.ph)*(1-(y0-top)/4),z0); return COL.air; });
    v.update=(dt,target,fr)=>{
      v.env+=(target-v.env)*Math.min(1,dt*(target>v.env?1.6:2.5)); if(v.env>0.01) v.ph+=dt*OMEGA*fr;
      P.ph.value=v.ph; P.env.value=v.env; P.mesh.scale.y=o.top()-hc-0.4;
      sheet.visible=v.env>0.04&&SHOW.lines; if(!sheet.visible) return; jm.color.copy(COL.wind);
      const dl=del(hc), inside=dl<0, w=gg*0.45;
      for(let i=0;i<=NJ;i++){ const s=-1.2+(hc+1.2+3.2)*i/NJ; let y,z;
        if(s<=hc){ y=s; z=zc+del(s)+(s<0?s*(o.slant||0):0); } else { const u=s-hc, k=Math.min(1,Math.abs(dl)/(A*0.5)); y=hc+u*(inside?0.75:0.55); z=zc+dl+(inside?-0.32*u*k:0.7*u*k); }
        jp[i*6]=-0.04; jp[i*6+1]=y; jp[i*6+2]=z-w/2; jp[i*6+3]=-0.04; jp[i*6+4]=y; jp[i*6+5]=z+w/2; }
      jg.attributes.position.needsUpdate=true; jg.computeBoundingSphere();
    };
    return v;
  }
  const vm=voice({zc,zl:d,g,hc,mode:0,zA:-Rb*0.96,zB:d-0.1,top:()=>H+m.ext,
    supply:[V3(-0.15,-footH-6,0),V3(-0.15,-footH,0),V3(-0.15,-8,0.4),V3(-0.15,-2.6,zc-0.2),V3(-0.15,-1.15,zc)],
    footVol:(a,b,c,out)=>{ const y=-footH+1+b*(footH-2.6), rc=toeR+(Rb-toeR)*(y+footH)/footH; out.set(-0.08-c*rc*0.6,y,(a*2-1)*rc*0.85); }});
  const vw=voice({zc:zcw,zl:zFi,g:gw,hc:hcw,mode:2,zA:zW-WI+0.1,zB:zFi-0.1,top:()=>m.stop,
    supply:[V3(-0.15,-23,zW),V3(-0.15,-17,zW),V3(-0.15,-6.6,zW),V3(-0.15,-5.4,zW+0.9),V3(-0.15,-5.0,zCi-0.6),V3(-0.15,-3.6,zCi-0.75),V3(-0.15,-1.2,zcw)],
    footVol:(a,b,c,out)=>{ if(a<0.55) out.set(-0.08-c*0.3,-16.5+b*9.6,zW+(a/0.55-0.5)*0.8); else out.set(-0.08-c*0.3,yC+0.2+b*(yT-yC-0.4),zW-1.6+((a-0.55)/0.45)*(zCi-0.2-zW+1.6)); }});
  const fmt=(f,f0)=>{ const c=Math.round(1200*Math.log2(f/f0)); return TF('{0} Hz（{1} セント）',f.toFixed(1),(c>0?'+':c<0?'−':'±')+Math.abs(c)); };
  const setR=(id,v)=>{ const el=document.getElementById('rc_'+id); if(el){ el.value=v; el.dispatchEvent(new Event('input')); } };
  return {
    controls:[{type:'toggle',id:'wind',label:'風を送る',get:()=>m.on,set:v=>m.on=v},
      {type:'toggle',id:'sm',label:'メタル（開管）',get:()=>m.sm,set:v=>m.sm=v},
      {type:'toggle',id:'sw',label:'木管（閉管）',get:()=>m.sw,set:v=>m.sw=v},
      {type:'range',id:'sleeve',label:'チューニングスリーブ',min:0.5,max:6.5,step:0.05,get:()=>m.ext,set:v=>m.ext=v,fmt:()=>fmt(freqM(),F0)},
      {type:'range',id:'stop',label:'木管の栓',min:LW0-3,max:LW0+3,step:0.05,get:()=>m.stop,set:v=>m.stop=v,fmt:()=>fmt(freqW(),F0W)}],
    ctl:{wind:v=>m.on=v,sm:v=>m.sm=v,sw:v=>m.sw=v,sleeve:v=>{ m.ext=v; setR('sleeve',v); },stop:v=>{ m.stop=v; setR('stop',v); }},
    pins:[{t:'足穴',p:V3(0,-footH-3.5,toeR+1.2)},{t:'ラングイド',p:V3(0,0.45,-1.2),max:45},{t:'ウインドウェイ',p:V3(0,-0.3,zc+1.7),max:45},
          {t:'上唇（エッジ）',p:V3(0,hc+0.9,d+1.6),max:45},{t:'メタル・開管',p:V3(0,H*0.55,Rb+2.2)},{t:'開いた上端',p:topPin},{t:'チューニングスリーブ',p:slvPin},
          {t:'木管・閉管',p:V3(0,H*0.55,zW-WI-2.6)},{t:'栓',p:stpPin},{t:'ブロック',p:V3(0,-2,zW-1.5),max:45},{t:'キャップ',p:V3(0,-4,zCi+capT+1.6),max:45},{t:'くさび形の空間',p:V3(0,-3.4,zbk-2.2),max:30},{t:'足の風室',p:V3(0,-5.4,zW-0.4),max:30},{t:'ウインドウェイ',p:V3(0,-2.2,zbk+1.8),max:30},{t:'上唇',p:V3(0,hcw+1.2,zFo+1.6),max:45}],
    speaking:()=>{ const out=[]; if(vm.env>0.35) out.push({k:0,i:2,r:0,f:freqM()}); if(vw.env>0.35) out.push({k:0,i:0,r:0,f:freqW()}); return out; },
    update(dt){
      S.p+=((m.on?75:0)-S.p)*Math.min(1,dt*5);
      vm.update(dt,m.on&&m.sm?1:0,freqM()/F0); vw.update(dt,m.on&&m.sw?1:0,freqW()/F0);
      sleeve.position.y=H+m.ext-SL; topPin.y=H+m.ext+4.5; slvPin.y=H+m.ext-3; stp.position.y=m.stop; stpPin.y=m.stop+2;
    }
  };
}

