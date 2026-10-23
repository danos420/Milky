const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);
 const step=n=>ev(`(()=>{for(let i=0;i<${n};i++)gameStep(1/60)})()`);const out={};
 await ev(()=>{save.day={completed:1};week.stars=[1,1,1];started=true;document.querySelector('#overlay').style.display='none';goToDay(3)});
 await step(60*4);out.start=await ev(()=>({cur:week.cur,dadState,seated:dadSeated,look:sickLook.visible,items:SICK_PROPS.map(k=>shopProp(k).g.visible)}));
 // sneeze while standing in front of dad
 await ev(()=>{const fx=Math.sin(dad.rotation.y),fz=Math.cos(dad.rotation.y);pos.set(dad.position.x+fx*1.6,0,dad.position.z+fz*1.6);jumpY=0;sick.sneezeT=.05});await step(3);
 out.sneeze=await ev(()=>({rag:rag.active,done:day.done.has('sneezed')}));await wait(150);await page.screenshot({path:'tests/shots/sick_sneeze.png'});
 await step(150);
 // warm feet
 await ev(()=>{pos.set(dad.position.x+1.3,0,dad.position.z-.3);jumpY=0;curSpeed=0;grounded=true});await step(220);
 // slipper
 await ev(()=>{pos.set(slipper.position.x,0,slipper.position.z+.6);stealSlipper()});out.carry=await ev(()=>slipperState);
 await ev(()=>{pos.set(dad.position.x+1.2,0,dad.position.z-.6);dropSlipper()});await step(5);
 // tissues
 await ev(()=>{const t=shopProp('tissues');t.g.position.set(dad.position.x+1.2,0,dad.position.z-.8)});await step(5);
 out.morning=await ev(()=>[...day.done]);
 await page.waitForFunction(()=>day.phase===1,null,{timeout:5000});
 // soup: jump onto counter near pot
 await ev(()=>{pos.set(stovePot.position.x,0,stovePot.position.z-.1);jumpY=.95;grounded=true});await step(3);
 await ev(()=>{pos.set(0,0,5);jumpY=0;const th=shopProp('thermo');th.g.position.set(BED.x+1.4,0,BED.z)});await step(5);
 await ev(()=>{dayEvent('remote');pos.set(dad.position.x+1.5,0,dad.position.z-1.5);sickFlip()});
 out.noon=await ev(()=>[...day.done]);
 await page.waitForFunction(()=>day.phase===2,null,{timeout:5000});
 await ev(()=>{const b=extras.find(p=>p.kind==='bowl');b.g.position.set(dad.position.x+1.2,0,dad.position.z-1)});await step(5);
 await ev(()=>{pos.set(dad.position.x+1.2,0,dad.position.z-1.2);jumpY=0;startRagdoll()});await step(200);
 await ev(()=>{dadPetCooldown=0;setDadState('pet')});await step(10);
 await ev(()=>{tvOn=true;pos.set(-4.8,0,1.3);jumpY=1.03;grounded=true;curSpeed=0});await step(200);
 out.eve=await ev(()=>[...day.done]);await wait(4300);
 out.end=await ev(()=>({finished:day.finished,next:document.getElementById('dayNextBtn').textContent}));
 await ev(()=>{document.getElementById('dayEnd').hidden=true;goToDay(0)});out.after=await ev(()=>({look:sickLook.visible,dadState,items:SICK_PROPS.map(k=>shopProp(k).g.visible)}));
 console.log(JSON.stringify(out),errors);
 await ev(()=>{goToDay(3);pos.set(2.6,0,5.6);yaw=.9;camYaw=.6;orbitAngle=0;for(let i=0;i<200;i++)gameStep(1/60)});await wait(300);await page.screenshot({path:'tests/shots/sick_dad.png'});
 await browser.close()})();
