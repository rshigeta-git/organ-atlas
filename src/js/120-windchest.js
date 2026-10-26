/* ---------------- windchest (slider / spring) ---------------- */
/* channel opening and pallet width of note k (semitones above the compass C). Openings after real chests (C. Pykett,
   "Calculating pallet size": 12-22 mm, up to 300 mm long, 6-10 mm fall): manual 28 mm at C down to 12 mm from about f′,
   pedal 36 mm down to 20 mm. The bars between channels are at least 15 mm thick (thicker where the pipes need a wider
   pitch, as in real chests), and the pallet laps 5 mm onto the bar each side, so neighbouring pallets stay 5 mm apart.
   Where the pitch is too tight for that (treble), the bar takes half the pitch and the lap shrinks to leave a 3 mm gap.
   sc narrows the openings (D-01/D-02 show slimmer pallets with the same 39 mm pitch). */
function palFit(k,pedal,pitch,sc=1){
  const ap=sc*((pedal?20:12)+16*Math.max(0,1-k/30))*MM, cw=Math.min(ap,pitch-Math.min(15*MM,pitch/2)), lap=Math.min(5*MM,(pitch-cw-3*MM)/2);
  return {pw:cw+2*lap,cw};
}
/* bars (Schiede) filling the space between channel openings [l,r] laid side by side between xL and xR */
function chanBars(p,ch,xL,xR,h,d,y,z,mat,label){
  const s=ch.slice().sort((a,b)=>a[0]-b[0]); let x=xL;
  for(const [l,r] of s){ if(l-x>0.05) box(p,l-x,h,d,mat,(l+x)/2,y,z,label); x=r; }
  if(xR-x>0.05) box(p,xR-x,h,d,mat,(xR+x)/2,y,z,label);
}
/* pallet shape, after a real pallet (end and side view): a leather facing over the full length, and under it a wooden body
   whose lower long edges are chamfered and whose ends are cut back at a slope, the hinge end further, so the leather
   sticks out there as the hinge tail. Unit width and height (top face at y=0, down to y=-1), real length L from the
   hinge (z=0); the body's underside reaches past zEye so the pull-down eye sits on it. Fractions taken from the sketch. */
const PAL_F=0.255, PAL_V=0.364, PAL_C=0.206, PAL_GEO={};
MAT.palLeather=std(0xe8e1d2,.9,0);
const palH=pw=>Math.max(1.6,0.54*pw);   // total depth of a pallet of width pw (facing + body)
function palGeo(L,zEye){
  const key=L+'|'+zEye; if(PAL_GEO[key]) return PAL_GEO[key];
  const a0=0.106*L, s0=0.077*L, a1=0.97*L, s1=clamp(a1-zEye-0.6,0.3,0.077*L);
  const rings=[[-PAL_F,0.5,0],[-PAL_F-PAL_V,0.5,PAL_V/(1-PAL_F)],[-1,0.5-PAL_C,1]].map(([y,h,t])=>[[-h,y,a0+s0*t],[h,y,a0+s0*t],[h,y,a1-s1*t],[-h,y,a1-s1*t]]);
  const tris=[], quad=(a,b,c,d)=>tris.push([a,b,c],[a,c,d]);
  for(let r=0;r<2;r++) for(let i=0;i<4;i++) quad(rings[r][i],rings[r][(i+1)%4],rings[r+1][(i+1)%4],rings[r+1][i]);
  quad(...rings[0]); quad(...rings[2]);
  // the body is convex: turn every triangle to face away from its centre
  const cen=V3(0,-(1+PAL_F)/2,L/2), A=V3(0,0,0), B=V3(0,0,0), Cc=V3(0,0,0), n=V3(0,0,0), m=V3(0,0,0), pos=[];
  for(const t of tris){ A.fromArray(t[0]); B.fromArray(t[1]); Cc.fromArray(t[2]); n.subVectors(B,A).cross(m.subVectors(Cc,A)); m.addVectors(A,B).add(Cc).divideScalar(3).sub(cen);
    const tt=n.dot(m)<0?[t[0],t[2],t[1]]:t; for(const p of tt) pos.push(...p); }
  const body=new T.BufferGeometry(); body.setAttribute('position',new T.Float32BufferAttribute(pos,3)); body.computeVertexNormals();
  const face=new T.BoxGeometry(1,PAL_F,L); face.translate(0,-PAL_F/2,L/2);
  body.__shared=face.__shared=true; return PAL_GEO[key]={body,face};
}
/* pallet spring: one brass wire bent into a V with a 2-turn eye at the apex (toward the pallet hinge). Real ones (e.g.
   Otto Heuss) are 50-140 mm long in 1.0-2.2 mm wire; drawn here in 1.6 mm wire with an eye of about 12 mm mean diameter.
   The lower leg's bent tip sits in a saw-kerf of the spring rail (top at yR); the upper leg u (moved by the caller) runs
   from a to the pallet underside; pass u to use a pooled rod instead of a new one. */
const SPR_R=0.75, SPR_W=0.1;
function palSpring(p,x,yc,zc,yR,zR,u){
  const LS=LB('パレットばね（真鍮線をV字に曲げ、頂点を巻いたばね。パレットを押し上げて閉じる）','Ventilfeder');
  for(const dx of [-SPR_W,SPR_W]){ const t=mk(G_COIL,MAT.brass,p,LB('ばねの巻き（ばねの頂点）','Federwindung')); t.rotation.y=Math.PI/2; t.position.set(x+dx,yc,zc); }
  rod(p,SPR_W,MAT.brass,LS).set(V3(x+SPR_W,yc-SPR_R,zc),V3(x+SPR_W,yR+0.08,zR));
  rod(p,SPR_W,MAT.brass,LS).set(V3(x+SPR_W,yR+0.12,zR),V3(x+SPR_W,yR-0.55,zR+0.1));
  box(p,0.16,0.06,1.4,MAT.dark,x+SPR_W,yR+0.01,zR,LB('ばね受けの桟の切り込み（ばねの先を差し込む）','Sägeschnitt'));
  return {u:u||rod(p,SPR_W,MAT.brass,LS),a:V3(x-SPR_W,yc+SPR_R,zc)};
}
function buildChest(o){
  const STP=o.stops||STOPSET, AUTO=!o.stops&&STOPSET.join()!=='0,1,2,3,4', ROWS=o.rows||(AUTO?rowsFor(STP):ZROW), NS=STP.length, MZ0=o.mixz||MIXZ, MZF=si=>si===3?MZ0:rankZ(si,0), KD=o.kd||S.kd, SP=o.sp||S.sp, PM=o.palMat||keyMat, SMc=[], SM=o.sp?(i=>SMc[i]||(SMc[i]=mclone(MAT.woodPale))):stopMat;
  const R=CX.root, ox=o.x||0, oy=o.y||0, oz=o.z||0, P=o.P||(AUTO?pitchFor(STP):5), N=13, W=N*P, spring=!!o.spring;
  const order=o.order||[0,1,2,3,4,5,6,7,8,9,10,11,12];
  const cxj=j=>ox-W/2+P*(j+0.5);
  const C={ox,oy,oz,W,P,spring,pos:k=>cxj(order[k]),tubes:[],chanFlow:new Float32Array(N),pal:[],wires:[],sliders:[],holes:[],holeMats:[],bars:[],valves:[],pins:[],eyes:[],springs:[]};
  const L1=LB('パレットボックス（風箱の下部。常に風で満たされている）','Windkasten');
  box(R,W+2,1,24,MAT.wood,ox,oy+0.5,oz+6,L1);
  box(R,W+2,11,1,MAT.wood,ox,oy+6.5,oz+17.5,LB('パレットボックスの前板（点検のため外せる）','Spund'));
  box(R,W+2,11,1,MAT.wood,ox,oy+6.5,oz-5.5,L1);
  box(R,1,11,24,MAT.wood,ox-W/2-0.5,oy+6.5,oz+6,L1);
  box(R,1,11,24,MAT.wood,ox+W/2+0.5,oy+6.5,oz+6,L1);
  const LC=LB('チャンネルの仕切り（鍵ごとの部屋＝トーンチャンネルを分ける）','Schied');
  const FIT=[]; for(let k=0;k<N;k++) FIT.push(palFit(k,!!o.pedal,P,o.open));
  chanBars(R,FIT.map((f,k)=>[C.pos(k)-f.cw/2,C.pos(k)+f.cw/2]),ox-W/2-0.6,ox+W/2+0.6,12,38.4,oy+18,oz,MAT.woodDark,LC);
  box(R,W+1.2,12,1.2,MAT.woodDark,ox,oy+18,oz+18.6,LC);
  box(R,W+1.2,12,1.2,MAT.woodDark,ox,oy+18,oz-18.6,LC);
  box(R,W+1.2,1,13.2,MAT.woodDark,ox,oy+12.5,oz-12.6,LC);
  box(R,W+2,1.5,38.4,MAT.wood,ox,oy+24.75,oz,LB('テーブル（チャンネルの天板。パイプごとに穴がある）','Fundamentbrett'));
  if(!spring){
    const rs=ROWS.slice().sort((p,q)=>p-q), dz=[-18.4]; for(let j=1;j<rs.length;j++) dz.push((rs[j-1]+rs[j])/2); dz.push(18.4);
    for(const zz of dz){ const wd=o.rows?1.0:3; box(R,W+2,1,wd,MAT.wood,ox,oy+26,oz+zz,LB('ダム（スライダーの間の固定材）','Damm')); }
  }
  const RBD=ROWS.map(z=>{ let lo=-18.4, hi=18.4; for(const q of ROWS){ if(q<z) lo=Math.max(lo,(q+z)/2); if(q>z) hi=Math.min(hi,(q+z)/2); } return [lo,hi]; });
  for(let i=0;i<NS;i++){
    const z=oz+ROWS[i], st=STOPS[STP[i]], mx=nRanks(STP[i])>1, MZ=MZF(STP[i]);
    if(!spring){
      C.sliders.push(box(R,W+14,1,o.rows?2.6:4,MAT.woodPale,ox-5,oy+26,z,LB('スライダー：'+st.name+'（左右に動いて穴を合わせる）','Schleife'))); if(!o.sp) C.sliders[i].userData.stop=i;
      const hm=mclone(MAT.dark); C.holeMats.push(hm); const hs=[];
      for(let k=0;k<N;k++){ const nr=nRanks(STP[i]); for(let r=0;r<nr;r++){ const dd=mk(G_DISC,hm,R,LB('スライダーの穴','Schleifenbohrung')); if(!o.sp) dd.userData.stop=i; dd.rotation.x=-Math.PI/2; const s=mx?0.45:0.65; dd.scale.set(s,s,s); dd.position.set(C.pos(k),oy+26.53,z+(mx?MZ[r]:0)); dd.userData.bx=C.pos(k); hs.push(dd);
        const zz=z+(mx?MZ[r]:0), br=s*0.92; bore(R,hm,C.pos(k),oy+24,oy+25.5,zz,br,LB('テーブルの穴（トーンチャンネルからスライダーへ風が通る）','Kanzellenbohrung')); const sb=bore(R,hm,C.pos(k),oy+25.5,oy+26.5,zz,br,LB('スライダーの穴','Schleifenbohrung'),false); sb.userData.bx=C.pos(k); hs.push(sb); bore(R,hm,C.pos(k),oy+26.5,oy+30,zz,br,LB('上板の穴（スライダーからパイプの足へ風が通る）','Stockbohrung')); if(!o.sp) for(const q of hs.slice(-2)) q.userData.stop=i; } }
      C.holes.push(hs);
      box(R,W+1,3.5,o.rows?RBD[i][1]-RBD[i][0]-0.1:6,MAT.wood,ox,oy+28.25,o.rows?oz+(RBD[i][0]+RBD[i][1])/2:z,LB('上板：'+st.name+'（パイプを立てる台）','Pfeifenstock'));
    } else {
      box(R,W+1,4.5,3.6,MAT.wood,ox,oy+27.75,z+0.9,LB('上板：'+st.name,'Pfeifenstock'));
      for(let k=0;k<N;k++){ bore(R,MAT.dark,C.pos(k),oy+24,oy+25.5,z,0.6,LB('テーブルの穴（ばね弁が下からふさぐ）','Kanzellenbohrung')); bore(R,MAT.dark,C.pos(k),oy+25.5,oy+30,z,0.6,LB('上板の穴（スライダーからパイプの足へ風が通る）','Stockbohrung')); }
      const sm=SM(i);
      C.bars.push(box(R,W+1,1.4,1.2,sm,ox,oy+27.6,z-1.6,LB('ストップバー：'+st.name+'（下がるとピンで弁を押し開ける）','Registerbalken')));
      const vs=[],ps=[];
      for(let k=0;k<N;k++){
        const x=C.pos(k); const pv=new T.Group(); pv.position.set(x,oy+23.6,z+2.2); R.add(pv);
        box(pv,Math.min(P-2.2,FIT[k].cw-0.3),0.7,4,sm,0,0,-2,LB('ばね弁（'+st.name+' / '+KEYNAMES[k]+'。ばねで閉じている）','Springventil'));
        vs.push(pv); ps.push(rod(R,0.13,MAT.iron,LB('ピン（ストップバーが弁を押す）','Stecher')));
      }
      C.valves.push(vs); C.pins.push(ps);
    }
  }
  const PH=[];
  for(let k=0;k<N;k++){
    const x=C.pos(k); const pv=new T.Group(); pv.position.set(x,oy+11.25,oz-4); R.add(pv);
    const PG=palGeo(20,18), ph=palH(FIT[k].pw); PH.push(ph);
    const pb=mk(PG.body,PM(k),pv,LB('パレット（'+KEYNAMES[k]+'の弁。押鍵で下に開く。下の角を落とし、両端を斜めに削ってある）','Spielventil')); pb.scale.set(FIT[k].pw,ph,1); pb.position.y=0.7;
    const pf=mk(PG.face,MAT.palLeather,pv,LB('パレットの革（上面に貼った革。チャンネルの口に密着して風を止める。奥の端は蝶番になる）','Ventilleder')); pf.scale.set(FIT[k].pw,ph,1); pf.position.y=0.7;
    C.pal.push(pv); C.wires.push(rod(R,0.1,MAT.metalDark,LB('引き下げ線（パレットの前端から底板を貫いて下へ出る）','Abzugsdraht')));
    const eye=mk(G_CYL,MAT.brass,R,LB('パレットの目金（引き下げ線を掛ける）','Ventilöse')); eye.scale.set(0.3,0.5,0.3); C.eyes.push(eye);
    const purse=mk(G_CONE,MAT.leather,R,LB('パルペーテ（引き下げ線が底板を通る穴をふさぐ革袋）','Pulpete')); purse.scale.set(0.75,1.1,0.75); purse.position.set(x,oy-0.55,oz+14);
    const sx=FIT[k].pw/2+0.2;
    for(const s of [-1,1]) rod(R,0.1,MAT.brass,LB('パレットのガイドピン（パレットが横にずれないよう案内する）','Ventilführungsstift')).set(V3(x+s*sx,oy+12.5,oz+13.2),V3(x+s*sx,oy+8.4,oz+13.2));
    C.springs.push(palSpring(R,x,oy+3.1,oz-2.6,oy+2,oz+11.5));
  }
  box(R,W,1,1.4,MAT.woodDark,ox,oy+1.5,oz+11.5,LB('ばね受けの桟（切り込みにばねの先を差し込む）','Federleiste'));
  // o.inlet ('L'/'R'): the end of the wind trunk entering the pallet box at that side (as in B-01), so that one sees where the wind comes in
  if(o.inlet){ const s=o.inlet==='L'?-1:1, x0=ox+s*(W/2+0.5), x1=x0+s*7, y=oy+6, z=oz+6;
    (CX.inlets||(CX.inlets=[])).push(V3(x1,y,z));
    duct([V3(x1,y,z),V3(x0,y,z)],6,MAT.wood,LB('風導管（送風機から。ここから風箱に風が入る）','Windkanal'));
    new Tube([V3(x1,y,z),V3(x0-s*2,y,z)],{r:1.7,density:0.6,front:400,state:()=>({open:S.p>10,speed:2+3*C.speaking().length})}); }
  C.vol=new Vol((a,b,c,out)=>out.set(ox-W/2+1+a*(W-2),oy+1.8+b*8.6,oz-4.4+c*21.4),o.volN||380,{state:()=>(S.p>4&&(!o.feed||o.feed.full()))?clamp(0.35+0.65*S.p/75,0,1):0});
  C.chan=[];
  for(let k=0;k<N;k++){
    const x=C.pos(k);
    const ch=new Tube([V3(x,oy+9.5,oz+12),V3(x,oy+13.5,oz+12),V3(x,oy+19,oz+6),V3(x,oy+19,oz-17.5)],{r:0.85,density:0.7,front:900,state:()=>({open:KD[k]>0.22&&C.vol.fill>0.3&&S.p>4,speed:C.chanFlow[k]})});
    C.chan.push(ch);
    for(const fp of [[-1.6,2.4,16.8],[1.6,2.6,-3.8],[0,5.5,17.2]]) new Tube([V3(x+fp[0],oy+fp[1],oz+fp[2]),V3(x+fp[0]*0.4,oy+7,oz+(fp[2]+12)/2),V3(x,oy+9.5,oz+12)],{r:0.25,n:4,front:900,state:()=>({open:ch.head>0&&KD[k]>0.22,speed:C.chanFlow[k]*0.8})});
    for(let i=0;i<NS;i++){
      const si=STP[i], nr=nRanks(si), MZ=MZF(si);
      for(let r=0;r<nr;r++){
        const zz=oz+ROWS[i]+(nr>1?MZ[r]:0);
        const sp=buildPipe(x,zz,si,k,r,oy+30);
        const d=ch.nearestDist(V3(x,oy+19,zz));
        const pts=[V3(x,oy+19,zz),V3(x,oy+24.5,zz),V3(x,oy+30,zz)].concat(sp.path);
        const tb=new Tube(pts,{r:si===3?0.22:0.3,density:0.3,front:900,state:()=>({open:ch.reached(d)&&SP[i]>0.85&&S.p>4,speed:20})});
        tb.exitU=tb.cum[3+sp.ei]/tb.L; tb.mouthAt(sp,3);
        C.tubes.push({k,i:si,j:i,r,tb,md:tb.cum[3+sp.ei]});
        C.top=Math.max(C.top||0,sp.top);
      }
    }
  }
  C.update=function(){
    for(let k=0;k<N;k++){
      const th=Math.asin(clamp(KPULL*KD[k]/18,0,1)), x=C.pos(k); C.pal[k].rotation.x=th;
      const ey=oy+11.25+(0.7-PH[k])*Math.cos(th)-18*Math.sin(th);
      C.wires[k].set(V3(x,ey,oz+14),V3(x,oy-1-KPULL*KD[k],oz+14)); C.eyes[k].position.set(x,ey-0.1,oz+14);
      C.springs[k].u.set(C.springs[k].a,V3(x-SPR_W,oy+11.25+(0.95-PH[k])*Math.cos(th)-14*Math.sin(th),oz-4+(0.95-PH[k])*Math.sin(th)+14*Math.cos(th)));
      C.chanFlow[k]=0;
    }
    for(const t of C.speaking()) C.chanFlow[t.k]+=1;
    for(let k=0;k<N;k++) C.chanFlow[k]=C.chanFlow[k]>0?12+2.5*C.chanFlow[k]:0;
    if(!spring){
      for(let i=0;i<NS;i++){ const off=-1.8*(1-SP[i]); C.sliders[i].position.x=ox-5+off; for(const dd of C.holes[i]) dd.position.x=dd.userData.bx+off; C.holeMats[i].emissive.copy(COL.stop).multiplyScalar(SP[i]>0.85?0.9:0); }
    } else {
      for(let i=0;i<NS;i++){
        const dy=0.8*SP[i], z=oz+ROWS[i]; C.bars[i].position.y=oy+27.6-dy;
        const ph=-Math.asin(clamp(dy/3.8,0,1));
        for(let k=0;k<N;k++){
          const pv=C.valves[i][k]; pv.rotation.x=ph;
          const ey=0.35*Math.cos(ph)+3.8*Math.sin(ph), ez=0.35*Math.sin(ph)-3.8*Math.cos(ph);
          const x=C.pos(k); C.pins[i][k].set(V3(x,oy+26.9-dy,z-1.6),V3(x,pv.position.y+ey,pv.position.z+ez));
        }
      }
    }
    if(o.sp) SMc.forEach((mm,i)=>{ if(mm) mm.emissive.copy(COL.stop).multiplyScalar(0.5*SP[i]); });
  };
  C.pullDown=k=>V3(C.pos(k),oy-1-KPULL*KD[k],oz+14);
  C.speaking=()=>{ const out=[]; if(S.p<8||C.vol.fill<0.3) return out; for(const t of C.tubes) if(KD[t.k]>0.25&&SP[t.j]>0.85) out.push(t); return out; };
  return C;
}

