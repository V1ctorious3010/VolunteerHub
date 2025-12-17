import { useState, useEffect } from 'react';
import { registerAndSubscribe, unsubscribeFromPush, getCurrentSubscription } from '../pushRegistration';
import { getVapidPublicKey, sendSubscriptionToServer, unsubscribeFromServer } from '../utils/pushApi';

/**
 * Custom hook for managing Web Push Notifications
 * @returns {Object} Push notification state and methods
 */
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if push is supported
    const supported = 'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window;
    setIsSupported(supported);

    // Check current subscription status
    if (supported) {
      getCurrentSubscription().then(sub => {
        setIsSubscribed(!!sub);
      });
    }
  }, []);

  /**
   * Subscribe to push notifications
   * @param {string} authToken - JWT auth token
   */
  const subscribe = async (authToken) => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const vapidPublicKey = getVapidPublicKey();

      const subscription = await registerAndSubscribe(vapidPublicKey, async (sub) => {
        await sendSubscriptionToServer(sub, authToken);
      });

      if (subscription) {
        setIsSubscribed(true);
        return true;
      } else {
        setError('Failed to subscribe to push notifications');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Failed to subscribe');
      console.error('Subscribe error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Unsubscribe from push notifications
   * @param {string} authToken - JWT auth token
   */
  const unsubscribe = async (authToken) => {
    if (!isSupported) {
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const subscription = await getCurrentSubscription();

      if (subscription) {
        // Remove from server first
        if (authToken) {
          await unsubscribeFromServer(subscription, authToken);
        }

        // Then unsubscribe locally
        const success = await unsubscribeFromPush();

        if (success) {
          setIsSubscribed(false);
          return true;
        }
      }

      return false;
    } catch (err) {
      setError(err.message || 'Failed to unsubscribe');
      console.error('Unsubscribe error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSupported,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe
  };
}
