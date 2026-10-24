function updateDadBehavior(dt){
 if(dadState==='away'){dad.visible=false;return}
 const t=performance.now()*.001;
 dadBarkCooldown=Math.max(0,dadBarkCooldown-dt);
 dadGiftCooldown=Math.max(0,dadGiftCooldown-dt);
 dadPetCooldown=Math.max(0,dadPetCooldown-dt);
 dadReactCooldown=Math.max(0,dadReactCooldown-dt);
 dadChairGrumble=Math.max(0,dadChairGrumble-dt);
 dadRoutine-=dt;dadAction+=dt;
 const dogDist=Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z);
 const calm=['rest','wander','sit','watch'];
 if(slipperState==='carried' && dadState!=='chase' && dadState!=='search' && dadState!=='sick'){
  setDadState('search','רגע... מילקי, מה יש לך בפה?!');dadAlert=1.6;
 }
 if(chaosStage>=3 && slipperState!=='carried' && slipperState!=='dad' && calm.includes(dadState) && dadReactCooldown===0){
  setDadState('investigate','מה זה הרעש הזה?!');dadAlert=5;dadReactCooldown=12;
 }
 if(calm.includes(dadState) && dogDist<1.35 && dadPetCooldown===0 && slipperState!=='carried' && jumpY<.5){
  setDadState('pet','בוא לפה, יא חמוד שלי!');dadPetCooldown=15;dadRoutine=4;
 }
 if(dadRoutine<=0 && calm.includes(dadState)){
  dadRoutine=dadSeated?6+Math.random()*6:2.5+Math.random()*3;
  const choice=Math.random();
  if(choice<.3){setDadState('rest');dadTarget.copy(dadHome)}
  else if(choice<.75){setDadState('watch');dadTarget.copy(dadHome)}
  else {setDadState('wander');const [wx,wz]=randomFreeSpot();dadTarget.set(wx,0,wz);}
 }
 // Armchair: dad sits to watch TV, unless Milky stole the seat.
 const chairTaken=jumpY>.4&&insidePlatform(armchairObs(),pos.x,pos.z,.1);if(chairTaken)dayEvent('armchair');
 const wantsSeat=(dadState==='rest'||dadState==='watch'||dadState==='sick');
 if(dadSeated&&(!wantsSeat||chairTaken))unseatDad();
 let targetX=dad.position.x,targetZ=dad.position.z,speed=0,stopDistance=.3;
 if(wantsSeat&&!dadSeated){targetX=SEAT_APPROACH.x;targetZ=SEAT_APPROACH.z;speed=1.25;stopDistance=.12;
  if(Math.hypot(targetX-dad.position.x,targetZ-dad.position.z)<.25){
   if(chairTaken){if(dadChairGrumble===0){speakDad('מילקי! זה הכיסא שלי!');thought(dadB,'😤',2.2);milkyThought('😇',2);dadChairGrumble=8}}
   else{dadSeated=true;if(tvOn)thought(dadB,'📺',2)}
  }}
 if(dadState==='wander'){targetX=dadTarget.x;targetZ=dadTarget.z;speed=.9;}
 if(dadState==='investigate'){targetX=pos.x;targetZ=pos.z;speed=1.65;stopDistance=1.4;dadAlert-=dt;if(dadAlert<=0){setDadState('rest','טוב... כנראה דמיינתי.');dadRoutine=4;}}
 if(dadState==='search'){
  if(slipperState==='carried'){targetX=pos.x;targetZ=pos.z;stopDistance=.85;dadAlert-=dt;if(dadAlert<=0)setDadState('chase','מילקי! תחזיר לי את הכפכף!');}
  else if(slipperState==='floor'){targetX=slipper.position.x;targetZ=slipper.position.z;stopDistance=.55;
   if(Math.hypot(slipper.position.x-dad.position.x,slipper.position.z-dad.position.z)<.75){dadTakeSlipper();speakDad('אהה! הנה הכפכף שלי!');}}
  else setDadState('rest');
  speed=1.55;
 }
 if(dadState==='chase'){targetX=pos.x;targetZ=pos.z;speed=2.8;stopDistance=.84;if(slipperState!=='carried')setDadState('investigate');}
 if(dadState==='return'){targetX=slipperHome.x;targetZ=slipperHome.z;speed=1.4;stopDistance=.45;
  if(Math.hypot(targetX-dad.position.x,targetZ-dad.position.z)<.7)dadPutSlipperBack();}
 if(dadState==='pet'){targetX=pos.x;targetZ=pos.z;speed=2.05;stopDistance=1.2;if(dadAction>9){setDadState('rest');dadRoutine=2;}}
 if(dadState==='sweep'){targetX=dadTarget.x;targetZ=dadTarget.z;speed=.9;if(Math.hypot(targetX-dad.position.x,targetZ-dad.position.z)<.5){const [wx,wz]=randomFreeSpot();dadTarget.set(wx,0,wz)}}
 if(dadState==='bday'){targetX=BDAY_DAD.x;targetZ=BDAY_DAD.z;speed=1.3;stopDistance=.3;if(bd.phase===2&&bd.hugT>0){targetX=pos.x+1.2;targetZ=pos.z}}
 if(dadState==='dinner'){targetX=DAD_DINNER.x;targetZ=DAD_DINNER.z;speed=1.3;stopDistance=.2;}
 if(dadState==='bath'){targetX=pos.x;targetZ=pos.z;speed=2.7;stopDistance=.8;}
 if(dadState==='celebrate'){speed=0;if(dadAction>4){setDadState('rest');dadRoutine=3;}}

 let step=0;
 if(dadSeated){
  dad.position.x+=(ARMCHAIR.x-dad.position.x)*Math.min(1,dt*6);dad.position.z+=(ARMCHAIR.z+.08-dad.position.z)*Math.min(1,dt*6);
  dadNav.path=[];
 }else{
  const r=navStep(dad,dadNav,DAD_R,targetX,targetZ,speed,stopDistance,dt,[{x:pos.x,z:pos.z,r:dogRadius,skip:jumpY>=1.2},{x:dani.position.x,z:dani.position.z,r:DANI_R}]);
  step=r.step;dadWalk+=step*8;
  if(r.giveUp){
   if(dadState==='wander'||dadState==='sweep'){const [rx,rz]=randomFreeSpot();dadTarget.set(rx,0,rz)}
   else if(dadState==='return')dadPutSlipperBack();
   else if(wantsSeat){setDadState('wander');const [rx,rz]=randomFreeSpot();dadTarget.set(rx,0,rz)}
  }
 }
 dadSitBlend+=((dadSeated?1:0)-dadSitBlend)*Math.min(1,dt*6);
 dadSnack.visible=dadSitBlend>.6; // snack bag while watching TV
 // Facing
 const faceDog=dadState==='chase'||dadState==='bath'||dadState==='search'&&slipperState==='carried'||dadState==='pet'||dadState==='investigate'||dadChairGrumble>6;
 if(dadSeated)faceToward(dad,6.3,1.2,dt,4);
 else if(faceDog)faceToward(dad,pos.x,pos.z,dt);
 else faceToward(dad,dadNav.path[0]?dadNav.path[0][0]:targetX,dadNav.path[0]?dadNav.path[0][1]:targetZ,dt);
 // Body animation
 const walking=step>.001;
 const breathe=Math.sin(t*2.1)*.012;
 dad.position.y=-.42*dadSitBlend+(walking?Math.abs(Math.sin(dadWalk))*.05:0);
 dad.scale.set(1,1+breathe,1);
 dadArms.forEach((a,i)=>{
  const phase=dadWalk+(i?Math.PI:0);
  let gesture=0;
  if(dadState==='return'&&i===0)gesture=-.9;
  else if(dadState==='pet')gesture=i===0?-1.0+Math.sin(t*7)*.18:-.15;
  else if(dadState==='search')gesture=i===0?-2.75+Math.sin(t*9)*.15:-.3;           // scratching his head
  else if(dadState==='chase')gesture=-1.15+Math.sin(t*13+i*Math.PI)*.35;            // arms out, grabbing
  else if(dadState==='celebrate')gesture=i===0?-2.45:0;                             // facepalm
  else if(dadState==='investigate')gesture=-.5;
  else if(dadSitBlend>.5)gesture=-.75;
  if(dadChairGrumble>6&&i===1)gesture=-1.6+Math.sin(t*14)*.3;                       // finger wag
  const swing=walking&&!(dadState==='return'&&i===0)&&dadState!=='chase'?Math.sin(phase)*.5:Math.sin(t*1.4+i)*.05;
  a.rotation.x+=(swing+gesture-a.rotation.x)*Math.min(1,dt*9);
  a.rotation.z=(i?-.12:.12)+(dadState==='investigate'?Math.sin(t*5+i)*.18:0)+(dadState==='chase'?(i?-.25:.25):0);
 });
 dadLegs.forEach((l,i)=>{const target=(walking?Math.sin(dadWalk+(i?0:Math.PI))*(dadState==='chase'?.75:.52):0)-1.45*dadSitBlend;l.rotation.x+=(target-l.rotation.x)*Math.min(1,dt*10)});
 dadMouth.scale.x=dadState==='chase'?1.9:dadState==='pet'?1.5:dadChairGrumble>6?1.7:1;
 dadMouth.scale.y=dadState==='chase'||dadChairGrumble>6?2.2:1;
 {const nap=dadSeated&&!tvOn&&typeof day!=='undefined'&&(day.phase===1||evtNap);
  let dm='smile';if(dadState==='chase')dm='shout';else if(dadState==='bath')dm='laugh';else if(dadState==='dinner')dm='smile';else if(dadState==='bday')dm='laugh';else if(dadState==='sick')dm=dadLaughT>0?'laugh':'sad';else if(dadState==='search')dm='confused';else if(dadState==='investigate')dm=dadAction<1.2?'shock':'angry';else if(dadState==='pet')dm='love';else if(dadState==='celebrate')dm='sad';else if(dadState==='return')dm='smug';else if(dadChairGrumble>6)dm='angry';else if(nap)dm='sleep';else if(dadLaughT>0)dm='laugh';else if(dadState==='wander')dm='neutral';
  updateFace(dadFace,dm,dt);dadLaughT=Math.max(0,dadLaughT-dt);
  if(dadSeated&&!tvOn&&Math.random()<dt*(nap?.12:.03))sayText(dadB,nap?pick(DAD_NAP):'💤',2.6,'think');}
 if(dadSeated&&tvOn&&Math.random()<dt*.12){sayText(dadB,pick(DAD_TV),2.6);dadLaughT=2}
 
 if(dadState==='pet' && dogDist<1.8 && dadGiftCooldown===0){
  dadGiftCooldown=18;tongueTimer=2;mood=1;
  speakDad('מי הכלב הכי טוב בעולם? קח חטיף!');addActivity('🍪 אבא פינק את מילקי בחטיף!');
 }
 if(slipperState==='carried' && Math.hypot(pos.x-3.5,pos.z+6.4)<1.18){
  slipperState='hidden';completeChallenge('slipper');dayEvent('slipper');dog.remove(slipper);scene.add(slipper);slipper.position.set(3.4,.42,-6.3);slipper.rotation.set(0,0,0);
  setDadState('celebrate');slipperWins++;missionText('ניצחון! הכפכף הוחבא במיטה 🏆');notice('🏆 משימה הושלמה: אבא נשאר יחף!',3);speakDad('טוב נו... קח חטיף, יא גנב קטן!');addChaos(24);milkyThought('😎',2.5,true);
 }
 if(slipperState==='carried' && dadState==='chase' && dogDist<1.05 && jumpY<.6){
  dadTakeSlipper();missionText('אבא תפס אותך! נסה שוב 🩴');notice('👨 אבא לקח את הכפכף!',2);speakDad('תפסתי אותך!');mood=3;milkyThought('😭',2.2,true);thought(dadB,'😏',2);
 }
 if(slipperState==='hidden'&&dadBarkCooldown===0){dadBarkCooldown=12;}
}

