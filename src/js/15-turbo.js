// Player-triggered slapstick burst. Lightweight meshes keep mobile performance manageable.
const turboButton=document.getElementById('turboBtn');
const comboLabel=document.getElementById('combo');
let turboCooldown=0,burstTime=0,comboHits=0,comboClock=0,turboLabel='';
const debris=[];
const debrisColors=[0xffce69,0xe77d5c,0x8dc6a2,0xf9e4b0,0x86b5d5];
const debrisGeo=new THREE.BoxGeometry(.10,.045,.13);
const debrisMats=debrisColors.map(c=>new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide}));
for(let i=0;i<32;i++){
 const m=new THREE.Mesh(debrisGeo,debrisMats[i%debrisMats.length]);m.visible=false;scene.add(m);
 debris.push({m,v:new THREE.Vector3(),life:0});
}
function showBurst(x,z){
 for(let i=0;i<debris.length;i++){
  const p=debris[i],a=Math.random()*Math.PI*2,s=1.5+Math.random()*3;
  p.m.position.set(x,1+Math.random(),z);p.v.set(Math.cos(a)*s,2+Math.random()*4,Math.sin(a)*s);
  p.life=.7+Math.random()*.85;p.m.visible=true;p.m.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);
 }
}
function triggerTurbo(){
 if(!started||turboCooldown>0)return;
 turboCooldown=8;burstTime=1.3;chaosShake=.32;
 mood=1;tongueTimer=1.7;
 showBurst(pos.x,pos.z);
 notice('🌪️ מילקי הפעיל טורבו! אבאאאא!',2.6);
 let affected=0;
 for(const p of chaosProps){
  const dx=p.g.position.x-pos.x,dz=p.g.position.z-pos.z,dist=Math.hypot(dx,dz);
  if(dist<6*MS){const strength=9*mutPush()/(1+dist*.3);p.vx+=(dx/(dist||1))*strength+(Math.random()-.5)*2;p.vz+=(dz/(dist||1))*strength+(Math.random()-.5)*2;p.vy=3+Math.random()*2;p.cooldown=.7;affected++}
 }
 const bx=toyBall.position.x-pos.x,bz=toyBall.position.z-pos.z,bd=Math.hypot(bx,bz)||1;
 if(bd<7){toyVelocity.x+=bx/bd*7;toyVelocity.y+=bz/bd*7}
 addChaos(12+affected*5);
 comboHits+=affected;comboClock=3.5;
 if(chaosStage>=4)notice('👴 אבא: מה זה, רעידת אדמה?!',2.5);
 milkyThought('🌪️',1.6,true);daniReact('chaos');
}
turboButton.addEventListener('click',triggerTurbo);
window.addEventListener('keydown',e=>{if(e.code==='KeyQ'&&!e.repeat)triggerTurbo()});
function updateTurbo(dt){
 turboCooldown=Math.max(0,turboCooldown-dt);
 burstTime=Math.max(0,burstTime-dt);
 if(turboButton.disabled!==(turboCooldown>0))turboButton.disabled=turboCooldown>0;
 const tl=turboCooldown>0?Math.ceil(turboCooldown)+' שנ׳':'טורבו';if(tl!==turboLabel){turboLabel=tl;setBtn(turboButton,'🌪️',tl)}
 comboClock=Math.max(0,comboClock-dt);
 {const c=comboClock>0&&comboHits>0?'💥 COMBO ×'+comboHits:'';if(comboLabel.textContent!==c)comboLabel.textContent=c}
 if(comboClock===0)comboHits=0;
 for(const p of debris){if(p.life<=0)continue;p.life-=dt;
  if(p.life<=0){p.m.visible=false;continue}
  p.v.y-=7*dt;p.m.position.addScaledVector(p.v,dt);
  p.m.rotation.x+=dt*5;p.m.rotation.z+=dt*6;
  if(p.m.position.y<.05){p.m.position.y=.05;p.v.y=Math.abs(p.v.y)*.3;p.v.x*=.8;p.v.z*=.8}
 }
}
function resetTurbo(){turboCooldown=0;burstTime=0;comboHits=0;comboClock=0;comboLabel.textContent='';for(const p of debris){p.life=0;p.m.visible=false}}

function resetChaos(){resetTurbo();chaosScore=0;chaosStage=0;chaosShake=0;dadTimer=0;chaosFinished=false;
 for(const p of chaosProps){p.g.position.copy(p.home);p.g.rotation.set(0,0,0);p.vx=p.vz=p.vy=0;p.cooldown=0;p.hit=false}
}
