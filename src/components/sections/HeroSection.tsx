import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Calendar, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getFeaturedEvents } from "@/data/events";

const HeroSection = () => {
  const { t } = useTranslation();
  const featuredEvents = getFeaturedEvents();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-30" style={{ backgroundColor: '#0E0E0E' }} />
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-50" style={{
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(213,168,90,0.05) 0.7px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(213,168,90,0.03) 0.7px, transparent 1px)',
        backgroundSize: '16px 16px',
      }} />
      <div className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[600px] -z-10" style={{
        background: 'radial-gradient(ellipse at center, rgba(213,168,90,0.1), transparent 70%)',
        filter: 'blur(60px)',
      }} />

      <div className="section-container w-full pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left: B2B Content */}
          <div className="space-y-8 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {t("hero.badge")}
            </span>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {t("hero.headline")}{" "}
              <span className="text-gradient-gold">{t("hero.headlineHighlight")}</span>
            </h1>

            <p className="max-w-xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              {t("hero.subheadline")}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="gold" size="lg" className="group" asChild>
                <Link to="/contacto">
                  {t("hero.ctaDemo")}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="gold-outline" size="lg" className="group" asChild>
                <Link to="/como-funciona">
                  <Play className="w-5 h-5" />
                  {t("hero.ctaVideo")}
                </Link>
              </Button>
            </div>

            <div className="flex gap-8 pt-6 border-t border-border/50">
              <div>
                <p className="text-2xl font-bold text-gradient-gold md:text-3xl">+80%</p>
                <p className="text-xs text-muted-foreground mt-1">{t("hero.statSales")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gradient-gold md:text-3xl">-70%</p>
                <p className="text-xs text-muted-foreground mt-1">{t("hero.statQueue")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gradient-gold md:text-3xl">100%</p>
                <p className="text-xs text-muted-foreground mt-1">{t("hero.statControl")}</p>
              </div>
            </div>
          </div>

          {/* Right: B2C Events Preview */}
          <div className="space-y-4 animate-fade-in-delay-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                {t("hero.eventsTitle")}
              </h3>
              <Link to="/eventos" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {t("common.viewAll")} →
              </Link>
            </div>

            <div className="space-y-3">
              {featuredEvents.map((event, i) => (
                <Link
                  key={event.id}
                  to={`/eventos/${event.id}`}
                  className={`block glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5 animate-fade-in-delay-${i + 2}`}
                >
                  <div className="flex gap-4 p-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={event.image} alt={event.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          event.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'
                        }`}>
                          {event.status === 'active' ? t("events.active") : t("events.upcoming")}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm truncate">{event.name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.city}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              to="/eventos"
              className="block text-center py-3 glass-card rounded-xl text-sm text-primary hover:bg-primary/10 transition-colors"
            >
              {t("hero.ctaExplore")} →
            </Link>
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
