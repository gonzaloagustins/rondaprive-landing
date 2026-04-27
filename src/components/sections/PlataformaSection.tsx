import { Clock, MapPin, CheckSquare, Check } from "lucide-react";

type Product = {
  id: string;
  icon: typeof Clock;
  label: string;
  title: string;
  bullets: string[];
  image: string;
  imageWebp: string;
  imageWebpMd: string;
  imageWebpSm: string;
  imageAlt: string;
  highlight?: boolean;
  badge?: string;
};

// Order applies Serial-Position + Peak-End: soft entry → hero → tangible close.
const products: Product[] = [
  {
    id: "preorder",
    icon: Clock,
    label: "ANTICIPADO",
    title: "Asegura tu pedido antes del evento",
    bullets: ["Disponibilidad garantizada", "Ahorra tiempo el día del show"],
    image: "/compra-anticipada.jpg",
    imageWebp: "/compra-anticipada.webp",
    imageWebpMd: "/compra-anticipada-900w.webp",
    imageWebpSm: "/compra-anticipada-600w.webp",
    imageAlt: "Persona revisando eventos activos en laptop con Ronda Privé",
  },
  {
    id: "seat",
    icon: MapPin,
    label: "EN TU UBICACIÓN",
    title: "Recibe sin moverte de tu asiento",
    bullets: ["Sin filas", "Te llevamos tu pedido"],
    image: "/seat-delivery.jpg",
    imageWebp: "/seat-delivery.webp",
    imageWebpMd: "/seat-delivery-900w.webp",
    imageWebpSm: "/seat-delivery-600w.webp",
    imageAlt: "Mozo entregando bebida en asiento VIP durante concierto",
    highlight: true,
    badge: "Exclusivo de Ronda Privé",
  },
  {
    id: "pickup",
    icon: CheckSquare,
    label: "RETIRO RÁPIDO",
    title: "Tu pedido listo, sin esperar",
    bullets: ["Fila VIP para pedidos digitales", "Retiro ágil y seguro"],
    image: "/pickup-express.jpg",
    imageWebp: "/pickup-express.webp",
    imageWebpMd: "/pickup-express-900w.webp",
    imageWebpSm: "/pickup-express-600w.webp",
    imageAlt: "Persona retirando pedido express con QR en bar VIP de festival",
  },
];

const PlataformaSection = () => {
  return (
    <section className="relative z-30 py-24" id="producto">
      <div className="section-container">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl font-bold">
            Una plataforma. Tres formas de eliminar las filas.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            La forma más rápida, segura y cómoda de disfrutar cada momento.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => {
            const Icon = product.icon;
            const isHighlight = product.highlight;
            return (
              <article
                key={product.id}
                className={`relative flex flex-col rounded-3xl overflow-hidden bg-white border transition-all duration-300 ${
                  isHighlight
                    ? "border-primary/40 shadow-lg md:-translate-y-2"
                    : "border-border/60 shadow-sm hover:shadow-md"
                }`}
              >
                {product.badge && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold tracking-wide shadow">
                    {product.badge}
                  </div>
                )}

                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`${product.imageWebpSm} 600w, ${product.imageWebpMd} 900w, ${product.imageWebp} 1200w`}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <img
                      src={product.image}
                      alt={product.imageAlt}
                      width={896}
                      height={672}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>

                <div className="flex flex-col flex-1 p-6 lg:p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isHighlight ? "bg-primary/15" : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isHighlight ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground">
                      {product.label}
                    </span>
                  </div>

                  <h3 className="font-display text-xl lg:text-2xl font-bold leading-snug mb-5">
                    {product.title}
                  </h3>

                  <ul className="space-y-2.5 mt-auto">
                    {product.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-center gap-3 text-sm text-foreground/80"
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlataformaSection;
