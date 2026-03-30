import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

const PageHero = ({
  title,
  titleHighlight,
  subtitle,
  children,
  className,
  compact = false,
}: PageHeroProps) => {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        compact ? "pt-28 pb-12" : "pt-32 pb-20",
        className
      )}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(213,168,90,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div className="section-container text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-fade-in-up">
          {title}{" "}
          {titleHighlight && (
            <span className="text-gradient-gold">{titleHighlight}</span>
          )}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto animate-fade-in-delay-1">
            {subtitle}
          </p>
        )}
        {children && (
          <div className="mt-8 animate-fade-in-delay-2">
            {children}
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
