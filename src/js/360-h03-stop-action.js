/* ---------- H-03 stop action: drawknob → shaft → square (vertical pin) → trace along x → roller at the chest end → slider ---------- */
function h3Stops(B){
  const ST=B.ST, KN=[];
  const sq=(o)=>{ // o: name, act, xk, yk, xs, rowz, tgt:[{xe,ys,end:()=>x}], tr
    const it=Object.assign({v:0,on:!!o.on0},o); it.zs=o.rowz+5;
    const lab='（'+o.name+'）';
    it.knob=mkKnobR(o.name,{name:o.name,get:()=>it.on,fn:()=>{ it.on=!it.on; }},o.xk,o.yk,H3KZ);
    box(ST,1.4,1.6,1.4,MAT.woodDark,o.xs,o.yk,it.zs,LB('スクエアの軸受け'+lab,'Winkel'));
    it.shaft=prod(MAT.woodPale,0.38,LB('ノブの軸'+lab,'Registerzugstange'));
    it.aA=prod(MAT.woodPale,0.42,LB('スクエアの腕（ノブの側）'+lab,'Winkel')); it.aB=prod(MAT.woodPale,0.42,LB('スクエアの腕（トレースの側）'+lab,'Winkel'));
    it.T=o.tgt.map(t=>{ const zr=o.rowz+4, y0=Math.min(o.yk,t.ys)-1.5, y1=Math.max(o.yk,t.ys)+1.5;
      const rl=mk(G_CYL,MAT.woodPale,ST,LB('ストップのローラー（縦軸で回る）'+lab,'Registerwelle')); rl.scale.set(0.7,y1-y0,0.7); rl.position.set(t.xe,(y0+y1)/2,zr);
      for(const yy of [y0,y1]) box(ST,2,1.2,2,MAT.woodDark,t.xe,yy,zr,LB('ローラーの軸受け','Wellenböckchen'));
      return Object.assign({zr,tr:prod(MAT.woodPale,0.35,LB('トレース（水平に左右へ動く引き棒）'+lab,'Registerzug')),a1:prod(MAT.woodPale,0.42,LB('ローラーの下の腕'+lab,'Registerärmchen')),
        a2:prod(MAT.woodPale,0.42,LB('ローラーの上の腕'+lab,'Registerärmchen')),lk:prod(MAT.woodPale,0.35,LB('スライダーへのつなぎ棒'+lab,'Schleifenzug'))},t); });
    it.update=()=>{
      const d=o.tr*it.v, ax=o.xk-o.xs, sp=clamp(-d/ax,-0.95,0.95), cp=Math.sqrt(1-sp*sp);
      const tA=V3(o.xs+ax*cp,o.yk,it.zs-ax*sp), tB=V3(o.xs-5*sp,o.yk,it.zs-5*cp), dx=-5*sp;
      it.knob.position.z=H3KZ+d; it.shaft.set(tA,V3(o.xk,o.yk,H3KZ+d)); it.aA.set(V3(o.xs,o.yk,it.zs),tA); it.aB.set(V3(o.xs,o.yk,it.zs),tB);
      for(const t of it.T){ const s2=clamp(-dx/4,-0.95,0.95), c2=Math.sqrt(1-s2*s2), t1=V3(t.xe-4*s2,o.yk,t.zr-4*c2), t2=V3(t.xe-4*s2,t.ys,t.zr-4*c2);
        t.tr.set(tB,t1); t.a1.set(V3(t.xe,o.yk,t.zr),t1); t.a2.set(V3(t.xe,t.ys,t.zr),t2); t.lk.set(t2,V3(t.end(),t.ys,o.rowz)); }
    };
    KN.push(it); return it;
  };
  // knob heights are laid out for the manuals at Y0 = 94; dY follows the console when it is set higher
  const hwR=B.hw.rows, poR=B.pos.rows, tdR=B.tc.rows, dY=B.Y0-94, HY=[94,97.4,100.8,104.2,107.6,111].map(y=>y+dY), hwOn=[1,1,0,0,0,0], poOn=[1,0,0,0,0], pdOn=[0,0,1,0];
  const S={hw:[],pos:[],ped:[]};
  hwR.forEach((r,i)=>{ S.hw.push(sq({name:STOPS[r.si].name,xk:-53.5,yk:HY[i],xs:-58.5,rowz:r.z,tr:3,on0:hwOn[i],tgt:[{xe:-280,ys:B.hw.yS+0.5,end:()=>B.hw.slEnd-3*(1-B.SPH[i])}]})); });
  poR.forEach((r,i)=>{ S.pos.push(sq({name:STOPS[r.si].name,xk:53.5,yk:HY[i],xs:58.5,rowz:r.z,tr:3,on0:poOn[i],tgt:[{xe:218,ys:B.pos.yS+0.5,end:()=>B.pos.slEnd+3*(1-B.SPP[i])}]})); });
  tdR.forEach((r,i)=>{ S.ped.push(sq({name:STOPS[r.si].name,xk:-59.5,yk:[95.7,99.1,102.5,105.9][i]+dY,xs:-54.5,rowz:r.z,tr:3,on0:pdOn[i],tgt:[{xe:-300,ys:B.tc.yS+0.5,end:()=>B.tc.slEnd+3*(1-B.SPD[i])},{xe:300,ys:B.td.yS+0.5,end:()=>B.td.slEnd+3*(1-B.SPD[i])}]})); });
  /* pedal couplers: the knob turns a roller lying along x (Koppelwelle) whose arms raise the backfall frame by o.drop */
  const CW=[];
  const welle=(o)=>{ const it=Object.assign({v:0,on:false},o); it.knob=mkKnobR(o.name,{name:o.name,get:()=>it.on,fn:()=>{ it.on=!it.on; }},o.xk,o.yk,H3KZ);
    const L=o.yk-o.yw, xa=Math.min(...o.xr)-1, xb=Math.max(o.xk,...o.xr)+1;
    const wl=mk(G_CYL,MAT.woodPale,ST,LB('カプラーのローラー（'+o.name+'。ノブで回り、腕でウィッペンバルケンを上げ下げする）','Koppelwelle')); wl.rotation.z=Math.PI/2; wl.scale.set(0.9,xb-xa,0.9); wl.position.set((xa+xb)/2,o.yw,o.zw);
    for(const xx of [xa,xb]) box(ST,1.6,2.2,2.2,MAT.woodDark,xx,o.yw,o.zw,LB('ローラーの軸受け','Wellenböckchen'));
    const D=o.drop||1; it.tr=D*L/o.ar; it.drv=prod(MAT.woodPale,0.42,LB('カプラーのローラーの腕（ノブの側）','Koppelwelle')); it.shaft=prod(MAT.woodPale,0.38,LB('ノブの軸（'+o.name+'）','Registerzugstange'));
    it.arms=o.xr.map(x=>({x,a:prod(MAT.woodPale,0.42,LB('カプラーのローラーの腕（ウィッペンバルケンを支える）','Koppelwelle')),p:prod(MAT.woodDark,0.5,LB('ウィッペンバルケンの支え','Balgstütze'))}));
    it.off=-D;
    bore(ST,MAT.dark,o.xk,B.Y0-9.85,B.Y0-3.35,o.zw+(B.Y0-6.6-o.yw)*D/o.ar/2,1.4,LB('カプラーのローラーの腕を通す穴','Luftbohrung'));
    it.update=()=>{ const d=it.tr*it.v, sa=clamp(d/L,0,0.95), ca=Math.sqrt(1-sa*sa), tip=V3(o.xk,o.yw+L*ca,o.zw+L*sa);
      it.knob.position.z=H3KZ+d; it.drv.set(V3(o.xk,o.yw,o.zw),tip); it.shaft.set(tip,V3(o.xk,o.yk,H3KZ+d));
      const rise=o.ar*sa; it.off=Math.min(0,-D+rise); o.rail.setRail(it.off);
      for(const q of it.arms){ const t=V3(q.x,o.yw+o.ar*sa,o.zw-o.ar*ca); q.a.set(V3(q.x,o.yw,o.zw),t); q.p.set(t,V3(q.x,o.yU-0.5+it.off,o.zR)); } };
    CW.push(it); KN.push(it); return it; };
  const fH=B.cHP, fP=B.cPP;
  S.cHP=welle({name:'Hw/P',xk:59.5,yk:95.7+dY,yw:75,zw:fH.zP+0.3+13,ar:13,drop:1.7,xr:[fH.x0-0.3,fH.x1+0.3],rail:fH,yU:fH.y-0.45,zR:fH.zP+0.3});
  S.cPP=welle({name:'Pos/P',xk:59.5,yk:99.1+dY,yw:79.5,zw:fP.zP+0.4+19,ar:19,drop:1.7,xr:[fP.x0-0.3,fP.x1+0.3],rail:fP,yU:fP.y-0.45,zR:fP.zP+0.4});
  /* Pos/Hw: the knob turns a roller under the key desk, behind the coupler frame; its arms point forward and carry posts under the
     ends of the frame. Drawing the knob turns the arms down and lowers the frame by o.drop onto the nuts (on); pushing it in raises it. */
  const lift=(o)=>{ const it=Object.assign({v:0,on:false,off:o.drop},o), F=o.rail; it.knob=mkKnobR(o.name,{name:o.name,get:()=>it.on,fn:()=>{ it.on=!it.on; }},o.xk,o.yk,H3KZ);
    const xa=Math.min(...o.xr)-1.1, xb=o.xd+0.4, L=o.yk-o.yw, ar=F.zP-o.zw, Lp=F.pb+o.drop-o.yw;
    const wl=mk(G_CYL,MAT.woodPale,ST,LB('カプラーのローラー（'+o.name+'。ノブで回り、前向きの腕でカプラーの枠を上げ下げする）','Koppelwelle')); wl.rotation.z=Math.PI/2; wl.scale.set(0.6,xb-xa,0.6); wl.position.set((xa+xb)/2,o.yw,o.zw);
    for(const xx of o.xbr) box(ST,1,B.Y0-9.9-(o.yw-0.6),1.4,MAT.woodDark,xx,(B.Y0-9.9+o.yw-0.6)/2,o.zw,LB('ローラーの軸受け（演奏台から吊る）','Wellenböckchen'));
    bore(ST,MAT.dark,o.xd,B.Y0-9.85,B.Y0-3.35,o.zw+0.5,1.3,LB('カプラーのローラーの腕を通す穴','Luftbohrung'));
    it.tr=L*o.drop/ar; it.drv=prod(MAT.woodPale,0.42,LB('カプラーのローラーの腕（ノブの側）','Koppelwelle')); it.shaft=prod(MAT.woodPale,0.38,LB('ノブの軸（'+o.name+'）','Registerzugstange'));
    it.arms=o.xr.map(x=>({x,a:prod(MAT.woodPale,0.42,LB('カプラーのローラーの腕（カプラーの枠を支える）','Koppelwelle')),p:prod(MAT.woodDark,0.5,LB('カプラーの枠の支え','Balgstütze'))}));
    it.update=()=>{ const d=it.tr*it.v, sa=clamp(d/L,0,0.95), ca=Math.sqrt(1-sa*sa), tip=V3(o.xd,o.yw+L*ca,o.zw+L*sa);
      it.knob.position.z=H3KZ+d; it.drv.set(V3(o.xd,o.yw,o.zw),tip); it.shaft.set(tip,V3(o.xk,o.yk,H3KZ+d));
      const ty=o.yw-ar*sa, tz=o.zw+ar*ca; it.off=Math.max(0,o.drop-ar*sa);
      for(const q of it.arms){ q.a.set(V3(q.x,o.yw,o.zw),V3(q.x,ty,tz)); q.p.set(V3(q.x,ty,tz),V3(q.x,ty+Lp,tz)); }
      F.setRail(it.off); };
    CW.push(it); KN.push(it); return it; };
  S.cPH=lift({name:'Pos/Hw',xk:53.5,yk:111+dY,yw:B.Y0-17,zw:B.cPH.zP-13.6,drop:1.2,xr:[-(B.cPH.x1+0.3),B.cPH.x1+0.3],xbr:[-(B.cPH.x1+1.6),51.5],xd:52.6,rail:B.cPH});
  /* tremulant and cymbelstern: square and trace to their valves on the wind riser */
  const term=(o)=>{ const it=sq(Object.assign({tgt:[]},o)); it.term=prod(MAT.woodPale,0.35,LB('トレース（'+o.name+'の弁へ）','Registerzug'));
    const up0=it.update; it.update=()=>{ up0(); const d=o.tr*it.v, sp=clamp(-d/(o.xk-o.xs),-0.95,0.95), cp=Math.sqrt(1-sp*sp), tB=V3(o.xs-5*sp,o.yk,it.zs-5*cp); it.dx=-5*sp; it.term.set(tB,V3(o.xT-5*sp,o.yk,o.rowz)); }; return it; };
  S.zimb=term({name:'Zimbelstern',xk:59.5,yk:105.9+dY,xs:54.5,rowz:-140,tr:3,xT:27});
  S.trem=term({name:'Tremulant',xk:59.5,yk:109.3+dY,xs:54.5,rowz:-158,tr:3,xT:22});
  B.KN=KN; B.ST_=S;
  return S;
}
