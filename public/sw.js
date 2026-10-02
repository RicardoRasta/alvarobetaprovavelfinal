const CACHE_NAME = "casa-de-aventura-pwa-v4";
const APP_SHELL = ["/", "/web", "/manifest.webmanifest", "/assets/casa-de-aventura-logo-redonda-transparente.svg", "/assets/casa-de-aventura-logo-horizontal.png"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(async (cache) => {
    await Promise.all(APP_SHELL.map(async (url) => {
      try {
        const response = await fetch(url, { cache: "reload" });
        if (response.ok) await cache.put(url, response);
      } catch { /* Recurso indisponível não deve bloquear a instalação. */ }
    }));
  }));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys
      .filter((key) => key.startsWith("casa-de-aventura-pwa-") && key !== CACHE_NAME)
      .map((key) => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)));
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      const home = await caches.match("/");
      if (home) return home;
      return new Response("Você está offline. Verifique sua conexão e tente novamente.", {
        status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }));
    return;
  }

  const isStaticAsset = /\.(?:js|css|png|jpe?g|webp|svg|woff2?|ico)$/i.test(url.pathname);
  if (!isStaticAsset) return;
  event.respondWith(caches.match(request).then(async (cached) => {
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      const contentType = response.headers.get("content-type") || "";
      if (!/text\/html/i.test(contentType)) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)));
      }
    }
    return response;
  }));
});
