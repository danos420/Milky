// Walks Milky and drives the kart through every zone of the neighbourhood, by waypoints.
// Reports stuck spots, falls, frame cost per zone (step + render), draw calls and page errors.
const {open}=require('./lib');
const W=[[13,50],[13,82],[3,82],[-20,82],[-22,100],[-20,70],[3,82],[13,82],[17,90],[24,90],[40,100],[50,72],[70,72],[84,110],[70,72],[50,72],[38,124],[13,124],[-8,130],[13,124],[13,160],[13,180],[40,200],[60,212],[-40,205],[13,178],[13,124],[13,50],[13,36]];
const D=[[13,60],[13,116],[30,130],[20,122],[-8,124],[13,122],[13,145],[13,168],[13,182],[50,195],[-40,195],[-20,188],[13,180],[13,150],[13,122],[13,60]];
(async()=>{const {page,browser,errors}=await open(process.argv[2],{width:800,height:600},{noRaf:true});const ev=(f,a)=>page.evaluate(f,a);
await ev(()=>{document.getElementById('startOpen').click();document.querySelector('#overlay').style.display='none';pos.set(13,0,36);for(let k=0;k<3;k++)gameStep(1/60);
 window.TT={zones:{},stuck:[],falls:0,maxStep:0,calls:{}};
 window.TT.rec=(z,st,rt)=>{const Z=TT.zones[z]||(TT.zones[z]={n:0,st:0,rn:0,rt:0,max:0});Z.n++;Z.st+=st;if(rt>=0){Z.rn++;Z.rt+=rt;Z.max=Math.max(Z.max,rt+st);TT.calls[z]=Math.max(TT.calls[z]||0,renderer.info.render.calls);if(rt>150)(TT.spikes=TT.spikes||[]).push([z,+rt.toFixed(0),+pos.x.toFixed(0),+pos.z.toFixed(0),DRIVE.on,renderer.info.programs.length])}};
 window.TT.leg=(wx,wz,drive)=>{let best=1e9,still=0,k=0;const tgt=()=>drive?DRIVE.K:pos;
  for(;k<60*70;k++){const p=tgt(),d=Math.hypot(wx-p.x,wz-p.z);if(d<(drive?3:1.2))return {ok:true,t:k/60};
   if(drive){const h=Math.atan2(wx-p.x,wz-p.z);let e=h-DRIVE.K.h;e=Math.atan2(Math.sin(e),Math.cos(e));stick.active=true;stick.mag=1;stick.x=THREE.MathUtils.clamp(-e*2,-1,1);stick.y=d<10?.4:1}
   else{const h=Math.atan2(wx-p.x,wz-p.z),a=h-camYaw;stick.active=true;stick.x=-Math.sin(a);stick.y=Math.cos(a);stick.mag=1}
   let t0=performance.now();gameStep(1/60);const st=performance.now()-t0;let rt=-1;if(k%30===0){renderer.info.reset&&renderer.info.reset();t0=performance.now();renderFrame&&renderFrame(1/60);rt=performance.now()-t0}
   TT.rec(zoneAt(p.x,p.z),st,rt);TT.maxStep=Math.max(TT.maxStep,st);if(!drive&&(pos.y<-1||!isFinite(pos.x)))TT.falls++;
   if(d<best-.3){best=d;still=0}else if(++still>240){stick.active=false;return {ok:false,at:[+p.x.toFixed(1),+p.z.toFixed(1)],t:k/60}}}
  stick.active=false;return {ok:false,at:'timeout'}};});
const out={walk:[],drive:[]};
for(const [x,z] of W){const r=await ev(([x,z])=>{const r=TT.leg(x,z,false);if(!r.ok){TT.stuck.push({to:[x,z],at:r.at});pos.set(x,0,z)}return r},[x,z]);out.walk.push([x,z,r.ok?r.t.toFixed(0)+"s":"STUCK@"+JSON.stringify(r.at)]);console.log("walk",x,z,JSON.stringify(r))}
await ev(()=>{pos.set(13,0,58);yaw=0;camYaw=0;gameStep(1/60);carChip.click()});
out.driveOn=await ev(()=>DRIVE.on);
for(const [x,z] of D){const r=await ev(([x,z])=>{const r=TT.leg(x,z,true);if(!r.ok){TT.stuck.push({drive:1,to:[x,z],at:r.at});DRIVE.K.x=x;DRIVE.K.z=z;DRIVE.K.v=0}return r},[x,z]);out.drive.push(0);console.log("drive",x,z,JSON.stringify(r))}
out.tt=await ev(()=>{const o={};for(const [k,Z] of Object.entries(TT.zones))o[k]={frames:Z.n,step:+(Z.st/Z.n).toFixed(2),render:+(Z.rt/Math.max(1,Z.rn)).toFixed(1),worst:+Z.max.toFixed(1),calls:TT.calls[k]};return {zones:o,spikes:TT.spikes,stuck:TT.stuck,falls:TT.falls,maxStep:+TT.maxStep.toFixed(1)}});
console.log(JSON.stringify(out.tt));const bad=out.tt.stuck.length+out.tt.falls;console.log(bad?'TOUR FAIL '+bad:'TOUR OK');console.log('errors',errors);await browser.close()})();
