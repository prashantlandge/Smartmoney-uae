import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SM</span>
              </div>
              <span className="font-bold text-lg">SmartMoney UAE</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              {t('footer_desc')}
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white/90">{t('footer_products')}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/" className="hover:text-white transition-colors">{t('nav_home')}</Link></li>
              <li><Link href="/credit-cards" className="hover:text-white transition-colors">{t('nav_credit_cards')}</Link></li>
              <li><Link href="/personal-loans" className="hover:text-white transition-colors">{t('nav_personal_loans')}</Link></li>
              <li><Link href="/islamic-finance" className="hover:text-white transition-colors">{t('nav_islamic_finance')}</Link></li>
            </ul>
          </div>

          {/* Insurance */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white/90">{t('footer_insurance')}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/car-insurance" className="hover:text-white transition-colors">{t('nav_car_insurance')}</Link></li>
              <li><Link href="/health-insurance" className="hover:text-white transition-colors">{t('nav_health_insurance')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white/90">{t('footer_company')}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/about" className="hover:text-white transition-colors">{t('nav_about')}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('nav_contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} SmartMoney UAE. {t('footer_rights')}
          </p>
          <p className="text-xs text-white/40">
            {t('footer_disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
