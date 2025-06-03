
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Extract the token
    const token = authHeader.replace("Bearer ", "");

    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: authError }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Check if the user has admin privileges
    const { data: userProfile } = await supabaseAdmin
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();

    const adminRoles = [
      "tp_admin",
      "tp_hr",
      "dusp_admin",
      "mcmc_admin",
      "sso_admin",
      "vendor_admin",
      "super_admin",
    ];

    if (!userProfile || !adminRoles.includes(userProfile.user_type)) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        { status: 403, headers: corsHeaders }
      );
    }

    // Get the user IDs to delete from the request
    const { userIds } = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "User IDs are required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Delete the users from auth.users
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUsers(userIds);

    if (deleteError) {
      console.error("Error deleting users from auth:", deleteError);
      
      // Fallback: Try to delete from profiles table
      const { error: profilesError } = await supabaseAdmin
        .from("profiles")
        .delete()
        .in("id", userIds);
        
      if (profilesError) {
        return new Response(
          JSON.stringify({ error: "Failed to delete users", details: profilesError }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, deletedCount: userIds.length }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred", details: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
