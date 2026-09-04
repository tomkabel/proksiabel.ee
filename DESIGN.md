---
name: ProksiAbel
description: Precision offensive-security presence — obsidian depth, one disciplined signal.
colors:
  void: "#05070b"
  surface-1: "#0a0f1d"
  surface-2: "#10182b"
  surface-3: "#18233c"
  cyan-core: "#00e5ff"
  electric-sky: "#38bdf8"
  electric-teal: "#2dd4bf"
  signal-critical: "#ff3b5c"
  signal-success: "#00e5a3"
  signal-warning: "#ffb020"
  text-pure: "#f8fafc"
  text-body: "#94a3b8"
  text-muted: "#64748b"
typography:
  display:
    fontFamily: "Geist Variable, Inter Tight Variable, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist Variable, Inter Tight Variable, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3.5vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist Variable, Inter Tight Variable, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter Tight Variable, Geist Variable, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono Variable, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  2xl: "1rem"
spacing:
  card: "2rem"
  section-y: "8rem"
  container-x: "1.5rem"
components:
  button-primary:
    backgroundColor: "#0284c7"
    textColor: "{colors.text-pure}"
    rounded: "{rounded.xl}"
    padding: "0.75rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.electric-sky}"
    textColor: "{colors.text-pure}"
    rounded: "{rounded.xl}"
    padding: "0.75rem 1.5rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.electric-sky}"
    rounded: "{rounded.xl}"
    padding: "0.75rem 1.5rem"
  input-field:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-pure}"
    rounded: "{rounded.xl}"
    padding: "0.75rem 1rem"
  mono-badge:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.cyan-core}"
    rounded: "{rounded.md}"
    padding: "0.25rem 0.625rem"
    typography: "{typography.label}"
  obsidian-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.card}"
---

# Design System: ProksiAbel

## Overview

**Creative North Star: "The Obsidian Instrument"**

ProksiAbel looks the way a precision offensive tool feels in the hand: dark, dense, and machined. The surface is near-black volcanic glass that layers by luminance instead of shadow, and across that darkness runs exactly one live current — a single cyan signal that marks where the system is paying attention. The reference points are Trail of Bits, Linear, Chainguard, and Vercel: technical authority carried by tactile craftsmanship and surgical clarity, never by decoration. This world deliberately rejects the "script-kiddie terminal mockup" — no fake typing CLIs, no neon-hacker cliché, no green-on-black Matrix rain. Credibility comes from restraint.

Depth is built from four stacked obsidian surfaces (`void` → `surface-3`), each a step brighter, with a hairline specular top-edge highlight that reads as machined metal catching light. Typography is a three-voice system: a tight geometric sans for authority (Geist), a humanist sans for readability (Inter Tight), and a monospace for anything the machine says — labels, badges, status, technical values (JetBrains Mono). The cyan accent obeys a hard budget: it is a signal, not a paint.

Motion is spring-eased and purposeful — cursor-tracking spotlights, status pulses, floating-island navigation — and every animation collapses under `prefers-reduced-motion`. A fixed 3.5% fractal-noise grain overlays the whole page to dither large dark gradients and defeat OLED banding.

**Key Characteristics:**
- Obsidian ladder: depth by luminance layering, not drop shadows.
- One disciplined signal color (cyan) on ≤10% of any screen.
- Three-font system: authority sans, reading sans, machine mono.
- Machined-glass detail: hairline specular edges, hairline borders.
- Fonts self-hosted; no third-party CDN, ever (GDPR / privacy brand).

## Voice

**Register:** Blunt, operator first-person ("we", "I", "the box", "your stack"). Short declaratives. Edge without profanity or slurs.

**Pass/fail test.** A candidate line — one sentence, or a short setup-and-payoff pair — passes only if it satisfies all four, judged as the whole line; any single failure fails it:
1. **Blunt** — states a claim or action directly. No rhetorical question (a genuine question that is answered in the same breath is not rhetorical and is fine), no hedge word ("just", "actually", "honestly", "frankly").
2. **Operator first-person** — the acting subject is "we"/"I" (the operator), or the sentence addresses the target directly, whether by name ("the box", "your stack") or plain "you", or an imperative addressed to the reader ("Stop guessing."). Never a third-person abstraction ("an attacker", "the client", "the team").
3. **Short declarative** — one clear statement per sentence. No compound marketing sentence stacking two claims, and no adjective run ("practical", "actually", "real") padding a plain statement. A single "and" or "so" joining one continuous claim (cause and effect, action and result) is fine; joining two distinct claims is not.
4. **Edge without profanity/slurs** — confrontational, not vulgar. No swearing, no slurs, no personal insult of a named individual.

**Ten passing examples:**
1. "We are the adversary you contract."
2. "We break in, on paper, with permission, then tell you what to fix."
3. "Scanners ship PDFs. We ship the break — and then the fix."
4. "We built the thing your MFA vendor is scared of."
5. "We don't hand you a scanner report. We hand you a way in."
6. "Your stack has a hole. We already found it."
7. "Automated tools miss the logic flaw. We don't."
8. "We wrote the technique your defense is about to fail against."
9. "Your defense is theory until it's attacked. We attack it first."
10. "We break your stack on paper so nobody else breaks it for real."

**Ten anti-examples, drawn from the superseded restrained brand's live copy:**
1. "Think your web apps are secure? Let's find out." — rhetorical question; fails Blunt.
2. "Real offense builds real defense." — abstract aphorism, no acting subject; fails Operator first-person.
3. "I don't just hand you a PDF of automated scanner results." — hedges with "just"; fails Blunt.
4. "Book Consultation" — corporate CTA, no confrontation; fails Edge.
5. "Baking security into your code from day one." — soft cliché metaphor; fails Blunt.
6. "Practical engineering solutions that actually hold up under fire." — adjective-padded compound, and contains the hedge word "actually"; fails Short declarative and Blunt.
7. "Credibility comes from restraint." — the superseded thesis stated outright; fails Operator first-person.
8. "Estonian Security Consultancy" — bland institutional descriptor; fails Edge.
9. "An attacker doesn't read your requirements doc. They look for the single logic flaw." — third-person "an attacker" / "they"; fails Operator first-person.
10. "My background is deeply rooted in offensive security." — passive throat-clearing opener; fails Blunt.

## Colors

A near-black obsidian field carrying one electric current. Structure is monochrome; color is reserved for meaning.

### Primary
- **Cyan Core** (#00e5ff): The single live signal. Reserved for interactive focus, live status indicators, and monospace micro-badges only. Its scarcity is the entire point — see The One Signal Rule.

### Secondary
- **Electric Sky** (#38bdf8): The `gradient-text` flourish and the primary-CTA family (`bg-sky-600` #0284c7 at rest, brightening on hover). Also `mono-dim`, the softer technical-text tint.
- **Electric Teal** (#2dd4bf): The second stop in the sky→teal signature gradient used on headings, accent lines, and the hero quote rule. Never used alone as a fill.

### Neutral
- **Void** (#05070b): The deepest layer — page background base, behind everything.
- **Surface 1** (#0a0f1d): Resting elevation for cards and containers (`obsidian-card`).
- **Surface 2** (#10182b): Inset fields and inputs; one step up from cards.
- **Surface 3** (#18233c): Top elevation — hover fills, active nav items, chips.
- **Text Pure** (#f8fafc): Headlines and high-emphasis text.
- **Text Body** (#94a3b8): Default body copy.
- **Text Muted** (#64748b): Captions, placeholders, de-emphasized labels.

### Named Status Signals
- **Signal Critical** (#ff3b5c): Errors, high-severity findings, destructive states.
- **Signal Success** (#00e5a3): Confirmed / secure / passing states.
- **Signal Warning** (#ffb020): Caution and pending states.

### Named Rules
**The One Signal Rule.** Cyan Core appears on ≤10% of any given screen and only as a signal — focus ring, live status, micro-badge. Structural surfaces stay on the obsidian ladder. If cyan is filling a large area, it is wrong.

**The Depth-By-Light Rule.** Elevation is expressed by moving up the surface ladder (brighter = closer), not by casting shadows. A raised element gets a brighter surface and a specular top edge, not a drop shadow.

## Typography

**Display Font:** Geist Variable (with Inter Tight Variable, system-ui fallback)
**Body Font:** Inter Tight Variable (with Geist Variable, system-ui fallback)
**Label/Mono Font:** JetBrains Mono Variable (with ui-monospace, monospace fallback)

**Character:** Geist brings tight, confident geometric authority to headlines; Inter Tight keeps long-form reading humane and dense; JetBrains Mono is the machine's voice — used wherever the system reports a fact, a status, or a technical value. All three are self-hosted variable fonts.

### Hierarchy
- **Display** (800, `clamp(2.25rem, 5vw, 3.75rem)`, 1.05, -0.025em): Hero and section-defining headlines (`heading-1`). Often split with the second line in the sky→teal gradient.
- **Headline** (700, `clamp(1.875rem, 3.5vw, 2.25rem)`, 1.15): Section titles (`heading-2`).
- **Title** (600, `clamp(1.25rem, 2vw, 1.5rem)`, 1.3): Card and subsection titles (`heading-3`).
- **Body** (400, 1rem–1.25rem, 1.625): Paragraph copy in Text Body; `body-large` for lead paragraphs, `body-medium` for supporting. Keep measure ≤75ch.
- **Label** (500, 0.75rem, 0.05em, monospace, often UPPERCASE): Nav items, badges, status, technical tags. Always `tabular-nums`.

### Named Rules
**The Machine Voice Rule.** Anything the system states as fact — a status, a count, a badge, a technical value, a nav label — is set in JetBrains Mono with tabular numerals. Prose is never mono; data is never prose.

## Layout

Centered single-column rhythm inside a `max-w-7xl` container with responsive gutters (1rem → 1.5rem → 2rem). Vertical rhythm is generous: sections breathe at `py-20 md:py-24 lg:py-32`. The Services grid breaks the symmetry deliberately — an asymmetric bento (65/35 split plus a full-width banner row) rather than an even three-card grid, signalling that not every capability carries equal weight. Two ambient background utilities set atmosphere: `bg-mesh` (soft radial sky/violet/teal glows) and `bg-grid` (60px hairline graph lines at 3% opacity). Scroll anchors offset 5rem for the floating navbar.

## Elevation & Depth

This system does **not** lead with drop shadows. Depth is primarily tonal: the four-step obsidian ladder (`void` → `surface-1` → `surface-2` → `surface-3`) conveys stacking by luminance, and a 1px inset specular highlight (`rgba(255,255,255,0.04)`) on the top edge of raised cards reads as light catching a machined bevel. Shadows exist only as a deep, soft contact shadow beneath elevated cards to seat them against the void — never as the primary depth cue.

### Shadow Vocabulary
- **Card seat** (`box-shadow: 0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.8)`): The obsidian-card default — inset specular top edge plus a soft, far contact shadow.
- **Glass drop** (`box-shadow: 0 8px 24px -12px rgba(0,0,0,0.6)`): Legacy glass-card lift.
- **Cyan focus glow** (`box-shadow: 0 0 12px rgba(0,229,255,0.15)`): The only colored shadow — appears exclusively on focused inputs, per The One Signal Rule.

### Named Rules
**The No-Free-Shadow Rule.** A shadow must earn its place by seating a raised surface or signalling focus. Decorative shadows are banned; use a brighter surface step instead.

## Shapes

Soft, consistent rounding across the system: `2xl` (1rem / rounded-2xl) for cards and containers, `xl` (0.75rem) for buttons and inputs, `md` (0.375rem) for mono badges and small chips, and full pills for status dots and nav islands. Borders are hairline and low-contrast: the signature is `--border-subtle` (`rgba(255,255,255,0.06)`), a barely-there stroke that defines edges without drawing attention. On hover/focus, a masked cyan stroke can fade in (see SpotlightCard) rather than a solid color swap.

## Components

### Buttons
- **Shape:** Rounded (0.75rem / `xl`).
- **Primary** (`glow-button`): Solid Electric Sky family — `bg-sky-600` (#0284c7) at rest, padding `0.75rem 1.5rem`, semibold Text Pure, with a soft sky-tinted lift shadow.
- **Hover / Focus:** Brightens to `bg-sky-500` (#0ea5e9); a sky→teal gradient sheen fades in over 300ms. Spring easing (`cubic-bezier(0.16, 1, 0.3, 1)`) on the navbar CTA.
- **Secondary** (`glow-button-secondary`): Ghost — 1px sky-500/50 border, Electric Sky text; on hover the border brightens, text goes Pure, and a faint sky wash (`bg-sky-500/10`) fills.

### Chips / Badges
- **Style** (`mono-badge`): Monospace UPPERCASE micro-label; Cyan Core text on an 8%-cyan tint fill with a 20%-cyan hairline border (`color-mix` in oklab). Rounded `md`, tabular numerals.
- **Use:** Technical tags, status, arsenal labels — the machine's voice as a pill.

### Cards / Containers
- **Corner Style:** Rounded 2xl (1rem).
- **Background:** Surface 1 (#0a0f1d) on the void.
- **Border:** `--border-subtle` hairline (`rgba(255,255,255,0.06)`).
- **Shadow Strategy:** Card-seat (inset specular top edge + soft contact shadow) — see Elevation.
- **Internal Padding:** `card` (2rem / p-8).

### Inputs / Fields
- **Style** (`field-glow`): Surface 2 background, hairline subtle border, rounded `xl`, Text Pure with Text Muted placeholder, tabular numerals. Floating-label pattern.
- **Focus:** Border becomes Cyan Core and a 12px cyan focus glow appears — the one place cyan touches an input.

### Navigation
- **Style:** Floating "dynamic-island" pill (`glass-pill`) — translucent Surface 1 (75%) with 16px backdrop blur and a subtle hairline border, detached from the page edges.
- **Brand:** Monospace wordmark alongside a live status pulse (animated dot).
- **Items:** Monospace UPPERCASE labels in Text Muted; hover fills Surface 3 and goes Text Pure.

### SpotlightCard (signature component)
An obsidian-card that tracks the cursor: pointer position is written to CSS custom properties (`--spot-x` / `--spot-y`) so a radial cyan spotlight fill (`rgba(0,229,255,0.15)`) and a mask-revealed cyan border stroke follow the cursor and fade in on hover — all on the compositor, no per-move React re-render. Under `prefers-reduced-motion` it renders as a static card. This is the tactile centerpiece of the bento grid.

## Do's and Don'ts

### Do:
- **Do** build elevation by stepping up the obsidian ladder (`void`→`surface-3`) plus a 1px inset specular top edge.
- **Do** keep Cyan Core (#00e5ff) to ≤10% of any screen — focus, live status, mono-badges only.
- **Do** set every technical value, label, badge, and nav item in JetBrains Mono with `tabular-nums`.
- **Do** self-host all fonts (`woff2`, `@font-face`, `display:swap`); the privacy brand forbids any third-party font CDN.
- **Do** gate every animation behind `prefers-reduced-motion` and keep the fractal grain overlay to prevent OLED banding.

### Don't:
- **Don't** ship fake-terminal / typing-CLI / green-Matrix hacker clichés — the thesis rejects them.
- **Don't** use cyan as a large fill or background; it is a signal, not a surface.
- **Don't** reach for drop shadows as the primary depth cue — brighten the surface instead.
- **Don't** set prose in monospace or data in prose; keep the three voices separate.
- **Don't** reintroduce Google Fonts or any third-party CDN.
