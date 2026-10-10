const CACHE_NAME = 'abska-214-v2';

// Install Event - Pre-cache core files relative to registration scope
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const scope = self.registration.scope;
      const assetsToCache = [
        scope,
        `${scope}index.html`,
        `${scope}manifest.webmanifest`,
        `${scope}icon.svg`,
        `${scope}pwa-192x192.png`,
        `${scope}pwa-512x512.png`,
        `${scope}apple-touch-icon.png`
      ];

      for (const asset of assetsToCache) {
        try {
          await cache.add(asset);
        } catch (e) {
          console.warn('[SW] Could not pre-cache asset:', asset, e);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale caches while leaving IndexedDB untouched
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-while-revalidate for assets, Network-first fallback to cache for navigations
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Ignore non-http/https
  if (!request.url.startsWith('http')) return;

  // For HTML page navigation, try network first, then cache, then offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          const fallback = await caches.match(self.registration.scope);
          if (fallback) return fallback;
          return caches.match(`${self.registration.scope}index.html`);
        })
    );
    return;
  }

  // For static assets (JS, CSS, images, fonts)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
