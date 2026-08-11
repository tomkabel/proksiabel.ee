import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslation } from '../i18n';
import AttackTerminal from './AttackTerminal';

export default function Hero() {
  const { t } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='relative min-h-screen flex items-center overflow-hidden bg-slate-900'>
      {/* Animated Background */}
      <div className='absolute inset-0 bg-mesh bg-grid' aria-hidden='true' />

      {/* Gradient Orbs */}
      <div
        className='absolute top-1/4 -left-32 w-96 h-96 bg-sky-500/20 rounded-full blur-[128px] animate-pulse-slow'
        aria-hidden='true'
      />
      <div
        className='absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-[128px] animate-pulse-slow'
        style={{ animationDelay: '2s' }}
        aria-hidden='true'
      />
      <div
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[100px]'
        aria-hidden='true'
      />

      {/* Grid Pattern Overlay */}
      <div className='absolute inset-0 bg-grid opacity-50' aria-hidden='true' />

      <div className='relative z-10 container-custom pt-32 pb-20'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
          {/* Left Content */}
          <div className='animate-fade-in'>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-white/10 backdrop-blur-sm mb-6'>
              <span className='relative flex h-2 w-2'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75'></span>
                <span className='relative inline-flex rounded-full h-2 w-2 bg-teal-500'></span>
              </span>
              <span className='text-sm font-medium text-slate-300'>{t.hero.badge}</span>
            </div>

            {/* Heading */}
            <h1 className='heading-1 mb-6'>
              <span className='text-white'>{t.hero.heading}</span>
              <br />
              <span className='gradient-text'>{t.hero.subheading}</span>
            </h1>

            {/* Description */}
            <p className='body-large text-slate-400 mb-8 max-w-xl'>{t.hero.description}</p>

            {/* Quote */}
            <blockquote className='relative pl-6 mb-10'>
              <div className='absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 to-teal-500 rounded-full' />
              <p className='text-lg text-teal-400 italic font-medium'>"{t.hero.quote}"</p>
            </blockquote>

            {/* CTAs */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <a
                href='#contact'
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
                className='glow-button inline-flex items-center justify-center gap-2 text-base'
              >
                {t.hero.bookConsultation}
                <ArrowRight className='h-5 w-5' />
              </a>
              <a
                href='#services'
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('services');
                }}
                className='glow-button-secondary inline-flex items-center justify-center gap-2 text-base'
              >
                {t.hero.learnMore}
                <ArrowRight className='h-5 w-5' />
              </a>
            </div>
          </div>

          {/* Right Content - Live Attack Surface Scan */}
          <div className='animate-slide-up stagger-2'>
            <div className='relative'>
              {/* Background Glow */}
              <div
                className='absolute inset-0 bg-gradient-to-br from-sky-500/20 to-teal-500/20 rounded-3xl blur-2xl'
                aria-hidden='true'
              />

              <AttackTerminal onSelectService={() => scrollToSection('services')} />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='flex justify-center mt-16'>
          <button
            type='button'
            onClick={() => scrollToSection('services')}
            className='flex flex-col items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors animate-float'
          >
            <span className='text-sm font-medium'>{t.hero.exploreServices}</span>
            <ChevronDown className='h-5 w-5' />
          </button>
        </div>
      </div>
    </div>
  );
}
