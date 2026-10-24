// ===== The universe: one episode engine (10 levels, stars, unlocks) and a world-select menu =====
if(!save.ep||typeof save.ep!=='object')save.ep={};
const EP={list:{},cur:null,idx:0};
function epRegister(ep){EP.list[ep.id]=ep;if(!save.ep[ep.id])save.ep[ep.id]={}}
function epStars(id){return Object.values(save.ep[id]||{}).reduce((a,b)=>a+(+b||0),0)}
function epUnlocked(ep,i){return i===0||((save.ep[ep.id]||{})[ep.levels[i-1].id]||0)>0}
function epComplete(id){const ep=EP.list[id];return ep&&ep.levels.every(l=>(save.ep[id]||{})[l.id]>0)}
const epB=document.getElementById('epBoard'),epE=document.getElementById('epEnd');
function epBoard(id){const ep=EP.list[id];EP.cur=ep;started=false;document.querySelector('#overlay').style.display='none';epE.hidden=true;
 document.getElementById('epIcon').textContent=ep.icon;document.getElementById('epTitle').textContent=ep.title;
 document.getElementById('epSub').textContent='⭐ '+epStars(id)+' / '+ep.levels.length*3+(ep.reward?' · פרס: '+ep.reward:'')+(epComplete(id)&&ep.rewardDone?' · ✔ '+ep.rewardDone:'');
 const box=document.getElementById('epLevels');box.innerHTML='';let marked=false;
 ep.levels.forEach((lv,i)=>{const b=document.createElement('button');b.type='button';const ok=epUnlocked(ep,i),st=(save.ep[id]||{})[lv.id]||0;b.className='epLv'+(ok?'':' locked');if(ok&&!st&&!marked){b.classList.add('next');marked=true}b.disabled=!ok;
  const ic=document.createElement('b');ic.textContent=ok?lv.icon:'🔒';const t=document.createElement('strong');t.textContent=(i+1)+'. '+lv.title;const sm=document.createElement('small');sm.textContent=st?'⭐'.repeat(st)+'☆'.repeat(3-st):ok?(lv.sub||'חדש!'):'נפתח אחרי השלב הקודם';
  b.append(ic,t,sm);b.addEventListener('click',()=>{epB.hidden=true;EP.idx=i;ep.start(i)});box.appendChild(b)});
 epB.hidden=false}
document.getElementById('epBack').addEventListener('click',()=>{epB.hidden=true;if(EP.cur&&EP.cur.quit)EP.cur.quit();openMenu()});
function epFinish(win,stars,lines,title){const ep=EP.cur,i=EP.idx,lv=ep.levels[i];const wasDone=epComplete(ep.id);
 if(win){save.ep[ep.id][lv.id]=Math.max(save.ep[ep.id][lv.id]||0,stars);writeSave()}
 document.getElementById('epEndIcon').textContent=win?lv.icon:'💀';document.getElementById('epEndTitle').textContent=title||(win?lv.title+' — הושלם!':lv.title+' — נכשל');
 document.getElementById('epEndStars').innerHTML=win?[0,1,2].map(k=>'<span class="'+(k<stars?'on':'off')+'">⭐</span>').join(''):'';
 const st=document.getElementById('epEndStats');st.innerHTML='';const ls=lines.slice();if(win&&!wasDone&&epComplete(ep.id)&&ep.rewardDone){ls.push('🎉 '+ep.rewardDone);if(ep.onComplete)ep.onComplete()}
 for(const l of ls){const d=document.createElement('div');d.textContent=l;st.appendChild(d)}
 const nx=document.getElementById('epNext');nx.hidden=!(win&&i+1<ep.levels.length);
 epE.hidden=false;started=false;if(win&&window.JUICE_READY)for(let k=0;k<3;k++)setTimeout(()=>showBurst(pos.x,pos.z),k*200)}
document.getElementById('epNext').addEventListener('click',()=>{epE.hidden=true;EP.idx++;EP.cur.start(EP.idx)});
document.getElementById('epRetry').addEventListener('click',()=>{epE.hidden=true;EP.cur.start(EP.idx)});
document.getElementById('epToBoard').addEventListener('click',()=>{epE.hidden=true;epBoard(EP.cur.id)});
// ---------- world select ----------
const WORLDS=[
 {icon:'📖',name:'מצב סיפור',col:'#f9d36d',sub:()=>'השבוע של מילקי · ⭐ '+(save.week?Object.values(save.week.stars||{}).reduce((a,b)=>a+(+b||0),0):0)+'/21',go:()=>document.getElementById('start').click()},
 {icon:'🌍',name:'עולם פתוח',col:'#7fd3a8',sub:()=>'משימות צד · '+save.challenges.length+'/'+challengeDefs.length,go:()=>document.getElementById('startOpen').click()},
 {icon:'🧟',name:'מתקפת זומבים',col:'#8fd36d',sub:()=>'10 לילות · ⭐ '+epStars('zombie')+'/30',go:()=>epBoard('zombie')},
 {icon:'🕵️',name:'הבלש מילקי',col:'#d9b97a',sub:()=>'10 תיקים · ⭐ '+totalStars()+'/30',go:()=>document.getElementById('startDetective').click()},
 {icon:'🕺',name:'מילקי בן אדם',col:'#c9a7ff',sub:()=>'10 סידורים · ⭐ '+epStars('human')+'/30',go:()=>epBoard('human')},
 {icon:'👨',name:'לשחק כאבא',col:'#b8c4d0',sub:()=>epComplete('dad')?'✔ פתוח בעולם הפתוח · ⭐ '+epStars('dad')+'/30':'10 משימות · ⭐ '+epStars('dad')+'/30',go:()=>epBoard('dad')}
];
const uniBox=document.createElement('div');uniBox.id='universe';document.getElementById('startModes').after(uniBox);
function universeRender(){uniBox.innerHTML='';for(const w of WORLDS){const b=document.createElement('button');b.type='button';b.className='uCard';b.style.background=w.col;
 const ic=document.createElement('b');ic.textContent=w.icon;const n=document.createElement('strong');n.textContent=w.name;const s=document.createElement('small');try{s.textContent=w.sub()}catch(_){s.textContent=''}
 b.append(ic,n,s);b.addEventListener('click',()=>{w.go()});uniBox.appendChild(b)}}
function openMenu(){started=false;for(const k in keys)keys[k]=false;for(const id of ['dayEnd','zOver','hEnd','dEnd','dBoard','dAccuse','epEnd','epBoard'])document.getElementById(id).hidden=true;evtPill.hidden=true;universeRender();document.querySelector('#overlay').style.display=''}
document.getElementById('menuBtn').addEventListener('click',()=>universeRender());
universeRender();
epRegister({id:'zombie',icon:'🧟',title:'מתקפת זומבים: 10 לילות',reward:'👑 לסיים את כל הלילות',rewardDone:'שרדת את כל 10 הלילות! מילקי, מגן השכונה 🛡️',
 levels:NIGHTS.map((n,i)=>({id:'n'+(i+1),title:'לילה '+(i+1)+': '+n.t,icon:n.icon,sub:n.sub})),
 start:i=>{zs.night=i;document.querySelector('#overlay').style.display='none';setZombie(true);startGame();setTimeout(()=>showBanner('🌙 לילה '+(i+1)+': '+NIGHTS[i].t),200)},
 quit:()=>{if(ZOMBIE)setZombie(false)}});
epRegister({id:'human',icon:'🕺',title:'מילקי בן אדם: 10 סידורים',rewardDone:'🎩 כל הסידורים "בוצעו"! אבא עדיין לא בטוח מה קרה היום',
 levels:ERRANDS.map(e=>({id:e.id,title:e.name,icon:e.icon,sub:'כל סידור נגמר בפיאסקו'})),
 start:i=>{document.querySelector('#overlay').style.display='none';setHuman(true);startGame();hStartErrand(i)},quit:()=>{if(HUMAN)setHuman(false)}});
window.EP_READY=true;
