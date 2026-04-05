import Image from 'next/image';
import { Shield, RefreshCw, Zap, BadgeCheck } from 'lucide-react';

const PROVIDERS = [
  { name: 'Emirates NBD', logo: '/images/providers/emirates-nbd.png', bg: '#1A237E' },
  { name: 'FAB', logo: '/images/providers/fab.png', bg: '#004D40' },
  { name: 'ADCB', logo: '/images/providers/adcb.png' },
  { name: 'Mashreq', logo: '/images/providers/mashreq.png' },
  { name: 'HSBC', logo: '/images/providers/hsbc.png' },
  { name: 'DIB', logo: '/images/providers/dib.png', bg: '#00695C' },
  { name: 'RAKBANK', logo: '/images/providers/rakbank.png' },
  { name: 'Std Chartered', logo: '/images/providers/standard-chartered.png', bg: '#003DA5' },
  { name: 'Wise', logo: '/images/providers/wise.png' },
  { name: 'Al Ansari', logo: '/images/providers/al-ansari.png', bg: '#1B5E20' },
];

export default function TrustLogos() {
  return (
    <div className="bg-white border-t border-surface-100">
      <div className="max-w-content-xl mx-auto px-4 sm:px-8 py-5">
        <p className="text-center text-label text-gray-400 uppercase tracking-wider font-semibold mb-3">
          Compare products from {PROVIDERS.length}+ providers
        </p>
        <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6">
          {PROVIDERS.map((provider) => (
            <div
              key={provider.name}
              className="flex items-center gap-2 group"
              title={provider.name}
            >
              <div
                className="w-8 h-8 rounded-button overflow-hidden shrink-0 flex items-center justify-center p-0.5 opacity-50 group-hover:opacity-100 transition-opacity"
                style={provider.bg ? { backgroundColor: provider.bg } : undefined}
              >
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  width={28}
                  height={28}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              <span className="text-label font-medium text-gray-400 group-hover:text-gray-600 transition-colors hidden sm:block">
                {provider.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
