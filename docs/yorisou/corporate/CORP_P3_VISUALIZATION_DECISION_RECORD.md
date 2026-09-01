# CORP-P3 — Visualization Decision Record

**Package:** CORP-P3 · **Date:** 2026-08-24 · **Scope:** the two product visuals that must stop being
structurally identical (Founder finding F-04).

Shared constraints for both: no new dependency · no charting library · no WebGL · no 3D · no map ·
no fake metrics · no live data · server-rendered · accessible equivalent required · reduced-motion
must preserve full meaning.

---

## 1. Mirai Move — static 2D relationship / network schematic

| Field | Decision |
|---|---|
| **Comprehension task** | Understand the *relationships among mobility actors* — that several parties with different standpoints meet around one shared opportunity. |
| **Selected form** | Radial relationship schematic: four numbered party nodes arranged around a single accented centre, each connected to it by a hairline edge. |
| **Why text alone is insufficient** | A list renders parties as a *sequence*, and the reader infers order and precedence that do not exist. The claim is simultaneity and shared centre — several standpoints, one opportunity, no first or last. Radial geometry states that in one glance; prose has to argue it. It is also the only device that makes Mirai Move structurally unlike Kakari, which is the actual finding. |
| **Why a map is rejected** | There is no canonical geographic data. Placing parties on a map of Japan would imply coverage, service areas and density we cannot evidence — a fabricated claim in visual form. |
| **Why 3D / WebGL rejected** | Adds a rendering dependency and a GPU path for zero informational gain on a four-node figure; degrades under reduced-motion and on low-end devices; cannot be server-rendered. |
| **Why a chart library rejected** | This is not data. There is no series, no magnitude, no axis. A chart library would install a dependency to draw four circles and four lines, and would invite later fabrication of quantities. |
| **Source-to-render pipeline** | `mirai-move/PROJECT_START_HERE.md` (canonical, read-only) → `MIRAI_NETWORK` in `app/prototype/corporate/_content/site.ts` (typed, with source cited in comment) → `NetworkSchematic` in `_components/visuals.tsx` → inline SVG + `<ol>`. No runtime fetch, no build step, no external asset. |
| **Accessible alternative** | The `<ol>` in the `<figcaption>` is the primary representation: numbered parties with their standpoint note, plus the centre named in text. The SVG is `role="presentation"` + `aria-hidden`, so a screen reader receives the content **once**, not twice. Node numerals in the SVG map to the list numbers. |
| **Server-rendering strategy** | Pure server component. Inline SVG in the initial HTML; no client boundary, no hydration cost, no layout shift. |
| **Reduced-motion behavior** | Only the centre node carries the shared `.signal` settle, which lives inside `@media (prefers-reduced-motion: no-preference)`. Under `reduce` it is simply absent — the schematic is fully static and loses **no** meaning, because meaning is carried by geometry and the list, never by motion. |
| **Loading / bundle budget** | 0 bytes JS, 0 network requests, ~1.4 KB inline SVG markup. Verified: 0 external requests on the route. |
| **Acceptance criteria** | (a) renders identically with JS disabled; (b) `<ol>` conveys all four parties + centre without the SVG; (c) 0 axe violations; (d) 0 animated elements under `reduce`; (e) no numeral in the figure implies a quantity; (f) structurally distinct from Kakari's visual. **All met.** |

## 2. Kakari — static 2D procedural / evidence flow with a boundary gate

| Field | Decision |
|---|---|
| **Comprehension task** | Trace a *governed administrative procedure* and understand where it stops being Kakari's responsibility. |
| **Selected form** | Vertical numbered flow — 調べる → 書類をそろえる → 作成する → 提出する — on a continuous accent rail, terminating in a visually distinct **boundary gate** band where the rail breaks into a dashed segment. |
| **Why text alone is insufficient** | The boundary is the point of the visual. In CORP-P2 it was a callout box *after* a generic diagram, which reads as a disclaimer — something appended for safety. Making the rail visibly stop turns the limit into part of the procedure: the reader sees where Kakari ends before reading why. A paragraph cannot place a limit *in sequence*. |
| **Why a map is rejected** | Administrative procedure has no geography here. |
| **Why 3D / WebGL rejected** | Same as Mirai Move — dependency and rendering cost for no gain on four steps. |
| **Why a chart library rejected** | No quantities. A flow-chart library would also encourage branching, and a branching diagram would imply a **legal decision path**, which is explicitly prohibited. |
| **Fabrication guard** | The flow is strictly linear: no conditions, no branches, no outcomes. It describes what the product supports, never what a person should legally do. |
| **Source-to-render pipeline** | `kakari/PROJECT_START_HERE.md` + `kakari/AGENT_PROJECT_RULES.md` §1 (canonical, read-only) → `KAKARI_PROCEDURE` in `_content/site.ts` → `ProcedureFlow` in `_components/visuals.tsx` → semantic `<ol>` + CSS. **No SVG at all** — the flow is real list markup, which is itself part of making it structurally unlike Mirai Move. |
| **Accessible alternative** | The visual *is* the semantic structure: an ordered list of steps, each with label and note, followed by a labelled boundary region carrying the full professional-boundary sentence. Nothing is conveyed by decoration alone; the rail and gate are CSS on real elements. |
| **Server-rendering strategy** | Pure server component, CSS-only rendering, no client boundary. |
| **Reduced-motion behavior** | No animation at all in this component. Identical under `reduce`. |
| **Loading / bundle budget** | 0 bytes JS, 0 network requests, no SVG payload. |
| **Acceptance criteria** | (a) steps read in order via list semantics alone; (b) the boundary text is announced as content, never as decoration; (c) no branch or conditional appears; (d) 0 axe violations; (e) required wording 「士業の代理は行いません…」 present verbatim; (f) structurally distinct from Mirai Move's visual. **All met.** |

## 3. Why these two are now structurally distinct

| Axis | Mirai Move | Kakari |
|---|---|---|
| Geometry | Radial | Vertical linear |
| Implementation | Inline SVG + `<ol>` caption | Pure semantic `<ol>` + CSS, no SVG |
| Reading order | Simultaneous — no first or last | Strictly sequential, 01→04 |
| Terminal element | Accented centre (convergence) | Boundary gate (a stop) |
| What it asserts | Many standpoints, one shared opportunity | One procedure, with a limit |

They can no longer be swapped without the page becoming wrong, which is the test CORP-P2 failed.

## 4. Rejected outright

Geographic map · WebGL / 3D · chart or graph library · force-directed layout · animated edges ·
node counts or magnitudes · anything implying transaction volume, coverage, or an operating agent
system · any new npm dependency. **Zero dependencies were installed in CORP-P3.**
