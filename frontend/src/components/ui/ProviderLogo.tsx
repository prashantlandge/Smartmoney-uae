import Image from 'next/image';

interface ProviderLogoProps {
  name: string;
  logoUrl?: string;
  size?: number;
  className?: string;
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

export default function ProviderLogo({ name, logoUrl, size = 48, className = '' }: ProviderLogoProps) {
  if (logoUrl && logoUrl !== '' && logoUrl !== '#') {
    return (
      <Image
        src={logoUrl}
        alt={name}
        width={size}
        height={size}
        className={`rounded-xl object-contain ${className}`}
      />
    );
  }

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
