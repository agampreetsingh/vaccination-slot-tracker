console.log('Started', self);

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        'index.html'
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
