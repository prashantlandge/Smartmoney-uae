import Image from 'next/image';
import { useTranslation } from 'next-i18next';

const PROVIDERS = [
  { name: 'Emirates NBD', logo: '/images/providers/emirates-nbd.png' },
  { name: 'FAB', logo: '/images/providers/fab.png' },
  { name: 'ADCB', logo: '/images/providers/adcb.png' },
  { name: 'Mashreq', logo: '/images/providers/mashreq.png' },
  { name: 'HSBC', logo: '/images/providers/hsbc.png' },
  { name: 'DIB', logo: '/images/providers/dib.png' },
  { name: 'RAKBANK', logo: '/images/providers/rakbank.png' },
  { name: 'Std Chartered', logo: '/images/providers/standard-chartered.png' },
  { name: 'Wise', logo: '/images/providers/wise.png' },
  { name: 'Al Ansari', logo: '/images/providers/al-ansari.png' },
];

export default function TrustLogos() {
  const { t } = useTranslation('common');
  return (
    <div className="bg-white border-y border-surface-100 py-5">
      <div className="max-w-content-xl mx-auto px-4 sm:px-8">
        <p className="text-center text-label text-gray-400 uppercase tracking-wider font-semibold mb-4">
          {t('trust_logos_title')}
        </p>
        <div className="grid grid-cols-5 sm:flex sm:items-center sm:justify-center sm:flex-wrap gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-3">
          {PROVIDERS.map((p) => (
            <div key={p.name} className="flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all" title={p.name}>
              <Image
                src={p.logo}
                alt={p.name}
                width={80}
                height={32}
                className="h-5 sm:h-8 w-auto max-w-[56px] sm:max-w-[80px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
