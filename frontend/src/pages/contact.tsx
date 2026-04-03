import Head from 'next/head';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';

export default function ContactPage() {
  const { t } = useTranslation('common');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout>
      <Head>
        <title>{t('contact_title')} — SmartMoney UAE</title>
      </Head>

      <section className="bg-gradient-to-br from-brand-dark to-brand-primary text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">{t('contact_title')}</h1>
          <p className="text-white/80">{t('contact_subtitle')}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto">
          {submitted ? (
            <div className="card text-center py-12">
              <span className="text-4xl mb-3 block">✉️</span>
              <h2 className="text-xl font-bold text-brand-dark mb-2">{t('contact_success_title')}</h2>
              <p className="text-gray-500">{t('contact_success')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_name')}</label>
                <input type="text" required className="input-field text-sm py-2.5" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_email')}</label>
                <input type="email" required className="input-field text-sm py-2.5" placeholder="you@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_subject')}</label>
                <select className="input-field text-sm py-2.5" required>
                  <option value="">{t('contact_select_subject')}</option>
                  <option value="general">General Inquiry</option>
                  <option value="partnership">Partnership / Advertising</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_message')}</label>
                <textarea required rows={4} className="input-field text-sm py-2.5" placeholder="How can we help?" />
              </div>
              <button type="submit" className="btn-primary w-full">
                {t('contact_send')}
              </button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
