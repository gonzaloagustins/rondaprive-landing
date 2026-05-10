import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const CTASection = () => {
  const { t } = useTranslation();
  const { path } = useLocalizedPath();
  return (
    <section className="py-24">
      <div className="section-container">
        <div className="bg-[#F0EBE3]/50 rounded-3xl py-20 px-8 text-center">
          {/* Label */}
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Zap className="w-4 h-4 text-primary" />
            {t("cta.eyebrow", "Comienza hoy")}
          </span>

          {/* Title */}
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold max-w-3xl mx-auto leading-tight">
            {t("cta.titleStart", "Cada minuto en la fila es")}{" "}
            <span className="relative inline-block">
              {t("cta.titleHighlight", "dinero que no vuelve")}
              <span className="absolute left-0 bottom-1 w-full h-[6px] bg-primary/20 -z-10 rounded-full" />
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            {t("cta.subtitle", "Los venues que sumaron Ronda Privé aumentan sus ventas un 40% promedio. El tuyo puede ser el siguiente.")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button
              variant="dark-solid"
              size="lg"
              className="group rounded-full"
              asChild
            >
              <Link
                to={path("contact")}
                onClick={() =>
                  trackEvent("cta_click", {
                    cta_id: "solicitar_demo",
                    location: "cta_section",
                  })
                }
              >
                {t("navbar.requestDemo")}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="light-outline"
              size="lg"
              className="rounded-full"
              asChild
            >
              <a
                href="mailto:info@rondaprive.com"
                onClick={() =>
                  trackEvent("cta_click", {
                    cta_id: "mailto",
                    location: "cta_section",
                  })
                }
              >
                <Mail className="w-5 h-5" />
                {t("cta.sendEmail", "Mandar un mail")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
