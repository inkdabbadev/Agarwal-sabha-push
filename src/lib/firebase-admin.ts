import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

declare global {
  // eslint-disable-next-line no-var
  var __firebaseAdminInitialized: boolean | undefined;
}

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function initializeFirebaseAdminApp() {
  if (!global.__firebaseAdminInitialized && !getApps().length) {
    initializeApp({
      credential: cert({
        projectId: requireEnv("FIREBASE_PROJECT_ID"),
        clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
        privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n")
      })
    });

    global.__firebaseAdminInitialized = true;
  }
}

export function getFirebaseAdminMessaging() {
  initializeFirebaseAdminApp();
  return getMessaging();
}
