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
import { ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import TrustLogos from '@/components/ui/TrustLogos';
import Newsletter from '@/components/ui/Newsletter';
import TabbedShowcase from '@/components/homepage/TabbedShowcase';

const CATEGORIES = [
  { key: 'remittance', categoryKey: 'remittance', href: '/', desc: 'Send money home at the best exchange rates', highlighted: true },
  { key: 'credit_cards', categoryKey: 'credit_cards', href: '/credit-cards', desc: 'Cashback, travel & rewards cards' },
  { key: 'personal_loans', categoryKey: 'personal_loans', href: '/personal-loans', desc: 'Lowest interest rates in UAE' },
  { key: 'islamic_finance', categoryKey: 'islamic_finance', href: '/islamic-finance', desc: 'Shariah-compliant products' },
  { key: 'car_insurance', categoryKey: 'car_insurance', href: '/car-insurance', desc: 'Comprehensive & third-party cover' },
  { key: 'health_insurance', categoryKey: 'health_insurance', href: '/health-insurance', desc: 'DHA & HAAD compliant plans' },
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

      {/* ===== HERO — Clean, confident, no noise ===== */}
      <section className="bg-brand-dark text-white relative overflow-hidden">
        <div className="relative py-20 sm:py-28 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-content-xl mx-auto"
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <Sparkles size={14} />
                AI-Powered Financial Comparison
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-display-2xl font-extrabold mb-5 leading-[1.1]">
                {t('hero_title')}
              </h1>
              <p className="text-lg text-white/80 max-w-lg mb-8 leading-relaxed">
                {t('hero_subtitle')}
              </p>
              <div className="max-w-xl">
                <HeroSearch />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== REMITTANCE CALCULATOR ===== */}
      <AnimatedSection className="px-4 -mt-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="card-elevated">
            <RemittanceCalculator />
          </div>
        </div>
      </AnimatedSection>

      {/* ===== TRUST STRIP ===== */}
      <TrustLogos />

      {/* ===== PRODUCT CATEGORIES ===== */}
      <section className="py-20 sm:py-28 px-4 bg-surface-50">
        <Container size="lg">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                {t('explore_products')}
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Compare the best financial products in the UAE across 6 categories
              </p>
            </div>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <StaggerItem key={cat.key}>
                <Link
                  href={cat.href}
                  className={`group flex items-center gap-4 p-5 rounded-2xl transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 ${
                    cat.highlighted
                      ? 'bg-brand-primary-50 border-2 border-brand-primary/20'
                      : 'bg-white border border-surface-200'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center shrink-0 group-hover:bg-surface-200 transition-colors">
                    <CategoryIllustration category={cat.categoryKey} size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-base font-bold block mb-0.5 ${
                      cat.highlighted ? 'text-brand-primary' : 'text-gray-900 group-hover:text-brand-primary'
                    } transition-colors`}>
                      {t(`categories.${cat.key}`)}
                    </span>
                    <span className="text-sm text-gray-500">{cat.desc}</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ===== TOP PRODUCTS SHOWCASE ===== */}
      <section className="py-20 sm:py-28 px-4 bg-white">
        <Container size="lg">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                Top Picks for You
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Hand-picked financial products compared across categories
              </p>
            </div>
          </AnimatedSection>
          <TabbedShowcase />
        </Container>
      </section>

      {/* ===== RATE INTELLIGENCE ===== */}
      <AnimatedSection className="py-20 sm:py-28 px-4 bg-surface-50">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              {t('rate_trend')}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Real-time exchange rate tracking powered by AI
            </p>
          </div>
          <div className="flex justify-center mb-6">
            <RateTrend />
          </div>
          <RateChart days={7} />
        </Container>
      </AnimatedSection>

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
