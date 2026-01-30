import { TrendingUp, Clock, BarChart3, Users, CreditCard, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";

const benefitIcons = [TrendingUp, Clock, BarChart3, Users, CreditCard, Smartphone];

const BenefitsSection = () => {
  const { t } = useTranslation();
  
  const items = t("benefits.items", { returnObjects: true }) as Array<{ title: string; description: string }>;

  return (
    <section id="beneficios" className="py-24 md:py-32 relative">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary font-semibold mb-4 uppercase tracking-wider text-sm">{t("benefits.label")}</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t("benefits.title")}{" "}
            <span className="text-gradient-gold">{t("benefits.titleHighlight")}</span>{" "}
            {t("benefits.titleEnd")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("benefits.subtitle")}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((benefit, index) => {
            const Icon = benefitIcons[index];
            return (
              <div 
                key={index}
                className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_hsl(43_74%_49%/0.1)]"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;