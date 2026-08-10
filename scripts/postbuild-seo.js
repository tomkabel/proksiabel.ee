/**
 * Post-build SEO script — updates built HTML files with current lastmod dates
 * and copies the custom 404.html if it doesn't already differ from index.html.
 *
 * Run by `npm run build` via the "postbuild" script in package.json.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PUB = 'pub';
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// 1. Update sitemap lastmod dates to today
const sitemapPath = join(PUB, 'sitemap.xml');
if (existsSync(sitemapPath)) {
  let sitemap = readFileSync(sitemapPath, 'utf-8');
  sitemap = sitemap.replace(/<lastmod>[\d-]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
  writeFileSync(sitemapPath, sitemap);
  console.log(`[postbuild-seo] Updated sitemap dates to ${today}`);
}

// 2. Ensure 404.html exists with its own title (not index.html clone)
const indexPath = join(PUB, 'index.html');
const notFoundPath = join(PUB, '404.html');
if (existsSync(indexPath)) {
  const indexHtml = readFileSync(indexPath, 'utf-8');
  if (!existsSync(notFoundPath)) {
    // Create 404 from scratch
    const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Page Not Found — ProksiAbel OÜ</title>
    ${indexHtml.match(/<script[^>]*><\/script>/g)?.join('\n    ') || ''}
    ${indexHtml.match(/<link rel="stylesheet"[^>]*>/g)?.join('\n    ') || ''}
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
    writeFileSync(notFoundPath, notFoundHtml);
    console.log('[postbuild-seo] Generated 404.html');
  } else {
    // Check if 404.html has unique title (not cloned from index)
    const notFoundHtml = readFileSync(notFoundPath, 'utf-8');
    if (
      notFoundHtml.includes('ProksiAbel OÜ - Ekspert MITM kaitse') ||
      notFoundHtml.includes('<link rel="canonical"')
    ) {
      console.warn(
        '[postbuild-seo] ⚠️  404.html appears to be a clone of index.html — update it manually',
      );
    }
  }
}

console.log('[postbuild-seo] Done');
