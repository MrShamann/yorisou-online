/**
 * CORP-P4AR2 — a robots.txt SERIALISER and MATCHER, so the rules can be tested as text.
 *
 * WHY THIS EXISTS. CORP-P4AR1's tests asserted against `isIndexable()`, a policy predicate. That
 * predicate agreed with itself no matter what robots.txt actually said, so it could not have caught
 * the real defect: three of the four `Allow` rules were written without a `$`, which under
 * prefix matching re-opened `/mirai-move-old`, `/kakari-preview`, `/about-old` and every descendant.
 * Testing the policy could never find a bug in the SERIALISED RULES. So these functions produce and
 * evaluate the actual text.
 *
 * MATCHING RULES IMPLEMENTED (Google's robots.txt specification):
 *   - A rule path is a PREFIX match unless it ends with `$`, which anchors the end of the value.
 *   - `*` matches any run of characters, including `/`.
 *   - The matched value is the path AND query string.
 *   - Where both an Allow and a Disallow match, the MOST SPECIFIC rule wins, measured by the
 *     character length of the rule path.
 *   - On an exact length tie, the LEAST RESTRICTIVE rule wins, i.e. Allow.
 *   - A path matched by no rule is allowed.
 */

export type RobotsRule = { type: "allow" | "disallow"; path: string };

/** Serialise a Next.js `MetadataRoute.Robots` rule block the way Next renders it to text. */
export function serialiseRobots(input: {
  rules: { userAgent: string; allow?: string[]; disallow?: string[] }[];
  sitemap?: string;
}): string {
  const out: string[] = [];
  for (const r of input.rules) {
    out.push(`User-Agent: ${r.userAgent}`);
    for (const a of r.allow ?? []) out.push(`Allow: ${a}`);
    for (const d of r.disallow ?? []) out.push(`Disallow: ${d}`);
    out.push("");
  }
  if (input.sitemap) out.push(`Sitemap: ${input.sitemap}`);
  return out.join("\n").trim() + "\n";
}

/** Parse robots.txt text into the rule list that applies to a given user agent. */
export function parseRobots(text: string, userAgent = "*"): RobotsRule[] {
  const rules: RobotsRule[] = [];
  let applies = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (field === "user-agent") {
      applies = value === "*" || value.toLowerCase() === userAgent.toLowerCase();
    } else if (applies && (field === "allow" || field === "disallow")) {
      // An empty Disallow means "allow everything" and carries no path; skip it.
      if (value) rules.push({ type: field, path: value });
    }
  }
  return rules;
}

/** Does one rule path match this request path? `*` is a wildcard; a trailing `$` anchors the end. */
export function ruleMatches(rulePath: string, requestPath: string): boolean {
  const anchored = rulePath.endsWith("$");
  const body = anchored ? rulePath.slice(0, -1) : rulePath;
  const pattern =
    "^" +
    body
      .split("*")
      .map((seg) => seg.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
      .join(".*") +
    (anchored ? "$" : "");
  return new RegExp(pattern).test(requestPath);
}

/**
 * Evaluate a path against parsed rules. Returns whether a compliant crawler may FETCH it — which is
 * the only thing robots.txt decides. It is not a statement about indexing.
 */
export function isCrawlable(rules: RobotsRule[], requestPath: string): boolean {
  let best: { rule: RobotsRule; len: number } | null = null;
  for (const rule of rules) {
    if (!ruleMatches(rule.path, requestPath)) continue;
    const len = rule.path.length;
    if (!best || len > best.len || (len === best.len && rule.type === "allow")) {
      best = { rule, len };
    }
  }
  return best ? best.rule.type === "allow" : true;
}
