import { Zap, Users, FlaskConical } from 'lucide-react';
import { useTranslation } from '../i18n';

const models = [
  {
    icon: Zap,
    title: { en: 'Deep Dive', et: 'Süvitsi Minek' },
    duration: { en: '2–4 week engagement', et: '2–4 nädalane projekt' },
    deliverables: {
      en: 'Technical report, proof-of-concept tooling, architectural recommendations',
      et: 'Tehniline raport, kontseptsiooni tõestus, arhitektuuri soovitused',
    },
    bestFor: {
      en: 'When you need a specific technical problem solved — reverse engineering a component, hardening an architecture, or building a custom security tool.',
      et: 'Kui vajad konkreetse tehnilise probleemi lahendamist — komponendi pöördprojekteerimist, arhitektuuri turvapaikamist või kohandatud turvatööriista ehitamist.',
    },
  },
  {
    icon: Users,
    title: { en: 'Technical Advisory', et: 'Tehniline Nõustamine' },
    duration: { en: 'Ongoing, monthly retainer', et: 'Jooksev, igakuine leping' },
    deliverables: {
      en: 'Architecture reviews, security assessments, technical strategy, team mentoring',
      et: 'Arhitektuuri ülevaatused, turvahinnangud, tehniline strateegia, meeskonna mentorlus',
    },
    bestFor: {
      en: 'When you need ongoing technical judgment on security, AI infrastructure, or systems design — without hiring a full-time principal engineer.',
      et: 'Kui vajad jooksvat tehnilist hinnangut turbe, AI taristu või süsteemidisaini osas — ilma täiskohaga peainseneri palkamiseta.',
    },
  },
  {
    icon: FlaskConical,
    title: { en: 'Research Collaboration', et: 'Teaduskoostöö' },
    duration: { en: 'Project-defined, output-driven', et: 'Projektipõhine, tulemusele orienteeritud' },
    deliverables: {
      en: 'Joint publication, open-source tooling, shared IP where agreed',
      et: 'Ühispublikatsioon, avatud lähtekoodiga tööriistad, jagatud IP kokkuleppel',
    },
    bestFor: {
      en: 'When you want to publish original research, build open-source security tooling, or collaborate on advancing the state of the art.',
      et: 'Kui soovid avaldada originaaluuringut, ehitada avatud lähtekoodiga turvatööriistu või teha koostööd teaduse arendamiseks.',
    },
  },
];

export default function EngagementModels() {
  const { language } = useTranslation();

  return (
    <section id="engagement" className="py-[--space-section] bg-[--bg-surface]">
      <div className="max-w-content mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-[--text-section-title] font-bold text-[--text-primary] mb-4">
            {language === 'et' ? 'Koostöövormid' : 'Engagement Models'}
          </h2>
          <p className="text-[--text-secondary] text-base max-w-lg mx-auto">
            {language === 'et'
              ? 'Paindlikud formaadid sõltuvalt sinu vajadustest. Ükski hind ei ole avalik — iga koostöö on erinev.'
              : 'Flexible formats depending on your needs. No pricing is public — every engagement is different.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <div
                key={model.title.en}
                className="p-8 rounded-card border border-white/5 bg-[--bg-void] hover:border-[--accent-intersection]/20 transition-all duration-[--duration-normal]"
              >
                <div className="w-12 h-12 rounded-xl bg-[--bg-elevated] flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-[--accent-intersection]" />
                </div>

                <h3 className="font-display font-bold text-lg text-[--text-primary] mb-2">
                  {model.title[language as 'en' | 'et']}
                </h3>

                <p className="text-xs font-mono uppercase tracking-wider text-[--accent-intersection] mb-4">
                  {model.duration[language as 'en' | 'et']}
                </p>

                <div className="mb-4">
                  <h4 className="text-xs font-bold text-[--text-muted] uppercase tracking-wider mb-2">
                    {language === 'et' ? 'Tüüpilised tulemused' : 'Typical Deliverables'}
                  </h4>
                  <p className="text-[--text-secondary] text-sm">
                    {model.deliverables[language as 'en' | 'et']}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[--text-muted] uppercase tracking-wider mb-2">
                    {language === 'et' ? 'Sobib...' : 'Best for...'}
                  </h4>
                  <p className="text-[--text-secondary] text-sm leading-relaxed">
                    {model.bestFor[language as 'en' | 'et']}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
