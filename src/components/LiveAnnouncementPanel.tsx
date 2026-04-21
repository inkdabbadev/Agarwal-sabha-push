"use client";

import { useEffect, useState } from "react";

import type { Announcement } from "@/types";

type LiveAnnouncementPanelProps = {
  compact?: boolean;
};

type LatestAnnouncementResponse = {
  ok: boolean;
  announcement: Announcement | null;
};

function formatAnnouncementTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function LiveAnnouncementPanel({ compact = false }: LiveAnnouncementPanelProps) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadLatestAnnouncement(showRefreshingState: boolean) {
      if (showRefreshingState) {
        setIsRefreshing(true);
      }

      try {
        const response = await fetch("/api/latest-announcement", {
          method: "GET",
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Unable to load update.");
        }

        const data = (await response.json()) as LatestAnnouncementResponse;

        if (!isActive) {
          return;
        }

        setAnnouncement(data.announcement);
        setError(null);
      } catch (fetchError) {
        if (!isActive) {
          return;
        }

        setError(
          fetchError instanceof Error ? fetchError.message : "Unable to load update."
        );
      } finally {
        if (!isActive) {
          return;
        }

        setIsLoading(false);
        setIsRefreshing(false);
      }
    }

    void loadLatestAnnouncement(false);

    const intervalId = window.setInterval(() => {
      void loadLatestAnnouncement(true);
    }, 10000);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <section
      className={`rounded-[2rem] bg-[#102d3f]/76 p-5 text-white shadow-soft backdrop-blur ${
        compact ? "" : ""
      }`}
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f6d8a0]">
            Live update
          </p>
          <h2 className="mt-3 font-serif text-2xl text-white">
            {announcement ? announcement.title : "No updates yet"}
          </h2>
        </div>
        <div className="rounded-full bg-white/8 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/72">
          {isRefreshing ? "Refreshing" : "Live"}
        </div>
      </div>

      {isLoading ? (
        <p className="mt-4 text-sm leading-7 text-white/75">Loading latest update.</p>
      ) : error ? (
        <p className="mt-4 text-sm leading-7 text-[#ffd7d7]">{error}</p>
      ) : announcement ? (
        <>
          <p className="mt-4 text-sm leading-7 text-white/82">{announcement.message}</p>
          <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-white/62">
              {formatAnnouncementTime(announcement.created_at)}
            </p>
            {announcement.link ? (
              <a
                href={announcement.link}
                className="inline-flex items-center gap-2 font-semibold text-[#f6d8a0]"
              >
                Open page
                <span aria-hidden="true">-&gt;</span>
              </a>
            ) : null}
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm leading-7 text-white/75">
          Keep this page open for live updates.
        </p>
      )}

      <p className="mt-4 text-xs leading-6 text-white/55">
        Auto-refreshes while the page is open.
      </p>
    </section>
  );
}
