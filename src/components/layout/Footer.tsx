import { Link } from "react-router-dom";
import logoRondaPrive from "@/assets/logo-ronda-prive.png";

const Footer = () => {
  const productoLinks = [
    { to: "/soluciones#preorder", label: "Compra Anticipada" },
    { to: "/soluciones#seat", label: "Entrega en Asiento" },
    { to: "/soluciones#pickup", label: "Pickup Express" },
  ];

  const solucionesLinks = [
    { to: "/industrias", label: "Festivales" },
    { to: "/industrias", label: "Estadios" },
    { to: "/industrias", label: "Nightclubs" },
    { to: "/industrias", label: "Bares y Venues" },
  ];

  const empresaLinks = [
    { to: "/contacto", label: "Nosotros" },
    { to: "/contacto", label: "Contacto" },
  ];

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
                className="h-8 w-auto"
                style={{ filter: "brightness(0)" }}
                loading="lazy"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Plataforma tecnologica premium para la industria de eventos.
            </p>
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
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 mt-12 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Ronda Priv&eacute;. Todos los
              derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacidad
              </a>
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Términos
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
