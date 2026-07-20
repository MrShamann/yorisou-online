# MTF-2A — Structured Production Loop Record (§12)

The seven roles were executed sequentially over the draft package; each pass's material findings and resolutions are recorded. Normal editorial refinement did NOT stop for Founder micro-review; only genuinely unresolved decisions appear in the final section.

| Role | Material findings → resolutions |
|---|---|
| **Producer** | Complete drafts of both packages (state schema + ack system + full copy; 7 dims + 48 items + scoring + 8 results + report outline + both JSONs). |
| **Originality editor** | (1) First-draft values dimensions included 「達成」 and 「承認」 as separate axes — cut: the pair drifted toward a motivational-goal structure resembling external circumplex models; folded into のびしろの手応え/役に立つ実感, keeping the model decision-context-derived. (2) Verified no item is an abstract self-rating (the alignable form); all 48 are situation trade-offs. (3) Daily option sets checked against common tracker vocabularies; ぐるぐる/余白/充電 framing confirmed original in combination. |
| **Japanese mobile editor** | Rewrites E-1..E-8 (see `MTF2A_JAPANESE_EDITORIAL_REVIEW.md`); all prompts verified single-screen at 390px; option labels ≤ 18 chars. |
| **Scoring/method reviewer** | (1) Verified exposure counts (14/13/14/14/13/14/14 = 96 slots = 48×2) and denominator normalization. (2) Caught a draft defect: the mixed rule originally used gap < 0.08 alone — with 13-14 appearances a single answer moves win-rate by ~0.07, making MIXED over-trigger; added the head-to-head-tied conjunct. (3) Verified every result reachable: each dimension can win (14 max wins available ≥ any competitor), and MIXED reachable via deep tie or low coverage. (4) Verified ack cascade totality: 13 rules cover all input combinations (default catches all) and every ackId exists. |
| **Trust-risk reviewer** | Findings + escalations E-1/E-2 (see `MTF2A_TRUST_RISK_REVIEW.md`); confirmed structural share boundaries in both JSONs. |
| **Differentiation reviewer** | (1) Two near-duplicate value items removed and re-authored during production: a second 週末 stem for tsunagari–jikkan duplicated Q15's contrast (→ Q45 rewritten around 知らない場), and an early anshin–totonoi draft repeated the 日曜夕方 frame (→ Q26 moved to 新生活). (2) Result-copy sweep: no two results share bullets, next-steps, or overlooked-need sentences; VAL_R_ANSHIN vs VAL_R_TOTONOI deliberately separated (見通し vs リズム) at both name and copy level. (3) Daily acks: 13 entries verified mutually distinct in content and function. |
| **Package lead** | Resolved the one producer/reviewer conflict (mixed-rule strictness — adopted the reviewer's conjunct rule); confirmed ONE canonical candidate per method (no unresolved alternatives ship in the JSONs). |

## Forge 20-step completion matrix (both methods)

Steps 1–4 (need/source/rights/pattern): originality register · Step 5 (benchmark): benchmark docs · Step 6 (naming): specs + collision sweep · Steps 7–9 (dimensions/structure/options): specs + bank (daily: state schema in lieu of dimensions per result model) · Step 10 (execution-model artifact): scoring v1 / recording model · Step 11 (result model): result-model benchmark + variant artifacts · Steps 12–13 (free copy/deep output): copy system + result copy + report outline / timeline experience · Step 14 (tags): governed tag sets · Step 15 (localization): editorial review · Step 16 (public/private): structural boundaries in JSONs · Step 17 (repeat design): retest/cadence copy · Step 18 (trust-risk): trust-risk review · Step 19 (engine mapping): JSON contracts per MTF-1.3 · **Step 20 (Founder review): PENDING — this package's deliverable state.**

## Genuinely unresolved Founder decisions (only these)

| # | Decision |
|---|---|
| FD-1 | **Product names**: 「きょうの空模様」 and 「いま大事にしたいことチェック」 are authored candidates — Founder may rename before implementation (naming is brand identity). |
| FD-2 | **Escalation E-1**: whether sustained-low-state daily patterns should ever surface a gentle-resources pointer (crisis-adjacent policy; requires its own reviewed package if approved). |
| FD-3 | **Escalation E-2**: anti-employment-screening terms-of-use clause for values (legal follow-up). |
| FD-4 | **Forge step 20 itself**: acceptance of both content packages → advances originality to rights-cleared and unlocks the implementation package (engine + persistence), which remains separately authorized. |

---

# MTF-2A.1 — Correction Record (supersedes the §12 blanket outcome above)

## Defects present at `b8d8338` (recorded honestly; the MTF-2A loop did not catch them)

| # | Defect |
|---|---|
| C-1 | **30-second truth mismatch** — benchmark selected 45–60s but user copy claimed 30秒 |
| C-2 | **Absolute privacy language** — だれにも見えません／共有されることはありません exceeded honest boundaries |
| C-3 | **Destructive overwrite ambiguity** — same-day re-entry "overwrites"; device-local time only; no entryLocalDate/timezone model |
| C-4 | **Incomplete longitudinal copy system** — pattern summaries and prompts described but not authored |
| C-5 | **Missing daily recommendation mapping** — kibun_tenkan unmapped; ungoverned one-off *_hint tags |
| C-6 | **Low-coverage/Mixed conflation** — <40 answered fell back to VAL_R_MIXED (a canonical result for incomplete execution) |
| C-7 | **Pair-dependent Mixed rule** — the head-to-head-tie conjunct was unsatisfiable for three-comparison pairs at full completion |
| C-8 | **Non-executable reachability claim** — the validator asserted "every result reachable" from structure, not computation |
| C-9 | **Moral/sensitivity item defects** — Q09/Q20/Q25 (financial)/Q37/Q38 (health-adjacent framing)/Q40; sensitivity defaulted to none |
| C-10 | **Repetitive and over-inferential result copy** — single share template ×8; PACE prior-loss name; MIXED transition inference; recovery-route/guilt/needs claims in private layers |
| C-11 | **Missing secondary thresholds** — strength bands claimed "documented internally" with no canonical thresholds |
| C-12 | **Incorrect 16-file PR claim** — actual branch inventory is 15 files |

## MTF-2A.1 corrections applied

A (timing/privacy truth) · B (record identity: producedAt UTC + entryLocalDate + IANA timezone; versioned corrections, no destructive overwrite; ≥1 structured field; memo-only invalid) · C (complete longitudinal: 6 seven-day summary rules + 30-day semantics + 3 authored prompts + full 6-option recommendation mapping on the governed need_*/context_*/content_* taxonomy with explicit no_recommendation) · D (13/13 ack risk pass: keep 4 / polish 2 / rewrite 7) · E (insufficient_coverage execution state) · F (pair-independent Mixed <0.05; tie-break separated; executable fixtures in the validator) · G (6 item rewrites + 4-value sensitivity vocabulary + 9 reclassifications + side/exposure audit) · H (autoloop: PACE→「自分のペースを守りたい時期」, MIXED→「大事なことが並ぶ時期」, 8 distinct share lines, private-layer claims made answer-traceable, secondary→non-graded 「もうひとつ近かった軸」) · I (anti-screening boundary shipped + accurate internal-numerics statement) · J (canonical sha256 hashes computed and pinned: values bank `8b45209f…`, daily schema+ack `773602f3…`).

## Result-copy autoloop classification (public surfaces)

| Surface | Classification |
|---|---|
| ANSHIN/TSUNAGARI/SEICHO/YAKUWARI/TOTONOI/JIKKAN names + hooks + recognitions + bullets + next-steps | lock_keep (differentiated, current-state, behavior-first) |
| PACE name + hook + detail | rewrite_required → applied (prior-loss assumption removed) |
| MIXED name + all public copy | rewrite_required → applied (factual close-scores framing) |
| All 8 share lines | rewrite_required → applied (template ×8 → 8 distinct constructions) |
| TSUNAGARI/YAKUWARI/JIKKAN private details | rewrite_required → applied (answer-traceable) |
| Correction prompts | lock_keep (deliberate stable convention) |

## Post-correction classification

| Axis | State |
|---|---|
| Content completeness | COMPLETE (longitudinal system + mappings now canonical) |
| Scoring integrity | CORRECTED + EXECUTABLY VERIFIED (fixtures in validator) |
| Originality | UNCHANGED — `YORISOU_ORIGINAL_AUTHORED_PENDING_FOUNDER_REVIEW` |
| Japanese quality | PASS after A1-1..A1-7 (editorial review) |
| Trust risk | PASS — E-1 resolved for V1 by Founder decision 3.2; E-2 boundary shipped, ToU registered |
| Implementation readiness | READY pending Forge step 20 (specs + hashes implementation-grade) |
| Founder-review readiness | READY — step 20 acceptance withheld until MTF-2A.1 passes review (decision 3.4) |

## §hashes — canonical serialization procedure

`sha256(compact_json(x))` where compact_json = JSON serialization with separators `,`/`:`, `ensure_ascii=False`, key order as authored. values: x = `questionBank.items` → `919f17251a280bb34258f6042db46bb9fd543763b33e041de64c36b305eaa9a6` (MTF-2A.2, after Q04/Q25 rewrites). daily: x = `[stateSchema.fields, stateSchema.privateReflection, acknowledgementRules]` → `4107f004e0099bfd4ef82936f9801c421d256eb6d7ccacda8e762a7a132a8bd3` (MTF-2A.2, after ack rewrites). The validator recomputes both on every run.

## Founder decisions after MTF-2A.1

FD-1 names ACCEPTED (3.1: きょうの空模様／いま大事にしたいことチェック) · FD-2 RESOLVED for V1 (3.2 policy) · FD-3 ToU clause remains a legal follow-up (boundary content shipped) · FD-4 Forge step 20 acceptance — withheld until this package passes Founder review (3.4).


---

# MTF-2A.2 — Final Correction Record

## Defects present at `9ecea9e` (recorded honestly; the MTF-2A.1 loop did not catch them)

| # | Defect |
|---|---|
| C-13 | **Scoring-version/provenance mismatch** — `scoring.scoringVersion` was bumped to v1.1 while `definition` and `resultObjectContract.provenance` stayed v1.0 |
| C-14 | **Partial 40/48 coverage allowed uneven dimension evidence** — a 40-answer result could rest on unequal per-dimension exposure |
| C-15 | **Side-label fixture did not swap sides** — it re-ran the original bank, proving nothing about A/B invariance |
| C-16 | **Item-order fixture did not compare the canonical full result** — it recomputed a top dimension with inline logic |
| C-17 | **Tie-break fixture did not construct a real tie** — it only checked that a secondary existed |
| C-18 | **Pair-equivalence fixture did not assert intended top pair/gap** — it could pass on unrelated profiles |
| C-19 | **Seven-day summaries could describe unrecorded days as known states** (「この7日は…」 over a partial record) |
| C-20 | **ACK_RAIN/ACK_LOWBATT remained partly directive** (how-to-spend advice; "already sufficient" evaluation) |
| C-21 | **Q04/Q25 retained moral-attractiveness bias** (helping side elevated; keeping side read as hoarding) |
| C-22 | **Private result sections remained insufficiently answer-traceable** (static context claims from the primary label alone) |
| C-23 | **Mixed private interpretation exceeded what close scores prove** (context advice, decision framing) |
| C-24 | **Some share hooks were suffix variation** (らしい/とのこと/だって/みたいです) rather than differentiated social copy |

## MTF-2A.2 corrections applied

A (version coherence: values-scoring-v1.0 frozen in all locations; daily versions verified internally consistent — schema v1.1 / ack v1.2 / longitudinal v1 each used identically at every reference) · B (48/48 required; insufficient_coverage for 0–47; 40-threshold removed) · C (ONE canonical non-runtime scoring function used by every fixture; genuine side-swap bank transform; full-result order invariance; constructed exact 2nd/3rd tie asserting declaration-order secondary; pair-equivalence fixtures asserting intended top-two + exact gap 0 + close set; per-result fixture table; external gates executed via real commands and counted separately) · D (field-valid denominators: 「記録した日の中では…」 wording; minFieldValid per rule; mixed-weather corrected) · E (ACK_RAIN/ACK_LOWBATT rewritten observational; 13/13 re-reviewed) · F (Q04/Q25 rewritten after a blinded attractiveness audit of all 48 — both now equally-legitimate role/approach choices; hash recomputed) · G (privateRenderingContract: per-section evidence rules, min support, soften/omit + fallbacks; machine-readable resultReasons feeding MTF-1 reasons.itemRefs; 9.3 static claims conditionalized) · H (Mixed = close scores only; unsupported context sections decline to infer; default no_recommendation) · I (8 behavior-recognizable share hooks; internal scoring recorded) · J (every recommendation: fitReasonJa + evidenceSource + consent + boundary; need_* never inferred from primary alone).

## Blinded answer-attractiveness audit (F) — summary

All 48 items assessed side-blind for kinder/healthier/more-responsible/more-generous vs selfish/fearful/lazy/careless readings. Outcome: 46 keep (both sides comparably legitimate) · 2 rewrites (Q04, Q25 — the contribution side previously read as morally elevated; now both read as ordinary, equally approved role/approach preferences).

## Post-MTF-2A.2 classification

Content completeness COMPLETE · Scoring integrity CORRECTED + genuinely fixture-verified (canonical scorer; transformed-bank invariance; constructed ties; asserted gaps) · Version coherence FROZEN (first-canonical-candidate set) · Originality UNCHANGED (`YORISOU_ORIGINAL_AUTHORED_PENDING_FOUNDER_REVIEW`) · Japanese quality PASS (final share-copy pass) · Trust risk PASS (non-directive acks; anti-screening shipped) · Founder-review readiness READY (step 20 withheld per decision 3.4 pending this review).
