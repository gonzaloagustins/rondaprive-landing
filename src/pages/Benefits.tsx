import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { TrendingUp, Smile, Settings, Cpu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/shared/PageHero";

const categories = [
  { key: 'commercial', icon: TrendingUp, color: 'text-green-400 bg-green-500/10' },
  { key: 'experience', icon: Smile, color: 'text-blue-400 bg-blue-500/10' },
  { key: 'operational', icon: Settings, color: 'text-amber-400 bg-amber-500/10' },
  { key: 'technical', icon: Cpu, color: 'text-purple-400 bg-purple-500/10' },
];

const Benefits = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHero title={t("benefits.title")} titleHighlight={t("benefits.titleHighlight")} />

      <section className="pb-24">
        <div className="section-container space-y-12">
          {categories.map(({ key, icon: Icon, color }) => {
            const items = t(`benefits.${key}.items`, { returnObjects: true }) as { title: string; description: string }[];
            return (
              <div key={key}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold">{t(`benefits.${key}.title`)}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {items.map((item, i) => (
                    <div key={i} className="card-premium p-6 space-y-3">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="text-center pt-8">
            <Button variant="gold" size="lg" className="group" asChild>
              <Link to="/contacto">{t("navbar.requestDemo")} <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Benefits;
