const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);
 const step=n=>ev(`(()=>{for(let i=0;i<${n};i++)gameStep(1/60)})()`);const out={};
 await ev(()=>{started=true;document.querySelector('#overlay').style.display='none';reset()});
 // walk from living room through the front door
 await ev(()=>{pos.set(4.8,0,6.2);yaw=Math.PI/2;camYaw=yaw;keys.KeyW=true});await step(90);await ev(()=>{keys.KeyW=false});
 out.door=await ev(()=>({x:+pos.x.toFixed(2),z:+pos.z.toFixed(2)}));
 await wait(400);await page.screenshot({path:'tests/shots/st_door.png'});
 // car stops for Milky on the road
 await ev(()=>{pos.set(11.4,0,20);jumpY=0;CARS[0].z=27;CARS[0].cur=4});await step(120);out.car=await ev(()=>({z:+CARS[0].z.toFixed(1),cur:+CARS[0].cur.toFixed(2),done:challengesDone.has('stopCar')}));
 await ev(()=>{pos.set(13,0,10);yaw=0;camYaw=Math.PI;orbitHeight=4});await wait(500);await page.screenshot({path:'tests/shots/st_street.png'});
 // pigeons
 await ev(()=>{pos.set(BENCH.x+1.6,0,BENCH.z-3);yaw=0;camYaw=0;keys.KeyW=true;keys.ShiftLeft=true});await step(40);await ev(()=>{keys.KeyW=false;keys.ShiftLeft=false});
 out.pigeons=await ev(()=>({done:challengesDone.has('pigeons'),flying:PIGEONS.filter(p=>p.fly>0).length}));await wait(200);await page.screenshot({path:'tests/shots/st_pigeons.png'});
 // cats
 for(const i of [0,1,2])await ev(`(()=>{const h=SCATS[${i}].home;pos.set(h[0]-1.1,0,h[2]);gameStep(1/60)})()`);
 out.cats=await ev(()=>challengesDone.has('streetCat'));
 // parrot
 await ev(()=>{pos.set(9,0,26);street.parrotT=0});await step(60*11);out.parrot=await ev(()=>[street.parrotHeard.size,challengesDone.has('parrot')]);
 // guard dog
 await ev(()=>{pos.set(18.9,0,42.2);curSpeed=0});await step(60);await ev(()=>{trainingIndex=0;train()});await step(3);out.guard=await ev(()=>street.guardFriend);
 await wait(200);await page.screenshot({path:'tests/shots/st_guard.png'});
 // kiosk: enter through its door
 await ev(()=>{pos.set(18.2,0,5.1);yaw=Math.PI/2;camYaw=yaw;keys.KeyW=true});await step(70);await ev(()=>{keys.KeyW=false});
 out.kiosk=await ev(()=>({x:+pos.x.toFixed(2),z:+pos.z.toFixed(2)}));await wait(400);await page.screenshot({path:'tests/shots/st_kiosk.png'});
 // ice cream via context button
 await ev(()=>{pos.set(FREEZER.x,0,FREEZER.z+1.1);jumpY=0;ctxT=0;updateCtxButtons(1)});out.ctx=await ev(()=>actBtn.textContent);await ev(()=>actBtn.click());out.ice=await ev(()=>challengesDone.has('iceCream'));
 // bamba heist
 await step(130);
 await ev(()=>{pos.set(BAMBA_HOME.x,0,BAMBA_HOME.z+.8);yaw=Math.PI;for(let i=0;i<3;i++)gameStep(1/60);toggleGrab()});out.grab=await ev(()=>grab&&grab.b.kind);
 await ev(()=>{pos.set(15,0,30)});await step(60*9);out.bamba=await ev(()=>({state:street.bamba.state,done:challengesDone.has('bamba')}));
 // jogger
 await ev(()=>{const o=JOGGER.g.position;o.set(17.9,0,0);PEOPLE[0].dir=1;pos.set(16.6,0,0);yaw=0;keys.KeyW=true;keys.ShiftLeft=true});
 for(let k=0;k<40;k++)await ev(()=>{const o=JOGGER.g.position;pos.x=16.6;pos.z=o.z;for(let i=0;i<10;i++)gameStep(1/60)});await ev(()=>{keys.KeyW=false;keys.ShiftLeft=false});
 out.jogger=await ev(()=>challengesDone.has('jogger'));
 // back home through the door
 await ev(()=>{pos.set(8,0,6.2);yaw=-Math.PI/2;keys.KeyW=true});await step(90);await ev(()=>{keys.KeyW=false});out.home=await ev(()=>+pos.x.toFixed(2));
 out.count=await ev(()=>document.getElementById('challengeCount').textContent);
 console.log(JSON.stringify(out),errors);await browser.close()})();
