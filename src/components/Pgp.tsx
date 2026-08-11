import { Key } from 'lucide-react';
import { PGP_FINGERPRINT } from '../config/pgp';
import { useTranslation } from '../i18n';

export default function Pgp() {
  const { t } = useTranslation();

  return (
    <section id='pgp' className='section-padding relative overflow-hidden'>
      <div className='relative z-10 container-custom'>
        {/* Section Header */}
        <div className='text-center mb-12 animate-fade-in'>
          <div className='accent-line mx-auto mb-6' />
          <h2 className='heading-2 mb-4'>{t.pgp.title}</h2>
          <p className='body-large text-slate-400 max-w-2xl mx-auto'>{t.pgp.description}</p>
        </div>

        {/* Key Download Card */}
        <div className='max-w-xl mx-auto animate-slide-up'>
          <div className='glass-card p-8 md:p-10 flex flex-col items-center text-center'>
            <div className='relative mb-6'>
              <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-lg shadow-sky-500/30'>
                <Key className='h-8 w-8 text-white' aria-hidden='true' />
              </div>
              <div
                className='absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 opacity-30 blur-xl'
                aria-hidden='true'
              />
            </div>
            <a
              href='/public-key.asc'
              download='public-key.asc'
              className='glow-button inline-flex items-center justify-center gap-2'
            >
              {t.pgp.download}
            </a>
            {/* Key fingerprint metadata — lets recipients verify the key out-of-band */}
            <div className='mt-5 text-center'>
              <p className='text-xs text-slate-400 mb-1'>{t.pgp.fingerprint}</p>
              <p className='font-mono text-xs text-slate-300 break-all'>{PGP_FINGERPRINT}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
