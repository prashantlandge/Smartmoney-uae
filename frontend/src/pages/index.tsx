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
    { label: t('categories.remittance'), href: '/', icon: ArrowLeftRight, desc: t('cat_remittance_desc') },
    { label: t('categories.credit_cards'), href: '/credit-cards', icon: CreditCard, desc: t('cat_cards_desc') },
    { label: t('nav_loans'), href: '/personal-loans', icon: Wallet, desc: t('cat_loans_desc') },
    { label: t('nav_insurance'), href: '/car-insurance', icon: Shield, desc: t('cat_insurance_desc') },
    { label: t('nav_tools'), href: '/calculators', icon: Calculator, desc: t('cat_tools_desc') },
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

      {/* ===== HERO (dark navy gradient like RupeeLens) ===== */}
      <section className="gradient-hero text-white relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-0 start-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 end-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="max-w-content-xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white text-label font-semibold px-3 py-1.5 rounded-pill mb-4 border border-white/10">
            <Sparkles size={12} />
            {t('hero_badge')}
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 leading-tight max-w-3xl mx-auto">
            {t('hero_title')}
          </h1>
          <p className="text-sm sm:text-lg text-white/80 max-w-xl mx-auto mb-6">
            {t('hero_subtitle')}
          </p>
          <div className="max-w-2xl mx-auto mb-6">
            <HeroSearch />
          </div>
          <div className="grid grid-cols-4 max-w-lg mx-auto sm:max-w-none sm:flex sm:items-center sm:justify-center sm:gap-8">
            {TRUST_STATS.map((s) => (
              <div key={s.label} className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-white/80">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <s.icon size={14} className="text-white" />
                </div>
                <div className="text-center sm:text-start">
                  <p className="text-xs sm:text-sm font-bold leading-tight">{s.value}</p>
                  <p className="text-[9px] sm:text-xs text-white/50 leading-tight">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REMITTANCE CALCULATOR ===== */}
      <section className="px-4 md:px-6 lg:px-8 -mt-6 relative z-10 mb-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-card border border-gray-100 shadow-elevated p-4 sm:p-6">
            <RemittanceCalculator />
          </div>
        </div>
      </section>

      {/* ===== TRUST LOGOS ===== */}
      <TrustLogos />

      {/* ===== CATEGORIES (bg-gray-50/80 like RupeeLens) ===== */}
      <section className="bg-gray-50/80">
        <div className="max-w-content-xl mx-auto px-4 md:px-6 lg:px-8 section-padding">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-1">{t('explore_title')}</h2>
            <p className="text-sm text-gray-500">{t('explore_subtitle')}</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.label} href={cat.href} className="card-hover group flex flex-col items-center gap-3 p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-gray-900 leading-tight">{cat.label}</p>
                    <p className="text-xs text-gray-500 mt-1 hidden lg:block">{cat.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== AD SLOT ===== */}
      <AdSlot slot="HOME_TOP_AD_UNIT_ID" format="horizontal" className="max-w-content-xl mx-auto px-4 md:px-6 lg:px-8" />

      {/* ===== HOW IT WORKS (white bg) ===== */}
      <section className="bg-white">
        <div className="max-w-content-xl mx-auto px-4 md:px-6 lg:px-8 section-padding">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-1">{t('how_title')}</h2>
            <p className="text-sm text-gray-500">{t('how_subtitle')}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
            {HOW_STEPS.map((step) => (
              <div key={step.title} className="text-center p-4 sm:p-6 rounded-card bg-white border border-gray-100 shadow-card">
                <div className="w-12 h-12 rounded-xl bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                  <step.icon size={22} className="text-primary" />
                </div>
                <span className="text-xs font-bold text-accent uppercase tracking-wider">{t('step')} {step.num}</span>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mt-1 mb-1">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed hidden sm:block">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="bg-gray-50 rounded-card border border-gray-100 p-4 sm:p-6">
            <div className="grid grid-cols-4 gap-3 sm:gap-4 text-center">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-primary">20+</p>
                <p className="text-xs text-gray-500">{t('stats_providers')}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-primary">50+</p>
                <p className="text-xs text-gray-500">{t('stats_products')}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-primary">8</p>
                <p className="text-xs text-gray-500">{t('stats_categories')}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-primary">15 min</p>
                <p className="text-xs text-gray-500">{t('stats_refresh')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AD SLOT ===== */}
      <AdSlot slot="HOME_BOTTOM_AD_UNIT_ID" format="horizontal" className="max-w-content-xl mx-auto px-4 md:px-6 lg:px-8" />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
