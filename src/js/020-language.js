/* ---------------- interface language ---------------- */
let LANG='ja'; try{ const q=localStorage.getItem('oa-lang'); if(q&&/^(ja|en|de|fr|nl)$/.test(q)) LANG=q; }catch(e){}
