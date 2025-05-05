import { LoginFormMember } from "@/components/auth/LoginFormMember";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginFooter } from "@/components/auth/LoginFooter";
import { Link } from "react-router-dom";

const MemberLogin = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-blue-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[center_top_-1px] [mask-image:linear-gradient(0deg,transparent,black)]" />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-md mx-auto">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl"></div>

          <div className="relative bg-white/95 border border-gray-100 p-8 rounded-xl shadow-lg z-10">
            <LoginHeader />

            <div className="mt-8">
              <LoginFormMember />

              {/* <div className="mt-6 text-center text-sm">
                <Link
                  to="/forgot-password"
                  state={{ from: "member-login" }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot your password?
                </Link>
              </div> */}
            </div>

            <LoginFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberLogin;
