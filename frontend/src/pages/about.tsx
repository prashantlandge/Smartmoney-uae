import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';

export default function AboutPage() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Head>
        <title>{t('about_title')} — SmartMoney UAE</title>
      </Head>

      <section className="bg-gradient-to-br from-brand-dark to-brand-primary text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">{t('about_title')}</h1>
          <p className="text-white/80">{t('about_hero')}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h2 className="text-xl font-bold text-brand-dark mb-3">{t('about_mission_title')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('about_mission')}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card text-center">
              <div className="text-3xl font-bold text-brand-primary mb-1">20+</div>
              <div className="text-sm text-gray-500">{t('about_providers')}</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-brand-primary mb-1">50+</div>
              <div className="text-sm text-gray-500">{t('about_products')}</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-brand-primary mb-1">6</div>
              <div className="text-sm text-gray-500">{t('about_categories')}</div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-dark mb-3">{t('about_why_title')}</h2>
            <ul className="space-y-3">
              {['about_why_1', 'about_why_2', 'about_why_3', 'about_why_4'].map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary text-sm shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-600">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-dark mb-3">{t('about_team_title')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('about_team')}</p>
          </div>
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
