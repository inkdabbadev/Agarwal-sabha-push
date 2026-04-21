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

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches === true ||
    window.matchMedia?.("(display-mode: fullscreen)")?.matches === true ||
    ("standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function getStatusCopy(status: AlertStatus, errorMessage: string | null) {
  switch (status) {
    case "checking":
      return {
        title: "Checking",
        description: "Checking device support.",
        tone: "neutral" as const
      };
    case "enabling":
      return {
        title: "Enabling alerts",
        description: "Please allow notifications.",
        tone: "neutral" as const
      };
    case "enabled":
      return {
        title: "Alerts enabled",
        description: "You will receive live updates.",
        tone: "success" as const
      };
    case "needs-install":
      return {
        title: "Open from Home Screen",
        description: "On iPhone, install this site and open it from Home Screen.",
        tone: "warning" as const
      };
    case "denied":
      return {
        title: "Permission denied",
        description: "Please allow notifications in browser settings.",
        tone: "warning" as const
      };
    case "unsupported":
      return {
        title: "Not supported",
        description: "Push alerts are not supported on this browser.",
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
        description: "Turn on alerts for live updates.",
        tone: "neutral" as const
      };
  }
}

export function EnableAlertsButton({
  title = "Enable Alerts",
  description = "Turn on live updates.",
  compact = false
}: EnableAlertsButtonProps) {
  const [status, setStatus] = useState<AlertStatus>("checking");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastForegroundMessage, setLastForegroundMessage] = useState<string | null>(null);
  const [showIphoneTip, setShowIphoneTip] = useState(false);
  const [needsInstallFlow, setNeedsInstallFlow] = useState(false);
  const hasAttemptedSilentSync = useRef(false);

  useEffect(() => {
    let isActive = true;

    async function assessSupport() {
      const iphone = isLikelyIphone();
      const installed = isStandaloneMode();

      setShowIphoneTip(iphone);
      setNeedsInstallFlow(iphone && !installed);

      const supported =
        typeof window !== "undefined" &&
        window.isSecureContext &&
        "Notification" in window &&
        "serviceWorker" in navigator &&
        "PushManager" in window;

      if (!supported) {
        if (isActive) {
          setStatus("unsupported");
        }
        return;
      }

      if (iphone && !installed) {
        if (isActive) {
          setStatus("needs-install");
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
      if (isLikelyIphone() && !isStandaloneMode()) {
        setNeedsInstallFlow(true);
        setStatus("needs-install");
        return;
      }

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
    <div
      className={`space-y-4 ${
        compact
          ? ""
          : "rounded-[2rem] bg-[#0e2a3a]/72 p-5 text-white shadow-soft backdrop-blur sm:p-6"
      }`}
    >
      <div className="space-y-2">
        <h2 className="font-serif text-2xl text-[#f6d8a0]">{title}</h2>
        <p className="text-sm leading-6 text-white/78">{description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <button
          type="button"
          onClick={() => void enableAlerts(false)}
          disabled={status === "enabling"}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d9b169] px-5 py-3 text-sm font-semibold text-[#122f41] shadow-card transition hover:bg-[#e3bd79] focus:outline-none focus:ring-2 focus:ring-[#d9b169]/45 focus:ring-offset-2 focus:ring-offset-[#0f3144] disabled:cursor-not-allowed disabled:opacity-70 sm:flex-1"
        >
          {status === "enabling"
            ? "Enabling..."
            : status === "enabled"
              ? "Alerts Enabled"
              : "Enable Alerts"}
        </button>
        <a
          href="/event-info"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/14 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#0f3144] sm:flex-1"
        >
          View Event Info
        </a>
      </div>

      <div className="rounded-[1.6rem] bg-white/6 p-4 text-sm text-white/78">
        <p className="font-semibold uppercase tracking-[0.18em] text-[#f6d8a0]">
          Support
        </p>
        <p className="mt-2 leading-6">
          Best on Android Chrome. On iPhone, use Home Screen.
        </p>
      </div>

      <StatusCard
        title={statusCopy.title}
        description={statusCopy.description}
        tone={statusCopy.tone}
      />

      {lastForegroundMessage ? (
        <StatusCard
          title="Latest update"
          description={lastForegroundMessage}
          tone="success"
        />
      ) : null}

      {showIphoneTip ? (
        <IphoneInstructions compact={compact} requiresInstall={needsInstallFlow} />
      ) : null}
    </div>
  );
}
