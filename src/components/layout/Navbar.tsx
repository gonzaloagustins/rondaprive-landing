import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import logoRondaPrive from "@/assets/logo-ronda-prive.png";
import LanguageSelector from "./LanguageSelector";

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: "/eventos", labelKey: "navbar.events" },
    { to: "/soluciones", labelKey: "navbar.solutions" },
    { to: "/industrias", labelKey: "navbar.industries" },
    { to: "/como-funciona", labelKey: "navbar.howItWorks" },
    { to: "/insights", labelKey: "navbar.insights" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img src={logoRondaPrive} alt="Ronda Privé" className="h-8 w-auto" loading="eager" />
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm transition-colors ${
                  location.pathname === item.to
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSelector />
            <Button variant="gold-outline" size="sm" asChild>
              <Link to="/eventos">{t("navbar.exploreEvents")}</Link>
            </Button>
            <Button variant="gold" size="sm" asChild>
              <Link to="/contacto">{t("navbar.requestDemo")}</Link>
            </Button>
          </div>

          <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`py-2 transition-colors ${
                    location.pathname === item.to
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
              <div className="py-2 border-t border-border/30 mt-2">
                <LanguageSelector variant="mobile" />
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <Button variant="gold-outline" asChild>
                  <Link to="/eventos">{t("navbar.exploreEvents")}</Link>
                </Button>
                <Button variant="gold" asChild>
                  <Link to="/contacto">{t("navbar.requestDemo")}</Link>
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
