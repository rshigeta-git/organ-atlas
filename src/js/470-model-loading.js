/* ---------------- model loading ---------------- */
let inst=null, curId=null;
function load(id){
  const def=MODELS[id]; if(!def||(DEV.has(id)&&!DEVOK)) return; clearTimers();
  if(CX){ scene.remove(CX.root); CX.own.forEach(m=>m.dispose()); }
  flows.length=0; CX={root:new T.Group(),own:[],keyMats:[],stopMats:[]}; scene.add(CX.root);
  STOPSET=def.stopSet||[0,1,2,3,4];
  S.key.fill(false); S.kd.fill(0); def.stops0.forEach((v,i)=>{ S.stop[i]=!!v; S.sp[i]=v?1:0; }); S.p=75;
  SC=def.sc||0.45; FLUE_NA=def.flueNA||56; controls.maxDistance=def.maxDist||700; grid.scale.setScalar(def.gridS||1); camera.far=def.maxDist?def.maxDist*2.5:4000; camera.updateProjectionMatrix();
  inst=def.build(); inst.def=def; grid.position.y=def.floor;
  CX.root.traverse(ob=>{ if(!ob.isMesh) return; const k=CX.keyMats.indexOf(ob.material); if(k>=0&&ob.userData.key==null) ob.userData.key=k; const i=CX.stopMats.indexOf(ob.material); if(i>=0&&ob.userData.stop==null) ob.userData.stop=i; });
  setXray(def.xray0!==false); setCut(def.cut0||0); pMat.size=def.psize||1.8; camHome();
  $('stops').closest('.drow').hidden=!!def.noStops||!!def.console; $('kbd').closest('.drow').hidden=!!def.noKeys||!!def.console; $('consoleRow').hidden=!def.console; if(def.console&&inst.buildConsole) inst.buildConsole($('ocon')); $('mctlLabel').textContent=T_(def.ctlLabel||(def.noKeys?'操作':'送風')); $('legend').innerHTML=def.legend==='ctrl'?LEGEND0+CTRL_LEG:def.legend==='elec'?LEGEND0+ELEC_LEG:(def.legend||LEGEND0);
  $('tag').innerHTML='<span class="tid">'+def.id+'</span><span class="tnm">'+T_(def.name)+'</span>';
  buildKbdUI(def.nKeys||13,inst.keyLim?inst.keyLim():null);
  i18nDom($('legend')); renderStops(inst.stopRows); renderNotes(def); renderControls(); renderIndex(id); syncKeyUI(); syncStopUI(); setupPins();
  curId=id; try{ if(location.hash!=='#'+id) history.replaceState(null,'','#'+id); }catch(e){}
  if(window.va) window.va('pageview',{route:'/'+id,path:'/'+id});   // Vercel Web Analytics (website only): one page view per model
}

