// Neighbours: a generic cartoon person rig
function makePerson(c){
 const g=new THREE.Group();scene.add(g);const sk=mat(c.skin);
 box(.8,1.1,.44,mat(c.shirt),0,1.6,0,g);
 if(c.belly){const b=ball(.38,mat(c.shirt),0,1.42,.12,g);b.scale.set(1.15,1,.78)}
 if(c.apron)box(.62,.95,.03,mat(c.apron),0,1.45,c.belly?.43:.24,g);
 if(c.dress)mesh(new THREE.CylinderGeometry(.42,.6,1.0,14),mat(c.dress),0,1.05,0,g);
 const head=new THREE.Group();head.position.set(0,2.45,.03);g.add(head);ball(.33,sk,0,0,0,head);
 for(const s of [-1,1])ball(.07,sk,s*.33,0,0,head);
 ball(.075,sk,0,-.04,.33,head);
 const mouthM=box(.18,.045,.03,mat(0x5a2f2a),0,-.15,.31,head);mouthM.visible=false;
 const face=makeFace(head,{eyeX:.12,eyeY:.05,eyeZ:.3,eyeR:.048,mouthY:-.16,mouthZ:.325,mouthW:.09,cheekX:.19,cheekY:-.04,cheekZ:.27});
 if(c.hair)c.hair(head);
 const arms=[],legs=[];
 for(const s of [-1,1]){
  const sh=new THREE.Group();sh.position.set(s*.5,2.0,0);g.add(sh);box(.2,.72,.22,c.bareArms?sk:mat(c.shirt),0,-.33,0,sh);ball(.1,sk,0,-.74,0,sh);arms.push(sh);
  const hip=new THREE.Group();hip.position.set(s*.2,1.05,0);g.add(hip);
  if(c.shorts){box(.26,.42,.3,mat(c.shorts),0,-.18,0,hip);box(.17,.46,.19,sk,0,-.6,0,hip)}else box(.24,.84,.28,mat(c.pants),0,-.4,0,hip);
  box(.26,.1,.42,mat(c.shoes||0x2a2a2a),0,-.89,.08,hip);legs.push(hip);
 }
 return {g,head,arms,legs,face,mouth:mouthM,walk:0,nav:{path:[],repath:0,tx:0,tz:0,stuck:0,giveUp:0}};
}
const NB_HOME=new THREE.Vector3(2,0,-34.4),NB_R=.4;
const neighbor=makePerson({skin:0xbf8358,shirt:0xf1efe8,bareArms:true,belly:true,apron:0xb33a2e,shorts:0x3e5f8a,shoes:0x2c6e8f,
 hair:h=>{for(let i=0;i<7;i++){const a=Math.PI*.08+i*Math.PI*.14;ball(.1,mat(0x3b3b3b),Math.cos(a)*.31,-.02,-Math.sin(a)*.27-.04,h)}box(.28,.07,.05,mat(0x3a2a20),0,-.09,.335,h)}});
neighbor.g.position.copy(NB_HOME);box(.04,.04,.45,mat(0x999999),0,-.8,.2,neighbor.arms[1]);
const LADY_POS=new THREE.Vector3(-14,0,-29.6),LADY_R=.36;
const lady=makePerson({skin:0xe2b48c,shirt:0x6aa86b,dress:0x6aa86b,pants:0xe2b48c,shoes:0xf0e6d0,
 hair:h=>{cyl(.52,.03,mat(0xe8cf8a),0,.2,0,h);const d=ball(.3,mat(0xe8cf8a),0,.22,0,h);d.scale.set(1,.55,1);cyl(.31,.06,mat(0xd8573d),0,.25,0,h)}});
lady.g.position.copy(LADY_POS);
{const can=new THREE.Group();can.position.set(0,-.78,.15);lady.arms[0].add(can);cyl(.13,.24,mat(0x3f9d6a),0,0,0,can);const sp=cyl(.025,.35,mat(0x3f9d6a),0,.05,.2,can);sp.rotation.x=1.1}
