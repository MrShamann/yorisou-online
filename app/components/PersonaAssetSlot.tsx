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
  home: { title: "公開ビジュアル", subtitle: "YORISOUの公開表示" },
  checkin: { title: "質問ビジュアル", subtitle: "答えやすい質問画面" },
  result: { title: "結果ビジュアル", subtitle: "結果を受け取る表示" },
  share: { title: "共有ビジュアル", subtitle: "共有しやすい表示" },
  oracle: { title: "余韻", subtitle: "静かな余韻の視覚" },
  question: { title: "質問ビジュアル", subtitle: "答えやすい表示" },
};

function paletteForPersonaId(personaId: string) {
  const palettes = [
    {
      outer: "from-[#f0d9c8] via-[#f7f0e6] to-[#dce8d9]",
      inner: "from-white/86 to-[#efe4d5]/82",
      line: "rgba(180,106,72,0.42)",
      ink: "rgba(47,35,33,0.94)",
      accent: "rgba(79,105,98,0.92)",
    },
    {
      outer: "from-[#dde8db] via-[#f7f2ea] to-[#ead7c8]",
      inner: "from-white/88 to-[#eef2e8]/82",
      line: "rgba(79,105,98,0.42)",
      ink: "rgba(45,30,25,0.94)",
      accent: "rgba(180,106,72,0.92)",
    },
    {
      outer: "from-[#ead8d0] via-[#f7f3ec] to-[#dbe4db]",
      inner: "from-white/88 to-[#f4ede0]/82",
      line: "rgba(120,84,61,0.38)",
      ink: "rgba(49,32,28,0.94)",
      accent: "rgba(86,104,94,0.92)",
    },
    {
      outer: "from-[#dce5d9] via-[#faf7f1] to-[#f0ddcf]",
      inner: "from-white/88 to-[#e8efe4]/82",
      line: "rgba(92,120,109,0.38)",
      ink: "rgba(46,30,27,0.94)",
      accent: "rgba(164,97,65,0.92)",
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
      return "共有表示";
    case "result":
      return "結果表示";
    case "checkin":
    case "question":
      return "質問表示";
    default:
      return "公開表示";
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
      className={`relative overflow-hidden rounded-[1.6rem] border border-[rgba(125,141,121,0.16)] bg-gradient-to-br ${palette.outer} shadow-[0_16px_34px_rgba(47,35,33,0.08)] ${className}`}
      data-persona-frame={surface}
      data-persona-asset-status={record.status}
      data-persona-asset-source={record.source}
      data-persona-id={record.personaId}
      aria-label={`${displayName} visual frame`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.08)_34%,transparent_56%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.38)_0%,rgba(255,255,255,0)_38%,rgba(47,35,33,0.05)_100%)]" />

      <div className={`${compact ? "px-3 py-3" : "px-4 py-4"} relative`}>
        <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] tracking-[0.18em] text-[var(--muted)]">{title}</div>
              <p className="mt-1 text-[13px] font-medium leading-5 text-[var(--accent-sage-text)]">{subtitle}</p>
            </div>
            <span className="rounded-full border border-[rgba(125,141,121,0.22)] bg-[rgba(255,253,249,0.84)] px-3 py-1 text-[10px] tracking-[0.12em] text-[var(--accent-sage-text)]">
            {visualBadge(surface)}
            </span>
          </div>

        <div className={`mt-3 rounded-[1.45rem] border border-[rgba(255,255,255,0.72)] bg-gradient-to-b ${palette.inner} p-3 shadow-[0_10px_22px_rgba(47,35,33,0.06)]`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] tracking-[0.16em] text-[var(--muted)]">RESULT</div>
              <p className="mt-1 text-[1.22rem] font-semibold leading-[1.06] text-[var(--text)]">{displayName}</p>
            </div>
            <div className="rounded-full border border-[rgba(125,141,121,0.18)] bg-white/78 px-3 py-1 text-[11px] tracking-[0.14em] text-[var(--accent-sage-text)]">
              {record.personaId}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
            <div className="relative min-h-[132px] overflow-hidden rounded-[1.2rem] border border-[rgba(125,141,121,0.15)] bg-[rgba(255,253,249,0.82)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.2)_34%,rgba(255,255,255,0)_64%)]" />
              <div className="absolute left-4 top-4 h-16 w-16 rounded-full border border-[rgba(125,141,121,0.18)] bg-[rgba(235,240,230,0.78)] shadow-[0_12px_24px_rgba(47,35,33,0.08)]">
                <div className="absolute inset-[18%] rounded-full border border-[rgba(125,141,121,0.26)]" />
                <div className="absolute inset-y-[22%] left-1/2 w-px -translate-x-1/2 bg-[rgba(86,104,94,0.72)]" />
                <div className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(180,106,72,0.18)]" />
              </div>
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
              <div>
                  <div className="text-[10px] tracking-[0.16em] text-[var(--muted)]">表示の安定</div>
                  <p className="mt-1 text-[12px] font-medium leading-5 text-[var(--accent-sage-text)]">
                    {surface === "share" ? "共有時も見え方が安定するよう整えています。" : "表示は安定して受け取れます。"}
                  </p>
                </div>
                <div className="rounded-full border border-[rgba(125,141,121,0.18)] bg-white/74 px-3 py-1 text-[10px] tracking-[0.14em] text-[var(--accent-sage-text)]">
                  {palette.accent === "rgba(180,106,72,0.92)" ? "あたたかい" : "やわらかい"}
                </div>
              </div>
            </div>

            <div className="flex w-[4.8rem] flex-col justify-between rounded-[1.2rem] border border-[rgba(125,141,121,0.15)] bg-[rgba(255,253,249,0.76)] px-3 py-3">
              <div className="rounded-full border border-[rgba(125,141,121,0.18)] bg-white/78 px-2 py-1 text-center text-[10px] tracking-[0.12em] text-[var(--accent-sage-text)]">
                表示
              </div>
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-[rgba(86,104,94,0.22)]" />
                <div className="h-2 rounded-full bg-[rgba(180,106,72,0.22)]" />
                <div className="h-2 rounded-full bg-[rgba(86,104,94,0.14)]" />
              </div>
              <div className="rounded-[0.9rem] border border-[rgba(125,141,121,0.12)] bg-[rgba(255,255,255,0.74)] px-2 py-2 text-center text-[10px] leading-4 text-[var(--muted)]">
                {record.mobileSafe ? "モバイル対応" : "要確認"}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-5 text-[var(--muted)]">公開表示は静かに整っています。</p>
      </div>
    </section>
  );
}
