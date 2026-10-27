// ===== Coins, the pet shop on the square, and neighbourhood events that come and go. Milky is also faster in town =====
if(typeof save.coins!=='number')save.coins=0;if(!save.shop||typeof save.shop!=='object')save.shop={};if(!Array.isArray(save.shop.owned))save.shop.owned=[];
const ecoPlain=()=>OPEN_WORLD&&started&&!specialMode()&&!DRIVE.on;
// ---------- faster in town (it's a big place) ----------
function townSpeed(){return OPEN_WORLD&&window.TOWN_READY&&inTown(pos.x,pos.z)&&!specialMode()&&!DRIVE.on?1.3:1}
// ---------- coins ----------
const coinChip=document.createElement('button');coinChip.className='chip';coinChip.type='button';coinChip.id='coinChip';coinChip.title='מטבעות';
coinChip.onclick=()=>{if(nearShop())openShop();else showBanner('🪙 '+save.coins+' מטבעות · 🛍️ חנות כלבלב בכיכר, ליד המזרקה')};
(document.getElementById('skyChip')||mapChip).after(coinChip);
function coinText(){coinChip.textContent='🪙 '+save.coins}coinText();
function addCoins(n,why){if(!n)return;save.coins=Math.max(0,Math.min(99999,save.coins+n));writeSave();coinText();coinChip.classList.remove('pulse');void coinChip.offsetWidth;coinChip.classList.add('pulse');
 if(n>0){if(window.JUICE_READY)pow('+'+n+' 🪙',pos.x,2.6,pos.z,false);if(why)addActivity('🪙 +'+n+' '+why)}}
// helping neighbours, side missions in the open world, first win of an episode level
{const _nd=nbDone;nbDone=function(N){_nd(N);addCoins(15,N.name)}}
{const _cc=completeChallenge;completeChallenge=function(id){const had=challengesDone.has(id);_cc(id);if(OPEN_WORLD&&!had&&challengesDone.has(id)&&!specialMode())addCoins(10,'משימת צד')}}
{const _ef=epFinish;epFinish=function(win,stars,lines,title){const ep=EP.cur;const lv=ep&&ep.levels[EP.idx];const first=win&&lv&&!((save.ep[ep.id]||{})[lv.id]>0);
 if(first){save.coins=Math.min(99999,save.coins+10);writeSave();coinText();lines=lines.concat(['🪙 +10 מטבעות'])}return _ef(win,stars,lines,title)}}
// coins lying around town (one draw call); they come back after a few minutes
const COIN_SPOTS=[[9,50],[17,64],[9,78],[17,102],[8.5,116],[-10,124],[30,124],[40,134],[-8,140.5],[-30,156.5],[-14,153.2],[24,157.5],[54,156],[0,148],[-24,186],[6,198],[36,192],[60,205],[-44,180],[-14,72],[-2,100],[30,90],[84,112],[66,140],
 [-6,133,1.25],[30,121,1.22],[0,145,1],[-2.6,167.6,.95],[13,130,1.5]];
const coinM=new THREE.InstancedMesh(new THREE.CylinderGeometry(.24,.24,.06,16),new THREE.MeshBasicMaterial({color:0xffc83d}),COIN_SPOTS.length);coinM.frustumCulled=false;KEEP.add(coinM);scene.add(coinM);
const COINS=COIN_SPOTS.map(([x,z,y])=>({x,z,y:(y||0)+.55,back:0}));const _cmx=new THREE.Matrix4(),_cqx=new THREE.Quaternion(),_cvx=new THREE.Vector3(),_csx=new THREE.Vector3(),_cex=new THREE.Euler();
function updateCoins(dt){const t=performance.now()/1000;const on=OPEN_WORLD&&started&&!specialMode();coinM.visible=on;if(!on)return;
 COINS.forEach((c,i)=>{if(c.back>0)c.back-=dt;const live=c.back<=0;
  if(live&&Math.abs(pos.x-c.x)<.95&&Math.abs(pos.z-c.z)<.95&&Math.abs(jumpY+.5-c.y)<.9&&!DRIVE.on){c.back=180;addCoins(1);playToySound(880,.05,'triangle');for(let k=0;k<6;k++)emit(c.x,c.y,c.z,(Math.random()-.5)*2,2,(Math.random()-.5)*2,'heart',.5)}
  _cex.set(Math.PI/2,0,t*3+i);_cqx.setFromEuler(_cex);const s=live?1:0;_cmx.compose(_cvx.set(c.x,c.y+Math.sin(t*2+i)*.08,c.z),_cqx,_csx.set(s,s,s));coinM.setMatrixAt(i,_cmx)});coinM.instanceMatrix.needsUpdate=true}
// ---------- new things to wear (they join the wardrobe once bought) ----------
const SHOP=[];
function shopItem(id,icon,name,price,slot,build,parent){const g=new THREE.Group();(parent==='torso'?torso:headPivot).add(g);build(g);g.visible=false;WEAR[id]=g;
 WEAR_DEFS.push({id,icon,name,need:()=>[save.shop.owned.includes(id)?1:0,1,'לקנות בחנות כלבלב']});SHOP.push({id,icon,name,price,slot})}
const EM=(c,r=.6)=>mat(c,r);
shopItem('bandana','🧡','בנדנה',25,'neck',g=>{const t=mesh(new THREE.TorusGeometry(.21,.055,6,16),EM(0xe8642c),0,1.47,.58,g);t.rotation.x=Math.PI/2-.55;const b=mesh(new THREE.ConeGeometry(.2,.3,3),EM(0xe8642c),0,1.24,.76,g);b.rotation.set(Math.PI+.35,0,0);b.scale.set(1,1,.3);for(let i=0;i<5;i++)ball(.025,EM(0xffffff),-.1+i*.05,1.3,.8,g)},'torso');
shopItem('cap','🧢','כובע מצחייה',30,'head',g=>{g.position.set(0,.24,.02);const d=ball(.17,EM(0xd6261f),0,0,0,g);d.scale.set(1,.6,1.05);box(.24,.025,.18,EM(0xd6261f),0,-.03,.2,g);ball(.03,EM(0xffffff),0,.1,0,g)});
shopItem('bonetag','🦴','תג עצם',35,'tag',g=>{const w=EM(0xf6f1e4,.5);mesh(new THREE.TorusGeometry(.2,.035,6,16),EM(0xd6261f),0,1.45,.6,g).rotation.x=Math.PI/2-.55;const c=cyl(.045,.22,w,0,1.16,.84,g);c.rotation.z=Math.PI/2;for(const s2 of [-1,1])for(const u of [-1,1])ball(.045,w,s2*.11,1.16+u*.035,.84,g)},'torso');
shopItem('flowers','🌼','זר פרחים',40,'head',g=>{g.position.set(0,.26,.02);const r=mesh(new THREE.TorusGeometry(.16,.025,6,18),EM(0x3f7a3c),0,0,0,g);r.rotation.x=Math.PI/2;for(let i=0;i<8;i++){const a=i/8*6.28;ball(.045,EM([0xff8fb1,0xf2c14e,0xffffff,0x9b59b6][i%4]),Math.sin(a)*.16,.02,Math.cos(a)*.16,g)}});
shopItem('scarf','🧣','צעיף חורף',40,'neck',g=>{for(let i=0;i<3;i++){const t=mesh(new THREE.TorusGeometry(.2,.045,6,16),EM(i%2?0xffffff:0x3a7bd5),0,1.47-i*.06,.58,g);t.rotation.x=Math.PI/2-.55}box(.12,.36,.05,EM(0x3a7bd5),.12,1.22,.74,g)},'torso');
shopItem('umbrella','☔','כובע מטרייה',45,'head',g=>{g.position.set(0,.28,0);cyl(.015,.22,EM(0x3a3d42),0,.11,0,g);const c=mesh(new THREE.ConeGeometry(.42,.18,8),EM(0xff3fa0),0,.26,0,g);ball(.03,EM(0xf2c14e),0,.36,0,g)});
shopItem('hearts','💖','משקפי לבבות',50,'eyes',g=>{for(const s of [-1,1]){const h=cyl(.08,.03,EM(0xff5d8f,.4),s*.13,.1,.36,g);h.rotation.x=Math.PI/2}box(.12,.02,.02,EM(0xff5d8f),0,.12,.37,g)});
shopItem('tophat','🎩','מגבעת',60,'head',g=>{g.position.set(0,.28,.02);cyl(.21,.02,EM(0x1d1d22),0,0,0,g);cyl(.12,.26,EM(0x1d1d22),0,.13,0,g);cyl(.125,.05,EM(0xc0392b),0,.04,0,g)});
shopItem('backpack','🎒','תיק גב',70,'back',g=>{box(.42,.32,.5,EM(0xf39c12),0,1.72,-.15,g);box(.3,.16,.06,EM(0xe67e22),0,1.66,.12,g);for(const s of [-1,1])box(.04,.36,.04,EM(0x8b5a2b),s*.18,1.6,.22,g)},'torso');
shopItem('pirate','🏴‍☠️','כובע פיראט',80,'head',g=>{g.position.set(0,.3,.02);const h=mesh(new THREE.ConeGeometry(.24,.2,3),EM(0x1d1d22),0,.06,0,g);h.rotation.y=Math.PI;ball(.035,EM(0xffffff),0,.08,.13,g)});
shopItem('cowboy','🤠','כובע בוקרים',90,'head',g=>{g.position.set(0,.28,.02);const b=cyl(.3,.025,EM(0x8b5a2b),0,0,0,g);cyl(.13,.17,EM(0x8b5a2b),0,.09,0,g);cyl(.135,.04,EM(0x3a2a20),0,.03,0,g)});
shopItem('unicorn','🦄','קרן חד־קרן',120,'horn',g=>{g.position.set(0,.33,.14);g.rotation.x=.45;const c=mesh(new THREE.ConeGeometry(.06,.34,10),EM(0xf6f1e4,.3),0,.17,0,g);for(let i=0;i<4;i++){const r=mesh(new THREE.TorusGeometry(.05-i*.009,.01,4,12),EM(0xf2c14e,.3),0,.05+i*.07,0,g);r.rotation.x=Math.PI/2}});
// one thing per slot: putting on a hat takes the other hat off
const SLOT_OF={party:'head',crown:'head',shades:'eyes',gold:'neck',cape:'back'};for(const s of SHOP)SLOT_OF[s.id]=s.slot;
{const _tw=toggleWear;toggleWear=function(id){const on=save.mods.wear.includes(id),sl=SLOT_OF[id];if(!on&&sl){save.mods.wear=save.mods.wear.filter(w=>w===id||SLOT_OF[w]!==sl)}return _tw(id)}}
applyModes(true);
// ---------- the shop on the square ----------
const SHOP_AT={x:39,z:139.6};
{const g=ZG.roads,x=SHOP_AT.x,z=SHOP_AT.z;box(3.2,1.05,1.2,EM(0x3a7bd5,.6),x,.52,z,g);box(3.3,.06,1.3,EM(0xf6f1e7,.5),x,1.06,z,g);obstacles.push({name:'חנות כלבלב',x,z,w:3.2,d:1.2,top:1.06,solid:true});
 for(const s of [-1,1])cyl(.06,2.6,EM(0x5a4a3a),x+s*1.55,1.3,z-.5,g);const aw=box(3.6,.08,1.6,EM(0xf2c14e,.6),x,2.62,z,g);aw.rotation.x=-.12;
 for(let i=0;i<4;i++)box(.5,.06,.06,EM([0xd6261f,0x3a7bd5,0x8b5a2b,0xff3fa0][i]),x-1.1+i*.73,1.2,z-.3,g);ball(.12,EM(0xff3fa0),x+1.2,1.2,z,g);
 signBoard(g,'🛍️ חנות כלבלב',x,3.1,z-.75,Math.PI,3.2)}
const VENDOR=makePerson({skin:0xd8a07a,shirt:0x3a7bd5,apron:0xf2c14e,pants:0x333333,hair:h=>{const b=ball(.34,mat(0x6b4a2a),0,.12,-.06,h);b.scale.set(1,.7,1)}});ZG.roads.add(VENDOR.g);VENDOR.g.position.set(SHOP_AT.x,0,SHOP_AT.z+1.1);VENDOR.g.rotation.y=Math.PI;for(const p of [...VENDOR.face.parts,VENDOR.mouth])KEEP.add(p);const vendorB=makeBubble(VENDOR.g,3.1);
const nearShop=()=>Math.hypot(pos.x-SHOP_AT.x,pos.z-(SHOP_AT.z-1.6))<2.2;
const shopEl=document.createElement('div');shopEl.id='shopM';shopEl.className='modal';shopEl.hidden=true;
shopEl.innerHTML='<div class="modalCard" style="max-width:480px;max-height:90vh;overflow:auto;padding:14px"><h1 style="margin:2px 0 4px">🛍️ חנות כלבלב</h1><div id="shopBal" style="font:800 17px system-ui;color:#ffd166;margin-bottom:8px"></div><div id="shopList"></div><small style="display:block;opacity:.8;margin:8px 0">מטבעות: לעזור לשכנים · משימות צד · אירועים · מטבעות זהב ברחובות</small><div class="modalBtns"><button id="shopClose" type="button">✖ סגור</button></div></div>';
document.body.appendChild(shopEl);
function openShop(){const L=shopEl.querySelector('#shopList');L.innerHTML='';shopEl.querySelector('#shopBal').textContent='🪙 '+save.coins+' מטבעות';
 for(const it of SHOP){const own=save.shop.owned.includes(it.id),on=save.mods.wear.includes(it.id);const b=document.createElement('button');b.type='button';b.className='shopItem'+(own?' own':'')+(on?' on':'')+(!own&&save.coins<it.price?' poor':'');
  b.innerHTML='<b></b><strong></strong><small></small>';b.querySelector('b').textContent=it.icon;b.querySelector('strong').textContent=it.name;b.querySelector('small').textContent=own?(on?'✔ לבוש · להוריד':'ללבוש'):'🪙 '+it.price;
  b.onclick=()=>buy(it);L.appendChild(b)}shopEl.hidden=false}
function buy(it){if(save.shop.owned.includes(it.id)){toggleWear(it.id);openShop();return}
 if(save.coins<it.price){sayText(vendorB,'חסרים לך '+(it.price-save.coins)+' מטבעות, חמוד',2,'say',true);shopEl.querySelector('#shopBal').textContent='🪙 '+save.coins+' · חסרים '+(it.price-save.coins);return}
 addCoins(-it.price);save.shop.owned.push(it.id);writeSave();toggleWear(it.id);sayText(vendorB,pick(['תתחדש!','מהמם עליך!','הכי יפה בשכונה']),2,'say',true);addActivity('🛍️ קנית: '+it.icon+' '+it.name);hearts(pos.x,2,pos.z,10);openShop()}
shopEl.querySelector('#shopClose').onclick=()=>{shopEl.hidden=true};shopEl.addEventListener('click',e=>{if(e.target===shopEl)shopEl.hidden=true});
// ---------- neighbourhood events ----------
const EVN={cur:null,t:0,cool:40,last:'',done:false};
const evPill=document.createElement('div');evPill.id='evPill';evPill.hidden=true;document.body.appendChild(evPill);
let SHOWDOGS=null;const showDogs=()=>{if(!SHOWDOGS){SHOWDOGS=[makeDog({name:'רקסי',color:0x2b2622,size:.8,speed:2,x:0,z:-300}),makeDog({name:'פופי',color:0xf7f4ee,size:.55,speed:2,fluffy:true,x:0,z:-300})];for(const d of SHOWDOGS){d.g.visible=false;tierize(d.g)}}return SHOWDOGS};
// props (built once, hidden until their event)
const iceTruck=new THREE.Group();scene.add(iceTruck);{box(2,1.9,3.6,EM(0xf6f6f2),0,1.35,0,iceTruck);box(2.05,.4,3.65,EM(0xff8fb1),0,2.45,0,iceTruck);box(1.9,1.2,1.2,EM(0xff8fb1),0,1,2.3,iceTruck);box(1.7,.7,.06,new THREE.MeshBasicMaterial({color:0x9fd3e8}),0,1.3,2.92,iceTruck);
 const c=mesh(new THREE.ConeGeometry(.35,.9,10),EM(0xd9a557),0,3.05,0,iceTruck);c.rotation.x=Math.PI;ball(.4,EM(0xff8fb1),0,3.55,0,iceTruck);for(const [a,b] of [[-1,1.6],[1,1.6],[-1,-1.2],[1,-1.2]]){const w=cyl(.38,.3,EM(0x222222),a*1.02,.38,b,iceTruck);w.rotation.z=Math.PI/2}}iceTruck.visible=false;
const saleTable=new THREE.Group();scene.add(saleTable);{box(2,.08,1,EM(0x8b5a3a),0,.8,0,saleTable);for(const [a,b] of [[-.9,-.4],[.9,-.4],[-.9,.4],[.9,.4]])box(.06,.8,.06,EM(0x5a4a3a),a,.4,b,saleTable);box(.4,.3,.3,EM(0xc89b62),-.6,1,0,saleTable);ball(.15,EM(0x3a7bd5),0,1,0,saleTable);cyl(.1,.35,EM(0xe74c3c),.6,1.02,0,saleTable)}saleTable.visible=false;
const bbqGrill=new THREE.Group();scene.add(bbqGrill);{cyl(.45,.5,EM(0x222222),0,.75,0,bbqGrill);for(const s of [-1,1])cyl(.03,.6,EM(0x3a3d42),s*.3,.3,0,bbqGrill);for(let i=0;i<3;i++){const k=cyl(.05,.4,EM(0xa0522d),-.15+i*.15,1.03,0,bbqGrill);k.rotation.z=Math.PI/2}}bbqGrill.visible=false;
const showRing=new THREE.Mesh(new THREE.TorusGeometry(3,.08,6,40),new THREE.MeshBasicMaterial({color:0xf2c14e}));showRing.rotation.x=-Math.PI/2;showRing.position.set(24,.06,128.5);showRing.visible=false;scene.add(showRing);
const BALLOONS=[];{for(let i=0;i<10;i++){const g=new THREE.Group();scene.add(g);ball(.36,new THREE.MeshBasicMaterial({color:[0xff4d4d,0xffd93d,0x4da6ff,0xff8fb1,0x6bdc6b][i%5]}),0,0,0,g);cyl(.01,1,EM(0xffffff),0,-.85,0,g);g.visible=false;BALLOONS.push({g,on:false})}}
const BBQ_AT={x:-2.6,z:143.8};
const NEV={
 truck:{icon:'🍦',name:'משאית הגלידה עוברת ברחובות!',dur:100,where:()=>iceTruck.position,
  path:[[13,60],[13,116],[13,141],[13,156],[-40,156],[13,156],[58,156],[13,156],[13,141],[13,116],[13,60]],
  start(){iceTruck.visible=true;iceTruck.position.set(13,0,60);this.i=1;this.got=false},
  update(dt){const [x,z]=this.path[this.i],p=iceTruck.position,dx=x-p.x,dz=z-p.z,d=Math.hypot(dx,dz);if(d<.3){this.i=(this.i+1)%this.path.length}else{const s=Math.min(d,4.2*dt);p.x+=dx/d*s;p.z+=dz/d*s;iceTruck.rotation.y=Math.atan2(dx,dz)}
   if(Math.random()<dt*2)emit(p.x,3.8,p.z,(Math.random()-.5),1.5,(Math.random()-.5),'heart',.8);return this.got?'win':null},
  ctx(){if(this.got)return null;const p=iceTruck.position;return Math.hypot(pos.x-p.x,pos.z-p.z)<2.8?{i:'🍦',l:'גלידה!',on:1,fn:()=>{this.got=true;addCoins(12,'משאית הגלידה');milkyThought('😋',1.4,true);hearts(pos.x,2,pos.z,10)}}:null},
  end(){iceTruck.visible=false}},
 sale:{icon:'🏷️',name:'מכירת חצר בבית הריק!',dur:120,where:()=>V(40.2,0,159.2),
  start(){saleTable.visible=true;saleTable.position.set(40.2,0,161.6);this.got=false},update(){return this.got?'win':null},
  ctx(){if(this.got)return null;return Math.hypot(pos.x-40.2,pos.z-159.6)<2?{i:'🔍',l:'לחפש מציאה',on:1,fn:()=>{this.got=true;const free=SHOP.filter(s=>s.price<=60&&!save.shop.owned.includes(s.id));
    if(free.length&&Math.random()<.4){const it=pick(free);save.shop.owned.push(it.id);writeSave();toggleWear(it.id);showBanner('🎁 מצאת '+it.icon+' '+it.name+' בחינם!');addActivity('🎁 מכירת חצר: '+it.name)}
    else{const n=8+Math.floor(Math.random()*18);addCoins(n,'מכירת חצר');showBanner('🏷️ מצאת ארנק ישן עם '+n+' מטבעות!')}}}:null},
  end(){saleTable.visible=false}},
 bbq:{icon:'🍖',name:'על האש בגינה הציבורית!',dur:120,where:()=>V(BBQ_AT.x,0,BBQ_AT.z+1.6),
  start(){bbqGrill.visible=true;bbqGrill.position.set(BBQ_AT.x,0,BBQ_AT.z);this.got=false;this.t=0;this.guests=['rachel','amos','cohen'].map(id=>NEIGH.find(n=>n.id===id));
   this.guests.forEach((N,i)=>{N.evSpot={x:BBQ_AT.x+[-1.4,1.4,0][i],z:BBQ_AT.z+[.8,.8,1.9][i],face:Math.PI,out:[[BBQ_AT.x+[-1.4,1.4,0][i],151.5],[BBQ_AT.x,LANE_Z],J]}})},
  update(dt){if(Math.random()<dt*6)emit(BBQ_AT.x+(Math.random()-.5)*.5,1.1,BBQ_AT.z,(Math.random()-.5)*.3,1.3,(Math.random()-.5)*.3,'smoke',1.4);
   if(!this.got&&Math.hypot(pos.x-BBQ_AT.x,pos.z-BBQ_AT.z)<2.2&&curSpeed<.3&&jumpY<.1){this.t+=dt;holdShow('evBeg',this.t,4);if(this.t>=4){this.got=true;addCoins(15,'נקניקייה מהעל האש');for(const N of this.guests){frAdd(N,1)}sayText(this.guests[0].b,'קח נקניקייה, מתוק!',2,'say',true);milkyThought('🌭',1.4,true)}}else this.t=0;return this.got?'win':null},
  end(){bbqGrill.visible=false;for(const N of NEIGH)N.evSpot=null}},
 show:{icon:'🐕',name:'תחרות כלבים בכיכר!',dur:150,where:()=>showRing.position,
  start(){showRing.visible=true;this.st=0;this.k=0;this.score=0;this.t=0;const D=showDogs();D.forEach((d,i)=>{d.g.visible=true;d.g.position.set(24+[-3.8,3.8][i],0,131.8);d.g.rotation.y=Math.PI});this.seq=[...Array(3)].map(()=>pick(['jump','spin','fall']))},
  update(dt){const R=showRing.position,inRing=Math.hypot(pos.x-R.x,pos.z-R.z)<3;const N={jump:'🐾 קפיצה!',spin:'🌀 סיבוב במקום!',fall:'🤸 נפילה דרמטית!'};
   if(this.st===0){if(inRing){this.st=1;this.k=0;this.t=0;this.y0=yaw;this.acc=0;showBanner('🐕 השופטת: '+N[this.seq[0]])}return null}
   if(this.st===1){this.t+=dt;const want=this.seq[this.k];let d=yaw-this.y0;d=Math.atan2(Math.sin(d),Math.cos(d));this.acc+=Math.abs(d);this.y0=yaw;
    const did=want==='jump'?jumpY>.6:want==='spin'?this.acc>5.6:rag.active;
    if(did||this.t>6){if(did){this.score++;hearts(pos.x,2.2,pos.z,8);playToySound(660,.08,'triangle')}else milkyThought('😬',1,true);this.k++;this.t=0;this.acc=0;
     if(this.k>=3){this.st=2;const prize=[2,5,15,30][this.score];addCoins(prize,'תחרות כלבים');showBanner(['🎗️ תעודת השתתפות','🥉 מקום שלישי','🥈 מקום שני','🥇 מקום ראשון!'][this.score]+' · +'+prize+' 🪙');return 'win'}
     showBanner('🐕 השופטת: '+N[this.seq[this.k]])}}
   return null},
  hint(){return this.st===0?'🐕 היכנס לזירה הצהובה בכיכר':this.st===1?'עכשיו: '+({jump:'🐾 קפיצה',spin:'🌀 תסתובב במקום עם הג׳ויסטיק',fall:'🤸 כפתור נפילה'}[this.seq[this.k]])+' ('+(this.k+1)+'/3)':''},
  end(){showRing.visible=false;if(SHOWDOGS)for(const d of SHOWDOGS)d.g.visible=false}},
 balloons:{icon:'🎈',name:'בלונים בכיכר! לפוצץ בקפיצה',dur:60,where:()=>V(13,0,124),
  start(){this.n=0;BALLOONS.forEach((b,i)=>{b.on=true;b.g.visible=true;b.g.position.set(4+Math.random()*20,1.6+Math.random()*1.4,120+Math.random()*16);b.v=.12+Math.random()*.12})},
  update(dt){const t=performance.now()/1000;for(const b of BALLOONS){if(!b.on)continue;const p=b.g.position;p.y+=b.v*dt;p.x+=Math.sin(t*.7+p.z)*dt*.4;if(p.y>6.5){b.on=false;b.g.visible=false;continue}
    if(Math.hypot(pos.x-p.x,pos.z-p.z)<1.1&&Math.abs(jumpY+1.2-p.y)<1.1){b.on=false;b.g.visible=false;this.n++;addCoins(2);playToySound(300,.06,'square');for(let k=0;k<10;k++)emit(p.x,p.y,p.z,(Math.random()-.5)*4,(Math.random()-.5)*4,(Math.random()-.5)*4,'foam',.4)}}
   return BALLOONS.some(b=>b.on)?null:'win'},
  hint(){return '🎈 תקפוץ לתוך הבלונים ('+this.n+'/10)'},
  end(){for(const b of BALLOONS){b.on=false;b.g.visible=false}}}};
Object.assign(_holdLabels,{evBeg:'🥺 עושה פרצוף מסכן ליד המנגל...'});
function evStart(id){if(EVN.cur)evEnd(true);const E=NEV[id];EVN.cur=id;EVN.t=E.dur;EVN.last=id;E.start();showBanner('📣 '+E.icon+' '+E.name);addActivity('📣 אירוע: '+E.name)}
function evEnd(quiet){const E=NEV[EVN.cur];if(!E)return;E.end();EVN.cur=null;EVN.cool=120+Math.random()*60;evPill.hidden=true;if(!quiet)showBanner('📣 '+E.icon+' האירוע נגמר')}
// what the neighbours do during an event (BBQ guests walk over)
{const _nt=nbTarget;nbTarget=function(N){return N.evSpot||_nt(N)}}
function nevUpdate(dt){if(!ecoPlain()){if(EVN.cur&&!OPEN_WORLD)evEnd(true);evPill.hidden=true;return}
 if(!EVN.cur){EVN.cool-=dt;if(EVN.cool<=0){const ids=Object.keys(NEV).filter(k=>k!==EVN.last);evStart(pick(ids))}return}
 const E=NEV[EVN.cur];EVN.t-=dt;const r=E.update(dt);
 const W=E.where(),d=Math.round(Math.hypot(pos.x-W.x,pos.z-W.z));evPill.hidden=false;const l='📣 '+E.icon+' '+E.name+' · '+Math.ceil(EVN.t)+' שנ׳'+(d>6?' · '+d+'מ׳':'');if(evPill.textContent!==l)evPill.textContent=l;
 if(r==='win'){evEnd(true);return}if(EVN.t<=0)evEnd(false)}
CTX_HOOKS.act.unshift(()=>{if(!ecoPlain())return null;if(nearShop())return {i:'🛍️',l:'חנות כלבלב',on:1,fn:openShop};
 const E=EVN.cur&&NEV[EVN.cur];return E&&E.ctx?E.ctx():null});
// ---------- per frame / wiring ----------
const _uowE=updateOpenWorld;updateOpenWorld=function(dt){_uowE(dt);updateCoins(dt);nevUpdate(dt);
 const near=Math.hypot(pos.x-VENDOR.g.position.x,pos.z-VENDOR.g.position.z);if(near<30){animatePerson(VENDOR,0,dt,{arm:i=>i===0&&near<5?-1.3+Math.sin(performance.now()/250)*.3:0});updateFace(VENDOR.face,near<5?'smile':'neutral',dt)}
 if(SHOWDOGS&&EVN.cur==='show'){const t=performance.now()/1000;SHOWDOGS.forEach((d,i)=>{d.tail.rotation.z=Math.sin(t*12+i)*.6})}
 coinChip.style.display=OPEN_WORLD&&started&&!specialMode()?'':'none'};
{const _gsE=gameStep;gameStep=function(dt){_gsE(dt);if(!OPEN_WORLD){coinM.visible=false;coinChip.style.display='none';if(EVN.cur)evEnd(true)}}}
const _ctE=currentTarget;currentTarget=function(){const r=_ctE();if(r||!guideOn||!ecoPlain())return r;const E=EVN.cur&&NEV[EVN.cur];return E?E.where():null};
const _nthE=nextTaskHint;nextTaskHint=function(){const E=ecoPlain()&&EVN.cur&&NEV[EVN.cur];if(E){const W=E.where();if(E.hint&&Math.hypot(pos.x-W.x,pos.z-W.z)<14)return E.hint();if(Math.hypot(pos.x-W.x,pos.z-W.z)>14)return '📣 '+E.icon+' '+E.name}return _nthE()};
{const _dmE=drawMap;drawMap=function(){_dmE();const E=EVN.cur&&NEV[EVN.cur];const cv=document.getElementById('tmCanvas'),q=cv.getContext('2d'),W=cv.width,H=cv.height,s=Math.min(W/(MAPB.x1-MAPB.x0),H/(MAPB.z1-MAPB.z0));const X=x=>(MAPB.x1-x)*s,Y=z=>(z-MAPB.z0)*s;
 q.font='18px system-ui';q.textAlign='center';q.fillText('🛍️',X(SHOP_AT.x),Y(SHOP_AT.z));if(E){const p=E.where();q.font='22px system-ui';q.fillText('📣',X(p.x),Y(p.z))}}}
window.EVN=EVN;window.NEV=NEV;window.evStart=evStart;window.SHOP=SHOP;window.COINS=COINS;window.ECO_READY=true;
