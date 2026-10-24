// ---- Milky's feelings drive the whole body ----
const scared=(dadState==='chase'||dadState==='search')&&slipperState==='carried'&&Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z)<7;
if(scared&&!wasScared){milkyThought('😱',1.8,true);SFX.whimper()}
wasScared=scared;
petGlow=Math.max(0,petGlow-dt);
if((dadState==='pet'||daniState==='pet')&&(Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z)<1.9||Math.hypot(pos.x-dani.position.x,pos.z-dani.position.z)<1.9)){if(petGlow<=0)milkyThought('❤️',2);petGlow=.6}
const happy=!scared&&(mood===1||petGlow>0);
// ---- Idle personality: if you leave Milky alone he finds something to do ----
const inputActive=moving||turn!==0||!grounded||keys.Space;
if(inputActive||trainingTime>0||scared||slipperState==='carried'){idleTime=0;idleAction=null}else idleTime+=dt;
if(!idleAction&&idleTime>3.2){
 idleAction=canStandUp()&&Math.random()<.5?'stand':IDLE_ACTIONS[Math.floor(Math.random()*IDLE_ACTIONS.length)];idleClock=0;idleTime=0;
 if(idleAction!=='scratch')think(idleAction,2.8);
}
if(idleAction){idleClock+=dt;if(idleClock>IDLE_LEN[idleAction])idleAction=null}
const poi=pointOfInterest();
if(poi&&poi.food&&!moving&&poi.d<2.6)think('food',2.4);
const pose=trainingTime>0&&(activeCmd==='שב'||activeCmd==='ארצה')?activeCmd:idleAction==='scratch'?'שב':idleAction==='lie'?'ארצה':idleAction==='stand'?'stand':null;
// ---- Body: bounce, squash on landing, stretch in the air, lean into turns ----
// Walk: the body dips at the ends of each stride so planted paws stay on the floor (no floating feet).
const bounce=moving&&grounded?THREE.MathUtils.lerp(-(1-Math.cos(.5*Math.sin(steps)))*.85*MS,(.5-.5*Math.cos(steps*2.3))*.085,runBlend)*gait:0;
dog.position.set(pos.x,Math.max(0,jumpY)+bounce,pos.z);
dog.rotation.y=yaw+(trainingTime>0&&activeCmd==="סיבוב"?(1.5-trainingTime)*Math.PI*4:0);
squash=Math.max(0,squash-dt*4.5);
const stretch=!grounded?THREE.MathUtils.clamp(velocityY/7,-.6,.8):0;
const sxz=(1+.12*squash-.04*Math.abs(stretch))*(1+mutBelly*.22)*(1+(window.PS_READY?PUFF:0));
torso.scale.set(sxz,1-.2*squash+.08*Math.abs(stretch),sxz*(running?1.05:1));
torso.rotation.z+=((-THREE.MathUtils.clamp(yawVel,-6,6)*gait*.05)+Math.sin(steps*.5)*.03*gait*(1-runBlend)-torso.rotation.z)*Math.min(1,dt*6);
const pitchTarget=(grounded?THREE.MathUtils.lerp(Math.sin(steps)*.02,Math.sin(steps*1.15)*.07,runBlend)*gait:0)-runBlend*.05*gait+(!grounded?-velocityY*.035:0)+(pose==='שב'?-.75:pose==='ארצה'?-.04:pose==='stand'?-1.15:0)+(idleAction==='sniff'?.08:0)+(scared?.05:0);
torso.rotation.x+=(pitchTarget-torso.rotation.x)*Math.min(1,dt*10);
torso.position.y+=((pose==='שב'?-.05:pose==='ארצה'?-.72:pose==='stand'?1.136:scared&&!moving?-.08:0)-torso.position.y)*Math.min(1,dt*9);
torso.position.z+=((pose==='שב'?.9:pose==='stand'?.556:0)-torso.position.z)*Math.min(1,dt*9);
// ---- Legs: trot when walking, gallop when running, tuck in the air, fold to sit ----
legs.forEach(({pivot,knee,front,s})=>{
 // Walk (trot) and run (gallop) poses are both computed and blended, so speeding up flows smoothly.
 const phW=steps+(front?(s===1?0:Math.PI):(s===1?Math.PI:0)),phR=steps*1.15+(front?0:Math.PI*.85)+(s===1?.4:0);
 const swW=Math.sin(phW),swR=Math.sin(phR),sw=THREE.MathUtils.lerp(swW,swR,runBlend);
 // Paw lifts only while swinging forward; it stays planted while the leg pushes back.
 const liftW=Math.max(0,-Math.cos(phW)),liftR=Math.max(0,-Math.cos(phR));
 let hipX=THREE.MathUtils.lerp(swW*.5,swR*.82,runBlend)*gait,kneeX=(front?1:-1)*THREE.MathUtils.lerp(liftW*.6,liftR*1.0,runBlend)*gait;
 if(!grounded){const air=THREE.MathUtils.clamp(velocityY/5.6,-1,1);hipX=front?-.55*air-.25:.6*air+.25;kneeX=front?.9:-.8}
 if(pose==='שב'){if(front){hipX=-.08;kneeX=.05}else{hipX=-1.35;kneeX=1.55}}
 if(pose==='ארצה'){hipX=front?-1.4:1.3;kneeX=front?.1:-.25}
 if(pose==='stand'){if(front){hipX=-1.25;kneeX=.35+Math.sin(t*3)*.05}else{hipX=.05;kneeX=-.1}}
 if(idleAction==='scratch'&&!front&&s===1){hipX=-1.45+Math.sin(t*28)*.38;kneeX=-1.1}
 if(scared&&!moving&&grounded){kneeX+=front?.25:-.25}
 hipX-=torso.rotation.x; // legs live in the body frame; keep their angles relative to the floor
 const legK=Math.min(1,dt*(moving&&grounded&&!pose?30:14));
 pivot.rotation.x+=(hipX-pivot.rotation.x)*legK;
 knee.rotation.x+=(kneeX-knee.rotation.x)*legK;
 pivot.rotation.z=sw*.045*gait;
});

// ---- Head: curious, looks at interesting things, sniffs, tilts ----
let lookYaw=THREE.MathUtils.clamp((orbitAngle+Math.atan2(Math.sin(camYaw-yaw),Math.cos(camYaw-yaw)))*.58,-.72,.72),lookPitch=0;
if(poi&&!running){const a=Math.atan2(poi.x-pos.x,poi.z-pos.z),rel=Math.atan2(Math.sin(a-yaw),Math.cos(a-yaw));
 if(Math.abs(rel)<2.1){lookYaw=THREE.MathUtils.clamp(rel,-.95,.95);lookPitch=THREE.MathUtils.clamp(-(poi.y-1.3-jumpY)/Math.max(1,poi.d)*.7,-.45,.5)}}
if(scared){const a=Math.atan2(dad.position.x-pos.x,dad.position.z-pos.z),rel=Math.atan2(Math.sin(a-yaw),Math.cos(a-yaw));lookYaw=THREE.MathUtils.clamp(rel,-1,1)}
const yawning=idleAction==='yawn'&&idleClock>.3&&idleClock<1.5;
headPivot.rotation.y+=(lookYaw-headPivot.rotation.y)*Math.min(1,dt*5.5);
const headX=Math.sin(t*1.7)*.035+(mood===2?-.10:0)+lookPitch+(idleAction==='sniff'?.5+Math.sin(t*15)*.05:0)+(yawning?-.35:0)+(slipperState==='carried'?-.18:0)+(running?.12:0)+(pose==='ארצה'?.25:0)+(pose==='שב'?.55:pose==='stand'?.9:0);
headPivot.rotation.x+=(headX-headPivot.rotation.x)*Math.min(1,dt*8);
const headZ=Math.sin(t*2.3)*.05+Math.sin(steps)*.045*gait+(idleAction==='look'||mood===2?.34:0)+(mood===3?-.18:0);
headPivot.rotation.z+=(headZ-headPivot.rotation.z)*Math.min(1,dt*7);
nose.scale.x=.065+(idleAction==='sniff'||poi&&poi.food&&poi.d<2.6?Math.abs(Math.sin(t*22))*.015:0);
// ---- Face ----
tongueTimer=Math.max(0,tongueTimer-dt);
const tongueOut=tongueTimer>0||mood===1||running||happy||idleAction==='look';
tongue.scale.y+=((tongueOut?(running?.21:.17):.02)-tongue.scale.y)*Math.min(1,dt*12);
tongue.position.y+=((tongueOut?-.29+(running?Math.sin(t*18)*.015:0):-.16)-tongue.position.y)*Math.min(1,dt*12);
blinkTimer+=dt;
const blinking=(blinkTimer%4.8)>4.68||yawning||(idleAction==='lie'&&idleClock>1.5);
eyes.forEach(({white,pupil,s})=>{
 const h=blinking?.008:scared?.08:(mood===2||mood===3?.07:happy?.045:.06);
 white.scale.y+=(h-white.scale.y)*Math.min(1,dt*10);
 pupil.scale.y+=(h*.63-pupil.scale.y)*Math.min(1,dt*10);
 const ps=scared?.022:mood===3?.038:.03;pupil.scale.x+=(ps-pupil.scale.x)*Math.min(1,dt*8);
 pupil.position.x=s*.13+headPivot.rotation.y*.02;
});
mouth.scale.x+=((yawning?.11:mood===1||happy?.13:mood===3?.06:.1)-mouth.scale.x)*Math.min(1,dt*9);
mouth.scale.y+=((yawning?.09:mood===1||happy?.05:scared?.04:.025)-mouth.scale.y)*Math.min(1,dt*9);
// ---- Floppy ears on springs ----
ears.forEach(e=>{
 const tx=(scared?.75:0)+(running?.6:moving?.14:0)+(idleAction==='sniff'?-.15:0)+Math.sin(t*3+e.s)*.05;
 const tz=e.s*(.1+(!grounded?.6:0)+Math.abs(Math.sin(steps))*.16*gait+(happy?.15:0)+(idleAction==='look'?.2:0));
 e.vx+=((tx-e.ax)*130-e.vx*9)*dt;e.ax+=e.vx*dt;
 e.vz+=((tz-e.az)*130-e.vz*8)*dt+(squashKick?-e.s*squashKick*9:0);e.az+=e.vz*dt;
 e.pivot.rotation.x=e.ax;e.pivot.rotation.z=e.az;
});
squashKick=0;
// ---- Tail: wags with mood, tucks when scared ----
const wagSpeed=scared?3:happy?24:running?14:idleAction==='look'?20:moving?11:7;
const wagAmp=scared?.06:happy?.6:idleAction==='lie'?.12:.34;
const tailUp=scared?-2.75:happy?-1.0:running?-1.5:-2.0;
tail.rotation.x+=(tailUp-tail.rotation.x)*Math.min(1,dt*6);
wagPhase+=dt*wagSpeed;
tailSegs.forEach((sg,i)=>{sg.rotation.z=Math.sin(wagPhase-i*.6)*wagAmp*(.45+i*.2);sg.rotation.x+=(((scared?.05:happy?.4:.3)+Math.sin(wagPhase*.5-i*.4)*.03)-sg.rotation.x)*Math.min(1,dt*8)});
// Dizzy after a flip: wobble, spinning stars, then a big head shake
if(dizzy.active){dizzy.t+=dt;const k=dizzy.t,f=Math.max(0,1-k/1.9);
 starRing.visible=k<1.25;starRing.rotation.y+=dt*9;
 if(k<1.2){torso.rotation.z=Math.sin(k*9)*.34*f;dog.rotation.y=yaw+Math.sin(k*5)*.55*f;headPivot.rotation.y=Math.sin(k*13)*.6;headPivot.rotation.z=Math.sin(k*7)*.45;
  legs.forEach(l=>{l.pivot.rotation.z=l.s*.38*f});tongue.scale.y=.2;tongue.position.y=-.29;eyes.forEach(e=>{e.white.scale.y=.035+Math.abs(Math.sin(k*11+e.s))*.04})}
 else if(k<1.8){headPivot.rotation.z=Math.sin(k*48)*.5;torso.rotation.z=Math.sin(k*48)*.12;if(!dizzy.shook){dizzy.shook=true;for(let i=0;i<4;i++)setTimeout(()=>playToySound(260+i*40,.05,'square'),i*70)}}
 if(k>1.95){dizzy.active=false;starRing.visible=false;milkyThought('😎',1.4,true)}
}
// Shaking off water, flips and ragdoll tumbling (rotate around the body centre, not the paws)
torso.rotation.y=shakeT>0?Math.sin(t*45)*.4:0;
if(rag.active||flip.active){
 dog.quaternion.setFromEuler(rag.active?_eu.set(rag.rx,yaw+rag.ry,rag.rz,'YXZ'):_eu.set(-Math.PI*2*Math.min(1,flip.t/.55),yaw,0,'YXZ'));
 const v=_c115.set(0,1.15*MS,0).applyQuaternion(dog.quaternion),baseY=rag.active?rag.y+.4*MS:Math.max(0,jumpY);
 dog.position.set(pos.x-v.x,baseY+1.15*MS-v.y,pos.z-v.z);
 if(rag.active)legs.forEach((l,i)=>{l.pivot.rotation.x=Math.sin(t*19+i*1.7)*1.1;l.knee.rotation.x=Math.sin(t*15+i)*.9});
}else{dog.rotation.x=0;dog.rotation.z=0}
}}
const _camDir=new THREE.Vector3(),_camDesired=new THREE.Vector3(),_eu=new THREE.Euler(0,0,0,'YXZ'),_c115=new THREE.Vector3();
function renderFrame(){
// Keep the follow camera INSIDE the room and on Milky's side of any wall.
// The room is axis-aligned; a ray from Milky toward the desired camera location
// is shortened before it reaches the wall plane (with a safety margin).
const inShop=pos.x>20.05&&pos.z>0&&pos.z<40?1:0,hum=window.HUMAN_READY&&(HUMAN||window.DETECT||window.DADP)?1:0,par=window.PARP?1:0,camK=(MS<1?.45+.5*MS:1+(MS-1)*.8)*(1+.22*hum)*(1-.12*par);look.set(pos.x,1.35*MS+jumpY*(.45+.45*par)+.55*hum-.5*par,pos.z);
const cameraDirection=_camDir.set(-Math.sin(camYaw+orbitAngle)*cameraDistance*camK*(inShop?.85:1),(inShop?Math.max(orbitHeight,5.6):orbitHeight)*camK+jumpY*(.45+.45*par)-look.y,-Math.cos(camYaw+orbitAngle)*cameraDistance*camK*(inShop?.85:1));
let safeFraction=1;
// Walk along the camera arm and stop before it leaves the walkable rooms (walls between rooms included).
const camWall=(x,z)=>{const lx=look.x;if(lx>6.5&&x<6.7&&z>-9&&z<16)return false;if(lx<6.5&&x>6.3&&look.z>-9&&look.z<16)return false;if(lx>20&&x<20.15)return false;if(lx<19.95&&lx>6.5&&x>19.75&&z>-.3&&z<40.1)return false;if(lx>20){const cell=v=>v<10?0:v<20?1:v<30?2:3;if(cell(look.z)!==cell(z))return false}return true};
const camInside=(x,z,r)=>camWall(x,z)&&((x>=6.6+r&&x<=19.4-r&&z>=-8.6+r&&z<=44-r)||(x>=20.1+r&&x<=31.5-r&&z>=.1+r&&z<=39.9-r)||(z>-9?Math.abs(x)<=6.4-r&&z<=15.9-r:Math.abs(x)<=20-r&&z>=(PARK_OPEN?-58:-40)+r));
for(let k=1;k<=28;k++){const f=k/28;if(!camInside(look.x+cameraDirection.x*f,look.z+cameraDirection.z*f,.14)){safeFraction=Math.max(.08,(k-1)/28-.015);break}}
// Shorten the camera arm before it enters furniture. Treat furniture as
// padded 3D boxes; the camera stays on Milky's side of the obstruction.
for(const o of obstacles){
 const bottom=0, top=o.top+(o.name==='ספה'?.85:.12);
 const halfX=o.w/2+.25, halfZ=o.d/2+.25;
 const bounds=[[o.x-halfX,o.x+halfX,'x'],[bottom,top,'y'],[o.z-halfZ,o.z+halfZ,'z']];
 let entry=0, exit=safeFraction;
 for(const [lo,hi,axis] of bounds){
  const origin=look[axis], delta=cameraDirection[axis];
  if(Math.abs(delta)<1e-7){if(origin<lo||origin>hi){entry=2;break}}
  else {const a=(lo-origin)/delta,b=(hi-origin)/delta;entry=Math.max(entry,Math.min(a,b));exit=Math.min(exit,Math.max(a,b))}
 }
 if(entry<=exit&&entry>0.02)safeFraction=Math.min(safeFraction,Math.max(.08,entry-.055));
}
safeFraction=THREE.MathUtils.clamp(safeFraction,.08,1);
const desired=_camDesired.copy(look).addScaledVector(cameraDirection,safeFraction);
// When a wall forces the camera in close, lift it so it looks down over Milky instead of into his back.
desired.y+=(1-safeFraction)*2.1;
// Move inward immediately when approaching a wall, but ease outward when clear.
const currentDist=camera.position.distanceTo(look);
const desiredDist=desired.distanceTo(look);
const ease=1-Math.exp(-lastFrameDt*(desiredDist<currentDist-.4?16:7));
camera.position.lerp(desired,ease);
if(look.x>6.5&&look.z>-8.6){camera.position.x=THREE.MathUtils.clamp(camera.position.x,look.x>20?20.25:6.75,look.x>20?31.45:19.6);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-8.5,43.9)}else if(camera.position.z>-9){camera.position.x=THREE.MathUtils.clamp(camera.position.x,-6.3,6.3);camera.position.z=Math.min(15.8,camera.position.z)}else{camera.position.x=THREE.MathUtils.clamp(camera.position.x,-19.9,19.9);camera.position.z=Math.max(PARK_OPEN?-57.9:-39.9,camera.position.z)}
const across=(camera.position.z-9)*(look.z-9)<0||Math.abs(camera.position.z-9)<.35;
dividerMat.opacity+=((across?.16:1)-dividerMat.opacity)*.25;dividerMat.depthWrite=dividerMat.opacity>.95;frameMat.opacity=Math.min(1,dividerMat.opacity*1.6);frameMat.depthWrite=dividerMat.depthWrite;
const acrossB=(camera.position.z+9)*(look.z+9)<0||Math.abs(camera.position.z+9)<.35;balconyMat.opacity+=((acrossB?.16:1)-balconyMat.opacity)*.25;balconyMat.depthWrite=balconyMat.opacity>.95;
{const tx=sun.shadow.camera.right*2/sun.shadow.mapSize.x,sx=Math.round(pos.x/tx)*tx,sz=Math.round(pos.z/(tx*1.65))*tx*1.65;sun.position.set(sx,8,sz-10.5);sun.target.position.set(sx,0,sz)} // snapped to shadow texels: no crawling shadow edges // shadows follow Milky across the big world
camera.lookAt(look);if(chaosShake>0){camera.position.x+=(Math.random()-.5)*chaosShake*.11;camera.position.y+=(Math.random()-.5)*chaosShake*.07}placeBubbles();syncLiveMats();renderer.render(scene,camera);perfTick()}
// Flat floor tiles, rugs and lines never need to cast shadows (saves a lot on phones).
scene.traverse(m=>{const g=m.isMesh&&m.geometry.parameters;if(g&&g.height!==undefined&&g.height<.03)m.castShadow=false});
