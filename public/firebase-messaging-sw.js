/* eslint-disable no-undef */

(function initializeMessagingServiceWorker() {
  const params = new URL(self.location.href).searchParams;
  const firebaseConfig = {
    apiKey: params.get("apiKey"),
    authDomain: params.get("authDomain"),
    projectId: params.get("projectId"),
    storageBucket: params.get("storageBucket"),
    messagingSenderId: params.get("messagingSenderId"),
    appId: params.get("appId")
  };

  const isConfigComplete = Object.values(firebaseConfig).every(Boolean);

  if (!isConfigComplete) {
    return;
  }

  importScripts("https://www.gstatic.com/firebasejs/12.5.0/firebase-app-compat.js");
  importScripts("https://www.gstatic.com/firebasejs/12.5.0/firebase-messaging-compat.js");

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = payload?.notification?.title || payload?.data?.title || "Event update";
    const body = payload?.notification?.body || payload?.data?.message || "";
    const link = payload?.data?.link || "/";

    self.registration.showNotification(title, {
      body,
      data: { link },
      icon: "/icon.svg",
      badge: "/icon.svg",
      tag: "event-alert"
    });
  });
})();

self.addEventListener("notificationclick", (event) => {
  const target = event.notification?.data?.link || "/";
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        const clientUrl = new URL(client.url);
        const targetUrl = new URL(target, self.location.origin);

        if (clientUrl.href === targetUrl.href && "focus" in client) {
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(target);
      }

      return undefined;
    })
  );
});
