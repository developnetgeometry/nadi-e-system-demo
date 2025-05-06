import { Link } from "react-router-dom";

export const LoginHeader = () => {
  return (
    <div className="w-full max-w-md mb-8 text-center">
      <Link to="/" className="inline-block">
        <img src="/cmms-logo.png" alt="Logo" className="h-12 mx-auto" />
      </Link>
    </div>
  );
};
