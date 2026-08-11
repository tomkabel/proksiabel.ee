# proksiabel.ee — SEO Research Report
*Generated: 2026-08-10 | Sources: 27 | Confidence: High (live/repo findings), Medium (AI-bot 403 cause)*

## Executive Summary

The SEO work already done in the repo (per-route meta, prerendering, JSON-LD,
sitemap, llms.txt) is wasted until the new build ships: the live site still
serves the old TanStack "Security Product Studio" app with **zero canonicals,
zero JSON-LD, a stale sitemap listing URLs that now 301→/**, and 404s on all
four legal pages. That deployment gap is the single biggest finding.

Beyond deployment, two substantive 2026-era issues exist:

1. **Tested AI crawler user agents get HTTP 403 at the edge** — including search/index bots
   (OAI-SearchBot, PerplexityBot). For the two bots the cloro.dev study measured
   (GPTBot, PerplexityBot), blocking correlates with steep citation-propensity
   drops in ChatGPT and Perplexity answers. The managed robots.txt only
   *documents* training-bot blocks; the
   edge *enforces* 403s on the tested AI user agents, contradicting the site's own
   `Content-Signal: search=yes`.
2. **Structured data has defects**: a Sitelinks SearchAction pointing at a search
   URL the site doesn't have, a stray `hreflang="x-default"` that does nothing
   on a same-URL bilingual site, and no Person/FAQ schema — the highest-leverage
   AI-search surfaces in 2026.

Fix order: deploy the new build → fix the AI-crawler edge block → repair
schema defects → entity groundwork (Wikidata, NAP consistency). Details below.

---

## 1. Live vs Repo — the core discovery (verified 2026-08-10)

| Check | LIVE (proksiabel.ee) | Repo (`pub/`, new Vite build) |
|---|---|---|
| App | Old TanStack "Security Product Studio", EN-only | New consultancy build, et/en, 7 routes (5 pages + 2 guides) |
| Canonical tags | **zero** (grep of served HTML) | exactly 1 per prerendered page (prerender.js strips non-`data-rh` dupes) |
| JSON-LD | **zero** | ProfessionalService + WebSite on home, BreadcrumbList per subpage |
| Sitemap | 6 URLs (`/products` `/work-with-us` `/approach` `/principal` `/contact`) — **all now 301→/** | 7 URLs (`/` `/privacy` `/terms` `/cookies` `/disclosure` `/guides/fido2-vs-passkeys` `/guides/ssrf-explained`), lastmod 2026-08-10 |
| Legal routes | `/privacy /terms /cookies /disclosure` → **404** | prerendered `pub/<route>/index.html` |
| robots.txt | Cloudflare Managed block + `Allow: /` + Sitemap line | `Allow: /`, `Disallow: /.well-known/openpgpkey/`, Sitemap |
| llms.txt | OLD content ("Security product studio shipping authentication…") | NEW copy (consultancy, services, legal pages, PGP 0x30A8306F110AAAC5) |
| og:image | references `og-image.svg`; **`/og-image.png` → 404** | `pub/og-image.png` 1200×630 present |
| Old routes | 301 → `/` (bulk redirects live, verified) | n/a |

Root cause of the divergence: the live origin is a Cloudflare Workers
static-assets deployment (`wrangler deploy --assets=pub`), not GitHub Pages —
the GH Pages workflow (`.github/workflows/static.yml`) is decorative. The
deployed Worker was serving a stale artifact from before the new build.
Diagnosis should inspect the deployed Worker version (`wrangler deployments
list`), its static-asset binding, and Cloudflare cache state — a stale edge
cache can keep serving the old bundle after a correct deploy, and bare paths
may need a targeted purge. **GSC reports on the deployed artifact**
(per the seo-indexing-audit skill); everything below assumes the new build becomes
live. Until then, the live surface — no canonicals, no structured data, 301'd
sitemap URLs, 404 legal pages — is actively uncompetitive regardless of the
repo's quality.

### Live crawler-access probe (curl, real user-agents)

```
GPTBot/1.0        -> 403
OAI-SearchBot/1.0 -> 403
PerplexityBot/1.0 -> 403
ClaudeBot/1.0     -> 403
Googlebot/2.1     -> 200
Bingbot/2.0       -> 200
```

Googlebot/Bingbot pass; **every AI-flavored UA we tested is 403'd at the edge**. The
served robots.txt only *documents* blocks for training crawlers (GPTBot,
ClaudeBot, CCBot, Google-Extended, …) and its Content Signal says
`search=yes, ai-train=no, use=reference`. The 403s on OAI-SearchBot and
PerplexityBot contradict that signal — something at the edge (Bot Fight Mode
or Cloudflare's AI-bot blocking, both dashboard toggles; the apply run skipped
BFM per the plan) is enforcing stricter than the file declares
([agentcookbooks] documents exactly this silent edge-vs-file mismatch).

---

## 2. AI-crawler policy: the 2026 decision that can cost citations

Research consensus across [LovedByAI], [CitationDesk], [cloro.dev], and the [Cloudflare managed robots.txt docs]:

- **Training crawlers are decoupled from citations.** GPTBot (training) vs
  OAI-SearchBot (ChatGPT search index) vs ChatGPT-User (live in-chat fetch)
  are separate UAs. Blocking GPTBot does NOT remove you from ChatGPT search
  results, per LovedByAI's analysis of OpenAI's bot documentation. Same split at Anthropic (ClaudeBot
  = training, Claude-SearchBot / Claude-User = retrieval) and Perplexity
  (PerplexityBot = index, Perplexity-User = live).
- **Blocking the retrieval bots correlates with far fewer citations.** [cloro.dev]'s study of
  1,058 domains (2026-07): median ChatGPT citation propensity drops from 0.417
  to 0.003 for GPTBot-blockers, and Perplexity propensity to **0** when
  PerplexityBot is blocked. The effect tracks the crawler's owner — engine-
  specific correlation, not proof of causation.
- **Cloudflare defaults are moving.** From 2025, new zones default to blocking
  AI training bots; from 2026-09-15, Agent-category bots (ChatGPT-User,
  Claude-User, Perplexity-User) are blocked by default on ad-monetized pages.
  Both settings have an "allow" mode, and `robots.txt` cannot reliably control
  user-initiated fetchers — only the edge setting can ([LovedByAI]).
- **The recommended pattern** ([LovedByAI], [CitationDesk]): block training
  (GPTBot, ClaudeBot, CCBot, Google-Extended) **and explicitly allow**
  retrieval/agent bots (OAI-SearchBot, ChatGPT-User, Claude-SearchBot,
  Claude-User, PerplexityBot, Perplexity-User) plus Googlebot/Bingbot/Applebot
  — mixed-use bots must be allowed explicitly because the strictest rule wins.

**Recommendation for proksiabel.ee:** this is a policy choice, not a bug. The
current stance (403 on the tested AI crawler user agents) is defensible for a security researcher who
opts out of training — but it also correlates with losing AI-search citations, and it
contradicts the site's own `use=reference` content signal. Allowing the
retrieval/agent bots can only improve retrieval eligibility; whether citations
actually follow remains an engine-specific correlation, not a guarantee. If
retrieval in ChatGPT search / Perplexity / Claude is desired, flip the dashboard
controls to "allow search + agent, block training" — no training cost, and the
retrieval bots become eligible to index the site. Verify after — HTTP-status
check only: `curl -A "OAI-SearchBot/1.0" https://proksiabel.ee/`
should return 200. Note: the repo's committed `public/robots.txt` allows
everything except the `/.well-known/openpgpkey/` WKD directory; the edge is the
only enforcement point, so this is a Cloudflare dashboard change, not a repo change.

---

## 3. Structured data: what's right, what's broken (repo build)

Already correct ([ThatDevPro], [prerender.info], [Agile structured data]):

- `ProfessionalService` (home, `index.html` template) with name, address, geo, openingHours,
  `sameAs` → LinkedIn/GitHub — good entity anchor.
- `BreadcrumbList` per subpage (SEOMeta.tsx) — recommended for non-home pages.
- JSON-LD shipped in **static HTML** via prerender, and CSP hashes the inline
  blocks — no `unsafe-inline` needed. This is the "non-visual elements in
  static HTML" pattern AI crawlers actually read ([prerender.info]).
- `og:image` is a real 1200×630 PNG — SVG og:image is ignored by
  Facebook/LinkedIn/X (static-site-seo skill).

Defects (verified in `index.html` / SEOMeta.tsx):

1. **WebSite SearchAction `?s={search_term_string}`** — Sitelinks Search Box
   schema requires a real, working search URL ([Google structured data]). This
   static site has no search. Google will not render the box, and a dead
   search target is a false signal. **Remove the SearchAction block** (keep
   the WebSite entity, or drop the whole WebSite block — it adds little on a
   5-page site).
2. **`<link rel="alternate" hreflang="x-default" href="https://proksiabel.ee/">`**
   in static index.html — persists into every prerendered page (Helmet never
   removes it). A lone x-default with no language alternates is meaningless
   on a same-URL bilingual site; hreflang requires reciprocal, self-referencing
   sets of distinct locale URLs ([Google localized], [Crawlix]). Harmless but
   noise — remove it, or commit to `/en/` subdirectories (below).
3. **No Person schema.** For a consultancy where the founder *is* the brand
   (site copy is first-person), Person schema with `sameAs` (LinkedIn, GitHub,
   Wikidata) + `knowsAbout` is the highest-leverage AI-search entity move
   ([Agile entity], [Frontend Horizon]). Add a `Person` block referencing the
   founder with `worksFor` → the ProfessionalService entity. (GEO/entity
   research consistently rates Person-with-sameAs as the cheapest,
   most-skipped high-impact tactic.)
4. **No FAQPage schema.** The 2026 GEO playbooks rank FAQ schema near the top
   for both AI-overview and Perplexity/Claude extraction ([Attrifast],
   [Frameleads]). Only worth adding where real Q&A content exists — the home
   page's service descriptions could carry a 3–5 question FAQ block. Do not
   invent FAQs for pages that don't have them.

---

## 4. Sitemap / robots hygiene

- **Live sitemap lists 6 URLs that all 301 → /** — Google treats these as
  "Page with redirect"; they belong out of the sitemap. The repo sitemap is
  correct and will replace it on deploy. Post-deploy: submit the new sitemap
  in GSC and request re-indexing of `/`, `/privacy`, `/terms`, `/cookies`,
  `/disclosure`, `/guides/fido2-vs-passkeys`, `/guides/ssrf-explained` — and
  verify `pub/sitemap.xml` includes both guide routes before publishing
  (per the seo-indexing-audit skill).
- **No-slash URL forms** (`/privacy`, not `/privacy/`) — consistent between
  sitemap, canonicals, and prerendered output; the old app's trailing-slash
  forms now 307. Keep it that way (static-host SPA pitfall documented in the
  static-site-seo skill).
- Repo robots.txt correctly does **not** disallow `/assets/` — critical for
  SPA rendering (Googlebot needs the JS bundle). The `/.well-known/openpgpkey/`
  disallow is fine (WKD dir, not indexable content).
- `pub/` includes `404.html` for unknown paths — correct fallback.

---

## 5. GEO / AI-search readiness (beyond the block)

- **llms.txt is already written and grounded in the new copy** (services,
  legal pages, PGP key). It ships in `pub/`. Adoption is ~7% of sites — still
  differentiating ([Attrifast]); Google explicitly says it doesn't use
  llms.txt for Google Search, but Perplexity, ChatGPT and Claude crawlers read
  it, and it costs nothing ([Google AI guide], [Charles Jones]).
- **`llms-full.txt`**: optional companion; skip unless the pages list expands.
- **Freshness signals**: no `datePublished`/`dateModified` in schema. The
  GEO playbooks weight recency (Perplexity hardest) ([SearchScore]). For a
  static consultancy site, at minimum add `dateModified` to the WebSite/
  page schema on content changes, or a visible "updated" line.
- **Entity footprint**: no Wikidata entry exists for ProksiAbel OÜ (search
  returned nothing). Entity-driven SEO for professional services: Wikidata
  item + `sameAs` network + consistent NAP → knowledge-panel eligibility
  ([Agile entity], [SEO Gurus]). Registry code 17017826 + e-äriregister entry
  are strong third-party references. Medium-effort, compounding payoff.

---

## 6. Bilingual strategy (et/en, same URLs)

Current design: one URL per page, language switched client-side via i18n;
`<html lang>` set per-language by SEOMeta. Google detects language by
algorithm, not hreflang, so this works — but only the et variant is what
Googlebot (and AI crawlers) typically see per crawl, and there's no separate
EN indexable surface ([Google localized]).

Options, in increasing effort:
1. **Keep as-is** (prior session's call). Remove the misleading x-default tag
   (§3.3). Zero cost, zero risk. Good enough for a 5-page consultancy site.
2. **`/en/` subdirectories** with reciprocal hreflang — doubles indexable
   surface, shares domain authority, the recommended structure for most sites
   ([oscom], [wptranslation]). Real work: URL mapping, hreflang clusters,
   sitemap xhtml:link entries. Only worth it if EN traffic is a goal.

Recommendation: option 1 now; revisit if EN organic demand appears.

---

## Key Takeaways

1. **Deploy the new build.** Every SEO asset (canonicals, JSON-LD, sitemap,
   llms.txt, og:image) already exists in `pub/` and is invisible because live
   serves the old app. This is the entire ballgame.
2. **Fix the edge AI-bot 403s deliberately.** Decide: full AI opt-out (current,
   contradictory) or "no training, yes citations" (allow OAI-SearchBot,
   PerplexityBot, *-User bots; keep training blocked). Dashboard change, then
   re-probe with curl.
3. **Repair schema before deploy:** remove masked phone, remove dead
   SearchAction, remove stray x-default, add Person (+ sameAs) for the
   founder, add FAQPage only where real Q&A exists.
4. **Post-deploy checklist:** submit new sitemap in GSC, request indexing for
   the 7 routes (5 pages + 2 guides), verify the sitemap includes both guide
   routes, watch GSC for the old 301'd URLs to clear.
5. **Entity groundwork (compounding):** Wikidata item for ProksiAbel OÜ,
   consistent NAP/email across site + LinkedIn + registry, `dateModified` in
   schema.

## Sources

1. [SEOBRO — React SEO Without SSR: Prerendering](https://seobro.com/blog/react-seo-without-ssr/) — prerender vs runtime vs hybrid for SPAs
2. [Till Freitag — Prerendering a React SPA](https://till-freitag.com/en/blog/prerendering-react-spa-seo-en) — Playwright build-time prerender, JSON-LD injection
3. [DEV — Prerendering 280 pages of a React SPA](https://dev.to/virdix/prerendering-280-pages-of-a-react-spa-for-seo-what-actually-worked-1inf) — wait-on-signal (not timeout) prerender pattern
4. [zebratools — Vite SPA prerender on Vercel](https://zebratools.hashnode.dev/how-i-prerender-a-vite-spa-on-vercel-for-seo-with-puppeteer-sparticuz-chromium) — Googlebot JS render queue, prerender economics
5. [ThatDevPro — React (SPA) SEO](https://www.thatdevpro.com/insights/framework-react/) — rendering modes, structured data as 2026's highest-leverage surface
6. [prerender.info — Non-visual elements prerendering](https://prerender.info/blog/non-visual-elements-prerendering) — JSON-LD/OG/canonical must exist in static HTML
7. [SearchScore — the full GEO playbook](https://searchscore.io/guides/generative-engine-optimisation/) — 5 workstreams: access, quotability, entity, freshness, authority
8. [Search Engine Land — GEO: How to win AI mentions](https://searchengineland.com/what-is-generative-engine-optimization-geo-444418) — GEO principles, citation metrics
9. [Google Search Central — AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) — llms.txt not used by Google; foundational SEO still applies
10. [Frameleads — Optimise for ChatGPT/Claude/Perplexity](https://frameleads.com/how-to/how-to-optimise-for-chatgpt-claude-and-perplexity-geo) — llms.txt + llms-full.txt, FAQ schema, entity grounding
11. [Attrifast — GEO Tactics Playbook](https://attrifast.com/blog/geo-tactics-playbook-2026) — 12 ranked tactics; llms.txt ~7% adoption; FAQPage lift
12. [Charles Jones — GEO is the New SEO](https://charlesjones.dev/blog/geo-new-seo-ai-answer-engines-2026) — training vs citation crawlers, llms.txt spec
13. [Google Search Central — Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions) — hreflang requirements, x-default
14. [Crawlix — hreflang for 20+ markets](https://crawlix.app/blog/hreflang-multi-region/) — cluster consistency, self-referencing canonicals
15. [oscom.ai — Hreflang Implementation Guide](https://oscom.ai/blog/international-seo-hreflang-guide) — subdirectory vs subdomain vs ccTLD
16. [wptranslation — Multilingual SEO Guide](https://wptranslation.net/blog/multilingual-seo-guide.html) — hreflang must-haves, translated metadata
17. [better-i18n — i18n SEO guide](https://better-i18n.com/en/blog/i18n-seo-hreflang-locale-urls-guide/) — locale URL structure, one method only
18. [Cloudflare docs — managed robots.txt](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/) — Content Signals, what the managed block actually does
19. [LovedByAI — Stay visible after Cloudflare's AI crawler defaults](https://www.lovedby.ai/blog/stay-visible-chatgpt-claude-perplexity-cloudflare) — per-bot taxonomy, 2026-09-15 default change
20. [agentcookbooks — Cloudflare AI Audit robots.txt trap](https://agentcookbooks.com/blog/cloudflare-ai-audit-robots-txt-trap/) — edge-injected robots.txt vs committed file
21. [CitationDesk — AI bot allowlist](https://citationdesk.com/guides/ai-bot-allowlist/) — explicit-allow pattern, 2×–3× crawl rate on allowlisted sites
22. [cloro.dev — Do sites that block GPTBot get cited less?](https://cloro.dev/research/ai-crawler-blocks/) — 1,058-domain citation-propensity study
23. [Agile Digital Agency — Entity-driven SEO for professional services](https://www.agiledigitalagency.com/blog/entity-driven-seo/) — Wikidata, sameAs, knowsAbout sequence
24. [Agile Digital Agency — Structured data for AI search](https://www.agiledigitalagency.com/blog/structured-data-for-ai-search-professional-services/) — Organization/Person/Service/FAQ schema set
25. [Frontend Horizon — AEO for professional services](https://www.frontendhorizon.com/blog/answer-engine-optimization-for-professional-services-firms) — connected entity graph, not lone schema blocks
26. [etavrian — Entity SEO B2B playbook](https://www.etavrian.com/blog/entity-seo-b2b-service-playbook) — content before schema; consistency layers
27. [SEO Gurus — Entity SEO for service businesses](https://seo-gurus.co.za/2026/02/27/entity-seo-for-service-businesses-building-a-knowledge-graph-presence-in-2026/) — Organization/Person/Service entity layers, NAP consistency

## Reference links

[LovedByAI]: https://www.lovedby.ai/blog/stay-visible-chatgpt-claude-perplexity-cloudflare
[CitationDesk]: https://citationdesk.com/guides/ai-bot-allowlist/
[cloro.dev]: https://cloro.dev/research/ai-crawler-blocks/
[Cloudflare managed robots.txt docs]: https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/
[agentcookbooks]: https://agentcookbooks.com/blog/cloudflare-ai-audit-robots-txt-trap/
[ThatDevPro]: https://www.thatdevpro.com/insights/framework-react/
[prerender.info]: https://prerender.info/blog/non-visual-elements-prerendering
[Agile structured data]: https://www.agiledigitalagency.com/blog/structured-data-for-ai-search-professional-services/
[Agile entity]: https://www.agiledigitalagency.com/blog/entity-driven-seo/
[Frontend Horizon]: https://www.frontendhorizon.com/blog/answer-engine-optimization-for-professional-services-firms
[Attrifast]: https://attrifast.com/blog/geo-tactics-playbook-2026
[Frameleads]: https://frameleads.com/how-to/how-to-optimise-for-chatgpt-claude-and-perplexity-geo
[SearchScore]: https://searchscore.io/guides/generative-engine-optimisation/
[Google AI guide]: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
[Google localized]: https://developers.google.com/search/docs/specialty/international/localized-versions
[Google structured data]: https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
[Charles Jones]: https://charlesjones.dev/blog/geo-new-seo-ai-answer-engines-2026
[SEO Gurus]: https://seo-gurus.co.za/2026/02/27/entity-seo-for-service-businesses-building-a-knowledge-graph-presence-in-2026/
[oscom]: https://oscom.ai/blog/international-seo-hreflang-guide
[wptranslation]: https://wptranslation.net/blog/multilingual-seo-guide.html
[Crawlix]: https://crawlix.app/blog/hreflang-multi-region/

## Methodology

- **Sub-questions:** (1) SPA/Vite prerendering best practice 2026; (2) GEO /
  AI-search visibility mechanics; (3) AI-crawler blocking tradeoffs incl.
  Cloudflare edge behavior; (4) bilingual/hreflang on same URLs; (5) entity /
  structured data for professional-services consultancies.
- Searched via Exa MCP (semantic) across those clusters; 27 distinct sources,
  majority published 2026 (recency-weighted). Where sources conflict (e.g.
  cloro.dev GPTBot-block correlation vs OpenAI's explicit decoupling), both
  sides are presented.
- Live-site evidence gathered directly: curl probes of robots.txt, sitemap,
  llms.txt, per-route status codes, AI-bot user-agents, headers; repo evidence
  from `pub/`, `index.html`, `src/components/SEOMeta.tsx`, `package.json`,
  `.github/workflows/static.yml`.
- **Gaps:** the exact Cloudflare dashboard setting causing the 403s (Bot Fight
  Mode vs AI-bot blocking) requires a dashboard check — the apply run
  deliberately skipped BFM. GSC numbers (impressions, "not indexed" counts)
  weren't available in this session; the earlier GSC audit found 9×404, 1×
  robots-blocked, 1× duplicate-without-canonical on the old app.
