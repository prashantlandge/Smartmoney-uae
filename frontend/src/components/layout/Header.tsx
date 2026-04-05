import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Menu, X, Sparkles, Search } from 'lucide-react';
import HeroSearch from '@/components/search/HeroSearch';
import FlagIcon from '@/components/ui/FlagIcon';

const NAV_ITEMS = [
  { href: '/', key: 'nav_home' },
  { href: '/credit-cards', key: 'nav_credit_cards' },
  { href: '/personal-loans', key: 'nav_personal_loans' },
  { href: '/islamic-finance', key: 'nav_islamic_finance' },
  { href: '/car-insurance', key: 'nav_car_insurance' },
  { href: '/health-insurance', key: 'nav_health_insurance' },
];

export default function Header() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const switchLocale = () => {
    const newLocale = router.locale === 'ar' ? 'en' : 'ar';
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Main nav bar — blue */}
      <div className="bg-brand-nav shadow-nav">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-brand-nav font-bold text-sm">SM</span>
              </div>
              <span className="font-bold text-white text-base hidden sm:block">
                SmartMoney UAE
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <Link
                href="/recommend"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-brand-nav rounded hover:bg-white/90 transition-colors"
              >
                <Sparkles size={12} />
                AI Recommend
              </Link>
              <button
                onClick={switchLocale}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors"
              >
                <FlagIcon code="ae" size={14} />
                {router.locale === 'ar' ? 'EN' : 'عربي'}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-1.5 text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary bar — search (desktop, hidden on homepage since hero has search) */}
      {router.pathname !== '/' && (
        <div className="hidden lg:block bg-white border-b border-surface-200">
          <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-2">
            <div className="max-w-md">
              <HeroSearch compact />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-surface-200 shadow-card animate-fade-in">
          <div className="px-4 py-3">
            <HeroSearch compact />
          </div>
          <Link
            href="/recommend"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 mx-4 mb-2 px-3 py-2.5 rounded text-sm font-bold bg-brand-nav text-white"
          >
            <Sparkles size={14} />
            AI Recommend
          </Link>
          <div className="space-y-0.5 px-2 pb-3">
            {NAV_ITEMS.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-primary-50 text-brand-primary'
                      : 'text-gray-600 hover:bg-surface-50'
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
