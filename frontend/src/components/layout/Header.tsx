import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState, useRef, useEffect } from 'react';
import {
  Menu, X, Sparkles, ChevronDown,
  Fuel, Gift, Plane, Crown, Percent, Building2, Shield, Moon, Car, Stethoscope,
  Baby, Users, Zap, Calculator, TrendingUp, Receipt, CheckCircle,
  CreditCard, Landmark, HeartPulse, ArrowLeftRight,
  BarChart3, PiggyBank, FileText, Scale, Briefcase,
} from 'lucide-react';
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
  megaCols?: number; // how many columns in mega menu
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', key: 'nav_home' },
  {
    href: '/credit-cards', key: 'nav_credit_cards', megaCols: 3,
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
    href: '/personal-loans', key: 'nav_personal_loans', megaCols: 2,
    sub: [
      { label: 'Lowest Interest Rate', href: '/personal-loans?filter=low-rate', icon: Percent, desc: 'Best rates from UAE banks' },
      { label: 'No Salary Transfer', href: '/personal-loans?filter=no-transfer', icon: Zap, desc: 'No salary transfer required' },
      { label: 'Quick Approval', href: '/personal-loans?filter=quick', icon: Zap, desc: 'Same-day disbursement' },
      { label: 'Islamic Personal Finance', href: '/personal-loans?filter=islamic', icon: Moon, desc: 'Shariah-compliant financing' },
    ],
  },
  {
    href: '/islamic-finance', key: 'nav_islamic_finance', megaCols: 2,
    sub: [
      { label: 'Islamic Personal Finance', href: '/islamic-finance?filter=personal', icon: Building2, desc: 'Murabaha & Ijarah products' },
      { label: 'Islamic Credit Cards', href: '/islamic-finance?filter=cards', icon: Shield, desc: 'Halal credit card options' },
      { label: 'Islamic Home Finance', href: '/islamic-finance?filter=home', icon: Building2, desc: 'Shariah-compliant mortgages' },
    ],
  },
  {
    href: '/car-insurance', key: 'nav_car_insurance', megaCols: 2,
    sub: [
      { label: 'Comprehensive Cover', href: '/car-insurance?filter=comprehensive', icon: Shield, desc: 'Full protection for your vehicle' },
      { label: 'Third Party Insurance', href: '/car-insurance?filter=third-party', icon: Car, desc: 'Budget-friendly basic cover' },
      { label: 'Takaful Car Insurance', href: '/car-insurance?filter=takaful', icon: Moon, desc: 'Islamic motor insurance' },
    ],
  },
  {
    href: '/health-insurance', key: 'nav_health_insurance', megaCols: 2,
    sub: [
      { label: 'Individual Plans', href: '/health-insurance?filter=individual', icon: Stethoscope, desc: 'Cover for single members' },
      { label: 'Family Plans', href: '/health-insurance?filter=family', icon: Users, desc: 'Protect your whole family' },
      { label: 'Maternity Cover', href: '/health-insurance?filter=maternity', icon: Baby, desc: 'Pregnancy & newborn coverage' },
      { label: 'DHA Compliant', href: '/health-insurance?filter=dha', icon: Shield, desc: 'Dubai Health Authority approved' },
    ],
  },
  {
    href: '/calculators', key: 'nav_calculators', megaCols: 4,
    sub: [
      { label: 'EMI Calculator', href: '/calculators#emi', icon: Calculator, desc: 'Calculate your EMI instantly' },
      { label: 'Cashback Calculator', href: '/calculators#cashback', icon: Percent, desc: 'Compare card cashback returns' },
      { label: 'Car Insurance Estimator', href: '/calculators#car-insurance', icon: Car, desc: 'Estimate your car premium' },
      { label: 'Health Insurance Estimator', href: '/calculators#health-insurance', icon: HeartPulse, desc: 'Estimate health plan costs' },
      { label: 'Loan Eligibility', href: '/calculators#eligibility', icon: CheckCircle, desc: 'Check what you qualify for' },
      { label: 'Remittance Calculator', href: '/', icon: ArrowLeftRight, desc: 'Best exchange rates comparison' },
      { label: 'Savings Calculator', href: '/calculators#savings', icon: PiggyBank, desc: 'Plan your savings goals' },
      { label: 'Fuel Cost Calculator', href: '/calculators#fuel', icon: Fuel, desc: 'Plan your fuel expenses' },
    ],
  },
  {
    href: '/tax', key: 'nav_tax', megaCols: 2,
    sub: [
      { label: 'VAT Calculator', href: '/tax#vat', icon: Receipt, desc: 'Calculate UAE 5% VAT' },
      { label: 'Corporate Tax Calculator', href: '/tax#corporate', icon: Briefcase, desc: 'New 9% corporate tax estimator' },
      { label: 'Tax Residency Checker', href: '/tax#residency', icon: FileText, desc: 'Check your UAE tax status' },
      { label: 'Tax Guides', href: '/tax#guides', icon: Scale, desc: 'UAE tax rules explained' },
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
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 200);
  };

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [router.asPath]);

  return (
    <header className="sticky top-0 z-40">
      {/* Top bar — thin accent strip */}
      <div className="bg-brand-dark text-white/70 text-label hidden sm:block">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 flex items-center justify-between h-7">
          <span>UAE&apos;s Smartest Financial Comparison Platform</span>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="bg-brand-nav shadow-nav">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/images/logo-white.svg"
                alt="SmartMoney UAE"
                width={160}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0 h-14">
              {NAV_ITEMS.map((item) => {
                const isActive = router.pathname === item.href || (item.href !== '/' && router.pathname.startsWith(item.href));
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

                    {/* RupeeLens-style mega dropdown */}
                    {hasSub && isDropdownOpen && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-1"
                        onMouseEnter={() => handleMouseEnter(item.key)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="bg-white rounded-lg shadow-elevated border border-surface-200 animate-fade-in overflow-hidden"
                          style={{ minWidth: item.megaCols === 4 ? '640px' : item.megaCols === 3 ? '520px' : '380px' }}
                        >
                          {/* Header */}
                          <div className="px-5 py-3 border-b border-surface-100 bg-surface-50">
                            <Link
                              href={item.href}
                              className="flex items-center justify-between text-sm font-bold text-brand-nav hover:text-brand-nav-dark transition-colors"
                            >
                              {t(item.key)}
                              <span className="text-xs font-normal text-gray-400">View All &rarr;</span>
                            </Link>
                          </div>

                          {/* Grid of items */}
                          <div className={`p-4 grid gap-1 ${
                            item.megaCols === 4 ? 'grid-cols-2 sm:grid-cols-4' :
                            item.megaCols === 3 ? 'grid-cols-3' :
                            'grid-cols-2'
                          }`}>
                            {item.sub!.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-surface-50 transition-colors group"
                              >
                                <div className="w-9 h-9 rounded-lg bg-brand-nav/5 flex items-center justify-center shrink-0 group-hover:bg-brand-nav/10 transition-colors">
                                  <sub.icon size={16} className="text-brand-nav group-hover:text-brand-nav-dark transition-colors" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-brand-dark group-hover:text-brand-nav transition-colors leading-tight">{sub.label}</p>
                                  <p className="text-label text-gray-400 leading-tight mt-0.5">{sub.desc}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
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
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-brand-primary text-white rounded-button hover:bg-brand-primary-600 transition-colors shadow-sm"
              >
                <Sparkles size={12} />
                Smart Compare
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

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-surface-200 shadow-card animate-fade-in max-h-[80vh] overflow-y-auto">
          <Link
            href="/recommend"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 mx-4 mt-3 mb-2 px-3 py-2.5 rounded-button text-sm font-bold bg-brand-primary text-white"
          >
            <Sparkles size={14} />
            Smart Compare
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
                          ? 'bg-brand-nav/5 text-brand-nav'
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
                          className="flex items-center gap-2.5 px-2 py-2 rounded text-sm text-gray-500 hover:text-brand-nav hover:bg-surface-50 transition-colors"
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
