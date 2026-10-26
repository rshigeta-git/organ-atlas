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
  if(nRanks(si)>1){ let d=1.2*(nRanks(si)-1); for(let r=0;r<nRanks(si);r++) d+=2*pipeR(si,k,r); return d; }
  return 2*pipeR(si,k,0);
}
function h3Rows(stops,k0,zF){ const out=[]; let z=zF-3; for(const si of stops){ const d=h3RowDepth(si,k0)+2.2; z-=d/2; let mz=null;
    if(nRanks(si)>1){ const rr=[...Array(nRanks(si)).keys()].map(r=>pipeR(si,k0,r)); let c=-(h3RowDepth(si,k0))/2; mz=rr.map(v=>{ const m=c+v; c+=2*v+1.2; return m; }); }
    out.push({si,z,d,mz}); z-=d/2; } return out; }

function buildChestR(o,ST){
  const ks=o.ks, X=o.xs, Wd=o.ws, oy=o.y, zF=o.zF, rows=o.rows, NS=rows.length, KD=o.KD, SP=o.SP, Lp=o.Lp||38, F=SC/0.45;
  const hb=13, hc=12, tb=1.5, sl=1, ub=4.5, yCh=oy+hb, yT=yCh+hc, yS=yT+tb, yU=yS+sl, base=yU+ub;
  let xL=1e9,xR=-1e9; for(const k of ks){ xL=Math.min(xL,X[k]-Wd[k]/2); xR=Math.max(xR,X[k]+Wd[k]/2); }
  // zBmax: make the chest at least this deep (room behind the last row); back: pallet box at the back, mirrored front to
  // back (Z), so the trackers can come up behind whatever stands under the front of the chest
  const W=xR-xL, cx=(xL+xR)/2, zB=Math.min(Math.min(...rows.map(r=>r.z-r.d/2))-2,o.zBmax!=null?o.zBmax:1e9), D=zF-zB, zc=(zF+zB)/2;
  const zPd=zF-3.5, zH=zPd-(Lp-2), zPB=zH-4, Z=z=>o.back?zF+zB-z:z, QB=new T.Quaternion().setFromAxisAngle(UP,o.back?Math.PI:0);
  const C={xL,xR,W,cx,oy,zF,zB,zPd:Z(zPd),zPB:Z(zPB),base,yS,top:0,tubes:[],chanFlow:{},nm:o.name,inlet:V3(cx,oy+hb/2,o.back?zB:zPB),tops:{},rows,slEnd:o.slDir<0?xL-15:xR+15};
  const nmS=o.name;
  const L1=LB('パレットボックス（'+nmS+'の風箱の下部。常に風で満たされている）','Windkasten');
  box(ST,W+2,1,zF-zPB,MAT.wood,cx,oy+0.5,Z((zF+zPB)/2),L1);
  box(ST,W+2,hb-1,1,MAT.wood,cx,oy+1+(hb-1)/2,Z(zF-0.5),LB('パレットボックスの前板（点検のため外せる）','Spund'));
  box(ST,W+2,hb-1,1,MAT.wood,cx,oy+1+(hb-1)/2,Z(zPB+0.5),L1);
  for(const xx of [xL-0.5,xR+0.5]) box(ST,1,hb-1,zF-zPB,MAT.wood,xx,oy+1+(hb-1)/2,Z((zF+zPB)/2),L1);
  box(ST,W+2,1,zPB-zB,MAT.wood,cx,yCh-0.5,Z((zPB+zB)/2),LB('チャンネルの底板','Rahmen'));
  const LC=LB('チャンネルの仕切り（鍵ごとの部屋＝トーンチャンネルを分ける）','Schied');
  const FIT={}; for(const k of ks) FIT[k]=palFit(k,!!o.pedal,Wd[k]);
  chanBars(ST,ks.map(k=>[X[k]-FIT[k].cw/2,X[k]+FIT[k].cw/2]),xL-0.45,xR+0.45,hc,D,yCh+hc/2,zc,MAT.woodDark,LC);
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
    for(const k of ks){ const nr=nRanks(r.si); for(let q=0;q<nr;q++){ const dd=mk(G_DISC,hm,TG,LB('スライダーの穴','Schleifenbohrung')); dd.rotation.x=-Math.PI/2; const s=nRanks(r.si)>1?0.55:Math.min(0.9,0.35+Wd[k]*0.08); dd.scale.set(s,s,s); dd.position.set(X[k],yS+sl+0.03,r.z+(r.mz?r.mz[q]:0));
      const zz=r.z+(r.mz?r.mz[q]:0), br=s*0.92; bore(TG,hm,X[k],yS,yS+sl,zz,br,LB('スライダーの穴','Schleifenbohrung'),false); bore(ST,hm,X[k],yT,yT+tb,zz,br,LB('テーブルの穴（トーンチャンネルからスライダーへ風が通る）','Kanzellenbohrung')); bore(ST,hm,X[k],yU,yU+ub,zz,br,LB('上板の穴（スライダーからパイプの足へ風が通る）','Stockbohrung')); } }
    mergeStatic(TG,G);
    box(ST,W+1,ub,r.d-0.15,MAT.wood,cx,yU+ub/2,r.z,LB('上板：'+st.name+'（パイプを立てる台）','Pfeifenstock'));
  });
  // pallets, pull-down wires, springs (pooled), guide pins and purses (fixed)
  const PL={}, pw={}, PG=palGeo(Lp,Lp-2);
  for(const k of ks){
    const x=X[k]; pw[k]=FIT[k].pw;
    PL[k]={pal:CX.pool.add(PG.body,MAT.woodPale,LB('パレット（'+KEYNAMES[k]+'の弁。押鍵で下に開く。下の角を落とし、両端を斜めに削ってある）','Spielventil'),o.ud(k)),
      face:CX.pool.add(PG.face,MAT.palLeather,LB('パレットの革（上面に貼った革。チャンネルの口に密着して風を止める。奥の端は蝶番になる）','Ventilleder'),o.ud(k)),
      wire:prod(MAT.metalDark,0.1,LB('引き下げ線（パレットの前端から底板を貫いて下へ出る）','Abzugsdraht'),o.ud(k)),
      eye:pnut(MAT.brass,0.3,0.5,LB('パレットの目金（引き下げ線を掛ける）','Ventilöse'),o.ud(k)),
      spr:palSpring(ST,x,oy+3.1,Z(zH+1.4),oy+2,Z(zH+(Lp-2)*0.55),prod(MAT.brass,SPR_W,LB('パレットばね（パレットを押し上げて閉じる）','Ventilfeder')))};
    const purse=mk(G_CONE,MAT.leather,ST,LB('パルペーテ（引き下げ線が底板を通る穴をふさぐ革袋）','Pulpete')); purse.scale.set(0.75,1.1,0.75); purse.position.set(x,oy-0.55,Z(zPd));
    const sx=pw[k]/2+0.2;
    for(const s of [-1,1]) rod(ST,0.1,MAT.brass,LB('パレットのガイドピン','Ventilführungsstift')).set(V3(x+s*sx,yCh,Z(zPd+0.8)),V3(x+s*sx,yCh-3.6,Z(zPd+0.8)));
  }
  box(ST,W,1,1.4,MAT.woodDark,cx,oy+1.5,Z(zH+(Lp-2)*0.55),LB('ばね受けの桟','Federleiste'));
  C.vol=new Vol((a,b,c,out)=>out.set(xL+1+a*(W-2),oy+1.5+b*(hb-3.5),Z(zPB+1+c*(zF-zPB-2))),o.volN||420,{state:()=>(S.p>4&&(!o.feed||o.feed.full()))?clamp(0.35+0.65*S.p/75,0,1):0});
  C.chan={};
  for(const k of ks){
    const x=X[k], rr=clamp(FIT[k].cw*0.4,0.3,2.2);
    const ch=new Tube([V3(x,yCh-3,Z(zPd-2)),V3(x,yCh+1,Z(zPd-3)),V3(x,yCh+hc*0.5,Z(zPd-9)),V3(x,yCh+hc*0.5,Z(zB+3))],{r:rr,density:0.35,front:900,state:()=>({open:KD[k]>0.22&&C.vol.fill>0.3&&S.p>4,speed:C.chanFlow[k]})});
    C.chan[k]=ch; C.chanFlow[k]=0;
    rows.forEach((r,i)=>{ const nr=nRanks(r.si);
      for(let q=0;q<nr;q++){
        const zz=r.z+(r.mz?r.mz[q]:0), sp=buildPipe(x,zz,r.si,k,q,base,ST), d=ch.nearestDist(V3(x,yCh+hc*0.5,zz));
        const pts=[V3(x,yCh+hc*0.5,zz),V3(x,yU+ub*0.5,zz),V3(x,base,zz)].concat(sp.path);
        const tb2=new Tube(pts,{r:nRanks(r.si)>1?0.3:0.45,density:0.22,front:900,state:()=>({open:ch.reached(d)&&SP[i]>0.85&&S.p>4,speed:26})});
        tb2.exitU=tb2.cum[3+sp.ei]/tb2.L; tb2.mouthAt(sp,3);
        C.tubes.push({k,i:r.si,j:i,r:q,tb:tb2,c:o.c,sw:!!o.sw}); C.top=Math.max(C.top,sp.top);
        if(sp.top>(C.tops[k]||0)) C.tops[k]=sp.top;
      } });
  }
  C.update=function(){
    for(const k of ks){
      const x=X[k], q=PL[k], ph=palH(pw[k]), th=Math.asin(clamp(KPULL*KD[k]/(Lp-2),0,1)), c=Math.cos(th), s=Math.sin(th);
      // pallet: hinged at zH under the channel, front end at the pull-down line goes down
      _mv.set(x,yCh-0.1,Z(zH)); _q.setFromAxisAngle(V3(1,0,0),th).premultiply(QB); _sv.set(pw[k],ph,1); q.pal.m.compose(_mv,_q,_sv); q.face.m.copy(q.pal.m);
      const ey=yCh-0.1-ph*c-(Lp-2)*s, ez=Z(zH-ph*s+(Lp-2)*c);
      q.wire.set(V3(x,ey,ez),V3(x,oy-1-KPULL*KD[k],Z(zPd))); q.eye.at(V3(x,ey-0.1,ez));
      const sy=yCh-0.1-(ph-0.25)*c-(Lp-2)*0.55*s, sz=Z(zH-(ph-0.25)*s+(Lp-2)*0.55*c); q.spr.u.set(q.spr.a,V3(x-SPR_W,sy,sz));
      C.chanFlow[k]=0;
    }
    for(const t of C.speaking()) C.chanFlow[t.k]+=1;
    for(const k of ks) C.chanFlow[k]=C.chanFlow[k]>0?14+3*C.chanFlow[k]:0;
    rows.forEach((r,i)=>{ sg[i].position.x=o.slOff(SP[i]); holeMats[i].emissive.copy(COL.stop).multiplyScalar(SP[i]>0.85?0.9:0); });
  };
  C.pullDown=k=>V3(X[k],oy-1-KPULL*KD[k],Z(zPd));
  C.speaking=()=>{ const out=[]; if(S.p<8||C.vol.fill<0.3) return out; const p=o.press?o.press():S.p; for(const t of C.tubes) if(KD[t.k]>0.25&&SP[t.j]>0.85){ t.p=p; out.push(t); } return out; };
  return C;
}
/* balanced manual with n keys (C upward), as D-02; fixed parts go into ST. Each key rocks on a pin in the balance rail
   at zbal; its tail rises and a sticker standing on it lifts one arm of a backfall pivoted at zbp; the other arm comes
   down at za and pulls the tracker that hangs there. The sticker only pushes, so a coupler that pulls this tracker lifts
   the backfall off its sticker and leaves the key at rest. pull: drop at za for a full key; dz: lever giving the same
   pull at the key's angle (410 works with pull = dz·sin th, as for a suspended key). */
/* o.zh: the key hangs a tracker from its tail at z = zh (no sticker and backfall); o.zrest: tail rest rail; o.rackTop: top of the
   rack; o.pads: blocks glued under the key ({z,h}); o.slots: z of slots through the key for coupler stickers */
function buildBalancedManualR(o,ST){
  const n=o.n, nN=natIdx(n-1)+1, xp=k=>keyX(k,nN,3), y=o.y, keys=[], hw=nN*1.5, FA=o.zf-o.zbal, hang=o.zh!=null;
  const As=Math.abs(o.zbp-o.zs), Aa=Math.abs(o.za-o.zbp), sg=Math.sign(o.za-o.zbp), yT=y+KH/2, Lst=o.yb-yT-0.15;
  const pull=hang?(o.zbal-o.zh)*o.dip/FA:Aa/As*(o.zbal-o.zs)*o.dip/FA, dz=pull*FA/o.dip, zR0=o.zrest!=null?o.zrest:o.zt+2;
  const rT=o.rackTop!=null?o.rackTop:y+3.2;
  box(ST,2*hw+1,1,o.bed1-o.bed0,MAT.woodDark,0,y-3.2,(o.bed0+o.bed1)/2,LB('鍵盤の底板','Klaviaturboden'));
  box(ST,2*hw,0.25,1.4,MAT.cloth,0,y-KH/2-o.dip*(o.zfelt-o.zbal)/FA-0.13,o.zfelt,LB('下止めのフェルト','Tastenfilz'));
  box(ST,2*hw+1,y-KH/2-(y-2.7),2.4,MAT.wood,0,(y-KH/2+y-2.7)/2-0.2,o.zbal,LB('バランスレール（鍵の中ほどの支点を受ける桟）','Waagebalken'));
  box(ST,2*hw+1,0.2,2.2,MAT.cloth,0,y-KH/2-0.1,o.zbal,LB('バランスレールのフェルト','Waagebalkenfilz'));
  box(ST,2*hw+1,y-KH/2-(y-2.7),2.4,MAT.wood,0,(y-KH/2+y-2.7)/2-0.3,zR0,LB('尾部の受け桟（鍵が戻ったとき奥の端が載る）','Hinterleiste'));
  box(ST,2*hw+1,0.3,2.2,MAT.cloth,0,y-KH/2-0.15,zR0,LB('尾部の受け桟のフェルト','Hinterleistenfilz'));
  const xs=[]; for(let k=0;k<n;k++) xs.push(xp(k)); xs.sort((a,b)=>a-b);
  const LR=LB('ラックの仕切り（鍵の奥端を1本ずつ案内する）','Rechenstäbchen');
  const r0=y-2.2;
  box(ST,2*hw+1,rT-r0+0.5,1.2,MAT.wood,0,(rT+r0)/2,o.zt-1.2,LB('尾部のラック（鍵の奥の端を1本ずつ案内する）','Tastenrechen'));
  box(ST,0.22,rT-r0,2.2,MAT.woodDark,xs[0]-0.95,(rT+r0)/2,o.zt+0.4,LR); for(let j=1;j<xs.length;j++) box(ST,0.22,rT-r0,2.2,MAT.woodDark,(xs[j-1]+xs[j])/2,(rT+r0)/2,o.zt+0.4,LR); box(ST,0.22,rT-r0,2.2,MAT.woodDark,xs[xs.length-1]+0.95,(rT+r0)/2,o.zt+0.4,LR);
  for(const s of [-1,1]) box(ST,1.4,6,o.zf-o.zt+4,MAT.wood,s*(hw+0.9),y-0.8,(o.zf+o.zt)/2,LB(o.cheek,'Backe'));
  // backfall rail on two posts standing on the console table (yfoot), just outside the key cheeks
  if(!hang){ box(ST,2*hw+6,1,1,MAT.woodDark,0,o.yb,o.zbp,LB('バックフォールの支点の桟（ウィッペンバルケン）','Wippenbalken'));
    for(const s of [-1,1]) box(ST,1.2,o.yb-o.yfoot,1.6,MAT.woodDark,s*(hw+2.4),(o.yb+o.yfoot)/2,o.zbp,LB('バックフォールの桟の支柱','Balgstütze')); }
  for(let k=0;k<n;k++){
    const w=isNat(k), x=xp(k), pv=new T.Group(); pv.position.set(x,y,o.zbal); CX.root.add(pv);
    const lm=o.mat(k), hm=mclone(w?MAT.ivory:MAT.ebony), lab=LB('鍵のレバー（'+KEYNAMES[k]+'。中ほどのバランスピンを支点にシーソーのように動く）','Tastenhebel');
    const z0=o.zt-o.zbal, zF=o.zf-o.zbal, fE=w?zF:zF-6;
    box(pv,w?1.45:1.2,KH,fE-z0,lm,0,0,(fE+z0)/2,lab);
    if(w){
      box(pv,2.75,0.6,6,hm,0,KH/2+0.3,zF-3,LB('鍵 '+KEYNAMES[k]+'（白鍵の表面）','Untertaste'));
      const L=(k-1>=0&&!isNat(k-1))?xp(k-1)+0.85-x:-1.4, Rr=(k+1<n&&!isNat(k+1))?xp(k+1)-0.85-x:1.4;
      box(pv,Rr-L,0.6,11.1,hm,(L+Rr)/2,KH/2+0.3,zF-11.5,LB('鍵 '+KEYNAMES[k]+'（白鍵の表面）','Untertaste'));
    } else box(pv,1.6,2,11,hm,0,KH/2+1,zF-11.5,LB('鍵 '+KEYNAMES[k]+'（黒鍵）','Obertaste'));
    if(!hang) box(pv,1.2,0.3,1.2,MAT.cloth,0,KH/2+0.15,o.zs-o.zbal,LB('スティッカーの受け（フェルト）','Stecherfilz'));
    for(const p of o.pads||[]){ box(pv,w?1.45:1.2,p.h,1.2,lm,0,-KH/2-p.h/2,p.z-o.zbal,LB(p.lab,'Koppelklotz')); box(pv,w?1.45:1.2,0.2,1.2,MAT.cloth,0,-KH/2-p.h-0.1,p.z-o.zbal,LB('当て木のフェルト','Stecherfilz')); }
    for(const z of o.slots?o.slots(k):[]) for(const sy of [-1,1]) box(pv,0.8,0.04,0.9,MAT.dark,0,sy*(KH/2+0.02),z-o.zbal,LB('カプラーのスティッカーを通す穴（鍵を縦に貫く）','Luftbohrung'));
    pv.traverse(c=>{ c.userData.key=k; c.userData.man=o.man; });
    rod(ST,0.13,MAT.brass,LB('バランスピン（鍵の中ほどの穴に入り、鍵はこれを支点にシーソーのように動く）','Waagestift')).set(V3(x,y-KH/2-0.4,o.zbal),V3(x,yT+0.4,o.zbal));
    const ud={key:k,man:o.man};
    if(hang) keys.push({pv,hm,lm,x}); else keys.push({pv,hm,lm,x,st:prod(lm,0.35,LB('スティッカー（押し棒。鍵の奥の端が上がるとバックフォールを押し上げる）','Stecher'),ud),
      bs:prod(lm,0.3,LB('バックフォール（ウィッペ。スティッカーに押し上げられる腕）','Wippe'),ud),ba:prod(lm,0.3,LB('バックフォール（ウィッペ。下がってトラッカーを引く腕）','Wippe'),ud)});
  }
  const tip=(x,pl)=>{ const f=Math.asin(clamp(pl/Aa,0,1)); return V3(x,o.yb-Aa*Math.sin(f),o.zbp+sg*Aa*Math.cos(f)); };
  // a point of the key at z, ly above its centre line (ly = ±KH/2: top or underside), for the key turned by th
  const at=(k,th,z,ly)=>{ const lz=z-o.zbal; return V3(keys[k].x,y+ly*Math.cos(th)-lz*Math.sin(th),o.zbal+ly*Math.sin(th)+lz*Math.cos(th)); };
  return {keys,Lk:FA,hw,xp,pull,dz,at,
    // th: the key's angle; pl: the drop of the tracker at za (from the backfall)
    set(k,th,pl){ const q=keys[k]; q.pv.rotation.x=th; if(hang) return; const f=Math.asin(clamp(pl/Aa,0,1)), P=V3(q.x,o.yb,o.zbp);
      const lz=o.zs-o.zbal, bot=V3(q.x,y+(KH/2+0.3)*Math.cos(th)-lz*Math.sin(th),o.zbal+(KH/2+0.3)*Math.sin(th)+lz*Math.cos(th));
      q.st.set(bot,V3(q.x,bot.y+Lst,bot.z)); q.bs.set(P,V3(q.x,o.yb+As*Math.sin(f),o.zbp-sg*As*Math.cos(f))); q.ba.set(P,tip(q.x,pl)); },
    attach(k,pl){ return tip(keys[k].x,pl); }};
}
/* roller board: rollers stacked upward in the order given (or at q.y), arms point toward +z; input arm, output arm, optional
   coupler arm. o.win = [x0,x1,y0,y1]: an opening left in the board (no roller may cross it) */
function mkRollerBoardR(o,ST){
  let xmin=1e9,xmax=-1e9; for(const q of o.its) for(const v of [q.xi,q.xo,q.xc]) if(v!=null){ xmin=Math.min(xmin,v); xmax=Math.max(xmax,v); }
  const yOf=(q,j)=>q.y!=null?q.y:o.y0+j*o.sp, ys=o.its.map(yOf), ytop=Math.max(...ys)+2.5, ybot=Math.min(...ys)-3;
  const LW=LB('ローラーボード（'+o.lab+'。ローラーを支える板）','Wellenbrett'), X0=xmin-3, X1=xmax+3, pc=(x0,x1,y0,y1)=>box(ST,x1-x0,y1-y0,0.8,MAT.wood,(x0+x1)/2,(y0+y1)/2,o.zr-1.1,LW);
  if(!o.win) pc(X0,X1,ybot,ytop); else { const [wx0,wx1,wy0,wy1]=o.win; pc(X0,X1,ybot,wy0); pc(X0,X1,wy1,ytop); pc(X0,wx0,wy0,wy1); pc(wx1,X1,wy0,wy1); }
  const B={zr:o.zr,it:{},ytop};
  o.its.forEach((q,j)=>{ const yk=ys[j], xs=[q.xi,q.xo].concat(q.xc!=null?[q.xc]:[]), a=Math.min(...xs)-0.9, b=Math.max(...xs)+0.9, ud=o.ud?o.ud(q.k):{};
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
/* sticker coupler worked from below (pedal couplers): per note a backfall under the key desk. A nut on the coupler tracker presses
   its front end (zA) down, its back end (zO) rises and pushes a sticker up against the key. The back ends rest on a felted strip;
   the pivot rail and the strip form one frame, which is lowered by OFF to disconnect. r: rise of the back end / drop of the front. */
function mkStickerCplR(o,ST){
  const zP=(o.r*o.zA+o.zO)/(1+o.r), a=o.zA-zP, b=zP-o.zO, y=o.y, g=new T.Group(); CX.root.add(g);
  const R={zP,y,x0:o.x0,x1:o.x1,it:{}}, xm=(o.x0+o.x1)/2, W=o.x1-o.x0, zR=o.zRest!=null?o.zRest:o.zO, bR=zP-zR;
  box(g,W,1,1,MAT.woodDark,xm,y,zP,LB('バックフォールの支点の桟（'+o.lab+'。カプラーを切ると下がる）','Wippenbalken'));
  box(g,W,0.5,1.2,MAT.woodDark,xm,y-0.7,zR,LB('バックフォールの下止め（'+o.lab+'。後ろの腕が載る。支点の桟といっしょに上下する）','Wippenbalken'));
  box(g,W,0.15,1.2,MAT.cloth,xm,y-0.375,zR,LB('下止めのフェルト','Tastenfilz'));
  // end plates join rail and strip (o.plF: their front edge, o.gY: a guide strip for the stickers, carried up by the plates)
  const pF=o.plF!=null?o.plF:zP+0.5, pT=o.gY!=null?o.gY+0.25:y+0.5, pB=y-0.95, pz0=zR-0.6;
  for(const x of [o.x0-0.3,o.x1+0.3]){ box(g,0.6,1.45,pF-pz0,MAT.woodDark,x,y-0.225,(pF+pz0)/2,LB('バックフォールの枠（'+o.lab+'。支点の桟と下止めをつなぐ）','Wippenbalken'));
    if(o.gY!=null) box(g,0.6,pT-(y+0.5),1.2,MAT.woodDark,x,(pT+y+0.5)/2,o.zO,LB('バックフォールの枠（'+o.lab+'）','Wippenbalken')); }
  if(o.gY!=null) box(g,W,0.5,1.2,MAT.woodDark,xm,o.gY,o.zO,LB('スティッカーのガイド（'+o.lab+'。穴に通して上下に案内する）','Stecherführung'));
  for(const k of o.ks){ const x=o.xs(k), ud=o.ud?o.ud(k):{};
    R.it[k]={x,fa:prod(MAT.woodPale,0.3,LB('カプラーのバックフォール（'+o.lab+'。前の腕：トラッカーのナットに押し下げられる）','Wippe'),ud),
      fb:prod(MAT.woodPale,0.3,LB('カプラーのバックフォール（'+o.lab+'。後ろの腕：上がってスティッカーを押し上げる）','Wippe'),ud),
      st:o.lift?null:prod(MAT.woodPale,0.3,LB(o.stLab,'Stecher'),ud), nut:pnut(MAT.leather,0.42,0.3,LB('カプラーのナット（'+o.lab+'。トラッカーに付いていて、カプラーを入れるとバックフォールの前の端に載る）','Ledermutter'),ud)};
  }
  // off: frame offset (0 on, negative off); pC: drop of the coupler tracker. Returns the rise the back end gives (at zO).
  // o.lift: no sticker; the back end lifts a nut on a tracker passing through it at zO (the arm reaches on to zRest)
  R.push=(off,pC)=>{ const dA=Math.max(0,pC+off); return Math.max(0,off+b*dA/a); };
  R.set=(k,off,pC)=>{ const q=R.it[k], x=q.x, dA=Math.max(0,pC+off), f=Math.asin(clamp(dA/a,0,1)), P=V3(x,y+off,zP);
    const tO=V3(x,y+off+b*Math.sin(f),zP-b*Math.cos(f)); q.fa.set(P,V3(x,y+off-a*Math.sin(f),zP+a*Math.cos(f))); q.fb.set(P,V3(x,y+off+bR*Math.sin(f),zP-bR*Math.cos(f)));
    if(q.st) q.st.set(V3(x,tO.y+0.3,o.zO),V3(x,tO.y+0.3+o.Ls,o.zO)); q.nut.at(V3(x,y+0.45-pC,o.zA)); };
  R.hl=(k,v)=>{ const q=R.it[k]; for(const h of [q.fa,q.fb,q.st]) if(h) h.hl(v); };
  R.setRail=off=>{ g.position.y=off; };
  return R;
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
const H3KZ=22.9;   // front of the stop jambs (knob rest position): set back to about the middle of the upper manual's keys
function mkKnobR(name,act,x,y,z){
  const g=new T.Group(); g.position.set(x,y,z); CX.root.add(g);
  const kn=mk(G_CYL,MAT.ebony,g,LB('ストップノブ：'+name+'（手前に引くと入る）','Registerzug')); kn.rotation.x=Math.PI/2; kn.scale.set(1.3,2.2,1.3); kn.position.z=1.1;
  const fc=mk(G_CYL,MAT.ivory,g,LB('ストップ名の札：'+name,'Registerschild')); fc.rotation.x=Math.PI/2; fc.scale.set(0.95,0.25,0.95); fc.position.z=2.3;
  g.traverse(c=>c.userData.act=act); return g;
}
function h3Core(){
  const R=CX.root, ST=new T.Group(); R.add(ST); CX.pool=mkPool();
  const NM=53, NP=30, DIP=1.3, Y0=101, P8=k=>155.5*Math.pow(2,-k/16);
  const MK=[...Array(NM).keys()], PK=[...Array(NP).keys()];
  const m={man:1,auto:true};
  /* ---------- layout of the chests (C/Cis, basses outside) ---------- */
  const HWL=h3Layout(MK,k=>Math.max(P8(k),110*Math.pow(2,-k/24)),0);
  const POL=h3Layout(MK,k=>Math.max(110*Math.pow(2,-k/16),P8(15+k),P8(19+k),36),0);
  const pedW=k=>Math.max(190*Math.pow(2,-k/16),P8(k),200*Math.pow(2,-k/24));
  const TCL=h3TowerLayout(PK.filter(k=>k%2===0),pedW,-470,true), TDL=h3TowerLayout(PK.filter(k=>k%2===1),pedW,470,false);
  const PDX=Object.assign({},TCL.xs,TDL.xs), PDW=Object.assign({},TCL.w,TDL.w);
  const hmat=[], pmat=[], dmat=[]; for(let k=0;k<NM;k++){ hmat.push(mclone(MAT.woodPale)); pmat.push(mclone(MAT.woodPale)); } for(let k=0;k<NP;k++) dmat.push(mclone(MAT.woodPale));
  /* ---------- console: two balanced manuals (as D-02), the Hauptwerk on the lower manual (I), the Positiv on the upper (II).
     The lower keys hang a tracker from their tails (z -10.5): it goes down through an opening in the key desk to a square under
     the console, and runs back under the console. The upper keys push a sticker and a backfall above them (as D-02).
     All couplers stay inside the keyboard width: Pos/Hw is a backfall coupler just under the key desk, between the Hauptwerk
     tracker and the Positiv tracker; Hw/P and Pos/P are sticker couplers worked from below. ---------- */
  const ZHK=-10.5, ZHP=ZHK, ZPP=-6, YHP=78, YPP=87, YJ=84;
  const LO={n:NM,y:Y0,zf:51.5,zt:-11,zh:ZHK,zbal:15.5,zrest:-2,rackTop:Y0+2.3,bed0:-4,bed1:52.5,zfelt:50,dip:DIP,man:1,cheek:'下鍵盤（I・ハウプトヴェルク）の側板',mat:k=>hmat[k],slots:k=>k<NP?[ZPP]:[]};
  const UPm={n:NM,y:Y0+7,zf:34,zt:-12,za:-17,zbal:8,zs:-10,zbp:-13.5,yb:Y0+11,yfoot:Y0-3.35,bed0:-4,bed1:31.8,zfelt:30.8,zrest:-1.5,dip:DIP,man:2,cheek:'上鍵盤（II・ポジティフ）の側板',mat:k=>pmat[k]};
  const lo=buildBalancedManualR(LO,ST), up=buildBalancedManualR(UPm,ST), HWX=lo.hw;
  const pullH=lo.pull, pullP=up.pull, dzH=lo.dz, dzP=up.dz;
  const kx=k=>lo.keys[k].x;
  const LS=LB('演奏台（コンソール）','Spieltisch');
  // console after the AGO standard (as G-03): lower manual's naturals 749 mm above the pedal naturals, pedal sharps' front
  // ends 230 mm behind its front edge, bench 521 mm above the pedal. The side panels stand outside the pedalboard.
  // The key desk has an opening behind the keys for the Hauptwerk trackers; the coupler stickers go through holes.
  const XS=(natIdx(NP-1)+1)*4+9, yDesk=Y0-9.9, ZD0=-11.5, ZD1=-8.9;
  box(ST,2*HWX+6,6.5,55-ZD1,MAT.woodDark,0,Y0-6.6,(55+ZD1)/2,LS); box(ST,2*HWX+6,6.5,ZD0+55,MAT.woodDark,0,Y0-6.6,(ZD0-55)/2,LS);
  // side walls high enough to enclose the stop jambs and the knob shafts behind them
  const YW=Y0+28;
  for(const s of [-1,1]){ box(ST,2,YW,108,MAT.wood,s*XS,YW/2,-1,LB('演奏台の側板','Spieltisch')); box(ST,XS-HWX-3,6.5,110,MAT.woodDark,s*(XS+HWX+3)/2,Y0-6.6,0,LS); }
  // stop jambs: panels between the key cheeks and the side walls, set back from the key fronts; the knobs stand out of them
  for(const s of [-1,1]){ box(ST,XS-1-(HWX+3),YW-(Y0-3.35),1.6,MAT.woodDark,s*(XS-1+HWX+3)/2,(YW+Y0-3.35)/2,H3KZ-1.7,LB('ストップノブの板（ストップジャム）','Registerbank'));
    box(ST,XS+1-(HWX+3),1.2,25.5-(H3KZ-2.5),MAT.wood,s*(XS+1+HWX+3)/2,YW+0.6,(25.5+H3KZ-2.5)/2,LB('ストップジャムの上の板','Spieltisch'));
    box(ST,3.2,YW-(Y0+9),1.6,MAT.woodDark,s*(HWX+1.4),(YW+Y0+9)/2,H3KZ-1.7,LB('ストップジャムの板（上鍵盤の側板の上）','Registerbank')); }
  // nameboard over the back of the upper keys, and the music desk standing on it, leaning back 15° (clear of the hands)
  const ZN=8.5, YN0=Y0+7+KH/2+1.2, YN1=Y0+16.5, DA=0.26, DH=36;
  box(ST,2*HWX+2,YN1-YN0,1,MAT.wood,0,(YN0+YN1)/2,ZN,LB('鍵盤の上の板（ネームボード）','Vorsatzbrett'));
  const md=new T.Group(); md.position.set(0,YN1,ZN-0.5); md.rotation.x=-DA; ST.add(md);
  box(md,2*HWX+6,DH,1,MAT.wood,0,DH/2+0.4,0,LB('譜面台','Notenpult'));
  box(md,2*HWX+6,0.8,3.6,MAT.wood,0,0.4,2.3,LB('譜面台の棚（楽譜を載せる）','Notenpult')); box(md,2*HWX+6,1.4,0.5,MAT.wood,0,1.1,4.1,LB('譜面台の棚の縁','Notenpult'));
  /* Pos/Hw, a backfall coupler just under the key desk. Its front end sits on the tracker hanging from the lower key (z -10.5),
     its back end on the Positiv tracker, which goes on down past the Positiv backfall through the key desk (z -17). Both trackers
     carry a leather nut under the coupler backfall: the rising Hauptwerk tracker lifts the front end, the back end goes down and
     pulls the Positiv tracker. The Positiv backfall's arm just leaves its nut, so the upper key stays at rest. The front ends
     rest on a felted strip; strip and pivot rail form a frame that is raised by OFF (1.2, more than the tracker's rise) to
     disconnect, freeing both nuts. Raising or lowering it is possible while keys are held. */
  const YC=Y0-12.5, ZCO=UPm.za;
  const cPH=(()=>{ const r=up.pull/pullH, zP=(r*ZHK+ZCO)/(1+r), a=ZHK-zP, b=zP-ZCO, g=new T.Group(), X=HWX, zE=ZHK+0.6; CX.root.add(g);
    const R={zP,y:YC,pb:YC-0.95,x0:-X,x1:X,it:[]};
    box(g,2*X,1,1,MAT.woodDark,0,YC,zP,LB('カプラーのバックフォールの支点の桟（Pos/Hw。カプラーを切ると上がる）','Wippenbalken'));
    box(g,2*X,0.5,0.8,MAT.woodDark,0,YC-0.7,zE,LB('カプラーのバックフォールの下止め（Pos/Hw。前の腕の先が載る。支点の桟といっしょに上下する）','Wippenbalken'));
    box(g,2*X,0.15,0.8,MAT.cloth,0,YC-0.375,zE,LB('下止めのフェルト','Tastenfilz'));
    for(const s of [-1,1]) box(g,0.6,1.45,zE+0.5-(ZCO-0.6),MAT.woodDark,s*(X+0.3),YC-0.225,(zE+0.5+ZCO-0.6)/2,LB('カプラーのバックフォールの枠（Pos/Hw。支点の桟と下止めをつなぐ）','Wippenbalken'));
    for(let k=0;k<NM;k++){ const ud={key:k,man:1};
      R.it.push({fa:prod(MAT.woodPale,0.3,LB('カプラーのバックフォール（Pos/Hw。前の腕：ハウプトヴェルクのトラッカーのナットに持ち上げられる）','Koppelwippe'),ud),
        fb:prod(MAT.woodPale,0.3,LB('カプラーのバックフォール（Pos/Hw。後ろの腕：下がってポジティフのトラッカーを引く）','Koppelwippe'),ud),
        nH:pnut(MAT.leather,0.42,0.3,LB('カプラーのナット（ハウプトヴェルクのトラッカーに付いていて、バックフォールの前の腕を持ち上げる）','Ledermutter'),ud),
        tx:ptrk(MAT.woodPale,LB('トラッカー（ポジティフのトラッカーの延長。ポジティフのバックフォールの下を通って Pos/Hw のバックフォールへ）','Abstrakte'),{key:k,man:2})});
    }
    // off: how far the frame is raised (0 on); pH: rise of the Hauptwerk tracker. Returns the drop it gives the Positiv tracker.
    R.push=(off,pH)=>{ const dA=Math.max(0,pH-off); return Math.max(0,b*Math.min(1,dA/a)-off); };
    // pT: the Positiv tracker's actual drop; q0: its point at the Positiv backfall
    R.set=(k,off,pH,pT,q0)=>{ const q=R.it[k], x=kx(k), dA=Math.max(0,pH-off), f=Math.asin(clamp(dA/a,0,1)), P=V3(x,YC+off,zP);
      q.fa.set(P,V3(x,YC+off+(a+0.6)*Math.sin(f),zP+(a+0.6)*Math.cos(f))); q.fb.set(P,V3(x,YC+off-b*Math.sin(f),zP-b*Math.cos(f)));
      q.nH.at(V3(x,YC-0.45+pH,ZHK)); q.tx.set(q0,V3(x,YC-0.3-pT,ZCO),0.3); };
    R.hl=(k,v,vT)=>{ const q=R.it[k]; for(const h of [q.fa,q.fb]) h.hl(v); q.tx.hl(vT); };
    R.setRail=off=>{ g.position.y=off; };
    // the frame slides in guides hanging from the key desk; the Positiv trackers go down through holes in it
    for(const s of [-1,1]) box(ST,0.6,yDesk-(YC-1.5),1.6,MAT.woodDark,s*(X+0.9),(yDesk+YC-1.5)/2,zP,LB('カプラーの枠のガイド（Pos/Hw。演奏台から吊る）','Balgstütze'));
    for(let k=0;k<NM;k++) bore(ST,MAT.dark,kx(k),Y0-9.85,Y0-3.35,ZCO,0.6,LB('ポジティフのトラッカーを通す穴','Luftbohrung'));
    return R; })();
  /* ---------- chests: the Hauptwerk keeps its place in the upper case but has its pallet box at the back, behind the swell box ---------- */
  const KDH=new Float32Array(64), KDP=new Float32Array(64), KDD=new Float32Array(64);
  const SPH=new Float32Array(6), SPP=new Float32Array(5), SPD=new Float32Array(4);
  const w8=new Float32Array(1); let pMan=75;
  const aiP=4*pullP/KPULL, zrP=UPm.za-aiP, aiH=4*pullH/KPULL, YRB=Y0+22, SPR=1.6;
  const zFH=12.83, zFP=zrP+4+3.5;
  const hw=buildChestR({name:'ハウプトヴェルク',ks:MK,xs:HWL.xs,ws:HWL.w,y:425,zF:zFH,zBmax:-96,back:true,rows:h3Rows([5,13,6,10,3,9],0,zFH),KD:KDH,SP:SPH,slDir:-1,slOff:s=>-3*(1-s),Lp:38,c:1,press:()=>pMan,ud:k=>({key:k,man:1})},ST);
  const pos=buildChestR({name:'ポジティフ',ks:MK,xs:POL.xs,ws:POL.w,y:208,zF:zFP,rows:h3Rows([0,14,8,15,4],0,zFP),KD:KDP,SP:SPP,slDir:1,slOff:s=>3*(1-s),Lp:38,c:2,sw:true,press:()=>pMan,ud:k=>({key:k,man:2}),volN:380,back:true},ST);
  // roller order: a tracker rising to its roller passes the rollers below it, in front of their (shorter) input arms but
  // across their longer output arms; where an output arm lies at that tracker's x, that roller goes above (Kahn's sort)
  const topo=(ks,above)=>{ const ind=new Map(ks.map(k=>[k,0])), out=new Map(ks.map(k=>[k,[]])); for(const k of ks) for(const j of ks) if(k!==j&&above(k,j)){ out.get(k).push(j); ind.set(j,ind.get(j)+1); }
    const res=[], q=ks.filter(k=>!ind.get(k)); while(q.length){ q.sort((a,b)=>a-b); const k=q.shift(); res.push(k); for(const j of out.get(k)){ ind.set(j,ind.get(j)-1); if(!ind.get(j)) q.push(j); } }
    return res.length===ks.length?res:ks; };
  /* ---------- Hauptwerk run: tracker hanging from the lower key → square S1 under the console → horizontal tracker back under
     the console and the swell box → square S2 behind the swell box → up to the roller board under the Hauptwerk pallets ---------- */
  const SA=4, zS1=ZHK-SA, yS1=70, zrH=hw.zPd-4, zS2=zrH+aiH+SA, yS2=yS1;
  const rbH=mkRollerBoardR({lab:'ハウプトヴェルク用',inLab:'スクエアの側',outLab:'パレットの側',zr:zrH,y0:305,sp:SPR,ai:aiH,ao:4,its:topo(MK,(k,j)=>Math.abs(kx(k)-HWL.xs[j])<0.9).map(k=>({k,xi:kx(k),xo:HWL.xs[k]})),ud:k=>({key:k,man:1})},ST);
  /* ---------- Positiv run: the pallet box is at the back of the chest too. The tracker from the upper backfall rises to square S3
     behind the console, a horizontal tracker runs back under the swell box to square S4, and a tracker rises from S4 to the
     roller board under the back of the chest (below the swell box floor) ---------- */
  const SA3=4, yS3=Y0+15, zS3=UPm.za-SA3, yS4=yS3+2*SA3, zrP2=pos.zPd-4, zS4=zrP2+aiP+SA3;
  const rbP=mkRollerBoardR({lab:'ポジティフ用',inLab:'スクエアの側',outLab:'パレットの側',zr:zrP2,y0:yS4+2,sp:1.38,ai:aiP,ao:4,its:topo(MK,(k,j)=>Math.abs(kx(k)-POL.xs[j])<0.9).map(k=>({k,xi:kx(k),xo:POL.xs[k]})),ud:k=>({key:k,man:2})},ST);
  box(ST,2*HWX+4,1,1,MAT.woodDark,0,yS3-1,zS3,LB('スクエアの軸受け（ポジティフ用）','Winkelbalken')); box(ST,2*HWX+4,1,1,MAT.woodDark,0,yS4+1,zS4+1,LB('スクエアの軸受け（ポジティフ用）','Winkelbalken'));
  for(const s of [-1,1]){ box(ST,1.2,yS3-1.5-(Y0-3.35),1.6,MAT.woodDark,s*(HWX+2.6),(yS3-1.5+Y0-3.35)/2,zS3,LB('スクエアの軸受けの支柱','Balgstütze'));
    box(ST,1.2,201-(yS4+0.5),1.6,MAT.woodDark,s*(HWX+4),(201+yS4+0.5)/2,zS4+1,LB('スクエアの軸受けの吊り木（スウェルボックスの床から吊る）','Balgstütze')); }
  const LW=LB('スクエアの軸受け','Winkelbalken');
  box(ST,2*HWX+4,1.2,1.2,MAT.woodDark,0,yS1+1,zS1,LW); box(ST,2*HWX+4,1.2,1.2,MAT.woodDark,0,yS2+1,zS2,LW);   // both rails above their pivots
  for(const s of [-1,1]){ box(ST,1.2,yDesk-yS1,1.6,MAT.woodDark,s*(HWX+3),(yDesk+yS1)/2,zS1,LB('スクエアの軸受けの吊り木（演奏台から吊る）','Balgstütze'));
    box(ST,1.2,yS2+1,1.6,MAT.woodDark,s*(HWX+3),(yS2+1)/2,zS2,LB('スクエアの軸受けの支柱','Balgstütze')); }
  /* ---------- pedalboard, 30 keys, toe extension carrying the action and the coupler tracker ---------- */
  // the key extension behind the playing surface is short (28 = 22 cm): the pedal action takes its pull at ZAA, the coupler at ZC,
  // just behind the sharps, so that the coupler tracker can rise in front of the Hauptwerk trackers
  const ZH=80, ZE=4, ZX=-24, KL=ZH-ZX, KP=ZH-ZE, yK=5, KHp=3.4, DEP=3.2, ZAA=-20, ZC=2, ZCT=0.1, PNN=natIdx(NP-1)+1, pxp=k=>keyX(k,PNN,8);
  const aiA=6, zrA=ZAA-aiA, aoA=KPULL*aiA/(DEP*(ZH-ZAA)/KL), aiC=4.5, zrC=ZC-aiC, aoC=ZCT-zrC, pCmax=aoC*DEP*(ZH-ZC)/KL/aiC;
  const zFT=zrA+aoA+3.5, rowsT=h3Rows([5,16,11,12],0,zFT);
  const tc=buildChestR({name:'ペダル（C側）',ks:PK.filter(k=>k%2===0),xs:TCL.xs,ws:TCL.w,y:64,zF:zFT,rows:rowsT,KD:KDD,SP:SPD,slDir:1,slOff:s=>3*(1-s),Lp:50,pedal:true,c:3,ud:k=>({key:k,man:0}),volN:300,back:true},ST);
  const td=buildChestR({name:'ペダル（Cis側）',ks:PK.filter(k=>k%2===1),xs:TDL.xs,ws:TDL.w,y:64,zF:zFT,rows:h3Rows([5,16,11,12],1,zFT).map((r,i)=>Object.assign(r,{z:rowsT[i].z,d:rowsT[i].d})),KD:KDD,SP:SPD,slDir:-1,slOff:s=>3*(1-s),Lp:50,pedal:true,c:4,ud:k=>({key:k,man:0}),volN:300,back:true},ST);
  const LFp=LB('ペダル鍵盤の枠','Pedalklaviatur'), PW=PNN*4+6;
  // kneeboard between the console side walls, just behind the ends of the pedal sharps: it hides the coupler roller board.
  // The swell shoe stands in front of it; only the link rod from the shoe to its axle goes through a slot (x 8 – 12).
  // It reaches down to just over the pedal keys (key tops 6.7 at rest) so that the lowest coupler rollers are hidden too.
  // Above y 70 it steps forward to z 19.5, so that the pedal coupler rollers (y 75 and 79.5, z 8 and 16) are inside too.
  { const LK=LB('ひざ板（ペダルの上の前板。奥のローラーボードを隠す）','Kniebrett'), LU=LB('ひざ板（上の部分。カプラーのローラーを隠す）','Kniebrett'),
      zK=3, y0=8, y1=70, yT=Y0-10, zU=19.5, xo0=8, xo1=12, ys0=13, ys1=17.5;
    box(ST,xo0+XS-1,y1-y0,1,MAT.wood,(xo0-XS+1)/2,(y0+y1)/2,zK,LK); box(ST,XS-1-xo1,y1-y0,1,MAT.wood,(XS-1+xo1)/2,(y0+y1)/2,zK,LK);
    box(ST,xo1-xo0,y1-ys1,1,MAT.wood,(xo0+xo1)/2,(ys1+y1)/2,zK,LK); box(ST,xo1-xo0,ys0-y0,1,MAT.wood,(xo0+xo1)/2,(ys0+y0)/2,zK,LK);
    box(ST,2*XS-2,1,zU-zK+1,MAT.wood,0,y1+0.5,(zK+zU)/2,LU); box(ST,2*XS-2,yT-y1,1,MAT.wood,0,(y1+yT)/2,zU,LU); }
  box(ST,2*PW,1.2,3,MAT.woodDark,0,0.6,ZX+2.5,LB('奥の桟（ばねと下止めのフェルトを受ける）','Federleiste'));
  box(ST,2*PW,yK+1,4,MAT.woodDark,0,(yK+1)/2,ZH+1,LB('蝶番の桟（ペダル鍵のかかと側の支点）','Scharnier'));
  for(const s of [-1,1]) box(ST,2,1.6,KL+6,MAT.woodDark,s*PW,0.8,(ZH+ZX)/2+1,LFp);
  const LBk=LB('オルガンベンチ','Orgelbank'); box(ST,110,2.4,18,MAT.wood,0,72.6,ZH+14,LBk); for(const s of [-1,1]) box(ST,2.4,71.4,16,MAT.wood,s*52,35.7,ZH+14,LBk);
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
    ped.push({k,x,g,sp,top:yK+KHp/2,lm,ta:ptrk(MAT.woodPale,LB('トラッカー（ペダル鍵 → スクエア）','Abstrakte'),ud),
      p1a:prod(MAT.woodPale,0.32,LB('スクエア（ペダル鍵の奥。下向きの引きを手前向きの引きに変える）','Winkel'),ud),p1b:prod(MAT.woodPale,0.32,LB('スクエア（ペダル鍵の奥）','Winkel'),ud),
      thp:ptrk(MAT.woodPale,LB('水平のトラッカー（床の近くを塔の風箱の奥へ）','Abstrakte'),ud),
      p2a:prod(MAT.woodPale,0.32,LB('スクエア（塔の風箱の奥の下。手前向きの引きを下向きの引きに変える）','Winkel'),ud),p2b:prod(MAT.woodPale,0.32,LB('スクエア（塔の風箱の奥の下）','Winkel'),ud),
      tvp:ptrk(MAT.woodPale,LB('トラッカー（スクエア → ペダル塔の風箱用のローラーボード）','Abstrakte'),ud),
      tc:ptrk(MAT.woodPale,LB('カプラーのトラッカー（ペダル鍵 → カプラーのローラーボード）','Abstrakte'),ud),
      ta2:ptrk(MAT.woodPale,LB('トラッカー（ローラー → ペダル塔の風箱のパレット）','Abstrakte'),ud),
      tc2:ptrk(MAT.woodPale,LB('カプラーのトラッカー（ローラー → Hw/P と Pos/P のバックフォール。2つの革ナットでそれぞれのバックフォールの前の端を押し下げる）','Abstrakte'),ud)});
  }
  /* pedal action to the tower chests, whose pallet boxes are at the back: square P1 just behind the key ends (arm toward the
     player 6, upright arm 4), a horizontal tracker near the floor, square P2 under the back of the towers (hanging arm 4, arm
     pointing back 6, so the pull is 1:1), and a tracker up to the roller board under the back of the chests */
  const P1A=6, P1B=4, yP1=9, zP1=ZAA-P1A, zrA2=tc.zPd-aoA, zP2=zrA2+aiA+P1A, yP2=yP1+2*P1B;
  const rbA=mkRollerBoardR({lab:'ペダル塔の風箱用',inLab:'スクエアの側',outLab:'パレットの側',zr:zrA2,y0:yP2+2,sp:1.3,ai:aiA,ao:aoA,its:PK.map(k=>({k,xi:pxp(k),xo:PDX[k]})),ud:k=>({key:k,man:0})},ST);
  const LWp=LB('スクエアの軸受け（ペダル用）','Winkelbalken');
  box(ST,2*PW,1,1,MAT.woodDark,0,yP1-1,zP1-0.2,LWp); box(ST,2*PW,1,1,MAT.woodDark,0,yP2+1,zP2+1,LWp);
  for(const s of [-1,1]){ box(ST,1.4,yP1-1.5,1.4,MAT.woodDark,s*(PW+0.7),(yP1-1.5)/2,zP1-0.2,LB('スクエアの軸受けの支柱','Balgstütze')); box(ST,1.4,yP2+0.5,1.4,MAT.woodDark,s*(PW+0.7),(yP2+0.5)/2,zP2+1,LB('スクエアの軸受けの支柱','Balgstütze')); }
  /* coupler roller board: moves each note from the pedal key to the lower manual key above it. It stands just behind the toes, where
     the swell shoe reaches under the console: the board has an opening for the shoe, the rollers that cross under the shoe lie
     below it or above it, and no tracker rises past another roller's arm (the order below is chosen for that). */
  const CY={}; [[16,17,18],[7,5,1,9,10],[0,2,4,6,3,8,11,12,13,14,15,19,20,21,22,23,24,25,26,27,28,29]].forEach((g,i)=>g.forEach((k,j)=>CY[k]=[10,14.3,22.4][i]+[1.4,1.5,1.5][i]*j));
  const rbC=mkRollerBoardR({lab:'ペダルカプラー用',inLab:'ペダル鍵の側',outLab:'カプラーのトラッカーの側',zr:zrC,win:[2,18,13.6,21.7],ai:aiC,ao:aoC,its:PK.map(k=>({k,y:CY[k],xi:pxp(k),xo:kx(k)})),ud:k=>({key:k,man:0})},ST);
  /* pedal couplers: one tracker per note rises from the coupler roller board at the lower key's x (z = ZCT). Its two leather nuts
     press down the front ends of the Hw/P backfall (y 62, under square S1) and the Pos/P backfall (y 87, under the key desk).
     Hw/P's sticker pushes up S1's arm (z -12.5), so the Hauptwerk run moves but the lower key does not: the key's tracker hangs
     through the arm with its nut underneath, and the arm just rises off the nut. So Pos/Hw is never worked from the pedal.
     Pos/P's sticker goes through the slot in the lower key and lifts the upper key (z -6).
     r: back end's rise per unit of the tracker's drop, so a full pedal key gives the full pull. */
  // Hw/P lifts the lower part of the Hauptwerk tracker directly: its back end carries a leather nut on that tracker
  const rHP=pullH/pCmax, rPP=(UPm.zbal-ZPP)*DIP/up.Lk/pCmax;
  const cHP=mkStickerCplR({lab:'Hw/P',y:YHP,zA:ZCT,zO:ZHP,zRest:ZHP-0.8,lift:true,r:rHP,ks:PK,xs:kx,x0:-50,x1:6.4,ud:k=>({key:k,man:0})},ST);
  const cPP=mkStickerCplR({lab:'Pos/P',y:YPP,zA:ZCT,zO:ZPP,r:rPP,ks:PK,xs:kx,x0:-47.5,x1:8.5,Ls:(Y0+7-KH/2)-(YPP+0.3),stLab:'カプラーのスティッカー（Pos/P。下鍵盤の鍵の穴を通り、上鍵盤の鍵の奥を下から押し上げる）',ud:k=>({key:k,man:0})},ST);
  // the frames slide in guides hanging from the key desk, beside their felt strips
  for(const [cs,zg] of [[cHP,cHP.zP-1.5],[cPP,ZPP+0.2]]) for(const x of [cs.x0-0.9,cs.x1+0.9]) box(ST,0.6,yDesk-(cs.y-1.5),cs===cHP?0.8:1.6,MAT.woodDark,x,(yDesk+cs.y-1.5)/2,zg,LB('バックフォールの枠のガイド（演奏台から吊る）','Balgstütze'));
  for(const k of PK){ bore(ST,MAT.dark,kx(k),Y0-9.85,Y0-3.35,ZPP,0.45,LB('カプラーのスティッカーを通す穴','Luftbohrung')); }
  /* trackers and squares of the Hauptwerk run, and the Positiv run */
  /* the Hauptwerk tracker is in two parts: the upper one hangs from the key and carries the Pos/Hw nut; an eye at its lower end
     lifts the nut of the lower one, which goes on to S1. Hw/P lifts only the lower part, so the key and Pos/Hw stay at rest. */
  const TH=MK.map(k=>{ const ud={key:k,man:1};
    return {tA:ptrk(MAT.woodPale,LB('トラッカー（上の部分。下鍵盤の鍵の奥から吊る → つなぎの金具）','Abstrakte'),ud),
      tL:ptrk(MAT.woodPale,LB('トラッカー（下の部分。つなぎの金具 → スクエア。Hw/P はこの部分だけを持ち上げる）','Abstrakte'),ud),
      jn:pbox(MAT.brass,LB('トラッカーのつなぎの金具（上の部分の下端の目。下の部分のナットを持ち上げる）','Abstraktenhaken'),ud),
      nHP:k<NP?pnut(MAT.leather,0.42,0.3,LB('カプラーのナット（Hw/P。下の部分のトラッカーに付いていて、バックフォールの後ろの端に持ち上げられる）','Ledermutter'),ud):null,
      s1a:prod(MAT.woodPale,0.32,LB('スクエア（演奏台の下。上向きの引きを手前向きの引きに変える）','Winkel'),ud),s1b:prod(MAT.woodPale,0.32,LB('スクエア（演奏台の下）','Winkel'),ud),
      th:ptrk(MAT.woodPale,LB('水平のトラッカー（演奏台とスウェルボックスの下を通って後ろへ）','Abstrakte'),ud),
      s2a:prod(MAT.woodPale,0.32,LB('スクエア（スウェルボックスの後ろ。手前向きの引きを下向きの引きに変える）','Winkel'),ud),s2b:prod(MAT.woodPale,0.32,LB('スクエア（スウェルボックスの後ろ）','Winkel'),ud),
      tv:ptrk(MAT.woodPale,LB('トラッカー（スクエア → ハウプトヴェルクのローラーボード）','Abstrakte'),ud),
      t2:ptrk(MAT.woodPale,LB('トラッカー（ローラー → ハウプトヴェルクのパレット）','Abstrakte'),ud)}; });
  const TP=MK.map(k=>({t1:ptrk(MAT.woodPale,LB('トラッカー（上鍵盤のバックフォール → スクエア）','Abstrakte'),{key:k,man:2}),
    s3a:prod(MAT.woodPale,0.32,LB('スクエア（演奏台の後ろ。下向きの引きを手前向きの引きに変える）','Winkel'),{key:k,man:2}),s3b:prod(MAT.woodPale,0.32,LB('スクエア（演奏台の後ろ）','Winkel'),{key:k,man:2}),
    th:ptrk(MAT.woodPale,LB('水平のトラッカー（スウェルボックスの下を奥へ）','Abstrakte'),{key:k,man:2}),
    s4a:prod(MAT.woodPale,0.32,LB('スクエア（ポジティフの風箱の奥の下。手前向きの引きを下向きの引きに変える）','Winkel'),{key:k,man:2}),s4b:prod(MAT.woodPale,0.32,LB('スクエア（ポジティフの風箱の奥の下）','Winkel'),{key:k,man:2}),
    tv:ptrk(MAT.woodPale,LB('トラッカー（スクエア → ポジティフのローラーボード）','Abstrakte'),{key:k,man:2}),
    t2:ptrk(MAT.woodPale,LB('トラッカー（ローラー → ポジティフのパレット）','Abstrakte'),{key:k,man:2})}));
  const SQ={SA,zS1,yS1,zS2,yS2,ZHK,YJ,YHP,SA3,yS3,zS3,yS4,zS4,P1A,P1B,yP1,zP1,yP2,zP2};
  const B={hw,pos,tc,td,ST,ped,lo,up,rbH,rbP,rbA,rbC,cPH,cHP,cPP,TH,TP,SQ,KDH,KDP,KDD,SPH,SPP,SPD,HWL,POL,PDX,PDW,TCL,TDL,pxp,kx,m,NM,NP,DIP,Y0,UPm,LO,ZH,ZX,KL,DEP,ZAA,ZC,yK,KHp,pullH,pullP,dzH,dzP,aiH,aiP,aiA,aoA,aiC,aoC,pCmax,zrH,zrP,ZHP,ZPP,hmat,pmat,dmat,setP:v=>{pMan=v;}};
  return B;
}
