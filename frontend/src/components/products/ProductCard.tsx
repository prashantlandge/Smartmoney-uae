import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Check, X, ChevronDown, ChevronUp, ExternalLink, Lightbulb, ArrowRightLeft, Award, Percent, Star, Clock } from 'lucide-react';
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
  const [expanded, setExpanded] = useState(false);

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
  const extraFeatures = featureEntries.slice(4);

  return (
    <div className={`bg-white rounded-card border transition-all duration-200 hover:shadow-elevated ${
      product.badge?.type === 'best' ? 'border-lime-300 ring-1 ring-lime-200' : 'border-surface-200'
    }`}>
      {/* Main row: Logo + Info | Features | Actions */}
      <div className="p-5 flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">

        {/* Left: Logo + Name + Provider + Badge */}
        <div className="flex items-start gap-3 lg:w-[220px] lg:shrink-0">
          <ProviderLogo name={product.provider_name} logoUrl={product.provider_logo} size={48} />
          <div className="min-w-0">
            {product.badge && (
              <div className="mb-1.5">
                <Badge
                  variant={product.badge.type as any}
                  icon={BadgeIcon ? <BadgeIcon size={11} /> : undefined}
                >
                  {product.badge.label}
                </Badge>
              </div>
            )}
            <h3 className="font-semibold text-gray-900 text-sm leading-snug">
              {product.product_name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{product.provider_name}</p>
            <div className="flex gap-1.5 mt-1.5">
              {product.is_islamic && (
                <Badge variant="islamic">{t('islamic_compliant')}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Middle: Feature columns */}
        {visibleFeatures.length > 0 && (
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 border-t lg:border-t-0 lg:border-s border-surface-100 pt-3 lg:pt-0 lg:ps-6">
            {visibleFeatures.map(([key, value]) => (
              <div key={key}>
                <div className="text-caption text-gray-400 uppercase tracking-wider mb-0.5">
                  {featureLabels[key] || key.replace(/_/g, ' ')}
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {typeof value === 'boolean' ? (
                    value ? (
                      <Check size={16} className="text-success" />
                    ) : (
                      <X size={16} className="text-gray-300" />
                    )
                  ) : (
                    String(value)
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Right: Action buttons */}
        <div className="flex flex-row lg:flex-col gap-2 lg:w-[150px] lg:shrink-0 border-t lg:border-t-0 lg:border-s border-surface-100 pt-3 lg:pt-0 lg:ps-5">
          <a
            href={affiliateHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="btn-primary text-xs py-2.5 px-4 flex-1 lg:w-full justify-center gap-1.5"
          >
            {t('apply_now')} <ExternalLink size={12} />
          </a>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-button text-xs font-medium border border-surface-200 text-gray-600 hover:border-gray-300 hover:bg-surface-50 transition-colors flex-1 lg:w-full"
          >
            {expanded ? 'Less' : 'Details'}
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          <button
            onClick={toggleCompare}
            disabled={!isSelected && isFull}
            className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-button text-xs font-medium transition-colors border flex-1 lg:w-full ${
              isSelected
                ? 'bg-brand-primary-50 border-brand-primary text-brand-primary'
                : 'border-surface-200 text-gray-500 hover:border-brand-primary hover:text-brand-primary disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {isSelected ? <Check size={14} /> : <ArrowRightLeft size={14} />}
            Compare
          </button>
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="border-t border-surface-100 px-5 py-4 bg-surface-50/50 animate-fade-in">
          {/* Description */}
          {product.description && (
            <div className="flex items-start gap-2 mb-3">
              <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-gray-700">What this means for you: </span>
                <span className="text-xs text-gray-600 leading-relaxed">{product.description}</span>
              </div>
            </div>
          )}

          {/* Extra features as pills */}
          {extraFeatures.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {extraFeatures.map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-surface-200 rounded-button text-xs text-gray-700 font-medium"
                >
                  {featureLabels[key] || key.replace(/_/g, ' ')}:{' '}
                  <span className="text-gray-900 font-semibold">
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
