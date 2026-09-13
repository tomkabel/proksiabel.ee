import { Helmet } from '@dr.pogodin/react-helmet';

const guideUrl = 'https://proksiabel.ee/guides/sqli-explained';

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'SQL Injection Explained: Attack Examples & Prevention',
  description:
    'SQL injection (CWE-89) explained: how string concatenation lets attackers rewrite queries, classic and blind attack classes, real CVEs including Metabase CVE-2026-72898 (CVSS 10.0), a reproducible docker-compose lab, detection rules, and parameterized-query fix patterns.',
  datePublished: '2026-09-13',
  dateModified: '2026-09-13',
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
 * Technical guide component explaining SQL injection (SQLi) vulnerabilities:
 * attack anatomy, blind and second-order variants, real-world CVEs, a
 * reproducible docker-compose lab, detection rules (Semgrep + Suricata),
 * and per-language fix patterns.
 */
export default function SqliGuide() {
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
            SQL Injection Explained: Attack Examples &amp; Prevention
          </h1>
          <p className='text-slate-400 text-lg leading-relaxed mb-10'>
            SQL injection lets an attacker turn user input into executable SQL commands. It is
            CWE-89 — Improper Neutralization of Special Elements used in an SQL Command — and has
            been the top entry in the CWE Top 25 for years. This guide covers the mechanics, a
            reproducible local lab, blind and out-of-band attack classes, detection rules, and
            parameterized-query fix patterns.
          </p>

          <div className='max-w-none text-slate-300'>
            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                What SQL injection is and why it keeps mattering
              </h2>
              <p className='leading-relaxed mb-4'>
                SQL injection occurs when an application builds a SQL query by concatenating or
                interpolating user-supplied input into the query string. The attacker&apos;s input
                changes the query&apos;s syntactic structure — a fragment that was intended as a
                string literal value instead becomes part of the SQL command. The web server sends
                the manipulated query to the database, which executes the attacker&apos;s logic with
                the application&apos;s database privileges.
              </p>
              <p className='leading-relaxed mb-4'>
                CWE-89 consistently ranks #1 in the{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://cwe.mitre.org/top25/'
                  rel='noopener noreferrer'
                >
                  CWE Top 25
                </a>{' '}
                most dangerous software weaknesses. OWASP maps SQL injection to{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://owasp.org/Top10/A03_2021-Injection/'
                  rel='noopener noreferrer'
                >
                  A03:2021 Injection
                </a>
                . Despite being one of the best-documented vulnerability classes, SQL injection
                continues to appear in major products — CVE-2026-72898 (Metabase, CVSS 10.0, CISA
                KEV) is a recent unauthenticated SQLi added to the Known Exploited Vulnerabilities
                Catalog in August 2026.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Attack anatomy and query-flow model
              </h2>
              <p className='leading-relaxed mb-4'>
                Every SQL injection follows the same query-flow pattern:
              </p>
              <ol className='list-decimal list-inside space-y-2 mb-4 text-slate-300'>
                <li>The developer writes a query with placeholder insertion points.</li>
                <li>User input is concatenated directly into the SQL string.</li>
                <li>
                  The attacker includes SQL meta-characters (
                  <code className='text-slate-100'>&apos;</code>,{' '}
                  <code className='text-slate-100'>&quot;</code>,{' '}
                  <code className='text-slate-100'>--</code>,{' '}
                  <code className='text-slate-100'>;</code>,{' '}
                  <code className='text-slate-100'>/*</code>) that alter the parsed query structure.
                </li>
                <li>
                  The database executes the attacker&apos;s modified query under the
                  application&apos;s connection privileges.
                </li>
              </ol>
              <p className='leading-relaxed mb-4'>A classic example in Python (Flask):</p>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`# VULNERABLE
username = request.args.get("username")
sql = f"SELECT * FROM users WHERE username = '{username}'"
cursor.execute(sql)`}</code>
              </pre>
              <p className='leading-relaxed mb-4'>
                An attacker sending{' '}
                <code className='text-slate-100'>
                  username=admin&apos; OR &apos;1&apos;=&apos;1
                </code>{' '}
                produces the query:
              </p>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`SELECT * FROM users WHERE username = 'admin' OR '1'='1'`}</code>
              </pre>
              <p className='leading-relaxed mb-4'>
                The <code className='text-slate-100'>OR '1'='1'</code> clause evaluates to true for
                every row, returning all users instead of the intended single user.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                SQL injection attack classes
              </h2>
              <p className='leading-relaxed mb-4'>
                Not all SQL injection attacks look the same. The database response format determines
                which technique the attacker uses.
              </p>

              <div className='overflow-x-auto mb-6'>
                <table className='min-w-full border-collapse border border-slate-700 text-sm'>
                  <thead>
                    <tr className='bg-slate-800'>
                      <th className='border border-slate-700 px-4 py-2 text-sky-400 font-semibold text-left'>
                        Class
                      </th>
                      <th className='border border-slate-700 px-4 py-2 text-sky-400 font-semibold text-left'>
                        Mechanism
                      </th>
                      <th className='border border-slate-700 px-4 py-2 text-sky-400 font-semibold text-left'>
                        Detection signal
                      </th>
                      <th className='border border-slate-700 px-4 py-2 text-sky-400 font-semibold text-left'>
                        Example payload
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='border border-slate-700 px-4 py-2 font-medium text-white'>
                        Classic (in-band)
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Data returned directly in the HTTP response
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Visible column data or error messages in the page
                      </td>
                      <td className='border border-slate-700 px-4 py-2 text-slate-200'>
                        <code className='text-xs'>
                          &apos; UNION SELECT credit_card FROM payments --
                        </code>
                      </td>
                    </tr>
                    <tr>
                      <td className='border border-slate-700 px-4 py-2 font-medium text-white'>
                        Blind — Boolean (content-based)
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Application returns different response (size, status, content) for true vs
                        false conditions
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Response differs between <code className='text-xs'>1=1</code> and{' '}
                        <code className='text-xs'>1=2</code>
                      </td>
                      <td className='border border-slate-700 px-4 py-2 text-slate-200'>
                        <code className='text-xs'>
                          &apos; OR SUBSTRING(password,1,1)=&apos;a&apos; --
                        </code>
                      </td>
                    </tr>
                    <tr>
                      <td className='border border-slate-700 px-4 py-2 font-medium text-white'>
                        Blind — Time-based
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Conditional causes a measurable database delay (e.g.{' '}
                        <code className='text-xs'>SLEEP()</code>, heavy query)
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Response latency varies by condition
                      </td>
                      <td className='border border-slate-700 px-4 py-2 text-slate-200'>
                        <code className='text-xs'>
                          &apos;; IF (1=1) WAITFOR DELAY &apos;0:0:5&apos; --
                        </code>
                      </td>
                    </tr>
                    <tr>
                      <td className='border border-slate-700 px-4 py-2 font-medium text-white'>
                        Out-of-band (OOB)
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Data exfiltrated via a separate channel (DNS, HTTP, SMB) to an
                        attacker-controlled server
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Network logs show outbound connection to external host
                      </td>
                      <td className='border border-slate-700 px-4 py-2 text-slate-200'>
                        <code className='text-xs'>
                          DECLARE @o INT; EXEC sp_oacreate MSXML2.ServerXMLHTTP, @o OUT
                        </code>
                      </td>
                    </tr>
                    <tr>
                      <td className='border border-slate-700 px-4 py-2 font-medium text-white'>
                        Second-order (stored)
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Malicious payload is stored in the database and triggers when later
                        retrieved and used unsafely
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Input validation passes at write; exploit triggers at read in a different
                        code path
                      </td>
                      <td className='border border-slate-700 px-4 py-2 text-slate-200'>
                        Register username{' '}
                        <code className='text-xs'>admin&apos;; DROP TABLE logs; --</code>, then
                        profile page executes it
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Real-world SQL injection incidents
              </h2>
              <p className='leading-relaxed mb-4'>
                These recent and notable incidents demonstrate that SQL injection is not a legacy
                problem:
              </p>
              <ul className='list-disc list-inside space-y-3 mb-4'>
                <li>
                  <strong className='text-sky-400'>
                    CVE-2026-72898 — Metabase (CVSS 10.0, CISA KEV):
                  </strong>{' '}
                  An unauthenticated attacker injects arbitrary SQL via the{' '}
                  <code className='text-slate-100'>/reset_password</code> endpoint to gain
                  administrator access. CISA confirmed active exploitation.{' '}
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2026-72898'
                    rel='noopener noreferrer'
                  >
                    NVD entry
                  </a>
                  .
                </li>
                <li>
                  <strong className='text-sky-400'>
                    CVE-2026-34612, CVE-2026-34717 (April 2026):
                  </strong>{' '}
                  Recent SQLi vulnerabilities in enterprise software tracked in the Gecko Security
                  SQLi CVE database. Multiple CVEs continue to appear each month.
                </li>
                <li>
                  <strong className='text-sky-400'>
                    Capital One 2019 (SSRF &rarr; SQLi chain):
                  </strong>{' '}
                  The attacker used SSRF against the AWS metadata service to obtain IAM credentials,
                  then logged into a bucket that contained SQLi-vulnerable code. 100+ million
                  records exposed. While the entry was SSRF, the downstream compromise used data
                  accessible through injection.
                </li>
                <li>
                  <strong className='text-sky-400'>Heartland Payment Systems 2008:</strong> 134
                  million credit card records stolen via SQL injection in the payment processing
                  pipeline. The attacker used SQLi to install a custom sniffer that captured track
                  data.
                </li>
              </ul>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Reproducible local lab: Docker Compose
              </h2>
              <p className='leading-relaxed mb-4'>
                The following lab runs a Flask application with SQLite, exposing both a vulnerable
                endpoint and a fixed endpoint. The Docker Compose setup requires Docker and a few
                seconds to build.
              </p>

              <h3 className='text-lg text-sky-400 font-semibold mb-2'>Project structure</h3>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`sqli-lab/
├── docker-compose.yml
├── requirements.txt
├── app.py              # Flask app: /search (vuln) and /search-safe (fixed)
└── init.sql            # Seeds the database with sample data`}</code>
              </pre>

              <h3 className='text-lg text-sky-400 font-semibold mb-2'>docker-compose.yml</h3>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`version: "3.9"
services:
  sqli-lab:
    build: .
    ports:
      - "8001:5000"
    environment:
      FLASK_ENV: development`}</code>
              </pre>

              <h3 className='text-lg text-sky-400 font-semibold mb-2'>
                app.py (vulnerable and fixed endpoints)
              </h3>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
DATABASE = "/data/app.db"

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# ---------- VULNERABLE ----------
@app.route("/search")
def search_vuln():
    q = request.args.get("q", "")
    conn = get_db()
    sql = f"SELECT id, name, email FROM users WHERE name LIKE '%{q}%'"
    try:
        rows = conn.execute(sql).fetchall()
        return jsonify([dict(r) for r in rows])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# ---------- FIXED (parameterized) ----------
@app.route("/search-safe")
def search_safe():
    q = request.args.get("q", "")
    conn = get_db()
    sql = "SELECT id, name, email FROM users WHERE name LIKE ?"
    try:
        rows = conn.execute(sql, (f"%{q}%",)).fetchall()
        return jsonify([dict(r) for r in rows])
    except Exception as e:
        return jsonify({"error": "internal error"}), 500
    finally:
        conn.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)`}</code>
              </pre>

              <h3 className='text-lg text-sky-400 font-semibold mb-2'>init.sql</h3>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'user'
);

INSERT INTO users (name, email, role) VALUES
    ('Alice Admin', 'alice@example.com', 'admin'),
    ('Bob User', 'bob@example.com', 'user'),
    ('Charlie User', 'charlie@example.com', 'user'),
    ('David Dev', 'david@example.com', 'dev');`}</code>
              </pre>

              <h3 className='text-lg text-sky-400 font-semibold mb-2'>requirements.txt</h3>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`flask==3.1.0`}</code>
              </pre>

              <h3 className='text-lg text-sky-400 font-semibold mb-2'>Dockerfile</h3>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py init.sql .
RUN sqlite3 /data/app.db < init.sql
CMD ["python", "app.py"]`}</code>
              </pre>

              <h3 className='text-lg text-sky-400 font-semibold mb-2'>Running the lab</h3>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`docker compose up --build -d

# Test the vulnerable endpoint — normal query
curl "http://localhost:8001/search?q=Bob"

# SQLi — return all users
curl "http://localhost:8001/search?q=' OR 1=1 --"

# SQLi — UNION extraction of database metadata
curl "http://localhost:8001/search?q=' UNION SELECT 1, name, sql FROM sqlite_master --"

# Blind boolean — detect via response difference
curl "http://localhost:8001/search?q=' OR 1=1 --"   # all rows
curl "http://localhost:8001/search?q=' OR 1=2 --"   # no rows

# Fixed endpoint — same payloads return empty/no results (parameterized)
curl "http://localhost:8001/search-safe?q=' OR 1=1 --"`}</code>
              </pre>
              <p className='leading-relaxed mb-4'>
                The fixed endpoint uses a parameterized query (
                <code className='text-slate-100'>LIKE ?</code>) where the user input is passed as
                data, not concatenated into the SQL string. The{' '}
                <code className='text-slate-100'>&apos; OR 1=1 --</code> payload becomes the literal
                search string <code className='text-slate-100'>&apos; OR 1=1 --</code> — no rows
                match, and no injection occurs.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Detection rules: Semgrep</h2>
              <p className='leading-relaxed mb-4'>
                Semgrep can find SQL injection patterns statically by tracing tainted input into
                dangerous database APIs. The following rule catches string concatenation and
                f-string patterns in Python.
              </p>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`rules:
  - id: python-sqli-detection
    patterns:
      - pattern-either:
          - pattern: |
              f"...$QUERY..."
          - pattern: |
              "..." + $QUERY + "..."
          - pattern: |
              "...".format($QUERY)
      - metavariable-regex:
          metavariable: $QUERY
          regex: .*(request\\.|input|args|form).*
      - pattern-inside: |
          $CURSOR.execute(...)
    message: >
      Potential SQL injection: user input concatenated into a query.
      Use a parameterized query with ?/placeholder syntax instead.
    severity: ERROR
    languages: [python]`}</code>
              </pre>
              <p className='leading-relaxed mb-4'>
                Semgrep also ships a{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://semgrep.dev/learn/vulnerabilities/sql-injection'
                  rel='noopener noreferrer'
                >
                  SQL injection-specific learning module
                </a>{' '}
                with rules for Java, C#, Node.js, and Go.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Detection rules: Suricata (network IDS)
              </h2>
              <p className='leading-relaxed mb-4'>
                Suricata can detect SQL injection payloads transiting the network in HTTP requests.
                These rules match common SQL meta-character sequences and SQL keywords in query
                parameters.
              </p>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`# SQL injection — classic tautology payloads
alert http any any -> any any (
  msg:"SQL Injection — tautology detection (OR 1=1)";
  flow:established,to_server;
  content:"OR";
  nocase;
  within:10;
  pcre:"/(\\bOR\\b|\\bAND\\b)\\s+[0-9]+(=|!=|<|>)\\s*[0-9]+/i";
  classtype:web-application-attack;
  sid:1000001;
  rev:1;
)

# SQL injection — UNION SELECT
alert http any any -> any any (
  msg:"SQL Injection — UNION SELECT";
  flow:established,to_server;
  content:"UNION";
  nocase;
  within:15;
  content:"SELECT";
  nocase;
  within:10;
  classtype:web-application-attack;
  sid:1000002;
  rev:1;
)

# SQL injection — stacked query (semicolon injection)
alert http any any -> any any (
  msg:"SQL Injection — stacked query attempt";
  flow:established,to_server;
  pcre:"/[?&][a-zA-Z_]+=[^&\\s]*'\\s*;/Ui";
  classtype:web-application-attack;
  sid:1000003;
  rev:1;
)

# SQL injection — SLEEP/WAITFOR time-based
alert http any any -> any any (
  msg:"SQL Injection — time-based (SLEEP/WAITFOR)";
  flow:established,to_server;
  pcre:"/(SLEEP|WAITFOR\\s+DELAY|pg_sleep|DBMS_LOCK\\.SLEEP)/i";
  classtype:web-application-attack;
  sid:1000004;
  rev:1;
)`}</code>
              </pre>
              <p className='leading-relaxed mb-4'>
                These rules produce false positives on parameter values that genuinely contain
                SQL-like text. Tune by excluding trusted paths or using rate-based thresholds.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Fix patterns by language</h2>
              <p className='leading-relaxed mb-4'>
                The universal fix is <strong>parameterized queries (prepared statements)</strong>:
                the SQL query structure is defined first, and data values are bound as parameters
                that the database engine keeps separate from the command text. Escaping is strongly
                discouraged (OWASP Defense Option 4) and should never be the primary defense.
              </p>

              <h3 className='text-lg text-sky-400 font-semibold mb-2'>
                Java (JDBC PreparedStatement)
              </h3>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`// VULNERABLE
Statement stmt = conn.createStatement();
String sql = "SELECT * FROM users WHERE name = '" + request.getParameter("name") + "'";
ResultSet rs = stmt.executeQuery(sql);

// FIXED — parameterized query
String sql = "SELECT * FROM users WHERE name = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setString(1, request.getParameter("name"));
ResultSet rs = pstmt.executeQuery();`}</code>
              </pre>

              <h3 className='text-lg text-sky-400 font-semibold mb-2'>C# (.NET SqlCommand)</h3>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`// VULNERABLE
string sql = "SELECT * FROM users WHERE name = '" + Request["name"] + "'";
SqlCommand cmd = new SqlCommand(sql, conn);

// FIXED — parameterized
string sql = "SELECT * FROM users WHERE name = @name";
SqlCommand cmd = new SqlCommand(sql, conn);
cmd.Parameters.AddWithValue("@name", Request["name"]);`}</code>
              </pre>

              <h3 className='text-lg text-sky-400 font-semibold mb-2'>
                Python (sqlite3 / psycopg2 / mysql-connector)
              </h3>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`# VULNERABLE
sql = f"SELECT * FROM users WHERE name = '{input_name}'"
cursor.execute(sql)

# FIXED — parameterized with ? placeholders
sql = "SELECT * FROM users WHERE name = ?"
cursor.execute(sql, (input_name,))

# PostgreSQL uses %s placeholders
sql = "SELECT * FROM users WHERE name = %s"
cursor.execute(sql, (input_name,))`}</code>
              </pre>

              <h3 className='text-lg text-sky-400 font-semibold mb-2'>Node.js (pg / mysql2)</h3>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>
                  {'// VULNERABLE\n' +
                    'const sql = "SELECT * FROM users WHERE name = \'" + req.query.name + "\'";\n' +
                    'db.query(sql, callback);\n' +
                    '\n' +
                    '// FIXED — parameterized with $1 placeholders (pg)\n' +
                    'const sql = "SELECT * FROM users WHERE name = $1";\n' +
                    'db.query(sql, [req.query.name], callback);\n' +
                    '\n' +
                    '// mysql2 uses ? placeholders\n' +
                    'const sql = "SELECT * FROM users WHERE name = ?";\n' +
                    'db.query(sql, [req.query.name], callback);'}
                </code>
              </pre>

              <h3 className='text-lg text-sky-400 font-semibold mb-2'>Go (database/sql)</h3>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`// VULNERABLE
sql := fmt.Sprintf("SELECT * FROM users WHERE name = '%s'", r.URL.Query().Get("name"))
rows, _ := db.Query(sql)

// FIXED — parameterized with ? placeholders
sql := "SELECT * FROM users WHERE name = ?"
rows, err := db.Query(sql, r.URL.Query().Get("name"))`}</code>
              </pre>

              <h3 className='text-lg text-sky-400 font-semibold mb-2'>ORM pitfalls</h3>
              <p className='leading-relaxed mb-4'>
                ORM libraries (SQLAlchemy, Entity Framework, Prisma, GORM) parameterize queries by
                default — but raw SQL escape-hatch methods bypass that protection:
              </p>
              <pre className='bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm'>
                <code className='text-slate-100'>{`# SQLAlchemy — VULNERABLE (raw SQL with format)
session.execute(text(f"SELECT * FROM users WHERE name = '{name}'"))

# SQLAlchemy — SAFE (bind parameter)
session.execute(text("SELECT * FROM users WHERE name = :name"), {"name": name})`}</code>
              </pre>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Verification checklist</h2>
              <p className='leading-relaxed mb-4'>
                Use this checklist to verify SQL injection coverage in your application codebase and
                pipeline:
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='min-w-full border-collapse border border-slate-700 text-sm'>
                  <thead>
                    <tr className='bg-slate-800'>
                      <th className='border border-slate-700 px-4 py-2 text-sky-400 font-semibold text-left'>
                        #
                      </th>
                      <th className='border border-slate-700 px-4 py-2 text-sky-400 font-semibold text-left'>
                        Check
                      </th>
                      <th className='border border-slate-700 px-4 py-2 text-sky-400 font-semibold text-left'>
                        Method
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='border border-slate-700 px-4 py-2'>1</td>
                      <td className='border border-slate-700 px-4 py-2'>
                        All database queries use parameterized statements or ORM-safe APIs
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Code review — search for <code className='text-xs'>execute()</code> calls
                        with string concatenation operators
                      </td>
                    </tr>
                    <tr>
                      <td className='border border-slate-700 px-4 py-2'>2</td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Raw SQL escape-hatch usage is audited and minimized
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        SAST scan with taint tracking (Semgrep, CodeQL)
                      </td>
                    </tr>
                    <tr>
                      <td className='border border-slate-700 px-4 py-2'>3</td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Stored procedures avoid dynamic SQL (EXEC/EXECUTE with concatenation)
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>Database code review</td>
                    </tr>
                    <tr>
                      <td className='border border-slate-700 px-4 py-2'>4</td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Application connects with least-privilege database user (no
                        DROP/ALTER/INSERT on production read paths)
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Database permission audit
                      </td>
                    </tr>
                    <tr>
                      <td className='border border-slate-700 px-4 py-2'>5</td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Database error messages are never returned to the user
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Manual test — send <code className='text-xs'>&apos;</code> and inspect
                        response
                      </td>
                    </tr>
                    <tr>
                      <td className='border border-slate-700 px-4 py-2'>6</td>
                      <td className='border border-slate-700 px-4 py-2'>
                        WAF or IDS rules cover SQL injection patterns
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Validate Suricata/modsec rules against test payloads
                      </td>
                    </tr>
                    <tr>
                      <td className='border border-slate-700 px-4 py-2'>7</td>
                      <td className='border border-slate-700 px-4 py-2'>
                        CI/CD has a SAST gate blocking SQLi patterns
                      </td>
                      <td className='border border-slate-700 px-4 py-2'>
                        Verify CI pipeline fails on Semgrep/CodeQL SQLi findings
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
                  SQL injection is CWE-89 — the #1 weakness in the CWE Top 25 for multiple years
                  running.
                </li>
                <li>
                  Every database query with user-controlled input must use parameterized queries
                  (prepared statements). String concatenation or interpolation of user input is
                  never safe.
                </li>
                <li>
                  Blind (boolean/time-based) and out-of-band SQLi let attackers exfiltrate data even
                  when no query results are visible in the HTTP response.
                </li>
                <li>
                  ORMs are not a silver bullet — their raw SQL escape-hatch methods reintroduce
                  injection if used unsafely.
                </li>
                <li>
                  Least-privilege database accounts limit what an attacker can do after injection:
                  separate read-only accounts for queries, separate accounts for DDL.
                </li>
                <li>
                  SAST (Semgrep, CodeQL) plus network-layer IDS (Suricata/modsec) provides layered
                  detection, but neither replaces parameterized queries at the application level.
                </li>
              </ul>
            </section>

            <section className='mb-10 border-t border-slate-700 pt-8'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Kokkuv&otilde;te eesti keeles
              </h2>
              <p className='leading-relaxed mb-4'>
                SQL-injektsioon (CWE-89) on n&otilde;rkus, kus kasutaja sisend liidetakse otse
                SQL-p&auml;ringusse, v&otilde;imaldades r&uuml;ndajal muuta p&auml;ringu loogikat.
                See on olnud CWE Top 25 nimekirjas esikohal juba aastaid. Levinuimad
                r&uuml;ndevormid on klassikaline (in-band), pime SQLi (boolean ja ajap&otilde;hine),
                out-of-band ja teist j&auml;rku (second-order) SQLi.
              </p>
              <p className='leading-relaxed mb-4'>
                Kaitseks tuleb kasutada parametriseeritud p&auml;ringuid (prepared statements) —
                SQL-p&auml;ringu struktuur defineeritakse enne ja kasutaja sisend seotakse
                parameetrina, mis hoitakse k&auml;sustusest eraldi. ORM-teekide toor-SQL
                v&otilde;imalused (raw SQL) tuleb auditeerida. Andmebaasi&otilde;igused peaksid
                olema minimaalsed: lugemisp&auml;ringuteks eraldi kasutaja, skeemimuudatusteks
                teine.
              </p>
              <p className='leading-relaxed mb-4'>
                Semgrep ja CodeQL avastavad SQLi staatilisest anal&uuml;&uuml;sist, Suricata
                tuvastab seda v&otilde;rguliikluses. Kumbki ei asenda parametriseeritud
                p&auml;ringuid — need on esmane kaitsekiht. Olulised reaalsed n&auml;ited: Metabase
                CVE-2026-72898 (CVSS 10.0, CISA KEV), Heartland Payment Systems (134 miljonit
                kaardikirjet).
              </p>
            </section>

            <section className='mb-10 border-t border-slate-700 pt-8'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Sources</h2>
              <ul className='list-disc list-inside space-y-2'>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cwe.mitre.org/data/definitions/89.html'
                    rel='noopener noreferrer'
                  >
                    CWE-89 — Improper Neutralization of Special Elements used in an SQL Command
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html'
                    rel='noopener noreferrer'
                  >
                    OWASP SQL Injection Prevention Cheat Sheet
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://owasp.org/Top10/A03_2021-Injection/'
                    rel='noopener noreferrer'
                  >
                    OWASP Top 10:2021 — A03 Injection
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://docs.semgrep.dev/learn/vulnerabilities/sql-injection'
                    rel='noopener noreferrer'
                  >
                    Semgrep — SQL Injection learning module
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2026-72898'
                    rel='noopener noreferrer'
                  >
                    NVD — CVE-2026-72898 (Metabase SQLi, CVSS 10.0)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.cisa.gov/known-exploited-vulnerabilities-catalog'
                    rel='noopener noreferrer'
                  >
                    CISA Known Exploited Vulnerabilities Catalog
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://portswigger.net/web-security/sql-injection'
                    rel='noopener noreferrer'
                  >
                    PortSwigger Web Security Academy — SQL injection
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://owasp.org/www-community/attacks/SQL_Injection'
                    rel='noopener noreferrer'
                  >
                    OWASP — SQL Injection attack description
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://owasp.org/www-community/attacks/Blind_SQL_Injection'
                    rel='noopener noreferrer'
                  >
                    OWASP — Blind SQL Injection
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='http://bobby-tables.com/'
                    rel='noopener noreferrer'
                  >
                    Bobby Tables — parameterized query examples in every language
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
