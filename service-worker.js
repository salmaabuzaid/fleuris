const CACHE_NAME = 'fleuris-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/signup.html',
  '/styles/main.css',
  '/scripts/app.js',
  '/scripts/auth.js',
  '/scripts/products.js',
  '/scripts/community.js',
  '/scripts/points.js',
  '/scripts/lookbooks.js',
  '/scripts/live.js',
  '/scripts/multilingual.js',
  '/scripts/photoUploads.js',
  '/scripts/wishlist.js',
  '/supabaseClient.js',
  '/manifest.json'
];

// Install SW and cache files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate SW and clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// Fetch with cache fallback for offline support
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cacheRes => {
      return cacheRes || fetch(e.request);
    })
  );
});
