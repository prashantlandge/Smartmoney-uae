import { useTranslation } from 'next-i18next';
import { Clock, ArrowRight, TrendingUp, Shield, Wallet, PiggyBank } from 'lucide-react';
import Link from 'next/link';

interface Article {
  title: string;
  excerpt: string;
  icon: typeof TrendingUp;
  iconColor: string;
  readTime: string;
  category: string;
  href: string;
}

const ARTICLES: Article[] = [
  {
    title: 'Best Ways to Send Money from UAE to India in 2026',
    excerpt: 'Compare exchange rates, fees, and transfer speeds across Wise, Al Ansari Exchange, and more to find the cheapest option.',
    icon: TrendingUp,
    iconColor: 'from-emerald-400 to-emerald-600',
    readTime: '5 min read',
    category: 'Remittance',
    href: '/',
  },
  {
    title: 'UAE Credit Card Rewards: Maximize Your Cashback',
    excerpt: 'Learn how to stack credit card rewards in the UAE — from grocery cashback to airline miles — and which cards offer the best returns.',
    icon: Wallet,
    iconColor: 'from-indigo-400 to-indigo-600',
    readTime: '4 min read',
    category: 'Credit Cards',
    href: '/credit-cards',
  },
  {
    title: 'Islamic Finance vs Conventional: What UAE Expats Should Know',
    excerpt: 'A practical guide to understanding Shariah-compliant banking products, profit rates vs interest, and how to choose the right option.',
    icon: Shield,
    iconColor: 'from-teal-400 to-teal-600',
    readTime: '6 min read',
    category: 'Islamic Finance',
    href: '/islamic-finance',
  },
  {
    title: 'How to Get the Cheapest Car Insurance in Dubai',
    excerpt: 'Compare comprehensive vs third-party cover, understand no-claims discounts, and use our tips to save up to 30% on your premium.',
    icon: PiggyBank,
    iconColor: 'from-amber-400 to-amber-600',
    readTime: '4 min read',
    category: 'Car Insurance',
    href: '/car-insurance',
  },
];

export default function FinancialTips() {
  const { t } = useTranslation('common');

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {ARTICLES.map((article) => (
        <Link
          key={article.title}
          href={article.href}
          className="group flex gap-4 p-4 bg-white rounded-card border border-surface-200 hover:shadow-elevated hover:border-brand-primary/20 transition-all duration-200"
        >
          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${article.iconColor} flex items-center justify-center shrink-0`}>
            <article.icon size={24} className="text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-caption font-semibold text-brand-primary uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-caption text-gray-400 flex items-center gap-1">
                <Clock size={10} />
                {article.readTime}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-2 mb-1">
              {article.title}
            </h4>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
