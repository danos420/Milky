const {open}=require('./lib');
(async()=>{const R=[];const check=(n,ok,info)=>R.push((ok?'PASS ':'FAIL ')+n+(info!==undefined?'  — '+info:''));
 let {browser,page,errors}=await open(process.argv[2],{width:844,height:390},{touch:true,noRaf:true});
 let r=await page.evaluate(()=>{document.querySelector('#start').click();return {hud:getComputedStyle(document.getElementById('hud')).display,reset:!!document.getElementById('resetChip')}});
 check('mission panel removed, restart button in the top bar',r.hud==='none'&&r.reset,JSON.stringify(r));
 r=await page.evaluate(()=>{const h=document.getElementById('contextHint').getBoundingClientRect();return {top:Math.round(h.top),bottom:Math.round(h.bottom),H:innerHeight}});
 check('landscape: object hint sits at the top edge, not mid-screen',r.bottom<110,JSON.stringify(r));
 r=await page.evaluate(()=>{reset();const b=document.querySelector('[data-key="ShiftLeft"]');b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:3}));b.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:3}));const on=keys.ShiftLeft&&b.classList.contains('on');stick.active=true;stick.x=0;stick.y=1;stick.mag=1;for(let i=0;i<40;i++)gameStep(1/30);const sp=lastDogSpeed;b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:4}));for(let i=0;i<40;i++)gameStep(1/30);const sp2=lastDogSpeed;stick.active=false;return {on,sp,off:!keys.ShiftLeft,sp2}});
 check('run button toggles sprint on and off',r.on&&r.sp>5&&r.off&&r.sp2<3.1,JSON.stringify(r));
 r=await page.evaluate(()=>{reset();pos.set(0,0,-3);jumpY=0;grounded=true;keys.Space=true;gameStep(1/30);keys.Space=false;let pressed=false,dz=false,maxT=0;
   for(let i=0;i<150;i++){if(!pressed&&jumpY>.6){keys.Space=true;pressed=true}else keys.Space=false;gameStep(1/30);if(dizzy.active){dz=true;maxT=Math.max(maxT,dizzy.t)}}
   return {flipLanded:dz,dizzyLasted:+maxT.toFixed(2),ragdoll:rag.active,score}});
 check('double jump = flip, then a ~2s dizzy landing',r.flipLanded&&r.dizzyLasted>1.8,JSON.stringify(r));
 console.log(R.join('\n'));console.log(errors.length?errors:'no page errors');
 await page.evaluate(()=>{reset();pos.set(0,0,-3);yaw=Math.PI;startDizzy(1);for(let i=0;i<12;i++)gameStep(1/30);for(let i=0;i<30;i++)renderFrame()});await page.screenshot({path:'shots/dizzy.png'});
 await browser.close()})();
