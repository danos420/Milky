// The cat that lives on the fence
const cat=new THREE.Group();scene.add(cat);
{const cf=mat(0xd98a3a),cd=mat(0xa8612a);const b=ball(1,cf,0,.32,0,cat);b.scale.set(.17,.16,.34);const h=ball(.15,cf,0,.5,.3,cat);
 for(const s of [-1,1]){const e=mesh(new THREE.ConeGeometry(.06,.12,4),cf,s*.08,.66,.3,cat);ball(.025,mat(0x2a6b2a),s*.06,.53,.43,cat)}
 for(let i=0;i<3;i++)box(.3,.02,.06,cd,0,.47,-.15+i*.12,cat);
 for(const [x,z] of [[-.08,.2],[.08,.2],[-.08,-.2],[.08,-.2]])cyl(.035,.3,cf,x,.15,z,cat);
 const tl=cyl(.035,.45,cf,0,.55,-.42,cat);tl.rotation.x=-.5}
const PERCHES=[[-8,2.1,-39.95],[4,2.1,-39.95],[12,2.1,-39.95],[19.95,2.1,-31],[-19.95,2.1,-22],[16.5,2.64,-26],[-19.95,2.1,-34]];
cat.position.set(...PERCHES[1]);
