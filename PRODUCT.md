# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Primary: Estonian / Baltic technical founders and SMB owners who hold technical authority over their web applications and make the security purchase decision. (Confirmed with user.)
- Secondary: international visitors arriving via the technical guides, llms.txt, or the research/disclosure policy; they evaluate expertise rather than buy directly.

Situation: they run a web product, suspect (or know) their authentication/session handling is weak, and are deciding between an automated scanner, a generic consultancy, or someone who can actually demonstrate the break.

## Product Purpose

ProksiAbel OÜ sells offensive security services: web application penetration testing, secure development practices, and security research/tooling. The site exists to convert visitors into consultation bookings and to establish Tom Kristian Abel as the credible, hands-on offensive specialist behind the company. Success = qualified leads arriving at the contact form / info@proksiabel.ee.

## Positioning

The mechanism a competitor cannot truthfully copy: Tom's offense-first credibility — he has spent 6+ years breaking web apps, writes custom tooling in Go, and has authored real bypasses of major client-side bot-detection systems. The pitch is "we know exactly how to break in, so we can tell you how to defend," aimed squarely at the failure mode of automated-scanner PDF reports ("automated slop").

## Operating Context

- One-person consultancy run by Tom Kristian Abel (Tallinn, Estonia); site copy mixes first-person "I" and company "we" — the brand is the person.
- Actual engagements are governed by separate formal contracts; the website is explicitly a presence/lead layer, not the agreement.
- Work is remote-capable; response promise is "within 24h"; security research contact is security@proksiabel.ee with PGP strongly preferred (public-key.asc + openpgpkey WKD published).
- The site is EN-first with a full ET translation; "Estonian Security Consultancy" is a headline badge — local trust is a feature.
- Contact form exists (name optional, email, message); form errors direct users to email as fallback.

## Capabilities and Constraints

Capabilities (services):
1. Penetration testing & vulnerability management — manual web app pentests, auth-flow threat modeling, session hijacking & AiTM simulations.
2. Secure development practices — MITM countermeasures, securing auth against active interception, TLS client-fingerprinting defenses.
3. Security research & tool development — responding to undocumented threats, custom Go tooling, JS bot/fraud-system reverse engineering.

Content: two technical guides (FIDO2 vs Passkeys; SSRF Explained with a reproducible local lab), responsible-disclosure/security-research policy, PGP page, privacy/terms/cookie policies, llms.txt, sitemap.xml, security.txt, robots.txt.

Technical constraints:
- Vite + React 19 + TypeScript (strict) + Tailwind + react-router + react-helmet-async; prerendered route shells with per-route SEO; build outputs to `pub/`.
- i18n: EN + ET only.
- Infrastructure: Cloudflare (Workers static assets; full SSL, HSTS, CSP, cache rules, bulk redirects for legacy URLs; Bot Fight Mode is dashboard-only and intentionally off).
- Privacy commitment is explicit and binding in copy: no tracking cookies, no Google Analytics, no ad pixels, no profiling; only Cloudflare's `_cf_bm`/`_cfuvid` security cookies; GDPR + AKI-compliant, logs retained 12 months.
- Company: ProksiAbel OÜ, registry 17017826, Pargi tn 2 Sindi, Tori vald, Pärnumaa 86705, Estonia.

## Brand Commitments

- Name: ProksiAbel (claimed in terms as "ours"; do not rename).
- Voice (updated 2026-08-11 per UX audit; prior casual street-slang style retired): direct, first-person, authoritative — confident and hands-on, zero corporate boilerplate, no slang or self-deprecating asides ("Kuule", "Yeah, that was a fun weekend" removed). Mixing of "I" (Tom) and "we" (company) is incumbent behavior — keep unless explicitly changed.
- Expert photo credited "photo by Maido".
- Privacy-first stance is a brand position, not just compliance (see Capabilities and Constraints).
- PGP for sensitive comms is a branded expectation ("Use PGP, please").

## Evidence on Hand

- Real company registration and Estonian address/contact details (see contact.tsx, legal copy).
- SSRF guide with a reproducible local lab; FIDO2 vs Passkeys technical guide.
- Published security research policy (disclosure) and PGP key (public-key.asc, WKD).
- OG image, favicon, expert.webp portrait.
- Absent and must NOT be fabricated: testimonials, case studies, client logos, pricing, certifications, or breach-statistics claims. There is no pricing page and no named-client evidence anywhere in the repo.

## Product Principles

1. Offense-first honesty: demonstrate the break, then sell the fix; never present scanner output as expertise.
2. The founder is the brand: Tom's personal credibility and direct, authoritative voice carry the company's trust.
3. Privacy by default: no tracking, no cookies beyond essential security tokens — stated, implemented, and maintained.
4. Local anchor, international standard: Estonian/Baltic trust play delivered with enterprise-grade work.
5. Content earns authority: technical guides and transparent research policy do the SEO and trust work a sales team would otherwise do.
