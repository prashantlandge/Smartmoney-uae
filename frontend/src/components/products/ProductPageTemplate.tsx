import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';

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

  return (
    <Layout>
      <Head>
        <title>{t(titleKey)} — SmartMoney UAE</title>
        <meta name="description" content={t(subtitleKey)} />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-dark to-brand-primary text-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-4xl mb-3 block">{heroIcon}</span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t(titleKey)}</h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto">{t(subtitleKey)}</p>
        </div>
      </section>

      {/* Products */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-12 bg-gray-100 rounded mb-3" />
                  <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="h-12 bg-gray-100 rounded" />
                    <div className="h-12 bg-gray-100 rounded" />
                  </div>
                  <div className="h-9 bg-gray-100 rounded mt-4" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-sm">{t('error_message')}</p>
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('no_products')}</p>
            </div>
          )}

          {products.length > 0 && (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {t('showing_products', { count: products.length })}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    featureLabels={featureLabels}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
