/* ---------- D-05: electro-pneumatic action on the slider chest of D-02 ----------
   After a section drawing. In the pallet box each note has a wedge bellows A, hinged at the back; its top board is hooked to the
   pallet. At rest the box's wind comes in through hole E, past valve S and along a passage in the bellows' base board, so A is
   full: the pressure inside and outside is equal and the spring holds the pallet shut. The key closes a contact; the current
   runs to the magnet under the box floor, whose armature D pushes a rod up: S rises, shuts E and opens F, a hole through the
   floor. A's wind escapes through F, the box's wind presses A flat, and its top board pulls the pallet open.
   The circuit: battery + → the lower contact strips on their common rail behind the keys → (a bump on the key bends the lower strip
   up against the upper one, which gives a little) → the note's upper strip and cable → magnet → common return across all the
   magnets → battery −. */
let D05V={cut:0,cutK:0,s1:[[0,0,0],[0,0,0]],s2:[[0,0,0],[0,0,0]],s3:[[0,0,0],[0,0,0]],s4:[[0,0,0],[0,0,0]]};   // views of the steps, set when the model is built
const EP_LEG='<span><i style="background:var(--ctrl)"></i>電流（鍵の接点から電磁石へ）</span>';
function buildElectroPneu(){
  const R=CX.root, N=13, KD=new Float32Array(N), U=[], oy=48;
  const chest=buildFullChest(fullChestPlan(oy,-12,34-1000*MM),null,'R',false,KD,{ep:{L:27,wireTo:k=>U[k].hook}});
  const kb=buildBalanceKeyboard({x:0,y:0,z:34,noRack:true,cut:9}); box(R,30,8.5,61,MAT.woodDark,0,-7.75,5.5,LB('演奏台（コンソール）の台','Spieltisch'));
  const {zH,xL,xR,zF,zB,Lp,pw}=chest, cx=(xL+xR)/2, zPd=zF-3.5;
  // along the note: the spring's block, A's hinge, the rod to the pallet, A's free end, the valve S
  const zhA=zH+8, zR=zH+27, zTip=zR+3, zS=zPd-2.5, zIn=zTip-5, yFl=oy+1, yB=oy+1.7, yP=oy+1.35, PT=0.5, H1=1.3, H0=0.3, rA=zR-zhA, LA=zTip-zhA, LS=0.55;
  // armature D under the floor: hinged behind the magnet, its free end under the rod
  const yPl=oy-1, yCo=yPl-6.5, yD=yCo-1.2, zAh=zS-12.5, rD=zS-zAh;
  box(R,xR-xL,2,2,MAT.woodDark,cx,yFl+1,zH+5,LB('ばねの台','Federbock'));
  const LM=mclone(MAT.leather); LM.side=T.DoubleSide; { const o=XRAY.indexOf(buildElectroPneu.lm); if(o>=0) XRAY.splice(o,1); } XRAY.push(LM); buildElectroPneu.lm=LM;
  const LBG=LB('くさび型ふいご A（ふだんは風で膨らみ、風が抜けると風箱の風圧でつぶれてパレットを引く）','Bälgchen'), LF=LB('ひだ（革）','Falten'), LC=LB('電磁石（電流が流れると接極子 D を引き上げる）','Elektromagnet'), LSP=LB('パレットばね（パレットを押し上げて閉じる）','Ventilfeder');
  const LBD=LB('ふいご A の台板（中に風の通路が掘ってある）','Unterplatte'), LPS=LB('A と弁 S を結ぶ通路','Luftbohrung'), LSV=LB('弁 S の箱','Steuerventil');
  // contacts behind the keys, sprung brass strips held at the back: a bump on the key bends the lower strip (+, common rail) up against
  // the upper one (one per key, its cable goes to the magnet), which gives a little. The strips slope down toward the bump, which
  // stands nearer the balance rail, so the key's tail, rising further than the bump, stays clear of them.
  const y0=kb.y0, RW=13*TAILP+3, zT=kb.zt, zBp=zT+10, zCt=zBp+1.4, zFx=zT-4, zRl=zFx-1.5, Lc=zCt-zFx, yTop=y0+KH/2, BH=0.45, ySt=yTop+BH+0.03, SLP=0.14, yR0=ySt+SLP*(zBp-zFx), GAP=0.32, DG=GAP+0.22, NSG=6, zRs=-38, yTray=yD-3;
  const fB=t=>t*t*(3-t)/2, tB=(zBp-zFx)/Lc, PW=mclone(MAT.brass), GW=mclone(MAT.brass), CB=mclone(MAT.brass), CU=mclone(MAT.brass); CU.color.set(0xb4683a); PW.color.set(0xc22d22); GW.color.set(0x2455b8);
  box(R,RW,1,3,CU,0,yR0-0.58,zRl,LB('＋の接点の台（下の接点板に共通。電池の＋につながる）','Tastenkontakt'));
  box(R,RW,DG-0.16,3,MAT.wood,0,yR0+DG/2,zRl,LB('接点の間の絶縁の板','Tastenkontakt')); box(R,RW,0.6,3,MAT.wood,0,yR0+DG+0.38,zRl,LB('上の接点板を押さえる板','Tastenkontakt'));
  for(const s of [-1,1]) box(R,1,yR0+DG+0.68+12,3,MAT.woodDark,s*(RW/2+0.5),(yR0+DG+0.68-12)/2,zRl,LB('接点の台の支え','Balgstütze'));
  // the battery beside the console, and its two wires
  const xBp=-21, xBn=-27, zBt=-14, yBt=-3.2, LBT=LB('電池（＋と−の電圧を回路にかける）','Batterie');
  box(R,14,8.4,9,MAT.ebony,(xBp+xBn)/2,-12+4.2,zBt,LBT);
  for(const [x,m] of [[xBp,PW],[xBn,GW]]) cyl(R,1,0.8,m,x,-3.2,zBt,LBT);
  const yPlus=y0+6, sgn=(x,w,h,m)=>box(R,w,0.2,h,m,x,-3.5,zBt+3.2,LBT); sgn(xBp,1.6,0.35,PW); sgn(xBp,0.35,1.6,PW); sgn(xBn,1.6,0.35,GW);
  const wire=(P,m,lab)=>{ for(let i=1;i<P.length;i++) rod(R,0.16,m,lab).set(P[i-1],P[i]); };
  wire([V3(xBp,yBt,zBt),V3(xBp,yR0-0.58,zBt),V3(xBp,yR0-0.58,zRl),V3(-RW/2,yR0-0.58,zRl)],PW,LB('＋の電線（電池 → 接点の台）','Kabel'));
  // common return across the magnets, back to the battery
  const zG=zS-9.6, yG=yPl-1.3, yT2=yTray+1.2, LGW=LB('−の共通線（すべての電磁石を横断して電池の−へ戻る）','Kabel');
  rod(R,0.16,GW,LGW).set(V3(xL-0.5,yG,zG),V3(xR-1,yG,zG));
  wire([V3(xBn,yBt,zBt),V3(xL-0.5,yBt,zBt),V3(xL-0.5,yT2,zBt),V3(xL-0.5,yT2,zG),V3(xL-0.5,yG,zG)],GW,LGW);   // out sideways from the battery, then up toward the chest
  for(let k=0;k<N;k++){ const x=chest.pos(k), xk=kb.kx(k), w=Math.min(pw[k]-0.4,4), pitch=Math.min(x-(k?chest.pos(k-1):x-99),(k<N-1?chest.pos(k+1):x+99)-x), rc=Math.min(1.5,pitch/2-0.15), mt=keyMat(k), q={a:1,s:0,hook:V3(x,0,zR)};
    // base board with its passage, valve box with hole E on top, hole F through the floor
    box(R,w+0.8,yB-yFl,zS+2.2-(zhA-0.6),MAT.wood,x,(yFl+yB)/2,(zS+2.2+zhA-0.6)/2,LBD);
    boreAB(R,MAT.dark,V3(x,yP,zIn),V3(x,yP,zS-1),0.2,LPS,false); bore(R,MAT.dark,x,yP,yB,zIn,0.2,LPS,false); bore(R,MAT.dark,x,yP,yB,zS-1,0.2,LPS,false);
    bore(R,MAT.dark,x,oy,yB,zS,0.45,LB('穴 F（床を貫く排気の穴。弁 S が上がると開く）','Kegelsitz'));
    const wv=Math.min(w,3); for(const s of [-1,1]){ box(R,wv,0.85,0.4,MAT.wood,x,yB+0.425,zS+s*1.5,LSV); box(R,0.4,0.85,2.6,MAT.wood,x+s*(wv/2-0.2),yB+0.425,zS,LSV); }
    box(R,wv,0.4,3.4,MAT.wood,x,yB+1.05,zS,LB('弁 S の箱の天板（穴 E から風箱の風が入る）','Steuerventil'));
    bore(R,MAT.dark,x,yB+0.85,yB+1.25,zS,0.42,LB('穴 E（風箱の風の入口。弁 S が上がるとふさがる）','Kegelsitz'));
    q.S=cyl(R,0.75,0.25,MAT.leather,x,0,zS,LB('弁 S（ふだんは穴 F をふさぎ、上がると穴 E をふさぐ）','Steuerventil'));
    q.rod=rod(R,0.1,MAT.iron,LB('弁の棒（接極子 D に押し上げられる）','Ventilstange')); q.nut=cyl(R,0.35,0.4,MAT.brass,x,0,zS,LB('棒の調整ナット','Ledermutter'));
    // wedge A
    q.g=new T.Group(); q.g.position.set(x,yB,zhA); R.add(q.g); box(q.g,w,PT,LA,mt,0,PT/2,LA/2,LBG);
    q.sd=[-1,1].map(s=>{ const t=mk(G_TRI,LM,R,LF); t.rotation.y=-Math.PI/2; t.position.set(x+s*(w/2-0.15),yB,zhA); return t; }); q.fr=box(R,w-0.3,1,0.2,MAT.leather,x,yB,zTip,LF);
    // spring: coil on its block, one arm on the block, one under the pallet
    const yCoil=yFl+5, zCoil=zH+1.2; for(const dx of [-0.16,0.16]){ const t=mk(G_COIL,MAT.brass,R,LSP); t.rotation.y=Math.PI/2; t.scale.setScalar(1.3); t.position.set(x+dx,yCoil,zCoil); }
    rod(R,0.1,MAT.brass,LSP).set(V3(x,yCoil-0.95,zCoil),V3(x,yFl+1.8,zH+4.6));   // the lower leg ends in the block
    q.arm=rod(R,0.1,MAT.brass,LSP); q.armA=V3(x,yCoil+0.95,zCoil);
    // magnet: plate, two coils, armature with its hinge post
    const LPt=LB('電磁石の取り付け板','Elektromagnet'); box(R,2*rc+0.2,1,rD-1.2,MAT.woodDark,x,oy-0.5,(zAh+zS-1.2)/2,LPt);
    q.cm=mclone(MAT.brass); q.cm.color.set(0x2a2a2e); for(const z of [zS-3.2,zS-7.2]){ const c=mk(G_CYL,q.cm,R,LC); c.scale.set(rc,yPl-yCo,rc); c.position.set(x,(yPl+yCo)/2,z); }
    q.D=new T.Group(); q.D.position.set(x,yD,zAh); R.add(q.D); box(q.D,2*rc,0.7,rD+0.6,MAT.metalDark,0,0,(rD+0.6)/2,LB('接極子 D（電磁石に引き上げられ、棒を押し上げる）','Anker'));
    box(R,0.5,yPl-yD,0.5,MAT.metalDark,x,(yPl+yD)/2,zAh-0.5,LB('接極子の支え','Anker'));
    // contact and cable
    { const L=mk(G_SPH,MAT.woodPale,kb.piv[k].pv,LB('鍵の突起（鍵が上がると下の接点板を押し上げる）','Tastenkontakt')); L.scale.set(0.4,BH,0.6); L.position.set(xk,KH/2,zBp-kb.zb); L.userData.key=k; }
    const LRD=LB('下の接点板（＋。突起に押されてしなり、上の接点板に触れる）','Tastenkontakt'), LGN=LB('上の接点板（鍵ごとの出力。触れると少したわみ、電流を電磁石へ送る）','Tastenkontakt');
    q.gm=mclone(MAT.brass);
    q.rs=[...Array(NSG).keys()].map(()=>plank(R,0.6,0.14,CB,LRD)); q.gs=[...Array(NSG).keys()].map(()=>plank(R,0.6,0.14,q.gm,LGN));
    box(R,0.6,0.14,3,CB,xk,yR0,zRl,LRD); box(R,0.6,0.14,3,q.gm,xk,yR0+DG,zRl,LGN); q.dome=mk(G_SPH,CB,R,LRD); q.dome.scale.set(0.24,0.17,0.24);
    q.w=mclone(MAT.ebony); const zc=zS+12+3*Math.abs(k-6), xe=x+Math.min(0.6,rc), P=[V3(xk,yR0+DG,zRl-1.5),V3(xk,yR0+DG,zRs),V3(xk,yTray,zRs),V3(xk,yTray,zc),V3(xe,yTray,zc),V3(xe,yTray,zS+2.6),V3(xe,oy-1.6,zS+2.6),V3(xe,oy-1.6,zS-1)];
    for(let i=1;i<P.length;i++) rod(R,0.13,q.w,LB('電線（鍵の接点 → 電磁石）','Kabel')).set(P[i-1],P[i]);
    rod(R,0.1,GW,LGW).set(V3(x,yG,zG),V3(x,yG,zS-7.2-rc));
    // flows: drawn by their streamlines, particles would be wider than these passages
    new Tube([V3(x,yB+3,zS),V3(x,yB+0.7,zS),V3(x,yB+0.5,zS-1),V3(x,yP,zS-1),V3(x,yP,zIn),V3(x,yB+0.3,zIn)],{noPts:true,exact:true,r:0.15,front:40,state:()=>({open:q.s<0.5&&q.a<0.98,speed:8})});
    new Tube([V3(x,yB+0.3,zIn),V3(x,yP,zIn),V3(x,yP,zS-1),V3(x,yB+0.4,zS-1),V3(x,yB+0.4,zS),V3(x,oy-1.2,zS),V3(x,oy-4,zS+1.4)],{kind:'air',noPts:true,exact:true,r:0.15,front:40,state:()=>({open:q.s>0.5&&q.a>0.02,speed:10})});
    new Vol((a,b,c,out)=>{ const u=0.1+0.85*a, z=zhA+u*LA, h=(H0+(H1-H0)*q.a)*u*LA/rA; out.set(x+(c-0.5)*(w-0.6),yB+0.1+b*Math.max(0,h-0.1),z); },24,{state:()=>q.a>0.1?q.a:0,rate:4});
    U.push(q); }
  { const x4=chest.pos(4), xk=kb.kx(4); D05V={cutK:(120-(xk+0.02))/240,s1:[[xk+34,20,6],[xk-10,2,-22]],cut:(120-(x4+0.02))/240,s2:[[x4+62,oy+6,zS-12],[x4,oy+1,zS-13]],s3:[[x4+26,oy-2,zS+3],[x4,oy-4,zS-3]],s4:[[x4+62,oy+6,zS-12],[x4,oy+1,zS-13]]}; }
  chest.finish();
  return {chest,
    pins:[{t:'鍵の接点',p:V3(0,yR0+3,zRl)},{t:'電池',p:V3((xBp+xBn)/2,1,zBt)},{t:'電線',p:V3(cx+50,yTray+2,zS+18)},{t:'−の共通線',p:V3(xL-3,yG,zG)},{t:'電磁石',p:V3(xR+3,yCo+3,zS-5)},{t:'接極子 D',p:V3(xR+3,yD-1,zS-3)},{t:'くさび型ふいご A',p:V3(xR+3,yB+2,zR)},{t:'弁 S',p:V3(xR+3,yB+3,zS)},{t:'風箱（パレット）',p:V3(xR+4,chest.base,zF)}],
    update(dt){ kb.update(); let any=false;
      for(let k=0;k<N;k++){ const q=U[k], x=chest.pos(k), xk=kb.kx(k), u=Math.max(0,(zBp>kb.zb?0:(kb.zb-zBp))*Math.sin(kb.th(k))-0.03), on=u>=GAP, v=Math.max(0,u-GAP); any=any||on;
        // the strips bend like a beam fixed at the back; u: the lower strip's rise at the bump, v: how far it pushes the upper one
        const bend=(ss,y,d)=>{ let pz=zFx, py=y; for(let i=1;i<=NSG;i++){ const t=i/NSG, z=zFx+Lc*t, yy=y-SLP*Lc*t+d*fB(t)/fB(tB); ss[i-1].set(V3(xk,py,pz),V3(xk,yy,z)); pz=z; py=yy; } };
        bend(q.rs,yR0,u); bend(q.gs,yR0+DG,v); q.dome.position.set(xk,ySt+u+0.12,zBp);
        q.s=clamp(q.s+(on?1:-1)*dt*40,0,1); q.a=clamp(q.a+(q.s>0.5?-9:7)*dt,0,1); KD[k]=1-q.a;
        const h=H0+(H1-H0)*q.a, sn=h/rA, th=Math.asin(sn), c=Math.cos(th), hh=LA*sn;
        q.g.rotation.x=-th; q.sd.forEach(t=>t.scale.set(LA*c,Math.max(0.01,hh),1)); q.fr.scale.y=Math.max(0.05,hh); q.fr.position.set(x,yB+hh/2,zhA+LA*c);
        q.hook.set(x,yB+PT+h,zR);
        const l=LS*q.s; q.S.position.y=yB+0.125+l; q.D.rotation.x=-Math.asin(l/rD); q.rod.set(V3(x,yD+0.4+l,zS),V3(x,yB+2+l,zS)); q.nut.position.y=yD+0.55+l;
        // the spring's moving arm lies under the pallet, a third of the way along
        const tp=Math.asin(clamp(KPULL*KD[k]/(Lp-2),0,1)), Ls=12, ph=palH(pw[k]); q.arm.set(q.armA,V3(x,chest.oy+13-0.1-(ph-0.25)*Math.cos(tp)-Ls*Math.sin(tp),zH+Ls*Math.cos(tp)-(ph-0.25)*Math.sin(tp)));
        const g=on?1:0; q.w.emissive.copy(COL.ctrl).multiplyScalar(g); q.gm.emissive.copy(COL.ctrl).multiplyScalar(0.7*g); q.cm.emissive.copy(COL.ctrl).multiplyScalar(0.8*g); }
      const ga=any?0.9:0; PW.emissive.copy(COL.ctrl).multiplyScalar(ga); GW.emissive.copy(COL.ctrl).multiplyScalar(ga); CB.emissive.copy(COL.ctrl).multiplyScalar(0.6*(any?1:0)); CU.emissive.copy(COL.ctrl).multiplyScalar(0.6*(any?1:0));
      chest.update(dt); }
  };
}
