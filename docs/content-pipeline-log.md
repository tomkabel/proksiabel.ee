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
