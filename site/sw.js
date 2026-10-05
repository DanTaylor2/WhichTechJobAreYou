// Change the version whenever a site file changes so laptops get a fresh copy.
const CACHE_PREFIX = `tech-careers-${self.registration.scope}-`;
const CACHE_NAME = `${CACHE_PREFIX}v8`;
const FILES = ['./', './index.html', './styles.css', './quiz-data.js', './app.js', './favicon.ico', './wirral-logo-white.png',
  './images/avatar-coffee.png', './images/avatar-plant.png', './images/avatar-headphones.png', './images/avatar-stationery.png', './images/avatar-planner.png', './images/avatar-hoodie.png', './images/avatar-smart.png', './images/avatar-snacks.png', './images/avatar-multitasker.png', './images/ux.jpg', './images/research.jpg', './images/dev.jpg', './images/data.jpg', './images/security.jpg', './images/architect.jpg', './images/systems.jpg', './images/support.jpg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.registration.scope)) return;
  event.respondWith(caches.open(CACHE_NAME).then(async cache => {
    const cached = await cache.match(event.request, { ignoreSearch: true });
    return cached || fetch(event.request);
  }));
});
