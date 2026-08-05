# CPC-1 · 02 — Result Identity and Authority Contract

> **FROZEN.** This contract exists because the product carried three competing result truths
> (persisted row, URL query, localStorage) and every new capability had to satisfy all three.

## 1. Canonical identity

```
resultRowId  (uuid, yorisou_assessment_results.id)  =  THE canonical result identity
```

Everything else is derivative: `resultId` is a **governed taxonomy code**, not an identity;
`payloadKey` is an analytics label; `overlayId` and `confidence` are presentation inputs.

## 2. Exclusive mode selection

```
IF ?result is PRESENT  ──► PERSISTED MODE (exclusive)
        load persisted record
        ├─ success ──► render persisted truth ONLY
        └─ failure ──► safe unavailable state; legacy params NEVER inspected
ELSE                   ──► LEGACY COMPATIBILITY MODE (bounded, temporary)
```

The **presence** of the parameter selects the mode — not its validity. Falling back on failure
would (a) let an inaccessible UUID be paired with a public legacy code to render a result, and
(b) make "exists but unauthorized" distinguishable from "does not exist". Both are prohibited.

`PersistedResultUnavailable` is deliberately **identical** for missing / invalid / unauthorized /
expired / erased.

## 3. Authority table (persisted mode)

| field | source | note |
|---|---|---|
| `resultId` | DB | never URL |
| `overlayId` | DB | **an authoritative `null` stays null** — legacy may not fill it |
| dimensions | DB `dimension_output` | shape-validated; malformed ⇒ omit section, never URL fallback |
| governed copy | protected taxonomy, resolved **by** persisted `resultId` | never duplicated into the DB |
| confidence / limits | persisted output or deterministic server derivation | never URL |
| `payloadKey` | **not persisted truth** | analytics only |
| answers | never rendered, never in URL | — |

Legacy parameters in persisted mode may be recorded **only** as a bounded mismatch fact — no
answers, no account identifier, no result content.

## 4. Storage authority

```
Supabase (Preview)          = canonical server truth
localStorage / sessionStorage = temporary compatibility cache ONLY
```

The compatibility cache may never be presented as an independent result, promoted into
authenticated truth, or written before the server confirms.

## 5. One result, one record

```
one completed attempt → exactly ONE canonical persisted result
```

`PrivateResultSave` must **not** create a second saved artefact. In persisted mode "save" means
**claim the existing result**, never recreate it.

## 6. Read authorization

```
owner              ──► full read
anonymous holder   ──► read only with a valid, unexpired credential for THAT attempt
everyone else      ──► concealed unavailable state
erased             ──► concealed unavailable state
```
