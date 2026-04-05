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

const HERO_ACCENTS: Record<string, string> = {
  'credit-cards': 'from-indigo-500 to-indigo-600',
  'personal-loans': 'from-teal-500 to-teal-600',
  'islamic-finance': 'from-emerald-500 to-emerald-600',
  'car-insurance': 'from-amber-500 to-amber-600',
  'health-insurance': 'from-rose-500 to-rose-600',
};

const HERO_DESCRIPTIONS: Record<string, string> = {
  'credit-cards': 'Compare cashback, travel, and rewards cards from top UAE banks. Find the perfect credit card for your lifestyle.',
  'personal-loans': 'Get the best personal loan rates in the UAE. Compare offers from leading banks and find the lowest interest rates.',
  'islamic-finance': 'Explore Shariah-compliant financial products. Compare profit rates and find the right Islamic finance solution.',
  'car-insurance': 'Protect your vehicle with the best coverage at competitive rates. Compare comprehensive and third-party plans.',
  'health-insurance': 'Find affordable health insurance that meets DHA/HAAD requirements. Compare plans from top insurers.',
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
  const accent = HERO_ACCENTS[category] || 'from-brand-primary to-brand-primary-600';
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

        {/* Clean white hero with accent line */}
        <section className="bg-white border-b border-surface-200">
          {/* Thin gradient accent */}
          <div className={`h-1 bg-gradient-to-r ${accent}`} />

          <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
              <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-gray-900 font-medium">{t(titleKey)}</span>
            </nav>

            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center shrink-0">
                <CategoryIllustration category={categoryKey} size={36} />
              </div>
              <div className="max-w-2xl">
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                  {t(titleKey)}
                </h1>
                <p className="text-base text-gray-500 leading-relaxed">{heroDesc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky toolbar: search + sort + filter pills */}
        <section className="border-b border-surface-200 bg-white sticky top-16 z-20">
          <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-3">
            {/* Top row: count + search + sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <p className="text-sm text-gray-500 font-medium">
                {loading
                  ? 'Loading products...'
                  : filteredProducts.length === products.length
                    ? `${products.length} ${category.replace(/-/g, ' ')} available`
                    : `Showing ${filteredProducts.length} of ${products.length}`}
              </p>
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field text-sm py-2 ps-9 pe-3 w-48"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="input-field text-sm py-2 px-3 w-auto"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter pills row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {/* Islamic toggle */}
              {islamicCount > 0 && (
                <button
                  onClick={() => setIslamicOnly(!islamicOnly)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    islamicOnly
                      ? 'bg-emerald-600 text-white'
                      : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                  }`}
                >
                  Islamic Only
                  {islamicOnly && <X size={14} />}
                </button>
              )}

              {/* Provider pills */}
              {providerNames.slice(0, 8).map(name => {
                const active = selectedProviders.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleProvider(name)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      active
                        ? 'bg-brand-primary text-white'
                        : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                    }`}
                  >
                    {name}
                    {active && <X size={14} />}
                  </button>
                );
              })}

              {/* More filters (mobile) */}
              {providerNames.length > 8 && (
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium bg-surface-100 text-gray-600 hover:bg-surface-200 whitespace-nowrap transition-all"
                >
                  <SlidersHorizontal size={14} />
                  More
                </button>
              )}

              {/* Clear all */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-brand-primary hover:text-brand-primary-700 whitespace-nowrap transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Expanded mobile filter panel */}
            {showMobileFilters && (
              <div className="mt-3 pt-3 border-t border-surface-100 animate-fade-in">
                <div className="flex flex-wrap gap-2">
                  {providerNames.slice(8).map(name => {
                    const active = selectedProviders.includes(name);
                    return (
                      <button
                        key={name}
                        onClick={() => toggleProvider(name)}
                        className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
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

        {/* Products List — full width (no sidebar) */}
        <section className="bg-surface-50 min-h-[60vh]">
          <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {loading && (
              <div className="space-y-5">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {error && (
              <EmptyState
                title={t('error_message')}
                description="Please try again later."
              />
            )}

            {!loading && products.length === 0 && (
              <EmptyState
                icon={Package}
                title={t('no_products')}
                description="We're adding new products every week. Check back soon!"
              />
            )}

            {!loading && products.length > 0 && (
              filteredProducts.length === 0 ? (
                <EmptyState
                  title="No products match your filters"
                  description="Try adjusting or clearing your filters."
                />
              ) : (
                <div className="space-y-5">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      featureLabels={featureLabels}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </section>

        {calculatorSlot && (
          <section className="bg-white border-t border-surface-200">
            <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-12 space-y-8">
              {calculatorSlot}
            </div>
          </section>
        )}

        <CompareTray />
      </Layout>
    </CompareProvider>
  );
}
