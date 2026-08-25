import { ChevronRight, Globe, Menu, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { t, language, setLanguage } = useTranslation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      mobileMenuRef.current?.focus();
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'et' ? 'en' : 'et');
  }, [language, setLanguage]);

  const navLinks = [
    { href: '/#services', label: t.nav.services },
    { href: '/#about', label: t.nav.dossier },
    { href: '/#contact', label: t.nav.contact },
  ];

  return (
    <div className='pointer-events-none fixed top-0 left-0 right-0 z-50 flex justify-center px-4'>
      <nav
        aria-label='Primary'
        className={`glass-pill pointer-events-auto mt-4 w-full max-w-5xl rounded-2xl transition-all duration-500 ${
          scrolled ? 'shadow-2xl shadow-black/40' : 'shadow-lg shadow-black/20'
        }`}
      >
        <div
          className={`flex items-center justify-between px-4 sm:px-5 transition-all duration-500 ${
            scrolled ? 'h-14' : 'h-16'
          }`}
        >
          {/* Brand — monospace tag + breathing status dot */}
          <a href='/' className='group flex items-center gap-2.5' title={t.nav.statusOperational}>
            <span className='relative flex h-2 w-2' aria-hidden='true'>
              <span
                className='absolute inline-flex h-full w-full animate-ping rounded-full opacity-75'
                style={{ backgroundColor: 'var(--color-signal-success)' }}
              />
              <span
                className='relative inline-flex h-2 w-2 rounded-full'
                style={{ backgroundColor: 'var(--color-signal-success)' }}
              />
            </span>
            <span className='font-mono text-sm tracking-tight text-white'>
              ProksiAbel
              <span className='text-[var(--color-mono-dim)]'>{' // '}</span>
              <span className='text-[var(--color-text-muted)] group-hover:text-[var(--color-mono-dim)] transition-colors'>
                SEC_OPS
              </span>
            </span>
          </a>

          {/* Desktop nav links */}
          <div className='hidden lg:flex items-center gap-1'>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className='group relative rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-body)] transition-colors duration-200 hover:text-white'
              >
                {link.label}
                <span
                  className='absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 bg-[var(--color-cyan-core)] transition-transform duration-300 group-hover:scale-x-100'
                  aria-hidden='true'
                />
              </a>
            ))}
          </div>

          {/* Right side — language + CTA */}
          <div className='hidden lg:flex items-center gap-2'>
            <button
              type='button'
              onClick={toggleLanguage}
              className='flex items-center gap-1.5 rounded-lg px-2.5 py-2 font-mono text-xs font-medium uppercase text-[var(--color-text-muted)] transition-all duration-200 hover:bg-[var(--color-surface-3)] hover:text-white'
              aria-label={language === 'et' ? 'Switch to English' : 'Switch to Estonian'}
            >
              <Globe className='h-4 w-4' aria-hidden='true' />
              <span>{language}</span>
            </button>

            <a
              href='/#contact'
              className='inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_10px_20px_-10px_rgba(2,132,199,0.5)] transition-all duration-200 ease-[var(--ease-spring)] hover:bg-sky-500 active:scale-[0.98]'
            >
              {t.nav.bookAudit}
              <ChevronRight className='h-4 w-4' aria-hidden='true' />
            </a>
          </div>

          {/* Mobile controls */}
          <div className='flex items-center gap-1 lg:hidden'>
            <button
              type='button'
              onClick={toggleLanguage}
              className='rounded-lg p-2 text-[var(--color-text-muted)] transition-all duration-200 hover:bg-[var(--color-surface-3)] hover:text-white'
              aria-label={language === 'et' ? 'Switch to English' : 'Switch to Estonian'}
            >
              <Globe className='h-5 w-5' aria-hidden='true' />
            </button>
            <button
              type='button'
              ref={menuButtonRef}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={isMenuOpen}
              aria-controls='mobile-menu'
              className='rounded-lg p-2 text-[var(--color-text-muted)] transition-all duration-200 hover:bg-[var(--color-surface-3)] hover:text-white'
            >
              {isMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div
            id='mobile-menu'
            ref={mobileMenuRef}
            tabIndex={-1}
            role='dialog'
            aria-label={t.nav.menuLabel}
            className='border-t border-[var(--border-subtle)] px-3 pb-4 pt-2 lg:hidden'
          >
            <div className='space-y-1'>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className='flex items-center gap-3 rounded-xl px-4 py-3 text-[var(--color-text-body)] transition-all duration-200 hover:bg-[var(--color-surface-3)] hover:text-white'
                >
                  <ChevronRight
                    className='h-4 w-4 text-[var(--color-cyan-core)]'
                    aria-hidden='true'
                  />
                  {link.label}
                </a>
              ))}
              <div className='pt-3'>
                <a
                  href='/#contact'
                  onClick={closeMenu}
                  className='flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-sky-500'
                >
                  {t.nav.bookAudit}
                  <ChevronRight className='h-4 w-4' aria-hidden='true' />
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
