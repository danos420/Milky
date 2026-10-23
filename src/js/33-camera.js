// Drag anywhere on the 3D world to orbit the follow camera; buttons remain independent.
let orbitAngle=0, orbitHeight=3.35;
let followBody=false, viewIndex=0;
const views=[{label:'מאחור',angle:0,height:3.35,distance:4.1},{label:'מלפנים',angle:Math.PI,height:3.35,distance:4.4},{label:'מהצד',angle:Math.PI/2,height:3.15,distance:4.4},{label:'מלמעלה',angle:0,height:7.0,distance:2.8}];
let cameraDistance=4.1;
const followBtn=document.querySelector('#bodyFollow'), viewBtn=document.querySelector('#viewMode');
function toggleBodyFollow(){followBody=!followBody;followBtn.classList.toggle('active',followBody);followBtn.setAttribute('aria-pressed',String(followBody));setChip(followBtn,'🐕',followBody?'פעיל':'כבוי')}
function cycleView(){viewIndex=(viewIndex+1)%views.length;const v=views[viewIndex];orbitAngle=v.angle;orbitHeight=v.height;cameraDistance=v.distance;setChip(viewBtn,'🎥',v.label)}
followBtn.addEventListener('click',toggleBodyFollow);viewBtn.addEventListener('click',cycleView);
window.addEventListener('keydown',e=>{if(e.repeat)return;if(e.code==='KeyG')toggleBodyFollow();if(e.code==='KeyV')cycleView()});
let activeDrag=null,lookDragT=0;
renderer.domElement.style.touchAction='none';
renderer.domElement.addEventListener('pointerdown',e=>{
  if(!started || activeDrag!==null)return;
  activeDrag={id:e.pointerId,x:e.clientX,y:e.clientY};
  renderer.domElement.setPointerCapture(e.pointerId);
});
renderer.domElement.addEventListener('pointermove',e=>{
  if(!activeDrag || activeDrag.id!==e.pointerId)return;
  const dx=e.clientX-activeDrag.x,dy=e.clientY-activeDrag.y;
  activeDrag.x=e.clientX;activeDrag.y=e.clientY;
  camYaw-=dx*0.0085;lookDragT=.45;
  orbitHeight=Math.max(1.7,Math.min(8.0,orbitHeight+dy*0.012));
});
const stopDrag=e=>{if(activeDrag?.id===e.pointerId)activeDrag=null};
renderer.domElement.addEventListener('pointerup',stopDrag);
renderer.domElement.addEventListener('pointercancel',stopDrag);
