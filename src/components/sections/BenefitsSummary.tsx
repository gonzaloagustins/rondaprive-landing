import { TrendingUp, Smile, Settings, Cpu, ArrowUpRight } from "lucide-react";

const categories = [
  {
    icon: TrendingUp,
    title: "Beneficios Comerciales",
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
    items: [
      "Sin infraestructura adicional",
      "Sin tótems ni cajas tradicionales",
      "Implementación flexible",
      "Adaptable a cualquier formato",
    ],
  },
];

const BenefitsSummary = () => {
  return (
    <section className="py-24" id="beneficios">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-border/50 p-8 hover:shadow-md transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/40" />
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-bold mb-5">
                  {cat.title}
                </h3>

                {/* Items */}
                <ul className="space-y-3">
                  {cat.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <span className="text-foreground/30 mt-0.5">•</span>
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
