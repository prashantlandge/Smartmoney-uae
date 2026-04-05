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

const TRUST_POINTS = [
  { icon: BadgeCheck, text: 'Free & Unbiased' },
  { icon: RefreshCw, text: 'Updated Daily' },
  { icon: Shield, text: 'CBUAE Regulated Banks' },
  { icon: Zap, text: '50+ Products Compared' },
];

export default function TrustLogos() {
  return (
    <div className="bg-white border-b border-surface-100">
      {/* Trust points strip */}
      <div className="border-b border-surface-100">
        <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-center flex-wrap gap-x-8 gap-y-2">
            {TRUST_POINTS.map((point) => (
              <div key={point.text} className="flex items-center gap-2 text-sm text-gray-500">
                <point.icon size={16} className="text-brand-primary shrink-0" />
                <span className="font-medium">{point.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Static provider logos grid */}
      <div className="max-w-content-xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold mb-5">
          Compare products from {PROVIDERS.length}+ providers
        </p>
        <div className="flex items-center justify-center flex-wrap gap-5 sm:gap-8">
          {PROVIDERS.map((provider) => (
            <div
              key={provider.name}
              className="flex items-center gap-2.5 group"
              title={provider.name}
            >
              <div
                className="w-9 h-9 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                style={provider.bg ? { backgroundColor: provider.bg } : undefined}
              >
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  width={32}
                  height={32}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              <span className="text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors hidden sm:block">
                {provider.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
