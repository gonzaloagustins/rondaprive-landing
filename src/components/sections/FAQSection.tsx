import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "¿Necesito instalar hardware o tótems?",
    a: "No. Ronda Privé funciona 100% desde el celular del asistente y los dispositivos que ya tiene tu staff. Cero infraestructura adicional, cero cables, cero kioscos.",
  },
  {
    q: "¿Cuánto tarda la implementación?",
    a: "Puesta en marcha en menos de 48 horas para eventos puntuales. Para venues con operación recurrente, configuramos el dashboard, los productos y los puntos de venta junto a tu equipo en una sola sesión.",
  },
  {
    q: "¿Cómo se integra con mi sistema de pagos y facturación?",
    a: "Conectamos con las principales pasarelas de pago de LATAM (Transbank, Mercado Pago, Stripe, entre otras) y exportamos reportes compatibles con tu sistema contable.",
  },
  {
    q: "¿Cómo se cobra el servicio?",
    a: "Trabajamos con dos modelos: comisión por transacción para eventos puntuales (festivales, conciertos) o suscripción mensual para venues con operación continua (bares, nightclubs, estadios). Cotización personalizada según volumen y formato.",
  },
  {
    q: "¿Qué pasa si se cae internet en el evento?",
    a: "Diseñamos la app para tolerar interrupciones cortas: los pedidos en curso se completan offline y se sincronizan al volver la conexión. Para festivales en zonas críticas, recomendamos red local dedicada y trabajamos con el organizador para asegurarla.",
  },
  {
    q: "¿Tengo soporte durante el evento?",
    a: "Sí. Cada evento incluye soporte dedicado en tiempo real. Para venues con suscripción, soporte 24/7 vía WhatsApp y dashboard.",
  },
];

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-24" id="faq">
      <div className="section-container max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Preguntas frecuentes
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4">
            Lo que más nos preguntan los organizadores
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-primary/30 bg-[#F0EBE3]/40"
                    : "border-border/60 bg-white hover:border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                >
                  <span className="font-semibold text-foreground">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
