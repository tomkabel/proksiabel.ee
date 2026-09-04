### DW-1: The PRD and the rebrand backlog both describe Evilginx as Estonian work, which is false, and later stories read them as source material.
origin: spec-deferred fc73879795f3
location: _bmad-output/planning-artifacts/prds/prd-proksiabel.ee-2026-09-04/prd.md:30
source_spec: `spec-1-1-publish-the-brand-manifesto.md`
severity: medium
reason: _bmad-output/planning-artifacts/prds/prd-proksiabel.ee-2026-09-04/prd.md line 30 ("the Estonian lineage that produced Evilginx") and docs/redesign/2026-09-04-hyper-aggressive-rebrand-backlog.md line 15 ("the Estonian researcher who wrote Evilginx"). Evilginx is Kuba Gretzky's work (breakdev.org, April 2017). Pre-existing in the planning chain, not caused by this story; the manifesto records the correction but the source documents still carry the error.
status: open

### DW-2: PRODUCT.md still asserts uncited bypasses of major client-side bot-detection systems.
origin: spec-deferred 7133f57369bb
location: PRODUCT.md:22
source_spec: `spec-1-1-publish-the-brand-manifesto.md`
severity: low
reason: PRODUCT.md "## Positioning" carries the claim; it predates this rebrand and no artifact sources it. Cut from the manifesto by this story; removing it from PRODUCT.md needs the operator's call (see operator_actions).
status: open

### DW-3: No mechanism enforces the "must not drift" relationship between PRODUCT.md Positioning and the manifesto — only a manual read.
origin: spec-deferred 470c873fe409
location: n/a
source_spec: `spec-1-1-publish-the-brand-manifesto.md`
severity: low
reason: The epic establishes a build-failing drift check for DESIGN.md tokens; nothing comparable exists for prose. Would need a story owner; out of scope for a prose-only story.
status: open

### DW-4: The Voice block is English-normed; Epic 4's Estonian copy rewrites will need to apply the same standard to ET prose with no stated guidance on carryover.
origin: spec-deferred d84ad8faef47
location: DESIGN.md:113 (Voice block)
source_spec: `spec-1-2-specify-the-voice-with-examples-and-anti-examples.md`
severity: low
reason: DESIGN.md's Voice block hedge-word list ("just", "actually", "honestly", "frankly") and "sentence" framing are English-specific. src/i18n/translations.ts carries a full parallel `et:` block Epic 4 must rewrite in this voice. Out of this story's scope: the intent and epic-1-context.md scope Story 1.2 to DESIGN.md only.
status: open

### DW-5: DESIGN.md's Overview (line 98) still states "Credibility comes from restraint." as live, while the Voice section's anti-example 7 calls that same sentence the superseded thesis — an internal
origin: spec-deferred b4704ecc191d
location: DESIGN.md:98 (Overview) vs. DESIGN.md:140 (Voice anti-example 7)
source_spec: `spec-1-2-specify-the-voice-with-examples-and-anti-examples.md`
severity: low
reason: `DESIGN.md:98` retains "Credibility comes from restraint." unflagged, and `DESIGN.md:140` (Voice anti-example 7) quotes it as "the superseded thesis stated outright." A reader of Overview alone sees no signal that the line is pending removal. This story's own intent explicitly excludes fixing it: "No manifesto edits, no DESIGN.md frontmatter/thesis changes, no 'Superseded' heading — those are Stories 1.1 (done) and 1.3."
status: open
