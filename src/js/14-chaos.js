// Dynamic chaos toys: cushions, tumbling boxes and a wobbling lamp.
const chaosProps=[];
function looseProp(x,z,color,kind){
 const g=new THREE.Group();scene.add(g);
 if(kind==='cushion'){box(.68,.22,.62,mat(color),0,.17,0,g);ball(.11,mat(0xf5d7a6),.22,.25,.19,g)}
 else {box(.44,.55,.42,mat(color),0,.28,0,g);box(.38,.08,.36,mat(0xe0ba7b),0,.57,0,g)}
 g.position.set(x,0,z);
 chaosProps.push({g,home:new THREE.Vector3(x,0,z),vx:0,vz:0,vy:0,spin:0,kind,cooldown:0,hit:false});
}
looseProp(-3.25,-1.85,0xc87963,'cushion'); // on the floor right by the sofa (inside the sofa it gets pushed out and Dani tidies forever)
looseProp(-3.25,-.7,0x7a9b89,'cushion');
looseProp(3.2,2.7,0xa7784c,'box');
looseProp(4.25,3.6,0xb78d6d,'box');
looseProp(-2.2,4.0,0x6d9eab,'cushion');
let chaosScore=0, chaosStage=0, chaosShake=0, dadTimer=0, chaosFinished=false;
const stageMessages=['','🐾 אופס, כרית זזה!','⚽ הסלון מתחיל להתפרק!','😱 מילקי נבהל מהבלגן של עצמו!','👴 אבא: מילקיייי! מה קורה פה?!','🌪️ MAYHEM! הבית הפסיד!'];
function addChaos(points=1){if(lastDogSpeed>.4||!grounded||burstTime>0)noiseLevel+=points;
 if(chaosFinished)return;
 chaosScore=Math.min(100,chaosScore+points);
 const stage=Math.min(5,Math.floor(chaosScore/20));
 if(stage>chaosStage){
  chaosStage=stage;setChaos(stage);notice(stageMessages[stage],3.0);
  if(stage>=3){mood=2;tongueTimer=1.2;chaosShake=.16;milkyThought('😇',2.2,true);daniReact('chaos')}
  if(stage>=4)dadTimer=6;
  if(stage===5){chaosFinished=true;chaosShake=.35;document.querySelector('#status').textContent='🏆 MAYHEM! מילקי עדיין טוען שהוא ילד טוב 😇'}
 }
}
function updateChaos(dt){
 chaosShake=Math.max(0,chaosShake-dt*.28);
 dadTimer=Math.max(0,dadTimer-dt);
 for(const p of chaosProps){
  if(carried.has(p.g))continue;
  p.cooldown=Math.max(0,p.cooldown-dt);
  const dx=p.g.position.x-pos.x,dz=p.g.position.z-pos.z;
  const distance=Math.hypot(dx,dz);
  if(tryEat(p))continue;
  if(distance<.83*mutReach()&&jumpY<.85*MS&&p.cooldown===0){
   const a=Math.atan2(dz,dx);
   const power=((keys.ShiftLeft||keys.ShiftRight)?5.5:3.1)*mutPush();
   p.vx+=Math.cos(a)*power;p.vz+=Math.sin(a)*power;p.vy=2.3;
   p.cooldown=.75;p.hit=true;addChaos(8);
   if(Math.random()<.33)notice('🤣 מילקי רק רצה לעבור!',1.5);
  }
  // Object-to-object hits are handled by resolveBodies() (real separation + bounce).
  p.g.position.x+=p.vx*dt;p.g.position.z+=p.vz*dt;
  p.g.position.y=Math.max(0,p.g.position.y+p.vy*dt);
  p.vy-=9*mutG()*dt;if(p.g.position.y===0&&p.vy<0)p.vy=0;
  p.g.rotation.z+=p.vx*dt*.45;p.g.rotation.x+=p.vz*dt*.45;
  p.vx*=Math.exp(-(MUT.chaos?1.1:2.4)*dt);p.vz*=Math.exp(-(MUT.chaos?1.1:2.4)*dt);
 }
}

