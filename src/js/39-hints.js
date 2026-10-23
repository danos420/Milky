function setHint(t){if(hint.textContent!==t)hint.textContent=t}
function updateContextHint(){
 if(trickTimer>0)return;if(hint.classList.contains('trick'))hint.classList.remove('trick');
 if(kebabState==='carried'){return setHint('🍢 תחזיק מעמד! עוד '+Math.max(0,7-kebabTimer).toFixed(0)+' שנ׳')}
 if(grab){return setHint('👅 T לזרוק · רוץ כדי לגרור')}
 if(nearMangal()){return setHint('🍢 תגנוב קבב (E)')}
 if(slipperState==='carried'){return setHint('🩴 הכפכף בפה! רוץ למיטה')}
 if(slipperState==='dad'){return setHint('👨 אבא מחזיר את הכפכף למקום')}
 if(slipperState==='floor'&&Math.hypot(pos.x-slipper.position.x,pos.z-slipper.position.z)<1.45){return setHint('🩴 תפוס את הכפכף (P)')}
 if(nearSausage()){return setHint('🌭 תגנוב את הנקניקייה (E)')}
 if(nearFridge()){return setHint(fridgeOpen?'🧊 סגור את המקרר (E)':'🧊 פתח את המקרר (E)')}
 let near=null,d=1.65;
 for(const p of extras){if(!p.g.visible)continue;const q=Math.hypot(pos.x-p.g.position.x,pos.z-p.g.position.z);if(q<d){near=p;d=q}}
 const names={tp:'🧻 נייר טואלט',baguette:'🥖 בגט',can:'🥫 קופסת שימורים',receipt:'🧾 קבלה',shampoo:'🧴 שמפו של אבא',remote:'📺 לחץ על השלט',duck:'🦆 צפצף עם הברווז',bottle:'🧴 גלגל בקבוק',shoe:'👟 העף נעל',book:'📚 פזר ספרים',trash:'🗑️ הפוך את הפח',bowl:'🥣 תאכל מהקערה',chair:'🪑 הפל כיסא',cone:'🔺 בעט בקונוס',cooler:'🧊 דחוף צידנית',bin:'🗑️ הפל פח',soccer:'⚽ כדורגל'};
 return setHint(near?names[near.kind]+' · E · T לתפוס':nextTaskHint());
}
dad.position.set(4.1,0,5.7);const clock=new THREE.Clock();const look=new THREE.Vector3();let lastFrameDt=1/60;
let lastTs=0,smoothDt=1/60;
