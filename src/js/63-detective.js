// ===== Detective Milky: trench coat, magnifying glass, a water gun, simple mysteries for the neighbourhood, and intruder defense =====
var DETECT=false;try{DETECT=localStorage.getItem('milky-mode')==='detective'}catch(_){}
function dogHead(h){const tan=mat(0xd9a867,.9),fur=mat(0xf4f0e8,.9);const cap=ball(.345,tan,0,.08,-.04,h);cap.scale.set(1,.75,1);const bl=ball(.12,fur,0,.12,.25,h);bl.scale.set(.5,1.3,.5);
 const mz=ball(.17,fur,0,-.12,.36,h);mz.scale.set(.85,.7,1.3);ball(.065,mat(0x1c1a1a,.5),0,-.06,.58,h);for(const s of [-1,1]){const e=ball(.14,tan,s*.33,.12,-.02,h);e.scale.set(.45,1.1,.35);e.rotation.z=-s*.9}}
const DM=makePerson({skin:0xf4f0e8,shirt:0xb59a6a,pants:0x5a4a3a,shoes:0x3a2a1a,hair:h=>{dogHead(h);const fm=mat(0x6b4a2a,.7);cyl(.4,.04,fm,0,.32,-.02,h);const c=cyl(.24,.24,fm,0,.45,-.02,h);cyl(.245,.05,mat(0x2a1a0a),0,.37,-.02,h)}});
DM.g.visible=false;DM.g.scale.setScalar(.88);
{const coat=mat(0xb59a6a,.85);const sk=mesh(new THREE.CylinderGeometry(.44,.56,.8,12,1,true),coat,0,.95,0,DM.g);sk.material.side=THREE.DoubleSide;box(.84,.1,.48,mat(0x6b4a2a),0,1.3,0,DM.g);box(.12,.12,.04,mat(0xf2c14e),0,1.3,.25,DM.g);
 for(const s of [-1,1]){const l=box(.2,.5,.03,coat,s*.17,1.95,.235,DM.g);l.rotation.z=s*.25}
 const tl=new THREE.Group();tl.position.set(0,1.1,-.3);DM.g.add(tl);let p=tl;for(let i=0;i<5;i++){const sg=new THREE.Group();sg.position.y=i?.12:0;sg.rotation.x=-.35;p.add(sg);ball(.045,mat(0xf4f0e8,.9),0,.06,0,sg);p=sg}DM.tail=tl}
const magG=new THREE.Group();DM.arms[0].add(magG);magG.position.set(0,-.82,.16);{const r=mesh(new THREE.TorusGeometry(.11,.02,8,18),mat(0x6b4a2a),0,.12,0,magG);ball(.1,new THREE.MeshStandardMaterial({color:0xcfe9ff,transparent:true,opacity:.45,roughness:.05}),0,.12,0,magG).scale.set(1,1,.15);cyl(.022,.18,mat(0x3a2a1a),0,-.06,0,magG)}
const gunG=new THREE.Group();DM.arms[1].add(gunG);gunG.position.set(0,-.84,.2);{box(.12,.14,.42,mat(0xff7a1a,.5),0,0,.08,gunG);cyl(.1,.16,mat(0x3a7bd5,.4),0,.14,-.02,gunG);const n=cyl(.03,.18,mat(0x3a7bd5,.4),0,0,.35,gunG);n.rotation.x=Math.PI/2;box(.07,.16,.08,mat(0xff7a1a,.5),0,-.12,-.05,gunG)}
const dmB=makeBubble(DM.head,.75);
function detRig(dt){DM.g.visible=true;HM.g.visible=false;dog.visible=false;
 DM.g.position.set(pos.x,Math.max(0,jumpY),pos.z);if(rag.active){DM.g.quaternion.copy(dog.quaternion);DM.g.position.y=Math.max(0,rag.y)}else DM.g.rotation.set(0,yaw,0);
 const sp=lastDogSpeed,shooting=ds.shootT>0;animatePerson(DM,grounded&&!rag.active?sp*dt*.85:0,dt,{run:sp>4,arm:i=>i===1?(shooting||ds.defense?-1.45:-.2):(ds.lookT>0?-1.6:-.15)});
 if(!grounded&&!rag.active)DM.legs.forEach((l,i)=>l.rotation.x=i?-.6:.4);const t=performance.now()/1000;DM.tail.rotation.z=Math.sin(t*(sp>.5?14:6))*.5;DM.head.rotation.x=ds.lookT>0?.35:0;updateFace(DM.face,ds.lookT>0?'focus':sp>4?'laugh':'smug',dt)}
const _hr=humanRig;humanRig=function(dt){if(DETECT){detRig(dt);return}DM.g.visible=false;_hr(dt)};
const _say2=sayText;sayText=function(b,text,dur,kind,force){if(DETECT&&(b===milkyB||b===hmB))b=dmB;return _say2(b,text,dur,kind,force)};
const _th2=thought;thought=function(b,e,d,f){if(DETECT&&(b===milkyB||b===hmB))b=dmB;return _th2(b,e,d,f)};
// ---------- clue sprites ----------
const clueTex=(()=>{const cv=document.createElement('canvas');cv.width=cv.height=128;const g=cv.getContext('2d');g.fillStyle='#fff3d6';g.beginPath();g.arc(64,64,54,0,6.3);g.fill();g.lineWidth=8;g.strokeStyle='#5a3a12';g.stroke();g.font='70px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillText('🔍',64,68);return new THREE.CanvasTexture(cv)})();
const clueMat=new THREE.SpriteMaterial({map:clueTex,depthWrite:false,toneMapped:false,fog:false});
const CLUE_SPR=[];for(let i=0;i<6;i++){const s=new THREE.Sprite(clueMat);s.scale.set(.6,.6,.6);s.visible=false;s.renderOrder=3;scene.add(s);CLUE_SPR.push(s)}
// small props for evidence
const prints=new THREE.Group();scene.add(prints);for(let i=0;i<6;i++){const p=cyl(.06,.01,decal(mat(0x5b4130)),0,.03,0,prints);p.position.set(Math.sin(i*1.3)*.15+i*.0,.03,i*.32)}prints.visible=false;
const furTuft=new THREE.Group();scene.add(furTuft);for(let i=0;i<4;i++)ball(.05,mat(0xd98a3a),(i-1.5)*.05,0,0,furTuft);furTuft.visible=false;
const crumbs=new THREE.Group();scene.add(crumbs);for(let i=0;i<12;i++)box(.05,.03,.05,mat(0xf2c14e),(Math.random()-.5)*.5,.02,i*.35,crumbs);crumbs.visible=false;
const whiteFur=new THREE.Group();scene.add(whiteFur);for(let i=0;i<4;i++)ball(.04,mat(0xf7f4ee),(i-1.5)*.05,0,0,whiteFur);whiteFur.visible=false;
const bambaEmpty=new THREE.Group();scene.add(bambaEmpty);{const b=box(.3,.06,.4,mat(0xf2c14e,.6),0,.03,0,bambaEmpty);b.rotation.y=.4}bambaEmpty.visible=false;
// ---------- the cases ----------
const ds={caseI:0,phase:'',found:new Set(),lookT:0,shootT:0,shootCool:0,defense:false,wrong:0,t0:0};
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const CASES=[
 {id:'slipper',title:'תיק מס׳ 1: הכפכף שנעלם',client:'dad',
  noir:'🌙 הלילה היה קר. הכפכף נעלם. ורק מישהו אחד ידע למה...',
  open:()=>{slipper.position.set(4.2,.05,-39.2);slipperState='hidden';prints.position.set(slipperHome.x,0,slipperHome.z+.4);prints.rotation.y=Math.PI;prints.visible=true;furTuft.position.set(4.6,1.2,-39.9);furTuft.visible=true;
   speakDad('בלש מילקי! הכפכף שלי נעלם! ...ואני לא חושד בך הפעם. הפעם.')},
  clues:[
   {id:'prints',pos:()=>V3(slipperHome.x,0,slipperHome.z+1),label:'👣 עקבות קטנות ליד המקום של הכפכף',note:'קטנות מדי לכלב גדול... ומישהו היה יחף'},
   {id:'fur',pos:()=>V3(4.4,0,-39.0),label:'🧡 פרווה כתומה על הגדר, והכפכף מתחתיה!',note:'כתום... כמו מישהו שאוהב לשבת על הגדר'},
   {id:'parrot',witness:true,pos:()=>V3(9,0,26),who:()=>parrotB,line:'הכפכף! הכפכף! מיאו! מיאו!',label:'🦜 התוכי: "הכפכף! הכפכף! מיאו!"',note:'התוכי רק מחקה... אבל ממי הוא שמע "מיאו"?'},
   {id:'guard',witness:true,pos:()=>V3(19.2,0,42.2),who:()=>GUARD.b,line:'גררר... הייתי פה כל הלילה מאחורי הגדר! תשאל את הפח!',label:'🐕 בולדוזר: "הייתי מאחורי הגדר כל הלילה"',note:'אליבי חזק. הגדר נעולה.'}],
  suspects:[{n:'🦜 התוכי',wrong:'אני?! אני רק חוזר על מה שאני שומע! הכפכף! הכפכף!'},{n:'🐈 החתול הכתום מהגדר',ok:true},{n:'🐕 בולדוזר',wrong:'גררר... אמרתי לך! הייתי נעול!'}],
  reveal:()=>{sayText(catB,'מיאו... היה לי קר ברגליים 😼',2.6,'say',true);slipperState='floor';slipper.position.copy(slipperHome);slipper.rotation.set(0,0,0);setTimeout(()=>speakDad('חתול גנב! ...תודה, בלש מילקי. אתה הכי טוב בעיר.'),1400)}},
 {id:'bamba',title:'תיק מס׳ 2: שוד הבמבה',client:'kiosk',
  noir:'🌙 העיר ישנה. המכולת לא. מישהו גנב במבה... ואני מתכוון לגלות מי.',
  open:()=>{sayText(PEOPLE[4].b,'בלש! מישהו גנב במבה! ואני חושד... בך!',2.6,'say',true);crumbs.position.set(8.6,0,24);crumbs.visible=true;whiteFur.position.set(19.2,.3,5.8);whiteFur.visible=true;bambaEmpty.position.set(8.4,0,30.5);bambaEmpty.visible=true},
  clues:[
   {id:'crumbs',pos:()=>V3(8.6,0,25.5),label:'🟡 שביל פירורי במבה על המדרכה',note:'השביל הולך לאורך המדרכה... בקצב של עגלה?'},
   {id:'whitefur',pos:()=>V3(19.0,0,5.8),label:'🤍 פרווה לבנה קטנטנה ליד דלת המכולת',note:'לבנה ורכה. לא שלי. אני חום-לבן, ויותר גבוה.'},
   {id:'empty',pos:()=>V3(8.4,0,30.5),label:'🛍️ שקית במבה ריקה ליד המסלול של העגלה',note:'ריקה לגמרי. מישהו קטן ורעב מאוד.'},
   {id:'oldman',witness:true,pos:()=>V3(BENCH.x+1,0,BENCH.z),who:()=>PEOPLE[2].b,line:'היונים? הן אוכלות רק גרעינים. אבל ראיתי עגלה עוברת... וריח של במבה!',label:'👴 הזקן: "היונים אוכלות רק גרעינים. ראיתי עגלה..."',note:'עגלה. ותינוק שלא באמת תינוק.'}],
  suspects:[{n:'🕊️ היונים',wrong:'קוקוקו... (היונים נעלבו ועפו)'},{n:'🐕 מילקי (אני?!)',wrong:'רגע... אתה מאשים את עצמך?! טוב, זה כן נשמע כמוך'},{n:'🐶 פיצי מהעגלה',ok:true}],
  reveal:()=>{sayText(PEOPLE[3].b,'פיצי!!! שוב?! אמרתי לך בלי במבה!',2.6,'say',true);setTimeout(()=>sayText(PEOPLE[4].b,'כלב בעגלה... גנב במבה... ראיתי הכל בחיים',2.4,'say',true),1400)}},
 {id:'defense',title:'תיק מס׳ 3: הפלישה',defense:true,
  noir:'🌙 הם באו בלילה. דביבונים. עם מסכות. והם רוצים את הנקניקיות של אבא.'}
];
function dCase(){return CASES[ds.caseI%CASES.length]}
function dPill(){const c=dCase();evtPill.hidden=false;let l;if(c.defense)l='🦝 גל '+dv.wave+'/3 · נגנבו '+dv.stolen+'/5';else l='🔍 '+c.title.split(':')[1].trim()+' · רמזים '+ds.found.size+'/'+c.clues.length;if(evtPill.textContent!==l)evtPill.textContent=l}
function dHideEvidence(){for(const g of [prints,furTuft,crumbs,whiteFur,bambaEmpty])g.visible=false;CLUE_SPR.forEach(s=>s.visible=false)}
function dStartCase(){const c=dCase();ds.found.clear();ds.phase='investigate';ds.wrong=0;ds.t0=performance.now();dHideEvidence();ds.defense=!!c.defense;gunG.visible=true;
 showBanner(c.noir);setTimeout(()=>{if(!DETECT)return;showBanner('🕵️ '+c.title);if(c.defense)dvStart();else c.open()},3400)}
function dInspect(cl){if(ds.found.has(cl.id))return;ds.found.add(cl.id);ds.lookT=1.6;addScore(150,'רמז!');
 if(cl.witness){sayText(cl.who(),cl.line,3,'say',true);setTimeout(()=>sayText(dmB,'🤔 '+cl.note,2.6,'think',true),1500)}else sayText(dmB,'🔍 '+cl.note,2.8,'think',true);
 addActivity('🔍 '+cl.label);if(window.JUICE_READY)pow('🔍 רמז!',pos.x,2.6,pos.z);
 if(ds.found.size>=dCase().clues.length){setTimeout(()=>{if(DETECT){showBanner('🕵️ יש לי מספיק רמזים. הגיע הזמן להאשים!');sayText(dmB,'🕵️ אני יודע מי עשה את זה.',2.4,'say',true)}},2400)}}
function dAccuse(){const c=dCase();document.getElementById('dAccTitle').textContent=c.title+': מי עשה את זה?';const cl=document.getElementById('dClues');cl.innerHTML='';
 for(const x of c.clues){const d=document.createElement('div');d.textContent=(ds.found.has(x.id)?'✔ ':'❔ ')+(ds.found.has(x.id)?x.label:'רמז שעוד לא נמצא');cl.appendChild(d)}
 const sw=document.getElementById('dSuspects');sw.innerHTML='';for(const s of c.suspects){const b=document.createElement('button');b.type='button';b.textContent=s.n;b.addEventListener('click',()=>dGuess(s));sw.appendChild(b)}
 document.getElementById('dAccuse').hidden=false;started=false}
document.getElementById('dAccBack').addEventListener('click',()=>{document.getElementById('dAccuse').hidden=true;started=true});
function dGuess(s){document.getElementById('dAccuse').hidden=true;started=true;
 if(!s.ok){ds.wrong++;showBanner('❌ לא '+s.n);sayText(dmB,'😳 אופס...',1.6,'say',true);setTimeout(()=>showBanner(s.wrong),900);addActivity('❌ '+s.n+': "'+s.wrong+'"');return}
 const c=dCase();showBanner('✅ '+s.n+'! התיק נפתר!');if(window.JUICE_READY){slowMo(.6);punch(6);pow('נפתר!!',pos.x,2.8,pos.z,true)}addScore(1000-ds.wrong*200,'תיק נפתר!');c.reveal();dHideEvidence();evtPill.hidden=true;ds.phase='solved';
 setTimeout(()=>dEnd(true),3800)}
function dEnd(win,txt){const c=dCase();document.getElementById('dEndTitle').textContent=win?'📁 '+c.title+' — נסגר!':'🦝 הדביבונים ניצחו...';const st=document.getElementById('dEndStats');st.innerHTML='';
 const lines=c.defense?[win?'🛡️ הבית מוגן!':'🌭 הדביבונים גנבו את כל הנקניקיות','🦝 הברחת '+dv.kos+' פולשים','⭐ ניקוד '+score.toLocaleString('he-IL')]:['⏱️ '+fmtTime((performance.now()-ds.t0)/1000),'🔍 רמזים '+ds.found.size+'/'+c.clues.length,'❌ האשמות שגויות: '+ds.wrong,'⭐ ניקוד '+score.toLocaleString('he-IL')];
 for(const l of lines){const d=document.createElement('div');d.textContent=l;st.appendChild(d)}document.getElementById('dEndNext').textContent=win?'▶ לתיק הבא':'🔁 עוד פעם';document.getElementById('dEnd').hidden=false;ds.winLast=win}
document.getElementById('dEndNext').addEventListener('click',()=>{document.getElementById('dEnd').hidden=true;if(ds.winLast)ds.caseI++;dvReset();reset();owApply();dStartCase()});
document.getElementById('dEndQuit').addEventListener('click',()=>{setDetective(false);showBanner('🐕 מילקי חזר להיות כלב')});
// ---------- water gun ----------
function dShoot(){if(ds.shootCool>0)return;ds.shootCool=.28;ds.shootT=.35;try{playToySound(300+Math.random()*80,.06,'sine')}catch(_){}
 gunG.updateWorldMatrix(true,false);gunG.localToWorld(_gv.set(0,0,.5));const ox=_gv.x,oy=_gv.y,oz=_gv.z;
 for(let i=0;i<8;i++){const a=yaw+(Math.random()-.5)*.12;emit(ox,oy,oz,Math.sin(a)*(9+Math.random()*2),1+Math.random(),Math.cos(a)*(9+Math.random()*2),'water',.55)}
 const fx=Math.sin(yaw),fz=Math.cos(yaw);const inCone=(x,z,r=6)=>{const dx=x-pos.x,dz=z-pos.z,d=Math.hypot(dx,dz);return d<r&&d>.2&&(dx*fx+dz*fz)/d>.88};
 let hit=false;for(const r of dv.list){if(r.on&&!r.flee&&inCone(r.g.position.x,r.g.position.z)){dvHit(r);hit=true}}
 if(!hit){if(dad.visible&&inCone(dad.position.x,dad.position.z,4.5)){speakDad(pick(['מילקי!!! זה הטרנינג של הלייקרס!','רטוב! אני כולי רטוב!','אני לא פולש! אני אבא שלך!']));thought(dadB,'💦',1.6,true)}
  else if(inCone(dani.position.x,dani.position.z,4.5)){sayDani(pick(['מילקי!! התספורת שלי!','אני לא דביבון!!!']));thought(daniB,'💦',1.6,true)}
  else if(inCone(neighbor.g.position.x,neighbor.g.position.z,4.5)&&neighbor.g.visible){sayText(nbB,'היי! המנגל! כיבית לי את הגחלים!',2,'say',true)}}}
// ---------- intruder defense ----------
function makeRaccoon(){const g=new THREE.Group();scene.add(g);const gr=mat(0x7a7a80,.8),dk=mat(0x2a2a2e);const b=ball(.26,gr,0,.32,0,g);b.scale.set(.85,.75,1.25);
 const h=new THREE.Group();h.position.set(0,.45,.32);g.add(h);ball(.18,gr,0,0,0,h);box(.3,.08,.05,dk,0,.03,.15,h);ball(.07,mat(0xe8e8e8),0,-.06,.17,h);ball(.03,dk,0,-.04,.24,h);for(const s of [-1,1]){mesh(new THREE.ConeGeometry(.06,.1,4),gr,s*.11,.17,0,h);ball(.02,mat(0xffffff),s*.07,.04,.18,h)}
 const tl=new THREE.Group();tl.position.set(0,.35,-.32);g.add(tl);for(let i=0;i<4;i++){const s=cyl(.07,.12,i%2?dk:gr,0,0,-i*.11,tl);s.rotation.x=Math.PI/2}tl.rotation.x=.4;
 const legs=[];for(const [x,z] of [[.12,.18],[-.12,.18],[.12,-.18],[-.12,-.18]]){const p=new THREE.Group();p.position.set(x,.2,z);g.add(p);cyl(.04,.2,dk,0,-.1,0,p);legs.push(p)}
 const sack=box(.18,.18,.14,mat(0xc9a06a),0,.62,-.05,g);sack.visible=false;
 return {g,legs,tail:tl,sack,b:makeBubble(g,.9),nav:{path:[],repath:0,tx:0,tz:0,stuck:0,giveUp:0},on:false,flee:false,carry:false,walk:0}}
const dv={list:[],wave:0,stolen:0,kos:0,toSpawn:0,spawnT:0,breakT:0,over:false,burglar:null};
for(let i=0;i<8;i++){const r=makeRaccoon();r.g.visible=false;dv.list.push(r)}
const BURG=makePerson({skin:0xd2a07c,shirt:0x222222,pants:0x222222,hair:h=>{const m=ball(.36,mat(0x222222),0,.05,0,h);m.scale.set(1.02,1,1.02);box(.5,.1,.06,mat(0x111111),0,.06,.32,h);for(const s of [-1,1])ball(.05,mat(0xffffff),s*.12,.06,.34,h)}});
for(let i=0;i<4;i++)box(.82,.08,.46,mat(0xffffff),0,1.25+i*.25,0,BURG.g);BURG.g.visible=false;const burgB=makeBubble(BURG.g,3.05);
const burgSack=new THREE.Group();BURG.arms[1].add(burgSack);burgSack.position.set(0,-.9,0);ball(.35,mat(0xc9a06a),0,0,0,burgSack);
const D_SPAWN=[[-1.2,-8.0],[5.6,6.2],[-5.5,15.2],[5.5,-7.5]],FRIDGE_T={x:5.2,z:14.1};
function dvStart(){dv.wave=0;dv.stolen=0;dv.kos=0;dv.over=false;dv.breakT=2;dv.toSpawn=0;speakDad('מילקי!!! דביבונים בבית!!! הם הולכים למקרר!!!');sayDani('תשפריץ עליהם! תשפריץ!!!')}
function dvReset(){dv.list.forEach(r=>{r.on=false;r.g.visible=false;r.sack.visible=false});BURG.g.visible=false;dv.burglar=null;dv.wave=0;dv.toSpawn=0;dv.over=false}
function dvSpawn(){const r=dv.list.find(r=>!r.on);if(!r)return;const p=pick(D_SPAWN.filter(p=>Math.hypot(p[0]-pos.x,p[1]-pos.z)>4));if(!p)return;r.on=true;r.flee=false;r.carry=false;r.sack.visible=false;r.g.visible=true;r.g.position.set(p[0],0,p[1]);r.nav.path=[];r.sp=1.6+dv.wave*.25+Math.random()*.4;r.home=p;sayText(r.b,pick(['הי הי הי 🦝','נקניקיות!!!','שקט... שקט...']),1.6,'say')}
function dvHit(r){r.flee=true;r.fleeT=2.5;dv.kos++;addScore(150,'שפריץ!');sayText(r.b,pick(['אייייי! רטוב!!!','מים?! אני שונא מים!!!','בורחיםםם!']),1.4,'say',true);if(window.JUICE_READY)pow('שפלאש!',r.g.position.x,1.2,r.g.position.z);if(r.carry){r.carry=false;r.sack.visible=false;addActivity('🌭 הנקניקייה הוצלה!')}}
function dvBurglar(){BURG.g.visible=true;BURG.g.position.set(5.6,0,6.2);BURG.nav.path=[];BURG.hp=4;dv.burglar=BURG;sayText(burgB,'שששש... באתי בשביל הכורסה 😎',2.4,'say',true);speakDad('הכורסה שלי!!! מילקי!!! תציל את הכורסה!!!')}
function updateDefense(dt){
 if(dv.over)return;const t=performance.now()/1000;
 if(dv.toSpawn>0){dv.spawnT-=dt;if(dv.spawnT<=0){dvSpawn();dv.toSpawn--;dv.spawnT=Math.max(.8,2-dv.wave*.3)}}
 else if(!dv.list.some(r=>r.on)&&!dv.burglar){dv.breakT-=dt;if(dv.breakT<=0){if(dv.wave>=3){dv.over=true;showBanner('🛡️ הבית מוגן! הפולשים ברחו!');evtPill.hidden=true;addScore(1500,'הגנה מושלמת!');speakDad('בלש מילקי! הצלת את הבית!');setTimeout(()=>dEnd(true),2500);return}
  dv.wave++;dv.toSpawn=2+dv.wave*2;dv.breakT=5;showBanner('🦝 גל '+dv.wave+'!');if(dv.wave===3)setTimeout(()=>{if(DETECT&&!dv.over)dvBurglar()},5000)}}
 for(const r of dv.list){if(!r.on)continue;const o=r.g.position;let tx,tz,sp=r.sp;
  if(r.flee){const h=r.home;tx=h[0];tz=h[1];sp=3.5;r.fleeT-=dt;if(r.fleeT<=0||Math.hypot(tx-o.x,tz-o.z)<.6){r.on=false;r.g.visible=false;continue}}
  else if(r.carry){tx=r.home[0];tz=r.home[1];if(Math.hypot(tx-o.x,tz-o.z)<.7){r.on=false;r.g.visible=false;dv.stolen++;addActivity('🌭 דביבון ברח עם נקניקייה! ('+dv.stolen+'/5)');if(dv.stolen>=5){dv.over=true;evtPill.hidden=true;showBanner('🦝 הדביבונים גנבו את כל הנקניקיות...');setTimeout(()=>dEnd(false),2000)}continue}}
  else{tx=FRIDGE_T.x;tz=FRIDGE_T.z;if(Math.hypot(tx-o.x,tz-o.z)<.8){r.carry=true;r.sack.visible=true;sayText(r.b,'יש!!! נקניקייה!!! 🌭',1.4,'say',true)}}
  const res=navStep(r.g,r.nav,.28,tx,tz,sp,.3,dt,[]);r.walk+=res.step*14;
  if(res.step>.001&&r.nav.path[0])faceToward(r.g,r.nav.path[0][0],r.nav.path[0][1],dt,9);
  r.legs.forEach((l,i)=>l.rotation.x=res.step>.001?Math.sin(r.walk+(i===0||i===3?0:Math.PI))*.8:0);r.tail.rotation.y=Math.sin(t*8)*.4;r.g.position.y=r.flee?Math.abs(Math.sin(t*14))*.12:0;
  if(Math.hypot(pos.x-o.x,pos.z-o.z)<.7&&!r.flee&&jumpY<.5){r.flee=true;r.fleeT=2;sayText(r.b,'אאא! כלב!',1.2,'say',true)}}
 if(dv.burglar){const B=BURG,o=B.g.position;const tgt=V3(ARMCHAIR.x,0,ARMCHAIR.z-1);const res=navStep(B.g,B.nav,.38,tgt.x,tgt.z,1.4,.5,dt,[]);if(res.step>.001&&B.nav.path[0])faceToward(B.g,B.nav.path[0][0],B.nav.path[0][1],dt,6);
  animatePerson(B,res.step,dt,{arm:i=>i===1?-.4:0});updateFace(B.face,'smug',dt);
  if(Math.hypot(tgt.x-o.x,tgt.z-o.z)<.8){B.stealT=(B.stealT||0)+dt;if(B.stealT>4){dv.stolen=5;dv.over=true;evtPill.hidden=true;showBanner('🛋️ הפורץ לקח את הכורסה של אבא!!!');speakDad('הכורסה!!! לאאא!!!');setTimeout(()=>dEnd(false),2000)}}}
}
const _dvHit=dvHit;
function dHitBurglar(){if(!dv.burglar)return false;const o=BURG.g.position,dx=o.x-pos.x,dz=o.z-pos.z,d=Math.hypot(dx,dz);if(d<6&&(dx*Math.sin(yaw)+dz*Math.cos(yaw))/(d||1)>.88){BURG.hp--;sayText(burgB,pick(['אוי! רטוב!','החולצה שלי!','רגע רגע!']),1.2,'say',true);if(BURG.hp<=0){dv.kos++;addScore(800,'הפורץ ברח!');sayText(burgB,'טוב טוב! אני הולך! כלבים זה לא בשבילי!',2.4,'say',true);if(window.JUICE_READY){slowMo(.5);pow('ניצחון!',o.x,2.8,o.z,true)}const g=BURG.g;setTimeout(()=>g.visible=false,1800);dv.burglar=null}return true}return false}
const _dShoot=dShoot;dShoot=function(){const before=ds.shootCool;_dShoot();if(before<=0)dHitBurglar()};
// ---------- context buttons ----------
CTX_HOOKS.act.unshift(()=>{if(!DETECT)return null;const c=dCase();
 if(!c.defense&&ds.phase==='investigate'){for(const cl of c.clues){if(ds.found.has(cl.id))continue;const p=cl.pos();if(Math.hypot(pos.x-p.x,pos.z-p.z)<1.7)return {i:cl.witness?'🗣️':'🔍',l:cl.witness?'לחקור עד':'לבדוק רמז',on:1,fn:()=>dInspect(cl)}}
  if(ds.found.size>=2)return {i:'☝️',l:'להאשים!',on:ds.found.size>=c.clues.length?1:0,fn:dAccuse}}
 return {i:'💦',l:'שפריץ!',on:1,fn:dShoot}});
// ---------- mode plumbing ----------
function dApply(on){document.body.classList.toggle('detective',on);if(!on){DM.g.visible=false;dHideEvidence();dvReset();evtPill.hidden=true;for(const id of ['dAccuse','dEnd'])document.getElementById(id).hidden=true}else{ds.caseI=ds.caseI||0;dStartCase()}}
function setDetective(on){DETECT=on;if(on){if(HUMAN){HUMAN=false;hApply(false)}if(ZOMBIE){ZOMBIE=false;zApply(false)}}try{localStorage.setItem('milky-mode',on?'detective':'open')}catch(_){}OPEN_WORLD=true;document.body.classList.toggle('openWorld',true);reset();owApply();dApply(on)}
document.getElementById('startDetective').addEventListener('click',()=>{setDetective(true);startGame()});
for(const id of ['start','startOpen','startZombie','startHuman'])document.getElementById(id).addEventListener('click',()=>{if(DETECT){DETECT=false;dApply(false)}},true);
{const b=document.createElement('button');b.className='chip';b.type='button';b.textContent='🕵️ הבלש מילקי';b.addEventListener('click',()=>{setDetective(!DETECT);b.textContent=DETECT?'🐕 לחזור להיות כלב':'🕵️ הבלש מילקי'});document.getElementById('challengePanel').appendChild(b)}
for(const id of ['modeSwitch','zSwitch'])document.getElementById(id).addEventListener('click',()=>{if(DETECT){DETECT=false;dApply(false)}},true);
const _nth4=nextTaskHint;nextTaskHint=function(){if(!DETECT)return _nth4();const c=dCase();if(c.defense)return dv.burglar?'💦 שפריץ על הפורץ לפני שהוא לוקח את הכורסה!':'💦 שפריץ על הדביבונים לפני שהם מגיעים למקרר!';
 if(ds.phase!=='investigate')return '🕵️ הבלש מילקי';const left=c.clues.filter(x=>!ds.found.has(x.id));return left.length?'🔍 חפש רמזים (🔍 מסמן אותם) · נשארו '+left.length:'☝️ לחץ "להאשים!" ובחר מי עשה את זה'};
const _ct4=currentTarget;currentTarget=function(){if(!DETECT)return _ct4();if(!guideOn)return null;const c=dCase();if(c.defense){if(dv.burglar)return BURG.g.position;let b=null,bd=1e9;for(const r of dv.list)if(r.on&&!r.flee){const d=Math.hypot(r.g.position.x-pos.x,r.g.position.z-pos.z);if(d<bd){bd=d;b=r.g.position}}return b}
 if(ds.phase!=='investigate')return null;let b=null,bd=1e9;for(const cl of c.clues){if(ds.found.has(cl.id))continue;const p=cl.pos(),d=Math.hypot(p.x-pos.x,p.z-pos.z);if(d<bd){bd=d;b=p}}return b};
const _uow3=updateOpenWorld;updateOpenWorld=function(dt){if(!DETECT)return _uow3(dt);if(!day.finished)owApply();for(const s of Object.values(OW_MARKS))s.visible=false;if(!rain.visible)day.light=dCase().defense?3:2;updateDetective(dt)};
function updateDetective(dt){
 const t=performance.now()/1000;ds.lookT=Math.max(0,ds.lookT-dt);ds.shootT=Math.max(0,ds.shootT-dt);ds.shootCool=Math.max(0,ds.shootCool-dt);
 const c=dCase();
 if(!c.defense&&ds.phase==='investigate'){c.clues.forEach((cl,i)=>{const s=CLUE_SPR[i];if(ds.found.has(cl.id)){s.visible=false;return}const p=cl.pos();s.visible=true;s.position.set(p.x,(cl.witness?2.0:.9)+Math.sin(t*2.4+i)*.1,p.z)});dPill()}
 else CLUE_SPR.forEach(s=>s.visible=false);
 if(c.defense&&ds.phase==='investigate'){updateDefense(dt);if(!dv.over)dPill()}
}
if(DETECT)OPEN_WORLD=true;
window.DET_READY=true;
setTimeout(()=>{if(DETECT){owApply();document.body.classList.add('detective')}},0);
