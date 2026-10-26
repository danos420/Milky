// ===== Human Milky goes on 10 dates. Nine end in a fiasco; in every one of them Noa was there. The tenth is her =====
var DATES=false;
partMats.heart=new THREE.MeshBasicMaterial({color:0xff5d8f});
function hearts(x,y,z,n=14){for(let i=0;i<n;i++)emit(x,y,z,(Math.random()-.5)*2.6,2.4+Math.random()*2,(Math.random()-.5)*2.6,'heart',1.2)}
// phone tier: things built after load get the same cheap materials as the rest of the world
function tierize(o){let t='high';try{t=tier}catch(_){return}if(t==='high'||typeof lambertOf!=='function')return;o.traverse(m=>{if(!m.isMesh)return;const s=m.userData.std||(m.material.isMeshStandardMaterial?m.material:null);if(!s)return;m.userData.std=s;m.material=lambertOf(s)})}
// ---------- hair for the dates ----------
const HAIR={
 long:c=>h=>{const m=mat(c);const b=ball(.36,m,0,.08,-.08,h);b.scale.set(1.04,1.02,1);box(.6,.62,.16,m,0,-.3,-.22,h)},
 bob:c=>h=>{const m=mat(c);const b=ball(.37,m,0,.07,-.08,h);b.scale.set(1.08,.98,1)},
 bun:c=>h=>{const m=mat(c);const b=ball(.35,m,0,.1,-.08,h);b.scale.set(1,.82,1);ball(.15,m,0,.4,-.12,h)},
 pony:c=>h=>{const m=mat(c);const b=ball(.35,m,0,.1,-.08,h);b.scale.set(1,.82,1);const p=cyl(.08,.5,m,0,-.08,-.4,h);p.rotation.x=.5},
 curly:c=>h=>{const m=mat(c);ball(.31,m,0,.17,-.08,h);for(let i=0;i<14;i++){const a=i/14*Math.PI*2;if(Math.sin(a)>.55)continue;ball(.12,m,Math.cos(a)*.3,.14+Math.sin(i*1.7)*.05,Math.sin(a)*.3-.08,h)}}
};
// ---------- the café on the square, the flower stall ----------
const CAFE={t1:V(-6,0,133),t2:V(-1,0,136),counter:V(-10,0,140.6),flowers:V(30,0,121)};
const CAFE_CHAIRS=[];
{const g=ZG.roads;
 for(const t of [CAFE.t1,CAFE.t2]){cyl(.55,.06,mat(0xf6f1e7,.5),t.x,.78,t.z,g);cyl(.06,.78,mat(0x5a4a3a),t.x,.39,t.z,g);cyl(.04,2.3,mat(0x5a4a3a),t.x,1.15,t.z,g);
  const u=mesh(new THREE.ConeGeometry(1.5,.6,10),mat(0xe85d75,.7),t.x,2.4,t.z,g);u.castShadow=true;obstacles.push({name:'שולחן בבית קפה',x:t.x,z:t.z,w:1.1,d:1.1,top:.81});
  for(const s of [-1,1]){const c=new THREE.Group();c.position.set(t.x+s*1.05,0,t.z);g.add(c);box(.5,.06,.5,mat(0x8b5a3a),0,.48,0,c);box(.06,.5,.5,mat(0x8b5a3a),s*.24,.75,0,c);for(const [a,b] of [[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]])box(.05,.48,.05,mat(0x5a4a3a),a,.24,b,c);CAFE_CHAIRS.push(c)}}
 box(3,1.05,.8,mat(0x7a3e2e,.7),CAFE.counter.x,.52,CAFE.counter.z,g);box(3.1,.06,.9,mat(0xf6f1e7,.5),CAFE.counter.x,1.06,CAFE.counter.z,g);obstacles.push({name:'הדלפק של נועה',x:CAFE.counter.x,z:CAFE.counter.z,w:3,d:.8,top:1.06,solid:true});
 cyl(.12,.3,mat(0xffffff,.4),CAFE.counter.x-.8,1.24,CAFE.counter.z,g);cyl(.12,.3,mat(0xffffff,.4),CAFE.counter.x-.4,1.24,CAFE.counter.z,g);
 signBoard(g,'☕ הקפה של נועה',CAFE.counter.x,2.5,CAFE.counter.z+.45,0,3.4);
 const F=CAFE.flowers;box(2.2,.8,1,mat(0x6b4a32),F.x,.4,F.z,g);obstacles.push({name:'דוכן פרחים',x:F.x,z:F.z,w:2.2,d:1,top:.8,solid:true});
 for(let i=0;i<9;i++){const x=F.x-.8+(i%3)*.8,z=F.z-.25+Math.floor(i/3)*.25;cyl(.03,.4,mat(0x3f7a3c),x,1,z,g);ball(.11,mat([0xe85d75,0xf2c14e,0xff8fb1,0x9b59b6][i%4],.6),x,1.22,z,g)}
 signBoard(g,'🌷 פרחים · 3 ₪ לצנצנת',F.x,2.1,F.z-.55,Math.PI,2.8)}
// chairs that fall over before the last date
const FALLEN=[[-3.5,131.2],[.6,138.6],[-8.6,136.2]].map(([x,z],i)=>{const c=new THREE.Group();c.position.set(x,0,z);c.rotation.set(0,i*1.3,Math.PI/2);ZG.roads.add(c);box(.5,.06,.5,mat(0x8b5a3a),0,.3,0,c);box(.06,.5,.5,mat(0x8b5a3a),.24,.55,0,c);c.visible=false;return c});
// things human Milky carries (held in front of the face like the milk carton)
const heldG=(x)=>{const g=new THREE.Group();g.position.set(0,-.18,.66);headPivot.add(g);x(g);g.visible=false;return g};
const flowersG=heldG(g=>{for(let i=0;i<5;i++){const a=i/5*6.28;cyl(.02,.32,mat(0x3f7a3c),Math.cos(a)*.04,-.1,Math.sin(a)*.04,g);ball(.07,mat([0xe85d75,0xf2c14e,0xff8fb1][i%3],.6),Math.cos(a)*.08,.08,Math.sin(a)*.08,g)}mesh(new THREE.ConeGeometry(.12,.26,8),mat(0xf6f1e7),0,-.18,0,g).rotation.x=Math.PI});
const conesG=heldG(g=>{for(const s of [-1,1]){const c=mesh(new THREE.ConeGeometry(.08,.22,8),mat(0xd9a557),s*.11,-.06,0,g);c.rotation.x=Math.PI;ball(.09,mat(s<0?0xff8fb1:0x7a4e1e,.6),s*.11,.08,0,g)}});
const frisbeeG=heldG(g=>{cyl(.22,.04,mat(0xff3fa0,.5),0,0,0,g)});
const frisbee=new THREE.Group();scene.add(frisbee);cyl(.22,.04,mat(0xff3fa0,.5),0,0,0,frisbee);frisbee.visible=false;
const sandwich=new THREE.Group();scene.add(sandwich);box(.3,.05,.22,mat(0xe9c46a),0,0,0,sandwich);box(.3,.04,.22,mat(0x6aa86b),0,.04,0,sandwich);box(.3,.05,.22,mat(0xe9c46a),0,.08,0,sandwich);sandwich.visible=false;
const blanket=new THREE.Group();scene.add(blanket);{for(let i=0;i<4;i++)for(let j=0;j<4;j++)box(.5,.02,.5,mat((i+j)%2?0xe74c3c:0xf6f1e7),-.75+i*.5,.02,-.75+j*.5,blanket);const bk=box(.5,.35,.35,mat(0xb5894a),.6,.18,.6,blanket)}blanket.visible=false;
// ---------- the people ----------
function datePerson(c){const P=makePerson(c);P.g.visible=false;P.b=makeBubble(P.g,3.1);tierize(P.g);return P}
const NOA=datePerson({skin:0xe2b48c,shirt:0x2f4858,apron:0x7a3e2e,pants:0x333333,shoes:0x222222,hair:HAIR.pony(0x3b2416)});
for(const p of [...NOA.face.parts,NOA.mouth])KEEP.add(p); // expressions must stay separate meshes
const noaHat=new THREE.Group();noaHat.position.set(0,.3,.02);NOA.head.add(noaHat);{const fm=mat(0x3a3a42,.6);cyl(.3,.04,fm,0,0,0,noaHat);cyl(.18,.2,fm,0,.11,0,noaHat);cyl(.185,.04,mat(0xc0392b),0,.04,0,noaHat)}noaHat.visible=false;
let POODLE=null;const poodle=()=>{if(!POODLE){POODLE=makeDog({name:'שוקו',color:0xf2efe6,color2:0xe2dccd,size:.55,speed:2.5,fluffy:true,x:0,z:-200});POODLE.g.visible=false;tierize(POODLE.g)}return POODLE};
// ---------- the ten dates ----------
// steps: say [[who,text,dur?,mood?]], go {at,label,icon,r,timer}, sit [x,z,yaw], ask {q,opts:[[text,charm,who,reply]]},
//        mini {label,n,speed}, still {label,sec,fx}, act {start,update(dt)->done,hint,target}, fn, wait, end {text,win}
const DATE_LIST=[
 {id:'michal',icon:'☕',title:'קפה עם מיכל',look:{skin:0xf0c8a0,shirt:0xe85d75,dress:0xe85d75,pants:0xf0c8a0,shoes:0xf6f1e7,hair:HAIR.long(0xe8cf8a)},
  at:[-4.85,133,-Math.PI/2],noa:[-8.2,139.4,Math.PI*.9],start:[6,124,-Math.PI/2],
  steps:[{say:[['m','🎩 דייט ראשון. פרחים, קפה, להתנהג כמו בן אדם. אני יכול.']]},
   {go:{at:()=>V(CAFE.flowers.x,0,CAFE.flowers.z-1.2),label:'לקנות פרחים',icon:'🌹'}},{fn:()=>{flowersG.visible=true}},{say:[['m','🌹 שלושה שקל לצנצנת. אני אזרח הגון.',1.8]]},
   {go:{at:()=>V(-7.15,0,133),label:'לתת פרחים ולשבת',icon:'🪑'}},{sit:[-7.15,133,Math.PI/2]},{fn:()=>{flowersG.visible=false}},
   {say:[['d','וואו, פרחים! איזה ג׳נטלמן',2,'love'],['n','ערב טוב, מה להביא לכם?']]},
   {ask:{q:'נועה המלצרית מחכה. מה להזמין?',opts:[['☕ שני הפוכים, בבקשה',15,'n','מיד!'],['🥛 קערה של מים... זאת אומרת, כוס',5,'n','...בכוס. אוקיי.'],['🦴 מה יש לכם עם עצם?',-10,'n','יש לנו עוף בסלט. בלי עצם.']]}},
   {say:[['d','אז... ספר לי על עצמך']]},
   {ask:{q:'מה לספר על עצמך?',opts:[['🧯 אני טכנאי כיבוי וגילוי אש',15,'d','וואו, כמו גיבור!'],['🐕 אני אוהב טיולים ארוכים... ולרחרח עמודים',-10,'d','...לרחרח?'],['🛋️ אני ישן 14 שעות ביום',5,'d','חח, הלוואי עליי']]}},
   {say:[['d','אפצ׳י!',1.4,'shock'],['d','אפצ׳י!!! סליחה... אני אלרגית לכלבים',2.2,'sad'],['m','🎩 ...אבל אני לא כלב',1.8],['d','אפצ׳י!!! ...יש לך זנב.',2,'confused'],['m','😳 ...זה חגורה',1.6],['d','אפצ׳י!!!! ביי!!!',1.6,'angry']],fx:()=>{for(let k=0;k<5;k++)dtLater(k*.9,()=>{const p=DT.P.g.position;for(let i=0;i<12;i++)emit(p.x,2.4,p.z,(Math.random()-.5)*3,1+Math.random()*2,(Math.random()-.5)*3,'foam',.9);chaosShake=Math.max(chaosShake,.15)})}},
   {fn:()=>dtLeave()},{say:[['n','רוצה את החשבון? ...ואת הפרחים בחזרה?',2.4,'smug']]},
   {end:{text:'היא אלרגית... לכלבים'}}]},
 {id:'liat',icon:'🍝',title:'ספגטי עם ליאת',look:{skin:0xd8a07a,shirt:0x9b59b6,dress:0x9b59b6,pants:0xd8a07a,shoes:0x333333,hair:HAIR.curly(0x2a1a12)},
  at:[21.5,24.2,Math.PI/2],noa:[24.2,26.4,-Math.PI/2],start:[24.2,28.4,Math.PI],who:{chef:()=>chefB},
  steps:[{say:[['m','🎩 דייט שני. ספגטי לשניים, כמו בסרט. מה כבר יכול לקרות.']]},
   {go:{at:()=>V(23.45,0,24.2),label:'לשבת עם ליאת',icon:'🍝'}},{sit:[23.45,24.2,-Math.PI/2]},
   {say:[['d','הזמנתי לנו צלחת אחת לשניים. כמו בסרט!',2.2,'love'],['n','גם פה אני עובדת. אל תשאל.',2],['m','🎩 ...נועה?',1.4],['chef','מאמא מיה, כלב בדייט. ראיתי הכל',2]]},
   {ask:{q:'איך מתחילים לאכול?',opts:[['🍴 עם מזלג וסכין, כמו בן אדם',15,'d','איזה מנומס!'],['👅 קודם מלקקים את הצלחת',-10,'d','...מה?'],['🎩 קודם את, גברתי',10,'d','חמוד']]}},
   {mini:{label:'🍝 לאכול לאט ומנומס',n:5,speed:2.6}},
   {say:[['d','עכשיו... החוט האחרון. כל אחד מצד אחר',2.2,'love']]},
   {say:[['m','👄 *סלארפ*',1.2],['m','😳 ...בלעתי את כל הצלחת',1.8],['d','...ואת הקציצה שלי',1.8,'shock'],['m','🎩 ...ואת המפה',1.6]],fx:()=>dtLater(3.4,()=>{showBurst(22.4,24.2);chaosShake=.4;if(window.JUICE_READY){slowMo(.5);pow('קראאאש!!',22.4,2,24.2,true)}})},
   {say:[['chef','המפה!!! הצלחות!!! מאמא מיה!!!',2],['d','אני הולכת.',1.6,'angry']]},{fn:()=>dtLeave()},{say:[['n','אני מוסיפה את המפה לחשבון',2,'smug']]},
   {end:{text:'אכל את הספגטי, את הקציצה ואת המפה'}}]},
 {id:'roni',icon:'🧺',title:'פיקניק ביער עם רוני',look:{skin:0xe2b48c,shirt:0x6aa86b,pants:0x8b6b4a,shoes:0x5a4a3a,hair:HAIR.bun(0xa0522d)},
  at:[79.4,114.6,Math.PI*.75],noa:[87.6,112.6,-Math.PI/2],start:[84,109.5,-Math.PI*.8],
  setup:()=>{blanket.position.set(80.6,0,113.6);blanket.visible=true},
  steps:[{say:[['m','🎩 פיקניק ביער. אוויר צח, סנדוויצ׳ים. אין מה שישתבש.']]},
   {go:{at:()=>V(81.6,0,112.6),label:'לשבת על השמיכה',icon:'🧺'}},{sit:[81.6,112.6,-Math.PI*.78]},
   {say:[['d','איזה שקט פה... רק הציפורים והנחל',2.2,'love'],['n','שקט? אני מדריכה פה 40 צופים. בהצלחה.',2.2]]},
   {ask:{q:'מה להגיד לרוני?',opts:[['🌲 את יותר יפה מהיער',15,'d','אוווו'],['🐿️ את חושבת שסנאים טעימים?',-10,'d','...אני צמחונית'],['🥪 הכנתי סנדוויצ׳ים',10,'d','מושלם!']]}},
   {fn:()=>{const S=FOR.squirrel;S.g.position.set(82.6,0,114.8);S.state='ground';S.target=null;sandwich.visible=true;showBanner('🐿️ הסנאי גנב את הסנדוויץ׳!!!');DT.stand=true}},
   {say:[['d','הסנדוויץ׳!',1.2,'shock']]},
   {act:{hint:'🐿️ תפוס את הסנאי! (הוא בורח לעצים)',target:()=>FOR.squirrel.g.position,start:()=>{DT.seat=null;DT.caught=false},
    update:dt=>{const so=FOR.squirrel.g.position;sandwich.position.set(so.x,so.y+.3,so.z);if(Math.hypot(pos.x-so.x,pos.z-so.z)<1.15&&so.y<1&&jumpY<.9){DT.caught=true;dtCharm(15);return true}return DT.st.t>30}}},
   {fn:()=>{sandwich.visible=false;FOR.squirrel.state='climb';FOR.squirrel.climb=0;if(!DT.caught){DT.charm-=10}}},
   {say:()=>DT.caught?[['m','🎩 תפסתי! הנה הסנדוו...',1.6],['d','תעזוב אותו!!! אני מתנדבת בעמותה להצלת סנאים!!!',2.4,'angry'],['m','😳 ...הוא גנב לנו את האוכל',1.8],['d','הוא היה רעב! אתה מפלצת!',2,'angry']]
     :[['m','😰 ...הוא אכל הכל. גם את העוגה.',2],['d','זה בסדר, הוא רעב. אבל אתה רדפת אחריו עשר דקות.',2.4,'sad']]},
   {fn:()=>dtLeave()},{say:[['n','היא מתנדבת גם בעמותה להצלת עכברים. רק שתדע',2.4,'smug']]},
   {end:{text:()=>DT.caught?'תפס את הסנאי. היא מצילה סנאים':'הסנאי אכל את כל הפיקניק'}}]},
 {id:'shira',icon:'🥏',title:'שקיעה בחוף עם שירה',look:{skin:0xc99067,shirt:0xf2c14e,shorts:0x3a7bd5,bareArms:true,shoes:0xf6f1e7,hair:HAIR.long(0x5a3a22)},
  at:[34,194,Math.PI],noa:[40,206.6,Math.PI],start:[30,184,0],
  steps:[{say:[['m','🎩 שקיעה בחוף. חול, גלים... ופריזבי. אסור להתרגש מפריזבי.']]},
   {go:{at:()=>V(34,0,192.4),label:'להגיד שלום',icon:'👋'}},{sit:[34,192.4,0]},
   {say:[['d','היי! אני משחקת פריזבי עם האחיין שלי, אכפת לך?',2.4]]},
   {ask:{q:'מה לענות לשירה?',opts:[['🎩 בכלל לא! פריזבי לא מעניין אותי',15,'d','מעולה'],['😤 פריזבי זה לא משחק, זה אורח חיים',-5,'d','...אוקיי?'],['🌅 בואי נסתכל על השקיעה',10,'d','רומנטי!']]}},
   {still:{label:'🧘 אל תרדוף אחרי הפריזבי!',sec:6,start:()=>{frisbee.visible=true},fx:(dt,t)=>{const k=(Math.sin(t*1.6)+1)/2;frisbee.position.set(34+(44-34)*k,1.4+Math.sin(k*Math.PI)*2.4,194+(202-194)*k);frisbee.rotation.y+=dt*12}}},
   {say:[['d','רואה? אתה בכלל לא כמו... אוקיי, זריקה אחרונה. לים!',2.4]]},
   {act:{hint:'🥏 ...',start:()=>{DT.seat=null;DT.auto=[[38,217.5],[34.6,195.6]];frisbee.position.set(34,1.6,194);DT.fz=0},
    update:dt=>{DT.fz+=dt;if(frisbee.visible){const k=Math.min(1,DT.fz/1.2);frisbee.position.set(34+4*k,1.6+Math.sin(k*Math.PI)*3,194+23.5*k)}
     const P=DT.auto[0];if(!P)return true;const dx=P[0]-pos.x,dz=P[1]-pos.z,d=Math.hypot(dx,dz);yaw=Math.atan2(dx,dz);curSpeed=0;
     if(d<.4){DT.auto.shift();if(DT.auto.length===1){frisbee.visible=false;frisbeeG.visible=true;for(let i=0;i<20;i++)emit(pos.x,.4,pos.z,(Math.random()-.5)*4,3+Math.random()*2,(Math.random()-.5)*4,'water',1)}}else{const s=Math.min(d,10*dt);pos.x+=dx/d*s;pos.z+=dz/d*s}
     DT.lock=[pos.x,pos.z];return false}}},
   {say:[['m','🥏 *מביא את הפריזבי בפה*',1.8],['d','...זה מלא ריר',1.8,'shock'],['m','🎩 ...ומדוזה',1.6],['d','אחיין, אנחנו הולכים.',1.8,'angry']]},
   {fn:()=>{frisbeeG.visible=false;dtLeave()}},{say:[['n','אני המצילה פה. ראיתי הכל. לא הצלתי. צפיתי.',2.6,'smug']]},
   {end:{text:'רץ לים אחרי הפריזבי. חזר עם ריר ומדוזה'}}]},
 {id:'dana',icon:'🍦',title:'גלידה עם דנה',look:{skin:0xf0c8a0,shirt:0x7fd3ff,dress:0x7fd3ff,pants:0xf0c8a0,shoes:0xffffff,hair:HAIR.bob(0xd35400)},
  at:[50,192,-Math.PI/2],noa:[30,172.4,0],start:[24,180,Math.PI*.75],who:{vendor:()=>BCH.vendorB},
  steps:[{say:[['m','🎩 דנה מחכה על החוף. שתי גלידות, לפני שהן נמסות.']]},
   {go:{at:()=>V(BCH.stall.x,0,BCH.stall.z+1.5),label:'לקנות שתי גלידות',icon:'🍦'}},{fn:()=>{conesG.visible=true}},
   {say:[['vendor','שתיים? לכלב עם כובע? ...עשר שקל',1.8],['n','זאת הגלידרייה של אבא שלי. כן. גם פה.',2.2]]},
   {go:{at:()=>V(48.6,0,192),label:'לתת לדנה',icon:'🍦',timer:16,melt:'🍦 הגלידה נמסה...'}},{sit:[48.6,192,Math.PI/2]},
   {say:[['d','אוי, תודה! איזה טעם לקחת לי?',2]]},
   {ask:{q:'איזה טעם לקחת לה?',opts:[['🍓 תות, כמו הלחיים שלך',15,'d','חחח איזה קיטש'],['🦴 טעם עצם. מאוד פופולרי',-10,'d','...יש דבר כזה?'],['🍫 שוקולד... רגע, שוקולד מסוכן לכלבים',5,'d','למה זה משנה לך?']]}},
   {say:[['d','רוצה לטעום משלי?',1.8,'smile'],['m','👅 רק ביס קט...',1.4]],fx:()=>dtLater(3.2,()=>{conesG.visible=false;milkyThought('😋',1,true)})},
   {say:[['d','...ליקקת את כל הכדור',1.8,'shock'],['m','🎩 ...ואת הגביע',1.4],['d','ואת היד שלי!!!',1.8,'angry'],['vendor','אין החזרות!',1.6]]},
   {fn:()=>dtLeave()},{say:[['n','אבא, זה הוא. זה מהבית קפה.',2.2,'smug']]},
   {end:{text:'ליקק לדייט את הגלידה. ואת היד'}}]},
 {id:'yaara',icon:'💃',title:'ריקודים עם יערה',look:{skin:0xbf8358,shirt:0xff3fa0,dress:0xff3fa0,pants:0xbf8358,shoes:0x222222,hair:HAIR.pony(0x1a1a1a)},
  at:[-12,86,Math.PI/2],noa:[-18,90,Math.PI/2],start:[-4,82,-Math.PI/2],who:{kid:()=>SCH.kids[0].b},
  steps:[{say:[['m','🎩 ערב ריקודים בחצר של בית הספר. אני רוקד מעולה. על ארבע.']]},
   {go:{at:()=>V(-10.6,0,86),label:'להזמין לרקוד',icon:'💃'}},{sit:[-10.6,86,-Math.PI/2]},
   {say:[['d','בוא נראה מה אתה שווה!',1.8,'smug'],['n','אני מורה מחליפה פה היום. אל תשאל.',2]]},
   {ask:{q:'איזה ריקוד?',opts:[['🕺 טנגו!',10,'d','אולה!'],['💃 סלסה!',10,'d','יאללה!'],['🐕 הריקוד של הזנב',-5,'d','...של מה?']]}},
   {mini:{label:'💃 לרקוד בקצב',n:6,speed:3.4}},
   {say:[['d','וואו, אתה באמת יודע לרקוד!',1.8,'love'],['m','🌀 ...רגע. מה זה שם מאחורה?',1.8]]},
   {act:{hint:'🌀 ...',start:()=>{DT.spin=2.4},update:dt=>{DT.spin-=dt;yaw+=dt*15;DT.seatYaw=yaw;if(DT.spin<.9&&!DT.fell){DT.fell=true;chaosShake=.35;if(window.JUICE_READY)pow('בום!',DT.P.g.position.x,2.4,DT.P.g.position.z,true)}if(DT.fell){DT.P.g.rotation.z=Math.min(Math.PI/2,DT.P.g.rotation.z+dt*6);DT.P.g.position.y=.3}return DT.spin<=0}}},
   {say:[['m','😵 הזנב שלי! כמעט תפסתי אותו!',2],['d','...הפלת אותי לשער',2,'angry'],['kid','גוללללל!!!',1.6]]},
   {fn:()=>{DT.P.g.rotation.z=0;DT.P.g.position.y=0;dtLeave()}},{say:[['n','בתור מורה, אני נותנת לך 2. על המאמץ.',2.2,'smug']]},
   {end:{text:'רדף אחרי הזנב באמצע טנגו'}}]},
 {id:'yael',icon:'🍢',title:'להכיר את אבא של יעל',look:{skin:0xe2b48c,shirt:0xffffff,pants:0x3e5f8a,shoes:0xf6f1e7,hair:HAIR.long(0x3b3b3b)},
  at:[5,-30.4,-Math.PI*.8],noa:[11,-14,Math.PI],start:[8,-20,Math.PI],who:{dad:()=>nbB},
  setup:()=>{if(kebabState!=='grill')kebabBack();nbState='grill'},
  steps:[{say:[['m','🎩 היום פוגשים את אבא של יעל. על האש. אני אהיה מושלם.']]},
   {go:{at:()=>V(5.6,0,-28.8),label:'להכיר את המשפחה',icon:'🤝'}},{sit:[5.6,-28.8,Math.PI*.8]},
   {say:[['d','אבא, זה מילקי!',1.6,'love'],['dad','...אני מכיר אותך מאיפשהו',2.2]]},
   {ask:{q:'מה להגיד לאבא שלה?',opts:[['🎩 נעים מאוד, אדוני',15,'dad','...מנומס. חשוד.'],['🍢 איזה קבב מריח מדהים!',-10,'dad','...עכשיו אני בטוח שאני מכיר אותך'],['🧯 אני בכיבוי וגילוי אש, אם צריך',10,'dad','סוף סוף מישהו שימושי']]}},
   {still:{label:'🧘 לא להסתכל על הקבב...',sec:7,fx:(dt,t)=>{if(Math.random()<dt*8)emit(2+(Math.random()-.5)*.6,1.2,-32.4+(Math.random()-.5)*.4,(Math.random()-.5)*.4,1.4,(Math.random()-.5)*.4,'smoke',1.4);if(Math.random()<dt*.4)milkyThought('🤤',1,true)}}},
   {say:[['m','🤤 ...רק להריח',1.4]],fx:()=>dtLater(1.4,()=>{DT.seat=null;pos.set(2.4,0,-31.4);if(kebabState==='grill')stealKebab()})},
   {say:[['dad','הקבב שלי!!! זה הכלב!!! ידעתי!!!',2],['d','אבא?!',1.4,'shock'],['m','😳 ...זה היה האינסטינקט',1.8],['d','אתה הכלב שגונב לאבא שלי קבב?!',2.2,'angry']]},
   {fn:()=>dtLeave()},{say:[['n','משלוח של קבב לשכן... אה. מאוחר מדי.',2.4,'smug']]},
   {end:{text:'גנב קבב מאבא שלה. שוב.'}}]},
 {id:'orit',icon:'📸',title:'סלפי עם אורית',look:{skin:0xf0c8a0,shirt:0xffd1dc,dress:0xffd1dc,pants:0xf0c8a0,shoes:0xffffff,hair:HAIR.long(0xf5e6b8)},
  at:[11.5,126.3,Math.PI*.92],noa:[17.4,129.6,-Math.PI/2],start:[13,120,0],
  steps:[{say:[['m','🎩 אורית משפיענית. 200 אלף עוקבים. צריך לצאת טוב בתמונות.']]},
   {go:{at:()=>V(13.3,0,126.9),label:'לעשות סלפי',icon:'📸'}},{sit:[13.3,126.9,Math.PI]},
   {say:[['d','אוקיי, תחייך! על שלוש!',1.6,'smile']]},
   {mini:{label:'📸 לחייך בדיוק בקליק',n:3,speed:3}},
   {ask:{q:'אורית: "מה לכתוב בפוסט?"',opts:[['💘 "דייט מושלם"',15,'d','חמוד!'],['🐕 "#מי_כלב_טוב"',-5,'d','...למה?'],['🎩 "עם בן אדם רגיל לגמרי"',5,'d','חשוד, אבל אוקיי']]}},
   {say:[['d','עוד אחת! הכי טובה! תישען אחורה!',1.8,'smile']],fx:()=>dtLater(1.9,()=>{DT.seat=null;startRagdoll();rag.vx=0;rag.vz=5;rag.vy=5;for(let k=0;k<4;k++)dtLater(.4+k*.2,()=>{for(let i=0;i<16;i++)emit(13+(Math.random()-.5)*2,.6,129+(Math.random()-.5)*2,(Math.random()-.5)*4,3+Math.random()*3,(Math.random()-.5)*4,'water',1)});if(window.JUICE_READY){slowMo(.6);pow('שפלאש!!',13,2,129,true)}})},
   {say:[['m','😱 אאאאא',1.4],['d','אוי וואו... זה יצא פנטסטי. אני מעלה את זה!',2.2,'laugh'],['m','💦 ...אני רטוב',1.6],['d','שני מיליון צפיות! תודה! ביי!',2,'laugh']]},
   {fn:()=>dtLeave()},{say:[['n','אני מנקה את המזרקה בימי שלישי. היום רביעי.',2.4,'smug']]},
   {end:{text:'נפל למזרקה בשידור חי'}}]},
 {id:'galit',icon:'🐩',title:'גלית והפודל שוקו',look:{skin:0xd8a07a,shirt:0x2c3e50,pants:0x2c3e50,shoes:0x8b5a3a,hair:HAIR.bun(0x8b5a2b)},
  at:[32,136,-Math.PI/2],noa:[36,130,-Math.PI/2],start:[24,128,Math.PI/4],who:{poodle:()=>poodle().b},
  setup:()=>{const D=poodle();D.g.visible=true;D.g.position.set(31,0,134.8)},
  steps:[{say:[['m','🎩 גלית מביאה את הפודל שלה לדייט. אני אהיה נחמד. בן אדם נחמד.']]},
   {go:{at:()=>V(30.4,0,136),label:'להכיר את גלית ושוקו',icon:'🐩'}},{sit:[30.4,136,Math.PI/2]},
   {say:[['d','זה שוקו. הוא צריך לאשר אותך',2,'smile'],['n','אני מוציאה פה כלבים בבקרים. גם את שוקו.',2.2]]},
   {ask:{q:'מה להגיד לשוקו?',opts:[['🎩 שלום שוקו, מה נשמע?',10,'poodle','גררר'],['🐕 *לרחרח אותו בחזרה*',-10,'d','...אתה מרחרח את הכלב שלי?'],['💘 שוקו, אני מבטיח לשמור עליה',15,'d','אוווו']]}},
   {still:{label:'🧘 לשבת יפה כששוקו מרחרח',sec:6,fx:(dt,t)=>{const D=poodle(),a=t*1.8;D.g.position.set(pos.x+Math.cos(a)*1.1,0,pos.z+Math.sin(a)*1.1);D.g.rotation.y=-a;D.walk+=dt*8;D.legs.forEach((l,i)=>l.rotation.x=Math.sin(D.walk+(i===0||i===3?0:Math.PI))*.7)}}},
   {say:[['poodle','הב!',1],['m','🎩 ...הב',1],['poodle','הב!! הב!!',1.2],['m','🐕 הב!!! הב הב!!! ווווף!!!',1.6]],fx:()=>dtLater(4.4,()=>{hat.visible=false;hatFly.visible=true;hatFly.position.set(pos.x,2.2,pos.z);hatFly.v.set(1,4,0);chaosShake=.3;if(window.JUICE_READY)pow('הב!!!',pos.x,2.6,pos.z,true)})},
   {say:[['d','שוקו לא אוהב אותך. ואני סומכת על שוקו.',2.4,'angry']]},
   {fn:()=>{dtLeave();const D=poodle();DT.leaveDog=D}},{say:[['n','האמת? גם אני לא אוהבת את שוקו.',2.2,'smug']]},
   {end:{text:'נבח על הפודל של הדייט'}}]},
 {id:'noa',icon:'💖',title:'נועה',look:null,
  noa:[-8.2,139.4,Math.PI],start:[6,126,-Math.PI/2],
  setup:()=>{for(const c of FALLEN)c.visible=true;for(const c of CAFE_CHAIRS)c.visible=true},
  steps:[{say:[['m','🎩 תשעה דייטים. תשעה אסונות. ובכל אחד מהם... היא הייתה שם.',2.6]]},
   {go:{at:()=>V(-8.2,0,138),label:'להגיד שלום לנועה',icon:'☕'}},{sit:[-8.2,138,0]},
   {say:[['n','שוב אתה. ...לבד הפעם?',2,'smile']]},
   {ask:{q:'מה להגיד לנועה?',opts:[['🎩 באתי בשבילך הפעם',15,'n','...באמת?'],['☕ הפוך אחד... ושתי דקות מהזמן שלך',15,'n','יש לי בדיוק שתיים'],['🐕 את עובדת בכל מקום בעיר?',10,'n','ארבע עבודות. ובכל אחת הרסת דייט']]}},
   {say:[['n','אני סוגרת. תעזור לי להרים את הכיסאות?',2]]},
   {go:{at:()=>V(FALLEN[0].position.x,0,FALLEN[0].position.z),label:'להרים כיסא',icon:'🪑'}},{fn:()=>{FALLEN[0].visible=false;hearts(pos.x,1.6,pos.z,5)}},
   {go:{at:()=>V(FALLEN[1].position.x,0,FALLEN[1].position.z),label:'להרים כיסא',icon:'🪑'}},{fn:()=>{FALLEN[1].visible=false;hearts(pos.x,1.6,pos.z,5)}},
   {go:{at:()=>V(FALLEN[2].position.x,0,FALLEN[2].position.z),label:'להרים כיסא',icon:'🪑'}},{fn:()=>{FALLEN[2].visible=false;hearts(pos.x,1.6,pos.z,5);DT.noaTo=[11.6,126.9,Math.PI]}},
   {say:[['n','תודה. ...אתה יודע, ראיתי את כל תשעת הדייטים',2.4]]},
   {ask:{q:'מה להגיד?',opts:[['😳 ...את כולם?',10,'n','הפרחים, הספגטי, הסנאי, המזרקה...'],['🎩 זה היה חלק מהתוכנית',5,'n','חחח בטח'],['💘 אולי חיפשתי במקומות הלא נכונים',15,'n','...אולי']]}},
   {go:{at:()=>V(13,0,126.9),label:'לשבת עם נועה ליד המזרקה',icon:'🌅'}},{sit:[13,126.9,Math.PI]},
   {say:[['n','אתה יודע מה הכי אהבתי?',1.8,'smile'],['m','🎩 ...שנפלתי למזרקה?',1.6],['n','שקמת. כל פעם. עם הכובע.',2.2,'love']],fx:()=>dtLater(5.6,()=>{hat.visible=false;hatFly.visible=true;hatFly.position.set(pos.x,2.2,pos.z);hatFly.v.set(-1.4,3,0);dtLater(.7,()=>{hatFly.visible=false;noaHat.visible=true;hearts(NOA.g.position.x,3,NOA.g.position.z,10)})})},
   {say:[['n','אני אוהבת כלבים. במיוחד אחד עם כובע.',2.6,'love'],['m','💘 ...',1.6]],fx:()=>{for(let k=0;k<6;k++)dtLater(k*.5,()=>{hearts(12.3,2.4,126.9,12);if(window.JUICE_READY)showBurst(12.3+(Math.random()-.5)*3,126.9+(Math.random()-.5)*3)})}},
   {end:{text:'מצא את האחת. היא הייתה שם כל הזמן',win:true}}]}
];
// ---------- the engine ----------
const DT={i:-1,k:-1,charm:50,clock:0,q:[],st:null,seat:null,P:null,leave:null,mini:null,still:null,act:null};
function dtLater(d,fn){DT.q.push({at:DT.clock+d,fn})}
function dtDef(){return DATE_LIST[DT.i]}
function dtStep(){const d=dtDef();return d&&DT.k>=0?d.steps[DT.k]:null}
function dtWho(k){if(k==='m')return milkyB;if(k==='d')return DT.P?DT.P.b:milkyB;if(k==='n')return NOA.b;const w=dtDef().who;return w&&w[k]?w[k]():milkyB}
function dtCharm(v){DT.charm=Math.max(0,Math.min(100,DT.charm+v));if(v)pow((v>0?'+':'')+v+' 💘',pos.x,2.8,pos.z,false)}
function dtPill(){if(DT.i<0||DT.k<0)return;const d=dtDef();evtPill.hidden=false;const l=d.icon+' דייט '+(DT.i+1)+'/10: '+d.title+' · 💘 '+DT.charm;if(evtPill.textContent!==l)evtPill.textContent=l}
function placeP(P,a){P.g.position.set(a[0],0,a[1]);P.g.rotation.set(0,a[2],0);P.g.visible=true}
const _dtPeople={};
function dtCleanup(){DT.q=[];DT.seat=null;DT.mini=null;DT.still=null;DT.act=null;DT.auto=null;DT.lock=null;DT.leave=null;DT.leaveDog=null;DT.noaTo=null;DT.fell=false;DT.stand=false;
 for(const P of Object.values(_dtPeople)){P.g.visible=false;P.g.rotation.set(0,0,0);P.g.position.y=0}NOA.g.visible=false;noaHat.visible=false;
 for(const g of [flowersG,conesG,frisbeeG,frisbee,sandwich,blanket,...FALLEN])g.visible=false;if(POODLE)POODLE.g.visible=false;
 choiceEl.hidden=true;miniEl.hidden=true;hatFly.visible=false;if(HUMAN)hat.visible=true}
function dtStart(i){dtCleanup();DATES=true;window.DATES=true;DT.i=i;DT.k=-1;DT.charm=50;DT.clock=0;DT.started=performance.now();const d=DATE_LIST[i];
 tie.visible=true;hat.visible=true;
 if(d.look){if(!_dtPeople[d.id])_dtPeople[d.id]=datePerson(d.look);DT.P=_dtPeople[d.id];placeP(DT.P,d.at)}else DT.P=NOA;
 placeP(NOA,d.noa);if(d.setup)d.setup();
 pos.set(d.start[0],0,d.start[1]);jumpY=0;grounded=true;velocityY=0;rag.active=false;curSpeed=0;yaw=d.start[2];camYaw=yaw;
 showBanner(d.icon+' דייט '+(i+1)+': '+d.title);dtNext()}
function dtNext(){DT.k++;DT.st={t:0};const s=dtStep();if(!s)return;dtPill();if(s.go)DT.seat=null; // walking somewhere: get up from the table
 if(s.say){const L=typeof s.say==='function'?s.say():s.say;let t=.3;for(const [w,txt,dur,mood] of L){const du=dur||2.2;dtLater(t,()=>{const b=dtWho(w);sayText(b,txt,du+.4,'say',true);if(mood){if(w==='n')DT.noaMood=mood;else DT.mood=mood}});t+=du+.25}if(s.fx)s.fx();dtLater(t,dtNext);return}
 if(s.sit){DT.seat=s.sit.slice();dtNext();return}
 if(s.fn){s.fn();dtNext();return}
 if(s.wait){dtLater(s.wait,dtNext);return}
 if(s.ask){dtAsk(s.ask);return}
 if(s.mini){DT.mini={n:s.mini.n,i:0,hits:0,speed:s.mini.speed||2.6,t:0,zone:dtZone(),cool:0,label:s.mini.label};miniEl.hidden=false;miniEl.querySelector('span').textContent=s.mini.label+' (0/'+s.mini.n+')';return}
 if(s.still){DT.seat=null;DT.still={need:s.still.sec,t:0,ax:pos.x,az:pos.z,fails:0,fx:s.still.fx,label:s.still.label};if(s.still.start)s.still.start();return}
 if(s.act){DT.act=s.act;s.act.start&&s.act.start();return}
 if(s.end){dtEnd(s.end);return}}
function dtGo(){const s=dtStep();if(!s||!s.go)return;DT.st.near=0;if(s.go.timer&&!DT.st.melted)dtCharm(15);dtNext()}
function dtEnd(e){const text=typeof e.text==='function'?e.text():e.text;DT.k=-1;evtPill.hidden=true;dtCleanupLight();
 const st=DT.charm>=80?3:DT.charm>=60?2:1,d=dtDef(),i=DT.i;addScore(e.win?3000:600,e.win?'💖':'פיאסקו!');
 const lines=[(e.win?'💖 ':'🤦 ')+text,'💘 קסם: '+DT.charm+'/100 (ל־3 כוכבים: 80)','⭐ ניקוד '+score.toLocaleString('he-IL')];
 dtLater(e.win?2.6:1.2,()=>{if(window.EP_READY&&EP.cur&&EP.cur.id==='dates'&&EP.idx===i)epFinish(true,st,lines,e.win?'💖 דייט 10: האחת':d.icon+' דייט '+(i+1)+': "הצלחה"')})}
function dtCleanupLight(){DT.mini=null;DT.still=null;DT.act=null;choiceEl.hidden=true;miniEl.hidden=true}
function dtLeave(){if(!DT.P||DT.P===NOA)return;const P=DT.P,a=Math.atan2(P.g.position.x-pos.x,P.g.position.z-pos.z);DT.leave={P,a,t:4}}
// ---------- choices ----------
const choiceEl=document.createElement('div');choiceEl.id='dtChoice';choiceEl.hidden=true;document.body.appendChild(choiceEl);
function dtAsk(q){choiceEl.innerHTML='';const p=document.createElement('p');p.textContent='💬 '+q.q;choiceEl.appendChild(p);
 q.opts.forEach((o,k)=>{const b=document.createElement('button');b.type='button';b.textContent=(k+1)+'. '+o[0];b.addEventListener('click',e=>{e.stopPropagation();dtChoose(k)});choiceEl.appendChild(b)});choiceEl.hidden=false;DT.ask=q}
function dtChoose(k){const q=DT.ask;if(!q||choiceEl.hidden)return;const o=q.opts[k];if(!o)return;choiceEl.hidden=true;DT.ask=null;
 sayText(milkyB,o[0],1.8,'say',true);dtLater(1.4,()=>{dtCharm(o[1]);const b=dtWho(o[2]);sayText(b,o[3],2.2,'say',true);if(o[2]==='d')DT.mood=o[1]>0?'love':o[1]<0?'confused':'smile'});dtLater(3.6,dtNext)}
document.addEventListener('keydown',e=>{if(!DATES||choiceEl.hidden)return;const k=+e.key;if(k>=1&&k<=3){e.preventDefault();dtChoose(k-1)}});
// ---------- the timing mini-game ----------
const miniEl=document.createElement('div');miniEl.id='dtMini';miniEl.hidden=true;miniEl.innerHTML='<span></span><div class="bar"><i class="zone"></i><b class="mk"></b></div><small>לחץ על הכפתור כשהסמן בירוק</small>';document.body.appendChild(miniEl);
miniEl.addEventListener('pointerdown',e=>{e.preventDefault();dtMiniHit()});
function dtZone(){const w=.2;const a=.1+Math.random()*(.8-w);return [a,a+w]}
function dtMiniPos(){const M=DT.mini;return .5+.5*Math.sin(M.t*M.speed)}
function dtMiniHit(){const M=DT.mini;if(!M||M.cool>0)return;const m=dtMiniPos(),hit=m>=M.zone[0]&&m<=M.zone[1];M.i++;M.cool=.45;
 if(hit){M.hits++;dtCharm(5);hearts(pos.x,2.2,pos.z,4);playToySound(660,.06,'triangle')}else{dtCharm(-5);playToySound(180,.08,'square');milkyThought('😬',.8,true)}
 miniEl.querySelector('span').textContent=M.label+' ('+M.i+'/'+M.n+')';M.zone=dtZone();
 if(M.i>=M.n){DT.mini=null;miniEl.hidden=true;dtLater(.4,dtNext)}}
CTX_HOOKS.act.unshift(()=>{if(!DATES||DT.k<0)return null;if(DT.mini)return {i:'👆',l:'עכשיו!',on:1,fn:dtMiniHit};const s=dtStep();
 if(s&&s.go&&!DT.q.length){const t=s.go.at();if(Math.hypot(pos.x-t.x,pos.z-t.z)<(s.go.r||1.8))return {i:s.go.icon||'👉',l:s.go.label,on:1,fn:dtGo}}return null});
Object.assign(_holdLabels,{dtStill:'🧘 לא לזוז...',dtMelt:'🍦 הגלידה נמסה...'});
// ---------- per frame ----------
function updateDates(dt){if(!DATES)return;if(!HUMAN){dtStop();return}
 DT.clock+=dt;for(let n=0;n<8&&DT.q.length;n++){let k=-1;for(let j=0;j<DT.q.length;j++)if(DT.q[j].at<=DT.clock&&(k<0||DT.q[j].at<DT.q[k].at))k=j;if(k<0)break;const it=DT.q.splice(k,1)[0];it.fn()}
 const t=performance.now()/1000;if(DT.st)DT.st.t+=dt;dtPill();
 // seated/standing at the table: stay put, face the date
 if(DT.seat&&!rag.active){pos.x=DT.seat[0];pos.z=DT.seat[1];yaw=DT.seatYaw!==undefined&&DT.spin>0?DT.seatYaw:DT.seat[2];curSpeed=0}
 if(DT.lock&&DT.act){pos.x=DT.lock[0];pos.z=DT.lock[1]}
 const s=dtStep();
 if(s&&s.go&&!DT.q.length){const g=s.go;
  if(g.timer){DT.st.melt=(DT.st.melt||0)+dt;if(DT.st.melt<g.timer)holdShow('dtMelt',g.timer-DT.st.melt,g.timer);else if(!DT.st.melted){DT.st.melted=true;dtCharm(-15);sayText(milkyB,'😰 ...נמס',1.6,'say',true)}}
  // standing at the spot for a moment presses the button for you (no need to find it on the phone)
  const tg=g.at();if(Math.hypot(pos.x-tg.x,pos.z-tg.z)<(g.r||1.8)){DT.st.near=(DT.st.near||0)+dt;if(DT.st.near>1.3)dtGo()}else DT.st.near=0}
 if(DT.mini){const M=DT.mini;M.t+=dt;M.cool=Math.max(0,M.cool-dt);const z=miniEl.querySelector('.zone'),mk=miniEl.querySelector('.mk');z.style.right=(M.zone[0]*100)+'%';z.style.width=((M.zone[1]-M.zone[0])*100)+'%';mk.style.right=(dtMiniPos()*100)+'%'}
 if(DT.still){const S=DT.still;S.t+=dt;if(S.fx)S.fx(dt,t);holdShow('dtStill',S.t,S.need);
  if(Math.hypot(pos.x-S.ax,pos.z-S.az)>.35||jumpY>.35){S.fails++;S.t=0;S.ax=pos.x;S.az=pos.z;dtCharm(-8);sayText(milkyB,'😬 זזתי! ...שוב',1.4,'say',true)}
  if(S.t>=S.need||S.fails>=3){if(S.fails<3)dtCharm(15);DT.still=null;frisbee.visible=false;dtLater(.3,dtNext)}}
 if(DT.act){if(DT.act.update(dt)){DT.act=null;DT.lock=null;dtLater(.2,dtNext)}}
 // the date and Noa: idle, faces, walking away at the end
 for(const P of DT.P===NOA?[NOA]:[DT.P,NOA]){if(!P||!P.g.visible)continue;let step=0;
  if(P===NOA&&DT.noaTo){const [x,z,r]=DT.noaTo,o=P.g.position,dx=x-o.x,dz=z-o.z,d=Math.hypot(dx,dz);if(d>.05){step=Math.min(d,2.6*dt);o.x+=dx/d*step;o.z+=dz/d*step;P.g.rotation.y=Math.atan2(dx,dz)}else P.g.rotation.y=r}
  if(DT.leave&&DT.leave.P===P){const L=DT.leave;L.t-=dt;step=2.4*dt;P.g.position.x+=Math.sin(L.a)*step;P.g.position.z+=Math.cos(L.a)*step;P.g.rotation.y=L.a;if(L.t<=0){P.g.visible=false;DT.leave=null}}
  if(!DT.fell||P!==DT.P)animatePerson(P,step,dt,{arm:i=>step?0:(i===0?Math.sin(t*2)*.12:0)});
  updateFace(P.face,P===NOA?(DT.noaMood||'smile'):(DT.mood||'smile'),dt)}
 if(DT.leaveDog){const D=DT.leaveDog;D.g.position.x+=dt*2.2;D.walk+=dt*8;D.legs.forEach((l,i)=>l.rotation.x=Math.sin(D.walk+(i===0||i===3?0:Math.PI))*.7);D.g.rotation.y=Math.PI/2;if(D.g.position.x>44)D.g.visible=false}}
function dtStop(){if(!DATES)return;dtCleanup();DATES=false;window.DATES=false;DT.k=-1;DT.i=-1;tie.visible=false;evtPill.hidden=true}
// ---------- wiring ----------
// Milky's idle musings stay quiet during a date (they talked over the conversation)
{const _th=think;think=function(k,d,f,kind){if(DATES&&!f)return;return _th(k,d,f,kind)}}
const _uowD=updateOpenWorld;updateOpenWorld=function(dt){_uowD(dt);if(DATES)updateDates(dt)};
const _nthD=nextTaskHint;nextTaskHint=function(){if(!DATES||DT.k<0)return _nthD();const s=dtStep();if(!s)return '💘';
 if(s.go)return '👉 '+s.go.icon+' '+s.go.label+(Math.hypot(pos.x-s.go.at().x,pos.z-s.go.at().z)<1.8?' (לחץ על הכפתור או E)':'');if(s.ask||DT.ask)return '💬 תבחר מה להגיד';if(DT.mini)return '👆 לחץ כשהסמן בירוק';if(DT.still)return DT.still.label;if(DT.act)return DT.act.hint;return '💘 '+dtDef().title};
const _ctD=currentTarget;currentTarget=function(){if(!DATES||DT.k<0)return _ctD();if(!guideOn)return null;const s=dtStep();if(s&&s.go)return s.go.at();if(DT.act&&DT.act.target)return DT.act.target();return null};
{const _ha=hApply;hApply=function(on){if(!on)dtStop();return _ha(on)}}
{const _hs=hStartErrand;hStartErrand=function(i){dtStop();return _hs(i)}}
epRegister({id:'dates',icon:'💘',title:'מילקי בן אדם: 10 דייטים',reward:'💖 למצוא את האחת',rewardDone:'מילקי מצא את האחת. היא הייתה שם כל הזמן 💖',
 levels:DATE_LIST.map((d,i)=>({id:d.id,title:i===9?'💖 ???':d.title,icon:i===9?'💖':d.icon,sub:i===9?'הדייט האחרון':'כל דייט נגמר באסון'})),
 start:i=>{document.querySelector('#overlay').style.display='none';setHuman(true);startGame();dtStart(i)},quit:()=>{dtStop();if(HUMAN)setHuman(false)},alive:()=>HUMAN&&DATES});
WORLDS.splice(5,0,{icon:'💘',name:'הדייטים של מילקי',col:'#ffb3c7',sub:()=>'10 דייטים · ⭐ '+epStars('dates')+'/30',go:()=>epBoard('dates')});universeRender();
window.DT=DT;window.DATES_READY=true;
