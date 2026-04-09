import HeroSection from "@/components/sections/HeroSection";
import EventosActivos from "@/components/sections/EventosActivos";
import PlataformaSection from "@/components/sections/PlataformaSection";
import DashboardPreview from "@/components/sections/DashboardPreview";
import BenefitsSummary from "@/components/sections/BenefitsSummary";
import StatsBar from "@/components/sections/StatsBar";
import IndustriesPreview from "@/components/sections/IndustriesPreview";
import CTASection from "@/components/sections/CTASection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <EventosActivos />
      <PlataformaSection />
      <DashboardPreview />
      <BenefitsSummary />
      <StatsBar />
      <IndustriesPreview />
      <CTASection />
    </>
  );
};

export default Home;
