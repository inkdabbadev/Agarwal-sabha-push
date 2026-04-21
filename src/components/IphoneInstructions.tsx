type IphoneInstructionsProps = {
  compact?: boolean;
};

export function IphoneInstructions({ compact = false }: IphoneInstructionsProps) {
  return (
    <div className="rounded-3xl border border-accent/20 bg-accent/10 p-4 text-sm text-foreground shadow-card">
      <p className="font-semibold text-primary">iPhone setup tip</p>
      <p className={`mt-2 leading-6 ${compact ? "text-sm" : "text-[0.95rem]"}`}>
        If you are using iPhone, add this website to your Home Screen and open it from
        there for the best notification support.
      </p>
    </div>
  );
}
