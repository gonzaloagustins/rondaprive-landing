import { useTranslation } from "react-i18next";
import { Zap, Armchair, ShoppingBag, ChefHat, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";

const solutionSections = [
  { key: 'pickup', icon: Zap, id: 'pickup' },
  { key: 'seat', icon: Armchair, id: 'seat' },
  { key: 'preorder', icon: ShoppingBag, id: 'preorder' },
];

const Solutions = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHero title={t("solutions.heroTitle")} titleHighlight={t("solutions.heroHighlight")} subtitle={t("solutions.heroSubtitle")} />

      {solutionSections.map(({ key, icon: Icon, id }, sIdx) => {
        const steps = t(`solutions.${key}.steps`, { returnObjects: true }) as { title: string; description: string }[];
        return (
          <section key={key} id={id} className={`py-20 ${sIdx % 2 === 1 ? '' : ''}`}>
            <div className="section-container">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{t(`solutions.${key}.title`)}</h2>
                  <p className="text-muted-foreground">{t(`solutions.${key}.subtitle`)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {steps.map((step, i) => (
                  <div key={i} className="card-premium p-6 space-y-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h4 className="font-semibold">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>

              {sIdx < solutionSections.length - 1 && <div className="divider-gold mt-20" />}
            </div>
          </section>
        );
      })}

      {/* Kitchen operations */}
      <section className="py-20">
        <div className="section-container">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ChefHat className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{t("solutions.kitchen.title")}</h2>
              <p className="text-muted-foreground">{t("solutions.kitchen.subtitle")}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">{t("solutions.kitchen.description")}</p>
              <div className="flex flex-wrap gap-2">
                {(t("solutions.kitchen.statuses", { returnObjects: true }) as string[]).map((s, i) => (
                  <span key={i} className="glass-card px-4 py-2 rounded-full text-sm font-medium">{s}</span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {(t("solutions.kitchen.benefits", { returnObjects: true }) as string[]).map((b, i) => (
                <div key={i} className="card-premium p-4 flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="section-container text-center space-y-6">
          <h2 className="text-3xl font-bold">¿Listo para transformar tu operación?</h2>
          <Button variant="gold" size="lg" className="group" asChild>
            <Link to="/contacto">
              {t("navbar.requestDemo")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Solutions;
