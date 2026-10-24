const {open}=require('./lib');
// Drives the on-screen joystick (no teleporting) for every playable character and checks
// that the visible model moves smoothly: no frame jumps, no back-and-forth shaking, no NaN.
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:390,height:844},{touch:true});
 const ev=f=>page.evaluate(f);const out={};
 await ev(()=>{save.ep.dad={};EP.list.dad.levels.forEach(l=>save.ep.dad[l.id]=3);save.ep.parrot={};EP.list.parrot.levels.forEach(l=>save.ep.parrot[l.id]=3)});
 const setups={
  story:"document.getElementById('start').click()",
  open:"document.getElementById('startOpen').click()",
  human:"EP.cur=EP.list.human;EP.idx=0;EP.list.human.start(0)",
  detective:"document.getElementById('dBoard')&&(document.getElementById('dBoard').hidden=true);setDetective(true);startGame()",
  zombie:"EP.cur=EP.list.zombie;EP.idx=0;EP.list.zombie.start(0)",
  dadMission:"EP.cur=EP.list.dad;EP.idx=0;dadMissionStart(0)",
  dadFree:"setMode(true);startGame();setDadPlay(true);dm.m=null",
  dadStreet:"setMode(true);startGame();setDadPlay(true);dm.m=null;pos.set(12,0,10)",
  parrotFly:"EP.cur=EP.list.parrot;EP.idx=0;parrotMissionStart(0);keys.Space=true",
  parrotFree:"setMode(true);startGame();setParrotPlay(true);PM.m=null"};
 const only=process.argv[3]?process.argv[3].split(','):null;
 for(const [name,code] of Object.entries(setups)){if(only&&!only.includes(name))continue;
  await ev(`(()=>{for(const id of ['epBoard','epEnd','dBoard','dEnd','hEnd','zOver'])if(document.getElementById(id))document.getElementById(id).hidden=true;${code}})()`);await page.waitForTimeout(300);
  out[name]=await ev(`(()=>{const model=()=>window.DADP?dad:window.PARP?PP:(window.HM_READY&&HUMAN&&HM.g.visible)?HM.g:(window.DETECT&&window.DM&&DM.g&&DM.g.visible)?DM.g:dog;
   const path=[[0,1],[.7,.7],[1,0],[0,-1],[-.8,.4],[0,1]];let maxStep=0,flips=0,nan=0,prev=null,prevD=null,gap=0,frames=0,moved=0;const m0=model().position.clone();
   for(const [sx,sy] of path){stick.active=true;stick.x=sx;stick.y=sy;stick.mag=1;
    for(let k=0;k<70;k++){gameStep(1/60);frames++;const p=model().position;if(!isFinite(p.x+p.y+p.z)||!isFinite(pos.x+pos.z)){nan++;continue}
     if(prev){const dx=p.x-prev.x,dz=p.z-prev.z,s=Math.hypot(dx,dz);moved+=s;if(s>maxStep){maxStep=s;window._qaAt=[frames,prev.x.toFixed(1),prev.z.toFixed(1),p.x.toFixed(1),p.z.toFixed(1),model()===dog?"dog":"other",String(rag.active)]}if(prevD&&s>.01&&prevD.s>.01&&(dx*prevD.dx+dz*prevD.dz)<-.5*s*prevD.s)flips++;prevD={dx,dz,s}}
     prev=p.clone();gap=Math.max(gap,Math.hypot(p.x-pos.x,p.z-pos.z))}}
   stick.active=false;stick.mag=0;keys.Space=false;for(let k=0;k<20;k++)gameStep(1/60);
   return {at:window._qaAt,maxStep:+maxStep.toFixed(3),flips,nan,gap:+gap.toFixed(2),moved:+moved.toFixed(1),frames}})()`);
  const o=out[name];o.ok=o.nan===0&&o.maxStep<.25&&o.flips<6&&o.gap<.6&&o.moved>2;
  await page.screenshot({path:'tests/shots/qa_'+name+'.png'});
 }
 for(const [k,v] of Object.entries(out))console.log((v.ok?'PASS ':'FAIL ')+k.padEnd(11),JSON.stringify(v));
 console.log(errors.length?errors:'no page errors');await browser.close()})();
