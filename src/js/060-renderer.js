/* ---------------- renderer ---------------- */
const canvas=document.getElementById('stage');
let renderer;
try{ renderer=new T.WebGLRenderer({canvas,antialias:true}); }catch(e){ wrap.insertAdjacentHTML('beforeend','<div class="nogl">このブラウザではWebGL（3D表示）が使えません。</div>'); return; }
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
const scene=new T.Scene();
const camera=new T.PerspectiveCamera(36,1,1,4000);
const controls=new T.OrbitControls(camera,canvas);
controls.enableDamping=true; controls.dampingFactor=0.08; controls.minDistance=15; controls.maxDistance=700;
scene.add(new T.HemisphereLight(0xffffff,0x56606b,0.9));
const dl=new T.DirectionalLight(0xffffff,0.8); dl.position.set(80,160,120); scene.add(dl);
const dl2=new T.DirectionalLight(0xdfe8ff,0.35); dl2.position.set(-140,60,-90); scene.add(dl2);
const grid=new T.GridHelper(520,52); grid.material.vertexColors=false; grid.material.transparent=true; grid.material.opacity=0.5; scene.add(grid);
const clipPlane=new T.Plane(V3(-1,0,0),1e5);
renderer.clippingPlanes=[clipPlane];
function resize(){ const w=wrap.clientWidth||600,h=wrap.clientHeight||400; renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); }
new ResizeObserver(resize).observe(wrap); resize();

const COL={ctrl:new T.Color(),wind:new T.Color(),air:new T.Color(),sound:new T.Color(),key:new T.Color(),stop:new T.Color()};
function readTheme(){
  const cs=getComputedStyle(document.documentElement); const g=n=>(cs.getPropertyValue(n)||'').trim()||'#888888';
  COL.wind.set(g('--wind')); COL.ctrl.set(g('--ctrl')); COL.air.set(g('--air')); COL.sound.set(g('--sound')); COL.key.set(g('--keyglow')); COL.stop.set(g('--stopc'));
  scene.background=new T.Color(g('--stage')); grid.material.color.set(g('--gridc')); grid.material.needsUpdate=true;
}
readTheme();
try{ matchMedia('(prefers-color-scheme: dark)').addEventListener('change',readTheme); }catch(e){}
new MutationObserver(readTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

