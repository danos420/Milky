// ===== Play as Dad: 10 missions with an AI Milky. Finishing them unlocks Dad in the open world (switch characters with 🔄) =====
var DADP=false;
const v3=(x,y,z)=>new THREE.Vector3(x,y,z);
// NPC Milky (a simple dog rig with Milky's colours)
const NM=makeDog({name:'מילקי',color:0xf4f0e8,color2:0xd9a867,size:.95,speed:3,x:0,z:-80});NM.g.visible=false;
{const tan=mat(0xd9a867,.9);const p=ball(.2,tan,0,1.25,0,NM.body);p.scale.set(1,.4,1.3);const h=ball(.22,tan,0,.12,-.02,NM.head);h.scale.set(1.05,.7,1)}
NM.nav={path:[],repath:0,tx:0,tz:0,stuck:0,giveUp:0};NM.stun=0;NM.state='wander';NM.tx=0;NM.tz=0;NM.carry=null;NM.barkT=0;NM.foam=0;
const NM_SPOTS=[[-4,-6],[4,-6],[-4,0],[3,2],[-4,6],[0,-3],[0,12],[-4,13],[4,11],[2,-7]];
function nmGo(tx,tz,sp,dt,stop=.4){const r=navStep(NM.g,NM.nav,.33,tx,tz,sp,stop,dt,[]);NM.walk+=r.step*14;if(r.step>.001&&NM.nav.path[0]){const a=Math.atan2(NM.nav.path[0][0]-NM.g.position.x,NM.nav.path[0][1]-NM.g.position.z);NM.g.rotation.y+=Math.atan2(Math.sin(a-NM.g.rotation.y),Math.cos(a-NM.g.rotation.y))*Math.min(1,dt*10)}return r.step}
function nmFleeSpot(){let best=NM_SPOTS[0],bd=-1;for(const s of NM_SPOTS){const d=Math.hypot(s[0]-pos.x,s[1]-pos.z)+Math.random()*2;if(d>bd&&Math.hypot(s[0]-NM.g.position.x,s[1]-NM.g.position.z)>1.5){bd=d;best=s}}return best}
function nmAnim(step,dt){const t=performance.now()/1000;NM.legs.forEach((l,i)=>l.rotation.x=step>.001?Math.sin(NM.walk+(i===0||i===3?0:Math.PI))*.8:0);NM.body.position.y=step>.001?Math.abs(Math.sin(NM.walk))*.06:0;NM.tail.rotation.z=Math.sin(t*(NM.stun>0?3:14))*.6;
 NM.g.rotation.z=NM.stun>0?Math.sin(t*12)*.15:0}
function nmSay(t,d=1.8){sayText(NM.b,t,d,'say',true)}
function nmStun(t=1.6,line){NM.stun=t;nmSay(line||pick(['😵 אוי!','😵 בונק!','😵 כפכף?!']),1.4);if(window.JUICE_READY)pow('בונק!',NM.g.position.x,1.6,NM.g.position.z)}
// thrown slippers
const THROWN=[];for(let i=0;i<4;i++){const g=new THREE.Group();scene.add(g);box(.3,.05,.13,mat(0x1d1d1f,.6),0,0,0,g);box(.14,.04,.15,mat(0xeeeeea),-.03,.04,0,g);g.visible=false;THROWN.push({g,v:new THREE.Vector3(),life:0})}
let throwCool=0;
function dadThrow(){if(throwCool>0)return;throwCool=.7;const T=THROWN.find(t=>t.life<=0);if(!T)return;_gv.set(pos.x+Math.sin(yaw)*.45+Math.cos(yaw)*.3,1.15+Math.max(0,jumpY),pos.z+Math.cos(yaw)*.45-Math.sin(yaw)*.3);
 T.g.position.copy(_gv);T.v.set(Math.sin(yaw)*10,2,Math.cos(yaw)*10);T.life=1.4;T.g.visible=true;dm.throwAnim=.3;try{playToySound(420,.05,'triangle')}catch(_){}
 if(Math.random()<.4)sayText(dadB,pick(['קח כפכף!','מילקיייי!','תחזיר את זה!','זה בשביל העוף!']),1.2,'say',true)}
function updateThrown(dt){throwCool=Math.max(0,throwCool-dt);for(const T of THROWN){if(T.life<=0)continue;T.life-=dt;T.v.y-=12*dt;T.g.position.addScaledVector(T.v,dt);T.g.rotation.y+=dt*14;T.g.rotation.z+=dt*9;
 if(NM.g.visible&&NM.stun<=0&&Math.hypot(T.g.position.x-NM.g.position.x,T.g.position.z-NM.g.position.z)<.8&&T.g.position.y<1.7){T.life=0;T.g.visible=false;dm.hits=(dm.hits||0)+1;nmStun();if(dm.m&&dm.m.onHit)dm.m.onHit()}
 if(T.g.position.y<.03||!walkable(T.g.position.x,T.g.position.z,.05)){T.life=0;T.g.visible=false}if(T.life<=0)T.g.visible=false}}
// ---------- the player-dad ----------
let dSit=false,dWalk=0;
function dadPlayFrame(dt){
 dad.visible=true;dog.visible=false;NM.g.visible=true;
 if(dSit){pos.set(ARMCHAIR.x,0,ARMCHAIR.z+.08);curSpeed=0;yaw=Math.atan2(6.3-ARMCHAIR.x,1.2-ARMCHAIR.z);if(keys.KeyW||keys.KeyS||(stick.active&&stick.mag>.4))dadStand()}
 dad.position.set(pos.x,Math.max(0,jumpY)-.42*dadSitBlend,pos.z);
 if(rag.active){dad.quaternion.copy(dog.quaternion);dad.position.y=Math.max(0,rag.y)}else dad.rotation.set(0,yaw,0);
 dadSitBlend+=((dSit?1:0)-dadSitBlend)*Math.min(1,dt*6);const sp=lastDogSpeed;dWalk+=sp*dt*2.2;const t=performance.now()/1000,w=sp>.3&&grounded;
 dadArms.forEach((a,i)=>{const g=i===1&&dm.throwAnim>0?-2.6:0;a.rotation.x+=((w?Math.sin(dWalk+(i?Math.PI:0))*.55:Math.sin(t*1.4+i)*.05)+g-a.rotation.x)*Math.min(1,dt*10)});
 dadLegs.forEach((l,i)=>{const tg=(w?Math.sin(dWalk+(i?0:Math.PI))*.55:0)-1.45*dadSitBlend;l.rotation.x+=(tg-l.rotation.x)*Math.min(1,dt*10)});
 if(w)dad.position.y+=Math.abs(Math.sin(dWalk))*.05;dm.throwAnim=Math.max(0,(dm.throwAnim||0)-dt);
 updateFace(dadFace,dm.sleep?'sleep':sp>4?'shout':dm.happy>0?'love':'smile',dt);dm.happy=Math.max(0,(dm.happy||0)-dt);
}
function dadSitDown(){if(Math.hypot(pos.x-ARMCHAIR.x,pos.z-ARMCHAIR.z)>2.2)return;if(NM.onChair){sayText(dadB,'מילקי! זה הכיסא שלי!',1.6,'say',true);return}dSit=true;thought(dadB,'😌',1.4,true)}
function dadStand(){dSit=false;dm.sleep=false;pos.set(SEAT_APPROACH.x,0,SEAT_APPROACH.z)}
const nearNM=(r=1.5)=>NM.g.visible&&Math.hypot(pos.x-NM.g.position.x,pos.z-NM.g.position.z)<r;
CTX_HOOKS.act.unshift(()=>{if(!DADP)return null;const h=dm.m&&dm.m.act&&dm.m.act();if(h)return h;
 if(dSit)return {i:'🩴',l:'לזרוק כפכף',on:throwCool>0?0:1,fn:dadThrow};
 if(nearNM(1.5))return {i:'❤️',l:'ליטוף',on:1,fn:()=>{dm.happy=2;thought(dadB,'❤️',1.4,true);nmSay(pick(['🥰','❤️ אבא!','👅']),1.2);if(dm.m&&dm.m.onPet)dm.m.onPet()}};
 return {i:'🩴',l:'לזרוק כפכף',on:throwCool>0?0:1,fn:dadThrow}});
CTX_HOOKS.grab.unshift(()=>{if(!DADP)return null;if(dSit)return {i:'🧍',l:'לקום',on:1,fn:dadStand};if(Math.hypot(pos.x-ARMCHAIR.x,pos.z-ARMCHAIR.z)<2.2)return {i:'💺',l:'לשבת',on:NM.onChair?0:1,fn:dadSitDown};
 if(nearNM(1.4)&&NM.stun<=0)return {i:'🤚',l:'לתפוס!',on:1,fn:()=>{if(dm.m&&dm.m.onCatch)dm.m.onCatch();else{nmStun(1,'😳 תפסת אותי!');}}};return {i:'🤚',l:'לתפוס',on:0,fn:()=>{}}});
// ---------- missions ----------
const dm={i:-1,t:0,m:null,hits:0,over:false};
const fleeOrWander=(dt,sp=3.2,fearR=4)=>{const d=Math.hypot(pos.x-NM.g.position.x,pos.z-NM.g.position.z);if(d<fearR){if(NM.state!=='flee'||Math.hypot(NM.tx-NM.g.position.x,NM.tz-NM.g.position.z)<.6){const s=nmFleeSpot();NM.tx=s[0];NM.tz=s[1];NM.state='flee'}return nmGo(NM.tx,NM.tz,sp,dt)}
 if(NM.state!=='wander'||Math.hypot(NM.tx-NM.g.position.x,NM.tz-NM.g.position.z)<.6){const s=pick(NM_SPOTS);NM.tx=s[0];NM.tz=s[1];NM.state='wander'}return nmGo(NM.tx,NM.tz,1.6,dt)};
const carrySlipper=on=>{if(on){if(slipper.parent)slipper.parent.remove(slipper);NM.head.add(slipper);slipper.position.set(0,-.2,.4);slipper.rotation.set(0,Math.PI/2,0);slipperState='nm'}else{if(slipper.parent)slipper.parent.remove(slipper);scene.add(slipper);slipper.position.copy(slipperHome);slipper.rotation.set(0,0,0);slipperState='floor'}};
const REMOTE_SPOTS=[[2,0,13.0],[-4.8,0,-6.6],[-6,0,-35]];
const DAD_MISSIONS=[
 {t:'הכפכף נעלם',icon:'🩴',sub:'לתפוס את מילקי',par:45,intro:'🩴 מילקי גנב את הכפכף! תפוס אותו, או תפגע בו עם הכפכף השני',
  setup:()=>{NM.g.position.set(0,0,-4);carrySlipper(true);nmSay('😼 הכפכף שלי עכשיו!',2)},
  update:dt=>{if(NM.stun>0)return;return void fleeOrWander(dt,3.4)},
  onHit:()=>{dm.win=1},onCatch:()=>{dm.win=1},done:dt=>dm.win,hint:()=>'🩴 תפוס את מילקי (כפתור תפיסה) או זרוק כפכף (כפתור פעולה)',target:()=>NM.g.position,
  end:()=>{carrySlipper(false);nmSay('😇 מה? אני? סתם החזקתי לך אותו',2.2)}},
 {t:'איפה השלט?',icon:'📺',sub:'למצוא ולהדליק',par:70,intro:'📺 המשחק מתחיל! השלט נעלם. תמצא אותו, תדליק, ותשב בכורסה',
  setup:()=>{const r=extras.find(p=>p.kind==='remote');const s=pick(REMOTE_SPOTS);r.g.position.set(s[0],0,s[2]);r.vx=r.vz=0;dm.rem=r;dm.tvOn=false;NM.g.position.set(-3,0,3);tvOn=false;tvGlow.material.opacity=0},
  update:dt=>{fleeOrWander(dt,2.5,2)},act:()=>!dm.tvOn&&dm.rem&&Math.hypot(pos.x-dm.rem.g.position.x,pos.z-dm.rem.g.position.z)<1.5?{i:'📺',l:'להדליק!',on:1,fn:()=>{dm.tvOn=true;toggleTelevision();if(!tvOn)toggleTelevision();sayText(dadB,'יש!!! עכשיו לכורסה!',1.6,'say',true);dm.rem.g.position.copy(dm.rem.home)}}:null,
  done:dt=>dm.tvOn&&dSit&&(dm.sitT=(dm.sitT||0)+dt)>2,hint:()=>dm.tvOn?'💺 לשבת בכורסה (כפתור תפיסה ליד הכורסה)':'📺 חפש את השלט: אולי במטבח, ליד הספה או בחצר...',target:()=>dm.tvOn?v3(ARMCHAIR.x,0,ARMCHAIR.z):null},
 {t:'הכורסה שלי!',icon:'💺',sub:'לגרש ולשבת 10 שניות',par:55,intro:'💺 מילקי תפס לך את הכורסה! תגרש אותו עם כפכף ותשב 10 שניות',
  setup:()=>{NM.onChair=true;NM.g.position.set(ARMCHAIR.x,.68,ARMCHAIR.z);dm.sitT=0;nmSay('😎 הכורסה תפוסה',2)},
  update:dt=>{if(NM.onChair){NM.g.position.set(ARMCHAIR.x,.68,ARMCHAIR.z);NM.g.rotation.y=Math.PI*1.2;if(Math.random()<dt*.2)nmSay(pick(['😎','💤 נוח פה','🥱']),1.2);return}
   if(NM.stun>0)return;if(!dSit&&Math.random()<dt*.08&&!NM.going){NM.going=true;nmSay('😏 הכורסה!',1.2)}if(NM.going&&!dSit){nmGo(SEAT_APPROACH.x,SEAT_APPROACH.z-.2,2.4,dt);if(Math.hypot(NM.g.position.x-SEAT_APPROACH.x,NM.g.position.z-SEAT_APPROACH.z)<.6){NM.onChair=true;NM.going=false}}else fleeOrWander(dt,2.8,2.5);if(dSit)NM.going=false},
  onHit:()=>{if(NM.onChair){NM.onChair=false;NM.g.position.set(SEAT_APPROACH.x+.6,0,SEAT_APPROACH.z-.6);NM.nav.path=[];nmSay('😤 טוב טוב!',1.4)}},
  done:dt=>{if(dSit)dm.sitT+=dt;holdShow('dadSitHold',dm.sitT,10);return dm.sitT>=10},hint:()=>NM.onChair?'🩴 זרוק כפכף על מילקי שעל הכורסה':'💺 שב בכורסה 10 שניות',target:()=>v3(ARMCHAIR.x,.6,ARMCHAIR.z),end:()=>{NM.onChair=false;NM.going=false}},
 {t:'מטווח כפכפים',icon:'🎯',sub:'5 פגיעות ב־60 שניות',par:30,limit:60,intro:'🎯 מילקי רץ כמו משוגע. 5 פגיעות עם כפכף!',
  setup:()=>{dm.hits=0;NM.g.position.set(0,0,-3)},update:dt=>{if(NM.stun>0)return;fleeOrWander(dt,3.6,5)},done:dt=>dm.hits>=5,hint:()=>'🎯 פגיעות '+dm.hits+'/5 · כוון את אבא אל מילקי וזרוק',target:()=>NM.g.position},
 {t:'לשמור על העוף',icon:'🍗',sub:'30 שניות',par:30,limit:30,surviveWin:true,intro:'🍗 העוף על השולחן. מילקי רעב. תחזיק 30 שניות!',
  setup:()=>{chicken.visible=true;chicken.userData.legs.forEach(l=>l.visible=true);dm.stolen=0;NM.g.position.set(-4,0,-4);pos.set(2,0,10)},
  update:dt=>{if(NM.stun>0)return;const d=nmGo(DTABLE.x,DTABLE.z-.9,2.6,dt,.2);if(Math.hypot(NM.g.position.x-DTABLE.x,NM.g.position.z-DTABLE.z+.9)<.5){const l=chicken.userData.legs.find(l=>l.visible);if(l){l.visible=false;dm.stolen++;nmSay('😋 נום!',1.4);const s=nmFleeSpot();NM.g.position.set(s[0],0,s[1]);NM.nav.path=[]}}},
  lose:()=>dm.stolen>=2,hint:()=>'🍗 אל תיתן לו להגיע לשולחן! נגנבו '+dm.stolen+'/2',target:()=>NM.g.position,stars:()=>dm.stolen===0?3:2,end:()=>{chicken.visible=false}},
 {t:'תנומת צהריים',icon:'😴',sub:'לישון 25 שניות',par:45,intro:'😴 אבא רוצה לישון. מילקי רוצה לנבוח. תישן 25 שניות בכורסה!',
  setup:()=>{dm.sleepT=0;dm.wakes=0;NM.g.position.set(-4,0,-6);NM.barkT=4},
  update:dt=>{if(NM.stun>0){NM.going=false;return}NM.barkT-=dt;if(NM.barkT<=0&&!NM.going){NM.going=true}
   if(NM.going){nmGo(ARMCHAIR.x-1.6,ARMCHAIR.z-1,2.2,dt);if(Math.hypot(NM.g.position.x-ARMCHAIR.x+1.6,NM.g.position.z-ARMCHAIR.z+1)<.7){nmSay('🗣️ וואף!!! וואף!!!',1.4);if(dm.sleep){dm.wakes++;dm.sleep=false;dm.sleepT=Math.max(0,dm.sleepT-5);sayText(dadB,'מה?! מי?! ...מילקי!!!',1.6,'say',true)}NM.going=false;NM.barkT=5+Math.random()*3;const s=nmFleeSpot();NM.tx=s[0];NM.tz=s[1]}}else fleeOrWander(dt,2.4,1.5)},
  onHit:()=>{NM.going=false;NM.barkT=5},done:dt=>{if(dSit){dm.sleep=true;dm.sleepT+=dt;if(Math.random()<.01)sayText(dadB,pick(DAD_NAP),2,'think')}else dm.sleep=false;holdShow('dadSleepHold',dm.sleepT,25);return dm.sleepT>=25},
  hint:()=>dSit?'😴 ישן... זרוק כפכף כשמילקי מתקרב לנבוח':'💺 שב בכורסה כדי לישון',target:()=>dSit?(NM.going?NM.g.position:null):v3(ARMCHAIR.x,.6,ARMCHAIR.z),stars:()=>dm.wakes===0?3:dm.wakes<=2?2:1},
 {t:'לנקות את הבלגן',icon:'🧹',sub:'להחזיר 8 חפצים',par:70,limit:120,intro:'🧹 מילקי הפך את הסלון. תחזיר 8 חפצים למקום (תעבור לידם)',
  setup:()=>{dm.clean=0;dm.mess=[];const pool=[...chaosProps,...extras.filter(p=>['bottle','book','shoe','duck'].includes(p.kind))];for(const p of pool){const s=pick(NM_SPOTS.filter(s=>s[1]<8));p.g.position.set(s[0]+(Math.random()-.5)*2,0,s[1]+(Math.random()-.5)*2);dm.mess.push(p)}NM.g.position.set(0,0,0);NM.messT=10},
  update:dt=>{if(NM.stun>0)return;fleeOrWander(dt,3,2.5);NM.messT-=dt;if(NM.messT<=0){NM.messT=9;const p=pick(dm.mess.filter(p=>p.g.position.distanceTo(p.home)<.5));if(p){const s=pick(NM_SPOTS.filter(s=>s[1]<8));p.g.position.set(s[0],0,s[1]);nmSay('😈 אופס',1.2)}}
   for(const p of dm.mess){if(p.g.position.distanceTo(p.home)>.6&&Math.hypot(pos.x-p.g.position.x,pos.z-p.g.position.z)<1.1){p.g.position.copy(p.home);p.g.rotation.set(0,0,0);p.vx=p.vz=0;dm.clean++;if(window.JUICE_READY)pow('✨',p.home.x,1.2,p.home.z);addScore(100,'סודר!')}}},
  done:dt=>dm.clean>=8,hint:()=>'🧹 סודרו '+dm.clean+'/8 · תעבור ליד חפץ מפוזר',target:()=>{let b=null,bd=1e9;for(const p of dm.mess){if(p.g.position.distanceTo(p.home)<.6)continue;const d=Math.hypot(pos.x-p.g.position.x,pos.z-p.g.position.z);if(d<bd){bd=d;b=p.g.position}}return b}},
 {t:'מנגל עם השכן',icon:'🔥',sub:'לדבר 15 שניות',par:40,intro:'🔥 השכן מזמין לקבב! תעמוד לידו 15 שניות ואל תיתן למילקי לגנוב',
  setup:()=>{dm.chat=0;NM.g.position.set(-5,0,-14);pos.set(0,0,-12)},
  update:dt=>{if(NM.stun>0)return;nmGo(kebabHome.x-.9,kebabHome.z+.6,2.2,dt,.2);if(Math.hypot(NM.g.position.x-kebabHome.x+.9,NM.g.position.z-kebabHome.z-.6)<.5)dm.stole=1},
  onHit:()=>{const s=[[-14,-14],[14,-14],[-12,-25]];const p=pick(s);NM.g.position.set(p[0],0,p[1]);NM.nav.path=[]},
  done:dt=>{if(Math.hypot(pos.x-neighbor.g.position.x,pos.z-neighbor.g.position.z)<2.6){dm.chat+=dt;if(Math.random()<.008)sayText(nbB,pick(['עוד שיפוד?','הבן שלך גדל יפה!','הכלב שלך... מסתכל על הקבב']),2,'say')}holdShow('dadChatHold',dm.chat,15);return dm.chat>=15},
  lose:()=>dm.stole,hint:()=>'🔥 תעמוד ליד השכן · זרוק כפכף כשמילקי מתקרב לקבב',target:()=>NM.g.position.distanceTo(kebabHome)<6?NM.g.position:neighbor.g.position},
 {t:'אמבטיה למילקי',icon:'🛁',sub:'לתפוס 3 פעמים',par:45,limit:75,intro:'🛁 יום רחצה! תתפוס את מילקי 3 פעמים כדי לקרצף אותו',
  setup:()=>{dm.caught=0;NM.g.position.set(0,0,0);NM.foam=0},update:dt=>{if(NM.stun>0)return;fleeOrWander(dt,3+dm.caught*.4,5)},
  onCatch:()=>{dm.caught++;NM.stun=1.2;nmSay(pick(['😱 לא!!! קצף!','🫧 אני ריחני?!','😤 עוד פעם?!']),1.6);for(let i=0;i<12;i++)emit(NM.g.position.x,1,NM.g.position.z,(Math.random()-.5)*3,2,(Math.random()-.5)*3,'foam',.8);const s=nmFleeSpot();setTimeout(()=>{NM.g.position.set(s[0],0,s[1]);NM.nav.path=[]},900)},
  done:dt=>dm.caught>=3,hint:()=>'🛁 תפוס את מילקי (כפתור תפיסה) · '+dm.caught+'/3',target:()=>NM.g.position},
 {t:'מי הכלב הכי טוב?',icon:'❤️',sub:'הסיום',par:40,intro:'❤️ מילקי עצוב ומתחבא. תשב בכורסה, תקרא לו ותלטף אותו',
  setup:()=>{dm.called=0;dm.pet=0;NM.g.position.set(-5.2,0,-7);NM.state='hide';nmSay('🥺',2)},
  update:dt=>{if(dm.called<3){NM.g.rotation.y=0.6;return}if(!dm.near){nmGo(ARMCHAIR.x-.9,ARMCHAIR.z-.9,1.8,dt,.2);if(Math.hypot(NM.g.position.x-ARMCHAIR.x+.9,NM.g.position.z-ARMCHAIR.z+.9)<.6){dm.near=true;nmSay('🥺 ...אבא?',1.6)}}},
  act:()=>{if(dSit&&dm.called<3)return {i:'📣',l:'לקרוא למילקי',on:1,fn:()=>{dm.called++;sayText(dadB,['מילקי?','מילקי! בוא!','מילקי שלי... בוא לאבא'][dm.called-1],1.8,'say',true);nmSay(['🥺','🥺 ...','🐕 !!!'][dm.called-1],1.2)}};
   if(dm.near&&Math.hypot(pos.x-NM.g.position.x,pos.z-NM.g.position.z)<2.4)return {i:'❤️',l:'ליטוף',on:1,fn:()=>{dm.pet++;dm.happy=2;thought(dadB,'❤️',1.2,true);nmSay(pick(['🥰','❤️','👅 ליק']),1);for(let i=0;i<4;i++)emit(NM.g.position.x,1.6,NM.g.position.z,(Math.random()-.5),1.5,(Math.random()-.5),'foam',.8)}};return null},
  done:dt=>dm.pet>=5,hint:()=>dm.called<3?(dSit?'📣 לקרוא למילקי ('+dm.called+'/3)':'💺 שב בכורסה'):dm.near?'❤️ ליטוף '+dm.pet+'/5':'🐕 מילקי בדרך...',target:()=>dm.called<3?(dSit?null:v3(ARMCHAIR.x,.6,ARMCHAIR.z)):NM.g.position,
  end:()=>{speakDad('מי הכלב הכי טוב בעולם? אתה. תמיד אתה.');nmSay('❤️❤️❤️',2.4)}}
];
Object.assign(_holdLabels,{dadSitHold:'💺 יושב בכורסה...',dadSleepHold:'😴 ישן...',dadChatHold:'🔥 מדבר עם השכן...'});
function dadMissionStart(i){dm.i=i;dm.m=DAD_MISSIONS[i];dm.t=0;dm.hits=0;dm.over=false;dm.win=0;dm.stole=0;dm.sitT=0;dm.near=false;NM.stun=0;NM.onChair=false;NM.going=false;NM.nav.path=[];
 document.querySelector('#overlay').style.display='none';setDadPlay(true);startGame();pos.set(2,0,4);dadStand();dSit=false;
 showBanner(dm.m.intro);dm.m.setup()}
function dadMissionEnd(win){if(dm.over)return;dm.over=true;evtPill.hidden=true;const m=dm.m;if(m.end)m.end();
 const t=dm.t;let st=win?(m.stars?m.stars():(t<=m.par?3:t<=m.par*1.8?2:1)):0;
 setTimeout(()=>epFinish(win,st,win?['⏱️ '+fmtTime(t)+(m.surviveWin?'':' (ל־3 כוכבים: עד '+fmtTime(m.par)+')'),'⭐ ניקוד '+score.toLocaleString('he-IL')]:['😅 ננסה שוב?'],win?m.icon+' '+m.t+' — הצלחה!':'😩 מילקי ניצח הפעם...'),win?1600:900);
 if(win&&window.JUICE_READY){slowMo(.5);pow('יש!!!',pos.x,3,pos.z,true)}}
function updateDadMission(dt){if(!dm.m||dm.over)return;dm.t+=dt;const m=dm.m;NM.stun=Math.max(0,NM.stun-dt);
 const step0=NM.g.position.clone();m.update(dt);const step=NM.g.position.distanceTo(step0);nmAnim(step,dt);
 evtPill.hidden=false;const lim=m.limit?' · '+Math.max(0,Math.ceil(m.limit-dm.t)):'';const l=m.icon+' '+(dm.i+1)+'/10: '+m.t+lim;if(evtPill.textContent!==l)evtPill.textContent=l;
 if(m.lose&&m.lose()){dadMissionEnd(false);return}
 if(m.surviveWin&&dm.t>=m.limit){dadMissionEnd(true);return}
 if(m.done&&!m.surviveWin&&m.done(dt)){dadMissionEnd(true);return}
 if(m.limit&&!m.surviveWin&&dm.t>=m.limit)dadMissionEnd(false)}
// free-roam dad in the open world: Milky just does Milky things
function updateDadFree(dt){NM.stun=Math.max(0,NM.stun-dt);const p0=NM.g.position.clone();if(NM.stun<=0)fleeOrWander(dt,3,3);nmAnim(NM.g.position.distanceTo(p0),dt);if(Math.random()<dt*.06)nmSay(pick(['🐕','😼','🦴','👅']),1.2)}
// ---------- mode plumbing ----------
const DAD_EP={id:'dad',icon:'👨',title:'לשחק כאבא: 10 משימות',reward:'לפתוח את אבא בעולם הפתוח',rewardDone:'אבא נפתח! בעולם הפתוח לוחצים 🔄 כדי להחליף בין מילקי לאבא',
 levels:DAD_MISSIONS.map((m,i)=>({id:'m'+(i+1),title:m.t,icon:m.icon,sub:m.sub})),start:dadMissionStart,quit:()=>setDadPlay(false)};
epRegister(DAD_EP);
function setDadPlay(on){if(on===DADP&&on)return;DADP=on;window.DADP=on;
 if(on){if(HUMAN){HUMAN=false;hApply(false)}if(ZOMBIE){ZOMBIE=false;zApply(false)}if(DETECT){DETECT=false;dApply(false)}OPEN_WORLD=true;document.body.classList.toggle('openWorld',true);reset();owApply();
  if(dadSeated)unseatDad();dadState='player';dad.visible=true;NM.g.visible=true;NM.g.position.set(-2,0,-3)}
 else{dm.m=null;dSit=false;dadSitBlend=0;NM.g.visible=false;NM.g.position.set(0,0,-80);dog.visible=true;dadState='rest';dad.position.set(4.1,0,5.7);dad.rotation.set(0,0,0);dad.quaternion.identity();for(const T of THROWN){T.life=0;T.g.visible=false}if(slipperState==='nm')carrySlipper(false);evtPill.hidden=true}
 document.body.classList.toggle('dadPlay',DADP);charLabel()}
// character switch chip (open world, after Dad is unlocked)
const swapChip=document.createElement('button');swapChip.id='swapChip';swapChip.className='chip';swapChip.type='button';swapChip.textContent='🔄 🐕→👨';swapChip.title='החלפת דמות';
document.getElementById('menuBtn').after(swapChip);swapChip.hidden=true;swapChip.style.display='none';
// playable characters in the open world; each later character module pushes itself here
const CHARS=[{id:'milky',icon:'🐕',name:'מילקי',ok:()=>true,active:()=>!CHARS.some(c=>c.id!=='milky'&&c.active()),on:()=>{},off:()=>{},hello:'🐕 חזרת להיות מילקי'},
 {id:'dad',icon:'👨',name:'אבא',ok:()=>epComplete('dad'),active:()=>DADP,on:()=>{dm.m=null;setDadPlay(true);dm.m=null},off:()=>setDadPlay(false),hello:'👨 עכשיו אתה אבא! 🩴 זרוק כפכפים · 💺 שב בכורסה'}];
function charCur(){return CHARS.find(c=>c.id!=='milky'&&c.active())||CHARS[0]}
function charNext(){const av=CHARS.filter(c=>c.ok());const cur=charCur();return av[(av.indexOf(cur)+1)%av.length]}
function charLabel(){const a=charCur(),b=charNext();swapChip.textContent='🔄 '+a.icon+'→'+b.icon}
function charSwitch(){const cur=charCur(),nx=charNext();if(nx===cur)return;cur.off();nx.on();charLabel();showBanner(nx.hello)}
swapChip.addEventListener('click',charSwitch);
function swapRefresh(){const h=!(CHARS.filter(c=>c.ok()).length>1&&OPEN_WORLD&&!ZOMBIE&&!HUMAN&&!DETECT&&!(dm.m&&!dm.over)&&!(window.PM&&PM.m&&!PM.over));if(swapChip.hidden!==h){swapChip.hidden=h;swapChip.style.display=h?'none':'';if(!h)charLabel()}}
// hooks
const _bub=sayText;sayText=function(b,text,dur,kind,force){if(DADP&&(b===milkyB))b=dadB;return _bub(b,text,dur,kind,force)};
const _thd=thought;thought=function(b,e,d,f){if(DADP&&b===milkyB)b=dadB;return _thd(b,e,d,f)};
const _nth5=nextTaskHint;nextTaskHint=function(){if(!DADP)return _nth5();if(dm.m&&!dm.over)return dm.m.hint();return '👨 אבא · 🩴 כפכף · 💺 כורסה · ❤️ ליטוף'};
const _ct5=currentTarget;currentTarget=function(){if(!DADP)return _ct5();if(!guideOn||!dm.m||dm.over)return null;const p=dm.m.target&&dm.m.target();return p&&Math.hypot(p.x-pos.x,p.z-pos.z)>2?p:null};
const _uow5=updateOpenWorld;updateOpenWorld=function(dt){swapRefresh();if(!DADP)return _uow5(dt);if(!day.finished)owApply();for(const s of Object.values(OW_MARKS))s.visible=false;
 dadPlayFrame(dt);updateThrown(dt);if(dm.m)updateDadMission(dt);else updateDadFree(dt)};
for(const id of ['start','startOpen','startZombie','startHuman','startDetective','modeSwitch','zSwitch'])document.getElementById(id).addEventListener('click',()=>{if(DADP)setDadPlay(false)},true);
document.getElementById('menuBtn').addEventListener('click',()=>{if(DADP&&dm.m)setDadPlay(false)});
window.addEventListener('keydown',e=>{if(DADP&&['KeyQ','KeyR','KeyX','KeyF'].includes(e.code))e.stopImmediatePropagation()},true);
window.DAD_READY=true;
