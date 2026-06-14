# Approach C: The Unfolding Spec

*A technical-specification-as-experience design concept for tom.proksiabel.ee*

## Core Metaphor

The page is designed as a living technical specification document. Styled margins, figure numbering, cross-references, and technical diagrams as SVG figures — each scroll section turns the page of a spec. The experience conveys rigor, precision, and substance through documentary design rather than decorative animation.

## Why

- Highest credibility signal for technical B2B buyers (CTOs, engineering leads, security researchers)
- Research papers and whitepapers feel native to the format, not bolted on
- Lowest implementation complexity — no custom canvas/WebGL work
- Unusual enough in practice to stand out without feeling gimmicky

## Scroll Flow

1. **Cover / Abstract** — Title, author, version, status (like a formal document header)
2. **Table of Contents** — Sticky scroll-driven nav with section numbering
3. **1.0 Core Competencies** — Technical diagrams as SVG figures showing capability domains with callout annotations
4. **2.0 Research Output** — Paper archive formatted as a bibliography with DOI-style references, expandable abstracts
5. **3.0 Projects & Tooling** — Each project as an appendix entry: purpose, architecture diagram, tech stack, status
6. **4.0 Engagement Model** — Legal/procurement details via ProksiAbel OU, rates/licensing
7. **References / Colophon** — Contact, PGP key, signature block

## Design Language

- Dark theme with warm paper/cream offsets for "document" sections
- Monospace headings, serif body (or high-contrast sans)
- SVG figure elements with subtle reveal-on-scroll
- Citation cross-links between sections
- Print-styled margins with marginalia annotations

## Risk

The biggest risk is that it reads as a PDF-on-a-webpage. Mitigation: responsive typography, subtle scroll-triggered diagram reveals, interactive figure elements (expandable, zoomable), and a living "last updated" timestamp.
