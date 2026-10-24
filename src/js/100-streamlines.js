/* ---------------- streamlines ---------------- */
const SHOW={pts:true,lines:true,pins:false};
const SL_VS=`varying float vU;
#include <clipping_planes_pars_vertex>
void main(){ vU=uv.x; vec4 mvPosition=modelViewMatrix*vec4(position,1.0); gl_Position=projectionMatrix*mvPosition;
#include <clipping_planes_vertex>
}`;
const SL_FS=`uniform float head,tail,phase,moving,exitU,len,alpha; uniform vec3 c0,c1; varying float vU;
#include <clipping_planes_pars_fragment>
void main(){
#include <clipping_planes_fragment>
 if(vU<tail||vU>head) discard;
 vec3 col=c0; if(vU>exitU) col=mix(c0,c1,clamp((vU-exitU)/max(0.001,1.0-exitU)*2.5,0.0,1.0));
 float d=fract(vU*len/6.0-phase);
 float dash=0.15+0.85*pow(d,2.5);
 float a=mix(0.5,dash,moving);
 float f=clamp((head-vU)*len/1.5,0.0,1.0);
 gl_FragColor=vec4(col,a*alpha*(0.35+0.65*f));
}`;
/* Each streamline is a thin tube swept along the flow path; K parallel lines for wide passages. */
function makeStream(tb){
  if(tb.L<0.5) return null;
  const curve=tb.p.length>2?new T.CatmullRomCurve3(tb.p,false,'centripetal'):new T.LineCurve3(tb.p[0],tb.p[1]);
  const ns=Math.max(2,Math.min(300,Math.round(tb.L/0.6)));
  const sp=curve.getSpacedPoints(ns);
  const K=tb.r>=0.8?3:tb.r>=0.4?2:1, rr=tb.r*0.6, rad=tb.r>=1?0.22:tb.r>=0.5?0.16:0.12;
  const t_=V3(0,0,0),n1=V3(0,0,0),n2=V3(0,0,0),ref=V3(0,0,0);
  const P=[],UV=[],I=[];
  for(let q=0;q<K;q++){
    const ph=q/K*6.283+0.5, ca=K>1?Math.cos(ph)*rr:0, sa=K>1?Math.sin(ph)*rr:0, pts=[];
    for(let i=0;i<=ns;i++){
      t_.subVectors(sp[Math.min(ns,i+1)],sp[Math.max(0,i-1)]).normalize();
      ref.set(0,1,0); if(Math.abs(t_.y)>0.9) ref.set(1,0,0);
      n1.crossVectors(t_,ref).normalize(); n2.crossVectors(t_,n1);
      pts.push(sp[i].clone().addScaledVector(n1,ca).addScaledVector(n2,sa));
    }
    const g=new T.TubeGeometry(new T.CatmullRomCurve3(pts,false,'catmullrom',0.1),ns,rad,4,false);
    const off=P.length/3, pa=g.attributes.position.array, ua=g.attributes.uv.array, ia=g.index.array;
    for(let i=0;i<pa.length;i++) P.push(pa[i]); for(let i=0;i<ua.length;i++) UV.push(ua[i]); for(let i=0;i<ia.length;i++) I.push(ia[i]+off);
    g.dispose();
  }
  const g=new T.BufferGeometry(); g.setAttribute('position',new T.Float32BufferAttribute(P,3)); g.setAttribute('uv',new T.Float32BufferAttribute(UV,2)); g.setIndex(I);
  const air=tb.kind==='air', ctl=tb.kind==='ctrl';
  const m=new T.ShaderMaterial({vertexShader:SL_VS,fragmentShader:SL_FS,transparent:true,depthWrite:false,clipping:true,
    uniforms:{head:{value:0},tail:{value:0},phase:{value:Math.random()},moving:{value:0},exitU:{value:2},len:{value:tb.L},alpha:{value:air?0.8:0.95},c0:{value:air?COL.air:ctl?COL.ctrl:COL.wind},c1:{value:COL.sound}}});
  const L=new T.Mesh(g,m); L.frustumCulled=false; L.visible=false; L.renderOrder=2; CX.root.add(L); CX.own.push(g,m);
  return L;
}

class Tube{
  constructor(pts,o){
    this.p=pts.map(a=>a.isVector3?a.clone():V3(a[0],a[1],a[2]));
    this.cum=[0]; for(let i=1;i<this.p.length;i++) this.cum.push(this.cum[i-1]+this.p[i].distanceTo(this.p[i-1]));
    this.L=this.cum[this.cum.length-1];
    this.n=o.n||Math.max(4,Math.round(this.L*(o.density||0.45)));
    this.r=o.r==null?0.5:o.r; this.kind=o.kind||'wind'; this.exitU=o.exitU; this.state=o.state; this.front=o.front||40;
    this.head=0; this.tail=0; this.spd=0;
    this.s=new Float32Array(this.n); this.j=new Float32Array(this.n*4);
    for(let i=0;i<this.n;i++){ this.s[i]=Math.random()*this.L; this.j[i*4]=Math.random()*2-1; this.j[i*4+1]=Math.random()*2-1; this.j[i*4+2]=Math.random()*2-1; this.j[i*4+3]=Math.random(); }
    flows.push(this);
    if(CX&&o.stream!==false) this.sl=makeStream(this);
  }
  reset(){ this.head=0; this.tail=0; }
  idle(){ return this.head<=0; }
  update(dt){
    const st=this.state();
    if(st.open){ this.tail=0; this.head=Math.min(this.L,this.head+this.front*dt); }
    else if(this.head>0){ this.tail=Math.min(this.head,this.tail+this.front*2.5*dt); if(this.tail>=this.head-1e-3){ this.head=0; this.tail=0; } }
    this.spd=st.open?(st.speed||0):0;
    if(this.sl){ const U=this.sl.material.uniforms; U.head.value=this.head/this.L; U.tail.value=this.tail/this.L; U.exitU.value=this.exitU==null?2:this.exitU; U.phase.value=(U.phase.value+dt*this.spd/6)%1; U.moving.value+=((this.spd>0.5?1:0)-U.moving.value)*Math.min(1,dt*4); this.sl.visible=SHOW.lines&&this.head>0; }
    if(this.spd>0){ const v=this.spd*dt; for(let i=0;i<this.n;i++){ let s=this.s[i]+v*(0.75+0.5*this.j[i*4+3]); if(s>this.L) s-=this.L; this.s[i]=s; } }
  }
  reached(d){ return this.head>0 && this.head>=d-1e-3 && this.tail<=d+1e-3; }
  full(){ return this.reached(this.L); }
  at(s,out){ let i=1; while(i<this.cum.length-1&&this.cum[i]<s) i++; const seg=(this.cum[i]-this.cum[i-1])||1; return out.lerpVectors(this.p[i-1],this.p[i],(s-this.cum[i-1])/seg); }
  nearestDist(q){ let best=1e9,bd=0; for(let i=1;i<this.p.length;i++){ const a=this.p[i-1],b=this.p[i]; const ab=V3(0,0,0).subVectors(b,a); const l2=ab.lengthSq()||1; const t=clamp(V3(0,0,0).subVectors(q,a).dot(ab)/l2,0,1); const pt=a.clone().addScaledVector(ab,t); const dd=pt.distanceTo(q); if(dd<best){best=dd; bd=this.cum[i-1]+t*Math.sqrt(l2);} } return bd; }
  write(pos,col,base,t){
    const show=this.head>0, c0=this.kind==='air'?COL.air:this.kind==='ctrl'?COL.ctrl:COL.wind, still=this.spd<=0.01, r=this.r;
    for(let i=0;i<this.n;i++){
      const o=(base+i)*3, s=this.s[i];
      if(!show||s<this.tail||s>this.head){ pos[o]=0; pos[o+1]=-1e5; pos[o+2]=0; continue; }
      this.at(s,_v); const j=i*4; let jx=this.j[j]*r, jy=this.j[j+1]*r, jz=this.j[j+2]*r;
      if(still){ const ph=this.j[j+3]*6.283; jx+=Math.sin(t*3.1+ph)*.22*r; jy+=Math.cos(t*2.7+ph*1.3)*.22*r; jz+=Math.sin(t*2.3+ph*.7)*.22*r; }
      pos[o]=_v.x+jx; pos[o+1]=_v.y+jy; pos[o+2]=_v.z+jz;
      let c=c0; if(this.exitU!=null){ const u=s/this.L; if(u>this.exitU){ _c.copy(c0).lerp(COL.sound,Math.min(1,(u-this.exitU)/(1-this.exitU)*2.5)); c=_c; } }
      col[o]=c.r; col[o+1]=c.g; col[o+2]=c.b;
    }
  }
}
class Vol{
  constructor(fn,n,o){ this.fn=fn; this.n=n; this.state=o.state; this.kind=o.kind||'wind'; this.rate=o.rate||1.4; this.fill=0; this.sd=new Float32Array(n*4); for(let i=0;i<n*4;i++) this.sd[i]=Math.random(); flows.push(this); }
  reset(){ this.fill=0; }
  idle(){ return Math.round(this.fill*this.n)<=0; }
  update(dt){ const t=clamp(this.state(),0,1); this.fill+=clamp(t-this.fill,-this.rate*dt,this.rate*dt); }
  write(pos,col,base,t){
    const m=Math.round(this.fill*this.n), c=this.kind==='air'?COL.air:this.kind==='ctrl'?COL.ctrl:COL.wind;
    for(let i=0;i<this.n;i++){
      const o=(base+i)*3; if(i>=m){ pos[o]=0; pos[o+1]=-1e5; pos[o+2]=0; continue; }
      const j=i*4, ph=this.sd[j+3]*6.283;
      this.fn(clamp(this.sd[j]+Math.sin(t*.9+ph)*.035,0,1),clamp(this.sd[j+1]+Math.cos(t*.8+ph*1.7)*.035,0,1),clamp(this.sd[j+2]+Math.sin(t*.7+ph*2.1)*.035,0,1),_v);
      pos[o]=_v.x; pos[o+1]=_v.y; pos[o+2]=_v.z; col[o]=c.r; col[o+1]=c.g; col[o+2]=c.b;
    }
  }
}
function writeParticles(){ points.visible=SHOW.pts; let base=0; const pos=pAttr.array,col=cAttr.array; for(const f of flows){ if(f.idle&&f.idle()) continue; if(base+f.n>MAXP) break; f.write(pos,col,base,S.time); base+=f.n; } pGeo.setDrawRange(0,base); pAttr.needsUpdate=true; cAttr.needsUpdate=true; }

