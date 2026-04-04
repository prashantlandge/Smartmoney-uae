import Image from 'next/image';
import { useState } from 'react';

interface ProviderLogoProps {
  name: string;
  logoUrl?: string;
  size?: number;
  className?: string;
}

// Known provider logos - prefer real images, fall back to branded SVG
const KNOWN_LOGOS: Record<string, string> = {
  // Remittance providers
  'wise': '/images/providers/wise.svg',
  'remitly': '/images/providers/remitly.png',
  'western union': '/images/providers/western-union.svg',
  'al ansari': '/images/providers/al-ansari.svg',
  'al ansari exchange': '/images/providers/al-ansari.svg',
  'uae exchange': '/images/providers/unimoni.svg',
  'unimoni': '/images/providers/unimoni.svg',
  'xpress money': '/images/providers/xpress-money.svg',
  'worldremit': '/images/providers/worldremit.svg',
  'instarem': '/images/providers/instarem.svg',
  'ria': '/images/providers/ria.svg',
  'moneygram': '/images/providers/moneygram.svg',

  // UAE Banks - real logos where available
  'emirates nbd': '/images/providers/emirates-nbd.svg',
  'enbd': '/images/providers/emirates-nbd.svg',
  'fab': '/images/providers/fab.svg',
  'first abu dhabi bank': '/images/providers/fab.svg',
  'adcb': '/images/providers/adcb.png',
  'abu dhabi commercial bank': '/images/providers/adcb.png',
  'mashreq': '/images/providers/mashreq.png',
  'mashreq bank': '/images/providers/mashreq.png',
  'hsbc': '/images/providers/hsbc.svg',
  'dib': '/images/providers/dib.png',
  'dubai islamic bank': '/images/providers/dib.png',
  'rakbank': '/images/providers/rakbank.svg',
  'cbd': '/images/providers/cbd.svg',
  'commercial bank of dubai': '/images/providers/cbd.svg',
  'standard chartered': '/images/providers/standard-chartered.png',
  'citibank': '/images/providers/citibank.svg',

  // Insurance providers
  'oman insurance': '/images/providers/oman-insurance.svg',
  'orient insurance': '/images/providers/orient-insurance.svg',
  'axa': '/images/providers/axa.svg',
  'salama': '/images/providers/salama.svg',
  'sukoon': '/images/providers/sukoon.svg',
  'daman': '/images/providers/daman.svg',
  'adnic': '/images/providers/adnic.svg',
};

function getKnownLogo(name: string): string | null {
  const key = name.toLowerCase().trim();
  return KNOWN_LOGOS[key] || null;
}

// Generate a consistent color from a string
function hashColor(str: string): string {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-purple-500 to-purple-600',
    'from-rose-500 to-rose-600',
    'from-amber-500 to-amber-600',
    'from-cyan-500 to-cyan-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function InitialsFallback({ name, size, className }: { name: string; size: number; className: string }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const gradient = hashColor(name);

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white font-bold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

export default function ProviderLogo({ name, logoUrl, size = 48, className = '' }: ProviderLogoProps) {
  const [imgError, setImgError] = useState(false);

  const resolvedUrl = (logoUrl && logoUrl !== '' && logoUrl !== '#') ? logoUrl : getKnownLogo(name);

  if (resolvedUrl && !imgError) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl overflow-hidden shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={resolvedUrl}
          alt={name}
          width={size}
          height={size}
          className="object-contain w-full h-full"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return <InitialsFallback name={name} size={size} className={className} />;
}
