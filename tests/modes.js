const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2],{width:1100,height:700});
 const r=await page.evaluate(async()=>{
  const out={};
  document.querySelector('#overlay .start, #startBtn, #overlay button')?.click();
  started=true;document.querySelector('#overlay').style.display='none';
  // locked by default on a fresh save
  out.lockedFresh=MODE_DEFS.filter(d=>isUnlocked(d)).length;
  // grant progress
  save.bones=[...Array(12).keys()];save.challenges=challengeDefs.slice(0,10).map(c=>c[0]);save.day={completed:2,bestStars:3,bestTime:300,bestScore:9000};save.best=9000;
  recordProgress();
  out.unlocked=MODE_DEFS.filter(d=>isUnlocked(d)).length+WEAR_DEFS.filter(d=>isUnlocked(d)).length;
  out.fresh=document.getElementById('modeToggle').classList.contains('fresh');
  document.getElementById('modeToggle').click();
  out.panelOpen=!document.getElementById('modePanel').hidden;
  out.items=document.querySelectorAll('#modePanel .modeItem').length;
  // giant
  toggleMode('giant');out.giantScale=dog.scale.x;toggleMode('tiny');out.tinyScale=dog.scale.x;out.giantOff=!MUT.giant;
  toggleMode('tiny');
  // moon: jump height
  toggleMode('moon');keys.Space=true;let maxY=0;for(let i=0;i<200;i++){gameStep(1/60);maxY=Math.max(maxY,jumpY);if(i==2)keys.Space=false}
  out.moonJump=+maxY.toFixed(2);toggleMode('moon');
  keys.Space=true;maxY=0;for(let i=0;i<120;i++){gameStep(1/60);maxY=Math.max(maxY,jumpY);if(i==2)keys.Space=false}out.normalJump=+maxY.toFixed(2);
  // turbo speed
  toggleMode('turbo');keys.KeyW=true;keys.ShiftLeft=true;for(let i=0;i<60;i++)gameStep(1/60);out.turboSpeed=+curSpeed.toFixed(2);keys.KeyW=false;keys.ShiftLeft=false;toggleMode('turbo');
  for(let i=0;i<60;i++)gameStep(1/60);
  // hungry: put a duck in front of Milky
  toggleMode('hungry');const duck=extras.find(p=>p.kind==='duck');pos.set(duck.g.position.x,0,duck.g.position.z-.6);jumpY=0;grounded=true;
  const sc=score;for(let i=0;i<60;i++)gameStep(1/60);out.duckEaten=!duck.g.visible;out.scoreUp=score-sc;
  toggleMode('hungry');out.duckBack=duck.g.visible;
  // wardrobe
  for(const w of WEAR_DEFS)toggleWear(w.id);out.wearOn=WEAR_DEFS.filter(w=>WEAR[w.id].visible).length;
  // persistence
  out.saved=JSON.parse(localStorage.getItem('milky-bardak-save-v1')).mods;
  return out;
 });
 console.log(JSON.stringify(r,null,1));
 // reload: mods kept
 await page.reload();await page.waitForTimeout(900);
 const r2=await page.evaluate(()=>({wear:WEAR_DEFS.filter(w=>WEAR[w.id].visible).length,on:save.mods.on}));
 console.log('after reload',JSON.stringify(r2),errors);
 await browser.close();
})();
