# 24Q MVP Browser QA Checklist

Use this checklist for a manual pass over the current 24Q vertical slice.

1. Open `/check-in` and confirm the intro says 24 questions, browser-local use, and preview-only formal check.
2. Start the check and answer all 24 questions, confirming progress, back, and disabled next states.
3. Confirm completion routes through `/report-loading` and preserves `resultId`, `overlayId`, `confidence`, and `payloadKey`.
4. On `/result`, confirm the public result name, recognition line, trait chips, overlay cue, and confidence cue render.
5. Use the local save button, then open `/saved` and confirm the saved record appears without account or cloud claims.
6. From `/saved`, open result revisit and continue links; confirm the same public result context is preserved.
7. Open `/result/share` from the result page and confirm only public-safe result content appears.
8. Check `/result/opengraph-image` and `/result/share/opengraph-image` with the same query context for result-aware text.
9. Open `/report-preview` and confirm 72Q remains preparation-only with no live-result claim.
10. Record report-preview intent and confirm it is described as browser-local only.
11. Open `/formal-check` and confirm it is only an explanation of the future direction.
12. Open `/recommendations` and confirm result, overlay, confidence, and trait context are visible.
13. Submit a recommendation signal and confirm it stays local-only.
14. Retest from `/check-in` and confirm a fresh result can replace the saved context.
15. Repeat key pages on mobile width and verify sticky quiz controls and CTAs remain usable.
