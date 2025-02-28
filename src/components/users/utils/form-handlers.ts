
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
  // We need to use the auth.signUp to properly create a user in the auth schema
  // but we need to preserve the current session
  
  // 1. Store the current session
  const currentSession = localStorage.getItem('session');
  const currentUser = (await supabase.auth.getUser()).data.user;
  
  if (!currentUser) {
    throw new Error("Current user not found. Please log in again.");
  }
  
  try {
    // 2. Create user with auth.signUp
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: crypto.randomUUID(), // Random secure password
      options: {
        data: {
          full_name: data.full_name,
          user_type: data.user_type,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Failed to create user");

    // 3. Update profiles table with additional data if needed
    // (The trigger should have created the basic profile)
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        phone_number: data.phone_number,
        user_type: data.user_type, // Ensure user_type is set correctly
      })
      .eq("id", authData.user.id);

    if (profileUpdateError) throw profileUpdateError;

    // 4. Update the users table if needed
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        phone_number: data.phone_number,
        created_by: currentUser.id,
      })
      .eq("id", authData.user.id);

    if (userUpdateError) throw userUpdateError;

    return authData;
  } finally {
    // 5. Always restore the current session
    if (currentSession) {
      localStorage.setItem('session', currentSession);
      
      // Force a refresh of the auth state
      // This is critical to restore the admin user's session
      await supabase.auth.getSession();
    }
  }
}
