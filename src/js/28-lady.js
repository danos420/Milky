// ===== The neighbour lady and her flowers =====
let ladyState='water',ladyT=0,ladyCool=0;
function updateLady(dt){
 const t=performance.now()*.001;ladyT+=dt;ladyCool=Math.max(0,ladyCool-dt);
 const o=lady.g.position,d=Math.hypot(pos.x-o.x,pos.z-o.z);
 const inBed=Math.abs(pos.x-bedC.x)<2.6&&Math.abs(pos.z-bedC.z)<1.0&&jumpY<.5;
 if(ladyState==='water'){faceToward(lady.g,bedC.x,bedC.z-1,dt,4);
  if(Math.random()<dt*10)emit(o.x-.1+Math.sin(lady.g.rotation.y)*.9,1.05,o.z+Math.cos(lady.g.rotation.y)*.9,Math.sin(lady.g.rotation.y)*.8,.3,Math.cos(lady.g.rotation.y)*.8,'water',.6);
  if(ladyCool===0&&(inBed||d<2.6&&lastDogSpeed>4&&jumpY<.5)){ladyState='spray';ladyT=0;ladyCool=12;addActivity('🌸 השכנה: לא בפרחים שלי!!!');thought(ladyB,'😤',2)}}
 if(ladyState==='spray'){faceToward(lady.g,pos.x,pos.z,dt,8);
  for(let i=0;i<3;i++)emit(o.x+Math.sin(lady.g.rotation.y)*.8,1.2,o.z+Math.cos(lady.g.rotation.y)*.8,(pos.x-o.x)*1.4+(Math.random()-.5),2.2+Math.random(),(pos.z-o.z)*1.4+(Math.random()-.5),'water',.7);
  if(d<4.5&&wet===0){wet=1;dayEvent('wet');addScore(150,'מקלחת מהשכנה');milkyThought('💦',1.6,true)}
  if(ladyT>2.2){ladyState='water';addActivity('🌸 השכנה: ככה! עכשיו אתה נקי.')}}
 updateFace(lady.face,ladyState==='spray'?'angry':'smile',dt);
 animatePerson(lady,0,dt,{shout:ladyState==='spray',arm:i=>i===0?(ladyState==='spray'?-1.55+Math.sin(t*10)*.1:-1.0):-.15});
}
