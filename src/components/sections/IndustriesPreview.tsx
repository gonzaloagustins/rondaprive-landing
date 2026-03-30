import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Music, Tent, Trophy, Wine, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import { industries } from "@/data/industries";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Music, Tent, Trophy, Wine,
};

const IndustriesPreview = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(industries[0].id);
  const active = industries.find(i => i.id === activeId) || industries[0];
  const ActiveIcon = iconMap[active.icon] || Music;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="section-container">
        <SectionHeader
          label={t("industries.label")}
          title={t("industries.title")}
          titleHighlight={t("industries.titleHighlight")}
          subtitle={t("industries.subtitle")}
        />

        {/* Industry tabs */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {industries.map((ind) => {
            const IndIcon = iconMap[ind.icon] || Music;
            return (
              <button
                key={ind.id}
                onClick={() => setActiveId(ind.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeId === ind.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'glass-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <IndIcon className="w-4 h-4" />
                {t(ind.titleKey)}
              </button>
            );
          })}
        </div>

        {/* Active industry detail */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-2xl overflow-hidden aspect-[16/10]">
            <img
              src={active.image}
              alt={t(active.titleKey)}
              className="w-full h-full object-cover transition-all duration-500"
              loading="lazy"
            />
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ActiveIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">{t(active.titleKey)}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{t(active.descriptionKey)}</p>

            <div className="space-y-3">
              <div className="card-premium p-4">
                <p className="text-xs uppercase tracking-wider text-red-400 font-semibold mb-1">Problema</p>
                <p className="text-sm text-muted-foreground">{t(active.problemKey)}</p>
              </div>
              <div className="card-premium p-4">
                <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Solución</p>
                <p className="text-sm text-muted-foreground">{t(active.solutionKey)}</p>
              </div>
            </div>

            <Button variant="gold-outline" className="group" asChild>
              <Link to="/industrias">
                {t("common.learnMore")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesPreview;
