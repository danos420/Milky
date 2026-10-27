// ===== Day, night and weather in the open world. One clock with the neighbours (a day = their 4 phases):
// sunrise → noon → sunset → night, lamps and windows light up, stars, moon, fireflies; clouds, rain, storms, puddles, a rainbow =====
const SKY={frac:.12,w:'clear',wT:110,rainK:0,cloudK:0,wet:0,rainbow:0,flash:0,night:0,active:false};
if(NBH.t===0)NBH.t=SKY.frac*4*PHASE_LEN; // the open world starts in the morning
LIGHT.push({sky:0x98c9ea,hemi:0xfff2dc,ground:0x5a4a3d,sun:0xffffff,sunI:1.3,k:1});const SKY_L=LIGHT.length-1;
const SKY_KEYS=[
 [0.00,{sky:0xf2b28a,hemi:0xffc8a0,ground:0x4a3a3c,sun:0xffa060,sunI:.8,k:.84}],  // sunrise
 [0.10,{sky:0xa9c4d3,hemi:0xffe4c2,ground:0x51433d,sun:0xfff0d8,sunI:1.15,k:1}],   // morning
 [0.30,{sky:0x98c9ea,hemi:0xfff2dc,ground:0x5a4a3d,sun:0xffffff,sunI:1.35,k:1.08}],// noon
 [0.55,{sky:0xb0c8da,hemi:0xffe4bc,ground:0x55463d,sun:0xffe2b4,sunI:1.2,k:1.02}], // afternoon
 [0.68,{sky:0xe79d78,hemi:0xffb98a,ground:0x3c2f3c,sun:0xff9a55,sunI:1.0,k:.9}],   // sunset
 [0.77,{sky:0x5a4a78,hemi:0xb4a4dc,ground:0x2a2438,sun:0xc0a0ff,sunI:.62,k:.74}],  // dusk
 [0.85,{sky:0x111933,hemi:0x6f84b8,ground:0x121420,sun:0x8fa0f0,sunI:.28,k:.5}],   // night
 [0.95,{sky:0x111933,hemi:0x6f84b8,ground:0x121420,sun:0x8fa0f0,sunI:.28,k:.5}],
 [1.00,{sky:0xf2b28a,hemi:0xffc8a0,ground:0x4a3a3c,sun:0xffa060,sunI:.8,k:.84}]];
const RAINY={sky:0x6f7a88,hemi:0xb8c2d0,ground:0x30323a,sun:0xc8d2e0,sunI:.5,k:.74};
const _ka=new THREE.Color(),_kb=new THREE.Color();
function skyLook(f){let i=0;while(i<SKY_KEYS.length-2&&f>=SKY_KEYS[i+1][0])i++;const [f0,A]=SKY_KEYS[i],[f1,B]=SKY_KEYS[i+1],t=(f-f0)/(f1-f0);
 const o={};for(const k of ['sky','hemi','ground','sun'])o[k]=_ka.setHex(A[k]).lerp(_kb.setHex(B[k]),t).getHex();o.sunI=A.sunI+(B.sunI-A.sunI)*t;o.k=A.k+(B.k-A.k)*t;
 // rain greys the day (less at night, which is dark already)
 const r=Math.max(SKY.rainK*.85,SKY.cloudK*.45)*(1-SKY.night*.6);if(r>0){for(const k of ['sky','hemi','ground','sun'])o[k]=_ka.setHex(o[k]).lerp(_kb.setHex(RAINY[k]),r).getHex();o.sunI+=(RAINY.sunI-o.sunI)*r;o.k+=(RAINY.k-o.k)*r*.7}
 return o}
const skyMode=()=>OPEN_WORLD&&started&&!window.RACE_ON&&!(window.Z_READY&&ZOMBIE)&&!window.DETECT;
// indoors: no rain falling on Milky's head
const indoors=(x,z)=>(Math.abs(x)<6.4&&z>-8.9&&z<15.9)||(x>20.2&&x<31.4&&z>0&&z<40)||(typeof inRachel==='function'&&inRachel(x,z));
// ---------- the sky dome: stars, moon ----------
const starsG=(()=>{const n=420,p=new Float32Array(n*3);for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,e=.12+Math.random()*1.3,r=88;p[i*3]=Math.cos(a)*Math.cos(e)*r;p[i*3+1]=Math.sin(e)*r;p[i*3+2]=Math.sin(a)*Math.cos(e)*r}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));const m=new THREE.PointsMaterial({color:0xffffff,size:1.6,sizeAttenuation:false,fog:false,transparent:true,opacity:0,depthWrite:false});
 const s=new THREE.Points(g,m);s.frustumCulled=false;s.renderOrder=-2;scene.add(s);return s})();
const moon=new THREE.Mesh(new THREE.SphereGeometry(3.2,16,12),new THREE.MeshBasicMaterial({color:0xf6f1d8,fog:false,transparent:true,opacity:0}));moon.frustumCulled=false;moon.visible=false;KEEP.add(moon);scene.add(moon);
// ---------- clouds (one draw call) ----------
const CLOUD_N=36,clouds=new THREE.InstancedMesh(new THREE.SphereGeometry(1,10,7),new THREE.MeshBasicMaterial({color:0xffffff,fog:false,transparent:true,opacity:.85,depthWrite:false}),CLOUD_N);clouds.frustumCulled=false;clouds.visible=false;KEEP.add(clouds);scene.add(clouds);
const CL=[];for(let c=0;c<12;c++){const cx=(Math.random()-.5)*130,cz=(Math.random()-.5)*130,cy=30+Math.random()*8;for(let k=0;k<3;k++)CL.push({x:cx+(k-1)*5+Math.random()*2,y:cy+Math.random()*1.5,z:cz+(Math.random()-.5)*3,s:4+Math.random()*3})}
const _cm=new THREE.Matrix4(),_cq=new THREE.Quaternion(),_cv=new THREE.Vector3(),_cs=new THREE.Vector3();
// ---------- rain (one draw call) ----------
const RAIN_N=650,rainD=new Float32Array(RAIN_N*3),_rmx=new THREE.Matrix4();
const rainL=new THREE.InstancedMesh(new THREE.BoxGeometry(.035,.85,.035),new THREE.MeshBasicMaterial({color:0xdfe9f5,transparent:true,opacity:.6,depthWrite:false}),RAIN_N);rainL.frustumCulled=false;rainL.visible=false;KEEP.add(rainL);scene.add(rainL);
for(let i=0;i<RAIN_N;i++)rainD[i*3+1]=-99;
// ---------- puddles on the roads, the square and the lane ----------
const puddleMat=new THREE.MeshBasicMaterial({color:0x4d6680,transparent:true,opacity:0,depthWrite:false});
const PUDDLES=[[12,60,1.4],[15,92,1.1],[11.5,108,1.6],[4,124,1.8],[22,134,1.3],[-6,128,1.2],[13,150,1.5],[-20,156,1.6],[-34,155,1.2],[30,157,1.4],[47,155.5,1.1],[13,166,1.2],[11,30,1.3],[16,8,1.1]].map(([x,z,r])=>{const m=new THREE.Mesh(new THREE.CircleGeometry(r,18),puddleMat);m.rotation.x=-Math.PI/2;m.position.set(x,.04,z);m.scale.set(1,1.4,1);m.visible=false;scene.add(m);return {m,x,z,r}});
// ---------- the rainbow over the sea ----------
const rainbow=new THREE.Group();rainbow.position.set(13,-6,262);scene.add(rainbow);[0xff4d4d,0xff9f43,0xffd93d,0x6bdc6b,0x4da6ff,0x8a5cff].forEach((c,i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(36-i*1.5,.8,6,48,Math.PI),new THREE.MeshBasicMaterial({color:c,fog:false,transparent:true,opacity:0,depthWrite:false}));rainbow.add(m)});rainbow.visible=false;
// ---------- fireflies in the forest at night ----------
const FF_N=50,ffPos=new Float32Array(FF_N*3),ffGeo=new THREE.BufferGeometry();ffGeo.setAttribute('position',new THREE.BufferAttribute(ffPos,3));
const fireflies=new THREE.Points(ffGeo,new THREE.PointsMaterial({color:0xfff27a,size:5,sizeAttenuation:false,transparent:true,opacity:0,depthWrite:false,fog:false}));fireflies.frustumCulled=false;fireflies.visible=false;scene.add(fireflies);
const FF=[];for(let i=0;i<FF_N;i++)FF.push({x:0,y:1,z:0,ph:Math.random()*6.3,v:new THREE.Vector2()});let ffInit=false;
// ---------- umbrellas for the neighbours ----------
const umbrellas=(window.NEIGH||[]).map((N,i)=>{const g=new THREE.Group();g.position.set(.42,N.kid?2.75:2.95,.1);N.P.g.add(g);const c=mesh(new THREE.ConeGeometry(1,.45,10),mat([0xe74c3c,0x3a7bd5,0xf2c14e,0x6aa86b,0xff3fa0,0x9b59b6,0x2c3e50,0xe85d75][i%8],.6),0,.55,0,g);cyl(.03,1.2,mat(0x3a3d42),0,0,0,g);g.visible=false;return g});
// ---------- night lights: lamps glow, windows turn warm ----------
let glowList=null,winList=null;
function collectLights(){glowList=[];winList=[];scene.traverse(o=>{if(!o.isMesh||!o.material||!o.material.color)return;const h=o.material.color.getHex();
 if(h===0xfff3c4&&o.material.emissive)glowList.push(o);if(o.material.isMeshBasicMaterial&&(h===0x9fd3e8||o.userData.winDay))winList.push(o)})}
const _wDay=new THREE.Color(0x9fd3e8),_wNight=new THREE.Color(0xffd27a);
// ---------- the clock and weather chip ----------
const skyChip=document.createElement('button');skyChip.className='chip';skyChip.type='button';skyChip.id='skyChip';skyChip.title='שעה ומזג אוויר';
skyChip.onclick=()=>showBanner(skyText()+' · '+({clear:'שמיים בהירים',cloudy:'מעונן',rain:'יורד גשם',storm:'סערה!'}[SKY.w]));
(document.getElementById('bookChip')||mapChip).after(skyChip);
const HOURS=[[0,5.5],[.1,8],[.3,12.5],[.55,16],[.68,19],[.77,20.5],[.85,22],[.97,28.5],[1,29.5]];
function skyHour(){const f=SKY.frac;let i=0;while(i<HOURS.length-2&&f>=HOURS[i+1][0])i++;const [a,h0]=HOURS[i],[b,h1]=HOURS[i+1];return (h0+(h1-h0)*(f-a)/(b-a))%24}
function skyText(){const h=skyHour(),hh=Math.floor(h),mm=Math.floor((h-hh)*60/10)*10;const ic=SKY.w==='storm'?'⛈️':SKY.w==='rain'?'🌧️':SKY.w==='cloudy'?'☁️':SKY.night>.5?'🌙':h<8?'🌅':h>17.5?'🌇':'☀️';return ic+' '+String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0')}
// ---------- weather changes ----------
const W_NEXT={clear:[['clear',.55],['cloudy',.25],['rain',.2]],cloudy:[['clear',.35],['cloudy',.25],['rain',.28],['storm',.12]],rain:[['clear',.7],['cloudy',.3]],storm:[['clear',.6],['cloudy',.4]]};
const W_LEN={clear:[120,200],cloudy:[60,120],rain:[50,90],storm:[40,60]};
function setWeather(w,quiet){const was=SKY.w;SKY.w=w;const [a,b]=W_LEN[w];SKY.wT=a+Math.random()*(b-a);
 if(quiet||!skyMode())return;if(w==='rain'&&was!=='storm')showBanner('🌧️ מתחיל לרדת גשם!');if(w==='storm')showBanner('⛈️ סערה!');if((was==='rain'||was==='storm')&&w==='clear'&&SKY.night<.4){SKY.rainbow=60;showBanner('🌈 קשת מעל הים!')}}
function nextWeather(){const L=W_NEXT[SKY.w];let r=Math.random();for(const [w,p] of L){if((r-=p)<=0)return setWeather(w)}setWeather(L[0][0])}
const flashEl=document.createElement('div');flashEl.id='skyFlash';document.body.appendChild(flashEl);
// ---------- per frame ----------
function updateSky(dt){const on=skyMode();SKY.active=on;
 starsG.visible=moon.visible=clouds.visible=on;if(!on){rainL.visible=false;rainbow.visible=false;fireflies.visible=false;for(const p of PUDDLES)p.m.visible=false;for(const u of umbrellas)u.visible=false;skyChip.style.display='none';return}
 SKY.frac=(NBH.t%(4*PHASE_LEN))/(4*PHASE_LEN);
 SKY.wT-=dt;if(SKY.wT<=0)nextWeather();
 const raining=SKY.w==='rain'||SKY.w==='storm';SKY.rainK+=((raining?1:0)-SKY.rainK)*Math.min(1,dt*.35);SKY.cloudK+=((SKY.w==='clear'?0:1)-SKY.cloudK)*Math.min(1,dt*.25);
 SKY.wet=raining?Math.min(1,SKY.wet+dt*.05):Math.max(0,SKY.wet-dt/90);
 const f=SKY.frac;SKY.night=f>.8&&f<.97?Math.min(1,(f-.8)/.05,(.97-f)/.03):f>=.74&&f<=.8?(f-.74)/.06*.5:0;
 // lighting: drive the shared light slot; updateDay eases into it
 const L=skyLook(f);Object.assign(LIGHT[SKY_L],L);day.light=SKY_L;
 // stars, moon, clouds follow the camera
 const cp=camera.position;starsG.position.set(cp.x,0,cp.z);starsG.material.opacity=SKY.night*(1-SKY.cloudK*.85);
 moon.position.set(cp.x-40,62,cp.z+52);moon.material.opacity=SKY.night*(1-SKY.cloudK*.7);
 const cc=_ka.setHex(0xffffff).lerp(_kb.setHex(0x8a929e),Math.max(SKY.rainK,SKY.night*.75));clouds.material.color.copy(cc);clouds.material.opacity=.55+SKY.cloudK*.35;
 const wind=raining?4:1.2;CL.forEach((c,i)=>{c.x+=wind*dt;let rx=c.x-cp.x;if(rx>65)c.x-=130;if(rx<-65)c.x+=130;let rz=c.z-cp.z;if(rz>65)c.z-=130;if(rz<-65)c.z+=130;const s=c.s*(.7+SKY.cloudK*.6);
  _cm.compose(_cv.set(c.x,c.y-SKY.cloudK*3,c.z),_cq,_cs.set(s*1.4,s*.55,s));clouds.setMatrixAt(i,_cm)});clouds.instanceMatrix.needsUpdate=true;
 // rain falls around the camera (not indoors)
 const inside=indoors(pos.x,pos.z);rainL.visible=SKY.rainK>.05&&!inside;
 if(rainL.visible){const n=Math.floor(RAIN_N*SKY.rainK);for(let i=0;i<RAIN_N;i++){const k=i*3;if(i>=n){_rmx.makeTranslation(0,-99,0);rainL.setMatrixAt(i,_rmx);continue}let y=rainD[k+1]-dt*18;
   if(y<0||Math.abs(rainD[k]-cp.x)>14||Math.abs(rainD[k+2]-cp.z)>14){rainD[k]=cp.x+(Math.random()-.5)*28;rainD[k+2]=cp.z+(Math.random()-.5)*28;y=y<0?11+Math.random()*3:Math.random()*13}
   rainD[k+1]=y;_rmx.makeTranslation(rainD[k],y,rainD[k+2]);rainL.setMatrixAt(i,_rmx)}
  rainL.instanceMatrix.needsUpdate=true;rainL.material.opacity=.35+.35*SKY.rainK}
 // storm: lightning flashes
 SKY.flash=Math.max(0,SKY.flash-dt);if(SKY.w==='storm'&&SKY.rainK>.6&&Math.random()<dt*.12){SKY.flash=.35;chaosShake=Math.max(chaosShake,.12)}
 flashEl.style.opacity=SKY.flash>0?(SKY.flash>.25||SKY.flash<.1?.55:.1):0;
 // puddles: fill up in the rain, dry out after; Milky splashes through them
 puddleMat.opacity=SKY.wet*.7;for(const p of PUDDLES){p.m.visible=SKY.wet>.02&&Math.abs(p.x-cp.x)<70&&Math.abs(p.z-cp.z)<70;
  if(p.m.visible&&SKY.wet>.3&&jumpY<.15&&Math.hypot(pos.x-p.x,(pos.z-p.z)/1.4)<p.r&&lastDogSpeed>1.5&&Math.random()<dt*14)emit(pos.x,.15,pos.z,(Math.random()-.5)*2.5,1.6+Math.random(),(Math.random()-.5)*2.5,'water',.6)}
 // after the rain, in daylight: a rainbow over the sea
 SKY.rainbow=Math.max(0,SKY.rainbow-dt);rainbow.visible=SKY.rainbow>0;if(rainbow.visible){rainbow.position.set(cp.x,-21,cp.z+70);const o=Math.min(1,SKY.rainbow/8,(60-SKY.rainbow)/6)*.6;for(const m of rainbow.children)m.material.opacity=o}
 // night: lamps and windows; fireflies when Milky is in the forest
 if(!glowList)collectLights();const ni=SKY.night;for(const o of glowList){const m=o.material;if(m.emissive){m.emissive.setHex(0xffd27a);m.emissiveIntensity=ni*1.1}}
 for(const o of winList)o.material.color.copy(_wDay).lerp(_wNight,ni);
 const inForest=inRect(TOWN_AREAS.forest,pos.x,pos.z,6);fireflies.visible=ni>.2&&inForest;
 if(fireflies.visible){if(!ffInit){ffInit=true;for(const q of FF){q.x=pos.x+(Math.random()-.5)*24;q.z=pos.z+(Math.random()-.5)*24;q.y=.6+Math.random()*2}}
  const t=performance.now()/1000;FF.forEach((q,i)=>{q.v.x+=(Math.random()-.5)*dt*2;q.v.y+=(Math.random()-.5)*dt*2;q.v.multiplyScalar(.98);q.x+=q.v.x*dt;q.z+=q.v.y*dt;q.y=.8+Math.sin(t*.7+q.ph)*.6+.6;
   if(Math.abs(q.x-pos.x)>14)q.x=pos.x+(Math.random()-.5)*20;if(Math.abs(q.z-pos.z)>14)q.z=pos.z+(Math.random()-.5)*20;ffPos[i*3]=q.x;ffPos[i*3+1]=q.y;ffPos[i*3+2]=q.z});
  ffGeo.attributes.position.needsUpdate=true;fireflies.material.opacity=ni*(.55+.45*Math.sin(t*3))}else ffInit=false;
 // neighbours open umbrellas in the rain
 if(window.NEIGH)NEIGH.forEach((N,i)=>{const o=N.P.g.position;umbrellas[i].visible=SKY.rainK>.45&&!indoors(o.x,o.z)&&!(N.id==='rachel'&&typeof inRachel==='function'&&inRachel(o.x,o.z))});
 // Milky gets wet in the rain and comments now and then
 if(raining&&!inside&&Math.random()<dt*.03&&!specialMode())sayText(milkyB,pick(['🌧️ ...אני רטוב','💦 גשם! שלוליות!','☔ מישהו יש מטרייה?']),2,'think',false);
 skyChip.style.display='';const tx=skyText();if(skyChip.textContent!==tx)skyChip.textContent=tx}
const _uowS=updateOpenWorld;updateOpenWorld=function(dt){_uowS(dt);updateSky(dt)};
// outside the open world (story days, race, zombies, detective): hide all of it
{const _gsS=gameStep;gameStep=function(dt){_gsS(dt);if(!skyMode()&&(SKY.active||starsG.visible||rainL.visible))updateSky(0)}}
// the neighbours' phase banner now shows the time too
window.SKY=SKY;window.setWeather=setWeather;window.SKY_READY=true;
