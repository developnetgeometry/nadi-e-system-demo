import { createClient } from "@supabase/supabase-js";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Create Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Get database connection string from environment variable
const dbUrl = Deno.env.get("DATABASE_URL");

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow authenticated requests
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate auth token
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is super_admin (only super_admin should be able to backup database)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.user_type !== "super_admin") {
      return new Response(
        JSON.stringify({
          error: "Unauthorized - requires super_admin privileges",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extract request parameters
    const { includeSchema = true, tables = [] } = await req.json();

    // Generate timestamp for backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupName = `backup-${timestamp}`;

    // Generate a temporary access URL where the backup will be stored
    const { data: bucketData, error: storageError } = await supabase.storage
      .from("database_backups")
      .createSignedUrl(`${backupName}.sql`, 24 * 60 * 60); // 24 hours expiry

    if (storageError) {
      console.error("Storage error:", storageError);
      return new Response(
        JSON.stringify({ error: "Failed to create storage URL for backup" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Since we can't directly run pg_dump in Edge Functions, we'll create a record
    // in a special table that a server-side cronjob will process
    const { data: requestData, error: requestError } = await supabase
      .from("backup_requests")
      .insert([
        {
          requested_by: user.id,
          status: "pending",
          include_schema: includeSchema,
          tables: tables.length > 0 ? tables : null,
          download_url: bucketData.signedUrl,
          file_path: `${backupName}.sql`,
        },
      ])
      .select()
      .single();

    if (requestError) {
      console.error("Request error:", requestError);
      return new Response(
        JSON.stringify({
          error: "Failed to create backup request",
          details: requestError,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Backup request submitted successfully",
        requestId: requestData.id,
        estimatedCompletionTime: "5-10 minutes",
        downloadUrl: bucketData.signedUrl,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
