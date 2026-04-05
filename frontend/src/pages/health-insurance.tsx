import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import ProductPageTemplate from '@/components/products/ProductPageTemplate';
import InsuranceEstimator from '@/components/calculators/InsuranceEstimator';
import EligibilityChecker from '@/components/eligibility/EligibilityChecker';

const FEATURE_LABELS: Record<string, string> = {
  coverage_type: 'Coverage',
  starting_price: 'Starting Price',
  network: 'Network',
  dental_cover: 'Dental Cover',
  maternity: 'Maternity',
};

export default function HealthInsurancePage() {
  return (
    <ProductPageTemplate
      category="health-insurance"
      titleKey="hi_title"
      subtitleKey="hi_subtitle"
      heroIcon="health_insurance"
      featureLabels={FEATURE_LABELS}
      calculatorSlot={
        <>
          <EligibilityChecker />
          <InsuranceEstimator type="health" />
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
