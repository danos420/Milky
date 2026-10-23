// ===== Kebab and the neighbour at the mangal =====
let kebabState='grill',kebabTimer=0,nbState='grill',nbAction=0,smokeT=0;
const nearMangal=()=>kebabState==='grill'&&jumpY<.8&&Math.hypot(pos.x-2,pos.z+32.4)<1.5;
function stealKebab(){
 kebabState='carried';kebabTimer=0;scene.remove(kebab);dog.add(kebab);kebab.position.set(0,1.56,1.3);kebab.rotation.set(0,Math.PI/2,0);
 nbState='chase';SFX.bark(.8,1.1,1);addActivity('🍢 השכן: היי!!! הקבב שלי!!!');thought(nbB,'😡',2);milkyThought('🤤',1.5,true);playToySound(500,.08,'square');
}
function kebabBack(why){
 if(kebab.parent)kebab.parent.remove(kebab);scene.add(kebab);kebab.position.copy(kebabHome);kebab.rotation.set(0,0,0);kebab.visible=true;kebabState='grill';
 if(why==='caught'){addActivity('🍢 השכן: תפסתי אותך, גנב!');thought(nbB,'😏',2);milkyThought('😭',2,true)}
 if(why==='drop')addActivity('🍢 השכן: תודה, אני אקח את זה...');
 nbState='back';
}
function updateNeighbor(dt){
 const t=performance.now()*.001;nbAction+=dt;
 if(kebabState==='carried'){kebabTimer+=dt;if(kebabTimer>7){dog.remove(kebab);kebabState='eaten';kebabTimer=0;addScore(500,'קבב נגנב!');completeChallenge('kebab');dayEvent('kebab');milkyThought('😋',2,true);thought(nbB,'🤦',2.5);addActivity('🍢 השכן: טוב... בתיאבון, כלב.');nbState='back'}}
 if(kebabState==='eaten'){kebabTimer+=dt;if(kebabTimer>20){scene.add(kebab);kebab.position.copy(kebabHome);kebab.rotation.set(0,0,0);kebabState='grill'}}
 const P=neighbor,o=P.g.position;let tx=NB_HOME.x,tz=NB_HOME.z,speed=1.8,stop=.15;
 if(nbState==='chase'){tx=pos.x;tz=pos.z;speed=3.0;stop=.86;if(kebabState!=='carried')nbState='back';
  else if(Math.hypot(pos.x-o.x,pos.z-o.z)<1.08&&jumpY<.6)kebabBack('caught')}
 if(nbState==='back'&&Math.hypot(o.x-NB_HOME.x,o.z-NB_HOME.z)<.3)nbState='grill';
 const r=navStep(P.g,P.nav,NB_R,tx,tz,speed,stop,dt,[{x:pos.x,z:pos.z,r:dogRadius,skip:jumpY>=1.2}]);
 if(nbState==='chase')faceToward(P.g,pos.x,pos.z,dt,7);else if(r.step>.001&&P.nav.path[0])faceToward(P.g,P.nav.path[0][0],P.nav.path[0][1],dt,7);else faceToward(P.g,2,-33.2,dt,5);
 animatePerson(P,r.step,dt,{run:nbState==='chase',shout:nbState==='chase',arm:i=>nbState==='chase'?-1.25+Math.sin(t*12+i*3)*.4:nbState==='grill'&&r.step<.001?(i===1?-1.1+Math.sin(t*5)*.35:-.5):0});
 updateFace(neighbor.face,nbState==='chase'?'shout':nbState==='back'?(kebabState==='eaten'?'sad':'smug'):'smile',dt);
 smokeT-=dt;if(smokeT<=0){smokeT=.18;emit(2+(Math.random()-.5)*.8,1.1,-33.2+(Math.random()-.5)*.3,(Math.random()-.5)*.3,1.1,(Math.random()-.5)*.3,'smoke',1.8)}
}
