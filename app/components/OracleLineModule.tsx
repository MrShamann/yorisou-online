import type { OracleLineRecord } from "@/lib/yorisou/dte/oracle/oracle-line-types";

type Props = {
  record: OracleLineRecord | null;
  fallback?: {
    oracleId?: string | null;
    currentMode?: string | null;
    oracleLine: string;
    interpretation: string;
    lifeMapping: string;
    smallAdjustment: string;
  } | null;
};

export default function OracleLineModule({ record, fallback = null }: Props) {
  const source = record || fallback;
  if (!source) {
    return null;
  }

  return (
    <section
      className="overflow-hidden rounded-[1.55rem] border border-[rgba(125,141,121,0.18)] bg-[linear-gradient(180deg,rgba(255,252,247,0.98)_0%,rgba(237,230,216,0.96)_100%)] px-4 py-4 shadow-[0_16px_32px_rgba(47,35,33,0.08)]"
      data-oracle-line-module
      data-oracle-id={record?.oracleId || fallback?.oracleId || "fallback-aftertaste"}
      data-oracle-status={record?.status || "fallback"}
      data-persona-id={record?.personaId || "fallback"}
      data-current-mode={record?.currentMode || fallback?.currentMode || "fallback"}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] tracking-[0.18em] text-[var(--muted)]">余韻の一文</div>
          <p className="mt-1 text-[12px] font-medium leading-5 text-[var(--accent-sage-text)]">結果のあとに、もう半歩だけ残る言葉。</p>
        </div>
        <span className="rounded-full border border-[rgba(125,141,121,0.18)] bg-[rgba(255,253,249,0.86)] px-3 py-1 text-[10px] tracking-[0.14em] text-[var(--accent-sage-text)]">
          aftertaste
        </span>
      </div>
      <p className="mt-3 text-[1.02rem] font-semibold leading-7 text-[var(--text)]" data-oracle-line={source.oracleLine}>
        {source.oracleLine}
      </p>

      <div className="mt-4 grid gap-3">
        <div>
          <div className="text-[10px] tracking-[0.18em] text-[var(--muted)]">この一文の解き</div>
          <p className="mt-1 text-[13px] leading-6 text-[var(--muted)]" data-oracle-interpretation={source.interpretation}>
            {source.interpretation}
          </p>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.18em] text-[var(--muted)]">生活に出るところ</div>
          <p className="mt-1 text-[13px] leading-6 text-[var(--muted)]" data-oracle-life-mapping={source.lifeMapping}>
            {source.lifeMapping}
          </p>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.18em] text-[var(--muted)]">今日の小さな調整</div>
          <p className="mt-1 text-[13px] leading-6 text-[var(--accent-sage-text)]" data-oracle-small-adjustment={source.smallAdjustment}>
            {source.smallAdjustment}
          </p>
        </div>
      </div>

      <details className="mt-4 rounded-[1.1rem] border border-[rgba(125,141,121,0.1)] bg-[rgba(255,255,255,0.7)] px-3 py-2.5">
        <summary className="cursor-pointer text-[11px] tracking-[0.12em] text-[var(--muted)]">解きと補足をひらく</summary>
        {record ? (
          <>
            <p className="mt-2 text-[12px] leading-6 text-[var(--accent-sage-text)]" data-oracle-free-result-preview={record.freeResultPreview}>
              {record.freeResultPreview}
            </p>
            <p className="mt-2 text-[11px] leading-5 text-[var(--muted)]" data-paid-expansion-seed={record.paidExpansionSeed}>
              {record.paidExpansionSeed}
            </p>
          </>
        ) : (
          <p className="mt-2 text-[12px] leading-6 text-[var(--accent-sage-text)]">
            この余韻は、結果の輪郭をやわらかく受け取るための入口です。
          </p>
        )}
      </details>
    </section>
  );
}
