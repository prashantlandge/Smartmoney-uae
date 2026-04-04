import Image from 'next/image';
import { useState } from 'react';

interface ProviderLogoProps {
  name: string;
  logoUrl?: string;
  size?: number;
  className?: string;
}

interface LogoEntry {
  src: string;
  bg?: string; // background color for white-on-transparent logos
}

// Known provider logos — use PNGs (real logos) where available
const KNOWN_LOGOS: Record<string, LogoEntry> = {
  // Remittance providers
  'wise': { src: '/images/providers/wise.png' },
  'remitly': { src: '/images/providers/remitly.png' },
  'western union': { src: '/images/providers/western-union.png', bg: '#000000' },
  'al ansari': { src: '/images/providers/al-ansari.png', bg: '#1B5E20' },
  'al ansari exchange': { src: '/images/providers/al-ansari.png', bg: '#1B5E20' },
  'uae exchange': { src: '/images/providers/unimoni.svg' },
  'unimoni': { src: '/images/providers/unimoni.svg' },
  'xpress money': { src: '/images/providers/xpress-money.svg' },
  'worldremit': { src: '/images/providers/worldremit.svg' },
  'instarem': { src: '/images/providers/instarem.svg' },
  'ria': { src: '/images/providers/ria.svg' },
  'moneygram': { src: '/images/providers/moneygram.svg' },

  // UAE Banks
  'emirates nbd': { src: '/images/providers/emirates-nbd.png', bg: '#1A237E' },
  'enbd': { src: '/images/providers/emirates-nbd.png', bg: '#1A237E' },
  'fab': { src: '/images/providers/fab.png', bg: '#004D40' },
  'first abu dhabi bank': { src: '/images/providers/fab.png', bg: '#004D40' },
  'adcb': { src: '/images/providers/adcb.png' },
  'abu dhabi commercial bank': { src: '/images/providers/adcb.png' },
  'mashreq': { src: '/images/providers/mashreq.png' },
  'mashreq bank': { src: '/images/providers/mashreq.png' },
  'hsbc': { src: '/images/providers/hsbc.png' },
  'dib': { src: '/images/providers/dib.png', bg: '#00695C' },
  'dubai islamic bank': { src: '/images/providers/dib.png', bg: '#00695C' },
  'rakbank': { src: '/images/providers/rakbank.png' },
  'cbd': { src: '/images/providers/cbd.svg' },
  'commercial bank of dubai': { src: '/images/providers/cbd.svg' },
  'standard chartered': { src: '/images/providers/standard-chartered.png', bg: '#003DA5' },
  'citibank': { src: '/images/providers/citibank.svg' },

  // Insurance providers
  'oman insurance': { src: '/images/providers/oman-insurance.svg' },
  'orient insurance': { src: '/images/providers/orient-insurance.svg' },
  'axa': { src: '/images/providers/axa.svg' },
  'salama': { src: '/images/providers/salama.svg' },
  'sukoon': { src: '/images/providers/sukoon.svg' },
  'daman': { src: '/images/providers/daman.svg' },
  'adnic': { src: '/images/providers/adnic.svg' },
};

function getKnownLogo(name: string): LogoEntry | null {
  const key = name.toLowerCase().trim();
  return KNOWN_LOGOS[key] || null;
}

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

  // Resolve logo: explicit prop > known mapping > fallback
  const explicitUrl = (logoUrl && logoUrl !== '' && logoUrl !== '#') ? logoUrl : null;
  const knownEntry = getKnownLogo(name);
  const resolvedSrc = explicitUrl || knownEntry?.src;
  const bgColor = explicitUrl ? undefined : knownEntry?.bg;

  if (resolvedSrc && !imgError) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl overflow-hidden shrink-0 p-1 ${className}`}
        style={{ width: size, height: size, backgroundColor: bgColor }}
      >
        <Image
          src={resolvedSrc}
          alt={name}
          width={Math.round(size * 0.85)}
          height={Math.round(size * 0.85)}
          className="object-contain max-w-full max-h-full"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return <InitialsFallback name={name} size={size} className={className} />;
}
