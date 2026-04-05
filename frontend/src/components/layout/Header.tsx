import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = () => {
    const newLocale = router.locale === 'ar' ? 'en' : 'ar';
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-200 ${
      scrolled
        ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'
        : 'bg-white border-b border-gray-200'
    }`}>
      <div className="max-w-content-xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-primary to-brand-primary-700 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
            <span className="font-bold text-brand-dark text-lg hidden sm:block tracking-tight">
              SmartMoney<span className="text-brand-primary"> UAE</span>
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
                  className={`relative px-3 py-2 rounded-button text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-primary'
                      : 'text-gray-600 hover:text-brand-primary hover:bg-surface-50'
                  }`}
                >
                  {t(item.key)}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-3 h-0.5 bg-brand-primary rounded-full" />
                  )}
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
            <Link
              href="/recommend"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-brand-primary text-white rounded-button hover:bg-brand-primary-600 transition-colors shadow-sm"
            >
              <Sparkles size={12} />
              Smart Recommend
            </Link>
            <button
              onClick={switchLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-button hover:bg-surface-50 transition-colors"
            >
              <FlagIcon code={router.locale === 'ar' ? 'ae' : 'ae'} size={14} />
              {router.locale === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-brand-primary rounded-button hover:bg-surface-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lg:hidden pb-4 border-t border-gray-100 pt-3 animate-fade-in">
            <div className="px-1 py-2">
              <HeroSearch compact />
            </div>
            <Link
              href="/recommend"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 mx-1 mt-2 px-3 py-2.5 rounded-button text-sm font-bold bg-brand-primary text-white"
            >
              <Sparkles size={14} />
              Smart Recommend
            </Link>
            <div className="mt-2 space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 rounded-button text-sm font-medium transition-colors ${
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
          </nav>
        )}
      </div>
    </header>
  );
}
