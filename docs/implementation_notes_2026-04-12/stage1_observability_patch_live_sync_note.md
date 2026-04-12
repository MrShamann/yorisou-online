# Stage 1 Observability Patch Live Sync Note

## What Was Shipped

- Homepage CTA attribution for the primary `/check-in` entry.
- Homepage CTA attribution for legacy/support paths.
- `/check-in` source attribution via a small shared source normalizer.
- Source propagation through the existing `/check-in` funnel events.

## Exact Files Touched

- `app/page.tsx`
- `app/check-in/page.tsx`
- `app/check-in/CompanionCheckFlow.tsx`
- `app/api/check-in/track/route.ts`
- `app/components/TrackableHomepageLink.tsx`
- `lib/checkInAttribution.ts`
- `docs/implementation_notes_2026-04-12/stage1_observability_patch_live_sync_note.md`

## Event Names / Fields Added

- `homepage_checkin_cta_clicked`
- `homepage_support_cta_clicked`
- `line_continuation_clicked`
- `source=homepage_primary`
- `source=homepage_secondary`
- `source=homepage_exposure`
- `source=direct`
- `source=unknown`

## What Was Intentionally Not Changed

- No homepage redesign.
- No `/check-in` flow redesign.
- No Batch 2.5 continuation behavior.
- No Stage 2 homepage rebuild.
- No analytics vendor.
- No env vars or deployment settings.

## Validation Results

- `npx eslint app/page.tsx app/check-in/page.tsx app/check-in/CompanionCheckFlow.tsx app/api/check-in/track/route.ts lib/checkInAttribution.ts app/components/TrackableHomepageLink.tsx` passed.
- `npm run build` passed.
- Local homepage HTML included the `?source=homepage_primary` /check-in CTA and the legacy/support links.
- Local `/check-in` HTML preserved `source=homepage_primary` on the result-screen continuation path.
- Direct POSTs to `/api/check-in/track` accepted the new homepage events.

## Questions This Now Answers

- How many users click from homepage into `/check-in`?
- How many users click legacy/support paths from homepage?
- How much `/check-in` traffic is from homepage vs direct/other?
- Does the new homepage lead change behavior through the check-in funnel?
