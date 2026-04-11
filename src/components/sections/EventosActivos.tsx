import { Zap, ArrowRight, Music, Trophy, PartyPopper, Mic, Wine } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GradientBlurBg } from "@/components/ui/gradient-blur-bg";
import { EventCard } from "@/components/ui/card-7";
import { getHomeEvents } from "@/data/events";

const categoryIcons: Record<string, React.ReactNode> = {
  festival: <PartyPopper className="h-6 w-6 text-white/80" />,
  concert: <Mic className="h-6 w-6 text-white/80" />,
  nightclub: <Music className="h-6 w-6 text-white/80" />,
  conference: <Trophy className="h-6 w-6 text-white/80" />,
  bar: <Wine className="h-6 w-6 text-white/80" />,
};

const EventosActivos = () => {
  const homeEvents = getHomeEvents();
  const navigate = useNavigate();

  return (
    <section className="pt-24 pb-6 md:pb-14" id="eventos">
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
              const isDecorative = index >= 3;
              return (
                <EventCard
                  key={event.id}
                  imageUrl={event.image}
                  imageAlt={event.name}
                  logo={categoryIcons[event.category || "festival"]}
                  title={event.name}
                  location={`${event.city}${event.country ? `, ${event.country}` : ""}`}
                  overview={event.description}
                  date={event.date}
                  badgeText={event.badgeText}
                  onViewEvent={() => navigate(`/eventos/${event.id}`)}
                  className={`max-w-none h-[380px] ${
                    isDecorative
                      ? "hidden md:block pointer-events-none shadow-none !hover:shadow-none !hover:translate-y-0 [&_img]:!group-hover:scale-100"
                      : ""
                  }`}
                />
              );
            })}
          </div>
          <GradientBlurBg className="h-[65%]" />
        </div>

        {/* CTA */}
        <div className="flex justify-center -mt-56 md:-mt-52 relative z-20">
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
