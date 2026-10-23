if(typeof THREE==='undefined'){document.getElementById('error').style.display='block';throw new Error('Three.js not loaded');}
// Icon buttons: <b>emoji</b><small>label</small>
function setBtn(el,icon,label){if(typeof el==='string')el=document.getElementById(el);el.innerHTML='<b>'+icon+'</b><small>'+label+'</small>'}
