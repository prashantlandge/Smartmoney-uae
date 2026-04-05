import { useState, useMemo } from 'react';
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
  'credit-cards': 'from-indigo-900 to-indigo-600',
  'personal-loans': 'from-cyan-900 to-teal-600',
  'islamic-finance': 'from-emerald-900 to-emerald-600',
  'car-insurance': 'from-amber-900 to-amber-600',
  'health-insurance': 'from-rose-900 to-rose-600',
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
}

export default function ProductPageTemplate({
  category,
  titleKey,
  subtitleKey,
  heroIcon,
  featureLabels = {},
}: Props) {
  const { t } = useTranslation('common');
  const { products, loading, error } = useProducts(category);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const gradient = HERO_GRADIENTS[category] || 'from-brand-dark to-brand-primary';
  const categoryKey = SLUG_TO_KEY[category] || category;

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
          <meta name="description" content={t(subtitleKey)} />
        </Head>

        {/* Compact Hero */}
        <section className={`bg-gradient-to-r ${gradient} text-white`}>
          <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                <CategoryIllustration category={categoryKey} size={40} />
              </div>
              <div>
                <h1 className="text-heading-lg sm:text-display-sm font-bold">{t(titleKey)}</h1>
                <p className="text-white/70 text-body-sm mt-0.5">{t(subtitleKey)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar: count + search + sort */}
        <section className="border-b border-surface-200 bg-white">
          <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-body-sm text-gray-500">
              {loading
                ? 'Loading...'
                : filteredProducts.length === products.length
                  ? `Showing ${products.length} ${category.replace('-', ' ')}`
                  : `Showing ${filteredProducts.length} of ${products.length} ${category.replace('-', ' ')}`}
            </p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${category.replace('-', ' ')}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field text-xs py-2 ps-8 pe-3 w-48"
                />
              </div>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
                className="input-field text-xs py-2 px-3"
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
          <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-6">
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
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
              <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-6">
                {/* Sidebar filters */}
                <ProductFilters products={products} filters={filters} onChange={setFilters} />

                {/* Product list - single column */}
                <div>
                  {filteredProducts.length === 0 ? (
                    <EmptyState
                      title="No products match your filters"
                      description="Try adjusting or clearing your filters."
                    />
                  ) : (
                    <div className="space-y-4">
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

        <CompareTray />
      </Layout>
    </CompareProvider>
  );
}
