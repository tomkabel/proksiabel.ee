# Brand manifesto — "The Adversary"

> Story 1.1 of the hyper-aggressive rebrand
> (`docs/redesign/2026-09-04-hyper-aggressive-rebrand-backlog.md`). The body between the markers
> is the manifesto; everything else on this page is apparatus. `PRODUCT.md` → `## Positioning`
> carries the same thesis and must not contradict it.

<!-- manifesto:body-start -->

We are the adversary you contract.

Evilginx — the reverse-proxy framework that turned phishing straight through multi-factor
authentication into a solved problem — was written by Kuba Gretzky and released in 2017. We did
not write it. We inherited its technique: a proxy sitting between your user and your identity
provider, relaying every byte, including the session cookie your MFA was supposed to protect.

ProksiAbel descends from that lineage. Before the company existed we ran adversary-in-the-middle
tooling of our own, in the grey zone, and learned what actually survives contact with a real
login flow. That period is history. It is also why the advice is worth paying for.

Today the same technique is pointed at your stack under a signed scope. Web application
penetration testing. Auth-flow threat modelling. Session hijacking and AiTM simulation against
the login you believe holds. We break in, on paper, with permission, then tell you what to fix.

The receipts are public. Findings in the Estonian eID stack — digidoc4j, SiGa, SiVa —
independently discovered by us, corroborated by AMEDIA, disclosed upstream before publication. A
member of the award-winning team at the RedSWAT AI/GovTech Hackathon 2026. Custom Go tooling, and
real bypasses of major client-side bot-detection systems.

Scanners ship PDFs. We ship the break, and then the fix.

<!-- manifesto:body-end -->

## Sources

| Claim | Source | Verifiable externally? |
| --- | --- | --- |
| Evilginx is a reverse-proxy phishing framework that relays credentials and session cookies past MFA | Kuba Gretzky, "Evilginx — Advanced Phishing with Two-Factor Authentication Bypass", breakdev.org; code at `github.com/kgretzky/evilginx2` | Yes |
| Evilginx was written by Kuba Gretzky and released in 2017 | `https://breakdev.org/evilginx-advanced-phishing-with-two-factor-authentication-bypass/` (April 2017), author page `https://breakdev.org/author/kuba/` | Yes |
| ProksiAbel did not author Evilginx | Stated by omission and directly; no authorship is claimed anywhere in this repository | Yes (negative claim) |
| Pre-company adversary-in-the-middle tooling run by the operator, grey zone, past tense | Operator attestation only — no repository or public source exists | **No** — see `## Open verification` |
| Services sold today: web app pentesting, auth-flow threat modelling, session hijacking / AiTM simulation | `PRODUCT.md` → `## Capabilities and Constraints`, and the live services copy in `src/i18n/translations.ts` | Yes (published site) |
| Engagements are authorized and governed by separate formal contracts | `PRODUCT.md` → `## Operating Context` | Partly (contract terms are private) |
| Estonian eID findings (digidoc4j, SiGa, SiVa), independent discovery by the operator, corroborated by AMEDIA, disclosed upstream | `PRODUCT.md` → `## Evidence on Hand` (binding framing); published disclosure case study | Yes (published case study) |
| Award-winning team, RedSWAT AI/GovTech Hackathon 2026 — team credential, no rank, not a ProksiAbel product | `PRODUCT.md` → `## Evidence on Hand`; memory note `redswat-hackathon-credential` | Partly (organiser's announcement) |
| Custom Go tooling; bypasses of major client-side bot-detection systems | `PRODUCT.md` → `## Positioning` and `## Capabilities and Constraints` — operator attestation | **No** — see `## Open verification` |

## Open verification

Story 2.3 must verify or cut the following before this thesis reaches a public surface:

1. **Pre-boutique adversary-in-the-middle work.** Only the operator can attest to it. Nothing in
   this repository sources it and no external source exists. It is deliberately kept at low
   specificity, past tense, unnamed as to targets. If the operator cannot stand behind it on the
   record, the sentence is cut — it is not softened.
2. **Bot-detection bypasses.** Asserted in `PRODUCT.md` since before the rebrand, never cited. Needs
   either a publishable artifact or removal from the manifesto.
3. **RedSWAT credential wording.** Confirm the organiser's own announcement supports
   "award-winning team" as written. No rank, no placement, never attributed to ProksiAbel.
4. **Evilginx facts.** Cited above from breakdev.org; re-check the URLs resolve at publication time.

Known planning-chain error, deliberately not implemented: the PRD (line 30) and the backlog
(line 15) describe Evilginx as Estonian work. It is Kuba Gretzky's, Polish, 2017. The lineage
claim in this manifesto is about inherited technique only — never nationality, never authorship.
