import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Globe, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-3">
              <Image
                src="/images/logo-white.svg"
                alt="SmartMoney UAE"
                width={160}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-body-sm text-gray-400 leading-relaxed mb-4 max-w-xs">
              {t('footer_desc')}
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 rounded-button bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Website">
                <Globe size={14} className="text-gray-400" />
              </a>
              <a href="#" className="w-8 h-8 rounded-button bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Email">
                <Mail size={14} className="text-gray-400" />
              </a>
              <a href="#" className="w-8 h-8 rounded-button bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Chat">
                <MessageCircle size={14} className="text-gray-400" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-body-sm mb-3 text-white/90">{t('footer_products')}</h4>
            <ul className="space-y-2 text-body-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">{t('nav_home')}</Link></li>
              <li><Link href="/credit-cards" className="hover:text-white transition-colors">{t('nav_credit_cards')}</Link></li>
              <li><Link href="/personal-loans" className="hover:text-white transition-colors">{t('nav_personal_loans')}</Link></li>
              <li><Link href="/islamic-finance" className="hover:text-white transition-colors">{t('nav_islamic_finance')}</Link></li>
            </ul>
          </div>

          {/* Insurance */}
          <div>
            <h4 className="font-semibold text-body-sm mb-3 text-white/90">{t('footer_insurance')}</h4>
            <ul className="space-y-2 text-body-sm text-gray-400">
              <li><Link href="/car-insurance" className="hover:text-white transition-colors">{t('nav_car_insurance')}</Link></li>
              <li><Link href="/health-insurance" className="hover:text-white transition-colors">{t('nav_health_insurance')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-body-sm mb-3 text-white/90">{t('footer_company')}</h4>
            <ul className="space-y-2 text-body-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">{t('nav_about')}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('nav_contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-label text-gray-500">
            &copy; {new Date().getFullYear()} SmartMoney UAE. {t('footer_rights')}
          </p>
          <p className="text-label text-gray-500">
            {t('footer_disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
