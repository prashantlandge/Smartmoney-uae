import { useState, useMemo } from 'react';
import { Shield, Car, HeartPulse, AlertCircle } from 'lucide-react';

type InsuranceType = 'car' | 'health';

interface Props {
  type: InsuranceType;
}

// Car insurance estimation based on UAE market
function estimateCarPremium(carValue: number, carAge: number, coverType: string): {
  low: number; mid: number; high: number; tips: string[];
} {
  let baseRate: number;
  if (coverType === 'comprehensive') {
    baseRate = carAge <= 1 ? 0.028 : carAge <= 3 ? 0.032 : carAge <= 5 ? 0.038 : 0.045;
  } else {
    // Third party
    baseRate = 0.012;
  }

  const base = carValue * baseRate;
  const low = Math.max(base * 0.85, 750);
  const mid = Math.max(base, 900);
  const high = base * 1.25;

  const tips = [];
  if (carAge > 5) tips.push('Older cars have higher premiums due to repair costs');
  if (coverType === 'comprehensive') tips.push('Add agency repair for ~15% more premium');
  if (carValue > 150000) tips.push('High-value cars qualify for agreed-value policies');
  tips.push('No-claims discount can save up to 25% on renewal');

  return { low, mid, high, tips };
}

// Health insurance estimation based on UAE market
function estimateHealthPremium(age: number, coverage: string, dependents: number): {
  low: number; mid: number; high: number; tips: string[];
} {
  let baseMonthly: number;

  if (age < 30) baseMonthly = coverage === 'enhanced' ? 450 : 250;
  else if (age < 40) baseMonthly = coverage === 'enhanced' ? 600 : 350;
  else if (age < 50) baseMonthly = coverage === 'enhanced' ? 850 : 500;
  else baseMonthly = coverage === 'enhanced' ? 1200 : 700;

  const depCost = dependents * baseMonthly * 0.7;
  const totalMonthly = baseMonthly + depCost;
  const annual = totalMonthly * 12;

  const low = annual * 0.8;
  const mid = annual;
  const high = annual * 1.3;

  const tips = [];
  if (dependents > 0) tips.push(`Family plans often cheaper than ${dependents + 1} individual plans`);
  if (coverage === 'basic') tips.push('Basic plans cover DHA/HAAD minimums; consider enhanced for specialist access');
  if (age > 45) tips.push('Pre-existing conditions may affect premium; declare upfront for hassle-free claims');
  tips.push('Employer-provided insurance may already cover basic needs');

  return { low, mid, high, tips };
}

export default function InsuranceEstimator({ type }: Props) {
  // Car inputs
  const [carValue, setCarValue] = useState(80000);
  const [carAge, setCarAge] = useState(2);
  const [coverType, setCoverType] = useState('comprehensive');

  // Health inputs
  const [age, setAge] = useState(32);
  const [coverage, setCoverage] = useState('enhanced');
  const [dependents, setDependents] = useState(2);

  const result = useMemo(() => {
    if (type === 'car') return estimateCarPremium(carValue, carAge, coverType);
    return estimateHealthPremium(age, coverage, dependents);
  }, [type, carValue, carAge, coverType, age, coverage, dependents]);

  const fmt = (n: number) => `AED ${n.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`;

  const isCarType = type === 'car';
  const Icon = isCarType ? Car : HeartPulse;
  const gradient = isCarType ? 'from-amber-600 to-amber-500' : 'from-rose-600 to-rose-500';
  const accentBg = isCarType ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100';
  const accentText = isCarType ? 'text-amber-700' : 'text-rose-700';
  const accentLabel = isCarType ? 'text-amber-600' : 'text-rose-600';
  const accent = isCarType ? 'accent-amber-600' : 'accent-rose-600';

  return (
    <div className="bg-white rounded-card border border-surface-200 overflow-hidden">
      <div className={`px-5 py-3 bg-gradient-to-r ${gradient} flex items-center gap-2 text-white`}>
        <Icon size={16} />
        <h3 className="text-sm font-bold">
          {isCarType ? 'Car Insurance Estimator' : 'Health Insurance Estimator'}
        </h3>
      </div>

      <div className="p-5 grid sm:grid-cols-[1fr_1fr] gap-5">
        {/* Inputs */}
        <div className="space-y-4">
          {isCarType ? (
            <>
              <div>
                <label className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Car Value</span>
                  <span className="font-semibold text-gray-900">{fmt(carValue)}</span>
                </label>
                <input type="range" min={20000} max={500000} step={5000} value={carValue}
                  onChange={(e) => setCarValue(Number(e.target.value))}
                  className={`w-full ${accent}`} />
                <div className="flex justify-between text-caption text-gray-400">
                  <span>AED 20K</span><span>AED 500K</span>
                </div>
              </div>

              <div>
                <label className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Car Age</span>
                  <span className="font-semibold text-gray-900">{carAge} year{carAge !== 1 ? 's' : ''}</span>
                </label>
                <input type="range" min={0} max={10} step={1} value={carAge}
                  onChange={(e) => setCarAge(Number(e.target.value))}
                  className={`w-full ${accent}`} />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Coverage Type</label>
                <div className="flex gap-2">
                  {[
                    { value: 'comprehensive', label: 'Comprehensive' },
                    { value: 'third_party', label: 'Third Party' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setCoverType(opt.value)}
                      className={`flex-1 py-2 rounded-button text-xs font-medium border transition-colors ${
                        coverType === opt.value
                          ? 'border-amber-400 bg-amber-50 text-amber-700'
                          : 'border-surface-200 text-gray-600 hover:border-amber-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Your Age</span>
                  <span className="font-semibold text-gray-900">{age} years</span>
                </label>
                <input type="range" min={21} max={65} step={1} value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className={`w-full ${accent}`} />
              </div>

              <div>
                <label className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Dependents</span>
                  <span className="font-semibold text-gray-900">{dependents}</span>
                </label>
                <input type="range" min={0} max={6} step={1} value={dependents}
                  onChange={(e) => setDependents(Number(e.target.value))}
                  className={`w-full ${accent}`} />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Plan Type</label>
                <div className="flex gap-2">
                  {[
                    { value: 'basic', label: 'Basic (DHA Min)' },
                    { value: 'enhanced', label: 'Enhanced' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setCoverage(opt.value)}
                      className={`flex-1 py-2 rounded-button text-xs font-medium border transition-colors ${
                        coverage === opt.value
                          ? 'border-rose-400 bg-rose-50 text-rose-700'
                          : 'border-surface-200 text-gray-600 hover:border-rose-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className={`${accentBg} rounded-xl p-4 text-center border`}>
            <p className={`text-xs ${accentLabel} font-medium mb-1`}>Estimated Annual Premium</p>
            <p className={`text-display-sm font-bold ${accentText}`}>{fmt(result.mid)}</p>
            <p className="text-caption text-gray-500 mt-1">
              Range: {fmt(result.low)} – {fmt(result.high)}
            </p>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            {result.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <Shield size={12} className="text-gray-400 shrink-0 mt-0.5" />
                {tip}
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 text-caption text-gray-400">
            <AlertCircle size={11} className="shrink-0 mt-0.5" />
            Estimates only. Get actual quotes from providers for accurate pricing.
          </div>
        </div>
      </div>
    </div>
  );
}
