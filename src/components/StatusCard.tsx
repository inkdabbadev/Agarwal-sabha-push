import type { ReactNode } from "react";

import type { StatusTone } from "@/types";

type StatusCardProps = {
  title: string;
  description: string;
  tone?: StatusTone;
  icon?: ReactNode;
};

const toneClasses: Record<StatusTone, string> = {
  neutral: "bg-white/8 text-white",
  success: "bg-[#173e32]/70 text-[#d4f2e3]",
  warning: "bg-[#5c4520]/55 text-[#ffe6b4]",
  danger: "bg-[#581f27]/65 text-[#ffd7d7]"
};

export function StatusCard({
  title,
  description,
  tone = "neutral",
  icon
}: StatusCardProps) {
  return (
    <div
      className={`rounded-3xl px-4 py-4 shadow-card backdrop-blur ${toneClasses[tone]}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-[#f1d49d]">
          {icon ?? (
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
            </svg>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-current/90">
            {title}
          </p>
          <p className="text-sm leading-6 text-current/90">{description}</p>
        </div>
      </div>
    </div>
  );
}
