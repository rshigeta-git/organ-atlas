/* ================= Stage 2: pneumatic chests and actions, swell box ================= */
MAT.lead=std(0x7c8289,.55,.35);
const G_KEGEL=new T.CylinderGeometry(1.05,0.32,1.5,18);
const CTRL_LEG='<span><i style="background:var(--ctrl)"></i>制御風（鍵の信号を伝える風）</span>';
function leadTube(pts,label){ for(let i=1;i<pts.length;i++) rod(CX.root,0.3,MAT.lead,label).set(pts[i-1],pts[i]); }
/* console with a key-valve box: each key pulls open a small valve that lets wind into its lead tube */
function buildPneuConsole(o){
  const R=CX.root, kb=buildKeyboard({x:0,y:o.y,z:o.z});
  box(R,30,8.5,61,MAT.woodDark,0,o.y-7.75,o.z-28.5,LB('演奏台（コンソール）の台','Spieltisch'));
  const zA=o.z-KATT, yV=o.y+KH+5;
  box(R,27,3.2,4.2,MAT.wood,0,yV+1.6,zA,LB('鍵の弁箱（鍵ごとの小さな弁が、導管への制御風を開け閉めする）','Spielventilkasten'));
  duct([V3(-13.5,yV+1.6,zA),V3(-20,yV+1.6,zA),V3(-20,o.y-12,zA)],1.8,MAT.casing,LB('弁箱への風の供給','Windzufuhr'));
  const trs=[], vs=[];
  for(let k=0;k<13;k++){ trs.push(makeTracker(keyMat(k),LB('弁を引く線（鍵が下がると弁が開く）','Ventilabzug'))); vs.push(box(R,1.3,0.35,1.6,keyMat(k),kb.kx(k),yV+0.25,zA,LB('鍵の弁','Spielventil'))); }
  return {kb,outlet:k=>V3(kb.kx(k),yV+3.2,zA),zA,yV,
    update(){ kb.update(); for(let k=0;k<13;k++){ trs[k].set(V3(kb.kx(k),yV,zA),kb.attach(k),KH); vs[k].position.y=yV+0.25-0.45*S.kd[k]; } }};
}
function pathLen(p){ let L=0; for(let i=1;i<p.length;i++) L+=p[i].distanceTo(p[i-1]); return L; }

