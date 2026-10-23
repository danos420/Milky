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
 fetch:{ok:()=>daniState!=='park',limit:30,banner:'🎾 דני זורק כדור! תביא לו אותו',
  start(){let a=Math.random()*Math.PI*2;for(let i=0;i<12;i++){const b=Math.random()*Math.PI*2;if(lineFree(dani.position.x,dani.position.z,dani.position.x+Math.sin(b)*5,dani.position.z+Math.cos(b)*5,.35)){a=b;break}}evt.far=false;toyBall.position.set(dani.position.x+Math.sin(a)*.7,.34,dani.position.z+Math.cos(a)*.7);toyVelocity.set(Math.sin(a)*10,Math.cos(a)*10);evt.touched=false;daniPlayCool=60;setDani('cheer');sayDani('מילקי! תביא!')},
  pill:()=>evt.touched?'🎾 עכשיו תחזיר לדני':'🎾 תביא את הכדור',
  update(){const bd0=Math.hypot(dani.position.x-toyBall.position.x,dani.position.z-toyBall.position.z);if(bd0>3)evt.far=true;if(evt.far&&Math.hypot(toyBall.position.x-pos.x,toyBall.position.z-pos.z)<1.1*MS)evt.touched=true;
   const dd=Math.hypot(dani.position.x-pos.x,dani.position.z-pos.z),bd=Math.hypot(dani.position.x-toyBall.position.x,dani.position.z-toyBall.position.z);
   if(evt.touched&&(bd<1.9||(grab&&grab.b.isBall&&dd<2.2)))return 'win'},
  win(){addScore(700,'הבאת את הכדור!');sayDani(pick(['כלב טוב!!','איזה כלב גאון!','עוד פעם! עוד פעם!']));setDani('cheer')},
  fail(){sayDani('טוב... אני אביא לבד')}},
 pizza:{ok:()=>true,limit:38,banner:'🍕 השליח השאיר פיצה על השולחן בחצר!',
  start(){pizza.visible=true;pizza.scale.setScalar(1);sayDani('מישהו הזמין פיצה? אני כבר בא!')},
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
 if(!evt.cur){if(BATH_BLOCK||rag.active||slipperState==='carried'||kebabState==='carried')return;evt.cool-=dt;if(evt.cool<=0)startEvent();return}
 const E=EVENTS[evt.cur];evt.t+=dt;
 let r=E.update(dt);evt.prevGround=grounded;
 if(!r&&evt.t>=E.limit)r=E.timeoutWins?'win':'fail';
 if(r){endEvent(r);return}
 const label=E.pill()+' · '+Math.max(0,Math.ceil(E.limit-evt.t));if(label!==evt.label){evt.label=label;evtPill.textContent=label}
}
function resetEvents(){if(evt.cur){const E=EVENTS[evt.cur];if(E.end)E.end()}evt.cur=null;evt.cool=50;evt.last='';evtPill.hidden=true;evtNap=false;pizza.visible=false;rain.visible=false}
window.EVENTS_READY=true;


