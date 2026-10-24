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
const parcelG=new THREE.Group();parcelG.position.set(0,-.2,.68);headPivot.add(parcelG);{box(.34,.26,.3,mat(0xc89b62,.8),0,0,0,parcelG);box(.35,.04,.31,mat(0xe9dcc0),0,.02,0,parcelG)}
const falG=new THREE.Group();falG.position.set(0,-.2,.68);headPivot.add(falG);{const p=cyl(.1,.3,mat(0xf0d9a8,.8),0,0,0,falG);p.rotation.z=Math.PI/2;for(let i=0;i<3;i++)ball(.055,mat(0x7a4e1e),-.08+i*.08,.08,0,falG);ball(.05,mat(0x4caf50),.04,.1,.04,falG)}
const hatFly=new THREE.Group();scene.add(hatFly);{const fm=mat(0x3a3a42,.6);cyl(.3,.04,fm,0,0,0,hatFly);cyl(.18,.2,fm,0,.11,0,hatFly);cyl(.185,.04,mat(0xc0392b),0,.04,0,hatFly)}hatFly.visible=false;hatFly.v=new THREE.Vector3();
const bullRun=makeDog({name:'בולדוזר',color:0x2b2018,color2:0x9c6b3e,size:1.25,speed:7,x:0,z:-90});bullRun.g.visible=false;
const leash=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,1,5),mat(0xc0392b));scene.add(leash);leash.visible=false;
for(const g of [hat,tie,mohawk,milkG,extG,chefSnow,dadMilk,parcelG,falG])g.visible=false;
function humanLegs(moving,dt){const k=Math.min(1,dt*14),s=steps*1.4;
 legs.forEach(l=>{if(l.front){const tg=moving?-1.0+Math.sin(s+(l.s>0?Math.PI:0))*.5:-1.25;l.pivot.rotation.x+=(tg-l.pivot.rotation.x)*k;l.knee.rotation.x+=((moving?.6:.35)-l.knee.rotation.x)*k}
  else{const tg=moving?.05+Math.sin(s+(l.s>0?0:Math.PI))*.55:.05;l.pivot.rotation.x+=(tg-l.pivot.rotation.x)*k;l.knee.rotation.x+=((moving?-Math.max(0,Math.sin(s+(l.s>0?0:Math.PI)))*.6:-.1)-l.knee.rotation.x)*k}});
 torso.rotation.z=Math.sin(s)*.06*(moving?1:0)}
// ---------- errands ----------
const hs={i:-1,step:0,t:0,started:0,score0:0,fiascos:[],hasExt:false,fire:0};
const ERRANDS=[
 {id:'milk',icon:'🥛',name:'לקנות חלב במכולת',par:40,where:()=>V(24.4,0,5)},
 {id:'post',icon:'📦',name:'לשלוח חבילה לסבתא עם השליח',par:35,where:()=>COURIER.g.position},
 {id:'vet',icon:'💊',name:'לאסוף לאבא תרופה מהווטרינר',par:45,where:()=>V(23.2,0,13)},
 {id:'birds',icon:'🕊️',name:'להאכיל יונים עם הזקן',par:35,where:()=>V(BENCH.x+.4,0,BENCH.z+1.3)},
 {id:'pizza',icon:'🍕',name:'להזמין פיצה לארוחת ערב',par:55,where:()=>hs.step===2&&!hs.hasExt?V(EXT_WALL.x+.6,0,EXT_WALL.z):hs.step===2?V(OVEN.x-1.4,0,OVEN.z):V(PCOUNTER.x-1.2,0,PCOUNTER.z)},
 {id:'falafel',icon:'🥙',name:'להביא לדני פלאפל',par:70,where:()=>hs.step===0?V(FALAFEL.x+.9,0,FALAFEL.z-.9):dani.position},
 {id:'hair',icon:'💇',name:'להסתפר במספרה',par:40,where:()=>V(GTABLE.x,.95,GTABLE.z)},
 {id:'parrot',icon:'🦜',name:'ללמד את התוכי להגיד שלום',par:35,where:()=>V(parrot.position.x+1,0,parrot.position.z)},
 {id:'guard',icon:'🦮',name:'לקחת את בולדוזר לטיול',par:50,where:()=>V(19.1,0,42)},
 {id:'home',icon:'🏠',name:'להביא לאבא את החלב',par:35,where:()=>dad.position}
];
const hPill=()=>{if(hs.i<0||hs.i>=ERRANDS.length)return;const e=ERRANDS[hs.i];evtPill.hidden=false;const l=e.icon+' סידור '+(hs.i+1)+'/10: '+e.name;if(evtPill.textContent!==l)evtPill.textContent=l};
function hErrandDone(idx,text){const e=ERRANDS[idx];const t=Math.round((performance.now()-hs.started)/1000);evtPill.hidden=true;hs.i=-2;
 const st=t<=e.par?3:t<=e.par*1.8?2:1;
 if(window.EP_READY&&EP.cur&&EP.cur.id==='human')epFinish(true,st,['🤦 '+text,'⏱️ '+fmtTime(t)+' (ל־3 כוכבים: עד '+fmtTime(e.par)+')','⭐ ניקוד '+score.toLocaleString('he-IL')],e.icon+' סידור '+(idx+1)+' "בוצע"')}
function hStartErrand(i){hs.i=i;hs.step=0;hs.t=0;hs.t2=0;hs.done=-1;hs.fiascos=[];hs.started=performance.now();hs.hasExt=false;hs.fire=0;hs.taught=0;hs.drag=0;
 for(const g of [mohawk,milkG,extG,chefSnow,dadMilk,parcelG,falG])g.visible=false;extWall.visible=true;bullRun.g.visible=false;GUARD.g.visible=true;hat.visible=true;
 if(ERRANDS[i].id==='home')milkG.visible=true;if(ERRANDS[i].id==='post')parcelG.visible=true;
 const e=ERRANDS[i];showBanner(e.icon+' סידור '+(i+1)+': '+e.name);hPill();
 if(i===0)setTimeout(()=>{if(!HUMAN)return;speakDad('מילקי?! למה אתה עומד?! ...ולמה יש לך כובע?!');setTimeout(()=>{if(HUMAN)sayText(milkyB,'🎩 אבא, היום אני עושה את כל הסידורים',2.4,'say',true)},1700)},600)}
function hNext(){hs.i++;hs.step=0;hs.t=0;if(hs.i>=ERRANDS.length){hFinish();return}const e=ERRANDS[hs.i];showBanner(e.icon+' סידור '+(hs.i+1)+': '+e.name);hPill()}
function hFiasco(text){const idx=hs.i;if(hs.done===idx)return;hs.done=idx;hs.fiascos.push(text);addScore(500,'פיאסקו!');if(window.JUICE_READY){slowMo(.5);punch(6);pow('פיאסקו!!',pos.x,2.6,pos.z,true)}setTimeout(()=>{if(HUMAN&&hs.i===idx)hErrandDone(idx,text)},2600)}
function hFinish(){evtPill.hidden=true;showBanner('🎉 כל הסידורים... "בוצעו"');for(let i=0;i<4;i++)setTimeout(()=>showBurst(pos.x+(Math.random()-.5)*2,pos.z+(Math.random()-.5)*2),i*200);
 setTimeout(()=>{const st=document.getElementById('hStats');st.innerHTML='';const time=Math.round((performance.now()-hs.started)/1000);
  for(const l of ['⏱️ '+fmtTime(time),...hs.fiascos.map((f,i)=>ERRANDS[i].icon+' '+f),'⭐ ניקוד '+score.toLocaleString('he-IL')]){const d=document.createElement('div');d.textContent=l;st.appendChild(d)}document.getElementById('hEnd').hidden=false},2400)}
function hBuyMilk(){hs.step=1;sayText(milkyB,'🎩 שלום, חלב אחד בבקשה',2,'say',true);setTimeout(()=>sayText(PEOPLE[4].b,'...כלב עם כובע?! ...טוב, 6 שקל',2.2,'say',true),900);
 setTimeout(()=>{if(!HUMAN)return;milkG.visible=true;sayText(milkyB,'🙂 תודה רבה, יום נעים',1.6,'say',true);
  setTimeout(()=>{if(!HUMAN)return;showBurst(23.6,1.6);showBurst(23.6,8.4);chaosShake=.35;if(window.JUICE_READY){slowMo(.5);pow('קראאאש!!',23.6,2,3,true)}
   sayText(milkyB,'😳 ...הזנב',1.6,'say',true);sayText(PEOPLE[4].b,'המדפים!!! כל הבמבות!!! תפסו אותו!!!',2.4,'say',true);street.bamba.state='chase';street.bamba.t=0;hs.step=2},1500)},2200)}
CTX_HOOKS.act.unshift(()=>{if(!HUMAN||hs.i<0||hs.i>=ERRANDS.length)return null;const e=ERRANDS[hs.i];
 if(e.id==='milk'&&hs.step===0&&pos.x>20.2&&Math.hypot(pos.x-24.4,pos.z-5)<1.6)return {i:'🥛',l:'לקנות חלב',on:1,fn:hBuyMilk};
 if(e.id==='post'&&hs.step===0&&Math.hypot(pos.x-COURIER.g.position.x,pos.z-COURIER.g.position.z)<2)return {i:'📦',l:'לתת חבילה',on:1,fn:hPost};
 if(e.id==='birds'&&hs.step===0&&Math.hypot(pos.x-BENCH.x,pos.z-BENCH.z-1.3)<1.8)return {i:'🕊️',l:'לשבת ולהאכיל',on:1,fn:hBirds};
 if(e.id==='falafel'&&hs.step===0&&inPiz()&&Math.hypot(pos.x-FALAFEL.x,pos.z-FALAFEL.z)<2.2)return {i:'🥙',l:'פלאפל לדני',on:1,fn:hBuyFalafel};
 if(e.id==='falafel'&&hs.step===1&&Math.hypot(pos.x-dani.position.x,pos.z-dani.position.z)<2.2)return {i:'🥙',l:'לתת לדני',on:1,fn:hGiveFalafel};
 if(e.id==='parrot'&&hs.step===0&&Math.hypot(pos.x-parrot.position.x,pos.z-parrot.position.z)<2.8)return {i:'🗣️',l:'ללמד מילה',on:1,fn:hTeach};
 if(e.id==='guard'&&hs.step===0&&pos.x>16.5&&pos.x<19.7&&Math.abs(pos.z-42)<2.6)return {i:'🦮',l:'לקחת לטיול',on:1,fn:hWalkGuard};
 if(e.id==='pizza'&&hs.step===0&&inPiz()&&Math.hypot(pos.x-PCOUNTER.x,pos.z-PCOUNTER.z)<2)return {i:'🍕',l:'להזמין',on:1,fn:hOrder};
 if(e.id==='pizza'&&hs.step===2&&!hs.hasExt&&Math.hypot(pos.x-EXT_WALL.x,pos.z-EXT_WALL.z)<1.6)return {i:'🧯',l:'מטף!',on:1,fn:()=>{hs.hasExt=true;extG.visible=true;extWall.visible=false;sayText(milkyB,'🧯 לא לדאוג! אני מקצוען!',1.8,'say',true)}};
 if(e.id==='pizza'&&hs.step===2&&hs.hasExt&&Math.hypot(pos.x-OVEN.x,pos.z-OVEN.z)<2.6)return {i:'🧯',l:'לכבות!',on:1,fn:hSpray};
 return null});
function hPost(){hs.step=1;parcelG.visible=false;const C=PEOPLE[1];sayText(milkyB,'🎩 חבילה לסבתא, בבקשה. זהירות, שביר',2,'say',true);setTimeout(()=>{if(!HUMAN)return;sayText(C.b,'חבילה? אין בעיה! ...רגע, איפה הכתובת?',2,'say',true);
 setTimeout(()=>{if(!HUMAN)return;sayText(C.b,'אה, כתוב "מילקי". סבבה, אני לוקח גם אותך!',2.2,'say',true);setTimeout(()=>{if(!HUMAN)return;startRagdoll();rag.vx=0;rag.vz=C.dir*9;rag.vy=7;if(window.JUICE_READY){slowMo(.6);pow('משלוח אקספרס!',pos.x,2.6,pos.z,true)}
  sayText(milkyB,'😱 אני לא החבילהההה',1.8,'say',true);hFiasco('נשלח לסבתא במקום החבילה')},1200)},1600)},1000)}
function hBirds(){hs.step=1;hs.t=0;pos.set(BENCH.x+.4,0,BENCH.z+1.2);yaw=Math.PI/2;sayText(milkyB,'🎩 צהריים טובים, אדוני. אפשר להצטרף?',2,'say',true);setTimeout(()=>{if(HUMAN)sayText(PEOPLE[2].b,'כלב עם כובע... שב שב. קח גרעינים',2,'say',true)},1000)}
function hBuyFalafel(){hs.step=1;hs.temp=0;falG.visible=true;sayText(milkyB,'🎩 מנה אחת לדני. בלי סחוג... בעצם עם',2,'say',true);setTimeout(()=>{if(HUMAN)sayText(chefB,'כלב שקונה לבן אדם פלאפל. ראיתי הכל',2,'say',true)},900)}
function hGiveFalafel(){hs.step=2;sayText(milkyB,'🎩 דני! הבאתי לך פלא...',1.4,'say',true);setTimeout(()=>{if(!HUMAN)return;falG.visible=false;milkyThought('😋',1,true);sayText(milkyB,'👄 *גאמפ*',1.4,'say',true);
 setTimeout(()=>{if(!HUMAN)return;sayText(milkyB,'🔥🔥🔥 הסחוג!!!',1.8,'say',true);for(let i=0;i<30;i++)setTimeout(()=>emit(pos.x+Math.sin(yaw)*.7,1.3,pos.z+Math.cos(yaw)*.7,Math.sin(yaw)*4+(Math.random()-.5),1+Math.random(),Math.cos(yaw)*4+(Math.random()-.5),'smoke',1),i*40);sayDani('...היה לי פלאפל. לשנייה אחת. היה לי.');hFiasco('אכל לדני את הפלאפל (עם סחוג)')},1100)},1000)}
const TEACH=[['🎩 תגיד: שלום!','...שוווום?'],['🎩 תגיד: תודה רבה!','תוווודה... במבה!'],['🎩 תגיד: אבא הכי טוב!','אבא... אבא...']];
function hTeach(){if(hs.teachCool>0)return;hs.teachCool=2.2;const k=hs.taught||0;sayText(milkyB,TEACH[k][0],2,'say',true);setTimeout(()=>{if(HUMAN)sayText(parrotB,TEACH[k][1],2,'say',true)},900);street.parrotT=6;hs.taught=k+1;
 if(hs.taught>=3){hs.step=1;setTimeout(()=>{if(!HUMAN)return;sayText(parrotB,'אבא קירח!!! אבא קירח!!! אבא קירח!!!',2.6,'say',true);if(window.JUICE_READY)pow('אבא קירח!!',parrot.position.x,4.6,parrot.position.z,true);
  setTimeout(()=>{if(!HUMAN)return;sayText(milkyB,'😳 את זה לא אני לימדתי!!',1.8,'say',true);sayText(PEOPLE[2].b,'חחחח! זה דני לימד אותו אתמול',2.2,'say',true);hFiasco('התוכי למד מילה אחת... על אבא')},1600)},2200)}}
function hWalkGuard(){hs.step=1;sayText(milkyB,'🎩 בולדוזר, חבר. בוא לטיול רגוע',2,'say',true);setTimeout(()=>{if(!HUMAN)return;sayText(GUARD.b,'וואף?! ...טיול?! טיוללללל!!!',1.8,'say',true);
 setTimeout(()=>{if(!HUMAN)return;GUARD.g.visible=false;bullRun.g.visible=true;bullRun.g.position.set(16.5,0,42);bullRun.g.rotation.y=Math.PI;leash.visible=true;hs.step=2;hs.drag=0;if(window.JUICE_READY)pow('טיולללל!!!',pos.x,2.6,pos.z,true);sayText(milkyB,'😱 לאט!!! לאאאאט!!!',2,'say',true)},1300)},1100)}
function hOrder(){hs.step=1;hs.t=0;sayText(milkyB,'🎩 משפחתית אחת, בלי זיתים',2,'say',true);setTimeout(()=>sayText(chefB,'כלב שמזמין פיצה?! מאמא מיה... 10 דקות!',2.2,'say',true),900)}
function hSpray(){hs.step=3;hs.fire=0;for(let i=0;i<60;i++)setTimeout(()=>{const a=yaw+(Math.random()-.5)*.6;emit(pos.x+Math.sin(yaw)*.6,1.6,pos.z+Math.cos(yaw)*.6,Math.sin(a)*6,(Math.random()-.2)*2,Math.cos(a)*6,'foam',.9)},i*25);
 setTimeout(()=>{chefSnow.visible=true;extG.visible=false;sayText(chefB,'...😶 אתה כלב או כבאי?!',2.4,'say',true);sayText(milkyB,'🧯 כיבוי וגילוי אש, מקצוען!',2.2,'say',true);hFiasco('כיבה את התנור... ואת השף')},1500)}
function hStartAll(){hs.i=-1;hs.done=-1;hs.fiascos=[];hs.started=performance.now();hs.hasExt=false;hs.fire=0;for(const g of [mohawk,milkG,extG,chefSnow,dadMilk])g.visible=false;extWall.visible=true;
 setTimeout(()=>{if(!HUMAN)return;speakDad('מילקי?! למה אתה עומד?! ...ולמה יש לך עניבה?!');setTimeout(()=>{sayText(milkyB,'🎩 אבא, היום אני עושה את כל הסידורים',2.4,'say',true);setTimeout(()=>{sayDani('מה... קורה... פה');hNext()},2000)},1700)},600)}
function updateHuman(dt){
 if(!HUMAN)return;const t=performance.now()/1000;
 for(const s of Object.values(OW_MARKS))s.visible=false;
 if(hatFly.visible){hatFly.position.addScaledVector(hatFly.v,dt);hatFly.rotation.y+=dt*5;if(hatFly.position.y>14)hatFly.visible=false}
 if(hs.i<0||hs.i>=ERRANDS.length)return;hPill();
 const e=ERRANDS[hs.i];hs.t+=dt;
 if(e.id==='milk'&&hs.step===2&&street.bamba.state!=='chase'){hs.step=3;sayText(PEOPLE[4].b,street.bamba.state==='won'?'ותחזיר את הכובע של הבמבה!!!':'שילמת על החלב. לא על המדפים!!!',2.2,'say',true);hFiasco('הפיל את כל המכולת')}
 if(e.id==='vet'){if(hs.step===0&&inVet()){hs.step=1;sayText(recepB,'שם המטופל? ...אתה? אבל אתה עומד... יש לך כובע...',2.6,'say',true);
   setTimeout(()=>{if(!HUMAN)return;sayText(milkyB,'🎩 באתי לאסוף מרשם לאבא',2,'say',true);setTimeout(()=>{if(!HUMAN)return;sayText(vetB,'איזה כלב חכם! מגיע לו... חיסון! 💉',2.2,'say',true);vet.state='idle';startShotChase();hs.step=2},1600)},1400)}
  if(hs.step===2&&vet.state!=='chase'){hs.step=3;hFiasco(vet.shot?'בא לקחת תרופה, קיבל זריקה':'ברח מהמרפאה בלי התרופה')}}
 if(e.id==='pizza'&&hs.step===1&&hs.t>3.5){hs.step=2;hs.fire=1;sayText(chefB,'אש!!! אש בתנור!!! מישהו!!!',2.4,'say',true);if(window.JUICE_READY)pow('🔥 אש!!',OVEN.x,2.6,OVEN.z,true)}
 if(e.id==='pizza'&&hs.fire){for(let i=0;i<3;i++)emit(OVEN.x-.8+(Math.random()-.5)*.6,1.2+Math.random(),OVEN.z+(Math.random()-.5)*.8,(Math.random()-.5)*.6,1.6,(Math.random()-.5)*.6,'smoke',1.4);if(hs.step===3)hs.fire=0}
 hs.teachCool=Math.max(0,(hs.teachCool||0)-dt);
 if(e.id==='birds'&&hs.step===1){pos.set(BENCH.x+.4,0,BENCH.z+1.2);yaw=Math.PI/2;curSpeed=0;hs.t2+=dt;holdShow('birdHold',hs.t2,5);
  if(hs.t2>5){hs.step=2;sayText(PEOPLE[2].b,'רגע! לא את כל השקית!',1.8,'say',true);for(const p of PIGEONS){p.fly=4;p.v.set((pos.x-p.g.position.x)*.8,5,(pos.z-p.g.position.z)*.8)}
   setTimeout(()=>{if(!HUMAN)return;hat.visible=false;hatFly.visible=true;hatFly.position.set(pos.x,2.2,pos.z);hatFly.v.set(1.5,3,-2);sayText(milkyB,'😱 הכובע!!! יונים גנבות!!!',1.8,'say',true);if(window.JUICE_READY)pow('פררררר!',pos.x,2.4,pos.z,true);for(let i=0;i<14;i++)emit(pos.x,1.8,pos.z,(Math.random()-.5)*4,2+Math.random()*2,(Math.random()-.5)*4,'foam',.9);
    sayText(PEOPLE[2].b,'חחחח! הן אוהבות כובעים. גם את שלי לקחו ב־1987',2.4,'say',true);hFiasco('היונים גנבו לו את הכובע')},900)}}
 if(e.id==='falafel'&&hs.step===1){hs.temp=(hs.temp||0)+dt;if(hs.temp>9){hs.temp=0;sayText(milkyB,pick(['😋 רק ביס אחד...','🤤 לא! זה של דני!','👃 זה מריח כל כך טוב...','🎩 אני בן אדם. בני אדם מתאפקים.']),1.8,'think',true)}}
 if(e.id==='guard'&&hs.step===2){hs.drag+=dt;const b=bullRun.g.position;const tz=10.5,tx=b.z>16?14.5:17.6;const dx=tx-b.x,dz=tz-b.z,d=Math.hypot(dx,dz);const sp=7.5;if(d>.3){b.x+=dx/d*sp*dt;b.z+=dz/d*sp*dt;bullRun.g.rotation.y=Math.atan2(dx,dz)}
  bullRun.walk+=sp*dt*2.2;bullRun.legs.forEach((l,i)=>l.rotation.x=Math.sin(bullRun.walk+(i===0||i===3?0:Math.PI))*.9);bullRun.tail.rotation.z=Math.sin(t*18)*.7;
  if(!rag.active){pos.set(b.x-Math.sin(bullRun.g.rotation.y)*1.8,0,b.z-Math.cos(bullRun.g.rotation.y)*1.8);yaw=bullRun.g.rotation.y;curSpeed=6}
  leash.position.set((b.x+pos.x)/2,.9,(b.z+pos.z)/2);leash.scale.y=Math.hypot(b.x-pos.x,b.z-pos.z);leash.lookAt(b.x,.9,b.z);leash.rotateX(Math.PI/2);
  if(Math.random()<dt*.8)sayText(milkyB,pick(['😱 אאאאאא','🎩 זה טיול רגוע?!','😵 בולדוזר!!!']),1,'say',true);
  if(d<.6||hs.drag>9){hs.step=3;leash.visible=false;startRagdoll();rag.vx=4;rag.vz=0;rag.vy=4;showBurst(18.7,9.6);chaosShake=.35;sayText(GUARD.b,'וואף! וואף! ...פחים! הכי טוב!',2,'say',true);if(window.JUICE_READY){slowMo(.5);pow('בום! לפחים!',18.7,2,9.6,true)}hFiasco('בולדוזר לקח אותו לטיול... לפחים')}}
 if(e.id==='hair'&&hs.step===0){const on=jumpY>.85&&grounded&&insidePlatform(obstacles.find(o=>o.name==='שולחן טיפוח'),pos.x,pos.z,.1);if(inSal()&&!on&&Math.random()<dt*.3)sayText(groomB,'עלה לשולחן, דרלינג',1.6,'say');
  if(on){hs.t2=(hs.t2||0)+dt;holdShow('hairHold',hs.t2,3);if(hs.t2>3){hs.step=1;hs.t2=0;sayText(groomB,'תספורת לבן אדם? בטח! ...רגע, איך עושים את זה?',2.4,'say',true);
   setTimeout(()=>{if(!HUMAN)return;mohawk.visible=true;if(window.JUICE_READY)pow('בזזזזז!',pos.x,2.4,pos.z);setTimeout(()=>{if(!HUMAN)return;sayText(groomB,'אופס... הפעלתי את המייבש',1.8,'say',true);startRagdoll();rag.vx=-7;rag.vz=0;rag.vy=6;hFiasco('יצא עם מוהיקן ורוד')},1200)},1500)}}else hs.t2=0}
 if(e.id==='home'&&hs.step===0&&dad.visible&&Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z)<2.2&&pos.x<6.4){hs.step=1;sayText(milkyB,'🎩 אבא! הבאתי את ה...',1.6,'say',true);
  setTimeout(()=>{if(!HUMAN)return;startRagdoll();rag.vx=Math.sin(yaw)*4;rag.vz=Math.cos(yaw)*4;rag.vy=4;milkG.visible=false;dadMilk.visible=true;for(let i=0;i<20;i++)emit(dad.position.x,2.6,dad.position.z,(Math.random()-.5)*3,2+Math.random()*2,(Math.random()-.5)*3,'foam',.8);
   if(window.JUICE_READY){slowMo(.7);pow('שפריץ!!!',dad.position.x,3,dad.position.z,true)}
   setTimeout(()=>{speakDad('...מילקי. זה היה החלב?');setTimeout(()=>{speakDad('חחחחחח! אתה הכלב הכי מוזר בעולם. בוא לפה');sayDani('תגיד, הכלב הזה... תמיד עמד?');hFiasco('מעד על הכפכף ושפך את החלב על אבא')},1800)},900)},1300)}
}
Object.assign(_holdLabels,{hairHold:'💇 יושב לתספורת...',birdHold:'🕊️ מאכיל יונים...'});
function hApply(on){hat.visible=on;tie.visible=false;hs.i=-1;if(!on){for(const g of [mohawk,milkG,extG,chefSnow,dadMilk,parcelG,falG,hatFly,leash])g.visible=false;bullRun.g.visible=false;GUARD.g.visible=true;extWall.visible=true;evtPill.hidden=true;document.getElementById('hEnd').hidden=true}}
function setHuman(on){if(on)allModesOff('human');HUMAN=on;try{localStorage.setItem('milky-mode',on?'human':'open')}catch(_){}OPEN_WORLD=true;document.body.classList.toggle('openWorld',true);reset();owApply();hApply(on)}
document.getElementById('startHuman').addEventListener('click',()=>{if(window.EP_READY)epBoard('human');else{setHuman(true);startGame()}});
for(const id of ['start','startOpen','startZombie'])document.getElementById(id).addEventListener('click',()=>{if(HUMAN){HUMAN=false;hApply(false)}},true);
document.getElementById('hAgain').addEventListener('click',()=>{setHuman(true)});
document.getElementById('hQuit').addEventListener('click',()=>{setHuman(false);showBanner('🐕 מילקי חזר להיות כלב')});
{const b=document.createElement('button');b.className='chip';b.type='button';b.textContent='🕺 מילקי בן אדם';b.addEventListener('click',()=>{setHuman(!HUMAN);b.textContent=HUMAN?'🐕 לחזור להיות כלב':'🕺 מילקי בן אדם'});document.getElementById('challengePanel').appendChild(b)}
for(const id of ['modeSwitch','zSwitch'])document.getElementById(id).addEventListener('click',()=>{if(HUMAN){HUMAN=false;hApply(false)}},true);
const _nth3=nextTaskHint;nextTaskHint=function(){if(!HUMAN)return _nth3();if(hs.i<0||hs.i>=ERRANDS.length)return '🎩 מילקי בן אדם';const e=ERRANDS[hs.i];if(e.id==='post'&&hs.step===0)return '📦 תעמוד מול השליח על הקורקינט ותן לו את החבילה';if(e.id==='birds'&&hs.step===0)return '🕊️ לספסל של הזקן';if(e.id==='falafel')return hs.step===0?'🥙 דוכן הפלאפל בפיצרייה':'🥙 תביא לדני את הפלאפל (בלי לאכול!)';if(e.id==='parrot')return '🦜 תעמוד מתחת לתוכי ותלמד אותו ('+(hs.taught||0)+'/3)';if(e.id==='guard'&&hs.step===0)return '🦮 לגדר של בולדוזר בסוף הרחוב';
 if(e.id==='pizza'&&hs.step===2)return hs.hasExt?'🧯 רוץ לתנור ולחץ "לכבות!"':'🧯 המטף על הקיר ליד הדלת!';if(e.id==='milk'&&hs.step===2)return '🏃 ברח מהמוכר!';if(e.id==='vet'&&hs.step===2)return '💉 ברח מהווטרינר... או לא';if(e.id==='hair')return '💇 קפוץ על שולחן הטיפוח ושב 3 שניות';return '👉 '+e.icon+' '+e.name};
const _ct3=currentTarget;currentTarget=function(){if(!HUMAN)return _ct3();if(!guideOn||hs.i<0||hs.i>=ERRANDS.length)return null;return ERRANDS[hs.i].where()};
const _uow2=updateOpenWorld;updateOpenWorld=function(dt){_uow2(dt);if(HUMAN)updateHuman(dt)};
if(HUMAN)OPEN_WORLD=true;
window.HUMAN_READY=true;
setTimeout(()=>{if(HUMAN){owApply();hat.visible=true}},0);
// the story start button kicks off the errands if the saved mode is human
document.getElementById('start').addEventListener('click',()=>{},true);
