const CACHE_NAME = 'fleuris-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/home.html',
  '/manifest.json',
  // Add other assets here (CSS, JS, icons)
];

// Install SW and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate SW and clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
    ))
  );
});

// Fetch handler to serve cached files when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).
