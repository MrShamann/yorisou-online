# Yorisou Product Doctrine and UX Boundary v0.3

**Status:** Approved  
**Owner:** Edward  
**Approver:** Edward  
**Approved Date:** 2026-07-10  
**Supersedes:** Yorisou Product Doctrine and UX Boundary v0.2

---

## 1. Purpose

This doctrine defines Yorisou v0.3 product structure, interaction rules, social boundaries, UX principles, and first-phase scope.

It prevents the product from becoming a generic test site, noisy social feed, public identity platform, manipulative wellness product, or technically correct but emotionally weak interface.

---

## 2. Product Doctrine

Yorisou should help users:

1. enter lightly,
2. understand the current state,
3. keep private value without public participation,
4. express experience through structured guidance,
5. discover relevant experiences without endless scrolling,
6. save or try a small next step,
7. report whether it helped,
8. return when state changes.

The product must remain useful even when the user never posts, comments, pays, or joins a public space.

---

## 3. Core UX Principles

### 3.1 Private by Default

Personal state, notes, reports, and drafts begin private.

Sharing requires an explicit visibility choice.

### 3.2 State, Not Fixed Identity

The UI should use current-state and rhythm language.

It must avoid locking users into permanent labels.

### 3.3 Structured Expression

The default creation flow is a guided Experience Card, not a blank public composer.

### 3.4 Limited Discovery

Yorisou should not use infinite scrolling as the default.

The user should receive a small, relevant set and a natural stopping point.

### 3.5 Useful Feedback, Not Popularity

Primary feedback actions should include:

- save,
- try,
- tried,
- helpful,
- not relevant now.

Likes and follower counts are not early core metrics.

### 3.6 Reversible Participation

Users should be able to edit, hide, withdraw, or delete their content.

### 3.7 Calm, Modern, Japanese Consumer Visual Quality

The product should feel:

- calm,
- refined,
- contemporary,
- human,
- appropriate for contemporary Japanese consumer expectations,
- culturally natural in each locale.

It should not feel:

- mystical,
- childish,
- clinical,
- corporate SaaS,
- generic AI,
- cheap wellness,
- traditional Japanese craft as a visual costume.

### 3.8 Conversion Without Pressure

Paid reports and services must be clear but non-manipulative.

No fear, fake scarcity, hidden insecurity, or deterministic promise.

---

## 4. First-Phase Product Surfaces

### 4.1 Home

Must communicate:

- what Yorisou helps with,
- how to begin,
- why it is low pressure,
- that it is more than a test site,
- that personal information remains controlled.

### 4.2 Entry Selection

Do not present a large test catalog.

Group entry by user intent:

- understand current state,
- explore rhythm or fit,
- understand relationships,
- make a light daily reflection,
- discover relevant experiences.

### 4.3 Lightweight State Check

Requirements:

- no forced login,
- behavior-based questions,
- mobile-first interaction,
- clear progress,
- non-clinical language,
- public-safe result,
- route to private state and discovery.

### 4.4 Private State Space

User-facing concept may be localized as a personal space such as "わたしの今".

Contains:

- current state,
- recent checks,
- private notes,
- saved experiences,
- things to try,
- state history,
- private reports,
- next check-in.

Must not look like an admin dashboard.

### 4.5 Experience Card Creation

Required guided fields:

1. what state were you in,
2. what was happening,
3. what did you try,
4. did it help,
5. who might find this relevant,
6. how visible should it be.

Must include:

- preview,
- identifying-detail warning,
- AI-assistance disclosure,
- edit and delete,
- explicit visibility.

### 4.6 State-Based Discovery

Must show a limited set based on relevance.

Each card should show:

- state context,
- action tried,
- perceived result,
- freshness,
- source or status,
- no follower count,
- no popularity rank.

### 4.7 State Topic Space

A state topic is temporary and situational.

It is not a permanent identity community.

The user may save, follow temporarily, or leave at any time.

### 4.8 Experience Detail

May include:

- structured experience,
- context,
- result,
- limitations,
- constrained supportive responses,
- related experience,
- report/block controls.

### 4.9 Recommendation Surface

Show only a small number of next steps.

Every recommendation should explain why it appears and what type of item it is.

### 4.10 Trust and Methodology

Must explain:

- state is not permanent identity,
- results are not diagnosis,
- shared experience remains user-controlled,
- AI may organize but not invent,
- commercial relationships are disclosed,
- users may delete or change visibility.

---

## 5. Social UX Boundaries

### Allowed Early

- anonymous or display-name experience,
- private drafts,
- similar-state discovery,
- save and try signals,
- constrained response templates,
- invite-only sharing,
- temporary topic following,
- report/block/delete.

### Deferred

- direct messaging,
- open public comments,
- follower/following counts,
- public popularity metrics,
- creator verification systems,
- trending lists,
- unrestricted user profiles,
- broad location-based discovery,
- live streaming,
- group administration systems.

### Prohibited Product Patterns

- infinite-feed default,
- manipulative streaks,
- notification pressure,
- emotional dependency cues,
- public oversharing incentives,
- ranking vulnerable users,
- hidden sponsored recommendations,
- fabricated social proof.

---

## 6. Public, Private, Anonymous, and Invite-Only UX

The interface must clearly distinguish:

### Private

Visible only to the user.

### Anonymous Shared

Visible under no public personal identity, subject to de-identification and moderation.

### Display-name Shared

Visible under a chosen non-legal identity where supported. This mode is architecturally recognized but deferred from the first public MVP unless moderation and identity-abuse controls are ready.

### Similar-State-Only

Eligible for discovery only among users meeting an approved relevance rule. The UI must not reveal another person's inferred sensitive state or imply a clinical match. This is a distribution rule, not a social identity badge.

### Invite-Only

Visible only to explicitly invited participants.

### Public-Safe

Eligible for broader sharing and search after user approval and safety review.

Visibility must never change silently.

---

## 7. Test and Result UX

Yorisou v0.3 retains the existing test universe but changes its role.

Tests should route into:

- private state,
- relevant experience,
- recommendation,
- report,
- return.

Public results should be concise and safe.

Private insights may be deeper.

The interface must not claim a fixed 31-persona model.

Existing result identifiers may remain implementation assets until the methodology is formally revised.

---

## 8. Japan UX and Localization

Yorisou v0.3 is a Japanese-language product for the Japan market.

Requirements:

- all active consumer copy must be Japanese-natural;
- LINE entry and return behavior should be treated as a first-class experience;
- email registration and authentication must remain available;
- dates, time, support language, privacy explanation, and recommendation context should follow Japan-market conventions;
- the product must not expose unfinished language switching or international-market placeholders.

Future localization may be considered later but does not govern the current interface.

## 9. Navigation Doctrine

Mobile navigation should remain restrained.

Early destinations may include:

- Home,
- Current State,
- Discover Experience,
- My Private Space.

Navigation should not expose internal architecture terms.

Avoid large mega-menus and duplicate paths.

---

## 10. Visual Direction

The preferred visual direction is:

> deep indigo calm as structure, generous whitespace as rhythm, and limited human warmth as accent.

Use:

- high-quality typography,
- strong whitespace,
- restrained cards,
- subtle depth,
- clear mobile hierarchy,
- controlled motion,
- accessible contrast.

Avoid:

- excessive rounded cards,
- generic gradients,
- oversized marketing headings,
- horoscope imagery,
- therapy stock photography,
- robot imagery,
- decorative Japanese stereotypes,
- overly feminine botanical branding,
- dense dashboards.

---

## 11. Product Metrics

Primary early metrics:

- state-entry completion,
- private save,
- repeat visit,
- experience relevance,
- save rate,
- try-intent rate,
- tried rate,
- helpfulness rate,
- experience contribution,
- visibility selection,
- recommendation action,
- trust or moderation issue rate.

Do not use time spent as the primary success metric.

---

## 12. MVP Scope and Release Gate

The first product release should include:

- Japanese homepage and entry selection;
- LINE or email registration/login;
- lightweight state check and compatible existing test entries;
- private state space;
- structured experience card creation;
- direct user publication after registration;
- user-selected private or shared visibility;
- state-based discovery;
- save, try, helpful, not-for-me, report, block, edit, and delete actions;
- recommendation bridge;
- trust and methodology page;
- basic administration and post-publication moderation controls.

Release does not require:

- adult-only eligibility;
- invitation-only access;
- manual pre-approval of every experience card;
- separate display-name profile infrastructure;
- private messaging;
- follower counts;
- trending rankings;
- international languages;
- overseas deployment.

The minimum release gate is functional product quality, privacy clarity, user control, basic abuse prevention, and the ability to remove harmful or prohibited content after publication.


---

## 18. AI-Native User Experience

AI must be visible through usefulness, not through technical theater.

User-facing AI capabilities may include:

- turning rough notes into a structured experience card;
- suggesting removal of identifying information;
- producing a dynamic current-state summary;
- explaining why a finite recommendation appeared;
- finding books, music, video, tools, places, activities, and public resources;
- creating a limited daily discovery set;
- remembering user-authorized preferences and past helpful actions;
- offering AI Friend, AI Pet, or Quiet Guide modes;
- supporting LINE-based gentle follow-up;
- helping users discover suitable community or local options.

The interface must distinguish original user content, AI-assisted text, AI synthesis, external sources, commercial content, and demo content.

## 20. Companion UX Boundaries

Companion interactions must be optional, pausable, and adjustable.

Users must be able to control:

- companion mode;
- tone and frequency;
- memory use;
- LINE follow-up;
- recommendation categories;
- quiet periods;
- deletion and forgetting.

The product must not use guilt, jealousy, abandonment language, streak loss, simulated suffering, or threats of relational withdrawal to increase engagement.

## 21. Community and Local UX

Community surfaces should prioritize state topics, structured experience, useful responses, and finite discovery. Local surfaces must avoid exposing precise user locations and must let users select geographic granularity and desired social intensity.

## 22. Digital Legacy UX Boundary

Any future Legacy experience must display persistent, understandable disclosure that the output is AI-generated from authorized material and is not the deceased person. It must provide direct access to source memories, pause, report, administrator contact, and deletion controls.
