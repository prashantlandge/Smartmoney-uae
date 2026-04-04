import Image from 'next/image';

// Real bank/provider logos via logo.clearbit.com (official logos from company domains)
const PROVIDERS = [
  { name: 'Wise', logo: 'https://logo.clearbit.com/wise.com', color: '#00B9FF' },
  { name: 'Remitly', logo: 'https://logo.clearbit.com/remitly.com', color: '#2D3092' },
  { name: 'Western Union', logo: 'https://logo.clearbit.com/westernunion.com', color: '#FFDD00' },
  { name: 'Al Ansari Exchange', logo: 'https://logo.clearbit.com/alansariexchange.com', color: '#1B5E20' },
  { name: 'Emirates NBD', logo: 'https://logo.clearbit.com/emiratesnbd.com', color: '#1A237E' },
  { name: 'FAB', logo: 'https://logo.clearbit.com/bankfab.com', color: '#004D40' },
  { name: 'ADCB', logo: 'https://logo.clearbit.com/adcb.com', color: '#5D4037' },
  { name: 'Mashreq', logo: 'https://logo.clearbit.com/mashreqbank.com', color: '#FF6F00' },
  { name: 'HSBC', logo: 'https://logo.clearbit.com/hsbc.com', color: '#DB0011' },
  { name: 'Dubai Islamic Bank', logo: 'https://logo.clearbit.com/dib.ae', color: '#006064' },
  { name: 'RAKBANK', logo: 'https://logo.clearbit.com/rakbank.ae', color: '#E65100' },
  { name: 'ENBD', logo: 'https://logo.clearbit.com/emiratesnbd.com', color: '#1A237E' },
];

function LogoFallback({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
      style={{ backgroundColor: color }}
    >
      {name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
    </div>
  );
}

function ProviderItem({ name, logo, color }: { name: string; logo: string; color: string }) {
  return (
    <div className="flex items-center gap-3 shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300 group">
      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:shadow-md transition-shadow">
        <Image
          src={logo}
          alt={name}
          width={28}
          height={28}
          className="object-contain"
          onError={(e) => {
            // Hide broken image, fallback handled by CSS
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              parent.style.backgroundColor = color;
              parent.innerHTML = `<span class="text-white text-xs font-bold">${name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}</span>`;
            }
          }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600 whitespace-nowrap group-hover:text-gray-900 transition-colors">
        {name}
      </span>
    </div>
  );
}

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
        <div className="flex animate-scroll gap-14 items-center" style={{ width: 'max-content' }}>
          {logos.map((provider, idx) => (
            <ProviderItem key={`${provider.name}-${idx}`} {...provider} />
          ))}
        </div>
      </div>
    </div>
  );
}
