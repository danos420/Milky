// (street, vet and pizza/salon side actions are Milky's open-world fun; they're wrapped at the end of 59)
const _ctxSide0=CTX_HOOKS.act.length;
// ===== The street: out the front door. Sidewalks, a road with polite cars, shops, funny neighbours and animals =====
const STREET={x0:6.6,x1:19.4,z0:-8.6,z1:44},KIOSK={x0:20.2,x1:31.4,z0:.2,z1:9.8};
AREAS.push(STREET,KIOSK);
DOORS.push({ax:true,x0:5.7,x1:7.4,z0:5.1,z1:7.3},{ax:true,x0:18.5,x1:21.1,z0:4.0,z1:6.2});
const asph=mat(0x4a4b50,.95),walk=mat(0xbdb6aa,.9),curb=mat(0x8f8a82),stripe=decal(mat(0xf2efe6));
// ground: near sidewalk, road, far sidewalk
box(3,.12,52.6,walk,8.1,-.04,17.7);box(6.8,.1,52.6,asph,13,-.05,17.7);box(3,.12,52.6,walk,17.9,-.04,17.7);
for(const x of [9.6,16.4])box(.12,.14,52.6,curb,x,.02,17.7);
for(let z=-7;z<44;z+=3){const s=box(.14,.02,1.4,stripe,13,.012,z);s.castShadow=false}
{const g=new THREE.Group();scene.add(g);for(let i=0;i<6;i++){const s=box(6.6,.02,.42,stripe,13,.015,9.6+i*.75,g);s.castShadow=false}}
// the house front (with the door frame) and neighbours' buildings on the west side
box(.25,.12,2.4,mat(0x6b4a32),6.55,.06,6.2);box(.12,3.1,.15,darkWood,6.62,1.55,5.05);box(.12,3.1,.15,darkWood,6.62,1.55,7.35);box(.12,.15,2.45,darkWood,6.62,3.1,6.2);
box(.6,.25,1.2,mat(0x9c4a3a,.9),7.0,.05,6.2); // doormat
{const cv=document.createElement('canvas');cv.width=256;cv.height=96;const g=cv.getContext('2d');g.fillStyle='#e8dcc6';g.fillRect(0,0,256,96);g.fillStyle='#4a3420';g.font='bold 44px system-ui,Arial';g.textAlign='center';g.textBaseline='middle';g.direction='rtl';g.fillText('🐾 מילקי',128,50);
 const hold=new THREE.Group();scene.add(hold);const p=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.42),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),toneMapped:false}));p.position.set(6.66,2.3,4.4);p.rotation.y=Math.PI/2;hold.add(p)}
const bldA=mat(0xe2d3bb),bldB=mat(0xd6c2a6),bldC=mat(0xc9b79c),winM=mat(0x7fa6b8,.3),awn=[mat(0xc0392b),mat(0x2f8f5a),mat(0xe67e22),mat(0x3a7bd5)];
box(4,9,28,bldA,4.4,4.5,30); // neighbours block, west side
for(let z=18;z<44;z+=3.2)for(const y of [2,4.8,7.4]){box(.06,1.2,1.4,winM,6.42,y,z)}
// parrot balcony
box(1.2,.12,2.4,mat(0xcfc6b5),7.0,3.0,26);for(let i=0;i<7;i++)box(.04,.8,.04,metal,7.55,3.45,24.9+i*.36);box(.04,.04,2.4,metal,7.55,3.85,26);
// guard dog yard: fence on the west sidewalk edge

// far side shops
const SHOPS=[{name:'🛒 מכולת',z0:0,z1:10,c:bldB,a:awn[0],open:true},{name:'🩺 וטרינר',z0:10.4,z1:20,c:bldA,a:awn[3],open:true},{name:'🍕 פיצה פלאפל',z0:20.4,z1:30,c:bldC,a:awn[2],open:true},{name:'✂️ מספרה לכלבים',z0:30.4,z1:40,c:bldB,a:awn[1],open:true}];
function shopSign(text,z,soon){const cv=document.createElement('canvas');cv.width=512;cv.height=112;const g=cv.getContext('2d');g.fillStyle=soon?'#5b5246':'#2b2420';g.fillRect(0,0,512,112);g.fillStyle='#fff3d6';g.font='bold 54px system-ui,Arial';g.textAlign='center';g.textBaseline='middle';g.direction='rtl';g.fillText(text,256,56);
 const hold=new THREE.Group();scene.add(hold);const p=new THREE.Mesh(new THREE.PlaneGeometry(3.4,.75),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),toneMapped:false}));p.position.set(19.82,2.85,z+3);p.rotation.y=-Math.PI/2;hold.add(p)}
for(const s of SHOPS){const zc=(s.z0+s.z1)/2,len=s.z1-s.z0;
 if(!s.open){box(8,6,len,s.c,23.6,3,zc);box(.1,2.4,1.5,mat(0x5b4636),19.58,1.2,zc);box(.08,1.3,2.2,winM,19.58,1.6,zc-2.6);box(.08,1.3,2.2,winM,19.58,1.6,zc+2.6);
  const so=document.createElement('canvas');so.width=256;so.height=96;const g=so.getContext('2d');g.fillStyle='#f2c14e';g.fillRect(0,0,256,96);g.fillStyle='#2b1f12';g.font='bold 40px system-ui';g.textAlign='center';g.textBaseline='middle';g.direction='rtl';g.fillText('נפתח בקרוב!',128,50);
  const hold=new THREE.Group();scene.add(hold);const p=new THREE.Mesh(new THREE.PlaneGeometry(1.3,.5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(so),toneMapped:false}));p.position.set(19.5,1.4,zc);p.rotation.y=-Math.PI/2;hold.add(p)}
 const a=box(1.3,.12,len-.6,s.a,19.0,2.45,zc);a.rotation.z=-.25;shopSign(s.name,zc,!s.open)}
// kiosk building (enterable): walls with a door gap, flat roof hidden so the camera can look in
// One shell for all four shops: deep rooms, low walls (3.2m) so the camera can look in from above. No overlapping walls.
const SHOP_WALL=3.2,SHOP_BACK=31.6,SHOP_DOORS=[[4.0,6.2],[11.6,13.8],[21.6,23.8],[31.6,33.8]],SHOP_WALLM=[bldB,mat(0xe8f1ef),mat(0xf3e2c4),mat(0xfbe3ef)],SHOP_FLOORM=[mat(0xd9cfbd),mat(0xcfe3df),mat(0xc9a27a),mat(0xe9eef2)];
for(let k=0;k<4;k++){const z0=k*10,z1=z0+10,[d0,d1]=SHOP_DOORS[k],W=SHOP_WALLM[k],H=SHOP_WALL;
 box(.2,H,d0-z0,W,19.95,H/2,(z0+d0)/2);box(.2,H,z1-d1,W,19.95,H/2,(d1+z1)/2);box(.2,H-2.6,d1-d0,W,19.95,2.6+(H-2.6)/2,(d0+d1)/2);
 box(.08,1.4,2.2,winM,19.86,1.7,(d1+z1)/2);box(SHOP_BACK-20,.05,9.8,SHOP_FLOORM[k],(20+SHOP_BACK)/2,.02,z0+5);
 box(.06,2.6,.12,mat(0x5b4636),19.85,1.3,d0);box(.06,2.6,.12,mat(0x5b4636),19.85,1.3,d1)}
for(let k=0;k<=4;k++)box(SHOP_BACK-19.85,SHOP_WALL,.2,SHOP_WALLM[Math.min(k,3)],(19.85+SHOP_BACK)/2,SHOP_WALL/2,k*10);
box(.2,SHOP_WALL,40.2,bldB,SHOP_BACK,SHOP_WALL/2,20);
// street furniture: trees, lamps, benches, bins, bus stop, mailbox, end barriers
for(const z of [-4,8,22,36]){cyl(.2,2.4,mat(0x6b4a32),8.0,1.2,z);for(let i=0;i<4;i++){const a=i*1.6;ball(.85,mat(i%2?0x4f7f45:0x5f9150),8.0+Math.cos(a)*.5,2.9+(i%2)*.3,z+Math.sin(a)*.5)}}
for(const z of [0,14,28,42]){cyl(.06,4,metal,9.3,2,z);box(.6,.1,.25,metal,9.05,4,z);const l=ball(.14,new THREE.MeshBasicMaterial({color:0xfff1c4}),8.8,3.92,z)}
const BENCH={x:7.4,z:22.5};{const b=new THREE.Group();b.position.set(BENCH.x,0,BENCH.z);b.rotation.y=Math.PI/2;scene.add(b);box(2,.08,.5,mat(0x9c6b3e),0,.48,0,b);box(2,.45,.08,mat(0x9c6b3e),0,.8,-.24,b);for(const s of [-.85,.85])box(.08,.48,.45,metal,s,.24,0,b)}
obstacles.push({name:'ספסל רחוב',x:BENCH.x,z:BENCH.z,w:.5,d:2,top:.5});
const BINS=[{x:18.7,z:9.2},{x:18.7,z:10.1}];for(const b of BINS){cyl(.32,.9,mat(0x2f6e4a),b.x,.45,b.z);cyl(.34,.06,mat(0x24573a),b.x,.92,b.z);obstacles.push({name:'פח רחוב',x:b.x,z:b.z,w:.6,d:.6,top:.95})}
{box(.1,2.4,3,mat(0x7fa6b8,.2),18.9,1.2,16);box(.1,2.6,.1,metal,18.9,1.3,14.5);box(.1,2.6,.1,metal,18.9,1.3,17.5);box(.8,.1,3.1,mat(0x2f6e4a),18.6,2.5,16);box(.4,.08,2.4,mat(0x9c6b3e),18.6,.5,16)}
box(.4,1,.35,mat(0xc0392b),9.1,.5,-6);
for(const z of [STREET.z0-.3]){ // the south end opens into the neighbourhood (see 69-town)
for(let x=7;x<19.5;x+=1.6){box(1.3,.9,.15,mat(0xe74c3c),x,.6,z);box(1.3,.18,.16,mat(0xffffff),x,.75,z)}box(13,6,.3,bldC,13,3,z+(z>0?1.2:-1.2))}
// ---------- cars: drive slowly, stop for Milky, honk ----------
const CAR_COLORS=[0xe74c3c,0x3a7bd5,0xf2c14e,0x7fb069];
function makeCar(c){const g=new THREE.Group();scene.add(g);const b=mat(c,.4);box(1.7,.6,3.6,b,0,.55,0,g);box(1.5,.55,1.9,b,0,1.1,-.2,g);box(1.52,.45,.05,winM,0,1.12,.76,g);box(1.52,.4,.05,winM,0,1.12,-1.16,g);
 for(const [x,z] of [[-.85,1.1],[.85,1.1],[-.85,-1.1],[.85,-1.1]]){const w=cyl(.32,.25,mat(0x1d1d1f,.6),x,.32,z,g);w.rotation.z=Math.PI/2}
 for(const x of [-.55,.55]){ball(.1,new THREE.MeshBasicMaterial({color:0xfff6d0}),x,.6,1.81,g);ball(.08,new THREE.MeshBasicMaterial({color:0xd63a2f}),x,.6,-1.81,g)}return g}
const CARS=[0,1,2,3].map(i=>({g:makeCar(CAR_COLORS[i]),lane:i%2,z:-6+i*13,sp:4.2+i*.4,cur:0,honk:0}));
function updateCars(dt){
 const CZ1=window.TOWN_READY?116:STREET.z1;
 for(const c of CARS){const dir=c.lane?1:-1,x=c.lane?11.4:14.6;
  const ahead=dir*(pos.z-c.z),blocked=Math.abs(pos.x-x)<1.7&&ahead>0&&ahead<4.8||CARS.some(o=>o!==c&&o.lane===c.lane&&dir*(o.z-c.z)>0&&dir*(o.z-c.z)<4.8);
  c.cur+=((blocked?0:c.sp)-c.cur)*Math.min(1,dt*(blocked?5:1.5));c.z+=dir*c.cur*dt;
  if(c.z>CZ1+2)c.z=STREET.z0-2;if(c.z<STREET.z0-2)c.z=CZ1+2;
  c.g.position.set(x,0,c.z);c.g.rotation.y=c.lane?0:Math.PI;c.g.visible=c.z>STREET.z0-1.5&&c.z<CZ1+1.5;
  c.honk=Math.max(0,c.honk-dt);if(blocked&&ahead<4.8&&Math.abs(pos.x-x)<1.7&&c.honk===0&&c.g.visible){c.honk=4;thought(milkyB,'🚗',1,true);if(window.JUICE_READY)pow('טוטטט!',x,2,c.z+dir*1.5);addActivity('🚗 טוטטט! המכונית עצרה בשביל מילקי');if(!challengesDone.has('stopCar'))completeChallenge('stopCar')}
 }
 // pressing on Milky if he stands right inside a car
 for(const c of CARS){const x=c.lane?11.4:14.6;if(Math.abs(pos.x-x)<1.25&&Math.abs(pos.z-c.z)<2.2&&jumpY<1.2){pos.x+=pos.x<x?-.05:.05}}
}
// ---------- characters ----------
const JOGGER=makePerson({skin:0xc68a62,shirt:0x39e05a,shorts:0x222222,bareArms:true,shoes:0xff5a3c,hair:h=>{cyl(.35,.08,mat(0xff5a3c),0,.12,0,h)}});
const COURIER=makePerson({skin:0xb87a55,shirt:0x2b7fd4,pants:0x2a2a2e,hair:h=>{const c=ball(.36,mat(0xf2c14e),0,.12,0,h);c.scale.set(1,.7,1);box(.5,.06,.25,mat(0xf2c14e),0,.02,.3,h)}});
const OLDMAN=makePerson({skin:0xd2a07c,shirt:0x8a7a5a,pants:0x5a5046,belly:true,hair:h=>{const c=box(.7,.1,.7,mat(0x3d3428),0,.24,0,h);box(.4,.12,.4,mat(0x3d3428),0,.3,0,h);ball(.12,mat(0xeeeeee),0,-.2,.28,h).scale.set(1.6,.6,.6)}});
const MOM=makePerson({skin:0xe2b48c,shirt:0xb5838d,dress:0xb5838d,pants:0xe2b48c,shoes:0xffffff,hair:h=>{const d=ball(.34,mat(0x7a4a2a),0,.12,-.05,h);d.scale.set(1,.8,1);ball(.16,mat(0x7a4a2a),0,.25,-.3,h)}});
const KIOSKMAN=makePerson({skin:0xc99067,shirt:0xffffff,pants:0x3a3a3a,belly:true,apron:0x2f6e4a,hair:h=>{const b=ball(.3,mat(0x2a2420),0,-.14,.06,h);b.scale.set(1.05,.5,.95);box(.32,.06,.05,mat(0x2a2420),0,-.08,.335,h)}});
const stroller=new THREE.Group();scene.add(stroller);{box(.6,.45,.9,mat(0x3a7bd5,.6),0,.75,0,stroller);const hood=ball(.45,mat(0x2c5d9e,.6),0,.95,-.3,stroller);hood.scale.set(.7,.6,.5);for(const [x,z] of [[-.28,.35],[.28,.35],[-.28,-.35],[.28,-.35]]){const w=cyl(.14,.06,mat(0x1d1d1f),x,.14,z,stroller);w.rotation.z=Math.PI/2}
 const pup=ball(.16,mat(0xf7f4ee),0,1.05,.2,stroller);for(const s of [-1,1])ball(.07,mat(0xe0d6c8),s*.12,1.12,.2,stroller);ball(.03,mat(0x1c1a1a),0,1.04,.36,stroller)}
const PEOPLE=[
 {P:JOGGER,b:null,kind:'jog',x:17.9,z:0,dir:1,sp:3.6,lines:['עוד קילומטר! אתה איתי?','קדימה מילקי! קצב!','אין כאבים, יש רק... אחח','הכלב הזה רץ יותר ממני']},
 {P:COURIER,b:null,kind:'scoot',x:10.2,z:20,dir:-1,sp:7.5,lines:['זוז זוז זוז!','משלוח! משלוח!','יש לי 40 משלוחים, אין לי זמן לכלבים!']},
 {P:OLDMAN,b:null,kind:'bench',x:BENCH.x+.1,z:BENCH.z,lines:['בזמני הכלבים היו מנומסים','היונים האלה הן המשפחה שלי','אתה רוצה גרעינים? לא? טוב.','פעם הכל היה זול יותר']},
 {P:MOM,b:null,kind:'stroll',x:8.6,z:30,dir:-1,sp:1.1,lines:['שששש... התינוק ישן','זה לא תינוק, זה פיצי! הכלב שלי','פיצי לא אוהב כלבים גדולים']},
 {P:KIOSKMAN,b:null,kind:'kiosk',x:25.8,z:5,lines:['רק להסתכל! לא לגעת!','מה תיקח? במבה? ביסלי?','כלבים לא מקבלים הקפה!','עוד פעם אתה?!']}];
PEOPLE.forEach(p=>{p.b=makeBubble(p.P.g,3.05);p.P.g.position.set(p.x,0,p.z);p.talk=2+Math.random()*4;p.hit=0});
const scooter=new THREE.Group();COURIER.g.add(scooter);box(.25,.06,1.1,mat(0x333333),0,.12,0,scooter);cyl(.03,1.1,mat(0x777777),0,.7,.48,scooter);box(.5,.04,.04,mat(0x777777),0,1.25,.48,scooter);for(const z of [-.45,.45]){const w=cyl(.1,.06,mat(0x111111),0,.1,z,scooter);w.rotation.z=Math.PI/2}
// ---------- animals ----------
function makeStreetCat(c,stripe){const g=new THREE.Group();scene.add(g);const cf=mat(c),cd=mat(stripe);const b=ball(1,cf,0,.32,0,g);b.scale.set(.17,.16,.34);ball(.15,cf,0,.5,.3,g);
 for(const s of [-1,1]){mesh(new THREE.ConeGeometry(.06,.12,4),cf,s*.08,.66,.3,g);ball(.025,mat(0x9bd94a),s*.06,.53,.43,g)}for(let i=0;i<3;i++)box(.3,.02,.06,cd,0,.47,-.15+i*.12,g);
 for(const [x,z] of [[-.08,.2],[.08,.2],[-.08,-.2],[.08,-.2]])cyl(.035,.3,cf,x,.15,z,g);const tl=cyl(.035,.45,cf,0,.55,-.42,g);tl.rotation.x=-.5;return g}
const SCATS=[{g:makeStreetCat(0x555555,0x333333),home:[BINS[0].x,.95,BINS[0].z]},{g:makeStreetCat(0xf5f0e6,0xd9a35f),home:[BINS[1].x,.95,BINS[1].z]},{g:makeStreetCat(0x2b2622,0x111111),home:[9.1,1.0,-6]}];
SCATS.forEach(c=>{c.g.position.set(...c.home);c.flee=0;c.b=makeBubble(c.g,.95);c.g.rotation.y=-Math.PI/2});
function makePigeon(){const g=new THREE.Group();scene.add(g);const gr=mat(0x8a8f9a,.8);const b=ball(.12,gr,0,.14,0,g);b.scale.set(.8,.8,1.2);ball(.07,mat(0x6b7280),0,.24,.12,g);box(.03,.02,.06,mat(0xe0a050),0,.23,.2,g);
 const wings=[];for(const s of [-1,1]){const w=new THREE.Group();w.position.set(s*.08,.17,0);g.add(w);const m=box(.18,.02,.14,mat(0x777d88),s*.09,0,0,w);wings.push(w)}return {g,wings}}
const PIGEONS=[];for(let i=0;i<9;i++){const p=makePigeon();const a=i/9*Math.PI*2,r=.8+Math.random()*1.2;p.home=new THREE.Vector3(BENCH.x+1.6+Math.cos(a)*r*.6,0,BENCH.z+Math.sin(a)*r);p.g.position.copy(p.home);p.g.rotation.y=Math.random()*6;p.fly=0;p.v=new THREE.Vector3();p.peck=Math.random()*3;PIGEONS.push(p)}
// parrot on the balcony
const parrot=new THREE.Group();parrot.position.set(7.5,3.9,26);scene.add(parrot);
{const g1=mat(0x2fb34a,.6);const b=ball(.17,g1,0,.22,0,parrot);b.scale.set(.85,1.2,.9);ball(.12,mat(0x3fcf5a,.6),0,.48,.03,parrot);box(.05,.07,.08,mat(0xf2c14e),0,.45,.15,parrot);
 for(const s of [-1,1])ball(.025,mat(0x111111),s*.06,.52,.1,parrot);const t=box(.08,.3,.04,mat(0xd63a2f),0,.0,-.14,parrot);t.rotation.x=.4;ball(.06,mat(0xd63a2f),0,.6,-.02,parrot)}
parrot.rotation.y=Math.PI/2;const parrotB=makeBubble(parrot,.85);
const PARROT_LINES=['מילקיייי! לא!!','קנית במבה? קנית במבה?','אפצ\'יייי!','שבת שלום! איפה האוכל?','יפ! יפ! יפ!','מי הכלב הכי טוב? מי?','הכפכף! הכפכף!','רק להסתכל! לא לגעת!'];
// guard dog behind the fence (west side yard between buildings)
const GUARD=makeDog({name:'בולדוזר',color:0x2b2018,color2:0x9c6b3e,size:1.25,speed:2,x:23,z:42});GUARD.g.rotation.y=-Math.PI/2;
box(6,.08,3.8,mat(0x6f8f4a),23,.01,42.2);box(.2,1.8,3.8,bldC,26.1,.9,42.2); // guard yard
for(let z=40.5;z<=44;z+=.35)box(.05,1.6,.05,metal,19.75,.8,z);box(.06,.06,3.6,metal,19.75,1.55,42.25);box(.06,.06,3.6,metal,19.75,.4,42.25);
const street={guardFriend:false,guardBark:0,parrotHeard:new Set(),parrotT:0,bamba:{state:'shelf',t:0},chaseT:0,catHiss:new Set(),pigeonsScared:false};
// ---------- the kiosk inside ----------
box(.8,1.05,3.2,mat(0x8b5a3a),25.4,.52,5);box(.9,.06,3.3,mat(0xe9e4da),25.4,1.06,5); // counter
for(const z of [1.6,8.4])for(const y of [.5,1.1,1.7]){box(3.6,.06,.5,mat(0x9c6b3e),23.6,y,z)}
for(let i=0;i<10;i++){const z=i<5?1.6:8.4,x=22+((i%5)*.7);box(.35,.4,.2,mat([0xf2c14e,0xe74c3c,0x3a7bd5,0x7fb069,0xe98ab0][i%5],.7),x,(i%2?1.35:.75),z)}
const FREEZER={x:22.2,z:8.3}; // by the wall, not in the doorwaybox(1.4,.9,.9,mat(0xf3f3f3,.4),FREEZER.x,.45,FREEZER.z);box(1.3,.04,.8,mat(0x9fd3ef,.2),FREEZER.x,.92,FREEZER.z);obstacles.push({name:'מקפיא',x:FREEZER.x,z:FREEZER.z,w:1.4,d:.9,top:.95},{name:'דלפק',x:25.4,z:5,w:.8,d:3.2,top:1.06});
for(let i=0;i<6;i++){const c=cyl(.06,.18,mat([0xffffff,0xf2c14e,0xe98ab0][i%3]),FREEZER.x-.45+i*.18,.98,FREEZER.z,scene)}
// the Bamba bag you can steal (a real grabbable body)
const bambaG=new THREE.Group();scene.add(bambaG);{box(.3,.4,.12,mat(0xf2c14e,.6),0,.2,0,bambaG);box(.2,.12,.125,mat(0xe74c3c,.6),0,.25,.001,bambaG)}
const BAMBA_HOME=new THREE.Vector3(23.2,0,2.4);bambaG.position.copy(BAMBA_HOME);
const bambaRec={vx:0,vz:0,kind:'bamba',home:BAMBA_HOME.clone(),g:bambaG};
addBody(bambaG,.18,()=>[bambaRec.vx,bambaRec.vz],(x,z)=>{bambaRec.vx=x;bambaRec.vz=z});Object.assign(bodies[bodies.length-1],{rec:bambaRec,kind:'bamba'});
KIND_ICON.bamba='🥜';KIND_NAME.bamba='במבה';
// ---------- street challenges ----------
for(const c of [['stopCar','🚗 לעצור מכונית ברחוב'],['pigeons','🕊️ להבריח את היונים'],['streetCat','🐈 להרגיז 3 חתולי רחוב'],['parrot','🦜 לשמוע את התוכי מחקה 3 משפטים'],['guardFriend','🐕 להתיידד עם בולדוזר (שב ליד הגדר)'],['bamba','🥜 לגנוב במבה מהמכולת ולברוח'],['iceCream','🍦 לאכול גלידה מהמקפיא'],['jogger','🏃 לרוץ ליד הרץ עד שהוא מתעייף']])challengeDefs.push(c);
for(const id of save.challenges)if(challengeDefs.some(c=>c[0]===id))challengesDone.add(id);renderChallenges();
// ---------- update ----------
function inStreetZone(){return pos.x>6.6}
function updateStreet(dt){
 const t=performance.now()/1000,near=pos.x>5.5||pos.z>14;
 updateCars(dt);
 // people
 for(const p of PEOPLE){const P=p.P,o=P.g.position;let step=0;
  if(p.kind==='jog'||p.kind==='stroll'||p.kind==='scoot'){const z1=p.kind==='scoot'?42:40,z0=-6;let sp=p.sp;
   if(p.kind==='scoot'&&Math.abs(pos.x-o.x)<1&&p.dir*(pos.z-o.z)>0&&p.dir*(pos.z-o.z)<2.5){sp=1;if(p.hit<=0){p.hit=3;sayText(p.b,pick(npcLine(p.kind,p.lines)),1.6,'say',true);thought(milkyB,'😱',1,true)}}
   o.z+=p.dir*sp*dt;step=sp*dt;if(o.z>z1){p.dir=-1}if(o.z<z0){p.dir=1}P.g.rotation.y=p.dir>0?0:Math.PI;
   if(p.kind==='jog'){const dm=Math.hypot(pos.x-o.x,pos.z-o.z);if(dm<2.2&&lastDogSpeed>4){p.run=(p.run||0)+dt;if(p.run>6&&!challengesDone.has('jogger')){completeChallenge('jogger');sayText(p.b,'אוקיי... אתה ניצחת... אני... צריך... מים',2.4,'say',true);addScore(300,'הרץ נשבר')}}else p.run=Math.max(0,(p.run||0)-dt*.5)}
   if(p.kind==='stroll'){stroller.position.set(o.x,0,o.z+p.dir*.9);stroller.rotation.y=P.g.rotation.y}}
  if(p.kind==='kiosk'){const tx=street.bamba.state==='chase'?pos.x:25.9,tz=street.bamba.state==='chase'?pos.z:5;const dx=tx-o.x,dz=tz-o.z,d=Math.hypot(dx,dz);
   if(d>.6){const sp=street.bamba.state==='chase'?3.2:1.6;const s=Math.min(d,sp*dt);const nx=o.x+dx/d*s,nz=o.z+dz/d*s;if(walkable(nx,nz,.35)&&!(nx<26.1&&nx>24.9&&Math.abs(nz-5)<1.7&&street.bamba.state!=='chase')){o.x=nx;o.z=nz;step=s}else if(walkable(nx,nz,.35)){o.x=nx;o.z=nz;step=s}P.g.rotation.y=Math.atan2(dx,dz)}else P.g.rotation.y=-Math.PI/2}
  animatePerson(P,step,dt,{run:p.kind==='jog'||(p.kind==='kiosk'&&street.bamba.state==='chase'),arm:i=>p.kind==='scoot'?-1.3:p.kind==='stroll'?-1.0:p.kind==='bench'?-.3:0});
  if(p.kind==='bench'){P.legs.forEach(l=>l.rotation.x=-1.45);P.g.position.y=-.42;P.g.rotation.y=Math.PI/2}
  updateFace(P.face,p.kind==='kiosk'?(street.bamba.state==='chase'?'shout':'angry'):p.kind==='jog'?'focus':p.kind==='bench'?'smile':'neutral',dt);
  p.hit=Math.max(0,p.hit-dt);p.talk-=dt;const dm=Math.hypot(pos.x-o.x,pos.z-o.z);if(p.talk<=0&&dm<7&&near){p.talk=5+Math.random()*5;sayText(p.b,pick(npcLine(p.kind,p.lines)),2.2,'say')}
 }
 // street cats: hiss and jump away when Milky gets close
 for(const c of SCATS){const g=c.g,h=c.home,dm=Math.hypot(pos.x-h[0],pos.z-h[2]);
  if(c.flee>0){c.flee-=dt;g.position.y=Math.min(3.2,g.position.y+dt*6);g.position.x+=dt*1.5;if(c.flee<=0){g.position.set(...h)}}
  else if(dm<1.6&&window.PARP){g.rotation.y+=dt*2;g.position.y=h[1]+Math.abs(Math.sin(performance.now()/160))*.12;if(Math.random()<dt*.4)sayText(c.b,pick(['ששש!!! ציפור!!! 😾','רד לפה אם אתה גבר!','מיאו!!!']),1.4,'say',true)}
  else if(dm<1.6){c.flee=6;sayText(c.b,pick(['ששששש!!! 😾','מיאאאו!! לך מפה!','חחחח... ששש!']),1.6,'say',true);if(window.JUICE_READY)pow('ששש!',h[0],h[1]+.8,h[2]);if(!street.catHiss.has(c)){street.catHiss.add(c);addActivity('🐈 חתול רחוב '+street.catHiss.size+'/3');if(street.catHiss.size>=3)completeChallenge('streetCat')}}
  else{g.rotation.y+=Math.atan2(Math.sin(Math.atan2(pos.x-g.position.x,pos.z-g.position.z)-g.rotation.y),Math.cos(Math.atan2(pos.x-g.position.x,pos.z-g.position.z)-g.rotation.y))*Math.min(1,dt*2)}}
 // pigeons: peck, then explode into the air when Milky runs at them
 for(const p of PIGEONS){const g=p.g,dm=Math.hypot(pos.x-g.position.x,pos.z-g.position.z);
  if(p.fly>0){p.fly-=dt;p.v.y-=dt*(p.fly>2?-.5:4);g.position.addScaledVector(p.v,dt);p.wings.forEach((w,i)=>w.rotation.z=(i?-1:1)*Math.sin(t*30)*.9);
   if(p.fly<2.2){g.position.lerp(_gv.set(p.home.x,g.position.y,p.home.z),dt*1.2)}if(g.position.y<=0&&p.fly<1.5){g.position.y=0;p.fly=0}}
  else{p.peck-=dt;g.position.y=0;p.wings.forEach(w=>w.rotation.z=0);g.rotation.x=p.peck<.3&&p.peck>0?.5:0;if(p.peck<0)p.peck=1+Math.random()*3;
   if(dm<2.2&&lastDogSpeed>2){p.fly=4+Math.random();const a=Math.atan2(g.position.z-pos.z,g.position.x-pos.x);p.v.set(Math.cos(a)*3,4+Math.random()*2,Math.sin(a)*3);g.rotation.y=-a+Math.PI/2;
    if(!street.pigeonsScared){street.pigeonsScared=true;completeChallenge('pigeons');sayText(PEOPLE[2].b,'היונים שלי!! מה עשית?!',2.2,'say',true);addScore(250,'פרררר!');if(window.JUICE_READY)pow('פררררר!',g.position.x,1.5,g.position.z,true)}}}}
 // parrot repeats the family
 const dpar=Math.hypot(pos.x-parrot.position.x,pos.z-parrot.position.z);parrot.rotation.z=Math.sin(t*2)*.08;
 street.parrotT-=dt;if(dpar<5&&street.parrotT<=0){street.parrotT=3.2;const l=pick(PARROT_LINES);sayText(parrotB,l,2.4,'say',true);street.parrotHeard.add(l);if(street.parrotHeard.size>=3&&!challengesDone.has('parrot')){completeChallenge('parrot');milkyThought('🤨',1.6,true)}}
 // guard dog: barks behind the fence until Milky sits nicely
 {const g=GUARD,o=g.g.position,dm=Math.hypot(pos.x-o.x,pos.z-o.z);street.guardBark=Math.max(0,street.guardBark-dt);
  const tz=Math.max(40.7,Math.min(43.8,pos.z)),tx=20.5;const wantNear=dm<7;
  const dz=(wantNear?tz:42)-o.z,dx=(wantNear?tx:22.5)-o.x,dd=Math.hypot(dx,dz);let step=0;if(dd>.2){step=Math.min(dd,(street.guardFriend?1.6:2.6)*dt);o.x+=dx/dd*step;o.z+=dz/dd*step}
  g.walk+=step*10;g.legs.forEach((l,i)=>{l.rotation.x=step>.001?Math.sin(g.walk+(i===0||i===3?0:Math.PI))*.7:0});g.g.rotation.y=-Math.PI/2;g.tail.rotation.z=Math.sin(t*(street.guardFriend?16:3))*.6;
  if(!street.guardFriend&&dm<4&&street.guardBark===0){street.guardBark=1.4;sayText(g.b,pick(['וואף!! וואף!!','גררררר!!!','מי זה?! מי זה?!','לך מפה, ננס!']),1.2,'say',true);g.body.position.y=.15}
  else g.body.position.y*=.85;
  if(!street.guardFriend&&dm<3.4&&trainingTime>0&&activeCmd==='שב'){street.guardFriend=true;completeChallenge('guardFriend');sayText(g.b,'...אוקיי. אתה בסדר. רוצה לגרד לי מאחורי האוזן?',2.6,'say',true);thought(g.b,'❤️',2,true);addScore(300,'חבר חדש')}
  if(street.guardFriend&&dm<3&&Math.random()<dt*.3)thought(g.b,pick(['❤️','🦴','😊']),1.4)}
 // bamba heist
 const B=street.bamba,kman=KIOSKMAN.g.position;
 if(B.state==='shelf'&&grab&&grab.b.o===bambaG){B.state='grabbed';sayText(PEOPLE[4].b,'היי!!! זה לא בחינם!!',1.8,'say',true)}
 if(B.state==='grabbed'&&pos.x<19.8){B.state='chase';B.t=0;sayText(PEOPLE[4].b,'גנב!!! תחזיר את הבמבה!!!',2,'say',true);addActivity('🥜 המוכר רודף אחרי מילקי! ברח 8 שניות!')}
 if(B.state==='grabbed'&&!(grab&&grab.b.o===bambaG))B.state='shelf';
 if(B.state==='chase'){B.t+=dt;evtPill.hidden=false;const l='🥜 בורח מהמוכר '+Math.floor(B.t)+'/8';if(evtPill.textContent!==l)evtPill.textContent=l;
  if(Math.hypot(pos.x-kman.x,pos.z-kman.z)<1&&jumpY<.8){B.state='back';releaseGrab(false);bambaG.position.copy(BAMBA_HOME);sayText(PEOPLE[4].b,'תפסתי! ...טוב, קח אחת. על חשבון הבית. רק אל תחזור!',2.6,'say',true);evtPill.hidden=true;B.t=0}
  else if(B.t>=8){B.state='won';completeChallenge('bamba');addScore(500,'שוד הבמבה!');if(grab&&grab.b.o===bambaG)releaseGrab(false);bambaG.position.copy(BAMBA_HOME);sayText(milkyB,'🥜 קראנץ\' קראנץ\'',2,'say',true);sayText(PEOPLE[4].b,'אוף!!! כל יום אותו דבר!',2,'say',true);evtPill.hidden=true}}
 if(B.state==='back'||B.state==='won'){B.t+=dt;if(B.t>4){B.state='shelf';B.t=0}}
 bambaG.position.x+=bambaRec.vx*dt;bambaG.position.z+=bambaRec.vz*dt;bambaRec.vx*=Math.exp(-3*dt);bambaRec.vz*=Math.exp(-3*dt);
}
function eatIceCream(){completeChallenge('iceCream');addScore(250,'גלידה!');sayText(milkyB,'🥶 בריין פריז!!!',2,'say',true);startDizzy(1);sayText(PEOPLE[4].b,'זה 8 שקל!!! מי משלם?!',2,'say',true);if(window.JUICE_READY)pow('ברררר!',pos.x,2,pos.z)}
CTX_HOOKS.act.push(()=>Math.hypot(pos.x-FREEZER.x,pos.z-FREEZER.z)<1.5&&jumpY<.5?{i:'🍦',l:'גלידה!',on:1,fn:eatIceCream}:null);
CTX_HOOKS.act.push(()=>{const k=KIOSKMAN.g.position;return pos.x>20&&Math.hypot(pos.x-k.x,pos.z-k.z)<2.2?{i:'🥺',l:'לבקש',on:1,fn:()=>{sayText(PEOPLE[4].b,pick(['לא!','אין הקפה לכלבים!','...טוב, חתיכה אחת','אתה חושב שאני בנק?']),2,'say',true);thought(milkyB,'🥺',1.2,true)}}:null});
window.STREET_READY=true;
