// ===== Shared collision resolver for loose objects =====
// Every loose prop is a circle on the floor. Each frame they are pushed out of
// furniture, decor, Milky, dad and each other, and bounce with real impulses,
// so objects collide instead of sliding through one another.
const bodies=[];
function addBody(obj,r,getV,setV,hop){bodies.push({o:obj,r,getV,setV,hop,hit:0})}
let impactSoundCooldown=0;
function bodyImpact(b,strength){
 if(strength<1.6||b.hit>0)return;
 b.hit=.45;addChaos(strength>3.5?5:2);
 if(b.o===trashProp.g&&strength>2.4)tipTrash();
 if(b.hop)b.hop(Math.min(2.6,strength*.45));
 if(impactSoundCooldown<=0){impactSoundCooldown=.09;playToySound(150+Math.random()*160,.08,'triangle')}
}
function bounce(b,nx,nz,rest){
 const [vx,vz]=b.getV(),vn=vx*nx+vz*nz;
 if(vn<0)b.setV(vx-(1+rest)*vn*nx,vz-(1+rest)*vn*nz);
 return vn<0?-vn:0;
}
function pushOutOfBox(b,o){
 const P=b.o.position;if(P.y>=o.top)return;
 const cx=Math.max(o.x-o.w/2,Math.min(P.x,o.x+o.w/2)),cz=Math.max(o.z-o.d/2,Math.min(P.z,o.z+o.d/2));
 let nx=P.x-cx,nz=P.z-cz,d=Math.hypot(nx,nz);
 if(d>=b.r)return;
 if(d<1e-5){ // centre is inside the furniture: leave through the nearest side
  const sides=[[P.x-(o.x-o.w/2),-1,0],[(o.x+o.w/2)-P.x,1,0],[P.z-(o.z-o.d/2),0,-1],[(o.z+o.d/2)-P.z,0,1]].sort((a,c)=>a[0]-c[0]);
  nx=sides[0][1];nz=sides[0][2];P.x+=nx*(sides[0][0]+b.r);P.z+=nz*(sides[0][0]+b.r);
 }else{nx/=d;nz/=d;P.x+=nx*(b.r-d);P.z+=nz*(b.r-d)}
 bodyImpact(b,bounce(b,nx,nz,.45));
}
function pushOutOfCircle(b,cx,cz,cr,rest,pusherV){
 const P=b.o.position;let nx=P.x-cx,nz=P.z-cz,d=Math.hypot(nx,nz),m=b.r+cr;
 if(d>=m)return false;
 if(d<1e-5){nx=1;nz=0;d=0}else{nx/=d;nz/=d}
 P.x+=nx*(m-d);P.z+=nz*(m-d);
 const hit=bounce(b,nx,nz,rest);
 if(pusherV){ // a moving pusher (Milky / dad) carries the object along
  const [vx,vz]=b.getV(),along=vx*nx+vz*nz,want=pusherV[0]*nx+pusherV[1]*nz+.6;
  if(along<want)b.setV(vx+(want-along)*nx,vz+(want-along)*nz);
 }
 bodyImpact(b,hit);
 return true;
}
let lastDogX=0,lastDogZ=0,lastDadX=0,lastDadZ=0,lastDaniX=0,lastDaniZ=0;
function resolveBodies(dt){
 impactSoundCooldown-=dt;
 const dogV=[(pos.x-lastDogX)/Math.max(dt,1e-4),(pos.z-lastDogZ)/Math.max(dt,1e-4)];
 const dadV=[(dad.position.x-lastDadX)/Math.max(dt,1e-4),(dad.position.z-lastDadZ)/Math.max(dt,1e-4)];
 const daniV=[(dani.position.x-lastDaniX)/Math.max(dt,1e-4),(dani.position.z-lastDaniZ)/Math.max(dt,1e-4)];
 lastDogX=pos.x;lastDogZ=pos.z;lastDadX=dad.position.x;lastDadZ=dad.position.z;lastDaniX=dani.position.x;lastDaniZ=dani.position.z;
 for(const b of bodies){b.hit=Math.max(0,b.hit-dt);const [vx,vz]=b.getV(),sp=Math.hypot(vx,vz);if(sp>11)b.setV(vx/sp*11,vz/sp*11)}
 for(let iter=0;iter<3;iter++){
  // object vs object
  for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){
   const a=bodies[i],c=bodies[j],A=a.o.position,C=c.o.position;
   if(carried.has(a.o)||carried.has(c.o))continue;
   let nx=C.x-A.x,nz=C.z-A.z,d=Math.hypot(nx,nz),m=a.r+c.r;
   if(d>=m)continue;
   if(d<1e-5){nx=1;nz=0;d=0}else{nx/=d;nz/=d}
   const push=(m-d)/2;A.x-=nx*push;A.z-=nz*push;C.x+=nx*push;C.z+=nz*push;
   const [ax,az]=a.getV(),[cx,cz]=c.getV(),rel=(cx-ax)*nx+(cz-az)*nz;
   if(rel<0){const imp=-(1+.6)*rel/2;a.setV(ax-imp*nx,az-imp*nz);c.setV(cx+imp*nx,cz+imp*nz);bodyImpact(a,-rel);bodyImpact(c,-rel)}
  }
  for(const b of bodies){
   if(carried.has(b.o))continue;
   for(const o of obstacles)pushOutOfBox(b,o);
   for(const r of decorRounds)pushOutOfCircle(b,r.x,r.z,r.r,.4);
   if(chainPhase<3&&!b.isBall)pushOutOfCircle(b,dominoPlant.position.x,dominoPlant.position.z,.33,.4);
   if(jumpY<.6*MS)pushOutOfCircle(b,pos.x,pos.z,dogRadius*Math.max(1,MS*.95),.3,dogV);
   pushOutOfCircle(b,dad.position.x,dad.position.z,DAD_R,.3,dadV);
   pushOutOfCircle(b,dani.position.x,dani.position.z,DANI_R,.3,daniV);
   pushOutOfCircle(b,neighbor.g.position.x,neighbor.g.position.z,NB_R,.3);pushOutOfCircle(b,lady.g.position.x,lady.g.position.z,LADY_R,.3);
   const P=b.o.position;
   if(!walkable(P.x,P.z,b.r)){const [nx,nz]=nearestWalkable(P.x,P.z,b.r),dx=nx-P.x,dz=nz-P.z,d=Math.hypot(dx,dz)||1;P.x=nx;P.z=nz;bounce(b,dx/d,dz/d,.5)}
  }
 }
}
