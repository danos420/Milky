// Milky: a long, curious cartoon dog, with independently animated paws, ears and tail.
const dog=new THREE.Group();scene.add(dog);dog.rotation.order='YXZ';
const fur=mat(0xf4f0e8,.9),tanFur=mat(0xd9a867,.9),earFur=tanFur,earInner=mat(0xeccfae,.9),noseMat=mat(0x1c1a1a,.5),eyeWhite=mat(0x3a2618,.4),iris=mat(0x0d0806,.3),pink=mat(0xd27b86,.6),freckle=mat(0xcdbba7);
const torso=new THREE.Group();dog.add(torso);
const S=(p,m,x,y,z,sx,sy,sz,seg=20)=>{const o=mesh(new THREE.SphereGeometry(1,seg,Math.max(6,Math.round(seg*.7))),m,x,y,z,p);o.scale.set(sx,sy,sz);return o};
// Milky's real build: tall, lean, long-legged, deep chest and tucked waist; white with tan patches.
const chest=S(torso,fur,0,1.12,.42,.33,.4,.4,24);
const body=S(torso,fur,0,1.2,-.12,.28,.24,.62,24);
const rump=S(torso,fur,0,1.18,-.62,.3,.27,.3,20);
const backPatch=S(torso,tanFur,.03,1.39,.04,.24,.09,.27,20);   // tan saddle on the back
const hipPatch=S(torso,tanFur,-.15,1.24,-.62,.17,.19,.22,16);  // tan patch on the hip
const tailPatch=S(torso,tanFur,0,1.31,-.86,.12,.1,.1,12);      // tan at the base of the tail
const neck=S(torso,fur,0,1.48,.62,.17,.3,.19,16);neck.rotation.x=-.55;
const collar=mesh(new THREE.TorusGeometry(.185,.035,8,20),mat(0x4b4f55,.5),0,1.43,.6,torso);collar.rotation.x=Math.PI/2-.55;
const headPivot=new THREE.Group();headPivot.position.set(0,1.74,.8);torso.add(headPivot);
const skull=S(headPivot,tanFur,0,.06,.06,.25,.25,.29,24);      // golden mask over the head and ears
const blaze=S(headPivot,fur,0,.13,.17,.07,.2,.21,14);blaze.rotation.x=.35; // white stripe down the forehead
const cheeks=S(headPivot,fur,0,-.08,.2,.21,.16,.24,18);        // white jaw and cheeks
const snout=S(headPivot,fur,0,-.07,.44,.12,.11,.3,20);       // long white muzzle
for(const [x,y,z] of [[.07,-.02,.56],[-.06,0,.52],[.045,.03,.49],[-.085,-.04,.58]])S(headPivot,freckle,x,y,z,.013,.013,.008,6);
const nose=S(headPivot,noseMat,0,-.025,.72,.065,.055,.05,14);
const eyes=[];
for(const s of [-1,1]){
  const white=S(headPivot,eyeWhite,s*.13,.09,.3,.052,.06,.035,12);
  const pupil=S(headPivot,iris,s*.13,.085,.325,.03,.04,.015,10);eyes.push({white,pupil,s});
}
const tongue=S(headPivot,pink,0,-.17,.5,.075,.02,.025,12);
const mouth=S(headPivot,noseMat,0,-.15,.5,.1,.03,.015,10);
let tongueTimer=0,mood=0,blinkTimer=0;const moodNames=["רגיל","שמח","סקרן","תמים"];
function stickTongue(){tongueTimer=2.4}
function nextMood(){mood=(mood+1)%4;setBtn('moodBtn',["😄","😍","🤨","🥺"][mood],["הבעה","שמח","סקרן","תמים"][mood])}
document.querySelector("#tongueBtn").addEventListener("click",()=>toggleGrab());document.querySelector("#ragdollBtn").addEventListener("click",()=>startRagdoll());document.querySelector("#moodBtn").addEventListener("click",nextMood);
window.addEventListener("keydown",e=>{if(e.repeat)return;if(e.code==="KeyT"){const h=window.CTRL_READY&&ctxHook("grab");h?h.fn():toggleGrab()};if(e.code==="KeyX")startRagdoll();if(e.code==="KeyF")nextMood()});
const ears=[];
// Rose ears: tan, sticking out sideways like little wings, tips folded over.
for(const s of [-1,1]){
  const pivot=new THREE.Group();pivot.position.set(s*.2,.2,0);headPivot.add(pivot);
  const ear=new THREE.Group();ear.rotation.z=-s*1.5;ear.rotation.y=s*.35;pivot.add(ear);
  S(ear,earFur,0,.11,0,.085,.13,.022,14);S(ear,earInner,0,.1,.016,.055,.09,.01,10);
  const tip=new THREE.Group();tip.position.y=.2;tip.rotation.x=.6;tip.rotation.z=-s*.7;ear.add(tip);S(tip,earFur,0,.05,0,.06,.08,.02,10);
  ears.push({pivot,s,ax:0,vx:0,az:0,vz:0});
}
const legs=[];
// Long two-part legs, attached to the body so sitting, lying and standing up all move them together.
for(const front of [true,false])for(const s of [-1,1]){
  const pivot=new THREE.Group();pivot.position.set(s*.2,1.0,front?.5:-.6);torso.add(pivot);
  S(pivot,fur,0,-.17,front?0:-.04,.12,front?.26:.3,front?.13:.17,14);
  const knee=new THREE.Group();knee.position.set(0,-.4,0);pivot.add(knee);
  S(knee,fur,0,-.24,0,.065,.27,.07,12);
  S(knee,fur,0,-.53,.06,.09,.06,.13,12);
  legs.push({pivot,knee,front,s});
}
// Long thin white tail that hangs down and curls up at the end (sickle tail).
const tail=new THREE.Group();tail.position.set(0,1.28,-.9);tail.rotation.x=-2.0;torso.add(tail);
const tailSegs=[];
{let parent=tail;for(let i=0;i<6;i++){const seg=new THREE.Group();seg.position.y=i?.13:0;seg.rotation.x=.3;parent.add(seg);const r=.048-i*.004;
 S(seg,fur,0,.07,0,r,.08,r,10);tailSegs.push(seg);parent=seg}}
let idleTime=0,idleAction=null,idleClock=0,squash=0,squashKick=0,wagPhase=0,wasScared=false,petGlow=0;
const IDLE_ACTIONS=['sniff','scratch','yawn','lie','look'],IDLE_LEN={sniff:3,scratch:2.4,yawn:2,lie:5.5,look:2.6,stand:3.6};
// Like the real Milky: if he is facing a counter, table or window he stands up on his hind legs to look.
function canStandUp(){const fx=pos.x+Math.sin(yaw)*.95,fz=pos.z+Math.cos(yaw)*.95;return grounded&&jumpY<.1&&(!walkable(fx,fz,.05)||obstacles.some(o=>!o.solid&&o.top>.6&&o.top<1.3&&insidePlatform(o,fx,fz,0)))}
function pointOfInterest(){
 const list=[];
 if(snack.visible)list.push({x:.5,y:1.1,z:.3,food:true});
 if(slipperState==='floor')list.push({x:slipper.position.x,y:.1,z:slipper.position.z});
 if(sausageState==='floor')list.push({x:sausage.position.x,y:.1,z:sausage.position.z,food:true});
 list.push({x:toyBall.position.x,y:.34,z:toyBall.position.z});
 list.push({x:dad.position.x,y:2.4+dad.position.y,z:dad.position.z});
 list.push({x:dani.position.x,y:2.2,z:dani.position.z});
 let best=null;for(const p of list){p.d=Math.hypot(p.x-pos.x,p.z-pos.z);if(p.d<4.5&&(!best||p.d-(p.food?1.2:0)<best.d-(best.food?1.2:0)))best=p}
 return best;
}

