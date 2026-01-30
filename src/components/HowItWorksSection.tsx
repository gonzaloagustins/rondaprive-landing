import { Smartphone, ShoppingCart, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

const stepIcons = [Smartphone, ShoppingCart, Zap];

const HowItWorksSection = () => {
  const { t } = useTranslation();
  
  const steps = t("howItWorks.steps", { returnObjects: true }) as Array<{ title: string; description: string }>;

  return (
    <section id="como-funciona" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary font-semibold mb-4 uppercase tracking-wider text-sm">{t("howItWorks.label")}</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t("howItWorks.title")}{" "}
            <span className="text-gradient-gold">{t("howItWorks.titleHighlight")}</span>{" "}
            {t("howItWorks.titleEnd")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = stepIcons[index];
            const stepNumber = String(index + 1).padStart(2, '0');
            
            return (
              <div 
                key={index}
                className="group relative"
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                
                <div className="card-premium p-8 h-full relative overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(43_74%_49%/0.1)]">
                  {/* Number background */}
                  <span className="absolute -top-4 -right-4 text-[120px] font-bold text-primary/5 leading-none select-none">
                    {stepNumber}
                  </span>
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    
                    {/* Number badge */}
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground mb-4">
                      {t("howItWorks.step")} {stepNumber}
                    </span>
                    
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;