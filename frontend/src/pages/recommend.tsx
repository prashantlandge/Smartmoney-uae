import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import SmartRecommendQuiz from '@/components/recommend/SmartRecommendQuiz';
import { Sparkles } from 'lucide-react';

export default function RecommendPage() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Head>
        <title>{t('recommend_title')}</title>
        <meta name="description" content={t('recommend_meta')} />
      </Head>

      <section className="bg-gradient-to-br from-brand-nav via-brand-nav to-brand-nav-dark text-white">
        <div className="max-w-content-lg mx-auto px-4 sm:px-8 py-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-label font-semibold px-3 py-1.5 rounded-badge mb-3">
            <Sparkles size={12} />
            {t('recommend_badge')}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">{t('recommend_heading')}</h1>
          <p className="text-body-sm text-white/70 max-w-md mx-auto">
            {t('recommend_desc')}
          </p>
        </div>
      </section>

      <section className="bg-surface-50 py-10 px-4">
        <div className="max-w-lg mx-auto">
          <SmartRecommendQuiz />
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
