import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import HeroSearch from '@/components/search/HeroSearch';
import RemittanceCalculator from '@/components/remittance/RemittanceCalculator';
import TrustLogos from '@/components/ui/TrustLogos';
import {
  ArrowLeftRight, CreditCard, Wallet, Shield, Calculator,
  ChevronRight, Sparkles, Search, BarChart3, PiggyBank,
  BadgeCheck, RefreshCw, Zap,
} from 'lucide-react';

export default function Home() {
  const { t } = useTranslation('common');

  const TRUST_STATS = [
    { icon: BadgeCheck, label: t('trust_free'), value: t('trust_free_value') },
    { icon: RefreshCw, label: t('trust_live'), value: t('trust_live_value') },
    { icon: Shield, label: t('trust_regulated'), value: t('trust_regulated_value') },
    { icon: Zap, label: t('trust_products'), value: t('trust_products_value') },
  ];

  const CATEGORIES = [
    { label: t('categories.remittance'), href: '/', icon: ArrowLeftRight, desc: t('cat_remittance_desc'), color: 'bg-blue-50 hover:bg-blue-100 border-blue-100' },
    { label: t('categories.credit_cards'), href: '/credit-cards', icon: CreditCard, desc: t('cat_cards_desc'), color: 'bg-purple-50 hover:bg-purple-100 border-purple-100' },
    { label: t('nav_loans'), href: '/personal-loans', icon: Wallet, desc: t('cat_loans_desc'), color: 'bg-teal-50 hover:bg-teal-100 border-teal-100' },
    { label: t('nav_insurance'), href: '/car-insurance', icon: Shield, desc: t('cat_insurance_desc'), color: 'bg-amber-50 hover:bg-amber-100 border-amber-100' },
    { label: t('nav_tools'), href: '/calculators', icon: Calculator, desc: t('cat_tools_desc'), color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100' },
  ];

  const HOW_STEPS = [
    { icon: Search, num: '1', title: t('how_step_1_title'), desc: t('how_step_1') },
    { icon: BarChart3, num: '2', title: t('how_step_2_title'), desc: t('how_step_2') },
    { icon: PiggyBank, num: '3', title: t('how_step_3_title'), desc: t('how_step_3') },
  ];

  return (
    <Layout>
      <Head>
        <title>{t('site_name')} — {t('hero_title')}</title>
        <meta name="description" content={t('hero_subtitle')} />
        <link rel="alternate" hrefLang="en" href="/en" />
        <link rel="alternate" hrefLang="ar" href="/ar" />
        <link rel="alternate" hrefLang="x-default" href="/en" />
      </Head>

      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-br from-brand-nav via-brand-nav to-brand-nav-dark text-white">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-10 sm:py-14 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-label font-semibold px-3 py-1.5 rounded-pill mb-4">
            <Sparkles size={12} />
            {t('hero_badge')}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight max-w-3xl mx-auto">
            {t('hero_title')}
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto mb-6">
            {t('hero_subtitle')}
          </p>
          <div className="max-w-xl mx-auto mb-6">
            <HeroSearch />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {TRUST_STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-white/80">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <s.icon size={14} className="text-white" />
                </div>
                <div className="text-start">
                  <p className="text-sm font-bold leading-tight">{s.value}</p>
                  <p className="text-label text-white/50">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REMITTANCE CALCULATOR ===== */}
      <section className="px-4 sm:px-8 -mt-5 relative z-10 mb-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-card border border-surface-200 shadow-elevated p-4 sm:p-5">
            <RemittanceCalculator />
          </div>
        </div>
      </section>

      {/* ===== TRUST LOGOS ===== */}
      <TrustLogos />

      {/* ===== CATEGORIES ===== */}
      <section className="bg-surface-50 border-b border-surface-100">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          <div className="text-center mb-6">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-1">{t('explore_title')}</h2>
            <p className="text-body-sm text-gray-500">{t('explore_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.label} href={cat.href} className={`group flex items-center gap-3 p-4 rounded-card border transition-all ${cat.color}`}>
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:shadow-card transition-shadow">
                    <Icon size={20} className="text-brand-nav" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-sm font-semibold text-brand-dark">{cat.label}</p>
                    <p className="text-label text-gray-400">{cat.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS + STATS ===== */}
      <section className="bg-white border-b border-surface-100">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          <div className="text-center mb-6">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-1">{t('how_title')}</h2>
            <p className="text-body-sm text-gray-500">{t('how_subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {HOW_STEPS.map((step) => (
              <div key={step.title} className="text-center p-5 rounded-card bg-surface-50 border border-surface-100">
                <div className="w-12 h-12 rounded-full bg-brand-nav mx-auto mb-3 flex items-center justify-center">
                  <step.icon size={20} className="text-white" />
                </div>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="text-label font-bold text-brand-nav">{t('step')} {step.num}</span>
                </div>
                <h3 className="text-heading-sm font-bold text-brand-dark mb-1">{step.title}</h3>
                <p className="text-body-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-brand-nav/5 rounded-card border border-brand-nav/10 p-5 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-display-lg font-bold text-brand-nav">20+</p>
                <p className="text-body-sm text-gray-500">{t('stats_providers')}</p>
              </div>
              <div>
                <p className="text-display-lg font-bold text-brand-nav">50+</p>
                <p className="text-body-sm text-gray-500">{t('stats_products')}</p>
              </div>
              <div>
                <p className="text-display-lg font-bold text-brand-nav">8</p>
                <p className="text-body-sm text-gray-500">{t('stats_categories')}</p>
              </div>
              <div>
                <p className="text-display-lg font-bold text-brand-nav">15 min</p>
                <p className="text-body-sm text-gray-500">{t('stats_refresh')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="bg-brand-nav">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-start">
              <h3 className="text-sm font-bold text-white">{t('newsletter_title')}</h3>
              <p className="text-label text-white/60">{t('newsletter_subtitle')}</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder={t('newsletter_placeholder')}
                className="flex-1 sm:w-56 px-3 py-2 bg-white/10 border border-white/20 rounded-button text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button type="submit" className="px-4 py-2 bg-white text-brand-nav text-sm font-semibold rounded-button hover:bg-white/90 transition-colors">
                {t('newsletter_button')}
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
