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
