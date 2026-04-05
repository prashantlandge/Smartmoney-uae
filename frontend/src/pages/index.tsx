import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import HeroSearch from '@/components/search/HeroSearch';
import RemittanceCalculator from '@/components/remittance/RemittanceCalculator';
import RateChart from '@/components/rates/RateChart';
import RateTrend from '@/components/rates/RateTrend';
import CategoryIllustration from '@/components/ui/CategoryIllustration';
import { Search, BarChart3, PiggyBank, Shield, Clock, Package, Heart, ChevronRight, Sparkles } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/ui/Container';
import CountUp from '@/components/ui/CountUp';
import FlagIcon from '@/components/ui/FlagIcon';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import TrustLogos from '@/components/ui/TrustLogos';
import Newsletter from '@/components/ui/Newsletter';
import TabbedShowcase from '@/components/homepage/TabbedShowcase';
import FinancialTips from '@/components/homepage/FinancialTips';

const CATEGORIES = [
  { key: 'remittance', categoryKey: 'remittance', href: '/', highlighted: true },
  { key: 'credit_cards', categoryKey: 'credit_cards', href: '/credit-cards', highlighted: false },
  { key: 'personal_loans', categoryKey: 'personal_loans', href: '/personal-loans', highlighted: false },
  { key: 'islamic_finance', categoryKey: 'islamic_finance', href: '/islamic-finance', highlighted: false },
  { key: 'car_insurance', categoryKey: 'car_insurance', href: '/car-insurance', highlighted: false },
  { key: 'health_insurance', categoryKey: 'health_insurance', href: '/health-insurance', highlighted: false },
];

const STEPS = [
  { icon: Search, key: 'how_step_1', color: 'from-brand-primary to-emerald-500', label: 'Search' },
  { icon: BarChart3, key: 'how_step_2', color: 'from-blue-500 to-indigo-500', label: 'Compare' },
  { icon: PiggyBank, key: 'how_step_3', color: 'from-amber-500 to-orange-500', label: 'Save' },
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

      {/* ===== HERO — compact, no image ===== */}
      <section className="relative bg-gradient-to-br from-brand-dark via-brand-dark-800 to-brand-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 via-transparent to-brand-gold/10 animate-gradient" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative py-14 sm:py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-caption font-medium px-3 py-1.5 rounded-pill mb-4 border border-white/10">
              <Sparkles size={12} />
              AI-Powered Financial Comparison
            </div>
            <h1 className="text-display-lg sm:text-display-xl font-bold mb-3 leading-tight">
              {t('hero_title')}
            </h1>
            <p className="text-body-sm text-white/60 max-w-lg mx-auto mb-6">
              {t('hero_subtitle')}
            </p>
            <div className="max-w-xl mx-auto">
              <HeroSearch />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== REMITTANCE CALCULATOR (overlapping hero) ===== */}
      <AnimatedSection className="px-4 -mt-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="card-elevated">
            <RemittanceCalculator />
          </div>
        </div>
      </AnimatedSection>

      {/* ===== TRUST LOGOS STRIP ===== */}
      <TrustLogos />

      {/* ===== PRODUCT CATEGORIES — compact grid ===== */}
      <section className="py-10 sm:py-14 px-4 bg-surface-50">
        <Container size="lg">
          <AnimatedSection>
            <SectionHeading
              title={t('explore_products')}
              subtitle="Compare the best financial products in UAE"
            />
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <StaggerItem key={cat.key}>
                <Link
                  href={cat.href}
                  className={`group flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 ${
                    cat.highlighted
                      ? 'bg-brand-primary-50 border border-brand-primary/30'
                      : 'bg-white border border-surface-200 hover:border-brand-primary/20'
                  }`}
                >
                  <CategoryIllustration category={cat.categoryKey} size={40} />
                  <span className={`text-xs font-semibold leading-tight ${cat.highlighted ? 'text-brand-primary' : 'text-gray-700 group-hover:text-brand-primary'} transition-colors`}>
                    {t(`categories.${cat.key}`)}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ===== TOP PRODUCTS SHOWCASE ===== */}
      <section className="py-10 sm:py-14 px-4 bg-white">
        <Container size="lg">
          <AnimatedSection>
            <SectionHeading
              title="Top Picks for You"
              subtitle="Hand-picked financial products compared across categories"
            />
          </AnimatedSection>
          <TabbedShowcase />
        </Container>
      </section>

      {/* ===== RATE INTELLIGENCE — compact ===== */}
      <AnimatedSection className="py-10 sm:py-14 px-4 bg-surface-50">
        <Container size="lg">
          <SectionHeading
            title={t('rate_trend')}
            subtitle="Real-time exchange rate tracking powered by AI"
          />
          <div className="flex justify-center mb-4">
            <RateTrend />
          </div>
          <RateChart days={7} />
        </Container>
      </AnimatedSection>

      {/* ===== HOW IT WORKS — inline row ===== */}
      <section className="py-10 sm:py-14 px-4 bg-white">
        <Container size="lg">
          <AnimatedSection>
            <SectionHeading
              title={t('how_it_works')}
              subtitle="Three simple steps to save money"
            />
          </AnimatedSection>
          <StaggerContainer className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((step, idx) => (
              <StaggerItem key={step.key}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shrink-0`}>
                    <step.icon size={22} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-brand-primary mb-1">
                      Step {idx + 1} — {step.label}
                    </div>
                    <p className="text-xs text-gray-600">{t(step.key)}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ===== TRUST STATS — compact bar ===== */}
      <section className="py-8 px-4 bg-brand-primary-50 border-y border-brand-primary-100">
        <Container size="lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <stat.icon size={18} className="text-brand-primary" />
                </div>
                <div>
                  <div className="text-heading-md font-bold text-brand-primary leading-none">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-caption text-gray-500">
                    {stat.label === 'comparing_products'
                      ? t(stat.label, { count: 50, providers: '20' })
                      : t(stat.label)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== BUILT FOR EXPATS — compact ===== */}
      <section className="py-10 sm:py-14 px-4 bg-white">
        <Container size="md">
          <AnimatedSection>
            <div className="text-center">
              <h2 className="text-heading-lg font-bold text-brand-dark mb-2">
                {t('built_for_indians')}
              </h2>
              <p className="text-body-sm text-gray-600 leading-relaxed mb-6 max-w-lg mx-auto">
                {t('built_for_indians_desc')}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {COUNTRIES.map((country) => (
                  <span
                    key={country.code}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-surface-200 rounded-pill text-xs font-medium text-gray-600 hover:border-brand-primary/30 transition-all shadow-sm"
                  >
                    <FlagIcon code={country.code} size={16} />
                    {country.name}
                  </span>
                ))}
              </div>
              <Link href="/credit-cards" className="btn-primary shadow-glow-primary">
                Start comparing <ChevronRight size={16} />
              </Link>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ===== FINANCIAL TIPS ===== */}
      <section className="py-10 sm:py-14 px-4 bg-surface-50">
        <Container size="lg">
          <AnimatedSection>
            <SectionHeading
              title="Financial Tips & Guides"
              subtitle="Expert insights for smarter money decisions in the UAE"
            />
          </AnimatedSection>
          <FinancialTips />
        </Container>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <Newsletter />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
