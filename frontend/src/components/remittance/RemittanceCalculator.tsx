import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRemittanceRates } from '@/hooks/useRemittanceRates';
import ProviderRow from './ProviderRow';
import MidMarketTooltip from './MidMarketTooltip';
import CurrencySelector from './CurrencySelector';
import RateAlertForm from '@/components/rates/RateAlertForm';
import FlagIcon from '@/components/ui/FlagIcon';
import Skeleton from '@/components/ui/Skeleton';
import { trackEvent } from '@/lib/tracker';

export default function RemittanceCalculator() {
  const { t } = useTranslation('common');
  const [sendAmount, setSendAmount] = useState<number>(1000);
  const [receiveCurrency, setReceiveCurrency] = useState('INR');
  const { data, loading, error } = useRemittanceRates(sendAmount);

  const bestProvider = data?.providers?.[0];
  const worstProvider = data?.providers?.[data.providers.length - 1];
  const savingsInr = bestProvider && worstProvider
    ? bestProvider.recipient_receives_inr - worstProvider.recipient_receives_inr
    : 0;

  const handleAmountChange = (value: number) => {
    setSendAmount(value);
    if (value > 0) {
      trackEvent('compare', { send_amount_aed: value, receive_currency: receiveCurrency });
    }
  };

  const handleCurrencyChange = (currency: string) => {
    setReceiveCurrency(currency);
    trackEvent('currency_change', { currency });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Currency Selector */}
      <div className="flex justify-center mb-3">
        <CurrencySelector value={receiveCurrency} onChange={handleCurrencyChange} />
      </div>

      {/* Input Section */}
      <div className="card-elevated mb-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
          {/* Send Amount */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              {t('send_amount_label')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none gap-1.5">
                <FlagIcon code="AED" size={18} />
                <span className="text-sm font-medium text-gray-500">AED</span>
              </div>
              <input
                type="number"
                value={sendAmount || ''}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                placeholder="1000"
                min={1}
                max={100000}
                className="input-field ps-20"
              />
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center sm:pb-1">
            <svg className="w-6 h-6 text-gray-400 rotate-90 sm:rotate-0 rtl:sm:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>

          {/* Receive Currency */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              {t('receive_amount_label')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none gap-1.5">
                <FlagIcon code={receiveCurrency} size={18} />
                <span className="text-sm font-medium text-gray-500">{receiveCurrency}</span>
              </div>
              <div className="input-field ps-20 bg-surface-50 flex items-center text-gray-700">
                {loading ? (
                  <span className="text-gray-400">{t('loading')}</span>
                ) : bestProvider ? (
                  <span className="font-semibold">
                    {bestProvider.recipient_receives_inr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Banner */}
      {savingsInr > 0 && bestProvider && worstProvider && (
        <div className="bg-success-light border border-emerald-200 rounded-card p-3 mb-4 text-center">
          <p className="text-sm text-success-dark font-medium">
            {t('savings_message', {
              amount: savingsInr.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
              best: bestProvider.provider_name,
              worst: worstProvider.provider_name,
            })}
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-error-light border border-red-200 rounded-card p-3 mb-4 text-center">
          <p className="text-sm text-error-dark">{t('error_message')}</p>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !data && (
        <div className="card">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} height={48} width="100%" rounded="lg" />
            ))}
          </div>
        </div>
      )}

      {data && data.providers.length > 0 && (
        <div className="card overflow-hidden p-0">
          {/* Mid-market reference */}
          <div className="px-4 py-2.5 border-b border-gray-100 bg-surface-50">
            <MidMarketTooltip rate={data.mid_market_rate} />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3 text-start font-medium">{t('provider')}</th>
                  <th className="py-2.5 px-3 text-center font-medium">{t('exchange_rate')}</th>
                  <th className="py-2.5 px-3 text-center font-medium">{t('fee')}</th>
                  <th className="py-2.5 px-3 text-center font-medium">{t('recipient_gets')}</th>
                  <th className="py-2.5 px-3 text-center font-medium hidden sm:table-cell">{t('speed')}</th>
                  <th className="py-2.5 px-3 text-end font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {data.providers.map((provider, idx) => (
                  <ProviderRow
                    key={provider.provider_name}
                    provider={provider}
                    rank={idx + 1}
                    isBest={idx === 0}
                    sendAmount={sendAmount}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Rate Alert */}
          <div className="px-4 pb-3">
            <RateAlertForm currentRate={data.mid_market_rate} />
          </div>

          {/* Last updated */}
          <div className="px-4 py-2 border-t border-gray-100 bg-surface-50 text-xs text-gray-400 text-end">
            {t('last_updated')}: {new Date(data.last_updated).toLocaleTimeString()}
          </div>
        </div>
      )}

      {data && data.providers.length === 0 && (
        <div className="card text-center py-8">
          <p className="text-gray-500">{t('no_results')}</p>
        </div>
      )}
    </div>
  );
}
