// ===== Tongue grab: carry small things in the mouth, drag big things =====
let grab=null;
const BIG_KINDS=['chair','cooler','bin','trash','cushion','box','soccer'];
const _mp=new THREE.Vector3();
function mouthPos(){headPivot.updateWorldMatrix(true,false);return headPivot.localToWorld(_mp.set(0,-.16,.66))}
function toggleGrab(){
 stickTongue();
 if(grab){releaseGrab(true);return}
 if(rag.active)return;
 const m=mouthPos();let best=null,bd=1.45;
 for(const b of bodies){if(carried.has(b.o))continue;const d=Math.hypot(b.o.position.x-m.x,b.o.position.z-m.z)-b.r;if(d<bd){bd=d;best=b}}
 if(!best){milkyThought('👅',1.2,true);return}
 const small=best.r<=.3&&!BIG_KINDS.includes(best.kind);
 grab={b:best,small,dist:0,lx:pos.x,lz:pos.z};
 if(small)carried.add(best.o);
 SFX.slurp();milkyThought('😼',1.4,true);
}
function releaseGrab(throwIt){
 if(!grab)return;const b=grab.b;carried.delete(b.o);
 if(grab.small){if(b.isBall)b.o.position.y=.34;else if(b.rec&&!('vy' in b.rec))b.o.position.y=0;else if(b.rec)b.rec.vy=1}
 if(throwIt){const sp=3+lastDogSpeed;b.setV(Math.sin(yaw)*sp,Math.cos(yaw)*sp);if(b.hop)b.hop(2.5);playToySound(300,.08,'triangle')}
 if(grab.dist>6)addScore(Math.round(grab.dist*25),'גרירה מקצועית '+grab.dist.toFixed(0)+' מ׳');
 grab=null;
}
function updateGrab(dt){
 if(!grab)return;const b=grab.b,m=mouthPos();
 grab.dist+=Math.hypot(pos.x-grab.lx,pos.z-grab.lz);grab.lx=pos.x;grab.lz=pos.z;
 if(b.rec)b.rec.lock=.5;
 if(grab.small){b.o.position.set(m.x,m.y-.06,m.z);b.o.rotation.y=yaw;b.setV(0,0)}
 else{const dx=m.x-b.o.position.x,dz=m.z-b.o.position.z;b.setV(dx*10,dz*10);if(Math.hypot(dx,dz)>2.4)releaseGrab(false)}
}
