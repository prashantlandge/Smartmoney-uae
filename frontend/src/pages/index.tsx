import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/ui/SEOHead';
import HeroSearch from '@/components/search/HeroSearch';
import RemittanceCalculator from '@/components/remittance/RemittanceCalculator';
import TrustLogos from '@/components/ui/TrustLogos';
import AdSlot from '@/components/ui/AdSlot';
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
      <SEOHead
        title="Compare Best Financial Products in UAE"
        description="Compare remittance rates, credit cards, loans, and insurance from 20+ UAE providers. Live rates updated every 15 minutes."
        path="/"
      />

      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-br from-brand-nav via-brand-nav to-brand-nav-dark text-white">
        <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-label font-semibold px-2.5 py-1 rounded-pill mb-2.5">
            <Sparkles size={11} />
            {t('hero_badge')}
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 leading-tight max-w-2xl mx-auto">
            {t('hero_title')}
          </h1>
          <p className="text-sm text-white/70 max-w-xl mx-auto mb-4">
            {t('hero_subtitle')}
          </p>
          <div className="max-w-lg mx-auto mb-4">
            <HeroSearch />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {TRUST_STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 text-white/80">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                  <s.icon size={13} className="text-white" />
                </div>
                <div className="text-start">
                  <p className="text-xs sm:text-sm font-bold leading-tight">{s.value}</p>
                  <p className="text-[10px] sm:text-label text-white/50">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REMITTANCE CALCULATOR ===== */}
      <section className="px-4 sm:px-6 -mt-4 relative z-10 mb-2">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-card border border-surface-200 shadow-elevated p-3 sm:p-4">
            <RemittanceCalculator />
          </div>
        </div>
      </section>

      {/* ===== TRUST LOGOS ===== */}
      <TrustLogos />

      {/* ===== CATEGORIES ===== */}
      <section className="bg-surface-50 border-b border-surface-100">
        <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <div className="text-center mb-4">
            <h2 className="text-heading-md font-bold text-brand-dark mb-0.5">{t('explore_title')}</h2>
            <p className="text-body-sm text-gray-500">{t('explore_subtitle')}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.label} href={cat.href} className={`group flex items-center gap-2.5 p-3 rounded-card border transition-all ${cat.color}`}>
                  <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:shadow-card transition-shadow">
                    <Icon size={18} className="text-brand-nav" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-sm font-semibold text-brand-dark leading-tight">{cat.label}</p>
                    <p className="text-label text-gray-400 hidden sm:block">{cat.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== AD SLOT ===== */}
      <AdSlot slot="HOME_TOP_AD_UNIT_ID" format="horizontal" className="max-w-content-xl mx-auto px-4 sm:px-6" />

      {/* ===== HOW IT WORKS + STATS ===== */}
      <section className="bg-white border-b border-surface-100">
        <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <div className="text-center mb-4">
            <h2 className="text-heading-md font-bold text-brand-dark mb-0.5">{t('how_title')}</h2>
            <p className="text-body-sm text-gray-500">{t('how_subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mb-5">
            {HOW_STEPS.map((step) => (
              <div key={step.title} className="text-center p-4 rounded-card bg-surface-50 border border-surface-100">
                <div className="w-10 h-10 rounded-full bg-brand-nav mx-auto mb-2 flex items-center justify-center">
                  <step.icon size={18} className="text-white" />
                </div>
                <span className="text-label font-bold text-brand-nav">{t('step')} {step.num}</span>
                <h3 className="text-body-sm font-bold text-brand-dark mt-0.5 mb-0.5">{step.title}</h3>
                <p className="text-label text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-brand-nav/5 rounded-card border border-brand-nav/10 p-4">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-heading-lg font-bold text-brand-nav">20+</p>
                <p className="text-label text-gray-500">{t('stats_providers')}</p>
              </div>
              <div>
                <p className="text-heading-lg font-bold text-brand-nav">50+</p>
                <p className="text-label text-gray-500">{t('stats_products')}</p>
              </div>
              <div>
                <p className="text-heading-lg font-bold text-brand-nav">8</p>
                <p className="text-label text-gray-500">{t('stats_categories')}</p>
              </div>
              <div>
                <p className="text-heading-lg font-bold text-brand-nav">15 min</p>
                <p className="text-label text-gray-500">{t('stats_refresh')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="bg-brand-nav">
        <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="text-center sm:text-start">
              <h3 className="text-sm font-bold text-white">{t('newsletter_title')}</h3>
              <p className="text-label text-white/60">{t('newsletter_subtitle')}</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder={t('newsletter_placeholder')}
                className="flex-1 sm:w-48 px-3 py-1.5 bg-white/10 border border-white/20 rounded-button text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button type="submit" className="px-3 py-1.5 bg-white text-brand-nav text-sm font-semibold rounded-button hover:bg-white/90 transition-colors">
                {t('newsletter_button')}
              </button>
            </form>
          </div>
        </div>
      </section>
      {/* ===== AD SLOT ===== */}
      <AdSlot slot="HOME_BOTTOM_AD_UNIT_ID" format="horizontal" className="max-w-content-xl mx-auto px-4 sm:px-6" />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
