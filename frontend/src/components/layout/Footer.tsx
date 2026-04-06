import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Globe, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-primary text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-content-xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-start">
              <h3 className="text-base font-bold text-white">{t('newsletter_title')}</h3>
              <p className="text-sm text-white/60">{t('newsletter_subtitle')}</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder={t('newsletter_placeholder')}
                className="flex-1 sm:w-56 px-4 py-2.5 bg-white/10 border border-white/20 rounded-button text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <button type="submit" className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-button hover:bg-accent-600 transition-colors">
                {t('newsletter_button')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-content-xl mx-auto px-4 md:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-3">
              <Image
                src="/images/logo-white.svg"
                alt="SmartMoney UAE"
                width={150}
                height={30}
                className="h-7 w-auto"
              />
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-4 max-w-xs">
              {t('footer_desc')}
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors" aria-label="Website">
                <Globe size={14} className="text-white/70" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors" aria-label="Email">
                <Mail size={14} className="text-white/70" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors" aria-label="Chat">
                <MessageCircle size={14} className="text-white/70" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">{t('footer_products')}</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="/credit-cards" className="hover:text-white transition-colors">{t('nav_credit_cards')}</Link></li>
              <li><Link href="/personal-loans" className="hover:text-white transition-colors">{t('nav_personal_loans')}</Link></li>
              <li><Link href="/islamic-finance" className="hover:text-white transition-colors">{t('nav_islamic_finance')}</Link></li>
              <li><Link href="/car-insurance" className="hover:text-white transition-colors">{t('nav_car_insurance')}</Link></li>
              <li><Link href="/health-insurance" className="hover:text-white transition-colors">{t('nav_health_insurance')}</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">{t('footer_tools')}</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="/calculators" className="hover:text-white transition-colors">{t('nav_calculators')}</Link></li>
              <li><Link href="/tax" className="hover:text-white transition-colors">{t('nav_tax')}</Link></li>
              <li><Link href="/recommend" className="hover:text-white transition-colors">{t('nav_smart_compare')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">{t('footer_company')}</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="/about" className="hover:text-white transition-colors">{t('nav_about')}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('nav_contact')}</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">{t('nav_home')}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} SmartMoney UAE. {t('footer_rights')}
          </p>
          <p className="text-xs text-white/30">
            {t('footer_disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
