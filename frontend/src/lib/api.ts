const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ProviderResult {
  provider_name: string;
  provider_logo: string;
  exchange_rate: number;
  fee_aed: number;
  recipient_receives_inr: number;
  transfer_speed: string;
  cost_vs_mid_market_percent: number;
  affiliate_link: string;
  savings_vs_worst: number;
  match_score?: number | null;
  match_reason?: string | null;
}

export interface RemittanceCompareResponse {
  mid_market_rate: number;
  providers: ProviderResult[];
  last_updated: string;
}

export async function compareRemittanceRates(
  sendAmountAed: number,
  receiveCurrency: string = 'INR'
): Promise<RemittanceCompareResponse> {
  const res = await fetch(`${API_BASE}/api/remittance/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      send_amount_aed: sendAmountAed,
      receive_currency: receiveCurrency,
    }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
