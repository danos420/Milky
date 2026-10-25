const {open}=require('./lib');
// A driving bot plays every race mission: follows the racing line (or the mission's targets), drifts in corners,
// uses nitro on straights and the special near rivals. Reports win/fail, time, lap times.
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:390,height:844},{touch:true});const ev=f=>page.evaluate(f);
 const which=(process.argv[3]||'milky,coco,bull,pigeon').split(',');const only=process.argv[4]?process.argv[4].split(',').map(Number):null;
 await ev(()=>{window.RBOT=function(){const me=RS.me,m=RS.m;if(!me||RS.over)return;let tx,tz,lane=0;
   const near=(list)=>{let b=null,bd=1e9;const myU=R_S[me.i];for(const o of list){if(!o.on)continue;const i=rNearest(o.g.position.x,o.g.position.z);let du=R_S[i]-myU;if(du<-R_LEN/2)du+=R_LEN;if(du>R_LEN/2)du-=R_LEN;if(du<2||du>70)continue;if(du<bd){bd=du;b=o}}return b};
   let tgt=null;if(m){if(m.type==='coins')tgt=near(R_COINS);else if(m.type==='crates')tgt=near(R_CRATES);else if(m.type==='rings')tgt=R_RINGS.filter(r=>r.on).sort((a,b)=>a.k-b.k)[0]&&near(R_RINGS.filter(r=>r.on));
    else if(m.type==='chase')tgt={g:VAN.g};else if(m.type==='hits'&&DRIVERS[RS.meId].special!=='seeds'){const r=RS.rivals.filter(K=>K.spinT<=0).sort((a,b)=>Math.hypot(a.x-me.x,a.z-me.z)-Math.hypot(b.x-me.x,b.z-me.z))[0];if(r)tgt={g:r.g}}}
   const look=rAt(R_S[me.i]+10+Math.abs(me.v)*.25,0);tx=look.p.x;tz=look.p.z;
   if(tgt){const p=tgt.g.position;const d=Math.hypot(p.x-me.x,p.z-me.z);if(d<40){const a=rAt(R_S[rNearest(p.x,p.z)],rLat(rNearest(p.x,p.z),p.x,p.z));tx=p.x;tz=p.z}}
   const des=Math.atan2(tx-me.x,tz-me.z);const err=Math.atan2(Math.sin(des-me.h),Math.cos(des-me.h));const st=THREE.MathUtils.clamp(err*2.4,-1,1);
   stick.active=true;stick.mag=1;stick.x=-st/1.3;stick.y=Math.abs(err)>1.2&&me.v>14?.2:1;
   keys.Space=(Math.abs(st)>(m&&m.type==='drift'?.18:.45)&&me.v>11)||(RS.meId==='coco'&&me.y>.3);
   keys.ShiftLeft=me.nitro>.2&&Math.abs(err)<.15;
   if(RS.cool<=0){const close=RS.rivals.some(K=>K!==VAN&&Math.hypot(K.x-me.x,K.z-me.z)<(DRIVERS[RS.meId].special==='bark'?11:4));const sp=DRIVERS[RS.meId].special;
    if((sp==='bark'||sp==='ram')&&close)raceSpecial();else if(sp==='glide'&&m&&(m.type==='airtime'||m.air||m.type==='rings'))raceSpecial();else if(sp==='seeds'&&RS.rivals.some(K=>{let du=K.u-R_S[me.i];if(du>R_LEN/2)du-=R_LEN;if(du<-R_LEN/2)du+=R_LEN;return du<-3&&du>-25}))raceSpecial();else if(sp==='ram'&&m&&m.type==='crates')raceSpecial()}}});
 const res=[];
 for(const id of which){for(let k=0;k<10;k++){if(only&&!only.includes(k))continue;
  await ev(()=>{for(const x of ['epBoard','epEnd','raceHub'])document.getElementById(x).hidden=true});
  await ev(`(()=>{EP.cur=EP.list.race_${id};EP.idx=${k};EP.list.race_${id}.start(${k})})()`);
  let st;const t0=Date.now();for(;;){st=await ev(()=>{for(let f=0;f<60;f++){RBOT();gameStep(1/60);if(RS.over)break}return {over:RS.over,t:RS.t,laps:RS.laps}});if(st.over||st.t>200||Date.now()-t0>240000)break;await page.waitForTimeout(10)}
  await page.waitForTimeout(1700);
  const r=await ev(()=>({card:!document.getElementById('epEnd').hidden,title:document.getElementById('epEndTitle').textContent,t:Math.round(RS.t),best:+(RS.bestLap||0).toFixed(1),place:RS.place,m:RS.m.type+(RS.m.n?':'+RS.m.n:'')+(RS.m.limit?' lim'+RS.m.limit:'')}));
  r.id=id;r.k=k+1;r.res=r.card?(r.title.includes('הצלחה')?'WIN':'FAIL'):'TIMEOUT';res.push(r);console.log(JSON.stringify(r));
  if(r.res!=='WIN')await page.screenshot({path:`tests/shots/race_${id}_${k+1}.png`});
 }}
 await ev(()=>{stick.active=false;keys.Space=false;keys.ShiftLeft=false});
 console.log('SUMMARY',res.filter(r=>r.res==='WIN').length+'/'+res.length);console.log(errors.length?errors.slice(0,5):'no page errors');await browser.close()})();
