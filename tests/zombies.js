const {open}=require('./lib');
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:1000,height:640});
 const ev=f=>page.evaluate(f);const wait=ms=>page.waitForTimeout(ms);const out={};
 await ev(()=>localStorage.removeItem('milky-mode'));await page.click('#startZombie');await wait(300);
 out.start=await ev(()=>({Z:ZOMBIE,hud:!zHud.hidden,hidden:ZHIDE().every(g=>!g.visible),light:day.light}));
 await ev(()=>{pos.set(0,0,0);for(let i=0;i<60*8;i++)gameStep(1/60)});
 out.wave1=await ev(()=>({wave:zs.wave,alive:zs.alive,toSpawn:zs.toSpawn,hearts:zs.hearts}));
 await wait(400);await page.screenshot({path:'tests/shots/z_wave.png'});
 out.bark=await ev(()=>{const z=ZPOOL.find(z=>z.on&&z.fall<=0);z.P.g.position.set(pos.x+1.5,0,pos.z);z.hp=2;zs.barkCool=0;zBark();const h1=z.hp;zs.barkCool=0;z.stun=0;z.P.g.position.set(pos.x+1.5,0,pos.z);zBark();return [h1,z.hp,z.fall>0]});
 out.stomp=await ev(()=>{const z=ZPOOL.find(z=>z.on&&z.fall<=0);if(!z)return 'none';pos.set(z.P.g.position.x+.5,0,z.P.g.position.z);jumpY=2;grounded=false;velocityY=0;for(let i=0;i<60;i++)gameStep(1/60);return z.fall>0||!z.on});
 out.hurt=await ev(()=>{zs.inv=0;rag.active=false;for(let i=0;i<200;i++)gameStep(1/60);zs.inv=0;let z=ZPOOL.find(z=>z.on&&z.fall<=0);if(!z){zSpawn();z=ZPOOL.find(z=>z.on&&z.fall<=0)}z.hitCool=0;z.stun=0;z.P.g.position.set(pos.x+.5,0,pos.z);jumpY=0;grounded=true;gameStep(1/60);return zs.hearts});
 out.wave2=await ev(()=>{for(const z of ZPOOL)if(z.on)zKO(z);zs.toSpawn=0;for(let i=0;i<60*12;i++)gameStep(1/60);return {wave:zs.wave,hearts:zs.hearts}});
 out.street=await ev(()=>{pos.set(13,0,20);rag.active=false;for(const z of ZPOOL)if(z.on)zKO(z);for(let i=0;i<60*4;i++)gameStep(1/60);zs.toSpawn=Math.max(zs.toSpawn,2);for(let i=0;i<60*3;i++)gameStep(1/60);return ZPOOL.filter(z=>z.on&&z.fall<=0).map(z=>zoneOf(z.P.g.position.x,z.P.g.position.z))});
 await ev(()=>{yaw=Math.PI;camYaw=Math.PI});await wait(500);await page.screenshot({path:'tests/shots/z_street.png'});
 out.over=await ev(()=>{zs.hearts=1;zs.inv=0;rag.active=false;let z=ZPOOL.find(z=>z.on&&z.fall<=0);if(!z){zSpawn();z=ZPOOL.find(z=>z.on)}z.hitCool=0;z.stun=0;z.fall=0;z.P.g.position.set(pos.x+.5,0,pos.z);jumpY=0;gameStep(1/60);return zs.over});
 await wait(1800);out.modal=await ev(()=>!zOver.hidden);await page.screenshot({path:'tests/shots/z_over.png'});
 await ev(()=>document.getElementById('zQuit').click());out.quit=await ev(()=>({Z:ZOMBIE,hud:zHud.hidden,people:ZHIDE().every(g=>g.visible),zombies:ZPOOL.filter(z=>z.P.g.visible).length}));
 console.log(JSON.stringify(out),errors);await browser.close()})();
