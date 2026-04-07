import Head from 'next/head';

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

export default function SEOHead({ title, description, path = '', image = '/images/og-default.png' }: SEOHeadProps) {
  const url = `https://smartmoneyuae.com${path}`;
  const fullTitle = `${title} — SmartMoney UAE`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://smartmoneyuae.com${image}`} />
      <meta property="og:site_name" content="SmartMoney UAE" />
      <meta property="og:locale" content="en_AE" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://smartmoneyuae.com${image}`} />

      <link rel="canonical" href={url} />
    </Head>
  );
}
