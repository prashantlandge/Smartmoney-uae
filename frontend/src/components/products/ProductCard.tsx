import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Check, X, ExternalLink, ArrowRightLeft, Award, Percent, Star, Clock } from 'lucide-react';
import ProviderLogo from '@/components/ui/ProviderLogo';
import Badge from '@/components/ui/Badge';
import { trackEvent } from '@/lib/tracker';
import { useCompare } from '@/context/CompareContext';

export interface ProductBadge {
  type: 'best' | 'cashback' | 'promoted' | 'limited' | 'new';
  label: string;
}

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
  badge?: ProductBadge;
}

const BADGE_ICONS: Record<string, typeof Award> = {
  best: Award,
  cashback: Percent,
  promoted: Star,
  limited: Clock,
  new: Star,
};

interface Props {
  product: Product;
  featureLabels?: Record<string, string>;
}

export default function ProductCard({ product, featureLabels = {} }: Props) {
  const { t } = useTranslation('common');
  const { add, remove, has, isFull } = useCompare();
  const isSelected = has(product.id);
  const toggleCompare = () => {
    if (isSelected) remove(product.id);
    else add(product);
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

  const BadgeIcon = product.badge ? BADGE_ICONS[product.badge.type] : null;
  const featureEntries = Object.entries(product.features);
  const visibleFeatures = featureEntries.slice(0, 4);

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 ${
      product.badge?.type === 'best' ? 'border-lime-300 ring-1 ring-lime-200' : 'border-surface-200'
    }`}>
      {/* Main content */}
      <div className="p-6 sm:p-7">
        {/* Top: Logo + Name + Badge row */}
        <div className="flex items-start gap-4 mb-5">
          <ProviderLogo name={product.provider_name} logoUrl={product.provider_logo} size={56} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base leading-snug mb-0.5">
                  {product.product_name}
                </h3>
                <p className="text-sm text-gray-500">{product.provider_name}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                {product.badge && (
                  <Badge
                    variant={product.badge.type as any}
                    icon={BadgeIcon ? <BadgeIcon size={12} /> : undefined}
                  >
                    {product.badge.label}
                  </Badge>
                )}
                {product.is_islamic && (
                  <Badge variant="islamic">{t('islamic_compliant')}</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        {visibleFeatures.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 py-5 border-t border-surface-100">
            {visibleFeatures.map(([key, value]) => (
              <div key={key}>
                <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                  {featureLabels[key] || key.replace(/_/g, ' ')}
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {typeof value === 'boolean' ? (
                    value ? (
                      <Check size={18} className="text-success" />
                    ) : (
                      <X size={18} className="text-gray-300" />
                    )
                  ) : (
                    String(value)
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-5 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-surface-100">
          <a
            href={affiliateHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="btn-primary text-sm py-2.5 px-6 gap-2"
          >
            {t('apply_now')} <ExternalLink size={14} />
          </a>
          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-button text-sm font-medium border border-surface-200 text-gray-600 hover:border-gray-300 hover:bg-surface-50 transition-colors"
          >
            View Details
          </Link>
          <button
            onClick={toggleCompare}
            disabled={!isSelected && isFull}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-button text-sm font-medium transition-colors border ${
              isSelected
                ? 'bg-brand-primary-50 border-brand-primary text-brand-primary'
                : 'border-surface-200 text-gray-500 hover:border-brand-primary hover:text-brand-primary disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {isSelected ? <Check size={15} /> : <ArrowRightLeft size={15} />}
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}
