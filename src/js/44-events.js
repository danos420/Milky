// ===== Surprise events during the day: fetch, pizza, dad's nap, rain dance =====
var noiseLevel=0,evtNap=false;
LIGHT.push({sky:0x7f8a97,hemi:0xc6d0dc,ground:0x34363e,sun:0xcfd8e6,sunI:.55,k:.76});
const evtPill=document.getElementById('eventPill');
const pizza=new THREE.Group();pizza.position.set(0,.74,-12.5);scene.add(pizza);
box(.62,.07,.62,mat(0xd9b47a),0,.035,0,pizza);cyl(.27,.03,mat(0xf0b24a,.7),0,.085,0,pizza);
for(const [x,z] of [[.1,.08],[-.12,.05],[.02,-.13],[-.05,.15],[.14,-.08]])cyl(.045,.012,mat(0xb8322a,.7),x,.105,z,pizza);
pizza.visible=false;
const rainN=320,rain=new THREE.InstancedMesh(new THREE.BoxGeometry(.018,.55,.018),new THREE.MeshBasicMaterial({color:0xb9cde3,transparent:true,opacity:.6,depthWrite:false}),rainN);
rain.frustumCulled=false;rain.visible=false;rain.castShadow=false;scene.add(rain);const rainP=new Float32Array(rainN*3),_rm=new THREE.Matrix4();
const evt={cur:null,t:0,cool:50,last:'',jumps:0,touched:false,noise0:0,prevGround:true,label:''};
const outside=()=>pos.z<-9.1;
const EVENTS={
 fetch:{ok:()=>true,limit:30,banner:'🎾 דני זורק כדור! תביא לו אותו',
  start(){let a=Math.random()*Math.PI*2;for(let i=0;i<12;i++){const b=Math.random()*Math.PI*2;if(lineFree(dani.position.x,dani.position.z,dani.position.x+Math.sin(b)*5,dani.position.z+Math.cos(b)*5,.35)){a=b;break}}evt.far=false;toyBall.position.set(dani.position.x+Math.sin(a)*.7,.34,dani.position.z+Math.cos(a)*.7);toyVelocity.set(Math.sin(a)*10,Math.cos(a)*10);evt.touched=false;daniPlayCool=60;setDani('cheer');sayDani('מילקי! תביא!')},
  pill:()=>evt.touched?'🎾 עכשיו תחזיר לדני':'🎾 תביא את הכדור',
  update(){const bd0=Math.hypot(dani.position.x-toyBall.position.x,dani.position.z-toyBall.position.z);if(bd0>3)evt.far=true;if(evt.far&&Math.hypot(toyBall.position.x-pos.x,toyBall.position.z-pos.z)<1.1*MS)evt.touched=true;
   const dd=Math.hypot(dani.position.x-pos.x,dani.position.z-pos.z),bd=Math.hypot(dani.position.x-toyBall.position.x,dani.position.z-toyBall.position.z);
   if(evt.touched&&(bd<1.9||(grab&&grab.b.isBall&&dd<2.2)))return 'win'},
  win(){addScore(700,'הבאת את הכדור!');sayDani(pick(['כלב טוב!!','איזה כלב גאון!','עוד פעם! עוד פעם!']));setDani('cheer')},
  fail(){sayDani('טוב... אני אביא לבד')}},
 pizza:{ok:()=>true,limit:38,banner:'🍕 השליח השאיר פיצה על השולחן בחצר!',
  start(){pizza.visible=true;pizza.scale.setScalar(1);sayDani('מישהו הזמין פיצה? אני כבר באה!')},
  pill:()=>'🍕 לקפוץ על השולחן בחצר לפני דני',
  update(){if(Math.hypot(pos.x-pizza.position.x,pos.z-pizza.position.z)<.95&&jumpY>.5)return 'win'},
  win(){addScore(900,'גנבת פיצה!');sayText(milkyB,'🍕 מממממ',2,'say',true);setTimeout(()=>sayDani('מילקייי! זאת הייתה הפיצה שלי!'),900);pizza.visible=false},
  fail(){sayDani('אממ פיצה. תודה מילקי 😋');pizza.visible=false},
  end(){pizza.visible=false}},
 nap:{ok:()=>dadSeated&&dadState==='rest',limit:25,banner:'🤫 אבא נרדם בכורסה. שקט 25 שניות!',
  start(){evtNap=true;if(tvOn){tvOn=false;tvGlow.material.opacity=0}evt.noise0=noiseLevel;sayText(dadB,'ררררר... 💤',2.6,'think',true)},
  pill:()=>'🤫 לא להעיר את אבא',
  update(){if(!dadSeated&&evt.t>1){addActivity('👨 אבא התעורר לבד והלך למטבח');return 'cancel'}if(noiseLevel-evt.noise0>=14||tvOn)return 'fail';if(evt.t>=25)return 'win'},
  win(){addScore(1000,'אבא ישן כמו תינוק');thought(milkyB,'😇',1.8,true)},
  fail(){speakDad(pick(['מי עשה רעש?!','מילקי! רק נרדמתי!','אני ער! אני ער!']));if(typeof dadLaughT!=='undefined')dadLaughT=0},
  end(){evtNap=false},timeoutWins:true},
 rain:{ok:()=>day.phase>=1,limit:32,banner:'🌧️ גשם! 5 קפיצות בחוץ בגשם',
  start(){evt.jumps=0;rain.visible=true;day.light=4;speakDad('מילקי, אל תיכנס רטוב הביתה!')},
  pill:()=>'🌧️ קפיצות בגשם '+evt.jumps+'/5',
  update(){if(outside()&&!grounded&&evt.prevGround&&velocityY>0){evt.jumps++;wet=1;for(let i=0;i<6;i++)emit(pos.x,.15,pos.z,(Math.random()-.5)*3,2+Math.random()*2,(Math.random()-.5)*3,'water',.6)}
   if(outside())wet=1;if(evt.jumps>=5)return 'win'},
  win(){addScore(800,'ריקוד גשם!');thought(milkyB,'🌈',2,true)},
  fail(){addActivity('🌤️ הגשם נגמר')},
  end(){rain.visible=false;day.light=day.finished?3:Math.min(day.phase,2)}}
};
function startEvent(){
 const ids=Object.keys(EVENTS).filter(k=>k!==evt.last&&EVENTS[k].ok());if(!ids.length)return;
 const id=pick(ids),E=EVENTS[id];evt.cur=id;evt.last=id;evt.t=0;evt.prevGround=grounded;
 E.start();showBanner(E.banner);addActivity(E.banner);SFX.fanfare&&SFX.fanfare(false);evtPill.hidden=false;
}
function endEvent(result){
 const E=EVENTS[evt.cur];if(!E)return;
 if(result==='win'){E.win();addActivity('✅ אירוע הושלם!');save.evtWins=(+save.evtWins||0)+1;writeSave();SFX.fanfare&&SFX.fanfare(true)}else if(result==='fail')E.fail();
 if(E.end)E.end();evt.cur=null;evt.cool=55+Math.random()*45;evtPill.hidden=true;evt.label='';
}
function updateEvents(dt,t){
 if(rain.visible){const P=rainP,cx=camera.position.x,cz=camera.position.z;
  for(let i=0;i<rainN;i++){const k=i*3;let y=P[k+1]-dt*13;
   if(y<0||Math.abs(P[k]-cx)>9||Math.abs(P[k+2]-cz)>9){P[k]=cx+(Math.random()-.5)*18;P[k+2]=cz+(Math.random()-.5)*18;y=y<0?7+Math.random()*2:Math.random()*8}
   P[k+1]=y;_rm.makeTranslation(P[k],P[k+2]>-9.2||Math.abs(P[k]-cx)+Math.abs(P[k+2]-cz)<2.6?-50:y,P[k+2]);rain.setMatrixAt(i,_rm)}
  rain.instanceMatrix.needsUpdate=true}
 if(day.finished){if(evt.cur)endEvent('cancel');return}
 if(!evt.cur){if(rag.active||slipperState==='carried'||kebabState==='carried')return;evt.cool-=dt;if(evt.cool<=0)startEvent();return}
 const E=EVENTS[evt.cur];evt.t+=dt;
 let r=E.update(dt);evt.prevGround=grounded;
 if(!r&&evt.t>=E.limit)r=E.timeoutWins?'win':'fail';
 if(r){endEvent(r);return}
 const label=E.pill()+' · '+Math.max(0,Math.ceil(E.limit-evt.t));if(label!==evt.label){evt.label=label;evtPill.textContent=label}
}
function resetEvents(){if(evt.cur){const E=EVENTS[evt.cur];if(E.end)E.end()}evt.cur=null;evt.cool=50;evt.last='';evtPill.hidden=true;evtNap=false;pizza.visible=false;rain.visible=false}
window.EVENTS_READY=true;


(function mergeAll(){
 scene.updateMatrixWorld(true);
 // 1) Static scenery: merge per area, so whole rooms you cannot see are skipped by the GPU.
 const region=m=>{const p=new THREE.Vector3().setFromMatrixPosition(m.matrixWorld);return p.z>9?'k':p.z>-9?'l':p.z<-55?'far':(p.x<0?'yL':'yR')+(p.z<-25?'b':'f')};
 const groups=new Map();
 for(const m of scene.children.slice()){
  if(!m.isMesh||KEEP.has(m)||!m.visible||!m.geometry.attributes.normal||m.children.length)continue;
  const key=region(m)+'#'+matKey(m.material,m.castShadow);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(m);
 }
 for(const list of groups.values()){const mm=list.length>1?mergeInto(scene,list,true):list[0];mm.userData.static=true;mm.userData.cast=mm.castShadow}
 // 2) Characters and props: merge parts that move together (same parent, same look).
 const parents=new Set();scene.traverse(o=>{if(o!==scene&&o.isGroup)parents.add(o)});
 for(const p of parents){const g=new Map();
  for(const m of p.children){if(!m.isMesh||KEEP.has(m)||m.children.length||!m.geometry.attributes.normal)continue;const key=matKey(m.material,m.castShadow);if(!g.has(key))g.set(key,[]);g.get(key).push(m)}
  for(const list of g.values())if(list.length>1)mergeInto(p,list,false);
 }
})();
// Quality tiers. high = desktop look. medium = phones (cheaper lighting, small shadow map, only moving things cast shadows). low = no shadows.
const lamCache=new Map();
function lambertOf(M){let L=lamCache.get(M);if(!L){L=new THREE.MeshLambertMaterial({color:M.color.clone(),emissive:M.emissive?M.emissive.clone():undefined,transparent:M.transparent,opacity:M.opacity,side:M.side,depthWrite:M.depthWrite,polygonOffset:M.polygonOffset,polygonOffsetFactor:M.polygonOffsetFactor,polygonOffsetUnits:M.polygonOffsetUnits});lamCache.set(M,L)}return L}
function syncLiveMats(){for(const M of LIVE_MATS){const L=lamCache.get(M);if(L){L.opacity=M.opacity;L.depthWrite=M.depthWrite;L.color.copy(M.color)}}}
let tier='',pixelRatioNow=renderer.getPixelRatio();
const QKEY='milky-bardak-quality';let qualityPref='auto';try{qualityPref=localStorage.getItem(QKEY)||'auto'}catch(_){}
function applyTier(t){
 if(t===tier)return;tier=t;const high=t==='high';
 renderer.shadowMap.enabled=t!=='low';renderer.shadowMap.type=high?THREE.PCFSoftShadowMap:THREE.PCFShadowMap;
 const ms=high?1024:512;sun.shadow.mapSize.set(ms,ms);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}
 const ext=high?16:11;Object.assign(sun.shadow.camera,{left:-ext,right:ext,top:ext,bottom:-ext});sun.shadow.camera.updateProjectionMatrix();
 lampGlow.visible=kitchenLight.visible=windowFill.visible=high;renderer.toneMappingExposure=high?.72:.7;
 scene.traverse(o=>{
  if(!o.isMesh)return;
  if(o.userData.static)o.castShadow=high?o.userData.cast:false;
  const std=o.userData.std||(o.material.isMeshStandardMaterial?o.material:null);if(!std)return;o.userData.std=std;
  o.material=high?std:lambertOf(std);o.material.needsUpdate=true;
 });
}
function setPixelRatio(pr){pr=Math.max(.7,Math.min(pr,devicePixelRatio,1.5));if(Math.abs(pr-pixelRatioNow)<.01)return;pixelRatioNow=pr;renderer.setPixelRatio(pr);renderer.setSize(innerWidth,innerHeight)}
const qualityBtn=document.getElementById('qualityBtn');
const Q_LABEL={auto:'אוטומטי',high:'גבוהה',medium:'בינונית',low:'נמוכה'};
function applyPref(){qualityBtn.textContent='⚙️ גרפיקה: '+Q_LABEL[qualityPref];
 if(qualityPref==='auto'){applyTier(IS_TOUCH?'medium':'high');setPixelRatio(1.5)}
 else{applyTier(qualityPref);setPixelRatio(qualityPref==='high'?1.5:qualityPref==='medium'?1.1:.85)}}
qualityBtn.addEventListener('click',()=>{const order=['auto','high','medium','low'];qualityPref=order[(order.indexOf(qualityPref)+1)%4];try{localStorage.setItem(QKEY,qualityPref)}catch(_){}applyPref();renderer.compile(scene,camera)});
applyPref();
{const warm=[rain,pizza,...Object.values(WEAR)],was=warm.map(o=>o.visible);warm.forEach(o=>o.visible=true);renderer.compile(scene,camera);warm.forEach((o,i)=>o.visible=was[i])}
// Auto mode: watch the real frame rate and step quality down (or up) to keep things smooth.
let perfT0=0,perfFrames=0,perfChanges=0;
function perfTick(){
 if(!started||document.hidden||qualityPref!=='auto'){perfT0=0;return}
 const now=performance.now();if(!perfT0){perfT0=now;perfFrames=0;return}
 perfFrames++;const el=now-perfT0;if(el<3000)return;
 const fps=perfFrames*1000/el;perfT0=now;perfFrames=0;
 if(fps<45&&pixelRatioNow>.86){perfChanges++;setPixelRatio(pixelRatioNow-.2)}
 else if(fps<30&&tier==='medium'&&perfChanges>=2){perfChanges++;applyTier('low');renderer.compile(scene,camera)}
}
applySave();buildNav();resetDay();
{const n=document.getElementById('saveNote');if(save.challenges.length||save.bones.length||save.best)n.textContent='ממשיכים מאיפה שעצרת: '+save.challenges.length+'/'+challengeDefs.length+' אתגרים · '+save.bones.length+'/'+bones.length+' עצמות · שיא '+save.best.toLocaleString('he-IL')}
camera.position.set(0,4,9);animate();window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
