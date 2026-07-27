import { lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "@/components/sections/HeroSection";
import LazySection from "@/components/LazySection";
import SEO from "@/components/shared/SEO";
import { trackEvent } from "@/lib/analytics";

// Fixed navbar height (h-20 = 80 px) plus a small breathing offset.
const NAVBAR_OFFSET_PX = 96;

// Below-the-fold sections are React.lazy + IntersectionObserver gated.
// Their JS chunks won't even start downloading until the user scrolls
// within 300px of each placeholder, keeping the initial load focused
// on HeroSection only.
const SolucionesSection = lazy(() => import("@/components/sections/SolucionesSection"));
const PlataformaSection = lazy(() => import("@/components/sections/PlataformaSection"));
const DashboardPreview = lazy(() => import("@/components/sections/DashboardPreview"));
const BenefitsSummary = lazy(() => import("@/components/sections/BenefitsSummary"));
const StatsBar = lazy(() => import("@/components/sections/StatsBar"));
const CTASection = lazy(() => import("@/components/sections/CTASection"));

const Home = () => {
  const location = useLocation();

  // Hash navigation (e.g. /#producto from the navbar) doesn't trigger a native
  // browser scroll because react-router uses pushState. We listen for the hash
  // ourselves and scroll to the matching element with a navbar offset. The
  // dependency on location.key (not just hash) so clicking the same anchor
  // twice still re-scrolls.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace(/^#/, "");
    trackEvent("nav_section_click", { section: id });
    const timeout = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      // scrollIntoView + scrollBy uses instant behavior so it works in
      // environments where the global `html { scroll-behavior: smooth }` rule
      // would otherwise be silently dropped (some preview iframes, headless
      // browsers under prefers-reduced-motion).
      el.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
      window.scrollBy({ top: -NAVBAR_OFFSET_PX, behavior: "instant" as ScrollBehavior });
    }, 80);
    return () => clearTimeout(timeout);
  }, [location.key, location.hash]);

  return (
    <>
      <SEO pageKey="home" />
      <HeroSection />
      {/* Straight under the hero on purpose: real sessions average well under a
          minute, so the figures that back the headline have to land inside the
          first screen or most visitors never reach them. */}
      <LazySection component={StatsBar} minHeight="120px" />
      <LazySection component={SolucionesSection} id="soluciones" minHeight="600px" />
      <LazySection component={PlataformaSection} id="producto" minHeight="700px" />
      <LazySection component={DashboardPreview} id="dashboard" minHeight="700px" />
      <LazySection component={BenefitsSummary} id="beneficios" minHeight="500px" />
      {/* id="contacto" so the scroll-spy can light the Contacto menu entry when
          the visitor reaches the closing CTA. */}
      <LazySection component={CTASection} id="contacto" minHeight="300px" />
    </>
  );
};

export default Home;
