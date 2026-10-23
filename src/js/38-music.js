// --- music: a small step sequencer, one tune per time of day, a chase tune, and a lullaby at night ---
const _=null;
const SONGS={
 morning:{bpm:100,swing:.1,chords:[[60,64,67],[57,60,64],[53,57,60],[55,59,62]],chordSteps:[0,6,10],inst:'marimba',
  bass:[0,_,_,_,_,_,_,_,0,_,_,_,7,_,_,_],
  mel:[[72,_,_,74,76,_,79,_,76,_,74,_,72,_,_,_],[69,_,72,_,76,_,_,74,72,_,69,_,_,_,_,_],[65,_,69,_,72,_,74,_,77,_,76,_,74,_,72,_],[74,_,_,71,67,_,71,_,74,_,_,_,79,_,_,_]],lead:'whistle',
  kick:[0,8],snare:[12],hat:[2,6,10,14]},
 noon:{bpm:116,swing:.06,chords:[[53,57,60],[58,62,65],[60,64,67],[53,57,60]],chordSteps:[2,6,10,14],inst:'pluck',
  bass:[0,_,_,12,_,_,7,_,0,_,10,_,_,_,7,_],
  mel:[[77,_,77,_,79,_,77,_,74,_,72,_,_,_,_,_],[74,_,74,_,77,_,74,_,70,_,_,_,_,_,_,_],[72,_,72,_,76,_,79,_,84,_,_,79,76,_,_,_],[77,_,_,_,72,_,69,_,65,_,_,_,_,_,_,_]],lead:'pluck',
  kick:[0,6,8,11],snare:[4,12],hat:[0,2,4,6,8,10,12,14]},
 evening:{bpm:88,swing:.2,chords:[[50,53,57,60],[55,59,62,65],[50,53,57,60],[57,60,64,67]],chordSteps:[0],pad:true,inst:'pad',arp:true,
  bass:[0,_,_,_,_,_,_,_,_,_,0,_,_,_,_,_],
  mel:[[69,_,_,_,72,_,_,69,67,_,_,_,_,_,_,_],[71,_,_,_,74,_,_,71,69,_,67,_,_,_,_,_],[69,_,_,72,_,_,74,_,76,_,_,74,72,_,_,_],[69,_,_,_,67,_,64,_,62,_,_,_,_,_,_,_]],lead:'whistle',
  kick:[0,7,10],snare:[4,12],hat:[2,6,10,14]},
 night:{bpm:70,swing:0,chords:[[53,57,60,64],[52,55,59,62]],chordSteps:[0],pad:true,inst:'pad',
  bass:[0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  mel:[[84,_,_,_,81,_,_,_,79,_,_,_,_,_,_,_],[83,_,_,_,79,_,_,_,76,_,_,_,_,_,_,_]],lead:'musicbox',kick:[],snare:[],hat:[]},
 chase:{bpm:148,swing:0,chords:[[57,60,64],[52,56,59],[57,60,64],[53,57,60]],chordSteps:[0,3,6],inst:'stab',
  bass:[0,_,0,_,0,_,0,_,0,_,0,_,0,_,7,_],
  mel:[[76,_,75,_,76,_,_,_,72,_,71,_,72,_,_,_],[71,_,70,_,71,_,_,_,68,_,_,_,64,_,_,_],[76,_,75,_,76,_,79,_,81,_,_,_,79,_,76,_],[77,_,_,76,_,_,74,_,72,_,71,_,69,_,_,_]],lead:'pluck',
  kick:[0,4,8,12],snare:[4,12],hat:[0,2,4,6,8,10,12,14]},
};
const MUS={step:0,next:0,song:'morning',bar:0,loop:0};
function wantedSong(){
 if(typeof day==='undefined')return 'morning';
 if(day.finished)return 'night';
 if(slipperState==='carried'&&(dadState==='chase'||dadState==='search')||kebabState==='carried'&&nbState==='chase')return 'chase';
 return ['morning','noon','evening'][Math.min(day.phase,2)];
}
function playStep(S,st,bar,t,sd){
 const M=AU.music,root=S.chords[bar%S.chords.length][0];
 if(S.chordSteps.includes(st)){const ch=S.chords[bar%S.chords.length];
  for(const m of ch){
   if(S.inst==='marimba'){tone(M,mtof(m+12),t,.4,{vol:.06,a:.008})}
   else if(S.inst==='pluck')tone(M,mtof(m+12),t,.16,{type:'triangle',vol:.05})
   else if(S.inst==='stab')tone(M,mtof(m+12),t,.09,{type:'square',vol:.03,lp:1800})
   else if(S.inst==='pad'&&st===0)tone(M,mtof(m),t,sd*16,{type:'triangle',vol:.035,a:.4,lp:900})}}
 if(S.arp&&st%2===0){const ch=S.chords[bar%S.chords.length];tone(M,mtof(ch[(st/2)%ch.length]+24),t,.22,{vol:.025})}
 const b=S.bass[st];if(b!==null&&b!==undefined)tone(M,mtof(root-12+b),t,sd*1.8,{type:'triangle',vol:.16,lp:700});
 const mel=S.mel[bar%S.mel.length][st];
 if(mel&&!(MUS.loop%3===2&&bar%2===1)){ // leave some breathing room every third time round
  if(S.lead==='whistle')tone(M,mtof(mel),t,sd*2.2,{type:'sine',vol:.075,a:.02,vib:.012});
  else if(S.lead==='musicbox'){tone(M,mtof(mel),t,1.2,{vol:.05});tone(M,mtof(mel+12),t,.5,{vol:.012})}
  else tone(M,mtof(mel),t,sd*1.2,{type:'square',vol:.035,lp:2200});
 }
 if(S.kick.includes(st))tone(M,80,t,.24,{vol:.2,a:.018,f2:42});
 if(S.snare.includes(st))noiseHit(M,t,.14,{type:'lowpass',f:1400,q:.7,vol:.07});
}
function musicTick(){
 if(!AU||!started||soundMode!=='all'||document.hidden)return;
 const c=AU.c;if(c.state!=='running')return;
 if(MUS.next<c.currentTime)MUS.next=c.currentTime+.05;
 while(MUS.next<c.currentTime+.15){
  if(MUS.step===0){const w=wantedSong();if(w!==MUS.song){MUS.song=w;MUS.bar=0;MUS.loop=0}}
  const S=SONGS[MUS.song],sd=60/S.bpm/4,st=MUS.step,t=MUS.next+(st%2?S.swing*sd:0);
  try{playStep(S,st,MUS.bar,t,sd)}catch(_){}
  MUS.next+=sd;MUS.step=(st+1)%16;if(MUS.step===0){MUS.bar++;if(MUS.bar%S.mel.length===0)MUS.loop++}
 }
}
setInterval(musicTick,40);
const voiceBusy={};
function voiceFor(text){
 if(!started)return;
 const map=[['👨 אבא: ',()=>dadB],['🧢 דני: ',()=>daniB],['🍢 השכן: ',()=>nbB],['🌸 השכנה: ',()=>ladyB]];
 for(const [p,b] of map)if(text.startsWith(p)){sayText(b(),text.slice(p.length),undefined,'say',true);return}
}
document.getElementById('soundBtn').addEventListener('click',()=>{const o=['all','sfx','off'];soundMode=o[(o.indexOf(soundMode)+1)%3];try{localStorage.setItem(SKEY,soundMode)}catch(_){}initAudio();applySoundMode();if(AU&&AU.c.state==='suspended')AU.c.resume().catch(()=>{})});
applySoundMode();

const hint=document.querySelector('#contextHint');
