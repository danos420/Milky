const {open}=require('./lib');
// Milky is placed on top of every piece of furniture he can stand on and must be able to walk off it
// (in at least one direction), and must be able to land on it again with a jump from the floor.
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:390,height:844},{touch:true});const ev=f=>page.evaluate(f);
 await ev(()=>{document.getElementById('startOpen').click();for(let k=0;k<5;k++)gameStep(1/60)});
 const r=await ev(()=>{const out=[];const dirs=[0,Math.PI/2,Math.PI,-Math.PI/2];
  for(const o of obstacles){if(o.solid||o.top>1.3||o.top<.2)continue;
   let off=0;const ends=[];
   for(const a of dirs){pos.set(o.x,0,o.z);jumpY=o.top;grounded=true;velocityY=0;rag.active=false;dizzy.active=false;flip.active=false;yaw=a;camYaw=a;
    for(let k=0;k<110;k++){stick.active=true;stick.x=0;stick.y=1;stick.mag=1;gameStep(1/60)}stick.active=false;for(let k=0;k<30;k++)gameStep(1/60);
    if(jumpY<.05)off++;ends.push(jumpY.toFixed(2))}
   out.push({name:o.name,at:[o.x,o.z],top:o.top,off,ends,ok:off>=1})}
  return out});
 const bad=r.filter(x=>!x.ok);console.log('platforms',r.length,'trapped',bad.length);bad.forEach(b=>console.log('FAIL',JSON.stringify(b)));
 console.log(errors.length?errors.slice(0,4):'no page errors');await browser.close()})();
