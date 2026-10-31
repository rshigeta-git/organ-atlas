/* ---------- D-05: pedal action ----------
   Pedal keys hinged at the heel end (under the bench); the toe end, under the console, goes down. A coil spring under
   the toe end returns the key, a guide pin in a slot keeps it straight, a felt pad limits its travel. The tracker runs UP
   from the toe end to a square, a horizontal tracker runs back under the console floor... here: inside the console base,
   to a second square below the pedal chest, which pulls the pallet down. */
function buildPedalAction(){
  // ZH heel hinge, ZT old toe (end of the playing area), ZE extended tip under the case, ZA tracker attachment
  // YS / Y2 pivot heights of the two squares. Square 2 hangs one arm down (to the horizontal tracker) and points the
  // other away from the player, so the tracker up to the roller rises behind it, clear of the horizontal tracker.
  const R=CX.root, ZH=62, ZT=-14, ZE=-27, KL=ZH-ZE, KP=ZH-ZT, yK=5, KHp=3.4, DEP=1.9, ZA=-24, LA=ZH-ZA, YS=21.5, AS=4.5, Y2=YS+2*AS, oz=-115, oy=54;
  const DA=LA*DEP/KP, AO=3, AIr=AO*DA/KPULL, zr=oz+14-AO, zs1=ZA-AS, zs2=zr+AIr+AS, yr0=Y2+3;
  const PST=[5,11,12], PSP=new Float32Array([0,1,0]), m={ps:[false,true,false]};
  // full-size pedal chest (C/Cis layout, built like the H-03 chests) on its own legs; its pull-down line stays at oz + 14
  const chest=buildFullChest(fullChestPlan(oy,0,oz+17.5,PST),null,'R',false,null,{sp:PSP,pedal:true,volN:300,act:stopActs(PST,m.ps)});
  const xp=k=>((k in SLOT?SLOT[k]:BPOS[k])-3.5)*8;
  // frame
  const LF=LB('ペダル鍵盤の枠','Pedalklaviatur');
  box(R,66,1.2,3,MAT.woodDark,0,0.6,ZE+2.5,LB('鍵先の桟（ばね・ガイドピン・下止めのフェルトを受ける）','Federleiste'));
  box(R,66,yK+1,4,MAT.woodDark,0,(yK+1)/2,ZH+1,LB('蝶番の桟（ペダル鍵のかかと側の支点）','Scharnier'));
  for(const s of [-1,1]) box(R,2,1.6,KL+6,MAT.woodDark,s*34,0.8,(ZH+ZE)/2+1,LF);
  for(const z of [ZT+4,ZH-14]) box(R,66,0.8,2,MAT.woodDark,0,0.4,z,LF);
  const pin=mk(G_ROD,MAT.iron,R,LB('蝶番のピン','Drehstift')); pin.rotation.z=Math.PI/2; pin.scale.set(0.2,66,0.2); pin.position.set(0,yK,ZH);
  // bench (context)
  const LBk=LB('オルガンベンチ','Orgelbank');
  box(R,74,2.4,16,MAT.wood,0,62,ZH+12,LBk); for(const s of [-1,1]) box(R,2.4,61,14,MAT.wood,s*35,30.5,ZH+12,LBk);
  // keys
  const SG=helixGeo(0.8,5,2.2,0.13), keys=[];
  for(let k=0;k<13;k++){
    const w=(k in SLOT), x=xp(k), lm=keyMat(k), g=new T.Group(); g.position.set(x,yK,ZH); R.add(g);
    const lab=LB('ペダル鍵 '+KEYNAMES[k]+'（かかと側の蝶番を支点に、つま先側が下がる）','Pedaltaste');
    box(g,w?2.9:2.4,KHp,KP,lm,0,0,-KP/2,lab);
    box(g,w?2.4:2.0,KHp*0.75,ZT-ZE+0.5,lm,0,-KHp*0.125,ZE-ZH+(ZT-ZE)/2,LB('ペダル鍵の延長部（'+KEYNAMES[k]+'。つま先の先からオルガンの下へ伸び、先端でアクションにつながる）','Tastenverlängerung'));
    if(!w) box(g,2.4,3.2,18,MAT.ebony,0,KHp/2+1.6,ZT-ZH+9,LB('ペダルの黒鍵（つま先側に高く付いた台）','Obertaste'));
    else box(g,2.9,0.3,KP-4,MAT.woodPale,0,KHp/2+0.15,-KP/2-1,LB('ペダルの白鍵の踏み面','Untertaste'));
    box(g,0.5,KHp*0.75+0.02,1.4,MAT.dark,0,-KHp*0.125,ZE-ZH+1.2,LB('ガイドピンの溝','Schlitz'));
    box(g,1.4,0.6,1.4,MAT.dark,0,KHp*0.25+0.3,ZA-ZH,LB('トラッカーの留め金（ここでアクションにつながる）','Abstraktenhaken'));
    rod(R,0.15,MAT.brass,LB('ガイドピン（鍵先の溝に入り、鍵を左右に振らせない）','Führungsstift')).set(V3(x,1.2,ZE+1.2),V3(x,yK+KHp/2+0.4,ZE+1.2));
    box(R,2.2,0.3,1.6,MAT.cloth,x,1.35,ZE+3.2,LB('下止めのフェルト（ペダルの深さを決める）','Tastenfilz'));
    const sp=mk(SG,MAT.iron,R,LB('ペダルのばね（鍵先を押し上げて戻す）','Pedalfeder')); sp.position.set(x,1.2,ZE+6.5);
    keys.push({k,x,g,sp,top:yK+KHp*0.25,
      t1:makeTracker(lm,LB('トラッカー（ペダル鍵の先 → スクエア。下へ引かれる）','Abstrakte')),
      s1a:rod(R,0.32,lm,LB('スクエア（ペダル側。下向きの引きを手前向きの引きに変える）','Winkel')), s1b:rod(R,0.32,lm,LB('スクエア（ペダル側）','Winkel')),
      t2:makeTracker(lm,LB('水平のトラッカー（オルガンの下を奥の風箱へ）','Abstrakte')),
      s2a:rod(R,0.32,lm,LB('スクエア（風箱側。手前向きの引きを下向きの引きに変える）','Winkel')), s2b:rod(R,0.32,lm,LB('スクエア（風箱側）','Winkel')),
      t3:makeTracker(lm,LB('トラッカー（スクエア → ローラー）','Abstrakte')),
      a1:rod(R,0.32,lm,LB('ローラーの腕（入力側。鍵の位置）','Wellenärmchen')), a2:rod(R,0.32,lm,LB('ローラーの腕（出力側。パレットの位置）','Wellenärmchen')),
      t4:makeTracker(lm,LB('トラッカー（ローラー → パレット）','Abstrakte'))});
  }
  // squares
  const LW=LB('スクエアの軸受け','Winkelbalken'), LP=LB('軸受けの支柱','Balgstütze');
  // each beam sits in the quadrant its square's arms never swing into: behind square 1, above square 2
  for(const [y,z] of [[YS,zs1-0.9],[Y2+1,zs2]]){ box(R,64,1.2,1.2,MAT.woodDark,0,y,z,LW); for(const s of [-1,1]) box(R,1.6,y,1.6,MAT.woodDark,s*33,y/2,z,LP); }
  // roller board under the chest
  const xs=[]; for(let k=0;k<13;k++) xs.push(keys[k].x,chest.pos(k));
  const xmin=Math.min(...xs)-3, xmax=Math.max(...xs)+3;
  box(R,xmax-xmin,13*1.25+5,0.8,MAT.wood,(xmin+xmax)/2,yr0+12*1.25/2,zr-1.1,LB('ローラーボード（風箱の下で、鍵の並びをパレットの並びへ広げる）','Wellenbrett'));
  for(const k of keys){
    const x1=k.x, x2=chest.pos(k.k), yk=yr0+k.k*1.25; k.yk=yk;
    const roll=mk(G_CYL,keyMat(k.k),R,LB('ローラー（'+KEYNAMES[k.k]+'。回転して引く位置を左右に移す）','Welle')); roll.rotation.z=Math.PI/2; roll.scale.set(0.42,Math.abs(x2-x1)+1.4,0.42); roll.position.set((x1+x2)/2,yk,zr);
    for(const xx of [Math.min(x1,x2)-0.9,Math.max(x1,x2)+0.9]) box(R,0.7,1.1,1.4,MAT.woodDark,xx,yk,zr-0.4,LB('ローラーの軸受け','Wellenböckchen'));
  }
  chest.finish();
  return {chest,
    stopRows:[{label:'P ペダル',items:PST.map((si,i)=>({name:STOPS[si].name,ja:STOPS[si].ja,get:()=>m.ps[i],set:v=>m.ps[i]=v}))}],
    ctl:{pd:arr=>{ arr.forEach((v,i)=>m.ps[i]=!!v); syncStopUI(); }},
    pins:[{t:'ペダル鍵盤',p:V3(-36,10,20)},{t:'蝶番（かかと側）',p:V3(38,yK+3,ZH)},{t:'ペダル鍵の延長部',p:V3(-38,5,(ZT+ZE)/2)},{t:'スクエア',p:V3(36,YS+6,zs1)},{t:'水平のトラッカー',p:V3(36,YS+AS+4,(zs1+zs2)/2)},{t:'ローラーボード',p:V3(xmax+4,yr0+8,zr)},{t:'風箱',p:V3(chest.xR+6,chest.base,chest.zF)}],
    update(dt){
      for(const q of keys){
        const th=Math.asin(DEP*S.kd[q.k]/KP); q.g.rotation.x=-th;
        q.sp.scale.y=(yK-KHp/2-1.2-(ZH-(ZE+6.5))*Math.sin(th))/2.2;
        const drop=LA*Math.sin(th), ya=q.top-drop;
        // square 1: arm toward the player pulled down, upright arm pulls the tracker toward the player
        const p1=Math.asin(clamp(drop/AS,0,1)), c1=Math.cos(p1), s1=Math.sin(p1);
        const P1=V3(q.x,YS,zs1), inT=V3(q.x,YS-AS*s1,zs1+AS*c1), upT=V3(q.x,YS+AS*c1,zs1+AS*s1);
        q.t1.set(inT,V3(q.x,ya,ZA),KHp*0.75); q.s1a.set(P1,inT); q.s1b.set(P1,upT);
        // square 2: hanging arm pulled toward the player, arm pointing away from the player goes down
        const P2=V3(q.x,Y2,zs2), dn2=V3(q.x,Y2-AS*c1,zs2+AS*s1), out2=V3(q.x,Y2-AS*s1,zs2-AS*c1);
        q.t2.set(dn2,upT,0.6); q.s2a.set(P2,dn2); q.s2b.set(P2,out2);
        // roller: both arms point toward the player; the key-side arm is pulled down, the pallet-side arm follows
        const ps=Math.asin(clamp(drop/AIr,0,1)), pc=Math.cos(ps), pss=Math.sin(ps), xc=chest.pos(q.k);
        const tin=V3(q.x,q.yk-AIr*pss,zr+AIr*pc), tout=V3(xc,q.yk-AO*pss,zr+AO*pc);
        q.t3.set(tin,out2,0.6); q.a1.set(V3(q.x,q.yk,zr),tin); q.a2.set(V3(xc,q.yk,zr),tout);
        q.t4.set(chest.pullDown(q.k),tout,0.6);
      }
      for(let i=0;i<3;i++) PSP[i]+=clamp((m.ps[i]?1:0)-PSP[i],-dt*2.5,dt*2.5);
      chest.update(dt);
    }};
}

