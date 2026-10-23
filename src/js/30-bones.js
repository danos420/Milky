// ===== Golden bones =====
function updateBones(dt){
 const t=performance.now()*.001;
 for(const b of bones){if(b.taken)continue;b.g.rotation.y+=dt*2.5;b.g.position.y=b.y+Math.sin(t*3+b.y)*.08;
  if(Math.hypot(pos.x-b.g.position.x,pos.z-b.g.position.z)<.95&&Math.abs((jumpY+1)-b.g.position.y)<1.1){
   b.taken=true;b.g.visible=false;bonesFound++;if(window.JUICE_READY){pow('✨ עצם זהב!',b.g.position.x,b.g.position.y+.6,b.g.position.z,true);slowMo(.3)}recordProgress();boneChip.textContent='🦴 '+bonesFound+'/'+bones.length;addScore(1000,'עצם זהב '+bonesFound+'/'+bones.length);
   playToySound(880,.1,'triangle');setTimeout(()=>playToySound(1320,.14,'triangle'),100);milkyThought('🦴',1.6,true);
   if(bonesFound===bones.length){completeChallenge('bones');addActivity('🏆 מילקי מצא את כל עצמות הזהב!')}}}
}
function animatePerson(P,step,dt,pose){
 const t=performance.now()*.001;P.walk+=step*8;const w=step>.001;
 P.arms.forEach((a,i)=>{const g=pose.arm?pose.arm(i):0;const sw=w&&!pose.run?Math.sin(P.walk+(i?Math.PI:0))*.55:Math.sin(t*1.5+i)*.05;a.rotation.x+=(sw+g-a.rotation.x)*Math.min(1,dt*9)});
 P.legs.forEach((l,i)=>{const tg=w?Math.sin(P.walk+(i?0:Math.PI))*(pose.run?.8:.5):0;l.rotation.x+=(tg-l.rotation.x)*Math.min(1,dt*10)});
 P.g.position.y=w?Math.abs(Math.sin(P.walk))*.05:0;
 P.mouth.scale.y=pose.shout?2.6:1;P.mouth.scale.x=pose.shout?1.3:1;
}
function updateYard(dt){
 trickTimer=Math.max(0,trickTimer-dt);
 updateGrab(dt);updateWater(dt);updateNeighbor(dt);updateLady(dt);updateCat(dt);updateBones(dt);updateParts(dt);
 trampMat.scale.y=1;
}
function resetYard(){
 releaseGrab(false);rag.active=false;flip.active=false;dizzy.active=false;starRing.visible=false;flipsThisAir=0;airTime=0;wet=0;shakeT=0;fur.color.setHex(0xf4f0e8);
 score=0;scoreChip.textContent='⭐ 0';bonesFound=0;for(const b of bones){b.taken=false;b.g.visible=true}boneChip.textContent='🦴 0/'+bones.length;
 if(kebab.parent)kebab.parent.remove(kebab);scene.add(kebab);kebab.position.copy(kebabHome);kebab.rotation.set(0,0,0);kebabState='grill';kebabTimer=0;nbState='grill';
 neighbor.g.position.copy(NB_HOME);neighbor.nav.path=[];ladyState='water';ladyCool=0;
 catS.moving=false;catS.i=1;cat.position.set(...PERCHES[1]);catS.cool=2;
 dog.rotation.set(0,yaw,0);trickTimer=0;hint.classList.remove('trick');
}
// Dizzy stars that circle Milky's head after a flip
const starRing=new THREE.Group();starRing.position.set(0,.5,.05);headPivot.add(starRing);starRing.visible=false;
{const sm=new THREE.MeshBasicMaterial({color:0xffd84a});for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const st=new THREE.Mesh(new THREE.OctahedronGeometry(.11),sm);st.position.set(Math.cos(a)*.4,Math.sin(i*2)*.05,Math.sin(a)*.4);starRing.add(st)}}
const dizzy={active:false,t:0,shook:false};
function startDizzy(n){dizzy.active=true;dizzy.t=0;dizzy.shook=false;milkyThought('💫',1.6,true);SFX.slide();if(n>1)setTimeout(()=>playToySound(700,.4,'sine'),250)}
