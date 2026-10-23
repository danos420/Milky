// Serves dist/ on localhost, installs the service worker, then reloads OFFLINE: the game must still start.
const {chromium}=require('playwright');const {spawn}=require('child_process');const path=require('path');
(async()=>{const srv=spawn('python3',['-m','http.server','8765','--bind','127.0.0.1'],{cwd:path.join(__dirname,'../dist'),stdio:'ignore'});
 await new Promise(r=>setTimeout(r,800));
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const ctx=await b.newContext({viewport:{width:844,height:390}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/');await p.waitForTimeout(1500);
 const sw=await p.evaluate(async()=>{const r=await navigator.serviceWorker.ready;return !!r.active});
 const man=await p.evaluate(async()=>{const r=await fetch('manifest.webmanifest');const m=await r.json();return m.short_name+' '+m.icons.length});
 const local=await p.evaluate(()=>[...document.scripts].some(s=>s.src.endsWith('vendor/three.min.js'))&&!!window.THREE);
 await ctx.setOffline(true);await p.reload();await p.waitForTimeout(1500);
 const off=await p.evaluate(()=>({three:!!window.THREE,game:typeof gameStep==='function',title:document.title}));
 await p.evaluate(()=>{started=true;document.querySelector('#overlay').style.display='none';for(let i=0;i<60;i++)gameStep(1/60)});
 console.log(JSON.stringify({sw,man,local,offline:off}),errs);await b.close();srv.kill()})();
