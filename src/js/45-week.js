// ===== Milky's week: a different day every time, each with its own story and tasks =====
var BATH_BLOCK=false;
const DAY_NORMAL=DAY.slice();
const WEEK=[
 {id:'normal',icon:'☀️',name:'יום ראשון: יום רגיל בבית',short:'יום רגיל',intro:'☀️ יום ראשון: עוד יום רגיל של ברדק'},
 {id:'bath',icon:'🛁',name:'יום שני: יום אמבטיה',short:'אמבטיה',intro:'🛁 יום שני: אבא החליט שהיום מילקי מתרחץ!'},
 {id:'shop',icon:'🛒',name:'יום שלישי: יום קניות',soon:true},
 {id:'sick',icon:'🤒',name:'יום רביעי: אבא חולה',soon:true},
 {id:'park',icon:'🌳',name:'יום חמישי: גינת כלבים',soon:true},
 {id:'friday',icon:'🍗',name:'יום שישי: ארוחה משפחתית',soon:true},
 {id:'party',icon:'🎉',name:'שבת: יום הולדת למילקי',soon:true}
];
if(!save.week||typeof save.week!=='object')save.week={cur:0,stars:[]};
if(!Array.isArray(save.week.stars))save.week.stars=[];
save.week.cur=Math.max(0,Math.min(WEEK.length-1,+save.week.cur||0));
const week=save.week;
function dayUnlocked(i){if(i===0)return true;if(WEEK[i].soon)return false;
 return (week.stars[i-1]||0)>0||(i===1&&(save.day&&save.day.completed>0))}
// (checked again once every day's module has loaded and dropped its 'soon' flag — see 64-episodes)
const PHASE_SETS={normal:DAY_NORMAL};
function loadWeekPhases(){const id=WEEK[week.cur].id;const set=PHASE_SETS[id]||DAY_NORMAL;DAY.splice(0,DAY.length,...set);BATH_BLOCK=false;if(typeof bathResetProps==='function')bathResetProps()}
function weekIcon(){return week.cur?WEEK[week.cur].icon:''}
const DAY_HOOKS={};
function weekPhaseStart(phase,fresh){const h=DAY_HOOKS[WEEK[week.cur].id];if(h)h(phase,fresh);if(fresh&&started)showBanner(WEEK[week.cur].intro);renderWeek()}
function weekFinished(stars){
 week.stars[week.cur]=Math.max(week.stars[week.cur]||0,stars);
 const nx=week.cur+1,btn=document.getElementById('dayNextBtn');
 if(nx<WEEK.length&&dayUnlocked(nx)){btn.hidden=false;btn.textContent='▶ '+WEEK[nx].icon+' '+WEEK[nx].short;btn.dataset.day=nx}
 else if(nx<WEEK.length){btn.hidden=false;btn.disabled=true;btn.textContent=WEEK[nx].icon+' '+WEEK[nx].name.split(':')[0]+' · בקרוב'}
 else btn.hidden=true;
 writeSave();renderWeek();
}
function goToDay(i){if(!dayUnlocked(i))return;week.cur=i;writeSave();const b=document.getElementById('dayNextBtn');b.hidden=true;b.disabled=false;reset()}
document.getElementById('dayNextBtn').addEventListener('click',e=>goToDay(+e.currentTarget.dataset.day));
function renderWeek(){
 const bar=document.getElementById('weekBar');if(!bar)return;bar.innerHTML='';
 WEEK.forEach((d,i)=>{const b=document.createElement('button');b.type='button';const ok=dayUnlocked(i);
  b.className='weekDay'+(i===week.cur?' cur':'')+(ok?'':' locked');b.disabled=!ok||i===week.cur;
  const st=week.stars[i]||0;b.innerHTML='';const ic=document.createElement('b');ic.textContent=ok||d.soon?d.icon:'🔒';
  const lb=document.createElement('small');lb.textContent=d.soon?'בקרוב':st?'⭐'.repeat(st):ok?'חדש':'🔒';b.append(ic,lb);
  b.title=d.name+(d.soon?' (בקרוב)':ok?'':' · לסיים את היום הקודם');
  b.addEventListener('click',()=>{if(confirmSwitch(i))goToDay(i)});bar.appendChild(b)});
 const h=document.getElementById('weekTitle');if(h)h.textContent=WEEK[week.cur].name;
}
let switchArm=-1,switchT=0;
function confirmSwitch(i){if(day.t<20||day.finished)return true;if(switchArm===i&&performance.now()-switchT<3000)return true;switchArm=i;switchT=performance.now();addActivity('🗓️ לחץ שוב כדי לעבור ל'+WEEK[i].name+' (היום הנוכחי יתחיל מחדש)');showBanner('לחץ שוב כדי לעבור יום');return false}
window.WEEK_READY=true;
