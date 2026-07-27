import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoRondaPrive from "@/assets/logo-ronda-prive.png";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import LanguageSelector from "@/components/layout/LanguageSelector";

/**
 * Menu entries, in the order the sections appear in Home.tsx.
 *
 * Order and coverage both matter. While these were out of order the underline
 * jumped backwards and forwards as the page scrolled. Add a section to the
 * home, add it here too.
 *
 * `route` marks an entry that navigates somewhere instead of scrolling. Contacto
 * is both: it opens the contact page, and it lights up when the visitor reaches
 * the home's closing CTA, because that section is the same invitation. The two
 * cases produce different aria-current values — see the link render below.
 *
 * Ids are language-agnostic; only the labels are localized. Module scope keeps
 * the array identity stable so the scroll-spy effect doesn't resubscribe on
 * every render.
 */
const NAV_ENTRIES = [
  { id: "soluciones", labelKey: "navbar.solutions" },
  { id: "producto", labelKey: "navbar.product" },
  { id: "beneficios", labelKey: "navbar.benefits" },
  { id: "contacto", labelKey: "navbar.contact", route: "contact" },
] as const;

const SECTION_IDS = NAV_ENTRIES.map((e) => e.id);

const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { path } = useLocalizedPath();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const navItems = NAV_ENTRIES.map((e) => ({
    to: "route" in e ? path(e.route) : `${path("home")}#${e.id}`,
    label: t(e.labelKey),
    sectionId: e.id,
  }));

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

      for (const id of SECTION_IDS) {
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
              const isScrollMatch =
                location.pathname === homePath && activeSection === item.sectionId;
              const isActive = isScrollMatch || isPathMatch;
              // "page" only when the link really points at the open page.
              // Scroll position is a location within it, not a different page.
              const current = isPathMatch ? "page" : isScrollMatch ? "location" : undefined;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={current}
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
                // Same matching as the desktop nav. The `!hash` guard matters:
                // without it every anchor shares the home pathname and the
                // whole menu lights up at once while on the home.
                const [basePath, hash] = item.to.split("#");
                const isPathMatch =
                  !hash &&
                  (location.pathname === basePath ||
                    location.pathname.startsWith(basePath + "/"));
                const isScrollMatch =
                  location.pathname === homePath && activeSection === item.sectionId;
                const isActive = isScrollMatch || isPathMatch;
                const current = isPathMatch ? "page" : isScrollMatch ? "location" : undefined;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={current}
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
