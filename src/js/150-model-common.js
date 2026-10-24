/* ---------------- model definitions ---------------- */
let TIMERS=[];
function later(ms,fn){ TIMERS.push(setTimeout(fn,ms)); }
function clearTimers(){ TIMERS.forEach(clearTimeout); TIMERS=[]; }

/* ================= Chapter A: how a pipe speaks (cross-section models) =================
   Both models are cut on the plane x = 0 (the half x ≤ 0 is kept) and viewed from +x.
   The oscillation is shown far slower than real (a pipe vibrates hundreds of times a second). */
const yWire=d=>24+d;
const VIS_HZ=5.5, OMEGA=2*Math.PI*VIS_HZ;
const PX=()=>-0.06-Math.random()*0.25;           // particles sit just behind the cut face
function halfShell(radAt,ys,skip,NA){
  NA=NA||32; const ang=[]; for(let j=0;j<=NA;j++) ang.push(Math.PI+Math.PI*j/NA);
  const P=[],I=[],nA=ang.length;
  for(const y of ys){ const r=radAt(y); for(const t of ang) P.push(r*Math.sin(t),y,r*Math.cos(t)); }
  for(let i=0;i<ys.length-1;i++) for(let j=0;j<nA-1;j++){ const tm=(ang[j]+ang[j+1])/2; if(skip&&skip(ys[i],ys[i+1],tm)) continue; const a0=i*nA+j,a1=a0+1,b0=a0+nA,b1=b0+1; I.push(a0,b0,a1,a1,b0,b1); }
  const g=new T.BufferGeometry(); g.setAttribute('position',new T.Float32BufferAttribute(P,3)); g.setIndex(I); g.computeVertexNormals(); CX.own.push(g); return g;
}
function halfRing(ri,ro,y){ const g=new T.RingGeometry(ri,ro,24,1,Math.PI/2,Math.PI); g.rotateX(-Math.PI/2); g.translate(0,y,0); CX.own.push(g); return g; }
function sectionFace(z0,z1,y0,y1,mat,label){ return box(CX.root,0.04,y1-y0,z1-z0,mat,-0.02,(y0+y1)/2,(z0+z1)/2,label); }
/* acoustic pressure in the cut plane: orange = above average, blue = below */
const PR_VS=`varying vec2 vUv;
#include <clipping_planes_pars_vertex>
void main(){ vUv=uv; vec4 mvPosition=modelViewMatrix*vec4(position,1.0); gl_Position=projectionMatrix*mvPosition;
#include <clipping_planes_vertex>
}`;
const PR_FS=`uniform float ph,env,mode; uniform vec3 cHi,cLo; varying vec2 vUv;
#include <clipping_planes_pars_fragment>
void main(){
#include <clipping_planes_fragment>
 float shape = mode<0.5 ? sin(3.14159*vUv.y) : (mode<1.5 ? cos(1.5708*vUv.y) : sin(1.5708*vUv.y));
 float p = shape*cos(ph)*env;
 gl_FragColor=vec4(p>0.0?cHi:cLo, min(0.75,abs(p)*0.95));
}`;
function pressurePlane(z0,z1,y0,y1,mode){
  const g=new T.PlaneGeometry(z1-z0,1); g.rotateY(-Math.PI/2); g.translate(-0.12,0.5,(z0+z1)/2); CX.own.push(g);
  const m=new T.ShaderMaterial({vertexShader:PR_VS,fragmentShader:PR_FS,transparent:true,depthWrite:false,side:T.DoubleSide,clipping:true,
    uniforms:{ph:{value:0},env:{value:0},mode:{value:mode},cHi:{value:COL.sound},cLo:{value:COL.wind}}}); CX.own.push(m);
  const pl=new T.Mesh(g,m); pl.renderOrder=1; pl.position.y=y0; pl.scale.y=y1-y0; CX.root.add(pl); pl.userData.label=LB('空気柱の圧力の変化（橙＝高い、青＝低い）','Schalldruck'); m.uniforms.mesh=pl; return m.uniforms;
}
/* generic particle set driven by a callback: fn(i, t, out) → returns false to hide, sets out position and color */
class Field{
  constructor(n,fn){ this.n=n; this.fn=fn; this.r=new Float32Array(n*4); for(let i=0;i<n*4;i++) this.r[i]=Math.random(); this.s=new Float32Array(n); for(let i=0;i<n;i++) this.s[i]=Math.random(); flows.push(this); }
  reset(){} update(){}
  write(pos,col,base,t){ for(let i=0;i<this.n;i++){ const o=(base+i)*3; const c=this.fn(i,t,_v,this); if(!c){ pos[o]=0; pos[o+1]=-1e5; pos[o+2]=0; continue; } pos[o]=_v.x; pos[o+1]=_v.y; pos[o+2]=_v.z; col[o]=c.r; col[o+1]=c.g; col[o+2]=c.b; } }
}
function windEnv(m,dt){ const on=m.on; m.env+=((on?1:0)-m.env)*Math.min(1,dt*(on?1.6:2.5)); S.p+=((on?75:0)-S.p)*Math.min(1,dt*5); if(on||m.env>0.01) m.ph+=dt*OMEGA*(m.fr||1); return m.env; }

