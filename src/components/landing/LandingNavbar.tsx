import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LandingNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white/80 backdrop-blur-md fixed w-full z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-indigo-600">CMMS</span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/member-login")}
              className="flex items-center"
            >
              <User className="mr-2 h-4 w-4" />
              Member Sign In
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="flex items-center"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="flex items-center"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Register
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
