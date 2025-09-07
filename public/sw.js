// Generate cache name with timestamp for automatic cache busting
const CACHE_VERSION = 1757249846845;
const CACHE_NAME = `suit-app-v${CACHE_VERSION}`;

const urlsToCache = [
  '/',
  '/assets/photoBackGround3.jpg',
  '/assets/photoBackGround4.webp',
  '/assets/LogoSite.png',
  // Add more critical assets
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log(`Service Worker installing... v${CACHE_VERSION}`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log(`Opened cache v${CACHE_VERSION}`);
        return cache.addAll(urlsToCache);
      })
  );
  // Force activation
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log(`Service Worker activating... v${CACHE_VERSION}`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control immediately
  event.waitUntil(self.clients.claim());
});

// Single fetch event handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle JavaScript files - always fetch fresh
  if (request.url.includes('.js') && !request.url.includes('node_modules')) {
    event.respondWith(
      fetch(request, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Handle HTML files - always fetch fresh
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Handle images - cache with network first strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            // Return cached version immediately
            return response;
          }
          // Fetch from network and cache
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
          return fetchPromise;
        });
      })
    );
    return;
  }

  // Default strategy - network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // If successful, cache the response for future use
        if (response.ok && request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(request);
      })
  );
});
