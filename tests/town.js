const {open}=require('./lib');
// The neighbourhood: walking there with the joystick, every area's side missions, the kart, the map, streaming and the water.
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:390,height:844},{touch:true});const ev=f=>page.evaluate(f);const out={};
 await ev(()=>{localStorage.clear();document.getElementById('startOpen').click()});await page.waitForTimeout(300);
 // walk from the street to the beach (joystick only)
 out.walk=await ev(()=>{pos.set(13,0,40);yaw=0;camYaw=0;const zones=new Set();for(let s=0;s<40;s++){stick.active=true;stick.x=0;stick.y=1;stick.mag=1;keys.ShiftLeft=true;for(let k=0;k<60;k++)gameStep(1/60);zones.add(TOWN.zone);if(pos.z>200)break}stick.active=false;keys.ShiftLeft=false;
  return {z:+pos.z.toFixed(1),zones:[...zones],water:inPool||townWater(pos.x,pos.z),visited:save.town.visited.slice()}});
 // streaming: only nearby areas are drawn
 out.stream=await ev(()=>{const r={};for(const [n,x,z] of [['home',0,0],['school',-10,85],['beach',13,190],['forest',60,100]]){pos.set(x,0,z);gameStep(1/60);r[n]=Object.entries(ZG).filter(([k,g])=>g.visible).map(([k])=>k).join('+')}return r});
 // side missions
 const act=`(()=>{ctxT=0;const h=actInfo();if(h&&h.on)h.fn();return h&&h.l})()`;
 const ch={};
 ch.bell=await ev(()=>{pos.set(-25,0,85);gameStep(1/60);ctxT=0;const h=actInfo();h.fn();return challengesDone.has('schoolBell')});
 ch.goal=await ev(()=>{const B=SCH.ball;B.g.position.set(-12,.3,64);B.v.set(0,0,0);pos.set(-12,0,66);yaw=Math.PI;lastDogSpeed=5;for(let k=0;k<90;k++){if(k<20)pos.set(B.g.position.x,0,B.g.position.z+.6);gameStep(1/60)}return challengesDone.has('schoolGoal')});
 ch.homework=await ev(()=>{const n=SCH.notebook.position;pos.set(n.x+.8,0,n.z);gameStep(1/60);ctxT=0;actInfo().fn();const t=SCH.teacher.g.position;pos.set(t.x+1.2,0,t.z);gameStep(1/60);ctxT=0;const h=actInfo();h.fn();return challengesDone.has('schoolHomework')});
 ch.kids=await ev(()=>{SCH.recess=0;let n=0;for(const k of SCH.kids){const o=k.P.g.position;pos.set(o.x+1,0,o.z);ctxT=0;const h=actInfo();if(h&&h.l.includes('כיף')){h.fn();n++}}return challengesDone.has('schoolKids')});
 ch.stones=await ev(()=>{for(const s of FOR.stones){pos.set(s.x,0,s.z);jumpY=.4;grounded=true;gameStep(1/60)}return challengesDone.has('forestStones')});
 ch.squirrel=await ev(()=>{const S=FOR.squirrel;S.state='ground';const o=S.g.position;pos.set(o.x+.3,0,o.z);jumpY=0;gameStep(1/60);return challengesDone.has('forestSquirrel')});
 ch.marsh=await ev(()=>{const m=FOR.marshG.position;pos.set(m.x+.8,0,m.z+.6);jumpY=0;gameStep(1/60);ctxT=0;const h=actInfo();if(h)h.fn();return challengesDone.has('forestMarsh')});
 ch.frogs=await ev(()=>{for(const f of FOR.frogs){const o=f.g.position;pos.set(o.x+1,0,o.z);gameStep(1/60)}return challengesDone.has('forestFrogs')});
 ch.deer=await ev(()=>{const D=FOR.deer;D.state='graze';const o=D.g.position;pos.set(o.x+8,0,o.z);lastDogSpeed=1;for(let k=0;k<60;k++){pos.x-=.1;curSpeed=1;gameStep(1/60)}return challengesDone.has('forestDeer')});
 ch.castle=await ev(()=>{const c=BCH.castle.position;BCH.castleUp=true;pos.set(c.x+1,0,c.z);yaw=-Math.PI/2;stick.active=true;stick.x=0;stick.y=1;stick.mag=1;camYaw=yaw;for(let k=0;k<40;k++)gameStep(1/60);stick.active=false;return challengesDone.has('beachCastle')});
 ch.buoy=await ev(()=>{pos.set(BCH.buoy.x+1,0,BCH.buoy.z);gameStep(1/60);return challengesDone.has('beachBuoy')});
 ch.crab=await ev(()=>{const o=BCH.crab.g.position;pos.set(o.x+.3,0,o.z);jumpY=0;gameStep(1/60);return challengesDone.has('beachCrab')});
 ch.dig=await ev(()=>{pos.set(BCH.dig.x+.8,0,BCH.dig.z);for(let i=0;i<4;i++){gameStep(1/60);ctxT=0;const h=actInfo();if(h&&h.l.includes('לחפור'))h.fn()}return challengesDone.has('beachDig')});
 ch.ice=await ev(()=>{pos.set(BCH.stall.x,0,BCH.stall.z+1.8);gameStep(1/60);ctxT=0;actInfo().fn();const got=BCH.ice;pos.set(10,0,190);stick.active=true;stick.mag=1;keys.ShiftLeft=true;for(let k=0;k<60*10;k++){stick.x=Math.sin(k/40);stick.y=Math.cos(k/40);gameStep(1/60)}stick.active=false;keys.ShiftLeft=false;return got&&challengesDone.has('beachIce')});
 out.challenges=ch;
 // kart: summon on the road, drive south, exit
 out.kart=await ev(()=>{pos.set(13,0,60);yaw=0;camYaw=0;gameStep(1/60);carChip.click();const on=DRIVE.on;const z0=DRIVE.K.z;stick.active=true;stick.x=0;stick.y=1;stick.mag=1;for(let k=0;k<180;k++)gameStep(1/60);stick.active=false;const z1=DRIVE.K.z;
  // try to drive into the house: not allowed
  const inHouse=driveOK(0,0);carChip.click();return {on,moved:+(z1-z0).toFixed(1),off:!DRIVE.on,dog:dog.visible,houseOk:inHouse,walkAfter:walkable(pos.x,pos.z,.4)}});
 out.map=await ev(()=>{openMap();const b=[...document.querySelectorAll('#tmTravel button')].filter(b=>!b.disabled).map(b=>b.textContent);const beachBtn=[...document.querySelectorAll('#tmTravel button')].find(b=>b.textContent.includes('החוף'));if(beachBtn&&!beachBtn.disabled)beachBtn.click();return {open:true,travel:b.length,at:[+pos.x.toFixed(0),+pos.z.toFixed(0)],closed:document.getElementById('townMap').hidden}});
 await page.waitForTimeout(500);await page.screenshot({path:'tests/shots/town_beach.png'});
 out.persist=await ev(()=>{writeSave();return JSON.parse(localStorage.getItem('milky-bardak-save-v1')).town});
 const bad=Object.entries(ch).filter(([k,v])=>!v).map(([k])=>k);
 console.log(JSON.stringify(out));console.log(bad.length?'FAIL challenges: '+bad.join(','):'PASS all 14 town side missions');
 console.log(errors.length?errors.slice(0,5):'no page errors');await browser.close()})();
