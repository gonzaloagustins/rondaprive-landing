import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Music, Tent, Trophy, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { industries } from "@/data/industries";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const VALID_IDS = ["nightclubs", "festivals", "stadiums", "bars"] as const;
const DEFAULT_ID = "festivals";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Music,
  Tent,
  Trophy,
  Wine,
};

const IndustriesPreview = () => {
  const { t } = useTranslation();
  const { path } = useLocalizedPath();
  const [searchParams, setSearchParams] = useSearchParams();
  const tipo = searchParams.get("tipo") ?? DEFAULT_ID;
  const activeId = (VALID_IDS as readonly string[]).includes(tipo) ? tipo : DEFAULT_ID;
  const active = industries.find((i) => i.id === activeId) || industries[1];
  const activeTitle = t(`industries.${activeId}.title`);
  const useCases = t(`industriesPreview.useCases.${activeId}`, {
    returnObjects: true,
    defaultValue: [],
  }) as string[];

  const selectTab = (id: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tipo", id);
        return next;
      },
      { replace: true, preventScrollReset: true }
    );
  };

  return (
    <section className="section-dark py-24" id="soluciones">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            {t("industriesPreview.eyebrow")}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4">
            {t("industriesPreview.title")}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("industriesPreview.subtitle")}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {industries.map((ind) => {
            const IndIcon = iconMap[ind.icon] || Music;
            const isActive = activeId === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => selectTab(ind.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[#F0EBE3] text-[#1A1814] shadow-sm"
                    : "border border-[hsl(28,10%,20%)] text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                <IndIcon className="w-4 h-4" />
                {t(`industries.${ind.id}.title`)}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-12 grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden aspect-[16/10]">
            <img
              src={active.image}
              alt={activeTitle}
              width={1200}
              height={750}
              className="w-full h-full object-cover transition-all duration-500"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Text */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {t("industriesPreview.labels.problem")}
              </span>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {t(`industries.${activeId}.problem`)}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {t("industriesPreview.labels.solution")}
              </span>
              <p className="mt-2 font-medium leading-relaxed">
                {t(`industries.${activeId}.solution`)}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {t("industriesPreview.labels.useCases")}
              </span>
              <div className="flex flex-wrap gap-2 mt-3">
                {useCases.map((pill, i) => (
                  <span
                    key={i}
                    className="border border-[hsl(28,10%,25%)] text-xs px-3 py-1.5 rounded-full text-muted-foreground"
                  >
                    • {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="gold"
                size="lg"
                className="group rounded-full"
                asChild
              >
                <Link to={`${path("contact")}?industria=${activeId}`}>
                  {t("industriesPreview.ctaTalk", { industry: activeTitle.toLowerCase() })}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesPreview;
