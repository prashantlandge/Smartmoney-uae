import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import CategoryIllustration from '@/components/ui/CategoryIllustration';
import { SkeletonCard } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { CompareProvider } from '@/context/CompareContext';
import CompareTray from '@/components/products/CompareTray';
import ProductFilters, { DEFAULT_FILTERS, type FilterState } from '@/components/products/ProductFilters';
import { Package, Search } from 'lucide-react';

const HERO_GRADIENTS: Record<string, string> = {
  'credit-cards': 'from-indigo-900 via-indigo-800 to-indigo-600',
  'personal-loans': 'from-cyan-900 via-cyan-800 to-teal-600',
  'islamic-finance': 'from-emerald-900 via-emerald-800 to-emerald-600',
  'car-insurance': 'from-amber-900 via-amber-800 to-amber-600',
  'health-insurance': 'from-rose-900 via-rose-800 to-rose-600',
};

const HERO_DESCRIPTIONS: Record<string, string> = {
  'credit-cards': 'Find the perfect credit card for your lifestyle. Compare cashback, travel, and rewards cards from top UAE banks.',
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
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const gradient = HERO_GRADIENTS[category] || 'from-brand-dark to-brand-primary';
  const categoryKey = SLUG_TO_KEY[category] || category;
  const heroDesc = HERO_DESCRIPTIONS[category] || t(subtitleKey);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filters.islamicOnly) result = result.filter((p) => p.is_islamic);
    if (filters.providers.length > 0) result = result.filter((p) => filters.providers.includes(p.provider_name));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.product_name.toLowerCase().includes(q) || p.provider_name.toLowerCase().includes(q)
      );
    }
    if (filters.sortBy === 'name') result.sort((a, b) => a.product_name.localeCompare(b.product_name));
    else if (filters.sortBy === 'provider') result.sort((a, b) => a.provider_name.localeCompare(b.provider_name));
    return result;
  }, [products, filters, searchQuery]);

  return (
    <CompareProvider>
      <Layout>
        <Head>
          <title>{t(titleKey)} — SmartMoney UAE</title>
          <meta name="description" content={heroDesc} />
        </Head>

        {/* Hero */}
        <section className={`bg-gradient-to-br ${gradient} text-white relative overflow-hidden`}>
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
          <div className="relative max-w-content-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                <CategoryIllustration category={categoryKey} size={44} />
              </div>
              <div className="max-w-xl">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t(titleKey)}</h1>
                <p className="text-white/70 text-base leading-relaxed">{heroDesc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar: count + search + sort */}
        <section className="border-b border-surface-200 bg-white sticky top-16 z-20">
          <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-gray-500 font-medium">
              {loading
                ? 'Loading products...'
                : filteredProducts.length === products.length
                  ? `${products.length} ${category.replace('-', ' ')} available`
                  : `Showing ${filteredProducts.length} of ${products.length}`}
            </p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${category.replace('-', ' ')}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field text-sm py-2.5 ps-9 pe-4 w-56"
                />
              </div>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
                className="input-field text-sm py-2.5 px-3"
              >
                <option value="relevance">Most Popular</option>
                <option value="name">Name</option>
                <option value="provider">Provider</option>
              </select>
            </div>
          </div>
        </section>

        {/* Products List */}
        <section className="bg-surface-50 min-h-[60vh]">
          <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-8">
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

            {products.length > 0 && (
              <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
                {/* Sidebar filters */}
                <ProductFilters products={products} filters={filters} onChange={setFilters} />

                {/* Product list */}
                <div>
                  {filteredProducts.length === 0 ? (
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
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {calculatorSlot && (
          <section className="bg-white border-t border-surface-200">
            <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-10 space-y-8">
              {calculatorSlot}
            </div>
          </section>
        )}

        <CompareTray />
      </Layout>
    </CompareProvider>
  );
}
