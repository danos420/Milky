const {open}=require('./lib');
(async()=>{for(const f of ['index.html','milky-bardak.html']){const {browser,page}=await open(f,{width:390,height:844},{touch:true,noRaf:true});
 const r=await page.evaluate(()=>{document.querySelector('#start').click();reset();stick.active=true;stick.x=1;stick.y=0;stick.mag=.8;for(let i=0;i<60;i++)gameStep(1/30);stick.active=false;stick.mag=0;return {x:+pos.x.toFixed(2),z:+pos.z.toFixed(2),yaw:+yaw.toFixed(2)}});
 console.log(f,JSON.stringify(r));await browser.close()}})();
