"use client";
import { useEffect, useState } from "react";

// AIX-3C — Experience & Connect domain. All experience-card logic (create,
// AI-structure, visibility/consent, submit, own/discover, invite, feedback) is
// preserved verbatim; the surface is reframed into the dark product system with
// a low-pressure, private-by-default Connect framing. No fabricated activity.

type Card = { id: string; state_context: string; situation: string; action_tried: string; perceived_outcome: string; limitations: string; may_fit: string; may_not_fit: string; visibility: string; provenance: string; ai_assistance_status: string; moderation_status?: string; why_shown?: string };
type Form = { stateContext: string; situation: string; actionTried: string; perceivedOutcome: string; limitations: string; mayFit: string; mayNotFit: string; visibility: "PRIVATE" | "INVITE_ONLY" | "ANONYMOUS_SHARED" | "SIMILAR_STATE_ONLY"; previewConfirmed: boolean; aiAssistanceStatus: "none" | "accepted" | "rejected"; sourceSavedResultId?: string | null };
const empty: Form = { stateContext: "", situation: "", actionTried: "", perceivedOutcome: "", limitations: "", mayFit: "", mayNotFit: "", visibility: "PRIVATE", previewConfirmed: false, aiAssistanceStatus: "none", sourceSavedResultId: null };
const fields: Array<[keyof Form, string, string, number]> = [["stateContext", "今の状態や背景", "例: 少し疲れていて、急がず整えたい時期でした。", 1200], ["situation", "何が起きていたか", "個人や場所を特定できる情報は書かないでください。", 3000], ["actionTried", "試したこと", "自分が実際に試した行動を記します。", 3000], ["perceivedOutcome", "自分にはどう感じられたか", "効果の保証ではなく、自分の受け取り方として書きます。", 3000], ["limitations", "条件や限界", "合わなかった点、分からない点、前提を書きます。", 2000], ["mayFit", "合うかもしれない人・場面", "限定的な可能性として書きます。", 1200], ["mayNotFit", "合わないかもしれない人・場面", "無理に勧めないための境界を書きます。", 1200]];
function toForm(card: Card): Form { return { stateContext: card.state_context, situation: card.situation, actionTried: card.action_tried, perceivedOutcome: card.perceived_outcome, limitations: card.limitations, mayFit: card.may_fit, mayNotFit: card.may_not_fit, visibility: card.visibility as Form["visibility"], previewConfirmed: true, aiAssistanceStatus: card.ai_assistance_status as Form["aiAssistanceStatus"] }; }

export default function ExperienceHub() {
  const [form, setForm] = useState<Form>(empty), [own, setOwn] = useState<Card[]>([]), [discover, setDiscover] = useState<Card[]>([]), [preview, setPreview] = useState(false), [editing, setEditing] = useState<string | null>(null), [message, setMessage] = useState(""), [busy, setBusy] = useState(false);
  const load = async () => { const [a, b] = await Promise.all([fetch("/api/experiences"), fetch("/api/experiences?mode=discover")]); if (a.ok) setOwn((await a.json()).experiences); if (b.ok) setDiscover((await b.json()).experiences); };
  useEffect(() => { const source = new URLSearchParams(window.location.search).get("source"); Promise.resolve().then(() => { if (source) setForm(current => ({ ...current, sourceSavedResultId: source })); return load(); }).catch(() => setMessage("読み込みに失敗しました。")); }, []);
  const submit = async () => { setBusy(true); setMessage(""); const body = { ...form, previewConfirmed: preview && form.previewConfirmed }; const r = await fetch(editing ? `/api/experiences/${editing}` : "/api/experiences", { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); setBusy(false); if (!r.ok) { setMessage("内容、同意、または個人情報の可能性を確認してください。"); return; } setForm(empty); setPreview(false); setEditing(null); setMessage(form.visibility === "PRIVATE" ? "非公開の下書きを保存しました。" : "体験カードを共有しました。"); await load(); };
  const structure = async () => { setBusy(true); const r = await fetch("/api/experiences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "structure", card: form }) }); setBusy(false); if (!r.ok) { setMessage("今はAI整理を利用できません。元の文章は変わっていません。"); return; } const c = (await r.json()).candidate; setForm({ ...form, stateContext: c.stateContext, situation: c.situation, actionTried: c.actionTried, perceivedOutcome: c.perceivedOutcome, limitations: c.limitations, mayFit: c.mayFit, mayNotFit: c.mayNotFit, aiAssistanceStatus: "accepted" }); setMessage("AI整理案を反映しました。内容を確認し、自由に編集できます。"); };
  const action = async (id: string, value: string, extra: Record<string, unknown> = {}) => { await fetch("/api/experiences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: value === "report" || value === "block" ? value : "interact", id, value, idempotencyKey: crypto.randomUUID(), ...extra }) }); setMessage("反映しました。"); };
  const invite = async (id: string) => { const r = await fetch("/api/experiences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "invite", id }) }); if (!r.ok) return setMessage("招待リンクを作れませんでした。"); const data = await r.json(); setMessage(`${location.origin}/experiences/invite/${data.invite.token}（${new Date(data.invite.expiresAt).toLocaleDateString("ja-JP")}まで）`); };

  return (
    <main className="aix2">
      <section className="aix2-band aix2-band--tight">
        <div className="container">
          <div className="mx-auto max-w-[48rem]">
            <p className="aix2-eyebrow">つながる · Experience</p>
            <h1 className="aix2-band-title mt-3">体験を、静かに整理して届ける。</h1>
            <p className="aix2-lead mt-4">
              投稿の場ではなく、自分の体験を条件や限界と一緒に残す場所です。試したこと・感じ方・境界を、低圧力で。非公開が既定で、共有はあなたが選んだときだけ。実名・勤務先・住所・連絡先・他の人が分かる情報は含めないでください。
            </p>
          </div>
        </div>
      </section>

      <section className="aix2-band !pt-0">
        <div className="container">
          <div className="mx-auto max-w-[48rem]">
            <div className="aix2-glass p-5 sm:p-7">
              <p className="aix2-eyebrow">体験を書く</p>
              <div className="mt-5 grid gap-5">
                {fields.map(([key, label, hint, max]) => (
                  <label key={String(key)} className="block">
                    <span className="text-[13.5px] font-semibold text-[color:var(--tx)]">{label}</span>
                    <span className="mt-1 block text-[11.5px] leading-5 aix2-faint">{hint}</span>
                    <textarea value={String(form[key])} onChange={(e) => setForm({ ...form, [key]: e.target.value })} maxLength={max} className="mt-2 min-h-24 w-full rounded-[12px] border border-[var(--hair-2)] bg-[rgba(16,20,18,0.7)] p-3 text-[14px] leading-7 text-[color:var(--tx)] outline-none focus:border-[var(--jade)]" />
                  </label>
                ))}
              </div>

              <div className="mt-6 rounded-[12px] border border-[var(--hair)] bg-[rgba(126,224,182,0.05)] p-4">
                <p className="text-[13px] font-semibold text-[color:var(--tx)]">AIで文章を整理する（任意）</p>
                <p className="mt-1 text-[11.5px] leading-6 aix2-mut">選んだ下書きだけを整理し、個人を特定しやすい表現を減らします。事実の追加や自動公開はしません。</p>
                <button type="button" onClick={structure} disabled={busy} className="aix2-btn aix2-btn-ghost mt-3 !min-h-[40px] !text-[13px]">整理案を作る</button>
              </div>

              <label className="mt-6 block text-[13.5px] font-semibold text-[color:var(--tx)]">公開範囲
                <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as Form["visibility"], previewConfirmed: false })} className="mt-2 w-full rounded-[12px] border border-[var(--hair-2)] bg-[rgba(16,20,18,0.7)] p-3 text-[14px] text-[color:var(--tx)]">
                  <option value="PRIVATE">非公開（自分だけ）</option>
                  <option value="INVITE_ONLY">招待リンクだけ</option>
                  <option value="ANONYMOUS_SHARED">匿名で共有</option>
                  <option value="SIMILAR_STATE_ONLY">近い関心の人に限定表示</option>
                </select>
              </label>
              <p className="mt-2 text-[11.5px] leading-6 aix2-faint">初期値は非公開です。匿名共有でも安全確認のため内部では所有者との関係を保持します。公開検索や仮名プロフィールは有効にしません。</p>

              <button type="button" onClick={() => setPreview(true)} className="aix2-btn aix2-btn-ghost mt-5 !min-h-[44px] !text-[13px]">共有前の表示を確認</button>
              {preview ? (
                <div className="mt-5 aix2-panel p-5">
                  <p className="aix2-eyebrow">共有候補プレビュー</p>
                  <h2 className="mt-2 text-[18px] font-bold text-[color:var(--tx)]">{form.stateContext || "状態や背景"}</h2>
                  <p className="mt-3 text-[14px] leading-7 aix2-mut">{form.situation}</p>
                  <dl className="mt-4 grid gap-3 text-[14px] aix2-mut">
                    <div><dt className="font-semibold text-[color:var(--tx)]">試したこと</dt><dd>{form.actionTried}</dd></div>
                    <div><dt className="font-semibold text-[color:var(--tx)]">感じた結果</dt><dd>{form.perceivedOutcome}</dd></div>
                    <div><dt className="font-semibold text-[color:var(--tx)]">限界</dt><dd>{form.limitations}</dd></div>
                  </dl>
                  {form.visibility !== "PRIVATE" ? (
                    <label className="mt-5 flex gap-3 text-[13px] aix2-mut"><input type="checkbox" checked={form.previewConfirmed} onChange={(e) => setForm({ ...form, previewConfirmed: e.target.checked })} /><span>第三者の個人情報を含まず、この範囲で共有することに同意します。</span></label>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={submit} disabled={busy} className="aix2-btn aix2-btn-primary !min-h-[46px] !text-[14px]">{form.visibility === "PRIVATE" ? "下書きを保存" : "この範囲で共有"}</button>
                <button type="button" onClick={() => { setForm(empty); setEditing(null); setPreview(false); }} className="aix2-btn aix2-btn-ghost !min-h-[46px] !text-[13px]">下書きを破棄</button>
              </div>
              {message ? <p className="mt-4 text-[13px] aix2-mut" role="status">{message}</p> : null}
            </div>

            <section className="mt-10 aix2-hair-top pt-7">
              <h2 className="text-[18px] font-bold text-[color:var(--tx)]">自分の体験カード</h2>
              <div className="mt-4 grid gap-3">
                {own.length === 0 ? <p className="aix2-panel p-4 text-[13px] aix2-faint">まだ体験カードはありません。上の入力から、非公開の下書きとして残せます。</p> : own.map((card) => (
                  <article key={card.id} className="aix2-panel p-4">
                    <p className="font-semibold text-[color:var(--tx)]">{card.state_context}</p>
                    <p className="mt-1 text-[11.5px] aix2-faint">{card.visibility}・{card.provenance}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-[13px]">
                      <button onClick={() => { setEditing(card.id); setForm(toForm(card)); scrollTo({ top: 0, behavior: "smooth" }); }} className="aix2-link">編集</button>
                      {card.visibility === "INVITE_ONLY" ? <button onClick={() => invite(card.id)} className="aix2-link">招待リンクを作る</button> : null}
                      <button onClick={() => fetch(`/api/experiences/${card.id}`, { method: "DELETE" }).then(load)} className="aix2-link">取り下げ</button>
                      <button onClick={() => confirm("完全に削除しますか？") && fetch(`/api/experiences/${card.id}?mode=delete`, { method: "DELETE" }).then(load)} className="text-[#f2896c] underline">削除</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-10 aix2-hair-top pt-7">
              <h2 className="text-[18px] font-bold text-[color:var(--tx)]">今読める体験</h2>
              <p className="mt-2 text-[13px] aix2-mut">人気順ではなく、最大20件の有限な候補です。</p>
              <div className="mt-4 grid gap-4">
                {discover.length === 0 ? <p className="aix2-panel p-4 text-[13px] aix2-faint">今表示できる共有はありません。誰かが安全な範囲で共有すると、ここに少しずつ並びます。</p> : discover.map((card) => (
                  <article key={card.id} className="aix3-disc-card">
                    <p className="text-[11.5px] aix2-faint">{card.why_shown}</p>
                    <h3 className="mt-2 font-bold text-[color:var(--tx)]">{card.state_context}</h3>
                    <p className="mt-3 text-[14px] leading-7 aix2-mut">{card.situation}</p>
                    <p className="mt-3 text-[13.5px] aix2-mut"><b className="text-[color:var(--tx)]">試したこと:</b> {card.action_tried}</p>
                    <p className="mt-2 text-[13.5px] aix2-mut"><b className="text-[color:var(--tx)]">感じた結果:</b> {card.perceived_outcome}</p>
                    <p className="mt-2 text-[13.5px] aix2-mut"><b className="text-[color:var(--tx)]">限界:</b> {card.limitations}</p>
                    <p className="mt-3 text-[11.5px] aix2-faint">出所: {card.provenance === "ai_organized" ? "本人の文章をAIで整理" : "本人が作成"}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[["save", "保存"], ["try", "試す"], ["tried", "試した"], ["helpful", "役立った"], ["not_relevant", "今は違う"]].map(([v, l]) => (
                        <button key={v} onClick={() => action(card.id, v)} className="aix3-tag">{l}</button>
                      ))}
                      <button onClick={() => action(card.id, "report", { reason: "other" })} className="text-[12px] aix2-faint underline">報告</button>
                      <button onClick={() => action(card.id, "block")} className="text-[12px] aix2-faint underline">この提供元を非表示</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
