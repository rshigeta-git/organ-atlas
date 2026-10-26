/* ---------- large models: instanced moving parts and merged static parts ----------
   Parts that move every frame (trackers, roller arms, wires) are drawn as instanced meshes, one per geometry/material,
   with a per-instance colour for the key highlight. Fixed parts are built into a group and merged per material
   at the end; the hover label of each original part is kept by triangle range. */
const _q=new T.Quaternion(), _sv=V3(1,1,1), _mv=V3(0,0,0), _dv=V3(0,0,0), _Z0=new T.Matrix4().makeScale(0,0,0);
function mkPool(){
  const P={m:new Map()};
  P.add=(geo,mat,label,ud)=>{ const key=geo.uuid+'|'+mat.uuid; let p=P.m.get(key); if(!p){ p={geo,mat,h:[]}; P.m.set(key,p); }
    const h={p,i:p.h.length,m:_Z0.clone(),base:mat.color.clone(),c:mat.color.clone(),label,ud:ud||{}}; p.h.push(h); return h; };
  P.finish=()=>{ for(const p of P.m.values()){ const mm=p.mat.clone(); mm.color.set(0xffffff); CX.own.push(mm); const im=new T.InstancedMesh(p.geo,mm,p.h.length);
    im.instanceMatrix.setUsage(T.DynamicDrawUsage); im.frustumCulled=false; for(const h of p.h){ im.setMatrixAt(h.i,h.m); im.setColorAt(h.i,h.base); }
    im.instanceColor.setUsage(T.DynamicDrawUsage); im.userData.inst=p.h; p.im=im; CX.root.add(im); } };
  P.flush=()=>{ for(const p of P.m.values()){ const im=p.im; if(!im) continue; const a=im.instanceMatrix.array, c=im.instanceColor.array;
    for(const h of p.h){ h.m.toArray(a,h.i*16); c[h.i*3]=h.c.r; c[h.i*3+1]=h.c.g; c[h.i*3+2]=h.c.b; } im.instanceMatrix.needsUpdate=true; im.instanceColor.needsUpdate=true; } };
  return P;
}
function hlSet(h,a){ h.c.copy(h.base); if(a>0.005) h.c.lerp(COL.key,Math.min(1,a)*0.75); }
function prod(mat,r,label,ud){ const h=CX.pool.add(G_ROD,mat,label,ud); h.set=(a,b)=>{ _dv.subVectors(b,a); const L=_dv.length()||1e-4; _mv.copy(a).addScaledVector(_dv,.5); _q.setFromUnitVectors(UP,_dv.divideScalar(L)); _sv.set(r,L,r); h.m.compose(_mv,_q,_sv); }; h.hl=a=>hlSet(h,a); return h; }
function pplank(mat,sx,sz,label,ud){ const h=CX.pool.add(G_BOX,mat,label,ud); h.set=(a,b)=>{ _dv.subVectors(b,a); const L=_dv.length()||1e-4; _mv.copy(a).addScaledVector(_dv,.5); _q.setFromUnitVectors(UP,_dv.divideScalar(L)); _sv.set(sx,L,sz); h.m.compose(_mv,_q,_sv); }; h.hl=a=>hlSet(h,a); return h; }
function pnut(mat,r,hh,label,ud){ const h=CX.pool.add(G_CYL,mat,label,ud); h.at=(p,dir)=>{ _q.setFromUnitVectors(UP,dir||UP); _sv.set(r,hh,r); h.m.compose(p,_q,_sv); }; h.hl=a=>hlSet(h,a); return h; }
function pbox(mat,label,ud){ const h=CX.pool.add(G_BOX,mat,label,ud); h.put=(x,y,z,w,hh,d)=>{ _mv.set(x,y,z); _q.identity(); _sv.set(w,hh,d); h.m.compose(_mv,_q,_sv); }; h.hl=a=>hlSet(h,a); return h; }
/* tracker: thin wooden strip, threaded wire at both ends (one wire drawn along the whole length), leather nuts;
   set(top,bottom,thick,w1): w1 = length of the wire at the top end (longer where another nut sits on it) */
function ptrk(mat,label,ud){
  const w=prod(MAT.iron,0.07,LB('ワイヤー（トラッカーの両端）','Draht'),ud), wd=pplank(mat,0.9,0.22,label,ud);
  const n1=pnut(MAT.leather,0.42,0.3,LB('革ナット（回して長さを調整する）','Ledermutter'),ud), n2=pnut(MAT.leather,0.45,0.34,LB('革ナット（鍵や腕の下で受ける）','Ledermutter'),ud);
  const B=V3(0,0,0),Cc=V3(0,0,0),D=V3(0,0,0),dir=V3(0,0,0);
  return {set(top,bottom,thick,w1){
      dir.subVectors(bottom,top); const L=dir.length()||1e-3; dir.divideScalar(L);
      B.copy(top).addScaledVector(dir,w1!=null?Math.min(w1,L*0.8):Math.min(3,L*0.18)); Cc.copy(bottom).addScaledVector(dir,-Math.min(3.2,L*0.2)); D.copy(bottom).addScaledVector(dir,thick+0.25);
      w.set(top,D); wd.set(B,Cc); n1.at(V3(0,0,0).copy(top).addScaledVector(dir,-0.15),dir); n2.at(V3(0,0,0).copy(D).addScaledVector(dir,-0.05),dir); },
    hl(a){ wd.hl(a); }};
}
// a bore through a board: a dark cylinder slightly longer than the board, so it shows as a hole on both faces and in the cut view
const G_BOREW=new T.CylinderGeometry(1,1,1,20,1,true); const BORE_WALL=new WeakMap();
function bore(par,mat,x,y0,y1,z,r,lab,ends=true){
  // the wall is a half-transparent tube (reads as a hollow bore in the x-ray view); it shares the glow colour of the hole material
  // the wall material is cached per hole material in a WeakMap: kept in mat.userData it would be copied (as broken JSON)
  // into every later clone of that material, and bores made with such a clone did not show
  let w=BORE_WALL.get(mat); if(!w){ w=mat.clone(); if(CX.own.includes(mat)) CX.own.push(w); w.side=T.DoubleSide; w.transparent=true; w.opacity=0.45; w.depthWrite=false; w.emissive=mat.emissive; BORE_WALL.set(mat,w); }
  const c=mk(G_BOREW,w,par,lab); c.scale.set(r,y1-y0,r); c.position.set(x,(y0+y1)/2,z);
  if(ends) for(const [y,rx] of [[y1+0.03,-Math.PI/2],[y0-0.03,Math.PI/2]]){ const d=mk(G_DISC,mat,par,lab); d.rotation.x=rx; d.scale.set(r,r,r); d.position.set(x,y,z); }
  return c; }
// the same along any straight line a → b (a horizontal conduit, a slanted passage); ends optional
function boreAB(par,mat,a,b,r,lab,ends=true){
  const c=bore(par,mat,0,0,1,0,r,lab,false); _dv.subVectors(b,a); const L=_dv.length()||1e-4;
  c.position.copy(a).addScaledVector(_dv,.5); c.scale.set(r,L,r); c.quaternion.setFromUnitVectors(UP,_dv.divideScalar(L));
  if(ends) for(const [p,s] of [[b,1],[a,-1]]){ const d=mk(G_DISC,mat,par,lab); d.quaternion.setFromUnitVectors(V3(0,0,1),_dv.clone().multiplyScalar(s)); d.scale.set(r,r,r); d.position.copy(p).addScaledVector(_dv,0.03*s); }
  return c; }
function mergeStatic(G,target){
  G.updateMatrixWorld(true); const by=new Map(), nm=new T.Matrix3();
  G.traverse(o=>{ if(!o.isMesh) return; let lab=null,ud={}; for(let q=o;q&&q!==G.parent;q=q.parent){ if(!lab&&q.userData.label) lab=q.userData.label; for(const kk of ['key','man','stop','act']) if(ud[kk]==null&&q.userData[kk]!=null) ud[kk]=q.userData[kk]; }
    let e=by.get(o.material); if(!e){ e={src:[],nv:0,ni:0}; by.set(o.material,e); } const g=o.geometry, nv=g.attributes.position.count, ni=g.index?g.index.count:nv;
    e.src.push({o,g,lab,ud,nv,ni}); e.nv+=nv; e.ni+=ni; });
  for(const [mat,e] of by){
    const P=new Float32Array(e.nv*3), N=new Float32Array(e.nv*3), I=new Uint32Array(e.ni), ranges=[]; let vo=0, io=0; const v=V3(0,0,0);
    for(const s of e.src){ const pa=s.g.attributes.position.array, na=s.g.attributes.normal?s.g.attributes.normal.array:null, M=s.o.matrixWorld; nm.getNormalMatrix(M);
      for(let j=0;j<s.nv;j++){ v.fromArray(pa,j*3).applyMatrix4(M); v.toArray(P,(vo+j)*3); if(na){ v.fromArray(na,j*3).applyMatrix3(nm).normalize(); v.toArray(N,(vo+j)*3); } }
      if(s.g.index){ const ia=s.g.index.array; for(let j=0;j<s.ni;j++) I[io+j]=ia[j]+vo; } else for(let j=0;j<s.ni;j++) I[io+j]=vo+j;
      vo+=s.nv; io+=s.ni; ranges.push({end:io/3,lab:s.lab,ud:s.ud}); }
    const g=new T.BufferGeometry(); g.setAttribute('position',new T.BufferAttribute(P,3)); g.setAttribute('normal',new T.BufferAttribute(N,3)); g.setIndex(new T.BufferAttribute(I,1)); g.computeBoundingSphere(); g.computeBoundingBox();
    CX.own.push(g); const m=new T.Mesh(g,mat); m.userData.ranges=ranges; (target||CX.root).add(m);
  }
  G.parent.remove(G);
  G.traverse(o=>{ if(o.isMesh&&o.geometry&&!o.geometry.__shared) o.geometry.dispose(); });
}
[G_BOX,G_CYL,G_CYL_OPEN,G_CONE,G_ROD,G_DISC,G_COIL,G_SPH,G_TRI,G_BOREW].forEach(g=>g.__shared=true);
function rangeAt(rs,f){ let lo=0,hi=rs.length-1; while(lo<hi){ const mid=(lo+hi)>>1; if(rs[mid].end>f) hi=mid; else lo=mid+1; } return rs[lo]; }

