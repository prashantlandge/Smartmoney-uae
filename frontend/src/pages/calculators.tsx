import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/ui/SEOHead';
import AdSlot from '@/components/ui/AdSlot';
import EmiCalculator from '@/components/calculators/EmiCalculator';
import CashbackCalculator from '@/components/calculators/CashbackCalculator';
import InsuranceEstimator from '@/components/calculators/InsuranceEstimator';
import SavingsCalculator from '@/components/calculators/SavingsCalculator';
import FuelCostCalculator from '@/components/calculators/FuelCostCalculator';
import EligibilityChecker from '@/components/eligibility/EligibilityChecker';
import {
  Calculator, Percent, Car, HeartPulse, CheckCircle, PiggyBank, Fuel, ArrowRight,
} from 'lucide-react';

const CALCULATOR_SECTIONS = [
  { id: 'emi', label: 'EMI Calculator', icon: Calculator, desc: 'Calculate your EMI instantly' },
  { id: 'cashback', label: 'Cashback Calculator', icon: Percent, desc: 'Compare card cashback returns' },
  { id: 'savings', label: 'Savings Calculator', icon: PiggyBank, desc: 'Plan your savings goals' },
  { id: 'fuel', label: 'Fuel Cost Calculator', icon: Fuel, desc: 'Plan your fuel expenses' },
  { id: 'car-insurance', label: 'Car Insurance Estimator', icon: Car, desc: 'Estimate car premium' },
  { id: 'health-insurance', label: 'Health Insurance Estimator', icon: HeartPulse, desc: 'Estimate health costs' },
  { id: 'eligibility', label: 'Loan Eligibility', icon: CheckCircle, desc: 'Check what you qualify for' },
];

export default function Calculators() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <SEOHead
        title="Financial Calculators"
        description="Free EMI calculator, cashback calculator, fuel cost calculator and more for UAE residents."
        path="/calculators"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary-600 text-white">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 mb-2">
            <Calculator size={20} />
            <h1 className="text-display-lg font-bold">{t('calc_page_title')}</h1>
          </div>
          <p className="text-sm text-white/70 max-w-xl">
            {t('calc_page_desc')}
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <section className="bg-white border-b border-gray-100 sticky top-[6.25rem] z-20">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {CALCULATOR_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-button text-xs font-medium text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors whitespace-nowrap shrink-0"
              >
                <sec.icon size={13} />
                {sec.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator grid — RupeeLens style */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <h2 className="text-heading-sm font-bold text-gray-900 mb-1">{t('calc_all')}</h2>
          <p className="text-body-sm text-gray-500 mb-5">{t('calc_all_desc')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CALCULATOR_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="flex items-start gap-3 p-3.5 bg-white rounded-card border border-gray-200 hover:border-primary/30 hover:shadow-card transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <sec.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{sec.label}</p>
                  <p className="text-label text-gray-400">{sec.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Individual calculators */}
      <div className="max-w-content-lg mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8">
        <div id="emi" className="scroll-mt-32">
          <EmiCalculator />
        </div>

        <div id="cashback" className="scroll-mt-32">
          <CashbackCalculator />
        </div>

        <div id="savings" className="scroll-mt-32">
          <SavingsCalculator />
        </div>

        {/* Ad slot between calculator sections */}
        <div className="py-2">
          <AdSlot slot="CALC_MID_AD_UNIT_ID" format="horizontal" />
        </div>

        <div id="fuel" className="scroll-mt-32">
          <FuelCostCalculator />
        </div>

        <div id="car-insurance" className="scroll-mt-32">
          <InsuranceEstimator type="car" />
        </div>

        <div id="health-insurance" className="scroll-mt-32">
          <InsuranceEstimator type="health" />
        </div>

        <div id="eligibility" className="scroll-mt-32">
          <EligibilityChecker />
        </div>
      </div>

      {/* CTA */}
      <section className="bg-primary">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">{t('calc_cta_title')}</h3>
              <p className="text-label text-white/60">{t('calc_cta_desc')}</p>
            </div>
            <Link href="/recommend" className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-button hover:bg-primary-600 transition-colors">
              {t('nav_smart_compare')} <ArrowRight size={14} />
            </Link>
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
