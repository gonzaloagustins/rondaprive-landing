import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Zap, Armchair, ShoppingBag, Search, X, CalendarOff } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import { events } from "@/data/events";

const featureIcons = { pickup: Zap, seat: Armchair, preorder: ShoppingBag };

const countries = Array.from(new Set(events.map(e => e.country).filter(Boolean))) as string[];

const Events = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming'>('all');
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = events;
    if (filter !== 'all') result = result.filter(e => e.status === filter);
    if (country !== 'all') result = result.filter(e => e.country === country);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q)
      );
    }
    return result;
  }, [filter, country, search]);

  const clearFilters = () => {
    setFilter('all');
    setCountry('all');
    setSearch('');
  };

  const hasActiveFilters = filter !== 'all' || country !== 'all' || search.trim() !== '';

  return (
    <>
      <PageHero title={t("events.heroTitle")} titleHighlight={t("events.heroHighlight")} subtitle={t("events.heroSubtitle")} />

      <section className="pb-24">
        <div className="section-container">
          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por evento, venue o ciudad..."
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/60 border border-border/50 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {/* Status pills */}
            {(['all', 'active', 'upcoming'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground hover:text-foreground'
                }`}>
                {f === 'all' ? t("events.all") : f === 'active' ? t("events.active") : t("events.upcoming")}
              </button>
            ))}

            {/* Separator */}
            <div className="w-px h-6 bg-border/60 hidden sm:block" />

            {/* Country filter */}
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="px-4 py-2 rounded-full text-sm font-medium glass-card text-muted-foreground hover:text-foreground transition-all bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[center_right_12px] pr-8"
            >
              <option value="all">Todos los países</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Results count + clear */}
            <div className="flex items-center gap-3 ml-auto text-sm text-muted-foreground">
              <span>{filtered.length} de {events.length} eventos</span>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* Grid or empty state */}
          {filtered.length > 0 ? (
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
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-5">
                <CalendarOff className="w-7 h-7 text-muted-foreground/60" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No se encontraron eventos</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                No hay eventos que coincidan con tu búsqueda. Prueba con otros filtros o explora todos los eventos disponibles.
              </p>
              <button onClick={clearFilters} className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Ver todos los eventos
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Events;
