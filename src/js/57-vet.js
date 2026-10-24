// ===== Street stage 2: the vet clinic. Waiting room full of patients, a scale, treats, the cone of shame... and THE SHOT =====
const VET={x0:20.2,x1:27.6,z0:10.6,z1:19.6};
AREAS.push(VET);DOORS.push({ax:true,x0:18.5,x1:21.1,z0:11.6,z1:13.8});
const vetWall=mat(0xe8f1ef),vetFloor=mat(0xcfe3df),vetTeal=mat(0x2f8f86);
// building shell (front wall with a door gap, back, north side; south side is shared with the kiosk)
box(.2,6,1.4,vetWall,19.95,3,10.95);box(.2,6,5.8,vetWall,19.95,3,16.7);box(.2,3,2.2,vetWall,19.95,4.5,12.7);box(.2,6,9.8,vetWall,27.9,3,15.1);box(8,6,.2,vetWall,24,3,19.95);
box(.08,1.4,2.2,winM,19.86,1.7,16.6);box(7.6,.05,9,vetFloor,24,.02,15.1);
for(let z=11;z<19.6;z+=1.2)box(7.6,.01,.04,decal(mat(0xb5cfca)),24,.05,z);
box(.06,2.6,.12,vetTeal,19.85,1.3,11.55);box(.06,2.6,.12,vetTeal,19.85,1.3,13.85);
// reception desk + treats jar
box(2.4,1.05,.8,vetTeal,23.2,.52,12.0);box(2.5,.06,.9,mat(0xf3f3ef),23.2,1.06,12.0);
const JAR={x:22.4,z:12.0};const jar=cyl(.16,.32,new THREE.MeshStandardMaterial({color:0xcfe9ff,transparent:true,opacity:.55,roughness:.1}),JAR.x,1.25,JAR.z);for(let i=0;i<5;i++)box(.08,.04,.04,mat(0xb07a45),JAR.x+(Math.random()-.5)*.15,1.15+i*.04,JAR.z+(Math.random()-.5)*.15);
obstacles.push({name:'דלפק קבלה',x:23.2,z:12.0,w:2.4,d:.8,top:1.06});
// waiting room benches with patients
const WBENCH={x:21.2,z:17.6};box(2.6,.08,.6,mat(0x9c6b3e),WBENCH.x+.8,.48,WBENCH.z+.9);box(2.6,.5,.08,mat(0x9c6b3e),WBENCH.x+.8,.8,WBENCH.z+1.2);obstacles.push({name:'ספסל המתנה',x:WBENCH.x+.8,z:WBENCH.z+.9,w:2.6,d:.6,top:.5});
const carrier=new THREE.Group();carrier.position.set(21.0,.52,18.5);scene.add(carrier);{box(.6,.42,.42,mat(0x7a7a80,.6),0,.21,0,carrier);for(let i=0;i<5;i++)box(.03,.36,.02,mat(0x333333),-.2+i*.1,.21,.22,carrier);
 const cf=mat(0xe39a4a);ball(.12,cf,0,.2,.08,carrier);for(const s of [-1,1]){mesh(new THREE.ConeGeometry(.045,.09,4),cf,s*.07,.32,.08,carrier);ball(.02,mat(0x9bd94a),s*.045,.22,.19,carrier)}}
const carrierB=makeBubble(carrier,.75);
const igTank=new THREE.Group();igTank.position.set(22.6,.52,18.5);scene.add(igTank);{box(.9,.5,.45,new THREE.MeshStandardMaterial({color:0xbfe6d9,transparent:true,opacity:.35,roughness:.1}),0,.25,0,igTank);box(.9,.04,.45,mat(0x6b4a32),0,.02,0,igTank);
 const ig=new THREE.Group();ig.position.set(0,.12,0);igTank.add(ig);const gm=mat(0x5fae4a,.7);const b=ball(.1,gm,0,.04,0,ig);b.scale.set(1,.6,2.2);const h=ball(.07,gm,0,.06,.22,ig);h.scale.set(1,.8,1.3);for(const s of [-1,1])ball(.018,mat(0xf2c14e),s*.05,.09,.25,ig);
 const tl=cyl(.025,.4,gm,0,.03,-.36,ig);tl.rotation.x=Math.PI/2;for(let i=0;i<5;i++)mesh(new THREE.ConeGeometry(.015,.05,4),mat(0x3f8a3a),0,.11,-.12+i*.07,ig);igTank.userData.ig=ig}
const igTankBub=makeBubble(igTank,.9);
const hutch=new THREE.Group();hutch.position.set(26.6,0,18.6);scene.add(hutch);{box(1,.9,.7,mat(0xd9c29a),0,.45,0,hutch);for(let i=0;i<6;i++)box(.025,.6,.02,mat(0x777777),-.4+i*.16,.55,.36,hutch);
 const bun=new THREE.Group();bun.position.set(0,.2,.05);hutch.add(bun);const w=mat(0xf5f0e6);ball(.15,w,0,.1,0,bun).scale.set(1,.9,1.2);ball(.1,w,0,.25,.12,bun);for(const s of [-1,1]){const e=ball(.04,w,s*.04,.42,.1,bun);e.scale.set(.6,2.4,.6)}ball(.02,mat(0xd27b86),0,.24,.22,bun);hutch.userData.bun=bun}
const hutchB=makeBubble(hutch,1.2);
// exam corner: table, scale, giant syringe, cone-of-shame shelf
const EXAM={x:26.2,z:13.4};box(1.6,.85,.9,mat(0xdfe6ea,.4),EXAM.x,.42,EXAM.z);box(1.7,.06,1.0,mat(0xb8c4ca,.3),EXAM.x,.87,EXAM.z);obstacles.push({name:'שולחן בדיקה',x:EXAM.x,z:EXAM.z,w:1.6,d:.9,top:.9});
const SCALE={x:24.2,z:16.6};box(.9,.06,.9,mat(0x9aa3a6,.4),SCALE.x,.03,SCALE.z);box(.3,.4,.06,mat(0x3a3a3e),SCALE.x,.25,SCALE.z+.45);
{const cv=document.createElement('canvas');cv.width=128;cv.height=64;const g=cv.getContext('2d');g.fillStyle='#16a085';g.fillRect(0,0,128,64);g.fillStyle='#e8fff8';g.font='bold 40px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText('00.0',64,34);
 const tx=new THREE.CanvasTexture(cv);const h=new THREE.Group();scene.add(h);const p=new THREE.Mesh(new THREE.PlaneGeometry(.26,.13),new THREE.MeshBasicMaterial({map:tx,toneMapped:false}));p.position.set(SCALE.x,.3,SCALE.z+.415);p.rotation.y=Math.PI;h.add(p);SCALE.cv=cv;SCALE.tx=tx}
box(.8,.04,.4,mat(0xb8c4ca),27.3,1.3,15.8);box(.06,1.3,.4,mat(0xb8c4ca),27.3,.65,15.8);
const CONES={x:27.3,z:15.8};{const cm=new THREE.MeshStandardMaterial({color:0xf6f6f2,transparent:true,opacity:.75,side:THREE.DoubleSide});for(let i=0;i<3;i++){const c=mesh(new THREE.CylinderGeometry(.28,.12,.2,16,1,true),cm,27.3,1.42+i*.06,15.8)}}
const syringe=new THREE.Group();scene.add(syringe);{const glass=new THREE.MeshStandardMaterial({color:0xdff3ff,transparent:true,opacity:.6,roughness:.1});const b=cyl(.09,.7,glass,0,0,0,syringe);b.rotation.z=Math.PI/2;
 const liq=cyl(.07,.4,mat(0x7fd3ff,.3),-.1,0,0,syringe);liq.rotation.z=Math.PI/2;const pl=cyl(.03,.4,mat(0xffffff),.5,0,0,syringe);pl.rotation.z=Math.PI/2;box(.04,.22,.22,mat(0xffffff),.7,0,0,syringe);const nd=cyl(.012,.3,mat(0xcccccc,.2),-.5,0,0,syringe);nd.rotation.z=Math.PI/2}
syringe.position.set(25.8,.98,13.2);
// people
const VETDOC=makePerson({skin:0xd8a984,shirt:0xffffff,pants:0x8fc5d9,shoes:0xffffff,hair:h=>{const d=ball(.34,mat(0xcfcfcb),0,.1,-.05,h);d.scale.set(1,.55,1);for(const s of [-1,1])box(.12,.07,.03,mat(0x222222),s*.12,.05,.33,h);box(.08,.02,.02,mat(0x222222),0,.05,.335,h)}});
{const st=mesh(new THREE.TorusGeometry(.2,.02,6,16,Math.PI),mat(0x333333),0,2.1,.24,VETDOC.g);st.rotation.x=Math.PI/2+.3;st.rotation.z=Math.PI}
const RECEP=makePerson({skin:0xe2b48c,shirt:0xe98ab0,pants:0x3a3a5a,hair:h=>{const d=ball(.34,mat(0x8a4a2a),0,.12,-.05,h);d.scale.set(1,.7,1);ball(.15,mat(0x8a4a2a),0,.3,-.2,h)}});
const OWNERV=makePerson({skin:0xc99067,shirt:0x7a8a5a,pants:0x4a4a4a,hair:darkHair(0x2a2420)});
VETDOC.g.position.set(26.4,0,14.8);RECEP.g.position.set(23.2,0,11.3);RECEP.g.rotation.y=0;OWNERV.g.position.set(21.9,0,18.45);OWNERV.g.rotation.y=Math.PI;
const vetB=makeBubble(VETDOC.g,3.05),recepB=makeBubble(RECEP.g,3.05),ownerB=makeBubble(OWNERV.g,2.6);
const VET_LINES=['מי זה הגיע? מילקי! הגיע הזמן לחיסון 💉','רק דקירה קטנה, אתה לא תרגיש כלום','למה כל הכלבים בורחים ממני?','תעלה על השולחן, חמוד'];
const RECEP_LINES=['שם הכלב? ...מילקי? אה, אתה. שוב.','התור שלך עוד 3 חתולים','בבקשה לא לגעת בצנצנת','שקט בבקשה, יש פה איגואנה רגישה'];
const OWNER_LINES=['החתול שלי לא אוהב כלבים. בכלל.','שמוליק האיגואנה אומר שלום','אנחנו פה בגלל שהחתול אכל גומייה'];
// cone of shame as a wardrobe item
const coneG=new THREE.Group();headPivot.add(coneG);coneG.position.set(0,.02,.05);coneG.rotation.x=Math.PI/2;
{const cm=new THREE.MeshStandardMaterial({color:0xf6f6f2,transparent:true,opacity:.88,side:THREE.DoubleSide,roughness:.4});mesh(new THREE.CylinderGeometry(.7,.24,.5,20,1,true),cm,0,.18,0,coneG)}
coneG.visible=false;WEAR.cone=coneG;WEAR_DEFS.push({id:'cone',icon:'🥴',name:'קונוס הבושה',need:s=>[save.mods&&save.mods.cone?1:0,1,'לבקר אצל הווטרינר']});
const vet={state:'idle',t:0,chaseT:0,shot:false,scaleT:0,stareT:0,braveT:0,coneT:0,talk:3,catT:0};
for(const c of [['vetScale','⚖️ להישקל אצל הווטרינר'],['vetTreats','🦴 לגנוב חטיף מהצנצנת בקבלה'],['vetEscape','💉 לברוח מהחיסון 15 שניות'],['vetBrave','🦸 לקבל חיסון באומץ (לשכב על שולחן הבדיקה)'],['vetCat','🐈 להרגיז את החתול בכלוב'],['vetIguana','🦎 תחרות מבטים עם האיגואנה'],['vetCone','🥴 לנסות את קונוס הבושה']])challengeDefs.push(c);
for(const id of save.challenges)if(challengeDefs.some(c=>c[0]===id))challengesDone.add(id);renderChallenges();
function inVet(){return pos.x>20.2&&pos.z>10.6&&pos.z<19.6}
function stealTreat(){completeChallenge('vetTreats');addScore(200,'חטיף מהצנצנת');mouthItem.visible=true;shop.mouthT=4;sayText(recepB,'היי!!! רק אחרי החיסון!!',2,'say',true);jar.rotation.z=.4;setTimeout(()=>jar.rotation.z=0,600)}
function tryCone(){coneG.visible=true;vet.coneT=20;completeChallenge('vetCone');if(!save.mods.cone){save.mods.cone=true;writeSave();if(typeof checkUnlocks==='function')checkUnlocks()}
 sayText(milkyB,'🥴 אני מרגיש כמו מנורה',2.4,'say',true);sayText(vetB,'חחח, מתאים לך! אפשר לקחת הביתה',2.2,'say',true);if(window.JUICE_READY)pow('🥴')}
CTX_HOOKS.act.push(()=>inVet()&&Math.hypot(pos.x-JAR.x,pos.z-JAR.z)<1.7&&!challengesDone.has('vetTreats')?{i:'🦴',l:'חטיף!',on:1,fn:stealTreat}:null);
CTX_HOOKS.act.push(()=>inVet()&&Math.hypot(pos.x-CONES.x,pos.z-CONES.z)<1.6&&!(vet.coneT>0)?{i:'🥴',l:'קונוס!',on:1,fn:tryCone}:null);
function startShotChase(){if(vet.state!=='idle')return;vet.state='chase';vet.chaseT=0;sayText(vetB,pick(['רגע! רק דקירה קטנה!!','מילקי! תחזור לפה!','זה לא כואב! באמת!']),2,'say',true);addActivity('💉 הווטרינר רודף עם מזרק ענק! ברח 15 שניות (או תשכב על השולחן באומץ)');if(window.JUICE_READY){punch(5);pow('💉!!!',VETDOC.g.position.x,2.6,VETDOC.g.position.z,true)}}
function updateVet(dt){
 const t=performance.now()/1000,near=pos.x>17&&pos.z>9&&pos.z<21;
 const D=VETDOC.g.position;let step=0;
 // the vet
 if(vet.state==='chase'){vet.chaseT+=dt;if(vet.chaseT<1.4){VETDOC.g.rotation.y=Math.atan2(pos.x-D.x,pos.z-D.z);evtPill.hidden=false;evtPill.textContent='💉 הווטרינר מכין את המזרק... ברח!'}else{const dx=pos.x-D.x,dz=pos.z-D.z,d=Math.hypot(dx,dz);const s=Math.min(d,3.1*dt);const nx=D.x+dx/(d||1)*s,nz=D.z+dz/(d||1)*s;if(walkable(nx,nz,.35)){D.x=nx;D.z=nz;step=s}else if(walkable(nx,D.z,.35)){D.x=nx;step=s*.7}else if(walkable(D.x,nz,.35)){D.z=nz;step=s*.7}VETDOC.g.rotation.y=Math.atan2(dx,dz);
  evtPill.hidden=false;const l='💉 בורח מהחיסון '+Math.floor(vet.chaseT-1.4)+'/15';if(evtPill.textContent!==l)evtPill.textContent=l;
  if(d<.85&&jumpY<.8){vet.state='calm';vet.t=0;vet.shot=true;evtPill.hidden=true;sayText(vetB,'הופה! זהו! לא כאב בכלל, נכון?',2.4,'say',true);sayText(milkyB,'😳 ...זהו?',1.8,'say',true);if(window.JUICE_READY){hitStop(.08);pow('צ\'יק!')}}
  else if(vet.chaseT>=16.4){vet.state='calm';vet.t=0;evtPill.hidden=true;completeChallenge('vetEscape');addScore(500,'ברחת מהמזרק!');sayText(vetB,'אוף... בפעם הבאה, מילקי. בפעם הבאה.',2.4,'say',true)}}}
 else{const tx=26.4,tz=14.8,dx=tx-D.x,dz=tz-D.z,d=Math.hypot(dx,dz);if(d>.3){const s=Math.min(d,1.6*dt);D.x+=dx/d*s;D.z+=dz/d*s;step=s;VETDOC.g.rotation.y=Math.atan2(dx,dz)}else VETDOC.g.rotation.y+=Math.atan2(Math.sin(Math.atan2(pos.x-D.x,pos.z-D.z)-VETDOC.g.rotation.y),Math.cos(Math.atan2(pos.x-D.x,pos.z-D.z)-VETDOC.g.rotation.y))*Math.min(1,dt*3)}
 if(vet.state==='calm'){vet.t+=dt;if(vet.t>12)vet.state='idle'}
 if(vet.state==='idle'&&inVet()&&pos.x>24.6&&pos.z<16.2&&jumpY<.5)startShotChase();
 // syringe in the vet's hand while chasing
 if(vet.state==='chase'){VETDOC.arms[1].updateWorldMatrix(true,false);VETDOC.arms[1].localToWorld(_gv.set(0,-.8,.25));syringe.position.copy(_gv);syringe.rotation.set(0,VETDOC.g.rotation.y+Math.PI/2,0)}else{syringe.position.set(25.8,.98,13.2);syringe.rotation.set(0,0,0)}
 animatePerson(VETDOC,step,dt,{run:vet.state==='chase',arm:i=>vet.state==='chase'&&i===1?-1.4:0});updateFace(VETDOC.face,vet.state==='chase'?'laugh':'smile',dt);
 animatePerson(RECEP,0,dt,{arm:i=>i===0?-.5+Math.sin(t*7)*.1:0});updateFace(RECEP.face,'neutral',dt);RECEP.g.rotation.y=Math.atan2(pos.x-RECEP.g.position.x,pos.z-RECEP.g.position.z)*.0;
 animatePerson(OWNERV,0,dt,{arm:()=>-.4});OWNERV.legs.forEach(l=>l.rotation.x=-1.45);OWNERV.g.position.y=-.42;updateFace(OWNERV.face,'smile',dt);
 vet.talk-=dt;if(near&&vet.talk<=0){vet.talk=6+Math.random()*4;const who=pick([[vetB,VET_LINES],[recepB,RECEP_LINES],[ownerB,OWNER_LINES]]);sayText(who[0],pick(who[1]),2.4,'say')}
 // brave: lie on the exam table
 const onTable=jumpY>.8&&grounded&&insidePlatform(obstacles.find(o=>o.name==='שולחן בדיקה'),pos.x,pos.z,.05);
 if(onTable&&lastDogSpeed<.3&&!challengesDone.has('vetBrave')){vet.braveT+=dt;holdShow('vetBraveHold',vet.braveT,3);if(vet.braveT>3){completeChallenge('vetBrave');vet.state='calm';vet.t=0;evtPill.hidden=true;idleAction='lie';idleClock=0;
   sayText(vetB,'איזה כלב אמיץ!!! מגיע לך חטיף ענק 🦴',2.6,'say',true);thought(milkyB,'🦸',2,true);addScore(500,'גיבור!');if(window.JUICE_READY)pow('אמיץ!',pos.x,2.4,pos.z,true)}}else vet.braveT=0;
 // scale
 if(Math.hypot(pos.x-SCALE.x,pos.z-SCALE.z)<.55&&grounded&&jumpY<.15){vet.scaleT+=dt;const kg=(18+vet.scaleT*4*MS*MS).toFixed(1);if(vet.scaleT<2){const g=SCALE.cv.getContext('2d');g.fillStyle='#16a085';g.fillRect(0,0,128,64);g.fillStyle='#e8fff8';g.font='bold 40px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText(String(Math.min(kg,26.4)),64,34);SCALE.tx.needsUpdate=true}
  holdShow('vetScaleHold',vet.scaleT,2);if(vet.scaleT>2&&!challengesDone.has('vetScale')){completeChallenge('vetScale');sayText(vetB,MS>1.2?'מה?! 70 קילו?! מה נתנו לך לאכול?!':'26.4 קילו... מישהו אוכל יותר מדי במבה 🤨',2.6,'say',true)}}else vet.scaleT=0;
 // patients
 const dc=Math.hypot(pos.x-carrier.position.x,pos.z-carrier.position.z);if(dc<1.6){vet.catT+=dt;carrier.rotation.z=Math.sin(t*40)*.05;if(vet.catT>.8&&!challengesDone.has('vetCat')){completeChallenge('vetCat');sayText(carrierB,'חחחחחחשששש!!! 😾',2,'say',true);sayText(ownerB,'אמרתי לך! הוא לא אוהב כלבים!',2.2,'say',true)}}else{vet.catT=0;carrier.rotation.z=0}
 const di=Math.hypot(pos.x-igTank.position.x,pos.z-igTank.position.z);const ig=igTank.userData.ig;ig.rotation.y=Math.sin(t*.5)*.4;
 if(di<1.6&&lastDogSpeed<.3){vet.stareT+=dt;holdShow('vetIguanaHold',vet.stareT,4);if(vet.stareT>4&&!challengesDone.has('vetIguana')){completeChallenge('vetIguana');sayText(igTankBub,'...😑 טוב, ניצחת.',2,'say',true);sayText(ownerB,'וואו! שמוליק אף פעם לא מפסיד!',2.2,'say',true)}}else vet.stareT=0;
 const bun=hutch.userData.bun,dh=Math.hypot(pos.x-hutch.position.x,pos.z-hutch.position.z);bun.position.y=.2+(dh<2?Math.abs(Math.sin(t*9))*.12:0);if(dh<1.8&&Math.random()<dt*.5)thought(hutchB,pick(['🥕','😳','💨']),1.2);
 // cone timer
 if(vet.coneT>0){vet.coneT-=dt;if(vet.coneT<=0&&typeof applyModes==='function')applyModes(true)}
}
// hold-bar labels for these (they are not day tasks)
const _holdLabels={vetBraveHold:'🦸 שוכב באומץ על השולחן',vetScaleHold:'⚖️ נשקל...',vetIguanaHold:'🦎 תחרות מבטים עם שמוליק'};
const _origHold=holdShow;holdShow=function(id,t,need){if(_holdLabels[id]){if(!(t>0))return;if(!holdEl){_origHold('__init',1,1)}const lbl=_holdLabels[id]+' ⏳';if(holdKey!==lbl){holdKey=lbl;holdEl.firstChild.textContent=lbl}holdEl.lastChild.firstChild.style.width=Math.min(100,t/need*100).toFixed(0)+'%';holdEl.classList.add('on');holdSeen=performance.now();return}_origHold(id,t,need)};
window.VET_READY=true;
