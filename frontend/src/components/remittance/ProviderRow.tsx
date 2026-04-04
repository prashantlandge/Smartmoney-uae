import { useTranslation } from 'next-i18next';
import type { ProviderResult } from '@/lib/api';
import SmartInsight from '@/components/advisor/SmartInsight';
import ProviderLogo from '@/components/ui/ProviderLogo';
import Badge from '@/components/ui/Badge';
import { trackEvent } from '@/lib/tracker';

interface Props {
  provider: ProviderResult;
  rank: number;
  isBest: boolean;
  sendAmount?: number;
}

export default function ProviderRow({ provider, rank, isBest, sendAmount }: Props) {
  const { t } = useTranslation('common');

  let affiliateHref = provider.affiliate_link || '#';
  try {
    const affiliateUrl = new URL(provider.affiliate_link || 'https://example.com');
    affiliateUrl.searchParams.set('utm_source', 'uae_platform');
    affiliateUrl.searchParams.set('utm_medium', 'remittance');
    affiliateUrl.searchParams.set('utm_campaign', provider.provider_name.toLowerCase().replace(/\s+/g, '_'));
    affiliateHref = affiliateHref;
  } catch {
    // Invalid URL, use as-is
  }

  const handleClick = () => {
    trackEvent('click_provider', {
      provider_name: provider.provider_name,
      affiliate_link: affiliateHref,
      rank,
      send_amount_aed: sendAmount,
      exchange_rate: provider.exchange_rate,
    });
  };

  return (
    <tr className={`border-b border-gray-100 last:border-0 transition-colors ${isBest ? 'bg-success-light' : 'hover:bg-surface-50'}`}>
      {/* Provider */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <ProviderLogo name={provider.provider_name} size={36} />
            <span className="absolute -top-1 -end-1 w-5 h-5 bg-white shadow-sm rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600 border border-surface-200">
              {rank}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm">{provider.provider_name}</span>
              {isBest && (
                <Badge variant="ai">{t('ai_best_for_you')}</Badge>
              )}
            </div>
            <SmartInsight matchScore={provider.match_score ?? null} matchReason={provider.match_reason ?? null} />
          </div>
        </div>
      </td>

      {/* Exchange Rate */}
      <td className="py-3 px-3 text-sm text-center font-medium">
        {provider.exchange_rate.toFixed(4)}
      </td>

      {/* Fee */}
      <td className="py-3 px-3 text-sm text-center">
        {provider.fee_aed === 0 ? (
          <Badge variant="success">Free</Badge>
        ) : (
          <span>AED {provider.fee_aed.toFixed(2)}</span>
        )}
      </td>

      {/* Recipient Gets */}
      <td className="py-3 px-3 text-center">
        <span className="font-bold text-sm">
          {provider.recipient_receives_inr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </span>
        {provider.cost_vs_mid_market_percent > 0 && (
          <div className="text-[11px] text-error mt-0.5">
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
          href={affiliateHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="btn-primary text-xs py-2 px-3 whitespace-nowrap"
        >
          {t('action')}
        </a>
      </td>
    </tr>
  );
}
