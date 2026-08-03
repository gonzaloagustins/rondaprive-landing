import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Clock, MapPin, CheckSquare, ChefHat, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/shared/PageHero";
import SEO from "@/components/shared/SEO";
import { productModes } from "@/data/productModes";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Clock,
  MapPin,
  CheckSquare,
  ChefHat,
};

/**
 * The /producto hub: one card per capability, each linking to its own page.
 *
 * This is the "see everything" destination behind the Producto menu entry. It
 * deliberately stays short — the depth lives on the four detail pages, which
 * are the URLs meant to rank and to be shared.
 */
const Product = () => {
  const { t } = useTranslation();
  const { path } = useLocalizedPath();

  return (
    <>
      <SEO pageKey="product" />
      <PageHero
        title={t("product.heroTitle")}
        titleHighlight={t("product.heroHighlight")}
        subtitle={t("product.heroSubtitle")}
      />

      <section className="pb-24">
        <div className="section-container">
          <h2 className="text-2xl font-bold mb-10 text-center">
            {t("product.modesTitle")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {productModes.map((mode) => {
              const Icon = iconMap[mode.icon] || Clock;
              const title = t(mode.titleKey);
              return (
                <Link
                  key={mode.id}
                  to={path("productDetail", `/${mode.id}`)}
                  className="group flex flex-col rounded-3xl overflow-hidden bg-white border border-border/60 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {mode.image ? (
                    <div className="aspect-[16/9] overflow-hidden bg-muted">
                      <picture>
                        <source
                          type="image/webp"
                          srcSet={`${mode.image.webp600} 600w, ${mode.image.webp900} 900w, ${mode.image.webp} 1200w`}
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                        <img
                          src={mode.image.fallback}
                          alt={title}
                          width={1200}
                          height={675}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-muted/60 flex items-center justify-center">
                      <Icon className="w-14 h-14 text-primary/50" />
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-6 lg:p-7">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold leading-snug">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground flex-1">
                      {t(mode.subtitleKey)}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      {t("product.viewDetail")}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="section-container text-center space-y-6">
          <h2 className="text-3xl font-bold">{t("product.ctaTitle")}</h2>
          <Button variant="gold" size="lg" className="group" asChild>
            <Link to={path("contact")}>
              {t("navbar.requestDemo")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Product;
