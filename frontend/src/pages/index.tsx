import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import HeroSearch from '@/components/search/HeroSearch';
import RemittanceCalculator from '@/components/remittance/RemittanceCalculator';
import RateChart from '@/components/rates/RateChart';
import RateTrend from '@/components/rates/RateTrend';
import { CategoryIcon, getCategoryBgColor, getCategoryColor } from '@/components/ui/Icon';
import { Search, BarChart3, PiggyBank, Shield, Clock, Package, Heart, ChevronRight, Users } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/ui/Container';
import CountUp from '@/components/ui/CountUp';
import FlagIcon from '@/components/ui/FlagIcon';

const CATEGORIES = [
  { key: 'remittance', categoryKey: 'remittance', href: '/', highlighted: true },
  { key: 'credit_cards', categoryKey: 'credit_cards', href: '/credit-cards', highlighted: false },
  { key: 'personal_loans', categoryKey: 'personal_loans', href: '/personal-loans', highlighted: false },
  { key: 'islamic_finance', categoryKey: 'islamic_finance', href: '/islamic-finance', highlighted: false },
  { key: 'car_insurance', categoryKey: 'car_insurance', href: '/car-insurance', highlighted: false },
  { key: 'health_insurance', categoryKey: 'health_insurance', href: '/health-insurance', highlighted: false },
];

const STEPS = [
  { icon: Search, key: 'how_step_1', color: 'from-brand-primary to-emerald-500' },
  { icon: BarChart3, key: 'how_step_2', color: 'from-blue-500 to-indigo-500' },
  { icon: PiggyBank, key: 'how_step_3', color: 'from-amber-500 to-orange-500' },
];

const TRUST_STATS = [
  { value: 50, suffix: '+', icon: Package, label: 'comparing_products' },
  { value: 15, suffix: ' min', icon: Clock, label: 'updated_daily' },
  { value: 6, suffix: '', icon: Shield, label: 'trust_providers' },
  { value: 100, suffix: '%', icon: Heart, label: 'trust_free' },
];

const COUNTRIES = [
  { code: 'in', name: 'India' },
  { code: 'pk', name: 'Pakistan' },
  { code: 'ph', name: 'Philippines' },
  { code: 'bd', name: 'Bangladesh' },
  { code: 'lk', name: 'Sri Lanka' },
];

export default function Home() {
  const { t } = useTranslation('common');

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
      <section className="relative bg-gradient-to-br from-brand-dark via-brand-dark-800 to-brand-primary text-white py-16 sm:py-24 px-4 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="relative max-w-content-lg mx-auto text-center">
          <h1 className="text-display-lg sm:text-display-xl font-bold mb-3 leading-tight">
            {t('hero_title')}
          </h1>
          <p className="text-body-sm sm:text-body-lg text-white/70 max-w-xl mx-auto mb-8">
            {t('hero_subtitle')}
          </p>
          <HeroSearch />
          {/* Social proof */}
          <div className="mt-6 flex items-center justify-center gap-2 text-white/40 text-caption">
            <Users size={14} />
            <span>Trusted by 10,000+ UAE expats</span>
          </div>
        </div>
      </section>

      {/* ===== REMITTANCE CALCULATOR ===== */}
      <section className="px-4 -mt-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="card-elevated">
            <RemittanceCalculator />
          </div>
        </div>
      </section>

      {/* ===== RATE INTELLIGENCE ===== */}
      <section className="section-padding bg-white">
        <Container size="lg">
          <SectionHeading title={t('rate_trend')} />
          <div className="flex justify-center mb-6">
            <RateTrend />
          </div>
          <RateChart days={7} />
        </Container>
      </section>

      {/* ===== PRODUCT CATEGORIES ===== */}
      <section className="section-padding bg-surface-50">
        <Container size="lg">
          <SectionHeading title={t('explore_products')} />
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={cat.href}
                className={`group flex flex-col items-center gap-3 p-5 rounded-card text-center transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 ${
                  cat.highlighted
                    ? 'bg-brand-primary-50 border-2 border-brand-primary shadow-card'
                    : 'bg-white border border-surface-200 hover:border-brand-primary/30 shadow-card'
                }`}
              >
                <CategoryIcon
                  category={cat.categoryKey}
                  size={28}
                  withBackground
                />
                <span className={`text-xs font-semibold ${cat.highlighted ? 'text-brand-primary' : 'text-gray-700'}`}>
                  {t(`categories.${cat.key}`)}
                </span>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-primary transition-colors" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section-padding bg-white">
        <Container size="lg">
          <SectionHeading title={t('how_it_works')} />
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((step, idx) => (
              <div key={step.key} className="text-center relative">
                {/* Connector line (desktop only) */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-8 start-[60%] w-[80%] h-px bg-surface-300" />
                )}
                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <step.icon size={26} className="text-white" />
                </div>
                <div className="inline-flex items-center gap-1 text-caption font-bold text-brand-primary mb-2 bg-brand-primary-50 px-2.5 py-0.5 rounded-pill">
                  {t('step')} {idx + 1}
                </div>
                <p className="text-body-sm text-gray-600">{t(step.key)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== TRUST SIGNALS ===== */}
      <section className="py-12 px-4 bg-brand-primary-50 border-y border-brand-primary-100">
        <Container size="lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-card flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={22} className="text-brand-primary" />
                </div>
                <div className="text-display-lg font-bold text-brand-primary">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-caption text-gray-500 mt-1">
                  {stat.label === 'comparing_products'
                    ? t(stat.label, { count: 50, providers: '20' })
                    : t(stat.label)}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== BUILT FOR EXPATS ===== */}
      <section className="section-padding bg-white">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-heading-lg sm:text-display-lg font-bold text-brand-dark mb-3">
              {t('built_for_indians')}
            </h2>
            <p className="text-body-sm sm:text-body-lg text-gray-600 leading-relaxed mb-8">
              {t('built_for_indians_desc')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {COUNTRIES.map((country) => (
                <span
                  key={country.code}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-surface-50 border border-surface-200 rounded-pill text-sm text-gray-600 hover:border-brand-primary/30 transition-colors"
                >
                  <FlagIcon code={country.code} size={18} />
                  {country.name}
                </span>
              ))}
            </div>
            <Link
              href="/credit-cards"
              className="btn-primary mt-8 inline-flex"
            >
              Start comparing
              <ChevronRight size={16} />
            </Link>
          </div>
        </Container>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
