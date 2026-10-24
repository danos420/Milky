const {open}=require('./lib');
// 40s of random play per mode: random stick, random taps on every visible button.
// Watches for page errors, NaN, leaving the walkable world, absurd heights, and per-frame cost.
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:390,height:844},{touch:true});
 const ev=f=>page.evaluate(f);const res={};
 await ev(()=>{save.ep.dad={};EP.list.dad.levels.forEach(l=>save.ep.dad[l.id]=3);save.ep.parrot={};EP.list.parrot.levels.forEach(l=>save.ep.parrot[l.id]=3)});
 const M={story:"document.getElementById('start').click()",open:"document.getElementById('startOpen').click()",zombie:"EP.cur=EP.list.zombie;EP.idx=3;EP.list.zombie.start(3)",
  detective:"document.getElementById('startDetective').click()",human:"EP.cur=EP.list.human;EP.idx=4;EP.list.human.start(4)",dad:"EP.cur=EP.list.dad;EP.idx=2;dadMissionStart(2)",
  dadFree:"document.getElementById('startOpen').click();setDadPlay(true);dm.m=null",parrot:"EP.cur=EP.list.parrot;EP.idx=6;parrotMissionStart(6)",parrotFree:"document.getElementById('startOpen').click();setParrotPlay(true);PM.m=null"};
 const only=process.argv[3]?process.argv[3].split(','):null;let seed=7;
 for(const [name,code] of Object.entries(M)){if(only&&!only.includes(name))continue;
  await ev(()=>document.getElementById('menuBtn').click());
  await ev(`(()=>{for(const id of ['epBoard','epEnd','dBoard','dEnd','hEnd','zOver','dayEnd'])document.getElementById(id).hidden=true;${code}})()`);
  if(name==='detective'){await page.waitForTimeout(400);await ev(()=>document.querySelector('.dCase').click())}
  await page.waitForTimeout(200);
  const r=await ev(`(()=>{let s=${seed++};const rnd=()=>(s=(s*16807)%2147483647)/2147483647;const btns=['actBtn','grabBtn','turboBtn','ragdollBtn','moodBtn','trainBtn'];
   let bad=0,nanF=0,out=0,hi=0,ms=0,maxMs=0,moved=0,last=pos.clone(),stuck=0,frames=0,errs=0;
   for(let sec=0;sec<40;sec++){stick.active=rnd()<.85;const a=rnd()*6.28;stick.x=Math.sin(a);stick.y=Math.cos(a);stick.mag=.4+rnd()*.6;keys.Space=rnd()<.25;keys.ShiftLeft=rnd()<.3;
    for(let k=0;k<60;k++){if(rnd()<.03){const b=document.getElementById(btns[Math.floor(rnd()*btns.length)]);if(b&&b.offsetParent&&!b.disabled)try{b.click()}catch(e){errs++}}
     const t0=performance.now();try{gameStep(1/60)}catch(e){errs++;if(errs<3)console.error('step '+e.message)}const d=performance.now()-t0;ms+=d;if(d>maxMs)maxMs=d;frames++;
     if(!isFinite(pos.x+pos.z+jumpY)){nanF++;pos.set(0,0,0);jumpY=0}
     if(!rag.active&&!walkable(pos.x,pos.z,.05))out++;if(jumpY>9)hi++;
     if(document.getElementById('epEnd').hidden===false||document.getElementById('dEnd').hidden===false){document.getElementById('epEnd').hidden=true;document.getElementById('dEnd').hidden=true;started=true}}
    const dd=pos.distanceTo(last);moved+=dd;if(dd<.05&&stick.active)stuck++;last.copy(pos)}
   stick.active=false;keys.Space=false;keys.ShiftLeft=false;
   renderer.render(scene,camera);const info=renderer.info.render;
   return {avgMs:+(ms/frames).toFixed(2),maxMs:+maxMs.toFixed(1),nan:nanF,outside:out,tooHigh:hi,stuckSec:stuck,moved:Math.round(moved),errs,calls:info.calls,tris:info.triangles}})()`);
  r.ok=!r.nan&&r.outside<30&&!r.tooHigh&&!r.errs&&r.stuckSec<14;res[name]=r;
 }
 for(const [k,v] of Object.entries(res))console.log((v.ok?'PASS ':'FAIL ')+k.padEnd(11),JSON.stringify(v));
 console.log(errors.length?errors.slice(0,6):'no page errors');await browser.close()})();
