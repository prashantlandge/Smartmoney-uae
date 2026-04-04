import { useTranslation } from 'next-i18next';
import { Check, X } from 'lucide-react';
import ProviderLogo from '@/components/ui/ProviderLogo';
import Badge from '@/components/ui/Badge';
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
    <div className="card-hover group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <ProviderLogo name={product.provider_name} logoUrl={product.provider_logo} size={44} />
          <div>
            <h3 className="font-semibold text-sm text-gray-900 group-hover:text-brand-primary transition-colors">
              {product.product_name}
            </h3>
            <p className="text-xs text-gray-500">{product.provider_name}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {product.is_islamic && (
            <Badge variant="islamic">{t('islamic_compliant')}</Badge>
          )}
        </div>
      </div>

      {product.description && (
        <p className="text-xs text-gray-600 mb-3 leading-relaxed line-clamp-2">{product.description}</p>
      )}

      {/* Features grid */}
      {Object.keys(product.features).length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.entries(product.features).map(([key, value]) => (
            <div key={key} className="bg-surface-50 rounded-badge px-3 py-2 border-s-2 border-surface-200">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                {featureLabels[key] || key.replace(/_/g, ' ')}
              </div>
              <div className="text-sm font-semibold text-gray-800 mt-0.5">
                {typeof value === 'boolean' ? (
                  value ? (
                    <Check size={14} className="text-success" />
                  ) : (
                    <X size={14} className="text-gray-300" />
                  )
                ) : (
                  String(value)
                )}
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
