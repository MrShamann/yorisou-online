import type { ReactElement } from "react";
import type { SupportingSignals } from "@/lib/server/persistedSupportingSignals";

// CPC-1 Wave A — renders the SERVER-COMPUTED signal that was persisted at completion.
// Deliberately relative ("どのくらい強く出たか"), never an absolute score, and never a
// personality claim. Omitted entirely by the caller when the persisted payload is malformed.

export default function PersistedSupportingSignals({ data }: { data: SupportingSignals }): ReactElement {
  return (
    <section aria-labelledby="supporting-signals-h" className="surface-panel-soft space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p id="supporting-signals-h" className="surface-meta">今回つよく出た手がかり</p>
        <span className="text-[10px] tracking-[0.08em] text-[var(--muted)]">回答から算出</span>
      </div>
      <ul className="space-y-2">
        {data.signals.map((s) => (
          <li key={s.key} className="space-y-1">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] text-[var(--fg)]">{s.label}</span>
            </div>
            <div
              className="h-[6px] w-full overflow-hidden rounded-full bg-[rgba(23,59,53,0.10)]"
              role="img"
              aria-label={`${s.label}: 相対的な強さ ${Math.round(s.weight * 100)} パーセント`}
            >
              <div
                className="h-full rounded-full bg-[#4D7A69]"
                style={{ width: `${Math.max(4, Math.round(s.weight * 100))}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="text-[11px] leading-6 text-[var(--muted)]">
        強さは今回の回答の中での相対的な傾向です。点数や優劣ではありません。
      </p>
    </section>
  );
}
