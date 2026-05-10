import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Instagram, Linkedin } from "lucide-react";
import logoRondaPrive from "@/assets/logo-ronda-prive.png";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const Footer = () => {
  const { t } = useTranslation();
  const { path } = useLocalizedPath();

  const productoLinks = [
    { to: `${path("solutions")}#preorder`, label: t("solutions.preorder.title", "Compra anticipada") },
    { to: `${path("solutions")}#seat`, label: t("solutions.seat.title", "Entrega en asiento") },
    { to: `${path("solutions")}#pickup`, label: t("solutions.pickup.title", "Pickup express") },
  ];

  const solucionesLinks = [
    { to: `${path("industries")}#festivals`, label: t("industries.festivals.title", "Festivales") },
    { to: `${path("industries")}#stadiums`, label: t("industries.stadiums.title", "Estadios") },
    { to: `${path("industries")}#nightclubs`, label: t("industries.nightclubs.title", "Nightclubs") },
    { to: `${path("industries")}#bars`, label: t("industries.bars.title", "Bares y venues") },
  ];

  const empresaLinks = [
    { to: path("events"), label: t("footer.events", "Eventos") },
    { to: path("contact"), label: t("footer.contact", "Contacto") },
  ];

  const contactEmail = "info@rondaprive.com";

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <Link to={path("home")}>
              <img
                src={logoRondaPrive}
                alt="Ronda Privé"
                width={160}
                height={32}
                className="h-8 w-auto"
                style={{ filter: "brightness(0)" }}
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/rondapriveapp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/ronda-prive-app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Producto */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("footer.productTitle")}
            </h3>
            <ul className="space-y-3">
              {productoLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soluciones */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("footer.solutions")}
            </h3>
            <ul className="space-y-3">
              {solucionesLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("footer.contactTitle")}
            </h3>
            <ul className="space-y-3">
              {empresaLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 mt-12 pt-6">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Ronda Priv&eacute;. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
