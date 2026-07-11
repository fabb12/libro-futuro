/* Service worker: cache dell'app shell + cache immagini (gestita da app.js) */
const SHELL_CACHE = 'lf-shell-v2';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'notes-config.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k.startsWith('lf-shell-') && k !== SHELL_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // le chiamate API GitHub vanno sempre in rete (l'app gestisce il fallback offline)
  if (url.hostname === 'api.github.com') return;
  if (e.request.method !== 'GET') return;
  // app shell: network-first con fallback alla cache (cosi' gli aggiornamenti arrivano subito)
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(SHELL_CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request))
  );
});
