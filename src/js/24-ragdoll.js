// ===== Ragdoll =====
const rag={active:false,t:0,vx:0,vy:0,vz:0,y:0,rx:0,ry:0,rz:0,q:new THREE.Quaternion(),w:new THREE.Vector3(),still:0,getup:0,bounces:0,floor:0};
let lastDogSpeed=0;
const _rq=new THREE.Quaternion(),_rv=new THREE.Vector3(),_ryq=new THREE.Quaternion(),_rup=new THREE.Vector3(0,1,0);
function startRagdoll(){
 if(rag.active||!started)return;
 rag.active=true;rag.t=0;const sp=lastDogSpeed;if(window.BATH_READY)bathRoll();if(window.JUICE_READY){hitStop(.06);pow(pick(['אאוץ׳!','אופס!','בונק!','אוי!']))}if(window.SICK_READY)sickRoll();
 // always a real tumble: forward momentum (a little even from standing), a hop, a somersault and a twist
 const fx=Math.sin(yaw),fz=Math.cos(yaw),push=Math.max(sp*1.1,2.4);
 rag.vx=fx*push+(Math.random()-.5)*1.6;rag.vz=fz*push+(Math.random()-.5)*1.6;rag.vy=Math.max(velocityY,0)+4.6;rag.y=jumpY;
 rag.q.setFromAxisAngle(_rup,yaw);
 const tumble=7+sp*.8+Math.random()*3;rag.w.set(Math.cos(yaw)*tumble,(Math.random()-.5)*6,-Math.sin(yaw)*tumble);if(Math.random()<.35)rag.w.multiplyScalar(-.7);
 rag.still=0;rag.getup=0;rag.bounces=0;
 if(slipperState==='carried')dropSlipper();if(kebabState==='carried')kebabBack('drop');releaseGrab(false);flip.active=false;
 milkyThought('😵',2,true);playToySound(220,.25,'sawtooth');grounded=true;velocityY=0;idleAction=null;
}
function ragFinish(){rag.active=false;jumpY=rag.floor;grounded=true;velocityY=0;rag.getup=0;
 addScore(Math.round(60+rag.t*30),'נפילה מבוימת');milkyThought(pick(['😅','😎','🤪']),1.6,true)}
function updateRagdoll(dt){
 rag.t+=dt;
 // getting back up: rotate upright onto the paws with a little hop, then hand control back
 if(rag.getup>0){rag.getup+=dt;_ryq.setFromAxisAngle(_rup,yaw);rag.q.slerp(_ryq,Math.min(1,dt*11));jumpY=rag.y;if(rag.getup>=.45){rag.q.copy(_ryq);ragFinish()}return}
 rag.vy-=14*mutG()*dt;rag.y+=rag.vy*dt;
 const blocked=(x,z)=>!walkable(x,z,.4)||obstacles.some(o=>(o.solid||rag.y<o.top-.15)&&insidePlatform(o,x,z,.39));
 const nx=pos.x+rag.vx*dt,nz=pos.z+rag.vz*dt;
 if(blocked(nx,pos.z)){if(Math.abs(rag.vx)>2.5){playToySound(150,.07,'square');rag.w.y+=(Math.random()-.5)*8}rag.vx*=-.5}else pos.x=nx;
 if(blocked(pos.x,nz)){if(Math.abs(rag.vz)>2.5){playToySound(150,.07,'square');rag.w.y+=(Math.random()-.5)*8}rag.vz*=-.5}else pos.z=nz;
 const floor=obstacles.reduce((h,o)=>!o.solid&&insidePlatform(o,pos.x,pos.z,.12)&&rag.y>=o.top-.2?Math.max(h,o.top):h,0); // the rim counts too: no sinking into a sofa edge
 rag.floor=floor;const onFloor=rag.y<=floor;
 if(onFloor){rag.y=floor;const tr=obstacles.find(o=>o.bouncy&&insidePlatform(o,pos.x,pos.z,-.1)&&Math.abs(o.top-floor)<.01);
  if(tr&&rag.vy<-1){rag.vy=Math.min(11,-rag.vy*.9+2);playToySound(180,.12,'sine')}
  else if(rag.vy<-2.2){const hit=-rag.vy;rag.vy*=-.42;rag.bounces++;squash=Math.min(1,hit/9);squashKick=squash;
   for(let i=0;i<8;i++){const a=i/8*6.283;emit(pos.x+Math.cos(a)*.3,floor+.08,pos.z+Math.sin(a)*.3,Math.cos(a)*1.6,.6,Math.sin(a)*1.6,'dust',.7)}
   playToySound(rag.bounces===1?120:150,.08,'sine');if(rag.bounces===1){chaosShake=Math.max(chaosShake,.18);if(window.JUICE_READY&&hit>6)pow(pick(['בום!','פלופ!','בונק!']),pos.x,1.4,pos.z)}
   rag.w.multiplyScalar(.7);rag.w.y+=(Math.random()-.5)*5}
  else rag.vy=0;
  // on the ground he rolls the way he slides (like a ball), and friction brings the slide to a stop
  const sp=Math.hypot(rag.vx,rag.vz);
  if(sp>.2){_rv.set(rag.vz,0,-rag.vx).divideScalar(.45);rag.w.lerp(_rv,Math.min(1,dt*7))}else rag.w.multiplyScalar(Math.max(0,1-dt*7));
  const fr=Math.max(0,1-dt*2.4);rag.vx*=fr;rag.vz*=fr}
 else rag.w.multiplyScalar(Math.max(0,1-dt*.3));
 const ang=rag.w.length()*dt;if(ang>1e-5){_rq.setFromAxisAngle(_rv.copy(rag.w).normalize(),ang);rag.q.premultiply(_rq);rag.q.normalize()}
 jumpY=rag.y;
 // settled: lie there splatted for a moment, then get up
 if(onFloor&&Math.hypot(rag.vx,rag.vz)<.45&&Math.abs(rag.vy)<.5&&rag.t>.9){rag.still+=dt;if(rag.still>.65)rag.getup=1e-4}else rag.still=0;
 if(rag.t>6)rag.getup=1e-4;
}
