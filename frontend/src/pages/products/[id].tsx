import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetServerSideProps } from 'next';
import { useState, useEffect, type ReactNode } from 'react';
import Layout from '@/components/layout/Layout';
import ProviderLogo from '@/components/ui/ProviderLogo';
import Badge from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { trackEvent } from '@/lib/tracker';
import type { Product } from '@/components/products/ProductCard';
import {
  Check, X, ExternalLink, ArrowLeft, Shield, Star, Lightbulb,
  ChevronRight, AlertCircle, Clock, CreditCard, Percent, Plane,
  Smartphone, FileText, Heart, Car, Building2, Gift, Users, DollarSign,
  Banknote, Wallet, Globe, Stethoscope, Activity, Network,
  type LucideIcon,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

const CATEGORY_LABELS: Record<string, string> = {
  credit_card: 'Credit Cards',
  personal_loan: 'Personal Loans',
  islamic_finance: 'Islamic Finance',
  car_insurance: 'Car Insurance',
  health_insurance: 'Health Insurance',
  remittance: 'Remittance',
};

const CATEGORY_ROUTES: Record<string, string> = {
  credit_card: '/credit-cards',
  personal_loan: '/personal-loans',
  islamic_finance: '/islamic-finance',
  car_insurance: '/car-insurance',
  health_insurance: '/health-insurance',
  remittance: '/',
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  credit_card: 'from-indigo-600 to-brand-nav',
  personal_loan: 'from-teal-600 to-teal-500',
  islamic_finance: 'from-emerald-700 to-emerald-500',
  car_insurance: 'from-amber-600 to-amber-500',
  health_insurance: 'from-rose-600 to-rose-500',
};

type FeatureValue = string | number | boolean | Record<string, unknown> | unknown[];

function feat(features: Record<string, unknown>, key: string): FeatureValue | undefined {
  const v = features[key];
  if (v === undefined || v === null || v === '') return undefined;
  return v as FeatureValue;
}

const formatLabel = (key: string) =>
  key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const formatValue = (v: FeatureValue): string => {
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  return String(v);
};

function Section({ icon: Icon, iconColor, title, children }: {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-card border border-surface-200">
      <div className="px-4 sm:px-5 py-3 border-b border-surface-100">
        <h2 className="text-body-sm font-bold text-brand-dark flex items-center gap-2">
          <div className="w-7 h-7 rounded-button bg-surface-50 flex items-center justify-center shrink-0">
            <Icon size={15} className={iconColor} />
          </div>
          {title}
        </h2>
      </div>
      <div className="px-4 sm:px-5 py-4">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: FeatureValue | undefined }) {
  if (value === undefined) return null;
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-surface-100 last:border-b-0">
      <span className="text-body-sm text-gray-500">{label}</span>
      <span className="text-body-sm font-bold text-brand-dark text-right max-w-[55%]">{formatValue(value)}</span>
    </div>
  );
}

function BoolRow({ label, value }: { label: string; value: FeatureValue | undefined }) {
  if (value === undefined) return null;
  const yes = Boolean(value);
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      {yes ? (
        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <Check size={12} className="text-emerald-600" />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <X size={12} className="text-gray-400" />
        </div>
      )}
      <span className={`text-body-sm ${yes ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
}

function MiniTable({ data, label }: { data: Record<string, unknown>; label?: string }) {
  const entries = Object.entries(data).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (entries.length === 0) return null;
  return (
    <div className="mt-3">
      {label && <p className="text-label font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</p>}
      <div className="bg-surface-50 rounded-button overflow-hidden border border-surface-100">
        {entries.map(([key, val]) => (
          <div key={key} className="flex items-center justify-between px-3 py-2 border-b border-surface-100 last:border-b-0">
            <span className="text-body-sm text-gray-600">{formatLabel(key)}</span>
            <span className="text-body-sm font-bold text-brand-dark">{String(val)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BulletList({ items, label }: { items: unknown[]; label?: string }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-2">
      {label && <p className="text-label font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</p>}
      <ul className="list-disc list-inside space-y-0.5">
        {items.map((item, idx) => (
          <li key={idx} className="text-body-sm text-gray-700">{String(item)}</li>
        ))}
      </ul>
    </div>
  );
}

function HighlightCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-100 text-blue-800',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-800',
    amber: 'bg-amber-50 border-amber-100 text-amber-800',
    purple: 'bg-purple-50 border-purple-100 text-purple-800',
    rose: 'bg-rose-50 border-rose-100 text-rose-800',
    teal: 'bg-teal-50 border-teal-100 text-teal-800',
  };
  const cls = colorMap[color] || colorMap.blue;
  return (
    <div className={`rounded-card border px-4 py-3 ${cls}`}>
      <p className="text-label font-medium opacity-70 mb-0.5">{label}</p>
      <p className="text-base font-bold">{value}</p>
    </div>
  );
}

function hasAny(features: Record<string, unknown>, keys: string[]): boolean {
  return keys.some((k) => feat(features, k) !== undefined);
}

function ConditionalSection({ features, keys, ...rest }: {
  features: Record<string, unknown>;
  keys: string[];
  icon: LucideIcon;
  iconColor: string;
  title: string;
  children: ReactNode;
}) {
  if (!hasAny(features, keys)) return null;
  return <Section {...rest} />;
}

// Category-specific section renderers (unchanged logic, compact styling)

function CreditCardSections({ f }: { f: Record<string, unknown> }) {
  return (
    <>
      <ConditionalSection
        features={f}
        keys={['annual_fee', 'annual_fee_first_year', 'annual_fee_subsequent', 'interest_rate', 'foreign_transaction_fee', 'cash_advance_fee', 'late_payment_fee', 'minimum_payment']}
        icon={DollarSign} iconColor="text-rose-500" title="Fees & Charges"
      >
        <Row label="Annual Fee (1st Year)" value={feat(f, 'annual_fee_first_year') ?? feat(f, 'annual_fee')} />
        <Row label="Annual Fee (Subsequent)" value={feat(f, 'annual_fee_subsequent') ?? feat(f, 'annual_fee')} />
        <Row label="Interest Rate (APR)" value={feat(f, 'interest_rate')} />
        <Row label="Foreign Transaction Fee" value={feat(f, 'foreign_transaction_fee')} />
        <Row label="Cash Advance Fee" value={feat(f, 'cash_advance_fee')} />
        <Row label="Late Payment Fee" value={feat(f, 'late_payment_fee')} />
        <Row label="Minimum Payment" value={feat(f, 'minimum_payment')} />
      </ConditionalSection>

      <ConditionalSection
        features={f}
        keys={['rewards_program', 'earn_rate', 'cashback_rate', 'cashback_categories', 'welcome_bonus']}
        icon={Gift} iconColor="text-amber-500" title="Rewards & Cashback"
      >
        <Row label="Rewards Program" value={feat(f, 'rewards_program')} />
        <Row label="Earn Rate" value={feat(f, 'earn_rate')} />
        <Row label="Cashback Rate" value={feat(f, 'cashback_rate')} />
        <Row label="Welcome Bonus" value={feat(f, 'welcome_bonus')} />
        {typeof f.cashback_categories === 'object' && f.cashback_categories !== null && !Array.isArray(f.cashback_categories) && (
          <MiniTable data={f.cashback_categories as Record<string, unknown>} label="Cashback by Category" />
        )}
      </ConditionalSection>

      <ConditionalSection
        features={f}
        keys={['lounge_access', 'lounge_program', 'lounge_visits', 'travel_insurance', 'travel_insurance_coverage', 'valet_parking', 'airport_transfer', 'golf', 'concierge']}
        icon={Plane} iconColor="text-sky-500" title="Travel & Lifestyle"
      >
        <BoolRow label="Lounge Access" value={feat(f, 'lounge_access')} />
        <Row label="Lounge Program" value={feat(f, 'lounge_program')} />
        <Row label="Complimentary Visits" value={feat(f, 'lounge_visits')} />
        <BoolRow label="Travel Insurance" value={feat(f, 'travel_insurance')} />
        <Row label="Travel Insurance Coverage" value={feat(f, 'travel_insurance_coverage')} />
        <BoolRow label="Valet Parking" value={feat(f, 'valet_parking')} />
        <BoolRow label="Airport Transfer" value={feat(f, 'airport_transfer')} />
        <BoolRow label="Golf Access" value={feat(f, 'golf')} />
        <BoolRow label="Concierge Service" value={feat(f, 'concierge')} />
      </ConditionalSection>

      <ConditionalSection
        features={f}
        keys={['contactless', 'apple_pay', 'samsung_pay', 'online_banking', 'supplementary_cards']}
        icon={Smartphone} iconColor="text-indigo-500" title="Digital & Convenience"
      >
        <div className="grid grid-cols-2 gap-1">
          <BoolRow label="Contactless" value={feat(f, 'contactless')} />
          <BoolRow label="Apple Pay" value={feat(f, 'apple_pay')} />
          <BoolRow label="Samsung Pay" value={feat(f, 'samsung_pay')} />
          <BoolRow label="Online Banking" value={feat(f, 'online_banking')} />
        </div>
        <Row label="Supplementary Cards" value={feat(f, 'supplementary_cards')} />
      </ConditionalSection>

      <ConditionalSection
        features={f}
        keys={['min_salary', 'salary_transfer_required', 'employer_types', 'nationalities']}
        icon={Users} iconColor="text-violet-500" title="Eligibility"
      >
        <Row label="Minimum Salary" value={feat(f, 'min_salary')} />
        <BoolRow label="Salary Transfer Required" value={feat(f, 'salary_transfer_required')} />
        <Row label="Employer Types" value={feat(f, 'employer_types')} />
        <Row label="Nationalities" value={feat(f, 'nationalities')} />
      </ConditionalSection>
    </>
  );
}

function PersonalLoanSections({ f }: { f: Record<string, unknown> }) {
  return (
    <>
      <ConditionalSection
        features={f}
        keys={['interest_rate', 'flat_rate', 'reducing_rate', 'processing_fee', 'early_settlement_fee', 'late_payment_fee', 'insurance']}
        icon={Percent} iconColor="text-rose-500" title="Rates & Fees"
      >
        <Row label="Interest Rate" value={feat(f, 'interest_rate')} />
        <Row label="Flat Rate" value={feat(f, 'flat_rate')} />
        <Row label="Reducing Rate" value={feat(f, 'reducing_rate')} />
        <Row label="Processing Fee" value={feat(f, 'processing_fee')} />
        <Row label="Early Settlement Fee" value={feat(f, 'early_settlement_fee')} />
        <Row label="Late Payment Fee" value={feat(f, 'late_payment_fee')} />
        <Row label="Insurance" value={feat(f, 'insurance')} />
      </ConditionalSection>

      <ConditionalSection
        features={f}
        keys={['min_amount', 'max_amount', 'min_tenure', 'max_tenure', 'top_up', 'balance_transfer']}
        icon={Banknote} iconColor="text-emerald-500" title="Loan Details"
      >
        <Row label="Minimum Amount" value={feat(f, 'min_amount')} />
        <Row label="Maximum Amount" value={feat(f, 'max_amount')} />
        <Row label="Minimum Tenure" value={feat(f, 'min_tenure')} />
        <Row label="Maximum Tenure" value={feat(f, 'max_tenure')} />
        <BoolRow label="Top-up Available" value={feat(f, 'top_up')} />
        <BoolRow label="Balance Transfer" value={feat(f, 'balance_transfer')} />
      </ConditionalSection>

      <ConditionalSection
        features={f}
        keys={['min_salary', 'dbr', 'salary_transfer_required', 'documents_required', 'approval_time', 'disbursement_time']}
        icon={FileText} iconColor="text-violet-500" title="Eligibility & Process"
      >
        <Row label="Minimum Salary" value={feat(f, 'min_salary')} />
        <Row label="Debt Burden Ratio (DBR)" value={feat(f, 'dbr')} />
        <BoolRow label="Salary Transfer Required" value={feat(f, 'salary_transfer_required')} />
        <Row label="Approval Time" value={feat(f, 'approval_time')} />
        <Row label="Disbursement Time" value={feat(f, 'disbursement_time')} />
        {Array.isArray(f.documents_required) && (
          <BulletList items={f.documents_required} label="Documents Required" />
        )}
      </ConditionalSection>

      <ConditionalSection
        features={f}
        keys={['online_application', 'nationalities', 'employer_types']}
        icon={Globe} iconColor="text-sky-500" title="Application"
      >
        <BoolRow label="Online Application" value={feat(f, 'online_application')} />
        <Row label="Nationalities" value={feat(f, 'nationalities')} />
        <Row label="Employer Types" value={feat(f, 'employer_types')} />
      </ConditionalSection>
    </>
  );
}

function IslamicFinanceSections({ f }: { f: Record<string, unknown> }) {
  return (
    <>
      <ConditionalSection
        features={f}
        keys={['profit_rate', 'processing_fee', 'min_amount', 'max_amount', 'min_tenure', 'max_tenure', 'takaful']}
        icon={Percent} iconColor="text-emerald-500" title="Finance Details"
      >
        <Row label="Profit Rate" value={feat(f, 'profit_rate')} />
        <Row label="Processing Fee" value={feat(f, 'processing_fee')} />
        <Row label="Minimum Amount" value={feat(f, 'min_amount')} />
        <Row label="Maximum Amount" value={feat(f, 'max_amount')} />
        <Row label="Minimum Tenure" value={feat(f, 'min_tenure')} />
        <Row label="Maximum Tenure" value={feat(f, 'max_tenure')} />
        <Row label="Takaful" value={feat(f, 'takaful')} />
      </ConditionalSection>

      <ConditionalSection
        features={f}
        keys={['structure_type', 'sharia_board', 'fatwa']}
        icon={Shield} iconColor="text-emerald-600" title="Sharia Compliance"
      >
        <Row label="Structure Type" value={feat(f, 'structure_type')} />
        <Row label="Sharia Board" value={feat(f, 'sharia_board')} />
        <Row label="Fatwa Reference" value={feat(f, 'fatwa')} />
      </ConditionalSection>

      <ConditionalSection
        features={f}
        keys={['min_salary', 'documents_required', 'approval_time']}
        icon={Users} iconColor="text-violet-500" title="Eligibility"
      >
        <Row label="Minimum Salary" value={feat(f, 'min_salary')} />
        <Row label="Approval Time" value={feat(f, 'approval_time')} />
        {Array.isArray(f.documents_required) && (
          <BulletList items={f.documents_required} label="Documents Required" />
        )}
      </ConditionalSection>
    </>
  );
}

function CarInsuranceSections({ f }: { f: Record<string, unknown> }) {
  return (
    <>
      <ConditionalSection
        features={f}
        keys={['coverage_type', 'comprehensive', 'third_party', 'natural_disasters', 'personal_accident', 'gcc_cover', 'oman_extension']}
        icon={Shield} iconColor="text-blue-500" title="Coverage Details"
      >
        <Row label="Coverage Type" value={feat(f, 'coverage_type')} />
        <BoolRow label="Comprehensive" value={feat(f, 'comprehensive')} />
        <BoolRow label="Third-Party" value={feat(f, 'third_party')} />
        <BoolRow label="Natural Disasters" value={feat(f, 'natural_disasters')} />
        <BoolRow label="Personal Accident" value={feat(f, 'personal_accident')} />
        <BoolRow label="GCC Cover" value={feat(f, 'gcc_cover')} />
        <BoolRow label="Oman Extension" value={feat(f, 'oman_extension')} />
      </ConditionalSection>

      <ConditionalSection
        features={f}
        keys={['agency_repair', 'non_agency_repair', 'claim_settlement_time', 'rent_a_car', 'new_for_old']}
        icon={Car} iconColor="text-amber-500" title="Repair & Claims"
      >
        <BoolRow label="Agency Repair" value={feat(f, 'agency_repair')} />
        <BoolRow label="Non-Agency Repair Option" value={feat(f, 'non_agency_repair')} />
        <Row label="Claim Settlement Time" value={feat(f, 'claim_settlement_time')} />
        <BoolRow label="Rent-a-Car During Repair" value={feat(f, 'rent_a_car')} />
        <BoolRow label="New-for-Old Replacement" value={feat(f, 'new_for_old')} />
      </ConditionalSection>

      <ConditionalSection
        features={f}
        keys={['roadside_assistance', 'towing', 'windscreen_cover', 'off_road_cover', 'no_claim_discount']}
        icon={Star} iconColor="text-emerald-500" title="Additional Benefits"
      >
        <BoolRow label="Roadside Assistance" value={feat(f, 'roadside_assistance')} />
        <BoolRow label="Towing" value={feat(f, 'towing')} />
        <BoolRow label="Windscreen Cover" value={feat(f, 'windscreen_cover')} />
        <BoolRow label="Off-Road Cover" value={feat(f, 'off_road_cover')} />
        <Row label="No-Claim Discount" value={feat(f, 'no_claim_discount')} />
      </ConditionalSection>
    </>
  );
}

function HealthInsuranceSections({ f }: { f: Record<string, unknown> }) {
  return (
    <>
      <ConditionalSection
        features={f}
        keys={['inpatient_cover', 'outpatient_cover', 'annual_limit', 'room_type']}
        icon={Shield} iconColor="text-blue-500" title="Coverage Limits"
      >
        <Row label="Inpatient Cover" value={feat(f, 'inpatient_cover')} />
        <Row label="Outpatient Cover" value={feat(f, 'outpatient_cover')} />
        <Row label="Annual Limit" value={feat(f, 'annual_limit')} />
        <Row label="Room Type" value={feat(f, 'room_type')} />
      </ConditionalSection>

      <ConditionalSection
        features={f}
        keys={['dental', 'optical', 'maternity', 'maternity_waiting_period', 'maternity_limit', 'mental_health', 'alternative_medicine']}
        icon={Stethoscope} iconColor="text-rose-500" title="Specialist Coverage"
      >
        <BoolRow label="Dental" value={feat(f, 'dental')} />
        <BoolRow label="Optical" value={feat(f, 'optical')} />
        <BoolRow label="Maternity" value={feat(f, 'maternity')} />
        <Row label="Maternity Waiting Period" value={feat(f, 'maternity_waiting_period')} />
        <Row label="Maternity Limit" value={feat(f, 'maternity_limit')} />
        <BoolRow label="Mental Health" value={feat(f, 'mental_health')} />
        <BoolRow label="Alternative Medicine" value={feat(f, 'alternative_medicine')} />
      </ConditionalSection>

      <ConditionalSection
        features={f}
        keys={['network_hospitals', 'network_type', 'dha_compliant', 'haad_compliant']}
        icon={Building2} iconColor="text-indigo-500" title="Network & Access"
      >
        <Row label="Network Hospitals" value={feat(f, 'network_hospitals')} />
        <Row label="Network Type" value={feat(f, 'network_type')} />
        <BoolRow label="DHA Compliant" value={feat(f, 'dha_compliant')} />
        <BoolRow label="HAAD Compliant" value={feat(f, 'haad_compliant')} />
      </ConditionalSection>

      <ConditionalSection
        features={f}
        keys={['copay_consultation', 'copay_pharmacy', 'excess']}
        icon={Wallet} iconColor="text-amber-500" title="Cost Sharing"
      >
        <Row label="Copay (Consultation)" value={feat(f, 'copay_consultation')} />
        <Row label="Copay (Pharmacy)" value={feat(f, 'copay_pharmacy')} />
        <Row label="Excess / Deductible" value={feat(f, 'excess')} />
      </ConditionalSection>
    </>
  );
}

interface Highlight {
  label: string;
  value: string;
  color: string;
}

function getHighlights(productType: string, f: Record<string, unknown>): Highlight[] {
  const highlights: Highlight[] = [];
  const push = (label: string, key: string, color: string) => {
    const v = feat(f, key);
    if (v !== undefined) highlights.push({ label, value: formatValue(v), color });
  };

  switch (productType) {
    case 'credit_card':
      push('Annual Fee', 'annual_fee', 'blue');
      push('Annual Fee (1st Year)', 'annual_fee_first_year', 'blue');
      push('Cashback Rate', 'cashback_rate', 'emerald');
      push('Min. Salary', 'min_salary', 'amber');
      push('Interest Rate', 'interest_rate', 'rose');
      break;
    case 'personal_loan':
      push('Interest Rate', 'interest_rate', 'blue');
      push('Flat Rate', 'flat_rate', 'blue');
      push('Max Amount', 'max_amount', 'emerald');
      push('Max Tenure', 'max_tenure', 'amber');
      push('Min. Salary', 'min_salary', 'purple');
      break;
    case 'islamic_finance':
      push('Profit Rate', 'profit_rate', 'emerald');
      push('Max Amount', 'max_amount', 'blue');
      push('Max Tenure', 'max_tenure', 'amber');
      push('Min. Salary', 'min_salary', 'purple');
      break;
    case 'car_insurance':
      push('Coverage Type', 'coverage_type', 'blue');
      push('Starting Premium', 'starting_premium', 'emerald');
      push('Claim Settlement', 'claim_settlement_time', 'amber');
      break;
    case 'health_insurance':
      push('Plan Type', 'plan_type', 'blue');
      push('Starting Premium', 'starting_premium', 'emerald');
      push('Annual Limit', 'annual_limit', 'amber');
      push('Network Hospitals', 'network_hospitals', 'purple');
      break;
  }
  return highlights.slice(0, 4);
}

export default function ProductDetailPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { id } = router.query;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}/api/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Product not found');
        return r.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleApply = () => {
    if (!product) return;
    trackEvent('click_product_apply', {
      product_name: product.product_name,
      provider_name: product.provider_name,
      product_type: product.product_type,
    });
  };

  let affiliateHref = '#';
  if (product?.affiliate_link) {
    try {
      const url = new URL(product.affiliate_link);
      url.searchParams.set('utm_source', 'smartmoney_uae');
      url.searchParams.set('utm_medium', 'product_detail');
      affiliateHref = url.toString();
    } catch {
      affiliateHref = product.affiliate_link;
    }
  }

  const categoryLabel = product ? CATEGORY_LABELS[product.product_type] || product.product_type : '';
  const categoryRoute = product ? CATEGORY_ROUTES[product.product_type] || '/' : '/';
  const heroGradient = product ? CATEGORY_GRADIENTS[product.product_type] || 'from-brand-nav to-brand-nav-dark' : '';
  const features: Record<string, unknown> = product ? (product.features as Record<string, unknown>) : {};
  const highlights = product ? getHighlights(product.product_type, features) : [];

  return (
    <Layout>
      <Head>
        <title>
          {product ? `${product.product_name} — ${product.provider_name}` : 'Product Details'} | SmartMoney UAE
        </title>
        {product && <meta name="description" content={product.description} />}
      </Head>

      {/* Colored hero with breadcrumb + product info */}
      <section className={`bg-gradient-to-r ${heroGradient || 'from-brand-nav to-brand-nav-dark'} text-white`}>
        <div className="max-w-content-lg mx-auto px-4 sm:px-8 py-4 sm:py-5">
          <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            {product && (
              <>
                <Link href={categoryRoute} className="hover:text-white transition-colors">{categoryLabel}</Link>
                <ChevronRight size={12} />
                <span className="text-white font-medium truncate">{product.product_name}</span>
              </>
            )}
          </nav>
          {product && (
            <div className="flex items-center gap-3">
              <ProviderLogo name={product.provider_name} logoUrl={product.provider_logo} size={48} />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold truncate">{product.product_name}</h1>
                <p className="text-body-sm text-white/80">{product.provider_name}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {loading && (
        <div className="max-w-content-lg mx-auto px-4 sm:px-8 py-8">
          <SkeletonCard />
        </div>
      )}

      {error && (
        <div className="max-w-content-lg mx-auto px-4 sm:px-8 py-12">
          <EmptyState
            icon={AlertCircle}
            title="Product not found"
            description="This product may have been removed or the link is incorrect."
          />
          <div className="text-center mt-4">
            <Link href="/" className="btn-primary">
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>
        </div>
      )}

      {product && (
        <>
          {/* Sticky CTA bar */}
          <div className="bg-white border-b border-surface-200 sticky top-14 z-20">
            <div className="max-w-content-lg mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <ProviderLogo name={product.provider_name} logoUrl={product.provider_logo} size={32} />
                <div className="min-w-0">
                  <p className="text-body-sm font-bold text-brand-dark truncate">{product.product_name}</p>
                  <p className="text-label text-gray-500">{product.provider_name}</p>
                </div>
              </div>
              <a
                href={affiliateHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleApply}
                className="btn-primary text-sm py-2 px-5 gap-1.5 shrink-0"
              >
                Apply Now <ExternalLink size={13} />
              </a>
            </div>
          </div>

          <div className="bg-surface-50 min-h-[60vh]">
            <div className="max-w-content-lg mx-auto px-4 sm:px-8 py-6">
              <div className="space-y-4">

                {/* Key highlights + badges */}
                <div className="bg-white rounded-card border border-surface-200 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {product.is_islamic && (
                      <Badge variant="islamic">{t('islamic_compliant')}</Badge>
                    )}
                    {product.product_type === 'islamic_finance' && !product.is_islamic && (
                      <Badge variant="islamic">Sharia-Compliant</Badge>
                    )}
                    {product.badge && (
                      <Badge variant={product.badge.type as any}>{product.badge.label}</Badge>
                    )}
                  </div>

                  {highlights.length > 0 && (
                    <div className={`grid gap-3 mb-4 ${highlights.length <= 2 ? 'grid-cols-2' : highlights.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
                      {highlights.map((h) => (
                        <HighlightCard key={h.label} label={h.label} value={h.value} color={h.color} />
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <a
                      href={affiliateHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleApply}
                      className="btn-primary text-sm py-2.5 px-6 gap-1.5 justify-center"
                    >
                      Apply Now <ExternalLink size={14} />
                    </a>
                    <Link href={categoryRoute} className="btn-outline text-sm py-2.5 px-4 justify-center">
                      <ArrowLeft size={14} /> All {categoryLabel}
                    </Link>
                    <p className="text-label text-gray-400 sm:ml-auto">
                      You&apos;ll be redirected to {product.provider_name}
                    </p>
                  </div>
                </div>

                {/* Overview */}
                {(product.description || feat(features, 'best_for') || feat(features, 'structure_type')) && (
                  <Section icon={Lightbulb} iconColor="text-amber-500" title="Overview">
                    {product.description && (
                      <p className="text-body-sm text-gray-600 leading-relaxed">{product.description}</p>
                    )}
                    {feat(features, 'best_for') && (
                      <div className="mt-3">
                        <Badge variant="info">Best for: {formatValue(feat(features, 'best_for')!)}</Badge>
                      </div>
                    )}
                    {feat(features, 'structure_type') && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-body-sm font-semibold text-gray-500">Structure:</span>
                        <Badge variant="islamic">{formatValue(feat(features, 'structure_type')!)}</Badge>
                      </div>
                    )}
                  </Section>
                )}

                {/* Category-specific sections */}
                {product.product_type === 'credit_card' && <CreditCardSections f={features} />}
                {product.product_type === 'personal_loan' && <PersonalLoanSections f={features} />}
                {product.product_type === 'islamic_finance' && <IslamicFinanceSections f={features} />}
                {product.product_type === 'car_insurance' && <CarInsuranceSections f={features} />}
                {product.product_type === 'health_insurance' && <HealthInsuranceSections f={features} />}

                {/* Disclaimer */}
                <div className="flex items-start gap-2 text-label text-gray-400 px-1">
                  <Clock size={12} className="shrink-0 mt-0.5" />
                  <p>
                    Information is for general guidance only. Rates and terms may change.
                    Please verify details on the provider&apos;s official website before applying.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
