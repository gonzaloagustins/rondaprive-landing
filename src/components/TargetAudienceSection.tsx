import { Building2, Music, Sparkles, PartyPopper, Briefcase } from "lucide-react";

const audiences = [
  {
    icon: Building2,
    title: "Arenas y estadios",
    description: "Gestiona miles de transacciones simultáneas sin colapsar la operación.",
  },
  {
    icon: Music,
    title: "Productoras de eventos",
    description: "Control total de múltiples barras y puntos de venta en un solo dashboard.",
  },
  {
    icon: Sparkles,
    title: "Clubs & nightlife",
    description: "Experiencia VIP para tus clientes más exclusivos. Mesas, botellas, sin esperas.",
  },
  {
    icon: PartyPopper,
    title: "Festivales",
    description: "Escala sin límites. Ideal para eventos masivos con alta demanda.",
  },
  {
    icon: Briefcase,
    title: "Eventos corporativos",
    description: "Imagen profesional con tecnología de punta para tus clientes empresariales.",
  },
];

const TargetAudienceSection = () => {
  return (
    <section id="para-quien" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary font-semibold mb-4 uppercase tracking-wider text-sm">Para quién es Ronda</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Creado para los que{" "}
            <span className="text-gradient-gold">mueven</span>{" "}
            la industria
          </h2>
          <p className="text-muted-foreground text-lg">
            Desde clubs íntimos hasta arenas masivas. Ronda se adapta a tu operación.
          </p>
        </div>

        {/* Audience Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <div 
              key={index}
              className={`group relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 ${
                index === 2 ? 'lg:col-span-1' : ''
              }`}
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-6">
                  <audience.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{audience.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{audience.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;
