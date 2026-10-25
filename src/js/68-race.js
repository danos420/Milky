// ===== Barkdak Race: an open-world kart circuit far from the house. 4 drivers × 10 missions + free drive =====
var RACE_ON=false;
const RO=new THREE.Vector3(0,0,-330);                    // the race world sits far away (beyond fog and camera range of the house)
// ---------- the circuit ----------
const R_PTS=[[0,0],[38,-6],[66,6],[78,34],[62,60],[34,56],[16,76],[-18,84],[-50,68],[-60,38],[-44,16],[-34,-14],[-14,-22]];
const R_SC=1.5; // circuit scale
const R_CURVE=new THREE.CatmullRomCurve3(R_PTS.map(p=>new THREE.Vector3(RO.x+p[0]*R_SC,0,RO.z+p[1]*R_SC)),true,'centripetal');
const RN=720,RW=11;                                       // samples, road width
const R_P=[],R_T=[],R_N=[],R_S=[];let R_LEN=0;
for(let i=0;i<RN;i++){const p=R_CURVE.getPointAt(i/RN),t=R_CURVE.getTangentAt(i/RN);R_P.push(p);R_T.push(t);R_N.push(new THREE.Vector3(t.z,0,-t.x))}
for(let i=0;i<RN;i++){R_S.push(R_LEN);R_LEN+=R_P[i].distanceTo(R_P[(i+1)%RN])}
const rIdx=i=>((i%RN)+RN)%RN;
function rNearest(x,z,hint){let best=hint|0,bd=1e9;const scan=hint==null?RN:40;
 for(let k=-scan;k<=scan;k++){const i=hint==null?rIdx(k+RN/2):rIdx(hint+k);const p=R_P[i],d=(p.x-x)**2+(p.z-z)**2;if(d<bd){bd=d;best=i}}return best}
function rLat(i,x,z){const p=R_P[i],n=R_N[i];return (x-p.x)*n.x+(z-p.z)*n.z}
function rAt(u,lat){const L=((u%R_LEN)+R_LEN)%R_LEN;let i=Math.floor(L/R_LEN*RN);while(i>0&&R_S[i]>L)i--;while(i<RN-1&&R_S[i+1]<=L)i++;
 const j=rIdx(i+1),seg=(j===0?R_LEN:R_S[j])-R_S[i],k=seg>0?(L-R_S[i])/seg:0;const p=R_P[i].clone().lerp(R_P[j],k);const n=R_N[i].clone().lerp(R_N[j],k).normalize();const t=R_T[i].clone().lerp(R_T[j],k).normalize();
 return {p:p.addScaledVector(n,lat||0),t,n,i}}
// ---------- the world: road ribbon, curbs, grass, scenery ----------
const RACE_G=new THREE.Group();scene.add(RACE_G);RACE_G.visible=false;
function ribbon(off0,off1,y,colorFn){const pos=[],col=[],idx=[];for(let i=0;i<=RN;i++){const p=R_P[i%RN],n=R_N[i%RN];
  for(const o of [off0,off1]){pos.push(p.x+n.x*o,y,p.z+n.z*o);const c=colorFn(i);col.push(c.r,c.g,c.b)}
  if(i<RN){const a=i*2;idx.push(a,a+2,a+1,a+1,a+2,a+3)}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
 // Lambert keeps vertex colours on every quality tier; KEEP stops the load-time merge from dropping them
 const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true}));m.receiveShadow=true;m.castShadow=false;KEEP.add(m);RACE_G.add(m);return m}
{const asphalt=new THREE.Color(0x3f4045),a2=new THREE.Color(0x45464b),red=new THREE.Color(0xd8432f),white=new THREE.Color(0xf2efe6),line=new THREE.Color(0xf2e6b0);
 ribbon(-RW/2,RW/2,.02,i=>i%2?asphalt:a2);
 ribbon(-RW/2-1.1,-RW/2,.035,i=>(i>>1)%2?red:white);ribbon(RW/2,RW/2+1.1,.035,i=>(i>>1)%2?red:white);
 ribbon(-.15,.15,.03,i=>(i>>2)%2?line:asphalt);
 const grass=new THREE.Mesh(new THREE.PlaneGeometry(640,640),new THREE.MeshStandardMaterial({color:0x6a9a45,roughness:1}));grass.rotation.x=-Math.PI/2;grass.position.set(RO.x+15,0,RO.z+45);grass.receiveShadow=true;RACE_G.add(grass);
 // start / finish: checkered strip and a big arch
 const cv=document.createElement('canvas');cv.width=64;cv.height=16;const g=cv.getContext('2d');for(let x=0;x<16;x++)for(let y=0;y<4;y++){g.fillStyle=(x+y)%2?'#111':'#fff';g.fillRect(x*4,y*4,4,4)}
 const tex=new THREE.CanvasTexture(cv);tex.magFilter=THREE.NearestFilter;const st=new THREE.Mesh(new THREE.PlaneGeometry(RW+2,1.6),new THREE.MeshBasicMaterial({map:tex}));KEEP.add(st);
 const p0=R_P[0],t0=R_T[0];st.position.set(p0.x,.05,p0.z);st.rotation.x=-Math.PI/2;st.rotation.z=Math.atan2(t0.x,t0.z);RACE_G.add(st);
 const arch=new THREE.Group();arch.position.copy(p0);arch.rotation.y=Math.atan2(t0.x,t0.z);RACE_G.add(arch);const am=mat(0xd8432f,.6);
 for(const s of [-1,1])box(.6,6,.6,am,s*(RW/2+1.6),3,0,arch);box(RW+4.2,1.2,.7,mat(0xf2c14e,.5),0,6.2,0,arch);
 {const c2=document.createElement('canvas');c2.width=512;c2.height=96;const q=c2.getContext('2d');q.fillStyle='#2b2420';q.fillRect(0,0,512,96);q.fillStyle='#ffd166';q.font='bold 60px system-ui,Arial';q.textAlign='center';q.textBaseline='middle';q.direction='rtl';q.fillText('🏁 מירוץ ברדק',256,52);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(RW+3,1.05),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c2),side:THREE.DoubleSide}));sign.position.set(0,6.2,.37);arch.add(sign);const s2=sign.clone();s2.position.z=-.37;s2.rotation.y=Math.PI;arch.add(s2)}
 // scenery: trees and little houses away from the road (instanced: cheap on phones)
 let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;const trees=[],houses=[];
 for(let n=0;n<1600&&(trees.length<180||houses.length<34);n++){const x=RO.x-130+rnd()*290,z=RO.z-80+rnd()*260;const i=rNearest(x,z);const d=Math.abs(rLat(i,x,z));if(d<RW/2+5)continue;
  if(houses.length<34&&d>14&&rnd()<.25)houses.push([x,z,rnd()]);else if(trees.length<180)trees.push([x,z,.8+rnd()*.7])}
 const trunk=new THREE.InstancedMesh(new THREE.CylinderGeometry(.18,.24,1.4,6),mat(0x8b5a3a),trees.length),crown=new THREE.InstancedMesh(new THREE.ConeGeometry(1.3,3,7),mat(0x4f8a4a,.9),trees.length);
 const M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(),P=new THREE.Vector3();
 trees.forEach(([x,z,s],i)=>{S.set(s,s,s);M.compose(P.set(x,.7*s,z),Q,S);trunk.setMatrixAt(i,M);M.compose(P.set(x,2.6*s,z),Q,S);crown.setMatrixAt(i,M)});
 const hb=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),mat(0xe2d3bb),houses.length),hr=new THREE.InstancedMesh(new THREE.ConeGeometry(.75,.6,4),mat(0xc0392b,.8),houses.length);
 houses.forEach(([x,z,r],i)=>{const w=4+r*3,h=3+r*2;Q.setFromAxisAngle(new THREE.Vector3(0,1,0),r*3);S.set(w,h,w*.8);M.compose(P.set(x,h/2,z),Q,S);hb.setMatrixAt(i,M);S.set(w*.95,w*.5,w*.95);Q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/4));M.compose(P.set(x,h+w*.15,z),Q,S);hr.setMatrixAt(i,M)});
 for(const m of [trunk,crown,hb,hr]){m.castShadow=false;m.receiveShadow=false;RACE_G.add(m)}
 // a grandstand by the start
 const gs=new THREE.Group();const pp=rAt(R_LEN-14,RW/2+7);gs.position.copy(pp.p);gs.rotation.y=Math.atan2(pp.t.x,pp.t.z)-Math.PI/2;RACE_G.add(gs);
 for(let r=0;r<4;r++)box(14,.5,1.2,mat(r%2?0x3a7bd5:0xf2c14e,.6),0,.4+r*.6,r*1.1,gs);
}
// ramps and boost pads (fixed on the circuit)
const R_RAMPS=[.31,.73].map(f=>Math.floor(f*RN)),R_PADS=[.12,.46,.6,.88].map(f=>Math.floor(f*RN));
for(const i of R_RAMPS){const p=R_P[i],t=R_T[i];const g=new THREE.Group();g.position.copy(p);g.rotation.y=Math.atan2(t.x,t.z);RACE_G.add(g);
 const w=new THREE.Mesh(new THREE.BoxGeometry(RW-1,.25,4.2),mat(0xf2c14e,.6));w.rotation.x=-.24;w.position.set(0,.55,0);g.add(w);
 for(let k=0;k<5;k++)box(.6,.27,.5,mat(0x2b2420),(k-2)*2,.62+.02,-1.2+k*0+.0,g).rotation.x=-.24}
const PAD_TEX=(()=>{const c=document.createElement('canvas');c.width=64;c.height=64;const q=c.getContext('2d');q.fillStyle='#ffb020';q.fillRect(0,0,64,64);q.fillStyle='#fff3c4';for(const y of [8,30]){q.beginPath();q.moveTo(32,y);q.lineTo(58,y+22);q.lineTo(46,y+22);q.lineTo(32,y+10);q.lineTo(18,y+22);q.lineTo(6,y+22);q.closePath();q.fill()}return new THREE.CanvasTexture(c)})();
for(const i of R_PADS){const p=R_P[i],t=R_T[i];const m=new THREE.Mesh(new THREE.PlaneGeometry(4,4),new THREE.MeshLambertMaterial({map:PAD_TEX,emissive:0xffffff,emissiveMap:PAD_TEX,emissiveIntensity:.5}));KEEP.add(m);m.position.set(p.x,.06,p.z);m.rotation.x=-Math.PI/2;m.rotation.z=Math.atan2(t.x,t.z)+Math.PI;RACE_G.add(m)}
// pickups: bones (coins), crates, air rings, seeds (pigeon special)
const R_COINS=[],R_CRATES=[],R_RINGS=[],R_SEEDS=[];
{const gold=mat(0xf2c14e,.35);for(let i=0;i<34;i++){const g=new THREE.Group();cyl(.09,.7,gold,0,0,0,g).rotation.z=Math.PI/2;for(const s of [-1,1])for(const t of [-1,1])ball(.13,gold,s*.38,t*.09,0,g);g.visible=false;RACE_G.add(g);R_COINS.push({g,on:false})}
 const wood=mat(0xb5803e,.8),wd=mat(0x7a5428,.8);for(let i=0;i<22;i++){const g=new THREE.Group();box(1.3,1.3,1.3,wood,0,.65,0,g);box(1.34,.16,1.34,wd,0,1.1,0,g);box(1.34,.16,1.34,wd,0,.2,0,g);g.visible=false;RACE_G.add(g);R_CRATES.push({g,on:false})}
 for(let i=0;i<12;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(2.2,.18,8,26),new THREE.MeshBasicMaterial({color:0xffd166}));m.visible=false;RACE_G.add(m);R_RINGS.push({g:m,on:false})}
 for(let i=0;i<6;i++){const g=new THREE.Group();for(let k=0;k<9;k++)ball(.08,mat(0xe0c070),(Math.random()-.5)*1.4,.06,(Math.random()-.5)*1.4,g);g.visible=false;RACE_G.add(g);R_SEEDS.push({g,on:false,t:0})}}
// ---------- karts and drivers ----------
function makeKart(color,driver){const g=new THREE.Group();RACE_G.add(g);const tilt=new THREE.Group();g.add(tilt);const body=mat(color,.45),dark=mat(0x22252b,.6);
 box(1.7,.42,2.9,body,0,.52,0,tilt);box(1.5,.3,.9,body,0,.82,1.05,tilt);box(1.8,.18,.5,dark,0,.45,1.55,tilt);box(1.9,.12,.4,body,0,1.15,-1.45,tilt);for(const s of [-1,1])box(.1,.45,.1,dark,s*.7,.92,-1.45,tilt);
 const seat=box(1.1,.5,.25,dark,0,.95,-.55,tilt);const wheels=[];for(const [x,z] of [[.95,1],[-.95,1],[.95,-1],[-.95,-1]]){const w=new THREE.Group();w.position.set(x,.42,z);tilt.add(w);const c=cyl(.42,.36,dark,0,0,0,w);c.rotation.z=Math.PI/2;cyl(.2,.38,mat(0xd9d9d9,.3),0,0,0,w).rotation.z=Math.PI/2;wheels.push(w)}
 const d=new THREE.Group();d.position.set(0,.75,-.25);tilt.add(d);driver(d);
 const K={g,tilt,wheels,driver:d,x:0,z:0,y:0,vy:0,h:0,v:0,air:0,spin:0,i:0,u:0,lap:0,lat:0,cp:0,boostT:0,nitro:0,driftT:0,driftOn:false,bubble:makeBubble(g,2.6)};return K}
const DRIVERS={
 milky:{name:'מילקי',icon:'🐕',col:0xe0b062,max:26,acc:14,turn:1.95,grip:1,special:'bark',sIcon:'🗣️',sName:'נביחה',
  build:d=>{const {g}=cloneMilky();RACE_G.add(g);g.scale.setScalar(.72);g.position.set(0,-.7,-.25);d.add(g)}},
 coco:{name:'קוקו',icon:'🦜',col:0x2fb34a,max:25,acc:15,turn:2.1,grip:1,special:'glide',sIcon:'🪶',sName:'ריחוף',
  build:d=>{const c=PP.clone(true);c.visible=true;c.position.set(0,-.25,0);c.scale.setScalar(1.25);d.add(c)}},
 bull:{name:'בולדוזר',icon:'🐶',col:0x6b4a32,max:24,acc:11.5,turn:1.65,grip:1.15,special:'ram',sIcon:'💪',sName:'דהירה',
  build:d=>{const b=makeDog({name:'',color:0x2b2018,color2:0x9c6b3e,size:1.25,speed:0,x:0,z:0});scene.remove(b.g);b.g.position.set(0,-.7,0);b.g.scale.setScalar(.62);b.legs.forEach(l=>l.rotation.x=-1.2);d.add(b.g);if(b.b&&b.b.el)b.b.el.remove()}},
 pigeon:{name:'יונה',icon:'🕊️',col:0x8a8f9a,max:28,acc:16,turn:2,grip:.8,special:'seeds',sIcon:'🌾',sName:'גרעינים',
  build:d=>{const p=makePigeon();scene.remove(p.g);p.g.scale.setScalar(4.2);p.g.position.set(0,-.35,0);d.add(p.g)}}};
const R_ORDER=['milky','coco','bull','pigeon'];
const KARTS={};for(const id of R_ORDER){KARTS[id]=makeKart(DRIVERS[id].col,DRIVERS[id].build);KARTS[id].id=id;KARTS[id].g.visible=false}
const VAN=makeKart(0xf2efe6,d=>{box(1.6,1.3,1.6,mat(0xf2efe6,.5),0,.5,-.4,d);const c=document.createElement('canvas');c.width=128;c.height=64;const q=c.getContext('2d');q.fillStyle='#c0392b';q.fillRect(0,0,128,64);q.font='42px system-ui';q.textAlign='center';q.textBaseline='middle';q.fillText('🌭',64,34);
 const s=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.7),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}));s.position.set(.81,.6,-.4);s.rotation.y=Math.PI/2;d.add(s);const s2=s.clone();s2.position.x=-.81;s2.rotation.y=-Math.PI/2;d.add(s2)});VAN.g.visible=false;VAN.id='van';
// ---------- state ----------
const RS={me:null,meId:'milky',rivals:[],mode:'free',m:null,t:0,over:false,count:0,lapStart:0,bestLap:0,lastLap:0,coins:0,crates:0,drift:0,air:0,pads:0,hits:0,rings:0,place:1,laps:0,cool:0,respawnT:0,lastSafe:null};
function rPlace(K,i,lat){const a=rAt(R_S[rIdx(i)],lat);K.x=a.p.x;K.z=a.p.z;K.y=0;K.vy=0;K.h=Math.atan2(a.t.x,a.t.z);K.v=0;K.i=rIdx(i);K.u=R_S[K.i];K.lat=lat;K.spin=0;K.air=0}
function rPickReset(){for(const a of [R_COINS,R_CRATES,R_RINGS,R_SEEDS])for(const o of a){o.on=false;o.g.visible=false}}
function rScatterCoins(n){rPickReset();let seed=n*31+7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;for(let k=0;k<Math.min(n,R_COINS.length);k++){const c=R_COINS[k];const a=rAt(R_LEN*(k+.5)/n+rnd()*6,(rnd()-.5)*(RW-3));c.g.position.set(a.p.x,.9,a.p.z);c.on=true;c.g.visible=true}}
function rScatterCrates(n){for(let k=0;k<Math.min(n,R_CRATES.length);k++){const c=R_CRATES[k];const a=rAt(R_LEN*(k+.6)/n,((k%3)-1)*3);c.g.position.set(a.p.x,0,a.p.z);c.g.rotation.y=Math.atan2(a.t.x,a.t.z);c.on=true;c.g.visible=true}}
function rScatterRings(n,air){for(let k=0;k<Math.min(n,R_RINGS.length);k++){const r=R_RINGS[k];let a,h;if(air&&k<4){const i=R_RAMPS[k%2]+12+(k>1?6:0);a=rAt(R_S[rIdx(i)],0);h=4.2}else{a=rAt(R_LEN*(k+.3)/n,((k%3)-1)*2.5);h=1.7}
 r.g.position.set(a.p.x,h,a.p.z);r.g.rotation.y=Math.atan2(a.t.x,a.t.z);r.on=true;r.g.visible=true;r.k=k}RS.ringNext=0}
// ---------- missions: 10 per driver (same building blocks, each driver with its own flavour and numbers) ----------
const MT={
 lap:(par,o={})=>({type:'lap',par,limit:o.limit,air:o.air||0,...o}),
 coins:(n,limit)=>({type:'coins',n,limit,par:limit*.6}),
 drift:(n,limit)=>({type:'drift',n,limit,par:limit*.6}),
 race:(laps,rivals,need)=>({type:'race',laps,rivals,need,par:laps*45}),
 chase:(limit)=>({type:'chase',limit,par:limit*.55}),
 pads:(n,limit)=>({type:'pads',n,limit,par:limit*.6}),
 hits:(n,limit)=>({type:'hits',n,limit,par:limit*.55}),
 crates:(n,limit)=>({type:'crates',n,limit,par:limit*.55}),
 airtime:(n,limit)=>({type:'airtime',n,limit,par:limit*.6}),
 rings:(n,limit,air)=>({type:'rings',n,limit,air,par:limit*.6})};
const R_MISSIONS={
 milky:[['🏁','סיבוב היכרות','הקפה אחת, בכיף',MT.lap(30)],['🦴','עצמות על המסלול','15 עצמות ב־70 שנ׳',MT.coins(15,70)],['🌭','רודף הנקניקיות','לתפוס את משאית הנקניקיות',MT.chase(70)],
  ['🌀','דריפט ראשון','5 שניות דריפט',MT.drift(5,70)],['🏎️','מירוץ נגד קוקו','2 הקפות, מקום ראשון',MT.race(2,['coco'],1)],['🚀','שרשרת טורבו','6 משטחי טורבו',MT.pads(6,80)],
  ['🗣️','נביחת סופר','לנבוח על יריבים 3 פעמים',MT.hits(3,90)],['⏱️','נגד השעון','הקפה מתחת ל־27 שנ׳',MT.lap(22,{limit:27,timed:true})],['🏆','מירוץ שלושה','3 הקפות, מקום 1–2',MT.race(3,['coco','bull'],2)],['👑','הגרנד פרי של מילקי','3 הקפות נגד כולם: לנצח!',MT.race(3,['coco','bull','pigeon'],1)]],
 coco:[['🪶','טיסה על גלגלים','הקפה עם 2 שנ׳ באוויר (החזק 🌀 באוויר כדי לרחף)',MT.lap(32,{air:2})],['💍','טבעות באוויר','6 טבעות (חלקן מעל הקפיצות)',MT.rings(6,90,true)],['🥜','במבות','18 במבות ב־70 שנ׳',MT.coins(18,70)],
  ['🌀','דריפט נוצות','6 שניות דריפט',MT.drift(6,75)],['🏎️','מירוץ נגד מילקי','2 הקפות, מקום ראשון',MT.race(2,['milky'],1)],['🪂','ריחוף ארוך','6 שניות באוויר',MT.airtime(6,100)],
  ['⏱️','קוקו מהיר','הקפה מתחת ל־28 שנ׳',MT.lap(23,{limit:28,timed:true})],['💥','ארגזים','8 ארגזים ב־70 שנ׳',MT.crates(8,70)],['🏆','מירוץ שלושה','3 הקפות, מקום 1–2',MT.race(3,['milky','pigeon'],2)],['👑','הגרנד פרי של קוקו','3 הקפות נגד כולם: לנצח!',MT.race(3,['milky','bull','pigeon'],1)]],
 bull:[['🐶','בולדוזר יוצא מהחצר','הקפה אחת',MT.lap(32)],['💥','שובר ארגזים','10 ארגזים ב־70 שנ׳',MT.crates(10,70)],['💪','דהירה','לדהור לתוך יריבים 3 פעמים',MT.hits(3,90)],
  ['🦴','עצמות','15 עצמות ב־70 שנ׳',MT.coins(15,70)],['🏎️','מירוץ נגד היונה','2 הקפות, מקום ראשון',MT.race(2,['pigeon'],1)],['🧱','קיר ארגזים','16 ארגזים ב־90 שנ׳',MT.crates(16,90)],
  ['🌀','דריפט כבד','5 שניות דריפט',MT.drift(5,80)],['⏱️','נגד השעון','הקפה מתחת ל־29 שנ׳',MT.lap(24,{limit:29,timed:true})],['🏆','מירוץ שלושה','3 הקפות, מקום 1–2',MT.race(3,['coco','milky'],2)],['👑','הגרנד פרי של בולדוזר','3 הקפות נגד כולם: לנצח!',MT.race(3,['milky','coco','pigeon'],1)]],
 pigeon:[['🕊️','יונה על גלגלים','הקפה אחת',MT.lap(28)],['🌾','פירורים','20 פירורים ב־70 שנ׳',MT.coins(20,70)],['🌀','דריפט חלקלק','7 שניות דריפט',MT.drift(7,75)],
  ['🚀','טורבו','8 משטחי טורבו',MT.pads(8,90)],['🌾','מלכודת גרעינים','תעקוף יריב ותפזר גרעינים: 3 החלקות',MT.hits(3,100)],['🏎️','מירוץ נגד בולדוזר','2 הקפות, מקום ראשון',MT.race(2,['bull'],1)],
  ['⏱️','יונה מהירה','הקפה מתחת ל־25 שנ׳',MT.lap(20,{limit:25,timed:true})],['💍','שער אחרי שער','10 טבעות ב־60 שנ׳',MT.rings(10,60,false)],['🏆','מירוץ שלושה','3 הקפות, מקום 1–2',MT.race(3,['bull','coco'],2)],['👑','הגרנד פרי של יונה','3 הקפות נגד כולם: לנצח!',MT.race(3,['milky','coco','bull'],1)]]};
// ---------- start / stop ----------
function setRace(on){if(on===RACE_ON&&on)return;
 if(on){allModesOff('race');RACE_ON=true;window.RACE_ON=true;OPEN_WORLD=true;reset();owApply();RACE_G.visible=true;dog.visible=false;if(typeof HM!=='undefined')HM.g.visible=false;if(typeof DM!=='undefined'&&DM.g)DM.g.visible=false;if(typeof PP!=='undefined')PP.visible=false;document.body.classList.add('racePlay');scene.fog.near=60;scene.fog.far=190;camera.far=260;camera.updateProjectionMatrix()}
 else{RACE_ON=false;window.RACE_ON=false;RACE_G.visible=false;dog.visible=true;document.body.classList.remove('racePlay');for(const K of Object.values(KARTS))K.g.visible=false;VAN.g.visible=false;evtPill.hidden=true;RS.m=null;
  scene.fog.near=30;scene.fog.far=115;camera.far=160;camera.updateProjectionMatrix();pos.set(0,0,5);rag.active=false}
 raceButtons()}
function raceButtons(){const jb=document.getElementById('jumpBtn'),rb=document.querySelector('#big [data-key="ShiftLeft"]');if(!jb||!rb)return;
 jb.querySelector('b').textContent=RACE_ON?'🌀':(window.PARP?'🪶':'🐾');jb.querySelector('small').textContent=RACE_ON?'דריפט':(window.PARP?'לנפנף':'קפיצה');
 rb.querySelector('b').textContent='⚡';rb.querySelector('small').textContent=RACE_ON?'ניטרו':'ריצה'}
function raceBegin(driverId,mission){setRace(true);RS.meId=driverId;RS.me=KARTS[driverId];RS.m=mission;RS.t=0;RS.over=false;RS.coins=0;RS.crates=0;RS.drift=0;RS.air=0;RS.pads=0;RS.hits=0;RS.rings=0;RS.laps=0;RS.bestLap=0;RS.lastLap=0;RS.lapStart=0;RS.cool=0;RS.respawnT=0;RS.lapAir=0;RS.padIdx=-1;
 for(const K of Object.values(KARTS))K.g.visible=false;VAN.g.visible=false;rPickReset();RS.rivals=[];
 const me=RS.me;me.g.visible=true;rPlace(me,RN-4,0);me.lap=0;me.cp=0;me.nitro=.3;me.boostT=0;RS.lastSafe={i:me.i};
 const T=mission?mission.type:'free';
 const riv=mission&&mission.rivals?mission.rivals:(T==='hits'?R_ORDER.filter(id=>id!==driverId):T==='free'?R_ORDER.filter(id=>id!==driverId):[]);
 riv.forEach((id,k)=>{const K=KARTS[id];K.g.visible=true;rPlace(K,RN-4-(k+1)*10,(k%2?-1:1)*2.6);K.lap=-1; /* behind the line: crossing it is not a lap */K.cp=0;K.lane=(k%2?-1:1)*2.6;K.skill=T==='free'||T==='hits'?.72:(mission.need===1&&mission.rivals.length>=3?.99:mission.laps>=3?.95:.9);K.spinT=0;K.ai=true;RS.rivals.push(K)});
 if(T==='hits'&&riv.length){RS.rivals.forEach((K,k)=>{rPlace(K,Math.floor(RN*(k+1)/(riv.length+1)),K.lane);K.skill=.6;K.lap=0})}
 if(T==='chase'){VAN.g.visible=true;rPlace(VAN,40,0);VAN.lap=0;VAN.lane=0;VAN.skill=.82;VAN.ai=true;VAN.spinT=0;RS.rivals.push(VAN)}
 if(T==='coins'||T==='free')rScatterCoins(T==='free'?24:mission.n+6);
 if(T==='crates'||T==='free')rScatterCrates(T==='free'?12:Math.min(22,mission.n+4));
 if(T==='rings')rScatterRings(mission.n,mission.air);
 RS.count=T==='race'?3.2:.01;started=true;evtPill.hidden=false;RS.snap=true;
 if(T==='race'){showBanner('3...');[2,1].forEach((n,k)=>setTimeout(()=>{if(RACE_ON&&RS.m===mission)showBanner(n+'...')},(k+1)*1000));setTimeout(()=>{if(RACE_ON&&RS.m===mission)showBanner('🏁 יאללה!!!')},3000)}
 else showBanner(mission?mission.icon+' '+mission.title+': '+mission.sub:'🏎️ נהיגה חופשית! עצמות, ארגזים, קפיצות ויריבים')}
// ---------- driving ----------
function rInput(){let thr=0,st=0;if(keys.KeyW||keys.ArrowUp)thr+=1;if(keys.KeyS||keys.ArrowDown)thr-=1;if(keys.KeyA||keys.ArrowLeft)st+=1;if(keys.KeyD||keys.ArrowRight)st-=1;
 if(stick.active&&stick.mag>.12){thr=THREE.MathUtils.clamp(stick.y*stick.mag*1.25+.15,-1,1);st=THREE.MathUtils.clamp(-stick.x*stick.mag*1.3,-1,1)}return {thr,st,drift:!!keys.Space,nitro:!!(keys.ShiftLeft||keys.ShiftRight)}}
function kartPhysics(K,inp,dt,D){const onRoad=Math.abs(K.lat)<RW/2+.9;const boost=K.boostT>0||K.nitroOn||K.ramT>0;
 let max=D.max*(boost?1.42:1)*(onRoad?1:.55)*(K.spinT>0?.35:1);
 if(K.y<=0){if(inp.thr>0)K.v+=D.acc*inp.thr*dt*(K.v<max?1:0);else if(inp.thr<0)K.v-=(K.v>0?26:9)*-inp.thr*dt;
  if(boost&&K.v<max)K.v+=12*dt;K.v-=K.v*(onRoad?.18:1.1)*dt;if(K.v>max)K.v+=(max-K.v)*Math.min(1,dt*2.5);K.v=Math.max(-7,K.v)}
 const sp=Math.abs(K.v);const tf=Math.min(1,sp/9)*(K.v<0?-1:1);let turn=D.turn*(K.driftOn?1.5:1)*(K.y>0?.45:1);
 // drift: hold the drift button while steering at speed; release for a mini-turbo
 if(inp.drift&&K.y<=0&&sp>10&&Math.abs(inp.st)>.15){if(!K.driftOn){K.driftOn=true;K.driftDir=Math.sign(inp.st);K.driftCharge=0}}
 else if(K.driftOn&&(!inp.drift||sp<8)){K.driftOn=false;if(K.driftCharge>.7){K.boostT=Math.max(K.boostT,.45+Math.min(1,K.driftCharge)*.5);if(K===RS.me)sayText(K.bubble,K.driftCharge>1.4?'🔥 טורבו סגול!':'⚡ טורבו!',1,'say',true)}}
 if(K.driftOn){K.driftCharge+=dt;if(K===RS.me)RS.drift+=dt;const s=K.driftDir*.55+inp.st*.5;K.h+=s*turn*tf*dt;emit(K.x-Math.sin(K.h)*1.4,.2,K.z-Math.cos(K.h)*1.4,(Math.random()-.5),.6,(Math.random()-.5),K.driftCharge>1.4?'foam':'dust',.5)}
 else K.h+=inp.st*turn*tf*dt*(1/(D.grip||1)*.25+.75);
 if(K.spinT>0){K.spinT-=dt;K.tilt.rotation.y+=dt*14}else K.tilt.rotation.y+=((K.driftOn?K.driftDir*.45:0)-K.tilt.rotation.y)*Math.min(1,dt*8);
 K.x+=Math.sin(K.h)*K.v*dt;K.z+=Math.cos(K.h)*K.v*dt;
 if(K.y>0||K.vy>0){const glide=D.special==='glide'&&inp.drift&&K.vy<0;K.vy-=(glide?9:22)*dt;if(glide)K.vy=Math.max(K.vy,-2.2);K.y+=K.vy*dt;K.air+=dt;if(K===RS.me){RS.air+=dt;RS.lapAir+=dt}
  if(K.y<=0){K.y=0;K.vy=0;if(K.air>.5){emit(K.x,.2,K.z,0,1,0,'dust',.6);if(K===RS.me){chaosShake=Math.max(chaosShake,.15);playToySound(140,.08,'sine')}}K.air=0}}
 K.boostT=Math.max(0,K.boostT-dt);K.ramT=Math.max(0,(K.ramT||0)-dt);
 K.i=rNearest(K.x,K.z,K.i);K.lat=rLat(K.i,K.x,K.z);
 // ramps launch, pads boost
 if(K.y<=0)for(const ri of R_RAMPS){const d=rIdx(K.i-ri);if(d<3&&Math.abs(K.lat)<RW/2&&K.v>7){K.vy=5.8+K.v*.13;K.y=.01;if(K===RS.me){sayText(K.bubble,pick(['ויייי!','🚀 טסים!','יאהו!']),1,'say',true);playToySound(500,.1,'triangle')}}}
 for(const pi of R_PADS){const d=rIdx(K.i-pi);if(d<4&&Math.abs(K.lat)<2.4&&K.y<.5){if(K.boostT<.3&&K===RS.me&&RS.padIdx!==pi){RS.pads++;RS.padIdx=pi;playToySound(700,.08,'square')}K.boostT=Math.max(K.boostT,1.1)}}
 if(K===RS.me&&!R_PADS.some(pi=>rIdx(K.i-pi)<6))RS.padIdx=-1}
function kartVisual(K,dt){K.g.position.set(K.x,K.y,K.z);K.g.rotation.y=K.h;K.tilt.rotation.x=K.y>0?THREE.MathUtils.clamp(-K.vy*.04,-.35,.35):0;K.tilt.rotation.z=K.driftOn?-K.driftDir*.08:0;
 K.wheels.forEach(w=>w.rotation.x+=K.v*dt*2.4);K.driver.rotation.z=Math.sin(performance.now()/120)*.03*Math.min(1,Math.abs(K.v)/10);
 if(K.boostT>0&&Math.random()<.7)emit(K.x-Math.sin(K.h)*1.7,.5,K.z-Math.cos(K.h)*1.7,-Math.sin(K.h)*2,.4,-Math.cos(K.h)*2,'foam',.35)}
// rivals: drive along the racing line with a lane offset; a little rubber band keeps races close
function rivalStep(K,dt){const me=RS.me;const D=DRIVERS[K.id]||{max:22,acc:10};
 if(RS.count>0){kartVisual(K,dt);return}
 const myU=myProg(),kU=K.lap*R_LEN+K.u,gap=kU-myU;let band=gap>30?.9:gap<-30?1.12:1;if(RS.m&&RS.m.type==='chase')band=gap<12?1.05:1;
 if(K.y<=0&&R_PADS.some(pi=>rIdx(K.i-pi)<4)&&Math.abs(K.lane)<2.4)K.boostT=1.1;K.boostT=Math.max(0,(K.boostT||0)-dt);
 let target=DRIVERS[RS.meId].max*(K===VAN?.82:K.skill)*band*(K.spinT>0?.25:1)*(K.boostT>0?1.3:1);if(K.ramT>0)target*=.7;
 K.v+=THREE.MathUtils.clamp(target-K.v,-18*dt,(D.acc||10)*dt);
 const ahead=R_S[rIdx(K.i+18)]-R_S[K.i];const curv=Math.abs(Math.atan2(R_T[rIdx(K.i+18)].x,R_T[rIdx(K.i+18)].z)-Math.atan2(R_T[K.i].x,R_T[K.i].z));const slow=curv>.6&&curv<5.6?.86:1;
 const prevU=K.u;K.u+=K.v*slow*dt;if(K.u>=R_LEN){K.u-=R_LEN;K.lap++}
 let laneT=Math.sin(performance.now()/2600+K.u*.01)*2.6;
 // seeds on the road ahead are irresistible: they steer right into them
 for(const s of R_SEEDS){if(!s.on)continue;const si=rNearest(s.g.position.x,s.g.position.z);let du=R_S[si]-K.u;if(du<-R_LEN/2)du+=R_LEN;if(du>0&&du<36){laneT=rLat(si,s.g.position.x,s.g.position.z);K.lured=true;break}}
 K.lane+=(laneT-K.lane)*Math.min(1,dt*(K.lured?3.2:.4));K.lured=false;
 const a=rAt(K.u,K.lane+(K.dodge||0));K.dodge=(K.dodge||0)*Math.max(0,1-dt*2);K.x=a.p.x;K.z=a.p.z;K.i=a.i;K.lat=K.lane;const th=Math.atan2(a.t.x,a.t.z);K.h+=Math.atan2(Math.sin(th-K.h),Math.cos(th-K.h))*Math.min(1,dt*8);
 // AI jumps the ramps too
 if(K.y<=0&&R_RAMPS.some(ri=>rIdx(K.i-ri)<3)){K.vy=5.8+K.v*.13;K.y=.01}if(K.y>0||K.vy>0){K.vy-=22*dt;K.y+=K.vy*dt;if(K.y<=0){K.y=0;K.vy=0}}
 if(K.spinT>0){K.spinT-=dt;K.tilt.rotation.y+=dt*14}else K.tilt.rotation.y*=.85;
 kartVisual(K,dt)}
// bumping: karts push each other apart (Bulldozer's ram sends them flying)
function kartBumps(){const me=RS.me;for(const K of RS.rivals){const dx=K.x-me.x,dz=K.z-me.z,d=Math.hypot(dx,dz);if(d<2.2&&d>.01){const push=(2.2-d)/2;
 if(me.ramT>0&&K.spinT<=0&&K!==VAN){K.spinT=1.4;K.dodge=Math.sign(rLat(K.i,me.x,me.z))*-3;RS.hits++;sayText(K.bubble,pick(['אאא!','בולדוזר!!!','מה זה היה?!']),1.2,'say',true);if(window.JUICE_READY)pow('בום!',K.x,2.5,K.z)}
 me.x-=dx/d*push*(K===VAN?1:.6);me.z-=dz/d*push*(K===VAN?1:.6);K.dodge=(K.dodge||0)+Math.sign(K.lane-rLat(K.i,me.x,me.z)||1)*push*.8;me.v*=.97}}}
// specials (the action button): bark, glide, ram, seeds
function raceSpecial(){if(RS.cool>0||!RS.me)return;const D=DRIVERS[RS.meId],me=RS.me;RS.cool=7;
 if(D.special==='bark'){sayText(me.bubble,'🗣️ וואף!!!',1.2,'say',true);playToySound(180,.15,'sawtooth');for(let i=0;i<14;i++){const a=i/14*6.283;emit(me.x+Math.cos(a)*1.5,1,me.z+Math.sin(a)*1.5,Math.cos(a)*8,.5,Math.sin(a)*8,'foam',.6)}
  for(const K of RS.rivals){if(K===VAN)continue;if(Math.hypot(K.x-me.x,K.z-me.z)<13&&K.spinT<=0){K.spinT=1.3;RS.hits++;sayText(K.bubble,pick(['אוי! הנביחה!','😵','איזה רעש!']),1.2,'say',true)}}}
 else if(D.special==='glide'){if(me.y<=0){me.vy=7.5;me.y=.01}sayText(me.bubble,'🪶 ריחוף!',1,'say',true);me.boostT=Math.max(me.boostT,.6)}
 else if(D.special==='ram'){me.ramT=2.2;me.boostT=Math.max(me.boostT,2.2);sayText(me.bubble,'💪 בולדוזר דוהר!!!',1.4,'say',true)}
 else if(D.special==='seeds'){const s=R_SEEDS.find(s=>!s.on)||R_SEEDS[0];s.on=true;s.t=20;s.g.visible=true;s.g.position.set(me.x-Math.sin(me.h)*2.4,.02,me.z-Math.cos(me.h)*2.4);sayText(me.bubble,'🌾 גרעינים!',1,'say',true)}}
function pickups(dt){const me=RS.me;
 for(const c of R_COINS){if(!c.on)continue;c.g.rotation.y+=dt*3;if(Math.hypot(c.g.position.x-me.x,c.g.position.z-me.z)<2&&me.y<2){c.on=false;c.g.visible=false;RS.coins++;me.nitro=Math.min(1,me.nitro+.1);playToySound(880,.05,'triangle');emit(c.g.position.x,1,c.g.position.z,0,2,0,'foam',.5)}}
 for(const c of R_CRATES){if(!c.on)continue;if(Math.hypot(c.g.position.x-me.x,c.g.position.z-me.z)<1.9&&me.y<1.3){c.on=false;c.g.visible=false;RS.crates++;if(RS.meId!=='bull'&&me.ramT<=0)me.v*=.72;chaosShake=Math.max(chaosShake,.2);playToySound(160,.09,'square');
  for(let i=0;i<10;i++)emit(c.g.position.x,.8,c.g.position.z,(Math.random()-.5)*6,2+Math.random()*3,(Math.random()-.5)*6,'dust',.8)}}
 for(const r of R_RINGS){if(!r.on)continue;r.g.rotation.z+=dt*.6;const dy=Math.abs(r.g.position.y-(me.y+1));if(Math.hypot(r.g.position.x-me.x,r.g.position.z-me.z)<2.4&&dy<1.9){r.on=false;r.g.visible=false;RS.rings++;playToySound(620+RS.rings*40,.07,'triangle');if(window.JUICE_READY)pow('✨',r.g.position.x,r.g.position.y,r.g.position.z)}}
 for(const s of R_SEEDS){if(!s.on)continue;s.t-=dt;if(s.t<=0){s.on=false;s.g.visible=false;continue}for(const K of RS.rivals){if(K!==VAN&&K.spinT<=0&&Math.hypot(K.x-s.g.position.x,K.z-s.g.position.z)<2.6){K.spinT=1.4;RS.hits++;s.on=false;s.g.visible=false;sayText(K.bubble,pick(['אני מחליק!!!','גרעינים?!','וואו וואו וואו']),1.2,'say',true);break}}}}
// laps: checkpoints every eighth of the circuit, in order; crossing the line after the last one counts the lap
function lapLogic(){const me=RS.me;const seg=Math.floor(me.i/(RN/8));
 if(seg===me.cp+1)me.cp=seg;
 if(me.cp===7&&seg===0){me.lap++;me.cp=0;const lt=RS.t-RS.lapStart;RS.lastLap=lt;if(!RS.bestLap||lt<RS.bestLap)RS.bestLap=lt;RS.lapStart=RS.t;RS.laps++;RS.lapAirDone=RS.lapAir;RS.lapAir=0;
  if(!RS.m||RS.m.type!=='race')showBanner('⏱️ הקפה: '+fmtTime(lt)+(RS.bestLap===lt?' (שיא!)':''));playToySound(660,.12,'triangle')}
 if(Math.abs(me.lat)<RW/2&&me.y<=0)RS.lastSafe={i:me.i};
 if(Math.abs(me.lat)>RW/2+14){RS.respawnT+=1/60;if(RS.respawnT>1.2)raceRespawn()}else RS.respawnT=0}
function raceRespawn(){const me=RS.me;const i=RS.lastSafe?RS.lastSafe.i:me.i;rPlace(me,i,0);RS.respawnT=0;showBanner('↩️ חזרה למסלול')}
function myProg(){const me=RS.me;const behind=me.lap===0&&me.cp===0&&me.i>RN/2;return (me.lap-(behind?1:0))*R_LEN+R_S[me.i]}
function racePlace(){const me=RS.me;const myU=myProg();let p=1;for(const K of RS.rivals){if(K===VAN)continue;const u=K.lap*R_LEN+K.u;if(u>myU)p++}return p}
// mission checking
function raceCheck(){const m=RS.m;if(!m||RS.over)return;const T=m.type,t=RS.t;let done=false,fail=false,line='';
 if(T==='lap'){line=m.timed?'⏱️ הקפה מתחת ל־'+m.limit+' שנ׳ · עכשיו '+Math.floor(t-RS.lapStart)+(RS.lastLap?' · אחרונה '+fmtTime(RS.lastLap):''):m.air?'🪶 באוויר בהקפה: '+RS.lapAir.toFixed(1)+'/'+m.air+' שנ׳':'🏁 הקפה '+Math.min(RS.laps+1,1)+'/1';
  if(RS.laps>=1){if(m.timed){if(RS.bestLap<=m.limit)done=true;else if(t>m.limit*4)fail=true}else if(m.air){if((RS.lapAirDone||0)>=m.air)done=true}else done=true}}
 else if(T==='coins'){line='🦴 '+RS.coins+'/'+m.n;done=RS.coins>=m.n}
 else if(T==='drift'){line='🌀 דריפט '+RS.drift.toFixed(1)+'/'+m.n+' שנ׳';done=RS.drift>=m.n}
 else if(T==='pads'){line='🚀 טורבו '+RS.pads+'/'+m.n;done=RS.pads>=m.n}
 else if(T==='hits'){line=DRIVERS[RS.meId].sIcon+' פגיעות '+RS.hits+'/'+m.n+(RS.cool>0?' · '+Math.ceil(RS.cool):' · מוכן!');done=RS.hits>=m.n}
 else if(T==='crates'){line='💥 ארגזים '+RS.crates+'/'+m.n;done=RS.crates>=m.n}
 else if(T==='airtime'){line='🪂 באוויר '+RS.air.toFixed(1)+'/'+m.n+' שנ׳';done=RS.air>=m.n}
 else if(T==='rings'){line='💍 טבעות '+RS.rings+'/'+m.n;done=RS.rings>=m.n}
 else if(T==='chase'){const d=Math.hypot(VAN.x-RS.me.x,VAN.z-RS.me.z);line='🌭 המשאית במרחק '+Math.round(d)+' מ׳';done=d<3.2}
 else if(T==='race'){const pl=racePlace();RS.place=pl;line='🏁 הקפה '+Math.min(RS.me.lap+1,m.laps)+'/'+m.laps+' · מקום '+pl+'/'+(m.rivals.length+1);
  if(RS.me.lap>=m.laps){if(pl<=m.need)done=true;else fail=true}else if(RS.rivals.some(K=>K.lap>=m.laps)&&m.need===1&&RS.me.lap<m.laps)fail=true}
 if(m.limit&&!m.timed&&T!=='race'){line+=' · '+Math.max(0,Math.ceil(m.limit-t));if(t>=m.limit&&!done)fail=true}
 line=m.icon+' '+line+' · ⚡'+Math.round(RS.me.nitro*100)+'%';if(evtPill.textContent!==line)evtPill.textContent=line;
 if(done)raceEnd(true);else if(fail)raceEnd(false)}
function raceEnd(win){if(RS.over)return;RS.over=true;const m=RS.m;const t=RS.t;
 let st=win?(m.type==='race'?(RS.place===1?3:2):t<=m.par?3:t<=m.par*1.6?2:1):0;if(win&&m.type==='lap'&&m.timed)st=RS.bestLap<=m.limit-3?3:RS.bestLap<=m.limit-1?2:1;
 const lines=win?[m.type==='race'?'🏁 מקום '+RS.place+'!':'⏱️ '+fmtTime(t),RS.bestLap?'🏎️ הקפה הכי טובה: '+fmtTime(RS.bestLap):'','🦴 עצמות: '+RS.coins].filter(Boolean):[m.type==='race'?'🏁 הגעת במקום '+racePlace():'⏰ נגמר הזמן','😤 עוד ניסיון?'];
 if(win&&window.JUICE_READY){slowMo(.5);pow('🏁 ניצחון!',RS.me.x,3,RS.me.z,true)}
 setTimeout(()=>epFinish(win,st,lines,win?m.icon+' '+m.title+' — הצלחה!':'😩 '+m.title+' — כמעט!'),1300)}
// ---------- per-frame ----------
function raceStep(dt){if(!RS.me)return;const me=RS.me,D=DRIVERS[RS.meId];
 if(RS.count>0){RS.count-=dt;me.v=0}else RS.t+=dt;
 RS.cool=Math.max(0,RS.cool-dt);
 const inp=RS.count>0?{thr:0,st:0,drift:false,nitro:false}:rInput();
 me.nitroOn=inp.nitro&&me.nitro>.02;if(me.nitroOn)me.nitro=Math.max(0,me.nitro-dt*.45);
 if(!RS.over)kartPhysics(me,inp,dt,D);kartVisual(me,dt);
 for(const K of RS.rivals)rivalStep(K,dt);kartBumps();pickups(dt);lapLogic();raceCheck();
 // the rest of the game sees the kart as "the player"
 pos.set(me.x,0,me.z);yaw=me.h;camYaw=me.h;jumpY=me.y;lastDogSpeed=Math.abs(me.v);
 updateParts(dt);if(window.CTRL_READY)updateCtxButtons(dt);RS.hintT=(RS.hintT||0)-dt;if(RS.hintT<=0){RS.hintT=.5;setHint(nextTaskHint())}if(window.CLARITY_READY)holdTick();
 if(Math.random()<dt*.05&&RS.rivals.length){const K=pick(RS.rivals);if(K!==VAN)sayText(K.bubble,pick(['🏁 תתפסו אותי!','💨','😜','אני מנצח!','🦴!']),1.4,'say')}}
const _rcam=new THREE.Vector3(),_rlook=new THREE.Vector3();
function raceCamera(dt){const me=RS.me;if(!me)return;const fx=Math.sin(me.h),fz=Math.cos(me.h);const back=7.2+Math.min(3,Math.abs(me.v)*.08);
 _rcam.set(me.x-fx*back,3.3+me.y*.55,me.z-fz*back);if(RS.snap){camera.position.copy(_rcam);RS.snap=false}else camera.position.lerp(_rcam,1-Math.exp(-dt*6));
 _rlook.set(me.x+fx*4,1.2+me.y*.6,me.z+fz*4);camera.lookAt(_rlook);
 if(chaosShake>0){camera.position.x+=(Math.random()-.5)*chaosShake*.11;camera.position.y+=(Math.random()-.5)*chaosShake*.07}
 sun.position.set(me.x,8,me.z-10.5);sun.target.position.set(me.x,0,me.z)}
// ---------- hooks into the main loop and the controls ----------
const _gs=gameStep;gameStep=function(dt){if(RACE_ON){raceStep(dt);return}return _gs(dt)};
const _rf=renderFrame;renderFrame=function(){if(RACE_ON){raceCamera(lastFrameDt||1/60);placeBubbles();syncLiveMats();renderer.render(scene,camera);perfTick();return}return _rf()};
CTX_HOOKS.act.unshift(()=>RACE_ON&&RS.me?{i:DRIVERS[RS.meId].sIcon,l:RS.cool>0?DRIVERS[RS.meId].sName+' '+Math.ceil(RS.cool):DRIVERS[RS.meId].sName+'!',on:RS.cool>0?0:1,fn:raceSpecial}:null);
CTX_HOOKS.grab.unshift(()=>RACE_ON&&RS.me?{i:'↩️',l:'למסלול',on:1,fn:raceRespawn}:null);
const _nth7=nextTaskHint;nextTaskHint=function(){if(!RACE_ON)return _nth7();return RS.m?'🕹️ ג׳ויסטיק: קדימה = גז, ימינה/שמאלה = הגה · 🌀 דריפט · ⚡ ניטרו':'🏎️ נהיגה חופשית · 🌀 דריפט · ⚡ ניטרו · '+DRIVERS[RS.meId].sIcon+' '+DRIVERS[RS.meId].sName};
const _ct7=currentTarget;currentTarget=function(){if(!RACE_ON)return _ct7();const m=RS.m;if(!m||!guideOn)return null;
 if(m.type==='chase')return VAN.g.position;if(m.type==='rings'){const r=R_RINGS.find(r=>r.on);return r?r.g.position:null}
 if(m.type==='coins'){let b=null,bd=1e9;for(const c of R_COINS)if(c.on){const d=Math.hypot(c.g.position.x-pos.x,c.g.position.z-pos.z);if(d<bd){bd=d;b=c.g.position}}return b}
 if(m.type==='crates'){let b=null,bd=1e9;for(const c of R_CRATES)if(c.on){const d=Math.hypot(c.g.position.x-pos.x,c.g.position.z-pos.z);if(d<bd){bd=d;b=c.g.position}}return b}return null};
document.addEventListener('keydown',e=>{if(RACE_ON&&['KeyQ','KeyR','KeyX','KeyF','KeyT','KeyP','KeyH'].includes(e.code))e.stopImmediatePropagation()},true);
// ---------- episodes, hub and the universe card ----------
const R_EP={};
for(const id of R_ORDER){const D=DRIVERS[id];const L=R_MISSIONS[id].map(([icon,title,sub,m],k)=>({...m,icon,title,sub,id:'r'+(k+1)}));
 R_EP[id]=L;epRegister({id:'race_'+id,icon:D.icon,title:'🏎️ '+D.name+' במירוץ ברדק',reward:'גביע זהב ל'+D.name,rewardDone:'🏆 '+D.name+' זכה בגביע הזהב של מירוץ ברדק!',
  levels:L.map(m=>({id:m.id,title:m.title,icon:m.icon,sub:m.sub})),start:k=>{document.querySelector('#overlay').style.display='none';raceBegin(id,L[k]);startGame()},quit:()=>setRace(false),alive:()=>RACE_ON})}
const hub=document.createElement('div');hub.id='raceHub';hub.className='modal';hub.hidden=true;
hub.innerHTML='<div class="modalCard" style="max-width:640px"><div style="font-size:44px">🏎️</div><h1>מירוץ ברדק</h1><div id="rhSub" style="margin:2px 0 10px;font:800 15px system-ui;color:#ffe9a8">בחר נהג: לכל אחד 10 משימות משלו</div><div id="rhList" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-bottom:10px"></div><h3 style="margin:6px 0">🛣️ נהיגה חופשית</h3><div id="rhFree" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:12px"></div><div class="modalBtns"><button id="rhBack" type="button">🏠 לתפריט</button></div></div>';
document.body.appendChild(hub);
function raceHub(){document.querySelector('#overlay').style.display='none';started=false;hub.hidden=false;const L=hub.querySelector('#rhList'),F=hub.querySelector('#rhFree');L.innerHTML='';F.innerHTML='';
 for(const id of R_ORDER){const D=DRIVERS[id];const b=document.createElement('button');b.type='button';b.className='epLv';const st=epStars('race_'+id);
  b.innerHTML='<b>'+D.icon+'</b><strong>'+D.name+'</strong><small>'+(epComplete('race_'+id)?'🏆 ':'')+'⭐ '+st+'/30</small><small style="color:#cfe">'+D.sIcon+' '+D.sName+'</small>';b.onclick=()=>{hub.hidden=true;epBoard('race_'+id)};L.appendChild(b);
  const f=document.createElement('button');f.type='button';f.className='chip';f.textContent=D.icon+' '+D.name;f.onclick=()=>{hub.hidden=true;EP.cur=null;raceBegin(id,null);startGame()};F.appendChild(f)}}
hub.querySelector('#rhBack').onclick=()=>{hub.hidden=true;openMenu()};
document.getElementById('epBack').addEventListener('click',e=>{if(EP.cur&&/^race_/.test(EP.cur.id)){e.stopImmediatePropagation();document.getElementById('epBoard').hidden=true;raceHub()}},true);
document.getElementById('epToBoard').addEventListener('click',()=>{if(RACE_ON)setRace(false)},true);
WORLDS.push({icon:'🏎️',name:'מירוץ ברדק',col:'#ffb37a',sub:()=>'4 נהגים · ⭐ '+R_ORDER.reduce((a,id)=>a+epStars('race_'+id),0)+'/120',go:raceHub});if(typeof universeRender==='function')universeRender();
for(const id of ['start','startOpen','startZombie','startHuman','startDetective','modeSwitch','zSwitch'])document.getElementById(id).addEventListener('click',()=>{if(RACE_ON)setRace(false)},true);
document.getElementById('menuBtn').addEventListener('click',()=>{if(RACE_ON){setRace(false)}});
window.RS=RS;window.RACE_READY=true;
