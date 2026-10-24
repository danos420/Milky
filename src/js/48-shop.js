// ===== Shopping day: dad goes to the supermarket, comes back with bags, roast chicken in the evening =====
WEEK[2].soon=false;WEEK[2].short='קניות';WEEK[2].intro='🛒 יום שלישי: אבא יצא לסופר. הבית שלך!';
PHASE_SETS.shop=[
 {name:'בוקר',icon:'🛒',banner:'🛒 אבא יצא לסופר. הבית כולו של מילקי!',tasks:[
  {id:'chairNap',label:'💺 לנמנם על הכורסה של אבא',tip:'קפוץ על הכורסה ותעמוד בשקט'},
  {id:'tpTrail',label:'🧻 לפרוש נייר טואלט 15 מטר',tip:'הגליל ליד הספה. תפוס בפה (T) ותרוץ'},
  {id:'remote',label:'📺 להדליק טלוויזיה בלי אבא',tip:'השלט ליד שולחן הסלון'},
  {id:'snack',label:'🍪 לגנוב את החטיף מהשולחן',tip:'קפוץ על השולחן ולחץ חטיף'}]},
 {name:'צהריים',icon:'🛍️',banner:'🛍️ אבא חזר עם שקיות!',tasks:[
  {id:'baguette',label:'🥖 לברוח עם הבגט לחצר',tip:'השקיות ליד דלת המרפסת. תפוס בפה (T)'},
  {id:'bagHead',label:'🛍️ להיכנס לשקית עם הראש',tip:'השקית הגדולה על הרצפה'},
  {id:'canRoll',label:'🥫 לגלגל קופסת שימורים רחוק',tip:'תדחוף אותה בריצה'},
  {id:'receipt',label:'🧾 לאכול את הקבלה',tip:'הפתק הלבן ליד השקיות, לחץ E'}]},
 {name:'ערב',icon:'🍗',banner:'🍗 עוף בתנור. ריח מטורף בכל הבית',tasks:[
  {id:'sniffChicken',label:'👃 להריח את העוף ליד התנור',tip:'במטבח, ליד הכיריים. תעמוד רגע'},
  {id:'drumstick',label:'🍗 לגנוב כרע עוף מהשולחן',tip:'העוף על שולחן האוכל במטבח'},
  {id:'beg',label:'🐶 לשבת יפה ליד שולחן האוכל',tip:'כפתור אילוף (R) על "שב", ליד השולחן'},
  {id:'sofaNap',label:'😴 להירדם על הספה עם בטן מלאה',tip:'אחרי העוף: קפוץ על הספה ותעמוד בשקט'}]}
];
const BAGS={x:.9,z:-7.6},STOVE={x:-3.8,z:15.4},DTABLE={x:2,z:11.8};
// Grocery bags (decor) + a big one Milky can put his head into
const bags=new THREE.Group();bags.position.set(BAGS.x,0,BAGS.z);scene.add(bags);
{const paper=mat(0xc9a06a,.95),dark=mat(0xa57d4b,.95);
 box(.5,.6,.32,paper,0,.3,0,bags);box(.5,.04,.33,dark,0,.6,0,bags);cyl(.05,.36,mat(0xe9c46a),.1,.72,0,bags);ball(.09,mat(0x7fb069),-.12,.66,.02,bags);
 const b2=new THREE.Group();b2.position.set(.75,0,-.25);b2.rotation.y=.5;bags.add(b2);box(.46,.52,.3,paper,0,.26,0,b2);ball(.1,mat(0xd8573d),.05,.55,0,b2)}
const bigBag=new THREE.Group();scene.add(bigBag);const BIGBAG_HOME=new THREE.Vector3(-.6,0,-7.3);bigBag.position.copy(BIGBAG_HOME);
{const p=mat(0xd4ad78,.95);const s=mesh(new THREE.CylinderGeometry(.34,.38,.62,4,1,true),p,0,.31,0,bigBag);s.rotation.y=Math.PI/4;s.material.side=THREE.DoubleSide;box(.04,.02,.4,mat(0xa57d4b),0,.62,.0,bigBag)}
bigBag.rotation.z=1.35;bigBag.position.y=.3;
// Roast chicken on the dining table (evening)
const chicken=new THREE.Group();chicken.position.set(DTABLE.x+.2,.82,DTABLE.z);scene.add(chicken);
{cyl(.34,.04,mat(0xf2efe8,.4),0,.02,0,chicken);const c=ball(.2,mat(0xc77d36,.6),0,.15,0,chicken);c.scale.set(1.25,.85,1);
 const legs=[];for(const s of [-1,1]){const g=new THREE.Group();g.position.set(.12,.13,s*.12);chicken.add(g);const l=ball(.07,mat(0xb86a2a,.6),.09,0,0,g);l.scale.set(1.6,.9,.9);cyl(.02,.08,mat(0xf5ecd8),.2,0,0,g).rotation.z=Math.PI/2;legs.push(g)}chicken.userData.legs=legs}
chicken.visible=false;
// A drumstick / receipt in Milky's mouth
const mouthItem=new THREE.Group();mouthItem.position.set(0,-.16,.62);headPivot.add(mouthItem);mouthItem.visible=false;
{const l=ball(.07,mat(0xb86a2a,.6),0,0,0,mouthItem);l.scale.set(.9,.9,1.6);const bn=cyl(.02,.1,mat(0xf5ecd8),.0,0,.14,mouthItem);bn.rotation.x=Math.PI/2}
// Paper bag stuck on Milky's head
const headBag=new THREE.Group();headBag.position.set(0,.05,.3);headPivot.add(headBag);headBag.visible=false;
{const p=mat(0xd4ad78,.95);const s=mesh(new THREE.CylinderGeometry(.34,.36,.75,4,1,false),p,0,0,0,headBag);s.rotation.set(Math.PI/2,Math.PI/4,0)}
// Toilet paper trail (works every day, it is just too fun)
const TP_N=180,tpTrail=new THREE.InstancedMesh(new THREE.PlaneGeometry(.17,.42),new THREE.MeshStandardMaterial({color:0xf6f3ec,roughness:.9,polygonOffset:true,polygonOffsetFactor:-3,side:THREE.DoubleSide}),TP_N);
tpTrail.count=0;tpTrail.castShadow=false;tpTrail.frustumCulled=false;scene.add(tpTrail);const _tm=new THREE.Matrix4(),_tq=new THREE.Quaternion(),_te=new THREE.Euler(),_tv=new THREE.Vector3(),_ts=new THREE.Vector3(1,1,1),_tqFlat=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),-Math.PI/2);
const shop={on:false,phase:-1,trail:0,lastX:0,lastZ:0,chairT:0,bagT:0,sniffT:0,mouthT:0,smokeT:0,dadOut:false};
function shopProp(kind){return extras.find(p=>p.kind===kind)}
function hideProp(p,hide){if(!p)return;if(hide){carried.add(p.g);p.g.visible=false;p.vx=p.vz=0}else{carried.delete(p.g);p.g.visible=true}}
function shopResetProps(){
 tpTrail.count=0;tpTrail.instanceMatrix.needsUpdate=true;shop.trail=0;shop.on=false;shop.phase=-1;shop.dadOut=false;
 bags.visible=false;bigBag.visible=false;headBag.visible=false;mouthItem.visible=false;chicken.visible=false;chicken.userData.legs.forEach(l=>l.visible=true);
 for(const k of ['baguette','can','receipt']){const p=shopProp(k);if(p){p.g.position.copy(p.home);p.g.rotation.set(0,0,0);hideProp(p,true)}}
 if(!dad.visible){dad.visible=true;dad.position.set(4.1,0,5.7)}
 if(dadState==='away')setDadState('rest');
}
const _origReset=bathResetProps;bathResetProps=function(){_origReset();shopResetProps()};
DAY_HOOKS.shop=(phase,fresh)=>{
 shop.on=true;shop.phase=phase;
 if(phase===0){if(dadSeated)unseatDad();setDadState('away');dad.visible=false;dad.position.set(0,0,-70);shop.dadOut=true;
  if(started)setTimeout(()=>{if(shop.on&&shop.phase===0)sayDani('אבא יצא לסופר. מילקי, אל תעשה שטויות... מילקי?')},1500)}
 if(phase>=1&&shop.dadOut){shop.dadOut=false;dad.visible=true;dad.position.set(-1.2,0,-10.6);dadNav.path=[];setDadState('rest');
  speakDad(pick(['חזרתי! מי עזר לי לסחוב? אף אחד. כרגיל.','אוף, איזה תור היה בקופה...']));setTimeout(()=>sayDani('קנית במבה?'),1600)}
 if(phase===1){bags.visible=true;bigBag.visible=true;for(const k of ['baguette','can','receipt'])hideProp(shopProp(k),false)}
 if(phase===2){chicken.visible=true;shop.smokeT=0;sayDani('העוף בתנור! מילקי, אפילו לא לחשוב על זה')}
};
function shopInteract(p){
 if(p.kind==='receipt'){hideProp(p,true);mouthItem.visible=false;dayEvent('receipt');addScore(150,'אכלת קבלה');sayText(milkyB,'🧾 טעים... קצת יבש',2,'say',true);
  speakDad(pick(['הקבלה! איך אני מחזיר עכשיו את הגבינה?!','מילקי! זה היה הקבלה!']));return true}
 return false;
}
function updateShop(dt){
 // Toilet paper trail follows the roll in Milky's mouth
 if(grab&&grab.b.kind==='tp'&&grounded&&jumpY<.2){const d=Math.hypot(pos.x-shop.lastX,pos.z-shop.lastZ);
  if(d>.36){const k=tpTrail.count<TP_N?tpTrail.count++:Math.floor(Math.random()*TP_N);const a=Math.atan2(pos.x-shop.lastX,pos.z-shop.lastZ);
   _tv.set((pos.x+shop.lastX)/2,.012+(k%3)*.002,(pos.z+shop.lastZ)/2);_tq.setFromEuler(_te.set(0,a,0)).multiply(_tqFlat);_tm.compose(_tv,_tq,_ts.set(1,d/.42,1));
   tpTrail.setMatrixAt(k,_tm);tpTrail.instanceMatrix.needsUpdate=true;shop.trail+=d;shop.lastX=pos.x;shop.lastZ=pos.z;
   if(shop.trail>=15&&!day.done.has('tpTrail')){dayEvent('tpTrail');addScore(300,'שביל נייר טואלט!');if(dadState!=='away')speakDad('מי עטף לי את הבית?!');else sayDani('אבא הולך להתעלף כשהוא יחזור')}}}
 else{shop.lastX=pos.x;shop.lastZ=pos.z}
 if(shop.on&&shop.phase===0&&!day.done.has('tpTrail')&&grab&&grab.b.kind==='tp'&&!(typeof evt!=='undefined'&&evt.cur)){evtPill.hidden=false;const l='🧻 '+Math.floor(shop.trail)+'/15 מטר';if(evtPill.textContent!==l)evtPill.textContent=l}
 else if(shop.on&&shop.phase===0&&!(typeof evt!=='undefined'&&evt.cur)&&!BATH_BLOCK)evtPill.hidden=true;
 // Mouth item timer
 if(shop.mouthT>0){shop.mouthT-=dt;if(shop.mouthT<=0)mouthItem.visible=false}
 // Bag on the head: blind, wobbly walk
 if(headBag.visible){shop.bagT-=dt;yaw+=Math.sin(performance.now()*.004)*dt*.9;if(shop.bagT<=0||rag.active){headBag.visible=false;bigBag.visible=true;bigBag.position.set(pos.x+Math.sin(yaw)*.9,.3,pos.z+Math.cos(yaw)*.9);thought(milkyB,'😮‍💨',1.4,true)}}
 if(!shop.on)return;
 if(shop.phase===0&&dadState!=='away'){setDadState('away');dad.visible=false;dad.position.set(0,0,-70)}
 const ac=armchairObs();
 if(jumpY>.4&&grounded&&insidePlatform(ac,pos.x,pos.z,.05)&&lastDogSpeed<.3){shop.chairT+=dt;holdShow('chairNap',shop.chairT,2.5);if(shop.chairT>2.5&&!day.done.has('chairNap')){idleAction='lie';idleClock=0;sayText(milkyB,'💤 הכורסה של אבא... נוח',2.6,'think',true);dayEvent('chairNap')}}else shop.chairT=0;
 if(shop.phase>=1){
  const bg=shopProp('baguette');if(grab&&grab.b.o===bg.g){if(!shop.bagWarn){shop.bagWarn=true;speakDad('הבגט! מילקי, זה לא מקל!')}if(pos.z<-9.4&&!day.done.has('baguette')){dayEvent('baguette');addScore(250,'בגט בחצר');sayDani('הוא קובר את הבגט. כמו עצם.')}}
  if(bigBag.visible&&!headBag.visible&&jumpY<.4&&Math.hypot(pos.x-bigBag.position.x,pos.z-bigBag.position.z)<.6){bigBag.visible=false;headBag.visible=true;shop.bagT=5;dayEvent('bagHead');addScore(200,'שקית על הראש');sayText(milkyB,'🙈 מי כיבה את האור?!',2.2,'say',true);setTimeout(()=>sayDani('חחחחח אבא תסתכל!'),700)}
  const cn=shopProp('can');if(cn&&cn.g.visible&&Math.hypot(cn.g.position.x-cn.home.x,cn.g.position.z-cn.home.z)>3.5&&!day.done.has('canRoll')){dayEvent('canRoll');addActivity('🥫 הקופסה מתגלגלת לה בכל הבית')}
  if(cn&&cn.g.visible){const sp=Math.hypot(cn.vx,cn.vz);cn.g.children.forEach(m=>{m.rotation.y+=sp*dt*4})}
 }
 if(shop.phase===2){
  shop.smokeT-=dt;if(shop.smokeT<=0){shop.smokeT=.35;emit(STOVE.x+(Math.random()-.5)*.6,1.25,STOVE.z-.1,(Math.random()-.5)*.3,.7,-.25,'smoke',2.2)}
  if(Math.hypot(pos.x-STOVE.x,pos.z-STOVE.z)<1.9&&lastDogSpeed<.3&&grounded){shop.sniffT+=dt;holdShow('sniffChicken',shop.sniffT,2.2);if(shop.sniffT>2.2&&!day.done.has('sniffChicken')){dayEvent('sniffChicken');sayText(milkyB,'🤤 עוווף...',2.4,'think',true);idleAction='stand';idleClock=0}}else shop.sniffT=0;
  const legs=chicken.userData.legs.filter(l=>l.visible);
  if(legs.length&&jumpY>.6&&Math.hypot(pos.x-chicken.position.x,pos.z-chicken.position.z)<1.0){legs[0].visible=false;mouthItem.visible=true;shop.mouthT=8;dayEvent('drumstick');addScore(400,'כרע עוף!');setDani('scold','מילקי!!! זה לארוחת ערב!');speakDad('חחח... טוב, מגיע לו');milkyThought('😋',1.6,true)}
  const sofa=obstacles.find(o=>o.name==='ספה');if(day.done.has('drumstick')&&jumpY>.8&&grounded&&insidePlatform(sofa,pos.x,pos.z,0)&&lastDogSpeed<.3){shop.sofaT=(shop.sofaT||0)+dt;holdShow('sofaNap',shop.sofaT,2.5);if(shop.sofaT>2.5&&!day.done.has('sofaNap')){idleAction='lie';idleClock=0;sayText(milkyB,'💤 עוף... ספה... החיים יפים',2.8,'think',true);dayEvent('sofaNap');speakDad('תראו אותו. כמו מלך.')}}else shop.sofaT=0;
  if(trainingTime>0&&activeCmd==='שב'&&Math.hypot(pos.x-DTABLE.x,pos.z-DTABLE.z)<2.6&&!day.done.has('beg')){dayEvent('beg');mouthItem.visible=true;shop.mouthT=4;sayDani(pick(['טוב... חתיכה אחת. רק אחת.','איך אפשר להגיד לו לא?']));thought(daniB,'🥹',2,true)}
 }
}
window.SHOP_READY=true;
loadWeekPhases();renderDay();renderWeek();
