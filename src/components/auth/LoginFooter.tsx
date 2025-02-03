import { Link } from "react-router-dom";

export const LoginFooter = () => {
  return (
    <div className="mt-8 text-center text-sm text-gray-500">
      By signing in, you agree to our{" "}
      <Link to="/terms" className="text-blue-600 hover:underline">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link to="/privacy" className="text-blue-600 hover:underline">
        Privacy Policy
      </Link>
    </div>
  );
};