import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/ui/SEOHead';
import Container from '@/components/ui/Container';
import { CheckCircle, Mail, Clock, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const { t } = useTranslation('common');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout>
      <SEOHead
        title="Contact Us"
        description="Get in touch with SmartMoney UAE for questions, feedback, or partnership inquiries."
        path="/contact"
      />

      <section className="bg-gradient-to-br from-brand-nav via-brand-nav to-brand-nav-dark text-white py-8 sm:py-10 px-4">
        <Container size="md">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">{t('contact_title')}</h1>
            <p className="text-body-sm text-white/70">{t('contact_subtitle')}</p>
          </div>
        </Container>
      </section>

      <section className="section-padding">
        <Container size="lg">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="card-elevated text-center py-16">
                  <div className="w-16 h-16 bg-success-light rounded-2xl flex items-center justify-center mx-auto mb-4 animate-scale-in">
                    <CheckCircle size={32} className="text-success" />
                  </div>
                  <h2 className="text-heading-lg font-bold text-brand-dark mb-2">{t('contact_success_title')}</h2>
                  <p className="text-body-sm text-gray-500 mb-4">{t('contact_success')}</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-ghost text-brand-primary"
                  >
                    {t('contact_send_another')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card-elevated space-y-5">
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-1.5">{t('contact_name')}</label>
                    <input type="text" required className="input-field" placeholder={t('contact_name_placeholder')} />
                  </div>
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-1.5">{t('contact_email')}</label>
                    <input type="email" required className="input-field" placeholder={t('contact_email_placeholder')} />
                  </div>
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-1.5">{t('contact_subject')}</label>
                    <select className="input-field" required>
                      <option value="">{t('contact_select_subject')}</option>
                      <option value="general">{t('contact_subject_general')}</option>
                      <option value="partnership">{t('contact_subject_partnership')}</option>
                      <option value="bug">{t('contact_subject_bug')}</option>
                      <option value="feedback">{t('contact_subject_feedback')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-1.5">{t('contact_message')}</label>
                    <textarea required rows={5} className="input-field" placeholder={t('contact_message_placeholder')} />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    {t('contact_send')}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-4">
              <div className="card-hover">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary-50 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="text-heading-sm font-semibold text-brand-dark mb-1">{t('contact_email_us')}</h3>
                    <p className="text-body-sm text-gray-500">{t('contact_email_address')}</p>
                  </div>
                </div>
              </div>
              <div className="card-hover">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-card bg-brand-primary-50 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="text-heading-sm font-semibold text-brand-dark mb-1">{t('contact_response_time')}</h3>
                    <p className="text-body-sm text-gray-500">{t('contact_response_value')}</p>
                  </div>
                </div>
              </div>
              <div className="card-hover">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-card bg-brand-primary-50 flex items-center justify-center shrink-0">
                    <MessageSquare size={18} className="text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="text-heading-sm font-semibold text-brand-dark mb-1">{t('contact_live_chat')}</h3>
                    <p className="text-body-sm text-gray-500">{t('contact_live_chat_desc')}</p>
                  </div>
                </div>
              </div>
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
