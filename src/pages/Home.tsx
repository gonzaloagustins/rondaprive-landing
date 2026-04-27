import { lazy } from "react";
import HeroSection from "@/components/sections/HeroSection";
import LazySection from "@/components/LazySection";

// Below-the-fold sections are React.lazy + IntersectionObserver gated.
// Their JS chunks won't even start downloading until the user scrolls
// within 300px of each placeholder, keeping the initial load focused
// on HeroSection only.
const EventosActivos = lazy(() => import("@/components/sections/EventosActivos"));
const PlataformaSection = lazy(() => import("@/components/sections/PlataformaSection"));
const DashboardPreview = lazy(() => import("@/components/sections/DashboardPreview"));
const BenefitsSummary = lazy(() => import("@/components/sections/BenefitsSummary"));
const StatsBar = lazy(() => import("@/components/sections/StatsBar"));
const IndustriesPreview = lazy(() => import("@/components/sections/IndustriesPreview"));
const CTASection = lazy(() => import("@/components/sections/CTASection"));

const Home = () => (
  <>
    <HeroSection />
    <div className="py-12 text-center">
      <p className="font-display text-2xl italic text-foreground/70 sm:text-3xl">
        "La plataforma elegida por los recintos que priorizan la experiencia."
      </p>
    </div>
    <LazySection component={EventosActivos} id="eventos" minHeight="600px" />
    <LazySection component={PlataformaSection} id="producto" minHeight="700px" />
    <LazySection component={DashboardPreview} id="dashboard" minHeight="700px" />
    <LazySection component={BenefitsSummary} id="beneficios" minHeight="500px" />
    <LazySection component={StatsBar} minHeight="120px" />
    <LazySection component={IndustriesPreview} id="soluciones" minHeight="500px" />
    <LazySection component={CTASection} minHeight="300px" />
  </>
);

export default Home;
