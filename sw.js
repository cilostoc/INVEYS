// INVEYS Service Worker for Offline PWA Support
const CACHE_NAME = 'inveys-v0.23.0-cache';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/engine.js',
  '/finance.js',
  '/investment.js',
  '/appearance.js',
  '/plans.js',
  '/i18n.js',
  '/recording.js',
  '/releases.js',
  '/assistant.js',
  '/operations.js',
  '/app.js',
  '/releases.json',
  '/manifest.webmanifest',
  '/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API calls are network-first without caching in service worker
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ ok: false, offline: true, error: 'Offline - Unable to connect to INVEYS server' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Static assets: cache-first with network fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.status === 200 && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => caches.match('/index.html'))
  );
});
