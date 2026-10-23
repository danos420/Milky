const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2],{width:1000,height:640});
 const r=await page.evaluate(()=>{
  started=true;document.querySelector('#overlay').style.display='none';const out={};
  const run=(n,f)=>{for(let i=0;i<n;i++){f&&f(i);gameStep(1/60)}};
  // natural trigger
  run(60*52);out.autoStarted=evt.cur;out.pill=document.getElementById('eventPill').textContent;endEvent('cancel');
  // pizza: teleport Milky onto the yard table
  evt.last='';evt.cur=null;const go=id=>{evt.last='';const ids=Object.keys(EVENTS);EVENTS[id].start();evt.cur=id;evt.t=0;evtPill.hidden=false};
  let s0=score;go('pizza');pos.set(0,0,-12.5);jumpY=.74;grounded=true;run(10);out.pizza=[evt.cur,score-s0,pizza.visible];
  // fetch
  go('fetch');run(30);const bx=toyBall.position.x,bz=toyBall.position.z;out.ballFlew=+Math.hypot(bx-dani.position.x,bz-dani.position.z).toFixed(1);
  evt.far=true;pos.set(bx,0,bz-.5);jumpY=0;run(5);out.touched=evt.touched;toyBall.position.set(dani.position.x+.8,.34,dani.position.z);toyVelocity.set(0,0);s0=score;run(3);out.fetch=[evt.cur,score-s0];
  // nap: fail by noise
  dadSeated=true;dadState='rest';go('nap');lastDogSpeed=2;addChaos(16);run(3);out.napFail=evt.cur;
  go('nap');s0=score;pos.set(-4,0,-5);run(60*26);out.napWin=[evt.cur,score-s0];
  // rain
  day.phase=1;go('rain');out.light=day.light;pos.set(5,0,-15);jumpY=0;grounded=true;s0=score;
  for(let j=0;j<5;j++){keys.Space=true;run(3);keys.Space=false;run(70)}
  out.rain=[evt.cur,evt.jumps,score-s0,rain.visible,day.light,wet];
  return out});
 console.log(JSON.stringify(r),errors);
 await page.evaluate(()=>{evt.last='';EVENTS.rain.start();evt.cur='rain';evtPill.hidden=false;pos.set(4,0,-18);camYaw=Math.PI;for(let i=0;i<40;i++)gameStep(1/60)});
 await page.waitForTimeout(500);await page.screenshot({path:'shots/e_rain.png'});
 await page.evaluate(()=>{endEvent('cancel');EVENTS.pizza.start();evt.cur='pizza';evtPill.hidden=false;pos.set(0,0,-9.8);yaw=Math.PI;camYaw=Math.PI;for(let i=0;i<40;i++)gameStep(1/60)});
 await page.waitForTimeout(500);await page.screenshot({path:'shots/e_pizza.png'});
 await browser.close();
})();
