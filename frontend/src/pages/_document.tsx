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
      </Head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
