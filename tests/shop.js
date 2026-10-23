const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);
 const step=n=>ev(`(()=>{for(let i=0;i<${n};i++)gameStep(1/60)})()`);const out={};
 await ev(()=>{save.day={completed:1};week.stars=[1,1];started=true;document.querySelector('#overlay').style.display='none';goToDay(2)});
 out.start=await ev(()=>({cur:week.cur,tasks:DAY[0].tasks.map(t=>t.id).join(','),dadVis:dad.visible,dadState,hiddenItems:['baguette','can','receipt'].map(k=>shopProp(k).g.visible)}));
 await step(120);out.dadStill=await ev(()=>[dadState,dad.visible]);
 // armchair nap
 await ev(()=>{pos.set(4.3,0,7.85);jumpY=.7;grounded=true;curSpeed=0});await step(200);
 // tp trail: grab roll, run around
 await ev(()=>{const tp=shopProp('tp');pos.set(tp.g.position.x,0,tp.g.position.z+.9);yaw=Math.PI;jumpY=0;curSpeed=0;for(let i=0;i<3;i++)gameStep(1/60);toggleGrab()});
 out.tpGrab=await ev(()=>grab&&grab.b.kind);
 await ev(()=>{keys.KeyW=true;keys.ShiftLeft=true;keys.KeyA=true});await step(60*5);await ev(()=>{keys.KeyW=false;keys.ShiftLeft=false;keys.KeyA=false});
 out.trail=await ev(()=>({len:+shop.trail.toFixed(1),n:tpTrail.count}));
 await wait(200);await page.screenshot({path:'tests/shots/shop_tp.png'});
 await ev(()=>{releaseGrab(false);dayEvent('remote');dayEvent('snack')});
 out.morning=await ev(()=>[...day.done]);await wait(1700);
 out.noon=await ev(()=>({phase:day.phase,dadVis:dad.visible,dadState,items:['baguette','can','receipt'].map(k=>shopProp(k).g.visible),bags:bags.visible}));
 await step(60);await wait(200);
 await ev(()=>{pos.set(.9,0,-5.2);yaw=Math.PI;camYaw=Math.PI;jumpY=0;for(let i=0;i<10;i++)gameStep(1/60)});await page.screenshot({path:'tests/shots/shop_bags.png'});
 // big bag on head
 await ev(()=>{pos.set(bigBag.position.x,0,bigBag.position.z+.4);jumpY=0});await step(3);out.headBag=await ev(()=>headBag.visible);
 await wait(100);await page.screenshot({path:'tests/shots/shop_headbag.png'});
 await step(60*6);
 // receipt via interact
 await ev(()=>{const r=shopProp('receipt');pos.set(r.g.position.x,0,r.g.position.z+.7);interact()});
 // can roll
 await ev(()=>{pos.set(-3,0,3);const c=shopProp('can');c.vx=0;c.vz=4});await step(90);
 // baguette to yard
 await ev(()=>{const b=shopProp('baguette');pos.set(b.g.position.x,0,b.g.position.z+.8);yaw=Math.PI;for(let i=0;i<3;i++)gameStep(1/60);toggleGrab()});out.bagGrab=await ev(()=>grab&&grab.b.kind);
 await ev(()=>{pos.set(-1.2,0,-10)});await step(5);
 out.noonDone=await ev(()=>[...day.done]);await ev(()=>releaseGrab(false));await wait(1700);
 await page.waitForFunction(()=>day.phase===2,null,{timeout:5000});out.eve=await ev(()=>({phase:day.phase,chicken:chicken.visible}));
 await ev(()=>{pos.set(STOVE.x,0,14.5);jumpY=0;curSpeed=0;grounded=true});await step(200);
 await ev(()=>{pos.set(chicken.position.x,0,chicken.position.z);jumpY=.8;grounded=true});await step(3);
 await wait(100);await page.screenshot({path:'tests/shots/shop_drum.png'});
 await ev(()=>{pos.set(DTABLE.x,0,DTABLE.z+1.5);jumpY=0;trainingIndex=0;train()});await step(5);
 await ev(()=>{pos.set(-4.8,0,1.3);jumpY=1.03;grounded=true;curSpeed=0});await step(200);
 out.eveDone=await ev(()=>[...day.done]);await wait(4200);
 out.end=await ev(()=>({finished:day.finished,next:document.getElementById('dayNextBtn').textContent}));
 await ev(()=>{document.getElementById('dayEnd').hidden=true;goToDay(0)});out.normalAfter=await ev(()=>({dadVis:dad.visible,dadState,items:['baguette','can','receipt'].map(k=>shopProp(k).g.visible),chicken:chicken.visible}));
 console.log(JSON.stringify(out),errors);await browser.close()})();
