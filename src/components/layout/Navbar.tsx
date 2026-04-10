import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoRondaPrive from "@/assets/logo-ronda-prive.png";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const navItems = [
    { to: "/#producto", label: "Producto", sectionId: "producto" },
    { to: "/#soluciones", label: "Soluciones", sectionId: "soluciones" },
    { to: "/#beneficios", label: "Beneficios", sectionId: "beneficios" },
    { to: "/eventos", label: "Eventos", sectionId: "" },
    { to: "/contacto", label: "Contacto", sectionId: "" },
  ];

  const sectionIds = navItems.map((i) => i.sectionId).filter(Boolean);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (location.pathname !== "/") return;

      const offset = 120;
      let current = "";
      let closestTop = -Infinity;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= offset && top > closestTop) {
          closestTop = top;
          current = id;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#F5F0EB]/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img
              src={logoRondaPrive}
              alt="Ronda Privé"
              className="h-8 w-auto"
              style={{ filter: "brightness(0)" }}
              loading="eager"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive =
                item.sectionId
                  ? activeSection === item.sectionId
                  : location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-sm transition-colors font-medium ${
                    isActive
                      ? "text-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/contacto"
              className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium"
            >
              Iniciar sesión
            </Link>
            <Button variant="dark-solid" size="sm" asChild>
              <Link to="/contacto">
                Solicitar Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/50 animate-fade-in bg-[#F5F0EB]">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => {
                const isActive =
                  item.sectionId
                    ? activeSection === item.sectionId
                    : location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`py-2 transition-colors font-medium ${
                      isActive
                        ? "text-foreground"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50">
                <Link
                  to="/contacto"
                  className="py-2 text-foreground/70 hover:text-foreground transition-colors font-medium"
                >
                  Iniciar sesión
                </Link>
                <Button variant="dark-solid" asChild>
                  <Link to="/contacto">
                    Solicitar Demo
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
