import { useState, useMemo } from 'react';
import { PiggyBank, TrendingUp } from 'lucide-react';

export default function SavingsCalculator() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(2000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(4.5);

  const result = useMemo(() => {
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) {
      const total = monthlyDeposit * months;
      return { total, deposited: total, interest: 0 };
    }
    const total = monthlyDeposit * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const deposited = monthlyDeposit * months;
    return { total, deposited, interest: total - deposited };
  }, [monthlyDeposit, years, rate]);

  const fmt = (n: number) => `AED ${n.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white rounded-card border border-surface-200 overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-brand-nav to-brand-nav-dark flex items-center gap-2 text-white">
        <PiggyBank size={16} />
        <h3 className="text-sm font-bold">Savings Calculator</h3>
      </div>

      <div className="p-5 grid sm:grid-cols-[1fr_1fr] gap-5">
        <div className="space-y-4">
          <div>
            <label className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Monthly Deposit</span>
              <span className="font-semibold text-gray-900">{fmt(monthlyDeposit)}</span>
            </label>
            <input type="range" min={500} max={50000} step={500} value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
              className="w-full accent-brand-nav" />
            <div className="flex justify-between text-label text-gray-400">
              <span>AED 500</span><span>AED 50K</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Duration</span>
              <span className="font-semibold text-gray-900">{years} year{years !== 1 ? 's' : ''}</span>
            </label>
            <input type="range" min={1} max={30} step={1} value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-brand-nav" />
            <div className="flex justify-between text-label text-gray-400">
              <span>1 yr</span><span>30 yrs</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Expected Return (% p.a.)</span>
              <span className="font-semibold text-gray-900">{rate}%</span>
            </label>
            <input type="range" min={1} max={15} step={0.25} value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-brand-nav" />
            <div className="flex justify-between text-label text-gray-400">
              <span>1%</span><span>15%</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-brand-nav/5 rounded-xl p-4 text-center border border-brand-nav/10">
            <p className="text-xs text-brand-nav font-medium mb-1">Total Value</p>
            <p className="text-display-lg font-bold text-brand-nav">{fmt(result.total)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-50 rounded-xl p-3 text-center">
              <PiggyBank size={14} className="mx-auto text-gray-400 mb-1" />
              <p className="text-label text-gray-500">You Invest</p>
              <p className="text-sm font-bold text-gray-900">{fmt(result.deposited)}</p>
            </div>
            <div className="bg-surface-50 rounded-xl p-3 text-center">
              <TrendingUp size={14} className="mx-auto text-brand-primary mb-1" />
              <p className="text-label text-gray-500">Interest Earned</p>
              <p className="text-sm font-bold text-brand-primary">{fmt(result.interest)}</p>
            </div>
          </div>
          <p className="text-label text-gray-400 text-center">
            Assumes monthly compounding. Actual returns may vary.
          </p>
        </div>
      </div>
    </div>
  );
}
