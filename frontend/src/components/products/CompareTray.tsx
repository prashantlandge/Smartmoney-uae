import { useCompare } from '@/context/CompareContext';
import { useTranslation } from 'next-i18next';
import { X, ArrowRightLeft } from 'lucide-react';
import ProviderLogo from '@/components/ui/ProviderLogo';
import { useState } from 'react';
import CompareModal from './CompareModal';

export default function CompareTray() {
  const { t } = useTranslation('common');
  const { items, remove, clear } = useCompare();
  const [showModal, setShowModal] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-surface-200 shadow-elevated animate-fade-in-up">
        <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          {/* Selected items */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-body-sm font-semibold text-gray-700 shrink-0">
              Compare ({items.length}/3)
            </span>
            <div className="flex gap-2 overflow-x-auto">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-2 bg-surface-50 rounded-button px-3 py-1.5 border border-surface-200 shrink-0"
                >
                  <ProviderLogo name={product.provider_name} logoUrl={product.provider_logo} size={24} />
                  <span className="text-xs font-medium text-gray-700 max-w-[120px] truncate">
                    {product.product_name}
                  </span>
                  <button
                    onClick={() => remove(product.id)}
                    className="text-gray-400 hover:text-error transition-colors"
                    aria-label="Remove"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clear}
              className="text-xs text-gray-500 hover:text-gray-700 px-3 py-2 rounded-button hover:bg-surface-100 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setShowModal(true)}
              disabled={items.length < 2}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRightLeft size={14} />
              Compare Now
            </button>
          </div>
        </div>
      </div>

      {showModal && <CompareModal onClose={() => setShowModal(false)} />}
    </>
  );
}
