import Image from 'next/image';

// bg: brand background color for white-on-transparent logos
const PROVIDERS = [
  { name: 'Wise', logo: '/images/providers/wise.png' },
  { name: 'Remitly', logo: '/images/providers/remitly.png' },
  { name: 'Western Union', logo: '/images/providers/western-union.png', bg: '#000000' },
  { name: 'Al Ansari', logo: '/images/providers/al-ansari.png', bg: '#1B5E20' },
  { name: 'Emirates NBD', logo: '/images/providers/emirates-nbd.png', bg: '#1A237E' },
  { name: 'FAB', logo: '/images/providers/fab.png', bg: '#004D40' },
  { name: 'ADCB', logo: '/images/providers/adcb.png' },
  { name: 'Mashreq', logo: '/images/providers/mashreq.png' },
  { name: 'HSBC', logo: '/images/providers/hsbc.png' },
  { name: 'Dubai Islamic Bank', logo: '/images/providers/dib.png', bg: '#00695C' },
  { name: 'RAKBANK', logo: '/images/providers/rakbank.png' },
  { name: 'Standard Chartered', logo: '/images/providers/standard-chartered.png', bg: '#003DA5' },
];

export default function TrustLogos() {
  const logos = [...PROVIDERS, ...PROVIDERS];

  return (
    <div className="py-12 overflow-hidden bg-white border-y border-surface-100">
      <p className="text-center text-caption text-gray-400 uppercase tracking-[0.15em] mb-6 font-semibold">
        Trusted providers &amp; banks we compare
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="flex animate-scroll gap-10 items-center" style={{ width: 'max-content' }}>
          {logos.map((provider, idx) => (
            <div
              key={`${provider.name}-${idx}`}
              className="flex items-center gap-3 shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
              <div
                className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1"
                style={provider.bg ? { backgroundColor: provider.bg } : undefined}
              >
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  width={36}
                  height={36}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                {provider.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
