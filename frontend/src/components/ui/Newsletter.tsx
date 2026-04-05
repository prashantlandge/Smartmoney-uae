import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Mail, Check } from 'lucide-react';

export default function Newsletter() {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative py-16 px-4 bg-gradient-to-br from-brand-dark via-brand-dark-800 to-brand-primary overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />
      <div className="relative max-w-content-md mx-auto text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-5">
          <Mail size={24} className="text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Get weekly rate alerts & financial tips
        </h2>
        <p className="text-base text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
          Stay ahead with the best exchange rates and product offers for UAE expats
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-6 py-3 rounded-pill">
            <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <Check size={14} className="text-white" />
            </div>
            <span className="text-body-sm font-medium">You&apos;re subscribed! Check your inbox.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-5 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-button text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none transition-all"
            />
            <button type="submit" className="px-6 py-3.5 bg-white text-brand-primary font-semibold rounded-button hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg">
              Subscribe Free
            </button>
          </form>
        )}

        <p className="text-caption text-white/30 mt-4">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
