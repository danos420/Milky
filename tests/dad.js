const {open}=require('./lib');
// Drives each Dad mission with a scripted "player" and checks it ends with a win.
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);const out={m:[]};
 await ev(()=>{localStorage.clear();save.ep={};save.ep.dad={}});
 out.universe=await ev(()=>[...document.querySelectorAll('.uCard')].map(c=>c.textContent.slice(0,14)));
 await page.screenshot({path:'tests/shots/u_menu.png'});
 await ev(()=>[...document.querySelectorAll('.uCard')].find(c=>c.textContent.includes('אבא')).click());await wait(300);
 out.board=await ev(()=>({open:!document.getElementById('epBoard').hidden,n:document.querySelectorAll('.epLv').length}));
 await page.screenshot({path:'tests/shots/dad_board.png'});
 const only=process.argv[3]?process.argv[3].split(',').map(Number):null;
 for(let i=0;i<10;i++){if(only&&!only.includes(i))continue;
  await ev(`(()=>{document.getElementById('epBoard').hidden=true;document.getElementById('epEnd').hidden=true;EP.cur=EP.list.dad;EP.idx=${i};dadMissionStart(${i})})()`);await wait(900);
  await ev(`(()=>{const I=${i};const nm=NM.g.position;const at=(x,z)=>{pos.set(x,0,z)};const face=o=>{yaw=Math.atan2(o.x-pos.x,o.z-pos.z)};
   const shoot=()=>{const p=nm;let ok=false;for(const [dx,dz] of [[0,-2.2],[0,2.2],[-2.2,0],[2.2,0],[1.5,1.5],[-1.5,-1.5]]){if(walkable(p.x+dx,p.z+dz,.35)){at(p.x+dx,p.z+dz);ok=true;break}}face(p);throwCool=0;dadThrow()};
   for(let k=0;k<60*130&&!dm.over;k++){
    if(I===0||I===8){at(nm.x+.8,nm.z);if(!walkable(pos.x,pos.z,.3))at(nm.x,nm.z+.8);if(NM.stun<=0&&k%20===0&&dm.m.onCatch)dm.m.onCatch()}
    if(I===1){if(!dm.tvOn){const r=dm.rem.g.position;at(r.x+.5,r.z);if(!walkable(pos.x,pos.z,.3))at(r.x,r.z+.5);const h=dm.m.act();if(h)h.fn()}else if(!dSit){at(SEAT_APPROACH.x,SEAT_APPROACH.z);dadSitDown()}}
    if(I===2||I===5){if(NM.onChair||(I===5&&NM.going&&nm.distanceTo(new THREE.Vector3(ARMCHAIR.x,0,ARMCHAIR.z))<4)){if(dSit){face(nm);throwCool=0;dadThrow()}else shoot()}else if(!dSit){at(SEAT_APPROACH.x,SEAT_APPROACH.z);dadSitDown()}}
    if(I===3&&NM.stun<=0&&k%15===0)shoot();
    if(I===4){if(NM.stun<=0&&k%10===0)shoot()}
    if(I===6){const t=dm.m.target();if(t)at(t.x+.3,t.z)}
    if(I===7){if(nm.distanceTo(kebabHome)<5&&NM.stun<=0&&k%10===0)shoot();else{at(neighbor.g.position.x+1.2,neighbor.g.position.z);}}
    if(I===9){if(dm.called<3){if(!dSit){at(SEAT_APPROACH.x,SEAT_APPROACH.z);dadSitDown()}else if(k%30===0)dm.m.act().fn()}else if(dm.near){if(dSit)dadStand();at(nm.x+1,nm.z);if(k%20===0){const h=dm.m.act();if(h)h.fn()}}}
    gameStep(1/60)}})()`);
  await wait(2200);
  const r=await ev(()=>({hits:dm.hits,stolen:dm.stolen,stole:dm.stole,sit:dm.sitT&&dm.sitT.toFixed(1),chair:NM.onChair,i:dm.i,t:Math.round(dm.t),over:dm.over,end:!document.getElementById('epEnd').hidden,title:document.getElementById('epEndTitle').textContent,stars:save.ep.dad['m'+(dm.i+1)]||0}));out.m.push(r);
  if(i===2||i===9)await page.screenshot({path:'tests/shots/dad_m'+i+'.png'});
 }
 out.complete=await ev(()=>epComplete('dad'));
 // open-world switch
 await ev(()=>{document.getElementById('epEnd').hidden=true;setDadPlay(false);setMode(true);started=true;for(let k=0;k<5;k++)gameStep(1/60)});
 out.chip=await ev(()=>!swapChip.hidden);
 await ev(()=>{swapChip.click();for(let k=0;k<120;k++)gameStep(1/60)});
 out.asDad=await ev(()=>({DADP,dad:dad.visible,dog:dog.visible,nm:NM.g.visible,act:actBtn.textContent}));
 await page.screenshot({path:'tests/shots/dad_free.png'});
 await ev(()=>{swapChip.click();for(let k=0;k<30;k++)gameStep(1/60)});
 out.back=await ev(()=>({DADP,dog:dog.visible,nm:NM.g.visible}));
 console.log(JSON.stringify(out,null,0),errors);await browser.close()})();
