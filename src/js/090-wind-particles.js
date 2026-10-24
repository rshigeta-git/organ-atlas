/* ---------------- wind particles ---------------- */
const flows=[];
const MAXP=60000;
const pGeo=new T.BufferGeometry();
const pAttr=new T.BufferAttribute(new Float32Array(MAXP*3),3); pAttr.setUsage(T.DynamicDrawUsage);
const cAttr=new T.BufferAttribute(new Float32Array(MAXP*3),3); cAttr.setUsage(T.DynamicDrawUsage);
pGeo.setAttribute('position',pAttr); pGeo.setAttribute('color',cAttr);
const dc=document.createElement('canvas'); dc.width=dc.height=64; const g2=dc.getContext('2d');
const gr=g2.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.5,'rgba(255,255,255,.9)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g2.fillStyle=gr; g2.fillRect(0,0,64,64);
const pMat=new T.PointsMaterial({size:1.8,map:new T.CanvasTexture(dc),vertexColors:true,transparent:true,depthWrite:false,sizeAttenuation:true});
const points=new T.Points(pGeo,pMat); points.frustumCulled=false; scene.add(points);


