import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clock, MapPin, CheckSquare, Check, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

type ProductId = "preorder" | "seat" | "pickup";

type ProductMeta = {
  id: ProductId;
  icon: typeof Clock;
  image: string;
  imageWebp: string;
  imageWebpMd: string;
  imageWebpSm: string;
  highlight?: boolean;
};

// Order applies Serial-Position + Peak-End: soft entry → hero → tangible close.
const productsMeta: ProductMeta[] = [
  {
    id: "preorder",
    icon: Clock,
    image: "/compra-anticipada.jpg",
    imageWebp: "/compra-anticipada.webp",
    imageWebpMd: "/compra-anticipada-900w.webp",
    imageWebpSm: "/compra-anticipada-600w.webp",
  },
  {
    id: "seat",
    icon: MapPin,
    image: "/seat-delivery.jpg",
    imageWebp: "/seat-delivery.webp",
    imageWebpMd: "/seat-delivery-900w.webp",
    imageWebpSm: "/seat-delivery-600w.webp",
    highlight: true,
  },
  {
    id: "pickup",
    icon: CheckSquare,
    image: "/pickup-express.jpg",
    imageWebp: "/pickup-express.webp",
    imageWebpMd: "/pickup-express-900w.webp",
    imageWebpSm: "/pickup-express-600w.webp",
  },
];

const PlataformaSection = () => {
  const { t } = useTranslation();
  const { path } = useLocalizedPath();
  const [expandedId, setExpandedId] = useState<ProductId | null>(null);

  const toggle = (id: ProductId) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="relative z-30 pt-10 pb-24 sm:pt-12" id="producto">
      <div className="section-container">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl font-bold">
            {t("plataforma.heading")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            {t("plataforma.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {productsMeta.map((product) => {
            const Icon = product.icon;
            const isHighlight = product.highlight;
            const isExpanded = expandedId === product.id;
            const label = t(`plataforma.products.${product.id}.label`);
            const title = t(`plataforma.products.${product.id}.title`);
            const imageAlt = t(`plataforma.products.${product.id}.imageAlt`);
            const badge = t(`plataforma.products.${product.id}.badge`, "");
            const bullets = t(`plataforma.products.${product.id}.bullets`, {
              returnObjects: true,
              defaultValue: [],
            }) as string[];
            const steps = t(`plataforma.products.${product.id}.steps`, {
              returnObjects: true,
              defaultValue: [],
            }) as string[];

            return (
              <article
                key={product.id}
                className={`group relative flex flex-col rounded-3xl overflow-hidden bg-white border transition-all duration-300 ease-out hover:shadow-2xl ${
                  isHighlight
                    ? "border-primary/40 shadow-lg md:-translate-y-2 md:hover:-translate-y-4"
                    : "border-border/60 shadow-sm hover:-translate-y-2"
                }`}
              >
                {badge && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold tracking-wide shadow">
                    {badge}
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
                      alt={imageAlt}
                      width={896}
                      height={672}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>

                <div className="flex flex-col flex-1 p-6 lg:p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 group-hover:bg-primary/15 ${
                        isHighlight ? "bg-primary/15" : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-colors duration-300 group-hover:text-primary ${
                          isHighlight ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground">
                      {label}
                    </span>
                  </div>

                  <h3 className="font-display text-xl lg:text-2xl font-bold leading-snug mb-5">
                    {title}
                  </h3>

                  <ul className="space-y-2.5">
                    {bullets.map((bullet) => (
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

                  <div className="mt-6 pt-5 border-t border-border/60">
                    <button
                      type="button"
                      onClick={() => toggle(product.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`steps-${product.id}`}
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      {isExpanded ? t("plataforma.toggleHide") : t("plataforma.toggleShow")}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      id={`steps-${product.id}`}
                      className={`grid transition-all duration-300 ease-out ${
                        isExpanded
                          ? "grid-rows-[1fr] opacity-100 mt-4"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <ol className="overflow-hidden space-y-3">
                        {steps.map((step, idx) => (
                          <li key={step} className="flex gap-3 text-sm text-foreground/80">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <p className="text-muted-foreground">
            {t("plataforma.ctaQuestion")}
          </p>
          <Button
            variant="dark-solid"
            size="lg"
            className="group rounded-full"
            asChild
          >
            <Link to={path("contact")}>
              {t("footer.scheduleDemo", "Agendar demo")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PlataformaSection;
