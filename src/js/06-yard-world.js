// ===== The yard: out through the balcony door (Goat-Simulator-style sandbox) =====
const lawnMat=mat(0x7da257),patioMat=mat(0xd6cdbd),stucco=mat(0xe9e4da),facade=mat(0xd8cbb6),shedWood=mat(0x8b6a4a),plasticWhite=mat(0xf3f3ef,.6);
box(40,.1,31,lawnMat,0,-.05,-24.5);
{const p=box(16,.02,7,patioMat,0,.01,-12.6);p.castShadow=false;for(let x=-7;x<=7;x+=1.4){const l=box(.02,.012,7,decal(mat(0xb9ae9c)),x,.026,-12.6);l.castShadow=false}}
for(const [x,z] of [[3,-17],[3.6,-18.8],[4.4,-20.6],[5.2,-22.4],[6.2,-24.2],[-3,-17],[-4,-18.6],[-5.2,-20],[-6.6,-21.2]]){const st=cyl(.38,.04,mat(0xbdb5a6),x,.02,z);st.castShadow=false}
// House facade continues on both sides of the living room, fences around the yard
box(13.6,4,.3,facade,-13.2,2,-9.15);box(13.6,4,.3,facade,13.2,2,-9.15);
box(40.6,2.1,.3,stucco,0,1.05,-40.15);box(.3,2.1,31,stucco,-20.15,1.05,-24.5);box(.3,2.1,31,stucco,20.15,1.05,-24.5);
// The view: hills and apartment blocks far away
for(const [x,z,s,c] of [[-30,-85,26,0x8f9f86],[10,-95,34,0x8a9a84],[45,-88,24,0x95a38c],[-55,-95,30,0x8c9b88]]){const h=ball(1,mat(c),x,-s*.55,z);h.scale.set(s*1.4,s,s*.6);h.castShadow=false}
for(let i=0;i<7;i++){const b=box(5,7+i%3*3,5,mat(i%2?0xd9d4c8:0xcfc8ba),-24+i*8,4+i%3*1.5,-62-i%2*6);b.castShadow=false}
// Trees
const trees=[[-5,-25],[6.5,-29],[-17,-14],[18,-37],[-10.5,-36]];
for(const [x,z] of trees){cyl(.22,2.2,mat(0x6b4a32),x,1.1,z);for(let i=0;i<5;i++){const a=i*1.3;ball(.9-i*.05,mat(i%2?0x4f7f45:0x5f9150),x+Math.cos(a)*.55,2.6+(i%3)*.35,z+Math.sin(a)*.55)}}
// Trampoline
const tramp=new THREE.Group();tramp.position.set(14,0,-17);scene.add(tramp);
{const m=cyl(1.45,.05,mat(0x1d1f24,.9),0,.55,0,tramp);m.castShadow=false;const rim=mesh(new THREE.TorusGeometry(1.5,.12,8,32),mat(0x3a7bd5),0,.58,0,tramp);rim.rotation.x=Math.PI/2;for(let i=0;i<4;i++){const a=i*Math.PI/2+.4;cyl(.05,.55,mat(0x888888),Math.cos(a)*1.4,.27,Math.sin(a)*1.4,tramp)}}
const trampMat=tramp.children[0];
// Shed with a flat roof you can land on
box(5,2.5,4,shedWood,16.5,1.25,-26);box(5.4,.14,4.4,mat(0x5c4632),16.5,2.57,-26);box(1.2,1.9,.06,mat(0x6b4f36),15.4,.95,-23.97);box(.6,.6,.06,mat(0xa9c7d6),17.6,1.6,-23.97);
// Kiddie pool
const poolC={x:-12,z:-19,r:1.6};
{const rim=mesh(new THREE.TorusGeometry(1.6,.2,10,32),mat(0x4fa3e0),poolC.x,.2,poolC.z);rim.rotation.x=Math.PI/2;const w=cyl(1.55,.24,new THREE.MeshStandardMaterial({color:0x86d0f0,roughness:.2,transparent:true,opacity:.8}),poolC.x,.12,poolC.z);w.castShadow=false;for(let i=0;i<5;i++){const d=ball(.12,mat([0xffd23f,0xff6b6b,0x6bcB77,0xffffff,0xff9f1c][i]),poolC.x+Math.cos(i*1.3)*.9,.26,poolC.z+Math.sin(i*1.3)*.9);d.castShadow=false}}
// Flower bed
const bedC={x:-14,z:-31};
box(5,.16,1.5,mat(0x6a4a33),bedC.x,.08,bedC.z);
for(let i=0;i<14;i++){const x=bedC.x-2.2+i*.34,z=bedC.z+(i%2?.35:-.35);cyl(.02,.35,mat(0x4f8a3c),x,.33,z);ball(.11,mat([0xff5d8f,0xffd23f,0xb388eb,0xff8c42][i%4]),x,.52,z)}
// Bench
box(2.2,.08,.7,mat(0x9a6b45),-6,.48,-35);box(2.2,.5,.08,mat(0x9a6b45),-6,.8,-35.33);for(const dx of [-.95,.95])box(.1,.45,.6,mat(0x444444),-6+dx,.23,-35);
// Mangal with glowing coals and kebab skewers
box(1.2,.35,.6,mat(0x222222,.6),2,.8,-33.2);for(const [dx,dz] of [[-.5,-.22],[.5,-.22],[-.5,.22],[.5,.22]])cyl(.03,.65,mat(0x333333),2+dx,.32,-33.2+dz);
{const coal=box(1.1,.04,.5,new THREE.MeshBasicMaterial({color:0xff7a2e}),2,.97,-33.2);coal.castShadow=false}
const kebab=new THREE.Group();scene.add(kebab);
{cyl(.012,.7,mat(0xb0b0b0),0,0,0,kebab).rotation.z=Math.PI/2;for(let i=0;i<5;i++){const c=ball(.06,mat(i%2?0x7a3b1e:0x9c5a2b),-.22+i*.11,0,0,kebab);c.scale.set(1,.85,.85)}}
const kebabHome=new THREE.Vector3(2,1.03,-33.15);kebab.position.copy(kebabHome);
for(const dz of [-.15,.15]){const k=kebab.clone();k.position.set(2,1.03,-33.15+dz);scene.add(k)}
// Patio table, laundry rack (like the real balcony) and clothes
box(1.3,.06,1.3,plasticWhite,0,.72,-12.5);for(const [dx,dz] of [[-.55,-.55],[.55,-.55],[-.55,.55],[.55,.55]])cyl(.035,.7,plasticWhite,dx,.35,-12.5+dz);
{const rk=mat(0x9aa3ab);for(const dx of [-.5,.5])cyl(.025,1.5,rk,-5+dx,.75,-11);for(let i=0;i<4;i++)cyl(.012,1.0,rk,-5,1.3+i*.1,-11+(i-1.5)*.15).rotation.z=Math.PI/2;
 for(const [x,c,h] of [[-5.3,0xff6b6b,.4],[-5,0x6bc4ff,.5],[-4.7,0xffd23f,.35]])box(.25,h,.02,mat(c),x,1.45-h/2,-11.05)}
// Golden bones hidden around the world
const boneMat=new THREE.MeshStandardMaterial({color:0xffd34d,emissive:0x7a5200,metalness:.5,roughness:.3});
const BONE_SPOTS=[[-4.8,1.45,3.6],[5.95,1.35,-1],[-5.6,1.4,15.45],[4.3,1.1,7.85],[2,1.25,11.8],[0,1.15,-12.5],[-12,.45,-19],[16.5,3.05,-26],[14,4.6,-17],[19.3,.45,-29.5],[-18.6,.45,-38.4],[-6,.95,-35]];
const bones=BONE_SPOTS.map(([x,y,z])=>{const g=new THREE.Group();g.position.set(x,y,z);scene.add(g);const c=cyl(.05,.36,boneMat,0,0,0,g);c.rotation.z=Math.PI/2;for(const s of [-1,1])for(const dz of [-.05,.05])mesh(new THREE.SphereGeometry(.07,10,8),boneMat,s*.19,0,dz,g);return {g,y,taken:false}});
