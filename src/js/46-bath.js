// ===== Bath day: dad hunts Milky with shampoo, Milky ends up foamy and shakes it over everything =====
PHASE_SETS.bath=[
 {name:'בוקר',icon:'🧴',banner:'🧴 אבא מחמם מים... ומחפש את מילקי!',tasks:[
  {id:'escape',label:'🏃 לברוח מאבא 30 שניות',tip:'רוץ! על הרהיטים זה לא נחשב'},
  {id:'hideShampoo',label:'🧴 להחביא את השמפו במיטה של מילקי',tip:'השמפו ליד הגיגית בחצר. תפוס בפה (T) ורוץ למיטה'},
  {id:'spillTub',label:'🛁 להפוך את הגיגית בחצר',tip:'תסתער עליה בריצה או תנחת עליה'},
  {id:'puppyEyes',label:'🥺 פרצוף תמים מול אבא',tip:'כפתור הבעה עד 🥺, ליד אבא'}]},
 {name:'צהריים',icon:'🫧',banner:'🫧 אבא הצליח! מילקי מלא קצף',tasks:[
  {id:'shakeSofa',label:'🛋️ להתנער על הספה',tip:'עמוד על הספה ותחכה רגע'},
  {id:'shakeDad',label:'😱 להתנער ליד אבא',tip:'תעמוד ממש לידו ואל תזוז'},
  {id:'rugRoll',label:'🤸 להתגלגל על השטיח',tip:'על השטיח בסלון: נפילה (X)'},
  {id:'armchair',label:'🛋️ להתייבש על הכורסה של אבא',tip:'קפוץ על הכורסה'}]},
 {name:'ערב',icon:'✨',banner:'✨ מילקי נקי ומבריק... בינתיים',tasks:[
  {id:'grassRoll',label:'🌱 להתגלגל בדשא',tip:'בחצר: נפילה (X)'},
  {id:'wet',label:'💦 להירטב שוב',tip:'בריכה או הגיגית'},
  {id:'kebab',label:'🍢 לגנוב קבב ולשרוד 7 שניות',tip:'המנגל בסוף החצר'},
  {id:'bedSleep',label:'😴 להירדם במיטה של מילקי',tip:'עמוד בשקט במיטה ליד המרפסת'}]}
];
const TUB={x:-4.5,z:-11.5},BED={x:3.5,z:-6.4};
const tub=new THREE.Group();tub.position.set(TUB.x,0,TUB.z);scene.add(tub);
{const shell=mat(0x5fb3d9,.5),rim=mat(0xeaf6fb,.5);
 const o=mesh(new THREE.CylinderGeometry(.78,.66,.46,22,1,true),shell,0,.23,0,tub);o.material.side=THREE.DoubleSide;o.scale.z=.72;
 const r=mesh(new THREE.TorusGeometry(.78,.05,8,24),rim,0,.46,0,tub);r.rotation.x=Math.PI/2;r.scale.y=.72;
 const f=cyl(.66,.03,shell,0,.02,0,tub);f.scale.z=.72;}
const tubWater=cyl(.72,.02,new THREE.MeshStandardMaterial({color:0x8fd3ff,roughness:.2,transparent:true,opacity:.85}),0,.36,0,tub);tubWater.scale.z=.72;
const tubFoam=new THREE.Group();tub.add(tubFoam);
for(let i=0;i<9;i++){const a=i/9*Math.PI*2,rr=.25+Math.random()*.35;ball(.12+Math.random()*.08,mat(0xffffff,.9),Math.cos(a)*rr,.42,Math.sin(a)*rr*.7,tubFoam)}
const puddle=cyl(1.5,.012,new THREE.MeshStandardMaterial({color:0x8fd3ff,roughness:.15,transparent:true,opacity:.7,polygonOffset:true,polygonOffsetFactor:-2}),TUB.x,.012,TUB.z-1.1);puddle.scale.z=.6;puddle.visible=false;puddle.castShadow=false;
// Foam that sticks to Milky
const foamG=new THREE.Group();torso.add(foamG);foamG.visible=false;
{const w=mat(0xffffff,.95);for(const [x,y,z,r] of [[0,1.45,.1,.14],[.12,1.42,-.25,.12],[-.13,1.43,-.05,.12],[0,1.42,-.55,.13],[.15,1.35,.35,.1],[-.15,1.36,.4,.1],[0,1.33,-.85,.09],[.2,1.2,-.6,.09],[-.2,1.22,-.2,.1],[0,1.12,.62,.1]])ball(r,w,x,y,z,foamG);
 const hf=new THREE.Group();hf.position.set(0,1.74,.8);foamG.add(hf);for(const [x,y,z,r] of [[0,.3,.05,.13],[.1,.27,-.08,.09],[-.11,.26,-.06,.09]])ball(r,w,x,y,z,hf);foamG.userData.head=hf}
const bath={foam:0,tipped:false,tip:0,escape:0,pause:0,phase:-1,bedT:0,eyesCool:0,on:false};
function bathResetProps(){bath.tipped=false;bath.tip=0;tub.rotation.set(0,0,0);tub.position.set(TUB.x,0,TUB.z);tubWater.visible=true;tubFoam.visible=true;puddle.visible=false;setFoam(0);bath.on=false;bath.phase=-1;bath.escape=0;bath.pause=0;bath.bedT=0;
 if(typeof evtPill!=='undefined'&&!(typeof evt!=='undefined'&&evt.cur))evtPill.hidden=true;if(dadState==='bath')setDadState('rest')}
function setFoam(f){bath.foam=Math.max(0,Math.min(1,f));foamG.visible=bath.foam>.02;foamG.scale.setScalar(.55+.45*bath.foam);if(bath.foam>0)wet=1}
DAY_HOOKS.bath=(phase,fresh)=>{
 bath.on=true;bath.phase=phase;
 if(phase===0){BATH_BLOCK=true;bath.escape=0;bath.pause=4;setTimeout(()=>{if(started&&bath.on&&bath.phase===0){speakDad(pick(['מילקיייי! אמבטיה!','בוא לפה, יש לי הפתעה... עם סבון','מי רוצה להיות ריחני?!']));sayDani('אני מחזיק את המגבת!')}},1500)}
 if(phase===1){BATH_BLOCK=false;if(dadState==='bath')setDadState('rest');setFoam(1);emitFoam(14);evtPill.hidden=true;
  if(!day.done.has('escape'))speakDad('תפסתי אותך! עכשיו אתה ריחני 🧽');else speakDad('אפילו בלי שמפו, סבון כלים עושה את העבודה!');milkyThought('😤',2,true)}
 if(phase===2){setFoam(0);wet=0;speakDad('איזה כלב נקי! אל תתקרב לדשא!');thought(milkyB,'✨',2,true)}
};
function emitFoam(n,x=pos.x,z=pos.z,y=1.3*MS){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2;emit(x+Math.cos(a)*.3,y,z+Math.sin(a)*.3,Math.cos(a)*2.4,1+Math.random()*2,Math.sin(a)*2.4,'foam',.9)}}
function bathShake(){
 if(bath.foam<=0)return;emitFoam(10);
 const sofa=obstacles.find(o=>o.name==='ספה');
 if(jumpY>.8&&insidePlatform(sofa,pos.x,pos.z,0)){dayEvent('shakeSofa');speakDad('לא על הספה!!');}
 if(Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z)<2.4){dayEvent('shakeDad');speakDad(pick(['אחחח! עכשיו אני צריך אמבטיה!','מילקי!! המשקפיים שלי!']));thought(dadB,'😱',2.2,true);emitFoam(8,dad.position.x,dad.position.z,2.4)}
}
function bathShakeEnd(){
 if(bath.foam<=0)return;
 const keep=bath.phase===1&&!(day.done.has('shakeSofa')&&day.done.has('shakeDad'))?.4:0;
 setFoam(Math.max(keep,bath.foam-.34));if(bath.foam>0)wet=1;else thought(milkyB,'✨',1.5,true);
}
function bathRoll(){
 if(!bath.on)return;
 if(Math.abs(pos.x+.15)<2.3&&Math.abs(pos.z-.85)<2.8&&jumpY<.3){dayEvent('rugRoll');if(bath.foam>0){emitFoam(10);speakDad('השטיח!! מילקי!!')}}
 if(pos.z<-9.3){dayEvent('grassRoll');if(bath.phase===2&&day.done.has('grassRoll'))sayDani('הוא שוב מלוכלך. שיא עולמי.')}
}
function bathCatch(){
 setFoam(1);emitFoam(16);SFX.splash();addActivity('🧽 אבא תפס את מילקי וקרצף אותו!');speakDad(pick(['תפסתי אותך! 🧽','חה! עכשיו קצף!','שב! שב! ...טוב, תעמוד']));
 milkyThought('😤',1.8,true);setDadState('rest');bath.pause=6;
}
function tipTub(){
 if(bath.tipped)return;bath.tipped=true;if(window.JUICE_READY){slowMo(.45);punch(5);pow('שפלאש!',TUB.x,1.2,TUB.z,true)}SFX.splash();chaosShake=Math.max(chaosShake,.25);addChaos(14);dayEvent('spillTub');addScore(200,'גיגית התהפכה!');
 for(let i=0;i<30;i++)emit(TUB.x+(Math.random()-.5),.4,TUB.z+(Math.random()-.5)*.6,(Math.random()-.5)*3,1.5+Math.random()*2,-1-Math.random()*3,'water',.8);
 tubFoam.visible=false;tubWater.visible=false;puddle.visible=true;
 if(bath.on)speakDad(pick(['המים!!! חיממתי אותם חצי שעה!','מילקי!! עכשיו אני צריך למלא מחדש!']));
}
function updateBath(dt){
 const td=Math.hypot(pos.x-TUB.x,pos.z-TUB.z);
 if(!bath.tipped&&td<1.05&&jumpY<.6&&!rag.active){if(lastDogSpeed>4||jumpY>.15&&velocityY<-2)tipTub();else if(jumpY<.5){wet=1;MUDDY=false;if(Math.random()<.3)emit(pos.x,.4,pos.z,(Math.random()-.5)*2,2,(Math.random()-.5)*2,'water',.6);dayEvent('wet')}}
 if(bath.tipped&&bath.tip<1){bath.tip=Math.min(1,bath.tip+dt*3);tub.rotation.x=-1.45*bath.tip*bath.tip;tub.position.y=.25*bath.tip}
 if(bath.foam>0&&shakeT<=0)wet=1;
 if(bath.foam>0&&Math.random()<dt*2.5)emit(pos.x+(Math.random()-.5)*.4,1.4*MS,pos.z+(Math.random()-.5)*.4,(Math.random()-.5)*.4,.8,(Math.random()-.5)*.4,'foam',1.4);
 if(!bath.on)return;
 const dd=Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z);
 bath.eyesCool=Math.max(0,bath.eyesCool-dt);
 if(bath.phase===0){
  bath.pause=Math.max(0,bath.pause-dt);
  if(mood===3&&dd<2.8&&bath.eyesCool===0){bath.eyesCool=8;dayEvent('puppyEyes');speakDad(pick(['אוי... הפרצוף הזה... טוב, עוד 5 דקות','לא! אל תסתכל עליי ככה!']));thought(dadB,'🥹',2.2,true);setDadState('rest');bath.pause=Math.max(bath.pause,5)}
  if(dadState!=='bath'&&bath.pause===0&&['rest','watch','wander','sit'].includes(dadState)){if(dadSeated)unseatDad();setDadState('bath')}
  if(dadState==='bath'){
   if(dd<1.05&&jumpY<.6&&!rag.active)bathCatch();
   else if(jumpY<.5&&!day.done.has('escape')){bath.escape+=dt;if(bath.escape>=30){dayEvent('escape');speakDad('אוף... אני צריך לשבת רגע');setDadState('rest');bath.pause=8}}
  }
  if(!day.done.has('escape')){evtPill.hidden=false;const l='🏃 לברוח מאבא '+Math.floor(bath.escape)+'/30'+(jumpY>.5&&dadState==='bath'?' · רק על הרצפה':'');if(evtPill.textContent!==l)evtPill.textContent=l}else if(!evt.cur)evtPill.hidden=true;
  const sh=extras.find(p=>p.kind==='shampoo');if(sh&&!carried.has(sh.g)&&Math.hypot(sh.g.position.x-BED.x,sh.g.position.z-BED.z)<1.7&&!day.done.has('hideShampoo')){dayEvent('hideShampoo');speakDad('איפה השמפו?! ...טוב, יש סבון כלים');milkyThought('😏',2,true)}
 }
 if(bath.phase===2){
  if(Math.hypot(pos.x-BED.x,pos.z-BED.z)<1.0&&grounded&&lastDogSpeed<.3&&!rag.active){bath.bedT+=dt;holdShow('bedSleep',bath.bedT,2.5);if(bath.bedT>2.5&&!day.done.has('bedSleep')){idleAction='lie';idleClock=0;sayText(milkyB,'💤 ררר...',3,'think',true);dayEvent('bedSleep')}}else bath.bedT=0;
 }
}
window.BATH_READY=true;
loadWeekPhases();renderDay();weekPhaseStart(0,false);
