import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import ProductPageTemplate from '@/components/products/ProductPageTemplate';

const FEATURE_LABELS: Record<string, string> = {
  interest_rate: 'Interest Rate',
  min_salary: 'Min. Salary',
  max_amount: 'Max Amount',
  tenure: 'Tenure',
  processing_fee: 'Processing Fee',
};

export default function PersonalLoansPage() {
  return (
    <ProductPageTemplate
      category="personal-loans"
      titleKey="pl_title"
      subtitleKey="pl_subtitle"
      heroIcon="personal_loans"
      featureLabels={FEATURE_LABELS}
    />
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
