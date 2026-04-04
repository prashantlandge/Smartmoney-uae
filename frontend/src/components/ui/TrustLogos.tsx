import Image from 'next/image';

const PROVIDERS = [
  { name: 'Wise', logo: '/images/providers/wise.svg' },
  { name: 'Remitly', logo: '/images/providers/remitly.png' },
  { name: 'Western Union', logo: '/images/providers/western-union.svg' },
  { name: 'Al Ansari', logo: '/images/providers/al-ansari.svg' },
  { name: 'Emirates NBD', logo: '/images/providers/emirates-nbd.svg' },
  { name: 'FAB', logo: '/images/providers/fab.svg' },
  { name: 'ADCB', logo: '/images/providers/adcb.png' },
  { name: 'Mashreq', logo: '/images/providers/mashreq.png' },
  { name: 'HSBC', logo: '/images/providers/hsbc.svg' },
  { name: 'Dubai Islamic Bank', logo: '/images/providers/dib.png' },
  { name: 'RAKBANK', logo: '/images/providers/rakbank.svg' },
  { name: 'Standard Chartered', logo: '/images/providers/standard-chartered.png' },
];

export default function TrustLogos() {
  const logos = [...PROVIDERS, ...PROVIDERS];

  return (
    <div className="py-10 overflow-hidden bg-white border-y border-surface-100">
      <p className="text-center text-caption text-gray-400 uppercase tracking-[0.15em] mb-6 font-semibold">
        Trusted providers &amp; banks we compare
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="flex animate-scroll gap-10 items-center" style={{ width: 'max-content' }}>
          {logos.map((provider, idx) => (
            <div
              key={`${provider.name}-${idx}`}
              className="flex items-center gap-3 shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  width={40}
                  height={40}
                  className="object-contain w-full h-full"
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
