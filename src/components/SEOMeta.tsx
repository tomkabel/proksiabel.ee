import { Helmet } from '@dr.pogodin/react-helmet';
import { useTranslation } from '../i18n';

interface SEOMetaProps {
  titleKey?: string;
  defaultTitle?: string;
  descriptionKey?: string;
  defaultDescription?: string;
  path?: string;
  noindex?: boolean;
}

const SITE_NAME = 'ProksiAbel OÜ';

/**
 * Sets per-route <title> and <meta name="description"> via @dr.pogodin/react-helmet.
 * Falls back to Estonian defaults when language-specific keys not provided.
 */
export default function SEOMeta({
  titleKey,
  defaultTitle,
  descriptionKey,
  defaultDescription,
  path = '/',
  noindex = false,
}: SEOMetaProps) {
  const { t, language } = useTranslation();

  // Derive the localized page title
  let pageTitle: string;
  if (titleKey) {
    // Use i18n key: t.seo.pages.${titleKey}
    const keyPath = titleKey.split('.');
    let value: unknown = t;
    for (const k of keyPath) {
      value = (value as Record<string, unknown>)?.[k];
    }
    pageTitle = typeof value === 'string' ? value : defaultTitle || '';
  } else {
    pageTitle = defaultTitle || '';
  }

  const title = pageTitle
    ? `${pageTitle} — ${SITE_NAME}`
    : `${SITE_NAME} — Cybersecurity Consultancy`;

  // Derive description
  let desc: string;
  if (descriptionKey) {
    const keyPath = descriptionKey.split('.');
    let value: unknown = t;
    for (const k of keyPath) {
      value = (value as Record<string, unknown>)?.[k];
    }
    desc = typeof value === 'string' ? value : defaultDescription || '';
  } else {
    desc = defaultDescription || '';
  }

  const url = `https://proksiabel.ee${path}`;

  return (
    <Helmet>
      <html lang={language === 'et' ? 'et' : 'en'} />
      <title>{title}</title>
      <meta name='description' content={desc} />
      {noindex ? <meta name='robots' content='noindex' /> : <link rel='canonical' href={url} />}
      <meta property='og:title' content={title} />
      <meta property='og:description' content={desc} />
      <meta property='og:url' content={url} />
      <meta property='og:type' content='website' />
      <meta property='og:image' content='https://proksiabel.ee/og-image.png' />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={desc} />
      <meta name='twitter:image' content='https://proksiabel.ee/og-image.png' />
    </Helmet>
  );
}

/**
 * Generate BreadcrumbList JSON-LD for sub-pages.
 */
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const fullItems = [{ name: 'ProksiAbel OÜ', url: 'https://proksiabel.ee/' }, ...items];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <script type='application/ld+json'>{JSON.stringify(schema)}</script>;
}
