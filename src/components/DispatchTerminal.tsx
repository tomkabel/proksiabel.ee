import { ArrowRight, Check, CheckCircle2, Clock, Copy, Download, Mail, Phone } from 'lucide-react';
import { type FormEvent, useRef, useState } from 'react';
import { PGP_FINGERPRINT, PGP_KEY_ID } from '../config/pgp';
import { contactInfo } from '../data/contact';
import { useTranslation } from '../i18n';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Encrypted Dispatch Terminal — consolidates the former Contact form and PGP
 * section into one command center. Left: intent, interactive PGP micro-chip
 * (copy fingerprint / download .asc), and direct channels. Right: the intake
 * form. The form still composes a mailto: link (no backend), preserving the
 * prior behaviour and the CRLF/RFC-6068 body encoding.
 */
export default function DispatchTerminal() {
  const { t, language } = useTranslation();
  const [emailError, setEmailError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const copyFingerprint = async () => {
    try {
      await navigator.clipboard.writeText(PGP_FINGERPRINT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (insecure context / denied) — no-op.
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError(false);
    setMessageError(false);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    const emailValid = EMAIL_REGEX.test(email);
    const messageValid = message.trim().length > 0;
    setEmailError(!emailValid);
    setMessageError(!messageValid);
    if (!emailValid || !messageValid) {
      return;
    }

    const subject =
      language === 'et' ? 'Kontaktvorm - proksiabel.ee' : 'Contact Form - proksiabel.ee';

    const nl = '\r\n';
    const messageCrlf = message.replace(/\r\n|\r|\n/g, '\r\n');
    const body =
      language === 'et'
        ? `Nimi: ${name || 'Pole märgitud'}${nl}E-post: ${email}${nl}${nl}Sõnum:${nl}${messageCrlf}`
        : `Name: ${name || 'Not specified'}${nl}Email: ${email}${nl}${nl}Message:${nl}${messageCrlf}`;

    window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setMessageSent(true);
    formRef.current?.reset();
  };

  return (
    <section id='contact' className='section-padding relative overflow-hidden'>
      {/* Anchor alias so legacy #pgp links still land here. */}
      <span id='pgp' className='absolute -top-24' aria-hidden='true' />
      <div className='relative z-10 container-custom'>
        <div className='mb-10 text-center'>
          <span className='mono-badge mb-4'>{t.contact.dispatchTag}</span>
          <h2 className='heading-2 mb-4'>{t.contact.title}</h2>
        </div>

        <div className='obsidian-card grid gap-0 md:grid-cols-2'>
          {/* Left — intent + PGP + channels */}
          <div className='border-b border-[var(--border-subtle)] p-8 md:border-b-0 md:border-r'>
            <h3 className='text-xl font-semibold text-white'>{t.contact.directTitle}</h3>
            <p className='mt-2 text-[var(--color-text-body)]'>{t.contact.directIntro}</p>

            {/* PGP micro-chip */}
            <div
              className='mt-6 rounded-xl border p-4'
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--color-surface-2)',
              }}
            >
              <div className='mb-2 flex items-center justify-between'>
                <span className='font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]'>
                  🔐 {t.contact.pgpTitle}
                </span>
                <a
                  href='/public-key.asc'
                  download='public-key.asc'
                  className='inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] px-2 py-1 font-mono text-[11px] text-[var(--color-text-body)] transition-colors hover:text-white'
                >
                  <Download className='h-3 w-3' aria-hidden='true' />
                  {t.contact.downloadKey}
                </a>
              </div>
              <p className='font-mono text-[11px] text-[var(--color-text-muted)]'>{PGP_KEY_ID}</p>
              <div className='mt-2 flex items-center gap-2'>
                <code className='flex-1 truncate font-mono text-xs text-[var(--color-text-body)]'>
                  {PGP_FINGERPRINT}
                </code>
                <button
                  type='button'
                  onClick={copyFingerprint}
                  className='inline-flex flex-shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] transition-colors'
                  style={{
                    borderColor: copied ? 'var(--color-signal-success)' : 'var(--border-subtle)',
                    color: copied ? 'var(--color-signal-success)' : 'var(--color-text-body)',
                  }}
                >
                  {copied ? (
                    <Check className='h-3 w-3' aria-hidden='true' />
                  ) : (
                    <Copy className='h-3 w-3' aria-hidden='true' />
                  )}
                  {copied ? t.contact.copied : t.contact.copy}
                </button>
              </div>
              <span className='sr-only' role='status' aria-live='polite'>
                {copied ? t.contact.copied : ''}
              </span>
            </div>

            {/* Direct channels */}
            <div className='mt-6 space-y-3'>
              <a
                href={`mailto:${contactInfo.email}`}
                className='flex items-center gap-3 text-sm text-[var(--color-text-body)] transition-colors hover:text-[var(--color-mono-dim)]'
              >
                <Mail className='h-4 w-4' aria-hidden='true' />
                {contactInfo.email}
              </a>
              <a
                href={`tel:${contactInfo.phone}`}
                className='flex items-center gap-3 text-sm text-[var(--color-text-body)] transition-colors hover:text-[var(--color-mono-dim)]'
              >
                <Phone className='h-4 w-4' aria-hidden='true' />
                {contactInfo.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Right — intake form */}
          <div className='p-8'>
            {messageSent && (
              <div
                className='mb-6 flex items-center gap-3 rounded-xl border p-4'
                role='alert'
                style={{
                  borderColor: 'color-mix(in oklab, var(--color-signal-success) 30%, transparent)',
                  backgroundColor:
                    'color-mix(in oklab, var(--color-signal-success) 8%, transparent)',
                }}
              >
                <CheckCircle2
                  className='h-5 w-5 flex-shrink-0'
                  style={{ color: 'var(--color-signal-success)' }}
                />
                <p className='text-sm text-[var(--color-text-body)]'>{t.contact.form.success}</p>
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className='space-y-4' noValidate>
              <div>
                <label htmlFor='name' className='input-label'>
                  {t.contact.form.name}
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  placeholder={t.contact.form.namePlaceholder}
                  className='field-glow'
                  autoComplete='name'
                />
              </div>

              <div>
                <label htmlFor='email' className='input-label'>
                  {t.contact.form.email} *
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  placeholder={t.contact.form.emailPlaceholder}
                  required
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                  className='field-glow'
                  style={emailError ? { borderColor: 'var(--color-signal-critical)' } : undefined}
                  autoComplete='email'
                />
                {emailError && (
                  <p
                    id='email-error'
                    className='mt-1 text-sm'
                    role='alert'
                    style={{ color: 'var(--color-signal-critical)' }}
                  >
                    {t.contact.form.errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor='message' className='input-label'>
                  {t.contact.form.message} *
                </label>
                <textarea
                  id='message'
                  name='message'
                  rows={5}
                  placeholder={t.contact.form.messagePlaceholder}
                  required
                  aria-invalid={!!messageError}
                  aria-describedby={messageError ? 'message-error' : undefined}
                  className='field-glow resize-none'
                  style={messageError ? { borderColor: 'var(--color-signal-critical)' } : undefined}
                />
                {messageError && (
                  <p
                    id='message-error'
                    className='mt-1 text-sm'
                    role='alert'
                    style={{ color: 'var(--color-signal-critical)' }}
                  >
                    {t.contact.form.errors.message}
                  </p>
                )}
              </div>

              <button
                type='submit'
                className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_10px_20px_-10px_rgba(2,132,199,0.5)] transition-all duration-200 ease-[var(--ease-spring)] hover:bg-sky-500 active:scale-[0.99]'
              >
                {t.contact.form.send}
                <ArrowRight className='h-5 w-5' aria-hidden='true' />
              </button>
            </form>

            <div className='mt-5 flex flex-wrap items-center gap-4 border-t border-[var(--border-subtle)] pt-5'>
              <span className='flex items-center gap-2 text-xs text-[var(--color-text-muted)]'>
                <Clock className='h-4 w-4' aria-hidden='true' />
                {t.contact.ndaNote}
              </span>
              <span className='flex items-center gap-2 text-xs text-[var(--color-text-muted)]'>
                <CheckCircle2 className='h-4 w-4' aria-hidden='true' />
                {t.contact.secureConfidential}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
