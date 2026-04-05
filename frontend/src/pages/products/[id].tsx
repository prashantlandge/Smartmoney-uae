import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProviderLogo from '@/components/ui/ProviderLogo';
import Badge from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { trackEvent } from '@/lib/tracker';
import type { Product } from '@/components/products/ProductCard';
import {
  Check, X, ExternalLink, ArrowLeft, Shield, Star, Lightbulb,
  ChevronRight, AlertCircle, Clock,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

const CATEGORY_LABELS: Record<string, string> = {
  credit_card: 'Credit Cards',
  personal_loan: 'Personal Loans',
  islamic_finance: 'Islamic Finance',
  car_insurance: 'Car Insurance',
  health_insurance: 'Health Insurance',
  remittance: 'Remittance',
};

const CATEGORY_ROUTES: Record<string, string> = {
  credit_card: '/credit-cards',
  personal_loan: '/personal-loans',
  islamic_finance: '/islamic-finance',
  car_insurance: '/car-insurance',
  health_insurance: '/health-insurance',
  remittance: '/',
};

export default function ProductDetailPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { id } = router.query;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}/api/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Product not found`);
        return r.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleApply = () => {
    if (!product) return;
    trackEvent('click_product_apply', {
      product_name: product.product_name,
      provider_name: product.provider_name,
      product_type: product.product_type,
    });
  };

  let affiliateHref = '#';
  if (product?.affiliate_link) {
    try {
      const url = new URL(product.affiliate_link);
      url.searchParams.set('utm_source', 'smartmoney_uae');
      url.searchParams.set('utm_medium', 'product_detail');
      affiliateHref = url.toString();
    } catch {
      affiliateHref = product.affiliate_link;
    }
  }

  const categoryLabel = product ? CATEGORY_LABELS[product.product_type] || product.product_type : '';
  const categoryRoute = product ? CATEGORY_ROUTES[product.product_type] || '/' : '/';

  const featureEntries = product ? Object.entries(product.features) : [];
  const keyFeatures = featureEntries.filter(([_, v]) => typeof v !== 'boolean');
  const boolFeatures = featureEntries.filter(([_, v]) => typeof v === 'boolean');

  const formatLabel = (key: string) =>
    key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Layout>
      <Head>
        <title>
          {product ? `${product.product_name} — ${product.provider_name}` : 'Product Details'} | SmartMoney UAE
        </title>
        {product && <meta name="description" content={product.description} />}
      </Head>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          {product && (
            <>
              <Link href={categoryRoute} className="hover:text-brand-primary transition-colors">
                {categoryLabel}
              </Link>
              <ChevronRight size={12} />
              <span className="text-gray-900 font-medium truncate">{product.product_name}</span>
            </>
          )}
        </div>
      </div>

      {loading && (
        <div className="max-w-content-lg mx-auto px-4 sm:px-6 py-10">
          <SkeletonCard />
        </div>
      )}

      {error && (
        <div className="max-w-content-lg mx-auto px-4 sm:px-6 py-16">
          <EmptyState
            icon={AlertCircle}
            title="Product not found"
            description="This product may have been removed or the link is incorrect."
          />
          <div className="text-center mt-6">
            <Link href="/" className="btn-primary">
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
        </div>
      )}

      {product && (
        <div className="bg-surface-50 min-h-[60vh]">
          <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-8">
            <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">

              {/* Main content */}
              <div className="space-y-6">
                {/* Product header card */}
                <div className="bg-white rounded-card border border-surface-200 p-6">
                  <div className="flex items-start gap-4">
                    <ProviderLogo name={product.provider_name} logoUrl={product.provider_logo} size={64} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {product.is_islamic && (
                          <Badge variant="islamic">{t('islamic_compliant')}</Badge>
                        )}
                        {product.badge && (
                          <Badge variant={product.badge.type as any}>{product.badge.label}</Badge>
                        )}
                      </div>
                      <h1 className="text-heading-lg font-bold text-gray-900">{product.product_name}</h1>
                      <p className="text-body-sm text-gray-500 mt-0.5">{product.provider_name}</p>
                    </div>
                  </div>

                  {product.description && (
                    <div className="mt-5 flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <Lightbulb size={18} className="text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-0.5">What this means for you</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Key features table */}
                {keyFeatures.length > 0 && (
                  <div className="bg-white rounded-card border border-surface-200">
                    <div className="px-6 py-4 border-b border-surface-100">
                      <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Star size={16} className="text-brand-primary" />
                        Key Features
                      </h2>
                    </div>
                    <div className="divide-y divide-surface-100">
                      {keyFeatures.map(([key, value], idx) => (
                        <div
                          key={key}
                          className={`px-6 py-3.5 flex items-center justify-between ${idx % 2 !== 0 ? 'bg-surface-50/50' : ''}`}
                        >
                          <span className="text-sm text-gray-600">{formatLabel(key)}</span>
                          <span className="text-sm font-semibold text-gray-900">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Boolean features / eligibility */}
                {boolFeatures.length > 0 && (
                  <div className="bg-white rounded-card border border-surface-200">
                    <div className="px-6 py-4 border-b border-surface-100">
                      <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Shield size={16} className="text-brand-primary" />
                        Features & Eligibility
                      </h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-3">
                      {boolFeatures.map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2.5">
                          {value ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Check size={12} className="text-emerald-600" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                              <X size={12} className="text-gray-400" />
                            </div>
                          )}
                          <span className={`text-sm ${value ? 'text-gray-700' : 'text-gray-400'}`}>
                            {formatLabel(key)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="flex items-start gap-2 text-xs text-gray-400 px-1">
                  <Clock size={12} className="shrink-0 mt-0.5" />
                  <p>
                    Information is for general guidance only. Rates and terms may change.
                    Please verify details on the provider's official website before applying.
                  </p>
                </div>
              </div>

              {/* Sidebar — Apply CTA + provider info */}
              <div className="mt-6 lg:mt-0">
                <div className="sticky top-20 space-y-4">
                  {/* Apply card */}
                  <div className="bg-white rounded-card border border-surface-200 p-5">
                    <a
                      href={affiliateHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleApply}
                      className="btn-primary w-full justify-center text-sm py-3 gap-2 shadow-glow-primary"
                    >
                      Apply Now <ExternalLink size={14} />
                    </a>
                    <p className="text-caption text-gray-400 text-center mt-2">
                      You'll be redirected to {product.provider_name}
                    </p>
                  </div>

                  {/* Provider info */}
                  <div className="bg-white rounded-card border border-surface-200 p-5">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">About the Provider</h3>
                    <div className="flex items-center gap-3">
                      <ProviderLogo name={product.provider_name} logoUrl={product.provider_logo} size={40} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{product.provider_name}</p>
                        <p className="text-xs text-gray-500">Licensed in UAE</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick links */}
                  <div className="bg-white rounded-card border border-surface-200 p-5">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Related</h3>
                    <div className="space-y-2">
                      <Link
                        href={categoryRoute}
                        className="flex items-center gap-2 text-sm text-brand-primary hover:text-brand-primary-700 font-medium transition-colors"
                      >
                        <ArrowLeft size={14} />
                        All {categoryLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
