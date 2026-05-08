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

  // Order follows the visitor's intent funnel: what is it (Producto) →
  // is it for me (Soluciones) → does it work (Eventos = concrete proof) →
  // why is it good (Beneficios = abstract value) → close (Contacto).
  // Concrete proof (Eventos) intentionally precedes abstract value (Beneficios).
  const navItems = [
    { to: "/#producto", label: "Producto", sectionId: "producto" },
    { to: "/#soluciones", label: "Soluciones", sectionId: "soluciones" },
    { to: "/eventos", label: "Eventos", sectionId: "" },
    { to: "/#beneficios", label: "Beneficios", sectionId: "beneficios" },
    { to: "/contacto", label: "Contacto", sectionId: "" },
  ];

  const sectionIds = navItems.map((i) => i.sectionId).filter(Boolean);

  useEffect(() => {
    let ticking = false;

    const compute = () => {
      setIsScrolled(window.scrollY > 50);

      if (location.pathname !== "/") {
        ticking = false;
        return;
      }

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
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    compute();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      setActiveSection("");
    }
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
              width={160}
              height={32}
              className="h-8 w-auto"
              style={{ filter: "brightness(0)" }}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive =
                item.sectionId
                  ? activeSection === item.sectionId
                  : location.pathname === item.to || location.pathname.startsWith(item.to + '/');
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute -bottom-1.5 left-0 right-0 mx-auto h-[2px] rounded-full bg-primary transition-all duration-300 ease-out ${
                      isActive ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
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
                    : location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative py-2 pl-3 transition-colors font-medium border-l-2 ${
                      isActive
                        ? "text-foreground border-primary"
                        : "text-foreground/70 hover:text-foreground border-transparent"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50">
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
