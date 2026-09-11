# Content Pipeline Log — proksiabel.ee

Published topics and pipeline runs. One entry per run; append at the bottom.

Format: `YYYY-MM-DD | route | topic | strategy # | keyword target | result`

---

## 2026-08-11 | DRY-RUN | /guides/ssrf-explained | SSRF deep-dive with local lab | Strategy 2 | "SSRF / server side request forgery / SSRF attack example"

**Status:** DRY-RUN (per run context: all steps through the review gate executed; NOT committed, NOT pushed, NOT deployed, no cache purge).

**Would-be commit message:** `feat(guides): add SSRF explained technical guide with lab`

**Files changed (uncommitted):**
- `src/components/SsrfGuide.tsx` (new — article, TechArticle JSON-LD, lab, detection rules, Python/Go/Node fix patterns, Estonian summary)
- `src/App.tsx` (lazy route /guides/ssrf-explained)
- `src/components/Footer.tsx` (guide link)
- `public/sitemap.xml` (URL entry, changefreq monthly, priority 0.8)
- `public/llms.txt` (entry)
- `docs/content-pipeline-log.md` (this file)
- `pub/` build artifacts (vite output + prerendered pages; same handling as the FIDO2 guide commit)

**Deviations from plan:**
- `src/i18n/translations.ts` was NOT modified. Initially wired titleKey/descriptionKey with en+et `seo.guides.ssrf` keys, but the site's default language is `et` (LanguageContext) — the prerendered/crawl-facing page then carried an Estonian meta title for an English article. Reverted to the FIDO2 guide precedent (defaultTitle/defaultDescription only) so the target-keyword English title renders by default.
- OWASP Top 10:2025 fact check: the strategy doc's "SSRF folded into A10" is incorrect — the 2025 edition rolled SSRF into A01:2025 Broken Access Control. Article states the correct fact.

**Gates:** npx tsc --noEmit pass · npm run lint pass (3 pre-existing errors in unrelated untracked dirs .claude/.remember/proksiabel — untouched; my files clean) · npm run build pass (7/7 pages prerendered incl. /guides/ssrf-explained) · built-page check pass: title "SSRF Explained: Attack Examples & Prevention — ProksiAbel OÜ", canonical https://proksiabel.ee/guides/ssrf-explained, TechArticle JSON-LD, full article content verified.

**Not deployed:** dry-run mode — no commit/push/wrangler deploy/cache purge performed.

**2026-08-11 | SHIPPED | /guides/ssrf-explained | SSRF deep-dive with local lab | Strategy 2 | commits 9a6fcb5 + 35dc7ef | live 200, canonical verified, cache purged**

**2026-08-11 | SHIPPED | /guides/idor-explained | IDOR deep-dive with local lab (CWE-639 / BOLA) | Strategy 2 | commit 63a1b3d (push 7857219..63a1b3d) | live 200, canonical https://proksiabel.ee/guides/idor-explained verified, 40 keyword hits, cache purged**

Files: `src/components/IdorGuide.tsx` (article: TechArticle JSON-LD, taxonomy table, First American 2019 + CVE-2025-41096 incidents, docker-compose Flask lab with read/write IDOR + scoped-query fix, Semgrep taint rule template, Python/Node/Go fix patterns, checklist, Estonian summary, sources), `src/App.tsx` (lazy route), `src/components/Footer.tsx` (guide link), `public/sitemap.xml` (monthly/0.8, lastmod 2026-08-11), `public/llms.txt`, `pub/` build artifacts.

Deviations/notes: branch topology — repo's active dev line is `feat/ui-polish-and-seo-content` (pre-existing, previous runs committed there); pushed `HEAD:main` (clean fast-forward, main was an ancestor). Bare route returns 307 → trailing slash (zone redirect rule; identical for existing guides). translations.ts untouched (SSRF precedent: et default language would render non-keyword titles). Strategy 6 checked: CVE-2026-8037 (Progress LoadMaster, KEV 2026-08-07) is active but outranked by Strategy 2 and not a credible solo-consultancy post-mortem.

Gates: `npx tsc -b` pass · `npm run lint` pass (oxlint 0/0, biome 61 files clean) · `npm run build` pass (8/8 pages prerendered) · built-page check pass (title "IDOR Explained: Attack Examples & Prevention — ProksiAbel OÜ", canonical, TechArticle JSON-LD) · live checks pass (route 200 via trailing slash, homepage 200, cache purged via CF API zone 4a3c68c9fe236c83c98628b224f4d94b).

## 2026-09-11 | PR #38 | /guides/xxe-explained | XXE / XML external entity deep-dive with local lab (CWE-611, CWE-776) | Strategy 2 | XXE / XML external entity / XXE attack example / XXE prevention / blind XXE / billion laughs | gates passed, awaiting review

**Files:** `src/components/XxeGuide.tsx` (new — TechArticle JSON-LD, 5 HTML tables, XML 1.0 §4.2.2/§4.4.2–§4.4.5 anatomy, in-band + blind attack classes, CVE-2025-66516 / CVE-2025-68493 / CVE-2017-12629, docker-compose Flask+lxml lab with vulnerable and hardened endpoints, Semgrep + Suricata detection rules, Java/.NET/Python/PHP/Go/Node fix patterns, Estonian summary, sources), `src/App.tsx` (lazy route), `src/components/Footer.tsx` (guide link), `public/sitemap.xml` (monthly/0.8, lastmod 2026-09-11), `public/llms.txt`, `pub/` build artifacts.

**Gates:** `npx tsc -b` pass · `npm run lint` pass (oxlint 0, biome clean on all touched files; 5 pre-existing biome format errors in unrelated untracked `.bmad-loop/**` scratch JSON left untouched) · `npm run build` pass (9/9 pages prerendered incl. /guides/xxe-explained) · built-page check pass (title "XXE Explained: Attack Examples & Prevention — ProksiAbel OÜ", canonical https://proksiabel.ee/guides/xxe-explained, TechArticle JSON-LD, 5 `<table>` elements, content + Estonian summary present, no JSX artifacts).

**Deviations/notes:** Topic pick — the run's ordered preference puts Strategy 2 first and its CWE supply is unbounded, so the largest unclaimed cluster (XXE / CWE-611) was taken; Strategy 1's protocol comparison and Strategies 4/5/7/8 remain uncovered. Branch cut from `origin/main` (0fef498) with `pub/` rebuilt on it, so no race-conditions artifacts leaked in from the still-open PR #37 (that branch's log entry is not on main and is therefore not reproduced here). `git fetch`/push over SSH fails in this environment (passphrase-protected keys, no ssh-agent) — used the `gh` credential helper over HTTPS; no remote config changed. `translations.ts` untouched (shipped-guide precedent: `et` default would render a non-keyword meta title). Strategy 6 (CVE coverage) skipped this run: no active major CVE in the last 7 days suited to a solo post-mortem, and it is outranked by Strategy 2.
