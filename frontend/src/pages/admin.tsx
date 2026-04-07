import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import {
  BarChart3,
  MousePointerClick,
  CalendarClock,
  Users,
  Package,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

interface AdminStats {
  products: { category: string; count: number }[];
  clicks: { today: number; last_7_days: number; total: number };
  top_products: { name: string; category: string; clicks: number }[];
  daily_clicks: { date: string; clicks: number }[];
  last_scrape: {
    completed_at: string | null;
    total_upserted: number;
    total_errors: number;
  } | null;
  total_sessions: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStats(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalProducts = stats?.products.reduce((sum, p) => sum + p.count, 0) ?? 0;

  const formatDate = (iso: string | null) => {
    if (!iso) return 'Never';
    const d = new Date(iso);
    return d.toLocaleString('en-AE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard — SmartMoney UAE</title>
      </Head>

      {/* Minimal nav */}
      <nav className="bg-primary text-white py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading && !stats ? (
          <div className="text-center py-20 text-gray-400">
            <RefreshCw size={32} className="animate-spin mx-auto mb-3" />
            <p>Loading dashboard...</p>
          </div>
        ) : stats ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<Package size={22} className="text-primary" />}
                label="Total Products"
                value={totalProducts}
              />
              <StatCard
                icon={<MousePointerClick size={22} className="text-primary" />}
                label="Total Clicks"
                value={stats.clicks.total}
              />
              <StatCard
                icon={<CalendarClock size={22} className="text-primary" />}
                label="Today's Clicks"
                value={stats.clicks.today}
              />
              <StatCard
                icon={<Users size={22} className="text-primary" />}
                label="Total Sessions"
                value={stats.total_sessions}
              />
            </div>

            {/* Last Scrape status */}
            <div className="card mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Last Scrape Run
              </h2>
              {stats.last_scrape ? (
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Completed At</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(stats.last_scrape.completed_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Products Upserted</p>
                    <p className="font-semibold text-green-600 flex items-center gap-1">
                      <CheckCircle2 size={16} />
                      {stats.last_scrape.total_upserted}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Errors</p>
                    <p
                      className={`font-semibold flex items-center gap-1 ${
                        stats.last_scrape.total_errors > 0
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {stats.last_scrape.total_errors > 0 ? (
                        <AlertTriangle size={16} />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      {stats.last_scrape.total_errors}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No scrape runs recorded yet.</p>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Top Clicked Products */}
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Top Clicked Products
                </h2>
                {stats.top_products.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-2 text-gray-500 font-medium">#</th>
                          <th className="text-left py-2 text-gray-500 font-medium">Product</th>
                          <th className="text-left py-2 text-gray-500 font-medium">Category</th>
                          <th className="text-right py-2 text-gray-500 font-medium">Clicks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.top_products.map((p, i) => (
                          <tr key={i} className="border-b border-gray-50">
                            <td className="py-2 text-gray-400">{i + 1}</td>
                            <td className="py-2 font-medium text-gray-900">{p.name}</td>
                            <td className="py-2">
                              <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary text-xs rounded-full">
                                {p.category}
                              </span>
                            </td>
                            <td className="py-2 text-right font-semibold">{p.clicks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400">No affiliate clicks recorded yet.</p>
                )}
              </div>

              {/* Products by Category */}
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Products by Category
                </h2>
                {stats.products.length > 0 ? (
                  <div className="space-y-3">
                    {stats.products.map((p) => {
                      const pct = totalProducts > 0 ? (p.count / totalProducts) * 100 : 0;
                      return (
                        <div key={p.category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-900 capitalize">
                              {p.category}
                            </span>
                            <span className="text-gray-500">{p.count}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400">No products found.</p>
                )}
              </div>
            </div>

            {/* Daily clicks */}
            {stats.daily_clicks.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Daily Clicks (Last 7 Days)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 text-gray-500 font-medium">Date</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.daily_clicks.map((d) => (
                        <tr key={d.date} className="border-b border-gray-50">
                          <td className="py-2 text-gray-900">{d.date}</td>
                          <td className="py-2 text-right font-semibold">{d.clicks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : null}
      </main>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="card-hover text-center">
      <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <div className="text-2xl font-bold text-primary mb-0.5">
        {value.toLocaleString()}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
