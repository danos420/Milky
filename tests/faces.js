const {open}=require('./lib');
(async()=>{const {browser,page,errors}=await open(process.argv[2],{width:300,height:300},{noRaf:true});
 await page.evaluate(()=>{document.querySelector('#start').click();document.getElementById('uiTop').style.display='none';document.getElementById('controls').style.display='none';reset();
  window.cam=(o,y,d)=>{const p=o.position;camera.position.set(p.x+Math.sin(o.rotation.y)*d,y,p.z+Math.cos(o.rotation.y)*d);camera.lookAt(p.x,y-.05,p.z);renderer.render(scene,camera)}});
 const shots=[];
 for(const m of ['smile','shout','love','sleep','laugh','confused','sad','shock']){
  await page.evaluate(m=>{dad.position.set(0,0,-4);dad.rotation.y=0;dadSeated=false;for(let i=0;i<20;i++)updateFace(dadFace,m,1/30);dadFace.blinkUntil=0;updateFace(dadFace,m,1/30);cam(dad,2.5,1.5)},m);
  await page.screenshot({path:`shots/f-dad-${m}.png`});shots.push(`f-dad-${m}`)}
 for(const [who,m] of [['dani','angry'],['dani','laugh'],['nb','shout'],['lady','angry']]){
  await page.evaluate(([w,m])=>{dad.position.set(9,0,9);neighbor.g.position.set(-9,0,-20);lady.g.position.set(-12,0,-25);const F=w==='dani'?daniFace:w==='nb'?neighbor.face:lady.face;const o=w==='dani'?dani:w==='nb'?neighbor.g:lady.g;o.position.set(0,0,-4);o.rotation.y=0;o.position.y=0;for(let i=0;i<20;i++)updateFace(F,m,1/30);F.blinkUntil=0;updateFace(F,m,1/30);cam(o,w==='dani'?2.35:2.45,1.5)},[who,m]);
  await page.screenshot({path:`shots/f-${who}-${m}.png`});shots.push(`f-${who}-${m}`)}
 console.log(shots.join(' '),errors);await browser.close()})();
