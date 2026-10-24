const {open}=require('./lib');
(async()=>{const out={};
 for(const vp of [{width:390,height:844},{width:844,height:390}]){
  const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',vp,{touch:true});
  await page.evaluate(()=>{started=true;document.querySelector('#overlay').style.display='none';reset();const s=slipper.position;pos.set(s.x+.9,0,s.z);yaw=-Math.PI/2;camYaw=yaw});
  await page.waitForTimeout(700);
  const lab=await page.evaluate(()=>[actBtn.textContent,grabBtn.textContent,grabBtn.className]);
  await page.screenshot({path:`tests/shots/ctrl_${vp.width}.png`});
  // two-finger: hold the joystick, tap the grab button
  const cdp=await page.context().newCDPSession(page);
  const st=await page.evaluate(()=>{const r=document.getElementById('stick').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]});
  const gb=await page.evaluate(()=>{const r=grabBtn.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]});
  const P=(x,y,id)=>({x,y,id,radiusX:5,radiusY:5,force:1});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[P(st[0],st[1],1)]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[P(st[0],st[1]-10,1)]});
  const t0=Date.now();
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[P(st[0],st[1]-10,1),P(gb[0],gb[1],2)]});
  const firedAt=await page.evaluate(()=>slipperState);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[P(st[0],st[1]-10,1)]});
  await page.waitForTimeout(400);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const after=await page.evaluate(()=>[slipperState,grabBtn.textContent]);
  out[vp.width]={labels:lab,onTouchDown:firedAt,after,errors};
  await browser.close()}
 console.log(JSON.stringify(out))})();
