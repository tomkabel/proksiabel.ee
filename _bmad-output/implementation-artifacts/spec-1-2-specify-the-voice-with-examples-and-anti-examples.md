---
title: 'Story 1.2: Specify the voice with examples and anti-examples'
type: 'feature'
created: '2026-09-04'
status: 'done'
baseline_revision: '7de5167490e7599a3723ad3aa34339776053b2df'
review_loop_iteration: 0
followup_review_recommended: false
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/docs/redesign/manifesto.md'
warnings: []
deferred:
  - summary: >-
      The Voice block is English-normed; Epic 4's Estonian copy rewrites will need to apply the
      same standard to ET prose with no stated guidance on carryover.
    evidence: |-
      DESIGN.md's Voice block hedge-word list ("just", "actually", "honestly", "frankly") and
      "sentence" framing are English-specific. src/i18n/translations.ts carries a full parallel
      `et:` block Epic 4 must rewrite in this voice. Out of this story's scope: the intent and
      epic-1-context.md scope Story 1.2 to DESIGN.md only.
    location: 'DESIGN.md:113 (Voice block)'
    severity: low
  - summary: >-
      DESIGN.md's Overview (line 98) still states "Credibility comes from restraint." as live,
      while the Voice section's anti-example 7 calls that same sentence the superseded thesis —
      an internal contradiction until Story 1.3 marks the old thesis superseded.
    evidence: |-
      `DESIGN.md:98` retains "Credibility comes from restraint." unflagged, and `DESIGN.md:140`
      (Voice anti-example 7) quotes it as "the superseded thesis stated outright." A reader of
      Overview alone sees no signal that the line is pending removal. This story's own intent
      explicitly excludes fixing it: "No manifesto edits, no DESIGN.md frontmatter/thesis
      changes, no 'Superseded' heading — those are Stories 1.1 (done) and 1.3."
    location: 'DESIGN.md:98 (Overview) vs. DESIGN.md:140 (Voice anti-example 7)'
    severity: low
---

<intent-contract>

## Intent

**Problem:** Copy for the "Adversary" rebrand will be written across many stories and sessions
by different agents. Without a concrete, checkable voice specification in `DESIGN.md`, each
piece of copy re-derives the tone from taste and drifts.

**Approach:** Add a "Voice" block to `DESIGN.md` defining the register (blunt, operator
first-person, short declaratives, edge without profanity/slurs), a four-part pass/fail test,
10 example lines that pass, and 10 anti-examples drawn from the current live (superseded
restrained-brand) copy.

## Boundaries & Constraints

**Always:**
- The Voice block lives in `DESIGN.md`, the file every downstream design/copy agent reads.
- The pass/fail test must be usable by someone who has not seen the rest of this work — stated
  as explicit, named criteria, not vibes.
- The 10 anti-examples are real lines drawn from the current (pre-rebrand) live copy, not
  invented strawmen — so the contrast is honest and traceable.
- Edge stops short of profanity, slurs, or personal insult of a named individual — per the
  Truthfulness/tone guardrail in `epic-1-context.md`.

**Never:**
- No manifesto edits, no `DESIGN.md` frontmatter/thesis changes, no "Superseded" heading — those
  are Stories 1.1 (done) and 1.3.
- No rewriting of any existing component copy to the new voice — that is Epic 4's job; this
  story only publishes the standard those rewrites will be graded against.
- No token, component, or i18n changes.

</intent-contract>

## Code Map

- `DESIGN.md` -- living design document; every downstream design/copy agent reads it before
  acting. New `## Voice` section inserted between `## Overview` (ends ~line 109) and `## Colors`
  (starts ~line 111), matching where a document-level concern (like Typography) sits relative to
  Overview. Frontmatter and the "Obsidian Instrument" thesis prose are untouched — that's Story
  1.3.
- `src/i18n/translations.ts` -- source of the 10 anti-example lines, all live copy predating this
  rebrand: `hero.heading` (~L48), `hero.subheading` (~L49), `hero.description` (~L50-51),
  `hero.bookConsultation` (~L54), `hero.badge` (~L56), `services.service2.description` (~L112-113),
  `services.service2.heroDescription` (~L119), `expertise.quote` (~L183),
  `expertise.bio1` (~L159). Read-only for this story.
- `DESIGN.md` "Credibility comes from restraint." (~line 97, Overview prose) -- the tenth
  anti-example; it is the superseded thesis's own tagline, quoted from the design doc itself
  rather than the component copy.
- `docs/redesign/manifesto.md` (Story 1.1 output, already review-passed) -- source for 4 of the
  10 passing examples, quoted/adapted from its body between the `manifesto:body-start`/`-end`
  markers: "We are the adversary you contract.", "We break in, on paper, with permission, then
  tell you what to fix.", "Scanners ship PDFs. We ship the break — and then the fix." The
  remaining 6 passing examples are new lines written to the same register for broader coverage
  (target/`your stack` address, short declaratives) and checked against the pass/fail test below.
- `docs/redesign/2026-09-04-hyper-aggressive-rebrand-backlog.md` line ~46 -- Story 0.2 source:
  "blunt, operator first-person ('we', 'the box', 'your stack'), short declaratives, controlled
  profanity-adjacent edge without actual slurs/profanity... 10 example lines + 10 anti-examples
  (things the old brand would have said)" — this story's literal AC source.

## Tasks & Acceptance

**Execution:**
- `DESIGN.md` -- insert a `## Voice` section after `## Overview` defining the register, a
  four-criterion pass/fail test (Blunt / Operator first-person / Short declarative / Edge without
  profanity-or-slurs), 10 passing examples, and 10 anti-examples each annotated with which
  criterion it fails -- makes the standard both complete and immediately checkable.

**Acceptance Criteria:**
- Given `DESIGN.md` has no Voice block, when the story is complete, then `DESIGN.md` contains a
  "Voice" block defining: blunt, operator first-person ("we", "the box", "your stack"), short
  declaratives, edge without profanity or slurs.
- Given the Voice block, when read, then it lists 10 example lines that pass.
- Given the Voice block, when read, then it lists 10 anti-examples drawn from the superseded
  restrained brand.
- Given the Voice block's pass/fail test, when an arbitrary candidate sentence is checked against
  it by someone who has not seen the rest of this work, then it can be judged pass or fail without
  further context -- satisfied by the four named, independently-checkable criteria and the
  worked anti-example annotations showing the test applied.

## Spec Change Log

## Review Triage Log

### 2026-09-04 — Review pass

- verdicts: 9 findings — high 0, medium 3, low 6, false 0, maybe-false 0
- findings:
  - `[low]` `[defer]` blind-hunter: the Voice block is entirely English-normed (hedge-word list, "sentence" framing), while the site is bilingual and Epic 4 will need to apply this standard to Estonian copy — not this story's problem; the intent/epic context scope this story to `DESIGN.md` only, and Epic 4 owns the ET rewrites this standard will grade.
  - `[low]` `[reject]` blind-hunter: criteria are framed around "sentences" but two anti-examples ("Book Consultation", "Estonian Security Consultancy") are UI labels, not sentences — rejected: the test already classifies both correctly in the artifact itself, so the imprecise wording causes no observed misjudgment; reframing all four criteria for label-vs-sentence copy is more than a direct correction.
  - `[low]` `[patch]` blind-hunter: anti-example 6 ("Practical engineering solutions that actually hold up under fire.") was annotated as failing only Short declarative despite containing "actually," a hedge word criterion 1 (Blunt) itself lists — the rubric contradicted its own worked example. Fixed: annotation now cites both Short declarative and Blunt.
  - `[low]` `[reject]` blind-hunter: passing examples and anti-examples aren't paired into bad→good transformations — rejected: not required by the AC (only "10 examples that pass" and "10 anti-examples"), and writing 10 paired rewrites is more than a direct correction.
  - `[low]` `[reject]` blind-hunter: the `awk`/`grep -c` numbered-line verification command would silently miscount if a future edit adds unrelated numbered lists inside the `## Voice` section — reject per the rule against findings whose fix is to edit this build's spec's Verification section.
  - `[low]` `[reject]` blind-hunter: no guidance on how the Voice register applies to compliance-sensitive copy (GDPR notices, cookie banners) — reject: the rebrand backlog's own scope note already keeps legal/guide-page copy on the old primitives until Epic 8, so this story correctly leaves that surface untouched.
  - `[medium]` `[patch]` edge-case-hunter: criterion 2 (Operator first-person) didn't say whether a bare imperative with no explicit "we"/"I"/named target (e.g. "Stop guessing.") passes — different reviewers could grade the same line inconsistently, undermining the AC's own "judgeable by someone with no other context" bar. Fixed: criterion 2 now explicitly covers an imperative addressed to the reader.
  - `[medium]` `[patch]` edge-case-hunter: criterion 1 (Blunt) banned rhetorical questions but left a genuine, directly-answered question unclassified — same consistency risk as above. Fixed: criterion 1 now clarifies a genuine question answered in the same breath is not rhetorical.
  - `[medium]` `[patch]` edge-case-hunter: criterion 3 (Short declarative) gave no way to judge a borderline compound sentence joined by "and" — same consistency risk. Fixed: criterion 3 now clarifies one continuous claim joined by "and" is fine, two distinct claims are not, without inventing a numeric threshold outside the spec's intent.
- verification-gap: no findings (diff is pure prose/documentation, no deterministic behavior to test).
- intent-alignment: descriptive only, no discrete findings — confirmed the diff correctly leaves `sprint-status.yaml` untouched and correctly stays at `in-review` rather than `awaiting-operator` since this story's AC contain no human-only action.

### 2026-09-04 — Review pass (follow-up)

- verdicts: 11 findings — high 0, medium 3, low 3, false 2, maybe-false 0
- findings:
  - `[false]` `[reject]` blind-hunter: `sprint-status.yaml` says the story is `done` while the spec frontmatter says `in-review` — disproven: this is the expected transient state mid-review-pass (the diff was staged right after this pass flipped status to `in-review`); `sprint-status.yaml` is orchestrator-owned and this workflow rewrites `status: done` at Finalize, so the two will match again once this pass completes.
  - `[false]` `[reject]` edge-case-hunter: same `sprint-status.yaml`/frontmatter mismatch claim as above — same disproof.
  - `[low]` `[defer]` blind-hunter: `DESIGN.md`'s Overview (line 98) still states "Credibility comes from restraint." live, while the new Voice section's anti-example 7 calls that same sentence "the superseded thesis" — a real internal contradiction for a reader of Overview alone, but its fix (marking or removing the old thesis line) is exactly the "no DESIGN.md frontmatter/thesis changes, no 'Superseded' heading" boundary this story's intent explicitly assigns to Story 1.3, which is next in the epic's story order.
  - `[low]` `[carried]` blind-hunter: no scope boundary for compliance-sensitive copy (GDPR notices, cookie banners) surfaced in `DESIGN.md` itself — same claim as the 2026-09-04 first-pass row; still correct that the rebrand backlog's own scope note keeps that copy on old primitives until Epic 8, so `DESIGN.md` needs no cross-reference for a surface this story never touches.
  - `[low]` `[carried]` blind-hunter: the Voice block is English-normed with no inline pointer to that limitation — same claim as the first-pass DW-4 finding; still correctly out of this story's scope and already tracked as DW-4 in `deferred-work.md`.
  - `[false]` `[reject]` blind-hunter: anti-example 3 ("I don't just hand you a PDF of automated scanner results.") is first-person like a passing example, casting doubt on its annotation — disproven: it only needs to fail one criterion to fail overall, and it correctly fails Blunt on the hedge word "just" regardless of also satisfying Operator first-person.
  - `[low]` `[reject]` blind-hunter: no passing example shows the compliant form of a UI-label anti-example (anti-examples 4 and 8 are CTA/descriptor labels, all 10 passing examples are full sentences) — reject: the AC requires exactly 10 passing examples and 10 anti-examples with no requirement to pair categories, and adding an 11th illustrative example is more than a direct correction.
  - `[medium]` `[patch]` edge-case-hunter: criterion 3 names only "and" as an allowed continuous-claim joiner, but passing example #10 ("We break your stack on paper so nobody else breaks it for real.") joins its clauses with "so" — a future grader applying the stated rule literally has no guidance for that conjunction despite the artifact's own worked example using it. Fixed: criterion 3 now also names "so" for a continuous cause-and-effect claim.
  - `[medium]` `[patch]` edge-case-hunter: criterion 2 lists only "the box"/"your stack" as target-address phrasing, leaving a bare second-person declarative ("You have a hole.") unclassified — a strict reader could read the parenthetical as exhaustive and fail a line the register clearly intends to pass. Fixed: criterion 2 now explicitly covers plain "you" as target-address, not only the two named phrases.
  - `[medium]` `[patch]` edge-case-hunter: the pass/fail test is scoped to "a candidate sentence," but 4 of the 10 passing examples (#3, #5, #6, #9) are two-sentence setup-and-payoff pairs whose first sentence alone would fail Operator first-person (e.g. "Scanners ship PDFs." has no first-person/target-address subject) — literal per-sentence grading would fail the artifact's own passing examples. Fixed: the test now names "a candidate line — one sentence, or a short setup-and-payoff pair" and states it is judged as the whole line.
  - `[low]` `[reject]` edge-case-hunter: the Code Map's manifesto-sourcing claim says "4 of the 10 passing examples" are manifesto-quoted but lists only 3 quotes, and 3 quoted + 6 new totals 9, not 10 — real arithmetic mismatch, but its only fix is editing this build's spec's Code Map, which triage rejects outright.
- verification-gap: no findings (diff remains pure prose/documentation; the Voice block's own verification notes this explicitly).
- intent-alignment: descriptive only, no discrete findings — confirmed the diff implements the "operable standard" reading of the intent (Reading B) and stays inside all three "Never" boundaries; the one real divergence it surfaces (English-only criteria vs. the intent's "many stories and sessions" framing) is the same gap already tracked as DW-4, not a new one.

## Design Notes

The AC requires anti-examples "drawn from the superseded restrained brand" — read literally as
the *current, live* copy (the site as it exists before this rebrand), not a paraphrase or an
invented worst-case. All 10 anti-examples are verbatim lines from `src/i18n/translations.ts` or
`DESIGN.md`'s own Overview prose, so the contrast the reader sees is the actual before/after,
not a strawman built to lose. Each is annotated with the specific criterion it fails, which both
demonstrates the test in use and pre-empts the "arbitrary sentence, no prior context" AC.

Placement: `## Voice` sits at the document level (after Overview, before Colors) rather than
nested under Typography, because it governs copy across the whole site the way Colors and
Typography govern visuals across the whole site -- it is not a sub-property of type styling.

## Verification

**Commands:**
- `grep -c "^## Voice" DESIGN.md` -- expected: 1.
- `awk '/^## Voice/,/^## Colors/' DESIGN.md | grep -c "^[0-9]\+\. \""` -- expected: 20 (10 passing
  + 10 anti-examples, each a numbered quoted line).
- `grep -n "Blunt\|Operator first-person\|Short declarative\|Edge without profanity" DESIGN.md`
  -- expected: 4+ hits, confirming all four named criteria are present.

**Manual checks (if no CLI):**
- Read each of the 10 anti-examples against `src/i18n/translations.ts` (or `DESIGN.md` Overview
  for the one design-doc-sourced line) and confirm it is a verbatim live-copy quote, not a
  paraphrase.
- Pick one of the 10 passing examples and one anti-example at random; apply the four-criterion
  test cold and confirm the verdict matches the stated pass/fail without reading anything else in
  this file.

## Auto Run Result

Status: done

**Summary:** Follow-up review pass on the already-`done` Story 1.2 Voice block. No code or
content beyond the four-criterion pass/fail test's own wording changed; three criterion
ambiguities surfaced by this pass's edge-case-hunter layer were patched directly in `DESIGN.md`.

**Files changed this pass:**
- `DESIGN.md` — three clarifying edits to the `## Voice` pass/fail test (criteria 2 and 3, and
  the test's own scoping sentence); no examples, register description, or anti-examples changed.
- `_bmad-output/implementation-artifacts/spec-1-2-specify-the-voice-with-examples-and-anti-examples.md` — this spec: follow-up triage log entry, two new frontmatter `deferred` items, this
  result.

**Review findings breakdown (this pass, 11 findings across four layers):**
- Patched (3, all medium): criterion 3 didn't cover the "so" conjunction used by the artifact's
  own passing example #10; criterion 2 didn't explicitly cover a bare "you" address; the test's
  "candidate sentence" framing didn't account for the four passing examples that are two-sentence
  setup-and-payoff pairs. All three fixed with direct clarifying text in `DESIGN.md`.
- Deferred (1 new, low): `DESIGN.md`'s Overview line still states the pre-rebrand thesis live
  while the new Voice anti-example 7 calls it superseded — a real internal contradiction, but its
  fix is explicitly Story 1.3's job per this story's own intent boundary.
- Carried from the first pass (2, both already logged and unchanged): the compliance-copy
  scope-boundary question (rejected — already covered by the backlog's Epic-8 phasing) and the
  English-only Voice block limitation (deferred — already tracked as DW-4).
- Rejected (3, all low): an anti-example ambiguity that doesn't actually cause a misjudgment
  (it already fails on a different criterion); a request for a passing example of the UI-label
  category, not required by the AC; a real Code Map arithmetic mismatch (4 claimed manifesto
  quotes vs. 3 listed) whose only fix is editing this build's own spec.
- False (2): the `sprint-status.yaml`-vs-frontmatter status mismatch two layers both flagged is
  the expected transient state mid-review-pass, resolved by this workflow's own Finalize step.

**Follow-up review recommendation:** false. This is itself a follow-up pass (`followup_pass:
true`); per the rule for follow-up passes, a further pass is warranted only if this pass patched
a `high` finding. None of the three patches this pass were `high` — all three were `medium`
criterion-wording clarifications, and patch volume alone is not grounds for another pass.

**Verification performed:**
- `grep -c "^## Voice" DESIGN.md` → **1**. Pass.
- `awk '/^## Voice/,/^## Colors/' DESIGN.md | grep -c "^[0-9]\+\. \""` → **20**. Pass (criteria
  lines use `1. **Bold**` with no trailing quote, so the three criterion-text edits do not affect
  this count).
- `grep -n "Blunt\|Operator first-person\|Short declarative\|Edge without profanity" DESIGN.md` →
  13+ hits. Pass.
- Manual: re-read all three patched criteria against every one of the 20 example/anti-example
  lines; no prior verdict changed under the amended wording.

**Residual risks:**
- The three newly-patched clarifications (the "so" joiner, bare "you" addressing, and the
  whole-line scoping for setup-and-payoff pairs) are, like the first pass's three patches, only
  checked against the specific edge cases that surfaced them — not stress-tested against a wider
  set of candidate sentences.
- Deferred: DW-4 (Voice block is English-only; Epic 4 must decide carryover for
  `src/i18n/translations.ts`'s `et:` block) and the new Overview/anti-example-7 contradiction,
  which Story 1.3 is expected to resolve when it marks the old thesis superseded.

