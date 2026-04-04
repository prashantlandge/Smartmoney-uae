import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { getSessionId } from '@/lib/session';
import { Bell, Check } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

interface Props {
  currentRate?: number;
}

export default function RateAlertForm({ currentRate }: Props) {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [targetRate, setTargetRate] = useState(currentRate ? (currentRate + 0.1).toFixed(4) : '');
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/api/rates/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: getSessionId(),
          email,
          target_rate: parseFloat(targetRate),
          direction: 'above',
        }),
      });
      setSubmitted(true);
    } catch {
      // Silently fail
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mt-3 py-2.5 px-4 bg-brand-primary-50 text-brand-primary text-sm font-medium rounded-button hover:bg-brand-primary-100 transition-colors flex items-center justify-center gap-2"
      >
        <Bell size={16} />
        {t('rate_alert_title')}
      </button>
    );
  }

  if (submitted) {
    return (
      <div className="mt-3 p-3 bg-success-light border border-emerald-200 rounded-card text-center flex items-center justify-center gap-2">
        <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
          <Check size={12} className="text-white" />
        </div>
        <p className="text-sm text-success-dark">{t('rate_alert_success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-4 bg-surface-50 rounded-card border border-surface-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-1">{t('rate_alert_title')}</h4>
      <p className="text-xs text-gray-500 mb-3">{t('rate_alert_desc')}</p>

      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">{t('rate_alert_target')}</label>
          <input
            type="number"
            step="0.0001"
            value={targetRate}
            onChange={(e) => setTargetRate(e.target.value)}
            className="input-field text-sm py-2"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">{t('rate_alert_email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="input-field text-sm py-2"
            required
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex-1 py-2 text-xs text-gray-500 hover:text-gray-700 rounded-button hover:bg-surface-100 transition-colors"
        >
          Cancel
        </button>
        <button type="submit" className="flex-1 btn-primary text-xs py-2">
          {t('rate_alert_submit')}
        </button>
      </div>
    </form>
  );
}
