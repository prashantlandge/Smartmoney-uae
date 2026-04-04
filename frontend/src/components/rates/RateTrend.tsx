import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

interface TrendData {
  current_avg_rate: number;
  change_percent: number;
  direction: string;
  summary: string;
}

export default function RateTrend() {
  const { t } = useTranslation('common');
  const [trend, setTrend] = useState<TrendData | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/rates/trend`)
      .then((r) => r.json())
      .then(setTrend)
      .catch(() => {});
  }, []);

  if (!trend || trend.current_avg_rate === 0) return null;

  const isUp = trend.direction === 'up';
  const isDown = trend.direction === 'down';
  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const bgColor = isUp ? 'bg-success-light' : isDown ? 'bg-error-light' : 'bg-surface-100';
  const textColor = isUp ? 'text-success' : isDown ? 'text-error' : 'text-gray-500';
  const iconBg = isUp ? 'bg-success/10' : isDown ? 'bg-error/10' : 'bg-gray-200';
  const trendKey = `rate_trend_${trend.direction}`;

  return (
    <div className={`flex items-center gap-3 px-5 py-3 rounded-card shadow-card ${bgColor}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className={textColor} />
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className={`text-lg font-bold ${textColor}`}>
            {Math.abs(trend.change_percent).toFixed(1)}%
          </span>
          <span className="text-xs font-medium text-gray-500">{t('rate_trend')}</span>
        </div>
        <span className="text-xs text-gray-400">
          {t(trendKey, { percent: Math.abs(trend.change_percent).toFixed(1) })}
        </span>
      </div>
      <div className="ms-auto text-end">
        <div className="text-caption text-gray-400">1 AED =</div>
        <div className="text-sm font-bold text-gray-700">{trend.current_avg_rate.toFixed(4)} INR</div>
      </div>
    </div>
  );
}
