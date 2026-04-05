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
    affiliateHref = affiliateUrl.toString();
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
    <tr className={`border-b border-gray-100 last:border-0 transition-colors h-[72px] ${isBest ? 'bg-success-light' : 'hover:bg-surface-50'}`}>
      {/* Provider */}
      <td className="py-3 px-3 align-middle">
        <div className="flex items-center gap-2.5">
          <div className="relative shrink-0">
            <ProviderLogo name={provider.provider_name} size={36} />
            <span className="absolute -top-1 -end-1 w-5 h-5 bg-white shadow-sm rounded-full flex items-center justify-center text-caption font-bold text-gray-600 border border-surface-200">
              {rank}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm truncate">{provider.provider_name}</span>
              {isBest && (
                <Badge variant="ai">{t('ai_best_for_you')}</Badge>
              )}
            </div>
            <SmartInsight matchScore={provider.match_score ?? null} matchReason={provider.match_reason ?? null} />
          </div>
        </div>
      </td>

      {/* Exchange Rate */}
      <td className="py-3 px-3 text-sm text-center font-medium align-middle">
        {provider.exchange_rate.toFixed(4)}
      </td>

      {/* Fee */}
      <td className="py-3 px-3 text-sm text-center align-middle">
        {provider.fee_aed === 0 ? (
          <Badge variant="success">Free</Badge>
        ) : (
          <span className="whitespace-nowrap">AED {provider.fee_aed.toFixed(2)}</span>
        )}
      </td>

      {/* Recipient Gets */}
      <td className="py-3 px-3 text-center align-middle">
        <span className="font-bold text-sm">
          {provider.recipient_receives_inr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </span>
        {provider.cost_vs_mid_market_percent > 0 ? (
          <div className="text-caption text-error mt-0.5 whitespace-nowrap">
            -{provider.cost_vs_mid_market_percent.toFixed(2)}% vs mid
          </div>
        ) : (
          <div className="text-caption text-transparent mt-0.5 select-none">&nbsp;</div>
        )}
      </td>

      {/* Speed */}
      <td className="py-3 px-3 text-sm text-center text-gray-600 hidden sm:table-cell align-middle">
        <span className="whitespace-nowrap">{provider.transfer_speed}</span>
      </td>

      {/* CTA */}
      <td className="py-3 px-3 text-end align-middle">
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
