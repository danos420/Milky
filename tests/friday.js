const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);
 const step=n=>ev(`(()=>{for(let i=0;i<${n};i++)gameStep(1/60)})()`);const out={};
 await ev(()=>{save.day={completed:1};week.stars=[1,1,1,1,1];started=true;document.querySelector('#overlay').style.display='none';goToDay(5)});
 await step(120);out.start=await ev(()=>({cur:week.cur,dadState,cloth:cloth.visible,broom:broom.visible,guests:GUESTS.map(g=>g.P.g.visible)}));
 await ev(()=>{pos.set(dad.position.x+1,0,dad.position.z);jumpY=0});await step(5);
 await ev(()=>{pos.set(DTABLE.x,0,DTABLE.z-1.4);jumpY=0;ctxT=0;updateCtxButtons(1)});out.ctx=await ev(()=>actBtn.textContent);
 await ev(()=>actBtn.click());await step(60);await wait(200);await page.screenshot({path:'tests/shots/fri_cloth.png'});
 await ev(()=>{dayEvent('sausage');pos.set(-1.2,0,-7.9);curSpeed=0;grounded=true});await step(200);
 out.morning=await ev(()=>[...day.done]);await page.waitForFunction(()=>day.phase===1,null,{timeout:5000});
 await step(60*6);out.noon0=await ev(()=>({guests:GUESTS.map(g=>[+g.P.g.position.x.toFixed(1),+g.P.g.position.z.toFixed(1)]),chase:fam.kidChase}));
 await wait(200);await page.screenshot({path:'tests/shots/fri_guests.png'});
 // hug: stand still next to kid
 await ev(()=>{const k=KID1.g.position;pos.set(k.x+.7,0,k.z);curSpeed=0;jumpY=0});await step(150);
 // escape
 await ev(()=>{fam.escape=19.95;GUESTS.forEach(g=>g.hugT=0);pos.set(5,0,-15)});await step(10);
 // slipper to bro1
 await ev(()=>{pos.set(slipper.position.x,0,slipper.position.z+.6);stealSlipper();const b=BRO1.g.position;pos.set(b.x+1,0,b.z);dropSlipper()});await step(5);
 await ev(()=>{const b=BRO1.g.position;pos.set(b.x+2,0,b.z);familyFlip()});
 out.noon=await ev(()=>[...day.done]);await page.waitForFunction(()=>day.phase===2,null,{timeout:5000});
 await step(60*8);out.dinnerPos=await ev(()=>({dad:[+dad.position.x.toFixed(1),+dad.position.z.toFixed(1)],dani:[+dani.position.x.toFixed(1),+dani.position.z.toFixed(1),daniState],g:GUESTS.map(g=>[+g.P.g.position.x.toFixed(1),+g.P.g.position.z.toFixed(1)])}));
 await ev(()=>{pos.set(DTABLE.x,0,DTABLE.z-1.25);jumpY=0;curSpeed=0;grounded=true});await step(220);
 await wait(200);await page.screenshot({path:'tests/shots/fri_dinner.png'});
 await ev(()=>{pos.set(DTABLE.x,0,DTABLE.z);jumpY=.8;grounded=true});await step(3);
 for(const k of ['BRO1','BRO2']){await ev(`(()=>{const o=${k}.g.position;pos.set(o.x+1.2,0,o.z);jumpY=0;trainingIndex=0;train();gameStep(1/60)})()`)}
 await ev(()=>{pos.set(dad.position.x+1.2,0,dad.position.z);jumpY=0;trainingIndex=0;train()});await step(3);
 await ev(()=>{pos.set(dad.position.x+1.3,0,dad.position.z);curSpeed=0;grounded=true});await step(220);
 out.eve=await ev(()=>[...day.done]);await wait(4300);
 out.end=await ev(()=>({finished:day.finished,next:document.getElementById('dayNextBtn').textContent}));
 await ev(()=>{document.getElementById('dayEnd').hidden=true;goToDay(0)});out.after=await ev(()=>({guests:GUESTS.map(g=>g.P.g.visible),cloth:cloth.visible,dinner:dinner.visible,dadState,daniState}));
 console.log(JSON.stringify(out),errors);await browser.close()})();
