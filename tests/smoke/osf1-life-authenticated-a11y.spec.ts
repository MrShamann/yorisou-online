import { createHash } from "crypto";
import AxeBuilder from "@axe-core/playwright";
import { test, expect, type BrowserContext, type Locator, type Page } from "@playwright/test";

import { NOT_VISIBLE_TO_OTHER_USERS } from "@/lib/life-os/privacyCopy";

// OSF-1 — the AUTHENTICATED accessibility gate for the Life OS Phase 1 surfaces.
//
// Launched ONLY by tests/life-os/fullstack-a11y.sh (OSF1_FULLSTACK_A11Y=1), which brings up the
// disposable PostgreSQL + PostgREST + real app stack this needs; skipped in the plain smoke run.
//
// The bar, and the policy for missing it, are pxr1-a11y.spec.ts's: serious = 0 and critical = 0 at
// the phone width the product is designed for and the desktop width where its layout changes most;
// moderate and minor are logged rather than failed, because a gate noisy enough to be ignored is
// worse than no gate.
//
// WHAT THIS SPEC HAS THAT osf1-life-a11y.spec.ts DOES NOT.
//
// It signs in, and it proves it did. Every Life OS page answers a signed-out visitor with
// SignInRequired — a heading, a sentence and a link — and all six of those signed-out pages scan
// with ZERO serious and ZERO critical violations at 390. That is measured, not assumed, and it is
// exactly the number osf1-life-a11y.spec.ts has been reporting: a real result about a sign-in
// notice, published under the name of the product surface. A false green about accessibility is
// worse than an absent one, because it is a claim that gets cited and never re-checked.
//
// So before axe runs, each surface asserts that the sign-in link is absent, that the authenticated
// heading is present, and — where the heading alone cannot separate the two renders — that seeded
// content only an account can see is on the page. Those assertions are the most important lines in
// this file; everything after them is scanning.
//
// It also seeds. An empty surface has no list, no status control and no dynamic region, which is
// most of what an accessibility scan exists to look at, so the fixture writes four current states, a
// goal, an experience, both reflection modes and two memories through the real /api/life/* endpoints
// first. FOUR states rather than one because 前に残した状態 excludes the record the hub already shows
// in full above it: seeded with a single record, the only new render component in this package
// returns null and is in none of these scans.
//
// And it OPENS things. axe scans a DOM, not a component tree, so a control kept behind local state
// that starts closed is not in the scan at all — and that is precisely the memory editor and the
// sharing preview, the two interactive controls this package added. Each is opened before its scan
// and asserted open, because a click that quietly failed would put the run back on the closed page.

const ENABLED = process.env.OSF1_FULLSTACK_A11Y === "1";
const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3211";

test.skip(!ENABLED, "authenticated a11y spec runs only via tests/life-os/fullstack-a11y.sh");

// The seeded content, kept here so the surfaces below can assert the words they should be showing.
const GOAL_TITLE = "ひとりで考える時間をつくる";
const STATE_NOTE = "きょうは早めに休む。";
const EARLIER_STATE_NOTE = "書き出したら、少し整理できた。";
const EXPERIENCE_TITLE = "会議のあとに書き出した";
const LIGHT_HAPPENED = "説明がうまく伝わらなかった。";
const POSTMORTEM_HAPPENED = "返事をその場で決めずに預かった。";
const MEMORY_SENTENCE = "先に書き出すと落ち着く。";
const STATE_HISTORY_HEADING = "前に残した状態";

// The state records written BEFORE the one the hub shows in full.
//
// app/life/StateHistory.tsx renders nothing when the latest record is the only record, so these are
// what puts it in the DOM at all. They vary deliberately: the component renders the tags, the
// mood/energy detail, the situation and the note as four separate optional paragraphs, and a fixture
// where every record carried all four would never scan a row that is missing one.
const EARLIER_STATES = [
  {
    stateTags: ["unsettled", "sort-out"],
    mood: "unsettled",
    energy: "steady",
    situation: "予定が重なって、順番を決められずにいた。",
    note: EARLIER_STATE_NOTE,
  },
  {
    stateTags: ["busy-mind", "shift"],
    mood: "heavy",
    energy: "low",
    situation: "夜になっても考えが止まらなかった。",
    note: null,
  },
  { stateTags: ["steady", "understand"], mood: "bright", energy: null, situation: null, note: null },
] as const;

const WIDTHS = [
  { label: "390", width: 390, height: 844 },
  { label: "1440", width: 1440, height: 900 },
] as const;

// `marker` is the heading only the AUTHENTICATED render produces; `present` is seeded content that
// must actually be on the page, so a surface that loaded but stayed empty is caught too; `open`
// reveals a control that starts closed, and is where a surface says what axe must not miss.
//
// /life/experience is the one surface where the heading cannot tell the two renders apart: signed
// out it reads 「やってみたことを、書きとめておく。」 and signed in 「やってみたことを、書きとめて
// おく。」 — the same sentence, broken across a <br/>. Its `present` entry is therefore load-bearing
// rather than a nicety: 書きとめたもの lists the seeded card and renders for nobody else.
type Surface = {
  name: string;
  path: string;
  marker: string;
  present: readonly string[];
  open?: (page: Page) => Promise<void>;
};

// §15 — THE DYNAMIC STATES.
//
// A surface has more than one shape, and the shapes a scan never sees are the ones a person meets on
// a bad day: the page after 「もっと見る」, a suppressed row, a revoked row, an assistant draft, a
// provider that refused, a save that failed. Each is a different DOM, and axe scans a DOM.
//
// Three of them need something the plain harness does not start:
//
//   OSF1_STACK_FAKE_PROVIDER=1     the assistant's draft and its provider-failure states
//   OSF1_STACK_FAULT_INJECTION=1   the transactional-audit-failure state
//
// They are SKIPPED rather than faked when those are absent, and the skip is reported — a scan that
// silently omitted the failure screens while claiming to cover the product is the kind of green this
// whole file exists to refuse.
const FAKE_PROVIDER = process.env.OSF1_FAKE_PROVIDER === "1";
const FAULT_INJECTION = process.env.OSF1_FAULT_INJECTION === "1";
const REST = process.env.OSF1_REST_URL || "";
const SERVICE_KEY = process.env.OSF1_SERVICE_KEY || "";
/** Shared with tests/life-os/disposable-provider.mjs, which picks its behaviour from the prompt. */
const PROVIDER_FAIL_MARKER = "PROVIDERFAILS";

/** Enough rows that the timeline and the memory list both offer a second page. */
const BULK_STATES = 22;
const BULK_MEMORIES = 26;

const SURFACES: readonly Surface[] = [
  // 前に残した状態 and the note on one of the earlier records, because the heading alone would still
  // be there if every row inside it had stopped rendering.
  { name: "/life hub", path: "/life", marker: NOT_VISIBLE_TO_OTHER_USERS, present: [GOAL_TITLE, LIGHT_HAPPENED, MEMORY_SENTENCE, STATE_NOTE, STATE_HISTORY_HEADING, EARLIER_STATE_NOTE] },
  // MEMORY is no longer a timeline kind — a memory is a standing note with its own surface and
  // lifecycle, not something that happened at a moment. The timeline shows what occurred, so the
  // seeded content asserted here is the direction and the light reflection.
  { name: "/life/timeline", path: "/life/timeline", marker: "これまで。", present: [GOAL_TITLE, LIGHT_HAPPENED] },
  { name: "/life/reflect light", path: "/life/reflect", marker: "何がありましたか。", present: [] },
  { name: "/life/reflect postmortem", path: "/life/reflect?mode=postmortem", marker: "何が起きましたか。", present: [] },
  { name: "/life/goals", path: "/life/goals", marker: "向かいたい方向。", present: [GOAL_TITLE] },
  { name: "/life/experience", path: "/life/experience", marker: "書きとめておく", present: [EXPERIENCE_TITLE], open: openSharingPreview },
  { name: "/life/memories", path: "/life/memories", marker: "覚えていること。", present: [MEMORY_SENTENCE], open: openMemoryEditor },

  // ── §15 dynamic states ─────────────────────────────────────────────────────
  // A filtered timeline is a different list with a different set of chips marked current.
  {
    name: "/life/timeline filtered",
    path: "/life/timeline?filter=REFLECTION",
    marker: "これまで。",
    present: [LIGHT_HAPPENED],
  },
  // The page AFTER 「もっと見る」 — twice as many list items, appended by client state, which is markup
  // no server-rendered scan has ever looked at.
  {
    name: "/life/timeline after 「もっと見る」",
    path: "/life/timeline",
    marker: "これまで。",
    present: [GOAL_TITLE],
    open: loadMore,
  },
  {
    name: "/life/memories after 「もっと見る」",
    path: "/life/memories",
    marker: "覚えていること。",
    present: [MEMORY_SENTENCE],
    open: loadMore,
  },
  // A suppressed row renders an extra state label and swaps 「いまは使わない」 for 「また使う」.
  {
    name: "/life/memories with a suppressed row",
    path: "/life/memories",
    marker: "覚えていること。",
    present: [MEMORY_SENTENCE],
    open: suppressFirstMemory,
  },
  // A revoked row renders the terminal notice and withdraws two controls.
  {
    name: "/life/memories with a revoked row",
    path: "/life/memories",
    marker: "覚えていること。",
    present: [MEMORY_SENTENCE],
    open: revokeSecondMemory,
  },
  // The disclosure a person reads BEFORE typing, on the surface where it decides something.
  //
  // The needle is the EXPORTED CONSTANT, not a retyped sentence. A hand-copied 「ほかの利用者に表示され
  // ません」 is one particle away from 「ほかの利用者に表示されることはありません。」 and fails as though the
  // disclosure were missing — which is exactly what it did here first.
  {
    name: "/life/reflect privacy disclosure",
    path: "/life/reflect",
    marker: "何がありましたか。",
    present: [NOT_VISIBLE_TO_OTHER_USERS],
  },
];

/**
 * 「もっと見る」 — and it is TWO different controls, deliberately.
 *
 * The timeline's is a plain `<a href>`: server-rendered, works without JavaScript, and its comment in
 * app/life/timeline/page.tsx says so. The memory list's is a `<button>` that appends to client state.
 * Both are "show me the next page" to a person, so this handles both — a helper that only knew about
 * the button reported "there is no second page" on a surface that had one, which is how a real gap
 * gets recorded as a seeding problem.
 *
 * Either way the scan that follows is of page TWO, asserted rather than assumed.
 */
async function loadMore(page: Page): Promise<void> {
  const link = page.locator('a:has-text("もっと見る")');
  if (await link.count()) {
    await link.first().click({ timeout: 5_000 });
    await page.waitForURL(/cursor=/, { timeout: 20_000 });
    await expect(page.getByRole("listitem").first()).toBeVisible();
    return;
  }
  const button = page.getByRole("button", { name: "もっと見る" });
  await expect(button, "there is no second page — the seed is too small for this scan to mean anything").toHaveCount(1);
  const before = await page.getByRole("listitem").count();
  await reveal(
    () => button.click({ timeout: 5_000 }),
    // The proof is that the list grew; the DOM under scan is the appended one.
    page.locator("li").nth(before),
    "「もっと見る」 did not append anything — the scan below would be of the first page",
  );
}

async function suppressFirstMemory(page: Page): Promise<void> {
  await reveal(
    () => page.getByRole("button", { name: "いまは使わない" }).first().click({ timeout: 5_000 }),
    page.getByRole("button", { name: "また使う" }).first(),
    "the memory was not suppressed — the scan below would be of the active row",
  );
}

async function revokeSecondMemory(page: Page): Promise<void> {
  await reveal(
    () => page.getByRole("button", { name: "もう使わないことにする" }).first().click({ timeout: 5_000 }),
    page.getByText("あとから戻すことはできません"),
    "the revoke confirmation did not open",
  );
  await reveal(
    () => page.getByRole("button", { name: "もう使わない", exact: true }).click({ timeout: 5_000 }),
    page.getByText("この記録はもう使われません。").first(),
    "the memory was not revoked",
  );
}

/**
 * Open something, then prove the page heard it — and try again if it did not.
 *
 * `next start` serves server-rendered markup that answers a click with nothing at all until React
 * has hydrated, and hydration is not a state Playwright can wait for. A single click can therefore
 * land on markup that is not listening yet and be lost in silence, which would leave axe scanning
 * the closed page this exists to open — the failure this spec was written to stop. Retrying the
 * action WITH its result asserted is the only shape that cannot end quietly: either the control is
 * open, or the test fails.
 */
async function reveal(open: () => Promise<void>, opened: Locator, missing: string): Promise<void> {
  await expect(async () => {
    await open();
    await expect(opened, missing).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
}

/** 書きかえる — the editor MemoryList keeps behind `edit`, which starts null. */
async function openMemoryEditor(page: Page): Promise<void> {
  await reveal(
    () => page.getByRole("button", { name: "書きかえる" }).first().click({ timeout: 5_000 }),
    page.getByLabel("覚えていることの文章"),
    "the memory editor did not open — the scan below would be of the closed row",
  );
}

/**
 * 共有前の表示を確認 — the preview VisibilitySection keeps behind `openId`, which starts null.
 *
 * Only a WIDENING opens it (narrowing sends straight through), so this picks the widest range and
 * stops at the preview. Nothing is written: 「この範囲で共有」 is the only control that sends, and it
 * is not clicked here.
 */
async function openSharingPreview(page: Page): Promise<void> {
  await reveal(
    async () => {
      await page
        .getByLabel("公開範囲", { exact: true })
        .first()
        .selectOption("ANONYMOUS_SHARED", { timeout: 5_000 });
      await page.getByRole("button", { name: "共有前の表示を確認" }).click({ timeout: 5_000 });
    },
    page.getByRole("checkbox", { name: "この範囲で共有することに同意します" }),
    "the sharing preview did not open — the scan below would be of the visibility select alone",
  );
}

/** sha256 of the trimmed sentence — must equal lib/server/lifeOs/aiBoundary.ts's memoryDigest. */
function digest(content: string): string {
  return createHash("sha256").update(content.trim(), "utf8").digest("hex");
}

/**
 * Call the API from inside the SIGNED-IN BROWSER, not through `page.request`.
 *
 * THE REASON IS NOT INCIDENTAL. `next start` runs as NODE_ENV=production, so yorisouAuth sets its
 * two session cookies `Secure`. Chromium keeps them — a loopback origin is trustworthy — but
 * Playwright's APIRequestContext is a Node HTTP client that refuses a Secure cookie over http and
 * drops it silently. The result is a browser that is signed in and a `page.request` that is not: a
 * seed written that way answers 401 while every page still renders as a signed-in person, which is
 * this spec's own failure mode wearing a different hat. Going through the page's fetch also matches
 * what the product's client code does (lib/life-os/client.ts).
 */
async function api(
  page: Page,
  method: "GET" | "POST",
  path: string,
  data?: unknown,
): Promise<{ status: number; body: string }> {
  return page.evaluate(
    async ([verb, target, payload]) => {
      const response = await fetch(target, {
        method: verb,
        ...(payload === null
          ? {}
          : { headers: { "Content-Type": "application/json" }, body: payload }),
      });
      return { status: response.status, body: await response.text() };
    },
    [method, `/api/life/${path}`, data === undefined ? null : JSON.stringify(data)] as const,
  );
}

async function registerAndSignIn(page: Page, email: string): Promise<void> {
  // Through the REAL auth layer, as tests/smoke/daily-check-in-fullstack.spec.ts does: registering
  // in the page's OWN request context lands the encrypted session cookies in this browser context,
  // so the pages the browser then loads are the ones a signed-in person sees.
  const res = await page.request.post(`${BASE}/api/auth/register`, {
    data: { name: "OSF1アクセシビリティ検証", email, password: "Osf1-Str0ng-Pass!", city: "Tokyo", role: "self" },
  });
  expect([200, 201]).toContain(res.status());
  // The browser has to be ON the app's origin before it can call the app's API — and everything
  // after this point depends on the cookies actually being in the browser, not merely issued.
  await page.goto(`${BASE}/life`, { waitUntil: "domcontentloaded" });
  // Verified, not assumed. A 200 here means the cookie resolves to an account AND the feature gate
  // is open; a 401 or a 404 would otherwise surface later as an empty page that still scanned green.
  const check = await api(page, "GET", "state");
  expect(check.status, `session not usable in the browser: ${check.body}`).toBe(200);
}

async function seed(page: Page): Promise<void> {
  const post = async (path: string, data: unknown): Promise<Record<string, unknown>> => {
    const res = await api(page, "POST", path, data);
    // A seed that silently failed leaves an empty surface, which is exactly the state this spec
    // exists to stop passing — so every write is asserted, not attempted.
    expect(res.status, `${path}: ${res.body}`).toBe(201);
    return JSON.parse(res.body) as Record<string, unknown>;
  };

  // ── §15 — enough rows that 「もっと見る」 EXISTS, and OLDEST so it does not hide the rest ──
  //
  // The timeline pages at 20 and the memory list at 25 (DEFAULT_LIMIT, MEMORY_PAGE_SIZE). Seeded to
  // just past each, not far past: the point is to put a second page and its button in the DOM, and a
  // scan of four hundred rows would take the time without telling us anything the twenty-first does
  // not — the volume question is tests/life-os/performance-smoke.sh's, not this file's.
  //
  // FIRST, not last. Both surfaces order created_at DESCENDING, so bulk rows written after the named
  // ones would push every sentence the surfaces above assert onto page two — and those assertions are
  // what stops this spec scanning an empty page. Written oldest, the filler IS page two.
  for (let i = 0; i < BULK_STATES; i += 1) {
    await post("state", { stateTags: ["steady"], mood: "calm", energy: "steady", source: "manual" });
  }
  for (let i = 0; i < BULK_MEMORIES; i += 1) {
    const sentence = `覚えておくこと ${i + 1}。`;
    await post("memories", {
      confirmed: true,
      memory: { memoryType: "lesson", content: sentence, source: "user_statement", digest: digest(sentence) },
    });
  }

  // Oldest first. The note is a SECOND request because that is the request the product makes:
  // yorisou_osf1_current_state_set_reflection is write-once and is what the check-in calls, so a
  // fixture that sent `reflection` on creation would be exercising a path nothing in the product
  // takes.
  for (const { note, ...record } of EARLIER_STATES) {
    const earlier = await post("state", { ...record, source: "manual" });
    if (note) {
      const annotated = await api(page, "POST", "state", { id: earlier.id, reflection: note });
      expect(annotated.status, annotated.body).toBe(200);
    }
  }

  // Written LAST, so this is the record the hub shows in full and the three above are the ones
  // 前に残した状態 has to render.
  const state = await post("state", { stateTags: ["heavy", "rest"], mood: "tired", energy: "low", source: "manual" });
  const noted = await api(page, "POST", "state", { id: state.id, reflection: STATE_NOTE });
  expect(noted.status, noted.body).toBe(200);

  const goal = await post("goals", { title: GOAL_TITLE, description: "予定を詰めすぎないようにする。" });

  await post("experiences", {
    title: EXPERIENCE_TITLE,
    situation: "説明する時間が短かった。",
    actionTried: "先にメモへ書き出してから話した。",
    perceivedOutcome: "翌日は落ち着いて話せた。",
    lesson: "書いてから話す。",
  });

  await post("reflections", {
    mode: "light",
    what_happened: LIGHT_HAPPENED,
    felt: "焦っていた。",
    tried: "もう一度言い直した。",
    what_followed: "あとで補足の連絡をした。",
    next_time: "先に要点を書いておく。",
  });
  await post("reflections", {
    mode: "postmortem",
    what_happened: POSTMORTEM_HAPPENED,
    goal_at_the_time: "急がずに決めたかった。",
    information_at_hand: "相手の事情は知らなかった。",
    options_considered: "その場で答える。持ち帰る。人に聞く。",
    decision_made: "持ち帰ることにした。",
    what_followed: "翌日に落ち着いて返事ができた。",
    next_time: "迷ったら一度預かる。",
  });

  // The offered candidate, confirmed — the real memory path, not a fabricated payload. The route
  // refuses anything without `confirmed: true`, and the database refuses it again.
  const candidate = (goal.memoryCandidates as Record<string, unknown>[])[0];
  expect(candidate).toBeTruthy();
  await post("memories", { confirmed: true, memory: candidate });

  await post("memories", {
    confirmed: true,
    memory: {
      memoryType: "lesson",
      content: MEMORY_SENTENCE,
      source: "user_statement",
      digest: digest(MEMORY_SENTENCE),
    },
  });

}

test.describe.serial("OSF-1 authenticated Life OS accessibility", () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    // One account, one context, seeded once: the surfaces are read-only scans, and registering per
    // test would spend fourteen registrations to observe the same records.
    context = await browser.newContext();
    page = await context.newPage();
    await registerAndSignIn(page, `osf1-a11y-${Date.now()}@example.test`);
    await seed(page);
  });

  test.afterAll(async () => {
    await context?.close();
  });

  for (const surface of SURFACES) {
    for (const viewport of WIDTHS) {
      test(`${surface.name} @ ${viewport.label} has no serious or critical violations`, async () => {
        test.setTimeout(60_000);
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(`${BASE}${surface.path}`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(600);

        // ── THE GUARD. A green axe run against a sign-in wall is worse than no run at all. ──
        await expect(
          page.getByRole("link", { name: "サインインする" }),
          `${surface.path} rendered SignInRequired — the scan below would be of the sign-in notice`,
        ).toHaveCount(0);
        await expect(page.getByRole("heading", { level: 1 }).first()).toContainText(surface.marker);
        for (const text of surface.present) {
          await expect(page.getByText(text).first(), `${surface.path} is missing seeded content`).toBeVisible();
        }

        // ── AFTER the guards, BEFORE the scan: whatever this surface keeps closed by default. ──
        if (surface.open) await surface.open(page);

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();

        const blocking = results.violations.filter(
          (v) => v.impact === "serious" || v.impact === "critical",
        );
        const advisory = results.violations.filter(
          (v) => v.impact !== "serious" && v.impact !== "critical",
        );

        if (advisory.length > 0) {
          console.log(
            `[a11y] ${surface.name} @ ${viewport.label} advisory: ` +
              advisory.map((v) => `${v.id}(${v.impact}, ${v.nodes.length})`).join(", "),
          );
        }

        expect(
          blocking.map((v) => `${v.id} [${v.impact}] ${v.nodes.length} node(s): ${v.help}`),
        ).toEqual([]);
      });
    }
  }

  // ── §15 — the three states that need a walked flow, not a URL ───────────────
  //
  // Each drives the reflection flow to its last screen first, so what axe sees is the real DOM the
  // person is looking at rather than a component rendered in isolation.

  /** Fill every screen of the light flow and stop ON the last one, without submitting. */
  async function toLastScreen(target: Page, firstAnswer: string): Promise<void> {
    await target.goto(`${BASE}/life/reflect`, { waitUntil: "domcontentloaded" });
    await expect(target.getByRole("heading", { name: "何がありましたか。" })).toBeVisible();
    for (let screen = 0; screen < 5; screen += 1) {
      await target.locator("textarea").first().fill(screen === 0 ? firstAnswer : `つづき${screen}`);
      if (screen < 4) {
        await reveal(
          () => target.getByRole("button", { name: "次へ" }).click({ timeout: 5_000 }),
          target.getByText(`${screen + 2} / 5`),
          `the flow did not advance past screen ${screen + 1}`,
        );
      }
    }
  }

  async function scan(name: string, width: number, height: number): Promise<void> {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(400);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    const advisory = results.violations.filter((v) => v.impact !== "serious" && v.impact !== "critical");
    if (advisory.length > 0) {
      console.log(
        `[a11y] ${name} @ ${width} advisory: ` + advisory.map((v) => `${v.id}(${v.impact}, ${v.nodes.length})`).join(", "),
      );
    }
    expect(blocking.map((v) => `${v.id} [${v.impact}] ${v.nodes.length} node(s): ${v.help}`)).toEqual([]);
  }

  for (const viewport of WIDTHS) {
    test(`assistant draft @ ${viewport.label} has no serious or critical violations`, async () => {
      test.setTimeout(120_000);
      test.skip(!FAKE_PROVIDER, "needs the disposable provider: OSF1_STACK_FAKE_PROVIDER=1");
      await toLastScreen(page, "説明の順番を決めずに話し始めた。");
      await reveal(
        () => page.getByRole("button", { name: "下書きを見る" }).click({ timeout: 5_000 }),
        page.getByText("これは下書きです。"),
        "the assistant produced no draft — the scan below would be of the offer, not the draft",
      );
      await scan("assistant draft", viewport.width, viewport.height);
    });

    test(`assistant provider failure @ ${viewport.label} has no serious or critical violations`, async () => {
      test.setTimeout(120_000);
      test.skip(!FAKE_PROVIDER, "needs the disposable provider: OSF1_STACK_FAKE_PROVIDER=1");
      // The marker makes the disposable provider answer 500 — a provider that is up and refusing.
      await toLastScreen(page, PROVIDER_FAIL_MARKER);
      await reveal(
        () => page.getByRole("button", { name: "下書きを見る" }).click({ timeout: 5_000 }),
        page.getByText("いまは整理を利用できません。"),
        "the provider did not fail — the scan below would be of the ordinary offer",
      );
      await scan("assistant provider failure", viewport.width, viewport.height);
    });

    test(`transactional audit failure @ ${viewport.label} has no serious or critical violations`, async () => {
      test.setTimeout(120_000);
      test.skip(!FAULT_INJECTION, "needs fault injection: OSF1_STACK_FAULT_INJECTION=1");
      const setFault = async (enabled: boolean) => {
        const response = await page.request.post(`${REST}/rest/v1/rpc/osf1_test_audit_fault`, {
          headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
          data: { p_enabled: enabled },
        });
        expect(response.status(), "the fault switch is not callable").toBe(200);
      };
      await toLastScreen(page, `a11y-auditfail-${Date.now()}`);
      await setFault(true);
      try {
        await reveal(
          () => page.getByRole("button", { name: "書き終える" }).click({ timeout: 5_000 }),
          page.locator("main [role=alert]"),
          "the save did not fail — the scan below would be of the finished screen",
        );
        // The failure screen must carry BOTH the message and the retry, or there is nothing to scan
        // that is worth scanning.
        await expect(page.getByRole("button", { name: "もう一度保存する" })).toBeVisible();
        await scan("transactional audit failure", viewport.width, viewport.height);
      } finally {
        // Left armed, every later test in the file would fail on a broken save.
        await setFault(false);
      }
    });
  }
});
