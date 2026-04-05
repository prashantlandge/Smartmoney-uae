import { useCompare } from '@/context/CompareContext';
import { useTranslation } from 'next-i18next';
import { X, Check, ExternalLink, Trophy } from 'lucide-react';
import ProviderLogo from '@/components/ui/ProviderLogo';
import Badge from '@/components/ui/Badge';
import { trackEvent } from '@/lib/tracker';
import { useEffect, useMemo } from 'react';

interface Props {
  onClose: () => void;
}

// Features where lower is better (rates, fees, minimums)
const LOWER_IS_BETTER = [
  'annual_fee', 'interest_rate', 'processing_fee', 'min_salary',
  'min_income', 'premium', 'deductible', 'fee', 'charges',
  'interest_rate_min', 'interest_rate_max', 'processing_fee_percent',
  'min_credit_score',
];

// Features where higher is better (cashback, rewards, limits)
const HIGHER_IS_BETTER = [
  'cashback', 'reward_rate', 'credit_limit', 'max_loan_amount',
  'loan_amount', 'coverage', 'max_tenure', 'lounge_access',
  'welcome_bonus', 'rating', 'max_loan', 'tenure',
];

function parseNumeric(value: string | number | boolean | undefined): number | null {
  if (value === undefined || value === null || typeof value === 'boolean') return null;
  if (typeof value === 'number') return value;
  // Extract first number from string like "8.5% - 9.85%" or "AED 5,000" or "5%"
  const cleaned = String(value).replace(/[,%]/g, '').replace(/AED\s*/i, '').trim();
  const match = cleaned.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

function findBestIndex(
  values: (string | number | boolean | undefined)[],
  key: string
): number | null {
  const nums = values.map(parseNumeric);
  const validIndices = nums
    .map((n, i) => (n !== null ? i : -1))
    .filter((i) => i !== -1);

  if (validIndices.length < 2) return null;

  // Check if all values are the same
  const uniqueNums = new Set(validIndices.map((i) => nums[i]));
  if (uniqueNums.size <= 1) return null;

  const lowerKey = key.toLowerCase();

  // Determine direction
  let lowerBetter = false;
  let higherBetter = false;

  for (const k of LOWER_IS_BETTER) {
    if (lowerKey.includes(k) || k.includes(lowerKey)) { lowerBetter = true; break; }
  }
  if (!lowerBetter) {
    for (const k of HIGHER_IS_BETTER) {
      if (lowerKey.includes(k) || k.includes(lowerKey)) { higherBetter = true; break; }
    }
  }

  // Heuristic: keys with "fee", "rate", "min", "premium" → lower is better
  if (!lowerBetter && !higherBetter) {
    if (/fee|rate|premium|charge|min_/i.test(lowerKey)) lowerBetter = true;
    else if (/max|cashback|reward|bonus|limit|coverage|tenure/i.test(lowerKey)) higherBetter = true;
  }

  if (!lowerBetter && !higherBetter) return null;

  let bestIdx = validIndices[0];
  let bestVal = nums[bestIdx]!;

  for (const i of validIndices.slice(1)) {
    const v = nums[i]!;
    if (lowerBetter && v < bestVal) { bestVal = v; bestIdx = i; }
    if (higherBetter && v > bestVal) { bestVal = v; bestIdx = i; }
  }

  return bestIdx;
}

export default function CompareModal({ onClose }: Props) {
  const { t } = useTranslation('common');
  const { items } = useCompare();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

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
        <Check size={16} className="text-brand-primary mx-auto" />
      ) : (
        <X size={16} className="text-gray-300 mx-auto" />
      );
    }
    return String(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 sm:pt-12 px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-elevated w-full max-w-5xl max-h-[88vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <div>
            <h2 className="text-heading-md font-bold text-gray-900">Compare Products</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              <Trophy size={11} className="inline text-brand-primary" /> highlights the better value in each row
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-100 transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[calc(88vh-140px)]">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-surface-200">
                <th className="text-start ps-6 py-5 w-44 text-xs font-semibold text-brand-primary uppercase tracking-wider">
                  Feature
                </th>
                {items.map((product) => (
                  <th key={product.id} className="py-5 px-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ProviderLogo
                        name={product.provider_name}
                        logoUrl={product.provider_logo}
                        size={40}
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">{product.product_name}</div>
                        <div className="text-xs text-gray-400">{product.provider_name}</div>
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
              {featureKeys.map((key, idx) => {
                const values = items.map((p) => p.features[key]);
                const bestIdx = findBestIndex(values, key);

                return (
                  <tr key={key} className={`border-b border-surface-100 ${idx % 2 !== 0 ? 'bg-surface-50/50' : ''}`}>
                    <td className="ps-6 py-3.5 text-sm font-medium text-gray-600">
                      {formatFeatureLabel(key)}
                    </td>
                    {items.map((product, colIdx) => {
                      const val = product.features[key];
                      const isBest = bestIdx === colIdx;
                      const formatted = formatValue(val);

                      return (
                        <td
                          key={product.id}
                          className={`px-4 py-3.5 text-sm text-center transition-colors ${
                            isBest ? 'bg-emerald-50' : ''
                          }`}
                        >
                          {isBest ? (
                            <span className="inline-flex items-center justify-center gap-1.5 font-bold text-brand-primary">
                              <Trophy size={13} className="shrink-0" />
                              {formatted}
                            </span>
                          ) : (
                            <span className="text-gray-700">{formatted}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Description row */}
              {items.some((p) => p.description) && (
                <tr className="border-b border-surface-100">
                  <td className="ps-6 py-3.5 text-sm font-medium text-gray-600">Description</td>
                  {items.map((product) => (
                    <td key={product.id} className="px-4 py-3.5 text-xs text-gray-500 text-center leading-relaxed">
                      {product.description || '—'}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with CTAs */}
        <div className="border-t border-surface-200 px-6 py-4 bg-white">
          <div className="flex justify-center gap-4">
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
                  className="btn-primary text-xs py-2.5 px-6 flex items-center gap-1.5"
                >
                  Apply Now <ExternalLink size={12} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
