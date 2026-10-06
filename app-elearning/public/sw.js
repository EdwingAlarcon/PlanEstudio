// PlanEstudio service worker — offline reading of already-visited pages.
// Strategy: pages network-first (always fresh when online, cached copy offline),
// hashed /_next/static assets cache-first (immutable), everything else
// stale-while-revalidate. Bump CACHE_VERSION to invalidate all cached content.
const CACHE_VERSION = "v1";
const CACHE = `planestudio-${CACHE_VERSION}`;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("planestudio-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function put(request, response) {
  if (response && response.ok && response.type === "basic") {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.includes("/_next/static/")) {
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request).then((res) => put(request, res))));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => put(request, res))
        .catch(() => caches.match(request).then((hit) => hit || caches.match(self.registration.scope)))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((hit) => {
      const network = fetch(request).then((res) => put(request, res)).catch(() => hit);
      return hit || network;
    })
  );
});
