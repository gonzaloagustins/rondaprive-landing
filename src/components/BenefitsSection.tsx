import { TrendingUp, Clock, BarChart3, Users, CreditCard, Smartphone } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Más ventas por asistente",
    description: "Incrementa el ticket promedio hasta un 40% con compras sin fricción.",
  },
  {
    icon: Clock,
    title: "Menos filas y fricción",
    description: "Elimina las colas de espera. Más tiempo disfrutando, más consumo.",
  },
  {
    icon: BarChart3,
    title: "Control de inventario",
    description: "Visualiza stock en tiempo real. Toma decisiones con datos precisos.",
  },
  {
    icon: Users,
    title: "Menos carga al staff",
    description: "Optimiza la operación. Tu equipo se enfoca en la experiencia.",
  },
  {
    icon: CreditCard,
    title: "Pagos digitales integrados",
    description: "Múltiples métodos de pago. Cero efectivo, cero problemas.",
  },
  {
    icon: Smartphone,
    title: "Experiencia premium",
    description: "Tus asistentes viven un evento de primer nivel desde su celular.",
  },
];

const BenefitsSection = () => {
  return (
    <section id="beneficios" className="py-24 md:py-32 relative">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary font-semibold mb-4 uppercase tracking-wider text-sm">Beneficios</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Todo lo que necesitas para{" "}
            <span className="text-gradient-gold">maximizar</span>{" "}
            tu evento
          </h2>
          <p className="text-muted-foreground text-lg">
            Diseñado por y para organizadores de eventos que buscan resultados.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_hsl(43_74%_49%/0.1)]"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
