/* =====================================================================
   HELLMED — sw.js (Service Worker)
   ---------------------------------------------------------------------
   Un service worker es un "intermediario" entre la página y la red.
   Aquí lo usamos para guardar (cachear) los archivos del sitio y poder
   abrirlo sin internet.

   ⚠ CADA VEZ que cambies index.html, style.css, extras.css o app.js,
   SUBE el número de VERSION (v1 → v2 → v3...). Así el navegador borra
   la caché vieja y descarga los archivos nuevos.
   ===================================================================== */
const VERSION = 'v1';
const CACHE = `hellmed-${VERSION}`;

// Archivos esenciales que se guardan al instalar (rutas relativas: sirve en GitHub Pages)
const PRECACHE = [
  './',
  'index.html',
  'style.css',
  'extras.css',
  'app.js',
  'offline.html',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'assets/img/escena-catedral.svg',
  'assets/img/escena-ciudad.svg',
  'assets/img/escena-bosque.svg'
];

/* 1) INSTALL: se ejecuta una vez; descarga y guarda los archivos esenciales */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

/* 2) ACTIVATE: borra las cachés de versiones anteriores */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('hellmed-') && k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* 3) FETCH: decide de dónde sale cada archivo */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!url.protocol.startsWith('http')) return;

  // La API de Supabase (login) y el APK NUNCA se cachean: van directo a la red
  if (url.hostname.endsWith('.supabase.co') || url.pathname.endsWith('.apk')) return;

  // a) Navegación (abrir una página): red primero; si no hay internet, caché; si tampoco, offline.html
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() =>
          // Sin internet: si esa página ya se visitó (ej. el inicio) sale de la caché; si no, sale offline.html
          caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('offline.html'))
        )
    );
    return;
  }

  // b) Archivos del propio sitio: caché primero y se actualiza en segundo plano
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((hit) => {
        const network = fetch(req)
          .then((res) => {
            if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
            return res;
          })
          .catch(() => hit);
        return hit || network;
      })
    );
    return;
  }

  // c) Recursos externos (Google Fonts, librería de Supabase): caché primero, y se guardan al verlos
  event.respondWith(
    caches.match(req).then((hit) =>
      hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => hit)
    )
  );
});
