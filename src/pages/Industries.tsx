import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Music, Tent, Trophy, Wine, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/shared/PageHero";
import SEO from "@/components/shared/SEO";
import { industries } from "@/data/industries";

const iconMap: Record<string, React.FC<{ className?: string }>> = { Music, Tent, Trophy, Wine };

const Industries = () => {
  const { t } = useTranslation();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace(/^#/, "");
    // Wait for layout + lazy images to settle before scrolling. The CSS rule
    // html { scroll-behavior: smooth } already animates the jump; we use the
    // default behavior here so the scroll fires reliably even in environments
    // where prefers-reduced-motion blocks programmatic smooth scrolling.
    const timeout = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
    }, 200);
    return () => clearTimeout(timeout);
  }, [hash]);

  return (
    <>
      <SEO
        title="Soluciones por industria"
        description="Cómo Ronda Privé se adapta a festivales, estadios, nightclubs, bares y venues. Casos por tipo de recinto."
      />
      <PageHero title={t("industries.label")} titleHighlight={t("industries.titleHighlight")} subtitle={t("industries.subtitle")} />

      <section className="pb-24">
        <div className="section-container space-y-16">
          {industries.map((ind, i) => {
            const Icon = iconMap[ind.icon] || Music;
            const isReverse = i % 2 === 1;
            return (
              <div id={ind.id} key={ind.id} className={`scroll-mt-24 grid lg:grid-cols-2 gap-10 items-center ${isReverse ? 'lg:grid-flow-dense' : ''}`}>
                <div className={`rounded-2xl overflow-hidden aspect-[16/10] ${isReverse ? 'lg:col-start-2' : ''}`}>
                  <img src={ind.image} alt={t(ind.titleKey)} width={1200} height={750} className="w-full h-full object-cover" loading="lazy" decoding="async" />
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
