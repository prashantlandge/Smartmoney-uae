import { useCompare } from '@/context/CompareContext';
import { useTranslation } from 'next-i18next';
import { X, Check, ExternalLink } from 'lucide-react';
import ProviderLogo from '@/components/ui/ProviderLogo';
import Badge from '@/components/ui/Badge';
import { trackEvent } from '@/lib/tracker';
import { useEffect, useMemo } from 'react';

interface Props {
  onClose: () => void;
}

export default function CompareModal({ onClose }: Props) {
  const { t } = useTranslation('common');
  const { items } = useCompare();

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Collect all unique feature keys
  const featureKeys = useMemo(() => {
    const keys = new Set<string>();
    items.forEach((p) => Object.keys(p.features).forEach((k) => keys.add(k)));
    return Array.from(keys);
  }, [items]);

  const formatFeatureLabel = (key: string) =>
    key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const formatValue = (value: string | number | boolean | undefined) => {
    if (value === undefined || value === null) return <span className="text-gray-300">—</span>;
    if (typeof value === 'boolean') {
      return value ? (
        <Check size={16} className="text-success mx-auto" />
      ) : (
        <X size={16} className="text-gray-300 mx-auto" />
      );
    }
    return <span className="font-medium text-gray-800">{String(value)}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-elevated w-full max-w-4xl max-h-[85vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <h2 className="text-heading-md font-bold text-gray-900">Compare Products</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-100 transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[calc(85vh-130px)]">
          <table className="w-full border-collapse">
            {/* Product headers */}
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-surface-200">
                <th className="text-start ps-6 py-4 w-40 text-body-sm font-semibold text-gray-500">
                  Product
                </th>
                {items.map((product) => (
                  <th key={product.id} className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ProviderLogo
                        name={product.provider_name}
                        logoUrl={product.provider_logo}
                        size={40}
                      />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{product.product_name}</div>
                        <div className="text-xs text-gray-500">{product.provider_name}</div>
                      </div>
                      {product.is_islamic && (
                        <Badge variant="islamic">{t('islamic_compliant')}</Badge>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Description row */}
              <tr className="border-b border-surface-100">
                <td className="ps-6 py-3 text-body-sm font-medium text-gray-500">Description</td>
                {items.map((product) => (
                  <td key={product.id} className="px-4 py-3 text-xs text-gray-600 text-center">
                    {product.description || '—'}
                  </td>
                ))}
              </tr>

              {/* Type row */}
              <tr className="border-b border-surface-100 bg-surface-50">
                <td className="ps-6 py-3 text-body-sm font-medium text-gray-500">Type</td>
                {items.map((product) => (
                  <td key={product.id} className="px-4 py-3 text-xs text-gray-700 text-center capitalize">
                    {product.product_type.replace(/_/g, ' ')}
                  </td>
                ))}
              </tr>

              {/* Feature rows */}
              {featureKeys.map((key, idx) => (
                <tr
                  key={key}
                  className={`border-b border-surface-100 ${idx % 2 === 0 ? '' : 'bg-surface-50'}`}
                >
                  <td className="ps-6 py-3 text-body-sm font-medium text-gray-500">
                    {formatFeatureLabel(key)}
                  </td>
                  {items.map((product) => (
                    <td key={product.id} className="px-4 py-3 text-sm text-center">
                      {formatValue(product.features[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with CTAs */}
        <div className="border-t border-surface-200 px-6 py-4 flex justify-center gap-4 bg-surface-50">
          {items.map((product) => {
            let href = product.affiliate_link || '#';
            try {
              const url = new URL(product.affiliate_link || 'https://example.com');
              url.searchParams.set('utm_source', 'smartmoney_uae');
              url.searchParams.set('utm_medium', 'compare');
              href = url.toString();
            } catch {
              // use as-is
            }
            return (
              <a
                key={product.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent('click_compare_apply', {
                    product_name: product.product_name,
                    provider_name: product.provider_name,
                  })
                }
                className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5"
              >
                Apply — {product.provider_name}
                <ExternalLink size={12} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
