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
    <div className={`mb-8 sm:mb-10 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="text-heading-lg sm:text-display-lg font-bold text-brand-dark">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-body-sm sm:text-body-lg text-gray-500 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
