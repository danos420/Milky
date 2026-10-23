const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);
 const step=(n)=>ev(`(()=>{for(let i=0;i<${n};i++)gameStep(1/60)})()`);
 const out={};
 out.lockedFirst=await ev(()=>{localStorage.clear();save.day=undefined;week.stars=[];return dayUnlocked(1)});
 await ev(()=>{save.day={completed:1,bestStars:1,bestTime:100,bestScore:1};started=true;document.querySelector('#overlay').style.display='none';goToDay(1)});
 out.unlocked=await ev(()=>dayUnlocked(1));
 out.tasks=await ev(()=>DAY.map(p=>p.tasks.map(t=>t.id).join(',')));
 await step(60*5);out.dadState=await ev(()=>dadState);
 // caught by dad
 await ev(()=>{pos.set(dad.position.x+.6,0,dad.position.z);jumpY=0;grounded=true});await step(5);
 out.caught=await ev(()=>({foam:bath.foam,foamVisible:foamG.visible}));
 await wait(300);await page.screenshot({path:'tests/shots/bath_foam.png'});
 // puppy eyes
 await ev(()=>{mood=3;pos.set(dad.position.x+1.8,0,dad.position.z)});await step(3);await ev(()=>{mood=0});
 // shampoo to bed
 await ev(()=>{const sh=extras.find(p=>p.kind==='shampoo');sh.g.position.set(BED.x+.4,0,BED.z)});await step(3);
 // spill tub: run into it
 await ev(()=>{pos.set(TUB.x,0,TUB.z-2.6);yaw=0;camYaw=0;keys.KeyW=true;keys.ShiftLeft=true});await step(50);await ev(()=>{keys.KeyW=false;keys.ShiftLeft=false});
 out.tipped=await ev(()=>bath.tipped);
 await step(40);await wait(200);await page.screenshot({path:'tests/shots/bath_tub.png'});
 // escape
 await ev(()=>{bath.escape=29.95;setDadState('bath');bath.pause=0;pos.set(-4,0,-6);dad.position.set(4,0,6);jumpY=0});await step(10);
 out.morning=await ev(()=>[...day.done]);
 await wait(1700);out.phase1=await ev(()=>({phase:day.phase,foam:bath.foam,chip:dayChip.textContent}));
 // shake on sofa
 await ev(()=>{pos.set(-4.8,0,1.3);jumpY=1.03;grounded=true;velocityY=0;curSpeed=0});await step(150);
 // shake near dad
 await ev(()=>{unseatDad&&unseatDad();setDadState('rest');dad.position.set(2,0,5);pos.set(2,0,6.4);jumpY=0;curSpeed=0});await step(150);
 // rug roll
 await ev(()=>{pos.set(1.9,0,3.0);jumpY=0;curSpeed=0;startRagdoll()});await step(200);
 // armchair
 await ev(()=>{if(dadSeated)unseatDad();setDadState('wander');dad.position.set(-3,0,-5);pos.set(4.3,0,7.85);jumpY=.7;grounded=true});await step(5);await ev(()=>{pos.set(2,0,4);jumpY=0});
 out.noon=await ev(()=>[...day.done]);
 await wait(1700);out.phase2=await ev(()=>({phase:day.phase,foam:bath.foam}));
 await ev(()=>{pos.set(5,0,-15);jumpY=0;curSpeed=0;startRagdoll()});await step(200);
 await ev(()=>{dayEvent('wet');dayEvent('kebab');pos.set(BED.x,0,BED.z);jumpY=.33;curSpeed=0;grounded=true});await step(200);
 out.evening=await ev(()=>[...day.done]);
 await wait(4200);
 out.end=await ev(()=>({finished:day.finished,modal:!document.getElementById('dayEnd').hidden,next:document.getElementById('dayNextBtn').textContent,nextDisabled:document.getElementById('dayNextBtn').disabled,stars:week.stars}));
 await ev(()=>{document.getElementById('dayEnd').hidden=true;dayChip.click()});await wait(300);await page.screenshot({path:'tests/shots/bath_week.png'});
 console.log(JSON.stringify(out,null,1),errors);await browser.close()})();
