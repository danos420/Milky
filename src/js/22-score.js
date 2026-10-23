// ===== Score and trick feed =====
let score=0,trickTimer=0,bonesFound=0;
const scoreChip=document.getElementById('scoreChip'),boneChip=document.getElementById('boneChip');
function showTrick(text){hint.textContent='⭐ '+text;hint.classList.add('trick');trickTimer=1.8}
function addScore(n,label){score+=n;if(score>save.best)recordProgress();scoreChip.textContent='⭐ '+score;showTrick(label+'  +'+n);addActivity('⭐ '+label+' +'+n)}
