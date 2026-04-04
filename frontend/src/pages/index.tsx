import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import HeroSearch from '@/components/search/HeroSearch';
import RemittanceCalculator from '@/components/remittance/RemittanceCalculator';
import RateChart from '@/components/rates/RateChart';
import RateTrend from '@/components/rates/RateTrend';
import { CategoryIcon } from '@/components/ui/Icon';
import CategoryIllustration from '@/components/ui/CategoryIllustration';
import { Search, BarChart3, PiggyBank, Shield, Clock, Package, Heart, ChevronRight, Users, Sparkles } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/ui/Container';
import CountUp from '@/components/ui/CountUp';
import FlagIcon from '@/components/ui/FlagIcon';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import TrustLogos from '@/components/ui/TrustLogos';
import Newsletter from '@/components/ui/Newsletter';

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

      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-br from-brand-dark via-brand-dark-800 to-brand-primary text-white overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 via-transparent to-brand-gold/10 animate-gradient" />
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-primary/10 blur-3xl" />

        <div className="relative py-20 sm:py-28 px-4">
          <div className="max-w-content-lg mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-start"
              >
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-caption font-medium px-3 py-1.5 rounded-pill mb-5 border border-white/10">
                  <Sparkles size={12} />
                  AI-Powered Financial Comparison
                </div>
                <h1 className="text-display-lg sm:text-display-xl font-bold mb-4 leading-tight">
                  {t('hero_title')}
                </h1>
                <p className="text-body-sm sm:text-body-lg text-white/60 max-w-lg mb-8">
                  {t('hero_subtitle')}
                </p>
                <div className="max-w-xl">
                  <HeroSearch />
                </div>
                <div className="mt-5 flex items-center gap-4 justify-center lg:justify-start">
                  <div className="flex -space-x-2">
                    {['bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400'].map((c, i) => (
                      <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-brand-dark flex items-center justify-center`}>
                        <Users size={10} className="text-white" />
                      </div>
                    ))}
                  </div>
                  <span className="text-white/40 text-caption">Trusted by 10,000+ UAE expats</span>
                </div>
              </motion.div>

              {/* Right: Hero image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block relative"
              >
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80"
                    alt="Dubai skyline"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent" />
                  {/* Floating stat cards on image */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                    <div className="bg-white/15 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20 flex-1">
                      <div className="text-caption text-white/60">Best Rate</div>
                      <div className="text-sm font-bold text-white">22.45 INR/AED</div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20 flex-1">
                      <div className="text-caption text-white/60">You Save</div>
                      <div className="text-sm font-bold text-emerald-300">+1,200 INR</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
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

      {/* ===== TRUST LOGOS STRIP ===== */}
      <TrustLogos />

      {/* ===== RATE INTELLIGENCE ===== */}
      <AnimatedSection className="section-padding bg-white">
        <Container size="lg">
          <SectionHeading
            title={t('rate_trend')}
            subtitle="Real-time exchange rate tracking powered by AI"
          />
          <div className="flex justify-center mb-6">
            <RateTrend />
          </div>
          <RateChart days={7} />
        </Container>
      </AnimatedSection>

      {/* ===== PRODUCT CATEGORIES ===== */}
      <section className="section-padding bg-surface-50">
        <Container size="lg">
          <AnimatedSection>
            <SectionHeading
              title={t('explore_products')}
              subtitle="Compare the best financial products in UAE"
            />
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {CATEGORIES.map((cat) => (
              <StaggerItem key={cat.key}>
                <Link
                  href={cat.href}
                  className={`group flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl text-center transition-all duration-300 hover:shadow-elevated hover:-translate-y-1.5 ${
                    cat.highlighted
                      ? 'bg-gradient-to-b from-brand-primary-50 to-white border-2 border-brand-primary/30 shadow-card'
                      : 'bg-white border border-surface-200 hover:border-brand-primary/20 shadow-card'
                  }`}
                >
                  <CategoryIllustration
                    category={cat.categoryKey}
                    size={56}
                  />
                  <span className={`text-xs sm:text-sm font-semibold leading-tight ${cat.highlighted ? 'text-brand-primary' : 'text-gray-700 group-hover:text-brand-primary'} transition-colors`}>
                    {t(`categories.${cat.key}`)}
                  </span>
                  <span className="text-caption text-gray-400 font-medium group-hover:text-brand-primary/60 transition-colors flex items-center gap-0.5">
                    Compare <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section-padding bg-white">
        <Container size="lg">
          <AnimatedSection>
            <SectionHeading
              title={t('how_it_works')}
              subtitle="Three simple steps to save money on every transaction"
            />
          </AnimatedSection>
          <StaggerContainer className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((step, idx) => (
              <StaggerItem key={step.key}>
                <div className="text-center relative">
                  {idx < STEPS.length - 1 && (
                    <div className="hidden sm:block absolute top-8 start-[60%] w-[80%] h-px bg-gradient-to-r from-surface-300 via-brand-primary/20 to-surface-300" />
                  )}
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <step.icon size={30} className="text-white" />
                  </div>
                  <div className="inline-flex items-center gap-1 text-caption font-bold text-brand-primary mb-2 bg-brand-primary-50 px-3 py-1 rounded-pill">
                    {t('step')} {idx + 1} — {step.label}
                  </div>
                  <p className="text-body-sm text-gray-600 max-w-xs mx-auto">{t(step.key)}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ===== TRUST SIGNALS ===== */}
      <section className="section-padding bg-brand-primary-50 border-y border-brand-primary-100">
        <Container size="lg">
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {TRUST_STATS.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-card flex items-center justify-center mx-auto mb-3">
                    <stat.icon size={24} className="text-brand-primary" />
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
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ===== BUILT FOR EXPATS ===== */}
      <section className="section-padding bg-white relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=1600&q=60"
            alt="UAE cityscape"
            fill
            className="object-cover opacity-[0.04]"
          />
        </div>
        <Container size="md" className="relative">
          <AnimatedSection>
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
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white border border-surface-200 rounded-pill text-sm font-medium text-gray-600 hover:border-brand-primary/30 hover:shadow-card transition-all shadow-sm"
                  >
                    <FlagIcon code={country.code} size={20} />
                    {country.name}
                  </span>
                ))}
              </div>
              <Link
                href="/credit-cards"
                className="btn-primary mt-10 inline-flex shadow-glow-primary"
              >
                Start comparing
                <ChevronRight size={16} />
              </Link>
            </div>
          </AnimatedSection>
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
