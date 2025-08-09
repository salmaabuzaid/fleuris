const CACHE_NAME = 'fleuris-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/home.html',
  '/home.css',
  '/home.js',
  '/firebase.js'
];

self.addEventListener('install', evt=>{
  evt.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', evt=>{
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt=>{
  if (evt.request.mode === 'navigate') {
    evt.respondWith(fetch(evt.request).catch(()=>caches.match('/index.html')));
    return;
  }
  evt.respondWith(caches.match(evt.request).then(resp=>resp||fetch(evt.request)));
});
