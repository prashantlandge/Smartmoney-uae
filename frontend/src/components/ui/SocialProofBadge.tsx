import { Users } from 'lucide-react';

interface Props {
  count: number;
  label?: string;
  className?: string;
}

export default function SocialProofBadge({ count, label = 'users like you chose this', className = '' }: Props) {
  if (count < 2) return null;

  return (
    <div className={`flex items-center gap-1.5 text-[10px] text-gray-500 ${className}`}>
      <Users size={10} className="text-brand-primary shrink-0" />
      <span>{count} {label}</span>
    </div>
  );
}
