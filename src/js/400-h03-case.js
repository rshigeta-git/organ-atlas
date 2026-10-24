/* ---------- H-03 case: Hauptwerk case with Prinzipal 8′ façade, lower case round the console, two pedal towers ---------- */
function h3Case(B){
  const ST=B.ST, LC=LB('オルガンケース','Gehäuse'), LSh=LB('透かし彫りの板（パイプの上の飾り板）','Schleierbrett'), GOLD=mclone(MAT.brass); GOLD.color.set(0xc9a24e); GOLD.metalness=0.3;
  const xa=-292, xb=268, cxC=(xa+xb)/2, wC=xb-xa;
  for(const x of [xa,xb]) box(ST,3,402,112,MAT.wood,x,600,-41,LC);
  box(ST,wC+3,3,112,MAT.wood,cxC,801.5,-41,LC);
  box(ST,wC+16,10,8,MAT.woodDark,cxC,806,18,LB('コーニス（ケース上端の張り出した軒）','Kranzgesims'));
  box(ST,wC+24,4,11,MAT.woodDark,cxC,812,19,LB('コーニス','Kranzgesims'));
  for(const x of [xa,xb]) box(ST,9,400,5,MAT.woodDark,x,600,16,LB('ケースの柱','Lisene'));
  box(ST,wC+20,7,14,MAT.woodDark,cxC,402,22,LB('インポスト（下のケースと上のケースの境の張り出し）','Kämpfer'));
  for(const k of B.MK){ const x=B.HWL.xs[k], w=B.HWL.w[k], y0=(B.hw.tops[k]||500)+5, y1=801; if(y1-y0<2) continue;
    box(ST,w,y1-y0,1.2,MAT.wood,x,(y0+y1)/2,14.4,LSh); box(ST,w,1.6,1.6,GOLD,x,y0+0.8,15,LSh); }
  for(const x of [xa,xb]) box(ST,3,400,195,MAT.wood,x,200,-72,LC);
  box(ST,-66-xa,205,2,MAT.wood,(xa-66)/2,102.5,24,LB('下のケースの前板','Gehäuse')); box(ST,xb-66,205,2,MAT.wood,(xb+66)/2,102.5,24,LB('下のケースの前板','Gehäuse'));
  box(ST,132,77,2,MAT.wood,0,166.5,24,LB('下のケースの前板（演奏台の上）','Gehäuse'));
  for(const s of [-1,1]) box(ST,6,190,4,MAT.woodDark,s*204,303,23,LB('ブルストの開口の枠','Gehäuse'));
  box(ST,420,6,6,MAT.woodDark,0,207,23,LB('ブルストの開口の枠','Gehäuse'));
  for(const [C,L] of [[B.tc,B.TCL],[B.td,B.TDL]]){
    const x0=C.xL-4, x1=C.xR+4, cx=(x0+x1)/2, w=x1-x0, zf=-44, zb=-142, d=zf-zb;
    for(const x of [x0,x1]) box(ST,3,644,d,MAT.wood,x,322,(zf+zb)/2,LB('ペダル塔のケース','Pedalturm'));
    box(ST,w+3,3,d,MAT.wood,cx,645.5,(zf+zb)/2,LB('ペダル塔のケース','Pedalturm'));
    box(ST,w+14,9,7,MAT.woodDark,cx,650,zf+3,LB('コーニス','Kranzgesims')); box(ST,w+20,4,10,MAT.woodDark,cx,656,zf+4,LB('コーニス','Kranzgesims'));
    box(ST,w*0.7,14,6,MAT.woodDark,cx,665,zf+2,LB('塔の冠（飾り）','Turmkrone')); box(ST,w*0.35,12,5,MAT.woodDark,cx,678,zf+2,LB('塔の冠（飾り）','Turmkrone'));
    box(ST,w,96,2,MAT.wood,cx,48,zf,LB('ペダル塔の下の前板','Pedalturm')); box(ST,w+8,5,6,MAT.woodDark,cx,98,zf+1,LB('ペダル塔の下の前板','Pedalturm'));
    for(const k of Object.keys(L.xs).map(Number)){ const x=L.xs[k], ww=L.w[k], y0=(C.tops[k]||400)+5, y1=645; if(y1-y0<2) continue;
      box(ST,ww,y1-y0,1.2,MAT.wood,x,(y0+y1)/2,zf-0.4,LSh); box(ST,ww,1.6,1.6,GOLD,x,y0+0.8,zf+0.2,LSh); }
  }
  box(ST,620,2,330,MAT.woodDark,0,-1,-480,LB('送風室の床','Balgkammer'));
}
