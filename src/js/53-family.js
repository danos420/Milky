// ===== Family: the two older brothers and their kids visit (Friday dinner, Saturday party) =====
WEEK[5].soon=false;WEEK[5].short='ארוחת שישי';WEEK[5].intro='🍗 יום שישי: האחים והילדים באים לארוחה!';
PHASE_SETS.friday=[
 {name:'בוקר',icon:'🧹',banner:'🧹 מתכוננים לאורחים! אבא מנקה, דני מבשל',tasks:[
  {id:'broom',label:'🧹 לתקוף את המטאטא של אבא',tip:'תתקרב לאבא כשהוא מטאטא'},
  {id:'tablecloth',label:'🧺 למשוך את המפה מהשולחן',tip:'שולחן האוכל במטבח. כפתור פעולה ליד השולחן'},
  {id:'sausage',label:'🌭 לגנוב נקניקייה מהמקרר',tip:'פתח את המקרר'},
  {id:'waitDoor',label:'🚪 לחכות לאורחים ליד דלת המרפסת',tip:'תעמוד ליד הדלת לחצר'}]},
 {name:'צהריים',icon:'👨‍👩‍👧‍👦',banner:'👨‍👩‍👧‍👦 האורחים הגיעו! הילדים רוצים את מילקי',tasks:[
  {id:'escapeKids',label:'🧒 לברוח מהילדים 20 שניות',tip:'הם מהירים! רוץ'},
  {id:'kidHug',label:'🤗 לתת לילדים לחבק',tip:'תן לילד לתפוס אותך ותעמוד רגע'},
  {id:'slipperBro',label:'🩴 להביא לאח הגדול את הכפכף של אבא',tip:'תפוס כפכף ותשחרר ליד האח עם החולצה הכחולה'},
  {id:'showOff',label:'😂 סלטה מול כולם',tip:'קפיצה כפולה ליד האורחים'}]},
 {name:'ערב',icon:'🍗',banner:'🍗 ארוחת שישי! כולם סביב השולחן',tasks:[
  {id:'underTable',label:'🪑 לחכות מתחת לשולחן',tip:'תעמוד ליד שולחן האוכל. משהו ייפול'},
  {id:'tableSteal',label:'🍗 לגנוב משהו מהשולחן',tip:'קפוץ על השולחן'},
  {id:'begAll',label:'🥺 "שב" יפה מול שלושה אנשים',tip:'כפתור 🦴 על "שב" ליד כל אחד'},
  {id:'sleepDad',label:'😴 להירדם ליד אבא',tip:'תעמוד ליד אבא בשקט'}]}
];
// ----- guests -----
const darkHair=c=>h=>{const d=ball(.34,mat(c),0,.1,-.04,h);d.scale.set(1,.62,1.02);ball(.14,mat(c),.25,.02,-.08,h).scale.set(.6,.9,.9);ball(.14,mat(c),-.25,.02,-.08,h).scale.set(.6,.9,.9)};
const BRO1=makePerson({skin:0xc68a62,shirt:0x2f5a8f,pants:0x2f2f33,shoes:0xeeeeee,hair:h=>{darkHair(0x2a2420)(h);const b=ball(.3,mat(0x2a2420),0,-.14,.06,h);b.scale.set(1.05,.55,.95)}});
const BRO2=makePerson({skin:0xc99067,shirt:0x9b3b3b,pants:0x3e5f8a,shoes:0x333333,belly:true,hair:darkHair(0x1f1a17)});
const KID1=makePerson({skin:0xd9a07a,shirt:0xf2c14e,shorts:0x3e5f8a,bareArms:true,shoes:0xe74c3c,hair:darkHair(0x3a2a20)});
const KID2=makePerson({skin:0xd49b75,shirt:0xe98ab0,dress:0xe98ab0,pants:0xd49b75,shoes:0xffffff,hair:h=>{darkHair(0x4a3020)(h);ball(.12,mat(0x4a3020),0,.05,-.32,h)}});
KID1.g.scale.setScalar(.58);KID2.g.scale.setScalar(.54);
const GUESTS=[{P:BRO1,r:.38,name:'האח הגדול',kid:false,b:null},{P:BRO2,r:.4,name:'האח',kid:false,b:null},{P:KID1,r:.26,name:'הילד',kid:true,b:null},{P:KID2,r:.26,name:'הילדה',kid:true,b:null}];
GUESTS.forEach(g=>{g.b=makeBubble(g.P.g,g.kid?1.8:3.05);g.P.g.visible=false;g.P.g.position.set(0,0,-80);g.tx=0;g.tz=0;g.mood='smile';g.hugT=0});
const KID_LINES=['מילקייי! בוא!!','אני אתפוס אותך!','הוא כזה רך!!','אפשר לקחת אותו הביתה?','חחחח הוא מלקק לי!'];
const BRO_LINES=['מה קורה מילקי, אח שלי','אבא, הכלב הזה השמין?','דני, מה בישלת?','הכלב הזה יותר מפונק ממני'];
const fam={on:false,day:'',phase:-1,kidChase:false,escape:0,hugT:0,waitT:0,underT:0,sleepT:0,begged:new Set(),cloth:true,clothT:0,dropT:0,talkT:5};
const DINNER_SPOTS=[[2,0,10.6],[2,0,13.0],[.6,0,10.7],[3.4,0,13.0]],DAD_DINNER={x:3.5,z:10.7},DANI_DINNER={x:.5,z:13.0};
function guestsShow(on){GUESTS.forEach((g,i)=>{g.P.g.visible=on;if(on){g.P.g.position.set(-1.6+i*.8,0,-11.2);g.P.nav.path=[];g.tx=g.P.g.position.x;g.tz=-6}else g.P.g.position.set(0,0,-80)})}
// table dressing for dinner + the tablecloth Milky pulls
const cloth=new THREE.Group();cloth.position.set(DTABLE.x,.805,DTABLE.z);scene.add(cloth);
{box(2.1,.015,1.4,mat(0xf3efe4,.9),0,0,0,cloth);box(2.1,.4,.015,mat(0xf3efe4,.9),0,-.2,.7,cloth);box(2.1,.4,.015,mat(0xf3efe4,.9),0,-.2,-.7,cloth);
 for(const [x,z] of [[-.6,-.35],[.6,-.35],[-.6,.35],[.6,.35]]){cyl(.18,.02,mat(0xffffff,.4),x,.02,z,cloth)}cloth.visible=false}
const dinner=new THREE.Group();dinner.position.set(DTABLE.x,.82,DTABLE.z);scene.add(dinner);
{const ch=ball(.2,mat(0xc77d36,.6),-.2,.12,0,dinner);ch.scale.set(1.3,.8,1);cyl(.34,.03,mat(0xf2efe8,.4),-.2,0,0,dinner);
 const challah=ball(.13,mat(0xd9a557,.7),.45,.08,-.15,dinner);challah.scale.set(2,.9,1);cyl(.2,.1,mat(0x7fb069,.7),.45,.05,.28,dinner);
 for(const [x,z] of [[-.75,-.45],[.75,-.45],[-.75,.45],[.75,.45]])cyl(.17,.02,mat(0xffffff,.4),x,0,z,dinner);dinner.visible=false}
const broom=new THREE.Group();broom.position.set(0,-.78,.1);dad.add(broom);
{cyl(.025,1.5,mat(0xb07a45),0,-.3,.15,broom).rotation.x=.5;const h=box(.4,.12,.18,mat(0xd9b65a),0,-.95,.5,broom);broom.visible=false}
dadArms[1].add(broom);
function familyResetProps(){fam.on=false;fam.phase=-1;fam.kidChase=false;guestsShow(false);cloth.visible=false;cloth.position.set(DTABLE.x,.805,DTABLE.z);cloth.rotation.set(0,0,0);dinner.visible=false;broom.visible=false;
 if(dadState==='dinner'||dadState==='sweep')setDadState('rest');if(daniState==='dinner'){daniState='cook'}}
const _origReset4=bathResetProps;bathResetProps=function(){_origReset4();familyResetProps()};
DAY_HOOKS.friday=(phase,fresh)=>{
 fam.on=true;fam.day='friday';fam.phase=phase;
 if(phase===0){cloth.visible=true;fam.cloth=true;broom.visible=true;fam.escape=0;fam.begged.clear();if(dadSeated)unseatDad();setDadState('sweep');
  if(started)setTimeout(()=>{if(fam.on&&fam.phase===0){speakDad('האחים שלך מגיעים! מילקי, תתנהג יפה... מה אני אומר, אתה אף פעם לא מתנהג יפה');setTimeout(()=>sayDani('אני עושה את השניצל של סבתא!'),1800)}},1200)}
 if(phase===1){broom.visible=false;setDadState('rest');guestsShow(true);fam.kidChase=true;
  setTimeout(()=>{if(!fam.on)return;sayText(GUESTS[2].b,'מילקייייי!!!',2,'say',true);sayText(GUESTS[0].b,'שבת שלום! איפה האוכל?',2.2,'say',true)},600)}
 if(phase===2){fam.kidChase=false;dinner.visible=true;setDadState('dinner');daniState='dinner';daniAction=0;GUESTS.forEach((g,i)=>{g.tx=DINNER_SPOTS[i][0];g.tz=DINNER_SPOTS[i][2];g.P.nav.path=[]});
  sayDani('ארוחה מוכנה!! כולם לשולחן!');setTimeout(()=>sayText(GUESTS[1].b,'וואו דני, אתה תותח',2,'say',true),1500)}
};
function pullCloth(){if(!fam.cloth)return;fam.cloth=false;fam.clothT=1;dayEvent('tablecloth');addScore(300,'מפה עפה!');SFX.crash&&SFX.crash();chaosShake=Math.max(chaosShake,.3);
 if(window.JUICE_READY){pow('קראש!!',DTABLE.x,1.6,DTABLE.z,true);slowMo(.4)}for(let i=0;i<14;i++)emit(DTABLE.x+(Math.random()-.5)*1.6,1,DTABLE.z+(Math.random()-.5),(Math.random()-.5)*3,2+Math.random()*2,(Math.random()-.5)*3,'foam',.7);
 sayDani('המפה החגיגית!!! מילקי!!!');setTimeout(()=>speakDad('חחח... טוב, ממילא היה צריך לכבס'),1200)}
function guestNear(maxD){let best=null,bd=maxD;for(const g of GUESTS){if(!g.P.g.visible)continue;const d=Math.hypot(pos.x-g.P.g.position.x,pos.z-g.P.g.position.z);if(d<bd){bd=d;best=g}}return best}
function familyFlip(){if(fam.on&&fam.phase>=1&&guestNear(5.5)){dayEvent('showOff');GUESTS.forEach(g=>{if(g.P.g.visible)thought(g.b,'👏',1.6,true)});sayText(GUESTS[3].b,'עוד פעם!!! עוד פעם!!!',2,'say',true)}}
function updateGuests(dt){
 const t=performance.now()/1000;fam.talkT-=dt;
 // keep guests from merging into one another
 for(let i=0;i<GUESTS.length;i++)for(let j=i+1;j<GUESTS.length;j++){const A=GUESTS[i],B=GUESTS[j];if(!A.P.g.visible||!B.P.g.visible)continue;const a=A.P.g.position,b=B.P.g.position,dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz),m=A.r+B.r+.08;
  if(d<m){const k=(m-d)/2/(d||1),nx=d?dx:1,nz=d?dz:0;const ax=a.x-nx*k,az=a.z-nz*k,bx=b.x+nx*k,bz=b.z+nz*k;if(dadFree(ax,az,A.r*.8)){a.x=ax;a.z=az}if(dadFree(bx,bz,B.r*.8)){b.x=bx;b.z=bz}}}
 for(const g of GUESTS){
  if(!g.P.g.visible)continue;const P=g.P,o=P.g.position;let tx=g.tx,tz=g.tz,sp=fam.phase===2?2.3:1.8,stop=.35;
  const dm=Math.hypot(pos.x-o.x,pos.z-o.z);
  if(g.kid&&fam.kidChase){if(g.hugT>0){g.hugT-=dt;tx=o.x;tz=o.z;sp=0}else{const ka=(g===GUESTS[2]?0:Math.PI)+t*.4;tx=pos.x+Math.cos(ka)*.8;tz=pos.z+Math.sin(ka)*.8;sp=2.9;stop=.3;
   if(dm<.95&&jumpY<.6){g.hugT=2.5;fam.hugT=0;sayText(g.b,pick(['תפסתי!!! 🤗','חיבוק!!!','אני לא עוזב אותך!']),2,'say',true);milkyThought('😳',1.2,true);fam.escape=Math.max(0,fam.escape-4)}}}
  else if(!g.kid&&fam.phase===1&&dm<2.4){tx=o.x;tz=o.z;sp=0}
  else if(fam.day==='friday'&&fam.phase===1&&Math.hypot(tx-o.x,tz-o.z)<.6&&Math.random()<dt*.15){const [rx,rz]=randomFreeSpot(-7,7);g.tx=rx;g.tz=rz}
  const r=navStep(P.g,P.nav,g.r*(g.kid?1:1),tx,tz,sp,stop,dt,[]);
  if(r.step>.001&&P.nav.path[0])faceToward(P.g,P.nav.path[0][0],P.nav.path[0][1],dt,7);else if(fam.phase===2&&fam.day==='friday')faceToward(P.g,DTABLE.x,DTABLE.z,dt,4);else if(dm<4)faceToward(P.g,pos.x,pos.z,dt,5);
  animatePerson(P,r.step,dt,{arm:i=>g.hugT>0?-1.4:(!r.step&&dm<2.2&&!g.kid&&i===0?-.6+Math.sin(t*6)*.15:0)});
  updateFace(P.face,g.hugT>0?'love':g.kid?'laugh':dm<2.5?'smile':'neutral',dt);
  if(fam.talkT<=0&&dm<7&&Math.random()<.3){fam.talkT=4+Math.random()*4;sayText(g.b,pick(g.kid?KID_LINES:BRO_LINES),2.2,'say')}
 }
}
function updateFamily(dt){
 if(cloth.visible&&!fam.cloth&&fam.clothT>0){fam.clothT=Math.max(0,fam.clothT-dt*1.6);const k=1-fam.clothT;cloth.position.set(DTABLE.x+k*1.4,.805-.8*k*k,DTABLE.z);cloth.rotation.z=-k*1.2;if(fam.clothT===0)cloth.position.y=.02}
 if(!fam.on)return;
 updateGuests(dt);
 const dd=dad.visible?Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z):99;
 if(fam.day==='friday'){
  if(fam.phase===0){
   if(['rest','watch','wander','sit'].includes(dadState)){if(dadSeated)unseatDad();setDadState('sweep')}
   if(dadState==='sweep'&&dd<1.4&&!day.done.has('broom')){dayEvent('broom');speakDad('זה מטאטא! לא צעצוע! ...טוב, תשחק');thought(dadB,'😂',2,true);if(window.JUICE_READY)pow('גררר!')}
   if(Math.hypot(pos.x+1.2,pos.z+8.1)<1.6&&lastDogSpeed<.3&&grounded&&jumpY<.2){fam.waitT+=dt;holdShow('waitDoor',fam.waitT,2.5);if(fam.waitT>2.5&&!day.done.has('waitDoor')){dayEvent('waitDoor');sayText(milkyB,'🚗 שומע מכונית!!',2.2,'say',true)}}else fam.waitT=0;
  }
  if(fam.phase===1){
   if(fam.kidChase&&!day.done.has('escapeKids')){const anyHug=GUESTS.some(g=>g.kid&&g.hugT>0);if(!anyHug)fam.escape+=dt;if(fam.escape>=20){dayEvent('escapeKids');sayText(GUESTS[2].b,'אי אפשר לתפוס אותו!!',2,'say',true)}
    evtPill.hidden=false;const l='🧒 בורח מהילדים '+Math.floor(fam.escape)+'/20';if(evtPill.textContent!==l)evtPill.textContent=l}
   else if(!(typeof evt!=='undefined'&&evt.cur))evtPill.hidden=true;
   if(GUESTS.some(g=>g.kid&&g.hugT>0&&Math.hypot(pos.x-g.P.g.position.x,pos.z-g.P.g.position.z)<1.4)&&lastDogSpeed<.4){fam.hugT+=dt;holdShow('kidHug',fam.hugT,1.6);if(fam.hugT>1.6&&!day.done.has('kidHug')){dayEvent('kidHug');thought(milkyB,'❤️',2,true);sayText(GUESTS[3].b,'הוא אוהב אותי!!',2,'say',true)}}
   if(slipperState==='floor'&&Math.hypot(slipper.position.x-BRO1.g.position.x,slipper.position.z-BRO1.g.position.z)<1.9&&Math.hypot(slipper.position.x-slipperHome.x,slipper.position.z-slipperHome.z)>.5&&!day.done.has('slipperBro')){
    dayEvent('slipperBro');sayText(GUESTS[0].b,'חחחח אבא! הכלב שלך גונב לך כפכפים?',2.4,'say',true);setTimeout(()=>speakDad('כל יום!!! כל יום!!!'),1200);slipper.position.copy(slipperHome)}
  }
  if(fam.phase===2){
   if(daniState==='cook')daniState='dinner';
   const dt2=Math.hypot(pos.x-DTABLE.x,pos.z-DTABLE.z);
   if(dt2<1.9&&jumpY<.2&&lastDogSpeed<.3){fam.underT+=dt;holdShow('underTable',fam.underT,3);if(fam.underT>3&&!day.done.has('underTable')){dayEvent('underTable');sayText(milkyB,'😋 מישהו הפיל שניצל!',2.2,'say',true);sayText(GUESTS[2].b,'אופס... 😇',1.8,'say',true)}}else fam.underT=0;
   if(jumpY>.7&&dt2<1.1&&!day.done.has('tableSteal')){dayEvent('tableSteal');mouthItem.visible=true;shop.mouthT=6;addScore(400,'גניבה מהשולחן!');sayDani('מילקי!!! רד מהשולחן!!');sayText(GUESTS[1].b,'חחחחח אגדה',1.8,'say',true)}
   if(trainingTime>0&&activeCmd==='שב'){for(const [k,o] of [['bro1',BRO1.g.position],['bro2',BRO2.g.position],['dad',dad.position]])if(!fam.begged.has(k)&&Math.hypot(pos.x-o.x,pos.z-o.z)<2.2){fam.begged.add(k);addActivity('🥺 '+({bro1:'האח הגדול',bro2:'האח',dad:'אבא'})[k]+' נשבר ('+fam.begged.size+'/3)');if(fam.begged.size>=3)dayEvent('begAll')}}
   if(dd<1.7&&lastDogSpeed<.3&&grounded){fam.sleepT+=dt;holdShow('sleepDad',fam.sleepT,3);if(fam.sleepT>3&&!day.done.has('sleepDad')){dayEvent('sleepDad');idleAction='lie';idleClock=0;sayText(milkyB,'💤 בטן מלאה... משפחה...',2.6,'think',true);speakDad('שבת שלום, מילקי שלי')}}else fam.sleepT=0;
  }
 }
}
CTX_HOOKS.act.push(()=>cloth.visible&&fam.cloth&&Math.hypot(pos.x-DTABLE.x,pos.z-DTABLE.z)<1.9&&jumpY<.55?{i:'🧺',l:'משוך מפה!',on:1,fn:pullCloth}:null);
window.FAMILY_READY=true;
loadWeekPhases();renderDay();renderWeek();
