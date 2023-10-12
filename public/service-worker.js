const cacheVersion = 'v0.0.8';
const cacheName = 'my-pwa-cache-' + cacheVersion;

self.addEventListener('install', function(event) {
  event.waitUntil(cacheAssets(event));
});

async function cacheAssets() {
  const assets = [
    // Add other assets you want to cache...
    '/',
    '/index.html',
    '/countdown.wav',
  ];

  const cache = await caches.open(cacheName);
  await cache.addAll(assets);
}

self.addEventListener('activate', function(event) {
  event.waitUntil(cacheKeys(event));
});

async function cacheKeys(event) {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.filter(function(name) {
      return name.startsWith('my-pwa-cache-') && name !== cacheName;
    }).map(function(name) {
      return caches.delete(name);
    })
  )
}

self.addEventListener('fetch', (event) => {
  event.respondWith(handleFetch(event));
});

async function handleFetch(event) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(event.request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(event.request);
  if (response.ok) {
    const clone = response.clone();
    cache.put(event.request, clone);
  }

  return response;
}
