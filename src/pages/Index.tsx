import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import BenefitsSection from "@/components/BenefitsSection";
import TargetAudienceSection from "@/components/TargetAudienceSection";
import PlatformSection from "@/components/PlatformSection";
import DifferentiatorsSection from "@/components/DifferentiatorsSection";
import SocialProofSection from "@/components/SocialProofSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <TargetAudienceSection />
      <PlatformSection />
      <DifferentiatorsSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
