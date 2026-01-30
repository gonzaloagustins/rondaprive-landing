import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import logoRondaPrive from "@/assets/logo-ronda-prive.png";
import LanguageSelector from "./LanguageSelector";

const Navbar = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const navItems = [
    { href: "#como-funciona", labelKey: "navbar.howItWorks" },
    { href: "#beneficios", labelKey: "navbar.benefits" },
    { href: "#para-quien", labelKey: "navbar.forWho" },
    { href: "#plataforma", labelKey: "navbar.platform" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Scroll spy logic
      const sections = navItems.map(item => item.href.slice(1));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          return;
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50" : ""
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img 
              src={logoRondaPrive} 
              alt="Ronda Privé" 
              className="h-8 w-auto"
              loading="eager"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  activeSection === item.href.slice(1)
                    ? "text-gold font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(item.labelKey)}
              </a>
            ))}
          </nav>

          {/* Language + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector />
            <Button variant="gold" size="default" asChild>
              <a href="#contacto">{t("navbar.requestDemo")}</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`transition-colors py-2 ${
                    activeSection === item.href.slice(1)
                      ? "text-gold font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(item.labelKey)}
                </a>
              ))}
              
              {/* Language selector for mobile */}
              <div className="py-2 border-t border-border/30 mt-2">
                <p className="text-xs text-muted-foreground mb-2">Language</p>
                <LanguageSelector variant="mobile" />
              </div>
              
              <Button variant="gold" className="mt-4" asChild>
                <a href="#contacto" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("navbar.requestDemo")}
                </a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;