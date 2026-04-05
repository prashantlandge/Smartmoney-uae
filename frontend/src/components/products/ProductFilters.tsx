import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { Product } from './ProductCard';

export interface FilterState {
  islamicOnly: boolean;
  providers: string[];
  sortBy: 'relevance' | 'name' | 'provider';
}

const DEFAULT_FILTERS: FilterState = {
  islamicOnly: false,
  providers: [],
  sortBy: 'relevance',
};

interface Props {
  products: Product[];
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

export { DEFAULT_FILTERS };

export default function ProductFilters({ products, filters, onChange }: Props) {
  const { t } = useTranslation('common');
  const [showMobile, setShowMobile] = useState(false);

  // Extract unique providers from products
  const providerNames = Array.from(new Set(products.map((p) => p.provider_name))).sort();
  const islamicCount = products.filter((p) => p.is_islamic).length;

  const toggleProvider = (name: string) => {
    const next = filters.providers.includes(name)
      ? filters.providers.filter((n) => n !== name)
      : [...filters.providers, name];
    onChange({ ...filters, providers: next });
  };

  const activeCount =
    (filters.islamicOnly ? 1 : 0) +
    filters.providers.length;

  const clearAll = () => onChange({ ...DEFAULT_FILTERS, sortBy: filters.sortBy });

  const filterContent = (
    <div className="space-y-5">
      {/* Islamic filter */}
      {islamicCount > 0 && (
        <div>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.islamicOnly}
              onChange={(e) => onChange({ ...filters, islamicOnly: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              {t('islamic_compliant')} only
            </span>
            <span className="text-caption text-gray-400">({islamicCount})</span>
          </label>
        </div>
      )}

      {/* Provider filter */}
      {providerNames.length > 1 && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Provider
          </label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {providerNames.map((name) => {
              const count = products.filter((p) => p.provider_name === name).length;
              return (
                <label key={name} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.providers.includes(name)}
                    onChange={() => toggleProvider(name)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex-1 truncate">
                    {name}
                  </span>
                  <span className="text-caption text-gray-400">({count})</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Clear */}
      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="text-xs text-brand-primary hover:text-brand-primary-700 font-medium transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobile(!showMobile)}
          className="flex items-center gap-2 px-4 py-2.5 border border-surface-200 rounded-button text-sm font-medium text-gray-700 hover:bg-surface-50 transition-colors w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} />
            Filters & Sort
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-caption flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          {showMobile ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showMobile && (
          <div className="mt-2 p-4 bg-white rounded-card border border-surface-200 shadow-card animate-fade-in">
            {filterContent}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24 bg-white rounded-card border border-surface-200 shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal size={16} />
              Filters
            </h3>
            {activeCount > 0 && (
              <span className="text-caption text-brand-primary font-medium">
                {activeCount} active
              </span>
            )}
          </div>
          {filterContent}
        </div>
      </div>
    </>
  );
}
