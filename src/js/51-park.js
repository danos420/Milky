// ===== Dog park day: a new area behind the yard, three dog friends, an agility course, sand and mud =====
var PARK_OPEN=false;
WEEK[4].soon=false;WEEK[4].short='גינת כלבים';WEEK[4].intro='🌳 יום חמישי: דני לוקח את מילקי לגינת כלבים!';
PHASE_SETS.park=[
 {name:'בוקר',icon:'🌳',banner:'🌳 דני מחכה בגינת הכלבים, דרך השער בסוף החצר!',tasks:[
  {id:'enterPark',label:'🚪 להיכנס לגינת הכלבים',tip:'השער באמצע הגדר בסוף החצר'},
  {id:'sniffAll',label:'👃 לרחרח את שלושת הכלבים',tip:'תעמוד רגע ליד כל כלב'},
  {id:'tag',label:'🐕 תופסת עם צ\'ופי: לברוח 12 שניות',tip:'תיגע בצ\'יוואווה הקטן ותרוץ!'},
  {id:'drink',label:'💧 לשתות מהברזייה',tip:'הקערה הכחולה ליד הברז. תעמוד רגע'}]},
 {name:'צהריים',icon:'🏅',banner:'🏅 מסלול אילוף! כל הכלבים מסתכלים',tasks:[
  {id:'tunnel',label:'🕳️ לעבור במנהרה',tip:'המנהרה הצבעונית, מקצה לקצה'},
  {id:'hurdles',label:'🚧 לקפוץ מעל 3 משוכות',tip:'קפיצה מעל כל מוט'},
  {id:'stage',label:'🏆 לעלות על הבמה',tip:'הבמה האדומה, קפיצה'},
  {id:'parkFetch',label:'🎾 להחזיר לדני את הכדור',tip:'דני זורק. תביא אותו עד אליו'}]},
 {name:'ערב',icon:'🌇',banner:'🌇 עוד קצת משחק לפני הבית',tasks:[
  {id:'dig',label:'⛏️ לחפור בארגז החול',tip:'תעמוד בתוך ארגז החול'},
  {id:'mud',label:'🟤 לקפוץ לשלולית בוץ',tip:'השלולית החומה. מה כבר יכול לקרות?'},
  {id:'friend',label:'❤️ להתיידד עם בונבון',tip:'תעמוד ליד הפודל הלבן'},
  {id:'home',label:'🏠 לחזור הביתה לסלון',tip:'דרך החצר והמרפסת'}]}
];
const PZ0=-40.35,PZ1=-58,PARK_AREA={x0:-20,x1:20,z0:PZ1,z1:PZ0},GATE={x0:-1.5,x1:1.5,z0:-41.0,z1:-39.3};
AREAS.push(PARK_AREA);DOORS.push(GATE);
const gateClosed=()=>{GATE.x0=GATE.x1=0};const gateOpen=()=>{GATE.x0=-1.5;GATE.x1=1.5};gateClosed();
// ----- the place -----
const parkGrass=mat(0x86ad5c),pathMat=mat(0xd7c39a),metal=mat(0x3f5a4a,.5);
box(40,.1,17.7,parkGrass,0,-.05,-49.2);
{const p=box(2.4,.02,17.6,decal(pathMat),0,.012,-49.2);p.castShadow=false;const q=box(30,.02,2,decal(pathMat),0,.013,-49);q.castShadow=false}
for(const [x0,z0,x1,z1] of [[-20.15,PZ0,-20.15,PZ1],[20.15,PZ0,20.15,PZ1],[-20.15,PZ1-.15,20.15,PZ1-.15]]){
 const L=Math.hypot(x1-x0,z1-z0),cx=(x0+x1)/2,cz=(z0+z1)/2,along=x0===x1?'z':'x';
 for(const y of [.45,1.15]){const r=along==='z'?box(.06,.07,L,metal,cx,y,cz):box(L,.07,.06,metal,cx,y,cz)}
 for(let i=0;i<=L;i+=2){along==='z'?box(.09,1.3,.09,metal,cx,.65,z0-i):box(.09,1.3,.09,metal,x0+i,.65,cz)}}
// gate in the yard wall
const gateL=new THREE.Group(),gateR=new THREE.Group();gateL.position.set(-1.5,0,-40.15);gateR.position.set(1.5,0,-40.15);scene.add(gateL,gateR);
for(const [g,s] of [[gateL,1],[gateR,-1]]){box(1.5,.08,.06,metal,s*.75,1.7,0,g);box(1.5,.08,.06,metal,s*.75,.25,0,g);for(let i=0;i<6;i++)box(.05,1.5,.05,metal,s*(.12+i*.26),.98,0,g)}
// sign with real Hebrew text
{const cv=document.createElement('canvas');cv.width=512;cv.height=128;const g=cv.getContext('2d');g.fillStyle='#2f5d3a';g.fillRect(0,0,512,128);g.strokeStyle='#f2e3b3';g.lineWidth=8;g.strokeRect(6,6,500,116);
 g.fillStyle='#fff6dc';g.font='bold 64px system-ui,Arial';g.textAlign='center';g.textBaseline='middle';g.direction='rtl';g.fillText('🐾 גינת כלבים',256,68);
 const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace||tx.colorSpace;const sm=new THREE.MeshBasicMaterial({map:tx,toneMapped:false});
 for(const s of [1,-1]){const holder=new THREE.Group();scene.add(holder);const p=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.65),s>0?sm:sm.clone());p.position.set(0,2.55,-40.15+s*.05);if(s<0)p.rotation.y=Math.PI;holder.add(p)}
 box(.1,2.6,.1,metal,-1.6,1.3,-40.15);box(.1,2.6,.1,metal,1.6,1.3,-40.15)}
// trees + benches
for(const [x,z] of [[-16,-44],[15,-55],[-7,-56],[17,-43]]){cyl(.24,2.4,mat(0x6b4a32),x,1.2,z);for(let i=0;i<5;i++){const a=i*1.3;ball(1-i*.05,mat(i%2?0x4f7f45:0x5f9150),x+Math.cos(a)*.6,2.8+(i%3)*.35,z+Math.sin(a)*.6)}}
for(const [x,z,r] of [[-14,-41.6,0],[9,-57.2,Math.PI]]){const b=new THREE.Group();b.position.set(x,0,z);b.rotation.y=r;scene.add(b);box(2,.08,.5,mat(0x9c6b3e),0,.48,0,b);box(2,.45,.08,mat(0x9c6b3e),0,.8,-.24,b);for(const s of [-.85,.85])box(.08,.48,.45,metal,s,.24,0,b)}
obstacles.push({name:'ספסל',x:-14,z:-41.6,w:2,d:.5,top:.5},{name:'ספסל',x:9,z:-57.2,w:2,d:.5,top:.5});
// drinking fountain
const FOUNT={x:13,z:-46};cyl(.12,1,mat(0x9aa3a6,.4),FOUNT.x,.5,FOUNT.z-.5);cyl(.38,.12,mat(0x3a7bd5,.4),FOUNT.x,.06,FOUNT.z);cyl(.3,.02,mat(0x8fd3ff,.2),FOUNT.x,.13,FOUNT.z);
// sandbox
const SAND={x:-12,z:-51,w:4,d:3};{const wd=mat(0xa57d4b);box(SAND.w,.04,SAND.d,mat(0xe8d39b,1),SAND.x,.02,SAND.z).castShadow=false;
 for(const [dx,dz,w,d] of [[0,-SAND.d/2,SAND.w+.2,.15],[0,SAND.d/2,SAND.w+.2,.15],[-SAND.w/2,0,.15,SAND.d],[SAND.w/2,0,.15,SAND.d]])box(w,.22,d,wd,SAND.x+dx,.11,SAND.z+dz);
 const pail=cyl(.15,.25,mat(0xe74c3c,.6),SAND.x+1.2,.13,SAND.z-.6)}
// mud puddle
const MUD={x:7,z:-53.5,r:1.3};{const m=cyl(MUD.r,.02,new THREE.MeshStandardMaterial({color:0x5b4130,roughness:.3,polygonOffset:true,polygonOffsetFactor:-2}),MUD.x,.012,MUD.z);m.scale.z=.7;m.castShadow=false}
// agility: tunnel, hurdles, stage, weave poles
const TUN={x0:-6,x1:-2.6,z:-47.2};{const tm=mat(0x3a7bd5,.6);tm.side=THREE.DoubleSide;const t=mesh(new THREE.CylinderGeometry(.62,.62,TUN.x1-TUN.x0,16,1,true),tm,(TUN.x0+TUN.x1)/2,.62,TUN.z);t.rotation.z=Math.PI/2;
 for(let i=0;i<=4;i++){const r=mesh(new THREE.TorusGeometry(.63,.04,6,16),mat(0xf2c14e),TUN.x0+i*(TUN.x1-TUN.x0)/4,.62,TUN.z);r.rotation.y=Math.PI/2}}
obstacles.push({name:'מנהרה',x:(TUN.x0+TUN.x1)/2,z:TUN.z-.66,w:TUN.x1-TUN.x0,d:.08,top:1.25,solid:true},{name:'מנהרה',x:(TUN.x0+TUN.x1)/2,z:TUN.z+.66,w:TUN.x1-TUN.x0,d:.08,top:1.25,solid:true});
const HURDLES=[3,6,9].map(x=>({x,z:-47.2,done:false}));
for(const h of HURDLES){for(const s of [-.7,.7])box(.07,.75,.07,mat(0xf3f3ef),h.x,.37,h.z+s);box(.05,.05,1.45,mat(0xe74c3c),h.x,.55,h.z);obstacles.push({name:'משוכה',x:h.x,z:h.z,w:.1,d:1.4,top:.58})}
const STAGE={x:-11,z:-44.5};box(2.2,.95,1.6,mat(0xc0392b,.7),STAGE.x,.475,STAGE.z);box(2.3,.05,1.7,mat(0xf2c14e),STAGE.x,.97,STAGE.z);obstacles.push({name:'במה',x:STAGE.x,z:STAGE.z,w:2.2,d:1.6,top:1.0});
for(let i=0;i<5;i++)cyl(.04,1,mat(i%2?0xf2c14e:0xffffff),12-i*.9+5,.5,-52);
// ----- other dogs -----
function makeDog(o){
 const g=new THREE.Group();scene.add(g);const body=new THREE.Group();g.add(body);const c=mat(o.color,.9),c2=mat(o.color2||o.color,.9),dark=mat(0x1c1a1a,.5);
 const S=o.size;body.scale.setScalar(S);
 const tor=ball(.4,c,0,1.05,0,body);tor.scale.set(.8,.75,1.5);
 if(o.fluffy)for(const [x,y,z] of [[0,1.25,.3],[0,1.25,-.3],[.2,1.1,0],[-.2,1.1,0],[0,1.1,-.6]])ball(.25,c,x,y,z,body);
 const head=new THREE.Group();head.position.set(0,1.45,.62);body.add(head);
 ball(.3,c,0,0,0,head);const sn=ball(.15,c2,0,-.08,.27,head);sn.scale.set(1,.8,1.3);ball(.06,dark,0,-.03,.46,head);
 for(const s of [-1,1]){ball(.045,dark,s*.12,.08,.25,head);const ear=ball(o.bigEars?.16:.12,c2,s*(o.bigEars?.22:.24),o.bigEars?.28:.12,-.02,head);ear.scale.set(o.bigEars?.7:.5,o.bigEars?1.3:1.1,.35);ear.rotation.z=s*(o.bigEars?-.4:.5)}
 if(o.fluffy){ball(.2,c,0,.25,0,head)}
 const legs=[];for(const [x,z] of [[.2,.4],[-.2,.4],[.2,-.4],[-.2,-.4]]){const p=new THREE.Group();p.position.set(x,.8,z);body.add(p);const l=cyl(.07,.8,c2,0,-.4,0,p);legs.push(p)}
 const tail=new THREE.Group();tail.position.set(0,1.2,-.6);body.add(tail);const tl=cyl(.05,.5,c,0,.25,0,tail);tail.rotation.x=-.8;
 const d={g,body,head,legs,tail,name:o.name,speed:o.speed,size:S,state:'wander',tx:0,tz:0,t:0,walk:0,home:new THREE.Vector3(o.x,0,o.z),sniffT:0,sniffed:false,friendT:0,b:null};
 g.position.copy(d.home);d.b=makeBubble(g,1.9*S+.2);return d;
}
const DOGS=[makeDog({name:'רקס',color:0x2b2622,color2:0x3a332e,size:1.05,speed:3.4,x:-6,z:-52}),
 makeDog({name:'בונבון',color:0xf7f4ee,size:.62,speed:2.6,fluffy:true,x:6,z:-44}),
 makeDog({name:'צ\'ופי',color:0xd9a35f,color2:0xc28a4a,size:.42,speed:4.4,bigEars:true,x:14,z:-50})];
const [REX,BONBON,CHUPI]=DOGS;
const DOG_LINES={'רקס':['וואף. (קול עמוק)','אתה חדש פה?','הכדור הזה שלי. אחי.'],'בונבון':['אני הכי יפה פה 💅','אל תתקרב לתסרוקת','היי חמוד 😳'],'צ\'ופי':['יפ! יפ! יפ!','אני ענק בפנים!','תופסת!!! אתה תופס!']};
var PARTY_DOGS=false;
function parkFree(x,z,d){if(d&&d.zone==='home')return x>-5.9&&x<5.9&&z>-8.3&&z<8.3;return x>-19.3&&x<19.3&&z>PZ1+.7&&z<PZ0-1}
function pickSpot(d){for(let i=0;i<20;i++){const home=d.zone==='home',x=home?-5+Math.random()*10:-18+Math.random()*36,z=home?-7.5+Math.random()*15:PZ1+1.5+Math.random()*(PZ0-PZ1-3);if(!obstacles.some(o=>insidePlatform(o,x,z,.8))){d.tx=x;d.tz=z;return}}d.tx=d.home.x;d.tz=d.home.z}
DOGS.forEach(pickSpot);
// park ball thrown by Dani
const pBall=ball(.16,mat(0xc8e04a,.5),0,.16,-44,scene);pBall.visible=false;const pBallV=new THREE.Vector2();
const park={on:false,phase:-1,tagT:0,tagOn:false,drinkT:0,digT:0,inTunnel:0,tunSide:0,ballHeld:false,throwT:0,daniStep:0,sniffN:0};
var MUDDY=false;
function parkResetProps(){park.on=false;park.phase=-1;PARK_OPEN=!!(week.stars[4]);if(PARK_OPEN)gateOpen();else gateClosed();gateL.rotation.y=PARK_OPEN?1.4:0;gateR.rotation.y=PARK_OPEN?-1.4:0;
 pBall.visible=false;park.ballHeld=false;MUDDY=false;for(const h of HURDLES)h.done=false;
 DOGS.forEach(d=>{d.g.position.copy(d.home);d.state='wander';d.sniffed=false;d.sniffT=0;d.friendT=0;pickSpot(d)});park.sniffN=0;park.tagOn=false;park.tagT=0;
 if(daniState==='park'){daniState='cook';dani.position.copy(DANI_HOME);daniNav.path=[]}}
const _origReset3=bathResetProps;bathResetProps=function(){_origReset3();parkResetProps()};
DAY_HOOKS.park=(phase,fresh)=>{
 park.on=true;park.phase=phase;PARK_OPEN=true;gateOpen();
 if(phase===0){daniState='park';daniAction=0;dani.position.set(0,0,-42.6);daniNav.path=[];if(started)setTimeout(()=>{if(park.on)sayDani('מילקי! בוא! הגינה מחכה!')},1200)}
 if(phase===1){park.throwT=2;sayDani('יאללה מסלול! תראה להם מי הכלב הכי מוכשר')}
 if(phase===2){sayDani('עוד קצת ואז הביתה. בלי בוץ, בבקשה. ...מילקי?')}
};
// Dani in the park: walks without the house grid, throws the ball
function parkDani(dt){
 let tx=0,tz=-42.6,fx=pos.x,fz=pos.z,sp=0;
 if(park.phase>=1&&pBall.visible&&!park.ballHeld&&pBallV.length()<.2&&Math.hypot(pBall.position.x-pos.x,pBall.position.z-pos.z)>6){tx=pBall.position.x;tz=pBall.position.z;sp=2.6;
  if(Math.hypot(tx-dani.position.x,tz-dani.position.z)<.7){pBall.visible=false;park.throwT=2.5}}
 const dx=tx-dani.position.x,dz=tz-dani.position.z,dd=Math.hypot(dx,dz);sp=dd>.4?(sp||2.2):0;
 const st=Math.min(dd,sp*dt);if(st>0){dani.position.x+=dx/dd*st;dani.position.z+=dz/dd*st;fx=tx;fz=tz}
 park.daniStep=st;return {fx,fz};
}
function throwParkBall(){const a=-Math.PI/2+(Math.random()-.5)*1.6;pBall.visible=true;pBall.position.set(dani.position.x,.9,dani.position.z-.5);pBallV.set(Math.cos(a)*9,-Math.sin(a)*-9);
 pBallV.set(Math.sin(a+Math.PI/2)*9*(Math.random()<.5?1:-1)*.6,-9);park.ballY=.9;park.ballVY=4;sayDani(pick(['תביא!!','קדימה מילקי!','לאן זה עף?! תביא!']));thought(daniB,'🎾',1.4,true)}
function updateParkBall(dt){
 if(!pBall.visible)return;
 if(park.ballHeld){headPivot.localToWorld(_mouth.set(0,-.16,.66));pBall.position.copy(_mouth);
  if(Math.hypot(pos.x-dani.position.x,pos.z-dani.position.z)<1.8){park.ballHeld=false;pBall.position.set(dani.position.x+.5,.16,dani.position.z);pBallV.set(0,0);dayEvent('parkFetch');addScore(250,'כדור לדני');sayDani(pick(['כלב טוב!!','עוד פעם!','אלוף!']));park.throwT=3}return}
 park.ballVY-=14*dt;park.ballY+=park.ballVY*dt;if(park.ballY<.16){park.ballY=.16;park.ballVY=Math.abs(park.ballVY)>1.5?-park.ballVY*.45:0}
 pBall.position.x+=pBallV.x*dt;pBall.position.z+=pBallV.y*dt;pBall.position.y=park.ballY;pBallV.multiplyScalar(Math.exp(-(park.ballY<.2?1.6:.2)*dt));
 if(pBall.position.x<-19.3||pBall.position.x>19.3){pBallV.x*=-.6;pBall.position.x=THREE.MathUtils.clamp(pBall.position.x,-19.3,19.3)}
 if(pBall.position.z<PZ1+.5||pBall.position.z>PZ0-.5){pBallV.y*=-.6;pBall.position.z=THREE.MathUtils.clamp(pBall.position.z,PZ1+.5,PZ0-.5)}
 if(Math.hypot(pBall.position.x-pos.x,pBall.position.z-pos.z)<.9*MS&&pBall.position.y<1.2+jumpY){park.ballHeld=true;milkyThought('😼',1.2,true)}
}
function updateDogs(dt,t){
 const inPark=PARTY_DOGS?(pos.z>-8.9&&pos.z<8.9):pos.z<PZ0;
 for(const d of DOGS){
  d.t+=dt;const p=d.g.position,dm=Math.hypot(pos.x-p.x,pos.z-p.z);let sp=d.speed*.45,tx=d.tx,tz=d.tz;
  if(d===CHUPI&&park.tagOn){tx=pos.x;tz=pos.z;sp=4.6;if(dm<.9&&jumpY<.6){park.tagOn=false;sayText(d.b,'תפסתי!!! 😝',1.8,'say',true);d.state='wander';d.t=0;addActivity('🐕 צ\'ופי תפס את מילקי! תיגע בו שוב')}}
  else if(d===BONBON&&park.on&&park.phase===2&&dm<2.4){tx=p.x;tz=p.z;sp=0}
  else if(inPark&&dm<2.2&&d.state!=='play'){tx=p.x;tz=p.z;sp=0;if(Math.random()<dt*.4)thought(d.b,pick(['❤️','🐕','👃','🎾']),1.5)}
  else if(inPark&&d===REX&&pBall.visible&&!park.ballHeld&&park.on){tx=pBall.position.x;tz=pBall.position.z;sp=3.2;if(Math.hypot(tx-p.x,tz-p.z)<.7){pBallV.set((Math.random()-.5)*8,(Math.random()-.5)*8);park.ballVY=3;sayText(d.b,pick(DOG_LINES['רקס']),1.6,'say')}}
  if(Math.hypot(tx-p.x,tz-p.z)<.5&&sp>0&&tx===d.tx){pickSpot(d)}
  const dx=tx-p.x,dz=tz-p.z,dd=Math.hypot(dx,dz);let step=0;
  if(dd>.3&&sp>0){step=Math.min(dd,sp*dt);let nx=p.x+dx/dd*step,nz=p.z+dz/dd*step;if(parkFree(nx,nz,d)&&!obstacles.some(o=>o.name!=='ספסל'&&insidePlatform(o,nx,nz,.15))){p.x=nx;p.z=nz}else pickSpot(d);
   const a=Math.atan2(dx,dz);d.g.rotation.y+=Math.atan2(Math.sin(a-d.g.rotation.y),Math.cos(a-d.g.rotation.y))*Math.min(1,dt*8)}
  else if(dm<3){const a=Math.atan2(pos.x-p.x,pos.z-p.z);d.g.rotation.y+=Math.atan2(Math.sin(a-d.g.rotation.y),Math.cos(a-d.g.rotation.y))*Math.min(1,dt*4)}
  // keep out of Milky
  if(dm<.75*(MS+d.size)*.8&&jumpY<.6){const k=(.75*(MS+d.size)*.8-dm)/(dm||1);p.x-=(pos.x-p.x)*k;p.z-=(pos.z-p.z)*k}
  d.walk+=step*12/d.size;const w=step>.001;
  d.legs.forEach((l,i)=>{l.rotation.x=w?Math.sin(d.walk+(i===0||i===3?0:Math.PI))*.7:0});
  d.body.position.y=w?Math.abs(Math.sin(d.walk))*.06*d.size:0;
  d.tail.rotation.z=Math.sin(t*(dm<3?16:6))*.6;d.head.rotation.x=dm<1.5?.25:Math.sin(t*1.3+d.size)*.05;
  // sniff progress
  if(park.on&&park.phase===0&&!d.sniffed&&dm<1.6*(MS+d.size)*.6+.6&&lastDogSpeed<1){d.sniffT+=dt;if(d.sniffT>1){d.sniffed=true;park.sniffN++;thought(d.b,'👃',1.4,true);sayText(d.b,pick(DOG_LINES[d.name]),2,'say',true);addActivity('👃 מילקי רחרח את '+d.name+' ('+park.sniffN+'/3)');if(park.sniffN>=3)dayEvent('sniffAll')}}
  if(Math.random()<dt*.05&&inPark&&dm<9)sayText(d.b,pick(DOG_LINES[d.name]),1.8,'say');
 }
}
function updatePark(dt){
 const t=performance.now()/1000;
 // gate swing
 const go=PARK_OPEN?1.4:0;gateL.rotation.y+=(go-gateL.rotation.y)*Math.min(1,dt*3);gateR.rotation.y+=(-go-gateR.rotation.y)*Math.min(1,dt*3);
 if(MUDDY&&Math.random()<dt*2)emit(pos.x,.2,pos.z,(Math.random()-.5),.3,(Math.random()-.5),'dust',.6);
 if(!PARK_OPEN&&!park.on&&!PARTY_DOGS)return;
 updateDogs(dt,t);updateParkBall(dt);
 if(!park.on)return;
 if(!day.done.has('home')&&daniState!=='park'&&dani.position.z<-40.2)daniState='park';
 const inPark=pos.z<PZ0-.2;
 if(inPark)dayEvent('enterPark');
 if(park.phase===0){
  const dc=Math.hypot(pos.x-CHUPI.g.position.x,pos.z-CHUPI.g.position.z);
  if(!park.tagOn&&dc<1.1&&!day.done.has('tag')){park.tagOn=true;sayText(CHUPI.b,'תופסת!!! אתה בורח!',1.8,'say',true);milkyThought('😱',1.4,true)}
  if(park.tagOn){park.tagT+=dt;if(park.tagT>=12){park.tagOn=false;dayEvent('tag');sayText(CHUPI.b,'אוף! אתה מהיר מדי 😤',2,'say',true);addScore(300,'ניצחת את צ\'ופי')}}
  if(!day.done.has('tag')&&(park.tagOn||park.tagT>0)){evtPill.hidden=false;const l='🐕 בורח מצ\'ופי '+Math.floor(park.tagT)+'/12'+(park.tagOn?'':' · תיגע בו שוב');if(evtPill.textContent!==l)evtPill.textContent=l}else if(!(typeof evt!=='undefined'&&evt.cur)&&!BATH_BLOCK)evtPill.hidden=true;
  if(Math.hypot(pos.x-FOUNT.x,pos.z-FOUNT.z)<1.1&&lastDogSpeed<.3&&grounded){park.drinkT+=dt;if(park.drinkT>1.5&&!day.done.has('drink')){dayEvent('drink');idleAction='sniff';idleClock=0;sayText(milkyB,'💧 לאפ לאפ לאפ',2,'say',true)}}else park.drinkT=0;
 }
 if(park.phase===1){
  // tunnel: inside the tube from one end to the other
  const inT=pos.x>TUN.x0&&pos.x<TUN.x1&&Math.abs(pos.z-TUN.z)<.6&&jumpY<.4;
  if(inT&&!park.tunSide)park.tunSide=pos.x<(TUN.x0+TUN.x1)/2?-1:1;
  if(!inT&&park.tunSide){const out=pos.x<=TUN.x0?-1:pos.x>=TUN.x1?1:0;if(out&&out!==park.tunSide&&Math.abs(pos.z-TUN.z)<1){dayEvent('tunnel');addScore(250,'מנהרה!');if(window.JUICE_READY)pow('ווווש!')}park.tunSide=0}
  for(const h of HURDLES){if(h.done)continue;if(Math.abs(pos.x-h.x)<.25&&Math.abs(pos.z-h.z)<.8&&jumpY>.6){h.done=true;addScore(150,'משוכה');if(window.JUICE_READY)pow('הופ!');const n=HURDLES.filter(q=>q.done).length;addActivity('🚧 משוכה '+n+'/3');if(n===3)dayEvent('hurdles')}}
  if(jumpY>.9&&grounded&&insidePlatform(obstacles.find(o=>o.name==='במה'),pos.x,pos.z,0)&&!day.done.has('stage')){dayEvent('stage');sayDani('אלוף!!! מילקי על הבמה!');DOGS.forEach(d=>thought(d.b,'👏',1.6,true))}
  park.throwT-=dt;if(!pBall.visible&&park.throwT<=0&&Math.hypot(pos.x-dani.position.x,pos.z-dani.position.z)<9&&inPark)throwParkBall();
 }
 if(park.phase===2){
  if(Math.abs(pos.x-SAND.x)<SAND.w/2-.2&&Math.abs(pos.z-SAND.z)<SAND.d/2-.2&&grounded&&lastDogSpeed<.3){park.digT+=dt;if(Math.random()<.5)emit(pos.x+Math.sin(yaw)*.5,.2,pos.z+Math.cos(yaw)*.5,(Math.random()-.5)*2,2,(Math.random()-.5)*2,'dust',.6);
   idleAction='sniff';idleClock=0;if(park.digT>2&&!day.done.has('dig')){dayEvent('dig');sayText(milkyB,'⛏️ מצאתי... גרב?!',2.2,'say',true);addScore(200,'חפירה')}}else park.digT=0;
  if(Math.hypot((pos.x-MUD.x),(pos.z-MUD.z)/.7)<MUD.r&&jumpY<.3){if(!MUDDY){MUDDY=true;dayEvent('mud');SFX.splash();if(window.JUICE_READY)pow('פלוץ׳!');sayDani('לאאאא! עכשיו צריך אמבטיה שוב!')}}
  const bd=Math.hypot(pos.x-BONBON.g.position.x,pos.z-BONBON.g.position.z);
  if(bd<2.2&&lastDogSpeed<.4){BONBON.friendT+=dt;if(BONBON.friendT>3&&!day.done.has('friend')){dayEvent('friend');for(let i=0;i<3;i++)setTimeout(()=>{thought(BONBON.b,'❤️',1.4,true);milkyThought('❤️',1.4,true)},i*500);sayText(BONBON.b,'טוב, אתה חמוד. קצת. 💅',2.4,'say',true)}}else BONBON.friendT=0;
  if(pos.z>-8.9&&!day.done.has('home')){dayEvent('home');if(MUDDY)speakDad('מילקי!!! הבוץ!!! על השטיח!!!');else speakDad('חזרתם! איך היה בגינה?');daniState='cook';dani.position.copy(DANI_HOME);daniNav.path=[]}
 }
}
window.PARK_READY=true;
loadWeekPhases();renderDay();renderWeek();
