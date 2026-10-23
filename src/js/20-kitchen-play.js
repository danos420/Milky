// ===== Kitchen interactions: fridge, sausage, trash bin, food bowl =====
let fridgeOpen=false,fridgeAngle=0,sausageState='inside',sausageTimer=0;
const sausageVel=new THREE.Vector3();
const sausage=new THREE.Group();scene.add(sausage);
{const sm=mat(0xb5523b,.5);const s1=cyl(.075,.4,sm,0,0,0,sausage);s1.rotation.z=Math.PI/2;ball(.075,sm,-.2,0,0,sausage);ball(.075,sm,.2,0,0,sausage)}
const sausageHome=new THREE.Vector3(5.6,1.25,15.1);sausage.position.copy(sausageHome);
const nearFridge=()=>jumpY<.5&&Math.hypot(pos.x-5.55,pos.z-14.25)<1.4;
const nearSausage=()=>sausageState==='floor'&&Math.hypot(pos.x-sausage.position.x,pos.z-sausage.position.z)<1.3;
function toggleFridge(){
 fridgeOpen=!fridgeOpen;playToySound(fridgeOpen?330:190,.16,'sine');
 if(fridgeOpen){
  completeChallenge('fridge');addChaos(6);addActivity('🧊 מילקי פתח את המקרר עם האף!');milkyThought('🤤',2,true);
  if(sausageState==='inside'){sausageState='flying';sausageVel.set(-1.4,2.3,-2.2);addActivity('🌭 נקניקייה קפצה מהמקרר!')}
  daniReact('fridge');
 }else addActivity('🧊 המקרר נסגר');
}
function eatSausage(){
 sausageState='eaten';sausageTimer=0;dayEvent('sausage');sausage.visible=false;completeChallenge('sausage');addChaos(12);mood=1;tongueTimer=2.5;
 milkyThought('🌭',2.2,true);playToySound(520,.09,'square');setTimeout(()=>playToySound(430,.09,'square'),110);setTimeout(()=>playToySound(560,.09,'square'),230);
 addActivity('🌭 מילקי בלע את הנקניקייה בשנייה וחצי!');daniReact('sausage');
}
let trashTipped=false;
const garbage=[];
for(const [c,sz] of [[0x8a7f6b,.18],[0xe9e4d8,.14],[0x6b8f3c,.12],[0xd9a441,.13]]){const g=box(sz,.05,sz*1.3,mat(c),0,.03,0);g.visible=false;garbage.push(g)}
function tipTrash(){
 if(trashTipped)return;trashTipped=true;dayEvent('trash');
 const p=trashProp,dir=Math.atan2(p.g.position.z-pos.z,p.g.position.x-pos.x);
 binInner.rotation.z=Math.PI/2;binInner.position.y=.28;p.g.rotation.y=-dir+Math.PI;
 garbage.forEach((g,i)=>{const a=dir+(i-1.5)*.45,r=.7+i*.18;g.position.set(p.g.position.x+Math.cos(a)*r,.03,p.g.position.z+Math.sin(a)*r);g.rotation.y=i;g.visible=true});
 completeChallenge('trash');addChaos(12);SFX.crash();addActivity('🗑️ הפח התהפך! יש זבל בכל המטבח');milkyThought('😇',2,true);daniReact('trash');
}
function standTrash(){trashTipped=false;binInner.rotation.z=0;binInner.position.y=0;trashProp.g.rotation.set(0,0,0);garbage.forEach(g=>g.visible=false)}
function eatFromBowl(){dayEvent('bowl');mood=1;tongueTimer=2;milkyThought('😋',2,true);for(let i=0;i<4;i++)setTimeout(()=>playToySound(300+Math.random()*120,.05,'square'),i*140);addActivity('🥣 מילקי חיסל את הקערה. עדיין רעב.')}
function updateKitchen(dt){
 fridgeAngle+=((fridgeOpen?-1.9:0)-fridgeAngle)*Math.min(1,dt*7);fridgeHinge.rotation.y=fridgeAngle;fridgeLight.visible=fridgeAngle<-.25;
 if(sausageState==='flying'){sausageVel.y-=9.8*dt;sausage.position.addScaledVector(sausageVel,dt);sausage.rotation.y+=dt*9;
  if(sausage.position.y<=.08){sausage.position.y=.08;sausageState='floor';milkyThought('🌭',1.6,true)}}
 if(sausageState==='eaten')sausageTimer+=dt;
}
function resetKitchen(){
 fridgeOpen=false;fridgeAngle=0;fridgeHinge.rotation.y=0;fridgeLight.visible=false;
 sausageState='inside';sausageTimer=0;sausage.visible=true;sausage.position.copy(sausageHome);sausage.rotation.set(0,0,0);
 standTrash();
}
