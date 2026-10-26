// ===== Milky's neighbourhood: the street goes on to a square, a school, a forest with a stream and the beach.
// Areas are streamed (only the nearby ones are drawn and updated). A kart takes you anywhere outdoors; a map with quick travel.
// ---------- geography ----------
const TOWN_AREAS={
 road1:{x0:6.6,x1:19.4,z0:42,z1:124},plaza:{x0:-14,x1:44,z0:118,z1:142},road2:{x0:6.6,x1:19.4,z0:138,z1:174},
 beach:{x0:-60,x1:84,z0:170,z1:236},school:{x0:-50,x1:5.6,z0:56,z1:114},forest:{x0:20.6,x1:112,z0:54,z1:152}};
for(const a of Object.values(TOWN_AREAS))AREAS.push(a);
DOORS.push({ax:true,x0:4.9,x1:7.3,z0:80,z1:84.6},{ax:true,x0:18.7,x1:21.3,z0:88,z1:92.6}); // school gate, forest trail
const ZONES=[{id:'home',icon:'🏠',name:'הבית והרחוב',spawn:[13,0,30],rect:{x0:-20,x1:32,z0:-58,z1:44}},
 {id:'school',icon:'🏫',name:'בית הספר',spawn:[0,0,82],rect:TOWN_AREAS.school},{id:'plaza',icon:'⛲',name:'הכיכר',spawn:[13,0,124],rect:TOWN_AREAS.plaza},
 {id:'forest',icon:'🌲',name:'היער והנחל',spawn:[24,0,90],rect:TOWN_AREAS.forest},{id:'beach',icon:'🏖️',name:'החוף והטיילת',spawn:[13,0,178],rect:TOWN_AREAS.beach}];
const inRect=(r,x,z,m=0)=>x>=r.x0-m&&x<=r.x1+m&&z>=r.z0-m&&z<=r.z1+m;
function inTown(x,z){return z>42||Object.values(TOWN_AREAS).some(a=>inRect(a,x,z))}
function townCam(x,z,r){return Object.values(TOWN_AREAS).some(a=>x>=a.x0+r&&x<=a.x1-r&&z>=a.z0+r&&z<=a.z1-r)}
function zoneAt(x,z){for(const Z of ZONES)if(Z.id!=='home'&&inRect(Z.rect,x,z))return Z.id;return inTown(x,z)?'road':'home'}
// the stream that winds through the forest, and the sea
const streamX=z=>58+6*Math.sin(z/12);
function townWater(x,z){if(inRect(TOWN_AREAS.beach,x,z)&&z>214)return true;if(inRect(TOWN_AREAS.forest,x,z)&&Math.abs(x-streamX(z))<2.2&&!(z>70.5&&z<73.5))return true;return false}
if(!save.town||typeof save.town!=='object')save.town={visited:['home']};if(!Array.isArray(save.town.visited))save.town.visited=['home'];
// ---------- building helpers ----------
const ZG={};for(const id of ['roads','school','forest','beach'])ZG[id]=new THREE.Group(),scene.add(ZG[id]);
function slab(g,x0,x1,z0,z1,y,color){const m=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,.1,z1-z0),mat(color,.95));m.position.set((x0+x1)/2,y-.05,(z0+z1)/2);m.receiveShadow=true;m.castShadow=false;g.add(m);return m}
function instanced(geo,material,list,g){const M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(),P=new THREE.Vector3(),im=new THREE.InstancedMesh(geo,material,list.length);
 list.forEach(([x,y,z,s,r],i)=>{Q.setFromAxisAngle(new THREE.Vector3(0,1,0),r||0);S.set(s,s,s);M.compose(P.set(x,y,z),Q,S);im.setMatrixAt(i,M)});im.castShadow=false;KEEP.add(im);g.add(im);return im}
let tSeed=11;const trnd=()=>(tSeed=(tSeed*16807)%2147483647)/2147483647;
function signBoard(g,text,x,y,z,ry,w=4){const c=document.createElement('canvas'),W=w>6?1024:512,H=Math.round(W*.215);c.width=W;c.height=H;const q=c.getContext('2d');q.fillStyle='#2b2420';q.fillRect(0,0,W,H);q.fillStyle='#ffd166';q.textAlign='center';q.textBaseline='middle';q.direction='rtl';
 let fs=Math.round(H*.53);q.font='bold '+fs+'px system-ui,Arial';while(fs>14&&q.measureText(text).width>W*.92){fs-=2;q.font='bold '+fs+'px system-ui,Arial'}q.fillText(text,W/2,H*.53);
 // two single-sided faces back to back: the text reads correctly from either side
 const geo=new THREE.PlaneGeometry(w,w*.215),mt=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}),m=new THREE.Group();m.position.set(x,y,z);m.rotation.y=ry;
 for(const r of [0,Math.PI]){const f=new THREE.Mesh(geo,mt);f.rotation.y=r;f.position.z=r?-.01:.01;KEEP.add(f);m.add(f)}g.add(m);return m}
// ---------- roads and the square ----------
{const g=ZG.roads,asph=0x4a4b50,walk=0xbdb6aa;
 // one continuous grass base under the whole neighbourhood, so no gap between areas shows the sky
 slab(scene,-64,116,43.4,250,-.05,0x7fa35a);
 // every floor sits at its own height so overlapping edges never flicker
 slab(g,6.6,19.4,44,118,.008,walk);slab(g,9.6,16.4,44,118,.016,asph);slab(g,6.6,19.4,142,170,.008,walk);slab(g,9.6,16.4,142,170,.016,asph);
 for(let z=46;z<122;z+=3)box(.14,.02,1.4,mat(0xf2efe6),13,.03,z,g);for(let z=140;z<170;z+=3)box(.14,.02,1.4,mat(0xf2efe6),13,.03,z,g);
 slab(g,-14,44,118,142,.012,0xd8cdb8);for(let x=-12;x<44;x+=4)for(let z=120;z<142;z+=4)if((x+z)%8===0)slab(g,x,x+2,z,z+2,.02,0xc9bda4);
 // fountain
 const f=new THREE.Group();f.position.set(13,0,130);g.add(f);cyl(2.4,.6,mat(0xcfc6b5,.6),0,.3,0,f);const w=cyl(2.15,.05,new THREE.MeshLambertMaterial({color:0x7cc4e6,transparent:true,opacity:.85}),0,.58,0,f);KEEP.add(w);cyl(.35,1.6,mat(0xcfc6b5,.6),0,1.2,0,f);ball(.6,mat(0xcfc6b5,.6),0,2.1,0,f);
 decorRounds.push({x:13,z:130,r:2.45,h:.62});
 // signs stand at the edges (high, facing the walker) so the follow camera never passes through them
 signBoard(g,'⛲ הכיכר',-3,3.6,119.2,0,4);signBoard(g,'🏖️ לחוף',19.3,3.4,137,-Math.PI/2,2.6);signBoard(g,'🏫 בית ספר',6.75,3.4,78.5,Math.PI/2,2.6);signBoard(g,'🌲 יער',19.25,3.4,86.5,-Math.PI/2,2.2);
 // street lamps + benches on the square
 for(const [x,z] of [[0,121],[26,121],[0,139],[26,139],[8,60],[18,100],[8,150],[18,165]]){cyl(.08,3.6,mat(0x3a3a3a),x,1.8,z,g);ball(.25,new THREE.MeshLambertMaterial({color:0xfff1c4,emissive:0xffe08a,emissiveIntensity:.5}),x,3.7,z,g)}
 for(const [x,z] of [[4,128],[22,128],[4,134],[22,134]]){box(2,.08,.6,mat(0x9c6b3e),x,.48,z,g);obstacles.push({name:'ספסל',x,z,w:2,d:.6,top:.52})}
 // the street's old dead end is now an open gateway: arch + sign, and a crossing
 {const a=new THREE.Group();a.position.set(13,0,45.5);g.add(a);const am=mat(0x3a7bd5,.6);for(const s of [-1,1])box(.5,5.2,.5,am,s*6.6,2.6,0,a);box(13.8,.9,.5,mat(0xf2c14e,.5),0,5.4,0,a);
  signBoard(g,'⬇️ לשכונה: בית ספר · יער · כיכר · חוף',13,5.4,45.2,0,12.6);const back=signBoard(g,'⬆️ לרחוב ולבית',13,5.4,45.8,Math.PI,8);}
 for(let i=0;i<6;i++)box(.42,.02,6.6,mat(0xf2efe6),9.9+i*1.2,.035,46,g)}
// ---------- school ----------
const SCH={bell:new THREE.Vector3(-26.4,2.4,85),teacher:null,kids:[],ball:null,goals:[62.6,107.4],notebook:null,recess:0};
{const g=ZG.school;slab(g,-50,5.6,56,114,0,0xb8b2a6);slab(g,-24,0,66,104,.012,0x6f9e57);
 for(const z of [66,104])box(24,.02,.12,mat(0xffffff),-12,.03,z,g);box(.12,.02,38,mat(0xffffff),-24,.03,85,g);box(.12,.02,38,mat(0xffffff),0,.03,85,g);box(24,.02,.12,mat(0xffffff),-12,.03,85,g);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(3,.06,6,30),mat(0xffffff));ring.rotation.x=Math.PI/2;ring.position.set(-12,.03,85);g.add(ring);
 for(const z of SCH.goals){const gg=new THREE.Group();gg.position.set(-12,0,z);g.add(gg);const wm=mat(0xf2f2f2,.4);for(const s of [-1,1])cyl(.08,2,wm,s*3,1,0,gg);const bar=cyl(.08,6.1,wm,0,2,0,gg);bar.rotation.z=Math.PI/2}
 // building
 const B=mat(0xe8d9bd,.9);box(20,7.2,46,B,-37,3.6,85,g);box(20.6,.5,46.6,mat(0xc0392b,.8),-37,7.4,85,g);
 for(let z=65;z<106;z+=4)for(const y of [2,5])box(.1,1.4,2.2,mat(0x7fa6b8,.3),-26.95,y,z,g);
 box(.2,3,3.4,mat(0x6b4a32),-26.9,1.5,85,g);signBoard(g,'🏫 בית ספר ניצנים',-26.8,6.2,85,-Math.PI/2,8);
 obstacles.push({name:'בית הספר',x:-37,z:85,w:20,d:46,top:7.4,solid:true});
 const bl=new THREE.Group();bl.position.copy(SCH.bell);g.add(bl);ball(.35,mat(0xf2c14e,.3),0,0,0,bl).scale.set(1,1.2,1);box(.4,.12,.4,mat(0x6b4a32),.2,.45,0,bl);SCH.bellG=bl;
 // fence along the road with a gate
 for(let z=57;z<114;z+=1.2)if(z<80||z>84.6)box(.08,1.2,.08,mat(0x5a5a5a),5.8,.6,z,g);box(.06,.06,57,mat(0x5a5a5a),5.8,1.15,85,g);
 // hoop + benches + trees
 cyl(.1,3.2,mat(0x5a5a5a),-2,1.6,110,g);box(1.2,.8,.06,mat(0xffffff),-2,3.2,109.6,g);const hr=new THREE.Mesh(new THREE.TorusGeometry(.32,.03,6,16),mat(0xe74c3c));hr.rotation.x=Math.PI/2;hr.position.set(-2,2.9,109.2);g.add(hr);
 for(const [x,z] of [[-4,60],[-18,60]]){box(2,.08,.6,mat(0x9c6b3e),x,.48,z,g);obstacles.push({name:'ספסל',x,z,w:2,d:.6,top:.52})}
 instanced(new THREE.ConeGeometry(1.3,3,7),mat(0x4f8a4a,.9),[[2,2.6,60,1],[2,2.6,112,1],[-48,2.6,58,1.2],[-48,2.6,112,1.1]],g);
 // the ball
 SCH.ball={g:ball(.3,mat(0xf2f2f2,.5),-12,.3,85,g),v:new THREE.Vector3(),home:new THREE.Vector3(-12,.3,85)};const pt=ball(.12,mat(0x222222),0,.22,0,SCH.ball.g);
 // Dani's notebook, somewhere in the yard
 SCH.notebook=new THREE.Group();g.add(SCH.notebook);box(.5,.06,.4,mat(0x3a7bd5,.6),0,.03,0,SCH.notebook);box(.46,.065,.36,mat(0xffffff,.8),0,.035,0,SCH.notebook);SCH.notebook.position.set(-6,0,70);
 // teacher + kids
 const T=makePerson({skin:0xe2b48c,shirt:0x8e44ad,dress:0x8e44ad,pants:0xe2b48c,shoes:0x333333,hair:h=>{const d=ball(.36,mat(0x3d2b1f),0,.12,-.05,h);d.scale.set(1,.85,1)}});T.g.position.set(-24.5,0,80);T.g.rotation.y=Math.PI/2;g.add(T.g);SCH.teacher=T;SCH.teacherB=makeBubble(T.g,3.1);
 const shirts=[0xe74c3c,0x3a7bd5,0xf2c14e,0x2fb34a,0xe98ab0];for(let i=0;i<5;i++){const K=makePerson({skin:[0xe2b48c,0xc68a62,0xf0c8a0,0x8d5a3b,0xd8a07a][i],shirt:shirts[i],pants:0x2c3e50,shoes:0xffffff,hair:h=>{const c=ball(.34,mat([0x2a2420,0xd9a867,0x3d2b1f,0x111111,0x7a4a2a][i]),0,.12,-.03,h);c.scale.set(1,.7,1)}});
  K.g.scale.setScalar(.66);K.g.position.set(-20+i*4,0,74+i*5);g.add(K.g);SCH.kids.push({P:K,tx:K.g.position.x,tz:K.g.position.z,t:0,b:makeBubble(K.g,2.2),five:false,cool:0})}}
// ---------- forest + stream ----------
const FOR={stones:[],frogs:[],squirrel:null,deer:null,camp:new THREE.Vector3(84,0,118),marsh:true,stoneHit:new Set(),stoneT:0};
{const g=ZG.forest;slab(g,20.6,112,54,118,0,0x5f8f45);slab(g,44,112,118,152,0,0x5f8f45);slab(g,20.6,44,142,152,0,0x5f8f45);
 // dirt trail from the gate to the camp
 const trail=[[20.6,90],[34,92],[44,100],[52,104],[64,108],[76,114],[84,118]];for(let i=0;i<trail.length-1;i++){const [x0,z0]=trail[i],[x1,z1]=trail[i+1];const len=Math.hypot(x1-x0,z1-z0);const m=box(len,.02,2.2,mat(0x9c7a4e,.95),(x0+x1)/2,.015,(z0+z1)/2,g);m.rotation.y=-Math.atan2(z1-z0,x1-x0)}
 // the stream: a ribbon that follows streamX
 {const pos=[],idx=[];for(let k=0;k<=98;k++){const z=54+k;const x=streamX(z);pos.push(x-2.2,.02,z,x+2.2,.02,z);if(k<98){const a=k*2;idx.push(a,a+2,a+1,a+1,a+2,a+3)}}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();const wm=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:0x5fb3d9,transparent:true,opacity:.88}));KEEP.add(wm);g.add(wm);FOR.water=wm}
 // bridge at z 72 and stepping stones at z 100
 const bx=streamX(72);// a low deck you walk straight across (no step to climb)
 box(6.4,.1,3,mat(0x8b5a3a),bx,.03,72,g);for(let i=-3;i<=3;i++)box(.08,.02,2.9,mat(0x6b4a32),bx+i*.9,.09,72,g);for(const s of [-1,1]){box(6.4,.12,.12,mat(0x6b4a32),bx,.7,72+s*1.45,g);for(const px of [-3,-1,1,3])box(.12,.7,.12,mat(0x6b4a32),bx+px,.35,72+s*1.45,g)}
 for(let i=0;i<5;i++){const x=streamX(100)-2.4+i*1.2,z=100+(i%2?.5:-.5);const s=cyl(.42,.4,mat(0x9a9a92,.9),x,.2,z,g);obstacles.push({name:'אבן',x,z,w:.8,d:.8,top:.4});FOR.stones.push({x,z})}
 // trees (instanced) keeping the trail, stream, camp and clearing free
 const trees=[];for(let n=0;n<1400&&trees.length<230;n++){const x=21+trnd()*90,z=55+trnd()*96;if(Math.abs(x-streamX(z))<4.5)continue;if(Math.hypot(x-FOR.camp.x,z-FOR.camp.z)<9)continue;if(Math.hypot(x-95,z-70)<8)continue;if(inRect(TOWN_AREAS.plaza,x,z,3))continue;
  let nearTrail=false;for(let i=0;i<trail.length-1;i++){const [x0,z0]=trail[i],[x1,z1]=trail[i+1];const t=Math.max(0,Math.min(1,((x-x0)*(x1-x0)+(z-z0)*(z1-z0))/((x1-x0)**2+(z1-z0)**2)));if(Math.hypot(x-(x0+(x1-x0)*t),z-(z0+(z1-z0)*t))<3)nearTrail=true}if(nearTrail||x<24)continue;trees.push([x,z,.8+trnd()*.8])}
 instanced(new THREE.CylinderGeometry(.2,.28,1.6,6),mat(0x6b4a2a),trees.map(([x,z,s])=>[x,.8*s,z,s]),g);instanced(new THREE.ConeGeometry(1.5,3.6,7),mat(0x3f7a3c,.9),trees.map(([x,z,s])=>[x,3*s,z,s,trnd()*3]),g);
 for(const [x,z,s] of trees)decorRounds.push({x,z,r:.32*s,h:9});FOR.trees=trees;
 // camp: tent, fire, logs, two campers and the marshmallows
 const c=FOR.camp;const tent=mesh(new THREE.ConeGeometry(2.2,2.6,4),mat(0xe67e22,.7),c.x+4,1.3,c.z-2,g);tent.rotation.y=Math.PI/4;obstacles.push({name:'אוהל',x:c.x+4,z:c.z-2,w:3,d:3,top:2.6,solid:true});
 for(let i=0;i<5;i++){const a=i/5*6.28;const l=cyl(.08,.9,mat(0x6b4a2a),c.x+Math.cos(a)*.35,.08,c.z+Math.sin(a)*.35,g);l.rotation.z=Math.PI/2;l.rotation.y=a}
 FOR.fire=new THREE.PointLight(0xff9a3c,.9,8);FOR.fire.position.set(c.x,1,c.z);g.add(FOR.fire);
 for(const [dx,dz] of [[-2.2,0],[2.2,.4]]){const l=cyl(.3,1.8,mat(0x7a5428),c.x+dx,.3,c.z+dz,g);l.rotation.x=Math.PI/2;obstacles.push({name:'בול עץ',x:c.x+dx,z:c.z+dz,w:.6,d:1.8,top:.55})}
 FOR.campers=[0xd8a07a,0x8d5a3b].map((sk,i)=>{const P=makePerson({skin:sk,shirt:i?0x2fb34a:0x3a7bd5,pants:0x5a4a3a,hair:h=>{cyl(.36,.14,mat(i?0xc0392b:0xf2c14e),0,.22,0,h)}});P.g.position.set(c.x+(i?2.2:-2.2),0,c.z+(i?.4:0)+(i?0:0));P.g.rotation.y=i?-Math.PI/2:Math.PI/2;P.g.position.y=-.1;g.add(P.g);P.legs.forEach(l=>l.rotation.x=-1.45);return {P,b:makeBubble(P.g,2.9)}});
 FOR.marshG=new THREE.Group();FOR.marshG.position.set(c.x-.9,.0,c.z-1.6);g.add(FOR.marshG);box(.5,.4,.3,mat(0xf5f0e6,.8),0,.2,0,FOR.marshG);for(let i=0;i<3;i++)cyl(.09,.12,mat(0xffffff,.9),-.12+i*.12,.47,0,FOR.marshG);
 signBoard(g,'🔥 מחנה צופים',c.x+7,3.2,c.z-7,0,3.6);
 // frogs on the banks, a squirrel, a deer in the clearing
 for(let i=0;i<3;i++){const z=80+i*16,x=streamX(z)+(i%2?2.8:-2.8);const fg=new THREE.Group();fg.position.set(x,0,z);g.add(fg);const b=ball(.18,mat(0x4caf50,.7),0,.15,0,fg);b.scale.set(1.2,.7,1.3);for(const s of [-1,1])ball(.05,mat(0x111111),s*.08,.27,.12,fg);FOR.frogs.push({g:fg,home:fg.position.clone(),hop:0,done:false})}
 {const sq=new THREE.Group();g.add(sq);const fm=mat(0xb5652b,.8);const b=ball(.18,fm,0,.2,0,sq);b.scale.set(.9,1,1.3);ball(.12,fm,0,.32,.18,sq);const t=ball(.16,fm,0,.38,-.22,sq);t.scale.set(.8,1.6,.8);FOR.squirrel={g:sq,tree:0,state:'ground',t:0,climb:0};sq.position.set(40,0,100)}
 {const dg=new THREE.Group();g.add(dg);const dm=mat(0xa86b3d,.8);const b=ball(.5,dm,0,1.3,0,dg);b.scale.set(.7,.7,1.5);const n=ball(.25,dm,0,1.95,.7,dg);n.scale.set(.8,1,1.3);for(const [x,z] of [[.25,.5],[-.25,.5],[.25,-.5],[-.25,-.5]])cyl(.06,1.1,mat(0x6b4a2a),x,.55,z,dg);for(const s of [-1,1]){const a=cyl(.03,.5,mat(0x5a3a1a),s*.15,2.35,.62,dg);a.rotation.z=s*.5}
  dg.position.set(95,0,70);FOR.deer={g:dg,state:'graze',t:0,cool:0}}}
// ---------- beach + promenade ----------
const BCH={castle:null,castleUp:true,castleT:0,crab:null,buoy:new THREE.Vector3(20,0,231),dig:new THREE.Vector3(46,0,203),digs:0,stall:new THREE.Vector3(28,0,173.6),gulls:[],cone:null,ice:0,iceRun:0};
{const g=ZG.beach;slab(g,-60,84,170,177,.004,0xd9cdb5);slab(g,-60,84,177,214,0,0xf0dca8);
 const sea=new THREE.Mesh(new THREE.PlaneGeometry(300,210,60,30),new THREE.MeshLambertMaterial({color:0x4fa3d1,transparent:true,opacity:.92}));sea.rotation.x=-Math.PI/2;sea.position.set(12,.06,318);KEEP.add(sea);g.add(sea);BCH.sea=sea;
 const foam=new THREE.Mesh(new THREE.PlaneGeometry(144,1.4),new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:.7}));foam.rotation.x=-Math.PI/2;foam.position.set(12,.08,214);KEEP.add(foam);g.add(foam);BCH.foam=foam;
 // palms along the promenade
 const palms=[];for(let x=-56;x<84;x+=9)palms.push([x,0,176]);instanced(new THREE.CylinderGeometry(.18,.26,4.2,6),mat(0x8b6a43),palms.map(([x,,z])=>[x,2.1,z,1]),g);
 instanced(new THREE.ConeGeometry(1.9,1.1,6),mat(0x3f8f45,.8),palms.map(([x,,z])=>[x,4.4,z,1,trnd()*2]),g);for(const [x,,z] of palms)decorRounds.push({x,z,r:.3,h:9});
 // umbrellas and towels
 for(const [x,z,c] of [[-30,190,0xe74c3c],[-12,198,0x3a7bd5],[8,186,0xf2c14e],[32,194,0x2fb34a],[56,188,0xe98ab0],[70,200,0xe67e22]]){cyl(.05,2.4,mat(0xffffff),x,1.2,z,g);const u=mesh(new THREE.ConeGeometry(1.6,.6,10),mat(c,.7),x,2.5,z,g);box(1,.02,2,mat(c,.8),x+1.4,.02,z,g)}
 // ice-cream stall
 const st=new THREE.Group();st.position.copy(BCH.stall);g.add(st);box(3,1,1.3,mat(0xf6f6f2,.5),0,.5,0,st);box(3.3,.12,1.6,mat(0xe98ab0,.6),0,2.4,0,st);for(const s of [-1,1])cyl(.05,1.4,mat(0xcccccc),s*1.4,1.7,.6,st);
 signBoard(g,'🍦 גלידה של שוקי',BCH.stall.x,2.95,BCH.stall.z+.8,Math.PI,3);obstacles.push({name:'דוכן גלידה',x:BCH.stall.x,z:BCH.stall.z,w:3,d:1.3,top:1.02,solid:true});
 const V2=makePerson({skin:0xc99067,shirt:0xffffff,pants:0x3a3a3a,belly:true,hair:h=>{cyl(.3,.32,mat(0xffffff),0,.32,0,h)}});V2.g.position.set(BCH.stall.x,0,BCH.stall.z-1.2);g.add(V2.g);BCH.vendor=V2;BCH.vendorB=makeBubble(V2.g,3.1);
 // sandcastle
 const cs=new THREE.Group();cs.position.set(0,0,193);g.add(cs);const sm=mat(0xe2c27a,.95);box(1.6,.6,1.6,sm,0,.3,0,cs);for(const [x,z] of [[-.7,-.7],[.7,-.7],[-.7,.7],[.7,.7]])cyl(.25,1,sm,x,.5,z,cs);cyl(.35,1.2,sm,0,.9,0,cs);BCH.castle=cs;
 // lifeguard tower + buoy + the X that marks the spot
 const lt=new THREE.Group();lt.position.set(40,0,208);g.add(lt);for(const [x,z] of [[-.8,-.8],[.8,-.8],[-.8,.8],[.8,.8]])cyl(.08,2.6,mat(0xf6f6f2),x,1.3,z,lt);box(2.2,1.2,2.2,mat(0xe74c3c,.7),0,3.2,0,lt);signBoard(g,'🛟 מציל',40,4.2,206.85,0,2);
 const by=new THREE.Group();by.position.copy(BCH.buoy);g.add(by);ball(.5,mat(0xe74c3c,.5),0,.3,0,by);ball(.52,mat(0xffffff,.5),0,.3,0,by).scale.set(1,.3,1);BCH.buoyG=by;
 for(const r of [.6,-.6]){const x=box(1.4,.02,.18,mat(0xc0392b),BCH.dig.x,.03,BCH.dig.z,g);x.rotation.y=r}
 BCH.chest=new THREE.Group();BCH.chest.position.copy(BCH.dig);BCH.chest.visible=false;g.add(BCH.chest);box(.8,.5,.55,mat(0x8b5a3a),0,.25,0,BCH.chest);box(.82,.12,.57,mat(0xf2c14e,.3),0,.5,0,BCH.chest);
 // crab and seagulls
 {const cr=new THREE.Group();g.add(cr);const cm=mat(0xe2552d,.6);const b=ball(.26,cm,0,.15,0,cr);b.scale.set(1.3,.5,1);for(const s of [-1,1]){ball(.1,cm,s*.38,.18,.15,cr);ball(.04,mat(0x111111),s*.08,.3,.15,cr)}BCH.crab={g:cr,t:0,dir:1,flee:0};cr.position.set(-20,0,200)}
 for(let i=0;i<4;i++){const gg=new THREE.Group();g.add(gg);const wm=mat(0xf6f6f2,.6);const b=ball(.18,wm,0,0,0,gg);b.scale.set(.8,.8,1.4);ball(.1,wm,0,.08,.22,gg);box(.05,.03,.12,mat(0xf2a030),0,.06,.34,gg);const ws=[-1,1].map(s=>{const w=new THREE.Group();w.position.set(s*.12,.05,0);gg.add(w);box(.5,.02,.18,mat(0xdddddd,.6),s*.25,0,0,w);return w});BCH.gulls.push({g:gg,ws,a:i*1.57,r:8+i*2,h:6+i*.6,c:new THREE.Vector3(10+i*8,0,195),mode:'circle'})}
 // the ice-cream cone Milky carries
 BCH.cone=new THREE.Group();BCH.cone.position.set(0,-.18,.66);headPivot.add(BCH.cone);mesh(new THREE.ConeGeometry(.1,.3,8),mat(0xd9a867),0,-.05,0,BCH.cone).rotation.x=Math.PI;ball(.12,mat(0xf3c1d6,.6),0,.14,0,BCH.cone);BCH.cone.visible=false;
 signBoard(g,'🏖️ חוף ברדק',-1,3.6,171.5,0,4.5)}
// ---------- side missions (they join the open-world ❗ list) ----------
const TOWN_CH=[['schoolGoal','⚽ להבקיע גול בחצר בית הספר'],['schoolBell','🔔 לצלצל בפעמון בית הספר'],['schoolHomework','📒 להחזיר למורה את המחברת של דני'],['schoolKids','🧒 לתת כיף ל־4 ילדים'],
 ['forestStones','🪨 לחצות את הנחל על האבנים'],['forestSquirrel','🐿️ לתפוס את הסנאי לפני שהוא מטפס'],['forestMarsh','🍡 לגנוב מרשמלו מהמחנה'],['forestFrogs','🐸 להקפיץ 3 צפרדעים לנחל'],['forestDeer','🦌 להתגנב לאיילה בלי לרוץ'],
 ['beachIce','🍦 לגנוב גלידה ולברוח מהשחפים'],['beachCastle','🏰 להפיל את ארמון החול'],['beachBuoy','🛟 לשחות עד המצוף'],['beachCrab','🦀 לתפוס את הסרטן'],['beachDig','🐾 לחפור מטמון ב־X']];
for(const c of TOWN_CH)challengeDefs.push(c);if(typeof renderChallenges==='function')renderChallenges();
Object.assign(SIDE_POS,{schoolGoal:()=>SCH.ball.g.position,schoolBell:()=>V(SCH.bell.x+1,1,SCH.bell.z),schoolHomework:()=>SCH.carry?SCH.teacher.g.position:SCH.notebook.position,schoolKids:()=>{const k=SCH.kids.find(k=>!k.five);return k?k.P.g.position:null},
 forestStones:()=>V(FOR.stones[0].x,.6,FOR.stones[0].z),forestSquirrel:()=>FOR.squirrel.g.position,forestMarsh:()=>FOR.marshG.position,forestFrogs:()=>{const f=FOR.frogs.find(f=>!f.done);return f?f.g.position:null},forestDeer:()=>FOR.deer.g.position,
 beachIce:()=>V(BCH.stall.x,1,BCH.stall.z+1.4),beachCastle:()=>BCH.castle.position,beachBuoy:()=>BCH.buoy,beachCrab:()=>BCH.crab.g.position,beachDig:()=>BCH.dig});
const townCC=id=>{if(!challengesDone.has(id)){completeChallenge(id);addScore(300,'משימת צד!')}};
// ---------- context actions ----------
CTX_HOOKS.act.unshift(()=>{if(!window.TOWN_READY||specialMode()||DRIVE.on)return null;const z=TOWN.zone;
 if(z==='school'){if(Math.hypot(pos.x-SCH.bell.x,pos.z-SCH.bell.z)<2.4)return {i:'🔔',l:'לצלצל!',on:1,fn:schoolBell};
  if(!SCH.carry&&SCH.notebook.visible&&Math.hypot(pos.x-SCH.notebook.position.x,pos.z-SCH.notebook.position.z)<1.6)return {i:'📒',l:'מחברת של דני',on:1,fn:()=>{SCH.carry=true;SCH.notebook.visible=false;milkyThought('📒',1.4,true);sayText(SCH.teacherB,'מילקי! זו המחברת של דני? תביא לי אותה!',2.2,'say',true)}};
  if(SCH.carry&&Math.hypot(pos.x-SCH.teacher.g.position.x,pos.z-SCH.teacher.g.position.z)<2.2)return {i:'📒',l:'לתת למורה',on:1,fn:()=>{SCH.carry=false;sayText(SCH.teacherB,'תודה מילקי! דני, הכלב שלך מכין שיעורים יותר טוב ממך!',2.6,'say',true);townCC('schoolHomework');setTimeout(()=>{SCH.notebook.visible=true;SCH.notebook.position.set(-30+Math.random()*28,0,60+Math.random()*50);if(SCH.notebook.position.x<-26.5)SCH.notebook.position.x=-20},20000)}};
  const k=SCH.kids.find(k=>k.cool<=0&&Math.hypot(pos.x-k.P.g.position.x,pos.z-k.P.g.position.z)<1.8);if(k)return {i:'🖐️',l:'כיף!',on:1,fn:()=>{k.cool=4;if(!k.five){k.five=true}sayText(k.b,pick(['כיף!!! 🖐️','איזה כלב חמוד!','מילקי!!!','עוד פעם!']),1.4,'say',true);playToySound(700,.06,'triangle');if(SCH.kids.filter(k=>k.five).length>=4)townCC('schoolKids')}}}
 if(z==='forest'){if(FOR.marsh&&Math.hypot(pos.x-FOR.marshG.position.x,pos.z-FOR.marshG.position.z)<1.6)return {i:'🍡',l:'מרשמלו!',on:1,fn:()=>{FOR.marsh=false;FOR.marshG.visible=false;milkyThought('😋',1.4,true);sayText(FOR.campers[0].b,'הכלב לקח את המרשמלו!!!',2,'say',true);sayText(FOR.campers[1].b,'חחח! לפחות הוא לא שרף אותו',2.2,'say',true);townCC('forestMarsh');setTimeout(()=>{FOR.marsh=true;FOR.marshG.visible=true},30000)}}}
 if(z==='beach'){if(!BCH.ice&&Math.hypot(pos.x-BCH.stall.x,pos.z-BCH.stall.z-1.4)<2)return {i:'🍦',l:'לגנוב גלידה',on:1,fn:()=>{BCH.ice=1;BCH.iceRun=0;BCH.cone.visible=true;sayText(BCH.vendorB,'היי!!! הכלב לקח לי ותוסיל!!!',2,'say',true);showBanner('🍦 רוץ! השחפים באים!');for(const gu of BCH.gulls)gu.mode='chase'}};
  if(Math.hypot(pos.x-BCH.dig.x,pos.z-BCH.dig.z)<1.6&&!BCH.chest.visible)return {i:'🐾',l:'לחפור ('+BCH.digs+'/4)',on:1,fn:()=>{BCH.digs++;for(let i=0;i<10;i++)emit(BCH.dig.x,.3,BCH.dig.z,(Math.random()-.5)*3,2+Math.random()*2,(Math.random()-.5)*3,'dust',.8);playToySound(220,.06,'square');
   if(BCH.digs>=4){BCH.chest.visible=true;BCH.digs=0;townCC('beachDig');showBanner('💰 מטמון! (בפנים... עוד עצם 🦴)');addScore(500,'מטמון!');setTimeout(()=>{BCH.chest.visible=false},25000)}}}}
 return null});
function schoolBell(){if(SCH.recess>0)return;SCH.recess=14;playToySound(980,.5,'sine');setTimeout(()=>playToySound(980,.5,'sine'),600);showBanner('🔔 הפסקה!!!');townCC('schoolBell');sayText(SCH.teacherB,'מי צלצל?! זה עוד לא הזמן!',2,'say',true);
 for(const k of SCH.kids)sayText(k.b,pick(['הפסקה!!!','יששש!','מילקי צלצל!','כדורגל!!!']),1.6,'say',true);SCH.bellG.rotation.z=.6}
// ---------- per-frame: only the area you're in (and its neighbours) ----------
const TOWN={zone:'home',lastZone:'home',t:0};
const _wv=new THREE.Vector3();
function townStep(dt){const t=performance.now()/1000;
 // stream areas in and out by distance
 const near=(r,m)=>inRect(r,pos.x,pos.z,m);
 ZG.roads.visible=pos.z>20||inTown(pos.x,pos.z);ZG.school.visible=near(TOWN_AREAS.school,55);ZG.forest.visible=near(TOWN_AREAS.forest,55);ZG.beach.visible=near(TOWN_AREAS.beach,70);
 const z=zoneAt(pos.x,pos.z);TOWN.zone=z;
 if(z!==TOWN.lastZone){TOWN.lastZone=z;const Z=ZONES.find(Z=>Z.id===z);if(Z&&!specialMode()){showBanner(Z.icon+' '+Z.name);if(!save.town.visited.includes(z)){save.town.visited.push(z);writeSave();addActivity('🗺️ גילית מקום חדש: '+Z.name)}}}
 if(ZG.school.visible)schoolStep(dt,t);if(ZG.forest.visible)forestStep(dt,t);if(ZG.beach.visible)beachStep(dt,t)}
function schoolStep(dt,t){const B=SCH.ball;
 // kids wander; at recess they run around after the ball; near Milky they get excited
 SCH.recess=Math.max(0,SCH.recess-dt);SCH.bellG.rotation.z*=.95;
 for(const k of SCH.kids){k.cool=Math.max(0,k.cool-dt);const o=k.P.g.position;const dm=Math.hypot(pos.x-o.x,pos.z-o.z);let tx=k.tx,tz=k.tz,sp=1.2;
  if(SCH.recess>0){tx=B.g.position.x+(Math.sin(t+o.x)*2);tz=B.g.position.z+(Math.cos(t*1.3+o.z)*2);sp=2.6}else if(dm<5&&!specialMode()){tx=pos.x;tz=pos.z;sp=1.8;if(Math.random()<dt*.2)sayText(k.b,pick(['כלבלב!','איזה חמוד!','בוא לפה!','מילקי!']),1.4,'say')}
  else if(Math.hypot(tx-o.x,tz-o.z)<.5){k.tx=-22+Math.random()*20;k.tz=62+Math.random()*48}
  const dx=tx-o.x,dz=tz-o.z,d=Math.hypot(dx,dz);let step=0;if(d>(dm<5?1.3:.4)){step=Math.min(d,sp*dt);o.x+=dx/d*step;o.z+=dz/d*step;k.P.g.rotation.y=Math.atan2(dx,dz)}
  o.x=Math.max(-25.5,Math.min(4.5,o.x));o.z=Math.max(57,Math.min(113,o.z));
  // kids kick the ball when they reach it
  if(Math.hypot(B.g.position.x-o.x,B.g.position.z-o.z)<.7&&B.v.length()<1){const a=Math.random()*6.28;B.v.set(Math.cos(a)*5,0,Math.sin(a)*5)}
  animatePerson(k.P,step,dt,{run:sp>2})}
 // the ball: Milky kicks it by running into it
 const bp=B.g.position,dm=Math.hypot(pos.x-bp.x,pos.z-bp.z);if(dm<.8&&jumpY<.6){const k=Math.max(4,lastDogSpeed*1.6);B.v.set(Math.sin(yaw)*k,0,Math.cos(yaw)*k);playToySound(260,.06,'triangle')}
 bp.x+=B.v.x*dt;bp.z+=B.v.z*dt;B.v.multiplyScalar(Math.max(0,1-dt*.9));B.g.rotation.x+=B.v.z*dt*3;B.g.rotation.z-=B.v.x*dt*3;
 if(bp.x<-25.7||bp.x>5){B.v.x*=-.7;bp.x=Math.max(-25.7,Math.min(5,bp.x))}if(bp.z<56.6||bp.z>113.4){B.v.z*=-.7;bp.z=Math.max(56.6,Math.min(113.4,bp.z))}
 for(const gz of SCH.goals){if(Math.abs(bp.x+12)<2.9&&Math.abs(bp.z-gz)<.6&&B.v.length()>1.5){townCC('schoolGoal');showBanner('⚽ גוללללל!!!');for(const k of SCH.kids)sayText(k.b,pick(['גול!!!','מילקי מלך!','שוב! שוב!']),1.6,'say',true);if(window.JUICE_READY)pow('גול!!!',bp.x,1.6,bp.z,true);bp.copy(B.home);B.v.set(0,0,0)}}
 animatePerson(SCH.teacher,0,dt,{arm:i=>i===0?-.4:0})}
function forestStep(dt,t){
 // water ripples
 // stones: hop across all five (on top of them) within 12 seconds
 FOR.stoneT=Math.max(0,FOR.stoneT-dt);if(FOR.stoneT===0)FOR.stoneHit.clear();
 FOR.stones.forEach((s,i)=>{if(jumpY>.3&&Math.hypot(pos.x-s.x,pos.z-s.z)<.55){if(!FOR.stoneHit.has(i)){FOR.stoneHit.add(i);FOR.stoneT=12;playToySound(400+i*80,.06,'triangle');if(FOR.stoneHit.size>=5)townCC('forestStones')}}});
 if(townWater(pos.x,pos.z)&&FOR.stoneHit.size&&jumpY<.1)FOR.stoneHit.clear();
 // squirrel: darts between trees, climbs when Milky gets close
 const S=FOR.squirrel,so=S.g.position,ds=Math.hypot(pos.x-so.x,pos.z-so.z);
 if(S.state==='ground'){if(!S.target||Math.hypot(S.target[0]-so.x,S.target[1]-so.z)<.4){const tr=pick(FOR.trees.filter(([x,z])=>Math.abs(x-so.x)<14&&Math.abs(z-so.z)<14))||FOR.trees[0];S.target=[tr[0]+.5,tr[1]]}
  const sp=ds<5?4.2:1.4;const dx=S.target[0]-so.x,dz=S.target[1]-so.z,d=Math.hypot(dx,dz);if(d>.05){so.x+=dx/d*Math.min(d,sp*dt);so.z+=dz/d*Math.min(d,sp*dt);S.g.rotation.y=Math.atan2(dx,dz)}
  so.y=Math.abs(Math.sin(t*14))*.06;if(ds<.9&&jumpY<.8){townCC('forestSquirrel');showBanner('🐿️ תפסת את הסנאי! (הוא נעלב)');S.state='climb';S.climb=0}
  else if(ds<2.2&&d<.6){S.state='climb';S.climb=0}}
 else{S.climb+=dt;so.y=Math.min(4,S.climb*3);if(S.climb>6){S.state='ground';so.y=0;S.target=null}}
 // frogs: hop into the stream when Milky gets near
 for(const f of FOR.frogs){const o=f.g.position;if(f.hop>0){f.hop-=dt;const k=1-f.hop/.8;o.x=f.from.x+(streamX(o.z)-f.from.x)*k;o.y=Math.sin(k*Math.PI)*1.2;if(f.hop<=0){o.y=0;emit(o.x,.2,o.z,0,2,0,'water',.6);f.g.visible=false;setTimeout(()=>{f.g.visible=true;o.copy(f.home)},12000)}continue}
  if(f.g.visible&&Math.hypot(pos.x-o.x,pos.z-o.z)<1.6){f.hop=.8;f.from=o.clone();playToySound(300,.08,'square');if(!f.done){f.done=true;if(FOR.frogs.every(f=>f.done))townCC('forestFrogs')}}}
 // deer: walk up slowly. If Milky runs nearby it bolts
 const D=FOR.deer,dd=Math.hypot(pos.x-D.g.position.x,pos.z-D.g.position.z);D.cool=Math.max(0,D.cool-dt);
 if(D.state==='graze'){D.g.children[1].position.y=1.95-Math.abs(Math.sin(t*.8))*.5;if(dd<9&&lastDogSpeed>3.6){D.state='flee';D.t=0;showBanner('🦌 היא שמעה אותך רץ... תתקרב לאט!')}else if(dd<2.6&&D.cool<=0){D.cool=20;townCC('forestDeer');showBanner('🦌 היא נתנה לך ללקק לה את האף!');milkyThought('🥰',1.6,true)}}
 else{D.t+=dt;const a=Math.atan2(D.g.position.x-pos.x,D.g.position.z-pos.z);if(D.t<2.5){D.g.position.x+=Math.sin(a)*6*dt;D.g.position.z+=Math.cos(a)*6*dt;D.g.rotation.y=a}else if(D.t>9){D.state='graze';D.g.position.set(95,0,70)}}
 // campfire flicker + campers
 FOR.fire.intensity=.8+Math.sin(t*17)*.15+Math.sin(t*7)*.1;if(Math.random()<.5)emit(FOR.camp.x+(Math.random()-.5)*.4,.4,FOR.camp.z+(Math.random()-.5)*.4,(Math.random()-.5)*.3,1.2,(Math.random()-.5)*.3,'smoke',1);
 for(const c of FOR.campers)animatePerson(c.P,0,dt,{arm:i=>-.9+Math.sin(t*2+i)*.1})}
function beachStep(dt,t){
 // waves on the sea, foam moving in and out
 BCH.foam.position.z=214+Math.sin(t*.8)*.8;BCH.sea.position.y=.05+Math.sin(t*.9)*.03;
 // sandcastle: run into it
 const c=BCH.castle;if(BCH.castleUp){if(Math.hypot(pos.x-c.position.x,pos.z-c.position.z)<1.4&&lastDogSpeed>2.5){BCH.castleUp=false;BCH.castleT=0;townCC('beachCastle');for(let i=0;i<20;i++)emit(c.position.x,.6,c.position.z,(Math.random()-.5)*4,2+Math.random()*2,(Math.random()-.5)*4,'dust',.9);playToySound(150,.12,'square');sayText(milkyB,'😅 ...אופס',1.4,'say',true)}}
 else{BCH.castleT+=dt;c.scale.y=Math.max(.15,1-BCH.castleT*3);if(BCH.castleT>30){BCH.castleUp=true;c.scale.y=1}}
 // buoy bobbing; reach it
 BCH.buoyG.position.y=Math.sin(t*1.6)*.12;if(Math.hypot(pos.x-BCH.buoy.x,pos.z-BCH.buoy.z)<1.8){townCC('beachBuoy')}
 // crab: scuttles sideways, faster when Milky is close
 const C=BCH.crab,co=C.g.position,dc=Math.hypot(pos.x-co.x,pos.z-co.z);C.t-=dt;if(C.t<=0){C.t=1+Math.random()*1.5;C.dir=Math.random()<.5?-1:1}
 const sp=dc<4?3.3:.9;let ax=dc<4?Math.sign(co.x-pos.x||1):C.dir;co.x+=ax*sp*dt;co.z+=Math.sin(t*3+co.x)*sp*.4*dt;co.x=Math.max(-56,Math.min(80,co.x));co.z=Math.max(180,Math.min(212,co.z));C.g.rotation.z=Math.sin(t*20)*.08;
 if(dc<.8&&jumpY<.6){townCC('beachCrab');sayText(milkyB,'🦀 אאוץ׳! הוא צבט לי את האף!',1.8,'say',true);co.set(-20+Math.random()*40,0,186+Math.random()*20)}
 // seagulls circle; when Milky has ice cream they dive for it
 if(BCH.ice){BCH.iceRun+=lastDogSpeed>3.5?dt:0;const g0=BCH.gulls[0].g.position;if(BCH.iceRun>=8){BCH.ice=0;BCH.cone.visible=false;townCC('beachIce');sayText(milkyB,'😋 ניצחתי את השחפים!',1.8,'say',true);for(const gu of BCH.gulls)gu.mode='circle'}
  else if(lastDogSpeed<2&&Math.hypot(g0.x-pos.x,g0.z-pos.z)<1.6){BCH.ice=0;BCH.cone.visible=false;showBanner('🐦 שחף גנב לך את הגלידה! (תמשיך לרוץ בפעם הבאה)');for(const gu of BCH.gulls)gu.mode='circle'}}
 BCH.gulls.forEach((gu,i)=>{const o=gu.g.position;if(gu.mode==='chase'){_wv.set(pos.x+Math.sin(t*3+i)*1.5,1.6+i*.3,pos.z+Math.cos(t*3+i)*1.5);o.lerp(_wv,Math.min(1,dt*(1.4+i*.3)))}
  else{gu.a+=dt*.5;_wv.set(gu.c.x+Math.cos(gu.a)*gu.r,gu.h,gu.c.z+Math.sin(gu.a)*gu.r);o.lerp(_wv,Math.min(1,dt*2))}gu.g.rotation.y=gu.mode==='chase'?Math.atan2(pos.x-o.x,pos.z-o.z):-gu.a;gu.ws.forEach((w,k)=>w.rotation.z=(k?-1:1)*Math.sin(t*9+i)*.6)});
 animatePerson(BCH.vendor,0,dt,{arm:i=>i===0?-1.2+Math.sin(t*4)*.2:-.2})}
// ---------- the kart: drive anywhere outdoors ----------
const DRIVE={on:false,K:null,parked:false};
DRIVE.K=makeKart(0xe0b062,d=>{const {g}=cloneMilky();g.scale.setScalar(.72);g.position.set(0,-.7,-.25);d.add(g)});scene.add(DRIVE.K.g);DRIVE.K.g.visible=false;
const driveOK=(x,z)=>{if(x>-6.6&&x<6.6&&z>-9.2&&z<16.2)return false;if(x>20&&z>-.2&&z<40.2)return false;if(!walkable(x,z,1.05))return false;
 for(const o of obstacles){if(o.top<.45&&!o.solid)continue;if(Math.abs(x-o.x)<o.w/2+1&&Math.abs(z-o.z)<o.d/2+1)return false}for(const c of decorRounds)if(c.h>1&&Math.hypot(x-c.x,z-c.z)<c.r+.9)return false;return true};
function driveStart(){if(DRIVE.on||specialMode())return;const K=DRIVE.K;
 if(!DRIVE.parked||Math.hypot(K.x-pos.x,K.z-pos.z)>3){if(!driveOK(pos.x,pos.z)){showBanner('🚗 אי אפשר לנהוג כאן. צא החוצה לרחוב או לשכונה');return}K.x=pos.x;K.z=pos.z;K.h=yaw;K.v=0;K.y=0;K.vy=0}
 DRIVE.on=true;DRIVE.parked=true;K.g.visible=true;dog.visible=false;document.body.classList.add('racePlay');raceButtonsDrive(true);RS.snap=true;showBanner('🚗 נוהגים! ג׳ויסטיק = גז והגה · 🌀 דריפט · ⚡ ניטרו')}
function driveStop(){if(!DRIVE.on)return;const K=DRIVE.K;DRIVE.on=false;document.body.classList.remove('racePlay');raceButtonsDrive(false);
 let x=K.x+Math.cos(K.h)*1.8,z=K.z-Math.sin(K.h)*1.8;if(!walkable(x,z,.45)){x=K.x-Math.cos(K.h)*1.8;z=K.z+Math.sin(K.h)*1.8}if(!walkable(x,z,.45))[x,z]=nearestWalkable(K.x,K.z,.45);pos.set(x,0,z);yaw=K.h;camYaw=K.h;jumpY=0;dog.visible=true;K.v=0}
function raceButtonsDrive(on){const jb=document.getElementById('jumpBtn'),rb=document.querySelector('#big [data-key="ShiftLeft"]');if(!jb||!rb)return;jb.querySelector('b').textContent=on?'🌀':'🐾';jb.querySelector('small').textContent=on?'דריפט':'קפיצה';rb.querySelector('small').textContent=on?'ניטרו':'ריצה'}
const DRV_D={max:21,acc:12,turn:1.9,grip:1,special:'none'};
function driveStep(dt){const K=DRIVE.K,inp=rInput();K.nitroOn=inp.nitro&&K.nitro>.02;if(K.nitroOn)K.nitro=Math.max(0,K.nitro-dt*.45);else K.nitro=Math.min(1,K.nitro+dt*.04);
 const ox=K.x,oz=K.z;const boost=K.boostT>0||K.nitroOn;let max=DRV_D.max*(boost?1.35:1)*(townWater(K.x,K.z)?.5:1);
 if(inp.thr>0)K.v+=DRV_D.acc*inp.thr*dt*(K.v<max?1:0);else if(inp.thr<0)K.v-=(K.v>0?24:8)*-inp.thr*dt;K.v-=K.v*.25*dt;if(K.v>max)K.v+=(max-K.v)*Math.min(1,dt*2.5);K.v=Math.max(-6,K.v);
 const sp=Math.abs(K.v),tf=Math.min(1,sp/8)*(K.v<0?-1:1);
 if(inp.drift&&sp>9&&Math.abs(inp.st)>.15){if(!K.driftOn){K.driftOn=true;K.driftDir=Math.sign(inp.st);K.driftCharge=0}}else if(K.driftOn&&(!inp.drift||sp<7)){K.driftOn=false;if(K.driftCharge>.7)K.boostT=.5+Math.min(1,K.driftCharge)*.4}
 if(K.driftOn){K.driftCharge+=dt;K.h+=(K.driftDir*.55+inp.st*.5)*DRV_D.turn*1.4*tf*dt;emit(K.x-Math.sin(K.h)*1.4,.2,K.z-Math.cos(K.h)*1.4,(Math.random()-.5),.6,(Math.random()-.5),'dust',.5)}else K.h+=inp.st*DRV_D.turn*tf*dt;
 K.boostT=Math.max(0,K.boostT-dt);
 const nx=K.x+Math.sin(K.h)*K.v*dt,nz=K.z+Math.cos(K.h)*K.v*dt;
 if(driveOK(nx,K.z))K.x=nx;else{K.v*=-.3;if(sp>8){chaosShake=Math.max(chaosShake,.25);playToySound(140,.08,'square')}}
 if(driveOK(K.x,nz))K.z=nz;else{K.v*=-.3}
 if(townWater(K.x,K.z)&&sp>3&&Math.random()<.6)emit(K.x+(Math.random()-.5),.2,K.z+(Math.random()-.5),(Math.random()-.5)*2,2,(Math.random()-.5)*2,'water',.6);
 K.tilt.rotation.y+=((K.driftOn?K.driftDir*.45:0)-K.tilt.rotation.y)*Math.min(1,dt*8);kartVisual(K,dt)}
// ---------- the map ----------
const mapEl=document.createElement('div');mapEl.id='townMap';mapEl.className='modal';mapEl.hidden=true;
mapEl.innerHTML='<div class="modalCard" style="max-width:520px;padding:12px"><h1 style="margin:2px 0 6px">🗺️ השכונה של מילקי</h1><canvas id="tmCanvas" width="460" height="560" style="width:100%;max-height:62vh;border-radius:12px;background:#4fa3d1"></canvas><div id="tmTravel" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:8px 0"></div><div class="modalBtns"><button id="tmClose" type="button">✖ סגור</button></div></div>';
document.body.appendChild(mapEl);
const MAPB={x0:-64,x1:116,z0:-62,z1:240};
function drawMap(){const cv=document.getElementById('tmCanvas'),q=cv.getContext('2d');const W=cv.width,H=cv.height,s=Math.min(W/(MAPB.x1-MAPB.x0),H/(MAPB.z1-MAPB.z0));
 const X=x=>(MAPB.x1-x)*s,Y=z=>(z-MAPB.z0)*s; // east on the left like a map seen from the house facing the street… keep the street on the right: mirror x
 q.fillStyle='#4fa3d1';q.fillRect(0,0,W,H);
 const rect=(r,c)=>{q.fillStyle=c;q.fillRect(Math.min(X(r.x0),X(r.x1)),Y(r.z0),Math.abs(X(r.x1)-X(r.x0)),Y(r.z1)-Y(r.z0))};
 rect({x0:-64,x1:116,z0:-62,z1:214},'#7fae5a');
 rect({x0:-20,x1:20,z0:-58,z1:-40},'#8fc46a');rect({x0:-20,x1:20,z0:-40,z1:-9.1},'#9bd17a');rect({x0:-6.4,x1:6.4,z0:-8.9,z1:15.9},'#e8d9bd');
 rect({x0:6.6,x1:19.4,z0:-8.6,z1:174},'#6c6d72');rect({x0:20.2,x1:31.4,z0:0,z1:40},'#c9a27a');rect(TOWN_AREAS.plaza,'#d8cdb8');
 rect(TOWN_AREAS.school,'#b8b2a6');rect({x0:-24,x1:0,z0:66,z1:104},'#6f9e57');rect({x0:-47,x1:-27,z0:62,z1:108},'#e8d9bd');
 rect(TOWN_AREAS.forest,'#3f7a3c');q.strokeStyle='#5fb3d9';q.lineWidth=4;q.beginPath();for(let z=54;z<=152;z+=2){const x=streamX(z);z===54?q.moveTo(X(x),Y(z)):q.lineTo(X(x),Y(z))}q.stroke();
 rect({x0:-60,x1:84,z0:170,z1:177},'#d9cdb5');rect({x0:-60,x1:84,z0:177,z1:214},'#f0dca8');
 q.font='bold 15px system-ui';q.textAlign='center';q.textBaseline='middle';q.fillStyle='#1d1d1f';
 for(const [t,x,z] of [['🏠 הבית',0,3],['🌳 חצר',0,-25],['🐕 גינה',0,-50],['🛍️ חנויות',26,20],['🏫 בית ספר',-22,85],['⛲ כיכר',13,130],['🌲 יער',80,96],['🏖️ חוף',12,194],['🌊 ים',12,226],['🔥',84,118]]){q.fillText(t,X(x),Y(z))}
 // side missions left in town
 q.fillStyle='#ffc83d';for(const [id] of TOWN_CH){if(challengesDone.has(id))continue;let p=null;try{p=SIDE_POS[id]()}catch(_){}if(p){q.beginPath();q.arc(X(p.x),Y(p.z),4,0,6.3);q.fill()}}
 if(DRIVE.parked&&!DRIVE.on){q.font='16px system-ui';q.fillText('🚗',X(DRIVE.K.x),Y(DRIVE.K.z))}
 // Milky: a red arrow
 const px=X(pos.x),py=Y(pos.z);q.save();q.translate(px,py);q.rotate(Math.PI+yaw);q.fillStyle='#e74c3c';q.strokeStyle='#fff';q.lineWidth=2;q.beginPath();q.moveTo(0,-9);q.lineTo(6,7);q.lineTo(0,3);q.lineTo(-6,7);q.closePath();q.fill();q.stroke();q.restore()}
function openMap(){if(!started)return;mapEl.hidden=false;drawMap();const T=mapEl.querySelector('#tmTravel');T.innerHTML='';
 for(const Z of ZONES){const b=document.createElement('button');b.type='button';b.className='chip';const ok=save.town.visited.includes(Z.id)&&!specialMode();b.textContent=(ok?'':'🔒 ')+Z.icon+' '+Z.name;b.disabled=!ok;
  b.onclick=()=>{if(DRIVE.on)driveStop();pos.set(Z.spawn[0],0,Z.spawn[2]);jumpY=0;grounded=true;velocityY=0;rag.active=false;yaw=Z.id==='home'?Math.PI:0;camYaw=yaw;mapEl.hidden=true;showBanner('✨ '+Z.icon+' '+Z.name)};T.appendChild(b)}
 const note=document.createElement('small');note.style.cssText='width:100%;opacity:.8';note.textContent=specialMode()?'קפיצה מהירה רק במצב עולם פתוח עם מילקי':'קפיצה מהירה למקומות שכבר ביקרת בהם';T.appendChild(note)}
mapEl.querySelector('#tmClose').onclick=()=>{mapEl.hidden=true};mapEl.addEventListener('click',e=>{if(e.target===mapEl)mapEl.hidden=true});
// HUD chips: map + kart (in Milky's open world)
const mapChip=document.createElement('button');mapChip.className='chip';mapChip.type='button';mapChip.id='mapChip';mapChip.textContent='🗺️';mapChip.title='מפה';mapChip.onclick=openMap;
const carChip=document.createElement('button');carChip.className='chip';carChip.type='button';carChip.id='carChip';carChip.textContent='🚗';carChip.title='לנהוג';carChip.onclick=()=>{DRIVE.on?driveStop():driveStart()};
document.getElementById('menuBtn').after(mapChip,carChip);
function townChips(){const ow=OPEN_WORLD&&started;const plain=ow&&!specialMode();mapChip.style.display=ow?'':'none';carChip.style.display=plain?'':'none';carChip.textContent=DRIVE.on?'🚶':'🚗'}
CTX_HOOKS.grab.unshift(()=>DRIVE.on?{i:'🚶',l:'לצאת מהרכב',on:1,fn:driveStop}:null);
CTX_HOOKS.act.unshift(()=>DRIVE.on?{i:'📯',l:'צפצוף',on:1,fn:()=>{playToySound(440,.18,'square');setTimeout(()=>playToySound(440,.18,'square'),220);for(const k of SCH.kids)if(Math.hypot(k.P.g.position.x-DRIVE.K.x,k.P.g.position.z-DRIVE.K.z)<10)sayText(k.b,'מילקי נוהג!!!',1.4,'say',true)}}:
 (!specialMode()&&DRIVE.parked&&!DRIVE.on&&Math.hypot(DRIVE.K.x-pos.x,DRIVE.K.z-pos.z)<2.6?{i:'🚗',l:'לנהוג',on:1,fn:driveStart}:null));
// ---------- hooks ----------
const _gs8=gameStep;gameStep=function(dt){
 if(DRIVE.on&&!RACE_ON){driveStep(dt);const sx=stick.active,kk={...keys};stick.active=false;for(const k in keys)keys[k]=false;pos.set(DRIVE.K.x,0,DRIVE.K.z);curSpeed=0;
  _gs8(dt);stick.active=sx;Object.assign(keys,kk);pos.set(DRIVE.K.x,0,DRIVE.K.z);yaw=DRIVE.K.h;jumpY=0;lastDogSpeed=Math.abs(DRIVE.K.v);dog.visible=false}
 else _gs8(dt);
 if(!RACE_ON&&window.TOWN_READY){townStep(dt);townChips()}};
const _rf8=renderFrame;renderFrame=function(){if(DRIVE.on&&!RACE_ON){const me=RS.me;RS.me=DRIVE.K;raceCamera(lastFrameDt||1/60);RS.me=me;placeBubbles();syncLiveMats();renderer.render(scene,camera);perfTick();return}return _rf8()};
const _nth8=nextTaskHint;nextTaskHint=function(){if(DRIVE.on)return '🚗 נוהגים · 🌀 דריפט · ⚡ ניטרו · 🚶 לצאת';return _nth8()};
for(const id of ['start','startOpen','startZombie','startHuman','startDetective','modeSwitch','zSwitch'])document.getElementById(id).addEventListener('click',()=>{if(DRIVE.on)driveStop();DRIVE.parked=false;DRIVE.K.g.visible=false;BCH.cone.visible=false;BCH.ice=0},true);
document.getElementById('menuBtn').addEventListener('click',()=>{if(DRIVE.on)driveStop();mapEl.hidden=true});
{const _amo=allModesOff;allModesOff=function(k){if(DRIVE.on)driveStop();DRIVE.parked=false;DRIVE.K.g.visible=false;return _amo(k)}}
document.addEventListener('keydown',e=>{if(e.code==='KeyM'&&started&&!e.repeat){mapEl.hidden?openMap():(mapEl.hidden=true)}if(e.code==='KeyC'&&started&&!e.repeat&&OPEN_WORLD&&!specialMode()){DRIVE.on?driveStop():driveStart()}});
window.TOWN=TOWN;window.TOWN_READY=true;
// upload the neighbourhood's textures to the GPU up front, so the first walk into an area doesn't hitch
setTimeout(()=>{try{const seen=new Set();for(const g of Object.values(ZG))g.traverse(o=>{const ms=o.material?[].concat(o.material):[];for(const m of ms)if(m&&m.map&&!seen.has(m.map)){seen.add(m.map);renderer.initTexture&&renderer.initTexture(m.map)}})}catch(_){}},1500);
