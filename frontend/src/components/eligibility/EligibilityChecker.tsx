import { useState } from 'react';
import { Shield, Check, X, AlertCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

interface EligibilityResult {
  product_id: string;
  product_name: string;
  provider_name: string;
  eligible: boolean;
  reasons: string[];
  match_level: string; // eligible, likely_eligible, not_eligible
}

interface Props {
  onResults?: (results: EligibilityResult[]) => void;
}

const SALARY_OPTIONS = [
  { label: 'Below AED 5,000', value: 4000 },
  { label: 'AED 5,000 – 8,000', value: 6500 },
  { label: 'AED 8,000 – 15,000', value: 12000 },
  { label: 'AED 15,000 – 30,000', value: 22000 },
  { label: 'AED 30,000+', value: 40000 },
];

export default function EligibilityChecker({ onResults }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [salary, setSalary] = useState(12000);
  const [nationality, setNationality] = useState('IN');
  const [employer, setEmployer] = useState('private');
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [summary, setSummary] = useState({ eligible: 0, total: 0 });

  const handleCheck = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/eligibility/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salary_aed: salary,
          nationality,
          employer_type: employer,
          residency_status: 'resident',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const results: EligibilityResult[] = data.results;
        const eligibleCount = results.filter((r) => r.eligible).length;
        setSummary({ eligible: eligibleCount, total: results.length });
        setChecked(true);
        onResults?.(results);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-card border border-surface-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 flex items-center justify-between hover:bg-surface-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary-50 flex items-center justify-center">
            <Shield size={16} className="text-brand-primary" />
          </div>
          <div className="text-start">
            <h3 className="text-sm font-bold text-gray-900">Eligibility Checker</h3>
            <p className="text-caption text-gray-500">See which products you qualify for</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {checked && (
            <span className="text-xs font-semibold text-brand-primary bg-brand-primary-50 px-2 py-1 rounded-badge">
              {summary.eligible}/{summary.total} eligible
            </span>
          )}
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-surface-100 pt-4 animate-fade-in">
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            {/* Salary */}
            <div>
              <label className="text-caption text-gray-500 font-medium mb-1 block">Monthly Salary</label>
              <select
                value={salary}
                onChange={(e) => { setSalary(Number(e.target.value)); setChecked(false); }}
                className="input-field text-xs py-2"
              >
                {SALARY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Nationality */}
            <div>
              <label className="text-caption text-gray-500 font-medium mb-1 block">Nationality</label>
              <select
                value={nationality}
                onChange={(e) => { setNationality(e.target.value); setChecked(false); }}
                className="input-field text-xs py-2"
              >
                <option value="IN">Indian</option>
                <option value="PK">Pakistani</option>
                <option value="PH">Filipino</option>
                <option value="BD">Bangladeshi</option>
                <option value="LK">Sri Lankan</option>
                <option value="AE">UAE National</option>
                <option value="GB">British</option>
                <option value="US">American</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Employer */}
            <div>
              <label className="text-caption text-gray-500 font-medium mb-1 block">Employer Type</label>
              <select
                value={employer}
                onChange={(e) => { setEmployer(e.target.value); setChecked(false); }}
                className="input-field text-xs py-2"
              >
                <option value="government">Government</option>
                <option value="listed_company">Listed Company</option>
                <option value="private">Private Company</option>
                <option value="self_employed">Self Employed</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCheck}
            disabled={loading}
            className="btn-primary text-xs py-2 px-4 w-full sm:w-auto gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Checking...
              </>
            ) : (
              <>
                <Shield size={14} /> Check My Eligibility
              </>
            )}
          </button>

          {checked && (
            <div className="mt-3 flex items-center gap-2 text-xs">
              {summary.eligible > 0 ? (
                <span className="flex items-center gap-1 text-emerald-600">
                  <Check size={14} />
                  You're eligible for {summary.eligible} of {summary.total} products
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-600">
                  <AlertCircle size={14} />
                  Try adjusting your salary or employer type
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
