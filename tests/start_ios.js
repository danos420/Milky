const {chromium,devices}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl']});
 const ctx=await b.newContext({...devices['iPhone 13'],deviceScaleFactor:2});const p=await ctx.newPage();
 await p.route(/three(\.min)?\.js/,r=>r.fulfill({body:fs.readFileSync(path.join(__dirname,'../assets/vendor/three.min.js')),contentType:'application/javascript'}));
 await p.goto('file://'+path.resolve(__dirname,'../dist/index.html'));await p.waitForTimeout(1200);
 console.log(await p.evaluate(()=>document.getElementById('installTip')?.textContent));await p.screenshot({path:'/tmp/claude-0/start_ios.png'});await b.close()})();
