import { Html, Head, Main, NextScript, DocumentProps } from 'next/document';

export default function Document(props: DocumentProps) {
  const locale = props.__NEXT_DATA__?.locale || 'en';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <Html lang={locale} dir={dir}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'SmartMoney UAE',
              url: 'https://smartmoneyuae.com',
              logo: 'https://smartmoneyuae.com/favicon.ico',
              description: 'AI-powered financial product comparison platform for UAE residents and expats. Compare remittance rates, credit cards, loans, and insurance.',
              areaServed: {
                '@type': 'Country',
                name: 'United Arab Emirates',
              },
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'SmartMoney UAE',
              url: 'https://smartmoneyuae.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://smartmoneyuae.com/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is the cheapest way to send money from UAE to India?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The cheapest way depends on transfer amount and speed. Services like Wise, Al Ansari Exchange, and Emirates NBD offer competitive rates. Use SmartMoney UAE to compare real-time rates and fees.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How do I compare credit cards in the UAE?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'SmartMoney UAE lets you compare credit cards by annual fee, cashback rates, rewards, minimum salary requirements, and more. Filter by Islamic-compliant options and compare up to 3 cards side by side.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is SmartMoney UAE free to use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, SmartMoney UAE is completely free for users. We earn commissions from financial providers when you apply through our links, at no extra cost to you.',
                  },
                },
              ],
            }),
          }}
        />
      </Head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
