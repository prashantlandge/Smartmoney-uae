import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import CountUp from '@/components/ui/CountUp';
import { Check, Users, Package, LayoutGrid, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  const { t } = useTranslation('common');

  const stats = [
    { icon: Users, value: 20, suffix: '+', label: t('about_providers') },
    { icon: Package, value: 50, suffix: '+', label: t('about_products') },
    { icon: LayoutGrid, value: 6, suffix: '', label: t('about_categories') },
  ];

  return (
    <Layout>
      <Head>
        <title>{t('about_title')} — SmartMoney UAE</title>
      </Head>

      <section className="bg-gradient-to-br from-blue-950 to-brand-primary text-white py-16 sm:py-20 px-4">
        <Container size="md">
          <div className="text-center">
            <h1 className="text-display-lg font-bold mb-3">{t('about_title')}</h1>
            <p className="text-body-lg text-white/70">{t('about_hero')}</p>
          </div>
        </Container>
      </section>

      <section className="section-padding">
        <Container size="md">
          {/* Mission */}
          <div className="mb-12">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">{t('about_mission_title')}</h2>
            <div className="border-s-4 border-brand-primary ps-5">
              <p className="text-body-lg text-gray-600 leading-relaxed">{t('about_mission')}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {stats.map((stat) => (
              <div key={stat.label} className="card-hover text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary-50 flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={22} className="text-brand-primary" />
                </div>
                <div className="text-display-lg font-bold text-brand-primary mb-1">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-body-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Why Us */}
          <div className="mb-12">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-5">{t('about_why_title')}</h2>
            <ul className="space-y-4">
              {['about_why_1', 'about_why_2', 'about_why_3', 'about_why_4'].map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-brand-primary rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-body-lg text-gray-600">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Team */}
          <div className="mb-12">
            <h2 className="text-heading-lg font-bold text-brand-dark mb-4">{t('about_team_title')}</h2>
            <p className="text-body-lg text-gray-600 leading-relaxed">{t('about_team')}</p>
          </div>

          {/* CTA */}
          <div className="text-center py-8 bg-surface-50 rounded-card">
            <h3 className="text-heading-md font-bold text-brand-dark mb-3">Ready to start comparing?</h3>
            <Link href="/" className="btn-primary inline-flex">
              Compare rates now
              <ChevronRight size={16} />
            </Link>
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
