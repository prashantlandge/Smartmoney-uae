import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Globe, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-brand-dark text-white">
      {/* Gradient top line */}
      <div className="h-1 bg-gradient-to-r from-brand-primary via-brand-gold to-brand-secondary" />

      <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-primary to-brand-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">SM</span>
              </div>
              <span className="font-bold text-lg tracking-tight">SmartMoney UAE</span>
            </div>
            <p className="text-body-sm text-white/50 leading-relaxed mb-5 max-w-xs">
              {t('footer_desc')}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Website">
                <Globe size={16} className="text-white/60" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Email">
                <Mail size={16} className="text-white/60" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Chat">
                <MessageCircle size={16} className="text-white/60" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">{t('footer_products')}</h4>
            <ul className="space-y-2.5 text-body-sm text-white/50">
              <li><Link href="/" className="hover:text-white transition-colors">{t('nav_home')}</Link></li>
              <li><Link href="/credit-cards" className="hover:text-white transition-colors">{t('nav_credit_cards')}</Link></li>
              <li><Link href="/personal-loans" className="hover:text-white transition-colors">{t('nav_personal_loans')}</Link></li>
              <li><Link href="/islamic-finance" className="hover:text-white transition-colors">{t('nav_islamic_finance')}</Link></li>
            </ul>
          </div>

          {/* Insurance */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">{t('footer_insurance')}</h4>
            <ul className="space-y-2.5 text-body-sm text-white/50">
              <li><Link href="/car-insurance" className="hover:text-white transition-colors">{t('nav_car_insurance')}</Link></li>
              <li><Link href="/health-insurance" className="hover:text-white transition-colors">{t('nav_health_insurance')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">{t('footer_company')}</h4>
            <ul className="space-y-2.5 text-body-sm text-white/50">
              <li><Link href="/about" className="hover:text-white transition-colors">{t('nav_about')}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('nav_contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-caption text-white/30">
            &copy; {new Date().getFullYear()} SmartMoney UAE. {t('footer_rights')}
          </p>
          <p className="text-caption text-white/30">
            {t('footer_disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
