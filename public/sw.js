// CloudForShare Service Worker
const CACHE_NAME = 'cloudforshare-v1'
const OFFLINE_URL = '/'

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(['/', '/favicon.svg']))
  )
  self.skipWaiting()
})

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch — network first, fallback to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  // Skip Supabase & Vite HMR requests
  if (url.hostname.includes('supabase') || url.pathname.startsWith('/@')) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200 && url.origin === self.location.origin) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return response
      })
      .catch(() => caches.match(event.request).then((r) => r || caches.match(OFFLINE_URL)))
  )
})