const staticCacheName = "static-cache-v03";

const staticAssets = [
    "./logo192.png",
    "./favicon.ico",
    "./telegram-web-app.js",
    "./static/js/main.756025aa.js",
    "./static/css/main.e6785ae5.css"
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
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Return cached response if available
                if (cachedResponse) {
                    return cachedResponse;
                }

                // If not in cache, try to fetch from network
                return fetch(event.request)
                    .then(networkResponse => {
                        console.log("!!!!",JSON.stringify(networkResponse.body));
                        // Check if the response is valid
                        if (!networkResponse.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('Fetch failed; returning offline message.', error);
                        // Return a custom message if there's an error
                        return new Response("No new data available 2020-08-22T13:55:26.769Z", {
                            data:{dateUpdate:"2020-08-22T13:55:26.769Z"},
                            status: 404,
                            statusText: "Not Found"
                        });
                    });
            })
    );
});

self.VERSION = staticCacheName;
