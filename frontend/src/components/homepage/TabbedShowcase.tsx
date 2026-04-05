import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { CreditCard, Landmark, Moon, Car, Check, ChevronRight } from 'lucide-react';
import ProviderLogo from '@/components/ui/ProviderLogo';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

interface FeaturedProduct {
  name: string;
  provider: string;
  badge: string;
  badgeType: 'best' | 'promoted';
  features: string[];
  href: string;
}

interface Tab {
  key: string;
  label: string;
  icon: typeof CreditCard;
  href: string;
  products: FeaturedProduct[];
}

const TABS: Tab[] = [
  {
    key: 'credit-cards',
    label: 'Credit Cards',
    icon: CreditCard,
    href: '/credit-cards',
    products: [
      {
        name: 'Cashback Plus Card',
        provider: 'Emirates NBD',
        badge: 'Best Cashback',
        badgeType: 'best',
        features: ['5% cashback on dining', 'No annual fee (1st year)', 'AED 5,000 min salary'],
        href: '/credit-cards',
      },
      {
        name: 'Skywards Infinite',
        provider: 'Emirates NBD',
        badge: 'Best Travel',
        badgeType: 'promoted',
        features: ['4 Skywards miles/AED', 'Airport lounge access', 'Travel insurance included'],
        href: '/credit-cards',
      },
      {
        name: 'World Elite Card',
        provider: 'Mashreq',
        badge: 'Best Premium',
        badgeType: 'promoted',
        features: ['Unlimited lounge visits', 'Concierge service', 'AED 15,000 min salary'],
        href: '/credit-cards',
      },
    ],
  },
  {
    key: 'personal-loans',
    label: 'Personal Loans',
    icon: Landmark,
    href: '/personal-loans',
    products: [
      {
        name: 'Flexi Loan',
        provider: 'ADCB',
        badge: 'Lowest Rate',
        badgeType: 'best',
        features: ['From 5.99% flat rate', 'Up to AED 4M', 'Salary transfer not required'],
        href: '/personal-loans',
      },
      {
        name: 'Personal Finance',
        provider: 'Emirates NBD',
        badge: 'Best Overall',
        badgeType: 'promoted',
        features: ['From 6.49% flat rate', 'Up to AED 3M', 'Quick approval in 30 min'],
        href: '/personal-loans',
      },
      {
        name: 'Quick Cash Loan',
        provider: 'FAB',
        badge: 'Fastest Approval',
        badgeType: 'promoted',
        features: ['Same day disbursement', 'Up to AED 2.5M', 'Minimal documentation'],
        href: '/personal-loans',
      },
    ],
  },
  {
    key: 'islamic-finance',
    label: 'Islamic Finance',
    icon: Moon,
    href: '/islamic-finance',
    products: [
      {
        name: 'Shariah Portfolio',
        provider: 'DIB',
        badge: 'Best Islamic',
        badgeType: 'best',
        features: ['100% Shariah compliant', 'Profit rates from 4.5%', 'No processing fee'],
        href: '/islamic-finance',
      },
      {
        name: 'Islamic Personal Finance',
        provider: 'ADCB Islamic',
        badge: 'Best Rate',
        badgeType: 'promoted',
        features: ['From 5.25% profit rate', 'Up to AED 3M', 'Salary transfer flexible'],
        href: '/islamic-finance',
      },
      {
        name: 'Etihad Guest Islamic Card',
        provider: 'FAB Islamic',
        badge: "Editor's Pick",
        badgeType: 'promoted',
        features: ['Halal rewards program', 'No annual fee (1st year)', 'Tiered cashback up to 5%'],
        href: '/islamic-finance',
      },
    ],
  },
  {
    key: 'car-insurance',
    label: 'Car Insurance',
    icon: Car,
    href: '/car-insurance',
    products: [
      {
        name: 'Comprehensive Cover',
        provider: 'AXA',
        badge: 'Best Value',
        badgeType: 'best',
        features: ['Agency repair', '24/7 roadside assist', 'From AED 1,800/year'],
        href: '/car-insurance',
      },
      {
        name: 'Motor Shield',
        provider: 'Orient Insurance',
        badge: 'Best Budget',
        badgeType: 'promoted',
        features: ['Third party + theft', 'Oman extension included', 'From AED 750/year'],
        href: '/car-insurance',
      },
      {
        name: 'Smart Motor',
        provider: 'Salama',
        badge: 'Islamic Option',
        badgeType: 'promoted',
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
      {/* Tab buttons — compact pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {TABS.map((tb, idx) => (
          <button
            key={tb.key}
            onClick={() => setActiveTab(idx)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-button text-body-sm font-semibold whitespace-nowrap transition-all ${
              idx === activeTab
                ? 'bg-brand-nav text-white'
                : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
            }`}
          >
            <tb.icon size={14} />
            {tb.label}
          </button>
        ))}
      </div>

      {/* Product cards — equal height */}
      <div className="grid sm:grid-cols-3 gap-3">
        {tab.products.map((product, idx) => (
          <div
            key={product.name}
            className={`bg-white rounded-card border p-4 hover:shadow-card-hover transition-all flex flex-col ${
              idx === 0 ? 'border-brand-primary/30 ring-1 ring-brand-primary/10' : 'border-surface-200'
            }`}
          >
            {/* Badge */}
            <div className="mb-3">
              <Badge variant={product.badgeType}>
                {product.badge}
              </Badge>
            </div>

            {/* Provider + name */}
            <div className="flex items-center gap-3 mb-3">
              <ProviderLogo name={product.provider} size={44} />
              <div className="min-w-0">
                <h4 className="text-body-sm font-bold text-brand-dark truncate">{product.name}</h4>
                <p className="text-label text-gray-500">{product.provider}</p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-1.5 mb-4 flex-1">
              {product.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2 text-body-sm text-gray-600">
                  <Check size={14} className="text-brand-primary shrink-0 mt-0.5" />
                  {feat}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={product.href}
              className="text-body-sm font-bold text-accent hover:text-accent-hover flex items-center gap-1 transition-colors mt-auto"
            >
              View details <ChevronRight size={14} />
            </Link>
          </div>
        ))}
      </div>

      {/* See all */}
      <div className="text-center mt-5">
        <Link
          href={tab.href}
          className="inline-flex items-center gap-1.5 text-body-sm font-bold text-white bg-brand-nav hover:bg-brand-nav-hover px-5 py-2.5 rounded-button transition-colors"
        >
          View all {tab.label.toLowerCase()} <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
