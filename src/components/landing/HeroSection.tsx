import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-90" />
      <div className="relative px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:py-32 lg:px-8">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Welcome to CMMS
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-100 sm:max-w-3xl">
          Your comprehensive platform for efficient management and collaboration
        </p>
        <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
          <div className="space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              size="lg"
              className="w-full sm:w-auto animate-fade-in"
              onClick={() => navigate("/login")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
