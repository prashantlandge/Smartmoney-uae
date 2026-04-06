import { useState, useMemo } from 'react';
import { Receipt, ArrowRight } from 'lucide-react';

export default function VatCalculator() {
  const [amount, setAmount] = useState(1000);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const vatRate = 5;

  const result = useMemo(() => {
    if (mode === 'add') {
      const vat = amount * (vatRate / 100);
      return { original: amount, vat, total: amount + vat };
    }
    const original = amount / (1 + vatRate / 100);
    const vat = amount - original;
    return { original, vat, total: amount };
  }, [amount, mode]);

  const fmt = (n: number) => `AED ${n.toLocaleString('en-AE', { maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-white rounded-card border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-primary to-primary-600 flex items-center gap-2 text-white">
        <Receipt size={16} />
        <h3 className="text-sm font-bold">UAE VAT Calculator (5%)</h3>
      </div>

      <div className="p-5 grid sm:grid-cols-[1fr_1fr] gap-5">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Calculation Mode</label>
            <div className="flex gap-2">
              {[
                { value: 'add' as const, label: 'Add VAT' },
                { value: 'remove' as const, label: 'Remove VAT' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMode(opt.value)}
                  className={`flex-1 py-2 rounded-button text-xs font-medium border transition-colors ${
                    mode === opt.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 text-gray-600 hover:border-primary/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              {mode === 'add' ? 'Amount (excl. VAT)' : 'Amount (incl. VAT)'}
            </label>
            <div className="relative">
              <span className="absolute start-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">AED</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="input-field text-sm py-2.5 ps-12"
                min={0}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{mode === 'add' ? 'Original Amount' : 'Amount excl. VAT'}</span>
              <span className="font-semibold text-gray-900">{fmt(result.original)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>VAT (5%)</span>
              <span className="font-semibold text-primary">{fmt(result.vat)}</span>
            </div>
            <div className="border-t border-primary/10 pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">{mode === 'add' ? 'Total incl. VAT' : 'Total Amount'}</span>
                <span className="text-lg font-bold text-primary">{fmt(result.total)}</span>
              </div>
            </div>
          </div>

          <div className="text-label text-gray-400 space-y-1">
            <p>• UAE VAT rate: 5% (effective since Jan 2018)</p>
            <p>• Applies to most goods and services</p>
            <p>• Essential food, healthcare, and education may be exempt or zero-rated</p>
          </div>
        </div>
      </div>
    </div>
  );
}
