# The Intersection

## Problem Statement

How might we create a single digital presence that makes Tom Kristian Abel's intersection of offensive security, AI infrastructure, and systems engineering feel like a coherent superpower — not a résumé in 7 tabs?

## Recommended Direction

**The Intersection** is a hybrid website combining a WebGL "constellation" hero with an interactive Venn diagram as the primary content architecture.

**The Constellation (Hero):** A living particle system where each node represents a project, skill, or research thread. Nodes drift gently, connected by faint lines representing shared domains or technologies. The center of the canvas is the "ProksiAbel" node — the gravitational center of the system. This creates immediate visual differentiation and establishes the "living system" metaphor.

**The Venn (Navigation):** Below the hero, an interactive three-circle Venn diagram (Security, AI/ML, Systems) becomes the site's navigation spine. Clicking any zone — including the intersections — reveals the projects, capabilities, and proof points specific to that overlap. This solves the "7 resumes" problem by making the breadth feel intentional, not scattered.

**Content Zones:** Each Venn zone has distinct density:
- Pure zones (single circle): Sparse, foundational capabilities
- Intersections (two circles): Dense, core project clusters  
- Center (all three): The strongest work, the core thesis

The tone shifts from "hacker swagger" to "architect's confidence" — direct, precise, occasionally irreverent.

## Key Assumptions to Validate

- [ ] **WebGL performance:** Test on mid-tier laptops, mobile devices, and corporate-locked browsers. If <60fps on 2022 MacBook Air, simplify or switch to Canvas 2D.
- [ ] **Copy quality:** Write 200 words per Venn zone that are compelling, not descriptive. If any zone feels thin, reconsider the project mapping.
- [ ] **Mobile experience:** The Venn must translate to a usable list-based layout on mobile. If the interaction feels degraded, redesign the mobile nav.
- [ ] **Load time:** Full initial load < 3 seconds on 3G. If WebGL assets push this over, preload smarter or reduce complexity.

## MVP Scope

**In:**
- WebGL constellation hero (15-20 nodes, force-directed, mouse interaction)
- Canvas 2D fallback for WebGL-blocked devices
- Interactive Venn diagram (SVG/CSS, 7 zones clickable)
- Selected Work cards per zone (project name, one-line description, tech tags, external links)
- Capabilities section (3 ways of working: Adversarial Research, AI Infrastructure, Systems Architecture)
- Engagement Models (Deep Dive, Technical Advisory, Research Collaboration)
- About/Contact section with Tom's bio and PGP key
- English/Estonian i18n (preserving existing translation infrastructure)
- Dark mode only (no light mode toggle)

**Out (for MVP):**
- Full Forge collective model (wait until 2+ regular collaborators are confirmed)
- Three.js (use lighter raw WebGL or a small abstraction to keep bundle small)
- CMS (hardcode projects; 1-2 new projects/year makes this manageable)
- Blog/ongoing content (add after launch)
- Analytics beyond basic pageview tracking
- Testimonials/client logos (add after securing explicit permission)

## Not Doing (and Why)

- **Light mode** — The dark "void" aesthetic is core to the brand. Adding light mode doubles design work and dilutes identity.
- **Service pricing pages** — Consulting is bespoke. Pricing creates anchors that reduce deal size.
- **Complex scroll animations** (GSAP timelines, pinned sections) — The constellation is already the "wow." Additional scroll effects create competition and performance risk.
- **Social media feeds** — No Twitter/LinkedIn embeds. They age poorly and add third-party weight.
- **Chat widget** — Nothing says "I'm desperate" like an Intercom bubble. PGP + email + LinkedIn is enough.

## Open Questions

- Who are the 1-2 collaborators that could authentically populate a "Network" section in v2?
- Should the constellation include a subtle "live" indicator (e.g., a node for current work)?
- What's the fallback content if JavaScript is disabled entirely? (Static SVG constellation + standard nav?)
- Do we preserve the existing legal pages (Privacy, Terms, Cookies, Disclosure) as-is, or rewrite tone to match the new positioning?
