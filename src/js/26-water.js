// ===== Pool, water, shaking off =====
let wet=0,shakeT=0,inPool=false,poolCool=0;
function updateWater(dt){
 const was=inPool;inPool=jumpY<.3&&!rag.active&&(Math.hypot(pos.x-poolC.x,pos.z-poolC.z)<poolC.r-.15||(window.TOWN_READY&&townWater(pos.x,pos.z)));
 poolCool=Math.max(0,poolCool-dt);
 if(inPool){wet=1;MUDDY=false;if(lastDogSpeed>.5&&Math.random()<.6)emit(pos.x+(Math.random()-.5)*.6,.25,pos.z+(Math.random()-.5)*.6,(Math.random()-.5)*2,2+Math.random()*2,(Math.random()-.5)*2,'water',.7);
  if(!was){dayEvent('wet');SFX.splash();if(poolCool===0){addScore(100,'מקלחת חינם');poolCool=15}milkyThought('💦',1.5,true)}}
 if(!inPool&&wet>0&&shakeT<=0&&grounded&&lastDogSpeed<1){shakeT=1.2;milkyThought('🫧',1.2,true);if(window.BATH_READY)bathShake();if(window.PS_READY)salonShake()}
 if(shakeT>0){shakeT-=dt;for(let i=0;i<3;i++){const a=Math.random()*Math.PI*2;emit(pos.x+Math.cos(a)*.3,1.2,pos.z+Math.sin(a)*.3,Math.cos(a)*3,1.5,Math.sin(a)*3,'water',.6)}if(shakeT<=0){wet=0;if(window.BATH_READY)bathShakeEnd()}}
 fur.color.setHex(MUDDY?0x9c7b58:wet>0?0xd9d4ca:0xf4f0e8);
}
