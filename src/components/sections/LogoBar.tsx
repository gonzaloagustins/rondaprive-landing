// Placeholder logo bar. Names are styled as text-logos until real
// SVG/PNG assets are available. To swap: replace each <span> with
// <img src="/logos/{slug}.svg" alt="{name}" className="h-8 opacity-70" />.
const venues = [
  { name: "Arena Santiago", slug: "arena-santiago" },
  { name: "Estadio Nacional", slug: "estadio-nacional" },
  { name: "Festival 2026", slug: "festival-2026" },
  { name: "Club Privé", slug: "club-prive" },
  { name: "Movistar Arena", slug: "movistar-arena" },
];

const LogoBar = () => {
  return (
    <section className="py-12 border-y border-border/40 bg-background">
      <div className="section-container">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-8">
          Operan con Ronda Privé
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {venues.map((venue) => (
            <span
              key={venue.slug}
              className="font-display text-base sm:text-lg font-semibold text-foreground/50 hover:text-foreground/80 transition-colors duration-300"
            >
              {venue.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoBar;
