import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />

      <div className="space-y-1 px-4 text-center">
        <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-md border">
          <h2 className="text-2xl font-bold mb-4">UI Components Library</h2>
          <p className="text-muted-foreground mb-6">
            Explore our collection of reusable UI components for your
            application development needs.
          </p>
          <Button asChild>
            <Link to="/ui-components">
              View Components <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <CTASection />
    </div>
  );
};

export default Landing;
