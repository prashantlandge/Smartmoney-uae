import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import ProductPageTemplate from '@/components/products/ProductPageTemplate';

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
      heroIcon="☪️"
      featureLabels={FEATURE_LABELS}
    />
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
