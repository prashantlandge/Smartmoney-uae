import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useProductSearch } from '@/hooks/useProductSearch';
import Link from 'next/link';

const CATEGORY_ICONS: Record<string, string> = {
  credit_card: '💳',
  personal_loan: '🏦',
  islamic_finance: '☪️',
  car_insurance: '🚗',
  health_insurance: '🏥',
  remittance: '💸',
};

const CATEGORY_ROUTES: Record<string, string> = {
  credit_card: '/credit-cards',
  personal_loan: '/personal-loans',
  islamic_finance: '/islamic-finance',
  car_insurance: '/car-insurance',
  health_insurance: '/health-insurance',
  remittance: '/',
};

const QUICK_CATEGORIES = [
  { key: 'credit_cards', label: 'Credit Cards', href: '/credit-cards' },
  { key: 'personal_loans', label: 'Personal Loans', href: '/personal-loans' },
  { key: 'islamic_finance', label: 'Islamic Finance', href: '/islamic-finance' },
  { key: 'car_insurance', label: 'Car Insurance', href: '/car-insurance' },
  { key: 'health_insurance', label: 'Health Insurance', href: '/health-insurance' },
];

interface HeroSearchProps {
  compact?: boolean;
}

export default function HeroSearch({ compact = false }: HeroSearchProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { results, loading } = useProductSearch(query);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Open dropdown when results arrive
  useEffect(() => {
    if (results.length > 0 && query.length >= 2) {
      setIsOpen(true);
      setActiveIndex(-1);
    }
  }, [results, query]);

  const navigateToResult = useCallback(
    (productType: string) => {
      const route = CATEGORY_ROUTES[productType] || '/';
      setIsOpen(false);
      setQuery('');
      router.push(route);
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      navigateToResult(results[activeIndex].product_type);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${compact ? 'max-w-md' : 'max-w-2xl mx-auto'}`}>
      {/* Search Input */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg width={compact ? 16 : 20} height={compact ? 16 : 20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('search_placeholder')}
          className={`w-full bg-white text-gray-900 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-brand-primary outline-none transition-all ${
            compact
              ? 'pl-10 pr-4 py-2.5 text-sm'
              : 'pl-12 pr-6 py-4 text-base sm:text-lg'
          }`}
        />
        {loading && (
          <span className={`absolute top-1/2 -translate-y-1/2 ${compact ? 'right-3' : 'right-5'}`}>
            <span className="block w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          {results.length === 0 && !loading && (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              {t('search_no_results', { query })}
            </div>
          )}

          {results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((product, idx) => (
                <li key={product.id}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      idx === activeIndex ? 'bg-brand-primary/5' : ''
                    }`}
                    onClick={() => navigateToResult(product.product_type)}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <span className="text-xl shrink-0">
                      {CATEGORY_ICONS[product.product_type] || '📄'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {product.product_name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {product.provider_name}
                        {product.is_islamic && (
                          <span className="ml-1.5 text-emerald-600 font-medium">
                            {t('islamic_compliant')}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider shrink-0">
                      {product.product_type.replace(/_/g, ' ')}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Category Quick Links (only for non-compact/hero version) */}
      {!compact && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {QUICK_CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="px-3 py-1.5 text-xs font-medium text-white/80 bg-white/15 rounded-full hover:bg-white/25 transition-colors"
            >
              {t(`categories.${cat.key}`)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
