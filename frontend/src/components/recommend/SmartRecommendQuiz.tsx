import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import {
  Sparkles, ChevronRight, ChevronLeft, Loader2, Trophy, ArrowRight,
  Banknote, Globe, Moon, ShoppingBag, Shield, X,
} from 'lucide-react';
import ProviderLogo from '@/components/ui/ProviderLogo';
import Badge from '@/components/ui/Badge';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

interface Recommendation {
  product_id: string;
  product_name: string;
  provider_name: string;
  score: number;
  reason: string;
  highlight: string;
}

const SALARY_OPTIONS = [
  { label: 'Below AED 5,000', value: 4000 },
  { label: 'AED 5,000 - 10,000', value: 7500 },
  { label: 'AED 10,000 - 20,000', value: 15000 },
  { label: 'AED 20,000 - 50,000', value: 35000 },
  { label: 'Above AED 50,000', value: 75000 },
];

const NATIONALITY_OPTIONS = [
  { label: '🇮🇳 India', value: 'IN' },
  { label: '🇵🇰 Pakistan', value: 'PK' },
  { label: '🇵🇭 Philippines', value: 'PH' },
  { label: '🇧🇩 Bangladesh', value: 'BD' },
  { label: '🇱🇰 Sri Lanka', value: 'LK' },
  { label: '🇬🇧 UK', value: 'GB' },
  { label: '🇺🇸 USA', value: 'US' },
  { label: 'Other', value: 'OTHER' },
];

const SPENDING_OPTIONS = [
  { label: 'Dining & Restaurants', value: 'dining', icon: '🍽️' },
  { label: 'Travel & Airlines', value: 'travel', icon: '✈️' },
  { label: 'Groceries & Supermarket', value: 'groceries', icon: '🛒' },
  { label: 'Shopping & Retail', value: 'shopping', icon: '🛍️' },
  { label: 'Fuel & Petrol', value: 'fuel', icon: '⛽' },
  { label: 'Online & Streaming', value: 'online', icon: '💻' },
];

interface Props {
  onClose?: () => void;
  className?: string;
}

export default function SmartRecommendQuiz({ onClose, className = '' }: Props) {
  const { t } = useTranslation('common');
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[] | null>(null);

  // Form state
  const [salary, setSalary] = useState<number | null>(null);
  const [nationality, setNationality] = useState('IN');
  const [islamicPref, setIslamicPref] = useState(false);
  const [spending, setSpending] = useState<string[]>([]);
  const [riskTolerance, setRiskTolerance] = useState('moderate');

  const toggleSpending = (val: string) => {
    setSpending((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

  const canProceed = () => {
    if (step === 0) return salary !== null;
    if (step === 1) return nationality !== '';
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/advisor/smart-recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salary_aed: salary,
          nationality,
          islamic_preference: islamicPref,
          spending_categories: spending,
          risk_tolerance: riskTolerance,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.recommendations);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const steps = [
    // Step 0: Salary
    <div key="salary">
      <h3 className="text-sm font-bold text-gray-900 mb-1">What's your monthly salary?</h3>
      <p className="text-xs text-gray-500 mb-4">This helps us show products you're eligible for</p>
      <div className="space-y-2">
        {SALARY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSalary(opt.value)}
            className={`w-full text-start px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
              salary === opt.value
                ? 'border-brand-primary bg-brand-primary-50 text-brand-primary'
                : 'border-surface-200 text-gray-700 hover:border-brand-primary/30'
            }`}
          >
            <Banknote size={14} className="inline me-2" />
            {opt.label}
          </button>
        ))}
      </div>
    </div>,

    // Step 1: Nationality
    <div key="nationality">
      <h3 className="text-sm font-bold text-gray-900 mb-1">What's your nationality?</h3>
      <p className="text-xs text-gray-500 mb-4">For remittance corridor and eligibility matching</p>
      <div className="grid grid-cols-2 gap-2">
        {NATIONALITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setNationality(opt.value)}
            className={`text-start px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
              nationality === opt.value
                ? 'border-brand-primary bg-brand-primary-50 text-brand-primary'
                : 'border-surface-200 text-gray-700 hover:border-brand-primary/30'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Preferences
    <div key="preferences">
      <h3 className="text-sm font-bold text-gray-900 mb-1">Your preferences</h3>
      <p className="text-xs text-gray-500 mb-4">Select your top spending categories and preferences</p>

      <div className="space-y-4">
        {/* Islamic preference */}
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-surface-200 hover:border-brand-primary/30 transition-colors">
          <input
            type="checkbox"
            checked={islamicPref}
            onChange={(e) => setIslamicPref(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
          />
          <Moon size={16} className="text-emerald-600" />
          <span className="text-sm text-gray-700">Prefer Islamic / Shariah-compliant products</span>
        </label>

        {/* Spending categories */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Top spending categories</p>
          <div className="grid grid-cols-2 gap-2">
            {SPENDING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleSpending(opt.value)}
                className={`text-start px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                  spending.includes(opt.value)
                    ? 'border-brand-primary bg-brand-primary-50 text-brand-primary'
                    : 'border-surface-200 text-gray-600 hover:border-brand-primary/30'
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Risk tolerance */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Risk preference</p>
          <div className="flex gap-2">
            {[
              { label: 'Conservative', value: 'conservative', icon: Shield },
              { label: 'Moderate', value: 'moderate', icon: Banknote },
              { label: 'Aggressive', value: 'aggressive', icon: ShoppingBag },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRiskTolerance(opt.value)}
                className={`flex-1 text-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                  riskTolerance === opt.value
                    ? 'border-brand-primary bg-brand-primary-50 text-brand-primary'
                    : 'border-surface-200 text-gray-600 hover:border-brand-primary/30'
                }`}
              >
                <opt.icon size={14} className="mx-auto mb-1" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className={`bg-white rounded-card border border-surface-200 shadow-elevated overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary to-emerald-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Sparkles size={18} />
          <div>
            <h2 className="text-sm font-bold">Smart Recommendations</h2>
            <p className="text-xs text-white/70">AI-powered personalized picks</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Results */}
        {results !== null ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={16} className="text-brand-primary" />
              <h3 className="text-sm font-bold text-gray-900">Your Personalized Picks</h3>
            </div>

            {results.length === 0 ? (
              <p className="text-sm text-gray-500">
                No recommendations available right now. Try adjusting your preferences.
              </p>
            ) : (
              <div className="space-y-3">
                {results.map((rec, idx) => (
                  <Link
                    key={rec.product_id}
                    href={`/products/${rec.product_id}`}
                    className="flex items-start gap-3 p-3 rounded-xl border border-surface-200 hover:border-brand-primary/30 hover:shadow-card transition-all group"
                  >
                    <div className="relative">
                      <ProviderLogo name={rec.provider_name} size={36} />
                      {idx === 0 && (
                        <div className="absolute -top-1 -end-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                          <Trophy size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
                          {rec.product_name}
                        </span>
                        <Badge variant="best" className="text-[10px]">
                          {rec.score}% match
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{rec.provider_name}</p>
                      {rec.highlight && (
                        <p className="text-xs text-brand-primary font-medium mt-1">{rec.highlight}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{rec.reason}</p>
                    </div>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-primary shrink-0 mt-2" />
                  </Link>
                ))}
              </div>
            )}

            <button
              onClick={() => { setResults(null); setStep(0); }}
              className="text-xs text-brand-primary hover:text-brand-primary-700 font-medium mt-4 transition-colors"
            >
              Start over
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-10">
            <Loader2 size={24} className="animate-spin mx-auto text-brand-primary mb-3" />
            <p className="text-sm text-gray-600 font-medium">Analyzing your profile...</p>
            <p className="text-xs text-gray-400 mt-1">Our AI is matching you with the best products</p>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="flex gap-1.5 mb-5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= step ? 'bg-brand-primary' : 'bg-surface-200'
                  }`}
                />
              ))}
            </div>

            {/* Current step */}
            {steps[step]}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              {step > 0 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  <ChevronLeft size={14} /> Back
                </button>
              ) : (
                <div />
              )}

              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="btn-primary text-xs py-2 px-4 gap-1 disabled:opacity-50"
                >
                  Next <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="btn-primary text-xs py-2 px-4 gap-1"
                >
                  <Sparkles size={12} /> Get Recommendations
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
