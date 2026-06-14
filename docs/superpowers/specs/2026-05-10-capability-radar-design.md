# Capability Radar — Design Spec

**Project:** Unified personal + company site for Tom Kristian Abel / ProksiAbel OU
**Date:** 2026-05-10
**Status:** Approved design

---

## 1. Concept

A single-page digital presence that presents Tom Kristian Abel as a multi-dimensional deep-tech capability — not a resume, but a capability profile. A precision radar/spider chart as the hero visual breaks into 6 domain sections on scroll, each revealing projects, research, and tools.

Primary brand: **Tom Kristian Abel** (the talent). Enabling entity: **ProksiAbel OU** (the B2B contracting wrapper).

---

## 2. Visual Design System

### Color Palette (WCAG AA verified)

| Token | Value | Usage | Contrast |
|---|---|---|---|
| `--bg` | `#020203` | Background, page base | — |
| `--grid` | `#1a1a2e` | Radar grid lines, separators | — |
| `--signal` | `#00D4FF` | Radar fill, active states, primary interactive | 10.8:1 |
| `--accent` | `#F59E0B` | Research papers, CTA section only | 8.4:1 |
| `--text-primary` | `#F1F5F9` | Body text | — |
| `--text-secondary` | `#94A3B8` | Metadata, labels | — |

Semantic rule: cyan = capability signal, amber = research/CTA only.

### Typography (3-stack system)

| Role | Font | Usage |
|---|---|---|
| Display/Headings | **Space Grotesk** | Name, section titles, domain labels |
| Body/UI | **Inter** | Paragraphs, descriptions, form labels |
| Data/Labels | **JetBrains Mono** | Radar axis labels, metadata, code references |

### Grid

Strong visible baseline grid at 4px increments — research-lab precision aesthetic. Applied to both the radar chart background and page layout.

---

## 3. Scroll Flow

### Hero (above fold)

- Name: `TOM KRISTIAN ABEL` (Space Grotesk, large weight)
- Subtitle: `"Deep-Tech AI Engineering | Reverse Engineering · AI Infrastructure · Systems Architecture"`
- 6-axis radar chart, centered, on dark canvas with fine radial grid lines
- Polygon fill: cyan `#00D4FF` gradient
- On load: polygon draws via `stroke-dashoffset` animation (~1.5s), then fills
- "ProksiAbel OU" as small legal anchor below fold
- Sticky nav slides in on scroll (Inter, minimal)

### Capability Axes (6 sections, full-width scroll)

Each radar axis expands into a 2-column section:

| Section | Anchor Project |
|---|---|
| Reverse Engineering | BotGuard VM research, bg-vm-decompiler |
| AI/ML Infrastructure | EchoGuard, GPU orchestration (RunPod), MCP |
| Offensive Tooling | fingerprintproxy, MITM Go frameworks |
| Systems Engineering | Distributed systems, custom transport, zero-trust |
| Research & Analysis | Published findings, whitepapers |
| Architecture & Design | System design, API architecture |

Layout per section:
- **Left column:** Domain name (Space Grotesk) + short description (Inter)
- **Right column:** Project/research cards with JetBrains Mono metadata tags

Transition: radar crossfades to content (scale-down + opacity, not SVG manipulation — prevents layout thrashing).

### Research & Whitepapers

Grid layout (arXiv / preprint-index style):
- Featured card: BotGuard VM research (amber `#F59E0B` accent)
- Smaller cards for additional whitepapers
- Each entry: title, short abstract, status tag (published/draft), date
- JetBrains Mono for metadata
- Data source: TypeScript module exporting typed `ResearchPaper[]` array (title, abstract, status, date, tags, link)

### CTA / ProksiAbel OU

- Brief: available for contract and B2B partnership via ProksiAbel OU
- Contact form (name, email, message fields): inline validation, focus management, `aria-live` error regions
- PGP key reference
- Amber accent used here

### Footer

- Minimal: email, LinkedIn, GitHub
- Colophon: typography credits

---

## 4. Animation & Interaction

| Property | Value |
|---|---|
| Scroll engine | **Lenis** (`https://www.lenis.dev`) — smooth scroll via lerp |
| Radar draw-in | `stroke-dashoffset`, ~1.5s on load |
| Section transitions | `transform` + `opacity` only (never `width`/`height`) |
| Timing tokens | `--duration-fast: 200ms`, `--duration-normal: 400ms` |
| Easing | `--easing-out: cubic-bezier(0.16, 1, 0.3, 1)` |
| `prefers-reduced-motion` | Disables all canvas animation, Lenis falls back to native scroll |

No parallax, no decorative flourishes. Every animation has a reason.

---

## 5. Accessibility (WCAG AA)

- **Radar fallback:** hidden `<table>` with numerical values + `aria-label="Capability radar chart showing expertise across 6 domains"`
- **Keyboard:** all 6 radar axis points keyboard-focusable with visible focus rings
- **Skip link:** first focusable element on page
- **Mobile nav:** focus trap when open, Escape closes
- **Form:** visible labels, `aria-live` error region
- **Touch targets:** ≥48dp minimum
- **Animation:** `prefers-reduced-motion` disables scroll animation and canvas effects

---

## 6. Responsive Breakpoints

| Width | Layout |
|---|---|
| 375px | Simplified radar (4 primary axes: Reverse Engineering, AI/ML Infrastructure, Offensive Tooling, Systems Engineering), single-column, stacked |
| 768px | Full 6-axis radar, 2-column sections |
| 1024px+ | Desktop with full grid precision |
| 1440px+ | Max-width container, ample whitespace |

`safe-area-inset-*` compliance for notched devices.

---

## 7. Performance Budget

| Metric | Target |
|---|---|
| FCP | <1.5s (3G throttled) |
| CLS | <0.1 |
| Runtime deps | React + Lenis only |

Static site output (Vite build → `pub/`). No API routes, no SSR.

---

## 8. Pre-Delivery Checklist

- [ ] WCAG AA contrast verification on all text/background combinations
- [ ] Keyboard-navigate entire page without a mouse
- [ ] Radar chart has accessible data table fallback
- [ ] Test at 375px, 768px, 1024px, 1440px
- [ ] `prefers-reduced-motion` disables all animation
- [ ] FCP verified under 1.5s on 3G throttling
- [ ] Form validation end-to-end with error states
- [ ] Lighthouse audit passes Accessibility section
