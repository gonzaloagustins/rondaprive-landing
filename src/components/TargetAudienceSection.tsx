import { Building2, Music, Sparkles, PartyPopper, Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";

const audienceIcons = [Building2, Music, Sparkles, PartyPopper, Briefcase];

const TargetAudienceSection = () => {
  const { t } = useTranslation();
  
  const items = t("targetAudience.items", { returnObjects: true }) as Array<{ title: string; description: string }>;

  return (
    <section id="para-quien" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary font-semibold mb-4 uppercase tracking-wider text-sm">{t("targetAudience.label")}</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t("targetAudience.title")}{" "}
            <span className="text-gradient-gold">{t("targetAudience.titleHighlight")}</span>{" "}
            {t("targetAudience.titleEnd")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("targetAudience.subtitle")}
          </p>
        </div>

        {/* Audience Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((audience, index) => {
            const Icon = audienceIcons[index];
            return (
              <div 
                key={index}
                className={`group relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 ${
                  index === 2 ? 'lg:col-span-1' : ''
                }`}
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{audience.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{audience.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;