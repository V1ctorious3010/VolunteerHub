import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./assets/Routes/Routes";
import { Provider } from 'react-redux';
import store from './store/store';
import { Toaster } from "react-hot-toast";
import { registerAndSubscribe } from "./pushRegistration";
import { getVapidPublicKey, sendSubscriptionToServer } from "./utils/pushApi";

// Initialize Web Push Notifications after successful login
const startPushWhenLoggedIn = () => {
  let previousUser = store.getState().auth?.user;
  const unsubscribe = store.subscribe(() => {
    const currentUser = store.getState().auth?.user;
    // when user becomes non-null (login succeeded), initialize push
    if (!previousUser && currentUser) {
      (async () => {
        try {
          const vapidPublicKey = getVapidPublicKey();
          await registerAndSubscribe(vapidPublicKey, async (subscription) => {
            // backend uses cookie-based auth (refresh token in HttpOnly cookie),
            // so we send subscription with credentials from the client (no bearer needed)
            await sendSubscriptionToServer(subscription);
          });
          console.log('Push notifications initialized after login');
        } catch (err) {
          console.error('Failed to initialize push notifications after login:', err);
        }
      })();
      unsubscribe();
    }
    previousUser = currentUser;
  });
};

startPushWhenLoggedIn();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  </React.StrictMode>
);
