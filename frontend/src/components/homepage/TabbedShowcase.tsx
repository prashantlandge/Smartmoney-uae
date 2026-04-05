import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { CreditCard, Landmark, Moon, Car, HeartPulse, Award, ChevronRight, Check } from 'lucide-react';
import ProviderLogo from '@/components/ui/ProviderLogo';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

interface FeaturedProduct {
  name: string;
  provider: string;
  badge: string;
  features: string[];
  href: string;
}

interface Tab {
  key: string;
  label: string;
  icon: typeof CreditCard;
  color: string;
  href: string;
  products: FeaturedProduct[];
}

const TABS: Tab[] = [
  {
    key: 'credit-cards',
    label: 'Credit Cards',
    icon: CreditCard,
    color: 'from-indigo-500 to-indigo-600',
    href: '/credit-cards',
    products: [
      {
        name: 'Cashback Plus Card',
        provider: 'Emirates NBD',
        badge: 'Best Cashback',
        features: ['5% cashback on dining', 'No annual fee (1st year)', 'AED 5,000 min salary'],
        href: '/credit-cards',
      },
      {
        name: 'Skywards Infinite',
        provider: 'Emirates NBD',
        badge: 'Best Travel',
        features: ['4 Skywards miles/AED', 'Airport lounge access', 'Travel insurance included'],
        href: '/credit-cards',
      },
      {
        name: 'World Elite Card',
        provider: 'Mashreq',
        badge: 'Best Premium',
        features: ['Unlimited lounge visits', 'Concierge service', 'AED 15,000 min salary'],
        href: '/credit-cards',
      },
    ],
  },
  {
    key: 'personal-loans',
    label: 'Personal Loans',
    icon: Landmark,
    color: 'from-cyan-500 to-teal-600',
    href: '/personal-loans',
    products: [
      {
        name: 'Flexi Loan',
        provider: 'ADCB',
        badge: 'Lowest Rate',
        features: ['From 5.99% flat rate', 'Up to AED 4M', 'Salary transfer not required'],
        href: '/personal-loans',
      },
      {
        name: 'Personal Finance',
        provider: 'Emirates NBD',
        badge: 'Best Overall',
        features: ['From 6.49% flat rate', 'Up to AED 3M', 'Quick approval in 30 min'],
        href: '/personal-loans',
      },
      {
        name: 'Quick Cash Loan',
        provider: 'FAB',
        badge: 'Fastest Approval',
        features: ['Same day disbursement', 'Up to AED 2.5M', 'Minimal documentation'],
        href: '/personal-loans',
      },
    ],
  },
  {
    key: 'islamic-finance',
    label: 'Islamic Finance',
    icon: Moon,
    color: 'from-emerald-500 to-emerald-600',
    href: '/islamic-finance',
    products: [
      {
        name: 'Shariah Portfolio',
        provider: 'DIB',
        badge: 'Best Islamic',
        features: ['100% Shariah compliant', 'Profit rates from 4.5%', 'No processing fee'],
        href: '/islamic-finance',
      },
      {
        name: 'Islamic Personal Finance',
        provider: 'ADCB Islamic',
        badge: 'Best Rate',
        features: ['From 5.25% profit rate', 'Up to AED 3M', 'Salary transfer flexible'],
        href: '/islamic-finance',
      },
      {
        name: 'Etihad Guest Islamic Card',
        provider: 'FAB Islamic',
        badge: "Editor's Pick",
        features: ['Halal rewards program', 'No annual fee (1st year)', 'Tiered cashback up to 5%'],
        href: '/islamic-finance',
      },
    ],
  },
  {
    key: 'car-insurance',
    label: 'Car Insurance',
    icon: Car,
    color: 'from-amber-500 to-amber-600',
    href: '/car-insurance',
    products: [
      {
        name: 'Comprehensive Cover',
        provider: 'AXA',
        badge: 'Best Value',
        features: ['Agency repair', '24/7 roadside assist', 'From AED 1,800/year'],
        href: '/car-insurance',
      },
      {
        name: 'Motor Shield',
        provider: 'Orient Insurance',
        badge: 'Best Budget',
        features: ['Third party + theft', 'Oman extension included', 'From AED 750/year'],
        href: '/car-insurance',
      },
      {
        name: 'Smart Motor',
        provider: 'Salama',
        badge: 'Islamic Option',
        features: ['Takaful compliant', 'GCC coverage', 'Free car replacement'],
        href: '/car-insurance',
      },
    ],
  },
];

export default function TabbedShowcase() {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState(0);

  const tab = TABS[activeTab];

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {TABS.map((tb, idx) => (
          <button
            key={tb.key}
            onClick={() => setActiveTab(idx)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              idx === activeTab
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                : 'bg-white text-gray-600 border border-surface-200 hover:border-brand-primary/30 hover:text-brand-primary'
            }`}
          >
            <tb.icon size={18} />
            {tb.label}
          </button>
        ))}
      </div>

      {/* Product cards */}
      <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
        {tab.products.map((product, idx) => (
          <div
            key={product.name}
            className={`bg-white rounded-2xl border p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 ${
              idx === 0 ? 'border-lime-300 ring-2 ring-lime-200/50' : 'border-surface-200'
            }`}
          >
            {/* Badge */}
            <div className="mb-4">
              <Badge
                variant={idx === 0 ? 'best' : 'promoted'}
                icon={<Award size={12} />}
              >
                {product.badge}
              </Badge>
            </div>

            {/* Provider + name */}
            <div className="flex items-center gap-3.5 mb-4">
              <ProviderLogo name={product.provider} size={44} />
              <div>
                <h4 className="text-base font-bold text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-500">{product.provider}</p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2.5 mb-5">
              {product.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <Check size={16} className="text-brand-primary shrink-0 mt-0.5" />
                  {feat}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={product.href}
              className="text-sm font-semibold text-brand-primary hover:text-brand-primary-700 flex items-center gap-1.5 transition-colors"
            >
              View details <ChevronRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      {/* See all link */}
      <div className="text-center mt-8">
        <Link
          href={tab.href}
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primary-700 transition-colors bg-brand-primary-50 px-6 py-3 rounded-xl hover:bg-brand-primary-100"
        >
          View all {tab.label.toLowerCase()} <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
