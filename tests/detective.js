const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);
 const step=n=>ev(`(()=>{for(let i=0;i<${n};i++)gameStep(1/60)})()`);const out={};
 await ev(()=>localStorage.removeItem('milky-mode'));await page.click('#startDetective');await wait(3800);
 out.start=await ev(()=>({D:DETECT,dm:DM.g.visible,dog:dog.visible,case:dCase().id,clues:CLUE_SPR.filter(s=>s.visible).length,pill:evtPill.textContent}));
 await step(2);out.clues=await ev(()=>CLUE_SPR.filter(s=>s.visible).length);
 await ev(()=>{pos.set(slipperHome.x+1.5,0,slipperHome.z+1);yaw=-Math.PI/2;camYaw=yaw});await wait(800);await page.screenshot({path:'tests/shots/d_office.png'});
 // inspect all clues via the context button
 for(let i=0;i<4;i++){await ev(`(()=>{const c=dCase().clues[${i}],p=c.pos();pos.set(p.x+.6,0,p.z);ctxT=0;updateCtxButtons(1);actBtn.click()})()`)}
 out.found=await ev(()=>ds.found.size);await ev(()=>{ctxT=0;updateCtxButtons(1)});out.ctxAcc=await ev(()=>actBtn.textContent);
 await ev(()=>actBtn.click());await wait(300);await page.screenshot({path:'tests/shots/d_accuse.png'});
 await ev(()=>{document.querySelectorAll('#dSuspects button')[0].click()});out.wrong=await ev(()=>ds.wrong);
 await ev(()=>{dAccuse();document.querySelectorAll('#dSuspects button')[1].click()});await wait(4200);out.solved=await ev(()=>({phase:ds.phase,end:!document.getElementById('dEnd').hidden,slipper:slipperState}));
 await page.screenshot({path:'tests/shots/d_end.png'});
 // case 2
 await ev(()=>document.getElementById('dEndNext').click());await wait(3800);out.case2=await ev(()=>dCase().id);
 for(let i=0;i<4;i++){await ev(`(()=>{const c=dCase().clues[${i}],p=c.pos();pos.set(p.x+.6,0,p.z);ctxT=0;updateCtxButtons(1);actBtn.click()})()`)}
 await ev(()=>{dAccuse();document.querySelectorAll('#dSuspects button')[2].click()});await wait(4200);out.solved2=await ev(()=>ds.phase);
 // case 3 defense
 await ev(()=>document.getElementById('dEndNext').click());await wait(3800);out.case3=await ev(()=>dCase().id);
 await ev(()=>{pos.set(3,0,12);yaw=0});await step(60*6);out.raccoons=await ev(()=>dv.list.filter(r=>r.on).length);
 await wait(300);await page.screenshot({path:'tests/shots/d_def.png'});
 // shoot at a raccoon
 out.shoot=await ev(()=>{const r=dv.list.find(r=>r.on&&!r.flee);if(!r)return 'none';pos.set(r.g.position.x,0,r.g.position.z-3);yaw=0;ds.shootCool=0;dShoot();return r.flee});
 await wait(200);await page.screenshot({path:'tests/shots/d_shoot.png'});
 // play the defense automatically: auto-aim
 out.def=await ev(()=>{for(let i=0;i<60*120&&!dv.over;i++){const r=dv.burglar?{g:BURG.g}:dv.list.find(r=>r.on&&!r.flee);if(r){const o=r.g.position;pos.set(o.x,0,o.z-2.5);if(!walkable(pos.x,pos.z,.4))pos.set(o.x-2.5,0,o.z);yaw=Math.atan2(o.x-pos.x,o.z-pos.z);ds.shootCool=0;dShoot()}gameStep(1/60)}return {over:dv.over,wave:dv.wave,stolen:dv.stolen,kos:dv.kos}});
 await wait(3000);out.defEnd=await ev(()=>({end:!document.getElementById('dEnd').hidden,title:document.getElementById('dEndTitle').textContent}));
 await ev(()=>document.getElementById('dEndQuit').click());out.quit=await ev(()=>({D:DETECT,dog:dog.visible,dm:DM.g.visible}));
 console.log(JSON.stringify(out),errors);await browser.close()})();
