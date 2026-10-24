const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const out={};
 await ev(()=>{localStorage.removeItem('milky-mode')});
 await page.click('#startOpen');await page.waitForTimeout(600);
 out.state=await ev(()=>({ow:OPEN_WORLD,finished:day.finished,chip:dayChip.textContent,park:PARK_OPEN,giant:isUnlocked(MODE_DEFS.find(d=>d.id==='giant')),crown:isUnlocked(WEAR_DEFS.find(d=>d.id==='crown')),hint:nextTaskHint()}));
 await ev(()=>{for(let i=0;i<30;i++)gameStep(1/60)});
 out.marks=await ev(()=>Object.values(OW_MARKS).filter(s=>s.visible).length);
 await ev(()=>{yaw=Math.PI;camYaw=Math.PI;pos.set(0,0,5)});await page.waitForTimeout(800);await page.screenshot({path:'tests/shots/ow_start.png'});
 // challenge completes -> marker hidden, chip updates
 await ev(()=>{completeChallenge('duck');for(let i=0;i<5;i++)gameStep(1/60)});out.after=await ev(()=>({chip:dayChip.textContent,duckMark:OW_MARKS.duck&&OW_MARKS.duck.visible}));
 // day-night cycle and events
 out.light=await ev(()=>{owClock=230;gameStep(1/60);const a=day.light;owClock=315;gameStep(1/60);return [a,day.light]});
 out.events=await ev(()=>{evt.cool=0;evt.last='';for(let i=0;i<5;i++)gameStep(1/60);return evt.cur});
 // tasks do not run: dayEvent ignored, day hooks off
 out.noBath=await ev(()=>{week.cur=1;reset();return {bathOn:bath.on,finished:day.finished}});
 // switch back to story
 await ev(()=>document.getElementById('modeSwitch').click());out.story=await ev(()=>({ow:OPEN_WORLD,finished:day.finished,chip:dayChip.textContent,marks:Object.values(OW_MARKS).filter(s=>s.visible).length,giant:isUnlocked(MODE_DEFS.find(d=>d.id==='giant'))}));
 // reload remembers the last mode
 await ev(()=>document.getElementById('modeSwitch').click());await page.reload();await page.waitForTimeout(900);out.reload=await ev(()=>OPEN_WORLD);
 console.log(JSON.stringify(out),errors);await browser.close()})();
