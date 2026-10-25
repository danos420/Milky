const {open}=require('./lib');
// An automatic player: follows the guide arrow with the joystick (routing through doors on the nav grid),
// presses whatever context buttons appear, throws/flies/jumps when the mission needs it.
// Reports per mission: win / fail / timeout, and every spot where it got stuck.
(async()=>{
 const {page,browser,errors}=await open(process.argv[2]||'dist/index.html',{width:390,height:844},{touch:true});
 const ev=f=>page.evaluate(f);const which=(process.argv[3]||'dad,parrot,human').split(',');const only=process.argv[4]?process.argv[4].split(',').map(Number):null;
 await ev(()=>{
  window.BOT={};
  BOT.way=function(tx,tz){const inGrid=(x,z)=>x>-19.6&&x<19.6&&z>-39.6&&z<15.6;
   const raw=BOT.way0(tx,tz);if(raw&&(raw[0]!==tx||raw[1]!==tz)&&inGrid(pos.x,pos.z)&&inGrid(raw[0],raw[1])&&!(Math.abs(raw[0]-tx)<.01&&Math.abs(raw[1]-tz)<.01)){return BOT.gridTo(raw[0],raw[1])||raw}return raw};
  BOT.gridTo=function(tx,tz){if(!BOT.path||BOT.repath<=0||Math.hypot(BOT.ptx-tx,BOT.ptz-tz)>.8){BOT.path=findPath(pos.x,pos.z,tx,tz);BOT.repath=.5;BOT.ptx=tx;BOT.ptz=tz}
   while(BOT.path.length&&Math.hypot(BOT.path[0][0]-pos.x,BOT.path[0][1]-pos.z)<.45)BOT.path.shift();return BOT.path.length?BOT.path[0]:null};
  BOT.way0=function(tx,tz){const inGrid=(x,z)=>x>-19.6&&x<19.6&&z>-39.6&&z<15.6;
   const shopZ=z=>z<10?5.1:z<20?12.7:z<30?22.7:32.7;
   if(tx>20.1&&!(pos.x>20.1&&Math.abs(shopZ(pos.z)-shopZ(tz))<.1)){const dz=shopZ(tz);if(pos.x<19)return Math.abs(pos.z-dz)>.6||pos.x<18?[18.6,dz]:[21.4,dz];return [21.4,dz]}
   if(pos.x>20.1&&tx<20){const dz=shopZ(pos.z);return pos.x>20.6?[19.8,dz]:[17.5,dz]}
   if(inGrid(pos.x,pos.z)&&inGrid(tx,tz)){if(!BOT.path||BOT.repath<=0||Math.hypot(BOT.ptx-tx,BOT.ptz-tz)>.8){BOT.path=findPath(pos.x,pos.z,tx,tz);BOT.repath=.5;BOT.ptx=tx;BOT.ptz=tz}
    while(BOT.path.length&&Math.hypot(BOT.path[0][0]-pos.x,BOT.path[0][1]-pos.z)<.45)BOT.path.shift();if(BOT.path.length)return BOT.path[0]}
   if(inGrid(pos.x,pos.z)&&!inGrid(tx,tz)&&tz>15.6&&pos.x<6.6){return [13,14]}
   return [tx,tz]};
  BOT.steer=function(wx,wz,mag){const h=Math.atan2(wx-pos.x,wz-pos.z),a=h-camYaw;stick.active=true;stick.x=-Math.sin(a);stick.y=Math.cos(a);stick.mag=mag};
  BOT.press=function(which,okLabels,bad){const h=which==='act'?actInfo():grabInfo();if(h&&h.on&&(!okLabels||okLabels.some(l=>h.l.includes(l)))&&!(bad&&bad.some(l=>h.l.includes(l)))){h.fn();return h.l}return null};
  BOT.begin=function(){BOT.S={log:{stuck:[],pressed:{}},last:pos.clone(),stillT:0,frames:0,side:0,sideA:0};BOT.repath=0;BOT.path=null};
  BOT.chunk=function(n,maxSec){const S=BOT.S,log=S.log;let last=S.last,stillT=S.stillT,frames=S.frames;const f0=frames;
   const over=()=>(BOT.storyOver&&BOT.storyOver())||(window.DADP&&dm.over)||(window.PARP&&PM.over)||(window.HUMAN&&hs.i<0);
   for(;frames<maxSec*60&&frames<f0+n&&!over();frames++){BOT.repath-=1/60;
    let tg=currentTarget&&currentTarget();if(window.DADP&&dm.m&&dm.m.target)tg=dm.m.target();if(window.PARP&&PM.m&&PM.m.target)tg=PM.m.target();if(window.HUMAN&&hs.i>=0)tg=ERRANDS[hs.i].where();
    const seated=window.DADP&&dSit;let throwing=false;
    if(window.DADP&&NM.g.visible){const d=Math.hypot(NM.g.position.x-pos.x,NM.g.position.z-pos.z);const wantHit=dm.m&&(dm.m.onHit||/כפכף|זרוק/.test(dm.m.hint()));
     if(wantHit&&d<7&&d>(NM.onChair?.5:1.2)&&NM.stun<=0&&(NM.onChair||lineFree(pos.x,pos.z,pos.x+(NM.g.position.x-pos.x)*.7,pos.z+(NM.g.position.z-pos.z)*.7,.1))){yaw=Math.atan2(NM.g.position.x-pos.x,NM.g.position.z-pos.z);throwing=true;if(frames%20===0){const l=BOT.press('act',['לזרוק']);if(l)log.pressed[l]=(log.pressed[l]||0)+1}}}
    if(seated||throwing||!tg){stick.active=false;stick.mag=0}
    else{let [wx,wz]=BOT.way(tg.x,tg.z);const dist=Math.hypot(tg.x-pos.x,tg.z-pos.z);if(S.side>0){S.side-=1/60;wx=pos.x+Math.sin(S.sideA)*3;wz=pos.z+Math.cos(S.sideA)*3}if(dist>.5)BOT.steer(wx,wz,dist>3?1:.55);else{stick.active=false;stick.mag=0}
     if(window.PARP){const want=Math.min(pMax()-.3,dist>3?Math.max(2.8,(tg.y||0)):Math.max(.3,(tg.y||0)-.2));keys.Space=jumpY<want}
     else if((tg.y||0)>.5&&jumpY+.3<(tg.y||0)&&dist<1.6&&grounded&&frames%30===0){keys.Space=true}else keys.Space=false}
    if(frames%12===0){const l=BOT.press('act',null,(BOT.actBad||['לזרוק כפכף','לצרוח','קרא לאבא','לשון','לגעת','לבקש']).concat(!(window.DADP&&dm.m&&dm.m.t.includes('הכלב הכי טוב'))?['ליטוף','מקרר','נביחה','שלט','צפצף','הפוך פח','פזר','העף']:[]));if(l)log.pressed[l]=(log.pressed[l]||0)+1;
     const nearChair=tg&&Math.hypot(tg.x-ARMCHAIR.x,tg.z-ARMCHAIR.z)<1.3;const catchOk=!window.DADP||(dm.m&&(dm.m.onCatch||/תפוס/.test(dm.m.hint())));const g=BOT.grabAll?BOT.press('grab',null,['שחרר']):BOT.press('grab',(nearChair?['לשבת']:[]).concat(catchOk?['לתפוס!','לחטוף','לתת']:['לחטוף','לתת']));if(g)log.pressed[g]=(log.pressed[g]||0)+1}
    gameStep(1/60);if(window.BOT_TRACE&&frames%60===0)BOT_TRACE.push([+pos.x.toFixed(1),+pos.z.toFixed(1),+jumpY.toFixed(1)]);
    if(frames%60===0){const mv=pos.distanceTo(last);last.copy(pos);const far=tg&&Math.hypot(tg.x-pos.x,tg.z-pos.z)>1.6;
     if(mv<.25&&far&&!seated&&!throwing){stillT++;if(stillT===2){S.side=1.1;S.sideA=Math.atan2(tg.x-pos.x,tg.z-pos.z)+(Math.random()<.5?1.6:-1.6)}if(stillT===6)log.stuck.push({at:[+pos.x.toFixed(1),+pos.z.toFixed(1)],tg:[+tg.x.toFixed(1),+tg.z.toFixed(1)],hint:nextTaskHint().slice(0,50)})}else stillT=0}}
   S.last=last;S.stillT=stillT;S.frames=frames;stick.active=false;keys.Space=false;log.sec=Math.round(frames/60);log.done=over()||frames>=maxSec*60;return log};
 });
 const res=[];
 const EPS={dad:{n:10,start:i=>`EP.cur=EP.list.dad;EP.idx=${i};dadMissionStart(${i})`,state:()=>({over:dm.over,win:dm.win})},
  parrot:{n:10,start:i=>`EP.cur=EP.list.parrot;EP.idx=${i};parrotMissionStart(${i})`},
  human:{n:10,start:i=>`EP.cur=EP.list.human;EP.idx=${i};EP.list.human.start(${i})`}};
 for(const w of which){const E=EPS[w];for(let i=0;i<E.n;i++){if(only&&!only.includes(i))continue;
  await ev(()=>{for(const id of ['epBoard','epEnd','dEnd','hEnd'])document.getElementById(id).hidden=true});
  await ev(`(()=>{${E.start(i)}})()`);await page.waitForTimeout(250);
  await ev(()=>{BOT.begin();window.BOT_TRACE=[]});let log;for(;;){log=await ev(()=>BOT.chunk(30,150));if(log.done)break;await page.waitForTimeout(25)}await page.waitForTimeout(2600);
  const end=await ev(()=>({card:!document.getElementById('epEnd').hidden,title:document.getElementById('epEndTitle').textContent}));
  const r={ep:w,i:i+1,sec:log.sec,result:end.card?(end.title.includes('הצלחה')||end.title.includes('בוצע')?'WIN':'FAIL'):'TIMEOUT',title:end.title.slice(0,40),stuck:log.stuck.slice(0,4),pressed:log.pressed};
  if(process.env.TRACE)r.trace=await ev(()=>BOT_TRACE.filter((p,i)=>i%3===0));res.push(r);console.log(JSON.stringify(r));
  if(r.result!=="WIN"||process.env.SHOTS)await page.screenshot({path:`tests/shots/auto_${w}_${i+1}.png`});
 }}
 const n=res.length,wins=res.filter(r=>r.result==='WIN').length;console.log('SUMMARY',wins+'/'+n,'won; stuck spots:',res.reduce((a,r)=>a+r.stuck.length,0));
 console.log(errors.length?errors.slice(0,6):'no page errors');await browser.close()})();
