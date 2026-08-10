import { Helmet } from 'react-helmet-async';

const guideUrl = 'https://proksiabel.ee/guides/ssrf-explained';

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'SSRF Explained: Server-Side Request Forgery Attack Examples and Prevention',
  description:
    'Server-side request forgery (SSRF) explained: attack anatomy, cloud metadata credential theft, deny-list bypasses, detection rules, and allowlist-based fix patterns, with a reproducible docker-compose lab.',
  datePublished: '2026-08-11',
  dateModified: '2026-08-11',
  inLanguage: 'en',
  mainEntityOfPage: guideUrl,
  author: {
    '@type': 'Organization',
    name: 'ProksiAbel OÜ',
    url: 'https://proksiabel.ee/',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ProksiAbel OÜ',
    url: 'https://proksiabel.ee/',
  },
};

export default function SsrfGuide() {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(techArticleSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-900 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-wide text-sky-400 font-semibold mb-4">Technical Guide</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            SSRF Explained: Server-Side Request Forgery Attack Examples and Prevention
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Server-side request forgery (SSRF) lets an attacker make the application&apos;s own
            server send requests anywhere that server can reach: localhost, internal networks,
            cloud metadata. It is CWE-918, entered OWASP&apos;s Top 10 as A10:2021, and in the 2025
            edition was folded into A01 Broken Access Control. This guide covers the mechanics, a
            reproducible local lab, detection, and fixes.
          </p>

          <div className="max-w-none text-slate-300">
            <section className="mb-10">
              <h2 className="text-xl text-sky-500 font-semibold mb-4">What SSRF is and why it keeps mattering</h2>
              <p className="leading-relaxed mb-4">
                SSRF occurs when a web application fetches a remote resource without validating the
                user-supplied URL. The attacker co-opts the application&apos;s own network position,
                which is trusted by everything behind the firewall, VPN, or network ACL — so SSRF
                turns a firewall into a non-factor. OWASP introduced it as A10:2021 with 9,503
                recorded occurrences and 385 mapped CVEs in that dataset, an average weighted
                exploit score of 8.28 / 10, and an average weighted impact of 6.72 / 10.
              </p>
              <p className="leading-relaxed mb-4">
                The 2025 OWASP Top 10 no longer lists SSRF as a standalone category: the release
                notes state it was <em>rolled into A01:2025 Broken Access Control</em>. That is a
                taxonomy change, not a risk change — the underlying weakness, CWE-918
                (Server-Side Request Forgery), is the same, and the cloud-metadata angle keeps it
                at the top of every bug-bounty program&apos;s payout table.
              </p>
              <p className="leading-relaxed mb-4">Three real incidents show the range of impact:</p>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="py-3 pr-4 text-slate-100 font-semibold">Incident</th>
                      <th className="py-3 pr-4 text-slate-100 font-semibold">SSRF role</th>
                      <th className="py-3 text-slate-100 font-semibold">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">Capital One, 2019</td>
                      <td className="py-3 pr-4 align-top">
                        SSRF through a misconfigured web application firewall reached the EC2
                        metadata service (169.254.169.254), returned IAM role credentials, which
                        were then used against S3.
                      </td>
                      <td className="py-3 align-top">
                        ~100M US and ~6M Canadian credit-application records exposed; a former AWS
                        engineer was charged by the DOJ.
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">CVE-2021-40438, Apache httpd</td>
                      <td className="py-3 pr-4 align-top">
                        Crafted request URI-path made mod_proxy forward to an origin server chosen
                        by the remote user — SSRF in the reverse proxy itself.
                      </td>
                      <td className="py-3 align-top">
                        Affects 2.4.48 and earlier; fixed in 2.4.49 (2021-09-16). Reverse proxies
                        are a first-class SSRF attack surface.
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 align-top">CVE-2026-15409, SonicWall SMA1000</td>
                      <td className="py-3 pr-4 align-top">SSRF in the appliance.</td>
                      <td className="py-3 align-top">
                        CVSS 10.0; added to the CISA Known Exploited Vulnerabilities catalog on
                        2026-07-14 with confirmed exploitation linked to ransomware campaigns —
                        evidence SSRF remains an active initial-access vector.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="leading-relaxed">
                In MITRE ATT&amp;CK terms, SSRF is the mechanism behind T1190 (Exploit Public-Facing
                Application), and the metadata-credential variant lands squarely in T1552.005
                (Unsecured Credentials: Cloud Instance Metadata API).
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl text-sky-500 font-semibold mb-4">Attack anatomy: three trust relationships</h2>
              <p className="leading-relaxed mb-4">
                SSRF attacks abuse the trust other systems place in the vulnerable application&apos;s
                network position. Concretely:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  <strong className="text-sky-400">Against the server itself</strong> — pointing the
                  fetch at <code className="text-slate-100">http://127.0.0.1:8080/admin</code> or
                  another localhost port. Access-control checks that trust loopback traffic (or
                  admin interfaces bound to non-public ports) are bypassed.
                </li>
                <li>
                  <strong className="text-sky-400">Against back-end systems</strong> — pointing it at
                  RFC 1918 addresses such as <code className="text-slate-100">http://192.168.0.68/admin</code>.
                  Internal services are often unauthenticated because the network topology was the
                  only control.
                </li>
                <li>
                  <strong className="text-sky-400">Against cloud metadata</strong> — pointing it at{' '}
                  <code className="text-slate-100">http://169.254.169.254/latest/meta-data/iam/security-credentials/</code>{' '}
                  to steal temporary IAM credentials, then using them against S3, SSM, or the
                  control plane (the Capital One chain).
                </li>
              </ul>
              <p className="leading-relaxed mb-4">
                The request flow is a simple relay — the attacker never talks to the target
                directly:
              </p>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`Attacker ──crafted URL──▶ Vulnerable App ──HTTP/FTP/gopher...──▶ Target (internal)
                             │                                          │
                             └────────────── response ──────────────────┘
                             │
                             └── response relayed to attacker (full SSRF)
                                or no response relayed (blind SSRF)`}
              </pre>
              <p className="leading-relaxed">
                A typical request pair — the classic &quot;stock API&quot; pattern, where the app
                fetches a URL the user supplies:
              </p>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`POST /product/stock HTTP/1.1
Content-Type: application/x-www-form-urlencoded

stockApi=http://localhost/admin`}
              </pre>
              <p className="leading-relaxed">
                The server performs <code className="text-slate-100">GET /admin</code> from its own
                loopback interface and relays the response. The same primitive works with the
                metadata endpoint substituted for <code className="text-slate-100">localhost</code>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl text-sky-500 font-semibold mb-4">Reproducible local lab</h2>
              <p className="leading-relaxed mb-4">
                Everything below runs against local containers on your machine — no live targets,
                no weaponized payloads. The lab emulates the AWS metadata endpoint at its real
                address,{' '}
                <code className="text-slate-100">169.254.169.254</code>, using a Docker network
                with a link-local subnet.
              </p>

              <h3 className="text-lg text-sky-400 font-medium mb-3">docker-compose.yml</h3>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`services:
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
        - subnet: 169.254.0.0/16`}
              </pre>
              <p className="leading-relaxed mb-4">
                Docker on a few hosts refuses link-local subnets. If
                <code className="text-slate-100"> docker compose up</code> errors on the subnet,
                switch the network to <code className="text-slate-100">172.28.0.0/16</code>, give
                the metadata container <code className="text-slate-100">172.28.0.66</code>, and use
                that address in every walkthrough URL below. The behavior is identical — only the
                IP changes.
              </p>

              <h3 className="text-lg text-sky-400 font-medium mb-3">Dockerfile</h3>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir flask requests
COPY app.py .
EXPOSE 8080
CMD ["python", "app.py"]`}
              </pre>

              <h3 className="text-lg text-sky-400 font-medium mb-3">app.py — vulnerable fetch endpoint</h3>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`from flask import Flask, Response, request
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
    app.run(host="0.0.0.0", port=8080)`}
              </pre>

              <h3 className="text-lg text-sky-400 font-medium mb-3">metadata.conf — fake cloud metadata service</h3>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`server {
    listen 80;

    location = /latest/meta-data/iam/security-credentials/ {
        add_header Content-Type application/json;
        return 200 '{"Code":"Success","AccessKeyId":"AKIALABEXAMPLE","SecretAccessKey":"lab-secret","Token":"lab-token","Expiration":"2027-01-01T00:00:00Z"}';
    }

    location /latest/meta-data/ {
        return 200 'lab-metadata-ok';
    }
}`}
              </pre>

              <h3 className="text-lg text-sky-400 font-medium mb-3">Run it and exploit it</h3>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`docker compose up --build`}
              </pre>
              <p className="leading-relaxed mb-4">
                First, confirm the endpoint works as intended against the public internet:
              </p>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`$ curl -s "http://localhost:8080/fetch?url=https://example.com/" | head -1
<!doctype html>`}
              </pre>
              <p className="leading-relaxed mb-4">
                Now the metadata credential theft — this is the Capital One chain in miniature.
                One request, no authentication:
              </p>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`$ curl -s "http://localhost:8080/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/"
{"Code":"Success","AccessKeyId":"AKIALABEXAMPLE","SecretAccessKey":"lab-secret","Token":"lab-token","Expiration":"2027-01-01T00:00:00Z"}`}
              </pre>
              <p className="leading-relaxed mb-4">
                And the loopback trust bypass — the request reaches the app&apos;s own internal
                endpoint through the same primitive:
              </p>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`$ curl -s "http://localhost:8080/fetch?url=http://127.0.0.1:8080/flag"
internal-only: flag{ssrf-locally-verified}`}
              </pre>

              <h3 className="text-lg text-sky-400 font-medium mb-3">What does not work (and why that teaches you more)</h3>
              <p className="leading-relaxed mb-4">
                Failed payloads are as instructive as successful ones:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  <code className="text-slate-100">file:///etc/passwd</code> — Python&apos;s{' '}
                  <code className="text-slate-100">requests</code> has no adapter for the file
                  scheme, so this raises{' '}
                  <code className="text-slate-100">InvalidSchema</code>. The same is not true of
                  stacks with richer scheme support (curl, Go&apos;s stdlib with custom handlers,
                  some Java HTTP clients) — scheme abuse is stack-dependent, which is why OWASP
                  lists <code className="text-slate-100">file://</code>,{' '}
                  <code className="text-slate-100">gopher://</code>,{' '}
                  <code className="text-slate-100">dict://</code>,{' '}
                  <code className="text-slate-100">data://</code> and{' '}
                  <code className="text-slate-100">phar://</code> as SSRF schemes to block.
                </li>
                <li>
                  The app&apos;s <code className="text-slate-100">startswith</code> scheme check
                  rejects <code className="text-slate-100">file://</code> — but accepts every
                  attack that matters. Scheme filtering alone is not a defense.
                </li>
                <li>
                  Add a naive deny-list blocking <code className="text-slate-100">127.0.0.1</code>{' '}
                  and <code className="text-slate-100">169.254.169.254</code> to the app — then
                  attack through a redirect you control. <code className="text-slate-100">requests</code>{' '}
                  follows redirects by default, so a URL like{' '}
                  <code className="text-slate-100">http://attacker.example/r?to=http://127.0.0.1:8080/flag</code>{' '}
                  sails past the filter. On Linux, <code className="text-slate-100">http://0.0.0.0:8080/flag</code>{' '}
                  also works: the kernel routes connections to the unspecified address to loopback.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl text-sky-500 font-semibold mb-4">Bypassing common defenses</h2>
              <p className="leading-relaxed mb-4">
                The pattern to internalize: filters that inspect a <em>string</em> lose to parsers
                that interpret it differently downstream. OWASP&apos;s own guidance is blunt — do
                not mitigate SSRF with a deny-list or regex. The table below is the standard
                bypass catalog (PortSwigger&apos;s Web Security Academy is the canonical
                reference):
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="py-3 pr-4 text-slate-100 font-semibold">Defense</th>
                      <th className="py-3 pr-4 text-slate-100 font-semibold">Bypass</th>
                      <th className="py-3 text-slate-100 font-semibold">Example</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">Deny-list on hostname strings</td>
                      <td className="py-3 pr-4 align-top">
                        Alternative IP encodings (decimal, octal, hex, short forms), DNS rebinding,
                        redirects, 0.0.0.0. Whether a given encoding works depends on the HTTP
                        stack&apos;s resolver — test in the lab.
                      </td>
                      <td className="py-3 align-top">
                        <code className="text-slate-100">2130706433</code>{' '}
                        (decimal 127.0.0.1), <code className="text-slate-100">127.1</code>,{' '}
                        <code className="text-slate-100">0177.0.0.1</code>,{' '}
                        <code className="text-slate-100">http://0.0.0.0:8080/flag</code>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">Whitelist prefix check</td>
                      <td className="py-3 pr-4 align-top">
                        URL-authority tricks that make the parser and the filter disagree:
                        credentials, fragments, DNS hierarchy, encoding.
                      </td>
                      <td className="py-3 align-top">
                        <code className="text-slate-100">https://trusted.com@evil.example/</code>,{' '}
                        <code className="text-slate-100">https://evil.example#trusted.com</code>,{' '}
                        <code className="text-slate-100">https://trusted.com.evil.example/</code>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">Scheme allowlist (http/https only)</td>
                      <td className="py-3 pr-4 align-top">
                        Cross-scheme redirects and protocol confusion — the first request is
                        https, the redirect target is gopher, dict, or file.
                      </td>
                      <td className="py-3 align-top">
                        <code className="text-slate-100">https://attacker.example/redirect</code>{' '}
                        → <code className="text-slate-100">gopher://redis:6379/_...</code>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">Hostname validation, no re-check on connect</td>
                      <td className="py-3 pr-4 align-top">
                        DNS rebinding and TOCTOU races: the hostname resolves to a public IP when
                        validated and to an internal IP when connected.
                      </td>
                      <td className="py-3 align-top">
                        <code className="text-slate-100">attacker.example</code> alternates{' '}
                        <code className="text-slate-100">8.8.8.8</code> and{' '}
                        <code className="text-slate-100">127.0.0.1</code> with a short TTL
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="leading-relaxed">
                OWASP&apos;s A10:2021 guidance calls this out directly: enforce URL scheme, port,
                and destination with a positive allowlist, disable HTTP redirections, and be aware
                of URL consistency to avoid DNS-rebinding and TOCTOU races.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl text-sky-500 font-semibold mb-4">How to detect SSRF</h2>
              <p className="leading-relaxed mb-4">
                Detection works at three layers: static analysis in CI, network signatures, and
                outbound-flow logging.
              </p>

              <h3 className="text-lg text-sky-400 font-medium mb-3">Static analysis (Semgrep)</h3>
              <p className="leading-relaxed mb-4">
                The OWASP cheat sheet points to the public Semgrep registry (q=ssrf) as a starting
                point. A minimal rule for the pattern above:
              </p>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`rules:
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
          - pattern: requests.request($METHOD, $URL, ...)`}
              </pre>
              <p className="leading-relaxed mb-4">
                Expect noise: once you ship a guard helper like{' '}
                <code className="text-slate-100">fetch_safe()</code>, the rule matches your own
                safe call sites. Add a <code className="text-slate-100">pattern-not</code> for the
                helper or move the rule to review-only severity.
              </p>

              <h3 className="text-lg text-sky-400 font-medium mb-3">Network signatures (Suricata)</h3>
              <p className="leading-relaxed mb-4">
                Two example signatures (SIDs 1,000,000+ are reserved for local rules — tune before
                production):
              </p>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`alert http any any -> any any (msg:"SSRF: cloud metadata path requested"; \\
  flow:established,to_server; content:"/latest/meta-data/"; http_uri; \\
  classtype:attempted-info-leak; sid:1000001; rev:1;)

alert http any any -> any any (msg:"SSRF: link-local metadata host as destination"; \\
  flow:established,to_server; content:"169.254.169.254"; http_host; \\
  classtype:attempted-info-leak; sid:1000002; rev:1;)`}
              </pre>

              <h3 className="text-lg text-sky-400 font-medium mb-3">Log signals</h3>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  Outbound HTTP from the app tier to{' '}
                  <code className="text-slate-100">169.254.169.254</code>,{' '}
                  <code className="text-slate-100">metadata.google.internal</code>, or any
                  link-local/loopback address — this should never appear in access logs.
                </li>
                <li>
                  App-tier connections to RFC 1918 destinations the application has no business
                  calling (metadata, databases, admin panels).
                </li>
                <li>
                  Non-HTTP schemes in fetch parameters (<code className="text-slate-100">gopher</code>,{' '}
                  <code className="text-slate-100">dict</code>, <code className="text-slate-100">file</code>).
                </li>
                <li>
                  The redirect flavor of the attack leaves a distinctive two-hop trace: an
                  outbound fetch to an external host followed within milliseconds by a loopback or
                  internal request.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl text-sky-500 font-semibold mb-4">How to prevent SSRF</h2>
              <p className="leading-relaxed mb-4">
                The OWASP cheat sheet splits prevention into two cases, and the choice of control
                depends on which one you are in:
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="py-3 pr-4 text-slate-100 font-semibold">Situation</th>
                      <th className="py-3 text-slate-100 font-semibold">Control that actually works</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">
                        The app only ever calls identified, trusted applications (internal
                        services, a fixed API)
                      </td>
                      <td className="py-3 align-top">
                        Positive allowlist: exact hostname/IP list, scheme and port allowlist,
                        redirects disabled. Validate with parser-safe libraries (e.g. Apache
                        Commons Validator in Java, <code className="text-slate-100">ip-address</code>{' '}
                        in JS, <code className="text-slate-100">ipaddress</code> in Python).
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">
                        The app must fetch arbitrary external URLs (webhooks, avatar uploads, link
                        previews)
                      </td>
                      <td className="py-3 align-top">
                        Deny-list as a last resort — OWASP explicitly warns it is bypass-prone.
                        Minimum: block metadata endpoints, loopback, RFC 1918, link-local, and
                        multicast ranges for <em>every</em> resolved IP (A and AAAA), pin the
                        connection to the validated IP, disable redirects or re-validate each hop,
                        and allow only http/https.
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">Cloud deployments</td>
                      <td className="py-3 align-top">
                        Enforce IMDSv2 on AWS (PUT-token based; disable IMDSv1), scope IAM roles on
                        the app tier to the minimum, and put the URL-fetching service behind an
                        egress firewall with deny-by-default rules.
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">Any deployment</td>
                      <td className="py-3 align-top">
                        Network segmentation: run URL-fetching functionality in its own segment so
                        a compromise does not reach the whole backend. Never echo raw responses to
                        the client when the Content-Type is non-text.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg text-sky-400 font-medium mb-3">Python (requests) — resolve, validate, pin, no redirects</h3>
              <p className="leading-relaxed mb-4">
                The core idea: resolve the hostname once, reject the request if <em>any</em>{' '}
                resolved address is non-public, then connect to the validated address — so a DNS
                rebinding race between validation and connection has nothing to win.
              </p>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`import ipaddress
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
    return resp`}
              </pre>
              <p className="leading-relaxed mb-4">
                Against the lab, <code className="text-slate-100">fetch_safe()</code> rejects every
                payload from the walkthrough: metadata (link-local), loopback, redirects, and{' '}
                <code className="text-slate-100">file://</code> all raise before a socket is opened.
              </p>

              <h3 className="text-lg text-sky-400 font-medium mb-3">Go (net/http) — guarded DialContext</h3>
              <p className="leading-relaxed mb-4">
                Go&apos;s transport separates the dial address from the TLS ServerName, so HTTPS
                keeps working with correct SNI while the connection is pinned to a validated IP:
              </p>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`package main

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
}`}
              </pre>

              <h3 className="text-lg text-sky-400 font-medium mb-3">Node.js (fetch) — resolve and validate, manual redirects</h3>
              <p className="leading-relaxed mb-4">
                The OWASP cheat sheet recommends the <code className="text-slate-100">ip-address</code>{' '}
                npm package for JS address validation. The example below shows the full pattern
                with a compact IPv4 range check; the IPv6 gap is flagged inline:
              </p>
              <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4">
{`import { lookup } from 'node:dns/promises';

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
}`}
              </pre>

              <h3 className="text-lg text-sky-400 font-medium mb-3">Network layer and cloud metadata</h3>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  Segment remote-resource-fetching functionality into its own network; enforce
                  deny-by-default egress firewall rules so the app tier can only reach what it
                  must (OWASP A10:2021 network-layer guidance).
                </li>
                <li>
                  AWS: enable IMDSv2 and disable IMDSv1. IMDSv2 requires a PUT-obtained session
                  token plus the{' '}
                  <code className="text-slate-100">X-aws-ec2-metadata-token</code> header, so a
                  plain GET-based SSRF can no longer read credentials directly. This is a
                  defense-in-depth layer, not a replacement for input validation — an SSRF with
                  full request control can still obtain the token.
                </li>
                <li>
                  GCP and Azure metadata services are reachable at the same link-local address{' '}
                  <code className="text-slate-100">169.254.169.254</code> (GCP also via{' '}
                  <code className="text-slate-100">metadata.google.internal</code>); the OWASP
                  deny-list table blocks all of them plus RFC 1918, loopback, and multicast
                  ranges as a minimum.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl text-sky-500 font-semibold mb-4">Prevention checklist</h2>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="py-3 pr-4 text-slate-100 font-semibold">Check</th>
                      <th className="py-3 text-slate-100 font-semibold">How to verify</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">
                        Every server-side fetch is inventoried (requests, urllib, http, fetch,
                        curl, proxy rules)
                      </td>
                      <td className="py-3 align-top">
                        grep the codebase + configs; SAST rule in CI flags new call sites
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">Scheme allowlist enforced (http/https)</td>
                      <td className="py-3 align-top">
                        Send <code className="text-slate-100">file://</code>,{' '}
                        <code className="text-slate-100">gopher://</code>,{' '}
                        <code className="text-slate-100">dict://</code> — expect rejection
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">
                        All resolved IPs validated (A + AAAA), connection pinned
                      </td>
                      <td className="py-3 align-top">
                        Point the app at a domain alternating public/private answers with a short
                        TTL (DNS rebinding) — connection must still be blocked
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">Redirects disabled or re-validated per hop</td>
                      <td className="py-3 align-top">
                        Serve a 302 from a host you control to{' '}
                        <code className="text-slate-100">http://169.254.169.254/</code> — expect
                        rejection
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">
                        Metadata endpoints blocked (AWS/GCP/Azure, 169.254.169.254)
                      </td>
                      <td className="py-3 align-top">
                        Lab walkthrough request — expect block; network signature fires on
                        metadata path
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">Egress firewall deny-by-default from app tier</td>
                      <td className="py-3 align-top">
                        Attempt app → internal admin port from the app host; observe deny logs
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 pr-4 align-top">IMDSv2 enforced, IMDSv1 disabled (AWS)</td>
                      <td className="py-3 align-top">
                        <code className="text-slate-100">aws ec2 describe-instances</code> —{' '}
                        <code className="text-slate-100">HttpTokens: required</code> on every
                        instance
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 align-top">Outbound-to-metadata alerts configured</td>
                      <td className="py-3 align-top">
                        Trigger the Suricata rule or log query in staging; confirm the alert fires
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl text-sky-500 font-semibold mb-4">Key takeaways</h2>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  SSRF converts the application&apos;s trusted network position into a proxy for
                  the attacker — firewalls and ACLs are irrelevant once the fetch is
                  attacker-controlled.
                </li>
                <li>
                  The metadata chain (169.254.169.254 → IAM credentials → S3/control plane) is
                  the highest-impact variant; it drove the Capital One breach and remains a
                  current initial-access vector (CVE-2026-15409, KEV July 2026).
                </li>
                <li>
                  Allowlists beat deny-lists; deny-lists are a documented last resort. Whatever
                  you use, validate every resolved IP, pin the connection, and disable redirects.
                </li>
                <li>
                  Detection is cheap relative to the blast radius: SAST in CI, two Suricata
                  signatures, and outbound-flow logs catch the common variants.
                </li>
              </ul>
            </section>

            <section className="mb-10 border-t border-slate-800 pt-8">
              <h2 className="text-xl text-sky-500 font-semibold mb-4">Kokkuvõte eesti keeles</h2>
              <p className="leading-relaxed mb-4">
                Server-Side Request Forgery (SSRF) on rünnak, kus ründaja sunnib rakendust tegema
                päringuid serveri enda nimel — näiteks localhosti, sisemiste teenuste või pilve
                metaandmete lõpp-punkti (169.254.169.254) poole. Nii saab varastada IAM-mandaate
                ja pääseda ligi sisemistele süsteemidele, mida tulemüür kaitseb. Peamised kaitsed:
                positiivne lubatud-URL-ide nimekiri (allowlist), kõigi DNS-ist lahendatud
                IP-aadresside kontroll, ümbersuunamiste keelamine ning võrgu tasandil
                deny-by-default egress-tulemüür. AWS-is lülitage sisse IMDSv2 ja keelake IMDSv1.
                Täielik laborikäik ja koodinäited on ülal inglise keeles.
              </p>
            </section>

            <section className="mb-10 border-t border-slate-800 pt-8">
              <h2 className="text-xl text-sky-500 font-semibold mb-4">Sources</h2>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><a className="text-sky-400 hover:text-sky-300" href="https://owasp.org/Top10/2021/A10_2021-Server-Side_Request_Forgery_(SSRF)/">OWASP Top 10:2021 — A10 Server-Side Request Forgery</a></li>
                <li><a className="text-sky-400 hover:text-sky-300" href="https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html">OWASP Server-Side Request Forgery Prevention Cheat Sheet</a></li>
                <li><a className="text-sky-400 hover:text-sky-300" href="https://owasp.org/Top10/2025/0x00_2025-Introduction/">OWASP Top 10:2025 — Introduction (SSRF rolled into A01)</a></li>
                <li><a className="text-sky-400 hover:text-sky-300" href="https://cwe.mitre.org/data/definitions/918.html">CWE-918 — Server-Side Request Forgery</a></li>
                <li><a className="text-sky-400 hover:text-sky-300" href="https://portswigger.net/web-security/ssrf">PortSwigger Web Security Academy — SSRF</a></li>
                <li><a className="text-sky-400 hover:text-sky-300" href="https://portswigger.net/web-security/ssrf/url-validation-bypass-cheat-sheet">PortSwigger — URL validation bypass cheat sheet</a></li>
                <li><a className="text-sky-400 hover:text-sky-300" href="https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/">AWS Security Blog — IMDSv2 defense in depth</a></li>
                <li><a className="text-sky-400 hover:text-sky-300" href="https://httpd.apache.org/security/vulnerabilities_24.html">Apache HTTP Server vulnerabilities — CVE-2021-40438</a></li>
                <li><a className="text-sky-400 hover:text-sky-300" href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog">CISA Known Exploited Vulnerabilities Catalog (CVE-2026-15409)</a></li>
                <li><a className="text-sky-400 hover:text-sky-300" href="https://attack.mitre.org/techniques/T1190/">MITRE ATT&amp;CK T1190 / <span className="text-slate-300">T1552.005</span> (Cloud Instance Metadata API)</a></li>
                <li><a className="text-sky-400 hover:text-sky-300" href="https://www.capitalone.com/facts2019/">Capital One — 2019 incident facts</a>; <a className="text-sky-400 hover:text-sky-300" href="https://dl.acm.org/doi/10.1145/3546068">systematic analysis (ACM)</a></li>
                <li><a className="text-sky-400 hover:text-sky-300" href="https://www.rfc-editor.org/rfc/rfc1918">RFC 1918</a>, <a className="text-sky-400 hover:text-sky-300" href="https://www.rfc-editor.org/rfc/rfc3927">RFC 3927</a> (link-local), <a className="text-sky-400 hover:text-sky-300" href="https://www.rfc-editor.org/rfc/rfc4193">RFC 4193</a> (ULA), <a className="text-sky-400 hover:text-sky-300" href="https://www.rfc-editor.org/rfc/rfc5737">RFC 5737</a> (documentation ranges)</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
