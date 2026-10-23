const {open}=require('./lib');
(async()=>{
 const {browser,page,errors}=await open(process.argv[2],{width:800,height:500},{noRaf:true});
 await page.evaluate(()=>{document.querySelector('#start').click();window.run=(sec,each)=>{const n=Math.round(sec*30);for(let i=0;i<n;i++){gameStep(1/30);if(each&&each(i)===true)return i/30}return -1}});
 const R=[];const check=(n,ok,info)=>R.push((ok?'PASS ':'FAIL ')+n+(info!==undefined?'  — '+info:''));
 let r=await page.evaluate(()=>{reset();pos.set(-1.2,0,-7.5);yaw=Math.PI;keys.KeyW=true;run(2);keys.KeyW=false;return pos.z});
 check('Milky walks out the balcony door into the yard',r<-10,'z='+r.toFixed(2));
 r=await page.evaluate(()=>{reset();pos.set(14,0,-17);jumpY=2;grounded=false;velocityY=0;let maxY=0;run(3,()=>{maxY=Math.max(maxY,jumpY)});return maxY});
 check('trampoline bounces Milky high',r>3,'max height '+r.toFixed(2));
 r=await page.evaluate(()=>{reset();pos.set(14,0,-17);jumpY=3;grounded=false;velocityY=0;let flips=0,pressed=false;
   run(2.5,()=>{if(!grounded&&jumpY>2&&velocityY>0&&!pressed&&!flip.active){keys.Space=true;pressed=true}else{keys.Space=false}});
   // walk off the trampoline and land on the grass
   keys.KeyW=true;yaw=Math.PI/2;const s0=score;run(3);keys.KeyW=false;run(3);return {score,flipDone:challengesDone.has('flip'),rag:rag.active}});
 check('flip in the air then land = trick score',r.flipDone||r.score>0,JSON.stringify(r));
 r=await page.evaluate(()=>{reset();const ch=bodies.find(b=>b.kind==='chair');pos.set(ch.o.position.x,0,ch.o.position.z+1.4);yaw=Math.PI;run(.05);const x0=ch.o.position.x,z0=ch.o.position.z;toggleGrab();const got=grab&&grab.b===ch;keys.KeyW=true;run(2.5);keys.KeyW=false;const moved=Math.hypot(ch.o.position.x-x0,ch.o.position.z-z0);toggleGrab();return {got,moved:+moved.toFixed(2),released:!grab}});
 check('drag a plastic chair with the tongue',r.got&&r.moved>3&&r.released,JSON.stringify(r));
 r=await page.evaluate(()=>{reset();const d=bodies.find(b=>b.kind==='duck');pos.set(d.o.position.x,0,d.o.position.z-1.1);yaw=0;run(.05);toggleGrab();const small=grab&&grab.small;keys.KeyW=true;run(1);keys.KeyW=false;const y=d.o.position.y;toggleGrab();run(.5);return {small,yInMouth:+y.toFixed(2),after:+d.o.position.y.toFixed(2)}});
 check('carry the duck in the mouth, then drop it',r.small&&r.yInMouth>1&&r.after<.1,JSON.stringify(r));
 r=await page.evaluate(()=>{reset();pos.set(0,0,-20);yaw=0;keys.KeyW=true;keys.ShiftLeft=true;run(.5);startRagdoll();keys.KeyW=false;keys.ShiftLeft=false;const t=run(8,()=>!rag.active);return {t,inside:walkable(pos.x,pos.z,.4),rot:+dog.rotation.x.toFixed(2)}});
 check('ragdoll flops and Milky gets back up',r.t>2&&r.inside,JSON.stringify(r));
 r=await page.evaluate(()=>{reset();pos.set(2,0,-32);yaw=Math.PI;interact();const st=kebabState;pos.set(-1,0,-28);let caught=-1;run(15,i=>{if(caught<0&&kebabState==='grill')caught=i/30});return {st,caught}});
 check('steal kebab, neighbour chases and catches Milky',r.st==='carried'&&r.caught>0,JSON.stringify(r));
 r=await page.evaluate(()=>{reset();pos.set(2,0,-32);yaw=Math.PI;interact();pos.set(16.5,0,-26);jumpY=2.6;grounded=true;run(8);return {state:kebabState,ch:challengesDone.has('kebab'),score}});
 check('keep the kebab 7s (on the shed roof) = eat it',r.state==='eaten'&&r.ch,JSON.stringify(r));
 r=await page.evaluate(()=>{reset();pos.set(-14,0,-27);yaw=Math.PI;keys.KeyW=true;keys.ShiftLeft=true;run(.6);keys.KeyW=false;keys.ShiftLeft=false;const s=ladyState;run(1);return {s,wet}});
 check('running through the flowers: the neighbour sprays Milky',r.s==='spray'&&r.wet===1,JSON.stringify(r));
 r=await page.evaluate(()=>{reset();pos.set(-12,0,-21.5);yaw=0;keys.KeyW=true;run(1.2);keys.KeyW=false;const w=wet,inP=inPool;pos.set(-8,0,-21);run(.5);const sh=shakeT>0;run(2);return {w,inP,sh,dry:wet===0}});
 check('pool makes Milky wet, he shakes it off outside',r.w===1&&r.sh&&r.dry,JSON.stringify(r));
 r=await page.evaluate(()=>{reset();catS.cool=0;const p0=cat.position.clone();pos.set(p0.x,0,p0.z+3);run(.2);const fled=catS.moving;const t=run(5,()=>!catS.moving);const p1=cat.position.clone();pos.set(p1.x,0,p1.z+.8);jumpY=1.3;grounded=true;run(.2);return {fled,arrived:t>0,moved:+p0.distanceTo(p1).toFixed(1),touched:challengesDone.has('cat')}});
 check('cat runs away along the fence, touching it scores',r.fled&&r.arrived&&r.moved>3&&r.touched,JSON.stringify(r));
 r=await page.evaluate(()=>{reset();for(const b of bones){const x=b.g.position.x,z=b.g.position.z;const o=obstacles.find(o=>!o.solid&&insidePlatform(o,x,z,-.05));pos.set(x,0,z);jumpY=b.y>4?3.8:o?o.top:0;grounded=true;velocityY=0;updateBones(0)}return {found:bonesFound,ch:challengesDone.has('bones')}});
 check('all 12 golden bones can be collected',r.found===12&&r.ch,JSON.stringify(r));
 r=await page.evaluate(()=>{reset();const reach=[];for(const b of BONE_SPOTS){const [x,y,z]=b;const o=obstacles.find(o=>!o.solid&&insidePlatform(o,x,z,-.05));const stand=o?o.top:0;let ok=(Math.abs(stand+1-y)<1.1&&walkable(x,z,.44))||(Math.hypot(x-14,z+17)<1.4);reach.push(ok)}return reach});
 check('every bone sits on something Milky can reach',r.every(Boolean),JSON.stringify(r));
 r=await page.evaluate(()=>{reset();let seed=5;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;let bad=0,oob=0,nbBad=0;pos.set(0,0,-20);
  for(let i=0;i<30*180;i++){if(i%20===0){for(const k of ['KeyW','KeyA','KeyD','ShiftLeft','Space'])keys[k]=false;keys.KeyW=rnd()<.85;if(rnd()<.4)keys[rnd()<.5?'KeyA':'KeyD']=true;keys.ShiftLeft=rnd()<.4;keys.Space=rnd()<.2;if(rnd()<.08)interact();if(rnd()<.06)toggleGrab();if(rnd()<.02)startRagdoll()}
   gameStep(1/30);if(!walkable(pos.x,pos.z,.39))oob++;if(!dadFree(neighbor.g.position.x,neighbor.g.position.z,NB_R-.03))nbBad++}
  return {oob,nbBad,score,bones:bonesFound,challenges:challengesDone.size}});
 check('3-min yard soak: nobody leaves the world',r.oob===0&&r.nbBad===0,JSON.stringify(r));
 console.log(R.join('\n'));console.log(errors.length?errors:'no page errors');await browser.close();
})();
