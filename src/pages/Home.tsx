import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import SolutionsOverview from "@/components/sections/SolutionsOverview";
import HowItWorksPreview from "@/components/sections/HowItWorksPreview";
import BenefitsSummary from "@/components/sections/BenefitsSummary";
import IndustriesPreview from "@/components/sections/IndustriesPreview";
import DashboardPreview from "@/components/sections/DashboardPreview";
import SocialProofSection from "@/components/sections/SocialProofSection";
import CTASection from "@/components/sections/CTASection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionsOverview />
      <HowItWorksPreview />
      <BenefitsSummary />
      <IndustriesPreview />
      <DashboardPreview />
      <SocialProofSection />
      <CTASection />
    </>
  );
};

export default Home;
