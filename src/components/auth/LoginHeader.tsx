import { Link } from "react-router-dom";

export const LoginHeader = () => {
  return (
    <div className="w-full max-w-md mb-8 text-center">
      <Link to="/" className="inline-block">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2563EB] to-[#4F46E5] bg-clip-text text-transparent">
          NADI
        </h1>
      </Link>
    </div>
  );
};