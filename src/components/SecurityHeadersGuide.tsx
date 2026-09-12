import { Helmet } from '@dr.pogodin/react-helmet';

const guideUrl = 'https://proksiabel.ee/guides/security-headers-checklist';

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Security Headers Checklist: How to Configure and Verify HTTP Security Headers',
  description:
    'A priority-ordered HTTP security headers checklist: exact values for HSTS, Content-Security-Policy, nosniff, Referrer-Policy, Permissions-Policy, and cross-origin isolation, what each header breaks when enabled, and curl-based verification.',
  datePublished: '2026-08-27',
  dateModified: '2026-08-27',
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

export default function SecurityHeadersGuide() {
  return (
    <>
      <Helmet>
        <script type='application/ld+json'>{JSON.stringify(techArticleSchema)}</script>
      </Helmet>

      <div className='min-h-screen bg-slate-900 pt-24 pb-12'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <p className='text-sm uppercase tracking-wide text-sky-400 font-semibold mb-4'>
            Technical Guide
          </p>
          <h1 className='text-3xl md:text-4xl font-bold text-white mb-6'>
            Security Headers Checklist: How to Configure and Verify HTTP Security Headers
          </h1>
          <p className='text-slate-400 text-lg leading-relaxed mb-10'>
            HTTP security headers are the cheapest high-impact hardening you can ship: a handful of
            response headers that stop clickjacking, MIME-sniffing, referrer leakage, and most XSS.
            This checklist tells you exactly which headers to set, what values to use, what each one
            breaks when you turn it on, and how to verify it.
          </p>

          <div className='max-w-none text-slate-300'>
            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                What security headers actually protect
              </h2>
              <p className='leading-relaxed mb-4'>
                Security headers are browser-enforced policy. The browser reads them from the
                response and restricts what it will do with the page: which origins may execute
                script, whether the page may be framed, whether the connection may be downgraded to
                HTTP, how much referrer information leaves the page. They are not a substitute for
                server-side controls — they are the last line of defense that runs in the
                user&apos;s browser, and they stop whole attack classes at the client.
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Header</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Attack it stops</th>
                      <th className='py-3 text-slate-100 font-semibold'>CWE</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Content-Security-Policy</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Cross-site scripting, data injection, clickjacking
                      </td>
                      <td className='py-3 align-top'>CWE-79, CWE-1021</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Strict-Transport-Security</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        SSL stripping, protocol downgrade, cookie capture over plain HTTP
                      </td>
                      <td className='py-3 align-top'>CWE-319</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>X-Content-Type-Options</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        MIME sniffing / MIME confusion (uploads served as executable HTML)
                      </td>
                      <td className='py-3 align-top'>CWE-116</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Referrer-Policy</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Referrer leakage of full URLs (tokens, internal paths) to third parties
                      </td>
                      <td className='py-3 align-top'>CWE-200</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>X-Frame-Options</code> / CSP{' '}
                        <code className='text-slate-100'>frame-ancestors</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>Clickjacking (UI redressing)</td>
                      <td className='py-3 align-top'>CWE-1021</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Permissions-Policy</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Abuse of camera/mic/geolocation after an injection or malicious iframe
                      </td>
                      <td className='py-3 align-top'>Defense-in-depth</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Cross-Origin-Opener-Policy</code> /{' '}
                        <code className='text-slate-100'>Cross-Origin-Resource-Policy</code> /{' '}
                        <code className='text-slate-100'>Cross-Origin-Embedder-Policy</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Cross-origin data theft via side channels (Spectre-class)
                      </td>
                      <td className='py-3 align-top'>CWE-200</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Cache-Control</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Sensitive responses stored in shared or browser caches
                      </td>
                      <td className='py-3 align-top'>CWE-524</td>
                    </tr>
                    <tr>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Set-Cookie</code> attributes
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Session theft, fixation, CSRF via cookies
                      </td>
                      <td className='py-3 align-top'>CWE-614, CWE-352</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className='leading-relaxed'>
                Everything below is grounded in the{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html'
                  rel='noopener noreferrer'
                >
                  OWASP HTTP Security Response Headers Cheat Sheet
                </a>{' '}
                and OWASP ASVS v4.0.3 V14.4 (HTTP Security Headers, requirements 14.4.1–14.4.7).
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                The checklist: P0 core headers (every site)
              </h2>
              <p className='leading-relaxed mb-4'>
                These six are non-negotiable for any public web application. If you only ship one
                batch of headers, ship these.
              </p>
              <ol className='list-decimal list-inside space-y-3 mb-6'>
                <li>
                  <strong className='text-sky-400'>Strict-Transport-Security (HSTS)</strong> —{' '}
                  <code className='text-slate-100'>
                    Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
                  </code>{' '}
                  (OWASP recommendation; defined in RFC 6797). The browser will refuse plain-HTTP
                  connections to your domain for two years. Only add <code>preload</code> once you
                  are certain every subdomain serves HTTPS: a preloaded domain cannot be removed
                  quickly from the preload list (hstspreload.org requires <code>max-age</code> of at
                  least 31536000 plus <code>includeSubDomains</code> to accept a submission).
                </li>
                <li>
                  <strong className='text-sky-400'>Content-Security-Policy</strong> — a strict
                  policy with <code className='text-slate-100'>object-src &apos;none&apos;</code>,{' '}
                  <code className='text-slate-100'>base-uri &apos;self&apos;</code>,{' '}
                  <code className='text-slate-100'>frame-ancestors &apos;none&apos;</code>, and a
                  source list that excludes <code>&apos;unsafe-inline&apos;</code> for scripts. See
                  the dedicated section below — it is the header that needs the most care.
                </li>
                <li>
                  <strong className='text-sky-400'>X-Content-Type-Options</strong> —{' '}
                  <code className='text-slate-100'>X-Content-Type-Options: nosniff</code>. Blocks
                  MIME sniffing, so an attacker-uploaded file can never be rendered as executable
                  HTML (ASVS 14.4.4).
                </li>
                <li>
                  <strong className='text-sky-400'>Referrer-Policy</strong> —{' '}
                  <code className='text-slate-100'>
                    Referrer-Policy: strict-origin-when-cross-origin
                  </code>
                  . Sends the full URL to same-origin destinations, only the origin to cross-origin
                  ones, and nothing on HTTPS→HTTP downgrades. This is the modern browser default;
                  set it explicitly so behavior does not depend on client version (ASVS 14.4.6).
                </li>
                <li>
                  <strong className='text-sky-400'>X-Frame-Options</strong> —{' '}
                  <code className='text-slate-100'>X-Frame-Options: DENY</code>. The legacy
                  clickjacking control, still useful for older browsers; CSP{' '}
                  <code className='text-slate-100'>frame-ancestors</code> supersedes it where CSP
                  Level 2 is supported (ASVS 14.4.7). Set both; they do not conflict.
                </li>
                <li>
                  <strong className='text-sky-400'>Content-Type with charset</strong> —{' '}
                  <code className='text-slate-100'>Content-Type: text/html; charset=utf-8</code>. An
                  explicit charset prevents UTF-7-style encoding-based XSS and ensures the declared
                  type always matches the body (ASVS 14.4.1).
                </li>
              </ol>
              <p className='leading-relaxed mb-4'>
                Plus one hygiene rule: strip fingerprinting headers.{' '}
                <code className='text-slate-100'>Server</code> and{' '}
                <code className='text-slate-100'>X-Powered-By</code> advertise your stack to
                attackers. Remove them or set non-informative values (OWASP: set{' '}
                <code className='text-slate-100'>Server: webserver</code> or nothing). This is minor
                — attackers fingerprint you anyway — but it is free.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                The checklist: P1 hardening (most sites)
              </h2>
              <ul className='list-disc list-inside space-y-3 mb-6'>
                <li>
                  <strong className='text-sky-400'>Permissions-Policy</strong> —{' '}
                  <code className='text-slate-100'>
                    Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
                  </code>
                  . Disables browser features your site does not use, for your own pages and any
                  iframe content. If an injection or a malicious iframe later tries to enable the
                  camera or geolocation, the browser refuses. Rarely breaks anything; if a feature
                  is genuinely needed, allow only your origin:{' '}
                  <code className='text-slate-100'>camera=(self)</code>.
                </li>
                <li>
                  <strong className='text-sky-400'>Cross-Origin-Opener-Policy</strong> —{' '}
                  <code className='text-slate-100'>Cross-Origin-Opener-Policy: same-origin</code>.
                  Isolates your page in its own browsing context group, so a cross-origin page
                  opened from yours (or opening yours) cannot hold a handle to your{' '}
                  <code className='text-slate-100'>window</code> object. Directly reduces the attack
                  surface of cross-origin data theft.
                </li>
                <li>
                  <strong className='text-sky-400'>Cross-Origin-Resource-Policy</strong> —{' '}
                  <code className='text-slate-100'>Cross-Origin-Resource-Policy: same-site</code>.
                  Tells the browser which origins may include your resources; prevents a
                  cross-origin page from loading your responses into its process (relevant for
                  Spectre-class side channels).
                </li>
                <li>
                  <strong className='text-sky-400'>Cache-Control for sensitive responses</strong> —{' '}
                  <code className='text-slate-100'>Cache-Control: no-store</code> for anything
                  containing personal or session data;{' '}
                  <code className='text-slate-100'>private</code> for user-specific but cacheable
                  content. Do not rely on defaults, and note that{' '}
                  <code className='text-slate-100'>no-cache</code> does not prevent storage — it
                  only forces revalidation (OWASP).
                </li>
                <li>
                  <strong className='text-sky-400'>Set-Cookie attributes</strong> — every session
                  cookie must carry <code className='text-slate-100'>Secure</code>,{' '}
                  <code className='text-slate-100'>HttpOnly</code>, and{' '}
                  <code className='text-slate-100'>SameSite=Lax</code> (or{' '}
                  <code className='text-slate-100'>Strict</code> where the UX tolerates it).{' '}
                  <code className='text-slate-100'>SameSite=Lax</code> is the modern browser
                  default; set it explicitly and verify it in the{' '}
                  <code className='text-slate-100'>Set-Cookie</code> header (OWASP Session
                  Management Cheat Sheet).
                </li>
              </ul>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                The checklist: P2 opt-in (with real costs)
              </h2>
              <ul className='list-disc list-inside space-y-3 mb-6'>
                <li>
                  <strong className='text-sky-400'>
                    Cross-Origin-Embedder-Policy: require-corp
                  </strong>{' '}
                  — the strongest cross-origin isolation control, and the most expensive: the page
                  can no longer load <em>any</em> cross-origin resource that does not explicitly opt
                  in via CORP or CORS headers. One third-party font, image CDN, or iframe without
                  the right headers and it silently fails to load. Enable only when you control (or
                  can enumerate) every resource the page loads, and prefer{' '}
                  <code className='text-slate-100'>credentialless</code> as a stepping stone.
                </li>
                <li>
                  <strong className='text-sky-400'>
                    CSP <code className='text-slate-100'>upgrade-insecure-requests</code>
                  </strong>{' '}
                  — instructs the browser to rewrite every HTTP subresource to HTTPS. Harmless for a
                  fully-HTTPS site; genuinely useful during migrations off legacy HTTP URLs.
                </li>
                <li>
                  <strong className='text-sky-400'>Trusted Types</strong> —{' '}
                  <code className='text-slate-100'>
                    require-trusted-types-for &apos;script&apos;
                  </code>{' '}
                  (CSP directive, plus the <code className='text-slate-100'>trusted-types</code>{' '}
                  policy allowlist). Locks down DOM XSS sinks so only typed, non-spoofable values
                  reach <code className='text-slate-100'>innerHTML</code>-class sinks. High value
                  for apps with a lot of DOM manipulation; requires refactoring code that assigns
                  strings to sinks.
                </li>
              </ul>
              <p className='leading-relaxed mb-4'>
                And two headers you should <strong className='text-sky-400'>not</strong> set:
              </p>
              <ul className='list-disc list-inside space-y-3 mb-6'>
                <li>
                  <strong className='text-sky-400'>X-XSS-Protection</strong> — set{' '}
                  <code className='text-slate-100'>X-XSS-Protection: 0</code> or omit it. The legacy
                  browser filter is known to introduce XSS vulnerabilities in otherwise safe sites
                  (MDN), and CSP replaces it. Many scanners still demand this header; the correct
                  answer is a working CSP, not a dangerous legacy filter.
                </li>
                <li>
                  <strong className='text-sky-400'>Expect-CT</strong> — do not use it. Certificate
                  Transparency is enforced by default in modern browsers; the header is deprecated
                  and MDN recommends removing it.
                </li>
              </ul>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Content-Security-Policy: the header that needs care
              </h2>
              <p className='leading-relaxed mb-4'>
                CSP is the highest-value security header and the one most likely to break your site.
                A workable strict policy for a static SPA (self-hosted assets, no inline scripts)
                looks like this:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`}
              </pre>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  <code className='text-slate-100'>default-src &apos;self&apos;</code> — the
                  fallback for every fetch directive not listed; everything loads from your origin
                  unless explicitly allowed (MDN).
                </li>
                <li>
                  <code className='text-slate-100'>object-src &apos;none&apos;</code> — kills{' '}
                  <code className='text-slate-100'>&lt;object&gt;/&lt;embed&gt;</code> vectors
                  (Flash-class legacy plugins) outright.
                </li>
                <li>
                  <code className='text-slate-100'>base-uri &apos;self&apos;</code> — stops base-tag
                  injection from rewriting every relative URL on the page.
                </li>
                <li>
                  <code className='text-slate-100'>frame-ancestors &apos;none&apos;</code> — the
                  modern clickjacking control; replaces{' '}
                  <code className='text-slate-100'>X-Frame-Options</code> in CSP Level 2+ browsers.
                </li>
                <li>
                  <code className='text-slate-100'>style-src &apos;unsafe-inline&apos;</code> — a
                  deliberate allowance: framework-rendered{' '}
                  <code className='text-slate-100'>style=&quot;...&quot;</code> attributes are
                  inline styles. Removing it breaks styling before it protects anything. Never grant
                  the equivalent in <code className='text-slate-100'>script-src</code>.
                </li>
              </ul>
              <p className='leading-relaxed mb-4'>
                If your build injects inline scripts (Vite legacy polyfills, analytics snippets,
                CSP-required inline styles), use nonces or hashes instead of{' '}
                <code className='text-slate-100'>&apos;unsafe-inline&apos;</code>: a per-request
                nonce on the <code className='text-slate-100'>&lt;script&gt;</code> tag matching{' '}
                <code className='text-slate-100'>script-src &apos;nonce-...&apos;</code>, or a{' '}
                <code className='text-slate-100'>&apos;sha256-...&apos;</code> hash of the exact
                inline content. Note that browsers ignore{' '}
                <code className='text-slate-100'>&apos;unsafe-inline&apos;</code> for a directive
                when a nonce or hash is present — so a nonce-based policy is strictly stronger.
                Inline <code className='text-slate-100'>application/ld+json</code> (JSON-LD) blocks
                are data, not executable scripts, and are not governed by{' '}
                <code className='text-slate-100'>script-src</code>.
              </p>
              <p className='leading-relaxed mb-4'>
                Rollout rule: ship every new CSP first as{' '}
                <code className='text-slate-100'>Content-Security-Policy-Report-Only</code> with a{' '}
                <code className='text-slate-100'>report-uri</code> (or the newer{' '}
                <code className='text-slate-100'>report-to</code>), collect violations for at least
                one release cycle, fix what trips, then enforce. Every blocking change should follow
                this pattern — the header that breaks your checkout is a self-inflicted outage.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Decision matrix: what each header breaks
              </h2>
              <div className='overflow-x-auto mb-6'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Header</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Recommended value</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>
                        What breaks when enabled
                      </th>
                      <th className='py-3 text-slate-100 font-semibold'>Verify</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Strict-Transport-Security</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>
                          max-age=63072000; includeSubDomains; preload
                        </code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Preloaded domains cannot be un-preloaded quickly; an expired/misconfigured
                        certificate bricks access for the full max-age. Roll out max-age
                        incrementally first.
                      </td>
                      <td className='py-3 align-top'>
                        <code className='text-slate-100'>curl -sI</code> on the apex and one
                        subdomain
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Content-Security-Policy</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>strict policy (section above)</td>
                      <td className='py-3 pr-4 align-top'>
                        Inline scripts, <code className='text-slate-100'>eval()</code>, and
                        third-party widgets break. Use Report-Only first.
                      </td>
                      <td className='py-3 align-top'>Browser console; report-uri endpoint</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>X-Content-Type-Options</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>nosniff</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Responses whose Content-Type does not match their body stop rendering —
                        which is the point.
                      </td>
                      <td className='py-3 align-top'>
                        <code className='text-slate-100'>curl -sI</code> on HTML, JS, CSS, images
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Referrer-Policy</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>strict-origin-when-cross-origin</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Cross-origin referrer analytics lose the full path (see only origin).
                      </td>
                      <td className='py-3 align-top'>
                        <code className='text-slate-100'>curl -sI</code>
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>X-Frame-Options</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>DENY</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Legitimate embedding of your pages in third-party frames. If embedding is a
                        requirement, use CSP <code className='text-slate-100'>frame-ancestors</code>{' '}
                        with an explicit allowlist instead.
                      </td>
                      <td className='py-3 align-top'>
                        <code className='text-slate-100'>curl -sI</code>
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Permissions-Policy</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>
                          camera=(), microphone=(), geolocation=(), payment=(), usb=()
                        </code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Disabled features fail with a clear permission error. Rarely breaks anything
                        real.
                      </td>
                      <td className='py-3 align-top'>
                        <code className='text-slate-100'>curl -sI</code>
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Cross-Origin-Opener-Policy</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>same-origin</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Popup flows that rely on{' '}
                        <code className='text-slate-100'>window.opener</code> (some OAuth popups,
                        SSO windows) break — the cross-origin popup gets a null opener. Use{' '}
                        <code className='text-slate-100'>same-origin-allow-popups</code> if needed.
                      </td>
                      <td className='py-3 align-top'>Functional test of every popup flow</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Cross-Origin-Resource-Policy</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>same-site</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Cross-origin sites can no longer embed your resources (images, fonts, JSON)
                        without an explicit CORP/CORS opt-in.
                      </td>
                      <td className='py-3 align-top'>Functional test of embedded resources</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Cross-Origin-Embedder-Policy</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>require-corp</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Every cross-origin subresource without CORP/CORS headers fails to load. Only
                        for apps that control all resources.
                      </td>
                      <td className='py-3 align-top'>Full-page functional pass; network tab</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Cache-Control</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>no-store</code> on sensitive responses
                      </td>
                      <td className='py-3 pr-4 align-top'>Slower repeat loads for those URLs.</td>
                      <td className='py-3 align-top'>
                        <code className='text-slate-100'>curl -sI</code> on authenticated routes
                      </td>
                    </tr>
                    <tr>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Set-Cookie</code> flags
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>Secure; HttpOnly; SameSite=Lax</code>
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>SameSite=Strict</code> drops cookies on
                        cross-site navigations (broken deep links from other sites).
                      </td>
                      <td className='py-3 align-top'>Login flow + cross-site navigation test</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Configuration examples (real values)
              </h2>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Cloudflare Pages / Workers Static Assets — _headers file
              </h3>
              <p className='leading-relaxed mb-4'>
                Both Cloudflare Pages and Workers Static Assets support a plain-text{' '}
                <code className='text-slate-100'>_headers</code> file in the assets directory
                (Cloudflare docs). Rules are a path followed by indented header lines; this is the
                file we deploy with proksiabel.ee:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# pub/_headers — shipped next to the built assets
/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-site

# binary artifacts must download, never render inline
/full_exploit_final_v2_release.zip
  Content-Disposition: attachment
  Content-Type: application/octet-stream`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Note the trade-off on{' '}
                <code className='text-slate-100'>style-src &apos;unsafe-inline&apos;</code>:
                framework-rendered <code className='text-slate-100'>style=&quot;...&quot;</code>{' '}
                attributes are inline styles, so a fully strict style policy breaks this site before
                it hardens anything. The scripts stay strict:{' '}
                <code className='text-slate-100'>script-src &apos;self&apos;</code> — the Vite build
                emits only external, hashed module scripts, so no inline-script allowance is needed.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Nginx</h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`server {
  listen 443 ssl;
  # ... certs, root, etc ...

  # 'always' sends the header on error pages too (4xx/5xx)
  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
  add_header Content-Security-Policy "default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header X-Frame-Options "DENY" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()" always;
  add_header Cross-Origin-Opener-Policy "same-origin" always;
  add_header Cross-Origin-Resource-Policy "same-site" always;

  server_tokens off;   # drop the version from the Server header
}`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Nginx gotcha: <code className='text-slate-100'>add_header</code> directives are not
                inherited by a child block that declares its own{' '}
                <code className='text-slate-100'>add_header</code>. If a{' '}
                <code className='text-slate-100'>location</code> block adds any header of its own,
                re-declare the security headers there or the child response loses them.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Caddy</h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`example.com {
  header {
    Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Content-Security-Policy "default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
    X-Content-Type-Options "nosniff"
    Referrer-Policy "strict-origin-when-cross-origin"
    X-Frame-Options "DENY"
    Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
    Cross-Origin-Opener-Policy "same-origin"
    Cross-Origin-Resource-Policy "same-site"
    -Server
  }
}`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Express (Node.js) — helmet</h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`import helmet from 'helmet';

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:'],
        'font-src': ["'self'"],
        'connect-src': ["'self'"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'frame-ancestors': ["'none'"],
        'form-action': ["'self'"],
      },
    },
    hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-site' },
    permissionsPolicy: {
      features: { camera: [], microphone: [], geolocation: [], payment: [], usb: [] },
    },
  })
);`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                GitHub Pages: cannot set custom headers
              </h3>
              <p className='leading-relaxed'>
                GitHub Pages does not support custom response headers (long-standing platform
                limitation, tracked in GitHub community discussions). A Pages-hosted site cannot
                ship CSP, HSTS, or any of the headers above from the platform itself. If security
                headers are a requirement — and for a security consultancy they are — the hosting
                layer must be one that supports them (Cloudflare Pages/Workers, an origin server, a
                CDN transform rule). This is a platform decision, not a config detail.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Verification</h2>
              <p className='leading-relaxed mb-4'>
                Every header is verifiable with one curl command. The expected output for a hardened
                site:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`$ curl -sI https://example.com/ | grep -iE 'strict-transport|content-security|x-content-type|referrer-policy|x-frame-options|permissions-policy|cross-origin'
strict-transport-security: max-age=63072000; includeSubDomains; preload
content-security-policy: default-src 'self'; script-src 'self'; ...
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
x-frame-options: DENY
permissions-policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-site`}
              </pre>
              <p className='leading-relaxed mb-4'>
                For a CI gate, fail the build when a required header is missing:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`#!/usr/bin/env bash
# verify-headers.sh <url> — exits 1 if any required header is missing
set -euo pipefail
url="\${1:?usage: $0 <url>}"
required=(strict-transport-security content-security-policy x-content-type-options referrer-policy)
for h in "\${required[@]}"; do
  if ! curl -sI "$url" | grep -qi "^$h:"; then
    echo "MISSING: $h" >&2
    exit 1
  fi
done
echo "OK: all required security headers present"`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Run it in CI against a staging deploy (or{' '}
                <code className='text-slate-100'>vite preview</code> locally) before every release.
                Note that curl against a CDN shows the CDN&apos;s edge headers; test with and
                without <code className='text-slate-100'>?cache-bust=</code> to catch cached
                responses that predate the header change.
              </p>
              <p className='leading-relaxed mb-4'>
                Online checkers worth running at least once per release:{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://securityheaders.com/'
                  rel='noopener noreferrer'
                >
                  securityheaders.com
                </a>{' '}
                (grades your header set) and the{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://developer.mozilla.org/en-US/observatory'
                  rel='noopener noreferrer'
                >
                  MDN HTTP Observatory
                </a>{' '}
                (the successor to the retired Mozilla Observatory; the old JSON API was shut down
                October 31, 2024). Both only scan what they can reach — they complement, not
                replace, the curl check.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Worked example: auditing proksiabel.ee
              </h2>
              <p className='leading-relaxed mb-4'>
                While writing this guide we ran the verification against our own site (2026-08-27).
                The live origin is currently GitHub Pages, and the security-relevant headers it
                ships are:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`$ curl -sI https://proksiabel.ee/ | grep -iE 'server:|access-control|content-security|strict-transport|x-content-type|referrer-policy|x-frame-options|permissions-policy'
server: GitHub.com
access-control-allow-origin: *`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Result: <strong className='text-sky-400'>zero security headers</strong> and a{' '}
                <code className='text-slate-100'>Access-Control-Allow-Origin: *</code> on an HTML
                page (harmless for static HTML, but the kind of default that quietly becomes a
                problem when an API endpoint is added later). CSP, HSTS, nosniff, Referrer-Policy,
                X-Frame-Options, Permissions-Policy — all absent, because GitHub Pages cannot set
                them. The fix is the <code className='text-slate-100'>_headers</code> file above
                deployed to the Cloudflare origin, after which the check returns the full hardened
                set. Auditing your own site first is the honest way to write this checklist — and
                the reason this guide ships with verification commands instead of vibes.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Rollout order</h2>
              <ol className='list-decimal list-inside space-y-2 mb-6'>
                <li>
                  Baseline: run the curl check and securityheaders.com against every route type
                  (HTML, API, static assets). Record what is missing.
                </li>
                <li>
                  HSTS first, incrementally: <code className='text-slate-100'>max-age=300</code> →{' '}
                  <code className='text-slate-100'>86400</code> →{' '}
                  <code className='text-slate-100'>63072000</code>, then add{' '}
                  <code className='text-slate-100'>includeSubDomains</code>, and only after all
                  subdomains provably serve HTTPS, submit for preload.
                </li>
                <li>CSP in Report-Only for at least one release cycle; fix violations; enforce.</li>
                <li>
                  Static headers (nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy,
                  COOP, CORP) in one change; verify every route and the SPA fallback path.
                </li>
                <li>Add the CI gate so a missing P0 header fails the build from now on.</li>
              </ol>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Key takeaways</h2>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  Security headers are browser-enforced policy — they stop whole attack classes
                  (clickjacking, MIME confusion, referrer leakage, most XSS) in the user&apos;s
                  browser, independent of your application code.
                </li>
                <li>
                  P0 is six headers: HSTS, CSP, nosniff, Referrer-Policy, X-Frame-Options,
                  Content-Type-with-charset — plus stripping Server/X-Powered-By. Everything else is
                  P1/P2 with real trade-offs (OWASP, ASVS 14.4).
                </li>
                <li>
                  CSP is the only header that routinely breaks things. Ship it Report-Only first,
                  use nonces/hashes instead of <code>&apos;unsafe-inline&apos;</code> for scripts,
                  and keep <code>object-src &apos;none'</code> and <code>base-uri &apos;self'</code>{' '}
                  in every policy.
                </li>
                <li>
                  Do not set X-XSS-Protection (it can create XSS) or Expect-CT (deprecated). Scanner
                  pressure is not a reason to ship a dangerous legacy header.
                </li>
                <li>
                  Verification is one curl per header — and a CI gate that fails the build on a
                  missing P0 header. If your hosting platform cannot set headers (GitHub Pages),
                  change the platform; it is a hard requirement, not a nice-to-have.
                </li>
              </ul>
            </section>

            <section className='mb-10 border-t border-slate-800 pt-8'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Kokkuvõte eesti keeles</h2>
              <p className='leading-relaxed mb-4'>
                HTTP turvapäised (ingl k <em>security headers</em>) on odavaim ja kiireim
                tugevdamine, mida veebirakendusele lisada: brauser loeb vastuse päiseid ja piirab
                vastavalt lehe käitumist. Kohustuslikud (P0):{' '}
                <code className='text-slate-100'>Strict-Transport-Security</code> (RFC 6797,
                soovitus{' '}
                <code className='text-slate-100'>max-age=63072000; includeSubDomains; preload</code>
                ), <code className='text-slate-100'>Content-Security-Policy</code> (XSS-i vastu;
                kõige keerulisem päis — esmalt Report-Only režiimis, mitte kunagi{' '}
                <code className='text-slate-100'>&apos;unsafe-inline&apos;</code> skriptidele),{' '}
                <code className='text-slate-100'>X-Content-Type-Options: nosniff</code>,{' '}
                <code className='text-slate-100'>
                  Referrer-Policy: strict-origin-when-cross-origin
                </code>
                , <code className='text-slate-100'>X-Frame-Options: DENY</code> (klikivarguse vastu)
                ja <code className='text-slate-100'>Content-Type</code> koos charset-iga.
                Edasijõudnutele (P1): <code className='text-slate-100'>Permissions-Policy</code>,{' '}
                <code className='text-slate-100'>Cross-Origin-Opener-Policy: same-origin</code>,{' '}
                <code className='text-slate-100'>Cross-Origin-Resource-Policy: same-site</code> ja{' '}
                <code className='text-slate-100'>Cache-Control: no-store</code> tundlikele
                vastustele. Ära pane kunagi <code className='text-slate-100'>X-XSS-Protection</code>{' '}
                ega <code className='text-slate-100'>Expect-CT</code>. Kontrolli iga päist käsuga{' '}
                <code className='text-slate-100'>curl -sI</code> ja lisa CI-sse kontroll, mis
                ehituse ebaõnnestuma paneb, kui mõni P0-päis puudub. Oluline piirang: GitHub Pages
                ei võimalda kohandatud päiseid üldse — siis tuleb hostimisplatvormi vahetada
                (näiteks Cloudflare Pages / Workers static assets, kus päised pannakse{' '}
                <code className='text-slate-100'>_headers</code> failiga). Täielik loend,
                konfiguratsiooninäited (Cloudflare, Nginx, Caddy, Express) ja otsustustabel on ülal
                inglise keeles.
              </p>
            </section>

            <section className='border-t border-slate-800 pt-8'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Sources</h2>
              <ul className='list-disc list-inside space-y-1 text-sm'>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html'
                    rel='noopener noreferrer'
                  >
                    OWASP — HTTP Security Response Headers Cheat Sheet
                  </a>{' '}
                  (recommended values for all headers covered here)
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://owasp.org/www-project-secure-headers/'
                    rel='noopener noreferrer'
                  >
                    OWASP Secure Headers Project
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://github.com/OWASP/ASVS/blob/master/4.0/en/0x22-V14-Config.md'
                    rel='noopener noreferrer'
                  >
                    OWASP ASVS v4.0.3 — V14.4 HTTP Security Headers (14.4.1–14.4.7)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.rfc-editor.org/rfc/rfc6797'
                    rel='noopener noreferrer'
                  >
                    RFC 6797 — HTTP Strict Transport Security (HSTS)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.w3.org/TR/CSP3/'
                    rel='noopener noreferrer'
                  >
                    W3C — Content Security Policy Level 3
                  </a>{' '}
                  and the{' '}
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy'
                    rel='noopener noreferrer'
                  >
                    MDN CSP reference
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP'
                    rel='noopener noreferrer'
                  >
                    MDN — Content Security Policy guide
                  </a>{' '}
                  (nonces, hashes, deployment strategies)
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://hstspreload.org/'
                    rel='noopener noreferrer'
                  >
                    HSTS Preload List — submission requirements
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://developers.cloudflare.com/pages/configuration/headers/'
                    rel='noopener noreferrer'
                  >
                    Cloudflare Pages docs — the _headers file
                  </a>{' '}
                  and{' '}
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://developers.cloudflare.com/workers/static-assets/headers/'
                    rel='noopener noreferrer'
                  >
                    Workers Static Assets docs
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://github.com/orgs/community/discussions/54257'
                    rel='noopener noreferrer'
                  >
                    GitHub Pages — no custom headers (community discussion)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection'
                    rel='noopener noreferrer'
                  >
                    MDN — X-XSS-Protection (why to disable it)
                  </a>{' '}
                  and{' '}
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect-CT'
                    rel='noopener noreferrer'
                  >
                    Expect-CT (deprecated)
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
