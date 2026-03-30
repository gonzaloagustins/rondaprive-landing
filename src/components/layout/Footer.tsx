import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logoRondaPrive from "@/assets/logo-ronda-prive.png";

const Footer = () => {
  const { t } = useTranslation();

  const productLinks = [
    { to: "/soluciones", labelKey: "footer.solutions" },
    { to: "/industrias", labelKey: "footer.industries" },
    { to: "/como-funciona", labelKey: "footer.howItWorks" },
    { to: "/beneficios", labelKey: "footer.benefits" },
  ];

  const resourceLinks = [
    { to: "/eventos", labelKey: "footer.events" },
    { to: "/insights", labelKey: "footer.insights" },
    { to: "/faq", labelKey: "footer.faq" },
    { to: "/contacto", labelKey: "footer.contact" },
  ];

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/">
              <img src={logoRondaPrive} alt="Ronda Privé" className="h-8 w-auto" loading="lazy" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              {t("footer.productTitle")}
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              {t("footer.resourcesTitle")}
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              {t("footer.contactTitle")}
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">info@rondaprive.com</p>
              <Link to="/contacto" className="inline-block text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                {t("footer.scheduleDemo")} →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="divider-gold mt-12 mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Ronda Privé. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.privacy")}
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
