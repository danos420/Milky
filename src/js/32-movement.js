// Round blockers that are not furniture: lamp, plants and dad.
// h = height Milky must be above to pass over it. A move is blocked only if it
// goes deeper into a blocker, so Milky can never get trapped inside one.
const decorRounds=[{x:-5.8,z:-6.3,r:.24,h:9},{x:4.85,z:-7.2,r:.42,h:1.2}];
for(const [x,z] of trees)decorRounds.push({x,z,r:.32,h:9});decorRounds.push({x:-5,z:-11,r:.55,h:1.7});
const _rb=[],_rbDyn=[0,1,2,3,4].map(()=>({x:0,z:0,r:0,h:9}));
function roundBlockers(){
 _rb.length=0;for(const d of decorRounds)_rb.push(d);
 const set=(k,x,z,r,h)=>{const o=_rbDyn[k];o.x=x;o.z=z;o.r=r;o.h=h;_rb.push(o)};
 if(chainPhase<3)set(0,dominoPlant.position.x,dominoPlant.position.z,.33,1.3);
 set(1,dad.position.x,dad.position.z,DAD_R,9);set(2,dani.position.x,dani.position.z,DANI_R,9);
 set(3,neighbor.g.position.x,neighbor.g.position.z,NB_R,9);set(4,lady.g.position.x,lady.g.position.z,LADY_R,9);
 return _rb;
}
function collides(x,z,footY=jumpY){
 if(!walkable(x,z,.44))return true;
 for(const c of roundBlockers()){
  if(footY>=c.h)continue;
  const d=Math.hypot(x-c.x,z-c.z);
  if(d<c.r+dogRadius&&d<Math.hypot(pos.x-c.x,pos.z-c.z))return true;
 }
 return obstacles.some(o=>{
   const cx=Math.max(o.x-o.w/2,Math.min(x,o.x+o.w/2));
   const cz=Math.max(o.z-o.d/2,Math.min(z,o.z+o.d/2));
   // Solid objects always block. Furniture blocks the dog's body until
   // its paws are genuinely at tabletop height (not just mid-jump nearby).
   return (x-cx)**2+(z-cz)**2<dogRadius**2 && (o.solid||footY<o.top-.025);
 });
}
function sweepMove(dx,dz){
 // Substeps prevent fast running from tunnelling through narrow furniture.
 const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.065));
 for(let i=0;i<n;i++){
  const sx=dx/n,sz=dz/n;
  if(!collides(pos.x+sx,pos.z,jumpY))pos.x+=sx;
  if(!collides(pos.x,pos.z+sz,jumpY))pos.z+=sz;
 }
}
let ballTouches=0,ballCooldown=0;
const playNotice=document.createElement('div');playNotice.id='playNotice';playNotice.textContent='⚽ דחוף את הכדור עם מילקי!';document.body.appendChild(playNotice);
function updateToy(dt){
  if(carried.has(toyBall)){toyVelocity.set(0,0);return}
  ballCooldown=Math.max(0,ballCooldown-dt);
  const delta=new THREE.Vector2(toyBall.position.x-pos.x,toyBall.position.z-pos.z);
  const dist=delta.length();
  if(dist<.93 && jumpY<.7){
    if(dist>.001)delta.multiplyScalar(1/dist);else delta.set(Math.sin(yaw),Math.cos(yaw));
    const push=Math.max(3.0,Math.abs((keys.ShiftLeft||keys.ShiftRight)?5.8:3));
    toyVelocity.addScaledVector(delta,Math.min(9,dt*push*14));
    if(ballCooldown===0){addChaos(3);ballTouches++;ballCooldown=.8;playNotice.textContent=ballTouches===1?'🐶 מילקי גילה כדור!':ballTouches%3===0?'🤣 מילקי, בעדינות!':'⚽ עוד דחיפה!';playNotice.classList.add('show')}
  }
  const oldX=toyBall.position.x,oldZ=toyBall.position.z;
  const nextX=oldX+toyVelocity.x*dt,nextZ=oldZ+toyVelocity.y*dt;
  if(!walkable(nextX,oldZ,.3)){toyVelocity.x*=-.6}else toyBall.position.x=nextX;
  if(!walkable(toyBall.position.x,nextZ,.3)){toyVelocity.y*=-.6}else toyBall.position.z=nextZ;
  const traveled=Math.hypot(toyBall.position.x-oldX,toyBall.position.z-oldZ);
  if(traveled>.00001){const axis=new THREE.Vector3(toyBall.position.z-oldZ,0,-(toyBall.position.x-oldX)).normalize();toyBall.rotateOnWorldAxis(axis,traveled/.32)}
  toyVelocity.multiplyScalar(Math.exp(-2.1*dt));if(toyVelocity.length()<.015)toyVelocity.set(0,0);
  if(ballCooldown===0&&sceneTimer<=0&&playNotice.classList.contains('show'))playNotice.classList.remove('show');
}
function trySnack(){if(won)return;const d=Math.hypot(pos.x-.5,pos.z-.3);if(d<1.9&&jumpY>=.78){if(!sceneTriggered)launchMug();won=true;snack.visible=false;dayEvent('snack');wrapper.visible=false;document.querySelector('#status').textContent='🏆 החטיף נגנב! מילקי ניצח, הסלון הפסיד.';document.querySelector('#status').style.color='#9cf3a7'}else if(d<2.3){document.querySelector('#status').textContent='קפוץ על השולחן ואז לחץ E / חטיף 🍪'}else{document.querySelector('#status').textContent='החטיף מחכה על השולחן. אפשר לקפוץ עליו!'}}
function reset(){challengesDone.clear();renderChallenges();tvOn=false;tvGlow.material.opacity=0;if(slipper.parent!==scene){slipper.parent.remove(slipper);scene.add(slipper)}dadNav.path=[];dadNav.stuck=0;dadNav.giveUp=0;slipper.position.copy(slipperHome);slipper.rotation.set(0,0,0);slipperState='floor';dadState='rest';dadAlert=0;dadRoutine=1;dadAction=0;dadGiftCooldown=0;dadPetCooldown=0;dadReactCooldown=0;dadSitBlend=0;dad.position.set(4.1,0,5.7);dad.position.y=0;missionText('סצנה: גנוב לאבא את הכפכף והחבא אותו במיטה!');for(const p of extras){p.g.position.copy(p.home);p.g.rotation.set(0,0,0);p.vx=p.vz=0}dadLastStage=0;dadSpeechTime=0;dadBubble.classList.remove("visible");trainingIndex=0;trainingTime=0;activeCmd="";setBtn(trainButton,'🦴','שב');resetChaos();chainPhase=0;chainClock=0;plantFall=0;dominoPlant.rotation.set(0,0,0);dominoPlant.position.copy(plantHome);if(NAV.free)patchNav(plantHome.x,plantHome.z,1.4);setChaos(0);grounded=true;landingCooldown=0;chaos=0;sceneTriggered=false;sceneTimer=0;mugFlying=false;mug.position.copy(mugHome);mug.rotation.set(0,0,0);mugVel.set(0,0,0);toyBall.position.set(toyHome.x,.34,toyHome.y);toyBall.rotation.set(0,0,0);toyVelocity.set(0,0);ballTouches=0;ballCooldown=0;tongueTimer=0;mood=0;setBtn('moodBtn','😄','הבעה');playNotice.classList.remove('show');pos.set(0,0,5.6);yaw=Math.PI;camYaw=Math.PI;curSpeed=0;yawVel=0;velocityY=0;jumpY=0;won=false;snack.visible=true;wrapper.visible=true;document.querySelector('#status').textContent='המשימה: גנוב את הכפכף של אבא והחבא אותו במיטה 🩴';document.querySelector('#status').style.color='#ffdc78';resetKitchen();resetDani();resetBubbles();resetYard();applySave();resetDay();dadSeated=false;dadSitBlend=0;dad.position.y=0;idleAction=null;idleTime=0;squash=0;petGlow=0;if(window.MODES_READY)restoreEaten();if(window.EVENTS_READY)resetEvents()}document.querySelector('#reset').onclick=()=>{reset();orbitAngle=0;orbitHeight=3.35;cameraDistance=4.1;viewIndex=0;setChip(viewBtn,'🎥','מאחור')};const startGame=()=>{started=true;document.querySelector('#overlay').style.display='none';unlockAudio()};
// Start the sound engine on the Start tap: iPhone only allows audio after a tap, and creating it mid-game causes a freeze.
function unlockAudio(){try{const a=initAudio();if(!a)return;a.c.resume();const b=a.c.createBuffer(1,1,22050),src=a.c.createBufferSource();src.buffer=b;src.connect(a.c.destination);src.start(0);MUS.next=0;MUS.step=0}catch(_){}}document.querySelector('#start').addEventListener('click',startGame);document.querySelector('#start').addEventListener('touchend',e=>{e.preventDefault();startGame()},{passive:false});
