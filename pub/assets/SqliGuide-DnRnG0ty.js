import{l as e,s as t}from"./vendor-C8BXcVgD.js";var n=e(),r={"@context":`https://schema.org`,"@type":`TechArticle`,headline:`SQL Injection Explained: Attack Examples & Prevention`,description:`SQL injection (CWE-89) explained: how string concatenation lets attackers rewrite queries, classic and blind attack classes, real CVEs including Metabase CVE-2026-72898 (CVSS 10.0), a reproducible docker-compose lab, detection rules, and parameterized-query fix patterns.`,datePublished:`2026-09-13`,dateModified:`2026-09-13`,inLanguage:`en`,mainEntityOfPage:`https://proksiabel.ee/guides/sqli-explained`,author:{"@type":`Organization`,name:`ProksiAbel OÜ`,url:`https://proksiabel.ee/`},publisher:{"@type":`Organization`,name:`ProksiAbel OÜ`,url:`https://proksiabel.ee/`}};function i(){return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t,{children:(0,n.jsx)(`script`,{type:`application/ld+json`,children:JSON.stringify(r)})}),(0,n.jsx)(`div`,{className:`min-h-screen bg-slate-900 pt-24 pb-12`,children:(0,n.jsxs)(`div`,{className:`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8`,children:[(0,n.jsx)(`p`,{className:`text-sm uppercase tracking-wide text-sky-400 font-semibold mb-4`,children:`Technical Guide`}),(0,n.jsx)(`h1`,{className:`text-3xl md:text-4xl font-bold text-white mb-6`,children:`SQL Injection Explained: Attack Examples & Prevention`}),(0,n.jsx)(`p`,{className:`text-slate-400 text-lg leading-relaxed mb-10`,children:`SQL injection lets an attacker turn user input into executable SQL commands. It is CWE-89 — Improper Neutralization of Special Elements used in an SQL Command — and has been the top entry in the CWE Top 25 for years. This guide covers the mechanics, a reproducible local lab, blind and out-of-band attack classes, detection rules, and parameterized-query fix patterns.`}),(0,n.jsxs)(`div`,{className:`max-w-none text-slate-300`,children:[(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`What SQL injection is and why it keeps mattering`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`SQL injection occurs when an application builds a SQL query by concatenating or interpolating user-supplied input into the query string. The attacker's input changes the query's syntactic structure — a fragment that was intended as a string literal value instead becomes part of the SQL command. The web server sends the manipulated query to the database, which executes the attacker's logic with the application's database privileges.`}),(0,n.jsxs)(`p`,{className:`leading-relaxed mb-4`,children:[`CWE-89 consistently ranks #1 in the`,` `,(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://cwe.mitre.org/top25/`,rel:`noopener noreferrer`,children:`CWE Top 25`}),` `,`most dangerous software weaknesses. OWASP maps SQL injection to`,` `,(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://owasp.org/Top10/A03_2021-Injection/`,rel:`noopener noreferrer`,children:`A03:2021 Injection`}),`. Despite being one of the best-documented vulnerability classes, SQL injection continues to appear in major products — CVE-2026-72898 (Metabase, CVSS 10.0, CISA KEV) is a recent unauthenticated SQLi added to the Known Exploited Vulnerabilities Catalog in August 2026.`]})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Attack anatomy and query-flow model`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`Every SQL injection follows the same query-flow pattern:`}),(0,n.jsxs)(`ol`,{className:`list-decimal list-inside space-y-2 mb-4 text-slate-300`,children:[(0,n.jsx)(`li`,{children:`The developer writes a query with placeholder insertion points.`}),(0,n.jsx)(`li`,{children:`User input is concatenated directly into the SQL string.`}),(0,n.jsxs)(`li`,{children:[`The attacker includes SQL meta-characters (`,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`'`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`"`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`--`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`;`}),`,`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`/*`}),`) that alter the parsed query structure.`]}),(0,n.jsx)(`li`,{children:`The database executes the attacker's modified query under the application's connection privileges.`})]}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`A classic example in Python (Flask):`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`# VULNERABLE
username = request.args.get("username")
sql = f"SELECT * FROM users WHERE username = '{username}'"
cursor.execute(sql)`})}),(0,n.jsxs)(`p`,{className:`leading-relaxed mb-4`,children:[`An attacker sending`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`username=admin' OR '1'='1`}),` `,`produces the query:`]}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`SELECT * FROM users WHERE username = 'admin' OR '1'='1'`})}),(0,n.jsxs)(`p`,{className:`leading-relaxed mb-4`,children:[`The `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`OR '1'='1'`}),` clause evaluates to true for every row, returning all users instead of the intended single user.`]})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`SQL injection attack classes`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`Not all SQL injection attacks look the same. The database response format determines which technique the attacker uses.`}),(0,n.jsx)(`div`,{className:`overflow-x-auto mb-6`,children:(0,n.jsxs)(`table`,{className:`min-w-full border-collapse border border-slate-700 text-sm`,children:[(0,n.jsx)(`thead`,{children:(0,n.jsxs)(`tr`,{className:`bg-slate-800`,children:[(0,n.jsx)(`th`,{className:`border border-slate-700 px-4 py-2 text-sky-400 font-semibold text-left`,children:`Class`}),(0,n.jsx)(`th`,{className:`border border-slate-700 px-4 py-2 text-sky-400 font-semibold text-left`,children:`Mechanism`}),(0,n.jsx)(`th`,{className:`border border-slate-700 px-4 py-2 text-sky-400 font-semibold text-left`,children:`Detection signal`}),(0,n.jsx)(`th`,{className:`border border-slate-700 px-4 py-2 text-sky-400 font-semibold text-left`,children:`Example payload`})]})}),(0,n.jsxs)(`tbody`,{children:[(0,n.jsxs)(`tr`,{children:[(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2 font-medium text-white`,children:`Classic (in-band)`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Data returned directly in the HTTP response`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Visible column data or error messages in the page`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2 text-slate-200`,children:(0,n.jsx)(`code`,{className:`text-xs`,children:`' UNION SELECT credit_card FROM payments --`})})]}),(0,n.jsxs)(`tr`,{children:[(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2 font-medium text-white`,children:`Blind — Boolean (content-based)`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Application returns different response (size, status, content) for true vs false conditions`}),(0,n.jsxs)(`td`,{className:`border border-slate-700 px-4 py-2`,children:[`Response differs between `,(0,n.jsx)(`code`,{className:`text-xs`,children:`1=1`}),` and`,` `,(0,n.jsx)(`code`,{className:`text-xs`,children:`1=2`})]}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2 text-slate-200`,children:(0,n.jsx)(`code`,{className:`text-xs`,children:`' OR SUBSTRING(password,1,1)='a' --`})})]}),(0,n.jsxs)(`tr`,{children:[(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2 font-medium text-white`,children:`Blind — Time-based`}),(0,n.jsxs)(`td`,{className:`border border-slate-700 px-4 py-2`,children:[`Conditional causes a measurable database delay (e.g.`,` `,(0,n.jsx)(`code`,{className:`text-xs`,children:`SLEEP()`}),`, heavy query)`]}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Response latency varies by condition`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2 text-slate-200`,children:(0,n.jsx)(`code`,{className:`text-xs`,children:`'; IF (1=1) WAITFOR DELAY '0:0:5' --`})})]}),(0,n.jsxs)(`tr`,{children:[(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2 font-medium text-white`,children:`Out-of-band (OOB)`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Data exfiltrated via a separate channel (DNS, HTTP, SMB) to an attacker-controlled server`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Network logs show outbound connection to external host`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2 text-slate-200`,children:(0,n.jsx)(`code`,{className:`text-xs`,children:`DECLARE @o INT; EXEC sp_oacreate MSXML2.ServerXMLHTTP, @o OUT`})})]}),(0,n.jsxs)(`tr`,{children:[(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2 font-medium text-white`,children:`Second-order (stored)`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Malicious payload is stored in the database and triggers when later retrieved and used unsafely`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Input validation passes at write; exploit triggers at read in a different code path`}),(0,n.jsxs)(`td`,{className:`border border-slate-700 px-4 py-2 text-slate-200`,children:[`Register username`,` `,(0,n.jsx)(`code`,{className:`text-xs`,children:`admin'; DROP TABLE logs; --`}),`, then profile page executes it`]})]})]})]})})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Real-world SQL injection incidents`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`These recent and notable incidents demonstrate that SQL injection is not a legacy problem:`}),(0,n.jsxs)(`ul`,{className:`list-disc list-inside space-y-3 mb-4`,children:[(0,n.jsxs)(`li`,{children:[(0,n.jsx)(`strong`,{className:`text-sky-400`,children:`CVE-2026-72898 — Metabase (CVSS 10.0, CISA KEV):`}),` `,`An unauthenticated attacker injects arbitrary SQL via the`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`/reset_password`}),` endpoint to gain administrator access. CISA confirmed active exploitation.`,` `,(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://nvd.nist.gov/vuln/detail/CVE-2026-72898`,rel:`noopener noreferrer`,children:`NVD entry`}),`.`]}),(0,n.jsxs)(`li`,{children:[(0,n.jsx)(`strong`,{className:`text-sky-400`,children:`CVE-2026-34612, CVE-2026-34717 (April 2026):`}),` `,`Recent SQLi vulnerabilities in enterprise software tracked in the Gecko Security SQLi CVE database. Multiple CVEs continue to appear each month.`]}),(0,n.jsxs)(`li`,{children:[(0,n.jsx)(`strong`,{className:`text-sky-400`,children:`Capital One 2019 (SSRF → SQLi chain):`}),` `,`The attacker used SSRF against the AWS metadata service to obtain IAM credentials, then logged into a bucket that contained SQLi-vulnerable code. 100+ million records exposed. While the entry was SSRF, the downstream compromise used data accessible through injection.`]}),(0,n.jsxs)(`li`,{children:[(0,n.jsx)(`strong`,{className:`text-sky-400`,children:`Heartland Payment Systems 2008:`}),` 134 million credit card records stolen via SQL injection in the payment processing pipeline. The attacker used SQLi to install a custom sniffer that captured track data.`]})]})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Reproducible local lab: Docker Compose`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`The following lab runs a Flask application with SQLite, exposing both a vulnerable endpoint and a fixed endpoint. The Docker Compose setup requires Docker and a few seconds to build.`}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-semibold mb-2`,children:`Project structure`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`sqli-lab/
├── docker-compose.yml
├── requirements.txt
├── app.py              # Flask app: /search (vuln) and /search-safe (fixed)
└── init.sql            # Seeds the database with sample data`})}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-semibold mb-2`,children:`docker-compose.yml`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`version: "3.9"
services:
  sqli-lab:
    build: .
    ports:
      - "8001:5000"
    environment:
      FLASK_ENV: development`})}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-semibold mb-2`,children:`app.py (vulnerable and fixed endpoints)`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`from flask import Flask, request, jsonify
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
    app.run(host="0.0.0.0", port=5000)`})}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-semibold mb-2`,children:`init.sql`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'user'
);

INSERT INTO users (name, email, role) VALUES
    ('Alice Admin', 'alice@example.com', 'admin'),
    ('Bob User', 'bob@example.com', 'user'),
    ('Charlie User', 'charlie@example.com', 'user'),
    ('David Dev', 'david@example.com', 'dev');`})}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-semibold mb-2`,children:`requirements.txt`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`flask==3.1.0`})}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-semibold mb-2`,children:`Dockerfile`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py init.sql .
RUN sqlite3 /data/app.db < init.sql
CMD ["python", "app.py"]`})}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-semibold mb-2`,children:`Running the lab`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`docker compose up --build -d

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
curl "http://localhost:8001/search-safe?q=' OR 1=1 --"`})}),(0,n.jsxs)(`p`,{className:`leading-relaxed mb-4`,children:[`The fixed endpoint uses a parameterized query (`,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`LIKE ?`}),`) where the user input is passed as data, not concatenated into the SQL string. The`,` `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`' OR 1=1 --`}),` payload becomes the literal search string `,(0,n.jsx)(`code`,{className:`text-slate-100`,children:`' OR 1=1 --`}),` — no rows match, and no injection occurs.`]})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Detection rules: Semgrep`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`Semgrep can find SQL injection patterns statically by tracing tainted input into dangerous database APIs. The following rule catches string concatenation and f-string patterns in Python.`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`rules:
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
    languages: [python]`})}),(0,n.jsxs)(`p`,{className:`leading-relaxed mb-4`,children:[`Semgrep also ships a`,` `,(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://semgrep.dev/learn/vulnerabilities/sql-injection`,rel:`noopener noreferrer`,children:`SQL injection-specific learning module`}),` `,`with rules for Java, C#, Node.js, and Go.`]})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Detection rules: Suricata (network IDS)`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`Suricata can detect SQL injection payloads transiting the network in HTTP requests. These rules match common SQL meta-character sequences and SQL keywords in query parameters.`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`# SQL injection — classic tautology payloads
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
)`})}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`These rules produce false positives on parameter values that genuinely contain SQL-like text. Tune by excluding trusted paths or using rate-based thresholds.`})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Fix patterns by language`}),(0,n.jsxs)(`p`,{className:`leading-relaxed mb-4`,children:[`The universal fix is `,(0,n.jsx)(`strong`,{children:`parameterized queries (prepared statements)`}),`: the SQL query structure is defined first, and data values are bound as parameters that the database engine keeps separate from the command text. Escaping is strongly discouraged (OWASP Defense Option 4) and should never be the primary defense.`]}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-semibold mb-2`,children:`Java (JDBC PreparedStatement)`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`// VULNERABLE
Statement stmt = conn.createStatement();
String sql = "SELECT * FROM users WHERE name = '" + request.getParameter("name") + "'";
ResultSet rs = stmt.executeQuery(sql);

// FIXED — parameterized query
String sql = "SELECT * FROM users WHERE name = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setString(1, request.getParameter("name"));
ResultSet rs = pstmt.executeQuery();`})}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-semibold mb-2`,children:`C# (.NET SqlCommand)`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`// VULNERABLE
string sql = "SELECT * FROM users WHERE name = '" + Request["name"] + "'";
SqlCommand cmd = new SqlCommand(sql, conn);

// FIXED — parameterized
string sql = "SELECT * FROM users WHERE name = @name";
SqlCommand cmd = new SqlCommand(sql, conn);
cmd.Parameters.AddWithValue("@name", Request["name"]);`})}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-semibold mb-2`,children:`Python (sqlite3 / psycopg2 / mysql-connector)`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`# VULNERABLE
sql = f"SELECT * FROM users WHERE name = '{input_name}'"
cursor.execute(sql)

# FIXED — parameterized with ? placeholders
sql = "SELECT * FROM users WHERE name = ?"
cursor.execute(sql, (input_name,))

# PostgreSQL uses %s placeholders
sql = "SELECT * FROM users WHERE name = %s"
cursor.execute(sql, (input_name,))`})}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-semibold mb-2`,children:`Node.js (pg / mysql2)`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`// VULNERABLE
const sql = "SELECT * FROM users WHERE name = '" + req.query.name + "'";
db.query(sql, callback);

// FIXED — parameterized with $1 placeholders (pg)
const sql = "SELECT * FROM users WHERE name = $1";
db.query(sql, [req.query.name], callback);

// mysql2 uses ? placeholders
const sql = "SELECT * FROM users WHERE name = ?";
db.query(sql, [req.query.name], callback);`})}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-semibold mb-2`,children:`Go (database/sql)`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`// VULNERABLE
sql := fmt.Sprintf("SELECT * FROM users WHERE name = '%s'", r.URL.Query().Get("name"))
rows, _ := db.Query(sql)

// FIXED — parameterized with ? placeholders
sql := "SELECT * FROM users WHERE name = ?"
rows, err := db.Query(sql, r.URL.Query().Get("name"))`})}),(0,n.jsx)(`h3`,{className:`text-lg text-sky-400 font-semibold mb-2`,children:`ORM pitfalls`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`ORM libraries (SQLAlchemy, Entity Framework, Prisma, GORM) parameterize queries by default — but raw SQL escape-hatch methods bypass that protection:`}),(0,n.jsx)(`pre`,{className:`bg-slate-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm`,children:(0,n.jsx)(`code`,{className:`text-slate-100`,children:`# SQLAlchemy — VULNERABLE (raw SQL with format)
session.execute(text(f"SELECT * FROM users WHERE name = '{name}'"))

# SQLAlchemy — SAFE (bind parameter)
session.execute(text("SELECT * FROM users WHERE name = :name"), {"name": name})`})})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Verification checklist`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`Use this checklist to verify SQL injection coverage in your application codebase and pipeline:`}),(0,n.jsx)(`div`,{className:`overflow-x-auto mb-4`,children:(0,n.jsxs)(`table`,{className:`min-w-full border-collapse border border-slate-700 text-sm`,children:[(0,n.jsx)(`thead`,{children:(0,n.jsxs)(`tr`,{className:`bg-slate-800`,children:[(0,n.jsx)(`th`,{className:`border border-slate-700 px-4 py-2 text-sky-400 font-semibold text-left`,children:`#`}),(0,n.jsx)(`th`,{className:`border border-slate-700 px-4 py-2 text-sky-400 font-semibold text-left`,children:`Check`}),(0,n.jsx)(`th`,{className:`border border-slate-700 px-4 py-2 text-sky-400 font-semibold text-left`,children:`Method`})]})}),(0,n.jsxs)(`tbody`,{children:[(0,n.jsxs)(`tr`,{children:[(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`1`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`All database queries use parameterized statements or ORM-safe APIs`}),(0,n.jsxs)(`td`,{className:`border border-slate-700 px-4 py-2`,children:[`Code review — search for `,(0,n.jsx)(`code`,{className:`text-xs`,children:`execute()`}),` calls with string concatenation operators`]})]}),(0,n.jsxs)(`tr`,{children:[(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`2`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Raw SQL escape-hatch usage is audited and minimized`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`SAST scan with taint tracking (Semgrep, CodeQL)`})]}),(0,n.jsxs)(`tr`,{children:[(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`3`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Stored procedures avoid dynamic SQL (EXEC/EXECUTE with concatenation)`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Database code review`})]}),(0,n.jsxs)(`tr`,{children:[(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`4`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Application connects with least-privilege database user (no DROP/ALTER/INSERT on production read paths)`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Database permission audit`})]}),(0,n.jsxs)(`tr`,{children:[(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`5`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Database error messages are never returned to the user`}),(0,n.jsxs)(`td`,{className:`border border-slate-700 px-4 py-2`,children:[`Manual test — send `,(0,n.jsx)(`code`,{className:`text-xs`,children:`'`}),` and inspect response`]})]}),(0,n.jsxs)(`tr`,{children:[(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`6`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`WAF or IDS rules cover SQL injection patterns`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Validate Suricata/modsec rules against test payloads`})]}),(0,n.jsxs)(`tr`,{children:[(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`7`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`CI/CD has a SAST gate blocking SQLi patterns`}),(0,n.jsx)(`td`,{className:`border border-slate-700 px-4 py-2`,children:`Verify CI pipeline fails on Semgrep/CodeQL SQLi findings`})]})]})]})})]}),(0,n.jsxs)(`section`,{className:`mb-10`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Key takeaways`}),(0,n.jsxs)(`ul`,{className:`list-disc list-inside space-y-2 mb-4`,children:[(0,n.jsx)(`li`,{children:`SQL injection is CWE-89 — the #1 weakness in the CWE Top 25 for multiple years running.`}),(0,n.jsx)(`li`,{children:`Every database query with user-controlled input must use parameterized queries (prepared statements). String concatenation or interpolation of user input is never safe.`}),(0,n.jsx)(`li`,{children:`Blind (boolean/time-based) and out-of-band SQLi let attackers exfiltrate data even when no query results are visible in the HTTP response.`}),(0,n.jsx)(`li`,{children:`ORMs are not a silver bullet — their raw SQL escape-hatch methods reintroduce injection if used unsafely.`}),(0,n.jsx)(`li`,{children:`Least-privilege database accounts limit what an attacker can do after injection: separate read-only accounts for queries, separate accounts for DDL.`}),(0,n.jsx)(`li`,{children:`SAST (Semgrep, CodeQL) plus network-layer IDS (Suricata/modsec) provides layered detection, but neither replaces parameterized queries at the application level.`})]})]}),(0,n.jsxs)(`section`,{className:`mb-10 border-t border-slate-700 pt-8`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Kokkuvõte eesti keeles`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`SQL-injektsioon (CWE-89) on nõrkus, kus kasutaja sisend liidetakse otse SQL-päringusse, võimaldades ründajal muuta päringu loogikat. See on olnud CWE Top 25 nimekirjas esikohal juba aastaid. Levinuimad ründevormid on klassikaline (in-band), pime SQLi (boolean ja ajapõhine), out-of-band ja teist järku (second-order) SQLi.`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`Kaitseks tuleb kasutada parametriseeritud päringuid (prepared statements) — SQL-päringu struktuur defineeritakse enne ja kasutaja sisend seotakse parameetrina, mis hoitakse käsustusest eraldi. ORM-teekide toor-SQL võimalused (raw SQL) tuleb auditeerida. Andmebaasiõigused peaksid olema minimaalsed: lugemispäringuteks eraldi kasutaja, skeemimuudatusteks teine.`}),(0,n.jsx)(`p`,{className:`leading-relaxed mb-4`,children:`Semgrep ja CodeQL avastavad SQLi staatilisest analüüsist, Suricata tuvastab seda võrguliikluses. Kumbki ei asenda parametriseeritud päringuid — need on esmane kaitsekiht. Olulised reaalsed näited: Metabase CVE-2026-72898 (CVSS 10.0, CISA KEV), Heartland Payment Systems (134 miljonit kaardikirjet).`})]}),(0,n.jsxs)(`section`,{className:`mb-10 border-t border-slate-700 pt-8`,children:[(0,n.jsx)(`h2`,{className:`text-xl text-sky-500 font-semibold mb-4`,children:`Sources`}),(0,n.jsxs)(`ul`,{className:`list-disc list-inside space-y-2`,children:[(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://cwe.mitre.org/data/definitions/89.html`,rel:`noopener noreferrer`,children:`CWE-89 — Improper Neutralization of Special Elements used in an SQL Command`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html`,rel:`noopener noreferrer`,children:`OWASP SQL Injection Prevention Cheat Sheet`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://owasp.org/Top10/A03_2021-Injection/`,rel:`noopener noreferrer`,children:`OWASP Top 10:2021 — A03 Injection`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://docs.semgrep.dev/learn/vulnerabilities/sql-injection`,rel:`noopener noreferrer`,children:`Semgrep — SQL Injection learning module`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://nvd.nist.gov/vuln/detail/CVE-2026-72898`,rel:`noopener noreferrer`,children:`NVD — CVE-2026-72898 (Metabase SQLi, CVSS 10.0)`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://www.cisa.gov/known-exploited-vulnerabilities-catalog`,rel:`noopener noreferrer`,children:`CISA Known Exploited Vulnerabilities Catalog`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://portswigger.net/web-security/sql-injection`,rel:`noopener noreferrer`,children:`PortSwigger Web Security Academy — SQL injection`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://owasp.org/www-community/attacks/SQL_Injection`,rel:`noopener noreferrer`,children:`OWASP — SQL Injection attack description`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`https://owasp.org/www-community/attacks/Blind_SQL_Injection`,rel:`noopener noreferrer`,children:`OWASP — Blind SQL Injection`})}),(0,n.jsx)(`li`,{children:(0,n.jsx)(`a`,{className:`text-sky-400 hover:text-sky-300`,href:`http://bobby-tables.com/`,rel:`noopener noreferrer`,children:`Bobby Tables — parameterized query examples in every language`})})]})]})]})]})})]})}export{i as default};