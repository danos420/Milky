// ===== רחוב הרימונים: a residential lane between the square and the beach. Houses, neighbours with a daily routine,
// and a friendship meter for each neighbour (they remember what Milky did to them) =====
const LANE_Z=156;
Object.assign(TOWN_AREAS,{homesN:{x0:-44,x1:8.6,z0:140,z1:152.5},lane:{x0:-44,x1:62,z0:151,z1:161},homesSW:{x0:-44,x1:8.6,z0:159.5,z1:172.5},homesSE:{x0:17.4,x1:62,z0:159.5,z1:172.5}});
for(const k of ['homesN','lane','homesSW','homesSE'])AREAS.push(TOWN_AREAS[k]);
ZONES.push({id:'homes',icon:'🏘️',name:'רחוב הרימונים',spawn:[13,0,156],rect:{x0:-44,x1:62,z0:142.5,z1:169.5}});
ZG.homes=new THREE.Group();scene.add(ZG.homes);
if(!save.town.friends||typeof save.town.friends!=='object')save.town.friends={};if(!save.town.done||typeof save.town.done!=='object')save.town.done={};
// ---------- the lane ----------
{const g=ZG.homes,asph=0x4a4b50,walk=0xbdb6aa;
 for(const [a,b] of [[-44,6.6],[19.4,62]]){slab(g,a,b,151.6,160.4,.008,walk);slab(g,a,b,153.6,158.4,.016,asph);for(let x=a+1;x<b-1;x+=3)box(1.4,.02,.14,mat(0xf2efe6),x+.7,.03,LANE_Z,g)}
 for(let x=-40;x<60;x+=12)if(x<5||x>21){for(const z of [151.9,160.1]){cyl(.07,3.4,mat(0x3a3d42),x,1.7,z,g);ball(.2,mat(0xfff3c4,.3),x,3.5,z,g)}}
 signBoard(g,'🏘️ רחוב הרימונים',5.9,3.2,151.6,Math.PI/2,3.4);signBoard(g,'🏘️ רחוב הרימונים',20.1,3.2,160.4,-Math.PI/2,3.4);
 for(const s of [5.9,20.1])cyl(.06,3.2,mat(0x3a3d42),s,1.6,s<10?151.6:160.4,g)}
// ---------- houses ----------
const HOUSES=[];
function roofGeo(w,d){const sh=new THREE.Shape();sh.moveTo(-(d/2+.45),0);sh.lineTo(d/2+.45,0);sh.lineTo(0,2.3);sh.lineTo(-(d/2+.45),0);
 const geo=new THREE.ExtrudeGeometry(sh,{depth:w+.6,bevelEnabled:false});geo.translate(0,0,-(w+.6)/2);geo.rotateY(Math.PI/2);return geo}
function house(o){const g=ZG.homes,w=8,d=6,dir=o.dir,zf=o.zf,cz=zf-dir*d/2,x=o.x,wm=mat(o.wall,.9),trim=mat(0xf6f1e7,.6);
 const H={...o,cz,w,d,door:V(x,0,zf+dir*.7),yard:V(x+2.2,0,zf+dir*1.3),gate:V(x,0,zf+dir*2.4),lane:V(x,0,LANE_Z-dir*1.4),mail:V(x+1.5,0,zf+dir*2.5)};HOUSES.push(H);
 if(o.enter){// walls with a doorway; you can walk in
  const t=.2,segs=[[x-w/2,x-.9],[x+.9,x+w/2]];for(const [a,b] of segs){box(b-a,4,t,wm,(a+b)/2,2,zf,g);obstacles.push({name:'קיר',x:(a+b)/2,z:zf,w:b-a,d:t,top:4,solid:true})}
  box(1.8,1.6,t,wm,x,3.2,zf,g);box(w,4,t,wm,x,2,zf-dir*d,g);obstacles.push({name:'קיר',x,z:zf-dir*d,w,d:t,top:4,solid:true});
  for(const s of [-1,1]){box(t,4,d,wm,x+s*w/2,2,cz,g);obstacles.push({name:'קיר',x:x+s*w/2,z:cz,w:t,d,top:4,solid:true})}
  slab(g,x-w/2+.1,x+w/2-.1,Math.min(zf,zf-dir*d)+.1,Math.max(zf,zf-dir*d)-.1,.02,0xb07a4a)}
 else{box(w,4,d,wm,x,2,cz,g);obstacles.push({name:'בית',x,z:cz,w,d,top:4,solid:true})}
 const r=mesh(roofGeo(w,d),mat(o.roof,.8),x,4,cz,g);r.castShadow=true;
 if(o.chimney)box(.7,1.6,.7,mat(0x8b5a3a),x+2.2,5.6,cz,g);
 if(!o.enter){box(1.2,2.2,.12,mat(o.doorC||0x6b3e26,.6),x,1.1,zf+dir*.06,g);ball(.06,mat(0xf2c14e,.3),x+.4,1.1,zf+dir*.14,g)}
 box(1.8,.15,.8,mat(0xbdb6aa),x,.075,zf+dir*.45,g);
 const win=new THREE.MeshBasicMaterial({color:o.lit?0xffe7a3:0x9fd3e8});
 for(const s of [-1,1]){box(1.6,1.3,.06,trim,x+s*2.5,2.2,zf+dir*.03,g);box(1.4,1.1,.08,win,x+s*2.5,2.2,zf+dir*.05,g);box(.08,1.1,1.4,win,x+s*(w/2+.04),2.2,cz,g)}
 // front fence with a gate, path, mailbox, garden
 const fz=zf+dir*2.4;for(const [a,b] of [[x-5.3,x-.9],[x+.9,x+5.3]]){box(b-a,.08,.06,trim,(a+b)/2,.35,fz,g);box(b-a,.08,.06,trim,(a+b)/2,.7,fz,g);for(let px=a;px<=b+.01;px+=.9)box(.09,.85,.09,trim,px,.42,fz,g);obstacles.push({name:'גדר',x:(a+b)/2,z:fz,w:b-a,d:.12,top:.85})}
 slab(g,x-.6,x+.6,Math.min(zf+dir*.85,fz),Math.max(zf+dir*.85,fz),.01,0xd8cdb8);
 cyl(.05,1,mat(0x3a3d42),H.mail.x,.5,H.mail.z,g);box(.32,.26,.46,mat(o.mailC||0x3a7bd5,.5),H.mail.x,1.1,H.mail.z,g);signBoard(g,o.family,H.mail.x,1.55,H.mail.z+dir*.02,dir>0?0:Math.PI,1.3);
 for(const s of [-1,1]){ball(.55,mat(0x4f8a3c,.9),x+s*4.4,.45,fz-dir*.6,g);decorRounds.push({x:x+s*4.4,z:fz-dir*.6,r:.5,h:1})}
 for(let i=0;i<6;i++){const fx=x-3.6+i*.5,fzz=zf+dir*1.5;cyl(.02,.3,mat(0x3f7a3c),fx,.15,fzz,g);ball(.08,mat([0xe85d75,0xf2c14e,0xff8fb1,0x9b59b6][i%4],.6),fx,.32,fzz,g)}
 const tz=zf-dir*(d+1.6);cyl(.2,2,mat(0x6b4a2a),x-2.8,1,tz,g);ball(1.3,mat(0x5f9a45,.9),x-2.8,2.6,tz,g);decorRounds.push({x:x-2.8,z:tz,r:.3,h:9});
 if(o.swing){const sx=x+2.6,sz=tz;for(const s of [-1,1])cyl(.05,2.2,mat(0x6b4a32),sx+s*.8,1.1,sz,g);cyl(.05,1.7,mat(0x6b4a32),sx,2.2,sz,g).rotation.z=Math.PI/2;box(.5,.06,.25,mat(0xe74c3c),sx,.6,sz,g)}
 if(o.porch){const c=new THREE.Group();c.position.set(x+2.6,0,zf+dir*1.2);c.rotation.y=dir>0?0:Math.PI;g.add(c);box(.6,.08,.6,mat(0x8b5a3a),0,.48,0,c);box(.6,.6,.08,mat(0x8b5a3a),0,.8,-.28,c);for(const [a,b] of [[-.25,-.25],[.25,-.25],[-.25,.25],[.25,.25]])box(.06,.48,.06,mat(0x5a4a3a),a,.24,b,c)}
 if(o.sale){cyl(.05,1.4,mat(0x6b4a32),x-1.8,.7,fz-dir*.4,g);signBoard(g,'🏷️ למכירה',x-1.8,1.5,fz-dir*.35,dir>0?0:Math.PI,1.6)}
 if(o.lights)for(let i=0;i<9;i++)ball(.07,new THREE.MeshBasicMaterial({color:[0xff5d8f,0xf2c14e,0x7fd3ff][i%3]}),x-4+i,4.05,zf+dir*.15,g);
 return H}
const HSPEC=[
 {id:'amos',x:-36.5,zf:149.5,dir:1,wall:0xe9d9b7,roof:0x8e3b2e,family:'עמוס ושושנה',porch:true,chimney:true},
 {id:'couple',x:-24.5,zf:149.5,dir:1,wall:0xbfd9e8,roof:0x4a5a6a,family:'מורן ותום',doorC:0xc0392b},
 {id:'noy',x:-12.5,zf:149.5,dir:1,wall:0xf6d6a8,roof:0xb5532e,family:'משפחת אזולאי',swing:true},
 {id:'beni',x:-36.5,zf:162.5,dir:-1,wall:0xd7c9e8,roof:0x5b4a7a,family:'בני ומיצי',chimney:true},
 {id:'avi',x:-24.5,zf:162.5,dir:-1,wall:0xf2efe6,roof:0x2f6e4a,family:'אבי הדוור',mailC:0xe74c3c},
 {id:'lior',x:-12.5,zf:162.5,dir:-1,wall:0xcfe8c9,roof:0x6a8f5a,family:'ליאור',lit:true},
 {id:'rachel',x:0,zf:162.5,dir:-1,wall:0xf6c9b8,roof:0x9a4a3a,family:'סבתא רחל',enter:true,chimney:true},
 {id:'cohen',x:26,zf:162.5,dir:-1,wall:0xe8e0d0,roof:0x7a6a5a,family:'משפחת כהן'},
 {id:'sale',x:38,zf:162.5,dir:-1,wall:0xd9d4c7,roof:0x6b6b6b,family:'בית ריק',sale:true},
 {id:'party',x:50,zf:162.5,dir:-1,wall:0xffd1dc,roof:0xc0392b,family:'משפחת פרץ',lights:true,swing:true}];
const HB={};for(const o of HSPEC)HB[o.id]=house(o);
// grandma Rachel's living room (you can walk in)
const RACH=HB.rachel;{const g=ZG.homes,x=0,bz=RACH.zf+6; // back wall at z 168.5
 slab(g,-2.4,2.4,164.4,167.2,.03,0xc0392b);
 box(1.6,.5,.8,mat(0x8e5a8e),-2.6,.25,167.6,g);box(1.6,.6,.2,mat(0x8e5a8e),-2.6,.75,168,g);obstacles.push({name:'ספה של סבתא',x:-2.6,z:167.6,w:1.6,d:.8,top:.5});
 cyl(.5,.05,mat(0x8b5a3a),0,.6,165.8,g);cyl(.06,.6,mat(0x5a4a3a),0,.3,165.8,g);obstacles.push({name:'שולחן קפה',x:0,z:165.8,w:1,d:1,top:.65});
 cyl(.28,.03,mat(0xffffff),0,.65,165.8,g);for(let i=0;i<5;i++)cyl(.07,.03,mat(0xc8873a),Math.cos(i*1.26)*.14,.68,165.8+Math.sin(i*1.26)*.14,g);
 box(1.4,.9,.5,mat(0x3a3a3a),3,.45,168.1,g);box(1.2,.7,.06,new THREE.MeshBasicMaterial({color:0x223344}),3,1.2,167.9,g);obstacles.push({name:'טלוויזיה',x:3,z:168.1,w:1.4,d:.5,top:.9});
 box(.5,2,1.6,mat(0x6b4a32),-3.6,1,164.6,g);for(let i=0;i<8;i++)box(.3,.36,.1,mat([0xc0392b,0x3a7bd5,0xf2c14e,0x6aa86b][i%4]),-3.45,.55+Math.floor(i/4)*.7,164+i%4*.35,g);obstacles.push({name:'ספרייה',x:-3.6,z:164.6,w:.5,d:1.6,top:2,solid:true});
 cyl(.3,.3,mat(0xb5894a),2.6,.15,164.4,g);for(let i=0;i<3;i++)ball(.12,mat([0xe74c3c,0x3a7bd5,0xf2c14e][i]),2.5+i*.1,.35,164.4,g);
 for(const [px,c] of [[-1.5,0xf2c14e],[0,0x7fd3ff],[1.5,0xe85d75]]){box(.7,.55,.04,mat(0x6b4a32),px,2.6,168.38,g);box(.56,.42,.05,mat(c),px,2.6,168.36,g)}
 cyl(.04,1.6,mat(0x3a3d42),-3.4,.8,167.9,g);mesh(new THREE.ConeGeometry(.3,.4,10),mat(0xf6e3b4,.5),-3.4,1.7,167.9,g)}
// the Cohens are moving in: a truck and boxes on the driveway
{const g=ZG.homes,tx=31.2,tz=164;box(2.2,2.2,4.4,mat(0xf6f6f2,.6),tx,1.4,tz,g);box(2.2,1.4,1.6,mat(0x3a7bd5,.6),tx,1.0,tz-3,g);box(2,.6,.06,new THREE.MeshBasicMaterial({color:0x9fd3e8}),tx,1.4,tz-3.82,g);for(const [a,b] of [[-1,-2.8],[1,-2.8],[-1,1.2],[1,1.2]]){const w=cyl(.4,.3,mat(0x222222),tx+a*1.05,.4,tz+b,g);w.rotation.z=Math.PI/2}
 obstacles.push({name:'משאית הובלות',x:tx,z:tz-.7,w:2.2,d:6,top:2.5,solid:true});signBoard(g,'🚚 הובלות ברדק',tx-1.12,1.8,tz,-Math.PI/2,2.6)}
// the public garden between the houses (bench, swing, sandbox)
{const g=ZG.homes;slab(g,-4.8,4.8,142.2,151,.006,0x8fc46a);box(1.8,.1,.5,mat(0x8b5a3a),0,.5,145,g);box(1.8,.5,.1,mat(0x8b5a3a),0,.8,144.75,g);for(const s of [-.8,.8])box(.08,.5,.4,mat(0x3a3d42),s,.25,145,g);obstacles.push({name:'ספסל',x:0,z:145,w:1.8,d:.5,top:.55});
 for(const s of [-1,1])cyl(.05,2.2,mat(0x6b4a32),-3+s*.8,1.1,148,g);cyl(.05,1.7,mat(0x6b4a32),-3,2.2,148,g).rotation.z=Math.PI/2;box(.5,.06,.25,mat(0xf2c14e),-3,.6,148,g);
 slab(g,2,4.2,146.4,148.6,.03,0xf0dca8);box(2.2,.15,.1,mat(0x8b5a3a),3.1,.08,146.4,g);box(2.2,.15,.1,mat(0x8b5a3a),3.1,.08,148.6,g);
 signBoard(g,'🌳 הגינה הציבורית',0,2.2,151.2,0,2.8);cyl(.05,2.2,mat(0x3a3d42),-1,1.1,151.25,g);cyl(.05,2.2,mat(0x3a3d42),1,1.1,151.25,g)}
// ---------- where the neighbours go ----------
// a spot: {x,z,out:[points from the spot to the junction]} — walking from A to B = A.out, then reversed B.out, then B
const J=[13,LANE_Z];
const spotYard=h=>({x:HB[h].yard.x,z:HB[h].yard.z,face:HB[h].dir>0?Math.PI:0,out:[[HB[h].gate.x,HB[h].gate.z],[HB[h].lane.x,LANE_Z],J]});
const spotIn=h=>({x:HB[h].x+1.2,z:HB[h].zf-HB[h].dir*2.2,face:0,out:[[HB[h].x,HB[h].zf-HB[h].dir*1],[HB[h].x,HB[h].zf+HB[h].dir*1],[HB[h].gate.x,HB[h].gate.z],[HB[h].lane.x,LANE_Z],J]});
const spotPark=(x,z,face)=>({x,z,face,out:[[x,151.5],[x,LANE_Z],J]});
const spotPlaza=(x,z,face)=>({x,z,face,out:[[13,141],J]});
const spotBeach=(x,z,face)=>({x,z,face,out:[[13,173],J]});
const spotSchool=(x,z,face)=>({x,z,face,out:[[6,82.3],[8.2,84],[8.2,138],[13,141],J]});
const spotLane=(x,face)=>({x,z:LANE_Z+1.2,face,out:[[x,LANE_Z],J]});
function route(a,b){const p=[...a.out];const back=b.out.slice().reverse();
 // skip the junction when both ends share the first leg
 while(p.length&&back.length&&p[p.length-1][0]===back[0][0]&&p[p.length-1][1]===back[0][1]&&p.length>1&&back.length>1&&p[p.length-2][0]===back[1][0]&&p[p.length-2][1]===back[1][1]){p.pop();back.shift()}
 return [...p,...back,[b.x,b.z]]}
const PHASES=['🌅 בוקר','☀️ צהריים','🌇 אחר הצהריים','🌙 ערב'];const PHASE_LEN=150;
const NBH={t:0,phase:0,carry:null,carryMesh:null};
// ---------- the people ----------
function nPerson(c){const P=makePerson(c);ZG.homes.add(P.g);for(const p of [...P.face.parts,P.mouth])KEEP.add(p);return P}
const catM=new THREE.Group();ZG.homes.add(catM);{const c=mat(0xe8a34a,.8);const b=ball(.22,c,0,.28,0,catM);b.scale.set(.8,.8,1.4);ball(.15,c,0,.48,.28,catM);for(const s of [-1,1]){const e=mesh(new THREE.ConeGeometry(.05,.1,6),c,s*.08,.62,.3,catM)}const t=cyl(.03,.4,c,0,.42,-.3,catM);t.rotation.x=-.7;for(const e of [-1,1])ball(.02,mat(0x1c1a1a),e*.05,.5,.42,catM)}
const NEIGH=[
 {id:'rachel',g:'f',name:'סבתא רחל',icon:'👵',look:{skin:0xf0c8a0,shirt:0x9b6b8e,dress:0x9b6b8e,pants:0xf0c8a0,shoes:0x6b4a32,hair:h=>{const m=mat(0xd9d9d9);const b=ball(.35,m,0,.1,-.08,h);b.scale.set(1,.8,1);ball(.16,m,0,.38,-.15,h)}},
  routine:[spotYard('rachel'),spotPlaza(-3.5,135.4,-Math.PI/2),spotPark(-.6,146,0),spotIn('rachel')],treatAt:3,
  hello:['שלום חמוד! אכלת משהו היום?','מילקי! בוא, בוא לסבתא','איזה כלב יפה. כמו הסבא שלך'],friend:['יש לי עוגיות בבית, אתה יודע','אתה הנכד האהוב עליי. אל תגיד לאחרים'],angry:['אוי, הפלת אותי! כלב רע!','לא מגיע לך עוגייה היום'],
  idle:['פעם הכל היה זול יותר','צריך לסרוג לך סוודר','איפה המשקפיים שלי...'],
  reqs:[{t:'fetch',item:'yarn',at:[-30,157.4],ask:'הכדור צמר שלי התגלגל לרחוב! תביא לי אותו?',thanks:'מתוק שלי! עכשיו אני אסרוג לך סוודר'},
   {t:'fetch',item:'flower',at:[30,122.6],ask:'תביא לי פרח מהדוכן בכיכר? היום יום הולדת לסבא',thanks:'איזה יפה... הוא היה אוהב את זה'}]},
 {id:'avi',g:'m',name:'אבי הדוור',icon:'📮',look:{skin:0xc99067,shirt:0x2f5d8a,pants:0x2f5d8a,shoes:0x222222,hair:h=>{cyl(.36,.12,mat(0x2f5d8a),0,.24,0,h);box(.4,.04,.2,mat(0x1d3d5a),0,.2,.3,h)}},start:-1,
  routine:[{mail:true,...spotYard('avi')},spotPlaza(16.4,126.6,-Math.PI/2),spotYard('avi'),spotYard('avi')],
  hello:['ש-שלום כלב... כלב טוב?','רק מכתבים! אין לי נקניקיות!','אל תנשוך, יש לי עוד 40 תיבות'],friend:['מילקי! בוא תעזור לי לחלק','אתה הכלב היחיד שלא נובח עליי'],angry:['ידעתי! כל הכלבים אותו דבר!','אני מתלונן לדואר!'],
  idle:['מכתב לכהן... מכתב ללוי...','למה כל הכלבים שונאים דוורים?','עוד 37 תיבות'],
  reqs:[{t:'fetch',item:'letter',at:[18.6,131],ask:'יונה חטפה לי מכתב והפילה אותו בכיכר! תביא לי?',thanks:'וואו. כלב שמחזיר מכתבים. ראיתי הכל'},
   {t:'fetch',item:'parcel',at:[26,186],ask:'נפלה לי חבילה בחוף. אני לא הולך לשם, יש שם כלבים',thanks:'אתה כלב או שליח? תודה!'}]},
 {id:'couple',g:'p',name:'מורן ותום',icon:'💑',look:{skin:0xe2b48c,shirt:0xe74c3c,pants:0x3e5f8a,shoes:0x222222,hair:HAIR.pony(0x2a1a12)},look2:{skin:0xd8a07a,shirt:0x6aa86b,pants:0x3a3a3a,shoes:0x222222,hair:h=>{const b=ball(.34,mat(0x3a2a20),0,.12,-.06,h);b.scale.set(1,.7,1);box(.4,.12,.1,mat(0x3a2a20),0,-.22,.27,h)}},
  routine:[spotYard('couple'),spotBeach(-16,186,0),spotPlaza(-2.2,138.2,Math.PI),spotYard('couple')],
  hello:['מילקי! תגיד לו שאני צודקת!','מילקי, תגיד לה שאני צודק!','לפחות הכלב אוהב אותנו'],friend:['מילקי, אתה הדבר היחיד שאנחנו מסכימים עליו'],angry:['גם הכלב נגדנו עכשיו?!'],
  idle:['אתה שוב השארת את הכלים!','אני? את השארת את הכלים!','למה אתה תמיד...','למה את תמיד...'],
  reqs:[{t:'fetch',item:'remote',at:[-28.9,151.2],ask:'השלט נעלם ואנחנו רבים על זה כבר שעה! אולי בשיחים?',thanks:'השלט!!! ...אוקיי, עכשיו נריב על מה לראות'},
   {t:'fetch',item:'ring',at:[-24,192],ask:'הטבעת נפלה בחול! אם לא תמצא אותה זה סוף העולם',thanks:'מצאת!!! מילקי, אתה מציל נישואים'}]},
 {id:'amos',g:'m',name:'עמוס',icon:'👴',look:{skin:0xd8a07a,shirt:0xb5894a,pants:0x5a4a3a,shoes:0x3a2a20,hair:h=>{for(const s of [-1,1]){const b=ball(.14,mat(0xf2f2f2),s*.27,.05,-.08,h);b.scale.set(.6,1,1.2)}box(.3,.06,.05,mat(0xf2f2f2),0,-.08,.33,h)}},
  routine:[{porch:true,...spotYard('amos')},spotBeach(2,212,Math.PI),spotPlaza(18.6,124.6,-Math.PI/2),{porch:true,...spotYard('amos')}],
  hello:['מה אתה רוצה, כלב?','בזמני כלבים היו מנומסים','טוב טוב, שלום'],friend:['שב, שב לידי. אני אספר לך על 73','אתה בסדר, כלב. בסדר.'],angry:['קישטה! לך מפה!','הייתי בצבא 30 שנה, אל תתעסק איתי'],
  idle:['פעם היה פה רק חול','העיתון היום... כולו שקרים','שושנה! איפה הקפה?!'],
  reqs:[{t:'fetch',item:'paper',at:[-1,128.6],ask:'הילד של העיתונים זרק את העיתון לכיכר. תביא?',thanks:'אה. תודה. ...אתה רוצה לשמוע מה כתוב?'},
   {t:'fetch',item:'glasses',at:[2.6,147.6],ask:'המשקפיים שלי! נשארו בגינה הציבורית, ליד ארגז החול',thanks:'עכשיו אני רואה... אתה בעצם חמוד'}]},
 {id:'noy',g:'f',name:'נוי',icon:'🛴',kid:true,look:{skin:0xe2b48c,shirt:0xf2c14e,shorts:0xff3fa0,bareArms:true,shoes:0xffffff,hair:HAIR.pony(0x6b3e26)},
  routine:[{ride:true,...spotLane(-40,0)},spotSchool(-8,90,0),spotPark(-3,147.2,0),spotYard('noy')],
  hello:['מילקי!!! בוא נשחק!','הכי חמוד בעולם!!!','יש לי קורקינט חדש!'],friend:['אתה החבר הכי טוב שלי (חוץ מהקורקינט)'],angry:['אמאאאא! הכלב הפיל אותי!'],
  idle:['וווווו!','תסתכל! בלי ידיים!','מילקי! מירוץ!'],
  reqs:[{t:'fetch',item:'ball',at:[23.6,149],ask:'הכדור שלי עף ליער! אני מפחדת ללכת לשם',thanks:'ידעתי שאתה גיבור!!!'},
   {t:'fetch',item:'helmet',at:[-8,186],ask:'שכחתי את הקסדה בחוף. אמא תהרוג אותי',thanks:'הצלת אותי! אמא לא תדע'}]},
 {id:'lior',g:'f',name:'ליאור',icon:'🧘',look:{skin:0xc99067,shirt:0x7fd3ff,pants:0x2c3e50,shoes:0xf6f6f2,bareArms:true,hair:HAIR.bun(0x1a1a1a)},
  routine:[spotBeach(-6,184,Math.PI),spotYard('lior'),spotBeach(22,183,Math.PI),spotYard('lior')],
  hello:['נמסטה, מילקי','אתה משדר אנרגיה טובה היום','לנשום... לנשום...'],friend:['אתה המורה הכי טוב שלי לכלב מטה'],angry:['אני... לא כועסת. אני רגועה. לך.'],
  idle:['אוווממממ','הכלב מטה... תסתכל, ככה','ריכוז. נשימה. במבה.'],
  reqs:[{t:'still',sec:6,ask:'תעשה איתי כלב מטה? שש שניות בלי לזוז',thanks:'וואו. כלב מטה אמיתי. אתה מאסטר'},
   {t:'fetch',item:'bottle',at:[-11,138.8],ask:'שכחתי את הבקבוק מים בבית הקפה של נועה',thanks:'מים! הצמחים בפנים שלי מודים לך'}]},
 {id:'beni',g:'m',name:'בני',icon:'🐈',look:{skin:0xf0c8a0,shirt:0x8e44ad,pants:0x3a3a3a,shoes:0x222222,hair:h=>{const b=ball(.34,mat(0x8a8a8a),0,.1,-.08,h);b.scale.set(1,.75,1);for(const s of [-1,1]){const r=new THREE.Mesh(new THREE.TorusGeometry(.07,.015,6,12),mat(0x222222));r.position.set(s*.12,.05,.34);h.add(r)}}},
  routine:[spotYard('beni'),spotPlaza(30.8,123.2,Math.PI),spotYard('beni'),spotYard('beni')],cat:true,
  hello:['שלום מילקי. מיצי לא אוהבת אותך','שקט! מיצי ישנה','אתה שוב פה?'],friend:['מיצי אמרה שאתה יכול לבוא לבקר. זה כבוד'],angry:['הפחדת את מיצי! אתה מוחרם'],
  idle:['מיצי, מיצי, מיצי...','למיצי יש יותר עוקבים ממני','מיצי אכלה תותים. היא מיוחדת'],
  reqs:[{t:'cat',ask:'מיצי טיפסה על הגדר ולא יורדת! תעזור?',thanks:'מיצי! ...היא אומרת תודה. בדרך שלה'},
   {t:'fetch',item:'can',at:[28.4,175.6],ask:'נגמר האוכל של מיצי. תביא שימור מהדוכן בחוף?',thanks:'טונה! מיצי סולחת לך על הכל'}]},
 {id:'cohen',g:'m',name:'אורי כהן',icon:'📦',look:{skin:0xbf8358,shirt:0xffffff,pants:0x3e5f8a,shoes:0x6b4a32,hair:h=>{const b=ball(.34,mat(0x1a1a1a),0,.14,-.06,h);b.scale.set(1,.6,1)}},
  routine:[{x:28.6,z:160.6,face:Math.PI,out:[[28.6,LANE_Z],J]},spotYard('cohen'),spotPlaza(-1.6,131.6,0),spotYard('cohen')],
  hello:['היי! אנחנו חדשים פה','אתה הכלב של השכונה? נעים מאוד','שלום! תגיד, איפה פה המכולת?'],friend:['מילקי! אתה הסיבה שעברנו לפה'],angry:['כבר מצטער שעברנו לפה'],
  idle:['עוד 200 ארגזים...','מי ארז את המזלגות עם הנעליים?!','איפה הכספת? אה, היא ריקה'],
  reqs:[{t:'boxes',n:3,ask:'תעזור לי להכניס 3 ארגזים מהמשאית לדלת?',thanks:'אתה כלב או מוביל? תודה!!!'},
   {t:'fetch',item:'teddy',at:[3.4,145.2],ask:'הבן שלי שכח את הדובי בגינה. הוא לא יירדם בלעדיו',thanks:'הדובי! הלילה כולנו נישן'}]}
];
for(const N of NEIGH)N.routine=N.routine.map((s,i)=>N.routine.slice(0,i).find(q=>q.x===s.x&&q.z===s.z)||s); // same place twice = stay put
for(const N of NEIGH){N.P=nPerson(N.look);if(N.kid)N.P.g.scale.setScalar(.72);N.b=makeBubble(N.P.g,N.kid?2.4:3.1);if(N.look2){N.P2=nPerson(N.look2);N.b2=makeBubble(N.P2.g,3.1)}
 N.path=[];N.cool=0;N.talk=0;N.seen=0;N.chat=3+Math.random()*6;N.bump=0;N.treat=-1;N.req=null;N.reqCool=0;
 const s=N.routine[0];N.P.g.position.set(s.x,0,s.z);N.P.g.rotation.y=s.face||0;N.at=s;if(save.town.friends[N.id]===undefined)save.town.friends[N.id]=N.start||0}
const noyScooter=new THREE.Group();NEIGH.find(n=>n.id==='noy').P.g.add(noyScooter);{cyl(.05,1.3,mat(0x3a3d42),0,.75,.45,noyScooter);box(.2,.06,1.1,mat(0xff3fa0),0,.1,0,noyScooter);for(const z of [-.45,.45]){const w=cyl(.1,.06,mat(0x222222),0,.1,z,noyScooter);w.rotation.z=Math.PI/2}box(.6,.05,.05,mat(0x3a3d42),0,1.4,.45,noyScooter)}noyScooter.visible=false;
// ---------- items the neighbours ask for ----------
function itemMesh(k){const g=new THREE.Group();
 ({yarn:()=>{ball(.18,mat(0xe74c3c,.9),0,.18,0,g)},flower:()=>{cyl(.02,.35,mat(0x3f7a3c),0,.18,0,g);ball(.1,mat(0xff8fb1,.6),0,.38,0,g)},letter:()=>{box(.36,.03,.24,mat(0xffffff),0,.03,0,g)},
  parcel:()=>{box(.4,.3,.3,mat(0xc89b62),0,.15,0,g)},remote:()=>{box(.08,.04,.3,mat(0x222222),0,.04,0,g)},ring:()=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.09,.025,8,16),mat(0xf2c14e,.2));r.rotation.x=Math.PI/2;r.position.y=.04;g.add(r)},
  paper:()=>{box(.36,.06,.26,mat(0xd9d4c7),0,.04,0,g)},glasses:()=>{for(const s of [-1,1]){const r=new THREE.Mesh(new THREE.TorusGeometry(.06,.015,6,12),mat(0x222222));r.position.set(s*.08,.06,0);g.add(r)}},
  ball:()=>{ball(.2,mat(0x3a7bd5,.5),0,.2,0,g)},helmet:()=>{const h=ball(.18,mat(0xff3fa0,.4),0,.05,0,g);h.scale.set(1,.8,1.2)},bottle:()=>{cyl(.06,.3,mat(0x7fd3ff,.3),0,.15,0,g)},
  can:()=>{cyl(.08,.12,mat(0xc0c0c0,.3),0,.06,0,g)},box:()=>{box(.42,.36,.42,mat(0xc89b62),0,.18,0,g)},teddy:()=>{ball(.14,mat(0x8b5a2b),0,.14,0,g);ball(.1,mat(0x8b5a2b),0,.32,0,g)}})[k]();
 g.visible=false;scene.add(g);return g}
const NB_INAMES={yarn:'כדור צמר',flower:'פרח',letter:'מכתב',parcel:'חבילה',remote:'שלט',ring:'טבעת',paper:'עיתון',glasses:'משקפיים',ball:'כדור',helmet:'קסדה',bottle:'בקבוק מים',can:'שימור טונה',box:'ארגז',teddy:'דובי'};
const NB_ITEMS={};for(const k of Object.keys(NB_INAMES))NB_ITEMS[k]=itemMesh(k);
// ---------- friendship ----------
const nbF=id=>save.town.friends[id]||0;
const FR_TITLE=f=>f<0?'😠 כועס':f<3?'🙂 מכיר':f<6?'😊 ידיד':f<10?'💛 חבר':'🏆 החבר הכי טוב';
const heartsOf=f=>f<0?'💢':'❤️'.repeat(Math.ceil(Math.min(10,f)/2))+'🤍'.repeat(5-Math.ceil(Math.min(10,f)/2));
function frAdd(N,v,why){const was=nbF(N.id),now=Math.max(-5,Math.min(10,was+v));save.town.friends[N.id]=now;writeSave();
 if(v>0){hearts(N.P.g.position.x,2.8,N.P.g.position.z,6);if(window.JUICE_READY)pow('+'+v+' 💛',N.P.g.position.x,3.2,N.P.g.position.z,false)}else{if(window.JUICE_READY)pow(v+' 💢',N.P.g.position.x,3.2,N.P.g.position.z,false)}
 if(was<10&&now>=10){showBanner('🏆 '+N.name+' — החבר הכי טוב של מילקי!');addActivity('🏆 '+N.name+' החבר הכי טוב של מילקי');addScore(1000,'🏆')}
 else if(Math.floor(Math.max(0,was)/3)<Math.floor(Math.max(0,now)/3)&&now>0)addActivity(N.icon+' '+N.name+': '+FR_TITLE(now))}
const nbPlain=()=>OPEN_WORLD&&!specialMode()&&!DRIVE.on;
function nbNear(maxD){let best=null,bd=maxD;for(const N of NEIGH){const o=N.P.g.position,d=Math.hypot(pos.x-o.x,pos.z-o.z);if(d<bd){bd=d;best=N}}return best}
function nbSay(N,txt,dur=2.4){sayText(N.b,txt,dur,'say',true)}
function nbHello(N){N.talk=4;const f=nbF(N.id);
 if(N.req&&N.req.st==='open'){nbSay(N,N.req.r.ask,3);N.req.st='taken';if(N.req.r.t==='fetch'||N.req.r.t==='boxes')nbSpawnItem(N);addActivity(N.icon+' '+N.name+': '+N.req.r.ask);return}
 if(f<0){nbSay(N,pick(N.angry));return}
 const treatAt=N.treatAt||6;
 if(f>=treatAt&&N.treat!==NBH.phase){N.treat=NBH.phase;nbSay(N,'🍪 קח, מגיע לך',2);addScore(150,'🍪');hearts(pos.x,2,pos.z,6);return}
 nbSay(N,pick(f>=6?N.friend:N.hello));
 if(f<3&&N.cool<=0){N.cool=60;frAdd(N,1)}}
function nbSpawnItem(N){const r=N.req.r;const k=r.t==='boxes'?'box':r.item;const m=NB_ITEMS[k];if(r.t==='boxes')m.position.set(33.2,0,159.4);else m.position.set(r.at[0],0,r.at[1]);m.visible=true;N.req.item=k}
function nbGive(N){const r=N.req.r;NBH.carry=null;NB_ITEMS[N.req.item].visible=false;if(NB_ITEMS[N.req.item].parent!==scene){NB_ITEMS[N.req.item].parent.remove(NB_ITEMS[N.req.item]);scene.add(NB_ITEMS[N.req.item])}
 if(r.t==='boxes'){N.req.n=(N.req.n||0)+1;if(N.req.n<r.n){nbSay(N,'עוד '+(r.n-N.req.n)+'!',1.6);nbSpawnItem(N);return}}
 nbDone(N)}
function nbDone(N){const r=N.req.r;nbSay(N,r.thanks,3);N.req=null;N.reqCool=60;save.town.done[N.id]=(save.town.done[N.id]||0)+1;frAdd(N,3);addScore(400,'💛');showBanner(N.icon+' '+N.name+': תודה מילקי!')}
function nbOpenReq(N){if(N.req||N.reqCool>0)return;const i=(save.town.done[N.id]||0)%N.reqs.length;N.req={r:N.reqs[i],st:'open',t:0}}
// the action button
CTX_HOOKS.act.unshift(()=>{if(!nbPlain()||!window.NB_READY)return null;
 // carrying something for a neighbour: give it
 if(NBH.carry){const N=NBH.carry;const o=N.req&&N.req.r.t==='boxes'?HB.cohen.door:N.P.g.position;if(Math.hypot(pos.x-o.x,pos.z-o.z)<2)return {i:'🎁',l:'לתת ל'+N.name.split(' ')[0],on:1,fn:()=>nbGive(N)};}
 else for(const N of NEIGH){if(!N.req||N.req.st!=='taken'||!N.req.item)continue;const m=NB_ITEMS[N.req.item];if(m.visible&&m.parent===scene&&Math.hypot(pos.x-m.position.x,pos.z-m.position.z)<1.4)return {i:'🐾',l:'לקחת '+NB_INAMES[N.req.item],on:1,fn:()=>{NBH.carry=N;scene.remove(m);dog.add(m);m.position.set(0,1.45,1.3)}}}
 const N=nbNear(2.3);if(!N)return null;
 if(N.req&&N.req.st==='taken'&&N.req.r.t==='still'&&!N.still)return {i:'🧘',l:'כלב מטה',on:1,fn:()=>{N.still={t:0,x:pos.x,z:pos.z};nbSay(N,'נושמים... ולא זזים',2)}};
 return {i:N.req&&N.req.st==='open'?'❗':'👋',l:N.req&&N.req.st==='open'?'מה קרה?':'שלום '+N.name.split(' ')[0],on:1,fn:()=>nbHello(N)}});
Object.assign(_holdLabels,{nbStill:'🧘 כלב מטה... לא לזוז'});
// ---------- per frame ----------
function nbTarget(N){return N.routine[NBH.phase]}
function walkPerson(P,step,dt,o){animatePerson(P,step,dt,o||{})}
function updateHomes(dt){const t=performance.now()/1000;
 ZG.homes.visible=inRect({x0:-44,x1:62,z0:140,z1:172.5},pos.x,pos.z,70);
 NBH.t+=dt;const ph=Math.floor(NBH.t/PHASE_LEN)%4;if(ph!==NBH.phase){NBH.phase=ph;if(ZG.homes.visible&&!specialMode())showBanner(PHASES[ph]+' ברחוב הרימונים')}
 // keep a held item in Milky's mouth only while it makes sense
 if(NBH.carry&&!nbPlain()){const N=NBH.carry,m=NB_ITEMS[N.req?N.req.item:'box'];if(m&&m.parent!==scene){m.parent.remove(m);scene.add(m);m.position.set(pos.x,0,pos.z)}NBH.carry=null}
 const plain=nbPlain();
 for(const N of NEIGH){const P=N.P,o=P.g.position;N.cool=Math.max(0,N.cool-dt);N.talk=Math.max(0,N.talk-dt);N.bump=Math.max(0,N.bump-dt);N.reqCool=Math.max(0,N.reqCool-dt);
  if(plain)nbOpenReq(N);
  const dm=Math.hypot(pos.x-o.x,pos.z-o.z),far=dm>90;
  // plan the walk to this phase's spot
  const tgt=nbTarget(N);if(N.at!==tgt&&!N.path.length&&!N.mailI){N.path=route(N.at,tgt);N.at=tgt;if(tgt.mail){N.mailI=1}}
  if(N.mailI&&!N.path.length){// the mail round: every mailbox on the lane
   const list=HOUSES.filter(h=>h.id!=='sale');if(N.mailI<=list.length){const h=list[N.mailI-1];N.path=[[h.lane.x,LANE_Z],[h.mail.x,h.mail.z-h.dir*.5]];N.mailI++;N.mailPause=.8}else{N.mailI=0;N.path=route({out:[[HB.avi.lane.x,LANE_Z],J]},tgt)}}
  if(N.ride&&!N.path.length){}
  let step=0;const sp=(N.id==='noy'&&(tgt.ride||N.path.length&&N.path.length>2))?3.2:N.id==='avi'?1.6:1.35;
  if(N.mailPause>0&&!N.path.length){N.mailPause-=dt}
  if(N.path.length&&N.talk<=0&&!N.still){const [x,z]=N.path[0],dx=x-o.x,dz=z-o.z,d=Math.hypot(dx,dz);
   if(far){o.x=x;o.z=z;N.path.shift()}else if(d<.15){N.path.shift();if(!N.path.length&&tgt.ride){N.path=[[o.x<0?58:-40,LANE_Z+1.2]]}}else{step=Math.min(d,sp*dt);o.x+=dx/d*step;o.z+=dz/d*step;P.g.rotation.y=Math.atan2(dx,dz)}}
  else if(!N.path.length&&!N.talk&&tgt.face!==undefined&&dm>4)P.g.rotation.y+=(tgt.face-P.g.rotation.y)*Math.min(1,dt*3);
  if(far)continue;
  // look at Milky when he's close
  if(dm<4&&!step){const a=Math.atan2(pos.x-o.x,pos.z-o.z);let da=a-P.g.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));P.g.rotation.y+=da*Math.min(1,dt*5)}
  const f=nbF(N.id);const mood=N.still?'focus':f<0&&dm<6?'angry':dm<4?(f>=6?'love':'smile'):tgt.porch?'sleep':'neutral';
  const sit=tgt.porch&&!step&&!N.path.length;noyScooter.visible=N.id==='noy'?step>0&&sp>3:noyScooter.visible;
  if(N.id==='noy'&&noyScooter.visible){P.legs.forEach(l=>l.rotation.x=0);P.g.position.y=.12}
  else if(sit){P.legs.forEach(l=>l.rotation.x=-1.45);P.g.position.y=-.42}
  else walkPerson(P,step,dt,{arm:i=>N.id==='lior'&&!step&&tgt.z>170?-2.8:(tgt.z>205&&i===1&&!step?-1.1:0)});
  if(dm<26)updateFace(P.face,mood,dt);
  if(N.P2){const P2=N.P2,b=P2.g.position;const side=P.g.rotation.y+Math.PI/2;b.x+=(o.x+Math.sin(side)*.9-b.x)*Math.min(1,dt*4);b.z+=(o.z+Math.cos(side)*.9-b.z)*Math.min(1,dt*4);P2.g.rotation.y=P.g.rotation.y+(step?0:-.9);walkPerson(P2,step,dt);if(dm<26)updateFace(P2.face,f<0&&dm<6?'angry':N.talk?'smile':'angry',dt)}
  // chatter, name tag
  N.chat-=dt;if(dm<9&&N.chat<=0){N.chat=7+Math.random()*8;if(N.P2&&!N.talk){const a=pick(N.idle);sayText(Math.random()<.5?N.b:N.b2,a,2.2,'say',false)}else if(!N.talk)sayText(N.b,pick(N.idle),2.2,'say',false)}
  if(dm<4.5){if(t-N.seen>40&&!N.talk&&plain){sayText(N.b,N.icon+' '+N.name+' · '+heartsOf(f)+(N.req&&N.req.st==='open'?' ❗':''),2.4,'say',true)}N.seen=t}
  // running into a neighbour at full speed: they don't like it
  if(plain&&dm<.95&&lastDogSpeed>5.2&&jumpY<.6&&N.bump<=0){N.bump=8;N.talk=2.5;nbSay(N,pick(N.angry),2.2);frAdd(N,-1);chaosShake=Math.max(chaosShake,.2)}
  if(dm<.6&&dm>1e-3){pos.x+=(pos.x-o.x)/dm*.04;pos.z+=(pos.z-o.z)/dm*.04}
  // a "stand still" request (yoga)
  if(N.still){const S=N.still;S.t+=dt;holdShow('nbStill',S.t,N.req.r.sec);if(Math.hypot(pos.x-S.x,pos.z-S.z)>.35||jumpY>.35){N.still=null;nbSay(N,'זזת! מההתחלה...',1.8)}else if(S.t>=N.req.r.sec){N.still=null;nbDone(N)}}
  // the cat on the fence comes down when Milky gets close
  if(N.cat){const c=catM.position;if(N.req&&N.req.r.t==='cat'&&N.req.st==='taken'){const fz=HB.beni.gate.z;c.set(HB.beni.x-3.2,.86,fz);catM.rotation.y=Math.sin(t*.7)*.6;if(plain&&Math.hypot(pos.x-c.x,pos.z-c.z)<1.6){c.set(HB.beni.x-3.2,0,fz+1.4);nbDone(N)}}
   else{const ax=o.x+.7,az=o.z+.5;c.x+=(ax-c.x)*Math.min(1,dt*2);c.z+=(az-c.z)*Math.min(1,dt*2);c.y=0;catM.rotation.y=P.g.rotation.y}}
 }
 // items: a little hint marker bob
 for(const N of NEIGH)if(N.req&&N.req.item&&NB_ITEMS[N.req.item].parent===scene&&NB_ITEMS[N.req.item].visible)NB_ITEMS[N.req.item].rotation.y+=dt*2;
 bookChip.style.display=OPEN_WORLD&&started?'':'none'}
// ---------- the neighbours book ----------
const bookEl=document.createElement('div');bookEl.id='nbBook';bookEl.className='modal';bookEl.hidden=true;
bookEl.innerHTML='<div class="modalCard" style="max-width:460px;max-height:90vh;overflow:auto;padding:14px"><h1 style="margin:2px 0 4px">📒 השכנים של רחוב הרימונים</h1><div id="nbPhase" style="font:800 14px system-ui;color:#ffe9a8;margin-bottom:8px"></div><div id="nbList"></div><small style="display:block;opacity:.8;margin:8px 0">👋 להגיד שלום · ❗ לעזור בבקשה · 💢 לא להתנגש בהם בריצה</small><div class="modalBtns"><button id="nbClose" type="button">✖ סגור</button></div></div>';
document.body.appendChild(bookEl);
function nbWhere(N){const s=nbTarget(N);if(N.path.length)return 'בדרך';if(s.mail)return 'מחלק דואר';if(s.z>170)return 'בחוף';if(s.z<142&&s.z>115)return 'בכיכר';if(s.z<115)return 'בבית הספר';if(s.ride)return 'רוכבת ברחוב';if(N.id==='rachel'&&NBH.phase===3)return 'בבית (אפשר להיכנס)';return 'ליד הבית'}
function openBook(){const L=bookEl.querySelector('#nbList');L.innerHTML='';bookEl.querySelector('#nbPhase').textContent='⏰ עכשיו: '+PHASES[NBH.phase];
 for(const N of NEIGH){const f=nbF(N.id),d=document.createElement('div');d.className='nbRow';
  const req=N.req?(N.req.st==='open'?'❗ יש בקשה — לך לדבר':'🎯 '+N.req.r.ask):'';
  d.innerHTML='<b></b><div><strong></strong><span></span><small></small></div>';d.querySelector('b').textContent=N.icon;d.querySelector('strong').textContent=N.name+' · '+FR_TITLE(f);
  d.querySelector('span').textContent=heartsOf(f)+'  ('+Math.max(0,f)+'/10)';d.querySelector('small').textContent='📍 '+nbWhere(N)+(req?' · '+req:'');L.appendChild(d)}
 bookEl.hidden=false}
bookEl.querySelector('#nbClose').onclick=()=>{bookEl.hidden=true};bookEl.addEventListener('click',e=>{if(e.target===bookEl)bookEl.hidden=true});
const bookChip=document.createElement('button');bookChip.className='chip';bookChip.type='button';bookChip.id='bookChip';bookChip.textContent='📒';bookChip.title='השכנים';bookChip.onclick=openBook;mapChip.after(bookChip);
// the map shows the new street and the neighbours
{const _dm=drawMap;drawMap=function(){_dm();const cv=document.getElementById('tmCanvas'),q=cv.getContext('2d'),W=cv.width,H=cv.height,s=Math.min(W/(MAPB.x1-MAPB.x0),H/(MAPB.z1-MAPB.z0));const X=x=>(MAPB.x1-x)*s,Y=z=>(z-MAPB.z0)*s;
 const rect=(r,c)=>{q.fillStyle=c;q.fillRect(Math.min(X(r.x0),X(r.x1)),Y(r.z0),Math.abs(X(r.x1)-X(r.x0)),Y(r.z1)-Y(r.z0))};
 rect({x0:-44,x1:62,z0:153.6,z1:158.4},'#6c6d72');for(const h of HOUSES)rect({x0:h.x-4,x1:h.x+4,z0:Math.min(h.zf,h.zf-h.dir*6),z1:Math.max(h.zf,h.zf-h.dir*6)},'#c97a5a');
 q.fillStyle='#1d1d1f';q.font='bold 13px system-ui';q.textAlign='center';q.fillText('🏘️ הרימונים',X(-20),Y(LANE_Z));
 q.font='14px system-ui';for(const N of NEIGH){const o=N.P.g.position;q.fillText(N.icon,X(o.x),Y(o.z))}}}
// ---------- wiring ----------
// inside grandma's house the camera stays inside too (it used to slip out through the doorway)
const inRachel=(x,z,r=0)=>x>=RACH.x-3.9+r&&x<=RACH.x+3.9-r&&z>=RACH.zf+.1+r&&z<=RACH.zf+5.9-r;
{const _tc=townCam;townCam=function(x,z,r){if(inRachel(look.x,look.z))return inRachel(x,z,r);return _tc(x,z,r)}}
const _uowH=updateOpenWorld;updateOpenWorld=function(dt){_uowH(dt);if(window.TOWN_READY&&OPEN_WORLD)updateHomes(dt)};
const _ctH=currentTarget;currentTarget=function(){const r=_ctH();if(r||!guideOn||!nbPlain())return r;
 if(NBH.carry){const N=NBH.carry;return N.req&&N.req.r.t==='boxes'?HB.cohen.door:N.P.g.position}
 for(const N of NEIGH)if(N.req&&N.req.st==='taken'){if(N.req.item&&NB_ITEMS[N.req.item].visible)return NB_ITEMS[N.req.item].position;if(N.req.r.t==='cat')return catM.position}return null};
const _nthH=nextTaskHint;nextTaskHint=function(){const h=_nthH();if(!nbPlain()||!inRect({x0:-44,x1:62,z0:140,z1:172.5},pos.x,pos.z))return h;
 if(NBH.carry)return '🎁 תביא את ה'+NB_INAMES[NBH.carry.req.item]+' ל'+NBH.carry.name;const N=nbNear(6);if(N&&N.req&&N.req.st==='open')return '❗ '+N.name+' '+({m:'צריך',f:'צריכה',p:'צריכים'}[N.g])+' עזרה — לך לדבר';return h};
window.NEIGH=NEIGH;window.NBH=NBH;window.HB=HB;window.NB_READY=true;
