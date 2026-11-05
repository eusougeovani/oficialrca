/* Service worker do RCA: cache leve para uso offline básico. Aumente VERSION ao publicar mudanças. */
const VERSION = 'rca-v2';
const CORE = ['/', '/index.html', '/assets/css/style.css', '/assets/js/app.js', '/assets/js/data.js', '/pages/images/escudo.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERSION).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  // rede primeiro (conteúdo sempre atual), cache como reserva offline
  e.respondWith(fetch(r).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(r, copy)); return res; }).catch(() => caches.match(r).then(m => m || caches.match('/index.html'))));
});
