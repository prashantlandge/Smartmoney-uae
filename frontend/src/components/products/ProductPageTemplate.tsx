import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import CategoryIllustration from '@/components/ui/CategoryIllustration';
import { SkeletonCard } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { CompareProvider } from '@/context/CompareContext';
import CompareTray from '@/components/products/CompareTray';
import { Package, Search, SlidersHorizontal, ChevronRight, X } from 'lucide-react';

const HERO_COLORS: Record<string, string> = {
  'credit-cards': 'from-indigo-600 to-brand-nav',
  'personal-loans': 'from-teal-600 to-teal-500',
  'islamic-finance': 'from-emerald-700 to-emerald-500',
  'car-insurance': 'from-amber-600 to-amber-500',
  'health-insurance': 'from-rose-600 to-rose-500',
};

const HERO_DESCRIPTIONS: Record<string, string> = {
  'credit-cards': 'Compare cashback, travel, and rewards cards from top UAE banks.',
  'personal-loans': 'Get the best personal loan rates in the UAE from leading banks.',
  'islamic-finance': 'Explore Shariah-compliant financial products and compare profit rates.',
  'car-insurance': 'Protect your vehicle with the best coverage at competitive rates.',
  'health-insurance': 'Find affordable health insurance that meets DHA/HAAD requirements.',
};

const SLUG_TO_KEY: Record<string, string> = {
  'credit-cards': 'credit_cards',
  'personal-loans': 'personal_loans',
  'islamic-finance': 'islamic_finance',
  'car-insurance': 'car_insurance',
  'health-insurance': 'health_insurance',
};

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Recommended' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'provider', label: 'Provider' },
] as const;

type SortBy = typeof SORT_OPTIONS[number]['value'];

interface Props {
  category: string;
  titleKey: string;
  subtitleKey: string;
  heroIcon: string;
  featureLabels?: Record<string, string>;
  calculatorSlot?: ReactNode;
}

export default function ProductPageTemplate({
  category,
  titleKey,
  subtitleKey,
  heroIcon,
  featureLabels = {},
  calculatorSlot,
}: Props) {
  const { t } = useTranslation('common');
  const { products, loading, error } = useProducts(category);
  const [islamicOnly, setIslamicOnly] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('relevance');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const heroGradient = HERO_COLORS[category] || 'from-brand-nav to-brand-nav-dark';
  const categoryKey = SLUG_TO_KEY[category] || category;
  const heroDesc = HERO_DESCRIPTIONS[category] || t(subtitleKey);

  const providerNames = useMemo(
    () => Array.from(new Set(products.map((p) => p.provider_name))).sort(),
    [products]
  );
  const islamicCount = useMemo(
    () => products.filter((p) => p.is_islamic).length,
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (islamicOnly) result = result.filter((p) => p.is_islamic);
    if (selectedProviders.length > 0) result = result.filter((p) => selectedProviders.includes(p.provider_name));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.product_name.toLowerCase().includes(q) || p.provider_name.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'name') result.sort((a, b) => a.product_name.localeCompare(b.product_name));
    else if (sortBy === 'provider') result.sort((a, b) => a.provider_name.localeCompare(b.provider_name));
    return result;
  }, [products, islamicOnly, selectedProviders, searchQuery, sortBy]);

  const activeFilterCount = (islamicOnly ? 1 : 0) + selectedProviders.length;

  const toggleProvider = (name: string) => {
    setSelectedProviders(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const clearFilters = () => {
    setIslamicOnly(false);
    setSelectedProviders([]);
  };

  return (
    <CompareProvider>
      <Layout>
        <Head>
          <title>{t(titleKey)} — SmartMoney UAE</title>
          <meta name="description" content={heroDesc} />
        </Head>

        {/* Colored gradient hero — BankBazaar style */}
        <section className={`bg-gradient-to-r ${heroGradient} text-white`}>
          <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-5 sm:py-7">
            <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-3">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-white font-medium">{t(titleKey)}</span>
            </nav>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-card bg-white/15 flex items-center justify-center shrink-0">
                <CategoryIllustration category={categoryKey} size={24} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">{t(titleKey)}</h1>
                <p className="text-body-sm text-white/80">{heroDesc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky toolbar */}
        <section className="border-b border-surface-200 bg-white sticky top-14 z-20">
          <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
              <p className="text-body-sm text-gray-500 font-medium">
                {loading
                  ? 'Loading...'
                  : filteredProducts.length === products.length
                    ? `${products.length} products`
                    : `${filteredProducts.length} of ${products.length}`}
              </p>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field text-sm py-1.5 ps-8 pe-3 w-40"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="input-field text-sm py-1.5 px-2.5 w-auto"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {islamicCount > 0 && (
                <button
                  onClick={() => setIslamicOnly(!islamicOnly)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-badge text-label font-semibold whitespace-nowrap transition-all ${
                    islamicOnly
                      ? 'bg-emerald-600 text-white'
                      : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                  }`}
                >
                  Islamic Only
                  {islamicOnly && <X size={11} />}
                </button>
              )}
              {providerNames.slice(0, 8).map(name => {
                const active = selectedProviders.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleProvider(name)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-badge text-label font-semibold whitespace-nowrap transition-all ${
                      active
                        ? 'bg-brand-primary text-white'
                        : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                    }`}
                  >
                    {name}
                    {active && <X size={11} />}
                  </button>
                );
              })}
              {providerNames.length > 8 && (
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-badge text-label font-semibold bg-surface-100 text-gray-600 hover:bg-surface-200 whitespace-nowrap"
                >
                  <SlidersHorizontal size={11} />
                  More
                </button>
              )}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-label font-semibold text-brand-primary hover:text-brand-primary-700 whitespace-nowrap"
                >
                  Clear all
                </button>
              )}
            </div>

            {showMobileFilters && (
              <div className="mt-1.5 pt-1.5 border-t border-surface-100 animate-fade-in">
                <div className="flex flex-wrap gap-1.5">
                  {providerNames.slice(8).map(name => {
                    const active = selectedProviders.includes(name);
                    return (
                      <button
                        key={name}
                        onClick={() => toggleProvider(name)}
                        className={`px-2.5 py-1 rounded-badge text-label font-semibold whitespace-nowrap transition-all ${
                          active
                            ? 'bg-brand-primary text-white'
                            : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Products List */}
        <section className="bg-surface-50 min-h-[60vh]">
          <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-5">
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {error && (
              <EmptyState title={t('error_message')} description="Please try again later." />
            )}

            {!loading && products.length === 0 && (
              <EmptyState
                icon={Package}
                title={t('no_products')}
                description="We're adding new products every week."
              />
            )}

            {!loading && products.length > 0 && (
              filteredProducts.length === 0 ? (
                <EmptyState title="No products match your filters" description="Try adjusting or clearing your filters." />
              ) : (
                <div className="space-y-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} featureLabels={featureLabels} />
                  ))}
                </div>
              )
            )}
          </div>
        </section>

        {calculatorSlot && (
          <section className="bg-white border-t border-surface-200">
            <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-6">
              {calculatorSlot}
            </div>
          </section>
        )}

        <CompareTray />
      </Layout>
    </CompareProvider>
  );
}
