/* ---------- H-03 stop action: electric ----------
   Each drawknob only works a switch behind the jamb. Drawing it sends a short current through the ON coil of a double-coil
   solenoid at the end of the slider (pushing it in sends one through the OFF coil); the solenoid's plunger moves the slider.
   Couplers, tremulant and cymbelstern keep their mechanism inside the case, but are moved by a solenoid at the arm that the
   knob's rod used to pull. Thin cables run from the switches down under the console and on to the solenoids.
   The combination action (5 combinations, set and cancel) in 410 works by setting the knobs, so it drives the same solenoids. */
function h3Stops(B){
  const ST=B.ST, KN=[], KT=1.5, CBY=4, CBZ=1.2;   // knob travel (an electric drawknob moves only a little); cables run down behind the kneeboard
  const LSol=LB('ストップ用ソレノイド（入りと切りの2つのコイルで鉄心を動かす）','Schleifenzugmagnet');
  // a double-coil solenoid along axis ax ('x' or 'z') centred at p; returns its coil materials (lit while a pulse flows)
  const sol=(p,ax,lab)=>{ const L=7, w=3.4, sx=ax==='x'?L:w, sz=ax==='z'?L:w; box(ST,sx,3.4,sz,MAT.casing,p.x,p.y,p.z,lab||LSol);
    const cm=[mclone(MAT.brass),mclone(MAT.brass)];
    [-1,1].forEach((s,j)=>{ const c=mk(G_CYL,cm[j],CX.root,LB(j?'入りコイル（電流でプランジャーを引き、ストップを入れる）':'切りコイル（電流でプランジャーを押し戻し、ストップを切る）',j?'Einschaltspule':'Ausschaltspule'));
      c.scale.set(1.25,2.6,1.25); if(ax==='x'){ c.rotation.z=Math.PI/2; c.position.set(p.x+s*1.8,p.y,p.z); } else { c.rotation.x=Math.PI/2; c.position.set(p.x,p.y,p.z+s*1.8); } });
    return cm; };
  const cable=(pts,lab)=>{ for(let i=1;i<pts.length;i++) rod(ST,0.12,MAT.dark,LB('電線（ノブのスイッチ → '+lab+'のソレノイド）','Kabel')).set(pts[i-1],pts[i]); };
  // the knob with its switch; returns the switch's back end (start of the cable)
  const knob=(it,o)=>{ it.knob=mkKnobR(o.name,{name:o.name,get:()=>it.on,fn:()=>{ it.on=!it.on; }},o.xk,o.yk,H3KZ);
    box(ST,1.6,1.6,2.2,MAT.ebony,o.xk,o.yk,H3KZ-3,LB('ノブのスイッチ（'+o.name+'。引くと入りの、押すと切りの電流を送る）','Registerschalter'));
    return V3(o.xk,o.yk,H3KZ-4.1); };
  const pulse=it=>{ const on=it.on?1:0; if(on!==it.last){ it.last=on; it.lit=0.35; it.which=on; } };
  const glow=(it,dt)=>{ it.lit=Math.max(0,(it.lit||0)-dt); for(const cm of it.coils||[]) cm.forEach((c,j)=>c.emissive.copy(COL.ctrl).multiplyScalar(it.lit>0&&j===it.which?0.9:0)); };
  const sq=(o)=>{ // stop: o.name, xk, yk, rowz, tgt:[{ch, ys, end:()=>x}]
    const it=Object.assign({v:0,on:!!o.on0,rate:7,coils:[]},o); it.last=it.on?1:0; const lab='（'+o.name+'）';
    const sw=knob(it,o);
    it.T=o.tgt.map(t=>{ const out=Math.sign(t.ch.slEnd-t.ch.cx)||1, xS=t.ch.slEnd+out*8.5, p=V3(xS,t.ys,o.rowz);
      it.coils.push(sol(p,'x'));
      cable([sw,V3(o.xk,o.yk,CBZ),V3(o.xk,CBY,CBZ),V3(xS,CBY,CBZ),V3(xS,CBY,o.rowz+2.4),V3(xS,t.ys-1.7,o.rowz+2.4)],o.name);
      return Object.assign({out,xS,pl:prod(MAT.iron,0.32,LB('プランジャー（コイルに引かれて動く鉄心。スライダーの端につながる）'+lab,'Anker'))},t); });
    it.update=dt=>{ pulse(it); glow(it,dt||0.016); it.knob.position.z=H3KZ+KT*it.v;
      for(const t of it.T){ const e=t.end(); t.pl.set(V3(e,t.ys,o.rowz),V3(e+t.out*7,t.ys,o.rowz)); } };
    KN.push(it); return it;
  };
  // a solenoid that moves a mechanism's arm toward the player (+z), on the line the knob's rod used to take: in front of the arm
  // it pulls; behind it (back, for arms that end just inside the jamb) it pushes
  const drive=(it,o,tip0,back)=>{ const sw=knob(it,o), p=V3(tip0.x,tip0.y,tip0.z+(back?-5.5:9)); it.coils=[sol(p,'z',LB('ソレノイド（'+o.name+(back?'。腕を手前に押す）':'。腕を手前に引く）'),'Schleifenzugmagnet'))];
    cable([sw,V3(o.xk,o.yk,p.z+4.5),V3(o.xk,o.yk-2.2,p.z+4.5),V3(p.x,p.y-2.2,p.z)],o.name);
    it.last=it.on?1:0; it.rate=5; return p; };
  // knob heights are laid out for the manuals at Y0 = 94; dY follows the console when it is set higher
  const hwR=B.hw.rows, poR=B.pos.rows, tdR=B.tc.rows, dY=B.Y0-94, HY=[94,97.4,100.8,104.2,107.6,111].map(y=>y+dY), hwOn=[1,1,0,0,0,0], poOn=[1,0,0,0,0], pdOn=[0,0,1,0];
  const S={hw:[],pos:[],ped:[]};
  hwR.forEach((r,i)=>{ S.hw.push(sq({name:STOPS[r.si].name,xk:-53.5,yk:HY[i],xs:-58.5,rowz:r.z,tr:3,on0:hwOn[i],tgt:[{ch:B.hw,ys:B.hw.yS+0.5,end:()=>B.hw.slEnd-3*(1-B.SPH[i])}]})); });
  poR.forEach((r,i)=>{ S.pos.push(sq({name:STOPS[r.si].name,xk:53.5,yk:HY[i],xs:58.5,rowz:r.z,tr:3,on0:poOn[i],tgt:[{ch:B.pos,ys:B.pos.yS+0.5,end:()=>B.pos.slEnd+3*(1-B.SPP[i])}]})); });
  tdR.forEach((r,i)=>{ S.ped.push(sq({name:STOPS[r.si].name,xk:-59.5,yk:[95.7,99.1,102.5,105.9][i]+dY,xs:-54.5,rowz:r.z,tr:3,on0:pdOn[i],tgt:[{ch:B.tc,ys:B.tc.yS+0.5,end:()=>B.tc.slEnd+3*(1-B.SPD[i])},{ch:B.td,ys:B.td.yS+0.5,end:()=>B.td.slEnd+3*(1-B.SPD[i])}]})); });
  /* pedal couplers: the knob turns a roller lying along x (Koppelwelle) whose arms raise the backfall frame by o.drop */
  const CW=[];
  const welle=(o)=>{ const it=Object.assign({v:0,on:false},o); const pS=drive(it,o,V3(o.xk,o.yk,o.zw),true);
    const L=o.yk-o.yw, xa=Math.min(...o.xr)-1, xb=Math.max(o.xk,...o.xr)+1;
    const wl=mk(G_CYL,MAT.woodPale,ST,LB('カプラーのローラー（'+o.name+'。ノブで回り、腕でウィッペンバルケンを上げ下げする）','Koppelwelle')); wl.rotation.z=Math.PI/2; wl.scale.set(0.9,xb-xa,0.9); wl.position.set((xa+xb)/2,o.yw,o.zw);
    for(const xx of [xa,xb]) box(ST,1.6,2.2,2.2,MAT.woodDark,xx,o.yw,o.zw,LB('ローラーの軸受け','Wellenböckchen'));
    const D=o.drop||1; it.tr=D*L/o.ar; it.drv=prod(MAT.woodPale,0.42,LB('カプラーのローラーの腕（ノブの側）','Koppelwelle')); it.shaft=prod(MAT.iron,0.32,LB('プランジャー（'+o.name+'。ソレノイドに引かれて腕を動かす）','Anker'));
    it.arms=o.xr.map(x=>({x,a:prod(MAT.woodPale,0.42,LB('カプラーのローラーの腕（ウィッペンバルケンを支える）','Koppelwelle')),p:prod(MAT.woodDark,0.5,LB('ウィッペンバルケンの支え','Balgstütze'))}));
    it.off=-D;
    bore(ST,MAT.dark,o.xk,B.Y0-9.85,B.Y0-3.35,o.zw+(B.Y0-6.6-o.yw)*D/o.ar/2,1.4,LB('カプラーのローラーの腕を通す穴','Luftbohrung'));
    it.update=dt=>{ pulse(it); glow(it,dt||0.016); const d=it.tr*it.v, sa=clamp(d/L,0,0.95), ca=Math.sqrt(1-sa*sa), tip=V3(o.xk,o.yw+L*ca,o.zw+L*sa);
      it.knob.position.z=H3KZ+KT*it.v; it.drv.set(V3(o.xk,o.yw,o.zw),tip); it.shaft.set(tip,V3(tip.x,tip.y,pS.z));
      const rise=o.ar*sa; it.off=Math.min(0,-D+rise); o.rail.setRail(it.off);
      for(const q of it.arms){ const t=V3(q.x,o.yw+o.ar*sa,o.zw-o.ar*ca); q.a.set(V3(q.x,o.yw,o.zw),t); q.p.set(t,V3(q.x,o.yU-0.5+it.off,o.zR)); } };
    CW.push(it); KN.push(it); return it; };
  const fH=B.cHP, fP=B.cPP;
  S.cHP=welle({name:'Hw/P',xk:59.5,yk:95.7+dY,yw:75,zw:fH.zP+0.3+13,ar:13,drop:1.7,xr:[fH.x0-0.3,fH.x1+0.3],rail:fH,yU:fH.y-0.45,zR:fH.zP+0.3});
  S.cPP=welle({name:'Pos/P',xk:59.5,yk:99.1+dY,yw:79.5,zw:fP.zP+0.4+19,ar:19,drop:1.7,xr:[fP.x0-0.3,fP.x1+0.3],rail:fP,yU:fP.y-0.45,zR:fP.zP+0.4});
  /* Pos/Hw: the knob turns a roller under the key desk, behind the coupler frame; its arms point forward and carry posts under the
     ends of the frame. Drawing the knob turns the arms down and lowers the frame by o.drop onto the nuts (on); pushing it in raises it. */
  const lift=(o)=>{ const it=Object.assign({v:0,on:false,off:o.drop},o), F=o.rail; const pS=drive(it,o,V3(o.xd,o.yk,o.zw));
    const xa=Math.min(...o.xr)-1.1, xb=o.xd+0.4, L=o.yk-o.yw, ar=F.zP-o.zw, Lp=F.pb+o.drop-o.yw;
    const wl=mk(G_CYL,MAT.woodPale,ST,LB('カプラーのローラー（'+o.name+'。ノブで回り、前向きの腕でカプラーの枠を上げ下げする）','Koppelwelle')); wl.rotation.z=Math.PI/2; wl.scale.set(0.6,xb-xa,0.6); wl.position.set((xa+xb)/2,o.yw,o.zw);
    for(const xx of o.xbr) box(ST,1,B.Y0-9.9-(o.yw-0.6),1.4,MAT.woodDark,xx,(B.Y0-9.9+o.yw-0.6)/2,o.zw,LB('ローラーの軸受け（演奏台から吊る）','Wellenböckchen'));
    bore(ST,MAT.dark,o.xd,B.Y0-9.85,B.Y0-3.35,o.zw+0.5,1.3,LB('カプラーのローラーの腕を通す穴','Luftbohrung'));
    it.tr=L*o.drop/ar; it.drv=prod(MAT.woodPale,0.42,LB('カプラーのローラーの腕（ノブの側）','Koppelwelle')); it.shaft=prod(MAT.iron,0.32,LB('プランジャー（'+o.name+'。ソレノイドに引かれて腕を動かす）','Anker'));
    it.arms=o.xr.map(x=>({x,a:prod(MAT.woodPale,0.42,LB('カプラーのローラーの腕（カプラーの枠を支える）','Koppelwelle')),p:prod(MAT.woodDark,0.5,LB('カプラーの枠の支え','Balgstütze'))}));
    it.update=dt=>{ pulse(it); glow(it,dt||0.016); const d=it.tr*it.v, sa=clamp(d/L,0,0.95), ca=Math.sqrt(1-sa*sa), tip=V3(o.xd,o.yw+L*ca,o.zw+L*sa);
      it.knob.position.z=H3KZ+KT*it.v; it.drv.set(V3(o.xd,o.yw,o.zw),tip); it.shaft.set(tip,V3(tip.x,tip.y,pS.z));
      const ty=o.yw-ar*sa, tz=o.zw+ar*ca; it.off=Math.max(0,o.drop-ar*sa);
      for(const q of it.arms){ q.a.set(V3(q.x,o.yw,o.zw),V3(q.x,ty,tz)); q.p.set(V3(q.x,ty,tz),V3(q.x,ty+Lp,tz)); }
      F.setRail(it.off); };
    CW.push(it); KN.push(it); return it; };
  S.cPH=lift({name:'Pos/Hw',xk:53.5,yk:111+dY,yw:B.Y0-17,zw:B.cPH.zP-13.6,drop:1.2,xr:[-(B.cPH.x1+0.3),B.cPH.x1+0.3],xbr:[-(B.cPH.x1+1.6),51.5],xd:52.6,rail:B.cPH});
  /* tremulant and cymbelstern: square and trace to their valves on the wind riser */
  const term=(o)=>{ const it=Object.assign({v:0,on:false},o), zs=o.rowz+5, lab='（'+o.name+'）', ax=o.xk-o.xs;
    const pS=drive(it,o,V3(o.xk,o.yk,zs));
    box(ST,1.4,1.6,1.4,MAT.woodDark,o.xs,o.yk,zs,LB('スクエアの軸受け'+lab,'Winkel'));
    it.shaft=prod(MAT.iron,0.32,LB('プランジャー'+lab,'Anker'));
    it.aA=prod(MAT.woodPale,0.42,LB('スクエアの腕（ソレノイドの側）'+lab,'Winkel')); it.aB=prod(MAT.woodPale,0.42,LB('スクエアの腕（トレースの側）'+lab,'Winkel'));
    it.term=prod(MAT.woodPale,0.35,LB('トレース（'+o.name+'の弁へ）','Registerzug'));
    it.update=dt=>{ pulse(it); glow(it,dt||0.016); const d=o.tr*it.v, sp=clamp(-d/ax,-0.95,0.95), cp=Math.sqrt(1-sp*sp);
      const tA=V3(o.xs+ax*cp,o.yk,zs-ax*sp), tB=V3(o.xs-5*sp,o.yk,zs-5*cp);
      it.knob.position.z=H3KZ+KT*it.v; it.shaft.set(tA,V3(tA.x,tA.y,pS.z)); it.aA.set(V3(o.xs,o.yk,zs),tA); it.aB.set(V3(o.xs,o.yk,zs),tB); it.term.set(tB,V3(o.xT-5*sp,o.yk,o.rowz)); };
    KN.push(it); return it; };
  S.zimb=term({name:'Zimbelstern',xk:59.5,yk:105.9+dY,xs:54.5,rowz:-140,tr:3,xT:27});
  S.trem=term({name:'Tremulant',xk:59.5,yk:109.3+dY,xs:54.5,rowz:-158,tr:3,xT:22});
  B.KN=KN; B.ST_=S;
  return S;
}
