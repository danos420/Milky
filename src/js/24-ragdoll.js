// ===== Ragdoll =====
const rag={active:false,t:0,vx:0,vy:0,vz:0,wx:0,wy:0,wz:0,rx:0,ry:0,rz:0,y:0};
let lastDogSpeed=0;
function startRagdoll(){
 if(rag.active||!started)return;
 rag.active=true;rag.t=0;const sp=lastDogSpeed;if(window.BATH_READY)bathRoll();
 rag.vx=Math.sin(yaw)*sp*1.1+(Math.random()-.5)*2;rag.vz=Math.cos(yaw)*sp*1.1+(Math.random()-.5)*2;rag.vy=Math.max(velocityY,0)+4;rag.y=jumpY;
 rag.wx=(Math.random()-.5)*14;rag.wy=(Math.random()-.5)*8;rag.wz=(Math.random()-.5)*14;rag.rx=rag.ry=rag.rz=0;
 if(slipperState==='carried')dropSlipper();if(kebabState==='carried')kebabBack('drop');releaseGrab(false);flip.active=false;
 milkyThought('😵',2,true);playToySound(220,.25,'sawtooth');grounded=true;velocityY=0;idleAction=null;
}
function updateRagdoll(dt){
 rag.t+=dt;rag.vy-=14*mutG()*dt;rag.y+=rag.vy*dt;
 const blocked=(x,z)=>!walkable(x,z,.4)||obstacles.some(o=>(o.solid||rag.y<o.top-.15)&&insidePlatform(o,x,z,.39));
 const nx=pos.x+rag.vx*dt,nz=pos.z+rag.vz*dt;
 if(blocked(nx,pos.z))rag.vx*=-.5;else pos.x=nx;
 if(blocked(pos.x,nz))rag.vz*=-.5;else pos.z=nz;
 const floor=obstacles.reduce((h,o)=>!o.solid&&insidePlatform(o,pos.x,pos.z,-.1)&&rag.y>=o.top-.2?Math.max(h,o.top):h,0);
 if(rag.y<=floor){rag.y=floor;const tr=obstacles.find(o=>o.bouncy&&insidePlatform(o,pos.x,pos.z,-.1)&&Math.abs(o.top-floor)<.01);
  if(tr&&rag.vy<-1){rag.vy=Math.min(11,-rag.vy*.9+2);playToySound(180,.12,'sine')}
  else if(rag.vy<-2){rag.vy*=-.4;playToySound(130,.06,'sine')}else rag.vy=0;
  rag.vx*=.8;rag.vz*=.8;rag.wx*=.75;rag.wz*=.75;rag.wy*=.8}
 rag.rx+=rag.wx*dt;rag.ry+=rag.wy*dt;rag.rz+=rag.wz*dt;jumpY=rag.y;
 if(rag.t>2.2&&rag.y<=floor+.01&&Math.hypot(rag.vx,rag.vz)<1.2&&Math.abs(rag.vy)<.5){
  rag.active=false;jumpY=floor;grounded=true;velocityY=0;rag.rx=rag.rz=0;
  addScore(Math.round(60+rag.t*30),'נפילה מבוימת');milkyThought('😅',1.6,true);
 }
}
