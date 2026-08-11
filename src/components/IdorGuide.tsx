import { Helmet } from '@dr.pogodin/react-helmet';

const guideUrl = 'https://proksiabel.ee/guides/idor-explained';

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'IDOR Explained: Insecure Direct Object Reference Attacks and Prevention',
  description:
    "Insecure direct object reference (IDOR) explained: how missing object-level authorization lets authenticated users read, modify, or delete other users' data, with a reproducible local lab, detection rules, and ownership-check fix patterns.",
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

export default function IdorGuide() {
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
            IDOR Explained: Insecure Direct Object Reference Attacks and Prevention
          </h1>
          <p className='text-slate-400 text-lg leading-relaxed mb-10'>
            An insecure direct object reference (IDOR) lets an authenticated user read, modify, or
            delete another user&apos;s data by changing an object identifier in the request. It is
            CWE-639 (Authorization Bypass Through User-Controlled Key), the top category in the
            OWASP Top 10 since 2021 (A01 Broken Access Control), and the #1 API risk as API1:2023
            Broken Object Level Authorization (BOLA). This guide covers the mechanics, a
            reproducible local lab, detection, and ownership-check fix patterns.
          </p>

          <div className='max-w-none text-slate-300'>
            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                What IDOR is and why it keeps mattering
              </h2>
              <p className='leading-relaxed mb-4'>
                IDOR is an <em>authorization</em> failure, not an input-validation failure. The
                application authenticates the user, then trusts a client-supplied object reference
                (a database key, a filename, an invoice number) to decide which record to load —
                without ever checking whether the requester is allowed to touch <em>that</em>{' '}
                record. Authentication answers &quot;who are you?&quot;; the missing check is
                &quot;what may you touch?&quot;. That gap is CWE-639, which MITRE describes as a
                system whose authorization functionality &quot;does not prevent one user from
                gaining access to another user&apos;s data or record by modifying the key value
                identifying the data.&quot;
              </p>
              <p className='leading-relaxed mb-4'>
                The taxonomy has shifted over the years, which confuses reporting. IDOR was a
                standalone entry (A4) in the OWASP Top 10 from 2007 to 2013, then was folded into
                Broken Access Control, which became A01:2021 with 318,487 recorded occurrences and
                19,013 mapped CVEs across 34 CWEs — the most occurrences in the contributed dataset.
                The 2025 edition keeps Broken Access Control at #1: 100% of the applications tested
                were found to have some form of it, with the highest number of occurrences in the
                contributed data. In the API world the same flaw is called Broken Object Level
                Authorization (BOLA) and has held the #1 spot in the OWASP API Security Top 10 since
                2019, rated Easy exploitability, Widespread prevalence, and Easy detectability in
                the 2023 edition.
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Framework</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Entry</th>
                      <th className='py-3 text-slate-100 font-semibold'>Name</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>OWASP Top 10:2021 / 2025</td>
                      <td className='py-3 pr-4 align-top'>A01</td>
                      <td className='py-3 align-top'>
                        Broken Access Control — &quot;permitting viewing or editing someone
                        else&apos;s account, by providing its unique identifier (insecure direct
                        object references)&quot;
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>OWASP API Security Top 10:2023</td>
                      <td className='py-3 pr-4 align-top'>API1</td>
                      <td className='py-3 align-top'>
                        Broken Object Level Authorization (BOLA) — the API-specific framing of IDOR
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>MITRE CWE</td>
                      <td className='py-3 pr-4 align-top'>CWE-639</td>
                      <td className='py-3 align-top'>
                        Authorization Bypass Through User-Controlled Key (in the CWE Top 25); parent
                        CWE-284, child CWE-566 for SQL-key variants
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className='leading-relaxed mb-4'>
                Two real-world data points show the blast radius:
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Incident</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>IDOR role</th>
                      <th className='py-3 text-slate-100 font-semibold'>Outcome</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>First American Financial, 2019</td>
                      <td className='py-3 pr-4 align-top'>
                        Document-sharing URLs exposed sequential internal identifiers; changing a
                        number in the URL returned documents belonging to other customers.
                      </td>
                      <td className='py-3 align-top'>
                        More than 800 million documents exposed, including Social Security numbers
                        and bank account details.
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>CVE-2025-41096, BOLD Workplanner</td>
                      <td className='py-3 pr-4 align-top'>
                        &quot;Insecure Direct Object Reference (IDOR) vulnerability ... consisting
                        of a lack of adequate validation of user input, allowing an authenticated
                        user to access ... contract details using unauthorised internal
                        identifiers.&quot;
                      </td>
                      <td className='py-3 align-top'>
                        CWE-639, CVSS-B 7.1 (HIGH) as assessed by INCIBE; fixed in version 2.5.25.
                        Proof that plain IDOR findings still ship in commercial products.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className='leading-relaxed'>
                In MITRE ATT&amp;CK terms, IDOR exploitation is the mechanism behind T1213 (Data
                from Information Repositories) and, when credentials or tokens are exposed through
                it, feeds T1078 (Valid Accounts). The horizontal variant (one user reading a
                peer&apos;s data) is the most common; the vertical variant (reaching an
                admin-controlled object) escalates into privilege escalation.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Attack anatomy: the request is valid, the authorization is missing
              </h2>
              <p className='leading-relaxed mb-4'>
                The OWASP Top 10&apos;s canonical example is the account lookup: the application
                uses an unverified parameter directly in a query, and the attacker simply changes
                the value.
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`GET /app/accountInfo?acct=notmyacct HTTP/1.1
Cookie: session=<alice's session>`}
              </pre>
              <p className='leading-relaxed mb-4'>
                The request is fully legitimate: authenticated, well-formed, and routed to the right
                endpoint. The flaw is that the endpoint resolves <em>whatever</em> object the
                <code className='text-slate-100'> acct</code> parameter names instead of an object
                the caller is allowed to see. The same primitive appears in every place an object
                reference crosses the trust boundary:
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Attack surface</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Example</th>
                      <th className='py-3 text-slate-100 font-semibold'>Reference type</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>URL path parameter</td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>/api/invoices/1042</code> changed to{' '}
                        <code className='text-slate-100'>/api/invoices/1043</code>
                      </td>
                      <td className='py-3 align-top'>Sequential database key</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Query string parameter</td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>?order_id=7001</code> changed to{' '}
                        <code className='text-slate-100'>?order_id=7002</code>
                      </td>
                      <td className='py-3 align-top'>Sequential database key</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Static file reference</td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>/static/12144.txt</code> — chat transcripts
                        stored with incrementing filenames
                      </td>
                      <td className='py-3 align-top'>Filename</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>POST body / hidden field</td>
                      <td className='py-3 pr-4 align-top'>
                        <code className='text-slate-100'>user_id</code> in a form submission changed
                        to another user&apos;s ID
                      </td>
                      <td className='py-3 align-top'>Primary key or UUID</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className='leading-relaxed mb-4'>
                OWASP&apos;s API Top 10 is explicit that the identifier&apos;s data type does not
                matter: &quot;Object IDs can be anything from sequential integers, UUIDs, or generic
                strings. Regardless of the data type, they are easy to identify in the request
                target (path or query string parameters), request headers, or even as part of the
                request payload.&quot; Once one reference is confirmed controllable, exploitation
                scales by enumeration — a script iterating candidate IDs turns a single missing
                check into a mass exfiltration, which is exactly what happened at First American.
              </p>
              <p className='leading-relaxed'>
                IDOR is not the same as Broken Function Level Authorization (BFLA, API5:2023). In
                BOLA the user is <em>allowed</em> to call the endpoint; the violation is at the
                object level. In BFLA the user calls a function (an admin endpoint) they should not
                be able to reach at all.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Reproducible local lab</h2>
              <p className='leading-relaxed mb-4'>
                Everything below runs against a single local container on your machine — no live
                targets, no weaponized payloads. The lab is a Flask document API with two users
                (alice, bob) and four documents, deliberately missing the ownership check in the
                read and delete handlers.
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
COPY app.py .
EXPOSE 8080
CMD ["python", "app.py"]`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                app.py — document API with missing object-level authorization
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`from functools import wraps

from flask import Flask, jsonify, request, session

app = Flask(__name__)
app.secret_key = "lab-secret-key"

# Deterministic seed data. owner is the username.
USERS = {
    "alice": {"password": "alice-pass"},
    "bob": {"password": "bob-pass"},
}

DOCS = [
    {"id": 1, "owner": "alice", "title": "alice-vacation-plan", "body": "alice-private-1"},
    {"id": 2, "owner": "alice", "title": "alice-tax-notes", "body": "alice-private-2"},
    {"id": 3, "owner": "bob", "title": "bob-bank-export", "body": "bob-private-3"},
    {"id": 4, "owner": "bob", "title": "bob-contract-draft", "body": "bob-private-4"},
]


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if "username" not in session:
            return jsonify({"error": "authentication required"}), 401
        return f(*args, **kwargs)

    return wrapper


@app.post("/login")
def login():
    data = request.get_json(force=True)
    user = USERS.get(data.get("username", ""))
    if not user or user["password"] != data.get("password"):
        return jsonify({"error": "bad credentials"}), 401
    session["username"] = data["username"]
    return jsonify({"logged_in_as": data["username"]})


@app.get("/api/documents")
@login_required
def list_documents():
    mine = [d for d in DOCS if d["owner"] == session["username"]]
    return jsonify(mine)


# --- VULNERABLE: no ownership check (CWE-639) -------------------------------
@app.get("/api/documents/<int:doc_id>")
@login_required
def get_document(doc_id):
    doc = next((d for d in DOCS if d["id"] == doc_id), None)
    if doc is None:
        return jsonify({"error": "not found"}), 404
    return jsonify(doc)


@app.delete("/api/documents/<int:doc_id>")
@login_required
def delete_document(doc_id):
    for i, d in enumerate(DOCS):
        if d["id"] == doc_id:
            DOCS.pop(i)
            return jsonify({"deleted": doc_id})
    return jsonify({"error": "not found"}), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Run it and exploit it</h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`docker compose up --build`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Log in as alice, then ask for document 3 — which belongs to bob:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`$ curl -s -c jar.txt -H 'Content-Type: application/json' \\
    -d '{"username":"alice","password":"alice-pass"}' http://localhost:8080/login
{"logged_in_as":"alice"}

$ curl -s -b jar.txt http://localhost:8080/api/documents/3
{"body":"bob-private-3","id":3,"owner":"bob","title":"bob-bank-export"}`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Alice just read Bob&apos;s bank export. The read variant is the classic
                information-disclosure IDOR. The write variant is worse — the same missing check
                lets alice <em>delete</em> Bob&apos;s documents:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`$ curl -s -b jar.txt -X DELETE http://localhost:8080/api/documents/3
{"deleted":3}`}
              </pre>
              <p className='leading-relaxed mb-4'>
                And because the IDs are sequential, a three-line loop converts the single finding
                into full enumeration — the First American pattern in miniature:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`$ for i in 1 2 3 4; do curl -s -b jar.txt http://localhost:8080/api/documents/$i; echo; done
{"body":"alice-private-1","id":1,"owner":"alice","title":"alice-vacation-plan"}
{"body":"alice-private-2","id":2,"owner":"alice","title":"alice-tax-notes"}
{"body":"bob-private-3","id":3,"owner":"bob","title":"bob-bank-export"}
{"body":"bob-private-4","id":4,"owner":"bob","title":"bob-contract-draft"}`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                The fix: scope the query to the authenticated user
              </h3>
              <p className='leading-relaxed mb-4'>
                The same two handlers, fixed by adding the session owner to the lookup predicate —
                the &quot;unscoped query vs scoped query&quot; pattern from the OWASP reference
                material ( <code className='text-slate-100'>Document.find(id)</code> becomes{' '}
                <code className='text-slate-100'>current_user.documents.find(id)</code>):
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`def owned_doc(doc_id):
    """Return the doc only if it belongs to the session user.

    Missing and not-owned both return None, so callers respond 404 either
    way — no existence oracle for the enumerator.
    """
    return next(
        (d for d in DOCS if d["id"] == doc_id and d["owner"] == session["username"]),
        None,
    )


@app.get("/api/documents/<int:doc_id>")
@login_required
def get_document(doc_id):
    doc = owned_doc(doc_id)
    if doc is None:
        return jsonify({"error": "not found"}), 404
    return jsonify(doc)


@app.delete("/api/documents/<int:doc_id>")
@login_required
def delete_document(doc_id):
    doc = owned_doc(doc_id)
    if doc is None:
        return jsonify({"error": "not found"}), 404
    DOCS.remove(doc)
    return jsonify({"deleted": doc_id})`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Re-running the walkthrough now returns 404 for document 3 while alice is logged in —
                the same status code a missing document returns, so the attacker cannot even
                distinguish &quot;exists but not yours&quot; from &quot;does not exist&quot;:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`$ curl -s -b jar.txt http://localhost:8080/api/documents/3
{"error":"not found"}`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                What does not work (and why that teaches you more)
              </h3>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  <strong className='text-sky-400'>
                    Comparing the session user id with the ID parameter.
                  </strong>{' '}
                  OWASP&apos;s API Top 10 is blunt: &quot;Comparing the user ID of the current
                  session (e.g. by extracting it from the JWT token) with the vulnerable ID
                  parameter isn&apos;t a sufficient solution to solve Broken Object Level
                  Authorization.&quot; The object&apos;s <em>owner</em> is the thing to check, not
                  whether the client says the IDs match — a check comparing two client-influenced
                  values proves nothing.
                </li>
                <li>
                  <strong className='text-sky-400'>Switching to UUIDs.</strong> OWASP recommends
                  random GUIDs for record IDs, but as a mitigation, not a control: an unpredictable
                  identifier raises the enumeration bar, yet the reference still travels in every
                  request and leaks through shared links, caches, and logs. Possession of the ID
                  must never be treated as authorization. The lab&apos;s vulnerability survives a
                  UUID swap unchanged — only the loop&apos;s range changes.
                </li>
                <li>
                  <strong className='text-sky-400'>Hiding the check client-side.</strong> ASVS 4.0.3
                  V4.1.1 requires access-control rules to be enforced &quot;on a trusted service
                  layer&quot; — JavaScript can hide an admin button, but the API behind it is one
                  curl away.
                </li>
                <li>
                  <strong className='text-sky-400'>Rate limiting alone.</strong> OWASP lists rate
                  limits as a way to &quot;minimize the harm from automated attack tooling&quot; —
                  they slow enumeration, they do not fix the missing check. Rate limiting an
                  unauthenticated-by-design data endpoint just caps the bleed rate.
                </li>
              </ul>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Detecting IDOR</h2>
              <p className='leading-relaxed mb-4'>
                Unlike SQL injection or SSRF, IDOR has <em>no network signature</em>: every request
                is individually valid and well-formed; the failure is in the authorization decision
                behind it. Detection is therefore testing-first (dynamic + static), with log
                analytics as the runtime backstop.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Dynamic: the two-account replay (Autorize-style)
              </h3>
              <p className='leading-relaxed mb-4'>
                The reference method (PortSwigger&apos;s authorization-testing methodology) needs
                two accounts. Register users A and B. Configure an interception tool (Burp Autorize,
                AuthMatrix, or a simple proxy script) to replay every request made as A with
                B&apos;s session cookie; any response that is not the baseline denial (401/403) is a
                candidate. Then do the reverse direction, and then the manual variant: as A, request
                B&apos;s objects directly by swapping the identifier in the path, query string,
                body, and headers. Test every verb — GET, PUT, PATCH, DELETE — because the read
                check and the write check are often implemented separately (the lab above shows a
                read-only tester would miss the destructive delete).
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Static: a Semgrep taint rule as a starting point
              </h3>
              <p className='leading-relaxed mb-4'>
                SAST catches the mechanical variant: request-derived values flowing into primary-key
                lookups with no ownership filter. This is a template — adjust the model and route
                conventions to your codebase, and treat its findings as review candidates, not
                proof:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# semgrep --config bola.yml  (template — adapt to your ORM/routes)
rules:
  - id: flask-bola-unscoped-lookup
    mode: taint
    pattern-sources:
      - pattern: request.args
      - pattern: request.view_args
    pattern-sinks:
      - pattern: $MODEL.query.get($ARG)
      - pattern: $MODEL.query.get_or_404($ARG)
      - pattern: $MODEL.query.first()
    message: >-
      Object lookup keyed on request input without an ownership filter —
      likely BOLA/IDOR (CWE-639). Scope the query to the current user.
    languages: [python]
    severity: WARNING`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Runtime: enumeration analytics
              </h3>
              <p className='leading-relaxed mb-4'>
                OWASP&apos;s A01 prevention guidance includes &quot;log access control failures,
                alert admins when appropriate (e.g., repeated failures)&quot;. In practice, look for
                the enumeration pattern in access logs: a single session issuing many distinct
                object IDs in a short window, especially with a mix of 200 and 404 responses on the
                same endpoint, or a sudden rise in 403/404 volume per user. This catches the
                post-exploitation sweep; it cannot catch the single-ID probe.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>How to prevent IDOR</h2>
              <p className='leading-relaxed mb-4'>
                Prevention is an architecture rule, not a per-endpoint scramble: object-level
                authorization on the trusted service layer, scoped queries everywhere, and tests
                that prove cross-user access fails. The OWASP API Top 10&apos;s prevention list is
                short and exact — implement a proper authorization mechanism that relies on user
                policies and hierarchy; check, in every function that uses client input to access a
                record, that the logged-in user may perform the requested action on that record;
                prefer random unpredictable GUIDs; and write tests that fail on any change breaking
                the authorization mechanism.
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Layer</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Control</th>
                      <th className='py-3 text-slate-100 font-semibold'>Reference</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Design</td>
                      <td className='py-3 pr-4 align-top'>
                        Deny by default; authorization on a trusted service layer, never client-side
                      </td>
                      <td className='py-3 align-top'>OWASP A01:2021/2025; ASVS 4.0.3 V4.1.1</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Data</td>
                      <td className='py-3 pr-4 align-top'>
                        Attributes used by access controls cannot be manipulated by end users
                      </td>
                      <td className='py-3 align-top'>ASVS 4.0.3 V4.1.2 (CWE-639)</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Query layer</td>
                      <td className='py-3 pr-4 align-top'>
                        Scope every lookup to the current user (ownership predicate in the query,
                        not a post-fetch comparison)
                      </td>
                      <td className='py-3 align-top'>OWASP IDOR reference; this lab</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Response</td>
                      <td className='py-3 pr-4 align-top'>
                        Identical response for missing and not-owned objects (no existence oracle)
                      </td>
                      <td className='py-3 align-top'>Common testing methodology</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Identifiers</td>
                      <td className='py-3 pr-4 align-top'>
                        Random unpredictable IDs (GUIDs) as defense-in-depth — never as the control
                      </td>
                      <td className='py-3 align-top'>OWASP API1:2023</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>CI</td>
                      <td className='py-3 pr-4 align-top'>
                        Functional authorization tests (two-account, all verbs) that fail the build
                      </td>
                      <td className='py-3 align-top'>OWASP API1:2023; OWASP A01:2021</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Runtime</td>
                      <td className='py-3 pr-4 align-top'>
                        Log access-control failures; alert on enumeration patterns; rate limits to
                        slow automated tooling
                      </td>
                      <td className='py-3 align-top'>OWASP A01:2021</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Node.js (Express + MongoDB) — scoped findOne
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`// insecure: unscoped lookup
const doc = await db.collection('documents').findOne({
  _id: ObjectId(req.params.id),
});

// fixed: ownership predicate in the query, same 404 for both outcomes
const doc = await db.collection('documents').findOne({
  _id: ObjectId(req.params.id),
  ownerId: req.user.id, // from the verified session, never from the request
});
if (!doc) return res.status(404).json({ error: 'not found' });`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Go (GORM-style) — where clause with the caller&apos;s id
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`// insecure
var doc Document
db.First(&doc, "id = ?", c.Param("id"))

// fixed: scope to the authenticated user (currentUser from the session)
var doc Document
err := db.Where("id = ? AND owner_id = ?", c.Param("id"), currentUser.ID).First(&doc).Error
if errors.Is(err, gorm.ErrRecordNotFound) {
    c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
    return
}`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                A test that would have caught the lab bug
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`def test_cross_user_read_is_denied(client):
    client.post("/login", json={"username": "alice", "password": "alice-pass"})
    # document 3 belongs to bob — alice must never receive it
    resp = client.get("/api/documents/3")
    assert resp.status_code == 404


def test_cross_user_delete_is_denied(client):
    client.post("/login", json={"username": "alice", "password": "alice-pass"})
    resp = client.delete("/api/documents/3")
    assert resp.status_code == 404`}
              </pre>
              <p className='leading-relaxed'>
                The two tests encode the two most-missed directions: reads (information disclosure)
                and destructive writes. Run them as a normal authenticated user — a suite that only
                tests the admin role, or only tests with a user who owns everything, will pass on a
                broken authorization mechanism.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Prevention checklist</h2>
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
                        Every handler taking an object reference enforces ownership on the trusted
                        service layer
                      </td>
                      <td className='py-3 align-top'>
                        Code review: enumerate handlers with path/query IDs; confirm each scopes to
                        the session principal
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>No unscoped lookups in the codebase</td>
                      <td className='py-3 align-top'>
                        Semgrep taint rule in CI; grep for bare{' '}
                        <code className='text-slate-100'>.get(</code>/
                        <code className='text-slate-100'>findOne(</code> calls fed from request data
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        Cross-user read and write denied, same response for missing vs not-owned
                      </td>
                      <td className='py-3 align-top'>
                        Two-account integration test on every authenticated endpoint, all verbs
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        Object references not attacker-influenceable beyond the object id
                      </td>
                      <td className='py-3 align-top'>
                        Review request bodies and headers for owner/role fields the client can set
                        (ASVS 4.1.2)
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        Random unpredictable IDs where feasible, never relied on as the control
                      </td>
                      <td className='py-3 align-top'>
                        Schema review: sequential PKs exposed in URLs/APIs replaced by GUIDs
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        Access-control failures logged, enumeration alerting configured
                      </td>
                      <td className='py-3 align-top'>
                        Trigger a probe in staging; confirm the log line and alert fire
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        Rate limits on authenticated API endpoints
                      </td>
                      <td className='py-3 align-top'>
                        Load-test an endpoint; confirm the 429 threshold
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
                  IDOR is missing <em>object-level authorization</em> — the request is valid,
                  authenticated, and well-formed; the object it names is simply not checked against
                  the caller&apos;s rights (CWE-639).
                </li>
                <li>
                  It is the top OWASP category (A01 since 2021, 2025 included) and the #1 API risk
                  (API1:2023 BOLA), and it ships in real products today (CVE-2025-41096).
                </li>
                <li>
                  The fix is one line per handler — scope the query to the session principal — but
                  only counts when applied to <em>every</em> endpoint, on the trusted service layer,
                  for reads and writes alike.
                </li>
                <li>UUIDs slow enumeration; they do not authorize. The check is the control.</li>
                <li>
                  IDOR has no network signature: detect it with two-account dynamic testing, SAST
                  taint rules, and enumeration-aware log monitoring.
                </li>
              </ul>
            </section>

            <section className='mb-10 border-t border-slate-800 pt-8'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Kokkuvõte eesti keeles</h2>
              <p className='leading-relaxed mb-4'>
                IDOR (ingl k <em>Insecure Direct Object Reference</em>) on juurdepääsukontrolli
                nõrkus, kus rakendus laeb objekti (näiteks dokumendi või arve) kasutaja antud
                identifikaatori järgi, kontrollimata, kas see objekt kuulub just sellele kasutajale.
                Nii saab sisselogitud kasutaja teise kasutaja andmeid lugeda, muuta või kustutada —
                piisab numbri muutmisest URL-is. See on CWE-639, OWASP Top 10 esimene kategooria
                (A01 Broken Access Control) alates 2021. aastast ja API-de puhul API1:2023 Broken
                Object Level Authorization (BOLA). Parandus: iga päring, mis kasutab kliendi
                sisendit objekti otsimiseks, peab otsingu kitsendama sisselogitud kasutajaga
                (näiteks <code className='text-slate-100'>owner == session.user</code>), ning
                puuduva ja võõra objekti puhul tuleb vastata ühtemoodi (404). UUID-d muudavad
                loendamise raskemaks, kuid ei asenda kontrolli. Täielik laborikäik ja koodinäited on
                ülal inglise keeles.
              </p>
            </section>

            <section className='mb-10 border-t border-slate-800 pt-8'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Sources</h2>
              <ul className='list-disc list-inside space-y-1 text-sm'>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://owasp.org/Top10/2021/A01_2021-Broken_Access_Control/'
                  >
                    OWASP Top 10:2021 — A01 Broken Access Control
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/'
                  >
                    OWASP Top 10:2025 — A01 Broken Access Control
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/'
                  >
                    OWASP API Security Top 10:2023 — API1 Broken Object Level Authorization
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cwe.mitre.org/data/definitions/639.html'
                  >
                    CWE-639 — Authorization Bypass Through User-Controlled Key
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://owasp.org/www-community/attacks/insecure_direct_object_reference'
                  >
                    OWASP — Insecure Direct Object Reference (attack description)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://portswigger.net/web-security/access-control/idor'
                  >
                    PortSwigger Web Security Academy — Insecure direct object references (IDOR)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://portswigger.net/web-security/access-control'
                  >
                    PortSwigger Web Security Academy — Access control (authorization testing
                    methodology)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://raw.githubusercontent.com/OWASP/ASVS/v4.0.3/4.0/OWASP%20Application%20Security%20Verification%20Standard%204.0.3-en.pdf'
                  >
                    OWASP ASVS 4.0.3 — V4.1 Access Control (4.1.1, 4.1.2)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2025-41096'
                  >
                    NVD — CVE-2025-41096 (BOLD Workplanner IDOR)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.sentinelone.com/cybersecurity-101/cybersecurity/insecure-direct-object-reference/'
                  >
                    SentinelOne — What Is Insecure Direct Object Reference (IDOR)? (First American
                    2019)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://attack.mitre.org/techniques/T1213/'
                  >
                    MITRE ATT&amp;CK T1213 — Data from Information Repositories
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
