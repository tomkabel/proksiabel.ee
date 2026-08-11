import { ArrowRight, CheckCircle2, Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import { contactInfo } from '../data/contact';
import { useTranslation } from '../i18n';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const { t, language } = useTranslation();
  const [emailError, setEmailError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError(false);
    setMessageError(false);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Evaluate both fields independently so every error is shown at once.
    const emailValid = EMAIL_REGEX.test(email);
    const messageValid = message.trim().length > 0;
    setEmailError(!emailValid);
    setMessageError(!messageValid);
    if (!emailValid || !messageValid) {
      return;
    }

    const subject =
      language === 'et' ? 'Kontaktvorm - proksiabel.ee' : 'Contact Form - proksiabel.ee';

    // CRLF per RFC 6068 so encodeURIComponent emits %0D%0A line separators.
    // Normalize user-entered line breaks too — they may be LF.
    const nl = '\r\n';
    const messageCrlf = message.replace(/\r\n|\r|\n/g, '\r\n');
    const body =
      language === 'et'
        ? 'Nimi: ' +
          (name || 'Pole märgitud') +
          nl +
          'E-post: ' +
          email +
          nl +
          nl +
          'Sõnum:' +
          nl +
          messageCrlf
        : 'Name: ' +
          (name || 'Not specified') +
          nl +
          'Email: ' +
          email +
          nl +
          nl +
          'Message:' +
          nl +
          messageCrlf;

    const mailtoLink =
      'mailto:' +
      contactInfo.email +
      '?subject=' +
      encodeURIComponent(subject) +
      '&body=' +
      encodeURIComponent(body);

    window.location.href = mailtoLink;
    setMessageSent(true);
    formRef.current?.reset();
  };

  const contactMethods = [
    {
      icon: Mail,
      title: t.contact.email,
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
      color: 'from-sky-500 to-sky-600',
    },
    {
      icon: Phone,
      title: t.contact.call,
      value: contactInfo.phoneDisplay,
      href: `tel:${contactInfo.phone}`,
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: MapPin,
      title: t.contact.address,
      value: contactInfo.address.display,
      href: null,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <section id='contact' className='section-padding relative overflow-hidden'>
      <div className='relative z-10 container-custom'>
        <div className='text-center mb-16 animate-fade-in'>
          <div className='accent-line mx-auto mb-6' />
          <h2 className='heading-2 mb-4'>{t.contact.title}</h2>
          <p className='body-large text-slate-400 max-w-3xl mx-auto'>{t.contact.description}</p>
        </div>

        <div className='grid lg:grid-cols-3 gap-8 mb-12'>
          {contactMethods.map((method, index) => {
            const content = (
              <>
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <method.icon className='h-6 w-6 text-white' />
                </div>
                <h3 className='text-lg font-semibold text-white mb-2'>{method.title}</h3>
                <p
                  className={`text-sm ${method.href ? 'text-sky-400 group-hover:text-sky-300' : 'text-slate-400'} transition-colors`}
                >
                  {method.value}
                </p>
              </>
            );
            const cardClass = 'block glass-card-hover p-8 text-center h-full';
            return (
              <div
                key={method.title}
                className='group animate-slide-up'
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {method.href ? (
                  <a href={method.href} className={cardClass}>
                    {content}
                  </a>
                ) : (
                  <div className={cardClass}>{content}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className='max-w-2xl mx-auto animate-slide-up stagger-3'>
          <div className='glass-card p-8 md:p-10'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center'>
                <Send className='h-5 w-5 text-white' />
              </div>
              <h3 className='text-xl font-bold text-white'>{t.contact.form.title}</h3>
            </div>

            {messageSent && (
              <div
                className='mb-6 p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center gap-3'
                role='alert'
              >
                <CheckCircle2 className='h-5 w-5 text-teal-400 flex-shrink-0' />
                <p className='text-teal-300'>{t.contact.form.success}</p>
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className='space-y-5' noValidate>
              <div>
                <label htmlFor='name' className='input-label'>
                  {t.contact.form.name}
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  placeholder={t.contact.form.namePlaceholder}
                  className='input-field'
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
                  className={`input-field ${emailError ? 'border-red-500' : ''}`}
                  autoComplete='email'
                />
                {emailError && (
                  <p id='email-error' className='text-red-400 text-sm mt-1' role='alert'>
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
                  className={`input-field resize-none ${messageError ? 'border-red-500' : ''}`}
                />
                {messageError && (
                  <p id='message-error' className='text-red-400 text-sm mt-1' role='alert'>
                    {t.contact.form.errors.message}
                  </p>
                )}
              </div>

              <button
                type='submit'
                className='glow-button w-full flex items-center justify-center gap-2 text-base'
              >
                {t.contact.form.send}
                <ArrowRight className='h-5 w-5' />
              </button>
            </form>

            <div className='flex items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-700/50'>
              <div className='flex items-center gap-2 text-sm text-slate-400'>
                <Clock className='h-4 w-4' />
                <span>{t.contact.responseTime}</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-slate-400'>
                <CheckCircle2 className='h-4 w-4' />
                <span>{t.contact.secureConfidential}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
