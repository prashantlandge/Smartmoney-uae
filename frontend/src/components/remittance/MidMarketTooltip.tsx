import { useState } from 'react';
import { useTranslation } from 'next-i18next';

interface Props {
  rate: number;
}

export default function MidMarketTooltip({ rate }: Props) {
  const { t } = useTranslation('common');
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <span className="text-sm text-gray-500">{t('mid_market_rate')}:</span>
      <span className="text-sm font-semibold text-gray-700">1 AED = {rate.toFixed(4)} INR</span>
      <button
        type="button"
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs hover:bg-gray-300 transition-colors"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label="Info"
      >
        ?
      </button>
      {showTooltip && (
        <div className="absolute bottom-full start-0 mb-2 w-72 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
          {t('mid_market_tooltip')}
          <div className="absolute top-full start-4 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-gray-800" />
        </div>
      )}
    </div>
  );
}
