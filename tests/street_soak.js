const {open}=require('./lib');
(async()=>{const {page,browser,errors}=await open('dist/index.html',{width:640,height:400},{noRaf:true});
 const r=await page.evaluate(()=>{started=true;reset();pos.set(12,0,10);let seed=5;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;let oob=0,t0=performance.now();
  for(let i=0;i<60*120;i++){if(i%30===0){for(const k of ['KeyW','KeyA','KeyD','ShiftLeft','Space'])keys[k]=false;keys.KeyW=rnd()<.85;if(rnd()<.4)keys[rnd()<.5?'KeyA':'KeyD']=true;keys.ShiftLeft=rnd()<.5;keys.Space=rnd()<.1;if(rnd()<.1)actBtn.click();if(rnd()<.1)grabBtn.click()}
   gameStep(1/60);if(!walkable(pos.x,pos.z,.4))oob++}
  return {oob,ms:+((performance.now()-t0)/(60*120)).toFixed(3),x:+pos.x.toFixed(1),z:+pos.z.toFixed(1),ch:challengesDone.size}});
 console.log(JSON.stringify(r),errors);await browser.close()})();
