const SocialProofSection = () => {
  return (
    <section className="py-16 border-y border-border/50">
      <div className="container">
        <div className="text-center">
          <p className="text-muted-foreground text-sm uppercase tracking-wider mb-8">
            Diseñado junto a organizadores de eventos reales
          </p>
          
          {/* Logo placeholders */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i}
                className="w-28 h-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground"
              >
                Venue {i}
              </div>
            ))}
          </div>

          <p className="mt-10 text-lg text-muted-foreground italic max-w-2xl mx-auto">
            "Ronda Privé transformó la forma en que operamos. Vendemos más, con menos esfuerzo y total visibilidad."
          </p>
          <p className="mt-4 text-sm text-primary font-semibold">
            — Organizador de eventos, Ciudad de México
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
