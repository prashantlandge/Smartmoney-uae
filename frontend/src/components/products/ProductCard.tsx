import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Check, X, ExternalLink, ArrowRightLeft, ChevronDown, ChevronUp } from 'lucide-react';
import ProviderLogo from '@/components/ui/ProviderLogo';
import Badge from '@/components/ui/Badge';
import StarRating, { generateRating } from '@/components/ui/StarRating';
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

const CATEGORY_COLORS: Record<string, string> = {
  credit_card: 'bg-indigo-500',
  personal_loan: 'bg-teal-500',
  islamic_finance: 'bg-emerald-600',
  car_insurance: 'bg-amber-500',
  health_insurance: 'bg-rose-500',
};

const METRIC_COLORS = [
  'bg-blue-50 text-blue-800',
  'bg-emerald-50 text-emerald-800',
  'bg-amber-50 text-amber-800',
  'bg-purple-50 text-purple-800',
];

interface Props {
  product: Product;
  featureLabels?: Record<string, string>;
}

export default function ProductCard({ product, featureLabels = {} }: Props) {
  const { t } = useTranslation('common');
  const { add, remove, has, isFull } = useCompare();
  const [expanded, setExpanded] = useState(false);
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

  const featureEntries = Object.entries(product.features).filter(
    ([, v]) => v !== null && v !== undefined && v !== '' && typeof v !== 'object'
  );
  const visibleFeatures = featureEntries.slice(0, 4);
  const extraFeatures = featureEntries.slice(4, 12);
  const accentColor = CATEGORY_COLORS[product.product_type] || 'bg-brand-primary';
  const rating = generateRating(product.features);
  const bestFor = product.features.best_for;

  return (
    <div className="bg-white rounded-card border border-surface-200 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
      {/* Category accent strip */}
      <div className={`h-1 ${accentColor}`} />

      <div className="p-6 sm:p-7">
        {/* Top row: editorial badges + rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {product.badge && (
              <Badge variant={product.badge.type as any}>
                {product.badge.label}
              </Badge>
            )}
            {product.is_islamic && (
              <Badge variant="islamic">{t('islamic_compliant')}</Badge>
            )}
            {bestFor && typeof bestFor === 'string' && (
              <span className="text-xs font-medium text-gray-500">
                Best for: <span className="text-gray-700 font-semibold">{bestFor}</span>
              </span>
            )}
          </div>
          <StarRating rating={rating} size={13} />
        </div>

        {/* Provider + Product name */}
        <div className="flex items-center gap-4 mb-5">
          <ProviderLogo name={product.provider_name} logoUrl={product.provider_logo} size={56} />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-bold text-gray-900 leading-snug">
              {product.product_name}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {product.provider_name}
              <span className="mx-1.5 text-surface-300">&middot;</span>
              <span className="text-gray-400">{product.product_type.replace(/_/g, ' ')}</span>
            </p>
          </div>
        </div>

        {/* Key metrics in colored chips */}
        {visibleFeatures.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {visibleFeatures.map(([key, value], idx) => (
              <div
                key={key}
                className={`rounded-xl px-3.5 py-3 ${METRIC_COLORS[idx % METRIC_COLORS.length]}`}
              >
                <div className="text-[11px] font-medium uppercase tracking-wider opacity-70 mb-0.5">
                  {featureLabels[key] || key.replace(/_/g, ' ')}
                </div>
                <div className="text-sm font-bold">
                  {typeof value === 'boolean' ? (
                    value ? <Check size={16} /> : <X size={16} className="opacity-40" />
                  ) : (
                    String(value)
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expandable details accordion */}
        {extraFeatures.length > 0 && (
          <div className="mb-5">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-primary-700 transition-colors"
            >
              {expanded ? 'Hide details' : `View ${extraFeatures.length} more details`}
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {expanded && (
              <div className="mt-3 pt-3 border-t border-surface-100 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {extraFeatures.map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-b-0">
                      <span className="text-sm text-gray-500">
                        {featureLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 text-right">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <Check size={14} /> Yes
                            </span>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )
                        ) : (
                          String(value)
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {product.description && !expanded && (
          <p className="text-sm text-gray-500 line-clamp-1 mb-5 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-surface-100">
          <a
            href={affiliateHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="btn-primary text-sm py-3 px-6 gap-2 justify-center sm:w-auto w-full shadow-glow-accent"
          >
            Apply Now <ExternalLink size={14} />
          </a>
          <Link
            href={`/products/${product.id}`}
            className="btn-secondary text-sm py-3 px-5 justify-center sm:w-auto w-full"
          >
            Full Details
          </Link>
          <button
            onClick={toggleCompare}
            disabled={!isSelected && isFull}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-button text-sm font-medium transition-all border sm:w-auto w-full ${
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
