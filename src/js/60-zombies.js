// ===== Zombie attack mode: the whole neighbourhood went green and wants sausages. Bark, stomp, survive the waves =====
var ZOMBIE=false;try{ZOMBIE=localStorage.getItem('milky-mode')==='zombie'}catch(_){}
LIGHT.push({sky:0x1f2d22,hemi:0x9fd49a,ground:0x1a2318,sun:0xa8f0a0,sunI:.5,k:.72});const Z_LIGHT=LIGHT.length-1;
const zHud=document.getElementById('zHud'),zOver=document.getElementById('zOver');
const ZSKINS=[0x7fb069,0x8fbf6a,0x6fa35a,0x9ac47a],ZSHIRTS=[0x5a4a6a,0x6b5a4a,0x4a5a6b,0x7a4a4a,0x3f5f4a];
const ZHAIR=[h=>{for(let i=0;i<5;i++)ball(.1,mat(0x2a2a2a),Math.cos(i)*.25,.15,-Math.sin(i)*.2,h)},h=>{const d=ball(.34,mat(0x4a3020),0,.12,-.05,h);d.scale.set(1,.6,1)},h=>{},h=>{cyl(.36,.06,mat(0x2b7fd4),0,.12,0,h)}];
const ZPOOL=[];
for(let i=0;i<12;i++){const P=makePerson({skin:ZSKINS[i%4],shirt:ZSHIRTS[i%5],pants:0x3a3a3a,shoes:0x222222,belly:i%3===0,hair:ZHAIR[i%4]});
 P.g.visible=false;P.g.position.set(0,0,-90);for(const s of [-1,1])ball(.06,new THREE.MeshBasicMaterial({color:0xd8ff6a,toneMapped:false}),s*.12,.06,.31,P.head);
 ZPOOL.push({P,on:false,hp:2,stun:0,fall:0,b:makeBubble(P.g,3.05),sp:.9+Math.random()*.5,stuck:0,groan:2+Math.random()*4,hitCool:0})}
const Z_LINES=['נקניקיייות...','במבההה...','מיייילקי...','כפכף... כפכף...','שבת שלוום...','גררררר...','מוווח... או פיצה','אווו... הגב שלי...'];
const zs={wave:0,hearts:3,inv:0,breakT:0,alive:0,toSpawn:0,spawnT:0,kos:0,barkCool:0,best:+(LS('milky-zbest')||0),over:false,dadThrow:4};
function zoneOf(x,z){return x>6.6?'street':z<-40.4?'park':z<-9.1?'yard':'house'}
const Z_SPAWN={street:[[8,-7],[18,-7],[8,43],[18,43],[13,-7],[13,43]],yard:[[-19,-38],[19,-38],[-19,-12],[19,-12],[0,-38]],park:[[-18,-56],[18,-56],[-18,-42],[18,-42]],house:[[-5.5,-7.5],[5.5,-7.5],[-5.5,15.2],[5,15.2],[-5.5,7.8]]};
function zSpawn(){const z=ZPOOL.find(z=>!z.on);if(!z)return false;const zone=zoneOf(pos.x,pos.z);const pts=Z_SPAWN[zone].filter(p=>Math.hypot(p[0]-pos.x,p[1]-pos.z)>6);const p=pick(pts.length?pts:Z_SPAWN[zone]);
 z.on=true;z.hp=zs.wave>=4?3:2;z.stun=0;z.fall=0;z.stuck=0;z.P.g.visible=true;z.P.g.position.set(p[0]+(Math.random()-.5),0,p[1]+(Math.random()-.5));z.P.g.rotation.set(0,0,0);z.sp=.9+Math.random()*.5+zs.wave*.08;zs.alive++;return true}
function zStartWave(){zs.wave++;zs.toSpawn=3+zs.wave*2;zs.spawnT=0;zs.breakT=0;showBanner('🧟 גל '+zs.wave+'! '+zs.toSpawn+' זומבים בדרך');if(window.JUICE_READY)punch(4);zHudPaint();
 if(zs.wave===1){speakDad('מילקי!!! השכנים... הם ירוקים!!! תגן עלינו!');setTimeout(()=>sayDani('אני נועל את המקרר! הם רוצים את הנקניקיות!'),1500)}
 else if(zs.wave%2===0)speakDad(pick(['עוד?! מאיפה הם באים?!','מילקי! נבח עליהם! חזק!','אני זורק כפכפים!!!']))}
function zHudPaint(){if(typeof owChip==='function')owChip();document.getElementById('zHearts').textContent='❤️'.repeat(Math.max(0,zs.hearts))+'🖤'.repeat(Math.max(0,3-zs.hearts));
 document.getElementById('zWave').textContent=zs.breakT>0?'הפסקה '+Math.ceil(zs.breakT):'גל '+zs.wave;document.getElementById('zLeft').textContent='🧟 '+(zs.alive+zs.toSpawn)}
function zKO(z,how){if(z.fall>0)return;zs.koLog=(zs.koLog||[]);zs.koLog.push(how||'x');z.fall=1.6;z.stun=0;zs.kos++;addScore(100+zs.wave*20,how||'זומבי נפל!');sayText(z.b,pick(['אוווי...','לא שוב...','זה היה נקניקייה...','💤']),1.4,'say',true);
 if(window.JUICE_READY){pow(pick(['בוינג!','פאק!','בום!','אאוץ\'!']),z.P.g.position.x,2.4,z.P.g.position.z);hitStop(.035)}}
function zHit(z,dmg,from){if(z.fall>0)return;z.hp-=dmg;const o=z.P.g.position,dx=o.x-from.x,dz=o.z-from.z,d=Math.hypot(dx,dz)||1;const nx=o.x+dx/d*1.1,nz=o.z+dz/d*1.1;if(walkable(nx,nz,.35)){o.x=nx;o.z=nz}
 z.stun=1.2;if(z.hp<=0)zKO(z)}
function zBark(){if(zs.barkCool>0||zs.over)return;zs.barkCool=1.1;sayText(milkyB,pick(['🗣️ האו!!!','🗣️ וואף וואף!!!','🗣️ רררהאו!!!']),1,'say',true);if(window.JUICE_READY){punch(3);pow('האו!!',pos.x,2.2*MS,pos.z)}
 for(let i=0;i<14;i++){const a=i/14*Math.PI*2;emit(pos.x+Math.cos(a)*.5,1.1,pos.z+Math.sin(a)*.5,Math.cos(a)*5,.4,Math.sin(a)*5,'foam',.35)}
 let n=0;for(const z of ZPOOL){if(!z.on||z.fall>0)continue;const o=z.P.g.position;if(Math.hypot(o.x-pos.x,o.z-pos.z)<3.2*MS){zHit(z,1,pos);n++}}if(n>=3)addScore(200,'נביחת על! ×'+n)}
CTX_HOOKS.act.unshift(()=>ZOMBIE&&!zs.over?{i:'🗣️',l:zs.barkCool>0?'...':'נביחה!',on:zs.barkCool>0?0:1,fn:zBark}:null);
function zLand(){let n=0;for(const z of ZPOOL){if(!z.on||z.fall>0)continue;const o=z.P.g.position;if(Math.hypot(o.x-pos.x,o.z-pos.z)<1.7*MS){zKO(z,'נחיתה על זומבי!');n++}}if(n){if(window.JUICE_READY)punch(5);zs.inv=Math.max(zs.inv,.6)}}
function zHurt(z){if(zs.inv>0||zs.over)return;zs.hearts--;zs.inv=1.6;zHudPaint();zHud.classList.remove('hit');void zHud.offsetWidth;zHud.classList.add('hit');
 startRagdoll();const o=z.P.g.position,dx=pos.x-o.x,dz=pos.z-o.z,d=Math.hypot(dx,dz)||1;rag.vx=dx/d*6;rag.vz=dz/d*6;rag.vy=4;
 sayText(z.b,'נקניקייה!!!',1.2,'say',true);if(window.JUICE_READY){punch(7);hitStop(.08)}if(zs.hearts<=0)zGameOver();else milkyThought('😵',1.2,true)}
function zGameOver(){zs.over=true;const best=Math.max(zs.best,zs.wave);if(best>zs.best){zs.best=best;LS('milky-zbest',String(best))}
 setTimeout(()=>{const st=document.getElementById('zStats');st.innerHTML='';for(const l of ['🌊 הגעת לגל '+zs.wave,'🧟 הפלת '+zs.kos+' זומבים','⭐ ניקוד '+score.toLocaleString('he-IL'),'🏆 שיא: גל '+zs.best]){const d=document.createElement('div');d.textContent=l;st.appendChild(d)}zOver.hidden=false},1400)}
function zReset(){for(const z of ZPOOL){z.on=false;z.P.g.visible=false;z.P.g.position.set(0,0,-90)}Object.assign(zs,{inBreak:false,wave:0,hearts:3,inv:0,breakT:3,alive:0,toSpawn:0,spawnT:0,kos:0,barkCool:0,over:false,dadThrow:4});zOver.hidden=true;zHudPaint()}
const ZHIDE=()=>[neighbor.g,lady.g,stroller,...PEOPLE.map(p=>p.P.g)];
function zApply(on){document.body.classList.toggle('zombieMode',on);zHud.hidden=!on;for(const g of ZHIDE())g.visible=!on;if(on){zReset();day.light=Z_LIGHT}else{for(const z of ZPOOL){z.on=false;z.P.g.visible=false}zOver.hidden=true}}
function setZombie(on){ZOMBIE=on;try{localStorage.setItem('milky-mode',on?'zombie':'open')}catch(_){}
 OPEN_WORLD=true;document.body.classList.toggle('openWorld',true);reset();owApply();zApply(on)}
document.getElementById('startZombie').addEventListener('click',()=>{setZombie(true);startGame()});
document.getElementById('startOpen').addEventListener('click',()=>{if(ZOMBIE){ZOMBIE=false;zApply(false);try{localStorage.setItem('milky-mode','open')}catch(_){}}},true);
document.getElementById('start').addEventListener('click',()=>{if(ZOMBIE){ZOMBIE=false;zApply(false)}},true);
document.getElementById('zAgain').addEventListener('click',()=>{reset();owApply();zApply(true)});
document.getElementById('zQuit').addEventListener('click',()=>{setZombie(false);showBanner('🌍 עולם פתוח')});
{const b=document.createElement('button');b.className='chip';b.type='button';b.id='zSwitch';b.textContent='🧟 מתקפת זומבים';b.addEventListener('click',()=>{setZombie(!ZOMBIE);b.textContent=ZOMBIE?'🌍 לסיים את המתקפה':'🧟 מתקפת זומבים'});document.getElementById('challengePanel').appendChild(b)}
document.getElementById('modeSwitch').addEventListener('click',()=>{if(ZOMBIE){ZOMBIE=false;zApply(false)}},true);
const _nth2=nextTaskHint;nextTaskHint=function(){if(!ZOMBIE)return _nth2();return zs.over?'🧟 הזומבים ניצחו...':zs.breakT>0?'😮‍💨 הפסקה! גל '+(zs.wave+1)+' עוד רגע':'🗣️ נבח על הזומבים (כפתור פעולה) · נחיתה עליהם מפילה'};
const _ct2=currentTarget;currentTarget=function(){if(!ZOMBIE)return _ct2();let b=null,bd=1e9;for(const z of ZPOOL){if(!z.on||z.fall>0)continue;const o=z.P.g.position,d=Math.hypot(o.x-pos.x,o.z-pos.z);if(d<bd){bd=d;b=o}}return guideOn&&bd>5?b:null};
const _uow=updateOpenWorld;updateOpenWorld=function(dt){if(!ZOMBIE)return _uow(dt);if(!day.finished)owApply();if(!rain.visible)day.light=Z_LIGHT;for(const s of Object.values(OW_MARKS))s.visible=false;updateZombies(dt)};
function updateZombies(dt){
 const t=performance.now()/1000;zs.barkCool=Math.max(0,zs.barkCool-dt);zs.inv=Math.max(0,zs.inv-dt);
 if(zs.over){for(const z of ZPOOL)if(z.on)animatePerson(z.P,0,dt,{arm:()=>-1.5});return}
 // waves
 if(zs.toSpawn>0){zs.spawnT-=dt;if(zs.spawnT<=0&&zs.alive<10){if(zSpawn())zs.toSpawn--;zs.spawnT=Math.max(.5,1.6-zs.wave*.1);zHudPaint()}}
 else if(zs.alive===0){
  if(zs.wave>0&&!zs.inBreak){zs.inBreak=true;zs.breakT=7;if(zs.hearts<3){zs.hearts++;addActivity('❤️ חיים נוספים בין הגלים')}addScore(300*zs.wave,'שרדת את גל '+zs.wave+'!');showBanner('😮‍💨 גל '+zs.wave+' נגמר!');zHudPaint()}
  const before=Math.ceil(zs.breakT);zs.breakT-=dt;if(Math.ceil(zs.breakT)!==before)zHudPaint();
  if(zs.breakT<=0){zs.inBreak=false;zStartWave()}}
 // landing on a zombie / turbo burst knocks it out
 for(const z of ZPOOL){if(!z.on)continue;const P=z.P,o=P.g.position;
  if(z.fall>0){z.fall-=dt;P.g.rotation.x=Math.min(Math.PI/2,P.g.rotation.x+dt*5);if(z.fall<=.5)P.g.position.y-=dt*1.5;if(z.fall<=0){z.on=false;P.g.visible=false;P.g.position.set(0,0,-90);P.g.rotation.set(0,0,0);zs.alive--;zHudPaint()}continue}
  const dm=Math.hypot(pos.x-o.x,pos.z-o.z);
  if(burstTime>1.1&&dm<5){zKO(z,'טורבו!');continue}
  if(MS>1.2&&dm<1.1&&lastDogSpeed>2){zKO(z,'דריסה ענקית!');continue}
  let step=0;
  if(z.stun>0){z.stun-=dt;P.g.rotation.z=Math.sin(t*20)*.15}
  else{P.g.rotation.z=0;const sameZone=zoneOf(o.x,o.z)===zoneOf(pos.x,pos.z);const dx=pos.x-o.x,dz=pos.z-o.z,d=dm||1;const s=Math.min(dm,z.sp*dt);let moved=false;
   for(const [ax,az] of [[dx/d,dz/d],[dx/d,0],[0,dz/d],[dx/d*.7-dz/d*.7,dz/d*.7+dx/d*.7]]){const nx=o.x+ax*s,nz=o.z+az*s;if(walkable(nx,nz,.32)&&!obstacles.some(b=>(b.solid||b.top>.6)&&insidePlatform(b,nx,nz,.25))){o.x=nx;o.z=nz;moved=true;step=s;break}}
   z.stuck=moved?Math.max(0,z.stuck-dt):z.stuck+dt;if(z.stuck>3||(!sameZone&&dm>14)){const zone=zoneOf(pos.x,pos.z),pts=Z_SPAWN[zone].filter(p=>Math.hypot(p[0]-pos.x,p[1]-pos.z)>6);const p=pick(pts.length?pts:Z_SPAWN[zone]);o.set(p[0],0,p[1]);z.stuck=0}
   P.g.rotation.y=Math.atan2(dx,dz);
   z.hitCool=Math.max(0,z.hitCool-dt);if(dm<1.0*MS&&!grounded&&velocityY<0&&jumpY<1.6){zKO(z,'נחיתה על זומבי!');velocityY=6;if(window.JUICE_READY)punch(4);continue}
   if(dm<.85&&jumpY<1.0&&!rag.active&&z.hitCool===0){z.hitCool=1;zHurt(z)}}
  // keep zombies from stacking
  for(const q of ZPOOL){if(q===z||!q.on||q.fall>0)continue;const p2=q.P.g.position,ddx=o.x-p2.x,ddz=o.z-p2.z,dd=Math.hypot(ddx,ddz);if(dd<.6&&dd>0){const k=(.6-dd)/2/dd;const nx=o.x+ddx*k,nz=o.z+ddz*k;if(walkable(nx,nz,.3)){o.x=nx;o.z=nz}}}
  animatePerson(P,step*.6,dt,{arm:i=>-1.5+Math.sin(t*3+i)*.12});P.head.rotation.z=Math.sin(t*2+o.x)*.25;updateFace(P.face,z.stun>0?'confused':'angry',dt);
  z.groan-=dt;if(z.groan<=0&&dm<10){z.groan=5+Math.random()*6;sayText(z.b,pick(Z_LINES),1.8,'say')}
 }
 // dad throws slippers at zombies near the house
 zs.dadThrow-=dt;if(zs.dadThrow<=0){zs.dadThrow=5+Math.random()*3;const tgt=ZPOOL.find(z=>z.on&&z.fall<=0&&zoneOf(z.P.g.position.x,z.P.g.position.z)==='house'&&Math.hypot(z.P.g.position.x-dad.position.x,z.P.g.position.z-dad.position.z)<7);
  if(tgt){speakDad(pick(['קח כפכף!!!','תתרחק מהכלב שלי!!!','זה בשביל הנקניקיות!']));for(let i=0;i<6;i++)emit(dad.position.x,2,dad.position.z,(tgt.P.g.position.x-dad.position.x)*.8,2,(tgt.P.g.position.z-dad.position.z)*.8,'dust',.6);zHit(tgt,2,dad.position)}}
}
if(ZOMBIE)OPEN_WORLD=true;
window.Z_READY=true;
setTimeout(()=>{if(ZOMBIE){owApply();zApply(true)}},0);
