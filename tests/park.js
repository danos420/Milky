const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);
 const step=n=>ev(`(()=>{for(let i=0;i<${n};i++)gameStep(1/60)})()`);const out={};
 out.closedNormal=await ev(()=>{started=true;document.querySelector('#overlay').style.display='none';reset();return {open:PARK_OPEN,walk:walkable(0,-45,.4),gate:walkable(0,-40.15,.3)}});
 await ev(()=>{save.day={completed:1};week.stars=[1,1,1,1];goToDay(4)});
 out.start=await ev(()=>({open:PARK_OPEN,gate:walkable(0,-40.15,.3),dani:[dani.position.x,dani.position.z],daniState}));
 // walk Milky from yard through the gate into the park
 await ev(()=>{pos.set(0,0,-36);yaw=Math.PI;camYaw=Math.PI;keys.KeyW=true});await step(120);await ev(()=>{keys.KeyW=false});
 out.walked=await ev(()=>({z:+pos.z.toFixed(1),done:day.done.has('enterPark')}));
 await wait(300);await page.screenshot({path:'tests/shots/park_enter.png'});
 // sniff all dogs
 for(const i of [0,1,2]){await ev(`(()=>{const d=DOGS[${i}];pos.set(d.g.position.x+1,0,d.g.position.z);jumpY=0;curSpeed=0;for(let k=0;k<90;k++)gameStep(1/60)})()`)}
 // tag
 await ev(()=>{pos.set(CHUPI.g.position.x+.6,0,CHUPI.g.position.z);curSpeed=0});await step(3);out.tagOn=await ev(()=>park.tagOn);
 await ev(()=>{pos.set(-15,0,-55);park.tagT=11.9});await step(20);
 await ev(()=>{pos.set(FOUNT.x,0,FOUNT.z+.6);curSpeed=0;grounded=true});await step(120);
 out.morning=await ev(()=>[...day.done]);await page.waitForFunction(()=>day.phase===1,null,{timeout:5000});
 // tunnel: run through
 await ev(()=>{pos.set(TUN.x0-1,0,TUN.z);yaw=Math.PI/2;camYaw=Math.PI/2;keys.KeyW=true});await step(100);await ev(()=>{keys.KeyW=false});
 out.tunnel=await ev(()=>({done:day.done.has('tunnel'),x:+pos.x.toFixed(1)}));
 await wait(200);await page.screenshot({path:'tests/shots/park_course.png'});
 // hurdles: jump over each
 for(const h of [0,1,2]){await ev(`(()=>{const h=HURDLES[${h}];pos.set(h.x-1.6,0,h.z);yaw=Math.PI/2;curSpeed=5;keys.KeyW=true;keys.ShiftLeft=true;keys.Space=true;for(let k=0;k<4;k++)gameStep(1/60);keys.Space=false;for(let k=0;k<60;k++)gameStep(1/60);keys.KeyW=false;keys.ShiftLeft=false})()`)}
 out.hurdles=await ev(()=>HURDLES.map(h=>h.done));
 await ev(()=>{pos.set(STAGE.x,0,STAGE.z);jumpY=1.0;grounded=true});await step(3);
 // fetch
 await ev(()=>{pos.set(dani.position.x+2,0,dani.position.z-1);throwParkBall()});await step(60);await ev(()=>{pos.set(pBall.position.x,0,pBall.position.z)});await step(3);out.held=await ev(()=>park.ballHeld);
 await ev(()=>{pos.set(dani.position.x+1,0,dani.position.z-.5)});await step(3);
 out.noon=await ev(()=>[...day.done]);console.log(JSON.stringify(out));await page.waitForFunction(()=>day.phase===2,null,{timeout:5000});
 await ev(()=>{pos.set(SAND.x,0,SAND.z);curSpeed=0;grounded=true;jumpY=0});await step(160);
 await ev(()=>{pos.set(MUD.x,0,MUD.z);jumpY=0});await step(5);out.muddy=await ev(()=>MUDDY);
 await wait(200);await page.screenshot({path:'tests/shots/park_mud.png'});
 await ev(()=>{pos.set(BONBON.g.position.x+1.3,0,BONBON.g.position.z);curSpeed=0});await step(220);
 await ev(()=>{pos.set(0,0,-6);jumpY=0});await step(5);
 out.eve=await ev(()=>[...day.done]);await wait(4300);
 out.end=await ev(()=>({finished:day.finished,next:document.getElementById('dayNextBtn').textContent,dani:daniState}));
 await ev(()=>{document.getElementById('dayEnd').hidden=true;goToDay(0)});out.after=await ev(()=>({open:PARK_OPEN,gate:walkable(0,-40.15,.3),dani:daniState,muddy:MUDDY}));
 console.log(JSON.stringify(out),errors);await browser.close()})();
