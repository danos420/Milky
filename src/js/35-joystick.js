// ===== Touch joystick =====
const stickEl=document.getElementById('stick'),knob=document.getElementById('knob');
let stickRect=null;
function stickMove(e){const r=stickRect||(stickRect=stickEl.getBoundingClientRect()),R=r.width/2,lim=R*.72;let dx=e.clientX-(r.left+R),dy=e.clientY-(r.top+R);const d=Math.hypot(dx,dy);if(d>lim){dx*=lim/d;dy*=lim/d}
 stick.x=dx/lim;stick.y=-dy/lim;stick.mag=Math.min(1,Math.hypot(stick.x,stick.y));knob.style.transform='translate('+dx.toFixed(1)+'px,'+dy.toFixed(1)+'px)'}
stickEl.addEventListener('pointerdown',e=>{e.preventDefault();stickRect=stickEl.getBoundingClientRect();stick.active=true;stick.id=e.pointerId;try{stickEl.setPointerCapture(e.pointerId)}catch(_){}stickEl.classList.add('on');stickMove(e)});
stickEl.addEventListener('pointermove',e=>{if(stick.active&&e.pointerId===stick.id)stickMove(e)});
const stickEnd=e=>{if(e.pointerId!==stick.id)return;stick.active=false;stick.id=null;stick.x=stick.y=stick.mag=0;knob.style.transform='';stickEl.classList.remove('on')};
stickEl.addEventListener('pointerup',stickEnd);stickEl.addEventListener('pointercancel',stickEnd);stickEl.addEventListener('contextmenu',e=>e.preventDefault());
