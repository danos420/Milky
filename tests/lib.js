const { chromium } = require('playwright');
const fs=require('fs'),path=require('path');
const THREE_SRC=fs.readFileSync(path.join(__dirname,'../assets/vendor/three.min.js'));
async function open(file, vp, opts={}){
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium', args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']}).catch(()=>chromium.launch());
  const ctx=await browser.newContext({viewport:vp, deviceScaleFactor:1, hasTouch:!!opts.touch, isMobile:!!opts.touch});
  const page=await ctx.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push('pageerror: '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text())});
  if(opts.noRaf)await page.addInitScript(()=>{window.requestAnimationFrame=()=>0});
  await page.route(/three(\.min)?\.js/,r=>r.fulfill({body:THREE_SRC,contentType:'application/javascript'}));
  await page.goto('file://'+path.resolve(file));
  await page.waitForTimeout(800);
  // the old mode buttons are hidden behind the universe menu; click them programmatically
  const _click=page.click.bind(page);page.click=(sel,o)=>/^#start/.test(sel)?page.evaluate(s=>document.querySelector(s).click(),sel):_click(sel,o);
  return {browser,page,errors};
}
module.exports={open};
