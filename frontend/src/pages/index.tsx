import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import HeroSearch from '@/components/search/HeroSearch';
import RemittanceCalculator from '@/components/remittance/RemittanceCalculator';
import QuickProfileWidget from '@/components/profile/QuickProfileWidget';
import RateChart from '@/components/rates/RateChart';
import RateTrend from '@/components/rates/RateTrend';
import { useUserProfile } from '@/hooks/useUserProfile';

const CATEGORIES = [
  { key: 'remittance', icon: '💸', href: '/', highlighted: true },
  { key: 'credit_cards', icon: '💳', href: '/credit-cards', highlighted: false },
  { key: 'personal_loans', icon: '🏦', href: '/personal-loans', highlighted: false },
  { key: 'islamic_finance', icon: '☪️', href: '/islamic-finance', highlighted: false },
  { key: 'car_insurance', icon: '🚗', href: '/car-insurance', highlighted: false },
  { key: 'health_insurance', icon: '🏥', href: '/health-insurance', highlighted: false },
];

const STEPS = [
  { icon: '🔍', key: 'how_step_1' },
  { icon: '📊', key: 'how_step_2' },
  { icon: '💰', key: 'how_step_3' },
];

export default function Home() {
  const { t } = useTranslation('common');
  const { profile, updateProfile } = useUserProfile();

  return (
    <Layout>
      <Head>
        <title>{t('site_name')} — {t('hero_title')}</title>
        <meta name="description" content={t('hero_subtitle')} />
        <link rel="alternate" hrefLang="en" href="/en" />
        <link rel="alternate" hrefLang="ar" href="/ar" />
        <link rel="alternate" hrefLang="x-default" href="/en" />
      </Head>

      {/* ===== HERO SECTION ===== */}
      <section className="bg-gradient-to-br from-brand-dark to-brand-primary text-white py-8 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 leading-tight">
            {t('hero_title')}
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto mb-5">
            {t('hero_subtitle')}
          </p>
          <HeroSearch />
        </div>
      </section>

      {/* ===== REMITTANCE CALCULATOR ===== */}
      <section className="py-6 px-4 bg-gray-50 -mt-1">
        <RemittanceCalculator />
      </section>

      {/* ===== RATE INTELLIGENCE ===== */}
      <section className="py-6 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-4">
            <RateTrend />
          </div>
          <RateChart days={7} />
        </div>
      </section>

      {/* ===== PRODUCT CATEGORIES ===== */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-brand-dark mb-6">
            {t('explore_products')}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={cat.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all duration-200 hover:shadow-md ${
                  cat.highlighted
                    ? 'bg-brand-primary/10 border-2 border-brand-primary'
                    : 'bg-white border border-gray-100 hover:border-brand-primary/30'
                }`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className={`text-xs font-medium ${cat.highlighted ? 'text-brand-primary' : 'text-gray-700'}`}>
                  {t(`categories.${cat.key}`)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-brand-dark mb-8">
            {t('how_it_works')}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((step, idx) => (
              <div key={step.key} className="text-center">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <div className="text-xs font-bold text-brand-primary mb-1">
                  {t('step')} {idx + 1}
                </div>
                <p className="text-sm text-gray-600">{t(step.key)}</p>
              </div>
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
            <div className="text-xs text-gray-500">{t('trust_providers')}</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-brand-primary">100%</div>
            <div className="text-xs text-gray-500">{t('trust_free')}</div>
          </div>
        </div>
      </section>

      {/* ===== BUILT FOR EXPATS ===== */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mb-3">
            {t('built_for_indians')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
            {t('built_for_indians_desc')}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['🇮🇳 India', '🇵🇰 Pakistan', '🇵🇭 Philippines', '🇧🇩 Bangladesh', '🇱🇰 Sri Lanka'].map((country) => (
              <span key={country} className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600">
                {country}
              </span>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
