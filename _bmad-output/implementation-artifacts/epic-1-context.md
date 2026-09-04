# Epic 1 Context: The narrative spine is published and binding

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

This epic writes down the thesis, the voice, and the governing design regime so that every
later story in the rebrand can be checked against a fixed, readable standard instead of
tacit taste. The site's current identity sells restraint — obsidian depth, one disciplined
cyan signal, no terminals — and the rebrand replaces that with notoriety built on a real
lineage: work descended from Evilginx and ProksiAbel's adversary-in-the-middle iterations,
sold now as authorized, contracted engagements. Epic 1 ships first because implementation
runs largely through agents, and an agent that reads the stale design document will
dutifully re-impose the exact prohibitions this rebrand exists to overturn. Nothing visual
changes here; the deliverables are three documents that later epics are graded against.

## Stories

- Story 1.1: Publish the brand manifesto
- Story 1.2: Specify the voice with examples and anti-examples
- Story 1.3: Mark the old thesis superseded and state which regime binds

## Requirements & Constraints

- The manifesto is a standalone 150–250 word document stating the lineage as the reason to
  hire, framed as inherited technical DNA, with grey-zone periods in past tense. The
  product-level positioning statement must carry the same thesis without contradicting it.
- Every factual claim in any Epic 1 artifact must name a traceable source, or be cut. This
  is a release blocker, not a copy nit — an uncited third-party claim fails the editorial
  gate.
- **Truthfulness Rules (verbatim, non-negotiable):** RedSWAT is AMEDIA's product and the
  credential is "award-winning team" — never a rank or placement claim, never attributed to
  this boutique. The eID findings were the operator's, with AMEDIA corroboration.
  Disclosures stay at case-study altitude. No claim of Evilginx authorship.
- Nothing may read as advertising current unlawful MFA-bypass-for-hire. All engagements are
  presented as authorized and contracted. No named or disparaged third-party targets or
  vendors. Aggression is tone, never an offer.
- The voice specification must be applicable by someone who has not seen the rest of the
  work: blunt, operator first person ("we", "the box", "your stack"), short declaratives,
  edge without profanity or slurs. It carries 10 passing examples and 10 anti-examples
  drawn from the superseded restrained brand, and an arbitrary candidate sentence must be
  judgeable pass/fail against it.
- The design document must state the Adversary thesis in its identity fields, preserve the
  superseded "Obsidian Instrument / one disciplined signal" thesis under an explicit
  "Superseded — not binding" heading rather than deleting it, and either restate each
  retained prohibition affirmatively under the new regime or explicitly release it. An agent
  reading it cold must find the old constraints on terminals, colour count and motion
  plainly marked as not binding.
- Aggression is not the metric to maximise. Copy that edges toward reading as an offer of
  unlawful service, or toward profanity, has gamed the goal rather than met it.

## Technical Decisions

- Artifacts live in the repository as markdown, not as tacit convention: the manifesto and
  the governance artifacts under `docs/redesign/`, the positioning statement in
  `PRODUCT.md`, and the thesis, voice block and design regime in `DESIGN.md`.
- `DESIGN.md` is the file every downstream design agent reads before making a decision, so
  it is the binding artifact — a constraint that is not written there does not bind.
- Do not hand-edit the generated token frontmatter of `DESIGN.md`. A later epic makes that
  block generated one-way from the design token source with a build-failing drift check;
  Epic 1 touches only the prose, thesis and voice sections around it.
- The design vocabulary is fixed for later use: the operator lexicon is ARSENAL, TARGET
  INTAKE, KILL CHAIN, PROOF, one term per surface. Reference the terms consistently when
  they appear in Epic 1 prose.
- This is a brownfield change to an existing React / Vite / Tailwind / TypeScript site. No
  scaffolding, no new tooling, no code changes are expected in this epic.

## Cross-Story Dependencies

- Story 1.1's manifesto claims feed the source-verification work in Epic 2, whose recorded
  citations later populate the heritage content model in Epic 6.
- Story 1.2's voice specification is the pass/fail standard for all copy written in Epics 4
  through 8; those stories cannot be judged complete without it.
- Story 1.3 unblocks Epic 3's visual identity work — the aggressive palette, dominant
  monospace, and the operator terminal all violate prohibitions that are still nominally in
  force until this story lands.
- Epic 1's artifacts are themselves subject to the editorial gate stood up in Epic 2. The
  gate is created after these documents but grades them; a passing verdict does not carry
  forward if the copy is later changed.
