import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, Sparkles, ChevronDown, Fuel, Gift, Plane, Crown, Percent, Building2, Shield, Moon, Heart, Car, Stethoscope, Baby, Users, Zap } from 'lucide-react';
import FlagIcon from '@/components/ui/FlagIcon';

interface SubItem {
  label: string;
  href: string;
  icon: typeof Fuel;
  desc: string;
}

interface NavItem {
  href: string;
  key: string;
  sub?: SubItem[];
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', key: 'nav_home' },
  {
    href: '/credit-cards', key: 'nav_credit_cards',
    sub: [
      { label: 'Best Cashback Cards', href: '/credit-cards?filter=cashback', icon: Percent, desc: 'Earn cashback on every purchase' },
      { label: 'Best Travel Cards', href: '/credit-cards?filter=travel', icon: Plane, desc: 'Miles, lounge access & travel perks' },
      { label: 'Best Rewards Cards', href: '/credit-cards?filter=rewards', icon: Gift, desc: 'Top reward points & benefits' },
      { label: 'Fuel Saving Cards', href: '/credit-cards?filter=fuel', icon: Fuel, desc: 'Save on petrol & diesel spends' },
      { label: 'Premium Cards', href: '/credit-cards?filter=premium', icon: Crown, desc: 'Exclusive lifestyle & concierge' },
      { label: 'Islamic Credit Cards', href: '/credit-cards?filter=islamic', icon: Moon, desc: 'Shariah-compliant credit cards' },
    ],
  },
  {
    href: '/personal-loans', key: 'nav_personal_loans',
    sub: [
      { label: 'Lowest Interest Rate', href: '/personal-loans?filter=low-rate', icon: Percent, desc: 'Best rates from UAE banks' },
      { label: 'No Salary Transfer', href: '/personal-loans?filter=no-transfer', icon: Zap, desc: 'No salary transfer required' },
      { label: 'Quick Approval', href: '/personal-loans?filter=quick', icon: Zap, desc: 'Same-day disbursement' },
      { label: 'Islamic Personal Finance', href: '/personal-loans?filter=islamic', icon: Moon, desc: 'Shariah-compliant financing' },
    ],
  },
  {
    href: '/islamic-finance', key: 'nav_islamic_finance',
    sub: [
      { label: 'Islamic Personal Finance', href: '/islamic-finance?filter=personal', icon: Building2, desc: 'Murabaha & Ijarah products' },
      { label: 'Islamic Credit Cards', href: '/islamic-finance?filter=cards', icon: Shield, desc: 'Halal credit card options' },
      { label: 'Islamic Home Finance', href: '/islamic-finance?filter=home', icon: Building2, desc: 'Shariah-compliant mortgages' },
    ],
  },
  {
    href: '/car-insurance', key: 'nav_car_insurance',
    sub: [
      { label: 'Comprehensive Cover', href: '/car-insurance?filter=comprehensive', icon: Shield, desc: 'Full protection for your vehicle' },
      { label: 'Third Party Insurance', href: '/car-insurance?filter=third-party', icon: Car, desc: 'Budget-friendly basic cover' },
      { label: 'Takaful Car Insurance', href: '/car-insurance?filter=takaful', icon: Moon, desc: 'Islamic motor insurance' },
    ],
  },
  {
    href: '/health-insurance', key: 'nav_health_insurance',
    sub: [
      { label: 'Individual Plans', href: '/health-insurance?filter=individual', icon: Stethoscope, desc: 'Cover for single members' },
      { label: 'Family Plans', href: '/health-insurance?filter=family', icon: Users, desc: 'Protect your whole family' },
      { label: 'Maternity Cover', href: '/health-insurance?filter=maternity', icon: Baby, desc: 'Pregnancy & newborn coverage' },
      { label: 'DHA Compliant', href: '/health-insurance?filter=dha', icon: Shield, desc: 'Dubai Health Authority approved' },
    ],
  },
];

export default function Header() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>();

  const switchLocale = () => {
    const newLocale = router.locale === 'ar' ? 'en' : 'ar';
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  const handleMouseEnter = (key: string) => {
    clearTimeout(dropdownTimeout.current);
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [router.asPath]);

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

            {/* Desktop Nav with dropdowns */}
            <nav className="hidden lg:flex items-center gap-0.5 h-14">
              {NAV_ITEMS.map((item) => {
                const isActive = router.pathname === item.href;
                const hasSub = item.sub && item.sub.length > 0;
                const isDropdownOpen = openDropdown === item.key;

                return (
                  <div
                    key={item.key}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => hasSub && handleMouseEnter(item.key)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {t(item.key)}
                      {hasSub && <ChevronDown size={12} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />}
                    </Link>

                    {/* Dropdown mega menu */}
                    {hasSub && isDropdownOpen && (
                      <div
                        className="absolute top-full left-0 mt-0 pt-1"
                        onMouseEnter={() => handleMouseEnter(item.key)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="bg-white rounded-card shadow-elevated border border-surface-200 py-2 min-w-[280px] animate-fade-in">
                          {/* View All link */}
                          <Link
                            href={item.href}
                            className="flex items-center justify-between px-4 py-2 text-sm font-bold text-brand-nav hover:bg-surface-50 transition-colors border-b border-surface-100 mb-1"
                          >
                            View All {t(item.key)}
                            <span className="text-xs text-gray-400">&rarr;</span>
                          </Link>
                          {item.sub!.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="flex items-start gap-3 px-4 py-2.5 hover:bg-surface-50 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-button bg-surface-100 flex items-center justify-center shrink-0 group-hover:bg-brand-primary/10 transition-colors">
                                <sub.icon size={15} className="text-gray-500 group-hover:text-brand-primary transition-colors" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-brand-dark group-hover:text-brand-primary transition-colors">{sub.label}</p>
                                <p className="text-label text-gray-400">{sub.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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

      {/* Mobile Nav with expandable sub-menus */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-surface-200 shadow-card animate-fade-in max-h-[80vh] overflow-y-auto">
          <Link
            href="/recommend"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 mx-4 mt-3 mb-2 px-3 py-2.5 rounded text-sm font-bold bg-brand-nav text-white"
          >
            <Sparkles size={14} />
            AI Recommend
          </Link>
          <div className="px-2 pb-3">
            {NAV_ITEMS.map((item) => {
              const isActive = router.pathname === item.href;
              const hasSub = item.sub && item.sub.length > 0;
              const isExpanded = mobileExpanded === item.key;

              return (
                <div key={item.key}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex-1 px-3 py-2.5 rounded-l text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-primary-50 text-brand-primary'
                          : 'text-gray-600 hover:bg-surface-50'
                      }`}
                    >
                      {t(item.key)}
                    </Link>
                    {hasSub && (
                      <button
                        onClick={() => setMobileExpanded(isExpanded ? null : item.key)}
                        className="px-3 py-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={`Expand ${t(item.key)}`}
                      >
                        <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  {hasSub && isExpanded && (
                    <div className="ml-4 mb-2 border-l-2 border-surface-200 pl-3 space-y-0.5 animate-fade-in">
                      {item.sub!.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2.5 px-2 py-2 rounded text-sm text-gray-500 hover:text-brand-primary hover:bg-surface-50 transition-colors"
                        >
                          <sub.icon size={14} className="text-gray-400 shrink-0" />
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
