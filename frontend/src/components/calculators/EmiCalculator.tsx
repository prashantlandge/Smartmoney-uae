import { useState, useMemo } from 'react';
import { Calculator, TrendingDown, Calendar, Wallet } from 'lucide-react';

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [tenure, setTenure] = useState(24);
  const [rate, setRate] = useState(5.99);

  const result = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) {
      const emi = loanAmount / tenure;
      return { emi, totalPayment: loanAmount, totalInterest: 0 };
    }
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
                (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - loanAmount;
    return { emi, totalPayment, totalInterest };
  }, [loanAmount, tenure, rate]);

  const fmt = (n: number) => `AED ${n.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white rounded-card border border-surface-200 overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 flex items-center gap-2 text-white">
        <Calculator size={16} />
        <h3 className="text-sm font-bold">EMI Calculator</h3>
      </div>

      <div className="p-5 grid sm:grid-cols-[1fr_1fr] gap-5">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Loan Amount</span>
              <span className="font-semibold text-gray-900">{fmt(loanAmount)}</span>
            </label>
            <input type="range" min={10000} max={2000000} step={5000} value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-teal-600" />
            <div className="flex justify-between text-caption text-gray-400">
              <span>AED 10K</span><span>AED 2M</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Tenure (months)</span>
              <span className="font-semibold text-gray-900">{tenure} months</span>
            </label>
            <input type="range" min={6} max={60} step={6} value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full accent-teal-600" />
            <div className="flex justify-between text-caption text-gray-400">
              <span>6 mo</span><span>60 mo</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Interest Rate (% p.a.)</span>
              <span className="font-semibold text-gray-900">{rate}%</span>
            </label>
            <input type="range" min={3} max={20} step={0.25} value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-teal-600" />
            <div className="flex justify-between text-caption text-gray-400">
              <span>3%</span><span>20%</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className="bg-teal-50 rounded-xl p-4 text-center border border-teal-100">
            <p className="text-xs text-teal-600 font-medium mb-1">Monthly EMI</p>
            <p className="text-display-sm font-bold text-teal-700">{fmt(result.emi)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-50 rounded-xl p-3 text-center">
              <Wallet size={14} className="mx-auto text-gray-400 mb-1" />
              <p className="text-caption text-gray-500">Total Payment</p>
              <p className="text-sm font-bold text-gray-900">{fmt(result.totalPayment)}</p>
            </div>
            <div className="bg-surface-50 rounded-xl p-3 text-center">
              <TrendingDown size={14} className="mx-auto text-gray-400 mb-1" />
              <p className="text-caption text-gray-500">Total Interest</p>
              <p className="text-sm font-bold text-amber-600">{fmt(result.totalInterest)}</p>
            </div>
          </div>
          <p className="text-caption text-gray-400 text-center">
            Based on flat rate of {rate}% p.a. Actual rates may vary.
          </p>
        </div>
      </div>
    </div>
  );
}
