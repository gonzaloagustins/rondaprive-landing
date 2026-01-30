import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-event.jpg";

const HeroSection = () => {
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
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Tecnología para eventos premium</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 animate-fade-in-delay-1">
            La forma más inteligente de{" "}
            <span className="text-gradient-gold">vender tragos</span>{" "}
            y experiencias en eventos
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-delay-2">
            Ronda Privé permite a los asistentes comprar desde su celular y a los organizadores vender más, con control total en tiempo real.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-3">
            <Button variant="gold" size="lg" className="group">
              Solicitar demo
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="gold-outline" size="lg" className="group">
              <Play className="w-5 h-5" />
              Ver cómo funciona
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/50 max-w-2xl mx-auto animate-fade-in-delay-3">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gradient-gold">+40%</p>
              <p className="text-sm text-muted-foreground mt-1">Ventas por asistente</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gradient-gold">-70%</p>
              <p className="text-sm text-muted-foreground mt-1">Tiempo en filas</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gradient-gold">100%</p>
              <p className="text-sm text-muted-foreground mt-1">Control en tiempo real</p>
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
