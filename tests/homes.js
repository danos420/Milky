// רחוב הרימונים: houses, neighbours' routines, friendship, every neighbour's requests, bumping, saving, Rachel's house.
const {open}=require('./lib');
(async()=>{const {page,browser,errors}=await open(process.argv[2],{width:800,height:600},{noRaf:true});const ev=(f,a)=>page.evaluate(f,a);
await ev(()=>{localStorage.clear()});await page.reload();await page.waitForTimeout(800);
await ev(()=>{document.getElementById('startOpen').click();document.querySelector('#overlay').style.display='none';pos.set(13,0,156);for(let i=0;i<5;i++)gameStep(1/60)});
const out={};let fails=0;const ok=(name,cond,info)=>{console.log((cond?'PASS ':'FAIL ')+name+(info!==undefined?'  — '+JSON.stringify(info):''));if(!cond)fails++};
// routines: jump to the next phase, let them walk for 60s with Milky nearby
const mv=await ev(()=>{const st=NEIGH.map(N=>[N.P.g.position.x,N.P.g.position.z]);NBH.t=150.5;pos.set(-10,0,156);for(let i=0;i<60*60;i++){if(i%600==0)pos.set(-10+(i/600)*6,0,156);gameStep(1/60)}
 return NEIGH.map((N,i)=>({id:N.id,moved:+Math.hypot(N.P.g.position.x-st[i][0],N.P.g.position.z-st[i][1]).toFixed(1),nan:!isFinite(N.P.g.position.x)}))});
ok('neighbours walk to their next spot',mv.filter(m=>m.moved>2).length>=6&&!mv.some(m=>m.nan),mv.map(m=>m.id+':'+m.moved));
// greet: +1 friendship
const hi=await ev(()=>{const N=NEIGH.find(n=>n.id==='rachel');N.req=null;N.reqCool=999;const o=N.P.g.position;pos.set(o.x+1.2,0,o.z);gameStep(1/60);const f0=save.town.friends.rachel;const h=ctxHook('act');h&&h.fn();return {label:h&&h.l,f0,f1:save.town.friends.rachel}});
ok('saying hello adds friendship',hi.f1===hi.f0+1,hi);
// every neighbour, both requests
const req=await ev(()=>{const res=[];const near=o=>{pos.set(o.x+.9,0,o.z+.3);jumpY=0;rag.active=false;for(let i=0;i<3;i++)gameStep(1/60)};
 for(const N of NEIGH)for(let r=0;r<2;r++){N.req=null;N.reqCool=0;N.talk=0;NBH.carry=null;N.path=[];const f0=save.town.friends[N.id],d0=save.town.done[N.id]||0;
  near(N.P.g.position);const h=ctxHook('act');if(!h){res.push([N.id,r,'no hello']);continue}h.fn();const R=N.req&&N.req.r;if(!R){res.push([N.id,r,'no req']);continue}
  if(R.t==='fetch'||R.t==='boxes'){for(let k=0;k<(R.n||1);k++){const m=NB_ITEMS[N.req.item];near(m.position);const tk=ctxHook('act');if(!tk||tk.i!=='🐾'){res.push([N.id,r,'cant take',tk&&tk.l]);break}tk.fn();
    const dest=R.t==='boxes'?HB.cohen.door:N.P.g.position;near(dest);const gv=ctxHook('act');if(!gv||gv.i!=='🎁'){res.push([N.id,r,'cant give',gv&&gv.l]);break}gv.fn()}}
  else if(R.t==='still'){near(N.P.g.position);const s=ctxHook('act');s&&s.fn();for(let i=0;i<60*7;i++)gameStep(1/60)}
  else if(R.t==='cat'){for(let i=0;i<3;i++)gameStep(1/60);near(catM.position);for(let i=0;i<10;i++)gameStep(1/60)}
  res.push([N.id,r,R.t,(save.town.done[N.id]||0)-d0,save.town.friends[N.id]-f0])}
 return res});
const good=req.filter(r=>r[3]===1&&r[4]===3).length;ok('all 16 neighbour requests complete (+3 each)',good===16,req.filter(r=>!(r[3]===1&&r[4]===3)));
// bump into a neighbour at speed: -1
const bump=await ev(()=>{const N=NEIGH.find(n=>n.id==='amos');N.bump=0;const o=N.P.g.position;pos.set(o.x+.5,0,o.z);const f0=save.town.friends.amos;lastDogSpeed=7;jumpY=0;updateHomes(1/60);return {f0,f1:save.town.friends.amos}});
ok('running into a neighbour costs friendship',bump.f1===bump.f0-1,bump);
// Rachel's house: walk in through the door, camera stays inside
const inn=await ev(()=>{pos.set(0,0,158);yaw=0;camYaw=0;gameStep(1/60);for(let i=0;i<60*5&&pos.z<165;i++){stick.active=true;stick.mag=1;stick.x=0;stick.y=1;gameStep(1/60);if(i%4==0)renderFrame(1/60)}stick.active=false;for(let i=0;i<40;i++){gameStep(1/60);renderFrame(1/60)}
 const c=camera.position;return {z:+pos.z.toFixed(2),cam:[+c.x.toFixed(2),+c.y.toFixed(2),+c.z.toFixed(2)]}});
ok('walks into grandma Rachel\'s house',inn.z>164,inn);ok('camera stays inside her house',inn.cam[2]>162.3&&Math.abs(inn.cam[0])<4.1,inn.cam);
// the book
const bk=await ev(()=>{openBook();const n=document.querySelectorAll('#nbList .nbRow').length;document.getElementById('nbBook').hidden=true;return n});ok('neighbours book lists 8',bk===8,bk);
// saved and restored
const fsave=await ev(()=>JSON.stringify(save.town.friends));await page.reload();await page.waitForTimeout(800);
const fload=await ev(()=>JSON.stringify(save.town.friends));ok('friendships survive a reload',fsave===fload,[fsave,fload]);
// kart along the lane
const kart=await ev(()=>{document.getElementById('startOpen').click();document.querySelector('#overlay').style.display='none';pos.set(-38,0,156);yaw=Math.PI/2;camYaw=yaw;gameStep(1/60);carChip.click();DRIVE.K.h=Math.PI/2;keys.KeyW=true;for(let i=0;i<60*8;i++)gameStep(1/60);keys.KeyW=false;const x=DRIVE.K.x;carChip.click();return +x.toFixed(1)});
ok('kart drives along the lane',kart>10,kart);
const dc=await ev(()=>{pos.set(13,0,156);yaw=Math.PI/2;camYaw=yaw;for(let i=0;i<30;i++){gameStep(1/60);renderFrame(1/60)}renderer.info.autoReset=false;renderer.info.reset();renderFrame(1/60);const c=renderer.info.render.calls;renderer.info.autoReset=true;return c});
console.log('draw calls at the junction',dc);
console.log(fails?'FAIL homes '+fails:'PASS homes');console.log(errors.length?errors:'no page errors');await browser.close()})();
