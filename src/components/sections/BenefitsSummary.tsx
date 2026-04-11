import { useState, useEffect, useRef } from "react";
import { TrendingUp, Smile, Settings, Cpu, Check } from "lucide-react";

const categories = [
  {
    icon: TrendingUp,
    title: "Beneficios Comerciales",
    metric: "+40%",
    metricLabel: "más ventas",
    accentBg: "bg-emerald-500/10",
    accentText: "text-emerald-600",
    borderColor: "border-t-emerald-500",
    items: [
      "Más ventas durante el evento",
      "Captura de ventas perdidas en filas",
      "Incremento del consumo por asistente",
      "Mejor aprovechamiento de momentos peak",
    ],
  },
  {
    icon: Smile,
    title: "Para el Usuario Final",
    metric: "-70%",
    metricLabel: "tiempo de espera",
    accentBg: "bg-blue-500/10",
    accentText: "text-blue-600",
    borderColor: "border-t-blue-500",
    items: [
      "Mejor experiencia general",
      "Menos tiempo de espera",
      "Compra rápida y simple",
      "Retiro ordenado o entrega al asiento",
    ],
  },
  {
    icon: Settings,
    title: "Beneficios Operativos",
    metric: "100%",
    metricLabel: "visibilidad",
    accentBg: "bg-amber-500/10",
    accentText: "text-amber-600",
    borderColor: "border-t-amber-500",
    items: [
      "Mayor control del evento",
      "Mejor gestión de inventario",
      "Centralización de pedidos",
      "Visibilidad en tiempo real",
    ],
  },
  {
    icon: Cpu,
    title: "Beneficios Tecnológicos",
    metric: "0",
    metricLabel: "infraestructura extra",
    accentBg: "bg-violet-500/10",
    accentText: "text-violet-600",
    borderColor: "border-t-violet-500",
    items: [
      "Sin infraestructura adicional",
      "Sin tótems ni cajas tradicionales",
      "Implementación flexible",
      "Adaptable a cualquier formato",
    ],
  },
];

const delayClasses = [
  "animate-fade-in-delay-1",
  "animate-fade-in-delay-2",
  "animate-fade-in-delay-3",
  "animate-fade-in-delay-4",
];

const BenefitsSummary = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) {
      setVisible(true);
      return;
    }
    const node = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pt-24 pb-8" id="beneficios" ref={sectionRef}>
      <div className="section-container">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Ventajas
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4">
            ¿Por qué elegir Ronda Privé?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Más ventas, mejor experiencia y control total sin infraestructura adicional.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border border-border/50 border-t-2 ${cat.borderColor} p-8 hover:shadow-md transition-all duration-300 ${
                  visible ? delayClasses[i] : "opacity-0"
                }`}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className={`w-10 h-10 rounded-xl ${cat.accentBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${cat.accentText}`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-bold mb-3">
                  {cat.title}
                </h3>

                {/* Metric */}
                <div className="mb-5">
                  <span className="text-3xl font-display font-bold text-gradient-gold">
                    {cat.metric}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {cat.metricLabel}
                  </span>
                </div>

                {/* Items */}
                <ul className="space-y-3">
                  {cat.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSummary;
