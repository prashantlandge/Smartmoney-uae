import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowLeft,
  FileText,
  Globe,
} from 'lucide-react';

interface ProviderHealth {
  name: string;
  type: string;
  status: 'healthy' | 'degraded' | 'failing';
  product_count: number;
  last_updated: string | null;
  alerts: Record<string, number>;
}

interface HealthSummary {
  providers: ProviderHealth[];
  total_providers: number;
  healthy: number;
  degraded: number;
  failing: number;
}

interface Alert {
  id: string;
  alert_type: string;
  severity: string;
  provider_name: string;
  message: string;
  created_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export default function ScraperHealthPage() {
  const [health, setHealth] = useState<HealthSummary | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState<'html' | 'pdf' | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const [healthRes, alertsRes] = await Promise.all([
        fetch(`${API_BASE}/api/scrapers/health`),
        fetch(`${API_BASE}/api/scrapers/alerts`),
      ]);
      if (healthRes.ok) setHealth(await healthRes.json());
      if (alertsRes.ok) setAlerts(await alertsRes.json());
    } catch (err) {
      console.error('Failed to fetch health data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const triggerScrape = async (type: 'html' | 'pdf') => {
    setScraping(type);
    try {
      const endpoint = type === 'pdf' ? '/api/scrapers/run-pdf' : '/api/scrapers/run';
      await fetch(`${API_BASE}${endpoint}`, { method: 'POST' });
      await fetchHealth();
    } catch (err) {
      console.error(`${type} scrape failed:`, err);
    } finally {
      setScraping(null);
    }
  };

  const acknowledgeAlert = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/scrapers/alerts/${id}/acknowledge`, {
        method: 'POST',
      });
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'failing':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'degraded':
        return 'bg-yellow-50 border-yellow-200';
      case 'failing':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case 'bank':
        return 'Bank';
      case 'exchange_house':
        return 'Exchange';
      case 'insurance':
        return 'Insurance';
      case 'fintech':
        return 'Fintech';
      default:
        return type;
    }
  };

  return (
    <>
      <Head>
        <title>Scraper Health | SmartMoney UAE Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="p-2 rounded-lg hover:bg-gray-200 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Scraper Health Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Monitor all 28 provider scrapers
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => triggerScrape('html')}
                disabled={scraping !== null}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                <Globe className="w-4 h-4" />
                {scraping === 'html' ? 'Scraping...' : 'Run HTML Scrape'}
              </button>
              <button
                onClick={() => triggerScrape('pdf')}
                disabled={scraping !== null}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
              >
                <FileText className="w-4 h-4" />
                {scraping === 'pdf' ? 'Scraping...' : 'Run PDF Scrape'}
              </button>
              <button
                onClick={fetchHealth}
                disabled={loading}
                className="p-2 rounded-lg border hover:bg-gray-100 transition"
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          {health && (
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl border p-4">
                <p className="text-sm text-gray-500">Total Providers</p>
                <p className="text-3xl font-bold">{health.total_providers}</p>
              </div>
              <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                <p className="text-sm text-green-600">Healthy</p>
                <p className="text-3xl font-bold text-green-700">
                  {health.healthy}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
                <p className="text-sm text-yellow-600">Degraded</p>
                <p className="text-3xl font-bold text-yellow-700">
                  {health.degraded}
                </p>
              </div>
              <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                <p className="text-sm text-red-600">Failing</p>
                <p className="text-3xl font-bold text-red-700">
                  {health.failing}
                </p>
              </div>
            </div>
          )}

          {/* Provider Grid */}
          <h2 className="text-lg font-semibold mb-4">Provider Status</h2>
          {loading && !health ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {health?.providers.map((provider) => (
                <div
                  key={provider.name}
                  className={`rounded-xl border p-4 ${statusColor(provider.status)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 truncate">
                      {provider.name}
                    </span>
                    {statusIcon(provider.status)}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600">
                      {typeLabel(provider.type)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {provider.product_count} products
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {provider.last_updated
                      ? `Updated: ${new Date(provider.last_updated).toLocaleDateString()}`
                      : 'No data yet'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Alert Feed */}
          <h2 className="text-lg font-semibold mb-4">
            Active Alerts ({alerts.length})
          </h2>
          {alerts.length === 0 ? (
            <div className="bg-white rounded-xl border p-6 text-center text-gray-400">
              No active alerts
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white rounded-xl border p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${severityColor(alert.severity)}`}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {alert.provider_name}
                      </p>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                      <p className="text-xs text-gray-400">
                        {alert.created_at
                          ? new Date(alert.created_at).toLocaleString()
                          : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition"
                  >
                    Acknowledge
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
