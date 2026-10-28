const T_=s=>{ if(LANG==='ja'||s==null) return s; const e=I18N[s]; return e?(e[LI[LANG]]||e[0]):s; };   // a missing language falls back to English
const TF=(s,...a)=>T_(s).replace(/\{(\d)\}/g,(m,i)=>a[+i]);

