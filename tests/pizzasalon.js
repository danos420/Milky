const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);
 const step=n=>ev(`(()=>{for(let i=0;i<${n};i++)gameStep(1/60)})()`);const out={};
 await ev(()=>{localStorage.removeItem('milky-mode');started=true;document.querySelector('#overlay').style.display='none';reset()});
 await ev(()=>{pos.set(18.2,0,22.7);yaw=Math.PI/2;camYaw=yaw;keys.KeyW=true});await step(80);await ev(()=>{keys.KeyW=false});
 out.enterP=await ev(()=>({x:+pos.x.toFixed(2),inPiz:inPiz()}));await wait(2500);await page.screenshot({path:'tests/shots/ps_pizza.png'});
 // dough: wait for a toss and stand under it
 out.dough=await ev(()=>{ps.doughT=0;for(let i=0;i<5;i++)gameStep(1/60);let caught=false;for(let i=0;i<120&&!caught;i++){pos.x=dough.position.x;pos.z=dough.position.z;jumpY=0;gameStep(1/60);caught=challengesDone.has('catchDough')}return caught});
 for(let i=0;i<3;i++)await ev(()=>{pos.set(FALAFEL.x-.3,0,FALAFEL.z-1.1);ps.falafelCool=0;ctxT=0;updateCtxButtons(1);actBtn.click()});
 await ev(()=>{pos.set(CHILI.x,0,CHILI.z-1.1);ctxT=0;updateCtxButtons(1)});out.ctxChili=await ev(()=>actBtn.textContent);await ev(()=>actBtn.click());await step(20);await wait(150);await page.screenshot({path:'tests/shots/ps_chili.png'});
 // delivery
 await ev(()=>{pos.set(PBOX_HOME.x,0,PBOX_HOME.z+.8);yaw=Math.PI;for(let i=0;i<3;i++)gameStep(1/60);toggleGrab()});out.grab=await ev(()=>grab&&grab.b.kind);
 await ev(()=>{pos.set(dad.position.x+1.2,0,dad.position.z)});await step(5);
 // salon
 await ev(()=>{releaseGrab(false);pos.set(18.2,0,32.7);yaw=Math.PI/2;camYaw=yaw;keys.KeyW=true});await step(80);await ev(()=>{keys.KeyW=false});out.enterS=await ev(()=>inSal());
 await ev(()=>{pos.set(STUB.x,0,STUB.z);jumpY=0});await step(5);
 await ev(()=>{pos.set(GTABLE.x,0,GTABLE.z-1.5);jumpY=0;curSpeed=0;grounded=true;wet=1});await step(150);
 await ev(()=>{pos.set(DRYER.x-.9,0,DRYER.z);curSpeed=0});await step(170);await wait(1500);await page.screenshot({path:'tests/shots/ps_dry.png'});
 await ev(()=>{pos.set(GROOMER.g.position.x,0,GROOMER.g.position.z-1.3);ctxT=0;updateCtxButtons(1);actBtn.click()});
 await ev(()=>{pos.set(MIRROR.x-1.1,0,MIRROR.z);curSpeed=0});await step(140);
 await wait(1500);await page.screenshot({path:'tests/shots/ps_salon.png'});
 out.done=await ev(()=>['catchDough','falafel','chili','delivery','groomBath','dryer','bow','mirror','pipiShake'].map(id=>challengesDone.has(id)?1:0));out.count=await ev(()=>document.getElementById('challengeCount').textContent);
 console.log(JSON.stringify(out),errors);await browser.close()})();
