import { useTranslation } from '../i18n';

/**
 * Slim, high-density proof strip grounding the consultancy's authority directly
 * below the fold. Monospace labels, hairline dividers. Every claim maps to a
 * statement already made elsewhere on the site — no fabricated credentials.
 */
export default function Telemetry() {
  const { t } = useTranslation();
  const items = t.services.telemetry;

  return (
    <section aria-label={t.services.metricsLabel} className='relative'>
      <div className='container-custom'>
        <div className='obsidian-card grid grid-cols-2 divide-x divide-y divide-[var(--border-subtle)] sm:grid-cols-4 sm:divide-y-0'>
          {items.map((item) => (
            <div
              key={item.label}
              className='flex flex-col items-center gap-1 px-4 py-6 text-center'
            >
              <span
                className='font-mono text-2xl font-semibold tracking-tight text-white'
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {item.value}
              </span>
              <span className='font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]'>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
