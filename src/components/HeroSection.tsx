import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero-event.jpg";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Dark Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
      
      {/* Gold glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center pt-24 sm:pt-16">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-primary/30 bg-primary/10 mb-6 sm:mb-8 animate-fade-in-up">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs sm:text-sm text-primary font-medium">{t("hero.badge")}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6 animate-fade-in-delay-1">
            {t("hero.headline")}{" "}
            <span className="text-gradient-gold">{t("hero.headlineHighlight")}</span>{" "}
            {t("hero.headlineEnd")}
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 animate-fade-in-delay-2">
            {t("hero.subheadline")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in-delay-3">
            <Button variant="gold" size="lg" className="group w-full sm:w-auto">
              {t("hero.ctaDemo")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="gold-outline" size="lg" className="group w-full sm:w-auto">
              <Play className="w-5 h-5" />
              {t("hero.ctaVideo")}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 pt-8 sm:pt-16 border-t border-border/50 max-w-2xl mx-auto animate-fade-in-delay-3">
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-gold">+40%</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("hero.statSales")}</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-gold">-70%</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("hero.statQueue")}</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-gold">100%</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("hero.statControl")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;