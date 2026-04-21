import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, isSupported, onMessage, type Messaging } from "firebase/messaging";

const firebaseWebConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

function hasCompleteFirebaseConfig() {
  return Object.values(firebaseWebConfig).every(Boolean);
}

export function getFirebaseWebConfig() {
  if (!hasCompleteFirebaseConfig()) {
    throw new Error("Firebase web configuration is incomplete.");
  }

  return firebaseWebConfig;
}

export async function getFirebaseMessagingClient(): Promise<Messaging | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const supported = await isSupported().catch(() => false);

  if (!supported || !hasCompleteFirebaseConfig()) {
    return null;
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseWebConfig);
  return getMessaging(app);
}

export function getFirebaseVapidKey() {
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  if (!vapidKey) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY.");
  }

  return vapidKey;
}

export function buildMessagingServiceWorkerUrl() {
  const config = getFirebaseWebConfig();
  const params = new URLSearchParams({
    apiKey: config.apiKey ?? "",
    authDomain: config.authDomain ?? "",
    projectId: config.projectId ?? "",
    storageBucket: config.storageBucket ?? "",
    messagingSenderId: config.messagingSenderId ?? "",
    appId: config.appId ?? ""
  });

  return `/firebase-messaging-sw.js?${params.toString()}`;
}

export { onMessage };
