// ===== Walkable areas: living room + doorway + kitchen =====
const AREAS=[{x0:-6.4,x1:6.4,z0:-8.9,z1:8.9},{x0:-6.4,x1:6.4,z0:9.1,z1:15.9},{x0:-20,x1:20,z0:-40,z1:-9.1}];
const DOORS=[{x0:-4.2,x1:-1.6,z0:8.3,z1:9.7},{x0:-2.4,x1:0,z0:-9.7,z1:-8.3}];
obstacles.push({name:'טרמפולינה',x:14,z:-17,w:3,d:3,top:.55,bouncy:true},{name:'מחסן',x:16.5,z:-26,w:5,d:4,top:2.6},{name:'מנגל',x:2,z:-33.2,w:1.2,d:.6,top:.95,solid:true},{name:'ספסל',x:-6,z:-35,w:2.2,d:.7,top:.5},{name:'שולחן פלסטיק',x:0,z:-12.5,w:1.3,d:1.3,top:.74});
function walkable(x,z,r){
 for(const a of AREAS)if(x>=a.x0+r&&x<=a.x1-r&&z>=a.z0+r&&z<=a.z1-r)return true;
 return DOORS.some(D=>D.ax?(z>=D.z0+r&&z<=D.z1-r&&x>=D.x0&&x<=D.x1):(x>=D.x0+r&&x<=D.x1-r&&z>=D.z0&&z<=D.z1));
}
function nearestWalkable(x,z,r){
 let best=[x,z],bd=Infinity;
 for(const a of [...AREAS,...DOORS.map(D=>D.ax?{x0:D.x0-r,x1:D.x1+r,z0:D.z0,z1:D.z1}:{x0:D.x0,x1:D.x1,z0:D.z0-r,z1:D.z1+r})]){
  const cx=Math.max(a.x0+r,Math.min(x,a.x1-r)),cz=Math.max(a.z0+r,Math.min(z,a.z1-r)),d=(cx-x)**2+(cz-z)**2;
  if(d<bd){bd=d;best=[cx,cz]}
 }
 return best;
}
const dogRadius=.40;
const insidePlatform=(o,x,z,margin=0)=>Math.abs(x-o.x)<o.w/2+margin&&Math.abs(z-o.z)<o.d/2+margin;
// The support surface is only valid when Milky's feet are already on/above it.
// A narrow inner margin prevents an edge from lifting the dog through furniture.
// A support is chosen only from platforms actually under the dog's center.
// Landing detection is performed separately using a swept vertical crossing.
const surfaceAt=(x,z,footY)=>obstacles.reduce((h,o)=>!o.solid&&insidePlatform(o,x,z,-.10)&&footY>=o.top-.045?Math.max(h,o.top):h,0);
var airApex=0; // highest point of the current jump (set by the game loop)
const landingSurface=(x,z,fromY,toY)=>obstacles.reduce((h,o)=>{
 if(o.solid)return h;
 // centre over the top: normal landing. A paw over the edge only counts when really coming down from above
 // (so stepping off the edge of a chair still drops you to the floor)
 const inner=insidePlatform(o,x,z,-.10),edge=!inner&&insidePlatform(o,x,z,.2)&&Math.max(fromY,airApex)>o.top+.12;
 if(!inner&&!edge)return h;
 return fromY>=o.top-.005&&toY<=o.top+.005?Math.max(h,o.top):h;
},0);
let grounded=true, landingCooldown=0, chaos=0, sceneTriggered=false, sceneTimer=0;
