const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);const out={cases:[]};
 await ev(()=>{localStorage.clear();save.det={stars:{}}});await page.click('#startDetective');await wait(500);
 out.board=await ev(()=>({open:!document.getElementById('dBoard').hidden,cards:document.querySelectorAll('.dCase').length,locked:document.querySelectorAll('.dCase.locked').length}));
 await page.screenshot({path:'tests/shots/d_board.png'});
 for(let i=0;i<10;i++){if(process.argv[3]&&!process.argv[3].split(',').includes(String(i)))continue;
  await ev(`(()=>{document.getElementById('dBoard').hidden=true;document.getElementById('dEnd').hidden=true;started=true;dStartCase(${i})})()`);await wait(3700);
  const night=await ev(()=>!!dCase().night);
  if(!night){
   if(i===3)await ev(()=>{ds.sniffCool=0;dSniff();for(let k=0;k<30;k++)gameStep(1/60)});
   const n=await ev(()=>dCase().clues.length);
   for(let k=0;k<n;k++)await ev(`(()=>{const c=dCase().clues[${k}],p=c.pos();pos.set(p.x+.6,0,p.z);if(!walkable(pos.x,pos.z,.3))pos.set(p.x,0,p.z+.6);ctxT=0;updateCtxButtons(1);if(actBtn.textContent.includes('לבדוק')||actBtn.textContent.includes('לחקור'))actBtn.click();else dInspect(c)})()`);
   const ok=await ev(()=>dCase().suspects.findIndex(s=>s.ok));
   await ev(`(()=>{dAccuse();document.querySelectorAll('#dSuspects button')[${ok}].click()})()`);await wait(4200);
  }else{
   await ev(()=>{pos.set(2,0,10);for(let k=0;k<60*240&&!dv.over;k++){const tg=dv.boss?KING:dv.burglar?{g:BURG.g}:dv.list.find(r=>r.on&&!r.flee);if(tg){const o=tg.g.position;pos.set(o.x,0,o.z-2.5);if(!walkable(pos.x,pos.z,.4))pos.set(o.x-2.5,0,o.z);if(!walkable(pos.x,pos.z,.4))pos.set(o.x+2.5,0,o.z);yaw=Math.atan2(o.x-pos.x,o.z-pos.z);ds.shootCool=0;dShoot()}gameStep(1/60)}});
   await wait(3000);
  }
  const r=await ev(()=>({id:dCase().id,end:!document.getElementById('dEnd').hidden,stars:save.det.stars[dCase().id]||0,rank:rankIdx()}));out.cases.push(r);
  if(i===9)await page.screenshot({path:'tests/shots/d_final.png'});
 }
 await ev(()=>document.getElementById('dEndBoard').click());await wait(300);await page.screenshot({path:'tests/shots/d_board2.png'});
 out.total=await ev(()=>[totalStars(),RANKS[rankIdx()][1]]);
 console.log(JSON.stringify(out),errors);await browser.close()})();
