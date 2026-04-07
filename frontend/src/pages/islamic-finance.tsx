import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import ProductPageTemplate from '@/components/products/ProductPageTemplate';
import EmiCalculator from '@/components/calculators/EmiCalculator';
import EligibilityChecker from '@/components/eligibility/EligibilityChecker';

const FEATURE_LABELS: Record<string, string> = {
  profit_rate: 'Profit Rate',
  min_salary: 'Min. Salary',
  max_amount: 'Max Finance',
  tenure: 'Tenure',
  structure: 'Structure',
};

export default function IslamicFinancePage() {
  return (
    <ProductPageTemplate
      category="islamic-finance"
      titleKey="if_title"
      subtitleKey="if_subtitle"
      heroIcon="islamic_finance"
      featureLabels={FEATURE_LABELS}
      calculatorSlot={
        <>
          <EligibilityChecker />
          <EmiCalculator />
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
