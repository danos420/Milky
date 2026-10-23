// ===== Expressive cartoon faces for the people: eyes that blink and squint, brows, smile / frown / open mouth, blush =====
const faceEyeM=mat(0x17110d,.4),faceMouthM=mat(0x5a2420,.7),faceBlushM=mat(0xff8f9e,.9),faceBrowM=mat(0x2a1d16);
function makeFace(parent,p,brows){
 const F={eyes:[],brows:brows||[],blinkT:1+Math.random()*3,blinkUntil:0,mood:'neutral'};
 for(const s of [-1,1]){const e=ball(p.eyeR,faceEyeM,s*p.eyeX,p.eyeY,p.eyeZ,parent);e.scale.set(1,1.2,.6);F.eyes.push(e)}
 if(!brows)for(const s of [-1,1])F.brows.push(box(p.eyeR*2.8,p.eyeR*.55,p.eyeR*.6,faceBrowM,s*p.eyeX,p.eyeY+p.eyeR*2.1,p.eyeZ+.01,parent));
 const w=p.mouthW;
 F.smile=mesh(new THREE.TorusGeometry(w,w*.22,6,14,Math.PI),faceMouthM,0,p.mouthY+w*.5,p.mouthZ,parent);F.smile.rotation.z=Math.PI;
 F.frown=mesh(new THREE.TorusGeometry(w*.85,w*.22,6,14,Math.PI),faceMouthM,0,p.mouthY-w*.6,p.mouthZ,parent);
 F.open=ball(w*.9,faceMouthM,0,p.mouthY,p.mouthZ-.01,parent);F.open.scale.set(1.1,.85,.45);
 F.blush=[-1,1].map(s=>{const m=ball(p.eyeR*1.3,faceBlushM,s*p.cheekX,p.cheekY,p.cheekZ,parent);m.scale.set(1,.55,.35);return m});
 F.parts=[...F.eyes,F.smile,F.frown,F.open,...F.blush,...(brows?[]:F.brows)];
 for(const b of F.brows)b.userData.y0=b.position.y;
 return F;
}
const FACE={neutral:{},smile:{eye:.85,smile:1},laugh:{eye:.12,open:1,browY:.5,shake:1},angry:{eye:.7,brow:-.45,browY:-.5,frown:1},
 shout:{eye:1.15,brow:-.55,browY:-.4,open:1.1,shake:1},shock:{eye:1.4,size:1.3,browY:.9,open:.75},sad:{eye:.65,brow:.45,browY:.3,frown:1},
 love:{eye:.12,smile:1,blush:1,browY:.4},sleep:{eye:.06,open:.35,browY:-.1},smug:{eye:.5,brow:-.15,smile:1},confused:{eye:1.05,brow:.35,asym:1,open:.35},focus:{eye:.75,brow:-.25,browY:-.2}};
function updateFace(F,mood,dt){
 const t=performance.now()*.001,M=Object.assign({eye:1,size:1,brow:0,browY:0,smile:0,frown:0,open:0,blush:0,asym:0,shake:0},FACE[mood]);
 F.blinkT-=dt;if(F.blinkT<0){F.blinkT=2.5+Math.random()*3.5;F.blinkUntil=t+.12}
 const blink=t<F.blinkUntil?.1:1,k=Math.min(1,dt*14);
 for(const e of F.eyes){e.scale.y+=(1.2*M.eye*blink*M.size-e.scale.y)*k;e.scale.x+=(M.size-e.scale.x)*k}
 F.brows.forEach((b,i)=>{const s=i?1:-1,up=M.browY+(M.asym&&i?.9:0);b.rotation.z+=(M.brow*s*(M.asym&&i?-1:1)-b.rotation.z)*k;b.position.y+=(b.userData.y0+up*.045-b.position.y)*k});
 F.smile.visible=M.smile>.5;F.frown.visible=M.frown>.5;F.open.visible=M.open>.05;
 if(F.open.visible)F.open.scale.y=.85*M.open*(1+(M.shake?.18*Math.sin(t*16):0));
 for(const b of F.blush)b.visible=M.blush>.5;
}
