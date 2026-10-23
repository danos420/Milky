const {open}=require('./lib');
(async()=>{
 const vps=[[1280,720,0],[1024,768,1],[390,844,1],[360,740,1],[844,390,1],[667,375,1],[568,320,1]];
 for(const [w,h,touch] of vps){
  const {browser,page,errors}=await open(process.argv[2],{width:w,height:h},{touch:!!touch});
  await page.evaluate(()=>document.querySelector('#start').click());
  const res=await page.evaluate(async()=>{
   const out=[];
   for(const drawers of [false,'a','c']){
    if(drawers==='a')document.getElementById('activityToggle').click();if(drawers==='c')document.getElementById('challengeToggle').click();
    await new Promise(r=>setTimeout(r,50));
    const els=[...document.querySelectorAll('#uiTop button,#uiTop .chip,#controls button,#stick,#activityDrawer:not([hidden]),#challengePanel:not([hidden]),#contextHint')].filter(e=>getComputedStyle(e).visibility!=='hidden'&&e.getBoundingClientRect().width>0&&!(e.closest('aside')&&e.tagName!=='ASIDE'));
    const R=els.map(e=>[e,e.getBoundingClientRect()]);
    for(const [e,r] of R){ if(r.left<-1||r.top<-1||r.right>innerWidth+1||r.bottom>innerHeight+1)out.push('OFFSCREEN '+(e.id||e.textContent.trim().slice(0,8)));}
    for(let i=0;i<R.length;i++)for(let j=i+1;j<R.length;j++){const a=R[i][1],b=R[j][1];if(R[i][0].contains(R[j][0])||R[j][0].contains(R[i][0]))continue;
      const ix=Math.min(a.right,b.right)-Math.max(a.left,b.left),iy=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
      if(ix>1&&iy>1)out.push('OVERLAP '+(R[i][0].id||R[i][0].textContent.trim().slice(0,8))+' x '+(R[j][0].id||R[j][0].textContent.trim().slice(0,8)));}
    const top=Math.max(...R.filter(([e])=>e.closest('#uiTop')).map(([,r])=>r.bottom));
    const bot=Math.min(...R.filter(([e])=>e.closest('#controls')).map(([,r])=>r.top));
    out.push((drawers?'drawer '+drawers+' open (a='+!document.getElementById('activityDrawer').hidden+',c='+!document.getElementById('challengePanel').hidden+')':'closed')+': clear middle band '+Math.round(bot-top)+'px of '+innerHeight);
   }
   return out});
  console.log(w+'x'+h, res.join(' | '), errors.length?errors:'');
  if(w===568||w===360){await page.evaluate(()=>document.getElementById('challengeToggle').click());await page.screenshot({path:`shots/v3-${w}x${h}.png`})}
  await browser.close();
 }
})();
