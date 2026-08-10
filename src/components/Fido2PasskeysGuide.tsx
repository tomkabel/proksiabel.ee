import { Helmet } from '@dr.pogodin/react-helmet';

const guideUrl = 'https://proksiabel.ee/guides/fido2-vs-passkeys';

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'FIDO2 vs Passkeys: A Technical Guide',
  description:
    'FIDO2 is a protocol family; passkeys are a product concept built on one WebAuthn feature. A practical comparison of discoverable credentials, attestation, sync, and deployment.',
  datePublished: '2026-08-10',
  dateModified: '2026-08-10',
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

export default function Fido2PasskeysGuide() {
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
            FIDO2 vs Passkeys: A Technical Guide
          </h1>
          <p className='text-slate-400 text-lg leading-relaxed mb-10'>
            FIDO2 and passkeys get used as if they were the same thing. They are not. FIDO2 is a
            protocol family; a passkey is a product concept built on one specific WebAuthn feature.
            This guide explains what each actually is, where they overlap, and how to decide what to
            deploy — from the relying party's perspective.
          </p>

          <div className='max-w-none text-slate-300'>
            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>What FIDO2 actually is</h2>
              <p className='leading-relaxed mb-4'>
                FIDO2 is the FIDO Alliance's umbrella for the modern passwordless authentication
                stack. It is two specifications, not a device:
              </p>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  <strong className='text-sky-400'>WebAuthn</strong> — the W3C specification for the
                  browser-to-server API (
                  <code className='text-slate-100'>navigator.credentials.create()</code> and{' '}
                  <code className='text-slate-100'>get()</code>). It defines the challenge flow,
                  origin binding, attestation, and assertion verification.
                </li>
                <li>
                  <strong className='text-sky-400'>CTAP2</strong> — the FIDO Alliance specification
                  for the client-to-authenticator protocol (USB, NFC, BLE, and the internal platform
                  transport). This is what YubiKey-class devices speak.
                </li>
              </ul>
              <p className='leading-relaxed mb-4'>
                Its predecessor, U2F (CTAP1), supported only non-discoverable credentials. FIDO2
                added discoverable credentials, platform authenticators, and user verification.
              </p>
              <p className='leading-relaxed'>
                A security key is a FIDO2 authenticator. The TPM-backed platform authenticator in a
                laptop is also a FIDO2 authenticator — and so, technically, is the keychain that
                produces a passkey. FIDO2 is the protocol layer underneath all of them.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                What passkeys actually are
              </h2>
              <p className='leading-relaxed mb-4'>
                "Passkey" is a product term, coined by Apple at WWDC 2022 and since adopted by
                Google, Microsoft, and the FIDO Alliance itself. Under the hood, a passkey is a
                WebAuthn credential with two specific properties:
              </p>
              <ol className='list-decimal list-inside space-y-2 mb-4'>
                <li>
                  <strong className='text-sky-400'>Discoverable</strong> — a resident key. The
                  authenticator stores the credential and can find it for a given relying party
                  without the server sending credential IDs. This is what makes "no username"
                  sign-in flows possible.
                </li>
                <li>
                  <strong className='text-sky-400'>Usually synced</strong> — the platform provider
                  backs the credential up (iCloud Keychain, Google Password Manager, 1Password,
                  Dashlane, Bitwarden, and others), giving users a recovery path if they lose a
                  device.
                </li>
              </ol>
              <p className='leading-relaxed'>
                The practical consequence:{' '}
                <em>
                  every passkey is a FIDO2 credential, but not every FIDO2 credential is a passkey.
                </em>{' '}
                A security key with attestation and no sync is FIDO2, but nobody calls it a passkey.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>The technical differences</h2>

              <div className='overflow-x-auto mb-6'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Property</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>
                        Security key (CTAP2)
                      </th>
                      <th className='py-3 text-slate-100 font-semibold'>Passkey</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Discoverability</td>
                      <td className='py-3 pr-4 align-top'>
                        Optional — server sends credential IDs
                      </td>
                      <td className='py-3 align-top'>Required — resident key</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Key storage</td>
                      <td className='py-3 pr-4 align-top'>
                        Device-bound; private key never leaves hardware
                      </td>
                      <td className='py-3 align-top'>Synced by provider; backup-eligible</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Attestation</td>
                      <td className='py-3 pr-4 align-top'>
                        packed / tpm / android-key; stable AAGUID
                      </td>
                      <td className='py-3 align-top'>Often "none"; AAGUID less meaningful</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>User verification</td>
                      <td className='py-3 pr-4 align-top'>
                        Configurable — UV (PIN/biometric) or presence-only
                      </td>
                      <td className='py-3 align-top'>Expected — biometric or PIN</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Roaming</td>
                      <td className='py-3 pr-4 align-top'>Physical device: plug or tap</td>
                      <td className='py-3 align-top'>
                        Cross-device via QR + BLE (hybrid transport)
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>signCount</td>
                      <td className='py-3 pr-4 align-top'>
                        Increments — usable for clone detection
                      </td>
                      <td className='py-3 align-top'>Often 0 on platform authenticators</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Loss / recovery</td>
                      <td className='py-3 pr-4 align-top'>
                        Register multiple keys; lost key = lost access
                      </td>
                      <td className='py-3 align-top'>Provider sync + account recovery</td>
                    </tr>
                    <tr>
                      <td className='py-3 pr-4 align-top'>Enterprise control</td>
                      <td className='py-3 pr-4 align-top'>
                        AAGUID allowlists, attestation policies
                      </td>
                      <td className='py-3 align-top'>Limited; attestation typically unavailable</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Discoverability</h3>
              <p className='leading-relaxed mb-6'>
                This is the defining difference. A classic U2F-style security key stores credentials
                with the server: the browser sends a list of credential IDs and the key picks one. A
                passkey is a resident key — the authenticator holds the credential and can be asked
                "which of your stored credentials belong to this origin?" without any IDs. That
                enables the username-less, device-agnostic UX passkeys are known for.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Attestation and AAGUID</h3>
              <p className='leading-relaxed mb-6'>
                Security keys ship a stable AAGUID and support attestation formats (packed, TPM,
                Android Key), which lets a relying party prove <em>which model</em> of authenticator
                was used — the basis of enterprise AAGUID allowlists. Synced passkeys typically
                return <code className='text-slate-100'>attestation: "none"</code>, because the
                credential is platform- and provider-dependent. If your policy requires hardware
                attestation, passkeys will not satisfy it.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>Sync and backup eligibility</h3>
              <p className='leading-relaxed mb-6'>
                Since WebAuthn Level 2, assertions carry backup-eligibility flags:{' '}
                <code className='text-slate-100'>be</code> (backup eligible) and{' '}
                <code className='text-slate-100'>bs</code> (backup state). A synced passkey reports{' '}
                <code className='text-slate-100'>bs: true</code> — the key material may exist
                outside the original authenticator. A device-bound security key reports{' '}
                <code className='text-slate-100'>bs: false</code>. Relying parties that need strict
                device-binding can read these flags and reject credentials that do not meet the
                policy.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>User verification</h3>
              <p className='leading-relaxed'>
                User verification (UV) means the authenticator proved the user is present via
                biometric or PIN. User presence (UP) is just a touch. Security keys let you choose
                per registration ({' '}
                <code className='text-slate-100'>
                  userVerification: "required" | "preferred" | "discouraged"
                </code>{' '}
                ). Passkeys are designed around UV — a synced passkey without a biometric or PIN is
                not much better than a password.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>What they share</h2>
              <p className='leading-relaxed mb-4'>
                Both are phishing-resistant by construction: origin-bound key pairs, no shared
                secrets, challenge-response authentication. Credential stuffing and classic phishing
                fail against both, because a credential minted for{' '}
                <code className='text-slate-100'>https://bank.example</code> is useless against a
                lookalike origin.
              </p>
              <p className='leading-relaxed'>
                What neither protects against: the session <em>after</em> authentication. A
                reverse-proxy phishing kit (AiTM-style) still rides the session cookie once the user
                has signed in. Passkeys move the credential layer forward — they do not make
                session-layer defenses obsolete. That is exactly the MITM attack surface we spend
                our time on, and it is worth keeping in your threat model.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>How to choose</h2>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Consumer-facing apps: passkeys
              </h3>
              <p className='leading-relaxed mb-6'>
                Sync, recovery, and cross-device flows are what consumers expect. The UX win is
                real, and the backup-eligibility flags let you set a sane policy instead of blocking
                the ecosystem.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Privileged access: device-bound security keys
              </h3>
              <p className='leading-relaxed mb-6'>
                Admin consoles, break-glass accounts, and anything holding signing keys benefit from
                attestation, AAGUID allowlisting, and a private key that provably never left
                hardware. No cloud dependency, no provider-mediated recovery.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Hybrid is the common pattern
              </h3>
              <p className='leading-relaxed'>
                Passkeys for the general user base, security keys for administrators and
                high-assurance roles. Both ride the same WebAuthn ceremony, so the server-side
                implementation cost is shared.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Relying-party implementation checklist
              </h2>
              <ul className='list-disc list-inside space-y-2 mb-6'>
                <li>
                  Decide <code className='text-slate-100'>residentKey</code> per flow:{' '}
                  <code className='text-slate-100'>"required"</code> for passkey-style flows,{' '}
                  <code className='text-slate-100'>"preferred"</code> as a graceful middle ground.
                </li>
                <li>
                  Set a <code className='text-slate-100'>userVerification</code> policy —{' '}
                  <code className='text-slate-100'>"required"</code> for anything sensitive.
                </li>
                <li>
                  Choose an attestation policy: <code className='text-slate-100'>"none"</code> for
                  most products, <code className='text-slate-100'>"direct"</code> where hardware
                  proof matters.
                </li>
                <li>
                  AAGUID allowlist for privileged roles; treat unknown AAGUIDs as untrusted there.
                </li>
                <li>
                  Read the <code className='text-slate-100'>be</code> /{' '}
                  <code className='text-slate-100'>bs</code> flags and enforce your backup policy —
                  do not silently accept synced credentials where device-binding is required.
                </li>
                <li>
                  Do not hard-fail on <code className='text-slate-100'>signCount: 0</code> —
                  platform authenticators frequently do not increment it.
                </li>
                <li>
                  Remember you cannot reliably tell "passkey" from "security key" from the protocol
                  alone — combine <code className='text-slate-100'>authenticatorAttachment</code>,
                  AAGUID, attestation, and backup flags as signals.
                </li>
              </ul>
              <p className='leading-relaxed mb-4'>
                A registration that accepts both looks like this:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`navigator.credentials.create({
  publicKey: {
    challenge: new Uint8Array([...]),   // fresh, per-registration
    rp: { id: "example.com", name: "Example" },
    user: {
      id: new Uint8Array([...]),        // stable, not the email
      name: "alice@example.com",
      displayName: "Alice"
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },  // ES256
      { type: "public-key", alg: -257 } // RS256
    ],
    authenticatorSelection: {
      residentKey: "preferred",          // passkey flow; "required" for strict
      userVerification: "required"       // biometric/PIN or reject
    },
    attestation: "none"                  // "direct" for privileged roles
  }
});`}
              </pre>
              <p className='leading-relaxed'>
                The server side stays the same regardless of which authenticator the user picks:
                verify the challenge, the origin, the signature, and the flags you care about.
              </p>
            </section>

            <section>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Sources</h2>
              <ul className='list-disc list-inside space-y-2 text-sm'>
                <li>
                  W3C —{' '}
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.w3.org/TR/webauthn-3/'
                    rel='noopener noreferrer'
                  >
                    Web Authentication: An API for accessing Public Key Credentials (Level 3)
                  </a>
                </li>
                <li>
                  FIDO Alliance —{' '}
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://fidoalliance.org/passkeys/'
                    rel='noopener noreferrer'
                  >
                    Passkeys overview
                  </a>{' '}
                  and the{' '}
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://fidoalliance.org/specifications/'
                    rel='noopener noreferrer'
                  >
                    CTAP2 specification
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://passkeys.dev/'
                    rel='noopener noreferrer'
                  >
                    passkeys.dev
                  </a>{' '}
                  — ecosystem and support matrix
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
