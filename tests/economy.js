// Coins, the pet shop, faster walking in town, and the five neighbourhood events.
const {open}=require('./lib');
(async()=>{const {page,browser,errors}=await open(process.argv[2],{width:800,height:600},{noRaf:true});const ev=(f,a)=>page.evaluate(f,a);let fails=0;
const ok=(n,c,i)=>{console.log((c?'PASS ':'FAIL ')+n+(i!==undefined?'  — '+JSON.stringify(i):''));if(!c)fails++};
await ev(()=>localStorage.clear());await page.reload();await page.waitForTimeout(800);
await ev(()=>{document.getElementById('startOpen').click();document.querySelector('#overlay').style.display='none';EVN.cool=1e9;for(let i=0;i<3;i++)gameStep(1/60)});
// speed: town vs the street at home
const sp=await ev(()=>{const run=(x,z)=>{pos.set(x,0,z);yaw=0;camYaw=0;curSpeed=0;for(let i=0;i<10;i++)gameStep(1/60);const z0=pos.z;stick.active=true;stick.mag=1;stick.x=0;stick.y=1;for(let i=0;i<120;i++)gameStep(1/60);stick.active=false;return +(pos.z-z0).toFixed(2)};return {street:run(13,4),town:run(13,60)}});
ok('Milky is faster in town',sp.town>sp.street*1.2,sp);
// coins on the street: pick one up, it comes back later
const pk=await ev(()=>{const c=COINS[0],c0=save.coins;pos.set(c.x,0,c.z);jumpY=0;gameStep(1/60);const got=save.coins-c0;const back=c.back;pos.set(c.x+5,0,c.z);gameStep(1/60);c.back=.01;gameStep(1/60);gameStep(1/60);return {got,back:Math.round(back),again:c.back<=0}});
ok('picking up a coin',pk.got===1&&pk.back>100&&pk.again,pk);
// a coin on top of the café table needs a jump
const jt=await ev(()=>{const c=COINS.find(c=>c.y>1.5);const c0=save.coins;pos.set(c.x+.5,0,c.z+1.2);jumpY=0;gameStep(1/60);const low=save.coins-c0;pos.set(c.x,0,c.z);jumpY=1.1;velocityY=0;grounded=true;gameStep(1/60);return {low,high:save.coins-c0-low}});
ok('high coins need a jump',jt.low===0&&jt.high===1,jt);
// helping a neighbour pays 15, a side mission 10
const nb=await ev(()=>{const N=NEIGH[0];N.req={r:N.reqs[0],st:'taken',item:'yarn'};const c0=save.coins;nbDone(N);const a=save.coins-c0;const id=challengeDefs.find(([i])=>!challengesDone.has(i))[0];const c1=save.coins;completeChallenge(id);return {nb:a,ch:save.coins-c1}});
ok('neighbour +15, side mission +10',nb.nb===15&&nb.ch===10,nb);
// the shop: too poor, then buy, wear, slots
const sh=await ev(()=>{save.coins=20;pos.set(39,0,138);gameStep(1/60);const h=ctxHook('act');const label=h&&h.l;h&&h.fn();const open=!document.getElementById('shopM').hidden;
 const cap=SHOP.find(s=>s.id==='cap');buy(cap);const poor=!save.shop.owned.includes('cap');save.coins=500;buy(cap);const owned=save.shop.owned.includes('cap'),worn=WEAR.cap.visible;
 buy(SHOP.find(s=>s.id==='tophat'));const swap=WEAR.tophat.visible&&!WEAR.cap.visible;buy(SHOP.find(s=>s.id==='scarf'));const both=WEAR.tophat.visible&&WEAR.scarf.visible;
 const inWardrobe=WEAR_DEFS.some(d=>d.id==='cap'&&isUnlocked(d));document.getElementById('shopM').hidden=true;return {label,open,poor,owned,worn,swap,both,inWardrobe,coins:save.coins}});
ok('shop opens from the button',sh.label==='חנות כלבלב'&&sh.open,sh);ok('cannot buy without coins',sh.poor);ok('buying puts it on',sh.owned&&sh.worn);
ok('one hat at a time, scarf goes with the hat',sh.swap&&sh.both,sh);ok('bought items are in the wardrobe',sh.inWardrobe);ok('coins were paid',sh.coins===500-30-60-40,sh.coins);
// events
const near=(x,z)=>ev(([x,z])=>{pos.set(x,0,z);jumpY=0;rag.active=false;gameStep(1/60)},[x,z]);
const res={};
for(const id of ['truck','sale','bbq','show','balloons']){
 const r=await ev(id=>{evStart(id);const E=NEV[id];const c0=save.coins;let n=0;const step=k=>{for(let i=0;i<k;i++)gameStep(1/60)};
  if(id==='truck'){step(30);const p=E.where();pos.set(p.x+1.5,0,p.z);gameStep(1/60);const h=ctxHook('act');h&&h.fn();step(2)}
  if(id==='sale'){pos.set(40.2,0,159.6);gameStep(1/60);const h=ctxHook('act');h&&h.fn();step(2)}
  if(id==='bbq'){pos.set(BBQ_AT.x+.8,0,BBQ_AT.z+.8);curSpeed=0;step(60*5)}
  if(id==='show'){pos.set(24,0,128.5);step(3);for(let k=0;k<3;k++){const w=E.seq[E.k];if(w==='jump'){jumpY=1;gameStep(1/60);jumpY=0}else if(w==='spin'){for(let i=0;i<40;i++){yaw+=.2;gameStep(1/60)}}else{startRagdoll();step(2);rag.active=false}step(2)}}
  if(id==='balloons'){for(const b of BALLOONS){if(!b.on)continue;const p=b.g.position;pos.set(p.x,0,p.z);jumpY=Math.max(0,p.y-1.2);gameStep(1/60)}jumpY=0;step(2)}
  return {over:EVN.cur===null,coins:save.coins-c0}},id);res[id]=r;
 ok('event '+id+' can be won',r.over&&r.coins>0,r)}
// events come by themselves and end on their own
const auto=await ev(()=>{EVN.cool=.01;gameStep(1/60);const started=EVN.cur;EVN.t=.01;gameStep(1/60);return {started,ended:EVN.cur===null}});
ok('events start and end by themselves',!!auto.started&&auto.ended,auto);
// saved
const s1=await ev(()=>JSON.stringify({c:save.coins,o:save.shop.owned}));await page.reload();await page.waitForTimeout(800);const s2=await ev(()=>JSON.stringify({c:save.coins,o:save.shop.owned}));
ok('coins and items survive a reload',s1===s2,[s1,s2]);
// not in other modes
const z=await ev(()=>{epBoard('zombie');document.getElementById('epBoard').hidden=true;EP.cur.start(0);for(let i=0;i<10;i++)gameStep(1/60);return {coins:coinM.visible,chip:coinChip.style.display}});
ok('no coins in zombie mode',!z.coins&&z.chip==='none',z);
console.log(fails?'FAIL economy '+fails:'PASS economy');console.log(errors.length?errors:'no page errors');await browser.close()})();
