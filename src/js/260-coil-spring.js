/* ---------- shared: coil spring (helix built at its free length, scaled along its axis) ---------- */
function helixGeo(r,turns,L0,w){ const pts=[], N=turns*16; for(let i=0;i<=N;i++){ const a=i/16*2*Math.PI; pts.push(V3(r*Math.cos(a),L0*i/N,r*Math.sin(a))); } const g=new T.TubeGeometry(new T.CatmullRomCurve3(pts),N*2,w,5,false); CX.own.push(g); return g; }

