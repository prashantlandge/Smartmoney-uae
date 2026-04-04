import { useTranslation } from 'next-i18next';
import { Check, X, ArrowRightLeft } from 'lucide-react';
import ProviderLogo from '@/components/ui/ProviderLogo';
import Badge from '@/components/ui/Badge';
import { trackEvent } from '@/lib/tracker';
import { useCompare } from '@/context/CompareContext';

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
  const { add, remove, has, isFull } = useCompare();
  const isSelected = has(product.id);

  const toggleCompare = () => {
    if (isSelected) {
      remove(product.id);
    } else {
      add(product);
    }
  };

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
              <div className="text-caption text-gray-500 uppercase tracking-wider">
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

      <div className="flex gap-2">
        <button
          onClick={toggleCompare}
          disabled={!isSelected && isFull}
          className={`flex items-center justify-center gap-1.5 px-3 py-3 rounded-button text-xs font-medium transition-colors border ${
            isSelected
              ? 'bg-brand-primary-50 border-brand-primary text-brand-primary'
              : 'border-surface-200 text-gray-500 hover:border-brand-primary hover:text-brand-primary disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          {isSelected ? <Check size={14} /> : <ArrowRightLeft size={14} />}
        </button>
        <a
          href={affiliateHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="btn-primary flex-1 text-center text-body-sm py-3"
        >
          {t('apply_now')}
        </a>
      </div>
    </div>
  );
}
