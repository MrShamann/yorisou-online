# Stage 1 Homepage Transition Note

## What Changed

- The homepage hero now leads with the light companionship entry product direction.
- `/check-in` is now the primary homepage action.
- Legacy mobility / Hinata content was kept but demoted below the primary entry story.
- The browser title and description were updated to match the new Stage 1 direction.

## Exact Files Touched

- `app/page.tsx`
- `docs/implementation_notes_2026-04-12/stage1_homepage_transition_note.md`

## What Was Intentionally Left for Stage 2

- A full rebuilt homepage.
- Removal of all legacy mobility / Hinata content.
- Broader sitewide narrative cleanup.
- Batch 2.5 LINE operational hardening.

## How Legacy Content Was Demoted

- The hero no longer leads with mobility or Hinata wording.
- The first explanation zone now describes the new check-in experience.
- The legacy consultation flow was relabeled as a lower-page, secondary path.
- Legacy support and institutional references remain available, but they no longer headline the page.

## Validation Results

- `./node_modules/.bin/eslint app/page.tsx` passed.
- `npm run build` passed.
- Local server validation at `http://127.0.0.1:3012` confirmed the homepage renders with the new Stage 1 hero copy and `/check-in` CTA.
- Local `/check-in` validation returned `200`.
- The legacy mobility / Hinata content still exists lower on the page, but it no longer leads the homepage.

## Remaining Gaps

- Legacy mobility and Hinata sections still exist lower on the page.
- The homepage is now transition-aligned, but it is not yet the final Stage 2 rebuild.
