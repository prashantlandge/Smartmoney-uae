import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState, useRef, useEffect } from 'react';
import {
  Menu, X, Sparkles, ChevronDown, ChevronRight, ArrowRight,
  ArrowLeftRight, CreditCard, Wallet, Shield, Car, HeartPulse,
  Calculator, Receipt,
  Fuel, Gift, Plane, Crown, Percent, Building2, Moon,
  Stethoscope, Baby, Users, Zap, CheckCircle, PiggyBank,
  FileText, Scale, Briefcase, Home, Landmark,
} from 'lucide-react';
import FlagIcon from '@/components/ui/FlagIcon';

/* ─── Types ─── */
interface SubItem {
  label: string;
  href: string;
  icon: typeof Fuel;
  desc: string;
}

interface NavItem {
  href: string;
  key: string;
  icon: typeof CreditCard;
  sub?: SubItem[];
}

/* ─── Consolidated nav: 5 items ─── */
const NAV_ITEMS: NavItem[] = [
  { href: '/', key: 'nav_home', icon: ArrowLeftRight },
  {
    href: '/credit-cards', key: 'nav_credit_cards', icon: CreditCard,
    sub: [
      { label: 'Cashback Cards', href: '/credit-cards?filter=cashback', icon: Percent, desc: 'Earn cashback on every purchase' },
      { label: 'Travel & Miles Cards', href: '/credit-cards?filter=travel', icon: Plane, desc: 'Airline miles & lounge access' },
      { label: 'Rewards Cards', href: '/credit-cards?filter=rewards', icon: Gift, desc: 'Best reward points & benefits' },
      { label: 'Fuel Saving Cards', href: '/credit-cards?filter=fuel', icon: Fuel, desc: 'Save on petrol spends' },
      { label: 'Premium Cards', href: '/credit-cards?filter=premium', icon: Crown, desc: 'Lifestyle & concierge perks' },
      { label: 'Islamic Cards', href: '/credit-cards?filter=islamic', icon: Moon, desc: 'Shariah-compliant cards' },
    ],
  },
  {
    href: '/personal-loans', key: 'nav_loans', icon: Wallet,
    sub: [
      { label: 'Personal Loans', href: '/personal-loans', icon: Wallet, desc: 'Compare best rates from UAE banks' },
      { label: 'Home Loans', href: '/personal-loans?filter=home', icon: Home, desc: 'Mortgage & home finance options' },
      { label: 'Islamic Finance', href: '/islamic-finance', icon: Landmark, desc: 'Murabaha, Ijarah & more' },
      { label: 'Quick Approval', href: '/personal-loans?filter=quick', icon: Zap, desc: 'Same-day disbursement' },
      { label: 'No Salary Transfer', href: '/personal-loans?filter=no-transfer', icon: CheckCircle, desc: 'No salary transfer needed' },
    ],
  },
  {
    href: '/car-insurance', key: 'nav_insurance', icon: Shield,
    sub: [
      { label: 'Car Insurance', href: '/car-insurance', icon: Car, desc: 'Comprehensive & third party' },
      { label: 'Health Insurance', href: '/health-insurance', icon: HeartPulse, desc: 'Individual & family plans' },
      { label: 'Takaful Insurance', href: '/car-insurance?filter=takaful', icon: Moon, desc: 'Islamic insurance plans' },
      { label: 'Family Health Plans', href: '/health-insurance?filter=family', icon: Users, desc: 'Cover your whole family' },
      { label: 'DHA Compliant', href: '/health-insurance?filter=dha', icon: Stethoscope, desc: 'Dubai approved plans' },
    ],
  },
  {
    href: '/calculators', key: 'nav_tools', icon: Calculator,
    sub: [
      { label: 'EMI Calculator', href: '/calculators#emi', icon: Calculator, desc: 'Calculate loan EMI instantly' },
      { label: 'Cashback Calculator', href: '/calculators#cashback', icon: Percent, desc: 'Compare card cashback returns' },
      { label: 'Savings Calculator', href: '/calculators#savings', icon: PiggyBank, desc: 'Plan your savings goals' },
      { label: 'Fuel Cost Calculator', href: '/calculators#fuel', icon: Fuel, desc: 'Monthly fuel expense planner' },
      { label: 'Eligibility Checker', href: '/calculators#eligibility', icon: CheckCircle, desc: 'Check what you qualify for' },
      { label: 'VAT Calculator', href: '/tax#vat', icon: Receipt, desc: 'UAE 5% VAT calculator' },
      { label: 'Corporate Tax', href: '/tax#corporate', icon: Briefcase, desc: '9% corporate tax estimator' },
      { label: 'Tax Residency', href: '/tax#residency', icon: FileText, desc: 'Check your UAE tax status' },
    ],
  },
];

export default function Header() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>();

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const LANGUAGES = [
    { code: 'en', label: 'EN', flag: 'gb' },
    { code: 'ar', label: 'عربي', flag: 'ae' },
    { code: 'hi', label: 'हिंदी', flag: 'in' },
  ] as const;

  const switchLocale = (locale: string) => {
    setLangOpen(false);
    router.push(router.pathname, router.asPath, { locale });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (key: string) => {
    clearTimeout(dropdownTimeout.current);
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
    setMobileExpanded(null);
    setLangOpen(false);
  }, [router.asPath]);

  return (
    <header className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-nav' : ''}`}>
      {/* ── Top bar ── */}
      <div className="border-b border-gray-100 bg-gray-50/80">
        <div className="max-w-content-xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-8">
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-label text-gray-500 hover:text-primary transition-colors">
              {t('nav_about')}
            </Link>
            <Link href="/contact" className="text-label text-gray-500 hover:text-primary transition-colors">
              {t('nav_contact')}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-2 py-1 text-label font-medium text-gray-500 hover:text-primary rounded hover:bg-gray-100 transition-colors"
              >
                <FlagIcon code={LANGUAGES.find(l => l.code === router.locale)?.flag || 'gb'} size={14} />
                {LANGUAGES.find(l => l.code === router.locale)?.label || 'EN'}
                <ChevronDown size={10} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute end-0 top-full mt-1 bg-white rounded-lg shadow-elevated border border-gray-200 overflow-hidden animate-fade-in z-50 min-w-[120px]">
                  {LANGUAGES.filter(l => l.code !== router.locale).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLocale(lang.code)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-body-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      <FlagIcon code={lang.flag} size={14} />
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main nav ── */}
      <div className="border-b border-gray-100">
        <div className="max-w-content-xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/logo.svg"
              alt="SmartMoney UAE"
              width={160}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 h-full">
            {NAV_ITEMS.map((item) => {
              const isActive = router.pathname === item.href || (item.href !== '/' && router.pathname.startsWith(item.href));
              const hasSub = item.sub && item.sub.length > 0;
              const isOpen = openDropdown === item.key;
              const Icon = item.icon;

              return (
                <div
                  key={item.key}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => hasSub && handleMouseEnter(item.key)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 xl:px-4 h-full text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <Icon size={16} strokeWidth={2} />
                    {t(item.key)}
                    {hasSub && <ChevronDown size={11} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
                  </Link>

                  {/* Dropdown */}
                  {hasSub && isOpen && (
                    <div
                      className="absolute top-full left-0 pt-1 z-50"
                      onMouseEnter={() => handleMouseEnter(item.key)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="bg-white rounded-card shadow-elevated border border-gray-100 overflow-hidden animate-fade-in w-72">
                        <Link
                          href={item.href}
                          className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-body-sm font-bold text-primary hover:text-primary-600 transition-colors"
                        >
                          {t('view_all')} {t(item.key)}
                          <ArrowRight size={13} />
                        </Link>

                        <div className="py-1">
                          {item.sub!.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                                <sub.icon size={14} className="text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-body-sm font-medium text-gray-800 group-hover:text-primary transition-colors">{sub.label}</p>
                                <p className="text-label text-gray-400 leading-snug">{sub.desc}</p>
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

          <div className="flex items-center gap-2">
            <Link
              href="/recommend"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-accent text-white rounded-button hover:bg-accent-600 transition-colors"
            >
              <Sparkles size={12} />
              {t('nav_smart_compare')}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 text-gray-500 hover:text-primary rounded hover:bg-gray-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Nav ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-card animate-fade-in max-h-[80vh] overflow-y-auto">
          <Link
            href="/recommend"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 mx-3 mt-3 mb-1 px-3 py-2.5 rounded-button text-body-sm font-bold bg-accent text-white"
          >
            <Sparkles size={14} />
            Smart Compare
          </Link>

          <div className="px-1 pb-2">
            {NAV_ITEMS.map((item) => {
              const isActive = router.pathname === item.href;
              const hasSub = item.sub && item.sub.length > 0;
              const isExpanded = mobileExpanded === item.key;
              const Icon = item.icon;

              return (
                <div key={item.key}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 text-body-sm font-medium transition-colors ${
                        isActive ? 'text-primary bg-primary/5' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-primary' : 'text-gray-400'} />
                      {t(item.key)}
                    </Link>
                    {hasSub && (
                      <button
                        onClick={() => setMobileExpanded(isExpanded ? null : item.key)}
                        className="px-3 py-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ChevronDown size={15} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {hasSub && isExpanded && (
                    <div className="ml-5 mb-1 border-l-2 border-primary/10 pl-3 animate-fade-in">
                      {item.sub!.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2.5 px-2 py-2 rounded text-body-sm text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors"
                        >
                          <sub.icon size={13} className="text-gray-400 shrink-0" />
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-100 px-3 py-2 flex gap-4">
            <Link href="/about" onClick={() => setMobileOpen(false)} className="text-label text-gray-500 hover:text-primary">{t('nav_about')}</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-label text-gray-500 hover:text-primary">{t('nav_contact')}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
