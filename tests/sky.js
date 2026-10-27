// Day/night and weather in the open world.
const {open}=require('./lib');
(async()=>{const {page,browser,errors}=await open(process.argv[2],{width:800,height:600},{noRaf:true});const ev=(f,a)=>page.evaluate(f,a);let fails=0;
const ok=(n,c,i)=>{console.log((c?'PASS ':'FAIL ')+n+(i!==undefined?'  — '+JSON.stringify(i):''));if(!c)fails++};
await ev(()=>{document.getElementById('startOpen').click();document.querySelector('#overlay').style.display='none'});
const run=(n)=>ev(n=>{for(let i=0;i<n;i++)gameStep(1/60)},n);
const at=async(f,w)=>{await ev(([f,w])=>{NBH.t=f*600;setWeather(w,true)},[f,w]);await run(400)};
await at(.3,'clear');const noon=await ev(()=>({amb:ambient.intensity,chip:skyChip.textContent,glow:glowList.map(o=>o.material.emissiveIntensity),light:day.light}));
await at(.9,'clear');const night=await ev(()=>({amb:ambient.intensity,chip:skyChip.textContent,glow:glowList.map(o=>o.material.emissiveIntensity),stars:starsG.material.opacity,win:winList.map(o=>o.material.color.getHexString())}));
ok('night is darker than noon',night.amb<noon.amb*.7,[noon.amb.toFixed(2),night.amb.toFixed(2)]);
ok('lamps glow at night only',noon.glow.every(g=>g<.05)&&night.glow.every(g=>g>.8),[noon.glow,night.glow]);
ok('stars out at night',night.stars>.5,night.stars);ok('windows warm at night',night.win.every(h=>h!=='9fd3e8'),night.win);
ok('clock follows the day',/1[2-3]:/.test(noon.chip)&&/(23|00|01|02):/.test(night.chip),[noon.chip,night.chip]);
// rain outdoors, not indoors; puddles fill; umbrellas; rainbow after
await ev(()=>{pos.set(13,0,156)});await at(.35,'rain');await run(400);
const rain=await ev(()=>({rain:rainL.visible,wet:+SKY.wet.toFixed(2),pud:PUDDLES.filter(p=>p.m.visible).length,umb:umbrellas.filter(u=>u.visible).length}));
ok('rain falls outside',rain.rain,rain);ok('puddles fill up',rain.wet>.3&&rain.pud>=2,rain);ok('neighbours open umbrellas',rain.umb>=4,rain);
const inside=await ev(()=>{pos.set(0,0,3);for(let i=0;i<5;i++)gameStep(1/60);return rainL.visible});ok('no rain inside the house',!inside);
await ev(()=>{pos.set(13,0,150);SKY.wT=0;window.__r=Math.random;Math.random=()=>0});await run(3);
const after=await ev(()=>({w:SKY.w,rb:SKY.rainbow>0}));ok('a rainbow after the rain',after.w==='clear'&&after.rb,after);
await ev(()=>{Math.random=window.__r});
// other modes keep their own look
const z=await ev(()=>{epBoard('zombie');document.getElementById('epBoard').hidden=true;EP.cur.start(0);for(let i=0;i<30;i++)gameStep(1/60);return {light:day.light,sky:SKY_L,chip:skyChip.style.display,rain:rainL.visible,stars:starsG.visible}});
ok('zombies keep their own night',z.light!==z.sky&&z.chip==='none'&&!z.stars,z);
const story=await ev(()=>{setZombie(false);document.getElementById('start').click();document.querySelector('#overlay').style.display='none';for(let i=0;i<30;i++)gameStep(1/60);return {light:day.light,sky:SKY_L,chip:skyChip.style.display}});
ok('story mode untouched',story.light!==story.sky&&story.chip==='none',story);
console.log(fails?'FAIL sky '+fails:'PASS sky');console.log(errors.length?errors:'no page errors');await browser.close()})();
