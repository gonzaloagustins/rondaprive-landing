import { useTranslation } from "react-i18next";
import { TrendingDown, Frown, Users, Eye } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const icons = [TrendingDown, Frown, Users, Eye];

const ProblemSection = () => {
  const { t } = useTranslation();
  const items = t("problem.items", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(213,168,90,0.06), transparent 60%)',
      }} />

      <div className="section-container">
        <SectionHeader
          label={t("problem.label")}
          title={t("problem.title")}
          titleHighlight={t("problem.titleHighlight")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {items.map((item, i) => {
            const Icon = icons[i];
            return (
              <div
                key={i}
                className={`card-premium p-6 space-y-4 hover:border-red-500/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in-delay-${i + 1}`}
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
