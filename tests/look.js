const {open}=require('./lib');
(async()=>{const {page,browser,errors}=await open(process.argv[2],{width:844,height:390},{touch:true});
 await page.evaluate(()=>{started=true;document.querySelector('#overlay').style.display='none';});
 const c=await page.$('canvas');
 // drag right-to-left across 200px over ~0.3s while game runs in real time
 await page.mouse.move(600,200);await page.mouse.down();
 for(let i=0;i<10;i++){await page.mouse.move(600-i*20,200);await page.waitForTimeout(30)}
 const mid=await page.evaluate(()=>({yaw:+yaw.toFixed(2),cam:+camYaw.toFixed(2)}));
 await page.mouse.up();await page.waitForTimeout(500);
 const end=await page.evaluate(()=>({yaw:+yaw.toFixed(2),cam:+camYaw.toFixed(2),pos:[+pos.x.toFixed(2),+pos.z.toFixed(2)]}));
 console.log(JSON.stringify({mid,end}),errors);await browser.close()})();
