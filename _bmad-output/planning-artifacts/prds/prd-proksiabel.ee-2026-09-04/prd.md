---
title: proksiabel.ee — "The Adversary" Rebrand
created: 2026-09-04
updated: 2026-09-04
status: final
---

# PRD: proksiabel.ee — "The Adversary" Rebrand

## 0. Document Purpose

This PRD is for the solo builder/operator of proksiabel.ee (Tom) and for the downstream
BMad workflows that consume it — architecture, epics and stories, and the implementation
loop. It is source-extracted from an existing backlog,
`docs/redesign/2026-09-04-hyper-aggressive-rebrand-backlog.md`, which already carried the
positioning, the thirteen epics and their acceptance criteria; that backlog remains the
narrative reference and is not duplicated here. Prior design theses live in `DESIGN.md`
and `docs/redesign/2026-08-25-offensive-presence-blueprint.md` — this rebrand
**supersedes** them for the public homepage, deliberately. Vocabulary is anchored in the
Glossary (§3); features are grouped with globally numbered FRs nested under them;
inferences are tagged `[ASSUMPTION]` inline and indexed in §9. Technical mechanism and
rejected alternatives are held in `addendum.md` beside this file, not here.

## 1. Vision

proksiabel.ee is the public face of a one-person Estonian offensive-security boutique. Its
current identity sells restraint — an obsidian instrument, one disciplined cyan signal, no
terminals, no neon — and it reads like a brochure for a firm that wants to be trusted. That
positioning is accurate but forgettable, and it buries the single thing no competitor can
copy: this operator's work sits downstream of the Estonian lineage that produced Evilginx
and ProksiAbel's commercial-grade adversary-in-the-middle iterations. The boutique is not
*like* the tools that break MFA. It is descended from them.

This rebrand replaces restraint with notoriety. The homepage should read as the instrument
the operator built to win engagements, not as a services menu: hot temperature,
confrontational and blunt, first-person operator voice, monospace as the brand voice rather
than the data voice, and a palette where the critical red is co-primary instead of reserved
for errors. The thesis in one line: *we built the thing your MFA vendor is scared of, and
now we point it at you — with a contract.*

The word "with a contract" is doing as much work as the swagger. Every heritage claim is
past-tense inherited technical DNA, every engagement is authorized and contracted, and
every factual assertion about a third party is cited or cut. The product succeeds when a
CISO reading it feels the operator is dangerous *and* safe to hire. Aggression without that
second half is a liability, not a brand.

## 2. Target User

### 2.1 Jobs To Be Done

- **Functional (buyer):** decide within one screen whether this operator can actually break
  the MFA and identity stack we just bought, and whether engaging is a defensible
  procurement decision.
- **Emotional (buyer):** feel the pleasant fear of hiring someone who is genuinely on the
  attacker's side of the table, without the fear of hiring someone who will embarrass us.
- **Social (buyer):** be able to justify the choice internally — "they authored the
  category, here are the citations" — to a board that has never heard of the boutique.
- **Functional (peer/recruiter):** verify the lineage and the disclosure record quickly,
  from named, checkable sources.
- **Emotional (builder):** stop apologising for the pedigree. Publish the real story once,
  framed correctly, and let it do the selling.

### 2.2 Non-Users (v1)

- Buyers shopping for compliance-checkbox pentests or bulk vulnerability scanning — the
  tone will read as reckless to them, and that is intentional.
- Anyone seeking unauthorized access to a third party. The site must actively repel this
  reading; see §"Constraints and Guardrails".
- Estonian-language-only casual visitors are *not* excluded — ET parity is required — but
  the primary buying conversation is assumed to happen in EN. `[ASSUMPTION]`

### 2.3 Key User Journeys

- **UJ-1. A CISO arrives sceptical from a referral and leaves convinced within 40 seconds.**
  Maarja, security lead at a mid-size Estonian fintech that just finished a passkey
  rollout, opens proksiabel.ee on desktop from a link a peer sent her. She is not
  authenticated and has no context beyond "he's supposed to be the real thing." Above the
  fold she reads a blunt lineage claim and sees a live-feeling operational status strip
  and a diagram that narrates victim ⇄ proxy ⇄ IdP — she recognises the AiTM shape
  immediately and understands it is conceptual, not a payload. She scrolls once into The
  Arsenal and sees her exact problem named: phishing-resilience and MFA-bypass testing,
  passkey/FIDO2 assessment. **Climax:** she reaches the heritage timeline, sees the
  Evilginx → ProksiAbel → boutique arc with citations and clearly past-tense grey-zone
  framing, and the pedigree resolves from "worrying" to "the reason to hire him."
  **Resolution:** she opens Target Intake and drafts a scoping message. **Edge case:** if
  she has `prefers-reduced-motion` on, the page renders static and must still land the
  same aggression through type, colour and copy alone — no meaning may live only in
  motion.

- **UJ-2. A procurement reviewer checks the claims and finds nothing to flag.**
  Kristjan, legal/procurement at the same fintech, is handed the URL and asked "is this
  safe to sign with?" He reads for liability, not for craft. He finds the RedSWAT
  recognition described as an award-winning *team* effort, the eID findings attributed to
  the operator with AMEDIA corroboration, disclosures kept at case-study altitude with no
  proof-of-concept or payload, and grey-zone history stated in past tense with sources.
  **Climax:** he can find no sentence that reads as advertising present unlawful service.
  **Resolution:** he signs off. **Edge case:** any uncited third-party claim he finds is a
  release blocker, not a copy nit.

- **UJ-3. An Estonian-speaking peer reads the whole thing in ET and it does not read as a
  translation.** Aggressive register survives the language switch, compounds and cases are
  correct because they were validated with tooling rather than guessed, and no section is
  silently EN-only.

## 3. Glossary

- **The Adversary** — the rebrand's north-star positioning: notoriety over restraint,
  operator-first-person voice, heritage as differentiator. Supersedes "Obsidian Instrument."
- **Heritage** — the factual lineage Evilginx → ProksiAbel → today's boutique, framed as
  inherited technical DNA, always past tense for grey-zone periods. Rendered by the
  Heritage Timeline.
- **Heritage Timeline** — the structured, per-entry content model backing the heritage
  section: `{ year, title, body_en, body_et, sources[], grey_zone }`. The single source of
  the heritage narrative for the page, the legal read, and structured data.
- **Grey-zone entry** — a Heritage Timeline entry with `grey_zone: true`; subject to
  stricter gating (past tense + at least one source, or it is cut).
- **The Arsenal** — the capabilities section; the services actually sold, framed as an
  operator's toolkit rather than a menu.
- **Target Intake** — the contact/engagement surface (today `DispatchTerminal`), including
  the PGP path.
- **Operator Terminal** — the console motif now permitted by the rebrand; must read as a
  real proxy/console, not a movie-hacker or Matrix-rain cliché.
- **Legal Read** — the governance pass over all new copy and over the Heritage Timeline
  data file, producing a written sign-off in `docs/redesign/legal-read.md`. A failed Legal
  Read blocks release of the epic it covers.
- **Truthfulness Rules** — the non-negotiable factual constraints: RedSWAT is AMEDIA's
  product and the credential is "award-winning team," never a rank claim and never
  attributed to the boutique; eID findings were the operator's with AMEDIA corroboration;
  disclosures stay at case-study altitude.
- **Token Source** — the single authored design-token file (`src/design/tokens.*`) from
  which CSS custom properties, the Tailwind theme, and the `DESIGN.md` token block are
  generated.
- **Verify Gate** — `pnpm exec tsc -b && pnpm exec biome check && pnpm exec vite build`
  plus a green prerender count; the mechanical pass/fail before any merge.

## 4. Features

### 4.1 Positioning and Voice

**Description:** The narrative spine, locked before any pixel moves. A manifesto states the
Heritage as the reason to hire, and a voice specification makes the tone reproducible by
someone other than its author — including by an implementation agent. The old thesis is
marked superseded rather than deleted, so the reversal is legible to future readers.
Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Published manifesto

The operator can point any reader to a 150–250 word manifesto capturing the Evilginx →
ProksiAbel → boutique lineage as Heritage. Realizes UJ-1.

**Consequences (testable):**
- `docs/redesign/manifesto.md` exists and is 150–250 words.
- A "Positioning" section in `PRODUCT.md` carries the same thesis without contradicting it.
- Every factual claim in it is traceable to a named source.
- It passes the Legal Read.

#### FR-2: Reproducible voice specification

A contributor (human or agent) can write new copy that matches The Adversary voice without
consulting its author.

**Consequences (testable):**
- `DESIGN.md` contains a "Voice" block: blunt, operator first-person ("we", "the box",
  "your stack"), short declaratives, edge without profanity or slurs.
- It contains 10 example lines and 10 anti-examples drawn from the superseded brand.
- Copy elsewhere in the product can be checked against it and judged pass/fail.

#### FR-3: Superseded thesis is marked, not erased

**Consequences (testable):**
- `DESIGN.md` `name`/`description` state The Adversary thesis.
- The "Obsidian Instrument / one disciplined signal" thesis survives under an explicit
  "Superseded" note.
- The old document's "Don'ts" are no longer binding on the homepage and this is stated in
  writing, so an agent reading `DESIGN.md` does not re-impose them.

**Notes:** `[NOTE FOR PM]` FR-3 is load-bearing for agent-driven implementation
specifically — a stale prohibition in `DESIGN.md` will otherwise be obeyed by every
downstream agent.

### 4.2 Visual Identity System

**Description:** The screen must feel hostile-competent rather than corporate-clean, and it
must do so through a system rather than per-component styling. Colour breaks the One Signal
Rule; type makes monospace dominant; motion turns aggressive but never load-bearing;
the Operator Terminal becomes the signature component. Design work runs through the
`/impeccable` skill, including its live-browser iteration loop. Realizes UJ-1.

**Functional Requirements:**

#### FR-4: Aggressive palette with a usage budget

A reader sees an obsidian base with critical red (`#ff3b5c`) promoted to co-primary,
a hazard/amber and a toxic accent added, and cyan demoted from signal to support.

**Consequences (testable):**
- All text/background pairs used in the product meet WCAG AA contrast.
- The palette is documented with a per-colour usage budget, so "co-primary" does not
  degrade into "everything is red."
- Values live in the Token Source, not as raw hex in components (see FR-13).

#### FR-5: Monospace-dominant typography, self-hosted

**Consequences (testable):**
- Monospace carries brand-voice roles, inverting the superseded "data is never prose" rule.
- All fonts are self-hosted woff2; a network capture of any page shows zero third-party
  font requests. (Non-negotiable, GDPR: no CDN, ever.)
- Display weight/tightness is specified in the Token Source.

#### FR-6: Aggressive motion with a static-equivalent fallback

**Consequences (testable):**
- Hero glitch/scanline, redline pulses and faster easings are implemented.
- Under `prefers-reduced-motion`, the page renders static and still reads as aggressive —
  no information or emphasis exists only in motion.
- No animation blocks interaction or content on first paint.

#### FR-7: Operator Terminal as signature component

**Consequences (testable):**
- `DispatchTerminal` is upgraded into the signature motif.
- It reads as a real proxy/console: no green-on-black cliché, no Matrix rain, no fake
  typing that implies capability the product does not have.

**Feature-specific NFRs:**
- Accessibility: WCAG 2.2 AA maintained across the new palette and motion.

### 4.3 Copy and Localisation

**Description:** Every string carries the new temperature in both EN and ET, and the ET is
verified rather than guessed. Section vocabulary shifts to operator language across the
navigation and all sections at once, so the site never reads half-rebranded. Realizes UJ-1,
UJ-3.

**Functional Requirements:**

#### FR-8: Aggressive-voice copy in EN and ET

**Consequences (testable):**
- Hero, Arsenal, Dossier and Target Intake copy in `src/i18n/translations.ts` matches the
  FR-2 voice specification.
- EN and ET have full key parity — no locale falls back silently.
- Estonian is validated with the estonian-mcp tooling (spelling, compound formation,
  register), and the validation is evidenced, not asserted.
- All copy passes the Legal Read.

#### FR-9: Operator vocabulary applied consistently

**Consequences (testable):**
- Section labels and badges use the operator lexicon ("ARSENAL", "TARGET INTAKE", "KILL
  CHAIN", "PROOF").
- The same term is used for the same surface in `Navbar`, `Services`, `Dossier` and
  `DispatchTerminal` — Glossary discipline holds in the product, not just in this document.

#### FR-10: Operator-framed calls to action

**Consequences (testable):**
- "Book a consultation" is replaced with operator framing in both `Hero` and
  `DispatchTerminal`.
- CTA copy still makes the commercial, contracted nature of engagement unambiguous.

### 4.4 Homepage Surfaces

**Description:** The rebrand applied to the page itself, surface by surface: a hero that
establishes notoriety in the first three seconds, an Arsenal that names real services, a
Heritage section that tells the lineage story, a Dossier that supplies receipts, and a
Target Intake that feels like tasking an operator. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-11: Hero establishes the lineage claim

**Consequences (testable):**
- The headline states the lineage claim bluntly, in the FR-2 voice, and passes the Legal
  Read.
- A status strip communicates operational readiness; a harder "operational" indicator
  replaces the soft badge/ping, and is reduced-motion safe.

#### FR-12: AiTM diagram narrates the concept without arming anyone

`AttackVectorGraph` is upgraded into a victim ⇄ proxy ⇄ IdP reverse-proxy diagram.

**Consequences (testable):**
- The diagram conveys MFA-bypass conceptually and is legible at mobile width.
- It contains no working payloads, no configuration, and no real target names.
- Framing is educational/heritage; it passes the Legal Read.

#### FR-13: The Arsenal names services, not crimes

**Consequences (testable):**
- The bento grid presents AiTM/phishing-resilience testing, MFA-bypass red teaming, and
  passkey/FIDO2 assessment (linking to the existing `Fido2PasskeysGuide`).
- Each capability names the commercial service actually sold.
- A "why us" edge states framework-authorship lineage as the differentiator, with sourced
  claims and no rank or ownership inflation.

#### FR-14: Heritage section renders from structured content

A reader sees the timeline Evilginx origin → ProksiAbel's commercial AiTM iterations →
today's licensed boutique. Realizes UJ-1, UJ-2, UJ-3.

**Consequences (testable):**
- A new `Heritage.tsx` (or extended `Dossier.tsx`) renders **purely** from the Heritage
  Timeline model; adding an entry requires no component edit.
- The model is `src/data/heritage.ts` (or `content/heritage/*.md` front matter) with
  `{ year, title, body_en, body_et, sources[], grey_zone }` per entry.
- Every entry carries at least one citation; grey-zone entries are past tense and
  source-backed or they fail the gate.
- Both locales are present per entry, with ET validated by tooling.
- Scroll-driven storytelling motion degrades to a static, ordered timeline under
  `prefers-reduced-motion`.

#### FR-15: Dossier keeps the receipts, in the new voice

**Consequences (testable):**
- RedSWAT recognition and the eID disclosure blocks are re-toned, not weakened.
- Wording obeys the Truthfulness Rules exactly: award-winning team, never a rank claim,
  never attributed to the boutique; eID findings are the operator's with AMEDIA
  corroboration; digidoc4j/SiGa/SiVa material stays at case-study altitude with no PoC.

#### FR-16: Target Intake feels like tasking an operator

**Consequences (testable):**
- `DispatchTerminal` is recast as "TARGET INTAKE" with an operator-console feel.
- The PGP key in `src/config/pgp.ts` and the contact path in `src/data/contact.tsx` are
  functionally unchanged.
- Field, validation, error and success states are all designed and reachable.
- No dark patterns: no fake urgency, no obstructed exit, no pre-checked consent.

### 4.5 Edges: Guides, SEO and Structured Data

**Description:** The rebrand propagates to the pages a search engine and a linking peer see
first, without diluting the technical guides. Realizes UJ-2.

**Functional Requirements:**

#### FR-17: Guide pages match the identity, bodies stay technical

**Consequences (testable):**
- `SsrfGuide`, `IdorGuide` and `Fido2PasskeysGuide` headers and navigation match the new
  identity.
- Guide bodies remain technical and unhyped.
- Shared primitives are either restyled or explicitly documented as deliberately retained.

#### FR-18: Metadata and structured data reflect the new positioning

**Consequences (testable):**
- `index.html` meta/OG, `SEOMeta.tsx`, and `Person`/`Organization` JSON-LD state the new
  positioning.
- Award and article fields honour the Truthfulness Rules.
- The OG image is regenerated to the new identity.
- Where an organisation history is expressible in structured data, it derives from the
  Heritage Timeline model — no divergent hardcoded copy.

#### FR-19: Wordmark consistency

**Consequences (testable):**
- `Footer` and `Navbar` wordmarks match the new identity; no surface still shows the old
  one.

### 4.6 Governance and Truthfulness

**Description:** The mechanism that keeps aggression from becoming liability. This is a
release gate with a written artifact, not a review habit. Realizes UJ-2.

**Functional Requirements:**

#### FR-20: Legal Read as a blocking gate

The operator can point to a written sign-off before releasing any epic.

**Consequences (testable):**
- `docs/redesign/legal-read.md` records a dated sign-off per epic covering: (a) grey-zone
  Heritage stays past tense and clearly historical; (b) nothing reads as advertising
  current unlawful MFA-bypass-for-hire; (c) all engagements are presented as
  authorized/contracted; (d) no third-party defamation.
- An epic whose Legal Read fails does not ship. The gate has teeth or it is theatre.
- For heritage content, the Legal Read runs against the Heritage Timeline data file, not
  against scattered JSX.

#### FR-21: Source-first claim verification

**Consequences (testable):**
- Every claim about the Evilginx origin or ProksiAbel history has a citation, or is cut.
- No third-party factual claim appears uncited anywhere in the product.

### 4.7 Token Pipeline

**Description:** One authored token set drives CSS, Tailwind and `DESIGN.md`, so the
aggressive palette can evolve without hand-syncing hex across files — the failure mode this
rebrand would otherwise walk straight into, since it changes nearly every colour.

**Functional Requirements:**

#### FR-22: Single authored Token Source

**Consequences (testable):**
- The `@theme` block in `src/index.css` holds colour, type scale, spacing, radius, motion
  and elevation, seeded from the FR-4 palette. *(Mechanism set by AD-1: Tailwind v4's
  CSS-first config already emits both the CSS custom properties and the utility theme from
  this one block. No parallel `tokens.json`/`tokens.ts` is introduced.)*
- Every value used on the homepage has a named token; no raw hex remains in components.

#### FR-23: Generated consumers

**Consequences (testable):**
- CSS custom properties and the Tailwind utility theme derive from the Token Source with no
  hand-maintained copy (satisfied natively by `@theme`; see AD-1).
- `scripts/sync-design-tokens.js` regenerates the `DESIGN.md` token frontmatter from the
  Token Source and offers a `--check` mode used by the Verify Gate.
- Editing one token propagates to CSS, Tailwind and docs on rebuild, and the Verify Gate
  stays green.

#### FR-24: Documentation cannot drift

**Consequences (testable):**
- The `DESIGN.md` token block is generated from the Token Source, or parity is asserted in
  CI.
- A drift between `DESIGN.md` and the Token Source fails the build.

#### FR-25: Pipeline stays self-hosted

**Consequences (testable):**
- The token pipeline fetches no external asset and introduces no new network dependency at
  build or runtime.

### 4.8 Quality Gate and Rollout

**Description:** How this ships green, in both languages and both form factors, without
breaking the custom-domain deployment that was recently repaired.

**Functional Requirements:**

#### FR-26: Verify Gate per phase

**Consequences (testable):**
- `pnpm exec tsc -b && pnpm exec biome check && pnpm exec vite build` passes, and the
  prerender count is green, before any merge.

#### FR-27: Accessibility and polish audit

**Consequences (testable):**
- An `/impeccable` audit-mode pass covers contrast, reduced motion, keyboard operability,
  focus order, responsive behaviour and anti-patterns against the new palette and motion.
- Findings are logged and resolved; WCAG 2.2 AA is maintained.

#### FR-28: Cross-locale, cross-viewport visual QA

**Consequences (testable):**
- Playwright/live-browser QA covers EN and ET at mobile and desktop widths.
- Screenshots are archived; no layout breaks.

#### FR-29: Deployment integrity

**Consequences (testable):**
- `pub/` is regenerated by the build.
- The `CNAME` file and custom-domain configuration survive the deploy; proksiabel.ee still
  serves over HTTPS after release.

## 5. Non-Goals (Explicit)

- **Not offering, implying, or advertising unauthorized access.** The site sells authorized,
  contracted engagements. Aggression is tone, never an offer.
- **Not publishing tooling, payloads, configurations, or proof-of-concept material.**
  Including in the AiTM diagram and the guides.
- **Not claiming ownership of RedSWAT** or inflating the credential to a rank. Not claiming
  authorship of Evilginx.
- **Not naming or disparaging real targets, vendors, or third parties.** "Your MFA vendor is
  scared of us" is a category statement, not a named accusation.
- **Not rewriting the technical guide bodies.** Headers and navigation only.
- **Not becoming a blog, a product company, or a training platform.**
- **Not adding third-party CDNs, analytics, fonts, or trackers** to achieve any of the
  above.
- **Not shipping a design that depends on motion to be comprehensible.**

## 6. MVP Scope

### 6.1 In Scope

- Positioning and voice artifacts (§4.1) — the spine everything else is checked against.
- Full visual identity system and token pipeline (§4.2, §4.7).
- EN + ET copy rewrite with validated Estonian (§4.3).
- All homepage surfaces: hero, arsenal, heritage, dossier, target intake (§4.4).
- Heritage Timeline as structured content, with citations and grey-zone gating (FR-14).
- Governance gate with written sign-off (§4.6) — running continuously, not at the end.
- Guides/SEO/structured-data propagation (§4.5).
- Verify Gate, a11y audit, cross-locale visual QA, deployment integrity (§4.8).

### 6.2 Out of Scope for MVP

- Rewriting guide bodies (`SsrfGuide`, `IdorGuide`, `Fido2PasskeysGuide`) — deferred; the
  technical content is currently correct and re-toning it risks the credibility the Dossier
  depends on.
- Case-study pages beyond the existing disclosure blocks — deferred to v2; each new case
  study needs its own Legal Read and possibly client consent.
- Any interactive demo of AiTM behaviour. Not deferred — refused, on §5 grounds.
- Additional locales beyond ET/EN.
- A CMS or authoring UI for the Heritage Timeline. `[NOTE FOR PM]` The structured model
  (FR-14) is the 80% of this that matters; a UI on top is speculative until entries are
  edited often enough to hurt.

## 7. Success Metrics

**Primary**
- **SM-1**: Legal Read sign-off — 100% of released epics carry a dated sign-off in
  `docs/redesign/legal-read.md`, and zero released copy contains an uncited third-party
  claim. Validates FR-20, FR-21, FR-14.
- **SM-2**: The site ships green — Verify Gate passes and WCAG 2.2 AA holds across the new
  palette and motion, in both locales at mobile and desktop. Validates FR-26 through FR-29.
- **SM-3**: The rebrand is complete, not partial — no surface (nav, footer, guides, meta, OG
  image) still presents the superseded identity after release. Validates FR-9, FR-17,
  FR-18, FR-19.

**Secondary**
- **SM-4**: Token single-sourcing holds — zero raw hex in homepage components, and a
  `DESIGN.md`/Token Source drift fails the build. Validates FR-22, FR-23, FR-24.
- **SM-5**: Locale parity — zero missing ET keys, and ET copy passes tooling validation
  rather than review-by-vibes. Validates FR-8, FR-14.
- **SM-6**: Qualitative — the operator can send the URL to a peer without a caveat
  paragraph attached. Validates FR-1, FR-11.

**Counter-metrics (do not optimize)**
- **SM-C1**: Aggression is not maximised. If copy edges toward reading as an offer of
  unlawful service, or toward profanity/slurs, the metric has been gamed. Counterbalances
  SM-6 and the whole of §4.1.
- **SM-C2**: Motion and effect density are not maximised. Every added effect costs first
  paint and reduced-motion fidelity. Counterbalances FR-6, FR-11.
- **SM-C3**: Palette breadth is not maximised. "Co-primary red" plus hazard plus toxic is a
  budget, not a licence; a page where everything shouts says nothing. Counterbalances FR-4.

## Cross-Cutting NFRs

- **Accessibility:** WCAG 2.2 AA across all new surfaces, both locales. Keyboard operability
  and visible focus order are not negotiable against aesthetics.
- **Reduced motion:** every animation gated behind `prefers-reduced-motion`; the static
  render must carry equivalent meaning and comparable impact.
- **Privacy/GDPR:** no third-party CDN, font host, analytics, or tracker — self-hosted only.
  This constrains the token pipeline and the font choice alike.
- **Performance:** the aggressive treatment must not regress first paint or the existing
  prerender pipeline; prerender count stays green.
- **Localisation:** EN/ET parity is structural (enforced by the content model and
  translation keys), not editorial.
- **Determinism for agents:** because implementation runs largely through agents, every
  constraint that matters must be written where an agent will read it — `DESIGN.md`, the
  Token Source, the content model — not held as tacit taste.

## Constraints and Guardrails

**Safety and legality (hard constraints, override all aesthetic goals):**
- Grey-zone Heritage is past tense, historical, and sourced — or it is cut.
- No copy may read as advertising current unlawful MFA-bypass-for-hire.
- All engagements are presented as authorized and contracted.
- No third-party defamation; no named targets.
- No payloads, PoCs, configs, or operational tooling published, in any surface including
  diagrams.

**Truthfulness Rules (verbatim, non-negotiable):**
- RedSWAT is AMEDIA's product. The credential is "award-winning team." Never "1st place."
  Never "ProksiAbel built it."
- The eID findings were the operator's; AMEDIA corroborated.
- Disclosures stay at case-study altitude — digidoc4j/SiGa/SiVa included.

**Privacy:** self-hosted assets only; no CDN, ever.

## Aesthetic and Tone

- **Reference:** an operator's own console — dense, monospaced, hot, confident.
- **Anti-references:** green-on-black movie hacker, Matrix rain, corporate-clean security
  vendor, boutique brochure restraint, neon-for-neon's-sake.
- **Voice:** blunt, operator first person ("we", "the box", "your stack"), short
  declaratives, edge without profanity or slurs. Specified with examples and anti-examples
  in `DESIGN.md` per FR-2.
- **The old `DESIGN.md` "Don'ts" are the previous regime, not constraints.** This is stated
  explicitly because downstream agents will otherwise treat them as binding.

## 8. Open Questions

1. Does the display face need to change, or can weight and tightness on the existing
   self-hosted families carry FR-5? Adding a family costs bytes and a self-hosting step.
2. Is `Heritage.tsx` a new component or an extension of `Dossier.tsx`? Affects epic
   sequencing between FR-14 and FR-15.
3. What is the minimum acceptable citation for the Evilginx origin claim — is a single
   authoritative source enough, or does the grey-zone framing warrant two?
4. Does the Legal Read require an external reviewer, or is a documented self-review by the
   operator sufficient for the sign-off to mean anything?
5. ~~Is `tokens.json` or `tokens.ts` the better Token Source?~~ **Resolved by AD-1:**
   neither — the existing Tailwind v4 `@theme` block in `src/index.css` is the Token Source.
6. Should the ET copy be validated per-string or per-section, and what evidence of
   validation gets recorded?

## 9. Assumptions Index

- §2.2 — the primary buying conversation happens in EN, with ET as parity/credibility
  rather than the main sales path.
- §2.3 (UJ-1) — the buyer persona is a security lead at a mid-size Estonian or Nordic
  organisation arriving via peer referral; there is no analytics evidence for this in the
  product today.
- §4.4 (FR-11) — the "status strip" is presentational, not wired to real operational
  telemetry.
- §6.2 — guide bodies are currently technically correct and do not need revision as part of
  this rebrand.
- §7 (SM-6) — "sendable without a caveat" is the operator's own judgement; there is no
  external panel.
- Throughout — this is a solo-operated project, so "sign-off," "approval," and "gate" mean
  a written artifact the operator produces and future agents check against, not a
  multi-person process.
