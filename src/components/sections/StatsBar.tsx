const stats = [
  { value: "85%", label: "Reducción de filas" },
  { value: "+40%", label: "Más ventas" },
  { value: "3x", label: "Velocidad de servicio" },
  { value: "0", label: "Infraestructura extra" },
];

const StatsBar = () => {
  return (
    <section className="pt-0 pb-8">
      <div className="section-container">
        <div className="bg-[#1A1814] rounded-2xl px-8 py-10 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center flex-1">
              <p className="text-3xl sm:text-4xl font-display font-bold text-gradient-gold">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wider font-semibold mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
