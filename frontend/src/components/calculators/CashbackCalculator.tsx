import { useState, useMemo } from 'react';
import { CreditCard, Percent, ShoppingBag, UtensilsCrossed, Fuel, Plane, ShoppingCart } from 'lucide-react';

const SPEND_CATEGORIES = [
  { key: 'dining', label: 'Dining', icon: UtensilsCrossed, color: 'text-orange-500' },
  { key: 'groceries', label: 'Groceries', icon: ShoppingCart, color: 'text-green-500' },
  { key: 'fuel', label: 'Fuel', icon: Fuel, color: 'text-blue-500' },
  { key: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-purple-500' },
  { key: 'travel', label: 'Travel', icon: Plane, color: 'text-sky-500' },
  { key: 'other', label: 'Other', icon: CreditCard, color: 'text-gray-500' },
];

// Simulated card cashback rates (would come from DB in production)
const CARD_PROFILES = [
  {
    name: 'ENBD Go4it Cashback',
    provider: 'Emirates NBD',
    rates: { dining: 5, groceries: 2, fuel: 2, shopping: 1, travel: 1, other: 0.5 },
    annualFee: 399,
    cap: 1000,
  },
  {
    name: 'FAB Rewards Platinum',
    provider: 'FAB',
    rates: { dining: 3, groceries: 3, fuel: 2, shopping: 2, travel: 4, other: 1 },
    annualFee: 500,
    cap: 0,
  },
  {
    name: 'Mashreq Neo Visa',
    provider: 'Mashreq',
    rates: { dining: 2, groceries: 2, fuel: 1, shopping: 2, travel: 1, other: 1 },
    annualFee: 0,
    cap: 500,
  },
  {
    name: 'ADCB TouchPoints Infinite',
    provider: 'ADCB',
    rates: { dining: 4, groceries: 3, fuel: 2, shopping: 3, travel: 3, other: 1 },
    annualFee: 1000,
    cap: 0,
  },
  {
    name: 'RAKBANK World Elite',
    provider: 'RAKBANK',
    rates: { dining: 3, groceries: 2, fuel: 3, shopping: 2, travel: 2, other: 1 },
    annualFee: 750,
    cap: 0,
  },
];

export default function CashbackCalculator() {
  const [spends, setSpends] = useState<Record<string, number>>({
    dining: 2000, groceries: 3000, fuel: 1000, shopping: 1500, travel: 500, other: 2000,
  });

  const updateSpend = (key: string, value: number) => {
    setSpends((prev) => ({ ...prev, [key]: value }));
  };

  const results = useMemo(() => {
    return CARD_PROFILES.map((card) => {
      let totalCashback = 0;
      const breakdown: Record<string, number> = {};

      for (const [cat, amount] of Object.entries(spends)) {
        const rate = (card.rates as any)[cat] || 0;
        const cb = (amount * rate) / 100;
        breakdown[cat] = cb;
        totalCashback += cb;
      }

      const annualCashback = totalCashback * 12;
      const cappedAnnual = card.cap > 0 ? Math.min(annualCashback, card.cap * 12) : annualCashback;
      const netBenefit = cappedAnnual - card.annualFee;

      return { ...card, monthlyCashback: totalCashback, annualCashback: cappedAnnual, netBenefit, breakdown };
    }).sort((a, b) => b.netBenefit - a.netBenefit);
  }, [spends]);

  const fmt = (n: number) => `AED ${n.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white rounded-card border border-surface-200 overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 flex items-center gap-2 text-white">
        <Percent size={16} />
        <h3 className="text-sm font-bold">Cashback Calculator</h3>
      </div>

      <div className="p-5">
        {/* Spend inputs */}
        <p className="text-xs text-gray-500 mb-3">Enter your monthly spending by category</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {SPEND_CATEGORIES.map((cat) => (
            <div key={cat.key} className="relative">
              <label className="text-caption text-gray-500 flex items-center gap-1 mb-1">
                <cat.icon size={12} className={cat.color} />
                {cat.label}
              </label>
              <div className="relative">
                <span className="absolute start-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">AED</span>
                <input
                  type="number"
                  value={spends[cat.key]}
                  onChange={(e) => updateSpend(cat.key, Number(e.target.value) || 0)}
                  className="input-field text-xs py-2 ps-12 pe-2 w-full"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Results table */}
        <div className="border border-surface-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-0 text-xs">
            {/* Header */}
            <div className="px-3 py-2 bg-surface-50 font-semibold text-gray-600">Card</div>
            <div className="px-3 py-2 bg-surface-50 font-semibold text-gray-600 text-end">Monthly</div>
            <div className="px-3 py-2 bg-surface-50 font-semibold text-gray-600 text-end">Annual</div>
            <div className="px-3 py-2 bg-surface-50 font-semibold text-gray-600 text-end">Net Benefit</div>

            {results.map((card, idx) => (
              <>
                <div key={`${card.name}-name`} className={`px-3 py-2.5 border-t border-surface-100 ${idx === 0 ? 'bg-emerald-50' : ''}`}>
                  <p className="font-semibold text-gray-900">{card.name}</p>
                  <p className="text-caption text-gray-400">{card.provider} · Fee: {fmt(card.annualFee)}/yr</p>
                </div>
                <div key={`${card.name}-monthly`} className={`px-3 py-2.5 border-t border-surface-100 text-end font-medium ${idx === 0 ? 'bg-emerald-50' : ''}`}>
                  {fmt(card.monthlyCashback)}
                </div>
                <div key={`${card.name}-annual`} className={`px-3 py-2.5 border-t border-surface-100 text-end font-medium ${idx === 0 ? 'bg-emerald-50' : ''}`}>
                  {fmt(card.annualCashback)}
                </div>
                <div key={`${card.name}-net`} className={`px-3 py-2.5 border-t border-surface-100 text-end font-bold ${
                  idx === 0 ? 'bg-emerald-50 text-emerald-700' : card.netBenefit >= 0 ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {card.netBenefit >= 0 ? '+' : ''}{fmt(card.netBenefit)}
                </div>
              </>
            ))}
          </div>
        </div>

        <p className="text-caption text-gray-400 mt-3 text-center">
          Net benefit = annual cashback − annual fee. Rates are approximate.
        </p>
      </div>
    </div>
  );
}
