"use client";

import type { PersonaAssetRecord } from "@/lib/yorisou/assets/persona-asset-types";
import { getPersonaAssetRecord } from "@/lib/yorisou/assets/persona-asset-registry";

type Surface = "home" | "checkin" | "result" | "share" | "oracle" | "question";

type Props = {
  personaId?: string | null;
  officialPublicPersonaName?: string | null;
  surface: Surface;
  compact?: boolean;
  className?: string;
  label?: string;
};

const SURFACE_COPY: Record<Surface, { title: string; subtitle: string }> = {
  home: { title: "公開トップ", subtitle: "入口の見え方" },
  checkin: { title: "質問の見え方", subtitle: "答えやすい導線" },
  result: { title: "結果の見え方", subtitle: "結果をきれいに見せる" },
  share: { title: "共有カード", subtitle: "SNSで見せやすい見え方" },
  oracle: { title: "余韻", subtitle: "静かな一言の見え方" },
  question: { title: "質問の見え方", subtitle: "答えやすい導線" },
};

function paletteForPersonaId(personaId: string) {
  const palettes = [
    {
      outer: "from-[#0f1a18] via-[#253530] to-[#f2e8dc]",
      inner: "from-white/92 to-[#eef3ec]/86",
      line: "rgba(255,255,255,0.24)",
      ink: "rgba(18,20,19,0.96)",
      accent: "rgba(64,92,85,0.96)",
    },
    {
      outer: "from-[#15211d] via-[#2b3832] to-[#efe3d2]",
      inner: "from-white/92 to-[#f0f4ee]/86",
      line: "rgba(255,255,255,0.22)",
      ink: "rgba(21,24,24,0.96)",
      accent: "rgba(176,102,72,0.96)",
    },
    {
      outer: "from-[#101c18] via-[#31413a] to-[#e9e0d1]",
      inner: "from-white/92 to-[#eff4ec]/86",
      line: "rgba(255,255,255,0.22)",
      ink: "rgba(18,19,19,0.96)",
      accent: "rgba(89,119,108,0.96)",
    },
    {
      outer: "from-[#111a18] via-[#273731] to-[#f1e4d3]",
      inner: "from-white/92 to-[#edf3ea]/86",
      line: "rgba(255,255,255,0.22)",
      ink: "rgba(20,20,18,0.96)",
      accent: "rgba(164,97,65,0.96)",
    },
  ];
  let hash = 0;
  for (const char of personaId) {
    hash = Math.imul(31, hash) + char.charCodeAt(0);
    hash |= 0;
  }
  return palettes[Math.abs(hash) % palettes.length];
}

function visualBadge(surface: Surface) {
  switch (surface) {
    case "share":
      return "共有用";
    case "result":
      return "結果用";
    case "checkin":
    case "question":
      return "質問用";
    default:
      return "公開用";
  }
}

export default function PersonaAssetFrame({
  personaId = null,
  officialPublicPersonaName = null,
  surface,
  compact = false,
  className = "",
  label,
}: Props) {
  const record = getPersonaAssetRecord(personaId);
  if (!record) {
    return null;
  }

  const palette = paletteForPersonaId(record.personaId);
  const title = label || SURFACE_COPY[surface].title;
  const subtitle = SURFACE_COPY[surface].subtitle;
  const displayName = officialPublicPersonaName || record.officialPublicPersonaName;

  return (
    <section
      className={`relative overflow-hidden rounded-[1.6rem] border border-[rgba(36,45,43,0.12)] bg-gradient-to-br ${palette.outer} shadow-[0_16px_34px_rgba(47,35,33,0.12)] ${className}`}
      data-persona-frame={surface}
      data-persona-asset-status={record.status}
      data-persona-asset-source={record.source}
      data-persona-id={record.personaId}
      aria-label={`${displayName} visual frame`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.02)_34%,transparent_56%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_38%,rgba(47,35,33,0.08)_100%)]" />

      <div className={`${compact ? "px-3 py-3" : "px-4 py-4"} relative`}>
        <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] tracking-[0.18em] text-white/68">{title}</div>
              <p className="mt-1 text-[12px] font-medium leading-5 text-white/84">{subtitle}</p>
            </div>
            <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] tracking-[0.12em] text-white/88">
            {visualBadge(surface)}
            </span>
          </div>

        <div className={`mt-3 rounded-[1.35rem] border border-[rgba(255,255,255,0.74)] bg-gradient-to-b ${palette.inner} p-3 shadow-[0_10px_22px_rgba(47,35,33,0.06)]`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] tracking-[0.16em] text-[var(--muted)]">公開名</div>
              <p className="mt-1 text-[1.22rem] font-semibold leading-[1.06] text-[var(--text)]">{displayName}</p>
            </div>
            <div className="rounded-full border border-[rgba(36,45,43,0.12)] bg-white/82 px-3 py-1 text-[11px] tracking-[0.14em] text-[var(--accent-sage-text)]">
              {record.personaId}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
            <div className="relative min-h-[92px] overflow-hidden rounded-[1.15rem] border border-[rgba(36,45,43,0.12)] bg-[linear-gradient(180deg,rgba(12,18,17,0.96)_0%,rgba(33,45,42,0.96)_100%)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.2)_34%,rgba(255,255,255,0)_64%)]" />
              <div className="absolute left-4 top-4 h-14 w-14 rounded-full border border-white/18 bg-[rgba(255,255,255,0.08)] shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
                <div className="absolute inset-[18%] rounded-full border border-white/18" />
                <div className="absolute inset-y-[20%] left-1/2 w-px -translate-x-1/2 bg-[rgba(255,255,255,0.54)]" />
                <div className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(255,255,255,0.16)]" />
              </div>
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
              <div>
                  <div className="text-[10px] tracking-[0.16em] text-white/60">公開用</div>
                  <p className="mt-1 text-[11px] font-medium leading-5 text-white/84">
                    {surface === "share" ? "SNSで見せやすい共有カードとして整えています。" : "公開用の見え方として整えています。"}
                  </p>
                </div>
                <div className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] tracking-[0.14em] text-white/88">
                  {palette.accent === "rgba(180,106,72,0.92)" ? "あたたかい" : "すっきり"}
                </div>
              </div>
            </div>

            <div className="flex w-[4.4rem] flex-col justify-between rounded-[1.2rem] border border-[rgba(36,45,43,0.12)] bg-[rgba(255,255,255,0.86)] px-2.5 py-2.5">
              <div className="rounded-full border border-[rgba(36,45,43,0.12)] bg-[rgba(235,241,234,0.86)] px-2 py-1 text-center text-[10px] tracking-[0.12em] text-[var(--accent-sage-text)]">
                見せやすい
              </div>
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-[rgba(36,45,43,0.18)]" />
                <div className="h-2 rounded-full bg-[rgba(88,121,112,0.28)]" />
                <div className="h-2 rounded-full bg-[rgba(36,45,43,0.12)]" />
              </div>
              <div className="rounded-[0.9rem] border border-[rgba(36,45,43,0.12)] bg-[rgba(245,248,244,0.92)] px-2 py-2 text-center text-[10px] leading-4 text-[var(--muted)]">
                {record.mobileSafe ? "見せやすい" : "整え中"}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-5 text-[var(--muted)]">公開カードとして、見せやすく整えています。</p>
      </div>
    </section>
  );
}
