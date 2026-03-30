import { useTranslation } from 'next-i18next';

interface Props {
  matchScore: number | null;
  matchReason: string | null;
}

export default function SmartInsight({ matchScore, matchReason }: Props) {
  const { t } = useTranslation('common');

  if (!matchScore || !matchReason) return null;

  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 60) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  return (
    <div className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getColor(matchScore)}`}>
      <span>{t('ai_match')}: {matchScore}%</span>
      <span className="hidden sm:inline">— {matchReason}</span>
    </div>
  );
}
