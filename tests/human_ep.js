const {open}=require('./lib');
// Runs every human errand as an episode level with a scripted player.
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);const out={e:[]};
 await ev(()=>{localStorage.clear();save.ep.human={}});
 await ev(()=>[...document.querySelectorAll('.uCard')].find(c=>c.textContent.includes('בן אדם')).click());await wait(300);
 out.board=await ev(()=>({open:!document.getElementById('epBoard').hidden,n:document.querySelectorAll('.epLv').length}));
 const only=process.argv[3]?process.argv[3].split(',').map(Number):null;
 for(let i=0;i<10;i++){if(only&&!only.includes(i))continue;
  await ev(`(()=>{document.getElementById('epBoard').hidden=true;document.getElementById('epEnd').hidden=true;EP.cur=EP.list.human;EP.idx=${i};EP.list.human.start(${i})})()`);await wait(400);
  for(let round=0;round<90;round++){
   const st=await ev(`(()=>{const e=ERRANDS[hs.i];if(!e)return 'done';const at=(x,z)=>{pos.set(x,0,z);rag.active=false};
    const act=()=>{ctxT=0;updateCtxButtons(1);const h=ctxHook('act');if(h&&h.on)h.fn();return h&&h.l};
    if(e.id==='milk'){if(hs.step===0){at(24.4,5.6);act()}else if(hs.step===2){at(12,20)}}
    if(e.id==='post'&&hs.step===0){const c=COURIER.g.position;at(c.x,c.z+PEOPLE[1].dir*1.2);act()}
    if(e.id==='vet'){if(hs.step===0)at(23,14);if(hs.step===2&&vet.state==='chase')at(12,14)}
    if(e.id==='birds'&&hs.step===0){at(BENCH.x+.6,BENCH.z+1.4);act()}
    if(e.id==='pizza'){if(hs.step===0){at(PCOUNTER.x-1.2,PCOUNTER.z);act()}if(hs.step===2&&!hs.hasExt){at(EXT_WALL.x+.7,EXT_WALL.z);act()}else if(hs.step===2){at(OVEN.x-1.5,OVEN.z);act()}}
    if(e.id==='falafel'){if(hs.step===0){at(FALAFEL.x+.9,FALAFEL.z-.9);act()}else if(hs.step===1){const d=dani.position;at(d.x+1,d.z);if(!walkable(pos.x,pos.z,.3))at(d.x,d.z+1);act()}}
    if(e.id==='hair'&&hs.step===0){at(GTABLE.x,GTABLE.z);jumpY=.95;grounded=true}
    if(e.id==='parrot'&&hs.step===0){at(parrot.position.x+1,parrot.position.z);hs.teachCool=0;act()}
    if(e.id==='guard'&&hs.step===0){at(19.1,42);act()}
    if(e.id==='home'&&hs.step===0){at(dad.position.x+1.2,dad.position.z);if(!walkable(pos.x,pos.z,.3))at(dad.position.x,dad.position.z+1.2)}
    for(let k=0;k<20;k++)gameStep(1/60);return e.id+':'+hs.step})()`);
   if(st==='done')break;await wait(250);
   if(!(await ev(()=>document.getElementById('epEnd').hidden)))break;
  }
  await wait(3000);
  const r=await ev(()=>({end:!document.getElementById('epEnd').hidden,title:document.getElementById('epEndTitle').textContent,stats:document.getElementById('epEndStats').textContent.slice(0,60)}));r.i=i;out.e.push(r);
  if(i===3||i===8)await page.screenshot({path:'tests/shots/h_ep'+i+'.png'});
 }
 out.saved=await ev(()=>JSON.stringify(save.ep.human));
 console.log(JSON.stringify(out),errors);await browser.close()})();
