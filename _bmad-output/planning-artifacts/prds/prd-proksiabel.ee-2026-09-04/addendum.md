# Addendum — "The Adversary" Rebrand

Technical-how and downstream detail extracted from
`docs/redesign/2026-09-04-hyper-aggressive-rebrand-backlog.md` that belongs to architecture,
UX, or epics rather than to the PRD.

## Working mode: `/impeccable` is the frontend driver

Every design, build, and critique task runs through the `/impeccable` skill (visual
hierarchy, theming, tokens, colour, typography, motion, micro-interactions, responsive,
a11y, UX copy, error/empty states, i18n, live-browser iteration, ambitious visual effects).
This is the working mode, not a suggestion:

- **Live-browser iteration loop** — the loud surfaces: visual identity (FR-4…FR-7), hero
  (FR-11, FR-12), heritage timeline (FR-14).
- **Audit mode** — the quality gate (FR-27).
- **Design-system/token authoring** — the Token Source (FR-22).

## Estonian validation tooling

ET copy (FR-8, FR-14) is validated with the `estonian-mcp` tools rather than model
judgement: `spell_check`, `check_compounds` / `check_compound_familiarity`,
`classify_register`, `check_style`, `paradigm` for inflected forms. Vabamorf accepting a
compound does not prove it is real Estonian — coined compounds need
`check_compound_familiarity`.

## Implementation surface map

| PRD requirement | Files |
| --- | --- |
| FR-1…FR-3 Positioning/voice | `docs/redesign/manifesto.md`, `PRODUCT.md`, `DESIGN.md` |
| FR-4…FR-6 Identity system | `DESIGN.md`, `src/index.css`, Token Source |
| FR-7, FR-16 Operator Terminal / Target Intake | `src/components/DispatchTerminal.tsx`, `src/config/pgp.ts`, `src/data/contact.tsx` |
| FR-8…FR-10 Copy | `src/i18n/translations.ts`, `src/components/Navbar.tsx` |
| FR-11…FR-12 Hero | `src/components/Hero.tsx`, `src/components/AttackVectorGraph.tsx` |
| FR-13 Arsenal | `src/components/Services.tsx`, links to `src/components/Fido2PasskeysGuide.tsx` |
| FR-14 Heritage | new `src/components/Heritage.tsx` (or `Dossier.tsx`), `src/data/heritage.ts` |
| FR-15 Dossier | `src/components/Dossier.tsx`, `src/components/Disclosure.tsx` |
| FR-17 Guides | `SsrfGuide.tsx`, `IdorGuide.tsx`, `Fido2PasskeysGuide.tsx` |
| FR-18…FR-19 SEO/wordmark | `index.html`, `src/components/SEOMeta.tsx`, `Footer.tsx`, `Navbar.tsx` |
| FR-22…FR-25 Token pipeline | `src/design/tokens.*`, `src/index.css`/`tokens.css`, Tailwind config, `package.json` |
| FR-26, FR-29 Verify/deploy | `package.json` scripts, `scripts/postbuild-seo.js`, `scripts/prerender.js`, `pub/`, `pub/CNAME` |

## Heritage Timeline content model

```ts
type HeritageEntry = {
  year: string;
  title: string;
  body_en: string;
  body_et: string;
  sources: string[];   // non-empty; required for grey_zone entries
  grey_zone: boolean;  // true ⇒ must be past tense and source-backed, or cut
};
```

Consumers: `Heritage.tsx` (render), the Legal Read (FR-20 runs against this file), and
JSON-LD organisation history (FR-18). One model, three consumers — the reason it is data
rather than JSX.

## Token pipeline mechanism (architecture decision, not a requirement)

Authored source → generator script → three consumers (CSS custom properties, Tailwind
theme, `DESIGN.md` token block). Wire `build:tokens` before `vite build`; add a parity
check that fails the build on `DESIGN.md` drift. Open question 5 in the PRD (JSON vs TS)
turns on whether the Tailwind config can import the source directly.

## Sequencing from the source backlog

`Epic 0 → 1 → 11 (tokens depend on the Epic 1 palette) → 2`, with Epic 9 (governance)
running continuously; then `3, 4, 5, 6, 7` parallelizable, with Epic 5 (heritage section)
depending on Epic 12 (content model); then `8`; then `10`.

## Superseded sources

- `DESIGN.md` — "Obsidian Instrument / one disciplined signal." Superseded for the homepage;
  retained under a "Superseded" note per FR-3.
- `docs/redesign/2026-08-25-offensive-presence-blueprint.md` — the restraint thesis.
