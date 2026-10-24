const {open}=require('./lib');
// Flight physics + all 10 parrot missions with a scripted player, then the 3-way character switch.
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);const out={m:[]};
 await ev(()=>{localStorage.clear();save.ep={parrot:{},dad:{}}});
console.log('s1');out.card=await ev(()=>[...document.querySelectorAll('.uCard')].some(c=>c.textContent.includes('קוקו')));
 // flight: hold space 1.5s, then release and glide
console.log('s2');out.flight=await ev(()=>{EP.cur=EP.list.parrot;EP.idx=0;parrotMissionStart(0);keys.Space=true;for(let k=0;k<90;k++)gameStep(1/60);const up=jumpY;keys.Space=false;for(let k=0;k<30;k++)gameStep(1/60);const glide=velocityY;keys.Space=true;for(let k=0;k<400;k++)gameStep(1/60);const cap=jumpY;keys.Space=false;return {up:+up.toFixed(2),glide:+glide.toFixed(2),cap:+cap.toFixed(2),max:pMax()}});
console.log('s3',JSON.stringify(out.flight));await wait(300);await page.screenshot({path:'tests/shots/p_fly.png'});console.log('s4');
 const only=process.argv[3]?process.argv[3].split(',').map(Number):null;
 for(let i=0;i<10;i++){if(only&&!only.includes(i))continue;
  await ev(`(()=>{document.getElementById('epBoard').hidden=true;document.getElementById('epEnd').hidden=true;EP.cur=EP.list.parrot;EP.idx=${i};parrotMissionStart(${i})})()`);await wait(300);
  await ev(`(()=>{const fly=(x,y,z)=>{pos.set(x,0,z);jumpY=y;grounded=y<=0;velocityY=0};const act=()=>{ctxT=0;const h=ctxHook('act');if(h&&h.on)h.fn()};
   for(let k=0;k<60*120&&!PM.over;k++){const m=PM.m;
    if(PM.rings){const r=RINGS[PM.k];if(r)fly(r.position.x,r.position.y-.4,r.position.z)}
    else if(PM.v){const v=visitNext();if(v){const p=v.g();fly(p.x+1.2,1.2,p.z);if(!walkable(pos.x,pos.z,.3))fly(p.x,1.2,p.z+1.2);if(k%30===0)act()}else fly(PERCH.x,3.3,PERCH.z)}
    else if(PM.cats){const i=PM.cats.findIndex(v=>v<2);if(i>=0){const p=SCATS[i].g.position;fly(p.x,(p.y||0)+1.6,p.z)}}
    else if(PM.item&&!pCarry){const p=PM.item.position;fly(p.x,Math.max(0,p.y-.2),p.z)}
    else if(pCarry){const t=m.target();fly(t.x,t===PERCH?3.3:.8,t.z)}
    else if(m.t.includes('איבוד')){const n=NM.g.position;if(!PM.follow)fly(n.x+1.5,1,n.z+1.5);else{const dx=1-n.x,dz=-2-n.z,d=Math.hypot(dx,dz)||1;fly(n.x+dx/d*2.5,1,n.z+dz/d*2.5)}}
    gameStep(1/60)}})()`);
  await wait(2200);
  const r=await ev(()=>({i:PM.i,t:Math.round(PM.t),over:PM.over,title:document.getElementById('epEndTitle').textContent,stars:save.ep.parrot['p'+(PM.i+1)]||0,fe:PM.feathers,nm:NM.g.position.toArray().map(v=>+v.toFixed(1)),carry:!!pCarry}));out.m.push(r);console.log("M",JSON.stringify(r));
  if(i===3||i===9)await page.screenshot({path:'tests/shots/p_m'+i+'.png'});
 }
console.log('s5');out.complete=await ev(()=>epComplete('parrot'));
 await ev(()=>{save.ep.dad={};EP.list.dad.levels.forEach(l=>save.ep.dad[l.id]=3);document.getElementById('epEnd').hidden=true;setParrotPlay(false);setMode(true);started=true;for(let k=0;k<5;k++)gameStep(1/60)});
console.log('s6');const seq=[];for(let k=0;k<4;k++){await ev(()=>{swapChip.click();for(let j=0;j<10;j++)gameStep(1/60)});seq.push(await ev(()=>charCur().id+(dog.visible?'+dog':'')+(PP.visible?'+pp':'')+(window.DADP?'+dad':'')))}
console.log('s7',seq);out.cycle=seq;
 await ev(()=>{if(!PARP)setParrotPlay(true);keys.Space=true;for(let j=0;j<80;j++)gameStep(1/60);keys.Space=false;pos.set(12,0,14);yaw=Math.PI});await wait(400);await page.screenshot({path:'tests/shots/p_free.png'});
 console.log(JSON.stringify(out),errors);await browser.close()})();
