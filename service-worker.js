const staticCacheName = "static-cache-v01";

const staticAssets = [
    "./index.html", // Ensure index.html is cached
    "./logo192.png",
    "./favicon.ico",
    "./telegram-web-app.js",
    "./static/js/main.73073b7e.js",
    "./static/css/main.83a4e228.css"
];

self.addEventListener("install", async event => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(staticAssets);
    console.log("Service worker has been installed");
});

self.addEventListener("activate", async event => {
    const cachesKeys = await caches.keys();
    const checkKeys = cachesKeys.map(async key => {
        if (staticCacheName !== key) {
            await caches.delete(key);
        }
    });
    await Promise.all(checkKeys);
    console.log("Service worker has been activated");
});

self.addEventListener("fetch", event => {
    console.log(`Trying to fetch ${event.request.url}`);

    // Check if the request is for a navigation route (hash-based)
    if (event.request.mode === 'navigate' || event.request.url.includes('#/')) {
        // Respond with the cached index.html for navigation requests
        event.respondWith(
            caches.match('./index.html').then(cachedResponse => {
                return cachedResponse || fetch(event.request).catch(() => {
                    // Fallback if both cache and network fail
                    return new Response("Offline", { status: 503 });
                });
            })
        );
    } else {
        // For other requests, try to serve from cache or fetch from network
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                return cachedResponse || fetch(event.request).catch(() => {
                    // Handle network errors gracefully
                    return new Response("Network error", { status: 503 });
                });
            })
        );
    }
});

self.VERSION = staticCacheName;
