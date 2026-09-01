/**
 * CORP-v1.2R2.1 — where each venture actually sits in the Foundry sequence.
 *
 * `reached` is an index into `foundry.stages` (01 仮説 · 02 証拠 · 03 事業設計 · 04 構築 ·
 * 05 事業として立つ状態 · 06 創業チームの組成 · 07 独立・運営 · 08 学習). It is set from each
 * venture's own repository evidence and nothing else — no roadmap, no intention, no rounding up.
 *
 * There is deliberately no percentage anywhere. A venture is at a named stage or it is not, and a
 * number would imply a precision the evidence cannot support.
 */
export const VENTURE_FORMATION: Record<string, number> = {
  /**
   * Mirai Move — 4 (through 構築).
   * A public site is live and the research system runs unattended, so building is genuinely done
   * and operating. It is NOT 5: nothing has ever left the system — outreach, replies, deliveries
   * and payments are all verified zero — so it has not reached a state another party could pick up
   * and run.
   */
  "/mirai-move": 4,
  /**
   * Kakari — 4 (through 構築).
   * Web and mobile surfaces are built. Its own positioning states plainly that it is "a
   * private-testing MVP, not a public product: no deployment, no provider/domain, no customers, no
   * revenue", and Production holds zero users, so it stops at the same place for a different reason.
   */
  "/kakari": 4,
  /**
   * Chigamo — 1 (仮説 only).
   * Concept stage with no canonical source, no product, no users and no municipal programme. The
   * hypothesis exists; nothing beyond it has been tested.
   */
  "/chigamo": 1,
};
