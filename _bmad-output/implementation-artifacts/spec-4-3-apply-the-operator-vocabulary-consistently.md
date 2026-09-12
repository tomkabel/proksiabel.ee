---
title: 'Apply the operator vocabulary consistently'
type: 'feature'
created: '2026-09-05'
status: 'draft'
route: 'dispatch'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Services surface is already named three different ways on one page —
`nav.services` = "Services", `services.title` (its `<h2>`) = "Our Services",
`services.bento.sectionTag` (its badge) = "Capabilities" — and `expertise.arsenalTitle`
already uses the word "arsenal" for a sub-heading inside Dossier, even though the PRD
glossary and Story 5.3 reserve "The Arsenal" exclusively for the Services surface. Two of
the four fixed lexicon terms, KILL CHAIN and PROOF, have no surface assignment anywhere in
the PRD glossary, architecture spine, or any epic/story — they appear only as list items,
never defined.

**Approach:** Fix the naming collision that exists today (free "arsenal" wording from
Dossier). Decision (human, via decision-picker): Services/Contact's current naming
("Services"/"Our Services"/"Capabilities", "Contact"/"Get In Touch") stays untouched —
Epic 5 Story 5.3 and Epic 7 Story 7.3 own the full recast of those surfaces; this story
does not introduce "Arsenal"/"Target Intake" wording there. Decision (human): KILL CHAIN
names the attack-sequence diagram (`AttackVectorGraph.tsx`, rendered inside `Hero.tsx`) and
PROOF names the evidence/receipts block in Dossier (Recognition + Coordinated disclosure)
— both get a new eyebrow label introducing the term, without editing any existing
Legal-Read-attested string underneath.

## Boundaries & Constraints

**Always:** Every wording change stays inside `src/i18n/translations.ts` (EN authored
directly, ET translated and validated with `estonian-mcp`: `spell_check`, `check_style`,
`classify_register`, `check_compounds` where compounds appear, evidence recorded per
Story 4.2's precedent). `npx tsc -b` must pass after every edit (Story 4.1's parity
check). The new KILL CHAIN and PROOF labels are additional eyebrow/badge elements
(matching the existing `mono-badge`/uppercase-tag pattern already used for
`services.bento.sectionTag` and the Recognition/disclosure icons-and-label rows) — never a
rename of the content beneath them.

**Never:** Do not touch `nav.services`, `services.title`, `services.bento.sectionTag`,
`nav.contact`, or `contact.title` — Epic 5/7 own that naming. Do not touch
`expertise.recognition.title`, `expertise.disclosure.title`, `expertise.recognition.*`,
`expertise.disclosure.*`, or `expertise.bio2` — Legal-Read-attested content; the PROOF
label sits above this content, it does not replace any of it. Do not touch
`AttackVectorGraph.tsx`'s existing internal labels (`session`, `tokenHijack`, `bypass`,
`caption`, `intercepted`, `tokenLabel`) — KILL CHAIN is a new umbrella label, not a rename
of those. Do not touch CTA labels (`bookConsultation`, `learnMore`) or any `about.*`/dead
key. Do not implement Epic 5 Story 5.3's or Epic 7 Story 7.3's content/UI rework.

</frozen-after-approval>

## Code Map

- `src/i18n/translations.ts:212` (`en.expertise.arsenalTitle`) / `:891` (`et.expertise.arsenalTitle`) -- currently "Technical arsenal & focus" / "Tehniline arsenal ja fookus"; rewrite to drop "arsenal" (rendered in `Dossier.tsx:119-128` above the hardcoded, untranslated `ARSENAL` tag array — that array's own name is a source constant, not user-visible copy, out of scope).
- `src/components/Hero.tsx:68-79` -- where `<AttackVectorGraph />` renders inside a `relative` wrapper; add a new eyebrow label here (new `en.hero.graph.sectionTag` / `et.hero.graph.sectionTag` translation key) reading "Kill Chain" in the same visual family as `services.bento.sectionTag`'s badge.
- `src/components/AttackVectorGraph.tsx` -- read-only; confirms the diagram's own internal labels (lines 39-41, 66-68) are untouched.
- `src/components/Dossier.tsx:139-166` -- the Recognition (`e.recognition.*`) and Coordinated disclosure (`e.disclosure.*`) blocks; add a new eyebrow label above both (new `en.expertise.proofTag` / `et.expertise.proofTag` translation key) reading "Proof", without editing `recognition.title`/`disclosure.title` themselves.
- `src/components/Navbar.tsx:50-53` -- read-only; confirms `nav.services`/`nav.dossier`/`nav.contact` stay untouched.

## Tasks & Acceptance

**Execution:**
- [ ] `src/i18n/translations.ts` -- rewrite `en.expertise.arsenalTitle`/`et.expertise.arsenalTitle` to drop "arsenal" (e.g. "Toolset & focus" and an `estonian-mcp`-validated ET equivalent).
- [ ] `src/i18n/translations.ts` -- add `en.hero.graph.sectionTag`/`et.hero.graph.sectionTag` = "Kill Chain" / validated ET equivalent.
- [ ] `src/components/Hero.tsx` -- render the new Kill Chain label as an eyebrow above or beside `<AttackVectorGraph />`.
- [ ] `src/i18n/translations.ts` -- add `en.expertise.proofTag`/`et.expertise.proofTag` = "Proof" / validated ET equivalent.
- [ ] `src/components/Dossier.tsx` -- render the new Proof label as an eyebrow above the Recognition + Coordinated disclosure block.
- [ ] Run `npx tsc -b` after every edit -- confirms EN/ET key parity holds.

**Acceptance Criteria:**
- Given `expertise.arsenalTitle`, when read after this story, then it no longer uses the word "arsenal".
- Given the attack-sequence diagram in `Hero`, when read, then a "Kill Chain" label names it, in both locales.
- Given the Recognition + Coordinated disclosure block in `Dossier`, when read, then a "Proof" label names it, in both locales, and `recognition.title`/`disclosure.title` are unchanged.
- Given `nav.services`, `services.title`, `services.bento.sectionTag`, `nav.contact`, `contact.title`, when this story is complete, then all are byte-identical to `HEAD`.
- Given every new ET string, when validated, then `estonian-mcp` tool output is recorded as evidence.
- Given `npx tsc -b`, when run after every edit, then it passes.

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Verification

**Commands:**
- `npx tsc -b` -- expected: no output/errors, EN/ET key parity holds.
- `npm run build` -- expected: succeeds, all prerendered routes render.
