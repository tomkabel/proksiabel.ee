import { Shield, Cpu, Server } from 'lucide-react';
import { useTranslation } from '../i18n';

const capabilities = [
  {
    icon: Shield,
    zoneId: 'sec-ai',
    title: { en: 'Adversarial Research', et: 'Vastand-Uurimistöö' },
    description: {
      en: 'Reverse-engineering hostile software, deconstructing obfuscated virtual machines, and red-teaming AI systems. From Google\'s BotGuard VM internals to LLM guardrail bypass testing — understanding how adversarial systems work is the foundation of defending against them.',
      et: 'Vaenuliku tarkvara pöördprojekteerimine, obfitseeritud virtuaalmasinate lahtimonteerimine ja AI-süsteemide punane testimine. Google\'i BotGuard VM sisearhitektuurist LLM piirete testimiseni — vaenulike süsteemide mõistmine on nende vastu kaitsmise alus.',
    },
  },
  {
    icon: Cpu,
    zoneId: 'ai-sys',
    title: { en: 'AI Infrastructure', et: 'AI Taristu' },
    description: {
      en: 'Architecting production-grade AI pipelines with GPU orchestration, serverless inference, and async job queues. Building the infrastructure that turns research artifacts into reliable, observable, and maintainable production systems.',
      et: 'Tootmiskõlblike AI torustike arhitekteerimine GPU orkestreerimise, serverita inferentsi ja asünkroonsete tööjärjekordadega. Taristu ehitamine, mis muudab teaduslikud artefaktid töökindlateks tootmissüsteemideks.',
    },
  },
  {
    icon: Server,
    zoneId: 'sec-sys',
    title: { en: 'Systems Architecture', et: 'Süsteemiarhitektuur' },
    description: {
      en: 'Designing distributed, resilient systems with zero-trust architecture, custom transport layers, and infrastructure automation. From consensus algorithms to Kubernetes security operators — building foundations that hold under pressure.',
      et: 'Jaotatud, vastupidavate süsteemide projekteerimine null-usalduse arhitektuuri, kohandatud transpordikihtide ja taristu automatiseerimisega. Konsensuse algoritmidest Kubernetes turvaoperaatoriteni — vundamentide ehitamine, mis surve all püsivad.',
    },
  },
];

export default function Capabilities() {
  const { language } = useTranslation();

  return (
    <section id="capabilities" className="py-[--space-section] bg-[--bg-void]">
      <div className="max-w-content mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-[--text-section-title] font-bold text-[--text-primary] mb-4">
            {language === 'et' ? 'Võimekused' : 'Capabilities'}
          </h2>
          <p className="text-[--text-secondary] text-base max-w-lg mx-auto">
            {language === 'et'
              ? 'Süvatehniline ekspertiis kolmes omavahel seotud valdkonnas.'
              : 'Deep technical expertise across three interconnected domains.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <a
                key={cap.zoneId}
                href={`#intersection`}
                className="group p-8 rounded-card border border-white/5 bg-[--bg-surface] hover:bg-[--bg-elevated] transition-all duration-[--duration-normal] hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[--bg-elevated] flex items-center justify-center mb-6 group-hover:bg-[--accent-intersection]/10 transition-colors">
                  <Icon className="h-6 w-6 text-[--accent-intersection]" />
                </div>
                <h3 className="font-display font-bold text-lg text-[--text-primary] mb-3">
                  {cap.title[language as 'en' | 'et']}
                </h3>
                <p className="text-[--text-secondary] text-sm leading-relaxed">
                  {cap.description[language as 'en' | 'et']}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
