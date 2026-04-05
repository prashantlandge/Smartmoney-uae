import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState, useRef, useEffect } from 'react';
import {
  Menu, X, Sparkles, ChevronDown, ChevronRight,
  ArrowLeftRight, CreditCard, Wallet, Landmark, Car, HeartPulse,
  Calculator, Receipt,
  Fuel, Gift, Plane, Crown, Percent, Building2, Shield, Moon,
  Stethoscope, Baby, Users, Zap, CheckCircle, PiggyBank,
  ArrowRight, FileText, Scale, Briefcase,
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
  label: string;      // short display label
  icon: typeof CreditCard;
  sub?: SubItem[];
}

/* ─── Nav data ─── */
const NAV_ITEMS: NavItem[] = [
  { href: '/', key: 'nav_home', label: 'Remittance', icon: ArrowLeftRight },
  {
    href: '/credit-cards', key: 'nav_credit_cards', label: 'Cards', icon: CreditCard,
    sub: [
      { label: 'Cashback Cards', href: '/credit-cards?filter=cashback', icon: Percent, desc: 'Earn cashback on every purchase' },
      { label: 'Travel Cards', href: '/credit-cards?filter=travel', icon: Plane, desc: 'Miles, lounge access & perks' },
      { label: 'Rewards Cards', href: '/credit-cards?filter=rewards', icon: Gift, desc: 'Top reward points & benefits' },
      { label: 'Fuel Cards', href: '/credit-cards?filter=fuel', icon: Fuel, desc: 'Save on petrol spends' },
      { label: 'Premium Cards', href: '/credit-cards?filter=premium', icon: Crown, desc: 'Lifestyle & concierge' },
      { label: 'Islamic Cards', href: '/credit-cards?filter=islamic', icon: Moon, desc: 'Shariah-compliant cards' },
    ],
  },
  {
    href: '/personal-loans', key: 'nav_personal_loans', label: 'Loans', icon: Wallet,
    sub: [
      { label: 'Lowest Rate', href: '/personal-loans?filter=low-rate', icon: Percent, desc: 'Best rates from UAE banks' },
      { label: 'No Salary Transfer', href: '/personal-loans?filter=no-transfer', icon: Zap, desc: 'No transfer required' },
      { label: 'Quick Approval', href: '/personal-loans?filter=quick', icon: Zap, desc: 'Same-day disbursement' },
      { label: 'Islamic Finance', href: '/personal-loans?filter=islamic', icon: Moon, desc: 'Shariah-compliant' },
    ],
  },
  {
    href: '/islamic-finance', key: 'nav_islamic_finance', label: 'Islamic', icon: Landmark,
    sub: [
      { label: 'Personal Finance', href: '/islamic-finance?filter=personal', icon: Building2, desc: 'Murabaha & Ijarah' },
      { label: 'Credit Cards', href: '/islamic-finance?filter=cards', icon: Shield, desc: 'Halal card options' },
      { label: 'Home Finance', href: '/islamic-finance?filter=home', icon: Building2, desc: 'Shariah mortgages' },
    ],
  },
  {
    href: '/car-insurance', key: 'nav_car_insurance', label: 'Car', icon: Car,
    sub: [
      { label: 'Comprehensive', href: '/car-insurance?filter=comprehensive', icon: Shield, desc: 'Full vehicle protection' },
      { label: 'Third Party', href: '/car-insurance?filter=third-party', icon: Car, desc: 'Budget-friendly cover' },
      { label: 'Takaful', href: '/car-insurance?filter=takaful', icon: Moon, desc: 'Islamic motor insurance' },
    ],
  },
  {
    href: '/health-insurance', key: 'nav_health_insurance', label: 'Health', icon: HeartPulse,
    sub: [
      { label: 'Individual', href: '/health-insurance?filter=individual', icon: Stethoscope, desc: 'Single member plans' },
      { label: 'Family', href: '/health-insurance?filter=family', icon: Users, desc: 'Whole family cover' },
      { label: 'Maternity', href: '/health-insurance?filter=maternity', icon: Baby, desc: 'Pregnancy & newborn' },
      { label: 'DHA Compliant', href: '/health-insurance?filter=dha', icon: Shield, desc: 'Dubai approved plans' },
    ],
  },
  {
    href: '/calculators', key: 'nav_calculators', label: 'Tools', icon: Calculator,
    sub: [
      { label: 'EMI Calculator', href: '/calculators#emi', icon: Calculator, desc: 'Calculate loan EMI' },
      { label: 'Cashback Calc', href: '/calculators#cashback', icon: Percent, desc: 'Compare card returns' },
      { label: 'Insurance Est.', href: '/calculators#car-insurance', icon: Car, desc: 'Estimate premiums' },
      { label: 'Eligibility', href: '/calculators#eligibility', icon: CheckCircle, desc: 'What you qualify for' },
      { label: 'Savings Calc', href: '/calculators#savings', icon: PiggyBank, desc: 'Plan savings goals' },
      { label: 'Fuel Cost', href: '/calculators#fuel', icon: Fuel, desc: 'Plan fuel expenses' },
    ],
  },
  {
    href: '/tax', key: 'nav_tax', label: 'Tax', icon: Receipt,
    sub: [
      { label: 'VAT Calculator', href: '/tax#vat', icon: Receipt, desc: 'UAE 5% VAT calc' },
      { label: 'Corporate Tax', href: '/tax#corporate', icon: Briefcase, desc: '9% tax estimator' },
      { label: 'Tax Residency', href: '/tax#residency', icon: FileText, desc: 'Check your status' },
      { label: 'Tax Guides', href: '/tax#guides', icon: Scale, desc: 'Rules explained' },
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
  const navRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [router.asPath]);

  return (
    <header className="sticky top-0 z-40">
      {/* ── Row 1: Brand bar (white) ── */}
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8 flex items-center justify-between h-12 sm:h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/logo.svg"
              alt="SmartMoney UAE"
              width={140}
              height={28}
              className="h-7 sm:h-8 w-auto"
              priority
            />
          </Link>

          {/* Right utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link href="/about" className="hidden md:block text-label text-gray-500 hover:text-brand-nav transition-colors px-2 py-1">
              About
            </Link>
            <Link href="/contact" className="hidden md:block text-label text-gray-500 hover:text-brand-nav transition-colors px-2 py-1">
              Contact
            </Link>

            <Link
              href="/recommend"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-label font-bold bg-brand-nav text-white rounded-button hover:bg-brand-nav-dark transition-colors"
            >
              <Sparkles size={12} />
              Smart Compare
            </Link>

            <button
              onClick={switchLocale}
              className="flex items-center gap-1.5 px-2 py-1.5 text-label font-medium text-gray-500 hover:text-brand-nav rounded hover:bg-surface-50 transition-colors"
            >
              <FlagIcon code="ae" size={14} />
              {router.locale === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 text-gray-500 hover:text-brand-nav rounded hover:bg-surface-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 2: Category nav (blue) ── */}
      <nav ref={navRef} className="bg-brand-nav shadow-nav hidden lg:block">
        <div className="max-w-content-xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-center h-11">
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
                    className={`flex items-center gap-1.5 px-3 xl:px-4 h-full text-label font-semibold tracking-wide uppercase transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-white bg-white/15'
                        : 'text-white/75 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon size={15} strokeWidth={2} />
                    {item.label}
                    {hasSub && <ChevronDown size={10} className={`ml-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
                  </Link>

                  {/* Dropdown */}
                  {hasSub && isOpen && (
                    <div
                      className="absolute top-full left-0 pt-0.5 z-50"
                      onMouseEnter={() => handleMouseEnter(item.key)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="bg-white rounded-lg shadow-elevated border border-surface-200 overflow-hidden animate-fade-in w-64">
                        {/* Dropdown header */}
                        <Link
                          href={item.href}
                          className="flex items-center justify-between px-4 py-2.5 bg-surface-50 border-b border-surface-100 text-body-sm font-bold text-brand-nav hover:text-brand-nav-dark transition-colors"
                        >
                          View All {item.label}
                          <ArrowRight size={13} />
                        </Link>

                        {/* Items */}
                        <div className="py-1">
                          {item.sub!.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-md bg-brand-nav/5 flex items-center justify-center shrink-0 group-hover:bg-brand-nav/10 transition-colors">
                                <sub.icon size={14} className="text-brand-nav" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-body-sm font-medium text-gray-800 group-hover:text-brand-nav transition-colors">{sub.label}</p>
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
          </div>
        </div>
      </nav>

      {/* ── Mobile Nav ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-surface-200 shadow-card animate-fade-in max-h-[80vh] overflow-y-auto">
          {/* Smart Compare CTA */}
          <Link
            href="/recommend"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 mx-3 mt-3 mb-1 px-3 py-2.5 rounded-button text-body-sm font-bold bg-brand-nav text-white"
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
                  {/* Main item row */}
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 text-body-sm font-medium transition-colors ${
                        isActive
                          ? 'text-brand-nav bg-brand-nav/5'
                          : 'text-gray-700 hover:bg-surface-50'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-brand-nav' : 'text-gray-400'} />
                      {item.label === 'Remittance' ? item.label : t(item.key)}
                    </Link>
                    {hasSub && (
                      <button
                        onClick={() => setMobileExpanded(isExpanded ? null : item.key)}
                        className="px-3 py-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={`Expand ${item.label}`}
                      >
                        <ChevronDown size={15} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Expanded sub-items */}
                  {hasSub && isExpanded && (
                    <div className="ml-5 mb-1 border-l-2 border-brand-nav/10 pl-3 animate-fade-in">
                      {item.sub!.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2.5 px-2 py-2 rounded text-body-sm text-gray-500 hover:text-brand-nav hover:bg-surface-50 transition-colors"
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

          {/* Mobile utility links */}
          <div className="border-t border-surface-100 px-3 py-2 flex gap-4">
            <Link href="/about" onClick={() => setMobileOpen(false)} className="text-label text-gray-500 hover:text-brand-nav">About</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-label text-gray-500 hover:text-brand-nav">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}
