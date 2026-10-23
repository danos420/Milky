const {open}=require('./lib');
(async()=>{const {browser,page,errors}=await open(process.argv[2],{width:390,height:844},{noRaf:true,touch:true});
 await page.evaluate(()=>{document.querySelector('#start').click();reset();pos.set(3.2,0,3.4);yaw=0;camYaw=0;dad.position.set(4.3,0,6.6);dadState='rest';
  for(let i=0;i<10;i++)gameStep(1/30);speakDad('מילקי! תחזיר לי את הכפכף!');think('guilty',3,true);for(let i=0;i<40;i++)renderFrame()});
 await page.waitForTimeout(400);await page.screenshot({path:'shots/bubbles.png'});
 console.log(errors.length?errors:'ok');await browser.close()})();
