(function(){
'use strict';
const T = window.THREE;
const wrap = document.getElementById('stagewrap');
if(!T){ wrap.insertAdjacentHTML('beforeend','<div class="nogl">3D表示用のライブラリを読み込めませんでした。ページを再読み込みしてください。</div>'); return; }
const V3=(x,y,z)=>new T.Vector3(x,y,z);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
