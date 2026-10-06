const CACHE='g4-thailand-v2';
const ASSETS=[
  './','./index.html','./styles.css','./app.js','./manifest.webmanifest',
  './assets/g4-logo.webp','./assets/hero-g4-15.png','./assets/hero-g4-50.png','./assets/hero-g4x-20.png',
  './assets/performance-main.webp','./assets/system-daily.webp','./assets/system-competition.webp','./assets/system-nutrition.webp','./assets/system-range.webp',
  './assets/gallery-performance.webp','./assets/gallery-daily.webp','./assets/gallery-nutrition.webp','./assets/bird-food-100g.webp',
  './assets/fonts/JS-Oobboon.woff2','./assets/fonts/JS-OobboonBold.woff2','./assets/fonts/JS-OobboonItalic.woff2','./assets/fonts/JS-OobboonBoldItalic.woff2'
];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
