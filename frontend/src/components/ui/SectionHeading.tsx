interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`mb-10 sm:mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
