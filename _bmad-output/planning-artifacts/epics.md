---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories']
inputDocuments:
  - '_bmad-output/planning-artifacts/prds/prd-proksiabel.ee-2026-09-04/prd.md'
  - '_bmad-output/planning-artifacts/prds/prd-proksiabel.ee-2026-09-04/addendum.md'
  - '_bmad-output/planning-artifacts/architecture/architecture-proksiabel.ee-2026-09-04/ARCHITECTURE-SPINE.md'
  - 'docs/redesign/2026-09-04-hyper-aggressive-rebrand-backlog.md'
---

# proksiabel.ee "The Adversary" Rebrand - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the proksiabel.ee "The
Adversary" rebrand, decomposing the requirements from the PRD and the Architecture Spine
into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Published manifesto (150–250 words) capturing the Evilginx → ProksiAbel → boutique lineage as Heritage, every claim traceable.
FR2: Reproducible voice specification in `DESIGN.md` with 10 examples and 10 anti-examples.
FR3: The superseded "Obsidian Instrument" thesis is marked superseded, not erased, and no longer binding.
FR4: Aggressive palette — critical red co-primary, hazard/amber and toxic accents added, cyan demoted — with a documented usage budget and WCAG AA contrast.
FR5: Monospace-dominant typography, all fonts self-hosted woff2, zero third-party font requests.
FR6: Aggressive motion (glitch/scanline, redline pulses, faster easings) with a static-equivalent `prefers-reduced-motion` fallback.
FR7: `DispatchTerminal` upgraded into the signature Operator Terminal — real proxy/console, no green-on-black cliché.
FR8: Aggressive-voice copy in EN and ET with full key parity, Estonian validated with tooling.
FR9: Operator vocabulary (ARSENAL, TARGET INTAKE, KILL CHAIN, PROOF) applied consistently across nav and all sections.
FR10: Operator-framed CTAs replacing "Book a consultation" in `Hero` and `DispatchTerminal`.
FR11: Hero states the lineage claim bluntly, with a status strip and a hard operational indicator.
FR12: `AttackVectorGraph` upgraded into a victim ⇄ proxy ⇄ IdP AiTM diagram — conceptual only, no payloads or real targets.
FR13: The Arsenal names the real services sold, with framework-authorship lineage as the stated differentiator.
FR14: Heritage section renders purely from a structured, cited, ET/EN-parity content model with grey-zone gating.
FR15: Dossier keeps the RedSWAT and eID receipts, re-toned, obeying the Truthfulness Rules exactly.
FR16: Target Intake recast with an operator-console feel, PGP and contact path unchanged, all field states reachable, no dark patterns.
FR17: Guide page headers and navigation match the new identity; guide bodies stay technical.
FR18: `index.html` meta/OG, `SEOMeta.tsx` and JSON-LD state the new positioning, honour the Truthfulness Rules, and derive history from the Heritage model.
FR19: `Footer` and `Navbar` wordmarks match the new identity.
FR20: Legal Read is a blocking gate with a dated written sign-off per epic in `docs/redesign/legal-read.md`.
FR21: Every claim about Evilginx origin or ProksiAbel history is cited or cut; no uncited third-party claim ships.
FR22: A single authored Token Source holds colour, type, spacing, radius, motion and elevation; no raw hex in components.
FR23: Consumers derive from the Token Source with no hand-maintained copy; a sync script regenerates the `DESIGN.md` token block and offers `--check`.
FR24: Documentation cannot drift — a `DESIGN.md` / Token Source mismatch fails the build.
FR25: The token pipeline fetches no external asset and adds no network dependency.
FR26: Verify Gate per phase — `tsc -b && biome check && vite build` plus a green prerender count.
FR27: Accessibility and polish audit — contrast, reduced motion, keyboard, focus order, responsive, anti-patterns; WCAG 2.2 AA maintained.
FR28: Cross-locale, cross-viewport visual QA (EN + ET, mobile + desktop) with archived screenshots.
FR29: Deployment integrity — `pub/` regenerated, `CNAME` and custom domain intact, HTTPS still serving.

### NonFunctional Requirements

NFR1: WCAG 2.2 AA across all new surfaces in both locales; keyboard operability and visible focus order are not negotiable against aesthetics.
NFR2: Every animation gated behind `prefers-reduced-motion`; the static render carries equivalent meaning and comparable emphasis.
NFR3: Privacy/GDPR — no third-party CDN, font host, analytics or tracker; self-hosted assets only, build-time and runtime.
NFR4: Performance — no regression to first paint or the existing prerender pipeline; prerender count stays green.
NFR5: Localisation — EN/ET parity is structural (enforced by types and the content model), not editorial.
NFR6: Determinism for agents — every binding constraint is written where an agent will read it (`DESIGN.md`, `@theme`, the content model), never held as tacit taste.

### Additional Requirements

- **No starter template.** This is a brownfield change to an existing React 19 / Vite 8 / Tailwind 4 / TypeScript 7 codebase. No scaffolding story is required.
- **AD-1**: The Token Source is the existing Tailwind v4 `@theme` block in `src/index.css`. Do NOT introduce `src/design/tokens.json` or `tokens.ts` — Tailwind v4 CSS-first already emits both the CSS custom properties and the utility theme from that block.
- **AD-2**: `DESIGN.md` token frontmatter is generated one-way from `@theme` by `scripts/sync-design-tokens.js`, with a `--check` mode wired into the Verify Gate.
- **AD-3**: No raw hex and no literal user-visible copy in `src/components/`.
- **AD-4**: ET/EN parity is type-enforced — `en` defines the shape, `et` must satisfy it, and a missing ET key must fail `tsc -b`.
- **AD-5**: Claim-bearing content lives in data modules (`src/data/heritage.ts`, `src/i18n/translations.ts`) that the Legal Read is run against.
- **AD-6**: The Heritage model has exactly three consumers — `Heritage.tsx`, JSON-LD in `SEOMeta.tsx`, and the Legal Read — with no divergent copy.
- **AD-7**: Motion durations and easings are `@theme` tokens; the reduced-motion guard is one shared convention, not per-component duplication.
- **AD-8**: Zero third-party network origins; fonts ship as `@fontsource-*` npm packages.
- **AD-9**: Prerender is sitemap-driven — any new route must be added to `pub/sitemap.xml` in the same change.
- **AD-10**: Two independent gates — mechanical (Verify Gate) and editorial (Legal Read). Neither substitutes for the other.
- **AD-11**: `DESIGN.md` must state which regime binds, or downstream agents will re-impose the superseded "Don'ts".

### UX Design Requirements

No standalone `bmad-ux` design contract exists for this rebrand. The UX contract is carried
by `DESIGN.md` (visual identity and tokens) plus the PRD's "Aesthetic and Tone" section, and
is produced *as part of* Epic 3 rather than consumed as a prior input. Design execution runs
through the `/impeccable` skill per the addendum: live-browser iteration for Epics 3, 5 and
6; audit mode for Epic 9.

### FR Coverage Map

FR1: Epic 1 - Manifesto published
FR2: Epic 1 - Voice specification with examples
FR3: Epic 1 - Old thesis marked superseded
FR4: Epic 3 - Aggressive palette in the Token Source
FR5: Epic 3 - Monospace-dominant, self-hosted type
FR6: Epic 3 - Aggressive motion with reduced-motion fallback
FR7: Epic 7 - Operator Terminal as signature component
FR8: Epic 4 - EN/ET aggressive copy with validated Estonian
FR9: Epic 4 - Operator vocabulary applied consistently
FR10: Epic 4 - Operator-framed CTAs
FR11: Epic 5 - Hero lineage claim and status strip
FR12: Epic 5 - AiTM diagram
FR13: Epic 5 - The Arsenal
FR14: Epic 6 - Heritage as sourced structured data
FR15: Epic 7 - Dossier receipts re-toned
FR16: Epic 7 - Target Intake
FR17: Epic 8 - Guide headers and navigation
FR18: Epic 8 - Meta, OG and structured data
FR19: Epic 8 - Wordmark consistency
FR20: Epic 2 - Legal Read as a blocking gate
FR21: Epic 2 - Source-first claim verification
FR22: Epic 3 - Single authored Token Source
FR23: Epic 3 - Generated consumers and sync script
FR24: Epic 3 - Drift fails the build
FR25: Epic 3 - Pipeline stays self-hosted
FR26: Epic 9 - Verify Gate
FR27: Epic 9 - Accessibility and polish audit
FR28: Epic 9 - Cross-locale, cross-viewport QA
FR29: Epic 9 - Deployment integrity

## Epic List

### Epic 1: The narrative spine is published and binding
The operator can point any reader — human or agent — to a written thesis, voice specification, and an explicit statement of which design regime binds, so that every later story is checkable against a fixed standard instead of tacit taste.
**FRs covered:** FR1, FR2, FR3

### Epic 2: Claims are governed before they are published
The operator has a working editorial gate: a dated sign-off artifact, an enumerated set of claim-bearing files, and a verified source for every heritage claim — so that no later epic can ship an uncited or unlawful-sounding assertion.
**FRs covered:** FR20, FR21

### Epic 3: The site wears the aggressive identity, from one source
A visitor sees a hostile-competent screen — co-primary red, dominant monospace, aggressive motion — and the operator can change any of it in one place without hand-syncing hex across files or drifting the design document.
**FRs covered:** FR4, FR5, FR6, FR22, FR23, FR24, FR25

### Epic 4: Every string speaks in the operator's voice, in both languages
A visitor in EN or ET reads copy that carries the new temperature, in a consistent operator vocabulary, with no missing translations — and a missing ET key stops compiling rather than shipping.
**FRs covered:** FR8, FR9, FR10

### Epic 5: The first screen establishes notoriety
A visitor lands and, within three seconds, reads the lineage claim, sees a conceptual AiTM diagram they recognise, and finds their exact problem named in The Arsenal.
**FRs covered:** FR11, FR12, FR13

### Epic 6: The heritage story is told as sourced data
A visitor reads the Evilginx → ProksiAbel → boutique timeline with citations and clearly historical grey-zone framing, and the operator can add an entry by editing one data file that the page, the structured data, and the Legal Read all read.
**FRs covered:** FR14

### Epic 7: The swagger is backed by receipts and a way in
A visitor who is convinced can verify the record and then task the operator through a console-feel intake, with the PGP path intact.
**FRs covered:** FR7, FR15, FR16

### Epic 8: The rebrand reaches every edge
A visitor arriving on a guide page, or seeing the site shared in a link preview or a search result, meets the same identity — no surface still shows the superseded brand.
**FRs covered:** FR17, FR18, FR19

### Epic 9: It ships green
The operator can release with mechanical and accessibility confidence in both locales and both form factors, without breaking the custom-domain deployment.
**FRs covered:** FR26, FR27, FR28, FR29

---

## Epic 1: The narrative spine is published and binding

The operator can point any reader — human or agent — to a written thesis, voice
specification, and an explicit statement of which design regime binds, so that every later
story is checkable against a fixed standard instead of tacit taste. This epic ships first
because AD-11 identifies the highest-probability failure of the whole rebrand: an agent
reading the stale `DESIGN.md` "Don'ts" and enforcing the brand this work exists to replace.

### Story 1.1: Publish the brand manifesto

As the operator,
I want a short written manifesto that states the lineage as the reason to hire,
So that every later piece of copy has a fixed thesis to be checked against rather than being re-argued per surface.

**Acceptance Criteria:**

**Given** no manifesto exists today
**When** the story is complete
**Then** `docs/redesign/manifesto.md` exists and is between 150 and 250 words
**And** it captures the Evilginx → ProksiAbel → boutique lineage as inherited technical DNA, in past tense for grey-zone periods
**And** `PRODUCT.md` carries a "Positioning" section stating the same thesis without contradicting it
**And** every factual claim in it names a traceable source

**Given** the manifesto draft is written
**When** it is checked against the Truthfulness Rules
**Then** it contains no rank claim about RedSWAT, no claim that ProksiAbel built RedSWAT, and no claim of Evilginx authorship
**And** it reads as describing authorized, contracted engagements

### Story 1.2: Specify the voice with examples and anti-examples

As a contributor or implementation agent writing new copy,
I want the Adversary voice specified concretely enough to apply without consulting its author,
So that copy written across many stories and sessions lands in one voice instead of drifting.

**Acceptance Criteria:**

**Given** `DESIGN.md` has no Voice block
**When** the story is complete
**Then** `DESIGN.md` contains a "Voice" block defining: blunt, operator first-person ("we", "the box", "your stack"), short declaratives, edge without profanity or slurs
**And** it lists 10 example lines that pass
**And** it lists 10 anti-examples drawn from the superseded restrained brand
**And** an arbitrary candidate sentence can be judged pass/fail against it by someone who has not seen the rest of this work

### Story 1.3: Mark the old thesis superseded and state which regime binds

As an implementation agent about to make a design decision,
I want `DESIGN.md` to state unambiguously which brand regime is in force,
So that I do not enforce the superseded "Don'ts" — no terminals, one signal rule, restrained motion — against the very work meant to overturn them.

**Acceptance Criteria:**

**Given** `DESIGN.md` frontmatter currently states "Precision offensive-security presence — obsidian depth, one disciplined signal"
**When** the story is complete
**Then** the `name`/`description` state the Adversary thesis
**And** the previous thesis survives under an explicit "Superseded — not binding" heading rather than being deleted
**And** every prohibition retained from the old regime is restated affirmatively under the new one, or is explicitly released

**Given** an agent reads `DESIGN.md` cold
**When** it looks for constraints on terminals, colour count, or motion intensity
**Then** it finds the new regime's rules and finds the old ones plainly marked as not binding

---

## Epic 2: Claims are governed before they are published

The operator has a working editorial gate before any new claim-bearing copy exists. Standing
this up second — not last — is deliberate: a gate created after the copy is written grades
its own homework.

### Story 2.1: Stand up the Legal Read gate artifact

As the operator,
I want a single dated sign-off file that enumerates exactly which files were reviewed and what the verdict was,
So that "the copy was reviewed" is a checkable fact rather than a memory.

**Acceptance Criteria:**

**Given** no governance artifact exists
**When** the story is complete
**Then** `docs/redesign/legal-read.md` exists with one entry per epic
**And** each entry records the date, the epic, the exact files reviewed, and a pass/fail verdict
**And** each entry checks all four criteria: grey-zone heritage is past tense and historical; nothing reads as advertising current unlawful MFA-bypass-for-hire; all engagements are presented as authorized and contracted; no third-party defamation
**And** the file states that a failed entry blocks release of that epic

**Given** an epic's copy changes after a pass verdict
**When** the epic is re-submitted
**Then** a new dated entry is required; an earlier pass does not carry forward

### Story 2.2: Enumerate the claim-bearing surface

As a reviewer performing the Legal Read,
I want a fixed list of files that can contain a factual claim,
So that the review is a bounded file read rather than an open-ended sweep of every component.

**Acceptance Criteria:**

**Given** AD-5 requires claim-bearing content to live in data modules
**When** the story is complete
**Then** `docs/redesign/legal-read.md` names the claim-bearing surface: `src/data/heritage.ts`, `src/i18n/translations.ts`, `src/config/legal.ts`, `index.html` meta, and the JSON-LD in `SEOMeta.tsx`
**And** the rule is stated that a factual claim appearing outside those files is a defect

### Story 2.3: Verify or cut every heritage claim

As a procurement reviewer reading the site for liability,
I want every claim about Evilginx's origin and ProksiAbel's history to be sourced,
So that I can sign off without finding an assertion the site cannot back.

**Acceptance Criteria:**

**Given** the manifesto from Story 1.1 and the intended heritage narrative
**When** each factual claim about a third party or about historical events is examined
**Then** it carries at least one citation, or it is cut from the narrative
**And** the citations are recorded so Epic 6's content model can consume them
**And** no claim is retained on the strength of confident recollection alone

**Given** a claim concerns RedSWAT or the eID findings
**When** it is verified
**Then** it matches the Truthfulness Rules exactly: RedSWAT is AMEDIA's product and the credential is "award-winning team"; the eID findings were the operator's with AMEDIA corroboration; disclosure material stays at case-study altitude with no proof-of-concept

---

## Epic 3: The site wears the aggressive identity, from one source

A visitor sees a hostile-competent screen, and the operator can change any of it in one
place. Backlog Epics 1 and 11 are merged here because they modify the same core files
(`src/index.css` `@theme`, `DESIGN.md`) end to end — splitting them would mean two epics
editing the same token block in sequence.

### Story 3.1: Establish the aggressive palette in the Token Source

As a visitor,
I want the screen to read as hostile-competent rather than corporate-clean,
So that the brand's temperature is legible before I have read a single sentence.

**Acceptance Criteria:**

**Given** `src/index.css` `@theme` currently reserves `signal-critical` for errors and treats `cyan-core` as the single signal
**When** the story is complete
**Then** `@theme` promotes `#ff3b5c` to a co-primary role, adds a hazard/amber and a toxic accent, and demotes cyan to a support role
**And** the obsidian surface ladder is retained
**And** no new token file is introduced — `@theme` remains the single Token Source per AD-1

**Given** the new palette is applied
**When** every text-on-background pair in use is measured
**Then** all meet WCAG 2.2 AA contrast

**Given** "co-primary red" could degrade into "everything is red"
**When** the palette is documented
**Then** a per-colour usage budget is recorded stating where each colour may and may not appear

### Story 3.2: Make monospace the brand voice, self-hosted

As a visitor,
I want the typography to read as machine-voice rather than brochure-voice,
So that the page feels like an operator's instrument instead of a marketing site.

**Acceptance Criteria:**

**Given** the superseded regime treated monospace as the data voice only
**When** the story is complete
**Then** monospace carries brand-voice roles in the type scale, and display weight and tightness are pushed harder
**And** all type scale values live in `@theme`

**Given** the page is loaded with a network capture running
**When** the requests are inspected
**Then** zero font requests go to a third-party host; all fonts are self-hosted woff2 delivered from the origin via `@fontsource-*` packages

### Story 3.3: Add aggressive motion with a static-equivalent fallback

As a visitor with `prefers-reduced-motion` enabled,
I want the static render to be just as aggressive and just as complete,
So that turning off motion does not turn the brand off or hide content from me.

**Acceptance Criteria:**

**Given** motion values are currently ad hoc
**When** the story is complete
**Then** durations and easings are `@theme` tokens, and the reduced-motion guard is expressed once as a shared convention rather than duplicated per component

**Given** glitch/scanline, redline pulse and faster easing treatments are implemented
**When** `prefers-reduced-motion: reduce` is active
**Then** the page renders static and still reads as aggressive through type, colour and copy
**And** no information, emphasis, or content is available only via motion

**Given** the page is loading
**When** first paint occurs
**Then** no animation blocks interaction or delays content

### Story 3.4: Generate the `DESIGN.md` token block and fail the build on drift

As an implementation agent reading `DESIGN.md` before designing,
I want its token frontmatter to be guaranteed identical to the code,
So that I do not design against colours the site stopped using three stories ago.

**Acceptance Criteria:**

**Given** `DESIGN.md` frontmatter currently duplicates every colour and type value by hand
**When** the story is complete
**Then** `scripts/sync-design-tokens.js` parses the `@theme` block and regenerates the `colors:` and `typography:` frontmatter of `DESIGN.md`
**And** the generator is one-way: `@theme` → `DESIGN.md`, never the reverse

**Given** a token is changed in `@theme` but `DESIGN.md` is not regenerated
**When** `scripts/sync-design-tokens.js --check` runs
**Then** it exits non-zero and names the drifting tokens
**And** the check is wired into the Verify Gate so the build fails

**Given** the token tooling runs
**When** its network activity is observed
**Then** it fetches nothing external and introduces no new runtime or build-time network dependency

### Story 3.5: Remove raw hex from components

As the operator changing the palette later,
I want every homepage value to resolve to a named token,
So that a palette change is one edit rather than a grep-and-pray across components.

**Acceptance Criteria:**

**Given** components may carry literal colour values
**When** the story is complete
**Then** no raw hex remains in `src/components/`; colours are referenced via Tailwind utilities or `var(--…)`
**And** every value used on the homepage has a named token in `@theme`
**And** the Verify Gate still passes

---

## Epic 4: Every string speaks in the operator's voice, in both languages

Copy is rewritten as one pass across all sections, so the site is never half-rebranded, and
ET parity stops being a review promise and becomes a compile error.

*File-overlap note:* later epics add new translation keys for the surfaces they build, which
touches `translations.ts` again. Consolidation was considered and rejected — the value of
this epic is a single voice pass over the existing copy, which is lost if the rewrite is
split across the component epics.

### Story 4.1: Make ET/EN parity a compile error

As the operator,
I want a missing Estonian key to fail the build,
So that locale gaps are caught mechanically instead of being discovered by an Estonian reader.

**Acceptance Criteria:**

**Given** `src/i18n/translations.ts` is a single `as const` object whose `en` and `et` shapes are inferred independently
**When** the story is complete
**Then** `en` defines the shape and `et` is declared to satisfy it
**And** deleting or misspelling any key inside `et` causes `pnpm exec tsc -b` to fail
**And** the existing `Language` and `TranslationKeys` exports still work for consumers

**Given** the ET locale is rendered
**When** a key resolves
**Then** it never silently falls back to the EN string

### Story 4.2: Rewrite the section copy in the operator voice, EN and ET

As a visitor,
I want every section to carry the same hot temperature,
So that the site reads as one voice rather than a rebranded hero bolted onto old brochure copy.

**Acceptance Criteria:**

**Given** the voice specification from Story 1.2
**When** hero, services, dossier and contact copy in `src/i18n/translations.ts` is rewritten
**Then** each string is judgeable as passing against that specification
**And** EN and ET have full key parity

**Given** Estonian strings are written
**When** they are validated
**Then** validation uses the estonian-mcp tooling for spelling, compound formation and register — not model judgement
**And** the validation evidence is recorded, not merely asserted

**Given** the rewritten copy
**When** it is submitted for the Legal Read
**Then** it passes all four criteria from Story 2.1

### Story 4.3: Apply the operator vocabulary consistently

As a visitor navigating the page,
I want the same surface to be called the same thing in the nav, the heading and the body copy,
So that the operator lexicon reads as deliberate rather than as inconsistent theming.

**Acceptance Criteria:**

**Given** section labels currently use the superseded vocabulary
**When** the story is complete
**Then** the lexicon ARSENAL, TARGET INTAKE, KILL CHAIN and PROOF is applied
**And** each term names exactly one surface, used identically in `Navbar`, `Services`, `Dossier` and `DispatchTerminal`
**And** no surface is referred to by two different names anywhere in either locale

### Story 4.4: Recast the calls to action in operator framing

As a visitor ready to engage,
I want the call to action to sound like tasking an operator,
So that the final step matches the temperature of everything that convinced me.

**Acceptance Criteria:**

**Given** the CTA currently reads "Book a consultation"
**When** the story is complete
**Then** both the `Hero` and `DispatchTerminal` CTAs use operator framing in EN and ET
**And** the copy still makes the commercial, contracted nature of the engagement unambiguous
**And** it passes the Legal Read criterion that nothing reads as an offer of unlawful service

---

## Epic 5: The first screen establishes notoriety

### Story 5.1: Rebuild the hero around the lineage claim

As a sceptical visitor arriving from a referral,
I want the first screen to state plainly why this operator is different,
So that I decide to keep scrolling instead of closing the tab.

**Acceptance Criteria:**

**Given** the hero currently leads with restrained positioning
**When** the story is complete
**Then** the headline states the lineage claim bluntly, in the Story 1.2 voice, in EN and ET
**And** a status strip communicates operational readiness
**And** the soft badge/ping is replaced with a harder operational indicator
**And** the indicator is reduced-motion safe and conveys its state without animation

**Given** the hero copy makes a factual claim
**When** it is reviewed
**Then** it passes the Legal Read and every claim traces to a Story 2.3 source

### Story 5.2: Turn the attack-vector graphic into a conceptual AiTM diagram

As a security lead reading the hero,
I want a diagram I recognise as the real adversary-in-the-middle shape,
So that I can tell within seconds that this operator actually works at this level.

**Acceptance Criteria:**

**Given** `AttackVectorGraph.tsx` renders a generic graphic
**When** the story is complete
**Then** it renders a victim ⇄ proxy ⇄ IdP reverse-proxy diagram that narrates MFA bypass conceptually
**And** it is legible at mobile width
**And** it degrades to a static, still-legible diagram under `prefers-reduced-motion`

**Given** the diagram is published
**When** it is inspected for operational content
**Then** it contains no working payload, no configuration, and no real target or vendor name
**And** its framing is educational and heritage-oriented, and it passes the Legal Read

### Story 5.3: Recast the capabilities grid as The Arsenal

As a visitor with a specific problem,
I want to see my exact problem named as something this operator sells,
So that I know whether to keep reading or leave.

**Acceptance Criteria:**

**Given** `Services.tsx` presents a services menu
**When** the story is complete
**Then** the bento grid presents AiTM/phishing-resilience testing, MFA-bypass red teaming, and passkey/FIDO2 assessment
**And** the passkey capability links to the existing `Fido2PasskeysGuide`
**And** each capability names the commercial service actually sold, not a crime

**Given** the differentiator is stated
**When** the "why us" content is reviewed
**Then** it names framework-authorship lineage as the edge
**And** every heritage claim in it is sourced, with no rank or ownership inflation

---

## Epic 6: The heritage story is told as sourced data

Backlog Epics 5 and 12 are merged: the timeline component and its content model are the same
deliverable, and building the component first would mean writing the narrative twice.

### Story 6.1: Model the heritage timeline as structured content

As the operator,
I want the heritage narrative to live in one typed data file,
So that adding an entry is a data edit and the Legal Read has a single file to review instead of scattered JSX.

**Acceptance Criteria:**

**Given** no heritage content model exists
**When** the story is complete
**Then** `src/data/heritage.ts` exports a typed array of `{ year, title, body_en, body_et, sources[], grey_zone }`
**And** `body_en` and `body_et` are both required, non-optional fields
**And** `sources` is a non-empty array of URLs for every entry

**Given** an entry has `grey_zone: true`
**When** it is written
**Then** it is in past tense and is source-backed, or it is cut
**And** the entry's citations come from the Story 2.3 verification

**Given** the entries are populated
**When** the Estonian bodies are written
**Then** they are validated with the estonian-mcp tooling, not guessed

### Story 6.2: Render the heritage timeline purely from the model

As a visitor,
I want to read the Evilginx → ProksiAbel → boutique arc on the page with its citations,
So that the pedigree resolves from worrying into the reason to hire.

**Acceptance Criteria:**

**Given** `src/data/heritage.ts` exists
**When** `Heritage.tsx` is built
**Then** it renders purely from the model, and adding a timeline entry requires no component edit
**And** citations are visible or reachable for every entry
**And** grey-zone entries read as clearly historical

**Given** scroll-driven storytelling motion is applied
**When** `prefers-reduced-motion: reduce` is active
**Then** the timeline renders as a static, correctly ordered list with all entries present

**Given** the timeline is rendered
**When** it is checked in ET
**Then** every entry displays its Estonian body with no EN fallback

### Story 6.3: Feed the heritage model into structured data

As a search engine or a link preview,
I want the organisation history to match what the page says,
So that the structured data cannot drift from the visible narrative.

**Acceptance Criteria:**

**Given** JSON-LD in `SEOMeta.tsx` could restate the history independently
**When** the story is complete
**Then** any timeline or organisation-history expressed in structured data derives from `src/data/heritage.ts`
**And** no divergent hardcoded heritage copy exists in `SEOMeta.tsx` or `index.html`
**And** the emitted structured data honours the Truthfulness Rules

---

## Epic 7: The swagger is backed by receipts and a way in

### Story 7.1: Re-tone the dossier without weakening the receipts

As a procurement reviewer,
I want the recognition and disclosure records stated precisely,
So that I can verify the operator's record without finding an overstatement.

**Acceptance Criteria:**

**Given** `Dossier.tsx` and `Disclosure.tsx` carry the RedSWAT recognition and eID disclosure blocks
**When** the story is complete
**Then** both are re-toned to the new voice without weakening their factual content

**Given** the re-toned wording
**When** it is checked against the Truthfulness Rules
**Then** RedSWAT is described as an award-winning **team** effort, never as a rank claim, and never as built by ProksiAbel
**And** the eID findings are attributed to the operator with AMEDIA corroboration
**And** digidoc4j/SiGa/SiVa material stays at case-study altitude with no proof-of-concept or payload
**And** the Legal Read passes

### Story 7.2: Upgrade the terminal into the signature operator console

As a visitor,
I want the terminal to look like a real proxy console,
So that it reads as the operator's actual instrument rather than as movie-hacker decoration.

**Acceptance Criteria:**

**Given** the superseded regime banned fake CLIs and the rebrand permits an operator terminal
**When** `DispatchTerminal.tsx` is upgraded
**Then** it reads as a real proxy/console and becomes the signature component of the page
**And** it uses no green-on-black cliché and no Matrix rain
**And** it does not simulate capability the product does not have

**Given** the terminal animates
**When** `prefers-reduced-motion: reduce` is active
**Then** it renders static with all content present

### Story 7.3: Recast contact as Target Intake

As a visitor ready to engage,
I want submitting a scoping request to feel like tasking an operator and to actually work,
So that the strongest moment on the page is not the one that breaks.

**Acceptance Criteria:**

**Given** the contact surface exists as `DispatchTerminal`
**When** the story is complete
**Then** it is presented as "TARGET INTAKE" with an operator-console feel in EN and ET
**And** the PGP key in `src/config/pgp.ts` and the contact path in `src/data/contact.tsx` are functionally unchanged

**Given** a visitor interacts with the form
**When** they encounter each state
**Then** field, validation, error and success states are all designed and reachable
**And** every field is keyboard operable with a visible focus indicator

**Given** the form is reviewed for dark patterns
**When** it is inspected
**Then** it contains no fake urgency, no obstructed exit, and no pre-checked consent

---

## Epic 8: The rebrand reaches every edge

### Story 8.1: Match guide page headers to the new identity

As a visitor arriving directly on a guide page from search,
I want the page to look like the same site,
So that I do not land on a surface that still advertises the superseded brand.

**Acceptance Criteria:**

**Given** `SsrfGuide`, `IdorGuide` and `Fido2PasskeysGuide` use the old primitives
**When** the story is complete
**Then** their headers and navigation match the new identity
**And** the technical guide bodies remain unchanged and unhyped
**And** shared primitives are either restyled or explicitly documented as deliberately retained

### Story 8.2: Update metadata, Open Graph and structured data

As a person seeing the site shared in a link preview or a search result,
I want the summary to state the new positioning,
So that the first impression outside the site matches the one on it.

**Acceptance Criteria:**

**Given** `index.html` meta/OG and `SEOMeta.tsx` state the superseded positioning
**When** the story is complete
**Then** meta, OG and the `Person`/`Organization` JSON-LD state the new positioning
**And** award and article fields honour the Truthfulness Rules
**And** the OG image is regenerated to the new identity

**Given** the prerender pipeline is sitemap-driven
**When** the build runs
**Then** the prerendered page count is unchanged and green

### Story 8.3: Bring the wordmark into line

As a visitor,
I want the wordmark to be the same everywhere,
So that no corner of the site contradicts the identity.

**Acceptance Criteria:**

**Given** `Navbar` and `Footer` carry the old wordmark
**When** the story is complete
**Then** both match the new identity
**And** a sweep of the rendered site finds no surface still presenting the superseded wordmark

---

## Epic 9: It ships green

### Story 9.1: Enforce the Verify Gate

As the operator,
I want one command chain that must pass before any merge,
So that mechanical breakage is caught before it reaches the domain.

**Acceptance Criteria:**

**Given** a change is ready to merge
**When** the Verify Gate runs
**Then** `pnpm exec tsc -b && pnpm exec biome check && pnpm exec vite build` passes
**And** the token-parity check from Story 3.4 passes
**And** the prerendered page count matches the sitemap route count

**Given** the Verify Gate passes
**When** release is considered
**Then** a passing Verify Gate alone does not authorise release — the epic's Legal Read entry must also pass

### Story 9.2: Run the accessibility and polish audit

As a visitor using a keyboard, a screen reader, or reduced motion,
I want the aggressive redesign to remain fully usable,
So that the new identity does not cost me access to the site.

**Acceptance Criteria:**

**Given** the new palette and motion are in place
**When** an `/impeccable` audit-mode pass runs
**Then** it covers contrast, reduced motion, keyboard operability, focus order, responsive behaviour and anti-patterns
**And** WCAG 2.2 AA is maintained across all new surfaces in both locales
**And** findings are logged and resolved rather than acknowledged

### Story 9.3: Visual QA across locales and viewports

As the operator,
I want proof the site holds together in EN and ET at mobile and desktop,
So that a layout break in the less-tested locale does not ship.

**Acceptance Criteria:**

**Given** the rebuilt pages
**When** browser QA runs
**Then** EN and ET are captured at mobile and desktop widths
**And** screenshots are archived
**And** no layout breaks, overflow, or clipped content are present — including where Estonian strings run longer than English

### Story 9.4: Confirm deployment integrity

As a visitor typing the domain,
I want the site to still resolve over HTTPS after the rebrand ships,
So that the release does not repeat the custom-domain loss this project already fixed once.

**Acceptance Criteria:**

**Given** the build writes to `pub/`
**When** the release build runs
**Then** `pub/` is regenerated and `pub/CNAME` is present in the output

**Given** the deploy completes
**When** the domain is requested
**Then** proksiabel.ee serves HTTP 200 over HTTPS
**And** the www subdomain still redirects to the apex
**And** the custom domain configuration is intact
