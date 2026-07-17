# AIX-1B — contrast remediation evidence (PR #113 @ c1e27632)

Before (05fc1da3): whisper row 2.86:1, boundary line 3.52:1, stage label
3.52:1, layer note 3.59:1, open-testing note 3.52:1 — all below WCAG AA
4.5:1. axe reported 0 violations because the gradient-painted AIX surfaces
land in axe's `incomplete` bucket (see measurements-before.json).

After (c1e27632): whisper #667066 = 4.70:1; quiet warm notes #756B63 =
4.74:1 — measured against the resolved worst-case opaque background
(body #F8F4EC). Deterministic regression: tests/smoke/aix1-contrast.spec.ts.
State Field behavior unchanged.
