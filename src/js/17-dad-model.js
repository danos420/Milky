// Extra interactive props and dad: lightweight primitives for mobile performance.
const dad=new THREE.Group();scene.add(dad);dad.position.set(4.1,0,5.7);const DAD_R=.38;
// Dad: silver hair, glasses, big smile, a little belly, grey Lakers-style tracksuit,
// and one black slide (the other one is the slipper Milky keeps stealing).
const hoodieGray=mat(0x5d6268,.95),skin=mat(0xc68a62),silver=mat(0xcfcfcb,.9),lakersPurple=mat(0x55267a),lakersGold=mat(0xf0b52a),slideBlack=mat(0x1d1d1f,.6),stripeWhite=mat(0xeeeeea);
const shirt=hoodieGray,pants=hoodieGray,hair=silver;
box(.86,1.15,.46,hoodieGray,0,1.62,0,dad);
{const belly=ball(.33,hoodieGray,0,1.42,.08,dad);belly.scale.set(1.15,.95,.62);const hood=ball(.3,hoodieGray,0,2.13,-.22,dad);hood.scale.set(1.3,.6,.8)}
box(.34,.13,.02,lakersPurple,0,1.86,.235,dad);box(.3,.05,.022,lakersGold,0,1.78,.235,dad);
for(const s of [-1,1])cyl(.012,.28,stripeWhite,s*.09,1.93,.24,dad);
ball(.35,skin,0,2.5,.03,dad);for(const s of [-1,1])ball(.08,skin,s*.35,2.5,0,dad);
{const top=ball(.36,silver,0,2.66,-.05,dad);top.scale.set(1,.6,1);for(const s of [-1,1]){const side=ball(.2,silver,s*.27,2.56,-.1,dad);side.scale.set(.55,.8,.95)}}
const dadArms=[],dadLegs=[];
let dadSnack=null;
for(const side of [-1,1]){
 const shoulder=new THREE.Group();shoulder.position.set(side*.54,2.03,0);dad.add(shoulder);
 box(.22,.74,.25,hoodieGray,side*.03,-.34,0,shoulder);ball(.11,skin,side*.03,-.78,0,shoulder);
 if(side===1)box(.03,.12,.12,lakersGold,side*.15,-.2,0,shoulder);
 if(side===-1){dadSnack=box(.2,.28,.08,mat(0xf29a2e),side*.03,-.86,.12,shoulder);dadSnack.visible=false}
 dadArms.push(shoulder);
 const hip=new THREE.Group();hip.position.set(side*.22,1.06,0);dad.add(hip);
 box(.25,.84,.3,hoodieGray,0,-.4,0,hip);box(.02,.84,.05,stripeWhite,side*.13,-.4,0,hip);
 box(.2,.08,.34,skin,0,-.88,.1,hip);
 if(side===-1){box(.27,.05,.44,slideBlack,0,-.94,.1,hip);box(.28,.1,.17,slideBlack,0,-.86,.06,hip)}
 dadLegs.push(hip);
}
// Glasses, eyes, grey eyebrows, nose and a wide smile
const glassesMat=mat(0x161616,.4);
for(const s of [-1,1]){

 box(.2,.025,.02,glassesMat,s*.13,2.6,.355,dad);box(.2,.025,.02,glassesMat,s*.13,2.46,.355,dad);
 box(.025,.14,.02,glassesMat,s*.225,2.53,.355,dad);box(.025,.14,.02,glassesMat,s*.035,2.53,.355,dad);
}
box(.07,.02,.02,glassesMat,0,2.56,.36,dad);
const dadBrows=[];
for(const s of [-1,1]){dadBrows.push(box(.17,.04,.04,mat(0x9a9a96),s*.13,2.65,.355,dad));}
ball(.085,skin,0,2.44,.385,dad);
const dadMouth=box(.26,.06,.03,mat(0x5a2f2a),0,2.32,.345,dad);dadMouth.visible=false;
const dadFace=makeFace(dad,{eyeX:.13,eyeY:2.535,eyeZ:.335,eyeR:.048,mouthY:2.325,mouthZ:.37,mouthW:.1,cheekX:.22,cheekY:2.43,cheekZ:.31},dadBrows);
const dadSeat=new THREE.Group();scene.add(dadSeat);dadSeat.position.set(4.1,.32,5.7);
const slipper=new THREE.Group();scene.add(slipper);
// Dad's black slide sandal
box(.32,.06,.56,slideBlack,0,.04,0,slipper);box(.28,.012,.5,mat(0x34343a),0,.075,0,slipper);box(.34,.13,.2,slideBlack,0,.13,.06,slipper);
slipper.position.set(-3.5,0,-1.65);
const slipperHome=slipper.position.clone();
let slipperState='floor',dadState='rest',dadAlert=0,dadBarkCooldown=0,dadWalk=0,slipperWins=0;
let dadRoutine=1,dadAction=0,dadIdle=0,dadTarget=new THREE.Vector3(4.1,0,5.7),dadGiftCooldown=0,dadPetCooldown=0,dadMood='רגוע',dadSitBlend=0,dadReactCooldown=0;
const dadHome=new THREE.Vector3(4.3,0,6.75);
const mission=document.createElement('div');mission.id='slipperMission';mission.style.cssText='position:fixed;z-index:7;left:12px;top:115px;max-width:min(310px,60vw);background:#302820dc;color:#ffebc8;border:1px solid #bc9565;border-radius:12px;padding:9px 12px;font:bold 14px Arial;pointer-events:none';document.body.appendChild(mission);

const activityToggle=document.querySelector('#activityToggle');
const activityDrawer=document.querySelector('#activityDrawer');
const activityLog=document.querySelector('#activityLog');
activityToggle.addEventListener('click',()=>{const opened=activityDrawer.hidden;activityDrawer.hidden=!opened;activityToggle.setAttribute('aria-expanded',String(opened));activityToggle.classList.toggle('active',opened);if(opened&&!challengePanel.hidden)challengeToggle.onclick();if(opened&&!dayPanel.hidden){dayPanel.hidden=true;dayChip.classList.remove('active')}});
function addActivity(text){if(!text)return;try{voiceFor(text)}catch(_){}const entry=document.createElement('div');entry.textContent=text;activityLog.prepend(entry);while(activityLog.children.length>9)activityLog.lastElementChild.remove();}
function missionText(t){mission.textContent='🩴 '+t;addActivity('🩴 '+t)}
missionText('סצנה: גנוב לאבא את הכפכף והחבא אותו במיטה!');
function stealSlipper(){if(slipperState==='carried')return;
 if(slipperState==='dad'){notice('👨 הכפכף אצל אבא! חכה שיחזיר אותו',1.6);return}
 if(slipper.parent!==scene){slipper.parent.remove(slipper);scene.add(slipper)}
 if(Math.hypot(pos.x-slipper.position.x,pos.z-slipper.position.z)>1.7){notice('🐽 תתקרב לכפכף של אבא!',1.4);return}
 slipperState='carried';dadState='search';dadAlert=1.3;
 dog.add(slipper);slipper.position.set(0,1.5,1.28);slipper.rotation.set(Math.PI/2,0,0);
 missionText('רוץ למיטה של מילקי ליד המרפסת!');SFX.bark(.8,1.1,1);notice('🩴 מילקי גנב את הכפכף! לברוח!',2);speakDad('רגע... איפה הכפכף שלי?!');addChaos(13);
}
function dropSlipper(){if(slipperState!=='carried')return;
 dog.remove(slipper);scene.add(slipper);slipper.position.set(pos.x+Math.sin(yaw)*.5,.05,pos.z+Math.cos(yaw)*.5);if(!walkable(slipper.position.x,slipper.position.z,.3))slipper.position.set(pos.x,.05,pos.z);if(obstacles.some(o=>insidePlatform(o,slipper.position.x,slipper.position.z,.3)))slipper.position.set(pos.x,.05,pos.z);slipper.rotation.set(0,0,0);slipperState='floor';dadState='search';missionText('הכפכף נפל! אפשר להרים שוב');}
const slipperButton=document.getElementById('slipperBtn');
slipperButton.addEventListener('click',()=>slipperState==='carried'?dropSlipper():stealSlipper());
window.addEventListener('keydown',e=>{if(e.code==='KeyP'&&!e.repeat)slipperState==='carried'?dropSlipper():stealSlipper()});
const extras=[];
let binInner=null;
function extraProp(x,z,kind){const g=new THREE.Group();scene.add(g);g.position.set(x,0,z);
 if(kind==='bottle'){cyl(.15,.58,mat(0x56a2a1),0,.32,0,g);cyl(.10,.1,cream,0,.67,0,g)}
 else if(kind==='book'){box(.6,.13,.42,mat(0xd78a4f),0,.12,0,g);box(.53,.03,.38,cream,0,.2,0,g)}
 else if(kind==='shoe'){box(.48,.2,.28,mat(0x514e57),0,.12,0,g);box(.25,.16,.3,mat(0x8b7c6a),-.12,.26,0,g)}
 else if(kind==='duck'){ball(.24,mat(0xe9bc50),0,.24,0,g);ball(.16,mat(0xe9bc50),0,.5,.12,g);box(.15,.08,.15,mat(0xd77a42),0,.47,.29,g)}
 else if(kind==='remote'){box(.2,.10,.55,mat(0x3b4046),0,.1,0,g);for(let i=0;i<3;i++)ball(.035,gray,0,.16,-.16+i*.14,g)}
 else if(kind==='chair'){const w=mat(0xf3f3ef,.6);box(.55,.05,.5,w,0,.45,0,g);box(.55,.5,.05,w,0,.72,-.24,g);for(const [dx,dz] of [[-.24,-.22],[.24,-.22],[-.24,.22],[.24,.22]])cyl(.025,.45,w,dx,.22,dz,g)}
 else if(kind==='cone'){mesh(new THREE.ConeGeometry(.2,.55,14),mat(0xff7a1a),0,.29,0,g);box(.42,.04,.42,mat(0xff7a1a),0,.02,0,g);cyl(.14,.06,mat(0xffffff),0,.3,0,g)}
 else if(kind==='cooler'){box(.6,.4,.42,mat(0xd8382f),0,.2,0,g);box(.62,.08,.44,mat(0xf2f2f2),0,.43,0,g)}
 else if(kind==='bin'){cyl(.3,.85,mat(0x2f6e4a),0,.43,0,g);cyl(.32,.05,mat(0x24573a),0,.88,0,g)}
 else if(kind==='soccer'){ball(.3,mat(0xf5f5f5,.5),0,.3,0,g);for(let i=0;i<6;i++){const a=i*1.05;ball(.09,mat(0x1d1d1d),Math.cos(a)*.24,.3+Math.sin(i*2.1)*.15,Math.sin(a)*.24,g)}}
 else if(kind==='trash'){binInner=new THREE.Group();g.add(binInner);cyl(.28,.7,mat(0x5f6f6b),0,.35,0,binInner);cyl(.3,.05,mat(0x46524f),0,.72,0,binInner);box(.16,.04,.06,mat(0x46524f),0,.77,0,binInner)}
 else if(kind==='tissues'){box(.34,.2,.22,mat(0x7fb3d5,.7),0,.1,0,g);const t=box(.12,.12,.06,mat(0xffffff,.9),0,.25,0,g);t.rotation.y=.3}
 else if(kind==='thermo'){const m=cyl(.022,.3,mat(0xf5f5f5,.4),0,.03,0,g);m.rotation.z=Math.PI/2;const tip=ball(.03,mat(0xd63a2f,.4),-.16,.03,0,g)}
 else if(kind==='tp'){cyl(.13,.22,mat(0xf6f3ec,.9),0,.11,0,g);cyl(.045,.23,mat(0xb89a74),0,.115,0,g)}
 else if(kind==='baguette'){const m=cyl(.075,.72,mat(0xd9a557,.8),0,.08,0,g);m.rotation.z=Math.PI/2;for(const x of [-.2,0,.2]){const c=box(.02,.02,.1,mat(0xf0d29a),x,.15,0,g);c.rotation.y=.6}}
 else if(kind==='can'){const m=cyl(.11,.26,mat(0xc0392b,.4),0,.11,0,g);m.rotation.z=Math.PI/2;const l=cyl(.112,.12,mat(0xf2e3c6,.6),0,.11,0,g);l.rotation.z=Math.PI/2}
 else if(kind==='receipt'){box(.22,.012,.34,mat(0xf7f7f2,.9),0,.01,0,g);for(let i=0;i<4;i++)box(.14,.002,.012,mat(0x777777),0,.017,-.1+i*.06,g)}
 else if(kind==='shampoo'){cyl(.11,.42,mat(0xe85d9a,.5),0,.21,0,g);cyl(.06,.1,mat(0xf5f5f5),0,.47,0,g);box(.13,.03,.03,mat(0xf5f5f5),.06,.53,0,g)}
 else if(kind==='bowl'){cyl(.3,.12,mat(0xb8432f),0,.06,0,g);cyl(.23,.03,mat(0x8a5a35),0,.12,0,g)}
 extras.push({g,home:g.position.clone(),vx:0,vz:0,spin:0,kind,lock:0});}
extraProp(2.4,4.6,'bottle');extraProp(-2.7,2.5,'book');extraProp(3.7,-2.7,'shoe');extraProp(-1.8,-5.7,'duck');extraProp(2.5,-1.8,'remote');extraProp(-3.2,5.3,'shoe');extraProp(4.5,5.0,'book');extraProp(2.7,14.45,'trash');extraProp(-5.4,10.1,'bowl');
for(const [x,z] of [[1.3,-12.5],[-1.3,-12.5],[0,-11.2],[0,-13.8]])extraProp(x,z,'chair');for(const [x,z] of [[-2,-22],[-.6,-23],[.8,-22],[2.2,-23]])extraProp(x,z,'cone');extraProp(-6.5,-14,'cooler');extraProp(-18,-37.5,'bin');extraProp(-16.8,-37.5,'bin');extraProp(5,-20,'soccer');extraProp(-3.5,-11.2,'shampoo');extraProp(-2.9,-3.4,'tp');extraProp(.2,-6.9,'baguette');extraProp(1.7,-7.0,'can');extraProp(1.3,-6.6,'receipt');extraProp(-.8,11.0,'tissues');extraProp(5.3,6.9,'thermo');
const trashProp=extras.find(p=>p.kind==='trash');
for(const p of chaosProps){addBody(p.g,p.kind==='cushion'?.34:.27,()=>[p.vx,p.vz],(x,z)=>{p.vx=x;p.vz=z},v=>{if(p.g.position.y<.05)p.vy=Math.max(p.vy,v)});Object.assign(bodies[bodies.length-1],{rec:p,kind:p.kind})}
const extraRadius={tissues:.2,thermo:.14,tp:.16,baguette:.2,can:.16,receipt:.15,shampoo:.15,bottle:.17,book:.31,shoe:.27,duck:.25,remote:.22,trash:.3,bowl:.3,chair:.33,cone:.21,cooler:.33,bin:.32,soccer:.3};
for(const p of extras){addBody(p.g,extraRadius[p.kind],()=>[p.vx,p.vz],(x,z)=>{p.vx=x;p.vz=z});Object.assign(bodies[bodies.length-1],{rec:p,kind:p.kind})}
addBody(toyBall,.32,()=>[toyVelocity.x,toyVelocity.y],(x,z)=>{toyVelocity.x=x;toyVelocity.y=z});bodies[bodies.length-1].isBall=true;bodies[bodies.length-1].kind='ball';
const training=['שב','ארצה','תן יד','סיבוב','נבח','השתולל'];let trainingIndex=0,trainingTime=0,dadSpeechTime=0,dadLastStage=0,activeCmd="";
const trainButton=document.querySelector('#trainBtn'),interactButton=document.querySelector('#interactBtn'),dadBubble=document.querySelector('#dadBubble');
function speakDad(message){if(dadState==='away')return;addActivity('👨 אבא: '+message);dadSpeechTime=3.5}
function setDadState(s,phrase){if(dadState===s)return;dadState=s;dadAction=0;if(phrase)speakDad(phrase);if(DAD_EMOJI[s])thought(dadB,DAD_EMOJI[s],2.2)}
function train(){const cmd=training[trainingIndex];trainingIndex=(trainingIndex+1)%training.length;setBtn(trainButton,'🦴',training[trainingIndex]);trainingTime=1.5;activeCmd=cmd;
 if(cmd==='שב'){mood=3;notice('🐶 מילקי יושב... בערך!',1.6)}
 if(cmd==='ארצה'){mood=3;notice('🐶 ארצה! איפה החטיף?',1.6)}
 if(cmd==='תן יד'){notice('🐾 תן יד! (או שתיים)',1.6);tongueTimer=1.5}
 if(cmd==='סיבוב'){notice('🌀 מילקי מסתובב!',1.6);mood=1}
 if(cmd==='נבח'){notice('🔊 הב הב! אבא שמע הכול!',1.8);SFX.bark(1,1,2);speakDad('מה אתה נובח עכשיו?')}
 if(cmd==='השתולל'){notice('🤪 מי כלב טוב?!',1.8);triggerTurbo()}
}
function interactDad(){
 const d=Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z);
 if(d>2.1){setDadState('pet','מילקי! בוא אליי, חמוד!');dadPetCooldown=0;dadGiftCooldown=0;dadRoutine=8;addActivity('👨 אבא שמע אותך ובא ללטף!');return}
 if(slipperState==='carried'){setDadState('chase','מה זה בפה שלך?! תחזיר!');return}
 setDadState('pet','איפה מילקי שלי? בוא ללטיפה!');dadPetCooldown=0;dadGiftCooldown=0;
}
const dadInteractButton=document.getElementById('dadInteractBtn');
dadInteractButton.addEventListener('click',interactDad);
window.addEventListener('keydown',e=>{if(e.code==='KeyH'&&!e.repeat)interactDad()});
function interact(){
 if(slipperState==='carried'){dropSlipper();return}
 if(slipperState==='floor'&&Math.hypot(pos.x-slipper.position.x,pos.z-slipper.position.z)<1.45){stealSlipper();return}
 if(nearSausage()){eatSausage();return}
 if(nearFridge()){toggleFridge();return}
 if(nearMangal()){stealKebab();return}
 let closest=null,dist=1.65;
 for(const p of extras){if(!p.g.visible)continue;const d=Math.hypot(pos.x-p.g.position.x,pos.z-p.g.position.z);if(d<dist){closest=p;dist=d}}
 if(!closest){addActivity('🐽 מילקי מרחרח... אין משהו קרוב');return}
 const kind=closest.kind;
 if(window.SHOP_READY&&shopInteract(closest))return;
 const a=Math.atan2(closest.g.position.z-pos.z,closest.g.position.x-pos.x);
 closest.vx+=Math.cos(a)*3.8;closest.vz+=Math.sin(a)*3.8;closest.lock=.5;
 if(kind==='remote'){toggleTelevision();completeChallenge('remote');dayEvent('remote');speakDad('מי שינה לי את הערוץ?!')}
 else if(kind==='duck'){playToySound(640,.14,'square');completeChallenge('duck');addActivity('🦆 קוואק! הברווז מצפצף!')}
 else if(kind==='bottle'){playToySound(270,.12,'sine');completeChallenge('bottle');addActivity('🧴 הבקבוק התגלגל על הרצפה')}
 else if(kind==='shoe'){completeChallenge('shoe');speakDad('עוד נעל?! מילקי!')}
 else if(kind==='trash'){tipTrash()}
 else if(kind==='bowl'){eatFromBowl()}
 else if(kind==='shampoo'){for(let i=0;i<10;i++)emit(closest.g.position.x,.6,closest.g.position.z,(Math.random()-.5)*3,2+Math.random()*2,(Math.random()-.5)*3,'foam',1);addActivity('🫧 פלופ! בועות סבון לכל הכיוונים')}
 else if(kind==='book'){completeChallenge('book');addActivity('📚 מילקי פיזר את הספרים')}
 addChaos(9);showBurst(closest.g.position.x,closest.g.position.z);
}

trainButton.addEventListener('click',train);interactButton.addEventListener('click',interact);
window.addEventListener('keydown',e=>{if(e.repeat)return;if(e.code==='KeyR')train()});
// E is contextual: snack when standing on the table, otherwise touch the nearest thing.
function smartAction(){
 if(!won&&jumpY>=.78&&Math.hypot(pos.x-.5,pos.z-.3)<1.9){trySnack();return}
 const nearThing=nearMangal()||nearSausage()||nearFridge()||slipperState==='carried'||(slipperState==='floor'&&Math.hypot(pos.x-slipper.position.x,pos.z-slipper.position.z)<1.45)||extras.some(p=>Math.hypot(pos.x-p.g.position.x,pos.z-p.g.position.z)<1.65);
 if(nearThing)interact();else trySnack();
}
document.getElementById('snackBtn').addEventListener('click',trySnack);
function updateExtra(dt){trainingTime=Math.max(0,trainingTime-dt);dadSpeechTime=Math.max(0,dadSpeechTime-dt);if(!dadSpeechTime)dadBubble.classList.remove('visible');
 if(chaosStage>=4&&dadLastStage<4)speakDad('מילקיייי! מה הולך פה?!');dadLastStage=chaosStage;
 updateDadBehavior(dt);

 for(const p of extras){if(carried.has(p.g))continue;p.lock=Math.max(0,p.lock-dt);const dx=p.g.position.x-pos.x,dz=p.g.position.z-pos.z,d=Math.hypot(dx,dz);
 if(tryEat(p))continue;
 if(d<.76*mutReach()&&!p.lock){const a=Math.atan2(dz,dx);p.vx+=Math.cos(a)*2.6*mutPush();p.vz+=Math.sin(a)*2.6*mutPush();p.lock=.7;addChaos(4);if(p.kind==='trash'&&(keys.ShiftLeft||keys.ShiftRight))tipTrash()}
 p.g.position.x+=p.vx*dt;p.g.position.z+=p.vz*dt;p.g.rotation.y+=(Math.abs(p.vx)+Math.abs(p.vz))*dt*.5;{const dmp=p.kind==='can'?.8:2.3;p.vx*=Math.exp(-dmp*dt);p.vz*=Math.exp(-dmp*dt)}
 }
}

// Shared walking for dad and Dani: follow the grid path, slide along obstacles,
// never walk into Milky or each other, and report when stuck for too long.
function navStep(obj,nav,r,targetX,targetZ,speed,stopDistance,dt,others){
 const dist=Math.hypot(targetX-obj.position.x,targetZ-obj.position.z);
 if(!(speed>0&&dist>stopDistance)){nav.stuck=0;nav.giveUp=0;return {step:0,giveUp:false}}
 nav.repath-=dt;
 if(nav.repath<=0||!nav.path.length||Math.hypot(targetX-nav.tx,targetZ-nav.tz)>.5){
  nav.path=findPath(obj.position.x,obj.position.z,targetX,targetZ);nav.repath=.35;nav.tx=targetX;nav.tz=targetZ;
 }
 const path=nav.path;
 while(path.length>1&&lineFree(obj.position.x,obj.position.z,path[1][0],path[1][1],r))path.shift();
 while(path.length&&Math.hypot(path[0][0]-obj.position.x,path[0][1]-obj.position.z)<.06)path.shift();
 const wp=path.length?path[0]:[targetX,targetZ];
 const wx=wp[0]-obj.position.x,wz=wp[1]-obj.position.z,wd=Math.hypot(wx,wz);
 let step=0,giveUp=false;
 if(wd>.001){
  const travel=Math.min(wd,speed*dt,Math.max(0,dist-stopDistance)+.02),vx=wx/wd*travel,vz=wz/wd*travel;
  const X=obj.position.x,Z=obj.position.z;
  const okOthers=(x,z)=>others.every(o=>o.skip||Math.hypot(x-o.x,z-o.z)>=r+o.r+.03||Math.hypot(x-o.x,z-o.z)>Math.hypot(X-o.x,Z-o.z));
  const ok=(x,z)=>dadFree(x,z,r)&&okOthers(x,z);
  if(ok(X+vx,Z+vz)){obj.position.x+=vx;obj.position.z+=vz}
  else if(Math.abs(vx)>1e-4&&ok(X+vx,Z)){obj.position.x+=vx}
  else if(Math.abs(vz)>1e-4&&ok(X,Z+vz)){obj.position.z+=vz}
  step=Math.hypot(obj.position.x-X,obj.position.z-Z);
  if(step<travel*.25){nav.stuck+=dt;nav.giveUp+=dt}else{nav.stuck=0;nav.giveUp=Math.max(0,nav.giveUp-dt*2)}
  if(nav.stuck>.4){nav.stuck=0;nav.repath=0;nav.path=[]}
  if(nav.giveUp>2.5){nav.giveUp=0;giveUp=true}
 }
 return {step,giveUp};
}
function faceToward(obj,x,z,dt,rate=5){
 if(Math.hypot(x-obj.position.x,z-obj.position.z)<.1)return;
 const desired=Math.atan2(x-obj.position.x,z-obj.position.z);
 obj.rotation.y+=Math.atan2(Math.sin(desired-obj.rotation.y),Math.cos(desired-obj.rotation.y))*Math.min(1,dt*rate);
}
