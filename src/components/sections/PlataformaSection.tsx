import { useState } from "react";
import { Clock, MapPin, CheckSquare, ChevronDown } from "lucide-react";

const products = [
  {
    id: "preorder",
    icon: Clock,
    title: "Compra Anticipada",
    subtitle: "Ordena antes del evento",
    description:
      "Compra antes del evento, paga por adelantado y retira el día del show presentando tu QR. Ideal para planificar tu experiencia con anticipación.",
  },
  {
    id: "seat",
    icon: MapPin,
    title: "Entrega en Asiento",
    subtitle: "Sin perder un momento",
    description:
      "Escanea el QR de tu asiento, compra desde tu celular y recibe directamente en tu ubicación. Perfecto para estadios, suites y zonas VIP.",
  },
  {
    id: "pickup",
    icon: CheckSquare,
    title: "Pickup Express",
    subtitle: "Rapido y sin filas",
    description:
      "Ordena desde tu celular y recoge en el punto mas cercano. Fila VIP exclusiva para pedidos digitales.",
  },
];

const PlataformaSection = () => {
  const [openId, setOpenId] = useState("pickup");

  return (
    <section className="py-24" id="producto">
      <div className="section-container">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl font-bold">
            Plataforma para eventos
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Ronda Privé es una plataforma que permite a los asistentes comprar
            consumo en eventos de distinto tipo, entregando al mismo tiempo
            soluciones efectivas a los organizadores para optimizar gestión.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mt-16">
          {/* Left: Accordion */}
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-8">
              Tres formas de pedir / Productos
            </h3>

            <div className="space-y-3">
              {products.map((product) => {
                const Icon = product.icon;
                const isOpen = openId === product.id;
                return (
                  <div
                    key={product.id}
                    className={`rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? "bg-[#F0EBE3]/50 border-primary/20 shadow-sm"
                        : "bg-transparent border-border/50 hover:border-border"
                    }`}
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? "" : product.id)}
                      className="w-full flex items-center justify-between p-5"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isOpen
                              ? "bg-primary/10"
                              : "bg-muted/50"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${
                              isOpen ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-foreground">
                            {product.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {product.subtitle}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0">
                        <p className="text-sm text-muted-foreground leading-relaxed ml-14">
                          {product.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80"
                alt="Persona usando Ronda Privé en su celular"
                className="w-full h-[500px] object-cover"
                loading="lazy"
              />
            </div>
            {/* Phone overlay mockup */}
            <div className="absolute bottom-8 left-8 w-48 bg-white rounded-2xl shadow-2xl p-4">
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground">Bienvenido a</p>
                <p className="font-display text-sm font-bold">Ronda Privé</p>
                <div className="h-px bg-border" />
                <div className="bg-[#F0EBE3] rounded-xl p-3 text-center">
                  <p className="text-xs font-semibold">Festival 2026</p>
                  <p className="text-[10px] text-muted-foreground">Menu disponible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlataformaSection;
