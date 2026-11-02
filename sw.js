const CACHE_NAME = 'ap-chat-v4';
const urlsToCache = [
  '/ap-chat/',
  '/ap-chat/index.html',
  '/ap-chat/manifest.json',
  '/ap-chat/launchericon-192x192.png',
  '/ap-chat/launchericon-144x144.png',
  '/ap-chat/launchericon-96x96.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/ap-chat/index.html');
        }
      });
    })
  );
});
