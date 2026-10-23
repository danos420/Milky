const {open}=require('./lib');
(async()=>{const {page,browser}=await open(process.argv[2],{width:600,height:400},{noRaf:true});
 const r=await page.evaluate(()=>{started=true;document.querySelector('#overlay').style.display='none';const out={};
  for(const [name,shift] of [['walk',false],['run',true]]){reset();pos.set(0,0,-30);yaw=0;camYaw=0;keys.KeyW=true;keys.ShiftLeft=shift;
   const v=new THREE.Vector3(),prev=[];let slip=0,n=0,minY=9,cyc=0,lastS=steps;
   for(let i=0;i<240;i++){gameStep(1/60);renderFrame();if(i<90)continue;
    legs.forEach((l,k)=>{l.knee.localToWorld(v.set(0,-.58,.06));if(prev[k]&&v.y<.12){slip+=(v.z-prev[k].z);n++}prev[k]=v.clone();minY=Math.min(minY,v.y)})}
   out[name]={speed:+curSpeed.toFixed(2),slipPerContactFrame:+(slip/Math.max(n,1)).toFixed(3),groundPerFrame:+(curSpeed/60).toFixed(3),contacts:n,minY:+minY.toFixed(2)}}
  keys.KeyW=false;keys.ShiftLeft=false;return out});
 console.log(process.argv[2],JSON.stringify(r));await browser.close()})();
