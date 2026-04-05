import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Check, X, ExternalLink, ArrowRightLeft, ChevronDown, ChevronUp, Star } from 'lucide-react';
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
  const topFeatures = featureEntries.slice(0, 5);
  const extraFeatures = featureEntries.slice(5, 14);
  const bestFor = product.features.best_for;

  return (
    <div className="bg-white rounded-card border border-surface-200 shadow-sm hover:shadow-card-hover transition-all duration-150 overflow-hidden">
      <div className="p-4 sm:p-5">
        {/* Row 1: Logo + Name + Badge + CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Logo */}
          <ProviderLogo name={product.provider_name} logoUrl={product.provider_logo} size={44} />

          {/* Name + Provider + Badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-brand-dark text-base leading-tight truncate">
                  {product.product_name}
                </h3>
                <p className="text-body-sm text-gray-500 mt-0.5">{product.provider_name}</p>
              </div>
              {/* Desktop CTA */}
              <a
                href={affiliateHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="hidden sm:inline-flex btn-primary text-sm py-2 px-6 shrink-0"
              >
                Apply Now
              </a>
            </div>

            {/* Badges row */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {product.badge && (
                <Badge variant={product.badge.type as any}>
                  {product.badge.label}
                </Badge>
              )}
              {product.is_islamic && (
                <Badge variant="islamic">{t('islamic_compliant')}</Badge>
              )}
              {bestFor && typeof bestFor === 'string' && (
                <span className="text-label text-gray-500">
                  Best for <span className="font-semibold text-brand-dark">{bestFor}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Key features as compact grid */}
        {topFeatures.length > 0 && (
          <div className="mt-4 pt-3 border-t border-surface-100">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-4 gap-y-2">
              {topFeatures.map(([key, value]) => (
                <div key={key}>
                  <div className="text-label text-gray-400 uppercase tracking-wider">
                    {featureLabels[key] || key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-sm font-semibold text-brand-dark mt-0.5">
                    {typeof value === 'boolean' ? (
                      value ? (
                        <Check size={15} className="text-brand-primary" />
                      ) : (
                        <X size={15} className="text-gray-300" />
                      )
                    ) : (
                      String(value)
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Row 3: Expandable details */}
        {extraFeatures.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              {expanded ? 'Hide details' : `+${extraFeatures.length} more details`}
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {expanded && (
              <div className="mt-3 pt-3 border-t border-surface-100 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {extraFeatures.map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-1.5 border-b border-surface-100 last:border-b-0">
                      <span className="text-sm text-gray-500">
                        {featureLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                      <span className="text-sm font-semibold text-brand-dark">
                        {typeof value === 'boolean' ? (
                          value ? <span className="text-brand-primary">Yes</span> : <span className="text-gray-400">No</span>
                        ) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Row 4: Actions */}
        <div className="mt-4 pt-3 border-t border-surface-100 flex items-center gap-2 flex-wrap">
          {/* Mobile CTA */}
          <a
            href={affiliateHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="sm:hidden btn-primary text-sm py-2.5 px-6 w-full justify-center"
          >
            Apply Now <ExternalLink size={14} />
          </a>
          <Link
            href={`/products/${product.id}`}
            className="btn-outline text-sm py-2 px-4"
          >
            View Details
          </Link>
          <button
            onClick={toggleCompare}
            disabled={!isSelected && isFull}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-button text-sm font-medium transition-all border ${
              isSelected
                ? 'bg-brand-primary-50 border-brand-primary text-brand-primary-700'
                : 'border-surface-200 text-gray-500 hover:border-brand-primary hover:text-brand-primary disabled:opacity-40'
            }`}
          >
            {isSelected ? <Check size={14} /> : <ArrowRightLeft size={14} />}
            Compare
          </button>
          {/* Desktop: show description inline */}
          {product.description && !expanded && (
            <p className="hidden sm:block text-body-sm text-gray-400 truncate flex-1 ml-2">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
