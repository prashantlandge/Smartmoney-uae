import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import ProductPageTemplate from '@/components/products/ProductPageTemplate';
import CashbackCalculator from '@/components/calculators/CashbackCalculator';
import EligibilityChecker from '@/components/eligibility/EligibilityChecker';

const FEATURE_LABELS: Record<string, string> = {
  annual_fee: 'Annual Fee',
  min_salary: 'Min. Salary',
  cashback: 'Cashback',
  interest_rate: 'Interest Rate',
  lounge_access: 'Lounge Access',
  welcome_bonus: 'Welcome Bonus',
};

export default function CreditCardsPage() {
  return (
    <ProductPageTemplate
      category="credit-cards"
      titleKey="cc_title"
      subtitleKey="cc_subtitle"
      heroIcon="credit_cards"
      featureLabels={FEATURE_LABELS}
      seoTitle="Best Credit Cards in UAE 2026"
      seoDescription="Compare cashback, travel, rewards credit cards from UAE banks. Find the best card for your salary and lifestyle."
      seoPath="/credit-cards"
      calculatorSlot={
        <>
          <EligibilityChecker />
          <CashbackCalculator />
        </>
      }
    />
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
