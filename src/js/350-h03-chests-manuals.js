/* ================= H-03: two manuals and pedal, real scale =================
   Everything at 1 : 1 (1 unit = 7.8 mm), pipes included. Hauptwerk (II) high in the case, Positiv (I) below it behind the
   Hauptwerk action, pedal towers C-side left and Cis-side right. Suspended actions, roller boards, backfall couplers,
   slider chests with C/Cis layout (basses outside), mechanical stop action, four wedge bellows, Wippfeder tremulant,
   cymbelstern. */
const NATS=[0,2,4,5,7,9,11];
const isNat=k=>NATS.includes(k%12);
const natIdx=k=>Math.floor(k/12)*7+NATS.filter(v=>v<k%12).length;
const keyX=(k,nN,p)=>(isNat(k)?natIdx(k):natIdx(k)-0.5)*p-(nN-1)/2*p;
const H3MM=v=>v/7.8;
/* channel layout: widths from the widest pipe of the note, C-side (even notes) left from the outside in, Cis-side right */
function h3Layout(ks,wfn,x0){
  const w={}, xs={}; for(const k of ks){ const d=wfn(k); w[k]=H3MM(Math.max(18,d+Math.max(8,0.1*d))); }
  const ev=ks.filter(k=>k%2===0), od=ks.filter(k=>k%2===1);
  const L=ev.reduce((s,k)=>s+w[k],0), R=od.reduce((s,k)=>s+w[k],0);
  let x=x0-L; for(const k of ev){ xs[k]=x+w[k]/2; x+=w[k]; }
  x=x0+R; for(const k of od){ xs[k]=x-w[k]/2; x-=w[k]; }
  return {w,xs,L,R};
}
/* one tower chest: notes of one side laid out with the largest pipe at the outer side */
function h3TowerLayout(ks,wfn,xc,outerLeft){
  const w={}, xs={}; let tot=0; for(const k of ks){ const d=wfn(k); w[k]=H3MM(Math.max(18,d+Math.max(8,0.1*d))); tot+=w[k]; }
  let x=outerLeft?xc-tot/2:xc+tot/2; for(const k of ks){ if(outerLeft){ xs[k]=x+w[k]/2; x+=w[k]; } else { xs[k]=x-w[k]/2; x-=w[k]; } }
  return {w,xs,W:tot};
}
/* depth of a stop row (largest pipe of the row, front to back) */
function h3RowDepth(si,k){
  const F=SC/0.45;
  if(si===0) return 135*Math.pow(2,-k/16)*MM; if(si===11) return 235*Math.pow(2,-k/16)*MM;
  if(si===9) return 2*3.17*F*Math.pow(2,-k/24); if(si===12) return 2*5.77*F*Math.pow(2,-k/24);
  if(si===4) return 2*1.15*F;
  if(si===3) return 2*(pipeR(3,k,0)+pipeR(3,k,1)+pipeR(3,k,2))+2.4;
  return 2*pipeR(si,k,0);
}
function h3Rows(stops,k0,zF){ const out=[]; let z=zF-3; for(const si of stops){ const d=h3RowDepth(si,k0)+2.2; z-=d/2; let mz=null;
    if(si===3){ const r0=pipeR(3,k0,0),r1=pipeR(3,k0,1),r2=pipeR(3,k0,2); mz=[-(r0+r1+1.2),0,r1+r2+1.2]; }
    out.push({si,z,d,mz}); z-=d/2; } return out; }

function buildChestR(o,ST){
  const ks=o.ks, X=o.xs, Wd=o.ws, oy=o.y, zF=o.zF, rows=o.rows, NS=rows.length, KD=o.KD, SP=o.SP, Lp=o.Lp||38, F=SC/0.45;
  const hb=13, hc=12, tb=1.5, sl=1, ub=4.5, yCh=oy+hb, yT=yCh+hc, yS=yT+tb, yU=yS+sl, base=yU+ub;
  let xL=1e9,xR=-1e9; for(const k of ks){ xL=Math.min(xL,X[k]-Wd[k]/2); xR=Math.max(xR,X[k]+Wd[k]/2); }
  const W=xR-xL, cx=(xL+xR)/2, zB=Math.min(...rows.map(r=>r.z-r.d/2))-2, D=zF-zB, zc=(zF+zB)/2;
  const zPd=zF-3.5, zH=zPd-(Lp-2), zPB=zH-4;
  const C={xL,xR,W,cx,oy,zF,zB,zPd,zPB,base,yS,top:0,tubes:[],chanFlow:{},nm:o.name,inlet:V3(cx,oy+hb/2,zPB),tops:{},rows,slEnd:o.slDir<0?xL-15:xR+15};
  const nmS=o.name;
  const L1=LB('パレットボックス（'+nmS+'の風箱の下部。常に風で満たされている）','Windkasten');
  box(ST,W+2,1,zF-zPB,MAT.wood,cx,oy+0.5,(zF+zPB)/2,L1);
  box(ST,W+2,hb-1,1,MAT.wood,cx,oy+1+(hb-1)/2,zF-0.5,LB('パレットボックスの前板（点検のため外せる）','Spund'));
  box(ST,W+2,hb-1,1,MAT.wood,cx,oy+1+(hb-1)/2,zPB+0.5,L1);
  for(const xx of [xL-0.5,xR+0.5]) box(ST,1,hb-1,zF-zPB,MAT.wood,xx,oy+1+(hb-1)/2,(zF+zPB)/2,L1);
  box(ST,W+2,1,zPB-zB,MAT.wood,cx,yCh-0.5,(zPB+zB)/2,LB('チャンネルの底板','Rahmen'));
  const LC=LB('チャンネルの仕切り（鍵ごとの部屋＝トーンチャンネルを分ける）','Schied');
  const edges=new Set(); for(const k of ks){ edges.add((X[k]-Wd[k]/2).toFixed(2)); edges.add((X[k]+Wd[k]/2).toFixed(2)); }
  for(const e of edges) box(ST,0.9,hc,D,MAT.woodDark,+e,yCh+hc/2,zc,LC);
  box(ST,W+1,hc,1.2,MAT.woodDark,cx,yCh+hc/2,zF-0.6,LC); box(ST,W+1,hc,1.2,MAT.woodDark,cx,yCh+hc/2,zB+0.6,LC);
  box(ST,W+2,tb,D,MAT.wood,cx,yT+tb/2,zc,LB('テーブル（チャンネルの天板。パイプごとに穴がある）','Fundamentbrett'));
  // sliders (moving groups with their holes), dams, upper boards
  const sw=rows.map(r=>Math.min(6,r.d*0.5)), sg=[], holeMats=[];
  const order=rows.map((r,i)=>i).sort((a,b)=>rows[b].z-rows[a].z);
  let zPrev=zF; for(const i of order){ const zf=rows[i].z+sw[i]/2; if(zPrev-zf>0.05) box(ST,W+2,sl,zPrev-zf,MAT.wood,cx,yS+sl/2,(zPrev+zf)/2,LB('ダム（スライダーの間の固定材）','Damm')); zPrev=rows[i].z-sw[i]/2; }
  if(zPrev-zB>0.05) box(ST,W+2,sl,zPrev-zB,MAT.wood,cx,yS+sl/2,(zPrev+zB)/2,LB('ダム（スライダーの間の固定材）','Damm'));
  rows.forEach((r,i)=>{
    const st=STOPS[r.si], G=new T.Group(); CX.root.add(G); sg.push(G);
    box(G,W+16,sl,sw[i],MAT.woodPale,cx+o.slDir*7,yS+sl/2,r.z,LB('スライダー：'+st.name+'（左右に動いて穴を合わせる）','Schleife'));
    const hm=mclone(MAT.dark); holeMats.push(hm); const TG=new T.Group(); G.add(TG);
    for(const k of ks){ const nr=r.si===3?3:1; for(let q=0;q<nr;q++){ const dd=mk(G_DISC,hm,TG,LB('スライダーの穴','Schleifenbohrung')); dd.rotation.x=-Math.PI/2; const s=r.si===3?0.55:Math.min(0.9,0.35+Wd[k]*0.08); dd.scale.set(s,s,s); dd.position.set(X[k],yS+sl+0.03,r.z+(r.mz?r.mz[q]:0));
      const zz=r.z+(r.mz?r.mz[q]:0), br=s*0.92; bore(TG,hm,X[k],yS,yS+sl,zz,br,LB('スライダーの穴','Schleifenbohrung'),false); bore(ST,hm,X[k],yT,yT+tb,zz,br,LB('テーブルの穴（トーンチャンネルからスライダーへ風が通る）','Kanzellenbohrung')); bore(ST,hm,X[k],yU,yU+ub,zz,br,LB('上板の穴（スライダーからパイプの足へ風が通る）','Stockbohrung')); } }
    mergeStatic(TG,G);
    box(ST,W+1,ub,r.d-0.15,MAT.wood,cx,yU+ub/2,r.z,LB('上板：'+st.name+'（パイプを立てる台）','Pfeifenstock'));
  });
  // pallets, pull-down wires, springs (pooled), guide pins and purses (fixed)
  const PL={}, pw={};
  for(const k of ks){
    const x=X[k]; pw[k]=Math.max(1.0,Math.min(Wd[k]-1.7,12));
    PL[k]={pal:CX.pool.add(G_BOX,MAT.woodPale,LB('パレット（'+KEYNAMES[k]+'の弁。押鍵で下に開く）','Spielventil'),o.ud(k)),
      wire:prod(MAT.metalDark,0.1,LB('引き下げ線（パレットの前端から底板を貫いて下へ出る）','Abzugsdraht'),o.ud(k)),
      eye:pnut(MAT.brass,0.3,0.5,LB('パレットの目金（引き下げ線を掛ける）','Ventilöse'),o.ud(k)),
      spr:prod(MAT.brass,0.075,LB('パレットばね（パレットを押し上げて閉じる）','Ventilfeder'))};
    const purse=mk(G_CONE,MAT.leather,ST,LB('パルペーテ（引き下げ線が底板を通る穴をふさぐ革袋）','Pulpete')); purse.scale.set(0.75,1.1,0.75); purse.position.set(x,oy-0.55,zPd);
    const sx=pw[k]/2+0.3;
    for(const s of [-1,1]) rod(ST,0.1,MAT.brass,LB('パレットのガイドピン','Ventilführungsstift')).set(V3(x+s*sx,yCh,zPd+0.8),V3(x+s*sx,yCh-3.6,zPd+0.8));
  }
  box(ST,W,1,1.4,MAT.woodDark,cx,oy+1.5,zH+(Lp-2)*0.55,LB('ばね受けの桟','Federleiste'));
  C.vol=new Vol((a,b,c,out)=>out.set(xL+1+a*(W-2),oy+1.5+b*(hb-3.5),zPB+1+c*(zF-zPB-2)),o.volN||420,{state:()=>(S.p>4&&(!o.feed||o.feed.full()))?clamp(0.35+0.65*S.p/75,0,1):0});
  C.chan={};
  for(const k of ks){
    const x=X[k], rr=clamp(Wd[k]*0.22,0.6,2.2);
    const ch=new Tube([V3(x,yCh-3,zPd-2),V3(x,yCh+1,zPd-3),V3(x,yCh+hc*0.5,zPd-9),V3(x,yCh+hc*0.5,zB+3)],{r:rr,density:0.35,front:900,state:()=>({open:KD[k]>0.22&&C.vol.fill>0.3&&S.p>4,speed:C.chanFlow[k]})});
    C.chan[k]=ch; C.chanFlow[k]=0;
    rows.forEach((r,i)=>{ const nr=r.si===3?3:1;
      for(let q=0;q<nr;q++){
        const zz=r.z+(r.mz?r.mz[q]:0), sp=buildPipe(x,zz,r.si,k,q,base,ST), d=ch.nearestDist(V3(x,yCh+hc*0.5,zz));
        const pts=[V3(x,yCh+hc*0.5,zz),V3(x,yU+ub*0.5,zz),V3(x,base,zz)].concat(sp.path);
        const tb2=new Tube(pts,{r:r.si===3?0.3:0.45,density:0.22,front:900,state:()=>({open:ch.reached(d)&&SP[i]>0.85&&S.p>4,speed:26})});
        tb2.exitU=tb2.cum[3+sp.ei]/tb2.L;
        C.tubes.push({k,i:r.si,j:i,r:q,tb:tb2,c:o.c,sw:!!o.sw}); C.top=Math.max(C.top,sp.top);
        if(sp.top>(C.tops[k]||0)) C.tops[k]=sp.top;
      } });
  }
  C.update=function(){
    for(const k of ks){
      const x=X[k], q=PL[k], th=Math.asin(clamp(KPULL*KD[k]/(Lp-2),0,1)), c=Math.cos(th), s=Math.sin(th);
      // pallet: hinged at zH under the channel, front end at the pull-down line goes down
      _mv.set(x,yCh-0.1-0.7*c-(Lp/2)*s,zH-0.7*s+(Lp/2)*c); _q.setFromAxisAngle(V3(1,0,0),th); _sv.set(pw[k],1.4,Lp); q.pal.m.compose(_mv,_q,_sv);
      const ey=yCh-0.1-1.4*c-(Lp-2)*s, ez=zH-1.4*s+(Lp-2)*c;
      q.wire.set(V3(x,ey,ez),V3(x,oy-1-KPULL*KD[k],zPd)); q.eye.at(V3(x,ey-0.1,ez));
      const sy=yCh-0.1-1.4*c-(Lp-2)*0.55*s, sz=zH-1.4*s+(Lp-2)*0.55*c; q.spr.set(V3(x,oy+2,zH+(Lp-2)*0.55),V3(x,sy,sz));
      C.chanFlow[k]=0;
    }
    for(const t of C.speaking()) C.chanFlow[t.k]+=1;
    for(const k of ks) C.chanFlow[k]=C.chanFlow[k]>0?14+3*C.chanFlow[k]:0;
    rows.forEach((r,i)=>{ sg[i].position.x=o.slOff(SP[i]); holeMats[i].emissive.copy(COL.stop).multiplyScalar(SP[i]>0.85?0.9:0); });
  };
  C.pullDown=k=>V3(X[k],oy-1-KPULL*KD[k],zPd);
  C.speaking=()=>{ const out=[]; if(S.p<8||C.vol.fill<0.3) return out; const p=o.press?o.press():S.p; for(const t of C.tubes) if(KD[t.k]>0.25&&SP[t.j]>0.85){ t.p=p; out.push(t); } return out; };
  return C;
}
/* suspended manual with n keys (C upward); fixed parts go into ST */
function buildManualR(o,ST){
  const n=o.n, nN=natIdx(n-1)+1, xp=k=>keyX(k,nN,3), Lk=o.zf-o.zt, y=o.y, keys=[], hw=nN*1.5;
  box(ST,2*hw+1,1,o.bed1-o.bed0,MAT.woodDark,0,y-3.2,(o.bed0+o.bed1)/2,LB('鍵盤の底板','Klaviaturboden'));
  box(ST,2*hw,0.25,1.4,MAT.cloth,0,y-KH/2-o.dip*(o.zfelt-o.zt)/Lk-0.13,o.zfelt,LB('下止めのフェルト','Tastenfilz'));
  box(ST,2*hw+1,KH+3.5,2.4,MAT.wood,0,y-0.75,o.zt-1.6,LB('尾部のラック（鍵の支点）','Tastenrechen'));
  const xs=[]; for(let k=0;k<n;k++) xs.push(xp(k)); xs.sort((a,b)=>a-b);
  const LR=LB('ラックの仕切り（鍵の奥端を1本ずつ案内する）','Rechenstäbchen');
  box(ST,0.22,KH+2,3.2,MAT.woodDark,xs[0]-0.95,y+0.3,o.zt+0.6,LR); for(let j=1;j<xs.length;j++) box(ST,0.22,KH+2,3.2,MAT.woodDark,(xs[j-1]+xs[j])/2,y+0.3,o.zt+0.6,LR); box(ST,0.22,KH+2,3.2,MAT.woodDark,xs[xs.length-1]+0.95,y+0.3,o.zt+0.6,LR);
  const pr=mk(G_ROD,MAT.iron,ST,LB('支点のピン（鍵の奥端を貫く）','Drehstift')); pr.rotation.z=Math.PI/2; pr.scale.set(0.16,2*hw+1,0.16); pr.position.set(0,y,o.zt+0.4);
  for(const s of [-1,1]) box(ST,1.4,6,Lk+4,MAT.wood,s*(hw+0.9),y-0.8,(o.zf+o.zt)/2,LB(o.cheek,'Backe'));
  for(let k=0;k<n;k++){
    const w=isNat(k), x=xp(k), pv=new T.Group(); pv.position.set(x,y,o.zt); CX.root.add(pv);
    const lm=o.mat(k), hm=mclone(w?MAT.ivory:MAT.ebony), lab=LB('鍵のレバー（'+KEYNAMES[k]+'。奥端のピンを支点に、トラッカーに吊られて上下する）','Tastenhebel');
    const fE=w?Lk:Lk-6;
    box(pv,w?1.45:1.2,KH,fE,lm,0,0,fE/2,lab);
    if(w){
      box(pv,2.75,0.6,6,hm,0,KH/2+0.3,Lk-3,LB('鍵 '+KEYNAMES[k]+'（白鍵の表面）','Untertaste'));
      const L=(k-1>=0&&!isNat(k-1))?xp(k-1)+0.85-x:-1.4, Rr=(k+1<n&&!isNat(k+1))?xp(k+1)-0.85-x:1.4;
      box(pv,Rr-L,0.6,11.1,hm,(L+Rr)/2,KH/2+0.3,Lk-11.5,LB('鍵 '+KEYNAMES[k]+'（白鍵の表面）','Untertaste'));
    } else box(pv,1.6,2,11,hm,0,KH/2+1,Lk-11.5,LB('鍵 '+KEYNAMES[k]+'（黒鍵）','Obertaste'));
    pv.traverse(c=>{ c.userData.key=k; c.userData.man=o.man; });
    keys.push({pv,hm,lm,x});
  }
  return {keys,Lk,hw,xp,set(k,th){ keys[k].pv.rotation.x=th; },
    attach(k,th){ const lz=o.za-o.zt; return V3(keys[k].x,y+KH/2*Math.cos(th)-lz*Math.sin(th),o.zt+KH/2*Math.sin(th)+lz*Math.cos(th)); }};
}
/* roller board: rollers stacked upward in the order given, arms point toward +z; input arm, output arm, optional coupler arm */
function mkRollerBoardR(o,ST){
  let xmin=1e9,xmax=-1e9; for(const q of o.its) for(const v of [q.xi,q.xo,q.xc]) if(v!=null){ xmin=Math.min(xmin,v); xmax=Math.max(xmax,v); }
  const ytop=o.y0+(o.its.length-1)*o.sp+2.5;
  box(ST,xmax-xmin+6,ytop-(o.y0-3),0.8,MAT.wood,(xmin+xmax)/2,(ytop+o.y0-3)/2,o.zr-1.1,LB('ローラーボード（'+o.lab+'。ローラーを支える板）','Wellenbrett'));
  const B={zr:o.zr,it:{},ytop};
  o.its.forEach((q,j)=>{ const yk=o.y0+j*o.sp, xs=[q.xi,q.xo].concat(q.xc!=null?[q.xc]:[]), a=Math.min(...xs)-0.9, b=Math.max(...xs)+0.9, ud=o.ud?o.ud(q.k):{};
    const roll=mk(G_CYL,MAT.woodPale,ST,LB('ローラー（'+o.lab+'・'+KEYNAMES[q.k]+'。回転して引く位置を左右に移す）','Welle')); roll.rotation.z=Math.PI/2; roll.scale.set(0.42,b-a,0.42); roll.position.set((a+b)/2,yk,o.zr);
    for(const xx of [a,b]) box(ST,0.7,1.1,1.4,MAT.woodDark,xx,yk,o.zr-0.4,LB('ローラーの軸受け','Wellenböckchen'));
    B.it[q.k]=Object.assign({},q,{yk,ri:prod(MAT.woodPale,0.32,LB('ローラーの腕（'+o.inLab+'）','Wellenärmchen'),ud),ro:prod(MAT.woodPale,0.32,LB('ローラーの腕（'+o.outLab+'）','Wellenärmchen'),ud),
      rc:q.xc!=null?prod(MAT.woodPale,0.32,LB('ローラーのカプラー用の腕（ペダルカプラーに引き下げられる）','Wellenärmchen'),ud):null});
  });
  B.set=(k,phi)=>{ const q=B.it[k], c=Math.cos(phi), s=Math.sin(phi), tip=(x,a)=>V3(x,q.yk-a*s,o.zr+a*c);
    const ti=tip(q.xi,o.ai), to=tip(q.xo,o.ao); q.ri.set(V3(q.xi,q.yk,o.zr),ti); q.ro.set(V3(q.xo,q.yk,o.zr),to);
    let tc=null; if(q.rc){ tc=tip(q.xc,o.ac); q.rc.set(V3(q.xc,q.yk,o.zr),tc); } return {ti,to,tc}; };
  B.hl=(k,a)=>{ const q=B.it[k]; q.ri.hl(a); q.ro.hl(a); if(q.rc) q.rc.hl(a); };
  return B;
}
/* backfall (rocker) coupler: per note an upper and a lower backfall; the upper rail is lowered by OFF to disconnect.
   A: input (a nut on the input tracker rests on it), B: rises and lifts the wire, C: lower backfall at B, D: output.
   rD = drop of D / rise of C. */
function mkRockerSetR(o,ST){
  const zPU=(o.zA+o.zB)/2, zPL=o.zPL!=null?o.zPL:(o.zB+o.zD)/2, rD=(zPL-o.zD)/(o.zB-zPL)*Math.sign(o.zB-o.zA)*Math.sign(o.zB-o.zA);
  const RR={rD:Math.abs((zPL-o.zD)/(o.zB-zPL)),it:{}};
  RR.railU=box(CX.root,o.x1-o.x0,1,1,MAT.woodDark,(o.x0+o.x1)/2,o.yU,zPU,LB('上のウィッペンバルケン（'+o.lab+'。カプラーを切ると下がる）','Wippenbalken'));
  box(ST,o.x1-o.x0,1,1,MAT.woodDark,(o.x0+o.x1)/2,o.yL,zPL,LB('下のウィッペンバルケン（'+o.lab+'。固定）','Wippenbalken'));
  RR.zPU=zPU; RR.zPL=zPL;
  for(const k of o.ks){ const x=o.xs[k], ud=o.ud?o.ud(k):{};
    RR.it[k]={x,ua:prod(MAT.woodPale,0.3,LB('上のカプラー・ウィッペン（'+o.lab+'。入力側）','Koppelwippe'),ud), ub:prod(MAT.woodPale,0.3,LB('上のカプラー・ウィッペン（'+o.lab+'。上がる側）','Koppelwippe'),ud),
      la:prod(MAT.woodPale,0.3,LB('下のカプラー・ウィッペン（'+o.lab+'。引き上げられる側）','Koppelwippe'),ud), lb:prod(MAT.woodPale,0.3,LB('下のカプラー・ウィッペン（'+o.lab+'。下がる側）','Koppelwippe'),ud),
      wire:prod(MAT.iron,0.07,LB('つなぎの線','Draht'),ud), nW:pnut(MAT.leather,0.42,0.3,LB('革ナット（つなぎの線の上端）','Ledermutter'),ud),
      nU:pnut(MAT.leather,0.42,0.3,LB('カプラーのナット（カプラーを入れると上のウィッペンに乗る）','Ledermutter'),ud)};
  }
  // returns the drop of D that the coupler produces (0 when disconnected); dT: actual drop of D (it follows its run)
  RR.out=(off,pA)=>{ const dA=Math.max(0,pA+off); return Math.max(0,off+dA)*RR.rD; };
  RR.set=(k,off,pA,dT)=>{ const q=RR.it[k], x=q.x, dA=Math.max(0,pA+off), c=dT/RR.rD;
    const PU=V3(x,o.yU+off,zPU), PL=V3(x,o.yL,zPL);
    q.ua.set(PU,V3(x,o.yU+off-dA,o.zA)); q.ub.set(PU,V3(x,o.yU+off+dA,o.zB)); q.la.set(PL,V3(x,o.yL+c,o.zB)); q.lb.set(PL,V3(x,o.yL-dT,o.zD));
    q.wire.set(V3(x,o.yL+c,o.zB),V3(x,o.yU+0.4+c,o.zB)); q.nW.at(V3(x,o.yU+0.4+c,o.zB)); q.nU.at(V3(x,o.yU+0.4-pA,o.zA));
    return {A:V3(x,o.yU+0.25-pA,o.zA),D:V3(x,o.yL-dT,o.zD)}; };
  RR.hl=(k,a)=>{ const q=RR.it[k]; for(const h of [q.ua,q.ub,q.la,q.lb]) h.hl(a); };
  RR.setRail=off=>{ RR.railU.position.y=o.yU+off; };
  return RR;
}
/* wedge bellows at full size: hinge at the back (zh), top board opens toward +z; calcant lever above, tread behind */
const G_TRIZ=new T.BufferGeometry(); G_TRIZ.setAttribute('position',new T.Float32BufferAttribute([0,0,0,0,0,1,0,1,1],3)); G_TRIZ.computeVertexNormals(); G_TRIZ.__shared=true;
function buildWedgeR(o,ST){
  const R=CX.root, L=o.L, Wd=o.W, x=o.x, zh=o.zh, yb=o.yb, B={th:o.th0,hold:false,timer:0,autoP:false,pumping:false,supplying:false,flow:0,n:o.n};
  const LG=LB('ふいごの台','Balgbock');
  for(const sx of [-1,1]) for(const zz of [zh+6,zh+L/2,zh+L-6]) box(ST,5,yb-2.5,5,MAT.woodDark,x+sx*(Wd/2-3),(yb-2.5)/2,zz,LG);
  box(ST,Wd+4,2.5,L+4,MAT.wood,x,yb-1.25,zh+L/2,LB('ふいご'+o.n+'の下板（固定）','Unterplatte'));
  const hg=mk(G_ROD,MAT.iron,ST,LB('蝶番','Scharnier')); hg.rotation.z=Math.PI/2; hg.scale.set(0.8,Wd+4,0.8); hg.position.set(x,yb,zh);
  const top=new T.Group(); top.position.set(x,yb,zh); R.add(top);
  box(top,Wd+4,2.5,L+4,MAT.wood,0,1.25,L/2,LB('ふいご'+o.n+'の上板（奥の蝶番を中心に開閉する）','Oberplatte'));
  const WL=LB('おもり（この重さが風圧になる）','Gewicht');
  box(top,24,10,24,MAT.weight,-32,7.5,L-34,WL); box(top,24,10,24,MAT.weight,32,7.5,L-34,WL); box(top,24,10,24,MAT.weight,0,7.5,L-80,WL);
  const LF=LB('ひだ（革と板で風を封じる）','Falten');
  const sides=[-1,1].map(s=>{ const m=mk(G_TRIZ,MAT.leather,R,LF); m.position.set(x+s*(Wd/2+1.2),yb,zh); return m; });
  const front=box(R,Wd+2,1,0.8,MAT.leather,x,yb,zh+L,LF);
  const inf=new T.Group(); inf.position.set(x-20,yb+0.1,zh+L-70); R.add(inf);
  box(inf,22,0.8,20,MAT.leather,11,0.4,0,LB('吸気弁（ふいごを持ち上げる間だけ開いて外気を吸う）','Schöpfventil'));
  const ofl=new T.Group(); ofl.position.set(x-10,yb-2.6,zh+L-25); R.add(ofl);
  box(ofl,20,0.8,18,MAT.leather,10,-0.4,0,LB('逆止弁（風導管へ送る間だけ開く）','Rückschlagventil'));
  const zp=zh-34, yP=yb+125, LA=L+34-4, LS=110, ropeL=40;
  box(ST,6,yP-1,6,MAT.woodDark,x,(yP-1)/2,zp,LB('レバーの支柱','Balgstütze'));
  const lever=prod(MAT.woodDark,2.2,LB('ふいごレバー（カルカントが奥の端の踏み板を踏む）','Balghebel'));
  const rope=prod(MAT.cloth,0.5,LB('引き綱','Seil'));
  const step=pbox(MAT.wood,LB('踏み板（カルカントがここを踏む）','Tritt'));
  B.update=()=>{
    const th=B.th, h=L*Math.sin(th), lc=L*Math.cos(th);
    top.rotation.x=-th;
    sides.forEach(m=>m.scale.set(1,Math.max(0.01,h),lc));
    front.scale.y=Math.max(0.05,h); front.position.set(x,yb+h/2,zh+lc);
    inf.rotation.z=B.pumping?0.5:0; ofl.rotation.z=B.supplying?-0.45:0;
    const fy=yb+2.5+(L-4)*Math.sin(th), fz=zh+(L-4)*Math.cos(th);
    const sp=clamp((fy+ropeL-yP)/LA,-0.9,0.9), p=Math.asin(sp);
    const lt=V3(x,yP+LA*sp,zp+LA*Math.cos(p)), bt=V3(x,yP-LS*sp,zp-LS*Math.cos(p));
    lever.set(bt,lt); rope.set(lt,V3(x,fy,fz)); step.put(bt.x,bt.y-1.5,bt.z-4,18,1.6,14);
  };
  new Tube([V3(x-9,yb-26,zh+L-70),V3(x-9,yb+1,zh+L-70),V3(x-9,yb+5,zh+L-90)],{kind:'air',r:4,density:0.25,state:()=>({open:B.pumping,speed:60})});
  new Vol((a,b,c,out)=>{ const u=0.08+0.88*a, Z=u*L*Math.cos(B.th); out.set(x+(c-0.5)*(Wd-8),yb+3+b*Math.max(0,u*L*Math.sin(B.th)-4),zh+Z); },220,{state:()=>B.th>0.004?0.15+0.85*B.th/0.34:0,rate:3});
  B.out=new Tube([V3(x,yb+2,zh+L-25),V3(x,yb-4,zh+L-25),V3(x,18,zh+L-25)],{r:3.5,density:0.25,state:()=>({open:B.supplying,speed:B.flow||0})});
  return B;
}
/* stop knob with label and click action */
function mkKnobR(name,act,x,y,z){
  const g=new T.Group(); g.position.set(x,y,z); CX.root.add(g);
  const kn=mk(G_CYL,MAT.ebony,g,LB('ストップノブ：'+name+'（手前に引くと入る）','Registerzug')); kn.rotation.x=Math.PI/2; kn.scale.set(1.3,2.2,1.3); kn.position.z=1.1;
  const fc=mk(G_CYL,MAT.ivory,g,LB('ストップ名の札：'+name,'Registerschild')); fc.rotation.x=Math.PI/2; fc.scale.set(0.95,0.25,0.95); fc.position.z=2.3;
  g.traverse(c=>c.userData.act=act); return g;
}
function h3Core(){
  const R=CX.root, ST=new T.Group(); R.add(ST); CX.pool=mkPool();
  const NM=53, NP=30, DIP=1.3, Y0=94, P8=k=>155.5*Math.pow(2,-k/16);
  const MK=[...Array(NM).keys()], PK=[...Array(NP).keys()];
  const m={man:2,auto:true};
  /* ---------- layout of the chests (C/Cis, basses outside) ---------- */
  const HWL=h3Layout(MK,k=>Math.max(P8(k),110*Math.pow(2,-k/24)),0);
  const POL=h3Layout(MK,k=>Math.max(110*Math.pow(2,-k/16),P8(15+k),P8(19+k),36),0);
  const pedW=k=>Math.max(190*Math.pow(2,-k/16),P8(k),200*Math.pow(2,-k/24));
  const TCL=h3TowerLayout(PK.filter(k=>k%2===0),pedW,-470,true), TDL=h3TowerLayout(PK.filter(k=>k%2===1),pedW,470,false);
  const PDX=Object.assign({},TCL.xs,TDL.xs), PDW=Object.assign({},TCL.w,TDL.w);
  /* ---------- console: two suspended manuals (G-02), Pos/Hw backfall coupler above the keys ---------- */
  const hmat=[], pmat=[], dmat=[]; for(let k=0;k<NM;k++){ hmat.push(mclone(MAT.woodPale)); pmat.push(mclone(MAT.woodPale)); } for(let k=0;k<NP;k++) dmat.push(mclone(MAT.woodPale));
  const LO={n:NM,y:Y0,zf:51.5,zt:-52,za:-17,bed0:-14,bed1:52.5,zfelt:50,dip:DIP,man:1,cheek:'下鍵盤（I・ポジティフ）の側板',mat:k=>pmat[k]};
  const UPm={n:NM,y:Y0+7,zf:34,zt:-12,za:8,bed0:-11,bed1:31.8,zfelt:30.8,dip:DIP,man:2,cheek:'上鍵盤（II・ハウプトヴェルク）の側板',mat:k=>hmat[k]};
  const lo=buildManualR(LO,ST), up=buildManualR(UPm,ST), HWX=lo.hw;
  const pullU=DIP*(UPm.za-UPm.zt)/(UPm.zf-UPm.zt), pullL=DIP*(LO.za-LO.zt)/(LO.zf-LO.zt), dzU=UPm.za-UPm.zt, dzL=LO.za-LO.zt;
  const kx=k=>lo.keys[k].x;
  const LS=LB('演奏台（コンソール）','Spieltisch');
  box(ST,2*HWX+6,6.5,110,MAT.woodDark,0,Y0-6.6,0,LS);
  for(const s of [-1,1]){ box(ST,2,Y0+16,108,MAT.wood,s*(HWX+4.5),(Y0+16)/2,-1,LB('演奏台の側板','Spieltisch')); }
  box(ST,2*HWX+10,1.2,14,MAT.wood,0,Y0+24,26,LB('譜面台','Notenpult')).rotation.x=-1.15;
  for(const s of [-1,1]) box(ST,11,24,1.6,MAT.woodDark,s*57.5,Y0+8,37.2,LB('ストップノブの板（ストップジャム）','Registerbank'));
  const rPH=pullL/pullU, ZPL_PH=(-17+rPH*(-5))/(1+rPH);
  const cPH=mkRockerSetR({lab:'Pos/Hw',yU:Y0+17,yL:Y0+14,zA:8,zB:-5,zD:-17,zPL:ZPL_PH,ks:MK,xs:Object.fromEntries(MK.map(k=>[k,kx(k)])),x0:-HWX-2,x1:HWX+2},ST);
  for(const s of [-1,1]){ box(ST,1.2,10,1.6,MAT.woodDark,s*(HWX+3),Y0+14,cPH.zPU,LB('ウィッペンバルケンのガイド（溝に沿って上下する）','Balgstütze')); box(ST,1.2,6,1.6,MAT.woodDark,s*(HWX+3),Y0+11,cPH.zPL,LB('ウィッペンバルケンの支柱','Balgstütze')); }
  /* ---------- roller boards for the manuals, just above the console ---------- */
  const aiH=4*pullU/KPULL, zrH=UPm.za-aiH, acH=aiH/pullU, aiP=4*pullL/KPULL, zrP=LO.za-aiP, acP=aiP/pullL, YRB=Y0+22, SPR=1.6;
  const cxH=k=>HWL.xs[k]+(kx(k)>HWL.xs[k]?1.6:-1.6), cxP=k=>POL.xs[k]+(kx(k)>POL.xs[k]?1.6:-1.6);
  const rbH=mkRollerBoardR({lab:'ハウプトヴェルク用',inLab:'鍵の側',outLab:'パレットの側',zr:zrH,y0:305,sp:SPR,ai:aiH,ao:4,ac:acH,its:MK.map(k=>({k,xi:kx(k),xo:HWL.xs[k],xc:k<NP?cxH(k):null})),ud:k=>({key:k,man:2})},ST);
  const rbP=mkRollerBoardR({lab:'ポジティフ用',inLab:'鍵の側',outLab:'パレットの側',zr:zrP,y0:YRB,sp:SPR,ai:aiP,ao:4,ac:acP,its:MK.map(k=>({k,xi:kx(k),xo:POL.xs[k],xc:k<NP?cxP(k):null})),ud:k=>({key:k,man:1})},ST);
  /* ---------- chests ---------- */
  const KDH=new Float32Array(64), KDP=new Float32Array(64), KDD=new Float32Array(64);
  const SPH=new Float32Array(6), SPP=new Float32Array(4), SPD=new Float32Array(3);
  const w8=new Float32Array(1); let pMan=75;
  const zFH=zrH+4+3.5, zFP=zrP+4+3.5;
  const hw=buildChestR({name:'ハウプトヴェルク',ks:MK,xs:HWL.xs,ws:HWL.w,y:405,zF:zFH,rows:h3Rows([5,6,7,8,3,9],0,zFH),KD:KDH,SP:SPH,slDir:-1,slOff:s=>-3*(1-s),Lp:38,c:1,press:()=>pMan,ud:k=>({key:k,man:2})},ST);
  const pos=buildChestR({name:'ポジティフ',ks:MK,xs:POL.xs,ws:POL.w,y:208,zF:zFP,rows:h3Rows([0,1,10,4],0,zFP),KD:KDP,SP:SPP,slDir:1,slOff:s=>3*(1-s),Lp:38,c:2,sw:true,press:()=>pMan,ud:k=>({key:k,man:1}),volN:380},ST);
  /* ---------- pedalboard, 30 keys, toe extension carrying the action and the two coupler trackers ---------- */
  const ZH=62, ZE=-14, ZX=-60, KL=ZH-ZX, KP=ZH-ZE, yK=5, KHp=3.4, DEP=3.2, ZAA=-50, ZHC=-17, ZPC=-39.7, PNN=natIdx(NP-1)+1, pxp=k=>keyX(k,PNN,8);
  const aiA=6, zrA=ZAA-aiA, aoA=KPULL*aiA/(DEP*(ZH-ZAA)/KL), aiC=6, zrHC=ZHC-aiC, aoHC=aiC/(DEP*(ZH-ZHC)/KL), zrPC=ZPC-aiC, aoPC=aiC/(DEP*(ZH-ZPC)/KL);
  const zFT=zrA+aoA+3.5, rowsT=h3Rows([5,11,12],0,zFT);
  const tc=buildChestR({name:'ペダル（C側）',ks:PK.filter(k=>k%2===0),xs:TCL.xs,ws:TCL.w,y:64,zF:zFT,rows:rowsT,KD:KDD,SP:SPD,slDir:1,slOff:s=>3*(1-s),Lp:50,c:3,ud:k=>({key:k,man:0}),volN:300},ST);
  const td=buildChestR({name:'ペダル（Cis側）',ks:PK.filter(k=>k%2===1),xs:TDL.xs,ws:TDL.w,y:64,zF:zFT,rows:h3Rows([5,11,12],1,zFT).map((r,i)=>Object.assign(r,{z:rowsT[i].z,d:rowsT[i].d})),KD:KDD,SP:SPD,slDir:-1,slOff:s=>3*(1-s),Lp:50,c:4,ud:k=>({key:k,man:0}),volN:300},ST);
  const LFp=LB('ペダル鍵盤の枠','Pedalklaviatur'), PW=PNN*4+6;
  box(ST,2*PW,1.2,3,MAT.woodDark,0,0.6,ZX+2.5,LB('奥の桟（ばねと下止めのフェルトを受ける）','Federleiste'));
  box(ST,2*PW,yK+1,4,MAT.woodDark,0,(yK+1)/2,ZH+1,LB('蝶番の桟（ペダル鍵のかかと側の支点）','Scharnier'));
  for(const s of [-1,1]) box(ST,2,1.6,KL+6,MAT.woodDark,s*PW,0.8,(ZH+ZX)/2+1,LFp);
  const LBk=LB('オルガンベンチ','Orgelbank'); box(ST,110,2.4,18,MAT.wood,0,74,ZH+14,LBk); for(const s of [-1,1]) box(ST,2.4,73,16,MAT.wood,s*52,36.5,ZH+14,LBk);
  const SG=helixGeo(0.8,5,2.2,0.13), ped=[];
  for(let k=0;k<NP;k++){
    const w=isNat(k), x=pxp(k), lm=dmat[k], g=new T.Group(); g.position.set(x,yK,ZH); R.add(g);
    box(g,w?2.9:2.4,KHp,KL,lm,0,0,-KL/2,LB('ペダル鍵 '+KEYNAMES[k]+'（かかと側の蝶番を支点に、つま先側が下がる）','Pedaltaste'));
    if(!w) box(g,2.4,3.2,18,MAT.ebony,0,KHp/2+1.6,-KP+9,LB('ペダルの黒鍵（つま先側に高く付いた台）','Obertaste'));
    else box(g,2.9,0.3,KP-4,MAT.woodPale,0,KHp/2+0.15,-KP/2-1,LB('ペダルの白鍵の踏み面','Untertaste'));
    box(g,w?2.9:2.4,0.02,0.4,MAT.dark,0,KHp/2+0.01,-KP,LB('ここから奥はアクションを取り付けるための延長部（オルガンの下に入る）','Pedaltaste'));
    g.traverse(c=>{ c.userData.key=k; c.userData.man=0; });
    rod(ST,0.15,MAT.brass,LB('ガイドピン','Führungsstift')).set(V3(x,1.2,ZX+2),V3(x,yK+KHp/2+0.6,ZX+2));
    const sp=mk(SG,MAT.iron,R,LB('ペダルのばね','Pedalfeder')); sp.position.set(x,1.2,ZX+5);
    const ud={key:k,man:0};
    ped.push({k,x,g,sp,top:yK+KHp/2,lm,ta:ptrk(MAT.woodPale,LB('トラッカー（ペダル鍵 → ペダル風箱用のローラーボード）','Abstrakte'),ud),
      th:ptrk(MAT.woodPale,LB('カプラーのトラッカー（ペダル鍵 → Hw/P のローラーボード）','Abstrakte'),ud),tp:ptrk(MAT.woodPale,LB('カプラーのトラッカー（ペダル鍵 → Pos/P のローラーボード）','Abstrakte'),ud),
      ta2:ptrk(MAT.woodPale,LB('トラッカー（ローラー → ペダル塔の風箱のパレット）','Abstrakte'),ud),th2:ptrk(MAT.woodPale,LB('カプラーのトラッカー（ローラー → Hw/P の上のウィッペン）','Abstrakte'),ud),
      tp2:ptrk(MAT.woodPale,LB('カプラーのトラッカー（ローラー → Pos/P の上のウィッペン）','Abstrakte'),ud)});
  }
  const rbA=mkRollerBoardR({lab:'ペダル塔の風箱用',inLab:'ペダル鍵の側',outLab:'パレットの側',zr:zrA,y0:14,sp:1.5,ai:aiA,ao:aoA,its:PK.map(k=>({k,xi:pxp(k),xo:PDX[k]})),ud:k=>({key:k,man:0})},ST);
  const rbHC=mkRollerBoardR({lab:'Hw/P カプラー用',inLab:'ペダル鍵の側',outLab:'ウィッペンの側',zr:zrHC,y0:14,sp:1.5,ai:aiC,ao:aoHC,its:PK.map(k=>({k,xi:pxp(k),xo:cxH(k)})),ud:k=>({key:k,man:0})},ST);
  const rbPC=mkRollerBoardR({lab:'Pos/P カプラー用',inLab:'ペダル鍵の側',outLab:'ウィッペンの側',zr:zrPC,y0:14,sp:1.5,ai:aiC,ao:aoPC,its:PK.map(k=>({k,xi:pxp(k),xo:cxP(k)})),ud:k=>({key:k,man:0})},ST);
  /* pedal couplers: backfall pairs beside the console, under the manual roller boards */
  const zAH=zrHC+aoHC, zDH=zrH+acH, zAP=zrPC+aoPC, zDP=zrP+acP;
  const xsH=Object.fromEntries(PK.map(k=>[k,cxH(k)])), xsP=Object.fromEntries(PK.map(k=>[k,cxP(k)]));
  const mnx=o=>Math.min(...Object.values(o))-4, mxx=o=>Math.max(...Object.values(o))+4;
  const cHP=mkRockerSetR({lab:'Hw/P',yU:78,yL:75,zA:zAH,zB:(zAH+zDH)/2,zD:zDH,ks:PK,xs:xsH,x0:mnx(xsH),x1:mxx(xsH),ud:k=>({key:k,man:0})},ST);
  const cPP=mkRockerSetR({lab:'Pos/P',yU:72,yL:69,zA:zAP,zB:(zAP+zDP)/2,zD:zDP,ks:PK,xs:xsP,x0:mnx(xsP),x1:mxx(xsP),ud:k=>({key:k,man:0})},ST);
  for(const [cs,o] of [[cHP,xsH],[cPP,xsP]]) for(const xx of [mnx(o)+1,mxx(o)-1]){ box(ST,1.2,8,1.6,MAT.woodDark,xx,cs===cHP?74:68,cs.zPU,LB('ウィッペンバルケンのガイド','Balgstütze')); box(ST,1.2,cs===cHP?75:69,1.6,MAT.woodDark,xx,(cs===cHP?75:69)/2,cs.zPL,LB('ウィッペンバルケンの支柱','Balgstütze')); }
  /* trackers of the manual runs */
  const TH=MK.map(k=>({t1:ptrk(MAT.woodPale,LB('トラッカー（上鍵盤の鍵 → ローラー。鍵はこれに吊られている）','Abstrakte'),{key:k,man:2}),t2:ptrk(MAT.woodPale,LB('トラッカー（ローラー → ハウプトヴェルクのパレット）','Abstrakte'),{key:k,man:2}),
    tc:k<NP?ptrk(MAT.woodPale,LB('カプラーのトラッカー（Hw/P の下のウィッペン → ローラーのカプラー用の腕）','Abstrakte'),{key:k,man:2}):null}));
  const TP=MK.map(k=>({tL:ptrk(MAT.woodPale,LB('トラッカー（下鍵盤の鍵 → Pos/Hw の下のウィッペン）','Abstrakte'),{key:k,man:1}),t1:ptrk(MAT.woodPale,LB('トラッカー（下のウィッペン → ローラー）','Abstrakte'),{key:k,man:1}),
    t2:ptrk(MAT.woodPale,LB('トラッカー（ローラー → ポジティフのパレット）','Abstrakte'),{key:k,man:1}),tc:k<NP?ptrk(MAT.woodPale,LB('カプラーのトラッカー（Pos/P の下のウィッペン → ローラーのカプラー用の腕）','Abstrakte'),{key:k,man:1}):null}));
  const B={hw,pos,tc,td,ST,ped,lo,up,rbH,rbP,rbA,rbHC,rbPC,cPH,cHP,cPP,TH,TP,KDH,KDP,KDD,SPH,SPP,SPD,HWL,POL,PDX,PDW,TCL,TDL,pxp,kx,m,NM,NP,DIP,Y0,UPm,LO,ZH,ZX,KL,DEP,ZAA,ZHC,ZPC,yK,KHp,pullU,pullL,dzU,dzL,aiH,aiP,acH,acP,aiA,aoA,aiC,aoHC,aoPC,zrH,zrP,hmat,pmat,dmat,setP:v=>{pMan=v;}};
  return B;
}
