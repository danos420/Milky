// ===== Saved progress (in this browser): challenges, golden bones, best score =====
const SAVE_KEY='milky-bardak-save-v1';
let save={challenges:[],bones:[],best:0};
function starN(v){return Math.max(0,Math.min(3,Math.round(+v||0)))}
function numMap(o,lo,hi){const r={};if(o&&typeof o==='object')for(const [k,v] of Object.entries(o))if(/^[a-z0-9_]{1,24}$/i.test(k))r[k]=Math.max(lo,Math.min(hi,Math.round(+v||0)));return r}
function starMap(o){const r={};if(o&&typeof o==='object')for(const [k,v] of Object.entries(o))if(/^[a-z0-9_]{1,24}$/i.test(k))r[k]=starN(v);return r}
try{const raw=localStorage.getItem(SAVE_KEY);if(raw){const d=JSON.parse(raw);if(d&&typeof d==='object')save={challenges:Array.isArray(d.challenges)?d.challenges.filter(x=>typeof x==='string'):[],bones:Array.isArray(d.bones)?d.bones.filter(Number.isInteger):[],best:Math.max(0,+d.best||0),day:d.day&&typeof d.day==='object'?{completed:+d.day.completed||0,bestStars:+d.day.bestStars||0,bestTime:+d.day.bestTime||0,bestScore:+d.day.bestScore||0}:undefined,mods:d.mods&&typeof d.mods==='object'?{on:Array.isArray(d.mods.on)?d.mods.on.filter(x=>typeof x==='string'):[],wear:Array.isArray(d.mods.wear)?d.mods.wear.filter(x=>typeof x==='string'):[],seen:Array.isArray(d.mods.seen)?d.mods.seen.filter(x=>typeof x==='string'):[]}:undefined,
  // later systems: story week, detective cases, episodes (stars are always 0..3)
  week:d.week&&typeof d.week==='object'?{cur:Math.max(0,Math.floor(+d.week.cur||0)),stars:Array.isArray(d.week.stars)?d.week.stars.map(v=>v==null?null:starN(v)):[]}:undefined,
  det:d.det&&typeof d.det==='object'?{stars:starMap(d.det.stars)}:undefined,
  town:d.town&&typeof d.town==='object'?{visited:Array.isArray(d.town.visited)?d.town.visited.filter(x=>typeof x==='string'&&x.length<20).slice(0,20):['home'],friends:numMap(d.town.friends,-5,10),done:numMap(d.town.done,0,999)}:undefined,
  coins:Math.max(0,Math.min(99999,Math.floor(+d.coins||0))),shop:{owned:d.shop&&Array.isArray(d.shop.owned)?d.shop.owned.filter(x=>typeof x==='string'&&x.length<20).slice(0,40):[]},
  ep:d.ep&&typeof d.ep==='object'?Object.fromEntries(Object.entries(d.ep).filter(([k,v])=>/^[a-z0-9_]{1,24}$/i.test(k)&&v&&typeof v==='object').map(([k,v])=>[k,starMap(v)])):undefined}}}catch(_){}
const bestAtStart=save.best;let bestAnnounced=false;
function writeSave(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save))}catch(_){}}
function updateBestLine(){document.getElementById('bestLine').textContent='שיא ניקוד: '+save.best.toLocaleString('he-IL')}
function recordProgress(){
 for(const id of challengesDone)if(!save.challenges.includes(id))save.challenges.push(id);
 if(typeof bones!=='undefined')bones.forEach((b,i)=>{if(b.taken&&!save.bones.includes(i))save.bones.push(i)});
 if(typeof score!=='undefined'&&score>save.best){save.best=score;if(!bestAnnounced&&bestAtStart>0){bestAnnounced=true;addActivity('🏅 שיא ניקוד חדש!');milkyThought('🏅',2,true)}}
 writeSave();updateBestLine();if(window.MODES_READY)checkUnlocks();
}
function applySave(){
 for(const id of save.challenges)if(challengeDefs.some(c=>c[0]===id))challengesDone.add(id);renderChallenges();
 for(const i of save.bones){const b=bones[i];if(b&&!b.taken){b.taken=true;b.g.visible=false;bonesFound++}}
 boneChip.textContent='🦴 '+bonesFound+'/'+bones.length;updateBestLine();
}
{const wipe=document.getElementById('wipeSave');let armed=0;
 wipe.addEventListener('click',()=>{
  if(!armed){armed=setTimeout(()=>{armed=0;wipe.textContent='🗑️ מחק התקדמות'},3000);wipe.textContent='בטוח? לחץ שוב כדי למחוק';return}
  clearTimeout(armed);armed=0;save={challenges:[],bones:[],best:0,mods:{on:[],wear:[],seen:[]}};writeSave();challengesDone.clear();reset();applyModes();unlockKnown=null;checkUnlocks();wipe.textContent='🗑️ ההתקדמות נמחקה';setTimeout(()=>wipe.textContent='🗑️ מחק התקדמות',2000);
 });}
// Performance meter: frames per second, time our code takes per frame, worst frame gap
const perfMeter=document.getElementById('perfMeter');let pmOn=false,pmLast=0,pmFrames=0,pmWork=0,pmWorst=0,pmPrev=0,pmShow=0;
document.getElementById('perfBtn').addEventListener('click',()=>{pmOn=!pmOn;perfMeter.hidden=!pmOn;pmFrames=pmWork=pmWorst=0;pmLast=pmPrev=performance.now()});
function perfMeterTick(t0){if(!pmOn)return;const now=performance.now();pmFrames++;pmWork+=now-t0;if(pmPrev)pmWorst=Math.max(pmWorst,now-pmPrev);pmPrev=now;
 if(now-pmLast>1000){const fps=pmFrames*1000/(now-pmLast);perfMeter.textContent=fps.toFixed(0)+' FPS · work '+(pmWork/pmFrames).toFixed(1)+'ms · worst gap '+pmWorst.toFixed(0)+'ms · calls '+renderer.info.render.calls+' · px '+renderer.getPixelRatio().toFixed(2);pmLast=now;pmFrames=0;pmWork=0;if(++pmShow%5===0)pmWorst=0}}
// Mission panel (top right) can be hidden; hidden by default on phones
document.getElementById('resetChip').addEventListener('click',()=>document.querySelector('#reset').onclick());
// Keep hints and banners just below the top bar, however many rows it wraps to.
{const tb=document.getElementById('toolbar'),hud=document.getElementById('hud');const upd=()=>{const b=Math.max(tb.getBoundingClientRect().bottom,hud.offsetParent?hud.getBoundingClientRect().bottom:0);document.documentElement.style.setProperty('--topbar',Math.round(b)+'px')};
 try{new ResizeObserver(upd).observe(tb);new ResizeObserver(upd).observe(hud)}catch(_){}addEventListener('resize',upd);upd()}
let tvOn=false;
const tvGlow=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.35),new THREE.MeshBasicMaterial({color:0x79d5f1,side:THREE.DoubleSide,transparent:true,opacity:.0}));
tvGlow.position.set(5.48,2.02,1.2);tvGlow.rotation.y=-Math.PI/2;scene.add(tvGlow);
function toggleTelevision(){tvOn=!tvOn;tvGlow.material.opacity=tvOn?.85:0;addActivity(tvOn?'📺 הטלוויזיה נדלקה בפול ווליום!':'📺 הטלוויזיה כובתה');playToySound(tvOn?520:250,.13,'triangle')}
