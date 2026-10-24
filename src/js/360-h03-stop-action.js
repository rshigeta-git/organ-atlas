/* ---------- H-03 stop action: drawknob → shaft → square (vertical pin) → trace along x → roller at the chest end → slider ---------- */
function h3Stops(B){
  const ST=B.ST, KN=[];
  const sq=(o)=>{ // o: name, act, xk, yk, xs, rowz, tgt:[{xe,ys,end:()=>x}], tr
    const it=Object.assign({v:0,on:!!o.on0},o); it.zs=o.rowz+5;
    const lab='（'+o.name+'）';
    it.knob=mkKnobR(o.name,{name:o.name,get:()=>it.on,fn:()=>{ it.on=!it.on; }},o.xk,o.yk,38.9);
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
      it.knob.position.z=38.9+d; it.shaft.set(tA,V3(o.xk,o.yk,38.9+d)); it.aA.set(V3(o.xs,o.yk,it.zs),tA); it.aB.set(V3(o.xs,o.yk,it.zs),tB);
      for(const t of it.T){ const s2=clamp(-dx/4,-0.95,0.95), c2=Math.sqrt(1-s2*s2), t1=V3(t.xe-4*s2,o.yk,t.zr-4*c2), t2=V3(t.xe-4*s2,t.ys,t.zr-4*c2);
        t.tr.set(tB,t1); t.a1.set(V3(t.xe,o.yk,t.zr),t1); t.a2.set(V3(t.xe,t.ys,t.zr),t2); t.lk.set(t2,V3(t.end(),t.ys,o.rowz)); }
    };
    KN.push(it); return it;
  };
  const hwR=B.hw.rows, poR=B.pos.rows, tdR=B.tc.rows, HY=[94,97.4,100.8,104.2,107.6,111], hwOn=[1,1,0,0,0,0], poOn=[1,0,0,0], pdOn=[0,1,0];
  const S={hw:[],pos:[],ped:[]};
  hwR.forEach((r,i)=>{ S.hw.push(sq({name:STOPS[r.si].name,xk:-53.5,yk:HY[i],xs:-58.5,rowz:r.z,tr:3,on0:hwOn[i],tgt:[{xe:-280,ys:B.hw.yS+0.5,end:()=>B.hw.slEnd-3*(1-B.SPH[i])}]})); });
  poR.forEach((r,i)=>{ S.pos.push(sq({name:STOPS[r.si].name,xk:53.5,yk:HY[i],xs:58.5,rowz:r.z,tr:3,on0:poOn[i],tgt:[{xe:218,ys:B.pos.yS+0.5,end:()=>B.pos.slEnd+3*(1-B.SPP[i])}]})); });
  tdR.forEach((r,i)=>{ S.ped.push(sq({name:STOPS[r.si].name,xk:-59.5,yk:[95.7,99.1,102.5][i],xs:-54.5,rowz:r.z,tr:3,on0:pdOn[i],tgt:[{xe:-300,ys:B.tc.yS+0.5,end:()=>B.tc.slEnd+3*(1-B.SPD[i])},{xe:300,ys:B.td.yS+0.5,end:()=>B.td.slEnd+3*(1-B.SPD[i])}]})); });
  /* couplers: the knob turns a roller lying along x (Koppelwelle) whose arms raise the upper backfall rail by 1 */
  const CW=[];
  const welle=(o)=>{ const it=Object.assign({v:0,on:false},o); it.knob=mkKnobR(o.name,{name:o.name,get:()=>it.on,fn:()=>{ it.on=!it.on; }},o.xk,o.yk,38.9);
    const L=o.yk-o.yw, xa=Math.min(...o.xr)-1, xb=Math.max(o.xk,...o.xr)+1;
    const wl=mk(G_CYL,MAT.woodPale,ST,LB('カプラーのローラー（'+o.name+'。ノブで回り、腕でウィッペンバルケンを上げ下げする）','Koppelwelle')); wl.rotation.z=Math.PI/2; wl.scale.set(0.9,xb-xa,0.9); wl.position.set((xa+xb)/2,o.yw,o.zw);
    for(const xx of [xa,xb]) box(ST,1.6,2.2,2.2,MAT.woodDark,xx,o.yw,o.zw,LB('ローラーの軸受け','Wellenböckchen'));
    it.tr=L/o.ar; it.drv=prod(MAT.woodPale,0.42,LB('カプラーのローラーの腕（ノブの側）','Koppelwelle')); it.shaft=prod(MAT.woodPale,0.38,LB('ノブの軸（'+o.name+'）','Registerzugstange'));
    it.arms=o.xr.map(x=>({x,a:prod(MAT.woodPale,0.42,LB('カプラーのローラーの腕（ウィッペンバルケンを支える）','Koppelwelle')),p:prod(MAT.woodDark,0.5,LB('ウィッペンバルケンの支え','Balgstütze'))}));
    it.off=-1;
    it.update=()=>{ const d=it.tr*it.v, sa=clamp(d/L,0,0.95), ca=Math.sqrt(1-sa*sa), tip=V3(o.xk,o.yw+L*ca,o.zw+L*sa);
      it.knob.position.z=38.9+d; it.drv.set(V3(o.xk,o.yw,o.zw),tip); it.shaft.set(tip,V3(o.xk,o.yk,38.9+d));
      const rise=o.ar*sa; it.off=Math.min(0,-1+rise); o.rail.setRail(it.off);
      for(const q of it.arms){ const t=V3(q.x,o.yw+o.ar*sa,o.zw-o.ar*ca); q.a.set(V3(q.x,o.yw,o.zw),t); q.p.set(t,V3(q.x,o.yU-0.5+it.off,o.zR)); } };
    CW.push(it); KN.push(it); return it; };
  const hx=B.lo.hw;
  S.cPH=welle({name:'Pos/Hw',xk:53.5,yk:111,yw:B.Y0+12,zw:B.cPH.zPU+3,ar:3,xr:[-hx-1,hx+1],rail:B.cPH,yU:B.Y0+17,zR:B.cPH.zPU});
  const hxs=Object.values(B.cHP.it).map(q=>q.x), pxs=Object.values(B.cPP.it).map(q=>q.x);
  S.cHP=welle({name:'Hw/P',xk:59.5,yk:95.7,yw:72,zw:B.cHP.zPU+6,ar:6,xr:[Math.min(...hxs)-3,Math.max(...hxs)+3],rail:B.cHP,yU:78,zR:B.cHP.zPU});
  S.cPP=welle({name:'Pos/P',xk:59.5,yk:99.1,yw:66,zw:B.cPP.zPU+9,ar:9,xr:[Math.min(...pxs)-3,Math.max(...pxs)+3],rail:B.cPP,yU:72,zR:B.cPP.zPU});
  /* tremulant and cymbelstern: square and trace to their valves on the wind riser */
  const term=(o)=>{ const it=sq(Object.assign({tgt:[]},o)); it.term=prod(MAT.woodPale,0.35,LB('トレース（'+o.name+'の弁へ）','Registerzug'));
    const up0=it.update; it.update=()=>{ up0(); const d=o.tr*it.v, sp=clamp(-d/(o.xk-o.xs),-0.95,0.95), cp=Math.sqrt(1-sp*sp), tB=V3(o.xs-5*sp,o.yk,it.zs-5*cp); it.dx=-5*sp; it.term.set(tB,V3(o.xT-5*sp,o.yk,o.rowz)); }; return it; };
  S.zimb=term({name:'Zimbelstern',xk:59.5,yk:105.9,xs:54.5,rowz:-140,tr:3,xT:27});
  S.trem=term({name:'Tremulant',xk:59.5,yk:109.3,xs:54.5,rowz:-158,tr:3,xT:22});
  B.KN=KN; B.ST_=S;
  return S;
}
