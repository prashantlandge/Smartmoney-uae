import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import VatCalculator from '@/components/tax/VatCalculator';
import CorporateTaxCalculator from '@/components/tax/CorporateTaxCalculator';
import TaxResidencyChecker from '@/components/tax/TaxResidencyChecker';
import {
  Receipt, Briefcase, FileText, Scale, ArrowRight, CheckCircle, AlertCircle, Info,
} from 'lucide-react';

const TAX_SECTIONS = [
  { id: 'vat', label: 'VAT Calculator', icon: Receipt, desc: 'Calculate UAE 5% VAT' },
  { id: 'corporate', label: 'Corporate Tax', icon: Briefcase, desc: 'New 9% corporate tax estimator' },
  { id: 'residency', label: 'Tax Residency', icon: FileText, desc: 'Check your UAE tax status' },
  { id: 'guides', label: 'Tax Guides', icon: Scale, desc: 'UAE tax rules explained' },
];

const TAX_GUIDES = [
  {
    title: 'UAE VAT Guide for Residents',
    desc: 'Everything you need to know about the 5% Value Added Tax — what\'s taxable, what\'s exempt, and how it affects your daily spending.',
    points: [
      'Standard rate of 5% applies to most goods and services',
      'Essential food items, healthcare, and education are zero-rated or exempt',
      'Tourists can claim VAT refunds on purchases above AED 250',
      'Businesses with turnover above AED 375,000 must register for VAT',
    ],
  },
  {
    title: 'UAE Corporate Tax: What You Need to Know',
    desc: 'The UAE introduced a 9% corporate tax effective June 2023. Here\'s what businesses need to understand.',
    points: [
      'First AED 375,000 of taxable income is exempt (0% rate)',
      '9% applies to taxable income exceeding AED 375,000',
      'Free Zone entities may qualify for 0% on qualifying income',
      'Personal income from employment remains tax-free',
      'Dividends and capital gains from qualifying shareholdings are exempt',
    ],
  },
  {
    title: 'Tax Residency Certificate (TRC)',
    desc: 'A Tax Residency Certificate can help you avoid double taxation. Here\'s how to obtain one from the FTA.',
    points: [
      'Must have been a UAE resident for at least 183 days in the past 12 months',
      'Apply through the Federal Tax Authority (FTA) portal',
      'Required documents: passport, Emirates ID, visa, proof of address',
      'Processing time: approximately 5-7 business days',
      'Certificate is valid for the tax year specified',
    ],
  },
];

export default function Tax() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Head>
        <title>UAE Tax Tools & Guides — {t('site_name')}</title>
        <meta name="description" content="UAE tax calculators and guides — VAT calculator, corporate tax estimator, tax residency checker, and comprehensive tax guides for UAE residents." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-dark via-brand-dark to-gray-800 text-white">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 mb-2">
            <Scale size={20} />
            <h1 className="text-display-lg font-bold">UAE Tax Tools & Guides</h1>
          </div>
          <p className="text-sm text-white/70 max-w-xl">
            Navigate UAE taxes with confidence. Calculate VAT, estimate corporate tax, check your tax residency status, and learn about UAE tax rules.
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <section className="bg-white border-b border-surface-100 sticky top-[calc(3.5rem+1.75rem)] sm:top-[calc(3.5rem+1.75rem)] z-20">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {TAX_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-button text-xs font-medium text-gray-600 hover:text-brand-nav hover:bg-brand-nav/5 transition-colors whitespace-nowrap shrink-0"
              >
                <sec.icon size={13} />
                {sec.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Overview cards */}
      <section className="bg-surface-50 border-b border-surface-100">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <h2 className="text-heading-sm font-bold text-brand-dark mb-1">UAE Tax Overview</h2>
          <p className="text-body-sm text-gray-500 mb-5">Key tax facts for UAE residents and businesses</p>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-card border border-surface-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-brand-primary-50 flex items-center justify-center">
                  <CheckCircle size={16} className="text-brand-primary" />
                </div>
                <h3 className="text-sm font-bold text-brand-dark">No Income Tax</h3>
              </div>
              <p className="text-label text-gray-500">The UAE does not levy personal income tax on salaries, wages, or employment income — one of the key benefits of living in the UAE.</p>
            </div>
            <div className="bg-white rounded-card border border-surface-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-brand-nav/5 flex items-center justify-center">
                  <Receipt size={16} className="text-brand-nav" />
                </div>
                <h3 className="text-sm font-bold text-brand-dark">5% VAT</h3>
              </div>
              <p className="text-label text-gray-500">Value Added Tax (VAT) of 5% applies to most goods and services. Essential items like basic food, healthcare, and education may be exempt.</p>
            </div>
            <div className="bg-white rounded-card border border-surface-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-warning-light flex items-center justify-center">
                  <Briefcase size={16} className="text-warning" />
                </div>
                <h3 className="text-sm font-bold text-brand-dark">9% Corporate Tax</h3>
              </div>
              <p className="text-label text-gray-500">Since June 2023, corporate tax of 9% applies to business profits exceeding AED 375,000. Free zone entities may qualify for 0% rate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tax calculators */}
      <div className="max-w-content-lg mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8">
        <div id="vat" className="scroll-mt-32">
          <VatCalculator />
        </div>

        <div id="corporate" className="scroll-mt-32">
          <CorporateTaxCalculator />
        </div>

        <div id="residency" className="scroll-mt-32">
          <TaxResidencyChecker />
        </div>

        {/* Tax Guides */}
        <div id="guides" className="scroll-mt-32 space-y-4">
          <h2 className="text-heading-sm font-bold text-brand-dark flex items-center gap-2">
            <Scale size={18} className="text-brand-nav" />
            Tax Guides
          </h2>

          {TAX_GUIDES.map((guide) => (
            <div key={guide.title} className="bg-white rounded-card border border-surface-200 overflow-hidden">
              <div className="p-5">
                <h3 className="text-sm font-bold text-brand-dark mb-1">{guide.title}</h3>
                <p className="text-body-sm text-gray-500 mb-3">{guide.desc}</p>
                <ul className="space-y-1.5">
                  {guide.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle size={13} className="text-brand-primary shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div className="bg-info-light border border-blue-200 rounded-card p-4 flex items-start gap-3">
            <Info size={16} className="text-info shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-info-dark">Disclaimer</p>
              <p className="text-xs text-gray-600 mt-1">
                The information provided here is for general guidance only and does not constitute tax advice. Tax laws and regulations are subject to change. Please consult a qualified tax advisor for advice specific to your situation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="bg-brand-nav">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Looking for financial products?</h3>
              <p className="text-label text-white/60">Compare credit cards, loans, and insurance tailored for UAE residents</p>
            </div>
            <Link href="/" className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-button hover:bg-brand-primary-600 transition-colors">
              Compare Products <ArrowRight size={14} />
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
