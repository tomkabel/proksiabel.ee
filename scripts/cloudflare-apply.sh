#!/usr/bin/env bash
# cloudflare-apply.sh — proksiabel.ee ideal Cloudflare config (2026-27 standard)
# Per docs/cloudflare-config-plan.md. Static Vite SPA, GH Pages origin, CF proxy.
# Usage:
#   CF_API_TOKEN=<token> ./scripts/cloudflare-apply.sh            # dry run (reads only)
#   CF_API_TOKEN=<token> ./scripts/cloudflare-apply.sh --apply    # apply (idempotent)
# Token fallback: wrangler OAuth session token (works on the REST API; read-only
# zone access — enough for dry-run reads, NOT for --apply).
#   (~/.config/.wrangler/config/default.toml oauth_token).
set -euo pipefail

ZONE="proksiabel.ee"
ACCOUNT_ID="c1cf23b37f7f32828f44df16938a0d2d"
API="https://api.cloudflare.com/client/v4"
REDIRECT_LIST="proksiabel_old_urls"

TOKEN="${CF_API_TOKEN:-${CLOUDFLARE_API_TOKEN:-}}"
if [ -z "$TOKEN" ] && [ -f "$HOME/.config/.wrangler/config/default.toml" ]; then
  TOKEN=$(grep -oP 'oauth_token = "\K[^"]+' "$HOME/.config/.wrangler/config/default.toml" 2>/dev/null | head -1 || true)
fi
[ -z "$TOKEN" ] && { echo "ERROR: no token (set CF_API_TOKEN, or wrangler login first)"; exit 1; }

APPLY=0; [ "${1:-}" = "--apply" ] && APPLY=1
AUTH=(-H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json")

say() { printf '%s\n' "$*"; }
api() { # api METHOD PATH [JSON] -> prints body on stdout; fails loudly
  local m="$1" p="$2" body="${3:-}"
  if [ "$m" != "GET" ] && [ "$APPLY" != 1 ]; then
    echo "  [dry-run] $m $p"; return 0
  fi
  local out
  if [ -n "$body" ]; then
    out=$(curl -s "${AUTH[@]}" -X "$m" "$API$p" -d "$body")
  else
    out=$(curl -s "${AUTH[@]}" -X "$m" "$API$p")
  fi
  if ! echo "$out" | jq -e '.success == true' >/dev/null 2>&1; then
    echo "  FAILED: $m $p"
    echo "$out" | jq -r '.errors[]? | "    api: \(.message)"' 2>/dev/null || echo "    raw: $out"
    return 1
  fi
  echo "$out"
}

echo "== verify token =="
if ! curl -sf "${AUTH[@]}" "$API/user/tokens/verify" | jq -r '"token: \(.result.status) (\(.result.id))"' 2>/dev/null; then
  echo "  (verify endpoint failed; continuing — OAuth tokens 401 here but work on endpoints)"
fi

echo "== resolve zone =="
ZONE_RESP=$(curl -sf "${AUTH[@]}" "$API/zones?name=$ZONE" || { echo "  API error — token may lack Zone:Read"; exit 1; })
ZONE_ID=$(echo "$ZONE_RESP" | jq -r '.result[0].id // empty')
[ -z "$ZONE_ID" ] && { echo "  zone not found: $ZONE"; exit 1; }
echo "zone_id: $ZONE_ID"

echo "== 1. zone settings =="
zone_setting() { # zone_setting <id> <json-value> — reads tolerant (403 = can't read), writes loud
  local id="$1" val="$2" cur
  cur=$(curl -sf "${AUTH[@]}" "$API/zones/$ZONE_ID/settings/$id" | jq -r '.result.value' 2>/dev/null || echo "?")
  if [ "$cur" = "$val" ]; then
    echo "  $id: already $val"
  else
    echo "  $id: ${cur:-unreadable} -> $val"
    api PATCH "/zones/$ZONE_ID/settings/$id" "{\"value\":$val}" | jq -r '  "  ok: \(.result.id)=\(.result.value)"' 2>/dev/null || true
  fi
}
zone_setting ssl '"full"'
zone_setting always_use_https '"on"'
zone_setting automatic_https_rewrites '"on"'
api PATCH "/zones/$ZONE_ID/settings/security_header" '{"value":{"strict_transport_security":{"enabled":true,"max_age":63072000,"include_subdomains":true,"preload":true,"nosniff":false}}}' | jq -r '  "  ok: HSTS \(.result.value.strict_transport_security.enabled)"' 2>/dev/null || true

echo "== 2. CSP hashes from built HTML =="
CSP_HASHES=$(python3 - <<'EOF'
import hashlib, base64, re, glob
h = set()
for f in glob.glob('pub/**/index.html', recursive=True):
    html = open(f, encoding='utf-8').read()
    for m in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
        h.add(base64.b64encode(hashlib.sha256(m.encode()).digest()).decode())
print(' '.join(f"'sha256-{x}'" for x in sorted(h)))
EOF
)
echo "  hashes: $CSP_HASHES"
CSP="default-src 'self'; script-src 'self' $CSP_HASHES; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"

echo "== 3. response headers transform (security headers) =="
HEADERS_JSON=$(jq -n --arg csp "$CSP" '{rules:[{action:"rewrite",expression:"http.host eq \"proksiabel.ee\"",description:"security headers",action_parameters:{headers:{"Content-Security-Policy":{operation:"set",value:$csp},"Strict-Transport-Security":{operation:"set",value:"max-age=63072000; includeSubDomains; preload"},"Referrer-Policy":{operation:"set",value:"strict-origin-when-cross-origin"},"Permissions-Policy":{operation:"set",value:"camera=(), microphone=(), geolocation=()"},"X-Content-Type-Options":{operation:"set",value:"nosniff"}}}}]}')
api PUT "/zones/$ZONE_ID/rulesets/phases/http_response_headers_transform/entrypoint" "$HEADERS_JSON" | jq -r '  "  ok: \(.result.rules | length) rule(s) in \(.result.phase)"' 2>/dev/null || true

echo "== 4. cache rules =="
CACHE_JSON='{"rules":[{"action":"set_cache_settings","expression":"http.host eq \"proksiabel.ee\" and starts_with(http.request.uri.path, \"/assets/\")","description":"assets: immutable 1mo/1yr, ignore qs","action_parameters":{"edge_ttl":{"mode":"override_origin","default":2592000},"browser_ttl":{"mode":"override_origin","default":31536000},"cache_key":{"custom_key":{"query_string":{"exclude":{"all":true}}}}}},{"action":"set_cache_settings","expression":"ends_with(http.request.uri.path, \"/full_exploit_final_v2_release.zip\")","description":"zip: 7d/1d","action_parameters":{"edge_ttl":{"mode":"override_origin","default":604800},"browser_ttl":{"mode":"override_origin","default":86400}}},{"action":"set_cache_settings","expression":"http.host eq \"proksiabel.ee\"","description":"html: 1h edge + SWR, 10min browser","action_parameters":{"edge_ttl":{"mode":"override_origin","default":3600,"status_code_ttl":[{"status_code":200,"value":3600}]},"browser_ttl":{"mode":"override_origin","default":600},"serve_stale":{"disable_stale_while_updating":false}}}]}'
api PUT "/zones/$ZONE_ID/rulesets/phases/http_request_cache_settings/entrypoint" "$CACHE_JSON" | jq -r '  "  ok: \(.result.rules | length) rule(s) in \(.result.phase)"' 2>/dev/null || true

echo "== 5. account bulk redirects =="
REDIRECT_ITEMS=$(jq -n '{items:[["/products","/work-with-us","/approach","/principal","/contact","/index.html"][] as $p | {redirect:{source_url:("proksiabel.ee"+$p),target_url:"https://proksiabel.ee/",status_code:301,preserve_query_string:false,preserve_path_suffix:false,subpath_matching:false,include_subdomains:false}}]}' | jq '.items')
LIST_RESP=$(curl -sf "${AUTH[@]}" "$API/accounts/$ACCOUNT_ID/rules/lists?per_page=50" || echo '{"result":[]}')
LIST_ID=$(echo "$LIST_RESP" | jq -r --arg n "$REDIRECT_LIST" '.result[] | select(.name==$n) | .id // empty' | head -1)
if [ -z "$LIST_ID" ]; then
  if [ "$APPLY" != 1 ]; then
    echo "  [dry-run] would create list $REDIRECT_LIST + items + redirect rule"
  else
    echo "  creating list $REDIRECT_LIST"
    LIST_ID=$(api POST "/accounts/$ACCOUNT_ID/rules/lists" "$(jq -n --arg n "$REDIRECT_LIST" '{name:$n,kind:"redirect",description:"old product-studio URLs -> / (proksiabel.ee)"}')" | jq -r '.result.id')
  fi
else
  echo "  list exists: $LIST_ID"
fi
if [ "$APPLY" = 1 ] && [ -n "$LIST_ID" ]; then
  api POST "/accounts/$ACCOUNT_ID/rules/lists/$LIST_ID/items" "$REDIRECT_ITEMS" | jq -r '  "  ok: async op \(.result.operation_id // "n/a")"' 2>/dev/null || true
else
  [ "$APPLY" = 1 ] && echo "  skipping items (no list id)"
fi
# account redirect phase: read-modify-write, keep any pre-existing rules
REDIRECT_RULE=$(jq -n --arg l "$REDIRECT_LIST" '{ref:"enable_proksiabel_redirects",action:"redirect",action_parameters:{from_list:{name:$l,key:"http.request.full_uri"}},expression:("http.request.full_uri in $"+$l),description:"301 old product-studio paths -> / (proksiabel.ee)"}')
EXISTING=$(curl -sf "${AUTH[@]}" "$API/accounts/$ACCOUNT_ID/rulesets/phases/http_request_redirect/entrypoint" || echo '{"result":null}')
if [ "$(echo "$EXISTING" | jq -r '.result // "null"')" = "null" ]; then
  RULESET_BODY=$(jq -n --argjson r "$REDIRECT_RULE" '{name:"proksiabel bulk redirects",kind:"root",phase:"http_request_redirect",rules:[$r]}')
  api POST "/accounts/$ACCOUNT_ID/rulesets" "$RULESET_BODY" | jq -r '  "  ok: created \(.result.id) (\(.result.rules | length) rule)"' 2>/dev/null || true
else
  HAS=$(echo "$EXISTING" | jq --arg d "$(echo "$REDIRECT_RULE" | jq -r .description)" '[.result.rules[].description] | index($d)')
  if [ "$HAS" = "null" ]; then
    RULESET_BODY=$(echo "$EXISTING" | jq --argjson r "$REDIRECT_RULE" '{rules:(.result.rules + [$r])}')
  else
    echo "  redirect rule already present, keeping existing ruleset"
    RULESET_BODY=$(echo "$EXISTING" | jq '{rules:.result.rules}')
  fi
  api PUT "/accounts/$ACCOUNT_ID/rulesets/phases/http_request_redirect/entrypoint" "$RULESET_BODY" | jq -r '  "  ok: \(.result.rules | length) rule(s) in account redirect phase"' 2>/dev/null || true
fi

echo "== 6. verify =="
echo "-- https root (expect HSTS + CSP + 200):"
curl -sI https://proksiabel.ee/ | grep -iE '^(HTTP|strict-transport|content-security|referrer-policy|permissions-policy|x-content-type|alt-svc)' || true
echo "-- http root (expect 301 -> https):"
curl -sI http://proksiabel.ee/ | grep -iE '^(HTTP|Location)' || true
echo "-- /products (expect 301 -> /):"
curl -sI https://proksiabel.ee/products | grep -iE '^(HTTP|location)' || true
echo "-- asset cache headers:"
ASSET=$(curl -s https://proksiabel.ee/ | tr -d '\0' | grep -oE '/assets/index-[^"]+\.js' | head -1)
[ -n "$ASSET" ] && curl -sI "https://proksiabel.ee$ASSET" | grep -iE '^(HTTP|cache-control|cf-cache-status)' || echo "  (no asset found)"
echo "done."
