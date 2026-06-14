import { useState, useRef } from 'react';
import { Mail, MapPin, Phone, Github, Linkedin, Shield, Key } from 'lucide-react';
import { useTranslation } from '../i18n';
import { contactInfo } from '../data/contact';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AboutContact() {
  const { language } = useTranslation();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [messageSent, setMessageSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError(null);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!EMAIL_REGEX.test(email)) {
      setEmailError(
        language === 'et'
          ? 'Palun sisesta kehtiv e-posti aadress'
          : 'Please enter a valid email address',
      );
      return;
    }
    if (!message.trim()) return;

    const subject =
      language === 'et' ? 'Kontaktvorm - proksiabel.ee' : 'Contact Form - proksiabel.ee';
    const nl = '%0A';
    const body =
      language === 'et'
        ? `Nimi: ${name || 'Pole märgitud'}${nl}E-post: ${email}${nl}${nl}Sõnum:${nl}${message}`
        : `Name: ${name || 'Not specified'}${nl}Email: ${email}${nl}${nl}Message:${nl}${message}`;
    window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body).replace(/%0A/g, nl)}`;
    setMessageSent(true);
    formRef.current?.reset();
  };

  return (
    <section id="about" className="py-[--space-section] bg-[--bg-void]">
      <div className="max-w-content mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Bio + Contact info */}
          <div>
            <h2 className="font-display text-[--text-section-title] font-bold text-[--text-primary] mb-6">
              {language === 'et' ? 'Minust' : 'About'}
            </h2>

            <div className="prose prose-invert max-w-none">
              <p className="text-[--text-secondary] text-base leading-relaxed mb-4">
                {language === 'et'
                  ? 'Olen Tom Kristian Abel — süvatehnoloogia insener, kes tegutseb ründeturbe, AI taristu ja süsteemitehnika ristumiskohal. Pöördprojekteerisin Google\'i BotGuard VM-i. Ehitasin tootmiskõlblikke AI torustikke GPU pilvetaristul. Kavandasin ja juurutasin null-usalduse arhitektuure Kubernetes klastritele.'
                  : 'I\'m Tom Kristian Abel — a deep-tech engineer operating at the intersection of offensive security, AI infrastructure, and systems engineering. I reverse-engineered Google\'s BotGuard VM. I\'ve built production-grade AI pipelines on GPU cloud infrastructure. I\'ve designed and deployed zero-trust architectures for Kubernetes clusters.'}
              </p>
              <p className="text-[--text-secondary] text-base leading-relaxed mb-4">
                {language === 'et'
                  ? 'Enamik AI konsultante ei suuda oma torustikku punaselt testida. Enamik turbekonsultante ei oska mudelikaarti lugeda. Enamik süsteemiinsenere ei suuda vastandtööriistu ehitada. Mina teen kõike kolme — sest kõige huvitavamad probleemid asuvad ristumiskohal.'
                  : 'Most AI consultants can\'t red-team their own pipeline. Most security consultants can\'t read a model card. Most systems engineers can\'t build adversarial tooling. I do all three — because the most interesting problems live at the intersection.'}
              </p>
              <p className="text-[--text-secondary] text-base leading-relaxed">
                {language === 'et'
                  ? 'Tegutsen läbi ProksiAbel OÜ — Eesti ettevõte, mis on loodud B2B lepingute ja tehnilise konsultatsiooni jaoks. Kui sul on keeruline tehniline probleem, mis nõuab sügavust mitmes domeenis korraga, räägime.'
                  : 'I operate through ProksiAbel OÜ — an Estonian entity built for B2B contracting and technical consulting. If you have a hard technical problem that demands depth across multiple domains at once, let\'s talk.'}
              </p>
            </div>

            {/* Contact details */}
            <div className="mt-8 space-y-3">
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 text-sm text-[--text-secondary] hover:text-[--accent-intersection] transition-colors"
              >
                <Mail className="h-4 w-4" />
                {contactInfo.email}
              </a>
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-3 text-sm text-[--text-secondary] hover:text-[--accent-intersection] transition-colors"
              >
                <Phone className="h-4 w-4" />
                {contactInfo.phoneDisplay}
              </a>
              <div className="flex items-center gap-3 text-sm text-[--text-secondary]">
                <MapPin className="h-4 w-4" />
                <span>{contactInfo.address.full}</span>
              </div>
              <div className="flex items-center gap-3 pt-3">
                <a
                  href="https://github.com/tkabel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-[--text-muted] hover:text-[--accent-intersection] hover:bg-[--bg-surface] transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/tomkabel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-[--text-muted] hover:text-[--accent-intersection] hover:bg-[--bg-surface] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-display text-[--text-section-title] font-bold text-[--text-primary] mb-6">
              {language === 'et' ? 'Võta ühendust' : 'Get in Touch'}
            </h2>

            <div className="p-8 rounded-card border border-white/5 bg-[--bg-surface]">
              {/* Legal note */}
              <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl border border-[--accent-intersection]/20 bg-[--accent-intersection]/5">
                <Shield className="w-5 h-5 text-[--accent-intersection] shrink-0" />
                <p className="text-xs text-[--accent-intersection]/80 font-mono">
                  {language === 'et'
                    ? 'Kõik koostööd toimuvad läbi ProksiAbel OÜ (Reg. 17017826) — B2B lepingute juriidiline isik.'
                    : 'All engagements are facilitated through ProksiAbel OÜ (Reg. 17017826) — the legal entity for B2B contracting.'}
                </p>
              </div>

              {messageSent ? (
                <div className="text-center py-8">
                  <p className="text-[--accent-intersection] text-base font-medium">
                    {language === 'et'
                      ? 'Aitäh. Võtan varsti ühendust.'
                      : 'Thank you. I will get back to you shortly.'}
                  </p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-[--text-muted] uppercase tracking-wider mb-2">
                      {language === 'et' ? 'Nimi' : 'Name'}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder={language === 'et' ? 'Sinu nimi (valikuline)' : 'Your name (optional)'}
                      className="w-full px-4 py-3 rounded-lg bg-[--bg-void] border border-white/10 text-[--text-primary] text-sm placeholder:text-[--text-muted] focus:outline-none focus:border-[--accent-intersection]/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-[--text-muted] uppercase tracking-wider mb-2">
                      {language === 'et' ? 'E-post' : 'Email'}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 rounded-lg bg-[--bg-void] border text-[--text-primary] text-sm placeholder:text-[--text-muted] focus:outline-none transition-colors ${
                        emailError ? 'border-red-500' : 'border-white/10 focus:border-[--accent-intersection]/50'
                      }`}
                    />
                    {emailError && (
                      <p className="mt-1 text-xs text-red-500">{emailError}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-[--text-muted] uppercase tracking-wider mb-2">
                      {language === 'et' ? 'Sõnum' : 'Message'}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder={language === 'et' ? 'Mille kallal sa töötad?' : 'What are you working on?'}
                      className="w-full px-4 py-3 rounded-lg bg-[--bg-void] border border-white/10 text-[--text-primary] text-sm placeholder:text-[--text-muted] focus:outline-none focus:border-[--accent-intersection]/50 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-[--accent-intersection] text-[--bg-void] font-bold text-sm hover:bg-[--accent-intersection]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[--accent-intersection]/50"
                  >
                    {language === 'et' ? 'Saada sõnum' : 'Send Message'}
                  </button>
                </form>
              )}

              {/* PGP link */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <a
                  href="/#pgp"
                  className="inline-flex items-center gap-2 text-xs text-[--text-muted] hover:text-[--accent-intersection] transition-colors"
                >
                  <Key className="h-3 w-3" />
                  {language === 'et' ? 'PGP võti krüpteeritud suhtluseks' : 'PGP Key for encrypted communication'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
