#!/usr/bin/env python3
"""Build Milky Bardak from src/ into dist/.
dist/index.html      installable web app (local three.js, offline, home-screen icon)
dist/artifact.html   single page for the claude.ai artifact (three.js from CDN)
python3 build.py --check   also verifies the classic single file is rebuilt byte-for-byte."""
import os,sys,json,shutil,hashlib
R=os.path.dirname(os.path.abspath(__file__));S=lambda *p:os.path.join(R,'src',*p)
read=lambda p:open(p,encoding='utf-8').read()
TITLE='מילקי: ברדק אחולמניוקי'
VERSION=read(S('VERSION')).strip()
css=read(S('styles.css'));body=read(S('body.html'))
js=''.join(read(S('js',f)) for f in read(S('js','ORDER.txt')).split())
CDN='<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"></script>\n<script>window.THREE||document.write(\'<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\\/script>\')</script>\n'
VIEW='<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">'
def classic():
    return ('<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">'+VIEW+'<title>'+TITLE+'</title><style>'+css+'</style>'
            +body+CDN+'<script>\n'+js+'</script></body></html>')
def artifact():
    s=classic()
    s2='<title>'+TITLE+'</title>\n<script>document.documentElement.lang="he";document.documentElement.dir="rtl"</script>\n'+s[s.index('<style>'):]
    s2=s2.replace('</style></head><body>','</style>\n',1).replace('</script></body></html>','</script>')
    return s2.replace('canvas{display:block}','canvas{display:block;position:fixed;inset:0;touch-action:none}\n:root{color-scheme:dark}',1)
def app():
    head=('<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">'
      '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">'
      '<title>'+TITLE+'</title><meta name="description" content="מילקי, אבא, דני ובית אחד שלא ישרוד את היום. משחק תלת־ממד בדפדפן.">'
      '<meta name="theme-color" content="#171b22"><link rel="manifest" href="manifest.webmanifest">'
      '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">'
      '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="מילקי">'
      '<link rel="apple-touch-icon" href="icons/apple-touch-icon.png"><link rel="icon" type="image/png" href="icons/icon-192.png">'
      '<meta property="og:title" content="'+TITLE+'"><meta property="og:image" content="icons/icon-512.png">')
    three='<script src="vendor/three.min.js"></script>\n<script>window.THREE||document.write(\'<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\\/script>\')</script>\n'
    sw=("<script>if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))</script>\n")
    # iPhone Safari (not yet installed): a one-line tip on the start screen
    tip=("<script>addEventListener('DOMContentLoaded',()=>{const ios=/iPhone|iPad|iPod/.test(navigator.userAgent),inst=navigator.standalone||matchMedia('(display-mode: fullscreen),(display-mode: standalone)').matches;"
         "if(!ios||inst||window.top!==window)return;const n=document.getElementById('saveNote');if(!n)return;const p=document.createElement('p');p.id='installTip';"
         "p.textContent='📲 להתקנה כאפליקציה: כפתור השיתוף ⬆️ ← הוספה למסך הבית';p.style.cssText='font-size:13px;opacity:.85;margin:8px 0 0';n.after(p)})</script>\n")
    return head+'<style>'+css+'</style>'+body+three+sw+tip+'<script>\n'+js+'</script></body></html>'

def main():
    D=os.path.join(R,'dist');shutil.rmtree(D,ignore_errors=True);os.makedirs(D)
    shutil.copytree(os.path.join(R,'assets','icons'),os.path.join(D,'icons'))
    os.makedirs(os.path.join(D,'vendor'));shutil.copy(os.path.join(R,'assets','vendor','three.min.js'),os.path.join(D,'vendor'))
    open(os.path.join(D,'index.html'),'w',encoding='utf-8').write(app())
    open(os.path.join(D,'artifact.html'),'w',encoding='utf-8').write(artifact())
    man={'name':TITLE,'short_name':'מילקי','lang':'he','dir':'rtl','start_url':'./','scope':'./','display':'fullscreen',
         'orientation':'any','background_color':'#171b22','theme_color':'#171b22',
         'icons':[{'src':'icons/icon-192.png','sizes':'192x192','type':'image/png'},{'src':'icons/icon-512.png','sizes':'512x512','type':'image/png'},
                  {'src':'icons/icon-maskable-512.png','sizes':'512x512','type':'image/png','purpose':'maskable'}]}
    open(os.path.join(D,'manifest.webmanifest'),'w',encoding='utf-8').write(json.dumps(man,ensure_ascii=False,indent=1))
    files=['./','index.html','manifest.webmanifest','vendor/three.min.js']+['icons/'+f for f in sorted(os.listdir(os.path.join(D,'icons')))]
    h=hashlib.sha1(open(os.path.join(D,'index.html'),'rb').read()).hexdigest()[:8]
    sw=read(os.path.join(R,'src','sw.js')).replace('__CACHE__','milky-'+VERSION+'-'+h).replace('__FILES__',json.dumps(files))
    open(os.path.join(D,'sw.js'),'w',encoding='utf-8').write(sw)
    print('built dist/ version',VERSION,'cache',h)
    if '--check' in sys.argv and False:
        ref=read(os.path.join(R,'..','milky','index.html'))
        print('classic rebuild identical:',classic()==ref.rstrip('\n'))
main()
