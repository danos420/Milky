// ===== Thought bubbles: a single emoji above a character's head =====
const bubbles=[];
function makeBubble(obj,h){const el=document.createElement('div');el.className='thought';el.setAttribute('aria-hidden','true');document.body.appendChild(el);const b={obj,h,el,t:0,cool:0,cur:''};bubbles.push(b);return b}
function thought(b,emoji,dur=1.8,force){
 if(!b||!emoji)return;
 if(!force&&(b.cool>0||(b.t>0&&b.cur===emoji)))return;
 b.text=false;b.el.className='thought';b.cur=emoji;b.el.innerHTML='<span>'+emoji+'</span>';b.t=dur;b.cool=dur+1.4;
 b.el.classList.remove('pop');void b.el.offsetWidth;b.el.classList.add('pop');
}
// Text bubbles: 'say' = speech balloon, 'think' = thought cloud
function sayText(b,text,dur,kind='say',force){
 if(!b||!text)return;if(!force&&b.cool>0&&b.text)return;
 if(text.length>48)text=text.slice(0,46)+'…';
 b.text=true;b.cur=text;b.el.className='thought '+kind;const sp=document.createElement('span');sp.textContent=text;b.el.replaceChildren(sp);
 b.t=dur||Math.min(4,1.6+text.length*.05);b.cool=b.t+.9;void b.el.offsetWidth;b.el.classList.add('pop');
}
function tickBubbles(dt){for(const b of bubbles){b.t=Math.max(0,b.t-dt);b.cool=Math.max(0,b.cool-dt)}}
const _bv=new THREE.Vector3();
function placeBubbles(){
 camera.updateMatrixWorld();
 for(const b of bubbles){
  if(b.t<=0||!started){if(b.vis!==false){b.el.style.opacity=0;b.vis=false}continue}
  b.obj.getWorldPosition(_bv);_bv.y+=b.h;_bv.project(camera);
  if(_bv.z>1||Math.abs(_bv.x)>1.1||Math.abs(_bv.y)>1.1){if(b.vis!==false){b.el.style.opacity=0;b.vis=false}continue}
  if(b.vis!==true){b.el.style.opacity=1;b.vis=true}b.el.style.transform='translate('+((_bv.x*.5+.5)*innerWidth).toFixed(1)+'px,'+((-_bv.y*.5+.5)*innerHeight).toFixed(1)+'px) translate(-50%,-100%)';
 }
}
function resetBubbles(){for(const b of bubbles){b.t=0;b.cool=0;b.cur=''}}
