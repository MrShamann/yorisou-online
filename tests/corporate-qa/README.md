# Corporate QA harness (CORP-v1.3)

The checks the Production Launch Gate cites. They run against a **running production build**, because
several of them exist precisely to catch things that source-level checks cannot see — a media query
that does not match, a colour token that resolves differently than intended, a locale that never
reaches `<html lang>`.

```bash
npm run build && npx next start -p 3111      # in one shell
node tests/corporate-qa/sweep.mjs            # 189 routes: status, lang, dir, title, token leaks
node tests/corporate-qa/visual.mjs           # 6 viewports: overflow, clipped text, target size
node tests/corporate-qa/axe.mjs              # WCAG 2.2 AA across 9 routes x 5 scripts
node tests/corporate-qa/reducedmotion.mjs    # reduced motion + REAL Tab traversal
node tests/corporate-qa/brandpaint.mjs       # the brand system as painted, not as declared
node tests/corporate-qa/consumer.mjs         # the consumer product is untouched
bash  tests/corporate-qa/lh.sh               # Lighthouse, 3 runs, median
```

`BASE` overrides the origin. `ONLY` and `LOCALES` narrow `visual.mjs`.

## Two harness defects worth remembering

Both of these reported failures that were not real, and both were corrected rather than tuned away:

- **`reducedmotion.mjs`** originally called `el.focus()` and read the computed style. `:focus-visible`
  does not reliably match a *programmatic* focus in Chromium, so it reported five CTAs on
  `/build-with-us` as having no focus ring. Pressing Tab shows a 2px brand-blue outline on all of
  them. It now tabs for real: 154 tab stops, all visible.
- **`consumer.mjs`** searched the whole response for the corporate shell's class and failed all seven
  consumer routes. It was matching the serialised not-found subtree inside the RSC flight payload —
  data, not rendered markup. It now strips the payload first, and additionally asserts the consumer
  chrome is present on the routes that should have it.

A harness that cries wolf is worse than no harness: the next real failure gets waved through.
