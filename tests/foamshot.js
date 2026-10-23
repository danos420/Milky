const {open}=require('./lib');
(async()=>{const {page,browser,errors}=await open('dist/index.html',{width:800,height:520});
 await page.evaluate(()=>{save.day={completed:1};started=true;document.querySelector('#overlay').style.display='none';goToDay(1);setFoam(1);pos.set(1,0,-3);yaw=2.4;camYaw=2.4;orbitAngle=2.2;orbitHeight=2.2;cameraDistance=3.2;for(let i=0;i<40;i++)gameStep(1/60)});
 await page.waitForTimeout(400);await page.screenshot({path:'tests/shots/foam2.png'});console.log(errors);await browser.close()})();
