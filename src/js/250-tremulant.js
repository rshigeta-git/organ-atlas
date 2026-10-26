/* ---------- F-02: tremulant, two types on one wind trunk feeding a single pipe ----------
   Wippfedertremulant (Bock): a small wedge bellows on top of the trunk; on its moving plate a valve is held shut by a
   weight on an arm. Wind inflates the bellows to its stop, the weight's inertia lets the valve open, wind escapes, the
   bellows falls, the weight shuts the valve, and so on. Tremblant doux: a weighted wooden flap inside the trunk
   swings in the flow and periodically throttles it; no wind escapes. Real tremulant speeds (about 4-8 per second). */
function buildTremulant(){
  const R=CX.root, m={on:true,play:true,trem:false,type:'wipp',hz:5.5,ph:0,amt:0,env:0};
  const yT=17, TH=12, TD=6, x0=-46, x1=22, zc=0;   // trunk: 12 high (as tall as the tremulant bellows), 6 deep
  // reservoir (simplified) and wind trunk
  box(R,18,yT+3,18,hollow(MAT.wood),-56,(yT+3)/2,0,LB('リザーバー（マガジンふいご）','Magazinbalg'));
  box(R,19,1.2,19,MAT.wood,-56,yT+3.6,0,LB('リザーバーの上板','Oberplatte')); box(R,8,3,8,MAT.weight,-56,yT+5.7,0,LB('おもり','Gewicht'));
  const LK=LB('風導管（リザーバーからパイプの風箱へ）','Windkanal');
  box(R,x1-x0,0.8,TD+1.6,MAT.wood,(x0+x1)/2,yT-TH/2-0.4,zc,LK); box(R,x1-x0,0.8,TD+1.6,MAT.wood,(x0+x1)/2,yT+TH/2+0.4,zc,LK);
  box(R,x1-x0,TH,0.8,MAT.wood,(x0+x1)/2,yT,zc-TD/2-0.4,LK); box(R,x1-x0,TH,0.8,MAT.wood,(x0+x1)/2,yT,zc+TD/2+0.4,LK);
  // small chest and one pipe
  box(R,12,TH+1.6,12,MAT.wood,x1+6,yT,0,LB('風箱','Windlade'));
  const sp=buildPipe(x1+6,0,2,0,0,yT+TH/2+0.8);
  const press=()=>m.env*(1-m.amt*m.dip);
  m.dip=0;
  new Vol((a,b,c,out)=>out.set(-64+a*16,1+b*(yT+1),-8+c*16),140,{state:()=>m.on?1:0,rate:2});
  new Vol((a,b,c,out)=>out.set(x1+1+a*10,yT-TH/2+b*TH,-5+c*10),90,{state:()=>m.on?1:0,rate:2});
  new Tube([V3(-47,yT,0),V3(-30,yT,0),V3(-14,yT,0),V3(0,yT,0),V3(x1+2,yT,0)],{r:2.2,density:0.6,front:200,state:()=>({open:m.on,speed:m.play?6+10*(1-m.dip*m.amt*4):0})});
  const pt=new Tube([V3(x1+6,yT+3,0),V3(x1+6,yT+TH/2+0.8,0)].concat(sp.path.slice(1)),{r:0.3,density:0.3,front:900,state:()=>({open:m.on&&m.play,speed:20})});
  pt.exitU=pt.cum[1+sp.ei]/pt.L; pt.mouthAt(sp,1);
  /* Wippfedertremulant */
  const WX=-24, WL=10, WW=5.4, yTop=yT+TD/2+0.8, wg=new T.Group(); wg.position.set(WX-WL/2,yTop,0); R.add(wg);
  // the Bock tremulant is mounted on the SIDE of the trunk: built as if on top, then turned 90° about the trunk axis
  const WPV=new T.Group(); WPV.position.set(0,yT,0); WPV.rotation.x=Math.PI/2; R.add(WPV);
  const WIP=new T.Group(); WIP.position.y=-yT; WPV.add(WIP);
  const side=(x,y,z)=>V3(x,yT-z,y-yT);
  box(WIP,WL+1,0.6,WW+1,MAT.wood,WX,yTop+0.3,0,LB('小ふいごの台（風導管の穴の上）','Balgbrett'));
  bore(WIP,MAT.dark,WX,yT+TD/2-0.6,yTop+0.6,0,1.6,LB('風導管の側面と台の穴（ここから小ふいごへ風が入る）','Luftbohrung'));
  box(wg,WL,0.5,WW,MAT.wood,WL/2,0.25,0,LB('小ふいごの上板（動く板）','Oberplatte')); wg.position.y=yTop+0.6; WIP.add(wg);
  bore(wg,MAT.dark,WL-2.8,0,0.5,0,0.9,LB('上板の穴（弁がふさぐ。開くと風が外へ逃げる）','Luftbohrung'));
  const wsides=[-1,1].map(s=>{ const t=mk(G_TRI,MAT.leather,WIP,LB('小ふいごのひだ（革）','Falten')); t.position.set(WX-WL/2,yTop+0.6,s*WW/2); return t; });
  const wfront=box(WIP,0.3,1,WW,MAT.leather,WX+WL/2,yTop+0.6,0,LB('小ふいごのひだ（革）','Falten'));
  // valve: hinged on a horizontal axis (local x = world horizontal); the flap covers the hole above the hinge, the arm
  // hangs DOWN past the edge of the bellows plate (local +z = world down) and its weight keeps the valve shut
  // bellows hangs with its hinge at the top; the valve is hinged across the plate near the lower (free) end, its flap
  // above the hinge covers the hole, and its arm runs on past the free end and hangs down with the weight
  const vh=new T.Group(); vh.position.set(WL-1.6,0.5,0); wg.add(vh);
  box(vh,2.4,0.25,2.4,MAT.leather,-1.2,0.12,0,LB('弁（上板の穴をふさぐ。開くと風が外へ逃げる）','Tremulantventil'));
  rod(vh,0.12,MAT.iron,LB('弁の腕（下へ垂れ、先におもりがある）','Ventilarm')).set(V3(0,0.25,0),V3(6,0.5,0));
  const wgt=box(vh,1.4,1.4,1.4,MAT.weight,4.5,0.5,0,LB('おもり（腕の上の位置で揺れの速さが変わる）','Gewicht'));
  const stop=box(WIP,1,6,1,MAT.woodDark,WX+WL/2-1,yTop+3.6,-WW/2-1.2,LB('ストッパー（小ふいごが上がりきる位置）','Anschlag'));
  box(WIP,1.6,0.8,WW-0.6,MAT.woodDark,WX+WL/2-1,yTop+6.8,-WW/2-1.2+WW/2,LB('ストッパー','Anschlag'));
  const WROT=new T.Group(); WROT.position.set(WX,0,0); WROT.rotation.y=-Math.PI/2; const WIN=new T.Group(); WIN.position.set(-WX,0,0);
  [...WIP.children].forEach(c=>WIN.add(c)); WROT.add(WIN); WIP.add(WROT); WPV.updateMatrixWorld(true);
  const wl=(x,y,z)=>WIN.localToWorld(V3(x,y,z));
  const esc=new Tube([wl(WX+WL/2-2.8,yTop+1.5,0),wl(WX+WL/2-2.6,yTop+4.5,0.4),wl(WX+WL/2-2.2,yTop+8.5,1.2)],{kind:'air',r:0.8,density:1.6,front:200,state:()=>({open:m.type==='wipp'&&m.trem&&m.vOpen>0.25,speed:16})});
  /* tremblant doux */
  const DX=-2, DOU=new T.Group(); R.add(DOU);
  const fl=new T.Group(); fl.position.set(DX,yT+TH/2-0.1,0); DOU.add(fl);
  box(fl,0.5,TH*0.82,TD-0.4,MAT.woodPale,0,-TH*0.41,0,LB('フラップ（おもりで重くした木の板。風の流れで開閉して風を揺らす）','Tremulantklappe'));
  const ax=mk(G_CYL,MAT.iron,DOU,LB('フラップの軸（風導管の壁を貫いて外のおもりにつながる）','Achse')); ax.rotation.x=Math.PI/2; ax.scale.set(0.25,TD+3,0.25); ax.position.set(DX,yT+TH/2-0.1,0);
  const lv=new T.Group(); lv.position.set(DX,yT+TH/2-0.1,TD/2+1.6); DOU.add(lv);
  rod(lv,0.18,MAT.iron,LB('おもりの腕','Gewichtsarm')).set(V3(0,0,0),V3(-0.5,-5,0));
  const dw=box(lv,1.5,1.5,1.5,MAT.weight,-0.5,-5,0,LB('おもり（位置で揺れの速さが変わる）','Gewicht'));
  const LBL=label=>label;
  const setVis=()=>{ WIP.visible=m.type==='wipp'; DOU.visible=m.type==='doux'; };
  setVis();
  return {
    controls:[{type:'toggle',id:'play',label:'パイプを鳴らす',get:()=>m.play,set:v=>m.play=v},
      {type:'toggle',id:'trem',label:'トレムラント',get:()=>m.trem,set:v=>m.trem=v},
      {type:'toggle',id:'wipp',label:'ヴィップフェーダー型',get:()=>m.type==='wipp',set:v=>{ m.type='wipp'; setVis(); renderControls(); }},
      {type:'toggle',id:'doux',label:'トランブラン・ドゥ',get:()=>m.type==='doux',set:v=>{ m.type='doux'; setVis(); renderControls(); }},
      {type:'range',id:'hz',label:'揺れの速さ',min:3.5,max:8,step:0.1,get:()=>m.hz,set:v=>m.hz=v,fmt:()=>TF('毎秒 {0} 回',m.hz.toFixed(1))}],
    ctl:{play:v=>m.play=v,trem:v=>m.trem=v,type:v=>{ m.type=v; setVis(); },hz:v=>m.hz=v},
    pins:[{t:'リザーバー',p:V3(-56,yT+9,0)},{t:'風導管',p:V3(-36,yT+5,4)},{t:'パイプ',p:V3(x1+6,yT+40,3)},
          {t:'小ふいご（ヴィップフェーダー型）',p:wl(WX,yTop+9,0)},{t:'フラップ（トランブラン・ドゥ）',p:V3(DX,yT+TH/2+3,-2)}],
    speaking:()=>m.on&&m.play&&m.env>0.35?[{k:0,i:2,r:0}]:[],
    update(dt){
      m.env+=((m.on?1:0)-m.env)*Math.min(1,dt*4);
      m.amt+=((m.trem&&m.play?1:0)-m.amt)*Math.min(1,dt*3);
      if(m.trem) m.ph+=dt*2*Math.PI*m.hz*(m.type==='doux'?1:1);
      const c=Math.cos(m.ph), s=Math.sin(m.ph);
      if(m.type==='wipp'){
        const th=m.trem?0.11+0.1*s:0.0; wg.rotation.z=th;
        const h=WL*Math.sin(th); wsides.forEach(t=>t.scale.set(WL*Math.cos(th),Math.max(0.01,h),1));
        wfront.scale.y=Math.max(0.05,h); wfront.position.set(WX-WL/2+WL*Math.cos(th),yTop+0.6+h/2,0);
        m.vOpen=m.trem?Math.max(0,-c):0; vh.rotation.z=-0.75*m.vOpen;
        m.dip=0.11*Math.max(0,-c)+0.03;
        wgt.position.x=2.6+(8-m.hz)*0.75; 
      } else {
        fl.rotation.z=(m.trem?0.42+0.25*s:1.3); lv.rotation.z=fl.rotation.z;
        m.dip=0.035*(0.5+0.5*s)+0.01; m.vOpen=0;
        dw.position.y=-3.2-(8-m.hz)*0.6;
      }
      S.p=75*press();
    }
  };
}

