# Master Blueprint — "Precision Offensive Engineering" Redesign

Date: 2026-08-25
Owner: Tom Kristian Abel
Status: All 7 phases implemented. `tsc -b`, `biome check`, `oxlint`, `vite build`,
and prerender (8/8 pages) all green. Pending: visual QA in a browser.

## What shipped

- **Phase 1** — Obsidian tokens (`@theme` + `:root`), self-hosted fonts, `SpotlightCard`.
- **Phase 2** — floating dynamic-island `Navbar` (mono brand, status pulse, spring CTA).
- **Phase 3** — `AttackVectorGraph` (interactive SVG AiTM) replaces `AttackTerminal` in `Hero`.
- **Phase 4** — `Telemetry` proof strip + `Services` asymmetric bento (65/35 + banner).
- **Phase 5** — `Dossier` merges Expertise+About; nav collapses to Services/Dossier/Contact.
- **Phase 6** — `DispatchTerminal` merges Contact+Pgp (floating-label glow inputs, PGP
  copy/download micro-chip); `Footer` rebuilt as 4-column high-density grid.
- **Phase 7** — deleted dead code (About, Expertise, Contact, Pgp, AttackTerminal,
  Capabilities, EngagementModels, AboutContact, Constellation/, Venn/, data.ts,
  data/projects.ts). Motion respects `prefers-reduced-motion`.

Anchor continuity: `#about` = Dossier, `#contact` = DispatchTerminal; legacy
`#expertise` and `#pgp` preserved as alias spans so old links still resolve.
All new copy (EN/ET) verified against the Estonian MCP.

Goal: transform proksiabel.ee from a template dark-mode consultancy site into a
10/10 world-class offensive-security presence, using the design language of
Trail of Bits / Linear / Chainguard / Vercel — technical authority, tactile
craftsmanship, surgical clarity.

## Current-state assessment (verified against source)

- **Stack:** React 19, Vite 8, Tailwind v4 (CSS-first `@theme` in `src/index.css`),
  react-router 7, `@dr.pogodin/react-helmet`. Full ET/EN i18n in
  `src/i18n/translations.ts` (~1200 lines). All UI copy flows through `t.*`.
- **Live homepage** (`src/App.tsx` → `HomePage`): `Navbar → Hero → Services →
  Expertise → About → Contact → Pgp → Footer`.
- **Hero centerpiece:** `AttackTerminal.tsx` — a fake typing CLI. This is the
  "script-kiddie terminal mockup" the thesis rejects. To be retired.
- **Orphaned / dead code** (imported nowhere on live pages): `Constellation/`
  (WebGL point cloud), `Venn/`, `Capabilities.tsx`, `EngagementModels.tsx`,
  `AboutContact.tsx`. Candidates for reuse (Constellation → attack graph) or
  deletion in Phase 7.
- **Design tokens today:** `@theme` only defines the Inter font + two animations.
  All color is stock Tailwind slate/sky/teal. No elevation system.

## Senior-review flags (decisions baked into this plan)

1. **Self-host fonts (privacy / GDPR).** `index.html` currently loads Inter from
   the Google Fonts CDN. That leaks every visitor's IP to Google — a German
   court (LG München I, 20 O 17493/20) ruled exactly this a GDPR violation.
   For an offensive-security / privacy brand it is a credibility self-own, and
   the blueprint's proposed Geist + JetBrains Mono would triple the leak.
   Decision: **self-host** all fonts (local `woff2`, `@font-face`, `display:swap`),
   remove all `fonts.googleapis.com` / `fonts.gstatic.com` references.
2. **The blueprint's example `BentoCard` TSX is malformed** (missing element
   open tags, stray `className` attributes). It is a spec, not shippable code.
   We reimplement it correctly as `SpotlightCard`.
3. **All Estonian copy is verified with the Estonian MCP** (spell / morphology /
   EKI orthography) before commit. No hardcoded Estonian in JSX — everything via
   `translations.ts` with matched EN.
4. **Cyan discipline (the 10% rule).** `--accent-cyan-core` (#00E5FF) is reserved
   for interactive focus, live status, and micro-badges only. Structural surfaces
   stay in the obsidian ladder.
5. **Real data only.** PGP fingerprint (`src/config/pgp.ts`), contact details
   (`src/data/contact.tsx`), and registry code are canonical — the placeholder
   values in the blueprint (`93DA 4EB6…`, `security@company.com`) are ignored.
6. **Accessibility is a gate, not a nice-to-have.** Every motion respects
   `prefers-reduced-motion`; focus states, skip link, aria wiring, and keyboard
   paths that exist today are preserved or improved.

## Token architecture (Phase 1)

Mapped into Tailwind v4 `@theme` so utilities (`bg-void`, `border-subtle`,
`text-pure`, `text-body`) generate, plus raw `:root` custom properties for
gradients/masks that `@theme` cannot express.

| Group | Tokens |
| --- | --- |
| Surfaces | `--bg-void #05070B`, `--bg-surface-1 #0A0F1D`, `--bg-surface-2 #10182B`, `--bg-surface-3 #18233C` |
| Borders | `--border-subtle rgba(255,255,255,.06)`, `--border-specular` gradient, `--border-active-glow rgba(0,229,255,.25)` |
| Signals | `--accent-cyan-core #00E5FF`, `--signal-critical #FF3B5C`, `--signal-success #00E5A3`, `--signal-warning #FFB020` |
| Text | `--text-pure #F8FAFC`, `--text-body #94A3B8`, `--text-muted #64748B`, `--text-mono-dim #38BDF8` |
| Type | display `Geist Sans`, body `Inter Tight`/`Geist Sans`, mono `JetBrains Mono` (tabular-nums) |

Migration is additive: new tokens land alongside existing slate/sky classes so
nothing breaks mid-flight; sections adopt them phase by phase.

## Phasing (each phase ends with `tsc -b && biome check && vite build` green)

1. **Phase 1 — Foundation.** Token system in `@theme` + `:root`; self-host fonts;
   core primitives (`SpotlightCard`, glass-pill, floating-label input, mono badge).
2. **Phase 2 — Navbar.** Floating dynamic-island pill, status pulse, scroll-shrink,
   spring CTA. Preserve i18n + a11y (focus trap, Esc, aria-expanded).
3. **Phase 3 — Hero + attack graph.** Retire `AttackTerminal`; interactive SVG
   AiTM attack-vector graph (client→proxy→target, animated packets, decoded-token
   chip). Copy refinement via i18n.
4. **Phase 4 — Telemetry strip + Services bento.** Proof strip; 3-tier asymmetric
   bento (65/35 + full-width banner) with cursor-tracking specular border, vuln
   report card, Go snippet, capability pills.
5. **Phase 5 — Operator Dossier.** Merge `Expertise` + `About` into one high-status
   dossier (portrait + status overlay + philosophy + arsenal tags). Registry data
   relocates to footer to kill duplication.
6. **Phase 6 — Dispatch terminal + footer.** Merge `Contact` + `Pgp` into one
   command center: floating-label glow inputs, interactive PGP copy/verify/`.asc`
   micro-chip, channel selector. Rebuild footer as 4-column high-density grid.
7. **Phase 7 — Motion + cleanup + verify.** Spring/spotlight motion tokens; delete
   confirmed dead code; run tsc/biome/build/prerender/SEO; a11y + reduced-motion
   audit.

## Risks & rollbacks

- Font self-hosting adds build assets; if fontsource is undesirable, fall back to
  committing `woff2` files under `public/fonts/`. Either way, no third-party CDN.
- IA consolidation changes anchor IDs (`#about`, `#expertise`, `#pgp`). Update
  `Navbar`, `Footer`, `sitemap.xml`, and any in-page anchors together; add
  redirects/aliases where an old hash is externally linked.
- Prerender (`scripts/prerender.js`) and post-build SEO must still pass; run after
  every structural phase.
