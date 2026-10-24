// ===== Main menu button + a real human-shaped Milky for the errands mode =====
document.getElementById('menuBtn').addEventListener('click',()=>{
 started=false;for(const k in keys)keys[k]=false;for(const id of ['dayEnd','zOver','hEnd'])document.getElementById(id).hidden=true;
 if(typeof photoMode==='function'&&PHOTO.on)photoMode(false);evtPill.hidden=true;document.querySelector('#overlay').style.display='';
});
// Human Milky: built like the other people (same walk), with Milky's head, colours and tail
const HM=makePerson({skin:0xf4f0e8,shirt:0x34495e,pants:0x2c3440,shoes:0x1d1d1f,hair:h=>{
 const tan=mat(0xd9a867,.9),fur=mat(0xf4f0e8,.9);
 const cap=ball(.345,tan,0,.08,-.04,h);cap.scale.set(1,.75,1);
 const bl=ball(.12,fur,0,.12,.25,h);bl.scale.set(.5,1.3,.5);
 const mz=ball(.17,fur,0,-.12,.36,h);mz.scale.set(.85,.7,1.3);ball(.065,mat(0x1c1a1a,.5),0,-.06,.58,h);
 for(const s of [-1,1]){const e=ball(.14,tan,s*.33,.12,-.02,h);e.scale.set(.45,1.1,.35);e.rotation.z=-s*.9}
 const t=box(.24,.06,.04,mat(0xd27b86,.6),0,-.25,.47,h);t.rotation.x=.6}});
HM.g.visible=false;HM.g.scale.setScalar(.88);
{const tl=new THREE.Group();tl.position.set(0,1.1,-.24);HM.g.add(tl);let p=tl;for(let i=0;i<5;i++){const sg=new THREE.Group();sg.position.y=i?.12:0;sg.rotation.x=-.35;p.add(sg);ball(.045,mat(0xf4f0e8,.9),0,.06,0,sg);p=sg}HM.tail=tl;
 const tie2=new THREE.Group();tie2.position.set(0,1.95,.24);HM.g.add(tie2);box(.12,.1,.03,mat(0xc0392b,.5),0,0,0,tie2);box(.14,.5,.025,mat(0xc0392b,.5),0,-.3,0,tie2);for(let i=0;i<3;i++)box(.15,.03,.03,mat(0xf2c14e),0,-.15-i*.13,0,tie2);
 for(const s of [-1,1])box(.06,.5,.02,mat(0xf2efe6),s*.15,1.9,.23,HM.g)}
const hmB=makeBubble(HM.head,.6);
// move the errand props to the human rig
hat.parent.remove(hat);HM.head.add(hat);hat.position.set(0,.3,-.02);hat.scale.setScalar(1.15);
mohawk.parent.remove(mohawk);HM.head.add(mohawk);mohawk.position.set(0,.3,0);mohawk.scale.setScalar(1.3);
for(const g of [milkG,extG]){g.parent.remove(g);HM.arms[1].add(g);g.position.set(0,-.82,.18)}extG.rotation.set(0,0,0);
let hmWalk=0;
function humanRig(dt){
 const on=HUMAN;HM.g.visible=on;dog.visible=!on;if(!on)return;
 HM.g.position.set(pos.x,Math.max(0,jumpY),pos.z);
 if(rag.active){HM.g.quaternion.copy(dog.quaternion);HM.g.position.y=Math.max(0,rag.y)}else{HM.g.rotation.set(0,yaw,0)}
 const sp=lastDogSpeed,step=sp*dt*.85;
 animatePerson(HM,grounded&&!rag.active?step:0,dt,{run:sp>4,arm:i=>(i===1&&(milkG.visible||extG.visible))?-1.1:(!grounded?-2.6:0)});
 if(!grounded&&!rag.active){HM.legs.forEach((l,i)=>l.rotation.x=i?-.6:.4)}
 HM.g.position.y+=Math.max(0,jumpY)>0?0:0;
 const t=performance.now()/1000;HM.tail.rotation.z=Math.sin(t*(sp>.5?14:6))*.5;HM.head.rotation.y=Math.sin(t*.9)*.15;
 updateFace(HM.face,sp>4?'laugh':mood===3?'sad':'smile',dt);
}
// speech in human mode comes from the human head
const _say=sayText;sayText=function(b,text,dur,kind,force){if(HUMAN&&b===milkyB)b=hmB;return _say(b,text,dur,kind,force)};
const _th=thought;thought=function(b,e,d,f){if(HUMAN&&b===milkyB)b=hmB;return _th(b,e,d,f)};
window.HM_READY=true;
