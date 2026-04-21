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
      <div className="glass-card overflow-hidden p-5 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/70">
              Admin Broadcast Console
            </p>
            <h1 className="font-serif text-4xl text-primary sm:text-5xl">
              Send one clear message to every subscribed attendee
            </h1>
            <p className="text-base leading-7 text-foreground/76">
              This admin screen is intentionally simple for live event operations. Enter
              the admin password, compose a short announcement, and send it to every
              active subscription stored in Supabase.
            </p>

            <div className="rounded-[2rem] border border-accent/20 bg-accent/10 p-5 shadow-card">
              <h2 className="font-serif text-2xl text-primary">Broadcast notes</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground/78">
                <li>Keep titles short so they display cleanly on mobile notifications.</li>
                <li>Use the message field for concise operational instructions.</li>
                <li>Add an optional link to direct attendees to a page in this site.</li>
              </ul>
            </div>
          </section>

          <section className="rounded-[2rem] border border-primary/10 bg-white/85 p-5 shadow-soft">
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
                  Notification title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  maxLength={80}
                  className="field"
                  placeholder="Example: Programme starting in 10 minutes"
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
                  placeholder="Share the announcement attendees should see."
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, message: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="link" className="text-sm font-semibold text-primary">
                  Optional link
                </label>
                <input
                  id="link"
                  type="text"
                  className="field"
                  placeholder="/event-info or https://example.com"
                  value={form.link}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, link: event.target.value }))
                  }
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="button-primary w-full">
                {isSubmitting ? "Sending broadcast..." : "Send notification"}
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
                    Notification sent. Delivered attempts: {result.sent}. Failed attempts:{" "}
                    {result.failed}.
                    {typeof result.invalidated === "number"
                      ? ` Invalid tokens marked inactive: ${result.invalidated}.`
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
