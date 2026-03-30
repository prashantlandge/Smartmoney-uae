import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import RemittanceCalculator from '@/components/remittance/RemittanceCalculator';

const CATEGORIES = [
  { key: 'remittance', icon: '💸', highlighted: true },
  { key: 'credit_cards', icon: '💳', highlighted: false },
  { key: 'personal_loans', icon: '🏦', highlighted: false },
  { key: 'islamic_finance', icon: '☪️', highlighted: false },
  { key: 'car_insurance', icon: '🚗', highlighted: false },
  { key: 'health_insurance', icon: '🏥', highlighted: false },
  { key: 'business_banking', icon: '💼', highlighted: false },
];

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('site_name')} — {t('hero_title')}</title>
        <meta name="description" content={t('hero_subtitle')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="alternate" hrefLang="en" href="/en" />
        <link rel="alternate" hrefLang="ar" href="/ar" />
        <link rel="alternate" hrefLang="x-default" href="/en" />
      </Head>

      <main className="min-h-screen">
        {/* ===== HERO SECTION ===== */}
        <section className="bg-gradient-to-br from-brand-dark to-brand-primary text-white py-12 sm:py-16 px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold mb-3 leading-tight">
              {t('hero_title')}
            </h1>
            <p className="text-base sm:text-lg text-white/80">
              {t('hero_subtitle')}
            </p>
          </div>

          {/* Remittance Calculator — above the fold */}
          <RemittanceCalculator />
        </section>

        {/* ===== PRODUCT CATEGORIES ===== */}
        <section className="py-10 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.key}
                  href={`/en/${cat.key === 'credit_cards' ? 'credit-cards' : cat.key.replace('_', '-')}`}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all duration-200 hover:shadow-md ${
                    cat.highlighted
                      ? 'bg-brand-primary/10 border-2 border-brand-primary'
                      : 'bg-gray-50 border border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className={`text-xs font-medium ${cat.highlighted ? 'text-brand-primary' : 'text-gray-700'}`}>
                    {t(`categories.${cat.key}`)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TRUST SIGNALS ===== */}
        <section className="py-8 px-4 bg-gray-50 border-y border-gray-100">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-12 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-brand-primary">50+</div>
              <div className="text-xs text-gray-500">{t('comparing_products', { count: 50, providers: '20' })}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-brand-primary">15 min</div>
              <div className="text-xs text-gray-500">{t('updated_daily')}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-brand-primary">6</div>
              <div className="text-xs text-gray-500">Remittance providers compared</div>
            </div>
          </div>
        </section>

        {/* ===== BUILT FOR INDIANS ===== */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mb-3">
              {t('built_for_indians')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t('built_for_indians_desc')}
            </p>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="py-8 px-4 bg-brand-dark text-white/60 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} {t('site_name')}. All rights reserved.</p>
          <p className="mt-1">Rates are indicative and updated every 15 minutes. Always confirm with the provider before transferring.</p>
        </footer>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
