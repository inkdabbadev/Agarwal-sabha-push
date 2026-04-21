"use client";

import { useState } from "react";

import type { NotificationFormState, SendNotificationResult } from "@/types";

const initialState: NotificationFormState = {
  password: "",
  title: "",
  message: "",
  link: ""
};

export default function AdminPage() {
  const [form, setForm] = useState<NotificationFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SendNotificationResult | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = (await response.json()) as SendNotificationResult;

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to send the notification.");
      }

      setResult(data);
      setForm((current) => ({
        ...current,
        title: "",
        message: "",
        link: ""
      }));
    } catch (error) {
      setResult({
        ok: false,
        sent: 0,
        failed: 0,
        error: error instanceof Error ? error.message : "Unable to send the notification."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="section-shell py-6 sm:py-8">
      <div className="simple-shell p-5 sm:p-8">
        <div className="admin-layout">
          <section className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/70">
              Admin
            </p>
            <h1 className="font-serif text-4xl text-primary sm:text-5xl">
              Send a live update
            </h1>
            <p className="text-base leading-7 text-foreground/76">Send one message to everyone.</p>

            <div className="simple-section simple-section--light">
              <h2 className="font-serif text-2xl text-primary">Notes</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground/78">
                <li>Keep the title short.</li>
                <li>Keep the message clear.</li>
                <li>Link is optional.</li>
              </ul>
            </div>
          </section>

          <section className="simple-section simple-section--light">
            <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-primary">
                  Admin password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="field"
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-semibold text-primary">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  maxLength={80}
                  className="field"
                  placeholder="Stage update"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-primary">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  maxLength={240}
                  rows={5}
                  className="field resize-none"
                  placeholder="Programme begins in 10 minutes."
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, message: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="link" className="text-sm font-semibold text-primary">
                  Link
                </label>
                <input
                  id="link"
                  type="text"
                  className="field"
                  placeholder="/event-info"
                  value={form.link}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, link: event.target.value }))
                  }
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="button-primary w-full">
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </form>

            {result ? (
              <div
                className={`mt-5 rounded-3xl border p-4 text-sm shadow-card ${
                  result.ok
                    ? "border-success/20 bg-success/10 text-success"
                    : "border-danger/20 bg-danger/10 text-danger"
                }`}
                role="status"
                aria-live="polite"
              >
                {result.ok ? (
                  <p className="leading-6">
                    Sent. Delivered: {result.sent}. Failed: {result.failed}.
                    {typeof result.invalidated === "number"
                      ? ` Inactive tokens: ${result.invalidated}.`
                      : ""}
                  </p>
                ) : (
                  <p className="leading-6">{result.error}</p>
                )}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
