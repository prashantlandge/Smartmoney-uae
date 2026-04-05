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
import CategoryIllustration from '@/components/ui/CategoryIllustration';
import { ChevronRight, Sparkles, Shield, RefreshCw, Zap, BadgeCheck, Search, BarChart3, PiggyBank } from 'lucide-react';
import TrustLogos from '@/components/ui/TrustLogos';
import TabbedShowcase from '@/components/homepage/TabbedShowcase';

const CATEGORIES = [
  { key: 'remittance', categoryKey: 'remittance', href: '/', desc: 'Best exchange rates', color: 'bg-blue-50 border-blue-100 hover:bg-blue-100' },
  { key: 'credit_cards', categoryKey: 'credit_cards', href: '/credit-cards', desc: 'Cashback & rewards', color: 'bg-purple-50 border-purple-100 hover:bg-purple-100' },
  { key: 'personal_loans', categoryKey: 'personal_loans', href: '/personal-loans', desc: 'Lowest rates', color: 'bg-teal-50 border-teal-100 hover:bg-teal-100' },
  { key: 'islamic_finance', categoryKey: 'islamic_finance', href: '/islamic-finance', desc: 'Shariah-compliant', color: 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100' },
  { key: 'car_insurance', categoryKey: 'car_insurance', href: '/car-insurance', desc: 'Comprehensive cover', color: 'bg-amber-50 border-amber-100 hover:bg-amber-100' },
  { key: 'health_insurance', categoryKey: 'health_insurance', href: '/health-insurance', desc: 'DHA/HAAD plans', color: 'bg-rose-50 border-rose-100 hover:bg-rose-100' },
];

const TRUST_STATS = [
  { icon: BadgeCheck, label: 'Free & Unbiased' },
  { icon: RefreshCw, label: 'Updated Daily' },
  { icon: Shield, label: 'CBUAE Regulated' },
  { icon: Zap, label: '50+ Products' },
];

const HOW_IT_WORKS = [
  { icon: Search, title: 'Compare', desc: 'Browse 50+ products across 6 categories' },
  { icon: BarChart3, title: 'Analyze', desc: 'AI insights help you pick the best option' },
  { icon: PiggyBank, title: 'Save', desc: 'Apply directly and save on fees & rates' },
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

      {/* ===== HERO — BankBazaar blue gradient ===== */}
      <section className="bg-gradient-to-br from-brand-nav via-brand-nav to-brand-nav-dark text-white">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-badge mb-3">
                <Sparkles size={12} />
                AI-Powered Comparison
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
                {t('hero_title')}
              </h1>
              <p className="text-sm text-white/80 max-w-lg mb-5">
                {t('hero_subtitle')}
              </p>
              <div className="max-w-lg">
                <HeroSearch />
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                {TRUST_STATS.map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5 text-xs text-white/70">
                    <s.icon size={13} className="text-brand-primary" />
                    <span className="font-medium">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Category quick links — desktop */}
            <div className="hidden lg:block w-72 shrink-0">
              <div className="bg-white rounded-card p-3 shadow-card">
                <p className="text-label font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Quick Compare</p>
                <div className="space-y-0.5">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.key}
                      href={cat.href}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-button text-sm text-brand-dark hover:bg-surface-50 transition-colors group"
                    >
                      <CategoryIllustration category={cat.categoryKey} size={20} />
                      <span className="flex-1 font-medium text-body-sm">{t(`categories.${cat.key}`)}</span>
                      <ChevronRight size={13} className="text-gray-300 group-hover:text-brand-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== REMITTANCE CALCULATOR — elevated overlap ===== */}
      <section className="px-4 sm:px-8 -mt-5 relative z-10 mb-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-card border border-surface-200 shadow-card p-4 sm:p-5">
            <RemittanceCalculator />
          </div>
        </div>
      </section>

      {/* ===== PRODUCT CATEGORIES — compact grid ===== */}
      <section className="bg-surface-50 border-t border-surface-100">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-sm font-bold text-brand-dark">{t('explore_products')}</h2>
            <span className="text-label text-gray-400">6 Categories</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={cat.href}
                className={`group flex flex-col items-center text-center p-3 rounded-card border transition-all ${cat.color}`}
              >
                <div className="w-9 h-9 flex items-center justify-center mb-1.5">
                  <CategoryIllustration category={cat.categoryKey} size={26} />
                </div>
                <span className="text-body-sm font-semibold text-brand-dark mb-0.5">
                  {t(`categories.${cat.key}`)}
                </span>
                <span className="text-label text-gray-400">{cat.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TOP PRODUCTS SHOWCASE ===== */}
      <section className="bg-white border-t border-surface-100">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <h2 className="text-heading-sm font-bold text-brand-dark mb-4">Top Picks for You</h2>
          <TabbedShowcase />
        </div>
      </section>

      {/* ===== RATE INTELLIGENCE ===== */}
      <section className="bg-surface-sky border-t border-surface-100">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <div className="mb-4">
            <h2 className="text-heading-sm font-bold text-brand-dark">{t('rate_trend')}</h2>
            <p className="text-body-sm text-gray-500">Real-time exchange rate tracking</p>
          </div>
          <div className="flex justify-center mb-3">
            <RateTrend />
          </div>
          <RateChart days={7} />
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-white border-t border-surface-100">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <h2 className="text-heading-sm font-bold text-brand-dark text-center mb-5">How SmartMoney Works</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="flex items-start gap-3 p-3.5 rounded-card bg-surface-50 border border-surface-100">
                <div className="w-9 h-9 rounded-button bg-brand-nav flex items-center justify-center shrink-0">
                  <step.icon size={16} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-label font-bold text-brand-nav">Step {i + 1}</span>
                    <span className="text-body-sm font-bold text-brand-dark">{step.title}</span>
                  </div>
                  <p className="text-body-sm text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST LOGOS ===== */}
      <TrustLogos />

      {/* ===== NEWSLETTER — compact inline ===== */}
      <section className="bg-brand-nav">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-bold text-white">Get weekly rate alerts & tips</h3>
              <p className="text-label text-white/60">Best exchange rates and offers for UAE expats</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-56 px-3 py-2 bg-white/10 border border-white/20 rounded-button text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button type="submit" className="px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-button hover:bg-brand-primary-600 transition-colors">
                Subscribe
              </button>
            </form>
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
