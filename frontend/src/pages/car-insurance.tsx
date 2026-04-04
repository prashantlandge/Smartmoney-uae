import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import ProductPageTemplate from '@/components/products/ProductPageTemplate';

const FEATURE_LABELS: Record<string, string> = {
  coverage_type: 'Coverage',
  starting_price: 'Starting Price',
  claim_settlement: 'Claim Settlement',
  agency_repair: 'Agency Repair',
  roadside_assistance: 'Roadside Assist',
};

export default function CarInsurancePage() {
  return (
    <ProductPageTemplate
      category="car-insurance"
      titleKey="ci_title"
      subtitleKey="ci_subtitle"
      heroIcon="car_insurance"
      featureLabels={FEATURE_LABELS}
    />
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
