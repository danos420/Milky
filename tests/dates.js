// Plays all 10 dates of "Milky the human: dates" with a bot: walks to each spot, picks answers, hits the timing game,
// stands still, chases the squirrel. Checks every date reaches its result card with stars, and no page errors.
const {open}=require('./lib');
const D='/tmp/claude-0/-home-claude/32d0740e-fe3d-513e-be5d-8882671e5525/scratchpad/';
(async()=>{const {page,browser,errors}=await open(process.argv[2],{width:800,height:600},{noRaf:true});const ev=(f,a)=>page.evaluate(f,a);
const pickArg=+(process.argv[3]||0); // which answer the bot picks (0 = the good one)
await ev(()=>{document.querySelector('#overlay').style.display='none'});
const res=[];let pass=0;
for(let i=0;i<10;i++){
 await ev(i=>{for(const id of ['epEnd','epBoard'])document.getElementById(id).hidden=true;EP.cur=EP.list.dates;EP.idx=i;EP.cur.start(i)},i);
 let shot=false,out=null,lastK=-2,sameT=0;
 for(let chunk=0;chunk<60;chunk++){
  const r=await ev(pk=>{let n=0;for(;n<240;n++){
    const ch=document.getElementById('dtChoice');if(!ch.hidden){ch.querySelectorAll('button')[pk].click()}
    if(DT.mini&&DT.mini.cool<=0){const M=DT.mini,m=.5+.5*Math.sin(M.t*M.speed);if(m>M.zone[0]+.02&&m<M.zone[1]-.02)CTX_HOOKS.act[0]().fn()}
    const d=DATE_LIST[DT.i],s=DT.k>=0?d.steps[DT.k]:null;
    if(s&&s.go&&!DT.q.length&&!DT.seat){const t=s.go.at();if(Math.hypot(pos.x-t.x,pos.z-t.z)>1.2){pos.set(t.x+.25,0,t.z+.25);jumpY=0}}
    if(DT.act&&DT.act.target&&d.id==='roni'){const p=DT.act.target();pos.set(p.x+.4,0,p.z)}
    gameStep(1/60);if(!document.getElementById('epEnd').hidden)break}
   return {k:DT.k,i:DT.i,charm:DT.charm,end:!document.getElementById('epEnd').hidden,title:document.getElementById('epEndTitle').textContent,stars:document.querySelectorAll('#epEndStars .on').length,stats:document.getElementById('epEndStats').textContent,ask:!document.getElementById('dtChoice').hidden}},pickArg);
  if(!shot&&r.k>=3){shot=true;await ev(()=>{renderFrame(1/60)});await page.screenshot({path:D+'date'+(i+1)+'.png'})}
  if(r.end){out=r;break}
  if(r.k===lastK){sameT+=4;if(sameT>=60){out={...r,stuck:true};break}}else{lastK=r.k;sameT=0}
 }
 const saved=await ev(i=>(save.ep.dates||{})[DATE_LIST[i].id]||0,i);
 const ok=out&&out.end&&out.stars>=1&&saved>=1;if(ok)pass++;
 res.push({date:i+1,ok,stars:out&&out.stars,charm:out&&out.charm,title:out&&out.title,stuck:out&&out.stuck,k:out&&out.k,stats:out&&out.stats&&out.stats.slice(0,70)});
 console.log(JSON.stringify(res[res.length-1]));
}
const fin=await ev(()=>({stars:epStars('dates'),done:epComplete('dates'),human:HUMAN,dates:DATES}));
console.log(JSON.stringify(fin));
console.log((pass===10?'PASS':'FAIL')+' dates '+pass+'/10');console.log(errors.length?errors:'no page errors');await browser.close()})();
