import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoRondaPrive from "@/assets/logo-ronda-prive.png";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import LanguageSelector from "@/components/layout/LanguageSelector";

const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { path } = useLocalizedPath();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // Scroll-spy targets on the home page. Section ids are language-agnostic;
  // labels are localized at render. Cross-page nav uses localized URLs.
  const navItems = [
    { to: path("events"), label: t("navbar.events"), sectionId: "eventos" },
    { to: `${path("home")}#producto`, label: t("navbar.product"), sectionId: "producto" },
    { to: `${path("home")}#beneficios`, label: t("navbar.benefits"), sectionId: "beneficios" },
    { to: `${path("home")}#soluciones`, label: t("navbar.solutions"), sectionId: "soluciones" },
    { to: path("contact"), label: t("navbar.contact"), sectionId: "" },
  ];

  const sectionIds = navItems.map((i) => i.sectionId).filter(Boolean);
  const homePath = path("home");

  useEffect(() => {
    let ticking = false;

    const compute = () => {
      setIsScrolled(window.scrollY > 50);

      if (location.pathname !== homePath) {
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
  }, [location.pathname, homePath]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== homePath) {
      setActiveSection("");
    }
  }, [location.pathname, homePath]);

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
          <Link to={homePath} className="flex items-center">
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
              const [basePath, hash] = item.to.split("#");
              // Hash anchors (e.g. "/en#producto") share the home pathname,
              // so matching by pathname would light them all up at once.
              // Anchors rely on scroll-spy; only dedicated routes match by path.
              const isPathMatch =
                !hash &&
                (location.pathname === basePath ||
                  location.pathname.startsWith(basePath + "/"));
              const isActive =
                (item.sectionId && activeSection === item.sectionId) ||
                isPathMatch;
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
            <LanguageSelector />
            <Button variant="dark-solid" size="sm" asChild>
              <Link to={path("contact")}>
                {t("navbar.requestDemo")}
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
                const basePath = item.to.split("#")[0];
                const isPathMatch =
                  location.pathname === basePath ||
                  location.pathname.startsWith(basePath + "/");
                const isActive =
                  (item.sectionId && activeSection === item.sectionId) ||
                  isPathMatch;
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
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border/50">
                <div className="flex justify-start">
                  <LanguageSelector />
                </div>
                <Button variant="dark-solid" asChild>
                  <Link to={path("contact")}>
                    {t("navbar.requestDemo")}
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
