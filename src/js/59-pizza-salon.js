var PUFF=0;
// ===== Street stage 3: Pizza & Falafel + the dog grooming salon =====
const PIZ={x0:20.2,x1:27.6,z0:20.6,z1:29.6},SAL={x0:20.2,x1:27.6,z0:30.6,z1:39.6};
AREAS.push(PIZ,SAL);DOORS.push({ax:true,x0:18.5,x1:21.1,z0:21.6,z1:23.8},{ax:true,x0:18.5,x1:21.1,z0:31.6,z1:33.8});
function shopShell(z0,wallM,floorM,frontGlassZ){const z1=z0+9;box(.2,6,1.4,wallM,19.95,3,z0+.35);box(.2,6,5.8,wallM,19.95,3,z0+6.1);box(.2,3,2.2,wallM,19.95,4.5,z0+2.1);box(.2,6,9.8,wallM,27.9,3,z0+4.5);box(8,6,.2,wallM,24,3,z1+.35);box(8,6,.2,wallM,24,3,z0-.25);
 box(.08,1.4,2.2,winM,19.86,1.7,z0+6);box(7.6,.05,9,floorM,24,.02,z0+4.5)}
shopShell(20.6,mat(0xf3e2c4),mat(0xc9a27a));shopShell(30.6,mat(0xfbe3ef),mat(0xe9eef2));
for(let x=20.6;x<27.6;x+=1)for(let z=20.8;z<29.6;z+=1)if(((x+z)|0)%2===0){const t=box(1,.01,1,decal(mat(0xb0885f)),x+.5,.05,z+.5);t.castShadow=false}
// ---------- pizzeria ----------
const OVEN={x:26.6,z:27.6};{box(1.8,1.6,1.6,mat(0xb5532e,.9),OVEN.x,.8,OVEN.z);const dm=ball(1,mat(0xb5532e,.9),OVEN.x,1.6,OVEN.z);dm.scale.set(.9,.6,.8);box(.08,.6,.8,new THREE.MeshBasicMaterial({color:0xff8a2a}),OVEN.x-.92,.75,OVEN.z);cyl(.18,1.6,mat(0x6b5a50),OVEN.x+.3,2.6,OVEN.z+.3)}
obstacles.push({name:'תנור',x:OVEN.x,z:OVEN.z,w:1.8,d:1.6,top:2.2,solid:true});
const PCOUNTER={x:25.0,z:23.4};box(.9,1.05,3.4,mat(0x2f6e4a),PCOUNTER.x,.52,PCOUNTER.z);box(1.0,.06,3.5,mat(0xf3f3ef),PCOUNTER.x,1.06,PCOUNTER.z);obstacles.push({name:'דלפק פיצה',x:PCOUNTER.x,z:PCOUNTER.z,w:.9,d:3.4,top:1.06});
for(const [dz,c] of [[-1.1,0xe8b04a],[0,0xd9573d],[1.1,0x7fb069]]){cyl(.36,.04,mat(0xd9a557),PCOUNTER.x,1.1,PCOUNTER.z+dz);cyl(.32,.02,mat(c),PCOUNTER.x,1.13,PCOUNTER.z+dz)}
const FALAFEL={x:21.4,z:28.4};box(1.4,1,.8,mat(0xe9c46a),FALAFEL.x,.5,FALAFEL.z);box(1.5,.06,.9,mat(0xf3f3ef),FALAFEL.x,1.02,FALAFEL.z);obstacles.push({name:'דוכן פלאפל',x:FALAFEL.x,z:FALAFEL.z,w:1.4,d:.8,top:1.02});
const fbowl=cyl(.3,.12,mat(0x8b5a3a),FALAFEL.x-.3,1.1,FALAFEL.z);for(let i=0;i<8;i++)ball(.06,mat(0x7a4e1e),FALAFEL.x-.3+(Math.random()-.5)*.3,1.18,FALAFEL.z+(Math.random()-.5)*.3);
const CHILI={x:FALAFEL.x+.35,z:FALAFEL.z};{const j=cyl(.1,.2,new THREE.MeshStandardMaterial({color:0xffd7c0,transparent:true,opacity:.6}),CHILI.x,1.15,CHILI.z);for(let i=0;i<3;i++){const c=cyl(.025,.12,mat(0xd6261f),CHILI.x+(i-1)*.04,1.2,CHILI.z);c.rotation.z=.3}}
for(const [x,z] of [[22.4,24.2],[22.4,26.2]]){cyl(.45,.06,mat(0xf3f3ef),x,.75,z);cyl(.05,.75,metal,x,.37,z);for(const a of [0,2.1,4.2]){const st=cyl(.18,.05,mat(0xd9573d),x+Math.cos(a)*.75,.45,z+Math.sin(a)*.75);cyl(.03,.45,metal,x+Math.cos(a)*.75,.22,z+Math.sin(a)*.75)}obstacles.push({name:'שולחן פיצה',x,z,w:.8,d:.8,top:.78})}
const CHEF=makePerson({skin:0xd8a07a,shirt:0xffffff,pants:0x333333,belly:true,hair:h=>{cyl(.3,.32,mat(0xffffff),0,.32,0,h);const t=ball(.36,mat(0xffffff),0,.52,0,h);t.scale.set(1,.5,1);box(.32,.07,.05,mat(0x2a2420),0,-.08,.335,h)}});
CHEF.g.position.set(26.0,0,23.4);CHEF.g.rotation.y=-Math.PI/2;const chefB=makeBubble(CHEF.g,3.3);
const dough=new THREE.Group();scene.add(dough);{const d=cyl(.34,.03,mat(0xf3e2c4,.8),0,0,0,dough)}dough.position.set(26,2.2,23.4);
const pizzaBox=new THREE.Group();scene.add(pizzaBox);{box(.5,.08,.5,mat(0xe8dcc6),0,.04,0,pizzaBox);box(.2,.005,.2,mat(0xc0392b),0,.085,0,pizzaBox)}
const PBOX_HOME=new THREE.Vector3(23.2,0,21.6);pizzaBox.position.copy(PBOX_HOME);const pboxRec={vx:0,vz:0,kind:'pizzabox',home:PBOX_HOME.clone(),g:pizzaBox};
addBody(pizzaBox,.22,()=>[pboxRec.vx,pboxRec.vz],(x,z)=>{pboxRec.vx=x;pboxRec.vz=z});Object.assign(bodies[bodies.length-1],{rec:pboxRec,kind:'pizzabox'});KIND_ICON.pizzabox='🍕';KIND_NAME.pizzabox='קרטון פיצה';
const CHEF_LINES=['מאמא מיה! כלב במסעדה!','פיצה טובה צריכה אהבה... ולא פרווה','אתה רוצה משלוח? אין לך כסף!','פלאפל או פיצה? שניהם? בחור!'];
// ---------- grooming salon ----------
const STUB={x:26.2,z:37.6,r:.75};{const t=cyl(.8,.6,mat(0xf6f6f2,.3),STUB.x,.3,STUB.z);const w=cyl(.72,.02,mat(0xbfe6ff,.2),STUB.x,.55,STUB.z);for(let i=0;i<8;i++){const a=i/8*6.28;ball(.13,mat(0xffffff,.9),STUB.x+Math.cos(a)*.45,.6,STUB.z+Math.sin(a)*.45)}}
const DRYER={x:26.8,z:33.2};{cyl(.06,1.5,metal,DRYER.x,.75,DRYER.z);const h=ball(.32,mat(0xe98ab0,.4),DRYER.x-.1,1.6,DRYER.z);h.scale.set(1,.8,1);cyl(.18,.4,mat(0xe98ab0,.4),DRYER.x-.45,1.55,DRYER.z).rotation.z=Math.PI/2}
const GTABLE={x:23.6,z:35.8};box(1.4,.9,.8,mat(0xd9dee2,.4),GTABLE.x,.45,GTABLE.z);box(1.5,.06,.9,mat(0x9aa3a6,.3),GTABLE.x,.92,GTABLE.z);obstacles.push({name:'שולחן טיפוח',x:GTABLE.x,z:GTABLE.z,w:1.4,d:.8,top:.95});
const MIRROR={x:27.75,z:35.5};box(.06,1.6,1.4,new THREE.MeshBasicMaterial({color:0xbfdcea}),MIRROR.x,1.3,MIRROR.z);box(.08,1.75,1.55,mat(0xf2c14e),MIRROR.x+.02,1.3,MIRROR.z);
for(let i=0;i<4;i++){box(.6,.05,.25,mat(0xe98ab0),27.4,1.0+i*.35,31.5);cyl(.06,.14,mat([0xf2c14e,0x7fd3ff,0xffffff,0x9b59b6][i]),27.4,1.12+i*.35,31.5)}
const PIPI=makeDog({name:'פיפי',color:0xf3c1d6,size:.6,speed:0,fluffy:true,x:GTABLE.x,z:GTABLE.z});PIPI.g.position.y=.95;PIPI.g.rotation.y=Math.PI/2;
const GROOMER=makePerson({skin:0xe2b48c,shirt:0xe98ab0,pants:0x2a2a2e,shoes:0xffffff,hair:h=>{const d=ball(.36,mat(0xf2e3b3),0,.14,-.04,h);d.scale.set(1.05,.85,1.05);ball(.2,mat(0xf2e3b3),0,.42,-.08,h);cyl(.3,.05,mat(0xe74c3c),0,.32,0,h)}});
GROOMER.g.position.set(23.6,0,34.6);GROOMER.g.rotation.y=Math.PI;const groomB=makeBubble(GROOMER.g,3.05);
const GROOM_LINES=['דרלינג! הפרווה הזאת זועקת לעזרה!','פיפי היא הלקוחה הכי מפורסמת שלי','אצלי כל כלב יוצא כוכב ✨','אל תתנער פה!!! הכל ורוד!'];
const bowG=new THREE.Group();headPivot.add(bowG);bowG.position.set(.12,.28,-.02);{const pk=mat(0xff5fa2,.4);for(const s of [-1,1]){const l=ball(.09,pk,s*.08,0,0,bowG);l.scale.set(1.2,.8,.5)}ball(.04,pk,0,0,0,bowG)}bowG.visible=false;
WEAR.bow=bowG;WEAR_DEFS.push({id:'bow',icon:'🎀',name:'פפיון ורוד',need:s=>[save.mods&&save.mods.bow?1:0,1,'לבקר במספרה']});
// ---------- challenges ----------
for(const c of [['catchDough','🍕 לתפוס את בצק הפיצה באוויר'],['falafel','🧆 לגנוב 3 כדורי פלאפל'],['chili','🌶️ לאכול צ\'ילי חריף'],['delivery','📦 להביא קרטון פיצה לאבא בבית'],['groomBath','🛁 אמבטיית קצף במספרה'],['dryer','💨 להתייבש במייבש הענק'],['bow','🎀 לקבל פפיון מהספרית'],['mirror','🪞 להתפעל מעצמך במראה'],['pipiShake','😱 להתנער ליד פיפי הפודל']])challengeDefs.push(c);
for(const id of save.challenges)if(challengeDefs.some(c=>c[0]===id))challengesDone.add(id);renderChallenges();
const ps={doughT:3,dough:'chef',dv:new THREE.Vector3(),falafel:0,falafelCool:0,chiliT:0,dryT:0,puff:0,mirrorT:0,talk:4,talk2:5};
function inPiz(){return pos.x>20.2&&pos.z>20.6&&pos.z<29.6}function inSal(){return pos.x>20.2&&pos.z>30.6&&pos.z<39.6}
function eatFalafel(){if(ps.falafelCool>0)return;ps.falafelCool=.8;ps.falafel++;addScore(100,'פלאפל '+ps.falafel+'/3');milkyThought('😋',1,true);if(window.JUICE_READY)pow('נום!');if(ps.falafel===2)sayText(chefB,'היי! זה של הלקוחות!',1.8,'say',true);if(ps.falafel>=3)completeChallenge('falafel')}
function eatChili(){completeChallenge('chili');ps.chiliT=6;sayText(milkyB,'🔥🔥🔥 חם!!! חם!!!',2,'say',true);sayText(chefB,'חחחחח! זה הסחוג של סבתא!',2,'say',true);if(window.JUICE_READY){punch(6);pow('🔥 אששש!',pos.x,2.2,pos.z,true)}}
function getBow(){bowG.visible=true;completeChallenge('bow');if(!save.mods.bow){save.mods.bow=true;writeSave();if(typeof checkUnlocks==='function')checkUnlocks()}sayText(groomB,'מושלם! עכשיו אתה כוכב ✨',2.2,'say',true);sayText(milkyB,'🎀 ...אני יפה?',1.8,'say',true)}
CTX_HOOKS.act.push(()=>inPiz()&&Math.hypot(pos.x-FALAFEL.x+.3,pos.z-FALAFEL.z)<1.6&&!challengesDone.has('falafel')?{i:'🧆',l:'פלאפל!',on:1,fn:eatFalafel}:null);
CTX_HOOKS.act.push(()=>inPiz()&&Math.hypot(pos.x-CHILI.x,pos.z-CHILI.z)<1.5&&!(ps.chiliT>0)?{i:'🌶️',l:'צ\'ילי!',on:1,fn:eatChili}:null);
CTX_HOOKS.act.push(()=>inSal()&&Math.hypot(pos.x-GROOMER.g.position.x,pos.z-GROOMER.g.position.z)<1.9?{i:'🎀',l:'פפיון!',on:1,fn:getBow}:null);
// ---------- update ----------
function updatePizzaSalon(dt){
 const t=performance.now()/1000,nearP=pos.x>17&&pos.z>20&&pos.z<30,nearS=pos.x>17&&pos.z>30&&pos.z<40;
 // chef tossing dough
 const C=CHEF.g.position;
 if(ps.dough==='chef'){ps.doughT-=dt;const k=Math.max(0,Math.sin(t*3.2));dough.position.set(C.x-.35,2.3+k*.7,C.z);dough.rotation.y+=dt*8;
  if(ps.doughT<=0&&nearP){ps.dough='fly';const a=Math.random()*Math.PI-Math.PI/2;ps.dv.set(-2.2-Math.random()*1.4,6,Math.sin(a)*1.6);sayText(chefB,pick(['אופס! לאן זה עף?!','מאמא מיה!!! הבצק!','תפוס!!!']),1.8,'say',true)}}
 else if(ps.dough==='fly'){ps.dv.y-=9*dt;dough.position.addScaledVector(ps.dv,dt);dough.rotation.y+=dt*10;dough.rotation.x+=dt*4;
  if(Math.hypot(dough.position.x-pos.x,dough.position.z-pos.z)<.9*MS&&dough.position.y<2.4*MS+jumpY&&dough.position.y>jumpY+.4){ps.dough='caught';ps.doughT=3;completeChallenge('catchDough');addScore(300,'תפיסה!');sayText(chefB,'בראבו!!! אתה מתקבל לעבודה!',2,'say',true);if(window.JUICE_READY){slowMo(.35);pow('תפיסה!',pos.x,2.4,pos.z,true)}}
  else if(dough.position.y<.05){dough.position.y=.05;ps.dough='floor';ps.doughT=2.5;if(window.JUICE_READY)pow('פלאפ!',dough.position.x,.8,dough.position.z);sayText(chefB,'אוף... עוד בצק לפח',1.6,'say')}}
 else if(ps.dough==='caught'){headPivot.localToWorld(_gv.set(0,.1,.6));dough.position.copy(_gv);dough.rotation.set(.4,0,0);ps.doughT-=dt;if(ps.doughT<=0){ps.dough='chef';ps.doughT=5+Math.random()*4;dough.rotation.set(0,0,0)}}
 else{ps.doughT-=dt;if(ps.doughT<=0){ps.dough='chef';ps.doughT=5+Math.random()*4;dough.rotation.set(0,0,0)}}
 animatePerson(CHEF,0,dt,{arm:i=>ps.dough==='chef'?-2.4+Math.sin(t*3.2)*.4:i?-.5:-.2});updateFace(CHEF.face,ps.dough==='fly'?'shock':ps.dough==='caught'?'laugh':'smile',dt);
 ps.falafelCool=Math.max(0,ps.falafelCool-dt);
 // chili: fire breath + speed burst
 if(ps.chiliT>0){ps.chiliT-=dt;headPivot.localToWorld(_gv.set(0,-.1,.75));if(Math.random()<.7)emit(_gv.x,_gv.y,_gv.z,Math.sin(yaw)*4+(Math.random()-.5),(Math.random()-.3),Math.cos(yaw)*4+(Math.random()-.5),'smoke',.5);if(keys.KeyW||stick.active)curSpeed=Math.max(curSpeed,7.5)}
 // pizza delivery to dad
 if(pizzaBox.visible&&Math.hypot(pizzaBox.position.x-dad.position.x,pizzaBox.position.z-dad.position.z)<1.9&&pizzaBox.position.x<6.4&&!challengesDone.has('delivery')){completeChallenge('delivery');addScore(600,'משלוח!');if(grab&&grab.b.o===pizzaBox)releaseGrab(false);pizzaBox.position.copy(PBOX_HOME);speakDad('פיצה?! מילקי, אתה הכלב הכי טוב בעולם!!! ...מי שילם?');thought(dadB,'🍕',2,true)}
 pizzaBox.position.x+=pboxRec.vx*dt;pizzaBox.position.z+=pboxRec.vz*dt;pboxRec.vx*=Math.exp(-3*dt);pboxRec.vz*=Math.exp(-3*dt);
 ps.talk-=dt;if(nearP&&ps.talk<=0){ps.talk=6+Math.random()*4;sayText(chefB,pick(CHEF_LINES),2.2,'say')}
 // salon
 const G=GROOMER.g.position;animatePerson(GROOMER,0,dt,{arm:i=>i===0?-1.2+Math.sin(t*9)*.25:-.3});updateFace(GROOMER.face,bath.foam>0&&inSal()?'shock':'smile',dt);
 PIPI.g.position.set(GTABLE.x,.95,GTABLE.z);PIPI.tail.rotation.z=Math.sin(t*5)*.4;PIPI.head.rotation.y=Math.sin(t*.8)*.5;
 if(inSal()&&Math.hypot(pos.x-STUB.x,pos.z-STUB.z)<STUB.r+.2&&jumpY<.7&&!challengesDone.has('groomBath')){setFoam(1);emitFoam(14);completeChallenge('groomBath');sayText(groomB,'קצף לבנדר! עכשיו להתייבש, דרלינג',2.2,'say',true)}
 if(inSal()&&Math.hypot(pos.x-STUB.x,pos.z-STUB.z)<STUB.r+.2&&jumpY<.7){wet=1;if(bath.foam<.5)setFoam(1)}
 if(Math.hypot(pos.x-DRYER.x+.9,pos.z-DRYER.z)<1.1&&lastDogSpeed<.4){ps.dryT+=dt;holdShow('dryHold',ps.dryT,2.5);if(Math.random()<.5)emit(DRYER.x-.7,1.5,DRYER.z,-2,0,(Math.random()-.5),'foam',.4);
  if(ps.dryT>2.5){if(!challengesDone.has('dryer'))completeChallenge('dryer');ps.puff=15;ps.dryT=0;wet=0;setFoam(0);sayText(milkyB,'💨 אני... ענן?',2,'say',true);sayText(groomB,'וואו! פאפי! מושלם!',1.8,'say',true)}}else ps.dryT=0;
 if(ps.puff>0){ps.puff-=dt;PUFF=.18*Math.min(1,ps.puff);headPivot.scale.setScalar(1+.12*Math.min(1,ps.puff))}else if(PUFF){PUFF=0;headPivot.scale.setScalar(1)}
 if(Math.hypot(pos.x-MIRROR.x+1.1,pos.z-MIRROR.z)<1.1&&lastDogSpeed<.3){ps.mirrorT+=dt;holdShow('mirrorHold',ps.mirrorT,2);if(ps.mirrorT>2&&!challengesDone.has('mirror')){completeChallenge('mirror');sayText(milkyB,pick(['😍 מי החתיך הזה?!','😏 וואו. פשוט וואו.']),2.4,'say',true);idleAction='stand';idleClock=0}}else ps.mirrorT=0;
 ps.talk2-=dt;if(nearS&&ps.talk2<=0){ps.talk2=6+Math.random()*4;sayText(groomB,pick(GROOM_LINES),2.2,'say')}
 if(nearS&&Math.random()<dt*.08)sayText(PIPI.b,pick(['אני לא מדברת עם כלבים מהרחוב 💅','אל תתקרב, אני אחרי פן','מיליון עוקבים, מותק']),2,'say');
}
function salonShake(){if(inSal()&&Math.hypot(pos.x-GTABLE.x,pos.z-GTABLE.z)<2.6&&!challengesDone.has('pipiShake')){completeChallenge('pipiShake');sayText(PIPI.b,'אאאאאא!!! הפן שלי!!! 😱',2.2,'say',true);sayText(groomB,'לאאאא! שעתיים עבדתי על הפודל הזה!',2.4,'say',true);if(window.JUICE_READY){slowMo(.4);pow('אאאאא!',GTABLE.x,2,GTABLE.z,true)}}}
const _holdL2={dryHold:'💨 מתייבש...',mirrorHold:'🪞 מסתכל במראה...'};Object.assign(_holdLabels,_holdL2);
Object.assign(SIDE_POS,{catchDough:()=>V(25,0,23.4),falafel:()=>V(FALAFEL.x-.3,1,FALAFEL.z),chili:()=>V(CHILI.x,1,CHILI.z),delivery:()=>grab&&grab.b.o===pizzaBox?dad.position:pizzaBox.position,
 groomBath:()=>V(STUB.x,.4,STUB.z),dryer:()=>V(DRYER.x-.9,0,DRYER.z),bow:()=>GROOMER.g.position,mirror:()=>V(MIRROR.x-1.1,0,MIRROR.z),pipiShake:()=>V(GTABLE.x,1,GTABLE.z)});
window.PS_READY=true;
