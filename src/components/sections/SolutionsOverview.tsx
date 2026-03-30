import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Zap, Armchair, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";

const solutions = [
  { key: 'pickup', icon: Zap, hash: '#pickup' },
  { key: 'seat', icon: Armchair, hash: '#seat' },
  { key: 'preorder', icon: ShoppingBag, hash: '#preorder' },
];

const SolutionsOverview = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 relative">
      <div className="section-container">
        <SectionHeader
          label={t("solutionsOverview.label")}
          title={t("solutionsOverview.title")}
          titleHighlight={t("solutionsOverview.titleHighlight")}
          subtitle={t("solutionsOverview.subtitle")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {solutions.map(({ key, icon: Icon, hash }, i) => (
            <div
              key={key}
              className={`card-premium p-8 space-y-6 group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in-delay-${i + 1}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{t(`solutionsOverview.${key}.title`)}</h3>
              <p className="text-muted-foreground leading-relaxed">{t(`solutionsOverview.${key}.description`)}</p>
              <Button variant="link" className="text-primary p-0 h-auto group/btn" asChild>
                <Link to={`/soluciones${hash}`}>
                  {t(`solutionsOverview.${key}.cta`)}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsOverview;
