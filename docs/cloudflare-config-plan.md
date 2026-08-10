# Cloudflare Configuration Plan — proksiabel.ee (2026/27 standard)

Architecture: static Vite SPA, prerendered HTML (`pub/`), hashed `/assets/*`,
zero server-side endpoints (contact = mailto), origin GitHub Pages (CNAME),
zone proxied through Cloudflare. Free plan unless noted.

## Verified current state (2026-08-10 probes)

| Check | Result | Verdict |
|---|---|---|
| `http://proksiabel.ee/` | 200, no redirect | **Always Use HTTPS is OFF — fix** |
| HSTS header | absent | **add** |
| CSP header | absent | **add** |
| HTTP/3 | working | OK |
| Managed robots.txt (AI-bot blocking) | active | keep |

## 1. SSL/TLS (zone settings)

- `ssl` → **full** (origin GH Pages has valid cert; never Flexible behind an
  https origin — redirect loop). Full (Strict) also fine.
- `always_use_https` → **on** (currently off — http 200 confirmed).
- `automatic_https_rewrites` → **on**.
- `min_tls_version` → 1.2 (default). TLS 1.3-only gains nothing for a
  marketing site; keep compatibility.
- `security_header` (HSTS) → `max-age=63072000; includeSubDomains; preload`.
- 0-RTT: on (default).

## 2. Cache Rules (zone rulesets, phase `http_request_cache_settings`)

Free plan: 10 rules max. Use 3.

| # | Expression | Action |
|---|---|---|
| 1 | `http.host eq "proksiabel.ee" and starts_with(http.request.uri.path, "/assets/")` | Edge TTL 1 month, Browser TTL 1 year, Cache Key: ignore query string (hashed filenames are immutable) |
| 2 | everything else (HTML: `/`, `/privacy`, `/terms`, `/cookies`, `/disclosure` + sitemap.xml, robots.txt, llms.txt, security.txt, og-image, favicon, expert.webp, public-key.asc) | Edge TTL 1 hour + **Stale While Revalidate** (serve stale on origin failure), Browser TTL 10 min |
| 3 | `ends_with(http.request.uri.path, "/full_exploit_final_v2_release.zip")` | Edge TTL 7 days, Browser TTL 1 day (34 MB, effectively immutable) |

Tiered Cache: on (default). Early Hints: on.

## 3. Bulk Redirects (account-level, phase `http_request_redirect`)

301 permanent, old product-studio URLs → new site home (new site has no
equivalents; fragments like `/#services` are not indexable targets):

```
/products      → https://proksiabel.ee/
/work-with-us  → https://proksiabel.ee/
/approach      → https://proksiabel.ee/
/principal     → https://proksiabel.ee/
/contact       → https://proksiabel.ee/
/index.html    → https://proksiabel.ee/
```

Mechanics: account Bulk Redirect List (`kind: redirect`) + items (async bulk
op) + account ruleset rule `action: redirect` with `action_parameters.from_list`.

## 4. Security headers (Response Header Rule, phase `http_response_headers_transform`)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' <sha256 hashes of inline JSON-LD blocks from built HTML>;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' data: https://fonts.gstatic.com;
  img-src 'self' data:;
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-Content-Type-Options: nosniff
```

Notes:
- Inline JSON-LD is static per page (prerendered) → hash it, no
  `unsafe-inline` in script-src. Compute hashes from `pub/*/index.html` at
  apply time.
- `style-src 'unsafe-inline'` covers inline `style={{animationDelay}}` attrs;
  Google Fonts CDN allowed (index.html loads it). If fonts move to Fontsource
  (self-hosted), drop the two font origins.
- If Cloudflare Web Analytics is enabled later, add
  `https://static.cloudflareinsights.com` to script-src + connect-src.

## 5. WAF / security posture

- Cloudflare Managed Ruleset: keep default ON (free essential set).
- Bot Fight Mode: **ON (dashboard-only toggle — cannot be changed via API;
  `PATCH /zones/{id}/bot_management` → 10405 for both API tokens and OAuth)**.
  Plan target is OFF (managed robots.txt already blocks AI bots; BFM on Free
  can occasionally challenge legitimate crawlers). Flip manually:
  dash.cloudflare.com → zone → Security → Settings → filter "Bot traffic" →
  Bot fight mode → off. No endpoints → no rate limiting needed.

## 6. Post-apply verification

```bash
curl -sI https://proksiabel.ee/                     # HSTS + CSP + http2/3
curl -sI http://proksiabel.ee/                      # 301 → https
curl -sI https://proksiabel.ee/products             # 301 → /
curl -sI https://proksiabel.ee/assets/index-*.js    # cache-control: max-age=…, cf-cache-status: HIT
```

## 7. Apply (one-shot, scripted) — NO API token needed

The `cloudflare` MCP server is a **remote OAuth MCP**
(`https://mcp.cloudflare.com/mcp`, `auth: oauth` in `~/.hermes/config.yaml`).
Auth is OAuth tokens cached in `~/.hermes/mcp-tokens/cloudflare.json`
(client registration in `cloudflare.client.json`, endpoints in
`cloudflare.meta.json`), auto-refreshed via `refresh_token`. Verified
2026-08-10: tools `mcp__cloudflare__execute`/`docs`/`search` live in-session,
account `The M3nt0r` (c1cf23b37f7f32828f44df16938a0d2d), zone proksiabel.ee
(4a3c68c9fe236c83c98628b224f4d94b) readable, token zone permissions include
`#zone_settings:edit`, `#zone:edit`, `#waf:edit`, `#cache_purge:edit`.

Apply the config with the server's `execute` tool (or curl the REST API with
the OAuth access token; bulk redirects are account-level, account id above).
Zone-level phase `http_request_redirect` is NOT allowed — bulk redirects go
through account rulesets / Bulk Redirect Lists.

⚠️ `MCP_CLOUDFLARE_API_KEY` was a placeholder that is referenced nowhere and
was deleted from `~/.hermes/.env` and `~/.zsh_secrets` — do not re-add it.
If OAuth ever needs re-auth: `hermes mcp login cloudflare` (device-code flow,
dash.cloudflare.com). For a curl-based path without OAuth, create a zone-scoped
API token at dash.cloudflare.com/profile/api-tokens →
Zone (proksiabel.ee): Zone Settings Edit, Cache Rules Edit,
Transform Rules Edit, Zone Read; Account: Bulk URL Redirects Edit,
Account Filter Lists Edit, Account Resources Read.

## Token permissions required (dash.cloudflare.com/profile/api-tokens)

Zone: proksiabel.ee (+ Read on all zones optional)
- Zone Settings: Edit        (SSL, always_use_https, HSTS)
- Cache Rules: Edit          (cache rulesets)
- Transform Rules: Edit      (response header rule)
- Bulk URL Redirects: Edit   (account-level redirects; + Account Filter Lists Edit)
- Zone: Read, Account Resources: Read (account/zone discovery)
