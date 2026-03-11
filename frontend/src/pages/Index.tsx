import Hero from "@/components/Hero";
import DriveSection from "@/components/DriveSection";
import NGOSection from "@/components/NGOSection";
import MapSection from "@/components/MapSection";
import ContributorsSection from "@/components/ContributorsSection";
import DonationSection from "@/components/DonationSection";
import SustainabilitySection from "@/components/SustainabilitySection";
import Footer from "@/components/Footer";
import AwarenessSection from "@/components/AwarenessSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header is handled in App.tsx now! */}
      <Hero />
      <DriveSection />
      <NGOSection />
      <MapSection />
      <AwarenessSection />

      <ContributorsSection />
      <DonationSection />
      
      {/* HERE IS THE SECTION YOU ARE LOOKING FOR 👇 */}
      <SustainabilitySection />
      
      <Footer />
    </div>
  );
};

export default Index;