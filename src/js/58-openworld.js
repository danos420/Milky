// ===== Open world mode: no days, no progression, everything unlocked, side missions (❗) everywhere =====
var OPEN_WORLD=false;
try{OPEN_WORLD=localStorage.getItem('milky-mode')==='open'}catch(_){}
const extraAt=k=>{const p=extras.find(e=>e.kind===k);return p?p.g.position:null};
const SIDE_POS={
 remote:()=>extraAt('remote'),duck:()=>extraAt('duck'),shoe:()=>extraAt('shoe'),book:()=>extraAt('book'),bottle:()=>extraAt('bottle'),
 slipper:()=>slipperState==='carried'?V(3.5,.4,-6.4):slipper.position,chaos:()=>V(-3.2,0,-1),fridge:()=>V(5.55,1,14.6),sausage:()=>V(5.2,1,14.2),trash:()=>trashProp.g.position,
 kebab:()=>V(2,1,-33.2),cat:()=>cat.position,flip:()=>V(14,.6,-17),
 stopCar:()=>V(13,0,20),pigeons:()=>V(BENCH.x+1.6,0,BENCH.z),streetCat:()=>V(BINS[0].x,1,BINS[0].z),parrot:()=>V(9,1,26),guardFriend:()=>V(7.2,0,13.4),
 bamba:()=>V(BAMBA_HOME.x,.5,BAMBA_HOME.z),iceCream:()=>V(FREEZER.x,1,FREEZER.z),jogger:()=>JOGGER.g.position,
 vetScale:()=>V(SCALE.x,0,SCALE.z),vetTreats:()=>V(JAR.x,1.1,JAR.z),vetEscape:()=>V(EXAM.x-1,0,EXAM.z+1.2),vetBrave:()=>V(EXAM.x,.9,EXAM.z),vetCat:()=>carrier.position,vetIguana:()=>igTank.position,vetCone:()=>V(CONES.x,1.2,CONES.z)
};
const owTex=(()=>{const cv=document.createElement('canvas');cv.width=cv.height=128;const g=cv.getContext('2d');g.fillStyle='#ffc83d';g.beginPath();g.arc(64,64,54,0,Math.PI*2);g.fill();g.lineWidth=8;g.strokeStyle='#3a2508';g.stroke();
 g.fillStyle='#3a2508';g.font='bold 84px system-ui,Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('!',64,70);return new THREE.CanvasTexture(cv)})();
const owMat=new THREE.SpriteMaterial({map:owTex,depthWrite:false,toneMapped:false,fog:false});
const OW_MARKS={};
function owMarker(id){let s=OW_MARKS[id];if(!s){s=new THREE.Sprite(owMat);s.scale.set(.62,.62,.62);s.renderOrder=3;scene.add(s);OW_MARKS[id]=s}return s}
function owNearest(){let best=null,bd=1e9;for(const [id] of challengeDefs){if(challengesDone.has(id)||!SIDE_POS[id])continue;let p=null;try{p=SIDE_POS[id]()}catch(_){}if(!p)continue;const d=Math.hypot(p.x-pos.x,p.z-pos.z);if(d<bd){bd=d;best={id,p,d}}}return best}
function owLabel(id){const c=challengeDefs.find(c=>c[0]===id);return c?c[1]:''}
function owApply(){
 day.finished=true;document.getElementById('dayEnd').hidden=true;PARK_OPEN=true;if(typeof gateOpen==='function')gateOpen();BATH_BLOCK=false;
 if(typeof applyModes==='function')applyModes(true);if(typeof renderModes==='function')renderModes();owChip();
}
function owChip(){if(!OPEN_WORLD)return;if(window.Z_READY&&ZOMBIE){dayChip.textContent='🧟 שיא: גל '+zs.best;return}dayChip.textContent='🌍 '+challengesDone.size+'/'+challengeDefs.length}
function setMode(open){OPEN_WORLD=open;try{localStorage.setItem('milky-mode',open?'open':'story')}catch(_){}
 document.body.classList.toggle('openWorld',open);Object.values(OW_MARKS).forEach(s=>s.visible=false);reset();if(open)owApply();else{renderDay();if(typeof applyModes==='function')applyModes(true)}}
// story vs open world: start buttons + a switch inside the 🏆 panel
document.getElementById('start').addEventListener('click',()=>{if(OPEN_WORLD)setMode(false)});
document.getElementById('startOpen').addEventListener('click',()=>{setMode(true);startGame();showBanner('🌍 עולם פתוח! חפש את סימני ❗ בכל מקום')});
{const b=document.createElement('button');b.id='modeSwitch';b.className='chip';b.type='button';const lab=()=>b.textContent=OPEN_WORLD?'📖 לעבור למצב סיפור':'🌍 לעבור לעולם פתוח';lab();
 b.addEventListener('click',()=>{setMode(!OPEN_WORLD);lab();showBanner(OPEN_WORLD?'🌍 עולם פתוח':'📖 מצב סיפור: השבוע של מילקי')});document.getElementById('challengePanel').appendChild(b)}
// in open world the day chip opens the side-mission list
dayChip.addEventListener('click',e=>{if(!OPEN_WORLD)return;e.stopImmediatePropagation();challengeToggle.onclick()},true);
// hooks into the story systems
const _iu=isUnlocked;isUnlocked=function(d,s){return OPEN_WORLD||_iu(d,s)};
const _cu=checkUnlocks;checkUnlocks=function(){if(OPEN_WORLD){renderModes();owChip();return}_cu()};
const _nth=nextTaskHint;nextTaskHint=function(){if(!OPEN_WORLD)return _nth();const n=owNearest();return n?'❗ '+owLabel(n.id)+' · '+Math.round(n.d)+'מ׳':'🏆 כל משימות הצד הושלמו!'};
const _ct=currentTarget;currentTarget=function(){if(!OPEN_WORLD)return _ct();if(!guideOn)return null;const n=owNearest();return n?n.p:null};
const _wps=weekPhaseStart;weekPhaseStart=function(phase,fresh){if(OPEN_WORLD){renderWeek();return}_wps(phase,fresh)};
const _lwp=loadWeekPhases;loadWeekPhases=function(){_lwp();if(OPEN_WORLD){DAY.splice(0,DAY.length,...DAY_NORMAL)}};
const _cc=completeChallenge;completeChallenge=function(id){const had=challengesDone.has(id);_cc(id);if(OPEN_WORLD&&!had&&!(window.Z_READY&&ZOMBIE)){owChip();showBanner('❗ משימת צד: '+owLabel(id));if(window.JUICE_READY){pow('✔ '+owLabel(id).split(' ')[0],pos.x,2.4,pos.z,true)}}};
// day/night keeps turning in the open world
const OW_CYCLE=[[0,110],[1,110],[2,90],[3,60]];let owClock=0;
function updateOpenWorld(dt){
 if(!OPEN_WORLD){return}
 if(!day.finished)owApply();
 owClock+=dt;let t=owClock%OW_CYCLE.reduce((a,c)=>a+c[1],0),L=0;for(const [l,d] of OW_CYCLE){if(t<d){L=l;break}t-=d}
 if(!rain.visible)day.light=L;
 const tt=performance.now()/1000;
 for(const [id] of challengeDefs){const f=SIDE_POS[id];if(!f)continue;const s=owMarker(id);if(challengesDone.has(id)){s.visible=false;continue}
  let p=null;try{p=f()}catch(_){}if(!p){s.visible=false;continue}const d=Math.hypot(p.x-pos.x,p.z-pos.z);s.visible=d<38&&d>1.2;if(s.visible){s.position.set(p.x,(p.y||0)+1.7+Math.sin(tt*2.5+p.x)*.12,p.z);const k=.55+Math.min(.5,d*.02);s.scale.set(k,k,k)}}
}
if(OPEN_WORLD){document.body.classList.add('openWorld')}
window.OW_READY=true;
