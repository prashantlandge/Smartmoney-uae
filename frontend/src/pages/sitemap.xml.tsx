import { GetServerSideProps } from 'next';

const SITE_URL = 'https://smartmoneyuae.com';

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/credit-cards', priority: '0.9', changefreq: 'daily' },
  { path: '/personal-loans', priority: '0.9', changefreq: 'daily' },
  { path: '/islamic-finance', priority: '0.8', changefreq: 'weekly' },
  { path: '/car-insurance', priority: '0.8', changefreq: 'weekly' },
  { path: '/health-insurance', priority: '0.8', changefreq: 'weekly' },
  { path: '/calculators', priority: '0.7', changefreq: 'monthly' },
  { path: '/tax', priority: '0.7', changefreq: 'monthly' },
  { path: '/recommend', priority: '0.6', changefreq: 'monthly' },
  { path: '/about', priority: '0.4', changefreq: 'monthly' },
  { path: '/contact', priority: '0.4', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
];

const LOCALES = ['en', 'ar', 'hi'];

function generateSiteMap(): string {
  const today = new Date().toISOString().split('T')[0];

  const urls = STATIC_PAGES.map((page) => {
    const alternateLinks = LOCALES.map(
      (locale) =>
        `      <xhtml:link rel="alternate" hreflang="${locale}" href="${SITE_URL}/${locale}${page.path === '/' ? '' : page.path}" />`
    ).join('\n');

    return LOCALES.map((locale) => {
      const loc = `${SITE_URL}/${locale}${page.path === '/' ? '' : page.path}`;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${alternateLinks}
  </url>`;
    }).join('\n');
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return { props: {} };
};

const SitemapPage = () => null;
export default SitemapPage;
