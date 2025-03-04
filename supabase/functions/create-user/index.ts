
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateUserRequest {
  email: string;
  fullName: string;
  userType: string;
  phoneNumber?: string;
  createdBy: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key (admin privileges)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse the request body
    const { email, fullName, userType, phoneNumber, createdBy } = await req.json() as CreateUserRequest;

    // Generate a random password
    const password = crypto.randomUUID();

    // 1. Create the user in Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        full_name: fullName,
        user_type: userType,
      }
    });

    if (authError) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: "Failed to create user" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Update profiles table with additional data if needed
    // (The trigger should have created the basic profile)
    const { error: profileUpdateError } = await supabaseAdmin
      .from("profiles")
      .update({
        phone_number: phoneNumber,
        user_type: userType, // Ensure user_type is set correctly
      })
      .eq("id", authData.user.id);

    if (profileUpdateError) {
      console.error("Profile update error:", profileUpdateError);
      return new Response(
        JSON.stringify({ error: profileUpdateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Update the users table if needed
    const { error: userUpdateError } = await supabaseAdmin
      .from("users")
      .update({
        phone_number: phoneNumber,
        created_by: createdBy,
      })
      .eq("id", authData.user.id);

    if (userUpdateError) {
      console.error("User update error:", userUpdateError);
      return new Response(
        JSON.stringify({ error: userUpdateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Optionally send a password reset email
    // For production, you would typically send a welcome email with a password reset link
    
    console.log("User created successfully:", authData.user.id);

    return new Response(
      JSON.stringify(authData.user),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
