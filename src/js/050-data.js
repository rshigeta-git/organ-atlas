/* ---------------- data ---------------- */
const STOPS=[
  {name:'Gedackt 8′',   ja:'ゲダクト（木管・閉管）'},
  {name:'Rohrflöte 4′', ja:'ロールフレーテ（半閉管）'},
  {name:'Prinzipal 2′', ja:'プリンツィパル（開管）'},
  {name:'Mixtur III',   ja:'ミクスチュア 3列'},
  {name:'Vox humana 8′',ja:'ヴォックス・フマーナ（リード）'},
  {name:'Prinzipal 8′',ja:'プリンツィパル 8′（開管）'},{name:'Octave 4′',ja:'オクターヴ 4′'},{name:'Quinte 2 2/3′',ja:'クヴィンテ 2 2/3′'},{name:'Octave 2′',ja:'オクターヴ 2′'},{name:'Trompete 8′',ja:'トロンペーテ（リード）'},{name:'Blockflöte 2′',ja:'ブロックフレーテ（広い開管）'},{name:'Subbass 16′',ja:'ズブバス（木管・閉管）'},{name:'Posaune 16′',ja:'ポザウネ（リード）'},
  {name:'Rohrflöte 8′',ja:'ロールフレーテ 8′（半閉管）'},{name:'Hohlflöte 4′',ja:'ホールフレーテ（広い開管）'},{name:'Sesquialtera II',ja:'セスキアルテラ 2列'},{name:'Choralbass 4′',ja:'コラールバス（開管）'},
  {name:'Blockflöte 4′',ja:'ブロックフレーテ 4′（広い開管）'},{name:'Cymbel II',ja:'ツィンベル 2列（高いミクスチュア）'},{name:'Krummhorn 8′',ja:'クルムホルン（リード。短い円筒の共鳴管）'},
  {name:'Principal 8′',ja:'プリンツィパル 8′（開管）'},{name:'Aeoline 8′',ja:'エオリーネ（ごく細い開管。柔らかい弦の音）'},{name:'Viola di Gamba 8′',ja:'ヴィオラ・ダ・ガンバ（細い開管。弦の音）'},
  {name:'Dolce 4′',ja:'ドルチェ 4′（細い開管。柔らかい音）'},{name:'Geigenprinzipal 8′',ja:'ガイゲンプリンツィパル（やや細いプリンツィパル）'},{name:'Gamba 8′',ja:'ガンバ（細い開管。弦の音）'},
  {name:'Salicional 8′',ja:'サリツィオナール（細い開管。柔らかい弦の音）'},{name:'Vox coelestis 8′',ja:'ヴォックス・チェレスティス（少し高く調律した弦。うなりが出る）'},{name:'Traversflöte 4′',ja:'トラヴェルスフレーテ 4′（開管のフルート）'},
  {name:'Flûte harmonique 8′',ja:'フリュート・アルモニック（倍音管のフルート。この音域では普通の開管）'},{name:'Gambe 8′',ja:'ガンブ（細い開管。弦の音）'},{name:'Voix céleste 8′',ja:'ヴォワ・セレスト（少し高く調律した弦。うなりが出る）'},
  {name:'Flûte octaviante 4′',ja:'フリュート・オクタヴィアント 4′（倍音管のフルート。この音域では普通の開管）'},{name:'Hautbois 8′',ja:'オーボエ（リード。上が広がった円すいの共鳴管）'}
];
const ZROW=[0,7,14,-7,-14];          // z of each stop row (front of chest = +z)
const MIXZ=[-2.6,0,2.6];
const KEYNAMES=(()=>{ const b=['C','Cis','D','Dis','E','F','Fis','G','Gis','A','B','H'], sf=['','','′','″','‴','⁗'], o=[]; for(let k=0;k<64;k++){ const v=Math.floor(k/12), n=b[k%12]; o.push(v===0?n:n.toLowerCase()+sf[v]); } return o; })();
/* Pipe dimensions. Model scale: 1 unit = 7.8 mm (a natural key is 3 units = 23.4 mm). Pipes are drawn at a uniform 45 % of real size,
   lengths and diameters alike, so every pipe keeps its true proportions while fitting the 39 mm channel pitch.
   Real values at C (×2^(-k/12) per semitone); diameters by normal scaling (Töpfer: 8′ C open = 155.5 mm, halving on the 16th semitone). */
const MM=1/7.8; let SC=0.45, FLUE_NA=56;  // every pipe drawn at 45 % of real size, length and diameter alike
const PIPE={
  0:{body:1100},                          // Gedackt 8′, wood, stopped (~1/4 wavelength, wide scale shortens it)
  1:{body:560,chim:0.25,semi:12+3,mw:2/9,cut:1/3,ears:true},  // Rohrflöte 4′, half-stopped with chimney; 3 semitones narrower than normal
  2:{body:592,semi:24,mw:1/4,cut:1/4},  // Prinzipal 2′, open
  3:{body:[394,296,197],semi:[31,36,43],mw:1/4,cut:1/4}, // Mixtur III: 1 1/3′, 1′, 2/3′
  4:{body:305},                           // Vox humana 8′: short cylindrical resonator, about 1/8 length
  5:{body:2368,semi:0,mw:1/4,cut:1/4},  // Prinzipal 8′
  6:{body:1184,semi:12,mw:1/4,cut:1/4}, // Octave 4′
  7:{body:789,semi:19,mw:1/4,cut:1/4},  // Quinte 2 2/3′
  8:{body:592,semi:24,mw:1/4,cut:1/4},  // Octave 2′
  9:{body:2130},                        // Trompete 8′: full-length conical resonator
  10:{body:575,semi:19,mw:2/9,cut:1/3}, // Blockflöte 2′: wide open flute
  11:{body:2200},                       // Subbass 16′: wood, stopped (about 190 × 235 mm at C)
  12:{body:3800},                       // Posaune 16′: full-length conical resonator
  13:{body:1120,chim:0.25,semi:3,mw:2/9,cut:1/3,ears:true},   // Rohrflöte 8′, half-stopped with chimney
  14:{body:1150,semi:8,mw:2/9,cut:1/3},  // Hohlflöte 4′: wide open flute, 4 semitones wider than normal
  15:{body:[789,474],semi:[21,30],mw:1/4,cut:1/4}, // Sesquialtera II: 2 2/3′ and 1 3/5′
  16:{body:1184,semi:12,mw:1/4,cut:1/4}, // Choralbass 4′: open, principal scale
  17:{body:1150,semi:8,mw:2/9,cut:1/3},   // Blockflöte 4′: wide open flute
  18:{body:[148,99],semi:[48,55],mw:1/4,cut:1/4}, // Cymbel II: 1/2′ and 1/3′ (no breaks within C–c′)
  19:{body:1150,reed:{t:'cyl',r:1.3}},   // Krummhorn 8′: cylindrical resonator of about half length
  20:{body:2368,semi:0,mw:1/4,cut:1/4},  // Principal 8′
  21:{body:2368,semi:14,mw:1/5,cut:1/5,ears:true},  // Aeoline 8′: very narrow, low mouth
  22:{body:2368,semi:8,mw:1/5,cut:1/5,ears:true},   // Viola di Gamba 8′
  23:{body:1184,semi:15,mw:1/4,cut:1/4},  // Dolce 4′: narrow open
  24:{body:2368,semi:4,mw:1/4,cut:1/4,ears:true},   // Geigenprinzipal 8′: a little narrower than a principal
  25:{body:2368,semi:8,mw:1/5,cut:1/5,ears:true},   // Gamba 8′
  26:{body:2368,semi:10,mw:1/5,cut:1/5,ears:true},  // Salicional 8′
  27:{body:2368,semi:10,mw:1/5,cut:1/5,ears:true,celeste:true},  // Vox coelestis 8′: tuned a little sharp
  28:{body:1184,semi:10,mw:2/9,cut:1/3},  // Traversflöte 4′ (harmonic only higher up)
  29:{body:2368,semi:1,mw:2/9,cut:1/3},   // Flûte harmonique 8′ (harmonic only from about f° up: in C–c′ an open flute)
  30:{body:2368,semi:8,mw:1/5,cut:1/5,ears:true},   // Gambe 8′
  31:{body:2368,semi:9,mw:1/5,cut:1/5,ears:true,celeste:true},   // Voix céleste 8′
  32:{body:1184,semi:9,mw:2/9,cut:1/3},   // Flûte octaviante 4′ (harmonic only higher up)
  33:{body:2150,reed:{t:'cone',rt:2.2,bell:1.6}}   // Hautbois 8′: conical resonator with a flared top
};
// number of ranks of a stop (mixtures have several)
const nRanks=i=>Array.isArray(PIPE[i].body)?PIPE[i].body.length:1;
// the stops of the current model's five stop slots (default: the first five); set when a model is loaded
let STOPSET=[0,1,2,3,4];
const stopOf=i=>STOPS[STOPSET[i]];
// width (x) and depth (z) a pipe of stop si takes on the chest at key k, at the drawing scale
function pipeFoot(si,k){
  const F=SC/0.45, P=PIPE[si];
  if(si===0||si===11){ const f=Math.pow(2,-k/16)*SC*MM, cap=F<1.5; return si===11?[190*f,235*f]:[cap?Math.min(4.4,110*f):110*f,cap?Math.min(6.2,135*f):135*f]; }
  if(si===9||si===12){ const r=(si===12?5.77:3.17)*F*Math.pow(2,-k/24); return [2*r,2*r]; }
  if(si===4) return [2.3*F,2.3*F];
  if(P.reed) return P.reed.t==='cyl'?[2*Math.max(P.reed.r,1.15)*F,2*Math.max(P.reed.r,1.15)*F]:[2*P.reed.rt*P.reed.bell*F*Math.pow(2,-k/24),2*P.reed.rt*P.reed.bell*F*Math.pow(2,-k/24)];
  const n=nRanks(si); let w=0,d=1.2*(n-1); for(let r=0;r<n;r++){ w=Math.max(w,2*pipeR(si,k,r)); d+=2*pipeR(si,k,r); } return [w,d];
}
// channel pitch and stop rows (z of each slot; slot 2 in front, 4 at the back, as ZROW) that the pipes of SI need
const pitchFor=SI=>Math.max(5,Math.max(...SI.map(si=>pipeFoot(si,0)[0]))+0.6);
function rowsFor(SI,gap=1.2,minStep=7){ const O=[4,3,0,1,2], d=SI.map(si=>pipeFoot(si,0)[1]), out=[]; let z=0, prev=null;
  const pos=[]; for(const i of O){ if(prev!=null) z+=Math.max(minStep,(d[prev]+d[i])/2+gap); pos.push([i,z]); prev=i; }
  const mid=(pos[0][1]+pos[pos.length-1][1])/2; for(const [i,zz] of pos) out[i]=zz-mid; return out; }
// z offsets of the ranks of a multi-rank stop at key k
function rankZ(si,k){ const n=nRanks(si); if(n<2) return [0]; const rr=[...Array(n).keys()].map(r=>pipeR(si,k,r)); let c=-pipeFoot(si,k)[1]/2; return rr.map(v=>{ const m=c+v; c+=2*v+1.2; return m; }); }
const bodyLen=(i,k,r)=>{ const b=PIPE[i].body; return (Array.isArray(b)?b[r]:b)*Math.pow(2,-k/12)*SC*MM; };
const pipeR=(i,k,r)=>{ const sm=PIPE[i].semi, s0=Array.isArray(sm)?sm[r]:sm; return 155.5*Math.pow(2,-(s0+k)/16)*SC*MM/2; };
/* pointed-arch outline of a flattened lip: half-width at height y above its base, for a lip of height H and half-width a */
function archHW(y,H,a){ if(y<=0) return a; if(y>=H) return 0; const r=(H*H+a*a)/(2*a); return Math.max(0,Math.sqrt(r*r-y*y)-(r-a)); }
/* metal flue pipe with a true mouth: body and foot flattened at the front into upper and lower lips, mouth cut between them */
function flueGeos(Rb,footH,toeR,bodyL,mw,cut,gOv){
  const w=Math.min(1.9*Rb,mw*2*Math.PI*Rb), a=w/2, phi=Math.asin(a/Rb), hc=w*cut, HU=w*0.8, HL=w*0.95;
  let ang=[]; const NA=FLUE_NA; for(let j=0;j<NA;j++) ang.push(j/NA*2*Math.PI-Math.PI); ang.push(-phi,phi); ang=[...new Set(ang.map(v=>+v.toFixed(5)))].sort((p,q)=>p-q); ang.push(ang[0]+2*Math.PI);
  function strip(ys,radAt,hwAt,skip){
    const P=[],I=[],nA=ang.length;
    for(const y of ys){ const Rr=radAt(y), hw=hwAt(y); for(const t of ang){ const x=Rr*Math.sin(t); let z=Rr*Math.cos(t); if(z>0&&Math.abs(x)<hw) z=Math.sqrt(Math.max(0,Rr*Rr-hw*hw)); P.push(x,y,z); } }
    for(let i=0;i<ys.length-1;i++) for(let j=0;j<nA-1;j++){
      const tm=(ang[j]+ang[j+1])/2; if(skip&&skip(ys[i],ys[i+1],tm)) continue;
      const a0=i*nA+j, a1=a0+1, b0=a0+nA, b1=b0+1; I.push(a0,b0,a1, a1,b0,b1);
    }
    const g=new T.BufferGeometry(); g.setAttribute('position',new T.Float32BufferAttribute(P,3)); g.setIndex(I); g.computeVertexNormals(); return g;
  }
  const by=[0,hc*0.5,hc]; for(let i=1;i<=10;i++) by.push(hc+HU*i/10); by.push(Math.max(hc+HU+0.5,bodyL));
  const body=strip(by,()=>Rb,y=>y<=hc+1e-6?a:archHW(y-hc,HU,a),(y0,y1,t)=>y1<=hc+1e-6&&Math.abs(t)<phi-1e-4);
  const fy=[-footH]; const lo=Math.min(HL,footH*0.9); for(let i=0;i<=10;i++) fy.push(-lo+lo*i/10);
  const rc=y=>toeR+(Rb-toeR)*(y+footH)/footH;
  const foot=strip(fy,rc,y=>{ const hw=archHW(-y,lo,a); return Math.min(hw,rc(y)*0.98); },null);
  const d=Math.sqrt(Rb*Rb-a*a), g=gOv||Math.max(0.05,Rb*0.06);
  const sh=new T.Shape(), pL=Math.acos(clamp((d-g)/Rb,-1,1));
  for(let j=0;j<=40;j++){ const t=pL+(2*Math.PI-2*pL)*j/40; const x=Rb*0.985*Math.sin(t), z=Rb*0.985*Math.cos(t); if(j===0) sh.moveTo(x,-z); else sh.lineTo(x,-z); }
  sh.closePath();
  const lang=new T.ShapeGeometry(sh); lang.rotateX(-Math.PI/2);
  return {body,foot,lang,w,hc,d,HU,sh};
}

const S={key:new Array(64).fill(false),kd:new Float32Array(64),stop:[false,false,false,false,false],sp:new Float32Array(5),p:75,latch:false,speed:1,xray:false,cut:0,time:0};

