import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Music, Tent, Trophy, Wine, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/shared/PageHero";
import { industries } from "@/data/industries";

const iconMap: Record<string, React.FC<{ className?: string }>> = { Music, Tent, Trophy, Wine };

const Industries = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHero title={t("industries.label")} titleHighlight={t("industries.titleHighlight")} subtitle={t("industries.subtitle")} />

      <section className="pb-24">
        <div className="section-container space-y-16">
          {industries.map((ind, i) => {
            const Icon = iconMap[ind.icon] || Music;
            const isReverse = i % 2 === 1;
            return (
              <div key={ind.id} className={`grid lg:grid-cols-2 gap-10 items-center ${isReverse ? 'lg:grid-flow-dense' : ''}`}>
                <div className={`rounded-2xl overflow-hidden aspect-[16/10] ${isReverse ? 'lg:col-start-2' : ''}`}>
                  <img src={ind.image} alt={t(ind.titleKey)} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">{t(ind.titleKey)}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{t(ind.descriptionKey)}</p>
                  <div className="card-premium p-4 space-y-3">
                    <p className="text-xs uppercase tracking-wider text-red-400 font-semibold">Problema</p>
                    <p className="text-sm text-muted-foreground">{t(ind.problemKey)}</p>
                  </div>
                  <div className="card-premium p-4 space-y-3">
                    <p className="text-xs uppercase tracking-wider text-primary font-semibold">Solución</p>
                    <p className="text-sm text-muted-foreground">{t(ind.solutionKey)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{t(ind.useCasesKey)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-16">
        <div className="section-container text-center space-y-6">
          <Button variant="gold" size="lg" className="group" asChild>
            <Link to="/contacto">{t("navbar.requestDemo")} <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Industries;
