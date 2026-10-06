const CACHE='g4-thailand-v3-line-961hneoj';
const CORE=[
  './','./index.html','./styles.css?v=3-linefix','./app.js?v=3-linefix','./manifest.webmanifest'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).catch(()=>{}));
});

self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

// Network-first prevents an old GitHub Pages build from being trapped in cache.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith((async()=>{
    try {
      const fresh = await fetch(event.request, {cache:'no-store'});
      if (fresh && fresh.ok) {
        const cache = await caches.open(CACHE);
        cache.put(event.request, fresh.clone()).catch(()=>{});
      }
      return fresh;
    } catch (err) {
      return (await caches.match(event.request)) || (await caches.match('./index.html'));
    }
  })());
});
