// One small, complete slapstick scene: Milky lands on the table and sends a mug flying.
const mug=new THREE.Group();scene.add(mug);
const mugMat=mat(0x568b9a),mugDark=mat(0x2c505b);
cyl(.16,.31,mugMat,0,.16,0,mug);
const mugTop=cyl(.145,.02,mugDark,0,.325,0,mug);
const mugHandle=mesh(new THREE.TorusGeometry(.13,.038,7,12,Math.PI*1.65),mugMat,.17,.17,0,mug);mugHandle.rotation.y=Math.PI/2;
const mugHome=new THREE.Vector3(-.75,.94,1.5);mug.position.copy(mugHome);
let mugFlying=false,mugVel=new THREE.Vector3(),mugSpin=0;
// Domino props: a small potted plant beside the coffee table.
const dominoPlant=new THREE.Group();scene.add(dominoPlant);
const dominoPot=mat(0xb97550),dominoLeaf=mat(0x53865c);
cyl(.29,.48,dominoPot,0,.24,0,dominoPlant);
cyl(.06,.8,mat(0x63834a),0,.83,0,dominoPlant);
for(let i=0;i<7;i++){const a=i*Math.PI*2/7;ball(.23,dominoLeaf,Math.cos(a)*.25,1.07+(i%2)*.14,Math.sin(a)*.25,dominoPlant)}
const plantHome=new THREE.Vector3(2.8,0,-3.6);dominoPlant.position.copy(plantHome);
let chainPhase=0,chainClock=0,plantFall=0,chainPoints=0;
const chaosMeter=document.getElementById('chaosMeter');
function setChaos(value){chainPoints=value;chaosMeter.textContent='💥 '+value+'/5';chaosMeter.title='רמת בלגן '+value+' מתוך 5'}
function notice(text,duration=2.2){addActivity(text);sceneTimer=duration}
function beginDomino(){if(chainPhase)return;chainPhase=1;chainClock=0;addChaos(22);notice('☕ אוי! הכוס עפה מהשולחן!',2.0)}
function bumpPlant(){if(chainPhase>=3)return;chainPhase=3;chainClock=0;addChaos(22);notice('🪴 בום! העציץ נפל! מילקי לא ראה כלום 😇',3.3);mood=3;tongueTimer=1.2}

function launchMug(){if(sceneTriggered)return;sceneTriggered=true;if(window.JUICE_READY){pow('קראש!',mug.position.x,mug.position.y+.6,mug.position.z);punch(3)}dayEvent('mug');mugFlying=true;chaos++;
 mugVel.set(-1.8,3.4,1.1);mugSpin=0;sceneTimer=2.7;
 mood=3;tongueTimer=.8;
 beginDomino();
 document.querySelector('#status').textContent='🤣 הכוס עפה! מילקי כמובן לא אשם. עכשיו לחטיף!';
}
function updateScene(dt){
 // Events are triggered by the player; the chain advances only after the mug is knocked.
 if(chainPhase===1){chainClock+=dt;
  if(chainClock>0.75){chainPhase=2;chainClock=0;addChaos(22);
   const direction=new THREE.Vector2(plantHome.x-toyBall.position.x,plantHome.z-toyBall.position.z).normalize();
   toyVelocity.addScaledVector(direction,5.4);
   notice('⚽ הכוס הבהילה את מילקי! הכדור טס לעציץ!',2.4);
  }
 }
 if(chainPhase===2){chainClock+=dt;
  if(Math.hypot(toyBall.position.x-plantHome.x,toyBall.position.z-plantHome.z)<.85 || chainClock>2.3)bumpPlant();
 }
 if(chainPhase===3){plantFall=Math.min(1.24,plantFall+dt*2.4);dominoPlant.rotation.z=-plantFall;}

 if(sceneTimer>0){sceneTimer-=dt;if(sceneTimer<=0 && ballCooldown===0)playNotice.classList.remove('show')}
 if(mugFlying){mugVel.y-=9.8*dt;mug.position.addScaledVector(mugVel,dt);mug.rotation.z+=dt*5.2;mug.rotation.x+=dt*2.1;
 if(mug.position.y<=.17){mug.position.y=.17;mugVel.y*=-.25;mugVel.x*=.6;mugVel.z*=.6;
 if(Math.abs(mugVel.y)<.6)mugFlying=false;}}
}
