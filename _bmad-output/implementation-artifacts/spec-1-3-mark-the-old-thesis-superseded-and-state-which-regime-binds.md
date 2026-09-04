---
title: 'Story 1.3: Mark the old thesis superseded and state which regime binds'
type: 'feature'
created: '2026-09-04'
status: 'done'
baseline_revision: '07bffb4f83f44cd1c67616307e473cdf919e883b'
review_loop_iteration: 0
followup_review_recommended: false
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/docs/redesign/manifesto.md'
warnings: ['oversized']
deferred: []
---

<intent-contract>

## Intent

**Problem:** `DESIGN.md`'s frontmatter and Overview still state the superseded "Obsidian
Instrument / one disciplined signal" thesis as live, and its Do's/Don'ts still forbid
terminals, a broken colour budget, and aggressive motion — the exact things the rebrand
requires. An agent reading `DESIGN.md` cold has no signal that these are retired.

**Approach:** Update `DESIGN.md`'s `description` (and `name`) frontmatter and Overview to
state the Adversary thesis; move the entire old thesis text verbatim under a new
`## Superseded — not binding` heading; and for each of the three prohibitions the epic calls
out by name (terminals, colour count, motion intensity), either restate it affirmatively
under the new regime or explicitly release it with a pointer to the epic that defines its
replacement.

## Boundaries & Constraints

**Always:**
- Preserve the full old thesis text (North Star line, both body paragraphs, Key
  Characteristics list) verbatim under `## Superseded — not binding` — no summarizing, no
  deleting.
- Explicitly resolve exactly three prohibitions by name — terminals, colour count (the
  Cyan Core ≤10% / "one disciplined signal" rule), motion intensity — as either restated or
  released, so an agent scanning `DESIGN.md` finds no live ban on any of them.
- Where a prohibition is released rather than restated, name the later epic/story that owns
  its replacement (Epic 3 for palette and motion; the terminal work) rather than inventing
  new visual specifics here — this story ships no visual change.
- Keep the `prefers-reduced-motion` accessibility gate intact and explicitly marked as still
  binding — releasing motion *intensity* is not releasing the reduced-motion fallback
  requirement.

**Never:**
- Do not hand-edit the generated token frontmatter (`colors:`, `typography:`, `rounded:`,
  `spacing:`, `components:`, lines 4-89) — only the `name`/`description` keys and the prose
  body below the frontmatter are in scope.
- Do not invent a new colour palette, new motion values, or new terminal design — that is
  Epic 3 (and the terminal stories) work, not this story's.
- Do not touch `## Voice` (Story 1.2, done) or the manifesto/`PRODUCT.md` (Story 1.1).
- Do not delete or paraphrase the old thesis text; it must survive, just marked not binding.

</intent-contract>

## Code Map

- `DESIGN.md:3` -- frontmatter `description` key: currently `Precision offensive-security
  presence — obsidian depth, one disciplined signal.` Must state the Adversary thesis.
  `name: ProksiAbel` (line 2) may gain a thesis-bearing qualifier (e.g. an em-dash suffix)
  without changing the base product name — no downstream tooling parses this frontmatter yet
  (confirmed: no references to `DESIGN.md` frontmatter fields in `src/`, `scripts/`, or config
  files; the token-consuming pipeline is a later, not-yet-built epic per
  `epic-1-context.md`'s Technical Decisions).
- `DESIGN.md:94-109` -- current `## Overview`: North Star callout ("The Obsidian Instrument"),
  two body paragraphs, and a "Key Characteristics" bullet list. This entire block moves
  verbatim under the new `## Superseded — not binding` heading; `## Overview` gets new,
  thesis-only prose in its place (no new visual specifics — those are Epic 3's job).
- `DESIGN.md:244-259` -- `## Do's and Don'ts`. Three bullets encode the prohibitions this
  story must resolve:
  - Line 248 `**Do** keep Cyan Core (#00e5ff) to ≤10% of any screen...` -- colour count.
  - Line 254 `**Don't** ship fake-terminal / typing-CLI / green-Matrix hacker clichés...` --
    terminals.
  - Line 255 `**Don't** use cyan as a large fill or background; it is a signal, not a
    surface.` -- colour count (same rule as line 248, restated as a Don't).
  - Line 251 `**Do** gate every animation behind prefers-reduced-motion...` -- the
    accessibility gate to keep, not the motion-intensity restraint to release (the old
    regime's motion restraint is stated only in the moved Overview prose, e.g. "Motion is
    spring-eased and purposeful", not as a separate Do's/Don'ts bullet).
  - Lines 247, 249, 250, 256-258 are out of scope (elevation mechanism, mono/tabular-nums,
    font self-hosting, drop shadows, prose-vs-mono separation, font-CDN ban) -- untouched.
- `docs/redesign/2026-09-04-hyper-aggressive-rebrand-backlog.md:55-58` -- Story 0.3, the
  source this story implements verbatim: "Rename the design north star in `DESIGN.md`
  frontmatter/`description`... old thesis moved to a 'Superseded' note, not deleted."
  Lines 65-85 (Epic 1 of the backlog) name which later work owns each released prohibition:
  1.1 (colour), 1.3 (motion), 1.4 (terminal) -- these map to the actual epics.md Epic 3
  stories (3.1 palette, 3.3 motion) and the terminal work in Epic 7.2, per
  `epic-1-context.md`.
- `_bmad-output/implementation-artifacts/deferred-work.md:33-39` (DW-5) -- names the exact
  contradiction this story exists to fix: Overview line 98 ("Credibility comes from
  restraint.") still live while Voice anti-example 7 (`DESIGN.md:140`, Story 1.2, done)
  already calls it "the superseded thesis." Resolving DW-5 is this story's job; mark it
  addressed in the Spec Change Log or Auto Run Result once the Overview text moves.

## Tasks & Acceptance

**Execution:**
- `DESIGN.md:2-3` -- update `name`/`description` frontmatter to state the Adversary thesis
  (notoriety over restraint, inherited AiTM lineage, authorized/contracted aggression) --
  satisfies the AC's frontmatter requirement without touching the token block below it.
- `DESIGN.md:94-109` -- replace `## Overview` body with new Adversary-thesis prose (no new
  visual specifics); move the removed old-thesis text verbatim into a new
  `## Superseded — not binding` heading placed immediately after `## Overview` -- makes the
  supersession explicit and keeps the historical text intact.
- `DESIGN.md` (new subsection under `## Superseded — not binding`) -- add a short list
  resolving the three named prohibitions (terminals, colour count, motion intensity): each
  either explicitly released with a pointer to its owning epic, or noted as still binding --
  the single place an agent finds all three resolved together.
- `DESIGN.md:244-259` -- remove the now-released cyan-budget Do (line 248) and the two
  released Don'ts (terminal ban line 254, cyan-large-fill line 255) from the live Do's/Don'ts
  list, since they are no longer binding and restating them here would contradict the new
  Superseded section -- keeps the live Do's/Don'ts list free of dead rules an agent might
  still enforce.

**Acceptance Criteria:**
- Given `DESIGN.md` frontmatter currently states "Precision offensive-security presence —
  obsidian depth, one disciplined signal", when the story is complete, then the `name`/
  `description` frontmatter states the Adversary thesis.
- Given the old "Obsidian Instrument" thesis, when the story is complete, then it survives
  verbatim (North Star line, both paragraphs, Key Characteristics list) under an explicit
  `## Superseded — not binding` heading rather than being deleted.
- Given the three prohibitions the epic names (terminals, colour count, motion intensity),
  when the story is complete, then each is either restated affirmatively under the new
  regime or explicitly released with a pointer to the epic/story that owns its replacement --
  and the live `## Do's and Don'ts` list no longer contains the released bullets.
- Given an agent reads `DESIGN.md` cold, when it looks for constraints on terminals, colour,
  or motion, then it finds no live prohibition on any of the three, and finds the
  `## Superseded — not binding` heading marking the old ones not binding.
- Given the `prefers-reduced-motion` accessibility gate (`DESIGN.md:251`), when the story is
  complete, then it remains present in the live `## Do's and Don'ts` list, explicitly
  unaffected by the motion-intensity release.

## Spec Change Log

## Review Triage Log

### 2026-09-04 — Review pass

- verdicts: 8 findings — high 0, medium 2, low 4, false 2, maybe-false 0
- findings:
  - `[medium]` `[patch]` blind-hunter: the new "Prohibitions resolved" bullet claims colour count is "Released," but `## Colors` → `### Named Rules` (`DESIGN.md:199`, plus references at :178 and :232) still states "The One Signal Rule" — a ≤10% cyan cap — as a live, unqualified prohibition, directly failing this story's own AC that an agent reading `DESIGN.md` cold finds no live prohibition on colour count. Verified: `grep -n "One Signal Rule" DESIGN.md` showed the rule stated as binding with no release marker. Fixed: `The One Signal Rule` heading now reads "superseded, not binding" with a pointer to `## Superseded — not binding` and a note that Epic 3 Story 3.1 owns the replacement; the rest of its text is left as an accurate description of the current (unchanged) tokens.
  - `[low]` `[patch]` blind-hunter: the new `## Superseded — not binding` intro hardcodes "Voice anti-example 7, `DESIGN.md:140`," but this diff's own insertions push that content down to line 168 — a reader following the citation lands on the wrong line. Verified: `grep -n "superseded thesis stated outright" DESIGN.md` → line 168, not 140. Fixed: dropped the hardcoded line number, now reads "(Voice anti-example 7, below)."
  - `[false]` `[reject]` blind-hunter: claims DW-5 (`deferred-work.md`) stays unresolved and this spec's own logs record nothing — disproven: this spec's own Code Map only commits to marking DW-5 addressed in this spec's `## Spec Change Log` or `## Auto Run Result`, not in `deferred-work.md` itself, and `## Auto Run Result` is populated at Finalize, which had not yet run when this finding was filed.
  - `[low]` `[patch]` blind-hunter: the new "Prohibitions resolved" bullets use British "Colour count" (×2) against the rest of the document's American spelling ("## Colors," "color is reserved for meaning," etc.). Verified: `grep -c "Colour" DESIGN.md` → 2 before the fix. Fixed: both instances now read "Color count."
  - `[false]` `[reject]` blind-hunter: claims the new `name: ProksiAbel — The Adversary` frontmatter value is suspect because it appears nowhere else in the repo — disproven: no rule requires new prose to already exist elsewhere; this story is the first artifact to state the frontmatter thesis, matching its own AC.
  - `[low]` `[reject]` blind-hunter: a reader skimming only the Overview/Superseded block "could" walk away thinking the `prefers-reduced-motion` gate itself was released, since the qualifying clause is the tail of a dense bullet rather than its own callout — no named concrete harm beyond a hypothetical skim, the qualifying sentence is already present and explicit ("is unaffected and remains binding"), and giving it its own callout is more than a direct correction.
  - `[medium]` `[patch]` edge-case-hunter: same root cause as the first blind-hunter row above — `## Colors` still states the ≤10% cyan-budget rule as live and unqualified, contradicting the "released" claim. Same fix applied (see above row).
  - `[low]` `[patch]` edge-case-hunter: same root cause as the second blind-hunter row above — the hardcoded `DESIGN.md:140` citation goes stale the moment this diff's own insertions shift content down. Same fix applied (see above row).
- verification-gap: no findings (diff is pure prose/documentation; no code parses `DESIGN.md`, confirmed via repo-wide grep).
- intent-alignment: descriptive only, no discrete findings — confirmed this story's own acceptance criteria contain no human-only action (no domain purchase, DNS record, API key, or vendor console step), so the invocation's `awaiting-operator` conditional does not fire for this story; normal `done` finalization applies.

## Design Notes

Placement of the new prohibition-resolution list: nested under `## Superseded — not binding`
(as a subsection) rather than as a new top-level heading, because the epic's own AC frames it
as marking what's *not binding* -- keeping the resolution notes physically next to the text
they resolve means an agent that finds one finds the other, satisfying "reads it cold" without
a second cross-reference to chase.

The old thesis's "Credibility comes from restraint." line (DW-5) moves with the rest of the
Overview body -- this both resolves DW-5 (no longer live in `## Overview`) and matches Story
1.2's Voice anti-example 7, which already calls that exact sentence "the superseded thesis."

## Verification

**Commands:**
- `grep -n "^## Superseded" DESIGN.md` -- expected: 1 hit.
- `grep -c "Credibility comes from restraint" DESIGN.md` -- expected: 2 (once in the moved
  Superseded block, once already quoted in the Voice anti-example 7 annotation at
  `DESIGN.md:140`) -- confirms the line moved out of `## Overview` rather than being deleted
  or duplicated there.
- `awk '/^## Overview/,/^## Superseded/' DESIGN.md | grep -c "one disciplined signal\|Obsidian Instrument"` -- expected: 0 -- confirms the old thesis language no longer appears in the live `## Overview` body.
- `awk '/^## Do.s and Don.ts/,0' DESIGN.md | grep -ic "fake-terminal\|Cyan Core.*10%\|large fill"` -- expected: 0 -- confirms the three released bullets are gone from the live Do's/Don'ts list.
- `grep -n "prefers-reduced-motion" DESIGN.md` -- expected: still present, confirming the accessibility gate was not accidentally removed.

**Manual checks (if no CLI):**
- Read `## Superseded — not binding` end to end and confirm it contains the full original
  North Star line, both original body paragraphs, and the original Key Characteristics list,
  unedited.
- Confirm the frontmatter `colors:`/`typography:`/`rounded:`/`spacing:`/`components:` block
  (lines 4-89) is byte-identical to before this story.

## Auto Run Result

Status: done

**Summary:** `DESIGN.md`'s frontmatter and Overview now state the "Adversary" thesis instead
of the superseded "Obsidian Instrument / one disciplined signal" one. The old thesis survives
verbatim under a new `## Superseded — not binding` heading. The three prohibitions the epic
names by name — terminals, colour count, motion intensity — are each explicitly released with
a pointer to the epic/story that owns their replacement, and the `prefers-reduced-motion`
accessibility gate is explicitly called out as unaffected. A review pass then closed a real gap
this left open: the "One Signal Rule" was still stated as a live, unqualified prohibition in
`## Colors`, contradicting the "released" claim.

**Files changed:**
- `DESIGN.md` — `name`/`description` frontmatter restated to the Adversary thesis; `## Overview`
  replaced with thesis-only prose; new `## Superseded — not binding` heading holding the old
  thesis verbatim plus a `### Prohibitions resolved` subsection; three now-released bullets
  removed from the live `## Do's and Don'ts` list; `## Colors` → `### Named Rules`'s "The One
  Signal Rule" marked superseded/not-binding (review-pass fix); a stale hardcoded line-number
  citation removed (review-pass fix); British "Colour" spelling corrected to "Color"
  (review-pass fix).
- `_bmad-output/implementation-artifacts/spec-1-3-mark-the-old-thesis-superseded-and-state-which-regime-binds.md`
  — this spec: planning, review triage log, this result.

**Review findings breakdown (8 findings across two layers with findings; verification-gap and
intent-alignment reported none):**
- Patched (3 entries after grouping — 1 medium, 2 low): `## Colors`'s "One Signal Rule" still
  live and unqualified despite the "released" claim (medium — directly failed this story's own
  AC that an agent reading `DESIGN.md` cold finds no live prohibition on colour count); a
  hardcoded `DESIGN.md:140` citation gone stale from this diff's own line shift (low); British
  "Colour" spelling inconsistent with the rest of the document (low).
- Rejected (3, all low or false): a claim that `deferred-work.md`'s DW-5 stays unresolved and
  this spec's own logs record nothing (false — this spec's Code Map only commits to marking
  DW-5 addressed in this spec's own Change Log/Auto Run Result, not in `deferred-work.md`, and
  Auto Run Result is populated here at Finalize); a claim the new `name` frontmatter value is
  suspect for not appearing elsewhere in the repo (false — no such rule exists, and this story
  is the first artifact to state it); a claim a skimming reader could miss that the
  `prefers-reduced-motion` gate remains binding (low, rejected as vague — no named concrete
  harm, and the qualifying sentence is already explicit).

**Follow-up review recommendation:** false. This pass patched one `medium` entry and two `low`
entries — no `high`, and fewer than two `medium` — so per the first-pass rule this does not
warrant a further review pass.

**Verification performed:**
- `grep -n "^## Superseded" DESIGN.md` → 1 hit. Pass.
- `grep -c "Credibility comes from restraint" DESIGN.md` → 2. Pass.
- Old-thesis language inside live `## Overview` → 0 hits. Pass.
- Released bullets inside live `## Do's and Don'ts` → 0 hits. Pass.
- `grep -c "prefers-reduced-motion" DESIGN.md` → 4 hits (gate intact). Pass.
- Post-patch: `grep -n "DESIGN.md:140" DESIGN.md` → 0 hits (stale citation removed). Pass.
- Post-patch: `grep -c "Colour" DESIGN.md` → 0 hits (spelling fixed). Pass.
- Post-patch: `grep -n "One Signal Rule" DESIGN.md` → the `### Named Rules` definition now
  reads "superseded, not binding" with a pointer to `## Superseded — not binding`. Pass.
- Manual: confirmed the frontmatter `colors:`/`typography:`/`rounded:`/`spacing:`/`components:`
  block (lines 4-89) is unchanged in the diff since baseline — only `name`/`description`
  differ.

**Residual risks:**
- The `## Colors` → `### Named Rules` fix describes the current tokens as still accurate while
  marking only the ≤10% *cap* as released; if Epic 3 Story 3.1 changes the token values
  themselves rather than just the budget rule, that story will need to touch this prose too —
  expected, since it is explicitly named as the owner of the replacement.
- DW-4 (Voice block is English-only) remains open and out of this story's scope, unchanged from
  Story 1.2.
