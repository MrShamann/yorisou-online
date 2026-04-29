type BrandSigilProps = {
  label?: string;
  className?: string;
};

export default function BrandSigil({ label = "YORISOU", className = "" }: BrandSigilProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        aria-hidden="true"
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--line-sage)] bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.42)_22%,rgba(220,230,216,0.96)_100%)] shadow-[0_12px_22px_rgba(47,35,33,0.08)]"
      >
        <span className="absolute inset-y-2.5 left-1/2 w-px -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,rgba(180,106,72,0.12)_0%,rgba(85,98,82,0.84)_48%,rgba(180,106,72,0.12)_100%)]" />
        <span className="absolute bottom-3 h-1.5 w-1.5 rounded-full bg-[var(--seal-color)]" />
        <span className="absolute left-[10px] top-[10px] h-1.5 w-1.5 rounded-full bg-[rgba(85,98,82,0.55)]" />
        <span className="absolute right-[10px] top-[10px] h-1.5 w-1.5 rounded-full bg-[rgba(180,106,72,0.5)]" />
      </div>
      <div className="service-kicker text-[var(--accent-sage-text)]">{label}</div>
    </div>
  );
}
