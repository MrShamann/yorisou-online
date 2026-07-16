"use client";

import { useEffect, useState } from "react";

import { CANDIDATE_ALLOWED_TRANSITIONS, CANDIDATE_STATUS_LABEL, type CandidateSubmissionStatus } from "@/lib/candidate-intake/stateMachine";

type Org = {
  id: string;
  display_name: string;
  source_type: string;
  external_domain: string | null;
  commercial_relationship: string;
  lifecycle_status: string;
};
type Submission = {
  id: string;
  organization_id: string;
  status: CandidateSubmissionStatus;
  submission_channel: string;
  submitter_type: string;
  provenance: string;
  commercial_relationship: string;
  related_project_disclosure: string | null;
  conflict_of_interest_disclosure: string | null;
  consent_status: string;
  retention_category: string;
  retention_deadline: string | null;
  status_reason: string | null;
  external_ref: string | null;
};
type EventRow = { id: string; event_type: string; actor: string; reason: string | null; previous_state: string | null; new_state: string | null; created_at: string };

export default function CandidateReviewView() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Pure fetch (no setState) so effects/handlers only touch state after await.
  async function fetchCandidates(): Promise<{ organizations: Org[]; submissions: Submission[] } | null> {
    const r = await fetch("/api/admin/candidates");
    if (!r.ok) return null;
    return (await r.json()) as { organizations: Org[]; submissions: Submission[] };
  }

  async function load() {
    const data = await fetchCandidates();
    if (!data) {
      setMessage("この画面を表示する権限がありません。");
      setLoaded(true);
      return;
    }
    setOrgs(data.organizations);
    setSubs(data.submissions);
    setLoaded(true);
  }

  useEffect(() => {
    let active = true;
    void (async () => {
      const data = await fetchCandidates();
      if (!active) return;
      if (!data) {
        setMessage("この画面を表示する権限がありません。");
        setLoaded(true);
        return;
      }
      setOrgs(data.organizations);
      setSubs(data.submissions);
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const openSubmission = async (submission: Submission) => {
    setSelected(submission);
    const r = await fetch(`/api/admin/candidates/${submission.id}`);
    if (r.ok) setEvents(((await r.json()) as { events: EventRow[] }).events);
  };

  const transition = async (submission: Submission, toStatus: CandidateSubmissionStatus) => {
    const materialTargets: CandidateSubmissionStatus[] = ["needs_information", "accepted_for_evaluation", "rejected", "withdrawn", "archived"];
    let reason: string | null = null;
    if (materialTargets.includes(toStatus)) {
      reason = window.prompt("この判断の理由を入力してください（必須）");
      if (!reason || reason.trim().length === 0) {
        setMessage("理由が必要です。操作を中止しました。");
        return;
      }
    }
    const r = await fetch(`/api/admin/candidates/${submission.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toStatus, reason }),
    });
    setMessage(r.ok ? "更新しました。" : "この遷移はできません（状態遷移ルール／理由必須）。");
    await load();
    if (r.ok) await openSubmission({ ...submission, status: toStatus });
  };

  const orgName = (id: string) => orgs.find((o) => o.id === id)?.display_name ?? id.slice(0, 8);

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="container py-10">
        <section className="mx-auto max-w-[64rem] rounded-2xl bg-white p-6">
          <p className="service-kicker">Internal · Candidate Intake (CIF-1)</p>
          <h1 className="mt-2 text-3xl font-semibold">候補の受理・審査（非公開・内部専用）</h1>
          <p className="mt-2 text-sm text-[#5F5750]">
            これは内部の記録・審査のみのための画面です。「評価キューに受理」は承認・推奨・検証・安全性の保証ではありません。
            推薦エンジン、公開面、購入導線とは無関係です。
          </p>
          {message ? <p className="mt-3 text-sm text-[#315F50]">{message}</p> : null}

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="font-semibold">候補組織（{orgs.length}）</h2>
              <div className="mt-3 grid gap-2">
                {orgs.map((o) => (
                  <div key={o.id} className="rounded-xl border p-3 text-sm">
                    <p className="font-semibold">{o.display_name}</p>
                    <p className="mt-1 text-xs text-[#7A7068]">
                      種別: {o.source_type}・関係: {o.commercial_relationship}
                      {o.external_domain ? `・${o.external_domain}` : ""}
                    </p>
                  </div>
                ))}
                {loaded && orgs.length === 0 ? <p className="text-sm text-[#7A7068]">候補組織はまだありません。</p> : null}
              </div>
            </div>

            <div>
              <h2 className="font-semibold">提出（{subs.length}）</h2>
              <div className="mt-3 grid gap-2">
                {subs.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => openSubmission(s)}
                    className="rounded-xl border p-3 text-left text-sm hover:bg-[#F7FBF8]"
                  >
                    <p className="font-semibold">{orgName(s.organization_id)}</p>
                    <p className="mt-1 text-xs text-[#7A7068]">
                      状態: {CANDIDATE_STATUS_LABEL[s.status]}・経路: {s.submission_channel}・関係: {s.commercial_relationship}
                    </p>
                  </button>
                ))}
                {loaded && subs.length === 0 ? <p className="text-sm text-[#7A7068]">提出はまだありません。</p> : null}
              </div>
            </div>
          </div>

          {selected ? (
            <div className="mt-8 rounded-2xl border border-[rgba(23,59,53,0.14)] p-5">
              <h2 className="font-semibold">提出の詳細</h2>
              <dl className="mt-3 grid gap-1 text-sm">
                <div><dt className="inline font-semibold">状態: </dt><dd className="inline">{CANDIDATE_STATUS_LABEL[selected.status]}</dd></div>
                <div><dt className="inline font-semibold">来歴: </dt><dd className="inline">{selected.provenance}</dd></div>
                <div><dt className="inline font-semibold">商業的関係: </dt><dd className="inline">{selected.commercial_relationship}</dd></div>
                <div><dt className="inline font-semibold">関連プロジェクト開示: </dt><dd className="inline">{selected.related_project_disclosure ?? "—"}</dd></div>
                <div><dt className="inline font-semibold">利益相反開示: </dt><dd className="inline">{selected.conflict_of_interest_disclosure ?? "—"}</dd></div>
                <div><dt className="inline font-semibold">同意状態: </dt><dd className="inline">{selected.consent_status}</dd></div>
                <div><dt className="inline font-semibold">保持区分: </dt><dd className="inline">{selected.retention_category}{selected.retention_deadline ? `（期限 ${new Date(selected.retention_deadline).toLocaleDateString("ja-JP")}）` : ""}</dd></div>
                <div><dt className="inline font-semibold">直近の判断理由: </dt><dd className="inline">{selected.status_reason ?? "—"}</dd></div>
              </dl>

              <div className="mt-4">
                <p className="text-xs font-semibold tracking-[0.08em] text-[#49615B]">状態遷移</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(CANDIDATE_ALLOWED_TRANSITIONS[selected.status] ?? []).map((to) => (
                    <button
                      key={to}
                      type="button"
                      onClick={() => transition(selected, to)}
                      className="rounded-full border px-3 py-1.5 text-xs font-semibold hover:-translate-y-0.5"
                    >
                      {CANDIDATE_STATUS_LABEL[to]}
                    </button>
                  ))}
                  {(CANDIDATE_ALLOWED_TRANSITIONS[selected.status] ?? []).length === 0 ? (
                    <span className="text-xs text-[#7A7068]">これ以上の遷移はありません。</span>
                  ) : null}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold tracking-[0.08em] text-[#49615B]">監査履歴</p>
                <ul className="mt-2 grid gap-1 text-xs text-[#5F5750]">
                  {events.map((e) => (
                    <li key={e.id}>
                      {new Date(e.created_at).toLocaleString("ja-JP")}・{e.event_type}
                      {e.previous_state ? `（${e.previous_state}→${e.new_state}）` : ""}
                      {e.reason ? `・理由: ${e.reason}` : ""}
                    </li>
                  ))}
                  {events.length === 0 ? <li>履歴はまだありません。</li> : null}
                </ul>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
