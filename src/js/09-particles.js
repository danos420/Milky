// Particles (water, smoke)
const parts=[],partGeo=new THREE.SphereGeometry(.06,6,4);
const partMats={water:new THREE.MeshBasicMaterial({color:0x8fd3ff,transparent:true,opacity:.85}),smoke:new THREE.MeshBasicMaterial({color:0xd8d8d8,transparent:true,opacity:.35}),dust:new THREE.MeshBasicMaterial({color:0xc7b089,transparent:true,opacity:.4,depthWrite:false})};
for(let i=0;i<90;i++){const m=new THREE.Mesh(partGeo,partMats.water);m.visible=false;scene.add(m);parts.push({m,v:new THREE.Vector3(),life:0,g:0,grow:0})}
let partIdx=0;
function emit(x,y,z,vx,vy,vz,kind,life=.8){const p=parts[partIdx++%parts.length];p.m.material=partMats[kind];p.m.position.set(x,y,z);p.v.set(vx,vy,vz);p.life=life;p.g=(kind==='smoke'||kind==='dust')?-.6:9.8;p.grow=(kind==='smoke'||kind==='dust')?1.2:0;p.m.scale.setScalar((kind==='smoke'||kind==='dust')?1.8:1);p.m.visible=true}
function updateParts(dt){for(const p of parts){if(p.life<=0)continue;p.life-=dt;if(p.life<=0){p.m.visible=false;continue}p.v.y-=p.g*dt;p.m.position.addScaledVector(p.v,dt);if(p.grow)p.m.scale.multiplyScalar(1+p.grow*dt);if(p.g>0&&p.m.position.y<.03){p.m.visible=false;p.life=0}}}


