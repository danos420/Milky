// ===== Human Milky: walks on two legs, wears a hat and a tie, and runs errands. Every errand ends in a fiasco =====
var HUMAN=false;try{HUMAN=localStorage.getItem('milky-mode')==='human'}catch(_){}
// outfit
const hat=new THREE.Group();hat.position.set(0,.3,.02);headPivot.add(hat);{const fm=mat(0x3a3a42,.6);cyl(.3,.04,fm,0,0,0,hat);cyl(.18,.2,fm,0,.11,0,hat);cyl(.185,.04,mat(0xc0392b),0,.04,0,hat)}
const tie=new THREE.Group();tie.position.set(0,1.32,.78);tie.rotation.x=-.55;torso.add(tie);{const tm=mat(0xc0392b,.5);box(.1,.08,.05,tm,0,.12,0,tie);const b=box(.12,.36,.03,tm,0,-.1,0,tie);for(let i=0;i<3;i++)box(.13,.025,.035,mat(0xf2c14e),0,.0-i*.1,0,tie)}
const mohawk=new THREE.Group();mohawk.position.set(0,.3,.05);headPivot.add(mohawk);{const mm=mat(0xff3fa0,.5);for(let i=0;i<5;i++){const c=mesh(new THREE.ConeGeometry(.05,.22,6),mm,0,.08,-.16+i*.08,mohawk);c.rotation.x=-.2+i*.1}}
const milkG=new THREE.Group();milkG.position.set(0,-.18,.66);headPivot.add(milkG);{box(.14,.24,.14,mat(0xf6f6f2,.6),0,0,0,milkG);box(.145,.08,.145,mat(0x3a7bd5,.6),0,.02,0,milkG);const r=box(.1,.06,.1,mat(0xf6f6f2,.6),0,.14,0,milkG);r.rotation.z=.6}
const extG=new THREE.Group();extG.position.set(0,-.22,.7);headPivot.add(extG);{cyl(.09,.38,mat(0xd6261f,.5),0,0,0,extG).rotation.x=Math.PI/2;box(.06,.06,.08,mat(0x222222),0,.08,-.15,extG)}
const EXT_WALL={x:20.6,z:28.9};const extWall=new THREE.Group();extWall.position.set(EXT_WALL.x,0,EXT_WALL.z);scene.add(extWall);{cyl(.1,.45,mat(0xd6261f,.5),0,.85,0,extWall);box(.06,.08,.1,mat(0x222222),0,1.12,0,extWall)}
const chefSnow=new THREE.Group();CHEF.g.add(chefSnow);{const w=mat(0xffffff,.95);for(const [x,y,z,r] of [[0,2.7,0,.4],[.2,2.2,.2,.3],[-.2,2.2,.2,.3],[0,1.7,.25,.35],[0,1.1,.2,.3],[.3,1.5,0,.25],[-.3,1.5,0,.25]])ball(r,w,x,y,z,chefSnow)}
const dadMilk=new THREE.Group();dad.add(dadMilk);{const w=mat(0xffffff,.6);for(const [x,y,z,r] of [[0,2.9,0,.35],[.15,2.5,.3,.12],[-.12,2.3,.3,.1],[.3,2.2,.2,.1]])ball(r,w,x,y,z,dadMilk)}
for(const g of [hat,tie,mohawk,milkG,extG,chefSnow,dadMilk])g.visible=false;
function humanLegs(moving,dt){const k=Math.min(1,dt*14),s=steps*1.4;
 legs.forEach(l=>{if(l.front){const tg=moving?-1.0+Math.sin(s+(l.s>0?Math.PI:0))*.5:-1.25;l.pivot.rotation.x+=(tg-l.pivot.rotation.x)*k;l.knee.rotation.x+=((moving?.6:.35)-l.knee.rotation.x)*k}
  else{const tg=moving?.05+Math.sin(s+(l.s>0?0:Math.PI))*.55:.05;l.pivot.rotation.x+=(tg-l.pivot.rotation.x)*k;l.knee.rotation.x+=((moving?-Math.max(0,Math.sin(s+(l.s>0?0:Math.PI)))*.6:-.1)-l.knee.rotation.x)*k}});
 torso.rotation.z=Math.sin(s)*.06*(moving?1:0)}
// ---------- errands ----------
const hs={i:-1,step:0,t:0,started:0,score0:0,fiascos:[],hasExt:false,fire:0};
const ERRANDS=[
 {id:'milk',icon:'🥛',name:'לקנות חלב במכולת',where:()=>V(24.4,0,5)},
 {id:'vet',icon:'💊',name:'לאסוף לאבא תרופה מהווטרינר',where:()=>V(23.2,0,13)},
 {id:'pizza',icon:'🍕',name:'להזמין פיצה לארוחת ערב',where:()=>hs.step===2&&!hs.hasExt?V(EXT_WALL.x+.6,0,EXT_WALL.z):hs.step===2?V(OVEN.x-1.4,0,OVEN.z):V(PCOUNTER.x-1.2,0,PCOUNTER.z)},
 {id:'hair',icon:'💇',name:'להסתפר במספרה',where:()=>V(GTABLE.x,.95,GTABLE.z)},
 {id:'home',icon:'🏠',name:'להביא לאבא את החלב',where:()=>dad.position}
];
const hPill=()=>{if(hs.i<0||hs.i>=ERRANDS.length)return;const e=ERRANDS[hs.i];evtPill.hidden=false;const l=e.icon+' סידור '+(hs.i+1)+'/5: '+e.name;if(evtPill.textContent!==l)evtPill.textContent=l};
function hNext(){hs.i++;hs.step=0;hs.t=0;if(hs.i>=ERRANDS.length){hFinish();return}const e=ERRANDS[hs.i];showBanner(e.icon+' סידור '+(hs.i+1)+': '+e.name);hPill()}
function hFiasco(text){const idx=hs.i;if(hs.done===idx)return;hs.done=idx;hs.fiascos.push(text);addScore(500,'פיאסקו!');if(window.JUICE_READY){slowMo(.5);punch(6);pow('פיאסקו!!',pos.x,2.6,pos.z,true)}setTimeout(()=>{if(HUMAN&&hs.i===idx)hNext()},2600)}
function hFinish(){evtPill.hidden=true;showBanner('🎉 כל הסידורים... "בוצעו"');for(let i=0;i<4;i++)setTimeout(()=>showBurst(pos.x+(Math.random()-.5)*2,pos.z+(Math.random()-.5)*2),i*200);
 setTimeout(()=>{const st=document.getElementById('hStats');st.innerHTML='';const time=Math.round((performance.now()-hs.started)/1000);
  for(const l of ['⏱️ '+fmtTime(time),...hs.fiascos.map((f,i)=>ERRANDS[i].icon+' '+f),'⭐ ניקוד '+score.toLocaleString('he-IL')]){const d=document.createElement('div');d.textContent=l;st.appendChild(d)}document.getElementById('hEnd').hidden=false},2400)}
function hBuyMilk(){hs.step=1;sayText(milkyB,'🎩 שלום, חלב אחד בבקשה',2,'say',true);setTimeout(()=>sayText(PEOPLE[4].b,'...כלב עם כובע?! ...טוב, 6 שקל',2.2,'say',true),900);
 setTimeout(()=>{if(!HUMAN)return;milkG.visible=true;sayText(milkyB,'🙂 תודה רבה, יום נעים',1.6,'say',true);
  setTimeout(()=>{if(!HUMAN)return;showBurst(23.6,1.6);showBurst(23.6,8.4);chaosShake=.35;if(window.JUICE_READY){slowMo(.5);pow('קראאאש!!',23.6,2,3,true)}
   sayText(milkyB,'😳 ...הזנב',1.6,'say',true);sayText(PEOPLE[4].b,'המדפים!!! כל הבמבות!!! תפסו אותו!!!',2.4,'say',true);street.bamba.state='chase';street.bamba.t=0;hs.step=2},1500)},2200)}
CTX_HOOKS.act.unshift(()=>{if(!HUMAN||hs.i<0||hs.i>=ERRANDS.length)return null;const e=ERRANDS[hs.i];
 if(e.id==='milk'&&hs.step===0&&pos.x>20.2&&Math.hypot(pos.x-24.4,pos.z-5)<1.6)return {i:'🥛',l:'לקנות חלב',on:1,fn:hBuyMilk};
 if(e.id==='pizza'&&hs.step===0&&inPiz()&&Math.hypot(pos.x-PCOUNTER.x,pos.z-PCOUNTER.z)<2)return {i:'🍕',l:'להזמין',on:1,fn:hOrder};
 if(e.id==='pizza'&&hs.step===2&&!hs.hasExt&&Math.hypot(pos.x-EXT_WALL.x,pos.z-EXT_WALL.z)<1.6)return {i:'🧯',l:'מטף!',on:1,fn:()=>{hs.hasExt=true;extG.visible=true;extWall.visible=false;sayText(milkyB,'🧯 לא לדאוג! אני מקצוען!',1.8,'say',true)}};
 if(e.id==='pizza'&&hs.step===2&&hs.hasExt&&Math.hypot(pos.x-OVEN.x,pos.z-OVEN.z)<2.6)return {i:'🧯',l:'לכבות!',on:1,fn:hSpray};
 return null});
function hOrder(){hs.step=1;hs.t=0;sayText(milkyB,'🎩 משפחתית אחת, בלי זיתים',2,'say',true);setTimeout(()=>sayText(chefB,'כלב שמזמין פיצה?! מאמא מיה... 10 דקות!',2.2,'say',true),900)}
function hSpray(){hs.step=3;hs.fire=0;for(let i=0;i<60;i++)setTimeout(()=>{const a=yaw+(Math.random()-.5)*.6;emit(pos.x+Math.sin(yaw)*.6,1.6,pos.z+Math.cos(yaw)*.6,Math.sin(a)*6,(Math.random()-.2)*2,Math.cos(a)*6,'foam',.9)},i*25);
 setTimeout(()=>{chefSnow.visible=true;extG.visible=false;sayText(chefB,'...😶 אתה כלב או כבאי?!',2.4,'say',true);sayText(milkyB,'🧯 כיבוי וגילוי אש, מקצוען!',2.2,'say',true);hFiasco('כיבה את התנור... ואת השף')},1500)}
function hStartAll(){hs.i=-1;hs.done=-1;hs.fiascos=[];hs.started=performance.now();hs.hasExt=false;hs.fire=0;for(const g of [mohawk,milkG,extG,chefSnow,dadMilk])g.visible=false;extWall.visible=true;
 setTimeout(()=>{if(!HUMAN)return;speakDad('מילקי?! למה אתה עומד?! ...ולמה יש לך עניבה?!');setTimeout(()=>{sayText(milkyB,'🎩 אבא, היום אני עושה את כל הסידורים',2.4,'say',true);setTimeout(()=>{sayDani('מה... קורה... פה');hNext()},2000)},1700)},600)}
function updateHuman(dt){
 if(!HUMAN)return;const t=performance.now()/1000;
 for(const s of Object.values(OW_MARKS))s.visible=false;
 if(hs.i<0||hs.i>=ERRANDS.length)return;hPill();
 const e=ERRANDS[hs.i];hs.t+=dt;
 if(e.id==='milk'&&hs.step===2&&street.bamba.state!=='chase'){hs.step=3;sayText(PEOPLE[4].b,street.bamba.state==='won'?'ותחזיר את הכובע של הבמבה!!!':'שילמת על החלב. לא על המדפים!!!',2.2,'say',true);hFiasco('הפיל את כל המכולת')}
 if(e.id==='vet'){if(hs.step===0&&inVet()){hs.step=1;sayText(recepB,'שם המטופל? ...אתה? אבל אתה עומד... יש לך כובע...',2.6,'say',true);
   setTimeout(()=>{if(!HUMAN)return;sayText(milkyB,'🎩 באתי לאסוף מרשם לאבא',2,'say',true);setTimeout(()=>{if(!HUMAN)return;sayText(vetB,'איזה כלב חכם! מגיע לו... חיסון! 💉',2.2,'say',true);vet.state='idle';startShotChase();hs.step=2},1600)},1400)}
  if(hs.step===2&&vet.state!=='chase'){hs.step=3;hFiasco(vet.shot?'בא לקחת תרופה, קיבל זריקה':'ברח מהמרפאה בלי התרופה')}}
 if(e.id==='pizza'&&hs.step===1&&hs.t>3.5){hs.step=2;hs.fire=1;sayText(chefB,'אש!!! אש בתנור!!! מישהו!!!',2.4,'say',true);if(window.JUICE_READY)pow('🔥 אש!!',OVEN.x,2.6,OVEN.z,true)}
 if(e.id==='pizza'&&hs.fire){for(let i=0;i<3;i++)emit(OVEN.x-.8+(Math.random()-.5)*.6,1.2+Math.random(),OVEN.z+(Math.random()-.5)*.8,(Math.random()-.5)*.6,1.6,(Math.random()-.5)*.6,'smoke',1.4);if(hs.step===3)hs.fire=0}
 if(e.id==='hair'&&hs.step===0){const on=jumpY>.85&&grounded&&insidePlatform(obstacles.find(o=>o.name==='שולחן טיפוח'),pos.x,pos.z,.1);if(inSal()&&!on&&Math.random()<dt*.3)sayText(groomB,'עלה לשולחן, דרלינג',1.6,'say');
  if(on){hs.t2=(hs.t2||0)+dt;holdShow('hairHold',hs.t2,3);if(hs.t2>3){hs.step=1;hs.t2=0;sayText(groomB,'תספורת לבן אדם? בטח! ...רגע, איך עושים את זה?',2.4,'say',true);
   setTimeout(()=>{if(!HUMAN)return;mohawk.visible=true;if(window.JUICE_READY)pow('בזזזזז!',pos.x,2.4,pos.z);setTimeout(()=>{if(!HUMAN)return;sayText(groomB,'אופס... הפעלתי את המייבש',1.8,'say',true);startRagdoll();rag.vx=-7;rag.vz=0;rag.vy=6;hFiasco('יצא עם מוהיקן ורוד')},1200)},1500)}}else hs.t2=0}
 if(e.id==='home'&&hs.step===0&&dad.visible&&Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z)<2.2&&pos.x<6.4){hs.step=1;sayText(milkyB,'🎩 אבא! הבאתי את ה...',1.6,'say',true);
  setTimeout(()=>{if(!HUMAN)return;startRagdoll();rag.vx=Math.sin(yaw)*4;rag.vz=Math.cos(yaw)*4;rag.vy=4;milkG.visible=false;dadMilk.visible=true;for(let i=0;i<20;i++)emit(dad.position.x,2.6,dad.position.z,(Math.random()-.5)*3,2+Math.random()*2,(Math.random()-.5)*3,'foam',.8);
   if(window.JUICE_READY){slowMo(.7);pow('שפריץ!!!',dad.position.x,3,dad.position.z,true)}
   setTimeout(()=>{speakDad('...מילקי. זה היה החלב?');setTimeout(()=>{speakDad('חחחחחח! אתה הכלב הכי מוזר בעולם. בוא לפה');sayDani('תגיד, הכלב הזה... תמיד עמד?');hFiasco('מעד על הכפכף ושפך את החלב על אבא')},1800)},900)},1300)}
}
Object.assign(_holdLabels,{hairHold:'💇 יושב לתספורת...'});
function hApply(on){hat.visible=on;tie.visible=false;if(!on){for(const g of [mohawk,milkG,extG,chefSnow,dadMilk])g.visible=false;extWall.visible=true;hs.i=-1;evtPill.hidden=true;document.getElementById('hEnd').hidden=true}else hStartAll()}
function setHuman(on){HUMAN=on;if(on&&ZOMBIE){ZOMBIE=false;zApply(false)}try{localStorage.setItem('milky-mode',on?'human':'open')}catch(_){}OPEN_WORLD=true;document.body.classList.toggle('openWorld',true);reset();owApply();hApply(on)}
document.getElementById('startHuman').addEventListener('click',()=>{setHuman(true);startGame()});
for(const id of ['start','startOpen','startZombie'])document.getElementById(id).addEventListener('click',()=>{if(HUMAN){HUMAN=false;hApply(false)}},true);
document.getElementById('hAgain').addEventListener('click',()=>{setHuman(true)});
document.getElementById('hQuit').addEventListener('click',()=>{setHuman(false);showBanner('🐕 מילקי חזר להיות כלב')});
{const b=document.createElement('button');b.className='chip';b.type='button';b.textContent='🕺 מילקי בן אדם';b.addEventListener('click',()=>{setHuman(!HUMAN);b.textContent=HUMAN?'🐕 לחזור להיות כלב':'🕺 מילקי בן אדם'});document.getElementById('challengePanel').appendChild(b)}
for(const id of ['modeSwitch','zSwitch'])document.getElementById(id).addEventListener('click',()=>{if(HUMAN){HUMAN=false;hApply(false)}},true);
const _nth3=nextTaskHint;nextTaskHint=function(){if(!HUMAN)return _nth3();if(hs.i<0||hs.i>=ERRANDS.length)return '🎩 מילקי בן אדם';const e=ERRANDS[hs.i];
 if(e.id==='pizza'&&hs.step===2)return hs.hasExt?'🧯 רוץ לתנור ולחץ "לכבות!"':'🧯 המטף על הקיר ליד הדלת!';if(e.id==='milk'&&hs.step===2)return '🏃 ברח מהמוכר!';if(e.id==='vet'&&hs.step===2)return '💉 ברח מהווטרינר... או לא';if(e.id==='hair')return '💇 קפוץ על שולחן הטיפוח ושב 3 שניות';return '👉 '+e.icon+' '+e.name};
const _ct3=currentTarget;currentTarget=function(){if(!HUMAN)return _ct3();if(!guideOn||hs.i<0||hs.i>=ERRANDS.length)return null;return ERRANDS[hs.i].where()};
const _uow2=updateOpenWorld;updateOpenWorld=function(dt){_uow2(dt);if(HUMAN)updateHuman(dt)};
if(HUMAN)OPEN_WORLD=true;
window.HUMAN_READY=true;
setTimeout(()=>{if(HUMAN){owApply();hat.visible=true}},0);
// the story start button kicks off the errands if the saved mode is human
document.getElementById('start').addEventListener('click',()=>{},true);
