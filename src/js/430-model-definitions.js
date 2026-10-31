const MODELS={
'a-01':{id:'A-01',name:'フルー管の発音',terms:'flue pipe · Lippenpfeife · tuyau à bouche · labiaalpijp · canna ad anima · tubo labial',stops0:[0,0,0,0,0],own:true,noStops:true,noKeys:true,floor:-26,xray0:false,cut0:1,clip:[0.02,6],psize:0.32,
  cam:{p:[150,30,40],t:[0,22,-9]},
  legend:'<span><i style="background:var(--wind)"></i>噴流・足の中の風</span><span><i style="background:var(--air)"></i>胴の中の空気（上下に往復）</span><span><i style="background:var(--sound)"></i>圧力が高い</span><span><i style="background:var(--wind);opacity:.6"></i>圧力が低い</span>',
  foot:'左のメタルは Prinzipal 2′ の C（約262 Hz、胴の長さ 約59 cm）を想定した開管、右の木管は同じ長さの閉管（約131 Hz）です。歌口まわりは見やすさのため拡大しています。振動は実際の毎秒数百回を、メタルは約5.5回、木管は約2.8回に遅くして表示しています。音は実際の高さで鳴ります。',
  summary:'フルー管（唇管）が音を出すしくみを、縦に半分に切った断面で見ます。左はメタルの開管、右は同じ長さの木管の閉管です。足から来た風は、ウインドウェイから薄い板状の噴流になって吹き出し、上唇の縁で管の内側と外側に交互に振れて、胴の中の空気柱を共鳴させます。閉管は同じ長さの開管より1オクターブ低く鳴り、空気柱の圧力の変化のしかたも違います。',
  steps:[
    {t:'左がメタルの開管（上端が開いている）、右が同じ長さの木管の閉管（上端を栓でふさいでいる）です。どちらも縦に半分に切った断面です。「風を送る」を押すと両方に風が入ります。',run:a=>{a.ctl('wind',false);a.ctl('sm',true);a.ctl('sw',true);a.cut(1);a.home();}},
    {t:'足穴から入った風は足の中にたまって圧力を持ち、ラングイドの前縁と下唇のすき間（ウインドウェイ）だけから吹き出します。木管では、ブロックの前面とキャップのすき間がウインドウェイです。',run:a=>{a.ctl('wind',true);a.cam([46,-4,16],[0,-6,1.5]);}},
    {t:'吹き出した噴流は、ウインドウェイの幅いっぱいに広がる薄い膜です。上唇の縁（エッジ）に向かい、管の内側と外側（大気側）へ交互に振れます。濃い帯は噴流の断面、薄い膜は幅方向の広がり、粒子は風の動きです。この往復が発音のもとになります。',run:a=>{a.ctl('wind',true);a.cam([15,2,5],[0,0.8,2]);}},
    {t:'開管：内側に入った風が空気柱を押し、空気柱は上下に往復します（灰色の粒子）。開いた両端で空気の動きが最も大きく、中央で圧力の変化（色）が最も大きくなります。',run:a=>{a.ctl('wind',true);a.cam([112,40,38],[0,36,0]);}},
    {t:'閉管：上端の栓で空気が動けないため、栓のところで圧力の変化が最も大きく、歌口側で空気の動きが最も大きくなります。開管と色の分かれ方を比べてください。',run:a=>{a.ctl('wind',true);a.cam([112,40,20],[0,36,-18]);}},
    {t:'閉管は、同じ長さの開管より1オクターブ低い音になります。振動の速さも半分です。「メタル（開管）」「木管（閉管）」のボタンで片方ずつ鳴らして聞き比べてください。',run:a=>{a.ctl('wind',true);a.ctl('sm',true);a.ctl('sw',false);later(1800,()=>{api.ctl('sm',false);api.ctl('sw',true);});later(3600,()=>{api.ctl('sm',true);});a.home();}},
    {t:'メタルの胴の上端のチューニングスリーブを上げると管が長くなって音が低く、下げると短くなって高くなります。',run:a=>{a.ctl('wind',true);a.ctl('sm',true);a.cam([38,70,22],[0,70,0]);a.ctl('sleeve',6.5);later(1600,()=>api.ctl('sleeve',0.5));later(3200,()=>api.ctl('sleeve',3.5));}},
    {t:'木管の栓を下げると管が短くなって音が高く、上げると長くなって低くなります。下のスライダーで動かすと、空気柱の長さ、振動の速さ、音の高さが一緒に変わります。',run:a=>{a.ctl('wind',true);a.ctl('sw',true);a.cam([40,66,4],[0,66,-18]);a.ctl('stop',65);later(1600,()=>api.ctl('stop',71));later(3200,()=>api.ctl('stop',68));}}
  ],
  build(){ return buildFlueSection(); }},
'a-02':{id:'A-02',name:'リード管の発音',terms:'reed pipe · Zungenpfeife · tuyau à anche · tongwerkpijp · canna ad ancia · tubo de lengüeta',stops0:[0,0,0,0,0],own:true,noStops:true,noKeys:true,floor:-8,xray0:false,cut0:1,clip:[0.02,6],psize:0.32,
  cam:{p:[120,30,40],t:[0,24,0]},
  legend:'<span><i style="background:var(--wind)"></i>風</span><span><i style="background:var(--air)"></i>共鳴管から出た風</span><span><i style="background:var(--sound)"></i>圧力が高い</span><span><i style="background:var(--wind);opacity:.6"></i>圧力が低い</span>',
  foot:'Vox humana 8′ の c（約131 Hz）を想定した断面です。舌とシャロットのまわりは見やすさのため拡大し、舌の開きも誇張しています。振動は実際の毎秒約131回を、約5.5回に遅くして表示しています。音は実際の高さで鳴ります。',
  summary:'リード管（舌管）が音を出すしくみを、縦に半分に切った断面で見ます。足穴から入った風はブーツを満たし、舌とシャロットのすき間からシャロットの中へ流れ込みます。舌は風に引き込まれてシャロットに打ち付け、開口をふさぎ、自分のばねの力で戻ります。この開閉で風が脈動になり、共鳴管が音色を整えます。',
  steps:[
    {t:'リード管を縦に半分に切った断面です。「風を送る」を押すと足穴から風が入ります。',run:a=>{a.ctl('wind',false);a.cut(1);a.home();}},
    {t:'足穴から入った風はブーツの中を満たします。風の出口は、舌とシャロットのすき間だけです。',run:a=>{a.ctl('wind',true);a.cam([70,14,10],[0,15,0]);}},
    {t:'シャロットの前面の開口は真鍮の舌で覆われています。舌は先がわずかに反っていて、そのすき間から風がシャロットの中へ流れ込みます。',run:a=>{a.ctl('wind',false);a.cam([17,22,13],[0,22.5,1]);}},
    {t:'風を送ると、流れ込む風で舌が引き込まれてシャロットに打ち付け、開口をふさぎます。舌は自分のばねの力で戻って再び開きます。この繰り返しで、風はとぎれとぎれの脈動になってシャロットから共鳴管へ送られます。',run:a=>{a.ctl('wind',true);a.cam([17,22,13],[0,22.5,1]);}},
    {t:'共鳴管の中では圧力の変化が上下に伝わり、音色と音量を整えます。',run:a=>{a.ctl('wind',true);a.home();}},
    {t:'チューニングワイヤーが舌を押さえる位置で、舌の振動する長さが決まります。ワイヤーを下げると振動する部分が短くなって音が高く、上げると長くなって低くなります。下のスライダーで動かしてください。',run:a=>{a.ctl('wind',true);a.cam([17,24,13],[0,23.5,1]);a.ctl('wire',yWire(-0.9));later(1600,()=>api.ctl('wire',yWire(0.9)));later(3200,()=>api.ctl('wire',yWire(0)));}}
  ],
  build(){ return buildReedSection(); }},
'b-01':{id:'B-01',name:'くさび型ふいご（人力）',terms:'wedge bellows · Keilbalg · soufflet cunéiforme · spaanbalg · mantice a cuneo · fuelle de cuña',stops0:[1,0,1,0,0],own:true,floor:-7,sc:1,gridS:3,maxDist:1600,
  cam:{p:[-480,320,420],t:[-130,70,-100]},clip:[-400,100],
  summary:'ドン・ベドスの本（18世紀）に描かれた形の、床に寝かせたくさび型ふいご3台です。尾の蝶番を中心に上板が扇のように開閉します。カルカント（ふいごを動かす人）が長いレバーの先を引き下げると、支点の反対側の腕が吊り金で上板を持ち上げ、外気を吸い込みます。手を離すと、上板に載せたおもりの重さで風が押し出されます。1人のカルカントが減ったふいごから順にレバーを引くので、風が途切れません。',
  steps:[
    {t:'3台のふいごに風が入った状態から始めます。上板に載せたおもりの重さが、風に一定の圧力（約75 mm）をかけています。「カルカント」が入っていると、カルカントが、減ったふいごのレバーを順に引き下げます。たくさん弾くほど速く引きます。',run:a=>{a.keys([]);a.ctl('auto',true);}},
    {t:'和音を弾くと、ふいごの風が風導管を通って風箱へ流れ、上板が少しずつ下がっていきます。上板が下がるにつれて、レバーの先は上がってきます。',run:a=>{a.stops([1,1,1,0,0]);a.keys([0,4,7]);}},
    {t:'ふいご1のレバーを引きます。レバーは台の上の支点で回り、反対側の腕が吊り金で上板の先を持ち上げます。上板が上がる間は吸気弁が開いて外気（灰色の粒子）が入り、出口の逆止弁は閉じます。その間はほかの2台が風を送ります。',run:a=>a.ctl('pump0',2.4)},
    {t:'「カルカント」を切ると、カルカントは手を止めて立っています。誰も引かずにいると、3台とも空になったところで水柱計が下がり、音程が下がって音が弱まります。',run:a=>{a.ctl('auto',false);a.keys([0,4,7,12]);a.stops([1,1,1,1,0]);}},
    {t:'「カルカント」を入れて、全部のストップで大きな和音を弾きます。カルカントは一番減ったふいごから順にレバーを引き、たくさん弾くほど速く引くので、風が途切れません。',run:a=>{a.ctl('auto',true);a.stops([1,1,1,1,1]);a.keys([0,2,4,5,7,9,11,12]);}}
  ],
  build(){ return buildBedosOrgan(); }},
'b-02':{id:'B-02',name:'電動ブロワー＋マガジンふいご',terms:'blower + reservoir · Gebläse + Magazinbalg · ventilateur + réservoir · windmotor + magazijnbalg · elettroventilatore + serbatoio · ventilador + fuelle depósito',stops0:[1,0,1,0,0],own:true,floor:0,sc:1,gridS:2,maxDist:1200,
  cam:{p:[-40,230,440],t:[-110,70,0]},clip:[-300,80],
  summary:'電動の送風機（ブロワー）が連続して風を送り、マガジンふいご（リザーバー）が上板のおもりで風圧を一定に保ちます。上板が上がると、上板から吊ったひもがカーテン弁のローラーを引き上げ、カーテンが入口のスリットを下からふさいで入る風を絞ります。上板が下がるとローラーも下がり、ばねの力でカーテンが巻き取られてスリットが開く、という自動調整です。',
  steps:[
    {t:'送風機を止めた状態です。ふいごは空で、風箱にも風がありません。',run:a=>{a.keys([]);a.ctl('reset');a.ctl('blower',false);}},
    {t:'送風機を回します。羽根車が外気を吸い込み、カーテン弁を通ってふいごへ風が入り、上板が持ち上がります。',run:a=>a.ctl('blower',true)},
    {t:'上板が上がるとひもがローラーを引き上げ、カーテンがスリットをふさいで流入が絞られます。流入と消費がつり合った高さで上板が止まり、風圧は約80 mmに保たれます。',run:a=>{a.xray(true);a.cam(...B02V);}},
    {t:'たくさんの鍵とストップを使うと消費が増えて上板が下がり、カーテンが大きく開いて流入が増えます。上板は消費に応じた高さで止まり、風が尽きることはありません。',run:a=>{a.stops([1,1,1,1,1]);a.keys([0,4,7,12,2]);}},
    {t:'送風機を止めて弾き続けると、上板が下がりきったところで風圧が失われます。',run:a=>{a.ctl('blower',false);a.stops([1,1,1,1,1]);a.keys([0,4,7,12,2]);}}
  ],
  build(){
    // everything at full size: the blower and reservoir (laid out at 45 %) drawn 1/0.45 larger, 0.3 m to the left of the chest
    let chest=null;
    const P=fullChestPlan(30,0), K=1/0.45, O=[P.xL-40+55*K,0,0], w=(x,y,z)=>V3(O[0]+K*x,O[1]+K*y,O[2]+K*z), a=w(-60,4,6), xT=P.xL-10;
    const M=buildBlowerMag({K,O,trunkS:7,trunkPts:[w(-60,11.5,6),a,V3(xT,a.y,a.z),V3(xT,a.y,P.zIn),V3(xT,P.yIn,P.zIn),V3(P.xL-0.5,P.yIn,P.zIn)]});
    chest=buildFullChest(P,M.trunk); chest.finish();
    B02V=[w(-62,27,34).toArray(),w(-87,16,0).toArray()];
    return {chest,pins:[{t:'送風機',p:w(-122,19,0)},{t:'マガジンふいご',p:w(-75,42,17)},{t:'カーテン弁',p:w(-87,22,-4),max:160*K},{t:'風導管',p:V3(xT,P.yIn+8,P.zIn)},{t:'風箱',p:V3(chest.xR+4,chest.base,chest.zF)}],controls:[{type:'toggle',id:'blower',label:'送風機',get:()=>M.blower,set:v=>M.blower=v}],
      ctl:{blower:v=>M.blower=v,reset:()=>M.reset()},
      update(dt){ M.update(dt,chest.speaking().length); chest.update(dt); }};
  }},
'c-01':{id:'C-01',name:'スライダーチェスト',terms:'slider chest · Schleiflade · sommier à gravures · sleeplade · somiere a tiro · secreto de correderas',stops0:[1,0,1,0,0],floor:-8,sc:1,gridS:2,maxDist:1200,
  cam:{p:[180,165,250],t:[0,80,0]},clip:[-95,95],
  summary:'鍵ごとに「トーンチャンネル」と呼ばれる細長い部屋があり、押鍵でその下のパレットが開きます。部屋の上を横切るスライダー（ストップごとの細長い板）の穴が、上下の穴と一致したストップのパイプだけが鳴ります。機械式オルガンで最も広く使われてきた風箱です。',
  steps:[
    {t:'木部を透かします。風箱の下半分（パレットボックス）には、送風機から来た風が常に満ちています。',run:a=>{a.xray(true);a.cut(0);a.keys([]);a.stops([0,0,0,0,0]);a.cam([180,165,250],[0,80,0]);}},
    {t:'ストップを入れずに鍵Eを押します。Eのパレットが下に開いてチャンネルに風が入りますが、スライダーの穴がずれているので風は止まり、音は出ません。',run:a=>{a.stops([0,0,0,0,0]);a.keys([4]);}},
    {t:'Prinzipal 2′ を入れます。スライダーが横に動いて穴が一致し（緑）、そのパイプにだけ風が抜けて鳴ります。',run:a=>{a.stops([0,0,1,0,0]);a.keys([4]);}},
    {t:'Gedackt 8′ と Mixtur も入れます。1つのチャンネルの風が、穴の開いたすべてのパイプへ分かれます。Mixturは1鍵で3本が同時に鳴ります。',run:a=>{a.stops([1,0,1,1,0]);a.keys([4]);}},
    {t:'鍵を離すとパレットが閉じ、チャンネル内の風はパイプから抜けて止まります。',run:a=>a.keys([])},
    {t:'断面でFisのチャンネルを切り、鍵を押します。パレット・チャンネル・スライダー・上板・パイプの縦の関係がわかります。',run:a=>{a.xray(false);a.cut(C01V.cut);a.stops([1,1,1,1,1]);a.keys([6]);a.cam(...C01V.cam);}}
  ],
  build(){
    // full size: the chest built like the H-03 chests (channel widths and stop rows from the real pipes, C/Cis layout)
    const P=fullChestPlan(0,-8), chest=buildFullChest(P,null,'R'); chest.finish();
    const xF=P.CL.xs[6], xp=chest.xR+5, yCh=P.yC+13, z1=P.rows[0].z;
    C01V={cut:(95-(xF+0.6))/190,cam:[[150,48,0],[xF,38,0]]};   // step 6: the section through the Fis channel, seen from the right
    return {chest,pins:[{t:'パレットボックス',p:V3(xp,P.yC+5,chest.zF)},{t:'トーンチャンネル',p:V3(xp,yCh+6,chest.zF)},{t:'スライダー',p:V3(xp,chest.yS+0.5,z1)},{t:'上板',p:V3(xp,chest.base-2,z1)},{t:'パイプ',p:V3(xp,chest.base+60,0)}],update(dt){ chest.update(dt); }}; }},
'c-02':{id:'C-02',stopSet:[0,17,8,18,19],name:'スプリングチェスト',terms:'spring chest · Springlade · sommier à ressorts · springlade · somiere a vento · secreto de muelles',stops0:[1,0,1,0,0],floor:-8,sc:1,gridS:2,maxDist:1200,
  cam:{p:[180,165,250],t:[0,80,0]},clip:[-95,95],
  summary:'スライダーの代わりに、パイプごとにばねで閉じた小さな弁（ばね弁）をチャンネルの天井に持つ風箱です。ストップを入れるとストップバーが下がり、ピンでそのストップの弁をまとめて押し開けます。16〜17世紀のオランダや北ドイツ、19世紀までのイタリアなどで使われました。',
  steps:[
    {t:'木部を透かします。チャンネルの天井に、ストップごと・鍵ごとのばね弁が並び、ばねで閉じています。',run:a=>{a.xray(true);a.cut(0);a.keys([]);a.stops([0,0,0,0,0]);a.cam([180,165,250],[0,80,0]);}},
    {t:'鍵Eを押します。チャンネルに風が入りますが、ばね弁が閉じているので止まります。',run:a=>{a.stops([0,0,0,0,0]);a.keys([4]);}},
    {t:'Gedackt 8′ を入れます。ストップバーが下がり、ピンがこのストップの13個の弁をまとめて押し開けます。',run:a=>{a.stops([1,0,0,0,0]);a.keys([4]);}},
    {t:'鍵を離しても、ばね弁は開いたままです。ストップが入っていても、パレットが開かない限り鳴りません。実物ではノブの軸の刻みを留めに掛けて、この位置に保ちます（E-02）。',run:a=>a.keys([])},
    {t:'和音を弾きます。パレットとばね弁の両方が開いたパイプだけが鳴ります。スライダーチェスト（C-01）と、止める方法の違いを比べてください。',run:a=>{a.stops([1,1,1,0,0]);a.keys([0,4,7]);}}
  ],
  build(){
    // full size, built like the H-03 chests, with spring valves and stop bars instead of sliders
    const P=fullChestPlan(0,-8), chest=buildFullChest(P,null,'R',true); chest.finish();
    const xp=chest.xR+5, z1=P.rows[0].z;
    return {chest,pins:[{t:'パレットボックス',p:V3(xp,P.yC+5,chest.zF)},{t:'トーンチャンネル',p:V3(xp,P.yC+19,chest.zF)},{t:'ばね弁',p:V3(xp,chest.yS-2,z1)},{t:'ストップバー',p:V3(xp,chest.yS+3,z1-3)},{t:'パイプ',p:V3(xp,chest.base+60,0)}],update(dt){ chest.update(dt); }}; }},
'c-03':{id:'C-03',stopSet:[20,21,22,23,3],name:'コーンバルブチェスト',terms:'cone-valve chest · Kegellade · sommier à cônes · kegellade · somiere a coni · secreto de conos',stops0:[1,0,1,0,0],floor:-10,sc:1,gridS:2,maxDist:1200,
  cam:{p:[300,230,380],t:[0,90,0]},clip:[-130,130],
  summary:'ストップごとに風箱の長さいっぱいの部屋（ストップチャンネル）があり、パイプ1本ごとに円錐弁が付いた風箱です。鍵を押すとその鍵の円錐弁がいっしょに持ち上がり、風のあるチャンネル（入っているストップ）のパイプだけが鳴ります。円錐弁を持ち上げる方法には、鍵の力で直接持ち上げる機械式と、小ふいごで持ち上げる空気式があります。こちらのモデルは機械式です。',
  steps:[
    {t:'コーンバルブチェストです。ストップごとに風箱の長さいっぱいの部屋（ストップチャンネル）があり、パイプ1本ごとに円錐弁があります。',run:a=>{a.cut(0);a.xray(true);a.keys([]);a.stops([0,0,0,0,0]);a.home();}},
    {t:'ストップを入れると、左端のストップ弁が開いて、そのストップのチャンネルにだけ風が満ちます。',run:a=>{a.cut(0);a.keys([]);a.stops([1,0,0,0,0]);a.cam(...C03V.s2);}},
    {t:'円錐弁は、チャンネルの底板の座に、風に押されて閉じています。鍵を押すとトラッカーがスクエア E を回し、E がその鍵の引き棒を手前へ引きます。引き棒につながった小さなスクエアが回り、5つの円錐弁の棒をいっしょに押し上げて、座の穴が開きます。',run:a=>{a.stops([0,0,0,0,0]);a.keys([4]);a.xray(false);a.cut(C03V.cut);a.cam(...C03V.s3);}},
    {t:'風のあるチャンネル（入っているストップ）のパイプだけが鳴ります。風は円錐弁の座から導管を通ってパイプへ届きます。',run:a=>{a.stops([1,0,1,0,0]);a.keys([4]);a.cam(...C03V.s4);}},
    {t:'和音を弾きます。ここでは鍵の力でスクエアと引き棒を介して円錐弁を持ち上げる機械式です。ほかに、ストップチャンネルの下の小ふいごで持ち上げる空気式もあります。',run:a=>{a.cut(0);a.stops([1,1,1,0,0]);a.keys([0,4,7]);a.home();}}
  ],
  build(){ return buildConeChest(); }},
'c-04':{id:'C-04',stopSet:[24,25,26,27,28],name:'メンブレンチェスト',terms:'membrane chest · Membranlade · sommier à membranes · membraanlade · somiere a membrane · secreto de membranas',stops0:[1,0,1,0,0],floor:4,legend:'ctrl',sc:1,gridS:2,maxDist:1200,
  cam:{p:[300,230,380],t:[0,90,0]},clip:[-130,130],
  summary:'パイプの穴の下端を、下から制御風で押し上げた革の膜でふさぐ風箱です。鍵を押すと、手前の弁室Dの二重弁が下がってDからの制御風を止め、排気口を開け、その鍵の音のチャンネルの風が下へ逃げます。するとストップチャンネルの風が膜を押し下げてパイプへ流れ込みます。風が抜けることで動く「排気式」です。',
  steps:[
    {t:'メンブレンチェストです。鍵ごとの音のチャンネル（いちばん下の管路）の上に、パイプの穴ごとに革の膜があり、その上がストップチャンネルです。パイプの穴の管はストップチャンネルの中を下へ通り、下端が膜の真上で開いています。',run:a=>{a.xray(true);a.keys([]);a.stops([1,0,1,0,0]);a.home();}},
    {t:'ふだんは、手前の弁室Dから制御風（橙）が音のチャンネルに送られ、膜を押し上げてパイプの穴の下端をふさいでいます。ストップを入れても鳴りません。',run:a=>{a.keys([]);a.stops([1,0,1,0,0]);a.cam(...C04V.s2);}},
    {t:'鍵を押すと二重弁が下がります。上の弁が弁室Dの出口をふさいで制御風を止め、同じだけ下がった下の弁と排気口のあいだにすき間ができて、音のチャンネルにたまっていた制御風が外へ逃げます。',run:a=>{a.keys([4]);a.cam(...C04V.s3);}},
    {t:'膜を押し上げていた風が抜けると、ストップチャンネルの風が膜を押し下げ、パイプの穴へ流れ込んでパイプが鳴ります。',run:a=>{a.keys([4]);a.cam(...C04V.s2);}},
    {t:'鍵を離すと二重弁が元の位置に上がって排気口が閉じ、弁室Dから再び制御風が送られます。膜が押し上げられ、パイプへの風が止まります。',run:a=>{a.keys([]);a.cam(...C04V.s3);}}
  ],
  build(){ return buildMembraneChest(); }},
'f-02':{id:'F-02',name:'トレムラント',terms:'tremulant · Tremulant · tremblant · tremulant · tremolo · trémolo',stops0:[0,0,0,0,0],own:true,noStops:true,noKeys:true,floor:-2,sc:1,homeK:1.05,
  cam:{p:[110,120,240],t:[-14,58,0]},clip:[-12,12],
  foot:'1本のパイプ（Prinzipal 2′ の C）と、それに風を送る風導管だけの模型です。トレムラントの揺れの速さは実際と同じ（毎秒約4〜8回）で、音も実際の速さで揺れます。右上の水柱計で風圧の揺れが見えます。',
  summary:'トレムラントは、パイプへ送る風の圧力を周期的に揺らして、音に波打つような揺れを付ける装置です。風導管の小ふいごの弁から風を逃がして揺らすヴィップフェーダー・トレムラント（Bock）と、風導管の中の重い板で流れを揺らすトランブラン・ドゥの、2つの型を切り替えて見られます。',
  steps:[
    {t:'リザーバーから風導管を通って、パイプの風箱へ風が送られています。まずトレムラントを切った状態で音を聞いてください。風圧（右上の水柱計）は一定です。',run:a=>{a.xray(true);a.ctl('play',true);a.ctl('trem',false);a.home();}},
    {t:'ヴィップフェーダー・トレムラント（Bock）：風導管の横に付けた小ふいごが風でふくらみ、ストッパーまで上がると、おもりの慣性で弁が開いて風が外へ逃げます。小ふいごがしぼむとおもりが弁を閉じ、これを繰り返します。',run:a=>{a.ctl('type','wipp');a.ctl('trem',true);a.cam([-6,30,38],[-24,17,8]);}},
    {t:'弁から風が逃げるたびに風導管の風圧が下がり、パイプの音の強さと高さがわずかに揺れます。揺れははっきりしていて、強めの効果になります。',run:a=>{a.ctl('type','wipp');a.ctl('trem',true);a.home();}},
    {t:'トランブラン・ドゥ：風導管の中に、外のおもりで重くした木の板（フラップ）があります。流れる風に押されて板が開閉し、風の流れを周期的に弱めます。風を外へ逃がさないので、揺れは穏やかです。',run:a=>{a.ctl('type','doux');a.ctl('trem',true);a.cam([14,29,26],[-2,18,0]);}},
    {t:'どちらの型も、おもりの位置で揺れの速さが変わります。下のスライダーで速さを変え、「ヴィップフェーダー型」と「トランブラン・ドゥ」を切り替えて聞き比べてください。',run:a=>{a.ctl('trem',true);a.home();}}
  ],
  build(){ return buildTremulant(); }},
'd-01':{id:'D-01',name:'サスペンデッドアクション',terms:'suspended action · hängende Traktur · traction suspendue · hangende traktuur · trasmissione sospesa · transmisión suspendida',stops0:[1,0,1,0,0],floor:-12,sc:1,gridS:2,maxDist:1200,
  cam:{p:[260,200,300],t:[0,80,-40]},clip:[-100,100],
  summary:'鍵が奥の端（尾部のラック）のピンを支点にしてトラッカーに吊られている、サスペンデッド（吊り下げ式）アクションです。鍵を押すと鍵全体が下がり、トラッカーを直接引き下げます。また、鍵盤の幅や音の並びは、風箱のパレットの位置と一致しないことがよくあります。ローラーボードは横軸の棒（ローラー）を回して引く位置を左右に移し、スクエア（L字形の腕木）は引く向きを90度変えます。この風箱では、パレットは鍵と同じ半音階の順に並び、低い音ほどチャンネルの幅が広くなっています。',
  steps:[
    {t:'鍵盤 → ローラーボード → スクエア → 水平のトラッカー → スクエア → 風箱、と伝わります。風箱は手前の鍵盤より奥・上にあります。',run:a=>{a.keys([]);a.home();}},
    {t:'鍵Cを押します。ローラーが回って引く位置を左端へ移し、スクエアで向きを変えて奥の風箱へ伝えます。',run:a=>{a.stops([1,0,1,0,0]);a.keys([0]);}},
    {t:'鍵Cisを押します。今度はCのすぐ右のパレットが開きます。パレットは鍵と同じ半音階の順に並んでいます。',run:a=>a.keys([1])},
    {t:'鍵とローラーの腕のつなぎ目です。トラッカーの下端のネジ線が鍵の穴を、上端がローラーの腕の穴を通り、革ナットで受けています。ローラーの両端のピンは軸受けで支えられています。',run:a=>{a.keys([0]);a.cam([22,14,40],[-9,7,13]);}},
    {t:'半音階で順に押すと、開くパレットが左から右へ順に移っていきます。',run:a=>{a.keys([]);for(let k=0;k<13;k++) later(k*420,()=>{S.key.fill(false);S.key[k]=true;syncKeyUI();}); later(13*420,()=>{S.key.fill(false);syncKeyUI();});}},
    {t:'鍵Fを押して、縦 → 横 → 縦と力の向きが変わる様子を見ます。',run:a=>{a.keys([]);later(400,()=>{S.key[5]=true;syncKeyUI();});a.cam(...D01V);}}
  ],
  build(){
    // full-size chest (C/Cis layout, built like the H-03 chests) on a stand behind and above the keyboard; its pull-down
    // line is at z −36 as before, so the roller board and the squares stay where they were
    const P=fullChestPlan(48,-12,-32.5), chest=buildFullChest(P,null,'R');
    const kb=buildKeyboard({x:0,y:0,z:34}); box(CX.root,30,8.5,61,MAT.woodDark,0,-7.75,5.5,LB('演奏台（コンソール）の台','Spieltisch'));
    const rs=buildRollerSquare(chest,kb); chest.finish();
    const xF=chest.pos(5); D01V=[[xF+110,50,-10],[xF,32,-15]];
    return {chest,pins:[{t:'鍵盤',p:V3(-16,3,40)},{t:'ローラーボード',p:V3(chest.xL-6,24,11)},{t:'スクエア',p:V3(chest.xR+4,36,11)},{t:'水平のトラッカー',p:V3(chest.xR+4,37,-18)},{t:'風箱',p:V3(chest.xR+5,chest.base,chest.zF)}],update(dt){ chest.update(dt); kb.update(); rs.update(); }};
  }},
'd-02':{id:'D-02',name:'バランスアクション',terms:'balanced action · Wippenmechanik · traction à balanciers · balanstraktuur · trasmissione bilanciata · transmisión equilibrada',stops0:[1,0,1,0,0],floor:-12,sc:1,gridS:2,maxDist:1200,
  cam:{p:[280,210,300],t:[0,80,-70]},clip:[-100,100],
  summary:'バランスアクション（釣り合い式の鍵盤のアクション）では、鍵の中ほどにバランスレールのピンがあり、鍵はそれを支点にシーソーのように動きます。鍵を押すと奥の端が上がるので、そこに立てたスティッカー（押し棒）がバックフォール（ウィッペ）を押し上げ、支点の反対側の腕が下がってトラッカーを引きます。その先は D-01 と同じく、ローラーボードとスクエアで風箱のパレットまで伝えます。鍵は吊られずに支点に載っていて、鍵とアクションを戻すのはパレットばねの力です。',
  steps:[
    {t:'鍵盤 → スティッカー → バックフォール → ローラーボード → スクエア → 水平のトラッカー → スクエア → 風箱、と伝わります。鍵は中ほどのバランスレールのピンを支点にシーソーのように動き、押すと奥の端が上がります。',run:a=>{a.xray(true);a.cut(0);a.keys([]);a.home();}},
    {t:'鍵Cを押します。鍵の奥の端が上がってスティッカーがバックフォールの手前の腕を押し上げ、奥の腕が下がってトラッカーを引きます。ローラーが引く位置を左端へ移し、スクエアで向きを変えて奥の風箱へ伝えます。',run:a=>{a.stops([1,0,1,0,0]);a.keys([0]);}},
    {t:'鍵の中ほどを見ます。鍵はバランスレールのピンに載っていて、手前を押すと奥の端が持ち上がります。D-01（サスペンデッドアクション）では鍵は奥の端を支点にトラッカーに吊られていましたが、ここでは鍵は自分の支点に載っていて、戻すのはパレットばねの力です。',run:a=>{a.xray(false);a.keys([4]);a.cut(0.515);a.cam([46,16,10],[-3,2,-4]);}},
    {t:'スティッカーとバックフォールです。鍵の奥の端に立てた押し棒（スティッカー）がバックフォール（ウィッペ）の手前の腕を押し上げると、支点の反対側の腕が下がり、そこに掛けたトラッカーがローラーボードの腕を引き下げます。',run:a=>{a.xray(false);a.cut(0);a.keys([5]);a.cam([30,24,-6],[-4,9,-30]);}},
    {t:'鍵Cisを押します。今度はCのすぐ右のパレットが開きます。パレットは鍵と同じ半音階の順に並んでいます。',run:a=>{a.xray(true);a.cut(0);a.keys([1]);a.home();}},
    {t:'半音階で順に押すと、鍵の奥の端とバックフォールが順に動き、開くパレットが左から右へ順に移っていきます。',run:a=>{a.xray(true);a.cut(0);a.keys([]);for(let k=0;k<13;k++) later(k*420,()=>{S.key.fill(false);S.key[k]=true;syncKeyUI();}); later(13*420,()=>{S.key.fill(false);syncKeyUI();});}}
  ],
  build(){
    // full-size chest (C/Cis layout, built like the H-03 chests) on a stand; its pull-down line stays at z −76
    const KD2=new Float32Array(13);
    const chest=buildFullChest(fullChestPlan(48,-12,-72.5),null,'R',false,KD2); const kb=buildBalanceKeyboard({x:0,y:0,z:34}); box(CX.root,30,8.5,61,MAT.woodDark,0,-7.75,5.5,LB('演奏台（コンソール）の台','Spieltisch'));
    const ba=buildBalancedAction(chest,kb,KD2); chest.finish();
    return {chest,pins:[{t:'鍵盤',p:V3(-16,3,40)},{t:'バランスレール',p:V3(-18,-1,4),max:160},{t:'スティッカーとバックフォール',p:V3(-18,12,-24),max:160},{t:'ローラーボード',p:V3(chest.xL-6,26,-41)},{t:'スクエア',p:V3(chest.xR+4,42,-40)},{t:'水平のトラッカー',p:V3(chest.xR+4,43,-60)},{t:'風箱',p:V3(chest.xR+5,chest.base,chest.zF)}],update(dt){ kb.update(); ba.update(); chest.update(dt); }};
  }},
'e-01':{id:'E-01',name:'機械式ストップアクション（スライダーチェスト）',terms:'mechanical stop action · mechanische Registertraktur · tirage mécanique des jeux · mechanische registertraktuur · trasmissione meccanica dei registri · transmisión mecánica de registros',stops0:[0,0,0,0,0],floor:-8,sc:1,gridS:2,maxDist:1200,
  cam:{p:[-170,80,130],t:[-90,30,0]},clip:[-120,95],
  summary:'ストップノブを引くと、ノブの軸が縦のローラーを回し、上の腕がスライダーを横に動かして穴を一致させます。ノブの引き量とスライダーの移動量は、ローラーの腕の長さの比で決まります。',
  steps:[
    {t:'木部を透かします。左のノブ5本が、それぞれ縦のローラーを介して1本のスライダーにつながっています。',run:a=>{a.xray(true);a.keys([]);a.stops([0,0,0,0,0]);a.cam([-170,80,130],[-90,30,0]);}},
    {t:'Gedackt 8′ を引きます。ノブの軸が手前に動き、ローラーが回って上の腕がスライダーを右へ押します。緑に光るのがストップの伝達経路です。',run:a=>a.stops([1,0,0,0,0])},
    {t:'ノブの移動 約36 mm に対して、スライダーは約18 mm 動きます。下の腕と上の腕の長さが 8：4 なので、スライダーを押す力はノブを引く力の約2倍になります。',run:()=>{}},
    {t:'スライダーの穴が上下と一致したので、鍵を押すとこのストップが鳴ります。',run:a=>{a.stops([1,0,0,0,0]);a.keys([0,4,7]);}},
    {t:'全部のストップを入れてから、まとめて切ります。',run:a=>{a.keys([0,4,7]);a.stops([1,1,1,1,1]);later(2200,()=>{api.stops([0,0,0,0,0]);});}}
  ],
  build(){
    // full-size slider chest (as C-01) whose sliders stick out at the left, where the stop action works them
    const chest=buildFullChest(fullChestPlan(30,-8),null,'R',false,null,{slDir:-1,slOff:s=>-1.8*(1-s)}); const sa=buildStopAction(chest,{ky0:6,kz:chest.zF+2}); chest.finish();
    const xS=chest.xL-15;
    return {chest,pins:[{t:'ストップノブ',p:V3(xS-2,26,chest.zF+4)},{t:'ストップのローラー',p:V3(xS-12,40,chest.rows[0].z+4)},{t:'スライダー',p:V3(xS+4,chest.yS+4,chest.rows[0].z)},{t:'風箱',p:V3(chest.xR+5,chest.base,chest.zF)}],update(dt){ chest.update(dt); sa.update(); }}; }},
'd-03':{id:'D-03',stopSet:[29,30,31,32,33],name:'バーカーレバー',terms:'Barker lever · Barkerhebel · machine Barker · Barkermachine · macchina Barker · palanca Barker',stops0:[1,0,1,0,0],floor:-12,sc:1,gridS:2,maxDist:1400,
  cam:{p:[400,300,200],t:[0,90,-130]},clip:[-100,100],
  summary:'重い機械式アクションを風の力で助けるバーカーマシンを、D-02 と同じバランス式の鍵盤とスライダーチェストのあいだに入れたモデルです。鍵が動かすのは各マシンの小さなパレットと弁だけで、パレットが開くと風箱の風が鍵ごとの小ふいごに入り、ふくらむ力で風箱のパレットまでのアクションを引きます。19世紀の大オルガンで、カプラーをつないだ鍵盤を軽くするために使われました。13組のマシンは鍵盤と風箱とは別に立てた櫓に、上の段に7組、下の段に6組並んでいます。',
  steps:[
    {t:'全体です。鍵盤 → スティッカーとバックフォール → ローラーボード 1 → スクエアと水平のトラッカー → 櫓のバーカーマシン → 出力のバックフォール → ローラーボード 2 → スクエアと水平のトラッカー → 風箱、と伝わります。風箱は、櫓の上面より高い台の上にあります。マシンは鍵の順に並び、上の段と下の段に交互に置かれています（上の段に C・D・E・Fis・Gis・B・c の7組、下の段に Cis 側の6組）。上の段のマシンのトラッカーは、下の段のマシンのあいだを通ります。',run:a=>{a.xray(true);a.cut(0);a.stops([1,0,1,0,0]);a.keys([]);a.home();}},
    {t:'鍵 C を押します。バックフォールが下がってローラーボード 1 を引き、ローラーが引く位置を上の段の左端のマシンの位置へ移し、スクエアと水平のトラッカーが櫓の下まで運びます。トラッカー h がマシンのレバー g を引き下げると、マシンのパレットが開いて排気弁が閉じ、小ふいごがふくらみます。',run:a=>{a.xray(true);a.cut(0);a.keys([0]);a.cam([80,140,30],[0,70,-100]);}},
    {t:'鍵 Cis を押します。今度は下の段の左端のマシンが働きます。上の段のマシンへのトラッカーは、下の段のマシンのあいだのすき間を通っています。',run:a=>{a.xray(true);a.cut(0);a.keys([1]);a.cam([80,110,30],[0,55,-100]);}},
    {t:'上の段の左端のマシン（鍵 C）の断面です。手前の風箱にはパレットと排気弁があり、奥の厚い板の上に小ふいごが載っています。鍵を押すとパレットが開き、風が小部屋と板の中の通り道を通って小ふいごに入ります。',run:a=>{a.xray(true);a.cut(0.65);a.keys([0]);a.cam([60,96,-95],[-31,92,-105]);}},
    {t:'出力側です。小ふいごの腕がトラッカー r を引き上げると、櫓の下のバックフォールの前の腕が上がり、後ろの腕が下がってローラーボード 2 を引きます。ローラーが引く位置を風箱のパレットの位置（鍵と同じ半音階の順）へ移し、スクエアと水平のトラッカーで風箱の下まで運んで、上へのトラッカーがパレットを引き下げます。',run:a=>{a.xray(true);a.cut(0);a.keys([0]);a.cam([220,120,-150],[0,60,-200]);}},
    {t:'和音を弾きます。指で動かすのは小さなパレットと弁だけなので、ストップを増やしても鍵の重さは変わりません。',run:a=>{a.xray(true);a.cut(0);a.stops([1,1,1,1,0]);a.keys([0,4,7,12]);a.home();}}
  ],
  build(){ return buildBarkerOrgan(); }},
'd-04':{id:'D-04',name:'チューブラーニューマチックアクション',terms:'tubular-pneumatic action · pneumatische Traktur · traction tubulaire pneumatique · buizenpneumatiek · trasmissione pneumatico-tubolare · transmisión neumática tubular',stops0:[1,0,1,0,0],floor:-26,legend:'ctrl',
  cam:{p:[150,60,170],t:[0,10,45]},clip:[-40,40],
  summary:'鍵の動きを、鉛管の中の制御風で風箱へ伝えるアクションです。鍵の弁が制御風を送り（加圧式）または抜き（排気式）、風箱側のリレーが空気式モーターを動かしてパレットを開けます。導管が長いほど、鍵を押してから鳴るまでに遅れが出ます。',
  steps:[
    {t:'演奏台と風箱を、鉛管の導管が結んでいます。風箱の手前に、鍵ごとのリレーと空気式モーターがあります。',run:a=>{a.ctl('exh',false);a.keys([]);a.xray(true);a.home();}},
    {t:'加圧式：鍵を押すと鍵の弁が開き、制御風（橙）が導管を通って風箱側のリレーへ送られます。',run:a=>{a.ctl('exh',false);a.keys([4]);a.cam([30,14,104],[0,-2,88]);}},
    {t:'リレーが制御風で動くと、モーターの入口弁が開いてモーターがふくらみ、バックフォールとトラッカーでパレットを引きます。',run:a=>{a.keys([4]);a.cam([46,32,34],[-10,22,2]);}},
    {t:'導管が長いほど制御風が届くまでに時間がかかり、鍵を押してから鳴るまでに遅れが出ます。下のスライダーで導管の長さを変えると、遅れの時間が表示されます。',run:a=>{a.ctl('len',20);a.keys([]);later(500,()=>api.keys([0,4,7]));a.home();}},
    {t:'排気式：導管はふだん制御風で満ちていて、鍵を押すと風が抜けます。風が抜けたことをリレーが受けて、モーターを動かします。',run:a=>{a.ctl('len',10);a.ctl('exh',true);a.keys([4]);a.cam([30,14,104],[0,-2,88]);}}
  ],
  build(){ return buildTubular(); }},
'f-01':{id:'F-01',name:'スウェルボックス',terms:'swell box · Schwellkasten · boîte expressive · zwelkast · cassa espressiva · caja expresiva',stops0:[1,1,1,0,1],floor:-12,ctlLabel:'スウェル',sc:1,gridS:2,maxDist:1200,
  cam:{p:[230,200,330],t:[-6,90,10]},clip:[-100,100],
  summary:'パイプを厚い木の箱で囲み、前面のシャッター（よろい戸）の開き具合で音量と音色を変える装置です。演奏者はスウェルペダルで開き具合を調節し、音を大きく明るく、または小さくこもった音にします。',
  steps:[
    {t:'スウェルボックスは、パイプを厚い木の箱で囲み、前面のシャッターで音の出口を調節する装置です。和音を鳴らしながら見てください。',run:a=>{a.stops([1,1,1,0,1]);a.keys([0,4,7]);a.ctl('swell',0.5);a.home();}},
    {t:'スウェルペダルを踏み込む（つま先を下げる）とシャッターが開き、音が箱の外へ出て大きく明るい音になります。',run:a=>{a.keys([0,4,7]);a.ctl('swell',1);a.cam(...F01V.front);}},
    {t:'ペダルを戻すとシャッターが閉じ、音は小さく、こもった音色になります。',run:a=>{a.keys([0,4,7]);a.ctl('swell',0);}},
    {t:'ペダルの動きは、トレース、ベルクランク、連結棒を通って、すべてのシャッターに同時に伝わります。バランス式のペダルは、足を離してもその角度で止まります。',run:a=>{a.ctl('swell',0.6);a.cam(...F01V.link);}},
    {t:'下のスライダーで開き具合を変えながら弾いてみてください。',run:a=>{a.home();}}
  ],
  build(){ return buildSwell(); }},
'b-03':{id:'B-03',name:'シュヴィンマー',terms:'schwimmer · Schwimmer · régulateur à ressorts · schwimmer · regolatore a molle · regulador de muelles',stops0:[1,0,1,0,0],own:true,floor:0,sc:1,gridS:2,maxDist:1200,
  cam:{p:[160,120,260],t:[-40,60,10]},clip:[-250,80],
  summary:'シュヴィンマーは、風箱の真下に取り付ける小さなばね式の調圧ふいごです。おもりの代わりにばねで可動板を押し上げて風に圧力をかけ、可動板に棒でつながった入口弁が、ふくらむと閉じ、しぼむと開きます。風箱のすぐ近くで調圧するので、和音を急に弾いたときの風の揺れを素早く抑えます。20世紀以降のオルガンで広く使われています。',
  steps:[
    {t:'シュヴィンマーは風箱の底板のすぐ下にあります。部品を透かすと、ばねに押し上げられた可動板、革のひだ、入口弁が見えます。',run:a=>{a.xray(true);a.keys([]);a.ctl('blower',true);a.ctl('lock',false);a.home();}},
    {t:'送風機の風は、風導管から枠の中の入口の通路に入り、入口弁の穴からシュヴィンマーへ流れ込みます。可動板が下がるほど、棒が弁を引き下げて穴を狭めます。',run:a=>{a.keys([]);a.cam(...B03V.s2);}},
    {t:'和音を弾くと風箱の風が使われ、ばねが可動板を押し上げ、弁が大きく開いて流入が増えます。流入と消費がつり合った位置で可動板が止まります。',run:a=>{a.stops([1,1,1,0,0]);a.keys([0,4,7]);a.cam(...B03V.s3);}},
    {t:'たくさんの鍵とストップで弾いても、風箱のすぐ下で調圧しているので、風圧（右上の水柱計）はほとんど揺れません。ばね式なので、ふくらみ具合によって風圧がわずかに変わるのが特徴です。',run:a=>{a.stops([1,1,1,1,1]);a.keys([0,2,4,5,7,9,11,12]);a.home();}},
    {t:'「シュヴィンマーを固定する」を入れると、可動板がつっかい棒で止まり、送風機の風が長い風導管から直接届きます。和音を弾くたびに風圧が下がって音が揺れるので、シュヴィンマーの働きがわかります。',run:a=>{a.ctl('lock',true);a.stops([1,1,1,1,1]);a.keys([]);for(let j=0;j<6;j++){ later(400+j*1500,()=>api.keys([0,4,7,12,2,9])); later(1150+j*1500,()=>api.keys([])); }}}
  ],
  build(){ return buildSchwimmer(); }},
'd-05':{id:'D-05',name:'ペダル鍵盤のアクション',terms:'pedal action · Pedaltraktur · traction du pédalier · pedaaltraktuur · trasmissione del pedale · transmisión del pedal',stops0:[1,0,1,0,0],floor:0,sc:1,gridS:3,maxDist:1800,
  cam:{p:[380,260,240],t:[0,100,-90]},clip:[-170,170],
  foot:'13鍵（C〜c）のペダル鍵盤。鍵の間隔は実物どおり約62 mm、踏み込みの深さはつま先で約15 mm。鍵はつま先の先から約100 mm オルガンの下へ伸び、その先端でアクションにつながります。演奏台の足元から風箱までは約0.8 m です。風箱とストップは G-03 のペダルと同じで、Subbass 16′（木管・閉管）・Prinzipal 8′・Posaune 16′（全長の円錐共鳴管）。パイプは実物大で、チャンネルの幅は鍵ごとにいちばん太いパイプに合わせています（Subbass 16′ の C は約190×235 mm）。',
  summary:'ペダル鍵盤は足で弾く鍵盤です。鍵はかかと側（ベンチの下）の蝶番を支点に、つま先側が下がります。鍵はつま先の先からさらにオルガンの下へ伸びていて、その先端からトラッカーが下へ引かれます。スクエアで向きを変えた水平のトラッカーがオルガンの下を奥へ進み、風箱の下のローラーボードで鍵の並びをパレットの並びへ広げて、ペダル風箱のパレットを引き下げます。',
  steps:[
    {t:'ペダル鍵盤 → トラッカー → スクエア → 水平のトラッカー → スクエア → ローラーボード → 風箱、と伝わります。',run:a=>{a.keys([]);a.home();}},
    {t:'ペダルCを踏みます。鍵はかかと側の蝶番を支点に回り、つま先側が約15 mm下がります。',run:a=>{a.keys([0]);a.cam([70,42,100],[0,4,24]);}},
    {t:'ペダル鍵は、足で踏むつま先の先からさらにオルガンの下へ伸びています。その先端に、ばね・ガイドピン・下止めのフェルトと、トラッカーの留め金があります。黒鍵は、つま先側に高い台が付いています。',run:a=>{a.keys([1]);a.cam([78,40,30],[-6,3,-18]);}},
    {t:'鍵の先が下がるとトラッカーがスクエアを回し、下向きの引きを手前向きの引きに変えます。水平のトラッカーはオルガンの下を奥へ伸び、風箱側のスクエアで再び下向きの引きに変わります。',run:a=>{a.keys([4]);a.cam([100,60,10],[0,24,-62]);}},
    {t:'風箱の下のローラーボードです。ローラーが回って、鍵の並び（約62 mm 間隔）から幅の広いパレットの並び（鍵と同じ半音階の順。平均 約190 mm 間隔）へ引く位置を移し、トラッカーがパレットを引き下げます。',run:a=>{a.keys([4]);a.cam([125,32,-30],[0,42,-104]);}},
    {t:'半音階で順に踏みます。',run:a=>{a.keys([]);a.home();for(let k=0;k<13;k++) later(k*420,()=>{S.key.fill(false);S.key[k]=true;syncKeyUI();}); later(13*420,()=>{S.key.fill(false);syncKeyUI();});}}
  ],
  build(){ return buildPedalAction(); }},
'e-02':{id:'E-02',stopSet:[0,17,8,18,19],name:'機械式ストップアクション（スプリングチェスト）',terms:'stop action for a spring chest · Registertraktur der Springlade · tirage des jeux du sommier à ressorts · registertraktuur van de springlade · trasmissione dei registri del somiere a vento · transmisión de registros del secreto de muelles',stops0:[0,0,0,0,0],floor:-8,sc:1,gridS:2,maxDist:1200,
  cam:{p:[-150,95,150],t:[-95,30,0]},clip:[-120,95],
  summary:'スプリングチェスト（C-02）では、ストップを入れるとストップバーが下がり、そのストップのばね弁をまとめて押し開けます。ばね弁のばねはいつもバーを押し戻しているので、ストップノブは引いた位置に引っ掛けて保たなければなりません。ノブの軸がスクエアを回し、短い腕が押し棒でバーの端を押し下げます。',
  steps:[
    {t:'木部を透かします。左の5本のストップノブが、それぞれ風箱の端から出たストップバーにつながっています。',run:a=>{a.xray(true);a.keys([]);a.ctl('hook',true);a.stops([0,0,0,0,0]);a.home();}},
    {t:'Gedackt 8′ を引きます。ノブの軸がスクエアの立った腕を手前に引き、短い腕が押し棒でストップバーの端を押し下げます。',run:a=>{a.stops([1,0,0,0,0]);a.cam(...E02V.side);}},
    {t:'ノブの移動 約28 mm に対して、バーは約6 mm 下がります（腕の長さの比 7.2：1.6）。そのストップの13個のばね弁のばねに逆らって押し下げるので、てこで力を大きくしています。引ききるとノブの軸の下面の刻みが留めの柱の上に来て、軸が少し下がって刻みが柱に掛かり、ばねに押し戻されずに引いた位置に保たれます。',run:a=>{a.stops([1,0,0,0,0]);a.cam(...E02V.knob);}},
    {t:'「刻みで保つ」を切ってストップを入れてみます。手を離すと、ばね弁のばねに押し戻されて、ストップはすぐに戻ってしまいます。',run:a=>{a.ctl('hook',false);a.stops([0,0,0,0,0]);later(300,()=>api.stops([0,0,1,0,0]));a.cam(...E02V.side);}},
    {t:'刻みでストップを保って和音を弾きます。ばね弁とパレットの両方が開いたパイプだけが鳴ります。',run:a=>{a.ctl('hook',true);a.stops([1,0,1,0,0]);a.keys([0,4,7]);a.home();}}
  ],
  build(){ return buildSpringStopAction(); }},
'f-03':{id:'F-03',name:'ツィンベルシュテルン',terms:'cymbelstern · Zimbelstern · étoile à clochettes · cimbelster · Zimbelstern · estrella de campanillas',stops0:[0,0,0,0,0],noStops:true,noKeys:true,floor:0,
  cam:{p:[60,60,90],t:[0,42,-6]},clip:[-30,30],
  foot:'星の直径 約25 cm、鈴の直径 約2.5 cm。風車が毎秒約1回転すると、鈴は毎秒6回打たれます。',
  summary:'ツィンベルシュテルンは、ケースの正面で金色の星が回り、その裏で小さな鈴が鳴る効果装置です。ストップを引くと弁が開き、風が小さな風車を回します。星と同じ軸にはカム（突起）が並んでいて、回るたびに打ち子の上端を順にはじきます。はじかれた打ち子は戻る勢いで下端の頭を鈴に打ち当て、軸の回転に合わせて「チン、チン、チン」と鈴が鳴ります。17〜18世紀の北ドイツなどで好まれ、祝祭的な曲で使われます。',
  steps:[
    {t:'ケースの正面に星があり、正面板の裏に、カムの付いた軸、6本の打ち子、下に並んだ6個の鈴、さらに奥に風車があります。木部は透けて見えています。',run:a=>{a.xray(true);a.ctl('on',false);a.home();}},
    {t:'ストップを引くと弁箱の弁が開き、風がノズルから風車の羽根に吹き付けます。風車が回り始め、同じ軸の星と打ち子もいっしょに回ります。',run:a=>{a.ctl('on',true);a.cam([58,34,-46],[6,36,-16]);}},
    {t:'軸のカムが打ち子の上端をはじくと、打ち子は軸を中心に傾き、離れた瞬間に戻る勢いで下端の頭が鈴を打ちます。カムは少しずつ角度をずらして付いているので、6本の打ち子が回転に合わせて順に鈴を鳴らします。鈴は g″ h″ d‴ g‴ h‴ d⁗（ソ・シ・レ・ソ・シ・レ）に調律されていて、ト長調の和音になります。高い音の鈴ほど小さくなっています。',run:a=>{a.ctl('on',true);a.cam([-24,58,-40],[0,45,-7]);}},
    {t:'ストップを戻すと弁が閉じますが、風車は惰性でしばらく回り続け、だんだん遅くなります。',run:a=>{a.ctl('on',false);a.home();}},
    {t:'下のスライダーで風の量を変えると、回る速さと鈴の打たれる間隔が変わります。',run:a=>{a.ctl('on',true);a.home();}}
  ],
  build(){ return buildZimbelstern(); }},
'g-01':{id:'G-01',name:'スライドカプラー',terms:'shove coupler · Schiebekoppel · accouplement à tiroir · schuifkoppel · unione a cassetto · acoplamiento de cajón',stops0:[0,0,0,0,0],floor:-10,homeK:1.0,sc:1,gridS:3,maxDist:2000,
  cam:{p:[120,50,130],t:[0,60,-20]},clip:[-100,100],
  foot:'ハウプトヴェルク（II）：Prinzipal 8′・Octave 4′・Quinte 2 2/3′・Octave 2′・Mixtur III・Trompete 8′、ポジティフ（I）：Gedackt 8′・Rohrflöte 4′・Blockflöte 2′・Vox humana 8′。ストップは下の「ストップ」欄で、1行目がハウプトヴェルク、2行目がポジティフです。パイプは実物大です。風箱のチャンネルの幅は、鍵ごとにいちばん太いパイプに合わせています（ハウプトヴェルクの Prinzipal 8′ の C は直径 約155 mm）。鍵盤のボタンと画面の鍵は、操作欄で選んだほうの鍵盤を弾きます。下鍵盤は、黒鍵まで上鍵盤より手前に出しています。',
  summary:'2段の手鍵盤をつなぐ機械式の押し込み式カプラー（シーブカプラー）です。どちらの鍵盤もサスペンデッド（吊り下げ式）アクションで、鍵は奥端が支点、トラッカーに吊られていて、押すと鍵全体が下がります。下鍵盤（I・ポジティフ）の鍵に突起が立っていて、下鍵盤を約11 mm奥へ押し込むと、突起が上鍵盤（II・ハウプトヴェルク）の鍵の下に付いた当て木の真下に来ます。突起は上鍵盤の下に隠れていて、下鍵盤の演奏の邪魔にはなりません。上の鍵を押すと当て木が突起を押し下げ、下の鍵もいっしょに下がって、ポジティフも鳴ります（I/II）。',
  steps:[
    {t:'2段の鍵盤はどちらもサスペンデッド（吊り下げ式）アクションです。鍵は奥端のラックのピンが支点で、トラッカーに吊られていて、押すと鍵全体が下がります。下鍵盤のトラッカーは上鍵盤のラックの後ろを上がるので、下鍵盤の鍵は長くなっています。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',1);a.ctl('cpl',false);a.ctl('hw',[1,1,0,1,0,0]);a.ctl('pos',[1,1,0,0]);a.keys([]);a.home();}},
    {t:'トラッカーはローラーボードへ上がります。ローラーの腕は鍵の位置が短く、パレットの位置が長くなっていて、吊り下げ式の鍵の小さな引き（約4〜5 mm）を、パレットを開けるのに必要な引き（約10 mm）に大きくしながら、風箱の幅へ左右に広げます。ポジティフ（I・下の風箱）のローラーボードは鍵盤のすぐ上、ハウプトヴェルク（II・上の風箱）のローラーボードはポジティフのパイプの少し上にあり、上鍵盤のトラッカーはポジティフの前をまっすぐ上がっていきます。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',1);a.ctl('cpl',true);a.keys([0,12]);a.home();}},
    {t:'カプラーを切ったまま上鍵盤（II）を弾きます。ハウプトヴェルクだけが鳴ります。下鍵盤は手前に引き出されていて、突起は上の鍵の当て木の前にずれているので当たりません。（鍵Eの位置で縦に切った断面）',run:a=>{a.ctl('man',1);a.ctl('cpl',false);a.keys([4]);a.xray(false);a.cut(0.52);a.cam([26,12,44],[-4,4,24]);}},
    {t:'下鍵盤を奥へ押し込みます（カプラーを入れる）。突起が上の鍵の当て木の真下に来ます。突起は、両方の鍵の下がる量がちょうど等しくなる位置（上鍵盤の下）にあります。',run:a=>{a.ctl('man',1);a.keys([]);a.ctl('cpl',true);a.xray(false);a.cut(0.52);a.cam([26,12,44],[-4,4,24]);}},
    {t:'上鍵盤を弾くと、上の鍵の当て木が突起を押し下げて下の鍵もいっしょに下がり、ポジティフ（下の風箱）も同時に鳴ります。',run:a=>{a.ctl('man',1);a.ctl('cpl',true);a.keys([4]);a.xray(false);a.cut(0.52);a.cam([26,12,44],[-4,4,24]);}},
    {t:'下鍵盤だけを弾いても、下の鍵は上の鍵から離れるだけなので、上の鍵は動きません。吊り下げ式のこのカプラーは「上鍵盤で下鍵盤も弾く」一方向のつながり（I/II）です。',run:a=>{a.ctl('man',0);a.ctl('cpl',true);a.keys([4]);a.xray(false);a.cut(0.52);a.cam([26,12,44],[-4,4,24]);}},
    {t:'ハウプトヴェルクの風箱です。手前から Prinzipal 8′・Octave 4′・Quinte 2 2/3′・Octave 2′・Mixtur III・Trompete 8′。Prinzipal 8′ の低音は直径 約155 mm あるので、ポジティフの風箱よりチャンネルの間隔を広くしています。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',1);a.ctl('hw',[1,1,1,1,1,1]);a.keys([0,4,7]);a.cam(inst.hwView[0],inst.hwView[1]);}},
    {t:'全体を見ます。ハウプトヴェルクの風箱はポジティフの上にあり、そのトラッカーはポジティフの風箱の前を通って上へ伸びています。',run:a=>{a.xray(true);a.ctl('man',1);a.ctl('cpl',true);a.keys([0,4,7]);a.cut(0);a.home();}}
  ],
  build(){ return buildCoupler(); }},
'e-03':{id:'E-03',name:'電気式ストップアクション',terms:'electric stop action · elektrische Registertraktur · tirage électrique des jeux · elektrische registertraktuur · trasmissione elettrica dei registri · transmisión eléctrica de registros',stops0:[0,0,0,0,0],floor:-8,legend:'elec',sc:1,gridS:2,maxDist:1200,
  cam:{p:[-40,110,190],t:[-110,40,10]},clip:[-130,95],
  foot:'電流は実際には一瞬で届きますが、流れがわかるよう遅くして表示しています。ソレノイドがスライダーを動かす時間は実物どおり約0.15秒です。',
  summary:'ストップのタブを押すと、中のスイッチから風箱の端のソレノイドへ電流が流れ、スライダーを動かします。ソレノイドには「入り」と「切り」の2つのコイルがあり、短い電流のパルスでプランジャーを引いたり押し戻したりします。動ききると終端スイッチが電流を切ります。電気なので、コンビネーション（セッター）で記憶したストップの組み合わせを、ボタン1つで一度に呼び出せます。',
  steps:[
    {t:'左手前が演奏台のストップのタブとコンビネーションのボタン（タブ1枚 約27×36 mm）、風箱の左端にスライダーごとのソレノイドがあり、電線でつながっています。',run:a=>{a.xray(true);a.keys([]);a.stops([0,0,0,0,0]);a.ctl('set',false);a.home();}},
    {t:'Gedackt 8′ のタブを押します。タブの中のスイッチから「入り」コイルへ電流（橙）が流れ、コイルがプランジャーを引いて、スライダーを右へ動かします。',run:a=>{a.stops([1,0,0,0,0]);a.cam(...E03V.sol);}},
    {t:'タブを戻すと、今度は「切り」コイルに電流が流れ、プランジャーを押し戻してスライダーを切ります。どちらも短いパルスで、動ききると終端スイッチが電流を切ります。',run:a=>{a.stops([0,0,0,0,0]);a.cam(...E03V.sol2);}},
    {t:'コンビネーション 1 を押します。記憶していた組み合わせ（Gedackt＋Prinzipal）にするため、変わるストップのコイルにだけ同時に電流が送られます。',run:a=>{a.ctl('recall',1);a.cam(...E03V.con);}},
    {t:'コンビネーション 2 で全部のストップ、0 で全部を切ります。「セット」を入れてからコンビネーションを押すと、今のストップの組み合わせを記憶できます。',run:a=>{a.keys([0,4,7]);a.ctl('recall',2);later(2600,()=>api.ctl('recall',0));}}
  ],
  build(){ return buildElectricStops(); }},
'g-02':{id:'G-02',name:'バックフォールカプラー',terms:'backfall coupler · Wippenkoppel · accouplement à balanciers · balanskoppel · unione a bilancieri · acoplamiento de balancines',stops0:[0,0,0,0,0],floor:-10,homeK:1.0,sc:1,gridS:3,maxDist:2000,
  cam:{p:[120,50,130],t:[0,60,-20]},clip:[-100,100],
  foot:'カプラー以外は G-01 と同じです。ハウプトヴェルク（II）：Prinzipal 8′・Octave 4′・Quinte 2 2/3′・Octave 2′・Mixtur III・Trompete 8′、ポジティフ（I）：Gedackt 8′・Rohrflöte 4′・Blockflöte 2′・Vox humana 8′。ストップは下の「ストップ」欄で、1行目がハウプトヴェルク、2行目がポジティフです。鍵盤のボタンと画面の鍵は、操作欄で選んだほうの鍵盤を弾きます。',
  summary:'バックフォールカプラー（ウィッペンコッペル）は、鍵盤の上のアクションの中に組み込んだ、ウィッペン（シーソー形のてこ）式のカプラーです。音ごとに上下2本のウィッペンがあり、上鍵盤（II）のトラッカーが上のウィッペンを引くと、上のウィッペンが線で下のウィッペンを引き上げ、下のウィッペンがポジティフ（I）のトラッカーを引きます（I/II）。下鍵盤の鍵は下のウィッペンに吊られているので、上鍵盤を弾くと下鍵盤の鍵もいっしょに下がります。カプラーを切ると、上のウィッペンバルケン（支点の桟）が下がって、ナットがウィッペンに届かなくなります。',
  steps:[
    {t:'G-01 と同じオルガン（2段ともサスペンデッドアクション、ローラーボード、2つの風箱）に、バックフォールカプラーを付けたモデルです。カプラーは鍵盤のすぐ上のアクションの中にあり、音ごとに上下2本のウィッペンでできています。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',1);a.ctl('cpl',false);a.ctl('hw',[1,1,0,1,0,0]);a.ctl('pos',[1,1,0,0]);a.keys([]);a.home();}},
    {t:'鍵Eの位置で縦に切った断面です。上鍵盤のトラッカー（手前）には革ナットが付いていて、上のウィッペンの手前の腕に上から乗っています。下鍵盤のトラッカー（奥）は、下のウィッペンの奥の腕に留めてあり、鍵はこれに吊られています。上下のウィッペンは線でつながっています。',run:a=>{a.ctl('man',1);a.ctl('cpl',true);a.keys([]);a.xray(false);a.cut(0.52);a.cam([34,24,14],[-4,14,-3]);}},
    {t:'カプラーを入れて上鍵盤を弾きます。ナットが上のウィッペンを引き下げ、奥の腕が上がって線で下のウィッペンの手前の腕を引き上げ、下のウィッペンの奥の腕がポジティフのトラッカーを引きます。下鍵盤の鍵は下のウィッペンに吊られているので、トラッカーといっしょに下鍵盤の鍵も下がり、ハウプトヴェルクとポジティフが同時に鳴ります。',run:a=>{a.ctl('man',1);a.ctl('cpl',true);a.keys([4]);a.xray(false);a.cut(0.52);a.cam([34,24,14],[-4,14,-3]);}},
    {t:'カプラーを切ると、上のウィッペンバルケン（支点の桟）が下がり、上鍵盤のトラッカーのナットが上のウィッペンに届かなくなります。上鍵盤を弾いても、ハウプトヴェルクだけが鳴ります。',run:a=>{a.ctl('man',1);a.ctl('cpl',false);a.keys([4]);a.xray(false);a.cut(0.52);a.cam([34,24,14],[-4,14,-3]);}},
    {t:'下鍵盤を弾くと、トラッカーが下のウィッペンの奥の腕を引き下げ、ポジティフだけが鳴ります。下のウィッペンの手前の腕は上がりますが、つなぎの線のナットが上のウィッペンから浮くだけなので、上鍵盤には伝わりません。',run:a=>{a.ctl('man',0);a.ctl('cpl',true);a.keys([4]);a.xray(false);a.cut(0.52);a.cam([34,24,14],[-4,14,-3]);}},
    {t:'ハウプトヴェルクの風箱です。手前から Prinzipal 8′・Octave 4′・Quinte 2 2/3′・Octave 2′・Mixtur III・Trompete 8′。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',1);a.ctl('hw',[1,1,1,1,1,1]);a.keys([0,4,7]);a.cam(inst.hwView[0],inst.hwView[1]);}},
    {t:'全体を見ます。カプラーを入れて上鍵盤で和音を弾くと、両方の風箱が鳴ります。',run:a=>{a.xray(true);a.ctl('man',1);a.ctl('cpl',true);a.keys([0,4,7]);a.cut(0);a.home();}}
  ],
  build(){ return buildWippenCoupler(); }},
'g-03':{id:'G-03',name:'ペダルカプラー',terms:'pedal coupler · Pedalkoppel · tirasse · pedaalkoppel · unione al pedale · acoplamiento al pedal',stops0:[0,0,0,0,0],floor:-2,homeK:1.0,sc:1,gridS:3,maxDist:2500,
  cam:{p:[330,230,330],t:[0,150,-80]},clip:[-160,160],
  foot:'ハウプトヴェルク（I）：Prinzipal 8′・Octave 4′・Quinte 2 2/3′・Octave 2′・Mixtur III・Trompete 8′、ペダル（P）：Subbass 16′（木管・閉管）・Prinzipal 8′・Posaune 16′。パイプは実物大で、どちらの風箱もチャンネルの幅は鍵ごとにいちばん太いパイプに合わせています（ペダルの風箱はハウプトヴェルクの奥 約80 cm。Subbass 16′ の C は約190×235 mm）。ペダルのアクションは D-05 と同じ形ですが、ペダル鍵をつま先の先へ約10 cm延長し、アクションとカプラーのトラッカー、ばね、ガイドピンをその延長部に付けて、足で踏む部分には何も出ないようにしています。鍵盤のボタンと画面の鍵は、操作欄で選んだほう（ペダルか手鍵盤）を弾きます。',
  summary:'ペダルでハウプトヴェルクを鳴らす、バックフォール式（ウィッペン式）のペダルカプラー（I/P）です。ペダル鍵のつま先からもう1本のトラッカーが上がり、カプラー用のローラーボードでペダル鍵の位置から手鍵盤の鍵の位置へ移され、手鍵盤の下にある上下2本のウィッペンに伝わります。下のウィッペンが引き棒で手鍵盤の鍵を下から引き下げるので、ペダルを踏むと手鍵盤の鍵もいっしょに下がり、ハウプトヴェルクが鳴ります。ペダルの風箱は、ハウプトヴェルクの奥に約80 cm離して、床近くに置いています。',
  steps:[
    {t:'手鍵盤1段（ハウプトヴェルク）とペダル鍵盤、それぞれの風箱です。ペダルの風箱はハウプトヴェルクの奥に約80 cm離れた床近くにあり、Subbass 16′・Prinzipal 8′・Posaune 16′ が立っています。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',0);a.ctl('cpl',false);a.ctl('hw',[1,1,0,1,0,0]);a.ctl('pd',[0,1,0]);a.keys([]);a.home();}},
    {t:'ペダルのアクションです。ペダル鍵はつま先の先へ延長してあり、その延長部からトラッカーが上がってスクエアで後ろ向きに変わり、水平のトラッカーで奥へ行き、もう一つのスクエアとローラーボードで、幅の広いペダルの風箱のパレットを引き下げます。',run:a=>{a.ctl('man',0);a.ctl('cpl',false);a.keys([0,7]);a.cam(inst.views.ped[0],inst.views.ped[1]);}},
    {t:'ペダル鍵のつま先の先の延長部（足で踏む部分より奥、オルガンの下）には、カプラー用のトラッカーがもう1本付いています。これはカプラーのローラーボードで、ペダル鍵の位置から手鍵盤の鍵の位置へ移され、手鍵盤の下のウィッペンまで上がります。',run:a=>{a.ctl('man',0);a.ctl('cpl',true);a.keys([0,7]);a.cam([110,70,70],[0,55,-10]);}},
    {t:'カプラーを入れてペダルを踏みます。カプラーのトラッカーのナットが上のウィッペンを引き下げ、つなぎの線で下のウィッペンが持ち上げられて反対側が下がり、引き棒で手鍵盤の鍵を下から引き下げます。鍵が下がると、鍵から上へ伸びるトラッカーがハウプトヴェルクのパレットを開け、ペダルとハウプトヴェルクが同時に鳴ります。（鍵Eの位置で縦に切った断面）',run:a=>{a.ctl('man',0);a.ctl('cpl',true);a.keys([4]);a.xray(false);a.cut(0.5125);a.cam(inst.views.cpl[0],inst.views.cpl[1]);}},
    {t:'カプラーを切ると、上のウィッペンバルケンが下がり、カプラーのトラッカーのナットが届かなくなります。ペダルを踏んでも、ペダルの風箱だけが鳴ります。',run:a=>{a.ctl('man',0);a.ctl('cpl',false);a.keys([4]);a.xray(false);a.cut(0.5125);a.cam(inst.views.cpl[0],inst.views.cpl[1]);}},
    {t:'手鍵盤を弾いても、引き棒のナットが下のウィッペンの腕から離れるだけなので、ウィッペンは動かず、ペダルには伝わりません。',run:a=>{a.ctl('man',1);a.ctl('cpl',true);a.keys([4]);a.xray(false);a.cut(0.5125);a.cam(inst.views.cpl[0],inst.views.cpl[1]);}},
    {t:'全体を見ます。カプラーを入れてペダルを踏むと、両方の風箱が鳴ります。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',0);a.ctl('cpl',true);a.ctl('pd',[1,1,1]);a.keys([0,7]);a.home();}}
  ],
  build(){ return buildPedalCoupler(); }},
'h-03':{id:'H-03',name:'現代オルガン',terms:'modern tracker organ · moderne Schleifladenorgel · orgue moderne à traction mécanique · modern mechanisch orgel · organo moderno a trasmissione meccanica · órgano moderno de transmisión mecánica',console:true,stops0:[0,0,0,0,0],own:true,floor:0,homeK:0.72,
  sc:1,flueNA:28,maxDist:3200,gridS:3.2,nKeys:53,audioNorm:10,xray0:true,
  cam:{p:[900,520,1350],t:[0,380,-120]},clip:[-700,700],
  foot:'手鍵盤 C〜e‴（53鍵）2段、ペダル C〜f′（30鍵）。ハウプトヴェルク（I）：Prinzipal 8′・Rohrflöte 8′・Octave 4′・Blockflöte 2′・Mixtur III・Trompete 8′、ポジティフ（II）：Gedackt 8′・Hohlflöte 4′・Octave 2′・Sesquialtera II・Vox humana 8′、ペダル：Subbass 16′（木管・閉管）・Prinzipal 8′・Choralbass 4′・Posaune 16′（全長の円錐共鳴管）。カプラー：Pos/Hw・Hw/P・Pos/P。トレムラント（ヴィップフェーダー型）、ツィンベルシュテルン。ポジティフはスウェルボックスに収め、スウェルペダルでシャッターを開閉します。風は電動の送風機とマガジンふいごから送ります。パイプも風箱も鍵盤もすべて実物大で、縮めていません（Prinzipal 8′ の C は胴の長さ約2.37 m・直径約155 mm、Subbass 16′ の C は約2.2 m・190×235 mm、Posaune 16′ の C の共鳴管は約3.8 m）。風箱のチャンネルの幅は、その音のいちばん太いパイプに合わせています。モデルの下の演奏台では、ストップノブを押すとそのストップが入り（ノブが引き出された状態）、2段の手鍵盤とペダル鍵盤をそれぞれ弾けます。Accessories の Swell のつまみは、スウェルペダルの踏み込みに当たります。PCのキーボードでは、最後に弾いた鍵盤を、手鍵盤なら c′ から、ペダルなら C から1オクターブ分弾けます。',
  summary:'2段の手鍵盤とペダルを持つ機械式アクションのオルガンを、パイプまで実物大で組み立てたモデルです。現代の多くのオルガン建造家が採る、北ドイツ・バロックの「ヴェルク原理」に基づく構成で、上のケースにハウプトヴェルク（I）、その下にスウェルボックスに入ったポジティフ（II）、左右の塔にペダルがあり、左の塔がC側、右の塔がCis側です。各風箱はC/Cis式（全音ずつ左右に振り分け、太い低音のパイプを外側）で、正面に見えるパイプはハウプトヴェルクとペダルの Prinzipal 8′ です。鍵盤は2段ともバランス式です。下鍵盤は鍵の奥の端に吊ったトラッカーを引き上げ、演奏台の下のスクエアで向きを変えて奥のハウプトヴェルクへ伝えます。上鍵盤はスティッカーでバックフォールを押し上げてトラッカーを引きます（D-02 と同じ）。ローラーボードが鍵の位置を風箱のパレットの位置へ移します。カプラーは Pos/Hw がバックフォール式、ペダルカプラーがスティッカー式で、どれも鍵盤の幅の中に収まっています。ストップアクションは電気式で、5つのコンビネーションがあります。風は電動の送風機とマガジンふいごから送られます。B-02（送風機＋マガジンふいご）、C-01（スライダーチェスト）、E-03（電気式ストップアクション）、F-01（スウェルボックス）、F-02（トレムラント）、F-03（ツィンベルシュテルン）を組み合わせています。',
  steps:[
    {t:'全体です。上のケースがハウプトヴェルク（I）、その下のスウェルボックスの中がポジティフ（II）、左右の塔がペダルです。パイプは長さ・太さとも実物どおりで、正面のいちばん大きな Prinzipal 8′ は胴の長さ約2.4 m、塔の奥の Posaune 16′ は共鳴管が約3.8 mあります。「部品を透かす」でケースの中が見えます。',run:a=>{a.xray(true);a.ctl('swell',0.25);a.cut(0);a.ctl('man',1);a.ctl('cpl',[0,0,0]);a.ctl('trem',0);a.ctl('zimb',0);a.ctl('hw',[1,1,0,0,0,0]);a.ctl('pos',[1,0,0,0,0]);a.ctl('ped',[0,0,1,0]);a.keys([]);a.home();}},
    {t:'ケースの奥の送風室に、電動の送風機とマガジンふいごがあります。送風機の風はカーテン弁を通ってふいごに入り、上板が上がるとひもがローラーを引き上げ、カーテンがスリットをふさいで流入を絞ります（B-02 と同じ自動調節）。ふいごの出口から集合管に入り、まん中の立ち上がりの管で手鍵盤の風箱へ、両端の管でペダル塔へ送られます。和音を弾くと消費が増えて上板が下がり、カーテンが開いて流入が増えます。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',1);a.ctl('blower',true);a.ctl('hw',[1,1,1,1,1,0]);a.keys([24,28,31,36]);a.cam([380,300,-860],[-60,40,-470]);}},
    {t:'演奏台を縦に切った断面（鍵 c′ の位置）です。ハウプトヴェルクは下鍵盤（I）、ポジティフは上鍵盤（II）で弾きます。どちらもバランス式で、鍵は中ほどのバランスピンを支点に動き、押すと奥の端が上がります。上鍵盤では、スティッカー（押し棒）がバックフォールを押し上げ、反対側の腕が下がってポジティフのトラッカーを引きます。下鍵盤は奥の端にトラッカーを吊っていて、端が上がるとトラッカーを引き上げます。このトラッカーは鍵盤の台の開口を通って演奏台の下へ下ります。カプラー Pos/Hw はバックフォール式で、鍵盤の台のすぐ下にあります。ポジティフのトラッカーは、ポジティフのバックフォールの腕の穴を通ってそのまま下へ延び、鍵盤の台の穴を抜けてカプラーのバックフォールの後ろの端に届いています。前の端は下鍵盤から吊ったトラッカーに掛かっています。どちらのトラッカーにも、バックフォールの下に革ナットがあります。下鍵盤を弾くとトラッカーのナットが前の端を持ち上げ、後ろの端が下がってポジティフのトラッカーを引きます。ポジティフのバックフォールの腕はトラッカーのナットから離れるだけなので、上鍵盤の鍵は動きません。カプラーを切ると、カプラーのバックフォールを支える枠が持ち上がり、両方のナットから離れます。枠を上下させるだけなので、鍵を押さえたままでもカプラーを入れたり切ったりできます。',run:a=>{a.xray(false);a.ctl('man',1);a.ctl('cpl',[1,0,0]);a.keys([24]);a.cut(0.501643);a.cam([78,99,-6],[-4,99,-9]);}},
    {t:'ハウプトヴェルクのアクションです。下鍵盤の鍵から吊ったトラッカーは、演奏台の下のスクエアに掛かります。スクエアが上向きの引きを手前向きの引きに変え、水平のトラッカーが演奏台とスウェルボックスの下を奥へ通り、箱の後ろのもう一つのスクエアで下向きの引きに戻ります。そこから長いトラッカーが上へ伸び、ハウプトヴェルクの風箱のすぐ下のローラーボードの腕を引き下げます（風箱はパレットボックスを奥側に持っています）。ローラーボードは鍵の位置から風箱のパレットの位置へ左右に引きを移し、C側の音（C・D・E…）は左へ、Cis側の音（Cis・Dis・F…）は右へ振り分けられて、太い低音ほど外側です。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',1);a.ctl('cpl',[0,0,0]);a.ctl('hw',[1,1,0,0,0,0]);a.keys([0,1]);a.cam([-470,230,-260],[-20,180,-55]);}},
    {t:'ハウプトヴェルクの風箱です。手前から Prinzipal 8′（正面のパイプ）・Rohrflöte 8′・Octave 4′・Blockflöte 2′・Mixtur III・Trompete 8′ の6列。チャンネルの幅は、その音のいちばん太いパイプ（低音では Prinzipal 8′、高音では Trompete 8′ の朝顔）が立つように決めてあり、風箱の幅は約4 mになります。パレットボックスは風箱の奥側にあり、トラッカーはスウェルボックスの後ろから上がってきます。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',1);a.ctl('hw',[1,1,1,1,1,1]);a.keys([12,16,19]);a.cam([-420,640,330],[-120,470,-40]);}},
    {t:'ポジティフ（II）は、ハウプトヴェルクの下のスウェルボックスに収めてあります。ハウプトヴェルクのトラッカーは、この箱の下と後ろを通ります。Gedackt 8′（木管・閉管）・Hohlflöte 4′・Octave 2′・Sesquialtera II・Vox humana 8′ の5列。ポジティフの風箱も、ハウプトヴェルクと同じくパレットボックスが奥側にあります。上鍵盤のトラッカーは演奏台の後ろのスクエアで向きを変え、水平のトラッカーで奥へ進み、風箱の奥の下のスクエアで再び下向きの引きになって、専用のローラーボードを引きます。ローラーボードで C/Cis に振り分けられ、箱の床を通ってパレットの奥の端を引き下げます。箱の前面には窓が2つ並び、それぞれに縦の軸で回るシャッター（羽根板）が入っています。左右の窓の羽根は中心線を挟んで逆向きに回り、左右対称に開きます。ペダル鍵盤の上のスウェルペダルは、閉じているときにつま先が約30°上がっていて、踏み込むとほぼ水平になります。その軸は演奏台の下を通って箱の左右まで延び、両端の腕が引き棒を押し上げます。箱の側板に立つ短いローラーがその動きを横の動きに変え、連結棒が窓ごとの羽根をいっしょに回して、音が大きく明るくなります。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',2);a.ctl('pos',[1,1,1,1,1]);a.ctl('swell',0);a.keys([12,16,19]);a.cam([330,330,330],[0,260,-40]);later(1800,()=>a.ctl('swell',1));later(4500,()=>a.ctl('swell',0.3));}},
    {t:'ペダルのアクションです。ペダル鍵は踏み面の奥に短く（約22 cm）延長してあり、その延長部から2本のトラッカーが上がっています。奥の1本はすぐ上のスクエアに掛かり、水平のトラッカーでペダルのすぐ後ろの床に寝かせた短いローラーボードを引きます。このローラーボードはペダルの幅の中で音の並びを整えるだけで、C側の音を左半分、Cis側の音を右半分に、塔のパレットの順に並べ替えます。その後ろに音ごとの水平のスクエア（軸が垂直）があり、引きをそれぞれの塔の方向に変えます。塔までの長い距離は、床の上を扇形に広がるトラッカーで引きます。長いローラーはねじれや遅れが出るので、遠くへはトラッカーで運ぶのです。塔の下では、パレットの真下のトラッカーの向きに合わせたスクエアが下向きの引きに変え、上に伸びるトラッカーがパレットの奥の端を引き下げます。黒鍵のすぐ奥の1本はペダルカプラー用です。塔の風箱には手前から Prinzipal 8′・Choralbass 4′・Subbass 16′・Posaune 16′ が立っています。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',0);a.ctl('ped',[1,1,1,1]);a.ctl('cpl',[0,0,0]);a.keys([0,1]);a.cam([150,95,120],[-150,25,-70]);}},
    {t:'ペダルカプラー Hw/P と Pos/P です（鍵 C の位置の断面）。カプラー用のトラッカーは、ペダル鍵のすぐ奥のローラーボードで、その音の下鍵盤の鍵の真下へ移されます。ローラーボードにはスウェルペダルのための窓があり、ローラーはその上と下に分けてあります。各音1本のトラッカーが演奏台の下へ上がり、2つの革ナットが Hw/P と Pos/P のバックフォールの前の端をそれぞれ押し下げ、反対側の端が上がります。Hw/P のバックフォールは、後ろの端でハウプトヴェルクのトラッカーの革ナットを直接持ち上げます。このトラッカーは鍵盤のすぐ下で上下2本に分かれていて、上の1本の下端の金具が、下の1本のナットを持ち上げる形でつながっています。Hw/P が持ち上げるのは下の1本だけなので、上の1本と鍵は動きません。Pos/Hw のバックフォールは上の1本に掛かっているので、Pos/Hw が入っていても、ペダルでポジティフが鳴ることはありません。Pos/P のバックフォールはスティッカーを押し上げ、スティッカーは下鍵盤の鍵の穴を通って上鍵盤の鍵の奥を押し上げ、上鍵盤の鍵が下がります。カプラーを切ると、バックフォールを支える枠が下がり、ナットとのすき間がペダルの引きより大きくなります。どの部品も鍵盤の幅の中に収まっています。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',0);a.ctl('cpl',[0,1,1]);a.ctl('ped',[1,0,1,0]);a.keys([0]);a.cut(0.531714);a.cam([105,72,4],[-45,70,-6]);}},
    {t:'ストップアクションは電気式です。鍵盤の両脇のノブは、奥のスイッチを入れ切りするだけです。ノブを引くと、電線を通って風箱の端のソレノイドの「入り」のコイルに短い電流が流れ、鉄心（プランジャー）がスライダーを引いて穴がそろい、ストップが入ります。押し戻すと「切り」のコイルに電流が流れて戻ります（E-03 と同じ）。カプラーとトレムラント、ツィンベルシュテルンも、演奏台の中の小さなソレノイドが腕を動かします。左のノブがハウプトヴェルクとペダル、右のノブがポジティフとカプラーです。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',1);a.ctl('hw',[1,0,0,1,0,0]);a.keys([]);a.cam([-120,140,110],[-55,102,10]);later(1500,()=>a.ctl('hw',[1,1,1,1,1,0]));later(3500,()=>{ a.cam([-365,480,135],[-272,425,-35]); a.ctl('hw',[1,0,0,1,0,0]); });later(5500,()=>a.ctl('hw',[1,1,1,1,1,0]));}},
    {t:'コンビネーションです。下鍵盤の下の小さなボタンの 1〜5 を押すと、記憶したストップとカプラーの組み合わせになり、変わるノブのスイッチから各ソレノイドへ同時に電流が送られます。0 で全部を切ります。「S」（セット）を押してから番号を押すと、今の組み合わせを記憶します。演奏台の下の操作欄にも同じボタンがあります。',run:a=>{a.xray(false);a.cut(0);a.ctl('man',1);a.ctl('comb',0);a.keys([24,28,31]);a.cam([40,118,120],[0,96,40]);later(1200,()=>a.ctl('comb',1));later(3200,()=>a.ctl('comb',3));later(5200,()=>a.ctl('comb',5));}},
    {t:'トレムラント（ヴィップフェーダー型・F-02）は立ち上がりの風導管の側面にあり、手鍵盤の風を揺らします。ツィンベルシュテルン（F-03）は正面の飾り板に付いていて、ノブを引くと風導管の弁が開き、細い管で風車へ風が送られて星が回り、奥の鈴が鳴ります。',run:a=>{a.xray(true);a.cut(0);a.ctl('man',1);a.ctl('trem',1);a.ctl('zimb',1);a.ctl('hw',[1,1,0,0,0,0]);a.keys([24,28,31]);a.cam([150,700,190],[0,630,0]);}},
    {t:'全体で鳴らします。カプラーを全部入れ、ハウプトヴェルクのプレヌム（Prinzipal 8′ から Mixtur まで）を下鍵盤で弾くと、Pos/Hw でポジティフも鳴ります。',run:a=>{a.xray(true);a.cut(0);a.ctl('trem',0);a.ctl('zimb',0);a.ctl('cpl',[1,1,1]);a.ctl('hw',[1,1,1,1,1,0]);a.ctl('pos',[1,1,1,0,0]);a.ctl('ped',[1,1,1,1]);a.ctl('man',1);a.keys([12,24,28,31]);a.home();}}
  ],
  build(){ return buildH03(); }}
};

