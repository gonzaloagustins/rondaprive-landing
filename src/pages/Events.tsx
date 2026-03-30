import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Zap, Armchair, ShoppingBag } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import { events } from "@/data/events";

const featureIcons = { pickup: Zap, seat: Armchair, preorder: ShoppingBag };

const Events = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming'>('all');

  const filtered = filter === 'all' ? events : events.filter(e => e.status === filter);

  return (
    <>
      <PageHero title={t("events.heroTitle")} titleHighlight={t("events.heroHighlight")} subtitle={t("events.heroSubtitle")} />

      <section className="pb-24">
        <div className="section-container">
          <div className="flex gap-3 mb-8">
            {(['all', 'active', 'upcoming'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground hover:text-foreground'
                }`}>
                {f === 'all' ? t("events.all") : f === 'active' ? t("events.active") : t("events.upcoming")}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(event => (
              <Link key={event.id} to={`/eventos/${event.id}`}
                className="card-premium overflow-hidden group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={event.image} alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      event.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'
                    }`}>
                      {event.status === 'active' ? t("events.active") : t("events.upcoming")}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">{event.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.city}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {event.features.map(f => {
                      const Icon = featureIcons[f];
                      return (
                        <span key={f} className="flex items-center gap-1 text-[10px] text-muted-foreground glass-card px-2 py-1 rounded-full">
                          <Icon className="w-3 h-3" />{t(`events.features.${f}`)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Events;
