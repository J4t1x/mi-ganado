const CACHE_VERSION = 2;
const STATIC_CACHE = `mi-ganado-static-v${CACHE_VERSION}`;
const API_CACHE = `mi-ganado-api-v${CACHE_VERSION}`;
const OFFLINE_URL = '/offline';

const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
];

// Max age for cached API responses (5 minutes)
const API_CACHE_MAX_AGE = 5 * 60 * 1000;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== API_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip chrome-extension, non-http
  if (!url.protocol.startsWith('http')) return;

  // Handle API requests (external backend)
  if (url.pathname.includes('/api/v1/') || url.pathname.includes('/auth/')) {
    if (request.method === 'GET') {
      event.respondWith(handleApiGet(request));
    } else {
      event.respondWith(handleApiMutation(request));
    }
    return;
  }

  // Skip non-GET for other requests
  if (request.method !== 'GET') return;

  // For navigation requests, network first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the page for offline use
          const clone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // Static assets: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Handle API GET requests: network first, cache fallback
async function handleApiGet(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const clone = response.clone();
      const cache = await caches.open(API_CACHE);
      await cache.put(request, clone);
    }
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[SW] Serving cached API response:', request.url);
      return cachedResponse;
    }
    return new Response(
      JSON.stringify({ error: 'Sin conexión', offline: true }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handle API mutations: try network, queue if offline
async function handleApiMutation(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    await queueRequest(request);
    // Notify clients about the queued request
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({ type: 'SYNC_QUEUED', timestamp: Date.now() });
    });
    return new Response(
      JSON.stringify({ queued: true, message: 'Operación guardada. Se sincronizará al reconectar.' }),
      { status: 202, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Queue requests for background sync
async function queueRequest(request) {
  const db = await openDB();
  const tx = db.transaction('sync-queue', 'readwrite');
  const store = tx.objectStore('sync-queue');
  
  const requestData = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: await request.text(),
    timestamp: Date.now(),
  };
  
  await store.add(requestData);
}

// Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mi-ganado-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('sync-queue')) {
        db.createObjectStore('sync-queue', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('offline-data')) {
        db.createObjectStore('offline-data', { keyPath: 'key' });
      }
    };
  });
}

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-queue') {
    event.waitUntil(processSyncQueue());
  }
});

async function processSyncQueue() {
  const db = await openDB();
  const tx = db.transaction('sync-queue', 'readwrite');
  const store = tx.objectStore('sync-queue');
  const requests = await store.getAll();
  
  for (const requestData of requests) {
    try {
      await fetch(requestData.url, {
        method: requestData.method,
        headers: requestData.headers,
        body: requestData.body,
      });
      await store.delete(requestData.id);
    } catch (error) {
      console.error('[SW] Failed to sync request:', error);
    }
  }
}

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
