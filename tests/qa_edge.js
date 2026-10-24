const {open}=require('./lib');
// Edge cases: menu during a mission's ending, corrupted saves, rotating the phone.
(async()=>{
 const file=process.argv[2]||'dist/index.html';const out={};
 {const {page,browser,errors}=await open(file,{width:390,height:844},{touch:true});const ev=f=>page.evaluate(f);
  // win a dad mission, press menu before the result card appears
  await ev(()=>{save.ep.dad={};EP.cur=EP.list.dad;EP.idx=0;dadMissionStart(0);dm.win=1;gameStep(1/60);document.getElementById('menuBtn').click()});
  await page.waitForTimeout(2500);
  out.menuDuringEnd=await ev(()=>({card:!document.getElementById('epEnd').hidden,overlay:document.querySelector('#overlay').style.display!=='none',saved:save.ep.dad.m1||0}));
  // zombie loss timer after leaving
  await ev(()=>{EP.cur=EP.list.zombie;EP.idx=0;EP.list.zombie.start(0);zGameOver();document.getElementById('menuBtn').click()});await page.waitForTimeout(2000);
  out.zombieAfterMenu=await ev(()=>!document.getElementById('epEnd').hidden);
  // landscape phone
  await page.setViewportSize({width:844,height:390});await ev(()=>{EP.cur=EP.list.parrot;EP.idx=0;parrotMissionStart(0)});await page.waitForTimeout(800);
  await page.screenshot({path:'tests/shots/qa_land_parrot.png'});
  await ev(()=>{EP.cur=EP.list.dad;EP.idx=2;dadMissionStart(2)});await page.waitForTimeout(800);await page.screenshot({path:'tests/shots/qa_land_dad.png'});
  out.overlap=await ev(()=>{const r=id=>{const e=document.getElementById(id);return e&&e.offsetParent?e.getBoundingClientRect():null};const a=r('actBtn'),g=r('grabBtn'),j=r('jumpBtn'),p=document.getElementById('eventPill').getBoundingClientRect();
   const hit=(x,y)=>x&&y&&!(x.right<=y.left||y.right<=x.left||x.bottom<=y.top||y.bottom<=x.top);return {actJump:hit(a,j),grabJump:hit(g,j),actGrab:hit(a,g),offscreen:[a,g,j].some(b=>b&&(b.right>844||b.bottom>390||b.left<0))}});
  out.errors=errors;await browser.close()}
 // corrupted saves
 for(const bad of ['{not json','null','{"ep":5,"det":"x","week":[],"mods":null}','{"ep":{"dad":{"m1":"abc"}},"det":{"stars":null}}']){
  const {page,browser,errors}=await open(file,{width:390,height:844});
  await page.evaluate(b=>{for(const k of Object.keys(localStorage))localStorage.setItem(k,b);localStorage.setItem('milky-save',b);localStorage.setItem('milky-week',b)},bad);
  await page.reload();await page.waitForTimeout(900);
  const r=await page.evaluate(()=>({cards:document.querySelectorAll('.uCard').length,ok:typeof gameStep==='function'}));
  try{await page.evaluate(()=>{document.querySelectorAll('.uCard')[1].click();for(let k=0;k<60;k++)gameStep(1/60)})}catch(e){errors.push('run '+e.message)}
  (out.corrupt=out.corrupt||[]).push({bad:bad.slice(0,12),...r,errors:errors.slice(0,2)});await browser.close()}
 console.log(JSON.stringify(out,null,1));})();
