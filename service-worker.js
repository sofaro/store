const staticCacheName = "static-cache-v02";

const staticAssets = [
    "./logo192.png",
    "./favicon.ico",
    "./telegram-web-app.js",
    "./static/js/main.c0c807c5.js",
    "./static/css/main.a810a4b0.css"
]

self.addEventListener("install", async event => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(staticAssets);
    console.log("Service worker has been installed");
})

self.addEventListener("activate", async event => {
    const cachesKeys = await caches.keys();
    const checkKeys = cachesKeys.map(async key => {
        if (staticCacheName !== key) {
            await caches.delete(key)
        }
    });
    await Promise.all(checkKeys);
    console.log("Service worker has been activated");
})

self.addEventListener("fetch", event => {
    console.log(`Trying to fetch ${event.request.url}`);
    event.respondWith(caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request)
    }))
})

self.VERSION = staticCacheName;