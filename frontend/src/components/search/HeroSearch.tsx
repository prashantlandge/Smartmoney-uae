import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useProductSearch } from '@/hooks/useProductSearch';
import Link from 'next/link';
import { CategoryIcon } from '@/components/ui/Icon';
import { Search } from 'lucide-react';
import Badge from '@/components/ui/Badge';

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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
          <Search size={compact ? 16 : 20} />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('search_placeholder')}
          className={`w-full bg-white/90 backdrop-blur-sm text-gray-900 border-0 shadow-elevated focus:ring-2 focus:ring-brand-primary/40 outline-none transition-all ${
            compact
              ? 'rounded-button pl-10 pr-4 py-2.5 text-sm'
              : 'rounded-2xl pl-12 pr-6 py-4 text-base sm:text-lg'
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
        <div className="absolute z-50 top-full mt-2 w-full bg-white rounded-card shadow-elevated border border-gray-100/50 overflow-hidden animate-scale-in">
          {results.length === 0 && !loading && (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              {t('search_no_results', { query })}
            </div>
          )}

          {results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {results.map((product, idx) => (
                <li key={product.id}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      idx === activeIndex ? 'bg-brand-primary-50' : 'hover:bg-surface-50'
                    }`}
                    onClick={() => navigateToResult(product.product_type)}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <CategoryIcon category={product.product_type} size={20} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {product.product_name}
                      </div>
                      <div className="text-xs text-gray-500 truncate flex items-center gap-1.5">
                        {product.provider_name}
                        {product.is_islamic && (
                          <Badge variant="islamic" className="text-xs py-0 px-1.5">
                            {t('islamic_compliant')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span className="text-caption text-gray-400 uppercase tracking-wider shrink-0 bg-surface-100 px-2 py-0.5 rounded-badge">
                      {product.product_type.replace(/_/g, ' ')}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Category Quick Links */}
      {!compact && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {QUICK_CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="px-3 py-1.5 text-xs font-medium text-white/80 bg-white/15 rounded-pill hover:bg-white/25 transition-colors backdrop-blur-sm"
            >
              {t(`categories.${cat.key}`)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
