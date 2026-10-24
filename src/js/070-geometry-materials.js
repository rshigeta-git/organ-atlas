/* ---------------- shared geometry & materials ---------------- */
const G_BOX=new T.BoxGeometry(1,1,1);
const G_CYL=new T.CylinderGeometry(1,1,1,20);
const G_CYL_OPEN=new T.CylinderGeometry(1,1,1,20,1,true);
const G_CONE=new T.CylinderGeometry(1,0.18,1,20,1,true);
const G_ROD=new T.CylinderGeometry(1,1,1,7);
const G_DISC=new T.CircleGeometry(1,20);
const G_COIL=new T.TorusGeometry(0.45,0.075,6,18);
const G_SPH=new T.SphereGeometry(1,10,8);
const G_TRI=new T.BufferGeometry(); G_TRI.setAttribute('position',new T.Float32BufferAttribute([0,0,0,1,0,0,1,1,0],3)); G_TRI.computeVertexNormals();
function std(c,ro,me,x){ return new T.MeshStandardMaterial(Object.assign({color:c,roughness:ro,metalness:me},x||{})); }
const MAT={
  wood:std(0xb98b5c,.78,0), woodDark:std(0x8a6340,.8,0), woodPale:std(0xd8bb8f,.7,0), leather:std(0xcdae86,.92,0,{side:T.DoubleSide}),
  metal:std(0xd9dde0,.42,.18,{side:T.DoubleSide}), metalDark:std(0xa3aab0,.5,.2), iron:std(0x4f555b,.5,.45), dark:std(0x18191b,.9,0,{side:T.DoubleSide}),
  casing:std(0x6d7d89,.55,.25), ivory:std(0xf0ebe0,.45,0), ebony:std(0x2a2522,.5,0), brass:std(0xb8913f,.35,.65),
  weight:std(0x3a3e43,.6,.4), pipeWood:std(0xa9784a,.7,0), curtain:std(0x3f5566,.9,0,{side:T.DoubleSide}), cord:std(0x5b4a36,.9,0), pipeWoodLight:std(0xc9a172,.7,0), cloth:std(0x9a8f7c,.95,0,{side:T.DoubleSide}),
  oak:std(0x5c3b22,.72,0), gilt:std(0xe0b45a,.42,.35,{side:T.DoubleSide}), paint:std(0x3a4f3f,.8,0)
};
const XRAY=[MAT.wood,MAT.woodDark,MAT.leather,MAT.casing,MAT.cloth,MAT.oak,MAT.gilt,MAT.paint];

let CX=null;
function mclone(m){ const c=m.clone(); CX.own.push(c); return c; }
function keyMat(k){ return CX.keyMats[k]||(CX.keyMats[k]=mclone(MAT.woodPale)); }
function stopMat(i){ return CX.stopMats[i]||(CX.stopMats[i]=mclone(MAT.woodPale)); }
function mk(geo,mat,parent,label){ const m=new T.Mesh(geo,mat); (parent||CX.root).add(m); if(label) m.userData.label=label; return m; }
function box(p,w,h,d,mat,x,y,z,label){ const m=mk(G_BOX,mat,p,label); m.scale.set(w,h,d); m.position.set(x,y,z); return m; }
function cyl(p,r,h,mat,x,y,z,label,geo){ const m=mk(geo||G_CYL,mat,p,label); m.scale.set(r,h,r); m.position.set(x,y,z); return m; }
const UP=V3(0,1,0), _d=V3(0,0,0), _v=V3(0,0,0), _c=new T.Color();
function rod(p,r,mat,label){ const m=mk(G_ROD,mat,p,label); m.set=function(a,b){ _d.subVectors(b,a); const L=_d.length()||1e-4; m.position.copy(a).addScaledVector(_d,.5); m.scale.set(r,L,r); m.quaternion.setFromUnitVectors(UP,_d.divideScalar(L)); }; return m; }
function plank(p,sx,sz,mat,label){ const m=mk(G_BOX,mat,p,label); m.set=function(a,b){ _d.subVectors(b,a); const L=_d.length()||1e-4; m.position.copy(a).addScaledVector(_d,.5); m.scale.set(sx,L,sz); m.quaternion.setFromUnitVectors(UP,_d.divideScalar(L)); }; return m; }
function duct(pts,s,mat,label){ for(let i=1;i<pts.length;i++){ const a=pts[i-1],b=pts[i]; const m=mk(G_BOX,mat,CX.root,label); const L=a.distanceTo(b); m.position.addVectors(a,b).multiplyScalar(.5); m.scale.set(s,s,L+s); m.lookAt(b); } }
