const {open}=require('./lib');
(async()=>{
 const {browser,page,errors}=await open(process.argv[2],{width:800,height:500},{noRaf:true});
 await page.evaluate(()=>{document.querySelector('#start').click();
   window.run=(sec,each)=>{const n=Math.round(sec*30);for(let i=0;i<n;i++){gameStep(1/30);if(each&&each(i)===true)return i/30}return -1};});
 const R=[];const check=(n,ok,info)=>R.push((ok?'PASS ':'FAIL ')+n+(info!==undefined?'  — '+info:''));
 let r=await page.evaluate(()=>{reset();pos.set(-2.9,0,7.0);yaw=0;keys.KeyW=true;run(2.2);keys.KeyW=false;return pos.z});
 check('Milky walks through the doorway into the kitchen',r>10,'z='+r.toFixed(2));
 r=await page.evaluate(()=>{reset();pos.set(-5,0,12);yaw=Math.PI/2;keys.KeyW=true;run(3);keys.KeyW=false;return [pos.x,pos.z]});
 check('kitchen side wall blocks Milky',r[0]<=5.97,'x='+r[0].toFixed(2));
 r=await page.evaluate(()=>{reset();pos.set(5.5,0,13.6);yaw=0;interact();const open=fridgeOpen;run(1.5);const st=sausageState;pos.set(sausage.position.x,0,sausage.position.z-.8);interact();return {open,st,after:sausageState,ch:[...challengesDone]}});
 check('open fridge, sausage drops, Milky eats it',r.open&&r.st==='floor'&&r.after==='eaten'&&r.ch.includes('fridge')&&r.ch.includes('sausage'),JSON.stringify(r));
 r=await page.evaluate(()=>{pos.set(-4,0,6);return run(40,()=>sausageState==='inside'&&!fridgeOpen)});
 check('Dani restocks the fridge and closes it',r>0,'after '+r.toFixed(1)+'s');
 r=await page.evaluate(()=>{reset();pos.set(2.7,0,13.7);yaw=0;interact();const tipped=trashTipped;pos.set(-4,0,4);const t=run(30,()=>!trashTipped);return {tipped,t,ch:challengesDone.has('trash')}});
 check('tip trash, Dani stands it back up',r.tipped&&r.t>0&&r.ch,JSON.stringify(r));
 r=await page.evaluate(()=>{reset();pos.set(-4.5,0,-6);const p=chaosProps[4];p.g.position.set(2.5,0,10.5);const t=run(60,()=>Math.hypot(p.g.position.x-p.home.x,p.g.position.z-p.home.z)<.05&&!carried.has(p.g));return t});
 check('Dani carries a cushion from the kitchen back to the living room',r>0,'after '+r.toFixed(1)+'s');
 r=await page.evaluate(()=>{reset();dadRoutine=99;setDadState('watch');const t=run(15,()=>dadSeated);return t});
 check('dad walks to the armchair and sits',r>0,'after '+r.toFixed(1)+'s');
 r=await page.evaluate(()=>{reset();dad.position.set(0,0,5);dadRoutine=99;setDadState('watch');pos.set(4.3,0,7.6);jumpY=.68;grounded=true;run(8);return {seated:dadSeated,grumble:dadChairGrumble>0,d:+Math.hypot(dad.position.x-SEAT_APPROACH.x,dad.position.z-SEAT_APPROACH.z).toFixed(2)}});
 check('Milky sits in dad\'s armchair: dad grumbles and stays standing',!r.seated&&r.grumble,JSON.stringify(r));
 r=await page.evaluate(()=>{pos.set(2,0,5);jumpY=0;run(4);return dadSeated});
 check('Milky leaves the armchair: dad sits down',r,String(r));
 r=await page.evaluate(()=>{reset();pos.set(-3.5,0,-1.0);stealSlipper();pos.set(0,0,12.5);dad.position.set(-2.9,0,4);setDadState('chase');return run(15,()=>slipperState==='dad')});
 check('dad chases Milky into the kitchen and catches him',r>0,'after '+r.toFixed(1)+'s');
 r=await page.evaluate(()=>{reset();daniPlayCool=0;daniDecide=0;toyBall.position.set(0,.34,13);toyVelocity.set(0,0);pos.set(-1,0,11);let kicked=-1;run(14,i=>{if(kicked<0&&toyVelocity.length()>4)kicked=i/30});return kicked});
 check('Dani kicks the ball for Milky',r>0,'at '+r.toFixed(1)+'s');
 r=await page.evaluate(()=>{reset();pos.set(-5.4,0,10.9);yaw=Math.PI;interact();return mood});
 check('food bowl works',r===1,'mood='+r);
 r=await page.evaluate(()=>{reset();pos.set(0,0,-3);let n=0;run(30,()=>{if(idleAction)n++});return n});
 check('idle Milky does idle behaviours',r>60,r+' idle frames');
 // soak with everything moving
 r=await page.evaluate(()=>{reset();let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;let bad=0,badD=0,oob=0,inF=0;
   const insideF=(x,z)=>obstacles.some(o=>jumpY<o.top-.03&&Math.hypot(x-Math.max(o.x-o.w/2,Math.min(x,o.x+o.w/2)),z-Math.max(o.z-o.d/2,Math.min(z,o.z+o.d/2)))<dogRadius-.04);
   for(let i=0;i<30*240;i++){if(i%20===0){for(const k of ['KeyW','KeyA','KeyD','ShiftLeft','Space'])keys[k]=false;keys.KeyW=rnd()<.8;if(rnd()<.4)keys[rnd()<.5?'KeyA':'KeyD']=true;keys.ShiftLeft=rnd()<.3;keys.Space=rnd()<.15;if(rnd()<.1)interact();if(rnd()<.03)triggerTurbo();if(rnd()<.04&&slipperState==='floor'&&!collides(slipper.position.x,slipper.position.z,0)){pos.set(slipper.position.x,0,slipper.position.z);jumpY=0;stealSlipper()}}
    gameStep(1/30);if(!dadSeated&&!dadFree(dad.position.x,dad.position.z,DAD_R-.03))bad++;if(!dadFree(dani.position.x,dani.position.z,DANI_R-.03))badD++;if(!walkable(pos.x,pos.z,.4))oob++;if(insideF(pos.x,pos.z))inF++}
   return {dadInside:bad,daniInside:badD,milkyOut:oob,milkyInFurniture:inF,challenges:challengesDone.size,kitchenVisits:pos.z}});
 check('4-min soak (both rooms): nobody inside walls or furniture',r.dadInside+r.daniInside+r.milkyOut+r.milkyInFurniture===0,JSON.stringify(r));
 console.log(R.join('\n'));console.log(errors.length?errors:'no page errors');await browser.close();
})();
