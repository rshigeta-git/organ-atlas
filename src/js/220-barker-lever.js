/* ---------- D-03: Barker lever ---------- */
function buildBarker(){
  const R=CX.root, B0=new Float32Array(13);
  const chest=buildChest({y:44,z:-17.5,kd:B0});
  const kb=buildKeyboard({x:0,y:-14,z:28}); box(R,30,8.5,61,MAT.woodDark,0,-21.75,-0.5,LB('演奏台（コンソール）の台','Spieltisch'));
  const mr=buildMotorRow(chest,{y:12,drive:k=>S.kd[k]>0.3,boxLabel:['バーカーの風箱（中は風で満ちている）','Barkerkasten'],motorLabel:['バーカーの小ふいご（鍵で弁が開くと風でふくらみ、重いトラッカーを引く）','Barkerbalg']});
  const kt=[]; for(let k=0;k<13;k++) kt.push(makeTracker(keyMat(k),LB('トラッカー（鍵→バーカーの弁）','Abstrakte')));
  const vs=[]; for(let k=0;k<13;k++) vs.push(box(R,1.4,0.4,1.4,keyMat(k),chest.pos(k),7.6,8,LB('弁を引く線の先（入口弁と排気弁を同時に動かす）','Ventilabzug')));
  return {chest,
    pins:[{t:'鍵盤',p:V3(0,-10,30)},{t:'バーカーの小ふいご',p:V3(38,14,2)},{t:'バックフォール',p:V3(38,24,-2)},{t:'風箱（パレット）',p:V3(38,44,10)}],
    update(dt){ kb.update(); for(let k=0;k<13;k++){ kt[k].set(V3(chest.pos(k),7.4-0.9*S.kd[k],8),kb.attach(k),KH); vs[k].position.y=7.6-0.9*S.kd[k]; B0[k]=0; }
      mr.update(dt); for(let k=0;k<13;k++) B0[k]=mr.B[k]; chest.update(dt); }
  };
}

