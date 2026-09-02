// Service worker: els fitxers principals (html/js/manifest) van SEMPRE directes de
// la xarxa (mai es guarden en cau), així no es queda mai una versió antiga.
// Només es guarden en cau les icones/imatges com a reserva sense connexió.
const CACHE = 'registre-cache-v63';
const CORE = ['/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.pathname.startsWith('/api/')) return; // les crides a l'API mai passen pel worker
  const shell = req.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html') || url.pathname.endsWith('.js') || url.pathname.endsWith('.webmanifest');
  if (shell) {
    // Sempre de la xarxa; només si no hi ha connexió, es mira si tenim l'index guardat.
    e.respondWith(fetch(new Request(req, { cache: 'no-store' })).catch(() => caches.match('/index.html')));
    return;
  }
  e.respondWith(
    fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); return res; })
      .catch(() => caches.match(req))
  );
});

