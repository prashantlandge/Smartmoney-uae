import { useTranslation } from 'next-i18next';
import type { ProviderResult } from '@/lib/api';

interface Props {
  provider: ProviderResult;
  rank: number;
  isBest: boolean;
}

export default function ProviderRow({ provider, rank, isBest }: Props) {
  const { t } = useTranslation('common');

  const affiliateUrl = new URL(provider.affiliate_link || '#');
  affiliateUrl.searchParams.set('utm_source', 'uae_platform');
  affiliateUrl.searchParams.set('utm_medium', 'remittance');
  affiliateUrl.searchParams.set('utm_campaign', provider.provider_name.toLowerCase().replace(/\s+/g, '_'));

  return (
    <tr className={`border-b border-gray-100 last:border-0 ${isBest ? 'bg-green-50' : ''}`}>
      {/* Provider */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          {isBest && (
            <span className="inline-block px-1.5 py-0.5 bg-brand-primary text-white text-[10px] font-bold rounded uppercase tracking-wide">
              Best
            </span>
          )}
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
            {rank}
          </div>
          <span className="font-medium text-sm">{provider.provider_name}</span>
        </div>
      </td>

      {/* Exchange Rate */}
      <td className="py-3 px-3 text-sm text-center">
        {provider.exchange_rate.toFixed(4)}
      </td>

      {/* Fee */}
      <td className="py-3 px-3 text-sm text-center">
        {provider.fee_aed === 0 ? (
          <span className="text-brand-primary font-medium">Free</span>
        ) : (
          <span>AED {provider.fee_aed.toFixed(2)}</span>
        )}
      </td>

      {/* Recipient Gets */}
      <td className="py-3 px-3 text-center">
        <span className="font-bold text-sm">
          ₹{provider.recipient_receives_inr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </span>
        {provider.cost_vs_mid_market_percent > 0 && (
          <div className="text-[11px] text-red-500 mt-0.5">
            -{provider.cost_vs_mid_market_percent.toFixed(2)}% vs mid
          </div>
        )}
      </td>

      {/* Speed */}
      <td className="py-3 px-3 text-sm text-center text-gray-600 hidden sm:table-cell">
        {provider.transfer_speed}
      </td>

      {/* CTA */}
      <td className="py-3 px-3 text-end">
        <a
          href={affiliateUrl.toString()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-xs py-2 px-3 whitespace-nowrap"
        >
          {t('action')}
        </a>
      </td>
    </tr>
  );
}
