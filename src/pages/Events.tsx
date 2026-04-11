import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Search, X, CalendarOff, Music, Trophy, PartyPopper, Mic, Wine } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import { EventCard } from "@/components/ui/card-7";
import { events } from "@/data/events";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const categoryIcons: Record<string, React.ReactNode> = {
  festival: <PartyPopper className="h-6 w-6 text-white/80" />,
  concert: <Mic className="h-6 w-6 text-white/80" />,
  nightclub: <Music className="h-6 w-6 text-white/80" />,
  conference: <Trophy className="h-6 w-6 text-white/80" />,
  bar: <Wine className="h-6 w-6 text-white/80" />,
};

const countries = Array.from(new Set(events.map(e => e.country).filter(Boolean))) as string[];

const EVENTS_PER_PAGE = 30;

const parseDateForSort = (date: string): number => {
  const months: Record<string, number> = {
    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
    julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
  };
  const match = date.match(/(\d+)\s+(\w+)\s+(\d{4})/i);
  if (match) {
    const month = months[match[2].toLowerCase()] ?? 0;
    return new Date(+match[3], month, +match[1]).getTime();
  }
  return Infinity;
};

const Events = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming'>('all');
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<string>("all");
  const [sort, setSort] = useState<'date' | 'name'>('date');
  const [page, setPage] = useState(1);

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
    result = [...result].sort((a, b) =>
      sort === 'name'
        ? a.name.localeCompare(b.name)
        : parseDateForSort(a.date) - parseDateForSort(b.date)
    );
    return result;
  }, [filter, country, search, sort]);

  useEffect(() => { setPage(1); }, [filter, country, search, sort]);

  const totalPages = Math.ceil(filtered.length / EVENTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * EVENTS_PER_PAGE, page * EVENTS_PER_PAGE);

  const clearFilters = () => {
    setFilter('all');
    setCountry('all');
    setSearch('');
    setSort('date');
  };

  const hasActiveFilters = filter !== 'all' || country !== 'all' || search.trim() !== '' || sort !== 'date';

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
            {(['all', 'active', 'upcoming'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground hover:text-foreground'
                }`}>
                {f === 'all' ? t("events.all") : f === 'active' ? t("events.active") : t("events.upcoming")}
              </button>
            ))}

            <div className="w-px h-6 bg-border/60 hidden sm:block" />

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

            <select
              value={sort}
              onChange={e => setSort(e.target.value as 'date' | 'name')}
              className="px-4 py-2 rounded-full text-sm font-medium glass-card text-muted-foreground hover:text-foreground transition-all bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[center_right_12px] pr-8"
            >
              <option value="date">Más próximos</option>
              <option value="name">A-Z</option>
            </select>

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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map(event => (
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
                    className="max-w-none h-[380px]"
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-12">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                      if (totalPages <= 7 || p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
                        return (
                          <PaginationItem key={p}>
                            <PaginationLink onClick={() => setPage(p)} isActive={p === page} className="cursor-pointer">
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (p === 2 && page > 4) return <PaginationEllipsis key="start-ellipsis" />;
                      if (p === totalPages - 1 && page < totalPages - 3) return <PaginationEllipsis key="end-ellipsis" />;
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
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
