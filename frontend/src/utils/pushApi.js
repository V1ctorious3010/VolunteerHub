/**
 * API functions for Web Push subscription management
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Get VAPID public key from environment
 * @returns {string}
 */
export function getVapidPublicKey() {
  const key = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  console.log('VAPID env:', key);
  if (!key) {
    throw new Error('VITE_VAPID_PUBLIC_KEY not found in environment');
  }
  return key;
}

/**
 * Send push subscription to backend
 * @param {PushSubscription} subscription - Push subscription object
 * @param {string} authToken - JWT auth token
 * @returns {Promise<void>}
 */
export async function sendSubscriptionToServer(subscription, authToken) {
  try {
    const subscriptionJSON = subscription.toJSON();

    const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({
        endpoint: subscriptionJSON.endpoint,
        p256dh: subscriptionJSON.keys.p256dh,
        auth: subscriptionJSON.keys.auth
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send subscription to server');
    }

    console.log('Subscription sent to server successfully');
  } catch (error) {
    console.error('Error sending subscription to server:', error);
    throw error;
  }
}

/**
 * Remove push subscription from backend
 * @param {PushSubscription} subscription - Push subscription object
 * @param {string} authToken - JWT auth token
 * @returns {Promise<void>}
 */
export async function unsubscribeFromServer(subscription, authToken) {
  try {
    const subscriptionJSON = subscription.toJSON();

    const response = await fetch(`${API_BASE_URL}/notifications/unsubscribe`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({
        endpoint: subscriptionJSON.endpoint
      })
    });

    if (!response.ok) {
      throw new Error('Failed to unsubscribe from server');
    }

    console.log('Unsubscribed from server successfully');
  } catch (error) {
    console.error('Error unsubscribing from server:', error);
    throw error;
  }
}
