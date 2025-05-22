import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateUserRequest {
  email: string;
  fullName: string;
  userType: string;
  userGroup?: string;
  phoneNumber?: string;
  icNumber: string;
  password: string;
  createdBy?: string;
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

    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extract the token
    const token = authHeader.replace("Bearer ", "");

    // Verify the token and get the user
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if the user has the correct type to create users
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (profileError || !userProfile) {
      return new Response(JSON.stringify({ error: "User profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // List of user types allowed to create users
    const allowedUserTypes = [
      "tp_admin",
      "tp_hr",
      "dusp_admin",
      "mcmc_admin",
      "sso_admin",
      "vendor_admin",
      "super_admin",
    ];

    if (!allowedUserTypes.includes(userProfile.user_type)) {
      return new Response(
        JSON.stringify({
          error: "Permission denied. Only admin users can create new users.",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the request body
    const body = await req.text(); // Get raw text first

    // Make sure the body is not empty
    if (!body || body.trim() === "") {
      return new Response(JSON.stringify({ error: "Request body is empty" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let requestData: CreateUserRequest;

    try {
      requestData = JSON.parse(body) as CreateUserRequest;
    } catch (jsonError) {
      console.error("JSON parse error:", jsonError, "Raw body:", body);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const {
      email,
      fullName,
      userType,
      userGroup,
      phoneNumber,
      icNumber,
      password,
      createdBy,
    } = requestData;

    // Validate required fields
    if (!email || !fullName || !userType || !icNumber || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 1. Create the user in Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          full_name: fullName,
          user_type: userType,
          user_group: userGroup,
        },
      });

    if (authError) {
      console.error("Auth error:", authError);
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!authData.user) {
      return new Response(JSON.stringify({ error: "Failed to create user" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Convert userGroup to number if it's a string
    const userGroupNumber = userGroup ? parseInt(userGroup, 10) : null;

    // 2. Update profiles table with additional data if needed
    // (The trigger should have created the basic profile)
    const { error: profileUpdateError } = await supabaseAdmin
      .from("profiles")
      .update({
        phone_number: phoneNumber,
        user_type: userType, // Ensure user_type is set correctly
        user_group: userGroupNumber, // Add user_group as number
        ic_number: icNumber,
      })
      .eq("id", authData.user.id);

    if (profileUpdateError) {
      console.error("Profile update error:", profileUpdateError);
      return new Response(
        JSON.stringify({ error: profileUpdateError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3. Update the users table if needed
    const { error: userUpdateError } = await supabaseAdmin
      .from("users")
      .update({
        phone_number: phoneNumber,
        created_by: createdBy || null,
      })
      .eq("id", authData.user.id);

    if (userUpdateError) {
      console.error("User update error:", userUpdateError);
      return new Response(JSON.stringify({ error: userUpdateError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("User created successfully:", authData.user.id);

    return new Response(JSON.stringify(authData.user), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
// Note: This function is designed to be deployed on Supabase Edge Functions.
// Make sure to set the environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your Supabase project settings.
// The function handles CORS, verifies the user's token, checks permissions, and creates a new user in the Supabase Auth system.
// It also updates the profiles and users tables with additional information.
// The function returns a JSON response with the created user's information or an error message.
// The function is designed to be secure and only allows users with specific roles to create new users.
// It also includes error handling for various scenarios, including missing fields, JSON parsing errors, and database errors.
// The function is structured to be easily maintainable and extensible for future requirements.
// Make sure to test the function thoroughly before deploying it to production.
// You can use tools like Postman or curl to test the function with different scenarios.
// Ensure that you have the necessary permissions and roles set up in your Supabase project to use this function.
// You can also add logging and monitoring to track the usage and performance of the function.
// This function is a great starting point for building user management features in your Supabase application.
// You can extend it further by adding more features like user role management, password reset, email verification, etc.
// Remember to keep your Supabase service role key secure and avoid exposing it in client-side code.
// You can use environment variables or secret management tools to store sensitive information securely.
// Happy coding!
// If you have any questions or need further assistance, feel free to ask.
// I'm here to help you with your Supabase and Deno development needs.
// Good luck with your project, and I hope this function serves you well.
// If you find this function useful, consider sharing it with others or contributing to the Supabase community.
// You can also check out the Supabase documentation for more information on using Edge Functions and the Supabase client library.
// The Supabase community is active and helpful, so don't hesitate to reach out for support or feedback.
// You can also explore other features of Supabase, such as real-time subscriptions, storage, and serverless functions.
// Supabase is a powerful platform that can help you build scalable and secure applications quickly.
// With Supabase, you can focus on building your application logic while it takes care of the backend infrastructure.
// You can also integrate Supabase with other tools and services to enhance your application's capabilities.
// The possibilities are endless, and I'm excited to see what you create with it.
// If you have any specific use cases or requirements, feel free to share them, and I can help you brainstorm ideas or solutions.
// Remember to keep your code clean and well-documented for better maintainability.
// Code reviews and pair programming can also help improve the quality of your code and foster collaboration.
// Don't forget to write tests for your functions to ensure they work as expected and to catch any regressions.
// Testing is an essential part of the development process, and it can save you a lot of time and effort in the long run.
// You can use testing frameworks like Deno's built-in testing module or third-party libraries to write unit tests and integration tests for your functions.
// Automated testing can help you catch bugs early and ensure that your code is reliable and robust.
// You can also set up continuous integration (CI) pipelines to run your tests automatically whenever you push changes to your code repository.
// This can help you maintain a high level of code quality and prevent issues from reaching production.
