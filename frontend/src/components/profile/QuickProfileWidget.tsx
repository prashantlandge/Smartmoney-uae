import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { UserProfile } from '@/hooks/useUserProfile';

interface Props {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

const NATIONALITIES = [
  { code: 'IN', label: 'India' },
  { code: 'PK', label: 'Pakistan' },
  { code: 'PH', label: 'Philippines' },
  { code: 'BD', label: 'Bangladesh' },
  { code: 'LK', label: 'Sri Lanka' },
  { code: 'NP', label: 'Nepal' },
  { code: 'AE', label: 'UAE' },
  { code: 'OTHER', label: 'Other' },
];

const SALARY_BANDS = [
  { value: 4000, label: 'AED 3,000 – 5,000' },
  { value: 7500, label: 'AED 5,000 – 10,000' },
  { value: 15000, label: 'AED 10,000 – 20,000' },
  { value: 30000, label: 'AED 20,000+' },
];

const EMPLOYER_TYPES = [
  { value: 'government', label: 'Government' },
  { value: 'listed_company', label: 'Listed company' },
  { value: 'private', label: 'Private company' },
  { value: 'self_employed', label: 'Self-employed' },
];

export default function QuickProfileWidget({ profile, onUpdate }: Props) {
  const { t } = useTranslation('common');
  const [step, setStep] = useState(profile.onboarded ? -1 : 0);
  const [isCollapsed, setIsCollapsed] = useState(profile.onboarded);

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="w-full text-start mb-3 px-4 py-2 bg-white/10 backdrop-blur rounded-lg text-white/80 text-sm hover:bg-white/20 transition-colors"
      >
        {profile.onboarded
          ? `${t('profile_personalized')} ✓ — ${t('profile_edit')}`
          : t('profile_cta')}
      </button>
    );
  }

  const handleFinish = () => {
    onUpdate({ onboarded: true });
    setIsCollapsed(true);
  };

  return (
    <div className="mb-4 bg-white/10 backdrop-blur rounded-xl p-4 text-white">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold">{t('profile_title')}</h3>
        {profile.onboarded && (
          <button onClick={() => setIsCollapsed(true)} className="text-white/60 text-xs hover:text-white">
            {t('profile_close')}
          </button>
        )}
      </div>

      {/* Step indicators */}
      <div className="flex gap-1 mb-4">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Step 0: Nationality + Residency */}
      {step === 0 && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-white/70 mb-1">{t('profile_nationality')}</label>
            <select
              value={profile.nationality}
              onChange={(e) => onUpdate({ nationality: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/20 text-white text-sm border border-white/20 focus:border-white/50 outline-none"
            >
              {NATIONALITIES.map((n) => (
                <option key={n.code} value={n.code} className="text-gray-900">{n.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/70 mb-1">{t('profile_residency')}</label>
            <div className="flex gap-2">
              {['resident', 'non_resident', 'citizen'].map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdate({ residency_status: status })}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    profile.residency_status === status
                      ? 'bg-white text-brand-dark'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {t(`profile_residency_${status}`)}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStep(1)} className="w-full py-2 bg-white text-brand-dark rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors">
            {t('profile_next')}
          </button>
        </div>
      )}

      {/* Step 1: Salary + Employer */}
      {step === 1 && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-white/70 mb-1">{t('profile_salary')}</label>
            <div className="grid grid-cols-2 gap-2">
              {SALARY_BANDS.map((band) => (
                <button
                  key={band.value}
                  onClick={() => onUpdate({ monthly_salary_aed: band.value })}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    profile.monthly_salary_aed === band.value
                      ? 'bg-white text-brand-dark'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {band.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/70 mb-1">{t('profile_employer')}</label>
            <select
              value={profile.employer_category || ''}
              onChange={(e) => onUpdate({ employer_category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/20 text-white text-sm border border-white/20 focus:border-white/50 outline-none"
            >
              <option value="" className="text-gray-900">Select...</option>
              {EMPLOYER_TYPES.map((e) => (
                <option key={e.value} value={e.value} className="text-gray-900">{e.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(0)} className="flex-1 py-2 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition-colors">
              {t('profile_back')}
            </button>
            <button onClick={() => setStep(2)} className="flex-1 py-2 bg-white text-brand-dark rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors">
              {t('profile_next')}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Transfer preferences */}
      {step === 2 && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-white/70 mb-1">{t('profile_frequency')}</label>
            <div className="flex gap-2">
              {['weekly', 'monthly', 'occasional'].map((freq) => (
                <button
                  key={freq}
                  onClick={() => onUpdate({ transfer_frequency: freq })}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    profile.transfer_frequency === freq
                      ? 'bg-white text-brand-dark'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {t(`profile_freq_${freq}`)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/70 mb-1">{t('profile_speed_pref')}</label>
            <div className="flex gap-2">
              {['fastest', 'cheapest', 'balanced'].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onUpdate({ preferred_speed: speed })}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    profile.preferred_speed === speed
                      ? 'bg-white text-brand-dark'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {t(`profile_speed_${speed}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="flex-1 py-2 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition-colors">
              {t('profile_back')}
            </button>
            <button onClick={handleFinish} className="flex-1 py-2 bg-white text-brand-dark rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors">
              {t('profile_done')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
