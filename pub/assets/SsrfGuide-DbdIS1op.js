import{j as e,H as t}from"./index-A11p-v3p.js";import"./vendor-DPAYP6p4.js";import"./ui-1_Bp8Q4C.js";const s="https://proksiabel.ee/guides/ssrf-explained",a={"@context":"https://schema.org","@type":"TechArticle",headline:"SSRF Explained: Server-Side Request Forgery Attack Examples and Prevention",description:"Server-side request forgery (SSRF) explained: attack anatomy, cloud metadata credential theft, deny-list bypasses, detection rules, and allowlist-based fix patterns, with a reproducible docker-compose lab.",datePublished:"2026-08-11",dateModified:"2026-08-11",inLanguage:"en",mainEntityOfPage:s,author:{"@type":"Organization",name:"ProksiAbel OÜ",url:"https://proksiabel.ee/"},publisher:{"@type":"Organization",name:"ProksiAbel OÜ",url:"https://proksiabel.ee/"}};function n(){return e.jsxs(e.Fragment,{children:[e.jsx(t,{children:e.jsx("script",{type:"application/ld+json",children:JSON.stringify(a)})}),e.jsx("div",{className:"min-h-screen bg-slate-900 pt-24 pb-12",children:e.jsxs("div",{className:"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",children:[e.jsx("p",{className:"text-sm uppercase tracking-wide text-sky-400 font-semibold mb-4",children:"Technical Guide"}),e.jsx("h1",{className:"text-3xl md:text-4xl font-bold text-white mb-6",children:"SSRF Explained: Server-Side Request Forgery Attack Examples and Prevention"}),e.jsx("p",{className:"text-slate-400 text-lg leading-relaxed mb-10",children:"Server-side request forgery (SSRF) lets an attacker make the application's own server send requests anywhere that server can reach: localhost, internal networks, cloud metadata. It is CWE-918, entered OWASP's Top 10 as A10:2021, and in the 2025 edition was folded into A01 Broken Access Control. This guide covers the mechanics, a reproducible local lab, detection, and fixes."}),e.jsxs("div",{className:"max-w-none text-slate-300",children:[e.jsxs("section",{className:"mb-10",children:[e.jsx("h2",{className:"text-xl text-sky-500 font-semibold mb-4",children:"What SSRF is and why it keeps mattering"}),e.jsx("p",{className:"leading-relaxed mb-4",children:"SSRF occurs when a web application fetches a remote resource without validating the user-supplied URL. The attacker co-opts the application's own network position, which is trusted by everything behind the firewall, VPN, or network ACL — so SSRF turns a firewall into a non-factor. OWASP introduced it as A10:2021 with 9,503 recorded occurrences and 385 mapped CVEs in that dataset, an average weighted exploit score of 8.28 / 10, and an average weighted impact of 6.72 / 10."}),e.jsxs("p",{className:"leading-relaxed mb-4",children:["The 2025 OWASP Top 10 no longer lists SSRF as a standalone category: the release notes state it was ",e.jsx("em",{children:"rolled into A01:2025 Broken Access Control"}),". That is a taxonomy change, not a risk change — the underlying weakness, CWE-918 (Server-Side Request Forgery), is the same, and the cloud-metadata angle keeps it at the top of every bug-bounty program's payout table."]}),e.jsx("p",{className:"leading-relaxed mb-4",children:"Three real incidents show the range of impact:"}),e.jsx("div",{className:"overflow-x-auto mb-4",children:e.jsxs("table",{className:"w-full text-sm text-left border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-slate-700",children:[e.jsx("th",{className:"py-3 pr-4 text-slate-100 font-semibold",children:"Incident"}),e.jsx("th",{className:"py-3 pr-4 text-slate-100 font-semibold",children:"SSRF role"}),e.jsx("th",{className:"py-3 text-slate-100 font-semibold",children:"Outcome"})]})}),e.jsxs("tbody",{className:"text-slate-300",children:[e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"Capital One, 2019"}),e.jsx("td",{className:"py-3 pr-4 align-top",children:"SSRF through a misconfigured web application firewall reached the EC2 metadata service (169.254.169.254), returned IAM role credentials, which were then used against S3."}),e.jsx("td",{className:"py-3 align-top",children:"~100M US and ~6M Canadian credit-application records exposed; a former AWS engineer was charged by the DOJ."})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"CVE-2021-40438, Apache httpd"}),e.jsx("td",{className:"py-3 pr-4 align-top",children:"Crafted request URI-path made mod_proxy forward to an origin server chosen by the remote user — SSRF in the reverse proxy itself."}),e.jsx("td",{className:"py-3 align-top",children:"Affects 2.4.48 and earlier; fixed in 2.4.49 (2021-09-16). Reverse proxies are a first-class SSRF attack surface."})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 align-top",children:"CVE-2026-15409, SonicWall SMA1000"}),e.jsx("td",{className:"py-3 pr-4 align-top",children:"SSRF in the appliance."}),e.jsx("td",{className:"py-3 align-top",children:"CVSS 10.0; added to the CISA Known Exploited Vulnerabilities catalog on 2026-07-14 with confirmed exploitation linked to ransomware campaigns — evidence SSRF remains an active initial-access vector."})]})]})]})}),e.jsx("p",{className:"leading-relaxed",children:"In MITRE ATT&CK terms, SSRF is the mechanism behind T1190 (Exploit Public-Facing Application), and the metadata-credential variant lands squarely in T1552.005 (Unsecured Credentials: Cloud Instance Metadata API)."})]}),e.jsxs("section",{className:"mb-10",children:[e.jsx("h2",{className:"text-xl text-sky-500 font-semibold mb-4",children:"Attack anatomy: three trust relationships"}),e.jsx("p",{className:"leading-relaxed mb-4",children:"SSRF attacks abuse the trust other systems place in the vulnerable application's network position. Concretely:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 mb-4",children:[e.jsxs("li",{children:[e.jsx("strong",{className:"text-sky-400",children:"Against the server itself"})," — pointing the fetch at ",e.jsx("code",{className:"text-slate-100",children:"http://127.0.0.1:8080/admin"})," or another localhost port. Access-control checks that trust loopback traffic (or admin interfaces bound to non-public ports) are bypassed."]}),e.jsxs("li",{children:[e.jsx("strong",{className:"text-sky-400",children:"Against back-end systems"})," — pointing it at RFC 1918 addresses such as ",e.jsx("code",{className:"text-slate-100",children:"http://192.168.0.68/admin"}),". Internal services are often unauthenticated because the network topology was the only control."]}),e.jsxs("li",{children:[e.jsx("strong",{className:"text-sky-400",children:"Against cloud metadata"})," — pointing it at"," ",e.jsx("code",{className:"text-slate-100",children:"http://169.254.169.254/latest/meta-data/iam/security-credentials/"})," ","to steal temporary IAM credentials, then using them against S3, SSM, or the control plane (the Capital One chain)."]})]}),e.jsx("p",{className:"leading-relaxed mb-4",children:"The request flow is a simple relay — the attacker never talks to the target directly:"}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:`Attacker ──crafted URL──▶ Vulnerable App ──HTTP/FTP/gopher...──▶ Target (internal)
                             │                                          │
                             └────────────── response ──────────────────┘
                             │
                             └── response relayed to attacker (full SSRF)
                                or no response relayed (blind SSRF)`}),e.jsx("p",{className:"leading-relaxed",children:'A typical request pair — the classic "stock API" pattern, where the app fetches a URL the user supplies:'}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:`POST /product/stock HTTP/1.1
Content-Type: application/x-www-form-urlencoded

stockApi=http://localhost/admin`}),e.jsxs("p",{className:"leading-relaxed",children:["The server performs ",e.jsx("code",{className:"text-slate-100",children:"GET /admin"})," from its own loopback interface and relays the response. The same primitive works with the metadata endpoint substituted for ",e.jsx("code",{className:"text-slate-100",children:"localhost"}),"."]})]}),e.jsxs("section",{className:"mb-10",children:[e.jsx("h2",{className:"text-xl text-sky-500 font-semibold mb-4",children:"Reproducible local lab"}),e.jsxs("p",{className:"leading-relaxed mb-4",children:["Everything below runs against local containers on your machine — no live targets, no weaponized payloads. The lab emulates the AWS metadata endpoint at its real address,"," ",e.jsx("code",{className:"text-slate-100",children:"169.254.169.254"}),", using a Docker network with a link-local subnet."]}),e.jsx("h3",{className:"text-lg text-sky-400 font-medium mb-3",children:"docker-compose.yml"}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:`services:
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
        - subnet: 169.254.0.0/16`}),e.jsxs("p",{className:"leading-relaxed mb-4",children:["Docker on a few hosts refuses link-local subnets. If",e.jsx("code",{className:"text-slate-100",children:" docker compose up"})," errors on the subnet, switch the network to ",e.jsx("code",{className:"text-slate-100",children:"172.28.0.0/16"}),", give the metadata container ",e.jsx("code",{className:"text-slate-100",children:"172.28.0.66"}),", and use that address in every walkthrough URL below. The behavior is identical — only the IP changes."]}),e.jsx("h3",{className:"text-lg text-sky-400 font-medium mb-3",children:"Dockerfile"}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:`FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir flask requests
COPY app.py .
EXPOSE 8080
CMD ["python", "app.py"]`}),e.jsx("h3",{className:"text-lg text-sky-400 font-medium mb-3",children:"app.py — vulnerable fetch endpoint"}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:`from flask import Flask, Response, request
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
    app.run(host="0.0.0.0", port=8080)`}),e.jsx("h3",{className:"text-lg text-sky-400 font-medium mb-3",children:"metadata.conf — fake cloud metadata service"}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:`server {
    listen 80;

    location = /latest/meta-data/iam/security-credentials/ {
        add_header Content-Type application/json;
        return 200 '{"Code":"Success","AccessKeyId":"AKIALABEXAMPLE","SecretAccessKey":"lab-secret","Token":"lab-token","Expiration":"2027-01-01T00:00:00Z"}';
    }

    location /latest/meta-data/ {
        return 200 'lab-metadata-ok';
    }
}`}),e.jsx("h3",{className:"text-lg text-sky-400 font-medium mb-3",children:"Run it and exploit it"}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:"docker compose up --build"}),e.jsx("p",{className:"leading-relaxed mb-4",children:"First, confirm the endpoint works as intended against the public internet:"}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:`$ curl -s "http://localhost:8080/fetch?url=https://example.com/" | head -1
<!doctype html>`}),e.jsx("p",{className:"leading-relaxed mb-4",children:"Now the metadata credential theft — this is the Capital One chain in miniature. One request, no authentication:"}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:`$ curl -s "http://localhost:8080/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/"
{"Code":"Success","AccessKeyId":"AKIALABEXAMPLE","SecretAccessKey":"lab-secret","Token":"lab-token","Expiration":"2027-01-01T00:00:00Z"}`}),e.jsx("p",{className:"leading-relaxed mb-4",children:"And the loopback trust bypass — the request reaches the app's own internal endpoint through the same primitive:"}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:`$ curl -s "http://localhost:8080/fetch?url=http://127.0.0.1:8080/flag"
internal-only: flag{ssrf-locally-verified}`}),e.jsx("h3",{className:"text-lg text-sky-400 font-medium mb-3",children:"What does not work (and why that teaches you more)"}),e.jsx("p",{className:"leading-relaxed mb-4",children:"Failed payloads are as instructive as successful ones:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 mb-4",children:[e.jsxs("li",{children:[e.jsx("code",{className:"text-slate-100",children:"file:///etc/passwd"})," — Python's"," ",e.jsx("code",{className:"text-slate-100",children:"requests"})," has no adapter for the file scheme, so this raises"," ",e.jsx("code",{className:"text-slate-100",children:"InvalidSchema"}),". The same is not true of stacks with richer scheme support (curl, Go's stdlib with custom handlers, some Java HTTP clients) — scheme abuse is stack-dependent, which is why OWASP lists ",e.jsx("code",{className:"text-slate-100",children:"file://"}),","," ",e.jsx("code",{className:"text-slate-100",children:"gopher://"}),","," ",e.jsx("code",{className:"text-slate-100",children:"dict://"}),","," ",e.jsx("code",{className:"text-slate-100",children:"data://"})," and"," ",e.jsx("code",{className:"text-slate-100",children:"phar://"})," as SSRF schemes to block."]}),e.jsxs("li",{children:["The app's ",e.jsx("code",{className:"text-slate-100",children:"startswith"})," scheme check rejects ",e.jsx("code",{className:"text-slate-100",children:"file://"})," — but accepts every attack that matters. Scheme filtering alone is not a defense."]}),e.jsxs("li",{children:["Add a naive deny-list blocking ",e.jsx("code",{className:"text-slate-100",children:"127.0.0.1"})," ","and ",e.jsx("code",{className:"text-slate-100",children:"169.254.169.254"})," to the app — then attack through a redirect you control. ",e.jsx("code",{className:"text-slate-100",children:"requests"})," ","follows redirects by default, so a URL like"," ",e.jsx("code",{className:"text-slate-100",children:"http://attacker.example/r?to=http://127.0.0.1:8080/flag"})," ","sails past the filter. On Linux, ",e.jsx("code",{className:"text-slate-100",children:"http://0.0.0.0:8080/flag"})," ","also works: the kernel routes connections to the unspecified address to loopback."]})]})]}),e.jsxs("section",{className:"mb-10",children:[e.jsx("h2",{className:"text-xl text-sky-500 font-semibold mb-4",children:"Bypassing common defenses"}),e.jsxs("p",{className:"leading-relaxed mb-4",children:["The pattern to internalize: filters that inspect a ",e.jsx("em",{children:"string"})," lose to parsers that interpret it differently downstream. OWASP's own guidance is blunt — do not mitigate SSRF with a deny-list or regex. The table below is the standard bypass catalog (PortSwigger's Web Security Academy is the canonical reference):"]}),e.jsx("div",{className:"overflow-x-auto mb-4",children:e.jsxs("table",{className:"w-full text-sm text-left border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-slate-700",children:[e.jsx("th",{className:"py-3 pr-4 text-slate-100 font-semibold",children:"Defense"}),e.jsx("th",{className:"py-3 pr-4 text-slate-100 font-semibold",children:"Bypass"}),e.jsx("th",{className:"py-3 text-slate-100 font-semibold",children:"Example"})]})}),e.jsxs("tbody",{className:"text-slate-300",children:[e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"Deny-list on hostname strings"}),e.jsx("td",{className:"py-3 pr-4 align-top",children:"Alternative IP encodings (decimal, octal, hex, short forms), DNS rebinding, redirects, 0.0.0.0. Whether a given encoding works depends on the HTTP stack's resolver — test in the lab."}),e.jsxs("td",{className:"py-3 align-top",children:[e.jsx("code",{className:"text-slate-100",children:"2130706433"})," ","(decimal 127.0.0.1), ",e.jsx("code",{className:"text-slate-100",children:"127.1"}),","," ",e.jsx("code",{className:"text-slate-100",children:"0177.0.0.1"}),","," ",e.jsx("code",{className:"text-slate-100",children:"http://0.0.0.0:8080/flag"})]})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"Whitelist prefix check"}),e.jsx("td",{className:"py-3 pr-4 align-top",children:"URL-authority tricks that make the parser and the filter disagree: credentials, fragments, DNS hierarchy, encoding."}),e.jsxs("td",{className:"py-3 align-top",children:[e.jsx("code",{className:"text-slate-100",children:"https://trusted.com@evil.example/"}),","," ",e.jsx("code",{className:"text-slate-100",children:"https://evil.example#trusted.com"}),","," ",e.jsx("code",{className:"text-slate-100",children:"https://trusted.com.evil.example/"})]})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"Scheme allowlist (http/https only)"}),e.jsx("td",{className:"py-3 pr-4 align-top",children:"Cross-scheme redirects and protocol confusion — the first request is https, the redirect target is gopher, dict, or file."}),e.jsxs("td",{className:"py-3 align-top",children:[e.jsx("code",{className:"text-slate-100",children:"https://attacker.example/redirect"})," ","→ ",e.jsx("code",{className:"text-slate-100",children:"gopher://redis:6379/_..."})]})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"Hostname validation, no re-check on connect"}),e.jsx("td",{className:"py-3 pr-4 align-top",children:"DNS rebinding and TOCTOU races: the hostname resolves to a public IP when validated and to an internal IP when connected."}),e.jsxs("td",{className:"py-3 align-top",children:[e.jsx("code",{className:"text-slate-100",children:"attacker.example"})," alternates"," ",e.jsx("code",{className:"text-slate-100",children:"8.8.8.8"})," and"," ",e.jsx("code",{className:"text-slate-100",children:"127.0.0.1"})," with a short TTL"]})]})]})]})}),e.jsx("p",{className:"leading-relaxed",children:"OWASP's A10:2021 guidance calls this out directly: enforce URL scheme, port, and destination with a positive allowlist, disable HTTP redirections, and be aware of URL consistency to avoid DNS-rebinding and TOCTOU races."})]}),e.jsxs("section",{className:"mb-10",children:[e.jsx("h2",{className:"text-xl text-sky-500 font-semibold mb-4",children:"How to detect SSRF"}),e.jsx("p",{className:"leading-relaxed mb-4",children:"Detection works at three layers: static analysis in CI, network signatures, and outbound-flow logging."}),e.jsx("h3",{className:"text-lg text-sky-400 font-medium mb-3",children:"Static analysis (Semgrep)"}),e.jsx("p",{className:"leading-relaxed mb-4",children:"The OWASP cheat sheet points to the public Semgrep registry (q=ssrf) as a starting point. A minimal rule for the pattern above:"}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:`rules:
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
          - pattern: requests.request($METHOD, $URL, ...)`}),e.jsxs("p",{className:"leading-relaxed mb-4",children:["Expect noise: once you ship a guard helper like"," ",e.jsx("code",{className:"text-slate-100",children:"fetch_safe()"}),", the rule matches your own safe call sites. Add a ",e.jsx("code",{className:"text-slate-100",children:"pattern-not"})," for the helper or move the rule to review-only severity."]}),e.jsx("h3",{className:"text-lg text-sky-400 font-medium mb-3",children:"Network signatures (Suricata)"}),e.jsx("p",{className:"leading-relaxed mb-4",children:"Two example signatures (SIDs 1,000,000+ are reserved for local rules — tune before production):"}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:`alert http any any -> any any (msg:"SSRF: cloud metadata path requested"; \\
  flow:established,to_server; content:"/latest/meta-data/"; http_uri; \\
  classtype:attempted-info-leak; sid:1000001; rev:1;)

alert http any any -> any any (msg:"SSRF: link-local metadata host as destination"; \\
  flow:established,to_server; content:"169.254.169.254"; http_host; \\
  classtype:attempted-info-leak; sid:1000002; rev:1;)`}),e.jsx("h3",{className:"text-lg text-sky-400 font-medium mb-3",children:"Log signals"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 mb-4",children:[e.jsxs("li",{children:["Outbound HTTP from the app tier to"," ",e.jsx("code",{className:"text-slate-100",children:"169.254.169.254"}),","," ",e.jsx("code",{className:"text-slate-100",children:"metadata.google.internal"}),", or any link-local/loopback address — this should never appear in access logs."]}),e.jsx("li",{children:"App-tier connections to RFC 1918 destinations the application has no business calling (metadata, databases, admin panels)."}),e.jsxs("li",{children:["Non-HTTP schemes in fetch parameters (",e.jsx("code",{className:"text-slate-100",children:"gopher"}),","," ",e.jsx("code",{className:"text-slate-100",children:"dict"}),", ",e.jsx("code",{className:"text-slate-100",children:"file"}),")."]}),e.jsx("li",{children:"The redirect flavor of the attack leaves a distinctive two-hop trace: an outbound fetch to an external host followed within milliseconds by a loopback or internal request."})]})]}),e.jsxs("section",{className:"mb-10",children:[e.jsx("h2",{className:"text-xl text-sky-500 font-semibold mb-4",children:"How to prevent SSRF"}),e.jsx("p",{className:"leading-relaxed mb-4",children:"The OWASP cheat sheet splits prevention into two cases, and the choice of control depends on which one you are in:"}),e.jsx("div",{className:"overflow-x-auto mb-4",children:e.jsxs("table",{className:"w-full text-sm text-left border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-slate-700",children:[e.jsx("th",{className:"py-3 pr-4 text-slate-100 font-semibold",children:"Situation"}),e.jsx("th",{className:"py-3 text-slate-100 font-semibold",children:"Control that actually works"})]})}),e.jsxs("tbody",{className:"text-slate-300",children:[e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"The app only ever calls identified, trusted applications (internal services, a fixed API)"}),e.jsxs("td",{className:"py-3 align-top",children:["Positive allowlist: exact hostname/IP list, scheme and port allowlist, redirects disabled. Validate with parser-safe libraries (e.g. Apache Commons Validator in Java, ",e.jsx("code",{className:"text-slate-100",children:"ip-address"})," ","in JS, ",e.jsx("code",{className:"text-slate-100",children:"ipaddress"})," in Python)."]})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"The app must fetch arbitrary external URLs (webhooks, avatar uploads, link previews)"}),e.jsxs("td",{className:"py-3 align-top",children:["Deny-list as a last resort — OWASP explicitly warns it is bypass-prone. Minimum: block metadata endpoints, loopback, RFC 1918, link-local, and multicast ranges for ",e.jsx("em",{children:"every"})," resolved IP (A and AAAA), pin the connection to the validated IP, disable redirects or re-validate each hop, and allow only http/https."]})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"Cloud deployments"}),e.jsx("td",{className:"py-3 align-top",children:"Enforce IMDSv2 on AWS (PUT-token based; disable IMDSv1), scope IAM roles on the app tier to the minimum, and put the URL-fetching service behind an egress firewall with deny-by-default rules."})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"Any deployment"}),e.jsx("td",{className:"py-3 align-top",children:"Network segmentation: run URL-fetching functionality in its own segment so a compromise does not reach the whole backend. Never echo raw responses to the client when the Content-Type is non-text."})]})]})]})}),e.jsx("h3",{className:"text-lg text-sky-400 font-medium mb-3",children:"Python (requests) — resolve, validate, pin, no redirects"}),e.jsxs("p",{className:"leading-relaxed mb-4",children:["The core idea: resolve the hostname once, reject the request if ",e.jsx("em",{children:"any"})," ","resolved address is non-public, then connect to the validated address — so a DNS rebinding race between validation and connection has nothing to win."]}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:`import ipaddress
import socket
import urllib.parse

import requests
from requests.adapters import HTTPAdapter


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

    Pinning closes the DNS-rebinding window: we connect to the address we
    validated, not a re-resolved one. ponytail: for HTTPS targets this breaks
    SNI (TLS ServerName becomes the IP); a production variant must set the
    TLS server name explicitly.
    """

    def send(self, request, **kwargs):
        parsed = urllib.parse.urlsplit(request.url)
        if parsed.scheme not in ("http", "https"):
            raise requests.exceptions.InvalidURL("scheme not allowed")
        host = parsed.hostname or ""
        ips = _resolve_all(host)
        if not ips or any(_is_blocked(ip) for ip in ips):
            raise requests.exceptions.InvalidURL(
                f"destination resolves to a blocked address: {host}"
            )
        ip = ips[0]
        netloc = f"[{ip}]" if ":" in ip else ip
        if parsed.port:
            netloc = f"{netloc}:{parsed.port}"
        request.url = urllib.parse.urlunsplit(
            (parsed.scheme, netloc, parsed.path, parsed.query, "")
        )
        request.headers["Host"] = parsed.netloc
        return super().send(request, **kwargs)


def fetch_safe(url: str, timeout: int = 5) -> requests.Response:
    session = requests.Session()
    session.mount("http://", SSRFGuardAdapter())
    session.mount("https://", SSRFGuardAdapter())
    resp = session.get(url, timeout=timeout, allow_redirects=False)
    if resp.is_redirect:
        raise requests.exceptions.TooManyRedirects("redirects disabled (SSRF guard)")
    return resp`}),e.jsxs("p",{className:"leading-relaxed mb-4",children:["Against the lab, ",e.jsx("code",{className:"text-slate-100",children:"fetch_safe()"})," rejects every payload from the walkthrough: metadata (link-local), loopback, redirects, and"," ",e.jsx("code",{className:"text-slate-100",children:"file://"})," all raise before a socket is opened."]}),e.jsx("h3",{className:"text-lg text-sky-400 font-medium mb-3",children:"Go (net/http) — guarded DialContext"}),e.jsx("p",{className:"leading-relaxed mb-4",children:"Go's transport separates the dial address from the TLS ServerName, so HTTPS keeps working with correct SNI while the connection is pinned to a validated IP:"}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:`package main

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
}`}),e.jsx("h3",{className:"text-lg text-sky-400 font-medium mb-3",children:"Node.js (fetch) — resolve and validate, manual redirects"}),e.jsxs("p",{className:"leading-relaxed mb-4",children:["The OWASP cheat sheet recommends the ",e.jsx("code",{className:"text-slate-100",children:"ip-address"})," ","npm package for JS address validation. The example below shows the full pattern with a compact IPv4 range check; the IPv6 gap is flagged inline:"]}),e.jsx("pre",{className:"bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4",children:`import { lookup } from 'node:dns/promises';

// RFC 1918, loopback, link-local, unspecified, and multicast IPv4 ranges.
const BLOCKED_V4 = [
  ['10.0.0.0', 8], ['172.16.0.0', 12], ['192.168.0.0', 16],
  ['127.0.0.0', 8], ['169.254.0.0', 16], ['0.0.0.0', 8],
  ['224.0.0.0', 4],
];

function ipv4ToInt(ip) {
  return ip.split('.').reduce((acc, octet) => (acc << 8) | Number(octet), 0) >>> 0;
}

function isBlockedV4(ip) {
  const n = ipv4ToInt(ip);
  return BLOCKED_V4.some(([base, bits]) => {
    const mask = (~0 << (32 - bits)) >>> 0;
    return (n & mask) === (ipv4ToInt(base) & mask);
  });
}

async function assertPublic(host) {
  const records = await lookup(host, { all: true });
  if (records.length === 0) throw new Error('no addresses for ' + host);
  for (const { address, family } of records) {
    if (family === 4) {
      if (isBlockedV4(address)) throw new Error('blocked address ' + address);
    } else {
      // IPv6: reject loopback/unspecified here; ULA (fc00::/7) and link-local
      // (fe80::/10) need a proper range check - e.g. the ip-address package
      // recommended by the OWASP SSRF cheat sheet.
      if (address === '::1' || address === '::') throw new Error('blocked address ' + address);
    }
  }
}

export async function fetchSafe(urlString) {
  const url = new URL(urlString);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('scheme not allowed');
  }
  await assertPublic(url.hostname);
  const res = await fetch(url, { redirect: 'manual' }); // never auto-follow
  if (res.status >= 300 && res.status < 400) {
    throw new Error('redirects disabled (SSRF guard)');
  }
  return res;
}`}),e.jsx("h3",{className:"text-lg text-sky-400 font-medium mb-3",children:"Network layer and cloud metadata"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 mb-4",children:[e.jsx("li",{children:"Segment remote-resource-fetching functionality into its own network; enforce deny-by-default egress firewall rules so the app tier can only reach what it must (OWASP A10:2021 network-layer guidance)."}),e.jsxs("li",{children:["AWS: enable IMDSv2 and disable IMDSv1. IMDSv2 requires a PUT-obtained session token plus the"," ",e.jsx("code",{className:"text-slate-100",children:"X-aws-ec2-metadata-token"})," header, so a plain GET-based SSRF can no longer read credentials directly. This is a defense-in-depth layer, not a replacement for input validation — an SSRF with full request control can still obtain the token."]}),e.jsxs("li",{children:["GCP and Azure metadata services are reachable at the same link-local address"," ",e.jsx("code",{className:"text-slate-100",children:"169.254.169.254"})," (GCP also via"," ",e.jsx("code",{className:"text-slate-100",children:"metadata.google.internal"}),"); the OWASP deny-list table blocks all of them plus RFC 1918, loopback, and multicast ranges as a minimum."]})]})]}),e.jsxs("section",{className:"mb-10",children:[e.jsx("h2",{className:"text-xl text-sky-500 font-semibold mb-4",children:"Prevention checklist"}),e.jsx("div",{className:"overflow-x-auto mb-4",children:e.jsxs("table",{className:"w-full text-sm text-left border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-slate-700",children:[e.jsx("th",{className:"py-3 pr-4 text-slate-100 font-semibold",children:"Check"}),e.jsx("th",{className:"py-3 text-slate-100 font-semibold",children:"How to verify"})]})}),e.jsxs("tbody",{className:"text-slate-300",children:[e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"Every server-side fetch is inventoried (requests, urllib, http, fetch, curl, proxy rules)"}),e.jsx("td",{className:"py-3 align-top",children:"grep the codebase + configs; SAST rule in CI flags new call sites"})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"Scheme allowlist enforced (http/https)"}),e.jsxs("td",{className:"py-3 align-top",children:["Send ",e.jsx("code",{className:"text-slate-100",children:"file://"}),","," ",e.jsx("code",{className:"text-slate-100",children:"gopher://"}),","," ",e.jsx("code",{className:"text-slate-100",children:"dict://"})," — expect rejection"]})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"All resolved IPs validated (A + AAAA), connection pinned"}),e.jsx("td",{className:"py-3 align-top",children:"Point the app at a domain alternating public/private answers with a short TTL (DNS rebinding) — connection must still be blocked"})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"Redirects disabled or re-validated per hop"}),e.jsxs("td",{className:"py-3 align-top",children:["Serve a 302 from a host you control to"," ",e.jsx("code",{className:"text-slate-100",children:"http://169.254.169.254/"})," — expect rejection"]})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"Metadata endpoints blocked (AWS/GCP/Azure, 169.254.169.254)"}),e.jsx("td",{className:"py-3 align-top",children:"Lab walkthrough request — expect block; network signature fires on metadata path"})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"Egress firewall deny-by-default from app tier"}),e.jsx("td",{className:"py-3 align-top",children:"Attempt app → internal admin port from the app host; observe deny logs"})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 pr-4 align-top",children:"IMDSv2 enforced, IMDSv1 disabled (AWS)"}),e.jsxs("td",{className:"py-3 align-top",children:[e.jsx("code",{className:"text-slate-100",children:"aws ec2 describe-instances"})," —"," ",e.jsx("code",{className:"text-slate-100",children:"HttpTokens: required"})," on every instance"]})]}),e.jsxs("tr",{className:"border-b border-slate-800",children:[e.jsx("td",{className:"py-3 align-top",children:"Outbound-to-metadata alerts configured"}),e.jsx("td",{className:"py-3 align-top",children:"Trigger the Suricata rule or log query in staging; confirm the alert fires"})]})]})]})})]}),e.jsxs("section",{className:"mb-10",children:[e.jsx("h2",{className:"text-xl text-sky-500 font-semibold mb-4",children:"Key takeaways"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 mb-4",children:[e.jsx("li",{children:"SSRF converts the application's trusted network position into a proxy for the attacker — firewalls and ACLs are irrelevant once the fetch is attacker-controlled."}),e.jsx("li",{children:"The metadata chain (169.254.169.254 → IAM credentials → S3/control plane) is the highest-impact variant; it drove the Capital One breach and remains a current initial-access vector (CVE-2026-15409, KEV July 2026)."}),e.jsx("li",{children:"Allowlists beat deny-lists; deny-lists are a documented last resort. Whatever you use, validate every resolved IP, pin the connection, and disable redirects."}),e.jsx("li",{children:"Detection is cheap relative to the blast radius: SAST in CI, two Suricata signatures, and outbound-flow logs catch the common variants."})]})]}),e.jsxs("section",{className:"mb-10 border-t border-slate-800 pt-8",children:[e.jsx("h2",{className:"text-xl text-sky-500 font-semibold mb-4",children:"Kokkuvõte eesti keeles"}),e.jsx("p",{className:"leading-relaxed mb-4",children:"Server-Side Request Forgery (SSRF) on rünnak, kus ründaja sunnib rakendust tegema päringuid serveri enda nimel — näiteks localhosti, sisemiste teenuste või pilve metaandmete lõpp-punkti (169.254.169.254) poole. Nii saab varastada IAM-mandaate ja pääseda ligi sisemistele süsteemidele, mida tulemüür kaitseb. Peamised kaitsed: positiivne lubatud-URL-ide nimekiri (allowlist), kõigi DNS-ist lahendatud IP-aadresside kontroll, ümbersuunamiste keelamine ning võrgu tasandil deny-by-default egress-tulemüür. AWS-is lülitage sisse IMDSv2 ja keelake IMDSv1. Täielik laborikäik ja koodinäited on ülal inglise keeles."})]}),e.jsxs("section",{className:"mb-10 border-t border-slate-800 pt-8",children:[e.jsx("h2",{className:"text-xl text-sky-500 font-semibold mb-4",children:"Sources"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm",children:[e.jsx("li",{children:e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://owasp.org/Top10/2021/A10_2021-Server-Side_Request_Forgery_(SSRF)/",children:"OWASP Top 10:2021 — A10 Server-Side Request Forgery"})}),e.jsx("li",{children:e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html",children:"OWASP Server-Side Request Forgery Prevention Cheat Sheet"})}),e.jsx("li",{children:e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://owasp.org/Top10/2025/0x00_2025-Introduction/",children:"OWASP Top 10:2025 — Introduction (SSRF rolled into A01)"})}),e.jsx("li",{children:e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://cwe.mitre.org/data/definitions/918.html",children:"CWE-918 — Server-Side Request Forgery"})}),e.jsx("li",{children:e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://portswigger.net/web-security/ssrf",children:"PortSwigger Web Security Academy — SSRF"})}),e.jsx("li",{children:e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://portswigger.net/web-security/ssrf/url-validation-bypass-cheat-sheet",children:"PortSwigger — URL validation bypass cheat sheet"})}),e.jsx("li",{children:e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/",children:"AWS Security Blog — IMDSv2 defense in depth"})}),e.jsx("li",{children:e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://httpd.apache.org/security/vulnerabilities_24.html",children:"Apache HTTP Server vulnerabilities — CVE-2021-40438"})}),e.jsx("li",{children:e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://www.cisa.gov/known-exploited-vulnerabilities-catalog",children:"CISA Known Exploited Vulnerabilities Catalog (CVE-2026-15409)"})}),e.jsx("li",{children:e.jsxs("a",{className:"text-sky-400 hover:text-sky-300",href:"https://attack.mitre.org/techniques/T1190/",children:["MITRE ATT&CK T1190 / ",e.jsx("span",{className:"text-slate-300",children:"T1552.005"})," (Cloud Instance Metadata API)"]})}),e.jsxs("li",{children:[e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://www.capitalone.com/facts2019/",children:"Capital One — 2019 incident facts"}),"; ",e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://dl.acm.org/doi/10.1145/3546068",children:"systematic analysis (ACM)"})]}),e.jsxs("li",{children:[e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://www.rfc-editor.org/rfc/rfc1918",children:"RFC 1918"}),", ",e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://www.rfc-editor.org/rfc/rfc3927",children:"RFC 3927"})," (link-local), ",e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://www.rfc-editor.org/rfc/rfc4193",children:"RFC 4193"})," (ULA), ",e.jsx("a",{className:"text-sky-400 hover:text-sky-300",href:"https://www.rfc-editor.org/rfc/rfc5737",children:"RFC 5737"})," (documentation ranges)"]})]})]})]})]})})]})}export{n as default};
