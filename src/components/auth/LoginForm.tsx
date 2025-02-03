import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting login for email:", email);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Authentication error:", authError);
        
        if (authError.message.includes("Invalid login credentials")) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else if (authError.message.includes("Email not confirmed")) {
          toast({
            title: "Email Not Verified",
            description: "Please check your email and verify your account before logging in.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "An error occurred during login. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      if (!authData.user) {
        console.error("No user data returned after successful auth");
        toast({
          title: "Error",
          description: "Unable to retrieve user data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Auth successful, fetching profile...");

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        toast({
          title: "Error",
          description: "Unable to load user profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!profile) {
        console.error("No profile found for user, creating one...");
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: authData.user.email,
              user_type: 'member'
            }
          ]);

        if (createProfileError) {
          console.error("Error creating profile:", createProfileError);
          toast({
            title: "Error",
            description: "Failed to create user profile. Please contact support.",
            variant: "destructive",
          });
          return;
        }
      }

      console.log('Login successful:', { auth: authData, profile });

      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label 
            htmlFor="email"
            className="text-sm font-medium text-gray-700"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label 
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Link 
              to="/forgot-password" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200" 
        size="lg"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Don't have an account?
          </span>
        </div>
      </div>

      <Link 
        to="/register" 
        className="block w-full text-center py-3 px-4 rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
      >
        Create an account
      </Link>
    </form>
  );
};