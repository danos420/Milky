const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:900,height:560});
 const ev=f=>page.evaluate(f);const out={};
 await ev(()=>{started=true;document.querySelector('#overlay').style.display='none';reset()});
 await page.waitForTimeout(600);
 out.guide=await ev(()=>({vis:guide.visible,pos:[guide.position.x,guide.position.z].map(v=>+v.toFixed(1)),arrow:!guideArrow.hidden}));
 await page.screenshot({path:'tests/shots/lv_guide.png'});
 // turn away so target is behind: arrow should show
 await ev(()=>{yaw=0;camYaw=0;pos.set(0,0,6)});await page.waitForTimeout(500);
 out.arrow=await ev(()=>({hidden:guideArrow.hidden,txt:guideArrow.textContent}));await page.screenshot({path:'tests/shots/lv_arrow.png'});
 // big landing pow + jump shadow
 await ev(()=>{pos.set(0,0,5);jumpY=4;grounded=false;velocityY=0;yaw=Math.PI;camYaw=Math.PI});await page.waitForTimeout(250);
 out.blobAir=await ev(()=>+blob.material.opacity.toFixed(2));await page.screenshot({path:'tests/shots/lv_air.png'});
 await page.waitForTimeout(500);out.pow=await ev(()=>POWS.filter(p=>p.t>0).map(p=>p.el.textContent));await page.screenshot({path:'tests/shots/lv_pow.png'});
 // slowmo
 out.slow=await ev(()=>{slowMo(.5);return juiceTick(1/60)});
 // photo mode
 await ev(()=>document.getElementById('photoToggle').click());await page.waitForTimeout(300);
 out.photo=await ev(()=>({on:PHOTO.on,bar:!photoBar.hidden,ui:getComputedStyle(document.getElementById('controls')).visibility}));
 const x0=await ev(()=>pos.x);await ev(()=>{keys.KeyW=true});await page.waitForTimeout(300);out.frozen=await ev(()=>pos.x)===x0;await ev(()=>{keys.KeyW=false});
 await page.screenshot({path:'tests/shots/lv_photo.png'});
 const [dl]=await Promise.all([page.waitForEvent('download',{timeout:5000}).catch(()=>null),ev(()=>document.getElementById('photoSnap').click())]);
 if(dl){await dl.saveAs('tests/shots/lv_capture.jpg');out.download=dl.suggestedFilename()}
 await ev(()=>document.getElementById('photoExit').click());out.after=await ev(()=>PHOTO.on);
 console.log(JSON.stringify(out),errors);await browser.close()})();
