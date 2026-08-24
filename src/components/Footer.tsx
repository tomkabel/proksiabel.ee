import { Mail, MapPin, Phone } from 'lucide-react';
import { contactInfo } from '../data/contact';
import { useTranslation } from '../i18n';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const columns = [
    {
      title: t.footer.services,
      links: [
        { label: t.footer.services, href: '/#services' },
        { label: t.footer.expertise, href: '/#about' },
        { label: t.footer.contact, href: '/#contact' },
      ],
    },
    {
      title: t.footer.resources,
      links: [
        { label: t.footer.pgp, href: '/#contact' },
        { label: 'FIDO2 vs Passkeys', href: '/guides/fido2-vs-passkeys' },
        { label: 'SSRF Explained', href: '/guides/ssrf-explained' },
        { label: 'IDOR Explained', href: '/guides/idor-explained' },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { label: t.footer.privacy, href: '/privacy' },
        { label: t.footer.terms, href: '/terms' },
        { label: t.footer.cookies, href: '/cookies' },
        { label: t.footer.disclosure, href: '/disclosure' },
      ],
    },
  ];

  return (
    <footer className='relative overflow-hidden' style={{ backgroundColor: 'var(--color-void)' }}>
      <div
        className='h-px'
        style={{
          background:
            'linear-gradient(to right, transparent, var(--border-active-glow), transparent)',
        }}
        aria-hidden='true'
      />

      <div className='container-custom py-14'>
        <div className='grid gap-10 md:grid-cols-2 lg:grid-cols-4'>
          {/* Brand + company column */}
          <div>
            <a href='/' className='font-mono text-sm tracking-tight text-white'>
              ProksiAbel
              <span className='text-[var(--color-mono-dim)]'>{' // '}</span>
              <span className='text-[var(--color-text-muted)]'>SEC_OPS</span>
            </a>
            <p className='mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]'>
              {t.footer.brandDescription}
            </p>
            <div className='mt-5 space-y-2'>
              <a
                href={`mailto:${contactInfo.email}`}
                className='flex items-center gap-2 text-sm text-[var(--color-text-body)] transition-colors hover:text-[var(--color-mono-dim)]'
              >
                <Mail className='h-4 w-4' aria-hidden='true' />
                {contactInfo.email}
              </a>
              <a
                href={`tel:${contactInfo.phone}`}
                className='flex items-center gap-2 text-sm text-[var(--color-text-body)] transition-colors hover:text-[var(--color-mono-dim)]'
              >
                <Phone className='h-4 w-4' aria-hidden='true' />
                {contactInfo.phoneDisplay}
              </a>
              <div className='flex items-start gap-2 text-sm text-[var(--color-text-muted)]'>
                <MapPin className='mt-0.5 h-4 w-4 flex-shrink-0' aria-hidden='true' />
                <span>{contactInfo.address.display}</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className='mb-4 font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]'>
                {col.title}
              </h3>
              <ul className='space-y-2.5'>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className='text-sm text-[var(--color-text-body)] transition-colors hover:text-white'
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className='mt-12 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-6 md:flex-row md:items-center md:justify-between'>
          <p className='font-mono text-xs text-[var(--color-text-muted)]'>
            © {currentYear} {contactInfo.company.name} · {t.footer.registrationLabel}{' '}
            {contactInfo.company.registrationCode} · {contactInfo.address.full}
          </p>
          <p className='font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]'>
            {t.footer.signedNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
