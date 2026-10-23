// Renders Milky's portrait from the game itself for the app icon.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1024,height:1024}});
 await p.route(/three(\.min)?\.js/,r=>r.fulfill({body:fs.readFileSync(path.join(__dirname,'../assets/vendor/three.min.js')),contentType:'application/javascript'}));
 await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForTimeout(1200);
 await p.evaluate(()=>{
  started=true;for(const el of document.querySelectorAll('body>*:not(canvas)'))el.style.display='none';
  const keep=new Set([dog]);for(const o of scene.children)if(!keep.has(o)&&!o.isLight)o.visible=false;
    pos.set(0,0,0);yaw=0;mood=1;tongueTimer=99;
  for(let i=0;i<30;i++)gameStep(1/60);
  dog.position.set(0,0,0);dog.rotation.set(0,.45,0);headPivot.rotation.set(-.12,0,.16);dog.updateMatrixWorld(true);const H=headPivot.getWorldPosition(new THREE.Vector3()),a=.45-.42;
  scene.background=new THREE.Color(0xf2a541);scene.fog=null;started=false;renderer.toneMappingExposure=1.0;camera.fov=30;camera.aspect=1;camera.updateProjectionMatrix();
  camera.position.set(H.x+Math.sin(a)*2.75,H.y+.3,H.z+Math.cos(a)*2.75);camera.lookAt(H.x+.05,H.y-.08,H.z);renderer.setPixelRatio(1);renderer.setSize(1024,1024);
  renderer.render(scene,camera);renderFrame=()=>renderer.render(scene,camera)});
 await p.waitForTimeout(300);await p.screenshot({path:process.argv[3]});await b.close()})();
