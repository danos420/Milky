// ===== Navigation grid (shared by dad and Dani) =====
// Walkable cells over the living room, doorway and kitchen, padded by body radius.
// 8-way breadth-first search + line-of-sight smoothing.
const NAV={cell:.4,ox:-19.8,oz:-39.8,nx:0,nz:0,free:null};
NAV.nx=Math.floor(39.6/NAV.cell)+1;NAV.nz=Math.floor(55.6/NAV.cell)+1;
function dadFree(x,z,r=DAD_R){
 if(!walkable(x,z,r))return false;
 for(const o of obstacles){const cx=Math.max(o.x-o.w/2,Math.min(x,o.x+o.w/2)),cz=Math.max(o.z-o.d/2,Math.min(z,o.z+o.d/2));if((x-cx)**2+(z-cz)**2<r*r)return false}
 for(const c of decorRounds)if(Math.hypot(x-c.x,z-c.z)<c.r+r)return false;
 if(chainPhase<3&&Math.hypot(x-dominoPlant.position.x,z-dominoPlant.position.z)<.33+r)return false;
 return true;
}
const cellX=i=>NAV.ox+i*NAV.cell,cellZ=j=>NAV.oz+j*NAV.cell;
function buildNav(){NAV.free=new Uint8Array(NAV.nx*NAV.nz);for(let j=0;j<NAV.nz;j++)for(let i=0;i<NAV.nx;i++)NAV.free[j*NAV.nx+i]=dadFree(cellX(i),cellZ(j),DAD_R+.06)?1:0;NAV.plantUp=chainPhase<3}
function patchNav(x,z,rad){const r=Math.ceil(rad/NAV.cell),ci=Math.round((x-NAV.ox)/NAV.cell),cj=Math.round((z-NAV.oz)/NAV.cell);for(let j=cj-r;j<=cj+r;j++)for(let i=ci-r;i<=ci+r;i++){if(i<0||j<0||i>=NAV.nx||j>=NAV.nz)continue;NAV.free[j*NAV.nx+i]=dadFree(cellX(i),cellZ(j),DAD_R+.06)?1:0}NAV.plantUp=chainPhase<3}
function lineFree(x0,z0,x1,z1,r=DAD_R){const d=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.ceil(d/.12));for(let k=1;k<=n;k++){const t=k/n;if(!dadFree(x0+(x1-x0)*t,z0+(z1-z0)*t,r))return false}return true}
function nearestFreeCell(x,z){
 const ci=Math.round((x-NAV.ox)/NAV.cell),cj=Math.round((z-NAV.oz)/NAV.cell);
 for(let ring=0;ring<40;ring++){let best=-1,bd=Infinity;
  for(let j=cj-ring;j<=cj+ring;j++)for(let i=ci-ring;i<=ci+ring;i++){
   if(Math.max(Math.abs(i-ci),Math.abs(j-cj))!==ring||i<0||j<0||i>=NAV.nx||j>=NAV.nz)continue;
   const k=j*NAV.nx+i;if(!NAV.free[k])continue;const d=(cellX(i)-x)**2+(cellZ(j)-z)**2;if(d<bd){bd=d;best=k}}
  if(best>=0)return best}
 return -1;
}
let NAV_PREV=null,NAV_Q=null;
function findPath(fx,fz,tx,tz){
 if(!NAV.free)buildNav();else if(NAV.plantUp!==(chainPhase<3))patchNav(dominoPlant.position.x,dominoPlant.position.z,1.4);
 const start=nearestFreeCell(fx,fz);if(start<0)return[];
 if(!NAV_PREV||NAV_PREV.length!==NAV.free.length){NAV_PREV=new Int32Array(NAV.free.length);NAV_Q=new Int32Array(NAV.free.length)}
 const prev=NAV_PREV.fill(-1);prev[start]=start;
 const queue=NAV_Q;let qn=1;queue[0]=start;let best=start,bestD=Infinity;
 const dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
 for(let q=0;q<qn;q++){
  const k=queue[q],i=k%NAV.nx,j=(k/NAV.nx)|0,d=(cellX(i)-tx)**2+(cellZ(j)-tz)**2;
  if(d<bestD){bestD=d;best=k;if(d<NAV.cell*NAV.cell*.3)break}
  for(const [di,dj] of dirs){
   const ii=i+di,jj=j+dj;if(ii<0||jj<0||ii>=NAV.nx||jj>=NAV.nz)continue;
   const kk=jj*NAV.nx+ii;if(!NAV.free[kk]||prev[kk]>=0)continue;
   if(di&&dj&&(!NAV.free[j*NAV.nx+ii]||!NAV.free[jj*NAV.nx+i]))continue;
   prev[kk]=k;queue[qn++]=kk;
  }
 }
 const path=[];for(let k=best;k!==start;k=prev[k])path.push([cellX(k%NAV.nx),cellZ((k/NAV.nx)|0)]);
 path.reverse();
 if(dadFree(tx,tz))path.push([tx,tz]);
 return path;
}
function randomFreeSpot(z0=-7.8,z1=7.8){for(let n=0;n<40;n++){const x=-5.4+Math.random()*10.8,z=z0+Math.random()*(z1-z0);if(dadFree(x,z,DAD_R+.25))return[x,z]}return[dadHome.x,dadHome.z]}
const dadNav={path:[],repath:0,tx:0,tz:0,stuck:0,giveUp:0};
let dadSeated=false,dadChairGrumble=0,dadLaughT=0;
const DAD_EMOJI={chase:'😠',search:'🤔',investigate:'❓',pet:'🥰',celebrate:'🤦',return:'😤'};
function dadTakeSlipper(){
 if(slipper.parent)slipper.parent.remove(slipper);
 dad.add(slipper);slipper.position.set(-.6,1.18,.12);slipper.rotation.set(-Math.PI/2.4,0,.3);
 slipperState='dad';setDadState('return');
}
function dadPutSlipperBack(){
 dad.remove(slipper);scene.add(slipper);slipper.position.copy(slipperHome);slipper.rotation.set(0,0,0);
 slipperState='floor';setDadState('rest','זהו. הכפכף נשאר פה, מילקי!');dadRoutine=3;
 missionText('אבא החזיר את הכפכף. נסה שוב! 🩴');
}
const armchairObs=()=>obstacles.find(o=>o.name==='כורסה');
function unseatDad(){if(!dadSeated)return;dadSeated=false;dad.position.set(SEAT_APPROACH.x,0,SEAT_APPROACH.z)}

