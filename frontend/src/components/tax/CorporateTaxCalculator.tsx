import { useState, useMemo } from 'react';
import { Briefcase, AlertCircle } from 'lucide-react';

export default function CorporateTaxCalculator() {
  const [revenue, setRevenue] = useState(1000000);
  const [expenses, setExpenses] = useState(700000);
  const [isFreezone, setIsFreezone] = useState(false);

  const result = useMemo(() => {
    const taxableIncome = Math.max(revenue - expenses, 0);
    const threshold = 375000;

    let tax = 0;
    if (!isFreezone && taxableIncome > threshold) {
      tax = (taxableIncome - threshold) * 0.09;
    }

    const effectiveRate = taxableIncome > 0 ? (tax / taxableIncome) * 100 : 0;

    return { taxableIncome, tax, effectiveRate, threshold };
  }, [revenue, expenses, isFreezone]);

  const fmt = (n: number) => `AED ${n.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white rounded-card border border-surface-200 overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-brand-nav to-brand-nav-dark flex items-center gap-2 text-white">
        <Briefcase size={16} />
        <h3 className="text-sm font-bold">UAE Corporate Tax Calculator (9%)</h3>
      </div>

      <div className="p-5 grid sm:grid-cols-[1fr_1fr] gap-5">
        <div className="space-y-4">
          <div>
            <label className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Annual Revenue</span>
              <span className="font-semibold text-gray-900">{fmt(revenue)}</span>
            </label>
            <input type="range" min={100000} max={10000000} step={50000} value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              className="w-full accent-brand-nav" />
            <div className="flex justify-between text-label text-gray-400">
              <span>AED 100K</span><span>AED 10M</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Annual Expenses</span>
              <span className="font-semibold text-gray-900">{fmt(expenses)}</span>
            </label>
            <input type="range" min={0} max={revenue} step={50000} value={Math.min(expenses, revenue)}
              onChange={(e) => setExpenses(Number(e.target.value))}
              className="w-full accent-brand-nav" />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFreezone}
                onChange={(e) => setIsFreezone(e.target.checked)}
                className="w-4 h-4 rounded accent-brand-nav"
              />
              <span className="text-xs text-gray-600">Qualifying Free Zone entity</span>
            </label>
            <p className="text-label text-gray-400 mt-1 ms-6">
              Free zone entities meeting conditions may enjoy 0% on qualifying income
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className={`rounded-xl p-4 text-center border ${isFreezone ? 'bg-brand-nav-50 border-brand-nav-100' : 'bg-surface-50 border-surface-200'}`}>
            <p className="text-xs text-gray-500 font-medium mb-1">Estimated Corporate Tax</p>
            <p className={`text-display-lg font-bold ${isFreezone ? 'text-brand-nav' : 'text-brand-dark'}`}>
              {fmt(result.tax)}
            </p>
            <p className="text-label text-gray-400 mt-1">
              Effective rate: {result.effectiveRate.toFixed(1)}%
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-50 rounded-xl p-3 text-center">
              <p className="text-label text-gray-500">Taxable Income</p>
              <p className="text-sm font-bold text-gray-900">{fmt(result.taxableIncome)}</p>
            </div>
            <div className="bg-surface-50 rounded-xl p-3 text-center">
              <p className="text-label text-gray-500">Tax-Free Threshold</p>
              <p className="text-sm font-bold text-brand-nav">{fmt(result.threshold)}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-label text-gray-400">
            <AlertCircle size={11} className="shrink-0 mt-0.5" />
            UAE Corporate Tax effective from June 2023. First AED 375,000 of taxable income is tax-free. Consult a tax advisor.
          </div>
        </div>
      </div>
    </div>
  );
}
