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
const badge=new THREE.Group();badge.position.set(.2,2.0,.25);DM.g.add(badge);mesh(new THREE.CylinderGeometry(.07,.07,.02,5),new THREE.MeshStandardMaterial({color:0xf2c14e,metalness:.6,roughness:.3}),0,0,0,badge).rotation.x=Math.PI/2;badge.visible=false;
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
// extra evidence props for the later cases
const carrotBits=new THREE.Group();scene.add(carrotBits);for(let i=0;i<5;i++){const c=cyl(.03,.08,mat(0xf28c28),(Math.random()-.5)*.4,.03,(Math.random()-.5)*.4,carrotBits);c.rotation.z=Math.PI/2}carrotBits.visible=false;
const cushLump=new THREE.Group();scene.add(cushLump);box(.4,.1,.25,mat(0x3b4046),0,0,0,cushLump);cushLump.visible=false;
const wetPrints=new THREE.Group();scene.add(wetPrints);for(let i=0;i<7;i++){const p=cyl(.05,.01,decal(new THREE.MeshStandardMaterial({color:0xff9ad5,transparent:true,opacity:.6})),Math.sin(i)*.12,.03,-i*.4,wetPrints)}wetPrints.visible=false;
const eggplant=new THREE.Group();scene.add(eggplant);{const e=ball(.12,mat(0x5b2a6e,.4),0,0,0,eggplant);e.scale.set(2.2,1,1);cyl(.04,.08,mat(0x3f7a3a),.27,0,0,eggplant).rotation.z=Math.PI/2}eggplant.visible=false;
const flourPrints=new THREE.Group();scene.add(flourPrints);for(let i=0;i<10;i++){const p=box(.08,.01,.04,decal(mat(0xffffff)),Math.sin(i*2)*.4,.03,-i*.3,flourPrints);p.rotation.y=i}flourPrints.visible=false;
const doughBits=new THREE.Group();scene.add(doughBits);for(let i=0;i<5;i++)ball(.06,mat(0xf3e2c4),(Math.random()-.5)*.6,.04,(Math.random()-.5)*.6,doughBits);doughBits.visible=false;
// ---------- progression ----------
if(!save.det||typeof save.det!=='object')save.det={stars:{}};if(!save.det.stars)save.det.stars={};
const RANKS=[[0,'🔰 בלש מתלמד'],[4,'🕵️ בלש'],[9,'🎖️ בלש בכיר'],[15,'⭐ מפקח מילקי'],[22,'👑 מילקי הולמס, האגדה']];
const totalStars=()=>Object.values(save.det.stars).reduce((a,b)=>a+(+b||0),0);
function rankIdx(st=totalStars()){let r=0;RANKS.forEach((x,i)=>{if(st>=x[0])r=i});return r}
const PERKS=['','💦 רובה מים משולש','👃 רחרוח מהיר פי 2','🔍 זכוכית מגדלת זהב','🏅 תג האגדה על המעיל'];
// ---------- the cases ----------
const ds={caseI:0,phase:'board',found:new Set(),lookT:0,shootT:0,shootCool:0,defense:false,wrong:0,t0:0,sniffCool:0,sniffT:0};
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const CASES=[
 {id:'slipper',icon:'🩴',title:'הכפכף שנעלם',client:'👨 אבא',par:150,
  noir:'🌙 הלילה היה קר. הכפכף נעלם. ורק מישהו אחד ידע למה...',
  open:()=>{slipper.position.set(4.2,.05,-39.2);slipperState='hidden';prints.position.set(slipperHome.x,0,slipperHome.z+.4);prints.rotation.y=Math.PI;prints.visible=true;furTuft.position.set(4.6,1.2,-39.9);furTuft.visible=true;
   speakDad('בלש מילקי! הכפכף שלי נעלם! ...ואני לא חושד בך הפעם. הפעם.')},
  clues:[
   {id:'prints',pos:()=>V3(slipperHome.x,0,slipperHome.z+1),label:'👣 עקבות קטנות ליד המקום של הכפכף',note:'קטנות מדי לכלב גדול... ומישהו היה יחף'},
   {id:'fur',pos:()=>V3(4.4,0,-39.0),label:'🧡 פרווה כתומה על הגדר, והכפכף מתחתיה!',note:'כתום... כמו מישהו שאוהב לשבת על הגדר'},
   {id:'parrot',witness:true,pos:()=>V3(9,0,26),who:()=>parrotB,line:'הכפכף! הכפכף! מיאו! מיאו!',label:'🦜 התוכי: "הכפכף! הכפכף! מיאו!"',note:'התוכי רק מחקה... אבל ממי הוא שמע "מיאו"?'},
   {id:'guard',witness:true,pos:()=>V3(19.2,0,42.2),who:()=>GUARD.b,line:'גררר... הייתי פה כל הלילה מאחורי הגדר!',label:'🐕 בולדוזר: "הייתי מאחורי הגדר כל הלילה"',note:'אליבי חזק. הגדר נעולה.'}],
  suspects:[{n:'🦜 התוכי',wrong:'אני?! אני רק חוזר על מה שאני שומע! הכפכף! הכפכף!'},{n:'🐈 החתול הכתום',ok:true},{n:'🐕 בולדוזר',wrong:'גררר... אמרתי לך! הייתי נעול!'}],
  reveal:()=>{sayText(catB,'מיאו... היה לי קר ברגליים 😼',2.6,'say',true);slipperState='floor';slipper.position.copy(slipperHome);slipper.rotation.set(0,0,0);setTimeout(()=>speakDad('חתול גנב! ...תודה, בלש מילקי.'),1400)}},
 {id:'bamba',icon:'🥜',title:'שוד הבמבה',client:'🧔 המוכר',par:150,
  noir:'🌙 העיר ישנה. המכולת לא. מישהו גנב במבה... ואני מתכוון לגלות מי.',
  open:()=>{sayText(PEOPLE[4].b,'בלש! מישהו גנב במבה! ואני חושד... בך!',2.6,'say',true);crumbs.position.set(8.6,0,24);crumbs.visible=true;whiteFur.position.set(19.2,.3,5.8);whiteFur.visible=true;bambaEmpty.position.set(8.4,0,30.5);bambaEmpty.visible=true},
  clues:[
   {id:'crumbs',pos:()=>V3(8.6,0,25.5),label:'🟡 שביל פירורי במבה על המדרכה',note:'השביל הולך לאורך המדרכה... בקצב של עגלה?'},
   {id:'whitefur',pos:()=>V3(19.0,0,5.8),label:'🤍 פרווה לבנה קטנטנה ליד דלת המכולת',note:'לבנה ורכה. לא שלי.'},
   {id:'empty',pos:()=>V3(8.4,0,30.5),label:'🛍️ שקית במבה ריקה ליד המסלול של העגלה',note:'ריקה לגמרי. מישהו קטן ורעב מאוד.'},
   {id:'oldman',witness:true,pos:()=>V3(BENCH.x+1,0,BENCH.z),who:()=>PEOPLE[2].b,line:'היונים? הן אוכלות רק גרעינים. אבל ראיתי עגלה עוברת... וריח של במבה!',label:'👴 הזקן: "ראיתי עגלה... וריח של במבה"',note:'עגלה. ותינוק שלא באמת תינוק.'}],
  suspects:[{n:'🕊️ היונים',wrong:'קוקוקו... (היונים נעלבו ועפו)'},{n:'🐕 מילקי (אני?!)',wrong:'רגע... אתה מאשים את עצמך?!'},{n:'🐶 פיצי מהעגלה',ok:true}],
  reveal:()=>{sayText(PEOPLE[3].b,'פיצי!!! שוב?! אמרתי לך בלי במבה!',2.6,'say',true);setTimeout(()=>sayText(PEOPLE[4].b,'כלב בעגלה... גנב במבה... ראיתי הכל בחיים',2.4,'say',true),1400)}},
 {id:'night1',icon:'🦝',title:'לילה ראשון: הפלישה',night:true,waves:[3,4,5],burglar:true,
  noir:'🌙 הם באו בלילה. דביבונים. עם מסכות. והם רוצים את הנקניקיות של אבא.'},
 {id:'carrot',icon:'🥕',title:'הגזר של הארנב',client:'🩺 הווטרינר',par:170,
  noir:'🌙 במרפאה שקט. שקט מדי. ארנב בוכה, וגזר אחד... נעלם.',
  open:()=>{sayText(vetB,'בלש! הגזר של הארנב נעלם! הוא לא אוכל כבר שעה!',2.6,'say',true);carrotBits.position.set(igTank.position.x+.6,0,igTank.position.z-.8);carrotBits.visible=true},
  clues:[
   {id:'hutch',pos:()=>V3(hutch.position.x-.6,0,hutch.position.z-1),label:'🐰 הכלוב של הארנב סגור. לא הוא יצא',note:'הארנב לא יצא. מישהו הגיע אליו.'},
   {id:'bits',pos:()=>V3(igTank.position.x+.6,0,igTank.position.z-.8),label:'🥕 פירורי גזר ליד הטרריום של שמוליק',note:'פירורים... ליד מישהו ירוק ושקט.'},
   {id:'recep',witness:true,pos:()=>V3(23.2,0,13),who:()=>recepB,line:'האיגואנה עשתה פרצוף מוזר כל הבוקר. ממש... מרוצה.',label:'💁 המזכירה: "שמוליק נראה מרוצה מדי"',note:'מרוצה מדי. מכיר את המבט הזה.'},
   {id:'ownerv',witness:true,pos:()=>V3(21.9,0,17.4),who:()=>ownerB,line:'שמוליק? הוא צמחוני! הוא אף פעם לא... טוב, לפעמים.',label:'🧑 הבעלים: "שמוליק צמחוני... לפעמים"',note:'צמחוני. וגזר זה ירק.'}],
  suspects:[{n:'🐈 החתול בכלוב',wrong:'ששששש! חתולים לא אוכלים גזר, טיפש!'},{n:'🦎 שמוליק האיגואנה',ok:true},{n:'💁 המזכירה',wrong:'אני?! אני בדיאטה של קפה בלבד!'}],
  reveal:()=>{sayText(igTankBub,'...😑 היה טעים.',2.4,'say',true);setTimeout(()=>sayText(ownerB,'שמוליק!!! אנחנו נדבר על זה בבית!',2.4,'say',true),1300)}},
 {id:'remote',icon:'📺',title:'השלט האבוד',client:'👨 אבא',par:140,
  noir:'🌙 המשחק מתחיל בעוד 5 דקות. השלט נעלם. אבא בפאניקה.',
  open:()=>{const r=extras.find(p=>p.kind==='remote');if(r){r.g.visible=false;carried.add(r.g)}cushLump.position.set(ARMCHAIR.x,.62,ARMCHAIR.z);cushLump.visible=true;speakDad('בלש מילקי! השלט נעלם! המשחק מתחיל! אני לא זז מהכורסה עד שתמצא אותו!')},
  clues:[
   {id:'spot',pos:()=>V3(2.5,0,-1.8),label:'📭 המקום של השלט ריק',note:'השלט תמיד פה. מישהו הזיז אותו... או ישב עליו.'},
   {id:'dani',witness:true,pos:()=>dani.position,who:()=>daniB,line:'אבא לא קם מהכורסה כל היום. אפילו לא לשירותים.',label:'🧢 דני: "אבא לא קם מהכורסה כל היום"',note:'כל היום. על אותה כורסה.'},
   {id:'lump',pos:()=>V3(ARMCHAIR.x-1.2,0,ARMCHAIR.z-.6),label:'🛋️ בליטה מוזרה בכרית של הכורסה',note:'בליטה. בגודל של... שלט?'},
   {id:'parrot2',witness:true,pos:()=>V3(9,0,26),who:()=>parrotB,line:'איפה השלט?! איפה השלט?! אני יושב עליו! אני יושב עליו!',label:'🦜 התוכי: "אני יושב עליו!"',note:'התוכי חוזר על מה שהוא שמע... ממי?'}],
  suspects:[{n:'🐕 מילקי',wrong:'רגע, אתה הבלש! אתה לא יכול להיות החשוד!'},{n:'🧢 דני',wrong:'אני?! אני אפילו לא רואה כדורסל!'},{n:'👨 אבא עצמו',ok:true}],
  reveal:()=>{speakDad('אני?! מה פתאום! אני... רגע.');setTimeout(()=>{cushLump.visible=false;const r=extras.find(p=>p.kind==='remote');if(r){carried.delete(r.g);r.g.visible=true;r.g.position.set(ARMCHAIR.x-.8,0,ARMCHAIR.z-.8)}speakDad('...ישבתי עליו. כל היום. אל תספר לאף אחד.');sayDani('חחחחחחחח')},1600)}},
 {id:'pipi',icon:'🎀',title:'הפן ההרוס של פיפי',client:'💇 הספרית',par:160,
  noir:'🌙 שעתיים של פן. שנייה אחת של כאוס. ופיפי... נראית כמו כרית.',
  open:()=>{sayText(groomB,'בלש! מישהו הדליק את המייבש על פיפי! היא נראית כמו כרית!',2.6,'say',true);wetPrints.position.set(GTABLE.x+.2,0,GTABLE.z+1.5);wetPrints.rotation.y=Math.PI*.8;wetPrints.visible=true},
  clues:[
   {id:'dryer',pos:()=>V3(DRYER.x-.9,0,DRYER.z),label:'💨 המייבש עדיין חם, והכפתור בגובה של כלב קטן',note:'בגובה של כלב קטן... מאוד ורוד.'},
   {id:'wet',pos:()=>V3(GTABLE.x+.2,0,GTABLE.z+1.5),label:'🐾 עקבות ורודות רטובות מהאמבטיה לשולחן',note:'מישהו התרחץ, ואז רץ לשולחן.'},
   {id:'courier',witness:true,pos:()=>V3(10.2,0,COURIER.g.position.z),who:()=>PEOPLE[1].b,line:'ראיתי משהו ורוד רץ בתוך המספרה! מהר! עם מגבת!',label:'🛴 השליח: "ראיתי משהו ורוד רץ עם מגבת"',note:'ורוד. מגבת. אני מתחיל להבין.'},
   {id:'mirrorc',pos:()=>V3(MIRROR.x-1.1,0,MIRROR.z),label:'🪞 על המראה: "רוצה תלתלים!!!" בכתב כפה',note:'כתב כפה. ורוד. מישהו רצה שינוי.'}],
  suspects:[{n:'💇 הספרית',wrong:'אני?! אני אמנית! לעולם לא!'},{n:'🛴 השליח',wrong:'אין לי זמן לפן! יש לי 40 משלוחים!'},{n:'🎀 פיפי עצמה',ok:true}],
  reveal:()=>{sayText(PIPI.b,'...נמאס לי מחלק! רציתי תלתלים! 💅',2.6,'say',true);setTimeout(()=>sayText(groomB,'פיפי!!! ...טוב, האמת, זה דווקא מחמיא לך',2.4,'say',true),1400)}},
 {id:'night2',icon:'🦝',title:'לילה שני: הכנופיה חוזרת',night:true,waves:[4,5,6,6],burglar:true,
  noir:'🌙 הם חזרו. יותר. רעבים יותר. ועם תוכנית.'},
 {id:'kebab',icon:'🍢',title:'הקבב שהפך לחציל',client:'🍖 השכן',par:170,
  noir:'🌙 המנגל בוער. הקבב נעלם. ובמקומו... חציל.',
  open:()=>{kebab.visible=false;eggplant.position.set(kebabHome.x,kebabHome.y+.05,kebabHome.z);eggplant.visible=true;sayText(nbB,'בלש!!! מישהו החליף לי את הקבב בחציל!!! חציל!!!',2.6,'say',true)},
  clues:[
   {id:'egg',pos:()=>V3(2,0,-32.2),label:'🍆 חציל על המנגל, עם גבעול ירוק טרי',note:'טרי מהגינה. מישהו כאן מגדל ירקות.'},
   {id:'flowers',pos:()=>V3(-12.5,0,-28.2),label:'🌸 חור באדמה בערוגה של השכנה, בצורת חציל',note:'בצורת חציל בדיוק.'},
   {id:'cat2',witness:true,pos:()=>V3(cat.position.x,0,cat.position.z+1),who:()=>catB,line:'מיאו. ראיתי שמלה ירוקה ליד המנגל. ריח של דשן.',label:'🐈 החתול: "ראיתי שמלה ירוקה ליד המנגל"',note:'שמלה ירוקה... מכיר מישהי כזאת.'},
   {id:'nb',witness:true,pos:()=>V3(2.6,0,-34),who:()=>nbB,line:'כל הזמן אומרים לי לאכול בריא! מי אמר? ...לא משנה מי!',label:'🍖 השכן: "כל הזמן אומרים לי לאכול בריא"',note:'"לאכול בריא". מישהי דואגת לו.'}],
  suspects:[{n:'🐈 החתול',wrong:'אני טורף! מה לי ולחציל?!'},{n:'🐕 מילקי',wrong:'אני הייתי מחליף קבב בעוד קבב, לא בחציל!'},{n:'🌸 השכנה',ok:true}],
  reveal:()=>{sayText(ladyB,'נו באמת! הוא אוכל רק בשר! מישהו צריך לדאוג לו! 🍆',2.6,'say',true);setTimeout(()=>{sayText(nbB,'...את דואגת לי? 🥹',2.2,'say',true);kebab.visible=true;eggplant.visible=false},1500)}},
 {id:'dough',icon:'🍕',title:'הבצק שנעלם',client:'👨‍🍳 השף',par:160,
  noir:'🌙 בצק טרי, מוכן לתנור. מסתובבים שנייה... ואין בצק.',
  open:()=>{sayText(chefB,'מאמא מיה! הבצק של הערב נעלם! כל הבצק!',2.6,'say',true);flourPrints.position.set(19.3,0,24);flourPrints.rotation.y=Math.PI*.9;flourPrints.visible=true;doughBits.position.set(BENCH.x+1.2,0,BENCH.z+.5);doughBits.visible=true},
  clues:[
   {id:'flour',pos:()=>V3(18.6,0,23),label:'🐾 עקבות קמח קטנות, בצורת מזלג, ליד הדלת',note:'בצורת מזלג... שלוש אצבעות. ציפורים?'},
   {id:'bits2',pos:()=>V3(BENCH.x+1.2,0,BENCH.z+.5),label:'🍞 חתיכות בצק ליד הספסל של הזקן',note:'ליד הספסל. איפה שהיונים אוכלות.'},
   {id:'oldman2',witness:true,pos:()=>V3(BENCH.x+1,0,BENCH.z),who:()=>PEOPLE[2].b,line:'היונים שלי? הן אכלו היום כמו מלכים! לא נתתי להן כלום...',label:'👴 הזקן: "היונים אכלו כמו מלכים"',note:'כמו מלכים. בלי שהוא נתן להן.'},
   {id:'chef2',witness:true,pos:()=>V3(PCOUNTER.x-1.2,0,PCOUNTER.z),who:()=>chefB,line:'השארתי את החלון פתוח לאוורר... רק לרגע!',label:'👨‍🍳 השף: "השארתי את החלון פתוח"',note:'חלון פתוח. ומי עף דרך חלונות?'}],
  suspects:[{n:'👴 הזקן',wrong:'אני?! יש לי שיניים תותבות! אני לא אוכל בצק חי!'},{n:'🕊️ היונים',ok:true},{n:'👨‍🍳 השף עצמו',wrong:'אני?! אני השף! למה שאגנוב מעצמי?!'}],
  reveal:()=>{for(const p of PIGEONS){p.fly=3;p.v.set((Math.random()-.5)*3,4,(Math.random()-.5)*3)}sayText(PEOPLE[2].b,'היונים שלי... גנבות?! אני כל כך גאה בהן',2.6,'say',true);setTimeout(()=>sayText(chefB,'מעכשיו החלון סגור! לנצח!',2.2,'say',true),1400)}},
 {id:'night3',icon:'👑',title:'הלילה האחרון: מלך הדביבונים',night:true,waves:[5,6,7],burglar:true,boss:true,
  noir:'🌙 השמועה בשכונה: מלך הדביבונים בעצמו מגיע הלילה. עם כתר. ותיאבון.'}
];
function dCase(){return CASES[ds.caseI]}
function caseUnlocked(i){return i===0||(save.det.stars[CASES[i-1].id]||0)>0}
function caseStars(c){const s=save.det.stars[c.id];return s?'⭐'.repeat(s)+'☆'.repeat(3-s):''}
function dPill(){const c=dCase();evtPill.hidden=false;let l;if(c.night)l=(dv.boss?'👑 מלך הדביבונים ':'🦝 ')+'גל '+Math.max(1,dv.wave)+'/'+c.waves.length+' · נגנבו '+dv.stolen+'/5';else l=c.icon+' '+c.title+' · רמזים '+ds.found.size+'/'+c.clues.length+' · '+fmtTime((performance.now()-ds.t0)/1000);if(evtPill.textContent!==l)evtPill.textContent=l}
function dHideEvidence(){for(const g of [prints,furTuft,crumbs,whiteFur,bambaEmpty,carrotBits,cushLump,wetPrints,eggplant,flourPrints,doughBits])g.visible=false;CLUE_SPR.forEach(s=>s.visible=false);kebab.visible=true;
 const r=extras.find(p=>p.kind==='remote');if(r&&!r.g.visible){carried.delete(r.g);r.g.visible=true;r.g.position.copy(r.home)}}
function dBoard(){started=false;ds.phase='board';evtPill.hidden=true;dHideEvidence();dvReset();
 const st=totalStars(),ri=rankIdx(st),nx=RANKS[ri+1];const rk=document.getElementById('dRank');
 rk.innerHTML='';const t=document.createElement('div');t.textContent=RANKS[ri][1]+' · ⭐ '+st+(nx?' / '+nx[0]+' לדרגה הבאה':' · הדרגה הגבוהה ביותר!');rk.appendChild(t);
 const bar=document.createElement('i'),bb=document.createElement('b');bb.style.width=(nx?Math.min(100,(st-RANKS[ri][0])/(nx[0]-RANKS[ri][0])*100):100)+'%';bar.appendChild(bb);rk.appendChild(bar);
 if(ri>0){const p=document.createElement('div');p.style.cssText='font-size:12px;opacity:.8;margin-top:4px';p.textContent='שדרוגים: '+PERKS.slice(1,ri+1).join(' · ');rk.appendChild(p)}
 const box=document.getElementById('dCases');box.innerHTML='';let nextMarked=false;
 CASES.forEach((c,i)=>{const b=document.createElement('button');b.type='button';const ok=caseUnlocked(i),done=save.det.stars[c.id];b.className='dCase'+(c.night?' night':'')+(ok?'':' locked');
  if(ok&&!done&&!nextMarked){b.classList.add('next');nextMarked=true}b.disabled=!ok;
  const ic=document.createElement('b');ic.textContent=ok?c.icon:'🔒';const tt=document.createElement('strong');tt.textContent=(i+1)+'. '+c.title;const sm=document.createElement('small');sm.textContent=done?caseStars(c):ok?(c.night?'🌙 משמרת לילה':c.client):'נפתח אחרי התיק הקודם';
  b.append(ic,tt,sm);b.addEventListener('click',()=>{document.getElementById('dBoard').hidden=true;started=true;dStartCase(i)});box.appendChild(b)});
 document.getElementById('dBoard').hidden=false}
document.getElementById('dBoardQuit').addEventListener('click',()=>{document.getElementById('dBoard').hidden=true;setDetective(false);startGame();showBanner('🐕 מילקי חזר להיות כלב')});
function dStartCase(i){ds.caseI=i;const c=dCase();reset();owApply();ds.found.clear();ds.phase='intro';ds.wrong=0;dHideEvidence();ds.defense=!!c.night;gunG.visible=true;magG.visible=true;
 showBanner(c.noir);setTimeout(()=>{if(!DETECT||ds.caseI!==i)return;ds.phase='investigate';ds.t0=performance.now();showBanner(c.icon+' תיק '+(i+1)+': '+c.title);if(c.night)dvStart(c);else c.open()},3400)}
function dInspect(cl){if(ds.found.has(cl.id))return;ds.found.add(cl.id);ds.lookT=1.6;addScore(150,'רמז!');
 if(cl.witness){sayText(cl.who(),cl.line,3,'say',true);setTimeout(()=>sayText(dmB,'🤔 '+cl.note,2.6,'think',true),1500)}else sayText(dmB,'🔍 '+cl.note,2.8,'think',true);
 addActivity('🔍 '+cl.label);if(window.JUICE_READY)pow('🔍 רמז!',pos.x,2.6,pos.z);
 if(ds.found.size>=dCase().clues.length){setTimeout(()=>{if(DETECT){showBanner('🕵️ יש לי מספיק רמזים. הגיע הזמן להאשים!');sayText(dmB,'🕵️ אני יודע מי עשה את זה.',2.4,'say',true)}},2400)}}
function dAccuse(){const c=dCase();document.getElementById('dAccTitle').textContent=c.title+': מי עשה את זה?';const cl=document.getElementById('dClues');cl.innerHTML='';
 for(const x of c.clues){const d=document.createElement('div');d.textContent=(ds.found.has(x.id)?'✔ '+x.label:'❔ רמז שעוד לא נמצא');cl.appendChild(d)}
 const sw=document.getElementById('dSuspects');sw.innerHTML='';for(const s of c.suspects){const b=document.createElement('button');b.type='button';b.textContent=s.n;b.addEventListener('click',()=>dGuess(s));sw.appendChild(b)}
 document.getElementById('dAccuse').hidden=false;started=false}
document.getElementById('dAccBack').addEventListener('click',()=>{document.getElementById('dAccuse').hidden=true;started=true});
function dGuess(s){document.getElementById('dAccuse').hidden=true;started=true;
 if(!s.ok){ds.wrong++;showBanner('❌ לא '+s.n);sayText(dmB,'😳 אופס...',1.6,'say',true);setTimeout(()=>showBanner(s.wrong),900);addActivity('❌ '+s.n+': "'+s.wrong+'"');return}
 const c=dCase(),time=(performance.now()-ds.t0)/1000;const stars=(ds.wrong===0&&ds.found.size>=c.clues.length&&time<=c.par)?3:(ds.wrong<=1?2:1);
 showBanner('✅ '+s.n+'! התיק נפתר!');if(window.JUICE_READY){slowMo(.6);punch(6);pow('נפתר!!',pos.x,2.8,pos.z,true)}addScore(1000-ds.wrong*200,'תיק נפתר!');c.reveal();CLUE_SPR.forEach(s=>s.visible=false);evtPill.hidden=true;ds.phase='solved';
 setTimeout(()=>dEnd(true,stars,time),3800)}
function dEnd(win,stars,time){const c=dCase();const before=rankIdx();if(win){save.det.stars[c.id]=Math.max(save.det.stars[c.id]||0,stars);writeSave()}const after=rankIdx();
 document.getElementById('dEndTitle').textContent=win?'📁 '+c.title+' — נסגר!':'🦝 הדביבונים ניצחו...';
 document.getElementById('dEndStars').innerHTML=win?[0,1,2].map(i=>'<span class="'+(i<stars?'on':'off')+'">⭐</span>').join(''):'';
 const st=document.getElementById('dEndStats');st.innerHTML='';
 const lines=c.night?[win?'🛡️ הבית מוגן!':'🌭 הדביבונים גנבו את כל הנקניקיות','🦝 הברחת '+dv.kos+' פולשים','🌭 נגנבו '+dv.stolen+'/5'+(win?(stars===3?' · מושלם!':''):'')]:['⏱️ '+fmtTime(time)+' (ל־3 כוכבים: עד '+fmtTime(c.par)+')','🔍 רמזים '+ds.found.size+'/'+c.clues.length,'❌ האשמות שגויות: '+ds.wrong];
 if(win&&after>before)lines.push('🎉 דרגה חדשה: '+RANKS[after][1]+' · '+PERKS[after]);
 for(const l of lines){const d=document.createElement('div');d.textContent=l;st.appendChild(d)}
 const nb=document.getElementById('dEndNext');const ni=ds.caseI+1;nb.hidden=!(win?ni<CASES.length:true);nb.textContent=win?'▶ לתיק הבא':'🔁 עוד פעם';nb.onclick=()=>{document.getElementById('dEnd').hidden=true;dStartCase(win?ni:ds.caseI)};
 document.getElementById('dEnd').hidden=false;if(win&&after>before&&window.JUICE_READY)for(let i=0;i<3;i++)setTimeout(()=>showBurst(pos.x,pos.z),i*200)}
document.getElementById('dEndBoard').addEventListener('click',()=>{document.getElementById('dEnd').hidden=true;dBoard()});
// ---------- water gun ----------
function dShoot(){if(ds.shootCool>0)return;ds.shootCool=.28;ds.shootT=.35;try{playToySound(300+Math.random()*80,.06,'sine')}catch(_){}
 gunG.updateWorldMatrix(true,false);gunG.localToWorld(_gv.set(0,0,.5));const ox=_gv.x,oy=_gv.y,oz=_gv.z;
 const wide=rankIdx()>=1;for(let i=0;i<(wide?16:8);i++){const a=yaw+(wide?((i%3)-1)*.18:0)+(Math.random()-.5)*.12;emit(ox,oy,oz,Math.sin(a)*(9+Math.random()*2),1+Math.random(),Math.cos(a)*(9+Math.random()*2),'water',.55)}
 const fx=Math.sin(yaw),fz=Math.cos(yaw);const inCone=(x,z,r=6)=>{const dx=x-pos.x,dz=z-pos.z,d=Math.hypot(dx,dz);return d<r&&d>.2&&(dx*fx+dz*fz)/d>(wide?.8:.88)};
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
const KING=makeRaccoon();KING.g.scale.setScalar(2.3);KING.g.visible=false;{const cr=new THREE.Group();cr.position.set(0,.68,.32);KING.g.add(cr);const gold=mat(0xf2c14e,.3);mesh(new THREE.CylinderGeometry(.13,.14,.08,10,1,true),gold,0,0,0,cr).material.side=THREE.DoubleSide;for(let i=0;i<5;i++){const a=i/5*6.28;mesh(new THREE.ConeGeometry(.025,.07,5),gold,Math.sin(a)*.13,.07,Math.cos(a)*.13,cr)}}
const D_SPAWN=[[-1.2,-8.0],[5.6,6.2],[-5.5,15.2],[5.5,-7.5]],FRIDGE_T={x:5.2,z:14.1};
function dvStart(c){dv.cfg=c;dv.boss=null;dv.wave=0;dv.stolen=0;dv.kos=0;dv.over=false;dv.breakT=2;dv.toSpawn=0;speakDad('מילקי!!! דביבונים בבית!!! הם הולכים למקרר!!!');sayDani('תשפריץ עליהם! תשפריץ!!!')}
function dvReset(){dv.list.forEach(r=>{r.on=false;r.g.visible=false;r.sack.visible=false});KING.g.visible=false;dv.boss=null;BURG.g.visible=false;dv.burglar=null;dv.wave=0;dv.toSpawn=0;dv.over=false}
function dvSpawn(){const r=dv.list.find(r=>!r.on);if(!r)return;const p=pick(D_SPAWN.filter(p=>Math.hypot(p[0]-pos.x,p[1]-pos.z)>4));if(!p)return;r.on=true;r.flee=false;r.carry=false;r.sack.visible=false;r.g.visible=true;r.g.position.set(p[0],0,p[1]);r.nav.path=[];r.sp=1.6+dv.wave*.25+Math.random()*.4;r.home=p;sayText(r.b,pick(['הי הי הי 🦝','נקניקיות!!!','שקט... שקט...']),1.6,'say')}
function dvHit(r){r.flee=true;r.fleeT=2.5;dv.kos++;addScore(150,'שפריץ!');sayText(r.b,pick(['אייייי! רטוב!!!','מים?! אני שונא מים!!!','בורחיםםם!']),1.4,'say',true);if(window.JUICE_READY)pow('שפלאש!',r.g.position.x,1.2,r.g.position.z);if(r.carry){r.carry=false;r.sack.visible=false;addActivity('🌭 הנקניקייה הוצלה!')}}
function dvKing(){const K=KING;K.on=true;K.flee=false;K.carry=false;K.g.visible=true;K.g.position.set(-1.2,0,-8.0);K.nav.path=[];K.hp=10;K.sp=1.1;K.home=[-1.2,-8.0];dv.boss=K;showBanner('👑 מלך הדביבונים הגיע!!!');sayText(K.b,'אני המלך!!! כל הנקניקיות שלי!!! 👑',2.6,'say',true);speakDad('זה... דביבון בגודל של ספה!!!');if(window.JUICE_READY){punch(8);slowMo(.6)}}
function updateKing(dt){const K=KING,o=K.g.position,t=performance.now()/1000;const tx=K.carry?K.home[0]:FRIDGE_T.x,tz=K.carry?K.home[1]:FRIDGE_T.z;
 const res=navStep(K.g,K.nav,.45,tx,tz,K.sp,.5,dt,[]);K.walk+=res.step*8;if(res.step>.001&&K.nav.path[0])faceToward(K.g,K.nav.path[0][0],K.nav.path[0][1],dt,5);K.legs.forEach((l,i)=>l.rotation.x=res.step>.001?Math.sin(K.walk+(i===0||i===3?0:Math.PI))*.7:0);K.tail.rotation.y=Math.sin(t*5)*.5;
 if(!K.carry&&Math.hypot(tx-o.x,tz-o.z)<1.1){K.carry=true;K.sack.visible=true;sayText(K.b,'חה חה! כל המקרר שלי!',2,'say',true)}
 if(K.carry&&Math.hypot(tx-o.x,tz-o.z)<1){dv.stolen=5;dv.over=true;evtPill.hidden=true;K.g.visible=false;dv.boss=null;showBanner('👑 המלך ברח עם כל הנקניקיות...');setTimeout(()=>dEnd(false,0,0),2000)}
 if(Math.random()<dt*.15)sayText(K.b,pick(['אני המלך!','נקניקיות לעם!','שום כלב לא יעצור אותי!','👑']),1.6,'say')}
function dHitKing(){if(!dv.boss)return false;const o=KING.g.position,dx=o.x-pos.x,dz=o.z-pos.z,d=Math.hypot(dx,dz);if(d<7&&(dx*Math.sin(yaw)+dz*Math.cos(yaw))/(d||1)>(rankIdx()>=1?.8:.88)){KING.hp--;KING.sp=Math.max(.6,KING.sp-.04);sayText(KING.b,pick(['אוי! הכתר!','מים?! למלך?!','חוצפה!!!','אאא! רטוב!']),1.2,'say',true);if(window.JUICE_READY)pow('שפלאש!',o.x,2.4,o.z);
  if(KING.hp<=0){dv.kos+=5;addScore(2000,'המלך הודח!');sayText(KING.b,'טוב טוב!!! אני מוותר על הכתר!!! 😭',2.6,'say',true);if(window.JUICE_READY){slowMo(.8);punch(8);pow('👑 ניצחון!!!',o.x,3,o.z,true)}for(let i=0;i<4;i++)setTimeout(()=>showBurst(o.x,o.z),i*200);const g=KING.g;setTimeout(()=>g.visible=false,2200);dv.boss=null;KING.on=false}return true}return false}
function dvBurglar(){BURG.g.visible=true;BURG.g.position.set(5.6,0,6.2);BURG.nav.path=[];BURG.hp=4;dv.burglar=BURG;sayText(burgB,'שששש... באתי בשביל הכורסה 😎',2.4,'say',true);speakDad('הכורסה שלי!!! מילקי!!! תציל את הכורסה!!!')}
function updateDefense(dt){
 if(dv.over)return;const t=performance.now()/1000;
 if(dv.toSpawn>0){dv.spawnT-=dt;if(dv.spawnT<=0){dvSpawn();dv.toSpawn--;dv.spawnT=Math.max(.8,2-dv.wave*.3)}}
 else if(!dv.list.some(r=>r.on)&&!dv.burglar&&!dv.boss){dv.breakT-=dt;if(dv.breakT<=0){if(dv.wave>=dv.cfg.waves.length&&!dv.boss){dv.over=true;showBanner('🛡️ הבית מוגן! הפולשים ברחו!');evtPill.hidden=true;addScore(1500,'הגנה מושלמת!');speakDad('בלש מילקי! הצלת את הבית!');const st=dv.stolen===0?3:dv.stolen<=2?2:1;setTimeout(()=>dEnd(true,st,0),2500);return}
  dv.wave++;dv.toSpawn=dv.cfg.waves[dv.wave-1];dv.breakT=5;const last=dv.wave===dv.cfg.waves.length;showBanner('🦝 גל '+dv.wave+(last?' (אחרון!)':'')+'!');if(last&&dv.cfg.burglar)setTimeout(()=>{if(DETECT&&!dv.over)dvBurglar()},5000);if(last&&dv.cfg.boss)setTimeout(()=>{if(DETECT&&!dv.over)dvKing()},9000)}}
 for(const r of dv.list){if(!r.on)continue;const o=r.g.position;let tx,tz,sp=r.sp;
  if(r.flee){const h=r.home;tx=h[0];tz=h[1];sp=3.5;r.fleeT-=dt;if(r.fleeT<=0||Math.hypot(tx-o.x,tz-o.z)<.6){r.on=false;r.g.visible=false;continue}}
  else if(r.carry){tx=r.home[0];tz=r.home[1];if(Math.hypot(tx-o.x,tz-o.z)<.7){r.on=false;r.g.visible=false;dv.stolen++;addActivity('🌭 דביבון ברח עם נקניקייה! ('+dv.stolen+'/5)');if(dv.stolen>=5){dv.over=true;evtPill.hidden=true;showBanner('🦝 הדביבונים גנבו את כל הנקניקיות...');setTimeout(()=>dEnd(false,0,0),2000)}continue}}
  else{tx=FRIDGE_T.x;tz=FRIDGE_T.z;if(Math.hypot(tx-o.x,tz-o.z)<.8){r.carry=true;r.sack.visible=true;sayText(r.b,'יש!!! נקניקייה!!! 🌭',1.4,'say',true)}}
  const res=navStep(r.g,r.nav,.28,tx,tz,sp,.3,dt,[]);r.walk+=res.step*14;
  if(res.step>.001&&r.nav.path[0])faceToward(r.g,r.nav.path[0][0],r.nav.path[0][1],dt,9);
  r.legs.forEach((l,i)=>l.rotation.x=res.step>.001?Math.sin(r.walk+(i===0||i===3?0:Math.PI))*.8:0);r.tail.rotation.y=Math.sin(t*8)*.4;r.g.position.y=r.flee?Math.abs(Math.sin(t*14))*.12:0;
  if(Math.hypot(pos.x-o.x,pos.z-o.z)<.7&&!r.flee&&jumpY<.5){r.flee=true;r.fleeT=2;sayText(r.b,'אאא! כלב!',1.2,'say',true)}}
 if(dv.burglar){const B=BURG,o=B.g.position;const tgt=V3(ARMCHAIR.x,0,ARMCHAIR.z-1);const res=navStep(B.g,B.nav,.38,tgt.x,tgt.z,1.4,.5,dt,[]);if(res.step>.001&&B.nav.path[0])faceToward(B.g,B.nav.path[0][0],B.nav.path[0][1],dt,6);
  animatePerson(B,res.step,dt,{arm:i=>i===1?-.4:0});updateFace(B.face,'smug',dt);
  if(Math.hypot(tgt.x-o.x,tgt.z-o.z)<.8){B.stealT=(B.stealT||0)+dt;if(B.stealT>4){dv.stolen=5;dv.over=true;evtPill.hidden=true;showBanner('🛋️ הפורץ לקח את הכורסה של אבא!!!');speakDad('הכורסה!!! לאאא!!!');setTimeout(()=>dEnd(false,0,0),2000)}}}
 if(dv.boss)updateKing(dt);
}
const _dvHit=dvHit;
function dHitBurglar(){if(!dv.burglar)return false;const o=BURG.g.position,dx=o.x-pos.x,dz=o.z-pos.z,d=Math.hypot(dx,dz);if(d<6&&(dx*Math.sin(yaw)+dz*Math.cos(yaw))/(d||1)>.88){BURG.hp--;sayText(burgB,pick(['אוי! רטוב!','החולצה שלי!','רגע רגע!']),1.2,'say',true);if(BURG.hp<=0){dv.kos++;addScore(800,'הפורץ ברח!');sayText(burgB,'טוב טוב! אני הולך! כלבים זה לא בשבילי!',2.4,'say',true);if(window.JUICE_READY){slowMo(.5);pow('ניצחון!',o.x,2.8,o.z,true)}const g=BURG.g;setTimeout(()=>g.visible=false,1800);dv.burglar=null}return true}return false}
const _dShoot=dShoot;dShoot=function(){const before=ds.shootCool;_dShoot();if(before<=0){dHitBurglar();dHitKing()}};
// ---------- context buttons ----------
CTX_HOOKS.act.unshift(()=>{if(!DETECT)return null;const c=dCase();
 if(!c.night&&ds.phase==='investigate'){for(const cl of c.clues){if(ds.found.has(cl.id))continue;const p=cl.pos();if(Math.hypot(pos.x-p.x,pos.z-p.z)<1.7)return {i:cl.witness?'🗣️':'🔍',l:cl.witness?'לחקור עד':'לבדוק רמז',on:1,fn:()=>dInspect(cl)}}
  if(ds.found.size>=2)return {i:'☝️',l:'להאשים!',on:ds.found.size>=c.clues.length?1:0,fn:dAccuse}}
 return {i:'💦',l:'שפריץ!',on:1,fn:dShoot}});
function dSniff(){if(ds.sniffCool>0)return;const c=dCase();const left=c.clues.filter(x=>!ds.found.has(x.id));if(!left.length)return;ds.sniffCool=rankIdx()>=2?4:8;ds.sniffT=3.5;
 let b=null,bd=1e9;for(const cl of left){const p=cl.pos(),d=Math.hypot(p.x-pos.x,p.z-pos.z);if(d<bd){bd=d;b=p}}ds.sniffTo=b;sayText(dmB,pick(['👃 סניף סניף... משהו פה מריח חשוד','👃 אני מריח... רמז!','👃 האף לא משקר']),1.8,'think',true);ds.lookT=1}
CTX_HOOKS.grab.unshift(()=>DETECT&&!dCase().night&&ds.phase==='investigate'&&ds.found.size<dCase().clues.length?{i:'👃',l:ds.sniffCool>0?'רחרוח '+Math.ceil(ds.sniffCool):'רחרוח!',on:ds.sniffCool>0?0:1,fn:dSniff}:null);
// ---------- mode plumbing ----------
function dApply(on){document.body.classList.toggle('detective',on);if(!on){DM.g.visible=false;dHideEvidence();dvReset();evtPill.hidden=true;for(const id of ['dAccuse','dEnd','dBoard'])document.getElementById(id).hidden=true}else{setTimeout(dBoard,50)}}
function setDetective(on){DETECT=on;if(on){if(HUMAN){HUMAN=false;hApply(false)}if(ZOMBIE){ZOMBIE=false;zApply(false)}}try{localStorage.setItem('milky-mode',on?'detective':'open')}catch(_){}OPEN_WORLD=true;document.body.classList.toggle('openWorld',true);reset();owApply();dApply(on)}
document.getElementById('startDetective').addEventListener('click',()=>{setDetective(true);startGame()});
for(const id of ['start','startOpen','startZombie','startHuman'])document.getElementById(id).addEventListener('click',()=>{if(DETECT){DETECT=false;dApply(false)}},true);
{const b=document.createElement('button');b.className='chip';b.type='button';b.textContent='🕵️ הבלש מילקי';b.addEventListener('click',()=>{setDetective(!DETECT);b.textContent=DETECT?'🐕 לחזור להיות כלב':'🕵️ הבלש מילקי'});document.getElementById('challengePanel').appendChild(b)}
for(const id of ['modeSwitch','zSwitch'])document.getElementById(id).addEventListener('click',()=>{if(DETECT){DETECT=false;dApply(false)}},true);
const _nth4=nextTaskHint;nextTaskHint=function(){if(!DETECT)return _nth4();const c=dCase();if(c.night)return dv.burglar?'💦 שפריץ על הפורץ לפני שהוא לוקח את הכורסה!':'💦 שפריץ על הדביבונים לפני שהם מגיעים למקרר!';
 if(ds.phase!=='investigate')return '🕵️ הבלש מילקי';const left=c.clues.filter(x=>!ds.found.has(x.id));return left.length?'🔍 חפש רמזים (🔍) · 👃 רחרוח מראה את הדרך · נשארו '+left.length:'☝️ לחץ "להאשים!" ובחר מי עשה את זה'};
const _ct4=currentTarget;currentTarget=function(){if(!DETECT)return _ct4();if(!guideOn)return null;const c=dCase();if(c.night){if(dv.boss)return KING.g.position;if(dv.burglar)return BURG.g.position;let b=null,bd=1e9;for(const r of dv.list)if(r.on&&!r.flee){const d=Math.hypot(r.g.position.x-pos.x,r.g.position.z-pos.z);if(d<bd){bd=d;b=r.g.position}}return b}
 if(ds.phase!=='investigate')return null;let b=null,bd=1e9;for(const cl of c.clues){if(ds.found.has(cl.id))continue;const p=cl.pos(),d=Math.hypot(p.x-pos.x,p.z-pos.z);if(d<bd){bd=d;b=p}}return b};
const _uow3=updateOpenWorld;updateOpenWorld=function(dt){if(!DETECT)return _uow3(dt);if(!day.finished)owApply();for(const s of Object.values(OW_MARKS))s.visible=false;if(!rain.visible)day.light=dCase().night?3:2;updateDetective(dt)};
function updateDetective(dt){
 const t=performance.now()/1000;ds.sniffCool=Math.max(0,ds.sniffCool-dt);
 if(ds.sniffT>0&&ds.sniffTo){ds.sniffT-=dt;const p=ds.sniffTo,dx=p.x-pos.x,dz=p.z-pos.z,d=Math.hypot(dx,dz)||1;if(Math.random()<dt*14){const k=Math.random()*Math.min(d,12);emit(pos.x+dx/d*k+(Math.random()-.5)*.2,.15,pos.z+dz/d*k+(Math.random()-.5)*.2,0,.6,0,'dust',.9)}}
 magG.children[0].material.color.setHex(rankIdx()>=3?0xf2c14e:0x6b4a2a);badge.visible=rankIdx()>=4;ds.lookT=Math.max(0,ds.lookT-dt);ds.shootT=Math.max(0,ds.shootT-dt);ds.shootCool=Math.max(0,ds.shootCool-dt);
 const c=dCase();
 if(!c.night&&ds.phase==='investigate'){c.clues.forEach((cl,i)=>{const s=CLUE_SPR[i];if(ds.found.has(cl.id)){s.visible=false;return}const p=cl.pos();s.visible=true;s.position.set(p.x,(cl.witness?2.0:.9)+Math.sin(t*2.4+i)*.1,p.z)});dPill()}
 else CLUE_SPR.forEach(s=>s.visible=false);
 if(c.night&&ds.phase==='investigate'){updateDefense(dt);if(!dv.over)dPill()}
}
if(DETECT)OPEN_WORLD=true;
window.DET_READY=true;
setTimeout(()=>{if(DETECT){owApply();document.body.classList.add('detective')}},0);
