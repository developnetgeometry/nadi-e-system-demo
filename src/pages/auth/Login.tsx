import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
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
      
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Authentication error:", authError);
        
        // Handle specific error cases
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

      // Then fetch the user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

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
        console.error("No profile found for user");
        toast({
          title: "Error",
          description: "User profile not found. Please contact support.",
          variant: "destructive",
        });
        return;
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline"
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
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;