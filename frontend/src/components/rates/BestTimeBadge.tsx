import { useState, useEffect } from 'react';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

interface BestTimePrediction {
  has_forecast: boolean;
  best_date?: string;
  predicted_rate?: number;
  recommendation: string;
}

export default function BestTimeBadge({ className = '' }: { className?: string }) {
  const [prediction, setPrediction] = useState<BestTimePrediction | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/forecast/best-time?send=AED&receive=INR`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setPrediction(data); })
      .catch(() => {});
  }, []);

  if (!prediction?.has_forecast) return null;

  const isWait = prediction.recommendation.toLowerCase().includes('wait');

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
      isWait
        ? 'bg-amber-50 text-amber-700 border border-amber-200'
        : 'bg-green-50 text-green-700 border border-green-200'
    } ${className}`}>
      {isWait ? <Clock size={14} /> : <TrendingUp size={14} />}
      <span>{prediction.recommendation}</span>
    </div>
  );
}
