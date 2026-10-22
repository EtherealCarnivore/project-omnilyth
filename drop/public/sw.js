// Minimal service worker: exists so the PWA is installable and can be an
// Android share target. It does not cache the app; every load hits the network.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method === 'POST' && url.pathname === '/share') {
    event.respondWith(handleShare(event.request));
  }
});

async function handleShare(request) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (file && file.size > 0) {
      const cache = await caches.open('drop-share');
      await cache.put('/shared-file', new Response(file, {
        headers: {
          'content-type': file.type || 'application/octet-stream',
          'x-name': encodeURIComponent(file.name || 'shared-file'),
        },
      }));
      return Response.redirect('/?share=1', 303);
    }
  } catch {}
  return Response.redirect('/', 303);
}
