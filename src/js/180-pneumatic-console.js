/* ================= Stage 2: pneumatic chests and actions, swell box ================= */
MAT.lead=std(0x7c8289,.55,.35);
const G_KEGEL=new T.CylinderGeometry(1.05,0.32,1.5,18);
const TUBE_LEG='<span><i style="background:var(--lead)"></i>鍵の信号の風（弁箱 B から鉛管を通って小ふいご A へ）</span><span><i style="background:var(--ctrl)"></i>リレーの風（小ふいご E・G を動かす）</span>';
const CTRL_LEG='<span><i style="background:var(--ctrl)"></i>制御風（鍵の信号を伝える風）</span>';

