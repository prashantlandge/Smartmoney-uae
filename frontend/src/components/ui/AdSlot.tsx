import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

type AdFormat = 'auto' | 'rectangle' | 'horizontal' | 'vertical';

interface AdSlotProps {
  slot: string;
  format?: AdFormat;
  className?: string;
}

const FORMAT_STYLES: Record<AdFormat, React.CSSProperties> = {
  auto: { display: 'block' },
  rectangle: { display: 'inline-block', width: 336, height: 280 },
  horizontal: { display: 'block', height: 90 },
  vertical: { display: 'inline-block', width: 160, height: 600 },
};

export default function AdSlot({ slot, format = 'auto', className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pushed.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      console.error('AdSense push error:', e);
    }
  }, []);

  if (typeof window === 'undefined') {
    return null;
  }

  const style = FORMAT_STYLES[format];

  return (
    <div className={`ad-slot text-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format === 'auto' ? 'auto' : undefined}
        data-full-width-responsive={format === 'auto' || format === 'horizontal' ? 'true' : undefined}
      />
    </div>
  );
}
