function setChip(el,icon,label){if(typeof el==='string')el=document.getElementById(el);el.innerHTML=icon+' <span>'+label+'</span>'}
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9caeae);scene.fog=new THREE.Fog(0x9caeae,30,115);const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.25,160);const IS_TOUCH=matchMedia("(pointer:coarse)").matches;const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=0.72;document.body.appendChild(renderer.domElement);
const mat=(c,r=0.85)=>new THREE.MeshStandardMaterial({color:c,roughness:r});const wall=mat(0xb9a08b),floor=mat(0xb69b7f),wood=mat(0x96582d),darkWood=mat(0x563922),sofaMat=mat(0x73655d),cream=mat(0xd9bc95),tan=mat(0xc79460),black=mat(0x272321),gold=mat(0xe7b65d),gray=mat(0xb8b4a9);const mesh=(geo,m,x=0,y=0,z=0,parent=scene)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o};const box=(w,h,d,m,x,y,z,p=scene)=>mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,p);const ball=(r,m,x,y,z,p=scene)=>mesh(new THREE.SphereGeometry(r,16,12),m,x,y,z,p);const cyl=(r,h,m,x,y,z,p=scene)=>mesh(new THREE.CylinderGeometry(r,r,h,14),m,x,y,z,p);
// Room: sofa on left, television on right, table in center, dog bed near the sliding doors.
box(13,.18,18,floor,0,-.09,0);box(.2,4,18,wall,-6.5,2,0);box(.2,4,14.1,wall,6.5,2,-1.95);box(.2,4,1.7,wall,6.5,2,8.15);box(.2,.9,2.2,wall,6.5,3.55,6.2);// Balcony wall with an open sliding door; fades when the camera looks through it.
const balconyMat=wall.clone();balconyMat.transparent=true;box(4.1,4,.2,balconyMat,-4.45,2,-9);box(4.1,4,.2,balconyMat,4.45,2,-9);box(4.8,.45,.2,balconyMat,0,3.78,-9);// The wall between living room and kitchen fades when the camera looks through it.
const dividerMat=wall.clone();dividerMat.transparent=true;box(2.3,4,.2,dividerMat,-5.35,2,9);box(8.1,4,.2,dividerMat,2.45,2,9);box(2.6,.9,.2,dividerMat,-2.9,3.55,9);
const decal=m=>{m.polygonOffset=true;m.polygonOffsetFactor=-2;m.polygonOffsetUnits=-4;return m};const tile=decal(mat(0xa58b74));for(let x=-6;x<=6;x+=1.5)box(.03,.009,18,tile,x,.009,0);for(let z=-8.5;z<=8.5;z+=1.5)box(13,.009,.03,tile,0,.009,z);
// sofa
box(2.35,.75,7.1,sofaMat,-4.8,.52,1.3);box(.45,1.45,7.2,sofaMat,-6.1,.87,1.3);box(2.4,.9,.4,sofaMat,-4.8,.7,-2.2);box(2.4,.9,.4,sofaMat,-4.8,.7,4.8);for(let z=-1.6;z<4.7;z+=1.4)box(1.8,.23,1.25,mat(0x9d8a7c),-4.65,1,z);
// coffee table
box(2.8,.18,3.3,wood,0,.83,.9);for(let x of [-1.05,1.05])for(let z of [-.3,2.1])box(.24,.72,.24,darkWood,x,.42,z);const snack=ball(.22,gold,.5,1.08,.3);const wrapper=box(.52,.045,.37,mat(0xe35839),.5,1.015,.3);
// TV cabinet and TV
box(.75,.65,5.5,cream,5.95,.48,1.2);box(.82,.1,5.6,wood,5.95,.85,1.2);const tv=box(.13,2.05,3.4,black,6.34,2.15,1.2);const screen=box(.012,1.8,3.15,mat(0x294a62),6.42,2.15,1.2);const tvglow=box(.015,.6,1.1,mat(0x6b9bc0),6.43,2.35,1.2);
// dog bed by balcony
// Milky's grey bed with a patterned rim and his orange plush toy
{const rim=mat(0x3c3e45),pad=mat(0x9ea3aa),bolster=mat(0x8a9097);box(2.3,.2,1.9,rim,3.5,.1,-6.4);box(1.9,.1,1.5,pad,3.5,.25,-6.4);for(const [x,z,w,d] of [[3.5,-7.22,2.2,.26],[3.5,-5.58,2.2,.26],[2.48,-6.4,.26,1.9],[4.52,-6.4,.26,1.9]])box(w,.26,d,bolster,x,.33,z);for(let i=0;i<10;i++)box(.12,.012,.012,mat(0xdedede),2.5+i*.22,.13,-5.44);const toy=mat(0xd9893a);ball(.16,toy,3.1,.42,-6.7);ball(.11,toy,3.25,.5,-6.6);cyl(.04,.4,toy,3.35,.36,-6.85).rotation.z=1.2;cyl(.04,.35,toy,2.9,.36,-6.55).rotation.x=1.3}
// glass balcony door
box(5,.1,.12,mat(0x858f99),0,3.55,-8.84);for(let x of [-2.5,0,2.5])box(.08,3.2,.12,mat(0x858f99),x,1.9,-8.83);const glass=new THREE.Mesh(new THREE.PlaneGeometry(2.4,3),new THREE.MeshBasicMaterial({color:0x82aec5,transparent:true,opacity:.22,side:THREE.DoubleSide}));glass.position.set(1.2,1.9,-8.95);scene.add(glass);
// plant and lamp
cyl(.28,.65,mat(0x8a6347),-2.5,.32,-7.3);for(let i=0;i<8;i++)ball(.38,mat(i%2?0x4d9155:0x75a65d),-2.5+Math.sin(i*2)*.3,1+Math.cos(i)*.25,-7.3+Math.cos(i*2)*.3);cyl(.08,2.1,mat(0x777777),-5.8,1.05,-6.3);ball(.4,cream,-5.8,2.35,-6.3);
const ambient=new THREE.HemisphereLight(0xffd9ae,0x51433d,0.54);scene.add(ambient);const sun=new THREE.DirectionalLight(0xffbf79,1.24);sun.position.set(0,8,-7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.bias=-0.0002;sun.shadow.radius=3;sun.shadow.camera.left=-13;sun.shadow.camera.right=13;sun.shadow.camera.top=13;sun.shadow.camera.bottom=-13;scene.add(sun);
// Cozy art pass: warm rug, cushions, shelves, plants, and scattered toys.
const rug=decal(mat(0x96775d)),rugTrim=decal(mat(0xc9a984)),pillowA=mat(0xc57850),pillowB=mat(0x536e60),pot=mat(0x9d6346),leaf=mat(0x3e704c),leafLight=mat(0x668c50);
// Thin decorative rug sits below the table and does not affect collision.
box(4.65,.016,5.65,rug,-.15,.023,.85);box(4.3,.018,5.3,rugTrim,-.15,.035,.85);box(4.03,.02,5.02,rug,-.15,.048,.85);
// Colorful throw cushions on the existing sofa.
for(let i=0;i<4;i++){const c=box(.65,.48,.20,i%2?pillowB:pillowA,-4.9,1.20,-1.3+i*1.55);c.rotation.x=-.25;c.rotation.z=(i%2?-.12:.12)}
// Small decor on the cabinet, away from the screen.
box(.30,.32,.38,mat(0xb47e50),5.93,1.05,-1.05);ball(.22,leafLight,5.93,1.37,-1.05);
// Two framed pictures on the back wall.
for(let i=0;i<2;i++){box(1.0,.8,.06,darkWood,-5.4+i*1.2,2.55,-8.82);box(.83,.64,.072,i?mat(0x668b81):mat(0xb9805b),-5.4+i*1.2,2.55,-8.77)}
// Soft-looking pet toys near the balcony.
// Interactive striped toy ball, separate from decorative toys.
const toyBall=new THREE.Group();scene.add(toyBall);
const toySkin=mat(0xe38b53,.65),toyStripe=mat(0x4e91a3,.62);
const toyCore=ball(.32,toySkin,0,0,0,toyBall);
for(let i=0;i<3;i++){const ring=mesh(new THREE.TorusGeometry(.323,.023,7,32),toyStripe,0,0,0,toyBall);ring.rotation.set(i*.83,i*.56,i*.74)}
const toyHome=new THREE.Vector2(2.2,-4.6),toyVelocity=new THREE.Vector2();
toyBall.position.set(toyHome.x,.34,toyHome.y);
ball(.16,mat(0x587b8a),1.9,.16,-5.6);
// Extra greenery, with low-poly leaf clusters.
cyl(.25,.52,pot,4.85,.26,-7.2);
for(let i=0;i<9;i++){const a=i*2.399;ball(.22,i%2?leaf:leafLight,4.85+Math.cos(a)*.30,.85+(i%3)*.16,-7.2+Math.sin(a)*.30)}
// Warm lamp light and a subtle daylight fill.
const lampGlow=new THREE.PointLight(0xffad59,1.05,7,2);lampGlow.position.set(-5.8,2.35,-6.3);scene.add(lampGlow);
const windowFill=new THREE.DirectionalLight(0xffd09b,.28);windowFill.position.set(0,4,-9);scene.add(windowFill);
