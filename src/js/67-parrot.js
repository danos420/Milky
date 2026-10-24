// ===== Play as the parrot "Coco": he flies (hold jump = flap), has 10 missions, then joins the 🔄 character switch =====
var PARP=false;
// player model
const PP=new THREE.Group();scene.add(PP);PP.visible=false;
const PPb=new THREE.Group();PP.add(PPb);
{const g1=mat(0x2fb34a,.6),g2=mat(0x3fcf5a,.6),red=mat(0xd63a2f,.6),yel=mat(0xf2c14e,.5),blk=mat(0x111111);
 const b=ball(.26,g1,0,.42,0,PPb);b.scale.set(.85,1.05,1.25);const bel=ball(.2,yel,0,.36,.1,PPb);bel.scale.set(.8,.9,.9);
 PP.head=new THREE.Group();PP.head.position.set(0,.78,.18);PPb.add(PP.head);ball(.19,red,0,0,0,PP.head);
 const bk=mesh(new THREE.ConeGeometry(.07,.18,8),mat(0x3a3a3a,.4),0,-.04,.2,PP.head);bk.rotation.x=Math.PI/2+.5;
 for(const s of [-1,1]){ball(.05,mat(0xffffff),s*.11,.04,.12,PP.head);ball(.028,blk,s*.125,.045,.155,PP.head)}
 const cr=ball(.06,mat(0xf2c14e),0,.18,-.04,PP.head);cr.scale.set(.6,1.6,1);
 PP.wings=[-1,1].map(s=>{const w=new THREE.Group();w.position.set(s*.2,.55,0);PPb.add(w);const f=box(.5,.04,.32,g2,s*.25,0,0,w);box(.22,.045,.33,mat(0x3a7bd5,.6),s*.48,0,-.02,w);return w});
 const t=new THREE.Group();t.position.set(0,.36,-.3);PPb.add(t);const tf=box(.12,.05,.5,red,0,0,-.22,t);box(.08,.055,.3,mat(0x3a7bd5,.6),0,.01,-.42,t);PP.tail=t;
 PP.feet=[-1,1].map(s=>{const l=cyl(.025,.2,mat(0x6b6b6b),s*.08,.1,.02,PPb);return l});
 PP.beak=new THREE.Group();PP.beak.position.set(0,-.12,.28);PP.head.add(PP.beak)}
const pB=makeBubble(PP,1.25);
// rings
const RINGS=[];for(let i=0;i<10;i++){const g=new THREE.Mesh(new THREE.TorusGeometry(.9,.09,8,24),new THREE.MeshBasicMaterial({color:0xffc24a,transparent:true,opacity:.9}));g.visible=false;scene.add(g);RINGS.push(g)}
// carried things
function mkItem(kind){const g=new THREE.Group();scene.add(g);g.visible=false;
 if(kind==='bamba'){box(.3,.4,.12,mat(0xf2c14e,.6),0,0,0,g);box(.2,.12,.125,mat(0xe74c3c,.6),0,.05,.001,g)}
 else if(kind==='slice'){const s=mesh(new THREE.ConeGeometry(.28,.06,3),mat(0xf3c26b,.7),0,0,0,g);s.rotation.x=Math.PI/2;for(let i=0;i<3;i++)ball(.04,mat(0xc0392b),(i-1)*.08,.04,(i%2)*.06,g)}
 else if(kind==='kebab'){cyl(.012,.6,mat(0x999999),0,0,0,g).rotation.z=Math.PI/2;for(let i=0;i<5;i++)ball(.06,mat(i%2?0x7a3e1e:0xc0392b,.8),-.2+i*.1,0,0,g)}
 return g}
const ITEMS={bamba:mkItem('bamba'),slice:mkItem('slice'),kebab:mkItem('kebab')};
const PERCH=new THREE.Vector3(7.5,3.9,26);
let pAlt=0,pCarry=null,pFlap=0,pWing=0;
// mission state
const PM={i:-1,m:null,t:0,over:false,k:0,hold:0,seen:new Set()};
const p3=(x,y,z)=>new THREE.Vector3(x,y,z);
const pDist=(v,y)=>Math.hypot(v.x-pos.x,v.z-pos.z,(y==null?v.y:y)-(jumpY+.4));
const pXZ=v=>Math.hypot(v.x-pos.x,v.z-pos.z);
function pSay(t,d=1.8){sayText(pB,t,d,'say',true)}
function ringsSet(list){RINGS.forEach((r,i)=>{const p=list[i];r.visible=!!p;if(p){r.position.set(p[0],p[1],p[2]);r.rotation.y=p[3]||0;r.material.color.setHex(i===0?0xffc24a:0xffe9b8);r.material.opacity=i===0?.95:.45}});PM.k=0;PM.rings=list}
function ringsUpdate(){const L=PM.rings;if(!L||PM.k>=L.length)return true;const r=RINGS[PM.k];r.rotation.z+=.03;
 if(Math.hypot(r.position.x-pos.x,r.position.y-(jumpY+.4),r.position.z-pos.z)<1.15){r.visible=false;PM.k++;addScore(150,'טבעת '+PM.k+'/'+L.length);if(window.JUICE_READY)pow('✨',r.position.x,r.position.y,r.position.z);try{playToySound(520+PM.k*60,.07,'triangle')}catch(_){}
  const n=RINGS[PM.k];if(n&&n.visible){n.material.color.setHex(0xffc24a);n.material.opacity=.95}}return PM.k>=L.length}
function itemGive(kind,x,y,z){const it=ITEMS[kind];it.visible=true;if(it.parent!==scene){it.parent.remove(it);scene.add(it)}it.position.set(x,y,z);it.rotation.set(0,0,0);PM.item=it;PM.itemKind=kind}
function itemTake(){const it=PM.item;if(!it||pCarry)return;it.parent.remove(it);PP.beak.add(it);it.position.set(0,-.05,.05);it.rotation.set(0,Math.PI/2,0);it.scale.setScalar(.7);pCarry=it;pSay(pick(['😎 שלי!','🦜 גנבתי!','🥜 יאמי']),1.2)}
function itemDrop(){if(!pCarry)return;pCarry.visible=false;pCarry.parent.remove(pCarry);scene.add(pCarry);pCarry.scale.setScalar(1);pCarry=null}
// people helpers
const kman=()=>KIOSKMAN.g.position;
const COPY={kiosk:['רק להסתכל! לא לגעת!','...מי אמר את זה?! אה, התוכי. שוב.'],jog:['עוד קילומטר! אתה איתי?','התוכי מחקה אותי?! ...אני באמת נשמע ככה?'],bench:['פעם הכל היה זול יותר','חחח! עכשיו גם התוכי מתלונן על המחירים'],stroll:['שששש... התינוק ישן','שששש!!! ...אוי, התוכי העיר את פיצי'],
 dani:['מה... קורה... פה','חחח! תוכי, אתה מושלם'],dad:['אבא קירח! אבא קירח!','מי לימד אותו את זה?! דני!!!'],nb:['עוד שיפוד?','חחח התוכי רוצה קבב'],
 tv:['📺 *קליק* ...ערוץ הבישול!','מי שינה לי את הערוץ?!']};
function visitPeople(list){PM.v=list.map(v=>({...v,done:false}))}
function visitNext(){return PM.v&&PM.v.find(v=>!v.done)}
// ---------- missions ----------
const STREET_RINGS=[[12,2.2,-2],[16,3,4],[12.5,4,10],[9,3.2,16],[13,4.6,22],[17,3.4,28],[12,5,34],[8.5,4.2,40]];
const RACE_RINGS=[[13,2,-6],[17.5,3.5,0],[9,5,5],[17,2.5,10],[10,6,15],[15,3,20],[8.4,5.5,25],[18,4,30],[11,2.4,36],[15,6,42]];
const P_MISSIONS=[
 {t:'טיסת בכורה',icon:'🪶',sub:'לעבור 8 טבעות',par:50,intro:'🪶 החזק קפיצה כדי לנפנף ולעלות. עבור בכל הטבעות!',start:[11,0,-6],
  setup:()=>ringsSet(STREET_RINGS),done:()=>ringsUpdate(),hint:()=>'🪶 טבעת '+(PM.k+1)+'/8 · החזק קפיצה = לעלות',target:()=>RINGS[PM.k]&&RINGS[PM.k].position},
 {t:'שוד הבמבה',icon:'🥜',sub:'במבה מהמכולת למרפסת',par:45,intro:'🥜 תגנוב במבה מהמכולת ותביא אותה למרפסת שלך',start:[10,0,12],
  setup:()=>{itemGive('bamba',23.2,.25,2.4)},update:dt=>{if(pCarry&&Math.random()<dt*.5)sayText(PEOPLE[4].b,pick(['גנב!!! תוכי גנב!!!','תחזיר את הבמבה, ציפור!!!','אני אתקשר לווטרינר!!!']),1.6,'say',true)},
  done:()=>{if(!pCarry&&PM.item&&pDist(PM.item.position)<1.1)itemTake();return pCarry&&pXZ(PERCH)<1.6&&jumpY>2.6},hint:()=>pCarry?'🏠 למרפסת שלך (מעל המדרכה)':'🥜 הבמבה על המדף במכולת',target:()=>pCarry?PERCH:PM.item.position,end:()=>{itemDrop();pSay('😋 במבה של ניצחון',2)}},
 {t:'החקיין',icon:'🗣️',sub:'לחקות 4 אנשים',par:60,intro:'🗣️ תעוף ליד 4 אנשים ברחוב ותחקה אותם',start:[10,0,20],
  setup:()=>visitPeople([{id:'kiosk',g:()=>KIOSKMAN.g.position,b:()=>PEOPLE[4].b},{id:'jog',g:()=>JOGGER.g.position,b:()=>PEOPLE[0].b},{id:'bench',g:()=>OLDMAN.g.position,b:()=>PEOPLE[2].b},{id:'stroll',g:()=>MOM.g.position,b:()=>PEOPLE[3].b}]),
  act:()=>{const v=PM.v.find(v=>!v.done&&pXZ(v.g())<2.6);return v?{i:'🗣️',l:'לחקות',on:1,fn:()=>{v.done=true;pSay(COPY[v.id][0],2);setTimeout(()=>sayText(v.b(),COPY[v.id][1],2.4,'say',true),900);addScore(200,'חיקוי!')}}:null},
  done:()=>!visitNext(),hint:()=>'🗣️ חיקויים '+PM.v.filter(v=>v.done).length+'/4 · תעוף ליד מישהו ולחץ "לחקות"',target:()=>{const v=visitNext();return v&&v.g()}},
 {t:'להרגיז חתולים',icon:'🐈',sub:'לרחף מעל 3 חתולים',par:45,intro:'🐈 תרחף מעל כל חתול 2 שניות. נמוך מדי? הוא יחבוט בך!',start:[12,0,6],
  setup:()=>{PM.cats=SCATS.map(()=>0);PM.ouch=0},update:dt=>{SCATS.forEach((c,i)=>{if(PM.cats[i]>=2)return;const p=c.g.position;const d=pXZ(p);if(d<1.3){const a=jumpY-(p.y||0);if(a<.9){PM.ouch=(PM.ouch||0)+dt;if(PM.ouch>.6){PM.ouch=0;velocityY=4;pSay(pick(['🪶 איי! הנוצה!','😵 חתול!!!']),1.2);PM.feathers=(PM.feathers||0)+1;for(let k=0;k<6;k++)emit(pos.x,jumpY+.5,pos.z,(Math.random()-.5)*2,1,(Math.random()-.5)*2,'foam',.8)}}
   else if(a<3){PM.cats[i]+=dt;holdShow('catHold',PM.cats[i],2);if(PM.cats[i]>=2){addScore(250,'חתול מעוצבן!');pSay(pick(['😝 מיאו מיאו!','🦜 חתול טיפש!','😜 לא תופס!']),1.4)}}}})},
  done:()=>PM.cats.every(v=>v>=2),hint:()=>'🐈 חתולים '+PM.cats.filter(v=>v>=2).length+'/3 · לרחף בגובה בינוני',target:()=>{const i=PM.cats.findIndex(v=>v<2);return i<0?null:SCATS[i].g.position},stars:()=>!PM.feathers?3:PM.feathers<3?2:1},
 {t:'משלוח פיצה',icon:'🍕',sub:'משולש פיצה למילקי',par:70,intro:'🍕 מילקי רעב בחצר. תגנוב משולש מהפיצרייה ותביא לו',start:[12,0,20],
  setup:()=>{itemGive('slice',PCOUNTER.x,1.15,PCOUNTER.z-1);NM.g.visible=true;NM.g.position.set(1.5,0,-14);PM.nmWait=true},
  update:dt=>{NM.g.rotation.y=Math.atan2(pos.x-NM.g.position.x,pos.z-NM.g.position.z);nmAnim(0,dt);if(Math.random()<dt*.15)nmSay(pick(['🥺 רעב...','🍕?','🐕 וואף!']),1.4);if(pCarry&&Math.random()<dt*.3)sayText(chefB,'הציפור לקחה משולש!!! מאמא מיה!!!',1.8,'say',true)},
  done:()=>{if(!pCarry&&PM.item&&pDist(PM.item.position)<1.1)itemTake();return pCarry&&pXZ(NM.g.position)<1.6&&jumpY<2.6},hint:()=>pCarry?'🐕 תביא למילקי בחצר':'🍕 הפיצה על הדלפק בפיצרייה',target:()=>pCarry?NM.g.position:PM.item.position,
  end:()=>{itemDrop();nmSay('😋❤️ תודה קוקו!',2.2)}},
 {t:'מלחמת ערוצים',icon:'📺',sub:'בתוך הבית',par:60,intro:'📺 תיכנס הביתה: תחליף ערוץ, תחקה את דני ותגיד לאבא משהו "נחמד"',start:[0,0,-6],
  setup:()=>{tvOn=false;tvGlow.material.opacity=0;visitPeople([{id:'tv',g:()=>{const r=extras.find(p=>p.kind==='remote');return r.g.position},b:()=>dadB},{id:'dani',g:()=>dani.position,b:()=>daniB},{id:'dad',g:()=>dad.position,b:()=>dadB}])},
  act:()=>{const v=PM.v.find(v=>!v.done&&pXZ(v.g())<2.4);return v?{i:v.id==='tv'?'📺':'🗣️',l:v.id==='tv'?'לנקר בשלט':'לחקות',on:1,fn:()=>{v.done=true;if(v.id==='tv'){toggleTelevision();if(!tvOn)toggleTelevision()}pSay(COPY[v.id][0],2);setTimeout(()=>sayText(v.b(),COPY[v.id][1],2.4,'say',true),900);addScore(200,'בלגן!')}}:null},
  done:()=>!visitNext(),hint:()=>{const v=visitNext();return v?(v.id==='tv'?'📺 השלט בסלון':v.id==='dani'?'🗣️ תמצא את דני':'🗣️ תגיד לאבא משהו "נחמד"'):''},target:()=>{const v=visitNext();return v&&v.g()}},
 {t:'מרוץ עם היונים',icon:'🏁',sub:'10 טבעות ב־50 שניות',par:32,limit:50,intro:'🏁 היונים מתערבות שאתה איטי. 10 טבעות לפני שנגמר הזמן!',start:[13,0,-8],
  setup:()=>ringsSet(RACE_RINGS),done:()=>ringsUpdate(),hint:()=>'🏁 טבעת '+(PM.k+1)+'/10',target:()=>RINGS[PM.k]&&RINGS[PM.k].position},
 {t:'שוד הקבב',icon:'🍢',sub:'מהמנגל למרפסת',par:55,limit:80,intro:'🍢 השכן צולה קבב בחצר. תגנוב שיפוד ותביא למרפסת שלך!',start:[0,0,-20],
  setup:()=>{itemGive('kebab',kebabHome.x,kebabHome.y+.15,kebabHome.z)},update:dt=>{if(pCarry&&Math.random()<dt*.5)sayText(nbB,pick(['השיפוד שלי!!!','תוכי!!! תחזיר!!!','זה היה של מילקי!']),1.6,'say',true)},
  done:()=>{if(!pCarry&&PM.item&&pDist(PM.item.position)<1.2)itemTake();return pCarry&&pXZ(PERCH)<1.6&&jumpY>2.6},hint:()=>pCarry?'🏠 למרפסת שלך ברחוב':'🍢 השיפוד על המנגל בחצר',target:()=>pCarry?PERCH:PM.item.position,end:()=>{itemDrop();pSay('😋 קבב של תוכים!',2)}},
 {t:'מילקי הלך לאיבוד',icon:'🐕',sub:'להוביל אותו הביתה',par:60,intro:'🐕 מילקי נתקע בקצה החצר ומפחד. תעוף לידו, הוא ילך אחריך הביתה לסלון',start:[0,0,-12],
  setup:()=>{NM.g.visible=true;NM.g.position.set(-16,0,-37);NM.nav.path=[];PM.follow=false},
  update:dt=>{const d=pXZ(NM.g.position);const p0=NM.g.position.clone();if(d<5){if(!PM.follow){PM.follow=true;nmSay('🐕 קוקו! חכה לי!',1.6)}nmGo(pos.x,pos.z,3,dt,1.4)}else if(PM.follow&&d>9){PM.follow=false;nmSay('🥺 קוקו?',1.4)}nmAnim(NM.g.position.distanceTo(p0),dt)},
  done:()=>Math.hypot(NM.g.position.x-1,NM.g.position.z+2)<2.4,hint:()=>PM.follow?'🐕 הוא אחריך! הביתה, לסלון':'🐕 מילקי בפינה הרחוקה של החצר',target:()=>PM.follow?p3(1,0,-2):NM.g.position,end:()=>{nmSay('❤️ הביתה!',2)}},
 {t:'הקונצרט',icon:'🎤',sub:'לשיר לכל המשפחה',par:90,intro:'🎤 ערב גדול: תשיר לאבא, לדני, למילקי ולשכן, ואז קידה על המרפסת',start:[0,0,-6],
  setup:()=>{NM.g.visible=true;NM.g.position.set(-1.5,0,-12);visitPeople([{id:'dad',g:()=>dad.position,b:()=>dadB,song:'🎵 אבא אבא, הכי טוב בעולם 🎵',re:'...טוב. זה היה יפה. אבל אני עדיין לא קירח.'},{id:'dani',g:()=>dani.position,b:()=>daniB,song:'🎵 דני דני, מבשל לנו פיצה 🎵',re:'חחח! תוכי, תעשה הדרן!'},{id:'milky',g:()=>NM.g.position,b:()=>NM.b,song:'🎵 מילקי מילקי, ברדק אחולמניוקי 🎵',re:'🐕🎶 אוווווו!'},{id:'nb',g:()=>neighbor.g.position,b:()=>nbB,song:'🎵 שכן שכן, קבב על האש 🎵',re:'בראבו! קח שיפוד... רגע, כבר לקחת.'}])},
  update:dt=>{if(NM.g.visible){NM.g.rotation.y=Math.atan2(pos.x-NM.g.position.x,pos.z-NM.g.position.z);nmAnim(0,dt)}},
  act:()=>{const v=PM.v.find(v=>!v.done&&pXZ(v.g())<2.6);return v?{i:'🎤',l:'לשיר',on:1,fn:()=>{v.done=true;pSay(v.song,2.4);for(let k=0;k<6;k++)emit(pos.x,jumpY+1,pos.z,(Math.random()-.5),1.4,(Math.random()-.5),'foam',1);setTimeout(()=>sayText(v.b(),v.re,2.4,'say',true),1200);addScore(300,'שיר!')}}:null},
  done:()=>!visitNext()&&pXZ(PERCH)<1.6&&jumpY>2.6,hint:()=>visitNext()?'🎤 שירים '+PM.v.filter(v=>v.done).length+'/4':'🙇 קידה על המרפסת שלך!',target:()=>{const v=visitNext();return v?v.g():PERCH},
  end:()=>{pSay('🙇 תודה! תודה! אני כאן כל ערב!',2.6);speakDad('טוב... התוכי הזה בסדר.')}}
];
Object.assign(_holdLabels,{catHold:'🐈 מעצבן את החתול...'});
function parrotFrame(dt){dog.visible=false;PP.visible=true;parrot.visible=false;
 PP.position.set(pos.x,Math.max(0,jumpY),pos.z);const air=!grounded;
 PP.rotation.set(0,yaw,0);PPb.rotation.z+=((air?-THREE.MathUtils.clamp(yawVel*.25,-.6,.6):0)-PPb.rotation.z)*Math.min(1,dt*6);PPb.rotation.x+=((air?THREE.MathUtils.clamp(lastDogSpeed/10,0,.45)-velocityY*.05:0)-PPb.rotation.x)*Math.min(1,dt*6);
 const climb=air&&keys.Space;pWing+=dt*(climb?26:air?(velocityY<-.5?6:14):0);const a=air?(climb?Math.sin(pWing)*1.1:velocityY<-.5?.5+Math.sin(pWing)*.12:Math.sin(pWing)*.7):-.15;
 PP.wings.forEach((w,i)=>w.rotation.z=(i?-1:1)*a);PP.tail.rotation.x=air?-.15:.35;PP.feet.forEach(f=>f.visible=!air||jumpY<.6);
 if(!air&&lastDogSpeed>.3)PPb.position.y=Math.abs(Math.sin(performance.now()/90))*.08;else PPb.position.y*=.8;
 PP.head.rotation.y=Math.sin(performance.now()/700)*.25}
function pMax(){const x=pos.x,z=pos.z;if(x>20)return 2.4;if(x>-6.8&&x<6.8&&z>-9&&z<16.2)return 2.3;return 7.5}
function parrotMissionStart(i){PM.i=i;PM.m=P_MISSIONS[i];PM.t=0;PM.over=false;PM.k=0;PM.rings=null;PM.v=null;PM.item=null;PM.feathers=0;PM.cats=null;PM.follow=false;PM.ouch=0;NM.g.visible=false;itemDrop();for(const it of Object.values(ITEMS))it.visible=false;RINGS.forEach(r=>r.visible=false);
 document.querySelector('#overlay').style.display='none';setParrotPlay(true);startGame();const s=PM.m.start;pos.set(s[0],0,s[2]);jumpY=0;velocityY=0;grounded=true;yaw=0;camYaw=0;
 showBanner(PM.m.intro);PM.m.setup()}
function parrotMissionEnd(win){if(PM.over)return;PM.over=true;evtPill.hidden=true;const m=PM.m;if(m.end)m.end();RINGS.forEach(r=>r.visible=false);
 const t=PM.t,st=win?(m.stars?Math.min(m.stars(),t<=m.par?3:t<=m.par*1.8?2:1):(t<=m.par?3:t<=m.par*1.8?2:1)):0;
 setTimeout(()=>epFinish(win,st,win?['⏱️ '+fmtTime(t)+' (ל־3 כוכבים: עד '+fmtTime(m.par)+')','⭐ ניקוד '+score.toLocaleString('he-IL')]:['⏰ נגמר הזמן'],win?m.icon+' '+m.t+' — הצלחה!':'🦜 כמעט! עוד ניסיון?'),win?1500:900);
 if(win&&window.JUICE_READY){slowMo(.5);pow('קוקו!!!',pos.x,jumpY+2,pos.z,true)}}
function updateParrotMission(dt){if(!PM.m||PM.over)return;PM.t+=dt;const m=PM.m;NM.stun=Math.max(0,NM.stun-dt);if(m.update)m.update(dt);
 evtPill.hidden=false;const l=m.icon+' '+(PM.i+1)+'/10: '+m.t+(m.limit?' · '+Math.max(0,Math.ceil(m.limit-PM.t)):'');if(evtPill.textContent!==l)evtPill.textContent=l;
 if(m.done())return parrotMissionEnd(true);if(m.limit&&PM.t>=m.limit)parrotMissionEnd(false)}
function setParrotPlay(on){if(on===PARP&&on)return;
 if(on){if(window.DADP)setDadPlay(false);if(HUMAN){HUMAN=false;hApply(false)}if(ZOMBIE){ZOMBIE=false;zApply(false)}if(DETECT){DETECT=false;dApply(false)}PARP=true;window.PARP=true;OPEN_WORLD=true;document.body.classList.add('openWorld');reset();owApply();PP.visible=true;parrot.visible=false}
 else{PARP=false;window.PARP=false;PM.m=null;itemDrop();PP.visible=false;parrot.visible=true;dog.visible=true;NM.g.visible=false;NM.g.position.set(0,0,-80);RINGS.forEach(r=>r.visible=false);for(const it of Object.values(ITEMS))it.visible=false;evtPill.hidden=true}
 document.body.classList.toggle('parPlay',PARP);{const jb=document.getElementById('jumpBtn');if(jb){jb.querySelector('b').textContent=PARP?'🪶':'🐾';jb.querySelector('small').textContent=PARP?'לנפנף':'קפיצה'}}if(typeof charLabel==='function')charLabel()}
epRegister({id:'parrot',icon:'🦜',title:'קוקו התוכי: 10 משימות',reward:'לפתוח את קוקו בעולם הפתוח',rewardDone:'קוקו נפתח! בעולם הפתוח לוחצים 🔄 כדי להחליף דמות',
 levels:P_MISSIONS.map((m,i)=>({id:'p'+(i+1),title:m.t,icon:m.icon,sub:m.sub})),start:parrotMissionStart,quit:()=>setParrotPlay(false)});
CHARS.push({id:'parrot',icon:'🦜',name:'קוקו',ok:()=>epComplete('parrot'),active:()=>PARP,on:()=>{setParrotPlay(true);PM.m=null},off:()=>setParrotPlay(false),hello:'🦜 עכשיו אתה קוקו! החזק קפיצה כדי לעוף · 🗣️ לצרוח'});
WORLDS.push({icon:'🦜',name:'קוקו התוכי',col:'#9fe0a0',sub:()=>epComplete('parrot')?'✔ פתוח בעולם הפתוח · ⭐ '+epStars('parrot')+'/30':'10 משימות · ⭐ '+epStars('parrot')+'/30',go:()=>epBoard('parrot')});if(typeof universeRender==='function')universeRender();
// buttons
CTX_HOOKS.act.unshift(()=>{if(!PARP)return null;const h=PM.m&&!PM.over&&PM.m.act&&PM.m.act();if(h)return h;
 return {i:'🗣️',l:'לצרוח',on:1,fn:()=>{pSay(pick(PARROT_LINES),2);try{playToySound(900+Math.random()*300,.06,'square')}catch(_){}}}});
CTX_HOOKS.grab.unshift(()=>{if(!PARP)return null;if(pCarry)return {i:'⬇️',l:'לשחרר',on:1,fn:()=>{const it=pCarry;itemDrop();it.visible=true;it.position.set(pos.x,Math.max(.15,jumpY),pos.z);PM.item=it}};
 if(PM.item&&PM.item.visible&&pDist(PM.item.position)<1.6)return {i:'🦜',l:'לחטוף',on:1,fn:itemTake};return {i:'🪶',l:'לעוף ↑',on:1,fn:()=>{velocityY=5;grounded=false}}});
// hooks
const _bub6=sayText;sayText=function(b,text,dur,kind,force){if(PARP&&b===milkyB)b=pB;return _bub6(b,text,dur,kind,force)};
const _thd6=thought;thought=function(b,e,d,f){if(PARP&&b===milkyB)b=pB;return _thd6(b,e,d,f)};
const _nth6=nextTaskHint;nextTaskHint=function(){if(!PARP)return _nth6();if(PM.m&&!PM.over)return PM.m.hint();return '🦜 קוקו · החזק קפיצה = לעוף · 🗣️ לצרוח'};
const _ct6=currentTarget;currentTarget=function(){if(!PARP)return _ct6();if(!guideOn||!PM.m||PM.over)return null;const p=PM.m.target&&PM.m.target();return p&&pXZ(p)>1.5?p:null};
const _uow6=updateOpenWorld;updateOpenWorld=function(dt){if(!PARP)return _uow6(dt);swapRefresh();if(!day.finished)owApply();for(const s of Object.values(OW_MARKS))s.visible=false;
 parrotFrame(dt);if(PM.m)updateParrotMission(dt);else{const p0=NM.g.position.clone();}};
for(const id of ['start','startOpen','startZombie','startHuman','startDetective','modeSwitch','zSwitch'])document.getElementById(id).addEventListener('click',()=>{if(PARP)setParrotPlay(false)},true);
document.getElementById('menuBtn').addEventListener('click',()=>{if(PARP&&PM.m)setParrotPlay(false)});
window.addEventListener('keydown',e=>{if(PARP&&['KeyQ','KeyR','KeyX','KeyF','KeyT','KeyP','KeyH'].includes(e.code))e.stopImmediatePropagation()},true);
window.PM=PM;window.PAR_READY=true;
