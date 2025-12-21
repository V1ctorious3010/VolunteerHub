/**
 * Helper functions for Web Push Registration
 */

/**
 * Convert VAPID base64 public key to Uint8Array
 * @param {string} base64String - VAPID public key in base64
 * @returns {Uint8Array}
 */
export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Check if browser supports push notifications
 * @returns {boolean}
 */
export function isPushSupported() {
  return 'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window;
}

/**
 * Register service worker and subscribe to push notifications
 * @param {string} vapidPublicKey - VAPID public key from backend
 * @param {Function} sendSubscriptionFn - Callback to send subscription to backend
 * @returns {Promise<PushSubscription|null>}
 */
export async function registerAndSubscribe(vapidPublicKey, sendSubscriptionFn) {
  if (!isPushSupported()) {
    console.warn('Push notifications are not supported in this browser');
    return null;
  }

  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log('Service Worker registered successfully');

    await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return null;
    }

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      let applicationServerKey;
      try {
        if (!vapidPublicKey || typeof vapidPublicKey !== 'string') {
          throw new Error('VAPID public key is missing or invalid');
        }
        applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
        console.debug('VAPID key (bytes):', applicationServerKey.length);
        if (applicationServerKey.length !== 65 && applicationServerKey.length !== 64) {
          console.warn('Unexpected VAPID public key length:', applicationServerKey.length);
        }
      } catch (e) {
        console.error('Failed to convert VAPID public key to Uint8Array:', e);
        throw e;
      }

      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey
        });
        console.log('Push subscription created');
      } catch (e) {
        console.error('PushManager.subscribe error:', e);
        throw e;
      }
    } else {
      console.log('Already subscribed to push');
    }

    if (sendSubscriptionFn) {
      await sendSubscriptionFn(subscription);
    }

    return subscription;
  } catch (error) {
    console.error('Error in registerAndSubscribe:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 * @returns {Promise<boolean>}
 */
export async function unsubscribeFromPush() {
  if (!isPushSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const successful = await subscription.unsubscribe();
      console.log('Unsubscribed from push:', successful);
      return successful;
    }

    return false;
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return false;
  }
}

/**
 * Get current push subscription
 * @returns {Promise<PushSubscription|null>}
 */
export async function getCurrentSubscription() {
  if (!isPushSupported()) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
}
