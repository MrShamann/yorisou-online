# CORP-v1.2R3 — signature benchmark: what actually creates the hook

Captured 2026-08-31 at 1440 and 390, first viewport only, from the live public sites of OpenAI,
Linear, Vercel, Scale AI and Anthropic. Nothing is copied. Continues
`CORP_P5R1_BENCHMARK_TEARDOWN.md`, which studied structure; this studies **the hook**.

## Per site

| | Understood in 2–3s | Dominant object | Immediate state? | Type vs surface | Memorability | Motion |
|---|---|---|---|---|---|---|
| **Linear** | "product development system for teams and agents" | **The real product UI**, entering from the bottom and cropped by the viewport | Yes — a real issue, real activity, real properties | ~45% type / ~50% product | You see the thing itself, at working density | Motion reveals product state, not decoration |
| **Scale** | "reliable AI systems for important decisions" | **Full-bleed photography**, edge to edge | No | ~15% type over ~95% image | One arresting image | Minimal; the image carries it |
| **OpenAI** | a product announcement | Large editorial media block | Partly | Balanced | Editorial confidence | Restrained |
| **Vercel** | ship/deploy frontend | Product/deployment surface | Yes | ~40/50 | Product-as-proof | Fast, functional |
| **Anthropic** | a research/safety company | **Typography itself**, oversized | No | ~70% type | Restraint used as a signal | Almost none |

## The three findings that matter

**1. Every one of them gives ONE object most of the viewport.** None of the five puts its hero
inside a centred fixed-width container with equal margins. The object is full-bleed, or cropped by
the viewport edge, or oversized past the grid. It is never a figure politely seated in a card.

**2. Meaning is complete at frame zero.** Not one of them requires waiting, autoplay completion, or
a scroll to say what the company is. Where motion exists it *reinforces* state that is already
legible. Linear's UI is readable in a still screenshot; so is Anthropic's headline.

**3. The proof is whatever they honestly have.** Linear and Vercel show the product because the
product is the argument. Scale and OpenAI show imagery because scale and reach are the argument.
Anthropic shows typographic restraint because restraint is the argument.

## Why the current YORISOU Preview still feels conventional

Measured against the above, the Preview fails on all three:

- **No object owns the viewport.** The hero splits roughly 50/50 between a text column and a system
  figure that sits *inside* a card, inside the same 1240px container every other section uses. The
  figure reads as an illustration accompanying text rather than as the subject.
- **Meaning is time-gated.** The system field takes ~11 seconds to state its argument, and the
  explainer takes ~32. A visitor who looks for three seconds sees signals appearing and leaves
  before evidence, venture, team or company arrive. **The most important sentence the site can say
  is delivered last.**
- **The rhythm is uniform.** Hero → Band → Cards → Band → Cards, at one container width, with one
  spacing rule. Nothing breaks. Predictability is not calm; at this length it is forgettable.

And a fourth, specific to this company: **YORISOU has no product screenshot it can honestly show and
no photography it should use.** So the Linear move — "show the thing" — has exactly one honest form
here: **show the formation system itself, at the size the others give their product**. That is not a
decorative choice. It is the only proof surface the evidence permits.

## The brief this sets for R3

Give the Foundry object the weight Linear gives its product UI: full-bleed, cropped, dense, and
complete in a still frame. Put the three ventures where Linear puts real issue data — visible
immediately, not discovered by scrolling. Reduce the loop to a few seconds so motion confirms a
state the reader has already read, rather than withholding it. Break the container rhythm no more
than two or three times, deliberately, so the breaks read as structure and not as noise.
