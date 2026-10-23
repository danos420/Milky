// ===== Performance: fewer draw calls + graphics quality that adapts to the device =====
const KEEP=new Set([...dadFace.parts,...daniFace.parts,...neighbor.face.parts,...lady.face.parts,tongue,mouth,nose,...eyes.flatMap(e=>[e.white,e.pupil]),dadMouth,daniMouth,...dadBrows,...daniBrows,dadSnack,neighbor.mouth,lady.mouth,trampMat,snack,wrapper,fridgeLight,tvGlow,glass,...garbage,...debris.map(d=>d.m),...parts.map(p=>p.m)]);
const LIVE_MATS=[dividerMat,balconyMat,frameMat,fur];
const matKey=(M,cast)=>LIVE_MATS.includes(M)?M.uuid+cast:[M.type,M.color&&M.color.getHex(),M.roughness,M.metalness,M.transparent,M.opacity,M.emissive&&M.emissive.getHex(),M.side,cast].join('|');
function mergeInto(parent,list,useWorld){
 const geos=list.map(m=>{const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();g.applyMatrix4(useWorld?m.matrixWorld:m.matrix);return g});
 const n=geos.reduce((a,g)=>a+g.attributes.position.count,0),Pp=new Float32Array(n*3),Nn=new Float32Array(n*3);let o=0;
 for(const g of geos){Pp.set(g.attributes.position.array,o);Nn.set(g.attributes.normal.array,o);o+=g.attributes.position.array.length;g.dispose()}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(Pp,3));geo.setAttribute('normal',new THREE.BufferAttribute(Nn,3));geo.computeBoundingSphere();
 const merged=new THREE.Mesh(geo,list[0].material);merged.castShadow=list[0].castShadow;merged.receiveShadow=true;parent.add(merged);
 for(const m of list)parent.remove(m);
 return merged;
}
