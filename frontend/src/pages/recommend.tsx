import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import SmartRecommendQuiz from '@/components/recommend/SmartRecommendQuiz';
import { Sparkles } from 'lucide-react';

export default function RecommendPage() {
  return (
    <Layout>
      <Head>
        <title>Smart Recommendations — SmartMoney UAE</title>
        <meta name="description" content="Get AI-powered personalized financial product recommendations based on your profile and preferences." />
      </Head>

      <section className="bg-gradient-to-br from-brand-nav via-brand-nav-dark to-brand-primary text-white">
        <div className="max-w-content-lg mx-auto px-4 sm:px-8 py-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-label font-semibold px-3 py-1.5 rounded-badge mb-3">
            <Sparkles size={12} />
            AI-Powered
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Smart Recommendations</h1>
          <p className="text-body-sm text-white/70 max-w-md mx-auto">
            Answer 3 quick questions and our AI will match you with the best financial products in the UAE
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
