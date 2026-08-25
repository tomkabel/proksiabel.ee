import{l as e,s as t}from"./vendor-BfEjvabK.js";var n=e(),r={"@context":`https://schema.org`,"@type":`TechArticle`,headline:`SSRF Explained: Server-Side Request Forgery Attack Examples and Prevention`,description:`Server-side request forgery (SSRF) explained: attack anatomy, cloud metadata credential theft, deny-list bypasses, detection rules, and allowlist-based fix patterns, with a reproducible docker-compose lab.`,datePublished:`2026-08-11`,dateModified:`2026-08-11`,inLanguage:`en`,mainEntityOfPage:`https://proksiabel.ee/guides/ssrf-explained`,author:{"@type":`Organization`,name:`ProksiAbel OÜ`,url:`https://proksiabel.ee/`},publisher:{"@type":`Organization`,name:`ProksiAbel OÜ`,url:`https://proksiabel.ee/`}};function i(){return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t,{children:(0,n.jsx)(`script`,{type:`application/ld+json`,children:JSON.stringify(r)})}),(0,n.jsx)(`div`,{className:`min-h-screen bg-slate-900 pt-24 pb-12`,children:(0,n.jsxs)(`div`,{className:`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8`,children:[(0,n.jsx)(`p`,{className:`text-sm uppercase tracking-wide text-sky-400 font-semibold mb-4`,children:`Technical Guide`}),(0,n.jsx)(`h1`,{className:`text-3xl md:text-4xl font-bold text-white mb-6`,children:`SSRF Explained: Server-Side Request Forgery Attack Examples and Prevention`}),(0,n.jsx)(`p`,{className:`text-slate-400 text-lg leading-relaxed mb-10`,children:`Server-side request forgery (SSRF) lets an attacker make the application's own server send requests anywhere that server can reach: localhost, internal networks, cloud metadata. It is CWE-918, entered OWASP's Top 10 as A10:2021, and in the 2025 edition was folded into A01 Broken Access Control. This guide covers the mechanics, a reproducible local lab, detection, and fixes.`}),(0,n.jsxs)(`div`,{className:`max-w-none text-slate-300`,children:[(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`What SSRF is and why it keeps mattering`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`SSRF occurs when a web application fetches a remote resource without validating the user-supplied URL. The attacker co-opts the application's own network position, which is trusted by everything behind the firewall, VPN, or network ACL — so SSRF turns a firewall into a non-factor. OWASP introduced it as A10:2021 with 9,503 recorded occurrences and 385 mapped CVEs in that dataset, an average weighted exploit score of 8.28 / 10, and an average weighted impact of 6.72 / 10.`}),(0,n.jsxs)(`p`,{className:`leading-relaxed mb-4`,children:[`The 2025 OWASP Top 10 no longer lists SSRF as a standalone category: the release notes state it was `,(0,n.jsx)(`em`,{children:`rolled into A01:2025 Broken Access Control`}),`. That is a taxonomy change, not a risk change — the underlying weakness, CWE-918 (Server-Side Request Forgery), is the same, and the cloud-metadata angle keeps it at the top of every bug-bounty program's payout table.`]}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`Three real incidents show the range of impact:`}),(0,n.jsx)(`div`,{className:`overflow-x-auto mb-4`,children:(0,n.jsxs)(`table`,{className:`w-full text-sm text-left border-collapse`,children:[(0,n.jsx)(`thead`,{children:(0,n.jsxs)(`tr`,{className:`border-b border-slate-700`,children:[(0,n.jsx)(`th`,{className:`py-3 pr-4 text-slate-100 font-semibold`,children:`Incident`}),(0,n.jsx)(`th`,{className:`py-3 pr-4 text-slate-100 font-semibold`,children:`SSRF role`}),(0,n.jsx)(`th`,{className:`py-3 text-slate-100 font-semibold`,children:`Outcome`})]})}),(0,n.jsxs)(`tbody`,{className:`text-slate-300`,children:[(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Capital One, 2019`}),(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`SSRF through a misconfigured web application firewall reached the EC2 metadata service (169.254.169.254), returned IAM role credentials, which were then used against S3.`}),(0,n.jsx)(`td`,{className:`py-3 align-top`,children:`~100M US and ~6M Canadian credit-application records exposed; a former AWS engineer was charged by the DOJ.`})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`CVE-2021-40438, Apache httpd`}),(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Crafted request URI-path made mod_proxy forward to an origin server chosen by the remote user — SSRF in the reverse proxy itself.`}),(0,n.jsx)(`td`,{className:`py-3 align-top`,children:`Affects 2.4.48 and earlier; fixed in 2.4.49 (2021-09-16). Reverse proxies are a first-class SSRF attack surface.`})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 align-top`,children:`CVE-2026-15409, SonicWall SMA1000`}),(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`SSRF in the appliance.`}),(0,n.jsx)(`td`,{className:`py-3 align-top`,children:`CVSS 10.0; added to the CISA Known Exploited Vulnerabilities catalog on 2026-07-14 with confirmed exploitation linked to ransomware campaigns — evidence SSRF remains an active initial-access vector.`})]})]})]})}),(0,n.jsx)(`p`,{className:`leading-relaxed`,children:`In MITRE ATT&CK terms, SSRF is the mechanism behind T1190 (Exploit Public-Facing Application), and the metadata-credential variant lands squarely in T1552.005 (Unsecured Credentials: Cloud Instance Metadata API).`})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Attack anatomy: three trust relationships`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`SSRF attacks abuse the trust other systems place in the vulnerable application's network position. Concretely:`}),(0,n.jsxs)(`ul`,{className:`list-disc list-inside space-y-2 mb-4`,children:[(0,n.jsxs)(`li`,{children:[(0,n.jsx)(`strong`,{className:`text-sky-400`,children:`Against the server itself`}),` — pointing the fetch at `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`http://127.0.0.1:8080/admin`}),` or another localhost port. Access-control checks that trust loopback traffic (or admin interfaces bound to non-public ports) are bypassed.`]}),(0,n.jsxs)(`li`,{children:[(0,n.jsx)(`strong`,{className:`text-sky-400`,children:`Against back-end systems`}),` — pointing it at RFC 1918 addresses such as`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`http://192.168.0.68/admin`}),`. Internal services are often unauthenticated because the network topology was the only control.`]}),(0,n.jsxs)(`li`,{children:[(0,n.jsx)(`strong`,{className:`text-sky-400`,children:`Against cloud metadata`}),` — pointing it at`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`http://169.254.169.254/latest/meta-data/iam/security-credentials/`}),` `,`to steal temporary IAM credentials, then using them against S3, SSM, or the control plane (the Capital One chain).`]})]}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`The request flow is a simple relay — the attacker never talks to the target directly:`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`Attacker ──crafted URL──▶ Vulnerable App ──HTTP/FTP/gopher...──▶ Target (internal)
                             │                                          │
                             └────────────── response ──────────────────┘
                             │
                             └── response relayed to attacker (full SSRF)
                                or no response relayed (blind SSRF)`}),(0,n.jsx)(`p`,{className:`leading-relaxed`,children:`A typical request pair — the classic "stock API" pattern, where the app fetches a URL the user supplies:`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`POST /product/stock HTTP/1.1
Content-Type: application/x-www-form-urlencoded

stockApi=http://localhost/admin`}),(0,n.jsxs)(`p`,{className:`leading-relaxed`,children:[`The server performs `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`GET /admin`}),` from its own loopback interface and relays the response. The same primitive works with the metadata endpoint substituted for `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`localhost`}),`.`]})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Reproducible local lab`}),(0,n.jsxs)(`p`,{className:`leading-relaxed mb-4`,children:[`Everything below runs against local containers on your machine — no live targets, no weaponized payloads. The lab emulates the AWS metadata endpoint at its real address,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`169.254.169.254`}),`, using a Docker network with a link-local subnet.`]}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-medium mb-3`,children:`docker-compose.yml`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`services:
  app:
    build: .
    ports:
      - "8080:8080"
    networks:
      lab:
        ipv4_address: 169.254.0.10
  metadata:
    image: nginx:alpine
    volumes:
      - ./metadata.conf:/etc/nginx/conf.d/default.conf:ro
    networks:
      lab:
        ipv4_address: 169.254.169.254

networks:
  lab:
    ipam:
      config:
        - subnet: 169.254.0.0/16`}),(0,n.jsxs)(`p`,{className:`leading-relaxed mb-4`,children:[`Docker on a few hosts refuses link-local subnets. If`,(0,n.jsx)(`code`,{className:`text-slate-100`,children:` docker compose up`}),` errors on the subnet, switch the network to `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`172.28.0.0/16`}),`, give the metadata container `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`172.28.0.66`}),`, and use that address in every walkthrough URL below. The behavior is identical — only the IP changes.`]}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-medium mb-3`,children:`Dockerfile`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir flask requests
COPY app.py .
EXPOSE 8080
CMD ["python", "app.py"]`}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-medium mb-3`,children:`app.py — vulnerable fetch endpoint`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`from flask import Flask, Response, request
import requests

app = Flask(__name__)


@app.get("/fetch")
def fetch():
    """Fetch a URL server-side. The url parameter is fully attacker-controlled."""
    url = request.args.get("url", "")
    if not url.startswith(("http://", "https://")):
        return "only http(s) allowed", 400
    resp = requests.get(url, timeout=5)  # follows redirects by default
    return Response(resp.content, content_type=resp.headers.get("Content-Type", "text/plain"))


@app.get("/flag")
def flag():
    """Simulates an internal-only admin endpoint behind the network ACL."""
    return "internal-only: flag{ssrf-locally-verified}"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)`}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-medium mb-3`,children:`metadata.conf — fake cloud metadata service`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`server {
    listen 80;

    location = /latest/meta-data/iam/security-credentials/ {
        add_header Content-Type application/json;
        return 200 '{"Code":"Success","AccessKeyId":"AKIALABEXAMPLE","SecretAccessKey":"lab-secret","Token":"lab-token","Expiration":"2027-01-01T00:00:00Z"}';
    }

    location /latest/meta-data/ {
        return 200 'lab-metadata-ok';
    }
}`}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-medium mb-3`,children:`Run it and exploit it`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`docker compose up --build`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`First, confirm the endpoint works as intended against the public internet:`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`$ curl -s "http://localhost:8080/fetch?url=https://example.com/" | head -1
<!doctype html>`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`Now the metadata credential theft — this is the Capital One chain in miniature. One request, no authentication:`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`$ curl -s "http://localhost:8080/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/"
{"Code":"Success","AccessKeyId":"AKIALABEXAMPLE","SecretAccessKey":"lab-secret","Token":"lab-token","Expiration":"2027-01-01T00:00:00Z"}`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`And the loopback trust bypass — the request reaches the app's own internal endpoint through the same primitive:`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`$ curl -s "http://localhost:8080/fetch?url=http://127.0.0.1:8080/flag"
internal-only: flag{ssrf-locally-verified}`}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-medium mb-3`,children:`What does not work (and why that teaches you more)`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`Failed payloads are as instructive as successful ones:`}),(0,n.jsxs)(`ul`,{className:`list-disc list-inside space-y-2 mb-4`,children:[(0,n.jsxs)(`li`,{children:[(0,n.jsx)(`code`,{className:`text-slate-100`,children:`file:///etc/passwd`}),` — Python's`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`requests`}),` has no adapter for the file scheme, so this raises `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`InvalidSchema`}),`. The same is not true of stacks with richer scheme support (curl, Go's stdlib with custom handlers, some Java HTTP clients) — scheme abuse is stack-dependent, which is why OWASP lists `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`file://`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`gopher://`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`dict://`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`data://`}),` and`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`phar://`}),` as SSRF schemes to block.`]}),(0,n.jsxs)(`li`,{children:[`The app's `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`startswith`}),` scheme check rejects `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`file://`}),` — but accepts every attack that matters. Scheme filtering alone is not a defense.`]}),(0,n.jsxs)(`li`,{children:[`Add a naive deny-list blocking `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`127.0.0.1`}),` `,`and `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`169.254.169.254`}),` to the app — then attack through a redirect you control.`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`requests`}),` follows redirects by default, so a URL like`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`http://attacker.example/r?to=http://127.0.0.1:8080/flag`}),` `,`sails past the filter. On Linux,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`http://0.0.0.0:8080/flag`}),` also works: the kernel routes connections to the unspecified address to loopback.`]})]})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Bypassing common defenses`}),(0,n.jsxs)(`p`,{className:`leading-relaxed mb-4`,children:[`The pattern to internalize: filters that inspect a `,(0,n.jsx)(`em`,{children:`string`}),` lose to parsers that interpret it differently downstream. OWASP's own guidance is blunt — do not mitigate SSRF with a deny-list or regex. The table below is the standard bypass catalog (PortSwigger's Web Security Academy is the canonical reference):`]}),(0,n.jsx)(`div`,{className:`overflow-x-auto mb-4`,children:(0,n.jsxs)(`table`,{className:`w-full text-sm text-left border-collapse`,children:[(0,n.jsx)(`thead`,{children:(0,n.jsxs)(`tr`,{className:`border-b border-slate-700`,children:[(0,n.jsx)(`th`,{className:`py-3 pr-4 text-slate-100 font-semibold`,children:`Defense`}),(0,n.jsx)(`th`,{className:`py-3 pr-4 text-slate-100 font-semibold`,children:`Bypass`}),(0,n.jsx)(`th`,{className:`py-3 text-slate-100 font-semibold`,children:`Example`})]})}),(0,n.jsxs)(`tbody`,{className:`text-slate-300`,children:[(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Deny-list on hostname strings`}),(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Alternative IP encodings (decimal, octal, hex, short forms), DNS rebinding, redirects, 0.0.0.0. Whether a given encoding works depends on the HTTP stack's resolver — test in the lab.`}),(0,n.jsxs)(`td`,{className:`py-3 align-top`,children:[(0,n.jsx)(`code`,{className:`text-slate-100`,children:`2130706433`}),` (decimal 127.0.0.1),`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`127.1`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`0177.0.0.1`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`http://0.0.0.0:8080/flag`})]})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Whitelist prefix check`}),(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`URL-authority tricks that make the parser and the filter disagree: credentials, fragments, DNS hierarchy, encoding.`}),(0,n.jsxs)(`td`,{className:`py-3 align-top`,children:[(0,n.jsx)(`code`,{className:`text-slate-100`,children:`https://trusted.com@evil.example/`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`https://evil.example#trusted.com`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`https://trusted.com.evil.example/`})]})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Scheme allowlist (http/https only)`}),(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Cross-scheme redirects and protocol confusion — the first request is https, the redirect target is gopher, dict, or file.`}),(0,n.jsxs)(`td`,{className:`py-3 align-top`,children:[(0,n.jsx)(`code`,{className:`text-slate-100`,children:`https://attacker.example/redirect`}),` →`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`gopher://redis:6379/_...`})]})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Hostname validation, no re-check on connect`}),(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`DNS rebinding and TOCTOU races: the hostname resolves to a public IP when validated and to an internal IP when connected.`}),(0,n.jsxs)(`td`,{className:`py-3 align-top`,children:[(0,n.jsx)(`code`,{className:`text-slate-100`,children:`attacker.example`}),` alternates`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`8.8.8.8`}),` and`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`127.0.0.1`}),` with a short TTL`]})]})]})]})}),(0,n.jsx)(`p`,{className:`leading-relaxed`,children:`OWASP's A10:2021 guidance calls this out directly: enforce URL scheme, port, and destination with a positive allowlist, disable HTTP redirections, and be aware of URL consistency to avoid DNS-rebinding and TOCTOU races.`})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`How to detect SSRF`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`Detection works at three layers: static analysis in CI, network signatures, and outbound-flow logging.`}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-medium mb-3`,children:`Static analysis (Semgrep)`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`The OWASP cheat sheet points to the public Semgrep registry (q=ssrf) as a starting point. A minimal rule for the pattern above:`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`rules:
  - id: ssrf-unsanitized-url
    languages: [python]
    severity: WARNING
    message: >-
      User-controlled URL reaches a network request without SSRF validation
      (CWE-918). Validate the scheme, every resolved IP (A + AAAA), and
      disable redirects before fetching (OWASP SSRF Prevention Cheat Sheet).
    patterns:
      - pattern-either:
          - pattern: requests.get($URL, ...)
          - pattern: requests.post($URL, ...)
          - pattern: requests.request($METHOD, $URL, ...)`}),(0,n.jsxs)(`p`,{className:`leading-relaxed mb-4`,children:[`Expect noise: once you ship a guard helper like`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`fetch_safe()`}),`, the rule matches your own safe call sites. Add a `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`pattern-not`}),` for the helper or move the rule to review-only severity.`]}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-medium mb-3`,children:`Network signatures (Suricata)`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`Two example signatures (SIDs 1,000,000+ are reserved for local rules — tune before production):`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`alert http any any -> any any (msg:"SSRF: cloud metadata path requested"; \\
  flow:established,to_server; content:"/latest/meta-data/"; http_uri; \\
  classtype:attempted-info-leak; sid:1000001; rev:1;)

alert http any any -> any any (msg:"SSRF: link-local metadata host as destination"; \\
  flow:established,to_server; content:"169.254.169.254"; http_host; \\
  classtype:attempted-info-leak; sid:1000002; rev:1;)`}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-medium mb-3`,children:`Log signals`}),(0,n.jsxs)(`ul`,{className:`list-disc list-inside space-y-2 mb-4`,children:[(0,n.jsxs)(`li`,{children:[`Outbound HTTP from the app tier to`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`169.254.169.254`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`metadata.google.internal`}),`, or any link-local/loopback address — this should never appear in access logs.`]}),(0,n.jsx)(`li`,{children:`App-tier connections to RFC 1918 destinations the application has no business calling (metadata, databases, admin panels).`}),(0,n.jsxs)(`li`,{children:[`Non-HTTP schemes in fetch parameters (`,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`gopher`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`dict`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`file`}),`).`]}),(0,n.jsx)(`li`,{children:`The redirect flavor of the attack leaves a distinctive two-hop trace: an outbound fetch to an external host followed within milliseconds by a loopback or internal request.`})]})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`How to prevent SSRF`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`The OWASP cheat sheet splits prevention into two cases, and the choice of control depends on which one you are in:`}),(0,n.jsx)(`div`,{className:`overflow-x-auto mb-4`,children:(0,n.jsxs)(`table`,{className:`w-full text-sm text-left border-collapse`,children:[(0,n.jsx)(`thead`,{children:(0,n.jsxs)(`tr`,{className:`border-b border-slate-700`,children:[(0,n.jsx)(`th`,{className:`py-3 pr-4 text-slate-100 font-semibold`,children:`Situation`}),(0,n.jsx)(`th`,{className:`py-3 text-slate-100 font-semibold`,children:`Control that actually works`})]})}),(0,n.jsxs)(`tbody`,{className:`text-slate-300`,children:[(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`The app only ever calls identified, trusted applications (internal services, a fixed API)`}),(0,n.jsxs)(`td`,{className:`py-3 align-top`,children:[`Positive allowlist: exact hostname/IP list, scheme and port allowlist, redirects disabled. Validate with parser-safe libraries (e.g. Apache Commons Validator in Java, `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`ip-address`}),` in JS,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`ipaddress`}),` in Python).`]})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`The app must fetch arbitrary external URLs (webhooks, avatar uploads, link previews)`}),(0,n.jsxs)(`td`,{className:`py-3 align-top`,children:[`Deny-list as a last resort — OWASP explicitly warns it is bypass-prone. Minimum: block metadata endpoints, loopback, RFC 1918, link-local, and multicast ranges for `,(0,n.jsx)(`em`,{children:`every`}),` resolved IP (A and AAAA), pin the connection to the validated IP, disable redirects or re-validate each hop, and allow only http/https.`]})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Cloud deployments`}),(0,n.jsx)(`td`,{className:`py-3 align-top`,children:`Enforce IMDSv2 on AWS (PUT-token based; disable IMDSv1), scope IAM roles on the app tier to the minimum, and put the URL-fetching service behind an egress firewall with deny-by-default rules.`})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Any deployment`}),(0,n.jsx)(`td`,{className:`py-3 align-top`,children:`Network segmentation: run URL-fetching functionality in its own segment so a compromise does not reach the whole backend. Never echo raw responses to the client when the Content-Type is non-text.`})]})]})]})}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-medium mb-3`,children:`Python (requests) — resolve, validate, pin, no redirects`}),(0,n.jsxs)(`p`,{className:`leading-relaxed mb-4`,children:[`The core idea: resolve the hostname once, reject the request if `,(0,n.jsx)(`em`,{children:`any`}),` `,`resolved address is non-public, then connect to the validated address — so a DNS rebinding race between validation and connection has nothing to win.`]}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`import ipaddress
import socket
import ssl
import urllib.parse

import requests
from requests.adapters import HTTPAdapter
from urllib3 import HTTPConnectionPool, HTTPSConnectionPool, Retry


def _resolve_all(host: str) -> list[str]:
    """Every A/AAAA address for a host, deduplicated."""
    infos = socket.getaddrinfo(host, None, proto=socket.IPPROTO_TCP)
    return list({info[4][0] for info in infos})


def _is_blocked(ip: str) -> bool:
    addr = ipaddress.ip_address(ip)
    # Normalize IPv4-mapped IPv6 (::ffff:127.0.0.1 -> 127.0.0.1)
    if isinstance(addr, ipaddress.IPv6Address) and addr.ipv4_mapped is not None:
        addr = addr.ipv4_mapped
    return (
        addr.is_private          # RFC 1918 + IPv6 ULA (fc00::/7)
        or addr.is_loopback      # 127.0.0.0/8, ::1
        or addr.is_link_local    # 169.254.0.0/16, fe80::/10 - covers 169.254.169.254
        or addr.is_multicast     # 224.0.0.0/4, ff00::/8
        or addr.is_unspecified   # 0.0.0.0, ::
        or addr.is_reserved      # 240.0.0.0/4 and other special ranges
    )


class SSRFGuardAdapter(HTTPAdapter):
    """Resolve + validate every IP, then pin the connection to a validated IP.

    get_connection_with_tls_context() returns a pool whose host is the
    validated IP, so the socket never re-resolves the hostname (no
    DNS-rebinding window). HTTPS keeps the original hostname as
    server_hostname, so TLS SNI and certificate validation still use the
    real name while the connection goes to the pinned address.
    Requires requests >= 2.32.2 (get_connection_with_tls_context) / urllib3 2.x
    (server_hostname as a documented pool parameter).
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._pools = []  # custom pools bypass the pool manager; track for close()

    def get_connection_with_tls_context(self, request, verify, proxies=None, cert=None):
        parsed = urllib.parse.urlsplit(request.url)
        host = parsed.hostname or ""
        ips = _resolve_all(host)
        if not ips or any(_is_blocked(ip) for ip in ips):
            raise requests.exceptions.InvalidURL(
                f"destination resolves to a blocked address: {host}"
            )
        # Prefer IPv4 when available (both families are validated above).
        ip = next((a for a in ips if ":" not in a), ips[0])
        port = parsed.port or (443 if parsed.scheme == "https" else 80)
        pool_kwargs = dict(
            maxsize=self._pool_maxsize,
            block=self._pool_block,
            retries=Retry(0, read=False),
        )
        if parsed.scheme == "https":
            # Carry the caller's TLS policy into the pool: requests passes
            # verify (bool or CA-bundle path) and cert (path or (cert, key)).
            if verify is False:
                pool_kwargs["cert_reqs"] = ssl.CERT_NONE
            else:
                pool_kwargs["cert_reqs"] = ssl.CERT_REQUIRED
                # requests defaults to the certifi bundle; keep the same anchors.
                pool_kwargs["ca_certs"] = requests.certs.where() if verify is True else verify
            if cert is not None:
                if isinstance(cert, tuple):
                    pool_kwargs["cert_file"], pool_kwargs["key_file"] = cert
                else:
                    pool_kwargs["cert_file"] = cert
            pool = HTTPSConnectionPool(ip, port, server_hostname=host, **pool_kwargs)
            # The socket is pinned to the validated IP, but the HTTP Host
            # header and TLS SNI still come from the original request URL
            # (hostname), so the server sees the real virtual-host name.
        else:
            pool = HTTPConnectionPool(ip, port, **pool_kwargs)
        self._pools.append(pool)  # track so Session.close() closes them too
        return pool

    def close(self):
        super().close()
        for pool in self._pools:
            pool.close()


def fetch_safe(url: str, timeout: int = 5) -> requests.Response:
    with requests.Session() as session:
        session.mount("http://", SSRFGuardAdapter())
        session.mount("https://", SSRFGuardAdapter())
        resp = session.get(url, timeout=timeout, allow_redirects=False)
        if resp.is_redirect:
            raise requests.exceptions.TooManyRedirects("redirects disabled (SSRF guard)")
        return resp`}),(0,n.jsxs)(`p`,{className:`leading-relaxed mb-4`,children:[`Against the lab, `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`fetch_safe()`}),` rejects every payload from the walkthrough: metadata (link-local), loopback, redirects, and`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`file://`}),` all raise before a socket is opened.`]}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-medium mb-3`,children:`Go (net/http) — guarded DialContext`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`Go's transport separates the dial address from the TLS ServerName, so HTTPS keeps working with correct SNI while the connection is pinned to a validated IP:`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`package main

import (
    "context"
    "fmt"
    "net"
    "net/http"
    "time"
)

// blocked reports whether ip is loopback, private, link-local, or otherwise
// non-routable. The metadata endpoint 169.254.169.254 is link-local and is
// covered by IsLinkLocalUnicast.
func blocked(ip net.IP) bool {
    if v4 := ip.To4(); v4 != nil {
        ip = v4 // normalize IPv4-mapped IPv6
    }
    return !ip.IsGlobalUnicast() || ip.IsPrivate() || ip.IsLoopback() ||
        ip.IsLinkLocalUnicast() || ip.IsUnspecified() || ip.IsMulticast()
}

func guardedClient() *http.Client {
    dialer := &net.Dialer{Timeout: 5 * time.Second}
    transport := &http.Transport{
        DialContext: func(ctx context.Context, network, addr string) (net.Conn, error) {
            host, port, err := net.SplitHostPort(addr)
            if err != nil {
                return nil, err
            }
            ips, err := net.DefaultResolver.LookupIPAddr(ctx, host)
            if err != nil {
                return nil, err
            }
            if len(ips) == 0 {
                return nil, fmt.Errorf("no addresses for %q", host)
            }
            for _, ip := range ips {
                if blocked(ip.IP) {
                    return nil, fmt.Errorf("blocked non-public address %s", ip.IP)
                }
            }
            // Pin the connection to a validated address (no re-resolution).
            return dialer.DialContext(ctx, network, net.JoinHostPort(ips[0].IP.String(), port))
        },
    }
    return &http.Client{
        Transport: transport,
        CheckRedirect: func(req *http.Request, via []*http.Request) error {
            return fmt.Errorf("redirects disabled (SSRF guard)")
        },
        Timeout: 10 * time.Second,
    }
}`}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-medium mb-3`,children:`Node.js (http/https) — pinned lookup, SNI preserved, manual redirects`}),(0,n.jsxs)(`p`,{className:`leading-relaxed mb-4`,children:[`The example below resolves and validates every address at connect time —`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`ipaddr.js`}),` (the OWASP cheat sheet's recommended approach) classifies IPv4 and IPv6 in one call — pins the socket to a validated address, and keeps the original hostname for TLS SNI and certificate validation:`]}),(0,n.jsx)(`pre`,{className:`bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4`,children:`import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { lookup } from 'node:dns/promises';
import ipaddr from 'ipaddr.js'; // npm i ipaddr.js — complete IPv4/IPv6 classification

// Reject everything that is not a globally routable unicast address:
// private (RFC 1918), loopback, link-local (incl. 169.254.169.254),
// multicast, unspecified, ULA (fc00::/7), IPv4-mapped, and reserved ranges.
function assertPublic(address) {
  const addr = ipaddr.parse(address);
  const ip = addr.kind() === 'ipv6' && addr.isIPv4MappedAddress() ? addr.toIPv4Address() : addr;
  if (ip.range() !== 'unicast') throw new Error('blocked non-public address ' + address);
}

export function fetchSafe(urlString, { timeout = 5000 } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      reject(new Error('scheme not allowed'));
      return;
    }
    const host = url.hostname.replace(/^\\[|\\]$/g, '');
    // IP-literal target: Node skips the lookup override for IPs, so the
    // pinned callback never runs — reject before any connection.
    if (ipaddr.isValid(host)) assertPublic(host);
    // Resolve and validate at connect time, then pin the socket to the
    // validated address — no window for DNS rebinding between check and use.
    const pinned = (hostname, options, cb) => {
      lookup(hostname, { all: true })
        .then((records) => {
          if (records.length === 0) throw new Error('no addresses for ' + hostname);
          for (const { address } of records) assertPublic(address);
          // Prefer IPv4 when available (both families are validated above).
          const sorted = [...records].sort((a, b) => a.family - b.family);
          // Node's lookup contract: options.all -> cb(err, addresses[]),
          // otherwise cb(err, address, family).
          if (options.all) cb(null, sorted);
          else cb(null, sorted[0].address, sorted[0].family);
        })
        .catch((err) => cb(err));
    };
    const mod = url.protocol === 'https:' ? httpsRequest : httpRequest;
    const req = mod(
      url,
      {
        lookup: pinned,           // socket connects to the validated IP
        servername: url.hostname, // HTTPS SNI + cert validation keep the hostname
        headers: { Host: url.host },
        timeout,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400) {
          res.resume();
          reject(new Error('redirects disabled (SSRF guard)'));
          return;
        }
        resolve(res);
      },
    );
    req.on('timeout', () => req.destroy(new Error('request timed out')));
    req.on('error', reject);
    req.end();
  });
}`}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-medium mb-3`,children:`Network layer and cloud metadata`}),(0,n.jsxs)(`ul`,{className:`list-disc list-inside space-y-2 mb-4`,children:[(0,n.jsx)(`li`,{children:`Segment remote-resource-fetching functionality into its own network; enforce deny-by-default egress firewall rules so the app tier can only reach what it must (OWASP A10:2021 network-layer guidance).`}),(0,n.jsxs)(`li`,{children:[`AWS: enable IMDSv2 and disable IMDSv1. IMDSv2 requires a PUT-obtained session token plus the `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`X-aws-ec2-metadata-token`}),` `,`header, so a plain GET-based SSRF can no longer read credentials directly. This is a defense-in-depth layer, not a replacement for input validation — an SSRF with full request control can still obtain the token.`]}),(0,n.jsxs)(`li`,{children:[`GCP and Azure metadata services are reachable at the same link-local address`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`169.254.169.254`}),` (GCP also via`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`metadata.google.internal`}),`); the OWASP deny-list table blocks all of them plus RFC 1918, loopback, and multicast ranges as a minimum.`]})]})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Prevention checklist`}),(0,n.jsx)(`div`,{className:`overflow-x-auto mb-4`,children:(0,n.jsxs)(`table`,{className:`w-full text-sm text-left border-collapse`,children:[(0,n.jsx)(`thead`,{children:(0,n.jsxs)(`tr`,{className:`border-b border-slate-700`,children:[(0,n.jsx)(`th`,{className:`py-3 pr-4 text-slate-100 font-semibold`,children:`Check`}),(0,n.jsx)(`th`,{className:`py-3 text-slate-100 font-semibold`,children:`How to verify`})]})}),(0,n.jsxs)(`tbody`,{className:`text-slate-300`,children:[(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Every server-side fetch is inventoried (requests, urllib, http, fetch, curl, proxy rules)`}),(0,n.jsx)(`td`,{className:`py-3 align-top`,children:`grep the codebase + configs; SAST rule in CI flags new call sites`})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Scheme allowlist enforced (http/https)`}),(0,n.jsxs)(`td`,{className:`py-3 align-top`,children:[`Send `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`file://`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`gopher://`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`dict://`}),` — expect rejection`]})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`All resolved IPs validated (A + AAAA), connection pinned`}),(0,n.jsx)(`td`,{className:`py-3 align-top`,children:`Point the app at a domain alternating public/private answers with a short TTL (DNS rebinding) — connection must still be blocked`})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Redirects disabled or re-validated per hop`}),(0,n.jsxs)(`td`,{className:`py-3 align-top`,children:[`Serve a 302 from a host you control to`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`http://169.254.169.254/`}),` — expect rejection`]})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Metadata endpoints blocked (AWS/GCP/Azure, 169.254.169.254)`}),(0,n.jsx)(`td`,{className:`py-3 align-top`,children:`Lab walkthrough request — expect block; network signature fires on metadata path`})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`Egress firewall deny-by-default from app tier`}),(0,n.jsx)(`td`,{className:`py-3 align-top`,children:`Attempt app → internal admin port from the app host; observe deny logs`})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 pr-4 align-top`,children:`IMDSv2 enforced, IMDSv1 disabled (AWS)`}),(0,n.jsxs)(`td`,{className:`py-3 align-top`,children:[(0,n.jsx)(`code`,{className:`text-slate-100`,children:`aws ec2 describe-instances`}),` —`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`HttpTokens: required`}),` on every instance`]})]}),(0,n.jsxs)(`tr`,{className:`border-b border-slate-800`,children:[(0,n.jsx)(`td`,{className:`py-3 align-top`,children:`Outbound-to-metadata alerts configured`}),(0,n.jsx)(`td`,{className:`py-3 align-top`,children:`Trigger the Suricata rule or log query in staging; confirm the alert fires`})]})]})]})})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Key takeaways`}),(0,n.jsxs)(`ul`,{className:`list-disc list-inside space-y-2 mb-4`,children:[(0,n.jsx)(`li`,{children:`SSRF converts the application's trusted network position into a proxy for the attacker — firewalls and ACLs are irrelevant once the fetch is attacker-controlled.`}),(0,n.jsx)(`li`,{children:`The metadata chain (169.254.169.254 → IAM credentials → S3/control plane) is the highest-impact variant; it drove the Capital One breach and remains a current initial-access vector (CVE-2026-15409, KEV July 2026).`}),(0,n.jsx)(`li`,{children:`Allowlists beat deny-lists; deny-lists are a documented last resort. Whatever you use, validate every resolved IP, pin the connection, and disable redirects.`}),(0,n.jsx)(`li`,{children:`Detection is cheap relative to the blast radius: SAST in CI, two Suricata signatures, and outbound-flow logs catch the common variants.`})]})]}),(0,n.jsxs)(`section`,{className:`mb-10 border-t border-slate-800 pt-8`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Kokkuvõte eesti keeles`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`Server-Side Request Forgery (SSRF) on rünnak, kus ründaja sunnib rakendust tegema päringuid serveri enda nimel — näiteks localhosti, sisemiste teenuste või pilve metaandmete lõpp-punkti (169.254.169.254) poole. Nii saab varastada IAM-mandaate ja pääseda ligi sisemistele süsteemidele, mida tulemüür kaitseb. Peamised kaitsed: positiivne lubatud-URL-ide nimekiri (allowlist), kõigi DNS-ist lahendatud IP-aadresside kontroll, ümbersuunamiste keelamine ning võrgu tasandil deny-by-default egress-tulemüür. AWS-is lülitage sisse IMDSv2 ja keelake IMDSv1. Täielik laborikäik ja koodinäited on ülal inglise keeles.`})]}),(0,n.jsxs)(`section`,{className:`mb-10 border-t border-slate-800 pt-8`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Sources`}),(0,n.jsxs)(`ul`,{className:`list-disc list-inside space-y-1 text-sm`,children:[(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://owasp.org/Top10/2021/A10_2021-Server-Side_Request_Forgery_(SSRF)/`,children:`OWASP Top 10:2021 — A10 Server-Side Request Forgery`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html`,children:`OWASP Server-Side Request Forgery Prevention Cheat Sheet`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://owasp.org/Top10/2025/0x00_2025-Introduction/`,children:`OWASP Top 10:2025 — Introduction (SSRF rolled into A01)`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://cwe.mitre.org/data/definitions/918.html`,children:`CWE-918 — Server-Side Request Forgery`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://portswigger.net/web-security/ssrf`,children:`PortSwigger Web Security Academy — SSRF`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://portswigger.net/web-security/ssrf/url-validation-bypass-cheat-sheet`,children:`PortSwigger — URL validation bypass cheat sheet`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/`,children:`AWS Security Blog — IMDSv2 defense in depth`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://httpd.apache.org/security/vulnerabilities_24.html`,children:`Apache HTTP Server vulnerabilities — CVE-2021-40438`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://www.cisa.gov/known-exploited-vulnerabilities-catalog`,children:`CISA Known Exploited Vulnerabilities Catalog (CVE-2026-15409)`})}),(0,n.jsx)(`li`,{children:(0,n.jsxs)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://attack.mitre.org/techniques/T1190/`,children:[`MITRE ATT&CK T1190 / `,(0,n.jsx)(`span`,{className:`text-slate-300`,children:`T1552.005`}),` `,`(Cloud Instance Metadata API)`]})}),(0,n.jsxs)(`li`,{children:[(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://www.capitalone.com/facts2019/`,children:`Capital One — 2019 incident facts`}),`;`,` `,(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://dl.acm.org/doi/10.1145/3546068`,children:`systematic analysis (ACM)`})]}),(0,n.jsxs)(`li`,{children:[(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://www.rfc-editor.org/rfc/rfc1918`,children:`RFC 1918`}),`,`,` `,(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://www.rfc-editor.org/rfc/rfc3927`,children:`RFC 3927`}),` `,`(link-local),`,` `,(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://www.rfc-editor.org/rfc/rfc4193`,children:`RFC 4193`}),` `,`(ULA),`,` `,(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://www.rfc-editor.org/rfc/rfc5737`,children:`RFC 5737`}),` `,`(documentation ranges)`]})]})]})]})]})})]})}export{i as default};