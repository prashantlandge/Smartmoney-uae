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
  ArrowLeftRight, CreditCard, Wallet, Landmark, Car, HeartPulse,
  Calculator, Receipt, ChevronRight, Sparkles, Shield, RefreshCw,
  Zap, BadgeCheck, Search, BarChart3, PiggyBank, Users, Star,
} from 'lucide-react';

/* ─── Categories with icons ─── */
const CATEGORIES = [
  { key: 'remittance', label: 'Remittance', href: '/', icon: ArrowLeftRight, desc: 'Best exchange rates', color: 'bg-blue-50 hover:bg-blue-100 border-blue-100' },
  { key: 'credit_cards', label: 'Credit Cards', href: '/credit-cards', icon: CreditCard, desc: 'Cashback & rewards', color: 'bg-purple-50 hover:bg-purple-100 border-purple-100' },
  { key: 'personal_loans', label: 'Personal Loans', href: '/personal-loans', icon: Wallet, desc: 'Lowest rates', color: 'bg-teal-50 hover:bg-teal-100 border-teal-100' },
  { key: 'islamic_finance', label: 'Islamic Finance', href: '/islamic-finance', icon: Landmark, desc: 'Shariah-compliant', color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-100' },
  { key: 'car_insurance', label: 'Car Insurance', href: '/car-insurance', icon: Car, desc: 'Comprehensive cover', color: 'bg-amber-50 hover:bg-amber-100 border-amber-100' },
  { key: 'health_insurance', label: 'Health Insurance', href: '/health-insurance', icon: HeartPulse, desc: 'DHA/HAAD plans', color: 'bg-rose-50 hover:bg-rose-100 border-rose-100' },
  { key: 'calculators', label: 'Calculators', href: '/calculators', icon: Calculator, desc: 'EMI & cashback', color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100' },
  { key: 'tax', label: 'Tax Tools', href: '/tax', icon: Receipt, desc: 'VAT & corporate', color: 'bg-slate-50 hover:bg-slate-100 border-slate-200' },
];

const TRUST_STATS = [
  { icon: BadgeCheck, label: 'Free & Unbiased', value: '100%' },
  { icon: RefreshCw, label: 'Live Rates', value: 'Every 15 min' },
  { icon: Shield, label: 'UAE Regulated', value: 'CBUAE' },
  { icon: Zap, label: 'Products', value: '50+' },
];

const HOW_STEPS = [
  { icon: Search, num: '1', title: 'Compare', desc: 'Browse 50+ products across 8 categories' },
  { icon: BarChart3, num: '2', title: 'Analyze', desc: 'AI insights help you pick the best option' },
  { icon: PiggyBank, num: '3', title: 'Save', desc: 'Apply directly and save on fees & rates' },
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

      {/* ===== HERO — full width, no sidebar ===== */}
      <section className="bg-gradient-to-br from-brand-nav via-brand-nav to-brand-nav-dark text-white">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-10 sm:py-14 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-label font-semibold px-3 py-1.5 rounded-pill mb-4">
            <Sparkles size={12} />
            UAE&apos;s #1 Financial Comparison Platform
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight max-w-3xl mx-auto">
            Compare & save on every financial product in the UAE
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto mb-6">
            Remittance rates, credit cards, loans, insurance — all compared live from 20+ providers. Free, unbiased, updated every 15 minutes.
          </p>
          <div className="max-w-xl mx-auto mb-6">
            <HeroSearch />
          </div>

          {/* Trust stats row */}
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

      {/* ===== REMITTANCE CALCULATOR — overlapping hero ===== */}
      <section className="px-4 sm:px-8 -mt-5 relative z-10 mb-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-card border border-surface-200 shadow-elevated p-4 sm:p-5">
            <RemittanceCalculator />
          </div>
        </div>
      </section>

      {/* ===== TRUST LOGOS — confidence strip ===== */}
      <TrustLogos />

      {/* ===== CATEGORIES — icon grid ===== */}
      <section className="bg-surface-50 border-b border-surface-100">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          <div className="text-center mb-6">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-1">What are you looking for?</h2>
            <p className="text-body-sm text-gray-500">Compare the best financial products in the UAE</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.key}
                  href={cat.href}
                  className={`group flex items-center gap-3 p-4 rounded-card border transition-all ${cat.color}`}
                >
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

      {/* ===== HOW IT WORKS + CONFIDENCE — merged compact ===== */}
      <section className="bg-white border-b border-surface-100">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          <div className="text-center mb-6">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-1">How SmartMoney works</h2>
            <p className="text-body-sm text-gray-500">3 simple steps to save money</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {HOW_STEPS.map((step) => (
              <div key={step.title} className="text-center p-5 rounded-card bg-surface-50 border border-surface-100">
                <div className="w-12 h-12 rounded-full bg-brand-nav mx-auto mb-3 flex items-center justify-center">
                  <step.icon size={20} className="text-white" />
                </div>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="text-label font-bold text-brand-nav">Step {step.num}</span>
                </div>
                <h3 className="text-heading-sm font-bold text-brand-dark mb-1">{step.title}</h3>
                <p className="text-body-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Social proof / confidence numbers */}
          <div className="bg-brand-nav/5 rounded-card border border-brand-nav/10 p-5 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-display-lg font-bold text-brand-nav">20+</p>
                <p className="text-body-sm text-gray-500">UAE Providers</p>
              </div>
              <div>
                <p className="text-display-lg font-bold text-brand-nav">50+</p>
                <p className="text-body-sm text-gray-500">Products Compared</p>
              </div>
              <div>
                <p className="text-display-lg font-bold text-brand-nav">8</p>
                <p className="text-body-sm text-gray-500">Categories</p>
              </div>
              <div>
                <p className="text-display-lg font-bold text-brand-nav">15 min</p>
                <p className="text-body-sm text-gray-500">Rate Refresh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA — newsletter ===== */}
      <section className="bg-brand-nav">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-start">
              <h3 className="text-sm font-bold text-white">Get weekly rate alerts & money-saving tips</h3>
              <p className="text-label text-white/60">Join 10,000+ UAE expats saving smarter</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-56 px-3 py-2 bg-white/10 border border-white/20 rounded-button text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button type="submit" className="px-4 py-2 bg-white text-brand-nav text-sm font-semibold rounded-button hover:bg-white/90 transition-colors">
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
