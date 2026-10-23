// ===== Level-up pack: task guide, game juice (slow-mo, comic words, camera punch), blob shadow, photo mode =====
const LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(_){return null}};
// ---------- Task guide ----------
const extraPos=k=>{const p=extras.find(e=>e.kind===k);return p&&p.g.visible?p.g.position:null};
const V=(x,y,z)=>({x,y,z});
const atDad=()=>V(dad.position.x,dad.position.y+2.4,dad.position.z);
const carryOr=(k,dest)=>{const p=extras.find(e=>e.kind===k);if(!p||!p.g.visible)return null;return grab&&grab.b.o===p.g?dest:p.g.position};
const TARGETS={
 snack:()=>V(.5,1.0,.3),mug:()=>mug.position,remote:()=>extraPos('remote'),bowl:()=>extraPos('bowl'),
 slipper:()=>slipperState==='carried'?V(3.5,.4,-6.4):slipper.position,sausage:()=>V(5.55,1,14.6),trash:()=>trashProp.g.position,
 armchair:()=>V(ARMCHAIR.x,.8,ARMCHAIR.z),kebab:()=>kebabState==='carried'?null:V(2,1,-33.2),cat:()=>cat.position,wet:()=>V(poolC.x,0,poolC.z),shed:()=>V(16.5,2.6,-26),
 escape:()=>null,hideShampoo:()=>carryOr('shampoo',V(BED.x,.4,BED.z)),spillTub:()=>bath.tipped?null:V(TUB.x,.5,TUB.z),puppyEyes:atDad,
 shakeSofa:()=>V(-4.8,1.1,1.3),shakeDad:atDad,rugRoll:()=>V(1.9,0,3),grassRoll:()=>V(4,0,-15),bedSleep:()=>V(BED.x,.4,BED.z),
 chairNap:()=>V(ARMCHAIR.x,.8,ARMCHAIR.z),tpTrail:()=>grab&&grab.b.kind==='tp'?null:extraPos('tp'),baguette:()=>carryOr('baguette',V(-1.2,0,-10.5)),
 bagHead:()=>bigBag.visible?bigBag.position:null,canRoll:()=>extraPos('can'),receipt:()=>extraPos('receipt'),
 sniffChicken:()=>V(STOVE.x,1,14.6),drumstick:()=>chicken.position,beg:()=>V(DTABLE.x,0,DTABLE.z+1.4),sofaNap:()=>V(-4.8,1.1,1.3),
 bringSlipper:()=>slipperState==='carried'?atDad():slipper.position,tissue:()=>carryOr('tissues',atDad()),warmFeet:atDad,sneezed:atDad,
 soupSteal:()=>stovePot.position,thermo:()=>carryOr('thermo',V(BED.x,.4,BED.z)),showFlip:atDad,
 shareBowl:()=>carryOr('bowl',atDad()),petDad:atDad,laugh:atDad,sofaWatch:()=>tvOn?V(-4.8,1.1,1.3):extraPos('remote')
};
let guideOn=LS('milky-guide')!=='off';
const guide=new THREE.Group();scene.add(guide);guide.visible=false;
{const gold=new THREE.MeshBasicMaterial({color:0xffb400,toneMapped:false,fog:false}),glow=new THREE.MeshBasicMaterial({color:0xffe27a,transparent:true,opacity:.7,depthWrite:false,toneMapped:false,fog:false});
 const c=new THREE.Mesh(new THREE.ConeGeometry(.3,.6,4),gold);c.rotation.x=Math.PI;c.position.y=.28;guide.add(c);
 const r=new THREE.Mesh(new THREE.TorusGeometry(.3,.035,6,20),glow);r.rotation.x=Math.PI/2;r.position.y=.7;r.scale.setScalar(1.25);guide.add(r)}
const guideArrow=document.getElementById('guideArrow');
const _gv=new THREE.Vector3(),guideBox={top:80,bottom:400};let guideBoxT=-9;
function currentTarget(){if(!guideOn||day.finished)return null;const ph=DAY[day.phase];if(!ph)return null;
 for(const t of ph.tasks){if(day.done.has(t.id))continue;const f=TARGETS[t.id];let p=null;try{p=f&&f()}catch(_){p=null}if(p)return p}return null}
function updateGuide(rdt,t){
 const p=PHOTO.on?null:currentTarget();
 if(!p){guide.visible=false;guideArrow.hidden=true;return}
 const dist=Math.hypot(p.x-pos.x,p.z-pos.z);
 guide.visible=dist>1.7;guide.position.set(p.x,(p.y||0)+.95+Math.sin(t*3)*.12,p.z);guide.rotation.y=t*1.6;
 _gv.set(p.x,(p.y||0)+1,p.z).project(camera);
 const off=_gv.z>1||Math.abs(_gv.x)>.92||Math.abs(_gv.y)>.85;
 if(!off||dist<1.7){guideArrow.hidden=true;return}
 let x=_gv.x,y=_gv.y;if(_gv.z>1){x=-x;y=-y}
 const a=Math.atan2(y,x),k=1/Math.max(Math.abs(Math.cos(a))/.86,Math.abs(Math.sin(a))/.72);
 const sx=(Math.cos(a)*k*.5+.5)*innerWidth,sy=(-Math.sin(a)*k*.5+.5)*innerHeight;
 if(t-guideBoxT>1.5){guideBoxT=t;const tb=document.getElementById('toolbar'),ct=document.getElementById('controls');guideBox.top=(tb?tb.getBoundingClientRect().bottom:60)+34;guideBox.bottom=(ct?ct.getBoundingClientRect().top:innerHeight)-28}
 const cy=Math.max(guideBox.top,Math.min(guideBox.bottom,sy)),cx=Math.max(26,Math.min(innerWidth-26,sx));
 guideArrow.hidden=false;guideArrow.style.transform='translate('+cx.toFixed(0)+'px,'+cy.toFixed(0)+'px) translate(-50%,-50%)';
 guideArrow.firstChild.style.transform='rotate('+(-a).toFixed(2)+'rad)';const lbl=Math.round(dist)+'מ׳';if(guideArrow.lastChild.textContent!==lbl)guideArrow.lastChild.textContent=lbl;
}
{const b=document.getElementById('guideBtn');const lab=()=>b.textContent='🧭 מורה דרך: '+(guideOn?'פעיל':'כבוי');lab();b.addEventListener('click',()=>{guideOn=!guideOn;LS('milky-guide',guideOn?'on':'off');lab()})}
// ---------- Juice ----------
let tScale=1,hitT=0,slowT=0,fovKick=0,fovNow=65;
function hitStop(d=.07){hitT=Math.max(hitT,d)}
function slowMo(d=.6){slowT=Math.max(slowT,d)}
function punch(k=4){fovKick=Math.max(fovKick,k)}
function juiceTick(rdt){if(hitT>0){hitT-=rdt;return .04}if(slowT>0){slowT-=rdt;tScale=.33}else tScale+=(1-tScale)*Math.min(1,rdt*5);return tScale}
const POWS=[];const powLayer=document.getElementById('powLayer');
for(let i=0;i<6;i++){const el=document.createElement('div');el.className='pow';powLayer.appendChild(el);POWS.push({el,p:new THREE.Vector3(),t:0})}
let powI=0,powCool=0;
const POW_COLORS=['#ffd23f','#ff7b54','#7fd3ff','#b8f27c','#ff9ad5'];
function pow(text,x=pos.x,y=2*MS+jumpY,z=pos.z,big){
 if(PHOTO.on)return;const P=POWS[powI++%POWS.length];P.p.set(x,y,z);P.t=.95;P.el.textContent=text;
 P.el.style.color=POW_COLORS[Math.floor(Math.random()*POW_COLORS.length)];P.el.style.fontSize=(big?40:28)+'px';
 P.el.style.setProperty('--r',((Math.random()-.5)*16).toFixed(1)+'deg');P.el.style.opacity='';P.el.classList.remove('go');void P.el.offsetWidth;P.el.classList.add('go');
}
function updateJuice(rdt,t){
 powCool=Math.max(0,powCool-rdt);
 fovKick*=Math.exp(-rdt*6);const f=65-fovKick;if(Math.abs(f-fovNow)>.02){fovNow=f;camera.fov=f;camera.updateProjectionMatrix()}
 for(const P of POWS){if(P.t<=0)continue;P.t-=rdt;if(P.t<=0){P.el.style.opacity=0;continue}
  _gv.copy(P.p);_gv.y+=(.95-P.t)*.6;_gv.project(camera);if(_gv.z>1){P.el.style.opacity=0;continue}
  P.el.style.left=((_gv.x*.5+.5)*innerWidth).toFixed(0)+'px';P.el.style.top=((-_gv.y*.5+.5)*innerHeight).toFixed(0)+'px'}
 // blob shadow under Milky: shows exactly where he will land
 const sup=surfaceAt(pos.x,pos.z,jumpY+.02),h=Math.max(0,(rag.active?rag.y:jumpY)-sup),k=1/(1+h*.45);
 blob.position.set(pos.x,sup+.018,pos.z);blob.scale.setScalar(MS*(.8+.2*k));blob.material.opacity=.3*k;blob.visible=!PHOTO.on||true;
}
const blob=new THREE.Mesh(new THREE.CircleGeometry(.62,24),new THREE.MeshBasicMaterial({color:0x2a1a0c,transparent:true,opacity:.3,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4}));
blob.rotation.x=-Math.PI/2;blob.scale.z=1;blob.renderOrder=1;scene.add(blob);
// ---------- Photo mode ----------
const PHOTO={on:false,saved:null};window.PHOTO_ON=false;
const photoBar=document.getElementById('photoBar');
function photoMode(on){
 if(on===PHOTO.on)return;PHOTO.on=on;window.PHOTO_ON=on;document.body.classList.toggle('photoMode',on);photoBar.hidden=!on;
 if(on){PHOTO.saved={cameraDistance,orbitHeight,orbitAngle};for(const k in keys)keys[k]=false;guide.visible=false;guideArrow.hidden=true;for(const P of POWS){P.t=0;P.el.style.opacity=0}}
 else if(PHOTO.saved){cameraDistance=PHOTO.saved.cameraDistance;orbitHeight=PHOTO.saved.orbitHeight;orbitAngle=PHOTO.saved.orbitAngle}
}
document.getElementById('photoToggle').addEventListener('click',()=>photoMode(true));
document.getElementById('photoExit').addEventListener('click',()=>photoMode(false));
document.getElementById('photoMood').addEventListener('click',()=>{nextMood();tongueTimer=mood===1?3:0;renderFrame()});
document.getElementById('photoIn').addEventListener('click',()=>{cameraDistance=Math.max(1.6,cameraDistance-.6)});
document.getElementById('photoOut').addEventListener('click',()=>{cameraDistance=Math.min(9,cameraDistance+.6)});
renderer.domElement.addEventListener('wheel',e=>{if(PHOTO.on){e.preventDefault();cameraDistance=Math.min(9,Math.max(1.6,cameraDistance+e.deltaY*.004))}},{passive:false});
window.addEventListener('keydown',e=>{if(e.repeat)return;if(e.code==='KeyC'&&started)photoMode(!PHOTO.on);if(e.code==='Escape'&&PHOTO.on)photoMode(false)});
function snapCanvas(){
 renderFrame();const src=renderer.domElement,W=src.width,H=src.height,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.drawImage(src,0,0);
 const v=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.75);v.addColorStop(0,'rgba(40,20,5,0)');v.addColorStop(1,'rgba(40,20,5,.38)');g.fillStyle=v;g.fillRect(0,0,W,H);
 const fs=Math.round(Math.min(W,H)*.045);g.font='800 '+fs+'px system-ui,Arial';g.textAlign='right';g.direction='rtl';g.fillStyle='rgba(255,246,225,.92)';g.shadowColor='rgba(0,0,0,.55)';g.shadowBlur=fs*.35;
 g.fillText('🐶 מילקי: ברדק אחולמניוקי',W-fs*.8,H-fs*.8);return c}
function dataURLtoFile(u,name){const b=atob(u.split(',')[1]),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return new File([a],name,{type:'image/jpeg'})}
document.getElementById('photoSnap').addEventListener('click',()=>{
 const c=snapCanvas(),url=c.toDataURL('image/jpeg',.9),name='milky-'+new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')+'.jpg';
 const fl=document.getElementById('photoFlash');fl.classList.remove('go');void fl.offsetWidth;fl.classList.add('go');try{playToySound(1400,.05,'square');setTimeout(()=>playToySound(900,.06,'square'),60)}catch(_){}
 const file=dataURLtoFile(url,name);
 if(navigator.canShare&&navigator.canShare({files:[file]})){navigator.share({files:[file],title:'מילקי: ברדק אחולמניוקי'}).catch(()=>{})}
 else{const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove()}
 addActivity('📸 צילום נשמר!');
});
// ---------- per frame (real time, also in photo mode) ----------
function levelupFrame(rdt){const t=performance.now()/1000;updateGuide(rdt,t);updateJuice(rdt,t)}
window.JUICE_READY=true;
