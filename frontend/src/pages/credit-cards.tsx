import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import ProductPageTemplate from '@/components/products/ProductPageTemplate';

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
      heroIcon="💳"
      featureLabels={FEATURE_LABELS}
    />
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
