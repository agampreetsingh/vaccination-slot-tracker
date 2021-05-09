console.log('Started', self);
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('airhorner').then(function(cache) {
      return cache.addAll([
        'index.html',
        'css/styles.css',
        'js/a2hs/pwainstaller.js',
        'js/constants.js',
        'js/scraper.js',
        'js/util.js',
        'js/themechanger.js',
        'js/vaccineDataUtil.js',
        'images/touch/homescreen48.png',
        'images/touch/homescreen72.png',
        'images/touch/homescreen96.png',
        'images/touch/homescreen144.png',
        'images/touch/homescreen168.png',
        'images/touch/homescreen192.png',
        'images/touch/homescreen512.png'
      ]);
    })
  );
 });
self.addEventListener('push', function(event) {
  console.log('Push message received', event);
});
self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
 });
