import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Clock,
  MapPin,
  CheckSquare,
  ChefHat,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoRondaPrive from "@/assets/logo-ronda-prive.png";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { productModes } from "@/data/productModes";
import type { PageKey } from "@/i18n/routes";

/**
 * Menu entries, in the order the sections appear in Home.tsx.
 *
 * Order and coverage both matter. While these were out of order the underline
 * jumped backwards and forwards as the page scrolled. Add a section to the
 * home, add it here too.
 *
 * Three fields drive behaviour:
 *
 * - `route` marks an entry that navigates somewhere instead of scrolling.
 * - `owns` lists the pages that belong to this entry. A menu item is not a URL,
 *   it is a zone of the site: it lights up whenever the visitor is anywhere
 *   inside it, including a child page reached from the footer or from search.
 *   Without this, arriving on a deep page left the whole menu dark.
 * - `hasProductMenu` marks the one entry that opens a dropdown of its children.
 *
 * Contacto is both a route and a scroll target: it opens the contact page, and
 * it lights up when the visitor reaches the home's closing CTA, because that
 * section is the same invitation. The two cases produce different aria-current
 * values — see the link render below.
 *
 * Ids are language-agnostic; only the labels are localized. Module scope keeps
 * the array identity stable so the scroll-spy effect doesn't resubscribe on
 * every render.
 */
const NAV_ENTRIES: ReadonlyArray<{
  id: string;
  labelKey: string;
  route?: PageKey;
  owns?: readonly PageKey[];
  hasProductMenu?: boolean;
}> = [
  { id: "soluciones", labelKey: "navbar.solutions", owns: ["industries"] },
  {
    id: "producto",
    labelKey: "navbar.product",
    // Ownership is wider than the dropdown on purpose: /como-funciona isn't
    // listed there (two of its three tabs duplicate the capability pages), but
    // it is still product territory, so it lights this entry rather than
    // leaving the menu dark. Owning a page and listing it are separate things.
    owns: ["product", "howItWorks"],
    hasProductMenu: true,
  },
  { id: "beneficios", labelKey: "navbar.benefits", owns: ["benefits"] },
  { id: "contacto", labelKey: "navbar.contact", route: "contact" },
];

const SECTION_IDS = NAV_ENTRIES.map((e) => e.id);

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Clock,
  MapPin,
  CheckSquare,
  ChefHat,
};

/** Is `pathname` the given page, or a page nested under it? */
const isInside = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(base + "/");

const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { path } = useLocalizedPath();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [isMobileProductOpen, setIsMobileProductOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const productMenuRef = useRef<HTMLDivElement>(null);
  const productButtonRef = useRef<HTMLButtonElement>(null);

  const homePath = path("home");

  const navItems = NAV_ENTRIES.map((entry) => {
    // Pages this entry owns; the first is its own destination when it has one.
    const ownedPaths = [
      ...(entry.route ? [path(entry.route)] : []),
      ...(entry.owns ?? []).map((key) => path(key)),
    ];
    const isExactMatch = ownedPaths.some((p) => location.pathname === p);
    const isPathMatch = ownedPaths.some((p) => isInside(location.pathname, p));
    const isScrollMatch =
      location.pathname === homePath && activeSection === entry.id;

    return {
      ...entry,
      to: entry.route ? path(entry.route) : `${homePath}#${entry.id}`,
      label: t(entry.labelKey),
      isActive: isPathMatch || isScrollMatch,
      // "page" only when the link really points at the open page. A child page
      // is inside the zone ("true"), and scroll position is a location within
      // the current page rather than a different page.
      current: isExactMatch
        ? ("page" as const)
        : isPathMatch
          ? ("true" as const)
          : isScrollMatch
            ? ("location" as const)
            : undefined,
    };
  });

  // The capabilities and nothing else. A "product overview" row was cut as
  // navigational scaffolding — the hub is already reachable from the footer and
  // from the breadcrumb on every capability page. A "how it works" row was cut
  // because two of that page's three tabs now duplicate these pages.
  const productLinks = productModes.map((mode) => ({
    to: path("productDetail", `/${mode.id}`),
    label: t(mode.titleKey),
    icon: mode.icon,
  }));

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
    setIsProductMenuOpen(false);
    setIsMobileProductOpen(false);
    if (location.pathname !== homePath) {
      setActiveSection("");
    }
  }, [location.pathname, homePath]);

  // Dismiss the dropdown the two ways a disclosure has to be dismissable:
  // a click anywhere outside it, and Escape (which returns focus to the
  // trigger so keyboard users don't lose their place).
  useEffect(() => {
    if (!isProductMenuOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!productMenuRef.current?.contains(e.target as Node)) {
        setIsProductMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsProductMenuOpen(false);
      productButtonRef.current?.focus();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isProductMenuOpen]);

  const desktopLinkClass = (isActive: boolean) =>
    `relative text-sm font-medium transition-colors ${
      isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
    }`;

  const underline = (isActive: boolean) => (
    <span
      aria-hidden
      className={`pointer-events-none absolute -bottom-1.5 left-0 right-0 mx-auto h-[2px] rounded-full bg-primary transition-all duration-300 ease-out ${
        isActive ? "w-full opacity-100" : "w-0 opacity-0"
      }`}
    />
  );

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
            {navItems.map((item) =>
              item.hasProductMenu ? (
                <div
                  key={item.id}
                  ref={productMenuRef}
                  className="relative"
                  onMouseEnter={() => setIsProductMenuOpen(true)}
                  onMouseLeave={() => setIsProductMenuOpen(false)}
                >
                  <button
                    ref={productButtonRef}
                    type="button"
                    aria-expanded={isProductMenuOpen}
                    aria-haspopup="true"
                    aria-controls="product-menu"
                    // Plain "true" rather than the link values: this trigger
                    // doesn't point at a page, it marks the current item of the
                    // menu. Without it this entry would be the only one whose
                    // active state is conveyed by colour alone.
                    aria-current={item.isActive ? "true" : undefined}
                    onClick={() => setIsProductMenuOpen((prev) => !prev)}
                    className={`${desktopLinkClass(item.isActive)} flex items-center gap-1`}
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isProductMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                    {underline(item.isActive)}
                  </button>

                  <div
                    id="product-menu"
                    className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 w-72 transition-all duration-200 ${
                      isProductMenuOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1"
                    }`}
                  >
                    <div className="rounded-2xl border border-border/60 bg-[#F5F0EB] shadow-xl p-2">
                      {productLinks.map((link) => {
                        const Icon = iconMap[link.icon] || Clock;
                        const isCurrent = location.pathname === link.to;
                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            aria-current={isCurrent ? "page" : undefined}
                            onClick={() => setIsProductMenuOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                              isCurrent
                                ? "bg-primary/10 text-foreground font-medium"
                                : "text-foreground/80 hover:bg-primary/5 hover:text-foreground"
                            }`}
                          >
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-primary" />
                            </span>
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={item.current}
                  className={desktopLinkClass(item.isActive)}
                >
                  {item.label}
                  {underline(item.isActive)}
                </Link>
              ),
            )}
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
            aria-expanded={isMobileMenuOpen}
            aria-label={t("navbar.menu")}
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
                const mobileClass = (isActive: boolean) =>
                  `relative py-2 pl-3 transition-colors font-medium border-l-2 ${
                    isActive
                      ? "text-foreground border-primary"
                      : "text-foreground/70 hover:text-foreground border-transparent"
                  }`;

                // On touch a parent that both navigates and reveals children is
                // ambiguous, so Producto is a pure accordion here.
                if (item.hasProductMenu) {
                  return (
                    <div key={item.id}>
                      <button
                        type="button"
                        aria-expanded={isMobileProductOpen}
                        aria-controls="product-menu-mobile"
                        onClick={() => setIsMobileProductOpen((prev) => !prev)}
                        className={`${mobileClass(item.isActive)} w-full flex items-center justify-between pr-3`}
                      >
                        {item.label}
                        <ChevronDown
                          aria-hidden
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isMobileProductOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        id="product-menu-mobile"
                        className={`grid transition-all duration-300 ease-out ${
                          isMobileProductOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="flex flex-col pl-6 pt-1">
                            {productLinks.map((link) => {
                              const isCurrent = location.pathname === link.to;
                              return (
                                <Link
                                  key={link.to}
                                  to={link.to}
                                  aria-current={isCurrent ? "page" : undefined}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={`py-2 text-sm transition-colors ${
                                    isCurrent
                                      ? "text-foreground font-medium"
                                      : "text-foreground/70 hover:text-foreground"
                                  }`}
                                >
                                  {link.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={item.current}
                    className={mobileClass(item.isActive)}
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
