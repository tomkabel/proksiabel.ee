---
title: 'Story 1.1: Publish the brand manifesto'
type: 'feature'
created: '2026-09-04'
status: 'in-progress'
baseline_revision: '2708f45d38c166df81bd4ae87928e20ebed2bf35'
review_loop_iteration: 0
followup_review_recommended: false
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/docs/redesign/2026-09-04-hyper-aggressive-rebrand-backlog.md'
warnings: ['oversized']
deferred: []
---

<intent-contract>

## Intent

**Problem:** The "Adversary" rebrand has no written thesis. Every later copy story would
re-argue the positioning per surface, and the one differentiator the site buries — that this
operator's work descends from Evilginx-class adversary-in-the-middle tooling — has never been
stated in a form that can be checked, cited, or graded.

**Approach:** Publish a 150–250 word manifesto at `docs/redesign/manifesto.md` that states the
Evilginx → ProksiAbel → boutique lineage as inherited technical DNA, with a per-claim source
table, and restate the same thesis in the existing `PRODUCT.md` "Positioning" section so the
two cannot drift.

## Boundaries & Constraints

**Always:**
- Grey-zone history is past tense; present-day work is described as authorized and contracted.
- Every factual claim carries a named source in the manifesto's Sources table. A claim with no
  source is cut, not softened.
- Truthfulness Rules bind verbatim: RedSWAT is AMEDIA's product and the credential is
  "award-winning team" (no rank, never attributed to ProksiAbel); the eID findings were the
  operator's with AMEDIA corroboration; no claim of Evilginx authorship.
- Evilginx's actual authorship is Kuba Gretzky (breakdev.org, 2017). The lineage claim is about
  inherited technique, never nationality or authorship — the phrase "the Estonian lineage that
  produced Evilginx" that appears in the planning docs is factually wrong and must not ship.
- Aggression is tone, never an offer. Nothing may read as advertising present MFA-bypass-for-hire.
- The body between the markers is 150–250 words inclusive. Reach the count by writing, never by
  padding the Sources table.
- A claim that only the operator can attest to (ProksiAbel's own pre-boutique AiTM work) stays at
  low specificity, past tense, is sourced as operator attestation, and is listed under
  `## Open verification`. Never invent a citation for it.

**Never:**
- No voice block, no `DESIGN.md` edits, no superseded-thesis handling — those are Stories 1.2/1.3.
- No component, i18n, token, or styling changes. This story ships prose only.
- No named or disparaged third-party targets or vendors; no payloads, PoC, or tooling detail.
- No invented client work, testimonials, pricing, or certifications.

</intent-contract>

## Code Map

- `docs/redesign/manifesto.md` -- **new file**, the deliverable. Sits beside the existing
  `2026-08-25-offensive-presence-blueprint.md` (superseded restraint thesis) and
  `2026-09-04-hyper-aggressive-rebrand-backlog.md` (the source backlog; its North Star at lines
  8–17 is the tone target, its Truthfulness guardrail at lines 33–40 is binding).
- `PRODUCT.md` -- has an existing `## Positioning` section at line 20–22 stating the current
  "offense-first credibility / automated slop" pitch. Rewrite that section only; leave
  `## Brand Commitments` (line 49) and `## Evidence on Hand` (line 57) untouched — 1.2/1.3 and
  Epic 2 own those. Line 61–62 of `PRODUCT.md` carries the binding eID and RedSWAT framings
  verbatim; reuse that wording rather than paraphrasing it.
- `_bmad-output/planning-artifacts/prds/prd-proksiabel.ee-2026-09-04/prd.md` -- FR-1 at line 148
  is the requirement; line 30 contains the "Estonian lineage that produced Evilginx" error;
  line 469 forbids claiming Evilginx authorship; line 386 requires citation-or-cut.
- Read-only evidence gathered during planning: Evilginx was created and released April 2017 by
  Kuba Gretzky at `https://breakdev.org/evilginx-advanced-phishing-with-two-factor-authentication-bypass/`
  (author page `https://breakdev.org/author/kuba/`, code at `https://github.com/kgretzky/evilginx2`).
  He is not Estonian and has no connection to ProksiAbel.
- No source for ProksiAbel's pre-boutique AiTM history exists anywhere in the repository. Grep for
  `evilginx|lineage|grey.zone` hits planning docs only — no code, no data file, no published page.

## Tasks & Acceptance

**Execution:**
- `docs/redesign/manifesto.md` -- create the manifesto: a 150–250 word body between explicit
  `<!-- manifesto:body-start -->` / `<!-- manifesto:body-end -->` markers, followed by a
  `## Sources` table with one row per factual claim (claim | source | verifiable externally?) --
  the markers make the word-count acceptance mechanically checkable and keep the Sources table
  out of the count.
- `PRODUCT.md` -- rewrite the `## Positioning` section to the lineage thesis in the same terms as
  the manifesto, keeping the "we know how to break in, so we can tell you how to defend" mechanism
  -- the two documents must not contradict, and `PRODUCT.md` is what agents read for positioning.
- `docs/redesign/manifesto.md` -- add a short `## Open verification` note listing the claims Story
  2.3 must verify or cut, and the one claim that needs the operator -- so the unverifiable residue
  is recorded rather than laundered into confident prose.

**Acceptance Criteria:**
- Given the file did not exist, when the story is complete, then `docs/redesign/manifesto.md`
  exists and its body between the markers is 150–250 words.
- Given the manifesto body, when it is read, then it states the Evilginx → ProksiAbel → boutique
  lineage as inherited technical DNA, with grey-zone periods in the past tense.
- Given the manifesto, when any factual sentence is checked, then it maps to a row in `## Sources`
  naming a traceable source.
- Given `PRODUCT.md`, when its `## Positioning` section is read against the manifesto, then it
  states the same thesis and contradicts nothing in it.
- Given the Truthfulness Rules, when the manifesto is checked, then it contains no rank claim about
  RedSWAT, no claim that ProksiAbel built RedSWAT, and no claim of Evilginx authorship.
- Given the manifesto, when it is read for legality, then every present-day engagement it describes
  is authorized and contracted, and no third party is named or disparaged.

## Spec Change Log

## Review Triage Log

## Design Notes

The planning chain propagates one factual error: the PRD (line 30) and the backlog (line 15) both
call Evilginx Estonian. It is Polish work — Kuba Gretzky, breakdev.org, 2017. Implementing the
intent faithfully therefore means implementing the *lineage-as-inherited-technique* claim and
dropping the nationality claim; the ACs already forbid an uncited factual claim, so this is the
reading the story's own acceptance selects, not a scope change.

The residual risk is the opposite claim: ProksiAbel's own pre-boutique adversary-in-the-middle
work. Nothing in the repository sources it, and no external source can. It is kept at low
specificity, past tense, attributed as operator attestation, and listed under `## Open
verification` for Story 2.3 — which exists precisely to verify or cut it.

## Verification

**Commands:**
- `awk '/manifesto:body-start/{f=1;next}/manifesto:body-end/{f=0}f' docs/redesign/manifesto.md | wc -w`
  -- expected: a number between 150 and 250.
- `grep -ci "1st place\|first place\|built RedSWAT\|I wrote Evilginx\|authored Evilginx" docs/redesign/manifesto.md PRODUCT.md`
  -- expected: 0 for both files.

**Manual checks (if no CLI):**
- Read `## Positioning` in `PRODUCT.md` directly against the manifesto body: same thesis, no
  contradiction, no claim present in one and denied by the other.
- Confirm every sentence in the body that asserts a fact has a matching row in `## Sources`.
