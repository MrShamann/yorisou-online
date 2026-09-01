import assert from "node:assert/strict";
import test from "node:test";

import { getCopy } from "../../app/_corporate/i18n";
import { PUBLISHED } from "../../app/_corporate/i18n/locales";

/**
 * The company may not be given an office it does not hold.
 *
 * WHAT WENT WRONG. The consumer-era `/company` page shipped 代表取締役 — a 株式会社 office. YORISOU is
 * a 合同会社, which has no 取締役 at all, so the page named a role that cannot exist here. It also
 * printed the trade name as 寄り添う（Yorisou）, which is not the registered 商号.
 *
 * WHY THE OBVIOUS REPAIR IS ALSO GUARDED. 代表社員 is the usual representative office of a 合同会社,
 * and it would be easy to swap one for the other and call it fixed. But 会社法 §599(3) designates a
 * 代表社員 FROM AMONG the 業務執行社員; it does not follow automatically, and the National Tax Agency
 * publication site does not publish officers, so nothing available to us proves it. What the
 * evidence on file DOES record is 業務執行社員 — which is true whether or not a 代表社員 was
 * designated, because a 代表社員 is necessarily one. So 業務執行社員 is what the site says, and this
 * guard fails on BOTH the impossible office and the unproven one.
 *
 * When the 履歴事項全部証明書 or the 定款 is read and settles the title, delete the relevant entry
 * from FORBIDDEN_OFFICES in the same commit that changes the copy — not before.
 */

/** NTA Corporate Number Publication Site, queried 2026-08-31 -> ＹＯＲＩＳＯＵ合同会社. */
const CORPORATE_NUMBER = "2290003018125";

const FORBIDDEN_OFFICES: [string, string][] = [
  ["代表取締役", "a 株式会社 office; a 合同会社 has no 取締役"],
  ["取締役", "same reason — no 取締役 exists in a 合同会社"],
  ["代表社員", "not proven: 会社法 §599(3) designates it from among the 業務執行社員"],
  ["대표사원", "Korean for 代表社員 — same unproven status"],
  ["Representative Member", "English for 代表社員 — same unproven status"],
  ["Representative Partner", "English for 代表社員 — same unproven status"],
];

/** Every rendered string in a locale, flattened. */
function texts(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => texts(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => texts(v, out));
  return out;
}

async function allTexts(): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  for (const locale of PUBLISHED) map.set(locale.code, texts(await getCopy(locale.code)));
  return map;
}

test("the scan is actually reading the published copy", async () => {
  // Without this, every assertion below would pass over an empty array — which is precisely how a
  // security or claim guard reports clean while reading nothing. The Japanese source must contain
  // the office the site DOES claim; if it does not, the loader, not the copy, is what changed.
  const all = await allTexts();
  assert.ok(all.size >= 21, `expected at least 21 published locales, scanned ${all.size}`);
  const ja = all.get("ja");
  assert.ok(ja && ja.length > 200, `ja resolved to ${ja?.length ?? 0} strings — the scan is empty`);
  assert.ok(
    ja.some((s) => s.includes("業務執行社員")),
    "ja no longer states 業務執行社員 anywhere — either the title changed or the scan is blind",
  );
});

test("no locale names an office the company is not proven to hold", async () => {
  const offences: string[] = [];
  for (const [locale, strings] of await allTexts()) {
    for (const [office, why] of FORBIDDEN_OFFICES) {
      // 業務執行社員 legitimately contains 社員, and 代表取締役 contains 取締役. Mask the longer,
      // permitted forms first so the shorter forbidden ones are only matched on their own.
      const masked = strings.map((s) => s.replace(/業務執行社員/g, "§").replace(/代表取締役/g, office === "代表取締役" ? "代表取締役" : "§"));
      const hits = strings.filter((_, i) => masked[i].includes(office));
      if (hits.length > 0)
        offences.push(`${locale}: "${office}" (${why}) in ${hits.length} string(s): ${hits[0]}`);
    }
  }
  assert.deepEqual(offences, [], `unproven or impossible office named:\n${offences.join("\n")}`);
});

test("the trade name is never the consumer-era 寄り添う", async () => {
  const offences: string[] = [];
  for (const [locale, strings] of await allTexts())
    for (const s of strings)
      if (s.includes("寄り添う（Yorisou）") || s.includes("寄り添う(Yorisou)"))
        offences.push(`${locale}: ${s}`);
  assert.deepEqual(offences, [], `the registered 商号 is not 寄り添う:\n${offences.join("\n")}`);
});

test("every corporate number printed is the one the NTA publishes", async () => {
  let printedSomewhere = 0;
  const wrong: string[] = [];
  for (const [locale, strings] of await allTexts())
    for (const s of strings) {
      for (const m of s.match(/\b\d{13}\b/g) ?? []) {
        if (m === CORPORATE_NUMBER) printedSomewhere += 1;
        else wrong.push(`${locale}: ${m}`);
      }
    }
  assert.deepEqual(wrong, [], `a 13-digit number that is not the corporate number:\n${wrong.join("\n")}`);
  assert.ok(
    printedSomewhere >= PUBLISHED.length,
    `the corporate number appears ${printedSomewhere} times across ${PUBLISHED.length} locales — every published locale should carry it`,
  );
});
