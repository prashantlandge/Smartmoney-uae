import Image from 'next/image';

const FLAG_MAP: Record<string, { src: string; alt: string }> = {
  AED: { src: '/images/flags/ae.svg', alt: 'UAE' },
  INR: { src: '/images/flags/in.svg', alt: 'India' },
  PKR: { src: '/images/flags/pk.svg', alt: 'Pakistan' },
  PHP: { src: '/images/flags/ph.svg', alt: 'Philippines' },
  BDT: { src: '/images/flags/bd.svg', alt: 'Bangladesh' },
  LKR: { src: '/images/flags/lk.svg', alt: 'Sri Lanka' },
};

// Country code to currency mapping
const COUNTRY_FLAGS: Record<string, { src: string; alt: string }> = {
  ae: { src: '/images/flags/ae.svg', alt: 'UAE' },
  in: { src: '/images/flags/in.svg', alt: 'India' },
  pk: { src: '/images/flags/pk.svg', alt: 'Pakistan' },
  ph: { src: '/images/flags/ph.svg', alt: 'Philippines' },
  bd: { src: '/images/flags/bd.svg', alt: 'Bangladesh' },
  lk: { src: '/images/flags/lk.svg', alt: 'Sri Lanka' },
};

interface FlagIconProps {
  code: string; // currency code (AED, INR) or country code (ae, in)
  size?: number;
  className?: string;
}

export default function FlagIcon({ code, size = 20, className = '' }: FlagIconProps) {
  const flag = FLAG_MAP[code.toUpperCase()] || COUNTRY_FLAGS[code.toLowerCase()];
  if (!flag) return null;

  return (
    <Image
      src={flag.src}
      alt={flag.alt}
      width={size}
      height={Math.round(size * 0.75)}
      className={`inline-block rounded-sm ${className}`}
    />
  );
}
