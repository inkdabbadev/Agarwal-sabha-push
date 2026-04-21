"use client";

import { useEffect, useRef, useState } from "react";
import { getToken } from "firebase/messaging";

import {
  buildMessagingServiceWorkerUrl,
  getFirebaseMessagingClient,
  getFirebaseVapidKey,
  onMessage
} from "@/lib/firebase";
import type { AlertStatus } from "@/types";

import { IphoneInstructions } from "./IphoneInstructions";
import { StatusCard } from "./StatusCard";

type EnableAlertsButtonProps = {
  title?: string;
  description?: string;
  compact?: boolean;
};

function isLikelyIphone() {
  if (typeof navigator === "undefined") {
    return false;
  }

  const platform = navigator.platform || "";
  const userAgent = navigator.userAgent || "";
  return /iPhone|iPad|iPod/i.test(platform) || /iPhone|iPad|iPod/i.test(userAgent);
}

function getStatusCopy(status: AlertStatus, errorMessage: string | null) {
  switch (status) {
    case "checking":
      return {
        title: "Checking support",
        description: "We are verifying whether this device can receive event alerts.",
        tone: "neutral" as const
      };
    case "enabling":
      return {
        title: "Enabling alerts",
        description: "Please accept the browser prompt so we can deliver live updates during the celebration.",
        tone: "neutral" as const
      };
    case "enabled":
      return {
        title: "Alerts enabled successfully",
        description: "You are subscribed to live announcements for the Platinum Jubilee event.",
        tone: "success" as const
      };
    case "denied":
      return {
        title: "Permission denied",
        description: "Notifications are blocked on this device. You can allow them later from your browser settings.",
        tone: "warning" as const
      };
    case "unsupported":
      return {
        title: "Unsupported browser or device",
        description:
          "This browser does not currently support web push notifications for this experience.",
        tone: "warning" as const
      };
    case "error":
      return {
        title: "We could not enable alerts",
        description: errorMessage ?? "Please try again in a moment.",
        tone: "danger" as const
      };
    case "idle":
    default:
      return {
        title: "Alerts not enabled",
        description: "Enable alerts to receive important live updates during the event.",
        tone: "neutral" as const
      };
  }
}

export function EnableAlertsButton({
  title = "Enable live event alerts",
  description = "Enable alerts to receive important live updates during the event.",
  compact = false
}: EnableAlertsButtonProps) {
  const [status, setStatus] = useState<AlertStatus>("checking");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastForegroundMessage, setLastForegroundMessage] = useState<string | null>(null);
  const [showIphoneTip, setShowIphoneTip] = useState(false);
  const hasAttemptedSilentSync = useRef(false);

  useEffect(() => {
    let isActive = true;

    async function assessSupport() {
      setShowIphoneTip(isLikelyIphone());

      const supported =
        typeof window !== "undefined" &&
        "Notification" in window &&
        "serviceWorker" in navigator &&
        "PushManager" in window;

      if (!supported) {
        if (isActive) {
          setStatus("unsupported");
        }
        return;
      }

      const messaging = await getFirebaseMessagingClient();

      if (!messaging) {
        if (isActive) {
          setStatus("unsupported");
        }
        return;
      }

      const unsubscribe = onMessage(messaging, (payload) => {
        const titleText = payload.notification?.title ?? "Live announcement received";
        const bodyText = payload.notification?.body ?? "Open the app for details.";
        setLastForegroundMessage(`${titleText}: ${bodyText}`);
      });

      if (!isActive) {
        unsubscribe();
        return;
      }

      if (Notification.permission === "granted" && !hasAttemptedSilentSync.current) {
        hasAttemptedSilentSync.current = true;
        await enableAlerts(true);
      } else if (Notification.permission === "denied") {
        setStatus("denied");
      } else {
        setStatus("idle");
      }

      return unsubscribe;
    }

    const cleanupPromise = assessSupport();

    return () => {
      isActive = false;
      void cleanupPromise.then((cleanup) => cleanup?.());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function enableAlerts(skipPermissionPrompt = false) {
    setErrorMessage(null);
    setStatus("enabling");

    try {
      const messaging = await getFirebaseMessagingClient();

      if (!messaging) {
        setStatus("unsupported");
        return;
      }

      const serviceWorkerRegistration = await navigator.serviceWorker.register(
        buildMessagingServiceWorkerUrl()
      );

      const permission = skipPermissionPrompt
        ? Notification.permission
        : await Notification.requestPermission();

      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "idle");
        return;
      }

      const token = await getToken(messaging, {
        vapidKey: getFirebaseVapidKey(),
        serviceWorkerRegistration
      });

      if (!token) {
        throw new Error("Token retrieval failed. Please try again.");
      }

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save your subscription.");
      }

      setStatus("enabled");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to enable alerts.";
      setErrorMessage(message);
      setStatus("error");
    }
  }

  const statusCopy = getStatusCopy(status, errorMessage);

  return (
    <div className={`space-y-4 ${compact ? "" : "rounded-[2rem] bg-white/75 p-5 shadow-soft backdrop-blur sm:p-6"}`}>
      <div className="space-y-2">
        <h2 className="font-serif text-2xl text-primary">{title}</h2>
        <p className="text-sm leading-6 text-foreground/75">{description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => void enableAlerts(false)}
          disabled={status === "enabling"}
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "enabling" ? "Enabling..." : status === "enabled" ? "Alerts Enabled" : "Enable Alerts"}
        </button>
        <a
          href="/event-info"
          className="inline-flex items-center justify-center rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:border-primary/30 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
        >
          View Event Info
        </a>
      </div>

      <StatusCard
        title={statusCopy.title}
        description={statusCopy.description}
        tone={statusCopy.tone}
      />

      {lastForegroundMessage ? (
        <StatusCard
          title="Latest live message"
          description={lastForegroundMessage}
          tone="success"
        />
      ) : null}

      {showIphoneTip ? <IphoneInstructions compact={compact} /> : null}
    </div>
  );
}
