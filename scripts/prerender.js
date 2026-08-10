/**
 * Post-build prerender script for proksiabel.ee
 *
 * Renders each page from the sitemap using system Chromium and saves
 * the fully-rendered HTML so crawlers see complete content immediately.
 * Reads sitemap.xml from pub/, launches a local preview server,
 * renders each URL, then saves the output.
 */
import { launch } from 'puppeteer-core';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { createServer } from 'http';
import { readFile, access } from 'fs/promises';
import { join, extname } from 'path';
import { spawn } from 'child_process';

const PUB_DIR = 'pub';
const SITEMAP = `${PUB_DIR}/sitemap.xml`;
const BASE_URL = 'http://localhost:38765';
// Resolve a system Chromium across distros (Arch: chromium, CI ubuntu: google-chrome)
const CHROMIUM_CANDIDATES = [
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
];
const CHROMIUM_PATH = CHROMIUM_CANDIDATES.find((p) => existsSync(p));

if (!CHROMIUM_PATH) {
  console.error('[prerender] No Chromium found — install chromium or google-chrome.');
  process.exit(1);
}

// MIME types for static file serving
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
};

function extractUrls(xml) {
  const urls = [];
  const re = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    urls.push(m[1]);
  }
  return urls;
}

async function main() {
  // 1. Extract URLs from sitemap
  const sitemapXml = readFileSync(SITEMAP, 'utf-8');
  const allUrls = extractUrls(sitemapXml);
  // Filter to same-domain, skip .well-known and external
  const urls = allUrls
    .map(u => {
      try { return new URL(u).pathname; } catch { return null; }
    })
    .filter(u => u && !u.includes('.well-known'));

  console.log(`[prerender] Found ${urls.length} URLs in sitemap`);

  // 2. Start a static file server serving pub/
  const server = createServer(async (req, res) => {
    let filePath = join(PUB_DIR, req.url === '/' ? '/index.html' : req.url);
    // SPA fallback: non-asset paths serve index.html
    if (!extname(filePath)) {
      filePath = filePath.endsWith('/')
        ? join(filePath, 'index.html')
        : filePath + '.html';
    }
    try {
      const content = await readFile(filePath);
      const ext = extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
      res.end(content);
    } catch {
      // SPA fallback: serve index.html for any unmatched route
      try {
        const indexContent = await readFile(join(PUB_DIR, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(indexContent);
      } catch {
        res.writeHead(404);
        res.end('Not Found');
      }
    }
  });

  await new Promise(resolve => server.listen(38765, resolve));

  // 3. Launch Chromium and render each page
  const browser = await launch({
    executablePath: CHROMIUM_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let rendered = 0;
  const written = [];
  for (const pathname of urls) {
    const page = await browser.newPage();
    try {
      await page.goto(`${BASE_URL}${pathname}`, {
        waitUntil: 'networkidle2',
        timeout: 15000,
      });
      // Wait for React to hydrate
      await page.waitForFunction(
        () => document.querySelector('h1, h2, nav a') !== null,
        { timeout: 10000 }
      ).catch(() => {});

      // Drop the static index.html canonical (pre-hydration) so only the
      // per-page Helmet canonical (data-rh) remains — two canonicals on a page
      // makes Google treat it as "duplicate without user-selected canonical".
      await page.evaluate(() => {
        document
          .querySelectorAll('link[rel="canonical"]:not([data-rh])')
          .forEach((l) => l.remove());
      });

      const html = await page.content();
      const outDir = join(PUB_DIR, pathname.replace(/^\//, ''));
      const outFile = pathname === '/'
        ? join(PUB_DIR, 'index.html')
        : join(outDir, 'index.html');

      if (pathname !== '/') {
        mkdirSync(outDir, { recursive: true });
      }
      writeFileSync(outFile, html);
      written.push(outFile);
      console.log(`[prerender] ✅ ${pathname}`);
      rendered++;
    } catch (err) {
      console.warn(`[prerender] ⚠️  ${pathname}: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();
  console.log(`[prerender] Done — ${rendered}/${urls.length} pages rendered`);

  // Canonical gate: every prerendered page must carry exactly ONE canonical
  // (the per-page Helmet one). Two canonicals = "duplicate without
  // user-selected canonical" in Search Console — this is a build failure.
  const offenders = written.filter((f) => {
    const html = readFileSync(f, 'utf-8');
    const count = (html.match(/rel="canonical"/g) || []).length;
    return count !== 1;
  });
  if (offenders.length > 0) {
    console.error(`[prerender] FAIL: ${offenders.length} page(s) have != 1 canonical: ${offenders.join(', ')}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('[prerender] Failed:', err);
  process.exit(1);
});
