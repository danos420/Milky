const {open}=require('./lib');
(async()=>{const {page,browser,errors}=await open('dist/index.html',{width:640,height:400},{noRaf:true});
 const r=await page.evaluate(()=>{save.day={completed:1};started=true;document.querySelector('#overlay').style.display='none';goToDay(1);
  let caught=0,maxEsc=0,bad=0;const o=bathCatch;bathCatch=function(){caught++;return o()};
  for(let i=0;i<60*180;i++){if(i%90===0){keys.KeyW=Math.random()<.8;keys.ShiftLeft=Math.random()<.6;keys.KeyA=Math.random()<.3;keys.KeyD=!keys.KeyA&&Math.random()<.3;if(Math.random()<.05)keys.Space=true}if(i%90===5)keys.Space=false;
   gameStep(1/60);maxEsc=Math.max(maxEsc,bath.escape);if(!walkable(dad.position.x,dad.position.z,.2))bad++}
  return {caught,maxEsc:+maxEsc.toFixed(1),done:[...day.done],phase:day.phase,dadState,bad}});
 console.log(JSON.stringify(r),errors);await browser.close()})();
