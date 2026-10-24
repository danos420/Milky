// ===== A day in Milky's life: morning → noon → evening, then a summary with stars =====
const DAY=[
 {name:'בוקר',icon:'☀️',banner:'☀️ בוקר טוב! אבא עוד חצי ישן',tasks:[
  {id:'snack',label:'🍪 לגנוב את החטיף מהשולחן',tip:'קפוץ על השולחן ולחץ חטיף'},
  {id:'mug',label:'☕ להפיל את הכוס של אבא',tip:'נחיתה על שולחן הסלון עושה את העבודה'},
  {id:'remote',label:'📺 להדליק לאבא את הטלוויזיה',tip:'השלט על הרצפה ליד השולחן'},
  {id:'bowl',label:'🥣 ארוחת בוקר מהקערה',tip:'הקערה במטבח, ליד הפתח'}]},
 {name:'צהריים',icon:'🌤️',banner:'🌤️ צהריים! כולם בבית, זמן לבלגן',tasks:[
  {id:'slipper',label:'🩴 להחביא את הכפכף של אבא במיטה',tip:'תפוס עם P, רוץ למיטה ליד המרפסת'},
  {id:'sausage',label:'🌭 לגנוב נקניקייה מהמקרר',tip:'פתח את המקרר עם E'},
  {id:'trash',label:'🗑️ להפוך את הפח במטבח',tip:'רוץ לתוכו או לחץ E'},
  {id:'armchair',label:'🛋️ לתפוס לאבא את הכורסה',tip:'קפוץ על הכורסה מול הטלוויזיה'}]},
 {name:'ערב',icon:'🌇',banner:'🌇 ערב בחצר: השכן מדליק מנגל',tasks:[
  {id:'kebab',label:'🍢 לגנוב קבב ולשרוד 7 שניות',tip:'המנגל בסוף החצר. ברח לגג המחסן'},
  {id:'cat',label:'🐈 לגעת בחתול',tip:'תפוס אותו כשהוא קופץ בין גדרות'},
  {id:'wet',label:'💦 להירטב',tip:'בריכה, או לרוץ ליד הפרחים של השכנה'},
  {id:'shed',label:'🏚️ לעלות על גג המחסן',tip:'הטרמפולינה עוזרת'}]}
];
const LIGHT=[
 {sky:0xa9c4d3,hemi:0xffe4c2,ground:0x51433d,sun:0xfff0d8,sunI:1.15,k:1.0},
 {sky:0x98c9ea,hemi:0xfff2dc,ground:0x5a4a3d,sun:0xffffff,sunI:1.35,k:1.08},
 {sky:0xe79d78,hemi:0xffb98a,ground:0x3c2f3c,sun:0xff9a55,sunI:1.0,k:.88},
 {sky:0x2c3858,hemi:0x8fa4d8,ground:0x1e2030,sun:0x9fb0ff,sunI:.45,k:.62}];
const day={phase:0,done:new Set(),t:0,finished:false,light:0,lightK:1};
const dayChip=document.getElementById('dayChip'),dayPanel=document.getElementById('dayPanel'),dayList=document.getElementById('dayList'),dayBanner=document.getElementById('dayBanner');
const _c1=new THREE.Color(),_c2=new THREE.Color();
function fmtTime(sec){sec=Math.floor(sec);return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}
function phaseDone(i){return DAY[i].tasks.every(t=>day.done.has(t.id))}
function renderDay(){
 const ph=DAY[Math.min(day.phase,2)],n=ph.tasks.filter(t=>day.done.has(t.id)).length;
 dayChip.textContent=(typeof OPEN_WORLD!=='undefined'&&OPEN_WORLD)?'🌍 '+challengesDone.size+'/'+challengeDefs.length:day.finished?'🌙 סוף היום':((window.WEEK_READY&&weekIcon())||ph.icon)+' '+ph.name+' '+n+'/4';
 dayList.innerHTML='';
 DAY.forEach((p,i)=>{const h=document.createElement('h3');h.textContent=p.icon+' '+p.name+(i<day.phase||day.finished?' ✓':i===day.phase?' · עכשיו':'');if(i>day.phase&&!day.finished)h.className='later';dayList.appendChild(h);
  if(i>day.phase&&!day.finished)return;
  for(const t of p.tasks){const d=document.createElement('div');d.className='task'+(day.done.has(t.id)?' done':'');d.innerHTML='';const a=document.createElement('span');a.textContent=(day.done.has(t.id)?'✅ ':'⬜ ')+t.label;d.appendChild(a);
   if(!day.done.has(t.id)&&i===day.phase){const tip=document.createElement('small');tip.textContent='טיפ: '+t.tip;d.appendChild(tip)}dayList.appendChild(d)}});
 document.getElementById('dayTimer').textContent='⏱️ '+fmtTime(day.t);
}
let bannerTimer=0;function showBanner(text){dayBanner.textContent=text;dayBanner.classList.remove('show');void dayBanner.offsetWidth;dayBanner.classList.add('show');clearTimeout(bannerTimer);bannerTimer=setTimeout(()=>dayBanner.classList.remove('show'),3100)}
function dayEvent(id){
 if(day.finished||day.done.has(id))return;
 const task=DAY.flatMap(p=>p.tasks).find(t=>t.id===id);if(!task)return;
 day.done.add(id);addScore(300,'משימה: '+task.label);
 SFX.fanfare(false);
 renderDay();
 if(phaseDone(day.phase))setTimeout(advancePhase,1400);
}
function advancePhase(){
 if(day.finished||!phaseDone(day.phase))return;
 addScore(500,DAY[day.phase].name+' הושלם!');
 while(day.phase<3&&phaseDone(day.phase))day.phase++;
 if(day.phase>=3){finishDay();return}
 day.light=day.phase;showBanner(DAY[day.phase].banner);if(window.WEEK_READY)weekPhaseStart(day.phase);thought(milkyB,DAY[day.phase].icon,2,true);
 SFX.fanfare(true);renderDay();
}
function finishDay(){
 day.finished=true;day.light=3;renderDay();showBanner('🌙 לילה. מילקי עשה את זה!');
 const stars=1+(score>=5000?1:0)+(score>=10000?1:0),time=day.t;
 const prev=save.day||{completed:0,bestStars:0,bestTime:0,bestScore:0};
 const rec={completed:(+prev.completed||0)+1,bestStars:Math.max(+prev.bestStars||0,stars),bestTime:+prev.bestTime?Math.min(prev.bestTime,time):time,bestScore:Math.max(+prev.bestScore||0,score)};
 save.day=rec;if(window.WEEK_READY)weekFinished(stars);recordProgress();
 setTimeout(()=>{
  const el=document.getElementById('dayEnd');
  document.getElementById('dayStars').innerHTML=[0,1,2].map(i=>'<span class="'+(i<stars?'on':'off')+'" style="animation-delay:'+(i*.35)+'s">⭐</span>').join('');
  document.getElementById('dayStats').innerHTML='';
  for(const [k,v] of [['⏱️ זמן',fmtTime(time)],['⭐ ניקוד',score.toLocaleString('he-IL')],['🦴 עצמות זהב',bonesFound+'/'+bones.length],['🏅 שיא כוכבים',rec.bestStars+'/3'],['⚡ הזמן הכי מהיר',fmtTime(rec.bestTime)],['📅 ימים שהושלמו',rec.completed]]){const r=document.createElement('div');const a=document.createElement('span');a.textContent=k;const b=document.createElement('b');b.textContent=v;r.append(a,b);document.getElementById('dayStats').appendChild(r)}
  document.getElementById('dayNext').textContent=stars<3?(stars===1?'לשני כוכבים: 5,000 נקודות ביום אחד. סלטות ועצמות זהב שוות הרבה.':'לשלושה כוכבים: 10,000 נקודות ביום אחד.'):'יום מושלם. מילקי האגדי 🏆';
  el.hidden=false;SFX.fanfare(true);setTimeout(()=>SFX.bark(1,1,3),700);
 },1800);
}
function updateDay(dt){
 if(!day.finished)day.t+=dt;
 if(Math.floor(day.t)!==Math.floor(day.t-dt)&&!dayPanel.hidden)document.getElementById('dayTimer').textContent='⏱️ '+fmtTime(day.t);
 if(grounded&&jumpY>2.5&&insidePlatform(obstacles.find(o=>o.name==='מחסן'),pos.x,pos.z,0))dayEvent('shed');
 // time-of-day lighting, eased
 const L=LIGHT[day.light],k=Math.min(1,dt*.8);
 scene.background.lerp(_c1.setHex(L.sky),k);scene.fog.color.copy(scene.background);
 const warm=tier==='high'?0:1; // phones get a warmer grade (their lighting model looks whiter)
 ambient.color.lerp(_c1.setHex(L.hemi).lerp(_c2.setHex(0xffc890),.3*warm),k);ambient.groundColor.lerp(_c2.setHex(L.ground),k);
 sun.color.lerp(_c1.setHex(L.sun).lerp(_c2.setHex(0xffd2a0),.25*warm),k);sun.intensity+=(L.sunI*(warm?.95:1)-sun.intensity)*k;
 day.lightK+=(L.k-day.lightK)*k;ambient.intensity=(tier==='high'?.54:tier==='medium'?.62:.66)*day.lightK;
}
function nextTaskHint(){if(day.finished)return '🌙 היום נגמר. להמשיך להשתולל או יום חדש';const p=DAY[day.phase];const t=p.tasks.find(t=>!day.done.has(t.id));return t?'👉 '+(t.tip||t.label):'🐽 התקרב לחפץ כדי לשחק'}
function resetDay(){if(window.WEEK_READY)loadWeekPhases();if(window.EVENTS_READY)resetEvents();clearTimeout(bannerTimer);dayBanner.classList.remove('show');day.phase=0;day.done.clear();day.t=0;day.finished=false;day.light=0;{const L=LIGHT[0];scene.background.setHex(L.sky);scene.fog.color.setHex(L.sky);ambient.color.setHex(L.hemi);ambient.groundColor.setHex(L.ground);sun.color.setHex(L.sun);sun.intensity=L.sunI;day.lightK=L.k}document.getElementById('dayEnd').hidden=true;renderDay();if(window.WEEK_READY)weekPhaseStart(0,true);if(window.OW_READY&&OPEN_WORLD)owApply()}
dayChip.addEventListener('click',()=>{const open=dayPanel.hidden;if(open){if(!activityDrawer.hidden)activityToggle.click();if(!challengePanel.hidden)challengeToggle.onclick()}dayPanel.hidden=!open;dayChip.classList.toggle('active',open);renderDay()});
document.getElementById('dayNew').addEventListener('click',()=>{reset()});
document.getElementById('dayKeep').addEventListener('click',()=>{document.getElementById('dayEnd').hidden=true});
const milkyB=makeBubble(headPivot,.62),dadB=makeBubble(dad,3.15),daniB=makeBubble(dani,2.95),nbB=makeBubble(neighbor.g,3.1),ladyB=makeBubble(lady.g,3.1),catB=makeBubble(cat,1.0);
let lastFootPhase=0,camYaw=Math.PI,curSpeed=0,yawVel=0,runBlend=0;
const stick={active:false,x:0,y:0,mag:0,id:null};
let pos=new THREE.Vector3(0,0,5.6),yaw=Math.PI,velocityY=0,jumpY=0,won=false,started=false,steps=0;dog.position.copy(pos);dog.rotation.y=yaw;const keys={};const setKey=(k,v)=>{const was=keys[k];keys[k]=v;if(k==='KeyE'&&v&&!was)smartAction()};window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();setKey(e.code,true)});window.addEventListener('keyup',e=>setKey(e.code,false));window.addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;
if(IS_TOUCH&&k==='ShiftLeft'){b.addEventListener('pointerdown',e=>{e.preventDefault();const on=!keys.ShiftLeft;setKey(k,on);b.classList.toggle('on',on);b.querySelector('small').textContent=on?'רץ!':'ריצה'});b.addEventListener('contextmenu',e=>e.preventDefault());window.addEventListener('blur',()=>{b.classList.remove('on');b.querySelector('small').textContent='ריצה'});return}
const down=e=>{e.preventDefault();b.classList.add('down');setKey(k,true)};const up=e=>{b.classList.remove('down');setKey(k,false)};b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up);b.addEventListener('contextmenu',e=>e.preventDefault())});
