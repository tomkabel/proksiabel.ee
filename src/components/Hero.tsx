import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslation } from '../i18n';
import AttackVectorGraph from './AttackVectorGraph';

export default function Hero() {
  const { t } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='relative min-h-screen flex items-center overflow-hidden'>
      {/* Animated Background — decorative canvas is a single fixed layer in App.tsx */}

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
              <span className='text-white'>{t.hero.heading}</span>{' '}
              <span className='text-[var(--color-text-body)]'>{t.hero.subheading}</span>
            </h1>

            {/* Description */}
            <p className='body-large text-slate-400 mb-10 max-w-xl'>{t.hero.description}</p>

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

          {/* Right Content - Interactive AiTM Attack Vector Graph */}
          <div className='animate-slide-up stagger-2'>
            <div className='relative'>
              {/* Background Glow */}
              <div
                className='absolute inset-0 bg-gradient-to-br from-sky-500/15 to-rose-500/10 rounded-3xl blur-2xl'
                aria-hidden='true'
              />

              <AttackVectorGraph />
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
