const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);
 const step=n=>ev(`(()=>{for(let i=0;i<${n};i++)gameStep(1/60)})()`);const out={};
 await ev(()=>{started=true;document.querySelector('#overlay').style.display='none';reset()});
 // enter through the vet door
 await ev(()=>{pos.set(18.2,0,12.7);yaw=Math.PI/2;camYaw=yaw;keys.KeyW=true});await step(80);await ev(()=>{keys.KeyW=false});
 out.enter=await ev(()=>({x:+pos.x.toFixed(2),z:+pos.z.toFixed(2),inVet:inVet()}));await wait(2500);await page.screenshot({path:'tests/shots/vet_in.png'});
 // treats
 await ev(()=>{pos.set(JAR.x,0,JAR.z+1.1);ctxT=0;updateCtxButtons(1)});out.ctxTreat=await ev(()=>actBtn.textContent);await ev(()=>actBtn.click());
 // scale
 await ev(()=>{pos.set(SCALE.x,0,SCALE.z);curSpeed=0;jumpY=0;grounded=true});await step(150);
 // cat + iguana
 await ev(()=>{pos.set(carrier.position.x+.3,0,carrier.position.z-1.2);curSpeed=0});await step(70);
 await ev(()=>{pos.set(igTank.position.x,0,igTank.position.z-1.3);curSpeed=0});await step(260);
 // cone
 await ev(()=>{pos.set(CONES.x-1.1,0,CONES.z);ctxT=0;updateCtxButtons(1)});out.ctxCone=await ev(()=>actBtn.textContent);await ev(()=>actBtn.click());await wait(1500);await page.screenshot({path:'tests/shots/vet_cone.png'});
 // shot chase: enter exam zone, then run around the street 15s
 await ev(()=>{pos.set(25.2,0,15.4)});await step(5);out.chase=await ev(()=>vet.state);await ev(()=>{pos.set(23,0,12.7)});await step(60);await ev(()=>{pos.set(21,0,12.7)});await step(20);
 await wait(300);await page.screenshot({path:'tests/shots/vet_chase.png'});
 await ev(()=>{pos.set(10,0,35)});await step(60*16);out.escaped=await ev(()=>[vet.state,challengesDone.has('vetEscape')]);
 // brave: lie on the exam table after calm period
 await ev(()=>{vet.state='idle';pos.set(EXAM.x,0,EXAM.z);jumpY=.9;grounded=true;curSpeed=0;vet.state='calm';vet.t=0});await step(220);
 out.done=await ev(()=>['vetScale','vetTreats','vetEscape','vetBrave','vetCat','vetIguana','vetCone'].map(id=>challengesDone.has(id)?1:0));
 out.cone=await ev(()=>isUnlocked(WEAR_DEFS.find(w=>w.id==='cone')));out.count=await ev(()=>document.getElementById('challengeCount').textContent);
 // leave
 await ev(()=>{pos.set(21.5,0,12.7);jumpY=0;yaw=-Math.PI/2;keys.KeyW=true});await step(80);await ev(()=>{keys.KeyW=false});out.left=await ev(()=>+pos.x.toFixed(2));
 console.log(JSON.stringify(out),errors);await browser.close()})();
