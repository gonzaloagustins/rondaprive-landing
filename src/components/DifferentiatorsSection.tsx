import { Check, X } from "lucide-react";

const comparisons = [
  { feature: "Compras desde el celular", ronda: true, others: true },
  { feature: "Dashboard en tiempo real", ronda: true, others: false },
  { feature: "Control de inventario integrado", ronda: true, others: false },
  { feature: "Gestión de mesas VIP", ronda: true, others: false },
  { feature: "Pensado para alto volumen", ronda: true, others: false },
  { feature: "Soporte local en LATAM", ronda: true, others: false },
];

const DifferentiatorsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary/20 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-primary font-semibold mb-4 uppercase tracking-wider text-sm">Por qué Ronda</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              No es solo un QR.{" "}
              <span className="text-gradient-gold">Es mucho más.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ronda Privé es una plataforma completa de operación y monetización, diseñada específicamente para la realidad de LATAM.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="card-premium overflow-hidden">
            <div className="grid grid-cols-3 bg-secondary/50 p-4 font-semibold text-sm">
              <div>Característica</div>
              <div className="text-center">Ronda Privé</div>
              <div className="text-center text-muted-foreground">Otras soluciones</div>
            </div>
            
            {comparisons.map((item, index) => (
              <div 
                key={index}
                className="grid grid-cols-3 p-4 border-t border-border/50 items-center hover:bg-secondary/30 transition-colors"
              >
                <div className="text-sm">{item.feature}</div>
                <div className="flex justify-center">
                  {item.ronda ? (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                      <X className="w-5 h-5 text-destructive" />
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  {item.others ? (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Check className="w-5 h-5 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <X className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Key differentiators */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-gradient-gold mb-2">100%</div>
              <p className="text-muted-foreground text-sm">Plataforma end-to-end</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-gradient-gold mb-2">LATAM</div>
              <p className="text-muted-foreground text-sm">Pensado para la región</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-gradient-gold mb-2">24/7</div>
              <p className="text-muted-foreground text-sm">Soporte durante eventos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifferentiatorsSection;
