import { lazy } from "react";
import HeroSection from "@/components/sections/HeroSection";
import LazySection from "@/components/LazySection";

// Below-the-fold sections are React.lazy + IntersectionObserver gated.
// Their JS chunks won't even start downloading until the user scrolls
// within 300px of each placeholder, keeping the initial load focused
// on HeroSection only.
const LogoBar = lazy(() => import("@/components/sections/LogoBar"));
const StatsBar = lazy(() => import("@/components/sections/StatsBar"));
const PlataformaSection = lazy(() => import("@/components/sections/PlataformaSection"));
const DashboardPreview = lazy(() => import("@/components/sections/DashboardPreview"));
const BenefitsSummary = lazy(() => import("@/components/sections/BenefitsSummary"));
const IndustriesPreview = lazy(() => import("@/components/sections/IndustriesPreview"));
const SocialProofSection = lazy(() => import("@/components/sections/SocialProofSection"));
const FAQSection = lazy(() => import("@/components/sections/FAQSection"));
const CTASection = lazy(() => import("@/components/sections/CTASection"));

const Home = () => (
  <>
    <HeroSection />
    <LazySection component={LogoBar} minHeight="160px" />
    <LazySection component={StatsBar} minHeight="160px" />
    <LazySection component={PlataformaSection} id="producto" minHeight="700px" />
    <LazySection component={DashboardPreview} id="dashboard" minHeight="700px" />
    <LazySection component={BenefitsSummary} id="beneficios" minHeight="500px" />
    <LazySection component={IndustriesPreview} id="soluciones" minHeight="500px" />
    <LazySection component={SocialProofSection} minHeight="400px" />
    <LazySection component={FAQSection} id="faq" minHeight="500px" />
    <LazySection component={CTASection} minHeight="300px" />
  </>
);

export default Home;
