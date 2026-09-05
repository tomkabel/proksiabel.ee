import { HelmetProvider } from '@dr.pogodin/react-helmet';
import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import DispatchTerminal from './components/DispatchTerminal';
import Dossier from './components/Dossier';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import SEOMeta, { BreadcrumbSchema } from './components/SEOMeta';
import Services from './components/Services';
import Telemetry from './components/Telemetry';
import { LanguageProvider, useTranslation } from './i18n';

const PrivacyPolicy = React.lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./components/TermsOfService'));
const CookiePolicy = React.lazy(() => import('./components/CookiePolicy'));
const Disclosure = React.lazy(() => import('./components/Disclosure'));
const Fido2PasskeysGuide = React.lazy(() => import('./components/Fido2PasskeysGuide'));
const SsrfGuide = React.lazy(() => import('./components/SsrfGuide'));
const IdorGuide = React.lazy(() => import('./components/IdorGuide'));
const SstiGuide = React.lazy(() => import('./components/SstiGuide'));
const NotFound = React.lazy(() => import('./components/NotFound'));

/**
 * One fixed, continuous background surface for the whole app. Sections are
 * transparent, so the mesh/grid pattern never restarts at a section boundary
 * (previously every section layered its own clipped bg-mesh/bg-grid overlay,
 * producing visible seams between sections).
 */
function BackgroundCanvas() {
  return (
    <div className='pointer-events-none fixed inset-0 overflow-hidden' aria-hidden='true'>
      <div className='absolute inset-0 bg-mesh bg-grid opacity-50' />
      <div className='absolute top-1/4 -left-32 w-96 h-96 bg-sky-500/15 rounded-full blur-[128px] animate-pulse-slow' />
      <div className='absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-[128px] animate-pulse-slow' />
    </div>
  );
}

function HomePage() {
  return (
    <>
      <SEOMeta
        titleKey='seo.home.title'
        defaultTitle='Expert MITM Defense & Security Consulting'
        descriptionKey='seo.home.description'
      />
      <Navbar />
      <main id='main-content' tabIndex={-1}>
        <Hero />
        <Telemetry />
        <Services />
        <Dossier />
        <DispatchTerminal />
      </main>
      <Footer />
    </>
  );
}

function LegalLayout({
  children,
  titleKey,
  descriptionKey,
  defaultTitle,
  defaultDescription,
  breadcrumbTitle,
  breadcrumbUrl,
  noindex = false,
}: {
  children: React.ReactNode;
  titleKey?: string;
  descriptionKey?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  breadcrumbTitle?: string;
  breadcrumbUrl?: string;
  noindex?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <>
      <SEOMeta
        titleKey={titleKey}
        descriptionKey={descriptionKey}
        defaultTitle={defaultTitle}
        defaultDescription={defaultDescription}
        path={breadcrumbUrl}
        noindex={noindex}
      />
      {breadcrumbTitle && breadcrumbUrl && (
        <BreadcrumbSchema
          items={[{ name: breadcrumbTitle, url: `https://proksiabel.ee${breadcrumbUrl}` }]}
        />
      )}
      <Navbar />
      <main id='main-content' tabIndex={-1}>
        <React.Suspense
          fallback={
            <div className='min-h-screen bg-slate-900 flex items-center justify-center'>
              <div className='text-white'>{t.common.loading}</div>
            </div>
          }
        >
          {children}
        </React.Suspense>
      </main>
      <Footer />
    </>
  );
}

/**
 * Catch-all (404) route. Uses the actual requested pathname so noindex pages
 * never emit the home-page canonical/og:url, and keeps a proper title.
 */
function NotFoundRoute() {
  const { pathname } = useLocation();
  return (
    <LegalLayout
      noindex
      breadcrumbUrl={pathname}
      defaultTitle='Page Not Found'
      defaultDescription='The requested page does not exist or has been moved.'
    >
      <NotFound />
    </LegalLayout>
  );
}

function SkipLink() {
  const { t } = useTranslation();
  return (
    <a
      href='#main-content'
      className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-500 focus:text-white focus:rounded-md'
      onClick={(e) => {
        e.preventDefault();
        const el = document.getElementById('main-content');
        el?.focus();
        el?.scrollIntoView();
      }}
    >
      {t.common.skipToContent}
    </a>
  );
}

function App() {
  return (
    <LanguageProvider>
      <HelmetProvider>
        <BrowserRouter>
          <div className='min-h-screen bg-slate-900'>
            <BackgroundCanvas />
            <SkipLink />
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route
                path='/privacy'
                element={
                  <LegalLayout
                    titleKey='seo.privacy.title'
                    descriptionKey='seo.privacy.description'
                    defaultTitle='Privacy Policy'
                    defaultDescription='Privacy policy for ProksiAbel OÜ.'
                    breadcrumbTitle='Privacy Policy'
                    breadcrumbUrl='/privacy'
                  >
                    <PrivacyPolicy />
                  </LegalLayout>
                }
              />
              <Route
                path='/terms'
                element={
                  <LegalLayout
                    titleKey='seo.terms.title'
                    descriptionKey='seo.terms.description'
                    defaultTitle='Terms of Service'
                    defaultDescription='Terms of service for ProksiAbel OÜ.'
                    breadcrumbTitle='Terms of Service'
                    breadcrumbUrl='/terms'
                  >
                    <TermsOfService />
                  </LegalLayout>
                }
              />
              <Route
                path='/cookies'
                element={
                  <LegalLayout
                    titleKey='seo.cookies.title'
                    descriptionKey='seo.cookies.description'
                    defaultTitle='Cookie Policy'
                    defaultDescription='Cookie policy for ProksiAbel OÜ.'
                    breadcrumbTitle='Cookie Policy'
                    breadcrumbUrl='/cookies'
                  >
                    <CookiePolicy />
                  </LegalLayout>
                }
              />
              <Route
                path='/disclosure'
                element={
                  <LegalLayout
                    titleKey='seo.disclosure.title'
                    descriptionKey='seo.disclosure.description'
                    defaultTitle='Responsible Disclosure'
                    defaultDescription='Responsible disclosure policy for ProksiAbel OÜ.'
                    breadcrumbTitle='Responsible Disclosure'
                    breadcrumbUrl='/disclosure'
                  >
                    <Disclosure />
                  </LegalLayout>
                }
              />
              <Route
                path='/guides/fido2-vs-passkeys'
                element={
                  <LegalLayout
                    defaultTitle='FIDO2 vs Passkeys: A Technical Guide'
                    defaultDescription='FIDO2 is a protocol family; passkeys are a product concept built on one WebAuthn feature. A practical comparison of discoverable credentials, attestation, sync, and deployment.'
                    breadcrumbTitle='FIDO2 vs Passkeys'
                    breadcrumbUrl='/guides/fido2-vs-passkeys'
                  >
                    <Fido2PasskeysGuide />
                  </LegalLayout>
                }
              />
              <Route
                path='/guides/ssrf-explained'
                element={
                  <LegalLayout
                    defaultTitle='SSRF Explained: Attack Examples & Prevention'
                    defaultDescription='Server-side request forgery (SSRF) explained: attack anatomy, cloud metadata credential theft, detection rules, and prevention patterns, with a reproducible local lab.'
                    breadcrumbTitle='SSRF Explained'
                    breadcrumbUrl='/guides/ssrf-explained'
                  >
                    <SsrfGuide />
                  </LegalLayout>
                }
              />
              <Route
                path='/guides/idor-explained'
                element={
                  <LegalLayout
                    defaultTitle='IDOR Explained: Attack Examples & Prevention'
                    defaultDescription="Insecure direct object reference (IDOR) explained: how missing object-level authorization lets authenticated users read, modify, or delete other users' data, with a reproducible local lab, detection rules, and fix patterns."
                    breadcrumbTitle='IDOR Explained'
                    breadcrumbUrl='/guides/idor-explained'
                  >
                    <IdorGuide />
                  </LegalLayout>
                }
              />
              <Route
                path='/guides/ssti-explained'
                element={
                  <LegalLayout
                    defaultTitle='Server-Side Template Injection (SSTI) Explained: Attack Examples & Prevention'
                    defaultDescription='Server-side template injection (SSTI) explained: how user input becomes template code, detection payloads, Jinja2 and FreeMarker RCE examples, a reproducible local lab, and prevention patterns.'
                    breadcrumbTitle='SSTI Explained'
                    breadcrumbUrl='/guides/ssti-explained'
                  >
                    <SstiGuide />
                  </LegalLayout>
                }
              />
              <Route path='*' element={<NotFoundRoute />} />
            </Routes>
          </div>
        </BrowserRouter>
      </HelmetProvider>
    </LanguageProvider>
  );
}

export default App;
