const CACHE_NAME = "publicacion_web_principiantes_v0_6_publica-cache-v2-libro-abierto";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./src/app.js",
  "./manifest.webmanifest",
  "./src/data/checklists.json",
  "./src/data/course_content.json",
  "./src/data/course_manifest.json",
  "./src/data/final_publish_project.json",
  "./src/data/incidents.json",
  "./src/data/publication_lab.json",
  "./src/data/publish_builder.json",
  "./icons/icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
