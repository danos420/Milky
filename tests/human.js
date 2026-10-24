const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);
 const step=n=>ev(`(()=>{for(let i=0;i<${n};i++)gameStep(1/60)})()`);const out={};
 await ev(()=>localStorage.removeItem('milky-mode'));await page.click('#startHuman');await wait(5000);
 out.start=await ev(()=>({H:HUMAN,hat:hat.visible,i:hs.i,pill:evtPill.textContent}));
 await ev(()=>{pos.set(2,0,4);yaw=0;camYaw=Math.PI;keys.KeyW=true});await step(60);await ev(()=>{keys.KeyW=false});await wait(300);await page.screenshot({path:'tests/shots/h_walk.png'});
 out.legs=await ev(()=>legs.map(l=>+l.pivot.rotation.x.toFixed(2)));
 // milk
 await ev(()=>{pos.set(24.4,0,6.2);ctxT=0;updateCtxButtons(1)});out.ctxMilk=await ev(()=>actBtn.textContent);await ev(()=>actBtn.click());await wait(4200);
 out.milk1=await ev(()=>({step:hs.step,chase:street.bamba.state,milk:milkG.visible}));await page.screenshot({path:'tests/shots/h_kiosk.png'});
 await ev(()=>{pos.set(12,0,35)});await step(60*9);await wait(2800);out.afterMilk=await ev(()=>({i:hs.i,f:hs.fiascos}));
 // vet
 await ev(()=>{pos.set(22.5,0,13)});await step(5);await wait(3300);out.vet1=await ev(()=>({step:hs.step,vet:vet.state}));
 await ev(()=>{pos.set(12,0,35)});await step(60*17);await wait(2800);out.afterVet=await ev(()=>({i:hs.i,f:hs.fiascos.length}));
 // pizza
 await ev(()=>{pos.set(PCOUNTER.x-1.2,0,PCOUNTER.z);ctxT=0;updateCtxButtons(1)});out.ctxOrder=await ev(()=>actBtn.textContent);await ev(()=>actBtn.click());await step(250);
 out.fire=await ev(()=>({step:hs.step,fire:hs.fire,hint:nextTaskHint()}));
 await ev(()=>{pos.set(EXT_WALL.x+.7,0,EXT_WALL.z);ctxT=0;updateCtxButtons(1);actBtn.click()});await ev(()=>{pos.set(OVEN.x-1.5,0,OVEN.z);yaw=Math.PI/2;ctxT=0;updateCtxButtons(1)});out.ctxSpray=await ev(()=>actBtn.textContent);await ev(()=>actBtn.click());
 await wait(1800);await page.screenshot({path:'tests/shots/h_pizza.png'});await wait(2600);out.afterPizza=await ev(()=>({i:hs.i,f:hs.fiascos.length}));
 // hair
 await ev(()=>{pos.set(GTABLE.x,0,GTABLE.z);jumpY=.95;grounded=true;curSpeed=0});await step(200);await wait(1500);await page.screenshot({path:'tests/shots/h_hair.png'});await wait(3000);
 out.afterHair=await ev(()=>({i:hs.i,mohawk:mohawk.visible}));
 // home
 await ev(()=>{rag.active=false;jumpY=0;grounded=true;pos.set(dad.position.x+1.5,0,dad.position.z)});await step(3);await wait(1800);await page.screenshot({path:'tests/shots/h_home.png'});await wait(9000);
 out.end=await ev(()=>({i:hs.i,f:hs.fiascos,modal:!document.getElementById('hEnd').hidden}));await page.screenshot({path:'tests/shots/h_end.png'});
 await ev(()=>document.getElementById('hQuit').click());out.quit=await ev(()=>({H:HUMAN,hat:hat.visible,mohawk:mohawk.visible}));
 console.log(JSON.stringify(out),errors);await browser.close()})();
