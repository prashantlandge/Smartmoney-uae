import { useTranslation } from 'next-i18next';
import FlagIcon from '@/components/ui/FlagIcon';

const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'PKR', name: 'Pakistani Rupee' },
  { code: 'PHP', name: 'Philippine Peso' },
  { code: 'BDT', name: 'Bangladeshi Taka' },
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
          className={`flex items-center gap-1.5 px-3 py-2 rounded-button text-xs font-medium transition-all ${
            value === c.code
              ? 'bg-brand-primary text-white shadow-sm'
              : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
          }`}
        >
          <FlagIcon code={c.code} size={16} />
          <span>{c.code}</span>
        </button>
      ))}
    </div>
  );
}
