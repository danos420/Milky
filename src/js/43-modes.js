// ===== Crazy modes + wardrobe: unlocked by stars, bones, challenges and finished days =====
const MUT={giant:false,tiny:false,moon:false,turbo:false,hungry:false,chaos:false};
let MS=1,mutBelly=0;
const mutG=()=>MUT.moon?.36:1, mutPush=()=>(MUT.chaos?3:1)*(MUT.giant?1.6:1), mutReach=()=>MS, mutSpeed=()=>MUT.turbo?1.75:1;
const MODE_DEFS=[
 {id:'turbo',icon:'⚡',name:'מילקי טורבו',desc:'רץ פי שתיים מהר',need:s=>[s.days,1,'לסיים יום שלם']},
 {id:'moon',icon:'🌙',name:'כוח משיכה של ירח',desc:'קפיצות עד התקרה',need:s=>[s.bones,3,'עצמות זהב']},
 {id:'giant',icon:'🦣',name:'מילקי ענק',desc:'הבית קטן עליו',need:s=>[s.chal,5,'אתגרים']},
 {id:'tiny',icon:'🐭',name:'מילקי מיני',desc:'כלב בגודל של נעל',need:s=>[s.bones,6,'עצמות זהב']},
 {id:'hungry',icon:'🍔',name:'מצב רעב',desc:'כל מה שהוא נוגע בו נבלע',need:s=>[s.stars,2,'כוכבים ביום אחד']},
 {id:'chaos',icon:'💥',name:'פיזיקה מטורפת',desc:'הכל עף פי 3',need:s=>[s.best,8000,'שיא ניקוד']}
];
const WEAR_DEFS=[
 {id:'shades',icon:'😎',name:'משקפי שמש',need:s=>[s.bones,1,'עצמות זהב']},
 {id:'party',icon:'🥳',name:'כובע מסיבה',need:s=>[s.chal,3,'אתגרים']},
 {id:'gold',icon:'📿',name:'קולר זהב',need:s=>[s.days,1,'לסיים יום שלם']},
 {id:'cape',icon:'🦸',name:'גלימת גיבור',need:s=>[s.chal,9,'אתגרים']},
 {id:'crown',icon:'👑',name:'כתר המלך',need:s=>[save.mods&&save.mods.bday?12:s.bones,12,'עצמות זהב']}
];
function progressStats(){const d=save.day||{};return {bones:save.bones.length,chal:save.challenges.length,days:d.completed||0,stars:d.bestStars||0,best:save.best||0}}
function isUnlocked(def,s){const [have,need]=def.need(s||progressStats());return have>=need}
if(!save.mods||typeof save.mods!=='object')save.mods={};
for(const k of ['on','wear','seen'])if(!Array.isArray(save.mods[k]))save.mods[k]=[];
// ---- Wardrobe meshes (each in its own group so merging never leaks a hidden piece) ----
const WEAR={};
{
 const gold=mat(0xf2c14e,.35),ruby=mat(0xd2283c,.3),lens=mat(0x15171c,.25),frame=mat(0x2a2a2e,.4);
 let g=new THREE.Group();headPivot.add(g);WEAR.shades=g;
 for(const s of [-1,1]){box(.13,.085,.025,lens,s*.13,.1,.355,g);box(.012,.02,.2,frame,s*.215,.11,.26,g)}
 box(.1,.02,.02,frame,0,.12,.36,g);
 g=new THREE.Group();g.position.set(.04,.3,.02);g.rotation.z=-.25;headPivot.add(g);WEAR.party=g;
 {const c=mesh(new THREE.ConeGeometry(.13,.34,16),mat(0x4d9de0,.6),0,.17,0,g);c.castShadow=true;
  for(const [y,r,col] of [[.07,.1,0xf2c14e],[.19,.065,0xe8566c]]){const b=mesh(new THREE.TorusGeometry(r,.014,6,16),mat(col,.6),0,y,0,g);b.rotation.x=Math.PI/2}
  ball(.045,mat(0xf6f1e4,.8),0,.35,0,g)}
 g=new THREE.Group();torso.add(g);WEAR.gold=g;
 {const ring=mesh(new THREE.TorusGeometry(.19,.04,8,20),gold,0,1.43,.6,g);ring.rotation.x=Math.PI/2-.55;ball(.06,gold,0,1.25,.73,g);ball(.025,ruby,0,1.25,.79,g)}
 g=new THREE.Group();g.position.set(0,1.56,.42);torso.add(g);WEAR.cape=g;
 {const red=mat(0xc8323c,.7);red.side=THREE.DoubleSide;const c=mesh(new THREE.CylinderGeometry(.36,.4,1.0,14,1,true,Math.PI/2,Math.PI),red,0,-.36,-.5,g);c.rotation.x=Math.PI/2;
  const t=mesh(new THREE.TorusGeometry(.4,.025,6,14,Math.PI),gold,0,-.36,-1.0,g);ball(.07,gold,0,-.03,.02,g)}
 g=new THREE.Group();g.position.set(0,.3,.04);headPivot.add(g);WEAR.crown=g;
 {const band=mesh(new THREE.CylinderGeometry(.15,.16,.1,12,1,true),gold,0,.05,0,g);band.material.side=THREE.DoubleSide;
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;mesh(new THREE.ConeGeometry(.035,.09,6),gold,Math.sin(a)*.15,.14,Math.cos(a)*.15,g);ball(.022,i%2?ruby:mat(0x3a7bd5,.3),Math.sin(a)*.155,.05,Math.cos(a)*.155,g)}}
 for(const k in WEAR)WEAR[k].visible=false;
}
// ---- Hungry mode: Milky swallows small props whole ----
const EDIBLE=new Set(['bottle','book','shoe','duck','remote','cone','soccer','cushion','box']);
const eaten=[],gulping=[];const _mouth=new THREE.Vector3();
function tryEat(p){
 if(!MUT.hungry||!EDIBLE.has(p.kind)||carried.has(p.g)||jumpY>.9*MS)return false;
 const d=Math.hypot(p.g.position.x-pos.x,p.g.position.z-pos.z);if(d>.9*MS)return false;
 carried.add(p.g);p.vx=p.vz=0;if('vy' in p)p.vy=0;gulping.push({p,t:0});
 SFX.slurp&&SFX.slurp();return true;
}
function finishEat(p){
 p.g.visible=false;eaten.push(p);mutBelly=Math.min(1,eaten.length/8);
 const n=eaten.length;addScore(150+n*25,n>=8?'מילקי בולע־על! ×'+n:'נבלע! ×'+n);addChaos(6);
 if(n%4===0)sayText(milkyB,pick(['בוווורפ! 🫧','אופס... זה היה נעל?','עוד! עוד!','אני לא שמן, אני פרוותי']),2.2,'say',true);else milkyThought('😋',1.2,true);
 if(n===3)speakDad(pick(['מילקי! זה לא אוכל!','איפה השלט?! אל תגיד לי...']));
 if(n===6)sayDani(pick(['הכלב הזה הוא פח זבל עם זנב','מילקי, אתה תתפוצץ!']));
}
function restoreEaten(){
 for(const g of gulping){g.p.g.scale.setScalar(1);eaten.push(g.p)}gulping.length=0;
 for(const p of eaten){carried.delete(p.g);p.g.visible=true;p.g.scale.setScalar(1);p.g.position.copy(p.home);p.g.rotation.set(0,0,0);p.vx=p.vz=0;if('vy' in p)p.vy=0}
 eaten.length=0;mutBelly=0;
}
// ---- Apply the active set ----
function applyModes(announce){
 const on=new Set(save.mods.on);const s=progressStats();
 for(const d of MODE_DEFS)MUT[d.id]=on.has(d.id)&&isUnlocked(d,s);
 if(MUT.giant&&MUT.tiny)MUT.tiny=false;
 MS=MUT.giant?1.7:MUT.tiny?.55:1;dog.scale.setScalar(MS);
 if(!MUT.hungry&&eaten.length+gulping.length)restoreEaten();
 const wear=new Set(save.mods.wear);for(const d of WEAR_DEFS)WEAR[d.id].visible=wear.has(d.id)&&isUnlocked(d,s);
 collar.visible=!WEAR.gold.visible;
 if(announce)return;
 renderModes();
}
const MODE_LINES={
 giant:[()=>speakDad('מה נתנו לכלב הזה לאכול?!'),()=>sayDani('מילקי... אתה צריך דלת חדשה')],
 tiny:[()=>speakDad('איפה מילקי? ...אה, הנה הוא, ליד הנעל'),()=>sayDani('ווי, הוא כמו אוגר!')],
 moon:[()=>sayDani('מי כיבה את כוח המשיכה?')],
 turbo:[()=>speakDad('לאט! לאט! הוא עוד ייכנס בקיר')],
 hungry:[()=>sayDani('שימו את הנעליים במקום גבוה!')],
 chaos:[()=>speakDad('למה כל הבית רוקד?!')]
};
function toggleMode(id){
 const L=save.mods.on,i=L.indexOf(id);
 if(i>=0)L.splice(i,1);else{L.push(id);if(id==='giant'&&L.includes('tiny'))L.splice(L.indexOf('tiny'),1);if(id==='tiny'&&L.includes('giant'))L.splice(L.indexOf('giant'),1);
  const f=MODE_LINES[id];if(f&&started)pick(f)();addActivity('🎭 '+MODE_DEFS.find(d=>d.id===id).name+' הופעל!');chaosShake=Math.max(chaosShake,.2);thought(milkyB,MODE_DEFS.find(d=>d.id===id).icon,1.6,true)}
 writeSave();applyModes();
}
function toggleWear(id){const L=save.mods.wear,i=L.indexOf(id);if(i>=0)L.splice(i,1);else{L.push(id);thought(milkyB,'😎',1.4,true)}writeSave();applyModes()}
// ---- Panel ----
const modePanel=document.getElementById('modePanel'),modeToggle=document.getElementById('modeToggle');
function renderModes(){
 const s=progressStats(),list=document.getElementById('modeList'),wl=document.getElementById('wearList');list.innerHTML='';wl.innerHTML='';
 const item=(d,isOn,onClick,parent)=>{const b=document.createElement('button');b.type='button';const [have,need,label]=d.need(s),ok=have>=need;
  b.className='modeItem'+(ok?'':' locked')+(isOn?' on':'')+(ok&&!save.mods.seen.includes(d.id)?' fresh':'');b.disabled=!ok;
  const ic=document.createElement('b');ic.textContent=ok?d.icon:'🔒';const tx=document.createElement('span');
  const nm=document.createElement('strong');nm.textContent=d.name;const sub=document.createElement('small');
  sub.textContent=ok?(d.desc?d.desc+(isOn?' · פעיל':''):(isOn?'לבוש':'ללבוש')):(label==='שיא ניקוד'?'שיא '+need.toLocaleString('he-IL')+' (יש '+have.toLocaleString('he-IL')+')':label==='לסיים יום שלם'?'לסיים יום שלם':have+'/'+need+' '+label);
  tx.append(nm,sub);b.append(ic,tx);b.addEventListener('click',onClick);parent.appendChild(b)};
 for(const d of MODE_DEFS)item(d,MUT[d.id],()=>toggleMode(d.id),list);
 for(const d of WEAR_DEFS)item(d,WEAR[d.id].visible,()=>toggleWear(d.id),wl);
 const nOn=MODE_DEFS.filter(d=>MUT[d.id]).length;document.getElementById('modeCount').textContent=nOn?String(nOn):'';
 const unseen=[...MODE_DEFS,...WEAR_DEFS].some(d=>isUnlocked(d,s)&&!save.mods.seen.includes(d.id));modeToggle.classList.toggle('fresh',unseen);
}
let unlockKnown=null;
function checkUnlocks(){
 const s=progressStats(),now=[...MODE_DEFS,...WEAR_DEFS].filter(d=>isUnlocked(d,s)).map(d=>d.id);
 if(unlockKnown){for(const d of [...MODE_DEFS,...WEAR_DEFS])if(now.includes(d.id)&&!unlockKnown.includes(d.id)){
  addActivity('🔓 נפתח: '+d.icon+' '+d.name+' (בתפריט 🎭)');if(typeof showBanner==='function')showBanner('🔓 נפתח: '+d.icon+' '+d.name);SFX.fanfare&&SFX.fanfare()}}
 unlockKnown=now;renderModes();
}
function closeModePanel(){if(!modePanel.hidden){modePanel.hidden=true;modeToggle.classList.remove('active');modeToggle.setAttribute('aria-expanded','false')}}
modeToggle.addEventListener('click',()=>{
 const open=modePanel.hidden;
 if(open){if(!activityDrawer.hidden)activityToggle.click();if(!challengePanel.hidden)challengeToggle.onclick();if(!dayPanel.hidden){dayPanel.hidden=true;dayChip.classList.remove('active')}}
 modePanel.hidden=!open;modeToggle.classList.toggle('active',open);modeToggle.setAttribute('aria-expanded',String(open));
 if(open){renderModes();const s=progressStats();let ch=false;for(const d of [...MODE_DEFS,...WEAR_DEFS])if(isUnlocked(d,s)&&!save.mods.seen.includes(d.id)){save.mods.seen.push(d.id);ch=true}if(ch)writeSave();setTimeout(()=>modeToggle.classList.toggle('fresh',false),0)}
});
for(const el of [activityToggle,challengeToggle,dayChip])el.addEventListener('click',()=>{if(el===challengeToggle?!challengePanel.hidden:el===dayChip?!dayPanel.hidden:!activityDrawer.hidden)closeModePanel()});
window.addEventListener('keydown',e=>{if(e.code==='KeyM'&&!e.repeat)modeToggle.click()});
// ---- Per-frame ----
function updateModes(dt,t){
 for(let i=gulping.length-1;i>=0;i--){const g=gulping[i];g.t+=dt;const k=Math.min(1,g.t/.35);
  headPivot.localToWorld(_mouth.set(0,-.1,.55));g.p.g.position.lerp(_mouth,Math.min(1,dt*14));g.p.g.position.y=Math.max(0,g.p.g.position.y);g.p.g.scale.setScalar(Math.max(.01,1-k));g.p.g.rotation.y+=dt*12;
  if(k>=1){gulping.splice(i,1);g.p.g.scale.setScalar(1);finishEat(g.p)}}
 if(WEAR.cape.visible){const sp=Math.min(1,Math.abs(curSpeed)/6);WEAR.cape.rotation.x+=((-.08+sp*.32+(grounded?0:.35)+Math.sin(t*14)*.06*sp)-WEAR.cape.rotation.x)*Math.min(1,dt*8);WEAR.cape.rotation.z=Math.sin(t*9)*.05*sp}
}
applyModes();checkUnlocks();window.MODES_READY=true;
