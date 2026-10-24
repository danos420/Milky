// Offline cache: the whole game is a handful of files. New build = new cache name.
const CACHE='milky-35-892a62f2',FILES=["./", "index.html", "manifest.webmanifest", "vendor/three.min.js", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);if(u.origin!==location.origin)return;
 // The page itself: network first (so updates arrive), cache when offline. Everything else: cache first.
 if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('./',c));return r}).catch(()=>caches.match('./')));return}
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
