import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Globe, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-[#1e2a4a] text-white">
      <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-5">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-2">
              <Image
                src="/images/logo-white.svg"
                alt="SmartMoney UAE"
                width={130}
                height={26}
                className="h-6 w-auto"
              />
            </div>
            <p className="text-label text-gray-400 leading-relaxed mb-3 max-w-xs">
              {t('footer_desc')}
            </p>
            <div className="flex gap-1.5">
              <a href="#" className="w-7 h-7 rounded-button bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Website">
                <Globe size={12} className="text-gray-400" />
              </a>
              <a href="#" className="w-7 h-7 rounded-button bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Email">
                <Mail size={12} className="text-gray-400" />
              </a>
              <a href="#" className="w-7 h-7 rounded-button bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Chat">
                <MessageCircle size={12} className="text-gray-400" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-label mb-2 text-white/90">{t('footer_products')}</h4>
            <ul className="space-y-1.5 text-label text-gray-400">
              <li><Link href="/credit-cards" className="hover:text-white transition-colors">{t('nav_credit_cards')}</Link></li>
              <li><Link href="/personal-loans" className="hover:text-white transition-colors">{t('nav_personal_loans')}</Link></li>
              <li><Link href="/islamic-finance" className="hover:text-white transition-colors">{t('nav_islamic_finance')}</Link></li>
              <li><Link href="/car-insurance" className="hover:text-white transition-colors">{t('nav_car_insurance')}</Link></li>
              <li><Link href="/health-insurance" className="hover:text-white transition-colors">{t('nav_health_insurance')}</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold text-label mb-2 text-white/90">{t('footer_tools')}</h4>
            <ul className="space-y-1.5 text-label text-gray-400">
              <li><Link href="/calculators" className="hover:text-white transition-colors">{t('nav_calculators')}</Link></li>
              <li><Link href="/tax" className="hover:text-white transition-colors">{t('nav_tax')}</Link></li>
              <li><Link href="/recommend" className="hover:text-white transition-colors">{t('nav_smart_compare')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-label mb-2 text-white/90">{t('footer_company')}</h4>
            <ul className="space-y-1.5 text-label text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">{t('nav_about')}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('nav_contact')}</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">{t('nav_home')}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-4 pt-3 flex flex-col sm:flex-row justify-between items-center gap-1">
          <p className="text-[10px] text-gray-500">
            &copy; {new Date().getFullYear()} SmartMoney UAE. {t('footer_rights')}
          </p>
          <p className="text-[10px] text-gray-500">
            {t('footer_disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
