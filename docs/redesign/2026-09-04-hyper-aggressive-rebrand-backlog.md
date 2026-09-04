# Rebrand Backlog — "The Adversary" (hyper-aggressive operator)

> Branch: `feat/hyper-aggressive`. Supersedes the "Precision Offensive
> Engineering / Obsidian Instrument" thesis (`DESIGN.md`,
> `docs/redesign/2026-08-25-offensive-presence-blueprint.md`) for the public
> homepage. Legal/guide pages keep the old primitives until Epic 8.

## North Star

**"The Adversary."** Where the old brand sold *restraint* — "credibility comes
from restraint," no CLIs, no neon, one disciplined cyan signal — this rebrand
sells *notoriety*. The site should read like the tool the operator built to win,
not the boutique's brochure. Temperature is hot: confrontational, blunt,
first-person-operator, proud of the lineage that runs from the Estonian
researcher who wrote Evilginx, through ProksiAbel's commercial-grade AiTM
iterations, into today's boutique. The feeling in one line: *"We built the thing
your MFA vendor is scared of. Now we point it at you — with a contract."*

The old DESIGN.md explicitly forbids the aggressive aesthetic. This backlog
**intentionally overturns those bans.** That is the whole point — do not treat
the "Don'ts" in DESIGN.md as constraints here; treat them as the previous
regime.

### Design tooling: `/impeccable` is the default frontend driver
Every design/build/critique story below is executed **through the `/impeccable`
skill** (frontend design intelligence: visual hierarchy, theming, tokens, color,
typography, motion, micro-interactions, responsive, a11y, UX copy, error/empty
states, i18n, live browser iteration, ambitious visual effects). When a story
says "run `/impeccable` for X", that is the working mode, not a suggestion. Use
its live-browser iteration loop for the loud effects (Epics 1, 3, 5) and its
audit mode for the quality gate (Epic 10).

### Truthfulness guardrail (non-negotiable, applies to every epic)
Aggressive tone, honest facts. Enforce the existing rules from
[[redswat-hackathon-credential]]: RedSWAT is AMEDIA's product (Tom was a team
member — "award-winning team," never "1st place," never "ProksiAbel built it");
the eID findings were Tom's, AMEDIA corroborated; disclosures stay at case-study
altitude, no PoC/payloads. The heritage narrative (Evilginx origin, ProksiAbel's
grey-zone past) is framed as **inherited technical DNA**, past tense — not an
advertisement of present criminal service. See Epic 9.

---

## Epic 0 — Positioning & narrative spine
*Goal: lock the story before any pixels move.*

- **0.1** Write the new brand manifesto (150–250 words) capturing the Evilginx →
  ProksiAbel → boutique lineage as heritage. Output: `PRODUCT.md` "Positioning"
  section + a `docs/redesign/manifesto.md`. **AC:** passes the Epic 9 legal read;
  every factual claim traceable to a source.
- **0.2** Define the voice: blunt, operator first-person ("we", "the box", "your
  stack"), short declaratives, controlled profanity-adjacent edge without actual
  slurs/profanity. Add a "Voice" block to `DESIGN.md`. **AC:** 10 example
  lines + 10 anti-examples (things the old brand would have said).
- **0.3** Rename the design north star in `DESIGN.md` frontmatter/`description`
  from "Obsidian Instrument / one disciplined signal" to the new thesis. **AC:**
  `DESIGN.md` `name`/`description` updated; old thesis moved to a "Superseded"
  note, not deleted.

## Epic 1 — Visual identity overhaul
*Goal: make the screen feel hostile-competent, not corporate-clean.*
*Driver: `/impeccable` — run it to design the palette/type/motion system and to*
*live-iterate the aggressive look in-browser before committing tokens.*

- **1.1 Color.** Break "The One Signal Rule." Introduce an aggressive palette:
  keep obsidian base, but promote `signal-critical` (#ff3b5c) from a rare error
  color to a co-primary; add a hazard/amber and a toxic accent. Cyan demoted.
  Update tokens in `DESIGN.md` + `src/index.css` custom properties. Use
  `/impeccable` for the color system + AA-contrast validation. **AC:**
  contrast still ≥ WCAG AA on text; new palette documented with usage budget.
- **1.2 Type.** Push weight and tightness harder; make monospace *dominant*
  (invert the "data is never prose" rule — the machine voice becomes the brand
  voice). Consider a heavier/condensed display face (self-hosted only —
  [[fonts-self-hosted-no-cdn]], no CDN ever). **AC:** fonts self-hosted woff2;
  no third-party font request in network tab.
- **1.3 Motion & atmosphere.** Replace the "purposeful, restrained" spring
  motion with aggressive motion: glitch/scanline on hero, redline pulses,
  faster easings. Keep every animation behind `prefers-reduced-motion`. Drive
  the motion + micro-interaction design with `/impeccable` (motion, ambitious
  visual effects, reduced-motion fallbacks). **AC:** reduced-motion renders a
  static, still-aggressive layout.
- **1.4 Terminal is now allowed.** The old thesis banned fake CLIs; the rebrand
  *embraces* an operator terminal motif (real-looking, not Matrix-rain cliché).
  Repurpose/upgrade `DispatchTerminal` into the signature component. **AC:** no
  green-on-black cliché; reads as a real proxy/console, not a movie hacker.

## Epic 2 — Copy & i18n rewrite
*Goal: every string carries the new temperature, ET + EN.*

- **2.1** Rewrite `src/i18n/translations.ts` hero/services/dossier/contact copy
  to the aggressive voice. **AC:** EN + ET parity; Estonian validated with the
  estonian-mcp tools (spell/compound/register), not guessed.
- **2.2** Rewrite section labels/badges to operator vocabulary ("ARSENAL",
  "TARGET INTAKE", "KILL CHAIN", "PROOF"). **AC:** consistent across `Navbar`,
  `Services`, `Dossier`, `DispatchTerminal`.
- **2.3** CTA copy: "Book a consultation" → operator framing ("Engage the
  operator" / "Point it at us"). **AC:** `Hero` + `DispatchTerminal` CTAs updated.

## Epic 3 — Hero rebuild (`src/components/Hero.tsx`, `AttackVectorGraph.tsx`)
*Goal: first 3 seconds establish notoriety.*
*Driver: `/impeccable` live-browser loop — this is the highest-stakes surface;*
*iterate the hero effect, hierarchy, and above-the-fold rhythm visually.*

- **3.1** New hero headline stating the lineage claim bluntly + a live "status"
  strip. **AC:** matches voice from 0.2; passes Epic 9.
- **3.2** Upgrade `AttackVectorGraph` into an AiTM reverse-proxy diagram
  (victim ⇄ proxy ⇄ IdP) that visibly narrates MFA-bypass *conceptually* — no
  working payloads, no real target names. **AC:** educational/heritage framing,
  legal read passed.
- **3.3** Replace the soft badge/ping with a harder "operational" indicator.
  **AC:** reduced-motion safe.

## Epic 4 — Arsenal / capabilities (`src/components/Services.tsx`)
*Goal: reframe services as an arsenal, not a menu.*
*Driver: `/impeccable` for the bento layout, visual hierarchy, and card states.*

- **4.1** Recast the bento grid as "The Arsenal" — AiTM/phishing-resilience
  testing, MFA-bypass red teaming, passkey/FIDO2 assessment (ties to existing
  `Fido2PasskeysGuide`). **AC:** each capability names the real service sold, not
  a crime.
- **4.2** Add a "why us" edge: the framework-authorship lineage as the
  differentiator. **AC:** heritage claims sourced; no rank/ownership inflation.

## Epic 5 — Heritage / notoriety section (new component)
*Goal: tell the Evilginx → ProksiAbel → boutique story on-page.*
*Driver: `/impeccable` for the timeline layout + scroll-driven storytelling motion.*

- **5.1** New `Heritage.tsx` (or extend `Dossier.tsx`): timeline from the
  Estonian Evilginx origin → ProksiAbel's commercial AiTM iterations (past
  tense, grey-zone acknowledged as history) → today's licensed boutique. **AC:**
  every sentence legal-read approved; grey-zone framed as inherited DNA, not
  offered service.
- **5.2** Add citations/links where claims are externally verifiable. **AC:** no
  uncited factual claim about third parties.

## Epic 6 — Proof / dossier (`src/components/Dossier.tsx`, `Disclosure.tsx`)
*Goal: back the swagger with receipts.*

- **6.1** Keep and re-tone the RedSWAT recognition + eID disclosure blocks under
  the new voice. **AC:** wording obeys [[redswat-hackathon-credential]] exactly
  (award-winning team; findings = Tom's, AMEDIA corroborated; digidoc4j/SiGa/SiVa
  case-study altitude, no PoC).

## Epic 7 — Engagement / contact (`src/components/DispatchTerminal.tsx`)
*Goal: make contacting feel like tasking an operator.*

- **7.1** Recast the contact/PGP terminal as "TARGET INTAKE" with an operator
  console feel; keep PGP (`src/config/pgp.ts`) and real contact path
  (`src/data/contact.tsx`) intact. Use `/impeccable` for form design, field
  states, validation/error + success states, and UX copy. **AC:** form works,
  PGP key unchanged, no dark-pattern.

## Epic 8 — Legal/guide pages, SEO, meta, structured data
*Goal: propagate the rebrand to the edges and search.*

- **8.1** Re-tone guide pages (`SsrfGuide`, `IdorGuide`, `Fido2PasskeysGuide`)
  headers/nav to match; keep guide bodies technical. **AC:** shared primitives
  either restyled or explicitly kept.
- **8.2** Update `index.html` meta/OG + `SEOMeta.tsx` + `Person`/`Organization`
  JSON-LD to the new positioning. **AC:** award/article fields still honor the
  truthfulness rules; OG image regenerated to new identity.
- **8.3** Update `Footer`, `Navbar` wordmark to new identity. **AC:** consistent.

## Epic 9 — Governance, truthfulness & legal guardrails
*Goal: aggressive ≠ reckless or unlawful-sounding.*

- **9.1** Legal/positioning read of ALL new copy: (a) heritage grey-zone stays
  past-tense and clearly historical; (b) nothing reads as advertising current
  illegal MFA-bypass-for-hire; (c) all engagements presented as authorized/
  contracted; (d) no third-party defamation. **AC:** written sign-off note in
  `docs/redesign/legal-read.md`; blocks release of any epic that fails.
- **9.2** Verify claims about the Evilginx origin / ProksiAbel history against
  sources before publishing (source-first, no confident guesses). **AC:** each
  claim has a citation or is cut.

## Epic 10 — Verify gate, QA & rollout
*Goal: ship it green.*

- **10.1** Per-phase verify gate (unchanged tooling):
  `pnpm exec tsc -b && pnpm exec biome check && pnpm exec vite build`, plus
  prerender count green. **AC:** all green before merge.
- **10.2** Accessibility + polish audit via `/impeccable` audit mode: contrast,
  reduced-motion, keyboard, focus order, responsive behavior, anti-patterns on
  the new aggressive palette/motion. **AC:** WCAG AA maintained; audit findings
  logged and resolved.
- **10.3** Browser visual QA (Playwright, `/impeccable` live-browser) EN + ET,
  mobile + desktop. **AC:** screenshots archived; no layout breaks.
- **10.4** Deploy: CNAME/Pages pipeline already fixed — confirm `pub/`
  regenerated and custom domain intact after build.

## Epic 11 — Design-token pipeline (single source of truth)
*Goal: one authored token set drives CSS, Tailwind, and `DESIGN.md` — no more*
*hand-syncing hex across files when the aggressive palette evolves.*
*Driver: `/impeccable` (reusable design systems / tokens) authors the token set.*

- **11.1** Author tokens once in a structured source (`src/design/tokens.json`
  or `tokens.ts`): color, type scale, spacing, radius, motion, elevation —
  seeded from the Epic 1 palette. **AC:** every value used on the homepage has a
  named token; no raw hex left in components.
- **11.2** Generate consumers from the source: CSS custom properties in
  `src/index.css` (or a generated `tokens.css`) and the Tailwind theme in the
  build config. Wire a `pnpm` script (`build:tokens`) into the pipeline; run it
  in `postbuild`/pre-`vite build`. **AC:** editing one token propagates to CSS +
  Tailwind + docs on rebuild; verify gate stays green.
- **11.3** Regenerate the `DESIGN.md` frontmatter token block from the same
  source (or assert parity in CI) so docs never drift. **AC:** `DESIGN.md`
  tokens match `tokens.*`; a check fails the build on drift.
- **11.4** Keep it self-hosted/GDPR-safe — token pipeline pulls no external
  assets. See [[fonts-self-hosted-no-cdn]]. **AC:** no new network dependency.

## Epic 12 — Heritage timeline content model (structured content)
*Goal: the Evilginx → ProksiAbel → boutique story (Epic 5) is data, not JSX —*
*editable, sourced, and reused by structured data + the legal read.*

- **12.1** Model the timeline as structured content: `src/data/heritage.ts`
  (or `content/heritage/*.md` front-matter) with `{ year, title, body_en,
  body_et, sources[], grey_zone: bool }` per entry. **AC:** `Heritage.tsx`
  renders purely from the model; adding an entry needs no component edit.
- **12.2** Every entry carries its citation(s); the Epic 9 legal read runs
  against the data file, not scattered JSX. Entries with `grey_zone: true` must
  be past-tense and source-backed or they fail the gate. **AC:** no uncited
  third-party claim; legal read signs off on the data file.
- **12.3** Feed the same model into `index.html` / `SEOMeta` JSON-LD where a
  timeline/`Organization` history is expressible, honoring the truthfulness
  rules ([[redswat-hackathon-credential]]). **AC:** structured data derives from
  the model, no divergent hardcoded copy.
- **12.4** ET/EN parity built into the model; Estonian validated with the
  estonian-mcp tools. **AC:** both locales present per entry; ET checked, not
  guessed.

---

## Sequencing (dependency order)
`Epic 0 → 1 → 11` (tokens depend on the Epic 1 palette) → `2` in parallel with
`9` running continuously → `3, 4, 5, 6, 7` (parallelizable; Epic 5 depends on
`12`) → `8` → `10`.
