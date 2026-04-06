import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';

export default function PrivacyPage() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Head>
        <title>Privacy Policy — SmartMoney UAE</title>
      </Head>

      <section className="bg-gradient-to-br from-brand-nav via-brand-nav to-brand-nav-dark text-white py-8 sm:py-10 px-4">
        <Container size="md">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-body-sm text-white/70">Last updated: April 2026</p>
          </div>
        </Container>
      </section>

      <section className="section-padding">
        <Container size="md">
          {/* Introduction */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">Introduction</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed mb-3">
              SmartMoney UAE (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website smartmoney.ae. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. By using our services, you agree to the collection and use of information in accordance with this policy.
            </p>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              We are committed to complying with the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data and its implementing regulations.
            </p>
          </div>

          {/* Data Collection */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">Data We Collect</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed mb-3">
              We may collect the following types of information when you use our website:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body-lg text-gray-600 mb-3">
              <li><strong>Session identifiers:</strong> Randomly generated session IDs to maintain your browsing experience and remember your preferences during a visit.</li>
              <li><strong>Usage events:</strong> Interactions such as page views, button clicks, product comparisons, calculator usage, and search queries.</li>
              <li><strong>Device and browser information:</strong> Browser type, operating system, screen resolution, language preference, and referring URL.</li>
              <li><strong>IP address:</strong> Collected automatically by our servers and third-party analytics services. We do not use IP addresses to personally identify you.</li>
              <li><strong>Cookies and similar technologies:</strong> Small data files stored on your device to enable core functionality, analytics, and advertising. See the Cookies section below for details.</li>
            </ul>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              We do not collect sensitive personal data such as national ID numbers, financial account credentials, or health information. We do not require you to create an account or provide your name, email, or phone number to use our comparison tools.
            </p>
          </div>

          {/* How Data Is Used */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">How We Use Your Data</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed mb-3">
              The information we collect is used for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body-lg text-gray-600">
              <li><strong>Product comparison:</strong> To display relevant financial products, calculate estimates, and personalise comparison results based on your selected filters.</li>
              <li><strong>Analytics and improvement:</strong> To understand how visitors use our website, identify popular features, diagnose technical issues, and improve the user experience.</li>
              <li><strong>Affiliate tracking:</strong> When you click through to a provider&apos;s website, we may pass a tracking identifier so that we can receive a commission if you apply for a product. This is how we keep our service free.</li>
              <li><strong>Advertising:</strong> To serve relevant advertisements and measure their effectiveness.</li>
              <li><strong>Legal compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
            </ul>
          </div>

          {/* Third-Party Services */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">Third-Party Services</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed mb-3">
              We use the following third-party services that may collect data about your visit:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body-lg text-gray-600 mb-3">
              <li><strong>Google Analytics:</strong> We use Google Analytics to collect anonymised usage statistics. Google Analytics uses cookies to track visitor interactions. Data may be processed on servers outside the UAE. For more information, see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Google&apos;s Privacy Policy</a>.</li>
              <li><strong>Google AdSense:</strong> We use Google AdSense to display advertisements. AdSense may use cookies and web beacons to serve ads based on your prior visits to our website or other websites. You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Google Ads Settings</a>.</li>
              <li><strong>Affiliate networks:</strong> When you click on a product link, you may be redirected through affiliate network tracking systems. These networks may set their own cookies to attribute referrals. Each provider and affiliate network has its own privacy policy.</li>
            </ul>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              We do not sell your personal data to third parties. Third-party services operate under their own privacy policies, and we encourage you to review them.
            </p>
          </div>

          {/* Cookies Policy */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">Cookies Policy</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed mb-3">
              Cookies are small text files placed on your device when you visit our website. We use the following types of cookies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body-lg text-gray-600 mb-3">
              <li><strong>Essential cookies:</strong> Required for the website to function properly, such as session management and language preference.</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website by collecting information anonymously (e.g., Google Analytics).</li>
              <li><strong>Advertising cookies:</strong> Used to deliver relevant advertisements and track ad campaign performance (e.g., Google AdSense).</li>
              <li><strong>Affiliate cookies:</strong> Used to track referrals to financial product providers so that we can receive commissions for successful applications.</li>
            </ul>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              You can control and delete cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website.
            </p>
          </div>

          {/* Data Retention */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">Data Retention</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              We retain analytics and usage data for a maximum of 26 months, after which it is automatically deleted or anonymised. Session data expires when you close your browser or after a period of inactivity. Affiliate tracking data is retained only for as long as necessary to process commissions and resolve disputes, typically no longer than 12 months.
            </p>
          </div>

          {/* User Rights */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">Your Rights</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed mb-3">
              Under the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data, you have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body-lg text-gray-600 mb-3">
              <li>The right to be informed about how your data is collected and used.</li>
              <li>The right to access the personal data we hold about you.</li>
              <li>The right to request correction of inaccurate personal data.</li>
              <li>The right to request deletion of your personal data, subject to legal obligations.</li>
              <li>The right to restrict or object to certain processing activities.</li>
              <li>The right to withdraw consent at any time where processing is based on consent.</li>
              <li>The right to lodge a complaint with the UAE Data Office if you believe your data protection rights have been violated.</li>
            </ul>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              To exercise any of these rights, please contact us using the details provided below.
            </p>
          </div>

          {/* Data Security */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">Data Security</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              We implement reasonable technical and organisational measures to protect the data we collect against unauthorised access, alteration, disclosure, or destruction. Our website is served over HTTPS to encrypt data in transit. However, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">Children&apos;s Privacy</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              Our website is not intended for individuals under the age of 18. We do not knowingly collect personal data from children. If you believe that a child has provided us with personal data, please contact us and we will take steps to delete such information.
            </p>
          </div>

          {/* Changes to This Policy */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">Changes to This Policy</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &quot;Last updated&quot; date. We encourage you to review this page periodically to stay informed about how we protect your information.
            </p>
          </div>

          {/* Contact */}
          <div className="mb-10">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">Contact Us</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed mb-3">
              If you have any questions about this Privacy Policy or wish to exercise your data protection rights, please contact us at:
            </p>
            <div className="bg-surface-50 rounded-card p-5">
              <p className="text-body-lg text-gray-600 mb-1"><strong>SmartMoney UAE</strong></p>
              <p className="text-body-lg text-gray-600">
                Email: <a href="mailto:hello@smartmoney.ae" className="text-brand-primary hover:underline">hello@smartmoney.ae</a>
              </p>
            </div>
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
