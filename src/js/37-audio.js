// ===== Sound: one mixer (music / effects / voices), procedural music that follows the day, gibberish voices, barks =====
let audioCtx=null,AU=null;
function initAudio(){
 if(AU)return AU;
 const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
 try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(_){}
 if(!audioCtx)audioCtx=new AC();
 const c=audioCtx,master=c.createGain(),comp=c.createDynamicsCompressor();
 comp.threshold.value=-14;comp.knee.value=12;comp.ratio.value=4;comp.attack.value=.004;comp.release.value=.2;
 master.connect(comp);comp.connect(c.destination);
 const bus=g=>{const n=c.createGain();n.gain.value=g;n.connect(master);return n};
 const noise=c.createBuffer(1,c.sampleRate,c.sampleRate);{const d=noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
 AU={c,master,music:bus(.45),sfx:bus(.9),voice:bus(.8),noise};
 applySoundMode();
 return AU;
}
const SKEY='milky-bardak-sound';let soundMode='all';try{soundMode=localStorage.getItem(SKEY)||'all'}catch(_){}
function applySoundMode(){
 const b=document.getElementById('soundBtn');if(b)b.textContent=soundMode==='all'?'🔊':soundMode==='sfx'?'🔈':'🔇';
 if(!AU)return;const t=AU.c.currentTime;
 AU.master.gain.setTargetAtTime(soundMode==='off'?0:1.4,t,.05);AU.music.gain.setTargetAtTime(soundMode==='all'?.45:0,t,.2);
}
function ctxOk(){const a=initAudio();if(!a)return null;if(a.c.state==='suspended'&&a.c.resume)a.c.resume().catch(()=>{});return a}
// --- tiny synth helpers ---
function tone(dest,f,t,dur,{type='sine',vol=.2,a=.005,f2=null,lp=null,q=1,vib=0}={}){
 const c=AU.c,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(Math.max(30,f2),t+dur);
 if(vib){const l=c.createOscillator(),lg=c.createGain();l.frequency.value=5.5;lg.gain.value=f*vib;l.connect(lg);lg.connect(o.frequency);l.start(t);l.stop(t+dur+.05)}
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+a);g.gain.exponentialRampToValueAtTime(.0008,t+dur);
 let n=o;if(lp){const fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.value=lp;fl.Q.value=q;o.connect(fl);n=fl}
 n.connect(g);g.connect(dest);o.start(t);o.stop(t+dur+.02);
}
function noiseHit(dest,t,dur,{type='bandpass',f=1500,q=1,vol=.2,f2=null}={}){
 const c=AU.c,s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();s.buffer=AU.noise;fl.type=type;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+dur);fl.Q.value=q;
 g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0008,t+dur);s.connect(fl);fl.connect(g);g.connect(dest);s.start(t,Math.random()*.5);s.stop(t+dur+.02);
}
const mtof=m=>440*Math.pow(2,(m-69)/12);
// Old call sites keep working: short toy blips go to the effects bus.
function playToySound(frequency,duration,type){const a=ctxOk();if(!a)return;try{tone(a.sfx,frequency,a.c.currentTime,duration,{type:type||'sine',vol:.09,f2:Math.max(80,frequency*.72)})}catch(e){}}
// --- effects ---
const SFX={
 bark(vol=1,pitch=1,times=2){think(times>2?'cat':'bark',1.6,true,'say');return;const a=ctxOk();if(!a)return;let t=a.c.currentTime;for(let i=0;i<times;i++){const p=pitch*(1+(Math.random()-.5)*.08);
  tone(a.sfx,520*p,t,.16,{type:'sawtooth',vol:.32*vol,f2:230*p,lp:1300,q:2});noiseHit(a.sfx,t,.06,{f:1800,q:1.2,vol:.18*vol});t+=.2+Math.random()*.05}},
 whimper(){return;const a=ctxOk();if(!a)return;const t=a.c.currentTime;tone(a.sfx,950,t,.28,{type:'sine',vol:.1,f2:640,vib:.02});tone(a.sfx,900,t+.32,.3,{type:'sine',vol:.09,f2:560,vib:.02})},
 step(run,soft){const a=ctxOk();if(!a)return;noiseHit(a.sfx,a.c.currentTime,run?.06:.045,{type:'lowpass',f:soft?380:700,q:.5,vol:(run?.05:.032)*(soft?1.2:1)})},
 jump(){const a=ctxOk();if(!a)return;noiseHit(a.sfx,a.c.currentTime,.18,{f:600,f2:2400,q:1.5,vol:.08})},
 land(k){const a=ctxOk();if(!a)return;const t=a.c.currentTime;tone(a.sfx,120,t,.12,{vol:.25*k,f2:55});noiseHit(a.sfx,t,.08,{type:'lowpass',f:700,vol:.12*k})},
 boing(){const a=ctxOk();if(!a)return;const t=a.c.currentTime;const o=a.c.createOscillator(),g=a.c.createGain();o.type='sine';o.frequency.setValueAtTime(160,t);o.frequency.exponentialRampToValueAtTime(620,t+.12);o.frequency.exponentialRampToValueAtTime(300,t+.38);
  const l=a.c.createOscillator(),lg=a.c.createGain();l.frequency.value=22;lg.gain.value=40;l.connect(lg);lg.connect(o.frequency);g.gain.setValueAtTime(.22,t);g.gain.exponentialRampToValueAtTime(.001,t+.45);o.connect(g);g.connect(a.sfx);o.start(t);l.start(t);o.stop(t+.5);l.stop(t+.5)},
 whoosh(){const a=ctxOk();if(!a)return;noiseHit(a.sfx,a.c.currentTime,.35,{f:400,f2:3000,q:2,vol:.12})},
 splash(){const a=ctxOk();if(!a)return;const t=a.c.currentTime;noiseHit(a.sfx,t,.45,{type:'lowpass',f:2500,f2:500,vol:.22});for(let i=0;i<5;i++)tone(a.sfx,600+Math.random()*900,t+Math.random()*.25,.06,{vol:.05,f2:1400})},
 crash(){const a=ctxOk();if(!a)return;const t=a.c.currentTime;noiseHit(a.sfx,t,.35,{f:900,q:.6,vol:.25});tone(a.sfx,90,t,.25,{vol:.2,f2:40})},
 slurp(){const a=ctxOk();if(!a)return;noiseHit(a.sfx,a.c.currentTime,.22,{f:600,f2:2200,q:4,vol:.14})},
 fanfare(big){const a=ctxOk();if(!a)return;const t=a.c.currentTime;(big?[60,64,67,72,76,79,84]:[67,72,76]).forEach((m,i)=>tone(a.sfx,mtof(m+12),t+i*.09,.35,{type:'square',vol:.07,lp:3000}))},
 slide(){const a=ctxOk();if(!a)return;tone(a.sfx,1300,a.c.currentTime,.7,{type:'sine',vol:.12,f2:300,vib:.015})},
};
// --- voices: Sims-style gibberish with vowel formants, each character with his own pitch ---
const VOICES={dad:{base:112,type:'sawtooth',rate:.088},dani:{base:160,type:'sawtooth',rate:.07},neighbor:{base:92,type:'sawtooth',rate:.095},lady:{base:250,type:'triangle',rate:.078}};
const VOWELS=[[730,1090],[530,1840],[300,2200],[570,840],[350,900]];
function babble(who,text,vol=1){
 const a=ctxOk();if(!a)return;const V=VOICES[who];if(!V)return;
 const n=Math.max(3,Math.min(12,Math.round(text.replace(/[^\p{L}]/gu,'').length/2.6))),ex=/!/.test(text),qu=/\?/.test(text);
 let t=a.c.currentTime+.02;
 for(let i=0;i<n;i++){
  const d=V.rate*(.75+Math.random()*.5),k=i/(n-1||1);
  let p=V.base*(ex?1.22:1)*(1+(Math.random()-.5)*.12);p*=qu?1+.35*Math.max(0,k-.6)*2:1-.18*k;
  const o=a.c.createOscillator(),g=a.c.createGain(),[f1,f2]=VOWELS[(Math.random()*5)|0];o.type=V.type;o.frequency.setValueAtTime(p,t);o.frequency.linearRampToValueAtTime(p*(.92+Math.random()*.16),t+d);
  const b1=a.c.createBiquadFilter(),b2=a.c.createBiquadFilter();b1.type=b2.type='bandpass';b1.frequency.value=f1*(who==='lady'?1.15:1);b2.frequency.value=f2*(who==='lady'?1.15:1);b1.Q.value=b2.Q.value=5;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.55*vol,t+.012);g.gain.setValueAtTime(.55*vol,t+d*.7);g.gain.linearRampToValueAtTime(0,t+d);
  o.connect(b1);o.connect(b2);b1.connect(g);b2.connect(g);g.connect(a.voice);o.start(t);o.stop(t+d+.02);
  t+=d+(Math.random()<.18?.06:.012);
 }
}
function speakerVolume(obj){if(!obj)return 1;const d=Math.hypot(obj.position.x-pos.x,obj.position.z-pos.z);return Math.max(.12,Math.min(1,1.25-d/16))}
