"use client";

import { useState } from "react";

type Item = {
  id: string;
  rank: number;
  object_type: string;
  reason: string;
  disclosure: string;
  yorisou_resources?: { title: string; description: string; resource_type: string; source_url?: string; internal_route?: string; commercial_status: string; limitations: string };
  yorisou_experience_cards?: { state_context: string; situation: string; limitations: string; provenance: string };
};
type Data = { set: { id: string }; items: Item[] };

// AIX-3C — Discover graph as a user-facing discovery experience. The candidate
// set is presented as an explainable, controllable list (the accessible list
// fallback for the relational "graph"): each item shows why it relates to the
// current state, its type, and reversible controls. Fetch / act / return logic
// is preserved verbatim; no ranking change; no provider calls.
const ACTIONS: ReadonlyArray<[string, string]> = [
  ["saved", "保存"],
  ["try_intent", "試してみる"],
  ["tried", "試した"],
  ["helpful", "役立った"],
  ["not_relevant", "今は合わない"],
  ["hidden", "表示しない"],
];

function typeLabel(item: Item): string {
  if (item.object_type === "experience_card") return "体験";
  const t = item.yorisou_resources?.resource_type;
  const map: Record<string, string> = {
    action: "小さな一歩",
    content: "読みもの",
    article: "記事",
    tool: "道具",
    app: "アプリ",
    place: "場所",
    public_resource: "公共の情報",
    service: "サービス",
    product: "プロダクト",
    book: "本",
    podcast: "ポッドキャスト",
  };
  return (t && (map[t] ?? t)) || "リソース";
}

function commercialLabel(status?: string): string | null {
  if (!status) return null;
  const map: Record<string, string> = { non_commercial: "非商用", free: "無料", paid: "有料", affiliate: "提携", prototype: "プロトタイプ", concept: "コンセプト" };
  return map[status] ?? status;
}

export default function RecommendationGraphView() {
  const [data, setData] = useState<Data | null>(null);
  const [tag, setTag] = useState("整える");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setMessage("候補を整理しています。");
    const r = await fetch("/api/recommendations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stateTags: [tag], source: "private_state", idempotencyKey: crypto.randomUUID() }) });
    setLoading(false);
    if (!r.ok) return setMessage("今は候補を作れませんでした。");
    setData(await r.json());
    setMessage("");
  };
  const act = async (id: string, action: string, reason?: string) => {
    await fetch(`/api/recommendations/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reason ? { action: "report", reason } : { action, idempotencyKey: crypto.randomUUID() }) });
    setMessage("反映しました。");
  };

  return (
    <main className="aix2">
      <section className="aix2-band aix2-band--tight">
        <div className="container">
          <div className="mx-auto max-w-[46rem]">
            <p className="aix2-eyebrow">見つける · 関連マップ</p>
            <h1 className="aix2-band-title mt-3">今の状態と、つながる候補。</h1>
            <p className="aix2-lead mt-4">
              今の状態に近い言葉から、関連する候補を並べます。それぞれに「なぜ表示されたか」を添えています。命令ではなく、合わないときは選べます。表示順は買えません。ここに並ぶのは、科学的な断定ではなく、関連の手がかりです。
            </p>
            <div className="aix2-glass mt-7 p-5 sm:p-6">
              <label className="block text-[13px] font-semibold text-[color:var(--tx)]">
                今の状態に近い言葉
                <input
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  maxLength={80}
                  className="mt-2 w-full rounded-[12px] border border-[var(--hair-2)] bg-[rgba(16,20,18,0.7)] px-4 py-3 text-[15px] text-[color:var(--tx)] outline-none focus:border-[var(--jade)]"
                />
              </label>
              <button onClick={load} disabled={loading} className="aix2-btn aix2-btn-primary mt-4 !min-h-[48px] disabled:opacity-60">
                {loading ? "整理しています…" : "関連する候補を見る"}
              </button>
              {message ? <p className="mt-3 text-[13px] aix2-mut" role="status">{message}</p> : null}
              <p className="mt-3 text-[12px] aix2-faint">キーボードだけでも操作できます。候補は最大5件の任意のリストです。</p>
            </div>
          </div>
        </div>
      </section>

      {data ? (
        <section className="aix2-band !pt-0">
          <div className="container">
            <div className="mx-auto max-w-[46rem]">
              <p className="text-[13px] aix2-faint">ここで候補は終わりです。状態を更新して、もう一度見直せます。</p>
              <ul className="mt-5 grid gap-4">
                {data.items.map((item) => {
                  const resource = item.yorisou_resources;
                  const card = item.yorisou_experience_cards;
                  const title = resource?.title || card?.state_context || "体験";
                  const commercial = commercialLabel(resource?.commercial_status);
                  return (
                    <li key={item.id} className="aix3-disc-card">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="aix3-chip">{typeLabel(item)}</span>
                        {commercial ? <span className="aix3-chip">{commercial}</span> : null}
                      </div>
                      <h2 className="mt-3 text-[17px] font-bold text-[color:var(--tx)]">{title}</h2>
                      <p className="mt-2 text-[14px] leading-7 aix2-mut">{resource?.description || card?.situation}</p>
                      <div className="mt-3 rounded-[12px] border border-[var(--hair)] bg-[rgba(126,224,182,0.04)] px-4 py-3">
                        <p className="text-[11px] font-semibold tracking-[0.1em] text-[color:var(--jade-bright)]">今の状態とのつながり</p>
                        <p className="mt-1 text-[12.5px] leading-6 aix2-mut">{item.reason}</p>
                        <p className="mt-1 text-[12px] leading-6 aix2-faint">{item.disclosure}</p>
                        <p className="mt-1 text-[12px] leading-6 aix2-faint">限界: {resource?.limitations || card?.limitations}</p>
                      </div>
                      {resource?.source_url ? (
                        <a href={resource.source_url} target="_blank" rel="noreferrer" onClick={() => act(item.id, "resource_opened")} className="mt-3 inline-block text-[13px] aix2-link">提供元を開く →</a>
                      ) : resource?.internal_route ? (
                        <a href={resource.internal_route} onClick={() => act(item.id, "resource_opened")} className="mt-3 inline-block text-[13px] aix2-link">YORISOUで試す →</a>
                      ) : null}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {ACTIONS.map(([a, label]) => (
                          <button key={a} onClick={() => act(item.id, a)} className="aix3-tag">{label}</button>
                        ))}
                        <button onClick={() => act(item.id, "reported", "other")} className="text-[12px] aix2-faint underline">報告</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={() =>
                  fetch("/api/recommendations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "return", setId: data.set.id, when: "three_days" }) }).then(() => setMessage("3日後にWebから見返せます。通知は送りません。"))
                }
                className="aix2-btn aix2-btn-ghost mt-6 !min-h-[44px] !text-[13px]"
              >
                3日後に見返す
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
