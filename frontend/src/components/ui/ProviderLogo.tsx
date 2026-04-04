import Image from 'next/image';
import { useState } from 'react';

interface ProviderLogoProps {
  name: string;
  logoUrl?: string;
  size?: number;
  className?: string;
}

// Known provider logo URLs (official logos via clearbit)
const KNOWN_LOGOS: Record<string, string> = {
  // Remittance providers
  'wise': 'https://logo.clearbit.com/wise.com',
  'remitly': 'https://logo.clearbit.com/remitly.com',
  'western union': 'https://logo.clearbit.com/westernunion.com',
  'al ansari': 'https://logo.clearbit.com/alansariexchange.com',
  'al ansari exchange': 'https://logo.clearbit.com/alansariexchange.com',
  'uae exchange': 'https://logo.clearbit.com/unimoni.com',
  'unimoni': 'https://logo.clearbit.com/unimoni.com',
  'xpress money': 'https://logo.clearbit.com/xpressmoney.com',
  'worldremit': 'https://logo.clearbit.com/worldremit.com',
  'instarem': 'https://logo.clearbit.com/instarem.com',
  'ria': 'https://logo.clearbit.com/riamoneytransfer.com',
  'moneygram': 'https://logo.clearbit.com/moneygram.com',

  // UAE Banks
  'emirates nbd': 'https://logo.clearbit.com/emiratesnbd.com',
  'enbd': 'https://logo.clearbit.com/emiratesnbd.com',
  'fab': 'https://logo.clearbit.com/bankfab.com',
  'first abu dhabi bank': 'https://logo.clearbit.com/bankfab.com',
  'adcb': 'https://logo.clearbit.com/adcb.com',
  'abu dhabi commercial bank': 'https://logo.clearbit.com/adcb.com',
  'mashreq': 'https://logo.clearbit.com/mashreqbank.com',
  'mashreq bank': 'https://logo.clearbit.com/mashreqbank.com',
  'hsbc': 'https://logo.clearbit.com/hsbc.com',
  'dib': 'https://logo.clearbit.com/dib.ae',
  'dubai islamic bank': 'https://logo.clearbit.com/dib.ae',
  'rakbank': 'https://logo.clearbit.com/rakbank.ae',
  'cbd': 'https://logo.clearbit.com/cbd.ae',
  'commercial bank of dubai': 'https://logo.clearbit.com/cbd.ae',
  'noor bank': 'https://logo.clearbit.com/emiratesnbd.com',
  'standard chartered': 'https://logo.clearbit.com/sc.com',
  'citibank': 'https://logo.clearbit.com/citibank.com',
  'ajman bank': 'https://logo.clearbit.com/ajmanbank.ae',

  // Insurance providers
  'oman insurance': 'https://logo.clearbit.com/omaninsurance.ae',
  'orient insurance': 'https://logo.clearbit.com/orientinsurance.com',
  'axa': 'https://logo.clearbit.com/axa.ae',
  'salama': 'https://logo.clearbit.com/salama.ae',
  'sukoon': 'https://logo.clearbit.com/sukoon.com',
  'daman': 'https://logo.clearbit.com/damanhealth.ae',
  'tawuniya': 'https://logo.clearbit.com/tawuniya.com',
  'adnic': 'https://logo.clearbit.com/adnic.ae',
  'watania': 'https://logo.clearbit.com/watania.ae',
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

  // Determine the best logo URL: explicit prop > known mapping > fallback
  const resolvedUrl = (logoUrl && logoUrl !== '' && logoUrl !== '#') ? logoUrl : getKnownLogo(name);

  if (resolvedUrl && !imgError) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={resolvedUrl}
          alt={name}
          width={Math.round(size * 0.7)}
          height={Math.round(size * 0.7)}
          className="object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return <InitialsFallback name={name} size={size} className={className} />;
}
