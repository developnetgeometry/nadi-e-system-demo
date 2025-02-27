
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAppSettings } from "@/hooks/use-app-settings";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginFooter } from "@/components/auth/LoginFooter";

export const MemberLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useAppSettings();

  const isMemberLoginEnabled = settings.find(s => s.key === 'member_login_enabled')?.value === 'true';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isMemberLoginEnabled) {
      toast({
        title: "Login Disabled",
        description: "Member login is currently disabled. Please contact an administrator.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("No user data returned");
      }

      // Check if the user is a member
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      if (profile?.user_type !== 'member') {
        throw new Error("Access denied: Member login only");
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "An unexpected error occurred";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password";
      } else if (error.message.includes("Access denied")) {
        errorMessage = "This login is for members only";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isMemberLoginEnabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F4F7FF] via-white to-[#F8F7FF]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Member Login Disabled</h1>
          <p className="text-gray-600">Member login is currently disabled. Please contact an administrator.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-500">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F4F7FF] via-white to-[#F8F7FF]">
      <LoginHeader />
      
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 space-y-6 border border-gray-100">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Member Login
            </h2>
            <p className="text-sm text-gray-600">
              Sign in to access your member account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        <LoginFooter />
      </div>
    </div>
  );
};

export default MemberLogin;
