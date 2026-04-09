import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  titleHighlight?: string;
  titleEnd?: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionHeader = ({
  label,
  title,
  titleHighlight,
  titleEnd,
  subtitle,
  centered = true,
  className,
}: SectionHeaderProps) => {
  return (
    <div className={cn(centered ? "text-center" : "text-left", "max-w-3xl", centered && "mx-auto", className)}>
      {label && (
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-6">
          {label}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mt-4">
        {title}{" "}
        {titleHighlight && (
          <span className="text-gradient-gold">{titleHighlight}</span>
        )}
        {titleEnd && ` ${titleEnd}`}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
