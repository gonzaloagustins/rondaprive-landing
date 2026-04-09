import { useState } from "react";
import { Music, Tent, Trophy, Wine } from "lucide-react";
import { industries } from "@/data/industries";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Music,
  Tent,
  Trophy,
  Wine,
};

const tabLabels: Record<string, string> = {
  nightclubs: "Nightclubs",
  festivals: "Festivales",
  stadiums: "Estadios y Conciertos",
  bars: "Bares y Venues",
};

const problemTexts: Record<string, string> = {
  nightclubs: "Barras congestionadas, pérdida de ventas en momentos peak, dificultad para atender mesas VIP con agilidad.",
  festivals: "Miles de personas, puntos de venta insuficientes, largas filas bajo el sol, ventas perdidas.",
  stadiums: "Asistentes abandonan sus asientos para comprar, pierden el espectáculo. Suites sin servicio ágil.",
  bars: "Barras saturadas en horarios pico, errores en pedidos, falta de control de inventario.",
};

const solutionTexts: Record<string, string> = {
  nightclubs: "Pedidos desde mesa o zona VIP directo al celular. Pick Up Express para reducir filas en barra.",
  festivals: "Mayor velocidad en puntos de alta demanda. Compra anticipada y retiro express para multiplicar capacidad.",
  stadiums: "QR en cada asiento o sector. Compra desde el celular con entrega al asiento. Pick Up para sectores generales.",
  bars: "Pedidos desde QR en mesa o barra. Preparación ordenada por prioridad. Dashboard de ventas en tiempo real.",
};

const useCasePills: Record<string, string[]> = {
  nightclubs: ["Pedidos desde mesa VIP", "Pick Up en barra", "Promociones en tiempo real", "Control de stock"],
  festivals: ["Puntos de retiro express", "Compra anticipada masiva", "Reducción de filas 80%", "Más ventas por persona"],
  stadiums: ["Delivery al asiento", "QR por sector", "Servicio en suites", "Compra anticipada"],
  bars: ["QR en mesas", "Pick Up en barra", "Control de stock en vivo", "Métricas por hora"],
};

const IndustriesPreview = () => {
  const [activeId, setActiveId] = useState("festivals");
  const active = industries.find((i) => i.id === activeId) || industries[1];
  const ActiveIcon = iconMap[active.icon] || Music;

  return (
    <section className="section-dark py-24" id="soluciones">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Adaptable a tu recinto
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4">
            Una solución, múltiples formatos
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Selecciona tu tipo de recinto y descubre cómo Ronda Privé se adapta
            a tus necesidades específicas
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {industries.map((ind) => {
            const IndIcon = iconMap[ind.icon] || Music;
            const isActive = activeId === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setActiveId(ind.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[#F0EBE3] text-[#1A1814] shadow-sm"
                    : "border border-[hsl(28,10%,20%)] text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                <IndIcon className="w-4 h-4" />
                {tabLabels[ind.id]}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-12 grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden aspect-[16/10]">
            <img
              src={active.image}
              alt={tabLabels[active.id]}
              className="w-full h-full object-cover transition-all duration-500"
              loading="lazy"
            />
          </div>

          {/* Text */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                El problema
              </span>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {problemTexts[activeId]}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Nuestra solución
              </span>
              <p className="mt-2 font-medium leading-relaxed">
                {solutionTexts[activeId]}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Ejemplos de uso
              </span>
              <div className="flex flex-wrap gap-2 mt-3">
                {useCasePills[activeId]?.map((pill, i) => (
                  <span
                    key={i}
                    className="border border-[hsl(28,10%,25%)] text-xs px-3 py-1.5 rounded-full text-muted-foreground"
                  >
                    • {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesPreview;
