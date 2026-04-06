import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';

export default function TermsPage() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Head>
        <title>Terms of Service — SmartMoney UAE</title>
      </Head>

      <section className="bg-gradient-to-br from-brand-nav via-brand-nav to-brand-nav-dark text-white py-8 sm:py-10 px-4">
        <Container size="md">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Terms of Service</h1>
            <p className="text-body-sm text-white/70">Last updated: April 2026</p>
          </div>
        </Container>
      </section>

      <section className="section-padding">
        <Container size="md">
          {/* Acceptance of Terms */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">1. Acceptance of Terms</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              By accessing or using the SmartMoney UAE website (smartmoney.ae), you agree to be bound by these
              Terms of Service. If you do not agree to all of these terms, you must not use our website or services.
              Your continued use of the site constitutes acceptance of any updates or modifications to these terms.
            </p>
          </div>

          {/* Description of Service */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">2. Description of Service</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed mb-4">
              SmartMoney UAE is a financial product comparison platform. We help users in the UAE compare
              credit cards, personal loans, Islamic finance products, car insurance, health insurance, and
              other financial products offered by banks and financial institutions.
            </p>
            <p className="text-body-lg text-gray-600 leading-relaxed font-semibold">
              SmartMoney UAE does not provide financial advice. The information on our website is for general
              informational and comparison purposes only and should not be construed as personal financial,
              investment, tax, or legal advice. You should consult a qualified financial advisor before making
              any financial decisions.
            </p>
          </div>

          {/* Affiliate Disclosure */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">3. Affiliate Disclosure</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed mb-4">
              SmartMoney UAE earns revenue through affiliate partnerships with banks and financial institutions.
              When you click through to a provider&apos;s website and apply for a product, we may receive a
              commission or referral fee from that provider.
            </p>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              These partnerships do not influence our editorial content, product rankings, or comparison results.
              We strive to present accurate and unbiased information to help you make informed decisions.
              However, not all available products or providers in the market may be represented on our platform.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">4. Disclaimer</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed mb-4">
              All interest rates, fees, rewards, and product details displayed on SmartMoney UAE are indicative
              and may change without notice. While we make every effort to keep information up to date, we
              cannot guarantee the accuracy or completeness of any data presented.
            </p>
            <p className="text-body-lg text-gray-600 leading-relaxed font-semibold">
              You should always verify rates, terms, eligibility criteria, and other details directly with the
              product provider before submitting any application or making a financial commitment.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">5. Limitation of Liability</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed mb-4">
              To the fullest extent permitted by applicable law, SmartMoney UAE and its owners, employees,
              and affiliates shall not be liable for any direct, indirect, incidental, consequential, or
              punitive damages arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body-lg text-gray-600 mb-4">
              <li>Your use of, or inability to use, the website or its content</li>
              <li>Any errors, inaccuracies, or omissions in the information provided</li>
              <li>Any actions taken based on information found on this website</li>
              <li>Any financial loss resulting from the use of products or services linked from our platform</li>
              <li>Unauthorized access to or alteration of your data</li>
            </ul>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              The website and all content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
              basis without warranties of any kind, whether express or implied.
            </p>
          </div>

          {/* Intellectual Property */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">6. Intellectual Property</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed mb-4">
              All content on this website, including but not limited to text, graphics, logos, icons, images,
              data compilations, software, and design, is the property of SmartMoney UAE or its content
              suppliers and is protected by UAE and international intellectual property laws.
            </p>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              You may not reproduce, distribute, modify, create derivative works from, publicly display,
              or exploit any content from this website without prior written permission from SmartMoney UAE.
              Third-party trademarks and logos displayed on the site remain the property of their respective owners.
            </p>
          </div>

          {/* User Conduct */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">7. User Conduct</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed mb-4">
              When using SmartMoney UAE, you agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body-lg text-gray-600">
              <li>Use the website for any unlawful purpose or in violation of any applicable laws</li>
              <li>Attempt to gain unauthorized access to any part of the website or its systems</li>
              <li>Interfere with or disrupt the operation of the website</li>
              <li>Scrape, crawl, or use automated tools to extract data without our written consent</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Transmit any viruses, malware, or harmful code</li>
            </ul>
          </div>

          {/* Modifications to Terms */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">8. Modifications to Terms</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              SmartMoney UAE reserves the right to update or modify these Terms of Service at any time without
              prior notice. Changes will be effective immediately upon posting to this page. The &ldquo;Last
              updated&rdquo; date at the top of this page will be revised accordingly. We encourage you to
              review these terms periodically. Your continued use of the website after any changes constitutes
              acceptance of the updated terms.
            </p>
          </div>

          {/* Governing Law */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">9. Governing Law</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with the laws of the
              United Arab Emirates. Any disputes arising from or relating to these terms or your use of the
              website shall be subject to the exclusive jurisdiction of the courts of the United Arab Emirates.
            </p>
          </div>

          {/* Contact */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">10. Contact</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:hello@smartmoney.ae" className="text-brand-nav hover:underline">
                hello@smartmoney.ae
              </a>.
            </p>
          </div>
        </Container>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
