
import { supabase } from "@/lib/supabase";
import { UserFormData } from "../types";
import { Profile } from "@/types/auth";

export async function handleUpdateUser(data: UserFormData, user: Profile) {
  // Update existing user
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      user_type: data.user_type,
      phone_number: data.phone_number,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) throw profileError;

  // Update user table
  const { error: userError } = await supabase
    .from("users")
    .update({
      phone_number: data.phone_number,
      updated_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .eq("id", user.id);

  if (userError) throw userError;
}

export async function handleCreateUser(data: UserFormData) {
  // Store the current user's session
  const currentSession = localStorage.getItem('session');
  
  try {
    // Create new user with admin key to prevent session replacement
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: Math.random().toString(36).slice(-8), // Generate random password
      options: {
        data: {
          full_name: data.full_name, // Add full_name to user metadata
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user?.id) throw new Error("No user ID returned");

    // Check if profile already exists (might have been created by trigger)
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", authData.user.id)
      .single();

    // Only create profile if it doesn't exist
    if (!existingProfile) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.full_name,
        user_type: data.user_type,
        phone_number: data.phone_number,
      });

      if (profileError) throw profileError;
    } else {
      // Profile exists but might need updating
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          user_type: data.user_type,
          phone_number: data.phone_number,
        })
        .eq("id", authData.user.id);

      if (profileUpdateError) throw profileUpdateError;
    }

    // Create user record if it doesn't exist
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", authData.user.id)
      .single();

    if (!existingUser) {
      const { error: userError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: data.email,
        phone_number: data.phone_number,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (userError) throw userError;
    }

    return authData;
  } finally {
    // Restore the current user's session, regardless of what happened
    if (currentSession) {
      localStorage.setItem('session', currentSession);
      
      // Force a refresh of the auth state to ensure we're using the correct session
      const parsedSession = JSON.parse(currentSession);
      if (parsedSession && parsedSession.user) {
        // This ensures the supabase client uses the restored session
        await supabase.auth.getSession();
      }
    }
  }
}
