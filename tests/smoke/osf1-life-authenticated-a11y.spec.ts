import { createHash } from "crypto";
import AxeBuilder from "@axe-core/playwright";
import { test, expect, type BrowserContext, type Locator, type Page } from "@playwright/test";

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

const SURFACES: readonly Surface[] = [
  // 前に残した状態 and the note on one of the earlier records, because the heading alone would still
  // be there if every row inside it had stopped rendering.
  { name: "/life hub", path: "/life", marker: "ほかの利用者に表示されません", present: [GOAL_TITLE, LIGHT_HAPPENED, MEMORY_SENTENCE, STATE_NOTE, STATE_HISTORY_HEADING, EARLIER_STATE_NOTE] },
  // MEMORY is no longer a timeline kind — a memory is a standing note with its own surface and
  // lifecycle, not something that happened at a moment. The timeline shows what occurred, so the
  // seeded content asserted here is the direction and the light reflection.
  { name: "/life/timeline", path: "/life/timeline", marker: "これまで。", present: [GOAL_TITLE, LIGHT_HAPPENED] },
  { name: "/life/reflect light", path: "/life/reflect", marker: "何がありましたか。", present: [] },
  { name: "/life/reflect postmortem", path: "/life/reflect?mode=postmortem", marker: "何が起きましたか。", present: [] },
  { name: "/life/goals", path: "/life/goals", marker: "向かいたい方向。", present: [GOAL_TITLE] },
  { name: "/life/experience", path: "/life/experience", marker: "書きとめておく", present: [EXPERIENCE_TITLE], open: openSharingPreview },
  { name: "/life/memories", path: "/life/memories", marker: "覚えていること。", present: [MEMORY_SENTENCE], open: openMemoryEditor },
];

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
});
