// ===== Task clarity: a progress bar for "stay here" tasks + guide targets for every day =====
let holdEl=null,holdSeen=0,holdKey='';
function holdShow(id,t,need){
 if(day.done.has(id)||!(t>0))return;
 if(!holdEl){holdEl=document.createElement('div');holdEl.id='holdBar';holdEl.innerHTML='<span></span><i><b></b></i>';document.body.appendChild(holdEl)}
 const task=DAY.flatMap(p=>p.tasks).find(x=>x.id===id);const lbl=(task?task.label:'')+' ⏳';
 if(holdKey!==lbl){holdKey=lbl;holdEl.firstChild.textContent=lbl}
 holdEl.lastChild.firstChild.style.width=Math.min(100,t/need*100).toFixed(0)+'%';holdEl.classList.add('on');holdSeen=performance.now();
}
function holdTick(){if(holdEl&&holdEl.classList.contains('on')&&performance.now()-holdSeen>250)holdEl.classList.remove('on')}
// guide targets for the later days
const _P=o=>o?V(o.x,o.y||0,o.z):null;
Object.assign(TARGETS,{
 enterPark:()=>V(0,0,-41.5),sniffAll:()=>{const d=DOGS.find(d=>!d.sniffed);return d?d.g.position:null},tag:()=>park.tagOn?null:CHUPI.g.position,drink:()=>V(FOUNT.x,0,FOUNT.z),
 tunnel:()=>V(TUN.x0-.6,0,TUN.z),hurdles:()=>{const h=HURDLES.find(h=>!h.done);return h?V(h.x-1.5,0,h.z):null},stage:()=>V(STAGE.x,1,STAGE.z),
 parkFetch:()=>park.ballHeld?dani.position:pBall.visible?pBall.position:dani.position,dig:()=>V(SAND.x,0,SAND.z),mud:()=>V(MUD.x,0,MUD.z),friend:()=>BONBON.g.position,home:()=>V(0,0,-6),
 broom:atDad,tablecloth:()=>V(DTABLE.x,.8,DTABLE.z),waitDoor:()=>V(-1.2,0,-8.1),escapeKids:()=>null,kidHug:()=>KID1.g.position,
 slipperBro:()=>slipperState==='carried'?BRO1.g.position:slipper.position,showOff:()=>BRO1.g.visible?BRO1.g.position:null,underTable:()=>V(DTABLE.x,0,DTABLE.z-1.2),tableSteal:()=>V(DTABLE.x,.8,DTABLE.z),
 begAll:()=>{for(const [k,o] of [['bro1',BRO1.g.position],['bro2',BRO2.g.position],['dad',dad.position]])if(!fam.begged.has(k))return o;return null},sleepDad:atDad,
 sadFace:atDad,balloons3:()=>{const i=[0,1,2].find(i=>hidB[i].visible);return i===undefined?null:V(HID[i].x,HID[i].y-1,HID[i].z)},spy:()=>dani.position,gift:()=>V(GIFT_YARD.x,0,GIFT_YARD.z),
 surprise:()=>V(0,0,-2),pop5:()=>{const p=popB.find(p=>!p.popped);return p?V(p.x,p.y-1.2,p.z):null},tricks:()=>null,dogFriends:()=>{const d=DOGS.find(d=>!bd.dogs.has(d.name));return d?d.g.position:null},
 candles:()=>V(cake.position.x,.9,cake.position.z),cakeFace:()=>V(cake.position.x,.9,cake.position.z),unwrap:()=>giftBox.position,groupHug:()=>bd.lit?null:V(0,0,-1)
});
window.CLARITY_READY=true;
