// The final free-tier content pass: repeatable object actions and a compact challenge board.
const challengeDefs=[
 ['remote','📺 להדליק את הטלוויזיה עם השלט'],
 ['duck','🦆 לגרום לברווז לצפצף'],
 ['shoe','👟 להעיף נעל'],
 ['book','📚 לפזר ספרים'],
 ['bottle','🧴 לגלגל בקבוק'],
 ['slipper','🩴 להחביא את הכפכף במיטה'],
 ['chaos','🌪️ להגיע לכאוס מקסימלי'],
 ['fridge','🧊 לפתוח את המקרר'],
 ['sausage','🌭 לגנוב את הנקניקייה'],
 ['trash','🗑️ להפוך את הפח במטבח'],
 ['kebab','🍢 לגנוב קבב מהמנגל של השכן'],
 ['cat','🐈 לגעת בחתול'],
 ['flip','🤸 סלטה על הטרמפולינה'],
 ['bones','🦴 למצוא את כל 12 עצמות הזהב']
];
const challengesDone=new Set();
const challengeToggle=document.querySelector('#challengeToggle');
const challengePanel=document.querySelector('#challengePanel');
const challengeList=document.querySelector('#challengeList');
const challengeSummary=document.querySelector('#challengeSummary');
challengeToggle.onclick=()=>{challengePanel.hidden=!challengePanel.hidden;challengeToggle.setAttribute('aria-expanded',String(!challengePanel.hidden));challengeToggle.classList.toggle('active',!challengePanel.hidden);if(!challengePanel.hidden&&!activityDrawer.hidden)activityToggle.click();if(!challengePanel.hidden&&!dayPanel.hidden){dayPanel.hidden=true;dayChip.classList.remove('active')}};
function renderChallenges(){
 challengeList.innerHTML='';
 for(const [id,label] of challengeDefs){const el=document.createElement('div');el.className='task'+(challengesDone.has(id)?' done':'');el.textContent=(challengesDone.has(id)?'✅ ':'⬜ ')+label;challengeList.appendChild(el)}
 challengeSummary.textContent='הושלמו '+challengesDone.size+' מתוך '+challengeDefs.length+' אתגרים';document.getElementById('challengeCount').textContent=challengesDone.size+'/'+challengeDefs.length;
}
function completeChallenge(id){
 if(challengesDone.has(id))return;
 challengesDone.add(id);renderChallenges();recordProgress();
 const found=challengeDefs.find(x=>x[0]===id);
 addActivity('🏆 הושלם: '+(found?found[1]:id));
 if(challengesDone.size===challengeDefs.length){addActivity('🎉 ברדק אחולמניוקי מושלם! כל האתגרים הושלמו!');showBurst(pos.x,pos.z)}
}
renderChallenges();
