// Service Worker for Puter Translator PWA
const CACHE_NAME = 'puter-translator-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    'https://js.puter.com/v2/'
];

// Install Service Worker
self.addEventListener('install', function(event) {
    console.log('Service Worker installing');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache:', CACHE_NAME);
                // Cache only local files, skip external URLs that might fail
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/manifest.json'
                ]);
            }).then(() => {
                // Force immediate activation
                return self.skipWaiting();
            }).catch(error => {
                console.error('Cache installation failed:', error);
            })
    );
});

// Fetch event with network-first strategy for Puter API calls
self.addEventListener('fetch', function(event) {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Network-first strategy for Puter API and external resources
    if (event.request.url.includes('puter.com') ||
        event.request.url.includes('api')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Return network response
                    return response;
                })
                .catch(() => {
                    // Network failed, try cache
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Cache-first strategy for local assets
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // Network request with cache fallback
            return fetch(event.request).then(fetchResponse => {
                // Check if valid response
                if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                    return fetchResponse;
                }

                // Clone response for caching
                const responseToCache = fetchResponse.clone();

                // Add to cache for future requests
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });

                return fetchResponse;
            }).catch(() => {
                // Network failed, try to serve from cache
                return caches.match(event.request);
            });
        })
    );
});

// Activate event
self.addEventListener('activate', function(event) {
    console.log('Service Worker activating');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Take control of all clients immediately
            return self.clients.claim();
        }).then(() => {
            // Send update message to all clients
            return self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SW_UPDATED',
                        cacheName: CACHE_NAME
                    });
                });
            });
        })
    );
});

// Handle messages from clients
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
