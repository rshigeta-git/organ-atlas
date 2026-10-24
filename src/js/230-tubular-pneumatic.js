/* ---------- D-04 (formerly D-03): tubular-pneumatic action ---------- */
function buildTubular(){
  const R=CX.root, B0=new Float32Array(13), m={exhaust:false,len:10};
  const chest=buildChest({y:44,z:-17.5,kd:B0});
  const kc=buildPneuConsole({y:-14,z:110});
  const delay=()=>0.010+0.0045*m.len;
  const fill=[], drain=[], pouch=[];
  for(let k=0;k<13;k++){
    const x=chest.pos(k), o=kc.outlet(k), pts=[o,V3(o.x,o.y+2.6,o.z-4),V3(x,o.y+2.6,16),V3(x,9.5,11.5),V3(x,9.5,9.6)];
    leadTube(pts,LB('導管（鉛管。鍵の弁からの制御風を風箱側のリレーへ送る）','Bleirohr'));
    const L=pathLen(pts);
    fill.push(new Tube(pts,{kind:'ctrl',r:0.25,density:0.3,front:300,state:()=>({open:m.exhaust?S.kd[k]<0.3:S.kd[k]>0.3,speed:m.exhaust?0:22})}));
    drain.push(new Tube(pts.slice().reverse(),{kind:'ctrl',r:0.25,density:0.3,front:300,state:()=>({open:m.exhaust&&S.kd[k]>0.3,speed:24})}));
    pouch.push(box(R,2.4,1.6,1.6,MAT.leather,x,9.5,8.6,LB('リレーの小袋（導管の制御風で動き、モーターの入口弁を開ける）','Relaisbalg')));
  }
  const arrived=k=>m.exhaust?(S.kd[k]>0.3&&drain[k].full()):(S.kd[k]>0.3&&fill[k].full());
  const mr=buildMotorRow(chest,{y:12,drive:arrived,boxLabel:['モーターの風箱（中は風で満ちている）','Barkerkasten'],motorLabel:['空気式モーター（リレーが開くと風でふくらみ、トラッカーを引く）','Pneumatikmotor']});
  const setFront=()=>{ for(let k=0;k<13;k++){ fill[k].front=fill[k].L/delay(); drain[k].front=drain[k].L/delay(); } }; setFront();
  return {chest,
    controls:[{type:'toggle',id:'exh',label:'排気式にする',get:()=>m.exhaust,set:v=>{ m.exhaust=v; fill.forEach(f=>f.reset()); drain.forEach(f=>f.reset()); }},
      {type:'range',id:'len',label:'導管の長さ',min:2,max:20,step:0.5,get:()=>m.len,set:v=>{ m.len=v; setFront(); },fmt:()=>TF('{0} m（応答の遅れ 約{1} ms）',m.len.toFixed(1),Math.round(delay()*1000))}],
    ctl:{exh:v=>{ m.exhaust=v; fill.forEach(f=>f.reset()); drain.forEach(f=>f.reset()); },len:v=>{ m.len=v; setFront(); }},
    pins:[{t:'鍵の弁箱',p:V3(0,-2,92)},{t:'導管（制御風）',p:V3(0,0,50)},{t:'リレー',p:V3(38,9,9)},{t:'空気式モーター',p:V3(38,14,2)},{t:'風箱（パレット）',p:V3(38,44,10)}],
    update(dt){ kc.update(); for(let k=0;k<13;k++) pouch[k].scale.y=0.6+0.5*(arrived(k)?1:0); mr.update(dt); for(let k=0;k<13;k++) B0[k]=mr.B[k]; chest.update(dt); }
  };
}

