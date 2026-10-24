// ===== Dani: "chaos with responsibility" =====
// As energetic as Milky, but tries to keep order: he tidies what Milky knocks over,
// fixes the trash bin, restocks the fridge, kicks the ball for Milky, and sometimes
// gets swept up in the chaos himself before catching himself.
const DANI_R=.36;
const dani=new THREE.Group();scene.add(dani);
// Dani: short faded dark hair, trimmed beard, round gold glasses, full lips,
// athletic build in a black tank top, joggers and white sneakers.
const tank=mat(0x18181a,.9),joggers=mat(0x3b3f45),daniSkin=mat(0xd8a47c),daniHair=mat(0x23170f,.95),beardMat=mat(0x2b1d14,.95),glassGold=mat(0xb08a4a,.35),sneaker=mat(0xf2f2f2);
box(.8,.62,.42,tank,0,1.74,0,dani);box(.64,.52,.38,tank,0,1.2,0,dani);
for(const s of [-1,1]){ball(.17,daniSkin,s*.42,1.98,0,dani)}
cyl(.13,.2,daniSkin,0,2.1,0,dani);
const daniHead=new THREE.Group();daniHead.position.set(0,2.36,.02);dani.add(daniHead);
{const h=ball(.29,daniSkin,0,0,0,daniHead);h.scale.set(1,1.08,1);
  const top=ball(.296,daniHair,0,.13,-.03,daniHead);top.scale.set(1,.42,1.0);
 const quiff=ball(.09,daniHair,0,.23,.13,daniHead);quiff.scale.set(1.7,.35,1.0);
 const beard=ball(.295,beardMat,0,-.13,0,daniHead);beard.scale.set(1.0,.6,.98);
 for(const s of [-1,1])ball(.07,daniSkin,s*.29,.02,0,daniHead);
 ball(.06,daniSkin,0,-.01,.32,daniHead);}
for(const s of [-1,1]){const lens=mesh(new THREE.TorusGeometry(.075,.012,6,20),glassGold,s*.11,.05,.31,daniHead)}
box(.06,.012,.012,glassGold,0,.06,.315,daniHead);
const daniBrows=[-1,1].map(s=>box(.12,.03,.03,daniHair,s*.11,.14,.3,daniHead));
const daniMouth=box(.12,.04,.04,mat(0xb46e66),0,-.13,.3,daniHead);daniMouth.visible=false;
const daniFace=makeFace(daniHead,{eyeX:.11,eyeY:.05,eyeZ:.285,eyeR:.038,mouthY:-.13,mouthZ:.318,mouthW:.07,cheekX:.17,cheekY:-.03,cheekZ:.25},daniBrows);
const daniArms=[],daniLegs=[];
for(const side of [-1,1]){
 const sh=new THREE.Group();sh.position.set(side*.5,1.97,0);dani.add(sh);
 {const bi=ball(.12,daniSkin,0,-.22,0,sh);bi.scale.set(1,1.6,1)}box(.15,.38,.15,daniSkin,0,-.55,0,sh);ball(.09,daniSkin,0,-.77,0,sh);daniArms.push(sh);
 const hip=new THREE.Group();hip.position.set(side*.18,1.0,0);dani.add(hip);
 box(.24,.82,.28,joggers,0,-.4,0,hip);box(.26,.13,.42,sneaker,0,-.86,.08,hip);daniLegs.push(hip);
}
const DANI_HOME=new THREE.Vector3(-3.6,0,14.45);
dani.position.copy(DANI_HOME);
const daniNav={path:[],repath:0,tx:0,tz:0,stuck:0,giveUp:0};
const carried=new Set();
let daniState='cook',daniAction=0,daniCarry=null,daniTarget=null,daniPlayCool=12,daniPetCool=0,daniPartyCool=6,daniWalk=0,daniDecide=0;
const TIDY_LINES=['רגע, רגע, אני מסדר!','מי זרק את זה לפה? ...אה, מילקי','סדר זה חיים. בערך.','אני מחזיר, אף אחד לא ראה'];
function sayDani(line){addActivity('🧢 דני: '+line)}
function setDani(s,line,emoji){if(daniState===s)return;daniState=s;daniAction=0;if(line)sayDani(line);if(emoji)thought(daniB,emoji,2.2)}
function daniNear(d){return Math.hypot(pos.x-dani.position.x,pos.z-dani.position.z)<d}
function displacedThing(){
 let best=null,bd=1.2;
 for(const p of [...chaosProps,...extras]){
  if(p.kind==='trash'||carried.has(p.g)||(grab&&grab.b.o===p.g))continue;
  const d=Math.hypot(p.g.position.x-p.home.x,p.g.position.z-p.home.z),v=Math.hypot(p.vx,p.vz);
  if(d>bd&&v<.4){bd=d;best=p}
 }
 return best;
}
function daniDrop(atHome){
 const p=daniCarry;if(!p)return;carried.delete(p.g);daniCarry=null;
 if(atHome){p.g.position.copy(p.home);p.g.rotation.set(0,0,0)}else{p.g.position.y=0}
 p.vx=p.vz=0;if('vy' in p)p.vy=0;
}
function daniReact(what){
 const close=Math.hypot(pos.x-dani.position.x,pos.z-dani.position.z)<8;
 if(what==='sausage'){if(close){setDani('scold','מילקי!! זאת הייתה הנקניקייה שלי!','😤')}else sayDani('רגע... מי אכל לי את הנקניקייה?!')}
 if(what==='fridge'&&close){sayDani('מי השאיר את המקרר פתוח?!');thought(daniB,'🧊',1.8)}
 if(what==='trash'&&close){sayDani('הפח?! באמת?!');thought(daniB,'😩',2)}
 if(what==='chaos'&&daniPartyCool===0&&!daniCarry&&['cook','tidy'].includes(daniState)&&Math.random()<.55){
  daniDrop(false);daniTarget=null;setDani('party','יאללה בלגן!!! 🎉','🕺');daniPartyCool=28;
 }
}
function updateDani(dt){
 const t=performance.now()*.001;
 daniAction+=dt;daniDecide-=dt;
 daniPlayCool=Math.max(0,daniPlayCool-dt);daniPetCool=Math.max(0,daniPetCool-dt);daniPartyCool=Math.max(0,daniPartyCool-dt);
 const dogD=Math.hypot(pos.x-dani.position.x,pos.z-dani.position.z);
 // Decide what to do next while cooking.
 if(daniState==='cook'&&daniDecide<=0){
  daniDecide=2;
  if(trashTipped)setDani('fixTrash','אוף, מילקי... אני מרים','🧹');
  else if(sausageState==='eaten'&&sausageTimer>8)setDani('restock','טוב, עוד נקניקייה למקרר. אחרונה!','🌭');
  else if(fridgeOpen&&sausageState!=='flying')setDani('closeFridge','המקרר פתוח! החשמל!','🧊');
  else{const p=displacedThing();
   if(p){daniTarget=p;setDani('tidy',TIDY_LINES[Math.floor(Math.random()*TIDY_LINES.length)],'🧹')}
   else if(daniPlayCool===0&&dogD<7&&toyVelocity.length()<.3)setDani('play','מילקי! תביא!','⚽');
  }
 }
 if(daniState==='cook'&&dogD<1.5&&daniPetCool===0&&jumpY<.5){setDani('pet','מי זה הכלב הכי מבולגן בעולם?','🥰');daniPetCool=22}
 let tx=DANI_HOME.x,tz=DANI_HOME.z,speed=0,stop=.3,faceX=null,faceZ=null;
 switch(daniState){
  case 'cook':speed=2.3;faceX=dani.position.x;faceZ=16;break;
  case 'bday':tx=bd.hugT>0?pos.x-1.2:BDAY_DANI.x;tz=bd.hugT>0?pos.z:BDAY_DANI.z;stop=.3;speed=2.2;faceX=pos.x;faceZ=pos.z;break;
  case 'dinner':tx=DANI_DINNER.x;tz=DANI_DINNER.z;stop=.2;speed=2.2;faceX=DTABLE.x;faceZ=DTABLE.z;break;
  case 'park':{const o=parkDani(dt);faceX=o.fx;faceZ=o.fz;tx=dani.position.x;tz=dani.position.z;break}
  case 'tidy':{const p=daniTarget;if(!p){setDani('cook');break}
   if(!daniCarry){tx=p.g.position.x;tz=p.g.position.z;stop=.6;speed=2.7;
    if(Math.hypot(tx-dani.position.x,tz-dani.position.z)<.78){daniCarry=p;carried.add(p.g);p.vx=p.vz=0}}
   else{tx=p.home.x;tz=p.home.z;stop=.5;speed=2.5;
    if(Math.hypot(tx-dani.position.x,tz-dani.position.z)<.8){daniDrop(true);daniTarget=null;thought(daniB,'✨',1.5);setDani('cook')}}
   if(daniAction>25){daniDrop(false);daniTarget=null;setDani('cook')}
   break}
  case 'fixTrash':tx=trashProp.g.position.x;tz=trashProp.g.position.z;stop=.62;speed=2.6;
   if(Math.hypot(tx-dani.position.x,tz-dani.position.z)<.8){standTrash();trashProp.g.position.copy(trashProp.home);sayDani('נקי. כמעט.');thought(daniB,'😮‍💨',1.6);setDani('cook')}
   if(daniAction>25)setDani('cook');break;
  case 'restock':case 'closeFridge':tx=5.2;tz=14.1;stop=.25;speed=2.4;faceX=5.75;faceZ=16;
   if(Math.hypot(tx-dani.position.x,tz-dani.position.z)<.4){
    if(daniState==='restock'){sausageState='inside';sausageTimer=0;sausage.visible=true;sausage.position.copy(sausageHome);sausage.rotation.set(0,0,0);sayDani('החבאתי אותה מאחורי החלב. אין סיכוי שהוא ימצא.')}
    fridgeOpen=false;playToySound(190,.16,'sine');setDani('cook');
   }
   if(daniAction>25){fridgeOpen=false;setDani('cook')}break;
  case 'play':tx=toyBall.position.x;tz=toyBall.position.z;stop=.62;speed=2.8;
   if(Math.hypot(tx-dani.position.x,tz-dani.position.z)<.85){
    let a=Math.atan2(toyBall.position.z-dani.position.z,toyBall.position.x-dani.position.x)+(Math.random()-.5)*.8;
    toyVelocity.set(Math.cos(a)*7.5,Math.sin(a)*7.5);playToySound(240,.08,'triangle');
    addActivity('⚽ דני בעט את הכדור! מילקי, תביא!');milkyThought('❗',1.5,true);daniPlayCool=28;setDani('cheer',null,'🙌');
   }
   if(daniAction>14){daniPlayCool=15;setDani('cook')}break;
  case 'cheer':faceX=toyBall.position.x;faceZ=toyBall.position.z;if(daniAction>1.6)setDani('cook');break;
  case 'pet':tx=pos.x;tz=pos.z;stop=1.0;speed=2.2;faceX=pos.x;faceZ=pos.z;if(daniAction>4.5||dogD>4)setDani('cook');break;
  case 'scold':tx=pos.x;tz=pos.z;stop=1.15;speed=3.0;faceX=pos.x;faceZ=pos.z;if(daniAction>3.5){setDani('cook');sayDani('טוב... גם אני הייתי אוכל אותה.')}break;
  case 'party':if(daniAction>3.4){setDani('cook','רגע... אני אמור לסדר פה 😅','😅');daniDecide=0}break;
 }
 const r=navStep(dani,daniNav,DANI_R,tx,tz,speed,stop,dt,[{x:pos.x,z:pos.z,r:dogRadius,skip:jumpY>=1.2},{x:dad.position.x,z:dad.position.z,r:DAD_R}]);
 const step=daniState==='park'?park.daniStep:r.step;
 if(r.giveUp&&daniState!=='cook'){daniDrop(false);daniTarget=null;setDani('cook')}
 // Facing
 if(daniState==='party')dani.rotation.y+=dt*9;
 else if(daniState!=='park'&&step>.001&&daniNav.path[0])faceToward(dani,daniNav.path[0][0],daniNav.path[0][1],dt,7);
 else if(faceX!==null)faceToward(dani,faceX,faceZ,dt,6);
 // Animation: bouncy, big arm swings, stirring, dancing, finger wagging
 daniWalk+=step*9;const walking=step>.001;
 let y=walking?Math.abs(Math.sin(daniWalk))*.09:0;
 if(daniState==='party')y=Math.abs(Math.sin(t*9))*.28;
 if(daniState==='cheer')y=Math.abs(Math.sin(t*11))*.4;
 dani.position.y=y;
 daniArms.forEach((a,i)=>{
  let g=0;
  if(daniState==='cook'&&!walking)g=i===0?-1.05+Math.sin(t*6)*.25:-.35;
  if(daniState==='party')g=-2.8+Math.sin(t*10+i*Math.PI)*.45;
  if(daniState==='cheer')g=-2.95;
  if(daniState==='scold')g=i===0?-1.65+Math.sin(t*13)*.28:0;
  if(daniState==='pet'&&dogD<1.6)g=i===0?-.9+Math.sin(t*8)*.18:0;
  if(daniCarry)g=-1.25;
  const swing=walking&&!daniCarry?Math.sin(daniWalk+(i?Math.PI:0))*.8:Math.sin(t*2+i)*.05;
  a.rotation.x+=(swing+g-a.rotation.x)*Math.min(1,dt*10);
  a.rotation.z=(i?-.15:.15)+(daniState==='party'?Math.sin(t*10)*.35:0);
 });
 daniLegs.forEach((l,i)=>{const tg=walking?Math.sin(daniWalk+(i?0:Math.PI))*.75:daniState==='party'?Math.sin(t*9+i*Math.PI)*.35:0;l.rotation.x+=(tg-l.rotation.x)*Math.min(1,dt*12)});
 daniHead.rotation.z=daniState==='party'?Math.sin(t*9)*.25:daniState==='pet'?.2:Math.sin(t*2.6)*.04;
 daniHead.rotation.x=daniState==='cook'&&!walking?.25:0;
 daniMouth.scale.x=daniState==='scold'?.6:daniState==='party'||daniState==='cheer'?1.8:1.2;
 daniMouth.scale.y=daniState==='scold'||daniState==='party'||daniState==='cheer'?2.4:1;
 updateFace(daniFace,{cook:'smile',tidy:'focus',fixTrash:'sad',restock:'focus',closeFridge:'focus',play:'laugh',cheer:'laugh',pet:'love',scold:'angry',party:'laugh'}[daniState]||'smile',dt);
 if(daniState==='cook'&&!walking&&Math.random()<dt*.05)sayText(daniB,pick(DANI_COOK),2.6);
 // Carry the object in front of his chest
 if(daniCarry){const hp=dani.localToWorld(new THREE.Vector3(0,1.25,.5));daniCarry.g.position.copy(hp);daniCarry.g.rotation.set(0,dani.rotation.y,0)}
}
function resetDani(){
 daniDrop(true);carried.clear();daniTarget=null;daniState='cook';daniAction=0;daniDecide=2;daniPlayCool=12;daniPetCool=0;daniPartyCool=6;
 dani.position.copy(DANI_HOME);dani.rotation.set(0,0,0);daniNav.path=[];daniNav.stuck=0;daniNav.giveUp=0;
}
