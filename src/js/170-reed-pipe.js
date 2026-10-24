/* ---------- A-02: reed pipe ---------- */
function buildReedSection(){
  const R=CX.root, yB=30, yK=33.6, yRT=yK+18, rS=0.9, zFace=rS*0.62, z0=zFace+0.07, yTip=19.6, yC=24, yClamp=31.4, g0=0.5;
  const F0=130.8, m={on:false,env:0,ph:0,gap:g0,yc:yC,fr:1}, LV0=yC-yTip;
  const freq=()=>F0*Math.pow(LV0/(m.yc-yTip),0.6), wirePin=V3(0,yC+5,3.4);
  const bootR=y=>y<24?0.8+(3.4-0.8)*y/24:3.4;
  mk(halfShell(bootR,[0,6,12,18,24,yB]),MAT.metal,R,LB('ブーツ（足。中に風をためる）','Stiefel'));
  const toe=mk(G_CYL_OPEN,MAT.metal,R,LB('足穴（ここから風が入る）','Fußloch')); toe.scale.set(0.8,3,0.8); toe.position.set(0,-1.5,0);
  // block (Nuss) with its cut face
  const BR=mclone(MAT.brass); BR.side=T.DoubleSide; BR.color.multiplyScalar(1.15);
  const SEC=mclone(BR); SEC.color.multiplyScalar(0.72);
  const LK=LB('ナット（頭部の金属の塊。シャロットと共鳴管を支える）','Nuss');
  mk(halfShell(()=>3.6,[yB,yK]),BR,R,LK);
  mk(halfRing(0.95,3.6,yK),BR,R,LK); mk(halfRing(0.95,3.6,yB),BR,R,LK);
  sectionFace(-3.6,-0.95,yB,yK,SEC,LK); sectionFace(2.05,3.6,yB,yK,SEC,LK); sectionFace(0.95,1.55,yClamp+0.2,yK,SEC,LK);
  // shallot: tube closed at the bottom, with an opening in its front face under the tongue
  const LS=LB('シャロット（下を閉じた管。前面の開口を舌が覆う）','Kehle');
  // shallot section: round at the back, flat face at the front where the tongue lies; the opening is cut in that face
  const flatten=g=>{ const a=g.attributes.position; for(let i=0;i<a.count;i++) if(a.getZ(i)>zFace) a.setZ(i,zFace); a.needsUpdate=true; g.computeVertexNormals(); return g; };
  mk(flatten(halfShell(()=>rS,[yTip-0.6,20.3,28,yClamp+0.1],(y0,y1,t)=>y0>=20.3-1e-3&&y1<=28+1e-3&&rS*Math.cos(t)>zFace+0.05,48)),BR,R,LS);
  const sb=new T.CircleGeometry(rS,24,Math.PI/2,Math.PI); sb.rotateX(-Math.PI/2); sb.translate(0,yTip-0.6,0); flatten(sb); CX.own.push(sb); mk(sb,BR,R,LS);
  // wedge
  box(R,1.3,yClamp-27.6,0.42,MAT.woodPale,0,(yClamp+27.6)/2,z0+0.3,LB('くさび（舌をシャロットに押さえて留める）','Keil'));
  // tongue: brass strip, flat above the tuning wire, curved below it
  const LT=LB('舌（真鍮の薄板。振動してシャロットに打ち付ける）','Zunge');
  const NT=16, tsegs=[]; for(let i=0;i<NT+4;i++) tsegs.push(plank(R,1.4,0.17,BR,LT));
  const tz=(y,gap)=>y>=m.yc?z0:z0+gap*Math.pow((m.yc-y)/(m.yc-yTip),2);
  // tuning wire (Krücke)
  const LW=LB('チューニングワイヤー（舌を押さえる位置で、振動する長さと音の高さが決まる）','Krücke');
  // tuning wire: comes down in front of the tongue, is cranked toward it, and its foot is bent into a straight bar
  // lying across the full width of the tongue, so it bears on the tongue along a line
  const WR=0.11, WX=-0.62, wseg=[]; for(let i=0;i<6;i++) wseg.push(rod(R,WR,MAT.iron,LW));
  const wknee=[]; for(let i=0;i<4;i++){ const sph=mk(G_SPH,MAT.iron,R,LW); sph.scale.set(WR,WR,WR); wknee.push(sph); }
  // resonator (Vox humana: short cylinder, half-covered top)
  const LR=LB('共鳴管（短い円筒。上を半分ふさいだVox humana型）','Becher');
  mk(halfShell(()=>1.15,[yK,yRT]),MAT.metal,R,LR); mk(halfRing(0.55,1.15,yRT),MAT.metalDark,R,LB('共鳴管の上の半ぶた','Deckel'));
  const P=pressurePlane(-1.05,1.05,yK,yRT,1);
  // boot full of wind under pressure
  new Tube([V3(-0.15,-7,0),V3(-0.15,0,0),V3(-0.15,9,0)],{r:0.5,density:1.2,front:60,state:()=>({open:m.env>0.05,speed:6*m.env})});
  new Vol((a,b,c,out)=>{
    const y=1+b*(yB-1.6), r=bootR(y)*0.82, xo=Math.min(0.35,r*0.3)*c; let z;
    if(y>yTip-0.8){ const back=-rS-0.2, front=z0+0.45; z=a<0.5? -r+(back+r)*(a*2) : front+(r-front)*((a-0.5)*2); }
    else z=(a*2-1)*Math.sqrt(Math.max(0,r*r-xo*xo));
    out.set(-0.08-xo,y,z); },300,{state:()=>m.env,rate:2});
  // air drawn through the gap into the shallot and up the resonator, in pulses
  const flow=()=>m.env*m.gap/g0;
  const path=[V3(0,yTip+0.2,z0+0.9),V3(0,yTip+1.2,z0+0.25),V3(0,21.5,0.25),V3(0,yClamp,0),V3(0,yK,0),V3(0,yRT,0),V3(0,yRT+5,0)];
  const cum=[0]; for(let i=1;i<path.length;i++) cum.push(cum[i-1]+path[i].distanceTo(path[i-1])); const PL=cum[cum.length-1];
  const at=(s,out)=>{ let i=1; while(i<cum.length-1&&cum[i]<s) i++; return out.lerpVectors(path[i-1],path[i],(s-cum[i-1])/((cum[i]-cum[i-1])||1)); };
  const puff=new Field(240,(i,t,out,f)=>{
    if(m.env<0.04) return null;
    const r=f.r, s=f.s[i]*(PL+4)-4;
    if(s<0){ // approaching the gap from the boot
      const k=-s/4, y=Math.max(1.5,yTip+0.2-k*(2+r[i*4+1]*7)), rb=bootR(y)*0.8; out.set(-0.08-r[i*4]*0.2,y,Math.min(rb,z0+0.6+k*r[i*4+2]*2)); return COL.wind; }
    at(s,out); const sp=s<cum[3]?0.25:s<cum[5]?0.4:0.4+(s-cum[5])*0.5;
    out.x=-0.08-r[i*4]*0.25; out.z+=(r[i*4+1]-0.5)*sp; out.y+=(r[i*4+2]-0.5)*0.3;
    if(s>cum[5]){ _c.copy(COL.wind).lerp(COL.air,Math.min(1,(s-cum[5])/5)); return _c; }
    return COL.wind;
  });
  puff.update=dt=>{ if(m.env<0.04) return; const L=PL+4, v=16*flow(); for(let i=0;i<puff.n;i++){ let s=puff.s[i]*L+v*dt*(0.8+0.4*puff.r[i*4+3]); if(s>L) s-=L; puff.s[i]=s/L; } };
  return {
    controls:[{type:'toggle',id:'wind',label:'風を送る',get:()=>m.on,set:v=>m.on=v},
      {type:'range',id:'wire',label:'チューニングワイヤー',min:yC-0.9,max:yC+0.9,step:0.02,get:()=>m.yc,set:v=>m.yc=v,fmt:()=>{ const f=freq(), c=Math.round(1200*Math.log2(f/F0)); return TF('{0} Hz（{1} セント）',f.toFixed(1),(c>0?'+':c<0?'−':'±')+Math.abs(c)); }}],
    ctl:{wind:v=>m.on=v,wire:v=>{ m.yc=v; const el=document.getElementById('rc_wire'); if(el){ el.value=v; el.dispatchEvent(new Event('input')); } }},
    pins:[{t:'足穴',p:V3(0,-3.5,2)},{t:'ブーツ',p:V3(0,12,-3.4)},{t:'シャロット',p:V3(0,26,-2.4),max:60},{t:'舌',p:V3(0,21,z0+2.6),max:60},{t:'くさび',p:V3(0,29.2,z0+1.7),max:50},
          {t:'チューニングワイヤー',p:wirePin,max:60},{t:'ナット',p:V3(0,yK-1.8,-4.7)},{t:'共鳴管',p:V3(0,yK+12,-2.6)}],
    speaking:()=>m.env>0.35?[{k:12,i:4,r:0,f:freq()}]:[],
    update(dt){
      m.fr=freq()/F0; windEnv(m,dt);
      { const yc=m.yc, zb=z0+0.085+WR, pts=[V3(WX,yRT-4,1.78),V3(WX,yc+0.75,1.78),V3(WX,yc+0.12,zb+0.18),V3(WX,yc,zb),V3(-WX,yc,zb),V3(-WX,yc+0.35,zb+0.05)];
        for(let i=0;i<5;i++) wseg[i].set(pts[i],pts[i+1]); wseg[5].visible=false; for(let i=0;i<4;i++) wknee[i].position.copy(pts[i+1]); wirePin.y=yc+5; }
      const osc=Math.min(1,Math.max(0,0.45+0.75*Math.cos(m.ph)));   // beating: closed for part of each cycle
      m.gap=g0*((1-m.env)+m.env*osc);
      const yc=m.yc, ys=[]; ys.push(yClamp); for(let i=0;i<=3;i++) ys.push(yClamp-(yClamp-yc)*(i+1)/4); for(let i=1;i<=NT;i++) ys.push(yc-(yc-yTip)*i/NT);
      for(let i=0;i<tsegs.length&&i<ys.length-1;i++) tsegs[i].set(V3(0,ys[i],tz(ys[i],m.gap)),V3(0,ys[i+1],tz(ys[i+1],m.gap)));
      P.ph.value=m.ph; P.env.value=m.env;
    }
  };
}

