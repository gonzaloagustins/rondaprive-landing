import { Zap, MapPin, Calendar, Star, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GradientBlurBg } from "@/components/ui/gradient-blur-bg";
import { getHomeEvents } from "@/data/events";

const categoryColors: Record<string, { bg: string; text: string }> = {
  festival: { bg: "bg-orange-500", text: "text-white" },
  concert: { bg: "bg-purple-500", text: "text-white" },
  nightclub: { bg: "bg-pink-500", text: "text-white" },
  conference: { bg: "bg-blue-500", text: "text-white" },
  bar: { bg: "bg-teal-500", text: "text-white" },
};

const categoryLabels: Record<string, string> = {
  festival: "Festivales",
  concert: "Conciertos",
  nightclub: "Nightclub",
  conference: "Conferencia",
  bar: "Bar & Venue",
};

const featureColors: Record<string, { bg: string; text: string }> = {
  preorder: { bg: "bg-green-100 border-green-300", text: "text-green-700" },
  seat: { bg: "bg-orange-100 border-orange-300", text: "text-orange-700" },
  pickup: { bg: "bg-teal-100 border-teal-300", text: "text-teal-700" },
};

const featureLabels: Record<string, string> = {
  preorder: "Anticipada",
  seat: "En Asiento",
  pickup: "Pickup",
};

const EventosActivos = () => {
  const homeEvents = getHomeEvents();

  return (
    <section className="py-24" id="eventos">
      <div className="section-container">
        {/* Tag */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F0EBE3] px-4 py-2 text-xs font-semibold text-foreground/70">
            <Zap className="w-3.5 h-3.5 text-primary" />
            Tecnología para Eventos
          </span>
        </div>

        {/* Title */}
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-center mb-16">
          Eventos activos
        </h2>

        {/* Events grid */}
        <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeEvents.map((event, index) => {
            const catStyle = categoryColors[event.category || "festival"];
            return (
              <div
                key={event.id}
                className={`bg-white rounded-2xl overflow-hidden border border-border/50 transition-all duration-300 ${index >= 3 ? "hidden md:block shadow-none" : index === 2 ? "shadow-none md:shadow-sm md:hover:shadow-md md:hover:-translate-y-1" : "shadow-sm hover:shadow-md hover:-translate-y-1"}`}
              >
                {/* Photo */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {event.badgeText && (
                      <span className="bg-white/90 text-foreground text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        {event.badgeText}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`${catStyle.bg} ${catStyle.text} text-[10px] font-semibold px-2.5 py-1 rounded-full`}>
                      {categoryLabels[event.category || "festival"]}
                    </span>
                  </div>

                  {/* Rating + attendees */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-3">
                    {event.rating && (
                      <span className="bg-white/90 text-foreground text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        {event.rating}
                      </span>
                    )}
                    {event.attendees && (
                      <span className="bg-white/90 text-foreground text-[10px] font-semibold px-2 py-1 rounded-full">
                        👥 {event.attendees}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-base text-foreground">{event.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.city}{event.country ? `, ${event.country}` : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {event.date}
                    </span>
                  </div>

                  {/* URL del evento */}
                  <p className="text-[10px] text-muted-foreground/60 mt-2 truncate">
                    rondaprive.com/eventos/{event.id}
                  </p>

                  {/* Features */}
                  <div className="mt-3">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Funciones disponibles
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {event.features.map((feature) => {
                        const fStyle = featureColors[feature];
                        return (
                          <span
                            key={feature}
                            className={`${fStyle.bg} ${fStyle.text} text-[10px] font-medium px-2.5 py-1 rounded-full border flex items-center gap-1`}
                          >
                            {featureLabels[feature]}
                            <Check className="w-3 h-3" />
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Link */}
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <Link
                      to={`/eventos/${event.id}`}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center justify-between"
                    >
                      Ver detalles del evento
                      <span className="text-lg">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <GradientBlurBg className="h-[65%]" />
        </div>

        {/* CTA */}
        <div className="flex justify-center -mt-56 md:-mt-20 relative z-20">
          <Button variant="dark-solid" size="lg" asChild>
            <Link to="/eventos">
              Ver todos los eventos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventosActivos;
