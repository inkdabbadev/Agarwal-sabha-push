import type { ReactNode } from "react";

import type { StatusTone } from "@/types";

type StatusCardProps = {
  title: string;
  description: string;
  tone?: StatusTone;
  icon?: ReactNode;
};

const toneClasses: Record<StatusTone, string> = {
  neutral: "border-primary/10 bg-white/85 text-foreground",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  danger: "border-danger/20 bg-danger/10 text-danger"
};

export function StatusCard({
  title,
  description,
  tone = "neutral",
  icon
}: StatusCardProps) {
  return (
    <div
      className={`rounded-3xl border px-4 py-4 shadow-card backdrop-blur ${toneClasses[tone]}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon ?? (
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
            </svg>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary/80">
            {title}
          </p>
          <p className="text-sm leading-6 text-current/90">{description}</p>
        </div>
      </div>
    </div>
  );
}
