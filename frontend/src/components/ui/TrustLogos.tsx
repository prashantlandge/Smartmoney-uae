// Infinite scrolling trust/provider logos strip
const PROVIDERS = [
  { name: 'Wise', color: '#00B9FF' },
  { name: 'Remitly', color: '#2D3092' },
  { name: 'Western Union', color: '#FFDD00' },
  { name: 'Al Ansari', color: '#1B5E20' },
  { name: 'UAE Exchange', color: '#D32F2F' },
  { name: 'Emirates NBD', color: '#1A237E' },
  { name: 'FAB', color: '#004D40' },
  { name: 'ADCB', color: '#5D4037' },
  { name: 'Mashreq', color: '#FF6F00' },
  { name: 'HSBC', color: '#DB0011' },
  { name: 'Dubai Islamic', color: '#006064' },
  { name: 'RAKBANK', color: '#E65100' },
];

export default function TrustLogos() {
  // Duplicate for seamless loop
  const logos = [...PROVIDERS, ...PROVIDERS];

  return (
    <div className="py-8 overflow-hidden bg-white border-y border-surface-200">
      <p className="text-center text-caption text-gray-400 uppercase tracking-widest mb-5 font-semibold">
        Trusted providers we compare
      </p>
      <div className="relative">
        <div className="flex animate-scroll gap-12 items-center" style={{ width: 'max-content' }}>
          {logos.map((provider, idx) => (
            <div
              key={`${provider.name}-${idx}`}
              className="flex items-center gap-2 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: provider.color }}
              >
                {provider.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                {provider.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
