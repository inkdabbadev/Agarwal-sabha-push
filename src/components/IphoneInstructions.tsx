type IphoneInstructionsProps = {
  compact?: boolean;
  requiresInstall?: boolean;
};

export function IphoneInstructions({
  compact = false,
  requiresInstall = false
}: IphoneInstructionsProps) {
  return (
    <div className="rounded-[1.6rem] bg-[#f7efd8]/90 p-4 text-sm text-[#3f3123] shadow-card">
      <p className="font-semibold uppercase tracking-[0.18em] text-[#7e5c1e]">
        iPhone
      </p>
      <p className={`mt-2 leading-6 ${compact ? "text-sm" : "text-[0.95rem]"}`}>
        Add this site to Home Screen for alerts.
      </p>
      {requiresInstall ? (
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6">
          <li>Open in Safari.</li>
          <li>Add to Home Screen.</li>
          <li>Open the app and enable alerts.</li>
        </ol>
      ) : null}
    </div>
  );
}
