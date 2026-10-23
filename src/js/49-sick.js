// ===== Sick day: dad stuck in the armchair with a cold, Milky is the (very unqualified) nurse =====
WEEK[3].soon=false;WEEK[3].short='אבא חולה';WEEK[3].intro='🤒 יום רביעי: אבא חולה. מילקי האחות הראשית';
PHASE_SETS.sick=[
 {name:'בוקר',icon:'🤒',banner:'🤒 אבא חולה בכורסה. מילקי, תטפל בו!',tasks:[
  {id:'bringSlipper',label:'🩴 להביא לאבא את הכפכף',tip:'תפוס עם P, תשחרר ליד אבא'},
  {id:'tissue',label:'🤧 להביא לאבא טישו',tip:'קופסת הטישו במטבח. תפוס בפה (T)'},
  {id:'warmFeet',label:'🦶 לחמם לאבא את הרגליים',tip:'שכב ליד הכורסה בלי לזוז'},
  {id:'sneezed',label:'💨 לחטוף עיטוש של אבא',tip:'תעמוד מול אבא ותחכה...'}]},
 {name:'צהריים',icon:'🍲',banner:'🍲 דני מכין מרק עוף לאבא',tasks:[
  {id:'soupSteal',label:'🍗 לגנוב עוף מהסיר',tip:'קפוץ על השיש ליד הסיר'},
  {id:'thermo',label:'🌡️ לגנוב את המדחום למיטה',tip:'המדחום על הרצפה ליד הכורסה'},
  {id:'remote',label:'📺 להדליק לאבא טלוויזיה',tip:'משעמם לו. השלט ליד השולחן'},
  {id:'showFlip',label:'🤸 לעשות לאבא הופעה: סלטה',tip:'קפיצה כפולה ליד הכורסה'}]},
 {name:'ערב',icon:'🌙',banner:'🌙 אבא מרגיש קצת יותר טוב',tasks:[
  {id:'shareBowl',label:'🥣 להביא לאבא את הקערה שלך',tip:'הקערה במטבח. תפוס בפה ותביא'},
  {id:'petDad',label:'❤️ לקבל ליטוף מאבא',tip:'תתקרב אליו'},
  {id:'laugh',label:'😂 להצחיק את אבא: נפילה מולו',tip:'נפילה (X) ליד הכורסה'},
  {id:'sofaWatch',label:'📺 לראות טלוויזיה מהספה',tip:'טלוויזיה דולקת + מילקי על הספה'}]}
];
// Sick look: scarf, red nose, ice pack, blanket on the lap
const sickLook=new THREE.Group();dad.add(sickLook);sickLook.visible=false;
{const red=mat(0xc0392b,.8),plaid=mat(0x7b4b8a,.9),ice=mat(0x8fd3ff,.4);
 const sc=mesh(new THREE.TorusGeometry(.27,.08,8,18),red,0,2.15,.02,sickLook);sc.rotation.x=Math.PI/2;box(.14,.4,.06,red,.14,1.95,.27,sickLook);
 ball(.075,mat(0xe0584a,.5),0,2.45,.37,sickLook);
 sickLook.userData.ice=box(.44,.08,.32,ice,0,2.93,.02,sickLook);
 sickLook.userData.blanket=new THREE.Group();sickLook.add(sickLook.userData.blanket);
 box(1.1,.12,.8,plaid,0,1.3,.32,sickLook.userData.blanket);box(1.1,.8,.08,plaid,0,.92,.72,sickLook.userData.blanket);
 for(const x of [-.35,0,.35])box(.06,.81,.085,mat(0xe9c46a),x,.92,.72,sickLook.userData.blanket)}
const sick={on:false,phase:-1,sneezeT:10,warmT:0,sofaT:0,mouthT:0};
const SICK_PROPS=['tissues','thermo'];
function sickResetProps(){sick.on=false;sick.phase=-1;sickLook.visible=false;
 for(const k of SICK_PROPS){const p=shopProp(k);if(p){p.g.position.copy(p.home);p.g.rotation.set(0,0,0);hideProp(p,true)}}
 if(dadState==='sick')setDadState('rest')}
const _origReset2=bathResetProps;bathResetProps=function(){_origReset2();sickResetProps()};
DAY_HOOKS.sick=(phase,fresh)=>{
 sick.on=true;sick.phase=phase;sickLook.visible=true;sickLook.userData.ice.visible=phase<2;
 if(phase===0){for(const k of SICK_PROPS)hideProp(shopProp(k),false);sick.sneezeT=8;setDadState('sick');
  if(started)setTimeout(()=>{if(sick.on){speakDad('אחח... אני גוסס. מילקי, תביא לי משהו...');setTimeout(()=>sayDani('אבא, יש לך 37.4. אתה בסדר.'),1800)}},1200)}
 if(phase===1){setDadState('sick');sayDani('אני מכין לך מרק עוף, אבא. מילקי, אפילו אל תסתכל על הסיר.')}
 if(phase===2){setDadState('rest');dadPetCooldown=0;speakDad('אני מרגיש קצת יותר טוב... בזכות מילקי. ודני. בעיקר מילקי.')}
};
function sneeze(){
 if(window.JUICE_READY){hitStop(.08);punch(5)}
 sayText(dadB,pick(['אפצ\'ייייי!!!','אאאפצ\'י!!','אפ... אפ... אפצ\'י!!!']),1.8,'say',true);chaosShake=Math.max(chaosShake,.18);
 const fx=Math.sin(dad.rotation.y),fz=Math.cos(dad.rotation.y);
 for(let i=0;i<14;i++)emit(dad.position.x+fx*.4,2.3+dad.position.y,dad.position.z+fz*.4,fx*4+(Math.random()-.5)*2,(Math.random()-.2)*1.5,fz*4+(Math.random()-.5)*2,'foam',.7);
 const dx=pos.x-dad.position.x,dz=pos.z-dad.position.z,d=Math.hypot(dx,dz);
 if(d<3&&jumpY<1.2&&!rag.active){startRagdoll();rag.vx=dx/(d||1)*7;rag.vz=dz/(d||1)*7;rag.vy=5;dayEvent('sneezed');addScore(200,'עף מעיטוש');setTimeout(()=>sayDani('לבריאות! ...מילקי, אתה בסדר?'),900)}
}
function sickInteract(p){return false}
function sickFlip(){if(sick.on&&Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z)<4.5){dayEvent('showFlip');dadLaughT=2.5;speakDad(pick(['חחח! אחח... הראש...','בראבו! ...אל תעשה את זה שוב, אני מסתחרר']))}}
function sickRoll(){if(sick.on&&sick.phase===2&&Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z)<3.6){dayEvent('laugh');dadLaughT=3;speakDad('חחחחח! הכלב הזה... חחח')}}
function updateSick(dt){
 if(!sick.on)return;
 const dd=Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z);
 if(sick.phase<2){dadPetCooldown=Math.max(dadPetCooldown,5);if(['rest','watch','wander','investigate','sit'].includes(dadState))setDadState('sick');
  sick.sneezeT-=dt;if(sick.sneezeT<=0&&dadSeated){sick.sneezeT=9+Math.random()*6;sneeze()}}
 if(sick.mouthT>0){sick.mouthT-=dt;if(sick.mouthT<=0)mouthItem.visible=false}
 // deliveries to dad
 if(slipperState==='floor'&&Math.hypot(slipper.position.x-dad.position.x,slipper.position.z-dad.position.z)<1.8&&Math.hypot(slipper.position.x-slipperHome.x,slipper.position.z-slipperHome.z)>.5&&!day.done.has('bringSlipper')){
  dayEvent('bringSlipper');speakDad('תודה מילקי... איפה השנייה?');thought(dadB,'🥹',2,true);slipper.position.copy(slipperHome);slipper.rotation.set(0,0,0)}
 const ts=shopProp('tissues');if(ts&&ts.g.visible&&!carried.has(ts.g)&&Math.hypot(ts.g.position.x-dad.position.x,ts.g.position.z-dad.position.z)<1.9){hideProp(ts,true);dayEvent('tissue');addScore(150,'טישו לאבא');speakDad('תודה... *מקנח באף בקול של משאית*');emit(dad.position.x,2.4,dad.position.z,0,1,0,'foam',.6)}
 if(sick.phase===0&&dadSeated&&dd<1.9&&grounded&&jumpY<.2&&lastDogSpeed<.3){sick.warmT+=dt;if(sick.warmT>3&&!day.done.has('warmFeet')){idleAction='lie';idleClock=0;dayEvent('warmFeet');speakDad('אהה... כמו בקבוק חם עם פרווה');thought(dadB,'😌',2.4,true)}}else sick.warmT=0;
 if(sick.phase===1&&jumpY>.8&&Math.hypot(pos.x-stovePot.position.x,pos.z-stovePot.position.z)<1.1&&!day.done.has('soupSteal')){dayEvent('soupSteal');mouthItem.visible=true;sick.mouthT=6;addScore(300,'עוף מהמרק');setDani('scold','מילקי!!! זה המרק של אבא!');speakDad('חחח... תן לו, הוא צריך כוח לטפל בי')}
 const th=shopProp('thermo');if(th&&th.g.visible&&!carried.has(th.g)&&Math.hypot(th.g.position.x-BED.x,th.g.position.z-BED.z)<1.7&&!day.done.has('thermo')){dayEvent('thermo');speakDad('המדחום! מילקי, אני צריך לדעת אם יש לי 38!');milkyThought('😏',1.6,true)}
 if(sick.phase===2){
  const bw=extras.find(p=>p.kind==='bowl');if(bw&&Math.hypot(bw.g.position.x-dad.position.x,bw.g.position.z-dad.position.z)<1.9&&!day.done.has('shareBowl')){dayEvent('shareBowl');speakDad('אתה משתף אותי באוכל שלך? זאת אהבה אמיתית.');thought(dadB,'🥹',2.4,true)}
  if(dadState==='pet'&&dd<1.8)dayEvent('petDad');
  const sofa=obstacles.find(o=>o.name==='ספה');if(tvOn&&jumpY>.8&&grounded&&insidePlatform(sofa,pos.x,pos.z,0)&&lastDogSpeed<.3){sick.sofaT+=dt;if(sick.sofaT>2.5&&!day.done.has('sofaWatch')){dayEvent('sofaWatch');idleAction='lie';idleClock=0;sayText(milkyB,'📺 הפרק הכי טוב',2.4,'think',true)}}else sick.sofaT=0;
 }
}
window.SICK_READY=true;
loadWeekPhases();renderDay();renderWeek();
