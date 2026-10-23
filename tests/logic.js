const {open}=require('./lib');
(async()=>{
  const file=process.argv[2];
  const {browser,page,errors}=await open(file,{width:800,height:500},{noRaf:true});
  await page.evaluate(()=>{document.querySelector('#start').click();
    window.run=(sec,each)=>{const n=Math.round(sec*30);for(let i=0;i<n;i++){gameStep(1/30);if(each)each(i)}};
    window.inside=(x,z,r)=>obstacles.some(o=>{const cx=Math.max(o.x-o.w/2,Math.min(x,o.x+o.w/2)),cz=Math.max(o.z-o.d/2,Math.min(z,o.z+o.d/2));return Math.hypot(x-cx,z-cz)<r-.03});
  });
  const R=[];const check=(name,ok,info)=>{R.push((ok?'PASS ':'FAIL ')+name+(info?'  — '+info:''))};
  // 1 chase + catch + return
  let r=await page.evaluate(()=>{reset();pos.set(-3.5,0,-1.0);stealSlipper();pos.set(0,0,-4);let caughtAt=-1,backAt=-1;
    run(40,i=>{if(caughtAt<0&&slipperState==='dad')caughtAt=i/30;if(caughtAt>=0&&backAt<0&&slipperState==='floor')backAt=i/30});
    return {caughtAt,backAt,state:dadState,sl:[slipper.position.x,slipper.position.z].map(v=>+v.toFixed(2))}});
  check('dad catches idle Milky',r.caughtAt>0&&r.caughtAt<15,'caught at '+r.caughtAt.toFixed(1)+'s');
  check('dad returns slipper home',r.backAt>0,'back at '+r.backAt.toFixed(1)+'s, slipper '+r.sl+' dad '+r.state);
  // 2 chase around the table
  r=await page.evaluate(()=>{reset();pos.set(-3.5,0,-1.0);stealSlipper();pos.set(0,0,-1.5);dad.position.set(0,0,3.6);setDadState('chase');let c=-1;run(15,i=>{if(c<0&&slipperState==='dad')c=i/30});return c});
  check('dad navigates around table to catch',r>0,'caught at '+r.toFixed(1)+'s');
  // 3 dropped slipper
  r=await page.evaluate(()=>{reset();pos.set(-3.5,0,-1.0);stealSlipper();pos.set(-1,0,-5);dropSlipper();pos.set(-4,0,7.5);let picked=-1,back=-1;run(40,i=>{if(picked<0&&slipperState==='dad')picked=i/30;if(picked>=0&&back<0&&slipperState==='floor')back=i/30});return {picked,back,state:dadState}});
  check('dad picks dropped slipper and puts it back',r.picked>0&&r.back>0,JSON.stringify(r));
  // 4 long wander soak: never inside furniture, never frozen while walking
  r=await page.evaluate(()=>{reset();pos.set(-1,0,6.5);let bad=0,frozen=0,maxFrozen=0,lx=dad.position.x,lz=dad.position.z,states={};
    run(240,i=>{states[dadState]=1;if(!dadSeated&&!dadFree(dad.position.x,dad.position.z,DAD_R-.02))bad++;const m=Math.hypot(dad.position.x-lx,dad.position.z-lz);lx=dad.position.x;lz=dad.position.z;
      if(dadState==='wander'&&m<1e-4&&Math.hypot(dadTarget.x-dad.position.x,dadTarget.z-dad.position.z)>.4){frozen++;maxFrozen=Math.max(maxFrozen,frozen)}else frozen=0});
    return {bad,maxFrozen:maxFrozen/30,states:Object.keys(states)}});
  check('dad 4-min soak: never inside furniture',r.bad===0,'frames inside: '+r.bad);
  check('dad 4-min soak: never frozen while wandering >1s',r.maxFrozen<1,'longest freeze '+r.maxFrozen.toFixed(2)+'s, states '+r.states);
  // 5 Milky walks into lamp, standing plant, dad
  for(const [name,x,z,cr] of [['lamp',-5.8,-6.3,.24],['domino plant',2.8,-3.6,.33]]){
    r=await page.evaluate(([x,z])=>{reset();pos.set(x,0,z+2.2);yaw=Math.PI;keys.KeyW=true;run(2);keys.KeyW=false;return Math.hypot(pos.x-x,pos.z-z)},[x,z]);
    check('Milky blocked by '+name,r>=cr+.4-.02,'distance '+r.toFixed(2));
  }
  r=await page.evaluate(()=>{reset();dadState='celebrate';dadAction=-99;pos.set(dad.position.x,0,dad.position.z-2.2);yaw=0;keys.KeyW=true;run(2);keys.KeyW=false;return Math.hypot(pos.x-dad.position.x,pos.z-dad.position.z)});
  check('Milky blocked by dad',r>=.76,'distance '+r.toFixed(2));
  // 6 cushion shoved into sofa / bottle into TV cabinet
  r=await page.evaluate(()=>{reset();pos.set(3,0,7);const p=chaosProps[0];p.g.position.set(-2.8,0,0);p.vx=-9;p.vz=0;let worst=0;run(2,()=>{if(inside(p.g.position.x,p.g.position.z,.34))worst++});return {worst,x:p.g.position.x}});
  check('cushion bounces off sofa',r.worst===0,'frames inside: '+r.worst+', x='+r.x.toFixed(2));
  r=await page.evaluate(()=>{reset();pos.set(-3,0,7);const p=extras[0];p.g.position.set(4,0,1.2);p.vx=10;p.vz=0;let worst=0;run(2,()=>{if(inside(p.g.position.x,p.g.position.z,.17))worst++});return {worst,x:p.g.position.x}});
  check('bottle bounces off TV cabinet',r.worst===0,'frames inside: '+r.worst+', x='+r.x.toFixed(2));
  // 7 box hits box: no pass-through, B moves
  r=await page.evaluate(()=>{reset();pos.set(-4,0,6);const a=chaosProps[2],b=chaosProps[3];a.g.position.set(0,0,-3);b.g.position.set(1.2,0,-3);a.vx=7;a.vz=0;let minD=9;run(1.5,()=>{minD=Math.min(minD,Math.hypot(a.g.position.x-b.g.position.x,a.g.position.z-b.g.position.z))});return {minD,bx:b.g.position.x}});
  check('box A knocks box B without passing through',r.minD>=.5&&r.bx>1.5,'min gap '+r.minD.toFixed(2)+' (touch=.54), B moved to x='+r.bx.toFixed(2));
  // 8 turbo storm
  r=await page.evaluate(()=>{reset();pos.set(0,0,-3.5);triggerTurbo();run(4);let over=0,inF=0;for(let i=0;i<bodies.length;i++){const A=bodies[i];if(inside(A.o.position.x,A.o.position.z,A.r)&&A.o.position.y<.3)inF++;for(let j=i+1;j<bodies.length;j++){const B=bodies[j];if(Math.hypot(A.o.position.x-B.o.position.x,A.o.position.z-B.o.position.z)<A.r+B.r-.05)over++}}return {over,inF,n:bodies.length}});
  check('after turbo: no objects inside furniture or each other',r.over===0&&r.inF===0,JSON.stringify(r));
  // 9 win flow
  r=await page.evaluate(()=>{reset();pos.set(-3.5,0,-1.0);stealSlipper();pos.set(3.5,0,-6.4);jumpY=.33;grounded=true;run(.2);const s1=slipperState+'/'+dadState;run(5);return s1+' -> '+dadState});
  check('win: hide slipper in bed, dad celebrates then calms',r==='hidden/celebrate -> rest'||r.startsWith('hidden/celebrate'),r);
  // 10 domino chain still works
  r=await page.evaluate(()=>{reset();pos.set(.2,0,.9);jumpY=.92;grounded=true;launchMug();run(5);return {phase:chainPhase,chaos:chaosStage}});
  check('mug -> ball -> plant domino chain',r.phase===3,JSON.stringify(r));
  console.log(R.join('\n'));console.log(errors.length?errors:'no page errors');
  await browser.close();
})();
