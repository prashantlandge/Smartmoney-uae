import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

  const color = trend.direction === 'up' ? 'text-green-600' : trend.direction === 'down' ? 'text-red-500' : 'text-gray-500';
  const arrow = trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→';
  const trendKey = `rate_trend_${trend.direction}`;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
      <span className="text-xs font-medium text-gray-500">{t('rate_trend')}:</span>
      <span className={`text-sm font-bold ${color}`}>
        {arrow} {Math.abs(trend.change_percent).toFixed(1)}%
      </span>
      <span className="text-xs text-gray-400">
        {t(trendKey, { percent: Math.abs(trend.change_percent).toFixed(1) })}
      </span>
    </div>
  );
}
