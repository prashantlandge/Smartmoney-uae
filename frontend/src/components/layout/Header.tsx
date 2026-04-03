import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import HeroSearch from '@/components/search/HeroSearch';

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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
            <span className="font-bold text-brand-dark text-lg hidden sm:block">
              SmartMoney<span className="text-brand-primary"> UAE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : 'text-gray-600 hover:text-brand-primary hover:bg-gray-50'
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Header Search (desktop) */}
          <div className="hidden lg:block flex-1 max-w-xs mx-4">
            <HeroSearch compact />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={switchLocale}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {router.locale === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-brand-primary"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lg:hidden pb-4 border-t border-gray-100 pt-2">
            <div className="px-3 py-2">
              <HeroSearch compact />
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
