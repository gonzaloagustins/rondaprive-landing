import { ArrowRight, Clock, MapPin, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getHomeEvents } from "@/data/events";

const categoryLabels: Record<string, string> = {
  festival: "Festival",
  concert: "Concierto",
  nightclub: "Nightclub",
  conference: "Conferencia",
  bar: "Bar",
};

const featureLabels: Record<string, { label: string; Icon: typeof Clock }> = {
  preorder: { label: "Anticipada", Icon: Clock },
  seat: { label: "En asiento", Icon: MapPin },
  pickup: { label: "Pickup", Icon: ShoppingBag },
};

const EventosActivos = () => {
  const homeEvents = getHomeEvents().slice(0, 3);
  const navigate = useNavigate();

  return (
    <section className="py-24" id="eventos">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Formatos
          </span>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Diseñado para eventos a cualquier escala
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Festivales, estadios, clubs y bares. La plataforma se adapta a
            cualquier formato y crece junto a tu evento.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {homeEvents.map((event) => {
            const categoryLabel = categoryLabels[event.category || "festival"];
            return (
              <article
                key={event.id}
                onClick={() => navigate(`/eventos/${event.id}`)}
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
            <Link to="/contacto">
              Hablemos de tu evento
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Link
            to="/eventos"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            o explorar eventos donde estamos →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventosActivos;
