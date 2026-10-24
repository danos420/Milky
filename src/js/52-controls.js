// ===== Smart touch controls: instant response + two context buttons (action / grab) =====
const actBtn=document.getElementById('actBtn'),grabBtn=document.getElementById('grabBtn');
const KIND_ICON={tp:'🧻',shampoo:'🧴',baguette:'🥖',tissues:'🤧',thermo:'🌡️',bowl:'🥣',can:'🥫',receipt:'🧾',bottle:'🧴',book:'📚',shoe:'👟',duck:'🦆',remote:'📺',trash:'🗑️',chair:'🪑',cone:'🔺',cooler:'🧊',bin:'🗑️',soccer:'⚽',cushion:'🛋️',box:'📦',ball:'⚽'};
const KIND_NAME={tp:'נייר',shampoo:'שמפו',baguette:'בגט',tissues:'טישו',thermo:'מדחום',bowl:'קערה',can:'קופסה',receipt:'קבלה',bottle:'בקבוק',book:'ספר',shoe:'נעל',duck:'ברווז',remote:'שלט',trash:'פח',chair:'כיסא',cone:'קונוס',cooler:'צידנית',bin:'פח',soccer:'כדור',cushion:'כרית',box:'ארגז',ball:'כדור'};
const ACT_LABEL={remote:'שלט',duck:'צפצף',bottle:'גלגל',shoe:'העף נעל',book:'פזר',trash:'הפוך פח',bowl:'לאכול',chair:'הפל',cone:'בעט',cooler:'דחוף',bin:'הפל',soccer:'בעט',tp:'גלגל',shampoo:'בועות',baguette:'דחוף',can:'בעט',receipt:'אכול קבלה',tissues:'דחוף',thermo:'דחוף'};
function grabCandidate(){const m=mouthPos();let best=null,bd=1.45;for(const b of bodies){if(carried.has(b.o)||!b.o.visible)continue;const d=Math.hypot(b.o.position.x-m.x,b.o.position.z-m.z)-b.r;if(d<bd){bd=d;best=b}}return best}
function grabInfo(){
 if(grab)return {i:'⬇️',l:'שחרר',on:2,fn:toggleGrab};
 if(slipperState==='carried')return {i:'⬇️',l:'שחרר כפכף',on:2,fn:dropSlipper};
 if(kebabState==='carried')return {i:'🍢',l:'ברח!',on:0,fn:()=>{}};
 if(slipperState==='floor'&&Math.hypot(pos.x-slipper.position.x,pos.z-slipper.position.z)<1.45)return {i:'🩴',l:'כפכף',on:1,fn:stealSlipper};
 if(nearMangal()&&kebabState==='grill')return {i:'🍢',l:'קבב!',on:1,fn:stealKebab};
 const b=grabCandidate();
 if(b){const small=b.r<=.3&&!BIG_KINDS.includes(b.kind);return {i:KIND_ICON[b.kind]||'👅',l:(small?'תפוס ':'גרור ')+(KIND_NAME[b.kind]||''),on:1,fn:toggleGrab}}
 return {i:'👅',l:'לשון',on:0,fn:toggleGrab};
}
function actInfo(){
 if(!won&&jumpY>=.78&&Math.hypot(pos.x-.5,pos.z-.3)<1.9&&snack.visible)return {i:'🍪',l:'חטיף!',on:1,fn:trySnack};
 if(slipperState==='carried')return {i:'⬇️',l:'שחרר',on:2,fn:dropSlipper};
 if(nearSausage())return {i:'🌭',l:'נקניקייה',on:1,fn:interact};
 if(nearFridge())return {i:'🧊',l:fridgeOpen?'סגור מקרר':'פתח מקרר',on:1,fn:interact};
 if(nearMangal()&&kebabState==='grill')return {i:'🍢',l:'קבב!',on:1,fn:interact};
 const dd=dad.visible?Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z):99;
 let near=null,d=1.65;for(const p of extras){if(!p.g.visible||carried.has(p.g))continue;const q=Math.hypot(pos.x-p.g.position.x,pos.z-p.g.position.z);if(q<d){near=p;d=q}}
 if(dd<1.9&&(!near||dd<d))return {i:'👨',l:'ליטוף',on:1,fn:interactDad};
 if(near)return {i:KIND_ICON[near.kind]||'🐾',l:ACT_LABEL[near.kind]||'לגעת',on:1,fn:interact};
 if(dad.visible&&dadState!=='away')return {i:'📣',l:'קרא לאבא',on:0,fn:interactDad};
 return {i:'🐽',l:'רחרח',on:0,fn:interact};
}
let ctxT=0,ctxAct=null,ctxGrab=null;
function paintCtx(btn,info,prev){
 if(prev&&prev.i===info.i&&prev.l===info.l&&prev.on===info.on)return;
 btn.firstChild.textContent=info.i;btn.lastChild.textContent=info.l;btn.classList.toggle('live',info.on>=1);btn.classList.toggle('dim',info.on===0);
 if(info.on>=1&&(!prev||prev.on===0||prev.l!==info.l)){btn.classList.remove('pulse');void btn.offsetWidth;btn.classList.add('pulse')}
}
function updateCtxButtons(dt){
 ctxT-=dt;if(ctxT>0)return;ctxT=.1;
 const a=actInfo(),g=grabInfo();paintCtx(actBtn,a,ctxAct);paintCtx(grabBtn,g,ctxGrab);ctxAct=a;ctxGrab=g;
}
actBtn.addEventListener('click',()=>{if(!started)return;const a=actInfo();a.fn();ctxT=0});
grabBtn.addEventListener('click',()=>{if(!started)return;const g=grabInfo();g.fn();ctxT=0});
// Instant buttons: fire on touch-down (works while the other thumb holds the joystick), swallow the late click.
let ctrlAllowClick=false;
window.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#controls .tb:not([data-key])');if(!b||ctrlAllowClick)return;if(performance.now()-(b._pd||0)<900){e.stopImmediatePropagation();e.preventDefault()}},true);
document.querySelectorAll('#controls .tb:not([data-key])').forEach(b=>{
 b.addEventListener('pointerdown',e=>{if(e.button>0)return;e.preventDefault();b._pd=performance.now();b.classList.add('down');setTimeout(()=>b.classList.remove('down'),130);ctrlAllowClick=true;try{b.click()}finally{ctrlAllowClick=false}});
 b.addEventListener('contextmenu',e=>e.preventDefault());
});
window.CTRL_READY=true;
