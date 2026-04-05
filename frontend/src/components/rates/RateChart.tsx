import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Skeleton from '@/components/ui/Skeleton';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

interface DataPoint {
  provider_name: string;
  exchange_rate: number;
  recorded_at: string;
}

interface Props {
  days?: number;
}

const PROVIDER_COLORS = ['#1ABC9C', '#5271FF', '#E74C3C', '#D97706', '#7C3AED', '#059669'];

export default function RateChart({ days = 7 }: Props) {
  const { t } = useTranslation('common');
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [selectedDays, setSelectedDays] = useState(days);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/rates/history?days=${selectedDays}`)
      .then((r) => r.json())
      .then((data) => {
        setPoints(data.points || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedDays]);

  if (loading) {
    return (
      <div className="card mt-4">
        <Skeleton height={200} width="100%" rounded="xl" />
      </div>
    );
  }

  if (points.length === 0) return null;

  // Transform data for Recharts: group by timestamp, providers as columns
  const providers = Array.from(new Set(points.map((p) => p.provider_name)));
  const timeMap = new Map<string, Record<string, number>>();

  for (const p of points) {
    const timeKey = new Date(p.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!timeMap.has(timeKey)) {
      timeMap.set(timeKey, { date: timeKey } as any);
    }
    const entry = timeMap.get(timeKey)!;
    entry[p.provider_name] = p.exchange_rate;
  }

  const chartData = Array.from(timeMap.values());

  return (
    <div className="card mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-heading-sm font-semibold text-gray-700">
          {t('rate_chart_title', { days: selectedDays })}
        </h3>
        <div className="flex gap-1 bg-surface-100 rounded-button p-0.5">
          {[7, 30].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDays(d)}
              className={`px-3 py-1.5 text-xs font-medium rounded-badge transition-all ${
                selectedDays === d
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={{ stroke: '#D1D5DB' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
            width={50}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: 12,
              zIndex: 100,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          {providers.map((name, idx) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={PROVIDER_COLORS[idx % PROVIDER_COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2 }}
              animationDuration={800}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
