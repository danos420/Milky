// ===== Saturday: Milky's birthday. Everyone "forgot"... then a surprise party, cake and a group hug =====
WEEK[6].soon=false;WEEK[6].short='יום הולדת';WEEK[6].intro='🎂 שבת: היום יום ההולדת של מילקי! ...אבל נראה שכולם שכחו';
PHASE_SETS.party=[
 {name:'בוקר',icon:'🎂',banner:'🎂 יום הולדת למילקי! ...ואף אחד לא אומר כלום?!',tasks:[
  {id:'sadFace',label:'🥺 פרצוף עצוב לאבא',tip:'כפתור הבעה עד 🥺, ליד אבא'},
  {id:'balloons3',label:'🎈 למצוא 3 בלונים מוחבאים',tip:'אחד על המיטה, אחד במטבח, אחד גבוה מעל הטרמפולינה'},
  {id:'spy',label:'🕵️ לרגל אחרי דני במטבח',tip:'תעמוד ליד דני במטבח 3 שניות בלי לזוז'},
  {id:'gift',label:'🎁 למצוא קופסה מסתורית בחצר',tip:'מאחורי המחסן'}]},
 {name:'צהריים',icon:'🎉',banner:'🎉 הפתעה!!! כולם מחכים בסלון!',tasks:[
  {id:'surprise',label:'🎉 להיכנס למסיבה בסלון',tip:'כולם בסלון'},
  {id:'pop5',label:'🎈 לפוצץ 5 בלונים',tip:'קפוץ לתוך הבלונים המרחפים'},
  {id:'tricks',label:'🦴 3 טריקים שונים מול כולם',tip:'כפתור 🦴 שלוש פעמים'},
  {id:'dogFriends',label:'🐕 לשחק עם החברים מהגינה',tip:'רקס, בונבון וצ\'ופי באו למסיבה!'}]},
 {name:'ערב',icon:'🕯️',banner:'🕯️ העוגה! כולם שרים',tasks:[
  {id:'candles',label:'🕯️ לכבות את הנרות',tip:'קפוץ על שולחן הסלון, כפתור פעולה ליד העוגה'},
  {id:'cakeFace',label:'🎂 לטרוף את העוגה עם הפרצוף',tip:'אחרי הנרות. כפתור פעולה'},
  {id:'unwrap',label:'🎁 לפתוח את המתנה',tip:'המתנה ליד הספה. כפתור תפיסה'},
  {id:'groupHug',label:'❤️ חיבוק קבוצתי',tip:'אחרי העוגה: תעמוד באמצע הסלון'}]}
];
const bd={on:false,phase:-1,found:new Set(),spyT:0,popped:0,tricks:new Set(),dogs:new Set(),lit:true,eaten:false,opened:false,hugT:0,creamT:0};
// hidden balloons (morning)
const HID=[{x:3.5,y:1.2,z:-6.4},{x:5.3,y:1.0,z:10.3},{x:14,y:3.4,z:-17}];
const balloonMats=[0xe74c3c,0xf2c14e,0x3a7bd5,0x7fb069,0xe98ab0,0x9b59b6].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.35}));
function makeBalloon(i,s=1){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.SphereGeometry(.28*s,16,12),balloonMats[i%6]);b.scale.y=1.18;g.add(b);
 const k=new THREE.Mesh(new THREE.ConeGeometry(.05*s,.08*s,8),balloonMats[i%6]);k.position.y=-.34*s;k.rotation.x=Math.PI;g.add(k);
 const str=new THREE.Mesh(new THREE.CylinderGeometry(.005,.005,.8*s,4),new THREE.MeshBasicMaterial({color:0xffffff}));str.position.y=-.78*s;g.add(str);scene.add(g);return g}
const hidB=HID.map((h,i)=>{const g=makeBalloon(i);g.position.set(h.x,h.y,h.z);g.visible=false;return g});
// mysterious gift box
const giftBox=new THREE.Group();scene.add(giftBox);
{box(.7,.55,.7,mat(0x3a7bd5,.6),0,.28,0,giftBox);box(.74,.06,.16,mat(0xf2c14e),0,.57,0,giftBox);box(.16,.06,.74,mat(0xf2c14e),0,.57,0,giftBox);
 const lid=new THREE.Group();lid.position.y=.58;giftBox.add(lid);box(.76,.12,.76,mat(0x3a7bd5,.6),0,.06,0,lid);ball(.12,mat(0xf2c14e),0,.17,0,lid).scale.set(1.5,.7,.7);giftBox.userData.lid=lid;
 const gb=ball(.2,new THREE.MeshStandardMaterial({color:0xffd34d,emissive:0x7a5200,roughness:.25,metalness:.6}),0,.3,0,giftBox);gb.visible=false;giftBox.userData.ball=gb}
giftBox.visible=false;const GIFT_YARD={x:16.5,z:-29.2},GIFT_HOME={x:-3,z:5.4};
// party decorations
const partyDeco=new THREE.Group();scene.add(partyDeco);partyDeco.visible=false;
{const cv=document.createElement('canvas');cv.width=1024;cv.height=160;const g=cv.getContext('2d');
 const cols=['#e74c3c','#f2c14e','#3a7bd5','#7fb069','#e98ab0','#9b59b6'];for(let i=0;i<16;i++){g.fillStyle=cols[i%6];g.beginPath();g.moveTo(i*64,0);g.lineTo(i*64+64,0);g.lineTo(i*64+32,52);g.fill()}
 g.fillStyle='#fff6dc';g.strokeStyle='#5a3a12';g.lineWidth=10;g.font='bold 72px system-ui,Arial';g.textAlign='center';g.textBaseline='middle';g.direction='rtl';g.strokeText('🎉 יום הולדת שמח מילקי! 🎉',512,108);g.fillText('🎉 יום הולדת שמח מילקי! 🎉',512,108);
 const tx=new THREE.CanvasTexture(cv);const p=new THREE.Mesh(new THREE.PlaneGeometry(7,1.1),new THREE.MeshBasicMaterial({map:tx,transparent:true,toneMapped:false}));p.position.set(0,3.1,8.82);p.rotation.y=Math.PI;partyDeco.add(p)}
for(const [x,z,n] of [[-5.6,-7.8,3],[5.5,-7.6,3],[-5.6,7.6,2],[5.2,4.6,3]])for(let i=0;i<n;i++){const b=makeBalloon(i+n,1);scene.remove(b);b.position.set(x+(i-1)*.35,2.2+(i%2)*.3,z);partyDeco.add(b)}
const popB=[];for(let i=0;i<6;i++){const g=makeBalloon(i,1.15);g.visible=false;popB.push({g,x:-3.5+i*1.4,z:-4+(i%2)*3.2,y:1.55+(i%3)*.35,popped:false})}
// cake
const cake=new THREE.Group();cake.position.set(.2,.92,.6);scene.add(cake);cake.visible=false;
{cyl(.42,.04,mat(0xffffff,.4),0,.02,0,cake);const l1=cyl(.36,.24,mat(0x6b3a1e,.7),0,.16,0,cake);const top=new THREE.Group();cake.add(top);cyl(.37,.06,mat(0xfff1e0,.6),0,.31,0,top);const l2=cyl(.24,.2,mat(0x6b3a1e,.7),0,.44,0,top);cyl(.25,.05,mat(0xfff1e0,.6),0,.56,0,top);
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2;ball(.04,mat(0xe74c3c,.4),Math.cos(a)*.3,.35,Math.sin(a)*.3,top)}
 const flames=[];for(let i=0;i<5;i++){const a=i/5*Math.PI*2;cyl(.015,.14,mat(i%2?0x3a7bd5:0xe98ab0),Math.cos(a)*.14,.65,Math.sin(a)*.14,top);const f=new THREE.Mesh(new THREE.ConeGeometry(.028,.08,8),new THREE.MeshBasicMaterial({color:0xffb020,toneMapped:false}));f.position.set(Math.cos(a)*.14,.76,Math.sin(a)*.14);top.add(f);flames.push(f)}
 cake.userData={top,flames}}
const creamFace=ball(.13,mat(0xfff6ea,.6),0,-.02,.66,headPivot);creamFace.scale.set(1.3,.9,.8);creamFace.visible=false;
const BDAY_SPOTS=[[-2.2,0,-2.6],[2.2,0,-2.8],[-1.4,0,-4.6],[1.2,0,-4.8]],BDAY_DAD={x:2.8,z:-1.2},BDAY_DANI={x:-2.6,z:-1};
function bdayResetProps(){bd.on=false;bd.phase=-1;bd.found.clear();bd.popped=0;bd.tricks.clear();bd.dogs.clear();bd.lit=true;bd.eaten=false;bd.opened=false;bd.creamT=0;
 hidB.forEach(b=>b.visible=false);giftBox.visible=false;giftBox.userData.lid.position.set(0,.58,0);giftBox.userData.lid.rotation.set(0,0,0);giftBox.userData.ball.visible=false;partyDeco.visible=false;popB.forEach(p=>{p.g.visible=false;p.popped=false});
 cake.visible=false;cake.userData.top.visible=true;cake.userData.flames.forEach(f=>f.visible=true);creamFace.visible=false;
 if(PARTY_DOGS){PARTY_DOGS=false;DOGS.forEach(d=>{d.zone='park';d.g.position.copy(d.home);pickSpot(d)})}
 if(dadState==='bday')setDadState('rest');if(daniState==='bday')daniState='cook';if(typeof applyModes==='function')applyModes(true)}
const _origReset5=bathResetProps;bathResetProps=function(){_origReset5();bdayResetProps()};
DAY_HOOKS.party=(phase,fresh)=>{
 bd.on=true;bd.phase=phase;fam.on=true;fam.day='party';fam.phase=phase;
 if(phase===0){hidB.forEach(b=>b.visible=true);giftBox.visible=true;giftBox.position.set(GIFT_YARD.x,0,GIFT_YARD.z);
  if(started)setTimeout(()=>{if(bd.on&&bd.phase===0){speakDad('בוקר טוב מילקי. סתם יום רגיל היום. שום דבר מיוחד. בכלל.');setTimeout(()=>sayDani('כן... יום רגיל לגמרי... 😅'),1600)}},1200)}
 if(phase===1){partyDeco.visible=true;popB.forEach(p=>{p.g.visible=true;p.g.position.set(p.x,p.y,p.z)});hidB.forEach(b=>b.visible=false);giftBox.visible=false;
  guestsShow(true);GUESTS.forEach((g,i)=>{g.P.g.position.set(BDAY_SPOTS[i][0],0,BDAY_SPOTS[i][2]);g.tx=BDAY_SPOTS[i][0];g.tz=BDAY_SPOTS[i][2];g.P.nav.path=[]});
  PARTY_DOGS=true;DOGS.forEach((d,i)=>{d.zone='home';d.g.position.set(-3+i*3,0,2.5);pickSpot(d)});
  if(dadSeated)unseatDad();dad.position.set(BDAY_DAD.x,0,BDAY_DAD.z);setDadState('bday');daniState='bday';dani.position.set(BDAY_DANI.x,0,BDAY_DANI.z);daniNav.path=[];
  WEAR.party.visible=true;sayDani('מילקי!!! בוא לסלון! מהר!')}
 if(phase===2){cake.visible=true;giftBox.visible=true;giftBox.position.set(GIFT_HOME.x,0,GIFT_HOME.z);
  GUESTS.forEach(g=>{g.tx=(Math.random()-.5)*3;g.tz=-1.4+(Math.random()-.5)*2});
  setTimeout(()=>{if(!bd.on)return;['🎶 יום הולדת שמח!','🎶 יום הולדת לך!','🎶 מילקי מילקי!','🎶 הייי!'].forEach((l,i)=>setTimeout(()=>sayText(GUESTS[i].b,l,2,'say',true),i*350));speakDad('🎶 יום הולדת שמח, מילקי שלי!')},500)}
};
function confetti(x,z,n=1){for(let i=0;i<n;i++)setTimeout(()=>showBurst(x+(Math.random()-.5)*2,z+(Math.random()-.5)*2),i*180)}
function blowCandles(){if(!bd.lit)return;bd.lit=false;cake.userData.flames.forEach(f=>f.visible=false);dayEvent('candles');addScore(500,'משאלה!');confetti(cake.position.x,cake.position.z,3);
 if(window.JUICE_READY){slowMo(.6);punch(6);pow('פוווו!',cake.position.x,1.8,cake.position.z,true)}
 for(let i=0;i<8;i++)emit(cake.position.x,1.7,cake.position.z,(Math.random()-.5)*.6,.8,(Math.random()-.5)*.6,'smoke',1.6);
 GUESTS.forEach(g=>{if(g.P.g.visible){thought(g.b,'👏',1.8,true)}});thought(dadB,'🥹',2,true);sayDani('איזו משאלה ביקשת, מילקי? ...נקניקייה, נכון?')}
function eatCake(){if(bd.lit||bd.eaten)return;bd.eaten=true;cake.userData.top.visible=false;creamFace.visible=true;bd.creamT=18;dayEvent('cakeFace');addScore(400,'פרצוף עוגה!');
 if(window.JUICE_READY)pow('נום נום!',cake.position.x,1.6,cake.position.z,true);sayText(GUESTS[2].b,'חחחחח הוא אכל הכל!!',2,'say',true);speakDad('חחחח! מילקי! זה היה גם בשבילנו!')}
function openGift(){if(bd.opened)return;bd.opened=true;dayEvent('unwrap');addScore(500,'מתנה!');confetti(giftBox.position.x,giftBox.position.z,3);
 giftBox.userData.ball.visible=true;bd.lidT=1;if(window.JUICE_READY){slowMo(.5);pow('🎁 וואו!!',giftBox.position.x,1.6,giftBox.position.z,true)}
 save.mods.bday=true;writeSave();if(typeof checkUnlocks==='function')checkUnlocks();
 sayDani('כדור זהב! ...וגם כתר. אתה מלך, מילקי 👑');addActivity('👑 מתנת יום הולדת: כתר המלך נפתח! (בתפריט 🎭)')}
CTX_HOOKS.act.push(()=>{if(!bd.on||bd.phase<2||!cake.visible)return null;const onT=jumpY>.85&&insidePlatform(obstacles.find(o=>o.name==='שולחן'),pos.x,pos.z,.05),d=Math.hypot(pos.x-cake.position.x,pos.z-cake.position.z);
 if(d<1.4&&(onT||d<1.0)){if(bd.lit)return {i:'🕯️',l:'נשוף!',on:1,fn:blowCandles};if(!bd.eaten)return {i:'🎂',l:'לטרוף!',on:1,fn:eatCake}}return null});
CTX_HOOKS.grab.push(()=>bd.on&&bd.phase===2&&!bd.opened&&giftBox.visible&&Math.hypot(pos.x-giftBox.position.x,pos.z-giftBox.position.z)<1.5?{i:'🎁',l:'פתח מתנה!',on:1,fn:openGift}:null);
const _origFinished=weekFinished;weekFinished=function(stars){_origFinished(stars);if(week.cur===6){setTimeout(()=>{const n=document.getElementById('dayNext');n.textContent='🏆 השבוע של מילקי הושלם! תודה שהיית חלק מהבלגן ❤️ — מילקי, אבא ודני';showBanner('🏆 השבוע הושלם! מילקי הכלב הכי אהוב בעולם');confetti(pos.x,pos.z,4)},2100)}};
function updateBirthday(dt){
 const t=performance.now()/1000;
 if(bd.creamT>0){bd.creamT-=dt;if(bd.creamT<=0)creamFace.visible=false}
 if(bd.lidT>0){bd.lidT=Math.max(0,bd.lidT-dt*1.5);const k=1-bd.lidT,L=giftBox.userData.lid;L.position.set(k*.8,.58+Math.sin(k*Math.PI)*1.2,0);L.rotation.z=-k*2.5;giftBox.userData.ball.position.y=.3+k*.5}
 if(!bd.on)return;
 const dd=Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z);
 if(bd.phase===0){
  hidB.forEach((b,i)=>{if(!b.visible)return;b.position.y=HID[i].y+Math.sin(t*2+i)*.1;if(Math.hypot(pos.x-b.position.x,pos.z-b.position.z)<1.0&&Math.abs(jumpY+1.1*MS-b.position.y)<1.1){b.visible=false;bd.found.add(i);addScore(200,'בלון '+bd.found.size+'/3');if(window.JUICE_READY)pow('🎈 '+bd.found.size+'/3');milkyThought('🎈',1.4,true);if(bd.found.size>=3){dayEvent('balloons3');sayText(milkyB,'🤔 בלונים... מישהו מתכנן משהו',2.4,'think',true)}}});
  if(mood===3&&dd<2.8&&!day.done.has('sadFace')){dayEvent('sadFace');speakDad(pick(['מה? היום? לא... לא קורה כלום היום. בכלל. ...למה אתה מסתכל עליי ככה?','אל תעשה לי את הפרצוף הזה... אני לא אגלה!']));thought(dadB,'😅',2,true)}
  if(Math.hypot(pos.x-dani.position.x,pos.z-dani.position.z)<3.2&&lastDogSpeed<1.2){bd.spyT+=dt;holdShow('spy',bd.spyT,3);if(bd.spyT>3&&!day.done.has('spy')){dayEvent('spy');sayDani('מה? אני? סתם מבשל! אין פה שום עוגה! ...לך מפה!');thought(daniB,'😳',2,true)}}else bd.spyT=0;
  if(giftBox.visible&&Math.hypot(pos.x-GIFT_YARD.x,pos.z-GIFT_YARD.z)<1.3&&!day.done.has('gift')){dayEvent('gift');speakDad('לא!!! זה... זה של השכן! אל תיגע!');milkyThought('🤨',1.8,true);sayText(nbB,'מה? זה לא שלי',1.8,'say')}
 }
 if(bd.phase===1){
  if(Math.abs(pos.x)<6.3&&pos.z>-8.8&&pos.z<8.8&&!day.done.has('surprise')){dayEvent('surprise');confetti(pos.x,pos.z,4);if(window.JUICE_READY){slowMo(.7);punch(7);pow('הפתעה!!!',pos.x,2.4,pos.z,true)}
   GUESTS.forEach(g=>sayText(g.b,'הפתעה!!! 🎉',2,'say',true));speakDad('הפתעה!!! חשבת ששכחנו?!');sayDani('יום הולדת שמח, מילקי!!! 🎂');DOGS.forEach(d=>thought(d.b,'🎉',1.8,true))}
  popB.forEach(p=>{if(p.popped)return;p.g.position.y=p.y+Math.sin(t*1.8+p.x)*.15;const hy=jumpY+1.5*MS;if(Math.hypot(pos.x-p.g.position.x,pos.z-p.g.position.z)<.85&&Math.abs(hy-p.g.position.y)<.7){p.popped=true;p.g.visible=false;bd.popped++;
   if(window.JUICE_READY){pow('פאק!',p.g.position.x,p.g.position.y+.4,p.g.position.z);hitStop(.04)}playToySound(900,.05,'square');showBurst(p.g.position.x,p.g.position.z);addScore(100,'בלון '+bd.popped);if(bd.popped>=5)dayEvent('pop5')}});
  if(trainingTime>1.45&&activeCmd&&!bd.tricks.has(activeCmd)){bd.tricks.add(activeCmd);addActivity('🦴 טריק: '+activeCmd+' ('+bd.tricks.size+'/3)');GUESTS.forEach(g=>{if(g.P.g.visible&&Math.random()<.6)thought(g.b,'👏',1.4,true)});if(bd.tricks.size>=3)dayEvent('tricks')}
  DOGS.forEach(d=>{if(!bd.dogs.has(d.name)&&Math.hypot(pos.x-d.g.position.x,pos.z-d.g.position.z)<1.9){bd.dogs.add(d.name);thought(d.b,'🎉',1.6,true);addActivity('🐕 '+d.name+' שמח לראות אותך ('+bd.dogs.size+'/3)');if(bd.dogs.size>=3)dayEvent('dogFriends')}});
 }
 if(bd.phase===2&&!bd.lit&&!day.done.has('groupHug')){
  if(Math.abs(pos.x)<3&&pos.z>-5&&pos.z<5&&jumpY<.2&&lastDogSpeed<.3){bd.hugT+=dt;holdShow('groupHug',bd.hugT,3);GUESTS.forEach(g=>{g.tx=pos.x+Math.sin(g.r*20)*1.3;g.tz=pos.z+Math.cos(g.r*20)*1.3});
   if(bd.hugT>3){dayEvent('groupHug');confetti(pos.x,pos.z,5);for(let i=0;i<4;i++)setTimeout(()=>{milkyThought('❤️',1.5,true);GUESTS.forEach(g=>thought(g.b,'❤️',1.5,true));thought(dadB,'❤️',1.5,true);thought(daniB,'❤️',1.5,true)},i*500);
    speakDad('מילקי... אתה הכי טוב שיש. יום הולדת שמח.');sayDani('אוהבים אותך, מילקי ❤️')}}else bd.hugT=0;
 }
}
window.BDAY_READY=true;
loadWeekPhases();renderDay();renderWeek();
