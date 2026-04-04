import { useState, useMemo } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { CategoryIcon } from '@/components/ui/Icon';
import CategoryIllustration from '@/components/ui/CategoryIllustration';
import { SkeletonCard } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { CompareProvider } from '@/context/CompareContext';
import CompareTray from '@/components/products/CompareTray';
import ProductFilters, { DEFAULT_FILTERS, type FilterState } from '@/components/products/ProductFilters';
import { Package } from 'lucide-react';

const HERO_GRADIENTS: Record<string, string> = {
  'credit-cards': 'from-indigo-900 to-indigo-600',
  'personal-loans': 'from-cyan-900 to-teal-600',
  'islamic-finance': 'from-emerald-900 to-emerald-600',
  'car-insurance': 'from-amber-900 to-amber-600',
  'health-insurance': 'from-rose-900 to-rose-600',
};

// Map URL slug to category key for icons
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
  const gradient = HERO_GRADIENTS[category] || 'from-brand-dark to-brand-primary';
  const categoryKey = SLUG_TO_KEY[category] || category;

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filters.islamicOnly) result = result.filter((p) => p.is_islamic);
    if (filters.providers.length > 0) result = result.filter((p) => filters.providers.includes(p.provider_name));
    if (filters.sortBy === 'name') result.sort((a, b) => a.product_name.localeCompare(b.product_name));
    else if (filters.sortBy === 'provider') result.sort((a, b) => a.provider_name.localeCompare(b.provider_name));
    return result;
  }, [products, filters]);

  return (
    <CompareProvider>
      <Layout>
        <Head>
          <title>{t(titleKey)} — SmartMoney UAE</title>
          <meta name="description" content={t(subtitleKey)} />
        </Head>

        {/* Hero */}
        <section className={`bg-gradient-to-br ${gradient} text-white py-16 sm:py-20 px-4`}>
          <div className="max-w-content-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
              <CategoryIllustration category={categoryKey} size={64} />
            </div>
            <h1 className="text-display-lg font-bold mb-2">{t(titleKey)}</h1>
            <p className="text-white/80 text-body-lg max-w-xl mx-auto">{t(subtitleKey)}</p>
          </div>
        </section>

        {/* Products */}
        <section className="section-padding">
          <div className="max-w-content-xl mx-auto">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
              <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-6">
                {/* Sidebar filters */}
                <ProductFilters products={products} filters={filters} onChange={setFilters} />

                {/* Product grid */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-body-sm text-gray-500">
                      {filteredProducts.length === products.length
                        ? t('showing_products', { count: products.length })
                        : `Showing ${filteredProducts.length} of ${products.length} products`}
                    </p>
                    <p className="text-xs text-gray-400 hidden sm:block">
                      Select up to 3 products to compare
                    </p>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <EmptyState
                      title="No products match your filters"
                      description="Try adjusting or clearing your filters."
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
