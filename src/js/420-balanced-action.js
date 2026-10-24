/* ---------- D-02: balanced action (Wippenmechanik) ----------
   Balanced keys: each key rocks on a pin in the balance rail about 30 units (23 cm) behind its front, so the tail rises
   when the key is played. A sticker standing on the tail lifts the front arm of a backfall; its rear arm goes down and
   pulls the tracker from the roller board; roller board, squares and horizontal trackers as in D-01. The keys are carried
   by the balance rail, not hung from the action; the pallet spring brings everything back. */
function buildBalanceKeyboard(o){
  const R=CX.root, KB={piv:[]}, FA=30, zt=o.z-KLEN, zb=o.z-FA, RA=zb-zt, y0=o.y+KH/2, OZ=-RA, DIPF=KPULL*KLEN/(KLEN-KATT);
  const xp=k=>o.x+((k in SLOT?SLOT[k]:BPOS[k])-3.5)*3;
  KB.kx=k=>o.x+(k-6)*TAILP;
  KB.th=k=>Math.asin(clamp(DIPF*S.kd[k]/FA,0,1));
  KB.zt=zt; KB.zb=zb; KB.y0=y0; KB.RA=RA;
  box(R,30,1,KLEN+6,MAT.woodDark,o.x,o.y-3,zt+KLEN/2-1,LB('鍵盤の底板','Klaviaturboden'));
  box(R,26,0.4,1.6,MAT.cloth,o.x,o.y-KH/2-DIPF-0.2,o.z-1.4,LB('下止めのフェルト（白鍵の深さを決める）','Tastenfilz'));
  box(R,26,0.6,1.4,MAT.wood,o.x,o.y-2.2,o.z-10,LB('ガイドピンの桟','Führungsleiste'));
  for(let k=0;k<13;k++){ const g=rod(R,0.12,MAT.brass,LB('前のガイドピン（鍵の下の溝に入り、鍵が左右に振れないよう案内する）','Führungsstift')); g.set(V3(xp(k),o.y-2.2,o.z-10),V3(xp(k),o.y+0.8,o.z-10)); }
  const rw=13*TAILP+3;
  box(R,rw+2,1.6,2.4,MAT.wood,o.x,o.y-KH/2-0.8,zb,LB('バランスレール（鍵の中ほどの支点を受ける桟）','Waagebalken'));
  box(R,rw+2,0.2,2.2,MAT.cloth,o.x,o.y-KH/2+0.1,zb,LB('バランスレールのフェルト','Waagebalkenfilz'));
  for(let k=0;k<13;k++){ const g=rod(R,0.13,MAT.brass,LB('バランスピン（鍵の中ほどの穴に入り、鍵はこれを支点にシーソーのように動く）','Waagestift')); g.set(V3(KB.kx(k),o.y-KH/2-0.4,zb),V3(KB.kx(k),y0+KH/2+0.4,zb)); }
  box(R,rw,1.2,2.4,MAT.wood,o.x,o.y-KH/2-0.6,zt+2,LB('尾部の受け桟（鍵が戻ったとき奥の端が載る）','Hinterleiste'));
  box(R,rw,0.3,2.2,MAT.cloth,o.x,o.y-KH/2+0.1,zt+2,LB('尾部の受け桟のフェルト','Hinterleistenfilz'));
  box(R,rw,KH+5,1.2,MAT.wood,o.x,y0+1.5,zt-1.2,LB('尾部のラック（鍵の奥の端を1本ずつ案内する）','Tastenrechen'));
  for(let j=0;j<=13;j++) box(R,0.22,KH+4,2.2,MAT.woodDark,o.x+(j-6.5)*TAILP,y0+1.5,zt+0.4,LB('ラックの仕切り（鍵の奥端を1本ずつ案内する）','Rechenstäbchen'));
  for(const s of [-1,1]) box(R,1.4,7,19,MAT.wood,o.x+s*13.6,o.y+0.5,o.z-9,LB('鍵盤の側板','Backe'));
  for(let k=0;k<13;k++){
    const w=(k in SLOT), pv=new T.Group(); pv.position.set(0,y0,zb); R.add(pv);
    const lm=keyMat(k), xt=KB.kx(k), xk=xp(k), hm=mclone(w?MAT.ivory:MAT.ebony);
    const lab=LB('鍵のレバー（'+KEYNAMES[k]+'。中ほどのバランスピンを支点にシーソーのように動く）','Tastenhebel');
    box(pv,1.45,KH,KLEN-19.5,lm,xt,0,OZ+(KLEN-19.5)/2,lab);
    const cr=plank(pv,1.45,KH,lm,lab); cr.set(V3(xt,0,OZ+KLEN-19.6),V3(xk,0,OZ+KLEN-16.9));
    const fEnd=w?KLEN:KLEN-6;
    box(pv,1.45,KH,fEnd-(KLEN-17),lm,xk,0,OZ+(fEnd+KLEN-17)/2,lab);
    if(w){
      box(pv,2.75,0.6,6,hm,xk,KH/2+0.3,OZ+KLEN-3,LB('鍵 '+KEYNAMES[k]+'（白鍵の表面）','Untertaste'));
      const L=(k-1>=0&&!(k-1 in SLOT))?xp(k-1)+0.85:xk-1.4, Rr=(k+1<13&&!(k+1 in SLOT))?xp(k+1)-0.85:xk+1.4;
      box(pv,Rr-L,0.6,11.1,hm,(L+Rr)/2,KH/2+0.3,OZ+KLEN-11.5,LB('鍵 '+KEYNAMES[k]+'（白鍵の表面）','Untertaste'));
    } else box(pv,1.6,2,11,hm,xk,KH/2+1,OZ+KLEN-11.5,LB('鍵 '+KEYNAMES[k]+'（黒鍵）','Obertaste'));
    box(pv,1.3,0.3,1.3,MAT.cloth,xt,KH/2+0.15,OZ+2,LB('スティッカーの受け（フェルト）','Stecherfilz'));
    pv.traverse(c=>c.userData.key=k);
    KB.piv.push({pv,hm,xt});
  }
  KB.tail=k=>{ const t=KB.th(k), lz=OZ+2, ly=KH/2+0.3; return V3(KB.piv[k].xt,y0+ly*Math.cos(t)-lz*Math.sin(t),zb+ly*Math.sin(t)+lz*Math.cos(t)); };
  KB.update=()=>{ for(let k=0;k<13;k++){ const q=KB.piv[k]; q.pv.rotation.x=KB.th(k); q.hm.emissive.copy(COL.key).multiplyScalar(0.35*S.kd[k]); } };
  return KB;
}
function buildBalancedAction(chest,kb,KD2){
  const R=CX.root, items=[], YW=11, ZW=kb.zt-4, BF=6, BR=8, ZWF=ZW+BF, ZWR=ZW-BR, AI=6, AO=3.33, zr=ZWR-AI, a=3, ys1=40, zs2=chest.oz+14-a, y0r=14.5;
  box(R,13*TAILP+6,1,1,MAT.woodDark,0,YW,ZW,LB('バックフォールの支点の桟（ウィッペンバルケン）','Wippenbalken'));
  for(const s of [-1,1]) box(R,1.2,YW+0.5,1.6,MAT.woodDark,s*(13*TAILP/2+3),(YW+0.5)/2,ZW,LB('バックフォールの桟の支柱','Balgstütze'));
  const xs=[]; for(let k=0;k<13;k++) xs.push(kb.kx(k),chest.pos(k));
  const xmin=Math.min(...xs)-3, xmax=Math.max(...xs)+3;
  box(R,xmax-xmin,13*1.25+5,0.8,MAT.wood,(xmin+xmax)/2,y0r+13*1.25/2,zr-1.1,LB('ローラーボード（ローラーを支える板）','Wellenbrett'));
  box(R,xmax-xmin,1.2,1.2,MAT.woodDark,(xmin+xmax)/2,ys1,zr+AO-a-0.9,LB('スクエアの軸受け','Winkelbalken'));
  box(R,chest.W+4,1.2,1.2,MAT.woodDark,chest.ox,ys1,zs2-0.9,LB('スクエアの軸受け','Winkelbalken'));
  for(let k=0;k<13;k++){
    const x1=kb.kx(k), x2=chest.pos(k), yk=y0r+k*1.25, m=keyMat(k), zs1=zr+AO-a;
    const roll=mk(G_CYL,m,R,LB('ローラー（'+KEYNAMES[k]+'。回転して引く位置を左右に移す）','Welle')); roll.rotation.z=Math.PI/2; roll.scale.set(0.42,Math.abs(x2-x1)+1.4,0.42); roll.position.set((x1+x2)/2,yk,zr);
    for(const xx of [Math.min(x1,x2)-0.9,Math.max(x1,x2)+0.9]) box(R,0.7,1.1,1.4,MAT.woodDark,xx,yk,zr-0.4,LB('ローラーの軸受け','Wellenböckchen'));
    items.push({k,x1,x2,yk,zs1,
      st:rod(R,0.35,m,LB('スティッカー（押し棒。鍵の奥の端が上がるとバックフォールを押し上げる）','Stecher')),
      bf:rod(R,0.3,m,LB('バックフォール（ウィッペ。手前が押し上げられると奥が下がる）','Wippe')), bb:rod(R,0.3,m,LB('バックフォール（奥の腕。トラッカーを引き下げる）','Wippe')),
      t1:makeTracker(m,LB('トラッカー（ローラー → バックフォール）','Abstrakte')),
      a1:rod(R,0.32,m,LB('ローラーの腕（入力側）','Wellenärmchen')), a2:rod(R,0.32,m,LB('ローラーの腕（出力側）','Wellenärmchen')),
      t2:makeTracker(m,LB('トラッカー（ローラー → スクエア）','Abstrakte')),
      sa:rod(R,0.32,m,LB('スクエア（L字の腕木。引く向きを90度変える）','Winkel')), sb:rod(R,0.32,m,LB('スクエア','Winkel')),
      t3:makeTracker(m,LB('水平のトラッカー','Abstrakte')),
      sc:rod(R,0.32,m,LB('スクエア（風箱側）','Winkel')), sd:rod(R,0.32,m,LB('スクエア（風箱側）','Winkel')),
      t4:makeTracker(m,LB('トラッカー（スクエア → パレット）','Abstrakte'))});
  }
  return {update(){
    for(const it of items){
      const k=it.k, tp=kb.tail(k), rise=tp.y-(kb.y0+KH/2+0.3), ph=Math.asin(clamp(rise/BF,0,1)), c=Math.cos(ph), s=Math.sin(ph);
      const fT=V3(it.x1,YW+BF*s,ZW+BF*c), rT=V3(it.x1,YW-BR*s,ZW-BR*c);
      it.st.set(tp,fT); it.bf.set(V3(it.x1,YW,ZW),fT); it.bb.set(V3(it.x1,YW,ZW),rT);
      const drop=BR*s, ps=Math.asin(clamp(drop/AI,0,1)), pc=Math.cos(ps), pss=Math.sin(ps);
      const tin=V3(it.x1,it.yk-AI*pss,zr+AI*pc), tout=V3(it.x2,it.yk-AO*pss,zr+AO*pc);
      it.t1.set(tin,rT,0.3); it.a1.set(V3(it.x1,it.yk,zr),tin); it.a2.set(V3(it.x2,it.yk,zr),tout);
      const dy=AO*pss, q=Math.asin(clamp(dy/a,0,1)), qc=Math.cos(q), qs=Math.sin(q); KD2[k]=dy/KPULL;
      const piv1=V3(it.x2,ys1,it.zs1), saT=V3(it.x2,ys1-a*qs,it.zs1+a*qc), sbT=V3(it.x2,ys1+a*qc,it.zs1+a*qs);
      it.t2.set(saT,tout,0.6); it.sa.set(piv1,saT); it.sb.set(piv1,sbT);
      const piv2=V3(it.x2,ys1,zs2), sdT=V3(it.x2,ys1-a*qs,zs2+a*qc), scT=V3(it.x2,ys1+a*qc,zs2+a*qs);
      it.t3.set(sbT,scT,0.6); it.sc.set(piv2,scT); it.sd.set(piv2,sdT);
      it.t4.set(chest.pullDown(k),sdT,0.6);
    }
  }};
}

