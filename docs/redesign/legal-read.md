# Legal Read

This is the dated sign-off log for the editorial (legal/factual) review every epic's claim-bearing
copy must pass before that epic ships. **A failed entry blocks release of that epic.** A pass does
not carry forward: if an epic's copy changes after a PASS verdict, the epic must be re-submitted
and reviewed again as a new dated entry — the earlier pass no longer applies to the changed copy.

## Criteria

Every entry checks all four of the following, individually:

- **(a) Grey-zone past tense** -- grey-zone heritage content is written in the past tense and reads
  as clearly historical, not as a current activity.
- **(b) No unlawful-service advertising** -- nothing reads as advertising a current
  unlawful MFA-bypass-for-hire service.
- **(c) Authorized/contracted framing** -- all present-day engagements are presented as authorized
  and governed by a contract, not as unscoped or informal access.
- **(d) No third-party defamation** -- no statement about a third party (person, company, product)
  is false, unsupported, or presented in a way that could defame them.

## Entries

## 2026-09-05 -- Epic 1: Publish the Adversary manifesto

**Files reviewed:** `docs/redesign/manifesto.md`, `PRODUCT.md`, `src/i18n/translations.ts`,
`index.html`

Reviewed as of commit `db7935d` (Story 1.1, "publish the Adversary manifesto and realign PRODUCT
positioning"); `manifesto.md` and `PRODUCT.md` are unchanged since that commit. `translations.ts`
and `index.html` are the live published EN/ET surface carrying the same claims and are reviewed
here directly, per operator-resolved scope (see this story's Spec Change Log) — an entry covering
only the internal planning docs does not certify what visitors and search engines actually see.

- (a) Grey-zone past tense: PASS -- `manifesto.md`: "Before the company existed we ran
  adversary-in-the-middle tooling of our own, in the grey zone, and learned what actually survives
  contact with a real login flow. That period is history." is explicit past tense with an explicit
  closure statement. `PRODUCT.md` -> `## Positioning` states the same lineage as "carried forward
  through Tom's own pre-company AiTM iterations in the grey zone... Grey-zone history is past
  tense; every present-day engagement is authorized and scoped." No grey-zone activity is
  described as ongoing. `translations.ts`/`index.html` do not restate the grey-zone history at all
  (`expertise.bio1`/`bio2` at `:159-160`/`:840-841` cover only the present-day offensive-security
  background and the bot-detection proof-of-concept, discussed under (b) below) -- nothing in the
  live copy contradicts the past-tense framing.
- (b) No unlawful-service advertising: PASS -- `manifesto.md`'s present-tense service description
  is scoped to authorized testing: "Today the same technique is pointed at your stack under a
  signed scope... We break in, on paper, with permission, then tell you what to fix." The
  `translations.ts:160` / `:841` bot-detection-bypass sentence ("I have also authored a
  proof-of-concept that fully bypassed a major platform's client-side bot detection system" /
  Estonian equivalent) is stated as a past research credential, not an offer to bypass bot
  detection or MFA for a buyer today, and the surrounding `offensive`/`technical` blocks
  (`:174-179`, `:854-859`) describe capability and mindset, not a purchasable bypass service.
  Nothing in any of the four files offers unauthorized access or bypass-for-hire.
- (c) Authorized/contracted framing: PASS -- `manifesto.md` uses "under a signed scope" and "on
  paper, with permission"; `PRODUCT.md` -> `## Operating Context` states "Actual engagements are
  governed by separate formal contracts; the website is explicitly a presence/lead layer, not the
  agreement." `translations.ts`/`index.html` carry no service copy that contradicts this (the
  disclosure copy reviewed under (d) is framed as coordinated/authorized research, not an
  unscoped-access claim). All four files agree.
- (d) No third-party defamation: PASS -- `manifesto.md` credits Kuba Gretzky as Evilginx's author
  with a cited source and explicitly does not claim it as ProksiAbel's work; AMEDIA is credited as
  a corroborating party for the eID findings, a positive/neutral factual attribution.
  `translations.ts:187-189`/`:867-869` ("Award-winning team with AMEDIA (Kyiv): AI-driven
  automated penetration testing of government code") and the matching `index.html:86` JSON-LD
  `award` field restate the same RedSWAT/AMEDIA credential with no rank inflation and no claim of
  sole ProksiAbel authorship, consistent with `PRODUCT.md` -> `## Evidence on Hand`'s binding
  framing ("team effort, no rank inflation"). `translations.ts:195`/`:875` (`disclosure.lead`)
  states the eID findings were "corroborated by AMEDIA" and reported to CERT-EE, matching
  `PRODUCT.md`'s binding framing ("independent discovery by Tom, corroborated by AMEDIA... never
  inflate attribution or claim sole/first discovery"). No claim about any third party in any of the
  four files is negative or unsupported.

**Verdict: PASS**

Note (visibility only, no verdict): the bot-detection-bypass claim is live and uncited in both the
internal docs and the published site -- `manifesto.md`'s own `## Open verification` section flags
it as claim #2 ("Bot-detection bypasses... Asserted in `PRODUCT.md` since before the rebrand, never
cited. Needs either a publishable artifact or removal from the manifesto."), and the identical,
unqualified claim ships live today at `translations.ts:160` (EN) and `translations.ts:841` (ET):
"I have also authored a proof-of-concept that fully bypassed a major platform's client-side bot
detection system" / "Olen kirjutanud ka proof-of-concept lahenduse, mis läks täielikult mööda ühe
suure platvormi kliendipoolsest bot-tuvastusest." This is a citation-completeness question, not one
of the four criteria above -- verifying or cutting it is Story 2.3's job, and no pass/fail verdict
is attached to it here per this story's scope.
