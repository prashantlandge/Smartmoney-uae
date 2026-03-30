import { useTranslation } from 'next-i18next';

const CURRENCIES = [
  { code: 'INR', flag: '🇮🇳', name: 'Indian Rupee' },
  { code: 'PKR', flag: '🇵🇰', name: 'Pakistani Rupee' },
  { code: 'PHP', flag: '🇵🇭', name: 'Philippine Peso' },
  { code: 'BDT', flag: '🇧🇩', name: 'Bangladeshi Taka' },
];

interface Props {
  value: string;
  onChange: (currency: string) => void;
}

export default function CurrencySelector({ value, onChange }: Props) {
  const { t } = useTranslation('common');

  return (
    <div className="flex gap-1.5 mb-2">
      {CURRENCIES.map((c) => (
        <button
          key={c.code}
          onClick={() => onChange(c.code)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            value === c.code
              ? 'bg-brand-primary text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span>{c.flag}</span>
          <span>{c.code}</span>
        </button>
      ))}
    </div>
  );
}
