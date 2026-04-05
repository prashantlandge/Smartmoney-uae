import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { CreditCard, Landmark, Moon, Car, Check, ChevronRight } from 'lucide-react';
import ProviderLogo from '@/components/ui/ProviderLogo';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import Link from 'next/link';

interface FeaturedProduct {
  name: string;
  provider: string;
  badge: string;
  badgeType: 'best' | 'promoted';
  rating: number;
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
        rating: 4.8,
        features: ['5% cashback on dining', 'No annual fee (1st year)', 'AED 5,000 min salary'],
        href: '/credit-cards',
      },
      {
        name: 'Skywards Infinite',
        provider: 'Emirates NBD',
        badge: 'Best Travel',
        badgeType: 'promoted',
        rating: 4.6,
        features: ['4 Skywards miles/AED', 'Airport lounge access', 'Travel insurance included'],
        href: '/credit-cards',
      },
      {
        name: 'World Elite Card',
        provider: 'Mashreq',
        badge: 'Best Premium',
        badgeType: 'promoted',
        rating: 4.5,
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
        rating: 4.7,
        features: ['From 5.99% flat rate', 'Up to AED 4M', 'Salary transfer not required'],
        href: '/personal-loans',
      },
      {
        name: 'Personal Finance',
        provider: 'Emirates NBD',
        badge: 'Best Overall',
        badgeType: 'promoted',
        rating: 4.5,
        features: ['From 6.49% flat rate', 'Up to AED 3M', 'Quick approval in 30 min'],
        href: '/personal-loans',
      },
      {
        name: 'Quick Cash Loan',
        provider: 'FAB',
        badge: 'Fastest Approval',
        badgeType: 'promoted',
        rating: 4.3,
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
        rating: 4.6,
        features: ['100% Shariah compliant', 'Profit rates from 4.5%', 'No processing fee'],
        href: '/islamic-finance',
      },
      {
        name: 'Islamic Personal Finance',
        provider: 'ADCB Islamic',
        badge: 'Best Rate',
        badgeType: 'promoted',
        rating: 4.4,
        features: ['From 5.25% profit rate', 'Up to AED 3M', 'Salary transfer flexible'],
        href: '/islamic-finance',
      },
      {
        name: 'Etihad Guest Islamic Card',
        provider: 'FAB Islamic',
        badge: "Editor's Pick",
        badgeType: 'promoted',
        rating: 4.3,
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
        rating: 4.5,
        features: ['Agency repair', '24/7 roadside assist', 'From AED 1,800/year'],
        href: '/car-insurance',
      },
      {
        name: 'Motor Shield',
        provider: 'Orient Insurance',
        badge: 'Best Budget',
        badgeType: 'promoted',
        rating: 4.2,
        features: ['Third party + theft', 'Oman extension included', 'From AED 750/year'],
        href: '/car-insurance',
      },
      {
        name: 'Smart Motor',
        provider: 'Salama',
        badge: 'Islamic Option',
        badgeType: 'promoted',
        rating: 4.1,
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
      <div className="flex gap-2 overflow-x-auto pb-2 mb-10 scrollbar-hide">
        {TABS.map((tb, idx) => (
          <button
            key={tb.key}
            onClick={() => setActiveTab(idx)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              idx === activeTab
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
            }`}
          >
            <tb.icon size={16} />
            {tb.label}
          </button>
        ))}
      </div>

      {/* Product cards */}
      <div className="grid sm:grid-cols-3 gap-5">
        {tab.products.map((product, idx) => (
          <div
            key={product.name}
            className={`bg-white rounded-card border p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 ${
              idx === 0 ? 'border-accent/30 ring-1 ring-accent/20' : 'border-surface-200'
            }`}
          >
            {/* Badge + Rating */}
            <div className="flex items-center justify-between mb-4">
              <Badge variant={product.badgeType}>
                {product.badge}
              </Badge>
              <StarRating rating={product.rating} size={12} />
            </div>

            {/* Provider + name */}
            <div className="flex items-center gap-3.5 mb-5">
              <ProviderLogo name={product.provider} size={48} />
              <div>
                <h4 className="font-display text-base font-bold text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-500">{product.provider}</p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2.5 mb-6">
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
              className="text-sm font-bold text-accent hover:text-accent-dark flex items-center gap-1.5 transition-colors"
            >
              View details <ChevronRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      {/* See all */}
      <div className="text-center mt-10">
        <Link
          href={tab.href}
          className="inline-flex items-center gap-2 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 px-6 py-3 rounded-button transition-colors"
        >
          View all {tab.label.toLowerCase()} <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
