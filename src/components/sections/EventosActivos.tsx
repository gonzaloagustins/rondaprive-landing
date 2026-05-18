import { ArrowRight, Clock, MapPin, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { getHomeEvents } from "@/data/events";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const EventosActivos = () => {
  const { t } = useTranslation();
  const { path } = useLocalizedPath();
  const navigate = useNavigate();
  const homeEvents = getHomeEvents(t).slice(0, 3);

  const categoryLabels: Record<string, string> = {
    festival: t("eventCategories.festival", "Festival"),
    concert: t("eventCategories.concert", "Concierto"),
    nightclub: t("eventCategories.nightclub", "Nightclub"),
    conference: t("eventCategories.conference", "Conferencia"),
    bar: t("eventCategories.bar", "Bar"),
  };

  const featureLabels: Record<string, { label: string; Icon: typeof Clock }> = {
    preorder: { label: t("eventFeatures.preorder", "Compra anticipada"), Icon: Clock },
    seat: { label: t("eventFeatures.seat", "Compra desde el asiento"), Icon: MapPin },
    pickup: { label: t("eventFeatures.pickup", "Compra y Retiro"), Icon: ShoppingBag },
  };

  return (
    <section className="pt-24 pb-[4.8rem]" id="eventos">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            {t("eventosActivos.eyebrow", "Formatos")}
          </span>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {t("eventosActivos.title", "Diseñado para eventos a cualquier escala")}
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            {t(
              "eventosActivos.subtitle",
              "Festivales, estadios, clubs y bares. La plataforma se adapta a cualquier formato y crece junto a tu evento.",
            )}
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {homeEvents.map((event) => {
            const categoryLabel = categoryLabels[event.category || "festival"];
            return (
              <article
                key={event.id}
                onClick={() => navigate(path("eventDetail", `/${event.id}`))}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-border/60 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={event.image}
                    alt={event.name}
                    width={896}
                    height={672}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/80 shadow-sm backdrop-blur">
                    {categoryLabel}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-bold leading-snug">
                    {event.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {event.venue} · {event.city}
                    {event.country ? `, ${event.country}` : ""}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {event.features.map((f) => {
                      const meta = featureLabels[f];
                      if (!meta) return null;
                      const { label, Icon } = meta;
                      return (
                        <span
                          key={f}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-foreground/80"
                        >
                          <Icon className="h-3 w-3 text-primary" aria-hidden />
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center justify-center gap-3 text-center">
          <Button
            variant="dark-solid"
            size="lg"
            className="group rounded-full"
            asChild
          >
            <Link to={path("contact")}>
              {t("eventosActivos.ctaPrimary", "Hablemos de tu evento")}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Link
            to={path("events")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("eventosActivos.ctaSecondary", "o explorar eventos donde estamos →")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventosActivos;
