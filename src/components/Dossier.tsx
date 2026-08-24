import { Award, Code, ExternalLink, Eye, MapPin, Shield, ShieldCheck, Trophy } from 'lucide-react';
import React from 'react';
import { PGP_KEY_ID } from '../config/pgp';
import { useTranslation } from '../i18n';

// Technical arsenal — concise capability tokens, intentionally not translated.
const ARSENAL = ['Golang', 'Reverse Engineering', 'AiTM / MitM', 'Full-Stack Web'];

/**
 * Operator Dossier — consolidates the former Expertise and About sections into a
 * single high-status founder profile: editorial portrait with status overlay and
 * a cryptographic identity tag on the left, engineering philosophy, arsenal, and
 * focus areas on the right. Company registry data lives in the footer.
 */
export default function Dossier() {
  const { t } = useTranslation();
  const e = t.expertise;
  const [imgFailed, setImgFailed] = React.useState(false);

  const focus = [
    { icon: Code, title: e.technical.title, description: e.technical.description },
    { icon: Eye, title: e.offensive.title, description: e.offensive.description },
    { icon: Shield, title: e.defensive.title, description: e.defensive.description },
  ];

  return (
    <section id='about' className='section-padding relative overflow-hidden'>
      {/* Anchor alias so legacy #expertise links still land here. */}
      <span id='expertise' className='absolute -top-24' aria-hidden='true' />
      <div className='relative z-10 container-custom'>
        <div className='grid items-start gap-8 lg:grid-cols-5 lg:gap-12'>
          {/* Left — editorial portrait */}
          <div className='lg:col-span-2'>
            <div className='obsidian-card relative aspect-[3/4] overflow-hidden p-0'>
              <div className='absolute inset-0 bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-void)]' />
              {imgFailed ? (
                <div className='absolute inset-0 flex flex-col items-center justify-center gap-3'>
                  <Shield className='h-12 w-12 text-[var(--color-mono-dim)]' aria-hidden='true' />
                  <span className='text-sm text-[var(--color-text-muted)]'>{e.name}</span>
                </div>
              ) : (
                <img
                  src='/expert.webp'
                  alt={`${e.name} — ${e.role}, ProksiAbel OÜ`}
                  className='relative h-full w-full object-cover grayscale contrast-110'
                  loading='lazy'
                  decoding='async'
                  onError={() => setImgFailed(true)}
                />
              )}
              {/* Cold cyan rim + bottom scrim */}
              <div className='absolute inset-0 bg-gradient-to-t from-[var(--color-void)] via-transparent to-transparent' />

              {/* Status overlay */}
              <div className='absolute left-3 top-3'>
                <span className='glass-pill inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] text-white'>
                  <MapPin className='h-3 w-3' aria-hidden='true' />
                  {e.location}
                </span>
              </div>

              {/* Cryptographic identity tag */}
              <div className='absolute inset-x-3 bottom-3'>
                <span className='mono-badge w-full justify-center truncate'>{PGP_KEY_ID}</span>
              </div>
            </div>
          </div>

          {/* Right — dossier body */}
          <div className='lg:col-span-3'>
            <span className='mono-badge mb-4'>{e.dossierLabel}</span>
            <div className='mb-4 flex flex-wrap items-center gap-3'>
              <h2 className='heading-2'>{e.name}</h2>
              <span
                className='inline-flex items-center rounded-full px-3 py-1 text-sm font-medium'
                style={{
                  color: 'var(--color-mono-dim)',
                  backgroundColor: 'color-mix(in oklab, var(--color-mono-dim) 12%, transparent)',
                }}
              >
                {e.role}
              </span>
            </div>

            {/* Philosophy quote */}
            <blockquote className='relative mb-6 pl-5'>
              <div
                className='absolute bottom-0 left-0 top-0 w-0.5 rounded-full'
                style={{ backgroundColor: 'var(--color-cyan-core)' }}
              />
              <p className='text-lg font-medium italic text-white'>“{e.quote}”</p>
            </blockquote>

            <div className='mb-8 space-y-4'>
              <p className='leading-relaxed text-[var(--color-text-body)]'>{e.bio1}</p>
              <p className='leading-relaxed text-[var(--color-text-muted)]'>{e.bio2}</p>
            </div>

            {/* Arsenal */}
            <div className='mb-8'>
              <div className='mb-3 flex items-center gap-2'>
                <Award className='h-4 w-4 text-[var(--color-mono-dim)]' aria-hidden='true' />
                <span className='font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]'>
                  {e.arsenalTitle}
                </span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {ARSENAL.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-full border border-[var(--border-subtle)] px-3 py-1 font-mono text-xs text-[var(--color-text-body)]'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Recognition — external, verifiable credential */}
            <a
              href={e.recognition.url}
              target='_blank'
              rel='noopener noreferrer'
              className='mb-8 block rounded-xl border p-4 transition-colors hover:border-[var(--border-active-glow)]'
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--color-surface-2)',
              }}
            >
              <div className='flex items-center gap-2'>
                <Trophy
                  className='h-4 w-4 flex-shrink-0'
                  style={{ color: 'var(--color-signal-warning)' }}
                  aria-hidden='true'
                />
                <span className='font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]'>
                  {e.recognition.title}
                </span>
              </div>
              <p className='mt-2 font-semibold text-white'>{e.recognition.project}</p>
              <p className='mt-1 text-sm text-[var(--color-text-body)]'>{e.recognition.detail}</p>
              <span className='mt-2 inline-flex items-center gap-1 text-xs text-[var(--color-mono-dim)]'>
                {e.recognition.link}
                <ExternalLink className='h-3 w-3' aria-hidden='true' />
              </span>
            </a>

            {/* Coordinated disclosure — found & fixed in Estonian gov code */}
            <div className='mb-8'>
              <div className='mb-3 flex items-center gap-2'>
                <ShieldCheck
                  className='h-4 w-4'
                  style={{ color: 'var(--color-signal-success)' }}
                  aria-hidden='true'
                />
                <span className='font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]'>
                  {e.disclosure.title}
                </span>
              </div>
              <p className='text-sm leading-relaxed text-[var(--color-text-body)]'>
                {e.disclosure.lead}
              </p>
              <ul className='mt-3 space-y-2'>
                {e.disclosure.items.map((item) => (
                  <li key={item} className='flex items-start gap-2.5'>
                    <span
                      className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full'
                      style={{ backgroundColor: 'var(--color-signal-success)' }}
                      aria-hidden='true'
                    />
                    <span className='font-mono text-xs leading-relaxed text-[var(--color-text-body)]'>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className='mt-3 font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]'>
                {e.disclosure.note}
              </p>
            </div>

            {/* Focus areas */}
            <div className='grid gap-3 sm:grid-cols-1'>
              {focus.map((item) => (
                <div
                  key={item.title}
                  className='flex items-start gap-3 rounded-xl border border-[var(--border-subtle)] p-4 transition-colors hover:border-[var(--border-active-glow)]'
                  style={{ backgroundColor: 'var(--color-surface-2)' }}
                >
                  <div
                    className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg'
                    style={{
                      backgroundColor:
                        'color-mix(in oklab, var(--color-cyan-core) 10%, transparent)',
                    }}
                  >
                    <item.icon className='h-5 w-5 text-[var(--color-mono-dim)]' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-white'>{item.title}</h3>
                    <p className='mt-0.5 text-sm text-[var(--color-text-body)]'>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
