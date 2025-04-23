import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-indigo-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">Ready to get started?</span>
          <span className="block text-indigo-600">Join CMMS today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="animate-fade-in"
            >
              Register Now
            </Button>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/login")}
              className="animate-fade-in"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
