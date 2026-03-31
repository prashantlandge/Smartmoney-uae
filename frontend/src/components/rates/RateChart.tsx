import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

interface DataPoint {
  provider_name: string;
  exchange_rate: number;
  recorded_at: string;
}

interface Props {
  days?: number;
}

export default function RateChart({ days = 7 }: Props) {
  const { t } = useTranslation('common');
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [selectedDays, setSelectedDays] = useState(days);

  useEffect(() => {
    fetch(`${API_BASE}/api/rates/history?days=${selectedDays}`)
      .then((r) => r.json())
      .then((data) => setPoints(data.points || []))
      .catch(() => {});
  }, [selectedDays]);

  if (points.length === 0) {
    return null;
  }

  // Group by provider
  const providers = new Map<string, { rates: number[]; times: string[] }>();
  for (const p of points) {
    if (!providers.has(p.provider_name)) {
      providers.set(p.provider_name, { rates: [], times: [] });
    }
    const entry = providers.get(p.provider_name)!;
    entry.rates.push(p.exchange_rate);
    entry.times.push(p.recorded_at);
  }

  // Calculate chart bounds
  const allRates = points.map((p) => p.exchange_rate);
  const minRate = Math.min(...allRates);
  const maxRate = Math.max(...allRates);
  const range = maxRate - minRate || 0.01;

  const CHART_W = 600;
  const CHART_H = 200;
  const PADDING = 30;

  const providerColors = ['#00805E', '#C8102E', '#2563EB', '#D97706', '#7C3AED', '#059669'];
  const providerEntries = Array.from(providers.entries());

  return (
    <div className="card mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          {t('rate_chart_title', { days: selectedDays })}
        </h3>
        <div className="flex gap-1">
          {[7, 30].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDays(d)}
              className={`px-2 py-1 text-xs rounded ${
                selectedDays === d
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H + 40}`} className="w-full" style={{ minWidth: 300 }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = PADDING + (1 - frac) * CHART_H;
            const val = minRate + frac * range;
            return (
              <g key={frac}>
                <line x1={PADDING} y1={y} x2={CHART_W - 10} y2={y} stroke="#E5E7EB" strokeWidth={1} />
                <text x={2} y={y + 4} fontSize={9} fill="#9CA3AF">{val.toFixed(2)}</text>
              </g>
            );
          })}

          {/* Provider lines */}
          {providerEntries.map(([name, data], colorIdx) => {
            if (data.rates.length < 2) return null;
            const color = providerColors[colorIdx % providerColors.length];
            const pathPoints = data.rates.map((rate, i) => {
              const x = PADDING + (i / (data.rates.length - 1)) * (CHART_W - PADDING - 10);
              const y = PADDING + ((maxRate - rate) / range) * CHART_H;
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            });
            return (
              <path key={name} d={pathPoints.join(' ')} fill="none" stroke={color} strokeWidth={2} />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-2">
        {providerEntries.map(([name], colorIdx) => (
          <div key={name} className="flex items-center gap-1">
            <div
              className="w-3 h-1 rounded-full"
              style={{ backgroundColor: providerColors[colorIdx % providerColors.length] }}
            />
            <span className="text-[10px] text-gray-500">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
