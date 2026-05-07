import { Link } from "react-router-dom";
import { Instagram, Linkedin } from "lucide-react";
import logoRondaPrive from "@/assets/logo-ronda-prive.png";

const Footer = () => {
  const productoLinks = [
    { to: "/soluciones#preorder", label: "Compra Anticipada" },
    { to: "/soluciones#seat", label: "Entrega en Asiento" },
    { to: "/soluciones#pickup", label: "Pickup Express" },
  ];

  const solucionesLinks = [
    { to: "/industrias#festivals", label: "Festivales" },
    { to: "/industrias#stadiums", label: "Estadios" },
    { to: "/industrias#nightclubs", label: "Nightclubs" },
    { to: "/industrias#bars", label: "Bares y Venues" },
  ];

  const empresaLinks = [
    { to: "/eventos", label: "Eventos activos" },
    { to: "/contacto", label: "Contacto" },
  ];

  const contactEmail = "info@rondaprive.com";

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/">
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
              Plataforma tecnológica premium para eventos y venues.
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
              Producto
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
              Soluciones
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
              Empresa
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
            &copy; {new Date().getFullYear()} Ronda Priv&eacute;. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
