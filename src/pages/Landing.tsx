import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold tracking-tighter">
          Welcome to NADI
        </h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Your comprehensive platform for efficient management and collaboration
        </p>
        <div className="space-x-4">
          <Button 
            onClick={() => navigate("/login")}
            size="lg"
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate("/register")}
            variant="outline"
            size="lg"
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;