import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Clock,
  MapPin,
  CheckSquare,
  ChefHat,
  ArrowRight,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/shared/PageHero";
import SEO from "@/components/shared/SEO";
import { productModeMeta, productModes } from "@/data/productModes";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import type { ProductMode } from "@/i18n/routes";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Clock,
  MapPin,
  CheckSquare,
  ChefHat,
};

interface ProductDetailProps {
  /** Set by the route registration, so the component never parses the URL. */
  mode: ProductMode;
}

/**
 * One page per capability — the canonical, shareable URL for each.
 *
 * Two content shapes are supported: the three sales modes are a numbered
 * flow (`steps`), while kitchen operations is prose + statuses + benefits.
 * The rest of the page (breadcrumb, cross-links, CTA) is shared.
 */
const ProductDetail = ({ mode }: ProductDetailProps) => {
  const { t } = useTranslation();
  const { path } = useLocalizedPath();
  const meta = productModeMeta(mode);
  const title = t(meta.titleKey);
  const steps = t(`product.${mode}.steps`, {
    returnObjects: true,
    defaultValue: [],
  }) as { title: string; description: string }[];
  const statuses = t(`product.${mode}.statuses`, {
    returnObjects: true,
    defaultValue: [],
  }) as string[];
  const benefits = t(`product.${mode}.benefits`, {
    returnObjects: true,
    defaultValue: [],
  }) as string[];
  const description = t(`product.${mode}.description`, "");

  const others = productModes.filter((m) => m.id !== mode);

  return (
    <>
      <SEO
        pageKey="productDetail"
        pathSuffix={`/${mode}`}
        title={title}
        description={t(meta.seoDescriptionKey)}
      />

      {/* Breadcrumb: the second half of "you are here". The menu says which
          section of the site; this says which capability within it. It sits
          above the h1, where a breadcrumb is expected. */}
      <nav aria-label={t("navbar.product")} className="section-container pt-28">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link
              to={path("product")}
              className="hover:text-foreground transition-colors"
            >
              {t("navbar.product")}
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="w-4 h-4" />
          </li>
          <li className="text-foreground font-medium" aria-current="page">
            {title}
          </li>
        </ol>
      </nav>

      <PageHero
        title={title}
        subtitle={t(meta.subtitleKey)}
        compact
        className="pt-8"
      />

      {steps.length > 0 && (
        <section className="py-16">
          <div className="section-container">
            <h2 className="text-2xl font-bold mb-8">{t("product.stepsTitle")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {steps.map((step, i) => (
                <div key={step.title} className="card-premium p-6 space-y-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {description && (
        <section className="py-16">
          <div className="section-container grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">{description}</p>
              {statuses.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {statuses.map((s) => (
                    <span
                      key={s}
                      className="glass-card px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {benefits.length > 0 && (
              <div className="space-y-3">
                {benefits.map((b) => (
                  <div key={b} className="card-premium p-4 flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lateral navigation. On a hub-and-spoke IA the spokes have to link to
          each other, or the only way sideways is back through the menu. */}
      <section className="py-16 border-t border-border/50">
        <div className="section-container">
          <h2 className="text-2xl font-bold mb-8">{t("product.otherModesTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {others.map((other) => {
              const OtherIcon = iconMap[other.icon] || Clock;
              return (
                <Link
                  key={other.id}
                  to={path("productDetail", `/${other.id}`)}
                  className="group card-premium p-6 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <OtherIcon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{t(other.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t(other.subtitleKey)}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    {t("product.viewDetail")}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
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

export default ProductDetail;
