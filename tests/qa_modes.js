const {open}=require('./lib');
// Every mode → main menu → every other mode. After each switch, only the new mode's state may be live.
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:390,height:844},{touch:true});
 const ev=f=>page.evaluate(f);
 const M={
  story:"document.getElementById('start').click()",
  open:"document.getElementById('startOpen').click()",
  zombie:"EP.cur=EP.list.zombie;EP.idx=0;EP.list.zombie.start(0)",
  detective:"document.getElementById('startDetective').click()",
  human:"EP.cur=EP.list.human;EP.idx=0;EP.list.human.start(0)",
  dad:"EP.cur=EP.list.dad;EP.idx=0;dadMissionStart(0)",
  parrot:"EP.cur=EP.list.parrot;EP.idx=0;parrotMissionStart(0)",
  dadFree:"document.getElementById('startOpen').click();setDadPlay(true);dm.m=null",
  race:"EP.cur=EP.list.race_milky;EP.idx=0;EP.list.race_milky.start(0)"};
 const check=`(()=>{const f={HUMAN:!!HUMAN,DETECT:!!DETECT,ZOMBIE:!!ZOMBIE,DADP:!!window.DADP,PARP:!!window.PARP,RACE:!!window.RACE_ON};const live=Object.keys(f).filter(k=>f[k]);
  return {live,ow:OPEN_WORLD,dog:dog.visible,pp:PP.visible,nm:NM.g.visible,hat:hat.visible,hm:HM.g.visible,cls:[...document.body.classList].filter(c=>/Play/.test(c)),
   rings:RINGS.filter(r=>r.visible).length,items:Object.values(ITEMS).filter(i=>i.visible).length,zhud:!zHud.hidden,bull:bullRun.g.visible,leash:leash.visible,started,
   overlay:document.querySelector('#overlay').style.display,carry:!!pCarry,thrown:THROWN.filter(t=>t.g.visible).length,raceVis:RACE_G.visible}})()`;
 const expect={story:{live:[],ow:false},open:{live:[],ow:true},zombie:{live:['ZOMBIE']},detective:{live:['DETECT']},human:{live:['HUMAN']},dad:{live:['DADP']},parrot:{live:['PARP']},dadFree:{live:['DADP']},race:{live:['RACE']}};
 const fails=[];let n=0;const names=Object.keys(M);
 for(const a of names)for(const b of names){if(a===b)continue;n++;
  await ev(`(()=>{${M[a]}})()`);if(a==='detective'){await page.waitForTimeout(1000);await ev(()=>document.querySelector('.dCase').click())}await ev(()=>{for(let k=0;k<40;k++)gameStep(1/60)});
  if(process.argv[3]!=='direct')await ev(()=>document.getElementById('menuBtn').click());
  await ev(`(()=>{for(const id of ['epBoard','epEnd','dBoard','dEnd','hEnd','zOver','dayEnd'])document.getElementById(id).hidden=true;${M[b]}})()`);if(b==='detective'){await page.waitForTimeout(1000);const ok=await ev(()=>{const c=document.querySelector('.dCase');if(c)c.click();return !!c});if(!ok)fails.push(a+'→detective: no case cards')}await ev(()=>{for(let k=0;k<40;k++)gameStep(1/60)});
  const s=await ev(check);const e=expect[b];const bad=[];
  if(JSON.stringify(s.live)!==JSON.stringify(e.live))bad.push('live='+s.live);
  if(e.ow!==undefined&&s.ow!==e.ow)bad.push('ow='+s.ow);
  const alt=b==='dad'||b==='dadFree'||b==='parrot'||b==='race';
  if(s.dog!==(!alt&&b!=='human'&&b!=='detective'))bad.push('dog='+s.dog);
  if(s.pp!==(b==='parrot'))bad.push('pp='+s.pp);
  if(s.nm!==(b==='dad'||b==='dadFree'||b==='parrot'))bad.push('nm='+s.nm);
  if(s.hat!==(b==='human'))bad.push('hat='+s.hat);
  if(s.hm!==(b==='human'))bad.push('hm='+s.hm);
  if(s.rings!==(b==='parrot'?8:0))bad.push('rings='+s.rings);
  if(s.items)bad.push('items='+s.items);
  if(s.zhud!==(b==='zombie'))bad.push('zhud='+s.zhud);
  if(s.bull||s.leash||s.carry||s.thrown)bad.push('leftover');
  if(s.cls.length!==(alt?1:0))bad.push('cls='+s.cls);if((b==='race')!==s.raceVis)bad.push('raceVis='+s.raceVis);
  if(!s.started)bad.push('notStarted');
  if(bad.length)fails.push(a+'→'+b+': '+bad.join(' '));
 }
 console.log('pairs',n,'fails',fails.length);fails.forEach(f=>console.log('FAIL',f));
 console.log(errors.length?errors.slice(0,5):'no page errors');await browser.close()})();
