import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../i18n';
import SpotlightCard from './ui/SpotlightCard';

// Capability pills for the full-width secure-development banner. Proper nouns —
// intentionally not translated.
const HARDENING_PILLS = ['FIDO2 / WebAuthn', 'Token Binding', 'Zero Trust Arch'];

// Illustrative Go snippet for the tooling card (decorative, not executed).
const GO_SNIPPET = `package main

func BypassSession(c *Client) (*Token, error) {
    tok := c.Intercept()
    return tok.Replay()
}`;

export default function Services() {
  const { t } = useTranslation();
  const s = t.services;
  const b = s.bento;
  const pentest = s.service1;
  const tooling = s.service3;
  const secureDev = s.service2;

  return (
    <section id='services' className='section-padding relative overflow-hidden'>
      <div className='relative z-10 container-custom'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <span className='mono-badge mb-4'>{b.sectionTag}</span>
          <h2 className='heading-2 mb-4'>{s.title}</h2>
          <p className='body-large mx-auto max-w-3xl text-[var(--color-text-body)]'>
            {s.description}
          </p>
        </div>

        {/* Bento matrix */}
        <div className='grid gap-5 lg:grid-cols-12'>
          {/* Item 1 — Pentest (65%) */}
          <SpotlightCard className='lg:col-span-8'>
            <h3 className='text-xl font-semibold tracking-tight text-white'>{pentest.title}</h3>
            <p className='mt-2 max-w-lg text-sm leading-relaxed text-[var(--color-text-body)]'>
              {pentest.description}
            </p>
            <ul className='mt-6 space-y-2.5'>
              {pentest.features.map((f) => (
                <li key={f} className='flex items-start gap-2.5'>
                  <CheckCircle2
                    className='mt-0.5 h-4 w-4 flex-shrink-0'
                    style={{ color: 'var(--color-signal-success)' }}
                  />
                  <span className='text-sm text-[var(--color-text-body)]'>{f}</span>
                </li>
              ))}
            </ul>

            {/* Vuln finding preview */}
            <div
              className='mt-6 rounded-xl border p-4'
              style={{
                borderColor: 'color-mix(in oklab, var(--color-signal-critical) 30%, transparent)',
                backgroundColor:
                  'color-mix(in oklab, var(--color-signal-critical) 6%, transparent)',
              }}
            >
              <div className='flex items-center justify-between'>
                <span className='font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]'>
                  {b.reportPreview}
                </span>
                <span
                  className='rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider'
                  style={{
                    color: 'var(--color-signal-critical)',
                    backgroundColor:
                      'color-mix(in oklab, var(--color-signal-critical) 14%, transparent)',
                  }}
                >
                  {b.severity} · {b.cvss}
                </span>
              </div>
              <code className='mt-2 block font-mono text-sm text-white'>{b.findingType}</code>
            </div>
          </SpotlightCard>

          {/* Item 2 — Tooling / Go (35%) */}
          <SpotlightCard className='lg:col-span-4'>
            <span className='mono-badge mb-3'>{b.toolingBadge}</span>
            <h3 className='text-xl font-semibold tracking-tight text-white'>{tooling.title}</h3>
            <p className='mt-2 text-sm leading-relaxed text-[var(--color-text-body)]'>
              {tooling.description}
            </p>
            <pre
              className='mt-5 overflow-x-auto rounded-lg border border-[var(--border-subtle)] p-3 font-mono text-[11px] leading-5'
              style={{ backgroundColor: 'var(--color-void)' }}
            >
              <code className='text-[var(--color-text-body)]'>{GO_SNIPPET}</code>
            </pre>
          </SpotlightCard>

          {/* Item 3 — Secure development (full-width banner) */}
          <SpotlightCard className='lg:col-span-12'>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
              <div className='max-w-2xl'>
                <h3 className='text-xl font-semibold tracking-tight text-white'>
                  {secureDev.title}
                </h3>
                <p className='mt-2 text-base italic text-[var(--color-text-body)]'>
                  “{b.bannerQuote}”
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                {HARDENING_PILLS.map((pill) => (
                  <span
                    key={pill}
                    className='rounded-full border border-[var(--border-subtle)] px-3 py-1.5 font-mono text-xs text-[var(--color-text-body)]'
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
