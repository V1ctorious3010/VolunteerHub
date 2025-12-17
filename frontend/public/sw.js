// Service Worker for Web Push Notifications
self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'Thông báo',
      body: event.data?.text() || 'Bạn có thông báo mới'
    };
  }

  const title = data.title || 'Thông báo mới';
  const options = {
    body: data.body || '',
    icon: '/vite.svg',
    badge: '/vite.svg',
    data: data,
    tag: data.type || 'notification',
    requireInteraction: false,
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        // Tìm tab đã mở
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Mở tab mới nếu chưa có
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
  );
});

self.addEventListener('pushsubscriptionchange', event => {
  console.log('Push subscription changed');
  // Có thể tự động đăng ký lại nếu cần
});
