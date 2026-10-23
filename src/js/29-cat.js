// ===== The cat =====
const catS={moving:false,from:new THREE.Vector3(),to:new THREE.Vector3(),t:0,dur:1,cool:2,touchCool:0,i:1};
function catFlee(){if(Math.hypot(pos.x-cat.position.x,pos.z-cat.position.z)<5)SFX.bark(.9,1.05,3);
 let best=0,bd=-1;PERCHES.forEach((p,i)=>{const d=Math.hypot(p[0]-pos.x,p[2]-pos.z);if(i!==catS.i&&d>bd){bd=d;best=i}});
 catS.i=best;catS.from.copy(cat.position);catS.to.set(...PERCHES[best]);catS.t=0;catS.dur=catS.from.distanceTo(catS.to)/6.5+.4;catS.moving=true;
 playToySound(900,.08,'triangle');setTimeout(()=>playToySound(700,.12,'triangle'),90);thought(catB,'😼',1.6);
}
function updateCat(dt){
 const t=performance.now()*.001;catS.cool=Math.max(0,catS.cool-dt);catS.touchCool=Math.max(0,catS.touchCool-dt);
 if(catS.moving){catS.t+=dt;const f=Math.min(1,catS.t/catS.dur);cat.position.lerpVectors(catS.from,catS.to,f);cat.position.y=catS.from.y+(catS.to.y-catS.from.y)*f-Math.sin(Math.PI*f)*1.4*(catS.from.y>1&&catS.to.y>1?1:0)+Math.abs(Math.sin(f*Math.PI*6))*.25;
  cat.position.y=Math.max(0,cat.position.y);faceToward(cat,catS.to.x,catS.to.z,dt,12);if(f>=1){catS.moving=false;catS.cool=1.5}}
 else{cat.rotation.z=Math.sin(t*2)*.03;if(catS.cool===0&&Math.hypot(pos.x-cat.position.x,pos.z-cat.position.z)<4)catFlee();
  else if(Math.random()<dt*.08)thought(catB,Math.random()<.5?'😼':'💤',1.6)}
 const dy=(jumpY+1)-(cat.position.y+.35);
 if(catS.touchCool===0&&Math.hypot(pos.x-cat.position.x,pos.z-cat.position.z)<1.1&&Math.abs(dy)<1.1){catS.touchCool=6;addScore(300,'נגעתי בחתול!');completeChallenge('cat');dayEvent('cat');thought(catB,'🙀',1.8);catFlee()}
}
