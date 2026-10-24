/* ---------- E-02: stop action for a spring chest ----------
   Each stop bar of the spring chest runs out through the end of the chest. Above its end a square (bellcrank) presses it
   down through a short sticker; the drawknob's rod pulls the square's upright arm toward the player. The springs of all
   the pallets of that stop push the bar back up, so a drawn stop must be held: a hook on the jamb drops behind a
   collar on the draw rod. Lifting the hook (or switching the hooks off here) lets the springs push the knob back in. */
function buildSpringStopAction(){
  const R=CX.root, chest=buildChest({spring:true}), oy=chest.oy, oz=chest.oz, xE=chest.ox-chest.W/2-0.5;
  const A1=7.2, A2=1.6, TRV=3.6, KZ=34, yP=oy+27.6+0.7+3.2, yT=yP+A1, m={hook:true,tm:new Float32Array(5)};
  const LBS=LB('ストップアクションの台','Winkelbalken');
  box(R,22,1.2,42,MAT.woodDark,xE-12,oy+19.4,oz,LBS);
  for(const z of [oz-19,oz+19]) box(R,1.6,oy+18.8,1.6,MAT.woodDark,xE-21,(oy+18.8)/2,z,LBS);
  const jx0=xE-21, jx1=xE-1;
  box(R,jx1-jx0+4,10,2,MAT.wood,(jx0+jx1)/2,yT,KZ-1.6,LB('ストップノブの板（ストップジャム）','Registerbank'));
  const its=[];
  for(let i=0;i<5;i++){
    const zb=oz+ZROW[i]-1.6, xs=xE-3-4*i, sm=stopMat(i);
    const zp=zb-A2;
    const ext=box(R,xE-xs+1.2,1.4,1.2,sm,(xE+xs)/2,oy+27.6,zb,LB('ストップバーの延長（風箱の外へ出た端）','Registerbalken'));
    const felt=box(R,1.2,0.4,1.4,MAT.cloth,xs,oy+27.6+0.9,zb,LB('フェルト（押し棒の当たり）','Anschlagfilz'));
    box(R,1.2,yP-oy-20,1.2,MAT.woodDark,xs,(yP+oy+20)/2,zp,LB('スクエアの支え','Wellenböckchen'));
    const knob=mk(G_CYL,MAT.ebony,R,LB('ストップノブ：'+STOPS[i].name+'（手前に引くと入る）','Registerzug')); knob.rotation.x=Math.PI/2; knob.scale.set(1.3,2.2,1.3);
    const face=mk(G_CYL,MAT.ivory,R,LB('ストップ名の札：'+STOPS[i].name,'Registerschild')); face.rotation.x=Math.PI/2; face.scale.set(0.95,0.25,0.95);
    knob.userData.stop=i; face.userData.stop=i;
    const collar=mk(G_CYL,MAT.brass,R,LB('留め輪（フックが後ろに落ちて引いた位置に保つ）','Öse')); collar.rotation.x=Math.PI/2; collar.scale.set(0.7,0.6,0.7);
    box(R,0.6,0.6,0.6,MAT.iron,xs,yT+1.9,KZ-0.3,LB('フックの軸','Achse'));
    const hook=rod(R,0.16,MAT.iron,LB('フック（ストップを引いた位置に掛けて保つ。ばね弁のばねに押し戻されないように）','Haken'));
    its.push({i,xs,zb,zp,ext,felt,knob,face,collar,hook,hd:0,sm,
      rodK:rod(R,0.3,sm,LB('ノブの軸（引き棒）','Registerzugstange')),
      armU:rod(R,0.4,sm,LB('スクエアの立った腕（ノブの軸に引かれる）','Winkel')),
      armF:rod(R,0.4,sm,LB('スクエアの短い腕（押し棒でストップバーを押し下げる）','Winkel')),
      st:rod(R,0.22,MAT.iron,LB('押し棒（スクエアがストップバーの端を押し下げる）','Stecher'))});
  }
  return {chest,
    controls:[{type:'toggle',id:'hook',label:'フックで保つ',get:()=>m.hook,set:v=>m.hook=v}],
    ctl:{hook:v=>m.hook=v},
    pins:[{t:'ストップノブ',p:V3(xE-24,yT+4,KZ)},{t:'スクエア',p:V3(xE-12,yT+3,oz-8)},{t:'ストップバー',p:V3(xE+6,oy+31,oz+20)},{t:'ばね弁',p:V3(36,oy+24,oz+6),max:150}],
    update(dt){
      for(const it of its){
        if(!m.hook&&S.stop[it.i]){ m.tm[it.i]+=dt; if(m.tm[it.i]>0.7){ S.stop[it.i]=false; syncStopUI(); m.tm[it.i]=0; } } else m.tm[it.i]=0;
        const sp=S.sp[it.i], ph=Math.asin(clamp(TRV*sp/A1,0,1)), c=Math.cos(ph), s=Math.sin(ph);
        const P=V3(it.xs,yP,it.zp), tU=V3(it.xs,yP+A1*c,it.zp+A1*s), tF=V3(it.xs,yP-A2*s,it.zp+A2*c);
        it.armU.set(P,tU); it.armF.set(P,tF);
        const dy=0.8*sp; it.ext.position.y=oy+27.6-dy; it.felt.position.y=oy+28.5-dy;
        it.st.set(tF,V3(it.xs,oy+27.6+0.7-dy+0.4,it.zb));
        const kz=KZ+TRV*sp; it.knob.position.set(it.xs,yT,kz+1.1); it.face.position.set(it.xs,yT,kz+2.3);
        it.rodK.set(tU,V3(it.xs,yT,kz)); it.collar.position.set(it.xs,yT,kz-3.5);
        it.hd+=(((m.hook&&sp>0.95)?1:0)-it.hd)*Math.min(1,dt*12);
        const ha=lerp(1.25,0.05,it.hd); it.hook.set(V3(it.xs,yT+1.9,KZ-0.3),V3(it.xs,yT+1.9-1.6*Math.cos(ha),KZ-0.3+1.6*Math.sin(ha)));
      }
      chest.update(dt);
    }};
}

/* bell: struck partials with exponential decay (minor-third bell partial series, slightly inharmonic) */
function bellStrike(f,vel){
  if(!AU.ctx||!AU.on) return; if(AU.ctx.state==='suspended') AU.ctx.resume().catch(()=>{});
  const t=AU.ctx.currentTime, P=[[0.5,0.35,1.6],[1,1,1.4],[1.19,0.45,1.0],[1.5,0.35,0.8],[2,0.5,0.6],[2.74,0.22,0.35],[3.6,0.12,0.22]];
  for(const [r,a,d] of P){ const o=AU.ctx.createOscillator(), g=AU.ctx.createGain(); o.frequency.value=f*r; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.32*a*vel,t+0.003); g.gain.exponentialRampToValueAtTime(0.0005,t+d); o.connect(g); g.connect(AU.out); o.start(t); o.stop(t+d+0.05); }
}
