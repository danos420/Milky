// ===== Kitchen: through the doorway in the wall behind dad's armchair =====
const kTileA=mat(0xdcd4c3),kTileB=decal(mat(0x9fb3aa)),kWall=mat(0xcbb79c),counterMat=mat(0xece4d4,.55),cabMat=mat(0x6c8c84),cabDark=mat(0x55716a),steel=mat(0xc3cacd,.35),fridgeMat=mat(0xeef0ee,.4);
box(13,.18,7,kTileA,0,-.09,12.5);
for(let x=-6;x<=6;x++)for(let z=9.5;z<=15.5;z++)if(((x+6)+(z-9.5))%2===0){const t=box(1,.006,1,kTileB,x,.004,z);t.castShadow=false}
box(.2,4,7.2,kWall,-6.5,2,12.5);box(.2,4,7.2,kWall,6.5,2,12.5);box(13,4,.2,kWall,0,2,16);
// Door frame in the shared wall
const frameMat=darkWood.clone();frameMat.transparent=true;box(.12,3.1,.28,frameMat,-4.2,1.55,9);box(.12,3.1,.28,frameMat,-1.6,1.55,9);box(2.72,.12,.28,frameMat,-2.9,3.1,9);box(2.5,.02,.3,darkWood,-2.9,.01,9);
// Counter with stove and sink along the back wall
box(8.4,.85,.9,cabMat,-2.2,.425,15.45);box(8.5,.1,.98,counterMat,-2.2,.9,15.44);
for(let x=-6;x<=1.6;x+=1.05){box(.02,.7,.02,cabDark,x,.43,14.99);ball(.035,steel,x+.45,.62,14.98)}
box(1.25,.02,.75,black,-3.8,.96,15.4);for(const [a,b] of [[-.3,-.17],[.3,-.17],[-.3,.17],[.3,.17]]){const bn=cyl(.13,.02,mat(0x3d3d3d),-3.8+a,.975,15.4+b);bn.castShadow=false}
const stovePot=cyl(.24,.32,steel,-3.6,1.13,15.32);cyl(.25,.03,mat(0x9aa3a6),-3.6,1.3,15.32);
box(.95,.04,.6,steel,-.8,.955,15.42);cyl(.035,.38,steel,-.8,1.15,15.75);box(.04,.04,.25,steel,-.8,1.33,15.64);
box(6.2,1.0,.5,cabMat,-3,2.95,15.65);box(1.4,.5,.7,steel,-3.8,2.25,15.5);
for(let x=-5.8;x<=0;x+=1.03)box(.02,.85,.02,cabDark,x,2.95,15.39);
// Fridge (solid) with a door that swings open
box(1.15,2.2,.95,fridgeMat,5.75,1.1,15.4);
const fridgeHinge=new THREE.Group();fridgeHinge.position.set(6.33,0,14.9);scene.add(fridgeHinge);
box(1.15,2.12,.08,mat(0xf6f7f5,.35),-.575,1.1,-.04,fridgeHinge);box(.06,.6,.06,steel,-1.03,1.3,-.11,fridgeHinge);
const fridgeLight=box(1.0,1.9,.02,new THREE.MeshBasicMaterial({color:0xfff6d8}),5.75,1.15,14.96);fridgeLight.castShadow=false;fridgeLight.visible=false;
for(const [x,y,c] of [[5.4,.55,0xd8573d],[5.95,.55,0x7fb069],[5.5,1.7,0xf2c14e],[6.0,1.7,0xe8e2d0]])box(.28,.26,.2,mat(c),x,y,15.05);
// Dining table and two chairs
box(1.9,.08,1.2,wood,2,.76,11.8);for(const x of [1.2,2.8])for(const z of [11.35,12.25])box(.1,.72,.1,darkWood,x,.36,z);
for(const [x,bx] of [[.55,.3],[3.45,3.7]]){box(.55,.08,.55,wood,x,.46,11.8);for(const dx of [-.22,.22])for(const dz of [-.22,.22])box(.06,.42,.06,darkWood,x+dx,.21,11.8+dz);box(.06,.65,.55,wood,bx,.82,11.8)}
// Fruit bowl (mango, banana, pineapple vibes) and a pendant lamp
cyl(.3,.1,mat(0xc77b4a),2,.85,11.8);ball(.12,mat(0xf2a33a),1.9,.97,11.75);ball(.11,mat(0xf6d743),2.1,.97,11.85);ball(.1,mat(0xe86f3c),2.0,1.0,11.95);
cyl(.015,1.1,black,2,3.45,11.8);const shade=mesh(new THREE.ConeGeometry(.38,.3,18,1,true),mat(0x2f5d55),2,2.8,11.8);shade.material.side=THREE.DoubleSide;
const kitchenLight=new THREE.PointLight(0xffe2b4,.95,13,2);kitchenLight.position.set(1,3.2,12.5);scene.add(kitchenLight);
// Milky's name-less food mat by the door
box(.9,.01,.6,mat(0x9c4a3a),-5.4,.006,10.1);
// Shadows now cover the kitchen too
sun.target.position.set(0,0,3.5);scene.add(sun.target);sun.shadow.camera.left=-16;sun.shadow.camera.right=16;sun.shadow.camera.top=16;sun.shadow.camera.bottom=-16;sun.shadow.camera.far=40;sun.shadow.camera.updateProjectionMatrix();
// Dad's armchair facing the TV
const ARMCHAIR={x:4.3,z:7.85},SEAT_APPROACH=new THREE.Vector3(4.3,0,6.75);
const armchair=new THREE.Group();armchair.position.set(ARMCHAIR.x,0,ARMCHAIR.z);armchair.rotation.y=Math.atan2(6.3-ARMCHAIR.x,1.2-ARMCHAIR.z);scene.add(armchair);
{const cm=mat(0x8c5a3c),cd=mat(0x6e4430);box(1.05,.45,1.0,cm,0,.3,0,armchair);box(1.05,.16,.95,mat(0xa36d4a),0,.6,.02,armchair);box(1.15,1.1,.22,cd,0,.85,-.48,armchair);for(const s of [-1,1])box(.2,.75,1.0,cd,s*.55,.48,0,armchair)}
