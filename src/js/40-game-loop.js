function animate(ts){requestAnimationFrame(animate);const t0=performance.now();let raw=lastTs&&ts?(ts-lastTs)/1000:1/60;lastTs=ts||0;if(!(raw>0)||raw>.25)raw=1/60;smoothDt+=(Math.min(raw,.05)-smoothDt)*.2;const dt=Math.min(smoothDt,.04);lastFrameDt=dt;if(started&&!window.PHOTO_ON)gameStep(dt*(window.JUICE_READY?juiceTick(dt):1));if(window.JUICE_READY&&started)levelupFrame(dt);renderFrame();perfMeterTick(t0)}
function gameStep(dt){{const free=!rag.active&&!(dizzy.active&&dizzy.t<1.15),forward=free&&!!(keys.KeyW||keys.ArrowUp),back=free&&!!(keys.KeyS||keys.ArrowDown),left=free&&!!(keys.KeyA||keys.ArrowLeft),right=free&&!!(keys.KeyD||keys.ArrowRight);
let move=(forward?1:0)-(back?1:0),turn=(left?1:0)-(right?1:0),runSpeed=(keys.ShiftLeft||keys.ShiftRight?5.8:3.0)*mutSpeed()*(MS<1?.8:1)*(window.DADP?.82:1);
if(free&&stick.active&&stick.mag>.12){
 // Joystick: push where you want Milky to go, relative to the camera. Full push = run.
 const heading=camYaw+Math.atan2(-stick.x,stick.y),diff=Math.atan2(Math.sin(heading-yaw),Math.cos(heading-yaw)),stepTurn=Math.sign(diff)*Math.min(Math.abs(diff)*(1-Math.exp(-dt*13)),dt*10);
 yawVel=stepTurn/Math.max(dt,1e-4);yaw+=stepTurn;turn=THREE.MathUtils.clamp(stepTurn/(dt*2.25),-1,1);move=(keys.ShiftLeft||keys.ShiftRight)?1:stick.mag;if(Math.abs(diff)>2.2)move*=.3;
}else if(free&&(lookDragT>0||activeDrag)){
 // Looking around: Milky's body turns with the view, quickly and smoothly.
 const diff=Math.atan2(Math.sin(camYaw-yaw),Math.cos(camYaw-yaw)),stepTurn=diff*(1-Math.exp(-dt*11));yawVel=stepTurn/Math.max(dt,1e-4);yaw+=stepTurn;turn=THREE.MathUtils.clamp(diff,-1,1)*.6;
}else{yawVel+=(turn*2.6-yawVel)*Math.min(1,dt*11);yaw+=yawVel*dt}
lookDragT=Math.max(0,lookDragT-dt);
// Camera swings in behind Milky only when he moves forward on screen; sideways pushes walk straight across.
const camRate=(lookDragT>0||activeDrag)?0:stick.active?2.4*stick.mag*Math.max(0,stick.y/Math.max(stick.mag,.01)):(forward||back||left||right)?5:1.5;
camYaw+=Math.atan2(Math.sin(yaw-camYaw),Math.cos(yaw-camYaw))*Math.min(1,dt*camRate);
const targetSpeed=free?runSpeed*move*(inPool?.55:1):0,accel=(Math.abs(targetSpeed)>Math.abs(curSpeed)?10:14)*(MUT.turbo?1.6:1);
curSpeed+=THREE.MathUtils.clamp(targetSpeed-curSpeed,-accel*dt,accel*dt);const speed=curSpeed;lastDogSpeed=Math.abs(speed);const dx=Math.sin(yaw)*speed*dt,dz=Math.cos(yaw)*speed*dt;sweepMove(dx,dz);
if(rag.active)updateRagdoll(dt);else{
// A jump begins from whichever surface Milky is currently standing on.
if(keys.Space&&grounded&&free){velocityY=5.6*(window.DADP?.75:1);grounded=false;SFX.jump()}
const spaceEdge=keys.Space&&!lastSpace;lastSpace=!!keys.Space;
if(spaceEdge&&!grounded&&jumpY>.5&&!flip.active){flip.active=true;flip.t=0;SFX.whoosh()}
if(flip.active){flip.t+=dt;if(flip.t>=.55){flip.active=false;flipsThisAir++;playToySound(480+flipsThisAir*120,.08,'triangle')}}
if(!grounded)airTime+=dt;
const previousFoot=jumpY;
const wasAir=!grounded;
if(!grounded){velocityY-=12*mutG()*dt;jumpY+=velocityY*dt}
const fallV=velocityY;
// Resolve landing only when descending across a real surface from above.
// Never snap upward onto a table from below or from its side.
const support=surfaceAt(pos.x,pos.z,previousFoot);
// When walking off a platform, begin falling; never remain suspended.
if(grounded && jumpY>support+.055){grounded=false;velocityY=Math.min(velocityY,0)}
// Descending paws must CROSS a platform's top from above to land.
const crossed=velocityY<=0?landingSurface(pos.x,pos.z,previousFoot,jumpY):0;
if(!grounded&&velocityY<=0 && crossed>0){
 jumpY=crossed;velocityY=0;grounded=true;
 const tr=obstacles.find(o=>o.bouncy&&Math.abs(o.top-crossed)<.01&&insidePlatform(o,pos.x,pos.z,-.1));
 if(tr){velocityY=Math.min(14,Math.max(9.5,-fallV*.85+3.5));grounded=false;squash=1;squashKick=1;SFX.boing()}
 if(crossed>.7&&landingCooldown<=0){landingCooldown=.55;
  if(insidePlatform(obstacles[1],pos.x,pos.z,-.10))launchMug();
  else if(!sceneTriggered){playNotice.textContent='🐾 מילקי כבש את הרהיט!';playNotice.classList.add('show');sceneTimer=1.1;}
 }
}
// Floor is always a valid landing surface.
if(jumpY<=0){jumpY=0;velocityY=0;grounded=true}
if(wasAir&&grounded){squash=Math.min(1,Math.abs(fallV)/7);if(window.Z_READY&&ZOMBIE&&fallV<-3)zLand();if(MS>1.2&&squash>.2)chaosShake=Math.max(chaosShake,.3*squash);squashKick=squash;if(squash>.3)SFX.land(squash);if(window.JUICE_READY&&squash>.62&&!flip.active&&flipsThisAir===0){pow(MS>1.2?'בוווום!':'בום!');punch(MS>1.2?7:3.5)}
 const air=airTime;airTime=0;
 if(flip.active){flip.active=false;flipsThisAir=0;startRagdoll();addScore(100,'נחיתה על הפרצוף')}
 else if(flipsThisAir>0){const n=flipsThisAir;flipsThisAir=0;startDizzy(n);addScore(n===1?250:n===2?600:1500*(n-2),n===1?'סלטה!':n===2?'סלטה כפולה!':'מילקי האגדי! ×'+n);completeChallenge('flip');dayEvent('flip');if(window.JUICE_READY){if(n>=2){slowMo(.55);punch(6);pow(n===2?'וואו!!':'אגדי!!!',pos.x,2*MS,pos.z,true)}else pow('סלטה!')}if(window.SICK_READY)sickFlip();if(window.FAMILY_READY)familyFlip()}
 else if(fallV<-14.5){startRagdoll();addScore(200,'נחיתה אומנותית')}
 else if(air>1.3)addScore(Math.round(air*80),'זמן אוויר '+air.toFixed(1)+' שנ׳');
}
// If the character ever intersects a piece of furniture (e.g. after a
// previous bad state), gently eject horizontally instead of trapping it.
for(const o of obstacles){
 if(jumpY>=o.top-.025)continue;
 const minX=o.x-o.w/2-dogRadius,maxX=o.x+o.w/2+dogRadius;
 const minZ=o.z-o.d/2-dogRadius,maxZ=o.z+o.d/2+dogRadius;
 if(pos.x>minX&&pos.x<maxX&&pos.z>minZ&&pos.z<maxZ){
  const candidates=[{d:pos.x-minX,axis:'x',v:minX-.015},{d:maxX-pos.x,axis:'x',v:maxX+.015},{d:pos.z-minZ,axis:'z',v:minZ-.015},{d:maxZ-pos.z,axis:'z',v:maxZ+.015}];
  candidates.sort((a,b)=>a.d-b.d);
  // Only eject to a spot that is really free (never behind the sofa into the wall).
  const valid=candidates.find(c=>{const x=c.axis==='x'?c.v:pos.x,z=c.axis==='z'?c.v:pos.z;return !collides(x,z,jumpY)})||candidates.find(c=>{const x=c.axis==='x'?c.v:pos.x,z=c.axis==='z'?c.v:pos.z;return walkable(x,z,.44)})||candidates[0];
  if(valid.axis==='x')pos.x=valid.v;else pos.z=valid.v;
 }
}
// Same for round blockers (e.g. landing on top of a plant after jumping over it).
for(const c of roundBlockers()){
 if(jumpY>=c.h)continue;
 const dx=pos.x-c.x,dz=pos.z-c.z,d=Math.hypot(dx,dz),m=c.r+dogRadius;
 if(d<m-.01){const nx=d>1e-4?dx/d:Math.sin(yaw),nz=d>1e-4?dz/d:Math.cos(yaw);
  let x=c.x+nx*(m+.01),z=c.z+nz*(m+.01);if(!walkable(x,z,.44))[x,z]=nearestWalkable(x,z,.44);pos.x=x;pos.z=z}
}
}
landingCooldown=Math.max(0,landingCooldown-dt);
// Paws planted on the floor: stride rate matches ground speed (longer strides in a gallop), so the legs never treadmill.
steps+=Math.abs(speed)*dt*THREE.MathUtils.lerp(3.35,1.95,runBlend)/MS;{const fp=Math.floor(steps/Math.PI);if(fp!==lastFootPhase){lastFootPhase=fp;if(grounded&&!rag.active&&lastDogSpeed>.6){SFX.step(lastDogSpeed>4,pos.z<-15.9);if(lastDogSpeed>4&&pos.z<-9.1)emit(pos.x-Math.sin(yaw)*.7*MS,.08,pos.z-Math.cos(yaw)*.7*MS,-Math.sin(yaw)*.6,.5,-Math.cos(yaw)*.6,'dust',.45)}}}updateToy(dt);updateScene(dt);updateChaos(dt);updateTurbo(dt);updateExtra(dt);updateKitchen(dt);updateDani(dt);updateYard(dt);updateDay(dt);updateModes(dt,performance.now()/1000);updateEvents(dt);if(window.BATH_READY)updateBath(dt);if(window.SHOP_READY)updateShop(dt);if(window.SICK_READY)updateSick(dt);if(window.PARK_READY)updatePark(dt);if(window.FAMILY_READY)updateFamily(dt);if(window.BDAY_READY)updateBirthday(dt);if(window.CTRL_READY)updateCtxButtons(dt);if(window.CLARITY_READY)holdTick();if(window.STREET_READY)updateStreet(dt);if(window.VET_READY)updateVet(dt);if(window.OW_READY)updateOpenWorld(dt);if(window.PS_READY)updatePizzaSalon(dt);if(window.HM_READY)humanRig(dt);resolveBodies(dt);tickBubbles(dt);updateContextHint();if(chaosStage>=5)completeChallenge('chaos');
const moving=Math.abs(speed)>0.01;
runBlend+=(THREE.MathUtils.smoothstep(Math.abs(speed),3.3,5.4)-runBlend)*Math.min(1,dt*6);
const running=moving&&runBlend>.5;
const gait=moving?Math.min(1,Math.abs(speed)/3):0;
const t=performance.now()*.001;
