import { useTranslation } from 'next-i18next';
import { trackEvent } from '@/lib/tracker';

export interface Product {
  id: string;
  provider_name: string;
  provider_logo: string;
  product_name: string;
  product_type: string;
  description: string;
  features: Record<string, string | number | boolean>;
  affiliate_link: string;
  is_islamic: boolean;
}

interface Props {
  product: Product;
  featureLabels?: Record<string, string>;
}

export default function ProductCard({ product, featureLabels = {} }: Props) {
  const { t } = useTranslation('common');

  const handleClick = () => {
    trackEvent('click_product', {
      product_name: product.product_name,
      provider_name: product.provider_name,
      product_type: product.product_type,
    });
  };

  let affiliateHref = product.affiliate_link || '#';
  try {
    const url = new URL(product.affiliate_link || 'https://example.com');
    url.searchParams.set('utm_source', 'smartmoney_uae');
    url.searchParams.set('utm_medium', product.product_type);
    affiliateHref = url.toString();
  } catch {
    // use as-is
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
              {product.provider_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">{product.product_name}</h3>
              <p className="text-xs text-gray-500">{product.provider_name}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5">
          {product.is_islamic && (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full">
              {t('islamic_compliant')}
            </span>
          )}
        </div>
      </div>

      {product.description && (
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">{product.description}</p>
      )}

      {/* Features grid */}
      {Object.keys(product.features).length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.entries(product.features).map(([key, value]) => (
            <div key={key} className="bg-gray-50 rounded-lg px-3 py-2">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                {featureLabels[key] || key.replace(/_/g, ' ')}
              </div>
              <div className="text-sm font-semibold text-gray-800 mt-0.5">
                {typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value)}
              </div>
            </div>
          ))}
        </div>
      )}

      <a
        href={affiliateHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="btn-primary w-full text-center text-xs py-2.5"
      >
        {t('apply_now')}
      </a>
    </div>
  );
}
